(function installReplyDropTrafficMonitor(global) {
  if (!["x.com", "twitter.com"].includes(global.location.hostname)) {
    return;
  }

  const CHANNEL = "replydrop-traffic-v1";
  const GRAPHQL_RE = /\/i\/api\/graphql\//;
  const STORE_KEY = "__ReplyDropTrafficStoreV1";
  const HOOK_KEY = "__ReplyDropTrafficHookedV1";
  const MAX_SNAPSHOTS = 500;

  const store = global[STORE_KEY] || {
    tweets: new Map(),
    updatedAt: 0,
    rateLimit: null
  };
  global[STORE_KEY] = store;

  function toNumber(value, fallback = 0) {
    const numeric = Number.parseInt(String(value ?? "").replace(/,/g, ""), 10);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
  }

  function normalizeTweetId(value) {
    const raw = String(value ?? "").trim();
    return /^\d+$/.test(raw) ? raw : "";
  }

  function normalizeTimestamp(value) {
    const parsed = Date.parse(String(value || ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function getUserHandle(tweet) {
    return String(
      tweet?.core?.user_results?.result?.legacy?.screen_name ||
      tweet?.core?.user_results?.result?.core?.screen_name ||
      ""
    ).replace(/^@/, "").trim();
  }

  function computeTrafficFields(snapshot, now = Date.now()) {
    const createdAt = Number(snapshot.createdAt || 0);
    const ageHours = createdAt > 0 ? Math.max((now - createdAt) / 3600000, 0.1) : 0;
    const views = Number(snapshot.views || 0);
    const likes = Number(snapshot.likes || 0);
    const replies = Number(snapshot.replies || 0);
    const retweets = Number(snapshot.retweets || 0);
    const bookmarks = Number(snapshot.bookmarks || 0);
    const velocityPerHour = ageHours > 0 ? views / ageHours : 0;
    const replyVelocityPerHour = ageHours > 0 ? replies / ageHours : 0;
    const engagementCount = likes + replies + retweets + bookmarks;
    const engagementRate = views > 0 ? engagementCount / views : 0;
    const replyRatio = views > 0 ? replies / views : 0;
    const phase = velocityPerHour >= 10000
      ? "viral"
      : (velocityPerHour >= 1000 ? "trending" : (velocityPerHour >= 220 ? "rising" : "normal"));

    return {
      trafficAgeHours: Math.round(ageHours * 100) / 100,
      trafficVelocityPerHour: Math.round(velocityPerHour),
      trafficReplyVelocityPerHour: Math.round(replyVelocityPerHour * 100) / 100,
      trafficEngagementRate: Math.round(engagementRate * 100000) / 100000,
      trafficReplyRatio: Math.round(replyRatio * 100000) / 100000,
      trafficPhase: phase
    };
  }

  function extractTweetSnapshot(result, capturedAt = Date.now()) {
    const tweet = result?.tweet || result;
    const legacy = tweet?.legacy;
    if (!tweet || !legacy || legacy.promotedMetadata || tweet.promotedMetadata) {
      return null;
    }

    if (legacy.retweeted_status_result?.result) {
      return extractTweetSnapshot(legacy.retweeted_status_result.result, capturedAt);
    }

    const tweetId = normalizeTweetId(legacy.id_str || tweet.rest_id);
    const views = toNumber(tweet.views?.count, 0);
    if (!tweetId || !views || (tweet.views?.state && tweet.views.state !== "EnabledWithCount")) {
      return null;
    }

    const noteText = tweet.note_tweet?.note_tweet_results?.result?.text;
    const authorHandle = getUserHandle(tweet);
    const base = {
      tweetId,
      url: authorHandle ? `https://x.com/${authorHandle}/status/${tweetId}` : `https://x.com/i/status/${tweetId}`,
      authorHandle,
      text: String(noteText || legacy.full_text || "").replace(/\s+/g, " ").trim().slice(0, 560),
      views,
      likes: toNumber(legacy.favorite_count, 0),
      replies: toNumber(legacy.reply_count, 0),
      retweets: toNumber(legacy.retweet_count, 0),
      bookmarks: toNumber(legacy.bookmark_count, 0),
      createdAt: normalizeTimestamp(legacy.created_at),
      trafficCapturedAt: capturedAt,
      trafficSource: "x-graphql"
    };

    return {
      ...base,
      ...computeTrafficFields(base, capturedAt)
    };
  }

  function scanForTweetSnapshots(root) {
    const snapshots = [];

    function visit(node) {
      if (!node || typeof node !== "object") {
        return;
      }

      const result = node.tweet_results?.result;
      if (result) {
        const snapshot = extractTweetSnapshot(result);
        if (snapshot) {
          snapshots.push(snapshot);
        }
      }

      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }

      Object.keys(node).forEach((key) => {
        if (key !== "tweet_results") {
          visit(node[key]);
        }
      });
    }

    visit(root);
    return snapshots;
  }

  function publishSnapshots(snapshots) {
    if (!Array.isArray(snapshots) || !snapshots.length) {
      return;
    }

    const now = Date.now();
    snapshots.forEach((snapshot) => {
      if (!snapshot?.tweetId) {
        return;
      }
      const previous = store.tweets.get(snapshot.tweetId) || {};
      store.tweets.set(snapshot.tweetId, {
        ...previous,
        ...snapshot,
        trafficCapturedAt: snapshot.trafficCapturedAt || now
      });
    });

    while (store.tweets.size > MAX_SNAPSHOTS) {
      const firstKey = store.tweets.keys().next().value;
      store.tweets.delete(firstKey);
    }

    store.updatedAt = now;
    global.postMessage({
      source: CHANNEL,
      type: "traffic-batch",
      tweets: snapshots,
      capturedAt: now
    }, global.location.origin);
  }

  function parseGraphqlPayload(payload) {
    try {
      publishSnapshots(scanForTweetSnapshots(payload));
    } catch (_error) {}
  }

  function reportRateLimit(headers) {
    try {
      const remaining = Number.parseInt(headers.get("x-rate-limit-remaining"), 10);
      const reset = Number.parseInt(headers.get("x-rate-limit-reset"), 10);
      if (!Number.isFinite(remaining)) {
        return;
      }
      store.rateLimit = { remaining, reset: Number.isFinite(reset) ? reset : 0, capturedAt: Date.now() };
      global.postMessage({
        source: CHANNEL,
        type: "rate-limit",
        rateLimit: store.rateLimit
      }, global.location.origin);
    } catch (_error) {}
  }

  function publishCurrentStore() {
    const tweets = Array.from(store.tweets.values());
    if (!tweets.length) {
      return;
    }
    global.postMessage({
      source: CHANNEL,
      type: "traffic-batch",
      tweets,
      capturedAt: Date.now(),
      replay: true
    }, global.location.origin);
  }

  if (!store.listenerBound) {
    store.listenerBound = true;
    global.addEventListener("message", (event) => {
      if (event.source !== global) {
        return;
      }
      const payload = event.data;
      if (payload?.source === CHANNEL && payload.type === "traffic-request") {
        publishCurrentStore();
      }
    });
  }

  if (global[HOOK_KEY]) {
    return;
  }
  global[HOOK_KEY] = true;

  if (typeof global.fetch === "function") {
    const originalFetch = global.fetch;
    global.fetch = async function replyDropTrafficFetch(...args) {
      const response = await originalFetch.apply(this, args);
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
      if (url && GRAPHQL_RE.test(String(url))) {
        reportRateLimit(response.headers);
        response.clone().json().then(parseGraphqlPayload).catch(() => {});
      }
      return response;
    };
  }

  if (global.XMLHttpRequest?.prototype?.open) {
    const originalOpen = global.XMLHttpRequest.prototype.open;
    global.XMLHttpRequest.prototype.open = function replyDropTrafficXhrOpen(method, url, ...rest) {
      if (typeof url === "string" && GRAPHQL_RE.test(url)) {
        this.addEventListener("load", function onReplyDropTrafficXhrLoad() {
          try {
            const remaining = Number.parseInt(this.getResponseHeader("x-rate-limit-remaining"), 10);
            const reset = Number.parseInt(this.getResponseHeader("x-rate-limit-reset"), 10);
            if (Number.isFinite(remaining)) {
              store.rateLimit = { remaining, reset: Number.isFinite(reset) ? reset : 0, capturedAt: Date.now() };
            }
            parseGraphqlPayload(JSON.parse(this.responseText));
          } catch (_error) {}
        });
      }
      return originalOpen.call(this, method, url, ...rest);
    };
  }

  Object.defineProperty(global, "ReplyDropTraffic", {
    value: Object.freeze({
      getSnapshot(tweetId) {
        return store.tweets.get(normalizeTweetId(tweetId)) || null;
      },
      listSnapshots() {
        return Array.from(store.tweets.values());
      }
    }),
    configurable: true,
    enumerable: false,
    writable: false
  });
})(typeof window !== "undefined" ? window : globalThis);

(function attachReplyDropApiBridge(global) {
  if (!["x.com", "twitter.com"].includes(global.location.hostname)) {
    return;
  }

  if (
    global.ReplyDropAPI &&
    typeof global.ReplyDropAPI.getExecutorInbox === "function" &&
    typeof global.ReplyDropAPI.runExecutorAction === "function"
  ) {
    if (!global.ReplyDropExecutor) {
      Object.defineProperty(global, "ReplyDropExecutor", {
        value: global.ReplyDropAPI,
        configurable: true,
        enumerable: false,
        writable: false
      });
    }
    return;
  }

  try {
    delete global.ReplyDropAPI;
  } catch {}
  try {
    delete global.ReplyDropExecutor;
  } catch {}

  const CHANNEL = "replydrop-api-v1";
  const pending = new Map();
  const asyncTickets = new Map();
  const MAX_ASYNC_TICKETS = 64;
  const ASYNC_TICKET_STORAGE_KEY = "__ReplyDropAsyncTicketsV2";
  const ASYNC_HANDOFF_STORAGE_KEY = "__ReplyDropAsyncHandoffsV1";
  const ASYNC_TICKET_MAX_AGE_MS = 30 * 60 * 1000;
  const ASYNC_HANDOFF_MAX_AGE_MS = 2 * 60 * 1000;
  let sequence = 0;
  let asyncSequence = 0;

  function clearPending(id, error, result) {
    const entry = pending.get(id);
    if (!entry) {
      return;
    }

    pending.delete(id);
    global.clearTimeout(entry.timeoutId);
    if (error) {
      entry.reject(new Error(String(error)));
      return;
    }
    entry.resolve(result);
  }

  global.addEventListener("message", (event) => {
    if (event.source !== global) {
      return;
    }

    const payload = event.data;
    if (!payload || payload.source !== CHANNEL || payload.direction !== "response" || !payload.id) {
      return;
    }

    clearPending(payload.id, payload.ok ? null : (payload.error || "replydrop-api-failed"), payload.result);
  });

  function getTimeoutMs(method) {
    switch (String(method || "")) {
      case "runExecutorAction":
        return 125000;
      case "openComposer":
        return 125000;
      case "submitReply":
        return 125000;
      case "refreshReplyPerformance":
        return 125000;
      case "captureReplyPerformance":
        return 125000;
      case "capturePickupSnapshot":
        return 125000;
      case "importReplyLedger":
        return 125000;
      default:
        return 15000;
    }
  }

  function getAsyncTicketStorage() {
    try {
      return global.sessionStorage || null;
    } catch {
      return null;
    }
  }

  function readPersistedAsyncTicketEntries() {
    const storage = getAsyncTicketStorage();
    if (!storage) {
      return [];
    }
    let raw = "";
    try {
      raw = String(storage.getItem(ASYNC_TICKET_STORAGE_KEY) || "");
    } catch {
      raw = "";
    }
    if (!raw) {
      return [];
    }
    let parsed = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    const now = Date.now();
    return (Array.isArray(parsed) ? parsed : [])
      .map((entry) => normalizeAsyncTicketEntry(entry))
      .filter((entry) => entry && now - Number(entry.updatedAt || entry.startedAt || 0) <= ASYNC_TICKET_MAX_AGE_MS);
  }

  function readRecoverableAsyncHandoffs() {
    const storage = getAsyncTicketStorage();
    if (!storage) {
      return [];
    }
    let raw = "";
    try {
      raw = String(storage.getItem(ASYNC_HANDOFF_STORAGE_KEY) || "");
    } catch {
      raw = "";
    }
    if (!raw) {
      return [];
    }
    let parsed = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    const now = Date.now();
    return (Array.isArray(parsed) ? parsed : [])
      .map((entry) => ({
        ticketId: String(entry?.ticketId || "").trim(),
        updatedAt: Number(entry?.updatedAt || entry?.createdAt || 0)
      }))
      .filter((entry) => entry.ticketId && now - Number(entry.updatedAt || 0) <= ASYNC_HANDOFF_MAX_AGE_MS);
  }

  function hasRecoverableAsyncHandoff(ticketId = "") {
    const normalizedTicketId = String(ticketId || "").trim();
    if (!normalizedTicketId) {
      return false;
    }
    return readRecoverableAsyncHandoffs().some((entry) => entry.ticketId === normalizedTicketId);
  }

  function normalizeAsyncTicketEntry(entry = {}) {
    const ticketId = String(entry?.ticketId || "").trim();
    if (!ticketId) {
      return null;
    }
    const startedAt = Number(entry?.startedAt || Date.now());
    const updatedAt = Number(entry?.updatedAt || startedAt || Date.now());
    return {
      ticketId,
      method: String(entry?.method || "").trim(),
      mode: String(entry?.mode || "action").trim() || "action",
      state: String(entry?.state || "pending").trim() || "pending",
      done: Boolean(entry?.done),
      startedAt,
      updatedAt,
      ok: Boolean(entry?.ok),
      result: entry?.result ?? null,
      error: String(entry?.error || "").trim()
    };
  }

  function trimAsyncTickets() {
    const now = Date.now();
    Array.from(asyncTickets.entries()).forEach(([ticketId, entry]) => {
      const updatedAt = Number(entry?.updatedAt || entry?.startedAt || 0);
      if (updatedAt > 0 && now - updatedAt > ASYNC_TICKET_MAX_AGE_MS) {
        asyncTickets.delete(ticketId);
      }
    });
    while (asyncTickets.size > MAX_ASYNC_TICKETS) {
      const oldestKey = asyncTickets.keys().next().value;
      asyncTickets.delete(oldestKey);
    }
  }

  function persistAsyncTickets() {
    const storage = getAsyncTicketStorage();
    if (!storage) {
      return;
    }
    trimAsyncTickets();
    const entries = Array.from(asyncTickets.values())
      .map((entry) => normalizeAsyncTicketEntry(entry))
      .filter(Boolean)
      .sort((left, right) => (
        Number(left.updatedAt || left.startedAt || 0) - Number(right.updatedAt || right.startedAt || 0)
      ));
    try {
      if (!entries.length) {
        storage.removeItem(ASYNC_TICKET_STORAGE_KEY);
        return;
      }
      storage.setItem(ASYNC_TICKET_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Best-effort persistence only.
    }
  }

  function syncAsyncTicketsFromStorage(options = {}) {
    const now = Date.now();
    const reloadRecovery = Boolean(options?.reloadRecovery);
    readPersistedAsyncTicketEntries().forEach((entry) => {
      let normalized = normalizeAsyncTicketEntry(entry);
      if (!normalized) {
        return;
      }
      if (reloadRecovery && !normalized.done) {
        if (hasRecoverableAsyncHandoff(normalized.ticketId)) {
          normalized = {
            ...normalized,
            state: "reloading",
            done: false,
            ok: false,
            updatedAt: Math.max(now, Number(normalized.updatedAt || normalized.startedAt || 0)),
            error: "",
            result: null
          };
        } else {
          normalized = {
            ...normalized,
            state: "rejected",
            done: true,
            ok: false,
            updatedAt: now,
            error: normalized.error || "replydrop-api-document-reloaded",
            result: {
              ok: false,
              reason: "replydrop-api-document-reloaded",
              reasonCode: "replydrop-api-document-reloaded",
              method: normalized.method,
              ticketId: normalized.ticketId
            }
          };
        }
      }
      asyncTickets.set(normalized.ticketId, normalized);
    });
    if (reloadRecovery) {
      persistAsyncTickets();
    } else {
      trimAsyncTickets();
    }
  }

  function recoverPersistedAsyncTickets() {
    syncAsyncTicketsFromStorage({ reloadRecovery: true });
  }

  function call(method, ...args) {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}:${++sequence}`;
      const timeoutId = global.setTimeout(() => {
        clearPending(id, "replydrop-api-timeout");
      }, getTimeoutMs(method));

      pending.set(id, { resolve, reject, timeoutId });
      global.postMessage({
        source: CHANNEL,
        direction: "request",
        id,
        method,
        args
      }, global.location.origin);
    });
  }

  function callAction(method, ...args) {
    return call(method, ...args).catch((error) => ({
      ok: false,
      reason: "replydrop-api-bridge-failed",
      reasonCode: String(error?.message || error || "replydrop-api-bridge-failed"),
      method
    }));
  }

  function pruneAsyncTickets() {
    trimAsyncTickets();
    persistAsyncTickets();
  }

  function createAsyncTicket(method, mode = "call") {
    const ticketId = `replydrop-ticket:${Date.now()}:${++asyncSequence}`;
    const entry = {
      ticketId,
      method: String(method || "").trim(),
      mode: String(mode || "call").trim(),
      state: "pending",
      done: false,
      startedAt: Date.now(),
      updatedAt: Date.now(),
      ok: false,
      result: null,
      error: ""
    };
    asyncTickets.set(ticketId, entry);
    pruneAsyncTickets();
    return entry;
  }

  function updateAsyncTicket(ticketId, patch = {}) {
    const entry = asyncTickets.get(ticketId);
    if (!entry) {
      return null;
    }
    const next = {
      ...entry,
      ...patch,
      updatedAt: Date.now()
    };
    asyncTickets.set(ticketId, next);
    persistAsyncTickets();
    return next;
  }

  function deleteAsyncTicket(ticketId) {
    const normalizedTicketId = String(ticketId || "").trim();
    if (!normalizedTicketId) {
      return false;
    }
    const deleted = asyncTickets.delete(normalizedTicketId);
    if (deleted) {
      persistAsyncTickets();
    }
    return deleted;
  }

  function beginAsyncAction(method, args = []) {
    const entry = createAsyncTicket(method, "action");
    const nextArgs = Array.isArray(args) ? args.slice() : [];
    if (["runExecutorAction", "openComposer", "submitReply"].includes(String(method || "").trim())) {
      const firstArg = nextArgs[0];
      if (firstArg && typeof firstArg === "object" && !Array.isArray(firstArg)) {
        nextArgs[0] = {
          ...firstArg,
          __replyDropAsyncTicketId: entry.ticketId
        };
      } else {
        nextArgs[0] = {
          __replyDropAsyncTicketId: entry.ticketId
        };
      }
    }
    callAction(method, ...nextArgs)
      .then((result) => {
        const normalizedResult = result == null
          ? {
              ok: false,
              reason: "replydrop-api-null-result",
              reasonCode: "replydrop-api-null-result",
              method: entry.method
            }
          : result;
        updateAsyncTicket(entry.ticketId, {
          state: "resolved",
          done: true,
          ok: Boolean(normalizedResult?.ok),
          result: normalizedResult,
          error: normalizedResult?.ok ? "" : String(
            normalizedResult?.reasonCode ||
            normalizedResult?.reason ||
            ""
          )
        });
      })
      .catch((error) => {
        updateAsyncTicket(entry.ticketId, {
          state: "rejected",
          done: true,
          error: String(error?.message || error || "replydrop-api-bridge-failed")
        });
      });
    return {
      ok: true,
      ticketId: entry.ticketId,
      state: entry.state,
      done: entry.done,
      method: entry.method,
      startedAt: entry.startedAt
    };
  }

  function readAsyncAction(ticketId, options = {}) {
    syncAsyncTicketsFromStorage();
    const normalizedTicketId = String(ticketId || "").trim();
    if (!normalizedTicketId) {
      return {
        ok: false,
        reason: "missing-ticket-id"
      };
    }
    const entry = asyncTickets.get(normalizedTicketId);
    if (!entry) {
      return {
        ok: false,
        reason: "ticket-not-found",
        ticketId: normalizedTicketId
      };
    }
    if (options?.consume && entry.done) {
      deleteAsyncTicket(normalizedTicketId);
    }
    return {
      ok: true,
      ticketId: entry.ticketId,
      method: entry.method,
      mode: entry.mode,
      state: entry.state,
      done: Boolean(entry.done),
      startedAt: entry.startedAt,
      updatedAt: entry.updatedAt,
      result: entry.result,
      error: entry.error || ""
    };
  }

  recoverPersistedAsyncTickets();

  const api = Object.freeze({
    getCapabilities() {
      return call("getExecutorCapabilities");
    },
    getExecutorCapabilities() {
      return call("getExecutorCapabilities");
    },
    health() {
      return call("health");
    },
    getCandidates() {
      return call("getCandidates");
    },
    getQueue() {
      return call("getQueue");
    },
    getMediaBundle(tweetId) {
      return call("getMediaBundle", tweetId);
    },
    setMediaSummary(payload = {}) {
      return callAction("setMediaSummary", payload);
    },
    getTrafficSnapshot(tweetIdOrUrl) {
      return call("getTrafficSnapshot", tweetIdOrUrl);
    },
    getDraftTargets(options = {}) {
      return call("getDraftTargets", options);
    },
    getDraftContext(tweetId, options = {}) {
      return call("getDraftContext", tweetId, options);
    },
    setDraftPreview(payload = {}) {
      return callAction("setDraftPreview", payload);
    },
    refreshRecommendations(options = {}) {
      return callAction("refreshRecommendations", options);
    },
    getAgentInbox(options = {}) {
      return call("getAgentInbox", options);
    },
    getExecutorInbox(options = {}) {
      return call("getExecutorInbox", options);
    },
    getCandidateContext(tweetId, options = {}) {
      return call("getCandidateContext", tweetId, options);
    },
    getExecutorContext(tweetId, options = {}) {
      return call("getExecutorContext", tweetId, options);
    },
    getReplySchema() {
      return call("getReplySchema");
    },
    getExecutorSchema() {
      return call("getExecutorSchema");
    },
    getState() {
      return call("getState");
    },
    getReplyLedger(options = {}) {
      return call("getReplyLedger", options);
    },
    exportReplyLedger(options = {}) {
      return call("exportReplyLedger", options);
    },
    importReplyLedger(payload = {}) {
      return call("importReplyLedger", payload);
    },
    getReplyPerformanceReport(options = {}) {
      return call("getReplyPerformanceReport", options);
    },
    capturePickupSnapshot(payload = {}) {
      return callAction("capturePickupSnapshot", payload);
    },
    captureReplyPerformance(payload = {}) {
      return callAction("captureReplyPerformance", payload);
    },
    refreshReplyPerformance(options = {}) {
      return callAction("refreshReplyPerformance", options);
    },
    addToQueue(tweetId) {
      return call("addToQueue", tweetId);
    },
    openComposer(payload = {}) {
      return callAction("openComposer", payload);
    },
    replyFromTimeline(payload = {}) {
      return callAction("replyFromTimeline", payload);
    },
    submitReply(options = {}) {
      return callAction("submitReply", options);
    },
    runExecutorAction(payload = {}) {
      return callAction("runExecutorAction", payload);
    },
    beginOpenComposer(payload = {}) {
      return beginAsyncAction("openComposer", [payload]);
    },
    beginReplyFromTimeline(payload = {}) {
      return beginAsyncAction("replyFromTimeline", [payload]);
    },
    beginSubmitReply(options = {}) {
      return beginAsyncAction("submitReply", [options]);
    },
    beginExecutorAction(payload = {}) {
      return beginAsyncAction("runExecutorAction", [payload]);
    },
    getAsyncAction(ticketId, options = {}) {
      return readAsyncAction(ticketId, options);
    },
    consumeAsyncAction(ticketId) {
      return readAsyncAction(ticketId, { consume: true });
    },
    markShipped(tweetIdOrPayload, replyTextOrMeta = "", meta = {}) {
      return call("markShipped", tweetIdOrPayload, replyTextOrMeta, meta);
    },
    unmarkReplied(tweetIdOrUrl) {
      return call("unmarkReplied", tweetIdOrUrl);
    },
    skipCandidate(tweetId) {
      return call("skipCandidate", tweetId);
    }
  });

  Object.defineProperty(global, "ReplyDropAPI", {
    value: api,
    configurable: true,
    enumerable: false,
    writable: false
  });

  Object.defineProperty(global, "ReplyDropExecutor", {
    value: api,
    configurable: true,
    enumerable: false,
    writable: false
  });
})(typeof window !== "undefined" ? window : globalThis);
