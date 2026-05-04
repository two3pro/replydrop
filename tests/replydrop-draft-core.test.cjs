const test = require("node:test");
const assert = require("node:assert/strict");

const draftCore = require("../replydrop-draft-core.js");

test("buildDraftPlan brings attribution memory forward when a candidate has validated history", () => {
  const plan = draftCore.buildDraftPlan(
    { replies: 18, score: 78, laneKey: "now" },
    { priority: 18, pickedUp: 1, reviewed: 2 }
  );

  assert.deepEqual(plan.map((item) => item.key), ["memory", "question", "contrast"]);
});

test("buildDraftPlan prefers a bridge close when the conversation is already active", () => {
  const plan = draftCore.buildDraftPlan(
    { replies: 66, score: 74, laneKey: "watch" },
    null
  );

  assert.deepEqual(plan.map((item) => item.key), ["perspective", "question", "bridge"]);
});

test("buildDraftRoutePlan prioritizes memory-line when author-back memory exists", () => {
  const routes = draftCore.buildDraftRoutePlan(
    { replies: 26, score: 75, laneKey: "now", timestamp: Date.now() - (35 * 60 * 1000) },
    { priority: 24, authorEngaged: 1, reviewed: 2, preferredSlot: "next" },
    { now: Date.now(), availableDraftKeys: ["memory", "perspective", "question", "contrast"] }
  );

  assert.equal(routes[0]?.key, "memory-line");
  assert.ok(routes[0]?.reasons.includes("author-back"));
  assert.equal(routes[0]?.voiceKey, "memory");
  assert.equal(routes[0]?.tone, "human");
  assert.equal(routes[0]?.sentenceTarget, 2);
  assert.equal(routes[0]?.preferQuestionClose, true);
  assert.equal(routes[0]?.starterIndex, 0);
  assert.equal(routes[0]?.bodyIndex, 0);
  assert.equal(routes[0]?.closerIndex, 1);
});

test("buildDraftRoutePlan prioritizes direct-take on a fresh high-score live window", () => {
  const now = Date.now();
  const routes = draftCore.buildDraftRoutePlan(
    { replies: 18, score: 81, laneKey: "now", timestamp: now - (20 * 60 * 1000) },
    null,
    { now, availableDraftKeys: ["perspective", "question", "contrast"] }
  );

  assert.equal(routes[0]?.key, "direct-take");
  assert.ok(routes[0]?.reasons.includes("live-window"));
  assert.ok(routes[0]?.reasons.includes("high-score"));
  assert.equal(routes[0]?.voiceKey, "direct");
  assert.equal(routes[0]?.tone, "sharp");
  assert.equal(routes[0]?.sentenceTarget, 2);
  assert.equal(routes[0]?.preferQuestionClose, false);
  assert.equal(routes[0]?.starterIndex, 2);
  assert.equal(routes[0]?.bodyIndex, 0);
  assert.equal(routes[0]?.closerIndex, 0);
});

test("buildDraftRoutePlan lifts question and bridge routes on slower crowded threads", () => {
  const now = Date.now();
  const routes = draftCore.buildDraftRoutePlan(
    { replies: 112, score: 69, laneKey: "watch", timestamp: now - (4 * 60 * 60 * 1000) },
    { reviewed: 1, preferredSlot: "tonight" },
    { now, availableDraftKeys: ["question", "bridge", "contrast"] }
  );

  assert.deepEqual(routes.slice(0, 2).map((item) => item.key), ["add-one-layer", "key-question"]);
  assert.ok(routes[0]?.reasons.includes("tonight-slot"));
  assert.equal(routes[0]?.voiceKey, "bridge");
  assert.equal(routes[0]?.tone, "warm");
  assert.equal(routes[0]?.sentenceTarget, 3);
  assert.equal(routes[0]?.starterIndex, 0);
  assert.equal(routes[0]?.bodyIndex, 2);
  assert.equal(routes[0]?.closerIndex, 2);
  assert.equal(routes[1]?.voiceKey, "question");
  assert.equal(routes[1]?.tone, "human");
  assert.equal(routes[1]?.sentenceTarget, 2);
  assert.equal(routes[1]?.preferQuestionClose, true);
  assert.equal(routes[1]?.starterIndex, 2);
  assert.equal(routes[1]?.bodyIndex, 2);
  assert.equal(routes[1]?.closerIndex, 1);
});

test("buildDraftRoutePlan treats reviewed-but-quiet memory as a question or bridge job, not validated pickup", () => {
  const now = Date.now();
  const routes = draftCore.buildDraftRoutePlan(
    { replies: 58, score: 65, laneKey: "watch", timestamp: now - (5 * 60 * 60 * 1000) },
    { reviewed: 2, settled: 1, pickedUp: 0, authorEngaged: 0, preferredSlot: "tonight", priority: 12 },
    { now, availableDraftKeys: ["memory", "question", "bridge", "perspective"] }
  );

  assert.deepEqual(routes.slice(0, 2).map((item) => item.key), ["add-one-layer", "key-question"]);
  assert.ok(routes[0]?.reasons.includes("reviewed-quiet"));
  assert.equal(routes[0]?.voiceKey, "bridge");
  assert.equal(routes[0]?.tone, "warm");
  assert.equal(routes[0]?.sentenceTarget, 3);
  assert.equal(routes[0]?.bodyIndex, 2);
  assert.ok(routes[1]?.reasons.includes("reviewed-quiet"));
  assert.equal(routes[1]?.voiceKey, "question");
  assert.equal(routes[1]?.tone, "human");
  assert.equal(routes[1]?.bodyIndex, 2);
});

test("buildDraftRoutePlan favors substantive takes on fresh accelerating posts with proven reach", () => {
  const now = Date.now();
  const routes = draftCore.buildDraftRoutePlan(
    { replies: 24, likes: 280, views: 9200, score: 79, laneKey: "now", timestamp: now - (38 * 60 * 1000) },
    null,
    { now, availableDraftKeys: ["perspective", "bridge", "question", "contrast"] }
  );

  assert.equal(routes[0]?.key, "direct-take");
  assert.ok(routes[0]?.reasons.includes("acceleration-window"));
  assert.ok(routes[0]?.reasons.includes("proven-reach"));
  assert.ok(routes[0]?.reasons.includes("unique-angle-window"));
  assert.equal(routes[1]?.key, "add-one-layer");
  assert.ok(routes[1]?.reasons.includes("unique-angle-window"));
});

test("detectStylePatternHits catches binary contrast phrasing", () => {
  const hits = draftCore.detectStylePatternHits("最猛的不是这个 demo 多炫，而是 3D 网站第一次从拼工程变成了拼想法和审美。");

  assert.deepEqual(hits, ["binary-contrast-zh"]);
});

test("detectStylePatternHits leaves normal direct phrasing alone", () => {
  const hits = draftCore.detectStylePatternHits("最猛的是 3D 网站第一次从拼工程变成了拼想法和审美，门槛一下子就降下来了。");

  assert.deepEqual(hits, []);
});

test("detectStylePatternHits catches report-tone abstraction", () => {
  const hits = draftCore.detectStylePatternHits("能从地缘政治的限制中找到自己的突破口，这背后是对产业链上下游的深刻理解和快速反应的体现。");

  assert.deepEqual(hits, ["report-tone-zh"]);
});
