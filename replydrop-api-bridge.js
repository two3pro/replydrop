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
  let sequence = 0;

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
      default:
        return 15000;
    }
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
    markShipped(tweetId, replyText = "") {
      return call("markShipped", tweetId, replyText);
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
