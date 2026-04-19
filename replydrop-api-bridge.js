(function attachReplyDropApiBridge(global) {
  if (global.location.hostname !== "x.com" || global.ReplyDropAPI) {
    return;
  }

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

  function call(method, ...args) {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}:${++sequence}`;
      const timeoutId = global.setTimeout(() => {
        clearPending(id, "replydrop-api-timeout");
      }, 15000);

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

  const api = Object.freeze({
    getCandidates() {
      return call("getCandidates");
    },
    getQueue() {
      return call("getQueue");
    },
    getState() {
      return call("getState");
    },
    addToQueue(tweetId) {
      return call("addToQueue", tweetId);
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
})(typeof window !== "undefined" ? window : globalThis);
