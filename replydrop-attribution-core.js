(function attachReplyDropAttributionCore(globalScope) {
  const QUEUE_STATUSES = ["queued", "completed", "shipped"];
  const PICKUP_STATUSES = ["pending", "quiet", "picked-up", "author-engaged"];
  const PICKUP_REVIEW_STAGES = ["first-check", "follow-up", "settled"];
  const ATTRIBUTION_SLOT_ORDER = ["next", "tonight", "tomorrow"];
  const QUEUE_STATUS_SET = new Set(QUEUE_STATUSES);
  const PICKUP_STATUS_SET = new Set(PICKUP_STATUSES);
  const PICKUP_REVIEW_STAGE_SET = new Set(PICKUP_REVIEW_STAGES);

  function clampNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function uniqueStringList(value) {
    return Array.from(new Set(
      (Array.isArray(value) ? value : [])
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    ));
  }

  function normalizeHandleKey(handle) {
    return String(handle || "")
      .trim()
      .replace(/^@+/, "")
      .toLowerCase()
      .slice(0, 64);
  }

  function normalizeQueueStatus(value, fallback = "queued") {
    const raw = String(value || fallback).trim().toLowerCase();
    return QUEUE_STATUS_SET.has(raw) ? raw : fallback;
  }

  function normalizePickupStatus(value, fallback = "pending") {
    const raw = String(value || fallback).trim().toLowerCase();
    return PICKUP_STATUS_SET.has(raw) ? raw : fallback;
  }

  function normalizePickupReviewStage(value, fallback = "first-check") {
    const raw = String(value || fallback).trim().toLowerCase();
    return PICKUP_REVIEW_STAGE_SET.has(raw) ? raw : fallback;
  }

  function getAttributionReviewKey(entry = {}, now = Date.now()) {
    const checks = Math.max(0, Math.floor(clampNumber(entry.pickupChecks ?? entry.checks, 0)));
    const reviewStage = normalizePickupReviewStage(
      entry.pickupReviewStage ?? entry.reviewStage,
      checks ? "follow-up" : "first-check"
    );
    const nextReviewAt = Math.max(0, clampNumber(entry.pickupNextReviewAt ?? entry.nextReviewAt, 0));
    const settledAt = Math.max(0, clampNumber(entry.pickupSettledAt ?? entry.settledAt, 0));

    if (settledAt || reviewStage === "settled") {
      return "settled";
    }
    if (reviewStage === "first-check") {
      return nextReviewAt > now ? "scheduled-first-check" : "due-first-check";
    }
    return nextReviewAt > now ? "watching" : "due-follow-up";
  }

  function createAttributionRollup(seed = {}) {
    return {
      shipped: 0,
      count: 0,
      queued: 0,
      pickedUp: 0,
      authorEngaged: 0,
      reviewed: 0,
      settled: 0,
      latestTimestamp: 0,
      latestUrl: "",
      candidate: null,
      topics: new Set(),
      lanes: new Set(),
      slotCounts: { next: 0, tonight: 0, tomorrow: 0 },
      ...seed
    };
  }

  function noteAttributionSlot(stats, slot, weight = 1) {
    const key = String(slot || "").trim();
    if (!key || !Object.prototype.hasOwnProperty.call(stats.slotCounts, key)) {
      return;
    }
    stats.slotCounts[key] += weight;
  }

  function finalizeAttributionRollup(stats) {
    const preferredSlot = ATTRIBUTION_SLOT_ORDER
      .slice()
      .sort((left, right) => (
        (Number(stats.slotCounts?.[right] || 0) - Number(stats.slotCounts?.[left] || 0)) ||
        (ATTRIBUTION_SLOT_ORDER.indexOf(left) - ATTRIBUTION_SLOT_ORDER.indexOf(right))
      ))[0] || "";
    return {
      ...stats,
      priority:
        Number(stats.authorEngaged || 0) * 18 +
        Number(stats.pickedUp || 0) * 11 +
        Number(stats.settled || 0) * 8 +
        Number(stats.reviewed || 0) * 5 +
        Number(stats.shipped || 0) * 3 +
        Number(stats.queued || 0),
      preferredSlot: Number(stats.slotCounts?.[preferredSlot] || 0) > 0 ? preferredSlot : "",
      preferredSlotWeight: Number(stats.slotCounts?.[preferredSlot] || 0)
    };
  }

  function getAttributionPreferredSlot(...stats) {
    return stats
      .filter((stat) => stat?.preferredSlot)
      .sort((left, right) => (
        Number(right.preferredSlotWeight || 0) - Number(left.preferredSlotWeight || 0) ||
        Number(right.priority || 0) - Number(left.priority || 0)
      ))[0]?.preferredSlot || "";
  }

  function pickTopTopicStat(topicStats = []) {
    return topicStats
      .filter(Boolean)
      .sort((left, right) => (
        Number(right.priority || 0) - Number(left.priority || 0) ||
        Number(right.authorEngaged || 0) - Number(left.authorEngaged || 0) ||
        Number(right.pickedUp || 0) - Number(left.pickedUp || 0)
      ))[0] || null;
  }

  function sortAttributionRollups(stats = []) {
    return (Array.isArray(stats) ? stats : [])
      .filter(Boolean)
      .sort((left, right) => (
        Number(right.priority || 0) - Number(left.priority || 0) ||
        Number(right.authorEngaged || 0) - Number(left.authorEngaged || 0) ||
        Number(right.pickedUp || 0) - Number(left.pickedUp || 0) ||
        Number(right.settled || 0) - Number(left.settled || 0) ||
        Number(right.reviewed || 0) - Number(left.reviewed || 0) ||
        Number(right.shipped || 0) - Number(left.shipped || 0) ||
        Number(right.queued || 0) - Number(left.queued || 0) ||
        Number(right.latestTimestamp || 0) - Number(left.latestTimestamp || 0)
      ));
  }

  function hasStrongAttributionSignal(stat = {}) {
    return Boolean(
      Number(stat.authorEngaged || 0) > 0 ||
      Number(stat.pickedUp || 0) > 0 ||
      Number(stat.reviewed || 0) > 0 ||
      Number(stat.settled || 0) > 0 ||
      (Number(stat.shipped || 0) + Number(stat.queued || 0)) >= 2
    );
  }

  function getAttributionInsightScore(kind, stat = {}) {
    const kindWeight = kind === "handle" ? 3 : kind === "topic" ? 2 : 1;
    return (
      Number(stat.priority || 0) * 10 +
      Number(stat.authorEngaged || 0) * 30 +
      Number(stat.pickedUp || 0) * 18 +
      Number(stat.settled || 0) * 14 +
      Number(stat.reviewed || 0) * 9 +
      Number(stat.shipped || 0) * 6 +
      Number(stat.queued || 0) * 3 +
      kindWeight
    );
  }

  function buildAttributionInsightTargets(model = null, options = {}) {
    if (!model) {
      return [];
    }

    const limit = Math.max(1, Math.floor(clampNumber(options.limit, 2)));
    const topHandle = sortAttributionRollups(Array.from(model.handles?.values?.() || []))[0] || null;
    const topTopic = sortAttributionRollups(Array.from(model.topics?.values?.() || []))[0] || null;
    const topLane = sortAttributionRollups(Array.from(model.lanes?.values?.() || []))[0] || null;

    return [
      topHandle ? { kind: "handle", stat: topHandle } : null,
      topTopic ? { kind: "topic", stat: topTopic } : null,
      topLane ? { kind: "lane", stat: topLane } : null
    ]
      .filter((item) => item && hasStrongAttributionSignal(item.stat))
      .sort((left, right) => (
        getAttributionInsightScore(right.kind, right.stat) - getAttributionInsightScore(left.kind, left.stat) ||
        Number(right.stat?.latestTimestamp || 0) - Number(left.stat?.latestTimestamp || 0)
      ))
      .slice(0, limit);
  }

  function buildAttributionSignalModel(replyEntries = [], queueItems = [], candidates = [], options = {}) {
    const now = Math.max(0, clampNumber(options.now, Date.now()));
    const handles = new Map();
    const topics = new Map();
    const lanes = new Map();
    const candidateByHandle = new Map(
      (Array.isArray(candidates) ? candidates : [])
        .map((candidate) => [normalizeHandleKey(candidate?.authorHandle), candidate])
        .filter(([handleKey, candidate]) => Boolean(handleKey && candidate))
    );
    const candidateByTopic = new Map();

    (Array.isArray(candidates) ? candidates : []).forEach((candidate) => {
      uniqueStringList(candidate?.matchedTopics).forEach((topicKey) => {
        if (!candidateByTopic.has(topicKey)) {
          candidateByTopic.set(topicKey, candidate);
        }
      });
    });

    (Array.isArray(replyEntries) ? replyEntries : []).forEach((entry) => {
      const handle = String(entry?.authorHandle || "").trim();
      const handleKey = normalizeHandleKey(handle);
      const pickupStatus = normalizePickupStatus(entry?.pickupStatus, entry?.pickupCheckedAt ? "quiet" : "pending");
      const reviewKey = getAttributionReviewKey(entry, now);
      const reviewed = Math.max(0, Math.floor(clampNumber(entry?.pickupChecks, 0))) > 0 ? 1 : 0;
      const settled = reviewKey === "settled" ? 1 : 0;
      const pickedUp = pickupStatus === "picked-up" || pickupStatus === "author-engaged" ? 1 : 0;
      const authorEngaged = pickupStatus === "author-engaged" ? 1 : 0;

      if (handleKey) {
        const stat = handles.get(handleKey) || createAttributionRollup({
          handle,
          latestUrl: entry?.url || "",
          candidate: candidateByHandle.get(handleKey) || null
        });
        stat.shipped += 1;
        stat.count += 1;
        stat.reviewed += reviewed;
        stat.settled += settled;
        stat.pickedUp += pickedUp;
        stat.authorEngaged += authorEngaged;
        stat.latestTimestamp = Math.max(stat.latestTimestamp, clampNumber(entry?.timestamp, 0));
        stat.latestUrl = entry?.url || stat.latestUrl;
        stat.candidate = stat.candidate || candidateByHandle.get(handleKey) || null;
        uniqueStringList(entry?.matchedTopics).forEach((topic) => stat.topics.add(topic));
        if (entry?.lane) {
          stat.lanes.add(entry.lane);
        }
        noteAttributionSlot(stat, entry?.slot, 1.2);
        handles.set(handleKey, stat);
      }

      uniqueStringList(entry?.matchedTopics).forEach((topicKey) => {
        const stat = topics.get(topicKey) || createAttributionRollup({
          key: topicKey,
          candidate: candidateByTopic.get(topicKey) || null
        });
        stat.shipped += 1;
        stat.reviewed += reviewed;
        stat.settled += settled;
        stat.pickedUp += pickedUp;
        stat.authorEngaged += authorEngaged;
        stat.latestTimestamp = Math.max(stat.latestTimestamp, clampNumber(entry?.timestamp, 0));
        stat.candidate = stat.candidate || candidateByTopic.get(topicKey) || null;
        noteAttributionSlot(stat, entry?.slot, 1.2);
        topics.set(topicKey, stat);
      });

      if (entry?.lane) {
        const stat = lanes.get(entry.lane) || createAttributionRollup({ lane: entry.lane });
        stat.shipped += 1;
        stat.reviewed += reviewed;
        stat.settled += settled;
        stat.pickedUp += pickedUp;
        stat.authorEngaged += authorEngaged;
        stat.latestTimestamp = Math.max(stat.latestTimestamp, clampNumber(entry?.timestamp, 0));
        noteAttributionSlot(stat, entry?.slot, 1.2);
        lanes.set(entry.lane, stat);
      }
    });

    (Array.isArray(queueItems) ? queueItems : []).forEach((item) => {
      if (normalizeQueueStatus(item?.status) !== "queued") {
        return;
      }

      const handle = String(item?.authorHandle || "").trim();
      const handleKey = normalizeHandleKey(handle);
      if (handleKey) {
        const stat = handles.get(handleKey) || createAttributionRollup({
          handle,
          latestUrl: item?.url || "",
          candidate: candidateByHandle.get(handleKey) || null
        });
        stat.queued += 1;
        stat.candidate = stat.candidate || candidateByHandle.get(handleKey) || null;
        uniqueStringList(item?.matchedTopics).forEach((topic) => stat.topics.add(topic));
        if (item?.lane) {
          stat.lanes.add(item.lane);
        }
        noteAttributionSlot(stat, item?.slot, 0.45);
        handles.set(handleKey, stat);
      }

      uniqueStringList(item?.matchedTopics).forEach((topicKey) => {
        const stat = topics.get(topicKey) || createAttributionRollup({
          key: topicKey,
          candidate: candidateByTopic.get(topicKey) || null
        });
        stat.queued += 1;
        stat.candidate = stat.candidate || candidateByTopic.get(topicKey) || null;
        noteAttributionSlot(stat, item?.slot, 0.45);
        topics.set(topicKey, stat);
      });

      if (item?.lane) {
        const stat = lanes.get(item.lane) || createAttributionRollup({ lane: item.lane });
        stat.queued += 1;
        noteAttributionSlot(stat, item?.slot, 0.45);
        lanes.set(item.lane, stat);
      }
    });

    return {
      handles: new Map(Array.from(handles.entries()).map(([key, stat]) => [key, finalizeAttributionRollup(stat)])),
      topics: new Map(Array.from(topics.entries()).map(([key, stat]) => [key, finalizeAttributionRollup(stat)])),
      lanes: new Map(Array.from(lanes.entries()).map(([key, stat]) => [key, finalizeAttributionRollup(stat)]))
    };
  }

  function summarizeCandidateAttribution(candidate, model = null) {
    if (!candidate || !model) {
      return null;
    }

    const handleStat = model.handles?.get(normalizeHandleKey(candidate.authorHandle)) || null;
    const topicStat = pickTopTopicStat(
      uniqueStringList(candidate.matchedTopics).map((topicKey) => model.topics?.get(topicKey) || null)
    );

    const priority = Math.round(
      Number(handleStat?.priority || 0) * 1.15 +
      Number(topicStat?.priority || 0) * 0.85
    );
    const preferredSlot = getAttributionPreferredSlot(handleStat, topicStat);
    const shipped = Number(handleStat?.shipped || handleStat?.count || 0) + Number(topicStat?.shipped || 0);
    const reviewed = Number(handleStat?.reviewed || 0) + Number(topicStat?.reviewed || 0);
    const settled = Number(handleStat?.settled || 0) + Number(topicStat?.settled || 0);
    const pickedUp = Number(handleStat?.pickedUp || 0) + Number(topicStat?.pickedUp || 0);
    const authorEngaged = Number(handleStat?.authorEngaged || 0) + Number(topicStat?.authorEngaged || 0);

    if (!priority || (!authorEngaged && !pickedUp && !reviewed && !settled && shipped < 2)) {
      return null;
    }

    let kind = "reviewed-memory";
    if (handleStat?.authorEngaged) {
      kind = "author-engaged";
    } else if (handleStat?.pickedUp) {
      kind = "handle-picked-up";
    } else if (topicStat?.authorEngaged || topicStat?.pickedUp) {
      kind = "topic-validated";
    }

    return {
      kind,
      priority,
      preferredSlot,
      handleStat,
      topicStat,
      topicKey: topicStat?.key || "",
      shipped,
      reviewed,
      settled,
      pickedUp,
      authorEngaged
    };
  }

  function getCandidateAttributionBoost(candidate, model = null) {
    const summary = summarizeCandidateAttribution(candidate, model);
    if (!summary) {
      return 0;
    }

    let boost = Math.max(1, Math.round(Number(summary.priority || 0) / 6));
    if (summary.kind === "author-engaged") {
      boost += 10;
    } else if (summary.kind === "handle-picked-up") {
      boost += 7;
    } else if (summary.kind === "topic-validated") {
      boost += 5;
    } else {
      boost += 3;
    }
    return boost;
  }

  function sortCandidatesByAttribution(candidates = [], model = null) {
    return (Array.isArray(candidates) ? candidates : [])
      .map((candidate, index) => ({
        candidate,
        index,
        boost: getCandidateAttributionBoost(candidate, model)
      }))
      .sort((left, right) => (
        Number(right.boost || 0) - Number(left.boost || 0) ||
        left.index - right.index
      ))
      .map(({ candidate, boost }) => ({
        ...candidate,
        attributionBoost: boost
      }));
  }

  function getDefaultQueueSlot(laneDefault, attributionSignal = null) {
    const preferredSlot = String(attributionSignal?.preferredSlot || "").trim();
    const priority = Number(attributionSignal?.priority || 0);
    if (!preferredSlot) {
      return laneDefault;
    }
    if (laneDefault === "next") {
      return preferredSlot === "tomorrow" ? "next" : preferredSlot;
    }
    if (preferredSlot === "next" && priority >= 14) {
      return "next";
    }
    if (preferredSlot === "tonight" && priority >= 9) {
      return "tonight";
    }
    return laneDefault;
  }

  const api = {
    ATTRIBUTION_SLOT_ORDER,
    createAttributionRollup,
    noteAttributionSlot,
    finalizeAttributionRollup,
    getAttributionPreferredSlot,
    sortAttributionRollups,
    buildAttributionInsightTargets,
    buildAttributionSignalModel,
    getCandidateAttributionBoost,
    sortCandidatesByAttribution,
    summarizeCandidateAttribution,
    getDefaultQueueSlot
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropAttributionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
