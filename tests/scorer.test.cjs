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
