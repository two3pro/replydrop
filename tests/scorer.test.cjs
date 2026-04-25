const test = require("node:test");
const assert = require("node:assert/strict");

function loadScorer() {
  const scorerPath = require.resolve("../scorer.js");
  delete require.cache[scorerPath];
  delete globalThis.XReplyScorer;
  require("../scorer.js");
  return globalThis.XReplyScorer;
}

test("scorer favors fresh accelerating posts over late crowded peaks", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const fresh = scorer.analyzeTweet({
    text: "Fresh thread with clear discussion momentum and visible room for a substantive reply.",
    authorFollowers: 22000,
    likes: 360,
    replies: 28,
    views: 12500,
    timestamp: now - (42 * 60 * 1000),
    authorVerified: false,
    hasMedia: true,
    mediaKind: "video",
    langs: ["en"]
  });

  const stalePeak = scorer.analyzeTweet({
    text: "Huge post that already peaked and is now crowded with generic agreement.",
    authorFollowers: 550000,
    likes: 24000,
    replies: 680,
    views: 420000,
    timestamp: now - (5 * 60 * 60 * 1000),
    authorVerified: true,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(fresh.score > stalePeak.score);
  assert.ok(fresh.breakdown.some((item) => item.key === "accelerationWindow"));
  assert.ok(stalePeak.breakdown.some((item) => item.key === "peakDecay"));
});

test("scorer penalizes fresh posts that have not proven reach yet", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const unproven = scorer.analyzeTweet({
    text: "Tiny early post with almost no reaction yet.",
    authorFollowers: 18000,
    likes: 16,
    replies: 2,
    views: 340,
    timestamp: now - (34 * 60 * 1000),
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const proven = scorer.analyzeTweet({
    text: "Early post that already has visible distribution and enough room for a real reply.",
    authorFollowers: 18000,
    likes: 140,
    replies: 14,
    views: 5400,
    timestamp: now - (34 * 60 * 1000),
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(proven.score > unproven.score);
  assert.ok(unproven.breakdown.some((item) => item.key === "unprovenWindow"));
  assert.ok(proven.breakdown.some((item) => item.key === "accelerationWindow"));
});

test("scorer prefers conversational mid-size threads over broadcast-heavy giants", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const conversational = scorer.analyzeTweet({
    text: "Medium thread where people are still actually talking to each other.",
    authorFollowers: 18000,
    likes: 210,
    replies: 24,
    views: 7600,
    timestamp: now - (55 * 60 * 1000),
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const broadcast = scorer.analyzeTweet({
    text: "Huge broadcast post with applause and almost no real room left in the reply tree.",
    authorFollowers: 420000,
    likes: 8100,
    replies: 95,
    views: 220000,
    timestamp: now - (55 * 60 * 1000),
    authorVerified: true,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(conversational.score > broadcast.score);
  assert.ok(conversational.breakdown.some((item) => item.key === "replyOpportunity"));
  assert.ok(broadcast.breakdown.some((item) => item.key === "crowding"));
});

test("scorer penalizes verified official broadcasters when the thread is one-way", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const broadcaster = scorer.analyzeTweet({
    text: "Official update: road closure details below. Read more in the full statement.",
    authorName: "City Newsroom",
    authorHandle: "citygovupdates",
    authorFollowers: 280000,
    likes: 3200,
    replies: 18,
    views: 120000,
    timestamp: now - (38 * 60 * 1000),
    authorVerified: true,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const interactive = scorer.analyzeTweet({
    text: "What part of your workflow still breaks most often? Curious what people are seeing.",
    authorName: "Alex Rivera",
    authorHandle: "alexbuilds",
    authorFollowers: 42000,
    likes: 240,
    replies: 31,
    views: 11000,
    timestamp: now - (38 * 60 * 1000),
    authorVerified: true,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(interactive.score > broadcaster.score);
  assert.ok(broadcaster.breakdown.some((item) => item.key === "broadcastAccount"));
});

test("scorer pushes gold verified org posts below interactive people when reply room is weak", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const goldOrg = scorer.analyzeTweet({
    text: "Quarterly store rollout update. Full campaign assets below.",
    authorName: "Acme Brand",
    authorHandle: "acmebrand",
    authorFollowers: 310000,
    likes: 2600,
    replies: 19,
    views: 98000,
    timestamp: now - (44 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const interactive = scorer.analyzeTweet({
    text: "What are you shipping this week that you think people will underrate?",
    authorName: "Mina Chen",
    authorHandle: "minamakes",
    authorFollowers: 28000,
    likes: 230,
    replies: 27,
    views: 9200,
    timestamp: now - (44 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(interactive.score > goldOrg.score);
  assert.ok(goldOrg.breakdown.some((item) => item.key === "verifiedOrganization"));
  assert.ok(interactive.authorFit >= goldOrg.authorFit);
});

test("scorer crushes blue verified follow-train bait even when replies look active", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const bait = scorer.analyzeTweet({
    text: "Want real followers fast? Say Hello below. Let's connect & grow together.",
    authorName: "Chief.O",
    authorHandle: "chiefosis96",
    authorFollowers: 12000,
    likes: 12,
    replies: 24,
    views: 104,
    timestamp: now - (10 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const interactive = scorer.analyzeTweet({
    text: "What changed in your workflow this week that made people actually reply with useful detail?",
    authorName: "Iris Song",
    authorHandle: "irisships",
    authorFollowers: 36000,
    likes: 130,
    replies: 26,
    views: 9800,
    timestamp: now - (10 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(interactive.score > bait.score);
  assert.ok(bait.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(bait.reachLikelihood < interactive.reachLikelihood);
  assert.ok(bait.score < 55);
});

test("scorer demotes mutual and repost growth bait before auto-send floor", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const mutualBait = scorer.analyzeTweet({
    text: "Looking for active mutuals. Follow me and repost this, I follow back fast.",
    authorName: "Sandy",
    authorHandle: "SANDY4AYU",
    authorFollowers: 18000,
    likes: 88,
    replies: 42,
    views: 1600,
    timestamp: now - (16 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const chineseBait = scorer.analyzeTweet({
    text: "互关互粉，点关注我，评论区扣1，帮转一下。",
    authorName: "涨粉互助",
    authorHandle: "farman4x",
    authorFollowers: 9000,
    likes: 64,
    replies: 36,
    views: 1200,
    timestamp: now - (12 * 60 * 1000),
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["zh"]
  });

  const realDiscussion = scorer.analyzeTweet({
    text: "What kind of small account reply actually made someone keep talking with you this week?",
    authorName: "Mina Chen",
    authorHandle: "minamakes",
    authorFollowers: 24000,
    likes: 145,
    replies: 24,
    views: 8200,
    timestamp: now - (16 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(mutualBait.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(chineseBait.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(realDiscussion.score > mutualBait.score);
  assert.ok(realDiscussion.score > chineseBait.score);
  assert.ok(mutualBait.score < 54);
  assert.ok(chineseBait.score < 54);
});

test("scorer blocks recommendation-list and keyword-comment growth bait", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const recommendationList = scorer.analyzeTweet({
    text: "中文 AI 高质量信息源，以下8个中文AI博主，强烈推荐关注！",
    authorName: "AI curator",
    authorHandle: "BTCqzy1",
    authorFollowers: 52000,
    likes: 620,
    replies: 46,
    views: 28000,
    timestamp: now - (18 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["zh"]
  });

  const writeHelp = scorer.analyzeTweet({
    text: "5M Impression are not easy!! But I want everyone to monetize their X account. Just write \"help\"",
    authorName: "Sir Onyeka",
    authorHandle: "_Sironyeka",
    authorFollowers: 18000,
    likes: 420,
    replies: 71,
    views: 24000,
    timestamp: now - (22 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const obfuscatedGrowth = scorer.analyzeTweet({
    text: "gr0wing your account. Drop a reply below and I will f0ll0w you.",
    authorName: "Amooh",
    authorHandle: "amooh001",
    authorFollowers: 22000,
    likes: 520,
    replies: 80,
    views: 26000,
    timestamp: now - (16 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const likeBookmark = scorer.analyzeTweet({
    text: "点个赞收个藏，后面我接着更。",
    authorName: "长帖作者",
    authorHandle: "bo7med90",
    authorFollowers: 38000,
    likes: 680,
    replies: 39,
    views: 31000,
    timestamp: now - (18 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["zh"]
  });

  const commentGrowth = scorer.analyzeTweet({
    text: "GM 我辈同道中人，评论区集合 一同携手、助力 #蓝V 增长公益事业",
    authorName: "AI增长笔记",
    authorHandle: "xingzhanAI",
    authorFollowers: 34000,
    likes: 310,
    replies: 58,
    views: 17000,
    timestamp: now - (20 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["zh"]
  });

  assert.ok(recommendationList.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(writeHelp.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(obfuscatedGrowth.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(likeBookmark.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(commentGrowth.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(recommendationList.score < 54);
  assert.ok(writeHelp.score < 54);
  assert.ok(obfuscatedGrowth.score < 54);
  assert.ok(likeBookmark.score < 54);
  assert.ok(commentGrowth.score < 54);
});

test("scorer demotes p2.192 pressure-run growth and promo leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const paydayBait = scorer.analyzeTweet({
    text: "X payday is coming. Monetising your account is easier if you say hi below and I'll boost you.",
    authorName: "Abdul iConnect",
    authorHandle: "Abduliconnect",
    authorFollowers: 46000,
    likes: 920,
    replies: 96,
    views: 42000,
    timestamp: now - (18 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const chineseGrowthCase = scorer.analyzeTweet({
    text: "我从0到10k粉丝只用了3天，这篇百万曝光复盘告诉你怎么涨粉变现，评论区说 hi 我帮你看号。",
    authorName: "AI 增长案例",
    authorHandle: "jinchenma_ai",
    authorFollowers: 58000,
    likes: 1300,
    replies: 88,
    views: 52000,
    timestamp: now - (20 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["zh"]
  });

  const officialProduct = scorer.analyzeTweet({
    text: "DeepSeek V4 is now supported in OpenCode. Update today for faster coding.",
    authorName: "OpenCode",
    authorHandle: "opencode",
    authorFollowers: 210000,
    likes: 3200,
    replies: 55,
    views: 180000,
    timestamp: now - (24 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const protocolBroadcast = scorer.analyzeTweet({
    text: "Protocol FX TVL hits a new high after the Hong Kong Web3 event. Liquidity premium and buyback narrative starting now.",
    authorName: "Protocol FX",
    authorHandle: "protocol_fx",
    authorFollowers: 96000,
    likes: 1200,
    replies: 48,
    views: 88000,
    timestamp: now - (26 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const tokenHypeList = scorer.analyzeTweet({
    text: "$BXC / $SPK / $CHIP watchlist: buyback, TVL growth and liquidity premium. Don't chase too late.",
    authorName: "Token Lite",
    authorHandle: "WWTLitee",
    authorFollowers: 34000,
    likes: 820,
    replies: 38,
    views: 36000,
    timestamp: now - (15 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(paydayBait.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(chineseGrowthCase.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(officialProduct.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(protocolBroadcast.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(tokenHypeList.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(paydayBait.score < 54);
  assert.ok(chineseGrowthCase.score < 54);
  assert.ok(officialProduct.score < 54);
  assert.ok(protocolBroadcast.score < 54);
  assert.ok(tokenHypeList.score < 54);
});

test("scorer demotes p2.193 multilingual growth and broadcast leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const koreanGrowth = scorer.analyzeTweet({
    text: "팔로워 10K 돌파 감사합니다. 맞팔하고 댓글 남겨주시면 같이 성장해요.",
    authorName: "Korean growth diary",
    authorHandle: "jk_sats",
    authorFollowers: 64000,
    likes: 980,
    replies: 86,
    views: 41000,
    timestamp: now - (21 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["ko"]
  });

  const japaneseFollowCta = scorer.analyzeTweet({
    text: "フォロワーさん募集。リプしてくれた人はフォロバします、拡散もお願いします。",
    authorName: "Garrel Channel",
    authorHandle: "Garrel_Channel",
    authorFollowers: 52000,
    likes: 760,
    replies: 68,
    views: 29000,
    timestamp: now - (25 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["ja"]
  });

  const officialService = scorer.analyzeTweet({
    text: "Service status update: the VPN gateway is now restored. Read more in the full incident report.",
    authorName: "LetsVPN Official",
    authorHandle: "letsvpn",
    authorFollowers: 430000,
    likes: 4600,
    replies: 41,
    views: 210000,
    timestamp: now - (29 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const gameBrandAward = scorer.analyzeTweet({
    text: "We are pleased to announce that our studio won the award. Thank you for your support.",
    authorName: "Kojima Productions",
    authorHandle: "KojiPro2015",
    authorFollowers: 1200000,
    likes: 9800,
    replies: 96,
    views: 540000,
    timestamp: now - (35 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  assert.ok(koreanGrowth.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(japaneseFollowCta.breakdown.some((item) => item.key === "followTrainBait"));
  assert.ok(officialService.breakdown.some((item) => item.key === "broadcastAccount"));
  assert.ok(gameBrandAward.breakdown.some((item) => item.key === "broadcastAccount"));
  assert.ok(koreanGrowth.score < 54);
  assert.ok(japaneseFollowCta.score < 54);
  assert.ok(officialService.score < 54);
  assert.ok(gameBrandAward.score < 54);
});

test("scorer demotes p2.193 unsupported language, political news, and web3 event leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const turkishUnsupported = scorer.analyzeTweet({
    text: "Erkekler lokali bugün çok yoğun, takip ve yorum atan herkesle etkileşim yapıyoruz.",
    authorName: "Erkekler Lokali",
    authorHandle: "Erkeklerlokali",
    authorFollowers: 48000,
    likes: 730,
    replies: 52,
    views: 25000,
    timestamp: now - (18 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["tr"]
  });

  const bricsBroadcast = scorer.analyzeTweet({
    text: "BRICS leaders announce a new geopolitical trade statement after the summit.",
    authorName: "BRICS News",
    authorHandle: "BRICSinfo",
    authorFollowers: 980000,
    likes: 6400,
    replies: 73,
    views: 420000,
    timestamp: now - (27 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const web3Networking = scorer.analyzeTweet({
    text: "Join us at the Hong Kong Web3 event for exchange networking, market maker panels and partner side events.",
    authorName: "Bybit Events",
    authorHandle: "bishengkegs",
    authorFollowers: 87000,
    likes: 1100,
    replies: 58,
    views: 68000,
    timestamp: now - (22 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const salaciousPrompt = scorer.analyzeTweet({
    text: "Stable diffusion image prompt for sexy bikini AI girl, save this prompt for later.",
    authorName: "AI Image Prompt",
    authorHandle: "fdtreesky",
    authorFollowers: 36000,
    likes: 840,
    replies: 42,
    views: 33000,
    timestamp: now - (19 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  assert.ok(turkishUnsupported.breakdown.some((item) => item.key === "unsupportedLanguage"));
  assert.ok(bricsBroadcast.breakdown.some((item) => item.key === "politicalFigure"));
  assert.ok(web3Networking.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(salaciousPrompt.breakdown.some((item) => item.key === "riskyContent"));
  assert.ok(turkishUnsupported.score < 54);
  assert.ok(bricsBroadcast.score < 54);
  assert.ok(web3Networking.score < 54);
  assert.ok(salaciousPrompt.score < 54);
});

test("scorer demotes empty text candidates before recommendation", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const emptyCandidate = scorer.analyzeTweet({
    text: "",
    authorName: "Empty Candidate",
    authorHandle: "xx03199",
    authorFollowers: 42000,
    likes: 740,
    replies: 44,
    views: 39000,
    timestamp: now - (14 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: []
  });

  assert.ok(emptyCandidate.breakdown.some((item) => item.key === "emptySemanticText"));
  assert.ok(emptyCandidate.score < 54);
  assert.equal(emptyCandidate.matchedLanguages.length, 0);
});

test("scorer penalizes political figure accounts that are risky and low-interaction", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const politician = scorer.analyzeTweet({
    text: "Thank you to everyone who came to tonight's campaign rally. We will keep fighting for working families across the state.",
    authorName: "Senator Jordan Blake",
    authorHandle: "senatorblake",
    authorFollowers: 460000,
    likes: 5200,
    replies: 37,
    views: 168000,
    timestamp: now - (41 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const interactive = scorer.analyzeTweet({
    text: "What changed in your workflow this month that actually made collaboration easier?",
    authorName: "Iris Song",
    authorHandle: "irisships",
    authorFollowers: 36000,
    likes: 260,
    replies: 29,
    views: 10400,
    timestamp: now - (41 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  assert.ok(interactive.score > politician.score);
  assert.ok(politician.breakdown.some((item) => item.key === "politicalFigure"));
});

test("scorer demotes official brand and known political-account leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const officialBrand = scorer.analyzeTweet({
    text: "Fueling up for my daily \"I got this.\"",
    authorName: "Binance",
    authorHandle: "binance",
    authorFollowers: 15800000,
    likes: 8200,
    replies: 132,
    views: 420000,
    timestamp: now - (24 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: true,
    mediaKind: "video",
    langs: ["en"]
  });

  const knownPolitician = scorer.analyzeTweet({
    text: "Some more glimpses from the banks of the Hooghly...",
    authorName: "Narendra Modi",
    authorHandle: "narendramodi",
    authorFollowers: 100000000,
    likes: 18000,
    replies: 610,
    views: 1900000,
    timestamp: now - (32 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "government",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const politicalVideo = scorer.analyzeTweet({
    text: "突发：川普突然昏了过去！求证此视频是否是Ai制作？",
    authorName: "河边观察",
    authorHandle: "huanghebian",
    authorFollowers: 76000,
    likes: 1200,
    replies: 88,
    views: 130000,
    timestamp: now - (26 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "video",
    langs: ["zh"]
  });

  const sportsBrand = scorer.analyzeTweet({
    text: "DOMINANCE FROM START TO FINISH. WOLVES WIN GAME 3 AT HOME!",
    authorName: "NBA",
    authorHandle: "NBA",
    authorFollowers: 48000000,
    likes: 52000,
    replies: 900,
    views: 4200000,
    timestamp: now - (19 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "gold",
    hasMedia: true,
    mediaKind: "video",
    langs: ["en"]
  });

  assert.ok(officialBrand.breakdown.some((item) => item.key === "verifiedOrganization"));
  assert.ok(officialBrand.breakdown.some((item) => item.key === "broadcastAccount"));
  assert.ok(knownPolitician.breakdown.some((item) => item.key === "politicalFigure"));
  assert.ok(politicalVideo.breakdown.some((item) => item.key === "politicalFigure"));
  assert.ok(sportsBrand.breakdown.some((item) => item.key === "verifiedOrganization"));
  assert.ok(sportsBrand.breakdown.some((item) => item.key === "broadcastAccount"));
  assert.ok(officialBrand.score < 54);
  assert.ok(knownPolitician.score < 54);
  assert.ok(politicalVideo.score < 54);
  assert.ok(sportsBrand.score < 54);
});

test("scorer demotes death and salacious gossip threads", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const deathThread = scorer.analyzeTweet({
    text: "更新一下姜秘书长的状态：没救过来，已经去世了。",
    authorName: "现场记录",
    authorHandle: "xzzzjpl",
    authorFollowers: 52000,
    likes: 1400,
    replies: 92,
    views: 180000,
    timestamp: now - (24 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["zh"]
  });

  const gossipThread = scorer.analyzeTweet({
    text: "黄一鸣前男友实名开麦，说她被包养，同时还不止交往一个人。",
    authorName: "娱乐吃瓜",
    authorHandle: "dxs1783",
    authorFollowers: 69000,
    likes: 2100,
    replies: 120,
    views: 260000,
    timestamp: now - (21 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["zh"]
  });

  assert.ok(deathThread.breakdown.some((item) => item.key === "riskyContent"));
  assert.ok(gossipThread.breakdown.some((item) => item.key === "riskyContent"));
  assert.ok(deathThread.score < 54);
  assert.ok(gossipThread.score < 54);
});

test("scorer demotes p2.195 broadcast, product CTA, crypto hype, and event-drama leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const whaleBroadcast = scorer.analyzeTweet({
    text: "Whale Alert: 50,000 ETH transferred from unknown wallet to Binance. Full details below.",
    authorName: "Whale Alert",
    authorHandle: "whale_alert",
    authorFollowers: 2000000,
    likes: 3400,
    replies: 88,
    views: 310000,
    timestamp: now - (20 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const factsAggregator = scorer.analyzeTweet({
    text: "Did you know Africa has the youngest population in the world? Facts about the continent that will surprise you.",
    authorName: "Africa Facts Zone",
    authorHandle: "AfricaFactsZone",
    authorFollowers: 900000,
    likes: 5200,
    replies: 80,
    views: 380000,
    timestamp: now - (18 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const productCta = scorer.analyzeTweet({
    text: "Kite Agent Passport early experience is open. Join the waitlist and sign up for beta access today.",
    authorName: "0xLaughing",
    authorHandle: "0xLaughing",
    authorFollowers: 86000,
    likes: 1100,
    replies: 62,
    views: 76000,
    timestamp: now - (16 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  const cryptoHype = scorer.analyzeTweet({
    text: "ETH is ready for a 100X / 1000X move. Hidden gem call for degens, do not miss the next pump.",
    authorName: "AFeng",
    authorHandle: "aa_AFeng",
    authorFollowers: 72000,
    likes: 1500,
    replies: 70,
    views: 84000,
    timestamp: now - (12 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"]
  });

  const eventDrama = scorer.analyzeTweet({
    text: "Conference incident recap: the panel turned into a heated argument after one founder insulted another on stage.",
    authorName: "Paris Jeanne",
    authorHandle: "Paris13Jeanne",
    authorFollowers: 65000,
    likes: 1900,
    replies: 95,
    views: 99000,
    timestamp: now - (17 * 60 * 1000),
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: true,
    mediaKind: "video",
    langs: ["en"]
  });

  assert.ok(whaleBroadcast.breakdown.some((item) => item.key === "broadcastAccount"));
  assert.ok(factsAggregator.breakdown.some((item) => item.key === "broadcastAccount"));
  assert.ok(productCta.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(cryptoHype.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(eventDrama.breakdown.some((item) => item.key === "riskyContent"));
  assert.ok(whaleBroadcast.score < 54);
  assert.ok(factsAggregator.score < 54);
  assert.ok(productCta.score < 54);
  assert.ok(cryptoHype.score < 54);
  assert.ok(eventDrama.score < 54);
});

test("scorer flags low-context pure media posts without stripping media weight", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const lowContext = scorer.analyzeTweet({
    text: "",
    mediaAltText: "",
    authorHandle: "visualdrop",
    likes: 280,
    replies: 16,
    views: 9800,
    timestamp: now - (28 * 60 * 1000),
    authorVerified: false,
    hasMedia: true,
    mediaKind: "photo",
    langs: []
  });

  const withAlt = scorer.analyzeTweet({
    text: "",
    mediaAltText: "Screenshot of an AI coding dashboard comparing GPT-5 and Claude bug-fix runs across three test cases.",
    authorHandle: "visualdrop",
    likes: 280,
    replies: 16,
    views: 9800,
    timestamp: now - (28 * 60 * 1000),
    authorVerified: false,
    hasMedia: true,
    mediaKind: "photo",
    langs: []
  });

  assert.ok(withAlt.score > lowContext.score);
  assert.equal(lowContext.lowSemanticConfidence, true);
  assert.ok(lowContext.breakdown.some((item) => item.key === "visionRequired"));
  assert.ok(!lowContext.breakdown.some((item) => item.key === "semanticConfidence"));
  assert.ok(lowContext.breakdown.some((item) => item.key === "photo"));
  assert.ok(withAlt.matchedTopics.includes("ai") || withAlt.matchedTopics.includes("model"));
  assert.equal(withAlt.lowSemanticConfidence, false);
});

test("scorer keeps media posts competitive when caption itself explains the asset", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const mediaWithContext = scorer.analyzeTweet({
    text: "Three screenshots comparing onboarding drop-off by step. Curious which fix you would ship first.",
    mediaAltText: "",
    authorHandle: "productops",
    likes: 190,
    replies: 22,
    views: 7600,
    timestamp: now - (34 * 60 * 1000),
    authorVerified: false,
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"]
  });

  assert.equal(mediaWithContext.lowSemanticConfidence, false);
  assert.ok(!mediaWithContext.breakdown.some((item) => item.key === "semanticConfidence"));
});

test("scorer favors for-you feed candidates over weaker notification surfaces", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const forYou = scorer.analyzeTweet({
    text: "People are still adding real takes here and the thread is climbing quickly.",
    authorFollowers: 26000,
    likes: 320,
    replies: 26,
    views: 11800,
    timestamp: now - (48 * 60 * 1000),
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  const notifications = scorer.analyzeTweet({
    text: "People are still adding real takes here and the thread is climbing quickly.",
    authorFollowers: 26000,
    likes: 320,
    replies: 26,
    views: 11800,
    timestamp: now - (48 * 60 * 1000),
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "notifications"
  });

  assert.ok(forYou.score > notifications.score);
  assert.ok(forYou.reachLikelihood >= notifications.reachLikelihood);
  assert.ok(forYou.breakdown.some((item) => item.key === "sourceSurface"));
});

test("scorer returns multidimensional fields for downstream ranking", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const analysis = scorer.analyzeTweet({
    text: "A clear product thread with enough reaction, enough room, and enough context to reply thoughtfully.",
    mediaAltText: "Screenshot of product onboarding metrics and a highlighted drop-off segment.",
    authorFollowers: 54000,
    likes: 410,
    replies: 34,
    views: 16800,
    timestamp: now - (52 * 60 * 1000),
    authorVerified: true,
    hasMedia: true,
    mediaKind: "photo",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.equal(typeof analysis.postScore, "number");
  assert.equal(typeof analysis.reachLikelihood, "number");
  assert.equal(typeof analysis.understandingConfidence, "number");
  assert.equal(typeof analysis.authorFit, "number");
  assert.equal(typeof analysis.finalScore, "number");
  assert.equal(typeof analysis.sourceSurface, "string");
});

test("scorer uses traffic velocity when the reply window is still open", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const analysis = scorer.analyzeTweet({
    text: "Fast-moving thread where people are actively debating the details.",
    authorFollowers: 18000,
    likes: 520,
    replies: 42,
    retweets: 65,
    bookmarks: 88,
    views: 24000,
    timestamp: now - (48 * 60 * 1000),
    trafficVelocityPerHour: 30000,
    trafficReplyVelocityPerHour: 52,
    trafficReplyRatio: 0.00175,
    trafficEngagementRate: 0.03,
    trafficPhase: "viral",
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(analysis.breakdown.some((item) => item.key === "trafficMomentum"));
});

test("scorer rejects one-way viral traffic with poor reply odds", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const broadcast = scorer.analyzeTweet({
    text: "Huge announcement with applause but almost no actual conversation.",
    authorFollowers: 120000,
    likes: 9000,
    replies: 8,
    retweets: 1200,
    bookmarks: 300,
    views: 420000,
    timestamp: now - (38 * 60 * 1000),
    trafficVelocityPerHour: 660000,
    trafficReplyVelocityPerHour: 12,
    trafficReplyRatio: 0.00002,
    trafficEngagementRate: 0.025,
    trafficPhase: "viral",
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(broadcast.breakdown.some((item) => item.key === "trafficMismatch"));
});

test("scorer keeps follower-exchange bait below the executor send floor even with flow", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const bait = scorer.analyzeTweet({
    text: "919+ followers are active now. Say Want and I will follow you.",
    authorFollowers: 18000,
    likes: 340,
    replies: 96,
    views: 18000,
    timestamp: now - (22 * 60 * 1000),
    trafficVelocityPerHour: 49000,
    trafficReplyVelocityPerHour: 260,
    trafficReplyRatio: 0.0053,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(bait.score < 54);
  assert.ok(bait.breakdown.some((item) => item.key === "followTrainBait"));
});

test("scorer demotes thin motivational posts that only look good because of flow", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const thin = scorer.analyzeTweet({
    text: "Good news is coming soon.",
    authorFollowers: 22000,
    likes: 480,
    replies: 48,
    views: 22000,
    timestamp: now - (28 * 60 * 1000),
    trafficVelocityPerHour: 47000,
    trafficReplyVelocityPerHour: 102,
    trafficReplyRatio: 0.0022,
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(thin.score < 54);
  assert.ok(thin.breakdown.some((item) => item.key === "thinGenericPost"));
});

test("scorer demotes crypto holder-count growth bait despite traffic", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const bnbGrowth = scorer.analyzeTweet({
    text: "BNB Alpha holder count just hit a new record. Holder growth is accelerating fast.",
    authorFollowers: 38000,
    likes: 420,
    replies: 38,
    views: 21000,
    timestamp: now - (34 * 60 * 1000),
    trafficVelocityPerHour: 36000,
    trafficReplyVelocityPerHour: 66,
    trafficReplyRatio: 0.0018,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(bnbGrowth.score < 54);
  assert.ok(bnbGrowth.breakdown.some((item) => item.key === "protocolPromo"));
});

test("scorer demotes Korean X revenue and weekly-pay flex posts", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const revenueFlex = scorer.analyzeTweet({
    text: "이번 주 X 수익금 인증. 블루 수익 규칙 바뀐 뒤 조회수 수익이 더 커졌네요.",
    authorFollowers: 42000,
    likes: 920,
    replies: 82,
    views: 48000,
    timestamp: now - (26 * 60 * 1000),
    trafficVelocityPerHour: 110000,
    trafficReplyVelocityPerHour: 188,
    trafficReplyRatio: 0.0017,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["ko"],
    sourceSurface: "for-you"
  });

  assert.ok(revenueFlex.score < 54);
  assert.ok(revenueFlex.breakdown.some((item) => item.key === "socialGrowthFlex"));
});

test("scorer demotes engagement-volume flex posts", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const volumeFlex = scorer.analyzeTweet({
    text: "1000 replies reached. Thanks everyone for the engagement, this is a new record.",
    authorFollowers: 24000,
    likes: 700,
    replies: 1000,
    views: 96000,
    timestamp: now - (42 * 60 * 1000),
    trafficVelocityPerHour: 137000,
    trafficReplyVelocityPerHour: 1428,
    trafficReplyRatio: 0.0104,
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(volumeFlex.score < 54);
  assert.ok(volumeFlex.breakdown.some((item) => item.key === "socialGrowthFlex"));
});

test("scorer demotes toxic AI reward challenges", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const challenge = scorer.analyzeTweet({
    text: "Insult this AI bot. Best roast wins the reward challenge.",
    authorFollowers: 15000,
    likes: 260,
    replies: 64,
    views: 15000,
    timestamp: now - (30 * 60 * 1000),
    trafficVelocityPerHour: 30000,
    trafficReplyVelocityPerHour: 128,
    trafficReplyRatio: 0.0042,
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(challenge.score < 54);
  assert.ok(challenge.breakdown.some((item) => item.key === "riskyContent"));
});

test("scorer demotes multilingual X payout and revenue flex posts", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const englishPayout = scorer.analyzeTweet({
    text: "X payout received again. The system is working, thanks for the creator revenue.",
    authorFollowers: 52000,
    likes: 1300,
    replies: 96,
    views: 62000,
    timestamp: now - (28 * 60 * 1000),
    trafficVelocityPerHour: 132000,
    trafficReplyVelocityPerHour: 205,
    trafficReplyRatio: 0.00155,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  const japanesePayout = scorer.analyzeTweet({
    text: "Xの広告収益が入金されました。過去最高記録なので一部寄付します、ありがとう。",
    authorFollowers: 48000,
    likes: 980,
    replies: 74,
    views: 54000,
    timestamp: now - (31 * 60 * 1000),
    trafficVelocityPerHour: 98000,
    trafficReplyVelocityPerHour: 143,
    trafficReplyRatio: 0.00137,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["ja"],
    sourceSurface: "for-you"
  });

  assert.ok(englishPayout.score < 54);
  assert.ok(japanesePayout.score < 54);
  assert.ok(englishPayout.breakdown.some((item) => item.key === "socialGrowthFlex"));
  assert.ok(japanesePayout.breakdown.some((item) => item.key === "socialGrowthFlex"));
});

test("scorer demotes BNB meme wealth and ETH trenches narratives", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const bnbWealth = scorer.analyzeTweet({
    text: "BNB meme wealth effect is real. This is how people make life changing money in one cycle.",
    authorFollowers: 68000,
    likes: 1800,
    replies: 110,
    views: 88000,
    timestamp: now - (24 * 60 * 1000),
    trafficVelocityPerHour: 180000,
    trafficReplyVelocityPerHour: 225,
    trafficReplyRatio: 0.00125,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  const ethTrenches = scorer.analyzeTweet({
    text: "New ETH trenches product thesis: find alpha before the token launch and ride the narrative early.",
    authorFollowers: 36000,
    likes: 920,
    replies: 64,
    views: 41000,
    timestamp: now - (36 * 60 * 1000),
    trafficVelocityPerHour: 69000,
    trafficReplyVelocityPerHour: 106,
    trafficReplyRatio: 0.00156,
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(bnbWealth.score < 54);
  assert.ok(ethTrenches.score < 54);
  assert.ok(bnbWealth.breakdown.some((item) => item.key === "protocolPromo"));
  assert.ok(ethTrenches.breakdown.some((item) => item.key === "protocolPromo"));
});

test("scorer demotes big-account low-info controversy questions", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const pileOnQuestion = scorer.analyzeTweet({
    text: "Which is worse? Be honest.",
    authorName: "Large Meme Account",
    authorHandle: "largememe",
    authorFollowers: 1800000,
    likes: 6200,
    replies: 420,
    views: 340000,
    timestamp: now - (45 * 60 * 1000),
    trafficVelocityPerHour: 420000,
    trafficReplyVelocityPerHour: 510,
    trafficReplyRatio: 0.00123,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(pileOnQuestion.score < 54);
  assert.ok(pileOnQuestion.breakdown.some((item) => item.key === "thinGenericPost"));
});

test("scorer hard-caps explicit follow reward loops", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const loop = scorer.analyzeTweet({
    text: "Under 10k followers? Drop your handle. Like + RT + comment and support all active accounts.",
    authorFollowers: 64000,
    likes: 1400,
    replies: 180,
    views: 82000,
    timestamp: now - (24 * 60 * 1000),
    trafficVelocityPerHour: 160000,
    trafficReplyVelocityPerHour: 360,
    trafficReplyRatio: 0.0022,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(loop.score <= 45);
  assert.ok(loop.breakdown.some((item) => item.key === "followTrainBait"));
});

test("scorer hard-caps payout and back-pay claims", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const payout = scorer.analyzeTweet({
    text: "X back pay finally arrived. Creator payout and ad revenue are working again.",
    authorFollowers: 72000,
    likes: 1600,
    replies: 120,
    views: 76000,
    timestamp: now - (30 * 60 * 1000),
    trafficVelocityPerHour: 120000,
    trafficReplyVelocityPerHour: 190,
    trafficReplyRatio: 0.00158,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(payout.score <= 50);
  assert.ok(payout.breakdown.some((item) => item.key === "socialGrowthFlex"));
});

test("scorer hard-caps directional crypto wealth narratives", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const directional = scorer.analyzeTweet({
    text: "BTC support and resistance are clear. Breakout above this level is the next long entry.",
    authorFollowers: 90000,
    likes: 1800,
    replies: 92,
    views: 110000,
    timestamp: now - (38 * 60 * 1000),
    trafficVelocityPerHour: 150000,
    trafficReplyVelocityPerHour: 130,
    trafficReplyRatio: 0.00084,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(directional.score <= 52);
  assert.ok(directional.breakdown.some((item) => item.key === "protocolPromo"));
});

test("scorer hard-caps official political and broadcast accounts", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const political = scorer.analyzeTweet({
    text: "BREAKING: the regime just exposed itself again. Everyone can see what is happening.",
    authorName: "Jackson Hinkle",
    authorHandle: "jacksonhinklle",
    authorFollowers: 3000000,
    likes: 9000,
    replies: 360,
    views: 600000,
    timestamp: now - (50 * 60 * 1000),
    trafficVelocityPerHour: 500000,
    trafficReplyVelocityPerHour: 300,
    trafficReplyRatio: 0.0006,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  const broadcaster = scorer.analyzeTweet({
    text: "Video shows the latest escalation. Follow our live updates for more.",
    authorName: "AJ English",
    authorHandle: "AJEnglish",
    authorFollowers: 9000000,
    likes: 5000,
    replies: 160,
    views: 480000,
    timestamp: now - (40 * 60 * 1000),
    trafficVelocityPerHour: 420000,
    trafficReplyVelocityPerHour: 180,
    trafficReplyRatio: 0.00033,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(political.score <= 47);
  assert.ok(broadcaster.score <= 50);
  assert.ok(political.breakdown.some((item) => item.key === "politicalFigure" || item.key === "broadcastAccount"));
  assert.ok(broadcaster.breakdown.some((item) => item.key === "broadcastAccount"));
});

test("scorer does not hard-cap substantial technical reports", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const technical = scorer.analyzeTweet({
    text: "DeepSeek technical report is out. The paper details architecture changes, inference latency, benchmark results, dataset mix, and open source implementation notes.",
    authorFollowers: 42000,
    likes: 620,
    replies: 42,
    views: 26000,
    timestamp: now - (35 * 60 * 1000),
    trafficVelocityPerHour: 42000,
    trafficReplyVelocityPerHour: 72,
    trafficReplyRatio: 0.0016,
    authorVerified: false,
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(!technical.breakdown.some((item) => item.key.startsWith("hardCap")));
});

test("scorer demotes p2.203 flow leaks below executor floor", () => {
  const scorer = loadScorer();
  const now = Date.now();
  const common = {
    authorFollowers: 52000,
    likes: 1400,
    replies: 130,
    views: 86000,
    timestamp: now - (28 * 60 * 1000),
    trafficVelocityPerHour: 160000,
    trafficReplyVelocityPerHour: 240,
    trafficReplyRatio: 0.0015,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    sourceSurface: "for-you"
  };

  const cases = [
    {
      text: "BTC industry belief is what makes people win early in a cycle and build real wealth.",
      langs: ["en"],
      key: "protocolPromo"
    },
    {
      text: "Xの収益化停止が解除されました。次回の利益も楽しみ、また稼げそうです。",
      langs: ["ja"],
      key: "socialGrowthFlex"
    },
    {
      text: "Open source crypto tracker to catch early coins before everyone finds the next gem.",
      langs: ["en"],
      key: "protocolPromo"
    },
    {
      text: "Join our XChat Web3 creator community group and grow with early builders.",
      langs: ["en"],
      key: "protocolPromo"
    },
    {
      text: "Russia rich migration is accelerating as wealthy people escape with their money.",
      langs: ["en"],
      key: "thinGenericPost"
    },
    {
      text: "God paid off my medical debt and healed the hospital bills. Miracle after prayer.",
      langs: ["en"],
      key: "riskyContent"
    }
  ];

  for (const item of cases) {
    const analysis = scorer.analyzeTweet({ ...common, ...item });
    assert.ok(analysis.score < 54, `${item.text} scored ${analysis.score}`);
    assert.ok(analysis.breakdown.some((entry) => entry.key === item.key), item.key);
  }
});

test("scorer hard-blocks explicit good morning follower bait", () => {
  const scorer = loadScorer();
  const now = Date.now();

  const bait = scorer.analyzeTweet({
    text: "999+ followers are active. Comment Good Morning and I will follow you.",
    authorFollowers: 18000,
    likes: 280,
    replies: 110,
    views: 24000,
    timestamp: now - (20 * 60 * 1000),
    trafficVelocityPerHour: 62000,
    trafficReplyVelocityPerHour: 320,
    trafficReplyRatio: 0.0048,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  });

  assert.ok(bait.score <= 45);
  assert.ok(bait.breakdown.some((item) => item.key === "followTrainBait"));
});

test("scorer demotes p2.206 crypto wealth and investment leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();
  const common = {
    authorFollowers: 64000,
    likes: 1600,
    replies: 120,
    views: 92000,
    timestamp: now - (30 * 60 * 1000),
    trafficVelocityPerHour: 150000,
    trafficReplyVelocityPerHour: 210,
    trafficReplyRatio: 0.00135,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  };

  const cases = [
    "ETH ASTEROID whale buy is starting. This platform token is still worth buying.",
    "Which platform tokens are worth buying before the next bull market?",
    "295% pump already: $200 -> $850 and this bull market is just starting."
  ];

  for (const text of cases) {
    const analysis = scorer.analyzeTweet({ ...common, text });
    assert.ok(analysis.score < 54, `${text} scored ${analysis.score}`);
    assert.ok(analysis.breakdown.some((item) => item.key === "protocolPromo"));
  }
});

test("scorer demotes p2.206 payout, follow-growth, political, and low-info leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();
  const common = {
    authorFollowers: 42000,
    likes: 900,
    replies: 88,
    views: 54000,
    timestamp: now - (34 * 60 * 1000),
    trafficVelocityPerHour: 96000,
    trafficReplyVelocityPerHour: 150,
    trafficReplyRatio: 0.00155,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    langs: ["en"],
    sourceSurface: "for-you"
  };

  const expected = [
    {
      text: "Elon paid me again. Like and retweet if you want X earnings too.",
      key: "followTrainBait"
    },
    {
      text: "Follow each other and gain massively. Support everyone in the replies.",
      key: "followTrainBait"
    },
    {
      text: "X earnings minimum payout threshold is finally here. Who can withdraw now?",
      key: "socialGrowthFlex"
    },
    {
      text: "White House and Iran talks continue today as officials discuss the next deal.",
      key: "politicalFigure"
    },
    {
      text: "After all my millions, I still just want pizza for lunch.",
      key: "thinGenericPost"
    },
    {
      text: "Tesla investor lunch was just pizza lol, millions can wait.",
      key: "thinGenericPost"
    },
    {
      text: "Hover tech future is finally here and it looks wild.",
      key: "thinGenericPost"
    }
  ];

  for (const item of expected) {
    const analysis = scorer.analyzeTweet({ ...common, text: item.text });
    assert.ok(analysis.score < 54, `${item.text} scored ${analysis.score}`);
    assert.ok(analysis.breakdown.some((entry) => entry.key === item.key), item.key);
  }
});

test("scorer demotes p2.208 inboxzero revenue restart and institutional bull-market leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();
  const common = {
    authorFollowers: 58000,
    likes: 1200,
    replies: 96,
    views: 70000,
    timestamp: now - (32 * 60 * 1000),
    trafficVelocityPerHour: 120000,
    trafficReplyVelocityPerHour: 180,
    trafficReplyRatio: 0.0015,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    sourceSurface: "for-you"
  };

  const cases = [
    {
      text: "X收益暂停以后只能重启账号，从0冲到10万粉再来一次。",
      langs: ["zh"],
      key: "socialGrowthFlex"
    },
    {
      text: "X payday is real. Earning money on X finally works for premium creators.",
      langs: ["en"],
      key: "socialGrowthFlex"
    },
    {
      text: "BTC ETF inflows from BlackRock and Morgan Stanley prove the institutional bull market is here.",
      langs: ["en"],
      key: "protocolPromo"
    }
  ];

  for (const item of cases) {
    const analysis = scorer.analyzeTweet({ ...common, ...item });
    assert.ok(analysis.score < 54, `${item.text} scored ${analysis.score}`);
    assert.ok(analysis.breakdown.some((entry) => entry.key === item.key), item.key);
  }
});

test("scorer demotes p2.213 preview leaks", () => {
  const scorer = loadScorer();
  const now = Date.now();
  const common = {
    authorFollowers: 65000,
    likes: 980,
    replies: 76,
    views: 88000,
    timestamp: now - (28 * 60 * 1000),
    trafficVelocityPerHour: 110000,
    trafficReplyVelocityPerHour: 140,
    authorVerified: true,
    authorVerificationType: "blue",
    hasMedia: false,
    mediaKind: "text",
    sourceSurface: "for-you"
  };

  const cases = [
    {
      text: "X payout finally hit again. Premium revenue is real and I got paid today.",
      langs: ["en"],
      key: "socialGrowthFlex"
    },
    {
      text: "69k followers now, blue-check account interaction is back. Reply if your visibility is also shadowbanned.",
      langs: ["en"],
      key: "followTrainBait"
    },
    {
      text: "这个 AI 产品还有 KOL 活动额度，评论区留言加入体验名单。",
      langs: ["zh"],
      key: "protocolPromo"
    },
    {
      text: "Comment to join our crypto community group, we share alpha and trading signals.",
      langs: ["en"],
      key: "protocolPromo"
    },
    {
      text: "My market automation trading bot subscription is open again for crypto signals.",
      langs: ["en"],
      key: "protocolPromo"
    },
    {
      text: "工资和资产对比太焦虑了，为什么同龄人的财富差距越来越大？",
      langs: ["zh"],
      key: "socialGrowthFlex"
    }
  ];

  for (const item of cases) {
    const analysis = scorer.analyzeTweet({ ...common, ...item });
    assert.ok(analysis.score < 54, `${item.text} scored ${analysis.score}`);
    assert.ok(analysis.breakdown.some((entry) => entry.key === item.key), item.key);
  }
});
