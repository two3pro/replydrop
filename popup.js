const LANGUAGE_BOOSTS = [
  { key: "langZh", bonus: 4, label: { "zh-Hans": "中文 +4", "zh-Hant": "中文 +4", en: "Chinese +4", ja: "中国語 +4", ko: "중국어 +4" } },
  { key: "langEn", bonus: 2, label: { "zh-Hans": "英文 +2", "zh-Hant": "英文 +2", en: "English +2", ja: "英語 +2", ko: "영어 +2" } },
  { key: "langJa", bonus: 5, label: { "zh-Hans": "日文 +5", "zh-Hant": "日文 +5", en: "Japanese +5", ja: "日本語 +5", ko: "일본어 +5" } },
  { key: "langKo", bonus: 5, label: { "zh-Hans": "韩文 +5", "zh-Hant": "韓文 +5", en: "Korean +5", ja: "韓国語 +5", ko: "한국어 +5" } },
  { key: "langFr", bonus: 3, label: { "zh-Hans": "法文 +3", "zh-Hant": "法文 +3", en: "French +3", ja: "フランス語 +3", ko: "프랑스어 +3" } },
  { key: "langEs", bonus: 3, label: { "zh-Hans": "西文 +3", "zh-Hant": "西文 +3", en: "Spanish +3", ja: "スペイン語 +3", ko: "스페인어 +3" } },
  { key: "langDe", bonus: 3, label: { "zh-Hans": "德文 +3", "zh-Hant": "德文 +3", en: "German +3", ja: "ドイツ語 +3", ko: "독일어 +3" } },
  { key: "langIt", bonus: 3, label: { "zh-Hans": "意文 +3", "zh-Hant": "意文 +3", en: "Italian +3", ja: "イタリア語 +3", ko: "이탈리아어 +3" } },
  { key: "langPt", bonus: 3, label: { "zh-Hans": "葡文 +3", "zh-Hant": "葡文 +3", en: "Portuguese +3", ja: "ポルトガル語 +3", ko: "포르투갈어 +3" } },
  { key: "langRu", bonus: 4, label: { "zh-Hans": "俄文 +4", "zh-Hant": "俄文 +4", en: "Russian +4", ja: "ロシア語 +4", ko: "러시아어 +4" } },
  { key: "langAr", bonus: 4, label: { "zh-Hans": "阿拉伯文 +4", "zh-Hant": "阿拉伯文 +4", en: "Arabic +4", ja: "アラビア語 +4", ko: "아랍어 +4" } }
];

const TOPIC_GROUPS = [
  { key: "ai", enabledKey: "aiEnabled", keywordsKey: "aiKeywords", title: { "zh-Hans": "AI 关键词", "zh-Hant": "AI 關鍵詞", en: "AI keywords", ja: "AI キーワード", ko: "AI 키워드" }, toggle: { "zh-Hans": "AI 关键词 +10", "zh-Hant": "AI 關鍵詞 +10", en: "AI keywords +10", ja: "AI キーワード +10", ko: "AI 키워드 +10" }, defaults: ["ai", "chatgpt", "claude", "gemini", "seedance", "即梦", "生成ai", "llm", "agi", "copilot", "grok", "perplexity"] },
  { key: "crypto", enabledKey: "cryptoEnabled", keywordsKey: "cryptoKeywords", title: { "zh-Hans": "Crypto 关键词", "zh-Hant": "Crypto 關鍵詞", en: "Crypto keywords", ja: "Crypto キーワード", ko: "Crypto 키워드" }, toggle: { "zh-Hans": "Crypto 关键词 +10", "zh-Hant": "Crypto 關鍵詞 +10", en: "Crypto keywords +10", ja: "Crypto キーワード +10", ko: "Crypto 키워드 +10" }, defaults: ["crypto", "bitcoin", "btc", "eth", "bnb", "defi", "nft", "web3", "blockchain", "altcoin", "memecoin", "on-chain"] },
  { key: "model", enabledKey: "modelEnabled", keywordsKey: "modelKeywords", title: { "zh-Hans": "模型关键词", "zh-Hant": "模型關鍵詞", en: "Model keywords", ja: "モデルキーワード", ko: "모델 키워드" }, toggle: { "zh-Hans": "模型关键词 +5", "zh-Hant": "模型關鍵詞 +5", en: "Model keywords +5", ja: "モデルキーワード +5", ko: "모델 키워드 +5" }, defaults: ["gpt-4", "gpt-5", "o3", "o4", "claude 3", "claude 4", "gemini", "llama", "mistral", "qwen", "deepseek", "grok", "flux", "midjourney", "sora", "kling", "wan", "hunyuanvideo", "seedance"] },
  { key: "creator", enabledKey: "creatorEnabled", keywordsKey: "creatorKeywords", title: { "zh-Hans": "创作者关键词", "zh-Hant": "創作者關鍵詞", en: "Creator keywords", ja: "クリエイター系キーワード", ko: "크리에이터 키워드" }, toggle: { "zh-Hans": "创作者话题 +7", "zh-Hant": "創作者話題 +7", en: "Creator topics +7", ja: "クリエイター話題 +7", ko: "크리에이터 주제 +7" }, defaults: ["creator", "youtube", "youtuber", "streamer", "streaming", "shorts", "reels", "tiktok", "viral", "audience", "subscriber", "monetization", "ugc", "content strategy"] },
  { key: "gaming", enabledKey: "gamingEnabled", keywordsKey: "gamingKeywords", title: { "zh-Hans": "游戏关键词", "zh-Hant": "遊戲關鍵詞", en: "Gaming keywords", ja: "ゲーム系キーワード", ko: "게임 키워드" }, toggle: { "zh-Hans": "游戏话题 +6", "zh-Hant": "遊戲話題 +6", en: "Gaming topics +6", ja: "ゲーム話題 +6", ko: "게임 주제 +6" }, defaults: ["game", "gaming", "gamer", "steam", "nintendo", "playstation", "xbox", "switch 2", "esports", "speedrun", "gacha", "minecraft", "roblox", "hoyoverse", "gta"] },
  { key: "business", enabledKey: "businessEnabled", keywordsKey: "businessKeywords", title: { "zh-Hans": "商业关键词", "zh-Hant": "商業關鍵詞", en: "Business keywords", ja: "ビジネス系キーワード", ko: "비즈니스 키워드" }, toggle: { "zh-Hans": "商业话题 +7", "zh-Hant": "商業話題 +7", en: "Business topics +7", ja: "ビジネス話題 +7", ko: "비즈니스 주제 +7" }, defaults: ["startup", "founder", "saas", "growth", "revenue", "profit", "fundraising", "vc", "product market fit", "ecommerce", "marketing", "earnings"] },
  { key: "finance", enabledKey: "financeEnabled", keywordsKey: "financeKeywords", title: { "zh-Hans": "金融关键词", "zh-Hant": "金融關鍵詞", en: "Finance keywords", ja: "金融系キーワード", ko: "금융 키워드" }, toggle: { "zh-Hans": "金融话题 +6", "zh-Hant": "金融話題 +6", en: "Finance topics +6", ja: "金融話題 +6", ko: "금융 주제 +6" }, defaults: ["stocks", "nasdaq", "s&p 500", "dow jones", "treasury", "fed", "ipo", "market cap", "bond", "inflation", "rate cut", "yield"] },
  { key: "politics", enabledKey: "politicsEnabled", keywordsKey: "politicsKeywords", title: { "zh-Hans": "政治关键词", "zh-Hant": "政治關鍵詞", en: "Politics keywords", ja: "政治系キーワード", ko: "정치 키워드" }, toggle: { "zh-Hans": "政治话题 +6", "zh-Hant": "政治話題 +6", en: "Politics topics +6", ja: "政治話題 +6", ko: "정치 주제 +6" }, defaults: ["election", "vote", "congress", "senate", "white house", "president", "policy", "parliament", "campaign", "tariff", "cabinet", "diplomacy"] },
  { key: "sports", enabledKey: "sportsEnabled", keywordsKey: "sportsKeywords", title: { "zh-Hans": "体育关键词", "zh-Hant": "體育關鍵詞", en: "Sports keywords", ja: "スポーツ系キーワード", ko: "스포츠 키워드" }, toggle: { "zh-Hans": "体育话题 +6", "zh-Hant": "體育話題 +6", en: "Sports topics +6", ja: "スポーツ話題 +6", ko: "스포츠 주제 +6" }, defaults: ["nba", "nfl", "mlb", "f1", "ufc", "olympics", "football", "soccer", "tennis", "goal", "championship", "playoffs"] },
  { key: "entertainment", enabledKey: "entertainmentEnabled", keywordsKey: "entertainmentKeywords", title: { "zh-Hans": "娱乐关键词", "zh-Hant": "娛樂關鍵詞", en: "Entertainment keywords", ja: "エンタメ系キーワード", ko: "엔터 키워드" }, toggle: { "zh-Hans": "娱乐话题 +5", "zh-Hant": "娛樂話題 +5", en: "Entertainment topics +5", ja: "エンタメ話題 +5", ko: "엔터 주제 +5" }, defaults: ["celebrity", "idol", "concert", "music", "album", "drama", "variety show", "tour", "fandom", "trailer", "box office", "tv series"] },
  { key: "film", enabledKey: "filmEnabled", keywordsKey: "filmKeywords", title: { "zh-Hans": "电影关键词", "zh-Hant": "電影關鍵詞", en: "Film keywords", ja: "映画系キーワード", ko: "영화 키워드" }, toggle: { "zh-Hans": "电影话题 +5", "zh-Hant": "電影話題 +5", en: "Film topics +5", ja: "映画話題 +5", ko: "영화 주제 +5" }, defaults: ["movie", "cinema", "director", "screenplay", "scene", "letterboxd", "criterion", "festival", "documentary", "actor", "actress", "shot"] },
  { key: "fashion", enabledKey: "fashionEnabled", keywordsKey: "fashionKeywords", title: { "zh-Hans": "时尚关键词", "zh-Hant": "時尚關鍵詞", en: "Fashion keywords", ja: "ファッション系キーワード", ko: "패션 키워드" }, toggle: { "zh-Hans": "时尚话题 +5", "zh-Hant": "時尚話題 +5", en: "Fashion topics +5", ja: "ファッション話題 +5", ko: "패션 주제 +5" }, defaults: ["fashion", "runway", "lookbook", "outfit", "designer", "vogue", "styling", "streetwear", "beauty", "makeup", "skincare", "luxury"] },
  { key: "travel", enabledKey: "travelEnabled", keywordsKey: "travelKeywords", title: { "zh-Hans": "旅行关键词", "zh-Hant": "旅行關鍵詞", en: "Travel keywords", ja: "旅行系キーワード", ko: "여행 키워드" }, toggle: { "zh-Hans": "旅行话题 +5", "zh-Hant": "旅行話題 +5", en: "Travel topics +5", ja: "旅行話題 +5", ko: "여행 주제 +5" }, defaults: ["travel", "trip", "flight", "hotel", "itinerary", "beach", "mountain", "resort", "tourism", "citywalk", "backpacking", "destination"] },
  { key: "books", enabledKey: "booksEnabled", keywordsKey: "booksKeywords", title: { "zh-Hans": "书籍关键词", "zh-Hant": "書籍關鍵詞", en: "Books keywords", ja: "本系キーワード", ko: "책 키워드" }, toggle: { "zh-Hans": "书籍话题 +5", "zh-Hant": "書籍話題 +5", en: "Books topics +5", ja: "本話題 +5", ko: "책 주제 +5" }, defaults: ["book", "novel", "poem", "essay", "literature", "author", "reading", "bookstore", "quote", "translation", "fiction", "memoir"] }
];

const PRIMARY_LANGUAGE_KEYS = new Set(["langZh", "langEn", "langJa", "langKo"]);
const PRIMARY_TOPIC_KEYS = new Set(["ai", "crypto", "model", "creator", "gaming", "business"]);
const PRIORITY_CANDIDATE_LIMIT = 6;
const CANDIDATE_PREVIEW_LIMIT = 6;
const REPLY_ARCHIVE_PAGE_SIZE = 12;

const TEXTS = {
  "zh-Hans": {
    pageTitle: "ReplyDrop：找到值得回复的帖子",
    tabs: { desk: "工作台", overview: "概览", signals: "加成", keywords: "关键词" },
    heroModePill: "X 回复雷达",
    chineseToggleLabel: "简/繁",
    controlDeckTitle: "快捷操作",
    refreshStatusLabel: "刷新状态",
    openXLabel: "打开 X",
    openOptionsLabel: "完整设置页",
    controlDeckHint: "先确认当前标签页是否在 x.com，再直接打开页内面板；真正操作都在 X 页内完成。",
    currentPageLabel: "当前页面",
    currentPageChecking: "检测中…",
    currentPageOnX: "当前标签已在 X，可直接去点右上悬浮水滴",
    currentPageOffX: "当前标签不是 X；点“打开 X”可直接过去",
    currentPageUnknown: "暂时拿不到当前标签信息",
    openPanelLabel: "打开页内面板",
    entryStatusLabel: "页内入口",
    entryStatusChecking: "检测中…",
    entryStatusReady: "已就绪，可直接打开",
    entryStatusOpen: "页内面板已展开",
    entryStatusHidden: "已注入，等待打开",
    entryStatusUnavailable: "当前页未注入入口",
    entryStatusNotOnX: "请先打开 x.com",
    lastSyncLabel: "最近同步",
    lastSyncNow: "刚刚",
    uiLanguageTitle: "界面语言",
    posterTitle: "顶部图片",
    posterUploadLabel: "上传本地海报",
    posterClearLabel: "恢复默认",
    posterUrlLabel: "海报图片地址",
    posterUrlHint: "支持本地上传或图片直链，留空则使用默认海报。",
    heroSummary: "先选语种，再开开关；真正执行都在 X 右上角水滴里。",
    heroDeskSummary: "先选语种，再开总开关；真正操作都在 X 页面右上角悬浮水滴里完成。",
    heroOverviewSummary: "这里控制阈值、展示方式和基础状态；真正操作仍在 X 页面右上角悬浮水滴里完成。",
    heroSignalsSummary: "这里决定哪些语言和主题会被额外加分；真正操作仍在 X 页面右上角悬浮水滴里完成。",
    heroKeywordsSummary: "这里管理预设词和自定义词，直接影响候选命中；真正操作仍在 X 页面右上角悬浮水滴里完成。",
    deskSectionFocus: "收件箱",
    deskSectionDraft: "规则稿",
    deskSectionGrowth: "看板",
    deskSectionQueue: "队列",
    deskSectionContacts: "关系",
    deskSectionFeedback: "反馈",
    enabledSwitchTitle: "第一步：开启 ReplyDrop",
    switchHintText: "控制页内水滴、打分和候选提示；点整行就能切换。",
    entryHintTitle: "第二步：去 X 页面右上角打开悬浮水滴",
    entryHintText: "打开 x.com 后点右上角悬浮水滴，就能直接进入页内仪表盘看候选和回复机会。",
    deskFocusTitle: "下一条建议",
    draftDeskTitle: "规则草稿台",
    draftDeskMeta: "给人工 / 开源 fallback 留一层规则稿，不再把它当成 AI 最终回复。",
    growthPulseTitle: "Growth Dashboard",
    growthPulseMeta: "先看已发回复的表现，再决定下一步。",
    relationshipDeskTitle: "互动脉络",
    relationshipDeskMeta: "轻量 CRM：最近回复过谁、谁又重新出现在候选里。",
    deskBoostTitle: "当前生效加成",
    scoreGuideTitle: "评分说明",
    candidateDeskTitle: "候选收件箱",
    replyFeedbackTitle: "今日回复记录",
    restoreDismissedLabel: "恢复略过",
    focusEmptyTitle: "候选收件箱还是空的",
    focusEmptyText: "去 X 页面继续滚动，或直接打开页内面板看实时候选。",
    openPostLabel: "打开原帖",
    copyLinkLabel: "复制链接",
    ignoreCandidateLabel: "略过",
    linkCopiedStatus: "已复制候选链接",
    candidateDismissedStatus: "已从候选收件箱略过",
    dismissedRestoredStatus: "已恢复略过候选",
    metricViewsLabel: "浏览",
    metricRepliesLabel: "回复",
    metricLikesLabel: "点赞",
    queueNowLabel: "优先回复",
    queueWatchLabel: "继续跟进",
    queueCrowdedLabel: "线程拥挤",
    queueBacklogLabel: "候补观察",
    queueSkippedLabel: "已略过",
    draftAnglePerspective: "观点切入",
    draftAngleQuestion: "提问切入",
    draftAngleMemory: "记忆延续",
    draftAngleContrarian: "轻反差切入",
    draftAngleBridge: "延展补充",
    copyDraftLabel: "复制草稿",
    draftCopiedStatus: "已复制回复草稿",
    draftEmptyTitle: "先出现候选，规则草稿台才会亮起来",
    draftEmptyText: "这里保留 3 条规则 fallback，主要给人工或无模型场景兜底。",
    growthRepliesSentLabel: "今日已回",
    growthInboxLabel: "候选库存",
    growthHotLabel: "热窗机会",
    growthCoverageLabel: "覆盖率",
    growthLiftLabel: "预计增长势能",
    relationshipReengaged: "重新进入候选",
    relationshipDormant: "暂时安静",
    relationshipActive: "刚回复过",
    relationshipEmpty: "还没有可显示的互动对象。",
    scoreGuideMomentum: "互动与传播",
    scoreGuideTiming: "时效",
    scoreGuideQuality: "讨论密度",
    scoreGuideAccount: "账号信号",
    scoreGuideMedia: "媒体",
    scoreGuideLanguage: "语言",
    scoreGuideTopic: "主题",
    scoreGuideCrowding: "拥挤惩罚",
    scoreGuideGuide1: "绿色/黄色水滴会优先展示，虚线水滴代表有信号但还不够强。",
    scoreGuideGuide2: "超热门大号或回复过于拥挤的帖子会被主动降分，避免你回了也被淹没。",
    scoreGuideGuide3: "角标悬停时会直接显示这条推文的加分和降分来源。",
    enabledSection: "已生效",
    disabledSection: "未生效",
    groupOn: "生效中",
    groupOff: "未生效",
    standbyHint: "已保存，但当前主题未启用",
    noCandidates: "还没抓到可展示的候选帖。",
    noReplies: "今天还没有记录到回复反馈。",
    scannedLabel: "已扫描帖子数",
    visibleLabel: "可见候选数",
    highScoreLabel: "高分帖子数",
    todayRepliedLabel: "今日已回复",
    thresholdLabel: "显示阈值",
    onlyKeywordHitsText: "只显示命中关键词或语言加成的帖子",
    overviewNote: "当前已支持：实时打分、广告过滤、自己的帖子过滤、回复后打 √、右上页内水滴面板、关键词加成和阈值控制。",
    languageBoostTitle: "语言加成",
    topicBoostTitle: "主题加成",
    moreLanguages: "更多语言",
    moreTopics: "更多主题",
    presetKeywordsLabel: "预置关键词",
    customKeywordsLabel: "自定义补充",
    customHint: "支持逗号或换行，不必每个词单独一行。",
    statusOn: "已开启",
    statusOff: "已关闭",
    statusError: "同步失败"
  },
  "zh-Hant": {
    pageTitle: "ReplyDrop：找到值得回覆的貼文",
    tabs: { desk: "工作台", overview: "概覽", signals: "加成", keywords: "關鍵詞" },
    heroModePill: "X 回覆雷達",
    chineseToggleLabel: "簡/繁",
    controlDeckTitle: "快捷操作",
    refreshStatusLabel: "刷新狀態",
    openXLabel: "打開 X",
    openOptionsLabel: "完整設定頁",
    controlDeckHint: "先確認目前分頁是否在 x.com，再直接打開頁內面板；真正操作都在 X 頁內完成。",
    currentPageLabel: "目前頁面",
    currentPageChecking: "檢測中…",
    currentPageOnX: "目前分頁已在 X，可直接點右上懸浮水滴",
    currentPageOffX: "目前分頁不是 X；點「打開 X」可直接過去",
    currentPageUnknown: "暫時拿不到目前分頁資訊",
    openPanelLabel: "打開頁內面板",
    entryStatusLabel: "頁內入口",
    entryStatusChecking: "檢測中…",
    entryStatusReady: "已就緒，可直接打開",
    entryStatusOpen: "頁內面板已展開",
    entryStatusHidden: "已注入，等待打開",
    entryStatusUnavailable: "目前頁面尚未注入入口",
    entryStatusNotOnX: "請先打開 x.com",
    lastSyncLabel: "最近同步",
    lastSyncNow: "剛剛",
    uiLanguageTitle: "介面語言",
    posterTitle: "頂部圖片",
    posterUploadLabel: "上傳本地海報",
    posterClearLabel: "恢復預設",
    posterUrlLabel: "海報圖片地址",
    posterUrlHint: "支援本地上傳或圖片直鏈，留空則使用預設海報。",
    heroSummary: "先選語種，再開開關；真正執行都在 X 右上角水滴裡。",
    heroDeskSummary: "先選語種，再開總開關；真正操作都在 X 頁面右上角懸浮水滴裡完成。",
    heroOverviewSummary: "這裡控制門檻、顯示方式與基礎狀態；真正操作仍在 X 頁面右上角懸浮水滴裡完成。",
    heroSignalsSummary: "這裡決定哪些語言與主題會被額外加分；真正操作仍在 X 頁面右上角懸浮水滴裡完成。",
    heroKeywordsSummary: "這裡管理預置詞與自訂詞，直接影響候選命中；真正操作仍在 X 頁面右上角懸浮水滴裡完成。",
    deskSectionFocus: "收件箱",
    deskSectionDraft: "規則稿",
    deskSectionGrowth: "看板",
    deskSectionQueue: "隊列",
    deskSectionContacts: "關係",
    deskSectionFeedback: "回饋",
    enabledSwitchTitle: "ReplyDrop 總開關",
    switchHintText: "控制頁內水滴、打分和候選提示；點整行就能切換。",
    entryHintTitle: "第二步：去 X 頁面右上角打開懸浮水滴",
    entryHintText: "打開 x.com 後點右上角懸浮水滴，就能直接進入頁內儀表盤看候選貼與回覆機會。",
    deskFocusTitle: "下一條建議",
    draftDeskTitle: "規則草稿台",
    draftDeskMeta: "給人工 / 開源 fallback 留一層規則稿，不再把它當成 AI 最終回覆。",
    growthPulseTitle: "Growth Dashboard",
    growthPulseMeta: "先看已發回覆的表現，再決定下一步。",
    relationshipDeskTitle: "互動脈絡",
    relationshipDeskMeta: "輕量 CRM：最近回覆過誰、誰又重新出現在候選裡。",
    deskBoostTitle: "目前生效加成",
    scoreGuideTitle: "評分說明",
    candidateDeskTitle: "候選收件箱",
    replyFeedbackTitle: "今日回覆記錄",
    restoreDismissedLabel: "恢復略過",
    focusEmptyTitle: "候選收件箱還是空的",
    focusEmptyText: "去 X 頁面繼續滑動，或直接打開頁內面板看即時候選。",
    openPostLabel: "打開原貼",
    copyLinkLabel: "複製連結",
    ignoreCandidateLabel: "略過",
    linkCopiedStatus: "已複製候選連結",
    candidateDismissedStatus: "已從候選收件箱略過",
    dismissedRestoredStatus: "已恢復略過候選",
    metricViewsLabel: "瀏覽",
    metricRepliesLabel: "回覆",
    metricLikesLabel: "按讚",
    queueNowLabel: "優先回覆",
    queueWatchLabel: "繼續跟進",
    queueCrowdedLabel: "線程擁擠",
    queueBacklogLabel: "候補觀察",
    queueSkippedLabel: "已略過",
    draftAnglePerspective: "觀點切入",
    draftAngleQuestion: "提問切入",
    draftAngleMemory: "記憶延續",
    draftAngleContrarian: "輕反差切入",
    draftAngleBridge: "延展補充",
    copyDraftLabel: "複製草稿",
    draftCopiedStatus: "已複製回覆草稿",
    draftEmptyTitle: "先出現候選，規則草稿台才會亮起來",
    draftEmptyText: "這裡保留 3 條規則 fallback，主要給人工或無模型場景兜底。",
    growthRepliesSentLabel: "今日已回",
    growthInboxLabel: "候選庫存",
    growthHotLabel: "熱窗機會",
    growthCoverageLabel: "覆蓋率",
    growthLiftLabel: "預估增長勢能",
    relationshipReengaged: "重新進入候選",
    relationshipDormant: "暫時安靜",
    relationshipActive: "剛回覆過",
    relationshipEmpty: "還沒有可顯示的互動對象。",
    scoreGuideMomentum: "互動與傳播",
    scoreGuideTiming: "時效",
    scoreGuideQuality: "討論密度",
    scoreGuideAccount: "帳號訊號",
    scoreGuideMedia: "媒體",
    scoreGuideLanguage: "語言",
    scoreGuideTopic: "主題",
    scoreGuideCrowding: "擁擠懲罰",
    scoreGuideGuide1: "綠色/黃色水滴會優先顯示，虛線水滴代表有訊號但還不夠強。",
    scoreGuideGuide2: "超熱門大號或回覆過度擁擠的貼文會被主動降分，避免你回了也被淹沒。",
    scoreGuideGuide3: "滑過角標時，會直接顯示這條貼文的加分與降分來源。",
    enabledSection: "已生效",
    disabledSection: "未生效",
    groupOn: "生效中",
    groupOff: "未生效",
    standbyHint: "已保存，但目前主題未啟用",
    noCandidates: "還沒抓到可展示的候選貼。",
    noReplies: "今天還沒有記錄到回覆回饋。",
    scannedLabel: "已掃描貼文數",
    visibleLabel: "可見候選數",
    highScoreLabel: "高分貼文數",
    todayRepliedLabel: "今日已回覆",
    thresholdLabel: "顯示門檻",
    onlyKeywordHitsText: "只顯示命中關鍵詞或語言加成的貼文",
    overviewNote: "目前已支援：即時打分、廣告過濾、自己的貼文過濾、回覆後打 √、右上頁內水滴面板、關鍵詞加成與門檻控制。",
    languageBoostTitle: "語言加成",
    topicBoostTitle: "主題加成",
    moreLanguages: "更多語言",
    moreTopics: "更多主題",
    presetKeywordsLabel: "預置關鍵詞",
    customKeywordsLabel: "自訂補充",
    customHint: "支援逗號或換行，不必每個詞各佔一行。",
    statusOn: "已開啟",
    statusOff: "已關閉",
    statusError: "同步失敗"
  },
  en: {
    pageTitle: "ReplyDrop: find reply-worthy posts",
    tabs: { desk: "Desk", overview: "Overview", signals: "Signals", keywords: "Keywords" },
    heroModePill: "X reply radar",
    chineseToggleLabel: "汉/繁",
    controlDeckTitle: "Quick actions",
    refreshStatusLabel: "Refresh status",
    openXLabel: "Open X",
    openOptionsLabel: "Full settings",
    controlDeckHint: "Check that the active tab is on x.com, then open the in-page panel directly. The real workflow happens inside X.",
    currentPageLabel: "Current page",
    currentPageChecking: "Checking…",
    currentPageOnX: "The active tab is already on X. Use the floating droplet at the top-right.",
    currentPageOffX: "The active tab is not on X. Use “Open X” to jump there.",
    currentPageUnknown: "Current tab info is temporarily unavailable.",
    openPanelLabel: "Open in-page panel",
    entryStatusLabel: "In-page entry",
    entryStatusChecking: "Checking…",
    entryStatusReady: "Ready — open it on X",
    entryStatusOpen: "In-page panel is open",
    entryStatusHidden: "Injected — waiting to be opened",
    entryStatusUnavailable: "Entry not injected on this tab",
    entryStatusNotOnX: "Open x.com first",
    lastSyncLabel: "Last sync",
    lastSyncNow: "just now",
    uiLanguageTitle: "UI language",
    posterTitle: "Header image",
    posterUploadLabel: "Upload poster",
    posterClearLabel: "Reset default",
    posterUrlLabel: "Poster image URL",
    posterUrlHint: "Upload a local image or paste a direct image URL. Leave blank to use the default poster.",
    heroSummary: "Pick a language, turn ReplyDrop on, then work from the floating droplet on X.",
    deskSectionFocus: "Inbox",
    deskSectionDraft: "Rules",
    deskSectionGrowth: "Dashboard",
    deskSectionQueue: "Queue",
    deskSectionContacts: "Contacts",
    deskSectionFeedback: "Feedback",
    heroDeskSummary: "Review candidates and reply feedback first; the real entry is the floating droplet at the top-right of X.",
    heroOverviewSummary: "Control threshold, visibility, and base settings here; the real entry remains the floating droplet at the top-right of X.",
    heroSignalsSummary: "Choose which languages and topics receive boosts here; the real entry remains the floating droplet at the top-right of X.",
    heroKeywordsSummary: "Manage preset and custom keywords here; the real entry remains the floating droplet at the top-right of X.",
    enabledSwitchTitle: "Step 1: turn on ReplyDrop",
    switchHintText: "Controls the in-page droplet, scoring, and candidate hints. Click the full row to toggle.",
    entryHintTitle: "Step 2: open the floating droplet at the top-right of X",
    entryHintText: "Open x.com and click the top-right droplet to jump straight into the in-page dashboard.",
    deskFocusTitle: "Next move",
    draftDeskTitle: "Rule draft desk",
    draftDeskMeta: "Keep rule-based fallback drafts for humans or open-source mode instead of pretending they are the final AI reply.",
    growthPulseTitle: "Growth Dashboard",
    growthPulseMeta: "Start with shipped reply performance, then decide the next move.",
    relationshipDeskTitle: "Relationship pulse",
    relationshipDeskMeta: "CRM-lite: who you replied to recently, and who is back in the inbox.",
    deskBoostTitle: "Active boosts",
    scoreGuideTitle: "Score guide",
    candidateDeskTitle: "Reply inbox",
    replyFeedbackTitle: "Replies today",
    restoreDismissedLabel: "Restore skipped",
    focusEmptyTitle: "The inbox is still empty",
    focusEmptyText: "Scroll a little more on X, or open the in-page panel to watch live candidates.",
    openPostLabel: "Open post",
    copyLinkLabel: "Copy link",
    ignoreCandidateLabel: "Skip",
    linkCopiedStatus: "Candidate link copied",
    candidateDismissedStatus: "Candidate skipped from the inbox",
    dismissedRestoredStatus: "Skipped candidates restored",
    metricViewsLabel: "Views",
    metricRepliesLabel: "Replies",
    metricLikesLabel: "Likes",
    queueNowLabel: "Reply now",
    queueWatchLabel: "Keep watch",
    queueCrowdedLabel: "Crowded",
    queueBacklogLabel: "Backlog",
    queueSkippedLabel: "Skipped",
    draftAnglePerspective: "Perspective",
    draftAngleQuestion: "Question",
    draftAngleMemory: "Memory follow-through",
    draftAngleContrarian: "Constructive contrast",
    draftAngleBridge: "Bridge-on insight",
    copyDraftLabel: "Copy draft",
    draftCopiedStatus: "Reply draft copied",
    draftEmptyTitle: "The rule draft desk wakes up after candidates appear",
    draftEmptyText: "This keeps three rule-based fallback drafts for human use or no-model scenarios.",
    growthRepliesSentLabel: "Replies today",
    growthInboxLabel: "Inbox stock",
    growthHotLabel: "Hot-window ops",
    growthCoverageLabel: "Coverage",
    growthLiftLabel: "Estimated growth lift",
    relationshipReengaged: "Back in inbox",
    relationshipDormant: "Quiet now",
    relationshipActive: "Recently replied",
    relationshipEmpty: "No relationship signals to show yet.",
    scoreGuideMomentum: "Momentum",
    scoreGuideTiming: "Freshness",
    scoreGuideQuality: "Discussion density",
    scoreGuideAccount: "Account signal",
    scoreGuideMedia: "Media",
    scoreGuideLanguage: "Language",
    scoreGuideTopic: "Topic",
    scoreGuideCrowding: "Crowding penalty",
    scoreGuideGuide1: "Green and yellow drops surface first. Dashed drops mean there is signal, but not enough yet.",
    scoreGuideGuide2: "Overcrowded celebrity-sized threads are intentionally downranked so your reply does not get buried.",
    scoreGuideGuide3: "Hover a badge to see both the boosts and the penalties behind that score.",
    enabledSection: "Active",
    disabledSection: "Inactive",
    groupOn: "Live",
    groupOff: "Off",
    standbyHint: "Saved, but this topic is not enabled right now",
    noCandidates: "No candidate posts captured yet.",
    noReplies: "No reply feedback recorded today.",
    scannedLabel: "Scanned posts",
    visibleLabel: "Visible candidates",
    highScoreLabel: "High-score posts",
    todayRepliedLabel: "Replied today",
    thresholdLabel: "Display threshold",
    onlyKeywordHitsText: "Only show posts that hit keywords or language boosts",
    overviewNote: "Current support: live scoring, promoted filtering, own-post filtering, reply checkmarks, in-page droplet panel, keyword boosts, and threshold control.",
    languageBoostTitle: "Language boosts",
    topicBoostTitle: "Topic boosts",
    moreLanguages: "More languages",
    moreTopics: "More topics",
    presetKeywordsLabel: "Preset keywords",
    customKeywordsLabel: "Custom additions",
    customHint: "Comma or newline both work. You do not need one keyword per line.",
    statusOn: "Enabled",
    statusOff: "Disabled",
    statusError: "Sync failed"
  },
  ja: {
    pageTitle: "ReplyDrop コンソール",
    tabs: { desk: "ワーク", overview: "概要", signals: "加点", keywords: "キーワード" },
    heroModePill: "X返信レーダー",
    chineseToggleLabel: "簡/繁",
    controlDeckTitle: "クイック操作",
    refreshStatusLabel: "状態を更新",
    openXLabel: "X を開く",
    openOptionsLabel: "詳細設定",
    controlDeckHint: "まず現在のタブが x.com か確認し、そのままページ内パネルを開いてください。実作業は X 内で行います。",
    currentPageLabel: "現在のページ",
    currentPageChecking: "確認中…",
    currentPageOnX: "現在のタブはすでに X です。右上のしずくを押してください。",
    currentPageOffX: "現在のタブは X ではありません。「X を開く」で移動できます。",
    currentPageUnknown: "現在のタブ情報を取得できません。",
    openPanelLabel: "ページ内パネルを開く",
    entryStatusLabel: "ページ内入口",
    entryStatusChecking: "確認中…",
    entryStatusReady: "準備完了 — すぐ開けます",
    entryStatusOpen: "ページ内パネルを表示中",
    entryStatusHidden: "注入済み — 開くのを待機中",
    entryStatusUnavailable: "このタブには入口がありません",
    entryStatusNotOnX: "先に x.com を開いてください",
    lastSyncLabel: "最終同期",
    lastSyncNow: "たった今",
    uiLanguageTitle: "表示言語",
    posterTitle: "ヘッダーポスター",
    posterUploadLabel: "ポスターをアップロード",
    posterClearLabel: "初期状態に戻す",
    posterUrlLabel: "ポスター画像URL",
    posterUrlHint: "ローカル画像のアップロードか、画像の直リンクを使えます。空欄ならデフォルトのポスターです。",
    heroSummary: "先に表示言語を選び、スイッチを入れたら X 右上のしずくから進めます。",
    deskSectionFocus: "受信箱",
    deskSectionDraft: "ルール稿",
    deskSectionGrowth: "看板",
    deskSectionQueue: "キュー",
    deskSectionContacts: "関係",
    deskSectionFeedback: "反応",
    heroDeskSummary: "現在の候補と本日の返信フィードバックを先に確認できます。",
    heroOverviewSummary: "表示しきい値・見せ方・基本状態をここで調整します。",
    heroSignalsSummary: "どの言語とトピックを追加加点するかをここで決めます。",
    heroKeywordsSummary: "候補のヒットに効くプリセット語とカスタム語を管理します。",
    enabledSwitchTitle: "手順1：ReplyDrop をオン",
    entryHintTitle: "手順2：X 右上のしずくを開く",
    entryHintText: "x.com を開き、右上のしずくを押すとページ内ダッシュボードで候補投稿をすぐ確認できます。",
    deskFocusTitle: "次に見る 1 件",
    draftDeskTitle: "ルール草稿デスク",
    draftDeskMeta: "人手 / OSS fallback 用の規則稿を残し、AI 最終返信のふりはさせません。",
    growthPulseTitle: "Growth Dashboard",
    growthPulseMeta: "まず送信済み返信の伸びを見て、次の一手を決めます。",
    relationshipDeskTitle: "関係パルス",
    relationshipDeskMeta: "軽量 CRM：最近返した相手と、また候補に戻ってきた相手。",
    deskBoostTitle: "現在の有効ブースト",
    scoreGuideTitle: "スコア説明",
    candidateDeskTitle: "返信インボックス",
    replyFeedbackTitle: "本日の返信記録",
    restoreDismissedLabel: "スキップを戻す",
    focusEmptyTitle: "候補インボックスはまだ空です",
    focusEmptyText: "X をもう少しスクロールするか、ページ内パネルを開いてリアルタイム候補を見てください。",
    openPostLabel: "投稿を開く",
    copyLinkLabel: "リンクをコピー",
    ignoreCandidateLabel: "スキップ",
    linkCopiedStatus: "候補リンクをコピーしました",
    candidateDismissedStatus: "候補をインボックスから外しました",
    dismissedRestoredStatus: "スキップした候補を戻しました",
    metricViewsLabel: "表示",
    metricRepliesLabel: "返信",
    metricLikesLabel: "いいね",
    queueNowLabel: "今すぐ返信",
    queueWatchLabel: "追いかける",
    queueCrowdedLabel: "混雑気味",
    queueBacklogLabel: "後で確認",
    queueSkippedLabel: "スキップ済み",
    draftAnglePerspective: "視点",
    draftAngleQuestion: "質問",
    draftAngleMemory: "記憶の延長",
    draftAngleContrarian: "軽い対比",
    draftAngleBridge: "補足展開",
    copyDraftLabel: "下書きをコピー",
    draftCopiedStatus: "返信下書きをコピーしました",
    draftEmptyTitle: "候補が出るとルール草稿デスクが動きます",
    draftEmptyText: "ここには人手やモデルなし場面のための規則 fallback を 3 本だけ残します。",
    growthRepliesSentLabel: "本日の返信",
    growthInboxLabel: "候補在庫",
    growthHotLabel: "今が熱い機会",
    growthCoverageLabel: "カバー率",
    growthLiftLabel: "予想成長リフト",
    relationshipReengaged: "候補に再登場",
    relationshipDormant: "いまは静か",
    relationshipActive: "最近返信",
    relationshipEmpty: "表示できる関係シグナルはまだありません。",
    scoreGuideMomentum: "勢い",
    scoreGuideTiming: "鮮度",
    scoreGuideQuality: "会話密度",
    scoreGuideAccount: "アカウント信号",
    scoreGuideMedia: "メディア",
    scoreGuideLanguage: "言語",
    scoreGuideTopic: "トピック",
    scoreGuideCrowding: "混雑ペナルティ",
    scoreGuideGuide1: "緑/黄のしずくは優先候補です。破線はシグナルありですが、まだ弱めです。",
    scoreGuideGuide2: "大物アカウントで返信が埋もれやすい過密スレッドは意図的に減点します。",
    scoreGuideGuide3: "バッジにホバーすると、その投稿の加点理由と減点理由が見えます。",
    enabledSection: "有効",
    disabledSection: "無効",
    groupOn: "有効中",
    groupOff: "無効",
    standbyHint: "保存済みですが、このトピックは今は有効ではありません",
    noCandidates: "表示できる候補はまだありません。",
    noReplies: "本日の返信フィードバックはまだありません。",
    scannedLabel: "スキャン済み投稿",
    visibleLabel: "表示候補数",
    highScoreLabel: "高スコア投稿",
    todayRepliedLabel: "本日の返信数",
    thresholdLabel: "表示しきい値",
    onlyKeywordHitsText: "キーワードまたは言語加点に当たる投稿のみ表示",
    overviewNote: "現在対応: リアルタイム採点、広告除外、自分の投稿除外、返信済みチェック、ページ内ドロップレット面板、キーワード加点、しきい値調整。",
    languageBoostTitle: "言語加点",
    topicBoostTitle: "トピック加点",
    moreLanguages: "その他の言語",
    moreTopics: "その他の話題",
    presetKeywordsLabel: "プリセット語",
    customKeywordsLabel: "カスタム追加",
    customHint: "カンマ区切りでも改行でも使えます。1 行に 1 語でなくても大丈夫です。",
    statusOn: "有効",
    statusOff: "無効",
    statusError: "同期失敗"
  },
  ko: {
    pageTitle: "ReplyDrop 콘솔",
    tabs: { desk: "워크", overview: "개요", signals: "가산점", keywords: "키워드" },
    heroModePill: "X 답글 레이더",
    chineseToggleLabel: "간/번",
    controlDeckTitle: "빠른 작업",
    refreshStatusLabel: "상태 새로고침",
    openXLabel: "X 열기",
    openOptionsLabel: "전체 설정",
    controlDeckHint: "현재 탭이 x.com인지 확인한 뒤 바로 페이지 안 패널을 여세요. 실제 작업은 X 안에서 진행됩니다.",
    currentPageLabel: "현재 페이지",
    currentPageChecking: "확인 중…",
    currentPageOnX: "현재 탭이 이미 X입니다. 오른쪽 위 물방울을 누르세요.",
    currentPageOffX: "현재 탭은 X가 아닙니다. “X 열기”로 바로 이동할 수 있습니다.",
    currentPageUnknown: "현재 탭 정보를 가져오지 못했습니다.",
    openPanelLabel: "페이지 안 패널 열기",
    entryStatusLabel: "페이지 내 진입점",
    entryStatusChecking: "확인 중…",
    entryStatusReady: "준비 완료 — 바로 열 수 있음",
    entryStatusOpen: "페이지 안 패널이 열려 있음",
    entryStatusHidden: "주입 완료 — 열기 대기 중",
    entryStatusUnavailable: "이 탭에는 진입점이 없음",
    entryStatusNotOnX: "먼저 x.com을 여세요",
    lastSyncLabel: "최근 동기화",
    lastSyncNow: "방금",
    uiLanguageTitle: "표시 언어",
    posterTitle: "헤더 포스터",
    posterUploadLabel: "포스터 업로드",
    posterClearLabel: "기본값 복원",
    posterUrlLabel: "포스터 이미지 주소",
    posterUrlHint: "로컬 이미지를 업로드하거나 이미지 직링크를 넣을 수 있습니다. 비워 두면 기본 포스터를 사용합니다.",
    heroSummary: "먼저 언어를 고르고 ReplyDrop을 켠 뒤, 실제 작업은 X 오른쪽 위 물방울에서 진행합니다.",
    deskSectionFocus: "인박스",
    deskSectionDraft: "규칙안",
    deskSectionGrowth: "대시보드",
    deskSectionQueue: "큐",
    deskSectionContacts: "관계",
    deskSectionFeedback: "피드백",
    heroDeskSummary: "현재 후보와 오늘의 답글 피드백을 먼저 확인합니다.",
    heroOverviewSummary: "표시 임계값, 노출 방식, 기본 상태를 여기서 조정합니다.",
    heroSignalsSummary: "어떤 언어와 주제가 추가 가산점을 받을지 정합니다.",
    heroKeywordsSummary: "후보 적중에 영향을 주는 기본/사용자 키워드를 관리합니다.",
    enabledSwitchTitle: "1단계: ReplyDrop 켜기",
    entryHintTitle: "2단계: X 오른쪽 위 물방울 열기",
    entryHintText: "x.com을 열고 오른쪽 위 물방울을 누르면 페이지 안 대시보드에서 후보 게시물을 바로 볼 수 있습니다.",
    deskFocusTitle: "다음으로 볼 1개",
    draftDeskTitle: "규칙 초안 데스크",
    draftDeskMeta: "사람용 / 오픈소스 fallback 규칙 초안만 남기고, 이것을 AI 최종 답글처럼 보이게 하지 않습니다.",
    growthPulseTitle: "Growth Dashboard",
    growthPulseMeta: "먼저 보낸 답글 성과를 보고 다음 동작을 정합니다.",
    relationshipDeskTitle: "관계 펄스",
    relationshipDeskMeta: "가벼운 CRM: 최근 답글한 상대와 다시 후보로 들어온 상대.",
    deskBoostTitle: "현재 적용 중인 가산점",
    scoreGuideTitle: "점수 설명",
    candidateDeskTitle: "답글 인박스",
    replyFeedbackTitle: "오늘의 답글 기록",
    restoreDismissedLabel: "건너뛴 후보 복원",
    focusEmptyTitle: "후보 인박스가 아직 비어 있습니다",
    focusEmptyText: "X에서 조금 더 스크롤하거나 페이지 안 패널을 열어 실시간 후보를 확인하세요.",
    openPostLabel: "게시물 열기",
    copyLinkLabel: "링크 복사",
    ignoreCandidateLabel: "건너뛰기",
    linkCopiedStatus: "후보 링크를 복사했습니다",
    candidateDismissedStatus: "후보를 인박스에서 제외했습니다",
    dismissedRestoredStatus: "건너뛴 후보를 복원했습니다",
    metricViewsLabel: "조회",
    metricRepliesLabel: "답글",
    metricLikesLabel: "좋아요",
    queueNowLabel: "지금 답글",
    queueWatchLabel: "계속 보기",
    queueCrowdedLabel: "혼잡",
    queueBacklogLabel: "후보 보류",
    queueSkippedLabel: "건너뜀",
    draftAnglePerspective: "관점",
    draftAngleQuestion: "질문",
    draftAngleMemory: "기억 연장",
    draftAngleContrarian: "가벼운 대비",
    draftAngleBridge: "확장 보충",
    copyDraftLabel: "초안 복사",
    draftCopiedStatus: "답글 초안을 복사했습니다",
    draftEmptyTitle: "후보가 생기면 규칙 초안 데스크가 켜집니다",
    draftEmptyText: "여기에는 사람용 또는 무모델 상황을 위한 규칙 fallback 3개만 남겨 둡니다.",
    growthRepliesSentLabel: "오늘 답글",
    growthInboxLabel: "후보 재고",
    growthHotLabel: "핫 윈도우",
    growthCoverageLabel: "커버리지",
    growthLiftLabel: "예상 성장 탄력",
    relationshipReengaged: "후보로 재등장",
    relationshipDormant: "지금은 조용함",
    relationshipActive: "최근 답글함",
    relationshipEmpty: "표시할 관계 신호가 아직 없습니다.",
    scoreGuideMomentum: "반응/도달",
    scoreGuideTiming: "신선도",
    scoreGuideQuality: "토론 밀도",
    scoreGuideAccount: "계정 신호",
    scoreGuideMedia: "미디어",
    scoreGuideLanguage: "언어",
    scoreGuideTopic: "주제",
    scoreGuideCrowding: "혼잡 페널티",
    scoreGuideGuide1: "초록/노랑 물방울은 우선 후보입니다. 점선 물방울은 신호는 있지만 아직 약한 상태입니다.",
    scoreGuideGuide2: "너무 붐비는 대형 계정 스레드는 답글이 묻히기 쉬워 의도적으로 감점합니다.",
    scoreGuideGuide3: "배지에 마우스를 올리면 그 게시물의 가점과 감점 이유를 함께 볼 수 있습니다.",
    enabledSection: "적용 중",
    disabledSection: "비활성",
    groupOn: "적용 중",
    groupOff: "꺼짐",
    standbyHint: "저장돼 있지만 이 주제는 지금 켜져 있지 않습니다",
    noCandidates: "아직 잡힌 후보 게시물이 없습니다.",
    noReplies: "오늘 기록된 답글 피드백이 없습니다.",
    scannedLabel: "스캔한 게시물",
    visibleLabel: "표시 후보 수",
    highScoreLabel: "고점수 게시물",
    todayRepliedLabel: "오늘 답글 수",
    thresholdLabel: "표시 임계값",
    onlyKeywordHitsText: "키워드 또는 언어 가산점을 맞은 게시물만 표시",
    overviewNote: "현재 지원: 실시간 점수, 광고 필터링, 내 게시물 제외, 답글 체크 표시, 페이지 내 물방울 패널, 키워드 가산점, 임계값 조절.",
    languageBoostTitle: "언어 가산점",
    topicBoostTitle: "주제 가산점",
    moreLanguages: "더 많은 언어",
    moreTopics: "더 많은 주제",
    presetKeywordsLabel: "기본 키워드",
    customKeywordsLabel: "사용자 정의 추가",
    customHint: "쉼표나 줄바꿈 둘 다 지원합니다. 한 줄에 여러 개를 써도 됩니다.",
    statusOn: "켜짐",
    statusOff: "꺼짐",
    statusError: "동기화 실패"
  }
};

const DEFAULT_STATE = {
  enabled: true,
  scannedCount: 0,
  highScoreCount: 0,
  visibleCount: 0,
  todayReplyCount: 0,
  uiLanguage: "zh-Hans",
  posterUrl: "",
  threshold: 30,
  onlyKeywordHits: false,
  langZh: true,
  langEn: true,
  langJa: true,
  langKo: true,
  langFr: false,
  langEs: false,
  langDe: false,
  langIt: false,
  langPt: false,
  langRu: false,
  langAr: false,
  repliedTweets: {},
  dismissedTweets: {},
  replyDetails: {},
  replyArchive: [],
  recentCandidates: [],
  relationshipStates: {},
  replyQueue: [],
  publishWatch: [],
  pickupWatch: []
};

TOPIC_GROUPS.forEach((group, index) => {
  DEFAULT_STATE[group.enabledKey] = index < 3;
  DEFAULT_STATE[group.keywordsKey] = group.defaults;
});

const PREVIEW_STATE = {
  ...DEFAULT_STATE,
  scannedCount: 128,
  highScoreCount: 19,
  visibleCount: 8,
  todayReplyCount: 3,
  threshold: 34,
  onlyKeywordHits: true,
  dismissedTweets: {
    "https://x.com/replydrop/status/skipped": Date.now() - 90 * 60 * 1000
  },
  recentCandidates: [
    {
      url: "https://x.com/replydrop/status/1",
      authorHandle: "cinemalens",
      text: "A quiet behind-the-scenes clip from a festival premiere is suddenly pulling serious quote-tweets from film editors and trailer people.",
      timestamp: Date.now() - 19 * 60 * 1000,
      authorVerified: true,
      mediaKind: "video",
      tier: "high",
      score: 78,
      likes: 1240,
      replies: 46,
      views: 48200,
      matchedTopics: ["creator", "film"],
      matchedLanguages: ["langEn"],
      highlights: ["festival buzz", "video clip", "creator overlap"],
      keywordMatched: true
    },
    {
      url: "https://x.com/replydrop/status/2",
      authorHandle: "lateframe",
      text: "Director dropped a still, audience is debating the color grade, and the replies are active without being overcrowded yet.",
      timestamp: Date.now() - 52 * 60 * 1000,
      authorVerified: false,
      mediaKind: "image",
      tier: "good",
      score: 63,
      likes: 540,
      replies: 29,
      views: 17600,
      matchedTopics: ["film"],
      matchedLanguages: ["langEn"],
      highlights: ["image post", "reply room", "film topic"]
    },
    {
      url: "https://x.com/replydrop/status/3",
      authorHandle: "novelcut",
      text: "One-sentence hook about a new adaptation is getting bookmarks fast and still has open conversational space under it.",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      authorVerified: true,
      mediaKind: "text",
      tier: "medium",
      score: 51,
      likes: 210,
      replies: 12,
      views: 9800,
      matchedTopics: ["books"],
      matchedLanguages: ["langEn"],
      highlights: ["adaptation", "bookish crowd"]
    },
    {
      url: "https://x.com/replydrop/status/4",
      authorHandle: "screeningroom",
      text: "Subtitled teaser cut is trending in small circles and has unusually high repost-to-like ratio for its size.",
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      authorVerified: false,
      mediaKind: "video",
      tier: "good",
      score: 58,
      likes: 382,
      replies: 18,
      views: 15200,
      matchedTopics: ["film"],
      matchedLanguages: ["langEn"],
      highlights: ["subtitled clip", "repost heavy"]
    }
  ],
  replyDetails: {
    "https://x.com/replydrop/replied/1": {
      authorHandle: "cutbackdaily",
      text: "Replied on a director thread before it crowded out. Good early placement, verified author, still climbing.",
      timestamp: Date.now() - 47 * 60 * 1000,
      authorVerified: true,
      tier: "replied",
      score: 74,
      lane: "优先回复",
      slot: "next",
      keywordMatched: true,
      matchedTopics: ["film", "creator"],
      matchedLanguages: ["langEn"],
      highlights: ["director thread", "early placement"],
      baselineReplies: 11,
      baselineLikes: 92,
      baselineViews: 4100,
      pickupStatus: "author-engaged",
      pickupCheckedAt: Date.now() - 12 * 60 * 1000,
      pickupChecks: 1,
      pickupReplies: 15,
      pickupLikes: 118,
      pickupViews: 4680,
      pickupDeltaReplies: 4,
      pickupDeltaLikes: 26,
      pickupDeltaViews: 580,
      pickupAuthorEngaged: true,
      pickupAuthorReplyUrl: "https://x.com/cutbackdaily/status/11"
    },
    "https://x.com/replydrop/replied/2": {
      authorHandle: "framearchive",
      text: "Reply sent to a poster discussion with clean audience overlap and modest thread depth.",
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      authorVerified: false,
      tier: "replied",
      score: 68,
      lane: "继续跟进",
      slot: "tonight",
      keywordMatched: true,
      matchedTopics: ["film"],
      matchedLanguages: ["langEn"],
      highlights: ["poster discussion", "audience overlap"],
      baselineReplies: 9,
      baselineLikes: 64,
      baselineViews: 2500,
      pickupStatus: "pending",
      pickupCheckedAt: 0,
      pickupChecks: 0,
      pickupReplies: 0,
      pickupLikes: 0,
      pickupViews: 0,
      pickupDeltaReplies: 0,
      pickupDeltaLikes: 0,
      pickupDeltaViews: 0,
      pickupAuthorEngaged: false,
      pickupAuthorReplyUrl: ""
    },
    "https://x.com/replydrop/replied/3": {
      authorHandle: "midnighttake",
      text: "Earlier reply landed on a subtitled clip and now has follow-up engagement from adjacent film accounts.",
      timestamp: Date.now() - 8 * 60 * 60 * 1000,
      authorVerified: false,
      tier: "replied",
      score: 61,
      lane: "候补观察",
      slot: "tomorrow",
      keywordMatched: false,
      matchedTopics: ["film"],
      matchedLanguages: ["langEn"],
      highlights: ["subtitled clip", "follow-up engagement"]
    }
  },
  relationshipStates: {
    cinemalens: {
      status: "pinned",
      updatedAt: Date.now() - 18 * 60 * 1000,
      snoozeUntil: 0
    },
    lateframe: {
      status: "follow-up",
      updatedAt: Date.now() - 42 * 60 * 1000,
      snoozeUntil: 0
    },
    novelcut: {
      status: "snoozed",
      updatedAt: Date.now() - 80 * 60 * 1000,
      snoozeUntil: Date.now() + 8 * 60 * 60 * 1000
    }
  },
  publishWatch: [],
  pickupWatch: [
    {
      url: "https://x.com/replydrop/replied/1",
      authorHandle: "cutbackdaily",
      slot: "next",
      lane: "优先回复",
      score: 74,
      shippedAt: Date.now() - 47 * 60 * 1000,
      baselineReplies: 11,
      baselineLikes: 92,
      baselineViews: 4100,
      lastCheckedAt: Date.now() - 12 * 60 * 1000,
      checks: 1,
      status: "author-engaged",
      pickupReplies: 15,
      pickupLikes: 118,
      pickupViews: 4680,
      deltaReplies: 4,
      deltaLikes: 26,
      deltaViews: 580,
      authorEngaged: true,
      authorReplyUrl: "https://x.com/cutbackdaily/status/11",
      source: "reply"
    },
    {
      url: "https://x.com/replydrop/replied/2",
      authorHandle: "framearchive",
      slot: "tonight",
      lane: "继续跟进",
      score: 68,
      shippedAt: Date.now() - 3 * 60 * 60 * 1000,
      baselineReplies: 9,
      baselineLikes: 64,
      baselineViews: 2500,
      lastCheckedAt: 0,
      checks: 0,
      status: "pending",
      pickupReplies: 0,
      pickupLikes: 0,
      pickupViews: 0,
      deltaReplies: 0,
      deltaLikes: 0,
      deltaViews: 0,
      authorEngaged: false,
      authorReplyUrl: "",
      source: "reply"
    }
  ],
  replyQueue: [
    {
      url: "https://x.com/replydrop/status/1",
      authorHandle: "cinemalens",
      text: "A quiet behind-the-scenes clip from a festival premiere is suddenly pulling serious quote-tweets from film editors and trailer people.",
      score: 78,
      createdAt: Date.now() - 16 * 60 * 1000,
      scheduledFor: Date.now() + 12 * 60 * 1000,
      slot: "next",
      draft: "I think the real hook here is not just festival buzz — it's that the clip still leaves room for editors and trailer people to project their own read onto it.",
      lane: "优先回复",
      keywordMatched: true,
      matchedTopics: ["creator", "film"],
      matchedLanguages: ["langEn"],
      highlights: ["festival buzz", "video clip"],
      status: "queued"
    },
    {
      url: "https://x.com/replydrop/status/2",
      authorHandle: "lateframe",
      text: "Director dropped a still, audience is debating the color grade, and the replies are active without being overcrowded yet.",
      score: 63,
      createdAt: Date.now() - 35 * 60 * 1000,
      scheduledFor: Date.now() - 21 * 60 * 1000,
      slot: "tonight",
      draft: "Curious whether the color-grade debate is really about taste, or whether it's becoming a proxy for what people expected this project to feel like.",
      lane: "继续跟进",
      keywordMatched: true,
      matchedTopics: ["film"],
      matchedLanguages: ["langEn"],
      highlights: ["color grade", "open reply room"],
      status: "queued"
    },
    {
      url: "https://x.com/replydrop/status/3",
      authorHandle: "novelcut",
      text: "One-sentence hook about a new adaptation is getting bookmarks fast and still has open conversational space under it.",
      score: 51,
      createdAt: Date.now() - 6 * 60 * 60 * 1000,
      scheduledFor: Date.now() - 70 * 60 * 1000,
      completedAt: Date.now() - 24 * 60 * 1000,
      slot: "tomorrow",
      draft: "There is probably more room here because the hook feels like a framing device, not a conclusion.",
      lane: "候补观察",
      keywordMatched: false,
      matchedTopics: ["books"],
      matchedLanguages: ["langEn"],
      highlights: ["adaptation", "bookmark velocity"],
      status: "completed"
    },
    {
      url: "https://x.com/replydrop/replied/1",
      authorHandle: "cutbackdaily",
      text: "Replied on a director thread before it crowded out. Good early placement, verified author, still climbing.",
      score: 74,
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      scheduledFor: Date.now() - 82 * 60 * 1000,
      completedAt: Date.now() - 45 * 60 * 1000,
      slot: "next",
      draft: "The nice part here is that the thread was still readable, so the reply could add a framing point instead of just piling on.",
      lane: "优先回复",
      keywordMatched: true,
      matchedTopics: ["film", "creator"],
      matchedLanguages: ["langEn"],
      highlights: ["director thread", "still readable"],
      status: "shipped"
    }
  ]
};

const DAY_MS = 24 * 60 * 60 * 1000;
const QUEUE_STATUS_SET = new Set(["queued", "completed", "shipped"]);
const PICKUP_STATUS_SET = new Set(["pending", "quiet", "picked-up", "author-engaged"]);

const DRAFT_TONE_DEFS = [
  {
    key: "neutral",
    label: { "zh-Hans": "标准", "zh-Hant": "標準", en: "Balanced", ja: "標準", ko: "표준" },
    hint: { "zh-Hans": "保留原始切入", "zh-Hant": "保留原始切入", en: "Keep the original angle", ja: "元の角度を維持", ko: "원래 각도 유지" }
  },
  {
    key: "sharp",
    label: { "zh-Hans": "更锐", "zh-Hant": "更銳", en: "Sharper", ja: "鋭く", ko: "더 날카롭게" },
    hint: { "zh-Hans": "更像主张型回复", "zh-Hant": "更像主張型回覆", en: "Make it more opinionated", ja: "主張を強める", ko: "주장형으로" }
  },
  {
    key: "warm",
    label: { "zh-Hans": "更柔和", "zh-Hant": "更柔和", en: "Warmer", ja: "やわらかく", ko: "더 부드럽게" },
    hint: { "zh-Hans": "更像顺着聊", "zh-Hant": "更像順著聊", en: "Feel more supportive", ja: "寄り添う感じに", ko: "더 공감형으로" }
  },
  {
    key: "short",
    label: { "zh-Hans": "更短", "zh-Hant": "更短", en: "Shorter", ja: "短く", ko: "더 짧게" },
    hint: { "zh-Hans": "适合快回", "zh-Hant": "適合快回", en: "Trim for speed", ja: "素早く返す用", ko: "빠른 답글용" }
  },
  {
    key: "human",
    label: { "zh-Hans": "更像真人", "zh-Hant": "更像真人", en: "More human", ja: "人っぽく", ko: "더 사람답게" },
    hint: { "zh-Hans": "少一点模板感", "zh-Hant": "少一點模板感", en: "Reduce template feel", ja: "テンプレ感を減らす", ko: "템플릿 느낌 줄이기" }
  }
];

const RELATIONSHIP_STATE_DEFS = [
  {
    key: "mutual",
    label: { "zh-Hans": "已互关", "zh-Hant": "已互關", en: "Mutual", ja: "相互フォロー", ko: "맞팔" },
    actionLabel: { "zh-Hans": "互关", "zh-Hant": "互關", en: "Mutual", ja: "相互", ko: "맞팔" },
    tone: "success"
  },
  {
    key: "pinned",
    label: { "zh-Hans": "已置顶", "zh-Hant": "已置頂", en: "Pinned", ja: "固定", ko: "고정" },
    actionLabel: { "zh-Hans": "置顶", "zh-Hant": "置頂", en: "Pin", ja: "固定", ko: "고정" },
    tone: "accent"
  },
  {
    key: "follow-up",
    label: { "zh-Hans": "待跟进", "zh-Hant": "待跟進", en: "Next touch", ja: "次に触る", ko: "다음 터치" },
    actionLabel: { "zh-Hans": "跟进", "zh-Hant": "跟進", en: "Next", ja: "次へ", ko: "다음" },
    tone: "success"
  },
  {
    key: "snoozed",
    label: { "zh-Hans": "稍后再看", "zh-Hant": "稍後再看", en: "Snoozed", ja: "あとで見る", ko: "나중에 보기" },
    actionLabel: { "zh-Hans": "稍后", "zh-Hant": "稍後", en: "Snooze", ja: "あとで", ko: "나중에" },
    tone: "warning"
  }
];

const els = {
  body: document.body,
  viewSheets: Array.from(document.querySelectorAll("[data-view-sheet]")),
  dashboardSheet: document.getElementById("sheet-dashboard"),
  pageTitle: document.getElementById("pageTitle"),
  heroSummary: document.getElementById("heroSummary"),
  heroModePill: document.getElementById("heroModePill"),
  enabledSwitchTitle: document.getElementById("enabledSwitchTitle"),
  switchHintText: document.getElementById("switchHintText"),
  entryHintTitle: document.getElementById("entryHintTitle"),
  entryHintText: document.getElementById("entryHintText"),
  heroPosterArt: document.getElementById("heroPosterArt"),
  heroCounterLabel: document.getElementById("heroCounterLabel"),
  heroRepliedCount: document.getElementById("heroRepliedCount"),
  heroFactScannedLabel: document.getElementById("heroFactScannedLabel"),
  heroFactVisibleLabel: document.getElementById("heroFactVisibleLabel"),
  heroFactThresholdLabel: document.getElementById("heroFactThresholdLabel"),
  heroFactScanned: document.getElementById("heroFactScanned"),
  heroFactVisible: document.getElementById("heroFactVisible"),
  heroFactThreshold: document.getElementById("heroFactThreshold"),
  dashboardLaunchTitle: document.getElementById("dashboardLaunchTitle"),
  dashboardLaunchMeta: document.getElementById("dashboardLaunchMeta"),
  dashboardLaunchButtonLabel: document.getElementById("dashboardLaunchButtonLabel"),
  dashboardLaunchButtonHint: document.getElementById("dashboardLaunchButtonHint"),
  dashboardPreviewChips: document.getElementById("dashboardPreviewChips"),
  openDashboardButton: document.getElementById("openDashboardButton"),
  dashboardBackButton: document.getElementById("dashboardBackButton"),
  dashboardBackLabel: document.getElementById("dashboardBackLabel"),
  dashboardTitle: document.getElementById("dashboardTitle"),
  dashboardSummary: document.getElementById("dashboardSummary"),
  enabledSwitchLabel: document.getElementById("enabledSwitchLabel") || document.getElementById("statusPill"),
  statusPill: document.getElementById("statusPill"),
  statusBadgeText: document.getElementById("statusBadgeText"),
  enabledToggle: document.getElementById("enabledToggle"),
  tabDesk: document.querySelector("#tabDesk .tabButtonLabel"),
  tabOverview: document.querySelector("#tabOverview .tabButtonLabel"),
  tabSignals: document.querySelector("#tabSignals .tabButtonLabel"),
  tabKeywords: document.querySelector("#tabKeywords .tabButtonLabel"),
  deskFocusTitle: document.getElementById("deskFocusTitle"),
  deskFocusMeta: document.getElementById("deskFocusMeta"),
  focusDigestSummary: document.getElementById("focusDigestSummary"),
  deskFocusCard: document.getElementById("deskFocusCard"),
  restoreDismissedButton: document.getElementById("restoreDismissedButton"),
  draftDeskTitle: document.getElementById("draftDeskTitle"),
  draftDeskMeta: document.getElementById("draftDeskMeta"),
  draftDeskPanel: document.getElementById("draftDeskPanel"),
  deskSubTabFocusLabel: document.getElementById("deskSubTabFocusLabel"),
  deskSubTabDraftLabel: document.getElementById("deskSubTabDraftLabel"),
  deskSubTabGrowthLabel: document.getElementById("deskSubTabGrowthLabel"),
  deskSubTabAiLabel: document.getElementById("deskSubTabAiLabel"),
  deskSubTabQueueLabel: document.getElementById("deskSubTabQueueLabel"),
  deskSubTabContactsLabel: document.getElementById("deskSubTabContactsLabel"),
  deskSubTabFeedbackLabel: document.getElementById("deskSubTabFeedbackLabel"),
  deskSubTabFocusCount: document.getElementById("deskSubTabFocusCount"),
  deskSubTabDraftCount: document.getElementById("deskSubTabDraftCount"),
  deskSubTabGrowthCount: document.getElementById("deskSubTabGrowthCount"),
  deskSubTabAiCount: document.getElementById("deskSubTabAiCount"),
  deskSubTabQueueCount: document.getElementById("deskSubTabQueueCount"),
  deskSubTabContactsCount: document.getElementById("deskSubTabContactsCount"),
  deskSubTabFeedbackCount: document.getElementById("deskSubTabFeedbackCount"),
  growthPulseTitle: document.getElementById("growthPulseTitle"),
  growthPulseMeta: document.getElementById("growthPulseMeta"),
  growthPulseGrid: document.getElementById("growthPulseGrid"),
  aiReplyDeskTitle: document.getElementById("aiReplyDeskTitle"),
  aiReplyDeskMeta: document.getElementById("aiReplyDeskMeta"),
  aiReplyDeskPanel: document.getElementById("aiReplyDeskPanel"),
  queueDeskTitle: document.getElementById("queueDeskTitle"),
  queueDeskMeta: document.getElementById("queueDeskMeta"),
  queueDeskPanel: document.getElementById("queueDeskPanel"),
  relationshipDeskTitle: document.getElementById("relationshipDeskTitle"),
  relationshipDeskMeta: document.getElementById("relationshipDeskMeta"),
  relationshipDeskList: document.getElementById("relationshipDeskList"),
  deskBoostTitle: document.getElementById("deskBoostTitle"),
  scoreGuideTitle: document.getElementById("scoreGuideTitle"),
  candidateDeskTitle: document.getElementById("candidateDeskTitle"),
  replyFeedbackTitle: document.getElementById("replyFeedbackTitle"),
  candidateDeskMeta: document.getElementById("candidateDeskMeta"),
  replyFeedbackMeta: document.getElementById("replyFeedbackMeta"),
  deskBoostSummary: document.getElementById("deskBoostSummary"),
  scoreGuideGrid: document.getElementById("scoreGuideGrid"),
  scoreGuideNotes: document.getElementById("scoreGuideNotes"),
  candidateDeskList: document.getElementById("candidateDeskList"),
  replyFeedbackList: document.getElementById("replyFeedbackList"),
  uiLanguageTitle: document.getElementById("uiLanguageTitle"),
  controlDeckTitle: document.getElementById("controlDeckTitle"),
  refreshStatusButton: document.getElementById("refreshStatusButton"),
  openXButton: document.getElementById("openXButton"),
  openPanelButton: document.getElementById("openPanelButton"),
  openOptionsButton: document.getElementById("openOptionsButton"),
  controlDeckHint: document.getElementById("controlDeckHint"),
  currentPageLabel: document.getElementById("currentPageLabel"),
  currentPageValue: document.getElementById("currentPageValue"),
  entryStatusLabel: document.getElementById("entryStatusLabel"),
  entryStatusValue: document.getElementById("entryStatusValue"),
  lastSyncLabel: document.getElementById("lastSyncLabel"),
  lastSyncValue: document.getElementById("lastSyncValue"),
  posterTitle: document.getElementById("posterTitle"),
  posterUploadLabel: document.getElementById("posterUploadLabel"),
  posterClearButton: document.getElementById("posterClearButton"),
  posterUrlLabel: document.getElementById("posterUrlLabel"),
  posterUrlHint: document.getElementById("posterUrlHint"),
  posterFileInput: document.getElementById("posterFileInput"),
  posterUrlInput: document.getElementById("posterUrlInput"),
  localeButtons: Array.from(document.querySelectorAll(".localeButton")),
  scannedLabel: document.getElementById("scannedLabel"),
  visibleLabel: document.getElementById("visibleLabel"),
  highScoreLabel: document.getElementById("highScoreLabel"),
  todayRepliedLabel: document.getElementById("todayRepliedLabel"),
  thresholdLabel: document.getElementById("thresholdLabel"),
  onlyKeywordHitsText: document.getElementById("onlyKeywordHitsText"),
  overviewNote: document.getElementById("overviewNote"),
  languageBoostTitle: document.getElementById("languageBoostTitle"),
  topicBoostTitle: document.getElementById("topicBoostTitle"),
  scannedCount: document.getElementById("scannedCount"),
  visibleCount: document.getElementById("visibleCount"),
  highScoreCount: document.getElementById("highScoreCount"),
  repliedCount: document.getElementById("repliedCount"),
  thresholdRange: document.getElementById("thresholdRange"),
  thresholdValue: document.getElementById("thresholdValue"),
  onlyKeywordHits: document.getElementById("onlyKeywordHits"),
  languageBoostGrid: document.getElementById("languageBoostGrid"),
  topicBoostGrid: document.getElementById("topicBoostGrid"),
  keywordSections: document.getElementById("keywordSections"),
  statusText: document.getElementById("statusText"),
  statusTextMirrors: Array.from(document.querySelectorAll("[data-status-text-mirror]")),
  tabButtons: Array.from(document.querySelectorAll(".tabButton")),
  panels: Array.from(document.querySelectorAll(".panel")),
  deskSubTabButtons: Array.from(document.querySelectorAll(".deskSubTabButton")),
  deskSectionGroups: Array.from(document.querySelectorAll(".deskSectionGroup"))
};

const PickupCore = globalThis.ReplyDropPickupCore || null;
const WorkflowCore = globalThis.ReplyDropWorkflowCore || null;
const AttributionCore = globalThis.ReplyDropAttributionCore || null;
const FocusCore = globalThis.ReplyDropFocusCore || null;
const DraftCore = globalThis.ReplyDropDraftCore || null;
const QueueCore = globalThis.ReplyDropQueueCore || null;
const FeedbackCore = globalThis.ReplyDropFeedbackCore || null;
const PopupUiCore = globalThis.ReplyDropPopupUiCore || null;
const GrowthCore = globalThis.ReplyDropGrowthCore || null;
const POPUP_UI_PREFS_KEY = PopupUiCore?.POPUP_UI_PREFS_KEY || "replydrop-popup-ui";
const POPUP_VIEW_KEYS = PopupUiCore?.POPUP_VIEW_KEYS || ["home", "dashboard"];
const POPUP_TAB_KEYS = PopupUiCore?.POPUP_TAB_KEYS || ["desk", "overview", "signals", "keywords"];
const DESK_SECTION_KEYS = PopupUiCore?.DESK_SECTION_KEYS || ["growth", "ai"];
const QUEUE_FILTER_KEYS = PopupUiCore?.QUEUE_FILTER_KEYS || ["all", "action", "awaiting", "done"];

let currentState = { ...DEFAULT_STATE };
let activeView = "home";
let activeTab = "desk";
let saveTimer = null;
const uiState = {
  openFoldKeys: new Set(),
  lastSyncedAt: Date.now(),
  pageStatus: "checking",
  entryStatus: "checking",
  flashTimer: null,
  focusCandidateUrl: "",
  selectedDraftIndex: 0,
  queueFilter: "all",
  deskSection: "growth",
  draftRouteKey: "",
  draftTone: "neutral",
  draftStarterIndex: -1,
  draftBodyIndex: -1,
  draftCloserIndex: -1,
  composerText: "",
  draftSourceUrl: "",
  attributionSignalModel: null,
  replyArchivePage: 0,
  lastAgentInboxPayload: null,
  lastDraftTargetsPayload: null,
  lastAgentSchemaPayload: null,
  lastAgentFocusContext: null,
  agentContextByUrl: new Map()
};

function normalizePopupTab(value, fallback = "desk") {
  if (typeof PopupUiCore?.normalizePopupTab === "function") {
    return PopupUiCore.normalizePopupTab(value, fallback);
  }
  const raw = String(value || fallback).trim();
  return POPUP_TAB_KEYS.includes(raw) ? raw : fallback;
}

function normalizePopupView(value, fallback = "home") {
  if (typeof PopupUiCore?.normalizePopupView === "function") {
    return PopupUiCore.normalizePopupView(value, fallback);
  }
  const raw = String(value || fallback).trim();
  return POPUP_VIEW_KEYS.includes(raw) ? raw : fallback;
}

function normalizeDeskSection(value, fallback = "growth") {
  if (typeof PopupUiCore?.normalizeDeskSection === "function") {
    return PopupUiCore.normalizeDeskSection(value, fallback);
  }
  const raw = String(value || fallback).trim();
  return DESK_SECTION_KEYS.includes(raw) ? raw : fallback;
}

function normalizeQueueFilter(value, fallback = "all") {
  if (typeof PopupUiCore?.normalizeQueueFilter === "function") {
    return PopupUiCore.normalizeQueueFilter(value, fallback);
  }
  const raw = String(value || fallback).trim();
  return QUEUE_FILTER_KEYS.includes(raw) ? raw : fallback;
}

function getPopupUiPrefsOptions() {
  return {
    availableViews: els.viewSheets.map((sheet) => sheet.dataset.viewSheet).filter(Boolean),
    availableTabs: els.tabButtons.map((button) => button.dataset.tab).filter(Boolean),
    availableDeskSections: els.deskSubTabButtons.map((button) => button.dataset.deskTab).filter(Boolean)
  };
}

function getPopupUiPrefsSnapshot() {
  return {
    activeView,
    activeTab,
    deskSection: uiState.deskSection,
    queueFilter: uiState.queueFilter
  };
}

function resolvePopupUiPrefs(value = {}) {
  const options = getPopupUiPrefsOptions();
  if (typeof PopupUiCore?.resolvePopupUiPrefs === "function") {
    return PopupUiCore.resolvePopupUiPrefs(value, options);
  }
  return {
    activeView: normalizePopupView(value?.activeView, options.availableViews.includes("home") ? "home" : (options.availableViews[0] || "dashboard")),
    activeTab: normalizePopupTab(value?.activeTab, options.availableTabs.includes("desk") ? "desk" : (options.availableTabs[0] || "overview")),
    deskSection: normalizeDeskSection(value?.deskSection, options.availableDeskSections.includes("growth") ? "growth" : (options.availableDeskSections[0] || "growth")),
    queueFilter: normalizeQueueFilter(value?.queueFilter, "all")
  };
}

function mergePopupUiPrefs(patch = {}) {
  const options = getPopupUiPrefsOptions();
  const currentPrefs = getPopupUiPrefsSnapshot();
  if (typeof PopupUiCore?.buildPopupUiPrefs === "function") {
    return PopupUiCore.buildPopupUiPrefs(currentPrefs, patch, options);
  }

  return {
    activeView: Object.prototype.hasOwnProperty.call(patch || {}, "activeView")
      ? normalizePopupView(patch?.activeView, currentPrefs.activeView)
      : currentPrefs.activeView,
    activeTab: Object.prototype.hasOwnProperty.call(patch || {}, "activeTab")
      ? normalizePopupTab(patch?.activeTab, currentPrefs.activeTab)
      : currentPrefs.activeTab,
    deskSection: Object.prototype.hasOwnProperty.call(patch || {}, "deskSection")
      ? normalizeDeskSection(patch?.deskSection, currentPrefs.deskSection)
      : currentPrefs.deskSection,
    queueFilter: Object.prototype.hasOwnProperty.call(patch || {}, "queueFilter")
      ? normalizeQueueFilter(patch?.queueFilter, currentPrefs.queueFilter)
      : currentPrefs.queueFilter
  };
}

function readPopupUiPrefs() {
  try {
    const raw = globalThis.localStorage?.getItem?.(POPUP_UI_PREFS_KEY);
    if (!raw) {
      return null;
    }
    if (typeof PopupUiCore?.parsePopupUiPrefs === "function") {
      return resolvePopupUiPrefs(PopupUiCore.parsePopupUiPrefs(raw));
    }
    const parsed = JSON.parse(raw);
    return resolvePopupUiPrefs(parsed);
  } catch {
    return null;
  }
}

function persistPopupUiPrefs() {
  try {
    const payload = resolvePopupUiPrefs(getPopupUiPrefsSnapshot());
    globalThis.localStorage?.setItem?.(
      POPUP_UI_PREFS_KEY,
      typeof PopupUiCore?.serializePopupUiPrefs === "function"
        ? PopupUiCore.serializePopupUiPrefs(payload)
        : JSON.stringify(payload)
    );
  } catch {
    // Ignore storage issues in restricted preview contexts.
  }
}

function setText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function setStatusTextValue(value) {
  setText(els.statusText, value);
  els.statusTextMirrors.forEach((node) => setText(node, value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return char;
    }
  });
}

function setValue(node, value) {
  if ("value" in (node || {})) {
    node.value = value;
  }
}

function getQueryFlag(name) {
  return new URLSearchParams(globalThis.location.search).get(name) === "1";
}

function isPreviewMode() {
  return getQueryFlag("preview") || globalThis.location.protocol === "file:";
}

function sendMessage(message) {
  return new Promise((resolve) => {
    if (!chrome?.runtime?.sendMessage) {
      resolve(null);
      return;
    }
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response ?? null);
    });
  });
}

function sendTabMessage(tabId, message) {
  return new Promise((resolve) => {
    if (!tabId || !chrome?.tabs?.sendMessage) {
      resolve(null);
      return;
    }
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response ?? null);
    });
  });
}

function uniqueList(value) {
  return Array.from(new Set((Array.isArray(value) ? value : []).map((item) => String(item || "").trim()).filter(Boolean)));
}

function textareaToList(value) {
  return uniqueList(String(value || "").split(/\r?\n|,/).map((item) => item.trim()));
}

function normalizeUiLanguage(value) {
  const raw = String(value || "").trim();
  if (raw === "zh") return "zh-Hans";
  if (raw === "zh-Hans" || raw === "zh-Hant" || raw === "en" || raw === "ja" || raw === "ko") return raw;
  return "zh-Hans";
}

function normalizePosterUrl(value) {
  return String(value || "").trim().slice(0, 4096);
}

function normalizeAuthorVerificationType(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "gold" || raw === "government" || raw === "blue") {
    return raw;
  }
  return "";
}

function normalizeQueueStatus(value, fallback = "queued") {
  if (typeof WorkflowCore?.normalizeQueueStatus === "function") {
    return WorkflowCore.normalizeQueueStatus(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return QUEUE_STATUS_SET.has(raw) ? raw : fallback;
}

function normalizePickupStatus(value, fallback = "pending") {
  if (typeof PickupCore?.normalizePickupStatus === "function") {
    return PickupCore.normalizePickupStatus(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return PICKUP_STATUS_SET.has(raw) ? raw : fallback;
}

function normalizePickupReviewStage(value, fallback = "first-check") {
  if (typeof PickupCore?.normalizePickupReviewStage === "function") {
    return PickupCore.normalizePickupReviewStage(value, fallback);
  }
  const raw = String(value || fallback).trim().toLowerCase();
  return ["first-check", "follow-up", "settled"].includes(raw) ? raw : fallback;
}

function buildPickupReviewPlan(config = {}) {
  if (typeof PickupCore?.buildPickupReviewPlan === "function") {
    return PickupCore.buildPickupReviewPlan(config);
  }
  const checks = Math.max(0, Math.floor(Number(config?.checks) || 0));
  const checkedAt = Math.max(0, Number(config?.checkedAt) || 0);
  const shippedAt = Math.max(0, Number(config?.shippedAt) || 0);
  const status = normalizePickupStatus(config?.status, checks ? "quiet" : "pending");
  const nextReviewAt = Math.max(0, Number(config?.nextReviewAt) || 0);
  const settledAt = Math.max(0, Number(config?.settledAt) || 0);
  const reviewStage = normalizePickupReviewStage(config?.reviewStage, checks ? "follow-up" : "first-check");
  if (settledAt || reviewStage === "settled" || status === "author-engaged") {
    return { reviewStage: "settled", nextReviewAt: 0, settledAt: settledAt || checkedAt || shippedAt || Date.now() };
  }
  if (!checks || status === "pending") {
    return { reviewStage: "first-check", nextReviewAt, settledAt: 0 };
  }
  return { reviewStage: "follow-up", nextReviewAt, settledAt: 0 };
}

function compareReplyQueueItems(left, right) {
  if (typeof WorkflowCore?.compareReplyQueueItems === "function") {
    return WorkflowCore.compareReplyQueueItems(left, right);
  }
  const leftStatus = normalizeQueueStatus(left?.status);
  const rightStatus = normalizeQueueStatus(right?.status);
  const leftClosed = leftStatus !== "queued";
  const rightClosed = rightStatus !== "queued";

  if (leftClosed !== rightClosed) {
    return Number(leftClosed) - Number(rightClosed);
  }

  if (!leftClosed) {
    return (
      (Number(left?.scheduledFor) || 0) - (Number(right?.scheduledFor) || 0) ||
      (Number(right?.score) || 0) - (Number(left?.score) || 0) ||
      (Number(right?.createdAt) || 0) - (Number(left?.createdAt) || 0)
    );
  }

  return (
    (Number(right?.completedAt) || 0) - (Number(left?.completedAt) || 0) ||
    (Number(right?.createdAt) || 0) - (Number(left?.createdAt) || 0)
  );
}

function getLocaleTag() {
  switch (currentState.uiLanguage) {
    case "zh-Hant":
      return "zh-TW";
    case "en":
      return "en-US";
    case "ja":
      return "ja-JP";
    case "ko":
      return "ko-KR";
    case "zh-Hans":
    default:
      return "zh-CN";
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image_load_failed"));
    image.src = src;
  });
}

async function fileToPosterDataUrl(file) {
  const original = await readFileAsDataUrl(file);
  try {
    const image = await loadImageElement(original);
    const longestSide = Math.max(image.naturalWidth || image.width || 0, image.naturalHeight || image.height || 0) || 1;
    const scale = Math.min(1, 1400 / longestSide);
    const width = Math.max(1, Math.round((image.naturalWidth || image.width || 1) * scale));
    const height = Math.max(1, Math.round((image.naturalHeight || image.height || 1) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return original;
    }
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return original;
  }
}

function normalizeReplyHistoryEntry(url, detail = {}) {
  const normalizedUrl = normalizeDeskUrl(url);
  if (!normalizedUrl || !detail || typeof detail !== "object") {
    return null;
  }

  const timestamp = Number(detail.timestamp || Date.now());
  const pickupCheckedAt = Number(detail.pickupCheckedAt || 0);
  const pickupChecks = Math.max(0, Math.floor(Number(detail.pickupChecks) || 0));
  const pickupStatus = normalizePickupStatus(detail.pickupStatus, pickupCheckedAt ? "quiet" : "pending");
  const pickupReviewPlan = buildPickupReviewPlan({
    shippedAt: timestamp,
    checkedAt: pickupCheckedAt,
    checks: pickupChecks,
    status: pickupStatus,
    reviewStage: detail.pickupReviewStage,
    nextReviewAt: detail.pickupNextReviewAt,
    settledAt: detail.pickupSettledAt
  });

  return {
    targetUrl: normalizedUrl,
    url: normalizedUrl,
    timestamp,
    completedAt: Number(detail.completedAt || timestamp),
    score: Math.max(0, Math.floor(Number(detail.score) || 0)),
    tier: String(detail.tier || "replied").trim(),
    authorHandle: String(detail.authorHandle || "").trim(),
    authorVerified: Boolean(detail.authorVerified),
    authorVerificationType: normalizeAuthorVerificationType(detail.authorVerificationType),
    text: String(detail.text || "").trim().slice(0, 280),
    replyText: String(detail.replyText || detail.text || "").trim().slice(0, 560),
    replyUrl: normalizeDeskUrl(detail.replyUrl),
    replyTweetId: String(detail.replyTweetId || "").trim(),
    lane: String(detail.lane || "").trim().slice(0, 48),
    slot: String(detail.slot || "").trim().slice(0, 24),
    keywordMatched: Boolean(detail.keywordMatched),
    matchedTopics: uniqueList(detail.matchedTopics).slice(0, 4),
    matchedLanguages: uniqueList(detail.matchedLanguages).slice(0, 4),
    highlights: uniqueList(detail.highlights).slice(0, 4),
    publishMode: String(detail.publishMode || "").trim().slice(0, 32),
    queuedAt: Number(detail.queuedAt || 0),
    handedOffAt: Number(detail.handedOffAt || 0),
    executionLatencyMs: Number(detail.executionLatencyMs || 0),
    mediaKind: String(detail.mediaKind || "").trim(),
    baselineReplies: Number(detail.baselineReplies || 0),
    baselineLikes: Number(detail.baselineLikes || 0),
    baselineViews: Number(detail.baselineViews || 0),
    pickupStatus,
    pickupCheckedAt,
    pickupChecks,
    pickupReplies: Number(detail.pickupReplies || 0),
    pickupLikes: Number(detail.pickupLikes || 0),
    pickupViews: Number(detail.pickupViews || 0),
    pickupDeltaReplies: Number(detail.pickupDeltaReplies || 0),
    pickupDeltaLikes: Number(detail.pickupDeltaLikes || 0),
    pickupDeltaViews: Number(detail.pickupDeltaViews || 0),
    pickupReviewStage: pickupReviewPlan.reviewStage,
    pickupNextReviewAt: pickupReviewPlan.nextReviewAt,
    pickupSettledAt: pickupReviewPlan.settledAt,
    pickupAuthorEngaged: Boolean(detail.pickupAuthorEngaged),
    pickupAuthorReplyUrl: normalizeDeskUrl(detail.pickupAuthorReplyUrl),
    replyCheckedAt: Number(detail.replyCheckedAt || 0),
    replyChecks: Math.max(0, Math.floor(Number(detail.replyChecks) || 0)),
    replyObservedReplies: Number(detail.replyObservedReplies || 0),
    replyObservedLikes: Number(detail.replyObservedLikes || 0),
    replyObservedViews: Number(detail.replyObservedViews || 0),
    replyDeltaReplies: Number(detail.replyDeltaReplies || 0),
    replyDeltaLikes: Number(detail.replyDeltaLikes || 0),
    replyDeltaViews: Number(detail.replyDeltaViews || 0),
    replyTrafficCapturedAt: Number(detail.replyTrafficCapturedAt || 0),
    replyTrafficSource: String(detail.replyTrafficSource || "").trim().slice(0, 24)
  };
}

function getStartOfLocalDay(timestamp = Date.now()) {
  const date = new Date(Number(timestamp) || Date.now());
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getReplyArchiveEntries(state = currentState) {
  const archiveEntries = Array.isArray(state?.replyArchive) ? state.replyArchive : [];
  if (archiveEntries.length) {
    return archiveEntries
      .filter((entry) => entry && typeof entry === "object" && entry.url)
      .slice()
      .sort((left, right) => (
        Math.max(Number(right?.replyCheckedAt || 0), Number(right?.pickupCheckedAt || 0), Number(right?.timestamp || 0)) -
        Math.max(Number(left?.replyCheckedAt || 0), Number(left?.pickupCheckedAt || 0), Number(left?.timestamp || 0))
      ));
  }

  return Object.entries(state?.replyDetails && typeof state.replyDetails === "object" ? state.replyDetails : {})
    .map(([url, detail]) => normalizeReplyHistoryEntry(url, detail))
    .filter(Boolean)
    .sort((left, right) => (
      Math.max(Number(right?.replyCheckedAt || 0), Number(right?.pickupCheckedAt || 0), Number(right?.timestamp || 0)) -
      Math.max(Number(left?.replyCheckedAt || 0), Number(left?.pickupCheckedAt || 0), Number(left?.timestamp || 0))
    ));
}

function getTodayReplyArchiveEntries(state = currentState, now = Date.now()) {
  const dayStart = getStartOfLocalDay(now);
  return getReplyArchiveEntries(state).filter((entry) => Number(entry?.timestamp || 0) >= dayStart);
}

function getReplyArchivePageEntries(entries = [], page = 0, pageSize = REPLY_ARCHIVE_PAGE_SIZE) {
  const list = Array.isArray(entries) ? entries : [];
  const size = Math.max(1, Math.floor(Number(pageSize) || REPLY_ARCHIVE_PAGE_SIZE));
  const pageCount = Math.max(1, Math.ceil(list.length / size));
  const safePage = Math.max(0, Math.min(pageCount - 1, Math.floor(Number(page) || 0)));
  const start = safePage * size;
  return {
    page: safePage,
    pageCount,
    pageSize: size,
    total: list.length,
    items: list.slice(start, start + size)
  };
}

function normalizeState(state) {
  const next = {
    ...DEFAULT_STATE,
    ...(state || {}),
    uiLanguage: normalizeUiLanguage(state?.uiLanguage),
    posterUrl: normalizePosterUrl(state?.posterUrl)
  };
  next.recentCandidates = Array.isArray(state?.recentCandidates)
    ? state.recentCandidates
      .filter((item) => item && typeof item === "object" && item.url)
      .map((item) => ({
        url: normalizeDeskUrl(item.url),
        score: Math.max(0, Math.floor(Number(item.score) || 0)),
        baseScore: Math.max(0, Math.floor(Number(item.baseScore ?? item.score) || 0)),
        opportunityBoost: Math.floor(Number(item.opportunityBoost) || 0),
        tier: String(item.tier || "hidden").trim(),
        baseTier: String(item.baseTier || item.tier || "hidden").trim(),
        relationshipStatus: String(item.relationshipStatus || "").trim(),
        attributionKind: String(item.attributionKind || "").trim(),
        authorHandle: String(item.authorHandle || "").trim(),
        authorVerified: Boolean(item.authorVerified),
        authorVerificationType: normalizeAuthorVerificationType(item.authorVerificationType),
        text: String(item.text || "").trim().slice(0, 280),
        mediaAltText: String(item.mediaAltText || "").trim().slice(0, 280),
        sourceSurface: String(item.sourceSurface || "").trim().slice(0, 24),
        postScore: Math.max(0, Math.floor(Number(item.postScore ?? item.score) || 0)),
        reachLikelihood: Math.max(0, Math.floor(Number(item.reachLikelihood) || 0)),
        understandingConfidence: Math.max(0, Math.floor(Number(item.understandingConfidence) || 0)),
        authorFit: Math.max(0, Math.floor(Number(item.authorFit) || 0)),
        finalScore: Math.max(0, Math.floor(Number(item.finalScore ?? item.score) || 0)),
        peakFinalScore: Math.max(0, Math.floor(Number(item.peakFinalScore ?? item.finalScore ?? item.score) || 0)),
        peakSourceSurface: String(item.peakSourceSurface || item.sourceSurface || "").trim().slice(0, 24),
        peakObservedAt: Number(item.peakObservedAt || item.timestamp || Date.now()),
        blockReason: String(item.blockReason || "").trim().slice(0, 48),
        lowSemanticConfidence: Boolean(item.lowSemanticConfidence),
        timestamp: Number(item.timestamp || Date.now()),
        mediaKind: String(item.mediaKind || "").trim(),
        likes: Number(item.likes || 0),
        replies: Number(item.replies || 0),
        views: Number(item.views || 0),
        keywordMatched: Boolean(item.keywordMatched),
        matchedTopics: uniqueList(item.matchedTopics).slice(0, 4),
        matchedLanguages: uniqueList(item.matchedLanguages).slice(0, 4),
        highlights: uniqueList(item.highlights).slice(0, 4)
      }))
      .filter((item) => item.url && item.tier !== "hidden")
      .sort((left, right) => Number(right.score || 0) - Number(left.score || 0) || Number(right.timestamp || 0) - Number(left.timestamp || 0))
    : [];
  next.dismissedTweets = state?.dismissedTweets && typeof state.dismissedTweets === "object" ? state.dismissedTweets : {};
  next.replyDetails = state?.replyDetails && typeof state.replyDetails === "object"
    ? Object.fromEntries(
        Object.entries(state.replyDetails)
          .map(([url, detail]) => {
            const normalizedEntry = normalizeReplyHistoryEntry(url, detail);
            return normalizedEntry ? [normalizedEntry.url, normalizedEntry] : null;
          })
          .filter(Boolean)
      )
    : {};
  next.replyArchive = Array.isArray(state?.replyArchive)
    ? state.replyArchive
        .map((entry) => normalizeReplyHistoryEntry(entry?.targetUrl || entry?.url, entry))
        .filter(Boolean)
        .sort((left, right) => (
          Math.max(Number(right?.replyCheckedAt || 0), Number(right?.pickupCheckedAt || 0), Number(right?.timestamp || 0)) -
          Math.max(Number(left?.replyCheckedAt || 0), Number(left?.pickupCheckedAt || 0), Number(left?.timestamp || 0))
        ))
    : Object.values(next.replyDetails)
        .map((entry) => ({ ...entry }))
        .sort((left, right) => (
          Math.max(Number(right?.replyCheckedAt || 0), Number(right?.pickupCheckedAt || 0), Number(right?.timestamp || 0)) -
          Math.max(Number(left?.replyCheckedAt || 0), Number(left?.pickupCheckedAt || 0), Number(left?.timestamp || 0))
        ));
  next.relationshipStates = state?.relationshipStates && typeof state.relationshipStates === "object" ? state.relationshipStates : {};
  next.replyQueue = Array.isArray(state?.replyQueue) ? state.replyQueue
    .filter((item) => item && typeof item === "object" && item.url)
    .map((item) => {
      const status = normalizeQueueStatus(item.status);
      return {
        url: normalizeDeskUrl(item.url),
        authorHandle: String(item.authorHandle || "").trim(),
        text: String(item.text || "").trim().slice(0, 320),
        score: Math.max(0, Math.floor(Number(item.score) || 0)),
        baseScore: Math.max(0, Math.floor(Number(item.baseScore ?? item.score) || 0)),
        opportunityBoost: Math.floor(Number(item.opportunityBoost) || 0),
        createdAt: Number(item.createdAt || Date.now()),
        scheduledFor: Number(item.scheduledFor || Date.now()),
        completedAt: status === "queued" ? 0 : Number(item.completedAt || Date.now()),
        slot: String(item.slot || "next").trim(),
        draft: String(item.draft || "").trim().slice(0, 560),
        lane: String(item.lane || "").trim(),
        relationshipStatus: String(item.relationshipStatus || "").trim(),
        attributionKind: String(item.attributionKind || "").trim(),
        keywordMatched: Boolean(item.keywordMatched),
        matchedTopics: uniqueList(item.matchedTopics).slice(0, 4),
        matchedLanguages: uniqueList(item.matchedLanguages).slice(0, 4),
        highlights: uniqueList(item.highlights).slice(0, 4),
        status
      };
    })
    .sort(compareReplyQueueItems)
    .filter((item) => item.url)
    : [];
  next.publishWatch = Array.isArray(state?.publishWatch) ? state.publishWatch
    .filter((item) => item && typeof item === "object" && item.url)
    .map((item) => {
      const normalizedItem = typeof WorkflowCore?.sanitizePublishWatchState === "function"
        ? WorkflowCore.sanitizePublishWatchState(item)
        : item;
      return {
        url: normalizeDeskUrl(normalizedItem.url),
        authorHandle: String(normalizedItem.authorHandle || "").trim(),
        slot: String(normalizedItem.slot || "next").trim(),
        lane: String(normalizedItem.lane || "").trim(),
        draft: String(normalizedItem.draft || "").trim().slice(0, 560),
        createdAt: Number(normalizedItem.createdAt || Date.now()),
        handedOffAt: Number(normalizedItem.handedOffAt || Date.now()),
        lastAttemptAt: Number(normalizedItem.lastAttemptAt || Date.now()),
        scheduledFor: Number(normalizedItem.scheduledFor || 0),
        draftLoaded: Boolean(normalizedItem.draftLoaded),
        clipboardReady: Boolean(normalizedItem.clipboardReady),
        source: String(normalizedItem.source || "queue").trim(),
        status: typeof WorkflowCore?.normalizePublishWatchStatus === "function"
          ? WorkflowCore.normalizePublishWatchStatus(normalizedItem.status, "composer-ready")
          : (["composer-ready", "post-opened", "cooldown", "failed", "snoozed"].includes(String(normalizedItem.status || "").trim()) ? String(normalizedItem.status || "").trim() : "composer-ready"),
        attempts: Math.max(1, Math.floor(Number(normalizedItem.attempts) || 1)),
        cooldownUntil: Number(normalizedItem.cooldownUntil || 0),
        snoozeUntil: Number(normalizedItem.snoozeUntil || 0)
      };
    })
    .filter((item) => item.url)
    .sort((left, right) => (right.handedOffAt || 0) - (left.handedOffAt || 0))
    : [];
  next.pickupWatch = Array.isArray(state?.pickupWatch) ? state.pickupWatch
    .filter((item) => item && typeof item === "object" && item.url)
    .map((item) => {
      const checks = Math.max(0, Math.floor(Number(item.checks) || 0));
      const status = normalizePickupStatus(item.status, checks ? "quiet" : "pending");
      const reviewPlan = buildPickupReviewPlan({
        shippedAt: Number(item.shippedAt || Date.now()),
        checkedAt: Number(item.lastCheckedAt || 0),
        checks,
        status,
        reviewStage: item.reviewStage,
        nextReviewAt: item.nextReviewAt,
        settledAt: item.settledAt
      });
      return {
        url: normalizeDeskUrl(item.url),
        authorHandle: String(item.authorHandle || "").trim(),
        slot: String(item.slot || "next").trim(),
        lane: String(item.lane || "").trim(),
        score: Math.max(0, Math.floor(Number(item.score) || 0)),
        shippedAt: Number(item.shippedAt || Date.now()),
        baselineReplies: Number(item.baselineReplies || 0),
        baselineLikes: Number(item.baselineLikes || 0),
        baselineViews: Number(item.baselineViews || 0),
        lastCheckedAt: Number(item.lastCheckedAt || 0),
        checks,
        status,
        pickupReplies: Number(item.pickupReplies || 0),
        pickupLikes: Number(item.pickupLikes || 0),
        pickupViews: Number(item.pickupViews || 0),
        deltaReplies: Number(item.deltaReplies || 0),
        deltaLikes: Number(item.deltaLikes || 0),
        deltaViews: Number(item.deltaViews || 0),
        reviewStage: reviewPlan.reviewStage,
        nextReviewAt: reviewPlan.nextReviewAt,
        settledAt: reviewPlan.settledAt,
        authorEngaged: Boolean(item.authorEngaged),
        authorReplyUrl: normalizeDeskUrl(item.authorReplyUrl),
        source: String(item.source || "reply").trim()
      };
    })
    .filter((item) => item.url)
    .sort((left, right) => ((right.lastCheckedAt || right.shippedAt || 0) - (left.lastCheckedAt || left.shippedAt || 0)))
    : [];
  TOPIC_GROUPS.forEach((group) => {
    next[group.keywordsKey] = uniqueList(state?.[group.keywordsKey] ?? DEFAULT_STATE[group.keywordsKey]);
  });
  return next;
}

function getTexts() {
  return TEXTS[currentState.uiLanguage] || TEXTS["zh-Hans"];
}

function localize(map) {
  return map[currentState.uiLanguage] || map["zh-Hans"] || "";
}

function normalizeHandleKey(handle) {
  return String(handle || "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .slice(0, 64);
}

function getLocalizedStatusDef(statusKey) {
  return RELATIONSHIP_STATE_DEFS.find((item) => item.key === statusKey) || null;
}

function getRelationshipState(handle) {
  const key = normalizeHandleKey(handle);
  const raw = currentState.relationshipStates?.[key];
  if (!key || !raw || typeof raw !== "object") {
    return null;
  }
  if (raw.status === "snoozed" && Number(raw.snoozeUntil || 0) <= Date.now()) {
    return null;
  }
  return {
    key,
    status: String(raw.status || ""),
    updatedAt: Number(raw.updatedAt || 0),
    snoozeUntil: Number(raw.snoozeUntil || 0)
  };
}

function getRelationshipStateLabel(statusKey) {
  const status = getLocalizedStatusDef(statusKey);
  return status ? localize(status.label) : "";
}

async function loadState() {
  if (isPreviewMode()) {
    return normalizeState(PREVIEW_STATE);
  }
  const response = await sendMessage({ type: "X_REPLY_SCORER_GET_STATE" });
  return normalizeState(response?.state);
}

function applyViewSheetState() {
  if (els.body) {
    els.body.dataset.popupView = activeView;
  }
  els.viewSheets.forEach((sheet) => {
    const active = sheet.dataset.viewSheet === activeView;
    sheet.classList.toggle("active", active);
    sheet.hidden = !active;
    sheet.setAttribute("aria-hidden", active ? "false" : "true");
    if ("inert" in sheet) {
      sheet.inert = !active;
    } else if (active) {
      sheet.removeAttribute("inert");
    } else {
      sheet.setAttribute("inert", "");
    }
  });
}

function getViewFocusTarget(viewName) {
  if (viewName === "dashboard") {
    return els.dashboardBackButton || els.deskSubTabButtons?.[0] || els.tabButtons?.[0] || null;
  }
  if (viewName === "home") {
    return els.openDashboardButton || els.enabledToggle || null;
  }
  return null;
}

function releaseFocusBeforeViewChange(nextView) {
  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement)) {
    return;
  }
  const ownerSheet = activeElement.closest("[data-view-sheet]");
  if (!ownerSheet || ownerSheet.dataset.viewSheet === nextView) {
    return;
  }
  activeElement.blur();
}

function restoreFocusAfterViewChange(nextView) {
  const target = getViewFocusTarget(nextView);
  if (!(target instanceof HTMLElement)) {
    return;
  }
  requestAnimationFrame(() => {
    if (activeView !== nextView || target.closest("[hidden]")) {
      return;
    }
    target.focus({ preventScroll: true });
  });
}

function applyDeskSectionState() {
  els.deskSubTabButtons.forEach((button) => button.classList.toggle("active", button.dataset.deskTab === uiState.deskSection));
  els.deskSectionGroups.forEach((section) => section.classList.toggle("active", section.dataset.deskSection === uiState.deskSection));
  if (els.body) {
    els.body.dataset.popupDeskSection = activeTab === "desk" ? uiState.deskSection : "";
  }
  if (els.dashboardSheet) {
    els.dashboardSheet.dataset.activeDeskSection = activeTab === "desk" ? uiState.deskSection : "";
  }
}

function applyTabState() {
  els.tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === activeTab));
  els.panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === activeTab));
  if (els.body) {
    els.body.dataset.popupTab = activeTab;
    els.body.dataset.popupDeskSection = activeTab === "desk" ? uiState.deskSection : "";
  }
  if (els.dashboardSheet) {
    els.dashboardSheet.dataset.activeTab = activeTab;
    els.dashboardSheet.dataset.activeDeskSection = activeTab === "desk" ? uiState.deskSection : "";
  }
  if (activeTab === "desk") {
    applyDeskSectionState();
  }
}

function switchView(viewName) {
  const nextPrefs = mergePopupUiPrefs({ activeView: viewName });
  activeView = nextPrefs.activeView;
  activeTab = nextPrefs.activeTab;
  uiState.deskSection = nextPrefs.deskSection;
  uiState.queueFilter = nextPrefs.queueFilter;
  releaseFocusBeforeViewChange(activeView);
  applyViewSheetState();
  applyTabState();
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = 0;
  }
  if (els.body) {
    els.body.scrollTop = 0;
  }
  persistPopupUiPrefs();
  renderTexts();
  restoreFocusAfterViewChange(activeView);
}

function switchTab(tabName) {
  const nextPrefs = mergePopupUiPrefs({ activeView: "dashboard", activeTab: tabName });
  activeView = nextPrefs.activeView;
  activeTab = nextPrefs.activeTab;
  uiState.deskSection = nextPrefs.deskSection;
  uiState.queueFilter = nextPrefs.queueFilter;
  applyViewSheetState();
  applyTabState();
  persistPopupUiPrefs();
  renderTexts();
}

function switchDeskSection(sectionName) {
  const nextPrefs = mergePopupUiPrefs({ deskSection: sectionName });
  activeView = nextPrefs.activeView;
  activeTab = nextPrefs.activeTab;
  uiState.deskSection = nextPrefs.deskSection;
  uiState.queueFilter = nextPrefs.queueFilter;
  applyViewSheetState();
  applyDeskSectionState();
  persistPopupUiPrefs();
}

function setDeskSubTabCount(node, value) {
  if (!node) {
    return;
  }
  const count = Math.max(0, Number(value) || 0);
  node.textContent = String(count);
  node.hidden = count === 0;
}

function renderTexts() {
  const t = getTexts();
  document.documentElement.lang = currentState.uiLanguage;
  setText(els.pageTitle, t.pageTitle);
  setText(els.heroSummary, t.heroSummary);
  setText(els.heroModePill, t.heroModePill || "");
  setText(els.enabledSwitchTitle, t.enabledSwitchTitle || "");
  setText(els.switchHintText, t.switchHintText || "");
  setText(els.entryHintTitle, t.entryHintTitle || "");
  setText(els.entryHintText, t.entryHintText || "");
  setText(els.heroCounterLabel, t.todayRepliedLabel);
  setText(els.heroFactScannedLabel, t.scannedLabel);
  setText(els.heroFactVisibleLabel, t.visibleLabel);
  setText(els.heroFactThresholdLabel, t.thresholdLabel);
  if (els.enabledSwitchLabel) {
    els.enabledSwitchLabel.title = currentState.enabled ? t.statusOn : t.statusOff;
  }
  setText(els.statusBadgeText, currentState.enabled ? t.statusOn : t.statusOff);
  setText(els.dashboardLaunchTitle, localize({
    "zh-Hans": "仪表盘",
    "zh-Hant": "儀表盤",
    en: "Dashboard",
    ja: "ダッシュボード",
    ko: "대시보드"
  }));
  setText(els.dashboardLaunchButtonLabel, localize({
    "zh-Hans": "打开仪表盘",
    "zh-Hant": "打開儀表盤",
    en: "Open dashboard",
    ja: "ダッシュボードを開く",
    ko: "대시보드 열기"
  }));
  setText(els.dashboardLaunchButtonHint, localize({
    "zh-Hans": "工作台 / 概览 / 加成 / 关键词",
    "zh-Hant": "工作台 / 概覽 / 加成 / 關鍵詞",
    en: "Desk / Overview / Signals / Keywords",
    ja: "ワーク / 概要 / 加点 / キーワード",
    ko: "워크 / 개요 / 가산점 / 키워드"
  }));
  setText(els.dashboardBackLabel, localize({
    "zh-Hans": "返回首页",
    "zh-Hant": "返回首頁",
    en: "Back home",
    ja: "ホームへ戻る",
    ko: "홈으로 돌아가기"
  }));
  setText(els.dashboardTitle, localize({
    "zh-Hans": "仪表盘",
    "zh-Hant": "儀表盤",
    en: "Dashboard",
    ja: "ダッシュボード",
    ko: "대시보드"
  }));
  setText(els.dashboardSummary, localize({
    "zh-Hans": "工作台 / 概览 / 加成 / 关键词",
    "zh-Hant": "工作台 / 概覽 / 加成 / 關鍵詞",
    en: "Desk / Overview / Signals / Keywords",
    ja: "ワーク / 概要 / 加点 / キーワード",
    ko: "워크 / 개요 / 가산점 / 키워드"
  }));
  setText(els.tabDesk, t.tabs.desk);
  setText(els.tabOverview, t.tabs.overview);
  setText(els.tabSignals, t.tabs.signals);
  setText(els.tabKeywords, t.tabs.keywords);
  setText(els.deskFocusTitle, t.deskFocusTitle);
  setText(els.draftDeskTitle, t.draftDeskTitle);
  setText(els.draftDeskMeta, t.draftDeskMeta);
  setText(els.deskSubTabFocusLabel, t.deskSectionFocus);
  setText(els.deskSubTabDraftLabel, t.deskSectionDraft);
  setText(els.deskSubTabGrowthLabel, localize({
    "zh-Hans": "看板",
    "zh-Hant": "看板",
    en: "Dashboard",
    ja: "看板",
    ko: "대시보드"
  }));
  setText(els.deskSubTabAiLabel, localize({
    "zh-Hans": "写稿/执行",
    "zh-Hant": "寫稿/執行",
    en: "Draft / Run",
    ja: "草稿/実行",
    ko: "초안/실행"
  }));
  setText(els.deskSubTabQueueLabel, t.deskSectionQueue);
  setText(els.deskSubTabContactsLabel, t.deskSectionContacts);
  setText(els.deskSubTabFeedbackLabel, t.deskSectionFeedback);
  setText(els.growthPulseTitle, localize({
    "zh-Hans": "增长看板",
    "zh-Hant": "增長看板",
    en: "Reply performance",
    ja: "成長看板",
    ko: "성장 대시보드"
  }));
  setText(els.growthPulseMeta, localize({
    "zh-Hans": "只看自己已发回复的曝光、互动和回流，再决定下一步。",
    "zh-Hant": "只看自己已發回覆的曝光、互動和回流，再決定下一步。",
    en: "Track only the reach, interaction, and return signals from replies you already shipped.",
    ja: "送信済み返信の表示・反応・戻りだけを見て、次の一手を決めます。",
    ko: "이미 보낸 답글의 노출, 반응, 되돌아오는 신호만 보고 다음 동작을 정합니다."
  }));
  setText(els.aiReplyDeskTitle, localize({
    "zh-Hans": "人工写稿 / AI 执行",
    "zh-Hant": "人工寫稿 / AI 執行",
    en: "Human drafts / AI runtime",
    ja: "人手草稿 / AI 実行",
    ko: "사람 초안 / AI 실행"
  }));
  setText(els.aiReplyDeskMeta, localize({
    "zh-Hans": "人工模式复制高分帖上下文给 Codex / Claude 写正式草稿；AI 模式才打开回复框并提交。",
    "zh-Hant": "人工模式複製高分帖上下文給 Codex / Claude 寫正式草稿；AI 模式才打開回覆框並提交。",
    en: "Human mode copies high-score post context for Codex / Claude to draft; AI runtime mode opens the composer and submits.",
    ja: "人手モードは高スコア投稿の文脈を Codex / Claude に渡して草稿化し、AI 実行モードだけが返信欄を開いて送信します。",
    ko: "사람 모드는 고점 게시물 컨텍스트를 Codex / Claude에 넘겨 초안을 만들고, AI 실행 모드만 답글창을 열고 제출합니다."
  }));
  setText(els.queueDeskTitle, localize({"zh-Hans": "回复队列", "zh-Hant": "回覆隊列", en: "Reply queue", ja: "返信キュー", ko: "답글 큐"}));
  setText(els.queueDeskMeta, localize({"zh-Hans": "把候选排进下一轮 / 今晚 / 明早，让发现真正走到执行。", "zh-Hant": "把候選排進下一輪 / 今晚 / 明早，讓發現真正走到執行。", en: "Queue candidates into next-up / tonight / tomorrow so discovery can actually turn into execution.", ja: "候補を次・今夜・明朝に並べて、発見を実行へつなげます。", ko: "후보를 다음 차례 / 오늘 밤 / 내일 아침으로 배치해 발견을 실제 실행으로 잇습니다."}));
  setText(els.relationshipDeskTitle, t.relationshipDeskTitle);
  setText(els.relationshipDeskMeta, t.relationshipDeskMeta);
  setText(els.deskBoostTitle, t.deskBoostTitle);
  setText(els.scoreGuideTitle, t.scoreGuideTitle);
  setText(els.candidateDeskTitle, t.candidateDeskTitle);
  setText(els.replyFeedbackTitle, t.replyFeedbackTitle);
  setText(els.restoreDismissedButton, t.restoreDismissedLabel);
  setText(els.uiLanguageTitle, t.uiLanguageTitle);
  setText(els.controlDeckTitle, t.controlDeckTitle);
  setText(els.refreshStatusButton, t.refreshStatusLabel);
  setText(els.openXButton, t.openXLabel);
  setText(els.openPanelButton, t.openPanelLabel);
  setText(els.openOptionsButton, t.openOptionsLabel);
  setText(els.controlDeckHint, t.controlDeckHint);
  setText(els.currentPageLabel, t.currentPageLabel);
  setText(els.entryStatusLabel, t.entryStatusLabel);
  setText(els.lastSyncLabel, t.lastSyncLabel);
  setText(els.posterTitle, t.posterTitle);
  setText(els.posterUploadLabel, t.posterUploadLabel);
  setText(els.posterClearButton, t.posterClearLabel);
  setText(els.posterUrlLabel, t.posterUrlLabel);
  setText(els.posterUrlHint, t.posterUrlHint);
  setText(els.scannedLabel, t.scannedLabel);
  setText(els.visibleLabel, t.visibleLabel);
  setText(els.highScoreLabel, t.highScoreLabel);
  setText(els.todayRepliedLabel, t.todayRepliedLabel);
  setText(els.thresholdLabel, t.thresholdLabel);
  setText(els.onlyKeywordHitsText, t.onlyKeywordHitsText);
  setText(els.overviewNote, t.overviewNote);
  setText(els.languageBoostTitle, t.languageBoostTitle);
  setText(els.topicBoostTitle, t.topicBoostTitle);
  setStatusTextValue(currentState.enabled ? t.statusOn : t.statusOff);
  els.localeButtons.forEach((button) => {
    if (button.dataset.lang === "zh") {
      button.textContent = t.chineseToggleLabel;
    }
  });
  renderControlDeck();
}

function renderLocaleButtons() {
  els.localeButtons.forEach((button) => {
    const lang = button.dataset.lang;
    const active = lang === "zh"
      ? currentState.uiLanguage === "zh-Hans" || currentState.uiLanguage === "zh-Hant"
      : currentState.uiLanguage === lang;
    button.classList.toggle("active", active);
  });
}

function renderStats() {
  if (els.enabledToggle) {
    els.enabledToggle.checked = Boolean(currentState.enabled);
  }
  setText(els.scannedCount, String(currentState.scannedCount ?? 0));
  setText(els.visibleCount, String(currentState.visibleCount ?? 0));
  setText(els.highScoreCount, String(currentState.highScoreCount ?? 0));
  setText(els.repliedCount, String(currentState.todayReplyCount ?? 0));
  setText(els.heroRepliedCount, String(currentState.todayReplyCount ?? 0));
  setText(els.heroFactScanned, String(currentState.scannedCount ?? 0));
  setText(els.heroFactVisible, String(currentState.visibleCount ?? 0));
  setText(els.heroFactThreshold, String(currentState.threshold ?? 30));
  if (els.statusPill) {
    els.statusPill.dataset.state = currentState.enabled ? "on" : "off";
  }
  setText(els.statusBadgeText, currentState.enabled ? getTexts().statusOn : getTexts().statusOff);
  if (els.thresholdRange) {
    els.thresholdRange.value = String(currentState.threshold ?? 30);
  }
  setText(els.thresholdValue, String(currentState.threshold ?? 30));
  if (els.onlyKeywordHits) {
    els.onlyKeywordHits.checked = Boolean(currentState.onlyKeywordHits);
  }
  if (els.posterUrlInput && document.activeElement !== els.posterUrlInput) {
    els.posterUrlInput.value = currentState.posterUrl || "";
  }
  if (els.posterClearButton instanceof HTMLButtonElement) {
    els.posterClearButton.disabled = !currentState.posterUrl;
  }
  applyPosterPreview();
}

function formatSyncTime(timestamp) {
  const ms = Number(timestamp) || 0;
  if (!ms) {
    return "--:--";
  }

  if (Date.now() - ms < 45000) {
    return getTexts().lastSyncNow;
  }

  return new Intl.DateTimeFormat(getLocaleTag(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(ms);
}

function getCurrentPageSummary() {
  const t = getTexts();
  switch (uiState.pageStatus) {
    case "x":
      return t.currentPageOnX;
    case "off":
      return t.currentPageOffX;
    case "unknown":
      return t.currentPageUnknown;
    case "checking":
    default:
      return t.currentPageChecking;
  }
}

function getEntryStatusSummary() {
  const t = getTexts();
  if (uiState.pageStatus !== "x") {
    return t.entryStatusNotOnX;
  }
  switch (uiState.entryStatus) {
    case "ready":
      return t.entryStatusReady;
    case "open":
      return t.entryStatusOpen;
    case "hidden":
      return t.entryStatusHidden;
    case "unavailable":
      return t.entryStatusUnavailable;
    case "checking":
    default:
      return t.entryStatusChecking;
  }
}

function renderControlDeck() {
  setText(els.currentPageValue, getCurrentPageSummary());
  setText(els.entryStatusValue, getEntryStatusSummary());
  setText(els.lastSyncValue, formatSyncTime(uiState.lastSyncedAt));
  if (els.openPanelButton instanceof HTMLButtonElement) {
    const canOpenPanel = currentState.enabled && uiState.pageStatus === "x" && (uiState.entryStatus === "ready" || uiState.entryStatus === "open");
    els.openPanelButton.disabled = !canOpenPanel;
  }
  if (els.openXButton instanceof HTMLButtonElement) {
    els.openXButton.disabled = uiState.pageStatus === "x";
  }
}

function applyPosterPreview() {
  if (!(els.heroPosterArt instanceof HTMLElement)) {
    return;
  }
  const posterUrl = normalizePosterUrl(currentState.posterUrl);
  if (!posterUrl) {
    els.heroPosterArt.style.backgroundImage = "";
    els.heroPosterArt.classList.remove("is-custom");
    return;
  }
  const safeUrl = posterUrl.replace(/"/g, '\\"');
  els.heroPosterArt.classList.add("is-custom");
  els.heroPosterArt.style.backgroundImage = `linear-gradient(180deg, rgba(8, 12, 18, 0.08), rgba(8, 12, 18, 0.3)), url("${safeUrl}")`;
}

function formatRelativeTime(timestamp) {
  const ms = Number(timestamp) || 0;
  if (!ms) {
    return "";
  }

  const diffMinutes = Math.max(0, Math.round((Date.now() - ms) / 60000));
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

function summarizeActiveBoosts() {
  const enabledLanguages = LANGUAGE_BOOSTS.filter((item) => currentState[item.key]);
  const enabledTopics = TOPIC_GROUPS.filter((group) => currentState[group.enabledKey]);
  return {
    enabledLanguages,
    enabledTopics
  };
}

function createSummaryChip(text, tone = "default") {
  const span = document.createElement("span");
  span.className = "summaryChip";
  span.dataset.tone = tone;
  span.textContent = text;
  return span;
}

function createDeskLedgerChip(label, value, tone = "default") {
  const item = document.createElement("div");
  item.className = "deskLedgerChip";
  item.dataset.tone = tone;

  const labelSpan = document.createElement("span");
  labelSpan.className = "deskLedgerLabel";
  labelSpan.textContent = label;

  const valueSpan = document.createElement("span");
  valueSpan.className = "deskLedgerValue";
  valueSpan.textContent = value;

  item.append(labelSpan, valueSpan);
  return item;
}

function getDismissedCount() {
  return Object.keys(currentState.dismissedTweets || {}).length;
}

function getReplyQueueItems() {
  return Array.isArray(currentState.replyQueue) ? currentState.replyQueue.slice().sort(compareReplyQueueItems) : [];
}

function getPublishWatchItems() {
  return Array.isArray(currentState.publishWatch)
    ? currentState.publishWatch.slice().sort((left, right) => (right.handedOffAt || 0) - (left.handedOffAt || 0))
    : [];
}

function getPublishWatchItem(url) {
  const normalized = normalizeDeskUrl(url);
  return getPublishWatchItems().find((item) => item.url === normalized) || null;
}

function getPublishWatchAgeMs(item, now = Date.now()) {
  return Math.max(0, now - (Number(item?.handedOffAt) || Number(item?.lastAttemptAt) || now));
}

function getPublishWatchAgeText(item, now = Date.now()) {
  const ageText = formatQueueAgeValue(getPublishWatchAgeMs(item, now));
  return localize({
    "zh-Hans": `待确认 ${ageText}`,
    "zh-Hant": `待確認 ${ageText}`,
    en: `Awaiting ${ageText}`,
    ja: `確認待ち ${ageText}`,
    ko: `확인 대기 ${ageText}`
  });
}

function getPickupWatchItems() {
  return Array.isArray(currentState.pickupWatch)
    ? currentState.pickupWatch.slice().sort((left, right) => {
        const leftBucket = getPickupReviewBucket(left);
        const rightBucket = getPickupReviewBucket(right);
        const leftDue = leftBucket === "due";
        const rightDue = rightBucket === "due";
        if (leftDue !== rightDue) {
          return Number(rightDue) - Number(leftDue);
        }
        const leftSettled = leftBucket === "settled";
        const rightSettled = rightBucket === "settled";
        if (leftSettled !== rightSettled) {
          return Number(leftSettled) - Number(rightSettled);
        }
        return ((right.lastCheckedAt || right.shippedAt || 0) - (left.lastCheckedAt || left.shippedAt || 0));
      })
    : [];
}

function getPickupWatchItem(url) {
  const normalized = normalizeDeskUrl(url);
  return getPickupWatchItems().find((item) => item.url === normalized) || null;
}

function getPickupWatchAgeMs(item, now = Date.now()) {
  return Math.max(0, now - (Number(item?.lastCheckedAt) || Number(item?.shippedAt) || now));
}

function getPickupLifecycleCounts(pickupItems = getPickupWatchItems()) {
  if (typeof GrowthCore?.getPickupLifecycleCounts === "function") {
    return GrowthCore.getPickupLifecycleCounts(pickupItems);
  }
  return pickupItems.reduce((counts, item) => {
    const status = normalizePickupStatus(item?.status, item?.lastCheckedAt ? "quiet" : "pending");
    counts.total += 1;
    counts.checked += item?.lastCheckedAt ? 1 : 0;
    if (status === "pending") {
      counts.pending += 1;
    } else if (status === "quiet") {
      counts.quiet += 1;
    } else if (status === "picked-up") {
      counts.pickedUp += 1;
    } else if (status === "author-engaged") {
      counts.authorEngaged += 1;
    }
    return counts;
  }, {
    total: 0,
    checked: 0,
    pending: 0,
    quiet: 0,
    pickedUp: 0,
    authorEngaged: 0
  });
}

function getPickupReviewBucket(item, now = Date.now()) {
  if (typeof GrowthCore?.getPickupReviewBucket === "function") {
    return GrowthCore.getPickupReviewBucket(item, now);
  }
  const checks = Math.max(0, Math.floor(Number(item?.pickupChecks ?? item?.checks) || (item?.lastCheckedAt ? 1 : 0)));
  const reviewStage = normalizePickupReviewStage(item?.pickupReviewStage ?? item?.reviewStage, checks ? "follow-up" : "first-check");
  const nextReviewAt = Math.max(0, Number(item?.pickupNextReviewAt ?? item?.nextReviewAt) || 0);
  const settledAt = Math.max(0, Number(item?.pickupSettledAt ?? item?.settledAt) || 0);
  if (settledAt || reviewStage === "settled") {
    return "settled";
  }
  if (!nextReviewAt) {
    return checks ? "watching" : "due";
  }
  return nextReviewAt <= now ? "due" : "watching";
}

function getPickupReviewCounts(pickupItems = getPickupWatchItems(), now = Date.now()) {
  if (typeof GrowthCore?.getPickupReviewCounts === "function") {
    return GrowthCore.getPickupReviewCounts(pickupItems, now);
  }
  return pickupItems.reduce((counts, item) => {
    const bucket = getPickupReviewBucket(item, now);
    counts.total += 1;
    if (bucket === "due") counts.due += 1;
    else if (bucket === "watching") counts.watching += 1;
    else if (bucket === "settled") counts.settled += 1;
    return counts;
  }, {
    total: 0,
    due: 0,
    watching: 0,
    settled: 0
  });
}

function getQueuedItem(url) {
  const normalized = normalizeDeskUrl(url);
  return getReplyQueueItems().find((item) => item.url === normalized) || null;
}

function getQueuedCount() {
  return getReplyQueueItems().filter((item) => normalizeQueueStatus(item.status) === "queued").length;
}

function getQueueExecutionKey(item, now = Date.now()) {
  if (typeof GrowthCore?.getQueueExecutionKey === "function") {
    return GrowthCore.getQueueExecutionKey(item, now);
  }
  const status = normalizeQueueStatus(item?.status);
  if (status === "shipped") {
    return "shipped";
  }
  if (status === "completed") {
    return "completed";
  }

  const scheduledFor = Number(item?.scheduledFor) || 0;
  if (!scheduledFor) {
    return "queued";
  }

  const delta = scheduledFor - now;
  if (delta < -15 * 60 * 1000) {
    return "overdue";
  }
  if (delta <= 20 * 60 * 1000) {
    return "due-soon";
  }
  return "queued";
}

function getQueueAgeMs(item, now = Date.now()) {
  return Math.max(0, now - (Number(item?.createdAt) || now));
}

function formatQueueAgeValue(ageMs) {
  const totalMinutes = Math.max(0, Math.round(Number(ageMs || 0) / 60000));
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const totalHours = Math.max(1, Math.round(totalMinutes / 60));
  if (totalHours < 24) {
    return `${totalHours}h`;
  }
  return `${Math.max(1, Math.round(totalHours / 24))}d`;
}

function getQueueAgeChipText(item, now = Date.now()) {
  const ageText = formatQueueAgeValue(getQueueAgeMs(item, now));
  return localize({
    "zh-Hans": `排队 ${ageText}`,
    "zh-Hant": `排隊 ${ageText}`,
    en: `Queued ${ageText}`,
    ja: `キュー ${ageText}`,
    ko: `큐 ${ageText}`
  });
}

function getQueueStaleThresholdMs(item) {
  switch (String(item?.slot || "next")) {
    case "tonight":
      return 8 * 60 * 60 * 1000;
    case "tomorrow":
      return 16 * 60 * 60 * 1000;
    case "next":
    default:
      return 4 * 60 * 60 * 1000;
  }
}

function isStaleQueueItem(item, now = Date.now()) {
  if (normalizeQueueStatus(item?.status) !== "queued") {
    return false;
  }
  if (getQueueExecutionKey(item, now) !== "queued") {
    return false;
  }
  return getQueueAgeMs(item, now) >= getQueueStaleThresholdMs(item);
}

function getQueueExecutionText(key) {
  switch (key) {
    case "shipped":
      return {
        label: localize({"zh-Hans": "已发出", "zh-Hant": "已發出", en: "Shipped", ja: "送信済み", ko: "발송 완료"}),
        hint: localize({"zh-Hans": "这条已经通过真实回复落地", "zh-Hant": "這條已經透過真實回覆落地", en: "This queue item was actually replied to", ja: "実際の返信として送られた", ko: "실제 답글로 발송됨"}),
        tone: "success"
      };
    case "completed":
      return {
        label: localize({"zh-Hans": "已完成", "zh-Hant": "已完成", en: "Completed", ja: "完了", ko: "완료"}),
        hint: localize({"zh-Hans": "这条已手动处理完，不再占执行位", "zh-Hant": "這條已手動處理完，不再佔執行位", en: "Handled manually and removed from the active lane", ja: "手動で処理済み", ko: "수동 처리 완료"}),
        tone: "soft"
      };
    case "overdue":
      return {
        label: localize({"zh-Hans": "已过窗", "zh-Hant": "已過窗", en: "Overdue", ja: "時間超過", ko: "시간 초과"}),
        hint: localize({"zh-Hans": "这条应该已经发，建议现在处理或改档", "zh-Hant": "這條應該已經發，建議現在處理或改檔", en: "This should already be out. Ship it now or reschedule.", ja: "もう出すべき時間。今やるか時間をずらす", ko: "이미 나가야 할 타이밍입니다. 지금 처리하거나 다시 잡으세요."}),
        tone: "warning"
      };
    case "due-soon":
      return {
        label: localize({"zh-Hans": "临近窗口", "zh-Hant": "臨近窗口", en: "Due soon", ja: "もうすぐ", ko: "곧 처리"}),
        hint: localize({"zh-Hans": "执行窗口快到了，建议提前打开原帖", "zh-Hant": "執行窗口快到了，建議提前打開原貼", en: "Execution window is close. Open the post and prepare.", ja: "実行窓が近い。先に元投稿を開く", ko: "실행 창이 가까워졌습니다. 먼저 원문을 여세요."}),
        tone: "accent"
      };
    case "queued":
    default:
      return {
        label: localize({"zh-Hans": "待执行", "zh-Hant": "待執行", en: "Queued", ja: "待機中", ko: "대기 중"}),
        hint: localize({"zh-Hans": "还在排期中", "zh-Hant": "還在排期中", en: "Still staged for later", ja: "まだ予定の中", ko: "아직 예약 상태"}),
        tone: "soft"
      };
  }
}

function getQueueLifecycleCounts(queueItems = getReplyQueueItems()) {
  if (typeof GrowthCore?.getQueueLifecycleCounts === "function") {
    return GrowthCore.getQueueLifecycleCounts(queueItems, {
      publishWatchItems: getPublishWatchItems(),
      now: Date.now()
    });
  }
  const publishWatchSet = new Set(getPublishWatchItems().map((item) => item.url));
  return queueItems.reduce((counts, item) => {
    const executionKey = getQueueExecutionKey(item);
    if (normalizeQueueStatus(item.status) === "queued") {
      counts.live += 1;
      if (publishWatchSet.has(item.url)) {
        counts.awaiting += 1;
      }
    }
    if (executionKey === "queued") {
      counts.staged += 1;
    } else if (executionKey === "due-soon") {
      counts.dueSoon += 1;
      counts.action += 1;
    } else if (executionKey === "overdue") {
      counts.overdue += 1;
      counts.action += 1;
    } else if (executionKey === "completed") {
      counts.completed += 1;
      counts.done += 1;
    } else if (executionKey === "shipped") {
      counts.shipped += 1;
      counts.done += 1;
    }
    return counts;
  }, {
    live: 0,
    staged: 0,
    action: 0,
    dueSoon: 0,
    overdue: 0,
    completed: 0,
    shipped: 0,
    awaiting: 0,
    done: 0
  });
}

function getQueueFilterLabel(filterKey) {
  switch (filterKey) {
    case "action":
      return localize({"zh-Hans": "该动手", "zh-Hant": "該動手", en: "Needs action", ja: "今やる", ko: "지금 처리"});
    case "live":
      return localize({"zh-Hans": "排期中", "zh-Hant": "排期中", en: "Live", ja: "進行中", ko: "진행 중"});
    case "done":
      return localize({"zh-Hans": "已落地", "zh-Hant": "已落地", en: "Done", ja: "完了済み", ko: "완료됨"});
    case "all":
    default:
      return localize({"zh-Hans": "全部", "zh-Hant": "全部", en: "All", ja: "全部", ko: "전체"});
  }
}

function getFilteredQueueItems(queueItems, filterKey = uiState.queueFilter) {
  if (typeof QueueCore?.filterQueueItems === "function") {
    return QueueCore.filterQueueItems(queueItems, filterKey, Date.now());
  }
  switch (filterKey) {
    case "action":
      return queueItems.filter((item) => {
        const executionKey = getQueueExecutionKey(item);
        return executionKey === "due-soon" || executionKey === "overdue";
      });
    case "live":
      return queueItems.filter((item) => normalizeQueueStatus(item.status) === "queued");
    case "done":
      return queueItems.filter((item) => normalizeQueueStatus(item.status) !== "queued");
    case "all":
    default:
      return queueItems;
  }
}

function getQueueSlotTexts(slot) {
  switch (slot) {
    case "tonight":
      return {
        label: localize({"zh-Hans": "今晚", "zh-Hant": "今晚", en: "Tonight", ja: "今夜", ko: "오늘 밤"}),
        hint: localize({"zh-Hans": "适合今晚集中处理", "zh-Hant": "適合今晚集中處理", en: "Good for tonight's batch", ja: "今夜まとめて返す", ko: "오늘 밤 몰아서 처리"})
      };
    case "tomorrow":
      return {
        label: localize({"zh-Hans": "明早", "zh-Hant": "明早", en: "Tomorrow", ja: "明朝", ko: "내일 아침"}),
        hint: localize({"zh-Hans": "留给下一波窗口", "zh-Hant": "留給下一波窗口", en: "Hold for the next window", ja: "次の窓で返す", ko: "다음 윈도에 보류"})
      };
    case "next":
    default:
      return {
        label: localize({"zh-Hans": "下一轮", "zh-Hant": "下一輪", en: "Next up", ja: "次", ko: "다음 차례"}),
        hint: localize({"zh-Hans": "最近 30 分钟内执行", "zh-Hant": "最近 30 分鐘內執行", en: "Execute in the next ~30 min", ja: "30分以内に返す", ko: "30분 안에 실행"})
      };
  }
}

function getScheduledTimestamp(slot) {
  const now = new Date();
  if (slot === "tonight") {
    const tonight = new Date(now);
    tonight.setHours(20, 30, 0, 0);
    if (tonight.getTime() <= now.getTime()) {
      tonight.setTime(now.getTime() + 2 * 60 * 60 * 1000);
    }
    return tonight.getTime();
  }
  if (slot === "tomorrow") {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 30, 0, 0);
    return tomorrow.getTime();
  }
  return now.getTime() + 30 * 60 * 1000;
}

function getLaneDefaultQueueSlot(candidate) {
  const laneKey = getCandidateLane(candidate).key;
  return laneKey === "now" ? "next" : laneKey === "watch" ? "tonight" : "tomorrow";
}

function getDefaultQueueSlot(candidate) {
  const laneDefault = getLaneDefaultQueueSlot(candidate);
  if (typeof AttributionCore?.getDefaultQueueSlot !== "function" || typeof AttributionCore?.summarizeCandidateAttribution !== "function") {
    return laneDefault;
  }
  const attributionSignal = AttributionCore.summarizeCandidateAttribution(candidate, uiState.attributionSignalModel);
  return AttributionCore.getDefaultQueueSlot(laneDefault, attributionSignal);
}

function formatScheduleTime(timestamp) {
  try {
    return new Intl.DateTimeFormat(getLocaleTag(), { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(Number(timestamp) || Date.now()));
  } catch {
    return formatRelativeTime(timestamp);
  }
}

function buildQueueActionPayload(url, slot) {
  return JSON.stringify({ url, slot });
}

function getDismissedUrlSet() {
  return new Set(Object.keys(currentState.dismissedTweets || {}));
}

function getVisibleDeskCandidates() {
  const dismissed = getDismissedUrlSet();
  return (Array.isArray(currentState.recentCandidates) ? currentState.recentCandidates : [])
    .filter((candidate) => candidate && candidate.url && !dismissed.has(candidate.url));
}

function getActionableDeskCandidates(candidates = getVisibleDeskCandidates()) {
  return candidates.filter((candidate) => {
    const relationship = getRelationshipState(candidate.authorHandle);
    return !candidate?.blockReason && !(relationship?.status === "snoozed" && relationship.snoozeUntil > Date.now());
  });
}

function resolveFocusCandidate(candidates) {
  const selected = candidates.find((candidate) => candidate.url === uiState.focusCandidateUrl) || candidates[0] || null;
  const nextFocusUrl = selected?.url || "";
  if (uiState.focusCandidateUrl !== nextFocusUrl) {
    uiState.focusCandidateUrl = nextFocusUrl;
    uiState.selectedDraftIndex = 0;
    uiState.draftRouteKey = "";
    uiState.draftTone = "neutral";
    uiState.draftStarterIndex = -1;
    uiState.draftBodyIndex = -1;
    uiState.draftCloserIndex = -1;
    uiState.composerText = "";
    uiState.draftSourceUrl = "";
  }
  return selected;
}

function setFocusCandidate(url) {
  uiState.focusCandidateUrl = String(url || "").trim();
  uiState.selectedDraftIndex = 0;
  uiState.draftRouteKey = "";
  uiState.draftTone = "neutral";
  uiState.draftStarterIndex = -1;
  uiState.draftBodyIndex = -1;
  uiState.draftCloserIndex = -1;
  uiState.composerText = "";
  uiState.draftSourceUrl = "";
  render(currentState);
}

function getActiveDraftToneDef() {
  return DRAFT_TONE_DEFS.find((item) => item.key === uiState.draftTone) || DRAFT_TONE_DEFS[0];
}

function getActiveDraftComposerTextarea() {
  const activeComposer = document.querySelector('.deskSectionGroup.active .draftComposerTextarea');
  if (activeComposer instanceof HTMLTextAreaElement) {
    return activeComposer;
  }
  const aiComposer = els.aiReplyDeskPanel?.querySelector(".draftComposerTextarea");
  if (aiComposer instanceof HTMLTextAreaElement) {
    return aiComposer;
  }
  const draftComposer = els.draftDeskPanel?.querySelector(".draftComposerTextarea");
  return draftComposer instanceof HTMLTextAreaElement ? draftComposer : null;
}

function formatCompactCount(value) {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  if (!count) {
    return "0";
  }

  try {
    return new Intl.NumberFormat(getLocaleTag(), {
      notation: "compact",
      maximumFractionDigits: count >= 10000 ? 0 : 1
    }).format(count);
  } catch {
    if (count >= 1000000) {
      return `${Math.round(count / 100000) / 10}M`;
    }
    if (count >= 1000) {
      return `${Math.round(count / 100) / 10}K`;
    }
    return String(count);
  }
}

function getTopicLabel(topicKey) {
  const group = TOPIC_GROUPS.find((item) => item.key === topicKey);
  if (!group) {
    return topicKey;
  }
  return localize(group.title).replace(/\s*(关键词|關鍵詞|keywords|キーワード|키워드)$/i, "").trim();
}

function getLanguageLabel(languageKey) {
  const language = LANGUAGE_BOOSTS.find((item) => item.key === languageKey);
  if (!language) {
    return languageKey.replace(/^lang/, "");
  }
  return localize(language.label).replace(/\s*\+\d+\s*$/, "").trim();
}

function getCandidateAgeMinutes(candidate) {
  return Math.max(0, Math.round((Date.now() - (Number(candidate?.timestamp) || 0)) / 60000));
}

function getLaneText(key) {
  const t = getTexts();
  switch (key) {
    case "now":
      return t.queueNowLabel;
    case "watch":
      return t.queueWatchLabel;
    case "crowded":
      return t.queueCrowdedLabel;
    case "backlog":
    default:
      return t.queueBacklogLabel;
  }
}

function getCandidateLane(candidate) {
  const score = Number(candidate?.score) || 0;
  const opportunityBoost = Number(candidate?.opportunityBoost) || 0;
  const relationshipStatus = String(candidate?.relationshipStatus || getRelationshipState(candidate?.authorHandle)?.status || "").trim();
  const attributionKind = String(candidate?.attributionKind || "").trim();
  const ageMinutes = getCandidateAgeMinutes(candidate);
  const replies = Number(candidate?.replies) || 0;
  const views = Number(candidate?.views) || 0;
  const likes = Number(candidate?.likes) || 0;
  const conversationRatio = views > 0 ? (replies / Math.max(views, 1)) : 0;
  const likeReplyRatio = likes > 0 && replies > 0 ? (likes / Math.max(replies, 1)) : 0;
  const relationshipHot = relationshipStatus === "mutual" || relationshipStatus === "pinned";
  const memoryHot = attributionKind === "author-engaged" || attributionKind === "handle-picked-up";
  const validatedRelationshipHot = relationshipHot && (memoryHot || opportunityBoost >= 10 || score >= 64);
  const crowded = replies >= 180 || (views >= 180000 && replies >= 90);
  const broadcastHeavy = (
    (views >= 120000 && conversationRatio > 0 && conversationRatio < 0.0025) ||
    likeReplyRatio >= 22
  );

  if ((crowded || broadcastHeavy) && opportunityBoost < 10 && score < 84 && !validatedRelationshipHot && !memoryHot) {
    return { key: "crowded", label: getLaneText("crowded"), tone: "warning", priority: 1 };
  }
  if (
    (score >= 72 && ageMinutes <= 240) ||
    (opportunityBoost >= 12 && ageMinutes <= 360) ||
    ((validatedRelationshipHot || memoryHot) && ageMinutes <= 720 && score >= 52)
  ) {
    return { key: "now", label: getLaneText("now"), tone: "success", priority: 4 };
  }
  if (
    (score >= 58 && ageMinutes <= 720) ||
    opportunityBoost >= 8 ||
    relationshipStatus === "follow-up" ||
    validatedRelationshipHot ||
    memoryHot ||
    attributionKind === "topic-validated"
  ) {
    return { key: "watch", label: getLaneText("watch"), tone: "accent", priority: 3 };
  }
  return { key: "backlog", label: getLaneText("backlog"), tone: "soft", priority: 2 };
}

function getCandidateOpportunityChip(candidate) {
  const boost = Math.round(Number(candidate?.opportunityBoost) || 0);
  if (!boost) {
    return null;
  }
  return {
    text: localize({
      "zh-Hans": `机会 +${boost}`,
      "zh-Hant": `機會 +${boost}`,
      en: `Lift +${boost}`,
      ja: `機会 +${boost}`,
      ko: `기회 +${boost}`
    }),
    tone: boost >= 12 ? "success" : "accent"
  };
}

function getCandidateBaseScoreChip(candidate) {
  const score = Math.round(Number(candidate?.score) || 0);
  const baseScore = Math.round(Number(candidate?.baseScore ?? score) || 0);
  if (!baseScore || baseScore === score) {
    return null;
  }
  return {
    text: localize({
      "zh-Hans": `基础 ${baseScore}`,
      "zh-Hant": `基礎 ${baseScore}`,
      en: `Base ${baseScore}`,
      ja: `基礎 ${baseScore}`,
      ko: `기본 ${baseScore}`
    }),
    tone: "soft"
  };
}

function getCandidateSemanticChip(candidate) {
  if (!candidate?.lowSemanticConfidence) {
    return null;
  }
  return {
    text: localize({
      "zh-Hans": "媒体语义弱",
      "zh-Hant": "媒體語義弱",
      en: "Weak media context",
      ja: "媒体文脈が弱い",
      ko: "미디어 맥락 약함"
    }),
    tone: "warning"
  };
}

function isCandidateFollowTrainBait(candidate) {
  const text = String(candidate?.text || "").trim().toLowerCase();
  if (!text) {
    return false;
  }

  const hasCta = (
    /\b(?:reply|comment|drop|say|type)\s+(?:me|hello|hey|hi)\b/.test(text) ||
    /\bwho\s+is\s+active(?:\s+now)?\b/.test(text)
  );
  const hasReward = (
    /\b(?:follow\s*back|followback|need a follow|followers?\s+fast|real followers|grow together|connect\s*(?:&|and)\s*grow|let'?s connect|follow wave(?: incoming)?|follow for follow|f4f)\b/.test(text) ||
    /\b(?:gain|get)\s+\d+(?:[.,]\d+)?\s+followers?\b/.test(text)
  );

  return hasCta && hasReward;
}

function getCandidateRelationshipPriority(candidate) {
  const relationship = getRelationshipState(candidate?.authorHandle);
  const verificationType = normalizeAuthorVerificationType(candidate?.authorVerificationType);
  const score = Number(candidate?.score) || 0;
  const opportunityBoost = Number(candidate?.opportunityBoost) || 0;
  const attributionKind = String(candidate?.attributionKind || "").trim();
  const memoryHot = attributionKind === "author-engaged" || attributionKind === "handle-picked-up";
  if (relationship?.status === "mutual") {
    if (memoryHot) {
      return 3;
    }
    if (verificationType === "gold" || verificationType === "government") {
      return score >= 62 || opportunityBoost >= 10 ? 1 : 0;
    }
    return score >= 64 || opportunityBoost >= 10 ? 2 : 1;
  }
  const followTrainRisk = isCandidateFollowTrainBait(candidate);
  if (relationship?.status === "pinned") {
    if (!memoryHot && followTrainRisk) {
      return 0;
    }
    return memoryHot || score >= 60 || opportunityBoost >= 8 ? 2 : 1;
  }
  if (relationship?.status === "follow-up") {
    if (!memoryHot && followTrainRisk) {
      return 0;
    }
    return memoryHot || score >= 56 || opportunityBoost >= 6 ? 1 : 0;
  }
  if (relationship?.status === "snoozed") {
    return -1;
  }
  return 0;
}

function sortDeskCandidates(candidates, attributionModel = null) {
  const baseSorted = candidates.slice().sort((left, right) => {
    const leftLane = getCandidateLane(left);
    const rightLane = getCandidateLane(right);
    const leftRelationshipPriority = getCandidateRelationshipPriority(left);
    const rightRelationshipPriority = getCandidateRelationshipPriority(right);
    return (
      rightLane.priority - leftLane.priority ||
      (Number(right.score) || 0) - (Number(left.score) || 0) ||
      rightRelationshipPriority - leftRelationshipPriority ||
      (Number(right.timestamp) || 0) - (Number(left.timestamp) || 0)
    );
  });
  if (attributionModel && typeof AttributionCore?.sortCandidatesByAttribution === "function") {
    return AttributionCore.sortCandidatesByAttribution(baseSorted, attributionModel);
  }
  return baseSorted;
}

function buildDeskQueueSummary(candidates, dismissedCount = getDismissedCount()) {
  const counts = { now: 0, watch: 0, crowded: 0, backlog: 0 };
  candidates.forEach((candidate) => {
    const lane = getCandidateLane(candidate);
    counts[lane.key] += 1;
  });
  const queueCounts = getQueueLifecycleCounts();

  const parts = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => `${count} ${getLaneText(key)}`);

  if (queueCounts.action > 0) {
    parts.push(`${queueCounts.action} ${localize({"zh-Hans": "该动手", "zh-Hant": "該動手", en: "needs action", ja: "今やる", ko: "지금 처리"})}`);
  } else if (queueCounts.live > 0) {
    parts.push(`${queueCounts.live} ${localize({"zh-Hans": "已排队", "zh-Hant": "已排隊", en: "queued", ja: "キュー済み", ko: "큐됨"})}`);
  }

  if (queueCounts.shipped > 0) {
    parts.push(`${queueCounts.shipped} ${getQueueExecutionText("shipped").label}`);
  }

  if (dismissedCount > 0) {
    parts.push(`${dismissedCount} ${getTexts().queueSkippedLabel}`);
  }

  return parts.join(" · ") || getTexts().noCandidates;
}

function createDeskMetricChip(label, value) {
  const chip = document.createElement("span");
  chip.className = "deskMetricChip";

  const labelSpan = document.createElement("span");
  labelSpan.className = "deskMetricLabel";
  labelSpan.textContent = label;

  const valueSpan = document.createElement("strong");
  valueSpan.className = "deskMetricValue";
  valueSpan.textContent = value;

  chip.append(labelSpan, valueSpan);
  return chip;
}

function createDeskActionButton(action, label, url = "", tone = "default") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "deskActionButton";
  button.dataset.action = action;
  button.dataset.tone = tone;
  if (url) {
    button.dataset.url = url;
  }
  button.textContent = label;
  return button;
}

function formatDeskMediaKind(value) {
  const raw = String(value || "text").trim().toLowerCase();
  if (raw === "image" || raw === "photo") return localize({ "zh-Hans": "图片", "zh-Hant": "圖片", en: "Image", ja: "画像", ko: "이미지" });
  if (raw === "video") return localize({ "zh-Hans": "视频", "zh-Hant": "影片", en: "Video", ja: "動画", ko: "영상" });
  if (raw === "gif") return "GIF";
  if (raw === "mixed") return localize({ "zh-Hans": "混合", "zh-Hant": "混合", en: "Mixed", ja: "混合", ko: "혼합" });
  return localize({ "zh-Hans": "文本", "zh-Hant": "文字", en: "Text", ja: "テキスト", ko: "텍스트" });
}

function formatDeskWindow(value) {
  const raw = String(value || "text").trim().toLowerCase();
  if (raw === "video") return localize({ "zh-Hans": "视频帖", "zh-Hant": "影片貼", en: "Video post", ja: "動画ポスト", ko: "영상 포스트" });
  if (raw === "image" || raw === "photo") return localize({ "zh-Hans": "图片帖", "zh-Hant": "圖片貼", en: "Image post", ja: "画像ポスト", ko: "이미지 포스트" });
  if (raw === "gif") return localize({ "zh-Hans": "GIF 帖", "zh-Hant": "GIF 貼", en: "GIF post", ja: "GIFポスト", ko: "GIF 포스트" });
  if (raw === "mixed") return localize({ "zh-Hans": "混合帖", "zh-Hant": "混合貼", en: "Mixed post", ja: "混合ポスト", ko: "혼합 포스트" });
  return localize({ "zh-Hans": "文字帖", "zh-Hant": "文字貼", en: "Text post", ja: "テキストポスト", ko: "텍스트 포스트" });
}

function buildDeskMetaField(label, value) {
  return `
    <div class="deskMetaField">
      <span class="deskMetaFieldLabel">${escapeHtml(label)}</span>
      <span class="deskMetaFieldValue">${escapeHtml(value)}</span>
    </div>
  `;
}

function buildDeskTicketMarkup({
  serial,
  lane,
  handle,
  text,
  time,
  verified,
  mediaKind,
  stubLabel,
  stubValue,
  stubMeta,
  stubSerial,
  tier
}) {
  const verifiedLabel = verified ? "认证" : "普通";
  const scoreText = String(stubValue ?? "");
  return `
    <div class="deskRail" aria-hidden="true">
      <span class="deskRailAdmit">候选</span>
      <span class="deskRailSerial">${escapeHtml(serial)}</span>
    </div>
    <div class="deskMain">
      <div class="deskPrintStrip">
        <span>${escapeHtml(lane)}</span>
        <span>${escapeHtml(time)}</span>
      </div>
      <div class="deskItemTop">
        <strong>${escapeHtml(handle)}</strong>
        <span class="deskVerifyMark">${escapeHtml(verifiedLabel)}</span>
      </div>
      <p class="deskText">${escapeHtml(text)}</p>
      <div class="deskMetaGrid">
        ${buildDeskMetaField("类型", formatDeskMediaKind(mediaKind))}
        ${buildDeskMetaField("帖子", formatDeskWindow(mediaKind))}
      </div>
    </div>
    <div class="deskPerforation" aria-hidden="true">
      <span class="deskPerforationLine"></span>
    </div>
    <div class="deskStub">
      <span class="deskStubLabel">${escapeHtml(stubLabel)}</span>
      <span class="deskScore" data-tier="${escapeHtml(tier || "hidden")}" data-score="${escapeHtml(scoreText)}">
        <span class="deskScoreValue" aria-hidden="true"></span>
      </span>
      <span class="deskStubMeta">${escapeHtml(stubMeta)}</span>
      <span class="deskStubSerial">${escapeHtml(stubSerial)}</span>
      <span class="deskStubBarcode" aria-hidden="true"></span>
    </div>
  `;
}

function appendDeskSignalRows(container, candidate, lane) {
  const signalRow = document.createElement("div");
  signalRow.className = "deskSignalRow";
  signalRow.appendChild(createSummaryChip(lane.label, lane.tone));
  const opportunityChip = getCandidateOpportunityChip(candidate);
  if (opportunityChip) {
    signalRow.appendChild(createSummaryChip(opportunityChip.text, opportunityChip.tone));
  }
  const baseScoreChip = getCandidateBaseScoreChip(candidate);
  if (baseScoreChip) {
    signalRow.appendChild(createSummaryChip(baseScoreChip.text, baseScoreChip.tone));
  }
  const semanticChip = getCandidateSemanticChip(candidate);
  if (semanticChip) {
    signalRow.appendChild(createSummaryChip(semanticChip.text, semanticChip.tone));
  }

  const attributionSummary = typeof AttributionCore?.summarizeCandidateAttribution === "function"
    ? AttributionCore.summarizeCandidateAttribution(candidate, uiState.attributionSignalModel)
    : null;
  if (attributionSummary) {
    const label = attributionSummary.kind === "author-engaged"
      ? localize({
          "zh-Hans": "作者记忆",
          "zh-Hant": "作者記憶",
          en: "Author memory",
          ja: "作者記憶",
          ko: "작성자 기억"
        })
      : attributionSummary.kind === "topic-validated"
        ? localize({
            "zh-Hans": "主题记忆",
            "zh-Hant": "主題記憶",
            en: "Topic memory",
            ja: "話題記憶",
            ko: "주제 기억"
          })
        : localize({
            "zh-Hans": "已验证",
            "zh-Hant": "已驗證",
            en: "Validated",
            ja: "検証済み",
            ko: "검증됨"
          });
    signalRow.appendChild(createSummaryChip(label, attributionSummary.kind === "author-engaged" ? "success" : "accent"));
  }

  const relationship = getRelationshipState(candidate.authorHandle);
  if (relationship?.status) {
    const statusDef = getLocalizedStatusDef(relationship.status);
    signalRow.appendChild(createSummaryChip(getRelationshipStateLabel(relationship.status), statusDef?.tone || "accent"));
  }

  const queuedItem = getQueuedItem(candidate.url);
  if (queuedItem) {
    signalRow.appendChild(createSummaryChip(getQueueSlotTexts(queuedItem.slot).label, "warning"));
  }

  (candidate.matchedTopics || []).slice(0, 2).forEach((topicKey) => {
    signalRow.appendChild(createSummaryChip(getTopicLabel(topicKey), "accent"));
  });

  if (!(candidate.matchedTopics || []).length) {
    (candidate.matchedLanguages || []).slice(0, 2).forEach((languageKey) => {
      signalRow.appendChild(createSummaryChip(getLanguageLabel(languageKey), "soft"));
    });
  }

  container.appendChild(signalRow);

  if (Array.isArray(candidate.highlights) && candidate.highlights.length) {
    const reasonRow = document.createElement("div");
    reasonRow.className = "deskReasonRow";
    candidate.highlights.slice(0, 3).forEach((highlight) => {
      reasonRow.appendChild(createSummaryChip(highlight, "soft"));
    });
    container.appendChild(reasonRow);
  }
}

function appendDeskMetricsRow(container, candidate) {
  const t = getTexts();
  const metricsRow = document.createElement("div");
  metricsRow.className = "deskMetricsRow";
  metricsRow.append(
    createDeskMetricChip(t.metricViewsLabel, formatCompactCount(candidate.views)),
    createDeskMetricChip(t.metricRepliesLabel, formatCompactCount(candidate.replies)),
    createDeskMetricChip(t.metricLikesLabel, formatCompactCount(candidate.likes))
  );
  container.appendChild(metricsRow);
}

function appendDeskActionRow(container, candidate, options = {}) {
  const t = getTexts();
  const actionRow = document.createElement("div");
  actionRow.className = "deskActionRow";
  actionRow.appendChild(createDeskActionButton("open-post", t.openPostLabel, candidate.url, "primary"));

  if (options.includeOpenPanel) {
    actionRow.appendChild(createDeskActionButton("open-panel", t.openPanelLabel, "", "accent"));
  } else {
    const focusLabel = localize({
      "zh-Hans": "设为主线",
      "zh-Hant": "設為主線",
      en: "Work this",
      ja: "主線にする",
      ko: "메인으로"
    });
    if (!options.isFocusedChoice) {
      actionRow.appendChild(createDeskActionButton("focus-candidate", focusLabel, candidate.url, "accent"));
    } else {
      actionRow.appendChild(createDeskActionButton("copy-link", t.copyLinkLabel, candidate.url));
    }
  }

  const queuedItem = getQueuedItem(candidate.url);
  if (queuedItem) {
    const queueButton = createDeskActionButton("remove-queue", localize({
      "zh-Hans": "移出队列",
      "zh-Hant": "移出隊列",
      en: "Remove queue",
      ja: "キュー解除",
      ko: "큐에서 제거"
    }), candidate.url, "warning");
    actionRow.appendChild(queueButton);
  } else {
    const queueButton = createDeskActionButton("queue-candidate", localize({
      "zh-Hans": "排入队列",
      "zh-Hant": "排入隊列",
      en: "Queue it",
      ja: "キューへ",
      ko: "큐에 넣기"
    }), "", "soft");
    queueButton.dataset.payload = buildQueueActionPayload(candidate.url, getDefaultQueueSlot(candidate));
    actionRow.appendChild(queueButton);
  }

  if (options.includeIgnore !== false) {
    actionRow.appendChild(createDeskActionButton("dismiss-candidate", t.ignoreCandidateLabel, candidate.url, "warning"));
  }

  container.appendChild(actionRow);
}

function buildDeskCandidateItem(candidate, index, options = {}) {
  const lane = getCandidateLane(candidate);
  const item = document.createElement("article");
  item.className = `deskItem deskItem--candidate${options.focus ? " deskItem--focus" : ""}`;
  if (options.isFocusedChoice) {
    item.classList.add("deskItem--selected");
  }
  if (candidate.url) {
    item.dataset.url = candidate.url;
  }
  item.innerHTML = buildDeskTicketMarkup({
    serial: options.focus ? "RD-N001" : `RD-C${String(index + 1).padStart(3, "0")}`,
    lane: lane.label,
    handle: candidate.authorHandle ? `@${candidate.authorHandle}` : "post",
    text: candidate.text || "",
    time: formatRelativeTime(candidate.timestamp),
    verified: candidate.authorVerified,
    mediaKind: candidate.mediaKind,
    stubLabel: "分数",
    stubValue: String(candidate.score ?? 0),
    stubMeta: lane.label,
    stubSerial: options.focus ? "最佳候选" : `候选 ${String(index + 1).padStart(3, "0")}`,
    tier: candidate.tier || "hidden"
  });

  const main = item.querySelector(".deskMain");
  if (main) {
    appendDeskSignalRows(main, candidate, lane);
    appendDeskMetricsRow(main, candidate);
    appendDeskActionRow(main, candidate, {
      includeIgnore: true,
      includeOpenPanel: Boolean(options.focus),
      isFocusedChoice: Boolean(options.isFocusedChoice || options.focus)
    });
  }

  return item;
}

function buildDeskFocusEmptyState() {
  const t = getTexts();
  const empty = document.createElement("div");
  empty.className = "deskFocusEmpty";

  const title = document.createElement("strong");
  title.textContent = t.focusEmptyTitle;

  const text = document.createElement("p");
  text.textContent = t.focusEmptyText;

  const actionRow = document.createElement("div");
  actionRow.className = "deskActionRow";
  actionRow.appendChild(createDeskActionButton("open-panel", t.openPanelLabel, "", "primary"));
  actionRow.appendChild(createDeskActionButton("open-x", t.openXLabel, "", "accent"));

  empty.append(title, text, actionRow);
  return empty;
}


function createGrowthMetricCard(label, value, tone = "soft", meta = "") {
  const card = document.createElement("div");
  card.className = "growthMetricCard";
  card.dataset.tone = tone;

  const labelEl = document.createElement("span");
  labelEl.className = "growthMetricLabel";
  labelEl.textContent = label;

  const valueEl = document.createElement("strong");
  valueEl.className = "growthMetricValue";
  valueEl.textContent = value;

  const metaEl = document.createElement("span");
  metaEl.className = "growthMetricMeta";
  metaEl.textContent = meta;

  card.append(labelEl, valueEl, metaEl);
  return card;
}

function createGrowthTruthStrip(snapshot) {
  const strip = document.createElement("div");
  strip.className = "deskBoostSummary growthTruthStrip";
  const items = typeof GrowthCore?.buildGrowthTruthItems === "function"
    ? GrowthCore.buildGrowthTruthItems(snapshot)
    : [
        { key: "toClose", value: (snapshot.publishCounts?.ready || 0) + (snapshot.publishCounts?.partial || 0) + (snapshot.publishCounts?.failed || 0), tone: snapshot.operatorPressure ? "warning" : "soft" },
        { key: "authorBack", value: snapshot.pickupCounts?.authorEngaged || 0, tone: snapshot.pickupCounts?.authorEngaged ? "success" : "soft" },
        { key: "settled", value: snapshot.reviewCounts?.settled || 0, tone: snapshot.reviewCounts?.settled ? "success" : "soft" },
        { key: "reviewCoverage", value: Number(snapshot.checkedCoverage || 0), tone: Number(snapshot.checkedCoverage || 0) >= 70 ? "success" : Number(snapshot.checkedCoverage || 0) > 0 ? "accent" : "soft" }
      ];

  items.forEach((item) => {
    const content = getGrowthTruthItemContent(item);
    strip.appendChild(createDeskLedgerChip(content.label, content.value, item.tone || "soft"));
  });
  return strip;
}

function buildDraftCopyContext(candidate, draft = null) {
  const highlightList = getUserFacingCandidateHighlights(candidate, 3);
  const primaryHighlight = draft?.primaryHighlight || highlightList[0] || localize({
    "zh-Hans": "这个切口",
    "zh-Hant": "這個切口",
    en: "this angle",
    ja: "この切り口",
    ko: "이 포인트"
  });
  const secondaryHighlight = draft?.secondaryHighlight || highlightList[1] || primaryHighlight;
  const highlightLine = draft?.highlightLine || highlightList.slice(0, 2).join(localize({
    "zh-Hans": "、",
    "zh-Hant": "、",
    en: ", ",
    ja: "、",
    ko: ", "
  })) || primaryHighlight;
  const topic = draft?.topic || (Array.isArray(candidate?.matchedTopics) && candidate.matchedTopics.length
    ? getTopicLabel(candidate.matchedTopics[0])
    : formatDeskWindow(candidate?.mediaKind));
  const memoryTopic = draft?.memoryTopic || topic;
  const laneLabel = draft?.laneLabel || getCandidateLane(candidate).label;

  return {
    primaryHighlight,
    secondaryHighlight,
    highlightLine,
    topic,
    memoryTopic,
    laneLabel
  };
}

function buildToneVariantText(toneKey, draft, candidate, baseText) {
  if (!draft?.key || toneKey === "neutral") {
    return baseText;
  }

  const {
    primaryHighlight,
    secondaryHighlight,
    topic,
    memoryTopic
  } = buildDraftCopyContext(candidate, draft);

  switch (toneKey) {
    case "sharp":
      switch (draft.key) {
        case "memory":
          return localize({
            "zh-Hans": `如果继续往下接，我会直接抓 ${memoryTopic} 这层；${primaryHighlight} 明显比硬换新方向更有效。`,
            "zh-Hant": `如果繼續往下接，我會直接抓 ${memoryTopic} 這層；${primaryHighlight} 明顯比硬換新方向更有效。`,
            en: `If I keep pushing this, I would stay on the ${memoryTopic} layer. ${primaryHighlight} is plainly stronger than forcing a fresh angle for no reason.`,
            ja: `この先も取るなら、${memoryTopic} の層をそのまま押します。${primaryHighlight} は無理に新方向へ振るより明らかに強いです。`,
            ko: `계속 이어 간다면 ${memoryTopic} 층을 그대로 잡겠습니다. ${primaryHighlight} 는 억지로 새 각도로 트는 것보다 분명 더 강합니다.`
          });
        case "question":
          return localize({
            "zh-Hans": `真正该追问的是：把 ${primaryHighlight} 再推一步后，谁在决定后续走向？`,
            "zh-Hant": `真正該追問的是：把 ${primaryHighlight} 再推一步後，誰在決定後續走向？`,
            en: `The question is this: once ${primaryHighlight} moves one step further, who or what actually decides where this goes next?`,
            ja: `本当に問うべきは、${primaryHighlight} をもう一歩進めたあと、何が次の流れを決めるのかです。`,
            ko: `정말 물어야 할 건 이것입니다. ${primaryHighlight} 를 한 단계 더 밀었을 때 이후 흐름을 실제로 누가, 무엇이 결정하나요?`
          });
        case "bridge":
          return localize({
            "zh-Hans": `表层反应已经够多了，真正缺的是把 ${primaryHighlight} 放回 ${topic} 之后那一层说透。`,
            "zh-Hant": `表層反應已經夠多了，真正缺的是把 ${primaryHighlight} 放回 ${topic} 之後那一層說透。`,
            en: `There is already enough surface reaction. What is still missing is someone fully spelling out what ${primaryHighlight} becomes once you put it back inside ${topic}.`,
            ja: `表面の反応はもう十分あります。足りないのは、${primaryHighlight} を ${topic} の文脈へ戻したときに見える次の層を言い切ることです。`,
            ko: `겉반응은 이미 충분합니다. 부족한 것은 ${primaryHighlight} 를 ${topic} 맥락으로 돌려놓았을 때 보이는 다음 층을 끝까지 말해 주는 일입니다.`
          });
        case "contrast":
          return localize({
            "zh-Hans": `大家现在围着最显眼的一层打转，但更有价值的其实是 ${primaryHighlight}。那一层不会被一句结论说完。`,
            "zh-Hant": `大家現在圍著最顯眼的一層打轉，但更有價值的其實是 ${primaryHighlight}。那一層不會被一句結論說完。`,
            en: `Most people are circling the most visible layer, but the more valuable read is actually ${primaryHighlight}. That part cannot be exhausted in one clean conclusion.`,
            ja: `みんな一番目立つ層の周りを回っていますが、価値があるのはむしろ ${primaryHighlight} です。そこはひと言の結論で片づきません。`,
            ko: `지금 사람들은 가장 눈에 띄는 층만 맴돌고 있지만, 더 가치 있는 읽기는 ${primaryHighlight} 쪽입니다. 그 층은 한 줄 결론으로 끝나지 않습니다.`
          });
        case "perspective":
        default:
          return localize({
            "zh-Hans": `表层热度不是重点，${primaryHighlight} 才是这条真正还能继续长的地方。`,
            "zh-Hant": `表層熱度不是重點，${primaryHighlight} 才是這條真正還能繼續長的地方。`,
            en: `The surface heat is not the point here. ${primaryHighlight} is the part that can still keep growing this thread.`,
            ja: `表面の熱量は本題ではありません。${primaryHighlight} のほうが、この流れをまだ伸ばせる部分です。`,
            ko: `겉으로 보이는 화제성은 핵심이 아닙니다. ${primaryHighlight} 이야말로 이 흐름을 더 키울 수 있는 부분입니다.`
          });
      }
    case "warm":
      switch (draft.key) {
        case "memory":
          return localize({
            "zh-Hans": `我还挺想顺着 ${memoryTopic} 这层继续聊下去，尤其是 ${primaryHighlight} 这里，感觉还有空间慢慢展开。`,
            "zh-Hant": `我還挺想順著 ${memoryTopic} 這層繼續聊下去，尤其是 ${primaryHighlight} 這裡，感覺還有空間慢慢展開。`,
            en: `I would happily stay on the ${memoryTopic} layer here, especially around ${primaryHighlight}, because it still feels like there is room to open it up without forcing anything.`,
            ja: `${memoryTopic} の層をそのままやさしく続けたいです。特に ${primaryHighlight} には、無理なくもう少し広げられる余地があります。`,
            ko: `저는 ${memoryTopic} 층을 그대로 부드럽게 이어 가고 싶습니다. 특히 ${primaryHighlight} 쪽은 무리하지 않아도 더 펼칠 여지가 있어 보여요.`
          });
        case "question":
          return localize({
            "zh-Hans": `我会想顺手追问一句：如果把 ${primaryHighlight} 再往前带半步，你觉得接下来最关键的变量是什么？`,
            "zh-Hant": `我會想順手追問一句：如果把 ${primaryHighlight} 再往前帶半步，你覺得接下來最關鍵的變量是什麼？`,
            en: `I would want to ask one gentle follow-up: if ${primaryHighlight} moves half a step further, what do you think becomes the key variable from there?`,
            ja: `ひとつだけやわらかく聞きたいです。${primaryHighlight} を半歩進めるなら、その先で一番大きい変数は何になると思いますか。`,
            ko: `저는 한 가지만 부드럽게 더 묻고 싶어요. ${primaryHighlight} 를 반 걸음 더 밀면 그다음 가장 중요한 변수는 무엇이 될까요?`
          });
        case "bridge":
          return localize({
            "zh-Hans": `我更想补一句：表层反应已经有了，但 ${primaryHighlight} 放回 ${topic} 之后，其实还有一层可以慢慢聊。`,
            "zh-Hant": `我更想補一句：表層反應已經有了，但 ${primaryHighlight} 放回 ${topic} 之後，其實還有一層可以慢慢聊。`,
            en: `The part I would add is this: the surface reaction is already there, but once ${primaryHighlight} sits back inside ${topic}, there is still another layer worth talking through slowly.`,
            ja: `付け足すならここです。表面の反応はもうありますが、${primaryHighlight} を ${topic} の文脈へ戻すと、まだゆっくり話せる次の層があります。`,
            ko: `제가 덧붙이고 싶은 부분은 이거예요. 겉반응은 이미 있지만 ${primaryHighlight} 를 ${topic} 맥락으로 돌려놓으면 천천히 더 얘기할 다음 층이 남아 있습니다.`
          });
        case "contrast":
          return localize({
            "zh-Hans": `我会稍微从另一边接一下：最显眼的那层当然在，但 ${primaryHighlight} 这部分反而更耐聊。`,
            "zh-Hant": `我會稍微從另一邊接一下：最顯眼的那層當然在，但 ${primaryHighlight} 這部分反而更耐聊。`,
            en: `I would come in from a softer side angle here: the most visible layer is obviously there, but ${primaryHighlight} feels like the part with more staying power in conversation.`,
            ja: `少しだけ別側から入るなら、目立つ層はもちろんありますが、会話として長持ちするのはむしろ ${primaryHighlight} のほうです。`,
            ko: `저는 살짝 다른 쪽에서 들어갈 것 같아요. 눈에 띄는 층은 분명 있지만, 대화가 더 오래 가는 쪽은 오히려 ${primaryHighlight} 입니다.`
          });
        case "perspective":
        default:
          return localize({
            "zh-Hans": `我会顺着聊 ${primaryHighlight} 这一层，感觉它比表层热度更容易把讨论继续往下带。`,
            "zh-Hant": `我會順著聊 ${primaryHighlight} 這一層，感覺它比表層熱度更容易把討論繼續往下帶。`,
            en: `I would keep the conversation on ${primaryHighlight}, because that feels more likely to carry the thread forward than the surface heat alone.`,
            ja: `${primaryHighlight} の層をそのまま続けたいです。表面の熱量より、そのほうが会話を次へ運びやすい気がします。`,
            ko: `저는 ${primaryHighlight} 층을 그대로 이어 가고 싶습니다. 겉화제성보다 그쪽이 대화를 다음 단계로 더 잘 운반할 것 같아요.`
          });
      }
    case "short":
      switch (draft.key) {
        case "memory":
          return localize({
            "zh-Hans": `我会继续追 ${memoryTopic} 这层，${primaryHighlight} 明显还有空间。`,
            "zh-Hant": `我會繼續追 ${memoryTopic} 這層，${primaryHighlight} 明顯還有空間。`,
            en: `I would keep pushing the ${memoryTopic} layer here. ${primaryHighlight} clearly still has room.`,
            ja: `${memoryTopic} の層をそのまま追います。${primaryHighlight} にはまだ余地があります。`,
            ko: `${memoryTopic} 층을 그대로 밀고 가겠습니다. ${primaryHighlight} 에는 아직 공간이 있습니다.`
          });
        case "question":
          return localize({
            "zh-Hans": `更想追问一句：把 ${primaryHighlight} 再推一步后，真正决定走向的变量是什么？`,
            "zh-Hant": `更想追問一句：把 ${primaryHighlight} 再推一步後，真正決定走向的變量是什麼？`,
            en: `My real follow-up is simple: once ${primaryHighlight} moves one step further, what actually decides the direction from there?`,
            ja: `追問したいのはひとつです。${primaryHighlight} をもう一歩進めたあと、流れを決める変数は何ですか。`,
            ko: `제가 정말 묻고 싶은 건 하나예요. ${primaryHighlight} 를 한 걸음 더 밀었을 때 방향을 결정하는 변수는 무엇인가요?`
          });
        case "bridge":
          return localize({
            "zh-Hans": `表层反应已经出来了，我更想补的是 ${primaryHighlight} 放回 ${topic} 之后那层没展开的东西。`,
            "zh-Hant": `表層反應已經出來了，我更想補的是 ${primaryHighlight} 放回 ${topic} 之後那層沒展開的東西。`,
            en: `The surface reaction is already there. What I want to add is the layer around ${primaryHighlight} that still opens up once you put it back inside ${topic}.`,
            ja: `表面の反応はもう出ています。足したいのは、${primaryHighlight} を ${topic} に戻したときにまだ開く次の層です。`,
            ko: `겉반응은 이미 나왔습니다. 제가 보태고 싶은 건 ${primaryHighlight} 를 ${topic} 안으로 돌려놓았을 때 다시 열리는 다음 층입니다.`
          });
        case "contrast":
          return localize({
            "zh-Hans": `最显眼的不一定最值得聊，我反而觉得 ${primaryHighlight} 这层更有后劲。`,
            "zh-Hant": `最顯眼的不一定最值得聊，我反而覺得 ${primaryHighlight} 這層更有後勁。`,
            en: `The most visible layer is not always the one worth pursuing. ${primaryHighlight} feels like the part with more real afterlife.`,
            ja: `一番目立つ層が一番話す価値があるとは限りません。${primaryHighlight} のほうが後半に効きます。`,
            ko: `가장 눈에 띄는 층이 가장 이야기할 가치가 있는 건 아닙니다. ${primaryHighlight} 쪽이 더 오래 갑니다.`
          });
        case "perspective":
        default:
          return localize({
            "zh-Hans": `${primaryHighlight} 才是我更想继续聊的地方，表层热度反而没那么重要。`,
            "zh-Hant": `${primaryHighlight} 才是我更想繼續聊的地方，表層熱度反而沒那麼重要。`,
            en: `${primaryHighlight} is the part I would keep talking about. The surface heat matters less than that.`,
            ja: `続けて話したいのは ${primaryHighlight} のほうです。表面の熱量はそこまで本質ではありません。`,
            ko: `제가 계속 얘기하고 싶은 쪽은 ${primaryHighlight} 입니다. 겉화제성은 그보다 덜 중요합니다.`
          });
      }
    case "human":
      switch (draft.key) {
        case "memory":
          return localize({
            "zh-Hans": `我大概会直接接 ${memoryTopic} 这层，尤其是 ${primaryHighlight}，感觉这才是最容易把讨论继续往前带的一点。`,
            "zh-Hant": `我大概會直接接 ${memoryTopic} 這層，尤其是 ${primaryHighlight}，感覺這才是最容易把討論繼續往前帶的一點。`,
            en: `I would probably stay on the ${memoryTopic} layer, especially around ${primaryHighlight}. That is the part that feels easiest to carry forward naturally.`,
            ja: `自分なら ${memoryTopic} の層をそのまま取ります。特に ${primaryHighlight} は、自然に次へつなげやすい部分です。`,
            ko: `나라면 ${memoryTopic} 층을 그대로 잡을 것 같아요. 특히 ${primaryHighlight} 쪽이 자연스럽게 다음 얘기로 이어지기 좋습니다.`
          });
        case "question":
          return localize({
            "zh-Hans": `我第一反应其实是想问：把 ${primaryHighlight} 再往前推一点之后，真正会决定走向的变量是什么？`,
            "zh-Hant": `我第一反應其實是想問：把 ${primaryHighlight} 再往前推一點之後，真正會決定走向的變量是什麼？`,
            en: `My first reaction is honestly to ask this: once ${primaryHighlight} moves a little further, what really becomes the variable that decides the next turn?`,
            ja: `最初に浮かぶのはこの問いです。${primaryHighlight} を少し先へ進めたあと、次の流れを本当に決める変数は何でしょうか。`,
            ko: `제 첫 반응은 솔직히 이 질문이에요. ${primaryHighlight} 를 조금 더 밀었을 때 다음 흐름을 진짜로 결정하는 변수는 뭐가 될까요?`
          });
        case "bridge":
          return localize({
            "zh-Hans": `我会更想从 ${primaryHighlight} 这边接一句，表层反应已经够明显了，放回 ${topic} 之后反而还有东西能聊。`,
            "zh-Hant": `我會更想從 ${primaryHighlight} 這邊接一句，表層反應已經夠明顯了，放回 ${topic} 之後反而還有東西能聊。`,
            en: `I would probably reply from the ${primaryHighlight} side of it. The surface reaction is already obvious, but once it sits back inside ${topic}, there is still something to work with.`,
            ja: `自分なら ${primaryHighlight} 側からひと言入れます。表面の反応はもう十分見えていて、${topic} に戻したあとにこそ話せる余地があります。`,
            ko: `저라면 ${primaryHighlight} 쪽에서 한마디 시작할 것 같아요. 겉반응은 이미 충분히 보였고, ${topic} 안에 다시 놓았을 때 오히려 더 얘기할 게 생깁니다.`
          });
        case "contrast":
          return localize({
            "zh-Hans": `我反而觉得最值得接的是 ${primaryHighlight} 这里，后劲会更长一点。`,
            "zh-Hant": `我反而覺得最值得接的是 ${primaryHighlight} 這裡，後勁會更長一點。`,
            en: `I kind of think ${primaryHighlight} is the most reply-worthy part. That is the bit with more staying power.`,
            ja: `返す価値があるのはむしろ ${primaryHighlight} のほうだと思います。そちらのほうが後まで効きます。`,
            ko: `오히려 답글할 가치가 있는 건 ${primaryHighlight} 쪽이라고 봐요. 그쪽이 더 오래 갑니다.`
          });
        case "perspective":
        default:
          return localize({
            "zh-Hans": `我会先接 ${primaryHighlight} 这一层，表层热度大家都看到了，但真正能把讨论继续带下去的反而是这里。`,
            "zh-Hant": `我會先接 ${primaryHighlight} 這一層，表層熱度大家都看到了，但真正能把討論繼續帶下去的反而是這裡。`,
            en: `I would start with ${primaryHighlight}. Everyone can already see the surface heat, but this is the part that can actually keep the conversation moving.`,
            ja: `自分ならまず ${primaryHighlight} から入ります。表面の熱量はもう誰でも見えていますが、会話を本当に先へ動かせるのはここです。`,
            ko: `저는 ${primaryHighlight} 부터 잡을 것 같아요. 겉화제성은 이미 모두가 보고 있지만, 대화를 실제로 다음 단계로 밀어 주는 건 여기입니다.`
          });
      }
    default:
      return baseText;
  }
}

function transformDraftText(baseText, toneKey, draft, candidate) {
  return buildToneVariantText(toneKey, draft, candidate, baseText);
}

function buildRouteBundleLeadText(candidate, draft, toneKey = "neutral", activeRoute = null) {
  if (!draft?.key || !activeRoute?.voiceKey) {
    return "";
  }

  const {
    primaryHighlight,
    topic,
    memoryTopic
  } = buildDraftCopyContext(candidate, draft);

  switch (String(activeRoute.voiceKey || "").trim()) {
    case "memory":
      if (toneKey === "short") {
        return localize({
          "zh-Hans": `沿着 ${memoryTopic} 这条验证线接最顺。${primaryHighlight} 已经被接住过，补半步就够了。`,
          "zh-Hant": `沿著 ${memoryTopic} 這條驗證線接最順。${primaryHighlight} 已經被接住過，補半步就夠了。`,
          en: `Staying on the validated ${memoryTopic} line is the cleanest move. ${primaryHighlight} already got picked up once, so one more half-step is enough.`,
          ja: `検証済みの ${memoryTopic} 線をそのまま継ぐのがいちばん自然です。${primaryHighlight} は一度拾われているので、半歩足すだけで十分です。`,
          ko: `검증된 ${memoryTopic} 선을 그대로 타는 편이 가장 깔끔합니다. ${primaryHighlight} 는 이미 한 번 받아들여져서 반 걸음만 더하면 충분합니다.`
        });
      }
      if (toneKey === "human") {
        return localize({
          "zh-Hans": `这里就顺着 ${memoryTopic} 往下接。${primaryHighlight} 已经被接住过，再往前带半步就能把原来的互动续上。`,
          "zh-Hant": `這裡就順著 ${memoryTopic} 往下接。${primaryHighlight} 已經被接住過，再往前帶半步就能把原來的互動續上。`,
          en: `The cleanest way to take this is still to stay on the validated ${memoryTopic} line. ${primaryHighlight} already got picked up once, so another half-step can reconnect the original interaction.`,
          ja: `ここはやはり ${memoryTopic} の検証線をそのまま継ぐのが自然です。${primaryHighlight} は一度拾われているので、もう半歩で元の流れをつなぎ直せます。`,
          ko: `여기서는 ${memoryTopic} 검증선을 그대로 잇는 편이 가장 자연스럽습니다. ${primaryHighlight} 는 이미 한 번 반응이 붙어서 반 걸음만 더 밀면 원래 흐름을 다시 이어 붙일 수 있습니다.`
        });
      }
      return localize({
        "zh-Hans": `这里继续聊 ${memoryTopic} 就够了。${primaryHighlight} 已经被接住过，不用硬拐新话题。`,
        "zh-Hant": `這裡繼續聊 ${memoryTopic} 就夠了。${primaryHighlight} 已經被接住過，不用硬拐新話題。`,
        en: `The steadier move is still to stay on the validated ${memoryTopic} line. ${primaryHighlight} already found pickup there, so there is no need to force a fresh angle.`,
        ja: `より安定しているのは、${memoryTopic} の検証線をそのまま続けることです。${primaryHighlight} はすでに拾われているので、無理に新しい角度へ振る必要はありません。`,
        ko: `더 안정적인 선택은 ${memoryTopic} 검증선을 그대로 잇는 것입니다. ${primaryHighlight} 는 이미 반응이 붙었던 지점이라 억지로 새 각도로 틀 필요가 없습니다.`
      });
    case "question":
      if (toneKey === "human") {
        return localize({
          "zh-Hans": `我会先问清一件事：${primaryHighlight} 再往前走一点，哪个变量会先改掉后面的判断？`,
          "zh-Hant": `我會先問清一件事：${primaryHighlight} 再往前走一點，哪個變量會先改掉後面的判斷？`,
          en: `What really needs to get clarified is this: once ${primaryHighlight} moves a little further, which variable decides the next judgment first?`,
          ja: `本当に聞きたいのはここです。${primaryHighlight} がもう少し先へ進んだとき、次の判断を最初に決める変数は何でしょうか。`,
          ko: `정말 먼저 분명히 해야 할 건 이겁니다. ${primaryHighlight} 가 조금 더 앞으로 갔을 때 다음 판단을 먼저 결정하는 변수는 무엇일까요?`
        });
      }
      return localize({
        "zh-Hans": `别急着站队，先看 ${primaryHighlight} 往前推一步后，哪个变量最先改掉整条的走向？`,
        "zh-Hant": `別急著站隊，先看 ${primaryHighlight} 往前推一步後，哪個變量最先改掉整條的走向？`,
        en: `The key question is this: once ${primaryHighlight} moves one step further, what variable actually decides where it goes next?`,
        ja: `鍵になる問いは、${primaryHighlight} をもう一歩進めたあと、何が本当に次の流れを決めるのかです。`,
        ko: `핵심 질문은 이것입니다. ${primaryHighlight} 를 한 걸음 더 밀었을 때 무엇이 실제로 다음 방향을 결정하나요?`
      });
    case "bridge":
      if (toneKey === "warm") {
        return localize({
          "zh-Hans": `先把 ${primaryHighlight} 放回 ${topic} 这个语境里看，后面其实还有一层没展开。`,
          "zh-Hant": `先把 ${primaryHighlight} 放回 ${topic} 這個語境裡看，後面其實還有一層沒展開。`,
          en: `The surface reaction is already enough. Once ${primaryHighlight} goes back into the ${topic} context, there is still another layer that has not been opened yet.`,
          ja: `表面の反応はもう十分です。${primaryHighlight} を ${topic} の文脈へ戻すと、まだ開かれていない次の層が残っています。`,
          ko: `겉반응은 이미 충분합니다. ${primaryHighlight} 를 ${topic} 맥락으로 돌려놓으면 아직 열리지 않은 다음 층이 남아 있습니다.`
        });
      }
      return localize({
        "zh-Hans": `这里不用再补一个结论，把 ${primaryHighlight} 放回 ${topic} 后，那层没说透的东西自然就出来了。`,
        "zh-Hant": `這裡不用再補一個結論，把 ${primaryHighlight} 放回 ${topic} 後，那層沒說透的東西自然就出來了。`,
        en: `The part that can still carry this forward is not another conclusion. It is the layer around ${primaryHighlight} that still has not been fully said once it sits back inside ${topic}.`,
        ja: `ここでまだ前へ運べるのは、新しい結論ではありません。${primaryHighlight} を ${topic} に戻したあと、まだ言い切られていないその次の層です。`,
        ko: `여기서 더 앞으로 끌고 갈 수 있는 건 새로운 결론이 아닙니다. ${primaryHighlight} 를 ${topic} 안에 다시 놓았을 때 아직 다 말해지지 않은 그 다음 층입니다.`
      });
    case "contrast":
      if (toneKey === "sharp") {
        return localize({
          "zh-Hans": `大家都在讲表面那层了，倒是 ${primaryHighlight} 更值得接，不是一眼就说完的那种结论。`,
          "zh-Hant": `大家都在講表面那層了，倒是 ${primaryHighlight} 更值得接，不是一眼就說完的那種結論。`,
          en: `The surface consensus is already crowded enough. ${primaryHighlight} is the part worth touching, not the conclusion everyone can finish in one glance.`,
          ja: `表面の合意はもう十分に混んでいます。触る価値があるのは ${primaryHighlight} で、ひと言で終わる結論ではありません。`,
          ko: `표면 합의는 이미 충분히 붐빕니다. 건드릴 가치가 있는 건 ${primaryHighlight} 쪽이지 한눈에 끝나는 결론이 아닙니다.`
        });
      }
      return localize({
        "zh-Hans": `最显眼那层已经有人说了，换成接 ${primaryHighlight} 会更有后劲。`,
        "zh-Hant": `最顯眼那層已經有人說了，換成接 ${primaryHighlight} 會更有後勁。`,
        en: `People are already covering the most visible layer. ${primaryHighlight} is the part more worth replying to because it carries further than the surface conclusion.`,
        ja: `いちばん目立つ層はもう誰かが話しています。返す価値があるのはむしろ ${primaryHighlight} で、表面結論より後まで効きます。`,
        ko: `가장 눈에 띄는 층은 이미 누군가 말하고 있습니다. 더 답글할 가치가 있는 건 ${primaryHighlight} 쪽이고, 표면 결론보다 더 오래 갑니다.`
      });
    case "direct":
      if (toneKey === "sharp") {
        return localize({
          "zh-Hans": `这条里直接点出 ${primaryHighlight} 就够了。表层热度大家都看到了，真正能往下聊的是这一层。`,
          "zh-Hant": `這條裡直接點出 ${primaryHighlight} 就夠了。表層熱度大家都看到了，真正能往下聊的是這一層。`,
          en: `${primaryHighlight} is the part that deserves to be said directly here. Everyone can already see the surface heat, but this is the layer that actually carries the discussion forward.`,
          ja: `ここで直に言うべきなのは ${primaryHighlight} です。表面の熱量はもう見えていて、議論を先へ運ぶのはこの層です。`,
          ko: `여기서 바로 말해야 할 건 ${primaryHighlight} 입니다. 겉열기는 이미 보였고, 대화를 앞으로 끌고 가는 건 이 층입니다.`
        });
      }
      if (toneKey === "human") {
        return localize({
          "zh-Hans": `真要继续往下聊，我会接 ${primaryHighlight}。比起表层热度，这层更容易把讨论带下去。`,
          "zh-Hant": `真要繼續往下聊，我會接 ${primaryHighlight}。比起表層熱度，這層更容易把討論帶下去。`,
          en: `The part actually worth continuing is ${primaryHighlight}. Not the surface heat, but where this layer takes the discussion next.`,
          ja: `本当に続けて話す価値があるのは ${primaryHighlight} です。表面の熱量ではなく、この層が議論をどこへ運ぶかのほうです。`,
          ko: `계속 얘기할 가치가 있는 건 ${primaryHighlight} 입니다. 겉열기보다 이 층이 대화를 어디로 데려가는지가 더 중요합니다.`
        });
      }
      return localize({
        "zh-Hans": `直接接 ${primaryHighlight} 就行，这一层本来就更容易把讨论往下带。`,
        "zh-Hant": `直接接 ${primaryHighlight} 就行，這一層本來就更容易把討論往下帶。`,
        en: `The part worth answering directly is ${primaryHighlight}. It is also the layer that can keep the discussion moving.`,
        ja: `直に返す価値があるのは ${primaryHighlight} です。議論をそのまま動かせるのもこの層です。`,
        ko: `바로 답할 가치가 있는 건 ${primaryHighlight} 입니다. 대화를 계속 움직이게 하는 것도 이 층입니다.`
      });
    default:
      return "";
  }
}

function getDraftSourceKey(candidate, draft, toneKey = uiState.draftTone) {
  return [
    candidate?.url || "no-candidate",
    draft?.key || "no-draft",
    toneKey,
    uiState.draftRouteKey || "no-route",
    uiState.draftStarterIndex,
    uiState.draftBodyIndex,
    uiState.draftCloserIndex
  ].join(":");
}

function stripDraftLeadClause(text) {
  const source = String(text || "").trim();
  if (!source) {
    return "";
  }
  const maxLeadSpan = Math.min(38, source.length);
  const delimiters = ["：", ":", "，", ","];
  let cutIndex = -1;
  for (let i = 0; i < maxLeadSpan; i += 1) {
    if (delimiters.includes(source[i])) {
      cutIndex = i;
      break;
    }
  }
  if (cutIndex === -1) {
    return source;
  }
  return source.slice(cutIndex + 1).trim();
}

function insertDraftMiddleLine(text, addition) {
  const source = String(text || "").trim();
  const extra = String(addition || "").trim();
  if (!source) {
    return extra;
  }
  if (!extra) {
    return source;
  }
  const match = source.match(/^([\s\S]+?[。！？!?\.])(\s*)([\s\S]*)$/u);
  if (!match) {
    return `${source} ${extra}`.trim();
  }
  const lead = String(match[1] || "").trim();
  const tail = String(match[3] || "").trim();
  return [lead, extra, tail].filter(Boolean).join(" ");
}

function appendDraftCloserLine(text, closer) {
  const source = String(text || "").trim();
  const tail = String(closer || "").trim();
  if (!source) {
    return tail;
  }
  if (!tail) {
    return source;
  }
  return `${source} ${tail}`.trim();
}

function hasCjkDraftText(text) {
  return /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]/u.test(String(text || ""));
}

function splitDraftSentences(text) {
  const source = String(text || "").trim().replace(/\s+/g, " ");
  if (!source) {
    return [];
  }
  const matches = source.match(/[^。！？!?\.]+[。！？!?\.]?/gu);
  return (matches && matches.length ? matches : [source])
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function normalizeReplyReadySentence(sentence, cjk = hasCjkDraftText(sentence)) {
  let next = String(sentence || "").trim().replace(/\s+/g, " ");
  if (!next) {
    return "";
  }

  const replacements = cjk
    ? [
        [/^我会先直接给个判断[:：]\s*/u, ""],
        [/^我会直接给个判断[:：]\s*/u, ""],
        [/^我更想先问一句[:：]\s*/u, ""],
        [/^我第一反应(?:其实)?是想问[:：]\s*/u, ""],
        [/^我更想补一句[:：]\s*/u, ""],
        [/^我只想补一层[:：]\s*/u, ""],
        [/^我只想补一句[:：]\s*/u, ""],
        [/^我会先问清一件事[:：]\s*/u, ""],
        [/^我会先问一句[:：]\s*/u, ""],
        [/^我更想追问一句[:：]\s*/u, ""],
        [/^我反而不会接最显眼的那层[。！？!?]*/u, "最显眼的那层未必最值得接。"],
        [/^我会直接沿\s*(.+?)\s*这条验证线接，不另起一题[。！？!?]*/u, "沿 $1 这条验证线接就够了。"],
        [/^如果继续往下接，我会直接抓\s*(.+?)\s*这层；/u, "$1 这层更值得继续追，"],
        [/^我会更想从\s*(.+?)\s*这边接一句，/u, "$1 这边更值得接，"],
        [/^我大概会直接接\s*/u, ""],
        [/^我会顺着聊\s*/u, ""],
        [/^我会先接\s*/u, ""],
        [/^我会继续追\s*/u, ""],
        [/^我会直接接\s*/u, ""],
        [/^我反而觉得/u, ""],
        [/^我更想/u, ""],
        [/^我只想/u, ""],
        [/^我大概会/u, ""],
        [/^我会/u, ""],
        [/真正能把讨论带下去的是这一层/u, "这层更能把讨论带下去"],
        [/真正会卡住后续判断的那个变量到底是什么/u, "真正决定后续走向的变量是什么"],
        [/也更像真人顺手接话/u, ""],
        [/也更像真人回复/u, ""],
        [/更像真人顺手接话/u, ""],
        [/更像真人回复/u, ""],
        [/不像模板/u, ""],
        [/不像说明文/u, ""]
      ]
    : [
        [/^I would open with a direct take:\s*/i, ""],
        [/^The question I want first is this:\s*/i, ""],
        [/^The part I would add is this:\s*/i, ""],
        [/^I would stay on the validated\s*/i, "Stay on the validated "],
        [/^I would not reply to the loudest layer first\.\s*/i, "The loudest layer is not always the one worth answering first. "],
        [/^I would probably /i, ""],
        [/^I would /i, ""],
        [/sounds more like a real human reply/gi, ""],
        [/without sounding templated/gi, ""]
      ];

  replacements.forEach(([pattern, replacement]) => {
    next = next.replace(pattern, replacement);
  });

  next = next
    .replace(/\s{2,}/g, " ")
    .replace(/^[，,、;；:：\s]+/u, "")
    .replace(/[，,、;；]\s*([。！？!?])$/u, "$1")
    .trim();

  if (!next) {
    return "";
  }
  if (cjk && !/[。！？!?]$/u.test(next)) {
    next += "。";
  } else if (!cjk && !/[.!?]$/u.test(next)) {
    next += ".";
  }
  return next;
}

function shouldDropReplyReadySentence(sentence) {
  const source = String(sentence || "").trim();
  if (!source) {
    return true;
  }
  return [
    /更像真人/u,
    /不像模板/u,
    /不像说明/u,
    /real human reply/i,
    /templated/i
  ].some((pattern) => pattern.test(source));
}

function buildReplyReadyComposerText(text) {
  const source = String(text || "").trim();
  if (!source) {
    return "";
  }
  const cjk = hasCjkDraftText(source);
  const normalized = splitDraftSentences(source)
    .map((sentence) => normalizeReplyReadySentence(sentence, cjk))
    .filter(Boolean);

  const filtered = [];
  normalized.forEach((sentence) => {
    if (shouldDropReplyReadySentence(sentence) && normalized.length > 1) {
      return;
    }
    if (filtered.includes(sentence)) {
      return;
    }
    filtered.push(sentence);
  });

  const selected = filtered.length ? filtered.slice(0, 2) : [normalizeReplyReadySentence(source, cjk)].filter(Boolean);
  let result = selected.join(" ").trim();
  const maxLength = cjk ? 118 : 220;
  if (selected.length > 1 && result.length > maxLength) {
    result = selected[0];
  }
  if (result.length > maxLength) {
    result = `${result.slice(0, maxLength).replace(/[，,、;；:：\s]+$/u, "").trim()}${cjk ? "。" : "."}`;
  }
  return result || source;
}

function isInternalDraftHighlight(text) {
  const source = String(text || "").trim().replace(/\s+/g, " ");
  if (!source) {
    return true;
  }

  return [
    /[+-]\s*\d+(?:\.\d+)?/u,
    /\b(?:freshness|reply room|author memory|mutual lane|for you|following|reach likelihood|understanding confidence|author fit|final score|broadcast account|vision_required_but_missing|vision_required|ocr_required|ocr|score|boost|penalty)\b/i,
    /(?:新鲜度|新鮮度|回复空间|回覆空間|作者记忆|作者記憶|互关线|互關線|推荐流|推薦流|关注流|關注流|触达概率|觸達概率|理解置信|理解信心|作者匹配|最终得分|最終得分|广播账号|廣播賬號|媒体缺义|媒體缺義|视觉缺失|視覺缺失|需要视觉|需要視覺|降权|降權|惩罚|懲罰|打分|評分)/u,
    /\b[a-z0-9]+(?:_[a-z0-9]+)+\b/i
  ].some((pattern) => pattern.test(source));
}

function getDraftHighlightFallback(candidate) {
  const topic = Array.isArray(candidate?.matchedTopics) && candidate.matchedTopics.length
    ? getTopicLabel(candidate.matchedTopics[0])
    : "";
  if (topic) {
    return localize({
      "zh-Hans": `${topic} 这层`,
      "zh-Hant": `${topic} 這層`,
      en: `${topic} here`,
      ja: `${topic} の層`,
      ko: `${topic} 이 층`
    });
  }

  const mediaKind = String(candidate?.mediaKind || "").trim().toLowerCase();
  if (["image", "photo", "video", "gif", "mixed"].includes(mediaKind)) {
    const mediaLabel = formatDeskMediaKind(mediaKind);
    return localize({
      "zh-Hans": `${mediaLabel} 这层`,
      "zh-Hant": `${mediaLabel} 這層`,
      en: `the ${String(mediaLabel || "").toLowerCase()} angle`,
      ja: `${mediaLabel} の切り口`,
      ko: `${mediaLabel} 쪽 포인트`
    });
  }

  return localize({
    "zh-Hans": "这层讨论",
    "zh-Hant": "這層討論",
    en: "this part of the discussion",
    ja: "この論点",
    ko: "이 대화 층"
  });
}

function getUserFacingCandidateHighlights(candidate, limit = 3) {
  const seen = new Set();
  const list = (Array.isArray(candidate?.highlights) ? candidate.highlights : [])
    .map((highlight) => String(highlight || "").trim())
    .filter((highlight) => {
      if (!highlight || isInternalDraftHighlight(highlight)) {
        return false;
      }
      const key = highlight.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(1, Number(limit) || 0));

  return list.length ? list : [getDraftHighlightFallback(candidate)];
}

function getDraftContext(candidate, attributionSummary = null) {
  const highlightList = getUserFacingCandidateHighlights(candidate, 3);
  const fallbackHighlight = localize({
    "zh-Hans": "这层切口",
    "zh-Hant": "這層切口",
    en: "this angle",
    ja: "この切り口",
    ko: "이 각도"
  });
  const primaryHighlight = highlightList[0] || fallbackHighlight;
  const secondaryHighlight = highlightList[1] || primaryHighlight;
  const topic = Array.isArray(candidate?.matchedTopics) && candidate.matchedTopics.length
    ? getTopicLabel(candidate.matchedTopics[0])
    : formatDeskWindow(candidate?.mediaKind);
  const memoryTopic = attributionSummary?.topicKey ? getTopicLabel(attributionSummary.topicKey) : topic;
  const lane = getCandidateLane(candidate).label;
  const handle = candidate?.authorHandle ? `@${candidate.authorHandle}` : localize({
    "zh-Hans": "原帖作者",
    "zh-Hant": "原貼作者",
    en: "the author",
    ja: "元投稿の相手",
    ko: "원글 작성자"
  });
  return {
    primaryHighlight,
    secondaryHighlight,
    topic,
    memoryTopic,
    lane,
    handle,
    reviewed: Math.max(0, Number(attributionSummary?.reviewed || 0)),
    memoryStrong: Number(attributionSummary?.authorEngaged || 0) > 0 || Number(attributionSummary?.pickedUp || 0) > 0
  };
}

function getDraftToneLabel(toneKey = "neutral") {
  const tone = DRAFT_TONE_DEFS.find((item) => item.key === toneKey) || DRAFT_TONE_DEFS[0];
  return localize(tone.label);
}

function getDraftRouteUiDefinition(routeKey = "") {
  switch (String(routeKey || "").trim()) {
    case "memory-line":
      return {
        title: {
          "zh-Hans": "沿验证记忆接",
          "zh-Hant": "沿驗證記憶接",
          en: "Follow validated memory",
          ja: "実績記憶を継ぐ",
          ko: "검증된 기억선 타기"
        },
        toneChip: "success"
      };
    case "key-question":
      return {
        title: {
          "zh-Hans": "先追关键变量",
          "zh-Hant": "先追關鍵變量",
          en: "Chase the key variable",
          ja: "先に変数を問う",
          ko: "핵심 변수를 먼저 묻기"
        },
        toneChip: "warning"
      };
    case "soft-contrast":
      return {
        title: {
          "zh-Hans": "轻反差切入",
          "zh-Hant": "輕反差切入",
          en: "Enter with soft contrast",
          ja: "軽い対比で入る",
          ko: "가벼운 반차이로 들어가기"
        },
        toneChip: "accent"
      };
    case "add-one-layer":
      return {
        title: {
          "zh-Hans": "先补一层",
          "zh-Hant": "先補一層",
          en: "Add one more layer",
          ja: "もう一層足す",
          ko: "한 층 더 보태기"
        },
        toneChip: "success"
      };
    case "direct-take":
    default:
      return {
        title: {
          "zh-Hans": "直接给观点",
          "zh-Hant": "直接給觀點",
          en: "Give the take directly",
          ja: "見方を直で出す",
          ko: "관점을 바로 던지기"
        },
        toneChip: "accent"
      };
  }
}

function getDraftRouteSignalLabel(reasonKey = "") {
  switch (String(reasonKey || "").trim()) {
    case "author-back":
      return localize({ "zh-Hans": "作者回流", "zh-Hant": "作者回流", en: "Author back", ja: "作者再参加", ko: "작성자 재참여" });
    case "picked-up":
      return localize({ "zh-Hans": "已被接住", "zh-Hant": "已被接住", en: "Picked up", ja: "反応あり", ko: "반응 있음" });
    case "reviewed-memory":
      return localize({ "zh-Hans": "已复查", "zh-Hant": "已複查", en: "Reviewed memory", ja: "再確認済み", ko: "재확인됨" });
    case "reviewed-quiet":
      return localize({ "zh-Hans": "复查后偏安静", "zh-Hant": "複查後偏安靜", en: "Reviewed but quiet", ja: "再確認後は静か", ko: "재확인 후 조용함" });
    case "memory-priority":
      return localize({ "zh-Hans": "记忆优先", "zh-Hant": "記憶優先", en: "Memory priority", ja: "記憶優先", ko: "기억 우선" });
    case "memory-proof":
      return localize({ "zh-Hans": "已有验证", "zh-Hant": "已有驗證", en: "Validated", ja: "検証あり", ko: "검증 있음" });
    case "acceleration-window":
      return localize({ "zh-Hans": "还在加速", "zh-Hant": "還在加速", en: "Still accelerating", ja: "まだ加速中", ko: "아직 가속 중" });
    case "proven-reach":
      return localize({ "zh-Hans": "已经起量", "zh-Hant": "已經起量", en: "Reach already proven", ja: "到達が立ち上がった", ko: "이미 도달이 붙음" });
    case "unique-angle-window":
      return localize({ "zh-Hans": "该给新观点", "zh-Hant": "該給新觀點", en: "Needs a real take", ja: "新しい見方向き", ko: "새 관점을 줄 타이밍" });
    case "community-thread":
      return localize({ "zh-Hans": "回聊空间", "zh-Hant": "回聊空間", en: "Conversation room", ja: "会話の余白", ko: "되받아칠 공간" });
    case "live-window":
      return localize({ "zh-Hans": "即刻窗口", "zh-Hant": "即刻窗口", en: "Live window", ja: "今の窓", ko: "지금 창" });
    case "fresh-window":
      return localize({ "zh-Hans": "还新鲜", "zh-Hant": "還新鮮", en: "Fresh", ja: "まだ新しい", ko: "아직 신선함" });
    case "high-score":
      return localize({ "zh-Hans": "高分候选", "zh-Hant": "高分候選", en: "High score", ja: "高スコア", ko: "고득점" });
    case "workable-score":
      return localize({ "zh-Hans": "可出手", "zh-Hant": "可出手", en: "Workable", ja: "手が出せる", ko: "바로 가능" });
    case "next-slot":
      return localize({ "zh-Hans": "建议下一轮", "zh-Hant": "建議下一輪", en: "Next-up slot", ja: "次枠向き", ko: "다음 차례" });
    case "clean-entry":
      return localize({ "zh-Hans": "入口干净", "zh-Hant": "入口乾淨", en: "Clean entry", ja: "入口がきれい", ko: "입구가 깔끔함" });
    case "still-open":
      return localize({ "zh-Hans": "窗口还开着", "zh-Hant": "窗口還開著", en: "Window still open", ja: "まだ窓がある", ko: "창이 아직 열림" });
    case "crowded-thread":
      return localize({ "zh-Hans": "线程有密度", "zh-Hant": "線程有密度", en: "Dense thread", ja: "密度あるスレッド", ko: "스레드 밀도 높음" });
    case "thread-moving":
      return localize({ "zh-Hans": "线程在动", "zh-Hant": "線程在動", en: "Thread moving", ja: "スレッド進行中", ko: "스레드가 움직임" });
    case "slower-window":
      return localize({ "zh-Hans": "慢窗口更适合", "zh-Hant": "慢窗口更適合", en: "Better in slower window", ja: "遅い窓向き", ko: "느린 창에 맞음" });
    case "slower-slot":
      return localize({ "zh-Hans": "低压档位", "zh-Hant": "低壓檔位", en: "Lower-pressure slot", ja: "低圧スロット", ko: "저압 슬롯" });
    case "open-variable":
      return localize({ "zh-Hans": "关键变量", "zh-Hant": "關鍵變量", en: "Key variable", ja: "決定変数", ko: "핵심 변수" });
    case "older-window":
      return localize({ "zh-Hans": "适合深一点", "zh-Hant": "適合深一點", en: "Go deeper", ja: "深掘り向き", ko: "더 깊게 가기" });
    case "crowded-consensus":
      return localize({ "zh-Hans": "表面共识多", "zh-Hant": "表面共識多", en: "Consensus is crowded", ja: "表面合意が多い", ko: "표면 합의 많음" });
    case "low-memory":
      return localize({ "zh-Hans": "别走模板线", "zh-Hant": "別走模板線", en: "Avoid template line", ja: "テンプレ回避", ko: "템플릿 회피" });
    case "tomorrow-slot":
      return localize({ "zh-Hans": "明早档位", "zh-Hant": "明早檔位", en: "Tomorrow slot", ja: "明朝枠", ko: "내일 아침 슬롯" });
    case "tonight-slot":
      return localize({ "zh-Hans": "今晚档位", "zh-Hant": "今晚檔位", en: "Tonight slot", ja: "今夜枠", ko: "오늘 밤 슬롯" });
    case "extend-thread":
      return localize({ "zh-Hans": "补层更顺", "zh-Hant": "補層更順", en: "Extend, don't pivot", ja: "補足で伸ばす", ko: "보태는 편이 자연스러움" });
    default:
      return localize({ "zh-Hans": "当前匹配", "zh-Hant": "目前匹配", en: "Current fit", ja: "今の適合", ko: "현재 적합" });
  }
}

function buildDraftRoutePlaybookText(starterLabel = "", bodyLabel = "", closerLabel = "") {
  const starter = String(starterLabel || "").trim();
  const body = String(bodyLabel || "").trim();
  const closer = String(closerLabel || "").trim();
  if (!starter && !body && !closer) {
    return "";
  }
  return localize({
    "zh-Hans": `起手：${starter || "默认"} · 推进：${body || "默认"} · 收尾：${closer || "默认"}`,
    "zh-Hant": `起手：${starter || "預設"} · 推進：${body || "預設"} · 收尾：${closer || "預設"}`,
    en: `Open: ${starter || "Default"} · Build: ${body || "Default"} · Close: ${closer || "Default"}`,
    ja: `入り: ${starter || "既定"} · 展開: ${body || "既定"} · 締め: ${closer || "既定"}`,
    ko: `시작: ${starter || "기본"} · 전개: ${body || "기본"} · 마무리: ${closer || "기본"}`
  });
}

function isDraftQuestionLine(text = "") {
  return /[?？]\s*$/u.test(String(text || "").trim());
}

function normalizeDraftLineFingerprint(text = "") {
  return String(text || "")
    .toLowerCase()
    .replace(/[。！？!?.,，：:\s]/gu, "")
    .trim();
}

function dedupeDraftLines(lines = []) {
  const seen = new Set();
  return lines.filter((line) => {
    const value = String(line || "").trim();
    if (!value) {
      return false;
    }
    const fingerprint = normalizeDraftLineFingerprint(value);
    if (!fingerprint || seen.has(fingerprint)) {
      return false;
    }
    seen.add(fingerprint);
    return true;
  });
}

function composeRouteBundleDraft(baseText, bodyText = "", closerText = "", route = null) {
  const lead = String(baseText || "").trim();
  const middle = String(bodyText || "").trim();
  const closer = String(closerText || "").trim();
  const profile = route || {};
  const target = Math.max(1, Math.min(3, Number(profile.sentenceTarget || 3)));
  const voiceKey = String(profile.voiceKey || "default").trim();
  const preferQuestionClose = Boolean(profile.preferQuestionClose);
  const bodyFirstVoices = new Set(["direct", "contrast", "bridge", "memory"]);

  const selected = [];
  if (lead) {
    selected.push(lead);
  }

  if (preferQuestionClose && isDraftQuestionLine(closer)) {
    if (target >= 3 && middle) {
      selected.push(middle);
    }
    selected.push(closer);
    return dedupeDraftLines(selected).slice(0, target).join(" ").trim();
  }

  if (bodyFirstVoices.has(voiceKey)) {
    if (middle) {
      selected.push(middle);
    }
    if (target >= 3 && closer) {
      selected.push(closer);
    } else if (!middle && closer) {
      selected.push(closer);
    }
    return dedupeDraftLines(selected).slice(0, target).join(" ").trim();
  }

  if (middle) {
    selected.push(middle);
  }
  if (closer) {
    selected.push(closer);
  }

  return dedupeDraftLines(selected).slice(0, target).join(" ").trim();
}

function buildRouteBundleBodyText(candidate, attributionSummary = null, toneKey = "neutral", activeRoute = null) {
  if (!activeRoute?.voiceKey) {
    return "";
  }

  const context = getDraftContext(candidate, attributionSummary);
  switch (String(activeRoute.voiceKey || "").trim()) {
    case "memory":
      if (toneKey === "human" || toneKey === "short") {
        return localize({
          "zh-Hans": `${context.primaryHighlight} 这层之前就有人接过，所以顺着它接一句就够了。`,
          "zh-Hant": `${context.primaryHighlight} 這層之前就有人接過，所以順著它接一句就夠了。`,
          en: `${context.primaryHighlight} already got picked up before, so staying on that line is enough here.`,
          ja: `この線の価値は、${context.primaryHighlight} がここで初めて拾われるわけではない点にあります。`,
          ko: `이 선의 값은 ${context.primaryHighlight} 가 여기서 처음 반응을 받는 게 아니라는 데 있습니다.`
        });
      }
      return localize({
        "zh-Hans": `继续把重点压在 ${context.primaryHighlight} 上，会比中途换线自然得多。`,
        "zh-Hant": `繼續把重點壓在 ${context.primaryHighlight} 上，會比中途換線自然得多。`,
        en: `Keeping the weight on ${context.primaryHighlight} is much more natural than switching lines halfway through.`,
        ja: `${context.primaryHighlight} に重心を置いたまま進めるほうが、途中で線を変えるより自然です。`,
        ko: `${context.primaryHighlight} 에 계속 무게를 두는 편이 중간에 선을 바꾸는 것보다 훨씬 자연스럽습니다.`
      });
    case "question":
      if (toneKey === "human") {
        return localize({
          "zh-Hans": `这个先问清，后面到底是在吵结果还是过程就会清楚很多。`,
          "zh-Hant": `這個先問清，後面到底是在吵結果還是過程就會清楚很多。`,
          en: `Once that gets clarified, it becomes much clearer whether people are really arguing about the result or the process.`,
          ja: `ここを先に聞いておくと、その後の食い違いがどの層に落ちるのか見えてきます。`,
          ko: `이걸 먼저 분명히 해야 이후 엇갈림이 어느 층에 떨어지는지 보입니다.`
        });
      }
      return localize({
        "zh-Hans": `因为只要这个变量一换，整件事的读法就会跟着变。`,
        "zh-Hant": `因為只要這個變量一換，整件事的讀法就會跟著變。`,
        en: `Because once that variable shifts, the whole read on this changes with it.`,
        ja: `その変数が変わるだけで、全体の見え方まで一緒に変わるからです。`,
        ko: `그 변수가 바뀌는 순간 전체 상황을 읽는 방식도 같이 바뀌기 때문입니다.`
      });
    case "bridge":
      if (toneKey === "warm") {
        return localize({
          "zh-Hans": `${context.secondaryHighlight} 一补上，这条就不会只剩表面反应那一层。`,
          "zh-Hant": `${context.secondaryHighlight} 一補上，這條就不會只剩表面反應那一層。`,
          en: `Once ${context.secondaryHighlight} gets added back in, the post stops living only on the surface reaction layer.`,
          ja: `${context.secondaryHighlight} を戻すだけで、元投稿は表面反応の周りを回るだけではなくなります。`,
          ko: `${context.secondaryHighlight} 만 보태도 원문은 표면 반응만 맴돌지 않게 됩니다.`
        });
      }
      return localize({
        "zh-Hans": `${context.secondaryHighlight} 不是补一句背景，它会直接改掉后面怎么看这条。`,
        "zh-Hant": `${context.secondaryHighlight} 不是補一句背景，它會直接改掉後面怎麼看這條。`,
        en: `${context.secondaryHighlight} is not just extra context. It changes how the rest of this should be read.`,
        ja: `${context.secondaryHighlight} は補足ではなく、その後の読み方そのものを変える要素です。`,
        ko: `${context.secondaryHighlight} 는 단순 보충이 아니라 이후 해석 자체를 바꾸는 요소입니다.`
      });
    case "contrast":
      if (toneKey === "sharp") {
        return localize({
          "zh-Hans": `能拉开差距的，往往是 ${context.secondaryHighlight} 这段还没人讲透。`,
          "zh-Hant": `能拉開差距的，往往是 ${context.secondaryHighlight} 這段還沒人講透。`,
          en: `The part that actually creates contrast is the piece around ${context.secondaryHighlight} that still has not been fully unpacked.`,
          ja: `本当に差がつくのは、${context.secondaryHighlight} のまだ言い切られていない部分です。`,
          ko: `정말 차이를 만드는 건 ${context.secondaryHighlight} 주변에서 아직 끝까지 말해지지 않은 부분입니다.`
        });
      }
      return localize({
        "zh-Hans": `所以就接那层还没被说透的部分，比跟着重复表面共识更有用。`,
        "zh-Hant": `所以就接那層還沒被說透的部分，比跟著重複表面共識更有用。`,
        en: `So the part worth touching is the layer that still has not been fully unpacked, not the visible consensus itself.`,
        ja: `だから返す価値があるのは、見えている総意そのものではなく、まだ言い切られていない層のほうです。`,
        ko: `그래서 건드릴 가치가 있는 건 보이는 합의 자체가 아니라 아직 다 풀리지 않은 층입니다.`
      });
    case "direct":
      if (toneKey === "human") {
        return localize({
          "zh-Hans": `如果继续往下聊，后面的分歧大概率也会从这里冒出来。`,
          "zh-Hant": `如果繼續往下聊，後面的分歧大概率也會從這裡冒出來。`,
          en: `If the thread keeps going, the next real disagreement probably grows from this exact point.`,
          ja: `このまま続けば、次の本当の分岐もたぶんここから生まれます。`,
          ko: `이 흐름이 계속되면 다음 진짜 갈림도 아마 여기서 생겨날 겁니다.`
        });
      }
      return localize({
        "zh-Hans": `后面真要分叉，多半也是从这里开始。`,
        "zh-Hant": `後面真要分叉，多半也是從這裡開始。`,
        en: `This is also probably the point where the conversation actually splits if it keeps going.`,
        ja: `この先で本当に議論が分かれる地点も、おそらくここです。`,
        ko: `이후 대화가 실제로 갈라질 지점도 아마 여기일 가능성이 큽니다.`
      });
    default:
      return "";
  }
}

function buildRouteBundleCloserText(candidate, attributionSummary = null, toneKey = "neutral", activeRoute = null) {
  if (!activeRoute?.voiceKey) {
    return "";
  }

  const context = getDraftContext(candidate, attributionSummary);
  switch (String(activeRoute.voiceKey || "").trim()) {
    case "memory":
      return activeRoute.preferQuestionClose
        ? localize({
            "zh-Hans": `如果顺着这层继续聊，你会先接哪一段？`,
            "zh-Hant": `如果順著這層繼續聊，你會先接哪一段？`,
            en: `If you keep following this layer, which part would you pick up first?`,
            ja: `この層をそのまま追うなら、どこから先に拾いますか。`,
            ko: `이 층을 그대로 이어 간다면 어느 부분부터 먼저 잡으시겠어요?`
          })
        : localize({
            "zh-Hans": `顺着这条线接下去，比临时换题自然得多。`,
            "zh-Hant": `順著這條線接下去，比臨時換題自然得多。`,
            en: `Following this line from here is much steadier than reopening the topic from scratch.`,
            ja: `この検証線をそのまま継ぐほうが、話題を開き直すよりずっと安定します。`,
            ko: `이 검증선을 그대로 잇는 편이 주제를 새로 여는 것보다 훨씬 안정적입니다.`
          });
    case "question":
      return localize({
        "zh-Hans": `你会先看哪个变量？`,
        "zh-Hant": `你會先看哪個變量？`,
        en: `Which variable would you check first?`,
        ja: `まずどの変数から確かめますか。`,
        ko: `어떤 변수부터 먼저 검증해 보시겠어요?`
      });
    case "bridge":
      if (toneKey === "warm") {
        return localize({
          "zh-Hans": `补到这里，讨论才好继续往下走。`,
          "zh-Hant": `補到這裡，討論才好繼續往下走。`,
          en: `Once that layer is back in place, the discussion finally has room to keep moving.`,
          ja: `ここまで補うと、議論はやっとそのまま先へ進めます。`,
          ko: `여기까지 보태야 대화가 비로소 계속 앞으로 갈 공간이 생깁니다.`
        });
      }
      return localize({
        "zh-Hans": `这样接一句，会比硬拐一个新方向自然得多。`,
        "zh-Hant": `這樣接一句，會比硬拐一個新方向自然得多。`,
        en: `Landing it this way is much more natural than forcing a brand-new direction.`,
        ja: `こうつなぐほうが、無理に新しい方向へ曲げるよりずっと自然です。`,
        ko: `이렇게 잇는 편이 억지로 새 방향을 트는 것보다 훨씬 자연스럽습니다.`
      });
    case "contrast":
      return localize({
        "zh-Hans": `这样接更像顺手补一句，不像故意唱反调。`,
        "zh-Hant": `這樣接更像順手補一句，不像故意唱反調。`,
        en: `This lands more like a natural reply than a deliberate contrarian move.`,
        ja: `この閉じ方のほうが、わざと逆張りするより自然な返しに見えます。`,
        ko: `이런 마무리가 억지 반대보다 자연스럽게 이어붙이는 답글처럼 들립니다.`
      });
    case "direct":
      if (toneKey === "sharp") {
        return localize({
          "zh-Hans": `比起再复述一遍表层热度，这样更像顺手接上一句。`,
          "zh-Hant": `比起再複述一遍表層熱度，這樣更像順手接上一句。`,
          en: `Compared with repeating the surface heat one more time, this sounds much more like a reply that is actually joining the conversation.`,
          ja: `表面の熱量をもう一度なぞるより、このほうが本当に接続する返しに聞こえます。`,
          ko: `표면 열기를 한 번 더 반복하는 것보다 이쪽이 실제로 이어지는 답글처럼 들립니다.`
        });
      }
      return localize({
        "zh-Hans": `这也比再重复一遍显眼结论更像可以直接发出去的话。`,
        "zh-Hant": `這也比再重複一遍顯眼結論更像可以直接發出去的話。`,
        en: `This also sounds much more like something worth sending than repeating the obvious conclusion again.`,
        ja: `見えている結論を繰り返すより、こちらのほうが返す価値があります。`,
        ko: `눈에 보이는 결론을 다시 반복하는 것보다 이쪽이 훨씬 보낼 가치가 있습니다.`
      });
    default:
      return "";
  }
}

function buildDraftRouteReason(routePlan, context) {
  const reasons = Array.isArray(routePlan?.reasons) ? routePlan.reasons : [];
  const hasReason = (key) => reasons.includes(key);
  switch (routePlan?.key) {
    case "memory-line":
      if (hasReason("author-back")) {
        return localize({
          "zh-Hans": `这类对象已经出现作者回流，沿着 ${context.memoryTopic} 这条验证线继续接，会比临时换题更稳。`,
          "zh-Hant": `這類對象已經出現作者回流，沿著 ${context.memoryTopic} 這條驗證線繼續接，會比臨時換題更穩。`,
          en: `This kind of target already pulled the author back before, so staying on the validated ${context.memoryTopic} line is steadier than changing the subject.`,
          ja: `この種の対象では作者再参加が出ているので、検証済みの ${context.memoryTopic} 線をそのまま継ぐ方が安定します。`,
          ko: `이 유형은 이미 작성자 재참여가 나온 적이 있어서 검증된 ${context.memoryTopic} 선을 그대로 잇는 편이 더 안정적입니다.`
        });
      }
      if (hasReason("picked-up") || hasReason("reviewed-memory")) {
        return localize({
          "zh-Hans": `这条线以前已经被线程接住过，顺着 ${context.memoryTopic} 继续追，会比重新找角度更像顺势接话。`,
          "zh-Hant": `這條線以前已經被線程接住過，順著 ${context.memoryTopic} 繼續追，會比重新找角度更像順勢接話。`,
          en: `This line was already picked up before, so following the ${context.memoryTopic} thread feels more natural than inventing a new angle.`,
          ja: `この線は過去に拾われているので、${context.memoryTopic} をそのまま追う方が新しい角度を作るより自然です。`,
          ko: `이 선은 예전에 이미 반응이 붙어서 ${context.memoryTopic} 흐름을 그대로 잇는 편이 새 각도를 만드는 것보다 자연스럽습니다.`
        });
      }
      return localize({
        "zh-Hans": `顺着已经出现验证迹象的 ${context.memoryTopic} 切口继续接，会比临时换线更稳。`,
        "zh-Hant": `順著已經出現驗證跡象的 ${context.memoryTopic} 切口繼續接，會比臨時換線更穩。`,
        en: `Stay on the ${context.memoryTopic} angle that already shows proof instead of switching lines midstream.`,
        ja: `${context.memoryTopic} の検証が見えているので、途中で線を変えずそのまま継ぐ方が安定します。`,
        ko: `${context.memoryTopic} 쪽에 이미 검증 신호가 보여서 중간에 선을 바꾸지 않는 편이 더 안정적입니다.`
      });
    case "key-question":
      if (hasReason("acceleration-window") && hasReason("community-thread")) {
        return localize({
          "zh-Hans": "这条还在往上爬，回复区也还没挤死。先把关键变量问清，会比丢一句泛态度更容易把讨论重新点亮。",
          "zh-Hant": "這條還在往上爬，回覆區也還沒擠死。先把關鍵變量問清，會比丟一句泛態度更容易把討論重新點亮。",
          en: "This post is still climbing and the reply lane is not saturated yet. Asking the decisive variable is more useful here than dropping a generic reaction.",
          ja: "まだ伸びていて返信欄も詰まり切っていないので、ここは泛反応より先に変数を問う方が流れを起こせます。",
          ko: "아직 오르는 중이고 답글칸도 꽉 막히지 않아서, 뻔한 반응 하나보다 결정 변수를 먼저 묻는 편이 흐름을 다시 살리기 쉽습니다."
        });
      }
      if (hasReason("reviewed-quiet")) {
        return localize({
          "zh-Hans": "这类对象虽然进过复查，但没有明显起量，先把关键变量问清，比继续沿旧线追更容易把话题重新带活。",
          "zh-Hant": "這類對象雖然進過複查，但沒有明顯起量，先把關鍵變量問清，比繼續沿舊線追更容易把話題重新帶活。",
          en: "This target was reviewed before but stayed quiet, so clarifying the key variable is a better way to revive it than pretending the old line already proved itself.",
          ja: "再確認までは進んでいても静かだったので、旧線をなぞるより先に変数を問う方が流れを起こしやすいです。",
          ko: "재확인까지는 갔지만 조용했던 대상이라, 옛 흐름을 억지로 잇기보다 변수를 먼저 묻는 편이 다시 움직이게 하기 쉽습니다."
        });
      }
      if (hasReason("crowded-thread")) {
        return localize({
          "zh-Hans": "讨论已经有密度了，先把关键变量问清，会比再补一个泛观点更容易把线程往下带。",
          "zh-Hant": "討論已經有密度了，先把關鍵變量問清，會比再補一個泛觀點更容易把線程往下帶。",
          en: "The thread already has density, so clarifying the variable first moves it further than adding another generic opinion.",
          ja: "議論に密度があるので、汎用的な意見を足すより先に変数を問う方が会話を進めやすいです。",
          ko: "대화 밀도가 이미 있어서泛한 의견 하나 더 얹는 것보다 변수를 먼저 묻는 편이 스레드를 더 앞으로 밀 수 있습니다."
        });
      }
      return localize({
        "zh-Hans": "先追决定方向的变量，会比直接抢结论更容易把后续讨论带出来。",
        "zh-Hant": "先追決定方向的變量，會比直接搶結論更容易把後續討論帶出來。",
        en: "Ask the variable that decides direction before chasing the conclusion.",
        ja: "結論を急ぐ前に方向を決める変数を問う方が、その後の会話を引き出せます。",
        ko: "결론을 서두르기보다 방향을 정하는 변수를 먼저 묻는 편이 이후 대화를 더 잘 끌어냅니다."
      });
    case "soft-contrast":
      if (hasReason("acceleration-window") && hasReason("unique-angle-window")) {
        return localize({
          "zh-Hans": `这条已经有可见热度了，把角度轻轻拐向 ${context.secondaryHighlight} 会更值钱，等于补一个别人还没说透的主意。`,
          "zh-Hant": `這條已經有可見熱度了，把角度輕輕拐向 ${context.secondaryHighlight} 會更值錢，等於補一個別人還沒說透的主意。`,
          en: `This post already has visible heat, so bending toward ${context.secondaryHighlight} is the better move because it adds an idea people have not fully unpacked yet.`,
          ja: `すでに熱量が見えているので、同調するより ${context.secondaryHighlight} 側へ少し曲げて、まだ言い切られていない見方を足す方が価値があります。`,
          ko: `이미 열기가 붙은 상태라 맞장구보다 ${context.secondaryHighlight} 쪽으로 살짝 틀어, 아직 끝까지 말해지지 않은 아이디어를 얹는 편이 더 값집니다.`
        });
      }
      if (hasReason("crowded-consensus")) {
        return localize({
          "zh-Hans": `这条线程表面共识已经不少了，轻轻把角度拐向 ${context.secondaryHighlight}，会比重复主流说法更像真人回复。`,
          "zh-Hant": `這條線程表面共識已經不少了，輕輕把角度拐向 ${context.secondaryHighlight}，會比重複主流說法更像真人回覆。`,
          en: `The visible consensus is already crowded here, so bending the angle toward ${context.secondaryHighlight} sounds more human than repeating the dominant take.`,
          ja: `表面の合意がもう多いので、${context.secondaryHighlight} へ少し角度を曲げる方が主流をなぞるより人っぽく響きます。`,
          ko: `표면 합의가 이미 많은 스레드라 ${context.secondaryHighlight} 쪽으로 각도를 살짝 틀어 주는 편이 주류 해석 반복보다 훨씬 사람답습니다.`
        });
      }
      return localize({
        "zh-Hans": `轻反差切入会比重复表面共识更像真人接话，尤其适合把重点放到 ${context.secondaryHighlight} 这层。`,
        "zh-Hant": `輕反差切入會比重複表面共識更像真人接話，尤其適合把重點放到 ${context.secondaryHighlight} 這層。`,
        en: `A soft contrast opening sounds more human than repeating the consensus, especially when the weight belongs on ${context.secondaryHighlight}.`,
        ja: `軽い対比で入る方が総意を繰り返すより人っぽく、特に ${context.secondaryHighlight} を押す時に合います。`,
        ko: `가벼운 반차이로 들어가는 편이 합의 반복보다 사람답고, 특히 ${context.secondaryHighlight} 층을 밀고 싶을 때 잘 맞습니다.`
      });
    case "add-one-layer":
      if (hasReason("unique-angle-window") && hasReason("proven-reach")) {
        return localize({
          "zh-Hans": `这条已经起量了，最该补的是 ${context.secondaryHighlight} 这一层，让回复本身有新增信息。`,
          "zh-Hant": `這條已經起量了，最該補的是 ${context.secondaryHighlight} 這一層，讓回覆本身有新增資訊。`,
          en: `This post already has reach, so the best reply is adding the ${context.secondaryHighlight} layer so your reply actually contributes something new.`,
          ja: `すでに届き始めているので、ここで価値があるのは褒め言葉ではなく ${context.secondaryHighlight} の層を足して、新しい情報を置くことです。`,
          ko: `이미 도달이 붙은 글이라 여기서 값이 있는 건 칭찬 한마디가 아니라 ${context.secondaryHighlight} 층을 보태 답글 자체에 새 정보를 넣는 일입니다.`
        });
      }
      if (hasReason("reviewed-quiet")) {
        return localize({
          "zh-Hans": `这类对象已经做过复查，但还没明显被接住，所以先补 ${context.secondaryHighlight} 这一层，会比假装旧线已经跑通更顺。`,
          "zh-Hant": `這類對象已經做過複查，但還沒明顯被接住，所以先補 ${context.secondaryHighlight} 這一層，會比假裝舊線已經跑通更順。`,
          en: `This target has already been reviewed but not truly picked up, so adding the missing ${context.secondaryHighlight} layer is smoother than acting like the old line is already validated.`,
          ja: "再確認は済んでいても本当に拾われたわけではないので、旧線を正解扱いするより ${context.secondaryHighlight} を足す方が自然です。",
          ko: "이미 재확인했지만 실제로 받아들여진 건 아니라서, 옛 흐름을 정답처럼 밀기보다 ${context.secondaryHighlight} 층을 보태는 편이 더 자연스럽습니다."
        });
      }
      if (hasReason("tonight-slot")) {
        return localize({
          "zh-Hans": "这条更像今晚慢慢接的对象，先补一层让线程继续动起来，会比硬转方向更顺。",
          "zh-Hant": "這條更像今晚慢慢接的對象，先補一層讓線程繼續動起來，會比硬轉方向更順。",
          en: "This looks more like a tonight slot, so adding one more layer is smoother than forcing a hard pivot.",
          ja: "これは今夜枠でゆっくり接ぐ方が合うので、方向転換より一層足す方が自然です。",
          ko: "이건 오늘 밤 슬롯에서 천천히 붙는 편이 맞아서 방향 전환보다 한 층 더 보태는 쪽이 자연스럽습니다."
        });
      }
      return localize({
        "zh-Hans": `把 ${context.secondaryHighlight} 从表面反应拉回还能继续讨论的一层，会比硬转方向更顺。`,
        "zh-Hant": `把 ${context.secondaryHighlight} 從表面反應拉回還能繼續討論的一層，會比硬轉方向更順。`,
        en: `Pull ${context.secondaryHighlight} back into a layer that can still extend the thread instead of forcing a pivot.`,
        ja: `${context.secondaryHighlight} を表面反応から、まだ伸ばせる層へ戻す方が無理な転換より自然です。`,
        ko: `${context.secondaryHighlight} 를 표면 반응에서 다시 이어질 수 있는 층으로 끌어오는 편이 억지 전환보다 자연스럽습니다.`
      });
    case "direct-take":
    default:
      if (hasReason("acceleration-window") && hasReason("unique-angle-window")) {
        return localize({
          "zh-Hans": `这条已经在加速，而且曝光也够看见了。现在最值钱的是直接从 ${context.primaryHighlight} 给一个能补信息的观点。`,
          "zh-Hant": `這條已經在加速，而且曝光也夠看見了。現在最值錢的是直接從 ${context.primaryHighlight} 給一個能補資訊的觀點。`,
          en: `This post is already accelerating and the reach is real. The valuable move now is a direct take from ${context.primaryHighlight} that adds information.`,
          ja: `すでに加速して届き始めているので、ここで価値があるのは褒めることではなく ${context.primaryHighlight} から情報を足す見方を直に出すことです。`,
          ko: `이미 가속 중이고 노출도 충분히 붙어서, 여기서 값이 있는 건 칭찬이 아니라 ${context.primaryHighlight} 에서 새 정보를 더하는 관점을 바로 던지는 일입니다.`
        });
      }
      if (hasReason("live-window") && hasReason("high-score")) {
        return localize({
          "zh-Hans": `这条还在即时窗口里，分数也够高，直接从 ${context.primaryHighlight} 给观点会比绕路铺垫更像现在就能发的回复。`,
          "zh-Hant": `這條還在即時窗口裡，分數也夠高，直接從 ${context.primaryHighlight} 給觀點會比繞路鋪墊更像現在就能發的回覆。`,
          en: `This is still inside a live window and the score is high, so leading directly from ${context.primaryHighlight} fits better than warming up slowly.`,
          ja: `まだライブの窓にありスコアも高いので、${context.primaryHighlight} から直に見方を出す方がいま送る返信に近いです。`,
          ko: `아직 라이브 창 안이고 점수도 높아서 ${context.primaryHighlight} 에서 바로 관점을 던지는 편이 지금 보낼 답글에 더 가깝습니다.`
        });
      }
      return localize({
        "zh-Hans": `直接从 ${context.primaryHighlight} 给一个可接观点，再往下压半步，会更像现在就能发的回复。`,
        "zh-Hant": `直接從 ${context.primaryHighlight} 給一個可接觀點，再往下壓半步，會更像現在就能發的回覆。`,
        en: `Lead directly from ${context.primaryHighlight}, then push one half-step further so it sounds ready to send.`,
        ja: `${context.primaryHighlight} から見方を直に出し、半歩だけ押す方がそのまま送れる返信に近くなります。`,
        ko: `${context.primaryHighlight} 에서 바로 관점을 내고 반 걸음만 더 밀면 바로 보낼 수 있는 답글에 더 가까워집니다.`
      });
  }
}

function buildDraftRouteOptions(drafts, candidate, attributionSummary = null) {
  if (!candidate || !Array.isArray(drafts) || !drafts.length) {
    return [];
  }

  const context = getDraftContext(candidate, attributionSummary);
  const recommendedSlotLabel = getQueueSlotTexts(getDefaultQueueSlot(candidate)).label;
  const findDraftIndex = (key) => drafts.findIndex((draft) => draft?.key === key);
  const laneKey = getCandidateLane(candidate).key;
  const routePlans = typeof DraftCore?.buildDraftRoutePlan === "function"
    ? DraftCore.buildDraftRoutePlan(
        { ...candidate, laneKey },
        attributionSummary,
        {
          now: Date.now(),
          laneKey,
          preferredSlot: getDefaultQueueSlot(candidate),
          availableDraftKeys: drafts.map((draft) => draft?.key).filter(Boolean),
          limit: 3
        }
      )
    : [];

  const fallbackPlans = (Array.isArray(drafts) ? drafts : []).slice(0, 3).map((draft, index) => ({
    key: draft?.key === "memory"
      ? "memory-line"
      : draft?.key === "question"
        ? "key-question"
        : draft?.key === "contrast"
          ? "soft-contrast"
          : draft?.key === "bridge"
            ? "add-one-layer"
            : "direct-take",
    draftKey: draft?.key || "",
    tone: draft?.tone === "success" ? "warm" : draft?.tone === "accent" ? "sharp" : "neutral",
    starterIndex: 0,
    bodyIndex: 0,
    closerIndex: 0,
    reasons: [],
    score: 20 - index
  }));

  const sourcePlans = routePlans.length ? routePlans : fallbackPlans;
  return sourcePlans.map((routePlan) => {
    const draftIndex = findDraftIndex(routePlan.draftKey);
    const draft = drafts[draftIndex] || null;
    if (!draft) {
      return null;
    }
    const tone = routePlan.tone || "neutral";
    const starterOptions = buildDraftStarterOptions(draft, tone);
    const bodyOptions = buildDraftBodyOptions(draft, candidate, attributionSummary, tone);
    const closerOptions = buildDraftCloserOptions(draft, candidate, attributionSummary, tone);
    const uiDef = getDraftRouteUiDefinition(routePlan.key);
    const signalChips = (Array.isArray(routePlan.reasons) ? routePlan.reasons : [])
      .slice(0, 2)
      .map((reasonKey) => getDraftRouteSignalLabel(reasonKey));
    const starterIndex = starterOptions[routePlan.starterIndex] ? routePlan.starterIndex : 0;
    const bodyIndex = bodyOptions[routePlan.bodyIndex] ? routePlan.bodyIndex : 0;
    const closerIndex = closerOptions[routePlan.closerIndex] ? routePlan.closerIndex : 0;
    const starterLabel = starterOptions[starterIndex]?.label || "";
    const bodyLabel = bodyOptions[bodyIndex]?.label || "";
    const closerLabel = closerOptions[closerIndex]?.label || "";

    return {
      key: routePlan.key,
      title: localize(uiDef.title),
      reason: buildDraftRouteReason(routePlan, context),
      playbook: buildDraftRoutePlaybookText(starterLabel, bodyLabel, closerLabel),
      draftIndex,
      tone,
      voiceKey: routePlan.voiceKey || "default",
      sentenceTarget: Number(routePlan.sentenceTarget || 3),
      preferQuestionClose: Boolean(routePlan.preferQuestionClose),
      starterIndex,
      bodyIndex,
      closerIndex,
      toneChip: uiDef.toneChip || "soft",
      score: Number(routePlan.score || 0),
      chips: [
        draft.angle,
        getDraftToneLabel(tone),
        recommendedSlotLabel,
        ...signalChips
      ].filter(Boolean)
    };
  }).filter(Boolean).slice(0, 3);
}

function buildDraftStarterOptions(draft, toneKey = "neutral") {
  const tone = String(toneKey || "neutral");
  const build = (items) => items.map((item) => ({
    label: localize(item.label),
    prefix: localize(item.prefix),
    tone: item.tone || (tone === "sharp" ? "accent" : tone === "warm" ? "success" : "soft")
  }));

  switch (draft?.key) {
    case "memory":
      return build([
        {
          label: { "zh-Hans": "沿原线", "zh-Hant": "沿原線", en: "Stay on line", ja: "元の線を継ぐ", ko: "원래 흐름 유지" },
          prefix: tone === "sharp"
            ? { "zh-Hans": "我会沿这条继续接：", "zh-Hant": "我會沿這條繼續接：", en: "I would keep pushing this line:", ja: "この線をそのまま押します:", ko: "이 흐름을 그대로 밀겠습니다:" }
            : { "zh-Hans": "我会沿这条继续接：", "zh-Hant": "我會沿這條繼續接：", en: "I would stay on this line:", ja: "この線をそのまま続けます:", ko: "이 흐름을 그대로 잇겠습니다:" }
        },
        {
          label: { "zh-Hans": "顺着记忆", "zh-Hant": "順著記憶", en: "Use memory", ja: "記憶に沿う", ko: "기억 따라가기" },
          prefix: { "zh-Hans": "如果顺着这条记忆往下聊：", "zh-Hant": "如果順著這條記憶往下聊：", en: "If I follow the remembered line here:", ja: "この記憶をそのまま下へ伸ばすなら:", ko: "이 기억선을 그대로 이어 간다면:" }
        },
        {
          label: { "zh-Hans": "第一句放这", "zh-Hant": "第一句放這", en: "Open here", ja: "最初の一言", ko: "첫 문장 배치" },
          prefix: { "zh-Hans": "我第一句会先放这里：", "zh-Hant": "我第一句會先放這裡：", en: "My first line would land here:", ja: "最初の一言はここです:", ko: "첫 문장은 여기에 둘 것 같아요:" }
        }
      ]);
    case "question":
      return build([
        {
          label: { "zh-Hans": "先追问", "zh-Hant": "先追問", en: "Lead with question", ja: "まず問いかけ", ko: "질문부터" },
          prefix: { "zh-Hans": "我会先追一个问题：", "zh-Hant": "我會先追一個問題：", en: "I would start with one question:", ja: "最初に置くならこの問いです:", ko: "저라면 이 질문부터 던집니다:" }
        },
        {
          label: { "zh-Hans": "只问一句", "zh-Hant": "只問一句", en: "If one question", ja: "ひとつだけ問う", ko: "한 가지만 묻기" },
          prefix: { "zh-Hans": "如果只问一句：", "zh-Hant": "如果只問一句：", en: "If I only ask one thing:", ja: "ひとつだけ聞くなら:", ko: "한 가지만 묻는다면:" }
        },
        {
          label: { "zh-Hans": "关键变量", "zh-Hant": "關鍵變量", en: "Key variable", ja: "決定変数", ko: "핵심 변수" },
          prefix: { "zh-Hans": "最关键的问题是：", "zh-Hant": "最關鍵的問題是：", en: "The real variable is this:", ja: "本当に効く問いはこれです:", ko: "핵심 변수는 이겁니다:" }
        }
      ]);
    case "bridge":
      return build([
        {
          label: { "zh-Hans": "先补一句", "zh-Hant": "先補一句", en: "Add one line", ja: "まず一言足す", ko: "한 줄 보태기" },
          prefix: { "zh-Hans": "我会先补一句：", "zh-Hant": "我會先補一句：", en: "I would start by adding one thing:", ja: "まず一言足すなら:", ko: "제가 먼저 덧붙일 한마디는:" }
        },
        {
          label: { "zh-Hans": "往前半步", "zh-Hant": "往前半步", en: "Half step forward", ja: "半歩だけ進める", ko: "반 걸음 앞으로" },
          prefix: { "zh-Hans": "如果往前接半步：", "zh-Hant": "如果往前接半步：", en: "If I move this half a step forward:", ja: "半歩だけ前へ接ぐなら:", ko: "반 걸음만 더 앞으로 잇는다면:" }
        },
        {
          label: { "zh-Hans": "真正可聊", "zh-Hant": "真正可聊", en: "What is still open", ja: "まだ話せる部分", ko: "아직 열려 있는 부분" },
          prefix: { "zh-Hans": "真正还能聊的是：", "zh-Hant": "真正還能聊的是：", en: "The part still worth opening is:", ja: "まだ開けるのはここです:", ko: "아직 더 열 수 있는 건 이 부분입니다:" }
        }
      ]);
    case "contrast":
      return build([
        {
          label: { "zh-Hans": "换个角度", "zh-Hant": "換個角度", en: "Different angle", ja: "角度を変える", ko: "각도 틀기" },
          prefix: { "zh-Hans": "我会先换个角度：", "zh-Hant": "我會先換個角度：", en: "I would open from a different angle:", ja: "少し角度を変えて入るなら:", ko: "저라면 각도를 살짝 틀어 시작합니다:" }
        },
        {
          label: { "zh-Hans": "我反而觉得", "zh-Hant": "我反而覺得", en: "I actually think", ja: "むしろこう見る", ko: "오히려 이렇게 봄" },
          prefix: { "zh-Hans": "我反而会这样看：", "zh-Hant": "我反而會這樣看：", en: "I would actually frame it like this:", ja: "むしろこう見ます:", ko: "오히려 저는 이렇게 봅니다:" }
        },
        {
          label: { "zh-Hans": "更有意思", "zh-Hant": "更有意思", en: "More interesting", ja: "むしろ面白いのは", ko: "더 흥미로운 건" },
          prefix: { "zh-Hans": "更有意思的是：", "zh-Hant": "更有意思的是：", en: "The more interesting part is:", ja: "むしろ面白いのは:", ko: "더 흥미로운 건 이겁니다:" }
        }
      ]);
    case "perspective":
    default:
      return build([
        {
          label: { "zh-Hans": "先说结论", "zh-Hant": "先說結論", en: "Lead with point", ja: "先に結論", ko: "결론부터" },
          prefix: { "zh-Hans": "如果先给一个观点：", "zh-Hant": "如果先給一個觀點：", en: "If I open with one point:", ja: "まずひとつ見方を出すなら:", ko: "관점 하나부터 던진다면:" }
        },
        {
          label: { "zh-Hans": "第一反应", "zh-Hant": "第一反應", en: "First reaction", ja: "第一反応", ko: "첫 반응" },
          prefix: { "zh-Hans": "我第一反应是：", "zh-Hant": "我第一反應是：", en: "My first reaction is:", ja: "最初の反応はこうです:", ko: "제 첫 반응은 이겁니다:" }
        },
        {
          label: { "zh-Hans": "更直接", "zh-Hant": "更直接", en: "Say it cleaner", ja: "もう少し直球で", ko: "더 직설적으로" },
          prefix: { "zh-Hans": "更直接一点会是：", "zh-Hant": "更直接一點會是：", en: "A cleaner opening would be:", ja: "もう少し直球で言うなら:", ko: "조금 더 직설적으로 열면:" }
        }
      ]);
  }
}

function applyDraftStarterPrefix(text, prefix) {
  const body = stripDraftLeadClause(text);
  const lead = String(prefix || "").trim();
  if (!lead) {
    return String(text || "").trim();
  }
  return `${lead}${body ? ` ${body}` : ""}`.trim();
}

function buildDraftBodyOptions(draft, candidate, attributionSummary = null, toneKey = "neutral") {
  const tone = String(toneKey || "neutral");
  const context = getDraftContext(candidate, attributionSummary);
  const defaultTone = tone === "sharp" ? "accent" : tone === "warm" ? "success" : "soft";
  const build = (items) => items.map((item) => ({
    label: localize(item.label),
    addition: localize(item.addition),
    tone: item.tone || defaultTone
  }));

  switch (draft?.key) {
    case "memory":
      return build([
        {
          label: { "zh-Hans": "借记忆", "zh-Hant": "借記憶", en: "Use memory", ja: "記憶に寄せる", ko: "기억선 타기" },
          addition: {
            "zh-Hans": `过去已经被接住的也多半是 ${context.memoryTopic} 这类层次，所以这里继续沿着这条线推会更顺。`,
            "zh-Hant": `過去已經被接住的也多半是 ${context.memoryTopic} 這類層次，所以這裡繼續沿著這條線推會更順。`,
            en: `The angles that already got picked up before usually lived on the ${context.memoryTopic} layer too, so extending the same line here is the cleaner move.`,
            ja: `過去に拾われたのも ${context.memoryTopic} の層が多いので、ここも同じ線をそのまま伸ばすほうが自然です。`,
            ko: `예전에 반응이 붙었던 것도 대체로 ${context.memoryTopic} 층이어서, 여기서도 같은 선을 잇는 편이 더 자연스럽습니다.`
          }
        },
        {
          label: { "zh-Hans": "落回原帖", "zh-Hant": "落回原貼", en: "Tie back", ja: "元投稿へ戻す", ko: "원문에 걸기" },
          addition: {
            "zh-Hans": `顺着 ${context.handle} 这条原帖继续接，我会把重点放在 ${context.primaryHighlight} 为什么还能继续被讨论。`,
            "zh-Hant": `順著 ${context.handle} 這條原貼繼續接，我會把重點放在 ${context.primaryHighlight} 為什麼還能繼續被討論。`,
            en: `If I stay attached to the original post, I would keep the weight on why ${context.primaryHighlight} is still worth talking through.`,
            ja: `元投稿に沿ってつなぐなら、${context.primaryHighlight} がまだ話せる理由へ重心を置きます。`,
            ko: `원문 흐름을 유지한다면 ${context.primaryHighlight} 가 왜 계속 이야기할 만한지에 초점을 둘 것 같습니다.`
          }
        },
        {
          label: { "zh-Hans": "只推半步", "zh-Hant": "只推半步", en: "Half-step", ja: "半歩だけ", ko: "반 걸음" },
          addition: {
            "zh-Hans": "这类对象最怕的是换线太快，沿着同一条记忆补半步反而更自然。",
            "zh-Hant": "這類對象最怕的是換線太快，沿著同一條記憶補半步反而更自然。",
            en: "This kind of target gets weaker when you switch lines too fast. Adding only half a step on the same memory is more natural.",
            ja: "この手の相手は線を急に変えると弱くなるので、同じ記憶の上で半歩だけ足すほうが自然です。",
            ko: "이런 대상은 흐름을 너무 빨리 바꾸면 약해져서 같은 기억선 위에 반 걸음만 더하는 편이 자연스럽습니다."
          }
        }
      ]);
    case "question":
      return build([
        {
          label: { "zh-Hans": "压变量", "zh-Hant": "壓變量", en: "Push variable", ja: "変数を押す", ko: "변수 압축" },
          addition: {
            "zh-Hans": `因为一旦这个变量换掉，大家对整件事的判断可能会完全不同。`,
            "zh-Hant": `因為一旦這個變量換掉，大家對整件事的判斷可能會完全不同。`,
            en: "Because once that variable changes, the read on the whole situation can shift with it.",
            ja: "その変数が変わるだけで、全体の見え方まで変わる可能性があるからです。",
            ko: "그 변수가 바뀌기만 해도 전체 판단이 함께 달라질 수 있기 때문입니다."
          }
        },
        {
          label: { "zh-Hans": "落回原帖", "zh-Hant": "落回原貼", en: "Tie back", ja: "元投稿へ戻す", ko: "원문에 걸기" },
          addition: {
            "zh-Hans": `顺着原帖往下追，我更想先问清 ${context.primaryHighlight} 到底是在解释结果，还是在改变过程。`,
            "zh-Hant": `順著原貼往下追，我更想先問清 ${context.primaryHighlight} 到底是在解釋結果，還是在改變過程。`,
            en: `Following the original post, I would want to know whether ${context.primaryHighlight} explains the outcome or actually changes the process itself.`,
            ja: `元投稿に沿うなら、${context.primaryHighlight} が結果の説明なのか、過程そのものを変えているのかを先に聞きたいです。`,
            ko: `원문을 따라간다면 ${context.primaryHighlight} 가 결과를 설명하는 건지, 과정 자체를 바꾸는 건지부터 묻고 싶습니다.`
          }
        },
        {
          label: { "zh-Hans": "借验证", "zh-Hant": "借驗證", en: "Use proof", ja: "実績に寄せる", ko: "검증선 따라가기" },
          addition: {
            "zh-Hans": context.reviewed
              ? `过去更容易被接住的，往往也是这种“先把变量问清”的切法。`
              : `先把变量问清，会比直接抢结论更容易把对话往下带。`,
            "zh-Hant": context.reviewed
              ? `過去更容易被接住的，往往也是這種「先把變量問清」的切法。`
              : `先把變量問清，會比直接搶結論更容易把對話往下帶。`,
            en: context.reviewed
              ? "The questions that got picked up before usually started by clarifying the variable first."
              : "Clarifying the variable first usually carries the conversation further than rushing the conclusion.",
            ja: context.reviewed
              ? "過去に拾われた問いも、たいていは先に変数をはっきりさせていました。"
              : "結論を急ぐより、先に変数をはっきりさせたほうが会話は下へ伸びます。",
            ko: context.reviewed
              ? "예전에 받아들여진 질문도 대체로 먼저 변수를 분명히 했습니다."
              : "결론부터抢기보다 변수를 먼저 분명히 하는 편이 대화를 더 앞으로 끌고 갑니다."
          }
        }
      ]);
    case "bridge":
      return build([
        {
          label: { "zh-Hans": "再补一层", "zh-Hant": "再補一層", en: "Add one layer", ja: "もう一層足す", ko: "한 층 더" },
          addition: {
            "zh-Hans": `更具体一点说，${context.secondaryHighlight} 其实不是补充信息，它本身就会影响下一步怎么理解。`,
            "zh-Hant": `更具體一點說，${context.secondaryHighlight} 其實不是補充資訊，它本身就會影響下一步怎麼理解。`,
            en: `More specifically, ${context.secondaryHighlight} is not just extra color. It changes how the next step should be read.`,
            ja: `もう少し具体的に言うと、${context.secondaryHighlight} は補足ではなく、その先の読み方自体を変える要素です。`,
            ko: `조금 더 구체적으로 말하면 ${context.secondaryHighlight} 는 단순 보충이 아니라 다음 해석 자체를 바꾸는 요소입니다.`
          }
        },
        {
          label: { "zh-Hans": "落回原帖", "zh-Hant": "落回原貼", en: "Tie back", ja: "元投稿へ戻す", ko: "원문에 걸기" },
          addition: {
            "zh-Hans": `如果顺着原帖继续接，这里最适合补的是 ${context.primaryHighlight} 为什么值得补。`,
            "zh-Hant": `如果順著原貼繼續接，這裡最適合補的是 ${context.primaryHighlight} 為什麼值得補。`,
            en: `If I keep following the original post, the thing to add is why ${context.primaryHighlight} deserves the extra layer.`,
            ja: `元投稿に沿うなら、足すべきなのは ${context.primaryHighlight} を足す意味そのものです。`,
            ko: `원문을 계속 따른다면 덧붙일 건 왜 ${context.primaryHighlight} 를 덧대야 하는지 그 이유입니다.`
          }
        },
        {
          label: { "zh-Hans": "给半步", "zh-Hant": "給半步", en: "Push half-step", ja: "半歩だけ押す", ko: "반 걸음 밀기" },
          addition: {
            "zh-Hans": "这层一补上，整条讨论就不会只停在表面反应。",
            "zh-Hant": "這層一補上，整條討論就不會只停在表面反應。",
            en: "Once this layer is added, the whole thread stops being just a surface reaction.",
            ja: "この層を足すだけで、議論は表面反応のままで終わらなくなります。",
            ko: "이 층만 보태도 전체 대화가 표면 반응에서 멈추지 않게 됩니다."
          }
        }
      ]);
    case "contrast":
      return build([
        {
          label: { "zh-Hans": "压反差", "zh-Hant": "壓反差", en: "Deepen contrast", ja: "対比を深める", ko: "반차이 누르기" },
          addition: {
            "zh-Hans": `因为真正拉开差距的，往往是 ${context.secondaryHighlight} 这段还没被说透。`,
            "zh-Hant": `因為真正拉開差距的，往往是 ${context.secondaryHighlight} 這段還沒被說透。`,
            en: `The real contrast usually comes from the part nobody has fully unpacked yet, not the layer everyone already repeated.`,
            ja: `差がつくのは、みんなが言い尽くした層ではなく、まだ言い切られていない ${context.secondaryHighlight} のほうです。`,
            ko: `진짜 차이는 모두가 이미 말한 층이 아니라 아직 끝까지 풀리지 않은 ${context.secondaryHighlight} 쪽에서 생깁니다.`
          }
        },
        {
          label: { "zh-Hans": "落回原帖", "zh-Hant": "落回原貼", en: "Tie back", ja: "元投稿へ戻す", ko: "원문에 걸기" },
          addition: {
            "zh-Hans": `顺着原帖去接，我会把反差点放在 ${context.primaryHighlight} 为什么比表面共识更值得聊。`,
            "zh-Hant": `順著原貼去接，我會把反差點放在 ${context.primaryHighlight} 為什麼比表面共識更值得聊。`,
            en: `If I stay close to the original post, I would place the contrast on why ${context.primaryHighlight} is more worth discussing than the obvious consensus.`,
            ja: `元投稿に沿うなら、${context.primaryHighlight} のほうが表面の総意よりなぜ面白いかに対比を置きます。`,
            ko: `원문 흐름에 맞춘다면 ${context.primaryHighlight} 가 표면 합의보다 왜 더 이야기할 만한지에 반차이를 둘 것 같습니다.`
          }
        },
        {
          label: { "zh-Hans": "像真人一点", "zh-Hant": "像真人一點", en: "Sound human", ja: "人っぽく寄せる", ko: "사람답게" },
          addition: {
            "zh-Hans": "这也是为什么轻轻拐一下角度，会比重复结论更像真人回复。",
            "zh-Hant": "這也是為什麼輕輕拐一下角度，會比重複結論更像真人回覆。",
            en: "That is why bending the angle slightly sounds more human than repeating the visible conclusion.",
            ja: "だから少しだけ角度を曲げるほうが、見えている結論をなぞるより人っぽく聞こえます。",
            ko: "그래서 각도를 살짝 트는 편이 보이는 결론을 반복하는 것보다 훨씬 사람답게 들립니다."
          }
        }
      ]);
    case "perspective":
    default:
      return build([
        {
          label: { "zh-Hans": "再压一层", "zh-Hant": "再壓一層", en: "Add depth", ja: "もう一段深く", ko: "한 층 더 압축" },
          addition: {
            "zh-Hans": `真正值得继续往下压的，是 ${context.secondaryHighlight} 这一层，因为它会直接改掉大家后面的判断。`,
            "zh-Hant": `真正值得繼續往下壓的，是 ${context.secondaryHighlight} 這一層，因為它會直接改掉大家後面的判斷。`,
            en: `The part worth pushing deeper is ${context.secondaryHighlight}, because that layer changes how people read the next step.`,
            ja: `さらに押し下げる価値があるのは ${context.secondaryHighlight} の層で、そこが次の判断を変えるからです。`,
            ko: `더 눌러볼 가치가 있는 건 ${context.secondaryHighlight} 층이고, 그 층이 이후 판단을 바꾸기 때문입니다.`
          }
        },
        {
          label: { "zh-Hans": "落回原帖", "zh-Hant": "落回原貼", en: "Tie back", ja: "元投稿へ戻す", ko: "원문에 걸기" },
          addition: {
            "zh-Hans": `顺着 ${context.handle} 这条原帖继续接，我会把重点放在 ${context.primaryHighlight} 这层，因为它才是后续讨论真正会分叉的地方。`,
            "zh-Hant": `順著 ${context.handle} 這條原貼繼續接，我會把重點放在 ${context.primaryHighlight} 這層，因為它才是後續討論真正會分叉的地方。`,
            en: `If I stay attached to the original post, I would stress ${context.primaryHighlight} because that is the place where the thread actually splits.`,
            ja: `元投稿に沿うなら、${context.primaryHighlight} を、その後の議論が分かれる地点として置きます。`,
            ko: `원문 흐름을 유지한다면 ${context.primaryHighlight} 를 이후 대화가 갈라지는 지점으로 놓고 힘을 줄 것 같습니다.`
          }
        },
        {
          label: { "zh-Hans": "给半步", "zh-Hant": "給半步", en: "Half-step", ja: "半歩だけ", ko: "반 걸음" },
          addition: {
            "zh-Hans": `如果只再往前推半步，${context.topic} 里最值得展开的，其实是这层为什么还会继续发酵。`,
            "zh-Hant": `如果只再往前推半步，${context.topic} 裡最值得展開的，其實是這層為什麼還會繼續發酵。`,
            en: `If I only push half a step further, the expandable part in ${context.topic} is why this layer keeps generating more thread.`,
            ja: `半歩だけ進めるなら、${context.topic} で広がるのはこの層がなぜまだ発酵するのかという部分です。`,
            ko: `반 걸음만 더 간다면 ${context.topic} 에서 펼칠 만한 건 이 층이 왜 계속 발효되는지 쪽입니다.`
          }
        }
      ]);
  }
}

function buildDraftCloserOptions(draft, candidate, attributionSummary = null, toneKey = "neutral") {
  const tone = String(toneKey || "neutral");
  const context = getDraftContext(candidate, attributionSummary);
  const defaultTone = tone === "sharp" ? "warning" : tone === "warm" ? "success" : "soft";
  const build = (items) => items.map((item) => ({
    label: localize(item.label),
    closer: localize(item.closer),
    tone: item.tone || defaultTone
  }));

  switch (draft?.key) {
    case "memory":
      return build([
        {
          label: { "zh-Hans": "顺着收口", "zh-Hant": "順著收口", en: "Land on line", ja: "線を保つ", ko: "같은 선으로 닫기" },
          closer: {
            "zh-Hans": "所以我会继续沿这条记忆接，而不是临时换成一条新线。",
            "zh-Hant": "所以我會繼續沿這條記憶接，而不是臨時換成一條新線。",
            en: "So I would stay on this remembered line instead of switching to a new one at the end.",
            ja: "なので、最後で新しい線に変えるのではなく、この記憶の線をそのまま継ぎます。",
            ko: "그래서 끝에서 새 선으로 바꾸기보다 이 기억선을 그대로 잇겠습니다."
          }
        },
        {
          label: { "zh-Hans": "留问题", "zh-Hant": "留問題", en: "Leave a question", ja: "問いで締める", ko: "질문 남기기" },
          closer: {
            "zh-Hans": "如果继续沿这层往下聊，你最想先展开哪一段？",
            "zh-Hant": "如果繼續沿這層往下聊，你最想先展開哪一段？",
            en: "If we keep following this layer, which part would you want to open first?",
            ja: "この層をそのまま続けるなら、どこから先に開きたいですか。",
            ko: "이 층을 그대로 이어 간다면 어느 부분부터 먼저 열고 싶으신가요?"
          }
        },
        {
          label: { "zh-Hans": "稳一点", "zh-Hant": "穩一點", en: "Land steadily", ja: "安定して締める", ko: "안정적으로 닫기" },
          closer: {
            "zh-Hans": "顺着已验证过的切口收尾，会比重新开题更稳。",
            "zh-Hant": "順著已驗證過的切口收尾，會比重新開題更穩。",
            en: "Closing on a validated angle is steadier than reopening the topic from zero.",
            ja: "検証済みの切り口で閉じるほうが、あらためて話題を開き直すより安定します。",
            ko: "검증된 각도로 닫는 편이 주제를 새로 여는 것보다 훨씬 안정적입니다."
          }
        }
      ]);
    case "question":
      return build([
        {
          label: { "zh-Hans": "追变量", "zh-Hant": "追變量", en: "Chase variable", ja: "変数で締める", ko: "변수로 닫기" },
          closer: {
            "zh-Hans": "我反而会先把这个变量问清，再看结论站不站得住。",
            "zh-Hant": "我反而會先把這個變量問清，再看結論站不站得住。",
            en: "I would rather pin down that variable first, then see whether the conclusion can still stand.",
            ja: "先にこの変数をはっきりさせてから、その結論が立つかを見たいです。",
            ko: "저는 오히려 이 변수를 먼저 분명히 한 뒤에 결론이 버티는지 보고 싶습니다."
          }
        },
        {
          label: { "zh-Hans": "留问题", "zh-Hant": "留問題", en: "Leave a question", ja: "問いで締める", ko: "질문 남기기" },
          closer: {
            "zh-Hans": "你会先验证哪一个环节？",
            "zh-Hant": "你會先驗證哪一個環節？",
            en: "Which part would you validate first?",
            ja: "まずどの段を確かめますか。",
            ko: "어느 단계부터 먼저 검증해 보고 싶으신가요?"
          }
        },
        {
          label: { "zh-Hans": "往前带", "zh-Hant": "往前帶", en: "Move it forward", ja: "前へ運ぶ", ko: "앞으로 밀기" },
          closer: {
            "zh-Hans": "问到这一步，对话才算真的往前走。",
            "zh-Hant": "問到這一步，對話才算真的往前走。",
            en: "Once the question reaches this point, the conversation actually moves forward.",
            ja: "ここまで問えて初めて、会話が前へ進んだと言えます。",
            ko: "질문이 여기까지 와야 대화가 실제로 앞으로 나아간다고 볼 수 있습니다."
          }
        }
      ]);
    case "bridge":
      return build([
        {
          label: { "zh-Hans": "轻落点", "zh-Hant": "輕落點", en: "Soft landing", ja: "軽く着地", ko: "가볍게 착지" },
          closer: {
            "zh-Hans": "所以我会先把这一层补上，再看大家会不会继续往下接。",
            "zh-Hant": "所以我會先把這一層補上，再看大家會不會繼續往下接。",
            en: "So I would add this layer first and then see whether the thread keeps moving with it.",
            ja: "まずこの層を足して、そのあと議論が続くかを見ます。",
            ko: "그래서 저는 이 층을 먼저 보탠 뒤 스레드가 계속 이어지는지 보겠습니다."
          }
        },
        {
          label: { "zh-Hans": "留问题", "zh-Hant": "留問題", en: "Leave a question", ja: "問いで締める", ko: "질문 남기기" },
          closer: {
            "zh-Hans": "如果补这一层，你觉得最容易接住的是哪一段？",
            "zh-Hant": "如果補這一層，你覺得最容易接住的是哪一段？",
            en: "If this layer gets added, which part feels easiest to pick up from there?",
            ja: "この層を足すなら、どこが一番受け取りやすいと思いますか。",
            ko: "이 층을 보탠다면 어느 부분이 가장 자연스럽게 이어질 것 같나요?"
          }
        },
        {
          label: { "zh-Hans": "更顺", "zh-Hant": "更順", en: "Keep it smooth", ja: "自然に締める", ko: "더 자연스럽게" },
          closer: {
            "zh-Hans": "这样收口会比硬转方向自然得多。",
            "zh-Hant": "這樣收口會比硬轉方向自然得多。",
            en: "This kind of landing feels much more natural than forcing a pivot.",
            ja: "この閉じ方のほうが、無理に方向を変えるよりずっと自然です。",
            ko: "이런 식으로 닫는 편이 억지로 방향을 트는 것보다 훨씬 자연스럽습니다."
          }
        }
      ]);
    case "contrast":
      return build([
        {
          label: { "zh-Hans": "轻反差", "zh-Hant": "輕反差", en: "Soft contrast", ja: "軽い対比で締める", ko: "가벼운 반차이" },
          closer: {
            "zh-Hans": "所以我会轻轻拐一下这个角度，而不是再重复主流说法。",
            "zh-Hant": "所以我會輕輕拐一下這個角度，而不是再重複主流說法。",
            en: "So I would bend the angle slightly instead of repeating the dominant take one more time.",
            ja: "なので、主流の言い方をなぞるのではなく、少しだけ角度を曲げて締めます。",
            ko: "그래서 저는 주류 해석을 한 번 더 반복하기보다 각도를 살짝 틀어 마무리하겠습니다."
          }
        },
        {
          label: { "zh-Hans": "留问题", "zh-Hant": "留問題", en: "Leave a question", ja: "問いで締める", ko: "질문 남기기" },
          closer: {
            "zh-Hans": "你会觉得这层反差最先打到哪里？",
            "zh-Hant": "你會覺得這層反差最先打到哪裡？",
            en: "Where do you think this contrast lands first?",
            ja: "この対比は、どこに最初に効くと思いますか。",
            ko: "이 반차이가 가장 먼저 닿는 지점은 어디라고 보시나요?"
          }
        },
        {
          label: { "zh-Hans": "像真人一点", "zh-Hant": "像真人一點", en: "Sound human", ja: "人っぽく締める", ko: "사람답게 마무리" },
          closer: {
            "zh-Hans": "这种收法更像顺手接话，不像刻意唱反调。",
            "zh-Hant": "這種收法更像順手接話，不像刻意唱反調。",
            en: "This lands more like a natural reply than a forced contrarian move.",
            ja: "この閉じ方のほうが、わざと逆張りするより自然な返しに見えます。",
            ko: "이런 마무리는 억지 반대보다 자연스럽게 이어붙이는 답글처럼 들립니다."
          }
        }
      ]);
    case "perspective":
    default:
      return build([
        {
          label: { "zh-Hans": "轻落点", "zh-Hant": "輕落點", en: "Soft landing", ja: "軽く着地", ko: "가볍게 착지" },
          closer: {
            "zh-Hans": "所以我会先从这层接，而不是重复已经最显眼的结论。",
            "zh-Hant": "所以我會先從這層接，而不是重複已經最顯眼的結論。",
            en: "So I would start from this layer instead of repeating the most visible conclusion again.",
            ja: "だから、いちばん目立つ結論をなぞるのではなく、この層から入ります。",
            ko: "그래서 저는 가장 눈에 띄는 결론을 반복하기보다 이 층부터 붙겠습니다."
          }
        },
        {
          label: { "zh-Hans": "留问题", "zh-Hant": "留問題", en: "Leave a question", ja: "問いで締める", ko: "질문 남기기" },
          closer: {
            "zh-Hans": "你会更想先展开哪一段？",
            "zh-Hant": "你會更想先展開哪一段？",
            en: "Which part would you want to open first?",
            ja: "どの部分から先に開きたくなりますか。",
            ko: "어느 부분부터 먼저 열고 싶으신가요?"
          }
        },
        {
          label: { "zh-Hans": "留余味", "zh-Hant": "留餘味", en: "Leave room", ja: "余韻を残す", ko: "여운 남기기" },
          closer: {
            "zh-Hans": "如果顺着这层继续聊，后面的讨论会比表面热度更有意思。",
            "zh-Hant": "如果順著這層繼續聊，後面的討論會比表面熱度更有意思。",
            en: "If the thread keeps following this layer, the next part will be more interesting than the surface heat itself.",
            ja: "この層をそのまま追えば、次の議論は表面の熱量よりずっと面白くなります。",
            ko: "이 층을 그대로 따라가면 다음 대화는 표면 열기보다 훨씬 더 흥미로워질 겁니다."
          }
        }
      ]);
  }
}

function composeDraftText(candidate, draft, attributionSummary = null, toneKey = uiState.draftTone, activeRoute = null) {
  if (!draft) {
    return "";
  }
  const baseText = String(draft.text || draft.publicText || "").trim()
    || buildReplyReadyComposerText(String(draft.strategyText || draft.seedText || "").trim());
  return buildReplyReadyComposerText(baseText);
}

function buildComposerText(drafts, candidate, attributionSummary = null) {
  const selectedDraft = drafts[uiState.selectedDraftIndex] || drafts[0] || null;
  if (!selectedDraft) {
    uiState.composerText = "";
    uiState.draftSourceUrl = "";
    return "";
  }

  const activeRoute = uiState.draftRouteKey
    ? buildDraftRouteOptions(drafts, candidate, attributionSummary).find((route) => route.key === uiState.draftRouteKey) || null
    : null;
  const sourceKey = getDraftSourceKey(candidate, selectedDraft, uiState.draftTone);
  if (uiState.draftSourceUrl !== sourceKey || !uiState.composerText) {
    uiState.composerText = composeDraftText(candidate, selectedDraft, attributionSummary, uiState.draftTone, activeRoute);
    uiState.draftSourceUrl = sourceKey;
  }
  return uiState.composerText;
}

function createDraftCard(draft, index, isActive = false) {
  const t = getTexts();
  const card = document.createElement("article");
  card.className = "draftCard";
  card.dataset.variant = draft.tone || "soft";
  if (isActive) {
    card.classList.add("is-active");
  }

  const head = document.createElement("div");
  head.className = "draftCardHead";
  const angle = document.createElement("span");
  angle.className = "draftAnglePill";
  angle.textContent = localize({
    "zh-Hans": `草稿 ${index + 1}`,
    "zh-Hant": `草稿 ${index + 1}`,
    en: `Draft ${index + 1}`,
    ja: `下書き ${index + 1}`,
    ko: `초안 ${index + 1}`
  });
  const serial = document.createElement("span");
  serial.className = "draftCardSerial";
  serial.textContent = isActive
    ? localize({
        "zh-Hans": "当前使用",
        "zh-Hant": "目前使用",
        en: "Current",
        ja: "使用中",
        ko: "현재 사용 중"
      })
    : localize({
        "zh-Hans": "可切换",
        "zh-Hant": "可切換",
        en: "Available",
        ja: "切替可",
        ko: "전환 가능"
      });
  head.append(angle, serial);

  const body = document.createElement("p");
  body.className = "draftCardText";
  body.textContent = draft.text;

  const foot = document.createElement("div");
  foot.className = "draftCardFoot";
  const actions = document.createElement("div");
  actions.className = "draftQuickActions";
  const useButton = createDeskActionButton("use-draft", localize({
    "zh-Hans": isActive ? "正在编辑" : "设为当前稿",
    "zh-Hant": isActive ? "正在編輯" : "設為目前稿",
    en: isActive ? "Editing" : "Use this draft",
    ja: isActive ? "編集中" : "この稿を使う",
    ko: isActive ? "편집 중" : "이 초안 사용"
  }), "", isActive ? "accent" : "default");
  useButton.dataset.index = String(index);
  useButton.disabled = isActive;
  const copyButton = createDeskActionButton("copy-draft", t.copyDraftLabel, "", "primary");
  copyButton.dataset.copyText = draft.text;
  actions.append(useButton, copyButton);
  foot.append(actions);

  card.append(head, body, foot);
  return card;
}

function buildDraftSuggestions(candidate, attributionSummary = null) {
  if (!candidate) {
    return [];
  }
  const t = getTexts();
  const highlightList = getUserFacingCandidateHighlights(candidate, 3);
  const highlights = highlightList.length
    ? highlightList.slice(0, 2).join(localize({
        "zh-Hans": "、",
        "zh-Hant": "、",
        en: ", ",
        ja: "、",
        ko: ", "
      }))
    : localize({
        "zh-Hans": "这个切口",
        "zh-Hant": "這個切口",
        en: "this angle",
        ja: "この切り口",
        ko: "이 포인트"
      });
  const primaryHighlight = highlightList[0] || highlights;
  const secondaryHighlight = highlightList[1] || primaryHighlight;
  const topic = Array.isArray(candidate.matchedTopics) && candidate.matchedTopics.length
    ? getTopicLabel(candidate.matchedTopics[0])
    : formatDeskWindow(candidate.mediaKind);
  const laneDef = getCandidateLane(candidate);
  const lane = laneDef.label;
  const memoryTopic = attributionSummary?.topicKey ? getTopicLabel(attributionSummary.topicKey) : topic;
  const sharedFields = {
    primaryHighlight,
    secondaryHighlight,
    highlightLine: highlights,
    topic,
    memoryTopic,
    laneLabel: lane
  };
  const draftPlans = typeof DraftCore?.buildDraftPlan === "function"
    ? DraftCore.buildDraftPlan(candidate, attributionSummary, { laneKey: laneDef.key })
    : [
        { key: "perspective", tone: "accent" },
        { key: "question", tone: "soft" },
        { key: (candidate.replies || 0) > 40 ? "bridge" : "contrast", tone: "warning" }
      ];

  return draftPlans.map((plan) => {
    const buildDraftRecord = (key, tone, angle, hint, strategyText) => ({
      key,
      ...sharedFields,
      angle,
      tone,
      hint,
      strategyText,
      text: buildReplyReadyComposerText(strategyText)
    });

    switch (plan.key) {
      case "memory":
        return buildDraftRecord(
          "memory",
          plan.tone || "success",
          t.draftAngleMemory,
          localize({
            "zh-Hans": `顺着已经被验证过的 ${memoryTopic} 切口继续追`,
            "zh-Hant": `順著已被驗證過的 ${memoryTopic} 切口繼續追`,
            en: `Keep going on the ${memoryTopic} angle that already has proof behind it`,
            ja: `${memoryTopic} の実績ある切り口をそのまま伸ばす`,
            ko: `이미 반응이 검증된 ${memoryTopic} 각도를 이어가기`
          }),
          localize({
            "zh-Hans": `顺着 ${memoryTopic} 这条验证线继续接会更稳，${primaryHighlight} 已经被接住过，再往前推半步更容易把原来的互动续上。`,
            "zh-Hant": `順著 ${memoryTopic} 這條驗證線繼續接會更穩，${primaryHighlight} 已經被接住過，再往前推半步更容易把原來的互動續上。`,
            en: `The steadier move is to stay on the validated ${memoryTopic} line. ${primaryHighlight} already got picked up once, so one more half-step is enough to carry the interaction forward.`,
            ja: `${memoryTopic} の検証線をそのまま継ぐほうが安定します。${primaryHighlight} はすでに一度拾われていて、半歩足すだけで流れを続けやすいです。`,
            ko: `${memoryTopic} 검증선을 그대로 잇는 편이 더 안정적입니다. ${primaryHighlight} 는 이미 한 번 받아들여져서 반 걸음만 더 밀어도 흐름을 이어가기 쉽습니다.`
          })
        );
      case "question":
        return buildDraftRecord(
          "question",
          plan.tone || "soft",
          t.draftAngleQuestion,
          localize({
            "zh-Hans": "用问题把对话往下带一层",
            "zh-Hant": "用問題把對話往下帶一層",
            en: "Pull the thread deeper with a question",
            ja: "質問で会話を一段深くする",
            ko: "질문으로 대화를 한 단계 더 깊게 끌어가기"
          }),
          localize({
            "zh-Hans": `如果顺着 ${highlights} 继续往前推，真正决定后续走向的变量会是什么？`,
            "zh-Hant": `如果順著 ${highlights} 繼續往前推，真正決定後續走向的變量會是什麼？`,
            en: `If ${highlights} keeps moving forward, what is the variable that actually decides where it goes next?`,
            ja: `${highlights} をそのまま前へ進めたとき、次の流れを本当に決める変数は何でしょうか。`,
            ko: `${highlights} 가 계속 앞으로 갈 때, 다음 방향을 실제로 결정하는 변수는 무엇일까요?`
          })
        );
      case "bridge":
        return buildDraftRecord(
          "bridge",
          plan.tone || "warning",
          t.draftAngleBridge,
          localize({
            "zh-Hans": `${lane} 场景下更适合做补充延展，而不是硬转方向`,
            "zh-Hant": `${lane} 場景下更適合做補充延展，而不是硬轉方向`,
            en: `In a ${lane.toLowerCase()} window, extend instead of forcing a hard pivot`,
            ja: `${lane} の場面では、無理にひねるより補足で伸ばす方が自然です`,
            ko: `${lane} 상황에서는 억지 전환보다 자연스럽게 이어 붙이는 편이 좋습니다`
          }),
          localize({
            "zh-Hans": `表层反应已经够明显了，但把 ${highlights} 放回 ${topic} 这个语境里，后面还有一层没被真正展开。`,
            "zh-Hant": `表層反應已經夠明顯了，但把 ${highlights} 放回 ${topic} 這個語境裡，後面還有一層沒被真正展開。`,
            en: `The surface reaction is already clear enough, but once ${highlights} goes back into the ${topic} context, there is still another layer nobody has really opened yet.`,
            ja: `表面の反応はもう十分見えていますが、${highlights} を ${topic} の文脈へ戻すと、まだ誰も本当に開いていない次の層があります。`,
            ko: `겉반응은 이미 충분히 보이지만 ${highlights} 를 ${topic} 맥락에 다시 놓으면 아직 아무도 제대로 열지 않은 다음 층이 남아 있습니다.`
          })
        );
      case "contrast":
        return buildDraftRecord(
          "contrast",
          plan.tone || "warning",
          t.draftAngleContrarian,
          localize({
            "zh-Hans": `${lane} 场景下更像真人回复，不像模板`,
            "zh-Hant": `${lane} 場景下更像真人回覆，不像模板`,
            en: `Fits a ${lane.toLowerCase()} window without sounding templated`,
            ja: `${lane} の場面でもテンプレっぽく見えにくい`,
            ko: `${lane} 상황에서도 템플릿보다 사람답게 들림`
          }),
          localize({
            "zh-Hans": `最显眼的那层未必最值得接，${highlights} 这边反而更有后劲，也更容易把讨论往下带。`,
            "zh-Hant": `最顯眼的那層未必最值得接，${highlights} 這邊反而更有後勁，也更容易把討論往下帶。`,
            en: `The loudest layer is not always the best one to answer first. ${highlights} has more staying power and is more likely to move the discussion forward.`,
            ja: `いちばん目立つ層が、いちばん返す価値があるとは限りません。${highlights} のほうが後まで効き、議論も前へ運びやすいです。`,
            ko: `가장 눈에 띄는 층이 가장 답글할 가치가 있는 건 아닙니다. ${highlights} 쪽이 더 오래 가고 대화도 더 앞으로 밀기 쉽습니다.`
          })
        );
      case "perspective":
      default:
        return buildDraftRecord(
          "perspective",
          plan.tone || "accent",
          t.draftAnglePerspective,
          localize({
            "zh-Hans": `顺着 ${highlights} 做观点补充`,
            "zh-Hant": `順著 ${highlights} 做觀點補充`,
            en: `Build a perspective on top of ${highlights}`,
            ja: `${highlights} を軸に見方を足す`,
            ko: `${highlights} 를 바탕으로 관점을 보태기`
          }),
          localize({
            "zh-Hans": `${highlights} 才是更值得继续聊的一层。表层热度大家都看到了，真正能把讨论带下去的是这里。`,
            "zh-Hant": `${highlights} 才是更值得繼續聊的一層。表層熱度大家都看到了，真正能把討論帶下去的是這裡。`,
            en: `${highlights} is the layer more worth continuing. Everyone already sees the surface heat, but this is the part that can actually carry the thread forward.`,
            ja: `続けて話す価値があるのは ${highlights} の層です。表面の熱量はもう見えていて、議論を先へ運べるのはここです。`,
            ko: `${highlights} 쪽이 더 계속 이야기할 가치가 있는 층입니다. 겉열기는 이미 모두가 봤고, 실제로 대화를 앞으로 끌고 갈 수 있는 곳은 여기입니다.`
          })
        );
    }
  });
}

function getGrowthMetricMeta(type) {
  switch (type) {
    case "executed":
      return localize({ "zh-Hans": "已执行动作", "zh-Hant": "已執行動作", en: "Executed", ja: "実行済み", ko: "실행 완료" });
    case "pending":
      return localize({ "zh-Hans": "等待处理", "zh-Hant": "等待處理", en: "Pending", ja: "対応待ち", ko: "처리 대기" });
    case "hot":
      return localize({ "zh-Hans": "建议先动手", "zh-Hant": "建議先動手", en: "Work first", ja: "先に触る", ko: "먼저 움직이기" });
    case "coverage":
      return localize({ "zh-Hans": "回复 / 机会", "zh-Hant": "回覆 / 機會", en: "Replies / opportunities", ja: "返信 / 機会", ko: "답글 / 기회" });
    case "lift":
    default:
      return localize({ "zh-Hans": "方向性估算", "zh-Hant": "方向性估算", en: "Directional estimate", ja: "方向感の推定", ko: "방향성 추정" });
  }
}

function getCompactGrowthMetricContent(metric) {
  switch (metric?.key) {
    case "repliesToday":
      return {
        label: getTexts().growthRepliesSentLabel,
        meta: getGrowthMetricMeta("executed")
      };
    case "liveQueue":
      return {
        label: localize({ "zh-Hans": "待执行", "zh-Hant": "待執行", en: "Live queue", ja: "進行中キュー", ko: "진행 중 큐" }),
        meta: localize({ "zh-Hans": metric?.value ? "仍在排期中的回复" : "当前没有挂着的排队项", "zh-Hant": metric?.value ? "仍在排期中的回覆" : "目前沒有掛著的排隊項", en: metric?.value ? "Replies still staged" : "No staged replies right now", ja: metric?.value ? "まだ予定にある返信" : "現在はキュー待ちなし", ko: metric?.value ? "아직 예약 중인 답글" : "현재 대기 중인 답글 없음" })
      };
    case "awaitingConfirm":
      return {
        label: localize({ "zh-Hans": "待确认", "zh-Hant": "待確認", en: "Awaiting confirm", ja: "確認待ち", ko: "확인 대기" }),
        meta: localize({ "zh-Hans": metric?.value ? "回复框已拉起，等最后关单" : "暂无半途中的执行项", "zh-Hant": metric?.value ? "回覆框已拉起，等最後關單" : "暫無半途中的執行項", en: metric?.value ? "Composer opened; waiting to close the loop" : "No half-finished execution right now", ja: metric?.value ? "返信欄は開いており最終確認待ちです" : "中途の実行項目はありません", ko: metric?.value ? "답글 창은 열렸고 마지막 확인만 남았습니다" : "중간에 멈춘 실행 항목이 없습니다" })
      };
    case "needsAction":
      return {
        label: localize({ "zh-Hans": "需处理", "zh-Hant": "需處理", en: "Needs action", ja: "今やる", ko: "지금 처리" }),
        meta: metric?.failedCount
          ? localize({ "zh-Hans": `含 ${metric.failedCount} 条接回失败`, "zh-Hant": `含 ${metric.failedCount} 條接回失敗`, en: `${metric.failedCount} failed recoveries included`, ja: `${metric.failedCount} 件のリカバリ失敗を含む`, ko: `${metric.failedCount}개 핸드오프 실패 포함` })
          : metric?.overdueCount
            ? localize({ "zh-Hans": "含过窗项目", "zh-Hant": "含過窗項目", en: "Includes overdue work", ja: "期限超過あり", ko: "기한 지난 항목 포함" })
            : localize({ "zh-Hans": metric?.value ? "临近窗口" : "目前节奏平稳", "zh-Hant": metric?.value ? "臨近窗口" : "目前節奏平穩", en: metric?.value ? "Due soon" : "Rhythm is stable right now", ja: metric?.value ? "もうすぐ対応" : "いまは安定しています", ko: metric?.value ? "곧 처리 예정" : "현재 리듬은 안정적입니다" })
      };
    case "pickupDue":
      return {
        label: localize({ "zh-Hans": "待复查", "zh-Hant": "待複查", en: "Pickup due", ja: "要再確認", ko: "재확인" }),
        meta: localize({ "zh-Hans": metric?.value ? "已发出的回复还没看后续" : "已发出的回复都至少看过一次", "zh-Hant": metric?.value ? "已發出的回覆還沒看後續" : "已發出的回覆都至少看過一次", en: metric?.value ? "Shipped replies still need follow-up" : "Every shipped reply has been checked at least once", ja: metric?.value ? "送信済み返信のその後をまだ見ていません" : "送信済み返信はすべて一度確認済みです", ko: metric?.value ? "발송된 답글의 후속 반응을 아직 봐야 합니다" : "발송된 답글은 모두 한 번 이상 확인했습니다" })
      };
    case "pickedUp":
      return {
        label: localize({ "zh-Hans": "被接住", "zh-Hant": "被接住", en: "Picked up", ja: "反応あり", ko: "반응 잡힘" }),
        meta: metric?.authorBackCount
          ? localize({ "zh-Hans": `其中 ${metric.authorBackCount} 条出现作者回流`, "zh-Hant": `其中 ${metric.authorBackCount} 條出現作者回流`, en: `${metric.authorBackCount} of them pulled the author back`, ja: `${metric.authorBackCount} 件で作者の再参加が見えています`, ko: `${metric.authorBackCount}개는 작성자 재참여가 보였습니다` })
          : localize({ "zh-Hans": metric?.value ? "线程已经开始继续长" : "还没有看到明显 pickup", "zh-Hant": metric?.value ? "線程已經開始繼續長" : "還沒有看到明顯 pickup", en: metric?.value ? "The thread is visibly moving" : "No visible pickup yet", ja: metric?.value ? "スレッドが実際に伸び始めています" : "まだ明確な反応はありません", ko: metric?.value ? "스레드가 실제로 이어지기 시작했습니다" : "아직 눈에 보이는 pickup은 없습니다" })
      };
    default:
      return {
        label: localize({ "zh-Hans": "增长指标", "zh-Hant": "增長指標", en: "Growth metric", ja: "成長指標", ko: "성장 지표" }),
        meta: ""
      };
  }
}

function getGrowthTruthItemContent(item) {
  switch (item?.key) {
    case "toClose":
      return {
        label: localize({ "zh-Hans": "待收口", "zh-Hant": "待收口", en: "To close", ja: "収口待ち", ko: "마감 필요" }),
        value: String(item?.value || 0)
      };
    case "authorBack":
      return {
        label: localize({ "zh-Hans": "作者回流", "zh-Hant": "作者回流", en: "Author back", ja: "作者再参加", ko: "작성자 재참여" }),
        value: String(item?.value || 0)
      };
    case "settled":
      return {
        label: localize({ "zh-Hans": "已结案", "zh-Hant": "已結案", en: "Settled", ja: "完了", ko: "정리 완료" }),
        value: String(item?.value || 0)
      };
    case "reviewCoverage":
      return {
        label: localize({ "zh-Hans": "巡检覆盖", "zh-Hant": "巡檢覆蓋", en: "Review coverage", ja: "確認率", ko: "리뷰 커버" }),
        value: `${Number(item?.value || 0)}%`
      };
    default:
      return {
        label: localize({ "zh-Hans": "状态", "zh-Hant": "狀態", en: "State", ja: "状態", ko: "상태" }),
        value: String(item?.value || 0)
      };
  }
}

function getTopicDisplayName(topicKey) {
  const group = TOPIC_GROUPS.find((item) => item.key === topicKey);
  if (!group) {
    return String(topicKey || "").trim() || localize({ "zh-Hans": "话题", "zh-Hant": "話題", en: "Topic", ja: "トピック", ko: "주제" });
  }
  return localize(group.title)
    .replace(/\s*关键词$/u, "")
    .replace(/\s*關鍵詞$/u, "")
    .replace(/\s*keywords$/iu, "")
    .replace(/\s*キーワード$/u, "")
    .replace(/\s*키워드$/u, "");
}

function getAttributionMemoryTitle() {
  return localize({
    "zh-Hans": "归因记忆",
    "zh-Hant": "歸因記憶",
    en: "Attribution memory",
    ja: "アトリビューション記憶",
    ko: "기여 기억"
  });
}

function getAttributionMemoryMeta(replyCount, queueCounts, pickupCounts = getPickupLifecycleCounts()) {
  if (!replyCount) {
    return localize({
      "zh-Hans": "先把真实回复跑起来，ReplyDrop 才能知道哪些 handle / topic 真在落地。",
      "zh-Hant": "先把真實回覆跑起來，ReplyDrop 才能知道哪些 handle / topic 真在落地。",
      en: "Ship a few real replies first so ReplyDrop can learn which handles and topics actually land.",
      ja: "実際の返信が少し溜まると、どの相手や話題が効いているか見え始めます。",
      ko: "실제 답글이 조금 쌓여야 어떤 핸들과 주제가 먹히는지 보이기 시작합니다."
    });
  }
  return localize({
    "zh-Hans": `${replyCount} 条真实回复 + ${queueCounts.live} 条待执行${pickupCounts.pickedUp || pickupCounts.authorEngaged ? ` · ${pickupCounts.pickedUp + pickupCounts.authorEngaged} 条已被接住` : ""}，开始形成可追的增长记忆。`,
    "zh-Hant": `${replyCount} 條真實回覆 + ${queueCounts.live} 條待執行${pickupCounts.pickedUp || pickupCounts.authorEngaged ? ` · ${pickupCounts.pickedUp + pickupCounts.authorEngaged} 條已被接住` : ""}，開始形成可追的增長記憶。`,
    en: `${replyCount} real replies + ${queueCounts.live} live queue items${pickupCounts.pickedUp || pickupCounts.authorEngaged ? ` · ${pickupCounts.pickedUp + pickupCounts.authorEngaged} already picked up` : ""} are now forming trackable growth memory.`,
    ja: `実返信 ${replyCount} 件と進行中キュー ${queueCounts.live} 件${pickupCounts.pickedUp || pickupCounts.authorEngaged ? ` · ${pickupCounts.pickedUp + pickupCounts.authorEngaged} 件で反応が伸びています` : ""}で、追える成長記憶ができ始めています。`,
    ko: `실제 답글 ${replyCount}개와 진행 중 큐 ${queueCounts.live}개${pickupCounts.pickedUp || pickupCounts.authorEngaged ? ` · ${pickupCounts.pickedUp + pickupCounts.authorEngaged}개는 반응이 붙었습니다` : ""}가 이제 추적 가능한 성장 기억을 만들기 시작했습니다.`
  });
}

function buildAttributionMemoryItems(replyEntries, queueItems, candidates) {
  if (typeof AttributionCore?.buildAttributionSignalModel !== "function") {
    return [];
  }

  const model = AttributionCore.buildAttributionSignalModel(replyEntries, queueItems, candidates, { now: Date.now() });
  uiState.attributionSignalModel = model;
  const insights = typeof AttributionCore?.buildAttributionInsightTargets === "function"
    ? AttributionCore.buildAttributionInsightTargets(model, { limit: 2 })
    : [];

  return insights.map((insight) => {
    if (insight.kind === "handle") {
      const topHandle = insight.stat;
      const handleAction = topHandle.candidate?.url
        ? { action: "focus-candidate", payload: topHandle.candidate.url, label: localize({ "zh-Hans": "切到这条", "zh-Hant": "切到這條", en: "Focus", ja: "この候補", ko: "이 후보" }) }
        : topHandle.latestUrl
          ? { action: "open-post", payload: topHandle.latestUrl, label: localize({ "zh-Hans": "打开记录", "zh-Hant": "打開記錄", en: "Open log", ja: "記録を開く", ko: "기록 열기" }) }
          : null;
      const handleHasPickup = topHandle.pickedUp > 0;
      const handleHasAuthorBack = topHandle.authorEngaged > 0;
      return {
        title: `@${topHandle.handle}`,
        tone: handleHasAuthorBack ? "success" : topHandle.candidate ? "accent" : handleHasPickup ? "success" : "soft",
        reason: handleHasAuthorBack
          ? localize({
              "zh-Hans": `这位已经出现 ${topHandle.authorEngaged} 次可见作者回流，而且 ${topHandle.settled} 条回复已完成复查，不只是发出去，而是真的开始形成可复用的互动记忆。`,
              "zh-Hant": `這位已經出現 ${topHandle.authorEngaged} 次可見作者回流，而且 ${topHandle.settled} 條回覆已完成複查，不只是發出去，而是真的開始形成可複用的互動記憶。`,
              en: `This handle already produced visible author re-engagement ${topHandle.authorEngaged} time(s), which is stronger than ship-only memory.`,
              ja: `この相手では作者の再参加が ${topHandle.authorEngaged} 回見えており、送信済みの記録以上の価値があります。`,
              ko: `이 핸들에서는 작성자 재참여가 ${topHandle.authorEngaged}회 보였습니다. 단순 발송 기록보다 강한 신호입니다.`
            })
          : handleHasPickup
            ? localize({
                "zh-Hans": `这位已经有 ${topHandle.pickedUp} 条 reply 被线程接住，另有 ${topHandle.reviewed} 条完成过复查，值得继续沿相同切口追。`,
                "zh-Hant": `這位已經有 ${topHandle.pickedUp} 條 reply 被線程接住，另有 ${topHandle.reviewed} 條完成過複查，值得繼續沿相同切口追。`,
                en: `${topHandle.pickedUp} shipped replies with this handle were visibly picked up by the thread.`,
                ja: `この相手では ${topHandle.pickedUp} 件の返信がスレッドに拾われています。`,
                ko: `이 핸들에는 스레드가 받아준 답글이 ${topHandle.pickedUp}개 있습니다.`
              })
            : topHandle.candidate
              ? localize({
                  "zh-Hans": `这位已经有 ${topHandle.count} 次真实回复记录，而且又回到候选池；系统默认更偏向 ${getQueueSlotTexts(topHandle.preferredSlot || "next").label} 处理。`,
                  "zh-Hant": `這位已經有 ${topHandle.count} 次真實回覆記錄，而且又回到候選池；系統預設更偏向 ${getQueueSlotTexts(topHandle.preferredSlot || "next").label} 處理。`,
                  en: `${topHandle.count} real replies already landed here, and this handle is back in the inbox.`,
                  ja: `${topHandle.count} 件の実返信があり、しかもまた候補に戻ってきています。`,
                  ko: `이 핸들에는 이미 실제 답글 ${topHandle.count}회가 쌓였고, 다시 후보로 돌아왔습니다.`
                })
              : localize({
                  "zh-Hans": `这位已经形成 ${topHandle.count} 次真实回复记忆，其中 ${topHandle.reviewed} 条进入过复查，后续可继续沿着相同切口追。`,
                  "zh-Hant": `這位已經形成 ${topHandle.count} 次真實回覆記憶，其中 ${topHandle.reviewed} 條進入過複查，後續可繼續沿著相同切口追。`,
                  en: `${topHandle.count} real replies already landed with this handle. Keep the same thread warm.`,
                  ja: `この相手にはすでに ${topHandle.count} 件の実返信記憶があります。`,
                  ko: `이 핸들에는 이미 실제 답글 ${topHandle.count}회 분량의 기억이 쌓였습니다.`
                }),
        meta: `${topHandle.count} ${localize({ "zh-Hans": "次落地", "zh-Hant": "次落地", en: "landed", ja: "件着地", ko: "회 발송" })}${topHandle.queued ? ` · ${topHandle.queued} ${localize({ "zh-Hans": "条待执行", "zh-Hant": "條待執行", en: "queued", ja: "件キュー", ko: "개 대기" })}` : ""}${handleHasPickup ? ` · ${topHandle.pickedUp} ${localize({ "zh-Hans": "条被接住", "zh-Hant": "條被接住", en: "picked up", ja: "件反応", ko: "개 반응" })}` : ""}${topHandle.reviewed ? ` · ${topHandle.reviewed} ${localize({ "zh-Hans": "条已复查", "zh-Hant": "條已複查", en: "reviewed", ja: "件再確認", ko: "개 재확인" })}` : ""}`,
        badges: [
          ...(handleHasAuthorBack ? [localize({ "zh-Hans": "作者回流", "zh-Hant": "作者回流", en: "Author back", ja: "作者再参加", ko: "작성자 재참여" })] : []),
          ...Array.from(topHandle.topics).slice(0, 1).map((topic) => getTopicDisplayName(topic)),
          ...(topHandle.preferredSlot ? [getQueueSlotTexts(topHandle.preferredSlot).label] : [])
        ],
        action: handleAction
      };
    }

    if (insight.kind === "topic") {
      const topTopic = insight.stat;
      const topicAction = topTopic.candidate?.url
        ? { action: "focus-candidate", payload: topTopic.candidate.url, label: localize({ "zh-Hans": "看这条", "zh-Hant": "看這條", en: "Open candidate", ja: "候補を見る", ko: "후보 보기" }) }
        : null;
      return {
        title: localize({
          "zh-Hans": `${getTopicDisplayName(topTopic.key)} 正在兑现`,
          "zh-Hant": `${getTopicDisplayName(topTopic.key)} 正在兌現`,
          en: `${getTopicDisplayName(topTopic.key)} is converting`,
          ja: `${getTopicDisplayName(topTopic.key)} が効いている`,
          ko: `${getTopicDisplayName(topTopic.key)} 주제가 실제로 먹히고 있음`
        }),
        tone: topTopic.authorEngaged ? "success" : topTopic.queued ? "accent" : topTopic.pickedUp ? "success" : "soft",
        reason: localize({
          "zh-Hans": `这个主题已经带来 ${topTopic.shipped} 条真实回复${topTopic.pickedUp ? `，其中 ${topTopic.pickedUp} 条被接住` : ""}${topTopic.reviewed ? `，另有 ${topTopic.reviewed} 条完成复查` : ""}${topTopic.queued ? `，还有 ${topTopic.queued} 条在队列里` : ""}。`,
          "zh-Hant": `這個主題已經帶來 ${topTopic.shipped} 條真實回覆${topTopic.pickedUp ? `，其中 ${topTopic.pickedUp} 條被接住` : ""}${topTopic.reviewed ? `，另有 ${topTopic.reviewed} 條完成複查` : ""}${topTopic.queued ? `，還有 ${topTopic.queued} 條在隊列裡` : ""}。`,
          en: `${topTopic.shipped} real replies already came from this topic${topTopic.pickedUp ? `, with ${topTopic.pickedUp} visibly picked up` : ""}${topTopic.queued ? ` and ${topTopic.queued} more still staged` : ""}.`,
          ja: `この話題から実返信が ${topTopic.shipped} 件あり${topTopic.pickedUp ? `、そのうち ${topTopic.pickedUp} 件は反応が伸びています` : ""}${topTopic.queued ? `。さらに ${topTopic.queued} 件がキュー中です` : ""}。`,
          ko: `이 주제에서 실제 답글 ${topTopic.shipped}개가 나왔고${topTopic.pickedUp ? `, 그중 ${topTopic.pickedUp}개는 반응이 붙었습니다` : ""}${topTopic.queued ? `. 추가로 ${topTopic.queued}개가 큐에 있습니다` : ""}.`
        }),
        meta: `${topTopic.shipped} ${localize({ "zh-Hans": "条已发出", "zh-Hant": "條已發出", en: "shipped", ja: "件送信", ko: "개 발송" })}${topTopic.pickedUp ? ` · ${topTopic.pickedUp} ${localize({ "zh-Hans": "条被接住", "zh-Hant": "條被接住", en: "picked up", ja: "件反応", ko: "개 반응" })}` : ""}${topTopic.reviewed ? ` · ${topTopic.reviewed} ${localize({ "zh-Hans": "条已复查", "zh-Hant": "條已複查", en: "reviewed", ja: "件再確認", ko: "개 재확인" })}` : ""}${topTopic.queued ? ` · ${topTopic.queued} ${localize({ "zh-Hans": "条待执行", "zh-Hant": "條待執行", en: "queued", ja: "件キュー", ko: "개 대기" })}` : ""}`,
        badges: [
          getTopicDisplayName(topTopic.key),
          ...(topTopic.preferredSlot ? [getQueueSlotTexts(topTopic.preferredSlot).label] : []),
          ...(topTopic.authorEngaged ? [localize({ "zh-Hans": "作者回流", "zh-Hant": "作者回流", en: "Author back", ja: "作者再参加", ko: "작성자 재참여" })] : [])
        ],
        action: topicAction
      };
    }

    if (insight.kind === "lane") {
      const topLane = insight.stat;
      return {
        title: localize({
          "zh-Hans": `${topLane.lane} 最像真实工作流`,
          "zh-Hant": `${topLane.lane} 最像真實工作流`,
          en: `${topLane.lane} is behaving like a real workflow`,
          ja: `${topLane.lane} が一番実運用に近い`,
          ko: `${topLane.lane} 레인이 가장 실제 워크플로처럼 움직임`
        }),
        tone: topLane.authorEngaged ? "success" : topLane.pickedUp ? "accent" : topLane.queued ? "warning" : "soft",
        reason: localize({
          "zh-Hans": `${topLane.shipped} 条已落地${topLane.pickedUp ? `，其中 ${topLane.pickedUp} 条被接住` : ""}${topLane.settled ? `，${topLane.settled} 条已经走完复查` : ""}${topLane.queued ? `，还有 ${topLane.queued} 条在继续排期` : "，说明这条节奏已经跑通"}。`,
          "zh-Hant": `${topLane.shipped} 條已落地${topLane.pickedUp ? `，其中 ${topLane.pickedUp} 條被接住` : ""}${topLane.settled ? `，${topLane.settled} 條已經走完複查` : ""}${topLane.queued ? `，還有 ${topLane.queued} 條在繼續排期` : "，說明這條節奏已經跑通"}。`,
          en: `${topLane.shipped} replies already landed here${topLane.pickedUp ? `, with ${topLane.pickedUp} visibly picked up` : ""}${topLane.queued ? ` and ${topLane.queued} more still moving through the queue` : ", which means this rhythm is real now"}.`,
          ja: `${topLane.shipped} 件が着地済み${topLane.pickedUp ? `で、そのうち ${topLane.pickedUp} 件は反応が伸びています` : ""}${topLane.queued ? `。さらに ${topLane.queued} 件が進行中です` : "。この流れが実際に回っています"}。`,
          ko: `${topLane.shipped}개가 이미 착지했고${topLane.pickedUp ? `, 그중 ${topLane.pickedUp}개는 반응이 붙었습니다` : ""}${topLane.queued ? `. 추가로 ${topLane.queued}개가 계속 큐를 타고 있습니다` : ", 이 리듬이 실제로 작동하고 있습니다"}.`
        }),
        meta: `${topLane.shipped} ${localize({ "zh-Hans": "条已发出", "zh-Hant": "條已發出", en: "shipped", ja: "件送信", ko: "개 발송" })}${topLane.pickedUp ? ` · ${topLane.pickedUp} ${localize({ "zh-Hans": "条被接住", "zh-Hant": "條被接住", en: "picked up", ja: "件反応", ko: "개 반응" })}` : ""}${topLane.settled ? ` · ${topLane.settled} ${localize({ "zh-Hans": "条已结案", "zh-Hant": "條已結案", en: "settled", ja: "件完了", ko: "개 정리됨" })}` : ""}${topLane.queued ? ` · ${topLane.queued} ${localize({ "zh-Hans": "条待执行", "zh-Hant": "條待執行", en: "queued", ja: "件キュー", ko: "개 대기" })}` : ""}`,
        badges: [
          topLane.lane,
          ...(topLane.preferredSlot ? [getQueueSlotTexts(topLane.preferredSlot).label] : []),
          ...(topLane.authorEngaged ? [localize({ "zh-Hans": "作者回流", "zh-Hant": "作者回流", en: "Author back", ja: "作者再参加", ko: "작성자 재참여" })] : [])
        ],
        action: { action: "set-queue-filter", payload: topLane.queued ? "action" : "done", label: localize({ "zh-Hans": topLane.queued ? "看待执行" : "看已落地", "zh-Hant": topLane.queued ? "看待執行" : "看已落地", en: topLane.queued ? "View action" : "View done", ja: topLane.queued ? "進行中を見る" : "完了を見る", ko: topLane.queued ? "진행 보기" : "완료 보기" }) }
      };
    }

    return null;
  }).filter(Boolean);
}

function createAttributionMemoryCard(item, index) {
  const card = document.createElement("article");
  card.className = "attributionMemoryCard";
  card.dataset.tone = item.tone || "soft";
  const top = document.createElement("div");
  top.className = "attributionMemoryTop";
  top.innerHTML = `<strong>${escapeHtml(item.title)}</strong><span class="attributionMemorySerial">RD-AM${String(index + 1).padStart(2, "0")}</span>`;
  const reason = document.createElement("p");
  reason.className = "attributionMemoryReason";
  reason.textContent = item.reason;
  const meta = document.createElement("div");
  meta.className = "attributionMemoryMeta";
  meta.appendChild(createSummaryChip(item.meta, item.tone || "soft"));
  (item.badges || []).slice(0, 2).forEach((badge) => {
    meta.appendChild(createSummaryChip(badge, "soft"));
  });
  if (item.action?.action) {
    meta.appendChild(createDeskActionButton(item.action.action, item.action.label, item.action.payload || "", item.tone || "soft"));
  }
  card.append(top, reason, meta);
  return card;
}

function getRelationshipMetaText(count) {
  if (!count) {
    return getTexts().relationshipEmpty;
  }
  return localize({
    "zh-Hans": `${count} 个最近互动对象`,
    "zh-Hant": `${count} 個最近互動對象`,
    en: `${count} recent relationships`,
    ja: `最近の関係 ${count} 件`,
    ko: `최근 관계 ${count}개`
  });
}

function createDraftWorkbench(drafts, candidate, recommendedSlot = "", attributionSummary = null) {
  const composerText = buildComposerText(drafts, candidate, attributionSummary);
  const workbench = document.createElement("section");
  workbench.className = "draftWorkbench";

  const head = document.createElement("div");
  head.className = "draftWorkbenchHead";
  head.innerHTML = `
    <strong>${escapeHtml(localize({
      "zh-Hans": "正式回复草稿",
      "zh-Hant": "正式回覆草稿",
      en: "Reply draft",
      ja: "返信草稿",
      ko: "답글 초안"
    }))}</strong>
    <span>${escapeHtml(localize({
      "zh-Hans": "这里只展示可直接复制或发送的版本。",
      "zh-Hant": "這裡只展示可直接複製或發送的版本。",
      en: "Only send-ready copy is shown here.",
      ja: "ここにはそのまま使える草稿だけを表示します。",
      ko: "여기에는 바로 복사하거나 보낼 수 있는 버전만 표시합니다."
    }))}</span>
  `;

  const composer = document.createElement("div");
  composer.className = "draftComposer";

  const textarea = document.createElement("textarea");
  textarea.className = "draftComposerTextarea";
  textarea.rows = 5;
  textarea.value = composerText;
  textarea.placeholder = localize({
    "zh-Hans": "这里展示正式回复草稿，你可以直接复制，也可以再手动微调一遍。",
    "zh-Hant": "這裡展示正式回覆草稿，你可以直接複製，也可以再手動微調一遍。",
    en: "This shows the send-ready reply draft. Copy it directly or make a quick manual pass.",
    ja: "ここにはそのまま使える返信草稿を表示します。必要なら少しだけ手で直せます。",
    ko: "여기에는 바로 쓸 수 있는 답글 초안을 보여줍니다. 필요하면 조금만 손보면 됩니다."
  });

  const foot = document.createElement("div");
  foot.className = "draftComposerFoot";
  const meta = document.createElement("div");
  meta.className = "draftComposerMeta";
  meta.textContent = candidate
    ? `${candidate.authorHandle ? `@${candidate.authorHandle}` : "candidate"} · ${localize({
        "zh-Hans": `草稿 ${uiState.selectedDraftIndex + 1}`,
        "zh-Hant": `草稿 ${uiState.selectedDraftIndex + 1}`,
        en: `Draft ${uiState.selectedDraftIndex + 1}`,
        ja: `下書き ${uiState.selectedDraftIndex + 1}`,
        ko: `초안 ${uiState.selectedDraftIndex + 1}`
      })}`
    : localize({ "zh-Hans": "等待候选", "zh-Hant": "等待候選", en: "Waiting for candidate", ja: "候補待ち", ko: "후보 대기" });
  if (candidate && recommendedSlot) {
    const slotHint = document.createElement("span");
    slotHint.className = "draftComposerHintChip";
    slotHint.textContent = localize({
      "zh-Hans": `建议排期：${getQueueSlotTexts(recommendedSlot).label}`,
      "zh-Hant": `建議排期：${getQueueSlotTexts(recommendedSlot).label}`,
      en: `Recommended: ${getQueueSlotTexts(recommendedSlot).label}`,
      ja: `推奨: ${getQueueSlotTexts(recommendedSlot).label}`,
      ko: `추천: ${getQueueSlotTexts(recommendedSlot).label}`
    });
    meta.appendChild(slotHint);
  }

  const queueControls = document.createElement("div");
  queueControls.className = "draftQueueControls";
  ["next", "tonight", "tomorrow"].forEach((slot) => {
    const slotButton = document.createElement("button");
    slotButton.type = "button";
    slotButton.className = "miniPillButton";
    slotButton.dataset.action = "queue-composer";
    slotButton.dataset.slot = slot;
    slotButton.textContent = getQueueSlotTexts(slot).label;
    slotButton.classList.toggle("active", slot === recommendedSlot);
    queueControls.appendChild(slotButton);
  });

  const handoffButton = createDeskActionButton("handoff-current-compose", localize({
    "zh-Hans": "直接打开回复框",
    "zh-Hant": "直接打開回覆框",
    en: "Open reply composer now",
    ja: "いま返信欄を開く",
    ko: "지금 답글 창 열기"
  }), "", "primary");
  handoffButton.dataset.slot = recommendedSlot || "next";

  const polishButton = createDeskActionButton("polish-composer", localize({
    "zh-Hans": "收成直发版",
    "zh-Hant": "收成直發版",
    en: "Tighten for send",
    ja: "送信向けに締める",
    ko: "바로 보낼 버전으로"
  }), "", "accent");

  const copyButton = createDeskActionButton("copy-composer", localize({
    "zh-Hans": "复制当前稿",
    "zh-Hant": "複製目前稿",
    en: "Copy working draft",
    ja: "編集中の稿をコピー",
    ko: "현재 초안 복사"
  }), "", "primary");
  foot.append(meta, queueControls, polishButton, handoffButton, copyButton);

  composer.append(textarea, foot);
  workbench.append(head, composer);
  return workbench;
}

function createQueueFilterButton(key, count, active = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "queueFilterButton";
  button.dataset.action = "set-queue-filter";
  button.dataset.filter = key;
  button.classList.toggle("active", active);
  button.textContent = `${getQueueFilterLabel(key)} · ${count}`;
  return button;
}

function formatQueueScore(value) {
  return localize({
    "zh-Hans": `${value || 0} 分`,
    "zh-Hant": `${value || 0} 分`,
    en: `${value || 0} pts`,
    ja: `${value || 0} 点`,
    ko: `${value || 0}점`
  });
}

function getQueueDraftStatus(item) {
  return item?.draft
    ? localize({
        "zh-Hans": "草稿已备好",
        "zh-Hant": "草稿已備好",
        en: "Draft ready",
        ja: "下書きあり",
        ko: "초안 준비됨"
      })
    : localize({
        "zh-Hans": "还缺草稿",
        "zh-Hant": "還缺草稿",
        en: "Need draft",
        ja: "下書き待ち",
        ko: "초안 필요"
      });
}

function buildQueueAssistItems(queueItems = getReplyQueueItems(), now = Date.now()) {
  const activeItems = queueItems.filter((item) => normalizeQueueStatus(item.status) === "queued");
  const overdueItem = activeItems.find((item) => getQueueExecutionKey(item, now) === "overdue") || null;
  const dueSoonItem = activeItems.find((item) => item.url !== overdueItem?.url && getQueueExecutionKey(item, now) === "due-soon") || null;
  const staleItem = activeItems.find((item) => item.url !== overdueItem?.url && item.url !== dueSoonItem?.url && isStaleQueueItem(item, now)) || null;
  const items = [];

  if (overdueItem) {
    items.push({
      title: localize({
        "zh-Hans": `现在把 @${overdueItem.authorHandle || "候选"} 发出去`,
        "zh-Hant": `現在把 @${overdueItem.authorHandle || "候選"} 發出去`,
        en: `Ship @${overdueItem.authorHandle || "candidate"} now`,
        ja: `@${overdueItem.authorHandle || "候補"} は今送る`,
        ko: `@${overdueItem.authorHandle || "후보"} 는 지금 발송`
      }),
      reason: localize({
        "zh-Hans": "这条已经过窗，再拖下去队列就会变成展示而不是执行。",
        "zh-Hant": "這條已經過窗，再拖下去隊列就會變成展示而不是執行。",
        en: "This one is already overdue. Delay it further and the queue stops feeling operational.",
        ja: "もう期限を過ぎています。ここで触らないとキューが実行ではなく表示になります。",
        ko: "이미 타이밍을 놓쳤습니다. 더 미루면 큐가 실행이 아니라 전시가 됩니다."
      }),
      meta: `${getQueueAgeChipText(overdueItem, now)} · ${getQueueSlotTexts(overdueItem.slot || "next").label}`,
      action: "handoff-queue-compose",
      url: overdueItem.url,
      ctaLabel: localize({
        "zh-Hans": "去回复框",
        "zh-Hant": "去回覆框",
        en: "Open composer",
        ja: "返信欄へ",
        ko: "답글 창 열기"
      }),
      tone: "warning"
    });
  }

  if (dueSoonItem) {
    items.push({
      title: localize({
        "zh-Hans": `先把 @${dueSoonItem.authorHandle || "候选"} 预热好`,
        "zh-Hant": `先把 @${dueSoonItem.authorHandle || "候選"} 預熱好`,
        en: `Warm up @${dueSoonItem.authorHandle || "candidate"} now`,
        ja: `@${dueSoonItem.authorHandle || "候補"} を先に準備`,
        ko: `@${dueSoonItem.authorHandle || "후보"} 를 미리 준비`
      }),
      reason: localize({
        "zh-Hans": "窗口马上到了，现在先把回复框打开，真正发出时就不会再找帖子。",
        "zh-Hant": "窗口馬上到了，現在先把回覆框打開，真正發出時就不會再找貼子。",
        en: "The window is close. Open the composer now so shipping later is one move, not another search.",
        ja: "実行窓が近いので、今のうちに返信欄まで持っていくとそのまま出しやすいです。",
        ko: "실행 창이 곧 옵니다. 지금 답글 창까지 열어 두면 바로 보낼 수 있습니다."
      }),
      meta: `${getQueueExecutionText("due-soon").label} · ${getQueueSlotTexts(dueSoonItem.slot || "next").label}`,
      action: "handoff-queue-compose",
      url: dueSoonItem.url,
      ctaLabel: localize({
        "zh-Hans": "去回复框",
        "zh-Hant": "去回覆框",
        en: "Open composer",
        ja: "返信欄へ",
        ko: "답글 창 열기"
      }),
      tone: "accent"
    });
  }

  if (staleItem) {
    items.push({
      title: localize({
        "zh-Hans": `别让 @${staleItem.authorHandle || "候选"} 一直躺队列`,
        "zh-Hant": `別讓 @${staleItem.authorHandle || "候選"} 一直躺隊列`,
        en: `Do not let @${staleItem.authorHandle || "candidate"} sit forever`,
        ja: `@${staleItem.authorHandle || "候補"} を寝かせすぎない`,
        ko: `@${staleItem.authorHandle || "후보"} 를 큐에 방치하지 않기`
      }),
      reason: localize({
        "zh-Hans": "这条已经排了很久；如果还值得发，就现在接上，不值得就改档或移出。",
        "zh-Hant": "這條已經排了很久；如果還值得發，就現在接上，不值得就改檔或移出。",
        en: "This one has been sitting for a while. Either reconnect it now or admit it should be rescheduled or dropped.",
        ja: "しばらく寝かせています。まだ価値があるなら今つなぎ、違うなら組み替えるべきです。",
        ko: "꽤 오래 누워 있었습니다. 아직 가치가 있으면 지금 이어 가고, 아니면 다시 잡거나 빼야 합니다."
      }),
      meta: `${getQueueAgeChipText(staleItem, now)} · ${getQueueSlotTexts(staleItem.slot || "next").label}`,
      action: "handoff-queue-compose",
      url: staleItem.url,
      ctaLabel: localize({
        "zh-Hans": "重新接上",
        "zh-Hant": "重新接上",
        en: "Reconnect",
        ja: "再開する",
        ko: "다시 이어가기"
      }),
      tone: "warning"
    });
  }

  return items.slice(0, 3);
}

function buildPublishWatchAssistItems(queueItems = getReplyQueueItems(), publishWatchItems = getPublishWatchItems(), now = Date.now()) {
  return publishWatchItems
    .map((watch) => {
      const queueItem = queueItems.find((item) => item.url === watch.url && normalizeQueueStatus(item.status) === "queued");
      if (!queueItem) {
        return null;
      }
      const effectiveStatus = typeof WorkflowCore?.getPublishWatchEffectiveStatus === "function"
        ? WorkflowCore.getPublishWatchEffectiveStatus(watch, now)
        : watch.status;
      return {
        title: localize({
          "zh-Hans": `确认 @${watch.authorHandle || queueItem.authorHandle || "候选"} 是否已真正发出`,
          "zh-Hant": `確認 @${watch.authorHandle || queueItem.authorHandle || "候選"} 是否已真正發出`,
          en: `Confirm @${watch.authorHandle || queueItem.authorHandle || "candidate"} is actually shipped`,
          ja: `@${watch.authorHandle || queueItem.authorHandle || "候補"} の送信を確認`,
          ko: `@${watch.authorHandle || queueItem.authorHandle || "후보"} 가 실제 발송됐는지 확인`
        }),
        reason: localize({
          "zh-Hans": watch.draftLoaded ? "回复框和排队稿已经接上。现在不该回到搜索，而该完成发出确认。" : "原帖与兜底草稿已经准备好。现在要么继续发，要么明确撤回，不要让它停在半路。",
          "zh-Hant": watch.draftLoaded ? "回覆框和排隊稿已經接上。現在不該回到搜尋，而該完成發出確認。" : "原貼與兜底草稿已準備好。現在要嘛繼續發，要嘛明確撤回，不要讓它停在半路。",
          en: watch.draftLoaded ? "The composer and queued draft are already connected. Do not go back to searching; finish confirmation." : "The post and fallback draft are ready. Either continue shipping it or intentionally pull it back instead of leaving it half-done.",
          ja: watch.draftLoaded ? "返信欄と下書きは接続済みです。もう探し直す段階ではなく、送信確認を終える段階です。" : "元投稿と予備の下書きは準備済みです。途中で止めず、続けるか戻すかを明確に。",
          ko: watch.draftLoaded ? "답글 창과 큐 초안은 이미 연결됐습니다. 다시 찾는 단계가 아니라 발송 확인을 끝낼 단계입니다." : "원문과 예비 초안은 준비됐습니다. 중간에 두지 말고 계속 발송하거나 명확히 되돌리세요."
        }),
        meta: `${getPublishWatchAgeText(watch, now)} · ${getQueueSlotTexts(queueItem.slot || "next").label}`,
        action: "handoff-queue-compose",
        url: watch.url,
        ctaLabel: localize({
          "zh-Hans": "继续去回复框",
          "zh-Hant": "繼續去回覆框",
          en: "Resume composer",
          ja: "返信欄を再開",
          ko: "답글 창 이어서 열기"
        }),
        tone: effectiveStatus === "failed" || getPublishWatchAgeMs(watch, now) > 4 * 60 * 1000 ? "warning" : "accent"
      };
    })
    .filter(Boolean)
    .slice(0, 2);
}

function createQueueAssistCard(item, index) {
  const card = document.createElement("article");
  card.className = "growthActionCard queueAssistCard";
  card.dataset.tone = item.tone || "soft";

  const top = document.createElement("div");
  top.className = "growthActionTop";
  top.innerHTML = `
    <strong>${escapeHtml(item.title)}</strong>
    <span class="growthActionSerial">RD-QA${String(index + 1).padStart(2, "0")}</span>
  `;

  const reason = document.createElement("p");
  reason.className = "growthActionReason";
  reason.textContent = item.reason;

  const meta = document.createElement("div");
  meta.className = "growthActionMeta";
  meta.appendChild(createSummaryChip(item.meta, item.tone || "soft"));

  const actionButton = createDeskActionButton(
    item.action,
    item.ctaLabel || localize({
      "zh-Hans": "去处理",
      "zh-Hant": "去處理",
      en: "Handle now",
      ja: "処理する",
      ko: "지금 처리"
    }),
    item.url || "",
    item.tone === "warning" ? "warning" : "accent"
  );
  if (item.payload) {
    actionButton.dataset.payload = item.payload;
  }
  meta.appendChild(actionButton);

  card.append(top, reason, meta);
  return card;
}

function watchStatusTextForQueueCard(publishWatch) {
  const ageText = formatQueueAgeValue(getPublishWatchAgeMs(publishWatch));
  return publishWatch?.draftLoaded
    ? localize({
        "zh-Hans": `回复框 ${ageText} 前已接上排队稿，现在最好发出或改档，不要停在半路。`,
        "zh-Hant": `回覆框 ${ageText} 前已接上排隊稿，現在最好發出或改檔，不要停在半路。`,
        en: `The queued draft was already loaded into the composer ${ageText} ago. Ship it or deliberately reschedule it instead of leaving it half-done.`,
        ja: `${ageText} 前に下書きは返信欄へ入りました。中途半端にせず、送るか組み直すかを決めたい状態です。`,
        ko: `${ageText} 전에 큐 초안이 답글 창에 들어갔습니다. 중간에 두지 말고 발송하거나 다시 배치해야 합니다.`
      })
    : localize({
        "zh-Hans": `原帖和兜底草稿 ${ageText} 前已准备好，如果刚才没发出去，最好现在继续或重新排队。`,
        "zh-Hant": `原貼和兜底草稿 ${ageText} 前已準備好，如果剛才沒發出去，最好現在繼續或重新排隊。`,
        en: `The post and fallback draft were prepared ${ageText} ago. If it did not go out, resume now or re-queue with intent.`,
        ja: `${ageText} 前に元投稿と予備下書きは準備済みです。送れていないなら、今つなぐか組み直したい状態です。`,
        ko: `${ageText} 전에 원문과 예비 초안은 준비됐습니다. 아직 못 보냈다면 지금 이어가거나 다시 큐에 넣는 편이 좋습니다.`
      });
}

function createQueueCard(item, index, publishWatch = getPublishWatchItem(item?.url)) {
  const executionKey = getQueueExecutionKey(item);
  const executionText = getQueueExecutionText(executionKey);
  const isActive = normalizeQueueStatus(item.status) === "queued";
  const article = document.createElement("article");
  article.className = "queueCard";
  article.dataset.slot = item.slot || "next";
  article.dataset.state = executionKey;
  const slotText = getQueueSlotTexts(item.slot || "next");

  const top = document.createElement("div");
  top.className = "queueCardTop";

  const identity = document.createElement("div");
  const handle = document.createElement("strong");
  handle.textContent = `@${item.authorHandle || "candidate"}`;
  const when = document.createElement("span");
  when.className = "queueCardWhen";
  when.textContent = formatScheduleTime(isActive ? item.scheduledFor : (item.completedAt || item.scheduledFor));
  identity.append(handle, when);

  const serial = document.createElement("span");
  serial.className = "queueCardSerial";
  serial.textContent = `RD-Q${String(index + 1).padStart(3, "0")}`;
  top.append(identity, serial);

  const meta = document.createElement("div");
  meta.className = "queueCardMeta";
  [
    slotText.label,
    executionText.label,
    publishWatch ? getPublishWatchAgeText(publishWatch) : "",
    item.lane || localize({"zh-Hans": "待处理", "zh-Hant": "待處理", en: "Queued", ja: "対応待ち", ko: "처리 대기"}),
    formatQueueScore(item.score || 0),
    getQueueDraftStatus(item),
    getQueueAgeChipText(item)
  ].filter(Boolean).forEach((text) => {
    const chip = document.createElement("span");
    chip.textContent = text;
    meta.appendChild(chip);
  });

  const hint = document.createElement("p");
  hint.className = "queueCardHint";
  const activeHint = publishWatch
    ? watchStatusTextForQueueCard(publishWatch)
    : (isActive && isStaleQueueItem(item)
      ? localize({
          "zh-Hans": `这条已经在队列里待了 ${formatQueueAgeValue(getQueueAgeMs(item))}，最好现在处理或重新排档。`,
          "zh-Hant": `這條已經在隊列裡待了 ${formatQueueAgeValue(getQueueAgeMs(item))}，最好現在處理或重新排檔。`,
          en: `This has been queued for ${formatQueueAgeValue(getQueueAgeMs(item))}. Either ship it now or reschedule it with intent.`,
          ja: `${formatQueueAgeValue(getQueueAgeMs(item))} ほどキューにあります。今やるか、意図を持って組み直したい状態です。`,
          ko: `${formatQueueAgeValue(getQueueAgeMs(item))} 동안 큐에 있었습니다. 지금 처리하거나 의도적으로 다시 잡는 편이 좋습니다.`
        })
      : executionText.hint);
  hint.textContent = isActive
    ? activeHint
    : `${executionText.hint} · ${localize({"zh-Hans": "完成于", "zh-Hant": "完成於", en: "Closed at", ja: "完了時刻", ko: "완료 시각"})} ${formatScheduleTime(item.completedAt || item.scheduledFor)}`;

  const body = document.createElement("p");
  body.className = "queueCardText";
  body.textContent = item.draft || item.text || localize({
    "zh-Hans": "等待补充回复草稿",
    "zh-Hant": "等待補充回覆草稿",
    en: "Waiting for a reply draft",
    ja: "返信下書き待ち",
    ko: "답글 초안 대기"
  });

  const actions = document.createElement("div");
  actions.className = "queueCardActions";

  if (isActive) {
    ["next", "tonight", "tomorrow"].forEach((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "miniPillButton";
      button.dataset.action = "reschedule-queue";
      button.dataset.payload = buildQueueActionPayload(item.url, slot);
      button.textContent = getQueueSlotTexts(slot).label;
      button.classList.toggle("active", slot === (item.slot || "next"));
      actions.appendChild(button);
    });

    const handoffButton = document.createElement("button");
    handoffButton.type = "button";
    handoffButton.className = "miniPillButton miniPillButton--focus";
    handoffButton.dataset.action = "handoff-queue-compose";
    handoffButton.dataset.url = item.url;
    handoffButton.textContent = localize({
      "zh-Hans": publishWatch ? "继续去回复框" : (executionKey === "overdue" ? "现在去回复框" : "去回复框"),
      "zh-Hant": publishWatch ? "繼續去回覆框" : (executionKey === "overdue" ? "現在去回覆框" : "去回覆框"),
      en: publishWatch ? "Resume composer" : (executionKey === "overdue" ? "Ship now" : "Open composer"),
      ja: publishWatch ? "返信欄を再開" : (executionKey === "overdue" ? "今すぐ返信" : "返信欄へ"),
      ko: publishWatch ? "답글 창 이어서 열기" : (executionKey === "overdue" ? "지금 발송" : "답글 창 열기")
    });
    actions.appendChild(handoffButton);

    const shippedButton = document.createElement("button");
    shippedButton.type = "button";
    shippedButton.className = "miniPillButton";
    shippedButton.dataset.action = "mark-queue-shipped";
    shippedButton.dataset.url = item.url;
    shippedButton.textContent = localize({
      "zh-Hans": "标记发出",
      "zh-Hant": "標記發出",
      en: "Mark shipped",
      ja: "送信済みにする",
      ko: "발송 완료 처리"
    });
    actions.appendChild(shippedButton);

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "miniPillButton";
    completeButton.dataset.action = "mark-queue-completed";
    completeButton.dataset.url = item.url;
    completeButton.textContent = localize({
      "zh-Hans": "手动完成",
      "zh-Hant": "手動完成",
      en: "Complete",
      ja: "手動完了",
      ko: "수동 완료"
    });
    actions.appendChild(completeButton);
  } else {
    const requeueButton = document.createElement("button");
    requeueButton.type = "button";
    requeueButton.className = "miniPillButton";
    requeueButton.dataset.action = "requeue-item";
    requeueButton.dataset.payload = buildQueueActionPayload(item.url, item.slot || "next");
    requeueButton.textContent = localize({
      "zh-Hans": "重新排队",
      "zh-Hant": "重新排隊",
      en: "Re-queue",
      ja: "もう一度キューへ",
      ko: "다시 큐에 넣기"
    });
    actions.appendChild(requeueButton);
  }

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "miniPillButton miniPillButton--focus";
  openButton.dataset.action = "open-post";
  openButton.dataset.url = item.url;
  openButton.textContent = localize({
    "zh-Hans": "打开原帖",
    "zh-Hant": "打開原貼",
    en: "Open post",
    ja: "元投稿",
    ko: "원문 열기"
  });
  actions.appendChild(openButton);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "miniPillButton";
  copyButton.dataset.action = "copy-draft";
  copyButton.dataset.copyText = item.draft || item.text || "";
  copyButton.textContent = localize({
    "zh-Hans": "复制排队稿",
    "zh-Hant": "複製排隊稿",
    en: "Copy queued",
    ja: "下書きをコピー",
    ko: "큐 초안 복사"
  });
  actions.appendChild(copyButton);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "miniPillButton";
  removeButton.dataset.action = "remove-queue";
  removeButton.dataset.url = item.url;
  removeButton.textContent = localize({
    "zh-Hans": "移出队列",
    "zh-Hant": "移出隊列",
    en: "Remove",
    ja: "外す",
    ko: "제거"
  });
  actions.appendChild(removeButton);

  article.append(top, meta, hint, body, actions);
  return article;
}

function createGrowthActionCard(item, index) {
  const card = document.createElement("article");
  card.className = "growthActionCard";
  card.dataset.tone = item.tone || "soft";

  const top = document.createElement("div");
  top.className = "growthActionTop";
  top.innerHTML = `
    <strong>${escapeHtml(item.title)}</strong>
    <span class="growthActionSerial">RD-GA${String(index + 1).padStart(2, "0")}</span>
  `;

  const reason = document.createElement("p");
  reason.className = "growthActionReason";
  reason.textContent = item.reason;

  const meta = document.createElement("div");
  meta.className = "growthActionMeta";
  meta.appendChild(createSummaryChip(item.meta, item.tone || "soft"));

  if (item.action === "focus-candidate" && item.url) {
    const button = createDeskActionButton("focus-candidate", localize({
      "zh-Hans": "切到这条",
      "zh-Hant": "切到這條",
      en: "Switch here",
      ja: "この候補にする",
      ko: "이 후보로 전환"
    }), item.url, "accent");
    meta.appendChild(button);
  } else if (item.action === "open-post" && item.url) {
    const button = createDeskActionButton("open-post", localize({
      "zh-Hans": "打开原帖",
      "zh-Hant": "打開原貼",
      en: "Open post",
      ja: "元投稿を開く",
      ko: "원문 열기"
    }), item.url, "accent");
    meta.appendChild(button);
  } else if (item.action === "handoff-queue-compose" && item.url) {
    const button = createDeskActionButton("handoff-queue-compose", localize({
      "zh-Hans": "去回复框",
      "zh-Hant": "去回覆框",
      en: "Open composer",
      ja: "返信欄へ",
      ko: "답글 창 열기"
    }), item.url, item.tone === "warning" ? "warning" : "accent");
    meta.appendChild(button);
  } else if (item.action === "check-pickup" && item.url) {
    const button = createDeskActionButton("check-pickup", localize({
      "zh-Hans": "查接住",
      "zh-Hant": "查接住",
      en: "Check pickup",
      ja: "結果を見る",
      ko: "결과 확인"
    }), item.url, item.tone === "warning" ? "warning" : "accent");
    meta.appendChild(button);
  }

  card.append(top, reason, meta);
  return card;
}

function getQueueSummaryText(queueItems) {
  if (!queueItems.length) {
    return localize({
      "zh-Hans": "还没有排队动作。先把高确定性的候选放进下一轮或今晚。",
      "zh-Hant": "還沒有排隊動作。先把高確定性的候選放進下一輪或今晚。",
      en: "No queued replies yet. Start by staging the highest-confidence opportunities.",
      ja: "まだキューは空です。確度の高い候補から次か今夜に入れましょう。",
      ko: "아직 큐가 비어 있습니다. 확률 높은 후보부터 다음 차례나 오늘 밤에 넣으세요."
    });
  }
  const counts = getQueueLifecycleCounts(queueItems);
  const staleCount = queueItems.filter((item) => isStaleQueueItem(item)).length;
  return [
    counts.overdue ? `${counts.overdue} ${getQueueExecutionText("overdue").label}` : "",
    counts.dueSoon ? `${counts.dueSoon} ${getQueueExecutionText("due-soon").label}` : "",
    counts.awaiting ? `${counts.awaiting} ${localize({"zh-Hans": "待确认", "zh-Hant": "待確認", en: "awaiting confirm", ja: "確認待ち", ko: "확인 대기"})}` : "",
    counts.staged ? `${counts.staged} ${getQueueExecutionText("queued").label}` : "",
    staleCount ? `${staleCount} ${localize({"zh-Hans": "老化中", "zh-Hant": "老化中", en: "aging", ja: "寝かせ中", ko: "장기 대기"})}` : "",
    counts.shipped ? `${counts.shipped} ${getQueueExecutionText("shipped").label}` : "",
    counts.completed ? `${counts.completed} ${getQueueExecutionText("completed").label}` : ""
  ].filter(Boolean).join(" · ");
}

function renderQueueDesk(queueItems, focusCandidate, publishWatchItems = getPublishWatchItems()) {
  if (!els.queueDeskPanel) {
    return;
  }
  els.queueDeskMeta.textContent = getQueueSummaryText(queueItems);
  els.queueDeskPanel.innerHTML = "";

  const counts = getQueueLifecycleCounts(queueItems);
  const assistItems = [...buildPublishWatchAssistItems(queueItems, publishWatchItems), ...buildQueueAssistItems(queueItems)].slice(0, 4);

  if (assistItems.length) {
    const assistList = document.createElement("div");
    assistList.className = "queueAssistList";
    assistItems.forEach((item, index) => {
      assistList.appendChild(createQueueAssistCard(item, index));
    });
    els.queueDeskPanel.appendChild(assistList);
  }

  const filterBar = document.createElement("div");
  filterBar.className = "queueFilterBar";
  [
    ["all", queueItems.length],
    ["action", counts.action],
    ["live", counts.live],
    ["done", counts.done]
  ].forEach(([key, count]) => {
    filterBar.appendChild(createQueueFilterButton(key, count, uiState.queueFilter === key));
  });
  els.queueDeskPanel.appendChild(filterBar);

  const filtered = getFilteredQueueItems(queueItems);
  const previewQueueItems = typeof QueueCore?.buildQueuePreviewItems === "function"
    ? QueueCore.buildQueuePreviewItems(queueItems, uiState.queueFilter, Date.now())
    : filtered.slice(0, uiState.queueFilter === "action" ? 4 : 3);

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "queueEmptyState";
    if (queueItems.length) {
      empty.innerHTML = `<strong>${escapeHtml(localize({"zh-Hans": "这个视图现在是空的", "zh-Hant": "這個視圖現在是空的", en: "This view is empty", ja: "このビューは空です", ko: "이 뷰는 비어 있습니다"}))}</strong><p>${escapeHtml(localize({"zh-Hans": "切到“全部 / 排期中 / 已落地”看看，或继续把新的回复排进队列。", "zh-Hant": "切到「全部 / 排期中 / 已落地」看看，或繼續把新的回覆排進隊列。", en: "Switch to All / Live / Done, or keep staging new replies.", ja: "全部 / 進行中 / 完了済みに切り替えるか、新しい返信を追加します。", ko: "전체 / 진행 중 / 완료됨으로 바꾸거나 새 답글을 더 넣으세요."}))}</p>`;
    } else {
      empty.innerHTML = `<strong>${escapeHtml(localize({"zh-Hans": "队列还没排起来", "zh-Hant": "隊列還沒排起來", en: "Queue is still empty", ja: "キューはまだ空です", ko: "큐가 아직 비어 있습니다"}))}</strong><p>${escapeHtml(localize({"zh-Hans": focusCandidate ? "先把当前主线候选排进去，再决定是下一轮、今晚还是明早。" : "先选一条候选，再把它排进下一轮 / 今晚 / 明早。", "zh-Hant": focusCandidate ? "先把目前主線候選排進去，再決定是下一輪、今晚還是明早。" : "先選一條候選，再把它排進下一輪 / 今晚 / 明早。", en: focusCandidate ? "Stage the current lead candidate first, then choose next-up, tonight, or tomorrow." : "Pick a candidate first, then stage it into next-up / tonight / tomorrow.", ja: focusCandidate ? "まず主線候補を入れてから、次・今夜・明朝を決めます。" : "先に候補を選んでから、次・今夜・明朝へ入れます。", ko: focusCandidate ? "현재 메인 후보를 먼저 넣고, 다음 차례 / 오늘 밤 / 내일 아침을 고르세요." : "먼저 후보를 고른 뒤 다음 차례 / 오늘 밤 / 내일 아침에 넣으세요."}))}</p>`;
    }
    if (!queueItems.length && focusCandidate?.url) {
      const actionRow = document.createElement("div");
      actionRow.className = "deskActionRow";
      ["next", "tonight", "tomorrow"].forEach((slot) => {
        const button = createDeskActionButton("queue-candidate", getQueueSlotTexts(slot).label, "", slot === "next" ? "primary" : slot === "tonight" ? "accent" : "soft");
        button.dataset.payload = buildQueueActionPayload(focusCandidate.url, slot);
        actionRow.appendChild(button);
      });
      empty.appendChild(actionRow);
    }
    els.queueDeskPanel.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "queueCardList";
  previewQueueItems.forEach((item, index) => list.appendChild(createQueueCard(item, index, getPublishWatchItem(item.url))));
  els.queueDeskPanel.appendChild(list);
  if (filtered.length > previewQueueItems.length) {
    const moreNote = document.createElement("p");
    moreNote.className = "queuePreviewNote";
    moreNote.textContent = localize({
      "zh-Hans": `当前只展示最前 ${previewQueueItems.length} 条，切筛选或清队列可继续缩小范围。`,
      "zh-Hant": `目前只顯示最前 ${previewQueueItems.length} 條，切換篩選或清理隊列可繼續縮小範圍。`,
      en: `Showing the first ${previewQueueItems.length} items for now. Switch filters or clear the queue to narrow it further.`,
      ja: `いまは先頭 ${previewQueueItems.length} 件だけ表示しています。フィルタ切替や整理でさらに絞れます。`,
      ko: `지금은 앞의 ${previewQueueItems.length}개만 보여 줍니다. 필터를 바꾸거나 큐를 정리하면 더 좁힐 수 있습니다.`
    });
    els.queueDeskPanel.appendChild(moreNote);
  }
}

function getPickupStatusTone(status) {
  switch (normalizePickupStatus(status)) {
    case "author-engaged":
      return "success";
    case "picked-up":
      return "accent";
    case "pending":
      return "warning";
    case "quiet":
    default:
      return "soft";
  }
}

function getPickupStatusLabel(status) {
  switch (normalizePickupStatus(status)) {
    case "author-engaged":
      return localize({
        "zh-Hans": "作者回流",
        "zh-Hant": "作者回流",
        en: "Author back",
        ja: "作者が戻った",
        ko: "작성자 재등장"
      });
    case "picked-up":
      return localize({
        "zh-Hans": "被接住",
        "zh-Hant": "被接住",
        en: "Picked up",
        ja: "反応あり",
        ko: "반응 잡힘"
      });
    case "quiet":
      return localize({
        "zh-Hans": "暂时安静",
        "zh-Hant": "暫時安靜",
        en: "Quiet",
        ja: "まだ静か",
        ko: "아직 조용함"
      });
    case "pending":
    default:
      return localize({
        "zh-Hans": "待复查",
        "zh-Hant": "待複查",
        en: "Check pickup",
        ja: "要再確認",
        ko: "재확인 필요"
      });
  }
}

function getPickupDeltaSummary(entry) {
  const parts = [];
  if (Number(entry?.pickupDeltaReplies || 0) > 0) {
    parts.push(`+${entry.pickupDeltaReplies} ${localize({"zh-Hans": "回复", "zh-Hant": "回覆", en: "replies", ja: "返信", ko: "답글"})}`);
  }
  if (Number(entry?.pickupDeltaLikes || 0) > 0) {
    parts.push(`+${entry.pickupDeltaLikes} ${localize({"zh-Hans": "赞", "zh-Hant": "讚", en: "likes", ja: "いいね", ko: "좋아요"})}`);
  }
  if (Number(entry?.pickupDeltaViews || 0) > 0) {
    parts.push(`+${formatCompactCount(entry.pickupDeltaViews)} ${localize({"zh-Hans": "浏览", "zh-Hant": "瀏覽", en: "views", ja: "表示", ko: "조회"})}`);
  }
  return parts.slice(0, 2).join(" · ");
}

function getReplyObservedSummary(entry) {
  const parts = [];
  if (Number(entry?.replyObservedReplies || 0) > 0) {
    parts.push(`${formatCompactCount(entry.replyObservedReplies)} ${localize({"zh-Hans": "回覆", "zh-Hant": "回覆", en: "replies", ja: "返信", ko: "답글"})}`);
  }
  if (Number(entry?.replyObservedLikes || 0) > 0) {
    parts.push(`${formatCompactCount(entry.replyObservedLikes)} ${localize({"zh-Hans": "赞", "zh-Hant": "讚", en: "likes", ja: "いいね", ko: "좋아요"})}`);
  }
  if (Number(entry?.replyObservedViews || 0) > 0) {
    parts.push(`${formatCompactCount(entry.replyObservedViews)} ${localize({"zh-Hans": "浏览", "zh-Hant": "瀏覽", en: "views", ja: "表示", ko: "조회"})}`);
  }
  return parts.slice(0, 3).join(" · ");
}

function getReplyObservedMetaText(entry, now = Date.now()) {
  const checkedAt = Number(entry?.replyCheckedAt || entry?.replyTrafficCapturedAt || 0);
  if (!checkedAt) {
    const age = formatQueueAgeValue(Math.max(0, now - (Number(entry?.timestamp) || now)));
    return localize({
      "zh-Hans": `发出后 ${age} 还没查回复自曝`,
      "zh-Hant": `發出後 ${age} 還沒查回覆自曝`,
      en: `Shipped ${age} ago without a reply-view check`,
      ja: `${age} 前に送信、まだ返信自体は未確認`,
      ko: `${age} 전에 발송, 아직 답글 자체는 미확인`
    });
  }
  return localize({
    "zh-Hans": `${formatRelativeTime(checkedAt)} 更新回复自曝`,
    "zh-Hant": `${formatRelativeTime(checkedAt)} 更新回覆自曝`,
    en: `Reply performance updated ${formatRelativeTime(checkedAt)} ago`,
    ja: `${formatRelativeTime(checkedAt)} 前に返信自体を更新`,
    ko: `${formatRelativeTime(checkedAt)} 전에 답글 자체 성과 업데이트`
  });
}

function getPickupCheckMetaText(entry, now = Date.now()) {
  if (!entry?.lastCheckedAt) {
    const age = formatQueueAgeValue(Math.max(0, now - (Number(entry?.shippedAt) || now)));
    return localize({
      "zh-Hans": `发出后 ${age} 未复查`,
      "zh-Hant": `發出後 ${age} 未複查`,
      en: `Shipped ${age} ago without a check`,
      ja: `${age} 前に送信、まだ未確認`,
      ko: `${age} 전에 발송, 아직 미확인`
    });
  }

  return localize({
    "zh-Hans": `${formatRelativeTime(entry.lastCheckedAt)} 复查`,
    "zh-Hant": `${formatRelativeTime(entry.lastCheckedAt)} 複查`,
    en: `Checked ${formatRelativeTime(entry.lastCheckedAt)} ago`,
    ja: `${formatRelativeTime(entry.lastCheckedAt)} 前に確認`,
    ko: `${formatRelativeTime(entry.lastCheckedAt)} 전 확인`
  });
}

function getPickupActionLabel(entry) {
  return normalizePickupStatus(entry?.pickupStatus || entry?.status, entry?.pickupCheckedAt || entry?.lastCheckedAt ? "quiet" : "pending") === "pending"
    ? localize({
        "zh-Hans": "查接住",
        "zh-Hant": "查接住",
        en: "Check pickup",
        ja: "結果を見る",
        ko: "결과 확인"
      })
    : localize({
        "zh-Hans": "重新复查",
        "zh-Hant": "重新複查",
        en: "Recheck",
        ja: "再確認",
        ko: "다시 확인"
      });
}

function buildGrowthActionItems(focusCandidate, candidates, relationships, repliesToday, growthLift, queueItems = [], publishWatchItems = [], pickupItems = []) {
  const items = [];
  const now = Date.now();
  const publishWatchItem = (typeof GrowthCore?.getPriorityPublishWatchItem === "function"
    ? GrowthCore.getPriorityPublishWatchItem(
        publishWatchItems.filter((item) => getQueuedItem(item.url)),
        now
      )
    : publishWatchItems.find((item) => getQueuedItem(item.url))) || null;
  if (publishWatchItem) {
    items.push({
      title: localize({
        "zh-Hans": `确认 @${publishWatchItem.authorHandle || "候选"} 是否已发出`,
        "zh-Hant": `確認 @${publishWatchItem.authorHandle || "候選"} 是否已發出`,
        en: `Confirm @${publishWatchItem.authorHandle || "candidate"} shipped`,
        ja: `@${publishWatchItem.authorHandle || "候補"} の送信確認`,
        ko: `@${publishWatchItem.authorHandle || "후보"} 발송 확인`
      }),
      reason: localize({
        "zh-Hans": "回复框已经拉起，现在最值钱的是把这条真正关单：发出、恢复，或重新排档。",
        "zh-Hant": "回覆框已經拉起，現在最值錢的是把這條真正關單：發出、恢復，或重新排檔。",
        en: "The composer was already opened. The real next step is closing the loop: ship it, recover it, or deliberately reschedule it.",
        ja: "返信欄はもう開いています。いま必要なのは、送信するか、戻すか、意図を持って組み直すことです。",
        ko: "답글 창은 이미 열었습니다. 이제 필요한 건 실제로 마감하는 것: 발송, 복구, 혹은 의도적인 재배치입니다."
      }),
      meta: `${getPublishWatchAgeText(publishWatchItem)} · ${publishWatchItem.draftLoaded ? localize({"zh-Hans": "已带稿", "zh-Hant": "已帶稿", en: "Draft loaded", ja: "下書き入力済み", ko: "초안 입력됨"}) : localize({"zh-Hans": "剪贴板兜底", "zh-Hant": "剪貼簿兜底", en: "Clipboard fallback", ja: "クリップボード待避", ko: "클립보드 대기"})}`,
      action: "handoff-queue-compose",
      url: publishWatchItem.url,
      tone: "warning"
    });
  }

  const pickupDueItem = pickupItems
    .filter((item) => getPickupReviewBucket(item, now) === "due")
    .sort((left, right) => {
      const leftReviewAt = Number(left?.pickupNextReviewAt ?? left?.nextReviewAt) || 0;
      const rightReviewAt = Number(right?.pickupNextReviewAt ?? right?.nextReviewAt) || 0;
      return leftReviewAt - rightReviewAt || (Number(left?.lastCheckedAt || left?.shippedAt || 0) - Number(right?.lastCheckedAt || right?.shippedAt || 0));
    })[0] || null;
  if (!publishWatchItem && pickupDueItem) {
    items.push({
      title: localize({
        "zh-Hans": `复查 @${pickupDueItem.authorHandle || "这条"} 的后续`,
        "zh-Hant": `複查 @${pickupDueItem.authorHandle || "這條"} 的後續`,
        en: `Review what happened after @${pickupDueItem.authorHandle || "this reply"}`,
        ja: `@${pickupDueItem.authorHandle || "この返信"} のその後を見る`,
        ko: `@${pickupDueItem.authorHandle || "이 답글"} 이후 반응 확인`
      }),
      reason: localize({
        "zh-Hans": "现在最缺的不是“再发一条”，而是把已经发出的 reply 按复查节奏收口，知道线程有没有继续长、作者有没有回来。",
        "zh-Hant": "現在最缺的不是「再發一條」，而是把已發出的 reply 按複查節奏收口，知道線程有沒有繼續長、作者有沒有回來。",
        en: "The missing information now is not another draft. It is closing the review loop on shipped work so you know whether the thread kept moving or the author came back.",
        ja: "いま足りないのは次の下書きではなく、送信済みの返信を観察リズムどおりに回収し、会話が伸びたか作者が戻ったかを確かめることです。",
        ko: "지금 필요한 건 새 초안이 아니라, 이미 보낸 답글을 검토 리듬에 맞춰 회수해 스레드가 이어졌는지 작성자가 돌아왔는지 확인하는 것입니다."
      }),
      meta: getPickupCheckMetaText(pickupDueItem, now),
      action: "check-pickup",
      url: pickupDueItem.url,
      tone: "accent"
    });
  }

  const authorEngagedItem = pickupItems.find((item) => normalizePickupStatus(item.status) === "author-engaged");
  if (!pickupDueItem && authorEngagedItem && items.length < 3) {
    items.push({
      title: localize({
        "zh-Hans": `@${authorEngagedItem.authorHandle || "目标作者"} 回来了`,
        "zh-Hant": `@${authorEngagedItem.authorHandle || "目標作者"} 回來了`,
        en: `@${authorEngagedItem.authorHandle || "target author"} came back`,
        ja: `@${authorEngagedItem.authorHandle || "対象作者"} が戻ってきた`,
        ko: `@${authorEngagedItem.authorHandle || "대상 작성자"} 가 다시 왔습니다`
      }),
      reason: localize({
        "zh-Hans": "这是比“已发出”更强的正反馈，说明至少有一条 reply 已经开始形成真实互动记忆。",
        "zh-Hant": "這比「已發出」更強的正回饋，說明至少有一條 reply 已開始形成真實互動記憶。",
        en: "This is stronger than merely shipping. At least one reply is now turning into real interaction memory.",
        ja: "ただ送っただけより一段強い反応です。少なくとも1件は実際の相互作用として残り始めています。",
        ko: "단순 발송보다 더 강한 신호입니다. 최소 한 개 답글이 실제 상호작용 기억으로 바뀌기 시작했습니다."
      }),
      meta: `${getPickupStatusLabel(authorEngagedItem.status)}${getPickupDeltaSummary(authorEngagedItem) ? ` · ${getPickupDeltaSummary(authorEngagedItem)}` : ""}`,
      action: "open-post",
      url: authorEngagedItem.url,
      tone: "success"
    });
  }

  const overdueItem = queueItems.find((item) => getQueueExecutionKey(item) === "overdue");
  if (overdueItem) {
    items.push({
      title: localize({
        "zh-Hans": `先处理 @${overdueItem.authorHandle || "候选"}`,
        "zh-Hant": `先處理 @${overdueItem.authorHandle || "候選"}`,
        en: `Handle @${overdueItem.authorHandle || "candidate"} first`,
        ja: `まず @${overdueItem.authorHandle || "候補"} を処理`,
        ko: `먼저 @${overdueItem.authorHandle || "후보"} 처리`
      }),
      reason: localize({
        "zh-Hans": "这条已经过了原定窗口，再拖就不是排队，而是失去执行感。",
        "zh-Hant": "這條已經過了原定窗口，再拖就不是排隊，而是失去執行感。",
        en: "This one already missed its window. Dragging it further turns the queue into fiction.",
        ja: "予定の窓を過ぎています。ここで触らないとキューが実行面を失います。",
        ko: "이미 원래 창을 지났습니다. 더 미루면 큐가 실제 실행을 잃습니다."
      }),
      meta: `${getQueueExecutionText("overdue").label} · ${formatScheduleTime(overdueItem.scheduledFor)}`,
      action: "handoff-queue-compose",
      url: overdueItem.url,
      tone: "warning"
    });
  }

  const dueSoonItem = queueItems.find((item) => item.url !== overdueItem?.url && getQueueExecutionKey(item) === "due-soon");
  if (dueSoonItem && items.length < 3) {
    items.push({
      title: localize({
        "zh-Hans": `快切到 @${dueSoonItem.authorHandle || "候选"}`,
        "zh-Hant": `快切到 @${dueSoonItem.authorHandle || "候選"}`,
        en: `Open @${dueSoonItem.authorHandle || "candidate"} soon`,
        ja: `@${dueSoonItem.authorHandle || "候補"} をそろそろ開く`,
        ko: `곧 @${dueSoonItem.authorHandle || "후보"} 열기`
      }),
      reason: localize({
        "zh-Hans": "执行窗口已经临近，现在提前打开原帖，真正发的时候不需要再找。",
        "zh-Hant": "執行窗口已經臨近，現在提前打開原貼，真正發的時候不需要再找。",
        en: "The execution window is close. Open it now so shipping later is one click, not another search.",
        ja: "実行窓が近いので、いまのうちに元投稿を開いておくと動きやすい。",
        ko: "실행 창이 가까워졌습니다. 지금 원문을 열어 두면 실제 발송이 한 단계 줄어듭니다."
      }),
      meta: `${getQueueExecutionText("due-soon").label} · ${formatScheduleTime(dueSoonItem.scheduledFor)}`,
      action: "handoff-queue-compose",
      url: dueSoonItem.url,
      tone: "accent"
    });
  }

  if (focusCandidate) {
    items.push({
      title: localize({
        "zh-Hans": `先回 @${focusCandidate.authorHandle || "候选"}`,
        "zh-Hant": `先回 @${focusCandidate.authorHandle || "候選"}`,
        en: `Reply to @${focusCandidate.authorHandle || "candidate"} first`,
        ja: `まず @${focusCandidate.authorHandle || "候補"} に返す`,
        ko: `먼저 @${focusCandidate.authorHandle || "후보"} 에 답글`
      }),
      reason: Array.isArray(focusCandidate.highlights) && focusCandidate.highlights.length
        ? focusCandidate.highlights.slice(0, 2).join(" · ")
        : localize({ "zh-Hans": "这是当前最稳的一条", "zh-Hant": "這是目前最穩的一條", en: "This is the strongest current opening", ja: "いま一番確度が高い", ko: "지금 가장 확률이 높은 후보" }),
      meta: `${focusCandidate.score} 分 · ${formatRelativeTime(focusCandidate.timestamp)} · ${getCandidateLane(focusCandidate).label}`,
      action: "focus-candidate",
      url: focusCandidate.url,
      tone: "accent"
    });
  }

  const secondary = candidates.find((candidate) => candidate.url !== focusCandidate?.url);
  if (secondary) {
    items.push({
      title: localize({
        "zh-Hans": `第二顺位盯 @${secondary.authorHandle || "候选"}`,
        "zh-Hant": `第二順位盯 @${secondary.authorHandle || "候選"}`,
        en: `Keep @${secondary.authorHandle || "candidate"} warm`,
        ja: `@${secondary.authorHandle || "候補"} を次に見る`,
        ko: `@${secondary.authorHandle || "후보"} 는 다음 순서`
      }),
      reason: Array.isArray(secondary.highlights) && secondary.highlights.length
        ? secondary.highlights[0]
        : localize({ "zh-Hans": "适合在主线之后补一条", "zh-Hant": "適合在主線之後補一條", en: "Good second move after the main reply", ja: "主線の後で触りやすい", ko: "메인 다음 수로 적합" }),
      meta: `${secondary.score} 分 · ${getCandidateLane(secondary).label}`,
      action: "focus-candidate",
      url: secondary.url,
      tone: "success"
    });
  }

  const relationshipPriority = relationships.find((item) => ["mutual", "pinned", "follow-up"].includes(item.relationship?.status));
  if (relationshipPriority) {
    items.push({
      title: localize({
        "zh-Hans": `别丢 @${relationshipPriority.handle}`,
        "zh-Hant": `別丟 @${relationshipPriority.handle}`,
        en: `Do not lose @${relationshipPriority.handle}`,
        ja: `@${relationshipPriority.handle} を落とさない`,
        ko: `@${relationshipPriority.handle} 관계 놓치지 않기`
      }),
      reason: relationshipPriority.relationship?.status === "mutual"
        ? localize({ "zh-Hans": "这类互关位最容易滚出连续对话", "zh-Hant": "這類互關位最容易滾出連續對話", en: "Mutuals are the easiest lane to turn into a visible back-and-forth", ja: "相互フォローは往復会話に育ちやすい", ko: "맞팔 라인은 왕복 대화로 이어지기 쉽습니다" })
        : relationshipPriority.relationship?.status === "pinned"
        ? localize({ "zh-Hans": "这类关系值得持续占位", "zh-Hant": "這類關係值得持續佔位", en: "This relationship deserves durable presence", ja: "継続して触る価値がある", ko: "지속적으로 관리할 가치가 있음" })
        : localize({ "zh-Hans": "已经进入下一次触达队列", "zh-Hant": "已經進入下一次觸達隊列", en: "Already queued for the next touch", ja: "次の接触キューに入っている", ko: "다음 터치 큐에 올라가 있음" }),
      meta: getRelationshipStateLabel(relationshipPriority.relationship?.status || "") || relationshipPriority.status,
      tone: relationshipPriority.relationship?.status === "mutual" ? "success" : relationshipPriority.relationship?.status === "pinned" ? "accent" : "warning"
    });
  } else if (items.length < 3) {
    const targetReplies = Math.max(3, hotCandidatesTarget(candidates));
    const remaining = Math.max(0, targetReplies - repliesToday);
    items.push({
      title: localize({
        "zh-Hans": "把今日覆盖率拉起来",
        "zh-Hant": "把今日覆蓋率拉起來",
        en: "Raise today’s coverage",
        ja: "今日のカバー率を上げる",
        ko: "오늘 커버리지를 끌어올리기"
      }),
      reason: localize({
        "zh-Hans": remaining > 0 ? `今天还差 ${remaining} 条主动回复，增长势能才会更像产品而不是看板。` : "今天的回复动作已经够了，接下来更适合跟进关系和窗口。",
        "zh-Hant": remaining > 0 ? `今天還差 ${remaining} 條主動回覆，增長勢能才會更像產品而不是看板。` : "今天的回覆動作已經夠了，接下來更適合跟進關係和窗口。",
        en: remaining > 0 ? `${remaining} proactive replies are still missing if you want the growth pulse to feel real.` : "Reply volume is fine today; now follow relationships and windows.",
        ja: remaining > 0 ? `今日の伸びを実感するには、あと ${remaining} 件ほど能動的な返信が欲しい。` : "今日は返信量は足りているので、関係と窓を追う段階です。",
        ko: remaining > 0 ? `오늘 성장감을 내려면 아직 ${remaining}개의 능동 답글이 더 필요합니다.` : "오늘 답글량은 충분하니 이제 관계와 타이밍을 챙기면 됩니다."
      }),
      meta: `lift +${growthLift}`,
      tone: remaining > 0 ? "warning" : "success"
    });
  }

  return items.slice(0, 3);
}

function getReplyArchiveLane(entry) {
  const shippedLabel = localize({
    "zh-Hans": "已发出",
    "zh-Hant": "已發出",
    en: "Shipped",
    ja: "送信済み",
    ko: "발송 완료"
  });
  const lane = String(entry?.lane || "").trim();
  const slotLabel = entry?.slot ? getQueueSlotTexts(entry.slot).label : "";
  return [lane || shippedLabel, slotLabel].filter(Boolean).join(" · ");
}

function getReplyArchiveStubLabel(entry) {
  if (Number(entry?.replyObservedViews || 0) > 0) {
    return localize({
      "zh-Hans": "回复曝光",
      "zh-Hant": "回覆曝光",
      en: "Reply views",
      ja: "返信表示",
      ko: "답글 조회"
    });
  }
  const topicKey = Array.isArray(entry?.matchedTopics) ? entry.matchedTopics[0] : "";
  if (topicKey) {
    return getTopicLabel(topicKey);
  }
  const languageKey = Array.isArray(entry?.matchedLanguages) ? entry.matchedLanguages[0] : "";
  if (languageKey) {
    return getLanguageLabel(languageKey);
  }
  if (entry?.slot) {
    return getQueueSlotTexts(entry.slot).label;
  }
  return localize({
    "zh-Hans": "状态",
    "zh-Hant": "狀態",
    en: "Status",
    ja: "状態",
    ko: "상태"
  });
}

function getReplyArchiveStubValue(entry) {
  if (Number(entry?.replyObservedViews || 0) > 0) {
    return formatCompactCount(entry.replyObservedViews);
  }
  if (Number(entry?.pickupViews || 0) > 0) {
    return formatCompactCount(entry.pickupViews);
  }
  return String(entry?.score || "√");
}

function getReplyArchiveStubMeta(entry) {
  const parts = [];
  const replyObservedSummary = getReplyObservedSummary(entry);
  if (replyObservedSummary) {
    parts.push(replyObservedSummary);
  } else if (entry?.replyCheckedAt || entry?.replyTrafficCapturedAt) {
    parts.push(getReplyObservedMetaText(entry));
  }
  const pickupStatus = normalizePickupStatus(entry?.pickupStatus, entry?.pickupCheckedAt ? "quiet" : "pending");
  if (entry?.pickupCheckedAt || pickupStatus === "pending") {
    parts.push(getPickupStatusLabel(pickupStatus));
  }
  const pickupDelta = getPickupDeltaSummary(entry);
  if (pickupDelta) {
    parts.push(pickupDelta);
  } else if (entry?.pickupCheckedAt) {
    parts.push(getPickupCheckMetaText({
      shippedAt: entry.timestamp,
      lastCheckedAt: entry.pickupCheckedAt
    }));
  }
  if (Array.isArray(entry?.highlights) && entry.highlights[0]) {
    parts.push(entry.highlights[0]);
  }
  if (entry?.executionLatencyMs) {
    parts.push(localize({
      "zh-Hans": `交接后 ${formatQueueAgeValue(entry.executionLatencyMs)} 落地`,
      "zh-Hant": `交接後 ${formatQueueAgeValue(entry.executionLatencyMs)} 落地`,
      en: `Landed ${formatQueueAgeValue(entry.executionLatencyMs)} after handoff`,
      ja: `引き継ぎから ${formatQueueAgeValue(entry.executionLatencyMs)} で着地`,
      ko: `핸드오프 후 ${formatQueueAgeValue(entry.executionLatencyMs)} 만에 착지`
    }));
  }
  if (entry?.authorVerified) {
    parts.push(localize({
      "zh-Hans": "认证账号",
      "zh-Hant": "認證帳號",
      en: "Verified account",
      ja: "認証アカウント",
      ko: "인증 계정"
    }));
  }
  if (!parts.length && entry?.keywordMatched) {
    parts.push(localize({
      "zh-Hans": "命中主题/语言信号",
      "zh-Hant": "命中主題/語言訊號",
      en: "Matched topic/language signal",
      ja: "話題・言語シグナル一致",
      ko: "주제/언어 신호 일치"
    }));
  }
  if (!parts.length && entry?.slot) {
    parts.push(getQueueSlotTexts(entry.slot).hint);
  }
  if (!parts.length) {
    parts.push(localize({
      "zh-Hans": "真实回复已落地",
      "zh-Hant": "真實回覆已落地",
      en: "Real reply landed",
      ja: "実返信として着地",
      ko: "실제 답글로 착지"
    }));
  }
  return parts.slice(0, 2).join(" · ");
}

function getReplyArchiveStubSerial(entry, index) {
  const parts = [];
  if (entry?.slot) {
    parts.push(getQueueSlotTexts(entry.slot).label);
  }
  if (entry?.lane) {
    parts.push(String(entry.lane).trim());
  }
  if (!parts.length) {
    parts.push(localize({
      "zh-Hans": `记录 ${String(index + 1).padStart(3, "0")}`,
      "zh-Hant": `記錄 ${String(index + 1).padStart(3, "0")}`,
      en: `Log ${String(index + 1).padStart(3, "0")}`,
      ja: `記録 ${String(index + 1).padStart(3, "0")}`,
      ko: `기록 ${String(index + 1).padStart(3, "0")}`
    }));
  }
  return parts.join(" · ");
}

function appendReplyArchiveSignals(container, entry) {
  const replyRow = document.createElement("div");
  replyRow.className = "deskSignalRow";
  replyRow.appendChild(createSummaryChip(localize({
    "zh-Hans": "回复自曝",
    "zh-Hant": "回覆自曝",
    en: "Reply self",
    ja: "返信自体",
    ko: "답글 자체"
  }), Number(entry?.replyObservedViews || 0) > 0 ? "accent" : "soft"));
  replyRow.appendChild(createSummaryChip(
    getReplyObservedSummary(entry) || getReplyObservedMetaText(entry),
    Number(entry?.replyObservedViews || 0) > 0 ? "accent" : "soft"
  ));
  container.appendChild(replyRow);

  const pickupRow = document.createElement("div");
  pickupRow.className = "deskSignalRow";
  pickupRow.appendChild(createSummaryChip(localize({
    "zh-Hans": "线程观测",
    "zh-Hant": "線程觀測",
    en: "Thread observed",
    ja: "スレッド観測",
    ko: "스레드 관측"
  }), "soft"));
  pickupRow.appendChild(createSummaryChip(
    getPickupStatusLabel(normalizePickupStatus(entry?.pickupStatus, entry?.pickupCheckedAt ? "quiet" : "pending")),
    getPickupStatusTone(entry?.pickupStatus)
  ));
  if (getPickupDeltaSummary(entry)) {
    pickupRow.appendChild(createSummaryChip(getPickupDeltaSummary(entry), "success"));
  } else if (entry?.pickupCheckedAt) {
    pickupRow.appendChild(createSummaryChip(getPickupCheckMetaText({
      shippedAt: entry.timestamp,
      lastCheckedAt: entry.pickupCheckedAt
    }), "soft"));
  }
  if (entry?.pickupAuthorEngaged) {
    pickupRow.appendChild(createSummaryChip(localize({
      "zh-Hans": "作者可见回流",
      "zh-Hant": "作者可見回流",
      en: "Visible author re-engagement",
      ja: "作者の再参加あり",
      ko: "작성자 재참여 확인"
    }), "success"));
  }
  container.appendChild(pickupRow);
}

function appendReplyArchiveActions(container, entry) {
  const actionRow = document.createElement("div");
  actionRow.className = "deskActionRow";
  actionRow.appendChild(createDeskActionButton("check-pickup", localize({
    "zh-Hans": "更新表现",
    "zh-Hant": "更新表現",
    en: "Refresh stats",
    ja: "実績更新",
    ko: "성과 업데이트"
  }), entry.url || "", (entry?.pickupCheckedAt || entry?.replyCheckedAt) ? "soft" : "accent"));
  actionRow.appendChild(createDeskActionButton("open-post", localize({
    "zh-Hans": "打开原帖",
    "zh-Hant": "打開原貼",
    en: "Open post",
    ja: "元投稿を開く",
    ko: "원문 열기"
  }), entry.url || "", "primary"));
  if (entry?.pickupAuthorReplyUrl) {
    actionRow.appendChild(createDeskActionButton("open-post", localize({
      "zh-Hans": "打开作者回流",
      "zh-Hant": "打開作者回流",
      en: "Open author reply",
      ja: "作者の返信を開く",
      ko: "작성자 답글 열기"
    }), entry.pickupAuthorReplyUrl, "accent"));
  }
  container.appendChild(actionRow);
}

function createReplyArchiveCard(entry, index) {
  const item = document.createElement("article");
  item.className = "deskItem deskItem--reply";
  if (entry?.url) {
    item.dataset.url = entry.url;
  }
  item.innerHTML = buildDeskTicketMarkup({
    serial: `RD-R${String(index + 1).padStart(3, "0")}`,
    lane: getReplyArchiveLane(entry),
    handle: entry.authorHandle ? `@${entry.authorHandle}` : "reply",
    text: entry.replyText || entry.text || "",
    time: formatRelativeTime(entry.timestamp),
    verified: entry.authorVerified,
    mediaKind: entry.mediaKind || "text",
    stubLabel: getReplyArchiveStubLabel(entry),
    stubValue: getReplyArchiveStubValue(entry),
    stubMeta: getReplyArchiveStubMeta(entry),
    stubSerial: getReplyArchiveStubSerial(entry, index),
    tier: entry.tier || "replied"
  });

  const main = item.querySelector(".deskMain");
  if (main) {
    appendReplyArchiveSignals(main, entry);
    appendReplyArchiveActions(main, entry);
  }
  return item;
}

function hotCandidatesTarget(candidates) {
  return Math.min(5, Math.max(3, candidates.filter((candidate) => getCandidateLane(candidate).key === "now").length + 1));
}

function buildRelationshipItems(candidates, replyEntries) {
  const t = getTexts();
  const seen = new Map();
  const candidateByHandle = new Map(
    candidates
      .map((candidate) => [normalizeHandleKey(candidate.authorHandle), candidate])
      .filter(([handleKey, candidate]) => Boolean(handleKey && candidate))
  );
  replyEntries.forEach((entry) => {
    const handle = String(entry.authorHandle || '').trim();
    const handleKey = normalizeHandleKey(handle);
    if (!handle || !handleKey || seen.has(handleKey)) {
      return;
    }
    const candidateMatch = candidateByHandle.get(handleKey) || null;
    const relationship = getRelationshipState(handle);
    seen.set(handleKey, {
      handle,
      candidateMatch,
      relationship,
      status: candidateMatch ? t.relationshipReengaged : t.relationshipActive,
      rawTimestamp: Number(entry.timestamp || 0),
      time: formatRelativeTime(entry.timestamp),
      score: candidateMatch ? String(candidateMatch.score ?? 0) : '√'
    });
  });
  candidates.forEach((candidate) => {
    const handle = String(candidate.authorHandle || '').trim();
    const handleKey = normalizeHandleKey(handle);
    if (!handle || !handleKey || seen.has(handleKey)) {
      return;
    }
    const relationship = getRelationshipState(handle);
    seen.set(handleKey, {
      handle,
      candidateMatch: candidate,
      relationship,
      status: t.relationshipDormant,
      rawTimestamp: Number(candidate.timestamp || 0),
      time: formatRelativeTime(candidate.timestamp),
      score: String(candidate.score ?? 0)
    });
  });
  return Array.from(seen.values())
    .sort((left, right) => {
      const leftRank = left.relationship?.status === "mutual" ? 4 : left.relationship?.status === "pinned" ? 3 : left.relationship?.status === "follow-up" ? 2 : left.relationship?.status === "snoozed" ? 0 : 1;
      const rightRank = right.relationship?.status === "mutual" ? 4 : right.relationship?.status === "pinned" ? 3 : right.relationship?.status === "follow-up" ? 2 : right.relationship?.status === "snoozed" ? 0 : 1;
      return rightRank - leftRank || (Number(right.rawTimestamp || 0) - Number(left.rawTimestamp || 0));
    })
    .slice(0, 5);
}

function buildRelationshipCard(item, index) {
  const card = document.createElement('article');
  card.className = 'relationshipCard';
  const relationshipLabel = item.relationship?.status ? getRelationshipStateLabel(item.relationship.status) : "";
  card.innerHTML = `
    <div class="relationshipCardTop">
      <strong>@${escapeHtml(item.handle)}</strong>
      <span class="relationshipCardSerial">RD-RM${String(index + 1).padStart(2, '0')}</span>
    </div>
    <div class="relationshipCardMeta">
      <span>${escapeHtml(item.status)}</span>
      <span>${escapeHtml(item.time)}</span>
    </div>
    <div class="relationshipCardStub">
      <span>score</span>
      <strong>${escapeHtml(item.score)}</strong>
    </div>
  `;
  if (relationshipLabel) {
    const statePill = document.createElement("div");
    statePill.className = "relationshipStatePill";
    statePill.dataset.tone = getLocalizedStatusDef(item.relationship.status)?.tone || "soft";
    statePill.textContent = relationshipLabel;
    card.appendChild(statePill);
  }

  const actions = document.createElement("div");
  actions.className = "relationshipCardActions";
  RELATIONSHIP_STATE_DEFS.forEach((stateDef) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "miniPillButton";
    button.dataset.action = "set-relationship-state";
    button.dataset.handle = item.handle;
    button.dataset.status = stateDef.key;
    button.textContent = localize(stateDef.actionLabel);
    button.classList.toggle("active", item.relationship?.status === stateDef.key);
    actions.appendChild(button);
  });

  if (item.candidateMatch?.url) {
    const focusButton = document.createElement("button");
    focusButton.type = "button";
    focusButton.className = "miniPillButton miniPillButton--focus";
    focusButton.dataset.action = "focus-candidate";
    focusButton.dataset.url = item.candidateMatch.url;
    focusButton.textContent = localize({
      "zh-Hans": "切到这条",
      "zh-Hant": "切到這條",
      en: "Focus",
      ja: "見る",
      ko: "보기"
    });
    actions.appendChild(focusButton);
  }

  card.appendChild(actions);
  return card;
}

function buildReplyPerformanceSnapshot(replyEntries = []) {
  const summary = replyEntries.reduce((summary, entry) => {
    const replyViews = Math.max(0, Number(entry?.replyObservedViews) || 0);
    const replyLikes = Math.max(0, Number(entry?.replyObservedLikes) || 0);
    const replyReplies = Math.max(0, Number(entry?.replyObservedReplies) || 0);
    const replyChecked = Number(entry?.replyCheckedAt || entry?.replyTrafficCapturedAt || 0) > 0;
    const pickupViews = Math.max(0, Number(entry?.pickupViews) || 0);
    const deltaViews = Math.max(0, Number(entry?.pickupDeltaViews) || 0);
    const deltaLikes = Math.max(0, Number(entry?.pickupDeltaLikes) || 0);
    const deltaReplies = Math.max(0, Number(entry?.pickupDeltaReplies) || 0);
    const checked = Number(entry?.pickupCheckedAt || 0) > 0;
    const status = normalizePickupStatus(entry?.pickupStatus, checked ? "quiet" : "pending");
    summary.replies += 1;
    summary.checked += checked ? 1 : 0;
    summary.replyChecked += replyChecked ? 1 : 0;
    summary.pickedUp += status === "picked-up" || status === "author-engaged" ? 1 : 0;
    summary.authorBack += status === "author-engaged" || Boolean(entry?.pickupAuthorEngaged) ? 1 : 0;
    summary.totalReplyViews += replyViews;
    summary.totalReplyLikes += replyLikes;
    summary.totalReplyReplies += replyReplies;
    summary.totalTargetViews += pickupViews;
    summary.totalTargetDeltaViews += deltaViews;
    summary.totalTargetDeltaLikes += deltaLikes;
    summary.totalTargetDeltaReplies += deltaReplies;
    summary.bestReplyViews = Math.max(summary.bestReplyViews, replyViews);
    summary.bestReplyLikes = Math.max(summary.bestReplyLikes, replyLikes);
    summary.bestTargetViewDelta = Math.max(summary.bestTargetViewDelta, deltaViews);
    return summary;
  }, {
    replies: 0,
    checked: 0,
    replyChecked: 0,
    pickedUp: 0,
    authorBack: 0,
    totalReplyViews: 0,
    totalReplyLikes: 0,
    totalReplyReplies: 0,
    totalTargetViews: 0,
    totalTargetDeltaViews: 0,
    totalTargetDeltaLikes: 0,
    totalTargetDeltaReplies: 0,
    bestReplyViews: 0,
    bestReplyLikes: 0,
    bestTargetViewDelta: 0
  });
  return {
    ...summary,
    totalViews: summary.totalReplyViews,
    totalDeltaViews: summary.totalTargetDeltaViews,
    totalDeltaLikes: summary.totalTargetDeltaLikes,
    totalDeltaReplies: summary.totalTargetDeltaReplies,
    bestViewDelta: summary.bestTargetViewDelta,
    bestObservedViews: summary.bestReplyViews
  };
}

function buildTopReplyPerformanceItems(replyEntries = []) {
  return replyEntries
    .map((entry) => {
      const replyViews = Math.max(0, Number(entry?.replyObservedViews) || 0);
      const replyLikes = Math.max(0, Number(entry?.replyObservedLikes) || 0);
      const replyReplies = Math.max(0, Number(entry?.replyObservedReplies) || 0);
      const pickupViews = Math.max(0, Number(entry?.pickupViews) || 0);
      const deltaViews = Math.max(0, Number(entry?.pickupDeltaViews) || 0);
      const deltaLikes = Math.max(0, Number(entry?.pickupDeltaLikes) || 0);
      const deltaReplies = Math.max(0, Number(entry?.pickupDeltaReplies) || 0);
      const score = (
        replyViews * 1.4 +
        replyLikes * 140 +
        replyReplies * 220 +
        pickupViews * 0.2 +
        deltaViews * 1.2 +
        deltaLikes * 72 +
        deltaReplies * 120
      );
      const status = normalizePickupStatus(entry?.pickupStatus, entry?.pickupCheckedAt ? "quiet" : "pending");
      return {
        entry,
        score,
        status
      };
    })
    .sort((left, right) => (
      right.score - left.score ||
      (Number(right.entry?.replyObservedViews) || 0) - (Number(left.entry?.replyObservedViews) || 0) ||
      (Number(right.entry?.pickupViews) || 0) - (Number(left.entry?.pickupViews) || 0) ||
      Math.max(Number(right.entry?.replyCheckedAt || 0), Number(right.entry?.pickupCheckedAt || 0)) -
        Math.max(Number(left.entry?.replyCheckedAt || 0), Number(left.entry?.pickupCheckedAt || 0))
    ))
    .slice(0, 3);
}

function renderDashboardLaunchPreview(candidateCount, performanceSnapshot) {
  if (!els.dashboardPreviewChips) {
    return;
  }
  const chips = [
    createDeskLedgerChip(getTexts().visibleLabel, String(candidateCount), candidateCount ? "accent" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "已回",
      "zh-Hant": "已回",
      en: "Replied",
      ja: "返信済み",
      ko: "발송"
    }), String(performanceSnapshot?.replies || 0), (performanceSnapshot?.replies || 0) ? "success" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "回复曝光",
      "zh-Hant": "回覆曝光",
      en: "Reply views",
      ja: "返信表示",
      ko: "답글 조회"
    }), formatCompactCount(performanceSnapshot?.totalReplyViews || 0), (performanceSnapshot?.totalReplyViews || 0) ? "accent" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "线程回复增量",
      "zh-Hant": "線程回覆增量",
      en: "Thread reply lift",
      ja: "スレッド返信増分",
      ko: "스레드 답글 증가"
    }), formatCompactCount(performanceSnapshot?.totalTargetDeltaReplies || 0), (performanceSnapshot?.totalTargetDeltaReplies || 0) ? "warning" : "soft")
  ];

  els.dashboardPreviewChips.innerHTML = "";
  chips.forEach((chip) => els.dashboardPreviewChips.appendChild(chip));

  setText(els.dashboardLaunchMeta, localize({
    "zh-Hans": (performanceSnapshot?.replies || 0) || (performanceSnapshot?.totalReplyViews || 0)
      ? `首页只留入口；进仪表盘先看 ${performanceSnapshot.replies} 条已发回复的表现，再决定下一步。`
      : "首页只留入口；候选、表现和关键词都在下一层处理。",
    "zh-Hant": (performanceSnapshot?.replies || 0) || (performanceSnapshot?.totalReplyViews || 0)
      ? `首頁只留入口；進儀表盤先看 ${performanceSnapshot.replies} 條已發回覆的表現，再決定下一步。`
      : "首頁只留入口；候選、表現和關鍵詞都在下一層處理。",
    en: (performanceSnapshot?.replies || 0) || (performanceSnapshot?.totalReplyViews || 0)
      ? `Keep the home layer light. Inside the dashboard, start with the performance of your ${performanceSnapshot.replies} shipped replies.`
      : "Keep only the entry on the home layer, then handle candidates and performance in the next layer.",
    ja: (performanceSnapshot?.replies || 0) || (performanceSnapshot?.totalReplyViews || 0)
      ? `ホーム層は入口だけに保ちます。ダッシュボードでは送信済み ${performanceSnapshot.replies} 件の返信実績を先に見ます。`
      : "ホーム層は入口だけにして、候補・実績・キーワードは次の層で扱います。",
    ko: (performanceSnapshot?.replies || 0) || (performanceSnapshot?.totalReplyViews || 0)
      ? `홈 레이어는 입구만 두고, 대시보드 안에서는 이미 보낸 ${performanceSnapshot.replies}개 답글 성과를 먼저 봅니다.`
      : "홈 레이어는 입구만 남기고, 후보·성과·키워드는 다음 레이어에서 다룹니다."
  }));
}

function createAiRoadmapCard(item, index) {
  const card = document.createElement("article");
  card.className = "growthActionCard aiRoadmapCard";
  card.dataset.tone = item.tone || "soft";

  const top = document.createElement("div");
  top.className = "growthActionTop";
  top.innerHTML = `
    <strong>${escapeHtml(item.title)}</strong>
    <span class="growthActionSerial">RD-AI${String(index + 1).padStart(2, "0")}</span>
  `;

  const reason = document.createElement("p");
  reason.className = "growthActionReason";
  reason.textContent = item.reason;

  const meta = document.createElement("div");
  meta.className = "growthActionMeta";
  meta.appendChild(createSummaryChip(item.meta, item.tone || "soft"));

  card.append(top, reason, meta);
  return card;
}

function createPerformanceLeadCard(topPerformanceItem, performanceSnapshot) {
  const card = document.createElement("section");
  card.className = "performanceLeadCard";

  const entry = topPerformanceItem?.entry || null;
  const header = document.createElement("div");
  header.className = "performanceLeadHeader";
  header.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "表现摘要",
        "zh-Hant": "表現摘要",
        en: "Performance lead",
        ja: "実績サマリー",
        ko: "성과 요약"
      }))}</span>
      <strong>${escapeHtml(entry?.authorHandle ? `@${entry.authorHandle}` : localize({
        "zh-Hans": "还没有头部表现项",
        "zh-Hant": "還沒有頭部表現項",
        en: "No leading reply yet",
        ja: "まだ先頭実績はありません",
        ko: "아직 대표 성과가 없습니다"
      }))}</strong>
    </div>
    <span class="performanceLeadSerial">${escapeHtml(localize({
      "zh-Hans": "最佳回复",
      "zh-Hant": "最佳回覆",
      en: "Top reply",
      ja: "トップ返信",
      ko: "최상위 답글"
    }))}</span>
  `;

  const body = document.createElement("p");
  body.className = "performanceLeadBody";
  body.textContent = entry
    ? localize({
        "zh-Hans": `目前最有起色的是这条回复。${getReplyObservedSummary(entry) ? `回复自曝 ${getReplyObservedSummary(entry)}，` : ""}${getPickupDeltaSummary(entry) ? `线程观测 ${getPickupDeltaSummary(entry)}，` : ""}它可以作为今天调权时最值得参考的样本。`,
        "zh-Hant": `目前最有起色的是這條回覆。${getReplyObservedSummary(entry) ? `回覆自曝 ${getReplyObservedSummary(entry)}，` : ""}${getPickupDeltaSummary(entry) ? `線程觀測 ${getPickupDeltaSummary(entry)}，` : ""}它可以作為今天調權時最值得參考的樣本。`,
        en: `This is the clearest live winner right now. ${getReplyObservedSummary(entry) ? `Reply-side performance: ${getReplyObservedSummary(entry)}. ` : ""}${getPickupDeltaSummary(entry) ? `Thread-side pickup: ${getPickupDeltaSummary(entry)}. ` : ""}Use it as the best weighting reference for today.`,
        ja: `いま最も伸びが見えるのはこの返信です。${getReplyObservedSummary(entry) ? `返信自体は ${getReplyObservedSummary(entry)}。` : ""}${getPickupDeltaSummary(entry) ? `スレッド側では ${getPickupDeltaSummary(entry)}。` : ""}今日の重み調整の基準として使えます。`,
        ko: `지금 가장 또렷하게 뜨는 답글은 이 항목입니다. ${getReplyObservedSummary(entry) ? `답글 자체 성과는 ${getReplyObservedSummary(entry)}. ` : ""}${getPickupDeltaSummary(entry) ? `스레드 쪽 관측은 ${getPickupDeltaSummary(entry)}. ` : ""}오늘 가중치 조정의 기준 샘플로 삼기 좋습니다.`
      })
    : localize({
        "zh-Hans": "等你在 X 里发出更多回复后，这里会自动挑出当前最有表现的一条。",
        "zh-Hant": "等你在 X 裡發出更多回覆後，這裡會自動挑出目前最有表現的一條。",
        en: "Once more replies are shipped on X, this card will highlight the one performing best right now.",
        ja: "X で返信が増えると、ここに現在最も伸びている一件が自動で出ます。",
        ko: "X에서 답글을 더 보내면 여기서 현재 가장 잘 나가는 한 개를 자동으로 강조합니다."
      });

  const strip = document.createElement("div");
  strip.className = "performanceLeadStrip";
  [
    createDeskLedgerChip(localize({
      "zh-Hans": "回复总曝光",
      "zh-Hant": "回覆總曝光",
      en: "Reply views",
      ja: "返信総表示",
      ko: "답글 총조회"
    }), formatCompactCount(performanceSnapshot?.totalReplyViews || 0), (performanceSnapshot?.totalReplyViews || 0) ? "accent" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "线程观测曝光",
      "zh-Hant": "線程觀測曝光",
      en: "Thread views",
      ja: "スレッド観測表示",
      ko: "스레드 관측 조회"
    }), formatCompactCount(performanceSnapshot?.totalTargetViews || 0), (performanceSnapshot?.totalTargetViews || 0) ? "soft" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "最佳回复曝光",
      "zh-Hant": "最佳回覆曝光",
      en: "Best reply views",
      ja: "最高返信表示",
      ko: "최고 답글 조회"
    }), formatCompactCount(performanceSnapshot?.bestReplyViews || 0), (performanceSnapshot?.bestReplyViews || 0) ? "success" : "soft")
  ].forEach((chip) => strip.appendChild(chip));

  card.append(header, body, strip);
  return card;
}

function createAiReplyLeadCard(summary = {}) {
  const focusCandidate = summary.focusCandidate || null;
  const attributionSummary = summary.attributionSummary || null;
  const card = document.createElement("section");
  card.className = "aiReplyLeadCard";

  const top = document.createElement("div");
  top.className = "aiReplyLeadTop";
  top.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "下一块该做",
        "zh-Hant": "下一塊該做",
        en: "Next AI layer",
        ja: "次に作るもの",
        ko: "다음 AI 레이어"
      }))}</span>
      <strong>${escapeHtml(localize({
        "zh-Hans": "把 AI 从占位做成工具",
        "zh-Hant": "把 AI 從佔位做成工具",
        en: "Turn AI from placeholder into tool",
        ja: "AI を占位から道具へ",
        ko: "AI를 자리표시자에서 도구로"
      }))}</strong>
    </div>
    <span class="performanceLeadSerial">RD-AI-LIVE</span>
  `;

  const body = document.createElement("p");
  body.className = "aiReplyLeadBody";
  body.textContent = focusCandidate
    ? localize({
        "zh-Hans": `当前最适合先接入 AI 的对象是 @${focusCandidate.authorHandle || "候选"}。先让 AI 生成 3 个更像真人的切角，再把推荐排期和记忆线索一起带出来，会比继续手动堆页签更有价值。`,
        "zh-Hant": `目前最適合先接入 AI 的對象是 @${focusCandidate.authorHandle || "候選"}。先讓 AI 生成 3 個更像真人的切角，再把推薦排期和記憶線索一起帶出來，會比繼續手動堆頁籤更有價值。`,
        en: `The best object to hand to AI next is @${focusCandidate.authorHandle || "candidate"}. Generating three more human reply angles plus a recommended slot and memory hints is more valuable than adding another manual tab.`,
        ja: `次に AI へ渡すべき対象は @${focusCandidate.authorHandle || "候補"} です。より人間らしい 3 つの返し方と、推奨排期と記憶ヒントを一緒に出せる方が、手動タブを増やすより価値があります。`,
        ko: `다음으로 AI에 넘길 가장 좋은 대상은 @${focusCandidate.authorHandle || "후보"} 입니다. 더 사람 같은 3가지 답글 각도와 추천 배치, 기억 힌트를 함께 주는 편이 수동 탭을 더 만드는 것보다 가치 있습니다.`
      })
    : localize({
        "zh-Hans": "AI 回复层的目标已经清楚了：先做更像真人的回复草稿，再接排期与记忆，不再把这些内容分散到多个手动页签里。",
        "zh-Hant": "AI 回覆層的目標已經清楚了：先做更像真人的回覆草稿，再接排期與記憶，不再把這些內容分散到多個手動頁籤裡。",
        en: "The AI reply layer now has a clear job: stronger human-sounding drafts first, then scheduling and memory, instead of scattering these concepts across manual tabs.",
        ja: "AI 返信層の役割は明確です。まず人間らしい返信草稿を作り、その次に排期と記憶をつなぎ、これ以上手動タブへ分散させません。",
        ko: "AI 답글 레이어의 역할은 분명합니다. 먼저 더 사람 같은 초안을 만들고, 그 다음 배치와 기억을 잇는 것입니다."
      });

  const strip = document.createElement("div");
  strip.className = "performanceLeadStrip aiReplyLeadStrip";
  if (focusCandidate) {
    strip.append(
      createDeskLedgerChip(localize({
        "zh-Hans": "目标对象",
        "zh-Hant": "目標對象",
        en: "Target",
        ja: "対象",
        ko: "대상"
      }), `@${focusCandidate.authorHandle || "candidate"}`, "accent"),
      createDeskLedgerChip(localize({
        "zh-Hans": "当前分数",
        "zh-Hant": "目前分數",
        en: "Score",
        ja: "現在のスコア",
        ko: "현재 점수"
      }), String(focusCandidate.score || 0), "warning"),
      createDeskLedgerChip(localize({
        "zh-Hans": "建议排期",
        "zh-Hant": "建議排期",
        en: "Suggested slot",
        ja: "推奨排期",
        ko: "추천 배치"
      }), getQueueSlotTexts(attributionSummary?.preferredSlot || getDefaultQueueSlot(focusCandidate)).label, "success")
    );
  } else {
    strip.append(
      createDeskLedgerChip(localize({
        "zh-Hans": "草稿层",
        "zh-Hant": "草稿層",
        en: "Draft layer",
        ja: "下書き層",
        ko: "초안 레이어"
      }), localize({ "zh-Hans": "先做强", "zh-Hant": "先做強", en: "First", ja: "先行", ko: "우선" }), "accent"),
      createDeskLedgerChip(localize({
        "zh-Hans": "排期层",
        "zh-Hant": "排期層",
        en: "Scheduling",
        ja: "排期層",
        ko: "배치 레이어"
      }), localize({ "zh-Hans": "第二步", "zh-Hant": "第二步", en: "Next", ja: "次", ko: "다음" }), "warning"),
      createDeskLedgerChip(localize({
        "zh-Hans": "记忆层",
        "zh-Hant": "記憶層",
        en: "Memory",
        ja: "記憶層",
        ko: "기억 레이어"
      }), localize({ "zh-Hans": "后接入", "zh-Hant": "後接入", en: "Later", ja: "後段", ko: "이후" }), "soft")
    );
  }

  const stageStrip = document.createElement("div");
  stageStrip.className = "aiStageStrip";
  [
    {
      label: localize({ "zh-Hans": "1. 更强草稿", "zh-Hant": "1. 更強草稿", en: "1. Better drafts", ja: "1. 下書き強化", ko: "1. 더 강한 초안" }),
      tone: "accent"
    },
    {
      label: localize({ "zh-Hans": "2. AI 排期", "zh-Hant": "2. AI 排期", en: "2. AI scheduling", ja: "2. AI排期", ko: "2. AI 배치" }),
      tone: "warning"
    },
    {
      label: localize({ "zh-Hans": "3. 关系记忆", "zh-Hant": "3. 關係記憶", en: "3. Relationship memory", ja: "3. 関係記憶", ko: "3. 관계 기억" }),
      tone: "success"
    }
  ].forEach((item) => stageStrip.appendChild(createSummaryChip(item.label, item.tone)));

  card.append(top, body, strip, stageStrip);
  return card;
}

function getAiAttributionKindLabel(summary = null) {
  switch (summary?.kind) {
    case "author-engaged":
      return localize({
        "zh-Hans": "作者回流记忆",
        "zh-Hant": "作者回流記憶",
        en: "Author-back memory",
        ja: "作者再参加の記憶",
        ko: "작성자 재참여 기억"
      });
    case "handle-picked-up":
      return localize({
        "zh-Hans": "作者级验证",
        "zh-Hant": "作者級驗證",
        en: "Handle-validated",
        ja: "相手単位で検証済み",
        ko: "핸들 단위 검증"
      });
    case "topic-validated":
      return localize({
        "zh-Hans": "主题级验证",
        "zh-Hant": "主題級驗證",
        en: "Topic-validated",
        ja: "話題単位で検証済み",
        ko: "주제 단위 검증"
      });
    default:
      return localize({
        "zh-Hans": "复查记忆",
        "zh-Hant": "複查記憶",
        en: "Reviewed memory",
        ja: "再確認メモリ",
        ko: "재검토 기억"
      });
  }
}

function buildAiSchedulingInsight(candidate, attributionSummary = null, recommendedSlot = "") {
  if (!candidate || !recommendedSlot) {
    return null;
  }

  const lane = getCandidateLane(candidate);
  const laneDefault = getLaneDefaultQueueSlot(candidate);
  const ageMinutes = getCandidateAgeMinutes(candidate);
  const score = Math.max(0, Number(candidate?.score) || 0);
  const replies = Math.max(0, Number(candidate?.replies) || 0);
  const memorySlot = String(attributionSummary?.preferredSlot || "").trim();
  const memoryShifted = Boolean(memorySlot) && memorySlot === recommendedSlot && memorySlot !== laneDefault;
  const strongMemory = Number(attributionSummary?.authorEngaged || 0) > 0 || Number(attributionSummary?.pickedUp || 0) > 0;

  const title = localize({
    "zh-Hans": `为什么建议 ${getQueueSlotTexts(recommendedSlot).label}`,
    "zh-Hant": `為什麼建議 ${getQueueSlotTexts(recommendedSlot).label}`,
    en: `Why ${getQueueSlotTexts(recommendedSlot).label}`,
    ja: `なぜ ${getQueueSlotTexts(recommendedSlot).label} なのか`,
    ko: `왜 ${getQueueSlotTexts(recommendedSlot).label} 인가`
  });

  let reason = "";
  if (recommendedSlot === "next") {
    reason = memoryShifted
      ? localize({
          "zh-Hans": `帖子本身的节奏原本更像 ${getQueueSlotTexts(laneDefault).label}，但这类对象过去已经验证过更适合尽快接。现在前推到 ${getQueueSlotTexts(recommendedSlot).label}，不是为了抢，而是因为这条窗口真的短。`,
          "zh-Hant": `貼文本身的節奏原本更像 ${getQueueSlotTexts(laneDefault).label}，但這類對象過去已經驗證過更適合盡快接。現在前推到 ${getQueueSlotTexts(recommendedSlot).label}，不是為了搶，而是因為這條窗口真的短。`,
          en: `The live post rhythm by itself leaned more toward ${getQueueSlotTexts(laneDefault).label}, but prior results show this kind of target is worth catching earlier. Moving it into ${getQueueSlotTexts(recommendedSlot).label} is not about forcing urgency; it is about respecting a genuinely short window.`,
          ja: `投稿だけ見れば ${getQueueSlotTexts(laneDefault).label} 寄りですが、この種の対象は過去実績では早めに取るほうが強いです。${getQueueSlotTexts(recommendedSlot).label} へ前倒しするのは、無理に急ぐためではなく、短い窓をそのまま尊重するためです。`,
          ko: `게시물 흐름만 보면 ${getQueueSlotTexts(laneDefault).label} 쪽이지만, 이런 대상은 과거 결과상 더 빨리 잡는 편이 강했습니다. ${getQueueSlotTexts(recommendedSlot).label} 로 당기는 건 억지 긴급화가 아니라 실제로 짧은 창을 존중하는 판단입니다.`
        })
      : localize({
          "zh-Hans": `这条现在还在 ${lane.label} 窗口里，分数也够高。放到 ${getQueueSlotTexts(recommendedSlot).label} 的意义不是立刻清任务，而是趁讨论还没有钝掉时直接接进去。`,
          "zh-Hant": `這條現在還在 ${lane.label} 窗口裡，分數也夠高。放到 ${getQueueSlotTexts(recommendedSlot).label} 的意義不是立刻清任務，而是趁討論還沒有鈍掉時直接接進去。`,
          en: `This candidate is still inside the ${lane.label.toLowerCase()} window and the score is high enough. ${getQueueSlotTexts(recommendedSlot).label} is not about clearing tasks fast; it is about connecting before the discussion dulls.`,
          ja: `この候補はまだ ${lane.label} の窓にあり、スコアも十分です。${getQueueSlotTexts(recommendedSlot).label} は急いで消化するためではなく、流れが鈍る前に接ぐための判断です。`,
          ko: `이 후보는 아직 ${lane.label} 창 안에 있고 점수도 충분합니다. ${getQueueSlotTexts(recommendedSlot).label} 는 일을 빨리 치우기 위한 게 아니라 흐름이 둔해지기 전에 연결하기 위한 판단입니다.`
        });
  } else if (recommendedSlot === "tonight") {
    reason = memoryShifted
      ? localize({
          "zh-Hans": `帖子本身会把它推向 ${getQueueSlotTexts(laneDefault).label}，但历史记忆说明这类对象留到今晚更稳。先让话题再发酵一点，再在热度还在线时接，通常比硬抢即时更顺。`,
          "zh-Hant": `貼文本身會把它推向 ${getQueueSlotTexts(laneDefault).label}，但歷史記憶說明這類對象留到今晚更穩。先讓話題再發酵一點，再在熱度還在線時接，通常比硬搶即時更順。`,
          en: `The live lane would have pushed this toward ${getQueueSlotTexts(laneDefault).label}, but remembered performance says tonight is steadier. Letting it ferment a little longer, then replying while the heat still exists, is usually smoother than forcing the instant window.`,
          ja: `投稿の流れだけなら ${getQueueSlotTexts(laneDefault).label} へ寄りますが、過去実績では今夜のほうが安定します。少しだけ発酵させて、熱が残るうちに接ぐほうが無理がありません。`,
          ko: `현재 흐름만 보면 ${getQueueSlotTexts(laneDefault).label} 쪽이지만, 기억된 성과는 오늘 밤이 더 안정적이라고 말합니다. 조금 더 발효시킨 뒤 열기가 남아 있을 때 답하는 편이 즉시 창을 억지로 잡는 것보다 자연스럽습니다.`
        })
      : localize({
          "zh-Hans": `这条更像今晚要接的对象，不是因为弱，而是因为它还没到必须马上下场的程度。让它再发酵一点，再在热度没散时接，会更自然。`,
          "zh-Hant": `這條更像今晚要接的對象，不是因為弱，而是因為它還沒到必須馬上下場的程度。讓它再發酵一點，再在熱度沒散時接，會更自然。`,
          en: `This feels more like a tonight candidate, not because it is weak, but because it does not need an immediate jump. Give it a little more fermentation, then connect while the heat is still there.`,
          ja: `今夜向きなのは弱いからではなく、まだ今すぐ飛び込む必要はないからです。少しだけ発酵させて、熱が残るうちに接ぐほうが自然です。`,
          ko: `오늘 밤 쪽이 맞는 이유는 약해서가 아니라 아직 바로 뛰어들 단계는 아니기 때문입니다. 조금 더 발효시킨 뒤 열기가 남아 있을 때 연결하는 편이 자연스럽습니다.`
        });
  } else {
    reason = memoryShifted
      ? localize({
          "zh-Hans": `实时窗口本来会把它推向 ${getQueueSlotTexts(laneDefault).label}，但记忆信号提醒这类对象更适合放到 ${getQueueSlotTexts(recommendedSlot).label} 这种低压窗口慢慢接。`,
          "zh-Hant": `即時窗口本來會把它推向 ${getQueueSlotTexts(laneDefault).label}，但記憶信號提醒這類對象更適合放到 ${getQueueSlotTexts(recommendedSlot).label} 這種低壓窗口慢慢接。`,
          en: `The live window would normally push this toward ${getQueueSlotTexts(laneDefault).label}, but memory signals say this kind of target works better when handled in a lower-pressure ${getQueueSlotTexts(recommendedSlot).label} slot.`,
          ja: `リアルタイムの流れなら ${getQueueSlotTexts(laneDefault).label} 寄りですが、記憶信号ではこの種の対象は ${getQueueSlotTexts(recommendedSlot).label} の低圧な窓で取るほうが合います。`,
          ko: `실시간 흐름만 보면 ${getQueueSlotTexts(laneDefault).label} 쪽이지만, 기억 신호는 이런 대상이 ${getQueueSlotTexts(recommendedSlot).label} 같은 저압 창에서 더 잘 맞는다고 말합니다.`
        })
      : localize({
          "zh-Hans": `这条更适合留到 ${getQueueSlotTexts(recommendedSlot).label}，因为它现在已经不是抢时机的问题了。换到更低压的窗口再接，会更像顺势而不是硬插。`,
          "zh-Hant": `這條更適合留到 ${getQueueSlotTexts(recommendedSlot).label}，因為它現在已經不是搶時機的問題了。換到更低壓的窗口再接，會更像順勢而不是硬插。`,
          en: `This fits ${getQueueSlotTexts(recommendedSlot).label} better because it is no longer about winning a fast moment. Waiting for a lower-pressure slot will feel more like joining naturally than forcing entry.`,
          ja: `これは ${getQueueSlotTexts(recommendedSlot).label} に残すほうが合います。もう瞬間勝負ではなく、圧の低い窓へずらしたほうが自然に入れるからです。`,
          ko: `이건 ${getQueueSlotTexts(recommendedSlot).label} 로 남기는 편이 더 맞습니다. 이제 빠른 순간을 이기는 문제가 아니라 저압 창으로 옮길수록 더 자연스럽게 들어갈 수 있기 때문입니다.`
        });
  }

  const chips = [
    {
      label: localize({ "zh-Hans": "当前窗口", "zh-Hant": "目前窗口", en: "Live lane", ja: "現在の窓", ko: "현재 창" }),
      value: lane.label,
      tone: lane.tone || "soft"
    },
    {
      label: localize({ "zh-Hans": "默认排期", "zh-Hant": "預設排期", en: "Lane default", ja: "標準排期", ko: "기본 배치" }),
      value: getQueueSlotTexts(laneDefault).label,
      tone: "soft"
    },
    {
      label: localize({ "zh-Hans": "分数", "zh-Hant": "分數", en: "Score", ja: "スコア", ko: "점수" }),
      value: String(score),
      tone: score >= 72 ? "success" : score >= 58 ? "accent" : "soft"
    },
    {
      label: localize({ "zh-Hans": "鲜度", "zh-Hant": "鮮度", en: "Freshness", ja: "鮮度", ko: "신선도" }),
      value: ageMinutes < 60
        ? localize({ "zh-Hans": "1h内", "zh-Hant": "1h內", en: "<1h", ja: "1時間内", ko: "1시간 이내" })
        : ageMinutes < 360
          ? localize({ "zh-Hans": "6h内", "zh-Hant": "6h內", en: "<6h", ja: "6時間内", ko: "6시간 이내" })
          : localize({ "zh-Hans": "更久", "zh-Hant": "更久", en: "Older", ja: "やや経過", ko: "조금 지남" }),
      tone: ageMinutes < 240 ? "success" : ageMinutes < 720 ? "accent" : "warning"
    }
  ];

  if (memorySlot) {
    chips.push({
      label: localize({ "zh-Hans": "记忆偏好", "zh-Hant": "記憶偏好", en: "Memory slot", ja: "記憶の推奨", ko: "기억 추천" }),
      value: getQueueSlotTexts(memorySlot).label,
      tone: strongMemory ? "success" : "warning"
    });
  }
  if (replies >= 120) {
    chips.push({
      label: localize({ "zh-Hans": "线程密度", "zh-Hant": "線程密度", en: "Reply density", ja: "返信密度", ko: "답글 밀도" }),
      value: localize({ "zh-Hans": "偏高", "zh-Hant": "偏高", en: "High", ja: "高め", ko: "높음" }),
      tone: "warning"
    });
  }

  return {
    title,
    reason,
    chips: chips.slice(0, 5),
    tone: recommendedSlot === "next" ? "accent" : recommendedSlot === "tonight" ? "warning" : "soft"
  };
}

function createAiScheduleCard(summary = {}) {
  const insight = buildAiSchedulingInsight(summary.focusCandidate || null, summary.attributionSummary || null, summary.recommendedSlot || "");
  if (!insight) {
    return null;
  }

  const card = document.createElement("section");
  card.className = "aiScheduleCard";
  card.dataset.tone = insight.tone || "soft";

  const top = document.createElement("div");
  top.className = "aiScheduleTop";
  top.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "排期理由",
        "zh-Hant": "排期理由",
        en: "Scheduling logic",
        ja: "排期の理由",
        ko: "배치 이유"
      }))}</span>
      <strong>${escapeHtml(insight.title)}</strong>
    </div>
    <span class="performanceLeadSerial">RD-AI-T01</span>
  `;

  const body = document.createElement("p");
  body.className = "aiScheduleBody";
  body.textContent = insight.reason;

  const meta = document.createElement("div");
  meta.className = "aiScheduleMeta";
  insight.chips.forEach((chip) => meta.appendChild(createDeskLedgerChip(chip.label, chip.value, chip.tone || "soft")));

  card.append(top, body, meta);
  return card;
}

function buildAiPriorityInsight(focusCandidate, secondaryCandidate = null, focusAttribution = null, secondaryAttribution = null) {
  if (!focusCandidate) {
    return null;
  }

  const focusLane = getCandidateLane(focusCandidate);
  const focusScore = Math.max(0, Number(focusCandidate?.score) || 0);
  const focusAge = getCandidateAgeMinutes(focusCandidate);
  const focusMemory = Math.max(0, Number(focusAttribution?.priority || 0));

  if (!secondaryCandidate) {
    return {
      title: localize({
        "zh-Hans": "为什么先抓这一条",
        "zh-Hant": "為什麼先抓這一條",
        en: "Why this lead goes first",
        ja: "なぜこの候補が先なのか",
        ko: "왜 이 후보가 먼저인가"
      }),
      reason: localize({
        "zh-Hans": "当前没有足够接近的第二名候选，所以这条不只是默认主线，而是真的已经独立跑到前面了。",
        "zh-Hant": "目前沒有足夠接近的第二名候選，所以這條不只是預設主線，而是真的已經獨立跑到前面了。",
        en: "There is no close second candidate right now, so this is not merely the default lead. It has actually separated itself from the rest.",
        ja: "いまは十分に近い二番手候補がいないため、これは単なる既定主線ではなく、実際に頭ひとつ抜けています。",
        ko: "지금은 충분히 가까운 2위 후보가 없어서, 이 항목은 단순 기본 리드가 아니라 실제로 앞서 나간 상태입니다."
      }),
      chips: [
        { label: localize({ "zh-Hans": "主线", "zh-Hant": "主線", en: "Lead", ja: "主線", ko: "메인" }), value: `@${focusCandidate.authorHandle || "candidate"}`, tone: "accent" },
        { label: localize({ "zh-Hans": "窗口", "zh-Hant": "窗口", en: "Lane", ja: "窓", ko: "창" }), value: focusLane.label, tone: focusLane.tone || "soft" },
        { label: localize({ "zh-Hans": "分数", "zh-Hant": "分數", en: "Score", ja: "スコア", ko: "점수" }), value: String(focusScore), tone: focusScore >= 72 ? "success" : "accent" }
      ],
      tone: "accent"
    };
  }

  const secondaryLane = getCandidateLane(secondaryCandidate);
  const secondaryScore = Math.max(0, Number(secondaryCandidate?.score) || 0);
  const secondaryAge = getCandidateAgeMinutes(secondaryCandidate);
  const secondaryMemory = Math.max(0, Number(secondaryAttribution?.priority || 0));
  const scoreGap = focusScore - secondaryScore;
  const freshnessGap = secondaryAge - focusAge;
  const laneGap = focusLane.priority - secondaryLane.priority;
  const replyGap = Math.max(0, Number(secondaryCandidate?.replies) || 0) - Math.max(0, Number(focusCandidate?.replies) || 0);
  const memoryGap = focusMemory - secondaryMemory;

  let reason = "";
  if (laneGap > 0) {
    reason = localize({
      "zh-Hans": `这条现在仍处在 ${focusLane.label} 窗口，而第二名更像 ${secondaryLane.label}。先抓这一条，不是因为别的都差，而是因为它更接近“现在就能接”的时机。`,
      "zh-Hant": `這條現在仍處在 ${focusLane.label} 窗口，而第二名更像 ${secondaryLane.label}。先抓這一條，不是因為別的都差，而是因為它更接近「現在就能接」的時機。`,
      en: `This lead is still inside the ${focusLane.label.toLowerCase()} window, while the runner-up behaves more like ${secondaryLane.label.toLowerCase()}. It goes first not because everything else is bad, but because it is closer to a truly usable moment right now.`,
      ja: `この候補はまだ ${focusLane.label} の窓にあり、二番手はむしろ ${secondaryLane.label} 寄りです。先に取る理由は、他が弱いからではなく、「今つなげる」窓に近いからです。`,
      ko: `이 후보는 아직 ${focusLane.label} 창 안에 있지만, 2위 후보는 ${secondaryLane.label} 쪽에 가깝습니다. 먼저 잡는 이유는 다른 후보가 나빠서가 아니라 지금 바로 이어붙일 수 있는 창에 더 가깝기 때문입니다.`
    });
  } else if (memoryGap >= 8) {
    reason = localize({
      "zh-Hans": `第二名并不差，但这条背后的记忆验证更强。先发这一条，相当于顺着已经被证明更容易接住的方向继续推。`,
      "zh-Hant": `第二名並不差，但這條背後的記憶驗證更強。先發這一條，相當於順著已經被證明更容易接住的方向繼續推。`,
      en: `The runner-up is not weak, but this lead carries stronger validated memory. Sending this one first means following a direction that already proved easier to pick up.`,
      ja: `二番手も弱くはありませんが、この候補のほうが記憶上の検証が強いです。先に出すのは、すでに拾われやすいと証明された方向へ寄せる判断です。`,
      ko: `2위 후보도 약하진 않지만 이 쪽은 기억 기반 검증이 더 강합니다. 먼저 보내는 건 이미 받아들여지기 쉬웠던 방향을 그대로 따르는 판단입니다.`
    });
  } else if (scoreGap >= 8) {
    reason = localize({
      "zh-Hans": `两条都能做，但这条现在的综合分明显更高。先回它，会比先去处理第二名更稳。`,
      "zh-Hant": `兩條都能做，但這條現在的綜合分明顯更高。先回它，會比先去處理第二名更穩。`,
      en: `Both candidates are workable, but this one is clearly ahead on total score right now. Taking it first is simply the steadier move.`,
      ja: `どちらも触れますが、いまはこの候補の総合スコアが明確に上です。先に取るほうが素直で安定しています。`,
      ko: `둘 다 가능하지만 지금은 이 후보의 종합 점수가 더 높습니다. 먼저 잡는 쪽이 더 안정적인 선택입니다.`
    });
  } else if (freshnessGap >= 90) {
    reason = localize({
      "zh-Hans": `两条差距不算大，但这条明显更新鲜。先抓它，是为了不让更短的窗口先过去。`,
      "zh-Hant": `兩條差距不算大，但這條明顯更新鮮。先抓它，是為了不讓更短的窗口先過去。`,
      en: `The gap is not massive, but this lead is noticeably fresher. It goes first so the shorter window does not disappear before you act.`,
      ja: `差は大きくありませんが、この候補のほうが明らかに新しいです。先に取るのは、より短い窓を先に失わないためです。`,
      ko: `격차가 아주 큰 건 아니지만 이 후보가 훨씬 더 신선합니다. 먼저 잡는 이유는 더 짧은 창을 먼저 놓치지 않기 위해서입니다.`
    });
  } else if (replyGap >= 80) {
    reason = localize({
      "zh-Hans": `第二名的讨论已经更挤了，而这条的入口还更干净。先抓这一条，会比去拥挤线程里硬插更像顺势接话。`,
      "zh-Hant": `第二名的討論已經更擠了，而這條的入口還更乾淨。先抓這一條，會比去擁擠線程裡硬插更像順勢接話。`,
      en: `The runner-up is already more crowded, while this lead still offers a cleaner entry. Taking it first feels more like joining the flow than forcing your way into a packed thread.`,
      ja: `二番手のほうはすでに混み合っていて、この候補のほうが入口がまだきれいです。先に取るほうが、詰まったスレッドへ無理に差し込むより自然です。`,
      ko: `2위 후보는 이미 더 붐비고 있고, 이 후보 쪽이 입구가 더 깨끗합니다. 먼저 잡는 편이 꽉 찬 스레드에 억지로 끼워 넣는 것보다 훨씬 자연스럽습니다.`
    });
  } else {
    reason = localize({
      "zh-Hans": `两条都可以做，但这条在窗口、分数和记忆上都略占优，所以它先成为主线。`,
      "zh-Hant": `兩條都可以做，但這條在窗口、分數和記憶上都略佔優，所以它先成為主線。`,
      en: `Both candidates are viable, but this one is slightly ahead across timing, score, and memory, so it takes the lead first.`,
      ja: `どちらも可能ですが、この候補のほうが窓・スコア・記憶の合計でわずかに上なので、先に主線になります。`,
      ko: `둘 다 가능하지만 타이밍, 점수, 기억을 합쳐 보면 이 후보가 조금 더 앞서 있어서 먼저 메인이 됩니다.`
    });
  }

  return {
    title: localize({
      "zh-Hans": "为什么这条先于第二名",
      "zh-Hant": "為什麼這條先於第二名",
      en: "Why this beats the runner-up",
      ja: "なぜ二番手より先か",
      ko: "왜 2위보다 먼저인가"
    }),
    reason,
    chips: [
      { label: localize({ "zh-Hans": "主线", "zh-Hant": "主線", en: "Lead", ja: "主線", ko: "메인" }), value: `@${focusCandidate.authorHandle || "candidate"}`, tone: "accent" },
      { label: localize({ "zh-Hans": "第二名", "zh-Hant": "第二名", en: "Runner-up", ja: "二番手", ko: "2위" }), value: `@${secondaryCandidate.authorHandle || "candidate"}`, tone: "soft" },
      { label: localize({ "zh-Hans": "分差", "zh-Hant": "分差", en: "Score gap", ja: "差分", ko: "점수 차" }), value: `${scoreGap >= 0 ? "+" : ""}${scoreGap}`, tone: scoreGap >= 8 ? "success" : scoreGap >= 0 ? "accent" : "warning" },
      { label: localize({ "zh-Hans": "窗口", "zh-Hant": "窗口", en: "Lane", ja: "窓", ko: "창" }), value: `${focusLane.label} > ${secondaryLane.label}`, tone: laneGap > 0 ? "success" : "soft" }
    ],
    tone: laneGap > 0 || scoreGap >= 8 || memoryGap >= 8 ? "accent" : "soft"
  };
}

function createAiPriorityCard(summary = {}) {
  const insight = buildAiPriorityInsight(
    summary.focusCandidate || null,
    summary.secondaryCandidate || null,
    summary.attributionSummary || null,
    summary.secondaryAttributionSummary || null
  );
  if (!insight) {
    return null;
  }

  const card = document.createElement("section");
  card.className = "aiPriorityCard";
  card.dataset.tone = insight.tone || "soft";

  const top = document.createElement("div");
  top.className = "aiPriorityTop";
  top.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "主线理由",
        "zh-Hant": "主線理由",
        en: "Lead logic",
        ja: "主線の理由",
        ko: "메인 선정 이유"
      }))}</span>
      <strong>${escapeHtml(insight.title)}</strong>
    </div>
    <span class="performanceLeadSerial">RD-AI-P01</span>
  `;

  const body = document.createElement("p");
  body.className = "aiPriorityBody";
  body.textContent = insight.reason;

  const meta = document.createElement("div");
  meta.className = "aiPriorityMeta";
  insight.chips.forEach((chip) => meta.appendChild(createDeskLedgerChip(chip.label, chip.value, chip.tone || "soft")));

  card.append(top, body, meta);
  return card;
}

function getAiPriorityRowReason(candidate, attributionSummary = null, leadCandidate = null, index = 0) {
  const lane = getCandidateLane(candidate);
  const score = Math.max(0, Number(candidate?.score) || 0);
  const replies = Math.max(0, Number(candidate?.replies) || 0);
  const memoryStrong = Number(attributionSummary?.authorEngaged || 0) > 0 || Number(attributionSummary?.pickedUp || 0) > 0;

  if (index === 0) {
    if (memoryStrong) {
      return localize({
        "zh-Hans": "主线位：窗口足够好，而且带有已验证的记忆优势。",
        "zh-Hant": "主線位：窗口夠好，而且帶有已驗證的記憶優勢。",
        en: "Lead slot: strong window plus validated memory advantage.",
        ja: "主線: 窓が良く、記憶の裏付けもあります。",
        ko: "메인: 창도 좋고 검증된 기억 우위도 있습니다."
      });
    }
    return localize({
      "zh-Hans": "主线位：它最像现在就能接进去的那条。",
      "zh-Hant": "主線位：它最像現在就能接進去的那條。",
      en: "Lead slot: this is the one most ready to join right now.",
      ja: "主線: いま最も自然に接げる候補です。",
      ko: "메인: 지금 가장 자연스럽게 이어붙일 수 있는 후보입니다."
    });
  }

  if (leadCandidate) {
    const leadLane = getCandidateLane(leadCandidate);
    if (lane.priority < leadLane.priority) {
      return localize({
        "zh-Hans": "第二顺位：能做，但窗口慢于主线。",
        "zh-Hant": "第二順位：能做，但窗口慢於主線。",
        en: "Runner-up: usable, but slower window than the lead.",
        ja: "二番手: 可能だが、主線より窓が遅い。",
        ko: "2순위: 가능하지만 메인보다 창이 느립니다."
      });
    }
    if (score < (Number(leadCandidate?.score) || 0)) {
      return localize({
        "zh-Hans": "第二顺位：条件接近，但综合分仍略低一档。",
        "zh-Hant": "第二順位：條件接近，但綜合分仍略低一檔。",
        en: "Runner-up: close overall, but still a little behind on total score.",
        ja: "二番手: 条件は近いが、総合スコアは一段下です。",
        ko: "2순위: 조건은 비슷하지만 종합 점수는 한 단계 낮습니다."
      });
    }
  }

  if (replies >= 120) {
    return localize({
      "zh-Hans": "备选位：讨论密度更高，适合先观察再接。",
      "zh-Hant": "備選位：討論密度更高，適合先觀察再接。",
      en: "Backup slot: denser thread, better to watch before jumping in.",
      ja: "控え候補: 密度が高いので、一拍置いてからが向いています。",
      ko: "백업: 스레드 밀도가 높아 먼저 지켜보는 편이 좋습니다."
    });
  }

  return localize({
    "zh-Hans": "备选位：值得保温，但优先级低于前两条。",
    "zh-Hant": "備選位：值得保溫，但優先級低於前兩條。",
    en: "Backup slot: worth keeping warm, but below the top two.",
    ja: "控え候補: 温める価値はあるが、優先度は上位二件より下です。",
    ko: "백업: 유지할 가치는 있지만 우선순위는 상위 둘보다 낮습니다."
  });
}

function getAiPriorityActionPlan(candidate, attributionSummary = null, index = 0) {
  const lane = getCandidateLane(candidate);
  const recommendedSlot = attributionSummary?.preferredSlot || getDefaultQueueSlot(candidate);
  if (index === 0 && lane.key === "now") {
    return {
      label: localize({
        "zh-Hans": "现在写",
        "zh-Hant": "現在寫",
        en: "Draft now",
        ja: "今すぐ書く",
        ko: "지금 쓰기"
      }),
      hint: localize({
        "zh-Hans": "直接切到这条开始改写",
        "zh-Hant": "直接切到這條開始改寫",
        en: "Switch into this candidate and draft immediately",
        ja: "この候補へ切り替えてすぐ書き始める",
        ko: "이 후보로 전환해 바로 초안을 씁니다"
      }),
      tone: "accent",
      slot: recommendedSlot
    };
  }
  if (recommendedSlot === "tonight") {
    return {
      label: localize({
        "zh-Hans": "今晚排",
        "zh-Hant": "今晚排",
        en: "Queue tonight",
        ja: "今夜に回す",
        ko: "오늘 밤 큐"
      }),
      hint: localize({
        "zh-Hans": "不抢当下窗口，先放进更低压的今晚档",
        "zh-Hant": "不搶當下窗口，先放進更低壓的今晚檔",
        en: "Skip the current window and place it into a calmer tonight slot",
        ja: "今の窓は追わず、圧の低い今夜枠へ置く",
        ko: "지금 창을 무리하게 잡지 않고 오늘 밤 저압 슬롯으로 보냅니다"
      }),
      tone: "warning",
      slot: recommendedSlot
    };
  }
  if (recommendedSlot === "tomorrow") {
    return {
      label: localize({
        "zh-Hans": "明早保温",
        "zh-Hant": "明早保溫",
        en: "Warm for tomorrow",
        ja: "明朝まで保温",
        ko: "내일 아침 보류"
      }),
      hint: localize({
        "zh-Hans": "保留这条，不急着插进当前节奏",
        "zh-Hant": "保留這條，不急著插進目前節奏",
        en: "Keep it warm instead of forcing it into the live rhythm",
        ja: "いま無理に差し込まず、明朝まで温めておく",
        ko: "지금 리듬에 억지로 넣지 말고 내일 아침까지 따뜻하게 보관합니다"
      }),
      tone: "soft",
      slot: recommendedSlot
    };
  }
  return {
    label: localize({
      "zh-Hans": "先切焦点",
      "zh-Hant": "先切焦點",
      en: "Focus first",
      ja: "まず見る",
      ko: "먼저 보기"
    }),
    hint: localize({
      "zh-Hans": "先切到这条，再决定是否立刻入队",
      "zh-Hant": "先切到這條，再決定是否立刻入隊",
      en: "Focus this candidate first, then decide whether it should enter the queue",
      ja: "まずこの候補へ切り替えてから、キュー投入を決める",
      ko: "먼저 이 후보로 초점을 옮기고 그다음 큐 투입 여부를 정합니다"
    }),
    tone: index === 0 ? "accent" : "soft",
    slot: recommendedSlot
  };
}

function createAiPriorityBoardCard(summary = {}) {
  const priorityCandidates = Array.isArray(summary.priorityCandidates) ? summary.priorityCandidates : [];
  const priorityAttributionSummaries = Array.isArray(summary.priorityAttributionSummaries) ? summary.priorityAttributionSummaries : [];
  if (!priorityCandidates.length) {
    return null;
  }

  const leadCandidate = priorityCandidates[0] || null;
  const card = document.createElement("section");
  card.className = "aiPriorityBoardCard";

  const top = document.createElement("div");
  top.className = "aiPriorityBoardTop";
  top.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "优先级板",
        "zh-Hant": "優先級板",
        en: "Priority board",
        ja: "優先順位ボード",
        ko: "우선순위 보드"
      }))}</span>
      <strong>${escapeHtml(localize({
        "zh-Hans": "当前前六顺位",
        "zh-Hant": "目前前六順位",
        en: "Current top six",
        ja: "現在の上位6件",
        ko: "현재 상위 6개"
      }))}</strong>
    </div>
    <span class="performanceLeadSerial">RD-AI-RANK</span>
  `;
  const note = document.createElement("p");
  note.className = "aiPriorityBoardNote";
  note.textContent = localize({
    "zh-Hans": "这块不只给你看排名。每一条都可以直接切成当前工作对象，或者按建议档位先扔进队列。",
    "zh-Hant": "這塊不只給你看排名。每一條都可以直接切成目前工作對象，或者按建議檔位先扔進隊列。",
    en: "This board is not just ranking display. Every row can become the active work target or jump straight into its suggested queue slot.",
    ja: "ここは順位を見るだけの板ではありません。各行をそのまま作業対象に切り替えるか、推奨枠へ直接送れます。",
    ko: "이 보드는 순위만 보여 주지 않습니다. 각 줄을 바로 현재 작업 대상으로 바꾸거나 추천 슬롯으로 큐잉할 수 있습니다."
  });

  const list = document.createElement("div");
  list.className = "aiPriorityBoardList";
  priorityCandidates.slice(0, PRIORITY_CANDIDATE_LIMIT).forEach((candidate, index) => {
    const attributionSummary = priorityAttributionSummaries[index] || null;
    const actionPlan = getAiPriorityActionPlan(candidate, attributionSummary, index);
    const row = document.createElement("article");
    row.className = "aiPriorityBoardRow";
    const rank = document.createElement("span");
    rank.className = "aiPriorityBoardRank";
    rank.textContent = String(index + 1).padStart(2, "0");

    const body = document.createElement("div");
    body.className = "aiPriorityBoardBody";
    const title = document.createElement("strong");
    title.textContent = candidate.authorHandle ? `@${candidate.authorHandle}` : localize({
      "zh-Hans": "候选",
      "zh-Hant": "候選",
      en: "Candidate",
      ja: "候補",
      ko: "후보"
    });
    const reason = document.createElement("p");
    reason.textContent = getAiPriorityRowReason(candidate, attributionSummary, leadCandidate, index);
    const meta = document.createElement("div");
    meta.className = "aiPriorityBoardMeta";
    meta.appendChild(createSummaryChip(getCandidateLane(candidate).label, index === 0 ? "accent" : "soft"));
    meta.appendChild(createSummaryChip(`${Number(candidate.score) || 0}`, Number(candidate.score) >= 72 ? "success" : "soft"));
    const opportunityChip = getCandidateOpportunityChip(candidate);
    if (opportunityChip) {
      meta.appendChild(createSummaryChip(opportunityChip.text, opportunityChip.tone));
    }
    const baseScoreChip = getCandidateBaseScoreChip(candidate);
    if (baseScoreChip) {
      meta.appendChild(createSummaryChip(baseScoreChip.text, baseScoreChip.tone));
    }
    meta.appendChild(createSummaryChip(actionPlan.label, actionPlan.tone || "soft"));
    if (attributionSummary?.preferredSlot) {
      meta.appendChild(createSummaryChip(getQueueSlotTexts(attributionSummary.preferredSlot).label, "warning"));
    }
    if (index === 0) {
      meta.appendChild(createSummaryChip(localize({
        "zh-Hans": "当前工作稿",
        "zh-Hant": "目前工作稿",
        en: "Active draft",
        ja: "現在の作業稿",
        ko: "현재 작업 초안"
      }), "accent"));
    }
    const actions = document.createElement("div");
    actions.className = "aiPriorityBoardActions";
    const focusButton = createDeskActionButton("focus-candidate", index === 0
      ? localize({
          "zh-Hans": "继续改这条",
          "zh-Hant": "繼續改這條",
          en: "Keep drafting",
          ja: "このまま書く",
          ko: "이걸로 계속 쓰기"
        })
      : localize({
          "zh-Hans": "切到这条",
          "zh-Hant": "切到這條",
          en: "Focus this",
          ja: "この候補へ",
          ko: "이 후보로"
        }), candidate.url || "", actionPlan.tone || "soft");
    actions.appendChild(focusButton);
    if (candidate.url) {
      const queueButton = createDeskActionButton(
        "queue-candidate",
        localize({
          "zh-Hans": `排到${getQueueSlotTexts(actionPlan.slot).label}`,
          "zh-Hant": `排到${getQueueSlotTexts(actionPlan.slot).label}`,
          en: `Queue ${getQueueSlotTexts(actionPlan.slot).label}`,
          ja: `${getQueueSlotTexts(actionPlan.slot).label}へ入れる`,
          ko: `${getQueueSlotTexts(actionPlan.slot).label} 큐`
        }),
        JSON.stringify({ url: candidate.url, slot: actionPlan.slot }),
        index === 0 ? "primary" : "soft"
      );
      actions.appendChild(queueButton);
    }
    const actionHint = document.createElement("div");
    actionHint.className = "aiPriorityBoardHint";
    actionHint.textContent = actionPlan.hint;
    body.append(title, reason, meta);
    body.append(actions, actionHint);
    row.append(rank, body);
    list.appendChild(row);
  });

  card.append(top, note, list);
  return card;
}

function getDraftHookLabel(draft) {
  switch (draft?.key) {
    case "memory":
      return localize({
        "zh-Hans": "起手：沿验证记忆接",
        "zh-Hant": "起手：沿驗證記憶接",
        en: "Hook: continue validated memory",
        ja: "起点: 実績記憶を継ぐ",
        ko: "훅: 검증된 기억 잇기"
      });
    case "question":
      return localize({
        "zh-Hans": "起手：先追问",
        "zh-Hant": "起手：先追問",
        en: "Hook: lead with a question",
        ja: "起点: まず問いかけ",
        ko: "훅: 질문으로 시작"
      });
    case "bridge":
      return localize({
        "zh-Hans": "起手：先补一层",
        "zh-Hant": "起手：先補一層",
        en: "Hook: add one more layer",
        ja: "起点: もう一層足す",
        ko: "훅: 한 층 더 보태기"
      });
    case "contrast":
      return localize({
        "zh-Hans": "起手：轻反差",
        "zh-Hant": "起手：輕反差",
        en: "Hook: slight contrast",
        ja: "起点: 軽い対比",
        ko: "훅: 가벼운 반전"
      });
    case "perspective":
    default:
      return localize({
        "zh-Hans": "起手：先给观点",
        "zh-Hant": "起手：先給觀點",
        en: "Hook: start with a point",
        ja: "起点: 先に見方を出す",
        ko: "훅: 관점부터 제시"
      });
  }
}

function createAiCopilotCard(summary = {}) {
  const focusCandidate = summary.focusCandidate || null;
  const attributionSummary = summary.attributionSummary || null;
  const drafts = Array.isArray(summary.drafts) ? summary.drafts : [];
  const recommendedSlot = summary.recommendedSlot || "";
  const laneLabel = focusCandidate ? getCandidateLane(focusCandidate).label : "";
  const highlightLine = Array.isArray(focusCandidate?.highlights) && focusCandidate.highlights.length
    ? focusCandidate.highlights.slice(0, 2).join(localize({
      "zh-Hans": " · ",
      "zh-Hant": " · ",
      en: " · ",
      ja: " ・ ",
      ko: " · "
    }))
    : "";
  const topicLine = Array.isArray(focusCandidate?.matchedTopics) && focusCandidate.matchedTopics.length
    ? getTopicLabel(focusCandidate.matchedTopics[0])
    : "";

  const card = document.createElement("section");
  card.className = "aiCopilotCard";

  const header = document.createElement("div");
  header.className = "aiCopilotHeader";
  header.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "当前 copilot",
        "zh-Hant": "目前 copilot",
        en: "Current copilot",
        ja: "現在の copilot",
        ko: "현재 copilot"
      }))}</span>
      <strong>${escapeHtml(focusCandidate
        ? localize({
            "zh-Hans": "这条候选已经可直接出稿",
            "zh-Hant": "這條候選已經可直接出稿",
            en: "This candidate is ready for live drafting",
            ja: "この候補はもう草稿化できます",
            ko: "이 후보는 바로 초안으로 전환할 수 있습니다"
          })
        : localize({
            "zh-Hans": "等待下一条值得交给 AI 的候选",
            "zh-Hant": "等待下一條值得交給 AI 的候選",
            en: "Waiting for the next AI-worthy candidate",
            ja: "次に AI へ渡す候補を待っています",
            ko: "다음 AI 대상 후보를 기다리는 중입니다"
          }))}</strong>
    </div>
    <span class="performanceLeadSerial">RD-AI-CP</span>
  `;

  const body = document.createElement("p");
  body.className = "aiCopilotBody";
  body.textContent = focusCandidate
    ? localize({
        "zh-Hans": `${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "这条候选"} 现在已经可以直接生成 ${drafts.length || 3} 个可改写草稿。先从 ${laneLabel} 节奏切入，再结合${attributionSummary ? "记忆验证" : "当前帖子线索"}来调整语气和落点，比只看 roadmap 更接近真实产品。`,
        "zh-Hant": `${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "這條候選"} 現在已經可以直接生成 ${drafts.length || 3} 個可改寫草稿。先從 ${laneLabel} 節奏切入，再結合${attributionSummary ? "記憶驗證" : "目前貼文線索"}來調整語氣和落點，比只看 roadmap 更接近真實產品。`,
        en: `${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "This candidate"} can now produce ${drafts.length || 3} editable drafts directly. Starting from the ${laneLabel.toLowerCase()} rhythm, then shaping tone with ${attributionSummary ? "validated memory" : "live thread signals"}, is much closer to a real product than another roadmap card.`,
        ja: `${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "この候補"} はもう ${drafts.length || 3} 本の編集可能な草稿を直接出せます。${laneLabel} のリズムから入り、${attributionSummary ? "検証済み記憶" : "現在の文脈"}で語気を調整する方が、ロードマップを増やすより実用品です。`,
        ko: `${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "이 후보"} 는 이제 ${drafts.length || 3}개의 편집 가능한 초안을 바로 만들 수 있습니다. ${laneLabel} 리듬에서 시작하고 ${attributionSummary ? "검증된 기억" : "현재 스레드 단서"}로 톤을 다듬는 편이 로드맵 카드 하나 더 두는 것보다 훨씬 실제 제품에 가깝습니다.`
      })
    : localize({
        "zh-Hans": "AI 回复层已经从纯占位变成真实入口。等下一条候选出现后，这里会直接接管草稿生成与改写。",
        "zh-Hant": "AI 回覆層已經從純佔位變成真實入口。等下一條候選出現後，這裡會直接接管草稿生成與改寫。",
        en: "The AI reply layer is no longer placeholder-only. As soon as the next candidate appears, this panel will take over draft generation and rewriting.",
        ja: "AI 返信層はもう占位だけではありません。次の候補が来たら、ここで草稿生成と書き換えを直接受け持ちます。",
        ko: "AI 답글 레이어는 이제 자리표시자만이 아닙니다. 다음 후보가 나타나면 여기서 초안 생성과 리라이트를 바로 맡습니다."
      });

  const strip = document.createElement("div");
  strip.className = "performanceLeadStrip aiCopilotStrip";
  if (focusCandidate) {
    strip.append(
      createDeskLedgerChip(localize({
        "zh-Hans": "对象",
        "zh-Hant": "對象",
        en: "Target",
        ja: "対象",
        ko: "대상"
      }), `@${focusCandidate.authorHandle || "candidate"}`, "accent"),
      createDeskLedgerChip(localize({
        "zh-Hans": "建议排期",
        "zh-Hant": "建議排期",
        en: "Slot",
        ja: "推奨排期",
        ko: "추천 배치"
      }), recommendedSlot ? getQueueSlotTexts(recommendedSlot).label : localize({
        "zh-Hans": "待判断",
        "zh-Hant": "待判斷",
        en: "Decide",
        ja: "判断待ち",
        ko: "판단 필요"
      }), "warning"),
      createDeskLedgerChip(localize({
        "zh-Hans": "草稿数",
        "zh-Hant": "草稿數",
        en: "Drafts",
        ja: "草稿数",
        ko: "초안 수"
      }), String(drafts.length || 0), drafts.length ? "success" : "soft")
    );
  } else {
    strip.append(
      createDeskLedgerChip(localize({
        "zh-Hans": "状态",
        "zh-Hant": "狀態",
        en: "State",
        ja: "状態",
        ko: "상태"
      }), localize({
        "zh-Hans": "等待候选",
        "zh-Hant": "等待候選",
        en: "Waiting",
        ja: "候補待ち",
        ko: "후보 대기"
      }), "soft"),
      createDeskLedgerChip(localize({
        "zh-Hans": "草稿层",
        "zh-Hant": "草稿層",
        en: "Draft layer",
        ja: "草稿層",
        ko: "초안 레이어"
      }), localize({
        "zh-Hans": "已就位",
        "zh-Hant": "已就位",
        en: "Ready",
        ja: "準備完了",
        ko: "준비됨"
      }), "accent"),
      createDeskLedgerChip(localize({
        "zh-Hans": "下一步",
        "zh-Hant": "下一步",
        en: "Next",
        ja: "次",
        ko: "다음"
      }), localize({
        "zh-Hans": "等候选",
        "zh-Hant": "等候選",
        en: "Wait for lead",
        ja: "候補待ち",
        ko: "후보 대기"
      }), "warning")
    );
  }

  const meta = document.createElement("div");
  meta.className = "aiCopilotMeta";
  if (focusCandidate && highlightLine) {
    meta.appendChild(createSummaryChip(highlightLine, "soft"));
  }
  if (focusCandidate && topicLine) {
    meta.appendChild(createSummaryChip(topicLine, "soft"));
  }
  if (focusCandidate && laneLabel) {
    meta.appendChild(createSummaryChip(laneLabel, "accent"));
  }
  if (focusCandidate) {
    const opportunityChip = getCandidateOpportunityChip(focusCandidate);
    if (opportunityChip) {
      meta.appendChild(createSummaryChip(opportunityChip.text, opportunityChip.tone));
    }
    const baseScoreChip = getCandidateBaseScoreChip(focusCandidate);
    if (baseScoreChip) {
      meta.appendChild(createSummaryChip(baseScoreChip.text, baseScoreChip.tone));
    }
  }
  if (attributionSummary) {
    meta.appendChild(createSummaryChip(getAiAttributionKindLabel(attributionSummary), attributionSummary.authorEngaged ? "success" : "warning"));
    meta.appendChild(createSummaryChip(localize({
      "zh-Hans": `已复查 ${attributionSummary.reviewed || 0}`,
      "zh-Hant": `已複查 ${attributionSummary.reviewed || 0}`,
      en: `Reviewed ${attributionSummary.reviewed || 0}`,
      ja: `再確認 ${attributionSummary.reviewed || 0}`,
      ko: `재확인 ${attributionSummary.reviewed || 0}`
    }), "soft"));
  }

  if (drafts.length) {
    const angleStrip = document.createElement("div");
    angleStrip.className = "aiStageStrip";
    drafts.forEach((draft) => angleStrip.appendChild(createSummaryChip(draft.angle, draft.tone || "soft")));
    card.append(header, body, strip, meta, angleStrip);
    return card;
  }

  card.append(header, body, strip, meta);
  return card;
}

function hasAgentVisualMediaKind(mediaKind = "") {
  return ["image", "photo", "video", "gif", "mixed"].includes(String(mediaKind || "").trim().toLowerCase());
}

function buildAgentReplySchemaPayload() {
  return {
    version: "replydrop-agent-reply-v1",
    decisionEnum: ["reply-now", "queue-next", "queue-tonight", "queue-tomorrow", "skip"],
    fields: {
      targetTweetId: "string",
      decision: "enum",
      replyText: "string",
      rationaleShort: "string",
      confidence: "number",
      riskFlags: "string[]"
    }
  };
}

function mapAgentSlotToDecision(slot = "") {
  const normalized = String(slot || "").trim();
  if (normalized === "next") {
    return "reply-now";
  }
  if (normalized === "tonight") {
    return "queue-tonight";
  }
  if (normalized === "tomorrow") {
    return "queue-tomorrow";
  }
  return "skip";
}

function getAgentDecisionLabel(decision = "") {
  switch (String(decision || "").trim()) {
    case "reply-now":
      return localize({
        "zh-Hans": "现在发",
        "zh-Hant": "現在發",
        en: "Reply now",
        ja: "今返す",
        ko: "지금 답글"
      });
    case "queue-next":
      return localize({
        "zh-Hans": "下一轮",
        "zh-Hant": "下一輪",
        en: "Queue next",
        ja: "次へ入れる",
        ko: "다음 차례"
      });
    case "queue-tonight":
      return localize({
        "zh-Hans": "排今晚",
        "zh-Hant": "排今晚",
        en: "Queue tonight",
        ja: "今夜へ回す",
        ko: "오늘 밤으로"
      });
    case "queue-tomorrow":
      return localize({
        "zh-Hans": "排明早",
        "zh-Hant": "排明早",
        en: "Queue tomorrow",
        ja: "明朝へ回す",
        ko: "내일 아침으로"
      });
    default:
      return localize({
        "zh-Hans": "先跳过",
        "zh-Hant": "先跳過",
        en: "Skip for now",
        ja: "いったん見送る",
        ko: "일단 건너뛰기"
      });
  }
}

function simplifyAgentRoutePlan(route = {}) {
  return {
    key: String(route.key || "").trim(),
    draftKey: String(route.draftKey || "").trim(),
    voiceKey: String(route.voiceKey || "").trim(),
    tone: String(route.tone || "").trim(),
    score: Number(route.score || 0),
    sentenceTarget: Number(route.sentenceTarget || 0),
    preferQuestionClose: Boolean(route.preferQuestionClose),
    reasons: Array.isArray(route.reasons) ? route.reasons.slice(0, 5).map((reason) => String(reason || "").trim()).filter(Boolean) : []
  };
}

function getAgentTweetIdFromUrl(url) {
  const normalized = normalizeDeskUrl(url);
  const match = normalized.match(/\/status\/(\d+)(?:$|[/?#])/);
  return match?.[1] || "";
}

function buildPopupAgentCandidateContext(candidate, attributionSummary = null) {
  if (!candidate?.url) {
    return null;
  }

  const normalizedUrl = normalizeDeskUrl(candidate.url);
  const tweetId = getAgentTweetIdFromUrl(normalizedUrl);
  const lane = getCandidateLane(candidate);
  const recommendedSlot = getDefaultQueueSlot(candidate);
  const recommendedDecision = mapAgentSlotToDecision(recommendedSlot);
  const highlights = getUserFacingCandidateHighlights(candidate, 3);
  const mediaKind = String(candidate.mediaKind || "").trim();
  const draftPlans = typeof DraftCore?.buildDraftPlan === "function"
    ? DraftCore.buildDraftPlan(candidate, attributionSummary, { laneKey: lane.key })
    : [];
  const routePlans = typeof DraftCore?.buildDraftRoutePlan === "function"
    ? DraftCore.buildDraftRoutePlan(candidate, attributionSummary, {
        laneKey: lane.key,
        preferredSlot: recommendedSlot,
        availableDraftKeys: draftPlans.map((plan) => String(plan?.key || "").trim()).filter(Boolean)
      })
    : [];

  return {
    version: "replydrop-candidate-context-v1",
    source: "candidate",
    tweetId,
    url: normalizedUrl,
    author: {
      handle: String(candidate.authorHandle || "").trim(),
      name: String(candidate.authorName || "").trim(),
      verified: Boolean(candidate.authorVerified),
      verificationType: normalizeAuthorVerificationType(candidate.authorVerificationType),
      relationshipStatus: String(candidate.relationshipStatus || "").trim()
    },
    post: {
      text: String(candidate.text || "").trim().slice(0, 560),
      mediaKind,
      sourceSurface: String(candidate.sourceSurface || "").trim(),
      ageMinutes: Math.max(0, Math.round((Date.now() - Number(candidate.timestamp || Date.now())) / 60000)),
      views: Number(candidate.views || 0),
      replies: Number(candidate.replies || 0),
      likes: Number(candidate.likes || 0),
      matchedTopics: Array.isArray(candidate.matchedTopics) ? candidate.matchedTopics.slice(0, 4) : [],
      matchedLanguages: Array.isArray(candidate.matchedLanguages) ? candidate.matchedLanguages.slice(0, 4) : [],
      highlights
    },
    scoring: {
      score: Number(candidate.score || 0),
      baseScore: Number(candidate.baseScore || candidate.score || 0),
      opportunityBoost: Number(candidate.opportunityBoost || 0),
      postScore: Number(candidate.postScore || candidate.score || 0),
      reachLikelihood: Number(candidate.reachLikelihood || 0),
      understandingConfidence: Number(candidate.understandingConfidence || 0),
      authorFit: Number(candidate.authorFit || 0),
      finalScore: Number(candidate.finalScore || candidate.score || 0),
      blockReason: String(candidate.blockReason || "").trim(),
      lowSemanticConfidence: Boolean(candidate.lowSemanticConfidence)
    },
    routing: {
      laneKey: lane.key,
      laneLabel: lane.label,
      recommendedSlot,
      recommendedDecision
    },
    memory: {
      kind: String(attributionSummary?.kind || "").trim(),
      priority: Number(attributionSummary?.priority || 0),
      preferredSlot: String(attributionSummary?.preferredSlot || "").trim(),
      reviewed: Number(attributionSummary?.reviewed || 0),
      settled: Number(attributionSummary?.settled || 0),
      pickedUp: Number(attributionSummary?.pickedUp || 0),
      authorEngaged: Number(attributionSummary?.authorEngaged || 0)
    },
    media: {
      needsVision: hasAgentVisualMediaKind(mediaKind) && Boolean(candidate.lowSemanticConfidence || String(candidate.text || "").trim().length < 32),
      available: hasAgentVisualMediaKind(mediaKind),
      bundleIncluded: false
    },
    aiHints: {
      draftKeys: draftPlans.map((plan) => String(plan?.key || "").trim()).filter(Boolean),
      routePlans: routePlans.map((route) => simplifyAgentRoutePlan(route))
    }
  };
}

function buildPopupAgentInboxPayload(priorityCandidates = [], attributionSummaries = []) {
  const candidates = [];
  const contextByUrl = new Map();

  priorityCandidates.forEach((candidate, index) => {
    const context = buildPopupAgentCandidateContext(candidate, attributionSummaries[index] || null);
    if (!context) {
      return;
    }
    candidates.push(context);
    contextByUrl.set(normalizeDeskUrl(context.url), context);
  });

  return {
    payload: {
      version: "replydrop-agent-inbox-v1",
      generatedAt: Date.now(),
      limit: candidates.length,
      candidates,
      outputSchema: buildAgentReplySchemaPayload()
    },
    contextByUrl
  };
}

function buildPopupDraftTargetsPayload(priorityCandidates = [], attributionSummaries = []) {
  const inbox = buildPopupAgentInboxPayload(priorityCandidates, attributionSummaries);
  return {
    version: "replydrop-draft-targets-v1",
    generatedAt: Date.now(),
    mode: "human-draft",
    instruction: "请按 candidates 顺序为用户生成正式可用回复草稿；同语种回复；不要固定模板；不要自动发送；风险或语义不足就建议跳过。",
    candidates: inbox.payload.candidates.map((context) => ({
      ...context,
      version: "replydrop-draft-target-v1",
      mode: "human-draft"
    })),
    outputSchema: {
      version: "replydrop-draft-targets-v1",
      output: {
        targetTweetId: "string",
        authorHandle: "string",
        replyText: "string",
        language: "same-as-post",
        confidence: "number",
        riskFlags: "string[]"
      }
    }
  };
}

function createAgentRuntimeSummaryCard(summary = {}) {
  const focusCandidate = summary.focusCandidate || null;
  const focusContext = summary.focusContext || null;
  const priorityCount = Number(summary.priorityCount || 0);
  const queueCount = Number(summary.queueCount || 0);
  const relationshipCount = Number(summary.relationshipCount || 0);
  const decisionLabel = focusContext ? getAgentDecisionLabel(focusContext.routing?.recommendedDecision) : "";
  const slotLabel = focusContext?.routing?.recommendedSlot ? getQueueSlotTexts(focusContext.routing.recommendedSlot).label : "";

  const card = document.createElement("section");
  card.className = "aiCopilotCard";

  const header = document.createElement("div");
  header.className = "aiCopilotHeader";
  header.innerHTML = `
    <div>
      <span class="performanceLeadEyebrow">${escapeHtml(localize({
        "zh-Hans": "AI runtime",
        "zh-Hant": "AI runtime",
        en: "AI runtime",
        ja: "AI runtime",
        ko: "AI runtime"
      }))}</span>
      <strong>${escapeHtml(focusCandidate
        ? localize({
            "zh-Hans": `当前主推 ${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "这条候选"}`,
            "zh-Hant": `目前主推 ${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "這條候選"}`,
            en: `Current lead: ${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "this candidate"}`,
            ja: `現在の主推し: ${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "この候補"}`,
            ko: `현재 리드: ${focusCandidate.authorHandle ? `@${focusCandidate.authorHandle}` : "이 후보"}`
          })
        : localize({
            "zh-Hans": "等待下一条可执行候选",
            "zh-Hant": "等待下一條可執行候選",
            en: "Waiting for the next actionable candidate",
            ja: "次の実行候補を待っています",
            ko: "다음 실행 후보를 기다리는 중입니다"
          }))}</strong>
    </div>
    <span class="performanceLeadSerial">RD-AI-RUN</span>
  `;

  const body = document.createElement("p");
  body.className = "aiCopilotBody";
  body.textContent = focusContext
    ? localize({
        "zh-Hans": `人工模式把 top ${priorityCount || 1} 高分帖交给外部 agent 写正式草稿；AI 执行模式才继续开框发送。当前建议动作：${decisionLabel}${slotLabel ? ` · ${slotLabel}` : ""}。`,
        "zh-Hant": `人工模式把 top ${priorityCount || 1} 高分帖交給外部 agent 寫正式草稿；AI 執行模式才繼續開框發送。目前建議動作：${decisionLabel}${slotLabel ? ` · ${slotLabel}` : ""}。`,
        en: `Human mode hands the top ${priorityCount || 1} posts to an external agent for finished drafts; AI runtime mode is the one that opens and submits. Suggested move: ${decisionLabel}${slotLabel ? ` · ${slotLabel}` : ""}.`,
        ja: `人手モードは top ${priorityCount || 1} 件を外部 agent に渡して完成稿を作ります。返信欄を開いて送信するのは AI 実行モードだけです。推奨動作: ${decisionLabel}${slotLabel ? ` · ${slotLabel}` : ""}。`,
        ko: `사람 모드는 top ${priorityCount || 1}개를 외부 agent에 넘겨 완성 초안을 만들고, AI 실행 모드만 열고 제출합니다. 추천 동작: ${decisionLabel}${slotLabel ? ` · ${slotLabel}` : ""}.`
      })
    : localize({
        "zh-Hans": "当前还没有高分候选。这里有候选后，可以复制写稿目标给 Codex / Claude，也可以走 AI 自动执行。",
        "zh-Hant": "目前還沒有高分候選。這裡有候選後，可以複製寫稿目標給 Codex / Claude，也可以走 AI 自動執行。",
        en: "No high-score candidate yet. Once ready, copy draft targets for Codex / Claude or use the AI runtime path.",
        ja: "まだ高スコア候補はありません。候補が出たら Codex / Claude へ草稿対象を渡すか、AI 実行ルートを使えます。",
        ko: "아직 고점 후보가 없습니다. 후보가 잡히면 Codex / Claude용 초안 대상을 복사하거나 AI 실행 경로를 사용할 수 있습니다."
      });

  const strip = document.createElement("div");
  strip.className = "performanceLeadStrip aiCopilotStrip";
  strip.append(
    createDeskLedgerChip(localize({
      "zh-Hans": "Top shortlist",
      "zh-Hant": "Top shortlist",
      en: "Top shortlist",
      ja: "Top shortlist",
      ko: "Top shortlist"
    }), String(priorityCount), priorityCount ? "accent" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "推荐动作",
      "zh-Hant": "推薦動作",
      en: "Move",
      ja: "推奨動作",
      ko: "추천 동작"
    }), decisionLabel || localize({
      "zh-Hans": "等待候选",
      "zh-Hant": "等待候選",
      en: "Waiting",
      ja: "候補待ち",
      ko: "후보 대기"
    }), focusContext ? "success" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "队列中",
      "zh-Hant": "隊列中",
      en: "Queued",
      ja: "キュー中",
      ko: "큐 중"
    }), String(queueCount), queueCount ? "warning" : "soft"),
    createDeskLedgerChip(localize({
      "zh-Hans": "关系线索",
      "zh-Hant": "關係線索",
      en: "Memory",
      ja: "関係線索",
      ko: "관계 신호"
    }), String(relationshipCount), relationshipCount ? "accent" : "soft")
  );

  const meta = document.createElement("div");
  meta.className = "aiCopilotMeta";
  (focusContext?.post?.highlights || []).slice(0, 2).forEach((highlight) => {
    meta.appendChild(createSummaryChip(highlight, "soft"));
  });
  if (focusContext?.routing?.laneLabel) {
    meta.appendChild(createSummaryChip(focusContext.routing.laneLabel, "accent"));
  }
  if (focusContext?.memory?.kind) {
    meta.appendChild(createSummaryChip(getAiAttributionKindLabel(summary.attributionSummary || {}), focusContext.memory.authorEngaged ? "success" : "warning"));
  }
  if (focusContext?.media?.needsVision) {
    meta.appendChild(createSummaryChip(localize({
      "zh-Hans": "需要视觉判断",
      "zh-Hant": "需要視覺判斷",
      en: "Needs vision",
      ja: "視覚確認あり",
      ko: "비전 확인 필요"
    }), "warning"));
  }

  const actions = document.createElement("div");
  actions.className = "deskActionRow";
  if (focusCandidate?.url) {
    actions.append(
      createDeskActionButton("copy-draft-targets", localize({
        "zh-Hans": "复制写稿目标",
        "zh-Hant": "複製寫稿目標",
        en: "Copy draft targets",
        ja: "草稿対象をコピー",
        ko: "초안 대상 복사"
      }), "", "accent"),
      createDeskActionButton("copy-agent-context", localize({
        "zh-Hans": "复制当前上下文",
        "zh-Hant": "複製目前上下文",
        en: "Copy context",
        ja: "文脈をコピー",
        ko: "컨텍스트 복사"
      }), focusCandidate.url, "primary"),
      createDeskActionButton("copy-agent-inbox", localize({
        "zh-Hans": "复制 Top6 收件箱",
        "zh-Hant": "複製 Top6 收件箱",
        en: "Copy top 6 inbox",
        ja: "Top 6 inbox をコピー",
        ko: "Top 6 inbox 복사"
      }), "", "accent"),
      createDeskActionButton("copy-agent-schema", localize({
        "zh-Hans": "复制输出 Schema",
        "zh-Hant": "複製輸出 Schema",
        en: "Copy schema",
        ja: "Schema をコピー",
        ko: "Schema 복사"
      }), "", "soft"),
      createDeskActionButton("open-agent-composer", localize({
        "zh-Hans": "打开回复框",
        "zh-Hant": "打開回覆框",
        en: "Open composer",
        ja: "返信欄を開く",
        ko: "답글창 열기"
      }), focusCandidate.url, "warning")
    );
  } else {
    actions.append(
      createDeskActionButton("copy-agent-schema", localize({
        "zh-Hans": "复制输出 Schema",
        "zh-Hant": "複製輸出 Schema",
        en: "Copy schema",
        ja: "Schema をコピー",
        ko: "Schema 복사"
      }), "", "soft")
    );
  }

  card.append(header, body, strip, meta, actions);
  return card;
}

function appendAgentCandidateActions(item, candidate) {
  const main = item.querySelector(".deskMain");
  if (!main || !candidate?.url) {
    return;
  }

  const extraRow = document.createElement("div");
  extraRow.className = "deskActionRow";
  extraRow.append(
    createDeskActionButton("copy-agent-context", localize({
      "zh-Hans": "复制上下文",
      "zh-Hant": "複製上下文",
      en: "Copy context",
      ja: "文脈をコピー",
      ko: "컨텍스트 복사"
    }), candidate.url, "primary"),
    createDeskActionButton("open-agent-composer", localize({
      "zh-Hans": "打开回复框",
      "zh-Hant": "打開回覆框",
      en: "Open composer",
      ja: "返信欄を開く",
      ko: "답글창 열기"
    }), candidate.url, "soft")
  );
  main.appendChild(extraRow);
}

function renderAiReplyDeskPanel(summary = {}) {
  if (!els.aiReplyDeskPanel) {
    return;
  }

  const priorityCandidates = Array.isArray(summary.priorityCandidates) ? summary.priorityCandidates.slice(0, PRIORITY_CANDIDATE_LIMIT) : [];
  const attributionSummaries = Array.isArray(summary.priorityAttributionSummaries) ? summary.priorityAttributionSummaries : [];
  const focusCandidate = summary.focusCandidate || null;
  const focusContext = focusCandidate ? buildPopupAgentCandidateContext(focusCandidate, summary.attributionSummary || null) : null;
  const inboxBundle = buildPopupAgentInboxPayload(priorityCandidates, attributionSummaries);

  uiState.lastAgentSchemaPayload = buildAgentReplySchemaPayload();
  uiState.lastAgentFocusContext = focusContext;
  uiState.lastAgentInboxPayload = inboxBundle.payload;
  uiState.lastDraftTargetsPayload = buildPopupDraftTargetsPayload(priorityCandidates, attributionSummaries);
  uiState.agentContextByUrl = inboxBundle.contextByUrl;

  els.aiReplyDeskPanel.innerHTML = "";
  if (!priorityCandidates.length) {
    const empty = document.createElement("div");
    empty.className = "draftDeskEmpty";
    empty.innerHTML = `<strong>${escapeHtml(localize({
      "zh-Hans": "这里现在分成人工写稿和 AI 执行",
      "zh-Hant": "這裡現在分成人工寫稿和 AI 執行",
      en: "This panel now separates human drafts and AI runtime",
      ja: "ここは人手草稿と AI 実行に分かれました",
      ko: "이 패널은 사람 초안과 AI 실행으로 나뉩니다"
    }))}</strong><p>${escapeHtml(localize({
      "zh-Hans": "有 shortlist 后，人工模式复制写稿目标；AI 模式继续使用上下文包、schema 和开框动作。",
      "zh-Hant": "有 shortlist 後，人工模式複製寫稿目標；AI 模式繼續使用上下文包、schema 和開框動作。",
      en: "Once a shortlist appears, human mode copies draft targets; AI mode keeps context packs, schema, and composer actions.",
      ja: "shortlist が出たら、人手モードは草稿対象をコピーし、AI モードは文脈パック・schema・返信欄操作を使います。",
      ko: "shortlist가 잡히면 사람 모드는 초안 대상을 복사하고, AI 모드는 컨텍스트 팩, schema, 답글창 동작을 계속 사용합니다."
    }))}</p>`;
    els.aiReplyDeskPanel.appendChild(empty);
    return;
  }

  els.aiReplyDeskPanel.appendChild(createAgentRuntimeSummaryCard({
    ...summary,
    focusContext,
    priorityCount: priorityCandidates.length
  }));

  priorityCandidates.forEach((candidate, index) => {
    const item = buildDeskCandidateItem(candidate, index, {
      isFocusedChoice: normalizeDeskUrl(candidate?.url) === normalizeDeskUrl(focusCandidate?.url)
    });
    appendAgentCandidateActions(item, candidate);
    els.aiReplyDeskPanel.appendChild(item);
  });
}

function renderDeskPanel() {
  if (!els.deskBoostSummary || !els.scoreGuideGrid || !els.scoreGuideNotes || !els.candidateDeskList || !els.replyFeedbackList || !els.deskFocusCard || !els.draftDeskPanel || !els.growthPulseGrid || !els.relationshipDeskList || !els.focusDigestSummary) {
    return;
  }
  const t = getTexts();
  const { enabledLanguages, enabledTopics } = summarizeActiveBoosts();
  const dismissedCount = getDismissedCount();
  const rawVisibleCandidates = getVisibleDeskCandidates();
  const queueItems = getReplyQueueItems();
  const publishWatchItems = getPublishWatchItems();
  const pickupItems = getPickupWatchItems();
  const now = Date.now();
  const archiveEntries = getReplyArchiveEntries(currentState);
  const todayReplyEntries = getTodayReplyArchiveEntries(currentState, now);
  const replyArchivePage = getReplyArchivePageEntries(todayReplyEntries, uiState.replyArchivePage, REPLY_ARCHIVE_PAGE_SIZE);
  uiState.replyArchivePage = replyArchivePage.page;
  const performanceSnapshot = buildReplyPerformanceSnapshot(todayReplyEntries);
  uiState.attributionSignalModel = typeof AttributionCore?.buildAttributionSignalModel === "function"
    ? AttributionCore.buildAttributionSignalModel(archiveEntries, queueItems, rawVisibleCandidates, { now })
    : null;
  const visibleCandidates = sortDeskCandidates(rawVisibleCandidates, uiState.attributionSignalModel);
  const actionableCandidates = sortDeskCandidates(getActionableDeskCandidates(visibleCandidates), uiState.attributionSignalModel);
  const candidates = actionableCandidates.length ? actionableCandidates : visibleCandidates;
  const queueSummary = buildDeskQueueSummary(visibleCandidates, dismissedCount);
  const focusCandidate = resolveFocusCandidate(candidates);
  const hotCandidates = actionableCandidates.filter((candidate) => getCandidateLane(candidate).key === 'now').length;
  const repliesToday = Number(currentState.todayReplyCount || todayReplyEntries.length || 0);
  const relationships = buildRelationshipItems(visibleCandidates, archiveEntries);
  const focusAttributionSummary = focusCandidate && typeof AttributionCore?.summarizeCandidateAttribution === "function"
    ? AttributionCore.summarizeCandidateAttribution(focusCandidate, uiState.attributionSignalModel)
    : null;
  const secondaryCandidate = candidates.find((candidate) => candidate.url !== focusCandidate?.url) || null;
  const secondaryAttributionSummary = secondaryCandidate && typeof AttributionCore?.summarizeCandidateAttribution === "function"
    ? AttributionCore.summarizeCandidateAttribution(secondaryCandidate, uiState.attributionSignalModel)
    : null;
  const priorityCandidates = candidates.slice(0, PRIORITY_CANDIDATE_LIMIT);
  const priorityAttributionSummaries = priorityCandidates.map((candidate) => (
    candidate && typeof AttributionCore?.summarizeCandidateAttribution === "function"
      ? AttributionCore.summarizeCandidateAttribution(candidate, uiState.attributionSignalModel)
      : null
  ));
  const drafts = buildDraftSuggestions(focusCandidate, focusAttributionSummary);
  const growthSnapshot = typeof GrowthCore?.buildGrowthSnapshot === "function"
    ? GrowthCore.buildGrowthSnapshot({
        now,
        queueItems,
        publishWatchItems,
        pickupItems,
        repliesToday,
        visibleCandidates: visibleCandidates.length,
        actionableCandidates: actionableCandidates.length
      })
    : null;
  const queueCounts = growthSnapshot?.queueCounts || getQueueLifecycleCounts(queueItems);
  const pickupCounts = growthSnapshot?.pickupCounts || getPickupLifecycleCounts(pickupItems);
  const reviewCounts = growthSnapshot?.reviewCounts || getPickupReviewCounts(pickupItems, now);
  const growthLift = Math.max(0, Math.round(
    actionableCandidates.slice(0, PRIORITY_CANDIDATE_LIMIT).reduce((sum, candidate) => sum + (Number(candidate.score) || 0), 0) * 0.42 +
    repliesToday * 12 +
    queueCounts.live * 8 +
    queueCounts.shipped * 16
  ));
  const topPerformanceItems = buildTopReplyPerformanceItems(todayReplyEntries);
  setDeskSubTabCount(els.deskSubTabFocusCount, visibleCandidates.length);
  setDeskSubTabCount(els.deskSubTabDraftCount, drafts.length);
  setDeskSubTabCount(els.deskSubTabGrowthCount, performanceSnapshot.replies);
  setDeskSubTabCount(els.deskSubTabAiCount, priorityCandidates.length);
  setDeskSubTabCount(els.deskSubTabQueueCount, queueCounts.live);
  setDeskSubTabCount(els.deskSubTabContactsCount, relationships.length);
  setDeskSubTabCount(els.deskSubTabFeedbackCount, todayReplyEntries.length);
  renderDashboardLaunchPreview(visibleCandidates.length, performanceSnapshot);

  const focusDigestItems = typeof FocusCore?.buildFocusDigestItems === "function"
    ? FocusCore.buildFocusDigestItems({
        focusCandidate,
        candidateCount: visibleCandidates.length,
        queueCount: queueCounts.live,
        reviewDueCount: reviewCounts.due,
        hotCount: hotCandidates,
        dismissedCount
      })
    : [];
  els.focusDigestSummary.innerHTML = '';
  focusDigestItems.forEach((item) => {
    let label = "";
    let value = item.value;
    switch (item.key) {
      case "lead":
        label = localize({
          "zh-Hans": "主线",
          "zh-Hant": "主線",
          en: "Lead",
          ja: "主線",
          ko: "메인"
        });
        value = item.value || localize({
          "zh-Hans": "等待候选",
          "zh-Hant": "等待候選",
          en: "Waiting",
          ja: "候補待ち",
          ko: "후보 대기"
        });
        break;
      case "candidates":
        label = localize({
          "zh-Hans": "候选",
          "zh-Hant": "候選",
          en: "Candidates",
          ja: "候補",
          ko: "후보"
        });
        break;
      case "queue":
        label = localize({
          "zh-Hans": "队列",
          "zh-Hant": "隊列",
          en: "Queue",
          ja: "キュー",
          ko: "큐"
        });
        break;
      case "pickupDue":
        label = localize({
          "zh-Hans": "待复查",
          "zh-Hant": "待複查",
          en: "Pickup due",
          ja: "再確認",
          ko: "재확인"
        });
        break;
      case "hotWindow":
        label = localize({
          "zh-Hans": "即刻窗口",
          "zh-Hant": "即刻窗口",
          en: "Now window",
          ja: "今の窓",
          ko: "지금 창"
        });
        break;
      case "dismissed":
        label = t.queueSkippedLabel;
        break;
      default:
        return;
    }
    els.focusDigestSummary.appendChild(createDeskLedgerChip(label, String(value), item.tone || item.emptyTone || 'soft'));
  });

  els.deskBoostSummary.innerHTML = '';
  els.deskBoostSummary.appendChild(createDeskLedgerChip(t.scoreGuideLanguage, String(enabledLanguages.length), 'accent'));
  els.deskBoostSummary.appendChild(createDeskLedgerChip(t.scoreGuideTopic, String(enabledTopics.length), 'success'));
  if (enabledTopics.length) {
    const topicLine = enabledTopics
      .slice(0, 2)
      .map((topic) => localize(topic.toggle).replace(/\s*\+\d+\s*$/, ''))
      .join(' · ');
    els.deskBoostSummary.appendChild(createDeskLedgerChip(localize({
      "zh-Hans": "当前主题",
      "zh-Hant": "目前主題",
      en: "Active topics",
      ja: "現在のトピック",
      ko: "현재 주제"
    }), topicLine, 'soft'));
  }
  if (enabledTopics.length > 2) {
    els.deskBoostSummary.appendChild(createDeskLedgerChip(localize({
      "zh-Hans": "更多主题",
      "zh-Hant": "更多主題",
      en: "More topics",
      ja: "他のトピック",
      ko: "추가 주제"
    }), `+${enabledTopics.length - 2}`, 'warning'));
  }
  if (dismissedCount) {
    els.deskBoostSummary.appendChild(createDeskLedgerChip(t.queueSkippedLabel, String(dismissedCount), 'warning'));
  }
  const snoozedCount = Object.values(currentState.relationshipStates || {}).filter((detail) => detail?.status === "snoozed" && Number(detail?.snoozeUntil || 0) > Date.now()).length;
  if (snoozedCount) {
    els.deskBoostSummary.appendChild(createDeskLedgerChip(localize({
      "zh-Hans": "稍后队列",
      "zh-Hant": "稍後隊列",
      en: "Snoozed",
      ja: "あとで",
      ko: "나중에"
    }), String(snoozedCount), "warning"));
  }

  els.scoreGuideGrid.innerHTML = '';
  [
    [t.scoreGuideMomentum, '62', 'accent'],
    [t.scoreGuideTiming, '32', 'success'],
    [t.scoreGuideMedia, '6-10', 'accent'],
    [t.scoreGuideTopic, '+5~+10', 'success'],
    [t.scoreGuideCrowding, '-8~-56', 'warning']
  ].forEach(([label, value, tone]) => {
    els.scoreGuideGrid.appendChild(createDeskLedgerChip(label, value, tone));
  });
  els.scoreGuideNotes.innerHTML = '';
  [
    t.scoreGuideGuide1,
    localize({
      "zh-Hans": "高分现在会更偏向：发出约 1 小时内、已经起量、还在加速、但回复区还没挤死的帖子。",
      "zh-Hant": "高分現在會更偏向：發出約 1 小時內、已經起量、還在加速、但回覆區還沒擠死的貼文。",
      en: "High scores now lean harder toward posts that are about an hour old, already moving, still accelerating, and not fully crowded yet.",
      ja: "高スコアは、投稿から約1時間以内で、すでに動き始めていて、まだ加速中、かつ返信欄が詰まり切っていない投稿へより強く寄ります。",
      ko: "고득점은 이제 게시 후 약 1시간 안이고, 이미 반응이 붙었으며, 아직 가속 중이고, 답글칸이 완전히 막히지 않은 글에 더 강하게 쏠립니다."
    }),
    localize({
      "zh-Hans": "AI 回复也会更偏向给新观点或补一层，而不是“好棒啊”式附和。",
      "zh-Hant": "AI 回覆也會更偏向給新觀點或補一層，而不是「好棒啊」式附和。",
      en: "AI reply routing now leans more toward adding a real take or one missing layer, not generic agreement.",
      ja: "AI返信も、ただ同意するより新しい見方や不足している一層を足す方向へ寄せています。",
      ko: "AI 답글도 이제 뻔한 맞장구보다 새 관점이나 빠진 한 층을 보태는 쪽으로 더 기웁니다."
    }),
    t.scoreGuideGuide2
  ].forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    els.scoreGuideNotes.appendChild(p);
  });

  setText(els.deskFocusMeta, queueSummary);
  setText(els.candidateDeskMeta, queueSummary);
  const feedbackPagerText = replyArchivePage.pageCount > 1
    ? localize({
        "zh-Hans": ` · 第 ${replyArchivePage.page + 1}/${replyArchivePage.pageCount} 页`,
        "zh-Hant": ` · 第 ${replyArchivePage.page + 1}/${replyArchivePage.pageCount} 頁`,
        en: ` · Page ${replyArchivePage.page + 1}/${replyArchivePage.pageCount}`,
        ja: ` · ${replyArchivePage.page + 1}/${replyArchivePage.pageCount} ページ`,
        ko: ` · ${replyArchivePage.page + 1}/${replyArchivePage.pageCount}페이지`
      })
    : "";
  setText(els.replyFeedbackMeta,
    publishWatchItems.length
      ? `${localize({"zh-Hans": "待确认", "zh-Hant": "待確認", en: "Awaiting confirm", ja: "確認待ち", ko: "확인 대기"})} ${publishWatchItems.length} · ${localize({"zh-Hans": "待复查", "zh-Hant": "待複查", en: "Pickup due", ja: "要再確認", ko: "재확인"})} ${reviewCounts.due} · ${todayReplyEntries.length ? `${t.todayRepliedLabel} ${todayReplyEntries.length}` : t.noReplies}${feedbackPagerText}`
      : (todayReplyEntries.length
        ? `${t.todayRepliedLabel} ${todayReplyEntries.length}${reviewCounts.due ? ` · ${localize({"zh-Hans": "待复查", "zh-Hant": "待複查", en: "Pickup due", ja: "要再確認", ko: "재확인"})} ${reviewCounts.due}` : ""}${feedbackPagerText}`
        : t.noReplies)
  );
  setText(els.relationshipDeskMeta, getRelationshipMetaText(relationships.length));
  if (els.restoreDismissedButton instanceof HTMLButtonElement) {
    els.restoreDismissedButton.disabled = dismissedCount === 0;
    els.restoreDismissedButton.textContent = dismissedCount > 0
      ? `${t.restoreDismissedLabel} (${dismissedCount})`
      : t.restoreDismissedLabel;
  }

  els.deskFocusCard.innerHTML = '';
  if (!candidates.length) {
    els.deskFocusCard.appendChild(buildDeskFocusEmptyState());
  } else {
    els.deskFocusCard.appendChild(buildDeskCandidateItem(focusCandidate, 0, { focus: true, isFocusedChoice: true }));
  }

  els.draftDeskPanel.innerHTML = '';
  if (!drafts.length) {
    const empty = document.createElement('div');
    empty.className = 'draftDeskEmpty';
    empty.innerHTML = `<strong>${escapeHtml(t.draftEmptyTitle)}</strong><p>${escapeHtml(t.draftEmptyText)}</p>`;
    els.draftDeskPanel.appendChild(empty);
  } else {
    const recommendedDraftSlot = focusCandidate ? getDefaultQueueSlot(focusCandidate) : "";
    els.draftDeskPanel.appendChild(createDraftWorkbench(drafts, focusCandidate, recommendedDraftSlot, focusAttributionSummary));
    drafts.forEach((draft, index) => els.draftDeskPanel.appendChild(createDraftCard(draft, index, index === uiState.selectedDraftIndex)));
  }

  renderQueueDesk(queueItems, focusCandidate, publishWatchItems);
  renderAiReplyDeskPanel({
    queueCount: queueCounts.live,
    relationshipCount: relationships.length,
    focusCandidate,
    secondaryCandidate,
    priorityCandidates,
    attributionSummary: focusAttributionSummary,
    secondaryAttributionSummary,
    priorityAttributionSummaries,
    performanceSnapshot,
    drafts,
    recommendedSlot: focusCandidate ? getDefaultQueueSlot(focusCandidate) : ""
  });

  els.growthPulseGrid.innerHTML = '';
  if (!todayReplyEntries.length) {
    const empty = document.createElement("div");
    empty.className = "draftDeskEmpty";
    empty.innerHTML = `<strong>${escapeHtml(localize({
      "zh-Hans": "还没有可展示的回复表现",
      "zh-Hant": "還沒有可展示的回覆表現",
      en: "No reply performance yet",
      ja: "まだ表示できる返信実績はありません",
      ko: "아직 보여 줄 답글 성과가 없습니다"
    }))}</strong><p>${escapeHtml(localize({
      "zh-Hans": "这里以后只看你发出去后的曝光、点赞和回复增量。先去 X 里实际回复几条，再回来复查。",
      "zh-Hant": "這裡以後只看你發出去後的曝光、按讚與回覆增量。先去 X 裡實際回覆幾條，再回來複查。",
      en: "This panel now focuses on shipped reply performance only. Send a few replies on X first, then come back for view and engagement lift.",
      ja: "この面板は送信後の返信実績だけを見ます。まず X で数件返してから戻ってきてください。",
      ko: "이 패널은 발송 후 답글 성과만 봅니다. 먼저 X에서 몇 개 답글을 보낸 뒤 돌아오세요."
      }))}</p>`;
    els.growthPulseGrid.appendChild(empty);
  } else {
    els.growthPulseGrid.appendChild(createPerformanceLeadCard(topPerformanceItems[0] || null, performanceSnapshot));
    const growthMetricsGrid = document.createElement("div");
    growthMetricsGrid.className = "growthMetricsGrid";
    [
      {
        label: localize({ "zh-Hans": "已发出", "zh-Hant": "已發出", en: "Shipped", ja: "送信済み", ko: "발송 완료" }),
        value: performanceSnapshot.replies,
        tone: "accent",
        meta: localize({ "zh-Hans": "已执行动作", "zh-Hant": "已執行动作", en: "Sent replies", ja: "送信済み返信", ko: "보낸 답글" })
      },
      {
        label: localize({ "zh-Hans": "回复曝光", "zh-Hant": "回覆曝光", en: "Reply views", ja: "返信表示", ko: "답글 조회" }),
        value: formatCompactCount(performanceSnapshot.totalReplyViews),
        tone: performanceSnapshot.totalReplyViews ? "accent" : "soft",
        meta: localize({ "zh-Hans": "回复自身当前累计浏览", "zh-Hant": "回覆自身目前累積瀏覽", en: "Current views on the reply itself", ja: "返信自体の現在表示数", ko: "답글 자체 현재 조회" })
      },
      {
        label: localize({ "zh-Hans": "回复点赞", "zh-Hant": "回覆點讚", en: "Reply likes", ja: "返信いいね", ko: "답글 좋아요" }),
        value: formatCompactCount(performanceSnapshot.totalReplyLikes),
        tone: performanceSnapshot.totalReplyLikes ? "warning" : "soft",
        meta: localize({ "zh-Hans": "回复自身累计点赞", "zh-Hant": "回覆自身累積按讚", en: "Likes accumulated on the reply", ja: "返信自体の累積いいね", ko: "답글 자체 누적 좋아요" })
      },
      {
        label: localize({ "zh-Hans": "回复回帖", "zh-Hant": "回覆回帖", en: "Reply replies", ja: "返信への返信", ko: "답글 받은 답글" }),
        value: formatCompactCount(performanceSnapshot.totalReplyReplies),
        tone: performanceSnapshot.totalReplyReplies ? "success" : "soft",
        meta: localize({ "zh-Hans": "别人直接回你这条 reply 的数量", "zh-Hant": "別人直接回你這條 reply 的數量", en: "Replies posted directly to your reply", ja: "自分の返信に付いた返信数", ko: "내 답글에 직접 달린 답글 수" })
      },
      {
        label: localize({ "zh-Hans": "线程观测曝光", "zh-Hant": "線程觀測曝光", en: "Thread views", ja: "スレッド観測表示", ko: "스레드 관측 조회" }),
        value: formatCompactCount(performanceSnapshot.totalTargetViews),
        tone: performanceSnapshot.totalTargetViews ? "soft" : "soft",
        meta: localize({ "zh-Hans": "回原帖时看到的线程浏览量", "zh-Hant": "回原貼時看到的線程瀏覽量", en: "Observed thread views when revisiting the target", ja: "元投稿に戻った時点で見えた表示数", ko: "원문 재방문 시점의 관측 조회" })
      },
      {
        label: localize({ "zh-Hans": "线程点赞增量", "zh-Hant": "線程點讚增量", en: "Thread like lift", ja: "スレッドいいね増分", ko: "스레드 좋아요 증가" }),
        value: formatCompactCount(performanceSnapshot.totalTargetDeltaLikes),
        tone: performanceSnapshot.totalTargetDeltaLikes ? "warning" : "soft",
        meta: localize({ "zh-Hans": "相对发出时基线新增", "zh-Hant": "相對發出時基線新增", en: "Increase versus the thread baseline", ja: "送信時点の基準からの増分", ko: "발송 시점 기준 대비 증가" })
      },
      {
        label: localize({ "zh-Hans": "线程回复增量", "zh-Hant": "線程回覆增量", en: "Thread reply lift", ja: "スレッド返信増分", ko: "스레드 답글 증가" }),
        value: formatCompactCount(performanceSnapshot.totalTargetDeltaReplies),
        tone: performanceSnapshot.totalTargetDeltaReplies ? "success" : "soft",
        meta: localize({ "zh-Hans": "原帖线程后续继续长出来多少", "zh-Hant": "原貼線程後續繼續長出來多少", en: "How much the target thread kept growing", ja: "元投稿スレッドがその後どれだけ伸びたか", ko: "원문 스레드가 이후 얼마나 더 자랐는지" })
      }
    ].forEach((metric) => {
      growthMetricsGrid.appendChild(createGrowthMetricCard(metric.label, String(metric.value), metric.tone, metric.meta));
    });

    const truthStrip = document.createElement("div");
    truthStrip.className = "deskBoostSummary growthTruthStrip";
    [
      createDeskLedgerChip(localize({ "zh-Hans": "回复已查", "zh-Hant": "回覆已查", en: "Reply checked", ja: "返信自体確認", ko: "답글 자체 확인" }), String(performanceSnapshot.replyChecked), performanceSnapshot.replyChecked ? "accent" : "soft"),
      createDeskLedgerChip(localize({ "zh-Hans": "线程已查", "zh-Hant": "線程已查", en: "Thread checked", ja: "スレッド確認", ko: "스레드 확인" }), String(performanceSnapshot.checked), performanceSnapshot.checked ? "soft" : "soft"),
      createDeskLedgerChip(localize({ "zh-Hans": "被接住", "zh-Hant": "被接住", en: "Picked up", ja: "反応あり", ko: "반응 있음" }), String(performanceSnapshot.pickedUp), performanceSnapshot.pickedUp ? "success" : "soft"),
      createDeskLedgerChip(localize({ "zh-Hans": "作者回流", "zh-Hant": "作者回流", en: "Author back", ja: "作者が戻る", ko: "작성자 재등장" }), String(performanceSnapshot.authorBack), performanceSnapshot.authorBack ? "success" : "soft")
    ].forEach((chip) => truthStrip.appendChild(chip));

    const growthActionList = document.createElement("div");
    growthActionList.className = "growthActionList";
    topPerformanceItems.forEach(({ entry, status }, index) => {
      growthActionList.appendChild(createGrowthActionCard({
        title: entry.authorHandle ? `@${entry.authorHandle}` : localize({
          "zh-Hans": "这条回复",
          "zh-Hant": "這條回覆",
          en: "This reply",
          ja: "この返信",
          ko: "이 답글"
        }),
        reason: [
          getReplyObservedSummary(entry) ? localize({
            "zh-Hans": `回复自曝 ${getReplyObservedSummary(entry)}`,
            "zh-Hant": `回覆自曝 ${getReplyObservedSummary(entry)}`,
            en: `Reply-side ${getReplyObservedSummary(entry)}`,
            ja: `返信自体 ${getReplyObservedSummary(entry)}`,
            ko: `답글 자체 ${getReplyObservedSummary(entry)}`
          }) : "",
          getPickupDeltaSummary(entry) ? localize({
            "zh-Hans": `线程观测 ${getPickupDeltaSummary(entry)}`,
            "zh-Hant": `線程觀測 ${getPickupDeltaSummary(entry)}`,
            en: `Thread-side ${getPickupDeltaSummary(entry)}`,
            ja: `スレッド側 ${getPickupDeltaSummary(entry)}`,
            ko: `스레드 쪽 ${getPickupDeltaSummary(entry)}`
          }) : ""
        ].filter(Boolean).join(" · ") || localize({
          "zh-Hans": "这条已经开始形成可见反馈，值得继续观察。",
          "zh-Hant": "這條已開始形成可見回饋，值得繼續觀察。",
          en: "This reply is starting to show visible traction.",
          ja: "この返信は反応が見え始めています。",
          ko: "이 답글은 실제 반응이 보이기 시작했습니다."
        }),
        meta: [
          entry.replyObservedViews ? `${formatCompactCount(entry.replyObservedViews)} ${localize({"zh-Hans":"回复曝光","zh-Hant":"回覆曝光",en:"reply views",ja:"返信表示",ko:"답글 조회"})}` : "",
          entry.pickupViews ? `${formatCompactCount(entry.pickupViews)} ${localize({"zh-Hans":"线程浏览","zh-Hant":"線程瀏覽",en:"thread views",ja:"スレッド表示",ko:"스레드 조회"})}` : "",
          getPickupStatusLabel(status),
          getPickupCheckMetaText({ shippedAt: entry.timestamp, lastCheckedAt: entry.pickupCheckedAt }, now)
        ].filter(Boolean).join(" · "),
        action: "open-post",
        url: entry.url,
        tone: status === "author-engaged" ? "success" : (status === "picked-up" ? "accent" : "soft")
      }, index));
    });

    els.growthPulseGrid.append(growthMetricsGrid, truthStrip, growthActionList);
  }

  els.relationshipDeskList.innerHTML = '';
  if (!relationships.length) {
    const empty = document.createElement('p');
    empty.className = 'emptyState';
    empty.textContent = t.relationshipEmpty;
    els.relationshipDeskList.appendChild(empty);
  } else {
    relationships.forEach((item, index) => els.relationshipDeskList.appendChild(buildRelationshipCard(item, index)));
  }

  els.candidateDeskList.innerHTML = '';
  if (!visibleCandidates.length) {
    const empty = document.createElement('p');
    empty.className = 'emptyState';
    empty.textContent = t.noCandidates;
    els.candidateDeskList.appendChild(empty);
  } else {
    const previewCandidates = typeof FocusCore?.buildCandidatePreviewItems === "function"
      ? FocusCore.buildCandidatePreviewItems(visibleCandidates, focusCandidate, { limit: CANDIDATE_PREVIEW_LIMIT })
      : visibleCandidates
          .filter((candidate) => candidate.url !== focusCandidate?.url)
          .slice(0, CANDIDATE_PREVIEW_LIMIT);
    if (!previewCandidates.length) {
      const empty = document.createElement('p');
      empty.className = 'emptyState';
      empty.textContent = localize({
        "zh-Hans": "当前只有这一条主线候选，新的备选出现后会显示在这里。",
        "zh-Hant": "目前只有這一條主線候選，新的備選出現後會顯示在這裡。",
        en: "Only the current lead candidate exists right now. More backup options will appear here when they arrive.",
        ja: "いまはこの主線候補だけです。次の候補が来るとここに表示されます。",
        ko: "지금은 이 메인 후보만 있습니다. 다른 후보가 생기면 여기에 나타납니다."
      });
      els.candidateDeskList.appendChild(empty);
    } else {
      previewCandidates.forEach((candidate, index) => {
        els.candidateDeskList.appendChild(buildDeskCandidateItem(candidate, index, {
          isFocusedChoice: candidate.url === focusCandidate?.url
        }));
      });
    }
  }

  els.replyFeedbackList.innerHTML = '';
  if (!todayReplyEntries.length) {
    const empty = document.createElement('p');
    empty.className = 'emptyState';
    empty.textContent = t.noReplies;
    els.replyFeedbackList.appendChild(empty);
  } else {
    replyArchivePage.items.forEach((entry, index) => {
      els.replyFeedbackList.appendChild(createReplyArchiveCard(entry, replyArchivePage.page * replyArchivePage.pageSize + index));
    });
    if (replyArchivePage.pageCount > 1) {
      const pager = document.createElement("div");
      pager.className = "replyFeedbackPager";
      const prevButton = createDeskActionButton("reply-archive-prev", localize({
        "zh-Hans": "上一页",
        "zh-Hant": "上一頁",
        en: "Prev",
        ja: "前へ",
        ko: "이전"
      }), "", "soft");
      prevButton.disabled = replyArchivePage.page <= 0;
      const nextButton = createDeskActionButton("reply-archive-next", localize({
        "zh-Hans": "下一页",
        "zh-Hant": "下一頁",
        en: "Next",
        ja: "次へ",
        ko: "다음"
      }), "", "soft");
      nextButton.disabled = replyArchivePage.page >= replyArchivePage.pageCount - 1;
      const meta = document.createElement("p");
      meta.className = "replyFeedbackPagerMeta";
      meta.textContent = localize({
        "zh-Hans": `今天共 ${replyArchivePage.total} 条，当前第 ${replyArchivePage.page + 1}/${replyArchivePage.pageCount} 页`,
        "zh-Hant": `今天共 ${replyArchivePage.total} 條，目前第 ${replyArchivePage.page + 1}/${replyArchivePage.pageCount} 頁`,
        en: `${replyArchivePage.total} replies today · page ${replyArchivePage.page + 1}/${replyArchivePage.pageCount}`,
        ja: `今日 ${replyArchivePage.total} 件 · ${replyArchivePage.page + 1}/${replyArchivePage.pageCount} ページ`,
        ko: `오늘 ${replyArchivePage.total}개 · ${replyArchivePage.page + 1}/${replyArchivePage.pageCount}페이지`
      });
      pager.append(prevButton, meta, nextButton);
      els.replyFeedbackList.appendChild(pager);
    }
  }
}

function createCheckRow(key, checked, text) {
  const label = document.createElement("label");
  label.className = "checkRow";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.key = key;
  input.checked = Boolean(checked);
  const span = document.createElement("span");
  span.textContent = text;
  label.appendChild(input);
  label.appendChild(span);
  return label;
}

function createFoldSection(summaryText, rows) {
  const details = document.createElement("details");
  details.className = "foldDetails";
  const summary = document.createElement("summary");
  summary.className = "foldSummary";
  summary.textContent = summaryText;
  const wrap = document.createElement("div");
  wrap.className = "foldBody";
  rows.forEach((row) => wrap.appendChild(row));
  details.appendChild(summary);
  details.appendChild(wrap);
  return details;
}

function createStatePill(enabled, text) {
  const span = document.createElement("span");
  span.className = "groupStatePill";
  span.dataset.state = enabled ? "on" : "off";
  span.textContent = text;
  return span;
}

function captureOpenFolds() {
  uiState.openFoldKeys = new Set(
    Array.from(document.querySelectorAll("details[data-fold-key][open]"))
      .map((node) => node.dataset.foldKey)
      .filter(Boolean)
  );
}

function restoreOpenFolds() {
  document.querySelectorAll("details[data-fold-key]").forEach((node) => {
    node.open = uiState.openFoldKeys.has(node.dataset.foldKey);
  });
}

function renderSignalSections() {
  if (!els.languageBoostGrid || !els.topicBoostGrid) {
    return;
  }
  const t = getTexts();

  const primaryLanguageRows = [];
  const extraLanguageRows = [];
  LANGUAGE_BOOSTS.forEach((language) => {
    const row = createCheckRow(language.key, currentState[language.key], localize(language.label));
    (PRIMARY_LANGUAGE_KEYS.has(language.key) ? primaryLanguageRows : extraLanguageRows).push(row);
  });

  els.languageBoostGrid.innerHTML = "";
  primaryLanguageRows.forEach((row) => els.languageBoostGrid.appendChild(row));
  if (extraLanguageRows.length) {
    const fold = createFoldSection(t.moreLanguages, extraLanguageRows);
    fold.dataset.foldKey = "languages-more";
    els.languageBoostGrid.appendChild(fold);
  }

  const primaryTopicRows = [];
  const extraTopicRows = [];
  TOPIC_GROUPS.forEach((group) => {
    const row = createCheckRow(group.enabledKey, currentState[group.enabledKey], localize(group.toggle));
    (PRIMARY_TOPIC_KEYS.has(group.key) ? primaryTopicRows : extraTopicRows).push(row);
  });

  els.topicBoostGrid.innerHTML = "";
  primaryTopicRows.forEach((row) => els.topicBoostGrid.appendChild(row));
  if (extraTopicRows.length) {
    const fold = createFoldSection(t.moreTopics, extraTopicRows);
    fold.dataset.foldKey = "topics-more";
    els.topicBoostGrid.appendChild(fold);
  }
}

function splitGroupKeywords(group) {
  const values = uniqueList(currentState[group.keywordsKey] || []);
  return {
    presetSelected: group.defaults.filter((keyword) => values.includes(keyword)),
    customKeywords: values.filter((keyword) => !group.defaults.includes(keyword))
  };
}

function renderKeywordSections() {
  if (!els.keywordSections) {
    return;
  }
  const t = getTexts();
  els.keywordSections.innerHTML = "";

  const orderedGroups = TOPIC_GROUPS
    .map((group, index) => ({ group, index, enabled: Boolean(currentState[group.enabledKey]) }))
    .sort((a, b) => Number(b.enabled) - Number(a.enabled) || a.index - b.index);

  let lastEnabled = null;

  orderedGroups.forEach(({ group, enabled }, index) => {
    if (enabled !== lastEnabled) {
      const divider = document.createElement("div");
      divider.className = "sectionDivider";
      divider.textContent = enabled ? t.enabledSection : t.disabledSection;
      els.keywordSections.appendChild(divider);
      lastEnabled = enabled;
    }

    const { presetSelected, customKeywords } = splitGroupKeywords(group);
    const selectedSet = new Set(presetSelected);

    const section = document.createElement(index < 6 ? "section" : "details");
    section.className = "ticketSection group keywordSection";
    section.classList.toggle("keywordSectionDisabled", !enabled);
    section.dataset.group = group.key;
    if (section.tagName === "DETAILS") {
      section.classList.add("keywordFold");
      section.dataset.foldKey = `keyword-${group.key}`;
      const summary = document.createElement("summary");
      summary.className = "foldSummary";
      summary.textContent = `${localize(group.title)} · ${enabled ? t.groupOn : t.groupOff}`;
      section.appendChild(summary);
    }

    const body = document.createElement("div");
    body.className = section.tagName === "DETAILS" ? "foldBody" : "";

    const head = document.createElement("div");
    head.className = "groupHead";
    const title = document.createElement("h2");
    title.textContent = localize(group.title);
    head.appendChild(title);
    head.appendChild(createStatePill(enabled, enabled ? t.groupOn : t.groupOff));

    const miniLabel = document.createElement("p");
    miniLabel.className = "miniLabel";
    miniLabel.textContent = t.presetKeywordsLabel;

    const chipGrid = document.createElement("div");
    chipGrid.className = "chipGrid";
    chipGrid.dataset.group = group.key;

    group.defaults.forEach((keyword) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chipButton";
      button.dataset.group = group.key;
      button.dataset.keyword = keyword;
      button.textContent = keyword;
      button.classList.toggle("active", selectedSet.has(keyword) && enabled);
      button.classList.toggle("standby", selectedSet.has(keyword) && !enabled);
      chipGrid.appendChild(button);
    });

    const fieldLabel = document.createElement("label");
    fieldLabel.className = "fieldLabel";
    fieldLabel.htmlFor = `${group.key}-custom-keywords`;
    fieldLabel.textContent = t.customKeywordsLabel;

    const textarea = document.createElement("textarea");
    textarea.id = `${group.key}-custom-keywords`;
    textarea.rows = 3;
    textarea.dataset.group = group.key;
    textarea.placeholder = t.customHint;
    textarea.value = customKeywords.join(", ");

    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = t.customHint;

    body.appendChild(head);
    if (!enabled) {
      const standbyHint = document.createElement("p");
      standbyHint.className = "standbyHint";
      standbyHint.textContent = t.standbyHint;
      body.appendChild(standbyHint);
    }
    body.appendChild(miniLabel);
    body.appendChild(chipGrid);
    body.appendChild(fieldLabel);
    body.appendChild(textarea);
    body.appendChild(hint);
    section.appendChild(body);
    els.keywordSections.appendChild(section);
  });
}

function render(state) {
  captureOpenFolds();
  currentState = normalizeState(state);
  uiState.lastSyncedAt = Date.now();
  renderTexts();
  renderLocaleButtons();
  renderStats();
  renderDeskPanel();
  renderSignalSections();
  renderKeywordSections();
  applyViewSheetState();
  applyTabState();
  restoreOpenFolds();
}

async function refreshCurrentPageStatus() {
  if (isPreviewMode()) {
    uiState.pageStatus = "x";
    uiState.entryStatus = currentState.enabled ? "ready" : "hidden";
    renderControlDeck();
    return;
  }

  if (!chrome?.tabs?.query) {
    uiState.pageStatus = "unknown";
    uiState.entryStatus = "checking";
    renderControlDeck();
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = String(tab?.url || tab?.pendingUrl || "").trim();
    uiState.pageStatus = /^https:\/\/(x|twitter)\.com\//.test(url) ? "x" : url ? "off" : "unknown";
    if (uiState.pageStatus === "x" && tab?.id) {
      const response = await sendTabMessage(tab.id, { type: "X_REPLY_SCORER_PAGE_STATUS" });
      const status = response?.status || {};
      if (status.panelOpen) {
        uiState.entryStatus = "open";
      } else if (status.widgetVisible) {
        uiState.entryStatus = "ready";
      } else if (status.widgetReady || status.panelReady) {
        uiState.entryStatus = "hidden";
      } else {
        uiState.entryStatus = "unavailable";
      }
    } else {
      uiState.entryStatus = "checking";
    }
  } catch {
    uiState.pageStatus = "unknown";
    uiState.entryStatus = "checking";
  }

  renderControlDeck();
}

async function refreshPopupState() {
  render(await loadState());
  await refreshCurrentPageStatus();
}

async function openXTab() {
  if (!chrome?.tabs?.query || !chrome?.tabs?.create || !chrome?.tabs?.update) {
    return;
  }

  const existingTabs = await chrome.tabs.query({
    currentWindow: true,
    url: ["https://x.com/*", "https://twitter.com/*"]
  });

  if (existingTabs[0]?.id) {
    await chrome.tabs.update(existingTabs[0].id, { active: true });
    return;
  }

  await chrome.tabs.create({ url: "https://x.com/home" });
}

async function openInPagePanel() {
  if (!chrome?.tabs?.query) {
    return false;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = String(tab?.url || tab?.pendingUrl || "").trim();
  if (!/^https:\/\/(x|twitter)\.com\//.test(url) || !tab?.id) {
    return false;
  }

  const response = await sendTabMessage(tab.id, { type: "X_REPLY_SCORER_OPEN_PANEL" });
  const status = response?.status || {};
  if (status.panelOpen) {
    uiState.pageStatus = "x";
    uiState.entryStatus = "open";
    renderControlDeck();
    return true;
  }
  return false;
}

async function syncState(patch) {
  captureOpenFolds();
  const response = await sendMessage({ type: "X_REPLY_SCORER_UPDATE_STATE", patch });
  if (response?.state) {
    render(response.state);
    return;
  }
  setStatusTextValue(getTexts().statusError);
}

function resetStatusText() {
  setStatusTextValue(currentState.enabled ? getTexts().statusOn : getTexts().statusOff);
}

function flashStatus(text) {
  if (!els.statusText && !els.statusTextMirrors.length) {
    return;
  }
  clearTimeout(uiState.flashTimer);
  setStatusTextValue(text);
  uiState.flashTimer = globalThis.setTimeout(() => {
    resetStatusText();
  }, 2200);
}

function normalizeReplyHandoffReasonCode(response = {}) {
  const explicit = String(response?.reasonCode || "").trim();
  if (explicit) {
    return explicit;
  }

  switch (String(response?.reason || "").trim()) {
    case "already-replied":
      return "already-replied";
    case "score-below-agent-send-floor":
    case "value-below-send-floor":
      return "value-below-send-floor";
    case "score-degraded-below-average":
    case "value-dropped-on-open":
      return "value-dropped-on-open";
    case "article-url-conflict":
    case "tweet-id-conflict":
    case "thread-identity-conflict":
      return "thread-identity-conflict";
    case "send-failed":
    case "outcome-unverified":
      return "send-not-verified";
    default:
      return "context-not-locked";
  }
}

function getReplyHandoffReasonLabel(response = {}) {
  switch (normalizeReplyHandoffReasonCode(response)) {
    case "already-replied":
      return localize({
        "zh-Hans": "已回复过",
        "zh-Hant": "已回覆過",
        en: "Already replied",
        ja: "すでに返信済み",
        ko: "이미 답글을 보냈습니다"
      });
    case "thread-identity-conflict":
      return localize({
        "zh-Hans": "主帖识别冲突",
        "zh-Hant": "主貼識別衝突",
        en: "Main post identity conflict",
        ja: "主投稿の識別が衝突しました",
        ko: "원문 식별이 충돌했습니다"
      });
    case "send-not-verified":
      return localize({
        "zh-Hans": "发送后未验证到",
        "zh-Hant": "送出後未驗證到",
        en: "Send outcome was not verified",
        ja: "送信結果を確認できませんでした",
        ko: "발송 결과를 확인하지 못했습니다"
      });
    case "value-dropped-on-open":
      return localize({
        "zh-Hans": "打开后价值已下降",
        "zh-Hant": "打開後價值已下降",
        en: "Value dropped after opening the post",
        ja: "投稿を開いた後に価値が下がりました",
        ko: "게시물을 연 뒤 가치가 낮아졌습니다"
      });
    case "value-below-send-floor":
      return localize({
        "zh-Hans": "低于自动发送线",
        "zh-Hant": "低於自動發送線",
        en: "Below auto-send floor",
        ja: "自動送信ライン未満",
        ko: "자동 발송 기준 미달"
      });
    default:
      return String(response?.reasonLabel || "").trim() || localize({
        "zh-Hans": "上下文未锁定",
        "zh-Hant": "上下文未鎖定",
        en: "Context not locked yet",
        ja: "コンテキストがまだ固定されていません",
        ko: "컨텍스트가 아직 잠기지 않았습니다"
      });
  }
}

function formatReplyHandoffStatus(response = {}, fallbackText = "") {
  const label = getReplyHandoffReasonLabel(response);
  const retryCount = Math.max(0, Math.floor(Number(response?.retryCount) || 0));
  const retryText = retryCount
    ? localize({
        "zh-Hans": `已自动重试 ${retryCount} 次`,
        "zh-Hant": `已自動重試 ${retryCount} 次`,
        en: `Auto-retried ${retryCount} time(s)`,
        ja: `${retryCount} 回自動リトライ済み`,
        ko: `${retryCount}회 자동 재시도함`
      })
    : "";
  return [label, retryText].filter(Boolean).join(" · ") || fallbackText;
}

function isTerminalReplyHandoffFailure(response = {}) {
  const reasonCode = normalizeReplyHandoffReasonCode(response);
  return reasonCode === "already-replied" || reasonCode === "thread-identity-conflict" || reasonCode === "send-not-verified" || reasonCode === "value-dropped-on-open" || reasonCode === "value-below-send-floor";
}

async function openUrl(url) {
  if (!url) {
    return;
  }
  if (chrome?.tabs?.create) {
    await chrome.tabs.create({ url });
    return;
  }
  globalThis.open(url, "_blank", "noopener,noreferrer");
}

async function copyTextToClipboard(text) {
  const value = String(text || "").trim();
  if (!value) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback.
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function normalizeDeskUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url, "https://x.com");
    const parts = parsed.pathname.split("/").filter(Boolean);
    const statusIndex = parts.indexOf("status");
    if (statusIndex > 0 && parts[statusIndex + 1]) {
      return `https://x.com/${parts[statusIndex - 1]}/status/${parts[statusIndex + 1]}`;
    }
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return String(url).trim();
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

async function focusTabWindow(tab) {
  if (!tab?.id || !chrome?.tabs?.update) {
    return null;
  }
  if (chrome?.windows?.update && tab.windowId) {
    await chrome.windows.update(tab.windowId, { focused: true }).catch(() => null);
  }
  return chrome.tabs.update(tab.id, { active: true }).catch(() => tab);
}

async function ensureComposeTab(targetUrl) {
  if (!targetUrl || !chrome?.tabs?.query || !chrome?.tabs?.create || !chrome?.tabs?.update) {
    return null;
  }

  const normalized = normalizeDeskUrl(targetUrl);
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    url: ["https://x.com/*", "https://twitter.com/*"]
  });

  const exactMatch = tabs.find((tab) => normalizeDeskUrl(tab.url || tab.pendingUrl || "") === normalized);
  if (exactMatch?.id) {
    return focusTabWindow(exactMatch);
  }

  const reusable = tabs.find((tab) => tab?.id);
  if (reusable?.id) {
    if (chrome?.windows?.update && reusable.windowId) {
      await chrome.windows.update(reusable.windowId, { focused: true }).catch(() => null);
    }
    return chrome.tabs.update(reusable.id, {
      url: normalized,
      active: true
    }).catch(() => null);
  }

  return chrome.tabs.create({ url: normalized, active: true }).catch(() => null);
}

async function waitForTargetTabReady(tabId, targetUrl, timeoutMs = 15000) {
  if (!tabId || !chrome?.tabs?.get) {
    return null;
  }

  const normalized = normalizeDeskUrl(targetUrl);
  const startedAt = Date.now();
  while (Date.now() - startedAt <= timeoutMs) {
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    const currentUrl = normalizeDeskUrl(tab?.url || tab?.pendingUrl || "");
    const onTarget = !normalized || currentUrl === normalized;
    if (tab && onTarget && tab.status === "complete") {
      return tab;
    }
    await wait(260);
  }

  return chrome.tabs.get(tabId).catch(() => null);
}

function getQueueDraftText(url, fallbackText = "") {
  const normalized = normalizeDeskUrl(url);
  const queuedItem = getQueuedItem(normalized);
  return String(fallbackText || queuedItem?.draft || queuedItem?.text || "").trim().slice(0, 560);
}

async function trackPublishWatch(url, patch = {}) {
  const normalized = normalizeDeskUrl(url);
  if (!normalized) {
    return;
  }
  const existing = getPublishWatchItem(normalized);
  const queueItem = getQueuedItem(normalized);
  const nextItem = {
    url: normalized,
    authorHandle: String(patch.authorHandle || existing?.authorHandle || queueItem?.authorHandle || "").trim(),
    slot: String(patch.slot || existing?.slot || queueItem?.slot || "next").trim(),
    lane: String(patch.lane || existing?.lane || queueItem?.lane || "").trim(),
    draft: String(patch.draft || existing?.draft || queueItem?.draft || queueItem?.text || "").trim().slice(0, 560),
    createdAt: Number(existing?.createdAt || queueItem?.createdAt || Date.now()),
    handedOffAt: Number(patch.handedOffAt || existing?.handedOffAt || Date.now()),
    lastAttemptAt: Number(patch.lastAttemptAt || Date.now()),
    scheduledFor: Number(patch.scheduledFor || existing?.scheduledFor || queueItem?.scheduledFor || 0),
    draftLoaded: Boolean(patch.draftLoaded ?? existing?.draftLoaded),
    clipboardReady: Boolean(patch.clipboardReady ?? existing?.clipboardReady),
    source: String(patch.source || existing?.source || "queue").trim(),
    status: ["composer-ready", "post-opened", "cooldown"].includes(String(patch.status || existing?.status || "composer-ready"))
      ? String(patch.status || existing?.status || "composer-ready")
      : "composer-ready"
  };
  const nextPublishWatch = [nextItem, ...getPublishWatchItems().filter((item) => item.url !== normalized)].slice(0, 40);
  await syncState({ publishWatch: nextPublishWatch });
}

async function clearPublishWatchForUrl(url) {
  const normalized = normalizeDeskUrl(url);
  if (!normalized || !getPublishWatchItem(normalized)) {
    return;
  }
  await syncState({ publishWatch: getPublishWatchItems().filter((item) => item.url !== normalized) });
}

function getReplyHistoryEntry(url) {
  const normalized = normalizeDeskUrl(url);
  if (!normalized) {
    return null;
  }
  return getReplyArchiveEntries(currentState).find((entry) => entry.url === normalized) || currentState.replyDetails?.[normalized] || null;
}

async function captureReplyPerformanceForUrl(tabId, targetUrl, replyEntry = null) {
  const normalizedTarget = normalizeDeskUrl(targetUrl);
  const sourceEntry = replyEntry || getReplyHistoryEntry(normalizedTarget);
  const replyUrl = normalizeDeskUrl(sourceEntry?.replyUrl);
  const replyTweetId = String(sourceEntry?.replyTweetId || "").trim();
  if (!normalizedTarget || (!replyUrl && !replyTweetId)) {
    return { ok: false, skipped: true, reason: "missing-reply-reference" };
  }

  const payload = {
    url: normalizedTarget,
    targetUrl: normalizedTarget,
    replyUrl,
    replyTweetId
  };
  const startedAt = Date.now();
  let lastResponse = null;

  while (Date.now() - startedAt <= 18000) {
    const response = await sendTabMessage(tabId, {
      type: "X_REPLY_SCORER_CAPTURE_REPLY_PERFORMANCE_SNAPSHOT",
      payload
    });
    lastResponse = response || null;

    if (response?.ok && response.snapshot) {
      const record = await sendMessage({
        type: "X_REPLY_SCORER_RECORD_REPLY_PERFORMANCE_SNAPSHOT",
        targetUrl: normalizedTarget,
        snapshot: response.snapshot
      });
      if (record?.state) {
        render(record.state);
      }
      return { ok: true, response, record };
    }

    if (response?.reason === "navigating") {
      await waitForTargetTabReady(tabId, normalizeDeskUrl(replyUrl || response?.targetUrl || normalizedTarget), 12000);
    } else if (isTerminalReplyHandoffFailure(response)) {
      break;
    } else {
      await wait(340);
    }
  }

  return { ok: false, lastResponse };
}

async function capturePickupForUrl(url) {
  const targetUrl = normalizeDeskUrl(url);
  if (!targetUrl) {
    return false;
  }

  const replyEntry = getReplyHistoryEntry(targetUrl) || {};
  const pickupEntry = getPickupWatchItem(targetUrl);
  const tab = await ensureComposeTab(targetUrl);
  if (!tab?.id) {
    flashStatus(localize({
      "zh-Hans": "没能打开目标帖子做复查",
      "zh-Hant": "沒能打開目標貼文做複查",
      en: "Could not open the target post for pickup check",
      ja: "復査のために対象投稿を開けませんでした",
      ko: "결과 확인을 위해 대상 게시물을 열지 못했습니다"
    }));
    return false;
  }

  await waitForTargetTabReady(tab.id, targetUrl, 15000);
  const payload = {
    url: targetUrl,
    lane: String(replyEntry?.lane || pickupEntry?.lane || "").trim(),
    slot: String(replyEntry?.slot || pickupEntry?.slot || "").trim(),
    baselineReplies: Number(replyEntry?.baselineReplies || pickupEntry?.baselineReplies || 0),
    baselineLikes: Number(replyEntry?.baselineLikes || pickupEntry?.baselineLikes || 0),
    baselineViews: Number(replyEntry?.baselineViews || pickupEntry?.baselineViews || 0)
  };
  const startedAt = Date.now();
  let lastResponse = null;
  let pickupSucceeded = false;

  while (Date.now() - startedAt <= 18000) {
    const response = await sendTabMessage(tab.id, {
      type: "X_REPLY_SCORER_CAPTURE_PICKUP_SNAPSHOT",
      payload
    });
    lastResponse = response || null;

    if (response?.ok && response.snapshot) {
      const record = await sendMessage({
        type: "X_REPLY_SCORER_RECORD_PICKUP_SNAPSHOT",
        url: targetUrl,
        snapshot: response.snapshot
      });
      if (record?.state) {
        render(record.state);
      }
      pickupSucceeded = true;
      break;
    }

    if (response?.reason === "navigating") {
      await waitForTargetTabReady(tab.id, targetUrl, 12000);
    } else if (isTerminalReplyHandoffFailure(response)) {
      break;
    } else {
      await wait(340);
    }
  }

  const replyOutcome = await captureReplyPerformanceForUrl(tab.id, targetUrl, getReplyHistoryEntry(targetUrl));
  const nextDetail = getReplyHistoryEntry(targetUrl) || {};
  const pickupLabel = getPickupStatusLabel(nextDetail.pickupStatus || lastResponse?.snapshot?.status || (lastResponse?.snapshot?.authorEngaged ? "author-engaged" : "quiet"));
  const deltaText = getPickupDeltaSummary(nextDetail);
  const replyObservedText = Number(nextDetail?.replyObservedViews || 0) > 0
    ? localize({
        "zh-Hans": `回复 ${formatCompactCount(nextDetail.replyObservedViews)} 浏览`,
        "zh-Hant": `回覆 ${formatCompactCount(nextDetail.replyObservedViews)} 瀏覽`,
        en: `Reply ${formatCompactCount(nextDetail.replyObservedViews)} views`,
        ja: `返信 ${formatCompactCount(nextDetail.replyObservedViews)} 表示`,
        ko: `답글 ${formatCompactCount(nextDetail.replyObservedViews)} 조회`
      })
    : (nextDetail?.replyCheckedAt
      ? localize({
          "zh-Hans": "回复自曝已更新",
          "zh-Hant": "回覆自曝已更新",
          en: "Reply stats updated",
          ja: "返信自体を更新",
          ko: "답글 자체 성과 업데이트"
        })
      : "");

  if (pickupSucceeded || replyOutcome.ok) {
    flashStatus([deltaText ? `${pickupLabel} · ${deltaText}` : pickupLabel, replyObservedText].filter(Boolean).join(" · "));
    return true;
  }

  if (replyOutcome.skipped) {
    flashStatus(localize({
      "zh-Hans": "这条回复还没绑定到 reply 链接，暂时只能查线程表现",
      "zh-Hant": "這條回覆還沒綁定到 reply 連結，暫時只能查線程表現",
      en: "This reply is not linked to a reply URL yet, so only thread-side performance is available",
      ja: "この返信はまだ reply URL に結び付いていないため、いまはスレッド側だけ確認できます",
      ko: "이 답글은 아직 reply URL과 연결되지 않아 지금은 스레드 쪽만 확인할 수 있습니다"
    }));
    return false;
  }

  flashStatus(formatReplyHandoffStatus(replyOutcome.lastResponse || lastResponse, localize({
    "zh-Hans": "暂时没能拿到表现快照",
    "zh-Hant": "暫時沒能拿到表現快照",
    en: "Could not capture performance snapshots yet",
    ja: "実績スナップショットをまだ取得できませんでした",
    ko: "성과 스냅샷을 아직 가져오지 못했습니다"
  })));
  return false;
}

async function handoffQueueCompose(url, options = {}) {
  const targetUrl = normalizeDeskUrl(url);
  if (!targetUrl) {
    return false;
  }

  const draftText = getQueueDraftText(targetUrl, String(options.draftText || ""));
  const copied = draftText ? await copyTextToClipboard(draftText) : false;
  const tab = await ensureComposeTab(targetUrl);

  if (!tab?.id) {
    flashStatus(localize({
      "zh-Hans": "没能打开目标帖子",
      "zh-Hant": "沒能打開目標貼文",
      en: "Could not open the target post",
      ja: "対象の投稿を開けませんでした",
      ko: "대상 게시물을 열지 못했습니다"
    }));
    return false;
  }

  await waitForTargetTabReady(tab.id, targetUrl, 15000);
  const payload = { url: targetUrl, draft: draftText };
  const startedAt = Date.now();
  let lastResponse = null;

  while (Date.now() - startedAt <= 18000) {
    const response = await sendTabMessage(tab.id, {
      type: "X_REPLY_SCORER_OPEN_QUEUE_COMPOSER",
      payload
    });
    lastResponse = response || null;

    if (response?.ok && response.composerReady) {
      await trackPublishWatch(targetUrl, {
        status: "composer-ready",
        handedOffAt: Date.now(),
        lastAttemptAt: Date.now(),
        draftLoaded: Boolean(response.draftLoaded),
        clipboardReady: Boolean(copied),
        draft: draftText
      });
      await refreshCurrentPageStatus().catch(() => null);
      if (response.draftLoaded) {
        flashStatus(localize({
          "zh-Hans": "已打开回复框并带入排队稿",
          "zh-Hant": "已打開回覆框並帶入排隊稿",
          en: "Reply composer opened with the queued draft",
          ja: "返信欄を開いて下書きを入れました",
          ko: "답글 창을 열고 큐 초안을 넣었습니다"
        }));
      } else if (copied) {
        flashStatus(localize({
          "zh-Hans": "已打开回复框，草稿也在剪贴板",
          "zh-Hant": "已打開回覆框，草稿也在剪貼簿",
          en: "Reply composer opened. Draft is also on the clipboard",
          ja: "返信欄を開きました。下書きもクリップボードにあります",
          ko: "답글 창을 열었습니다. 초안도 클립보드에 복사해 두었습니다"
        }));
      } else {
        flashStatus(localize({
          "zh-Hans": "已打开回复框",
          "zh-Hant": "已打開回覆框",
          en: "Reply composer opened",
          ja: "返信欄を開きました",
          ko: "답글 창을 열었습니다"
        }));
      }
      return true;
    }

    if (response?.reason === "navigating") {
      await waitForTargetTabReady(tab.id, targetUrl, 12000);
    } else if (isTerminalReplyHandoffFailure(response)) {
      break;
    } else {
      await wait(340);
    }
  }

  if (isTerminalReplyHandoffFailure(lastResponse)) {
    flashStatus(formatReplyHandoffStatus(lastResponse, localize({
      "zh-Hans": "回复框没能自动拉起",
      "zh-Hant": "回覆框沒能自動拉起",
      en: "The reply composer did not open",
      ja: "返信欄を開けませんでした",
      ko: "답글 창을 열지 못했습니다"
    })));
    return false;
  }

  await trackPublishWatch(targetUrl, {
    status: "post-opened",
    handedOffAt: Date.now(),
    lastAttemptAt: Date.now(),
    draftLoaded: false,
    clipboardReady: Boolean(copied),
    draft: draftText
  });
  await refreshCurrentPageStatus().catch(() => null);
  flashStatus(lastResponse?.reasonCode
    ? formatReplyHandoffStatus(lastResponse)
    : (copied
      ? localize({
        "zh-Hans": "已切到原帖，草稿已复制；回复框可手动补开",
        "zh-Hant": "已切到原貼，草稿已複製；回覆框可手動補開",
        en: "The post is open and the draft is copied. Open the composer manually if needed",
        ja: "元投稿は開いています。必要なら手動で返信欄を開いてください",
        ko: "원문과 초안은 준비됐습니다. 필요하면 답글 창을 수동으로 열어 주세요"
      })
      : localize({
        "zh-Hans": "已切到原帖，但回复框还没自动拉起",
        "zh-Hant": "已切到原貼，但回覆框還沒自動拉起",
        en: "The post is open, but the composer did not open automatically",
        ja: "元投稿は開きましたが、返信欄は自動で開きませんでした",
        ko: "원문은 열었지만 답글 창은 자동으로 열리지 않았습니다"
      })));
  return false;
}

async function dismissCandidate(url) {
  const normalized = String(url || "").trim();
  if (!normalized) {
    return;
  }
  await syncState({
    dismissedTweets: {
      ...(currentState.dismissedTweets || {}),
      [normalized]: Date.now()
    }
  });
  flashStatus(getTexts().candidateDismissedStatus);
}

async function restoreDismissedCandidates() {
  if (!getDismissedCount()) {
    return;
  }
  await syncState({ dismissedTweets: {} });
  flashStatus(getTexts().dismissedRestoredStatus);
}

function updateComposerText(value) {
  uiState.draftRouteKey = "";
  uiState.composerText = String(value || "");
}

function applyDraftRoute(payload = "") {
  try {
    const parsed = JSON.parse(String(payload || "{}"));
    const nextDraftIndex = Math.max(0, Number(parsed.draftIndex) || 0);
    uiState.selectedDraftIndex = nextDraftIndex;
    uiState.draftRouteKey = String(parsed.routeKey || "").trim();
    uiState.draftTone = DRAFT_TONE_DEFS.some((item) => item.key === parsed.tone) ? parsed.tone : "neutral";
    uiState.draftStarterIndex = Number.isFinite(Number(parsed.starterIndex)) ? Math.max(0, Number(parsed.starterIndex)) : -1;
    uiState.draftBodyIndex = Number.isFinite(Number(parsed.bodyIndex)) ? Math.max(0, Number(parsed.bodyIndex)) : -1;
    uiState.draftCloserIndex = Number.isFinite(Number(parsed.closerIndex)) ? Math.max(0, Number(parsed.closerIndex)) : -1;
    uiState.composerText = "";
    uiState.draftSourceUrl = "";
    render(currentState);
  } catch {
    return;
  }
}

function applyDraftStarter(payload = "") {
  const nextIndex = Math.max(0, Number(payload) || 0);
  uiState.draftRouteKey = "";
  uiState.draftStarterIndex = uiState.draftStarterIndex === nextIndex ? -1 : nextIndex;
  uiState.composerText = "";
  render(currentState);
}

function applyDraftBody(payload = "") {
  const nextIndex = Math.max(0, Number(payload) || 0);
  uiState.draftRouteKey = "";
  uiState.draftBodyIndex = uiState.draftBodyIndex === nextIndex ? -1 : nextIndex;
  uiState.composerText = "";
  render(currentState);
}

function applyDraftCloser(payload = "") {
  const nextIndex = Math.max(0, Number(payload) || 0);
  uiState.draftRouteKey = "";
  uiState.draftCloserIndex = uiState.draftCloserIndex === nextIndex ? -1 : nextIndex;
  uiState.composerText = "";
  render(currentState);
}

function useDraftAtIndex(index) {
  uiState.selectedDraftIndex = Math.max(0, Number(index) || 0);
  uiState.draftRouteKey = "";
  uiState.draftStarterIndex = -1;
  uiState.draftBodyIndex = -1;
  uiState.draftCloserIndex = -1;
  uiState.composerText = "";
  uiState.draftSourceUrl = "";
  render(currentState);
}

function setDraftTone(tone) {
  uiState.draftTone = DRAFT_TONE_DEFS.some((item) => item.key === tone) ? tone : "neutral";
  uiState.draftRouteKey = "";
  uiState.draftStarterIndex = -1;
  uiState.draftBodyIndex = -1;
  uiState.draftCloserIndex = -1;
  uiState.composerText = "";
  uiState.draftSourceUrl = "";
  render(currentState);
}

async function upsertReplyQueue(url, slot = "next", draftText = "", options = {}) {
  const normalized = normalizeDeskUrl(url);
  if (!normalized) {
    return;
  }
  const queueItems = getReplyQueueItems();
  const candidate = (Array.isArray(currentState.recentCandidates) ? currentState.recentCandidates : []).find((item) => item?.url === normalized);
  const existing = queueItems.find((item) => item.url === normalized);
  const lane = candidate ? getCandidateLane(candidate).label : (existing?.lane || localize({"zh-Hans": "待处理", "zh-Hant": "待處理", en: "Queued", ja: "対応待ち", ko: "처리 대기"}));
  const nextItem = {
    url: normalized,
    authorHandle: candidate?.authorHandle || existing?.authorHandle || "",
    text: candidate?.text || existing?.text || "",
    score: Number(candidate?.score ?? existing?.score ?? 0),
    createdAt: Number(existing?.createdAt || Date.now()),
    scheduledFor: getScheduledTimestamp(slot),
    completedAt: 0,
    slot,
    draft: String(draftText || existing?.draft || "").trim().slice(0, 560),
    lane,
    keywordMatched: Boolean(candidate?.keywordMatched || existing?.keywordMatched),
    matchedTopics: uniqueList(candidate?.matchedTopics || existing?.matchedTopics || []).slice(0, 4),
    matchedLanguages: uniqueList(candidate?.matchedLanguages || existing?.matchedLanguages || []).slice(0, 4),
    highlights: uniqueList(candidate?.highlights || existing?.highlights || []).slice(0, 4),
    status: "queued"
  };
  const nextQueue = [nextItem, ...queueItems.filter((item) => item.url !== normalized)]
    .sort(compareReplyQueueItems)
    .slice(0, 80);
  await syncState({ replyQueue: nextQueue });
  await clearPublishWatchForUrl(normalized);
  if (!options?.silent) {
    flashStatus(localize({
      "zh-Hans": `已排到${getQueueSlotTexts(slot).label}` ,
      "zh-Hant": `已排到${getQueueSlotTexts(slot).label}` ,
      en: `Queued for ${getQueueSlotTexts(slot).label.toLowerCase()}` ,
      ja: `${getQueueSlotTexts(slot).label} に入れました` ,
      ko: `${getQueueSlotTexts(slot).label} 에 넣었습니다`
    }));
  }
}

async function setReplyQueueItemStatus(url, status) {
  const normalized = normalizeDeskUrl(url);
  const nextStatus = normalizeQueueStatus(status);
  if (!normalized || nextStatus === "queued") {
    return;
  }

  const existing = getQueuedItem(normalized);
  if (!existing) {
    return;
  }

  if (nextStatus === "shipped") {
    const response = await sendMessage({
      type: "X_REPLY_SCORER_MARK_REPLIED",
      url: normalized,
      meta: {
        score: existing.score,
        tier: "replied",
        authorHandle: existing.authorHandle,
        authorVerified: false,
        text: existing.text || existing.draft || "",
        lane: existing.lane || "",
        slot: existing.slot || "",
        keywordMatched: Boolean(existing.keywordMatched),
        matchedTopics: uniqueList(existing.matchedTopics).slice(0, 4),
        matchedLanguages: uniqueList(existing.matchedLanguages).slice(0, 4),
        highlights: uniqueList(existing.highlights).slice(0, 4)
      }
    });
    if (response?.state) {
      render(response.state);
    }
    await clearPublishWatchForUrl(normalized);
    flashStatus(localize({
      "zh-Hans": "已标记为发出",
      "zh-Hant": "已標記為發出",
      en: "Marked as shipped",
      ja: "送信済みにしました",
      ko: "발송 완료로 표시했습니다"
    }));
    return;
  }

  const nextQueue = getReplyQueueItems()
    .map((item) => {
      if (item.url !== normalized) {
        return item;
      }
      return {
        ...item,
        status: nextStatus,
        completedAt: Date.now()
      };
    })
    .sort(compareReplyQueueItems);

  await syncState({ replyQueue: nextQueue });
  await clearPublishWatchForUrl(normalized);
  flashStatus(localize({
    "zh-Hans": "已标记为完成",
    "zh-Hant": "已標記為完成",
    en: "Marked as completed",
    ja: "完了にしました",
    ko: "완료로 표시했습니다"
  }));
}

async function requeueReplyQueueItem(url, slot = "next") {
  const normalized = normalizeDeskUrl(url);
  if (!normalized) {
    return;
  }
  const existing = getQueuedItem(normalized);
  await upsertReplyQueue(normalized, slot, existing?.draft || existing?.text || "");
}

async function removeReplyQueueItem(url) {
  const normalized = normalizeDeskUrl(url);
  if (!normalized) {
    return;
  }
  const nextQueue = getReplyQueueItems().filter((item) => item.url !== normalized);
  await syncState({ replyQueue: nextQueue });
  await clearPublishWatchForUrl(normalized);
  flashStatus(localize({
    "zh-Hans": "已移出回复队列",
    "zh-Hant": "已移出回覆隊列",
    en: "Removed from queue",
    ja: "キューから外しました",
    ko: "큐에서 제거했습니다"
  }));
}

async function queueCurrentComposer(slot = null) {
  const url = uiState.focusCandidateUrl;
  if (!url) {
    return;
  }
  const textarea = getActiveDraftComposerTextarea();
  const value = textarea instanceof HTMLTextAreaElement ? textarea.value : uiState.composerText;
  const candidate = (Array.isArray(currentState.recentCandidates) ? currentState.recentCandidates : []).find((item) => item?.url === url);
  await upsertReplyQueue(url, slot || getDefaultQueueSlot(candidate), value);
}

async function handoffCurrentComposer(slot = null) {
  const url = uiState.focusCandidateUrl;
  if (!url) {
    return false;
  }
  const textarea = getActiveDraftComposerTextarea();
  const value = textarea instanceof HTMLTextAreaElement ? textarea.value : uiState.composerText;
  const candidate = (Array.isArray(currentState.recentCandidates) ? currentState.recentCandidates : []).find((item) => item?.url === url);
  const nextSlot = slot || getDefaultQueueSlot(candidate);
  await upsertReplyQueue(url, nextSlot, value, { silent: true });
  return handoffQueueCompose(url, { draftText: value });
}

function polishCurrentComposerForShipping() {
  const textarea = getActiveDraftComposerTextarea();
  const sourceText = textarea instanceof HTMLTextAreaElement ? textarea.value : uiState.composerText;
  const nextText = buildReplyReadyComposerText(sourceText);
  if (!nextText) {
    return;
  }
  uiState.composerText = nextText;
  if (textarea instanceof HTMLTextAreaElement) {
    textarea.value = nextText;
    textarea.focus();
    textarea.setSelectionRange(nextText.length, nextText.length);
  }
  flashStatus(localize({
    "zh-Hans": "已收成更短的直发版",
    "zh-Hant": "已收成更短的直發版",
    en: "Tightened into a send-ready draft",
    ja: "そのまま送れる形に締めました",
    ko: "바로 보낼 수 있게 더 짧게 다듬었습니다"
  }));
}

async function setRelationshipState(handle, status) {
  const key = normalizeHandleKey(handle);
  if (!key) {
    return;
  }
  const nextRelationshipStates = { ...(currentState.relationshipStates || {}) };
  const existing = nextRelationshipStates[key];
  if (existing?.status === status) {
    delete nextRelationshipStates[key];
  } else {
    nextRelationshipStates[key] = {
      status,
      updatedAt: Date.now(),
      snoozeUntil: status === "snoozed" ? Date.now() + DAY_MS : 0
    };
  }
  await syncState({ relationshipStates: nextRelationshipStates });
  flashStatus(localize({
    "zh-Hans": existing?.status === status ? "已清除关系动作" : `已更新为 ${getRelationshipStateLabel(status)}`,
    "zh-Hant": existing?.status === status ? "已清除關係動作" : `已更新為 ${getRelationshipStateLabel(status)}`,
    en: existing?.status === status ? "Relationship action cleared" : `Updated to ${getRelationshipStateLabel(status)}`,
    ja: existing?.status === status ? "関係アクションを解除しました" : `${getRelationshipStateLabel(status)} に更新しました`,
    ko: existing?.status === status ? "관계 액션을 해제했습니다" : `${getRelationshipStateLabel(status)} 상태로 바꿨습니다`
  }));
}

async function handleDeskAction(action, url = "") {
  switch (action) {
    case "open-post":
      await openUrl(url);
      return;
    case "copy-link":
      if (await copyTextToClipboard(url)) {
        flashStatus(getTexts().linkCopiedStatus);
      }
      return;
    case "copy-draft":
      if (await copyTextToClipboard(url)) {
        flashStatus(getTexts().draftCopiedStatus);
      }
      return;
    case "copy-agent-context": {
      const context = uiState.agentContextByUrl.get(normalizeDeskUrl(url));
      const payload = context ? JSON.stringify(context, null, 2) : "";
      if (payload && await copyTextToClipboard(payload)) {
        flashStatus(localize({
          "zh-Hans": "已复制候选上下文包",
          "zh-Hant": "已複製候選上下文包",
          en: "Candidate context copied",
          ja: "候補文脈パックをコピーしました",
          ko: "후보 컨텍스트 팩을 복사했습니다"
        }));
      }
      return;
    }
    case "copy-agent-inbox": {
      const payload = uiState.lastAgentInboxPayload ? JSON.stringify(uiState.lastAgentInboxPayload, null, 2) : "";
      if (payload && await copyTextToClipboard(payload)) {
        flashStatus(localize({
          "zh-Hans": "已复制 AI top shortlist",
          "zh-Hant": "已複製 AI top shortlist",
          en: "AI shortlist copied",
          ja: "AI shortlist をコピーしました",
          ko: "AI shortlist를 복사했습니다"
        }));
      }
      return;
    }
    case "copy-draft-targets": {
      const payload = uiState.lastDraftTargetsPayload ? JSON.stringify(uiState.lastDraftTargetsPayload, null, 2) : "";
      if (payload && await copyTextToClipboard(payload)) {
        flashStatus(localize({
          "zh-Hans": "已复制人工写稿目标",
          "zh-Hant": "已複製人工寫稿目標",
          en: "Draft targets copied",
          ja: "草稿対象をコピーしました",
          ko: "초안 대상을 복사했습니다"
        }));
      }
      return;
    }
    case "copy-agent-schema": {
      const payload = uiState.lastAgentSchemaPayload ? JSON.stringify(uiState.lastAgentSchemaPayload, null, 2) : "";
      if (payload && await copyTextToClipboard(payload)) {
        flashStatus(localize({
          "zh-Hans": "已复制输出 schema",
          "zh-Hant": "已複製輸出 schema",
          en: "Output schema copied",
          ja: "出力 schema をコピーしました",
          ko: "출력 schema를 복사했습니다"
        }));
      }
      return;
    }
    case "open-agent-composer":
      await handoffQueueCompose(url, { draftText: "" });
      return;
    case "copy-composer": {
      const textarea = getActiveDraftComposerTextarea();
      const value = textarea instanceof HTMLTextAreaElement ? textarea.value : uiState.composerText;
      if (await copyTextToClipboard(value)) {
        flashStatus(localize({
          "zh-Hans": "已复制当前工作稿",
          "zh-Hant": "已複製目前工作稿",
          en: "Working draft copied",
          ja: "編集中の稿をコピーしました",
          ko: "작업 중인 초안을 복사했습니다"
        }));
      }
      return;
    }
    case "polish-composer":
      polishCurrentComposerForShipping();
      return;
    case "handoff-queue-compose":
      await handoffQueueCompose(url);
      return;
    case "check-pickup":
      await capturePickupForUrl(url);
      return;
    case "reply-archive-prev":
      uiState.replyArchivePage = Math.max(0, uiState.replyArchivePage - 1);
      render(currentState);
      return;
    case "reply-archive-next":
      uiState.replyArchivePage += 1;
      render(currentState);
      return;
    case "focus-candidate":
      setFocusCandidate(url);
      return;
    case "queue-candidate": {
      const payload = JSON.parse(String(url || "{}"));
      await upsertReplyQueue(payload.url, payload.slot || "next");
      return;
    }
    case "queue-composer":
      await queueCurrentComposer(url || null);
      return;
    case "handoff-current-compose":
      await handoffCurrentComposer(url || null);
      return;
    case "reschedule-queue": {
      const payload = JSON.parse(String(url || "{}"));
      await upsertReplyQueue(payload.url, payload.slot || "next");
      return;
    }
    case "requeue-item": {
      const payload = JSON.parse(String(url || "{}"));
      await requeueReplyQueueItem(payload.url, payload.slot || "next");
      return;
    }
    case "mark-queue-shipped":
      await setReplyQueueItemStatus(url, "shipped");
      return;
    case "mark-queue-completed":
      await setReplyQueueItemStatus(url, "completed");
      return;
    case "remove-queue":
      await removeReplyQueueItem(url);
      return;
    case "set-queue-filter":
      uiState.queueFilter = mergePopupUiPrefs({ queueFilter: url }).queueFilter;
      persistPopupUiPrefs();
      render(currentState);
      return;
    case "use-draft":
      useDraftAtIndex(url);
      return;
    case "apply-draft-route":
      applyDraftRoute(url);
      return;
    case "set-draft-tone":
      setDraftTone(url);
      return;
    case "apply-draft-starter":
      applyDraftStarter(url);
      return;
    case "apply-draft-body":
      applyDraftBody(url);
      return;
    case "apply-draft-closer":
      applyDraftCloser(url);
      return;
    case "dismiss-candidate":
      await dismissCandidate(url);
      return;
    case "set-relationship-state": {
      const [handle, status] = String(url || "").split("::");
      if (handle && status) {
        await setRelationshipState(handle, status);
      }
      return;
    }
    case "open-panel": {
      const opened = await openInPagePanel();
      if (!opened) {
        if (uiState.pageStatus !== "x") {
          await openXTab();
        }
        await refreshCurrentPageStatus();
      }
      return;
    }
    case "open-x":
      await openXTab();
      await refreshCurrentPageStatus();
      return;
    default:
      return;
  }
}

function collectSignalPatch() {
  const patch = {};
  [...els.languageBoostGrid.querySelectorAll('input[type="checkbox"][data-key]'), ...els.topicBoostGrid.querySelectorAll('input[type="checkbox"][data-key]')]
    .forEach((input) => {
      patch[input.dataset.key] = input.checked;
    });
  return patch;
}

function collectKeywordPatch() {
  const patch = {};
  TOPIC_GROUPS.forEach((group) => {
    const section = els.keywordSections.querySelector(`[data-group="${group.key}"]`);
    if (!(section instanceof HTMLElement)) {
      return;
    }
    const activePreset = Array.from(section.querySelectorAll(".chipButton.active, .chipButton.standby")).map((button) => button.dataset.keyword).filter(Boolean);
    const textarea = section.querySelector(`textarea[data-group="${group.key}"]`);
    const custom = textarea instanceof HTMLTextAreaElement ? textareaToList(textarea.value) : [];
    patch[group.keywordsKey] = uniqueList([...activePreset, ...custom]);
  });
  return patch;
}

function scheduleKeywordSave() {
  clearTimeout(saveTimer);
  saveTimer = globalThis.setTimeout(() => {
    syncState(collectKeywordPatch());
  }, 220);
}

function bindDeskEvents() {
  const handleClick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("button[data-action]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    event.preventDefault();
    const payload = button.dataset.payload
      || button.dataset.copyText
      || button.dataset.url
      || button.dataset.filter
      || button.dataset.slot
      || button.dataset.index
      || button.dataset.tone
      || ((button.dataset.handle && button.dataset.status) ? `${button.dataset.handle}::${button.dataset.status}` : "");
    handleDeskAction(button.dataset.action || "", payload).catch(() => {
      setStatusTextValue(getTexts().statusError);
    });
  };

  els.deskFocusCard?.addEventListener("click", handleClick);
  els.draftDeskPanel?.addEventListener("click", handleClick);
  els.growthPulseGrid?.addEventListener("click", handleClick);
  els.aiReplyDeskPanel?.addEventListener("click", handleClick);
  els.queueDeskPanel?.addEventListener("click", handleClick);
  els.candidateDeskList?.addEventListener("click", handleClick);
  els.replyFeedbackList?.addEventListener("click", handleClick);
  els.relationshipDeskList?.addEventListener("click", handleClick);
  els.draftDeskPanel?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLTextAreaElement && target.classList.contains("draftComposerTextarea")) {
      updateComposerText(target.value);
    }
  });
  els.aiReplyDeskPanel?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLTextAreaElement && target.classList.contains("draftComposerTextarea")) {
      updateComposerText(target.value);
    }
  });
  els.restoreDismissedButton?.addEventListener("click", () => {
    restoreDismissedCandidates().catch(() => {
      setStatusTextValue(getTexts().statusError);
    });
  });
  els.deskSubTabButtons.forEach((button) => {
    button.addEventListener("click", () => switchDeskSection(button.dataset.deskTab || "focus"));
  });
}

function bindBaseEvents() {
  els.openDashboardButton?.addEventListener("click", () => switchView("dashboard"));
  els.dashboardBackButton?.addEventListener("click", () => switchView("home"));
  els.enabledToggle?.addEventListener("change", () => syncState({ enabled: els.enabledToggle.checked }));
  els.thresholdRange?.addEventListener("input", () => {
    setText(els.thresholdValue, String(Number(els.thresholdRange.value)));
  });
  els.thresholdRange?.addEventListener("change", () => syncState({ threshold: Number(els.thresholdRange.value) }));
  els.onlyKeywordHits?.addEventListener("change", () => syncState({ onlyKeywordHits: els.onlyKeywordHits.checked }));
  els.posterUrlInput?.addEventListener("input", () => {
    currentState.posterUrl = normalizePosterUrl(els.posterUrlInput.value);
    applyPosterPreview();
  });
  els.posterUrlInput?.addEventListener("change", () => syncState({ posterUrl: normalizePosterUrl(els.posterUrlInput.value) }));
  els.posterFileInput?.addEventListener("change", async () => {
    const [file] = Array.from(els.posterFileInput.files || []);
    if (!file) return;
    const posterUrl = await fileToPosterDataUrl(file);
    currentState.posterUrl = normalizePosterUrl(posterUrl);
    applyPosterPreview();
    await syncState({ posterUrl: currentState.posterUrl });
    els.posterFileInput.value = "";
  });
  els.posterClearButton?.addEventListener("click", () => {
    currentState.posterUrl = "";
    applyPosterPreview();
    syncState({ posterUrl: "" });
  });
  els.refreshStatusButton?.addEventListener("click", () => {
    refreshPopupState().catch(() => {
      uiState.pageStatus = "unknown";
      uiState.entryStatus = "checking";
      renderControlDeck();
    });
  });
  els.openXButton?.addEventListener("click", () => {
    openXTab().then(() => refreshCurrentPageStatus()).catch(() => {
      uiState.pageStatus = "unknown";
      uiState.entryStatus = "checking";
      renderControlDeck();
    });
  });
  els.openPanelButton?.addEventListener("click", () => {
    openInPagePanel().then((opened) => {
      if (!opened) {
        refreshCurrentPageStatus().catch(() => {
          uiState.pageStatus = "unknown";
          uiState.entryStatus = "checking";
          renderControlDeck();
        });
      }
    }).catch(() => {
      uiState.entryStatus = "unavailable";
      renderControlDeck();
    });
  });
  els.openOptionsButton?.addEventListener("click", () => sendMessage({ type: "X_REPLY_SCORER_OPEN_OPTIONS" }));
  els.tabButtons.forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.tab)));
  els.localeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      if (!lang) return;
      const nextLang = lang === "zh" ? (currentState.uiLanguage === "zh-Hant" ? "zh-Hans" : "zh-Hant") : lang;
      if (nextLang !== currentState.uiLanguage) {
        syncState({ uiLanguage: nextLang });
      }
    });
  });
}

function bindSignalEvents() {
  if (!els.languageBoostGrid || !els.topicBoostGrid) {
    return;
  }
  const onChange = () => syncState(collectSignalPatch());
  els.languageBoostGrid.addEventListener("change", onChange);
  els.topicBoostGrid.addEventListener("change", onChange);
}

function bindKeywordEvents() {
  if (!els.keywordSections) {
    return;
  }
  els.keywordSections.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest(".chipButton");
    if (!(button instanceof HTMLButtonElement)) return;
    const group = TOPIC_GROUPS.find((item) => item.key === button.dataset.group);
    const enabled = group ? Boolean(currentState[group.enabledKey]) : true;
    const nextSelected = !(button.classList.contains("active") || button.classList.contains("standby"));
    button.classList.toggle("active", nextSelected && enabled);
    button.classList.toggle("standby", nextSelected && !enabled);
    scheduleKeywordSave();
  });

  els.keywordSections.addEventListener("input", (event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      scheduleKeywordSave();
    }
  });
}

function bindRuntimeListener() {
  chrome?.runtime?.onMessage?.addListener?.((message) => {
    if (message?.type !== "X_REPLY_SCORER_STATE_CHANGED" || !message.state) {
      return;
    }

    if (message.reason === "stats") {
      currentState = normalizeState({
        ...currentState,
        scannedCount: message.state.scannedCount,
        visibleCount: message.state.visibleCount,
        highScoreCount: message.state.highScoreCount,
        todayReplyCount: message.state.todayReplyCount,
        recentCandidates: message.state.recentCandidates
      });
      uiState.lastSyncedAt = Date.now();
      renderStats();
      renderDeskPanel();
      renderControlDeck();
      return;
    }

    render(message.state);
  });
}

async function init() {
  if (getQueryFlag("embedded")) {
    els.body.classList.add("embedded-page");
  } else if (!els.body.classList.contains("options-page")) {
    els.body.classList.add("popup-window");
  }

  const popupUiPrefs = readPopupUiPrefs();
  if (popupUiPrefs) {
    const nextPrefs = resolvePopupUiPrefs(popupUiPrefs);
    activeView = nextPrefs.activeView;
    activeTab = nextPrefs.activeTab;
    uiState.deskSection = nextPrefs.deskSection;
    uiState.queueFilter = nextPrefs.queueFilter;
  } else {
    const nextPrefs = resolvePopupUiPrefs(getPopupUiPrefsSnapshot());
    activeView = nextPrefs.activeView;
    activeTab = nextPrefs.activeTab;
    uiState.deskSection = nextPrefs.deskSection;
    uiState.queueFilter = nextPrefs.queueFilter;
  }

  await refreshPopupState();
  bindBaseEvents();
  bindDeskEvents();
  bindSignalEvents();
  bindKeywordEvents();
  bindRuntimeListener();
}

init().catch((error) => {
  if (isPreviewMode()) {
    setStatusTextValue(getTexts().statusOn);
    return;
  }
  console.error(error);
  setStatusTextValue(getTexts().statusError);
});
