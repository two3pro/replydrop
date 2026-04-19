const test = require("node:test");
const assert = require("node:assert/strict");

const focusCore = require("../replydrop-focus-core.js");

test("buildFocusDigestItems returns the stable operator chip set", () => {
  const items = focusCore.buildFocusDigestItems({
    focusCandidate: { authorHandle: "CineLens" },
    candidateCount: 6,
    queueCount: 2,
    reviewDueCount: 1,
    hotCount: 3,
    dismissedCount: 2
  });

  assert.deepEqual(
    items.map((item) => [item.key, item.value, item.tone]),
    [
      ["lead", "@CineLens", "accent"],
      ["candidates", 6, "soft"],
      ["queue", 2, "accent"],
      ["pickupDue", 1, "warning"],
      ["hotWindow", 3, "success"],
      ["dismissed", 2, "warning"]
    ]
  );
});

test("buildCandidatePreviewItems excludes the focused lead and honors the limit", () => {
  const preview = focusCore.buildCandidatePreviewItems(
    [
      { url: "https://x.com/1", authorHandle: "Lead" },
      { url: "https://x.com/2", authorHandle: "Second" },
      { url: "https://x.com/3", authorHandle: "Third" },
      { url: "https://x.com/4", authorHandle: "Fourth" }
    ],
    { url: "https://x.com/1", authorHandle: "Lead" },
    { limit: 2 }
  );

  assert.deepEqual(preview.map((item) => item.authorHandle), ["Second", "Third"]);
});
