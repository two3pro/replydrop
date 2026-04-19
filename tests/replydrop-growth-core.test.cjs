const test = require("node:test");
const assert = require("node:assert/strict");

const growthCore = require("../replydrop-growth-core.js");

test("queue lifecycle counts reflect awaiting, action, and done states", () => {
  const now = 1_700_000_000_000;
  const counts = growthCore.getQueueLifecycleCounts([
    { url: "queued-later", status: "queued", scheduledFor: now + 60 * 60 * 1000 },
    { url: "queued-soon", status: "queued", scheduledFor: now + 10 * 60 * 1000 },
    { url: "queued-overdue", status: "queued", scheduledFor: now - 20 * 60 * 1000 },
    { url: "done", status: "shipped" }
  ], {
    now,
    publishWatchItems: [{ url: "queued-later" }]
  });

  assert.deepEqual(counts, {
    live: 3,
    staged: 1,
    action: 2,
    dueSoon: 1,
    overdue: 1,
    completed: 0,
    shipped: 1,
    awaiting: 1,
    done: 1
  });
});

test("pickup review counts distinguish due, watching, and settled items", () => {
  const now = 1_700_000_000_000;
  const counts = growthCore.getPickupReviewCounts([
    { url: "due", pickupReviewStage: "first-check", pickupNextReviewAt: now - 1 },
    { url: "watching", pickupReviewStage: "follow-up", pickupNextReviewAt: now + 60_000 },
    { url: "settled", pickupReviewStage: "settled" }
  ], now);

  assert.deepEqual(counts, {
    total: 3,
    due: 1,
    watching: 1,
    settled: 1
  });
});

test("pickup review bucket marks due follow-up work as due, not only first-checks", () => {
  const now = 1_700_000_000_000;
  assert.equal(growthCore.getPickupReviewBucket({
    url: "due-follow-up",
    pickupChecks: 1,
    pickupReviewStage: "follow-up",
    pickupNextReviewAt: now - 1,
    status: "quiet",
    lastCheckedAt: now - 60_000
  }, now), "due");
});

test("priority publish watch prefers failed recovery over partial and ready items", () => {
  const now = 1_700_000_000_000;
  const item = growthCore.getPriorityPublishWatchItem([
    { url: "ready", status: "composer-ready", handedOffAt: now - 5_000 },
    { url: "partial", status: "post-opened", handedOffAt: now - 10_000 },
    { url: "failed", status: "failed", handedOffAt: now - 2_000 }
  ], now);

  assert.equal(item.url, "failed");
});

test("buildGrowthSnapshot rolls publish, queue, and review pressure into one summary", () => {
  const now = 1_700_000_000_000;
  const snapshot = growthCore.buildGrowthSnapshot({
    now,
    repliesToday: 3,
    visibleCandidates: 8,
    actionableCandidates: 4,
    queueItems: [
      { url: "queued", status: "queued", scheduledFor: now + 5 * 60 * 1000 },
      { url: "done", status: "completed" }
    ],
    publishWatchItems: [
      { url: "queued", status: "post-opened", handedOffAt: now - 1000 },
      { url: "failed", status: "failed", handedOffAt: now - 1000 }
    ],
    pickupItems: [
      { url: "due", status: "pending", pickupReviewStage: "first-check", pickupNextReviewAt: now - 1 },
      { url: "settled", status: "picked-up", pickupReviewStage: "settled", lastCheckedAt: now - 1000 }
    ]
  });

  assert.equal(snapshot.repliesToday, 3);
  assert.equal(snapshot.queueCounts.action, 1);
  assert.equal(snapshot.publishCounts.partial, 1);
  assert.equal(snapshot.publishCounts.failed, 1);
  assert.equal(snapshot.reviewCounts.due, 1);
  assert.equal(snapshot.reviewCounts.settled, 1);
  assert.equal(snapshot.operatorPressure, 4);
  assert.equal(snapshot.checkedCoverage, 50);
  assert.equal(snapshot.settledCoverage, 50);
});

test("buildCompactGrowthMetrics keeps only the highest-pressure optional cards", () => {
  const now = 1_700_000_000_000;
  const metrics = growthCore.buildCompactGrowthMetrics({
    now,
    repliesToday: 2,
    queueItems: [
      { url: "queued", status: "queued", scheduledFor: now + 10 * 60 * 1000 }
    ],
    publishWatchItems: [
      { url: "queued", status: "post-opened", handedOffAt: now - 1000 },
      { url: "failed", status: "failed", handedOffAt: now - 2000 }
    ],
    pickupItems: [
      { url: "due", status: "pending", pickupReviewStage: "first-check", pickupNextReviewAt: now - 1 },
      { url: "picked", status: "author-engaged", pickupReviewStage: "settled", lastCheckedAt: now - 1000 }
    ]
  });

  assert.deepEqual(metrics.map((item) => item.key), [
    "repliesToday",
    "liveQueue",
    "needsAction",
    "awaitingConfirm",
    "pickupDue",
  ]);
  assert.equal(metrics[3].value, 1);
  assert.equal(metrics[2].value, 2);
  assert.equal(metrics[2].failedCount, 1);
});

test("buildCompactGrowthMetrics stays short when the dashboard is quiet", () => {
  const metrics = growthCore.buildCompactGrowthMetrics({
    repliesToday: 0,
    queueItems: [],
    publishWatchItems: [],
    pickupItems: []
  });

  assert.deepEqual(metrics.map((item) => item.key), [
    "repliesToday",
    "liveQueue"
  ]);
});

test("buildGrowthTruthItems surfaces author-back and coverage in the compact strip", () => {
  const now = 1_700_000_000_000;
  const items = growthCore.buildGrowthTruthItems({
    now,
    publishWatchItems: [
      { url: "ready", status: "composer-ready", handedOffAt: now - 1000 },
      { url: "partial", status: "post-opened", handedOffAt: now - 2000 }
    ],
    pickupItems: [
      { url: "settled-a", status: "author-engaged", pickupReviewStage: "settled", lastCheckedAt: now - 1000 },
      { url: "watching", status: "quiet", pickupReviewStage: "follow-up", pickupNextReviewAt: now + 1000, lastCheckedAt: now - 1000 }
    ]
  });

  assert.deepEqual(items.map((item) => item.key), [
    "toClose",
    "authorBack",
    "settled",
    "reviewCoverage"
  ]);
  assert.equal(items[0].value, 2);
  assert.equal(items[1].value, 1);
  assert.equal(items[2].value, 1);
  assert.equal(items[3].value, 100);
  assert.equal(items[3].format, "percent");
});
