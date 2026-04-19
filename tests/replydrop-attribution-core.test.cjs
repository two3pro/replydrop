const test = require("node:test");
const assert = require("node:assert/strict");

const attributionCore = require("../replydrop-attribution-core.js");

test("buildAttributionSignalModel aggregates handle stats and preferred slot", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/1",
        authorHandle: "CineLens",
        timestamp: 1000,
        slot: "tonight",
        lane: "now",
        matchedTopics: ["film"],
        pickupStatus: "author-engaged",
        pickupChecks: 1,
        pickupReviewStage: "settled"
      },
      {
        url: "https://x.com/reply/2",
        authorHandle: "CineLens",
        timestamp: 2000,
        slot: "next",
        lane: "watch",
        matchedTopics: ["film"],
        pickupStatus: "picked-up",
        pickupChecks: 1,
        pickupReviewStage: "follow-up",
        pickupNextReviewAt: 9_999_999_999_999
      }
    ],
    [
      {
        url: "https://x.com/queue/1",
        authorHandle: "CineLens",
        status: "queued",
        slot: "next",
        lane: "watch",
        matchedTopics: ["film"]
      }
    ],
    [
      {
        url: "https://x.com/candidate/1",
        authorHandle: "CineLens",
        matchedTopics: ["film"]
      }
    ],
    { now: 5_000 }
  );

  const handleStat = model.handles.get("cinelens");
  assert.ok(handleStat);
  assert.equal(handleStat.shipped, 2);
  assert.equal(handleStat.queued, 1);
  assert.equal(handleStat.reviewed, 2);
  assert.equal(handleStat.settled, 1);
  assert.equal(handleStat.pickedUp, 2);
  assert.equal(handleStat.authorEngaged, 1);
  assert.equal(handleStat.preferredSlot, "next");
  assert.equal(handleStat.priority, 65);
  assert.equal(Math.round(handleStat.preferredSlotWeight * 100), 165);
});

test("summarizeCandidateAttribution returns null when memory is too weak", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/weak",
        authorHandle: "FreshHandle",
        timestamp: 1000,
        slot: "next",
        matchedTopics: [],
        pickupStatus: "pending",
        pickupChecks: 0
      }
    ],
    [],
    [{ url: "https://x.com/candidate/weak", authorHandle: "FreshHandle", matchedTopics: [] }],
    { now: 5_000 }
  );

  const summary = attributionCore.summarizeCandidateAttribution(
    { url: "https://x.com/candidate/weak", authorHandle: "FreshHandle", matchedTopics: [] },
    model
  );

  assert.equal(summary, null);
});

test("summarizeCandidateAttribution detects author-engaged handles", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/1",
        authorHandle: "CineLens",
        timestamp: 1000,
        slot: "tonight",
        matchedTopics: ["film"],
        pickupStatus: "author-engaged",
        pickupChecks: 1,
        pickupReviewStage: "settled"
      }
    ],
    [
      {
        url: "https://x.com/queue/1",
        authorHandle: "CineLens",
        status: "queued",
        slot: "next",
        matchedTopics: ["film"]
      }
    ],
    [{ url: "https://x.com/candidate/1", authorHandle: "CineLens", matchedTopics: ["film"] }],
    { now: 5_000 }
  );

  const summary = attributionCore.summarizeCandidateAttribution(
    { url: "https://x.com/candidate/1", authorHandle: "CineLens", matchedTopics: ["film"] },
    model
  );

  assert.ok(summary);
  assert.equal(summary.kind, "author-engaged");
  assert.equal(summary.preferredSlot, "tonight");
  assert.ok(summary.priority > 0);
});

test("summarizeCandidateAttribution falls back to reviewed-memory when no pickup proof exists", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/reviewed",
        authorHandle: "BookThread",
        timestamp: 1000,
        slot: "tomorrow",
        matchedTopics: ["books"],
        pickupStatus: "quiet",
        pickupChecks: 1,
        pickupReviewStage: "settled"
      }
    ],
    [],
    [{ url: "https://x.com/candidate/reviewed", authorHandle: "BookThread", matchedTopics: ["books"] }],
    { now: 5_000 }
  );

  const summary = attributionCore.summarizeCandidateAttribution(
    { url: "https://x.com/candidate/reviewed", authorHandle: "BookThread", matchedTopics: ["books"] },
    model
  );

  assert.ok(summary);
  assert.equal(summary.kind, "reviewed-memory");
  assert.equal(summary.settled, 2);
  assert.equal(summary.reviewed, 2);
});

test("getAttributionPreferredSlot prefers heavier weight then higher priority", () => {
  const preferred = attributionCore.getAttributionPreferredSlot(
    { preferredSlot: "tonight", preferredSlotWeight: 1.2, priority: 10 },
    { preferredSlot: "next", preferredSlotWeight: 1.2, priority: 14 }
  );

  assert.equal(preferred, "next");
});

test("getDefaultQueueSlot keeps tomorrow from overriding immediate lane defaults", () => {
  assert.equal(
    attributionCore.getDefaultQueueSlot("next", { preferredSlot: "tomorrow", priority: 20 }),
    "next"
  );
  assert.equal(
    attributionCore.getDefaultQueueSlot("watch", { preferredSlot: "next", priority: 14 }),
    "next"
  );
  assert.equal(
    attributionCore.getDefaultQueueSlot("watch", { preferredSlot: "tonight", priority: 9 }),
    "tonight"
  );
});

test("buildAttributionInsightTargets returns the strongest two insights in stable order", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/1",
        authorHandle: "CineLens",
        timestamp: 1000,
        slot: "tonight",
        lane: "now",
        matchedTopics: ["film"],
        pickupStatus: "author-engaged",
        pickupChecks: 1,
        pickupReviewStage: "settled"
      },
      {
        url: "https://x.com/reply/2",
        authorHandle: "CineLens",
        timestamp: 2000,
        slot: "next",
        lane: "watch",
        matchedTopics: ["film"],
        pickupStatus: "picked-up",
        pickupChecks: 1,
        pickupReviewStage: "follow-up",
        pickupNextReviewAt: 9_999_999_999_999
      },
      {
        url: "https://x.com/reply/3",
        authorHandle: "OtherHandle",
        timestamp: 1500,
        slot: "next",
        lane: "watch",
        matchedTopics: ["books"],
        pickupStatus: "quiet",
        pickupChecks: 1,
        pickupReviewStage: "settled"
      }
    ],
    [
      {
        url: "https://x.com/queue/1",
        authorHandle: "CineLens",
        status: "queued",
        slot: "next",
        lane: "watch",
        matchedTopics: ["film"]
      }
    ],
    [
      {
        url: "https://x.com/candidate/1",
        authorHandle: "CineLens",
        matchedTopics: ["film"]
      }
    ],
    { now: 5_000 }
  );

  const insights = attributionCore.buildAttributionInsightTargets(model, { limit: 2 });
  assert.deepEqual(insights.map((item) => item.kind), ["handle", "topic"]);
  assert.equal(insights[0].stat.handle, "CineLens");
  assert.equal(insights[1].stat.key, "film");
});

test("buildAttributionInsightTargets drops weak memory", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/weak",
        authorHandle: "FreshHandle",
        timestamp: 1000,
        slot: "next",
        lane: "watch",
        matchedTopics: [],
        pickupStatus: "pending",
        pickupChecks: 0
      }
    ],
    [],
    [],
    { now: 5_000 }
  );

  const insights = attributionCore.buildAttributionInsightTargets(model);
  assert.deepEqual(insights, []);
});

test("sortCandidatesByAttribution brings validated memory ahead of neutral candidates", () => {
  const model = attributionCore.buildAttributionSignalModel(
    [
      {
        url: "https://x.com/reply/1",
        authorHandle: "CineLens",
        timestamp: 1000,
        slot: "next",
        lane: "watch",
        matchedTopics: ["film"],
        pickupStatus: "author-engaged",
        pickupChecks: 1,
        pickupReviewStage: "settled"
      }
    ],
    [],
    [
      { url: "https://x.com/candidate/1", authorHandle: "FreshHandle", matchedTopics: ["books"] },
      { url: "https://x.com/candidate/2", authorHandle: "CineLens", matchedTopics: ["film"] }
    ],
    { now: 5_000 }
  );

  const ranked = attributionCore.sortCandidatesByAttribution([
    { url: "https://x.com/candidate/1", authorHandle: "FreshHandle", matchedTopics: ["books"] },
    { url: "https://x.com/candidate/2", authorHandle: "CineLens", matchedTopics: ["film"] }
  ], model);

  assert.deepEqual(ranked.map((item) => item.authorHandle), ["CineLens", "FreshHandle"]);
  assert.ok(Number(ranked[0].attributionBoost || 0) > 0);
});
