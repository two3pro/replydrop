(function attachReplyDropFocusCore(globalScope) {
  const DEFAULT_CANDIDATE_PREVIEW_LIMIT = 6;

  function clampNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizePreviewLimit(value, fallback = DEFAULT_CANDIDATE_PREVIEW_LIMIT) {
    return Math.max(1, Math.floor(clampNumber(value, fallback)));
  }

  function buildFocusDigestItems(input = {}) {
    const candidateCount = Math.max(0, Math.floor(clampNumber(input.candidateCount, 0)));
    const queueCount = Math.max(0, Math.floor(clampNumber(input.queueCount, 0)));
    const reviewDueCount = Math.max(0, Math.floor(clampNumber(input.reviewDueCount, 0)));
    const hotCount = Math.max(0, Math.floor(clampNumber(input.hotCount, 0)));
    const dismissedCount = Math.max(0, Math.floor(clampNumber(input.dismissedCount, 0)));
    const handle = String(input?.focusCandidate?.authorHandle || "").trim().replace(/^@+/, "");
    const items = [
      {
        key: "lead",
        value: handle ? `@${handle}` : "",
        tone: handle ? "accent" : "soft",
        emptyTone: "soft"
      },
      {
        key: "candidates",
        value: candidateCount,
        tone: candidateCount ? "soft" : "warning"
      },
      {
        key: "queue",
        value: queueCount,
        tone: queueCount ? "accent" : "soft"
      },
      {
        key: "pickupDue",
        value: reviewDueCount,
        tone: reviewDueCount ? "warning" : "soft"
      }
    ];

    if (hotCount > 0) {
      items.push({
        key: "hotWindow",
        value: hotCount,
        tone: "success"
      });
    }

    if (dismissedCount > 0) {
      items.push({
        key: "dismissed",
        value: dismissedCount,
        tone: "warning"
      });
    }

    return items;
  }

  function buildCandidatePreviewItems(candidates = [], focusCandidate = null, options = {}) {
    const limit = normalizePreviewLimit(options.limit, DEFAULT_CANDIDATE_PREVIEW_LIMIT);
    const focusUrl = String(options.focusUrl || focusCandidate?.url || "").trim();
    const items = (Array.isArray(candidates) ? candidates : [])
      .filter((candidate) => candidate && String(candidate.url || "").trim())
      .filter((candidate) => String(candidate.url || "").trim() !== focusUrl);

    return items.slice(0, limit);
  }

  const api = {
    buildFocusDigestItems,
    buildCandidatePreviewItems
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropFocusCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
