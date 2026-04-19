(function attachReplyDropDraftCore(globalScope) {
  const DRAFT_ROUTE_DEFS = [
    {
      key: "memory-line",
      draftKey: "memory",
      tone: "warm",
      starterIndex: 1,
      bodyIndex: 0,
      closerIndex: 0
    },
    {
      key: "direct-take",
      draftKey: "perspective",
      tone: "sharp",
      starterIndex: 0,
      bodyIndex: 2,
      closerIndex: 0
    },
    {
      key: "key-question",
      draftKey: "question",
      tone: "neutral",
      starterIndex: 0,
      bodyIndex: 0,
      closerIndex: 1
    },
    {
      key: "soft-contrast",
      draftKey: "contrast",
      tone: "sharp",
      starterIndex: 1,
      bodyIndex: 0,
      closerIndex: 2
    },
    {
      key: "add-one-layer",
      draftKey: "bridge",
      tone: "warm",
      starterIndex: 0,
      bodyIndex: 0,
      closerIndex: 0
    }
  ];

  function clampNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function uniqueStringList(list = []) {
    return Array.from(new Set(
      (Array.isArray(list) ? list : [])
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    ));
  }

  function hasStrongAttributionMemory(signal = null) {
    if (!signal) {
      return false;
    }
    return Boolean(
      Number(signal.authorEngaged || 0) > 0 ||
      Number(signal.pickedUp || 0) > 0 ||
      Number(signal.reviewed || 0) > 0 ||
      Number(signal.settled || 0) > 0 ||
      Number(signal.priority || 0) >= 10
    );
  }

  function hasValidatedPickupMemory(signal = null) {
    if (!signal) {
      return false;
    }
    return Boolean(
      Number(signal.authorEngaged || 0) > 0 ||
      Number(signal.pickedUp || 0) > 0
    );
  }

  function pushReason(reasons, key, weight) {
    const reasonKey = String(key || "").trim();
    if (!reasonKey) {
      return;
    }
    const numericWeight = clampNumber(weight, 0);
    const existing = reasons.find((item) => item.key === reasonKey);
    if (existing) {
      existing.weight = Math.max(existing.weight, numericWeight);
      return;
    }
    reasons.push({ key: reasonKey, weight: numericWeight });
  }

  function getCandidateAgeMinutes(candidate = {}, now = Date.now()) {
    const timestamp = clampNumber(candidate.timestamp, 0);
    if (!timestamp) {
      return 999;
    }
    return Math.max(0, Math.floor((clampNumber(now, Date.now()) - timestamp) / 60000));
  }

  function clampDraftOptionIndex(value, fallback = 0) {
    return Math.max(0, Math.min(2, Math.floor(clampNumber(value, fallback))));
  }

  function getHourlyRate(value, ageMinutes) {
    const count = Math.max(0, Math.floor(clampNumber(value, 0)));
    const minutes = Math.max(1, clampNumber(ageMinutes, 0));
    if (!count) {
      return 0;
    }
    return count / Math.max(minutes / 60, 0.25);
  }

  function resolveRouteComposition(route = {}, context = {}, reasons = []) {
    const routeKey = String(route.key || "").trim();
    const reasonSet = new Set(uniqueStringList(reasons));
    const laneKey = String(context.laneKey || "").trim() || "backlog";
    const preferredSlot = String(context.preferredSlot || "").trim();
    const replies = Math.max(0, Math.floor(clampNumber(context.replies, 0)));
    const score = Math.max(0, Math.floor(clampNumber(context.score, 0)));
    const ageMinutes = Math.max(0, Math.floor(clampNumber(context.ageMinutes, 999)));
    const reviewed = Math.max(0, Math.floor(clampNumber(context.reviewed, 0)));
    const settled = Math.max(0, Math.floor(clampNumber(context.settled, 0)));
    const pickedUp = Math.max(0, Math.floor(clampNumber(context.pickedUp, 0)));
    const authorEngaged = Math.max(0, Math.floor(clampNumber(context.authorEngaged, 0)));
    const validatedPickupMemory = authorEngaged > 0 || pickedUp > 0;
    const reviewedOnly = !validatedPickupMemory && (reviewed > 0 || settled > 0);
    const liveWindow = laneKey === "now" || reasonSet.has("live-window");
    const slowSlot = (
      preferredSlot === "tonight" ||
      preferredSlot === "tomorrow" ||
      reasonSet.has("slower-slot") ||
      reasonSet.has("tomorrow-slot") ||
      reasonSet.has("tonight-slot")
    );
    const crowded = replies >= 70 || reasonSet.has("crowded-thread") || reasonSet.has("crowded-consensus");
    const reviewedMemory = reviewed > 0 || settled > 0 || reasonSet.has("reviewed-memory");
    const fresh = ageMinutes <= 90 || reasonSet.has("fresh-window");
    const veryFresh = ageMinutes <= 45;

    switch (routeKey) {
      case "memory-line":
        return {
          voiceKey: "memory",
          tone: authorEngaged > 0 ? "human" : (validatedPickupMemory && liveWindow ? "short" : "warm"),
          sentenceTarget: authorEngaged > 0 || (validatedPickupMemory && liveWindow) ? 2 : 3,
          preferQuestionClose: authorEngaged > 0,
          starterIndex: clampDraftOptionIndex(authorEngaged > 0 ? 0 : ((validatedPickupMemory && liveWindow) ? 2 : 1), route.starterIndex),
          bodyIndex: clampDraftOptionIndex(validatedPickupMemory ? 0 : (reviewedOnly ? 2 : ((liveWindow || reviewedMemory) ? 0 : 1)), route.bodyIndex),
          closerIndex: clampDraftOptionIndex(authorEngaged > 0 ? 1 : (reviewedOnly ? 2 : (reviewedMemory ? 2 : 0)), route.closerIndex)
        };
      case "direct-take":
        return {
          voiceKey: "direct",
          tone: veryFresh && score >= 78 ? "sharp" : (liveWindow ? "human" : (reviewedOnly ? "human" : "neutral")),
          sentenceTarget: 2,
          preferQuestionClose: false,
          starterIndex: clampDraftOptionIndex(veryFresh ? 2 : (liveWindow ? 0 : 1), route.starterIndex),
          bodyIndex: clampDraftOptionIndex(score >= 80 && !reviewedOnly ? 0 : (slowSlot || reviewedOnly ? 1 : 2), route.bodyIndex),
          closerIndex: clampDraftOptionIndex(liveWindow ? 0 : 2, route.closerIndex)
        };
      case "key-question":
        return {
          voiceKey: "question",
          tone: slowSlot || crowded || reviewedOnly ? "human" : "neutral",
          sentenceTarget: 2,
          preferQuestionClose: true,
          starterIndex: clampDraftOptionIndex(crowded || slowSlot ? 2 : 0, route.starterIndex),
          bodyIndex: clampDraftOptionIndex(reviewedOnly || reviewedMemory ? 2 : (crowded ? 0 : 1), route.bodyIndex),
          closerIndex: clampDraftOptionIndex(crowded || slowSlot ? 1 : 0, route.closerIndex)
        };
      case "soft-contrast":
        return {
          voiceKey: "contrast",
          tone: crowded || reasonSet.has("low-memory") ? "human" : "sharp",
          sentenceTarget: 2,
          preferQuestionClose: false,
          starterIndex: clampDraftOptionIndex(crowded ? 2 : 1, route.starterIndex),
          bodyIndex: clampDraftOptionIndex(
            reasonSet.has("crowded-consensus") || reasonSet.has("low-memory") ? 2 : 1,
            route.bodyIndex
          ),
          closerIndex: clampDraftOptionIndex(crowded ? 2 : 0, route.closerIndex)
        };
      case "add-one-layer":
        return {
          voiceKey: "bridge",
          tone: slowSlot || reviewedOnly ? "warm" : "human",
          sentenceTarget: slowSlot || reviewedOnly ? 3 : 2,
          preferQuestionClose: false,
          starterIndex: clampDraftOptionIndex(slowSlot ? 0 : (liveWindow ? 1 : 2), route.starterIndex),
          bodyIndex: clampDraftOptionIndex(reviewedOnly ? 2 : (crowded ? 0 : (slowSlot ? 2 : 1)), route.bodyIndex),
          closerIndex: clampDraftOptionIndex(slowSlot ? 2 : 0, route.closerIndex)
        };
      default:
        return {
          voiceKey: "default",
          tone: route.tone || "neutral",
          sentenceTarget: 3,
          preferQuestionClose: false,
          starterIndex: clampDraftOptionIndex(route.starterIndex, 0),
          bodyIndex: clampDraftOptionIndex(route.bodyIndex, 0),
          closerIndex: clampDraftOptionIndex(route.closerIndex, 0)
        };
    }
  }

  function buildDraftRoutePlan(candidate = {}, attributionSignal = null, options = {}) {
    const replies = Math.max(0, Math.floor(clampNumber(candidate.replies, 0)));
    const likes = Math.max(0, Math.floor(clampNumber(candidate.likes, 0)));
    const views = Math.max(0, Math.floor(clampNumber(candidate.views, 0)));
    const score = Math.max(0, Math.floor(clampNumber(candidate.score, 0)));
    const laneKey = String(options.laneKey || candidate.laneKey || "").trim() || "backlog";
    const preferredSlot = String(options.preferredSlot || attributionSignal?.preferredSlot || "").trim();
    const ageMinutes = getCandidateAgeMinutes(candidate, options.now);
    const viewsPerHour = getHourlyRate(views, ageMinutes);
    const repliesPerHour = getHourlyRate(replies, ageMinutes);
    const hasMemory = hasStrongAttributionMemory(attributionSignal);
    const reviewed = Math.max(0, Math.floor(clampNumber(attributionSignal?.reviewed, 0)));
    const settled = Math.max(0, Math.floor(clampNumber(attributionSignal?.settled, 0)));
    const pickedUp = Math.max(0, Math.floor(clampNumber(attributionSignal?.pickedUp, 0)));
    const authorEngaged = Math.max(0, Math.floor(clampNumber(attributionSignal?.authorEngaged, 0)));
    const priority = Math.max(0, Math.floor(clampNumber(attributionSignal?.priority, 0)));
    const validatedPickupMemory = hasValidatedPickupMemory(attributionSignal);
    const reviewedOnly = !validatedPickupMemory && (reviewed > 0 || settled > 0);
    const provenReach = views >= 2000;
    const acceleratingWindow = ageMinutes <= 75 && viewsPerHour >= 5000;
    const replyRoom = replies >= 8 && replies <= 160;
    const substantiveIdeaWindow = (provenReach || viewsPerHour >= 8000 || likes >= 160) && replyRoom;
    const availableDraftKeys = new Set(uniqueStringList(options.availableDraftKeys || DRAFT_ROUTE_DEFS.map((item) => item.draftKey)));

    return DRAFT_ROUTE_DEFS
      .filter((route) => availableDraftKeys.has(route.draftKey))
      .map((route, index) => {
        const reasons = [];
        let routeScore = 12;

        switch (route.key) {
          case "memory-line":
            routeScore += 4;
            if (hasMemory) {
              routeScore += 14;
              pushReason(reasons, "memory-proof", 14);
            }
            if (authorEngaged > 0) {
              routeScore += 22;
              pushReason(reasons, "author-back", 22);
            }
            if (pickedUp > 0) {
              routeScore += 14;
              pushReason(reasons, "picked-up", 14);
            }
            if (reviewedOnly) {
              routeScore += 3;
              pushReason(reasons, "reviewed-quiet", 3);
            } else if (reviewed > 0 || settled > 0) {
              routeScore += 9;
              pushReason(reasons, "reviewed-memory", 9);
            }
            if (priority >= 18) {
              routeScore += validatedPickupMemory ? 8 : 3;
              pushReason(reasons, "memory-priority", validatedPickupMemory ? 8 : 3);
            }
            if (laneKey === "now") {
              routeScore += 6;
              pushReason(reasons, "live-window", 6);
            }
            if (preferredSlot === "next") {
              routeScore += 4;
              pushReason(reasons, "next-slot", 4);
            }
            if (!validatedPickupMemory && acceleratingWindow) {
              routeScore -= 6;
            }
            if (!validatedPickupMemory && provenReach) {
              routeScore -= 4;
            }
            if (!hasMemory) {
              routeScore -= 18;
            }
            break;
          case "direct-take":
            routeScore += 6;
            if (laneKey === "now") {
              routeScore += 18;
              pushReason(reasons, "live-window", 18);
            } else if (laneKey === "watch") {
              routeScore += 8;
              pushReason(reasons, "still-open", 8);
            }
            if (score >= 72) {
              routeScore += 14;
              pushReason(reasons, "high-score", 14);
            } else if (score >= 60) {
              routeScore += 8;
              pushReason(reasons, "workable-score", 8);
            }
            if (ageMinutes <= 90) {
              routeScore += 8;
              pushReason(reasons, "fresh-window", 8);
            } else if (ageMinutes <= 180) {
              routeScore += 5;
              pushReason(reasons, "fresh-window", 5);
            }
            if (preferredSlot === "next") {
              routeScore += 6;
              pushReason(reasons, "next-slot", 6);
            }
            if (replies < 80) {
              routeScore += 4;
              pushReason(reasons, "clean-entry", 4);
            }
            if (acceleratingWindow) {
              routeScore += 10;
              pushReason(reasons, "acceleration-window", 10);
            }
            if (provenReach) {
              routeScore += 12;
              pushReason(reasons, "proven-reach", 12);
            }
            if (substantiveIdeaWindow) {
              routeScore += 11;
              pushReason(reasons, "unique-angle-window", 11);
            }
            if (authorEngaged > 0) {
              routeScore -= 8;
            }
            if (reviewedOnly && laneKey !== "now") {
              routeScore -= 5;
            }
            if (replies >= 120) {
              routeScore -= 10;
            }
            break;
          case "key-question":
            if (replies >= 40) {
              routeScore += 14;
              pushReason(reasons, "crowded-thread", 14);
            }
            if (replies >= 120) {
              routeScore += 8;
              pushReason(reasons, "thread-moving", 8);
            }
            if (laneKey !== "now") {
              routeScore += 10;
              pushReason(reasons, "slower-window", 10);
            }
            if (preferredSlot === "tonight" || preferredSlot === "tomorrow") {
              routeScore += 6;
              pushReason(reasons, "slower-slot", 6);
            }
            if (reviewed > 0 || settled > 0) {
              routeScore += 6;
              pushReason(reasons, "reviewed-memory", 6);
            }
            if (reviewedOnly) {
              routeScore += 10;
              pushReason(reasons, "reviewed-quiet", 10);
            }
            if (substantiveIdeaWindow) {
              routeScore += 4;
              pushReason(reasons, "community-thread", 4);
            }
            if (acceleratingWindow && repliesPerHour >= 18) {
              routeScore += 4;
              pushReason(reasons, "acceleration-window", 4);
            }
            if (score >= 52 && score <= 78) {
              routeScore += 6;
              pushReason(reasons, "open-variable", 6);
            }
            if (ageMinutes > 120) {
              routeScore += 6;
              pushReason(reasons, "older-window", 6);
            }
            break;
          case "soft-contrast":
            if (replies >= 70) {
              routeScore += 12;
              pushReason(reasons, "crowded-consensus", 12);
            }
            if (score >= 68) {
              routeScore += 8;
              pushReason(reasons, "high-score", 8);
            }
            if (!hasMemory) {
              routeScore += 8;
              pushReason(reasons, "low-memory", 8);
            }
            if (laneKey === "watch" || laneKey === "crowded") {
              routeScore += 8;
              pushReason(reasons, "crowded-thread", 8);
            }
            if (ageMinutes <= 180) {
              routeScore += 4;
              pushReason(reasons, "still-open", 4);
            }
            if (acceleratingWindow) {
              routeScore += 8;
              pushReason(reasons, "acceleration-window", 8);
            }
            if (substantiveIdeaWindow) {
              routeScore += 6;
              pushReason(reasons, "unique-angle-window", 6);
            }
            if (authorEngaged > 0) {
              routeScore -= 14;
            }
            if (preferredSlot === "tomorrow") {
              routeScore += 4;
              pushReason(reasons, "tomorrow-slot", 4);
            }
            break;
          case "add-one-layer":
            if (replies >= 35) {
              routeScore += 12;
              pushReason(reasons, "thread-moving", 12);
            }
            if (replies >= 35 && replies <= 140) {
              routeScore += 8;
              pushReason(reasons, "extend-thread", 8);
            }
            if (laneKey === "watch" || laneKey === "crowded") {
              routeScore += 10;
              pushReason(reasons, "slower-window", 10);
            }
            if (preferredSlot === "tonight") {
              routeScore += 14;
              pushReason(reasons, "tonight-slot", 14);
            } else if (preferredSlot === "tomorrow") {
              routeScore += 6;
              pushReason(reasons, "tomorrow-slot", 6);
            }
            if (replyRoom) {
              routeScore += 6;
              pushReason(reasons, "community-thread", 6);
            }
            if (provenReach) {
              routeScore += 8;
              pushReason(reasons, "proven-reach", 8);
            }
            if (acceleratingWindow || substantiveIdeaWindow) {
              routeScore += 14;
              pushReason(reasons, "unique-angle-window", 14);
            }
            if (acceleratingWindow) {
              routeScore += 8;
              pushReason(reasons, "acceleration-window", 8);
            }
            if (score >= 58 && score <= 80) {
              routeScore += 6;
              pushReason(reasons, "workable-score", 6);
            }
            if (reviewedOnly) {
              routeScore += 12;
              pushReason(reasons, "reviewed-quiet", 12);
            }
            if (laneKey === "now" && ageMinutes <= 45) {
              routeScore -= 6;
            }
            break;
          default:
            break;
        }

        const resolvedReasons = reasons
          .sort((left, right) => right.weight - left.weight || left.key.localeCompare(right.key))
          .map((item) => item.key)
          .slice(0, 5);
        const composition = resolveRouteComposition(route, {
          laneKey,
          preferredSlot,
          replies,
          score,
          ageMinutes,
          reviewed,
          settled,
          pickedUp,
          authorEngaged
        }, resolvedReasons);

        return {
          ...route,
          ...composition,
          score: routeScore,
          reasons: resolvedReasons,
          rank: index
        };
      })
      .sort((left, right) => (
        Number(right.score || 0) - Number(left.score || 0) ||
        Number(left.rank || 0) - Number(right.rank || 0)
      ))
      .slice(0, Math.max(1, Math.floor(clampNumber(options.limit, 3)) || 3));
  }

  function buildDraftPlan(candidate = {}, attributionSignal = null, options = {}) {
    const replies = Math.max(0, Math.floor(clampNumber(candidate.replies, 0)));
    const score = Math.max(0, Math.floor(clampNumber(candidate.score, 0)));
    const crowded = replies >= 40;
    const laneKey = String(options.laneKey || candidate.laneKey || "").trim() || "backlog";
    const hasMemory = hasStrongAttributionMemory(attributionSignal);

    const plans = [];

    plans.push({
      key: hasMemory ? "memory" : "perspective",
      tone: hasMemory ? "success" : "accent",
      emphasis: hasMemory ? "memory" : "highlight"
    });

    plans.push({
      key: "question",
      tone: "soft",
      emphasis: crowded ? "highlight" : (hasMemory ? "memory" : "topic")
    });

    plans.push({
      key: crowded || laneKey === "watch" || laneKey === "crowded"
        ? "bridge"
        : (score >= 72 ? "contrast" : "perspective"),
      tone: "warning",
      emphasis: crowded ? "topic" : (hasMemory ? "memory" : "highlight")
    });

    return plans
      .filter(Boolean)
      .filter((plan, index, list) => list.findIndex((item) => item.key === plan.key) === index)
      .slice(0, 3);
  }

  const api = {
    buildDraftPlan,
    buildDraftRoutePlan,
    hasStrongAttributionMemory,
    hasValidatedPickupMemory
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropDraftCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
