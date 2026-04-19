(function attachReplyDropQueueCore(globalScope) {
  let workflowCore = globalScope.ReplyDropWorkflowCore || null;
  if (!workflowCore && typeof require === "function") {
    try {
      workflowCore = require("./replydrop-workflow-core.js");
    } catch {
      workflowCore = null;
    }
  }

  function clampNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeQueueStatus(value, fallback = "queued") {
    if (typeof workflowCore?.normalizeQueueStatus === "function") {
      return workflowCore.normalizeQueueStatus(value, fallback);
    }
    const raw = String(value || fallback).trim().toLowerCase();
    return ["queued", "completed", "shipped"].includes(raw) ? raw : fallback;
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

  function filterQueueItems(queueItems = [], filterKey = "all", now = Date.now()) {
    const items = Array.isArray(queueItems) ? queueItems : [];
    switch (String(filterKey || "all").trim()) {
      case "action":
        return items.filter((item) => {
          const executionKey = getQueueExecutionKey(item, now);
          return executionKey === "due-soon" || executionKey === "overdue";
        });
      case "live":
        return items.filter((item) => normalizeQueueStatus(item?.status) === "queued");
      case "done":
        return items.filter((item) => normalizeQueueStatus(item?.status) !== "queued");
      case "all":
      default:
        return items.slice();
    }
  }

  function buildQueuePreviewItems(queueItems = [], filterKey = "all", now = Date.now(), options = {}) {
    const filtered = filterQueueItems(queueItems, filterKey, now);
    const rawLimit = String(filterKey || "all").trim() === "action" ? 4 : 3;
    const limit = Math.max(1, Math.floor(clampNumber(options.limit, rawLimit)));
    return filtered.slice(0, limit);
  }

  const api = {
    getQueueExecutionKey,
    filterQueueItems,
    buildQueuePreviewItems
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropQueueCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
