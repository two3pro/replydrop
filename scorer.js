(function initScorer(global) {
  const TOPIC_DEFS = [
    {
      key: "ai",
      enabledKey: "aiEnabled",
      keywordsKey: "aiKeywords",
      bonus: 10,
      defaults: ["ai", "chatgpt", "claude", "gemini", "seedance", "即梦", "生成ai", "llm", "agi", "copilot", "grok", "perplexity"]
    },
    {
      key: "crypto",
      enabledKey: "cryptoEnabled",
      keywordsKey: "cryptoKeywords",
      bonus: 10,
      defaults: ["crypto", "bitcoin", "btc", "eth", "bnb", "defi", "nft", "web3", "blockchain", "altcoin", "memecoin", "on-chain"]
    },
    {
      key: "model",
      enabledKey: "modelEnabled",
      keywordsKey: "modelKeywords",
      bonus: 5,
      defaults: ["gpt-4", "gpt-5", "o3", "o4", "claude 3", "claude 4", "gemini", "llama", "mistral", "qwen", "deepseek", "grok", "flux", "midjourney", "sora", "kling", "wan", "hunyuanvideo", "seedance"]
    },
    {
      key: "creator",
      enabledKey: "creatorEnabled",
      keywordsKey: "creatorKeywords",
      bonus: 7,
      defaults: ["creator", "youtube", "youtuber", "streamer", "streaming", "shorts", "reels", "tiktok", "viral", "audience", "subscriber", "monetization", "ugc", "content strategy"]
    },
    {
      key: "gaming",
      enabledKey: "gamingEnabled",
      keywordsKey: "gamingKeywords",
      bonus: 6,
      defaults: ["game", "gaming", "gamer", "steam", "nintendo", "playstation", "xbox", "switch 2", "esports", "speedrun", "gacha", "minecraft", "roblox", "hoyoverse", "gta"]
    },
    {
      key: "business",
      enabledKey: "businessEnabled",
      keywordsKey: "businessKeywords",
      bonus: 7,
      defaults: ["startup", "founder", "saas", "growth", "revenue", "profit", "fundraising", "vc", "product market fit", "ecommerce", "marketing", "earnings"]
    },
    {
      key: "finance",
      enabledKey: "financeEnabled",
      keywordsKey: "financeKeywords",
      bonus: 6,
      defaults: ["stocks", "nasdaq", "s&p 500", "dow jones", "treasury", "fed", "ipo", "market cap", "bond", "inflation", "rate cut", "yield"]
    },
    {
      key: "politics",
      enabledKey: "politicsEnabled",
      keywordsKey: "politicsKeywords",
      bonus: 6,
      defaults: ["election", "vote", "congress", "senate", "white house", "president", "policy", "parliament", "campaign", "tariff", "cabinet", "diplomacy"]
    },
    {
      key: "sports",
      enabledKey: "sportsEnabled",
      keywordsKey: "sportsKeywords",
      bonus: 6,
      defaults: ["nba", "nfl", "mlb", "f1", "ufc", "olympics", "football", "soccer", "tennis", "goal", "championship", "playoffs"]
    },
    {
      key: "entertainment",
      enabledKey: "entertainmentEnabled",
      keywordsKey: "entertainmentKeywords",
      bonus: 5,
      defaults: ["celebrity", "idol", "concert", "music", "album", "drama", "variety show", "tour", "fandom", "trailer", "box office", "tv series"]
    },
    {
      key: "film",
      enabledKey: "filmEnabled",
      keywordsKey: "filmKeywords",
      bonus: 5,
      defaults: ["movie", "cinema", "director", "screenplay", "scene", "letterboxd", "criterion", "festival", "documentary", "actor", "actress", "shot"]
    },
    {
      key: "fashion",
      enabledKey: "fashionEnabled",
      keywordsKey: "fashionKeywords",
      bonus: 5,
      defaults: ["fashion", "runway", "lookbook", "outfit", "designer", "vogue", "styling", "streetwear", "beauty", "makeup", "skincare", "luxury"]
    },
    {
      key: "travel",
      enabledKey: "travelEnabled",
      keywordsKey: "travelKeywords",
      bonus: 5,
      defaults: ["travel", "trip", "flight", "hotel", "itinerary", "beach", "mountain", "resort", "tourism", "citywalk", "backpacking", "destination"]
    },
    {
      key: "books",
      enabledKey: "booksEnabled",
      keywordsKey: "booksKeywords",
      bonus: 5,
      defaults: ["book", "novel", "poem", "essay", "literature", "author", "reading", "bookstore", "quote", "translation", "fiction", "memoir"]
    }
  ];

  const LANGUAGE_DEFS = [
    { key: "langZh", bonus: 4, codes: ["zh", "zh-cn", "zh-hans", "zh-tw", "zh-hant", "zh-hk"], test: isChinese },
    { key: "langEn", bonus: 2, codes: ["en", "en-us", "en-gb"] },
    { key: "langJa", bonus: 5, codes: ["ja", "ja-jp"], test: isJapanese },
    { key: "langKo", bonus: 5, codes: ["ko", "ko-kr"], test: isKorean },
    { key: "langFr", bonus: 3, codes: ["fr", "fr-fr", "fr-ca"] },
    { key: "langEs", bonus: 3, codes: ["es", "es-es", "es-419", "es-mx"] },
    { key: "langDe", bonus: 3, codes: ["de", "de-de"] },
    { key: "langIt", bonus: 3, codes: ["it", "it-it"] },
    { key: "langPt", bonus: 3, codes: ["pt", "pt-br", "pt-pt"] },
    { key: "langRu", bonus: 4, codes: ["ru", "ru-ru"], test: isCyrillic },
    { key: "langAr", bonus: 4, codes: ["ar", "ar-sa", "ar-ae"], test: isArabic }
  ];

  const DEFAULT_SETTINGS = {
    enabled: true,
    displayThreshold: 30,
    goodThreshold: 60,
    highThreshold: 80,
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
    aiEnabled: true,
    cryptoEnabled: true,
    modelEnabled: true,
    creatorEnabled: false,
    gamingEnabled: false,
    businessEnabled: false,
    financeEnabled: false,
    politicsEnabled: false,
    sportsEnabled: false,
    entertainmentEnabled: false,
    filmEnabled: false,
    fashionEnabled: false,
    travelEnabled: false,
    booksEnabled: false
  };

  TOPIC_DEFS.forEach((topic) => {
    DEFAULT_SETTINGS[topic.keywordsKey] = topic.defaults;
  });

  const PHOTO_BONUS = 6;
  const VIDEO_BONUS = 10;
  const COUNT_TOKEN_RE = /(\d+(?:[.,]\d+)?)(?:\s*([KMBkmb万萬億亿千]))?/;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function parseCount(value) {
    if (value == null) {
      return null;
    }

    const raw = String(value).replace(/\s+/g, " ").trim();
    if (!raw) {
      return null;
    }

    const normalized = raw.replace(/,/g, "");
    const match = normalized.match(COUNT_TOKEN_RE);
    if (!match) {
      return null;
    }

    let amount = Number.parseFloat(match[1].replace(/,/g, ""));
    if (!Number.isFinite(amount)) {
      return null;
    }

    const unit = match[2] || "";
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit === "k") amount *= 1e3;
    if (lowerUnit === "m") amount *= 1e6;
    if (lowerUnit === "b") amount *= 1e9;
    if (unit === "千") amount *= 1e3;
    if (unit === "万" || unit === "萬") amount *= 1e4;
    if (unit === "亿" || unit === "億") amount *= 1e8;

    return Math.round(amount);
  }

  function normalizeLog(value, maxBase, weight) {
    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }
    return clamp(Math.log10(value + 1) / maxBase, 0, 1) * weight;
  }

  function getTweetAgeMinutes(timestamp) {
    if (!timestamp) {
      return null;
    }
    const ageMinutes = (Date.now() - timestamp) / 60000;
    if (!Number.isFinite(ageMinutes) || ageMinutes < 0) {
      return null;
    }
    return ageMinutes;
  }

  function computeRecencyScore(timestamp, weight) {
    const ageMinutes = getTweetAgeMinutes(timestamp);
    if (ageMinutes == null) {
      return null;
    }

    let freshnessFit = 0;
    if (ageMinutes <= 75) {
      freshnessFit = 1;
    } else if (ageMinutes <= 180) {
      freshnessFit = 1 - ((ageMinutes - 75) / 105) * 0.65;
    } else {
      freshnessFit = 0.35 - ((ageMinutes - 180) / 180) * 0.35;
    }

    return clamp(freshnessFit, 0, 1) * weight;
  }

  function normalizeKeywords(list) {
    if (!Array.isArray(list)) {
      return [];
    }
    return list.map((item) => String(item || "").trim()).filter(Boolean);
  }

  function normalizeLangs(list) {
    if (!Array.isArray(list)) {
      return [];
    }
    return Array.from(new Set(
      list
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean)
    ));
  }

  function mergeSettings(settings = {}) {
    const merged = {
      ...DEFAULT_SETTINGS,
      ...settings
    };
    TOPIC_DEFS.forEach((topic) => {
      merged[topic.keywordsKey] = normalizeKeywords(settings[topic.keywordsKey] ?? DEFAULT_SETTINGS[topic.keywordsKey]);
    });
    return merged;
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function isAsciiKeyword(keyword) {
    return /^[a-z0-9 _.+#-]+$/i.test(keyword);
  }

  function matchesKeywords(text, keywords) {
    const haystack = String(text || "").toLowerCase();
    if (!haystack) {
      return false;
    }

    return normalizeKeywords(keywords).some((keyword) => {
      const normalizedKeyword = keyword.toLowerCase();
      if (!normalizedKeyword) {
        return false;
      }
      if (!isAsciiKeyword(normalizedKeyword)) {
        return haystack.includes(normalizedKeyword);
      }
      const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}($|[^a-z0-9])`, "i");
      return pattern.test(haystack);
    });
  }

  function isJapanese(text) {
    return /[\u3040-\u30ff\u31f0-\u31ff]/.test(String(text || ""));
  }

  function isKorean(text) {
    return /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/i.test(String(text || ""));
  }

  function isChinese(text) {
    const value = String(text || "");
    const hasHan = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(value);
    return hasHan && !isJapanese(value) && !isKorean(value);
  }

  function isCyrillic(text) {
    return /[\u0400-\u04ff\u0500-\u052f]/.test(String(text || ""));
  }

  function isArabic(text) {
    return /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/.test(String(text || ""));
  }

  function hasLangCode(tweet, codes) {
    const langs = normalizeLangs(tweet.langs);
    if (!langs.length) {
      return false;
    }
    return langs.some((lang) => codes.some((code) => lang === code || lang.startsWith(`${code}-`)));
  }

  function languageMatches(tweet, def) {
    if (Array.isArray(def.codes) && hasLangCode(tweet, def.codes)) {
      return true;
    }
    if (typeof def.test === "function" && def.test(tweet.text || "")) {
      return true;
    }
    return false;
  }

  function computeConversationBonus(tweet, weight = 8) {
    if (!Number.isFinite(tweet.views) || !Number.isFinite(tweet.replies) || tweet.views <= 0 || tweet.replies <= 0) {
      return null;
    }

    const ratio = tweet.replies / Math.max(tweet.views, 1);
    if (!Number.isFinite(ratio) || ratio <= 0) {
      return null;
    }

    const ageMinutes = getTweetAgeMinutes(tweet.timestamp) ?? 180;
    const replyRoomFit = clamp((tweet.replies - 6) / 42, 0, 1) * (1 - clamp((tweet.replies - 180) / 320, 0, 1));
    const ratioFit = clamp(ratio / 0.02, 0, 1);
    const windowFit = ageMinutes <= 180 ? 1 : clamp(1 - (ageMinutes - 180) / 240, 0.25, 1);
    const bonus = ((ratioFit * 0.55) + (replyRoomFit * 0.45)) * windowFit * weight;
    return bonus >= 0.75 ? bonus : null;
  }

  function computeAccelerationWindowBonus(tweet, weight = 18) {
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (ageMinutes == null || ageMinutes > 240 || views <= 0) {
      return null;
    }

    const hoursSincePost = Math.max(ageMinutes / 60, 0.2);
    const viewsPerHour = views / hoursSincePost;
    const repliesPerHour = replies / hoursSincePost;

    let windowFit = 0;
    if (ageMinutes < 12) {
      windowFit = clamp(ageMinutes / 12, 0.45, 1) * 0.7;
    } else if (ageMinutes <= 75) {
      windowFit = 1;
    } else if (ageMinutes <= 180) {
      windowFit = clamp(1 - (ageMinutes - 75) / 105, 0, 1);
    } else {
      windowFit = clamp(0.25 - ((ageMinutes - 180) / 60) * 0.25, 0, 0.25);
    }

    const proofFit = clamp((Math.log10(views + 1) - 3.2) / 1.4, 0, 1);
    const velocityFit = clamp((Math.log10(viewsPerHour + 1) - 3.7) / 1.25, 0, 1);
    const replyFit = clamp((Math.log10(repliesPerHour + 1) - 0.9) / 1.1, 0, 1);
    const engagementFit = clamp((Math.log10(likes + 1) - 1.8) / 1.2, 0, 1);

    const bonus = (
      (proofFit * 0.36) +
      (velocityFit * 0.34) +
      (replyFit * 0.18) +
      (engagementFit * 0.12)
    ) * windowFit * weight;

    return bonus >= 1 ? bonus : null;
  }

  function computeUnprovenWindowPenalty(tweet, weight = 8) {
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (ageMinutes == null || ageMinutes > 90) {
      return null;
    }
    if (views >= 1200 || replies >= 10 || likes >= 100) {
      return null;
    }

    const ageFit = ageMinutes < 12 ? 0.6 : 1;
    const penalty = (
      clamp((1200 - views) / 1200, 0, 1) * 0.55 +
      clamp((10 - replies) / 10, 0, 1) * 0.3 +
      clamp((100 - likes) / 100, 0, 1) * 0.15
    ) * ageFit * weight;

    return penalty >= 2 ? penalty : null;
  }

  function computePeakDecayPenalty(tweet, weight = 16) {
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    if (ageMinutes == null || ageMinutes <= 120) {
      return null;
    }
    if (views < 30000 && replies < 180) {
      return null;
    }

    const staleFit = clamp((ageMinutes - 120) / 360, 0, 1);
    const reachFit = clamp((Math.log10(views + 1) - 4.5) / 1.7, 0, 1);
    const crowdFit = clamp((Math.log10(replies + 1) - 2.2) / 1.1, 0, 1);
    const penalty = ((reachFit * 0.6) + (crowdFit * 0.4)) * staleFit * weight;
    return penalty >= 2 ? penalty : null;
  }

  function computeCrowdingPenalty(tweet) {
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (replies <= 0 && views <= 0 && likes <= 0) {
      return null;
    }

    const conversationRatio = (views > 0 && replies > 0) ? (replies / views) : 0;
    const likeReplyRatio = (likes > 0 && replies > 0) ? (likes / replies) : null;

    let penalty = 0;

    if (replies >= 120) {
      penalty += clamp((Math.log10(replies + 1) - Math.log10(120)) / 1.35, 0, 1) * 18;
    }

    if (views >= 80000) {
      penalty += clamp((Math.log10(views + 1) - Math.log10(80000)) / 1.65, 0, 1) * 16;
    }

    if (views >= 250000) {
      const shallowConversationPenalty = clamp((0.0035 - conversationRatio) / 0.0035, 0, 1) * 10;
      const broadcastPenalty = likeReplyRatio && likeReplyRatio > 30
        ? clamp((likeReplyRatio - 30) / 70, 0, 1) * 8
        : 0;
      penalty += Math.max(shallowConversationPenalty, broadcastPenalty);
    }

    if (replies >= 400 && views >= 400000) {
      penalty += 6;
    }
    if (replies >= 700 && views >= 500000) {
      penalty += 10;
    }
    if (replies >= 2500 && views >= 3000000) {
      penalty += 8;
    }

    const rounded = Math.round(clamp(penalty, 0, 64));
    return rounded >= 3 ? rounded : null;
  }

  function formatBreakdownText(item) {
    const rounded = Math.round(item.amount);
    const sign = rounded > 0 ? "+" : "";
    return `${item.label} ${sign}${rounded}`;
  }

  function buildHighlights(positiveBreakdown, negativeBreakdown) {
    const highlights = [];

    if (positiveBreakdown[0]) {
      highlights.push(formatBreakdownText(positiveBreakdown[0]));
    }
    if (negativeBreakdown[0]) {
      highlights.push(formatBreakdownText(negativeBreakdown[0]));
    }
    positiveBreakdown.slice(1, 3).forEach((item) => {
      highlights.push(formatBreakdownText(item));
    });
    negativeBreakdown.slice(1, 2).forEach((item) => {
      highlights.push(formatBreakdownText(item));
    });

    return highlights.slice(0, 4);
  }

  function buildAnalysis(tweet, settings = {}) {
    const merged = mergeSettings(settings);
    const parts = [];
    const breakdown = [];
    let availableWeight = 0;

    const metrics = [
      { key: "authorFollowers", label: "Reach", value: tweet.authorFollowers, maxBase: 6, weight: 16 },
      { key: "likes", label: "Likes", value: tweet.likes, maxBase: 4, weight: 16 },
      { key: "replies", label: "Replies", value: tweet.replies, maxBase: 3, weight: 24 },
      { key: "views", label: "Views", value: tweet.views, maxBase: 6, weight: 22 }
    ];

    for (const metric of metrics) {
      const partial = normalizeLog(metric.value, metric.maxBase, metric.weight);
      if (partial == null) {
        continue;
      }
      parts.push(partial);
      breakdown.push({
        key: metric.key,
        label: metric.label,
        amount: partial,
        kind: "momentum"
      });
      availableWeight += metric.weight;
    }

    const recency = computeRecencyScore(tweet.timestamp, 14);
    if (recency != null) {
      parts.push(recency);
      breakdown.push({
        key: "freshness",
        label: "Freshness",
        amount: recency,
        kind: "timing"
      });
      availableWeight += 14;
    }

    const matches = {};
    const matchedLanguages = [];
    const matchedTopics = [];

    LANGUAGE_DEFS.forEach((language) => {
      const matched = merged[language.key] && languageMatches(tweet, language);
      matches[language.key] = matched;
      if (matched) {
        matchedLanguages.push(language);
      }
    });

    TOPIC_DEFS.forEach((topic) => {
      const matched = merged[topic.enabledKey] && matchesKeywords(tweet.text || "", merged[topic.keywordsKey]);
      matches[topic.key] = matched;
      if (matched) {
        matchedTopics.push(topic);
      }
    });

    const keywordMatched = Object.values(matches).some(Boolean);
    let score = (parts.length && availableWeight > 0)
      ? (parts.reduce((sum, current) => sum + current, 0) / availableWeight) * 100
      : 0;

    const accelerationWindowBonus = computeAccelerationWindowBonus(tweet, 18);
    if (accelerationWindowBonus != null) {
      score += accelerationWindowBonus;
      breakdown.push({
        key: "accelerationWindow",
        label: "Acceleration window",
        amount: accelerationWindowBonus,
        kind: "timing"
      });
    }

    const unprovenWindowPenalty = computeUnprovenWindowPenalty(tweet, 8);
    if (unprovenWindowPenalty != null) {
      score -= unprovenWindowPenalty;
      breakdown.push({
        key: "unprovenWindow",
        label: "Not moving yet",
        amount: -unprovenWindowPenalty,
        kind: "penalty"
      });
    }

    if (tweet.authorVerified) {
      score += 5;
      breakdown.push({
        key: "verified",
        label: "Verified account",
        amount: 5,
        kind: "account"
      });
    }

    const conversationBonus = computeConversationBonus(tweet, 8);
    if (conversationBonus != null) {
      score += conversationBonus;
      breakdown.push({
        key: "conversation",
        label: "Discussion density",
        amount: conversationBonus,
        kind: "quality"
      });
    }

    const crowdingPenalty = computeCrowdingPenalty(tweet);
    if (crowdingPenalty != null) {
      score -= crowdingPenalty;
      breakdown.push({
        key: "crowding",
        label: "Crowded thread",
        amount: -crowdingPenalty,
        kind: "penalty"
      });
    }

    const peakDecayPenalty = computePeakDecayPenalty(tweet, 16);
    if (peakDecayPenalty != null) {
      score -= peakDecayPenalty;
      breakdown.push({
        key: "peakDecay",
        label: "Past peak",
        amount: -peakDecayPenalty,
        kind: "penalty"
      });
    }

    matchedLanguages.forEach((language) => {
      score += language.bonus;
      breakdown.push({
        key: language.key,
        label: language.key.replace(/^lang/, ""),
        amount: language.bonus,
        kind: "language"
      });
    });

    matchedTopics.forEach((topic) => {
      score += topic.bonus;
      breakdown.push({
        key: topic.key,
        label: topic.key,
        amount: topic.bonus,
        kind: "topic"
      });
    });

    if (tweet.mediaKind === "video" || tweet.mediaKind === "gif") {
      score += VIDEO_BONUS;
      breakdown.push({
        key: tweet.mediaKind,
        label: tweet.mediaKind === "gif" ? "GIF" : "Video",
        amount: VIDEO_BONUS,
        kind: "media"
      });
    } else if (tweet.hasMedia) {
      score += PHOTO_BONUS;
      breakdown.push({
        key: "photo",
        label: "Photo",
        amount: PHOTO_BONUS,
        kind: "media"
      });
    }

    const clampedScore = Math.round(clamp(score, 0, 100));
    const tier = getTier(clampedScore, merged, keywordMatched);
    const scoredBreakdown = breakdown
      .filter((item) => Number.isFinite(item.amount) && Math.abs(item.amount) > 0);
    const sortedBreakdown = scoredBreakdown
      .slice()
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    const positiveBreakdown = scoredBreakdown
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    const negativeBreakdown = scoredBreakdown
      .filter((item) => item.amount < 0)
      .sort((a, b) => a.amount - b.amount);

    const highlights = buildHighlights(positiveBreakdown, negativeBreakdown);

    const tooltipLines = [
      `Score ${clampedScore} · ${tier}`,
      ...positiveBreakdown.slice(0, 4).map(formatBreakdownText),
      ...negativeBreakdown.slice(0, 2).map(formatBreakdownText)
    ];

    return {
      score: clampedScore,
      tier,
      matches,
      keywordMatched,
      matchedLanguages: matchedLanguages.map((language) => language.key),
      matchedTopics: matchedTopics.map((topic) => topic.key),
      breakdown: sortedBreakdown,
      highlights,
      tooltip: tooltipLines.join("\n")
    };
  }

  function analyzeTweet(tweet, settings = {}) {
    return buildAnalysis(tweet, settings);
  }

  function calcVps(tweet, settings = {}) {
    return buildAnalysis(tweet, settings).score;
  }

  function getTier(score, settings = {}, keywordMatched = true) {
    const merged = mergeSettings(settings);
    if (merged.onlyKeywordHits && !keywordMatched) {
      return "hidden";
    }
    if (!merged.enabled) {
      return "hidden";
    }
    if (score >= merged.highThreshold) {
      return "high";
    }
    if (score >= merged.highThreshold - 10) {
      return "high-outline";
    }
    if (score >= merged.goodThreshold) {
      return "good";
    }
    if (score >= merged.goodThreshold - 10) {
      return "good-outline";
    }
    if (score >= merged.displayThreshold) {
      return "medium";
    }
    if (score >= Math.max(20, merged.displayThreshold - 10)) {
      return "medium-outline";
    }
    if (score >= 10) {
      return "low-outline";
    }
    return "hidden";
  }

  global.XReplyScorer = {
    defaults: DEFAULT_SETTINGS,
    topicDefs: TOPIC_DEFS,
    languageDefs: LANGUAGE_DEFS,
    parseCount,
    calcVps,
    getTier,
    analyzeTweet,
    explainTweet: buildAnalysis,
    normalizeKeywords
  };
})(globalThis);
