(function installReplyDropBrowserCompat(global) {
  if (global.chrome?.runtime?.sendMessage) {
    return;
  }

  const source = global.browser;
  if (!source) {
    return;
  }

  function getLastError() {
    return global.chrome?.runtime?.lastError || null;
  }

  function setLastError(error) {
    if (!global.chrome?.runtime) {
      return;
    }
    global.chrome.runtime.lastError = error ? { message: String(error?.message || error) } : undefined;
  }

  function callbackify(fn) {
    return function replyDropCompatCallbackified(...args) {
      const callback = typeof args[args.length - 1] === "function" ? args.pop() : null;
      try {
        const result = fn.apply(this, args);
        if (callback) {
          Promise.resolve(result).then((value) => {
            setLastError(null);
            callback(value);
          }).catch((error) => {
            setLastError(error);
            callback(undefined);
          });
          return undefined;
        }
        return result;
      } catch (error) {
        if (callback) {
          setLastError(error);
          callback(undefined);
          return undefined;
        }
        return Promise.reject(error);
      }
    };
  }

  const chromeCompat = {
    runtime: {
      get lastError() {
        return getLastError();
      },
      set lastError(value) {
        Object.defineProperty(chromeCompat.runtime, "__lastError", {
          value,
          configurable: true,
          writable: true
        });
      },
      getManifest: (...args) => source.runtime.getManifest(...args),
      getURL: (...args) => source.runtime.getURL(...args),
      openOptionsPage: (...args) => source.runtime.openOptionsPage(...args),
      sendMessage: callbackify(source.runtime.sendMessage.bind(source.runtime)),
      onMessage: source.runtime.onMessage,
      onInstalled: source.runtime.onInstalled || { addListener() {} },
      onStartup: source.runtime.onStartup || { addListener() {} }
    },
    storage: {
      local: {
        get: callbackify(source.storage.local.get.bind(source.storage.local)),
        set: callbackify(source.storage.local.set.bind(source.storage.local)),
        remove: source.storage.local.remove ? callbackify(source.storage.local.remove.bind(source.storage.local)) : undefined,
        clear: source.storage.local.clear ? callbackify(source.storage.local.clear.bind(source.storage.local)) : undefined
      }
    },
    tabs: source.tabs ? {
      query: callbackify(source.tabs.query.bind(source.tabs)),
      sendMessage: callbackify(source.tabs.sendMessage.bind(source.tabs)),
      create: source.tabs.create ? callbackify(source.tabs.create.bind(source.tabs)) : undefined,
      update: source.tabs.update ? callbackify(source.tabs.update.bind(source.tabs)) : undefined,
      get: source.tabs.get ? callbackify(source.tabs.get.bind(source.tabs)) : undefined
    } : undefined,
    alarms: source.alarms ? {
      create: callbackify(source.alarms.create.bind(source.alarms)),
      clear: callbackify(source.alarms.clear.bind(source.alarms)),
      onAlarm: source.alarms.onAlarm
    } : { create() {}, clear() { return Promise.resolve(false); }, onAlarm: { addListener() {} } },
    action: source.action ? {
      setBadgeBackgroundColor: callbackify(source.action.setBadgeBackgroundColor.bind(source.action)),
      setBadgeText: callbackify(source.action.setBadgeText.bind(source.action))
    } : { setBadgeBackgroundColor() {}, setBadgeText() {} }
  };

  Object.defineProperty(chromeCompat.runtime, "lastError", {
    get() {
      return chromeCompat.runtime.__lastError;
    },
    set(value) {
      chromeCompat.runtime.__lastError = value;
    },
    configurable: true
  });

  global.chrome = chromeCompat;
})(typeof globalThis !== "undefined" ? globalThis : this);
