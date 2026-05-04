(function initContent(global) {
  const SCAN_DEBOUNCE_MS = 420;
  const SCAN_MIN_INTERVAL_MS = 900;
  const STATS_PUBLISH_MIN_INTERVAL_MS = 1200;
  const BADGE_CLASS = "xrs-score-badge";
  const BADGE_LABEL_CLASS = "xrs-score-label";
  const BADGE_ANCHOR_CLASS = "xrs-badge-anchor";
  const DRAFT_PREVIEW_CLASS = "xrs-draft-preview";
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
  const DEFAULT_EXECUTOR_SEND_FLOOR = 45;
  const EXECUTOR_EMPTY_INBOX_MIN_RESCANS = 1;
  const EXECUTOR_ROUND_MAX_TARGETS = 10;
  const EXECUTOR_SCAN_WINDOW_SIZE = 24;
  const FLOATING_PANEL_LIMIT = 6;
  const MAX_RUNTIME_RECENT_CANDIDATES = 16;
  const MAX_RUNTIME_REPLY_DETAILS = 40;
  const MAX_RUNTIME_REPLY_ARCHIVE = 320;
  const MAX_RUNTIME_MEDIA_SUMMARIES = 48;
  const MAX_DRAFT_PREVIEWS = 48;
  const EXECUTOR_ROUND_BUDGET_MS = 12 * 60 * 1000;
  const EXECUTOR_CONSECUTIVE_EMPTY_RESULT_LIMIT = 3;
  const EXECUTOR_TARGET_GOAL_MS = 20 * 1000;
  const EXECUTOR_TARGET_TIMEOUT_MS = 20 * 1000;
  const EXECUTOR_NO_CANDIDATE_TIMEOUT_MS = 15 * 1000;
  const EXECUTOR_TARGET_TIMEOUT_TTL_MS = 10 * 60 * 1000;
  const EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES = 90;
  const EXECUTOR_STALE_REPLY_MAX_AGE_MINUTES = 180;
  const EXECUTOR_MIN_TRAFFIC_VIEWS = 500;
  const EXECUTOR_MIN_TRAFFIC_REPLIES = 10;
  const EXECUTOR_MIN_TRAFFIC_VELOCITY_PER_HOUR = 700;
  const EXECUTOR_TRENDING_MIN_TRAFFIC_VIEWS = 150;
  const EXECUTOR_RISING_MIN_TRAFFIC_VIEWS = 120;
  const EXECUTOR_RISING_MIN_TRAFFIC_VELOCITY_PER_HOUR = 400;
  const EXECUTOR_TIMELINE_OPEN_TIMEOUT_MS = 1800;
  const EXECUTOR_TIMELINE_READY_TIMEOUT_MS = 1500;
  const EXECUTOR_DETAIL_COMPOSER_TIMEOUT_MS = 3600;
  const EXECUTOR_DETAIL_READY_TIMEOUT_MS = 1800;
  const EXECUTOR_SETTLE_TIMEOUT_MS = 1600;
  const EXECUTOR_POST_SEND_VERIFY_TIMEOUT_MS = 4200;
  const PREPARED_REPLY_COMPOSER_TTL_MS = 6000;
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
    "draft-template-blocked": "草稿过于模板化，已拦截",
    "draft-language-mismatch": "草稿与主帖语言不匹配，已拦截",
    "draft-topic-mismatch": "草稿与主帖主题不匹配，已拦截",
    "send-button-disabled-but-target-locked": "回复框已锁定但发送按钮仍不可用",
    "target-timeout": "单条回复超过20秒"
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
    replyArchive: [],
    replyQueue: [],
    relationshipStates: {},
    mediaSummaries: {},
    trafficByTweetId: {},
    trafficUpdatedAt: 0,
    recentCandidates: [],
    executorHotQueue: [],
    executorHotQueueUpdatedAt: 0,
    executorNoCandidateStreak: 0,
    observer: null,
    scanTimer: null,
    lazyRescanTimer: null,
    lastScanCompletedAt: 0,
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
    preparedReplyComposer: null,
    draftPreviewsByUrl: {},
    pendingReplyOutcomeUrl: "",
    pendingReplyOutcomeTimer: null,
    apiSubmitInFlightTargetUrl: "",
    floatingPanelSelectedIndex: 0,
    floatingKeyboardBound: false,
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

  function hasMatchingTweetId(collection, targetUrl = "") {
    const targetTweetId = extractTweetIdFromUrl(targetUrl);
    if (!targetTweetId) {
      return false;
    }
    if (collection instanceof Set) {
      for (const entry of collection) {
        if (extractTweetIdFromUrl(entry) === targetTweetId) {
          return true;
        }
      }
      return false;
    }
    if (collection && typeof collection === "object") {
      return Object.keys(collection).some((entry) => extractTweetIdFromUrl(entry) === targetTweetId);
    }
    return false;
  }

  function hasTrackedTweetUrl(collection, targetUrl = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return false;
    }
    if (collection instanceof Set) {
      return collection.has(normalizedTarget) || hasMatchingTweetId(collection, normalizedTarget);
    }
    if (collection && typeof collection === "object") {
      return Boolean(collection[normalizedTarget]) || hasMatchingTweetId(collection, normalizedTarget);
    }
    return false;
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
      breakdown: Array.isArray(candidate.breakdown)
        ? candidate.breakdown.slice(0, 8).map((item) => ({
            key: String(item?.key || "").trim(),
            label: String(item?.label || "").trim(),
            amount: Number(item?.amount || 0),
            kind: String(item?.kind || "").trim()
          }))
        : [],
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

  function limitStringList(value, maxItems = 4, maxLength = 96) {
    return Array.isArray(value)
      ? value.map((item) => sanitizeSnippet(item, maxLength)).filter(Boolean).slice(0, maxItems)
      : [];
  }

  function getRuntimeEntryTimestamp(payload = {}) {
    return Math.max(
      toNonNegativeNumber(payload.completedAt, 0),
      toNonNegativeNumber(payload.updatedAt, 0),
      toNonNegativeNumber(payload.pickupCheckedAt, 0),
      toNonNegativeNumber(payload.timestamp, 0),
      toNonNegativeNumber(payload.shippedAt, 0),
      toNonNegativeNumber(payload.queuedAt, 0),
      toNonNegativeNumber(payload.createdAt, 0)
    );
  }

  function sanitizeRecentCandidate(candidate = {}) {
    const url = normalizeTweetUrl(candidate?.url);
    if (!url) {
      return null;
    }

    return {
      url,
      tweetId: normalizeApiTweetId(candidate?.tweetId || extractTweetIdFromUrl(url)),
      score: Number(candidate?.score || 0),
      baseScore: Number(candidate?.baseScore || candidate?.score || 0),
      opportunityBoost: Number(candidate?.opportunityBoost || 0),
      tier: String(candidate?.tier || "").trim(),
      baseTier: String(candidate?.baseTier || candidate?.tier || "").trim().slice(0, 24),
      relationshipStatus: String(candidate?.relationshipStatus || "").trim().slice(0, 24),
      attributionKind: String(candidate?.attributionKind || "").trim().slice(0, 32),
      authorHandle: String(candidate?.authorHandle || "").trim().slice(0, 64),
      authorName: sanitizeSnippet(candidate?.authorName, 80),
      authorVerified: Boolean(candidate?.authorVerified),
      authorVerificationType: String(candidate?.authorVerificationType || "").trim().slice(0, 16),
      text: sanitizeSnippet(candidate?.text, 220),
      mediaAltText: sanitizeSnippet(candidate?.mediaAltText, 220),
      sourceSurface: String(candidate?.sourceSurface || "").trim().slice(0, 24),
      postScore: Number(candidate?.postScore || candidate?.score || 0),
      reachLikelihood: Number(candidate?.reachLikelihood || 0),
      understandingConfidence: Number(candidate?.understandingConfidence || 0),
      authorFit: Number(candidate?.authorFit || 0),
      finalScore: Number(candidate?.finalScore || candidate?.score || 0),
      peakFinalScore: Number(candidate?.peakFinalScore || candidate?.finalScore || candidate?.score || 0),
      peakSourceSurface: String(candidate?.peakSourceSurface || candidate?.sourceSurface || "").trim().slice(0, 24),
      peakObservedAt: toNonNegativeNumber(candidate?.peakObservedAt || candidate?.timestamp, 0),
      blockReason: sanitizeSnippet(candidate?.blockReason, 80),
      lowSemanticConfidence: Boolean(candidate?.lowSemanticConfidence),
      timestamp: toNonNegativeNumber(candidate?.timestamp, Date.now()),
      mediaKind: String(candidate?.mediaKind || "").trim().slice(0, 24),
      likes: toNonNegativeNumber(candidate?.likes, 0),
      replies: toNonNegativeNumber(candidate?.replies, 0),
      views: toNonNegativeNumber(candidate?.views, 0),
      retweets: toNonNegativeNumber(candidate?.retweets, 0),
      bookmarks: toNonNegativeNumber(candidate?.bookmarks, 0),
      trafficCapturedAt: toNonNegativeNumber(candidate?.trafficCapturedAt, 0),
      trafficAgeHours: toNonNegativeNumber(candidate?.trafficAgeHours, 0),
      trafficVelocityPerHour: toNonNegativeNumber(candidate?.trafficVelocityPerHour, 0),
      trafficReplyVelocityPerHour: toNonNegativeNumber(candidate?.trafficReplyVelocityPerHour, 0),
      trafficEngagementRate: toNonNegativeNumber(candidate?.trafficEngagementRate, 0),
      trafficReplyRatio: toNonNegativeNumber(candidate?.trafficReplyRatio, 0),
      trafficPhase: String(candidate?.trafficPhase || "").trim().slice(0, 16),
      trafficSource: String(candidate?.trafficSource || "").trim().slice(0, 24),
      breakdown: Array.isArray(candidate?.breakdown)
        ? candidate.breakdown.slice(0, 8).map((item) => ({
            key: sanitizeSnippet(item?.key, 48),
            label: sanitizeSnippet(item?.label, 80),
            amount: Number(item?.amount || 0),
            kind: sanitizeSnippet(item?.kind, 24)
          })).filter((item) => item.key)
        : [],
      highlights: limitStringList(candidate?.highlights, 4, 96),
      keywordMatched: Boolean(candidate?.keywordMatched),
      matchedTopics: limitStringList(candidate?.matchedTopics, 4, 48),
      matchedLanguages: limitStringList(candidate?.matchedLanguages, 4, 24),
      needsDetailContext: Boolean(candidate?.needsDetailContext),
      mediaContextMissing: Boolean(candidate?.mediaContextMissing),
      quickDraftAllowed: Boolean(candidate?.quickDraftAllowed),
      mediaSummaryAvailable: Boolean(candidate?.mediaSummaryAvailable),
      timelineInlineReplyEligible: Boolean(candidate?.timelineInlineReplyEligible),
      preferredOpenMode: String(candidate?.preferredOpenMode || "detail-page").trim().slice(0, 24),
      draft: sanitizeSnippet(candidate?.draft, 560),
      replyText: sanitizeSnippet(candidate?.replyText, 560)
    };
  }

  function pruneRecentCandidates(candidates = [], limit = MAX_RUNTIME_RECENT_CANDIDATES) {
    const deduped = new Map();
    (Array.isArray(candidates) ? candidates : []).forEach((candidate) => {
      const sanitized = sanitizeRecentCandidate(candidate);
      if (!sanitized?.url) {
        return;
      }
      deduped.set(sanitized.url, sanitized);
    });
    return Array.from(deduped.values())
      .sort((left, right) => {
        const rightScore = Number(right?.finalScore || right?.score || 0);
        const leftScore = Number(left?.finalScore || left?.score || 0);
        if (rightScore !== leftScore) {
          return rightScore - leftScore;
        }
        return toNonNegativeNumber(right?.peakObservedAt || right?.timestamp, 0) - toNonNegativeNumber(left?.peakObservedAt || left?.timestamp, 0);
      })
      .slice(0, limit);
  }

  function sanitizeReplyDetailEntry(url, detail = {}) {
    const normalizedUrl = normalizeTweetUrl(url);
    if (!normalizedUrl) {
      return null;
    }
    const payload = detail && typeof detail === "object" ? detail : {};
    const replyText = String(payload.replyText || payload.text || "").trim().slice(0, 560);
    return [normalizedUrl, {
      timestamp: toNonNegativeNumber(payload.timestamp, Date.now()),
      completedAt: toNonNegativeNumber(payload.completedAt, toNonNegativeNumber(payload.timestamp, Date.now())),
      score: Number(payload.score || 0),
      tier: String(payload.tier || "replied").trim().slice(0, 24),
      authorHandle: String(payload.authorHandle || payload.handle || "").trim().slice(0, 64),
      authorVerified: Boolean(payload.authorVerified),
      authorVerificationType: String(payload.authorVerificationType || "").trim().slice(0, 16),
      text: replyText.slice(0, 280),
      replyText,
      replyUrl: normalizeTweetUrl(payload.replyUrl),
      replyTweetId: normalizeApiTweetId(payload.replyTweetId || extractTweetIdFromUrl(payload.replyUrl)),
      lane: String(payload.lane || "").trim().slice(0, 48),
      slot: String(payload.slot || "").trim().slice(0, 24),
      keywordMatched: Boolean(payload.keywordMatched),
      matchedTopics: limitStringList(payload.matchedTopics, 4, 48),
      matchedLanguages: limitStringList(payload.matchedLanguages, 4, 24),
      highlights: limitStringList(payload.highlights, 4, 96),
      publishMode: String(payload.publishMode || "").trim().slice(0, 32),
      queuedAt: toNonNegativeNumber(payload.queuedAt, 0),
      handedOffAt: toNonNegativeNumber(payload.handedOffAt, 0),
      executionLatencyMs: toNonNegativeNumber(payload.executionLatencyMs, 0),
      retweets: toNonNegativeNumber(payload.retweets, 0),
      bookmarks: toNonNegativeNumber(payload.bookmarks, 0),
      trafficCapturedAt: toNonNegativeNumber(payload.trafficCapturedAt, 0),
      trafficAgeHours: toNonNegativeNumber(payload.trafficAgeHours, 0),
      trafficVelocityPerHour: toNonNegativeNumber(payload.trafficVelocityPerHour, 0),
      trafficReplyVelocityPerHour: toNonNegativeNumber(payload.trafficReplyVelocityPerHour, 0),
      trafficEngagementRate: toNonNegativeNumber(payload.trafficEngagementRate, 0),
      trafficReplyRatio: toNonNegativeNumber(payload.trafficReplyRatio, 0),
      trafficPhase: String(payload.trafficPhase || "").trim().slice(0, 16),
      trafficSource: String(payload.trafficSource || "").trim().slice(0, 24),
      baselineReplies: toNonNegativeNumber(payload.baselineReplies, 0),
      baselineLikes: toNonNegativeNumber(payload.baselineLikes, 0),
      baselineViews: toNonNegativeNumber(payload.baselineViews, 0),
      pickupStatus: String(payload.pickupStatus || "").trim().slice(0, 24),
      pickupCheckedAt: toNonNegativeNumber(payload.pickupCheckedAt, 0),
      pickupChecks: Math.max(0, Math.floor(Number(payload.pickupChecks || 0))),
      pickupReplies: toNonNegativeNumber(payload.pickupReplies, 0),
      pickupLikes: toNonNegativeNumber(payload.pickupLikes, 0),
      pickupViews: toNonNegativeNumber(payload.pickupViews, 0),
      pickupDeltaReplies: toNonNegativeNumber(payload.pickupDeltaReplies, 0),
      pickupDeltaLikes: toNonNegativeNumber(payload.pickupDeltaLikes, 0),
      pickupDeltaViews: toNonNegativeNumber(payload.pickupDeltaViews, 0),
      pickupReviewStage: String(payload.pickupReviewStage || "").trim().slice(0, 24),
      pickupNextReviewAt: toNonNegativeNumber(payload.pickupNextReviewAt, 0),
      pickupSettledAt: toNonNegativeNumber(payload.pickupSettledAt, 0),
      pickupAuthorEngaged: Boolean(payload.pickupAuthorEngaged),
      pickupAuthorReplyUrl: normalizeTweetUrl(payload.pickupAuthorReplyUrl),
      replyCheckedAt: toNonNegativeNumber(payload.replyCheckedAt, 0),
      replyChecks: Math.max(0, Math.floor(Number(payload.replyChecks || 0))),
      replyObservedReplies: toNonNegativeNumber(payload.replyObservedReplies, 0),
      replyObservedLikes: toNonNegativeNumber(payload.replyObservedLikes, 0),
      replyObservedViews: toNonNegativeNumber(payload.replyObservedViews, 0),
      replyDeltaReplies: toNonNegativeNumber(payload.replyDeltaReplies, 0),
      replyDeltaLikes: toNonNegativeNumber(payload.replyDeltaLikes, 0),
      replyDeltaViews: toNonNegativeNumber(payload.replyDeltaViews, 0),
      replyTrafficCapturedAt: toNonNegativeNumber(payload.replyTrafficCapturedAt, 0),
      replyTrafficSource: String(payload.replyTrafficSource || "").trim().slice(0, 24)
    }];
  }

  function pruneReplyDetails(replyDetails = {}, limit = MAX_RUNTIME_REPLY_DETAILS) {
    return Object.fromEntries(
      Object.entries(replyDetails && typeof replyDetails === "object" ? replyDetails : {})
        .map(([url, detail]) => sanitizeReplyDetailEntry(url, detail))
        .filter(Boolean)
        .sort((left, right) => getRuntimeEntryTimestamp(right?.[1] || {}) - getRuntimeEntryTimestamp(left?.[1] || {}))
        .slice(0, limit)
    );
  }

  function sanitizeReplyArchiveEntry(entry = {}) {
    const payload = entry && typeof entry === "object" ? entry : {};
    const targetUrl = normalizeTweetUrl(payload.targetUrl || payload.url);
    const detailEntry = sanitizeReplyDetailEntry(targetUrl, payload);
    if (!targetUrl || !detailEntry?.[1]) {
      return null;
    }
    return {
      targetUrl,
      ...detailEntry[1]
    };
  }

  function pruneReplyArchive(replyArchive = [], limit = MAX_RUNTIME_REPLY_ARCHIVE) {
    return (Array.isArray(replyArchive) ? replyArchive : [])
      .map((entry) => sanitizeReplyArchiveEntry(entry))
      .filter(Boolean)
      .sort((left, right) => (
        Math.max(right.replyCheckedAt || 0, right.pickupCheckedAt || 0, right.timestamp || 0) -
        Math.max(left.replyCheckedAt || 0, left.pickupCheckedAt || 0, left.timestamp || 0)
      ))
      .slice(0, limit);
  }

  function sanitizeMediaSummaryEntry(tweetId, detail = {}) {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return null;
    }
    const payload = detail && typeof detail === "object" ? detail : {};
    const summary = String(payload.summary || "").trim().slice(0, 1200);
    const ocrText = String(payload.ocrText || payload.ocr || "").trim().slice(0, 1600);
    if (!summary && !ocrText) {
      return null;
    }
    return [normalizedTweetId, {
      tweetId: normalizedTweetId,
      summary,
      ocrText,
      confidence: Math.max(0, Math.min(1, Number(payload.confidence || 0))),
      source: String(payload.source || "agent-vision").trim().slice(0, 48),
      mediaKinds: limitStringList(payload.mediaKinds, 8, 24),
      frameCount: Math.max(0, Math.floor(Number(payload.frameCount || 0))),
      updatedAt: toNonNegativeNumber(payload.updatedAt, Date.now())
    }];
  }

  function pruneMediaSummaries(mediaSummaries = {}, limit = MAX_RUNTIME_MEDIA_SUMMARIES) {
    return Object.fromEntries(
      Object.entries(mediaSummaries && typeof mediaSummaries === "object" ? mediaSummaries : {})
        .map(([tweetId, detail]) => sanitizeMediaSummaryEntry(tweetId, detail))
        .filter(Boolean)
        .sort((left, right) => toNonNegativeNumber(right?.[1]?.updatedAt, 0) - toNonNegativeNumber(left?.[1]?.updatedAt, 0))
        .slice(0, limit)
    );
  }

  function pruneDraftPreviews(previews = {}, limit = MAX_DRAFT_PREVIEWS) {
    return Object.fromEntries(
      Object.entries(previews && typeof previews === "object" ? previews : {})
        .map(([url, preview]) => {
          const normalizedUrl = normalizeTweetUrl(url || preview?.url);
          if (!normalizedUrl) {
            return null;
          }
          return [normalizedUrl, {
            url: normalizedUrl,
            tweetId: normalizeApiTweetId(preview?.tweetId || extractTweetIdFromUrl(normalizedUrl)),
            replyText: sanitizeSnippet(preview?.replyText || preview?.previewText || preview?.draft, 560),
            confidence: Number(preview?.confidence || 0),
            riskFlags: limitStringList(preview?.riskFlags, 6, 48),
            updatedAt: toNonNegativeNumber(preview?.updatedAt, Date.now())
          }];
        })
        .filter((entry) => entry?.[1]?.replyText)
        .sort((left, right) => toNonNegativeNumber(right?.[1]?.updatedAt, 0) - toNonNegativeNumber(left?.[1]?.updatedAt, 0))
        .slice(0, limit)
    );
  }

  function getLocalRuntimeStateSnapshot(reason = "local-fallback") {
    const replyDetails = pruneReplyDetails(state.replyDetails);
    const replyArchive = pruneReplyArchive(state.replyArchive);
    const recentCandidates = pruneRecentCandidates(state.recentCandidates, EXECUTOR_SCAN_WINDOW_SIZE);
    const mediaSummaries = pruneMediaSummaries(state.mediaSummaries);
    return {
      settings: { ...(state.settings || {}) },
      repliedTweets: { ...(state.repliedTweets || {}) },
      dismissedTweets: { ...(state.dismissedTweets || {}) },
      replyDetails,
      replyArchive,
      replyQueue: Array.isArray(state.replyQueue) ? state.replyQueue.slice() : [],
      recentCandidates,
      relationshipStates: { ...(state.relationshipStates || {}) },
      mediaSummaries,
      trafficUpdatedAt: state.trafficUpdatedAt || 0,
      stats: { ...(state.stats || {}) },
      apiStateSource: reason
    };
  }

  function collectDomCandidateSnapshot() {
    const byUrl = new Map();

    getTweetNodes().forEach((article) => {
      let candidate = readStoredCandidate(article);
      const badge = article.querySelector(`.${BADGE_CLASS}`);
      const tier = String(badge?.getAttribute("data-tier") || candidate?.tier || "").trim();
      if (
        article instanceof Element &&
        typeof global.XReplyScorer?.analyzeTweet === "function" &&
        (!candidate || !Number(candidate?.finalScore || candidate?.score || 0))
      ) {
        try {
          const tweet = getTweetData(article);
          if (tweet?.url && !tweet.promoted && !tweet.isOwnTweet) {
            const baseAnalysis = global.XReplyScorer.analyzeTweet(tweet, state.settings);
            const analysis = applyOpportunityAdjustments(tweet, baseAnalysis, state.settings, buildOpportunityContext());
            const mediaSummary = getMediaSummaryFromState(state, extractTweetIdFromUrl(tweet.url));
            const draftCandidate = buildCandidatePayload(tweet, analysis, String(analysis.tier || tier || "low-outline"));
            candidate = attachCandidateExecutionMeta(draftCandidate, article, mediaSummary);
            storeCandidatePayload(article, candidate);
          }
        } catch (_error) {}
      }
      const url = normalizeTweetUrl(candidate?.url);
      const candidateTier = String(candidate?.tier || tier || "").trim();
      if (!url || !candidateTier || candidateTier === "hidden" || candidateTier === "replied") {
        return;
      }

      byUrl.set(url, {
        ...(candidate && typeof candidate === "object" ? candidate : {}),
        url,
        tier: candidateTier
      });
    });

    return sortApiAgentCandidates(Array.from(byUrl.values())).slice(0, EXECUTOR_SCAN_WINDOW_SIZE);
  }

  function mergeApiCandidateRecord(previous = {}, next = {}) {
    const url = normalizeTweetUrl(next?.url || previous?.url);
    const previousPeakFinalScore = Number(previous?.peakFinalScore ?? previous?.finalScore ?? previous?.score ?? 0);
    const nextPeakFinalScore = Number(next?.peakFinalScore ?? next?.finalScore ?? next?.score ?? 0);
    const useNextPeak = nextPeakFinalScore >= previousPeakFinalScore;
    const merged = {
      ...(previous && typeof previous === "object" ? previous : {}),
      ...(next && typeof next === "object" ? next : {})
    };

    [
      "score",
      "baseScore",
      "postScore",
      "reachLikelihood",
      "understandingConfidence",
      "authorFit",
      "finalScore"
    ].forEach((key) => {
      const previousValue = Number(previous?.[key] || 0);
      const nextValue = Number(next?.[key] || 0);
      if (previousValue > 0 && nextValue <= 0) {
        merged[key] = previous[key];
      }
    });

    [
      "text",
      "authorHandle",
      "authorName",
      "mediaAltText",
      "mediaKind",
      "sourceSurface",
      "trafficPhase",
      "trafficSource"
    ].forEach((key) => {
      if (String(previous?.[key] || "").trim() && !String(next?.[key] || "").trim()) {
        merged[key] = previous[key];
      }
    });

    [
      "matchedTopics",
      "matchedLanguages",
      "highlights"
    ].forEach((key) => {
      if (Array.isArray(previous?.[key]) && previous[key].length && (!Array.isArray(next?.[key]) || !next[key].length)) {
        merged[key] = previous[key];
      }
    });

    return {
      ...merged,
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

    return sortApiAgentCandidates(Array.from(mergedByUrl.values())).slice(0, EXECUTOR_SCAN_WINDOW_SIZE);
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

    const mergedCandidates = mergeApiCandidateLists(runtimeCandidates, domCandidates).filter((candidate) => {
      const url = normalizeTweetUrl(candidate?.url);
      if (!url) {
        return false;
      }
      if (hasTrackedTweetUrl(state.repliedTweetUrls, url) || hasTrackedTweetUrl(state.dismissedTweetUrls, url)) {
        return false;
      }
      if (hasTrackedTweetUrl(runtimeState?.repliedTweets, url) || hasTrackedTweetUrl(runtimeState?.dismissedTweets, url)) {
        return false;
      }
      if (hasTrackedTweetUrl(state.replyDetails, url) || hasTrackedTweetUrl(runtimeState?.replyDetails, url)) {
        return false;
      }
      return true;
    });
    const hydratedCandidates = mergedCandidates.map((candidate) => {
      const url = normalizeTweetUrl(candidate?.url);
      const tweetId = extractTweetIdFromUrl(url);
      const liveArticle = tweetId ? findTweetArticleByTweetId(tweetId, url) : findReplyArticle(url);
      const mediaSummary = tweetId ? getMediaSummaryFromState(runtimeState || {}, tweetId) : null;
      return attachCandidateExecutionMeta(candidate, liveArticle, mediaSummary);
    });
    return {
      ...(runtimeState && typeof runtimeState === "object" ? runtimeState : {}),
      recentCandidates: hydratedCandidates,
      lastScanAt: Number(
        state.lastScanCompletedAt ||
        runtimeState?.lastScanAt ||
        runtimeState?.updatedAt ||
        0
      ),
      pageCandidateSync: {
        runtimeCandidateCount: runtimeCandidates.length,
        domCandidateCount: domCandidates.length,
        usedDomFallback: domCandidates.length > 0 && mergedCandidates.length >= domCandidates.length && runtimeCandidates.length < domCandidates.length,
        scanPending: Boolean(state.scanTimer || state.lazyRescanTimer),
        updatedAt: Number(state.lastScanCompletedAt || runtimeState?.updatedAt || 0),
        scannedCount: Number(state.stats?.scannedCount || runtimeState?.scannedCount || 0),
        visibleCount: Number(state.stats?.visibleCount || runtimeState?.visibleCount || 0)
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
      (score >= 54 && ageMinutes <= 90) ||
      (score >= 46 && ageMinutes <= 20 && replies >= 1) ||
      (opportunityBoost >= 10 && ageMinutes <= 90) ||
      ((validatedRelationshipHot || memoryHot) && ageMinutes <= 90 && score >= 52)
    ) {
      key = "now";
    } else if (
      ageMinutes <= 180 && (
        score >= 44 ||
        opportunityBoost >= 6 ||
        relationshipStatus === "follow-up" ||
        validatedRelationshipHot ||
        memoryHot ||
        attributionKind === "topic-validated"
      )
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
    return laneKey === "now"
      ? "next"
      : (laneKey === "watch" || laneKey === "crowded")
        ? "tonight"
        : "tomorrow";
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

  function getMediaSummaryFromState(runtimeState = {}, tweetId = "") {
    const normalizedTweetId = normalizeApiTweetId(tweetId);
    if (!normalizedTweetId) {
      return null;
    }
    const summary = runtimeState?.mediaSummaries?.[normalizedTweetId] || state.mediaSummaries?.[normalizedTweetId] || null;
    if (!summary || typeof summary !== "object") {
      return null;
    }
    const clean = {
      tweetId: normalizedTweetId,
      summary: String(summary.summary || "").trim().slice(0, 1200),
      ocrText: String(summary.ocrText || "").trim().slice(0, 1600),
      confidence: Math.max(0, Math.min(1, Number(summary.confidence || 0))),
      source: String(summary.source || "").trim().slice(0, 48),
      mediaKinds: Array.isArray(summary.mediaKinds) ? summary.mediaKinds.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 8) : [],
      frameCount: Math.max(0, Math.floor(Number(summary.frameCount || 0))),
      updatedAt: Number(summary.updatedAt || 0)
    };
    return clean.summary || clean.ocrText ? clean : null;
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
    return Math.max(getConfiguredDisplayThreshold(settings), DEFAULT_EXECUTOR_SEND_FLOOR);
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

  function getReplyDropAgeMinutes(timestamp) {
    const normalized = Number(timestamp || 0);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      return 999;
    }
    return Math.max(0, Math.round((Date.now() - normalized) / 60000));
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
    const liveAgeMinutes = getReplyDropAgeMinutes(tweet?.timestamp || candidate?.timestamp || 0);
    const previewSurface = String(candidate?.peakSourceSurface || candidate?.sourceSurface || "").trim();
    const liveSurface = String(tweet?.sourceSurface || liveAnalysis?.sourceSurface || "").trim();
    const scoreDelta = liveScore - previewScore;
    const currentDelta = liveScore - currentCandidateScore;
    const meaningfulDrop = scoreDelta <= -5;
    const belowAverageLine = liveScore < averageLineScore;
    const belowExecutorSendFloor = liveScore < executorSendFloor;
    const belowDisplayThreshold = liveScore < displayThreshold;
    const olderThanAutoWindow = liveAgeMinutes > EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES;
    const staleReplyWindow = liveAgeMinutes > EXECUTOR_STALE_REPLY_MAX_AGE_MINUTES;
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
    if (olderThanAutoWindow) {
      flags.push(staleReplyWindow ? "older-than-reply-window" : "older-than-auto-window");
    }
    if (String(liveAnalysis?.blockReason || "").trim()) {
      flags.push(String(liveAnalysis.blockReason).trim());
    }

    const skipRecommended = belowDisplayThreshold || belowExecutorSendFloor || olderThanAutoWindow;
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
      liveAgeMinutes,
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
      olderThanAutoWindow,
      staleReplyWindow,
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
      if (recheck.olderThanAutoWindow) {
        return `打开后帖龄 ${recheck.liveAgeMinutes} 分钟，超过自动回复窗口 ${EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES} 分钟，建议跳过`;
      }
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

  function normalizeTrafficPhaseKey(phase = "") {
    const normalized = String(phase || "").trim().toLowerCase();
    if (["viral", "trending", "rising", "normal"].includes(normalized)) {
      return normalized;
    }
    return normalized ? normalized : "";
  }

  function buildExecutorTrafficProfile(metrics = {}) {
    const views = Math.max(0, Number(metrics?.views) || 0);
    const replies = Math.max(0, Number(metrics?.replies) || 0);
    const velocityPerHour = Math.max(0, Number(metrics?.velocityPerHour) || 0);
    const phase = normalizeTrafficPhaseKey(metrics?.phase);
    const trendingLike = phase === "trending" || phase === "viral";
    const risingLike = phase === "rising";
    const qualified = (
      views >= EXECUTOR_MIN_TRAFFIC_VIEWS ||
      replies >= EXECUTOR_MIN_TRAFFIC_REPLIES ||
      velocityPerHour >= EXECUTOR_MIN_TRAFFIC_VELOCITY_PER_HOUR ||
      (trendingLike && views >= EXECUTOR_TRENDING_MIN_TRAFFIC_VIEWS) ||
      (risingLike &&
        views >= EXECUTOR_RISING_MIN_TRAFFIC_VIEWS &&
        velocityPerHour >= EXECUTOR_RISING_MIN_TRAFFIC_VELOCITY_PER_HOUR)
    );
    const phaseRank = phase === "viral" ? 4 : phase === "trending" ? 3 : phase === "rising" ? 2 : phase === "normal" ? 1 : 0;
    const priority = (
      (qualified ? 1_000_000_000 : 0) +
      (phaseRank * 100_000_000) +
      (Math.min(views, 250000) * 100) +
      (Math.min(replies, 5000) * 1000) +
      Math.min(Math.round(velocityPerHour), 100000)
    );
    return {
      views,
      replies,
      velocityPerHour,
      phase,
      qualified,
      phaseRank,
      priority
    };
  }

  function sortApiAgentCandidates(candidates = []) {
    const now = Date.now();
    const getFreshnessBucket = (candidate) => {
      const timestamp = Number(candidate?.timestamp || 0);
      if (!Number.isFinite(timestamp) || timestamp <= 0) {
        return 0;
      }
      const ageMinutes = Math.max(0, (now - timestamp) / 60000);
      if (ageMinutes <= EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES) {
        return 2;
      }
      if (ageMinutes <= EXECUTOR_STALE_REPLY_MAX_AGE_MINUTES) {
        return 1;
      }
      return 0;
    };
    return (Array.isArray(candidates) ? candidates : [])
      .filter((candidate) => Boolean(normalizeTweetUrl(candidate?.url)))
      .map((candidate, index) => ({
        candidate,
        index,
        trafficProfile: buildExecutorTrafficProfile({
          views: candidate?.views,
          replies: candidate?.replies,
          velocityPerHour: candidate?.trafficVelocityPerHour,
          phase: candidate?.trafficPhase
        })
      }))
      .sort((left, right) => (
        Number(Boolean(right.candidate?.timelineInlineReplyEligible)) - Number(Boolean(left.candidate?.timelineInlineReplyEligible)) ||
        getFreshnessBucket(right.candidate) - getFreshnessBucket(left.candidate) ||
        right.trafficProfile.priority - left.trafficProfile.priority ||
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

  function buildReplyDropDraftTargetSchema() {
    return {
      version: "replydrop-draft-targets-v2",
      mode: "human-draft",
      workflow: "external-ai-chat-drafts",
      instruction: "ReplyDrop 只负责筛选和打包当前首页快照里的高分帖；外部 AI agent 按 candidates 顺序立刻在当前聊天窗口输出同语种、非模板、可直接人工复制的正式回复草稿或不建议回原因。不要自动刷新，不自动打开 composer，不自动排队，不自动发送。",
      mediaWorkflow: "若 laneKey=needs_media_summary 或 mediaContextMissing=true，agent 应调用 getMediaBundle(tweetId) 读取图片/视频 poster/首帧 URL，自行跑 OCR/vision，再调用 setMediaSummary({ tweetId, summary, ocrText, confidence }) 回填，然后重读 getDraftContext/getDraftTargets。",
      snapshotPolicy: {
        oneSnapshotOnly: true,
        noAutoRefresh: true,
        outputDestination: "current-chat",
        writeBackOptional: "Only call setDraftPreview or runExecutorAction when the human explicitly asks."
      },
      laneEnum: ["ready_now", "needs_media_summary", "needs_detail_context", "watch_later", "do_not_reply"],
      output: {
        snapshotId: "string",
        capturedAt: "number",
        rank: "number",
        domIndex: "number|null",
        visibleOnPage: "boolean",
        targetTweetId: "string",
        targetUrl: "string",
        authorHandle: "string",
        handle: "string",
        score: "number",
        ageMinutes: "number",
        lead: "string",
        textPreview: "string",
        mediaKind: "string",
        needsDetailContext: "boolean",
        mediaContextMissing: "boolean",
        mediaNotInspectedTextSufficient: "boolean",
        quickDraftAllowed: "boolean",
        mediaSummaryAvailable: "boolean",
        draftContextLabel: "quick-preview-draft | detail-ready-draft",
        primaryCandidateSource: "ready_now | human_fallback",
        lanes: "{ ready_now, needs_media_summary, needs_detail_context, watch_later, do_not_reply }",
        visibleScoredPosts: "all currently visible scored posts for page/API alignment",
        urgency: "string",
        recommendation: "reply | skip",
        replyText: "string",
        skipReason: "string",
        language: "same-as-post",
        confidence: "number",
        riskFlags: "string[]",
        sameHandlePostCount: "number",
        selectionHint: "string",
        draftAngleHints: "string[]",
        mediaSummary: "{ summary, ocrText, confidence, source, updatedAt }"
      }
    };
  }

  function buildExternalDraftAngleHints(context = {}) {
    const text = String(context.post?.text || "").replace(/\s+/g, " ").trim();
    const lower = text.toLowerCase();
    const hints = [];
    const hasAssetLanguage = (
      /\b(?:stock|stocks|share|shares|btc|bitcoin|eth|crypto|coin|token|portfolio|holding|holdings|invest|investment|profit|gain|gains|wealth|rich|millionaire|billionaire)\b/i.test(text) ||
      /(?:股票|股价|股價|持仓|持倉|投资|投資|收益|盈利|财富|財富|暴富|涨幅|漲幅|币|幣|比特币|比特幣|以太坊|加密货币|加密貨幣)/u.test(text) ||
      /(?:株|株式|投資|利益|資産|億|暗号資産|仮想通貨|ビットコイン)/u.test(text) ||
      /(?:주식|투자|수익|자산|부자|비트코인|암호화폐|코인)/u.test(text)
    );
    const hasStoryLanguage = (
      /\b(?:story|case|after|years?|prison|jail|forgot|forced|accidental|held|holding|long-term|long term|unrealized)\b/i.test(text) ||
      /(?:故事|案例|多年|长期|長期|被迫|监狱|監獄|忘记|忘記|持有|浮盈|账面|賬面)/u.test(text) ||
      /(?:物語|事例|長期|刑務所|偶然|保有|含み益)/u.test(text) ||
      /(?:사례|이야기|장기|감옥|교도소|강제|보유|수익률)/u.test(text)
    );
    const hasAdviceLanguage = (
      /\b(?:buy|sell|long|short|entry|exit|target|price prediction|worth buying|what to buy)\b/i.test(lower) ||
      /(?:买入|買入|卖出|賣出|做多|做空|入场|入場|出场|出場|目标价|目標價|价格预测|價格預測|值得买|值得買)/u.test(text)
    );

    if (hasAssetLanguage && hasStoryLanguage) {
      hints.push("可以保留为人工预览机会：按行为金融 / 人性耐心 / 长期持有的反直觉故事角度写，不要因财富相邻自动跳过。");
      hints.push("避免投资建议、买卖建议、价格预测、 ticker 推广、喊单或低信息 FOMO。");
      hints.push("可用角度：讨论人通常很难长期持有，特殊处境反而制造了罕见耐心。");
    } else if (hasAssetLanguage || hasAdviceLanguage) {
      hints.push("如需回复，只能写中性观察；避免投资建议、买卖建议、价格预测和项目推广。");
    }

    return hints;
  }

  function hasRecordedReplyInRuntime(runtimeState = {}, targetUrl = "") {
    const normalized = normalizeTweetUrl(targetUrl);
    if (!normalized) {
      return false;
    }
    return Boolean(
      hasTrackedTweetUrl(state.repliedTweetUrls, normalized) ||
      hasTrackedTweetUrl(state.replyDetails, normalized) ||
      hasTrackedTweetUrl(runtimeState?.repliedTweets, normalized) ||
      hasTrackedTweetUrl(runtimeState?.replyDetails, normalized)
    );
  }

  function articleHasQuoteCard(article) {
    if (!(article instanceof Element)) {
      return false;
    }
    const primaryUrl = normalizeTweetUrl(readTweetUrl(article));
    return Array.from(article.querySelectorAll('a[href*="/status/"]')).some((link) => {
      if (link.closest(ARTICLE_SELECTOR) !== article) {
        return false;
      }
      const url = normalizeTweetUrl(link.href || link.getAttribute("href") || "");
      return Boolean(url && primaryUrl && url !== primaryUrl);
    });
  }

  function articleHasShowMoreCue(article) {
    if (!(article instanceof Element)) {
      return false;
    }
    const text = String(article.textContent || "").replace(/\s+/g, " ").trim();
    return /(?:Show more|显示更多|顯示更多|查看更多|さらに表示|もっと見る|더 보기|자세히 보기)/i.test(text);
  }

  function buildDraftContextCompleteness(candidate = {}, article = null, includeMedia = false, mediaSummary = null) {
    const mediaKind = String(candidate?.mediaKind || "").trim();
    const hasVisualMedia = hasVisualMediaKind(mediaKind);
    const hasQuote = articleHasQuoteCard(article);
    const hasShowMore = articleHasShowMoreCue(article);
    const text = String(candidate?.text || candidate?.draft || "").trim();
    const semanticTokens = text
      .split(/[\s,.;:!?/\\|()[\]{}"'`~<>，。！？、]+/)
      .filter(Boolean)
      .length;
    const hasSummary = Boolean(mediaSummary?.summary || mediaSummary?.ocrText);
    const textCarriesThesis = text.length >= 110 || semanticTokens >= 18;
    const mediaContextMissing = hasVisualMedia && !hasSummary && !textCarriesThesis;
    const needsDetailContext = Boolean(
      mediaContextMissing ||
      hasQuote ||
      (hasShowMore && !textCarriesThesis) ||
      (hasVisualMedia && !hasSummary && !textCarriesThesis)
    );
    const quickDraftAllowed = Boolean(textCarriesThesis && !mediaContextMissing && !hasQuote);
    const flags = [];
    if (mediaContextMissing) flags.push("media_context_missing");
    if (hasVisualMedia) flags.push("media_post");
    if (hasVisualMedia && !hasSummary && textCarriesThesis) flags.push("media_not_inspected_text_sufficient");
    if (hasQuote) flags.push("quote_context_possible");
    if (hasShowMore) flags.push("show_more_possible");
    if (quickDraftAllowed) flags.push("quick_draft_allowed");
    if (needsDetailContext) flags.push("needs_detail_context");
    return {
      needsDetailContext,
      mediaContextMissing,
      mediaNotInspectedTextSufficient: Boolean(hasVisualMedia && !hasSummary && textCarriesThesis),
      quickDraftAllowed,
      mediaSummaryAvailable: hasSummary,
      draftContextLabel: needsDetailContext ? "quick-preview-draft" : "detail-ready-draft",
      flags,
      detailRewriteInstruction: needsDetailContext
        ? "这条首页预览上下文不完整；如果用户打开详情页，应基于展开正文/引用卡/图片OCR/视频首帧重新写一版。"
        : (quickDraftAllowed && hasShowMore ? "首页文字已足够做快速草稿；若打开详情页可再优化，不必阻断主槽。" : "")
    };
  }

  function canUseTimelineInlineReply(contextCompleteness = {}, article = null) {
    if (!(article instanceof Element) || !hasVisibleRect(article)) {
      return false;
    }
    if (contextCompleteness?.needsDetailContext || contextCompleteness?.mediaContextMissing) {
      return false;
    }
    return Boolean(
      contextCompleteness?.quickDraftAllowed ||
      String(contextCompleteness?.draftContextLabel || "") === "detail-ready-draft"
    );
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
        roundMaxTargets: EXECUTOR_ROUND_MAX_TARGETS,
        roundBudgetMs: EXECUTOR_ROUND_BUDGET_MS,
        consecutiveEmptyResultLimit: EXECUTOR_CONSECUTIVE_EMPTY_RESULT_LIMIT,
        emptyInboxMinRescans: EXECUTOR_EMPTY_INBOX_MIN_RESCANS,
        timeoutReasonCode: "target-timeout",
        emptyResultInstruction: "只有插件/runner没有拿到结构化结果的异常空返回才算 empty-result；value-below-send-floor、value-dropped-on-open、already-replied、target-page-mismatch 等正常拦截不计入。",
        noCandidateTimeoutMs: EXECUTOR_NO_CANDIDATE_TIMEOUT_MS,
      instruction: "从拿到候选开始计时，20秒内完成为正常；超过20秒必须停止当前目标并切换下一条。整轮最多10条或12分钟，先到即停止并回首页。连续3次 empty-result 视为执行链路异常，停止本轮并提示刷新后重试。若首页本轮没有 auto_safe 候选，调用 refreshRecommendations() 或自行刷新/滚动重扫至少1轮；15秒内仍无候选就返回 no-auto-safe-candidate 和 pickDiagnostics，不要继续空等。"
      },
      timelineReplyPolicy: {
        mode: "preview-first",
        preferredMethod: "runExecutorAction",
        preferredAction: "reply-from-timeline",
        instruction: "候选返回 execution.timelineInlineReplyEligible=true 时，agent 必须优先调用 runExecutorAction({ action:'reply-from-timeline', tweetId, draft }) 在首页预览卡片原地打开并提交；不要先打开详情页。只有 needsDetailContext/mediaContextMissing/quote/show-more 等上下文不完整时才走详情页 openComposer。"
      },
      externalDraftPolicy: {
        mode: "human-draft",
        workflow: "external-ai-chat-drafts",
        oneSnapshotOnly: true,
        noAutoRefreshWithoutHumanApproval: true,
        outputDestination: "current-chat",
        instruction: "人工写稿模式下，agent 只能基于 getDraftTargets() 返回的当前 snapshot 批量出稿；每个候选必须快速给出可复制草稿或不建议回原因。不要为了挑单个最优目标反复刷新或长时间停留；不要自动排队、打开回复框或发送。",
        mediaWorkflow: "当候选 mediaContextMissing=true 时，agent 应调用 getMediaBundle(tweetId) 获取媒体 URL / poster / previewUrl，自行 OCR/vision 后用 setMediaSummary() 回填；回填后再读 getDraftContext/getDraftTargets 生成更可靠草稿。",
        wealthStoryGuidance: "高流速财富/资产故事不应仅因 wealth/hype 相邻而自动跳过；人工预览模式下应保留机会，并用 draftAngleHints 约束为中性行为金融/故事观察角度。只有涉及投资建议、买卖、价格预测、项目推广、喊单或低信息 FOMO 时才跳过或强警告。"
      },
      preferredMethods: {
        getExecutorInbox: "getAgentInbox",
        getExecutorContext: "getCandidateContext",
        getExecutorSchema: "getReplySchema",
        runExecutorAction: [
          "reply-auto",
          "addToQueue",
          "openComposer",
          "submitReply",
          "markShipped",
          "skipCandidate"
        ]
      },
      methods: {
        health: { type: "read" },
        getCandidates: { type: "read" },
        getQueue: { type: "read" },
        getMediaBundle: { type: "read" },
        setMediaSummary: { type: "write" },
        getTrafficSnapshot: { type: "read" },
        getDraftTargets: { type: "read" },
        getDraftContext: { type: "read" },
        setDraftPreview: { type: "write" },
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
            timelineFirst: "boolean",
            targetStartedAt: "number",
            targetDeadlineAt: "number"
          }
        },
        replyFromTimeline: {
          type: "write",
          accepts: {
            url: "string",
            tweetId: "string",
            draft: "string",
            targetStartedAt: "number",
            targetDeadlineAt: "number"
          },
          useWhen: "candidate.execution.timelineInlineReplyEligible === true",
          fallback: "openComposer detail page path"
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
        unmarkReplied: { type: "write" },
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

  async function getReplyDropApiHealth() {
    const generatedAt = Date.now();
    let runtimeState = null;
    let runtimeError = "";
    try {
      runtimeState = await getApiRuntimeStateSnapshot();
    } catch (error) {
      runtimeError = String(error?.message || error || "state-unavailable");
    }

    const recentCandidates = Array.isArray(runtimeState?.recentCandidates)
      ? runtimeState.recentCandidates
      : (Array.isArray(state.recentCandidates) ? state.recentCandidates : []);
    const visibleArticles = getTweetNodes();
    const pageCandidateSync = runtimeState?.pageCandidateSync || null;
    const scanPending = Boolean(state.scanTimer || state.lazyRescanTimer);
    const lastScanAt = Number(
      state.lastScanCompletedAt ||
      runtimeState?.lastScanAt ||
      runtimeState?.updatedAt ||
      pageCandidateSync?.updatedAt ||
      0
    );
    const apiReady = !runtimeError && canExposeReplyDropApi();

    return {
      ok: true,
      version: "replydrop-health-v1",
      extensionVersion: chrome.runtime.getManifest().version,
      apiReady,
      bridgeReady: Boolean(state.apiBridgeBound),
      pageReady: document.readyState,
      location: normalizeTweetUrl(global.location.href),
      generatedAt,
      scanPending,
      lastScanAt,
      ageMsSinceLastScan: lastScanAt ? Math.max(0, generatedAt - lastScanAt) : null,
      counts: {
        domArticles: visibleArticles.length,
        recentCandidates: recentCandidates.length,
        scannedCount: Number(runtimeState?.scannedCount ?? state.stats?.scannedCount ?? 0),
        highScoreCount: Number(runtimeState?.highScoreCount ?? state.stats?.highScoreCount ?? 0),
        visibleCount: Number(runtimeState?.visibleCount ?? state.stats?.visibleCount ?? 0),
        queue: Array.isArray(runtimeState?.replyQueue) ? runtimeState.replyQueue.length : 0
      },
      pageCandidateSync,
      lastError: runtimeError || "",
      recommendedAction: runtimeError
        ? "reload-page-or-refresh-recommendations"
        : (scanPending && !lastScanAt ? "wait-and-retry" : (recentCandidates.length ? "read-draft-targets" : "refresh-recommendations")),
      errorCodes: runtimeError ? [runtimeError] : []
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
    const trafficProfile = buildExecutorTrafficProfile({
      views: candidate?.views,
      replies: candidate?.replies,
      velocityPerHour: candidate?.trafficVelocityPerHour,
      phase: candidate?.trafficPhase
    });
    const mediaKind = String(candidate?.mediaKind || "").trim();
    const mediaPresent = hasVisualMediaKind(mediaKind);
    const needsVision = mediaPresent && Boolean(candidate?.lowSemanticConfidence || text.length < 32);
    const mediaSummary = getMediaSummaryFromState(runtimeState, tweetId);
    const liveArticle = options?.article instanceof Element
      ? options.article
      : findTweetArticleByTweetId(tweetId, normalizedUrl);
    const recheck = buildLiveCandidateRecheck(candidate, liveArticle);
    const contextCompleteness = buildDraftContextCompleteness(candidate, liveArticle, Boolean(options?.includeMedia), mediaSummary);
    const timelineInlineReplyEligible = canUseTimelineInlineReply(contextCompleteness, liveArticle);
    const alreadyReplied = hasRecordedReplyInRuntime(runtimeState, normalizedUrl);
    const recommendedDecision = (recheck?.skipRecommended || !trafficProfile.qualified)
      ? "skip"
      : mapQueueSlotToDecision(recommendedSlot);
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
      ...(Array.isArray(recheck?.flags) ? recheck.flags : []),
      ...(Array.isArray(contextCompleteness.flags) ? contextCompleteness.flags : []),
      alreadyReplied ? "already_replied" : ""
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
          source: String(candidate?.trafficSource || "").trim(),
          qualified: Boolean(trafficProfile.qualified)
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
        lowSemanticConfidence: Boolean(candidate?.lowSemanticConfidence),
        breakdown: Array.isArray(candidate?.breakdown)
          ? candidate.breakdown.slice(0, 8).map((item) => ({
              key: String(item?.key || "").trim(),
              label: String(item?.label || "").trim(),
              amount: Number(item?.amount || 0),
              kind: String(item?.kind || "").trim()
            }))
          : []
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
        bundleIncluded: false,
        summary: mediaSummary
      },
      lifecycle: {
        alreadyReplied
      },
      contextCompleteness,
      execution: {
        timelineInlineReplyEligible,
        preferredOpenMode: timelineInlineReplyEligible ? "timeline-inline" : "detail-page",
        preferredAction: timelineInlineReplyEligible ? "replyFromTimeline" : "openComposer",
        instruction: timelineInlineReplyEligible
          ? "首页预览正文已足够定稿，优先调用 runExecutorAction({ action:'reply-from-timeline', tweetId, draft }) 在当前时间线原地打开并提交，不要先进详情页。"
          : "首页预览上下文不完整，先进入详情页复核后再回复。"
      },
      aiHints: {
        draftKeys: recheck?.skipRecommended ? [] : draftPlans.map((plan) => String(plan?.key || "").trim()).filter(Boolean),
        routePlans: recheck?.skipRecommended ? [] : routePlans.map((route) => simplifyRoutePlanForApi(route)),
        riskFlags,
        recheckHint: getCandidateRecheckHint(recheck),
        detailRewriteInstruction: contextCompleteness.detailRewriteInstruction
      },
      executionPolicy: buildReplyDropExecutionPolicy(options?.targetStartedAt || options?.generatedAt || Date.now())
    };
    context.aiHints.draftAngleHints = buildExternalDraftAngleHints(context);

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
    bundle.summary = getMediaSummaryFromState(runtimeState, normalizedTweetId);
    bundle.agentInstruction = "Agent 可读取 items[].src / poster / previewUrl 做 OCR 或 vision；完成后调用 setMediaSummary({ tweetId, summary, ocrText, confidence }) 回填给 ReplyDrop。";
    return bundle;
  }

  async function setReplyDropApiMediaSummary(payload = {}) {
    const normalizedPayload = payload && typeof payload === "object" ? payload : {};
    let runtimeState = null;
    try {
      runtimeState = await getApiRuntimeStateSnapshot();
    } catch {
      runtimeState = null;
    }
    const tweetId = normalizeApiTweetId(
      normalizedPayload.tweetId ||
      normalizedPayload.targetTweetId ||
      extractTweetIdFromUrl(normalizedPayload.url || normalizedPayload.targetUrl || "")
    );
    if (!tweetId) {
      return { ok: false, reason: "missing-tweet-id" };
    }
    const summary = String(normalizedPayload.summary || normalizedPayload.visionSummary || "").trim().slice(0, 1200);
    const ocrText = String(normalizedPayload.ocrText || normalizedPayload.ocr || "").trim().slice(0, 1600);
    if (!summary && !ocrText) {
      return { ok: false, reason: "missing-media-summary" };
    }
    const mediaKinds = Array.isArray(normalizedPayload.mediaKinds)
      ? normalizedPayload.mediaKinds.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 8)
      : [];
    const nextSummary = {
      tweetId,
      summary,
      ocrText,
      confidence: Math.max(0, Math.min(1, Number(normalizedPayload.confidence || 0))),
      source: String(normalizedPayload.source || "agent-vision").trim().slice(0, 48),
      mediaKinds,
      frameCount: Math.max(0, Math.floor(Number(normalizedPayload.frameCount || 0))),
      updatedAt: Date.now()
    };
    const nextMediaSummaries = pruneMediaSummaries({
      ...(runtimeState?.mediaSummaries || state.mediaSummaries || {}),
      [tweetId]: nextSummary
    });
    state.mediaSummaries = nextMediaSummaries;
    try {
      await updateRuntimeState({ mediaSummaries: nextMediaSummaries });
    } catch (_error) {}
    return {
      ok: true,
      tweetId,
      summary: nextSummary
    };
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
    if (String(context.routing?.recommendedDecision || "").trim() !== "reply-now") {
      return false;
    }
    if (context.recheck?.skipRecommended) {
      return false;
    }
    if (Array.isArray(context.aiHints?.riskFlags) && context.aiHints.riskFlags.includes("vision_required_but_missing")) {
      return false;
    }
    const score = Number(context.scoring?.score || context.scoring?.finalScore || 0);
    const executorSendFloor = Number(context.recheck?.executorSendFloor || getConfiguredExecutorSendFloor(state.settings));
    const ageMinutes = Number(context.recheck?.liveAgeMinutes || context.post?.ageMinutes || 999);
    const trafficProfile = buildExecutorTrafficProfile({
      views: context.post?.views,
      replies: context.post?.replies,
      velocityPerHour: context.post?.traffic?.velocityPerHour,
      phase: context.post?.traffic?.phase
    });
    if (ageMinutes > EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES) {
      return false;
    }
    if (!context.execution?.timelineInlineReplyEligible) {
      return false;
    }
    if (!trafficProfile.qualified) {
      return false;
    }
    return score >= executorSendFloor;
  }

  function normalizeExecutorPolicyText(value = "") {
    return String(value || "")
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function testExecutorPolicyText(text = "", patterns = []) {
    const source = normalizeExecutorPolicyText(text);
    return patterns.some((pattern) => pattern.test(source));
  }

  function getRecentConsecutiveRepliedAuthorCount(runtimeState = {}) {
    const now = Date.now();
    const entries = Object.values(runtimeState?.replyDetails || {})
      .map((detail) => {
        const shippedAt = Number(detail?.timestamp || detail?.shippedAt || detail?.completedAt || detail?.createdAt || 0);
        return {
          handle: normalizeHandle(detail?.authorHandle || detail?.handle || ""),
          shippedAt: shippedAt || 0
        };
      })
      .filter((entry) => entry.handle && (!entry.shippedAt || now - entry.shippedAt <= 12 * 60 * 60 * 1000))
      .sort((left, right) => Number(right.shippedAt || 0) - Number(left.shippedAt || 0));
    const latestHandle = entries[0]?.handle || "";
    if (!latestHandle) {
      return { handle: "", count: 0 };
    }
    let count = 0;
    for (const entry of entries) {
      if (entry.handle !== latestHandle) {
        break;
      }
      count += 1;
    }
    return { handle: latestHandle, count };
  }

  function getReplyDropAutoSafety(context = {}, runtimeState = {}, selectedAuthorCounts = new Map()) {
    const reasons = [];
    const handle = normalizeHandle(context.author?.handle || "");
    const recentConsecutiveAuthor = getRecentConsecutiveRepliedAuthorCount(runtimeState);
    const selectedAuthorCount = handle && typeof selectedAuthorCounts?.get === "function"
      ? Number(selectedAuthorCounts.get(handle) || 0)
      : 0;

    if (
      handle &&
      (
        selectedAuthorCount >= 2 ||
        (recentConsecutiveAuthor.handle === handle && recentConsecutiveAuthor.count >= 2)
      )
    ) {
      reasons.push("third-consecutive-same-author-auto-block");
    }

    if (!isReplyDropContextActionable(context)) {
      reasons.push(...getReplyDropContextFilterReasons(context));
    }

    const uniqueReasons = Array.from(new Set(reasons.filter(Boolean)));
    const blocked = uniqueReasons.some((reason) => /auto-block/i.test(reason));
    const fallbackEligible = !blocked && isReplyDropAutoFallbackEligible(context);
    const fallbackReasons = uniqueReasons.filter((reason) => (
      reason !== "not-timeline-inline-eligible" &&
      reason !== "older-than-auto-window"
    ));
    const humanReview = !blocked && !fallbackEligible && uniqueReasons.length > 0;
    return {
      tier: blocked ? "blocked" : (fallbackEligible ? "auto_fallback" : (humanReview ? "human_review" : "auto_safe")),
      reasons: fallbackEligible ? fallbackReasons : uniqueReasons
    };
  }

  function isReplyDropAutoFallbackEligible(context = {}) {
    if (!context || typeof context !== "object") {
      return false;
    }
    if (String(context.routing?.recommendedDecision || "").trim() !== "reply-now") {
      return false;
    }
    if (context.recheck?.skipRecommended) {
      return false;
    }
    if (Array.isArray(context.aiHints?.riskFlags) && context.aiHints.riskFlags.includes("vision_required_but_missing")) {
      return false;
    }
    if (Boolean(context.contextCompleteness?.mediaContextMissing)) {
      return false;
    }
    const score = Number(context.scoring?.score || context.scoring?.finalScore || 0);
    const executorSendFloor = Number(context.recheck?.executorSendFloor || getConfiguredExecutorSendFloor(state.settings));
    const ageMinutes = Number(context.recheck?.liveAgeMinutes || context.post?.ageMinutes || 999);
    if (score < executorSendFloor || ageMinutes > EXECUTOR_STALE_REPLY_MAX_AGE_MINUTES) {
      return false;
    }
    if (context.execution?.timelineInlineReplyEligible) {
      return false;
    }
    const reasons = getReplyDropContextFilterReasons(context);
    return reasons.every((reason) => (
      reason === "not-timeline-inline-eligible" ||
      reason === "older-than-auto-window"
    ));
  }

  function getReplyDropContextFilterReasons(context = {}) {
    const reasons = [];
    if (!context || typeof context !== "object") {
      return ["invalid-context"];
    }
    const score = Number(context.scoring?.score || context.scoring?.finalScore || 0);
    const displayThreshold = Number(context.recheck?.displayThreshold || getConfiguredDisplayThreshold(state.settings));
    const executorSendFloor = Number(context.recheck?.executorSendFloor || getConfiguredExecutorSendFloor(state.settings));
    const ageMinutes = Number(context.recheck?.liveAgeMinutes || context.post?.ageMinutes || 999);
    const recommendedDecision = String(context.routing?.recommendedDecision || "").trim();
    const trafficProfile = buildExecutorTrafficProfile({
      views: context.post?.views,
      replies: context.post?.replies,
      velocityPerHour: context.post?.traffic?.velocityPerHour,
      phase: context.post?.traffic?.phase
    });
    if (recommendedDecision && recommendedDecision !== "reply-now") {
      reasons.push(`decision-${recommendedDecision}`);
    }
    if (context.recheck?.skipRecommended) {
      reasons.push("skip-recommended");
    }
    if (score < displayThreshold) {
      reasons.push("below-display-floor");
    }
    if (score < executorSendFloor) {
      reasons.push("below-executor-send-floor");
    }
    if (!trafficProfile.qualified) {
      reasons.push("below-traffic-floor");
    }
    if (ageMinutes > EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES) {
      reasons.push(ageMinutes > EXECUTOR_STALE_REPLY_MAX_AGE_MINUTES ? "older-than-reply-window" : "older-than-auto-window");
    }
    if (!context.execution?.timelineInlineReplyEligible) {
      reasons.push("not-timeline-inline-eligible");
    }
    if (String(context.scoring?.blockReason || "").trim()) {
      reasons.push(String(context.scoring.blockReason).trim());
    }
    if (Array.isArray(context.recheck?.flags)) {
      context.recheck.flags.forEach((flag) => {
        const normalized = String(flag || "").trim();
        if (normalized) {
          reasons.push(normalized);
        }
      });
    }
    if (Array.isArray(context.aiHints?.riskFlags)) {
      context.aiHints.riskFlags.forEach((flag) => {
        const normalized = String(flag || "").trim();
        if (normalized) {
          reasons.push(normalized);
        }
      });
    }
    if (!reasons.length && !isReplyDropContextActionable(context)) {
      reasons.push("not-actionable");
    }
    return Array.from(new Set(reasons));
  }

  function summarizeFilteredExecutorCandidate(context = {}) {
    const autoSafety = context.autoSafety && typeof context.autoSafety === "object"
      ? context.autoSafety
      : null;
    const reasons = Array.from(new Set([
      ...(autoSafety?.reasons || []),
      ...getReplyDropContextFilterReasons(context)
    ].filter(Boolean)));
    return {
      tweetId: String(context.tweetId || "").trim(),
      url: normalizeTweetUrl(context.url),
      authorHandle: String(context.author?.handle || "").trim(),
      authorName: String(context.author?.name || "").trim(),
      text: String(context.post?.text || "").trim().slice(0, 280),
      textSummary: String(context.post?.text || "").trim().slice(0, 160),
      score: Number(context.scoring?.score || context.scoring?.finalScore || 0),
      finalScore: Number(context.scoring?.finalScore || context.scoring?.score || 0),
      recommendedDecision: String(context.routing?.recommendedDecision || "").trim(),
      laneKey: String(context.routing?.laneKey || "").trim(),
      laneLabel: String(context.routing?.laneLabel || "").trim(),
      timelineInlineReplyEligible: Boolean(context.execution?.timelineInlineReplyEligible),
      preferredOpenMode: String(context.execution?.preferredOpenMode || "").trim(),
      preferredAction: String(context.execution?.preferredAction || "").trim(),
      autoSafetyTier: String(autoSafety?.tier || "").trim(),
      skipRecommended: Boolean(context.recheck?.skipRecommended),
      recheckHint: String(context.aiHints?.recheckHint || "").trim(),
      reasons
    };
  }

  function summarizeExecutorSkipReasons(filteredCandidates = []) {
    return filteredCandidates.reduce((summary, candidate) => {
      (Array.isArray(candidate?.reasons) ? candidate.reasons : []).forEach((reason) => {
        const key = String(reason || "").trim();
        if (!key) {
          return;
        }
        summary[key] = (summary[key] || 0) + 1;
      });
      return summary;
    }, {});
  }

  function summarizeExecutorReasonCounts(contexts = []) {
    return (Array.isArray(contexts) ? contexts : []).reduce((summary, context) => {
      const autoReasons = Array.isArray(context?.autoSafety?.reasons) ? context.autoSafety.reasons : [];
      const filterReasons = getReplyDropContextFilterReasons(context);
      const scoringKeys = Array.isArray(context?.scoring?.breakdown)
        ? context.scoring.breakdown.map((item) => item?.key)
        : [];
      [...autoReasons, ...filterReasons, ...scoringKeys].forEach((reason) => {
        const key = String(reason || "").trim();
        if (!key) {
          return;
        }
        summary[key] = (summary[key] || 0) + 1;
      });
      return summary;
    }, {});
  }

  function getTopExecutorReasonCodes(contexts = [], limit = 8) {
    const counts = summarizeExecutorReasonCounts(contexts);
    return Object.entries(counts)
      .sort((left, right) => Number(right[1] || 0) - Number(left[1] || 0) || String(left[0]).localeCompare(String(right[0])))
      .slice(0, limit)
      .map(([code, count]) => ({ code, count }));
  }

  function summarizeExecutorCandidateDiagnostics(context = {}) {
    const trafficProfile = buildExecutorTrafficProfile({
      views: context.post?.views,
      replies: context.post?.replies,
      velocityPerHour: context.post?.traffic?.velocityPerHour,
      phase: context.post?.traffic?.phase
    });
    return {
      tweetId: String(context.tweetId || "").trim(),
      score: Number(context.scoring?.score || context.scoring?.finalScore || 0),
      finalScore: Number(context.scoring?.finalScore || context.scoring?.score || 0),
      views: trafficProfile.views,
      replies: trafficProfile.replies,
      trafficVelocityPerHour: trafficProfile.velocityPerHour,
      trafficPhase: trafficProfile.phase,
      trafficQualified: trafficProfile.qualified,
      recommendedDecision: String(context.routing?.recommendedDecision || "").trim(),
      autoSafetyTier: String(context.autoSafety?.tier || "").trim(),
      timelineInlineReplyEligible: Boolean(context.execution?.timelineInlineReplyEligible),
      preferredAction: String(context.execution?.preferredAction || "").trim(),
      reasonCodes: Array.from(new Set([
        ...((Array.isArray(context.autoSafety?.reasons) ? context.autoSafety.reasons : []).map((reason) => String(reason || "").trim())),
        ...getReplyDropContextFilterReasons(context).map((reason) => String(reason || "").trim())
      ].filter(Boolean))).slice(0, 12),
      scoringCodes: Array.isArray(context.scoring?.breakdown)
        ? context.scoring.breakdown.map((item) => String(item?.key || "").trim()).filter(Boolean).slice(0, 10)
        : []
    };
  }

  function buildEmptyInboxRecovery(contexts = [], generatedAt = Date.now()) {
    const actionableCount = contexts.filter((context) => (
      context?.autoSafety?.tier
        ? (context.autoSafety.tier === "auto_safe" || context.autoSafety.tier === "auto_fallback")
        : isReplyDropContextActionable(context)
    )).length;
    return {
      actionableCount,
      requiredWhenActionableCountIsZero: true,
      minRescansBeforeGivingUp: EXECUTOR_EMPTY_INBOX_MIN_RESCANS,
      recommendedAction: actionableCount > 0 ? "process-candidates" : "refresh-recommendations",
      method: "refreshRecommendations",
      noCandidateTimeoutMs: EXECUTOR_NO_CANDIDATE_TIMEOUT_MS,
      instruction: actionableCount > 0
        ? "已有合格候选，按评分顺序处理。"
        : "本轮没有合格推荐时先调用 refreshRecommendations({ mode: 'scroll' }) 或刷新首页重扫1轮；15秒内仍无候选就返回 no-auto-safe-candidate + pickDiagnostics，不要继续空等。",
      generatedAt
    };
  }

  function isReplyDropExecutorHotQueueEntryUsable(context = {}, runtimeState = {}) {
    if (!context || typeof context !== "object") {
      return false;
    }
    const targetUrl = normalizeTweetUrl(context.url || context.targetUrl || context.post?.url || "");
    if (!targetUrl) {
      return false;
    }
    if (hasTrackedTweetUrl(state.repliedTweetUrls, targetUrl) || hasTrackedTweetUrl(state.dismissedTweetUrls, targetUrl)) {
      return false;
    }
    if (hasTrackedTweetUrl(runtimeState?.repliedTweets, targetUrl) || hasTrackedTweetUrl(runtimeState?.dismissedTweets, targetUrl)) {
      return false;
    }
    const score = Number(context.scoring?.score || context.scoring?.finalScore || 0);
    const executorSendFloor = Number(context.recheck?.executorSendFloor || getConfiguredExecutorSendFloor(state.settings));
    const ageMinutes = Number(context.recheck?.liveAgeMinutes || context.post?.ageMinutes || 999);
    if (score < executorSendFloor || ageMinutes > EXECUTOR_AUTO_REPLY_MAX_AGE_MINUTES) {
      return false;
    }
    const tier = String(context.autoSafety?.tier || "").trim();
    if (tier && tier !== "auto_safe" && tier !== "auto_fallback") {
      return false;
    }
    if (String(context.routing?.recommendedDecision || "").trim() !== "reply-now") {
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

  function cacheReplyDropExecutorHotQueue(contexts = []) {
    const deduped = [];
    const seen = new Set();
    (Array.isArray(contexts) ? contexts : []).forEach((context) => {
      const targetUrl = normalizeTweetUrl(context?.url || context?.targetUrl || context?.post?.url || "");
      if (!targetUrl || seen.has(targetUrl)) {
        return;
      }
      seen.add(targetUrl);
      deduped.push({
        ...(context && typeof context === "object" ? context : {}),
        url: targetUrl,
        targetUrl
      });
    });
    state.executorHotQueue = deduped.slice(0, 12);
    state.executorHotQueueUpdatedAt = Date.now();
  }

  function readReplyDropExecutorHotQueue(runtimeState = {}, limit = 6) {
    const now = Date.now();
    const maxAgeMs = 20 * 60 * 1000;
    if (!Array.isArray(state.executorHotQueue) || !state.executorHotQueue.length) {
      return [];
    }
    if (state.executorHotQueueUpdatedAt && now - state.executorHotQueueUpdatedAt > maxAgeMs) {
      state.executorHotQueue = [];
      return [];
    }
    const filtered = [];
    const seen = new Set();
    state.executorHotQueue.forEach((context) => {
      const targetUrl = normalizeTweetUrl(context?.url || context?.targetUrl || context?.post?.url || "");
      if (!targetUrl || seen.has(targetUrl)) {
        return;
      }
      if (!isReplyDropExecutorHotQueueEntryUsable(context, runtimeState)) {
        return;
      }
      seen.add(targetUrl);
      filtered.push({
        ...(context && typeof context === "object" ? context : {}),
        url: targetUrl,
        targetUrl,
        hotQueueFallback: true
      });
    });
    state.executorHotQueue = filtered.slice(0, 12);
    return filtered.slice(0, Math.max(1, Math.min(16, Math.floor(Number(limit) || 6))));
  }

  function shouldFallbackReplyDropTimelineToDetail(result = {}, targetUrl = "") {
    if (!targetUrl) {
      return false;
    }
    if (!result || result.ok) {
      return false;
    }
    const reasonCode = String(result.reasonCode || result.reason || "").trim();
    return [
      "context-not-locked",
      "reply-context-missing",
      "reply-target-lost",
      "timeline-article-missing",
      "composer-not-ready",
      "reply-surface-not-ready",
      "navigating"
    ].includes(reasonCode);
  }

  async function refreshReplyDropRecommendations(options = {}) {
    const requestedMode = String(options?.mode || "auto").trim().toLowerCase();
    const mode = requestedMode === "auto" || !requestedMode
      ? (state.executorNoCandidateStreak >= 2 ? "reload" : "scroll")
      : requestedMode;
    const pages = Math.max(1, Math.min(4, Math.floor(Number(options?.pages) || 1)));
    const waitMs = Math.max(250, Math.min(2500, Math.floor(Number(options?.waitMs) || 450)));
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
        mode: requestedMode,
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
      mode: requestedMode,
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
    const scanWindowSize = Math.min(EXECUTOR_SCAN_WINDOW_SIZE, Math.max(limit * 3, 18));
    const orderedCandidates = [
      ...sortedCandidates.filter((candidate) => !String(candidate?.blockReason || "").trim()),
      ...sortedCandidates.filter((candidate) => String(candidate?.blockReason || "").trim())
    ].slice(0, scanWindowSize);
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

    const selectedAuthorCounts = new Map();
    contexts.forEach((context) => {
      context.autoSafety = getReplyDropAutoSafety(context, runtimeState, selectedAuthorCounts);
      if (context.autoSafety.tier === "auto_safe") {
        const handle = normalizeHandle(context.author?.handle || "");
        if (handle) {
          selectedAuthorCounts.set(handle, Number(selectedAuthorCounts.get(handle) || 0) + 1);
        }
      }
    });
    const autoSafeContexts = contexts.filter((context) => context.autoSafety?.tier === "auto_safe");
    const fallbackContexts = contexts.filter((context) => context.autoSafety?.tier === "auto_fallback");
    const fallbackKeys = new Set(fallbackContexts.map((context) => String(context.tweetId || "").trim()).filter(Boolean));
    const actionablePool = [...autoSafeContexts, ...fallbackContexts];
    const liveActionableContexts = actionablePool.slice(0, limit);
    if (actionablePool.length > 0) {
      cacheReplyDropExecutorHotQueue(actionablePool);
      state.executorNoCandidateStreak = 0;
    } else {
      state.executorNoCandidateStreak = Math.max(0, Number(state.executorNoCandidateStreak || 0)) + 1;
    }
    const hotQueueFallbackCandidates = actionablePool.length > 0 ? [] : readReplyDropExecutorHotQueue(runtimeState, limit);
    const actionableContexts = liveActionableContexts.length > 0 ? liveActionableContexts : hotQueueFallbackCandidates;
    const filteredCandidates = contexts
      .filter((context) => context.autoSafety?.tier !== "auto_safe" && !fallbackKeys.has(String(context.tweetId || "").trim()))
      .map((context) => summarizeFilteredExecutorCandidate(context));
    const autoLanes = {
      auto_safe: autoSafeContexts,
      auto_fallback: fallbackContexts,
      human_review: contexts.filter((context) => context.autoSafety?.tier === "human_review"),
      blocked: contexts.filter((context) => context.autoSafety?.tier === "blocked")
    };
    const topExcluded = filteredCandidates
      .slice()
      .sort((left, right) => Number(right.score || 0) - Number(left.score || 0))
      .slice(0, 5);
    const topFilteredCodes = getTopExecutorReasonCodes(contexts, 12);
    const topBlockedCodes = getTopExecutorReasonCodes(autoLanes.blocked, 8);
    const topHumanReviewCodes = getTopExecutorReasonCodes(autoLanes.human_review, 8);

    return {
      version: "replydrop-agent-inbox-v1",
      generatedAt,
      limit,
      scanWindowSize,
      candidates: actionableContexts,
      autoLanes,
      candidateDiagnostics: actionableContexts.map(summarizeExecutorCandidateDiagnostics),
      diagnosticCandidates: contexts.slice(0, Math.max(limit, 32)),
      filteredCandidates,
      skipReasons: summarizeExecutorSkipReasons(filteredCandidates),
      pickDiagnostics: {
        scannedCount: Number(runtimeState?.pageCandidateSync?.scannedCount || 0),
        visibleCount: Number(runtimeState?.pageCandidateSync?.visibleCount || 0),
        scanWindowSize,
        recentCandidateCount: Array.isArray(runtimeState?.recentCandidates) ? runtimeState.recentCandidates.length : 0,
        candidateCount: actionableContexts.length,
        actionablePoolCount: actionablePool.length,
        hotQueueFallbackCount: hotQueueFallbackCandidates.length,
        hotQueueUsed: actionablePool.length === 0 && hotQueueFallbackCandidates.length > 0,
        noCandidateStreak: Number(state.executorNoCandidateStreak || 0),
        safeCandidateCount: actionableContexts.length,
        autoSafeCount: autoSafeContexts.length,
        fallbackCount: fallbackContexts.length,
        humanReviewCount: autoLanes.human_review.length,
        blockedCount: autoLanes.blocked.length,
        blockedCandidateCount: autoLanes.blocked.length,
        filteredCount: filteredCandidates.length,
        noAutoSafeCandidate: autoSafeContexts.length === 0,
        recommendedResult: actionableContexts.length ? "process-candidates" : "no-auto-safe-candidate",
        topFilteredCodes,
        topBlockedCodes,
        topHumanReviewCodes,
        topExcluded
      },
      pageCandidateSync: runtimeState?.pageCandidateSync || null,
      emptyInboxRecovery: buildEmptyInboxRecovery(contexts, generatedAt),
      executionPolicy: buildReplyDropExecutionPolicy(generatedAt),
      outputSchema: buildReplyDropReplySchema()
    };
  }

  function isReplyDropDraftTarget(context = {}, minScore = 54) {
    if (!context || typeof context !== "object") {
      return false;
    }
    if (getReplyDropDraftLaneKey(context, minScore) !== "ready_now") {
      return false;
    }
    return true;
  }

  function hasDraftRiskFlag(context = {}, patterns = []) {
    const flags = Array.isArray(context.aiHints?.riskFlags) ? context.aiHints.riskFlags : [];
    const scoringKeys = Array.isArray(context.scoring?.breakdown) ? context.scoring.breakdown : [];
    const values = [
      ...flags,
      ...scoringKeys.map((item) => item?.key),
      String(context.scoring?.blockReason || "")
    ].map((item) => String(item || "").trim()).filter(Boolean);
    return values.some((value) => patterns.some((pattern) => pattern.test(value)));
  }

  function getReplyDropDraftLaneKey(context = {}, minScore = 54) {
    if (!context || typeof context !== "object") {
      return "do_not_reply";
    }
    const score = Number(context.scoring?.score || context.scoring?.finalScore || 0);
    const decision = String(context.routing?.recommendedDecision || "").trim();
    const slot = String(context.routing?.recommendedSlot || "").trim();
    const flags = Array.isArray(context.aiHints?.riskFlags) ? context.aiHints.riskFlags : [];
    const hardRisk = (
      String(context.scoring?.blockReason || "").trim() ||
      context.lifecycle?.alreadyReplied ||
      hasDraftRiskFlag(context, [
        /already_replied/i
      ])
    );

    if (hardRisk) {
      return "do_not_reply";
    }

    if (
      flags.includes("vision_required_but_missing") ||
      flags.includes("media_context_missing") ||
      Boolean(context.contextCompleteness?.mediaContextMissing)
    ) {
      return "needs_media_summary";
    }

    if (
      flags.includes("needs_detail_context") ||
      flags.includes("quote_context_possible") ||
      Boolean(context.contextCompleteness?.needsDetailContext)
    ) {
      return "needs_detail_context";
    }

    if (score < minScore) {
      return score >= Math.max(30, minScore - 18) ? "watch_later" : "do_not_reply";
    }

    if (decision === "skip") {
      return "do_not_reply";
    }

    return "ready_now";
  }

  function getReplyDropDraftLaneLabel(key = "") {
    switch (key) {
      case "ready_now":
      case "replyNow":
        return "可立即回";
      case "needs_media_summary":
        return "需媒体摘要";
      case "needs_detail_context":
      case "needsDetail":
        return "需详情上下文";
      case "do_not_reply":
      case "notRecommended":
        return "不建议碰";
      case "watch_later":
      case "watchLater":
        return "稍后观察";
      default:
        return "未分类";
    }
  }

  function isHumanDraftFallbackEligible(candidate = {}) {
    if (!candidate || typeof candidate !== "object") {
      return false;
    }
    if (candidate.laneKey === "watch_later") {
      return true;
    }
    if (candidate.laneKey === "needs_detail_context" && candidate.quickDraftAllowed && !candidate.mediaContextMissing) {
      return true;
    }
    return false;
  }

  function buildHumanDraftPrimaryCandidates(lanes = {}, limit = 6) {
    const readyNow = Array.isArray(lanes.ready_now) ? lanes.ready_now : [];
    if (readyNow.length >= limit || readyNow.length > 0) {
      return readyNow.slice(0, limit);
    }

    const fallbackPool = [
      ...(Array.isArray(lanes.watch_later) ? lanes.watch_later : []),
      ...(Array.isArray(lanes.needs_detail_context) ? lanes.needs_detail_context : [])
    ].filter(isHumanDraftFallbackEligible);

    return fallbackPool
      .sort((left, right) => (
        Number(right.score || 0) - Number(left.score || 0) ||
        Number(left.rank || 9999) - Number(right.rank || 9999)
      ))
      .slice(0, limit);
  }

  function buildDraftTargetDomLocationMap() {
    const byUrl = new Map();
    const byTweetId = new Map();
    getTweetNodes().forEach((article, index) => {
      const url = normalizeTweetUrl(readTweetUrl(article));
      const tweetId = extractTweetIdFromUrl(url);
      const rect = article.getBoundingClientRect();
      const location = {
        visibleOnPage: true,
        domIndex: index + 1,
        viewportPosition: Number.isFinite(rect.top) ? Math.round(rect.top) : null,
        handle: readAuthorHandle(article),
        textPreview: String(readText(article) || "").replace(/\s+/g, " ").trim().slice(0, 80),
        mediaKind: String(readMediaKind(article) || "").trim()
      };
      if (url) {
        byUrl.set(url, location);
      }
      if (tweetId) {
        byTweetId.set(tweetId, location);
      }
    });
    return { byUrl, byTweetId, count: getTweetNodes().length };
  }

  function buildDraftLeadText(text = "", maxLength = 72) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
      return "";
    }
    const sentenceMatch = normalized.match(/^(.{1,72}?[.!?。！？…]|.{1,72})(?:\s|$)/u);
    const sentence = String(sentenceMatch?.[1] || "").trim();
    if (sentence) {
      return sentence.slice(0, maxLength);
    }
    return normalized.slice(0, maxLength);
  }

  function collectVisibleDraftTargetFallbackCandidates(runtimeState = {}, attributionModel = null) {
    const fallbackCandidates = [];
    const opportunityContext = {
      relationshipStates: {
        ...(runtimeState?.relationshipStates || state.relationshipStates || {})
      },
      attributionModel: attributionModel || buildApiAttributionModel(runtimeState)
    };

    getTweetNodes().forEach((article) => {
      const url = normalizeTweetUrl(readTweetUrl(article));
      const tweetId = extractTweetIdFromUrl(url);
      if (!url || !tweetId) {
        return;
      }

      let candidate = readStoredCandidate(article);
      const candidateScore = Number(candidate?.finalScore || candidate?.score || 0);
      if (!(candidate && candidate.url && candidateScore > 0)) {
        try {
          const tweet = getTweetData(article);
          if (tweet?.url && !tweet.promoted && !tweet.isOwnTweet) {
            const baseAnalysis = global.XReplyScorer?.analyzeTweet?.(tweet, state.settings);
            const analysis = applyOpportunityAdjustments(tweet, baseAnalysis, state.settings, opportunityContext);
            const effectiveTier = String(analysis?.tier || candidate?.tier || "").trim();
            if (analysis && effectiveTier && effectiveTier !== "hidden" && effectiveTier !== "replied") {
              const mediaSummary = getMediaSummaryFromState(runtimeState || {}, extractTweetIdFromUrl(tweet.url));
              const draftCandidate = buildCandidatePayload(tweet, analysis, effectiveTier);
              candidate = attachCandidateExecutionMeta(draftCandidate, article, mediaSummary);
              storeCandidatePayload(article, candidate);
            }
          }
        } catch (_error) {}
      }

      const normalizedCandidateUrl = normalizeTweetUrl(candidate?.url || url);
      const finalScore = Number(candidate?.finalScore || candidate?.score || 0);
      if (!normalizedCandidateUrl || finalScore <= 0) {
        return;
      }

      fallbackCandidates.push({
        ...(candidate && typeof candidate === "object" ? candidate : {}),
        url: normalizedCandidateUrl
      });
    });

    return sortApiAgentCandidates(fallbackCandidates);
  }

  function summarizeDraftTargetContext(context = {}, snapshot = {}) {
    const normalizedUrl = normalizeTweetUrl(context.url);
    const tweetId = String(context.tweetId || "").trim();
    const location = snapshot.location || {};
    const textPreview = String(location.textPreview || context.post?.text || "").replace(/\s+/g, " ").trim().slice(0, 80);
    const lead = buildDraftLeadText(context.post?.text || location.textPreview || "", 72);
    const score = Number(context.scoring?.score || context.scoring?.finalScore || 0);
    const ageMinutes = Number(context.post?.ageMinutes || 0);
    const mediaKind = String(location.mediaKind || context.post?.mediaKind || "").trim();
    const handle = String(location.handle || context.author?.handle || "").replace(/^@/, "").trim();
    const needsDetailContext = Boolean(context.contextCompleteness?.needsDetailContext);
    const mediaContextMissing = Boolean(context.contextCompleteness?.mediaContextMissing);
    const mediaSummaryAvailable = Boolean(context.contextCompleteness?.mediaSummaryAvailable || context.media?.summary);
    const quickDraftAllowed = Boolean(context.contextCompleteness?.quickDraftAllowed);
    const draftContextLabel = String(context.contextCompleteness?.draftContextLabel || (needsDetailContext ? "quick-preview-draft" : "detail-ready-draft")).trim();
    return {
      version: "replydrop-draft-target-v1",
      mode: "human-draft",
      snapshotId: String(snapshot.snapshotId || "").trim(),
      capturedAt: Number(snapshot.capturedAt || 0),
      snapshotIndex: Number.isFinite(Number(snapshot.snapshotIndex)) ? Number(snapshot.snapshotIndex) : null,
      rank: Number.isFinite(Number(snapshot.rank)) ? Number(snapshot.rank) : null,
      domIndex: Number.isFinite(Number(location.domIndex)) ? Number(location.domIndex) : null,
      viewportPosition: Number.isFinite(Number(location.viewportPosition)) ? Number(location.viewportPosition) : null,
      visibleOnPage: Boolean(location.visibleOnPage),
      handle,
      targetTweetId: tweetId,
      targetUrl: normalizedUrl,
      score,
      ageMinutes,
      lead,
      textPreview,
      mediaKind,
      needsDetailContext,
      mediaContextMissing,
      quickDraftAllowed,
      mediaSummaryAvailable,
      draftContextLabel,
      sameHandlePostCount: Math.max(1, Math.floor(Number(snapshot.sameHandlePostCount) || 1)),
      selectionHint: Number(snapshot.sameHandlePostCount || 0) > 1
        ? "同账号多帖并存，人工点击前先核对 tweetId 和 lead。"
        : "按 tweetId 或 lead 对准当前帖即可。",
      laneKey: String(snapshot.laneKey || "").trim(),
      laneLabel: getReplyDropDraftLaneLabel(String(snapshot.laneKey || "").trim()),
      tweetId,
      url: normalizedUrl,
      author: context.author || {},
      post: context.post || {},
      scoring: context.scoring || {},
      routing: context.routing || {},
      memory: context.memory || {},
      media: context.media || {},
      lifecycle: context.lifecycle || {},
      contextCompleteness: context.contextCompleteness || {},
      aiHints: {
        ...(context.aiHints || {}),
        writingInstruction: "请根据 post.text / media.summary / media.summary.ocrText / scoring / routing / memory / aiHints.draftAngleHints 生成正式回复草稿；同语种回复；不要固定模板；不要自动刷新；不要自动排队或发送。laneKey=ready_now 才可直接写正式草稿；needs_media_summary 先调用 getMediaBundle 做 OCR/vision 并 setMediaSummary 后重读；needs_detail_context 先打开详情或展开上下文；do_not_reply 只给跳过原因。若 mediaNotInspectedTextSufficient=true，可以基于文字写，但必须避免断言图片/视频细节。"
      }
    };
  }

  async function getReplyDropApiDraftTargets(options = {}) {
    const runtimeState = await getApiRuntimeStateSnapshot();
    const limit = Math.max(1, Math.min(12, Math.floor(Number(options?.limit) || 6)));
    const minScore = Math.max(0, Math.min(100, Math.floor(Number(options?.minScore) || getConfiguredExecutorSendFloor(state.settings))));
    const includeMedia = options?.includeMedia !== false;
    const generatedAt = Date.now();
    const capturedAt = Number(runtimeState?.updatedAt || runtimeState?.lastScanAt || runtimeState?.pageCandidateSync?.updatedAt || generatedAt);
    const snapshotSeed = [
      String(capturedAt || generatedAt),
      String(runtimeState?.recentCandidates?.length || 0),
      String(runtimeState?.pageCandidateSync?.visibleCount || 0),
      String(runtimeState?.pageCandidateSync?.scannedCount || 0)
    ].join("-");
    const snapshotId = `replydrop-snapshot-${snapshotSeed}`;
    const sortedCandidates = sortApiAgentCandidates(runtimeState?.recentCandidates || []);
    const attributionModel = buildApiAttributionModel(runtimeState);
    const domLocations = buildDraftTargetDomLocationMap();
    const contexts = [];
    const contextByTweetId = new Map();
    const contextByUrl = new Map();

    for (const candidate of sortedCandidates.slice(0, Math.max(limit * 5, 24))) {
      const context = await buildReplyDropCandidateContext(candidate, runtimeState, {
        source: "candidate",
        includeMedia,
        attributionModel,
        generatedAt
      });
      contexts.push(context);
      if (context?.tweetId) {
        contextByTweetId.set(String(context.tweetId), context);
      }
      if (context?.url) {
        contextByUrl.set(normalizeTweetUrl(context.url), context);
      }
    }

    const visibleFallbackCandidates = collectVisibleDraftTargetFallbackCandidates(runtimeState, attributionModel);
    for (const candidate of visibleFallbackCandidates) {
      const fallbackUrl = normalizeTweetUrl(candidate?.url);
      const fallbackTweetId = extractTweetIdFromUrl(fallbackUrl);
      if (!fallbackUrl || !fallbackTweetId || contextByTweetId.has(fallbackTweetId) || contextByUrl.has(fallbackUrl)) {
        continue;
      }
      const context = await buildReplyDropCandidateContext(candidate, runtimeState, {
        source: "candidate",
        includeMedia,
        attributionModel,
        generatedAt
      });
      contexts.push(context);
      contextByTweetId.set(String(context.tweetId), context);
      contextByUrl.set(normalizeTweetUrl(context.url), context);
    }

    const sameHandleCounts = contexts.reduce((map, context) => {
      const key = normalizeHandle(context?.author?.handle || "");
      if (key) {
        map.set(key, Number(map.get(key) || 0) + 1);
      }
      return map;
    }, new Map());

    const decorate = (context, index, laneKey) => summarizeDraftTargetContext(context, {
        snapshotId,
        capturedAt,
        snapshotIndex: index + 1,
        rank: index + 1,
        laneKey,
        sameHandlePostCount: sameHandleCounts.get(normalizeHandle(context?.author?.handle || "")) || 1,
        location: domLocations.byUrl.get(normalizeTweetUrl(context.url)) ||
          domLocations.byTweetId.get(String(context.tweetId || "").trim()) ||
          {
            visibleOnPage: false,
            domIndex: null
          }
      });

    const lanes = {
      ready_now: [],
      needs_media_summary: [],
      needs_detail_context: [],
      watch_later: [],
      do_not_reply: []
    };

    contexts.forEach((context) => {
      const laneKey = getReplyDropDraftLaneKey(context, minScore);
      const safeLaneKey = Object.prototype.hasOwnProperty.call(lanes, laneKey) ? laneKey : "do_not_reply";
      if (lanes[safeLaneKey].length >= limit) {
        return;
      }
      lanes[safeLaneKey].push(decorate(context, lanes[safeLaneKey].length, safeLaneKey));
    });

    const candidates = buildHumanDraftPrimaryCandidates(lanes, limit);
    const visibleScoredPosts = Array.from(domLocations.byTweetId.entries())
      .map(([tweetId, location]) => {
        const context = contextByTweetId.get(tweetId) || contextByUrl.get(normalizeTweetUrl(readTweetUrl(getTweetNodes()[Number(location.domIndex || 1) - 1])));
        const score = Number(context?.scoring?.score || context?.scoring?.finalScore || 0);
        return {
          version: "replydrop-visible-scored-post-v1",
          snapshotId,
          capturedAt,
          tweetId,
          url: normalizeTweetUrl(context?.url || ""),
          handle: String(location.handle || context?.author?.handle || "").replace(/^@/, "").trim(),
          score,
          laneKey: context ? getReplyDropDraftLaneKey(context, minScore) : "do_not_reply",
          laneLabel: getReplyDropDraftLaneLabel(context ? getReplyDropDraftLaneKey(context, minScore) : "do_not_reply"),
          domIndex: Number.isFinite(Number(location.domIndex)) ? Number(location.domIndex) : null,
          viewportPosition: Number.isFinite(Number(location.viewportPosition)) ? Number(location.viewportPosition) : null,
          visibleOnPage: Boolean(location.visibleOnPage),
          textPreview: String(location.textPreview || context?.post?.text || "").replace(/\s+/g, " ").trim().slice(0, 120),
          mediaKind: String(location.mediaKind || context?.post?.mediaKind || "").trim(),
          inDraftTargets: Boolean(context && candidates.some((candidate) => candidate.tweetId === tweetId))
        };
      })
      .filter((item) => item.score > 0 || item.textPreview || item.handle)
      .sort((left, right) => (
        Number(left.domIndex || 9999) - Number(right.domIndex || 9999)
      ));
    const filteredCandidates = contexts
      .filter((context) => !isReplyDropDraftTarget(context, minScore))
      .map((context) => summarizeFilteredExecutorCandidate(context));

    return {
      version: "replydrop-draft-targets-v2",
      generatedAt,
      capturedAt,
      snapshotId,
      mode: "human-draft",
      workflow: "external-ai-chat-drafts",
      collaborationPolicy: {
        oneSnapshotOnly: true,
        noAutoRefresh: true,
        outputDestination: "current-chat",
        instruction: "基于本 snapshot 立刻在当前聊天窗口批量输出。优先写主 candidates；若 lanes.ready_now 为空，主 candidates 会自动补入高分 watch_later 和可基于首页文字直接成稿的 needs_detail_context，避免人工模式空手而归。lanes.needs_media_summary 先 getMediaBundle + OCR/vision + setMediaSummary 再重读；lanes.do_not_reply 只给跳过原因。不要自动刷新、queue、openComposer、submitReply。"
      },
      pageOrder: {
        domArticleCount: domLocations.count,
        rankMeaning: "rank 是本 getDraftTargets() 推荐列表排序，不是水滴徽标编号。",
        domIndexMeaning: "domIndex 是当前 DOM 中可见推文卡片的 1-based 顺序；不可见时为 null。"
      },
      limit,
      minScore,
      candidates,
      lanes,
      legacyLanes: {
        replyNow: lanes.ready_now,
        needsDetail: [...lanes.needs_media_summary, ...lanes.needs_detail_context],
        notRecommended: lanes.do_not_reply,
        watchLater: lanes.watch_later
      },
      primaryCandidateSource: candidates.every((item) => item?.laneKey === "ready_now") ? "ready_now" : "human_fallback",
      visibleScoredPosts,
      filteredCandidates,
      skipReasons: summarizeExecutorSkipReasons(filteredCandidates),
      pageCandidateSync: runtimeState?.pageCandidateSync || null,
      outputSchema: buildReplyDropDraftTargetSchema()
    };
  }

  async function getReplyDropApiDraftContext(tweetId, options = {}) {
    const context = await getReplyDropApiCandidateContext(tweetId, options);
    const capturedAt = Date.now();
    return summarizeDraftTargetContext(context, {
      snapshotId: `replydrop-context-${String(tweetId || context?.tweetId || "unknown").trim()}-${capturedAt}`,
      capturedAt,
      snapshotIndex: 1
    });
  }

  async function setReplyDropApiDraftPreview(payload = {}) {
    const normalizedPayload = payload && typeof payload === "object" ? payload : {};
    let runtimeState = null;
    try {
      runtimeState = await getApiRuntimeStateSnapshot();
    } catch {
      runtimeState = null;
    }
    const tweetId = getApiTargetTweetIdFromPayload(normalizedPayload);
    const targetUrl = resolveApiTargetUrlFromPayload(normalizedPayload, runtimeState);
    const normalizedUrl = normalizeTweetUrl(targetUrl);
    const replyText = String(
      normalizedPayload.replyText ||
      normalizedPayload.previewText ||
      normalizedPayload.draft ||
      ""
    ).trim().slice(0, 560);
    if (!normalizedUrl || !replyText) {
      return {
        ok: false,
        reason: normalizedUrl ? "missing-reply-text" : "missing-target"
      };
    }

    const preview = {
      url: normalizedUrl,
      tweetId: tweetId || extractTweetIdFromUrl(normalizedUrl),
      replyText,
      confidence: Number(normalizedPayload.confidence || 0),
      riskFlags: Array.isArray(normalizedPayload.riskFlags)
        ? normalizedPayload.riskFlags.slice(0, 6).map((flag) => String(flag || "").trim()).filter(Boolean)
        : [],
      updatedAt: Date.now()
    };
    state.draftPreviewsByUrl[normalizedUrl] = preview;
    state.draftPreviewsByUrl = pruneDraftPreviews(state.draftPreviewsByUrl);
    const article = findReplyArticle(normalizedUrl) || findTweetArticleByTweetId(preview.tweetId, normalizedUrl);
    const rendered = article instanceof HTMLElement ? renderDraftPreview(article, preview) : false;
    return {
      ok: true,
      rendered,
      preview
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
      ok: true,
      tweetId: normalizedTweetId,
      status: "shipped",
      url,
      replyText: finalReplyText
    };
  }

  async function unmarkReplyDropTweet(tweetIdOrUrl) {
    const rawValue = String(tweetIdOrUrl || "").trim();
    if (!rawValue) {
      throw new Error("tweet-or-url-required");
    }

    const runtimeState = await getApiRuntimeStateSnapshot();
    const normalizedUrl = rawValue.includes("/")
      ? normalizeTweetUrl(rawValue)
      : resolveUrlByTweetIdFromState(runtimeState, normalizeApiTweetId(rawValue));
    if (!normalizedUrl) {
      throw new Error("tweet-not-found");
    }

    await clearRecordedReply(normalizedUrl);
    return {
      ok: true,
      status: "cleared",
      url: normalizedUrl
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
      case "timeline-reply":
      case "reply-from-timeline":
      case "timeline-open-composer":
        return "reply-from-timeline";
      case "refresh":
      case "refresh-recommendations":
      case "rescan":
      case "rescan-recommendations":
        return "refresh-recommendations";
      case "submit":
      case "submit-reply":
      case "post-reply":
        return "submit-reply";
      case "reply-auto":
      case "reply-best-path":
      case "reply-now":
        return "reply-auto";
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
    let action = normalizeReplyDropExecutorAction(normalizedPayload.action || normalizedPayload.type);
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
    if (action === "reply-auto") {
      if (!runtimeState) {
        try {
          runtimeState = await getApiRuntimeStateSnapshot();
        } catch {
          runtimeState = null;
        }
      }
      const candidateRecord = (
        getCandidateByTweetIdFromState(runtimeState, tweetId) ||
        getQueueItemByTweetIdFromState(runtimeState, tweetId) ||
        getCandidateByUrlFromState(runtimeState, resolvedTargetUrl) ||
        getQueueItemByUrlFromState(runtimeState, resolvedTargetUrl)
      );
      if (!resolvedTargetUrl) {
        resolvedTargetUrl = normalizeTweetUrl(candidateRecord?.url || "");
      }
      action = candidateRecord?.timelineInlineReplyEligible ? "reply-from-timeline" : "reply";
    }
    if (["open-composer", "reply-from-timeline", "submit-reply", "reply"].includes(action)) {
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
      case "reply-from-timeline": {
        const openResult = await openReplyDropComposer({
          ...normalizedPayload,
          timelineFirst: true
        });
        if (!openResult?.ok && shouldFallbackReplyDropTimelineToDetail(openResult, resolvedTargetUrl)) {
          const detailOpenResult = await openReplyDropComposer({
            ...normalizedPayload,
            url: resolvedTargetUrl,
            timelineFirst: false,
            preferDetailPage: true
          });
          if (!String(normalizedPayload.draft || "").trim() || !detailOpenResult?.ok) {
            return detailOpenResult;
          }
          const detailSubmitOptions = normalizedPayload.submitOptions && typeof normalizedPayload.submitOptions === "object"
            ? normalizedPayload.submitOptions
            : (normalizedPayload.options && typeof normalizedPayload.options === "object" ? normalizedPayload.options : {});
          const detailSubmitResult = await submitReplyDropComposer(detailSubmitOptions);
          if (detailSubmitResult?.ok) {
            clearReplyTargetAttempt(detailSubmitResult?.targetUrl || detailOpenResult?.targetUrl || resolvedTargetUrl);
          }
          return {
            ok: Boolean(detailSubmitResult?.ok),
            action: "reply",
            stage: detailSubmitResult?.ok ? "done" : "submit-reply",
            open: detailOpenResult,
            submit: detailSubmitResult,
            targetUrl: String(detailSubmitResult?.targetUrl || detailSubmitResult?.href || detailOpenResult?.targetUrl || detailOpenResult?.href || "").trim(),
            fallbackFrom: "reply-from-timeline"
          };
        }
        if (!String(normalizedPayload.draft || "").trim() || !openResult?.ok) {
          return openResult;
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
          action: "reply-from-timeline",
          stage: submitResult?.ok ? "done" : "submit-reply",
          open: openResult,
          submit: submitResult,
          targetUrl: String(submitResult?.targetUrl || submitResult?.href || openResult?.targetUrl || openResult?.href || "").trim()
        };
      }
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
      const verificationEvidence = findReplyVerificationEvidence(targetUrl);
      if (verificationEvidence) {
        return buildReplyActionFailure({
          targetUrl,
          reason: "already-replied",
          reasonCode: "already-replied"
        });
      }
      await clearRecordedReply(targetUrl);
    }

    const preparedComposer = getPreparedReplyComposer(targetUrl);
    const settledComposer = preparedComposer
      ? {
          ok: true,
          editor: preparedComposer.editor,
          context: preparedComposer.context,
          sendButton: preparedComposer.sendButton,
          prepared: true
        }
      : await waitForReplyComposer(targetUrl, {
          timeoutMs: EXECUTOR_SETTLE_TIMEOUT_MS,
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

    const readySubmit = preparedComposer
      ? {
          ok: true,
          editor: preparedComposer.editor,
          sendButton: preparedComposer.sendButton,
          context: preparedComposer.context,
          editorText: readReplyComposerText(preparedComposer.editor),
          editorFound: true,
          sendButtonFound: true,
          buttonDisabled: false,
          draftReady: true,
          composerLocked: true,
          pageLocked: Boolean(preparedComposer.context?.pageLocked),
          prepared: true
        }
      : await waitForReplySubmitReady(targetUrl, readReplyComposerText(settledComposer.editor), {
          timeoutMs: EXECUTOR_DETAIL_READY_TIMEOUT_MS,
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
    const currentDraftText = readReplyComposerText(readySubmit?.editor || settledComposer?.editor);
    const draftValidation = validateReplyDraftAgainstTarget(targetUrl, currentDraftText);
    if (!draftValidation.ok) {
      await settleFailedTimelineUi();
      return buildReplyActionFailure({
        targetUrl,
        currentUrl: normalizeTweetUrl(global.location.href),
        articleUrl: normalizeTweetUrl(resolveReplyTargetUrl() || ""),
        reason: draftValidation.reasonCode,
        reasonCode: draftValidation.reasonCode,
        draftValidation
      });
    }
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
    clearPreparedReplyComposer(targetUrl);

    try {
      triggerReplyActionClick(sendButton);
      const outcome = await waitForApiReplyOutcome(targetUrl, EXECUTOR_POST_SEND_VERIFY_TIMEOUT_MS, options || {});
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
      case "health":
        return getReplyDropApiHealth();
      case "getCandidates":
        return getReplyDropApiCandidates();
      case "getQueue":
        return getReplyDropApiQueue();
      case "getMediaBundle":
        return getReplyDropApiMediaBundle(args[0]);
      case "setMediaSummary":
        return setReplyDropApiMediaSummary(args[0] || {});
      case "getTrafficSnapshot":
        return getReplyDropApiTrafficSnapshot(args[0]);
      case "getDraftTargets":
        return getReplyDropApiDraftTargets(args[0] || {});
      case "getDraftContext":
        return getReplyDropApiDraftContext(args[0], args[1] || {});
      case "setDraftPreview":
        return setReplyDropApiDraftPreview(args[0] || {});
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
      case "unmarkReplied":
        return unmarkReplyDropTweet(args[0]);
      case "skipCandidate":
        return skipReplyDropCandidate(args[0]);
      case "openComposer":
        return openReplyDropComposer(args[0] || {});
      case "replyFromTimeline":
        return openReplyDropComposer({
          ...(args[0] || {}),
          timelineFirst: true
        });
      case "submitReply":
        return submitReplyDropComposer(args[0] || {});
      case "runExecutorAction":
        return runReplyDropExecutorAction(args[0] || {});
      case "toggleFloatingPanel":
        return toggleFloatingPanel(args[0]);
      case "closeActiveReplySurface":
        return closeActiveReplySurface(args[0] || {});
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

  function uniqueList(value) {
    return Array.from(
      new Set(
        (Array.isArray(value) ? value : [])
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      )
    );
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
        --badge-shell: #9dcbff;
        --badge-core: #f7fbff;
        --badge-rim: rgba(191, 219, 254, 0.96);
        --badge-aura: rgba(96, 165, 250, 0.22);
        --badge-text: #0f172a;
        --badge-core-opacity: 0.96;
        --badge-rim-width: 1.08px;
        --badge-rim-opacity: 0.96;
        --badge-rim-dash: 0;
        --badge-aura-opacity: 0.66;
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
          drop-shadow(0 6px 12px rgba(15, 23, 42, 0.24))
          drop-shadow(0 0 10px rgba(148, 163, 184, 0.16));
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
        font: 800 10px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: -0.03em;
        text-shadow:
          0 1px 0 rgba(255, 255, 255, 0.82),
          0 0 4px rgba(255, 255, 255, 0.68),
          0 1px 2px rgba(15, 23, 42, 0.18);
        font-variant-numeric: tabular-nums;
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
        --badge-shell: rgba(220, 252, 231, 0.92);
        --badge-core: rgba(255, 255, 255, 0.82);
        --badge-text: #14532d;
        --badge-rim: rgba(34, 197, 94, 0.72);
        --badge-rim-width: 1.35px;
        --badge-rim-dash: 2.2 1.6;
        --badge-aura: rgba(34, 197, 94, 0.14);
        --badge-aura-opacity: 0.34;
        --badge-core-opacity: 0.74;
        --badge-highlight-main-opacity: 0.24;
        --badge-highlight-tip-opacity: 0.32;
      }
      .${BADGE_CLASS}[data-tier="good-outline"] {
        --badge-shell: rgba(254, 243, 199, 0.94);
        --badge-core: rgba(255, 255, 255, 0.84);
        --badge-text: #713f12;
        --badge-rim: rgba(234, 179, 8, 0.72);
        --badge-rim-width: 1.35px;
        --badge-rim-dash: 2.2 1.6;
        --badge-aura: rgba(250, 204, 21, 0.14);
        --badge-aura-opacity: 0.34;
        --badge-core-opacity: 0.74;
        --badge-highlight-main-opacity: 0.24;
        --badge-highlight-tip-opacity: 0.32;
      }
      .${BADGE_CLASS}[data-tier="medium-outline"] {
        --badge-shell: rgba(241, 245, 249, 0.96);
        --badge-core: rgba(255, 255, 255, 0.88);
        --badge-text: #334155;
        --badge-rim: rgba(148, 163, 184, 0.74);
        --badge-rim-width: 1.35px;
        --badge-rim-dash: 2.2 1.6;
        --badge-aura: rgba(148, 163, 184, 0.12);
        --badge-aura-opacity: 0.28;
        --badge-core-opacity: 0.76;
        --badge-highlight-main-opacity: 0.22;
        --badge-highlight-tip-opacity: 0.26;
      }
      .${BADGE_CLASS}[data-tier="low-outline"] {
        --badge-shell: rgba(219, 234, 254, 0.96);
        --badge-core: rgba(255, 255, 255, 0.88);
        --badge-text: #1d4ed8;
        --badge-rim: rgba(96, 165, 250, 0.78);
        --badge-rim-width: 1.1px;
        --badge-rim-dash: 1.8 1.8;
        --badge-aura: rgba(96, 165, 250, 0.12);
        --badge-aura-opacity: 0.3;
        --badge-core-opacity: 0.78;
        --badge-highlight-main-opacity: 0.2;
        --badge-highlight-tip-opacity: 0.24;
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
      .${DRAFT_PREVIEW_CLASS} {
        margin: 10px 16px 8px 56px;
        padding: 10px 12px 11px;
        border: 1px solid rgba(14, 165, 233, 0.26);
        border-radius: 16px;
        background:
          linear-gradient(135deg, rgba(240, 253, 250, 0.96), rgba(239, 246, 255, 0.94));
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        color: #0f172a;
        font: 500 13px/1.48 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .${DRAFT_PREVIEW_CLASS} strong {
        display: block;
        margin-bottom: 4px;
        color: #0369a1;
        font-size: 12px;
        letter-spacing: 0.02em;
      }
      .${DRAFT_PREVIEW_CLASS} p {
        margin: 0;
        white-space: pre-wrap;
      }
      .${DRAFT_PREVIEW_CLASS}[data-risk="1"] {
        border-color: rgba(245, 158, 11, 0.34);
        background: linear-gradient(135deg, rgba(255, 251, 235, 0.96), rgba(255, 247, 237, 0.94));
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
        width: min(456px, calc(100vw - 28px));
        height: min(700px, calc(100vh - 104px));
        display: none;
        z-index: 2147483646;
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(148, 163, 184, 0.2);
        box-shadow:
          0 28px 72px rgba(15, 23, 42, 0.24),
          0 10px 24px rgba(14, 116, 144, 0.12);
        background:
          linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(236, 245, 255, 0.98));
        backdrop-filter: blur(18px) saturate(130%);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
          opacity 220ms ease,
          transform 220ms ease,
          visibility 0s linear 360ms;
        transform: translateY(-6px);
      }
      #${FLOAT_PANEL_ID}[data-open="1"] {
        display: block;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0);
        transition:
          opacity 220ms ease,
          transform 220ms ease;
      }
      #${FLOAT_PANEL_ID} .xrs-floating-fallback {
        position: absolute;
        inset: 0;
        z-index: 2;
        padding: 16px;
        overflow: auto;
        box-sizing: border-box;
        color: #0f172a;
        font: 500 13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .xrs-floating-fallback-focusAnchor {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        padding: 0;
        border: 0;
        opacity: 0.001;
        pointer-events: none;
      }
      .xrs-floating-fallback-card {
        box-sizing: border-box;
        min-height: 100%;
        border-radius: 20px;
        padding: 16px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 250, 255, 0.98));
        border: 1px solid rgba(191, 219, 254, 0.74);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          0 16px 36px rgba(148, 163, 184, 0.18);
        color: #0f172a;
      }
      .xrs-floating-fallback-card,
      .xrs-floating-fallback-card * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .xrs-floating-fallback-header,
      .xrs-floating-fallback-actions,
      .xrs-floating-fallback-item-top,
      .xrs-floating-fallback-itemMeta {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .xrs-floating-fallback-header {
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .xrs-floating-fallback-brand strong {
        display: block;
        font-size: 17px;
        line-height: 1.2;
      }
      .xrs-floating-fallback-brand span {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: #475569;
      }
      .xrs-floating-fallback-actions {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .xrs-floating-fallback-kbd,
      .xrs-floating-fallback-chip,
      .xrs-floating-fallback-header button,
      .xrs-floating-fallback-itemMode,
      .xrs-floating-fallback-itemAction {
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.86);
        color: #0f172a;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }
      .xrs-floating-fallback-kbd,
      .xrs-floating-fallback-chip {
        padding: 7px 10px;
      }
      .xrs-floating-fallback-header button,
      .xrs-floating-fallback-itemAction {
        cursor: pointer;
      }
      .xrs-floating-fallback-header button {
        padding: 8px 12px;
        background: linear-gradient(180deg, rgba(239, 246, 255, 0.96), rgba(219, 234, 254, 0.94));
        color: #1d4ed8;
      }
      .xrs-floating-fallback-kbd {
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.94));
        border-color: rgba(51, 65, 85, 0.8);
        color: #e2e8f0;
        font-weight: 800;
      }
      .xrs-floating-fallback-statGrid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 12px;
      }
      .xrs-floating-fallback-stat {
        padding: 12px 12px 11px;
        border-radius: 14px;
        border: 1px solid rgba(191, 219, 254, 0.78);
        background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(239, 246, 255, 0.96));
      }
      .xrs-floating-fallback-stat span {
        display: block;
        font-size: 11px;
        color: #64748b;
      }
      .xrs-floating-fallback-stat strong {
        display: block;
        margin-top: 4px;
        font-size: 18px;
        line-height: 1;
        color: #0f172a;
      }
      .xrs-floating-fallback-tip {
        margin-bottom: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(239, 246, 255, 0.78);
        color: #475569;
        font-size: 12px;
      }
      .xrs-floating-fallback-list {
        display: grid;
        gap: 10px;
      }
      .xrs-floating-fallback-item {
        border-radius: 16px;
        border: 1px solid rgba(191, 219, 254, 0.62);
        background: rgba(255, 255, 255, 0.84);
        box-shadow: 0 12px 24px rgba(148, 163, 184, 0.12);
        overflow: hidden;
      }
      .xrs-floating-fallback-item.is-active {
        border-color: rgba(37, 99, 235, 0.72);
        box-shadow:
          0 0 0 1px rgba(37, 99, 235, 0.22),
          0 16px 28px rgba(37, 99, 235, 0.12);
        transform: translateY(-1px);
      }
      .xrs-floating-fallback-itemButton {
        width: 100%;
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr);
        gap: 12px;
        padding: 13px;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;
      }
      .xrs-floating-fallback-itemRank {
        width: 34px;
        height: 34px;
        border-radius: 11px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(180deg, rgba(219, 234, 254, 0.96), rgba(191, 219, 254, 0.94));
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 800;
      }
      .xrs-floating-fallback-main {
        min-width: 0;
      }
      .xrs-floating-fallback-item-top {
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .xrs-floating-fallback-item-top strong {
        min-width: 0;
        font-size: 13px;
        color: #0f172a;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .xrs-floating-fallback-itemMode {
        padding: 4px 8px;
        font-size: 11px;
      }
      .xrs-floating-fallback-itemMode[data-tone="inline"] {
        background: rgba(220, 252, 231, 0.92);
        border-color: rgba(34, 197, 94, 0.24);
        color: #166534;
      }
      .xrs-floating-fallback-itemMode[data-tone="detail"] {
        background: rgba(254, 243, 199, 0.94);
        border-color: rgba(245, 158, 11, 0.24);
        color: #92400e;
      }
      .xrs-floating-fallback-score {
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(239, 246, 255, 0.98);
        border: 1px solid rgba(191, 219, 254, 0.84);
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 800;
      }
      .xrs-floating-fallback-item p,
      .xrs-floating-fallback-empty {
        margin: 0;
        font-size: 12px;
        line-height: 1.55;
        color: #475569;
      }
      .xrs-floating-fallback-itemMeta {
        flex-wrap: wrap;
        margin-top: 10px;
        gap: 8px;
      }
      .xrs-floating-fallback-empty {
        padding: 18px 14px;
        border-radius: 14px;
        background: rgba(239, 246, 255, 0.78);
      }
      .xrs-floating-fallback-itemAction {
        padding: 4px 8px;
        color: #334155;
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
      executorSendFloor: base.executorSendFloor ?? base.agentSendFloor ?? defaults.executorSendFloor ?? defaults.agentSendFloor ?? DEFAULT_EXECUTOR_SEND_FLOOR,
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
    state.replyDetails = pruneReplyDetails(base.replyDetails);
    state.replyArchive = pruneReplyArchive(
      Array.isArray(base.replyArchive) && base.replyArchive.length
        ? base.replyArchive
        : Object.entries(base.replyDetails && typeof base.replyDetails === "object" ? base.replyDetails : {})
            .map(([url, detail]) => ({ targetUrl: url, ...(detail && typeof detail === "object" ? detail : {}) }))
    );
    state.replyQueue = Array.isArray(base.replyQueue) ? base.replyQueue.slice() : [];
    state.recentCandidates = pruneRecentCandidates(base.recentCandidates, EXECUTOR_SCAN_WINDOW_SIZE);
    state.relationshipStates = base.relationshipStates && typeof base.relationshipStates === "object" ? { ...base.relationshipStates } : {};
    state.mediaSummaries = pruneMediaSummaries(base.mediaSummaries);
    state.draftPreviewsByUrl = pruneDraftPreviews(state.draftPreviewsByUrl);
    const derivedHighScoreCount = getFloatingPanelHighScoreCount(state.recentCandidates);
    state.stats = {
      scannedCount: Number(base.scannedCount) || 0,
      highScoreCount: derivedHighScoreCount,
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
    const elapsedMs = Math.max(0, Date.now() - Number(state.lastScanCompletedAt || 0));
    const minIntervalDelay = elapsedMs > 0 && elapsedMs < SCAN_MIN_INTERVAL_MS
      ? SCAN_MIN_INTERVAL_MS - elapsedMs
      : 0;
    state.scanTimer = global.setTimeout(scanTweets, Math.max(SCAN_DEBOUNCE_MS, minIntervalDelay));
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
      scheduleScan();
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

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#39;";
        default: return char;
      }
    });
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

  function detectScriptFamily(text = "") {
    const source = String(text || "");
    if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(source)) {
      return "ja";
    }
    if (/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/i.test(source)) {
      return "ko";
    }
    const counts = {
      zh: (source.match(/[\u4e00-\u9fff]/g) || []).length,
      ja: (source.match(/[\u3040-\u30ff]/g) || []).length,
      ko: (source.match(/[\uac00-\ud7af]/g) || []).length,
      en: (source.match(/[A-Za-z]/g) || []).length
    };
    const winner = Object.entries(counts).sort((left, right) => Number(right[1] || 0) - Number(left[1] || 0))[0];
    return winner && winner[1] >= 4 ? winner[0] : "";
  }

  function hasKoreanLanguageSignal(langs = []) {
    return (Array.isArray(langs) ? langs : []).some((lang) => {
      const normalized = String(lang || "").trim().toLowerCase();
      return normalized === "langko" || normalized === "ko" || normalized.startsWith("ko-");
    });
  }

  function hasJapaneseLanguageSignal(langs = []) {
    return (Array.isArray(langs) ? langs : []).some((lang) => {
      const normalized = String(lang || "").trim().toLowerCase();
      return normalized === "langja" || normalized === "ja" || normalized.startsWith("ja-");
    });
  }

  function hasEnglishLanguageSignal(langs = []) {
    return (Array.isArray(langs) ? langs : []).some((lang) => {
      const normalized = String(lang || "").trim().toLowerCase();
      return normalized === "langen" || normalized === "en" || normalized.startsWith("en-");
    });
  }

  function extractMeaningfulTokens(text = "") {
    const source = normalizeSemanticText(text).toLowerCase();
    if (!source) {
      return [];
    }

    const stopwords = new Set([
      "this", "that", "with", "from", "have", "your", "just", "they", "them", "will", "what", "when", "where",
      "really", "because", "people", "usually", "immediately", "simple", "usable", "practical", "works", "work",
      "angle", "point", "posts", "post", "good", "great", "nice", "very", "more", "than", "then", "only",
      "这个", "角度", "挺好", "不是", "只是", "观点", "大家", "最容易", "忽略", "那层", "点", "出来", "这样", "真的",
      "오늘", "정말", "이런", "그냥", "진짜", "좋네요", "느낌", "視点", "ちゃんと", "投稿", "反応"
    ]);

    return Array.from(new Set(
      source
        .split(/[\s,.;:!?/\\|()[\]{}"'`~<>，。！？、：；“”‘’]+/)
        .map((item) => item.trim())
        .filter((item) => item.length >= 2 && !stopwords.has(item))
    ));
  }

  function isBlockedGenericReplyTemplate(text = "") {
    const normalized = normalizeSemanticText(text).toLowerCase();
    if (!normalized) {
      return {
        blocked: false,
        styleHits: [],
        recentTemplateCollision: false
      };
    }
    const styleHits = typeof global.ReplyDropDraftCore?.detectStylePatternHits === "function"
      ? global.ReplyDropDraftCore.detectStylePatternHits(normalized)
      : [];
    const hardcodedHits = [
      /that works because it is practical/i,
      /that hits because it is simple and usable/i,
      /this works because it is practical/i,
      /这个角度挺好，不只是抛观点/i,
      /这个角度挺好，不只是抛观點/i
    ].some((pattern) => pattern.test(normalized));
    return {
      blocked: styleHits.length > 0 || hardcodedHits,
      styleHits,
      recentTemplateCollision: false
    };
  }

  function hasRecentReplyTemplateCollision(text = "") {
    const normalized = normalizeSemanticText(text).toLowerCase();
    if (!normalized) {
      return false;
    }

    const replyDetails = state.replyDetails && typeof state.replyDetails === "object"
      ? Object.values(state.replyDetails)
      : [];
    const exactMatches = replyDetails.filter((detail) => normalizeSemanticText(detail?.replyText || detail?.text || "").toLowerCase() === normalized);
    return exactMatches.length >= 1;
  }

  function inferReplyTargetLanguage(article, replyMeta = null) {
    const signalList = [
      ...(Array.isArray(replyMeta?.matchedLanguages) ? replyMeta.matchedLanguages : []),
      ...(article instanceof Element ? readLanguageTags(article) : [])
    ];
    if (hasKoreanLanguageSignal(signalList)) {
      return "ko";
    }
    if (hasJapaneseLanguageSignal(signalList)) {
      return "ja";
    }
    if (hasChineseLanguageSignal(signalList)) {
      return "zh";
    }
    if (hasEnglishLanguageSignal(signalList)) {
      return "en";
    }

    const semanticText = article instanceof Element
      ? normalizeSemanticText(readText(article))
      : normalizeSemanticText(replyMeta?.text || "");
    if (isKoreanText(semanticText)) {
      return "ko";
    }
    if (isJapaneseText(semanticText)) {
      return "ja";
    }
    if (isChineseText(semanticText)) {
      return "zh";
    }
    if (/[A-Za-z]/.test(semanticText)) {
      return "en";
    }
    return "";
  }

  function validateReplyDraftAgainstTarget(targetUrl = "", draftText = "") {
    const normalizedDraft = normalizeSemanticText(draftText);
    if (!normalizedDraft) {
      return {
        ok: false,
        reasonCode: "draft-topic-mismatch",
        draftSample: normalizedDraft.slice(0, 180)
      };
    }

    const templateCheck = isBlockedGenericReplyTemplate(normalizedDraft);
    const recentTemplateCollision = hasRecentReplyTemplateCollision(normalizedDraft);
    if (templateCheck.blocked || recentTemplateCollision) {
      return {
        ok: false,
        reasonCode: "draft-template-blocked",
        styleHits: Array.isArray(templateCheck.styleHits) ? templateCheck.styleHits.slice(0, 8) : [],
        recentTemplateCollision,
        draftSample: normalizedDraft.slice(0, 180)
      };
    }

    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const targetTweetId = extractTweetIdFromUrl(normalizedTarget);
    const article = findTweetArticleByTweetId(targetTweetId, normalizedTarget);
    const replyMeta = state.pendingReplyMeta;
    const targetText = normalizeSemanticText(readText(article) || String(replyMeta?.text || ""));
    if (!targetText) {
      return { ok: true };
    }

    const draftScript = detectScriptFamily(normalizedDraft);
    const targetLanguage = inferReplyTargetLanguage(article, replyMeta);
    const targetScript = targetLanguage || detectScriptFamily(targetText);
    if (draftScript && targetScript && draftScript !== targetScript) {
      return {
        ok: false,
        reasonCode: "draft-language-mismatch",
        draftScript,
        targetScript,
        draftSample: normalizedDraft.slice(0, 180),
        targetSample: targetText.slice(0, 180)
      };
    }

    if (targetScript && targetScript !== "en") {
      return { ok: true, targetScript };
    }

    const draftTokens = extractMeaningfulTokens(normalizedDraft);
    const targetTokens = new Set(extractMeaningfulTokens(targetText));
    const sharedCount = draftTokens.filter((token) => targetTokens.has(token)).length;
    if (sharedCount <= 0 && draftTokens.length >= 5) {
      return {
        ok: false,
        reasonCode: "draft-topic-mismatch",
        draftSample: normalizedDraft.slice(0, 180),
        targetSample: targetText.slice(0, 180),
        draftTokens: draftTokens.slice(0, 8)
      };
    }

    return { ok: true };
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
      hasTrackedTweetUrl(state.repliedTweetUrls, tweet.url) ? "replied" : ""
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
      breakdown: Array.isArray(analysis.breakdown)
        ? analysis.breakdown.slice(0, 8).map((item) => ({
            key: String(item?.key || "").trim(),
            label: String(item?.label || "").trim(),
            amount: Number(item?.amount || 0),
            kind: String(item?.kind || "").trim()
          }))
        : [],
      highlights: Array.isArray(analysis.highlights) ? analysis.highlights.slice(0, 4) : [],
      keywordMatched: Boolean(analysis.keywordMatched),
      matchedTopics: Array.isArray(analysis.matchedTopics) ? analysis.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(analysis.matchedLanguages) ? analysis.matchedLanguages.slice(0, 4) : [],
      needsDetailContext: false,
      mediaContextMissing: false,
      quickDraftAllowed: false,
      mediaSummaryAvailable: false,
      timelineInlineReplyEligible: false,
      preferredOpenMode: "detail-page"
    };
  }

  function attachCandidateExecutionMeta(candidate = {}, article = null, mediaSummary = null) {
    const normalizedCandidate = candidate && typeof candidate === "object" ? { ...candidate } : {};
    const contextCompleteness = buildDraftContextCompleteness(normalizedCandidate, article, false, mediaSummary);
    const timelineInlineReplyEligible = canUseTimelineInlineReply(contextCompleteness, article);
    return {
      ...normalizedCandidate,
      needsDetailContext: Boolean(contextCompleteness.needsDetailContext),
      mediaContextMissing: Boolean(contextCompleteness.mediaContextMissing),
      quickDraftAllowed: Boolean(contextCompleteness.quickDraftAllowed),
      mediaSummaryAvailable: Boolean(contextCompleteness.mediaSummaryAvailable),
      timelineInlineReplyEligible,
      preferredOpenMode: timelineInlineReplyEligible ? "timeline-inline" : "detail-page"
    };
  }

  function buildReplyEntriesForAttribution() {
    const archiveEntries = pruneReplyArchive(state.replyArchive);
    if (archiveEntries.length) {
      return archiveEntries
        .map((entry) => ({
          url: normalizeTweetUrl(entry?.targetUrl || entry?.url),
          ...(entry && typeof entry === "object" ? entry : {})
        }))
        .filter((entry) => entry.url);
    }

    return Object.entries(state.replyDetails || {})
      .map(([url, detail]) => ({
        url: normalizeTweetUrl(url),
        ...(detail && typeof detail === "object" ? detail : {})
      }))
      .filter((entry) => entry.url);
  }

  function buildLowExposureMemory(replyEntries = []) {
    const sortedEntries = (Array.isArray(replyEntries) ? replyEntries : [])
      .filter((entry) => entry && typeof entry === "object")
      .slice()
      .sort((left, right) => (
        Math.max(Number(right?.replyCheckedAt || 0), Number(right?.timestamp || 0)) -
        Math.max(Number(left?.replyCheckedAt || 0), Number(left?.timestamp || 0))
      ));
    const authorBuckets = new Map();
    const topicBuckets = new Map();

    sortedEntries.forEach((entry) => {
      const replyCheckedAt = Number(entry?.replyCheckedAt || entry?.replyTrafficCapturedAt || 0);
      if (replyCheckedAt <= 0) {
        return;
      }

      const views = Math.max(0, Number(entry?.replyObservedViews || 0));
      const handleKey = normalizeHandle(entry?.authorHandle);
      if (handleKey) {
        const bucket = authorBuckets.get(handleKey) || [];
        bucket.push(views);
        authorBuckets.set(handleKey, bucket);
      }

      uniqueList(entry?.matchedTopics || []).forEach((topicKey) => {
        const normalizedTopic = String(topicKey || "").trim();
        if (!normalizedTopic) {
          return;
        }
        const bucket = topicBuckets.get(normalizedTopic) || [];
        bucket.push(views);
        topicBuckets.set(normalizedTopic, bucket);
      });
    });

    const countLeadingLowViewStreak = (values = []) => {
      let streak = 0;
      for (const value of values) {
        if (Number(value || 0) <= 2) {
          streak += 1;
          continue;
        }
        break;
      }
      return streak;
    };

    const authorStreaks = new Map();
    authorBuckets.forEach((values, key) => {
      authorStreaks.set(key, countLeadingLowViewStreak(values));
    });

    const topicStreaks = new Map();
    topicBuckets.forEach((values, key) => {
      topicStreaks.set(key, countLeadingLowViewStreak(values));
    });

    return {
      authorStreaks,
      topicStreaks
    };
  }

  function getLowExposurePenaltySignal(tweet, analysis, lowExposureMemory = null) {
    if (!tweet || !analysis || !lowExposureMemory) {
      return null;
    }

    const authorKey = normalizeHandle(tweet?.authorHandle);
    const authorStreak = authorKey ? Number(lowExposureMemory.authorStreaks?.get(authorKey) || 0) : 0;
    const topicStreak = uniqueList(analysis?.matchedTopics || [])
      .reduce((max, topicKey) => Math.max(max, Number(lowExposureMemory.topicStreaks?.get(String(topicKey || "").trim()) || 0)), 0);
    const streak = Math.max(authorStreak, topicStreak);
    if (streak < 2) {
      return null;
    }

    let amount = 6 + Math.min(6, (streak - 2) * 3);
    if (authorStreak >= 2 && topicStreak >= 2) {
      amount += 2;
    }
    if (Number(analysis?.reachLikelihood || 0) < 54) {
      amount += 1;
    }

    amount = Math.max(0, Math.min(14, Math.round(amount)));
    if (amount < 4) {
      return null;
    }

    return {
      amount,
      label: authorStreak >= topicStreak ? "Low-view handle streak" : "Low-view topic streak",
      highlight: "recent replies stalled"
    };
  }

  function buildOpportunityContext() {
    const relationshipStates = state.relationshipStates && typeof state.relationshipStates === "object"
      ? state.relationshipStates
      : {};
    const replyEntries = buildReplyEntriesForAttribution();

    let attributionModel = null;
    if (typeof global.ReplyDropAttributionCore?.buildAttributionSignalModel === "function") {
      attributionModel = global.ReplyDropAttributionCore.buildAttributionSignalModel(
        replyEntries,
        Array.isArray(state.replyQueue) ? state.replyQueue : [],
        [],
        { now: Date.now() }
      );
    }

    return {
      relationshipStates,
      attributionModel,
      lowExposureMemory: buildLowExposureMemory(replyEntries)
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

  function getAnalysisPenaltyAmount(analysis, penaltyKey) {
    if (!analysis || !Array.isArray(analysis.breakdown) || !penaltyKey) {
      return 0;
    }
    return analysis.breakdown.reduce((total, item) => {
      if (!item || String(item.key || "").trim() !== penaltyKey) {
        return total;
      }
      const amount = Number(item.amount || 0);
      return amount < 0 ? total + Math.abs(amount) : total;
    }, 0);
  }

  function sumAnalysisPenaltyAmounts(analysis, penaltyKeys = []) {
    return (Array.isArray(penaltyKeys) ? penaltyKeys : [])
      .filter(Boolean)
      .reduce((total, penaltyKey) => total + getAnalysisPenaltyAmount(analysis, penaltyKey), 0);
  }

  function getRelationshipStateDetail(tweet, relationshipStates = {}) {
    const key = normalizeHandle(tweet?.authorHandle);
    const detail = key ? relationshipStates?.[key] : null;
    if (!key || !detail || typeof detail !== "object") {
      return null;
    }
    const status = String(detail.status || "").trim();
    if (!status) {
      return null;
    }
    if (status === "snoozed" && Number(detail.snoozeUntil || 0) <= Date.now()) {
      return null;
    }
    return detail;
  }

  function getMutualTrafficReliefSignal(tweet, analysis, relationshipStates = {}) {
    const detail = getRelationshipStateDetail(tweet, relationshipStates);
    if (String(detail?.status || "").trim() !== "mutual" || !analysis) {
      return null;
    }

    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    if (verificationType === "government" || verificationType === "gold") {
      return null;
    }

    const reliefKeys = [
      "followTrainBait",
      "socialGrowthFlex",
      "hardCapFollowLoop",
      "hardCapPayoutFlex"
    ];
    if (verificationType === "blue" || tweet?.authorVerified) {
      reliefKeys.push("verifiedPileOn");
    }

    const restorablePenalty = sumAnalysisPenaltyAmounts(analysis, reliefKeys);
    if (restorablePenalty <= 0) {
      return null;
    }

    const views = Number(tweet?.views || 0);
    const replies = Number(tweet?.replies || 0);
    const velocityPerHour = Number(tweet?.trafficVelocityPerHour || 0);
    const reachLikelihood = Number(analysis?.reachLikelihood || 0);
    const trafficFit = Math.max(
      Math.max(0, Math.min(1, (Math.log10(views + 1) - 2.4) / 1.75)),
      Math.max(0, Math.min(1, (Math.log10(replies + 1) - 0.45) / 1.35)),
      Math.max(0, Math.min(1, (Math.log10(velocityPerHour + 1) - 1.9) / 1.7)),
      Math.max(0, Math.min(1, (reachLikelihood - 42) / 28))
    );
    const reliefFactor = 0.22 + (trafficFit * 0.34);
    let amount = Math.round(restorablePenalty * reliefFactor);
    if ((verificationType === "blue" || tweet?.authorVerified) && trafficFit >= 0.45) {
      amount += 6;
    }
    amount = Math.max(0, Math.min(40, amount));
    if (amount < 4) {
      return null;
    }

    return {
      status: "mutual",
      amount,
      label: (verificationType === "blue" || tweet?.authorVerified)
        ? "Blue mutual traffic relief"
        : "Mutual traffic relief",
      highlight: trafficFit >= 0.55
        ? "mutual traffic keeps it live"
        : "mutual stays in scoring"
    };
  }

  function getRelationshipOpportunitySignal(tweet, analysis, attributionSignal, relationshipStates = {}) {
    const detail = getRelationshipStateDetail(tweet, relationshipStates);
    const key = normalizeHandle(tweet?.authorHandle);
    if (!key || !detail || typeof detail !== "object") {
      return null;
    }

    const status = String(detail.status || "").trim();
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
      hasAnalysisPenaltyKey(analysis, "crowding") ||
      hasAnalysisPenaltyKey(analysis, "verifiedOrganization") ||
      hasAnalysisPenaltyKey(analysis, "verifiedPileOn") ||
      hasAnalysisPenaltyKey(analysis, "politicalFigure") ||
      hasAnalysisPenaltyKey(analysis, "broadcastAccount")
    );

    switch (status) {
      case "mutual": {
        let amount = strongMemory ? 18 : 12;
        if (!strongMemory) {
          if (verificationType === "government" || verificationType === "gold") {
            amount -= 6;
          }
          if (crowded || broadcastHeavy) {
            amount -= 3;
          }
          if (reachLikelihood > 0 && reachLikelihood < 52) {
            amount -= 2;
          }
          if (pileOnRisk) {
            amount -= 2;
          }
          if (!crowded && !broadcastHeavy && conversationRatio >= 0.0035 && conversationRatio <= 0.026) {
            amount += 2;
          }
        }
        amount = Math.max(0, Math.min(22, Math.round(amount)));
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

    const mutualTrafficReliefSignal = getMutualTrafficReliefSignal(
      tweet,
      analysis,
      opportunityContext.relationshipStates
    );
    if (mutualTrafficReliefSignal?.amount) {
      score += mutualTrafficReliefSignal.amount;
      breakdown.push({
        key: "mutualTrafficRelief",
        label: mutualTrafficReliefSignal.label,
        amount: mutualTrafficReliefSignal.amount,
        kind: "quality"
      });
      if (mutualTrafficReliefSignal.highlight) {
        extraHighlights.push(mutualTrafficReliefSignal.highlight);
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

    const lowExposurePenaltySignal = getLowExposurePenaltySignal(tweet, analysis, opportunityContext.lowExposureMemory);
    if (lowExposurePenaltySignal?.amount) {
      score -= lowExposurePenaltySignal.amount;
      breakdown.push({
        key: "lowExposureMemory",
        label: lowExposurePenaltySignal.label,
        amount: -lowExposurePenaltySignal.amount,
        kind: "penalty"
      });
      if (lowExposurePenaltySignal.highlight) {
        extraHighlights.push(lowExposurePenaltySignal.highlight);
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

  function removeDraftPreview(article) {
    const existing = article instanceof Element ? article.querySelector(`:scope > .${DRAFT_PREVIEW_CLASS}`) : null;
    if (existing instanceof HTMLElement) {
      existing.remove();
    }
  }

  function renderDraftPreview(article, preview = null) {
    if (!(article instanceof HTMLElement)) {
      return false;
    }
    removeDraftPreview(article);
    const normalizedUrl = normalizeTweetUrl(preview?.url || readTweetUrl(article));
    const replyText = String(preview?.replyText || preview?.previewText || preview?.draft || "").trim().slice(0, 560);
    if (!normalizedUrl || !replyText) {
      return false;
    }
    const riskFlags = Array.isArray(preview?.riskFlags) ? preview.riskFlags.map((flag) => String(flag || "").trim()).filter(Boolean) : [];
    const node = document.createElement("div");
    node.className = DRAFT_PREVIEW_CLASS;
    node.dataset.tweetId = extractTweetIdFromUrl(normalizedUrl);
    node.dataset.risk = riskFlags.length ? "1" : "0";
    const label = riskFlags.length
      ? `AI 草稿预览 · 需确认 ${riskFlags.slice(0, 2).join(" / ")}`
      : "AI 草稿预览 · 人工确认后发送";
    node.innerHTML = `<strong></strong><p></p>`;
    node.querySelector("strong").textContent = label;
    node.querySelector("p").textContent = replyText;
    article.appendChild(node);
    return true;
  }

  function renderStoredDraftPreview(article) {
    const url = normalizeTweetUrl(readTweetUrl(article));
    const preview = url ? state.draftPreviewsByUrl[url] : null;
    if (preview) {
      renderDraftPreview(article, preview);
    } else {
      removeDraftPreview(article);
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

  function getFloatingPanelRecommendedCandidates(candidates = state.recentCandidates) {
    const displayThreshold = getConfiguredDisplayThreshold(state.settings);
    return sortApiAgentCandidates(Array.isArray(candidates) ? candidates : [])
      .filter((candidate) => {
        const url = normalizeTweetUrl(candidate?.url);
        if (!url || hasTrackedTweetUrl(state.repliedTweetUrls, url) || hasTrackedTweetUrl(state.dismissedTweetUrls, url)) {
          return false;
        }
        const recommendedDecision = String(candidate?.recommendedDecision || candidate?.routing?.recommendedDecision || "").trim();
        const trafficProfile = buildExecutorTrafficProfile({
          views: candidate?.views,
          replies: candidate?.replies,
          velocityPerHour: candidate?.trafficVelocityPerHour,
          phase: candidate?.trafficPhase
        });
        return (
          recommendedDecision === "reply-now" &&
          getCandidateCurrentScore(candidate) >= displayThreshold &&
          trafficProfile.qualified
        );
      });
  }

  function getFloatingPanelCandidates(limit = FLOATING_PANEL_LIMIT, candidates = state.recentCandidates) {
    return getFloatingPanelRecommendedCandidates(candidates).slice(0, Math.max(0, Math.floor(Number(limit) || 0)));
  }

  function getFloatingPanelHighScoreCount(candidates = state.recentCandidates, limit = FLOATING_PANEL_LIMIT) {
    return getFloatingPanelCandidates(limit, candidates).length;
  }

  function inferFloatingDraftLanguage(candidate = {}) {
    const languageSignals = Array.isArray(candidate?.matchedLanguages)
      ? candidate.matchedLanguages.map((item) => String(item || "").trim().toLowerCase()).filter(Boolean)
      : [];
    const joinedSignals = languageSignals.join(" ");
    const text = String(candidate?.text || "").trim();
    if (/ko/.test(joinedSignals) || /[\uac00-\ud7af]/.test(text)) {
      return "ko";
    }
    if (/ja/.test(joinedSignals) || /[\u3040-\u30ff]/.test(text)) {
      return "ja";
    }
    if (/zh/.test(joinedSignals) || /[\u4e00-\u9fff]/.test(text)) {
      return "zh";
    }
    return "en";
  }

  function buildFloatingQuickDraft(candidate = {}) {
    const language = inferFloatingDraftLanguage(candidate);
    if (language === "ja") {
      return "写真ごとに空気感が違って、その日の流れが自然に伝わってきます。";
    }
    if (language === "ko") {
      return "사진마다 분위기가 달라서 하루의 흐름이 자연스럽게 전해지네요.";
    }
    if (language === "zh") {
      return "这条把信息和情绪都带出来了，读完很容易停下来。";
    }
    return "Love how this captures the mood so clearly in just a few lines.";
  }

  function resolveFloatingCandidateDraft(candidate = {}) {
    const url = normalizeTweetUrl(candidate?.url || "");
    const preview = url ? state.draftPreviewsByUrl[url] : null;
    const previewDraft = String(preview?.replyText || preview?.previewText || preview?.draft || "").trim().slice(0, 560);
    if (previewDraft) {
      return previewDraft;
    }
    const directDraft = String(candidate?.replyText || candidate?.draft || "").trim().slice(0, 560);
    if (directDraft) {
      return directDraft;
    }
    return "";
  }

  async function openFloatingCandidate(candidate = {}) {
    const url = normalizeTweetUrl(candidate?.url || "");
    if (!url) {
      return buildReplyActionFailure({ reason: "missing-url" });
    }
    setFloatingPanelOpen(false);
    const draft = resolveFloatingCandidateDraft(candidate);
    const action = draft
      ? (candidate?.timelineInlineReplyEligible ? "reply-from-timeline" : "reply")
      : "open-composer";
    return runReplyDropExecutorAction({
      action,
      url,
      tweetId: extractTweetIdFromUrl(url),
      draft,
      timelineFirst: Boolean(candidate?.timelineInlineReplyEligible),
      preferDetailPage: !candidate?.timelineInlineReplyEligible
    });
  }

  function clampFloatingPanelSelection(candidateCount = 0) {
    const maxIndex = Math.max(0, Number(candidateCount || 0) - 1);
    const nextIndex = Math.max(0, Math.min(maxIndex, Number(state.floatingPanelSelectedIndex || 0)));
    state.floatingPanelSelectedIndex = nextIndex;
    return nextIndex;
  }

  function isEditableKeyboardTarget(target) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    const tagName = String(target.tagName || "").toLowerCase();
    if (["input", "textarea", "select"].includes(tagName)) {
      return true;
    }
    return Boolean(target.isContentEditable || target.closest('[contenteditable="true"]'));
  }

  function getFloatingCandidateModeLabel(candidate = {}) {
    return candidate?.timelineInlineReplyEligible ? "卡片快回" : "详情复核";
  }

  function getFloatingCandidateModeTone(candidate = {}) {
    return candidate?.timelineInlineReplyEligible ? "inline" : "detail";
  }

  function openFloatingCandidateByIndex(index = 0) {
    const candidates = getFloatingPanelCandidates(FLOATING_PANEL_LIMIT);
    const candidate = candidates[Math.max(0, Math.min(candidates.length - 1, Number(index) || 0))];
    if (!candidate) {
      return false;
    }
    void openFloatingCandidate(candidate).catch((error) => {
      console.warn("[ReplyDrop] failed to open floating candidate", error, candidate);
    });
    return true;
  }

  function toggleFloatingPanel(nextOpen = null) {
    renderFloatingWidget();
    const panel = ensureFloatingPanel();
    const open = panel instanceof HTMLElement && panel.dataset.open === "1";
    const desired = typeof nextOpen === "boolean" ? nextOpen : !open;
    setFloatingPanelOpen(desired);
    return {
      ok: true,
      panelOpen: desired
    };
  }

  async function closeActiveReplySurface(options = {}) {
    const targetUrl = normalizeTweetUrl(options?.targetUrl || resolveReplyTargetUrl() || "");
    const dismissed = await dismissGenericComposerDialog();
    if (dismissed) {
      await waitFor(180);
    }

    if (isComposePostPath()) {
      try {
        global.history.back();
      } catch {}
      await waitFor(220);
    }

    if (isComposePostPath()) {
      try {
        global.location.assign("https://x.com/home");
      } catch {}
      await waitFor(220);
    }

    return {
      ok: true,
      dismissed,
      targetUrl,
      currentUrl: normalizeTweetUrl(global.location.href),
      onComposePath: isComposePostPath()
    };
  }

  function moveFloatingPanelSelection(delta = 0) {
    const candidates = getFloatingPanelCandidates(FLOATING_PANEL_LIMIT);
    if (!candidates.length) {
      state.floatingPanelSelectedIndex = 0;
      return 0;
    }
    const currentIndex = clampFloatingPanelSelection(candidates.length);
    const nextIndex = (currentIndex + Number(delta || 0) + candidates.length) % candidates.length;
    state.floatingPanelSelectedIndex = nextIndex;
    const panel = document.getElementById(FLOAT_PANEL_ID);
    if (panel instanceof HTMLElement) {
      renderFloatingPanelFallback(panel, true);
      const selected = panel.querySelector('.xrs-floating-fallback-item.is-active');
      selected?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    return nextIndex;
  }

  function bindFloatingKeyboardShortcuts() {
    if (state.floatingKeyboardBound) {
      return;
    }
    state.floatingKeyboardBound = true;
    document.addEventListener("keydown", (event) => {
      if (isFloatingUiDisabled()) {
        return;
      }
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const widget = document.getElementById(FLOAT_WIDGET_ID);
      const panel = document.getElementById(FLOAT_PANEL_ID);
      const panelOpen = panel instanceof HTMLElement && panel.dataset.open === "1";
      const rawKey = String(event.key || "");
      const lowerKey = rawKey.toLowerCase();
      const hotToggle = (event.altKey && event.shiftKey && lowerKey === "d") || rawKey === "F2";
      const hotClose = (event.altKey && event.shiftKey && lowerKey === "x") || rawKey === "F3";
      if (hotToggle) {
        event.preventDefault();
        toggleFloatingPanel(!panelOpen);
        return;
      }
      if (hotClose) {
        event.preventDefault();
        void closeActiveReplySurface();
        return;
      }
      if (isEditableKeyboardTarget(event.target)) {
        return;
      }
      if (!panelOpen) {
        return;
      }

      const key = rawKey;
      if (key === "Escape") {
        event.preventDefault();
        setFloatingPanelOpen(false);
        return;
      }
      if (key === "ArrowDown" || key.toLowerCase() === "j") {
        event.preventDefault();
        moveFloatingPanelSelection(1);
        return;
      }
      if (key === "ArrowUp" || key.toLowerCase() === "k") {
        event.preventDefault();
        moveFloatingPanelSelection(-1);
        return;
      }
      if (key === "Enter") {
        event.preventDefault();
        openFloatingCandidateByIndex(state.floatingPanelSelectedIndex || 0);
        return;
      }
      if (key.toLowerCase() === "r") {
        event.preventDefault();
        scheduleScan();
        if (panel instanceof HTMLElement) {
          renderFloatingPanelFallback(panel, true);
        }
        return;
      }
      if (/^[1-6]$/.test(key)) {
        event.preventDefault();
        state.floatingPanelSelectedIndex = Math.max(0, Number(key) - 1);
        openFloatingCandidateByIndex(state.floatingPanelSelectedIndex);
      }
    }, true);
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
    if (open) {
      renderFloatingPanelFallback(panel, true);
      focusFloatingPanelAnchor(panel);
    }
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

    const keyboardAnchor = document.createElement("button");
    keyboardAnchor.type = "button";
    keyboardAnchor.className = "xrs-floating-fallback-focusAnchor";
    keyboardAnchor.setAttribute("aria-hidden", "true");
    keyboardAnchor.tabIndex = 0;
    panel.appendChild(keyboardAnchor);

    const fallback = document.createElement("div");
    fallback.className = "xrs-floating-fallback";
    panel.appendChild(fallback);
    document.body.appendChild(panel);

    panel.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      focusFloatingPanelAnchor(panel);
    }, true);
    panel.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest("[data-xrs-panel-action]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const action = String(target.dataset.xrsPanelAction || "").trim();
      const url = normalizeTweetUrl(target.dataset.url || "");
      if (action === "close") {
        setFloatingPanelOpen(false);
        return;
      }
      if (action === "refresh") {
        scheduleScan();
        renderFloatingPanelFallback(panel, true);
        return;
      }
      if (action === "open-post") {
        const index = Math.max(0, Number(target.dataset.index) || 0);
        state.floatingPanelSelectedIndex = index;
        if (!openFloatingCandidateByIndex(index)) {
          console.warn("[ReplyDrop] floating candidate open rejected", {
            index,
            url,
            reason: "fastpath-open-rejected"
          });
        }
      }
    });

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

    renderFloatingPanelFallback(panel);

    return panel;
  }

  function focusFloatingPanelAnchor(panel) {
    const anchor = panel instanceof HTMLElement ? panel.querySelector(".xrs-floating-fallback-focusAnchor") : null;
    if (!(anchor instanceof HTMLElement)) {
      return;
    }
    global.requestAnimationFrame?.(() => {
      try {
        anchor.focus({ preventScroll: true });
      } catch {
        anchor.focus();
      }
    });
  }

  function renderFloatingPanelFallback(panel) {
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    const fallback = panel.querySelector(".xrs-floating-fallback");
    if (!(fallback instanceof HTMLElement)) {
      return;
    }

    const candidates = getFloatingPanelCandidates(FLOATING_PANEL_LIMIT);
    const items = candidates.map((candidate) => {
      const handle = escapeHtml(candidate?.authorHandle ? `@${candidate.authorHandle}` : "unknown");
      const score = Number(candidate?.score || 0);
      const text = escapeHtml(String(candidate?.text || "").trim().slice(0, 92) || "这条还没抓到正文，先点打开回复。");
      const url = escapeHtml(candidate?.url || "");
      return `
        <article class="xrs-floating-fallback-item">
          <div class="xrs-floating-fallback-item-head">
            <strong>${handle}</strong>
            <span class="xrs-floating-fallback-score">${score}</span>
          </div>
          <p>${text}</p>
          <button type="button" data-xrs-panel-action="open-post" data-url="${url}">打开回复</button>
        </article>
      `;
    }).join("");

    fallback.dataset.visible = "1";
    fallback.innerHTML = `
      <div class="xrs-floating-fallback-card">
        <div class="xrs-floating-fallback-top">
          <div>
            <strong>ReplyDrop</strong>
            <span>Safari 原生面板</span>
          </div>
          <button type="button" data-xrs-panel-action="close">关闭</button>
        </div>
        <div class="xrs-floating-fallback-stats">
          <span>扫描 ${Number(state.stats?.scannedCount || 0)}</span>
          <span>可见 ${Number(state.stats?.visibleCount || 0)}</span>
          <span>高分 ${Number(state.stats?.highScoreCount || 0)}</span>
          <button type="button" data-xrs-panel-action="refresh">刷新</button>
        </div>
        <div class="xrs-floating-fallback-list">
          ${items || '<div class="xrs-floating-fallback-empty">还没抓到候选，先滚动时间线再点刷新。</div>'}
        </div>
      </div>
    `;
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
    } else if (panel instanceof HTMLElement && panel.dataset.open === "1") {
      renderFloatingPanelFallback(panel, true);
    }

    const todayReplyCount = getTodayReplyCount(state.repliedTweets);
    const count = widget.querySelector(`.${FLOAT_COUNT_CLASS}`);

    if (count) {
      count.textContent = String(todayReplyCount);
    }
  }

  function renderFloatingPanelFallback(panel, forceVisible = false) {
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    const fallback = panel.querySelector(".xrs-floating-fallback");
    if (!(fallback instanceof HTMLElement)) {
      return;
    }

    const shouldShow = forceVisible || panel.dataset.embeddedReady !== "1";
    fallback.dataset.visible = shouldShow ? "1" : "0";
    if (!shouldShow) {
      fallback.innerHTML = "";
      return;
    }

    const candidates = getFloatingPanelCandidates(FLOATING_PANEL_LIMIT);
    const selectedIndex = clampFloatingPanelSelection(candidates.length);
    const items = candidates.map((candidate, index) => {
      const handle = escapeHtml(candidate?.authorHandle ? `@${candidate.authorHandle}` : "unknown");
      const score = Number(candidate?.score || 0);
      const text = escapeHtml(String(candidate?.text || "").trim().slice(0, 108) || "这条还没抓到正文，先点打开回复。");
      const url = escapeHtml(candidate?.url || "");
      const modeLabel = escapeHtml(getFloatingCandidateModeLabel(candidate));
      const modeTone = escapeHtml(getFloatingCandidateModeTone(candidate));
      const metaChips = [
        `<span class="xrs-floating-fallback-score">Score ${score}</span>`,
        `<span class="xrs-floating-fallback-chip">${modeLabel}</span>`
      ];
      if (candidate?.quickDraftAllowed) {
        metaChips.push('<span class="xrs-floating-fallback-chip">正文够用</span>');
      }
      if (candidate?.mediaKind) {
        metaChips.push(`<span class="xrs-floating-fallback-chip">${escapeHtml(String(candidate.mediaKind).trim())}</span>`);
      }
      return `
        <article class="xrs-floating-fallback-item ${index === selectedIndex ? "is-active" : ""}">
          <button class="xrs-floating-fallback-itemButton" type="button" data-xrs-panel-action="open-post" data-index="${index}" data-url="${url}">
            <span class="xrs-floating-fallback-itemRank">${index + 1}</span>
            <span class="xrs-floating-fallback-main">
              <span class="xrs-floating-fallback-item-top">
                <strong>${handle}</strong>
                <span class="xrs-floating-fallback-itemMode" data-tone="${modeTone}">${modeLabel}</span>
              </span>
              <p>${text}</p>
              <span class="xrs-floating-fallback-itemMeta">
                ${metaChips.join("")}
                <span class="xrs-floating-fallback-itemAction">Enter 执行</span>
              </span>
            </span>
          </button>
        </article>
      `;
    }).join("");

    fallback.innerHTML = `
      <div class="xrs-floating-fallback-card">
        <div class="xrs-floating-fallback-header">
          <div class="xrs-floating-fallback-brand">
            <strong>ReplyDrop</strong>
            <span>Safari 快速压测台</span>
          </div>
          <div class="xrs-floating-fallback-actions">
            <span class="xrs-floating-fallback-kbd">F2</span>
            <button type="button" data-xrs-panel-action="refresh">刷新</button>
            <button type="button" data-xrs-panel-action="close">关闭</button>
          </div>
        </div>
        <div class="xrs-floating-fallback-statGrid">
          <div class="xrs-floating-fallback-stat">
            <span>扫描</span>
            <strong>${Number(state.stats?.scannedCount || 0)}</strong>
          </div>
          <div class="xrs-floating-fallback-stat">
            <span>可见</span>
            <strong>${Number(state.stats?.visibleCount || 0)}</strong>
          </div>
          <div class="xrs-floating-fallback-stat">
            <span>高分</span>
            <strong>${Number(state.stats?.highScoreCount || 0)}</strong>
          </div>
        </div>
        <div class="xrs-floating-fallback-tip">J/K 切换，Enter 执行，1-6 直达，R 刷新，F3 退出</div>
        <div class="xrs-floating-fallback-list">
          ${items || '<div class="xrs-floating-fallback-empty">还没抓到候选，先滚动时间线再点刷新。</div>'}
        </div>
      </div>
    `;
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
      ? pruneRecentCandidates(stats.recentCandidates, EXECUTOR_SCAN_WINDOW_SIZE)
      : pruneRecentCandidates(state.recentCandidates, EXECUTOR_SCAN_WINDOW_SIZE);
    const derivedHighScoreCount = getFloatingPanelHighScoreCount(recentCandidates);
    state.recentCandidates = recentCandidates;
    state.stats = {
      scannedCount: Math.max(0, Math.floor(Number(stats.scannedCount) || 0)),
      highScoreCount: derivedHighScoreCount,
      visibleCount: Math.max(0, Math.floor(Number(stats.visibleCount) || 0))
    };
    const updatedAt = Number(stats?.updatedAt || stats?.lastScanAt || 0);
    if (updatedAt > 0) {
      state.lastScanCompletedAt = updatedAt;
    }
    renderFloatingWidget();
  }

  async function publishStats(stats) {
    setLocalStats(stats);

    const now = Date.now();
    if (now - state.lastSentAt < STATS_PUBLISH_MIN_INTERVAL_MS) {
      return;
    }

    state.lastSentAt = now;
    await sendRuntimeMessage({
      type: "X_REPLY_SCORER_STATS_UPDATE",
      scannedCount: state.stats.scannedCount,
      highScoreCount: state.stats.highScoreCount,
      visibleCount: state.stats.visibleCount,
      recentCandidates: pruneRecentCandidates(state.recentCandidates, EXECUTOR_SCAN_WINDOW_SIZE),
      updatedAt: state.lastScanCompletedAt || now,
      lastScanAt: state.lastScanCompletedAt || now
    });
  }

  async function markTweetAsReplied(url, meta = null) {
    const normalized = normalizeTweetUrl(url);
    if (!normalized) {
      return;
    }

    state.repliedTweets[normalized] = Date.now();
    state.repliedTweetUrls.add(normalized);
    state.recentCandidates = (Array.isArray(state.recentCandidates) ? state.recentCandidates : [])
      .filter((candidate) => !hasTrackedTweetUrl(new Set([normalized]), candidate?.url || ""));
    if (meta && typeof meta === "object") {
      state.replyDetails[normalized] = {
        ...(state.replyDetails?.[normalized] && typeof state.replyDetails[normalized] === "object"
          ? state.replyDetails[normalized]
          : {}),
        ...meta,
        url: normalized,
        tier: String(meta.tier || "replied").trim() || "replied",
        completedAt: Date.now(),
        status: "replied"
      };
      state.replyDetails = pruneReplyDetails(state.replyDetails);
    }
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
    state.scanTimer = null;
    if (!global.XReplyScorer) {
      return;
    }

    readCurrentUserHandle();
    syncManualReplyStateFromStatusPage();
    syncManualReplyStateFromRepliesTimeline();

    if (!state.settings.enabled) {
      hideAllBadges();
      setLocalStats({ scannedCount: 0, highScoreCount: 0, visibleCount: 0, recentCandidates: [] });
      publishStats({ scannedCount: 0, highScoreCount: 0, visibleCount: 0, recentCandidates: [] });
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

        if (tweet.url && hasTrackedTweetUrl(state.repliedTweetUrls, tweet.url)) {
          delete article.dataset.xrsCandidate;
          renderBadge(article, "✓", "replied", "Already replied");
          continue;
        }

        if (tweet.url && hasTrackedTweetUrl(state.dismissedTweetUrls, tweet.url)) {
          delete article.dataset.xrsCandidate;
          renderBadge(article, "", "hidden");
          continue;
        }

        const baseAnalysis = global.XReplyScorer.analyzeTweet(tweet, state.settings);
        const analysis = applyOpportunityAdjustments(tweet, baseAnalysis, state.settings, opportunityContext);
        const effectiveTier = (
          analysis.tier === "hidden" &&
          Number.isFinite(Number(analysis.score)) &&
          tweet.url &&
          (tweet.text || tweet.hasMedia)
        ) ? "low-outline" : analysis.tier;

        renderBadge(article, String(analysis.score), effectiveTier, analysis.tooltip || `Reply score ${analysis.score}`);

        if (effectiveTier !== "hidden") {
          visibleCount += 1;
          const mediaSummary = getMediaSummaryFromState(state, extractTweetIdFromUrl(tweet.url));
          const draftCandidate = buildCandidatePayload(tweet, analysis, effectiveTier);
          const candidate = attachCandidateExecutionMeta(draftCandidate, article, mediaSummary);
          storeCandidatePayload(article, candidate);
          recentCandidates.push(candidate);
          renderStoredDraftPreview(article);
        } else {
          delete article.dataset.xrsCandidate;
          removeDraftPreview(article);
        }
        if (effectiveTier === "high" || effectiveTier === "good") {
          highScoreCount += 1;
        }
      } catch (error) {
        scannedCount += 1;
        console.warn("[ReplyDrop] failed to scan tweet", error, article);
      }
    }

    const sortedRecentCandidates = recentCandidates
      .sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
      .slice(0, EXECUTOR_SCAN_WINDOW_SIZE);
    highScoreCount = getFloatingPanelHighScoreCount(sortedRecentCandidates);
    const completedAt = Date.now();
    state.lastScanCompletedAt = completedAt;

    publishStats({
      scannedCount,
      highScoreCount,
      visibleCount,
      recentCandidates: sortedRecentCandidates,
      updatedAt: completedAt,
      lastScanAt: completedAt
    });

    if (needsFollowUp && Date.now() - state.lastDomChangeAt < 8000) {
      scheduleLazyRescan(1300);
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
      if (state.scanTimer || state.lazyRescanTimer) {
        return;
      }
      scheduleScan();
    });

    state.observer.observe(document.body, {
      childList: true,
      subtree: true,
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

      if (message?.type === "X_REPLY_SCORER_CAPTURE_REPLY_PERFORMANCE_SNAPSHOT") {
        captureReplyPerformanceSnapshot(message.payload || {}).then((result) => {
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

  function findOwnReplyArticleOnStatusPage(statusUrl) {
    const normalizedStatusUrl = normalizeTweetUrl(statusUrl);
    const currentUserHandle = readCurrentUserHandle();
    if (!normalizedStatusUrl || !currentUserHandle) {
      return null;
    }

    const targetTweetId = extractTweetIdFromUrl(normalizedStatusUrl);
    const articles = getTweetNodes();
    const targetArticle = findTweetArticleByTweetId(targetTweetId, normalizedStatusUrl);
    const targetArticleIndex = targetArticle instanceof Element
      ? articles.indexOf(targetArticle)
      : -1;
    const targetAuthorHandle = extractStatusAuthorHandle(normalizedStatusUrl);

    for (let index = 0; index < articles.length; index += 1) {
      const article = articles[index];
      if (!(article instanceof Element)) {
        continue;
      }
      if (targetArticleIndex >= 0 && index <= targetArticleIndex) {
        continue;
      }
      const authorHandle = readAuthorHandle(article);
      if (!authorHandle || authorHandle !== currentUserHandle) {
        continue;
      }

      const replyUrl = normalizeTweetUrl(readTweetUrl(article));
      if (!replyUrl || replyUrl === normalizedStatusUrl) {
        continue;
      }

      const replyTweetId = extractTweetIdFromUrl(replyUrl);
      if (targetTweetId && replyTweetId && replyTweetId === targetTweetId) {
        continue;
      }
      if (!hasReplyContextTextInArticle(article)) {
        continue;
      }
      if (targetAuthorHandle) {
        const articleText = String(article.textContent || "").toLowerCase();
        if (!articleText.includes(`@${targetAuthorHandle}`)) {
          continue;
        }
      }

      const tweet = getTweetData(article);
      if (!String(tweet.text || "").trim() && !tweet.mediaKind) {
        continue;
      }

      return article;
    }

    return null;
  }

  function buildManualReplyDetectionMeta(targetUrl, replyArticle, detectionSource, targetArticle = null) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || !(replyArticle instanceof Element)) {
      return null;
    }

    const replyTweet = getTweetData(replyArticle);
    if (!String(replyTweet.text || "").trim() && !replyTweet.mediaKind) {
      return null;
    }

    const resolvedTargetArticle = targetArticle instanceof Element
      ? targetArticle
      : findTweetArticleByTweetId(extractTweetIdFromUrl(normalizedTarget), normalizedTarget);
    const targetAuthorHandle = resolvedTargetArticle
      ? readAuthorHandle(resolvedTargetArticle)
      : extractStatusAuthorHandle(normalizedTarget);

    return {
      tier: "replied",
      score: 0,
      authorHandle: String(targetAuthorHandle || "").trim(),
      replyText: String(replyTweet.text || "").trim().slice(0, 560),
      replyUrl: normalizeTweetUrl(replyTweet.url),
      publishMode: "manual-detected",
      detectionSource: String(detectionSource || "manual-detected").trim() || "manual-detected"
    };
  }

  function markManualReplyDetected(targetUrl, replyArticle, detectionSource, targetArticle = null) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || hasRecordedReply(normalizedTarget)) {
      return false;
    }

    const meta = buildManualReplyDetectionMeta(normalizedTarget, replyArticle, detectionSource, targetArticle);
    if (!meta) {
      return false;
    }

    void markTweetAsReplied(normalizedTarget, meta);
    return true;
  }

  function isCurrentUserRepliesTimeline() {
    const match = String(global.location.pathname || "").match(/^\/([^/]+)\/with_replies(?:$|[/?#])/);
    const timelineHandle = normalizeHandle(match?.[1] || "");
    const currentUserHandle = readCurrentUserHandle();
    return Boolean(timelineHandle && currentUserHandle && timelineHandle === currentUserHandle);
  }

  function hasReplyContextTextInArticle(article) {
    if (!(article instanceof Element)) {
      return false;
    }
    const articleText = String(article.textContent || "").trim().toLowerCase();
    if (!articleText) {
      return false;
    }
    return REPLY_CONTEXT_TEXT.some((keyword) => articleText.includes(String(keyword).toLowerCase()));
  }

  function findPreviousReplyTargetArticle(articles, startIndex) {
    const limit = Math.max(0, Number(startIndex || 0));
    for (let index = limit - 1; index >= 0 && limit - index <= 3; index -= 1) {
      const article = articles[index];
      if (!(article instanceof Element)) {
        continue;
      }
      const tweet = getTweetData(article);
      if (!tweet.url || tweet.promoted || tweet.isOwnTweet) {
        continue;
      }
      return article;
    }
    return null;
  }

  function syncManualReplyStateFromStatusPage() {
    const currentStatusUrl = getCurrentStatusUrl();
    if (!currentStatusUrl || hasRecordedReply(currentStatusUrl)) {
      return;
    }

    const ownReplyArticle = findOwnReplyArticleOnStatusPage(currentStatusUrl);
    if (!ownReplyArticle) {
      return;
    }

    const targetArticle = findTweetArticleByTweetId(extractTweetIdFromUrl(currentStatusUrl), currentStatusUrl);
    markManualReplyDetected(currentStatusUrl, ownReplyArticle, "status-page-own-reply", targetArticle);
  }

  function syncManualReplyStateFromRepliesTimeline() {
    if (!isCurrentUserRepliesTimeline()) {
      return;
    }

    const currentUserHandle = readCurrentUserHandle();
    if (!currentUserHandle) {
      return;
    }

    const articles = getTweetNodes();
    for (let index = 0; index < articles.length; index += 1) {
      const replyArticle = articles[index];
      if (!(replyArticle instanceof Element)) {
        continue;
      }

      const replyTweet = getTweetData(replyArticle);
      if (!replyTweet.isOwnTweet || !replyTweet.url) {
        continue;
      }
      if (!hasReplyContextTextInArticle(replyArticle)) {
        continue;
      }

      const targetArticle = findPreviousReplyTargetArticle(articles, index);
      const targetUrl = normalizeTweetUrl(readTweetUrl(targetArticle));
      if (!targetUrl) {
        continue;
      }
      if (extractTweetIdFromUrl(targetUrl) === extractTweetIdFromUrl(replyTweet.url)) {
        continue;
      }

      markManualReplyDetected(targetUrl, replyArticle, "with-replies-own-reply", targetArticle);
    }
  }

  function waitFor(ms) {
    return new Promise((resolve) => {
      global.setTimeout(resolve, ms);
    });
  }

  function clearPreparedReplyComposer(targetUrl = "") {
    const cached = state.preparedReplyComposer;
    if (!cached) {
      return;
    }

    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || normalizeTweetUrl(cached.targetUrl) === normalizedTarget) {
      state.preparedReplyComposer = null;
    }
  }

  function cachePreparedReplyComposer(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload?.targetUrl || payload?.url || "");
    const editor = payload?.editor instanceof HTMLElement ? payload.editor : null;
    const sendButton = payload?.sendButton instanceof HTMLElement ? payload.sendButton : null;
    if (!targetUrl || !(editor instanceof HTMLElement) || !(sendButton instanceof HTMLElement)) {
      clearPreparedReplyComposer(targetUrl);
      return false;
    }

    state.preparedReplyComposer = {
      targetUrl,
      editor,
      sendButton,
      mode: String(payload?.mode || "").trim(),
      draftLoaded: Boolean(payload?.draftLoaded),
      at: Date.now()
    };
    return true;
  }

  function getPreparedReplyComposer(targetUrl = "") {
    const cached = state.preparedReplyComposer;
    if (!cached) {
      return null;
    }

    if (Date.now() - Number(cached.at || 0) > PREPARED_REPLY_COMPOSER_TTL_MS) {
      state.preparedReplyComposer = null;
      return null;
    }

    const normalizedTarget = normalizeTweetUrl(targetUrl || cached.targetUrl);
    if (!normalizedTarget || normalizeTweetUrl(cached.targetUrl) !== normalizedTarget) {
      return null;
    }

    const editor = cached.editor instanceof HTMLElement && cached.editor.isConnected ? cached.editor : null;
    const sendButton = cached.sendButton instanceof HTMLElement && cached.sendButton.isConnected ? cached.sendButton : null;
    if (!(editor instanceof HTMLElement) || !(sendButton instanceof HTMLElement)) {
      state.preparedReplyComposer = null;
      return null;
    }

    const context = buildReplyComposerContext({ targetUrl: normalizedTarget, editor, sendButton });
    if (!context.composerLocked || !isReplySubmitButtonEnabled(sendButton)) {
      state.preparedReplyComposer = null;
      return null;
    }

    return {
      targetUrl: normalizedTarget,
      editor,
      sendButton,
      context,
      mode: String(cached.mode || "").trim(),
      draftLoaded: Boolean(cached.draftLoaded),
      at: Number(cached.at || 0)
    };
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
      roundMaxTargets: EXECUTOR_ROUND_MAX_TARGETS,
      roundBudgetMs: EXECUTOR_ROUND_BUDGET_MS,
      roundBudgetMinutes: Math.round(EXECUTOR_ROUND_BUDGET_MS / 60000),
      consecutiveEmptyResultLimit: EXECUTOR_CONSECUTIVE_EMPTY_RESULT_LIMIT,
      emptyResultDefinition: "插件/runner没有拿到结构化执行结果的异常空返回；正常评分下降、低于发送线、已回复过、目标不匹配不算。",
      emptyResultInstruction: "同一轮连续 empty-result 达到3次时，立即停止本轮、切回首页，并提示执行链路异常，建议刷新后重试。",
      emptyInboxMinRescans: EXECUTOR_EMPTY_INBOX_MIN_RESCANS,
      noCandidateTimeoutMs: EXECUTOR_NO_CANDIDATE_TIMEOUT_MS,
      emptyInboxInstruction: "如果本轮没有 recommendedDecision=reply-now 的合格候选，先刷新/滚动重扫至少1轮；15秒内仍无候选，直接报告 no-auto-safe-candidate 和 pickDiagnostics，不要空转。",
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
    clearPreparedReplyComposer(normalizedTarget);
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
      clearPreparedReplyComposer(normalizedTarget);
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
      clearPreparedReplyComposer(targetUrl);
      return;
    }

    clearPreparedReplyComposer(targetUrl);
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
    if (Array.isArray(payload.stylePatternHits) && payload.stylePatternHits.length) {
      failure.stylePatternHits = payload.stylePatternHits.slice(0, 8);
    }
    if (payload.draftValidation && typeof payload.draftValidation === "object") {
      failure.draftValidation = payload.draftValidation;
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
    return Boolean(
      hasTrackedTweetUrl(state.repliedTweetUrls, normalized) ||
      hasTrackedTweetUrl(state.replyDetails, normalized)
    );
  }

  async function ensureTargetReplyContext(targetUrl, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const maxRetry = Math.max(0, Math.floor(Number(options.maxRetry) || 0));
    const retryDelayMs = Math.max(120, Number(options.retryDelayMs) || HANDOFF_RETRY_DELAY_MS);
    const timeoutMs = Math.max(
      retryDelayMs * Math.max(3, maxRetry + 2),
      Number(options.timeoutMs) || 2600
    );
    const startedAt = Date.now();
    let retryCount = 0;
    let navigated = false;

    while (Date.now() - startedAt <= timeoutMs) {
      const currentStatusUrl = getCurrentStatusUrl();
      const currentUrl = normalizeTweetUrl(currentStatusUrl || global.location.href);
      const targetArticle = currentUrl === normalizedTarget
        ? findPrimaryStatusArticle(normalizedTarget)
        : null;
      if (currentStatusUrl === normalizedTarget || targetArticle instanceof Element) {
        return {
          ok: true,
          ...buildReplyActionMeta({
            targetUrl: normalizedTarget,
            currentUrl: currentStatusUrl || currentUrl,
            contextSource: "status-page",
            retryCount,
            retried: retryCount > 0
          })
        };
      }

      if (!navigated && currentUrl !== normalizedTarget) {
        global.location.href = normalizedTarget;
        navigated = true;
      }

      await waitFor(retryDelayMs);
      retryCount += 1;
    }

    return buildReplyActionFailure({
      targetUrl: normalizedTarget,
      currentUrl: normalizeTweetUrl(getCurrentStatusUrl() || global.location.href),
      retryCount,
      retried: retryCount > 0 || navigated,
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

  function findReplyArticleByTarget(targetUrl, tweetId = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const normalizedTweetId = normalizeApiTweetId(tweetId || extractTweetIdFromUrl(normalizedTarget));
    const directMatch = normalizedTarget ? findReplyArticle(normalizedTarget) : null;
    if (directMatch instanceof Element) {
      return directMatch;
    }

    if (normalizedTweetId) {
      const idMatch = findTweetArticleByTweetId(normalizedTweetId, normalizedTarget);
      if (idMatch instanceof Element) {
        return idMatch;
      }
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
        expectedDraft &&
        editor instanceof HTMLElement &&
        context.composerLocked &&
        draftReady
      ) {
        const draftValidation = validateReplyDraftAgainstTarget(normalizedTarget, refreshedText);
        if (!draftValidation.ok) {
          return {
            ok: false,
            context,
            editor,
            sendButton,
            editorText: refreshedText,
            editorFound: true,
            sendButtonFound: sendButton instanceof HTMLElement,
            buttonDisabled: sendButton instanceof HTMLElement ? !isReplySubmitButtonEnabled(sendButton) : true,
            draftReady,
            composerLocked: true,
            pageLocked: Boolean(context.pageLocked),
            reason: draftValidation.reasonCode,
            reasonCode: draftValidation.reasonCode,
            stylePatternHits: Array.isArray(draftValidation.styleHits) ? draftValidation.styleHits.slice(0, 8) : [],
            draftValidation
          };
        }
      }
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
        mediaUrl: src,
        previewUrl: src,
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
        mediaUrl: src,
        previewUrl: poster || src,
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

  function resolveReplyContextArticle(node) {
    if (!(node instanceof Element)) {
      return null;
    }

    const directArticle = node.closest(ARTICLE_SELECTOR);
    if (directArticle instanceof Element) {
      return directArticle;
    }

    const container = getReplyComposerContainer(node);
    const candidates = [
      container,
      container?.querySelector(ARTICLE_SELECTOR),
      container?.closest(ARTICLE_SELECTOR),
      container?.previousElementSibling,
      container?.nextElementSibling,
      container?.parentElement?.previousElementSibling,
      container?.parentElement?.nextElementSibling
    ];

    for (const candidate of candidates) {
      if (!(candidate instanceof Element)) {
        continue;
      }
      if (candidate.matches(ARTICLE_SELECTOR)) {
        return candidate;
      }
      const nestedArticle = candidate.querySelector(ARTICLE_SELECTOR);
      if (nestedArticle instanceof Element) {
        return nestedArticle;
      }
    }

    return null;
  }

  function getVisibleReplySubmitButtons(scope = document) {
    const root = scope instanceof Element || scope instanceof Document ? scope : document;
    return Array.from(root.querySelectorAll('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]'))
      .filter((node) => node instanceof HTMLElement && hasVisibleRect(node));
  }

  function triggerReplyActionClick(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }

    const eventInit = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: global
    };

    try {
      node.dispatchEvent(new PointerEvent("pointerdown", {
        ...eventInit,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons: 1
      }));
      node.dispatchEvent(new MouseEvent("mousedown", {
        ...eventInit,
        button: 0,
        buttons: 1
      }));
      node.dispatchEvent(new PointerEvent("pointerup", {
        ...eventInit,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons: 0
      }));
      node.dispatchEvent(new MouseEvent("mouseup", {
        ...eventInit,
        button: 0,
        buttons: 0
      }));
      node.dispatchEvent(new MouseEvent("click", {
        ...eventInit,
        button: 0,
        buttons: 0
      }));
      return true;
    } catch {
      try {
        node.click();
        return true;
      } catch {
        return false;
      }
    }
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

  async function settleFailedTimelineUi() {
    const targetUrl = resolveReplyTargetUrl();
    const editor = queryReplyComposer({
      targetUrl,
      replyOnly: false,
      requireLocked: false
    });
    if (editor instanceof HTMLElement) {
      clearReplyComposerText(editor);
      await waitFor(120);
    }

    const dismissed = await dismissGenericComposerDialog();
    if (dismissed) {
      await waitFor(220);
    }

    if (isComposePostPath()) {
      try {
        global.history.back();
      } catch {}
      await waitFor(240);
    }

    if (isComposePostPath()) {
      try {
        global.location.assign("https://x.com/home");
      } catch {}
      await waitFor(240);
    }

    const path = String(global.location.pathname || "").toLowerCase();
    const onHomeSurface = (
      path === "/home" ||
      path.startsWith("/home/") ||
      path === "/" ||
      path.startsWith("/i/bookmarks") ||
      path.startsWith("/notifications")
    );
    if (!onHomeSurface) {
      try {
        global.location.assign("https://x.com/home");
      } catch {}
      await waitFor(240);
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
    const article = resolveReplyContextArticle(editor || explicitButton || scope || container)
      || (container instanceof Element ? container.querySelector(ARTICLE_SELECTOR) : null);
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
    const timelinePendingReplyEvidence = Boolean(
      !isComposePostPath() &&
      pendingTargetFresh &&
      !contextStatusUrl &&
      !articleUrl &&
      (hasReplyContextText || hasReplyButtonText)
    );
    const pageLocked = Boolean(
      targetUrl && (
        currentStatusUrl === targetUrl ||
        contextStatusUrl === targetUrl ||
        articleUrl === targetUrl
      )
    );
    const inlineStatusReplyEvidence = Boolean(
      !isComposePostPath() &&
      pendingTargetFresh &&
      pageLocked &&
      Boolean(editor || sendButton || container)
    );
    const timelinePendingTargetLocked = Boolean(
      timelinePendingReplyEvidence &&
      (
        contextHandleMatchesTarget ||
        contextHandles.length === 0 ||
        !targetHandle
      )
    );
    const explicitReplyEvidence = Boolean(
      contextStatusUrl ||
      articleUrl ||
      hasReplyButtonText ||
      hasReplyContextText ||
      inlineStatusReplyEvidence
    );
    const composerLocked = Boolean(
      targetUrl && (
        composePostTargetLocked ||
        timelinePendingTargetLocked ||
        inlineStatusReplyEvidence ||
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
      !inlineStatusReplyEvidence &&
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
      timelinePendingTargetLocked,
      inlineStatusReplyEvidence,
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

  function resolveReplyComposerEditableNode(node) {
    if (!(node instanceof HTMLElement)) {
      return null;
    }
    if (node.isContentEditable || String(node.getAttribute("contenteditable") || "").toLowerCase() === "true") {
      return node;
    }
    const nestedEditable = node.querySelector('[contenteditable="true"], div[contenteditable="true"], [data-contents="true"][contenteditable="true"]');
    return nestedEditable instanceof HTMLElement ? nestedEditable : node;
  }

  function queryReplyComposer(options = {}) {
    const targetUrl = normalizeTweetUrl(options.targetUrl || options.url || "");
    const replyOnly = Boolean(options.replyOnly);
    const requireLocked = Boolean(options.requireLocked);
    const selectors = [
      '[role="dialog"] [data-testid="tweetTextarea_0"] [contenteditable="true"]',
      '[role="dialog"] [data-testid="tweetTextarea_0"] div[contenteditable="true"]',
      '[data-testid="tweetTextarea_0"] [contenteditable="true"]',
      '[data-testid="tweetTextarea_0"] div[contenteditable="true"]',
      '[role="dialog"] div[contenteditable="true"][data-contents="true"]',
      '[data-testid="sheetDialog"] div[contenteditable="true"][data-contents="true"]',
      '[role="dialog"] [data-testid="tweetTextarea_0"][role="textbox"]',
      '[data-testid="sheetDialog"] [data-testid="tweetTextarea_0"][role="textbox"]',
      '[data-testid="tweetTextarea_0"][role="textbox"]'
    ];

    const seen = new Set();
    const candidates = selectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter((node) => {
        const editableNode = resolveReplyComposerEditableNode(node);
        if (!(editableNode instanceof HTMLElement) || seen.has(editableNode)) {
          return false;
        }
        seen.add(editableNode);
        return true;
      })
      .map((node) => {
        const editableNode = resolveReplyComposerEditableNode(node);
        return {
          node: editableNode,
          visible: hasVisibleRect(editableNode),
          context: buildReplyComposerContext({ targetUrl, editor: editableNode })
        };
      })
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

  function shouldRetryTimelineComposerOpen(context = {}, targetUrl = "") {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || isComposePostPath()) {
      return false;
    }
    const currentUrl = normalizeTweetUrl(context?.currentUrl || global.location.href);
    const articleUrl = normalizeTweetUrl(context?.articleUrl || "");
    const onTimelineSurface = (
      currentUrl === "https://x.com/home" ||
      /https:\/\/x\.com\/(?:home(?:\/)?|i\/bookmarks|notifications)/.test(currentUrl)
    );
    return Boolean(
      onTimelineSurface &&
      !context?.composerLocked &&
      !context?.pageLocked &&
      !context?.genericComposerOpened &&
      !context?.replyTargetLost &&
      !articleUrl
    );
  }

  async function retryTimelineComposerOpen(article, targetUrl = "", options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!(article instanceof Element) || !normalizedTarget) {
      return null;
    }

    const retryArticle = findReplyArticleByTarget(normalizedTarget, extractTweetIdFromUrl(normalizedTarget)) || article;
    if (!(retryArticle instanceof Element) || !hasVisibleRect(retryArticle)) {
      return null;
    }

    const retryReplyButton = queryPrimaryArticleActionNode(retryArticle, ["reply"]);
    if (!(retryReplyButton instanceof HTMLElement)) {
      return null;
    }

    retryArticle.scrollIntoView({ block: "center", behavior: "auto" });
    await waitFor(Math.max(180, Number(options.settleMs) || 220));
    triggerReplyActionClick(retryReplyButton);
    return waitForReplyComposer(normalizedTarget, {
      timeoutMs: Math.max(600, Number(options.timeoutMs) || EXECUTOR_TIMELINE_OPEN_TIMEOUT_MS),
      replyOnly: true,
      requireLocked: true
    });
  }

  function setReplyComposerText(editor, text) {
    const editable = resolveReplyComposerEditableNode(editor);
    const value = String(text || "").trim().slice(0, 560);
    if (!(editable instanceof HTMLElement) || !value) {
      return false;
    }

    editable.focus();

    try {
      const selection = global.getSelection?.();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editable);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch {
      // Ignore selection issues and fall through.
    }

    try {
      if (document.execCommand?.("insertText", false, value)) {
        return sanitizeSnippet(editable.textContent, 640) === sanitizeSnippet(value, 640);
      }
    } catch {
      // Fall through to the manual contenteditable update.
    }

    editable.replaceChildren();
    value.split(/\n/).forEach((line) => {
      const row = document.createElement("div");
      if (line) {
        row.textContent = line;
      } else {
        row.appendChild(document.createElement("br"));
      }
      editable.appendChild(row);
    });

    try {
      const selection = global.getSelection?.();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editable);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch {
      // Ignore caret placement issues.
    }

    try {
      editable.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: value
      }));
    } catch {
      editable.dispatchEvent(new Event("beforeinput", { bubbles: true, cancelable: true }));
    }
    try {
      editable.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: value
      }));
    } catch {
      editable.dispatchEvent(new Event("input", { bubbles: true }));
    }
    editable.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      key: value.slice(-1) || "Unidentified"
    }));
    editable.dispatchEvent(new KeyboardEvent("keyup", {
      bubbles: true,
      key: value.slice(-1) || "Unidentified"
    }));
    editable.dispatchEvent(new Event("change", { bubbles: true }));

    return readReplyComposerText(editable) === sanitizeSnippet(value, 640);
  }

  function clearReplyComposerText(editor) {
    const editable = resolveReplyComposerEditableNode(editor);
    if (!(editable instanceof HTMLElement)) {
      return false;
    }

    editable.focus();

    try {
      const selection = global.getSelection?.();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editable);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch {
      // Ignore selection issues and fall through.
    }

    try {
      if (document.execCommand?.("delete", false, "")) {
        return readReplyComposerText(editable) === "";
      }
    } catch {
      // Fall through to the manual contenteditable update.
    }

    editable.replaceChildren();
    editable.appendChild(document.createElement("br"));

    try {
      editable.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "deleteContentBackward",
        data: null
      }));
    } catch {
      editable.dispatchEvent(new Event("beforeinput", { bubbles: true, cancelable: true }));
    }
    try {
      editable.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        inputType: "deleteContentBackward",
        data: null
      }));
    } catch {
      editable.dispatchEvent(new Event("input", { bubbles: true }));
    }
    editable.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Backspace"
    }));
    editable.dispatchEvent(new KeyboardEvent("keyup", {
      bubbles: true,
      key: "Backspace"
    }));
    editable.dispatchEvent(new Event("change", { bubbles: true }));

    return readReplyComposerText(editable) === "";
  }

  function canAttemptTimelineReply(targetUrl = "", payload = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget || getCurrentStatusUrl() === normalizedTarget || isComposePostPath()) {
      return false;
    }
    if (payload?.preferDetailPage === true || payload?.timelineFirst === false || payload?.preferTimeline === false) {
      return false;
    }
    const path = String(global.location.pathname || "").toLowerCase();
    return path === "/home" || path.startsWith("/home/") || path === "/" || path.startsWith("/i/bookmarks") || path.startsWith("/notifications");
  }

  async function openTimelineComposerHandoff(targetUrl = "", payload = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (isComposePostPath()) {
      await settleFailedTimelineUi();
    }
    if (!canAttemptTimelineReply(normalizedTarget, payload)) {
      return null;
    }

    const targetTweetId = normalizeApiTweetId(payload?.tweetId || extractTweetIdFromUrl(normalizedTarget));
    const article = findReplyArticleByTarget(normalizedTarget, targetTweetId);
    if (!(article instanceof Element) || !hasVisibleRect(article)) {
      return buildReplyActionFailure({
        ...buildReplyPageContext(normalizedTarget, article),
        reason: "timeline-article-missing",
        reasonCode: "timeline-article-missing",
        timelineAttempted: true,
        timelineMode: "inline"
      });
    }

    const candidateRecord = { url: normalizedTarget };
    let runtimeState = null;
    try {
      runtimeState = await getApiRuntimeStateSnapshot();
      Object.assign(candidateRecord, getCandidateByUrlFromState(runtimeState, normalizedTarget) || getQueueItemByUrlFromState(runtimeState, normalizedTarget) || {});
    } catch {
      // Keep the visible article as the fallback context.
    }

    const tweetId = extractTweetIdFromUrl(normalizedTarget);
    const mediaSummary = getMediaSummaryFromState(runtimeState || {}, tweetId);
    const contextCompleteness = buildDraftContextCompleteness(candidateRecord, article, false, mediaSummary);
    if (!payload?.forceTimeline && !canUseTimelineInlineReply(contextCompleteness, article)) {
      return null;
    }

    const recheck = buildLiveCandidateRecheck(candidateRecord, article);
    if (recheck?.skipRecommended) {
      const belowExecutorSendFloor = Boolean(recheck.belowExecutorSendFloor);
      return buildReplyActionFailure({
        ...buildReplyPageContext(normalizedTarget, article),
        reason: belowExecutorSendFloor ? "score-below-agent-send-floor" : "score-degraded-below-average",
        reasonCode: belowExecutorSendFloor ? "value-below-send-floor" : "value-dropped-on-open",
        recheck,
        timelineAttempted: true,
        timelineMode: "inline"
      });
    }

    const replyButton = queryPrimaryArticleActionNode(article, ["reply"]);
    if (!(replyButton instanceof HTMLElement)) {
      return buildReplyActionFailure({
        ...buildReplyPageContext(normalizedTarget, article),
        reason: "reply-button-missing",
        reasonCode: "reply-button-missing",
        recheck,
        timelineAttempted: true,
        timelineMode: "inline"
      });
    }

    article.scrollIntoView({ block: "center", behavior: "auto" });
    await waitFor(120);
    state.pendingReplyTargetUrl = normalizedTarget;
    state.pendingReplyStartedAt = Date.now();
    state.pendingReplyMeta = buildReplyMetaFromArticle(article);
    triggerReplyActionClick(replyButton);

    let composerState = await waitForReplyComposer(normalizedTarget, {
      timeoutMs: EXECUTOR_TIMELINE_OPEN_TIMEOUT_MS,
      replyOnly: true,
      requireLocked: true
    });
    if (
      (!(composerState?.ok) || !(composerState.editor instanceof HTMLElement)) &&
      shouldRetryTimelineComposerOpen(composerState?.context, normalizedTarget)
    ) {
      const retriedComposerState = await retryTimelineComposerOpen(article, normalizedTarget, {
        timeoutMs: Math.floor(EXECUTOR_TIMELINE_OPEN_TIMEOUT_MS * 0.75),
        settleMs: 240
      });
      if (retriedComposerState) {
        composerState = retriedComposerState;
      }
    }
    const timelineEscapedToCompose = Boolean(
      composerState?.context?.currentUrl &&
      /\/compose\/post(?:$|[/?#])/.test(String(composerState.context.currentUrl))
    );
    if (!composerState?.ok || !(composerState.editor instanceof HTMLElement)) {
      return buildReplyActionFailure({
        ...buildReplyPageContext(normalizedTarget, article),
        ...buildReplyComposerFailurePayload(normalizedTarget, composerState?.context),
        reason: "composer-not-ready",
        reasonCode: "composer-not-ready",
        recheck,
        timelineAttempted: true,
        timelineMode: "inline"
      });
    }
    const draft = String(payload?.draft || "").trim().slice(0, 560);
    const draftLoaded = draft ? setReplyComposerText(composerState.editor, draft) : true;
    const readyState = await waitForReplySubmitReady(normalizedTarget, draft, {
      timeoutMs: EXECUTOR_TIMELINE_READY_TIMEOUT_MS,
      rewriteDraft: Boolean(draft)
    });
    if (!readyState?.ok) {
      return buildReplyActionFailure({
        ...buildReplyPageContext(normalizedTarget, article),
        ...buildReplyComposerFailurePayload(normalizedTarget, readyState?.context || composerState.context),
        reason: readyState?.reason || (readyState?.sendButtonFound ? "send-button-disabled-but-target-locked" : "composer-not-ready"),
        reasonCode: readyState?.reasonCode || (readyState?.sendButtonFound ? "send-button-disabled-but-target-locked" : "composer-not-ready"),
        recheck,
        draftLoaded,
        timelineAttempted: true,
        timelineMode: "inline",
        stylePatternHits: readyState?.stylePatternHits,
        draftValidation: readyState?.draftValidation,
        composerDiagnostics: {
          editorFound: Boolean(readyState?.editorFound),
          sendButtonFound: Boolean(readyState?.sendButtonFound),
          buttonDisabled: Boolean(readyState?.buttonDisabled),
          draftReady: Boolean(readyState?.draftReady),
          composerLocked: Boolean(readyState?.composerLocked)
        }
      });
    }

    cachePreparedReplyComposer({
      targetUrl: normalizedTarget,
      editor: readyState.editor || composerState.editor,
      sendButton: readyState.sendButton,
      mode: timelineEscapedToCompose ? "timeline-compose-overlay" : "timeline-inline",
      draftLoaded
    });

    return {
      ok: true,
      ...buildReplyActionMeta({
        ...buildReplyPageContext(normalizedTarget, article),
        reason: "timeline-composer-ready"
      }),
      href: normalizeTweetUrl(global.location.href),
      draftLoaded,
      composerReady: true,
      timelineAttempted: true,
      timelineMode: timelineEscapedToCompose ? "compose-overlay" : "inline",
      recheck,
      context: {
        composerLocked: Boolean(readyState.context?.composerLocked),
        pageLocked: Boolean(readyState.context?.pageLocked),
        currentUrl: readyState.context?.currentUrl || normalizeTweetUrl(global.location.href),
        articleUrl: readyState.context?.articleUrl || normalizedTarget
      }
    };
  }

  async function openQueueComposerHandoff(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload.url);
    const draft = String(payload.draft || "").trim().slice(0, 560);
    const timelineOnly = payload?.timelineFirst === true && payload?.preferDetailPage !== true && payload?.preferTimeline !== false;
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
    const timelineResult = await openTimelineComposerHandoff(targetUrl, payload);
    const timelineTimeoutFailure = checkReplyTargetDeadline(targetUrl, {
      ...payload,
      stage: "timeline-open-composer"
    });
    if (timelineTimeoutFailure) {
      return timelineTimeoutFailure;
    }
    if (timelineResult?.ok) {
      return timelineResult;
    }
    if (timelineResult?.timelineAttempted) {
      return timelineResult;
    }
    if (timelineOnly) {
      return buildReplyActionFailure({
        targetUrl,
        currentUrl: normalizeTweetUrl(global.location.href),
        reason: "timeline-inline-required",
        reasonCode: "timeline-inline-required",
        timelineAttempted: true,
        timelineMode: "inline"
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

    if (hasRecordedReply(targetUrl)) {
      const verificationEvidence = findReplyVerificationEvidence(targetUrl);
      if (verificationEvidence) {
        return buildReplyActionFailure({
          targetUrl,
          reason: "already-replied",
          reasonCode: "already-replied"
        });
      }
      await clearRecordedReply(targetUrl);
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

    article.scrollIntoView({ block: "center", behavior: "auto" });
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
      triggerReplyActionClick(replyButton);
      composerState = await waitForReplyComposer(targetUrl, {
        timeoutMs: EXECUTOR_DETAIL_COMPOSER_TIMEOUT_MS,
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
        const retryArticle = await waitForReplyArticle(targetUrl, EXECUTOR_DETAIL_READY_TIMEOUT_MS);
        const retryReplyButton = queryPrimaryArticleActionNode(retryArticle, ["reply"]);
        if (retryReplyButton instanceof HTMLElement) {
          triggerReplyActionClick(retryReplyButton);
          composerState = await waitForReplyComposer(targetUrl, {
            timeoutMs: EXECUTOR_DETAIL_COMPOSER_TIMEOUT_MS,
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
      ? await waitForReplySubmitReady(targetUrl, draft, { timeoutMs: EXECUTOR_DETAIL_READY_TIMEOUT_MS })
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
        reason: submitReadyState?.reason || "send-disabled",
        reasonCode: submitReadyState?.reasonCode || (submitReadyState?.context?.composerLocked ? "send-button-disabled-but-target-locked" : "context-not-locked"),
        stylePatternHits: submitReadyState?.stylePatternHits,
        draftValidation: submitReadyState?.draftValidation,
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

    cachePreparedReplyComposer({
      targetUrl,
      editor,
      sendButton: submitReadyState?.sendButton,
      mode: "detail-page",
      draftLoaded
    });
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

  async function clearRecordedReply(targetUrl, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return false;
    }

    delete state.repliedTweets[normalizedTarget];
    state.repliedTweetUrls.delete(normalizedTarget);
    if (state.replyDetails?.[normalizedTarget]) {
      delete state.replyDetails[normalizedTarget];
    }
    renderFloatingWidget();
    invalidateCache();
    scheduleScan();

    if (options.propagate !== false) {
      await sendRuntimeMessage({
        type: "X_REPLY_SCORER_UNMARK_REPLIED",
        url: normalizedTarget
      });
    }
    return true;
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

      const verificationEvidence = findReplyVerificationEvidence(targetUrl);
      if (includesAny(outcomeText, SUCCESS_TEXTS) || verificationEvidence) {
        clearPendingReplyOutcome();
        finalizeVerifiedReply(targetUrl, {
          outcomeText,
          verificationSource: includesAny(outcomeText, SUCCESS_TEXTS) ? "toast" : String(verificationEvidence?.detectionSource || "page-evidence"),
          verificationEvidence
        }).catch(() => null);
        return;
      }

      if (Date.now() - startedAt > 8000) {
        clearPendingReplyOutcome();
        state.pendingReplyMeta = null;
      }
    }, 400);
  }

  function findReplyVerificationEvidence(targetUrl) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return null;
    }

    if (getCurrentStatusUrl() === normalizedTarget) {
      const ownReplyArticle = findOwnReplyArticleOnStatusPage(normalizedTarget);
      if (ownReplyArticle instanceof Element) {
        return {
          detectionSource: "status-page-own-reply",
          replyArticle: ownReplyArticle,
          targetArticle: findTweetArticleByTweetId(extractTweetIdFromUrl(normalizedTarget), normalizedTarget)
        };
      }
    }

    return null;
  }

  async function recordVerifiedReply(targetUrl, verificationEvidence = null) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return false;
    }

    if (verificationEvidence?.replyArticle instanceof Element) {
      const meta = buildManualReplyDetectionMeta(
        normalizedTarget,
        verificationEvidence.replyArticle,
        verificationEvidence.detectionSource,
        verificationEvidence.targetArticle || null
      );
      clearPendingReplyOutcome();
      state.pendingReplyMeta = null;
      if (meta) {
        await markTweetAsReplied(normalizedTarget, meta);
        return true;
      }
    }

    await markReplyAsVerified(normalizedTarget);
    return true;
  }

  async function settleSuccessfulReplyUi(targetUrl) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const editor = queryReplyComposer({
      targetUrl: normalizedTarget,
      replyOnly: false,
      requireLocked: false
    });
    if (editor instanceof HTMLElement) {
      clearReplyComposerText(editor);
      await waitFor(120);
    }

    const dismissed = await dismissGenericComposerDialog();
    if (dismissed) {
      await waitFor(220);
    }

    if (isComposePostPath()) {
      try {
        global.history.back();
      } catch {}
      await waitFor(240);
    }

    if (isComposePostPath()) {
      try {
        global.location.assign("https://x.com/home");
      } catch {}
      await waitFor(240);
    }

    return {
      dismissed,
      currentUrl: normalizeTweetUrl(global.location.href)
    };
  }

  async function finalizeVerifiedReply(targetUrl, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const replyMeta = options.replyMeta || state.pendingReplyMeta;
    const verificationEvidence = options.verificationEvidence || findReplyVerificationEvidence(normalizedTarget);
    await recordVerifiedReply(normalizedTarget, verificationEvidence);
    const likeResult = await tryAutoLikeReplyTarget(normalizedTarget, options.likeOptions || options, replyMeta);
    await settleSuccessfulReplyUi(normalizedTarget);
    return {
      ok: true,
      verified: true,
      outcomeText: String(options.outcomeText || readOutcomeText() || "").trim(),
      href: global.location.href,
      ...buildReplyActionMeta(buildReplyPageContext(normalizedTarget)),
      ...likeResult,
      verificationSource: String(options.verificationSource || verificationEvidence?.detectionSource || "toast").trim()
    };
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

    article.scrollIntoView({ block: "center", behavior: "auto" });
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

  async function captureReplyPerformanceSnapshot(payload = {}) {
    const targetUrl = normalizeTweetUrl(payload.url || payload.targetUrl);
    const replyDetail = targetUrl ? (state.replyDetails?.[targetUrl] || null) : null;
    const archiveMatch = targetUrl
      ? (Array.isArray(state.replyArchive) ? state.replyArchive : []).find((entry) => normalizeTweetUrl(entry?.targetUrl || entry?.url) === targetUrl) || null
      : null;
    const replyUrl = normalizeTweetUrl(payload.replyUrl || replyDetail?.replyUrl || archiveMatch?.replyUrl);
    const replyTweetId = normalizeApiTweetId(
      payload.replyTweetId ||
      replyDetail?.replyTweetId ||
      archiveMatch?.replyTweetId ||
      extractTweetIdFromUrl(replyUrl)
    );

    if (!replyUrl && !replyTweetId) {
      return buildReplyActionFailure({
        targetUrl: targetUrl || replyUrl,
        currentUrl: normalizeTweetUrl(global.location.href),
        reason: "missing-reply-reference",
        reasonCode: "reply-target-lost"
      });
    }

    const bridgeSnapshot = replyTweetId ? getTrafficSnapshotByTweetId(replyTweetId) : null;
    if (bridgeSnapshot) {
      return {
        ok: true,
        ...buildReplyActionMeta({
          targetUrl: replyUrl || bridgeSnapshot.url || targetUrl,
          currentUrl: normalizeTweetUrl(global.location.href),
          articleUrl: normalizeTweetUrl(bridgeSnapshot.url || replyUrl || ""),
          contextSource: "traffic-bridge"
        }),
        snapshot: {
          capturedAt: Number(bridgeSnapshot.trafficCapturedAt || Date.now()),
          replyUrl: normalizeTweetUrl(bridgeSnapshot.url || replyUrl),
          replyTweetId: normalizeApiTweetId(bridgeSnapshot.tweetId || replyTweetId),
          replies: Number(bridgeSnapshot.replies || 0),
          likes: Number(bridgeSnapshot.likes || 0),
          views: Number(bridgeSnapshot.views || 0),
          source: String(bridgeSnapshot.trafficSource || "traffic-bridge").trim(),
          replyTrafficSource: String(bridgeSnapshot.trafficSource || "traffic-bridge").trim()
        }
      };
    }

    if (!replyUrl) {
      return buildReplyActionFailure({
        targetUrl: targetUrl || "",
        currentUrl: normalizeTweetUrl(global.location.href),
        reason: "missing-reply-reference",
        reasonCode: "reply-target-lost"
      });
    }

    const contextTargetUrl = replyUrl;
    const contextLock = await ensureTargetReplyContext(contextTargetUrl, { maxRetry: 1 });
    if (!contextLock.ok) {
      return contextLock;
    }

    const article = await waitForReplyArticle(contextTargetUrl, 12000);
    if (!(article instanceof Element)) {
      return buildReplyActionFailure({
        targetUrl: contextTargetUrl,
        currentUrl: contextLock.currentUrl,
        retryCount: contextLock.retryCount,
        retried: contextLock.retried,
        reason: "tweet-not-ready",
        contextSource: contextLock.contextSource
      });
    }

    article.scrollIntoView({ block: "center", behavior: "auto" });
    await waitFor(220);
    const meta = buildReplyMetaFromArticle(article) || {};
    const pageContext = buildReplyPageContext(contextTargetUrl, article);
    if (
      pageContext.contextSource !== "status-page" &&
      pageContext.articleDetectedUrl &&
      pageContext.articleDetectedUrl !== contextTargetUrl
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
        replyUrl: normalizeTweetUrl(readTweetUrl(article) || contextTargetUrl),
        replyTweetId: normalizeApiTweetId(replyTweetId || extractTweetIdFromUrl(readTweetUrl(article) || contextTargetUrl)),
        replies: Number(meta.replies || 0),
        likes: Number(meta.likes || 0),
        views: Number(meta.views || 0),
        source: "reply-dom",
        replyTrafficSource: "reply-dom"
      }
    };
  }

  async function waitForApiReplyOutcome(targetUrl, timeoutMs = EXECUTOR_POST_SEND_VERIFY_TIMEOUT_MS, options = {}) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    const startedAt = Date.now();
    const replyMeta = state.pendingReplyMeta;

    while (Date.now() - startedAt <= timeoutMs) {
      const outcomeText = readOutcomeText();
      if (includesAny(outcomeText, FAILURE_TEXTS)) {
        await settleFailedTimelineUi();
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
        return finalizeVerifiedReply(normalizedTarget, {
          outcomeText,
          replyMeta,
          likeOptions: options,
          verificationSource: "toast"
        });
      }

      const verificationEvidence = findReplyVerificationEvidence(normalizedTarget);
      if (verificationEvidence) {
        return finalizeVerifiedReply(normalizedTarget, {
          outcomeText,
          replyMeta,
          likeOptions: options,
          verificationSource: verificationEvidence.detectionSource,
          verificationEvidence
        });
      }

      await waitFor(240);
    }

    const verificationEvidence = findReplyVerificationEvidence(normalizedTarget);
    if (verificationEvidence) {
      return finalizeVerifiedReply(normalizedTarget, {
        outcomeText: readOutcomeText(),
        replyMeta,
        likeOptions: options,
        verificationSource: verificationEvidence.detectionSource,
        verificationEvidence
      });
    }

    await settleFailedTimelineUi();
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

  function capturePendingReplyTarget(targetUrl, meta = null) {
    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (!normalizedTarget) {
      return "";
    }

    const previousTarget = normalizeTweetUrl(state.pendingReplyTargetUrl);
    state.pendingReplyTargetUrl = normalizedTarget;
    state.pendingReplyStartedAt = Date.now();
    if (meta && typeof meta === "object") {
      state.pendingReplyMeta = meta;
    } else if (previousTarget && previousTarget !== normalizedTarget) {
      state.pendingReplyMeta = null;
    }
    return normalizedTarget;
  }

  function capturePendingReplyFromArticle(article) {
    if (!(article instanceof Element)) {
      return "";
    }
    return capturePendingReplyTarget(readTweetUrl(article), buildReplyMetaFromArticle(article));
  }

  function capturePendingReplyFromComposerContext(node) {
    const article = resolveReplyContextArticle(node);
    if (article instanceof Element) {
      return capturePendingReplyFromArticle(article);
    }

    return capturePendingReplyTarget(getContextStatusUrl() || getCurrentStatusUrl());
  }

  function findReplyHotkeySourceArticle(target) {
    if (target instanceof Element) {
      const directArticle = target.closest(ARTICLE_SELECTOR);
      if (directArticle instanceof Element) {
        return directArticle;
      }
    }

    if (document.activeElement instanceof Element) {
      const activeArticle = document.activeElement.closest(ARTICLE_SELECTOR);
      if (activeArticle instanceof Element) {
        return activeArticle;
      }
    }

    return document.querySelector(`${ARTICLE_SELECTOR}:focus-within`);
  }

  function beginManualReplyOutcomeMonitor(sendButton) {
    if (!(sendButton instanceof HTMLElement)) {
      return false;
    }

    capturePendingReplyFromComposerContext(sendButton);
    const targetUrl = resolveReplyTargetUrl();
    if (!targetUrl || !isReplyComposer(sendButton, targetUrl)) {
      return false;
    }

    const normalizedTarget = normalizeTweetUrl(targetUrl);
    if (
      state.apiSubmitInFlightTargetUrl &&
      normalizedTarget === state.apiSubmitInFlightTargetUrl
    ) {
      return false;
    }
    if (state.pendingReplyOutcomeUrl === normalizedTarget) {
      return true;
    }

    state.pendingReplyTargetUrl = "";
    state.pendingReplyStartedAt = 0;
    monitorReplyOutcome(normalizedTarget);
    return true;
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
        capturePendingReplyFromArticle(article);
        return;
      }

      const sendButton = target.closest('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]');
      beginManualReplyOutcomeMonitor(sendButton);
    }, true);

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || isEditableKeyboardTarget(target)) {
        return;
      }

      const key = String(event.key || "").toLowerCase();
      const hasModifier = event.metaKey || event.ctrlKey || event.altKey;
      if (!hasModifier && !event.shiftKey && key === "r") {
        capturePendingReplyFromArticle(findReplyHotkeySourceArticle(target));
        return;
      }

      if (hasModifier || (key !== "enter" && key !== " " && key !== "spacebar")) {
        return;
      }

      const sendButton = target.closest('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]');
      beginManualReplyOutcomeMonitor(sendButton);
    }, true);
  }

  async function bootstrap() {
    ensureStyle();
    bindReplyDropTrafficBridge();
    bindReplyDropApiBridge();
    state.lastDomChangeAt = Date.now();
    await loadSettings();
    teardownFloatingUi();
    bindRuntimeListener();
    bindReplyTracking();
    startObserver();
    scheduleScan();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})(globalThis);
