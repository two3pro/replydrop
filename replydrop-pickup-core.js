(function attachReplyDropPickupCore(globalScope) {
  const PICKUP_STATUSES = ["pending", "quiet", "picked-up", "author-engaged"];
  const PICKUP_REVIEW_STAGES = ["first-check", "follow-up", "settled"];
  const PICKUP_STATUS_SET = new Set(PICKUP_STATUSES);
  const PICKUP_REVIEW_STAGE_SET = new Set(PICKUP_REVIEW_STAGES);
  const FIRST_PICKUP_REVIEW_DELAY_MS = 45 * 60 * 1000;
  const QUIET_PICKUP_REVIEW_DELAY_MS = 3 * 60 * 60 * 1000;
  const ACTIVE_PICKUP_REVIEW_DELAY_MS = 6 * 60 * 60 * 1000;
  const SETTLE_PICKUP_AFTER_MS = 24 * 60 * 60 * 1000;

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

  function buildPickupReviewPlan(config = {}) {
    const shippedAt = Math.max(0, clampNumber(config.shippedAt, 0));
    const checkedAt = Math.max(0, clampNumber(config.checkedAt, 0));
    const checks = Math.max(0, Math.floor(clampNumber(config.checks, 0)));
    const explicitNextReviewAt = Math.max(0, clampNumber(config.nextReviewAt, 0));
    const explicitSettledAt = Math.max(0, clampNumber(config.settledAt, 0));
    const status = normalizePickupStatus(config.status, checks ? "quiet" : "pending");
    const reviewStage = normalizePickupReviewStage(config.reviewStage, checks ? "follow-up" : "first-check");

    if (explicitSettledAt || reviewStage === "settled" || status === "author-engaged") {
      return {
        reviewStage: "settled",
        nextReviewAt: 0,
        settledAt: explicitSettledAt || checkedAt || shippedAt || Date.now()
      };
    }

    if (!checks || status === "pending") {
      return {
        reviewStage: "first-check",
        nextReviewAt: explicitNextReviewAt || (shippedAt ? shippedAt + FIRST_PICKUP_REVIEW_DELAY_MS : 0),
        settledAt: 0
      };
    }

    const elapsedSinceShip = shippedAt && checkedAt ? Math.max(0, checkedAt - shippedAt) : 0;
    if (checks >= 2 || elapsedSinceShip >= SETTLE_PICKUP_AFTER_MS) {
      return {
        reviewStage: "settled",
        nextReviewAt: 0,
        settledAt: checkedAt || shippedAt || Date.now()
      };
    }

    const delayMs = status === "picked-up" ? ACTIVE_PICKUP_REVIEW_DELAY_MS : QUIET_PICKUP_REVIEW_DELAY_MS;
    const reviewBase = checkedAt || shippedAt || Date.now();
    return {
      reviewStage: "follow-up",
      nextReviewAt: explicitNextReviewAt || (reviewBase + delayMs),
      settledAt: 0
    };
  }

  function buildFreshPickupReviewState(config = {}) {
    const shippedAt = Math.max(0, clampNumber(config.shippedAt, 0));
    const reviewPlan = buildPickupReviewPlan({
      shippedAt,
      checkedAt: 0,
      checks: 0,
      status: "pending",
      reviewStage: "first-check",
      nextReviewAt: 0,
      settledAt: 0
    });

    return {
      status: "pending",
      checkedAt: 0,
      checks: 0,
      reviewStage: reviewPlan.reviewStage,
      nextReviewAt: reviewPlan.nextReviewAt,
      settledAt: reviewPlan.settledAt
    };
  }

  function resolvePickupSnapshotStatus(snapshot = {}) {
    if (snapshot.authorEngaged || snapshot.authorReplyUrl) {
      return "author-engaged";
    }

    const deltaReplies = clampNumber(snapshot.deltaReplies, 0);
    const deltaLikes = clampNumber(snapshot.deltaLikes, 0);
    const deltaViews = clampNumber(snapshot.deltaViews, 0);
    if (deltaReplies >= 2 || deltaLikes >= 8 || deltaViews >= 120) {
      return "picked-up";
    }
    return "quiet";
  }

  const api = {
    PICKUP_STATUSES,
    PICKUP_REVIEW_STAGES,
    FIRST_PICKUP_REVIEW_DELAY_MS,
    QUIET_PICKUP_REVIEW_DELAY_MS,
    ACTIVE_PICKUP_REVIEW_DELAY_MS,
    SETTLE_PICKUP_AFTER_MS,
    normalizePickupStatus,
    normalizePickupReviewStage,
    buildPickupReviewPlan,
    buildFreshPickupReviewState,
    resolvePickupSnapshotStatus
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropPickupCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
