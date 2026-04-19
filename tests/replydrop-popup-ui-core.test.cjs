const test = require("node:test");
const assert = require("node:assert/strict");

const popupUiCore = require("../replydrop-popup-ui-core.js");

test("parsePopupUiPrefs restores valid saved state", () => {
  const parsed = popupUiCore.parsePopupUiPrefs(JSON.stringify({
    activeView: "dashboard",
    activeTab: "signals",
    deskSection: "ai",
    queueFilter: "done"
  }));

  assert.deepEqual(parsed, {
    activeView: "dashboard",
    activeTab: "signals",
    deskSection: "ai",
    queueFilter: "done"
  });
});

test("parsePopupUiPrefs sanitizes invalid values and invalid json", () => {
  assert.deepEqual(
    popupUiCore.parsePopupUiPrefs(JSON.stringify({ activeView: "bad", activeTab: "bad", deskSection: "weird", queueFilter: "nope" })),
    {
      activeView: "home",
      activeTab: "desk",
      deskSection: "growth",
      queueFilter: "all"
    }
  );
  assert.equal(popupUiCore.parsePopupUiPrefs("{"), null);
});

test("serializePopupUiPrefs keeps persisted state inside allowed keys", () => {
  const raw = popupUiCore.serializePopupUiPrefs({
    activeView: "dashboard",
    activeTab: "keywords",
    deskSection: "ai",
    queueFilter: "done",
    ignored: true
  });

  assert.equal(
    raw,
    JSON.stringify({ activeView: "dashboard", activeTab: "keywords", deskSection: "ai", queueFilter: "done" })
  );
});

test("resolvePopupUiPrefs falls back away from desk when desk tab is unavailable", () => {
  const resolved = popupUiCore.resolvePopupUiPrefs(
    {
      activeView: "dashboard",
      activeTab: "desk",
      deskSection: "growth",
      queueFilter: "action"
    },
    {
      availableTabs: ["overview", "signals", "keywords"]
    }
  );

  assert.deepEqual(resolved, {
    activeView: "dashboard",
    activeTab: "overview",
    deskSection: "growth",
    queueFilter: "action"
  });
});

test("buildPopupUiPrefs preserves current valid state when a patch is invalid", () => {
  const current = {
    activeView: "dashboard",
    activeTab: "desk",
    deskSection: "ai",
    queueFilter: "done"
  };

  assert.deepEqual(
    popupUiCore.buildPopupUiPrefs(current, { activeView: "home", activeTab: "overview" }),
    {
      activeView: "home",
      activeTab: "overview",
      deskSection: "ai",
      queueFilter: "done"
    }
  );

  assert.deepEqual(
    popupUiCore.buildPopupUiPrefs(current, { activeView: "bad", activeTab: "bad", deskSection: "weird", queueFilter: "nope" }),
    current
  );
});

test("resolvePopupUiPrefs falls back away from home when only dashboard is available", () => {
  const resolved = popupUiCore.resolvePopupUiPrefs(
    {
      activeView: "home",
      activeTab: "desk",
      deskSection: "growth",
      queueFilter: "all"
    },
    {
      availableViews: ["dashboard"]
    }
  );

  assert.deepEqual(resolved, {
    activeView: "dashboard",
    activeTab: "desk",
    deskSection: "growth",
    queueFilter: "all"
  });
});

test("legacy desk sections fall back to growth after workbench simplification", () => {
  const resolved = popupUiCore.parsePopupUiPrefs(JSON.stringify({
    activeView: "dashboard",
    activeTab: "desk",
    deskSection: "focus",
    queueFilter: "all"
  }));

  assert.deepEqual(resolved, {
    activeView: "dashboard",
    activeTab: "desk",
    deskSection: "growth",
    queueFilter: "all"
  });
});
