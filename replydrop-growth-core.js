(function attachReplyDropGrowthCore(globalScope) {
  const PICKUP_STATUSES = ["pending", "quiet", "picked-up", "author-engaged"];
  const PICKUP_REVIEW_STAGES = ["first-check", "follow-up", "settled"];
  const PICKUP_STATUS_SET = new Set(PICKUP_STATUSES);
  const PICKUP_REVIEW_STAGE_SET = new Set(PICKUP_REVIEW_STAGES);

  let workflowCore = globalScope.ReplyDropWorkflowCore || null;
  if (!workflowCore && typeof require === "function") {
    try {
      workflowCore = require("./replydrop-workflow-core.js");
    } catch {
      workflowCore = null;
    }
  }

  function clampNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizePickupStatus(value, fallback = "pending") {
    const raw = String(value || fallback).trim().toLowerCase();
    return PICKUP_STATUS_SET.has(raw) ? raw : fallback;
  }

  function normalizePickupReviewStage(value, fallback = "first-check") {
    const raw = String(value || fallback).trim().toLowerCase();
    return PICKUP_REVIEW_STAGE_SET.has(raw) ? raw : fallback;
  }

  function normalizeQueueStatus(value, fallback = "queued") {
    if (typeof workflowCore?.normalizeQueueStatus === "function") {
      return workflowCore.normalizeQueueStatus(value, fallback);
    }
    const raw = String(value || fallback).trim().toLowerCase();
    return ["queued", "completed", "shipped"].includes(raw) ? raw : fallback;
  }

  function getPublishWatchEffectiveStatus(item, now = Date.now()) {
    if (typeof workflowCore?.getPublishWatchEffectiveStatus === "function") {
      return workflowCore.getPublishWatchEffectiveStatus(item, now);
    }
    const status = String(item?.status || "composer-ready").trim().toLowerCase();
    if (status === "snoozed") {
      return clampNumber(item?.snoozeUntil, 0) > now ? "snoozed" : "composer-ready";
    }
    if (status === "cooldown") {
      return clampNumber(item?.cooldownUntil, 0) > now ? "cooldown" : "composer-ready";
    }
    return ["composer-ready", "post-opened", "failed", "cooldown", "snoozed"].includes(status) ? status : "composer-ready";
  }

  function getPublishWatchLifecycleCounts(items = [], now = Date.now()) {
    if (typeof workflowCore?.getPublishWatchLifecycleCounts === "function") {
      return workflowCore.getPublishWatchLifecycleCounts(items, now);
    }
    return (Array.isArray(items) ? items : []).reduce((counts, item) => {
      const effective = getPublishWatchEffectiveStatus(item, now);
      counts.total += 1;
      if (effective === "failed") counts.failed += 1;
      else if (effective === "post-opened") counts.partial += 1;
      else if (effective === "composer-ready") counts.ready += 1;
      else if (effective === "cooldown") counts.cooling += 1;
      else if (effective === "snoozed") counts.snoozed += 1;
      return counts;
    }, {
      total: 0,
      ready: 0,
      partial: 0,
      failed: 0,
      cooling: 0,
      snoozed: 0
    });
  }

  function getPublishWatchSortScore(item, now = Date.now()) {
    if (typeof workflowCore?.getPublishWatchSortScore === "function") {
      return workflowCore.getPublishWatchSortScore(item, now);
    }
    const effective = getPublishWatchEffectiveStatus(item, now);
    if (effective === "failed") return 5;
    if (effective === "post-opened") return 4;
    if (effective === "composer-ready") return 3;
    if (effective === "cooldown") return 2;
    if (effective === "snoozed") return 1;
    return 0;
  }

  function getQueueExecutionKey(item, now = Date.now()) {
    const status = normalizeQueueStatus(item?.status);
    if (status === "shipped") {
      return "shipped";
    }
    if (status === "completed") {
      return "completed";
    }

    const scheduledFor = clampNumber(item?.scheduledFor, 0);
    if (!scheduledFor) {
      return "queued";
    }

    const delta = scheduledFor - now;
    if (delta < -15 * 60 * 1000) {
      return "overdue";
    }
    if (delta <= 20 * 60 * 1000) {
      return "due-soon";
    }
    return "queued";
  }

  function getQueueLifecycleCounts(queueItems = [], options = {}) {
    const now = clampNumber(options?.now, Date.now());
    const publishWatchItems = Array.isArray(options?.publishWatchItems) ? options.publishWatchItems : [];
    const publishWatchSet = new Set(publishWatchItems.map((item) => String(item?.url || "").trim()).filter(Boolean));
    return (Array.isArray(queueItems) ? queueItems : []).reduce((counts, item) => {
      const normalizedStatus = normalizeQueueStatus(item?.status);
      const executionKey = getQueueExecutionKey(item, now);
      if (normalizedStatus === "queued") {
        counts.live += 1;
        if (publishWatchSet.has(String(item?.url || "").trim())) {
          counts.awaiting += 1;
        }
      }
      if (executionKey === "queued") {
        counts.staged += 1;
      } else if (executionKey === "due-soon") {
        counts.dueSoon += 1;
        counts.action += 1;
      } else if (executionKey === "overdue") {
        counts.overdue += 1;
        counts.action += 1;
      } else if (executionKey === "completed") {
        counts.completed += 1;
        counts.done += 1;
      } else if (executionKey === "shipped") {
        counts.shipped += 1;
        counts.done += 1;
      }
      return counts;
    }, {
      live: 0,
      staged: 0,
      action: 0,
      dueSoon: 0,
      overdue: 0,
      completed: 0,
      shipped: 0,
      awaiting: 0,
      done: 0
    });
  }

  function getPickupLifecycleCounts(pickupItems = []) {
    return (Array.isArray(pickupItems) ? pickupItems : []).reduce((counts, item) => {
      const status = normalizePickupStatus(item?.status, item?.lastCheckedAt ? "quiet" : "pending");
      counts.total += 1;
      counts.checked += item?.lastCheckedAt ? 1 : 0;
      if (status === "pending") counts.pending += 1;
      else if (status === "quiet") counts.quiet += 1;
      else if (status === "picked-up") counts.pickedUp += 1;
      else if (status === "author-engaged") counts.authorEngaged += 1;
      return counts;
    }, {
      total: 0,
      checked: 0,
      pending: 0,
      quiet: 0,
      pickedUp: 0,
      authorEngaged: 0
    });
  }

  function getPickupReviewBucket(item, now = Date.now()) {
    const checks = Math.max(0, Math.floor(clampNumber(item?.pickupChecks ?? item?.checks, item?.lastCheckedAt ? 1 : 0)));
    const reviewStage = normalizePickupReviewStage(item?.pickupReviewStage ?? item?.reviewStage, checks ? "follow-up" : "first-check");
    const nextReviewAt = Math.max(0, clampNumber(item?.pickupNextReviewAt ?? item?.nextReviewAt, 0));
    const settledAt = Math.max(0, clampNumber(item?.pickupSettledAt ?? item?.settledAt, 0));
    if (settledAt || reviewStage === "settled") {
      return "settled";
    }
    if (!nextReviewAt) {
      return checks ? "watching" : "due";
    }
    return nextReviewAt <= now ? "due" : "watching";
  }

  function getPickupReviewCounts(pickupItems = [], now = Date.now()) {
    return (Array.isArray(pickupItems) ? pickupItems : []).reduce((counts, item) => {
      const bucket = getPickupReviewBucket(item, now);
      counts.total += 1;
      if (bucket === "due") counts.due += 1;
      else if (bucket === "watching") counts.watching += 1;
      else if (bucket === "settled") counts.settled += 1;
      return counts;
    }, {
      total: 0,
      due: 0,
      watching: 0,
      settled: 0
    });
  }

  function getPriorityPublishWatchItem(items = [], now = Date.now()) {
    return (Array.isArray(items) ? items : [])
      .slice()
      .sort((left, right) => (
        getPublishWatchSortScore(right, now) - getPublishWatchSortScore(left, now) ||
        clampNumber(left?.handedOffAt ?? left?.updatedAt, 0) - clampNumber(right?.handedOffAt ?? right?.updatedAt, 0) ||
        clampNumber(right?.attempts, 0) - clampNumber(left?.attempts, 0)
      ))[0] || null;
  }

  function buildGrowthSnapshot(input = {}) {
    const now = clampNumber(input?.now, Date.now());
    const repliesToday = Math.max(0, Math.floor(clampNumber(input?.repliesToday, 0)));
    const visibleCandidates = Math.max(0, Math.floor(clampNumber(input?.visibleCandidates, 0)));
    const actionableCandidates = Math.max(0, Math.floor(clampNumber(input?.actionableCandidates, 0)));
    const queueCounts = getQueueLifecycleCounts(input?.queueItems, { now, publishWatchItems: input?.publishWatchItems });
    const pickupCounts = getPickupLifecycleCounts(input?.pickupItems);
    const publishCounts = getPublishWatchLifecycleCounts(input?.publishWatchItems, now);
    const reviewCounts = getPickupReviewCounts(input?.pickupItems, now);
    const operatorPressure = queueCounts.action + publishCounts.ready + publishCounts.partial + publishCounts.failed + reviewCounts.due;
    const settledCoverage = pickupCounts.total ? Math.round((reviewCounts.settled / pickupCounts.total) * 100) : 0;
    const checkedCoverage = pickupCounts.total ? Math.round((pickupCounts.checked / pickupCounts.total) * 100) : 0;
    return {
      repliesToday,
      visibleCandidates,
      actionableCandidates,
      queueCounts,
      pickupCounts,
      publishCounts,
      reviewCounts,
      operatorPressure,
      settledCoverage,
      checkedCoverage
    };
  }

  function buildCompactGrowthMetrics(input = {}) {
    const snapshot = buildGrowthSnapshot(input);
    const needsActionCount = snapshot.queueCounts.action + snapshot.publishCounts.failed;
    const baseItems = [
      {
        key: "repliesToday",
        value: snapshot.repliesToday,
        tone: "accent"
      },
      {
        key: "liveQueue",
        value: snapshot.queueCounts.live,
        tone: snapshot.queueCounts.live ? "accent" : "soft"
      }
    ];
    const optionalItems = [
      {
        key: "needsAction",
        value: needsActionCount,
        tone: needsActionCount ? "warning" : "soft",
        overdueCount: snapshot.queueCounts.overdue,
        failedCount: snapshot.publishCounts.failed
      },
      {
        key: "awaitingConfirm",
        value: snapshot.queueCounts.awaiting,
        tone: snapshot.queueCounts.awaiting ? "warning" : "soft"
      },
      {
        key: "pickupDue",
        value: snapshot.reviewCounts.due,
        tone: snapshot.reviewCounts.due ? "warning" : "soft"
      },
      {
        key: "pickedUp",
        value: snapshot.pickupCounts.pickedUp + snapshot.pickupCounts.authorEngaged,
        tone: (snapshot.pickupCounts.pickedUp || snapshot.pickupCounts.authorEngaged) ? "success" : "soft",
        authorBackCount: snapshot.pickupCounts.authorEngaged
      }
    ]
      .filter((item) => Number(item.value || 0) > 0)
      .slice(0, 3);

    return baseItems.concat(optionalItems);
  }

  function buildGrowthTruthItems(input = {}) {
    const snapshot = buildGrowthSnapshot(input);
    const toCloseCount = (snapshot.publishCounts.ready || 0) + (snapshot.publishCounts.partial || 0) + (snapshot.publishCounts.failed || 0);

    return [
      {
        key: "toClose",
        value: toCloseCount,
        tone: snapshot.operatorPressure ? "warning" : "soft"
      },
      {
        key: "authorBack",
        value: snapshot.pickupCounts.authorEngaged || 0,
        tone: snapshot.pickupCounts.authorEngaged ? "success" : "soft"
      },
      {
        key: "settled",
        value: snapshot.reviewCounts.settled || 0,
        tone: snapshot.reviewCounts.settled ? "success" : "soft"
      },
      {
        key: "reviewCoverage",
        value: snapshot.checkedCoverage,
        format: "percent",
        tone: snapshot.checkedCoverage >= 70 ? "success" : snapshot.checkedCoverage > 0 ? "accent" : "soft"
      }
    ];
  }

  const api = {
    PICKUP_STATUSES,
    PICKUP_REVIEW_STAGES,
    normalizePickupStatus,
    normalizePickupReviewStage,
    getQueueExecutionKey,
    getQueueLifecycleCounts,
    getPickupLifecycleCounts,
    getPickupReviewBucket,
    getPickupReviewCounts,
    getPriorityPublishWatchItem,
    buildGrowthSnapshot,
    buildCompactGrowthMetrics,
    buildGrowthTruthItems
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropGrowthCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
