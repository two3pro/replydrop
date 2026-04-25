(function initContent(global) {
  const SCAN_DEBOUNCE_MS = 180;
  const BADGE_CLASS = "xrs-score-badge";
  const BADGE_LABEL_CLASS = "xrs-score-label";
  const BADGE_ANCHOR_CLASS = "xrs-badge-anchor";
  const FLOAT_WIDGET_ID = "xrs-floating-widget";
  const FLOAT_BUTTON_CLASS = "xrs-floating-button";
  const FLOAT_COUNT_CLASS = "xrs-floating-count";
  const FLOAT_PANEL_ID = "xrs-floating-panel";
  const STYLE_ID = "xrs-extension-style";
  const API_BRIDGE_CHANNEL = "replydrop-api-v1";
  const TRAFFIC_CHANNEL = "replydrop-traffic-v1";
  const ARTICLE_SELECTOR = '[data-testid="tweet"]';
  const REPLY_BUTTON_TEXT = ["reply", "replying", "replies", "回覆", "回复"];
  const REPLY_CONTEXT_TEXT = ["replying to", "回覆對象", "回复对象", "回覆", "回复"];
  const DEFAULT_EXECUTOR_SEND_FLOOR = 54;
  const EXECUTOR_EMPTY_INBOX_MIN_RESCANS = 3;
  const EXECUTOR_TARGET_GOAL_MS = 90 * 1000;
  const EXECUTOR_TARGET_TIMEOUT_MS = 120 * 1000;
  const EXECUTOR_TARGET_TIMEOUT_TTL_MS = 10 * 60 * 1000;
  const HANDOFF_RETRY_DELAY_MS = 420;
  const REPLY_OPEN_FAILURE_TTL_MS = 15000;
  const SUCCESS_TEXTS = [
    "your reply was sent",
    "your post was sent",
    "reply sent",
    "post sent",
    "回复已发送",
    "回覆已發送",
    "贴文已发送",
    "貼文已發送",
    "已发布",
    "已發佈",
    "已发送",
    "已發送"
  ];
  const FAILURE_TEXTS = [
    "try again",
    "failed to send",
    "wasn't sent",
    "not sent",
    "发送失败",
    "發送失敗",
    "发布失败",
    "發佈失敗",
    "something went wrong"
  ];
  const REPLY_REASON_LABELS = Object.freeze({
    "context-not-locked": "上下文未锁定",
    "thread-identity-conflict": "主帖识别冲突",
    "already-replied": "已回复过",
    "send-not-verified": "发送后未验证到",
    "value-dropped-on-open": "打开后价值已下降",
    "value-below-send-floor": "回复价值低于自动发送线",
    "reply-context-missing": "回复上下文缺失",
    "generic-composer-opened": "误打开普通发帖框",
    "reply-target-lost": "回复目标已丢失",
    "send-button-disabled-but-target-locked": "回复框已锁定但发送按钮仍不可用",
    "target-timeout": "单条回复超过120秒"
  });
  const DROP_PATH = "M10 1.25C10 1.25 3 9.12 3 14.56C3 19.03 6.13 22.5 10 22.5C13.87 22.5 17 19.03 17 14.56C17 9.12 10 1.25 10 1.25Z";
  const DROP_SVG = `
    <svg class="xrs-drop-svg" viewBox="0 0 20 24" aria-hidden="true" focusable="false">
      <path class="xrs-drop-aura" d="${DROP_PATH}"></path>
      <path class="xrs-drop-shell" d="${DROP_PATH}"></path>
      <path class="xrs-drop-core" d="${DROP_PATH}"></path>
      <path class="xrs-drop-rim" d="${DROP_PATH}"></path>
      <ellipse class="xrs-drop-highlight-main" cx="6.55" cy="14.8" rx="1.95" ry="6.25" transform="rotate(10 6.55 14.8)"></ellipse>
      <ellipse class="xrs-drop-highlight-tip" cx="12.2" cy="7.1" rx="0.92" ry="4.1" transform="rotate(17 12.2 7.1)"></ellipse>
    </svg>
  `;
  const FLOAT_DROP_SVG = `
    <svg class="xrs-float-drop-svg" viewBox="0 0 20 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="xrs-float-drop-clip">
          <path d="${DROP_PATH}"></path>
        </clipPath>
        <radialGradient id="xrs-float-aura-gradient" cx="50%" cy="74%" r="62%">
          <stop offset="0%" stop-color="#d9fcff" stop-opacity="0.88"></stop>
          <stop offset="52%" stop-color="#5ae9ff" stop-opacity="0.4"></stop>
          <stop offset="100%" stop-color="#4f9bff" stop-opacity="0"></stop>
        </radialGradient>
        <linearGradient id="xrs-float-shell-gradient" x1="24%" y1="6%" x2="83%" y2="92%">
          <stop offset="0%" stop-color="#f4feff"></stop>
          <stop offset="24%" stop-color="#aff6ff"></stop>
          <stop offset="58%" stop-color="#67daff"></stop>
          <stop offset="100%" stop-color="#3870ff"></stop>
        </linearGradient>
        <radialGradient id="xrs-float-core-gradient" cx="50%" cy="78%" r="58%">
          <stop offset="0%" stop-color="#ffffff"></stop>
          <stop offset="36%" stop-color="#effeff"></stop>
          <stop offset="72%" stop-color="#9df9ff"></stop>
          <stop offset="100%" stop-color="#5ed2ff" stop-opacity="0.82"></stop>
        </radialGradient>
        <linearGradient id="xrs-float-rim-gradient" x1="22%" y1="9%" x2="82%" y2="86%">
          <stop offset="0%" stop-color="#ffffff"></stop>
          <stop offset="52%" stop-color="#a8ecff"></stop>
          <stop offset="100%" stop-color="#e4fdff"></stop>
        </linearGradient>
      </defs>
      <ellipse class="xrs-float-drop-aura" cx="10" cy="16.4" rx="7.4" ry="6.4" fill="url(#xrs-float-aura-gradient)"></ellipse>
      <path class="xrs-float-drop-shell" d="${DROP_PATH}" fill="url(#xrs-float-shell-gradient)"></path>
      <g clip-path="url(#xrs-float-drop-clip)">
        <path class="xrs-float-drop-core" d="${DROP_PATH}" fill="url(#xrs-float-core-gradient)"></path>
        <ellipse class="xrs-float-drop-highlight-main" cx="6.45" cy="15.15" rx="1.95" ry="6.8" transform="rotate(10 6.45 15.15)"></ellipse>
        <ellipse class="xrs-float-drop-highlight-tip" cx="11.82" cy="7.46" rx="0.68" ry="2.84" transform="rotate(13 11.82 7.46)"></ellipse>
        <ellipse class="xrs-float-drop-shine" cx="10.4" cy="17.2" rx="4.7" ry="4.15"></ellipse>
      </g>
      <path class="xrs-float-drop-rim" d="${DROP_PATH}" fill="none" stroke="url(#xrs-float-rim-gradient)" stroke-width="1.12"></path>
    </svg>
  `;

  const state = {
    settings: { ...(global.XReplyScorer?.defaults || {}) },
    repliedTweets: {},
    repliedTweetUrls: new Set(),
    dismissedTweets: {},
    dismissedTweetUrls: new Set(),
    replyDetails: {},
    replyQueue: [],
    relationshipStates: {},
    trafficByTweetId: {},
    trafficUpdatedAt: 0,
    recentCandidates: [],
    observer: null,
    scanTimer: null,
    lazyRescanTimer: null,
    lastSentAt: 0,
    lastDomChangeAt: 0,
    currentUserHandle: "",
    pendingReplyTargetUrl: "",
    pendingReplyStartedAt: 0,
    pendingReplyMeta: null,
    executorReplyTargetUrl: "",
    executorReplyTargetStartedAt: 0,
    timedOutReplyTargets: {},
    lastReplyOpenFailure: null,
    pendingReplyOutcomeUrl: "",
    pendingReplyOutcomeTimer: null,
    apiSubmitInFlightTargetUrl: "",
    stats: {
      scannedCount: 0,
      highScoreCount: 0,
      visibleCount: 0
    },
    apiBridgeBound: false,
    trafficBridgeBound: false
  };

  function sendRuntimeMessage(message, timeoutMs = 3500) {
    return new Promise((resolve) => {
      let settled = false;
      const timer = global.setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(null);
      }, timeoutMs);
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (settled) {
            return;
          }
          settled = true;
          global.clearTimeout(timer);
          if (chrome.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve(response || null);
        });
      } catch (_error) {
        if (settled) {
          return;
        }
        settled = true;
        global.clearTimeout(timer);
        resolve(null);
      }
    });
  }

  function canExposeReplyDropApi() {
    return global.location.hostname === "x.com";
  }

  function postReplyDropApiResponse(payload) {
    global.postMessage({
      source: API_BRIDGE_CHANNEL,
      direction: "response",
      ...payload
    }, global.location.origin);
  }

  function sendRuntimeApiMessage(message, timeoutMs = 3500) {
    return new Promise((resolve) => {
      let settled = false;
      const timer = global.setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        resolve({
          ok: false,
          error: "runtime-message-timeout"
        });
      }, timeoutMs);
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (settled) {
            return;
          }
          settled = true;
          global.clearTimeout(timer);
          if (chrome.runtime.lastError) {
            resolve({
              ok: false,
              error: String(chrome.runtime.lastError.message || chrome.runtime.lastError)
            });
            return;
          }

          resolve(response || {
            ok: false,
            error: "empty-api-response"
          });
        });
      } catch (error) {
        if (settled) {
          return;
        }
        settled = true;
        global.clearTimeout(timer);
        resolve({
          ok: false,
          error: String(error?.message || error)
        });
      }
    });
  }

  function normalizeApiTweetId(tweetId) {
    const raw = String(tweetId ?? "").trim();
    return /^\d+$/.test(raw) ? raw : "";
  }

  function extractTweetIdFromUrl(url) {
    const normalized = normalizeTweetUrl(url);
    const match = normalized.match(/\/status\/(\d+)(?:$|[/?#])/);
    return match?.[1] || "";
  }

  function toNonNegativeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
  }

  function normalizeTrafficPhase(value) {
    const phase = String(value || "").trim().toLowerCase();
    return ["viral", "trending", "rising", "normal"].includes(phase) ? phase : "";
  }

  function normalizeTrafficSnapshot(snapshot = {}) {
    const tweetId = normalizeApiTweetId(snapshot.tweetId || extractTweetIdFromUrl(snapshot.url));
    if (!tweetId) {
      return null;
    }

    const capturedAt = toNonNegativeNumber(snapshot.trafficCapturedAt || snapshot.capturedAt, Date.now());
    return {
      tweetId,
      url: normalizeTweetUrl(snapshot.url) || "",
      authorHandle: String(snapshot.authorHandle || "").replace(/^@/, "").trim(),
      text: String(snapshot.text || "").replace(/\s+/g, " ").trim().slice(0, 560),
      views: toNonNegativeNumber(snapshot.views, 0),
      likes: toNonNegativeNumber(snapshot.likes, 0),
      replies: toNonNegativeNumber(snapshot.replies, 0),
      retweets: toNonNegativeNumber(snapshot.retweets, 0),
      bookmarks: toNonNegativeNumber(snapshot.bookmarks, 0),
      createdAt: toNonNegativeNumber(snapshot.createdAt, 0),
      trafficCapturedAt: capturedAt,
      trafficAgeHours: toNonNegativeNumber(snapshot.trafficAgeHours, 0),
      trafficVelocityPerHour: toNonNegativeNumber(snapshot.trafficVelocityPerHour, 0),
      trafficReplyVelocityPerHour: toNonNegativeNumber(snapshot.trafficReplyVelocityPerHour, 0),
      trafficEngagementRate: toNonNegativeNumber(snapshot.trafficEngagementRate, 0),
      trafficReplyRatio: toNonNegativeNumber(snapshot.trafficReplyRatio, 0),
      trafficPhase: normalizeTrafficPhase(snapshot.trafficPhase),
      trafficSource: String(snapshot.trafficSource || "x-graphql").trim()
    };
  }

  function rememberTrafficSnapshots(snapshots = []) {
    let changed = false;
    (Array.isArray(snapshots) ? snapshots : []).forEach((snapshot) => {
      const normalized = normalizeTrafficSnapshot(snapshot);
      if (!normalized) {
        return;
      }

      const previous = state.trafficByTweetId[normalized.tweetId] || {};
      const next = {
        ...previous,
        ...normalized,
        views: Math.max(toNonNegativeNumber(previous.views, 0), normalized.views),
        likes: Math.max(toNonNegativeNumber(previous.likes, 0), normalized.likes),
        replies: Math.max(toNonNegativeNumber(previous.replies, 0), normalized.replies),
        retweets: Math.max(toNonNegativeNumber(previous.retweets, 0), normalized.retweets),
        bookmarks: Math.max(toNonNegativeNumber(previous.bookmarks, 0), normalized.bookmarks)
      };
      state.trafficByTweetId[normalized.tweetId] = next;
      state.trafficUpdatedAt = Math.max(state.trafficUpdatedAt, normalized.trafficCapturedAt);
      changed = true;
    });

    const entries = Object.entries(state.trafficByTweetId)
      .sort((left, right) => toNonNegativeNumber(right[1]?.trafficCapturedAt, 0) - toNonNegativeNumber(left[1]?.trafficCapturedAt, 0));
    if (entries.length > 500) {
      state.trafficByTweetId = Object.fromEntries(entries.slice(0, 500));
    }

    return changed;
  }

  function getTrafficSnapshotByTweetId(tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    return normalizedTweetId ? (state.trafficByTweetId[normalizedTweetId] || null) : null;
  }

  function bindReplyDropTrafficBridge() {
    if (state.trafficBridgeBound) {
      return;
    }

    state.trafficBridgeBound = true;
    global.addEventListener("message", (event) => {
      if (event.source !== global) {
        return;
      }

      const payload = event.data;
      if (!payload || payload.source !== TRAFFIC_CHANNEL || payload.type !== "traffic-batch") {
        return;
      }

      if (rememberTrafficSnapshots(payload.tweets)) {
        scheduleLazyRescan(220);
      }
    });

    global.postMessage({
      source: TRAFFIC_CHANNEL,
      type: "traffic-request"
    }, global.location.origin);
  }

  function mapQueueStatusToApi(status) {
    const normalized = String(status || "queued").trim().toLowerCase();
    if (normalized === "queued") {
      return "pending";
    }
    if (normalized === "completed") {
      return "done";
    }
    return "shipped";
  }

  function summarizeApiCandidate(candidate = {}) {
    const url = normalizeTweetUrl(candidate.url);
    const textSummary = String(candidate.text || "").trim().slice(0, 220);
    return {
      tweetId: extractTweetIdFromUrl(url),
      score: Number(candidate.score || 0),
      baseScore: Number(candidate.baseScore || candidate.score || 0),
      opportunityBoost: Number(candidate.opportunityBoost || 0),
      tier: String(candidate.tier || "").trim() || "hidden",
      relationshipStatus: String(candidate.relationshipStatus || "").trim(),
      attributionKind: String(candidate.attributionKind || "").trim(),
      topicTags: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
      author: String(candidate.authorHandle || "").trim(),
      authorHandle: String(candidate.authorHandle || "").trim(),
      mediaKind: String(candidate.mediaKind || "").trim(),
      sourceSurface: String(candidate.sourceSurface || "").trim(),
      postScore: Number(candidate.postScore || candidate.score || 0),
      reachLikelihood: Number(candidate.reachLikelihood || 0),
      understandingConfidence: Number(candidate.understandingConfidence || 0),
      authorFit: Number(candidate.authorFit || 0),
      finalScore: Number(candidate.finalScore || candidate.score || 0),
      peakFinalScore: Number(candidate.peakFinalScore || candidate.finalScore || candidate.score || 0),
      peakSourceSurface: String(candidate.peakSourceSurface || candidate.sourceSurface || "").trim(),
      peakObservedAt: Number(candidate.peakObservedAt || candidate.timestamp || 0),
      trafficPhase: String(candidate.trafficPhase || "").trim(),
      trafficVelocityPerHour: Number(candidate.trafficVelocityPerHour || 0),
      trafficReplyVelocityPerHour: Number(candidate.trafficReplyVelocityPerHour || 0),
      trafficEngagementRate: Number(candidate.trafficEngagementRate || 0),
      trafficReplyRatio: Number(candidate.trafficReplyRatio || 0),
      retweets: Number(candidate.retweets || 0),
      bookmarks: Number(candidate.bookmarks || 0),
      blockReason: String(candidate.blockReason || "").trim(),
      lowSemanticConfidence: Boolean(candidate.lowSemanticConfidence),
      textSummary,
      "text摘要": textSummary,
      url
    };
  }

  function summarizeApiQueueItem(item = {}) {
    const url = normalizeTweetUrl(item.url);
    return {
      tweetId: extractTweetIdFromUrl(url),
      status: mapQueueStatusToApi(item.status),
      addedAt: Number(item.createdAt || 0),
      url,
      slot: String(item.slot || "next").trim() || "next",
      scheduledFor: Number(item.scheduledFor || 0),
      author: String(item.authorHandle || "").trim(),
      authorHandle: String(item.authorHandle || "").trim(),
      score: Number(item.score || 0),
      baseScore: Number(item.baseScore || item.score || 0),
      opportunityBoost: Number(item.opportunityBoost || 0),
      relationshipStatus: String(item.relationshipStatus || "").trim(),
      attributionKind: String(item.attributionKind || "").trim(),
      sourceSurface: String(item.sourceSurface || "").trim(),
      postScore: Number(item.postScore || item.score || 0),
      reachLikelihood: Number(item.reachLikelihood || 0),
      understandingConfidence: Number(item.understandingConfidence || 0),
      authorFit: Number(item.authorFit || 0),
      finalScore: Number(item.finalScore || item.score || 0),
      trafficPhase: String(item.trafficPhase || "").trim(),
      trafficVelocityPerHour: Number(item.trafficVelocityPerHour || 0),
      trafficReplyVelocityPerHour: Number(item.trafficReplyVelocityPerHour || 0),
      trafficEngagementRate: Number(item.trafficEngagementRate || 0),
      trafficReplyRatio: Number(item.trafficReplyRatio || 0),
      blockReason: String(item.blockReason || "").trim(),
      draft: String(item.draft || "").trim().slice(0, 560)
    };
  }

  async function getRuntimeStateSnapshot() {
    const response = await sendRuntimeApiMessage({ type: "X_REPLY_SCORER_GET_STATE" });
    if (response?.state) {
      return response.state;
    }
    if (String(response?.error || "") === "runtime-message-timeout") {
      return getLocalRuntimeStateSnapshot("runtime-message-timeout");
    }
    throw new Error(String(response?.error || "state-unavailable"));
  }

  async function updateRuntimeState(patch) {
    const response = await sendRuntimeApiMessage({
      type: "X_REPLY_SCORER_UPDATE_STATE",
      patch
    });
    if (response?.state) {
      return response.state;
    }
    throw new Error(String(response?.error || "state-update-failed"));
  }

  function resolveUrlByTweetIdFromState(runtimeState, tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return "";
    }

    const candidates = [
      ...(Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates : []).map((item) => item?.url),
      ...(Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : []).map((item) => item?.url),
      ...(Array.isArray(runtimeState?.publishWatch) ? runtimeState.publishWatch : []).map((item) => item?.url),
      ...(Array.isArray(runtimeState?.pickupWatch) ? runtimeState.pickupWatch : []).map((item) => item?.url),
      ...Object.keys(runtimeState?.replyDetails || {}),
      ...Object.keys(runtimeState?.repliedTweets || {}),
      ...Object.keys(runtimeState?.dismissedTweets || {})
    ];

    return candidates
      .map((url) => normalizeTweetUrl(url))
      .find((url) => extractTweetIdFromUrl(url) === normalizedTweetId) || "";
  }

  function getCandidateByTweetIdFromState(runtimeState, tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return null;
    }

    return (Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates : [])
      .find((item) => extractTweetIdFromUrl(item?.url) === normalizedTweetId) || null;
  }

  function getCandidateByUrlFromState(runtimeState, url) {
    const normalizedUrl = normalizeTweetUrl(url);
    if (!normalizedUrl) {
      return null;
    }

    return (Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates : [])
      .find((item) => normalizeTweetUrl(item?.url) === normalizedUrl) || null;
  }

  function getQueueItemByUrlFromState(runtimeState, url) {
    const normalizedUrl = normalizeTweetUrl(url);
    if (!normalizedUrl) {
      return null;
    }

    return (Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : [])
      .find((item) => normalizeTweetUrl(item?.url) === normalizedUrl) || null;
  }

  function getQueueItemByTweetIdFromState(runtimeState, tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return null;
    }

    return (Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : [])
      .find((item) => extractTweetIdFromUrl(item?.url) === normalizedTweetId) || null;
  }

  function getLocalRuntimeStateSnapshot(reason = "local-fallback") {
    return {
      settings: { ...(state.settings || {}) },
      repliedTweets: { ...(state.repliedTweets || {}) },
      dismissedTweets: { ...(state.dismissedTweets || {}) },
      replyDetails: { ...(state.replyDetails || {}) },
      replyQueue: Array.isArray(state.replyQueue) ? state.replyQueue.slice() : [],
      recentCandidates: Array.isArray(state.recentCandidates) ? state.recentCandidates.slice() : [],
      relationshipStates: { ...(state.relationshipStates || {}) },
      trafficUpdatedAt: state.trafficUpdatedAt || 0,
      stats: { ...(state.stats || {}) },
      apiStateSource: reason
    };
  }

  function collectDomCandidateSnapshot() {
    const byUrl = new Map();

    getTweetNodes().forEach((article) => {
      const candidate = readStoredCandidate(article);
      const badge = article.querySelector(`.${BADGE_CLASS}`);
      const tier = String(badge?.getAttribute("data-tier") || candidate?.tier || "").trim();
      const url = normalizeTweetUrl(candidate?.url);
      if (!url || !tier || tier === "hidden" || tier === "replied") {
        return;
      }

      byUrl.set(url, {
        ...(candidate && typeof candidate === "object" ? candidate : {}),
        url,
        tier
      });
    });

    return sortApiAgentCandidates(Array.from(byUrl.values())).slice(0, 16);
  }

  function mergeApiCandidateRecord(previous = {}, next = {}) {
    const url = normalizeTweetUrl(next?.url || previous?.url);
    const previousPeakFinalScore = Number(previous?.peakFinalScore ?? previous?.finalScore ?? previous?.score ?? 0);
    const nextPeakFinalScore = Number(next?.peakFinalScore ?? next?.finalScore ?? next?.score ?? 0);
    const useNextPeak = nextPeakFinalScore >= previousPeakFinalScore;

    return {
      ...(previous && typeof previous === "object" ? previous : {}),
      ...(next && typeof next === "object" ? next : {}),
      url,
      peakFinalScore: Math.max(previousPeakFinalScore, nextPeakFinalScore),
      peakSourceSurface: String(
        useNextPeak
          ? (next?.peakSourceSurface || next?.sourceSurface || previous?.peakSourceSurface || previous?.sourceSurface || "")
          : (previous?.peakSourceSurface || previous?.sourceSurface || next?.peakSourceSurface || next?.sourceSurface || "")
      ).trim(),
      peakObservedAt: Number(
        useNextPeak
          ? (next?.peakObservedAt || next?.timestamp || previous?.peakObservedAt || previous?.timestamp || 0)
          : (previous?.peakObservedAt || previous?.timestamp || next?.peakObservedAt || next?.timestamp || 0)
      )
    };
  }

  function mergeApiCandidateLists(runtimeCandidates = [], domCandidates = []) {
    const mergedByUrl = new Map();

    (Array.isArray(runtimeCandidates) ? runtimeCandidates : []).forEach((candidate) => {
      const url = normalizeTweetUrl(candidate?.url);
      if (!url) {
        return;
      }
      mergedByUrl.set(url, mergeApiCandidateRecord({}, candidate));
    });

    (Array.isArray(domCandidates) ? domCandidates : []).forEach((candidate) => {
      const url = normalizeTweetUrl(candidate?.url);
      if (!url) {
        return;
      }
      mergedByUrl.set(url, mergeApiCandidateRecord(mergedByUrl.get(url) || {}, candidate));
    });

    return sortApiAgentCandidates(Array.from(mergedByUrl.values())).slice(0, 16);
  }

  function shouldRefreshApiCandidateView(runtimeCandidates = [], domCandidates = []) {
    if (domCandidates.length > 0) {
      return false;
    }

    if (Array.isArray(runtimeCandidates) && runtimeCandidates.length > 0) {
      return false;
    }

    return Boolean(
      Number(state.stats?.visibleCount || 0) > 0 ||
      state.scanTimer ||
      state.lazyRescanTimer
    );
  }

  async function getApiRuntimeStateSnapshot() {
    const runtimeState = await getRuntimeStateSnapshot();
    const runtimeCandidates = Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates : [];
    let domCandidates = collectDomCandidateSnapshot();

    if (shouldRefreshApiCandidateView(runtimeCandidates, domCandidates)) {
      scanTweets();
      domCandidates = collectDomCandidateSnapshot();
    }

    const mergedCandidates = mergeApiCandidateLists(runtimeCandidates, domCandidates);
    return {
      ...(runtimeState && typeof runtimeState === "object" ? runtimeState : {}),
      recentCandidates: mergedCandidates,
      pageCandidateSync: {
        runtimeCandidateCount: runtimeCandidates.length,
        domCandidateCount: domCandidates.length,
        usedDomFallback: domCandidates.length > 0 && mergedCandidates.length >= domCandidates.length && runtimeCandidates.length < domCandidates.length,
        scanPending: Boolean(state.scanTimer || state.lazyRescanTimer)
      }
    };
  }

  function getCandidateLaneDescriptor(candidate = {}, uiLanguage = "zh-Hans") {
    const score = Number(candidate?.score) || 0;
    const opportunityBoost = Number(candidate?.opportunityBoost) || 0;
    const relationshipStatus = String(candidate?.relationshipStatus || "").trim();
    const attributionKind = String(candidate?.attributionKind || "").trim();
    const replies = Number(candidate?.replies) || 0;
    const views = Number(candidate?.views) || 0;
    const likes = Number(candidate?.likes) || 0;
    const timestamp = Number(candidate?.timestamp) || Date.now();
    const ageMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    const conversationRatio = views > 0 ? (replies / Math.max(views, 1)) : 0;
    const likeReplyRatio = likes > 0 && replies > 0 ? (likes / Math.max(replies, 1)) : 0;
    const relationshipHot = relationshipStatus === "mutual" || relationshipStatus === "pinned";
    const memoryHot = attributionKind === "author-engaged" || attributionKind === "handle-picked-up";
    const validatedRelationshipHot = relationshipHot && (memoryHot || opportunityBoost >= 10 || score >= 64);
    const crowded = replies >= 180 || (views >= 180000 && replies >= 90);
    const broadcastHeavy = (
      (views >= 120000 && conversationRatio > 0 && conversationRatio < 0.0025) ||
      likeReplyRatio >= 22
    );
    const language = uiLanguage === "zh-Hant" ? "zh-Hant" : uiLanguage === "ja" ? "ja" : uiLanguage === "ko" ? "ko" : uiLanguage === "en" ? "en" : "zh-Hans";
    const labels = {
      "zh-Hans": {
        crowded: "回复区偏挤",
        now: "现在接",
        watch: "今晚看",
        backlog: "明早收"
      },
      "zh-Hant": {
        crowded: "回覆區偏擠",
        now: "現在接",
        watch: "今晚看",
        backlog: "明早收"
      },
      en: {
        crowded: "Crowded",
        now: "Reply now",
        watch: "Watch tonight",
        backlog: "Hold tomorrow"
      },
      ja: {
        crowded: "混み気味",
        now: "今返す",
        watch: "今夜見る",
        backlog: "明朝回す"
      },
      ko: {
        crowded: "과밀 구간",
        now: "지금 답글",
        watch: "오늘 밤 확인",
        backlog: "내일 아침 보류"
      }
    };

    let key = "backlog";
    if ((crowded || broadcastHeavy) && opportunityBoost < 10 && score < 84 && !validatedRelationshipHot && !memoryHot) {
      key = "crowded";
    } else if (
      (score >= 72 && ageMinutes <= 240) ||
      (opportunityBoost >= 12 && ageMinutes <= 360) ||
      ((validatedRelationshipHot || memoryHot) && ageMinutes <= 720 && score >= 52)
    ) {
      key = "now";
    } else if (
      (score >= 58 && ageMinutes <= 720) ||
      opportunityBoost >= 8 ||
      relationshipStatus === "follow-up" ||
      validatedRelationshipHot ||
      memoryHot ||
      attributionKind === "topic-validated"
    ) {
      key = "watch";
    }

    return {
      key,
      label: labels[language]?.[key] || labels.en[key]
    };
  }

  function getDefaultQueueSlot(candidate = {}, uiLanguage = "zh-Hans") {
    const laneKey = getCandidateLaneDescriptor(candidate, uiLanguage).key;
    return laneKey === "now" ? "next" : laneKey === "watch" ? "tonight" : "tomorrow";
  }

  function isInternalApiHighlight(text) {
    const source = String(text || "").trim().replace(/\s+/g, " ");
    if (!source) {
      return true;
    }

    return [
      /[+-]\s*\d+(?:\.\d+)?/u,
      /\b(?:freshness|reply room|author memory|mutual lane|for you|following|reach likelihood|understanding confidence|author fit|final score|broadcast account|vision_required_but_missing|vision_required|ocr_required|ocr|score|boost|penalty)\b/i,
      /(?:新鲜度|新鮮度|回复空间|回覆空間|作者记忆|作者記憶|互关线|互關線|推荐流|推薦流|关注流|關注流|触达概率|觸達概率|理解置信|理解信心|作者匹配|最终得分|最終得分|广播账号|廣播賬號|媒体缺义|媒體缺義|视觉缺失|視覺缺失|需要视觉|需要視覺|降权|降權|惩罚|懲罰|打分|評分)/u,
      /\b[a-z0-9]+(?:_[a-z0-9]+)+\b/i
    ].some((pattern) => pattern.test(source));
  }

  function getApiHighlightFallback(candidate = {}) {
    const topic = Array.isArray(candidate?.matchedTopics) ? String(candidate.matchedTopics[0] || "").trim() : "";
    if (topic) {
      return topic;
    }

    const mediaKind = String(candidate?.mediaKind || "").trim().toLowerCase();
    if (mediaKind) {
      return mediaKind;
    }

    return "discussion-angle";
  }

  function getUserFacingApiHighlights(candidate = {}, limit = 3) {
    const seen = new Set();
    const list = (Array.isArray(candidate?.highlights) ? candidate.highlights : [])
      .map((highlight) => String(highlight || "").trim())
      .filter((highlight) => {
        if (!highlight || isInternalApiHighlight(highlight)) {
          return false;
        }
        const key = highlight.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, Math.max(1, Number(limit) || 0));

    return list.length ? list : [getApiHighlightFallback(candidate)];
  }

  function hasVisualMediaKind(mediaKind = "") {
    return ["image", "photo", "video", "gif", "mixed"].includes(String(mediaKind || "").trim().toLowerCase());
  }

  function getConfiguredDisplayThreshold(settings = state.settings) {
    const value = Number(settings?.displayThreshold ?? settings?.threshold ?? global.XReplyScorer?.defaults?.displayThreshold ?? 30);
    return Math.max(0, Math.min(100, Math.floor(Number.isFinite(value) ? value : 30)));
  }

  function getConfiguredAverageLine(settings = state.settings) {
    const displayThreshold = getConfiguredDisplayThreshold(settings);
    const goodValue = Number(settings?.goodThreshold ?? global.XReplyScorer?.defaults?.goodThreshold ?? 60);
    const goodThreshold = Math.max(displayThreshold, Math.min(100, Math.floor(Number.isFinite(goodValue) ? goodValue : 60)));
    return Math.max(displayThreshold, Math.min(goodThreshold, Math.round((displayThreshold + goodThreshold) / 2)));
  }

  function getConfiguredExecutorSendFloor(settings = state.settings) {
    const configured = Number(settings?.executorSendFloor ?? settings?.agentSendFloor);
    if (Number.isFinite(configured)) {
      return Math.max(0, Math.min(100, Math.floor(configured)));
    }

    const averageLineScore = getConfiguredAverageLine(settings);
    return Math.max(DEFAULT_EXECUTOR_SEND_FLOOR, Math.min(100, averageLineScore + 8));
  }

  function getCandidateReferenceScore(candidate = {}) {
    const peakScore = Number(candidate?.peakFinalScore);
    if (Number.isFinite(peakScore) && peakScore > 0) {
      return Math.max(0, Math.min(100, Math.round(peakScore)));
    }
    const finalScore = Number(candidate?.finalScore);
    if (Number.isFinite(finalScore) && finalScore > 0) {
      return Math.max(0, Math.min(100, Math.round(finalScore)));
    }
    return Math.max(0, Math.min(100, Math.round(Number(candidate?.score || 0))));
  }

  function getCandidateCurrentScore(candidate = {}) {
    const finalScore = Number(candidate?.finalScore);
    if (Number.isFinite(finalScore) && finalScore > 0) {
      return Math.max(0, Math.min(100, Math.round(finalScore)));
    }
    return Math.max(0, Math.min(100, Math.round(Number(candidate?.score || 0))));
  }

  function buildLiveCandidateRecheck(candidate = {}, article = null) {
    if (!(article instanceof Element) || typeof global.XReplyScorer?.analyzeTweet !== "function") {
      return {
        attempted: false,
        available: false
      };
    }

    const tweet = getTweetData(article);
    if (!tweet?.url) {
      return {
        attempted: true,
        available: false
      };
    }

    const baseAnalysis = global.XReplyScorer.analyzeTweet(tweet, state.settings);
    const liveAnalysis = applyOpportunityAdjustments(tweet, baseAnalysis, state.settings, buildOpportunityContext());
    const previewScore = getCandidateReferenceScore(candidate);
    const currentCandidateScore = getCandidateCurrentScore(candidate);
    const liveScore = Math.max(0, Math.min(100, Math.round(Number(liveAnalysis?.finalScore ?? liveAnalysis?.score ?? 0))));
    const averageLineScore = getConfiguredAverageLine(state.settings);
    const executorSendFloor = getConfiguredExecutorSendFloor(state.settings);
    const displayThreshold = getConfiguredDisplayThreshold(state.settings);
    const previewSurface = String(candidate?.peakSourceSurface || candidate?.sourceSurface || "").trim();
    const liveSurface = String(tweet?.sourceSurface || liveAnalysis?.sourceSurface || "").trim();
    const scoreDelta = liveScore - previewScore;
    const currentDelta = liveScore - currentCandidateScore;
    const meaningfulDrop = scoreDelta <= -5;
    const belowAverageLine = liveScore < averageLineScore;
    const belowExecutorSendFloor = liveScore < executorSendFloor;
    const belowDisplayThreshold = liveScore < displayThreshold;
    const surfaceChanged = Boolean(previewSurface && liveSurface && previewSurface !== liveSurface);
    const flags = [];

    if (surfaceChanged) {
      flags.push("surface-shifted");
    }
    if (meaningfulDrop) {
      flags.push("value-dropped-on-open");
    }
    if (belowAverageLine) {
      flags.push("below-average-line");
    }
    if (belowExecutorSendFloor) {
      flags.push("below-executor-send-floor");
    }
    if (belowDisplayThreshold) {
      flags.push("below-display-floor");
    }
    if (String(liveAnalysis?.blockReason || "").trim()) {
      flags.push(String(liveAnalysis.blockReason).trim());
    }

    const skipRecommended = belowAverageLine || belowExecutorSendFloor;
    if (skipRecommended) {
      flags.push("skip-recommended");
    }

    let status = "stable";
    if (skipRecommended) {
      status = "skip";
    } else if (meaningfulDrop) {
      status = "degraded";
    } else if (liveScore >= previewScore + 5) {
      status = "improved";
    }

    return {
      attempted: true,
      available: true,
      status,
      previewScore,
      currentCandidateScore,
      liveScore,
      scoreDelta,
      currentDelta,
      previewSurface,
      liveSurface,
      averageLineScore,
      executorSendFloor,
      displayThreshold,
      meaningfulDrop,
      belowAverageLine,
      belowExecutorSendFloor,
      belowDisplayThreshold,
      skipRecommended,
      flags: Array.from(new Set(flags)),
      liveTier: String(liveAnalysis?.tier || "").trim(),
      liveBlockReason: String(liveAnalysis?.blockReason || "").trim()
    };
  }

  function getCandidateRecheckHint(recheck = {}) {
    if (!recheck?.attempted || !recheck?.available) {
      return "";
    }
    if (recheck.skipRecommended) {
      if (recheck.belowExecutorSendFloor) {
        return `打开后分数 ${recheck.liveScore}，低于自动发送线 ${recheck.executorSendFloor}，建议跳过`;
      }
      return `打开后分数从 ${recheck.previewScore} 降到 ${recheck.liveScore}，已低于平均线 ${recheck.averageLineScore}，建议跳过`;
    }
    if (recheck.meaningfulDrop) {
      return `打开后分数从 ${recheck.previewScore} 降到 ${recheck.liveScore}，回复价值已下降`;
    }
    return "";
  }

  function sortApiAgentCandidates(candidates = []) {
    return (Array.isArray(candidates) ? candidates : [])
      .filter((candidate) => Boolean(normalizeTweetUrl(candidate?.url)))
      .map((candidate, index) => ({ candidate, index }))
      .sort((left, right) => (
        Number(right.candidate?.finalScore || right.candidate?.score || 0) - Number(left.candidate?.finalScore || left.candidate?.score || 0) ||
        Number(right.candidate?.opportunityBoost || 0) - Number(left.candidate?.opportunityBoost || 0) ||
        Number(right.candidate?.postScore || 0) - Number(left.candidate?.postScore || 0) ||
        Number(right.candidate?.timestamp || 0) - Number(left.candidate?.timestamp || 0) ||
        left.index - right.index
      ))
      .map(({ candidate }) => candidate);
  }

  function buildReplyDropExecutorSchema() {
    return {
      version: "replydrop-executor-action-v1",
      legacyVersion: "replydrop-agent-reply-v1",
      decisionEnum: ["reply-now", "queue-next", "queue-tonight", "queue-tomorrow", "skip"],
      fields: {
        targetTweetId: "string",
        decision: "enum",
        replyText: "string",
        targetStartedAt: "number",
        targetDeadlineAt: "number",
        rationaleShort: "string",
        confidence: "number",
        riskFlags: "string[]"
      }
    };
  }

  function buildReplyDropReplySchema() {
    const executorSchema = buildReplyDropExecutorSchema();
    return {
      version: "replydrop-agent-reply-v1",
      decisionEnum: executorSchema.decisionEnum.slice(),
      fields: {
        ...(executorSchema.fields || {})
      }
    };
  }

  function buildReplyDropExecutorCapabilities() {
    return {
      version: "replydrop-executor-capabilities-v1",
      extensionVersion: chrome.runtime.getManifest().version,
      globalName: "ReplyDropExecutor",
      aliases: ["ReplyDropAPI"],
      compatibleClients: ["Codex", "OpenClaw", "Hermes", "Claude"],
      executionPolicy: {
        targetGoalMs: EXECUTOR_TARGET_GOAL_MS,
        targetTimeoutMs: EXECUTOR_TARGET_TIMEOUT_MS,
        emptyInboxMinRescans: EXECUTOR_EMPTY_INBOX_MIN_RESCANS,
        timeoutReasonCode: "target-timeout",
        instruction: "从拿到候选开始计时，90秒内完成为正常；超过120秒必须停止当前目标并切换下一条。若首页本轮没有合格推荐，不能直接结束，必须调用 refreshRecommendations() 或自行刷新/滚动重扫至少3轮。"
      },
      preferredMethods: {
        getExecutorInbox: "getAgentInbox",
        getExecutorContext: "getCandidateContext",
        getExecutorSchema: "getReplySchema",
        runExecutorAction: [
          "addToQueue",
          "openComposer",
          "submitReply",
          "markShipped",
          "skipCandidate"
        ]
      },
      methods: {
        getCandidates: { type: "read" },
        getQueue: { type: "read" },
        getMediaBundle: { type: "read" },
        getTrafficSnapshot: { type: "read" },
        refreshRecommendations: { type: "write" },
        getAgentInbox: { type: "read", legacy: true },
        getCandidateContext: { type: "read", legacy: true },
        getReplySchema: { type: "read", legacy: true },
        getExecutorInbox: { type: "read", aliasOf: "getAgentInbox" },
        getExecutorContext: { type: "read", aliasOf: "getCandidateContext" },
        getExecutorSchema: { type: "read", aliasOf: "getReplySchema" },
        getState: { type: "read" },
        addToQueue: { type: "write" },
        openComposer: {
          type: "write",
          accepts: {
            url: "string",
            tweetId: "string",
            draft: "string",
            targetStartedAt: "number",
            targetDeadlineAt: "number"
          }
        },
        submitReply: {
          type: "write",
          accepts: {
            autoLikeIfChinese: "boolean",
            targetStartedAt: "number",
            targetDeadlineAt: "number"
          }
        },
        markShipped: { type: "write" },
        skipCandidate: { type: "write" },
        runExecutorAction: {
          type: "write",
          accepts: {
            action: "string",
            tweetId: "string",
            url: "string",
            draft: "string",
            targetStartedAt: "number",
            targetDeadlineAt: "number"
          },
          actions: [
            "queue",
            "refresh-recommendations",
            "open-composer",
            "submit-reply",
            "reply",
            "mark-shipped",
            "skip"
          ]
        }
      }
    };
  }

  function buildApiAttributionModel(runtimeState = {}) {
    if (typeof global.ReplyDropAttributionCore?.buildAttributionSignalModel !== "function") {
      return null;
    }

    const replyEntries = Object.entries(runtimeState?.replyDetails || {})
      .map(([url, detail]) => ({
        url: normalizeTweetUrl(url),
        ...(detail && typeof detail === "object" ? detail : {})
      }))
      .filter((entry) => entry.url);

    return global.ReplyDropAttributionCore.buildAttributionSignalModel(
      replyEntries,
      Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : [],
      Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates : [],
      { now: Date.now() }
    );
  }

  function getRecommendedQueueSlot(candidate = {}, runtimeState = {}, attributionSummary = null) {
    const laneDefault = getDefaultQueueSlot(candidate, runtimeState?.uiLanguage || "zh-Hans");
    if (
      !attributionSummary ||
      typeof global.ReplyDropAttributionCore?.getDefaultQueueSlot !== "function"
    ) {
      return laneDefault;
    }
    return global.ReplyDropAttributionCore.getDefaultQueueSlot(laneDefault, attributionSummary);
  }

  function mapQueueSlotToDecision(slot = "") {
    const normalized = String(slot || "").trim();
    if (normalized === "next") {
      return "reply-now";
    }
    if (normalized === "tonight") {
      return "queue-tonight";
    }
    if (normalized === "tomorrow") {
      return "queue-tomorrow";
    }
    return "skip";
  }

  function simplifyRoutePlanForApi(route = {}) {
    return {
      key: String(route.key || "").trim(),
      draftKey: String(route.draftKey || "").trim(),
      voiceKey: String(route.voiceKey || "").trim(),
      tone: String(route.tone || "").trim(),
      score: Number(route.score || 0),
      sentenceTarget: Number(route.sentenceTarget || 0),
      preferQuestionClose: Boolean(route.preferQuestionClose),
      reasons: Array.isArray(route.reasons) ? route.reasons.slice(0, 5).map((reason) => String(reason || "").trim()).filter(Boolean) : []
    };
  }

  async function buildReplyDropCandidateContext(candidate = {}, runtimeState = {}, options = {}) {
    const source = options?.source === "queue" ? "queue" : "candidate";
    const normalizedUrl = normalizeTweetUrl(candidate?.url);
    const tweetId = extractTweetIdFromUrl(normalizedUrl);
    if (!tweetId) {
      throw new Error("candidate-not-found");
    }

    const attributionModel = options?.attributionModel || buildApiAttributionModel(runtimeState);
    const attributionSummary = typeof global.ReplyDropAttributionCore?.summarizeCandidateAttribution === "function"
      ? global.ReplyDropAttributionCore.summarizeCandidateAttribution(candidate, attributionModel)
      : null;
    const lane = getCandidateLaneDescriptor(candidate, runtimeState?.uiLanguage || "zh-Hans");
    const recommendedSlot = getRecommendedQueueSlot(candidate, runtimeState, attributionSummary);
    const highlights = getUserFacingApiHighlights(candidate, 3);
    const text = String(candidate?.text || candidate?.draft || "").trim().slice(0, 560);
    const timestamp = Number(candidate?.timestamp || 0);
    const ageMinutes = timestamp
      ? Math.max(0, Math.round((Date.now() - timestamp) / 60000))
      : 0;
    const mediaKind = String(candidate?.mediaKind || "").trim();
    const mediaPresent = hasVisualMediaKind(mediaKind);
    const needsVision = mediaPresent && Boolean(candidate?.lowSemanticConfidence || text.length < 32);
    const liveArticle = options?.article instanceof Element
      ? options.article
      : findTweetArticleByTweetId(tweetId, normalizedUrl);
    const recheck = buildLiveCandidateRecheck(candidate, liveArticle);
    const recommendedDecision = recheck?.skipRecommended ? "skip" : mapQueueSlotToDecision(recommendedSlot);
    const draftPlans = typeof global.ReplyDropDraftCore?.buildDraftPlan === "function"
      ? global.ReplyDropDraftCore.buildDraftPlan(candidate, attributionSummary, { laneKey: lane.key })
      : [];
    const routePlans = typeof global.ReplyDropDraftCore?.buildDraftRoutePlan === "function"
      ? global.ReplyDropDraftCore.buildDraftRoutePlan(candidate, attributionSummary, {
          laneKey: lane.key,
          preferredSlot: recommendedSlot,
          availableDraftKeys: draftPlans.map((plan) => plan?.key).filter(Boolean)
        })
      : [];
    const riskFlags = Array.from(new Set([
      String(candidate?.blockReason || "").trim(),
      ...(Array.isArray(recheck?.flags) ? recheck.flags : [])
    ].filter(Boolean)));

    const context = {
      version: "replydrop-candidate-context-v1",
      source,
      tweetId,
      url: normalizedUrl,
      author: {
        handle: String(candidate?.authorHandle || "").trim(),
        name: String(candidate?.authorName || "").trim(),
        verified: Boolean(candidate?.authorVerified),
        verificationType: String(candidate?.authorVerificationType || "").trim(),
        relationshipStatus: String(candidate?.relationshipStatus || "").trim()
      },
      post: {
        text,
        mediaKind,
        sourceSurface: String(candidate?.sourceSurface || "").trim(),
        ageMinutes,
        views: Number(candidate?.views || 0),
        replies: Number(candidate?.replies || 0),
        likes: Number(candidate?.likes || 0),
        retweets: Number(candidate?.retweets || 0),
        bookmarks: Number(candidate?.bookmarks || 0),
        traffic: {
          phase: String(candidate?.trafficPhase || "").trim(),
          velocityPerHour: Number(candidate?.trafficVelocityPerHour || 0),
          replyVelocityPerHour: Number(candidate?.trafficReplyVelocityPerHour || 0),
          engagementRate: Number(candidate?.trafficEngagementRate || 0),
          replyRatio: Number(candidate?.trafficReplyRatio || 0),
          capturedAt: Number(candidate?.trafficCapturedAt || 0),
          source: String(candidate?.trafficSource || "").trim()
        },
        matchedTopics: Array.isArray(candidate?.matchedTopics) ? candidate.matchedTopics.slice(0, 4).map((item) => String(item || "").trim()).filter(Boolean) : [],
        matchedLanguages: Array.isArray(candidate?.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4).map((item) => String(item || "").trim()).filter(Boolean) : [],
        highlights
      },
      scoring: {
        score: Number(candidate?.score || 0),
        baseScore: Number(candidate?.baseScore || candidate?.score || 0),
        opportunityBoost: Number(candidate?.opportunityBoost || 0),
        postScore: Number(candidate?.postScore || candidate?.score || 0),
        reachLikelihood: Number(candidate?.reachLikelihood || 0),
        understandingConfidence: Number(candidate?.understandingConfidence || 0),
        authorFit: Number(candidate?.authorFit || 0),
        finalScore: Number(candidate?.finalScore || candidate?.score || 0),
        peakFinalScore: Number(candidate?.peakFinalScore || candidate?.finalScore || candidate?.score || 0),
        peakSourceSurface: String(candidate?.peakSourceSurface || candidate?.sourceSurface || "").trim(),
        peakObservedAt: Number(candidate?.peakObservedAt || candidate?.timestamp || 0),
        blockReason: String(candidate?.blockReason || "").trim(),
        lowSemanticConfidence: Boolean(candidate?.lowSemanticConfidence)
      },
      recheck,
      routing: {
        laneKey: lane.key,
        laneLabel: lane.label,
        recommendedSlot,
        recommendedDecision
      },
      memory: {
        kind: String(attributionSummary?.kind || "").trim(),
        priority: Number(attributionSummary?.priority || 0),
        preferredSlot: String(attributionSummary?.preferredSlot || "").trim(),
        reviewed: Number(attributionSummary?.reviewed || 0),
        settled: Number(attributionSummary?.settled || 0),
        pickedUp: Number(attributionSummary?.pickedUp || 0),
        authorEngaged: Number(attributionSummary?.authorEngaged || 0)
      },
      media: {
        needsVision,
        available: mediaPresent,
        bundleIncluded: false
      },
      aiHints: {
        draftKeys: recheck?.skipRecommended ? [] : draftPlans.map((plan) => String(plan?.key || "").trim()).filter(Boolean),
        routePlans: recheck?.skipRecommended ? [] : routePlans.map((route) => simplifyRoutePlanForApi(route)),
        riskFlags,
        recheckHint: getCandidateRecheckHint(recheck)
      },
      executionPolicy: buildReplyDropExecutionPolicy(options?.targetStartedAt || options?.generatedAt || Date.now())
    };

    if (options?.includeMedia && mediaPresent) {
      try {
        const bundle = await getReplyDropApiMediaBundle(tweetId);
        context.media.bundleIncluded = true;
        context.media.bundle = bundle;
      } catch (error) {
        context.media.bundleError = String(error?.message || error);
      }
    }

    return context;
  }

  function getScheduledTimestamp(slot) {
    const now = new Date();
    if (slot === "tonight") {
      const tonight = new Date(now);
      tonight.setHours(20, 30, 0, 0);
      if (tonight.getTime() <= now.getTime()) {
        tonight.setTime(now.getTime() + 2 * 60 * 60 * 1000);
      }
      return tonight.getTime();
    }
    if (slot === "tomorrow") {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(9, 30, 0, 0);
      return tomorrow.getTime();
    }
    return now.getTime() + 30 * 60 * 1000;
  }

  async function getReplyDropApiCandidates() {
    const runtimeState = await getApiRuntimeStateSnapshot();
    return (Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates : [])
      .map((item) => summarizeApiCandidate(item))
      .filter((item) => item.tweetId);
  }

  async function getReplyDropApiQueue() {
    const runtimeState = await getRuntimeStateSnapshot();
    return (Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : [])
      .map((item) => summarizeApiQueueItem(item))
      .filter((item) => item.tweetId);
  }

  async function getReplyDropApiMediaBundle(tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const runtimeState = await getApiRuntimeStateSnapshot();
    const candidate = getCandidateByTweetIdFromState(runtimeState, normalizedTweetId);
    const fallbackUrl = candidate?.url || resolveUrlByTweetIdFromState(runtimeState, normalizedTweetId);
    const article = findTweetArticleByTweetId(normalizedTweetId, fallbackUrl);
    if (!(article instanceof Element)) {
      throw new Error(fallbackUrl ? "tweet-not-ready" : "tweet-not-found");
    }

    const bundle = buildArticleMediaBundle(article, normalizedTweetId, candidate, fallbackUrl);
    if (!bundle?.items?.length) {
      throw new Error("media-not-found");
    }
    return bundle;
  }

  async function getReplyDropApiTrafficSnapshot(tweetIdOrUrl) {
    const normalizedTweetId = normalizeApiTweetId(tweetIdOrUrl) || extractTweetIdFromUrl(tweetIdOrUrl);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const snapshot = getTrafficSnapshotByTweetId(normalizedTweetId);
    return {
      ok: Boolean(snapshot),
      tweetId: normalizedTweetId,
      snapshot: snapshot ? { ...snapshot } : null,
      updatedAt: state.trafficUpdatedAt || 0
    };
  }

  function isReplyDropContextActionable(context = {}) {
    if (!context || typeof context !== "object") {
      return false;
    }
    if (context.routing?.recommendedDecision !== "reply-now") {
      return false;
    }
    if (context.recheck?.skipRecommended) {
      return false;
    }
    if (Array.isArray(context.aiHints?.riskFlags) && context.aiHints.riskFlags.includes("vision_required_but_missing")) {
      return false;
    }
    return true;
  }

  function buildEmptyInboxRecovery(contexts = [], generatedAt = Date.now()) {
    const actionableCount = contexts.filter(isReplyDropContextActionable).length;
    return {
      actionableCount,
      requiredWhenActionableCountIsZero: true,
      minRescansBeforeGivingUp: EXECUTOR_EMPTY_INBOX_MIN_RESCANS,
      recommendedAction: actionableCount > 0 ? "process-candidates" : "refresh-recommendations",
      method: "refreshRecommendations",
      instruction: actionableCount > 0
        ? "已有合格候选，按评分顺序处理。"
        : "本轮没有合格推荐时不能结束；先调用 refreshRecommendations({ mode: 'scroll' }) 或刷新首页，至少重扫3轮。",
      generatedAt
    };
  }

  async function refreshReplyDropRecommendations(options = {}) {
    const mode = String(options?.mode || "scroll").trim().toLowerCase();
    const pages = Math.max(1, Math.min(4, Math.floor(Number(options?.pages) || 2)));
    const waitMs = Math.max(250, Math.min(2500, Math.floor(Number(options?.waitMs) || 900)));
    const path = String(global.location.pathname || "").toLowerCase();

    if (!path.startsWith("/home")) {
      global.location.assign("https://x.com/home");
      return {
        ok: true,
        action: "navigate-home",
        instruction: "已切回首页，页面加载后重新调用 getExecutorInbox()。"
      };
    }

    if (mode === "reload" || mode === "refresh") {
      global.location.reload();
      return {
        ok: true,
        action: "reload-home",
        instruction: "已刷新首页，页面加载后重新调用 getExecutorInbox()。"
      };
    }

    global.scrollBy({
      top: Math.max(global.innerHeight || 800, 800) * pages,
      left: 0,
      behavior: "smooth"
    });
    state.lastDomChangeAt = Date.now();
    scheduleScan();
    await new Promise((resolve) => global.setTimeout(resolve, waitMs));
    scanTweets();

    return {
      ok: true,
      action: "scroll-rescan",
      pages,
      stats: { ...state.stats },
      instruction: "已滚动并触发重扫，请重新调用 getExecutorInbox() 读取新候选。"
    };
  }

  async function getReplyDropApiCandidateContext(tweetId, options = {}) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const runtimeState = await getApiRuntimeStateSnapshot();
    const candidate = getCandidateByTweetIdFromState(runtimeState, normalizedTweetId);
    const queueItem = getQueueItemByTweetIdFromState(runtimeState, normalizedTweetId);
    const sourceRecord = candidate || queueItem;
    if (!sourceRecord) {
      throw new Error("candidate-not-found");
    }

    const attributionModel = buildApiAttributionModel(runtimeState);
    return buildReplyDropCandidateContext(sourceRecord, runtimeState, {
      source: candidate ? "candidate" : "queue",
      includeMedia: Boolean(options?.includeMedia),
      attributionModel
    });
  }

  async function getReplyDropApiAgentInbox(options = {}) {
    const runtimeState = await getApiRuntimeStateSnapshot();
    const limit = Math.max(1, Math.min(16, Math.floor(Number(options?.limit) || 6)));
    const includeMedia = Boolean(options?.includeMedia);
    const generatedAt = Date.now();
    const sortedCandidates = sortApiAgentCandidates(runtimeState?.recentCandidates || []);
    const orderedCandidates = [
      ...sortedCandidates.filter((candidate) => !String(candidate?.blockReason || "").trim()),
      ...sortedCandidates.filter((candidate) => String(candidate?.blockReason || "").trim())
    ].slice(0, limit);
    const attributionModel = buildApiAttributionModel(runtimeState);
    const contexts = [];

    for (const candidate of orderedCandidates) {
      contexts.push(await buildReplyDropCandidateContext(candidate, runtimeState, {
        source: "candidate",
        includeMedia,
        attributionModel,
        generatedAt
      }));
    }

    return {
      version: "replydrop-agent-inbox-v1",
      generatedAt,
      limit,
      candidates: contexts,
      emptyInboxRecovery: buildEmptyInboxRecovery(contexts, generatedAt),
      executionPolicy: buildReplyDropExecutionPolicy(generatedAt),
      outputSchema: buildReplyDropReplySchema()
    };
  }

  async function getReplyDropApiExecutorInbox(options = {}) {
    const inbox = await getReplyDropApiAgentInbox(options);
    return {
      ...inbox,
      version: "replydrop-executor-inbox-v1",
      legacyVersion: String(inbox?.version || "").trim(),
      outputSchema: buildReplyDropExecutorSchema()
    };
  }

  async function getReplyDropApiExecutorContext(tweetId, options = {}) {
    const context = await getReplyDropApiCandidateContext(tweetId, options);
    return {
      ...context,
      version: "replydrop-executor-context-v1",
      legacyVersion: String(context?.version || "").trim()
    };
  }

  async function addReplyDropCandidateToQueue(tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const runtimeState = await getApiRuntimeStateSnapshot();
    const candidate = getCandidateByTweetIdFromState(runtimeState, normalizedTweetId);
    if (!candidate?.url) {
      throw new Error("candidate-not-found");
    }
    if (candidate.blockReason) {
      throw new Error(String(candidate.blockReason));
    }

    const existing = getQueueItemByTweetIdFromState(runtimeState, normalizedTweetId);
    const slot = getDefaultQueueSlot(candidate, runtimeState?.uiLanguage || "zh-Hans");
    const nextItem = {
      url: candidate.url,
      authorHandle: candidate.authorHandle || existing?.authorHandle || "",
      text: candidate.text || existing?.text || "",
      score: Number(candidate.score ?? existing?.score ?? 0),
      baseScore: Number(candidate.baseScore ?? existing?.baseScore ?? candidate.score ?? 0),
      opportunityBoost: Number(candidate.opportunityBoost ?? existing?.opportunityBoost ?? 0),
      createdAt: Number(existing?.createdAt || Date.now()),
      scheduledFor: getScheduledTimestamp(slot),
      completedAt: 0,
      slot,
      draft: String(existing?.draft || "").trim().slice(0, 560),
      lane: getCandidateLaneDescriptor(candidate, runtimeState?.uiLanguage || "zh-Hans").label,
      relationshipStatus: String(candidate.relationshipStatus || existing?.relationshipStatus || "").trim(),
      attributionKind: String(candidate.attributionKind || existing?.attributionKind || "").trim(),
      keywordMatched: Boolean(candidate.keywordMatched || existing?.keywordMatched),
      matchedTopics: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(candidate.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4) : [],
      highlights: Array.isArray(candidate.highlights) ? candidate.highlights.slice(0, 4) : [],
      status: "queued"
    };
    const nextQueue = [
      nextItem,
      ...(Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : []).filter((item) => normalizeTweetUrl(item?.url) !== candidate.url)
    ];
    const nextPublishWatch = (Array.isArray(runtimeState?.publishWatch) ? runtimeState.publishWatch : [])
      .filter((item) => normalizeTweetUrl(item?.url) !== candidate.url);

    await updateRuntimeState({
      replyQueue: nextQueue,
      publishWatch: nextPublishWatch
    });

    return summarizeApiQueueItem(nextItem);
  }

  async function markReplyDropTweetShipped(tweetId, replyText = "") {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const runtimeState = await getApiRuntimeStateSnapshot();
    const url = resolveUrlByTweetIdFromState(runtimeState, normalizedTweetId);
    if (!url) {
      throw new Error("tweet-not-found");
    }

    const queueItem = getQueueItemByTweetIdFromState(runtimeState, normalizedTweetId);
    const candidate = getCandidateByTweetIdFromState(runtimeState, normalizedTweetId);
    const finalReplyText = String(replyText || queueItem?.draft || queueItem?.text || candidate?.text || "").trim().slice(0, 560);
    const response = await sendRuntimeApiMessage({
      type: "X_REPLY_SCORER_MARK_REPLIED",
      url,
      meta: {
        score: Number(queueItem?.score ?? candidate?.score ?? 0),
        tier: "replied",
        authorHandle: String(queueItem?.authorHandle || candidate?.authorHandle || "").trim(),
        authorVerified: Boolean(candidate?.authorVerified),
        authorVerificationType: String(candidate?.authorVerificationType || "").trim(),
        text: finalReplyText,
        lane: String(queueItem?.lane || "").trim(),
        slot: String(queueItem?.slot || getDefaultQueueSlot(candidate, runtimeState?.uiLanguage || "zh-Hans")).trim(),
        keywordMatched: Boolean(queueItem?.keywordMatched || candidate?.keywordMatched),
        matchedTopics: Array.isArray(queueItem?.matchedTopics) && queueItem.matchedTopics.length ? queueItem.matchedTopics.slice(0, 4) : (candidate?.matchedTopics || []).slice(0, 4),
        matchedLanguages: Array.isArray(queueItem?.matchedLanguages) && queueItem.matchedLanguages.length ? queueItem.matchedLanguages.slice(0, 4) : (candidate?.matchedLanguages || []).slice(0, 4),
        highlights: Array.isArray(queueItem?.highlights) && queueItem.highlights.length ? queueItem.highlights.slice(0, 4) : (candidate?.highlights || []).slice(0, 4),
        publishMode: queueItem ? "queue" : "manual"
      }
    });

    if (!response?.ok) {
      throw new Error(String(response?.error || "mark-shipped-failed"));
    }

    return {
      tweetId: normalizedTweetId,
      status: "shipped",
      url,
      replyText: finalReplyText
    };
  }

  async function skipReplyDropCandidate(tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const runtimeState = await getApiRuntimeStateSnapshot();
    const url = resolveUrlByTweetIdFromState(runtimeState, normalizedTweetId);
    if (!url) {
      throw new Error("candidate-not-found");
    }

    const skippedAt = Date.now();
    await updateRuntimeState({
      dismissedTweets: {
        ...(runtimeState?.dismissedTweets || {}),
        [url]: skippedAt
      }
    });

    return {
      tweetId: normalizedTweetId,
      skippedAt,
      url
    };
  }

  function getApiTargetTweetIdFromPayload(payload = {}) {
    return normalizeApiTweetId(payload?.tweetId || payload?.targetTweetId || extractTweetIdFromUrl(payload?.url));
  }

  function resolveApiTargetUrlFromPayload(payload = {}, runtimeState = null) {
    const directUrl = normalizeTweetUrl(payload?.url);
    if (directUrl) {
      return directUrl;
    }

    const tweetId = getApiTargetTweetIdFromPayload(payload);
    if (!tweetId) {
      return "";
    }

    return resolveUrlByTweetIdFromState(runtimeState, tweetId) || `https://x.com/i/status/${tweetId}`;
  }

  async function openReplyDropComposer(payload = {}) {
    const normalizedPayload = payload && typeof payload === "object" ? payload : {};
    const directUrl = normalizeTweetUrl(normalizedPayload.url);
    if (directUrl) {
      const timeoutFailure = beginReplyTargetAttempt(directUrl, {
        ...normalizedPayload,
        stage: "open-composer"
      });
      if (timeoutFailure) {
        cacheReplyOpenFailure(timeoutFailure);
        return timeoutFailure;
      }
      const result = await openQueueComposerHandoff({
        ...normalizedPayload,
        url: directUrl
      });
      if (result?.ok) {
        clearReplyOpenFailure(result.targetUrl || directUrl);
      } else {
        cacheReplyOpenFailure(result);
      }
      return result;
    }

    const tweetId = getApiTargetTweetIdFromPayload(normalizedPayload);
    if (!tweetId) {
      return buildReplyActionFailure({ reason: "missing-url" });
    }

    let runtimeState = null;
    try {
      runtimeState = await getApiRuntimeStateSnapshot();
    } catch {
      runtimeState = null;
    }

    const resolvedUrl = resolveApiTargetUrlFromPayload(normalizedPayload, runtimeState);
    const timeoutFailure = beginReplyTargetAttempt(resolvedUrl, {
      ...normalizedPayload,
      stage: "open-composer"
    });
    if (timeoutFailure) {
      cacheReplyOpenFailure(timeoutFailure);
      return timeoutFailure;
    }
    const result = await openQueueComposerHandoff({
      ...normalizedPayload,
      url: resolvedUrl
    });
    if (result?.ok) {
      clearReplyOpenFailure(result.targetUrl || resolvedUrl);
    } else {
      cacheReplyOpenFailure(result);
    }
    return result;
  }

  function normalizeReplyDropExecutorAction(action) {
    const normalized = String(action || "").trim().toLowerCase();
    switch (normalized) {
      case "queue":
      case "add-to-queue":
        return "queue";
      case "open":
      case "open-composer":
      case "open-reply":
        return "open-composer";
      case "refresh":
      case "refresh-recommendations":
      case "rescan":
      case "rescan-recommendations":
        return "refresh-recommendations";
      case "submit":
      case "submit-reply":
      case "post-reply":
        return "submit-reply";
      case "reply":
      case "open-and-submit":
        return "reply";
      case "mark-shipped":
      case "shipped":
        return "mark-shipped";
      case "skip":
      case "skip-candidate":
        return "skip";
      default:
        return "";
    }
  }

  async function runReplyDropExecutorAction(payload = {}) {
    const normalizedPayload = payload && typeof payload === "object" ? payload : {};
    const action = normalizeReplyDropExecutorAction(normalizedPayload.action || normalizedPayload.type);
    const tweetId = getApiTargetTweetIdFromPayload(normalizedPayload);
    let runtimeState = null;
    let resolvedTargetUrl = normalizeTweetUrl(normalizedPayload.url);
    if (!resolvedTargetUrl && tweetId) {
      try {
        runtimeState = await getApiRuntimeStateSnapshot();
        resolvedTargetUrl = resolveUrlByTweetIdFromState(runtimeState, tweetId) || `https://x.com/i/status/${tweetId}`;
      } catch {
        resolvedTargetUrl = `https://x.com/i/status/${tweetId}`;
      }
    }
    if (["open-composer", "submit-reply", "reply"].includes(action)) {
      const targetForDeadline = resolvedTargetUrl || resolveReplyTargetUrl();
      const timeoutFailure = beginReplyTargetAttempt(targetForDeadline, {
        ...normalizedPayload,
        stage: action
      });
      if (timeoutFailure) {
        return {
          ok: false,
          action: action || "unknown",
          stage: "target-timeout",
          open: action === "reply" ? timeoutFailure : null,
          submit: action === "submit-reply" ? timeoutFailure : null,
          targetUrl: String(timeoutFailure.targetUrl || targetForDeadline || "").trim(),
          reason: "target-timeout",
          reasonCode: "target-timeout",
          reasonLabel: getReplyReasonLabel("target-timeout"),
          elapsedMs: timeoutFailure.elapsedMs,
          timeoutMs: timeoutFailure.timeoutMs,
          actionGoalMs: timeoutFailure.actionGoalMs,
          shouldSkipTarget: true
        };
      }
    }

    switch (action) {
      case "refresh-recommendations":
        return refreshReplyDropRecommendations(normalizedPayload.options || normalizedPayload);
      case "queue":
        return addReplyDropCandidateToQueue(tweetId);
      case "open-composer":
        return openReplyDropComposer(normalizedPayload);
      case "submit-reply": {
        const submitOptions = normalizedPayload.options && typeof normalizedPayload.options === "object"
          ? normalizedPayload.options
          : normalizedPayload;
        return submitReplyDropComposer(submitOptions);
      }
      case "reply": {
        const openResult = await openReplyDropComposer(normalizedPayload);
        const openTimeoutFailure = checkReplyTargetDeadline(openResult?.targetUrl || resolvedTargetUrl, {
          ...normalizedPayload,
          stage: "open-composer"
        });
        if (openTimeoutFailure) {
          return {
            ok: false,
            action: "reply",
            stage: "target-timeout",
            open: openResult,
            submit: openTimeoutFailure,
            targetUrl: String(openTimeoutFailure?.targetUrl || openResult?.targetUrl || resolvedTargetUrl || "").trim(),
            reason: "target-timeout",
            reasonCode: "target-timeout",
            reasonLabel: getReplyReasonLabel("target-timeout"),
            elapsedMs: openTimeoutFailure.elapsedMs,
            timeoutMs: openTimeoutFailure.timeoutMs,
            actionGoalMs: openTimeoutFailure.actionGoalMs,
            shouldSkipTarget: true
          };
        }
        if (!openResult?.ok) {
          return {
            ok: false,
            action: "reply",
            stage: "open-composer",
            open: openResult,
            submit: null,
            targetUrl: String(openResult?.targetUrl || openResult?.href || "").trim()
          };
        }
        const settledComposer = await waitForReplyComposer(
          String(openResult?.targetUrl || openResult?.href || "").trim(),
          {
            timeoutMs: 2600,
            replyOnly: true,
            requireLocked: true
          }
        );
        if (!settledComposer?.ok) {
          const settledTargetUrl = String(openResult?.targetUrl || openResult?.href || "").trim();
          const settleFailure = buildReplyActionFailure({
            targetUrl: settledTargetUrl,
            ...buildReplyComposerFailurePayload(settledTargetUrl, settledComposer?.context)
          });
          return {
            ok: false,
            action: "reply",
            stage: "settle-reply-context",
            open: openResult,
            submit: settleFailure,
            targetUrl: String(settleFailure?.targetUrl || settledTargetUrl).trim()
          };
        }
        const settleTimeoutFailure = checkReplyTargetDeadline(openResult?.targetUrl || resolvedTargetUrl, {
          ...normalizedPayload,
          stage: "settle-reply-context"
        });
        if (settleTimeoutFailure) {
          return {
            ok: false,
            action: "reply",
            stage: "target-timeout",
            open: openResult,
            submit: settleTimeoutFailure,
            targetUrl: String(settleTimeoutFailure?.targetUrl || openResult?.targetUrl || resolvedTargetUrl || "").trim(),
            reason: "target-timeout",
            reasonCode: "target-timeout",
            reasonLabel: getReplyReasonLabel("target-timeout"),
            elapsedMs: settleTimeoutFailure.elapsedMs,
            timeoutMs: settleTimeoutFailure.timeoutMs,
            actionGoalMs: settleTimeoutFailure.actionGoalMs,
            shouldSkipTarget: true
          };
        }
        const submitOptions = normalizedPayload.submitOptions && typeof normalizedPayload.submitOptions === "object"
          ? normalizedPayload.submitOptions
          : (normalizedPayload.options && typeof normalizedPayload.options === "object" ? normalizedPayload.options : {});
        const submitResult = await submitReplyDropComposer(submitOptions);
        if (submitResult?.ok) {
          clearReplyTargetAttempt(submitResult?.targetUrl || openResult?.targetUrl || resolvedTargetUrl);
        }
        return {
          ok: Boolean(submitResult?.ok),
          action: "reply",
          stage: submitResult?.ok ? "done" : "submit-reply",
          open: openResult,
          submit: submitResult,
          targetUrl: String(submitResult?.targetUrl || submitResult?.href || openResult?.targetUrl || openResult?.href || "").trim()
        };
      }
      case "mark-shipped":
        return markReplyDropTweetShipped(tweetId, normalizedPayload.replyText || normalizedPayload.draft || "");
      case "skip":
        return skipReplyDropCandidate(tweetId);
      default:
        throw new Error("unknown-executor-action");
    }
  }

  function pickVisibleReplySubmitButton(targetUrl = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const candidates = getVisibleReplySubmitButtons(document);
    const editor = queryReplyComposer({
      targetUrl: normalizedTarget,
      replyOnly: true,
      requireLocked: true
    });
    if (editor instanceof HTMLElement) {
      const container = getReplyComposerContainer(editor);
      const inContainer = candidates.find((node) => container && getReplyComposerContainer(node) === container && isReplyComposer(node, normalizedTarget));
      if (inContainer) {
        return inContainer;
      }
    }

    return candidates.find((node) => isReplyComposer(node, normalizedTarget)) || null;
  }

  async function submitReplyDropComposer(options = {}) {
    const targetUrl = resolveReplyTargetUrl();
    if (!targetUrl) {
      return buildReplyActionFailure({ reason: "missing-target" });
    }
    const initialTimeoutFailure = beginReplyTargetAttempt(targetUrl, {
      ...options,
      stage: "submit-reply"
    });
    if (initialTimeoutFailure) {
      return initialTimeoutFailure;
    }
    const cachedOpenFailure = getFreshReplyOpenFailure(targetUrl);
    if (cachedOpenFailure) {
      if (String(cachedOpenFailure.reasonCode || "") === "target-timeout") {
        return buildReplyActionFailure({
          ...cachedOpenFailure,
          stage: "submit-reply"
        });
      }
      const currentEditor = queryReplyComposer({
        targetUrl,
        replyOnly: true,
        requireLocked: true
      });
      const currentContext = buildReplyComposerContext({ targetUrl, editor: currentEditor });
      if (!currentContext.composerLocked) {
        return buildReplyActionFailure(cachedOpenFailure);
      }
      clearReplyOpenFailure(targetUrl);
    }
    if (hasRecordedReply(targetUrl)) {
      return buildReplyActionFailure({
        targetUrl,
        reason: "already-replied",
        reasonCode: "already-replied"
      });
    }

    const settledComposer = await waitForReplyComposer(targetUrl, {
      timeoutMs: 2600,
      replyOnly: true,
      requireLocked: true
    });
    const settledTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...options,
      stage: "wait-reply-composer"
    });
    if (settledTimeoutFailure) {
      return settledTimeoutFailure;
    }
    if (!settledComposer?.ok) {
      return buildReplyActionFailure({
        targetUrl,
        ...buildReplyComposerFailurePayload(targetUrl, settledComposer?.context)
      });
    }

    const readySubmit = await waitForReplySubmitReady(targetUrl, readReplyComposerText(settledComposer.editor), {
      timeoutMs: 2600,
      rewriteDraft: false
    });
    const readyTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...options,
      stage: "wait-submit-ready"
    });
    if (readyTimeoutFailure) {
      return readyTimeoutFailure;
    }
    const sendButton = readySubmit?.sendButton || pickVisibleReplySubmitButton(targetUrl);
    if (!(sendButton instanceof HTMLElement)) {
      return buildReplyActionFailure({
        targetUrl,
        ...buildReplyComposerFailurePayload(targetUrl, readySubmit?.context || settledComposer?.context),
        reason: "send-button-missing"
      });
    }

    const sendContext = buildReplyComposerContext({ targetUrl, sendButton });
    if (!isReplyComposer(sendButton, targetUrl)) {
      return buildReplyActionFailure({
        targetUrl,
        ...buildReplyComposerFailurePayload(targetUrl, sendContext),
        reason: "not-reply-composer"
      });
    }

    if (!isReplySubmitButtonEnabled(sendButton)) {
      return buildReplyActionFailure({
        targetUrl,
        currentUrl: sendContext.currentUrl,
        articleUrl: sendContext.articleUrl,
        reason: "send-disabled",
        reasonCode: sendContext.composerLocked ? "send-button-disabled-but-target-locked" : "context-not-locked",
        submitReadyDiagnostics: {
          editorFound: Boolean(readySubmit?.editorFound),
          sendButtonFound: Boolean(readySubmit?.sendButtonFound),
          buttonDisabled: Boolean(readySubmit?.buttonDisabled),
          draftReady: Boolean(readySubmit?.draftReady),
          composerLocked: Boolean(readySubmit?.composerLocked),
          pageLocked: Boolean(readySubmit?.pageLocked)
        }
      });
    }

    state.pendingReplyTargetUrl = "";
    state.pendingReplyStartedAt = 0;
    state.apiSubmitInFlightTargetUrl = normalizeTweetUrl(targetUrl);
    clearPendingReplyOutcome();

    try {
      sendButton.click();
      const outcome = await waitForApiReplyOutcome(targetUrl, 6800, options || {});
      if (outcome?.ok) {
        clearReplyTargetAttempt(targetUrl);
      }
      return outcome;
    } finally {
      state.apiSubmitInFlightTargetUrl = "";
    }
  }

  async function callReplyDropApi(method, args = []) {
    switch (String(method || "").trim()) {
      case "getCapabilities":
      case "getExecutorCapabilities":
        return buildReplyDropExecutorCapabilities();
      case "getCandidates":
        return getReplyDropApiCandidates();
      case "getQueue":
        return getReplyDropApiQueue();
      case "getMediaBundle":
        return getReplyDropApiMediaBundle(args[0]);
      case "getTrafficSnapshot":
        return getReplyDropApiTrafficSnapshot(args[0]);
      case "refreshRecommendations":
        return refreshReplyDropRecommendations(args[0] || {});
      case "getAgentInbox":
        return getReplyDropApiAgentInbox(args[0] || {});
      case "getExecutorInbox":
        return getReplyDropApiExecutorInbox(args[0] || {});
      case "getCandidateContext":
        return getReplyDropApiCandidateContext(args[0], args[1] || {});
      case "getExecutorContext":
        return getReplyDropApiExecutorContext(args[0], args[1] || {});
      case "getReplySchema":
        return buildReplyDropReplySchema();
      case "getExecutorSchema":
        return buildReplyDropExecutorSchema();
      case "getState":
        return getApiRuntimeStateSnapshot();
      case "addToQueue":
        return addReplyDropCandidateToQueue(args[0]);
      case "markShipped":
        return markReplyDropTweetShipped(args[0], args[1]);
      case "skipCandidate":
        return skipReplyDropCandidate(args[0]);
      case "openComposer":
        return openReplyDropComposer(args[0] || {});
      case "submitReply":
        return submitReplyDropComposer(args[0] || {});
      case "runExecutorAction":
        return runReplyDropExecutorAction(args[0] || {});
      default:
        throw new Error("unknown-api-method");
    }
  }

  function bindReplyDropApiBridge() {
    if (!canExposeReplyDropApi() || state.apiBridgeBound) {
      return;
    }

    state.apiBridgeBound = true;
    global.addEventListener("message", (event) => {
      if (event.source !== global) {
        return;
      }

      const payload = event.data;
      if (
        !payload ||
        payload.source !== API_BRIDGE_CHANNEL ||
        payload.direction !== "request" ||
        !payload.id ||
        !payload.method
      ) {
        return;
      }

      callReplyDropApi(String(payload.method), Array.isArray(payload.args) ? payload.args : [])
        .then((result) => {
          if (result == null) {
            postReplyDropApiResponse({
              id: payload.id,
              ok: false,
              error: "replydrop-api-null-result"
            });
            return;
          }
          postReplyDropApiResponse({ id: payload.id, ok: true, result });
        })
        .catch((error) => {
          postReplyDropApiResponse({
            id: payload.id,
            ok: false,
            error: String(error?.message || error)
          });
        });
    });
  }

  function getStartOfLocalDay(timestamp = Date.now()) {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  function getTodayReplyCount(repliedTweets, timestamp = Date.now()) {
    const dayStart = getStartOfLocalDay(timestamp);
    return Object.values(repliedTweets || {}).reduce((count, value) => {
      const replyTimestamp = Number(value) || 0;
      return replyTimestamp >= dayStart ? count + 1 : count;
    }, 0);
  }

  function normalizeTweetUrl(url) {
    if (!url) {
      return "";
    }

    try {
      const parsed = new URL(url, global.location.origin);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const statusIndex = parts.indexOf("status");
      if (statusIndex > 0 && parts[statusIndex + 1]) {
        return `https://x.com/${parts[statusIndex - 1]}/status/${parts[statusIndex + 1]}`;
      }
      return `${parsed.origin}${parsed.pathname}`;
    } catch (_error) {
      return String(url).trim();
    }
  }

  function normalizeHandle(handle) {
    return String(handle || "").replace(/^@/, "").trim().toLowerCase();
  }

  function extractHandleFromHref(href) {
    if (!href) {
      return "";
    }

    try {
      const parsed = new URL(href, global.location.origin);
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length === 1 && parts[0] !== "home" && parts[0] !== "explore") {
        return normalizeHandle(parts[0]);
      }
    } catch (_error) {
      return "";
    }

    return "";
  }

  function readSurfaceSelectedText() {
    const selectors = [
      '[role="tab"][aria-selected="true"]',
      '[data-testid="ScrollSnap-List"] [aria-selected="true"]',
      'nav a[aria-current="page"]',
      '[data-testid="AppTabBar_Home_Link"][aria-current="page"]'
    ];
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      const text = [
        node.getAttribute("aria-label") || "",
        node.getAttribute("title") || "",
        node.textContent || ""
      ].join(" ").replace(/\s+/g, " ").trim().toLowerCase();
      if (text) {
        return text;
      }
    }
    return "";
  }

  function detectCurrentSourceSurface() {
    const path = String(global.location.pathname || "").toLowerCase();
    if (path.startsWith("/search") || path.startsWith("/explore")) {
      return "search";
    }
    if (path.startsWith("/notifications")) {
      return "notifications";
    }
    if (path.startsWith("/home")) {
      const selectedText = readSurfaceSelectedText();
      if (
        selectedText.includes("following") ||
        selectedText.includes("关注中") ||
        selectedText.includes("關注中") ||
        selectedText.includes("正在关注") ||
        selectedText.includes("正在關注")
      ) {
        return "following";
      }
      return "for-you";
    }
    if (path.includes("/status/")) {
      return "thread";
    }
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 1 && !["home", "explore", "notifications", "search"].includes(parts[0])) {
      return "profile";
    }
    return "unknown";
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      ${ARTICLE_SELECTOR}[data-xrs-positioned="1"] {
        position: relative !important;
      }
      .${BADGE_ANCHOR_CLASS} {
        position: absolute;
        display: inline-flex;
        width: 24px;
        height: 29px;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        overflow: visible;
        z-index: 3;
      }
      .${BADGE_ANCHOR_CLASS}[data-placement="article"] {
        position: absolute;
        left: 10px;
        bottom: 6px;
      }
      .${BADGE_CLASS} {
        --badge-shell: #b8d9ff;
        --badge-core: #eefcff;
        --badge-rim: rgba(226, 244, 255, 0.94);
        --badge-aura: rgba(120, 225, 255, 0.26);
        --badge-text: #0f172a;
        --badge-core-opacity: 0.92;
        --badge-rim-width: 1.02px;
        --badge-rim-opacity: 0.96;
        --badge-rim-dash: 0;
        --badge-aura-opacity: 0.72;
        --badge-highlight-main: rgba(255, 255, 255, 0.38);
        --badge-highlight-tip: rgba(255, 255, 255, 0.56);
        --badge-highlight-main-opacity: 1;
        --badge-highlight-tip-opacity: 1;
        position: relative;
        display: none;
        width: 24px;
        height: 29px;
        align-items: center;
        justify-content: center;
        filter:
          drop-shadow(0 5px 10px rgba(2, 6, 23, 0.22))
          drop-shadow(0 0 8px rgba(103, 232, 249, 0.12));
      }
      .${BADGE_CLASS}:not([data-tier="hidden"]) {
        display: inline-flex;
      }
      .${BADGE_CLASS} svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .${BADGE_CLASS} .xrs-drop-aura,
      .${BADGE_CLASS} .xrs-drop-core,
      .${BADGE_CLASS} .xrs-drop-rim {
        transform-box: fill-box;
        transform-origin: center;
      }
      .${BADGE_CLASS} .xrs-drop-aura {
        fill: var(--badge-aura);
        opacity: var(--badge-aura-opacity);
        transform: scale(1.08);
      }
      .${BADGE_CLASS} .xrs-drop-shell {
        fill: var(--badge-shell);
      }
      .${BADGE_CLASS} .xrs-drop-core {
        fill: var(--badge-core);
        opacity: var(--badge-core-opacity);
        transform: translateY(2px) scale(0.82);
      }
      .${BADGE_CLASS} .xrs-drop-rim {
        fill: none;
        stroke: var(--badge-rim);
        stroke-width: var(--badge-rim-width);
        stroke-linejoin: round;
        stroke-dasharray: var(--badge-rim-dash);
        opacity: var(--badge-rim-opacity);
      }
      .${BADGE_CLASS} .xrs-drop-highlight-main {
        fill: var(--badge-highlight-main);
        opacity: var(--badge-highlight-main-opacity);
      }
      .${BADGE_CLASS} .xrs-drop-highlight-tip {
        fill: var(--badge-highlight-tip);
        opacity: var(--badge-highlight-tip-opacity);
      }
      .${BADGE_LABEL_CLASS} {
        position: relative;
        z-index: 1;
        transform: translateY(1px);
        color: var(--badge-text);
        font: 700 10px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: -0.03em;
      }
      .${BADGE_CLASS}[data-tier="high"] {
        --badge-shell: #38d39f;
        --badge-core: #ddfff0;
        --badge-rim: rgba(180, 255, 220, 0.96);
        --badge-aura: rgba(52, 211, 153, 0.34);
        --badge-text: #042f1a;
      }
      .${BADGE_CLASS}[data-tier="good"] {
        --badge-shell: #f2cb57;
        --badge-core: #fff7d9;
        --badge-rim: rgba(255, 240, 179, 0.96);
        --badge-aura: rgba(250, 204, 21, 0.32);
        --badge-text: #422006;
      }
      .${BADGE_CLASS}[data-tier="medium"] {
        --badge-shell: #c9d7e8;
        --badge-core: #f6fbff;
        --badge-rim: rgba(239, 246, 255, 0.94);
        --badge-aura: rgba(148, 163, 184, 0.2);
        --badge-text: #0f172a;
      }
      .${BADGE_CLASS}[data-tier="high-outline"] {
        --badge-shell: rgba(34, 197, 94, 0.08);
        --badge-core: rgba(220, 252, 231, 0.06);
        --badge-text: #86efac;
        --badge-rim: #22c55e;
        --badge-rim-width: 1.35px;
        --badge-rim-dash: 2.2 1.6;
        --badge-aura: rgba(34, 197, 94, 0.16);
        --badge-aura-opacity: 0.48;
        --badge-core-opacity: 0.54;
        --badge-highlight-main-opacity: 0.18;
        --badge-highlight-tip-opacity: 0.26;
      }
      .${BADGE_CLASS}[data-tier="good-outline"] {
        --badge-shell: rgba(250, 204, 21, 0.08);
        --badge-core: rgba(255, 251, 219, 0.06);
        --badge-text: #fde68a;
        --badge-rim: #facc15;
        --badge-rim-width: 1.35px;
        --badge-rim-dash: 2.2 1.6;
        --badge-aura: rgba(250, 204, 21, 0.16);
        --badge-aura-opacity: 0.46;
        --badge-core-opacity: 0.54;
        --badge-highlight-main-opacity: 0.18;
        --badge-highlight-tip-opacity: 0.26;
      }
      .${BADGE_CLASS}[data-tier="medium-outline"] {
        --badge-shell: rgba(203, 213, 225, 0.08);
        --badge-core: rgba(248, 250, 252, 0.05);
        --badge-text: #e2e8f0;
        --badge-rim: #cbd5e1;
        --badge-rim-width: 1.35px;
        --badge-rim-dash: 2.2 1.6;
        --badge-aura: rgba(148, 163, 184, 0.12);
        --badge-aura-opacity: 0.42;
        --badge-core-opacity: 0.5;
        --badge-highlight-main-opacity: 0.16;
        --badge-highlight-tip-opacity: 0.22;
      }
      .${BADGE_CLASS}[data-tier="low-outline"] {
        --badge-shell: rgba(96, 165, 250, 0.07);
        --badge-core: rgba(239, 246, 255, 0.04);
        --badge-text: #bfdbfe;
        --badge-rim: rgba(147, 197, 253, 0.84);
        --badge-rim-width: 1.1px;
        --badge-rim-dash: 1.8 1.8;
        --badge-aura: rgba(96, 165, 250, 0.12);
        --badge-aura-opacity: 0.4;
        --badge-core-opacity: 0.46;
        --badge-highlight-main-opacity: 0.15;
        --badge-highlight-tip-opacity: 0.2;
      }
      .${BADGE_CLASS}[data-tier="replied"] {
        --badge-shell: #67e8f9;
        --badge-core: #f0feff;
        --badge-rim: rgba(224, 255, 255, 0.98);
        --badge-aura: rgba(34, 211, 238, 0.34);
        --badge-text: #155363;
        --badge-core-opacity: 0.82;
      }
      .${BADGE_CLASS}[data-tier="replied"] .${BADGE_LABEL_CLASS} {
        font-size: 13px;
        font-weight: 900;
        line-height: 1;
        transform: translateY(1px);
        text-shadow:
          0 1px 0 rgba(255, 255, 255, 0.72),
          0 0 6px rgba(21, 83, 99, 0.12);
      }
      .${BADGE_CLASS}[data-tier="hidden"] {
        display: none !important;
      }
      #${FLOAT_WIDGET_ID} {
        position: fixed;
        top: 74px;
        right: 18px;
        z-index: 2147483647;
        display: none;
      }
      #${FLOAT_WIDGET_ID}[data-visible="1"] {
        display: block;
      }
      #${FLOAT_PANEL_ID} {
        position: fixed;
        top: 78px;
        right: 80px;
        width: min(420px, calc(100vw - 28px));
        height: min(660px, calc(100vh - 110px));
        display: block;
        z-index: 2147483646;
        border-radius: 28px;
        overflow: hidden;
        border: 1px solid rgba(104, 84, 56, 0.18);
        box-shadow: 0 26px 56px rgba(59, 41, 17, 0.24);
        background:
          linear-gradient(180deg, rgba(255, 251, 241, 0.9), rgba(238, 225, 192, 0.94));
        backdrop-filter: blur(12px) saturate(115%);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform-origin: calc(100% - 24px) 24px;
        transform: translate3d(34px, -22px, 0) scale3d(0.22, 0.08, 1);
        clip-path: inset(0 0 calc(100% - 28px) calc(100% - 28px) round 28px);
        filter: saturate(0.82) blur(6px);
        transition:
          opacity 220ms ease,
          transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
          clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 300ms ease,
          visibility 0s linear 360ms;
      }
      #${FLOAT_PANEL_ID}[data-open="1"] {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
        clip-path: inset(0 0 0 0 round 28px);
        filter: none;
        transition:
          opacity 220ms ease,
          transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
          clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 300ms ease;
      }
      #${FLOAT_PANEL_ID}::before {
        content: "";
        position: absolute;
        top: 14px;
        bottom: 14px;
        right: 112px;
        border-right: 2px dashed rgba(104, 84, 56, 0.22);
        z-index: 1;
      }
      #${FLOAT_PANEL_ID} iframe {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
        background: transparent;
        transform-origin: top right;
        transform: scale(1.04) translateY(-6px);
        transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      #${FLOAT_PANEL_ID}[data-open="1"] iframe {
        transform: scale(1) translateY(0);
      }
      .${FLOAT_BUTTON_CLASS} {
        position: relative;
        width: 58px;
        height: 76px;
        border: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
        cursor: pointer;
        isolation: isolate;
        transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .${FLOAT_BUTTON_CLASS}::before {
        content: "";
        position: absolute;
        inset: -10px -8px -14px;
        background:
          radial-gradient(circle at 50% 22%, rgba(143, 247, 255, 0.34), transparent 42%),
          radial-gradient(circle at 50% 80%, rgba(86, 205, 255, 0.22), transparent 48%);
        filter: blur(12px);
        opacity: 0.96;
        z-index: 0;
        pointer-events: none;
        transition:
          transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 280ms ease;
      }
      .${FLOAT_BUTTON_CLASS}::after {
        content: "";
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 4px;
        height: 12px;
        background: radial-gradient(circle, rgba(103, 232, 249, 0.24), rgba(59, 130, 246, 0.08) 55%, transparent 74%);
        filter: blur(8px);
        border-radius: 999px;
        opacity: 0.72;
        z-index: 0;
        pointer-events: none;
      }
      .${FLOAT_BUTTON_CLASS}[data-open="1"] {
        transform: translateY(-2px) scale(1.04);
      }
      .${FLOAT_BUTTON_CLASS}[data-open="1"]::before {
        transform: scale(1.06);
        opacity: 1;
      }
      .${FLOAT_BUTTON_CLASS} svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        overflow: visible;
        filter:
          drop-shadow(0 16px 28px rgba(2, 6, 23, 0.4))
          drop-shadow(0 0 18px rgba(103, 232, 249, 0.14));
        animation: xrs-droplet-float 3.1s ease-in-out infinite;
      }
      .${FLOAT_BUTTON_CLASS} .xrs-float-drop-core {
        transform-box: fill-box;
        transform-origin: center;
        transform: translateY(2px) scale(0.84);
      }
      .${FLOAT_BUTTON_CLASS} .xrs-float-drop-aura {
        opacity: 0.86;
      }
      .${FLOAT_BUTTON_CLASS} .xrs-float-drop-rim {
        stroke-linejoin: round;
      }
      .${FLOAT_BUTTON_CLASS} .xrs-float-drop-highlight-main {
        fill: rgba(255, 255, 255, 0.42);
      }
      .${FLOAT_BUTTON_CLASS} .xrs-float-drop-highlight-tip {
        fill: rgba(255, 255, 255, 0.58);
      }
      .${FLOAT_BUTTON_CLASS} .xrs-float-drop-shine {
        fill: rgba(248, 254, 255, 0.22);
      }
      .${FLOAT_COUNT_CLASS} {
        position: absolute;
        left: 50%;
        top: 62%;
        min-width: 28px;
        height: 22px;
        padding: 0 6px;
        transform: translate(-50%, -50%);
        background: linear-gradient(180deg, rgba(7, 24, 44, 0.34), rgba(6, 19, 37, 0.58));
        color: #f8feff;
        border: 1px solid rgba(191, 245, 255, 0.22);
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.18),
          0 8px 16px rgba(3, 12, 24, 0.18);
        backdrop-filter: blur(8px) saturate(130%);
        font-size: 12px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: 0.02em;
        text-shadow: 0 1px 2px rgba(15, 23, 42, 0.55);
      }
      .${FLOAT_BUTTON_CLASS}[data-busy="1"] svg {
        transform: translateY(-1px);
      }
      @keyframes xrs-droplet-float {
        0%, 100% {
          transform: translateY(0) scale(1);
          filter:
            drop-shadow(0 16px 28px rgba(2, 6, 23, 0.4))
            drop-shadow(0 0 18px rgba(103, 232, 249, 0.14));
        }
        50% {
          transform: translateY(-3px) scale(1.035);
          filter:
            drop-shadow(0 20px 34px rgba(7, 16, 30, 0.38))
            drop-shadow(0 0 24px rgba(103, 232, 249, 0.2));
        }
      }
      @media (max-width: 900px) {
        #${FLOAT_PANEL_ID} {
          top: 84px;
          right: 12px;
          width: calc(100vw - 24px);
          height: min(640px, calc(100vh - 108px));
        }
      }
    `;
    document.head.appendChild(style);
  }

  function applyRemoteState(remoteState) {
    const base = remoteState || {};
    const defaults = global.XReplyScorer?.defaults || {};
    state.settings = {
      ...defaults,
      headlessMode: Boolean(base.headlessMode),
      displayThreshold: base.threshold ?? defaults.displayThreshold ?? 30,
      goodThreshold: defaults.goodThreshold ?? 60,
      highThreshold: defaults.highThreshold ?? 80
    };

    Object.keys(defaults).forEach((key) => {
      if (key === "displayThreshold" || key === "goodThreshold" || key === "highThreshold") {
        return;
      }
      if (base[key] !== undefined) {
        state.settings[key] = base[key];
      }
    });

    state.repliedTweets = { ...(base.repliedTweets || {}) };
    state.repliedTweetUrls = new Set(Object.keys(state.repliedTweets));
    state.dismissedTweets = { ...(base.dismissedTweets || {}) };
    state.dismissedTweetUrls = new Set(Object.keys(state.dismissedTweets));
    state.replyDetails = base.replyDetails && typeof base.replyDetails === "object" ? { ...base.replyDetails } : {};
    state.replyQueue = Array.isArray(base.replyQueue) ? base.replyQueue.slice() : [];
    state.relationshipStates = base.relationshipStates && typeof base.relationshipStates === "object" ? { ...base.relationshipStates } : {};
    state.stats = {
      scannedCount: Number(base.scannedCount) || 0,
      highScoreCount: Number(base.highScoreCount) || 0,
      visibleCount: Number(base.visibleCount) || 0
    };
    renderFloatingWidget();
  }

  async function loadSettings() {
    const response = await sendRuntimeMessage({ type: "X_REPLY_SCORER_GET_STATE" });
    applyRemoteState(response?.state);
  }

  function getTweetNodes() {
    return Array.from(document.querySelectorAll(ARTICLE_SELECTOR)).filter((node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }

      if (node.parentElement?.closest(ARTICLE_SELECTOR)) {
        return false;
      }

      return Boolean(
        node.querySelector("time[datetime]") ||
        node.querySelector('[data-testid="reply"]') ||
        node.querySelector('[data-testid="tweetText"]') ||
        node.querySelector('[data-testid="videoComponent"], video, [data-testid="tweetPhoto"], [data-testid="attachments"] img')
      );
    });
  }

  function scheduleScan() {
    clearTimeout(state.scanTimer);
    state.scanTimer = global.setTimeout(scanTweets, SCAN_DEBOUNCE_MS);
  }

  function invalidateCache() {
    getTweetNodes().forEach((article) => {
      delete article.dataset.xrsSignature;
    });
  }

  function clearLazyRescan() {
    clearTimeout(state.lazyRescanTimer);
    state.lazyRescanTimer = null;
  }

  function scheduleLazyRescan(delay = 900) {
    clearLazyRescan();
    state.lazyRescanTimer = global.setTimeout(() => {
      state.lazyRescanTimer = null;
      scanTweets();
    }, delay);
  }

  function sanitizeSnippet(text, maxLength = 160) {
    return String(text || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  function encodeCandidate(candidate) {
    try {
      return global.btoa(unescape(encodeURIComponent(JSON.stringify(candidate))));
    } catch (_error) {
      return "";
    }
  }

  function decodeCandidate(rawValue) {
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(decodeURIComponent(escape(global.atob(rawValue))));
    } catch (_error) {
      return null;
    }
  }

  function extractCountFromNode(node) {
    if (!node) {
      return null;
    }

    const candidates = [
      node.getAttribute("aria-label"),
      node.getAttribute("title"),
      node.textContent
    ].filter(Boolean);

    for (const candidate of candidates) {
      const parsed = global.XReplyScorer.parseCount(candidate);
      if (parsed != null) {
        return parsed;
      }
    }

    return null;
  }

  function queryActionNode(article, testId) {
    return (
      article.querySelector(`[data-testid="${testId}"]`) ||
      article.querySelector(`[data-testid="${testId}"] span`) ||
      null
    );
  }

  function queryInteractiveActionNode(article, testIds = []) {
    for (const testId of testIds) {
      const match = (
        article.querySelector(`button[data-testid="${testId}"]`) ||
        article.querySelector(`[role="button"][data-testid="${testId}"]`) ||
        article.querySelector(`[data-testid="${testId}"]`)
      );
      if (match) {
        return match;
      }
    }
    return null;
  }

  function queryPrimaryArticleActionNode(article, testIds = []) {
    if (!(article instanceof Element)) {
      return null;
    }

    const candidates = testIds.flatMap((testId) => (
      Array.from(article.querySelectorAll(
        `button[data-testid="${testId}"], [role="button"][data-testid="${testId}"], [data-testid="${testId}"]`
      ))
    ));
    const directVisible = candidates
      .filter((node) => (
        node instanceof HTMLElement &&
        node.closest(ARTICLE_SELECTOR) === article &&
        hasVisibleRect(node)
      ))
      .sort((left, right) => {
        const leftRect = left.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();
        return rightRect.top - leftRect.top;
      });

    return directVisible[0] || null;
  }

  function readViewsNode(article) {
    const candidates = [
      article.querySelector('[data-testid="analytics"]'),
      article.querySelector('[href$="/analytics"]'),
      article.querySelector('[aria-label*="View"]'),
      article.querySelector('[aria-label*="view"]'),
      article.querySelector('[aria-label*="观看"]'),
      article.querySelector('[aria-label*="查看"]')
    ];

    return candidates.find(Boolean) || null;
  }

  function readTweetUrl(article) {
    if (!(article instanceof Element)) {
      return "";
    }

    const authorHandle = readAuthorHandle(article);
    const links = Array.from(article.querySelectorAll('a[href*="/status/"]'))
      .filter((link) => link.closest(ARTICLE_SELECTOR) === article);
    const normalizedLinks = links
      .map((link) => ({
        link,
        url: normalizeTweetUrl(link.href || link.getAttribute("href") || ""),
        hasTime: Boolean(link.querySelector("time[datetime]"))
      }))
      .filter((entry) => entry.url);

    const matchingAuthorTimeLink = normalizedLinks.find((entry) => entry.hasTime && extractStatusAuthorHandle(entry.url) === authorHandle);
    if (matchingAuthorTimeLink?.url) {
      return matchingAuthorTimeLink.url;
    }

    const matchingAuthorLink = normalizedLinks.find((entry) => extractStatusAuthorHandle(entry.url) === authorHandle);
    if (matchingAuthorLink?.url) {
      return matchingAuthorLink.url;
    }

    const anyTimeLink = normalizedLinks.find((entry) => entry.hasTime);
    if (anyTimeLink?.url) {
      return anyTimeLink.url;
    }

    return normalizedLinks[0]?.url || "";
  }

  function readAuthorHandle(article) {
    const handleLink = Array.from(article.querySelectorAll('[data-testid="User-Name"] a[href]'))
      .map((node) => extractHandleFromHref(node.getAttribute("href")))
      .find(Boolean);

    return handleLink || "";
  }

  function readAuthorName(article) {
    const container = article.querySelector('[data-testid="User-Name"]');
    if (!(container instanceof HTMLElement)) {
      return "";
    }

    const parts = Array.from(container.querySelectorAll("span"))
      .map((node) => String(node.textContent || "").replace(/\s+/g, " ").trim())
      .filter(Boolean);

    return parts.find((text) => {
      if (!text) {
        return false;
      }
      if (text.startsWith("@")) {
        return false;
      }
      if (text === "·") {
        return false;
      }
      if (/^\d+[smhd]$/i.test(text)) {
        return false;
      }
      return true;
    }) || "";
  }

  function readCurrentUserHandle() {
    const profileLink = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
    const fromProfile = extractHandleFromHref(profileLink?.getAttribute("href"));
    if (fromProfile) {
      state.currentUserHandle = fromProfile;
      return fromProfile;
    }

    const switcher = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
    const match = switcher?.textContent?.match(/@([A-Za-z0-9_]+)/);
    if (match?.[1]) {
      state.currentUserHandle = normalizeHandle(match[1]);
      return state.currentUserHandle;
    }

    return state.currentUserHandle;
  }

  function normalizeSemanticText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function isMeaningfulMediaAltText(value) {
    const normalized = normalizeSemanticText(value);
    if (!normalized) {
      return false;
    }

    const lower = normalized.toLowerCase();
    const tokenCount = normalized
      .split(/[\s,.;:!?/\\|()[\]{}"'`~<>，。！？、]+/)
      .filter(Boolean)
      .length;

    if (/^(image|photo|picture|video|gif|embedded video|embedded image)$/i.test(normalized)) {
      return false;
    }

    if (
      (/^(image may contain|may be an image of|may contain)/i.test(normalized) ||
      /^(图片|圖片|照片|相片|图像|圖像|视频|視頻|影片|gif)$/i.test(lower)) &&
      (normalized.length < 48 || tokenCount <= 6)
    ) {
      return false;
    }

    return normalized.length >= 16 || tokenCount >= 4;
  }

  function readText(article) {
    const node = article.querySelector('[data-testid="tweetText"]');
    const directText = node?.innerText?.trim();
    if (directText) {
      return directText;
    }

    const fallbackText = Array.from(article.querySelectorAll('div[lang], span[lang]'))
      .map((item) => item.textContent?.trim() || "")
      .filter(Boolean)
      .join("\n")
      .trim();

    return fallbackText;
  }

  function readLanguageTags(article) {
    const sources = Array.from(article.querySelectorAll('[data-testid="tweetText"][lang], [data-testid="tweetText"] [lang], div[lang], span[lang]'));
    return Array.from(new Set(
      sources
        .map((node) => String(node.getAttribute("lang") || "").trim().toLowerCase())
        .filter(Boolean)
    ));
  }

  function readTimestamp(article) {
    const time = article.querySelector("time[datetime]");
    const datetime = time?.getAttribute("datetime");
    if (!datetime) {
      return null;
    }

    const timestamp = Date.parse(datetime);
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  function normalizeVerificationType(value, fallback = "") {
    const raw = String(value || fallback).trim().toLowerCase();
    if (!raw) {
      return "";
    }

    if (
      raw === "government" ||
      raw === "gray" ||
      raw === "grey" ||
      raw.includes("government") ||
      raw.includes("state-affiliated") ||
      raw.includes("state affiliated") ||
      raw.includes("multilateral") ||
      raw.includes("gov account") ||
      raw.includes("government account") ||
      raw.includes("灰标") ||
      raw.includes("灰標") ||
      raw.includes("政府") ||
      raw.includes("官方机构") ||
      raw.includes("官方機構")
    ) {
      return "government";
    }

    if (
      raw === "gold" ||
      raw === "organization" ||
      raw === "organisation" ||
      raw === "business" ||
      raw.includes("gold") ||
      raw.includes("organization") ||
      raw.includes("organisation") ||
      raw.includes("business") ||
      raw.includes("brand") ||
      raw.includes("company") ||
      raw.includes("企业") ||
      raw.includes("企業") ||
      raw.includes("品牌") ||
      raw.includes("机构") ||
      raw.includes("機構") ||
      raw.includes("组织") ||
      raw.includes("組織") ||
      raw.includes("金标") ||
      raw.includes("金標")
    ) {
      return "gold";
    }

    if (
      raw === "blue" ||
      raw === "verified" ||
      raw.includes("blue") ||
      raw.includes("verified") ||
      raw.includes("premium") ||
      raw.includes("blue check") ||
      raw.includes("已认证") ||
      raw.includes("已認證") ||
      raw.includes("蓝标") ||
      raw.includes("藍標") ||
      raw.includes("认证") ||
      raw.includes("認證")
    ) {
      return "blue";
    }

    return "";
  }

  function collectVerificationSignals(article) {
    const userName = article.querySelector('[data-testid="User-Name"]') || article;
    const icon = userName.querySelector('[data-testid="icon-verified"]');
    if (!(icon instanceof Element)) {
      return "";
    }

    const sources = [
      icon,
      icon.closest("span"),
      icon.closest("a"),
      icon.parentElement,
      icon.parentElement?.parentElement
    ].filter((node, index, list) => node instanceof Element && list.indexOf(node) === index);

    const values = [];
    sources.forEach((node) => {
      values.push(
        node.getAttribute?.("aria-label"),
        node.getAttribute?.("title"),
        node.getAttribute?.("data-testid")
      );
      const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
      if (text) {
        values.push(text);
      }
    });

    return values.filter(Boolean).join(" | ");
  }

  function parseColorChannels(value) {
    const match = String(value || "").match(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
    if (!match) {
      return null;
    }
    const red = Number(match[1]);
    const green = Number(match[2]);
    const blue = Number(match[3]);
    if (![red, green, blue].every(Number.isFinite)) {
      return null;
    }
    return { red, green, blue };
  }

  function readVerificationColorHint(node) {
    if (!(node instanceof Element)) {
      return "";
    }

    const colorNodes = [
      node,
      node.querySelector("svg"),
      node.querySelector("path")
    ].filter(Boolean);

    for (const colorNode of colorNodes) {
      const computed = global.getComputedStyle?.(colorNode);
      const channels = parseColorChannels(
        computed?.color ||
        computed?.fill ||
        colorNode.getAttribute?.("fill") ||
        colorNode.getAttribute?.("color") ||
        ""
      );
      if (!channels) {
        continue;
      }

      const { red, green, blue } = channels;
      if (red >= 170 && green >= 118 && blue <= 120) {
        return "gold";
      }
      if (Math.abs(red - green) <= 18 && Math.abs(green - blue) <= 18 && red >= 85 && red <= 200) {
        return "government";
      }
      if (blue >= red + 16 && blue >= green - 8) {
        return "blue";
      }
    }

    return "";
  }

  function readVerificationType(article) {
    const userName = article.querySelector('[data-testid="User-Name"]') || article;
    const icon = userName.querySelector('[data-testid="icon-verified"]');
    if (!(icon instanceof Element)) {
      return "";
    }

    const fromSignals = normalizeVerificationType(collectVerificationSignals(article));
    if (fromSignals) {
      return fromSignals;
    }

    const fromColor = readVerificationColorHint(icon);
    if (fromColor) {
      return fromColor;
    }

    return "blue";
  }

  function readVerified(article) {
    return Boolean(
      readVerificationType(article) ||
      article.querySelector('[data-testid="icon-verified"]') ||
      article.querySelector('[aria-label*="Verified"]') ||
      article.querySelector('[aria-label*="已认证"]')
    );
  }

  function readMediaAltText(article) {
    if (!(article instanceof Element)) {
      return "";
    }

    const values = [
      ...Array.from(article.querySelectorAll('[data-testid="tweetPhoto"] img[alt], [data-testid="card.wrapper"] img[alt], [data-testid="attachments"] img[alt]'))
        .map((node) => normalizeSemanticText(node.getAttribute("alt"))),
      ...Array.from(article.querySelectorAll('[data-testid="videoComponent"] video[aria-label], [data-testid="videoPlayer"] video[aria-label], [data-testid="attachments"] video[aria-label]'))
        .map((node) => normalizeSemanticText(node.getAttribute("aria-label")))
    ];

    return Array.from(new Set(values.filter(isMeaningfulMediaAltText)))
      .slice(0, 2)
      .join(" | ")
      .slice(0, 280);
  }

  function readMediaKind(article) {
    if (article.querySelector('[data-testid="videoComponent"], [data-testid="videoPlayer"], video, [aria-label*="GIF"], [aria-label*="Video"], [aria-label*="video"], [aria-label*="影片"], [aria-label*="视频"], [aria-label*="視頻"]')) {
      const gifNode = article.querySelector('[aria-label*="GIF"]');
      return gifNode ? "gif" : "video";
    }

    if (article.querySelector('[data-testid="tweetPhoto"], [data-testid="card.wrapper"] img[src*="media"], [data-testid="attachments"] img')) {
      return "photo";
    }

    return "";
  }

  function isPromotedArticle(article) {
    const explicitLabels = new Set(["ad", "promoted", "sponsored", "广告", "廣告", "赞助"]);
    const articleRect = article.getBoundingClientRect();
    const scopedNodes = Array.from(article.querySelectorAll("span, a, div")).slice(0, 60);

    return scopedNodes.some((node) => {
      const text = (node.textContent || "").trim().toLowerCase();
      if (!explicitLabels.has(text)) {
        return false;
      }

      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return false;
      }

      const nearTop = rect.top <= articleRect.top + Math.max(96, articleRect.height * 0.32);
      const nearRight = rect.left >= articleRect.left + articleRect.width * 0.52;
      return nearTop && nearRight;
    });
  }

  function buildSignature(tweet) {
    return [
      tweet.url || "",
      tweet.authorHandle || "",
      (tweet.text || "").replace(/\s+/g, " ").slice(0, 120),
      (tweet.mediaAltText || "").replace(/\s+/g, " ").slice(0, 120),
      (tweet.langs || []).join(","),
      tweet.hasReplyAction ? "reply" : "",
      tweet.hasActionGroup ? "group" : "",
      tweet.likes ?? "",
      tweet.replies ?? "",
      tweet.views ?? "",
      tweet.retweets ?? "",
      tweet.bookmarks ?? "",
      tweet.trafficVelocityPerHour ?? "",
      tweet.trafficReplyVelocityPerHour ?? "",
      tweet.trafficPhase ?? "",
      tweet.mediaKind ?? "",
      tweet.sourceSurface ?? "",
      tweet.timestamp ?? "",
      tweet.authorVerified ? "1" : "0",
      tweet.authorVerificationType || "",
      tweet.promoted ? "p" : "",
      tweet.isOwnTweet ? "me" : "",
      state.repliedTweetUrls.has(tweet.url) ? "replied" : ""
    ].join("|");
  }

  function getTweetData(article) {
    const authorHandle = readAuthorHandle(article);
    const authorName = readAuthorName(article);
    const authorVerificationType = readVerificationType(article);
    const currentUserHandle = readCurrentUserHandle();
    const replyAction = article.querySelector('[data-testid="reply"]');
    const tweet = {
      url: readTweetUrl(article),
      text: readText(article),
      langs: readLanguageTags(article),
      timestamp: readTimestamp(article),
      authorVerified: Boolean(authorVerificationType || readVerified(article)),
      authorVerificationType,
      mediaAltText: readMediaAltText(article),
      mediaKind: readMediaKind(article),
      promoted: isPromotedArticle(article),
      hasReplyAction: Boolean(replyAction),
      hasActionGroup: Boolean(replyAction?.closest('[role="group"]')),
      authorFollowers: null,
      authorName,
      authorHandle,
      sourceSurface: detectCurrentSourceSurface(),
      isOwnTweet: Boolean(authorHandle && currentUserHandle && authorHandle === currentUserHandle),
      likes: extractCountFromNode(queryActionNode(article, "like")),
      replies: extractCountFromNode(queryActionNode(article, "reply")),
      views: extractCountFromNode(readViewsNode(article))
    };

    const trafficSnapshot = getTrafficSnapshotByTweetId(extractTweetIdFromUrl(tweet.url));
    if (trafficSnapshot) {
      tweet.text = tweet.text || trafficSnapshot.text;
      tweet.timestamp = tweet.timestamp || trafficSnapshot.createdAt || null;
      tweet.views = Math.max(toNonNegativeNumber(tweet.views, 0), toNonNegativeNumber(trafficSnapshot.views, 0));
      tweet.likes = Math.max(toNonNegativeNumber(tweet.likes, 0), toNonNegativeNumber(trafficSnapshot.likes, 0));
      tweet.replies = Math.max(toNonNegativeNumber(tweet.replies, 0), toNonNegativeNumber(trafficSnapshot.replies, 0));
      tweet.retweets = toNonNegativeNumber(trafficSnapshot.retweets, 0);
      tweet.bookmarks = toNonNegativeNumber(trafficSnapshot.bookmarks, 0);
      tweet.trafficCapturedAt = toNonNegativeNumber(trafficSnapshot.trafficCapturedAt, 0);
      tweet.trafficAgeHours = toNonNegativeNumber(trafficSnapshot.trafficAgeHours, 0);
      tweet.trafficVelocityPerHour = toNonNegativeNumber(trafficSnapshot.trafficVelocityPerHour, 0);
      tweet.trafficReplyVelocityPerHour = toNonNegativeNumber(trafficSnapshot.trafficReplyVelocityPerHour, 0);
      tweet.trafficEngagementRate = toNonNegativeNumber(trafficSnapshot.trafficEngagementRate, 0);
      tweet.trafficReplyRatio = toNonNegativeNumber(trafficSnapshot.trafficReplyRatio, 0);
      tweet.trafficPhase = normalizeTrafficPhase(trafficSnapshot.trafficPhase);
      tweet.trafficSource = String(trafficSnapshot.trafficSource || "").trim();
    }
    tweet.hasMedia = Boolean(tweet.mediaKind);

    tweet.signature = buildSignature(tweet);
    return tweet;
  }

  function positionBadgeAnchor(article, anchor) {
    const replyButton = article.querySelector('[data-testid="reply"]');
    article.dataset.xrsPositioned = "1";
    anchor.dataset.placement = "article";
    anchor.style.zIndex = "12";
    anchor.style.left = "6px";
    anchor.style.top = "";
    anchor.style.bottom = "6px";

    if (!(replyButton instanceof HTMLElement)) {
      return;
    }

    const articleRect = article.getBoundingClientRect();
    const replyRect = replyButton.getBoundingClientRect();
    if (!articleRect.width || !replyRect.width) {
      return;
    }

    const badgeWidth = 24;
    const sideGap = 10;
    const minLeft = 4;
    const rawLeft = Math.round(replyRect.left - articleRect.left - badgeWidth - sideGap);
    const rawTop = Math.round(replyRect.top - articleRect.top + (replyRect.height - 29) / 2);
    const maxLeft = Math.max(minLeft, Math.round(articleRect.width - badgeWidth - 4));
    const maxTop = Math.max(0, Math.round(articleRect.height - 31));
    const left = Math.min(maxLeft, Math.max(minLeft, rawLeft));
    const top = Math.min(maxTop, Math.max(0, rawTop));
    anchor.style.left = `${left}px`;
    anchor.style.top = `${top}px`;
    anchor.style.bottom = "auto";
  }

  function ensureBadgeAnchor(article) {
    let anchor = article.querySelector(`:scope > .${BADGE_ANCHOR_CLASS}[data-placement="article"]`);
    if (!(anchor instanceof HTMLElement)) {
      anchor = document.createElement("div");
      anchor.className = BADGE_ANCHOR_CLASS;
      anchor.dataset.placement = "article";
      article.appendChild(anchor);
    }
    anchor.style.zIndex = "12";
    positionBadgeAnchor(article, anchor);
    return anchor;
  }

  function ensureBadge(article) {
    const anchor = ensureBadgeAnchor(article);
    let badge = anchor.querySelector(`.${BADGE_CLASS}`);
    if (badge instanceof HTMLElement) {
      return badge;
    }

    badge = document.createElement("div");
    badge.className = BADGE_CLASS;
    badge.setAttribute("data-tier", "hidden");
    badge.innerHTML = `${DROP_SVG}<span class="${BADGE_LABEL_CLASS}"></span>`;
    anchor.appendChild(badge);
    return badge;
  }

  function renderBadge(article, labelText, tier, titleText = "") {
    const badge = ensureBadge(article);
    const label = badge.querySelector(`.${BADGE_LABEL_CLASS}`);
    if (!state.settings.enabled || tier === "hidden") {
      badge.setAttribute("data-tier", "hidden");
      badge.removeAttribute("title");
      if (label) {
        label.textContent = "";
      }
      return;
    }

    badge.setAttribute("data-tier", tier);
    if (titleText) {
      badge.title = titleText;
    } else {
      badge.removeAttribute("title");
    }
    if (label) {
      label.textContent = labelText;
    }
  }

  function buildCandidateSemanticText(tweet, maxLength = 220) {
    const text = sanitizeSnippet(tweet?.text, maxLength);
    const altText = sanitizeSnippet(tweet?.mediaAltText, maxLength);
    if (!text) {
      return altText;
    }
    if (!altText) {
      return text;
    }

    const lowerText = text.toLowerCase();
    const lowerAlt = altText.toLowerCase();
    if (lowerText.includes(lowerAlt)) {
      return text;
    }
    if (lowerAlt.includes(lowerText)) {
      return altText;
    }
    if (text.length >= 96) {
      return text;
    }
    return sanitizeSnippet(`${text} | ${altText}`, maxLength);
  }

  function buildCandidatePayload(tweet, analysis, effectiveTier) {
    return {
      url: tweet.url,
      score: analysis.score,
      baseScore: Number(analysis.baseScore || analysis.score || 0),
      opportunityBoost: Number(analysis.opportunityBoost || 0),
      tier: effectiveTier,
      baseTier: String(analysis.baseTier || analysis.tier || effectiveTier),
      relationshipStatus: String(analysis.relationshipStatus || "").trim(),
      attributionKind: String(analysis.attributionKind || "").trim(),
      authorHandle: tweet.authorHandle,
      authorVerified: Boolean(tweet.authorVerified),
      authorVerificationType: String(tweet.authorVerificationType || "").trim(),
      text: buildCandidateSemanticText(tweet),
      mediaAltText: sanitizeSnippet(tweet.mediaAltText, 220),
      sourceSurface: String(tweet.sourceSurface || analysis.sourceSurface || "").trim(),
      postScore: Number(analysis.postScore || analysis.score || 0),
      reachLikelihood: Number(analysis.reachLikelihood || 0),
      understandingConfidence: Number(analysis.understandingConfidence || 0),
      authorFit: Number(analysis.authorFit || 0),
      finalScore: Number(analysis.finalScore || analysis.score || 0),
      blockReason: String(analysis.blockReason || "").trim(),
      lowSemanticConfidence: Boolean(analysis.lowSemanticConfidence),
      timestamp: tweet.timestamp || Date.now(),
      mediaKind: tweet.mediaKind || "",
      likes: tweet.likes || 0,
      replies: tweet.replies || 0,
      views: tweet.views || 0,
      retweets: tweet.retweets || 0,
      bookmarks: tweet.bookmarks || 0,
      trafficCapturedAt: tweet.trafficCapturedAt || 0,
      trafficAgeHours: tweet.trafficAgeHours || 0,
      trafficVelocityPerHour: tweet.trafficVelocityPerHour || 0,
      trafficReplyVelocityPerHour: tweet.trafficReplyVelocityPerHour || 0,
      trafficEngagementRate: tweet.trafficEngagementRate || 0,
      trafficReplyRatio: tweet.trafficReplyRatio || 0,
      trafficPhase: tweet.trafficPhase || "",
      trafficSource: tweet.trafficSource || "",
      highlights: Array.isArray(analysis.highlights) ? analysis.highlights.slice(0, 4) : [],
      keywordMatched: Boolean(analysis.keywordMatched),
      matchedTopics: Array.isArray(analysis.matchedTopics) ? analysis.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(analysis.matchedLanguages) ? analysis.matchedLanguages.slice(0, 4) : []
    };
  }

  function buildReplyEntriesForAttribution() {
    return Object.entries(state.replyDetails || {})
      .map(([url, detail]) => ({
        url: normalizeTweetUrl(url),
        ...(detail && typeof detail === "object" ? detail : {})
      }))
      .filter((entry) => entry.url);
  }

  function buildOpportunityContext() {
    const relationshipStates = state.relationshipStates && typeof state.relationshipStates === "object"
      ? state.relationshipStates
      : {};

    let attributionModel = null;
    if (typeof global.ReplyDropAttributionCore?.buildAttributionSignalModel === "function") {
      attributionModel = global.ReplyDropAttributionCore.buildAttributionSignalModel(
        buildReplyEntriesForAttribution(),
        Array.isArray(state.replyQueue) ? state.replyQueue : [],
        [],
        { now: Date.now() }
      );
    }

    return {
      relationshipStates,
      attributionModel
    };
  }

  function formatBreakdownText(item) {
    const rounded = Math.round(Number(item?.amount) || 0);
    const sign = rounded > 0 ? "+" : "";
    return `${item.label} ${sign}${rounded}`;
  }

  function hasAnalysisPenaltyKey(analysis, penaltyKey) {
    if (!analysis || !Array.isArray(analysis.breakdown) || !penaltyKey) {
      return false;
    }
    return analysis.breakdown.some((item) => (
      item &&
      item.amount < 0 &&
      String(item.key || "").trim() === penaltyKey
    ));
  }

  function getRelationshipOpportunitySignal(tweet, analysis, attributionSignal, relationshipStates = {}) {
    const key = normalizeHandle(tweet?.authorHandle);
    const detail = key ? relationshipStates?.[key] : null;
    if (!key || !detail || typeof detail !== "object") {
      return null;
    }

    const status = String(detail.status || "").trim();
    if (status === "snoozed" && Number(detail.snoozeUntil || 0) <= Date.now()) {
      return null;
    }

    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    const replies = Number(tweet?.replies || 0);
    const views = Number(tweet?.views || 0);
    const likes = Number(tweet?.likes || 0);
    const reachLikelihood = Number(analysis?.reachLikelihood || 0);
    const conversationRatio = views > 0 ? (replies / Math.max(views, 1)) : 0;
    const likeReplyRatio = likes > 0 && replies > 0 ? (likes / Math.max(replies, 1)) : 0;
    const crowded = replies >= 48 || (views >= 40000 && replies >= 24);
    const broadcastHeavy = (
      (views >= 18000 && conversationRatio > 0 && conversationRatio < 0.0038) ||
      likeReplyRatio >= 14
    );
    const strongMemory = attributionSignal?.kind === "author-engaged" || attributionSignal?.kind === "handle-picked-up";
    const someMemory = strongMemory || attributionSignal?.kind === "topic-validated";
    const followTrainRisk = hasAnalysisPenaltyKey(analysis, "followTrainBait");
    const pileOnRisk = (
      followTrainRisk ||
      hasAnalysisPenaltyKey(analysis, "crowding") ||
      hasAnalysisPenaltyKey(analysis, "verifiedOrganization") ||
      hasAnalysisPenaltyKey(analysis, "verifiedPileOn") ||
      hasAnalysisPenaltyKey(analysis, "politicalFigure") ||
      hasAnalysisPenaltyKey(analysis, "broadcastAccount")
    );

    switch (status) {
      case "mutual": {
        if (followTrainRisk && !strongMemory) {
          return null;
        }
        let amount = strongMemory ? 14 : 10;
        if (!strongMemory) {
          if (verificationType === "government" || verificationType === "gold") {
            amount -= 8;
          } else if (verificationType === "blue" || tweet?.authorVerified) {
            amount -= 4;
          }
          if (crowded || broadcastHeavy) {
            amount -= 4;
          }
          if (reachLikelihood > 0 && reachLikelihood < 60) {
            amount -= 3;
          }
          if (pileOnRisk) {
            amount -= 4;
          }
        }
        amount = Math.max(0, Math.min(16, Math.round(amount)));
        if (amount < 2) {
          return null;
        }
        return {
          status,
          amount,
          label: strongMemory ? "Validated mutual lane" : "Mutual lane",
          highlight: strongMemory ? "mutual picked up before" : "mutual handle"
        };
      }
      case "pinned": {
        if (followTrainRisk && !strongMemory) {
          return null;
        }
        let amount = someMemory ? 10 : 8;
        if (!strongMemory) {
          if (verificationType === "government" || verificationType === "gold") {
            amount -= 4;
          } else if (verificationType === "blue" || tweet?.authorVerified) {
            amount -= 2;
          }
          if (crowded || broadcastHeavy) {
            amount -= 3;
          }
          if (reachLikelihood > 0 && reachLikelihood < 58) {
            amount -= 2;
          }
          if (pileOnRisk) {
            amount -= 3;
          }
        }
        amount = Math.max(0, Math.min(12, Math.round(amount)));
        if (amount < 2) {
          return null;
        }
        return {
          status,
          amount,
          label: "Relationship lane",
          highlight: someMemory ? "warm handle validated" : "warm handle"
        };
      }
      case "follow-up": {
        if (followTrainRisk && !strongMemory) {
          return null;
        }
        let amount = someMemory ? 8 : 6;
        if (!strongMemory && (crowded || broadcastHeavy)) {
          amount -= 2;
        }
        if (!strongMemory && pileOnRisk) {
          amount -= 2;
        }
        if (verificationType === "government" || verificationType === "gold") {
          amount -= 2;
        }
        amount = Math.max(0, Math.min(10, Math.round(amount)));
        if (amount < 2) {
          return null;
        }
        return {
          status,
          amount,
          label: "Follow-up handle",
          highlight: "follow-up handle"
        };
      }
      case "snoozed":
        return {
          status,
          amount: -18,
          label: "Snoozed handle",
          highlight: "snoozed"
        };
      default:
        return null;
    }
  }

  function getAttributionOpportunitySignal(candidate, attributionModel = null) {
    if (
      !candidate ||
      !attributionModel ||
      typeof global.ReplyDropAttributionCore?.summarizeCandidateAttribution !== "function"
    ) {
      return null;
    }

    const summary = global.ReplyDropAttributionCore.summarizeCandidateAttribution(candidate, attributionModel);
    if (!summary) {
      return null;
    }

    const rawBoost = typeof global.ReplyDropAttributionCore?.getCandidateAttributionBoost === "function"
      ? Number(global.ReplyDropAttributionCore.getCandidateAttributionBoost(candidate, attributionModel) || 0)
      : 0;
    const scaledBoost = Math.max(0, Math.round(Math.min(18, rawBoost * 0.75)));

    if (summary.kind === "author-engaged") {
      return {
        kind: summary.kind,
        amount: Math.max(14, scaledBoost),
        label: "Author memory",
        highlight: "author replied before"
      };
    }
    if (summary.kind === "handle-picked-up") {
      return {
        kind: summary.kind,
        amount: Math.max(10, scaledBoost),
        label: "Picked-up history",
        highlight: "picked up before"
      };
    }
    if (summary.kind === "topic-validated") {
      return {
        kind: summary.kind,
        amount: Math.max(6, scaledBoost),
        label: "Topic memory",
        highlight: "validated topic"
      };
    }

    return {
      kind: summary.kind,
      amount: Math.max(3, scaledBoost),
      label: "Reviewed memory",
      highlight: "reviewed before"
    };
  }

  function applyOpportunityAdjustments(tweet, analysis, settings, opportunityContext) {
    if (!analysis || !opportunityContext) {
      return analysis;
    }

    const breakdown = Array.isArray(analysis.breakdown) ? analysis.breakdown.slice() : [];
    const baseScore = Number(analysis.score || 0);
    let score = baseScore;
    const extraHighlights = [];

    const attributionSignal = getAttributionOpportunitySignal({
      url: tweet.url,
      authorHandle: tweet.authorHandle,
      matchedTopics: Array.isArray(analysis.matchedTopics) ? analysis.matchedTopics.slice(0, 4) : []
    }, opportunityContext.attributionModel);
    if (attributionSignal?.amount) {
      score += attributionSignal.amount;
      breakdown.push({
        key: "attribution",
        label: attributionSignal.label,
        amount: attributionSignal.amount,
        kind: "memory"
      });
      if (attributionSignal.highlight) {
        extraHighlights.push(attributionSignal.highlight);
      }
    }

    const relationshipSignal = getRelationshipOpportunitySignal(tweet, analysis, attributionSignal, opportunityContext.relationshipStates);
    if (relationshipSignal?.amount) {
      score += relationshipSignal.amount;
      breakdown.push({
        key: "relationship",
        label: relationshipSignal.label,
        amount: relationshipSignal.amount,
        kind: relationshipSignal.amount > 0 ? "relationship" : "penalty"
      });
      if (relationshipSignal.highlight) {
        extraHighlights.push(relationshipSignal.highlight);
      }
    }

    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
    const tier = global.XReplyScorer.getTier(clampedScore, settings, analysis.keywordMatched);
    const scoredBreakdown = breakdown
      .filter((item) => Number.isFinite(item?.amount) && Math.abs(item.amount) > 0);
    const sortedBreakdown = scoredBreakdown
      .slice()
      .sort((left, right) => Math.abs(right.amount) - Math.abs(left.amount));
    const positiveBreakdown = scoredBreakdown
      .filter((item) => item.amount > 0)
      .sort((left, right) => right.amount - left.amount);
    const negativeBreakdown = scoredBreakdown
      .filter((item) => item.amount < 0)
      .sort((left, right) => left.amount - right.amount);
    const highlights = Array.from(new Set([
      ...extraHighlights,
      ...(Array.isArray(analysis.highlights) ? analysis.highlights : [])
    ].filter(Boolean))).slice(0, 4);
    const tooltipLines = [
      `Score ${clampedScore} · ${tier}`,
      ...positiveBreakdown.slice(0, 4).map(formatBreakdownText),
      ...negativeBreakdown.slice(0, 2).map(formatBreakdownText)
    ];

    return {
      ...analysis,
      score: clampedScore,
      tier,
      breakdown: sortedBreakdown,
      highlights,
      tooltip: tooltipLines.join("\n"),
      finalScore: clampedScore,
      peakFinalScore: Math.max(
        Math.round(Number(analysis.peakFinalScore ?? analysis.finalScore ?? baseScore) || 0),
        clampedScore
      ),
      baseScore: Math.round(baseScore),
      baseTier: analysis.tier,
      opportunityBoost: clampedScore - Math.round(baseScore),
      relationshipStatus: relationshipSignal?.status || "",
      attributionKind: attributionSignal?.kind || ""
    };
  }

  function storeCandidatePayload(article, candidate) {
    const encoded = encodeCandidate(candidate);
    if (encoded) {
      article.dataset.xrsCandidate = encoded;
    } else {
      delete article.dataset.xrsCandidate;
    }
  }

  function readStoredCandidate(article) {
    return decodeCandidate(article.dataset.xrsCandidate || "");
  }

  function hideAllBadges() {
    document.querySelectorAll(`.${BADGE_CLASS}`).forEach((badge) => {
      badge.setAttribute("data-tier", "hidden");
      badge.removeAttribute("title");
      const label = badge.querySelector(`.${BADGE_LABEL_CLASS}`);
      if (label) {
        label.textContent = "";
      }
    });
  }

  function isFloatingUiDisabled() {
    return Boolean(state.settings.headlessMode);
  }

  function teardownFloatingUi() {
    document.getElementById(FLOAT_PANEL_ID)?.remove();
    document.getElementById(FLOAT_WIDGET_ID)?.remove();
  }

  function ensureFloatingWidget() {
    if (isFloatingUiDisabled()) {
      return null;
    }

    let widget = document.getElementById(FLOAT_WIDGET_ID);
    if (widget instanceof HTMLElement) {
      return widget;
    }

    widget = document.createElement("div");
    widget.id = FLOAT_WIDGET_ID;
    widget.dataset.visible = "0";
    widget.innerHTML = `
      <button class="${FLOAT_BUTTON_CLASS}" type="button" aria-label="Open ReplyDrop panel" title="打开 ReplyDrop 面板" aria-expanded="false" data-open="0">
        ${FLOAT_DROP_SVG}
        <span class="${FLOAT_COUNT_CLASS}">0</span>
      </button>
    `;
    document.body.appendChild(widget);

    const button = widget.querySelector(`.${FLOAT_BUTTON_CLASS}`);
    button?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const panel = ensureFloatingPanel();
      if (panel instanceof HTMLElement) {
        setFloatingPanelOpen(panel.dataset.open !== "1");
      }
    });

    return widget;
  }

  function setFloatingPanelOpen(open) {
    const panel = ensureFloatingPanel();
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    const next = open ? "1" : "0";
    panel.dataset.open = next;
    const button = document.querySelector(`#${FLOAT_WIDGET_ID} .${FLOAT_BUTTON_CLASS}`);
    if (button instanceof HTMLElement) {
      button.dataset.open = next;
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }

  function ensureFloatingPanel() {
    if (isFloatingUiDisabled()) {
      return null;
    }

    let panel = document.getElementById(FLOAT_PANEL_ID);
    if (panel instanceof HTMLElement) {
      return panel;
    }

    panel = document.createElement("div");
    panel.id = FLOAT_PANEL_ID;
    panel.dataset.open = "0";

    const frame = document.createElement("iframe");
    frame.src = chrome.runtime.getURL("popup.html?embedded=1");
    frame.title = "ReplyDrop panel";
    panel.appendChild(frame);
    document.body.appendChild(panel);

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      const widget = document.getElementById(FLOAT_WIDGET_ID);
      const clickedWidget = widget?.contains(event.target);
      const clickedPanel = panel.contains(event.target);
      if (!clickedWidget && !clickedPanel) {
        setFloatingPanelOpen(false);
      }
    }, true);

    return panel;
  }

  function renderFloatingWidget() {
    if (isFloatingUiDisabled()) {
      teardownFloatingUi();
      return;
    }

    const widget = ensureFloatingWidget();
    if (!(widget instanceof HTMLElement)) {
      return;
    }
    ensureFloatingPanel();
    const visible = state.settings.enabled ? "1" : "0";
    widget.dataset.visible = visible;
    const panel = document.getElementById(FLOAT_PANEL_ID);
    if (visible !== "1" && panel instanceof HTMLElement) {
      setFloatingPanelOpen(false);
    }

    const todayReplyCount = getTodayReplyCount(state.repliedTweets);
    const count = widget.querySelector(`.${FLOAT_COUNT_CLASS}`);

    if (count) {
      count.textContent = String(todayReplyCount);
    }
  }

  function getPopupBridgeStatus() {
    const widget = document.getElementById(FLOAT_WIDGET_ID);
    const panel = document.getElementById(FLOAT_PANEL_ID);
    const button = document.querySelector(`#${FLOAT_WIDGET_ID} .${FLOAT_BUTTON_CLASS}`);
    return {
      enabled: Boolean(state.settings.enabled),
      widgetReady: widget instanceof HTMLElement,
      widgetVisible: widget instanceof HTMLElement && widget.dataset.visible === "1",
      panelReady: panel instanceof HTMLElement,
      panelOpen: panel instanceof HTMLElement && panel.dataset.open === "1",
      buttonOpen: button instanceof HTMLElement && button.dataset.open === "1"
    };
  }

  function setLocalStats(stats) {
    const recentCandidates = Array.isArray(stats?.recentCandidates)
      ? stats.recentCandidates.filter((item) => normalizeTweetUrl(item?.url)).slice(0, 16)
      : state.recentCandidates;
    state.stats = {
      scannedCount: Math.max(0, Math.floor(Number(stats.scannedCount) || 0)),
      highScoreCount: Math.max(0, Math.floor(Number(stats.highScoreCount) || 0)),
      visibleCount: Math.max(0, Math.floor(Number(stats.visibleCount) || 0))
    };
    state.recentCandidates = recentCandidates;
    renderFloatingWidget();
  }

  async function publishStats(stats) {
    setLocalStats(stats);

    const now = Date.now();
    if (now - state.lastSentAt < 800) {
      return;
    }

    state.lastSentAt = now;
    await sendRuntimeMessage({
      type: "X_REPLY_SCORER_STATS_UPDATE",
      scannedCount: stats.scannedCount,
      highScoreCount: stats.highScoreCount,
      visibleCount: stats.visibleCount,
      recentCandidates: stats.recentCandidates || []
    });
  }

  async function markTweetAsReplied(url, meta = null) {
    const normalized = normalizeTweetUrl(url);
    if (!normalized) {
      return;
    }

    state.repliedTweets[normalized] = Date.now();
    state.repliedTweetUrls.add(normalized);
    renderFloatingWidget();
    invalidateCache();
    scheduleScan();
    await sendRuntimeMessage({
      type: "X_REPLY_SCORER_MARK_REPLIED",
      url: normalized,
      meta: meta || undefined
    });
  }

  function scanTweets() {
    if (!global.XReplyScorer) {
      return;
    }

    readCurrentUserHandle();

    if (!state.settings.enabled) {
      hideAllBadges();
      setLocalStats({ scannedCount: 0, highScoreCount: 0, visibleCount: 0 });
      publishStats({ scannedCount: 0, highScoreCount: 0, visibleCount: 0 });
      return;
    }

    const articles = getTweetNodes();
    let scannedCount = 0;
    let highScoreCount = 0;
    let visibleCount = 0;
    let needsFollowUp = false;
    const recentCandidates = [];
    const opportunityContext = buildOpportunityContext();

    for (const article of articles) {
      try {
        const tweet = getTweetData(article);
        const coreReady = Boolean(tweet.url && tweet.timestamp && (tweet.text || tweet.hasMedia));
        const layoutReady = Boolean(tweet.hasReplyAction);
        const canCache = coreReady && layoutReady;

        const existingBadge = article.querySelector(`.${BADGE_CLASS}`);
        if (article.dataset.xrsSignature === tweet.signature && canCache && existingBadge) {
          scannedCount += 1;
          ensureBadgeAnchor(article);
          const existingTier = existingBadge.getAttribute("data-tier");
          const existingCandidate = readStoredCandidate(article);
          if (existingTier && existingTier !== "hidden" && existingTier !== "replied") {
            visibleCount += 1;
            if (existingCandidate) {
              recentCandidates.push(existingCandidate);
            }
          }
          if (existingTier === "high" || existingTier === "good") {
            highScoreCount += 1;
          }
          continue;
        }

        article.dataset.xrsSignature = tweet.signature;
        scannedCount += 1;
        if (!canCache) {
          needsFollowUp = true;
        }

        if (tweet.promoted || tweet.isOwnTweet) {
          delete article.dataset.xrsCandidate;
          renderBadge(article, "", "hidden");
          continue;
        }

        if (tweet.url && state.repliedTweetUrls.has(tweet.url)) {
          delete article.dataset.xrsCandidate;
          renderBadge(article, "✓", "replied", "Already replied");
          continue;
        }

        if (tweet.url && state.dismissedTweetUrls.has(tweet.url)) {
          delete article.dataset.xrsCandidate;
          renderBadge(article, "", "hidden");
          continue;
        }

        const baseAnalysis = global.XReplyScorer.analyzeTweet(tweet, state.settings);
        const analysis = applyOpportunityAdjustments(tweet, baseAnalysis, state.settings, opportunityContext);
        const effectiveTier = (
          analysis.tier === "hidden" &&
          tweet.hasMedia
        ) ? "low-outline" : analysis.tier;

        renderBadge(article, String(analysis.score), effectiveTier, analysis.tooltip || `Reply score ${analysis.score}`);

        if (effectiveTier !== "hidden") {
          visibleCount += 1;
          const candidate = buildCandidatePayload(tweet, analysis, effectiveTier);
          storeCandidatePayload(article, candidate);
          recentCandidates.push(candidate);
        } else {
          delete article.dataset.xrsCandidate;
        }
        if (effectiveTier === "high" || effectiveTier === "good") {
          highScoreCount += 1;
        }
      } catch (error) {
        scannedCount += 1;
        console.warn("[ReplyDrop] failed to scan tweet", error, article);
      }
    }

    publishStats({
      scannedCount,
      highScoreCount,
      visibleCount,
      recentCandidates: recentCandidates
        .sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
        .slice(0, 16)
    });

    if (needsFollowUp && Date.now() - state.lastDomChangeAt < 8000) {
      scheduleLazyRescan(950);
    } else {
      clearLazyRescan();
    }
  }

  function startObserver() {
    if (state.observer) {
      state.observer.disconnect();
    }

    state.observer = new MutationObserver(() => {
      state.lastDomChangeAt = Date.now();
      scheduleScan();
    });

    state.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "title", "href", "datetime", "src"]
    });
  }

  function bindRuntimeListener() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type === "X_REPLY_SCORER_PAGE_STATUS") {
        renderFloatingWidget();
        sendResponse({ ok: true, status: getPopupBridgeStatus() });
        return true;
      }

      if (message?.type === "X_REPLY_SCORER_OPEN_PANEL") {
        renderFloatingWidget();
        if (state.settings.enabled) {
          setFloatingPanelOpen(true);
          sendResponse({ ok: true, status: getPopupBridgeStatus() });
        } else {
          sendResponse({ ok: false, reason: "disabled", status: getPopupBridgeStatus() });
        }
        return true;
      }

      if (message?.type === "X_REPLY_SCORER_OPEN_QUEUE_COMPOSER") {
        openQueueComposerHandoff(message.payload || {}).then((result) => {
          sendResponse(result);
        }).catch((error) => {
          sendResponse({ ok: false, reason: String(error?.message || error) });
        });
        return true;
      }

      if (message?.type === "X_REPLY_SCORER_CAPTURE_PICKUP_SNAPSHOT") {
        capturePickupSnapshot(message.payload || {}).then((result) => {
          sendResponse(result);
        }).catch((error) => {
          sendResponse({ ok: false, reason: String(error?.message || error) });
        });
        return true;
      }

      if (message?.type !== "X_REPLY_SCORER_STATE_CHANGED" || !message.state) {
        return;
      }

      if (message.reason === "stats") {
        state.stats = {
          scannedCount: Number(message.state.scannedCount) || 0,
          highScoreCount: Number(message.state.highScoreCount) || 0,
          visibleCount: Number(message.state.visibleCount) || 0
        };
        renderFloatingWidget();
        return;
      }

      applyRemoteState(message.state);
      invalidateCache();
      if (!state.settings.enabled) {
        hideAllBadges();
      }
      scheduleScan();
      // Fire-and-forget state broadcasts should not keep the sender waiting for
      // an async reply. Returning true here can stall background writes.
      return;
    });
  }

  function getCurrentStatusUrl() {
    const match = global.location.pathname.match(/^\/([^/]+)\/status\/(\d+)/);
    if (!match?.[1] || !match?.[2]) {
      return "";
    }
    return normalizeTweetUrl(`https://x.com/${match[1]}/status/${match[2]}`);
  }

  function getContextStatusUrl() {
    const dialogArticle = document.querySelector(
      '[aria-modal="true"] article[data-testid="tweet"], [role="dialog"] article[data-testid="tweet"], [data-testid="sheetDialog"] article[data-testid="tweet"]'
    );
    const dialogUrl = readTweetUrl(dialogArticle);
    if (dialogUrl) {
      return dialogUrl;
    }

    return "";
  }

  function waitFor(ms) {
    return new Promise((resolve) => {
      global.setTimeout(resolve, ms);
    });
  }

  function normalizeApiTimestampMs(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw) || raw <= 0) {
      return 0;
    }
    return raw < 1e12 ? Math.round(raw * 1000) : Math.round(raw);
  }

  function buildReplyDropExecutionPolicy(startedAt = Date.now()) {
    const normalizedStartedAt = normalizeApiTimestampMs(startedAt) || Date.now();
    return {
      targetGoalMs: EXECUTOR_TARGET_GOAL_MS,
      targetTimeoutMs: EXECUTOR_TARGET_TIMEOUT_MS,
      emptyInboxMinRescans: EXECUTOR_EMPTY_INBOX_MIN_RESCANS,
      emptyInboxInstruction: "如果本轮没有 recommendedDecision=reply-now 的合格候选，必须先刷新/滚动重扫至少3轮，再报告无合格推荐。",
      targetStartedAt: normalizedStartedAt,
      targetDeadlineAt: normalizedStartedAt + EXECUTOR_TARGET_TIMEOUT_MS,
      switchTargetReasonCode: "target-timeout"
    };
  }

  function getPayloadTargetStartedAt(payload = {}) {
    const startedAt = normalizeApiTimestampMs(
      payload?.targetStartedAt ||
      payload?.startedAt ||
      payload?.actionStartedAt ||
      payload?.executionStartedAt ||
      payload?.executionPolicy?.targetStartedAt ||
      payload?.execution?.targetStartedAt
    );
    if (startedAt) {
      return startedAt;
    }
    const deadlineAt = normalizeApiTimestampMs(
      payload?.targetDeadlineAt ||
      payload?.deadlineAt ||
      payload?.executionPolicy?.targetDeadlineAt ||
      payload?.execution?.targetDeadlineAt
    );
    return deadlineAt ? Math.max(1, deadlineAt - EXECUTOR_TARGET_TIMEOUT_MS) : 0;
  }

  function pruneTimedOutReplyTargets() {
    const now = Date.now();
    Object.entries(state.timedOutReplyTargets || {}).forEach(([url, at]) => {
      if (!Number.isFinite(Number(at)) || now - Number(at) > EXECUTOR_TARGET_TIMEOUT_TTL_MS) {
        delete state.timedOutReplyTargets[url];
      }
    });
  }

  function getReplyTargetStartedAt(targetUrl = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return 0;
    }
    if (
      normalizeTweetUrl(state.executorReplyTargetUrl) === normalizedTarget &&
      Number(state.executorReplyTargetStartedAt || 0) > 0
    ) {
      return Number(state.executorReplyTargetStartedAt || 0);
    }
    if (
      normalizeTweetUrl(state.pendingReplyTargetUrl) === normalizedTarget &&
      Number(state.pendingReplyStartedAt || 0) > 0
    ) {
      return Number(state.pendingReplyStartedAt || 0);
    }
    return 0;
  }

  function getReplyTargetElapsedMs(targetUrl = "") {
    const startedAt = getReplyTargetStartedAt(targetUrl);
    return startedAt ? Math.max(0, Date.now() - startedAt) : 0;
  }

  function clearReplyTargetAttempt(targetUrl = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || normalizeTweetUrl(state.executorReplyTargetUrl) === normalizedTarget) {
      state.executorReplyTargetUrl = "";
      state.executorReplyTargetStartedAt = 0;
    }
  }

  function buildReplyTargetTimeoutFailure(targetUrl = "", payload = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const elapsedMs = Math.max(
      EXECUTOR_TARGET_TIMEOUT_MS,
      getReplyTargetElapsedMs(normalizedTarget)
    );
    if (normalizedTarget) {
      state.timedOutReplyTargets[normalizedTarget] = Date.now();
      if (normalizeTweetUrl(state.pendingReplyTargetUrl) === normalizedTarget) {
        state.pendingReplyTargetUrl = "";
        state.pendingReplyStartedAt = 0;
        state.pendingReplyMeta = null;
      }
      clearReplyTargetAttempt(normalizedTarget);
    }
    return buildReplyActionFailure({
      ...payload,
      targetUrl: normalizedTarget,
      reason: "target-timeout",
      reasonCode: "target-timeout",
      reasonLabel: REPLY_REASON_LABELS["target-timeout"],
      elapsedMs,
      timeoutMs: EXECUTOR_TARGET_TIMEOUT_MS,
      actionGoalMs: EXECUTOR_TARGET_GOAL_MS,
      shouldSkipTarget: true
    });
  }

  function beginReplyTargetAttempt(targetUrl = "", payload = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return null;
    }
    pruneTimedOutReplyTargets();
    if (state.timedOutReplyTargets?.[normalizedTarget]) {
      return buildReplyTargetTimeoutFailure(normalizedTarget, payload);
    }
    const payloadStartedAt = getPayloadTargetStartedAt(payload);
    const existingStartedAt = normalizeTweetUrl(state.executorReplyTargetUrl) === normalizedTarget
      ? Number(state.executorReplyTargetStartedAt || 0)
      : 0;
    const startedAt = payloadStartedAt || existingStartedAt || Date.now();
    state.executorReplyTargetUrl = normalizedTarget;
    state.executorReplyTargetStartedAt = startedAt;
    if (Date.now() - startedAt >= EXECUTOR_TARGET_TIMEOUT_MS) {
      return buildReplyTargetTimeoutFailure(normalizedTarget, payload);
    }
    return null;
  }

  function checkReplyTargetDeadline(targetUrl = "", payload = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return null;
    }
    const startedAt = getReplyTargetStartedAt(normalizedTarget);
    if (startedAt && Date.now() - startedAt >= EXECUTOR_TARGET_TIMEOUT_MS) {
      return buildReplyTargetTimeoutFailure(normalizedTarget, payload);
    }
    return null;
  }

  function getReplyReasonCode(reason = "") {
    switch (String(reason || "").trim()) {
      case "already-replied":
        return "already-replied";
      case "score-below-agent-send-floor":
      case "value-below-send-floor":
        return "value-below-send-floor";
      case "score-degraded-below-average":
      case "value-dropped-on-open":
        return "value-dropped-on-open";
      case "article-url-conflict":
      case "tweet-id-conflict":
      case "thread-identity-conflict":
        return "thread-identity-conflict";
      case "reply-context-missing":
        return "reply-context-missing";
      case "generic-composer-opened":
        return "generic-composer-opened";
      case "reply-target-lost":
        return "reply-target-lost";
      case "send-button-disabled-but-target-locked":
        return "send-button-disabled-but-target-locked";
      case "target-timeout":
        return "target-timeout";
      case "send-failed":
      case "outcome-unverified":
        return "send-not-verified";
      default:
        return "context-not-locked";
    }
  }

  function getReplyReasonLabel(reasonCode = "") {
    return REPLY_REASON_LABELS[reasonCode] || REPLY_REASON_LABELS["context-not-locked"];
  }

  function shouldPersistReplyOpenFailure(reasonCode = "") {
    return [
      "value-dropped-on-open",
      "value-below-send-floor",
      "thread-identity-conflict",
      "reply-target-lost",
      "reply-context-missing",
      "generic-composer-opened",
      "context-not-locked",
      "target-timeout"
    ].includes(String(reasonCode || "").trim());
  }

  function clearReplyOpenFailure(targetUrl = "") {
    const cached = state.lastReplyOpenFailure;
    if (!cached) {
      return;
    }
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || normalizeTweetUrl(cached.targetUrl) === normalizedTarget) {
      state.lastReplyOpenFailure = null;
    }
  }

  function cacheReplyOpenFailure(payload = {}) {
    const reasonCode = String(payload?.reasonCode || "").trim();
    const targetUrl = normalizeTweetUrl(payload?.targetUrl || payload?.url || "");
    if (!targetUrl || !shouldPersistReplyOpenFailure(reasonCode)) {
      state.lastReplyOpenFailure = null;
      return;
    }

    state.lastReplyOpenFailure = {
      ok: false,
      targetUrl,
      currentUrl: normalizeTweetUrl(payload?.currentUrl || ""),
      articleUrl: normalizeTweetUrl(payload?.articleUrl || ""),
      articleDetectedUrl: normalizeTweetUrl(payload?.articleDetectedUrl || ""),
      contextSource: String(payload?.contextSource || "").trim(),
      reason: String(payload?.reason || "").trim(),
      reasonCode,
      reasonLabel: String(payload?.reasonLabel || getReplyReasonLabel(reasonCode)).trim(),
      elapsedMs: Number(payload?.elapsedMs || 0),
      timeoutMs: Number(payload?.timeoutMs || 0),
      actionGoalMs: Number(payload?.actionGoalMs || 0),
      shouldSkipTarget: Boolean(payload?.shouldSkipTarget),
      recheck: payload?.recheck && typeof payload.recheck === "object" ? { ...payload.recheck } : null,
      at: Date.now()
    };
  }

  function getFreshReplyOpenFailure(targetUrl = "") {
    const cached = state.lastReplyOpenFailure;
    if (!cached) {
      return null;
    }

    if (Date.now() - Number(cached.at || 0) > REPLY_OPEN_FAILURE_TTL_MS) {
      state.lastReplyOpenFailure = null;
      return null;
    }

    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (normalizedTarget && normalizeTweetUrl(cached.targetUrl) !== normalizedTarget) {
      return null;
    }

    return {
      ...cached,
      recheck: cached.recheck ? { ...cached.recheck } : undefined
    };
  }

  function buildReplyActionMeta(payload = {}) {
    const retryCount = Math.max(0, Math.floor(Number(payload.retryCount) || 0));
    const retried = Boolean(payload.retried || retryCount > 0);
    const meta = {
      targetUrl: normalizeTweetUrl(payload.targetUrl || payload.url),
      currentUrl: normalizeTweetUrl(payload.currentUrl || getCurrentStatusUrl() || global.location.href),
      articleUrl: normalizeTweetUrl(payload.articleUrl || ""),
      retried,
      retryCount
    };
    const articleDetectedUrl = normalizeTweetUrl(payload.articleDetectedUrl || "");
    const contextSource = String(payload.contextSource || "").trim();
    if (articleDetectedUrl) {
      meta.articleDetectedUrl = articleDetectedUrl;
    }
    if (contextSource) {
      meta.contextSource = contextSource;
    }
    return meta;
  }

  function buildReplyActionFailure(payload = {}) {
    const reason = String(payload.reason || "").trim() || "context-not-ready";
    const reasonCode = String(payload.reasonCode || getReplyReasonCode(reason)).trim();
    const failure = {
      ok: false,
      ...buildReplyActionMeta(payload),
      reason,
      reasonCode,
      reasonLabel: String(payload.reasonLabel || getReplyReasonLabel(reasonCode)).trim()
    };
    if (payload.recheck && typeof payload.recheck === "object") {
      failure.recheck = payload.recheck;
    }
    ["stage", "elapsedMs", "timeoutMs", "actionGoalMs"].forEach((key) => {
      if (payload[key] != null && payload[key] !== "") {
        failure[key] = payload[key];
      }
    });
    if (payload.shouldSkipTarget != null) {
      failure.shouldSkipTarget = Boolean(payload.shouldSkipTarget);
    }
    if (payload.submitReadyDiagnostics && typeof payload.submitReadyDiagnostics === "object") {
      failure.submitReadyDiagnostics = payload.submitReadyDiagnostics;
    }
    return failure;
  }

  function isDialogTweetArticle(node) {
    return Boolean(node?.closest('[aria-modal="true"], [role="dialog"], [data-testid="sheetDialog"]'));
  }

  function findPrimaryStatusArticle(targetUrl = "") {
    const articles = getTweetNodes();
    const pageArticles = articles.filter((article) => !isDialogTweetArticle(article));
    const pool = pageArticles.length ? pageArticles : articles;
    const normalizedTarget = normalizeTweetUrl(targetUrl || getCurrentStatusUrl());
    const targetTweetId = extractTweetIdFromUrl(normalizedTarget);

    if (normalizedTarget) {
      const exact = pool.find((article) => readTweetUrl(article) === normalizedTarget);
      if (exact) {
        return exact;
      }
    }

    if (targetTweetId) {
      const sameTweetId = pool.find((article) => extractTweetIdFromUrl(readTweetUrl(article)) === targetTweetId);
      if (sameTweetId) {
        return sameTweetId;
      }
    }

    return pool.find((article) => hasVisibleRect(article)) || pool[0] || null;
  }

  function buildReplyPageContext(targetUrl, article = null, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const currentStatusUrl = getCurrentStatusUrl();
    const currentUrl = normalizeTweetUrl(currentStatusUrl || global.location.href);
    const articleDetectedUrl = normalizeTweetUrl(options.articleDetectedUrl || readTweetUrl(article));
    const onTargetStatusPage = Boolean(normalizedTarget && currentStatusUrl === normalizedTarget);
    return {
      targetUrl: normalizedTarget,
      currentUrl,
      articleUrl: normalizeTweetUrl(options.articleUrl || (onTargetStatusPage ? normalizedTarget : articleDetectedUrl)),
      articleDetectedUrl,
      contextSource: onTargetStatusPage ? "status-page" : "article-link"
    };
  }

  function hasRecordedReply(targetUrl) {
    const normalized = normalizeTweetUrl(targetUrl);
    if (!normalized) {
      return false;
    }
    return Boolean(state.repliedTweetUrls.has(normalized) || state.replyDetails?.[normalized]);
  }

  async function ensureTargetReplyContext(targetUrl, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const maxRetry = Math.max(0, Math.floor(Number(options.maxRetry) || 0));
    const retryDelayMs = Math.max(120, Number(options.retryDelayMs) || HANDOFF_RETRY_DELAY_MS);
    let retryCount = 0;

    while (retryCount <= maxRetry) {
      const currentStatusUrl = getCurrentStatusUrl();
      if (currentStatusUrl === normalizedTarget) {
        return {
          ok: true,
          ...buildReplyActionMeta({
            targetUrl: normalizedTarget,
            currentUrl: currentStatusUrl,
            contextSource: "status-page",
            retryCount,
            retried: retryCount > 0
          })
        };
      }

      if (retryCount >= maxRetry) {
        const currentUrl = normalizeTweetUrl(currentStatusUrl || global.location.href);
        global.location.href = normalizedTarget;
        return buildReplyActionFailure({
          targetUrl: normalizedTarget,
          currentUrl,
          retryCount,
          retried: retryCount > 0,
          reason: "navigating"
        });
      }

      await waitFor(retryDelayMs);
      retryCount += 1;
    }

    return buildReplyActionFailure({
      targetUrl: normalizedTarget,
      reason: "navigating"
    });
  }

  function findReplyArticle(targetUrl) {
    const normalized = normalizeTweetUrl(targetUrl);
    if (!normalized) {
      return null;
    }

    if (getCurrentStatusUrl() === normalized) {
      return findPrimaryStatusArticle(normalized);
    }

    const articles = getTweetNodes();
    const directMatch = articles.find((article) => readTweetUrl(article) === normalized);
    if (directMatch) {
      return directMatch;
    }

    return null;
  }

  function hasVisibleRect(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function buildRectSnapshot(node) {
    if (!(node instanceof HTMLElement)) {
      return null;
    }
    const rect = node.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }
    return {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  function findTweetArticleByTweetId(tweetId, targetUrl = "") {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return null;
    }

    const normalizedUrl = normalizeTweetUrl(targetUrl);
    if (normalizedUrl && getCurrentStatusUrl() === normalizedUrl) {
      const primary = findPrimaryStatusArticle();
      if (primary) {
        return primary;
      }
    }

    if (normalizedUrl) {
      const direct = findReplyArticle(normalizedUrl);
      if (direct) {
        return direct;
      }
    }

    const matches = getTweetNodes().filter((article) => {
      const url = readTweetUrl(article);
      return extractTweetIdFromUrl(url) === normalizedTweetId;
    });
    if (!matches.length) {
      const currentStatusUrl = getCurrentStatusUrl() || getContextStatusUrl();
      if (extractTweetIdFromUrl(currentStatusUrl) === normalizedTweetId) {
        return findPrimaryStatusArticle() || getTweetNodes()[0] || null;
      }
      return null;
    }

    return matches.find((article) => hasVisibleRect(article)) || matches[0] || null;
  }

  function readMediaDurationText(scope) {
    if (!(scope instanceof Element)) {
      return "";
    }

    const direct = Array.from(scope.querySelectorAll("span, div"))
      .map((node) => String(node.textContent || "").trim())
      .find((text) => /^\d{1,2}:\d{2}(?::\d{2})?$/.test(text));
    if (direct) {
      return direct;
    }

    const match = String(scope.textContent || "").match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/);
    return match?.[0] || "";
  }

  function readReplyComposerText(editor) {
    if (!(editor instanceof HTMLElement)) {
      return "";
    }
    return sanitizeSnippet(editor.innerText || editor.textContent || "", 640);
  }

  function isReplySubmitButtonEnabled(sendButton) {
    if (!(sendButton instanceof HTMLElement)) {
      return false;
    }
    return !sendButton.hasAttribute("disabled") && String(sendButton.getAttribute("aria-disabled") || "").toLowerCase() !== "true";
  }

  async function waitForReplySubmitReady(targetUrl, draft = "", options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const timeoutMs = Math.max(200, Number(options.timeoutMs) || 2600);
    const expectedDraft = sanitizeSnippet(String(draft || "").trim().slice(0, 560), 640);
    const rewriteDraft = options.rewriteDraft !== false;
    const startedAt = Date.now();
    let lastState = {
      context: buildReplyComposerContext({ targetUrl: normalizedTarget }),
      editor: null,
      sendButton: null,
      editorText: "",
      editorFound: false,
      sendButtonFound: false,
      buttonDisabled: true,
      draftReady: !expectedDraft,
      composerLocked: false,
      pageLocked: false
    };

    while (Date.now() - startedAt <= timeoutMs) {
      const editor = queryReplyComposer({
        targetUrl: normalizedTarget,
        replyOnly: true,
        requireLocked: true
      });
      const sendButton = pickVisibleReplySubmitButton(normalizedTarget);
      const context = buildReplyComposerContext({ targetUrl: normalizedTarget, editor, sendButton });
      const editorText = readReplyComposerText(editor);

      if (
        rewriteDraft &&
        expectedDraft &&
        editor instanceof HTMLElement &&
        editorText !== expectedDraft
      ) {
        setReplyComposerText(editor, draft);
      }

      const refreshedText = readReplyComposerText(editor);
      const draftReady = !expectedDraft || refreshedText === expectedDraft;
      if (
        editor instanceof HTMLElement &&
        sendButton instanceof HTMLElement &&
        context.composerLocked &&
        draftReady &&
        isReplySubmitButtonEnabled(sendButton)
      ) {
        return {
          ok: true,
          editor,
          sendButton,
          context,
          editorText: refreshedText,
          editorFound: true,
          sendButtonFound: true,
          buttonDisabled: false,
          draftReady,
          composerLocked: true,
          pageLocked: Boolean(context.pageLocked)
        };
      }

      lastState = {
        context,
        editor,
        sendButton,
        editorText: refreshedText,
        editorFound: editor instanceof HTMLElement,
        sendButtonFound: sendButton instanceof HTMLElement,
        buttonDisabled: sendButton instanceof HTMLElement ? !isReplySubmitButtonEnabled(sendButton) : true,
        draftReady,
        composerLocked: Boolean(context.composerLocked),
        pageLocked: Boolean(context.pageLocked)
      };
      await waitFor(180);
    }

    return {
      ok: false,
      ...lastState
    };
  }

  function buildPhotoMediaItems(article) {
    const nodes = Array.from(article.querySelectorAll(
      '[data-testid="tweetPhoto"] img, [data-testid="card.wrapper"] img[src], [data-testid="attachments"] img'
    ));
    const seen = new Set();
    const items = [];

    nodes.forEach((node, index) => {
      if (!(node instanceof HTMLImageElement)) {
        return;
      }
      const src = String(node.currentSrc || node.src || node.getAttribute("src") || "").trim();
      const alt = normalizeSemanticText(node.getAttribute("alt"));
      const key = `photo|${src}|${alt}`;
      if (!src || seen.has(key)) {
        return;
      }
      seen.add(key);
      items.push({
        index: items.length,
        type: "photo",
        src,
        poster: "",
        alt,
        altMeaningful: isMeaningfulMediaAltText(alt),
        width: Number(node.naturalWidth || node.width || 0),
        height: Number(node.naturalHeight || node.height || 0),
        rect: buildRectSnapshot(node),
        visible: hasVisibleRect(node),
        durationText: ""
      });
    });

    return items;
  }

  function buildVideoMediaItems(article) {
    const containers = Array.from(article.querySelectorAll('[data-testid="videoComponent"], [data-testid="videoPlayer"]'));
    const fallbackVideos = Array.from(article.querySelectorAll("video"))
      .filter((node) => !containers.some((container) => container.contains(node)));
    const scopes = [
      ...containers,
      ...fallbackVideos
    ];
    const seen = new Set();
    const items = [];

    scopes.forEach((scope) => {
      const container = scope instanceof HTMLElement ? scope : scope.parentElement;
      const video = scope instanceof HTMLVideoElement ? scope : scope.querySelector("video");
      const previewImage = scope instanceof Element ? scope.querySelector("img") : null;
      const src = String(
        video?.currentSrc ||
        video?.getAttribute("src") ||
        video?.querySelector("source")?.getAttribute("src") ||
        ""
      ).trim();
      const poster = String(
        video?.poster ||
        previewImage?.currentSrc ||
        previewImage?.getAttribute("src") ||
        ""
      ).trim();
      const rawAlt = normalizeSemanticText(
        video?.getAttribute("aria-label") ||
        previewImage?.getAttribute("alt") ||
        container?.getAttribute("aria-label") ||
        ""
      );
      const type = (scope instanceof Element && scope.querySelector('[aria-label*="GIF"]')) || /gif/i.test(rawAlt) ? "gif" : "video";
      const key = `${type}|${src}|${poster}|${rawAlt}`;
      if ((!src && !poster) || seen.has(key)) {
        return;
      }
      seen.add(key);
      const rectNode = video instanceof HTMLElement
        ? video
        : (previewImage instanceof HTMLElement ? previewImage : (container instanceof HTMLElement ? container : null));
      items.push({
        index: items.length,
        type,
        src,
        poster,
        alt: rawAlt,
        altMeaningful: isMeaningfulMediaAltText(rawAlt),
        width: Number(video?.videoWidth || previewImage?.naturalWidth || rectNode?.clientWidth || 0),
        height: Number(video?.videoHeight || previewImage?.naturalHeight || rectNode?.clientHeight || 0),
        rect: buildRectSnapshot(rectNode),
        visible: hasVisibleRect(rectNode),
        durationText: readMediaDurationText(container || scope)
      });
    });

    return items;
  }

  function buildArticleMediaBundle(article, tweetId, candidate = null, fallbackUrl = "") {
    if (!(article instanceof Element)) {
      return null;
    }

    const pageContext = buildReplyPageContext(fallbackUrl || readTweetUrl(article), article);
    const url = normalizeTweetUrl(pageContext.articleUrl || fallbackUrl);
    const textSummary = sanitizeSnippet(readText(article) || candidate?.text || "", 280);
    const mediaAltText = readMediaAltText(article) || String(candidate?.mediaAltText || "").trim().slice(0, 280);
    const mediaKind = readMediaKind(article) || String(candidate?.mediaKind || "").trim();
    const items = [
      ...buildPhotoMediaItems(article),
      ...buildVideoMediaItems(article)
    ];

    return {
      tweetId: normalizeApiTweetId(tweetId) || extractTweetIdFromUrl(url),
      url,
      authorHandle: readAuthorHandle(article) || String(candidate?.authorHandle || "").trim(),
      mediaKind,
      lowSemanticConfidence: Boolean(candidate?.lowSemanticConfidence),
      textSummary,
      mediaAltText,
      articleRect: buildRectSnapshot(article),
      articleVisible: hasVisibleRect(article),
      items
    };
  }

  function isComposePostPath() {
    return /^\/compose\/post(?:$|[/?#])/.test(String(global.location.pathname || "").trim());
  }

  function extractStatusAuthorHandle(url) {
    const normalized = normalizeTweetUrl(url);
    const match = normalized.match(/^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/([^/]+)\/status\/\d+(?:$|[/?#])/i);
    return normalizeHandle(match?.[1] || "");
  }

  function collectReplyContextHandles(container, containerText = "") {
    const handles = new Set();

    if (container instanceof Element) {
      Array.from(container.querySelectorAll("a[href]")).forEach((node) => {
        const handle = extractHandleFromHref(node.getAttribute("href") || node.href || "");
        if (handle) {
          handles.add(handle);
        }
      });
    }

    const mentionMatches = String(containerText || "").match(/@[a-zA-Z0-9_]{1,15}/g) || [];
    mentionMatches.forEach((mention) => {
      const handle = normalizeHandle(mention);
      if (handle) {
        handles.add(handle);
      }
    });

    return Array.from(handles);
  }

  function getReplyComposerContainer(node) {
    if (!(node instanceof Element)) {
      return null;
    }
    return node.closest('[aria-modal="true"], [role="dialog"], [data-testid="sheetDialog"], form') || null;
  }

  function getVisibleReplySubmitButtons(scope = document) {
    const root = scope instanceof Element || scope instanceof Document ? scope : document;
    return Array.from(root.querySelectorAll('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]'))
      .filter((node) => node instanceof HTMLElement && hasVisibleRect(node));
  }

  async function dismissGenericComposerDialog() {
    const dialog = document.querySelector('[aria-modal="true"], [role="dialog"], [data-testid="sheetDialog"]');
    if (!(dialog instanceof Element)) {
      return false;
    }

    const closeButton = Array.from(dialog.querySelectorAll('button, [role="button"]'))
      .find((node) => {
        if (!(node instanceof HTMLElement) || !hasVisibleRect(node)) {
          return false;
        }
        const label = String(
          node.getAttribute("aria-label") ||
          node.getAttribute("title") ||
          node.textContent ||
          ""
        ).trim().toLowerCase();
        return ["close", "cancel", "back", "关闭", "關閉", "取消", "戻る"].some((keyword) => label.includes(keyword));
      });

    if (closeButton instanceof HTMLElement) {
      closeButton.click();
      await waitFor(360);
      return true;
    }

    try {
      document.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true
      }));
      await waitFor(360);
      return true;
    } catch {
      return false;
    }
  }

  function buildReplyComposerContext(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload.targetUrl || payload.url || "");
    const targetHandle = normalizeHandle(
      payload.targetHandle ||
      state.pendingReplyMeta?.authorHandle ||
      extractStatusAuthorHandle(targetUrl)
    );
    const editor = payload.editor instanceof HTMLElement ? payload.editor : null;
    const explicitButton = payload.sendButton instanceof HTMLElement ? payload.sendButton : null;
    const scope = payload.scope instanceof Element ? payload.scope : null;
    const container = payload.container instanceof Element
      ? payload.container
      : getReplyComposerContainer(editor || explicitButton || scope);
    const article = container instanceof Element ? container.querySelector(ARTICLE_SELECTOR) : null;
    const articleUrl = normalizeTweetUrl(readTweetUrl(article));
    const currentStatusUrl = getCurrentStatusUrl();
    const currentUrl = normalizeTweetUrl(currentStatusUrl || global.location.href);
    const contextStatusUrl = normalizeTweetUrl(articleUrl || getContextStatusUrl());
    const sendButton = explicitButton || (
      container instanceof Element
        ? getVisibleReplySubmitButtons(container).find((node) => getReplyComposerContainer(node) === container) || null
        : null
    );
    const buttonText = String(sendButton?.textContent || "").trim().toLowerCase();
    const containerText = String(container?.textContent || "").trim().toLowerCase();
    const hasReplyButtonText = REPLY_BUTTON_TEXT.some((keyword) => buttonText.includes(keyword));
    const hasReplyContextText = REPLY_CONTEXT_TEXT.some((keyword) => containerText.includes(keyword));
    const contextHandles = collectReplyContextHandles(container, containerText);
    const contextHandleMatchesTarget = Boolean(targetHandle && contextHandles.includes(targetHandle));
    const pendingTargetFresh = Boolean(
      targetUrl &&
      normalizeTweetUrl(state.pendingReplyTargetUrl) === targetUrl &&
      Date.now() - Number(state.pendingReplyStartedAt || 0) < 90 * 1000
    );
    const composePostReplyEvidence = Boolean(
      isComposePostPath() &&
      pendingTargetFresh &&
      (hasReplyContextText || hasReplyButtonText)
    );
    const composePostTargetLocked = Boolean(
      composePostReplyEvidence &&
      (
        contextHandleMatchesTarget ||
        contextHandles.length === 0 ||
        !targetHandle
      )
    );
    const explicitReplyEvidence = Boolean(contextStatusUrl || articleUrl || hasReplyButtonText || hasReplyContextText);
    const pageLocked = Boolean(
      targetUrl && (
        currentStatusUrl === targetUrl ||
        contextStatusUrl === targetUrl ||
        articleUrl === targetUrl
      )
    );
    const composerLocked = Boolean(
      targetUrl && (
        composePostTargetLocked ||
        (
          Boolean(editor || sendButton || container) &&
          (
            contextStatusUrl === targetUrl ||
            articleUrl === targetUrl ||
            (currentStatusUrl === targetUrl && (hasReplyContextText || hasReplyButtonText))
          )
        )
      )
    );
    const targetLocked = composerLocked;
    const genericComposerOpened = Boolean(
      isComposePostPath() &&
      !composerLocked &&
      !contextStatusUrl &&
      !articleUrl &&
      !hasReplyContextText &&
      !hasReplyButtonText
    );
    const replyTargetLost = Boolean(
      targetUrl &&
      explicitReplyEvidence &&
      !composerLocked &&
      (
        (isComposePostPath() && targetHandle && contextHandles.length > 0 && !contextHandleMatchesTarget) ||
        (!isComposePostPath() && Boolean(contextStatusUrl || articleUrl))
      )
    );

    return {
      targetUrl,
      targetHandle,
      currentUrl,
      articleUrl,
      contextStatusUrl,
      contextHandles,
      contextHandleMatchesTarget,
      pendingTargetFresh,
      pageLocked,
      composerLocked,
      composePostTargetLocked,
      explicitReplyEvidence,
      hasReplyButtonText,
      hasReplyContextText,
      targetLocked,
      genericComposerOpened,
      replyTargetLost,
      editor,
      sendButton,
      container
    };
  }

  function buildReplyComposerFailurePayload(targetUrl = "", context = null) {
    const composerContext = context && typeof context === "object"
      ? context
      : buildReplyComposerContext({ targetUrl });

    if (composerContext.genericComposerOpened) {
      return {
        targetUrl,
        currentUrl: composerContext.currentUrl,
        articleUrl: composerContext.articleUrl,
        reason: "generic-composer-opened",
        reasonCode: "generic-composer-opened"
      };
    }

    if (composerContext.replyTargetLost) {
      return {
        targetUrl,
        currentUrl: composerContext.currentUrl,
        articleUrl: composerContext.articleUrl,
        reason: "reply-target-lost",
        reasonCode: "reply-target-lost"
      };
    }

    if (!composerContext.explicitReplyEvidence) {
      return {
        targetUrl,
        currentUrl: composerContext.currentUrl,
        articleUrl: composerContext.articleUrl,
        reason: "reply-context-missing",
        reasonCode: "reply-context-missing"
      };
    }

    return {
      targetUrl,
      currentUrl: composerContext.currentUrl,
      articleUrl: composerContext.articleUrl,
      reason: "context-not-ready",
      reasonCode: "context-not-locked"
    };
  }

  async function waitForReplyArticle(targetUrl, timeoutMs = 12000) {
    const startedAt = Date.now();
    while (Date.now() - startedAt <= timeoutMs) {
      const article = findReplyArticle(targetUrl);
      if (article) {
        return article;
      }
      await waitFor(250);
    }
    return null;
  }

  function queryReplyComposer(options = {}) {
    const targetUrl = normalizeTweetUrl(options.targetUrl || options.url || "");
    const replyOnly = Boolean(options.replyOnly);
    const requireLocked = Boolean(options.requireLocked);
    const selectors = [
      '[role="dialog"] [data-testid="tweetTextarea_0"][role="textbox"]',
      '[data-testid="sheetDialog"] [data-testid="tweetTextarea_0"][role="textbox"]',
      '[data-testid="tweetTextarea_0"][role="textbox"]',
      '[role="dialog"] [data-testid="tweetTextarea_0"] [contenteditable="true"]',
      '[role="dialog"] [data-testid="tweetTextarea_0"] div[contenteditable="true"]',
      '[data-testid="tweetTextarea_0"] [contenteditable="true"]',
      '[data-testid="tweetTextarea_0"] div[contenteditable="true"]',
      '[role="dialog"] div[contenteditable="true"][data-contents="true"]',
      '[data-testid="sheetDialog"] div[contenteditable="true"][data-contents="true"]'
    ];

    const seen = new Set();
    const candidates = selectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter((node) => {
        if (!(node instanceof HTMLElement) || seen.has(node)) {
          return false;
        }
        seen.add(node);
        return true;
      })
      .map((node) => ({
        node,
        visible: hasVisibleRect(node),
        context: buildReplyComposerContext({ targetUrl, editor: node })
      }))
      .filter((entry) => {
        if (entry.context.genericComposerOpened) {
          return false;
        }
        if (requireLocked) {
          return targetUrl ? entry.context.composerLocked : entry.context.explicitReplyEvidence;
        }
        if (replyOnly) {
          return targetUrl
            ? (entry.context.composerLocked || entry.context.explicitReplyEvidence)
            : entry.context.explicitReplyEvidence;
        }
        return true;
      })
      .sort((left, right) => (
        Number(right.visible) - Number(left.visible) ||
        Number(right.context.composerLocked) - Number(left.context.composerLocked) ||
        Number(right.context.explicitReplyEvidence) - Number(left.context.explicitReplyEvidence)
      ));

    return candidates[0]?.node || null;
  }

  async function waitForReplyComposer(targetUrl = "", options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const timeoutMs = Math.max(200, Number(options.timeoutMs) || 8000);
    const requireLocked = options.requireLocked !== false;
    const replyOnly = options.replyOnly !== false;
    const startedAt = Date.now();
    while (Date.now() - startedAt <= timeoutMs) {
      const editor = queryReplyComposer({
        targetUrl: normalizedTarget,
        replyOnly,
        requireLocked
      });
      if (editor instanceof HTMLElement) {
        return {
          ok: true,
          editor,
          context: buildReplyComposerContext({ targetUrl: normalizedTarget, editor })
        };
      }
      await waitFor(160);
    }
    const fallbackEditor = queryReplyComposer({
      targetUrl: normalizedTarget,
      replyOnly: false,
      requireLocked: false
    });
    return {
      ok: false,
      editor: fallbackEditor,
      context: buildReplyComposerContext({ targetUrl: normalizedTarget, editor: fallbackEditor })
    };
  }

  function setReplyComposerText(editor, text) {
    const value = String(text || "").trim().slice(0, 560);
    if (!(editor instanceof HTMLElement) || !value) {
      return false;
    }

    editor.focus();

    try {
      const selection = global.getSelection?.();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editor);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch {
      // Ignore selection issues and fall through.
    }

    try {
      if (document.execCommand?.("insertText", false, value)) {
        return sanitizeSnippet(editor.textContent, 640) === sanitizeSnippet(value, 640);
      }
    } catch {
      // Fall through to the manual contenteditable update.
    }

    editor.textContent = value;
    try {
      editor.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: value
      }));
    } catch {
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }

    return sanitizeSnippet(editor.textContent, 640) === sanitizeSnippet(value, 640);
  }

  async function openQueueComposerHandoff(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload.url);
    const draft = String(payload.draft || "").trim().slice(0, 560);
    if (!targetUrl) {
      return buildReplyActionFailure({ reason: "missing-url" });
    }
    const initialTimeoutFailure = beginReplyTargetAttempt(targetUrl, {
      ...payload,
      stage: "open-composer"
    });
    if (initialTimeoutFailure) {
      return initialTimeoutFailure;
    }
    if (hasRecordedReply(targetUrl)) {
      return buildReplyActionFailure({
        targetUrl,
        reason: "already-replied",
        reasonCode: "already-replied"
      });
    }

    const contextLock = await ensureTargetReplyContext(targetUrl, { maxRetry: 1 });
    const contextTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...payload,
      currentUrl: contextLock?.currentUrl,
      retryCount: contextLock?.retryCount,
      retried: contextLock?.retried,
      stage: "ensure-reply-context"
    });
    if (contextTimeoutFailure) {
      return contextTimeoutFailure;
    }
    if (!contextLock.ok) {
      return contextLock;
    }

    const article = await waitForReplyArticle(targetUrl);
    const articleTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...payload,
      currentUrl: contextLock.currentUrl,
      retryCount: contextLock.retryCount,
      retried: contextLock.retried,
      stage: "wait-reply-article"
    });
    if (articleTimeoutFailure) {
      return articleTimeoutFailure;
    }
    if (!(article instanceof Element)) {
      return buildReplyActionFailure({
        targetUrl,
        currentUrl: contextLock.currentUrl,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        reason: "tweet-not-ready",
        contextSource: contextLock.contextSource
      });
    }

    const pageContext = buildReplyPageContext(targetUrl, article);
    if (
      pageContext.contextSource !== "status-page" &&
      pageContext.articleDetectedUrl &&
      pageContext.articleDetectedUrl !== targetUrl
    ) {
      return buildReplyActionFailure({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        reason: "article-url-conflict",
        reasonCode: "thread-identity-conflict"
      });
    }

    let runtimeState = null;
    try {
      runtimeState = await getRuntimeStateSnapshot();
    } catch {
      runtimeState = null;
    }

    const candidateRecord = getCandidateByUrlFromState(runtimeState, targetUrl) ||
      getQueueItemByUrlFromState(runtimeState, targetUrl) ||
      { url: targetUrl };
    const recheck = buildLiveCandidateRecheck(candidateRecord, article);
    const recheckTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...pageContext,
      retryCount: contextLock.retryCount,
      retried: contextLock.retried,
      stage: "live-recheck"
    });
    if (recheckTimeoutFailure) {
      return recheckTimeoutFailure;
    }
    if (recheck?.skipRecommended) {
      const belowExecutorSendFloor = Boolean(recheck.belowExecutorSendFloor);
      return buildReplyActionFailure({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        reason: belowExecutorSendFloor ? "score-below-agent-send-floor" : "score-degraded-below-average",
        reasonCode: belowExecutorSendFloor ? "value-below-send-floor" : "value-dropped-on-open",
        recheck
      });
    }

    article.scrollIntoView({ block: "center", behavior: "smooth" });
    state.pendingReplyTargetUrl = targetUrl;
    state.pendingReplyStartedAt = Date.now();
    state.pendingReplyMeta = buildReplyMetaFromArticle(article);

    let editor = queryReplyComposer({
      targetUrl,
      replyOnly: true,
      requireLocked: true
    });
    let composerState = editor instanceof HTMLElement
      ? {
          ok: true,
          editor,
          context: buildReplyComposerContext({ targetUrl, editor })
        }
      : null;
    if (!(editor instanceof HTMLElement)) {
      const replyButton = queryPrimaryArticleActionNode(article, ["reply"]);
      if (!(replyButton instanceof HTMLElement)) {
        return buildReplyActionFailure({
          ...pageContext,
          retryCount: contextLock.retryCount,
          retried: contextLock.retried,
          reason: "reply-button-missing"
        });
      }
      replyButton.click();
      composerState = await waitForReplyComposer(targetUrl, {
        timeoutMs: 8200,
        replyOnly: true,
        requireLocked: true
      });
      const composerTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        stage: "wait-reply-composer"
      });
      if (composerTimeoutFailure) {
        return composerTimeoutFailure;
      }
      editor = composerState?.editor || null;
      if (
        !(editor instanceof HTMLElement) &&
        composerState?.context?.genericComposerOpened
      ) {
        await dismissGenericComposerDialog();
        const retryArticle = await waitForReplyArticle(targetUrl, 2600);
        const retryReplyButton = queryPrimaryArticleActionNode(retryArticle, ["reply"]);
        if (retryReplyButton instanceof HTMLElement) {
          retryReplyButton.click();
          composerState = await waitForReplyComposer(targetUrl, {
            timeoutMs: 8200,
            replyOnly: true,
            requireLocked: true
          });
          const retryComposerTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
            ...pageContext,
            retryCount: contextLock.retryCount,
            retried: true,
            stage: "retry-reply-composer"
          });
          if (retryComposerTimeoutFailure) {
            return retryComposerTimeoutFailure;
          }
          editor = composerState?.editor || null;
        }
      }
    }

    if (!(editor instanceof HTMLElement)) {
      return buildReplyActionFailure({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        ...buildReplyComposerFailurePayload(targetUrl, composerState?.context),
        reason: "composer-not-ready"
      });
    }

    const editorContext = buildReplyComposerContext({ targetUrl, editor });
    if (!editorContext.composerLocked) {
      return buildReplyActionFailure({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        ...buildReplyComposerFailurePayload(targetUrl, editorContext)
      });
    }

    editor.focus();
    const draftLoaded = draft ? setReplyComposerText(editor, draft) : false;
    const submitReadyState = draft
      ? await waitForReplySubmitReady(targetUrl, draft, { timeoutMs: 3200 })
      : {
          ok: true,
          editor,
          sendButton: pickVisibleReplySubmitButton(targetUrl),
          context: buildReplyComposerContext({ targetUrl, editor }),
          editorText: readReplyComposerText(editor)
        };
    const submitReadyTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...pageContext,
      retryCount: contextLock.retryCount,
      retried: contextLock.retried,
      stage: "wait-submit-ready"
    });
    if (submitReadyTimeoutFailure) {
      return submitReadyTimeoutFailure;
    }
    if (draft && !submitReadyState?.ok) {
      return buildReplyActionFailure({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        currentUrl: submitReadyState?.context?.currentUrl,
        articleUrl: submitReadyState?.context?.articleUrl,
        reason: "send-disabled",
        reasonCode: submitReadyState?.context?.composerLocked ? "send-button-disabled-but-target-locked" : "context-not-locked",
        submitReadyDiagnostics: {
          editorFound: Boolean(submitReadyState?.editorFound),
          sendButtonFound: Boolean(submitReadyState?.sendButtonFound),
          buttonDisabled: Boolean(submitReadyState?.buttonDisabled),
          draftReady: Boolean(submitReadyState?.draftReady),
          composerLocked: Boolean(submitReadyState?.composerLocked),
          pageLocked: Boolean(submitReadyState?.pageLocked)
        }
      });
    }
    return {
      ok: true,
      composerReady: true,
      draftLoaded,
      submitReady: Boolean(submitReadyState?.ok),
      recheck,
      ...buildReplyActionMeta({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried
      })
    };
  }

  function resolveReplyTargetUrl() {
    const pendingFresh = state.pendingReplyTargetUrl && Date.now() - state.pendingReplyStartedAt < EXECUTOR_TARGET_TIMEOUT_MS;
    if (pendingFresh) {
      return state.pendingReplyTargetUrl;
    }

    return getCurrentStatusUrl() || getContextStatusUrl();
  }

  function clearPendingReplyOutcome() {
    if (state.pendingReplyOutcomeTimer) {
      clearInterval(state.pendingReplyOutcomeTimer);
    }
    state.pendingReplyOutcomeTimer = null;
    state.pendingReplyOutcomeUrl = "";
  }

  async function markReplyAsVerified(targetUrl) {
    const meta = state.pendingReplyMeta;
    clearPendingReplyOutcome();
    state.pendingReplyMeta = null;
    if (targetUrl) {
      await markTweetAsReplied(targetUrl, meta);
    }
  }

  function readOutcomeText() {
    return Array.from(document.querySelectorAll('[role="alert"], [data-testid="toast"], [data-testid="snackbar"]'))
      .map((node) => node.textContent?.trim().toLowerCase() || "")
      .filter(Boolean)
      .join("\n");
  }

  function includesAny(text, phrases) {
    const haystack = String(text || "").toLowerCase();
    return phrases.some((phrase) => haystack.includes(String(phrase).toLowerCase()));
  }

  function buildAutoLikeResult(overrides = {}) {
    return {
      likeAttempted: false,
      likePerformed: false,
      likeState: "skipped",
      ...overrides
    };
  }

  function hasChineseLanguageSignal(langs = []) {
    return (Array.isArray(langs) ? langs : []).some((lang) => {
      const normalized = String(lang || "").trim().toLowerCase();
      return normalized === "langzh" || normalized === "zh" || normalized.startsWith("zh-");
    });
  }

  function isJapaneseText(text) {
    return /[\u3040-\u30ff\u31f0-\u31ff]/.test(String(text || ""));
  }

  function isKoreanText(text) {
    return /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/i.test(String(text || ""));
  }

  function isChineseText(text) {
    const value = String(text || "");
    const hasHan = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(value);
    return hasHan && !isJapaneseText(value) && !isKoreanText(value);
  }

  function isChineseReplyTarget(article, replyMeta = null) {
    if (hasChineseLanguageSignal(replyMeta?.matchedLanguages)) {
      return true;
    }

    const articleLangs = article instanceof Element ? readLanguageTags(article) : [];
    if (hasChineseLanguageSignal(articleLangs)) {
      return true;
    }

    const semanticText = article instanceof Element
      ? normalizeSemanticText(readText(article))
      : normalizeSemanticText(replyMeta?.text || "");
    return isChineseText(semanticText);
  }

  function readLikeActionState(article) {
    if (!(article instanceof Element)) {
      return "";
    }
    if (queryInteractiveActionNode(article, ["unlike"])) {
      return "liked";
    }
    if (queryInteractiveActionNode(article, ["like"])) {
      return "not-liked";
    }
    return "";
  }

  async function waitForLikeActionState(targetUrl, expectedState, timeoutMs = 2600) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const startedAt = Date.now();
    while (Date.now() - startedAt <= timeoutMs) {
      const article = findReplyArticle(normalizedTarget);
      if (readLikeActionState(article) === expectedState) {
        return true;
      }
      await waitFor(180);
    }
    return false;
  }

  async function tryAutoLikeReplyTarget(targetUrl, options = {}, replyMeta = null) {
    if (!options?.autoLikeIfChinese) {
      return buildAutoLikeResult();
    }

    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const article = findReplyArticle(normalizedTarget) || await waitForReplyArticle(normalizedTarget, 2600);
    if (!(article instanceof Element)) {
      return buildAutoLikeResult({
        likeAttempted: true,
        likeState: "target-not-ready"
      });
    }

    if (!isChineseReplyTarget(article, replyMeta)) {
      return buildAutoLikeResult({
        likeState: "not-chinese"
      });
    }

    const initialState = readLikeActionState(article);
    if (initialState === "liked") {
      return buildAutoLikeResult({
        likeAttempted: true,
        likeState: "already-liked"
      });
    }

    const likeButton = queryInteractiveActionNode(article, ["like"]);
    if (!(likeButton instanceof HTMLElement)) {
      return buildAutoLikeResult({
        likeAttempted: true,
        likeState: "like-button-missing"
      });
    }

    likeButton.click();
    const liked = await waitForLikeActionState(normalizedTarget, "liked", 2600);
    return buildAutoLikeResult({
      likeAttempted: true,
      likePerformed: liked,
      likeState: liked ? "liked" : (readLikeActionState(findReplyArticle(normalizedTarget)) || "like-unverified")
    });
  }

  function monitorReplyOutcome(targetUrl) {
    clearPendingReplyOutcome();
    state.pendingReplyOutcomeUrl = targetUrl;

    const startedAt = Date.now();
    state.pendingReplyOutcomeTimer = global.setInterval(() => {
      if (state.pendingReplyOutcomeUrl !== targetUrl) {
        clearPendingReplyOutcome();
        return;
      }

      const outcomeText = readOutcomeText();
      if (includesAny(outcomeText, FAILURE_TEXTS)) {
        clearPendingReplyOutcome();
        return;
      }

      if (includesAny(outcomeText, SUCCESS_TEXTS) || Date.now() - startedAt > 5000) {
        clearPendingReplyOutcome();
        markReplyAsVerified(targetUrl).catch(() => null);
      }
    }, 400);
  }

  function buildReplyMetaFromArticle(article) {
    if (!(article instanceof Element)) {
      return null;
    }

    const badge = article.querySelector(`.${BADGE_CLASS}`);
    const label = badge?.querySelector(`.${BADGE_LABEL_CLASS}`)?.textContent || "";
    const score = Number.parseInt(label, 10);
    const candidate = readStoredCandidate(article);
    const replies = extractCountFromNode(queryActionNode(article, "reply"));
    const likes = extractCountFromNode(queryActionNode(article, "like"));
    const views = extractCountFromNode(readViewsNode(article));
    return {
      score: Number.isFinite(score) ? score : Number(candidate?.score || 0),
      tier: badge?.getAttribute("data-tier") || "replied",
      authorHandle: readAuthorHandle(article) || String(candidate?.authorHandle || "").trim(),
      authorVerified: readVerified(article) || Boolean(candidate?.authorVerified),
      authorVerificationType: readVerificationType(article) || String(candidate?.authorVerificationType || "").trim(),
      text: sanitizeSnippet(readText(article), 220) || String(candidate?.text || "").trim().slice(0, 220),
      keywordMatched: Boolean(candidate?.keywordMatched),
      matchedTopics: Array.isArray(candidate?.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(candidate?.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4) : [],
      highlights: Array.isArray(candidate?.highlights) ? candidate.highlights.slice(0, 4) : [],
      replies: Number.isFinite(replies) ? replies : Number(candidate?.replies || 0),
      likes: Number.isFinite(likes) ? likes : Number(candidate?.likes || 0),
      views: Number.isFinite(views) ? views : Number(candidate?.views || 0),
      retweets: Number(candidate?.retweets || 0),
      bookmarks: Number(candidate?.bookmarks || 0),
      trafficCapturedAt: Number(candidate?.trafficCapturedAt || 0),
      trafficAgeHours: Number(candidate?.trafficAgeHours || 0),
      trafficVelocityPerHour: Number(candidate?.trafficVelocityPerHour || 0),
      trafficReplyVelocityPerHour: Number(candidate?.trafficReplyVelocityPerHour || 0),
      trafficEngagementRate: Number(candidate?.trafficEngagementRate || 0),
      trafficReplyRatio: Number(candidate?.trafficReplyRatio || 0),
      trafficPhase: String(candidate?.trafficPhase || "").trim(),
      trafficSource: String(candidate?.trafficSource || "").trim(),
      baselineReplies: Number.isFinite(replies) ? replies : Number(candidate?.replies || 0),
      baselineLikes: Number.isFinite(likes) ? likes : Number(candidate?.likes || 0),
      baselineViews: Number.isFinite(views) ? views : Number(candidate?.views || 0)
    };
  }

  function findAuthorReengagement(targetUrl, authorHandle) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const handleKey = normalizeHandle(authorHandle);
    if (!normalizedTarget || !handleKey) {
      return null;
    }

    const targetArticle = findReplyArticle(normalizedTarget);
    return getTweetNodes()
      .map((article) => ({
        article,
        url: readTweetUrl(article),
        authorHandle: readAuthorHandle(article)
      }))
      .find((entry) => (
        entry.article !== targetArticle &&
        entry.url &&
        entry.url !== normalizedTarget &&
        normalizeHandle(entry.authorHandle) === handleKey
      )) || null;
  }

  async function capturePickupSnapshot(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload.url);
    if (!targetUrl) {
      return buildReplyActionFailure({ reason: "missing-url" });
    }

    const contextLock = await ensureTargetReplyContext(targetUrl, { maxRetry: 1 });
    if (!contextLock.ok) {
      return contextLock;
    }

    const article = await waitForReplyArticle(targetUrl, 12000);
    if (!(article instanceof Element)) {
      return buildReplyActionFailure({
        targetUrl,
        currentUrl: contextLock.currentUrl,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        reason: "tweet-not-ready",
        contextSource: contextLock.contextSource
      });
    }

    article.scrollIntoView({ block: "center", behavior: "smooth" });
    await waitFor(260);
    const meta = buildReplyMetaFromArticle(article) || {};
    const authorReengagement = findAuthorReengagement(targetUrl, meta.authorHandle);
    const pageContext = buildReplyPageContext(targetUrl, article);
    if (
      pageContext.contextSource !== "status-page" &&
      pageContext.articleDetectedUrl &&
      pageContext.articleDetectedUrl !== targetUrl
    ) {
      return buildReplyActionFailure({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        reason: "article-url-conflict",
        reasonCode: "thread-identity-conflict"
      });
    }
    return {
      ok: true,
      ...buildReplyActionMeta({
        ...pageContext,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried
      }),
      snapshot: {
        capturedAt: Date.now(),
        authorHandle: String(meta.authorHandle || "").trim(),
        score: Number(meta.score || 0),
        lane: String(payload.lane || "").trim(),
        slot: String(payload.slot || "").trim(),
        replies: Number(meta.baselineReplies || meta.replies || 0),
        likes: Number(meta.baselineLikes || meta.likes || 0),
        views: Number(meta.baselineViews || meta.views || 0),
        baselineReplies: Number(payload.baselineReplies || 0),
        baselineLikes: Number(payload.baselineLikes || 0),
        baselineViews: Number(payload.baselineViews || 0),
        authorEngaged: Boolean(authorReengagement?.url),
        authorReplyUrl: authorReengagement?.url || "",
        currentUrl: pageContext.currentUrl,
        articleUrl: pageContext.articleUrl
      }
    };
  }

  async function waitForApiReplyOutcome(targetUrl, timeoutMs = 6800, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const startedAt = Date.now();
    const replyMeta = state.pendingReplyMeta;

    while (Date.now() - startedAt <= timeoutMs) {
      const outcomeText = readOutcomeText();
      if (includesAny(outcomeText, FAILURE_TEXTS)) {
        return {
          ...buildReplyActionFailure({
            targetUrl: normalizedTarget,
            reason: "send-failed",
            reasonCode: "send-not-verified"
          }),
          verified: false,
          outcomeText,
          ...buildAutoLikeResult()
        };
      }

      if (includesAny(outcomeText, SUCCESS_TEXTS)) {
        await markReplyAsVerified(normalizedTarget);
        const likeResult = await tryAutoLikeReplyTarget(normalizedTarget, options, replyMeta);
        return {
          ok: true,
          verified: true,
          outcomeText,
          href: global.location.href,
          ...buildReplyActionMeta(buildReplyPageContext(normalizedTarget)),
          ...likeResult
        };
      }

      await waitFor(240);
    }

    return {
      ...buildReplyActionFailure({
        targetUrl: normalizedTarget,
        reason: "outcome-unverified",
        reasonCode: "send-not-verified"
      }),
      verified: false,
      outcomeText: readOutcomeText(),
      ...buildAutoLikeResult()
    };
  }

  function isReplyComposer(sendButton, targetUrl = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl || resolveReplyTargetUrl());
    const context = buildReplyComposerContext({
      targetUrl: normalizedTarget,
      sendButton
    });
    if (context.genericComposerOpened) {
      return false;
    }
    if (normalizedTarget) {
      return context.targetLocked;
    }
    return context.explicitReplyEvidence;
  }

  function bindReplyTracking() {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const replyButton = target.closest('[data-testid="reply"]');
      if (replyButton) {
        const article = replyButton.closest(ARTICLE_SELECTOR);
        const tweetUrl = article ? readTweetUrl(article) : "";
        if (tweetUrl) {
          state.pendingReplyTargetUrl = tweetUrl;
          state.pendingReplyStartedAt = Date.now();
          state.pendingReplyMeta = buildReplyMetaFromArticle(article);
        }
        return;
      }

      const sendButton = target.closest('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]');
      if (!sendButton) {
        return;
      }

      const targetUrl = resolveReplyTargetUrl();
      if (!targetUrl || !isReplyComposer(sendButton, targetUrl)) {
        return;
      }
      if (
        state.apiSubmitInFlightTargetUrl &&
        normalizeTweetUrl(targetUrl) === state.apiSubmitInFlightTargetUrl
      ) {
        return;
      }

      state.pendingReplyTargetUrl = "";
      state.pendingReplyStartedAt = 0;
      monitorReplyOutcome(targetUrl);
    }, true);
  }

  async function bootstrap() {
    ensureStyle();
    bindReplyDropTrafficBridge();
    bindReplyDropApiBridge();
    state.lastDomChangeAt = Date.now();
    await loadSettings();
    if (!isFloatingUiDisabled()) {
      ensureFloatingWidget();
    }
    bindRuntimeListener();
    bindReplyTracking();
    startObserver();
    renderFloatingWidget();
    scheduleScan();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})(globalThis);
