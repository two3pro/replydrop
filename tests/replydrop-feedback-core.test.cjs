const test = require("node:test");
const assert = require("node:assert/strict");

const feedbackCore = require("../replydrop-feedback-core.js");

test("buildReplyFeedbackPreviewEntries prioritizes due review work first", () => {
  const now = 1_700_000_000_000;
  const entries = feedbackCore.buildReplyFeedbackPreviewEntries([
    { url: "quiet", pickupStatus: "quiet", timestamp: now - 1000 },
    { url: "picked", pickupStatus: "picked-up", timestamp: now - 2000 },
    { url: "due", pickupStatus: "quiet", pickupReviewStage: "follow-up", pickupNextReviewAt: now - 1, timestamp: now - 3000 }
  ], now, { limit: 3 });

  assert.deepEqual(entries.map((item) => item.url), ["due", "picked", "quiet"]);
});

test("buildReplyFeedbackPreviewEntries stays short by default", () => {
  const entries = feedbackCore.buildReplyFeedbackPreviewEntries([
    { url: "1", timestamp: 4 },
    { url: "2", timestamp: 3 },
    { url: "3", timestamp: 2 },
    { url: "4", timestamp: 1 }
  ]);

  assert.deepEqual(entries.map((item) => item.url), ["1", "2", "3"]);
});
