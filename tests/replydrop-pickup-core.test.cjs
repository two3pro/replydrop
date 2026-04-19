const test = require("node:test");
const assert = require("node:assert/strict");

const pickupCore = require("../replydrop-pickup-core.js");

test("newly shipped reply schedules a first review in 45 minutes", () => {
  const shippedAt = 1_700_000_000_000;
  const plan = pickupCore.buildPickupReviewPlan({
    shippedAt,
    checkedAt: 0,
    checks: 0,
    status: "pending"
  });

  assert.equal(plan.reviewStage, "first-check");
  assert.equal(plan.nextReviewAt, shippedAt + pickupCore.FIRST_PICKUP_REVIEW_DELAY_MS);
  assert.equal(plan.settledAt, 0);
});

test("fresh shipment review state ignores stale settled cadence", () => {
  const shippedAt = 1_700_000_000_000;
  const state = pickupCore.buildFreshPickupReviewState({
    shippedAt,
    checkedAt: shippedAt + 9 * 60 * 60 * 1000,
    checks: 2,
    status: "author-engaged",
    reviewStage: "settled",
    nextReviewAt: shippedAt + 5_000,
    settledAt: shippedAt + 10_000
  });

  assert.deepEqual(state, {
    status: "pending",
    checkedAt: 0,
    checks: 0,
    reviewStage: "first-check",
    nextReviewAt: shippedAt + pickupCore.FIRST_PICKUP_REVIEW_DELAY_MS,
    settledAt: 0
  });
});

test("quiet first review schedules a follow-up in 3 hours", () => {
  const shippedAt = 1_700_000_000_000;
  const checkedAt = shippedAt + 50 * 60 * 1000;
  const plan = pickupCore.buildPickupReviewPlan({
    shippedAt,
    checkedAt,
    checks: 1,
    status: "quiet"
  });

  assert.equal(plan.reviewStage, "follow-up");
  assert.equal(plan.nextReviewAt, checkedAt + pickupCore.QUIET_PICKUP_REVIEW_DELAY_MS);
  assert.equal(plan.settledAt, 0);
});

test("picked-up first review schedules a follow-up in 6 hours", () => {
  const shippedAt = 1_700_000_000_000;
  const checkedAt = shippedAt + 70 * 60 * 1000;
  const plan = pickupCore.buildPickupReviewPlan({
    shippedAt,
    checkedAt,
    checks: 1,
    status: "picked-up"
  });

  assert.equal(plan.reviewStage, "follow-up");
  assert.equal(plan.nextReviewAt, checkedAt + pickupCore.ACTIVE_PICKUP_REVIEW_DELAY_MS);
  assert.equal(plan.settledAt, 0);
});

test("author engagement settles the review loop immediately", () => {
  const shippedAt = 1_700_000_000_000;
  const checkedAt = shippedAt + 30 * 60 * 1000;
  const plan = pickupCore.buildPickupReviewPlan({
    shippedAt,
    checkedAt,
    checks: 1,
    status: "author-engaged"
  });

  assert.equal(plan.reviewStage, "settled");
  assert.equal(plan.nextReviewAt, 0);
  assert.equal(plan.settledAt, checkedAt);
});

test("second completed check settles the review loop", () => {
  const shippedAt = 1_700_000_000_000;
  const checkedAt = shippedAt + 8 * 60 * 60 * 1000;
  const plan = pickupCore.buildPickupReviewPlan({
    shippedAt,
    checkedAt,
    checks: 2,
    status: "quiet"
  });

  assert.equal(plan.reviewStage, "settled");
  assert.equal(plan.nextReviewAt, 0);
  assert.equal(plan.settledAt, checkedAt);
});

test("old replies settle even without a second check once age passes one day", () => {
  const shippedAt = 1_700_000_000_000;
  const checkedAt = shippedAt + pickupCore.SETTLE_PICKUP_AFTER_MS + 1;
  const plan = pickupCore.buildPickupReviewPlan({
    shippedAt,
    checkedAt,
    checks: 1,
    status: "quiet"
  });

  assert.equal(plan.reviewStage, "settled");
  assert.equal(plan.nextReviewAt, 0);
  assert.equal(plan.settledAt, checkedAt);
});

test("snapshot status prioritizes author engagement over metric deltas", () => {
  assert.equal(pickupCore.resolvePickupSnapshotStatus({
    authorEngaged: true,
    deltaReplies: 5,
    deltaLikes: 12,
    deltaViews: 500
  }), "author-engaged");
});

test("snapshot status detects pickup from reply, like, or view deltas", () => {
  assert.equal(pickupCore.resolvePickupSnapshotStatus({ deltaReplies: 2 }), "picked-up");
  assert.equal(pickupCore.resolvePickupSnapshotStatus({ deltaLikes: 8 }), "picked-up");
  assert.equal(pickupCore.resolvePickupSnapshotStatus({ deltaViews: 120 }), "picked-up");
  assert.equal(pickupCore.resolvePickupSnapshotStatus({ deltaReplies: 1, deltaLikes: 7, deltaViews: 119 }), "quiet");
});
