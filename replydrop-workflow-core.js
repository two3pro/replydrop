(function attachReplyDropWorkflowCore(globalScope) {
  const QUEUE_STATUSES = ["queued", "completed", "shipped"];
  const PUBLISH_WATCH_STATUSES = ["composer-ready", "post-opened", "cooldown", "failed", "snoozed"];
  const QUEUE_STATUS_SET = new Set(QUEUE_STATUSES);
  const PUBLISH_WATCH_STATUS_SET = new Set(PUBLISH_WATCH_STATUSES);

  function clampNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeQueueStatus(value, fallback = "queued") {
    const raw = String(value || fallback).trim().toLowerCase();
    return QUEUE_STATUS_SET.has(raw) ? raw : fallback;
  }

  function compareReplyQueueItems(left, right) {
    const leftStatus = normalizeQueueStatus(left?.status);
    const rightStatus = normalizeQueueStatus(right?.status);
    const leftClosed = leftStatus !== "queued";
    const rightClosed = rightStatus !== "queued";

    if (leftClosed !== rightClosed) {
      return Number(leftClosed) - Number(rightClosed);
    }

    if (!leftClosed) {
      return (
        clampNumber(left?.scheduledFor, 0) - clampNumber(right?.scheduledFor, 0) ||
        clampNumber(right?.score, 0) - clampNumber(left?.score, 0) ||
        clampNumber(right?.createdAt, 0) - clampNumber(left?.createdAt, 0)
      );
    }

    return (
      clampNumber(right?.completedAt, 0) - clampNumber(left?.completedAt, 0) ||
      clampNumber(right?.createdAt, 0) - clampNumber(left?.createdAt, 0)
    );
  }

  function normalizePublishWatchStatus(value, fallback = "composer-ready") {
    const raw = String(value || fallback).trim().toLowerCase();
    return PUBLISH_WATCH_STATUS_SET.has(raw) ? raw : fallback;
  }

  function getPublishWatchAgeMs(item, now = Date.now()) {
    return Math.max(0, now - clampNumber(item?.handedOffAt ?? item?.lastAttemptAt ?? item?.updatedAt, now));
  }

  function getPublishWatchEffectiveStatus(item, now = Date.now()) {
    if (!item) {
      return "composer-ready";
    }
    const status = normalizePublishWatchStatus(item.status, "composer-ready");
    const attempts = Math.max(1, Math.floor(clampNumber(item?.attempts, 1)));
    const ageMs = getPublishWatchAgeMs(item, now);
    if (status === "snoozed") {
      return clampNumber(item.snoozeUntil, 0) > now ? "snoozed" : "composer-ready";
    }
    if (status === "cooldown") {
      return clampNumber(item.cooldownUntil, 0) > now ? "cooldown" : "composer-ready";
    }
    if (status === "post-opened" && ageMs >= 12 * 60 * 1000) {
      return "failed";
    }
    if (status === "composer-ready" && attempts >= 2 && ageMs >= 18 * 60 * 1000) {
      return "failed";
    }
    return status;
  }

  function sanitizePublishWatchState(item = {}, now = Date.now()) {
    const effectiveStatus = getPublishWatchEffectiveStatus(item, now);
    return {
      ...item,
      status: effectiveStatus,
      attempts: Math.max(1, Math.floor(clampNumber(item.attempts, 1))),
      snoozeUntil: effectiveStatus === "snoozed" ? Math.max(0, clampNumber(item.snoozeUntil, 0)) : 0,
      cooldownUntil: effectiveStatus === "cooldown" ? Math.max(0, clampNumber(item.cooldownUntil, 0)) : 0
    };
  }

  function getPublishWatchSortScore(item, now = Date.now()) {
    const effective = getPublishWatchEffectiveStatus(item, now);
    if (effective === "failed") return 5;
    if (effective === "post-opened") return 4;
    if (effective === "composer-ready") return 3;
    if (effective === "cooldown") return 2;
    if (effective === "snoozed") return 1;
    return 0;
  }

  function getPublishWatchLifecycleCounts(items = [], now = Date.now()) {
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

  const api = {
    QUEUE_STATUSES,
    PUBLISH_WATCH_STATUSES,
    normalizeQueueStatus,
    compareReplyQueueItems,
    normalizePublishWatchStatus,
    getPublishWatchAgeMs,
    getPublishWatchEffectiveStatus,
    sanitizePublishWatchState,
    getPublishWatchSortScore,
    getPublishWatchLifecycleCounts
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropWorkflowCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
