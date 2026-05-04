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

  const DRAFT_STYLE_PATTERNS = [
    { key: "binary-contrast-zh", regex: /(?:不是[^。！？!?]{0,48}而是|不在于[^。！？!?]{0,48}而在于)/u },
    { key: "binary-contrast-en", regex: /\b(?:not|(?:is|are|was|were|am|do|does|did|can|could|should|would|has|have|had)(?:\s+not|n't))\b[^.!?]{0,72}\bbut\b/i },
    { key: "binary-contrast-ko", regex: /아니라[^.!?。！？]{0,48}/u },
    { key: "binary-contrast-ja", regex: /ではなく[^。！？!?]{0,48}/u },
    { key: "report-tone-zh", regex: /(?:这背后是对[^。！？!?]{0,40}(?:深刻理解|精准把握|快速反应)[^。！？!?]{0,20}(?:体现|反映)|信息不对称的典型表现|信息差带来的不透明感)/u },
    { key: "report-tone-en", regex: /\b(?:captures the current [a-z- ]{0,28}trend|the race is really about|highlights? how)\b/i },
    { key: "report-tone-ko", regex: /(근본(?:적)?(?:인)?\s*(?:동력|원동력)|정보\s*비대칭의\s*전형)/u },
    { key: "report-tone-ko-specific", regex: /(복합적으로\s*작용(?:한다는\s*점)?|점을\s*고려해야\s*합니다|다시\s*한\s*번\s*확인하게\s*하(?:죠|게\s*됩니다)|경고하는\s*것입니다|보장한다는\s*것은\s*과장일\s*수\s*있(?:고|습니다)|과장일\s*수\s*있(?:고|습니다)|될지\s*여부)/u },
    { key: "report-tone-zh-specific", regex: /(矛盾点在于|展现了同一个主题的多维性|差异不在于孰优孰劣，而在于|生命力取向|大家都是能体会的|信息差会被放大很多|这就是一个取舍的过程|基础透明度不是零|项目本身的存在确实是需要|值得关注|大家都很关注|很大程度上取决于|思维层面已经在发生变化|话说回来)/u },
    { key: "hyperbole-zh-specific", regex: /(?:把[^。！？!?]{0,20}(?:变成|当成)了[^。！？!?]{0,16}(?:通往[^。！？!?]{0,10}的燃料|唯一选项的赌局)|一个人扛下整部[^。！？!?]{0,14}(?:式)?的剧本)/u },
    { key: "column-tone-ko-specific", regex: /(?:단순한\s*편의(?:를)?\s*넘어선[^.!?。！？]{0,24}(?:휴식터|쉼터|공간|장소)|필수적인\s*(?:휴식터|쉼터)(?:가|이)?\s*되어야\s*할\s*것\s*같습니다)/u },
    { key: "report-tone-en-specific", regex: /\b(?:signals? a shift in|structural shift|highlights? that growth often means|filtering out passive noise|quality engagement|value promise|root your stability in something immense|visible foundations are crumbling|cuts?\s+through\s+the\s+noise|what actually matters|the real focal point|your post rightly|recovery arc|deep local connection|support feels genuine|global stage|share a piece of (?:themselves|yourself)|honor resilience in action|static archives?\s+to\s+dynamic processes?|signal relevance over raw data volume|transaction than community|real growth usually comes from|(?:the\s+)?real shift happens when|(?:the\s+)?core question isn'?t whether|(?:the\s+)?real transformation isn'?t|(?:finally\s+)?separate(?:s|d)?\s+(?:real|actual|serious)\s+[a-z- ]{0,24}\s+from\s+the\s+noise)\b/i },
    { key: "motivation-tone-en", regex: /\b(?:consistency is what compounds|small,\s*consistent efforts|the bigger picture|unwavering faith when everything else is shaking|consistency often outsmarts intensity|the trick isn'?t the size of the step|every single day|starting early is a smarter trade|extra hours only matter if you actually use them|powerful way to reset|showing up consistently)\b/i },
    { key: "creator-generic-en", regex: /\b(?:real milestone(?:\s+that\s+shows)?|genuine community support|consistent quality content|build(?:ing)? that trust|short attention span era)\b/i },
    { key: "business-wrap-en", regex: /\b(?:disciplined execution|(?:not|isn'?t|is not)\s+just luck|the real test(?:\s+is)?|true differentiator|sustaining that pace|when easy wins disappear|dangerous reward for bad behavior|destroys a system)\b/i },
    { key: "sermon-tone-en", regex: /\b(?:prayerful moment|forgive while seeking deliverance|forgiveness and protection|gentle balance)\b/i },
    { key: "virtue-sermon-en", regex: /\b(?:pure intentions?(?:\s+in\s+a\s+noisy\s+environment)?|value good people when shortcuts are everywhere|listening until you shrink|setting a floor before you speak|cost is already paid)\b/i },
    { key: "coaching-therapy-en", regex: /\b(?:every day is still a good day because|showing up to create|(?:from\s+)?demanding perfection to just starting|the real trick most of us miss|identity remains (?:the )?anchor|becomes? a daily filter|perfect conditions|perfect plan|perfect moment is an illusion|most people hesitate|(?:the\s+)?first step often reveals more about your readiness|than the outcome ever will|that hesitation is actually the real work|keeps you grounded|weakness feels overwhelming|treats?\s+(?:flaws|weakness|mistakes)\s+as\s+context\s+rather\s+than\s+(?:a|the)\s+barrier\s+to\s+(?:progress|growth)|barrier to progress)\b/i },
    { key: "trader-aphorism-en", regex: /\b(?:precision matters,\s*but|the real edge comes from|human patience often defies(?: typical)? market behavior|true [a-z- ]{0,18} emerges(?: not from [a-z- ]{0,24})?)\b/i },
    { key: "blame-shift-en", regex: /\b(?:comes?|stems?|feels?|reads?)\s+less\s+from\b[^.!?]{0,56}\bmore\s+from\b/i },
    { key: "workflow-blame-en", regex: /\b(?:lack of patience(?:\s+in\s+(?:the|your|their|user'?s)\s+workflow)?|patience in (?:the|your|their|user'?s)\s+workflow)\b/i },
    { key: "responsibility-verdict-en", regex: /\b(?:must provide a full update(?:\s+from\s+[A-Z][A-Z]+)?\s+to\s+(?:this|the)\s+community|owes?\s+(?:this|the)\s+community\s+a\s+full\s+update|bears?\s+the\s+ultimate\s+responsibility(?:\s+to\s+[a-z- ]{0,24})?)\b/i },
    { key: "psychoanalysis-en", regex: /\b(?:clearly signal(?:s)?|deep anxiety|simple shyness|emotional unavailability|psychological scars|deep-seated wounds)\b/i },
    { key: "moral-certainty-en", regex: /\b(?:the only way to truly connect|the only real discipline left here|true change demands|guarantees no healing)\b/i },
    { key: "group-psychoanalysis-en", regex: /\b(?:carry(?:ing)? a mix of [a-z- ]{0,24}(?:loyalty|anxiety)|deep loyalty and high anxiety|shows? how [a-z- ]{0,24}\s+can both\s+[a-z-]+\s+and\s+[a-z-]+|fandom can both heal and distract)\b/i },
    { key: "soft-therapy-en", regex: /\b(?:seeking stillness in [a-z- ]+|quiet way to escape(?: the)? noise of [a-z- ]+|noise of expectations|stillness in unknown sounds)\b/i },
    { key: "grandstand-unity-en", regex: /\b(?:real strength only emerges when|forces? a hard choice|it'?s not about whether|people stand together despite their differences)\b/i },
    { key: "tagline-close-en", regex: /(?:^|[.!?]\s*)it works(?:[.!?]|$)/i },
    { key: "relationship-projection-en", regex: /\b(?:glad your (?:girlfriend|boyfriend|partner|wife|husband) is happy with you|regardless of the situation)\b/i },
    { key: "relationship-projection-zh", regex: /(?:亲密关系里[^。！？!?]{0,28}期待[^。！？!?]{0,20}不对等|深度联结[^。！？!?]{0,24}期待[^。！？!?]{0,20}不对等)/u },
    { key: "identity-projection-ko", regex: /(가짜\s*성\s*정체성|권력\s*착취가\s*섞여\s*있(?:는|다고)|피해자가\s*겪은\s*고통이\s*얼마나\s*깊었는지)/u },
    { key: "summary-close-zh", regex: /(综上所述|归根结底|说到底|本质上)/u },
    { key: "summary-close-en", regex: /\b(in conclusion|at the end of the day|ultimately)\b/i },
    { key: "abstract-close-en", regex: /\b(defines the next layer of|genuine value beyond|mastering the fundamentals|sustainable growth relies on)\b/i },
    { key: "narrator-setup-en", regex: /\bit sounds like\b/i },
    { key: "summary-close-ko", regex: /(결국|요약하면)/u },
    { key: "summary-close-ja", regex: /(要するに|結局)/u },
    { key: "mechanical-order-zh", regex: /(?:^|[。！？!?；;\s])(首先|其次|最后)(?:[，,:：]|$)/u },
    { key: "symmetry-padding-zh", regex: /既要[^。！？!?]{0,24}又要/u },
    { key: "what-if-hook-en", regex: /\bwhat if i told you\b/i }
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

  function compactWhitespace(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function splitDraftSentences(text) {
    const normalized = compactWhitespace(text);
    if (!normalized) {
      return [];
    }
    const matches = normalized.match(/[^.!?。！？]+[.!?。！？]?/gu);
    return (matches || [normalized])
      .map((item) => compactWhitespace(item))
      .filter(Boolean);
  }

  function splitDraftClauses(sentence = "") {
    const normalized = compactWhitespace(sentence);
    if (!normalized) {
      return [];
    }
    return normalized
      .split(/[，,；;、]+|\s+-\s+/u)
      .map((item) => compactWhitespace(item).replace(/^[,;:，；：、\-\s]+|[,;:，；：、\-\s]+$/gu, ""))
      .filter(Boolean);
  }

  function normalizeRepetitionUnitKey(unit = "") {
    const normalized = compactWhitespace(
      String(unit || "")
        .replace(/^["'“”‘’]+|["'“”‘’]+$/gu, "")
        .replace(/^[,;:，；：、\-\s]+|[,;:，；：、\-\s]+$/gu, "")
        .replace(/[.!?。！？]+$/gu, "")
    );
    if (!normalized) {
      return "";
    }
    if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/u.test(normalized)) {
      return normalized.replace(/\s+/g, "");
    }
    return normalized.toLowerCase();
  }

  function isMeaningfulRepetitionUnit(unit = "") {
    const normalized = normalizeRepetitionUnitKey(unit);
    if (!normalized) {
      return false;
    }
    if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/u.test(normalized)) {
      return normalized.length >= 10;
    }
    return normalized.length >= 24 || normalized.split(/\s+/u).filter(Boolean).length >= 4;
  }

  function hasRepeatedMeaningfulUnit(units = []) {
    const seen = new Set();
    for (const unit of units) {
      if (!isMeaningfulRepetitionUnit(unit)) {
        continue;
      }
      const key = normalizeRepetitionUnitKey(unit);
      if (!key) {
        continue;
      }
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }
    return false;
  }

  function hasRepeatedSentence(text = "") {
    return hasRepeatedMeaningfulUnit(splitDraftSentences(text));
  }

  function hasRepeatedClause(text = "") {
    return splitDraftSentences(text).some((sentence) => hasRepeatedMeaningfulUnit(splitDraftClauses(sentence)));
  }

  function hasClauseOverloadZh(text = "") {
    return splitDraftSentences(text).some((sentence) => (
      /[\u4e00-\u9fff]/u.test(sentence) &&
      ((sentence.match(/[，,；;]/gu) || []).length >= 3)
    ));
  }

  function countEnglishWords(text = "") {
    return compactWhitespace(String(text || "").replace(/[.!?]+$/gu, ""))
      .split(/\s+/u)
      .filter(Boolean)
      .length;
  }

  function hasFiniteEnglishVerb(text = "") {
    const normalized = compactWhitespace(String(text || "").toLowerCase());
    if (!normalized) {
      return false;
    }
    if (/\b(?:i|you|we|they|he|she|it|that|this|there|who|what)'(?:s|re|ve|ll|d)\b/u.test(normalized)) {
      return true;
    }
    return /\b(?:am|is|are|was|were|be|been|being|do|does|did|have|has|had|can|could|will|would|should|may|might|must|need|needs|needed|seem|seems|seemed|feel|feels|felt|look|looks|looked|matter|matters|mattered|depend|depends|depended|keep|keeps|kept|show|shows|showed|become|becomes|became|remain|remains|remained|make|makes|made|work|works|worked|shift|shifts|shifted|create|creates|created|turn|turns|turned|mean|means|meant|stay|stays|stayed|carry|carries|carried|hold|holds|held|fail|fails|failed|anchor|anchors|anchored|get|gets|got|leave|leaves|left|help|helps|helped)\b/u.test(normalized);
  }

  function isShortEnglishTailFragment(sentence = "") {
    const normalized = compactWhitespace(String(sentence || "").replace(/[.!?]+$/gu, ""));
    if (!normalized) {
      return false;
    }
    if (countEnglishWords(normalized) > 5 || /[,;:]/.test(normalized) || hasFiniteEnglishVerb(normalized)) {
      return false;
    }
    return /^(?:for(?:\s+(?:many|some|most|now|me|us|them))?|if\s+anything|especially(?:\s+now)?|at\s+least|in\s+(?:practice|theory|part|general|particular|short)|on\s+(?:paper|balance)|under\s+pressure|without\s+warning|beyond\s+that|even\s+then|maybe|perhaps|still)\b/i.test(normalized);
  }

  function isOpenEndedEnglishContrast(sentence = "") {
    const normalized = compactWhitespace(String(sentence || "").replace(/[.!?]+$/gu, ""));
    if (!normalized) {
      return false;
    }
    if (
      countEnglishWords(normalized) > 14 ||
      !/^(?:but|yet|and|so)\b/i.test(normalized) ||
      !hasFiniteEnglishVerb(normalized)
    ) {
      return false;
    }
    return /\b(?:not because(?:\s+of)?|not due to|rather than|instead of)\b/i.test(normalized);
  }

  function isSubordinateComparisonFragment(sentence = "") {
    const normalized = compactWhitespace(String(sentence || "").replace(/[.!?]+$/gu, ""));
    if (!normalized) {
      return false;
    }
    if (
      countEnglishWords(normalized) > 20 ||
      /[,;:]/.test(normalized) ||
      !/^(?:if|when|while|because|although|though|unless|until|once|since|whereas|whether|as)\b/i.test(normalized)
    ) {
      return false;
    }
    return /\b(?:instead of|rather than)\b/i.test(normalized);
  }

  function isLeadingEnglishClauseFragment(sentence = "") {
    const normalized = compactWhitespace(String(sentence || "").replace(/[.!?]+$/gu, ""));
    if (!normalized) {
      return false;
    }
    if (
      countEnglishWords(normalized) > 12 ||
      /[,;:]/.test(normalized) ||
      !/^(?:but|yet|and|so)\b/i.test(normalized) ||
      hasFiniteEnglishVerb(normalized)
    ) {
      return false;
    }
    return /^(?:but|yet|and|so)\s+(?:to\b|\w+ing\b|\w+ed\b|\w+en\b|\w+ly\b|\w+\b)/i.test(normalized);
  }

  function isVerbLessEnglishFragment(sentence = "") {
    const normalized = compactWhitespace(String(sentence || "").replace(/[.!?]+$/gu, ""));
    if (!normalized) {
      return false;
    }
    if (
      countEnglishWords(normalized) > 10 ||
      /[,;:]/.test(normalized) ||
      hasFiniteEnglishVerb(normalized)
    ) {
      return false;
    }
    return /^(?:the|a|an|this|that|these|those|my|your|our|their|his|her|its|[a-z]+ing)\b/i.test(normalized);
  }

  function hasBrokenEnglishSentence(text = "") {
    const sentences = splitDraftSentences(text).filter((sentence) => /[A-Za-z]/.test(sentence));
    const tailFragmentIndex = sentences.findIndex((sentence, index) => index > 0 && isShortEnglishTailFragment(sentence));
    if (tailFragmentIndex >= 0) {
      return true;
    }
    return sentences.some((sentence) => {
      const normalized = compactWhitespace(String(sentence || "").replace(/[.!?]+$/gu, ""));
      if (!normalized) {
        return false;
      }
      if (/^(?:however|but|and|so|because|although|though|unless|until|meanwhile|still|yet|therefore|moreover|besides)$/i.test(normalized)) {
        return true;
      }
      if (isLeadingEnglishClauseFragment(normalized)) {
        return true;
      }
      if (isVerbLessEnglishFragment(normalized)) {
        return true;
      }
      if (
        /^(?:(?:but|and|yet|so)\s+)?(?:if|when|while|because|although|though|unless|until|once|since|whereas|whether|as)\b/i.test(normalized) &&
        !/[,;:]/.test(normalized) &&
        countEnglishWords(normalized) <= 14
      ) {
        return true;
      }
      if (
        /^(?:at|by|from|in|inside|near|on|over|under|with|without|within|across|through|after|before|during|around|beyond|outside)\b/i.test(normalized) &&
        !/[,;:]/.test(normalized) &&
        !hasFiniteEnglishVerb(normalized) &&
        countEnglishWords(normalized) <= 8
      ) {
        return true;
      }
      if (/\b(?:core question|real transformation)\s+isn'?t\b/i.test(normalized)) {
        return true;
      }
      if (isSubordinateComparisonFragment(normalized)) {
        return true;
      }
      if (isOpenEndedEnglishContrast(normalized)) {
        return true;
      }
      return false;
    });
  }

  function hasBrokenKoreanSentence(text = "") {
    return splitDraftSentences(text)
      .filter((sentence) => /[\uac00-\ud7af]/u.test(sentence))
      .some((sentence) => /지만(?:[.!?。！？…"'”’)\]]*)$/u.test(compactWhitespace(sentence)));
  }

  function detectStylePatternHits(text = "") {
    const normalized = compactWhitespace(text);
    if (!normalized) {
      return [];
    }
    const hits = DRAFT_STYLE_PATTERNS
      .filter((pattern) => pattern.regex.test(normalized))
      .map((pattern) => pattern.key);
    if (hasRepeatedSentence(normalized)) {
      hits.push("repeated-sentence");
    }
    if (hasRepeatedClause(normalized)) {
      hits.push("repeated-clause");
    }
    if (hasClauseOverloadZh(normalized)) {
      hits.push("clause-overload-zh");
    }
    if (hasBrokenEnglishSentence(normalized)) {
      hits.push("broken-fragment-en");
    }
    if (hasBrokenKoreanSentence(normalized)) {
      hits.push("broken-fragment-ko");
    }
    return uniqueStringList(hits);
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
    detectStylePatternHits,
    hasStrongAttributionMemory,
    hasValidatedPickupMemory
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.ReplyDropDraftCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
