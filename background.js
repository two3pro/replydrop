if (typeof importScripts === "function") {
  [
    "replydrop-pickup-core.js",
    "replydrop-workflow-core.js",
    "replydrop-attribution-core.js"
  ].forEach((scriptName) => {
    try {
      importScripts(scriptName);
    } catch (error) {
      console.warn(`[ReplyDrop] Failed to import ${scriptName}`, error);
    }
  });
}

const PickupCore = globalThis.ReplyDropPickupCore || null;
const WorkflowCore = globalThis.ReplyDropWorkflowCore || null;
const AttributionCore = globalThis.ReplyDropAttributionCore || null;

const STORAGE_KEY = "x-reply-scorer-state";
const REPLY_LEDGER_STORAGE_KEY = "replydrop-reply-ledger-v1";
const REPLY_LEDGER_VERSION = "replydrop-ledger-v1";
const MAX_REPLIED_TWEETS = 500;
const MAX_RECENT_CANDIDATES = 16;
const FLOATING_PANEL_LIMIT = 6;
const MAX_REPLY_DETAILS = 60;
const MAX_DISMISSED_TWEETS = 120;
const MAX_RELATIONSHIP_STATES = 120;
const MAX_REPLY_QUEUE = 80;
const MAX_PUBLISH_WATCH = 40;
const MAX_PICKUP_WATCH = 60;
const MAX_REPLY_ARCHIVE = 1200;
const MAX_MEDIA_SUMMARIES = 80;
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
  headlessMode: false,
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
  mediaSummaries: {},
  replyQueue: [],
  publishWatch: [],
  pickupWatch: [],
  replyArchive: []
};

TOPIC_DEFS.forEach((topic, index) => {
  DEFAULT_STATE[topic.enabledKey] = index < 3;
  DEFAULT_STATE[topic.keywordsKey] = topic.defaults;
});

const BOOLEAN_KEYS = [
  "enabled",
  "headlessMode",
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

function normalizeAuthorVerificationType(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "gold" || raw === "government" || raw === "blue") {
    return raw;
  }
  return "";
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
  const opportunityBoost = clampNumber(candidate?.opportunityBoost, 0);
  const relationshipStatus = String(candidate?.relationshipStatus || "").trim();
  const attributionKind = String(candidate?.attributionKind || "").trim();
  const replies = clampNumber(candidate?.replies, 0);
  const views = clampNumber(candidate?.views, 0);
  const likes = clampNumber(candidate?.likes, 0);
  const timestamp = clampNumber(candidate?.timestamp, Date.now());
  const ageMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  const conversationRatio = views > 0 ? (replies / Math.max(views, 1)) : 0;
  const likeReplyRatio = likes > 0 && replies > 0 ? (likes / Math.max(replies, 1)) : 0;
  const relationshipHot = relationshipStatus === "mutual" || relationshipStatus === "pinned";
  const memoryHot = attributionKind === "author-engaged" || attributionKind === "handle-picked-up";
  const crowded = replies >= 180 || (views >= 180000 && replies >= 90);
  const broadcastHeavy = (
    (views >= 120000 && conversationRatio > 0 && conversationRatio < 0.0025) ||
    likeReplyRatio >= 22
  );
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
  if ((crowded || broadcastHeavy) && opportunityBoost < 10 && score < 84 && !relationshipHot && !memoryHot) {
    key = "crowded";
    priority = 1;
  } else if (
    (score >= 72 && ageMinutes <= 90) ||
    (opportunityBoost >= 12 && ageMinutes <= 90) ||
    ((relationshipHot || memoryHot) && ageMinutes <= 90 && score >= 48)
  ) {
    key = "now";
    priority = 4;
  } else if (
    ageMinutes <= 180 && (
      score >= 58 ||
      opportunityBoost >= 8 ||
      relationshipStatus === "follow-up" ||
      relationshipHot ||
      memoryHot ||
      attributionKind === "topic-validated"
    )
  ) {
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
  const archiveEntries = Array.isArray(state.replyArchive)
    ? state.replyArchive.map((entry) => ({
        url: normalizeTweetUrl(entry?.targetUrl || entry?.url),
        ...(entry && typeof entry === "object" ? entry : {})
      }))
    : [];
  if (archiveEntries.length) {
    return archiveEntries.filter((entry) => entry.url);
  }
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
    baseScore: clampNumber(candidate.baseScore, clampNumber(candidate.score, 0)),
    opportunityBoost: clampNumber(candidate.opportunityBoost, 0),
    tier: String(candidate.tier || "").trim() || "hidden",
    relationshipStatus: String(candidate.relationshipStatus || "").trim(),
    attributionKind: String(candidate.attributionKind || "").trim(),
    topicTags: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
    author: String(candidate.authorHandle || "").trim(),
    authorHandle: String(candidate.authorHandle || "").trim(),
    mediaKind: String(candidate.mediaKind || "").trim(),
    sourceSurface: String(candidate.sourceSurface || "").trim(),
    postScore: clampNumber(candidate.postScore, clampNumber(candidate.score, 0)),
    reachLikelihood: clampNumber(candidate.reachLikelihood, 0),
    understandingConfidence: clampNumber(candidate.understandingConfidence, 0),
    authorFit: clampNumber(candidate.authorFit, 0),
    finalScore: clampNumber(candidate.finalScore, clampNumber(candidate.score, 0)),
    peakFinalScore: clampNumber(candidate.peakFinalScore, clampNumber(candidate.finalScore, clampNumber(candidate.score, 0))),
    peakSourceSurface: String(candidate.peakSourceSurface || candidate.sourceSurface || "").trim(),
    trafficPhase: String(candidate.trafficPhase || "").trim(),
    trafficVelocityPerHour: clampNumber(candidate.trafficVelocityPerHour, 0),
    trafficReplyVelocityPerHour: clampNumber(candidate.trafficReplyVelocityPerHour, 0),
    trafficEngagementRate: clampNumber(candidate.trafficEngagementRate, 0),
    trafficReplyRatio: clampNumber(candidate.trafficReplyRatio, 0),
    retweets: clampNumber(candidate.retweets, 0),
    bookmarks: clampNumber(candidate.bookmarks, 0),
    blockReason: String(candidate.blockReason || "").trim(),
    lowSemanticConfidence: Boolean(candidate.lowSemanticConfidence),
    breakdown: Array.isArray(candidate.breakdown)
      ? candidate.breakdown.slice(0, 8).map((item) => ({
          key: String(item?.key || "").trim(),
          label: String(item?.label || "").trim(),
          amount: clampNumber(item?.amount, 0),
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
    addedAt: clampNumber(item.createdAt, 0),
    url,
    slot: String(item.slot || "next").trim() || "next",
    scheduledFor: clampNumber(item.scheduledFor, 0),
    author: String(item.authorHandle || "").trim(),
    authorHandle: String(item.authorHandle || "").trim(),
    score: clampNumber(item.score, 0),
    baseScore: clampNumber(item.baseScore, clampNumber(item.score, 0)),
    opportunityBoost: clampNumber(item.opportunityBoost, 0),
    relationshipStatus: String(item.relationshipStatus || "").trim(),
    attributionKind: String(item.attributionKind || "").trim(),
    trafficPhase: String(item.trafficPhase || "").trim(),
    trafficVelocityPerHour: clampNumber(item.trafficVelocityPerHour, 0),
    trafficReplyVelocityPerHour: clampNumber(item.trafficReplyVelocityPerHour, 0),
    trafficEngagementRate: clampNumber(item.trafficEngagementRate, 0),
    trafficReplyRatio: clampNumber(item.trafficReplyRatio, 0),
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

function clampLedgerLimit(value, fallback = 50) {
  return Math.max(1, Math.min(MAX_REPLY_ARCHIVE, Math.floor(clampNumber(value, fallback))));
}

function getReplyLedgerEntries() {
  return normalizeReplyArchive(state.replyArchive, state.replyArchive);
}

function filterReplyLedgerEntries(entries = [], options = {}) {
  const source = Array.isArray(entries) ? entries : [];
  const normalizedTargetUrl = normalizeTweetUrl(options.targetUrl || options.url);
  const normalizedReplyUrl = normalizeTweetUrl(options.replyUrl || options.replyTweetUrl);
  const normalizedTweetId = normalizeApiTweetId(options.tweetId || options.parentTweetId || extractTweetIdFromUrl(normalizedTargetUrl));
  const normalizedReplyTweetId = normalizeApiTweetId(options.replyTweetId || extractTweetIdFromUrl(normalizedReplyUrl));
  const normalizedLedgerId = String(options.ledgerId || "").trim();
  const normalizedSessionId = String(options.sessionId || "").trim();
  const normalizedRoundId = String(options.roundId || "").trim();
  const normalizedStatus = String(options.status || "").trim().toLowerCase();
  const since = Math.max(0, clampNumber(options.since ?? options.sentAfter, options.todayOnly ? getStartOfLocalDay(Date.now()) : 0));
  const until = Math.max(0, clampNumber(options.until ?? options.sentBefore, 0));
  const limit = clampLedgerLimit(options.limit, source.length || 50);
  return source
    .filter((entry) => {
      if (normalizedLedgerId && String(entry?.ledgerId || "").trim() !== normalizedLedgerId) {
        return false;
      }
      if (normalizedTargetUrl && normalizeTweetUrl(entry?.targetUrl || entry?.parentTweetUrl || entry?.url) !== normalizedTargetUrl) {
        return false;
      }
      if (normalizedReplyUrl && normalizeTweetUrl(entry?.replyUrl || entry?.replyTweetUrl) !== normalizedReplyUrl) {
        return false;
      }
      if (normalizedTweetId && normalizeApiTweetId(entry?.tweetId || extractTweetIdFromUrl(entry?.targetUrl || entry?.url)) !== normalizedTweetId) {
        return false;
      }
      if (normalizedReplyTweetId && normalizeApiTweetId(entry?.replyTweetId || extractTweetIdFromUrl(entry?.replyUrl)) !== normalizedReplyTweetId) {
        return false;
      }
      if (normalizedSessionId && String(entry?.sessionId || "").trim() !== normalizedSessionId) {
        return false;
      }
      if (normalizedRoundId && String(entry?.roundId || "").trim() !== normalizedRoundId) {
        return false;
      }
      if (normalizedStatus && String(entry?.status || "").trim().toLowerCase() !== normalizedStatus) {
        return false;
      }
      const sentAt = clampNumber(entry?.sentAt ?? entry?.timestamp ?? entry?.completedAt, 0);
      if (since && sentAt < since) {
        return false;
      }
      if (until && sentAt > until) {
        return false;
      }
      if (options.replyOnly && !normalizeTweetUrl(entry?.replyUrl || entry?.replyTweetUrl)) {
        return false;
      }
      return true;
    })
    .sort((left, right) => {
      const rightUpdated = Math.max(
        clampNumber(right?.performanceLastUpdatedAt, 0),
        clampNumber(right?.replyCheckedAt, 0),
        clampNumber(right?.pickupCheckedAt, 0),
        clampNumber(right?.sentAt ?? right?.timestamp, 0)
      );
      const leftUpdated = Math.max(
        clampNumber(left?.performanceLastUpdatedAt, 0),
        clampNumber(left?.replyCheckedAt, 0),
        clampNumber(left?.pickupCheckedAt, 0),
        clampNumber(left?.sentAt ?? left?.timestamp, 0)
      );
      return rightUpdated - leftUpdated;
    })
    .slice(0, limit);
}

function buildReplyLedgerSummary(entries = []) {
  const source = Array.isArray(entries) ? entries : [];
  return {
    totalEntries: source.length,
    shippedCount: source.filter((entry) => String(entry?.status || "").trim().toLowerCase() === "shipped").length,
    withReplyUrlCount: source.filter((entry) => normalizeTweetUrl(entry?.replyUrl || entry?.replyTweetUrl)).length,
    replyPerformanceCount: source.filter((entry) => clampNumber(entry?.replyCheckedAt, 0) > 0).length,
    threadPerformanceCount: source.filter((entry) => clampNumber(entry?.pickupCheckedAt, 0) > 0).length,
    lastSentAt: source.reduce((max, entry) => Math.max(max, clampNumber(entry?.sentAt ?? entry?.timestamp, 0)), 0),
    lastPerformanceUpdatedAt: source.reduce((max, entry) => Math.max(max, clampNumber(entry?.performanceLastUpdatedAt, 0)), 0)
  };
}

function getReplyLedgerSnapshot(options = {}) {
  const entries = filterReplyLedgerEntries(getReplyLedgerEntries(), options);
  return {
    version: REPLY_LEDGER_VERSION,
    generatedAt: Date.now(),
    filters: {
      todayOnly: Boolean(options.todayOnly),
      limit: clampLedgerLimit(options.limit, entries.length || 50),
      roundId: String(options.roundId || "").trim(),
      sessionId: String(options.sessionId || "").trim()
    },
    summary: buildReplyLedgerSummary(entries),
    entries: cloneApiValue(entries)
  };
}

function buildReplyPerformanceRow(entry = {}) {
  return {
    ledgerId: String(entry.ledgerId || "").trim(),
    tweetId: normalizeApiTweetId(entry.tweetId || extractTweetIdFromUrl(entry.targetUrl || entry.url)),
    parentTweetUrl: normalizeTweetUrl(entry.parentTweetUrl || entry.targetUrl || entry.url),
    replyTweetUrl: normalizeTweetUrl(entry.replyTweetUrl || entry.replyUrl),
    replyTweetId: normalizeApiTweetId(entry.replyTweetId || extractTweetIdFromUrl(entry.replyUrl)),
    draftedAt: clampNumber(entry.draftedAt, 0),
    sentAt: clampNumber(entry.sentAt ?? entry.timestamp ?? entry.completedAt, 0),
    status: String(entry.status || "shipped").trim(),
    roundId: String(entry.roundId || "").trim(),
    sessionId: String(entry.sessionId || "").trim(),
    sendResult: String(entry.sendResult || "").trim(),
    replyText: String(entry.replyText || entry.text || "").trim(),
    replyViews: clampNumber(entry.replyObservedViews, 0),
    replyLikes: clampNumber(entry.replyObservedLikes, 0),
    replyReplies: clampNumber(entry.replyObservedReplies, 0),
    targetViews: clampNumber(entry.pickupViews, 0),
    targetDeltaLikes: clampNumber(entry.pickupDeltaLikes, 0),
    targetDeltaReplies: clampNumber(entry.pickupDeltaReplies, 0),
    performanceLastUpdatedAt: Math.max(
      clampNumber(entry.performanceLastUpdatedAt, 0),
      clampNumber(entry.replyCheckedAt, 0),
      clampNumber(entry.pickupCheckedAt, 0)
    )
  };
}

function getReplyPerformanceReport(options = {}) {
  const entries = filterReplyLedgerEntries(getReplyLedgerEntries(), options);
  const performance = entries.map((entry) => buildReplyPerformanceRow(entry));
  return {
    version: "replydrop-performance-report-v1",
    generatedAt: Date.now(),
    filters: {
      todayOnly: Boolean(options.todayOnly),
      limit: clampLedgerLimit(options.limit, performance.length || 50),
      roundId: String(options.roundId || "").trim(),
      sessionId: String(options.sessionId || "").trim()
    },
    summary: {
      ...buildReplyLedgerSummary(entries),
      performanceCount: performance.filter((entry) => entry.performanceLastUpdatedAt > 0).length,
      replyViewTotal: performance.reduce((sum, entry) => sum + clampNumber(entry.replyViews, 0), 0),
      targetViewTotal: performance.reduce((sum, entry) => sum + clampNumber(entry.targetViews, 0), 0)
    },
    replies: performance
  };
}

async function importReplyLedgerSnapshot(payload = {}) {
  const entries = Array.isArray(payload?.entries)
    ? payload.entries
    : (Array.isArray(payload) ? payload : []);
  const normalizedEntries = normalizeReplyArchive(entries, state.replyArchive);
  if (!normalizedEntries.length) {
    return getReplyLedgerSnapshot({ limit: 1 });
  }

  const nextReplyDetails = { ...(state.replyDetails || {}) };
  normalizedEntries.forEach((entry) => {
    const targetUrl = normalizeTweetUrl(entry?.targetUrl || entry?.url);
    if (!targetUrl) {
      return;
    }
    const existing = nextReplyDetails[targetUrl] || null;
    const entryFreshness = Math.max(
      clampNumber(entry?.performanceLastUpdatedAt, 0),
      clampNumber(entry?.sentAt ?? entry?.timestamp, 0)
    );
    const existingFreshness = Math.max(
      clampNumber(existing?.performanceLastUpdatedAt, 0),
      clampNumber(existing?.sentAt ?? existing?.timestamp, 0)
    );
    if (!existing || entryFreshness >= existingFreshness) {
      nextReplyDetails[targetUrl] = entry;
    }
  });

  await patchState({
    replyDetails: nextReplyDetails,
    replyArchive: normalizeReplyArchive([...(state.replyArchive || []), ...normalizedEntries], state.replyArchive)
  }, "reply-ledger-imported");

  return getReplyLedgerSnapshot({ limit: normalizedEntries.length });
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
    ...(Array.isArray(state.replyArchive) ? state.replyArchive.flatMap((item) => [item?.targetUrl, item?.replyUrl]) : []),
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
  if (candidate.blockReason) {
    throw new Error(String(candidate.blockReason));
  }

  const existing = getQueueItemByTweetId(normalizedTweetId);
  const slot = resolveDefaultQueueSlot(candidate);
  const nextItem = {
    url: candidate.url,
    authorHandle: candidate.authorHandle || existing?.authorHandle || "",
    text: candidate.text || existing?.text || "",
    score: clampNumber(candidate.score, clampNumber(existing?.score, 0)),
    baseScore: clampNumber(candidate.baseScore, clampNumber(existing?.baseScore, clampNumber(candidate.score, 0))),
    opportunityBoost: clampNumber(candidate.opportunityBoost, clampNumber(existing?.opportunityBoost, 0)),
    createdAt: clampNumber(existing?.createdAt, Date.now()),
    scheduledFor: getScheduledTimestamp(slot),
    completedAt: 0,
    slot,
    draft: String(existing?.draft || "").trim().slice(0, 560),
    lane: getCandidateLaneDescriptor(candidate, state.uiLanguage).label,
    relationshipStatus: String(candidate.relationshipStatus || existing?.relationshipStatus || "").trim(),
    attributionKind: String(candidate.attributionKind || existing?.attributionKind || "").trim(),
    keywordMatched: Boolean(candidate.keywordMatched || existing?.keywordMatched),
    matchedTopics: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
    matchedLanguages: Array.isArray(candidate.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4) : [],
    highlights: Array.isArray(candidate.highlights) ? candidate.highlights.slice(0, 4) : [],
    retweets: clampNumber(candidate.retweets, clampNumber(existing?.retweets, 0)),
    bookmarks: clampNumber(candidate.bookmarks, clampNumber(existing?.bookmarks, 0)),
    trafficCapturedAt: clampNumber(candidate.trafficCapturedAt, clampNumber(existing?.trafficCapturedAt, 0)),
    trafficAgeHours: clampNumber(candidate.trafficAgeHours, clampNumber(existing?.trafficAgeHours, 0)),
    trafficVelocityPerHour: clampNumber(candidate.trafficVelocityPerHour, clampNumber(existing?.trafficVelocityPerHour, 0)),
    trafficReplyVelocityPerHour: clampNumber(candidate.trafficReplyVelocityPerHour, clampNumber(existing?.trafficReplyVelocityPerHour, 0)),
    trafficEngagementRate: clampNumber(candidate.trafficEngagementRate, clampNumber(existing?.trafficEngagementRate, 0)),
    trafficReplyRatio: clampNumber(candidate.trafficReplyRatio, clampNumber(existing?.trafficReplyRatio, 0)),
    trafficPhase: String(candidate.trafficPhase || existing?.trafficPhase || "").trim(),
    trafficSource: String(candidate.trafficSource || existing?.trafficSource || "").trim(),
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

async function markTweetAsShippedById(tweetId, replyText = "", meta = {}) {
  const payload = tweetId && typeof tweetId === "object" ? tweetId : {};
  const metaPayload = replyText && typeof replyText === "object"
    ? replyText
    : (meta && typeof meta === "object" ? meta : {});
  const normalizedTweetId = normalizeApiTweetId(
    payload.tweetId ||
    payload.targetTweetId ||
    tweetId
  );
  if (!normalizedTweetId) {
    throw new Error("invalid-tweet-id");
  }

  const url = resolveTweetUrlById(normalizedTweetId);
  if (!url) {
    throw new Error("tweet-not-found");
  }

  const queueItem = getQueueItemByTweetId(normalizedTweetId);
  const candidate = getCandidateByTweetId(normalizedTweetId);
  const replyDetailMatch = state.replyDetails?.[url] || null;
  const pickupWatchMatch = (state.pickupWatch || []).find((item) => item?.url === url) || null;
  const explicitReplyText = typeof replyText === "string" ? replyText : "";
  const finalReplyText = String(
    payload.replyText ||
    payload.text ||
    metaPayload.replyText ||
    metaPayload.text ||
    explicitReplyText ||
    queueItem?.draft ||
    queueItem?.text ||
    candidate?.text ||
    ""
  ).trim().slice(0, 560);

  await markTweetAsReplied(url, {
    ledgerId: String(payload.ledgerId || metaPayload.ledgerId || "").trim(),
    score: clampNumber(
      queueItem?.score,
      clampNumber(candidate?.score, clampNumber(replyDetailMatch?.score, clampNumber(pickupWatchMatch?.score, 0)))
    ),
    tier: "replied",
    authorHandle: String(
      queueItem?.authorHandle ||
      candidate?.authorHandle ||
      replyDetailMatch?.authorHandle ||
      pickupWatchMatch?.authorHandle ||
      ""
    ).trim(),
    authorVerified: Boolean(candidate?.authorVerified || replyDetailMatch?.authorVerified),
    authorVerificationType: normalizeAuthorVerificationType(
      candidate?.authorVerificationType || replyDetailMatch?.authorVerificationType
    ),
    text: finalReplyText,
    lane: String(queueItem?.lane || replyDetailMatch?.lane || pickupWatchMatch?.lane || "").trim(),
    slot: String(
      queueItem?.slot ||
      replyDetailMatch?.slot ||
      pickupWatchMatch?.slot ||
      resolveDefaultQueueSlot(candidate)
    ).trim(),
    keywordMatched: Boolean(queueItem?.keywordMatched || candidate?.keywordMatched),
    matchedTopics: Array.isArray(queueItem?.matchedTopics) && queueItem.matchedTopics.length
      ? queueItem.matchedTopics.slice(0, 4)
      : (Array.isArray(candidate?.matchedTopics) && candidate.matchedTopics.length
          ? candidate.matchedTopics.slice(0, 4)
          : (replyDetailMatch?.matchedTopics || []).slice(0, 4)),
    matchedLanguages: Array.isArray(queueItem?.matchedLanguages) && queueItem.matchedLanguages.length
      ? queueItem.matchedLanguages.slice(0, 4)
      : (Array.isArray(candidate?.matchedLanguages) && candidate.matchedLanguages.length
          ? candidate.matchedLanguages.slice(0, 4)
          : (replyDetailMatch?.matchedLanguages || []).slice(0, 4)),
    highlights: Array.isArray(queueItem?.highlights) && queueItem.highlights.length
      ? queueItem.highlights.slice(0, 4)
      : (Array.isArray(candidate?.highlights) && candidate.highlights.length
          ? candidate.highlights.slice(0, 4)
          : (replyDetailMatch?.highlights || []).slice(0, 4)),
    retweets: clampNumber(candidate?.retweets, clampNumber(replyDetailMatch?.retweets, 0)),
    bookmarks: clampNumber(candidate?.bookmarks, clampNumber(replyDetailMatch?.bookmarks, 0)),
    trafficCapturedAt: clampNumber(candidate?.trafficCapturedAt, clampNumber(replyDetailMatch?.trafficCapturedAt, 0)),
    trafficAgeHours: clampNumber(candidate?.trafficAgeHours, clampNumber(replyDetailMatch?.trafficAgeHours, 0)),
    trafficVelocityPerHour: clampNumber(candidate?.trafficVelocityPerHour, clampNumber(replyDetailMatch?.trafficVelocityPerHour, 0)),
    trafficReplyVelocityPerHour: clampNumber(candidate?.trafficReplyVelocityPerHour, clampNumber(replyDetailMatch?.trafficReplyVelocityPerHour, 0)),
    trafficEngagementRate: clampNumber(candidate?.trafficEngagementRate, clampNumber(replyDetailMatch?.trafficEngagementRate, 0)),
    trafficReplyRatio: clampNumber(candidate?.trafficReplyRatio, clampNumber(replyDetailMatch?.trafficReplyRatio, 0)),
    trafficPhase: String(candidate?.trafficPhase || replyDetailMatch?.trafficPhase || "").trim(),
    trafficSource: String(candidate?.trafficSource || replyDetailMatch?.trafficSource || "").trim(),
    baselineReplies: clampNumber(candidate?.replies, clampNumber(replyDetailMatch?.baselineReplies, 0)),
    baselineLikes: clampNumber(candidate?.likes, clampNumber(replyDetailMatch?.baselineLikes, 0)),
    baselineViews: clampNumber(candidate?.views, clampNumber(replyDetailMatch?.baselineViews, 0)),
    draftedAt: clampNumber(payload.draftedAt ?? metaPayload.draftedAt, clampNumber(queueItem?.createdAt, 0)),
    sentAt: clampNumber(payload.sentAt ?? metaPayload.sentAt, Date.now()),
    roundId: String(payload.roundId || metaPayload.roundId || "").trim(),
    sessionId: String(payload.sessionId || metaPayload.sessionId || "").trim(),
    sendResult: String(payload.sendResult || metaPayload.sendResult || "sent").trim(),
    replyUrl: normalizeTweetUrl(payload.replyUrl || metaPayload.replyUrl || replyDetailMatch?.replyUrl),
    replyTweetId: normalizeApiTweetId(
      payload.replyTweetId ||
      metaPayload.replyTweetId ||
      extractTweetIdFromUrl(payload.replyUrl || metaPayload.replyUrl || replyDetailMatch?.replyUrl)
    ),
    status: "shipped",
    publishMode: String(payload.publishMode || metaPayload.publishMode || (queueItem ? "queue" : "manual")).trim() || (queueItem ? "queue" : "manual")
  });

  const latestEntry = filterReplyLedgerEntries(getReplyLedgerEntries(), {
    targetUrl: url,
    replyUrl: normalizeTweetUrl(payload.replyUrl || metaPayload.replyUrl || replyDetailMatch?.replyUrl),
    limit: 1
  })[0] || null;

  return {
    ok: true,
    tweetId: normalizedTweetId,
    status: "shipped",
    url,
    replyText: finalReplyText,
    ledgerId: String(latestEntry?.ledgerId || "").trim(),
    roundId: String(latestEntry?.roundId || payload.roundId || metaPayload.roundId || "").trim(),
    sessionId: String(latestEntry?.sessionId || payload.sessionId || metaPayload.sessionId || "").trim()
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
    case "getReplyLedger":
      return getReplyLedgerSnapshot(args[0] || {});
    case "exportReplyLedger":
      return getReplyLedgerSnapshot(args[0] || {});
    case "importReplyLedger":
      return importReplyLedgerSnapshot(args[0] || {});
    case "getReplyPerformanceReport":
      return getReplyPerformanceReport(args[0] || {});
    case "addToQueue":
      return addCandidateToQueueByTweetId(args[0]);
    case "markShipped":
      return markTweetAsShippedById(args[0], args[1], args[2]);
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
  const previousByUrl = new Map(
    (Array.isArray(fallback) ? fallback : [])
      .filter((item) => item && typeof item === "object" && item.url)
      .map((item) => [normalizeTweetUrl(item.url), item])
  );
  return source
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const url = normalizeTweetUrl(item.url);
      const previous = previousByUrl.get(url) || {};
      const score = Math.max(0, Math.min(100, Math.floor(clampNumber(item.score, 0))));
      const finalScore = Math.max(0, Math.min(100, Math.floor(clampNumber(item.finalScore, clampNumber(item.score, 0)))));
      const sourceSurface = String(item.sourceSurface || "").trim().slice(0, 24);
      const timestamp = clampNumber(item.timestamp, Date.now());
      const previousPeakFinalScore = Math.max(
        0,
        Math.min(
          100,
          Math.floor(
            clampNumber(
              previous.peakFinalScore,
              clampNumber(previous.finalScore, clampNumber(previous.score, 0))
            )
          )
        )
      );
      const peakFinalScore = Math.max(
        finalScore,
        Math.max(
          0,
          Math.min(100, Math.floor(clampNumber(item.peakFinalScore, finalScore))),
          previousPeakFinalScore
        )
      );
      const peakSourceSurface = peakFinalScore > previousPeakFinalScore
        ? sourceSurface
        : String(previous.peakSourceSurface || previous.sourceSurface || sourceSurface).trim().slice(0, 24);
      const peakObservedAt = peakFinalScore > previousPeakFinalScore
        ? timestamp
        : clampNumber(previous.peakObservedAt, timestamp);

      return {
        url,
        score,
        baseScore: Math.max(0, Math.min(100, Math.floor(clampNumber(item.baseScore, clampNumber(item.score, 0))))),
        opportunityBoost: Math.max(-100, Math.min(100, Math.floor(clampNumber(item.opportunityBoost, 0)))),
        tier: String(item.tier || "hidden"),
        baseTier: String(item.baseTier || item.tier || "hidden").trim(),
        relationshipStatus: String(item.relationshipStatus || "").trim().slice(0, 24),
        attributionKind: String(item.attributionKind || "").trim().slice(0, 32),
        authorHandle: String(item.authorHandle || "").trim(),
        authorVerified: Boolean(item.authorVerified),
        authorVerificationType: normalizeAuthorVerificationType(item.authorVerificationType),
        text: String(item.text || "").trim().slice(0, 280),
        mediaAltText: String(item.mediaAltText || "").trim().slice(0, 280),
        sourceSurface,
        postScore: Math.max(0, Math.min(100, Math.floor(clampNumber(item.postScore, clampNumber(item.score, 0))))),
        reachLikelihood: Math.max(0, Math.min(100, Math.floor(clampNumber(item.reachLikelihood, 0)))),
        understandingConfidence: Math.max(0, Math.min(100, Math.floor(clampNumber(item.understandingConfidence, 0)))),
        authorFit: Math.max(0, Math.min(100, Math.floor(clampNumber(item.authorFit, 0)))),
        finalScore,
        peakFinalScore,
        peakSourceSurface,
        peakObservedAt,
        blockReason: String(item.blockReason || "").trim().slice(0, 48),
        lowSemanticConfidence: Boolean(item.lowSemanticConfidence),
        timestamp,
        mediaKind: String(item.mediaKind || "").trim(),
        likes: clampNumber(item.likes, 0),
        replies: clampNumber(item.replies, 0),
        views: clampNumber(item.views, 0),
        retweets: clampNumber(item.retweets, 0),
        bookmarks: clampNumber(item.bookmarks, 0),
        trafficCapturedAt: clampNumber(item.trafficCapturedAt, 0),
        trafficAgeHours: clampNumber(item.trafficAgeHours, 0),
        trafficVelocityPerHour: clampNumber(item.trafficVelocityPerHour, 0),
        trafficReplyVelocityPerHour: clampNumber(item.trafficReplyVelocityPerHour, 0),
        trafficEngagementRate: clampNumber(item.trafficEngagementRate, 0),
        trafficReplyRatio: clampNumber(item.trafficReplyRatio, 0),
        trafficPhase: String(item.trafficPhase || "").trim().slice(0, 16),
        trafficSource: String(item.trafficSource || "").trim().slice(0, 24),
        breakdown: Array.isArray(item.breakdown)
          ? item.breakdown.slice(0, 8).map((entry) => ({
              key: String(entry?.key || "").trim().slice(0, 48),
              label: String(entry?.label || "").trim().slice(0, 80),
              amount: clampNumber(entry?.amount, 0),
              kind: String(entry?.kind || "").trim().slice(0, 24)
            })).filter((entry) => entry.key)
          : [],
        keywordMatched: Boolean(item.keywordMatched),
        matchedTopics: Array.isArray(item.matchedTopics) ? item.matchedTopics.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        matchedLanguages: Array.isArray(item.matchedLanguages) ? item.matchedLanguages.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        highlights: Array.isArray(item.highlights) ? item.highlights.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : []
      };
    })
    .filter((item) => item.url && item.tier !== "hidden")
    .sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
    .slice(0, MAX_RECENT_CANDIDATES);
}

function getCandidateDisplayScore(candidate = {}) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.floor(clampNumber(candidate.finalScore, clampNumber(candidate.score, 0)))
    )
  );
}

function countFloatingHighScoreCandidates(candidates = [], threshold = DEFAULT_STATE.threshold, limit = FLOATING_PANEL_LIMIT) {
  const displayThreshold = Math.max(0, Math.min(100, Math.floor(clampNumber(threshold, DEFAULT_STATE.threshold))));
  return (Array.isArray(candidates) ? candidates : [])
    .filter((candidate) => candidate?.url && candidate.tier !== "hidden" && getCandidateDisplayScore(candidate) >= displayThreshold)
    .slice(0, Math.max(0, Math.floor(clampNumber(limit, FLOATING_PANEL_LIMIT))))
    .length;
}

function normalizeReplyDetails(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  const entries = Object.entries(source)
    .map(([url, detail]) => {
      const normalized = sanitizeReplyArchiveEntry({ ...(detail && typeof detail === "object" ? detail : {}), targetUrl: url }, url);
      return normalized ? [normalized.targetUrl, normalized] : null;
    })
    .filter(Boolean)
    .sort((a, b) => b[1].timestamp - a[1].timestamp)
    .slice(0, MAX_REPLY_DETAILS);

  return Object.fromEntries(entries);
}

function sanitizeReplyArchiveEntry(entry = {}, fallbackTargetUrl = "") {
  const payload = entry && typeof entry === "object" ? entry : {};
  const targetUrl = normalizeTweetUrl(payload.targetUrl || payload.url || fallbackTargetUrl);
  if (!targetUrl) {
    return null;
  }

  const timestamp = clampNumber(payload.timestamp || payload.shippedAt || payload.completedAt, Date.now());
  const targetTweetId = normalizeApiTweetId(payload.tweetId || extractTweetIdFromUrl(targetUrl));
  const pickupCheckedAt = clampNumber(payload.pickupCheckedAt ?? payload.targetCheckedAt, 0);
  const pickupChecks = Math.max(0, Math.floor(clampNumber(payload.pickupChecks ?? payload.targetChecks, pickupCheckedAt ? 1 : 0)));
  const pickupStatus = normalizePickupStatus(payload.pickupStatus ?? payload.targetStatus, pickupCheckedAt ? "quiet" : "pending");
  const pickupReviewPlan = buildPickupReviewPlan({
    shippedAt: timestamp,
    checkedAt: pickupCheckedAt,
    checks: pickupChecks,
    status: pickupStatus,
    reviewStage: payload.pickupReviewStage,
    nextReviewAt: payload.pickupNextReviewAt,
    settledAt: payload.pickupSettledAt
  });
  const replyUrl = normalizeTweetUrl(payload.replyUrl);
  const replyTweetId = normalizeApiTweetId(payload.replyTweetId || extractTweetIdFromUrl(replyUrl));
  const replyCheckedAt = clampNumber(payload.replyCheckedAt ?? payload.replyTrafficCapturedAt, 0);
  const replyChecks = Math.max(0, Math.floor(clampNumber(payload.replyChecks, replyCheckedAt ? 1 : 0)));
  const replyObservedReplies = clampNumber(payload.replyObservedReplies ?? payload.replyReplies, 0);
  const replyObservedLikes = clampNumber(payload.replyObservedLikes ?? payload.replyLikes, 0);
  const replyObservedViews = clampNumber(payload.replyObservedViews ?? payload.replyViews, 0);
  const sentAt = clampNumber(payload.sentAt ?? payload.timestamp ?? payload.shippedAt ?? payload.completedAt, timestamp);
  const draftedAt = clampNumber(payload.draftedAt, clampNumber(payload.queuedAt, clampNumber(payload.handedOffAt, 0)));
  const performanceLastUpdatedAt = Math.max(
    clampNumber(payload.performanceLastUpdatedAt, 0),
    replyCheckedAt,
    pickupCheckedAt
  );
  const ledgerId = String(
    payload.ledgerId ||
    [
      targetTweetId || "target",
      sentAt || 0,
      normalizeApiTweetId(payload.replyTweetId || extractTweetIdFromUrl(replyUrl)) || "reply"
    ].join(":")
  ).trim().slice(0, 160);

  return {
    ledgerId,
    ledgerVersion: REPLY_LEDGER_VERSION,
    targetUrl,
    parentTweetUrl: targetUrl,
    url: targetUrl,
    tweetId: targetTweetId,
    timestamp,
    draftedAt,
    sentAt,
    completedAt: clampNumber(payload.completedAt, timestamp),
    status: String(payload.status || "shipped").trim().slice(0, 24) || "shipped",
    sessionId: String(payload.sessionId || "").trim().slice(0, 80),
    roundId: String(payload.roundId || "").trim().slice(0, 80),
    sendResult: String(payload.sendResult || "sent").trim().slice(0, 40) || "sent",
    score: Math.max(0, Math.min(100, Math.floor(clampNumber(payload.score, 0)))),
    tier: String(payload.tier || "replied"),
    authorHandle: String(payload.authorHandle || "").trim(),
    authorVerified: Boolean(payload.authorVerified),
    authorVerificationType: normalizeAuthorVerificationType(payload.authorVerificationType),
    text: String(payload.text || "").trim().slice(0, 280),
    replyText: String(payload.replyText || payload.text || "").trim().slice(0, 560),
    replyUrl,
    replyTweetUrl: replyUrl,
    replyTweetId,
    lane: String(payload.lane || "").trim().slice(0, 48),
    slot: String(payload.slot || "").trim().slice(0, 24),
    keywordMatched: Boolean(payload.keywordMatched),
    matchedTopics: Array.isArray(payload.matchedTopics) ? payload.matchedTopics.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4) : [],
    matchedLanguages: Array.isArray(payload.matchedLanguages) ? payload.matchedLanguages.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4) : [],
    highlights: Array.isArray(payload.highlights) ? payload.highlights.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4) : [],
    publishMode: String(payload.publishMode || "").trim().slice(0, 32),
    queuedAt: clampNumber(payload.queuedAt, 0),
    handedOffAt: clampNumber(payload.handedOffAt, 0),
    executionLatencyMs: clampNumber(payload.executionLatencyMs, 0),
    retweets: clampNumber(payload.retweets, 0),
    bookmarks: clampNumber(payload.bookmarks, 0),
    trafficCapturedAt: clampNumber(payload.trafficCapturedAt, 0),
    trafficAgeHours: clampNumber(payload.trafficAgeHours, 0),
    trafficVelocityPerHour: clampNumber(payload.trafficVelocityPerHour, 0),
    trafficReplyVelocityPerHour: clampNumber(payload.trafficReplyVelocityPerHour, 0),
    trafficEngagementRate: clampNumber(payload.trafficEngagementRate, 0),
    trafficReplyRatio: clampNumber(payload.trafficReplyRatio, 0),
    trafficPhase: String(payload.trafficPhase || "").trim().slice(0, 16),
    trafficSource: String(payload.trafficSource || "").trim().slice(0, 24),
    baselineReplies: clampNumber(payload.baselineReplies, 0),
    baselineLikes: clampNumber(payload.baselineLikes, 0),
    baselineViews: clampNumber(payload.baselineViews, 0),
    pickupStatus,
    pickupCheckedAt,
    pickupChecks,
    pickupReplies: clampNumber(payload.pickupReplies ?? payload.targetObservedReplies, 0),
    pickupLikes: clampNumber(payload.pickupLikes ?? payload.targetObservedLikes, 0),
    pickupViews: clampNumber(payload.pickupViews ?? payload.targetObservedViews, 0),
    pickupDeltaReplies: clampNumber(payload.pickupDeltaReplies ?? payload.targetDeltaReplies, 0),
    pickupDeltaLikes: clampNumber(payload.pickupDeltaLikes ?? payload.targetDeltaLikes, 0),
    pickupDeltaViews: clampNumber(payload.pickupDeltaViews ?? payload.targetDeltaViews, 0),
    pickupReviewStage: pickupReviewPlan.reviewStage,
    pickupNextReviewAt: pickupReviewPlan.nextReviewAt,
    pickupSettledAt: pickupReviewPlan.settledAt,
    pickupAuthorEngaged: Boolean(payload.pickupAuthorEngaged),
    pickupAuthorReplyUrl: normalizeTweetUrl(payload.pickupAuthorReplyUrl),
    replyCheckedAt,
    replyChecks,
    replyObservedReplies,
    replyObservedLikes,
    replyObservedViews,
    replyDeltaReplies: clampNumber(payload.replyDeltaReplies, replyObservedReplies),
    replyDeltaLikes: clampNumber(payload.replyDeltaLikes, replyObservedLikes),
    replyDeltaViews: clampNumber(payload.replyDeltaViews, replyObservedViews),
    replyTrafficCapturedAt: clampNumber(payload.replyTrafficCapturedAt, replyCheckedAt),
    replyTrafficSource: String(payload.replyTrafficSource || "").trim().slice(0, 24),
    performanceLastUpdatedAt,
    performanceLastError: String(payload.performanceLastError || "").trim().slice(0, 240)
  };
}

function normalizeReplyArchive(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;
  const entries = source
    .map((entry) => sanitizeReplyArchiveEntry(entry))
    .filter(Boolean)
    .sort((left, right) => (
      Math.max(right.replyCheckedAt || 0, right.pickupCheckedAt || 0, right.timestamp || 0) -
      Math.max(left.replyCheckedAt || 0, left.pickupCheckedAt || 0, left.timestamp || 0)
    ))
    .slice(0, MAX_REPLY_ARCHIVE);

  const deduped = [];
  const seen = new Set();
  for (const entry of entries) {
    const key = String(entry.ledgerId || `${entry.targetUrl}::${entry.sentAt || entry.timestamp || 0}::${entry.replyUrl || ""}`);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(entry);
  }
  return deduped;
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
        baseScore: Math.max(0, Math.min(100, Math.floor(clampNumber(item.baseScore, clampNumber(item.score, 0))))),
        opportunityBoost: Math.max(-100, Math.min(100, Math.floor(clampNumber(item.opportunityBoost, 0)))),
        createdAt: clampNumber(item.createdAt, Date.now()),
        scheduledFor: clampNumber(item.scheduledFor, Date.now()),
        completedAt: status === "queued" ? 0 : clampNumber(item.completedAt, Date.now()),
        slot: String(item.slot || "next").trim(),
        draft: String(item.draft || "").trim().slice(0, 560),
        lane: String(item.lane || "").trim().slice(0, 48),
        relationshipStatus: String(item.relationshipStatus || "").trim().slice(0, 24),
        attributionKind: String(item.attributionKind || "").trim().slice(0, 32),
        keywordMatched: Boolean(item.keywordMatched),
        matchedTopics: Array.isArray(item.matchedTopics) ? item.matchedTopics.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        matchedLanguages: Array.isArray(item.matchedLanguages) ? item.matchedLanguages.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        highlights: Array.isArray(item.highlights) ? item.highlights.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 4) : [],
        retweets: clampNumber(item.retweets, 0),
        bookmarks: clampNumber(item.bookmarks, 0),
        trafficCapturedAt: clampNumber(item.trafficCapturedAt, 0),
        trafficAgeHours: clampNumber(item.trafficAgeHours, 0),
        trafficVelocityPerHour: clampNumber(item.trafficVelocityPerHour, 0),
        trafficReplyVelocityPerHour: clampNumber(item.trafficReplyVelocityPerHour, 0),
        trafficEngagementRate: clampNumber(item.trafficEngagementRate, 0),
        trafficReplyRatio: clampNumber(item.trafficReplyRatio, 0),
        trafficPhase: String(item.trafficPhase || "").trim().slice(0, 16),
        trafficSource: String(item.trafficSource || "").trim().slice(0, 24),
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

function upsertReplyArchiveEntry(targetUrl, patch = {}) {
  const normalizedTarget = normalizeTweetUrl(targetUrl || patch.targetUrl || patch.url);
  if (!normalizedTarget) {
    return normalizeReplyArchive(state.replyArchive, state.replyArchive);
  }

  const normalizedReplyUrl = normalizeTweetUrl(patch.replyUrl);
  const normalizedLedgerId = String(patch.ledgerId || "").trim();
  const normalizedReplyTweetId = normalizeApiTweetId(patch.replyTweetId || extractTweetIdFromUrl(normalizedReplyUrl));
  const normalizedSentAt = clampNumber(patch.sentAt ?? patch.timestamp ?? patch.shippedAt ?? patch.completedAt, 0);
  const archiveEntries = Array.isArray(state.replyArchive) ? state.replyArchive : [];
  const existing = archiveEntries.find((item) => {
    if (normalizedLedgerId && String(item?.ledgerId || "").trim() === normalizedLedgerId) {
      return true;
    }
    if (normalizedReplyUrl && normalizeTweetUrl(item?.replyUrl) === normalizedReplyUrl) {
      return true;
    }
    if (normalizedReplyTweetId && normalizeApiTweetId(item?.replyTweetId || extractTweetIdFromUrl(item?.replyUrl)) === normalizedReplyTweetId) {
      return true;
    }
    if (
      normalizeTweetUrl(item?.targetUrl || item?.url) === normalizedTarget &&
      normalizedSentAt > 0 &&
      clampNumber(item?.sentAt ?? item?.timestamp ?? item?.completedAt, 0) === normalizedSentAt
    ) {
      return true;
    }
    return false;
  }) || archiveEntries.find((item) => normalizeTweetUrl(item?.targetUrl || item?.url) === normalizedTarget) || state.replyDetails?.[normalizedTarget] || null;
  const nextEntry = sanitizeReplyArchiveEntry({
    ...(existing && typeof existing === "object" ? existing : {}),
    ...(patch && typeof patch === "object" ? patch : {}),
    targetUrl: normalizedTarget
  }, normalizedTarget);
  if (!nextEntry) {
    return normalizeReplyArchive(state.replyArchive, state.replyArchive);
  }

  const remaining = archiveEntries.filter((item) => {
    const itemTargetUrl = normalizeTweetUrl(item?.targetUrl || item?.url);
    const itemReplyUrl = normalizeTweetUrl(item?.replyUrl);
    const itemLedgerId = String(item?.ledgerId || "").trim();
    const itemReplyTweetId = normalizeApiTweetId(item?.replyTweetId || extractTweetIdFromUrl(itemReplyUrl));
    const itemSentAt = clampNumber(item?.sentAt ?? item?.timestamp ?? item?.completedAt, 0);
    if (normalizedLedgerId && itemLedgerId && itemLedgerId === normalizedLedgerId) {
      return false;
    }
    if (normalizedReplyUrl && itemReplyUrl && itemReplyUrl === normalizedReplyUrl) {
      return false;
    }
    if (normalizedReplyTweetId && itemReplyTweetId && itemReplyTweetId === normalizedReplyTweetId) {
      return false;
    }
    if (itemTargetUrl === normalizedTarget && normalizedSentAt > 0 && itemSentAt === normalizedSentAt) {
      return false;
    }
    return true;
  });

  return normalizeReplyArchive([nextEntry, ...remaining], state.replyArchive);
}

function removeReplyArchiveEntry(targetUrl) {
  const normalizedTarget = normalizeTweetUrl(targetUrl);
  return normalizeReplyArchive(
    (Array.isArray(state.replyArchive) ? state.replyArchive : []).filter((item) => normalizeTweetUrl(item?.targetUrl || item?.url) !== normalizedTarget),
    state.replyArchive
  );
}

function normalizeRelationshipStates(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  const now = Date.now();
  const allowedStatuses = new Set(["mutual", "pinned", "follow-up", "snoozed"]);
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

function normalizeMediaSummaries(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback && typeof fallback === "object" ? fallback : {};
  const entries = Object.entries(source)
    .map(([tweetId, detail]) => {
      const normalizedTweetId = normalizeApiTweetId(tweetId);
      const payload = detail && typeof detail === "object" ? detail : {};
      if (!normalizedTweetId) {
        return null;
      }
      const summary = String(payload.summary || "").trim().slice(0, 1200);
      const ocrText = String(payload.ocrText || "").trim().slice(0, 1600);
      const confidence = Math.max(0, Math.min(1, clampNumber(payload.confidence, 0)));
      const source = String(payload.source || "").trim().slice(0, 48);
      const updatedAt = clampNumber(payload.updatedAt, Date.now());
      const mediaKinds = Array.isArray(payload.mediaKinds)
        ? payload.mediaKinds.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 8)
        : [];
      const frameCount = Math.max(0, Math.floor(clampNumber(payload.frameCount, 0)));
      if (!summary && !ocrText) {
        return null;
      }
      return [normalizedTweetId, {
        tweetId: normalizedTweetId,
        summary,
        ocrText,
        confidence,
        source,
        mediaKinds,
        frameCount,
        updatedAt
      }];
    })
    .filter(Boolean)
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
    .slice(0, MAX_MEDIA_SUMMARIES);
  return Object.fromEntries(entries);
}

function normalizeState(partial = {}) {
  const repliedTweets = normalizeRepliedTweets(partial.repliedTweets, state.repliedTweets ?? DEFAULT_STATE.repliedTweets);
  const dismissedTweets = normalizeDismissedTweets(partial.dismissedTweets, state.dismissedTweets ?? DEFAULT_STATE.dismissedTweets);
  const recentCandidates = normalizeRecentCandidates(partial.recentCandidates, state.recentCandidates ?? DEFAULT_STATE.recentCandidates);
  const replyDetails = normalizeReplyDetails(partial.replyDetails, state.replyDetails ?? DEFAULT_STATE.replyDetails);
  const replyArchiveFallback = Object.entries(replyDetails).map(([targetUrl, detail]) => ({
    targetUrl,
    ...(detail && typeof detail === "object" ? detail : {})
  }));
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
    replyDetails,
    recentCandidates,
    relationshipStates: normalizeRelationshipStates(partial.relationshipStates, state.relationshipStates ?? DEFAULT_STATE.relationshipStates),
    mediaSummaries: normalizeMediaSummaries(partial.mediaSummaries, state.mediaSummaries ?? DEFAULT_STATE.mediaSummaries),
    replyQueue: normalizeReplyQueue(partial.replyQueue, state.replyQueue ?? DEFAULT_STATE.replyQueue),
    publishWatch: normalizePublishWatch(partial.publishWatch, state.publishWatch ?? DEFAULT_STATE.publishWatch),
    pickupWatch: normalizePickupWatch(partial.pickupWatch, state.pickupWatch ?? DEFAULT_STATE.pickupWatch),
    replyArchive: normalizeReplyArchive(
      partial.replyArchive,
      (Array.isArray(state.replyArchive) && state.replyArchive.length)
        ? state.replyArchive
        : replyArchiveFallback
    )
  };

  BOOLEAN_KEYS.forEach((key) => {
    next[key] = Boolean(partial[key] ?? state[key] ?? DEFAULT_STATE[key]);
  });

  KEYWORD_KEYS.forEach((key) => {
    next[key] = normalizeKeywordList(partial[key], state[key] ?? DEFAULT_STATE[key]);
  });

  const filteredCandidates = next.recentCandidates.filter((item) => !next.repliedTweets[item.url] && !next.dismissedTweets[item.url]);
  const removedCandidates = next.recentCandidates.length - filteredCandidates.length;

  next.recentCandidates = filteredCandidates;
  if (removedCandidates > 0) {
    next.visibleCount = Math.max(0, next.visibleCount - removedCandidates);
  }
  next.highScoreCount = countFloatingHighScoreCandidates(next.recentCandidates, next.threshold);

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
  await chrome.storage.local.set({
    [STORAGE_KEY]: state,
    [REPLY_LEDGER_STORAGE_KEY]: Array.isArray(state.replyArchive) ? state.replyArchive : []
  });
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
  const stored = await chrome.storage.local.get([STORAGE_KEY, REPLY_LEDGER_STORAGE_KEY]);
  const storedState = stored[STORAGE_KEY] || null;
  const storedLedger = normalizeReplyArchive(stored[REPLY_LEDGER_STORAGE_KEY], []);
  const normalizedStoredState = storedState ? normalizeState(storedState) : { ...DEFAULT_STATE };
  if (storedLedger.length) {
    const nextReplyDetails = { ...(normalizedStoredState.replyDetails || {}) };
    storedLedger.forEach((entry) => {
      const targetUrl = normalizeTweetUrl(entry?.targetUrl || entry?.url);
      if (!targetUrl) {
        return;
      }
      const existing = nextReplyDetails[targetUrl] || null;
      const entryFreshness = Math.max(
        clampNumber(entry?.performanceLastUpdatedAt, 0),
        clampNumber(entry?.sentAt, 0),
        clampNumber(entry?.timestamp, 0)
      );
      const existingFreshness = Math.max(
        clampNumber(existing?.performanceLastUpdatedAt, 0),
        clampNumber(existing?.sentAt, 0),
        clampNumber(existing?.timestamp, 0)
      );
      if (!existing || entryFreshness >= existingFreshness) {
        nextReplyDetails[targetUrl] = entry;
      }
    });
    state = normalizeState({
      ...normalizedStoredState,
      replyDetails: nextReplyDetails,
      replyArchive: storedLedger.length >= (Array.isArray(normalizedStoredState.replyArchive) ? normalizedStoredState.replyArchive.length : 0)
        ? storedLedger
        : normalizedStoredState.replyArchive
    });
  } else {
    state = normalizedStoredState;
  }
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
  const nextReplyDetail = {
    ledgerId: String(meta.ledgerId || "").trim().slice(0, 160),
    ledgerVersion: REPLY_LEDGER_VERSION,
    timestamp: replyTimestamp,
    parentTweetUrl: normalized,
    tweetId: normalizeApiTweetId(extractTweetIdFromUrl(normalized)),
    draftedAt: clampNumber(meta.draftedAt, clampNumber(meta.queuedAt, clampNumber(meta.handedOffAt, clampNumber(queueMatch?.createdAt, 0)))),
    sentAt: clampNumber(meta.sentAt, replyTimestamp),
    completedAt: replyTimestamp,
    status: String(meta.status || "shipped").trim().slice(0, 24) || "shipped",
    sessionId: String(meta.sessionId || "").trim().slice(0, 80),
    roundId: String(meta.roundId || "").trim().slice(0, 80),
    sendResult: String(meta.sendResult || "sent").trim().slice(0, 40) || "sent",
    score: clampNumber(meta.score, clampNumber(queueMatch?.score, clampNumber(candidateMatch?.score, 0))),
    tier: String(meta.tier || "replied"),
    authorHandle: String(meta.authorHandle || queueMatch?.authorHandle || candidateMatch?.authorHandle || "").trim(),
    authorVerified: Boolean(meta.authorVerified || candidateMatch?.authorVerified),
    authorVerificationType: normalizeAuthorVerificationType(meta.authorVerificationType || candidateMatch?.authorVerificationType),
    text: String(meta.text || queueMatch?.text || queueMatch?.draft || candidateMatch?.text || "").trim().slice(0, 280),
    replyText: String(meta.replyText || meta.text || queueMatch?.draft || queueMatch?.text || candidateMatch?.text || "").trim().slice(0, 560),
    replyUrl: normalizeTweetUrl(meta.replyUrl || replyDetailMatch?.replyUrl),
    replyTweetUrl: normalizeTweetUrl(meta.replyUrl || replyDetailMatch?.replyUrl),
    replyTweetId: normalizeApiTweetId(meta.replyTweetId || extractTweetIdFromUrl(meta.replyUrl || replyDetailMatch?.replyUrl)),
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
    retweets: clampNumber(meta.retweets, clampNumber(queueMatch?.retweets, clampNumber(candidateMatch?.retweets, 0))),
    bookmarks: clampNumber(meta.bookmarks, clampNumber(queueMatch?.bookmarks, clampNumber(candidateMatch?.bookmarks, 0))),
    trafficCapturedAt: clampNumber(meta.trafficCapturedAt, clampNumber(queueMatch?.trafficCapturedAt, clampNumber(candidateMatch?.trafficCapturedAt, 0))),
    trafficAgeHours: clampNumber(meta.trafficAgeHours, clampNumber(queueMatch?.trafficAgeHours, clampNumber(candidateMatch?.trafficAgeHours, 0))),
    trafficVelocityPerHour: clampNumber(meta.trafficVelocityPerHour, clampNumber(queueMatch?.trafficVelocityPerHour, clampNumber(candidateMatch?.trafficVelocityPerHour, 0))),
    trafficReplyVelocityPerHour: clampNumber(meta.trafficReplyVelocityPerHour, clampNumber(queueMatch?.trafficReplyVelocityPerHour, clampNumber(candidateMatch?.trafficReplyVelocityPerHour, 0))),
    trafficEngagementRate: clampNumber(meta.trafficEngagementRate, clampNumber(queueMatch?.trafficEngagementRate, clampNumber(candidateMatch?.trafficEngagementRate, 0))),
    trafficReplyRatio: clampNumber(meta.trafficReplyRatio, clampNumber(queueMatch?.trafficReplyRatio, clampNumber(candidateMatch?.trafficReplyRatio, 0))),
    trafficPhase: String(meta.trafficPhase || queueMatch?.trafficPhase || candidateMatch?.trafficPhase || "").trim().slice(0, 16),
    trafficSource: String(meta.trafficSource || queueMatch?.trafficSource || candidateMatch?.trafficSource || "").trim().slice(0, 24),
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
    pickupAuthorReplyUrl: "",
    replyCheckedAt: 0,
    replyChecks: 0,
    replyObservedReplies: 0,
    replyObservedLikes: 0,
    replyObservedViews: 0,
    replyDeltaReplies: 0,
    replyDeltaLikes: 0,
    replyDeltaViews: 0,
    replyTrafficCapturedAt: 0,
    replyTrafficSource: "",
    performanceLastUpdatedAt: 0,
    performanceLastError: ""
  };
  const nextReplyArchive = upsertReplyArchiveEntry(normalized, nextReplyDetail);

  return patchState({
    repliedTweets: {
      ...state.repliedTweets,
      [normalized]: replyTimestamp
    },
    dismissedTweets: nextDismissedTweets,
    replyDetails: {
      ...state.replyDetails,
      [normalized]: nextReplyDetail
    },
    replyArchive: nextReplyArchive,
    replyQueue: nextReplyQueue,
    publishWatch: nextPublishWatch,
    pickupWatch: nextPickupWatch
  }, "reply-marked");
}

async function unmarkTweetAsReplied(url) {
  const normalized = normalizeTweetUrl(url);
  if (!normalized) {
    return state;
  }

  const nextRepliedTweets = { ...state.repliedTweets };
  const nextReplyDetails = { ...state.replyDetails };
  delete nextRepliedTweets[normalized];
  delete nextReplyDetails[normalized];

  return patchState({
    repliedTweets: nextRepliedTweets,
    replyDetails: nextReplyDetails,
    replyArchive: removeReplyArchiveEntry(normalized),
    pickupWatch: normalizePickupWatch(
      (state.pickupWatch || []).filter((item) => item?.url !== normalized),
      state.pickupWatch
    )
  }, "reply-unmarked");
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
  const nextReplyDetail = {
    ...(replyDetailMatch || {}),
    targetUrl: normalized,
    url: normalized,
    ledgerId: String(replyDetailMatch?.ledgerId || "").trim(),
    timestamp: clampNumber(replyDetailMatch?.timestamp, checkedAt),
    score: clampNumber(replyDetailMatch?.score, score),
    tier: String(replyDetailMatch?.tier || "replied"),
    authorHandle: String(replyDetailMatch?.authorHandle || authorHandle).trim(),
    authorVerified: Boolean(replyDetailMatch?.authorVerified),
    authorVerificationType: normalizeAuthorVerificationType(replyDetailMatch?.authorVerificationType),
    text: String(replyDetailMatch?.text || "").trim().slice(0, 280),
    replyText: String(replyDetailMatch?.replyText || replyDetailMatch?.text || "").trim().slice(0, 560),
    replyUrl: normalizeTweetUrl(replyDetailMatch?.replyUrl),
    replyTweetId: normalizeApiTweetId(replyDetailMatch?.replyTweetId || extractTweetIdFromUrl(replyDetailMatch?.replyUrl)),
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
    pickupAuthorReplyUrl: authorReplyUrl,
    replyCheckedAt: clampNumber(replyDetailMatch?.replyCheckedAt, 0),
    replyChecks: Math.max(0, Math.floor(clampNumber(replyDetailMatch?.replyChecks, 0))),
    replyObservedReplies: clampNumber(replyDetailMatch?.replyObservedReplies, 0),
    replyObservedLikes: clampNumber(replyDetailMatch?.replyObservedLikes, 0),
    replyObservedViews: clampNumber(replyDetailMatch?.replyObservedViews, 0),
    replyDeltaReplies: clampNumber(replyDetailMatch?.replyDeltaReplies, clampNumber(replyDetailMatch?.replyObservedReplies, 0)),
    replyDeltaLikes: clampNumber(replyDetailMatch?.replyDeltaLikes, clampNumber(replyDetailMatch?.replyObservedLikes, 0)),
    replyDeltaViews: clampNumber(replyDetailMatch?.replyDeltaViews, clampNumber(replyDetailMatch?.replyObservedViews, 0)),
    replyTrafficCapturedAt: clampNumber(replyDetailMatch?.replyTrafficCapturedAt, clampNumber(replyDetailMatch?.replyCheckedAt, 0)),
    replyTrafficSource: String(replyDetailMatch?.replyTrafficSource || "").trim().slice(0, 24),
    performanceLastUpdatedAt: Math.max(clampNumber(replyDetailMatch?.performanceLastUpdatedAt, 0), checkedAt),
    performanceLastError: String(replyDetailMatch?.performanceLastError || "").trim().slice(0, 240)
  };
  const nextReplyArchive = upsertReplyArchiveEntry(normalized, nextReplyDetail);

  return patchState({
    replyDetails: {
      ...state.replyDetails,
      [normalized]: nextReplyDetail
    },
    pickupWatch: nextPickupWatch,
    replyArchive: nextReplyArchive
  }, "pickup-recorded");
}

async function recordReplyPerformanceSnapshot(targetUrl, snapshot = {}) {
  const normalizedTarget = normalizeTweetUrl(targetUrl);
  if (!normalizedTarget) {
    return state;
  }

  const replyDetailMatch = state.replyDetails?.[normalizedTarget] || null;
  const archiveMatch = filterReplyLedgerEntries(getReplyLedgerEntries(), {
    targetUrl: normalizedTarget,
    replyUrl: normalizeTweetUrl(snapshot.replyUrl || snapshot.url || replyDetailMatch?.replyUrl),
    replyTweetId: normalizeApiTweetId(snapshot.replyTweetId || snapshot.tweetId || replyDetailMatch?.replyTweetId),
    ledgerId: String(snapshot.ledgerId || replyDetailMatch?.ledgerId || "").trim(),
    limit: 1
  })[0] || null;
  const replyCheckedAt = clampNumber(snapshot.capturedAt, Date.now());
  const replyUrl = normalizeTweetUrl(snapshot.replyUrl || snapshot.url || replyDetailMatch?.replyUrl || archiveMatch?.replyUrl);
  const replyTweetId = normalizeApiTweetId(snapshot.replyTweetId || snapshot.tweetId || replyDetailMatch?.replyTweetId || archiveMatch?.replyTweetId || extractTweetIdFromUrl(replyUrl));
  const observedReplies = Math.max(
    clampNumber(replyDetailMatch?.replyObservedReplies, 0),
    clampNumber(snapshot.replies, clampNumber(replyDetailMatch?.replyObservedReplies, 0))
  );
  const observedLikes = Math.max(
    clampNumber(replyDetailMatch?.replyObservedLikes, 0),
    clampNumber(snapshot.likes, clampNumber(replyDetailMatch?.replyObservedLikes, 0))
  );
  const observedViews = Math.max(
    clampNumber(replyDetailMatch?.replyObservedViews, 0),
    clampNumber(snapshot.views, clampNumber(replyDetailMatch?.replyObservedViews, 0))
  );
  const replyChecks = Math.max(0, Math.floor(clampNumber(replyDetailMatch?.replyChecks ?? archiveMatch?.replyChecks, 0))) + 1;
  const nextReplyDetail = {
    ...(replyDetailMatch || {}),
    targetUrl: normalizedTarget,
    url: normalizedTarget,
    ledgerId: String(snapshot.ledgerId || replyDetailMatch?.ledgerId || archiveMatch?.ledgerId || "").trim(),
    replyUrl,
    replyTweetUrl: replyUrl,
    replyTweetId,
    replyCheckedAt,
    replyChecks,
    replyObservedReplies: observedReplies,
    replyObservedLikes: observedLikes,
    replyObservedViews: observedViews,
    replyDeltaReplies: observedReplies,
    replyDeltaLikes: observedLikes,
    replyDeltaViews: observedViews,
    replyTrafficCapturedAt: replyCheckedAt,
    replyTrafficSource: String(snapshot.replyTrafficSource || snapshot.source || replyDetailMatch?.replyTrafficSource || "reply-dom").trim().slice(0, 24),
    performanceLastUpdatedAt: replyCheckedAt,
    performanceLastError: ""
  };
  const nextReplyArchive = upsertReplyArchiveEntry(normalizedTarget, nextReplyDetail);

  return patchState({
    replyDetails: {
      ...state.replyDetails,
      [normalizedTarget]: nextReplyDetail
    },
    replyArchive: nextReplyArchive
  }, "reply-performance-recorded");
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
    }, "stats", false).then(() => {
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

  if (message.type === "X_REPLY_SCORER_UNMARK_REPLIED") {
    unmarkTweetAsReplied(message.url).then(() => {
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

  if (message.type === "X_REPLY_SCORER_RECORD_REPLY_PERFORMANCE_SNAPSHOT") {
    recordReplyPerformanceSnapshot(message.targetUrl || message.url, message.snapshot || {}).then(() => {
      sendResponse({ ok: true, state: getPublicState() });
    }).catch((error) => {
      sendResponse({ error: String(error?.message || error) });
    });
    return true;
  }

  if (message.type === "X_REPLY_SCORER_EXPORT_REPLY_PERFORMANCE_REPORT") {
    Promise.resolve().then(() => {
      sendResponse({ ok: true, report: getReplyPerformanceReport(message.options || {}) });
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
