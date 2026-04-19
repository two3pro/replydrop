if (typeof importScripts === "function") {
  try {
    importScripts("replydrop-pickup-core.js", "replydrop-workflow-core.js", "replydrop-attribution-core.js");
  } catch (_error) {
    // Ignore local core loading failures in non-extension runtimes.
  }
}

const PickupCore = globalThis.ReplyDropPickupCore || null;
const WorkflowCore = globalThis.ReplyDropWorkflowCore || null;
const AttributionCore = globalThis.ReplyDropAttributionCore || null;

const STORAGE_KEY = "x-reply-scorer-state";
const MAX_REPLIED_TWEETS = 500;
const MAX_RECENT_CANDIDATES = 12;
const MAX_REPLY_DETAILS = 60;
const MAX_DISMISSED_TWEETS = 120;
const MAX_RELATIONSHIP_STATES = 120;
const MAX_REPLY_QUEUE = 80;
const MAX_PUBLISH_WATCH = 40;
const MAX_PICKUP_WATCH = 60;
const MIDNIGHT_ALARM_NAME = "replydrop-midnight-reset";
const TAB_BROADCAST_TIMEOUT_MS = 400;
const QUEUE_STATUS_SET = new Set(["queued", "completed", "shipped"]);
const PICKUP_STATUS_SET = new Set(["pending", "quiet", "picked-up", "author-engaged"]);
const API_TWEET_ID_PATTERN = /^\d+$/;
const FIRST_PICKUP_REVIEW_DELAY_MS = clampNumber(PickupCore?.FIRST_PICKUP_REVIEW_DELAY_MS, 45 * 60 * 1000);
const QUIET_PICKUP_REVIEW_DELAY_MS = clampNumber(PickupCore?.QUIET_PICKUP_REVIEW_DELAY_MS, 3 * 60 * 60 * 1000);
const ACTIVE_PICKUP_REVIEW_DELAY_MS = clampNumber(PickupCore?.ACTIVE_PICKUP_REVIEW_DELAY_MS, 6 * 60 * 60 * 1000);
const SETTLE_PICKUP_AFTER_MS = clampNumber(PickupCore?.SETTLE_PICKUP_AFTER_MS, 24 * 60 * 60 * 1000);

const TOPIC_DEFS = [
  { enabledKey: "aiEnabled", keywordsKey: "aiKeywords", defaults: ["ai", "chatgpt", "claude", "gemini", "seedance", "即梦", "生成ai", "llm", "agi", "copilot", "grok", "perplexity"] },
  { enabledKey: "cryptoEnabled", keywordsKey: "cryptoKeywords", defaults: ["crypto", "bitcoin", "btc", "eth", "bnb", "defi", "nft", "web3", "blockchain", "altcoin", "memecoin", "on-chain"] },
  { enabledKey: "modelEnabled", keywordsKey: "modelKeywords", defaults: ["gpt-4", "gpt-5", "o3", "o4", "claude 3", "claude 4", "gemini", "llama", "mistral", "qwen", "deepseek", "grok", "flux", "midjourney", "sora", "kling", "wan", "hunyuanvideo", "seedance"] },
  { enabledKey: "creatorEnabled", keywordsKey: "creatorKeywords", defaults: ["creator", "youtube", "youtuber", "streamer", "streaming", "shorts", "reels", "tiktok", "viral", "audience", "subscriber", "monetization", "ugc", "content strategy"] },
  { enabledKey: "gamingEnabled", keywordsKey: "gamingKeywords", defaults: ["game", "gaming", "gamer", "steam", "nintendo", "playstation", "xbox", "switch 2", "esports", "speedrun", "gacha", "minecraft", "roblox", "hoyoverse", "gta"] },
  { enabledKey: "businessEnabled", keywordsKey: "businessKeywords", defaults: ["startup", "founder", "saas", "growth", "revenue", "profit", "fundraising", "vc", "product market fit", "ecommerce", "marketing", "earnings"] },
  { enabledKey: "financeEnabled", keywordsKey: "financeKeywords", defaults: ["stocks", "nasdaq", "s&p 500", "dow jones", "treasury", "fed", "ipo", "market cap", "bond", "inflation", "rate cut", "yield"] },
  { enabledKey: "politicsEnabled", keywordsKey: "politicsKeywords", defaults: ["election", "vote", "congress", "senate", "white house", "president", "policy", "parliament", "campaign", "tariff", "cabinet", "diplomacy"] },
  { enabledKey: "sportsEnabled", keywordsKey: "sportsKeywords", defaults: ["nba", "nfl", "mlb", "f1", "ufc", "olympics", "football", "soccer", "tennis", "goal", "championship", "playoffs"] },
  { enabledKey: "entertainmentEnabled", keywordsKey: "entertainmentKeywords", defaults: ["celebrity", "idol", "concert", "music", "album", "drama", "variety show", "tour", "fandom", "trailer", "box office", "tv series"] },
  { enabledKey: "filmEnabled", keywordsKey: "filmKeywords", defaults: ["movie", "cinema", "director", "screenplay", "scene", "letterboxd", "criterion", "festival", "documentary", "actor", "actress", "shot"] },
  { enabledKey: "fashionEnabled", keywordsKey: "fashionKeywords", defaults: ["fashion", "runway", "lookbook", "outfit", "designer", "vogue", "styling", "streetwear", "beauty", "makeup", "skincare", "luxury"] },
  { enabledKey: "travelEnabled", keywordsKey: "travelKeywords", defaults: ["travel", "trip", "flight", "hotel", "itinerary", "beach", "mountain", "resort", "tourism", "citywalk", "backpacking", "destination"] },
  { enabledKey: "booksEnabled", keywordsKey: "booksKeywords", defaults: ["book", "novel", "poem", "essay", "literature", "author", "reading", "bookstore", "quote", "translation", "fiction", "memoir"] }
];

const DEFAULT_STATE = {
  enabled: true,
  scannedCount: 0,
  highScoreCount: 0,
  visibleCount: 0,
  uiLanguage: "zh-Hans",
  posterUrl: "",
  threshold: 30,
  onlyKeywordHits: false,
  langZh: true,
  langEn: true,
  langJa: true,
  langKo: true,
  langFr: false,
  langEs: false,
  langDe: false,
  langIt: false,
  langPt: false,
  langRu: false,
  langAr: false,
  repliedTweets: {},
  dismissedTweets: {},
  replyDetails: {},
  recentCandidates: [],
  relationshipStates: {},
  replyQueue: [],
  publishWatch: [],
  pickupWatch: []
};

TOPIC_DEFS.forEach((topic, index) => {
  DEFAULT_STATE[topic.enabledKey] = index < 3;
  DEFAULT_STATE[topic.keywordsKey] = topic.defaults;
});

const BOOLEAN_KEYS = [
  "enabled",
  "onlyKeywordHits",
  "langZh",
  "langEn",
  "langJa",
  "langKo",
  "langFr",
  "langEs",
  "langDe",
  "langIt",
  "langPt",
  "langRu",
  "langAr",
  ...TOPIC_DEFS.map((topic) => topic.enabledKey)
];

const KEYWORD_KEYS = TOPIC_DEFS.map((topic) => topic.keywordsKey);

let state = { ...DEFAULT_STATE };

function getStartOfLocalDay(timestamp = Date.now()) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getTodayReplyCount(repliedTweets, timestamp = Date.now()) {
  const dayStart = getStartOfLocalDay(timestamp);
  return Object.values(repliedTweets || {}).reduce((count, value) => {
    const replyTimestamp = clampNumber(value, 0);
    return replyTimestamp >= dayStart ? count + 1 : count;
  }, 0);
}

function getPublicState() {
  return {
    ...state,
    todayReplyCount: getTodayReplyCount(state.repliedTweets)
  };
}

function getNextLocalMidnight() {
  const next = new Date();
  next.setHours(24, 0, 1, 0);
  return next.getTime();
}

async function scheduleMidnightAlarm() {
  try {
    await chrome.alarms.clear(MIDNIGHT_ALARM_NAME);
    await chrome.alarms.create(MIDNIGHT_ALARM_NAME, { when: getNextLocalMidnight() });
  } catch {
    // Ignore if alarms are temporarily unavailable.
  }
}

function clampNumber(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return n;
}

function normalizeQueueStatus(value, fallback = "queued") {
  if (typeof WorkflowCore?.normalizeQueueStatus === "function") {
    return WorkflowCore.normalizeQueueStatus(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return QUEUE_STATUS_SET.has(raw) ? raw : fallback;
}

function normalizePickupStatus(value, fallback = "pending") {
  if (typeof PickupCore?.normalizePickupStatus === "function") {
    return PickupCore.normalizePickupStatus(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return ["pending", "quiet", "picked-up", "author-engaged"].includes(raw) ? raw : fallback;
}

function normalizePickupReviewStage(value, fallback = "first-check") {
  if (typeof PickupCore?.normalizePickupReviewStage === "function") {
    return PickupCore.normalizePickupReviewStage(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return ["first-check", "follow-up", "settled"].includes(raw) ? raw : fallback;
}

function buildPickupReviewPlan(config = {}) {
  if (typeof PickupCore?.buildPickupReviewPlan === "function") {
    return PickupCore.buildPickupReviewPlan(config);
  }

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
  if (typeof PickupCore?.buildFreshPickupReviewState === "function") {
    return PickupCore.buildFreshPickupReviewState(config);
  }

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

function compareReplyQueueItems(left, right) {
  if (typeof WorkflowCore?.compareReplyQueueItems === "function") {
    return WorkflowCore.compareReplyQueueItems(left, right);
  }
  const leftStatus = normalizeQueueStatus(left?.status);
  const rightStatus = normalizeQueueStatus(right?.status);
  const leftClosed = leftStatus !== "queued";
  const rightClosed = rightStatus !== "queued";

  if (leftClosed !== rightClosed) {
    return Number(leftClosed) - Number(rightClosed);
  }

  if (!leftClosed) {
    return (
      clampNumber(left?.scheduledFor, 0) - clampNumber(right?.scheduledFor, 0) ||
      clampNumber(right?.score, 0) - clampNumber(left?.score, 0) ||
      clampNumber(right?.createdAt, 0) - clampNumber(left?.createdAt, 0)
    );
  }

  return (
    clampNumber(right?.completedAt, 0) - clampNumber(left?.completedAt, 0) ||
    clampNumber(right?.createdAt, 0) - clampNumber(left?.createdAt, 0)
  );
}

function normalizePublishWatchStatus(value, fallback = "composer-ready") {
  if (typeof WorkflowCore?.normalizePublishWatchStatus === "function") {
    return WorkflowCore.normalizePublishWatchStatus(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return ["composer-ready", "post-opened", "cooldown", "failed", "snoozed"].includes(raw) ? raw : fallback;
}

function normalizeUiLanguage(value, fallback = DEFAULT_STATE.uiLanguage) {
  const raw = String(value || "").trim();
  if (raw === "zh") {
    return "zh-Hans";
  }
  if (raw === "zh-Hans" || raw === "zh-Hant" || raw === "en" || raw === "ja" || raw === "ko") {
    return raw;
  }
  return fallback;
}

function normalizePosterUrl(value, fallback = DEFAULT_STATE.posterUrl) {
  const raw = String(value ?? fallback ?? "").trim();
  return raw.slice(0, 4096);
}

function normalizeKeywordList(value, fallback) {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|,/)
      : fallback;

  return Array.from(new Set(
    (Array.isArray(source) ? source : fallback)
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  ));
}

function normalizeTweetUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url, "https://x.com");
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

function normalizeApiTweetId(tweetId) {
  const raw = String(tweetId ?? "").trim();
  return API_TWEET_ID_PATTERN.test(raw) ? raw : "";
}

function extractTweetIdFromUrl(url) {
  const normalized = normalizeTweetUrl(url);
  const match = normalized.match(/\/status\/(\d+)(?:$|[/?#])/);
  return match?.[1] || "";
}

function mapQueueStatusToApi(status) {
  const normalized = normalizeQueueStatus(status);
  if (normalized === "queued") {
    return "pending";
  }
  if (normalized === "completed") {
    return "done";
  }
  return "shipped";
}

function getCandidateLaneDescriptor(candidate = {}, uiLanguage = DEFAULT_STATE.uiLanguage) {
  const score = clampNumber(candidate?.score, 0);
  const replies = clampNumber(candidate?.replies, 0);
  const views = clampNumber(candidate?.views, 0);
  const timestamp = clampNumber(candidate?.timestamp, Date.now());
  const ageMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  const crowded = replies >= 180 || (views >= 180000 && replies >= 90);
  const language = normalizeUiLanguage(uiLanguage);
  const laneLabels = {
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
  let priority = 2;
  if (crowded && score < 82) {
    key = "crowded";
    priority = 1;
  } else if (score >= 72 && ageMinutes <= 240) {
    key = "now";
    priority = 4;
  } else if (score >= 58 && ageMinutes <= 720) {
    key = "watch";
    priority = 3;
  }

  return {
    key,
    priority,
    label: laneLabels[language]?.[key] || laneLabels.en[key]
  };
}

function getLaneDefaultQueueSlot(candidate = {}, uiLanguage = DEFAULT_STATE.uiLanguage) {
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

function buildReplyEntriesForAttribution() {
  return Object.entries(state.replyDetails || {}).map(([url, detail]) => ({
    url,
    ...(detail && typeof detail === "object" ? detail : {})
  }));
}

function summarizeApiCandidate(candidate = {}) {
  const url = normalizeTweetUrl(candidate.url);
  const textSummary = String(candidate.text || "").trim().slice(0, 220);
  return {
    tweetId: extractTweetIdFromUrl(url),
    score: clampNumber(candidate.score, 0),
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
    addedAt: clampNumber(item.createdAt, 0),
    url,
    slot: String(item.slot || "next").trim() || "next",
    scheduledFor: clampNumber(item.scheduledFor, 0),
    author: String(item.authorHandle || "").trim(),
    authorHandle: String(item.authorHandle || "").trim(),
    score: clampNumber(item.score, 0),
    draft: String(item.draft || "").trim().slice(0, 560)
  };
}

function cloneApiValue(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function resolveTweetUrlById(tweetId) {
  const normalizedTweetId = normalizeApiTweetId(tweetId);
  if (!normalizedTweetId) {
    return "";
  }

  const candidates = [
    ...(state.recentCandidates || []).map((item) => item?.url),
    ...(state.replyQueue || []).map((item) => item?.url),
    ...(state.publishWatch || []).map((item) => item?.url),
    ...(state.pickupWatch || []).map((item) => item?.url),
    ...Object.keys(state.replyDetails || {}),
    ...Object.keys(state.repliedTweets || {}),
    ...Object.keys(state.dismissedTweets || {})
  ];

  return candidates
    .map((url) => normalizeTweetUrl(url))
    .find((url) => extractTweetIdFromUrl(url) === normalizedTweetId) || "";
}

function getCandidateByTweetId(tweetId) {
  const normalizedTweetId = normalizeApiTweetId(tweetId);
  if (!normalizedTweetId) {
    return null;
  }

  return (state.recentCandidates || []).find((item) => extractTweetIdFromUrl(item?.url) === normalizedTweetId) || null;
}

function getQueueItemByTweetId(tweetId) {
  const normalizedTweetId = normalizeApiTweetId(tweetId);
  if (!normalizedTweetId) {
    return null;
  }

  return (state.replyQueue || []).find((item) => extractTweetIdFromUrl(item?.url) === normalizedTweetId) || null;
}

function resolveDefaultQueueSlot(candidate = null) {
  if (!candidate) {
    return "next";
  }

  const laneDefault = getLaneDefaultQueueSlot(candidate, state.uiLanguage);
  if (
    typeof AttributionCore?.buildAttributionSignalModel !== "function" ||
    typeof AttributionCore?.summarizeCandidateAttribution !== "function" ||
    typeof AttributionCore?.getDefaultQueueSlot !== "function"
  ) {
    return laneDefault;
  }

  const attributionModel = AttributionCore.buildAttributionSignalModel(
    buildReplyEntriesForAttribution(),
    state.replyQueue || [],
    state.recentCandidates || [],
    { now: Date.now() }
  );
  const attributionSignal = AttributionCore.summarizeCandidateAttribution(candidate, attributionModel);
  return AttributionCore.getDefaultQueueSlot(laneDefault, attributionSignal);
}

async function addCandidateToQueueByTweetId(tweetId) {
  const normalizedTweetId = normalizeApiTweetId(tweetId);
  if (!normalizedTweetId) {
    throw new Error("invalid-tweet-id");
  }

  const candidate = getCandidateByTweetId(normalizedTweetId);
  if (!candidate?.url) {
    throw new Error("candidate-not-found");
  }

  const existing = getQueueItemByTweetId(normalizedTweetId);
  const slot = resolveDefaultQueueSlot(candidate);
  const nextItem = {
    url: candidate.url,
    authorHandle: candidate.authorHandle || existing?.authorHandle || "",
    text: candidate.text || existing?.text || "",
    score: clampNumber(candidate.score, clampNumber(existing?.score, 0)),
    createdAt: clampNumber(existing?.createdAt, Date.now()),
    scheduledFor: getScheduledTimestamp(slot),
    completedAt: 0,
    slot,
    draft: String(existing?.draft || "").trim().slice(0, 560),
    lane: getCandidateLaneDescriptor(candidate, state.uiLanguage).label,
    keywordMatched: Boolean(candidate.keywordMatched || existing?.keywordMatched),
    matchedTopics: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
    matchedLanguages: Array.isArray(candidate.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4) : [],
    highlights: Array.isArray(candidate.highlights) ? candidate.highlights.slice(0, 4) : [],
    status: "queued"
  };

  const nextQueue = normalizeReplyQueue(
    [nextItem, ...(state.replyQueue || []).filter((item) => item?.url !== candidate.url)],
    state.replyQueue
  );
  const nextPublishWatch = normalizePublishWatch(
    (state.publishWatch || []).filter((item) => item?.url !== candidate.url),
    state.publishWatch
  );

  await patchState({
    replyQueue: nextQueue,
    publishWatch: nextPublishWatch
  }, "api-queue");

  return summarizeApiQueueItem(nextQueue.find((item) => item.url === candidate.url) || nextItem);
}

async function markTweetAsShippedById(tweetId, replyText = "") {
  const normalizedTweetId = normalizeApiTweetId(tweetId);
  if (!normalizedTweetId) {
    throw new Error("invalid-tweet-id");
  }

  const url = resolveTweetUrlById(normalizedTweetId);
  if (!url) {
    throw new Error("tweet-not-found");
  }

  const queueItem = getQueueItemByTweetId(normalizedTweetId);
  const candidate = getCandidateByTweetId(normalizedTweetId);
  const finalReplyText = String(replyText || queueItem?.draft || queueItem?.text || candidate?.text || "").trim().slice(0, 560);

  await markTweetAsReplied(url, {
    score: clampNumber(queueItem?.score, clampNumber(candidate?.score, 0)),
    tier: "replied",
    authorHandle: String(queueItem?.authorHandle || candidate?.authorHandle || "").trim(),
    authorVerified: Boolean(candidate?.authorVerified),
    text: finalReplyText,
    lane: String(queueItem?.lane || "").trim(),
    slot: String(queueItem?.slot || resolveDefaultQueueSlot(candidate)).trim(),
    keywordMatched: Boolean(queueItem?.keywordMatched || candidate?.keywordMatched),
    matchedTopics: Array.isArray(queueItem?.matchedTopics) && queueItem.matchedTopics.length ? queueItem.matchedTopics.slice(0, 4) : (candidate?.matchedTopics || []).slice(0, 4),
    matchedLanguages: Array.isArray(queueItem?.matchedLanguages) && queueItem.matchedLanguages.length ? queueItem.matchedLanguages.slice(0, 4) : (candidate?.matchedLanguages || []).slice(0, 4),
    highlights: Array.isArray(queueItem?.highlights) && queueItem.highlights.length ? queueItem.highlights.slice(0, 4) : (candidate?.highlights || []).slice(0, 4),
    publishMode: queueItem ? "queue" : "manual"
  });

  return {
    tweetId: normalizedTweetId,
    status: "shipped",
    url,
    replyText: finalReplyText
  };
}

async function skipCandidateByTweetId(tweetId) {
  const normalizedTweetId = normalizeApiTweetId(tweetId);
  if (!normalizedTweetId) {
    throw new Error("invalid-tweet-id");
  }

  const candidate = getCandidateByTweetId(normalizedTweetId);
  if (!candidate?.url) {
    throw new Error("candidate-not-found");
  }

  const skippedAt = Date.now();
  await patchState({
    dismissedTweets: {
      ...(state.dismissedTweets || {}),
      [candidate.url]: skippedAt
    }
  }, "api-skip");

  return {
    tweetId: normalizedTweetId,
    skippedAt,
    url: candidate.url
  };
}

function isAllowedApiSender(sender) {
  const senderUrl = String(sender?.url || sender?.tab?.url || "").trim();
  if (!senderUrl) {
    return false;
  }

  try {
    return new URL(senderUrl).hostname === "x.com";
  } catch {
    return false;
  }
}

async function handleReplyDropApiCall(message, sender) {
  if (!isAllowedApiSender(sender)) {
    throw new Error("x-domain-only");
  }

  const method = String(message?.method || "").trim();
  const args = Array.isArray(message?.args) ? message.args : [];

  switch (method) {
    case "getCandidates":
      return (state.recentCandidates || [])
        .map((item) => summarizeApiCandidate(item))
        .filter((item) => item.tweetId);
    case "getQueue":
      return (state.replyQueue || [])
        .map((item) => summarizeApiQueueItem(item))
        .filter((item) => item.tweetId);
    case "getState":
      return cloneApiValue(getPublicState());
    case "addToQueue":
      return addCandidateToQueueByTweetId(args[0]);
    case "markShipped":
      return markTweetAsShippedById(args[0], args[1]);
    case "skipCandidate":
      return skipCandidateByTweetId(args[0]);
    default:
      throw new Error("unknown-api-method");
  }
}

function normalizeHandleKey(handle) {
  return String(handle || "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .slice(0, 64);
}

function normalizeRepliedTweets(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  const entries = Object.entries(source)
    .map(([url, timestamp]) => [normalizeTweetUrl(url), clampNumber(timestamp, Date.now())])
    .filter(([url]) => Boolean(url))
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_REPLIED_TWEETS);

  return Object.fromEntries(entries);
}

function normalizeDismissedTweets(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  const entries = Object.entries(source)
    .map(([url, timestamp]) => [normalizeTweetUrl(url), clampNumber(timestamp, Date.now())])
    .filter(([url]) => Boolean(url))
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_DISMISSED_TWEETS);

  return Object.fromEntries(entries);
}

function normalizeRecentCandidates(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;
  return source
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      url: normalizeTweetUrl(item.url),
      score: Math.max(0, Math.min(100, Math.floor(clampNumber(item.score, 0)))),
      tier: String(item.tier || "hidden"),
      authorHandle: String(item.authorHandle || "").trim(),
      authorVerified: Boolean(item.authorVerified),
      text: String(item.text || "").trim().slice(0, 280),
      timestamp: clampNumber(item.timestamp, Date.now()),
      mediaKind: String(item.mediaKind || "").trim(),
      likes: clampNumber(item.likes, 0),
      replies: clampNumber(item.replies, 0),
      views: clampNumber(item.views, 0),
      keywordMatched: Boolean(item.keywordMatched),
      matchedTopics: Array.isArray(item.matchedTopics) ? item.matchedTopics.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
      matchedLanguages: Array.isArray(item.matchedLanguages) ? item.matchedLanguages.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
      highlights: Array.isArray(item.highlights) ? item.highlights.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : []
    }))
    .filter((item) => item.url && item.tier !== "hidden")
    .sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
    .slice(0, MAX_RECENT_CANDIDATES);
}

function normalizeReplyDetails(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  const entries = Object.entries(source)
    .map(([url, detail]) => {
      const normalizedUrl = normalizeTweetUrl(url);
      const payload = detail && typeof detail === "object" ? detail : {};
      const pickupCheckedAt = clampNumber(payload.pickupCheckedAt, 0);
      const pickupChecks = Math.max(0, Math.floor(clampNumber(payload.pickupChecks, 0)));
      const pickupStatus = normalizePickupStatus(payload.pickupStatus, pickupCheckedAt ? "quiet" : "pending");
      const pickupReviewPlan = buildPickupReviewPlan({
        shippedAt: clampNumber(payload.timestamp, Date.now()),
        checkedAt: pickupCheckedAt,
        checks: pickupChecks,
        status: pickupStatus,
        reviewStage: payload.pickupReviewStage,
        nextReviewAt: payload.pickupNextReviewAt,
        settledAt: payload.pickupSettledAt
      });
      return [normalizedUrl, {
        timestamp: clampNumber(payload.timestamp, Date.now()),
        score: Math.max(0, Math.min(100, Math.floor(clampNumber(payload.score, 0)))),
        tier: String(payload.tier || "replied"),
        authorHandle: String(payload.authorHandle || "").trim(),
        authorVerified: Boolean(payload.authorVerified),
        text: String(payload.text || "").trim().slice(0, 280),
        lane: String(payload.lane || "").trim().slice(0, 48),
        slot: String(payload.slot || "").trim().slice(0, 24),
        keywordMatched: Boolean(payload.keywordMatched),
        matchedTopics: Array.isArray(payload.matchedTopics) ? payload.matchedTopics.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        matchedLanguages: Array.isArray(payload.matchedLanguages) ? payload.matchedLanguages.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        highlights: Array.isArray(payload.highlights) ? payload.highlights.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        publishMode: String(payload.publishMode || "").trim().slice(0, 32),
        queuedAt: clampNumber(payload.queuedAt, 0),
        handedOffAt: clampNumber(payload.handedOffAt, 0),
        executionLatencyMs: clampNumber(payload.executionLatencyMs, 0),
        baselineReplies: clampNumber(payload.baselineReplies, 0),
        baselineLikes: clampNumber(payload.baselineLikes, 0),
        baselineViews: clampNumber(payload.baselineViews, 0),
        pickupStatus,
        pickupCheckedAt,
        pickupChecks,
        pickupReplies: clampNumber(payload.pickupReplies, 0),
        pickupLikes: clampNumber(payload.pickupLikes, 0),
        pickupViews: clampNumber(payload.pickupViews, 0),
        pickupDeltaReplies: clampNumber(payload.pickupDeltaReplies, 0),
        pickupDeltaLikes: clampNumber(payload.pickupDeltaLikes, 0),
        pickupDeltaViews: clampNumber(payload.pickupDeltaViews, 0),
        pickupReviewStage: pickupReviewPlan.reviewStage,
        pickupNextReviewAt: pickupReviewPlan.nextReviewAt,
        pickupSettledAt: pickupReviewPlan.settledAt,
        pickupAuthorEngaged: Boolean(payload.pickupAuthorEngaged),
        pickupAuthorReplyUrl: normalizeTweetUrl(payload.pickupAuthorReplyUrl)
      }];
    })
    .filter(([url]) => Boolean(url))
    .sort((a, b) => b[1].timestamp - a[1].timestamp)
    .slice(0, MAX_REPLY_DETAILS);

  return Object.fromEntries(entries);
}

function normalizeReplyQueue(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;
  const entries = source
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const status = normalizeQueueStatus(item.status);
      return {
        url: normalizeTweetUrl(item.url),
        authorHandle: String(item.authorHandle || "").trim().slice(0, 64),
        text: String(item.text || "").trim().slice(0, 320),
        score: Math.max(0, Math.min(100, Math.floor(clampNumber(item.score, 0)))),
        createdAt: clampNumber(item.createdAt, Date.now()),
        scheduledFor: clampNumber(item.scheduledFor, Date.now()),
        completedAt: status === "queued" ? 0 : clampNumber(item.completedAt, Date.now()),
        slot: String(item.slot || "next").trim(),
        draft: String(item.draft || "").trim().slice(0, 560),
        lane: String(item.lane || "").trim().slice(0, 48),
        keywordMatched: Boolean(item.keywordMatched),
        matchedTopics: Array.isArray(item.matchedTopics) ? item.matchedTopics.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        matchedLanguages: Array.isArray(item.matchedLanguages) ? item.matchedLanguages.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        highlights: Array.isArray(item.highlights) ? item.highlights.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        status
      };
    })
    .filter((item) => Boolean(item.url))
    .sort(compareReplyQueueItems)
    .slice(0, MAX_REPLY_QUEUE);

  const deduped = [];
  const seen = new Set();
  for (const item of entries) {
    if (seen.has(item.url)) {
      continue;
    }
    seen.add(item.url);
    deduped.push(item);
  }
  return deduped;
}

function normalizePublishWatch(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;
  const entries = source
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const normalizedItem = typeof WorkflowCore?.sanitizePublishWatchState === "function"
        ? WorkflowCore.sanitizePublishWatchState(item)
        : item;
      return {
        url: normalizeTweetUrl(normalizedItem.url),
        authorHandle: String(normalizedItem.authorHandle || "").trim().slice(0, 64),
        slot: String(normalizedItem.slot || "next").trim().slice(0, 24),
        lane: String(normalizedItem.lane || "").trim().slice(0, 48),
        draft: String(normalizedItem.draft || "").trim().slice(0, 560),
        createdAt: clampNumber(normalizedItem.createdAt, Date.now()),
        handedOffAt: clampNumber(normalizedItem.handedOffAt, Date.now()),
        lastAttemptAt: clampNumber(normalizedItem.lastAttemptAt, Date.now()),
        scheduledFor: clampNumber(normalizedItem.scheduledFor, 0),
        draftLoaded: Boolean(normalizedItem.draftLoaded),
        clipboardReady: Boolean(normalizedItem.clipboardReady),
        source: String(normalizedItem.source || "queue").trim().slice(0, 24),
        status: normalizePublishWatchStatus(normalizedItem.status, "composer-ready"),
        attempts: Math.max(1, Math.floor(clampNumber(normalizedItem.attempts, 1))),
        snoozeUntil: clampNumber(normalizedItem.snoozeUntil, 0),
        cooldownUntil: clampNumber(normalizedItem.cooldownUntil, 0)
      };
    })
    .filter((item) => Boolean(item.url))
    .sort((a, b) => b.handedOffAt - a.handedOffAt)
    .slice(0, MAX_PUBLISH_WATCH);

  const deduped = [];
  const seen = new Set();
  for (const item of entries) {
    if (seen.has(item.url)) {
      continue;
    }
    seen.add(item.url);
    deduped.push(item);
  }
  return deduped;
}

function normalizePickupWatch(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;
  const entries = source
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const checks = Math.max(0, Math.floor(clampNumber(item.checks, 0)));
      const status = normalizePickupStatus(item.status, checks ? "quiet" : "pending");
      const reviewPlan = buildPickupReviewPlan({
        shippedAt: clampNumber(item.shippedAt, Date.now()),
        checkedAt: clampNumber(item.lastCheckedAt, 0),
        checks,
        status,
        reviewStage: item.reviewStage,
        nextReviewAt: item.nextReviewAt,
        settledAt: item.settledAt
      });
      return {
        url: normalizeTweetUrl(item.url),
        authorHandle: String(item.authorHandle || "").trim().slice(0, 64),
        slot: String(item.slot || "next").trim().slice(0, 24),
        lane: String(item.lane || "").trim().slice(0, 48),
        score: Math.max(0, Math.min(100, Math.floor(clampNumber(item.score, 0)))),
        shippedAt: clampNumber(item.shippedAt, Date.now()),
        baselineReplies: clampNumber(item.baselineReplies, 0),
        baselineLikes: clampNumber(item.baselineLikes, 0),
        baselineViews: clampNumber(item.baselineViews, 0),
        lastCheckedAt: clampNumber(item.lastCheckedAt, 0),
        checks,
        status,
        pickupReplies: clampNumber(item.pickupReplies, 0),
        pickupLikes: clampNumber(item.pickupLikes, 0),
        pickupViews: clampNumber(item.pickupViews, 0),
        deltaReplies: clampNumber(item.deltaReplies, 0),
        deltaLikes: clampNumber(item.deltaLikes, 0),
        deltaViews: clampNumber(item.deltaViews, 0),
        reviewStage: reviewPlan.reviewStage,
        nextReviewAt: reviewPlan.nextReviewAt,
        settledAt: reviewPlan.settledAt,
        authorEngaged: Boolean(item.authorEngaged),
        authorReplyUrl: normalizeTweetUrl(item.authorReplyUrl),
        source: String(item.source || "reply").trim().slice(0, 24)
      };
    })
    .filter((item) => Boolean(item.url))
    .sort((a, b) => (
      (b.lastCheckedAt || b.shippedAt || 0) - (a.lastCheckedAt || a.shippedAt || 0)
    ))
    .slice(0, MAX_PICKUP_WATCH);

  const deduped = [];
  const seen = new Set();
  for (const item of entries) {
    if (seen.has(item.url)) {
      continue;
    }
    seen.add(item.url);
    deduped.push(item);
  }
  return deduped;
}

function normalizeRelationshipStates(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  const now = Date.now();
  const allowedStatuses = new Set(["pinned", "follow-up", "snoozed"]);
  const entries = Object.entries(source)
    .map(([handle, detail]) => {
      const normalizedHandle = normalizeHandleKey(handle);
      const payload = detail && typeof detail === "object" ? detail : {};
      const status = String(payload.status || "").trim();
      if (!normalizedHandle || !allowedStatuses.has(status)) {
        return null;
      }
      const snoozeUntil = clampNumber(payload.snoozeUntil, 0);
      if (status === "snoozed" && snoozeUntil && snoozeUntil <= now) {
        return null;
      }
      return [normalizedHandle, {
        status,
        updatedAt: clampNumber(payload.updatedAt, now),
        snoozeUntil: status === "snoozed" ? snoozeUntil : 0
      }];
    })
    .filter(Boolean)
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
    .slice(0, MAX_RELATIONSHIP_STATES);

  return Object.fromEntries(entries);
}

function normalizeState(partial = {}) {
  const repliedTweets = normalizeRepliedTweets(partial.repliedTweets, state.repliedTweets ?? DEFAULT_STATE.repliedTweets);
  const dismissedTweets = normalizeDismissedTweets(partial.dismissedTweets, state.dismissedTweets ?? DEFAULT_STATE.dismissedTweets);
  const recentCandidates = normalizeRecentCandidates(partial.recentCandidates, state.recentCandidates ?? DEFAULT_STATE.recentCandidates);
  const next = {
    ...DEFAULT_STATE,
    scannedCount: Math.max(0, Math.floor(clampNumber(partial.scannedCount, state.scannedCount ?? 0))),
    highScoreCount: Math.max(0, Math.floor(clampNumber(partial.highScoreCount, state.highScoreCount ?? 0))),
    visibleCount: Math.max(0, Math.floor(clampNumber(partial.visibleCount, state.visibleCount ?? 0))),
    uiLanguage: normalizeUiLanguage(partial.uiLanguage, state.uiLanguage ?? DEFAULT_STATE.uiLanguage),
    posterUrl: normalizePosterUrl(partial.posterUrl, state.posterUrl ?? DEFAULT_STATE.posterUrl),
    threshold: Math.min(100, Math.max(0, Math.floor(clampNumber(partial.threshold, state.threshold ?? DEFAULT_STATE.threshold)))),
    repliedTweets,
    dismissedTweets,
    replyDetails: normalizeReplyDetails(partial.replyDetails, state.replyDetails ?? DEFAULT_STATE.replyDetails),
    recentCandidates,
    relationshipStates: normalizeRelationshipStates(partial.relationshipStates, state.relationshipStates ?? DEFAULT_STATE.relationshipStates),
    replyQueue: normalizeReplyQueue(partial.replyQueue, state.replyQueue ?? DEFAULT_STATE.replyQueue),
    publishWatch: normalizePublishWatch(partial.publishWatch, state.publishWatch ?? DEFAULT_STATE.publishWatch),
    pickupWatch: normalizePickupWatch(partial.pickupWatch, state.pickupWatch ?? DEFAULT_STATE.pickupWatch)
  };

  BOOLEAN_KEYS.forEach((key) => {
    next[key] = Boolean(partial[key] ?? state[key] ?? DEFAULT_STATE[key]);
  });

  KEYWORD_KEYS.forEach((key) => {
    next[key] = normalizeKeywordList(partial[key], state[key] ?? DEFAULT_STATE[key]);
  });

  const filteredCandidates = next.recentCandidates.filter((item) => !next.repliedTweets[item.url] && !next.dismissedTweets[item.url]);
  const removedCandidates = next.recentCandidates.length - filteredCandidates.length;
  const removedHighScoreCandidates = next.recentCandidates.filter((item) => (
    (next.repliedTweets[item.url] || next.dismissedTweets[item.url]) &&
    (item.tier === "high" || item.tier === "good")
  )).length;

  next.recentCandidates = filteredCandidates;
  if (removedCandidates > 0) {
    next.visibleCount = Math.max(0, next.visibleCount - removedCandidates);
  }
  if (removedHighScoreCandidates > 0) {
    next.highScoreCount = Math.max(0, next.highScoreCount - removedHighScoreCandidates);
  }

  return next;
}

function updateBadge() {
  const todayReplyCount = getTodayReplyCount(state.repliedTweets);
  chrome.action.setBadgeBackgroundColor({ color: "#2563eb" });
  chrome.action.setBadgeText({ text: todayReplyCount > 0 ? String(todayReplyCount) : "" });
}

async function sendStateToTabs(payload) {
  try {
    const tabs = await chrome.tabs.query({
      url: [
        "https://x.com/*",
        "https://twitter.com/*"
      ]
    });

    await Promise.all(tabs.map((tab) => new Promise((resolve) => {
      if (!tab?.id) {
        resolve();
        return;
      }

      let settled = false;
      const finish = () => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeoutId);
        resolve();
      };
      const timeoutId = setTimeout(finish, TAB_BROADCAST_TIMEOUT_MS);

      try {
        chrome.tabs.sendMessage(tab.id, payload, () => {
          void chrome.runtime.lastError;
          finish();
        });
      } catch {
        finish();
      }
    })));
  } catch {
    // Ignore when there are no matching tabs or the worker is cold-starting.
  }
}

async function broadcastState(reason = "settings") {
  const payload = {
    type: "X_REPLY_SCORER_STATE_CHANGED",
    reason,
    state: getPublicState()
  };

  try {
    chrome.runtime.sendMessage(payload, () => void chrome.runtime.lastError);
  } catch {
    // Ignore when popup/content is not listening.
  }

  await sendStateToTabs(payload);
}

async function persistState() {
  await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

async function setState(nextState, reason = "settings", persist = true) {
  state = normalizeState(nextState);
  updateBadge();
  if (persist) {
    await persistState();
  }
  await broadcastState(reason);
  return state;
}

async function patchState(patch, reason = "settings", persist = true) {
  return setState({ ...state, ...patch }, reason, persist);
}

async function loadState() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  state = stored[STORAGE_KEY] ? normalizeState(stored[STORAGE_KEY]) : { ...DEFAULT_STATE };
  updateBadge();
  await scheduleMidnightAlarm();
}

async function markTweetAsReplied(url, meta = {}) {
  const normalized = normalizeTweetUrl(url);
  if (!normalized) {
    return state;
  }

  const nextDismissedTweets = { ...state.dismissedTweets };
  delete nextDismissedTweets[normalized];
  const replyTimestamp = Date.now();
  const queueMatch = (state.replyQueue || []).find((item) => item?.url === normalized) || null;
  const candidateMatch = (state.recentCandidates || []).find((item) => item?.url === normalized) || null;
  const publishWatchMatch = (state.publishWatch || []).find((item) => item?.url === normalized) || null;
  const pickupWatchMatch = (state.pickupWatch || []).find((item) => item?.url === normalized) || null;
  const replyDetailMatch = state.replyDetails?.[normalized] || null;
  const baselineReplies = clampNumber(
    meta.baselineReplies,
    clampNumber(meta.replies, clampNumber(pickupWatchMatch?.baselineReplies, clampNumber(replyDetailMatch?.baselineReplies, clampNumber(candidateMatch?.replies, 0))))
  );
  const baselineLikes = clampNumber(
    meta.baselineLikes,
    clampNumber(meta.likes, clampNumber(pickupWatchMatch?.baselineLikes, clampNumber(replyDetailMatch?.baselineLikes, clampNumber(candidateMatch?.likes, 0))))
  );
  const baselineViews = clampNumber(
    meta.baselineViews,
    clampNumber(meta.views, clampNumber(pickupWatchMatch?.baselineViews, clampNumber(replyDetailMatch?.baselineViews, clampNumber(candidateMatch?.views, 0))))
  );
  const freshPickupReviewState = buildFreshPickupReviewState({ shippedAt: replyTimestamp });
  const nextReplyQueue = normalizeReplyQueue(
    (state.replyQueue || []).map((item) => (
      item?.url === normalized
        ? {
            ...item,
            status: "shipped",
            completedAt: replyTimestamp
          }
        : item
    )),
    state.replyQueue
  );

  const nextPublishWatch = normalizePublishWatch((state.publishWatch || []).filter((item) => item?.url !== normalized), state.publishWatch);
  const nextPickupWatch = normalizePickupWatch([
    {
      ...pickupWatchMatch,
      url: normalized,
      authorHandle: String(meta.authorHandle || queueMatch?.authorHandle || candidateMatch?.authorHandle || pickupWatchMatch?.authorHandle || "").trim(),
      slot: String(meta.slot || queueMatch?.slot || pickupWatchMatch?.slot || "next").trim(),
      lane: String(meta.lane || queueMatch?.lane || pickupWatchMatch?.lane || "").trim(),
      score: clampNumber(meta.score, clampNumber(queueMatch?.score, clampNumber(candidateMatch?.score, clampNumber(pickupWatchMatch?.score, 0)))),
      shippedAt: replyTimestamp,
      baselineReplies,
      baselineLikes,
      baselineViews,
      lastCheckedAt: freshPickupReviewState.checkedAt,
      checks: freshPickupReviewState.checks,
      status: freshPickupReviewState.status,
      pickupReplies: 0,
      pickupLikes: 0,
      pickupViews: 0,
      deltaReplies: 0,
      deltaLikes: 0,
      deltaViews: 0,
      reviewStage: freshPickupReviewState.reviewStage,
      nextReviewAt: freshPickupReviewState.nextReviewAt,
      settledAt: freshPickupReviewState.settledAt,
      authorEngaged: false,
      authorReplyUrl: "",
      source: String(pickupWatchMatch?.source || "reply").trim()
    },
    ...(state.pickupWatch || []).filter((item) => item?.url !== normalized)
  ], state.pickupWatch);

  return patchState({
    repliedTweets: {
      ...state.repliedTweets,
      [normalized]: replyTimestamp
    },
    dismissedTweets: nextDismissedTweets,
    replyDetails: {
      ...state.replyDetails,
      [normalized]: {
        timestamp: replyTimestamp,
        score: clampNumber(meta.score, clampNumber(queueMatch?.score, clampNumber(candidateMatch?.score, 0))),
        tier: String(meta.tier || "replied"),
        authorHandle: String(meta.authorHandle || queueMatch?.authorHandle || candidateMatch?.authorHandle || "").trim(),
        authorVerified: Boolean(meta.authorVerified || candidateMatch?.authorVerified),
        text: String(meta.text || queueMatch?.text || queueMatch?.draft || candidateMatch?.text || "").trim().slice(0, 280),
        lane: String(meta.lane || queueMatch?.lane || "").trim().slice(0, 48),
        slot: String(meta.slot || queueMatch?.slot || "").trim().slice(0, 24),
        keywordMatched: Boolean(meta.keywordMatched || queueMatch?.keywordMatched || candidateMatch?.keywordMatched),
        matchedTopics: Array.isArray(meta.matchedTopics) && meta.matchedTopics.length
          ? meta.matchedTopics
          : (Array.isArray(queueMatch?.matchedTopics) && queueMatch.matchedTopics.length ? queueMatch.matchedTopics : candidateMatch?.matchedTopics || []),
        matchedLanguages: Array.isArray(meta.matchedLanguages) && meta.matchedLanguages.length
          ? meta.matchedLanguages
          : (Array.isArray(queueMatch?.matchedLanguages) && queueMatch.matchedLanguages.length ? queueMatch.matchedLanguages : candidateMatch?.matchedLanguages || []),
        highlights: Array.isArray(meta.highlights) && meta.highlights.length
          ? meta.highlights
          : (Array.isArray(queueMatch?.highlights) && queueMatch.highlights.length ? queueMatch.highlights : candidateMatch?.highlights || []),
        publishMode: String(meta.publishMode || publishWatchMatch?.status || (queueMatch ? "queue" : "manual")).trim().slice(0, 32),
        queuedAt: clampNumber(meta.queuedAt, clampNumber(queueMatch?.createdAt, 0)),
        handedOffAt: clampNumber(meta.handedOffAt, clampNumber(publishWatchMatch?.handedOffAt, 0)),
        executionLatencyMs: clampNumber(meta.executionLatencyMs, Math.max(0, replyTimestamp - clampNumber(publishWatchMatch?.handedOffAt, replyTimestamp))),
        baselineReplies,
        baselineLikes,
        baselineViews,
        pickupStatus: freshPickupReviewState.status,
        pickupCheckedAt: freshPickupReviewState.checkedAt,
        pickupChecks: freshPickupReviewState.checks,
        pickupReplies: 0,
        pickupLikes: 0,
        pickupViews: 0,
        pickupDeltaReplies: 0,
        pickupDeltaLikes: 0,
        pickupDeltaViews: 0,
        pickupReviewStage: freshPickupReviewState.reviewStage,
        pickupNextReviewAt: freshPickupReviewState.nextReviewAt,
        pickupSettledAt: freshPickupReviewState.settledAt,
        pickupAuthorEngaged: false,
        pickupAuthorReplyUrl: ""
      }
    },
    replyQueue: nextReplyQueue,
    publishWatch: nextPublishWatch,
    pickupWatch: nextPickupWatch
  }, "reply-marked");
}

function resolvePickupSnapshotStatus(snapshot = {}) {
  if (typeof PickupCore?.resolvePickupSnapshotStatus === "function") {
    return PickupCore.resolvePickupSnapshotStatus(snapshot);
  }
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

async function recordPickupSnapshot(url, snapshot = {}) {
  const normalized = normalizeTweetUrl(url);
  if (!normalized) {
    return state;
  }

  const replyDetailMatch = state.replyDetails?.[normalized] || null;
  const pickupWatchMatch = (state.pickupWatch || []).find((item) => item?.url === normalized) || null;
  const checkedAt = clampNumber(snapshot.capturedAt, Date.now());
  const baselineReplies = clampNumber(snapshot.baselineReplies, clampNumber(pickupWatchMatch?.baselineReplies, clampNumber(replyDetailMatch?.baselineReplies, 0)));
  const baselineLikes = clampNumber(snapshot.baselineLikes, clampNumber(pickupWatchMatch?.baselineLikes, clampNumber(replyDetailMatch?.baselineLikes, 0)));
  const baselineViews = clampNumber(snapshot.baselineViews, clampNumber(pickupWatchMatch?.baselineViews, clampNumber(replyDetailMatch?.baselineViews, 0)));
  const pickupReplies = clampNumber(snapshot.replies, baselineReplies);
  const pickupLikes = clampNumber(snapshot.likes, baselineLikes);
  const pickupViews = clampNumber(snapshot.views, baselineViews);
  const deltaReplies = Math.max(0, pickupReplies - baselineReplies);
  const deltaLikes = Math.max(0, pickupLikes - baselineLikes);
  const deltaViews = Math.max(0, pickupViews - baselineViews);
  const pickupStatus = resolvePickupSnapshotStatus({
    ...snapshot,
    deltaReplies,
    deltaLikes,
    deltaViews
  });
  const pickupChecks = Math.max(0, Math.floor(clampNumber(pickupWatchMatch?.checks, clampNumber(replyDetailMatch?.pickupChecks, 0)))) + 1;
  const authorHandle = String(snapshot.authorHandle || pickupWatchMatch?.authorHandle || replyDetailMatch?.authorHandle || "").trim();
  const lane = String(snapshot.lane || pickupWatchMatch?.lane || replyDetailMatch?.lane || "").trim();
  const slot = String(snapshot.slot || pickupWatchMatch?.slot || replyDetailMatch?.slot || "next").trim();
  const score = clampNumber(snapshot.score, clampNumber(pickupWatchMatch?.score, clampNumber(replyDetailMatch?.score, 0)));
  const authorReplyUrl = normalizeTweetUrl(snapshot.authorReplyUrl || pickupWatchMatch?.authorReplyUrl || replyDetailMatch?.pickupAuthorReplyUrl);
  const shippedAt = clampNumber(pickupWatchMatch?.shippedAt, clampNumber(replyDetailMatch?.timestamp, checkedAt));
  const pickupReviewPlan = buildPickupReviewPlan({
    shippedAt,
    checkedAt,
    checks: pickupChecks,
    status: pickupStatus,
    reviewStage: pickupWatchMatch?.reviewStage || replyDetailMatch?.pickupReviewStage,
    nextReviewAt: pickupWatchMatch?.nextReviewAt || replyDetailMatch?.pickupNextReviewAt,
    settledAt: pickupWatchMatch?.settledAt || replyDetailMatch?.pickupSettledAt
  });
  const nextPickupWatch = normalizePickupWatch([
    {
      ...pickupWatchMatch,
      url: normalized,
      authorHandle,
      slot,
      lane,
      score,
      shippedAt,
      baselineReplies,
      baselineLikes,
      baselineViews,
      lastCheckedAt: checkedAt,
      checks: pickupChecks,
      status: pickupStatus,
      pickupReplies,
      pickupLikes,
      pickupViews,
      deltaReplies,
      deltaLikes,
      deltaViews,
      reviewStage: pickupReviewPlan.reviewStage,
      nextReviewAt: pickupReviewPlan.nextReviewAt,
      settledAt: pickupReviewPlan.settledAt,
      authorEngaged: Boolean(snapshot.authorEngaged || authorReplyUrl),
      authorReplyUrl,
      source: String(pickupWatchMatch?.source || "reply").trim()
    },
    ...(state.pickupWatch || []).filter((item) => item?.url !== normalized)
  ], state.pickupWatch);

  return patchState({
    replyDetails: {
      ...state.replyDetails,
      [normalized]: {
        ...(replyDetailMatch || {}),
        timestamp: clampNumber(replyDetailMatch?.timestamp, checkedAt),
        score: clampNumber(replyDetailMatch?.score, score),
        tier: String(replyDetailMatch?.tier || "replied"),
        authorHandle: String(replyDetailMatch?.authorHandle || authorHandle).trim(),
        authorVerified: Boolean(replyDetailMatch?.authorVerified),
        text: String(replyDetailMatch?.text || "").trim().slice(0, 280),
        lane: String(replyDetailMatch?.lane || lane).trim().slice(0, 48),
        slot: String(replyDetailMatch?.slot || slot).trim().slice(0, 24),
        keywordMatched: Boolean(replyDetailMatch?.keywordMatched),
        matchedTopics: Array.isArray(replyDetailMatch?.matchedTopics) ? replyDetailMatch.matchedTopics : [],
        matchedLanguages: Array.isArray(replyDetailMatch?.matchedLanguages) ? replyDetailMatch.matchedLanguages : [],
        highlights: Array.isArray(replyDetailMatch?.highlights) ? replyDetailMatch.highlights : [],
        publishMode: String(replyDetailMatch?.publishMode || "").trim().slice(0, 32),
        queuedAt: clampNumber(replyDetailMatch?.queuedAt, 0),
        handedOffAt: clampNumber(replyDetailMatch?.handedOffAt, 0),
        executionLatencyMs: clampNumber(replyDetailMatch?.executionLatencyMs, 0),
        baselineReplies,
        baselineLikes,
        baselineViews,
        pickupStatus,
        pickupCheckedAt: checkedAt,
        pickupChecks,
        pickupReplies,
        pickupLikes,
        pickupViews,
        pickupDeltaReplies: deltaReplies,
        pickupDeltaLikes: deltaLikes,
        pickupDeltaViews: deltaViews,
        pickupReviewStage: pickupReviewPlan.reviewStage,
        pickupNextReviewAt: pickupReviewPlan.nextReviewAt,
        pickupSettledAt: pickupReviewPlan.settledAt,
        pickupAuthorEngaged: Boolean(snapshot.authorEngaged || authorReplyUrl),
        pickupAuthorReplyUrl: authorReplyUrl
      }
    },
    pickupWatch: nextPickupWatch
  }, "pickup-recorded");
}

chrome.runtime.onInstalled.addListener(() => {
  loadState().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  loadState().catch(() => {});
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm?.name !== MIDNIGHT_ALARM_NAME) {
    return;
  }

  updateBadge();
  broadcastState("day-reset").catch(() => {});
  scheduleMidnightAlarm().catch(() => {});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) {
    return;
  }

  if (message.type === "X_REPLY_SCORER_GET_STATE") {
    sendResponse({ state: getPublicState() });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_UPDATE_STATE") {
    patchState(message.patch || {}, "settings").then(() => {
      sendResponse({ state: getPublicState() });
    }).catch((error) => {
      sendResponse({ error: String(error?.message || error) });
    });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_STATS_UPDATE") {
    setState({
      ...state,
      scannedCount: Math.max(0, Math.floor(clampNumber(message.scannedCount, state.scannedCount))),
      highScoreCount: Math.max(0, Math.floor(clampNumber(message.highScoreCount, state.highScoreCount))),
      visibleCount: Math.max(0, Math.floor(clampNumber(message.visibleCount, state.visibleCount))),
      recentCandidates: normalizeRecentCandidates(message.recentCandidates, state.recentCandidates)
    }, "stats").then(() => {
      sendResponse({ ok: true, state: getPublicState() });
    }).catch((error) => {
      sendResponse({ error: String(error?.message || error) });
    });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_MARK_REPLIED") {
    markTweetAsReplied(message.url, message.meta || {}).then(() => {
      sendResponse({ ok: true, state: getPublicState() });
    }).catch((error) => {
      sendResponse({ error: String(error?.message || error) });
    });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_RECORD_PICKUP_SNAPSHOT") {
    recordPickupSnapshot(message.url, message.snapshot || {}).then(() => {
      sendResponse({ ok: true, state: getPublicState() });
    }).catch((error) => {
      sendResponse({ error: String(error?.message || error) });
    });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_API_CALL") {
    handleReplyDropApiCall(message, sender).then((result) => {
      sendResponse({ ok: true, result });
    }).catch((error) => {
      sendResponse({ ok: false, error: String(error?.message || error) });
    });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage().then(() => {
      sendResponse({ ok: true });
    }).catch((error) => {
      sendResponse({ error: String(error?.message || error) });
    });
    return true;
  }
});

loadState().catch(() => {});
