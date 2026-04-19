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
  const ARTICLE_SELECTOR = '[data-testid="tweet"]';
  const REPLY_BUTTON_TEXT = ["reply", "replying", "replies", "回覆", "回复"];
  const REPLY_CONTEXT_TEXT = ["replying to", "回覆對象", "回复对象", "回覆", "回复"];
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
  const DROP_SVG = `
    <svg viewBox="0 0 20 24" aria-hidden="true" focusable="false">
      <path d="M10 1.25C10 1.25 3 9.12 3 14.56C3 19.03 6.13 22.5 10 22.5C13.87 22.5 17 19.03 17 14.56C17 9.12 10 1.25 10 1.25Z"></path>
    </svg>
  `;

  const state = {
    settings: { ...(global.XReplyScorer?.defaults || {}) },
    repliedTweets: {},
    repliedTweetUrls: new Set(),
    dismissedTweets: {},
    dismissedTweetUrls: new Set(),
    observer: null,
    scanTimer: null,
    lazyRescanTimer: null,
    lastSentAt: 0,
    lastDomChangeAt: 0,
    currentUserHandle: "",
    pendingReplyTargetUrl: "",
    pendingReplyStartedAt: 0,
    pendingReplyMeta: null,
    pendingReplyOutcomeUrl: "",
    pendingReplyOutcomeTimer: null,
    stats: {
      scannedCount: 0,
      highScoreCount: 0,
      visibleCount: 0
    },
    apiBridgeBound: false
  };

  function sendRuntimeMessage(message) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve(response || null);
        });
      } catch (_error) {
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

  function sendRuntimeApiMessage(message) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
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
      tier: String(candidate.tier || "").trim() || "hidden",
      topicTags: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
      author: String(candidate.authorHandle || "").trim(),
      authorHandle: String(candidate.authorHandle || "").trim(),
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
      draft: String(item.draft || "").trim().slice(0, 560)
    };
  }

  async function getRuntimeStateSnapshot() {
    const response = await sendRuntimeApiMessage({ type: "X_REPLY_SCORER_GET_STATE" });
    if (response?.state) {
      return response.state;
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

  function getQueueItemByTweetIdFromState(runtimeState, tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return null;
    }

    return (Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue : [])
      .find((item) => extractTweetIdFromUrl(item?.url) === normalizedTweetId) || null;
  }

  function getCandidateLaneDescriptor(candidate = {}, uiLanguage = "zh-Hans") {
    const score = Number(candidate?.score) || 0;
    const replies = Number(candidate?.replies) || 0;
    const views = Number(candidate?.views) || 0;
    const timestamp = Number(candidate?.timestamp) || Date.now();
    const ageMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    const crowded = replies >= 180 || (views >= 180000 && replies >= 90);
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
    if (crowded && score < 82) {
      key = "crowded";
    } else if (score >= 72 && ageMinutes <= 240) {
      key = "now";
    } else if (score >= 58 && ageMinutes <= 720) {
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
    const runtimeState = await getRuntimeStateSnapshot();
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

  async function addReplyDropCandidateToQueue(tweetId) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      throw new Error("invalid-tweet-id");
    }

    const runtimeState = await getRuntimeStateSnapshot();
    const candidate = getCandidateByTweetIdFromState(runtimeState, normalizedTweetId);
    if (!candidate?.url) {
      throw new Error("candidate-not-found");
    }

    const existing = getQueueItemByTweetIdFromState(runtimeState, normalizedTweetId);
    const slot = getDefaultQueueSlot(candidate, runtimeState?.uiLanguage || "zh-Hans");
    const nextItem = {
      url: candidate.url,
      authorHandle: candidate.authorHandle || existing?.authorHandle || "",
      text: candidate.text || existing?.text || "",
      score: Number(candidate.score ?? existing?.score ?? 0),
      createdAt: Number(existing?.createdAt || Date.now()),
      scheduledFor: getScheduledTimestamp(slot),
      completedAt: 0,
      slot,
      draft: String(existing?.draft || "").trim().slice(0, 560),
      lane: getCandidateLaneDescriptor(candidate, runtimeState?.uiLanguage || "zh-Hans").label,
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

    const runtimeState = await getRuntimeStateSnapshot();
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

    const runtimeState = await getRuntimeStateSnapshot();
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

  async function callReplyDropApi(method, args = []) {
    switch (String(method || "").trim()) {
      case "getCandidates":
        return getReplyDropApiCandidates();
      case "getQueue":
        return getReplyDropApiQueue();
      case "getState":
        return getRuntimeStateSnapshot();
      case "addToQueue":
        return addReplyDropCandidateToQueue(args[0]);
      case "markShipped":
        return markReplyDropTweetShipped(args[0], args[1]);
      case "skipCandidate":
        return skipReplyDropCandidate(args[0]);
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
        --badge-fill: #e2e8f0;
        --badge-text: #0f172a;
        position: relative;
        display: none;
        width: 24px;
        height: 29px;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.22));
      }
      .${BADGE_CLASS}:not([data-tier="hidden"]) {
        display: inline-flex;
      }
      .${BADGE_CLASS} svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .${BADGE_CLASS} svg path {
        fill: var(--badge-fill);
        stroke: var(--badge-stroke, transparent);
        stroke-width: var(--badge-stroke-width, 0);
        stroke-dasharray: var(--badge-stroke-dash, 0);
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
        --badge-fill: #19c37d;
        --badge-text: #042f1a;
      }
      .${BADGE_CLASS}[data-tier="good"] {
        --badge-fill: #facc15;
        --badge-text: #422006;
      }
      .${BADGE_CLASS}[data-tier="medium"] {
        --badge-fill: #e2e8f0;
        --badge-text: #0f172a;
      }
      .${BADGE_CLASS}[data-tier="high-outline"] {
        --badge-fill: transparent;
        --badge-text: #86efac;
        --badge-stroke: #22c55e;
        --badge-stroke-width: 1.35px;
        --badge-stroke-dash: 2.2 1.6;
      }
      .${BADGE_CLASS}[data-tier="good-outline"] {
        --badge-fill: transparent;
        --badge-text: #fde68a;
        --badge-stroke: #facc15;
        --badge-stroke-width: 1.35px;
        --badge-stroke-dash: 2.2 1.6;
      }
      .${BADGE_CLASS}[data-tier="medium-outline"] {
        --badge-fill: transparent;
        --badge-text: #e2e8f0;
        --badge-stroke: #cbd5e1;
        --badge-stroke-width: 1.35px;
        --badge-stroke-dash: 2.2 1.6;
      }
      .${BADGE_CLASS}[data-tier="low-outline"] {
        --badge-fill: transparent;
        --badge-text: #bfdbfe;
        --badge-stroke: rgba(147, 197, 253, 0.8);
        --badge-stroke-width: 1.1px;
        --badge-stroke-dash: 1.8 1.8;
      }
      .${BADGE_CLASS}[data-tier="replied"] {
        --badge-fill: #38bdf8;
        --badge-text: #eff6ff;
      }
      .${BADGE_CLASS}[data-tier="replied"] .${BADGE_LABEL_CLASS} {
        font-size: 12px;
        transform: translateY(0);
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
        width: 54px;
        height: 68px;
        border: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
        cursor: pointer;
        transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .${FLOAT_BUTTON_CLASS}[data-open="1"] {
        transform: translateY(-2px) scale(1.04);
      }
      .${FLOAT_BUTTON_CLASS} svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 12px 26px rgba(2, 6, 23, 0.4));
        animation: xrs-droplet-float 2.8s ease-in-out infinite;
      }
      .${FLOAT_BUTTON_CLASS} svg path {
        fill: url(#xrs-droplet-gradient);
        stroke: rgba(191, 219, 254, 0.96);
        stroke-width: 1.1;
      }
      .${FLOAT_COUNT_CLASS} {
        position: absolute;
        left: 50%;
        top: 40%;
        min-width: 24px;
        height: 20px;
        padding: 0 2px;
        transform: translate(-50%, -50%);
        background: transparent;
        color: #f8fafc;
        border: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        line-height: 1;
        text-shadow: 0 1px 2px rgba(15, 23, 42, 0.7);
      }
      .${FLOAT_BUTTON_CLASS}[data-busy="1"] svg {
        transform: translateY(-1px);
      }
      @keyframes xrs-droplet-float {
        0%, 100% {
          transform: translateY(0) scale(1);
          filter: drop-shadow(0 12px 26px rgba(2, 6, 23, 0.38));
        }
        50% {
          transform: translateY(-2px) scale(1.03);
          filter: drop-shadow(0 16px 32px rgba(37, 99, 235, 0.28));
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

    const time = article.querySelector("time[datetime]");
    const timeLink = time?.closest('a[href*="/status/"]');
    if (timeLink?.href) {
      return normalizeTweetUrl(timeLink.href);
    }

    const links = Array.from(article.querySelectorAll('a[href*="/status/"]'));
    const directLink = links.find((link) => link.closest(ARTICLE_SELECTOR) === article);
    return normalizeTweetUrl(directLink?.href || links[0]?.href || "");
  }

  function readAuthorHandle(article) {
    const handleLink = Array.from(article.querySelectorAll('[data-testid="User-Name"] a[href]'))
      .map((node) => extractHandleFromHref(node.getAttribute("href")))
      .find(Boolean);

    return handleLink || "";
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

  function readVerified(article) {
    return Boolean(
      article.querySelector('[data-testid="icon-verified"]') ||
      article.querySelector('[aria-label*="Verified"]') ||
      article.querySelector('[aria-label*="已认证"]')
    );
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
      (tweet.langs || []).join(","),
      tweet.hasReplyAction ? "reply" : "",
      tweet.hasActionGroup ? "group" : "",
      tweet.likes ?? "",
      tweet.replies ?? "",
      tweet.views ?? "",
      tweet.mediaKind ?? "",
      tweet.timestamp ?? "",
      tweet.authorVerified ? "1" : "0",
      tweet.promoted ? "p" : "",
      tweet.isOwnTweet ? "me" : "",
      state.repliedTweetUrls.has(tweet.url) ? "replied" : ""
    ].join("|");
  }

  function getTweetData(article) {
    const authorHandle = readAuthorHandle(article);
    const currentUserHandle = readCurrentUserHandle();
    const replyAction = article.querySelector('[data-testid="reply"]');
    const tweet = {
      url: readTweetUrl(article),
      text: readText(article),
      langs: readLanguageTags(article),
      timestamp: readTimestamp(article),
      authorVerified: readVerified(article),
      mediaKind: readMediaKind(article),
      promoted: isPromotedArticle(article),
      hasReplyAction: Boolean(replyAction),
      hasActionGroup: Boolean(replyAction?.closest('[role="group"]')),
      authorFollowers: null,
      authorHandle,
      isOwnTweet: Boolean(authorHandle && currentUserHandle && authorHandle === currentUserHandle),
      likes: extractCountFromNode(queryActionNode(article, "like")),
      replies: extractCountFromNode(queryActionNode(article, "reply")),
      views: extractCountFromNode(readViewsNode(article))
    };
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

  function buildCandidatePayload(tweet, analysis, effectiveTier) {
    return {
      url: tweet.url,
      score: analysis.score,
      tier: effectiveTier,
      authorHandle: tweet.authorHandle,
      authorVerified: Boolean(tweet.authorVerified),
      text: sanitizeSnippet(tweet.text),
      timestamp: tweet.timestamp || Date.now(),
      mediaKind: tweet.mediaKind || "",
      likes: tweet.likes || 0,
      replies: tweet.replies || 0,
      views: tweet.views || 0,
      highlights: Array.isArray(analysis.highlights) ? analysis.highlights.slice(0, 4) : [],
      keywordMatched: Boolean(analysis.keywordMatched),
      matchedTopics: Array.isArray(analysis.matchedTopics) ? analysis.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(analysis.matchedLanguages) ? analysis.matchedLanguages.slice(0, 4) : []
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

  function ensureFloatingWidget() {
    let widget = document.getElementById(FLOAT_WIDGET_ID);
    if (widget instanceof HTMLElement) {
      return widget;
    }

    widget = document.createElement("div");
    widget.id = FLOAT_WIDGET_ID;
    widget.dataset.visible = "0";
    widget.innerHTML = `
      <button class="${FLOAT_BUTTON_CLASS}" type="button" aria-label="Open ReplyDrop panel" title="打开 ReplyDrop 面板" aria-expanded="false" data-open="0">
        <svg viewBox="0 0 20 24" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="xrs-droplet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#93c5fd"></stop>
              <stop offset="52%" stop-color="#60a5fa"></stop>
              <stop offset="100%" stop-color="#1d4ed8"></stop>
            </linearGradient>
          </defs>
          <path d="M10 1.25C10 1.25 3 9.12 3 14.56C3 19.03 6.13 22.5 10 22.5C13.87 22.5 17 19.03 17 14.56C17 9.12 10 1.25 10 1.25Z"></path>
        </svg>
        <span class="${FLOAT_COUNT_CLASS}">0</span>
      </button>
    `;
    document.body.appendChild(widget);

    const button = widget.querySelector(`.${FLOAT_BUTTON_CLASS}`);
    button?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const panel = ensureFloatingPanel();
      setFloatingPanelOpen(panel.dataset.open !== "1");
    });

    return widget;
  }

  function setFloatingPanelOpen(open) {
    const panel = ensureFloatingPanel();
    const next = open ? "1" : "0";
    panel.dataset.open = next;
    const button = document.querySelector(`#${FLOAT_WIDGET_ID} .${FLOAT_BUTTON_CLASS}`);
    if (button instanceof HTMLElement) {
      button.dataset.open = next;
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }

  function ensureFloatingPanel() {
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
    const widget = ensureFloatingWidget();
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
    state.stats = {
      scannedCount: Math.max(0, Math.floor(Number(stats.scannedCount) || 0)),
      highScoreCount: Math.max(0, Math.floor(Number(stats.highScoreCount) || 0)),
      visibleCount: Math.max(0, Math.floor(Number(stats.visibleCount) || 0))
    };
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
          renderBadge(article, "√", "replied", "Already replied");
          continue;
        }

        if (tweet.url && state.dismissedTweetUrls.has(tweet.url)) {
          delete article.dataset.xrsCandidate;
          renderBadge(article, "", "hidden");
          continue;
        }

        const analysis = global.XReplyScorer.analyzeTweet(tweet, state.settings);
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
        .slice(0, 8)
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

  function findReplyArticle(targetUrl) {
    const normalized = normalizeTweetUrl(targetUrl);
    if (!normalized) {
      return null;
    }

    const articles = getTweetNodes();
    const directMatch = articles.find((article) => readTweetUrl(article) === normalized);
    if (directMatch) {
      return directMatch;
    }

    if (getCurrentStatusUrl() === normalized) {
      return articles[0] || null;
    }

    return null;
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

  function queryReplyComposer() {
    return (
      document.querySelector('[role="dialog"] [data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
      document.querySelector('[role="dialog"] [data-testid="tweetTextarea_0"] div[contenteditable="true"]') ||
      document.querySelector('[data-testid="tweetTextarea_0"] [contenteditable="true"]') ||
      document.querySelector('[data-testid="tweetTextarea_0"] div[contenteditable="true"]') ||
      document.querySelector('[role="dialog"] div[contenteditable="true"][data-contents="true"]') ||
      document.querySelector('[data-testid="sheetDialog"] div[contenteditable="true"][data-contents="true"]') ||
      null
    );
  }

  async function waitForReplyComposer(timeoutMs = 8000) {
    const startedAt = Date.now();
    while (Date.now() - startedAt <= timeoutMs) {
      const editor = queryReplyComposer();
      if (editor instanceof HTMLElement) {
        return editor;
      }
      await waitFor(160);
    }
    return null;
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
      return { ok: false, reason: "missing-url" };
    }

    const currentStatusUrl = getCurrentStatusUrl();
    if ((currentStatusUrl && currentStatusUrl !== targetUrl) || (!currentStatusUrl && !global.location.pathname.includes("/status/"))) {
      global.location.href = targetUrl;
      return { ok: false, reason: "navigating" };
    }

    const article = await waitForReplyArticle(targetUrl);
    if (!(article instanceof Element)) {
      return { ok: false, reason: "tweet-not-ready" };
    }

    article.scrollIntoView({ block: "center", behavior: "smooth" });
    state.pendingReplyTargetUrl = targetUrl;
    state.pendingReplyStartedAt = Date.now();
    state.pendingReplyMeta = buildReplyMetaFromArticle(article);

    let editor = queryReplyComposer();
    if (!(editor instanceof HTMLElement)) {
      const replyButton = article.querySelector('[data-testid="reply"]');
      if (!(replyButton instanceof HTMLElement)) {
        return { ok: false, reason: "reply-button-missing" };
      }
      replyButton.click();
      editor = await waitForReplyComposer();
    }

    if (!(editor instanceof HTMLElement)) {
      return { ok: false, reason: "composer-not-ready" };
    }

    editor.focus();
    const draftLoaded = draft ? setReplyComposerText(editor, draft) : false;
    return { ok: true, composerReady: true, draftLoaded };
  }

  function resolveReplyTargetUrl() {
    const pendingFresh = state.pendingReplyTargetUrl && Date.now() - state.pendingReplyStartedAt < 90 * 1000;
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
        const meta = state.pendingReplyMeta;
        clearPendingReplyOutcome();
        markTweetAsReplied(targetUrl, meta);
        state.pendingReplyMeta = null;
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
      text: sanitizeSnippet(readText(article), 220) || String(candidate?.text || "").trim().slice(0, 220),
      keywordMatched: Boolean(candidate?.keywordMatched),
      matchedTopics: Array.isArray(candidate?.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(candidate?.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4) : [],
      highlights: Array.isArray(candidate?.highlights) ? candidate.highlights.slice(0, 4) : [],
      replies: Number.isFinite(replies) ? replies : Number(candidate?.replies || 0),
      likes: Number.isFinite(likes) ? likes : Number(candidate?.likes || 0),
      views: Number.isFinite(views) ? views : Number(candidate?.views || 0),
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

    return getTweetNodes()
      .map((article) => ({
        article,
        url: readTweetUrl(article),
        authorHandle: readAuthorHandle(article)
      }))
      .find((entry) => (
        entry.url &&
        entry.url !== normalizedTarget &&
        normalizeHandle(entry.authorHandle) === handleKey
      )) || null;
  }

  async function capturePickupSnapshot(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload.url);
    if (!targetUrl) {
      return { ok: false, reason: "missing-url" };
    }

    const currentStatusUrl = getCurrentStatusUrl();
    if ((currentStatusUrl && currentStatusUrl !== targetUrl) || (!currentStatusUrl && !global.location.pathname.includes("/status/"))) {
      global.location.href = targetUrl;
      return { ok: false, reason: "navigating" };
    }

    const article = await waitForReplyArticle(targetUrl, 12000);
    if (!(article instanceof Element)) {
      return { ok: false, reason: "tweet-not-ready" };
    }

    article.scrollIntoView({ block: "center", behavior: "smooth" });
    await waitFor(260);
    const meta = buildReplyMetaFromArticle(article) || {};
    const authorReengagement = findAuthorReengagement(targetUrl, meta.authorHandle);
    return {
      ok: true,
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
        authorReplyUrl: authorReengagement?.url || ""
      }
    };
  }

  function isReplyComposer(sendButton) {
    const buttonText = String(sendButton.textContent || "").trim().toLowerCase();
    if (REPLY_BUTTON_TEXT.some((keyword) => buttonText.includes(keyword))) {
      return true;
    }

    const container = sendButton.closest('[role="dialog"], form, [data-testid="sheetDialog"]');
    const containerText = String(container?.textContent || "").toLowerCase();
    if (REPLY_CONTEXT_TEXT.some((keyword) => containerText.includes(keyword))) {
      return true;
    }

    return Boolean(resolveReplyTargetUrl());
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
      if (!targetUrl || !isReplyComposer(sendButton)) {
        return;
      }

      state.pendingReplyTargetUrl = "";
      state.pendingReplyStartedAt = 0;
      monitorReplyOutcome(targetUrl);
    }, true);
  }

  async function bootstrap() {
    ensureStyle();
    ensureFloatingWidget();
    bindReplyDropApiBridge();
    state.lastDomChangeAt = Date.now();
    await loadSettings();
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
