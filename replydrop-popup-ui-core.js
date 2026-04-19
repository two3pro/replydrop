(function attachReplyDropPopupUiCore(globalScope) {
  const POPUP_UI_PREFS_KEY = "replydrop-popup-ui";
  const POPUP_VIEW_KEYS = ["home", "dashboard"];
  const POPUP_TAB_KEYS = ["desk", "overview", "signals", "keywords"];
  const DESK_SECTION_KEYS = ["growth", "ai"];
  const QUEUE_FILTER_KEYS = ["all", "action", "awaiting", "done"];

  function normalizeFromList(list, value, fallback) {
    const raw = String(value || fallback).trim();
    return list.includes(raw) ? raw : fallback;
  }

  function normalizePopupTab(value, fallback = "desk") {
    return normalizeFromList(POPUP_TAB_KEYS, value, fallback);
  }

  function normalizePopupView(value, fallback = "home") {
    return normalizeFromList(POPUP_VIEW_KEYS, value, fallback);
  }

  function normalizeDeskSection(value, fallback = "growth") {
    return normalizeFromList(DESK_SECTION_KEYS, value, fallback);
  }

  function normalizeQueueFilter(value, fallback = "all") {
    return normalizeFromList(QUEUE_FILTER_KEYS, value, fallback);
  }

  function normalizeAvailableKeys(allowedKeys, candidateKeys = []) {
    if (!Array.isArray(candidateKeys) || !candidateKeys.length) {
      return allowedKeys.slice();
    }

    const filtered = Array.from(new Set(
      candidateKeys
        .map((key) => String(key || "").trim())
        .filter((key) => allowedKeys.includes(key))
    ));

    return filtered.length ? filtered : allowedKeys.slice();
  }

  function getPopupTabFallback(options = {}) {
    const availableTabs = normalizeAvailableKeys(POPUP_TAB_KEYS, options.availableTabs);
    return availableTabs.includes("desk") ? "desk" : (availableTabs[0] || "overview");
  }

  function getPopupViewFallback(options = {}) {
    const availableViews = normalizeAvailableKeys(POPUP_VIEW_KEYS, options.availableViews);
    return availableViews.includes("home") ? "home" : (availableViews[0] || "dashboard");
  }

  function getDeskSectionFallback(options = {}) {
    const availableDeskSections = normalizeAvailableKeys(DESK_SECTION_KEYS, options.availableDeskSections);
    return availableDeskSections.includes("growth") ? "growth" : (availableDeskSections[0] || "growth");
  }

  function resolvePopupTab(value, fallback = "desk", options = {}) {
    const availableTabs = normalizeAvailableKeys(POPUP_TAB_KEYS, options.availableTabs);
    const resolvedFallback = normalizeFromList(availableTabs, fallback, getPopupTabFallback(options));
    return normalizeFromList(availableTabs, value, resolvedFallback);
  }

  function resolvePopupView(value, fallback = "home", options = {}) {
    const availableViews = normalizeAvailableKeys(POPUP_VIEW_KEYS, options.availableViews);
    const resolvedFallback = normalizeFromList(availableViews, fallback, getPopupViewFallback(options));
    return normalizeFromList(availableViews, value, resolvedFallback);
  }

  function resolveDeskSection(value, fallback = "growth", options = {}) {
    const availableDeskSections = normalizeAvailableKeys(DESK_SECTION_KEYS, options.availableDeskSections);
    const resolvedFallback = normalizeFromList(availableDeskSections, fallback, getDeskSectionFallback(options));
    return normalizeFromList(availableDeskSections, value, resolvedFallback);
  }

  function sanitizePopupUiPrefs(value = {}, options = {}) {
    const popupViewFallback = getPopupViewFallback(options);
    const popupTabFallback = getPopupTabFallback(options);
    const deskSectionFallback = getDeskSectionFallback(options);
    return {
      activeView: resolvePopupView(value?.activeView, popupViewFallback, options),
      activeTab: resolvePopupTab(value?.activeTab, popupTabFallback, options),
      deskSection: resolveDeskSection(value?.deskSection, deskSectionFallback, options),
      queueFilter: normalizeQueueFilter(value?.queueFilter, "all")
    };
  }

  function resolvePopupUiPrefs(value = {}, options = {}) {
    return sanitizePopupUiPrefs(value, options);
  }

  function buildPopupUiPrefs(currentValue = {}, patchValue = {}, options = {}) {
    const currentPrefs = sanitizePopupUiPrefs(currentValue, options);
    return {
      activeView: Object.prototype.hasOwnProperty.call(patchValue || {}, "activeView")
        ? resolvePopupView(patchValue?.activeView, currentPrefs.activeView, options)
        : currentPrefs.activeView,
      activeTab: Object.prototype.hasOwnProperty.call(patchValue || {}, "activeTab")
        ? resolvePopupTab(patchValue?.activeTab, currentPrefs.activeTab, options)
        : currentPrefs.activeTab,
      deskSection: Object.prototype.hasOwnProperty.call(patchValue || {}, "deskSection")
        ? resolveDeskSection(patchValue?.deskSection, currentPrefs.deskSection, options)
        : currentPrefs.deskSection,
      queueFilter: Object.prototype.hasOwnProperty.call(patchValue || {}, "queueFilter")
        ? normalizeQueueFilter(patchValue?.queueFilter, currentPrefs.queueFilter)
        : currentPrefs.queueFilter
    };
  }

  function parsePopupUiPrefs(raw) {
    if (!raw) {
      return null;
    }
    try {
      return sanitizePopupUiPrefs(JSON.parse(String(raw)));
    } catch {
      return null;
    }
  }

  function serializePopupUiPrefs(value = {}) {
    return JSON.stringify(sanitizePopupUiPrefs(value));
  }

  const api = {
    POPUP_UI_PREFS_KEY,
    POPUP_VIEW_KEYS,
    POPUP_TAB_KEYS,
    DESK_SECTION_KEYS,
    QUEUE_FILTER_KEYS,
    normalizePopupView,
    normalizePopupTab,
    normalizeDeskSection,
    normalizeQueueFilter,
    resolvePopupView,
    resolvePopupTab,
    resolveDeskSection,
    sanitizePopupUiPrefs,
    resolvePopupUiPrefs,
    buildPopupUiPrefs,
    parsePopupUiPrefs,
    serializePopupUiPrefs
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropPopupUiCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
