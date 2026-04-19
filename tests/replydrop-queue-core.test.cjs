const test = require("node:test");
const assert = require("node:assert/strict");

const queueCore = require("../replydrop-queue-core.js");

test("filterQueueItems keeps only urgent queued work for the action filter", () => {
  const now = 1_700_000_000_000;
  const items = queueCore.filterQueueItems([
    { url: "later", status: "queued", scheduledFor: now + 60 * 60 * 1000 },
    { url: "soon", status: "queued", scheduledFor: now + 10 * 60 * 1000 },
    { url: "overdue", status: "queued", scheduledFor: now - 20 * 60 * 1000 },
    { url: "done", status: "completed" }
  ], "action", now);

  assert.deepEqual(items.map((item) => item.url), ["soon", "overdue"]);
});

test("buildQueuePreviewItems keeps queue previews short by default", () => {
  const preview = queueCore.buildQueuePreviewItems([
    { url: "1", status: "queued" },
    { url: "2", status: "queued" },
    { url: "3", status: "queued" },
    { url: "4", status: "queued" }
  ], "all");

  assert.deepEqual(preview.map((item) => item.url), ["1", "2", "3"]);
});
