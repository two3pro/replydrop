(function attachReplyDropFeedbackCore(globalScope) {
  function clampNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizePickupStatus(value, fallback = "pending") {
    const raw = String(value || fallback).trim().toLowerCase();
    return ["pending", "quiet", "picked-up", "author-engaged"].includes(raw) ? raw : fallback;
  }

  function getFeedbackPriority(entry = {}, now = Date.now()) {
    const status = normalizePickupStatus(entry?.pickupStatus, entry?.pickupCheckedAt ? "quiet" : "pending");
    const nextReviewAt = Math.max(0, clampNumber(entry?.pickupNextReviewAt ?? entry?.nextReviewAt, 0));
    const reviewStage = String((entry?.pickupReviewStage ?? entry?.reviewStage) || "").trim().toLowerCase();
    const settled = reviewStage === "settled" || Math.max(0, clampNumber(entry?.pickupSettledAt ?? entry?.settledAt, 0)) > 0;

    if (!settled && nextReviewAt && nextReviewAt <= now) return 5;
    if (status === "author-engaged") return 4;
    if (status === "picked-up") return 3;
    if (status === "quiet") return 2;
    return 1;
  }

  function buildReplyFeedbackPreviewEntries(entries = [], now = Date.now(), options = {}) {
    const limit = Math.max(1, Math.floor(clampNumber(options.limit, 3)));
    return (Array.isArray(entries) ? entries : [])
      .slice()
      .sort((left, right) => (
        getFeedbackPriority(right, now) - getFeedbackPriority(left, now) ||
        clampNumber(right?.timestamp, 0) - clampNumber(left?.timestamp, 0)
      ))
      .slice(0, limit);
  }

  const api = {
    getFeedbackPriority,
    buildReplyFeedbackPreviewEntries
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropFeedbackCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
