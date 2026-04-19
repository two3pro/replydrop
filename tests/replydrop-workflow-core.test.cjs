const test = require("node:test");
const assert = require("node:assert/strict");

const workflowCore = require("../replydrop-workflow-core.js");

test("queue sorting keeps live queued work ahead of closed items", () => {
  const items = [
    { url: "closed", status: "completed", completedAt: 300, createdAt: 100 },
    { url: "live-late", status: "queued", scheduledFor: 500, score: 40, createdAt: 200 },
    { url: "live-early", status: "queued", scheduledFor: 100, score: 20, createdAt: 150 }
  ];

  const sorted = items.slice().sort(workflowCore.compareReplyQueueItems);
  assert.deepEqual(sorted.map((item) => item.url), ["live-early", "live-late", "closed"]);
});

test("queue sorting prefers higher score when scheduled time is tied", () => {
  const items = [
    { url: "low-score", status: "queued", scheduledFor: 100, score: 30, createdAt: 10 },
    { url: "high-score", status: "queued", scheduledFor: 100, score: 80, createdAt: 20 }
  ];

  const sorted = items.slice().sort(workflowCore.compareReplyQueueItems);
  assert.deepEqual(sorted.map((item) => item.url), ["high-score", "low-score"]);
});

test("expired snoozed and cooldown watches recover to composer-ready", () => {
  const now = 1_700_000_000_000;
  assert.equal(workflowCore.getPublishWatchEffectiveStatus({
    status: "snoozed",
    snoozeUntil: now - 1
  }, now), "composer-ready");
  assert.equal(workflowCore.getPublishWatchEffectiveStatus({
    status: "cooldown",
    cooldownUntil: now - 1
  }, now), "composer-ready");
});

test("stale publish-watch handoffs escalate into failed state", () => {
  const now = 1_700_000_000_000;
  assert.equal(workflowCore.getPublishWatchEffectiveStatus({
    status: "post-opened",
    handedOffAt: now - 13 * 60 * 1000
  }, now), "failed");
  assert.equal(workflowCore.getPublishWatchEffectiveStatus({
    status: "composer-ready",
    attempts: 2,
    handedOffAt: now - 19 * 60 * 1000
  }, now), "failed");
});

test("sanitizePublishWatchState clears expired timers and normalizes attempts", () => {
  const now = 1_700_000_000_000;
  const sanitized = workflowCore.sanitizePublishWatchState({
    status: "snoozed",
    snoozeUntil: now - 10,
    cooldownUntil: now + 1000,
    attempts: 0
  }, now);

  assert.equal(sanitized.status, "composer-ready");
  assert.equal(sanitized.snoozeUntil, 0);
  assert.equal(sanitized.cooldownUntil, 0);
  assert.equal(sanitized.attempts, 1);
});

test("sanitizePublishWatchState preserves active cooldown", () => {
  const now = 1_700_000_000_000;
  const sanitized = workflowCore.sanitizePublishWatchState({
    status: "cooldown",
    cooldownUntil: now + 60_000,
    attempts: 3
  }, now);

  assert.equal(sanitized.status, "cooldown");
  assert.equal(sanitized.cooldownUntil, now + 60_000);
  assert.equal(sanitized.snoozeUntil, 0);
  assert.equal(sanitized.attempts, 3);
});

test("publish-watch lifecycle counts use effective statuses", () => {
  const now = 1_700_000_000_000;
  const counts = workflowCore.getPublishWatchLifecycleCounts([
    { status: "failed" },
    { status: "post-opened" },
    { status: "cooldown", cooldownUntil: now + 5000 },
    { status: "snoozed", snoozeUntil: now + 5000 },
    { status: "snoozed", snoozeUntil: now - 1 }
  ], now);

  assert.deepEqual(counts, {
    total: 5,
    ready: 1,
    partial: 1,
    failed: 1,
    cooling: 1,
    snoozed: 1
  });
});

test("publish-watch sort score keeps failed above partial and ready", () => {
  assert.equal(workflowCore.getPublishWatchSortScore({ status: "failed" }), 5);
  assert.equal(workflowCore.getPublishWatchSortScore({ status: "post-opened" }), 4);
  assert.equal(workflowCore.getPublishWatchSortScore({ status: "composer-ready" }), 3);
});
