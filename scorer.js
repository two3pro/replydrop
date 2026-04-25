(function initScorer(global) {
  const TOPIC_DEFS = [
    {
      key: "ai",
      enabledKey: "aiEnabled",
      keywordsKey: "aiKeywords",
      bonus: 10,
      defaults: ["ai", "chatgpt", "claude", "gemini", "seedance", "即梦", "生成ai", "llm", "agi", "copilot", "grok", "perplexity"]
    },
    {
      key: "crypto",
      enabledKey: "cryptoEnabled",
      keywordsKey: "cryptoKeywords",
      bonus: 10,
      defaults: ["crypto", "bitcoin", "btc", "eth", "bnb", "defi", "nft", "web3", "blockchain", "altcoin", "memecoin", "on-chain"]
    },
    {
      key: "model",
      enabledKey: "modelEnabled",
      keywordsKey: "modelKeywords",
      bonus: 5,
      defaults: ["gpt-4", "gpt-5", "o3", "o4", "claude 3", "claude 4", "gemini", "llama", "mistral", "qwen", "deepseek", "grok", "flux", "midjourney", "sora", "kling", "wan", "hunyuanvideo", "seedance"]
    },
    {
      key: "creator",
      enabledKey: "creatorEnabled",
      keywordsKey: "creatorKeywords",
      bonus: 7,
      defaults: ["creator", "youtube", "youtuber", "streamer", "streaming", "shorts", "reels", "tiktok", "viral", "audience", "subscriber", "monetization", "ugc", "content strategy"]
    },
    {
      key: "gaming",
      enabledKey: "gamingEnabled",
      keywordsKey: "gamingKeywords",
      bonus: 6,
      defaults: ["game", "gaming", "gamer", "steam", "nintendo", "playstation", "xbox", "switch 2", "esports", "speedrun", "gacha", "minecraft", "roblox", "hoyoverse", "gta"]
    },
    {
      key: "business",
      enabledKey: "businessEnabled",
      keywordsKey: "businessKeywords",
      bonus: 7,
      defaults: ["startup", "founder", "saas", "growth", "revenue", "profit", "fundraising", "vc", "product market fit", "ecommerce", "marketing", "earnings"]
    },
    {
      key: "finance",
      enabledKey: "financeEnabled",
      keywordsKey: "financeKeywords",
      bonus: 6,
      defaults: ["stocks", "nasdaq", "s&p 500", "dow jones", "treasury", "fed", "ipo", "market cap", "bond", "inflation", "rate cut", "yield"]
    },
    {
      key: "politics",
      enabledKey: "politicsEnabled",
      keywordsKey: "politicsKeywords",
      bonus: 6,
      defaults: ["election", "vote", "congress", "senate", "white house", "president", "policy", "parliament", "campaign", "tariff", "cabinet", "diplomacy"]
    },
    {
      key: "sports",
      enabledKey: "sportsEnabled",
      keywordsKey: "sportsKeywords",
      bonus: 6,
      defaults: ["nba", "nfl", "mlb", "f1", "ufc", "olympics", "football", "soccer", "tennis", "goal", "championship", "playoffs"]
    },
    {
      key: "entertainment",
      enabledKey: "entertainmentEnabled",
      keywordsKey: "entertainmentKeywords",
      bonus: 5,
      defaults: ["celebrity", "idol", "concert", "music", "album", "drama", "variety show", "tour", "fandom", "trailer", "box office", "tv series"]
    },
    {
      key: "film",
      enabledKey: "filmEnabled",
      keywordsKey: "filmKeywords",
      bonus: 5,
      defaults: ["movie", "cinema", "director", "screenplay", "scene", "letterboxd", "criterion", "festival", "documentary", "actor", "actress", "shot"]
    },
    {
      key: "fashion",
      enabledKey: "fashionEnabled",
      keywordsKey: "fashionKeywords",
      bonus: 5,
      defaults: ["fashion", "runway", "lookbook", "outfit", "designer", "vogue", "styling", "streetwear", "beauty", "makeup", "skincare", "luxury"]
    },
    {
      key: "travel",
      enabledKey: "travelEnabled",
      keywordsKey: "travelKeywords",
      bonus: 5,
      defaults: ["travel", "trip", "flight", "hotel", "itinerary", "beach", "mountain", "resort", "tourism", "citywalk", "backpacking", "destination"]
    },
    {
      key: "books",
      enabledKey: "booksEnabled",
      keywordsKey: "booksKeywords",
      bonus: 5,
      defaults: ["book", "novel", "poem", "essay", "literature", "author", "reading", "bookstore", "quote", "translation", "fiction", "memoir"]
    }
  ];

  const LANGUAGE_DEFS = [
    { key: "langZh", bonus: 4, codes: ["zh", "zh-cn", "zh-hans", "zh-tw", "zh-hant", "zh-hk"], test: isChinese },
    { key: "langEn", bonus: 2, codes: ["en", "en-us", "en-gb"] },
    { key: "langJa", bonus: 5, codes: ["ja", "ja-jp"], test: isJapanese },
    { key: "langKo", bonus: 5, codes: ["ko", "ko-kr"], test: isKorean },
    { key: "langFr", bonus: 3, codes: ["fr", "fr-fr", "fr-ca"] },
    { key: "langEs", bonus: 3, codes: ["es", "es-es", "es-419", "es-mx"] },
    { key: "langDe", bonus: 3, codes: ["de", "de-de"] },
    { key: "langIt", bonus: 3, codes: ["it", "it-it"] },
    { key: "langPt", bonus: 3, codes: ["pt", "pt-br", "pt-pt"] },
    { key: "langRu", bonus: 4, codes: ["ru", "ru-ru"], test: isCyrillic },
    { key: "langAr", bonus: 4, codes: ["ar", "ar-sa", "ar-ae"], test: isArabic }
  ];

  const DEFAULT_SETTINGS = {
    enabled: true,
    headlessMode: false,
    displayThreshold: 30,
    goodThreshold: 60,
    highThreshold: 80,
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
    aiEnabled: true,
    cryptoEnabled: true,
    modelEnabled: true,
    creatorEnabled: false,
    gamingEnabled: false,
    businessEnabled: false,
    financeEnabled: false,
    politicsEnabled: false,
    sportsEnabled: false,
    entertainmentEnabled: false,
    filmEnabled: false,
    fashionEnabled: false,
    travelEnabled: false,
    booksEnabled: false
  };

  TOPIC_DEFS.forEach((topic) => {
    DEFAULT_SETTINGS[topic.keywordsKey] = topic.defaults;
  });

  const PHOTO_BONUS = 6;
  const VIDEO_BONUS = 10;
  const COUNT_TOKEN_RE = /(\d+(?:[.,]\d+)?)(?:\s*([KMBkmb万萬億亿千]))?/;
  const OFFICIAL_BROADCAST_HANDLE_TERMS = [
    "official", "gov", "government", "ministry", "dept", "department", "bureau", "agency",
    "office", "cityof", "county", "state", "mayor", "police", "fire", "transport", "health",
    "embassy", "consulate", "press", "media", "news", "newsroom", "journal", "times", "daily",
    "post", "wire", "network", "channel", "studio", "records", "corp", "inc", "ltd", "llc",
    "brand", "team", "club", "fc", "foundation", "university", "college", "hospital", "museum",
    "official_", "_official", "breaking",
    "arkham", "opencode", "protocol", "protocolfx", "protocol_fx", "labs", "research",
    "bricsinfo", "brics", "letsvpn", "kojipro", "kojipro2015", "kojima", "sciencegirl",
    "jacksonhinklle", "hinkle", "ajenglish", "aljazeera", "wallstreet0name",
    "cryptobrave", "cryptobravehq", "exchange", "marketmaker", "market_maker",
    "binance", "coinbase", "okx", "bybit", "kraken", "kucoin", "bitget", "mexc", "gateio",
    "cointelegraph", "coindesk", "openai", "google", "microsoft",
    "apple", "tesla", "spacex", "youtube", "netflix", "amazon", "meta",
    "nba", "nfl", "mlb", "nhl", "fifa", "uefa", "olympics", "espn", "sportscenter",
    "bleacherreport", "premierleague", "laliga", "seriea", "bundesliga",
    "whale_alert", "whalealert", "trollfootball", "africafactszone", "africafacts",
    "factszone", "sportsradio", "sportstalk", "radio", "podcast", "aggregator"
  ];
  const OFFICIAL_BROADCAST_NAME_TERMS = [
    "official", "government", "ministry", "department", "bureau", "agency", "office", "city of",
    "county of", "state of", "police", "fire department", "transportation", "health", "embassy",
    "consulate", "press", "media", "news", "newsroom", "journal", "times", "daily", "post",
    "wire", "network", "channel", "studios", "records", "corporation", "company", "foundation",
    "university", "college", "hospital", "museum", "official account", "官方", "新闻", "媒體", "媒体",
    "日报", "日報", "电视", "電視", "政府", "警察", "公安", "外交部", "教育部", "交通部",
    "arkham", "opencode", "protocol", "protocol fx", "labs", "research",
    "brics", "brics info", "letsvpn", "vpn", "kojima productions", "koji pro",
    "jackson hinkle", "hinkle", "al jazeera", "aj english", "wall street",
    "crypto brave", "market maker", "exchange", "web3 event", "web3 summit",
    "binance", "coinbase", "okx", "bybit", "kraken", "kucoin", "bitget", "mexc", "gate.io",
    "cointelegraph", "coindesk", "openai", "google", "microsoft",
    "apple", "tesla", "spacex", "youtube", "netflix", "amazon", "meta",
    "nba", "nfl", "mlb", "nhl", "fifa", "uefa", "olympics", "espn", "sportscenter",
    "bleacher report", "premier league", "la liga", "serie a", "bundesliga",
    "whale alert", "troll football", "africa facts zone", "africa facts",
    "facts zone", "sports radio", "sports talk", "radio show", "news aggregator",
    "content aggregator"
  ];
  const BROADCAST_TEXT_TERMS = [
    "official statement", "statement:", "official update", "update:", "press release", "for immediate release",
    "breaking:", "breaking news", "announcing", "announcement", "we are pleased to announce",
    "read more", "full story", "live updates", "developing story", "watch live", "press conference",
    "public notice", "service update", "media advisory", "news alert", "今日通报", "今日通報",
    "official launch", "now supports", "is now supported", "support for", "available in",
    "new release", "product update", "mainnet", "testnet", "minting", "minted", "tvl",
    "event recap", "join us at", "meet us at", "networking event", "web3 event", "web3 summit",
    "market maker", "campaign partner", "sponsored by", "#pr", "pr:", "award ceremony",
    "won the award", "service status", "scheduled maintenance", "viral video", "footage shows",
    "just in", "report:", "sources:", "according to", "did you know", "fact of the day",
    "facts about", "on today's show", "tune in", "listen live", "live radio", "watch:",
    "recap:", "thread:", "newsletter", "subscribe for", "follow for updates",
    "caught on camera", "官方通报", "官方通報", "最新公告", "情况通报", "情況通報", "紧急通知", "緊急通知", "声明", "聲明",
    "イベント", "キャンペーン", "受賞", "公式発表", "お知らせ", "サービス状況",
    "공지", "이벤트", "캠페인", "수상", "공식 발표", "서비스 점검"
  ];
  const DIALOGUE_TEXT_TERMS = [
    "what do you think", "curious", "question", "reply below", "tell me", "let me know",
    "how are you", "how do you", "thoughts", "agree or disagree", "你怎么看", "你怎麼看",
    "怎么看", "怎麼看", "欢迎讨论", "歡迎討論", "聊聊", "说说", "說說"
  ];
  const BIRTHDAY_TEXT_TERMS = [
    "happy birthday", "birthday wishes", "birthday love", "bday", "hbd", "it's my birthday",
    "its my birthday", "my birthday", "birthday girl", "birthday boy", "生日快乐", "生日快樂",
    "祝你生日快乐", "祝你生日快樂", "祝我生日快乐", "祝我生日快樂", "今天生日", "今日生日"
  ];
  const FOLLOW_TRAIN_CTA_TERMS = [
    "say hello", "say hey", "say hi", "drop hello", "drop hey", "drop hi",
    "say want", "say need", "reply me", "reply hello", "reply hey", "reply hi",
    "reply want", "reply need", "comment hello", "comment hey", "comment hi", "comment good morning",
    "comment want", "comment need", "type hello", "type hey", "type hi",
    "type want", "type need", "say yes", "write help", "type help",
    "comment help", "reply help", "just write help", "write \"help\"", "write 'help'",
    "hello below", "hey below", "hi below", "drop a reply below", "drop reply below",
    "reply below", "like and bookmark", "like and save", "like bookmark", "like save",
    "who is active", "active now", "drop your handle", "drop your @", "drop handle",
    "reply done", "comment done", "done below", "tag yourself", "send dm",
    "评论区", "評論區", "评论区集合", "評論區集合", "留个言", "留個言", "扣1", "打卡", "评论进群", "評論進群",
    "推荐关注", "推薦關注", "强烈推荐关注", "強烈推薦關注", "值得关注", "值得關注",
    "点个赞", "點個讚", "点个讚", "點個赞", "点点赞", "點點讚", "收个藏", "收個藏",
    "收藏一下", "点赞收藏", "點讚收藏", "点赞关注", "點讚關注",
    "フォローして", "フォローお願いします", "リプして", "コメントして", "いいねして",
    "反応ください", "拡散希望", "コメントください", "リポストして",
    "팔로우", "맞팔", "선팔", "댓글 남겨", "답글 달아", "좋아요", "리트윗", "알티", "소통해요"
  ];
  const FOLLOW_TRAIN_REWARD_TERMS = [
    "follow back", "followback", "need a follow", "real followers", "followers fast",
    "grow together", "connect & grow", "connect and grow", "let's connect", "lets connect",
    "follow wave", "follow wave incoming", "follow for follow", "f4f",
    "mutuals", "new mutuals", "active mutuals", "let's be mutuals", "lets be mutuals",
    "looking for mutuals", "gain mutual", "gain mutuals", "follow me", "i follow back", "ifb", "fb back",
    "follow train", "follow party", "mutual train", "repost train", "engagement group",
    "support each other", "repost for repost", "retweet for retweet", "like for like",
    "follow and repost", "like and repost", "repost this", "retweet this",
    "gainners", "gainers", "ppl will follow you", "people will follow you",
    "will follow you", "i will follow you", "i'll follow you", "active on x", "follow everyone",
    "boost you", "i will boost you", "i'll boost you", "x payday", "payday",
    "monetize your x account", "monetise your x account", "monetizing your x account",
    "monetising your x account", "monetize their x account", "monetise their x account",
    "monetize x account", "monetise x account", "restart account", "restarted account",
    "5m impression", "million impression", "account visibility", "visibility issue", "shadowban", "shadow ban",
    "million impressions", "impression farming", "creator revenue", "x payout", "payout is coming",
    "grow your account", "growing your account", "active followers", "boost followers",
    "gain train", "follow chain", "support all", "support everyone", "support chain",
    "drop your handle", "handle drop", "under 10k", "under 10 k", "small accounts",
    "like rt", "like + rt", "like and rt", "rt and like", "like and retweet",
    "retweet and like", "like and repost", "repost and like", "comment and rt",
    "grow your page", "growing your page", "grow page", "page growth",
    "follow each other", "gain massively", "massive gain", "gain followers massively",
    "turn notifications on", "notifications on", "notification gang",
    "互关", "互關", "互粉", "回关", "回關", "互推", "求关注", "求關注",
    "涨粉", "漲粉", "万粉", "萬粉", "十万粉", "十萬粉", "重启账号", "重啟帳號",
    "点关注", "點關注", "关注我", "關注我", "帮转", "幫轉", "限流", "影子封禁", "蓝勾互动", "藍勾互動",
    "转推", "轉推", "扩列", "擴列", "活跃粉", "活躍粉", "粉丝", "粉絲",
    "持续关注", "持續關注", "持币裂变", "持幣裂變", "裂变", "裂變",
    "蓝v 增长", "藍v 增長", "蓝V 增长", "藍V 增長", "增长公益", "增長公益",
    "高质量信息", "高質量信息", "优质博主", "優質博主", "推荐关注", "推薦關注",
    "フォロバ", "相互フォロー", "フォロワー募集", "フォロワー増やす", "収益化",
    "インプレッション", "万インプ", "伸びるアカウント", "絡みたい人",
    "맞팔", "팔로우백", "팔로워 늘리기", "팔로워 증가", "수익화", "노출", "인상",
    "페이데이", "정산", "활동 팔로워", "맞팔해요", "소통 계정",
    "수익", "수익금", "수익 인증", "주급", "주간 수익", "광고 수익",
    "블루 수익", "프리미엄 수익", "x 수익", "x 주급", "조회수 수익"
  ];
  const FOLLOW_TRAIN_DIRECT_PATTERNS = [
    /\bwho\s+is\s+active(?:\s+now)?\b/i,
    /\b(?:reply|comment|drop|say|type)\s+(?:me|hello|hey|hi)\b/i,
    /\b(?:reply|comment|drop|say|type)\s+(?:want|need)\b/i,
    /\bdrop\s+a?\s*reply\s+below\b/i,
    /\b(?:write|type|comment|reply)\s+["']?help["']?\b/i,
    /\bjust\s+write\s+["']?\w+["']?\b/i,
    /\bdrop\s+(?:your\s+)?(?:handle|@|username)\b/i,
    /\b(?:reply|comment)\s+done\b/i,
    /\b(?:gain|get)\s+\d+(?:[.,]\d+)?\s+followers?\b/i,
    /\b\d+(?:[.,]\d+)?\+?\s*(?:k\s*)?followers?\b.{0,90}\b(?:say|reply|comment|type|want|need|hi|hello|good\s*morning|grow|page|active|follow)\b/i,
    /\b(?:say|reply|comment|type|want|need|hi|hello|good\s*morning)\b.{0,90}\b\d+(?:[.,]\d+)?\+?\s*(?:k\s*)?followers?\b/i,
    /\b(?:0|zero)\s*(?:to|->|→|-|到)\s*\d+(?:[.,]\d+)?\s*k?\s+followers?\b/i,
    /\b\d+(?:[.,]\d+)?\s*k\s+followers?\b.{0,80}\b(?:case\s*study|growth|moneti[sz]e|impressions?)\b/i,
    /\b(?:\d+(?:[.,]\d+)?\s*[kmb]?\s*)?impressions?\b.{0,80}\bmoneti[sz]e\b/i,
    /\bmoneti[sz](?:e|ing|ation)\b.{0,90}\b(?:x\s+account|followers?|reply|comment|help|premium|impressions?|payday)\b/i,
    /\bx\s+payday\b/i,
    /\b(?:ppl|people|everyone)\s+will\s+follow\s+you\b/i,
    /\b(?:i\s*(?:'ll|will)|we\s*(?:'ll|will))\s+(?:follow|boost|support)\s+you\b/i,
    /\b(?:active\s+on\s+x|say\s+yes|let'?s\s+connect|follow\s+everyone)\b/i,
    /\b(?:active\s+followers?|reply\s+here|reply\s+under\s+this|comment\s+under\s+this)\b/i,
    /\b(?:gain|follow|support|engagement)\s+train\b/i,
    /\b(?:verified\s*)?(?:follow|support)\s+chain\b/i,
    /\b(?:drop|share|post)\s+(?:your\s+)?(?:handle|@|account)\b/i,
    /\b(?:like|comment|reply)\b.{0,28}\b(?:rt|retweet|repost)\b.{0,28}\b(?:follow|support|active)\b/i,
    /\b(?:rt|retweet|repost)\b.{0,28}\b(?:like|comment|reply)\b.{0,28}\b(?:follow|support|active)\b/i,
    /\b(?:like|retweet|repost)\b.{0,60}\b(?:paid|payout|earn(?:ed|ing)?|follow|gain|support)\b/i,
    /\b(?:paid|payout|earn(?:ed|ing)?|follow|gain|support)\b.{0,60}\b(?:like|retweet|repost)\b/i,
    /\bfollow\s+each\s+other\b.{0,80}\b(?:gain|massive|grow|support|followers?)\b/i,
    /\b(?:under|below)\s+10\s*k\b.{0,90}\b(?:follow|support|reply|comment|drop|handle|active)\b/i,
    /\b(?:active|small)\s+accounts?\b.{0,90}\b(?:follow|support|reply|comment|drop|handle)\b/i,
    /\b(?:shadow\s*ban|shadowban|visibility|account\s+reach)\b.{0,100}\b(?:reply|comment|boost|engagement|followers?|blue\s*check|premium)\b/i,
    /\b(?:blue\s*check|verified|premium)\b.{0,80}\b(?:account|interaction|engagement|visibility|reply|support)\b/i,
    /\b(?:creator\s+revenue|x\s+payout|payout\s+is\s+coming|impression\s+farming)\b/i,
    /\bgr?owing\s+your\s+account\b/i,
    /\bgr?ow(?:ing)?\s+your\s+page\b/i,
    /\b(?:turn\s+)?notifications?\s+on\b.{0,90}\b(?:grow|page|followers?|reply|engagement)\b/i,
    /\b(?:need|want|looking\s+for)\s+(?:real\s+)?followers?\b/i,
    /\b(?:new|active|real)?\s*mutuals?\b/i,
    /\bgain\s+mutuals?\b/i,
    /\b(?:follow|like|repost|retweet)\s+(?:for|4)\s+(?:follow|like|repost|retweet)\b/i,
    /\bf(?:ollow)?\s*4\s*f(?:ollow)?\b/i,
    /\bl(?:ike)?\s*4\s*l(?:ike)?\b/i,
    /\br(?:epost|etweet)?\s*4\s*r(?:epost|etweet)?\b/i,
    /\b(?:follow|like)\s+(?:and\s+)?(?:repost|retweet)\b/i,
    /\b(?:repost|retweet)\s+(?:this|if|and)\b/i,
    /\bfollow\s*back\b/i,
    /\bfollow\s+me\b/i,
    /\bfollow\s*wave(?:\s+incoming)?\b/i,
    /\bneed\s+a\s+follow\b/i,
    /互[关關粉推]/u,
    /回[关關]/u,
    /(?:求|点|點)?[关關]注(?:我|一下)?/u,
    /(?:涨|漲)粉/u,
    /(?:推荐|推薦).{0,8}(?:关注|關注)/u,
    /(?:强烈|強烈)?(?:推荐|推薦).{0,12}(?:博主|账号|帳號|賬號|号|號)/u,
    /(?:以下|这(?:几|些)|這(?:幾|些)).{0,18}(?:博主|账号|帳號|賬號|号|號).{0,18}(?:关注|關注|推荐|推薦)/u,
    /(?:评论区|評論區).{0,8}(?:集合|互关|互關|增长|增長|蓝v|藍v)/iu,
    /(?:评论|評論|回复|回覆|留言).{0,10}(?:进群|進群|入群|加群|加入|社群|群组|群組)/u,
    /(?:限流|影子封禁|藍勾|蓝勾|蓝V|藍V).{0,30}(?:互動|互动|回复|回覆|曝光|可见|可見|账号|帳號)/iu,
    /(?:蓝v|藍v).{0,12}(?:增长|增長|公益)/iu,
    /(?:持续|持續).{0,8}(?:关注|關注).{0,28}(?:粉丝|粉絲|裂变|裂變)/u,
    /(?:0|零).{0,4}(?:到|至).{0,8}(?:万|萬|k)?(?:粉丝|粉絲)/u,
    /(?:\d+\s*(?:天|日)).{0,30}(?:涨粉|漲粉|粉丝|粉絲|曝光|变现|變現)/u,
    /(?:从|從|重新|重启|重啟).{0,18}(?:0|零).{0,12}(?:到|至|冲|衝).{0,12}(?:\d+\s*(?:k|K)|万|萬|十万|十萬)(?:粉|粉丝|粉絲)/u,
    /(?:X|x).{0,20}(?:收益|收入|分成|广告收益|廣告收益).{0,50}(?:暂停|暫停|停止|没了|沒了|归零|歸零|重启|重啟|重新).{0,40}(?:账号|帳號|粉|粉丝|粉絲)/u,
    /(?:百万|百萬|100万|100萬).{0,20}(?:曝光|阅读|閱讀|流量)/u,
    /(?:持币|持幣).{0,8}(?:裂变|裂變)/u,
    /(?:点|點).{0,3}(?:赞|讚).{0,6}(?:藏|收藏|更)/u,
    /(?:收|收个|收個).{0,3}藏/u,
    /(?:点赞|點讚|点讚|點赞).{0,6}(?:收藏|关注|關注)/u,
    /(?:帮|幫)?(?:转推|轉推|转发|轉發)/u,
    /扩列|擴列/u,
    /(?:フォロー|フォロバ|相互フォロー|フォロワー).{0,24}(?:増|募集|返|お願いします|して|伸ば)/u,
    /(?:リプ|コメント|反応).{0,16}(?:して|ください|くれたら|お願いします|で)/u,
    /(?:インプレッション|収益化|稼ぐ|万インプ|ペイデイ).{0,36}(?:フォロー|リプ|コメント|拡散|いいね)/u,
    /(?:팔로우|맞팔|선팔|팔로워|팔로우백|팔백).{0,24}(?:늘|증가|해주세요|합니다|해요|구해|좋아요|댓글|리트윗|알티|수익화|노출|맞팔)/u,
    /(?:댓글|답글|소통).{0,12}(?:남겨|달아|주세요|해주면|쓰면|해요)/u,
    /(?:수익화|노출|인상|페이데이|정산).{0,36}(?:팔로우|댓글|답글|리트윗|알티|좋아요)/u,
    /(?:주급|주간\s*수익|수익금|광고\s*수익|블루\s*수익|프리미엄\s*수익|x\s*수익|조회수\s*수익).{0,45}(?:인증|비교|감사|고맙|받았|정산|규칙|룰|블루|프리미엄|노출|조회수)/iu,
    /(?:조회수|노출|인상|댓글|답글).{0,35}(?:1000|1,000|천|만).{0,45}(?:수익|정산|인증|비교|감사|블루|프리미엄)/u
  ];
  const PROTOCOL_PROMO_TERMS = [
    "tvl", "mainnet", "testnet", "airdrop", "buyback", "liquidity premium", "liquidity",
    "staking", "yield", "token", "tge", "listing", "minting", "minted", "usdt",
    "btc", "bitcoin", "eth", "ethereum", "btc etf", "bitcoin etf", "blackrock",
    "morgan stanley", "institutional bull", "institutional adoption",
    "support", "resistance", "breakout",
    "price target", "long entry", "short entry", "next long", "next short",
    "stablecoin", "protocol", "defi", "web3 event", "backstop", "launch", "launched",
    "now supports", "support for", "is now supported", "available in", "deepseek v4",
    "opencode", "product update", "roadmap", "ecosystem", "claim", "chase up",
    "market maker", "exchange", "bybit", "okx", "binance", "kucoin", "bitget", "mexc",
    "event", "summit", "conference", "networking", "booth", "side event", "sponsor",
    "partnership", "campaign", "trading competition", "kol", "alpha call", "watchlist",
    "holder count", "holder counts", "holders", "holder growth", "wallet growth",
    "addresses", "active addresses", "user growth", "bnb alpha", "alpha growth",
    "passport", "agent passport", "early access", "early experience", "private beta",
    "closed beta", "beta access", "waitlist", "sign up", "register now", "join beta",
    "join the waitlist", "invite code", "try it now", "limited spots", "cta",
    "quota", "credits", "free credits", "ai quota", "product quota", "kol campaign",
    "kol touchpoint", "influencer campaign", "creator campaign", "market automation",
    "trading bot", "trading subscription", "paid signal", "signal group",
    "catch early", "early coins", "early coin", "early gems", "gem finder", "open source crypto",
    "xchat", "x chat", "web3 community", "creator community", "join our group", "group chat",
    "comment to join", "reply to join", "join group", "join community",
    "whale buy", "whale-buy", "whale bought", "whale accumulation", "platform token",
    "worth buying", "best token to buy", "which token", "which are worth buying",
    "100x", "1000x", "10x", "x100", "x1000", "moonshot", "pump", "pumping",
    "next 100x", "next 1000x", "gem call", "hidden gem", "degen", "bullish",
    "meme wealth", "wealth effect", "money printer", "trenches", "degen trenches",
    "meme coin", "memecoin", "generational wealth", "life changing money",
    "bull market", "bull run", "asteroid",
    "support resistance", "support/resistance", "resistance support", "price target",
    "inflection point", "staking yield", "staking rewards", "eth staking",
    "追高", "回购", "回購", "流动性", "流動性", "溢价", "溢價", "协议", "協議",
    "主网", "主網", "测试网", "測試網", "空投", "上币", "上幣", "代币", "代幣",
    "交易所", "做市", "做市商", "大会", "大會", "峰会", "峰會", "路演", "生态活动", "生態活動",
    "百倍", "千倍", "暴涨", "暴漲", "起飞", "起飛", "冲月", "衝月", "土狗", "喊单", "喊單"
  ];
  const PROTOCOL_PROMO_PATTERNS = [
    /\b(?:now\s+supports|support\s+for|is\s+now\s+supported|available\s+in|launch(?:ed|ing)?|announc(?:e|ed|ement))\b.{0,90}\b(?:model|api|product|opencode|protocol|mainnet|token|deepseek|defi)\b/i,
    /\b(?:tvl|liquidity|buyback|airdrop|staking|yield|mainnet|testnet|mint(?:ed|ing)?|stablecoin|usdt)\b.{0,90}\b(?:protocol|token|defi|web3|launch|narrative|premium|growth)\b/i,
    /\b(?:protocol|defi|web3)\b.{0,90}\b(?:tvl|backstop|mainnet|launch|airdrop|liquidity|token|mint(?:ed|ing)?)\b/i,
    /\b(?:web3|crypto|exchange|bybit|okx|binance|kucoin|bitget|mexc)\b.{0,120}\b(?:event|summit|conference|networking|booth|sponsor|partner|campaign|promo|airdrop|listing|strategy)\b/i,
    /\b(?:web3|crypto|x\s*chat|xchat|creator)\b.{0,120}\b(?:community|group|chat|invite|join|network|circle|club)\b/i,
    /\b(?:join|invite|build|grow)\b.{0,120}\b(?:web3|crypto|x\s*chat|xchat|creator)\b.{0,80}\b(?:community|group|chat|network|circle|club)\b/i,
    /\b(?:comment|reply|dm)\b.{0,60}\b(?:join|invite|group|community|chat|signal)\b.{0,80}\b(?:crypto|web3|trading|alpha)?\b/i,
    /\b(?:crypto|web3|trading|alpha)\b.{0,80}\b(?:comment|reply|dm)\b.{0,60}\b(?:join|invite|group|community|chat|signal)\b/i,
    /\b(?:market\s+maker|institutional|liquidity\s+provider)\b.{0,100}\b(?:crypto|exchange|token|web3|event|strategy|promo|partnership)\b/i,
    /\b(?:early|private|closed)?\s*(?:beta|access|experience)\b.{0,110}\b(?:passport|agent|product|app|launch|waitlist|sign\s*up|register|invite|cta)\b/i,
    /\b(?:ai|model|product|app|tool)\b.{0,100}\b(?:quota|credits?|free\s+credits?|kol|campaign|touchpoint|invite|limited\s+spots?)\b/i,
    /\b(?:quota|credits?|free\s+credits?|kol|campaign|touchpoint|invite|limited\s+spots?)\b.{0,100}\b(?:ai|model|product|app|tool)\b/i,
    /\b(?:passport|agent\s+passport|payment\s+product)\b.{0,110}\b(?:early|beta|access|experience|waitlist|sign\s*up|register|invite|try)\b/i,
    /\b(?:10|100|1000)\s*x\b.{0,90}\b(?:eth|btc|crypto|coin|token|altcoin|memecoin|pump|moon|bullish|gem)\b/i,
    /\b(?:eth|btc|crypto|coin|token|altcoin|memecoin)\b.{0,90}\b(?:10|100|1000)\s*x\b/i,
    /\b(?:bnb|alpha|token|crypto|coin)\b.{0,100}\b(?:holders?|holder\s+counts?|wallets?|addresses?|users?)\b.{0,90}\b(?:growth|grew|increase|increased|surpass(?:ed)?|reach(?:ed)?|hit|record)\b/i,
    /\b(?:holders?|holder\s+counts?|wallets?|addresses?|users?)\b.{0,100}\b(?:bnb|alpha|token|crypto|coin)\b.{0,90}\b(?:growth|grew|increase|increased|surpass(?:ed)?|reach(?:ed)?|hit|record)\b/i,
    /\b(?:bnb|alpha)\b.{0,80}\b(?:growth|airdrop|points?|holders?|wallets?|users?|addresses?)\b/i,
    /\b(?:bnb|eth|btc|crypto|coin|token|memecoin|meme)\b.{0,100}\b(?:wealth\s+effect|money\s+printer|generational\s+wealth|life\s+changing|rich|millionaire|profit|gains?|bags?)\b/i,
    /\b(?:wealth\s+effect|money\s+printer|generational\s+wealth|life\s+changing|rich|millionaire|profit|gains?|bags?)\b.{0,100}\b(?:bnb|eth|btc|crypto|coin|token|memecoin|meme)\b/i,
    /\b(?:eth|crypto|degen)\s+trenches\b.{0,100}\b(?:product|thesis|trade|alpha|launch|token|coin|profit|narrative)\b/i,
    /\b(?:market|trading|crypto|token|ai)\b.{0,100}\b(?:automation|bot|subscription|paid\s+signal|signal\s+group|copy\s+trade)\b/i,
    /\b(?:automation|bot|subscription|paid\s+signal|signal\s+group|copy\s+trade)\b.{0,100}\b(?:market|trading|crypto|token|ai)\b/i,
    /\b(?:eth|btc|crypto|token|coin|asteroid|altcoin|memecoin)\b.{0,100}\b(?:whale\s*(?:buy|bought|accumulation)|worth\s+buying|which\s+(?:are|is).{0,30}buying|bull\s*(?:market|run)|pump(?:ed)?)\b/i,
    /\b(?:whale\s*(?:buy|bought|accumulation)|worth\s+buying|which\s+(?:are|is).{0,30}buying|bull\s*(?:market|run)|pump(?:ed)?)\b.{0,100}\b(?:eth|btc|crypto|token|coin|asteroid|altcoin|memecoin)\b/i,
    /\b\d+(?:\.\d+)?\s*%\b.{0,80}\b(?:pump|gain|profit|bull|market|token|coin|crypto)\b/i,
    /\$\s*\d+(?:[.,]\d+)?\s*(?:to|->|→|-)\s*\$\s*\d+(?:[.,]\d+)?\b.{0,100}\b(?:pump|gain|profit|bull|market|token|coin|crypto)\b/i,
    /\b(?:open\s*source|github|tool|scanner|tracker)\b.{0,120}\b(?:catch|find|discover|spot)\b.{0,80}\b(?:early|new)\b.{0,40}\b(?:coins?|tokens?|gems?|crypto)\b/i,
    /\b(?:catch|find|discover|spot)\b.{0,80}\b(?:early|new)\b.{0,40}\b(?:coins?|tokens?|gems?|crypto)\b.{0,120}\b(?:open\s*source|github|tool|scanner|tracker)\b/i,
    /\b(?:btc|bitcoin|crypto|web3)\b.{0,120}\b(?:industry|belief|conviction|future|faith|thesis)\b.{0,100}\b(?:early|cycle|rich|wealth|win|profit|millionaire)\b/i,
    /\b(?:btc|bitcoin|eth|ethereum)\b.{0,100}\b(?:support|resistance|breakout|price\s+target|long|short|entry|exit)\b/i,
    /\b(?:btc|bitcoin|crypto)\b.{0,120}\b(?:etf|blackrock|morgan\s+stanley|institutional|wall\s*street)\b.{0,120}\b(?:bull|market|buy|inflow|adoption|accumulation|narrative)\b/i,
    /\b(?:etf|blackrock|morgan\s+stanley|institutional|wall\s*street)\b.{0,120}\b(?:btc|bitcoin|crypto)\b.{0,120}\b(?:bull|market|buy|inflow|adoption|accumulation|narrative)\b/i,
    /\b(?:support|resistance|breakout|price\s+target|long|short|entry|exit)\b.{0,100}\b(?:btc|bitcoin|eth|ethereum)\b/i,
    /\b(?:eth|ethereum)\b.{0,100}\b(?:staking|inflection\s+point|yield|rewards?|apr|apy)\b/i,
    /\b(?:staking|inflection\s+point|yield|rewards?|apr|apy)\b.{0,100}\b(?:eth|ethereum)\b/i,
    /\b(?:next|easy|minimum|potential)\s+(?:10|100|1000)\s*x\b/i,
    /(?:#\s*PR\b|#PR\b|\bPR\s*[:：])/i,
    /\$[A-Za-z]{2,10}(?:\s*[\/,|+]\s*\$?[A-Za-z]{2,10}){1,}/,
    /(?:百倍|千倍|暴涨|暴漲|起飞|起飛|冲月|衝月|喊单|喊單).{0,60}(?:币|幣|代币|代幣|ETH|BTC|土狗|合约|合約)/iu,
    /(?:回购|回購|流动性|流動性|溢价|溢價|TVL|tvl).{0,60}(?:代币|代幣|协议|協議|项目|項目|上币|上幣)/u,
    /(?:交易所|做市商|Web3|web3|峰会|峰會|大会|大會).{0,70}(?:活动|活動|路演|酒会|酒會|合作|赞助|贊助|上币|上幣|生态|生態)/u
  ];
  const RISKY_CONTENT_TERMS = [
    "去世", "死亡", "死了", "没救过来", "沒救過來", "身亡", "遇难", "遇難", "葬礼", "葬禮",
    "包养", "包養", "私生活", "性化", "开房", "開房", "前男友", "前女友", "出轨", "出軌",
    "实名开麦", "實名開麥", "黄一鸣", "黃一鳴", "nsfw", "onlyfans", "sexy", "bikini",
    "ai girl", "ai girlfriend", "image prompt", "prompt share", "美女图", "美女圖", "擦边", "擦邊",
    "爆乳", "水着", "グラビア", "섹시", "야짤",
    "insult", "insult ai", "roast ai", "fight", "brawl", "beef", "drama", "conflict", "clash", "slammed",
    "reward challenge", "challenge reward", "prize challenge", "winner gets", "win reward",
    "heated argument", "conference incident", "冲突", "衝突", "吵架", "互骂", "互罵",
    "辱骂", "辱罵", "骂战", "罵戰", "撕逼", "打架", "羞辱",
    "payment freeze", "payment frozen", "cash-out", "cash out", "withdrawal", "withdraw",
    "off-ramp", "off ramp", "otc", "bank freeze", "bank frozen", "frozen card",
    "exchange withdrawal", "exchange withdraw", "card frozen",
    "支付宝冻结", "支付寶凍結", "银行卡冻结", "銀行卡凍結", "冻卡", "凍卡",
    "提现", "提現", "出金", "入金", "法币出金", "法幣出金", "交易所提现", "交易所提現",
    "交易所出金", "场外", "場外", "跑分", "洗钱", "洗錢"
  ];
  const RISKY_CONTENT_PATTERNS = [
    /(?:没|沒)救.{0,6}(?:去世|死亡|死了)/u,
    /(?:已经|已經).{0,6}(?:去世|死亡|身亡)/u,
    /(?:包养|包養|私生活|性化|开房|開房|出轨|出軌).{0,40}(?:前男友|前女友|实名|實名|交往|爆料)/u,
    /(?:prompt|提示词|提示詞|プロンプト).{0,60}(?:sexy|bikini|nsfw|美女|水着|爆乳|擦边|擦邊)/iu,
    /(?:sexy|bikini|nsfw|onlyfans|美女|水着|爆乳|擦边|擦邊).{0,60}(?:prompt|提示词|提示詞|プロンプト|ai\s*image)/iu,
    /\b(?:conference|event|panel|summit|meeting)\b.{0,90}\b(?:insult|fight|brawl|clash|argument|drama|heated|called\s+out|slammed)\b/i,
    /\b(?:insult|fight|brawl|clash|argument|drama|heated|called\s+out|slammed)\b.{0,90}\b(?:conference|event|panel|summit|meeting)\b/i,
    /\b(?:insult|roast|attack|bully)\b.{0,80}\b(?:ai|bot|gpt|model)\b.{0,80}\b(?:reward|challenge|prize|winner|reply|comment)\b/i,
    /\b(?:reward|challenge|prize|winner)\b.{0,80}\b(?:insult|roast|attack|bully)\b.{0,80}\b(?:ai|bot|gpt|model)\b/i,
    /(?:会议|會議|大会|大會|峰会|峰會|活动|活動|现场|現場).{0,50}(?:冲突|衝突|吵架|互骂|互罵|辱骂|辱罵|骂战|罵戰|打架|羞辱)/u,
    /\b(?:payment|bank|card|account|alipay|exchange|otc)\b.{0,90}\b(?:freez(?:e|ing|en)|withdraw(?:al)?|cash[-\s]?out|off[-\s]?ramp|frozen)\b/i,
    /\b(?:freez(?:e|ing|en)|withdraw(?:al)?|cash[-\s]?out|off[-\s]?ramp|frozen)\b.{0,90}\b(?:payment|bank|card|account|alipay|exchange|otc)\b/i,
    /(?:支付宝|支付寶|银行卡|銀行卡|银行账户|銀行賬戶|账户|賬戶|交易所|币安|幣安|欧易|歐易|OKX|otc|OTC|场外|場外).{0,50}(?:冻结|凍結|冻卡|凍卡|提现|提現|出金|入金|转账|轉賬|跑分|洗钱|洗錢)/u,
    /(?:冻结|凍結|冻卡|凍卡|提现|提現|出金|入金|跑分|洗钱|洗錢).{0,50}(?:支付宝|支付寶|银行卡|銀行卡|银行账户|銀行賬戶|账户|賬戶|交易所|币安|幣安|欧易|歐易|OKX|otc|OTC|场外|場外)/u,
    /(?:出金|提现|提現).{0,40}(?:被拒|失败|失敗|不到账|不到賬|冻|凍|卡|风控|風控)/u
  ];
  const MIRACLE_CLAIM_PATTERNS = [
    /\b(?:god|jesus|lord|prayer|miracle|blessed)\b.{0,120}\b(?:healed|cured|cancer|surgery|hospital|medical|debt|bills?|paid\s*off|paid)\b/i,
    /\b(?:healed|cured|cancer|surgery|hospital|medical|debt|bills?|paid\s*off|paid)\b.{0,120}\b(?:god|jesus|lord|prayer|miracle|blessed)\b/i
  ];
  const GEOPOLITICAL_LOW_INFO_PATTERNS = [
    /\b(?:russia|russian|china|chinese|america|american|europe|uae|dubai)\b.{0,120}\b(?:wealth|rich|millionaires?|billionaires?|migration|migrate|moved?|leaving|escape)\b/i,
    /\b(?:wealth|rich|millionaires?|billionaires?|migration|migrate|moved?|leaving|escape)\b.{0,120}\b(?:russia|russian|china|chinese|america|american|europe|uae|dubai)\b/i,
    /(?:俄罗斯|俄羅斯|中国|中國|美国|美國|欧洲|歐洲|迪拜|阿联酋|阿聯酋).{0,60}(?:富人|有钱人|有錢人|财富|財富|移民|润|潤|外逃|逃离|逃離)/u
  ];
  const GENERIC_SHORT_POST_TERMS = [
    "good news", "great news", "big day", "keep going", "never give up", "stay strong",
    "believe in yourself", "trust the process", "one day", "soon", "blessed",
    "grateful", "thank god", "god did", "god is good", "after all my millions",
    "my millions", "miracle", "debt free",
    "healed", "healing miracle", "medical debt", "gm", "gn", "vibes", "facts", "real talk",
    "好消息", "坚持", "堅持", "加油", "冲", "衝", "稳了", "穩了", "太好了",
    "やった", "最高", "頑張る", "おはよう", "おやすみ",
    "좋은 소식", "화이팅", "가즈아"
  ];
  const RELATIONSHIP_BAIT_TERMS = [
    "single", "relationship", "girlfriend", "boyfriend", "wife", "husband", "marry me",
    "dating", "love me", "need love", "need a girl", "need a man", "my crush",
    "i love you", "love u", "miss you", "kiss me", "hug me",
    "女朋友", "男朋友", "老婆", "老公", "单身", "單身", "恋爱", "戀愛", "结婚", "結婚",
    "彼女", "彼氏", "結婚", "恋人", "独身",
    "여친", "남친", "연애", "결혼", "솔로"
  ];
  const SOCIAL_GROWTH_FLEX_TERMS = [
    "impressions", "impression", "views", "view count", "reach", "profile visits",
    "followers", "follower count", "notifications", "engagement", "analytics",
    "payout", "paid out", "got paid", "payment received", "creator payout",
    "creator revenue", "ad revenue", "ads revenue", "revenue share", "revenue sharing",
    "x payout", "x revenue", "x earnings", "x payday", "x monetization", "monetization payout",
    "minimum payout", "minimum payment", "earnings minimum", "payout threshold",
    "back pay", "backpay", "retro pay", "retroactive pay", "payday",
    "展示量", "浏览量", "瀏覽量", "曝光", "阅读量", "閱讀量", "主页访问", "主頁訪問", "账号可见度", "帳號可見度",
    "收益", "收益额", "收益額", "收入", "广告收益", "廣告收益", "分成", "到账", "到賬", "打款", "暂停收益", "暫停收益", "收益暂停", "收益暫停",
    "インプレッション", "表示回数", "閲覧数", "フォロワー", "収益", "収益化",
    "広告収益", "振込", "入金", "支払い", "支払", "ペイアウト",
    "노출", "조회수", "팔로워", "수익", "수익금", "정산", "주급", "주간 수익",
    "광고 수익", "블루 수익", "프리미엄 수익"
  ];
  const SOCIAL_GROWTH_FLEX_PATTERNS = [
    /\b\d+(?:[.,]\d+)?\+?\s*[kmb]?\s+(?:impressions?|views?|followers?|profile\s+visits?|engagements?)\b.{0,100}\b(?:grow|growth|page|account|notifications?|moneti[sz]e|payday|flex|hit|reached|crossed)\b/i,
    /\b(?:hit|reached|crossed|got|made)\s+\d+(?:[.,]\d+)?\+?\s*[kmb]?\s+(?:impressions?|views?|followers?|profile\s+visits?|engagements?)\b/i,
    /\b(?:impressions?|views?|followers?|profile\s+visits?|engagements?)\b.{0,80}\b(?:grow|growth|page|account|notifications?|moneti[sz]e|payday|flex|hit|reached|crossed)\b/i,
    /\b(?:x|creator|ad|ads)?\s*(?:payout|revenue|moneti[sz]ation|payment)\b.{0,90}\b(?:received|got|paid|arrived|hit|works?|proof|thanks?|donat(?:e|ion)|charity)\b/i,
    /\b(?:salary|income|net\s*worth|asset|assets)\b.{0,100}\b(?:comparison|compare|vs|versus|anxiety|rich|poor|wealth)\b/i,
    /\b(?:comparison|compare|vs|versus|anxiety|rich|poor|wealth)\b.{0,100}\b(?:salary|income|net\s*worth|asset|assets)\b/i,
    /\b(?:received|got|paid|arrived|hit|works?|proof|thanks?)\b.{0,90}\b(?:x|creator|ad|ads)?\s*(?:payout|revenue|moneti[sz]ation|payment)\b/i,
    /\b(?:back\s*pay|backpay|retro(?:active)?\s*pay|payday)\b.{0,90}\b(?:x|creator|revenue|payout|moneti[sz]ation|paid|payment)\b/i,
    /\b(?:x|creator|revenue|payout|moneti[sz]ation|paid|payment)\b.{0,90}\b(?:back\s*pay|backpay|retro(?:active)?\s*pay|payday)\b/i,
    /\b(?:x|creator|ad|ads)?\s*(?:earnings?|payout|revenue|payment)\b.{0,90}\b(?:minimum|threshold|eligible|requirement|withdraw)\b/i,
    /\b(?:minimum|threshold|eligible|requirement|withdraw)\b.{0,90}\b(?:x|creator|ad|ads)?\s*(?:earnings?|payout|revenue|payment)\b/i,
    /\b(?:x\s*)?payday\b.{0,90}\b(?:earn(?:ed|ing)?|money|paid|payout|revenue|creator|premium)\b/i,
    /\b(?:earn(?:ed|ing)?|money|paid|payout|revenue|creator|premium)\b.{0,90}\b(?:x\s*)?payday\b/i,
    /(?:\d+(?:\.\d+)?\s*(?:万|萬|亿|億)?).{0,12}(?:展示量|浏览量|瀏覽量|曝光|阅读量|閱讀量|粉丝|粉絲).{0,50}(?:增长|增長|账号|帳號|賬號|变现|變現|收益|炫耀|突破)/u,
    /(?:展示量|浏览量|瀏覽量|曝光|阅读量|閱讀量|粉丝|粉絲|收益|分成|打款|到账|到賬).{0,50}(?:增长|增長|账号|帳號|賬號|变现|變現|收益|炫耀|突破|收到|来了|來了|捐)/u,
    /(?:工资|工資|薪资|薪資|收入|资产|資產|存款).{0,50}(?:对比|對比|比较|比較|焦虑|焦慮|财富|財富|有钱|有錢)/u,
    /(?:X|x).{0,20}(?:收益|收入|分成|广告收益|廣告收益).{0,60}(?:暂停|暫停|停止|没了|沒了|不到账|不到賬|重启|重啟|重新).{0,50}(?:账号|帳號|粉丝|粉絲|万粉|萬粉)/u,
    /(?:重启|重啟|重新).{0,30}(?:账号|帳號).{0,50}(?:万粉|萬粉|粉丝|粉絲|收益|收入|分成)/u,
    /(?:インプレッション|表示回数|閲覧数|フォロワー|収益|広告収益|振込|入金|支払い|支払|ペイアウト).{0,55}(?:伸び|収益|突破|増え|来た|きた|届い|ありがとう|寄付|記録|最高)/u,
    /(?:X|x).{0,16}(?:収益|広告収益|振込|入金|支払い|ペイアウト).{0,55}(?:来た|きた|届い|ありがとう|寄付|記録|最高)/u,
    /(?:X|x).{0,18}(?:収益|広告収益|支払い|ペイアウト|収益化).{0,70}(?:停止|止ま|解除|復活|戻っ|戻り|次回|利益|稼げ|稼ぐ)/u,
    /(?:収益|広告収益|支払い|ペイアウト|収益化).{0,70}(?:停止|止ま|解除|復活|戻っ|戻り|次回|利益|稼げ|稼ぐ)/u,
    /(?:노출|조회수|팔로워).{0,45}(?:수익|증가|돌파|늘)/u,
    /(?:주급|주간\s*수익|수익금|광고\s*수익|블루\s*수익|프리미엄\s*수익|x\s*수익|조회수\s*수익|정산).{0,55}(?:인증|비교|감사|고맙|받았|규칙|룰|블루|프리미엄|노출|조회수)/iu,
    /(?:댓글|답글|리플|reply|replies).{0,18}(?:1000|1,000|천).{0,45}(?:달성|돌파|수익|정산|인증|참여|감사)/iu
  ];
  const POLITICAL_HANDLE_TERMS = [
    "senator", "governor", "mayor", "president", "vicepresident", "officeof", "potus",
    "flotus", "whitehouse", "minister", "premier", "chancellor", "congress", "parliament",
    "assembly", "lawmaker", "candidate", "campaign", "secretary", "council", "mpfor",
    "narendramodi", "modi", "realdonaldtrump", "donaldtrump", "trump", "joebiden",
    "biden", "barackobama", "obama", "netanyahu", "zelensky", "putin",
    "bricsinfo", "brics", "hhshkmohd", "sheikh", "royal", "crownprince",
    "市长", "市長", "州长", "州長", "总统", "總統", "首相", "总理", "總理", "议员", "議員", "部长", "部長"
  ];
  const POLITICAL_NAME_TERMS = [
    "senator", "governor", "mayor", "president", "vice president", "prime minister",
    "member of parliament", "parliament member", "congressman", "congresswoman",
    "representative", "assemblymember", "councilmember", "foreign minister",
    "secretary of state", "cabinet minister", "candidate", "president-elect", "premier",
    "chancellor", "narendra modi", "modi", "donald trump", "trump", "joe biden", "biden",
    "barack obama", "obama", "benjamin netanyahu", "netanyahu", "volodymyr zelensky", "zelensky", "putin",
    "brics", "sheikh", "royal court", "crown prince", "vice president of the uae",
    "总书记", "總書記", "总书记", "主席", "总统", "總統", "副总统", "副總統",
    "首相", "总理", "總理", "议员", "議員", "市长", "市長", "州长", "州長", "部长", "部長",
    "国会议员", "國會議員", "立法委员", "立法委員", "特朗普", "川普", "拜登", "奥巴马", "奧巴馬", "莫迪", "普京"
  ];
  const POLITICAL_TEXT_TERMS = [
    "campaign rally", "re-election", "reelection", "vote for", "ballot", "constituents",
    "town hall", "policy agenda", "my administration", "executive order", "legislation",
    "parliament", "senate", "congress", "cabinet", "public office", "working families",
    "campaign trail", "election day", "donald trump", "trump", "narendra modi", "modi", "joe biden",
    "biden", "putin", "zelensky", "netanyahu", "选举", "選舉", "竞选", "競選", "投票", "选民", "選民",
    "国会", "國會", "议会", "議會", "施政", "政策声明", "政策聲明", "内阁", "內閣"
    , "brics", "sanctions", "geopolitical", "diplomatic", "white house", "iran talks",
    "iran nuclear", "ceasefire talks", "uae", "crown prince", "royal court",
    "特朗普", "川普", "拜登", "奥巴马", "奧巴馬", "莫迪", "普京"
  ];
  const GENERIC_MEDIA_ALT_PATTERNS = [
    /^(image|photo|picture|video|gif|embedded video|embedded image)$/i,
    /^(image may contain|may be an image of|may contain)/i,
    /^(图片|圖片|照片|相片|图像|圖像|视频|視頻|影片|gif)$/i
  ];
  const SOURCE_SURFACE_BONUSES = {
    "for-you": 12,
    following: 8,
    search: 5,
    notifications: 3,
    thread: 1,
    profile: 0,
    unknown: 0
  };
  const SOURCE_SURFACE_LABELS = {
    "for-you": "For You feed",
    following: "Following feed",
    search: "Search surface",
    notifications: "Notifications",
    thread: "Thread page",
    profile: "Profile page",
    unknown: "Unknown surface"
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function normalizeSourceSurface(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) {
      return "unknown";
    }
    if (raw === "for-you" || raw === "foryou" || raw === "for_you") {
      return "for-you";
    }
    if (raw === "following" || raw === "follow") {
      return "following";
    }
    if (raw === "search" || raw === "explore") {
      return "search";
    }
    if (raw === "notifications" || raw === "notification") {
      return "notifications";
    }
    if (raw === "thread" || raw === "status") {
      return "thread";
    }
    if (raw === "profile") {
      return "profile";
    }
    return "unknown";
  }

  function getSourceSurfaceLabel(surface) {
    return SOURCE_SURFACE_LABELS[normalizeSourceSurface(surface)] || SOURCE_SURFACE_LABELS.unknown;
  }

  function computeSourceSurfaceSignal(tweet) {
    const surface = normalizeSourceSurface(tweet?.sourceSurface);
    const amount = SOURCE_SURFACE_BONUSES[surface] ?? 0;
    return {
      surface,
      amount,
      label: getSourceSurfaceLabel(surface)
    };
  }

  function normalizeVerificationType(value, fallback = "") {
    const raw = String(value || fallback).trim().toLowerCase();
    if (!raw) {
      return "";
    }

    if (
      raw === "government" ||
      raw === "gray" ||
      raw === "grey" ||
      raw.includes("government") ||
      raw.includes("state-affiliated") ||
      raw.includes("state affiliated") ||
      raw.includes("multilateral") ||
      raw.includes("gov account") ||
      raw.includes("government account") ||
      raw.includes("灰标") ||
      raw.includes("灰標") ||
      raw.includes("政府") ||
      raw.includes("官方机构") ||
      raw.includes("官方機構")
    ) {
      return "government";
    }

    if (
      raw === "gold" ||
      raw === "organization" ||
      raw === "organisation" ||
      raw === "business" ||
      raw.includes("gold") ||
      raw.includes("organization") ||
      raw.includes("organisation") ||
      raw.includes("business") ||
      raw.includes("brand") ||
      raw.includes("company") ||
      raw.includes("企业") ||
      raw.includes("企業") ||
      raw.includes("品牌") ||
      raw.includes("机构") ||
      raw.includes("機構") ||
      raw.includes("组织") ||
      raw.includes("組織") ||
      raw.includes("金标") ||
      raw.includes("金標")
    ) {
      return "gold";
    }

    if (
      raw === "blue" ||
      raw === "verified" ||
      raw.includes("blue") ||
      raw.includes("verified") ||
      raw.includes("premium") ||
      raw.includes("blue check") ||
      raw.includes("已认证") ||
      raw.includes("已認證") ||
      raw.includes("蓝标") ||
      raw.includes("藍標") ||
      raw.includes("认证") ||
      raw.includes("認證")
    ) {
      return "blue";
    }

    return "";
  }

  function parseCount(value) {
    if (value == null) {
      return null;
    }

    const raw = String(value).replace(/\s+/g, " ").trim();
    if (!raw) {
      return null;
    }

    const normalized = raw.replace(/,/g, "");
    const match = normalized.match(COUNT_TOKEN_RE);
    if (!match) {
      return null;
    }

    let amount = Number.parseFloat(match[1].replace(/,/g, ""));
    if (!Number.isFinite(amount)) {
      return null;
    }

    const unit = match[2] || "";
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit === "k") amount *= 1e3;
    if (lowerUnit === "m") amount *= 1e6;
    if (lowerUnit === "b") amount *= 1e9;
    if (unit === "千") amount *= 1e3;
    if (unit === "万" || unit === "萬") amount *= 1e4;
    if (unit === "亿" || unit === "億") amount *= 1e8;

    return Math.round(amount);
  }

  function normalizeLog(value, maxBase, weight) {
    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }
    return clamp(Math.log10(value + 1) / maxBase, 0, 1) * weight;
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeSemanticText(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/[‘’‛]/g, "'")
      .replace(/[“”„]/g, "\"")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeBaitText(value) {
    return normalizeSemanticText(value)
      .replace(/[⓪０]/g, "0")
      .replace(/[①１]/g, "1")
      .replace(/[③３]/g, "3")
      .replace(/[④４]/g, "4")
      .replace(/[⑤５]/g, "5")
      .replace(/[⑦７]/g, "7")
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t");
  }

  function countTermMatches(text, terms = []) {
    const normalized = normalizeText(text);
    if (!normalized) {
      return 0;
    }

    return terms.reduce((count, term) => (
      normalized.includes(normalizeText(term)) ? count + 1 : count
    ), 0);
  }

  function countRegexMatches(text, patterns = []) {
    const source = String(text || "");
    if (!source) {
      return 0;
    }

    return patterns.reduce((count, pattern) => (
      pattern instanceof RegExp && pattern.test(source) ? count + 1 : count
    ), 0);
  }

  function countSemanticTokens(text) {
    return normalizeSemanticText(text)
      .split(/[\s,.;:!?/\\|()[\]{}"'`~<>，。！？、]+/)
      .filter(Boolean)
      .length;
  }

  function countDefaultTopicMatches(text) {
    return TOPIC_DEFS.reduce((count, topic) => count + countTermMatches(text, topic.defaults || []), 0);
  }

  function isMeaningfulMediaAltText(value) {
    const normalized = normalizeSemanticText(value);
    if (!normalized) {
      return false;
    }

    const tokenCount = countSemanticTokens(normalized);
    if (
      GENERIC_MEDIA_ALT_PATTERNS.some((pattern) => pattern.test(normalized)) &&
      (normalized.length < 48 || tokenCount <= 6)
    ) {
      return false;
    }

    return normalized.length >= 16 || tokenCount >= 4;
  }

  function getSemanticText(tweet) {
    const text = normalizeSemanticText(tweet?.text);
    const altText = isMeaningfulMediaAltText(tweet?.mediaAltText) ? normalizeSemanticText(tweet.mediaAltText) : "";
    if (!text) {
      return altText;
    }
    if (!altText) {
      return text;
    }

    const lowerText = text.toLowerCase();
    const lowerAlt = altText.toLowerCase();
    if (lowerText.includes(lowerAlt)) {
      return text;
    }
    if (lowerAlt.includes(lowerText)) {
      return altText;
    }
    return `${text}\n${altText}`;
  }

  function getMediaSemanticContext(tweet) {
    const mediaKind = String(tweet?.mediaKind || "").trim().toLowerCase();
    const hasMedia = Boolean(tweet?.hasMedia || (mediaKind && mediaKind !== "text"));
    const text = normalizeSemanticText(tweet?.text);
    const altText = normalizeSemanticText(tweet?.mediaAltText);
    const altMeaningful = isMeaningfulMediaAltText(altText);
    const semanticText = getSemanticText(tweet);

    let textContextFit = clamp(Math.max(text.length / 118, countSemanticTokens(text) / 18), 0, 1);
    if (/[?？]/.test(text) && text.length >= 18) {
      textContextFit = clamp(textContextFit + 0.08, 0, 1);
    }

    const altContextFit = altMeaningful
      ? clamp(Math.max(altText.length / 96, countSemanticTokens(altText) / 16), 0.35, 1)
      : 0;
    const semanticContextFit = clamp(
      Math.max(
        textContextFit,
        altContextFit,
        Math.max(semanticText.length / 132, countSemanticTokens(semanticText) / 20) * 0.82
      ),
      0,
      1
    );
    const pureMediaFit = hasMedia ? clamp((42 - text.length) / 42, 0, 1) : 0;
    const lowConfidence = hasMedia && pureMediaFit > 0.12 && semanticContextFit < 0.42;

    return {
      hasMedia,
      text,
      altText,
      altMeaningful,
      semanticText,
      semanticContextFit,
      pureMediaFit,
      lowConfidence
    };
  }

  function computeUnderstandingConfidence(tweet, mediaSemanticContext) {
    const semanticText = normalizeSemanticText(mediaSemanticContext?.semanticText || tweet?.text || "");
    const semanticTokens = countSemanticTokens(semanticText);

    if (!mediaSemanticContext?.hasMedia) {
      const textFit = clamp(
        Math.max(
          semanticText.length / 132,
          semanticTokens / 20,
          semanticText ? 0.58 : 0.32
        ),
        semanticText ? 0.58 : 0.22,
        1
      );
      return Math.round(textFit * 100);
    }

    const semanticFit = clamp(mediaSemanticContext.semanticContextFit || 0, 0, 1);
    const altFit = mediaSemanticContext.altMeaningful ? 1 : 0;
    const textSupport = semanticTokens >= 5 ? 0.08 : semanticTokens >= 3 ? 0.04 : 0;
    const purePenalty = clamp((mediaSemanticContext.pureMediaFit || 0) * (mediaSemanticContext.lowConfidence ? 0.58 : 0.22), 0, 0.62);
    const fit = clamp(
      0.14 +
      semanticFit * 0.62 +
      altFit * 0.14 +
      textSupport -
      purePenalty,
      0.08,
      1
    );
    return Math.round(fit * 100);
  }

  function computeAuthorFit(tweet, matchedTopics, matchedLanguages) {
    const topicBonusTotal = matchedTopics.reduce((sum, topic) => sum + Number(topic?.bonus || 0), 0);
    const languageBonusTotal = matchedLanguages.reduce((sum, language) => sum + Number(language?.bonus || 0), 0);
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    const verifiedBonus = verificationType === "blue"
      ? 0.06
      : (verificationType ? 0 : (tweet?.authorVerified ? 0.03 : 0));
    const fit = clamp(
      0.18 +
      clamp(topicBonusTotal / 16, 0, 1) * 0.46 +
      clamp(languageBonusTotal / 8, 0, 1) * 0.26 +
      verifiedBonus +
      (topicBonusTotal > 0 && languageBonusTotal > 0 ? 0.06 : 0),
      0,
      1
    );
    return Math.round(fit * 100);
  }

  function computePostScore({
    metricPoints = 0,
    recency = 0,
    accelerationWindowBonus = 0,
    trafficMomentumBonus = 0,
    conversationBonus = 0,
    mediaBonusPoints = 0,
    topicBonusTotal = 0
  }) {
    const fit = clamp(
      clamp(metricPoints / 42, 0, 1) * 0.36 +
      clamp(recency / 14, 0, 1) * 0.2 +
      clamp(accelerationWindowBonus / 14, 0, 1) * 0.14 +
      clamp(trafficMomentumBonus / 14, 0, 1) * 0.12 +
      clamp(conversationBonus / 10, 0, 1) * 0.12 +
      clamp(mediaBonusPoints / 10, 0, 1) * 0.03 +
      clamp(topicBonusTotal / 12, 0, 1) * 0.03,
      0,
      1
    );
    return Math.round(fit * 100);
  }

  function computeReachLikelihood({
    replyOpportunityBonus = 0,
    conversationBonus = 0,
    trafficMomentumBonus = 0,
    sourceSurfaceBonus = 0,
    crowdingPenalty = 0,
    trafficMismatchPenalty = 0,
    followTrainBaitPenalty = 0,
    socialGrowthFlexPenalty = 0,
    verifiedOrganizationPenalty = 0,
    verifiedPileOnPenalty = 0,
    politicalFigurePenalty = 0,
    broadcastAccountPenalty = 0,
    birthdayGreetingPenalty = 0,
    riskyContentPenalty = 0,
    protocolPromoPenalty = 0,
    thinGenericPostPenalty = 0,
    visionRequiredPenalty = 0,
    emptySemanticPenalty = 0,
    unsupportedLanguagePenalty = 0,
    peakDecayPenalty = 0,
    unprovenWindowPenalty = 0
  }) {
    const fit = clamp(
      0.18 +
      clamp(replyOpportunityBonus / 14, 0, 1) * 0.29 +
      clamp(conversationBonus / 10, 0, 1) * 0.15 +
      clamp(trafficMomentumBonus / 14, 0, 1) * 0.13 +
      clamp(sourceSurfaceBonus / 12, 0, 1) * 0.2 -
      clamp(crowdingPenalty / 22, 0, 1) * 0.24 -
      clamp(trafficMismatchPenalty / 18, 0, 1) * 0.18 -
      clamp(followTrainBaitPenalty / 24, 0, 1) * 0.34 -
      clamp(socialGrowthFlexPenalty / 32, 0, 1) * 0.26 -
      clamp(verifiedOrganizationPenalty / 20, 0, 1) * 0.21 -
      clamp(verifiedPileOnPenalty / 18, 0, 1) * 0.14 -
      clamp(politicalFigurePenalty / 22, 0, 1) * 0.21 -
      clamp(broadcastAccountPenalty / 20, 0, 1) * 0.24 -
      clamp(birthdayGreetingPenalty / 14, 0, 1) * 0.12 -
      clamp(riskyContentPenalty / 24, 0, 1) * 0.25 -
      clamp(protocolPromoPenalty / 26, 0, 1) * 0.25 -
      clamp(thinGenericPostPenalty / 28, 0, 1) * 0.22 -
      clamp(visionRequiredPenalty / 36, 0, 1) * 0.28 -
      clamp(emptySemanticPenalty / 32, 0, 1) * 0.32 -
      clamp(unsupportedLanguagePenalty / 34, 0, 1) * 0.24 -
      clamp(peakDecayPenalty / 16, 0, 1) * 0.16 -
      clamp(unprovenWindowPenalty / 8, 0, 1) * 0.08,
      0,
      1
    );
    return Math.round(fit * 100);
  }

  function computeBlockReason(mediaSemanticContext, understandingConfidence) {
    if (
      mediaSemanticContext?.hasMedia &&
      mediaSemanticContext.lowConfidence &&
      Number(mediaSemanticContext.pureMediaFit || 0) >= 0.45 &&
      understandingConfidence < 45
    ) {
      return "vision_required_but_missing";
    }
    return "";
  }

  function getTweetAgeMinutes(timestamp) {
    if (!timestamp) {
      return null;
    }
    const ageMinutes = (Date.now() - timestamp) / 60000;
    if (!Number.isFinite(ageMinutes) || ageMinutes < 0) {
      return null;
    }
    return ageMinutes;
  }

  function computeRecencyScore(timestamp, weight) {
    const ageMinutes = getTweetAgeMinutes(timestamp);
    if (ageMinutes == null) {
      return null;
    }

    let freshnessFit = 0;
    if (ageMinutes <= 75) {
      freshnessFit = 1;
    } else if (ageMinutes <= 180) {
      freshnessFit = 1 - ((ageMinutes - 75) / 105) * 0.65;
    } else {
      freshnessFit = 0.35 - ((ageMinutes - 180) / 180) * 0.35;
    }

    return clamp(freshnessFit, 0, 1) * weight;
  }

  function normalizeKeywords(list) {
    if (!Array.isArray(list)) {
      return [];
    }
    return list.map((item) => String(item || "").trim()).filter(Boolean);
  }

  function normalizeLangs(list) {
    if (!Array.isArray(list)) {
      return [];
    }
    return Array.from(new Set(
      list
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean)
    ));
  }

  function mergeSettings(settings = {}) {
    const merged = {
      ...DEFAULT_SETTINGS,
      ...settings
    };
    TOPIC_DEFS.forEach((topic) => {
      merged[topic.keywordsKey] = normalizeKeywords(settings[topic.keywordsKey] ?? DEFAULT_SETTINGS[topic.keywordsKey]);
    });
    return merged;
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function isAsciiKeyword(keyword) {
    return /^[a-z0-9 _.+#-]+$/i.test(keyword);
  }

  function matchesKeywords(text, keywords) {
    const haystack = String(text || "").toLowerCase();
    if (!haystack) {
      return false;
    }

    return normalizeKeywords(keywords).some((keyword) => {
      const normalizedKeyword = keyword.toLowerCase();
      if (!normalizedKeyword) {
        return false;
      }
      if (!isAsciiKeyword(normalizedKeyword)) {
        return haystack.includes(normalizedKeyword);
      }
      const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}($|[^a-z0-9])`, "i");
      return pattern.test(haystack);
    });
  }

  function isJapanese(text) {
    return /[\u3040-\u30ff\u31f0-\u31ff]/.test(String(text || ""));
  }

  function isKorean(text) {
    return /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/i.test(String(text || ""));
  }

  function isChinese(text) {
    const value = String(text || "");
    const hasHan = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(value);
    return hasHan && !isJapanese(value) && !isKorean(value);
  }

  function isCyrillic(text) {
    return /[\u0400-\u04ff\u0500-\u052f]/.test(String(text || ""));
  }

  function isArabic(text) {
    return /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/.test(String(text || ""));
  }

  function hasLangCode(tweet, codes) {
    const langs = normalizeLangs(tweet.langs);
    if (!langs.length) {
      return false;
    }
    return langs.some((lang) => codes.some((code) => lang === code || lang.startsWith(`${code}-`)));
  }

  function languageMatches(tweet, def) {
    if (Array.isArray(def.codes) && hasLangCode(tweet, def.codes)) {
      return true;
    }
    if (typeof def.test === "function" && def.test(getSemanticText(tweet) || tweet.text || "")) {
      return true;
    }
    return false;
  }

  function computeConversationBonus(tweet, weight = 10) {
    if (!Number.isFinite(tweet.views) || !Number.isFinite(tweet.replies) || tweet.views <= 0 || tweet.replies <= 0) {
      return null;
    }

    const ratio = tweet.replies / Math.max(tweet.views, 1);
    if (!Number.isFinite(ratio) || ratio <= 0) {
      return null;
    }

    const ageMinutes = getTweetAgeMinutes(tweet.timestamp) ?? 180;
    const replyRoomFit = clamp((tweet.replies - 4) / 28, 0, 1) * (1 - clamp((tweet.replies - 120) / 220, 0, 1));
    const ratioFit = clamp(ratio / 0.0035, 0, 1) * (1 - clamp((ratio - 0.018) / 0.04, 0, 1) * 0.45);
    const roomGate = clamp(0.3 + (replyRoomFit * 0.7), 0.3, 1);
    const windowFit = ageMinutes <= 180 ? 1 : clamp(1 - (ageMinutes - 180) / 240, 0.25, 1);
    const bonus = ((ratioFit * roomGate * 0.58) + (replyRoomFit * 0.42)) * windowFit * weight;
    return bonus >= 1 ? bonus : null;
  }

  function computeReplyOpportunityBonus(tweet, weight = 14) {
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (views <= 0 || replies <= 0) {
      return null;
    }

    const ageMinutes = getTweetAgeMinutes(tweet.timestamp) ?? 180;
    const conversationRatio = replies / Math.max(views, 1);
    const likeReplyRatio = likes > 0 ? (likes / Math.max(replies, 1)) : 6;
    const replyRoomFit = clamp((replies - 3) / 24, 0, 1) * (1 - clamp((replies - 72) / 220, 0, 1));
    const conversationFit = clamp(conversationRatio / 0.0035, 0, 1) * (1 - clamp((conversationRatio - 0.02) / 0.04, 0, 1) * 0.45);
    const balanceFit = clamp(1 - Math.max(0, likeReplyRatio - 12) / 36, 0.2, 1);
    const ageFit = ageMinutes <= 150 ? 1 : clamp(1 - (ageMinutes - 150) / 420, 0.3, 1);
    const bonus = (
      (replyRoomFit * 0.44) +
      (conversationFit * 0.42) +
      (balanceFit * 0.14)
    ) * ageFit * weight;

    return bonus >= 1 ? bonus : null;
  }

  function computeAccelerationWindowBonus(tweet, weight = 14) {
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (ageMinutes == null || ageMinutes > 240 || views <= 0) {
      return null;
    }

    const hoursSincePost = Math.max(ageMinutes / 60, 0.2);
    const viewsPerHour = views / hoursSincePost;
    const repliesPerHour = replies / hoursSincePost;
    const conversationRatio = replies / Math.max(views, 1);

    let windowFit = 0;
    if (ageMinutes < 12) {
      windowFit = clamp(ageMinutes / 12, 0.45, 1) * 0.7;
    } else if (ageMinutes <= 75) {
      windowFit = 1;
    } else if (ageMinutes <= 180) {
      windowFit = clamp(1 - (ageMinutes - 75) / 105, 0, 1);
    } else {
      windowFit = clamp(0.25 - ((ageMinutes - 180) / 60) * 0.25, 0, 0.25);
    }

    const proofFit = clamp((Math.log10(views + 1) - 3.2) / 1.6, 0, 1);
    const velocityFit = clamp((Math.log10(viewsPerHour + 1) - 3.75) / 1.35, 0, 1);
    const replyFit = clamp((Math.log10(repliesPerHour + 1) - 0.55) / 0.95, 0, 1);
    const conversationFit = clamp(conversationRatio / 0.003, 0, 1);
    const engagementFit = clamp((Math.log10(likes + 1) - 1.9) / 1.3, 0, 1);

    const bonus = (
      (replyFit * 0.34) +
      (conversationFit * 0.24) +
      (velocityFit * 0.2) +
      (proofFit * 0.12) +
      (engagementFit * 0.1)
    ) * windowFit * weight;

    return bonus >= 1 ? bonus : null;
  }

  function getTrafficVelocityPerHour(tweet) {
    const explicitVelocity = Number(tweet?.trafficVelocityPerHour || 0);
    if (Number.isFinite(explicitVelocity) && explicitVelocity > 0) {
      return explicitVelocity;
    }

    const ageMinutes = getTweetAgeMinutes(tweet?.timestamp);
    const views = Number.isFinite(tweet?.views) ? tweet.views : 0;
    if (ageMinutes == null || views <= 0) {
      return 0;
    }

    return views / Math.max(ageMinutes / 60, 0.1);
  }

  function computeTrafficMomentumBonus(tweet, weight = 14) {
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const retweets = Number.isFinite(tweet.retweets) ? tweet.retweets : 0;
    const bookmarks = Number.isFinite(tweet.bookmarks) ? tweet.bookmarks : 0;
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const velocityPerHour = getTrafficVelocityPerHour(tweet);
    const semanticText = normalizeSemanticText(getSemanticText(tweet) || tweet?.text || "");
    const semanticTokens = countSemanticTokens(semanticText);
    const hasMedia = Boolean(tweet?.hasMedia || (tweet?.mediaKind && tweet.mediaKind !== "text"));

    if (ageMinutes == null || ageMinutes > 360 || views <= 0 || velocityPerHour < 220) {
      return null;
    }
    if (
      getFollowTrainBaitSignal(tweet).detected ||
      computeSocialGrowthFlexPenalty(tweet, 44) != null ||
      computeProtocolPromoPenalty(tweet, 46) != null ||
      computeRiskyContentPenalty(tweet, 42) != null
    ) {
      return null;
    }
    if (isThinGenericLowInfoPost(tweet) || isLowInfoPileOnQuestion(tweet) || (!hasMedia && semanticTokens < 8)) {
      return null;
    }

    const hoursSincePost = Math.max(ageMinutes / 60, 0.1);
    const replyVelocityPerHour = Number.isFinite(tweet.trafficReplyVelocityPerHour) && tweet.trafficReplyVelocityPerHour > 0
      ? tweet.trafficReplyVelocityPerHour
      : replies / hoursSincePost;
    const replyRatio = Number.isFinite(tweet.trafficReplyRatio) && tweet.trafficReplyRatio > 0
      ? tweet.trafficReplyRatio
      : replies / Math.max(views, 1);
    if (replyRatio < 0.0012 && replyVelocityPerHour < 18) {
      return null;
    }

    const saveShareRatio = likes > 0 ? (retweets + bookmarks) / Math.max(likes, 1) : 0;

    const velocityFit = clamp((Math.log10(velocityPerHour + 1) - 2.45) / 1.65, 0, 1);
    const replyVelocityFit = clamp((Math.log10(replyVelocityPerHour + 1) - 0.2) / 1.05, 0, 1);
    const conversationFit = clamp(replyRatio / 0.004, 0, 1) * (1 - clamp((replyRatio - 0.026) / 0.04, 0, 0.35));
    const qualityFit = clamp(saveShareRatio / 0.36, 0, 1);
    const roomFit = 1 - clamp((replies - 96) / 260, 0, 0.72);
    const oneWayDrag = clamp((0.0018 - replyRatio) / 0.0018, 0, 0.55);
    const semanticFit = hasMedia
      ? 1
      : clamp((semanticTokens - 7) / 10, 0.45, 1);

    let windowFit = 1;
    if (ageMinutes < 12) {
      windowFit = clamp(ageMinutes / 12, 0.55, 1);
    } else if (ageMinutes <= 150) {
      windowFit = 1;
    } else {
      windowFit = clamp(1 - (ageMinutes - 150) / 210, 0.25, 1);
    }

    const bonus = (
      (velocityFit * 0.28) +
      (replyVelocityFit * 0.32) +
      (conversationFit * 0.28) +
      (qualityFit * 0.12)
    ) * roomFit * windowFit * semanticFit * (1 - oneWayDrag) * weight;

    return bonus >= 2 ? bonus : null;
  }

  function computeTrafficMismatchPenalty(tweet, weight = 18) {
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const velocityPerHour = getTrafficVelocityPerHour(tweet);
    if (views <= 0 || velocityPerHour < 1200) {
      return null;
    }

    const replyRatio = Number.isFinite(tweet.trafficReplyRatio) && tweet.trafficReplyRatio > 0
      ? tweet.trafficReplyRatio
      : replies / Math.max(views, 1);
    const likeReplyRatio = replies > 0 ? likes / Math.max(replies, 1) : (likes > 0 ? likes : 0);
    let penalty = 0;

    if (replyRatio < 0.0022) {
      penalty += clamp((0.0022 - replyRatio) / 0.0022, 0, 1) * weight * 0.5;
    }

    if (velocityPerHour >= 8000 && replies < 12) {
      penalty += clamp((12 - replies) / 12, 0, 1) * weight * 0.34;
    }

    if (replies >= 160 && views >= 60000) {
      penalty += clamp((replies - 160) / 420, 0, 1) * weight * 0.45;
    }

    if (likeReplyRatio >= 18) {
      penalty += clamp((likeReplyRatio - 18) / 42, 0, 1) * weight * 0.34;
    }

    return penalty >= 3 ? penalty : null;
  }

  function computeUnprovenWindowPenalty(tweet, weight = 8) {
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (ageMinutes == null || ageMinutes > 90) {
      return null;
    }
    if (views >= 1200 || replies >= 10 || likes >= 100) {
      return null;
    }

    const ageFit = ageMinutes < 12 ? 0.6 : 1;
    const penalty = (
      clamp((1200 - views) / 1200, 0, 1) * 0.55 +
      clamp((10 - replies) / 10, 0, 1) * 0.3 +
      clamp((100 - likes) / 100, 0, 1) * 0.15
    ) * ageFit * weight;

    return penalty >= 2 ? penalty : null;
  }

  function computePeakDecayPenalty(tweet, weight = 16) {
    const ageMinutes = getTweetAgeMinutes(tweet.timestamp);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    if (ageMinutes == null || ageMinutes <= 120) {
      return null;
    }
    if (views < 30000 && replies < 180) {
      return null;
    }

    const staleFit = clamp((ageMinutes - 120) / 360, 0, 1);
    const reachFit = clamp((Math.log10(views + 1) - 4.5) / 1.7, 0, 1);
    const crowdFit = clamp((Math.log10(replies + 1) - 2.2) / 1.1, 0, 1);
    const penalty = ((reachFit * 0.6) + (crowdFit * 0.4)) * staleFit * weight;
    return penalty >= 2 ? penalty : null;
  }

  function computeCrowdingPenalty(tweet) {
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (replies <= 0 && views <= 0 && likes <= 0) {
      return null;
    }

    const conversationRatio = (views > 0 && replies > 0) ? (replies / views) : 0;
    const likeReplyRatio = (likes > 0 && replies > 0) ? (likes / replies) : null;

    let penalty = 0;

    if (replies >= 80) {
      penalty += clamp((Math.log10(replies + 1) - Math.log10(80)) / 1.3, 0, 1) * 22;
    }

    if (views >= 50000) {
      penalty += clamp((Math.log10(views + 1) - Math.log10(50000)) / 1.55, 0, 1) * 18;
    }

    if (views >= 100000 || replies >= 150) {
      const shallowConversationPenalty = clamp((0.0025 - conversationRatio) / 0.0025, 0, 1) * 12;
      const broadcastPenalty = likeReplyRatio && likeReplyRatio > 18
        ? clamp((likeReplyRatio - 18) / 42, 0, 1) * 10
        : 0;
      penalty += Math.max(shallowConversationPenalty, broadcastPenalty);
    }

    if (replies >= 250 && views >= 180000) {
      penalty += 8;
    }
    if (replies >= 500 && views >= 350000) {
      penalty += 12;
    }
    if (replies >= 1200 && views >= 1200000) {
      penalty += 10;
    }

    const rounded = Math.round(clamp(penalty, 0, 64));
    return rounded >= 3 ? rounded : null;
  }

  function computeVerifiedOrganizationPenalty(tweet, weight = 16) {
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    if (verificationType !== "gold" && verificationType !== "government") {
      return null;
    }

    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const followers = Number.isFinite(tweet.authorFollowers) ? tweet.authorFollowers : 0;
    const text = String(tweet.text || "");
    const conversationRatio = replies > 0 && views > 0 ? (replies / views) : 0;
    const likeReplyRatio = replies > 0 ? (likes / Math.max(replies, 1)) : (likes > 0 ? likes : 0);
    const dialogueHits = countTermMatches(text, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(text) ? 1 : 0);
    const scaleFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.55) / 1.45,
        (Math.log10(followers + 1) - 4.15) / 1.8,
        (Math.log10(likes + 1) - 2.15) / 1.35
      ),
      0,
      1
    );
    const shallowConversationFit = views >= 3000
      ? clamp((0.004 - conversationRatio) / 0.004, 0, 1)
      : clamp((0.003 - conversationRatio) / 0.003, 0, 0.45);
    const applauseFit = clamp((likeReplyRatio - 10) / 22, 0, 1);
    const crowdFit = clamp((replies - 24) / 120, 0, 1);
    const dialogueRelief = clamp(dialogueHits / 2.4, 0, 0.6);
    const typeMultiplier = verificationType === "government" ? 1.12 : 1;
    const penalty = (
      (shallowConversationFit * 0.4) +
      (applauseFit * 0.22) +
      (scaleFit * 0.22) +
      (crowdFit * 0.16)
    ) * (1 - dialogueRelief) * weight * typeMultiplier;

    return penalty >= 2 ? penalty : null;
  }

  function computePoliticalFigurePenalty(tweet, weight = 18) {
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const followers = Number.isFinite(tweet.authorFollowers) ? tweet.authorFollowers : 0;
    const authorName = String(tweet.authorName || "");
    const authorHandle = String(tweet.authorHandle || "");
    const text = String(tweet.text || "");
    const conversationRatio = replies > 0 && views > 0 ? (replies / views) : 0;
    const likeReplyRatio = replies > 0 ? (likes / Math.max(replies, 1)) : (likes > 0 ? likes : 0);
    const handleHits = countTermMatches(authorHandle, POLITICAL_HANDLE_TERMS);
    const nameHits = countTermMatches(authorName, POLITICAL_NAME_TERMS);
    const textHits = countTermMatches(text, POLITICAL_TEXT_TERMS);
    const dialogueHits = countTermMatches(text, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(text) ? 1 : 0);
    const directOfficeSignals = handleHits + (nameHits * 1.18);
    const verifiedBoost = verificationType === "government"
      ? 0.92
      : (verificationType === "gold" ? 0.46 : (tweet?.authorVerified ? 0.24 : 0));
    const officeFit = clamp(
      (directOfficeSignals + (textHits * 0.52) + verifiedBoost - (dialogueHits * 0.55)) / 3.2,
      0,
      1
    );
    if (officeFit <= 0) {
      return null;
    }
    if (directOfficeSignals <= 0.2 && textHits < 1) {
      return null;
    }

    const shallowConversationFit = views >= 5000
      ? clamp((0.0045 - conversationRatio) / 0.0045, 0, 1)
      : clamp((0.0035 - conversationRatio) / 0.0035, 0, 0.55);
    const applauseFit = clamp((likeReplyRatio - 11) / 26, 0, 1);
    const scaleFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.6) / 1.5,
        (Math.log10(followers + 1) - 4.2) / 1.8
      ),
      0,
      1
    );
    const campaignFit = clamp((textHits - 1) / 3, 0, 1);
    const dialogueRelief = clamp(dialogueHits / 2.4, 0, 0.45);
    const typeMultiplier = verificationType === "government"
      ? 1.18
      : (verificationType === "gold" ? 1.06 : 1);
    const penalty = (
      (officeFit * 0.45) +
      (shallowConversationFit * 0.22) +
      (applauseFit * 0.14) +
      (scaleFit * 0.11) +
      (campaignFit * 0.08)
    ) * (1 - dialogueRelief) * weight * typeMultiplier;

    return penalty >= 2 ? penalty : null;
  }

  function computeBroadcastAccountPenalty(tweet, weight = 18) {
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    if (!tweet?.authorVerified && !verificationType) {
      return null;
    }

    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const authorName = String(tweet.authorName || "");
    const authorHandle = String(tweet.authorHandle || "");
    const text = String(tweet.text || "");
    const conversationRatio = replies > 0 && views > 0 ? (replies / views) : 0;
    const likeReplyRatio = replies > 0 && likes > 0 ? (likes / replies) : (likes > 0 ? likes : 0);
    const handleHits = countTermMatches(authorHandle, OFFICIAL_BROADCAST_HANDLE_TERMS);
    const nameHits = countTermMatches(authorName, OFFICIAL_BROADCAST_NAME_TERMS);
    const textHits = countTermMatches(text, BROADCAST_TEXT_TERMS);
    const dialogueHits = countTermMatches(text, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(text) ? 1 : 0);

    const verificationBoost = verificationType === "government"
      ? 0.9
      : (verificationType === "gold" ? 0.65 : 0);
    const orgFit = clamp((handleHits + nameHits * 1.15 + textHits * 0.65 + verificationBoost - dialogueHits * 0.7) / 3.2, 0, 1);
    if (orgFit <= 0) {
      return null;
    }

    const shallowConversationFit = views >= 10000
      ? clamp((0.0028 - conversationRatio) / 0.0028, 0, 1)
      : 0;
    const applauseFit = clamp((likeReplyRatio - 14) / 34, 0, 1);
    const proofFit = clamp((Math.log10(Math.max(views, likes) + 1) - 3.1) / 1.6, 0, 1);
    const dialogueRelief = clamp(dialogueHits / 2.2, 0, 0.55);
    const oneWayFit = Math.max(shallowConversationFit, applauseFit, textHits ? 0.45 : 0);
    const verificationMultiplier = verificationType === "government"
      ? 1.14
      : (verificationType === "gold" ? 1.08 : 1);
    const penalty = (
      (orgFit * 0.52) +
      (oneWayFit * 0.34) +
      (proofFit * 0.14)
    ) * (1 - dialogueRelief) * weight * verificationMultiplier;

    return penalty >= 3 ? penalty : null;
  }

  function computeVerifiedPileOnPenalty(tweet, weight = 16) {
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    if (!tweet?.authorVerified && !verificationType) {
      return null;
    }

    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    if (views < 5000 && replies < 18 && likes < 120) {
      return null;
    }

    const text = String(tweet.text || "");
    const conversationRatio = replies > 0 && views > 0 ? (replies / views) : 0;
    const likeReplyRatio = replies > 0 ? (likes / Math.max(replies, 1)) : (likes > 0 ? likes : 0);
    const dialogueHits = countTermMatches(text, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(text) ? 1 : 0);
    const scaleFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.55) / 1.55,
        (Math.log10(likes + 1) - 2.05) / 1.45,
        (Math.log10(replies + 1) - 1.15) / 1.25
      ),
      0,
      1
    );
    const crowdFit = clamp((replies - 16) / 90, 0, 1);
    const shallowConversationFit = views >= 5000
      ? clamp((0.0048 - conversationRatio) / 0.0048, 0, 1)
      : 0;
    const applauseFit = replies > 0
      ? clamp((likeReplyRatio - 10) / 24, 0, 1)
      : clamp((Math.log10(likes + 1) - 2.4) / 1.3, 0, 0.55);
    const dialogueRelief = clamp(dialogueHits / 2.4, 0, 0.42);
    const verificationMultiplier = verificationType === "government"
      ? 1.18
      : (verificationType === "gold" ? 1.12 : 1);
    const penalty = (
      (scaleFit * 0.32) +
      (crowdFit * 0.36) +
      (Math.max(shallowConversationFit, applauseFit) * 0.32)
    ) * (1 - dialogueRelief) * weight * verificationMultiplier;

    return penalty >= 2 ? penalty : null;
  }

  function getFollowTrainBaitSignal(tweet) {
    const text = getSemanticText(tweet) || String(tweet?.text || "");
    const normalized = normalizeSemanticText(text);
    if (!normalized) {
      return {
        detected: false,
        patternFit: 0,
        exchangeFit: 0,
        verifiedFit: 0,
        thinContextFit: 0
      };
    }

    const baitNormalized = normalizeBaitText(normalized);
    const detectionText = `${normalized}\n${baitNormalized}`;
    const ctaHits = countTermMatches(detectionText, FOLLOW_TRAIN_CTA_TERMS);
    const rewardHits = countTermMatches(detectionText, FOLLOW_TRAIN_REWARD_TERMS);
    const directHits = countRegexMatches(detectionText, FOLLOW_TRAIN_DIRECT_PATTERNS);
    const replies = Number.isFinite(tweet?.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet?.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet?.likes) ? tweet.likes : 0;
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    const semanticTokens = countSemanticTokens(normalized);
    const patternFit = clamp(
      (rewardHits * 0.86 + ctaHits * 0.62 + directHits * 0.74) / 2.55,
      0,
      1
    );
    const exchangeFit = clamp(
      Math.max(
        replies >= 18 ? (replies - 18) / 120 : 0,
        views > 0 ? ((replies / Math.max(views, 1)) - 0.012) / 0.16 : 0,
        likes > 0 ? ((replies / Math.max(likes, 1)) - 0.75) / 2.2 : 0
      ),
      0,
      1
    );
    const verifiedFit = verificationType === "blue"
      ? 1
      : (verificationType === "gold" || verificationType === "government"
        ? 0.72
        : (tweet?.authorVerified ? 0.9 : 0.45));
    const thinContextFit = clamp(
      Math.max(
        (72 - normalized.length) / 72,
        (16 - semanticTokens) / 16
      ),
      0,
      1
    );
    const detected = (
      rewardHits >= 2 ||
      (rewardHits > 0 && (ctaHits > 0 || directHits > 0 || exchangeFit >= 0.18 || thinContextFit >= 0.45)) ||
      (ctaHits >= 2 && rewardHits + directHits >= 1) ||
      (directHits >= 2 && patternFit >= 0.48)
    );

    return {
      detected,
      patternFit,
      exchangeFit,
      verifiedFit,
      thinContextFit
    };
  }

  function computeFollowTrainBaitPenalty(tweet, weight = 38) {
    const signal = getFollowTrainBaitSignal(tweet);
    if (!signal.detected) {
      return null;
    }

    const penalty = (
      signal.patternFit * 0.6 +
      signal.exchangeFit * 0.2 +
      signal.verifiedFit * 0.1 +
      signal.thinContextFit * 0.1
    ) * weight;

    return penalty >= 2 ? Math.max(penalty, 62) : null;
  }

  function isThinGenericLowInfoPost(tweet) {
    const semanticText = normalizeSemanticText(getSemanticText(tweet) || tweet?.text || "");
    if (!semanticText) {
      return false;
    }

    const hasMedia = Boolean(tweet?.hasMedia || (tweet?.mediaKind && tweet.mediaKind !== "text"));
    if (hasMedia) {
      return false;
    }

    const semanticTokens = countSemanticTokens(semanticText);
    const topicHits = countDefaultTopicMatches(semanticText);
    const dialogueHits = countTermMatches(semanticText, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(semanticText) ? 1 : 0);
    const genericHits = countTermMatches(semanticText, GENERIC_SHORT_POST_TERMS);
    const relationshipHits = countTermMatches(semanticText, RELATIONSHIP_BAIT_TERMS);
    const geopoliticalLowInfoHits = countRegexMatches(semanticText, GEOPOLITICAL_LOW_INFO_PATTERNS);
    const lowInfoWealthHits = countRegexMatches(semanticText, [
      /\bafter\s+all\s+my\s+millions\b/i,
      /\bmy\s+millions\b/i,
      /\bmillions?\b.{0,40}\b(?:lunch|pizza|joke|line|finally|still)\b/i,
      /\b(?:tesla|investor)\b.{0,60}\b(?:pizza|lunch|millions?|nothing|lol)\b/i,
      /\b(?:hover|hovering|hover\s*tech|hovertech)\b.{0,80}\b(?:future|soon|finally|wild|crazy)\b/i
    ]);
    const shortFit = semanticText.length <= 72 || semanticTokens <= 9;

    if (!geopoliticalLowInfoHits && !lowInfoWealthHits && (topicHits > 0 || dialogueHits > 0)) {
      return false;
    }

    return Boolean(
      (shortFit && semanticTokens <= 7) ||
      (shortFit && genericHits > 0) ||
      (semanticTokens <= 14 && relationshipHits > 0) ||
      geopoliticalLowInfoHits > 0 ||
      lowInfoWealthHits > 0
    );
  }

  function isLowInfoPileOnQuestion(tweet) {
    const semanticText = normalizeSemanticText(getSemanticText(tweet) || tweet?.text || "");
    if (!semanticText) {
      return false;
    }

    const hasMedia = Boolean(tweet?.hasMedia || (tweet?.mediaKind && tweet.mediaKind !== "text"));
    const semanticTokens = countSemanticTokens(semanticText);
    const topicHits = countDefaultTopicMatches(semanticText);
    const questionHits = countTermMatches(semanticText, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(semanticText) ? 1 : 0);
    const controversyHits = countTermMatches(semanticText, [
      "who wins", "which one", "which is worse", "which is better", "is this real",
      "thoughts", "agree or disagree", "hot take", "unpopular opinion",
      "am i wrong", "prove me wrong", "what side are you on", "yes or no"
    ]);
    const authorFollowers = Number.isFinite(tweet?.authorFollowers) ? tweet.authorFollowers : 0;
    const replies = Number.isFinite(tweet?.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet?.views) ? tweet.views : 0;
    const scaleFit = authorFollowers >= 150000 || views >= 60000 || replies >= 90;

    return Boolean(
      !hasMedia &&
      scaleFit &&
      questionHits > 0 &&
      topicHits === 0 &&
      (semanticTokens <= 16 || controversyHits > 0)
    );
  }

  function computeThinGenericPostPenalty(tweet, weight = 34) {
    const lowInfoPileOn = isLowInfoPileOnQuestion(tweet);
    const semanticText = normalizeSemanticText(getSemanticText(tweet) || tweet?.text || "");
    const geopoliticalLowInfo = countRegexMatches(semanticText, GEOPOLITICAL_LOW_INFO_PATTERNS) > 0;
    const lowInfoWealth = countRegexMatches(semanticText, [
      /\bafter\s+all\s+my\s+millions\b/i,
      /\bmy\s+millions\b/i,
      /\bmillions?\b.{0,40}\b(?:lunch|pizza|joke|line|finally|still)\b/i,
      /\b(?:tesla|investor)\b.{0,60}\b(?:pizza|lunch|millions?|nothing|lol)\b/i,
      /\b(?:hover|hovering|hover\s*tech|hovertech)\b.{0,80}\b(?:future|soon|finally|wild|crazy)\b/i
    ]) > 0;
    if (!isThinGenericLowInfoPost(tweet) && !lowInfoPileOn && !geopoliticalLowInfo && !lowInfoWealth) {
      return null;
    }

    const semanticTokens = countSemanticTokens(semanticText);
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const velocityPerHour = getTrafficVelocityPerHour(tweet);
    const thinFit = clamp(Math.max((10 - semanticTokens) / 10, (84 - semanticText.length) / 84), 0.35, 1);
    const heatFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.1) / 1.65,
        (Math.log10(replies + 1) - 0.8) / 1.35,
        (Math.log10(velocityPerHour + 1) - 2.8) / 1.55
      ),
      0.35,
      1
    );
    const penalty = thinFit * heatFit * weight;
    return penalty >= 3 ? Math.max(penalty, (geopoliticalLowInfo || lowInfoWealth) ? 42 : (lowInfoPileOn ? 34 : 28)) : null;
  }

  function computeSocialGrowthFlexPenalty(tweet, weight = 42) {
    const text = getSemanticText(tweet) || String(tweet?.text || "");
    const normalized = normalizeSemanticText(text);
    if (!normalized) {
      return null;
    }

    const termHits = countTermMatches(normalized, SOCIAL_GROWTH_FLEX_TERMS);
    const patternHits = countRegexMatches(normalized, SOCIAL_GROWTH_FLEX_PATTERNS);
    const followSignal = getFollowTrainBaitSignal(tweet);
    if (!patternHits && termHits < 2 && !followSignal.detected) {
      return null;
    }

    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const velocityPerHour = getTrafficVelocityPerHour(tweet);
    const semanticTokens = countSemanticTokens(normalized);
    const flexFit = clamp((patternHits * 0.85 + termHits * 0.22 + (followSignal.detected ? 0.55 : 0)) / 1.55, 0, 1);
    const thinFit = clamp(Math.max((18 - semanticTokens) / 18, followSignal.thinContextFit || 0), 0.2, 1);
    const heatFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.1) / 1.65,
        (Math.log10(likes + 1) - 2) / 1.45,
        (Math.log10(replies + 1) - 0.9) / 1.35,
        (Math.log10(velocityPerHour + 1) - 2.8) / 1.55
      ),
      0.35,
      1
    );
    const penalty = ((flexFit * 0.74) + (thinFit * 0.26)) * heatFit * weight;
    return penalty >= 3 ? Math.max(penalty, 38) : null;
  }

  function computeBirthdayGreetingPenalty(tweet, weight = 26) {
    const text = getSemanticText(tweet) || String(tweet?.text || "");
    const birthdayHits = countTermMatches(text, BIRTHDAY_TEXT_TERMS);
    if (!birthdayHits) {
      return null;
    }

    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const tokenCount = countSemanticTokens(text);
    const conversationRatio = replies > 0 && views > 0 ? (replies / views) : 0;
    const likeReplyRatio = replies > 0 ? (likes / Math.max(replies, 1)) : (likes > 0 ? likes : 0);
    const dialogueHits = countTermMatches(text, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(text) ? 1 : 0);
    const socialFit = clamp(
      (birthdayHits * 0.95) + clamp((18 - Math.min(tokenCount, 18)) / 18, 0, 0.55),
      0.35,
      1.25
    );
    const shallowConversationFit = views >= 800
      ? clamp((0.005 - conversationRatio) / 0.005, 0, 1)
      : clamp((0.0035 - conversationRatio) / 0.0035, 0, 0.55);
    const applauseFit = clamp((likeReplyRatio - 8) / 18, 0, 1);
    const crowdFit = clamp((replies - 12) / 72, 0, 1);
    const dialogueRelief = clamp(dialogueHits / 2.2, 0, 0.72);
    const penalty = (
      (Math.min(1, socialFit) * 0.58) +
      (shallowConversationFit * 0.18) +
      (applauseFit * 0.14) +
      (crowdFit * 0.1)
    ) * (1 - dialogueRelief) * weight;

    if (penalty < 3) {
      return null;
    }
    return Math.max(20, penalty);
  }

  function computeRiskyContentPenalty(tweet, weight = 34) {
    const text = getSemanticText(tweet) || String(tweet?.text || "");
    const normalized = normalizeSemanticText(text);
    if (!normalized) {
      return null;
    }

    const termHits = countTermMatches(normalized, RISKY_CONTENT_TERMS);
    const patternHits = countRegexMatches(normalized, RISKY_CONTENT_PATTERNS) +
      countRegexMatches(normalized, MIRACLE_CLAIM_PATTERNS);
    if (!termHits && !patternHits) {
      return null;
    }

    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const heatFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.25) / 1.65,
        (Math.log10(likes + 1) - 2.05) / 1.45,
        (Math.log10(replies + 1) - 1.1) / 1.25
      ),
      0.35,
      1
    );
    const signalFit = clamp((termHits * 0.42 + patternHits * 0.85) / 1.55, 0.45, 1);
    const penalty = signalFit * heatFit * weight;
    return penalty >= 2 ? Math.max(penalty, 36) : null;
  }

  function getDeveloperUpdateSignal(tweet) {
    const semanticText = normalizeSemanticText(getSemanticText(tweet) || tweet?.text || "");
    if (!semanticText) {
      return { detected: false, bonus: null };
    }

    const normalized = semanticText.toLowerCase();
    const semanticTokens = countSemanticTokens(semanticText);
    const technicalHits = countTermMatches(normalized, [
      "api", "api docs", "docs", "quick start", "model", "context", "tokens", "cache hit",
      "cache miss", "input", "output", "inference", "pricing", "claude code", "opencode",
      "openclaw", "sdk", "integration", "integrations", "developer", "developers",
      "模型", "接口", "文档", "上下文", "开发者", "開發者", "料金", "価格", "ドキュメント"
    ]);
    const concreteHits = countRegexMatches(semanticText, [
      /\bv?\d+(?:\.\d+){1,3}\+?\b/i,
      /\b\d+\s*m\s+context\b/i,
      /\b\d+%\s*off\b/i,
      /\$\s*\d+(?:\.\d+)?/i,
      /\b(?:update|set|upgrade)\s+(?:to|model)\b/i,
      /\b(?:api[-.\w/]*docs|docs?[-.\w/]*quick[-_\w/]*)\b/i
    ]);
    const integrationHits = countTermMatches(normalized, [
      "claude code", "opencode", "openclaw", "cursor", "vscode", "windsurf", "aider",
      "integration", "integrations", "集成", "統合", "連携"
    ]);
    const cryptoHits = countTermMatches(normalized, [
      "token", "tvl", "mainnet", "testnet", "airdrop", "staking", "liquidity",
      "exchange listing", "holders", "holder count", "代币", "代幣", "空投", "主网", "主網"
    ]);
    const detected = Boolean(
      semanticTokens >= 22 &&
      technicalHits >= 3 &&
      concreteHits >= 2 &&
      (integrationHits >= 1 || /deepseek|openai|anthropic|claude|gpt|model/i.test(semanticText)) &&
      cryptoHits <= 1
    );

    if (!detected) {
      return { detected: false, bonus: null };
    }

    return {
      detected: true,
      bonus: Math.min(18, 10 + technicalHits + concreteHits + integrationHits)
    };
  }

  function applyDeveloperUpdateRelief(penalty, signal, multiplier = 0.3) {
    if (penalty == null || !signal?.detected) {
      return penalty;
    }
    const relieved = penalty * multiplier;
    return relieved >= 2 ? relieved : null;
  }

  function computeProtocolPromoPenalty(tweet, weight = 38) {
    const text = getSemanticText(tweet) || String(tweet?.text || "");
    const normalized = normalizeSemanticText(text);
    if (!normalized) {
      return null;
    }

    const authorName = String(tweet?.authorName || "");
    const authorHandle = String(tweet?.authorHandle || "");
    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    const promoHits = countTermMatches(normalized, PROTOCOL_PROMO_TERMS);
    const patternHits = countRegexMatches(normalized, PROTOCOL_PROMO_PATTERNS);
    const orgHits = (
      countTermMatches(authorHandle, OFFICIAL_BROADCAST_HANDLE_TERMS) +
      countTermMatches(authorName, OFFICIAL_BROADCAST_NAME_TERMS)
    );
    const announcementHits = countTermMatches(normalized, BROADCAST_TEXT_TERMS);
    const dialogueHits = countTermMatches(normalized, DIALOGUE_TEXT_TERMS) + (/[?？]/.test(normalized) ? 1 : 0);
    const verifiedOrgFit = verificationType === "gold" || verificationType === "government"
      ? 0.9
      : (tweet?.authorVerified ? 0.32 : 0);
    const officialFit = clamp((orgHits * 0.46 + announcementHits * 0.24 + verifiedOrgFit) / 1.8, 0, 1);
    const promoFit = clamp((promoHits * 0.34 + patternHits * 0.9) / 1.45, 0, 1);
    if (promoFit <= 0) {
      return null;
    }
    if (promoHits + patternHits < 2 && officialFit < 0.35) {
      return null;
    }

    const replies = Number.isFinite(tweet.replies) ? tweet.replies : 0;
    const views = Number.isFinite(tweet.views) ? tweet.views : 0;
    const likes = Number.isFinite(tweet.likes) ? tweet.likes : 0;
    const heatFit = clamp(
      Math.max(
        (Math.log10(views + 1) - 3.1) / 1.65,
        (Math.log10(likes + 1) - 2.05) / 1.45,
        (Math.log10(replies + 1) - 1.05) / 1.3
      ),
      0.35,
      1
    );
    const dialogueRelief = clamp(dialogueHits / 2.4, 0, 0.5);
    const penalty = (
      (promoFit * 0.66) +
      (officialFit * 0.34)
    ) * heatFit * (1 - dialogueRelief) * weight;

    return penalty >= 3 ? Math.max(penalty, 32) : null;
  }

  function hasSubstantialOriginalAnalysis(tweet) {
    const semanticText = normalizeSemanticText(getSemanticText(tweet) || tweet?.text || "");
    if (!semanticText) {
      return false;
    }

    const semanticTokens = countSemanticTokens(semanticText);
    const technicalHits = countTermMatches(semanticText, [
      "benchmark", "architecture", "technical report", "paper", "dataset", "eval",
      "open source", "github", "implementation", "latency", "throughput", "reasoning",
      "api", "model", "weights", "inference", "training", "fine-tuning",
      "技术报告", "技術報告", "论文", "論文", "开源", "開源", "架构", "架構",
      "実装", "論文", "ベンチマーク", "評価", "기술 보고서", "논문", "오픈소스"
    ]);

    return semanticTokens >= 28 && technicalHits > 0;
  }

  function computeExecutorHardCap(tweet, signals = {}) {
    const substantialAnalysis = hasSubstantialOriginalAnalysis(tweet) || getDeveloperUpdateSignal(tweet).detected;
    if (signals.followTrainBaitPenalty != null) {
      return { cap: 42, key: "hardCapFollowLoop", label: "Follow loop cap" };
    }
    if (signals.socialGrowthFlexPenalty != null) {
      return { cap: 48, key: "hardCapPayoutFlex", label: "Payout or growth cap" };
    }
    if (signals.politicalFigurePenalty != null) {
      return { cap: 47, key: "hardCapPolitical", label: "Political account cap" };
    }
    if (signals.broadcastAccountPenalty != null && !substantialAnalysis) {
      return { cap: 50, key: "hardCapBroadcast", label: "Broadcast cap" };
    }
    if (signals.protocolPromoPenalty != null && !substantialAnalysis) {
      return { cap: 52, key: "hardCapCryptoPromo", label: "Crypto promo cap" };
    }
    if (signals.riskyContentPenalty != null && !substantialAnalysis) {
      return { cap: 44, key: "hardCapRisky", label: "Risky content cap" };
    }
    if (signals.thinGenericPostPenalty != null) {
      return { cap: 50, key: "hardCapLowInfo", label: "Low-info cap" };
    }
    return null;
  }

  function computeEmptySemanticPenalty(tweet, mediaSemanticContext, weight = 64) {
    const semanticText = normalizeSemanticText(mediaSemanticContext?.semanticText || getSemanticText(tweet) || tweet?.text || "");
    if (semanticText) {
      return null;
    }
    if (mediaSemanticContext?.hasMedia) {
      return null;
    }
    return weight;
  }

  function computeVisionRequiredPenalty(tweet, mediaSemanticContext, weight = 42) {
    if (!mediaSemanticContext?.hasMedia) {
      return null;
    }

    const semanticText = normalizeSemanticText(mediaSemanticContext.semanticText || getSemanticText(tweet) || tweet?.text || "");
    const semanticTokens = countSemanticTokens(semanticText);
    const mediaKind = String(tweet?.mediaKind || "").trim().toLowerCase();
    const isVideoLike = mediaKind === "video" || mediaKind === "gif";
    const lowConfidence = Boolean(mediaSemanticContext.lowConfidence) || (
      !mediaSemanticContext.altMeaningful &&
      semanticTokens < (isVideoLike ? 7 : 5)
    );
    if (!lowConfidence) {
      return null;
    }

    const genericCaptionHits = countTermMatches(semanticText, [
      "watch this", "look at this", "this video", "this is wild", "so good", "amazing",
      "やばい", "すごい", "見て", "これ", "最高", "動画", "草", "笑",
      "看看", "这个", "這個", "视频", "視頻", "笑死", "绝了", "絕了"
    ]);
    const pureFit = clamp(mediaSemanticContext.pureMediaFit || 0, 0, 1);
    const textGapFit = clamp(((isVideoLike ? 8 : 6) - semanticTokens) / (isVideoLike ? 8 : 6), 0, 1);
    const mediaFit = isVideoLike ? 1 : 0.68;
    const penalty = (
      pureFit * 0.42 +
      textGapFit * 0.36 +
      mediaFit * 0.16 +
      clamp(genericCaptionHits / 2, 0, 1) * 0.06
    ) * weight;

    return penalty >= 8 ? Math.max(penalty, isVideoLike ? 30 : 20) : null;
  }

  function isLikelyUnsupportedLanguageText(text) {
    const normalized = normalizeSemanticText(text);
    if (!normalized) {
      return false;
    }
    if (/[\u0600-\u08ff\u0400-\u052f]/.test(normalized)) {
      return true;
    }
    if (/[ğüşöçıİĞÜŞÖÇ]/.test(normalized)) {
      return true;
    }
    if (/[À-ɏ]/.test(normalized) && !/[a-z]{4,}/i.test(normalized)) {
      return true;
    }
    return false;
  }

  function computeUnsupportedLanguagePenalty(tweet, matchedLanguages = [], weight = 28) {
    if (Array.isArray(matchedLanguages) && matchedLanguages.length) {
      return null;
    }

    const semanticText = getSemanticText(tweet) || String(tweet?.text || "");
    const normalized = normalizeSemanticText(semanticText);
    if (!normalized || countSemanticTokens(normalized) < 3) {
      return null;
    }

    const langs = normalizeLangs(tweet?.langs);
    const supportedLangCodes = ["zh", "zh-cn", "zh-hans", "zh-tw", "zh-hant", "zh-hk", "en", "en-us", "en-gb", "ja", "ja-jp", "ko", "ko-kr"];
    const explicitUnsupportedLang = langs.some((lang) => (
      lang &&
      !supportedLangCodes.some((code) => lang === code || lang.startsWith(`${code}-`))
    ));
    const scriptUnsupported = isLikelyUnsupportedLanguageText(normalized);
    if (!explicitUnsupportedLang && !scriptUnsupported) {
      return null;
    }

    const verificationType = normalizeVerificationType(
      tweet?.authorVerificationType,
      tweet?.authorVerified ? "verified" : ""
    );
    const authorName = String(tweet?.authorName || "");
    const authorHandle = String(tweet?.authorHandle || "");
    const politicalHits = (
      countTermMatches(authorHandle, POLITICAL_HANDLE_TERMS) +
      countTermMatches(authorName, POLITICAL_NAME_TERMS) +
      countTermMatches(normalized, POLITICAL_TEXT_TERMS)
    );
    const broadcastHits = (
      countTermMatches(authorHandle, OFFICIAL_BROADCAST_HANDLE_TERMS) +
      countTermMatches(authorName, OFFICIAL_BROADCAST_NAME_TERMS) +
      countTermMatches(normalized, BROADCAST_TEXT_TERMS)
    );
    const promoHits = (
      countTermMatches(normalized, PROTOCOL_PROMO_TERMS) +
      countRegexMatches(normalized, PROTOCOL_PROMO_PATTERNS)
    );
    const trustPenalty = verificationType === "government" || verificationType === "gold"
      ? 12
      : (tweet?.authorVerified ? 6 : 0);
    const riskPenalty = Math.min(14, politicalHits * 5 + broadcastHits * 4 + promoHits * 4);
    return Math.round(Math.min(46, weight + trustPenalty + riskPenalty));
  }

  function formatBreakdownText(item) {
    const rounded = Math.round(item.amount);
    const sign = rounded > 0 ? "+" : "";
    return `${item.label} ${sign}${rounded}`;
  }

  function buildHighlights(positiveBreakdown, negativeBreakdown) {
    const highlights = [];

    if (positiveBreakdown[0]) {
      highlights.push(formatBreakdownText(positiveBreakdown[0]));
    }
    if (negativeBreakdown[0]) {
      highlights.push(formatBreakdownText(negativeBreakdown[0]));
    }
    positiveBreakdown.slice(1, 3).forEach((item) => {
      highlights.push(formatBreakdownText(item));
    });
    negativeBreakdown.slice(1, 2).forEach((item) => {
      highlights.push(formatBreakdownText(item));
    });

    return highlights.slice(0, 4);
  }

  function buildAnalysis(tweet, settings = {}) {
    const merged = mergeSettings(settings);
    const semanticText = getSemanticText(tweet);
    const mediaSemanticContext = getMediaSemanticContext(tweet);
    const parts = [];
    const breakdown = [];
    let availableWeight = 0;
    let metricPoints = 0;
    let mediaBonusPoints = 0;

    const metrics = [
      { key: "authorFollowers", label: "Reach", value: tweet.authorFollowers, maxBase: 6, weight: 6 },
      { key: "likes", label: "Likes", value: tweet.likes, maxBase: 4, weight: 8 },
      { key: "replies", label: "Replies", value: tweet.replies, maxBase: 3, weight: 18 },
      { key: "views", label: "Views", value: tweet.views, maxBase: 6, weight: 10 }
    ];

    for (const metric of metrics) {
      const partial = normalizeLog(metric.value, metric.maxBase, metric.weight);
      if (partial == null) {
        continue;
      }
      parts.push(partial);
      metricPoints += partial;
      breakdown.push({
        key: metric.key,
        label: metric.label,
        amount: partial,
        kind: "momentum"
      });
      availableWeight += metric.weight;
    }

    const recency = computeRecencyScore(tweet.timestamp, 14);
    if (recency != null) {
      parts.push(recency);
      breakdown.push({
        key: "freshness",
        label: "Freshness",
        amount: recency,
        kind: "timing"
      });
      availableWeight += 14;
    }

    const matches = {};
    const matchedLanguages = [];
    const matchedTopics = [];

    LANGUAGE_DEFS.forEach((language) => {
      const matched = merged[language.key] && languageMatches(tweet, language);
      matches[language.key] = matched;
      if (matched) {
        matchedLanguages.push(language);
      }
    });

    TOPIC_DEFS.forEach((topic) => {
      const matched = merged[topic.enabledKey] && matchesKeywords(semanticText, merged[topic.keywordsKey]);
      matches[topic.key] = matched;
      if (matched) {
        matchedTopics.push(topic);
      }
    });

    const keywordMatched = Object.values(matches).some(Boolean);
    const developerUpdateSignal = getDeveloperUpdateSignal(tweet);
    let score = (parts.length && availableWeight > 0)
      ? (parts.reduce((sum, current) => sum + current, 0) / availableWeight) * 100
      : 0;

    let accelerationWindowBonus = computeAccelerationWindowBonus(tweet, 14);
    if (
      accelerationWindowBonus != null &&
      (
        isThinGenericLowInfoPost(tweet) ||
        isLowInfoPileOnQuestion(tweet) ||
        getFollowTrainBaitSignal(tweet).detected ||
        computeSocialGrowthFlexPenalty(tweet, 44) != null ||
        (computeProtocolPromoPenalty(tweet, 46) != null && !developerUpdateSignal.detected) ||
        computeRiskyContentPenalty(tweet, 42) != null
      )
    ) {
      accelerationWindowBonus = null;
    }
    if (accelerationWindowBonus != null) {
      score += accelerationWindowBonus;
      breakdown.push({
        key: "accelerationWindow",
        label: "Acceleration window",
        amount: accelerationWindowBonus,
        kind: "timing"
      });
    }

    const trafficMomentumBonus = computeTrafficMomentumBonus(tweet, 14);
    if (trafficMomentumBonus != null) {
      score += trafficMomentumBonus;
      breakdown.push({
        key: "trafficMomentum",
        label: "Traffic velocity",
        amount: trafficMomentumBonus,
        kind: "distribution"
      });
    }

    const unprovenWindowPenalty = computeUnprovenWindowPenalty(tweet, 8);
    if (unprovenWindowPenalty != null) {
      score -= unprovenWindowPenalty;
      breakdown.push({
        key: "unprovenWindow",
        label: "Not moving yet",
        amount: -unprovenWindowPenalty,
        kind: "penalty"
      });
    }

    const conversationBonus = computeConversationBonus(tweet, 10);
    if (conversationBonus != null) {
      score += conversationBonus;
      breakdown.push({
        key: "conversation",
        label: "Discussion density",
        amount: conversationBonus,
        kind: "quality"
      });
    }

    const replyOpportunityBonus = computeReplyOpportunityBonus(tweet, 14);
    if (replyOpportunityBonus != null) {
      score += replyOpportunityBonus;
      breakdown.push({
        key: "replyOpportunity",
        label: "Reply room",
        amount: replyOpportunityBonus,
        kind: "quality"
      });
    }

    const sourceSurfaceSignal = computeSourceSurfaceSignal(tweet);
    if (sourceSurfaceSignal.amount > 0) {
      score += sourceSurfaceSignal.amount;
      breakdown.push({
        key: "sourceSurface",
        label: sourceSurfaceSignal.label,
        amount: sourceSurfaceSignal.amount,
        kind: "distribution"
      });
    }

    const developerUpdateBonus = developerUpdateSignal.bonus;
    if (developerUpdateBonus != null) {
      score += developerUpdateBonus;
      breakdown.push({
        key: "developerUpdate",
        label: "Developer update",
        amount: developerUpdateBonus,
        kind: "quality"
      });
    }

    const crowdingPenalty = computeCrowdingPenalty(tweet);
    if (crowdingPenalty != null) {
      score -= crowdingPenalty;
      breakdown.push({
        key: "crowding",
        label: "Crowded thread",
        amount: -crowdingPenalty,
        kind: "penalty"
      });
    }

    const trafficMismatchPenalty = computeTrafficMismatchPenalty(tweet, 18);
    if (trafficMismatchPenalty != null) {
      score -= trafficMismatchPenalty;
      breakdown.push({
        key: "trafficMismatch",
        label: "One-way traffic",
        amount: -trafficMismatchPenalty,
        kind: "penalty"
      });
    }

    const followTrainBaitPenalty = computeFollowTrainBaitPenalty(tweet, 58);
    if (followTrainBaitPenalty != null) {
      score -= followTrainBaitPenalty;
      breakdown.push({
        key: "followTrainBait",
        label: "Follow-train bait",
        amount: -followTrainBaitPenalty,
        kind: "penalty"
      });
    }

    const socialGrowthFlexPenalty = computeSocialGrowthFlexPenalty(tweet, 48);
    if (socialGrowthFlexPenalty != null) {
      score -= socialGrowthFlexPenalty;
      breakdown.push({
        key: "socialGrowthFlex",
        label: "Growth flex bait",
        amount: -socialGrowthFlexPenalty,
        kind: "penalty"
      });
    }

    let verifiedOrganizationPenalty = applyDeveloperUpdateRelief(
      computeVerifiedOrganizationPenalty(tweet, 38),
      developerUpdateSignal,
      0.24
    );
    if (verifiedOrganizationPenalty != null) {
      score -= verifiedOrganizationPenalty;
      breakdown.push({
        key: "verifiedOrganization",
        label: "Gold or official account",
        amount: -verifiedOrganizationPenalty,
        kind: "penalty"
      });
    }

    let verifiedPileOnPenalty = applyDeveloperUpdateRelief(
      computeVerifiedPileOnPenalty(tweet, 24),
      developerUpdateSignal,
      0.32
    );
    if (verifiedPileOnPenalty != null) {
      score -= verifiedPileOnPenalty;
      breakdown.push({
        key: "verifiedPileOn",
        label: "Verified pile-on risk",
        amount: -verifiedPileOnPenalty,
        kind: "penalty"
      });
    }

    const politicalFigurePenalty = computePoliticalFigurePenalty(tweet, 40);
    if (politicalFigurePenalty != null) {
      score -= politicalFigurePenalty;
      breakdown.push({
        key: "politicalFigure",
        label: "Political figure risk",
        amount: -politicalFigurePenalty,
        kind: "penalty"
      });
    }

    let broadcastAccountPenalty = applyDeveloperUpdateRelief(
      computeBroadcastAccountPenalty(tweet, 40),
      developerUpdateSignal,
      0.22
    );
    if (broadcastAccountPenalty != null) {
      score -= broadcastAccountPenalty;
      breakdown.push({
        key: "broadcastAccount",
        label: "Broadcast account",
        amount: -broadcastAccountPenalty,
        kind: "penalty"
      });
    }

    const birthdayGreetingPenalty = computeBirthdayGreetingPenalty(tweet, 26);
    if (birthdayGreetingPenalty != null) {
      score -= birthdayGreetingPenalty;
      breakdown.push({
        key: "birthdayGreeting",
        label: "Birthday thread",
        amount: -birthdayGreetingPenalty,
        kind: "penalty"
      });
    }

    const riskyContentPenalty = computeRiskyContentPenalty(tweet, 42);
    if (riskyContentPenalty != null) {
      score -= riskyContentPenalty;
      breakdown.push({
        key: "riskyContent",
        label: "Risky thread",
        amount: -riskyContentPenalty,
        kind: "penalty"
      });
    }

    let protocolPromoPenalty = applyDeveloperUpdateRelief(
      computeProtocolPromoPenalty(tweet, 46),
      developerUpdateSignal,
      0.18
    );
    if (protocolPromoPenalty != null) {
      score -= protocolPromoPenalty;
      breakdown.push({
        key: "protocolPromo",
        label: "Protocol or product promo",
        amount: -protocolPromoPenalty,
        kind: "penalty"
      });
    }

    const thinGenericPostPenalty = computeThinGenericPostPenalty(tweet, 38);
    if (thinGenericPostPenalty != null) {
      score -= thinGenericPostPenalty;
      breakdown.push({
        key: "thinGenericPost",
        label: "Low-info short post",
        amount: -thinGenericPostPenalty,
        kind: "penalty"
      });
    }

    const visionRequiredPenalty = computeVisionRequiredPenalty(tweet, mediaSemanticContext, 42);
    if (visionRequiredPenalty != null) {
      score -= visionRequiredPenalty;
      breakdown.push({
        key: "visionRequired",
        label: "Needs vision context",
        amount: -visionRequiredPenalty,
        kind: "penalty"
      });
    }

    const emptySemanticPenalty = computeEmptySemanticPenalty(tweet, mediaSemanticContext, 64);
    if (emptySemanticPenalty != null) {
      score -= emptySemanticPenalty;
      breakdown.push({
        key: "emptySemanticText",
        label: "Empty candidate text",
        amount: -emptySemanticPenalty,
        kind: "penalty"
      });
    }

    const unsupportedLanguagePenalty = computeUnsupportedLanguagePenalty(tweet, matchedLanguages, 28);
    if (unsupportedLanguagePenalty != null) {
      score -= unsupportedLanguagePenalty;
      breakdown.push({
        key: "unsupportedLanguage",
        label: "Unsupported language",
        amount: -unsupportedLanguagePenalty,
        kind: "penalty"
      });
    }

    const peakDecayPenalty = computePeakDecayPenalty(tweet, 16);
    if (peakDecayPenalty != null) {
      score -= peakDecayPenalty;
      breakdown.push({
        key: "peakDecay",
        label: "Past peak",
        amount: -peakDecayPenalty,
        kind: "penalty"
      });
    }

    matchedLanguages.forEach((language) => {
      score += language.bonus;
      breakdown.push({
        key: language.key,
        label: language.key.replace(/^lang/, ""),
        amount: language.bonus,
        kind: "language"
      });
    });

    matchedTopics.forEach((topic) => {
      score += topic.bonus;
      breakdown.push({
        key: topic.key,
        label: topic.key,
        amount: topic.bonus,
        kind: "topic"
      });
    });

    if (tweet.mediaKind === "video" || tweet.mediaKind === "gif") {
      mediaBonusPoints = VIDEO_BONUS;
      score += VIDEO_BONUS;
      breakdown.push({
        key: tweet.mediaKind,
        label: tweet.mediaKind === "gif" ? "GIF" : "Video",
        amount: VIDEO_BONUS,
        kind: "media"
      });
    } else if (tweet.hasMedia) {
      mediaBonusPoints = PHOTO_BONUS;
      score += PHOTO_BONUS;
      breakdown.push({
        key: "photo",
        label: "Photo",
        amount: PHOTO_BONUS,
        kind: "media"
      });
    }

    const topicBonusTotal = matchedTopics.reduce((sum, topic) => sum + Number(topic?.bonus || 0), 0);
    const postScore = computePostScore({
      metricPoints,
      recency: recency || 0,
      accelerationWindowBonus: accelerationWindowBonus || 0,
      trafficMomentumBonus: trafficMomentumBonus || 0,
      conversationBonus: conversationBonus || 0,
      mediaBonusPoints,
      topicBonusTotal
    });
    const reachLikelihood = computeReachLikelihood({
      replyOpportunityBonus: replyOpportunityBonus || 0,
      conversationBonus: conversationBonus || 0,
      trafficMomentumBonus: trafficMomentumBonus || 0,
      sourceSurfaceBonus: sourceSurfaceSignal.amount || 0,
      crowdingPenalty: crowdingPenalty || 0,
      trafficMismatchPenalty: trafficMismatchPenalty || 0,
      followTrainBaitPenalty: followTrainBaitPenalty || 0,
      socialGrowthFlexPenalty: socialGrowthFlexPenalty || 0,
      verifiedOrganizationPenalty: verifiedOrganizationPenalty || 0,
      verifiedPileOnPenalty: verifiedPileOnPenalty || 0,
      politicalFigurePenalty: politicalFigurePenalty || 0,
      broadcastAccountPenalty: broadcastAccountPenalty || 0,
      birthdayGreetingPenalty: birthdayGreetingPenalty || 0,
      riskyContentPenalty: riskyContentPenalty || 0,
      protocolPromoPenalty: protocolPromoPenalty || 0,
      thinGenericPostPenalty: thinGenericPostPenalty || 0,
      visionRequiredPenalty: visionRequiredPenalty || 0,
      emptySemanticPenalty: emptySemanticPenalty || 0,
      unsupportedLanguagePenalty: unsupportedLanguagePenalty || 0,
      peakDecayPenalty: peakDecayPenalty || 0,
      unprovenWindowPenalty: unprovenWindowPenalty || 0
    });
    const understandingConfidence = computeUnderstandingConfidence(tweet, mediaSemanticContext);
    const authorFit = computeAuthorFit(tweet, matchedTopics, matchedLanguages);
    const penalties = Math.round(clamp(
      (unprovenWindowPenalty || 0) * 0.4 +
      (crowdingPenalty || 0) * 0.65 +
      (trafficMismatchPenalty || 0) * 0.58 +
      (followTrainBaitPenalty || 0) * 1.18 +
      (socialGrowthFlexPenalty || 0) * 1.08 +
      (verifiedOrganizationPenalty || 0) * 0.85 +
      (verifiedPileOnPenalty || 0) * 0.65 +
      (politicalFigurePenalty || 0) * 0.95 +
      (broadcastAccountPenalty || 0) * 0.9 +
      (birthdayGreetingPenalty || 0) * 0.58 +
      (riskyContentPenalty || 0) * 0.9 +
      (protocolPromoPenalty || 0) * 0.92 +
      (thinGenericPostPenalty || 0) * 0.78 +
      (visionRequiredPenalty || 0) * 1.02 +
      (emptySemanticPenalty || 0) * 1.08 +
      (unsupportedLanguagePenalty || 0) * 0.95 +
      (peakDecayPenalty || 0) * 0.55,
      0,
      82
    ));
    const weightedScore = (
      postScore * 0.5 +
      reachLikelihood * 0.2 +
      understandingConfidence * 0.2 +
      authorFit * 0.1 -
      penalties
    );
    let clampedScore = Math.round(clamp((score * 0.35) + (weightedScore * 0.65), 0, 100));
    const executorHardCap = computeExecutorHardCap(tweet, {
      followTrainBaitPenalty,
      socialGrowthFlexPenalty,
      verifiedOrganizationPenalty,
      verifiedPileOnPenalty,
      politicalFigurePenalty,
      broadcastAccountPenalty,
      riskyContentPenalty,
      protocolPromoPenalty,
      thinGenericPostPenalty
    });
    if (executorHardCap && clampedScore > executorHardCap.cap) {
      const capPenalty = clampedScore - executorHardCap.cap;
      clampedScore = executorHardCap.cap;
      breakdown.push({
        key: executorHardCap.key,
        label: executorHardCap.label,
        amount: -capPenalty,
        kind: "penalty"
      });
    }
    const tier = getTier(clampedScore, merged, keywordMatched);
    const scoredBreakdown = breakdown
      .filter((item) => Number.isFinite(item.amount) && Math.abs(item.amount) > 0);
    const sortedBreakdown = scoredBreakdown
      .slice()
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    const positiveBreakdown = scoredBreakdown
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    const negativeBreakdown = scoredBreakdown
      .filter((item) => item.amount < 0)
      .sort((a, b) => a.amount - b.amount);

    const highlights = buildHighlights(positiveBreakdown, negativeBreakdown);
    const blockReason = computeBlockReason(mediaSemanticContext, understandingConfidence);

    const tooltipLines = [
      `Score ${clampedScore} · ${tier}`,
      `Value ${postScore} · Reach ${reachLikelihood} · Read ${understandingConfidence} · Fit ${authorFit}`,
      ...positiveBreakdown.slice(0, 4).map(formatBreakdownText),
      ...negativeBreakdown.slice(0, 2).map(formatBreakdownText)
    ];

    return {
      score: clampedScore,
      tier,
      matches,
      keywordMatched,
      matchedLanguages: matchedLanguages.map((language) => language.key),
      matchedTopics: matchedTopics.map((topic) => topic.key),
      sourceSurface: sourceSurfaceSignal.surface,
      postScore,
      reachLikelihood,
      understandingConfidence,
      authorFit,
      penalties,
      finalScore: clampedScore,
      blockReason,
      lowSemanticConfidence: Boolean(mediaSemanticContext.lowConfidence),
      breakdown: sortedBreakdown,
      highlights,
      tooltip: tooltipLines.join("\n")
    };
  }

  function analyzeTweet(tweet, settings = {}) {
    return buildAnalysis(tweet, settings);
  }

  function calcVps(tweet, settings = {}) {
    return buildAnalysis(tweet, settings).score;
  }

  function getTier(score, settings = {}, keywordMatched = true) {
    const merged = mergeSettings(settings);
    if (merged.onlyKeywordHits && !keywordMatched) {
      return "hidden";
    }
    if (!merged.enabled) {
      return "hidden";
    }
    if (score >= merged.highThreshold) {
      return "high";
    }
    if (score >= merged.highThreshold - 10) {
      return "high-outline";
    }
    if (score >= merged.goodThreshold) {
      return "good";
    }
    if (score >= merged.goodThreshold - 10) {
      return "good-outline";
    }
    if (score >= merged.displayThreshold) {
      return "medium";
    }
    if (score >= Math.max(20, merged.displayThreshold - 10)) {
      return "medium-outline";
    }
    if (score >= 10) {
      return "low-outline";
    }
    return "hidden";
  }

  global.XReplyScorer = {
    defaults: DEFAULT_SETTINGS,
    topicDefs: TOPIC_DEFS,
    languageDefs: LANGUAGE_DEFS,
    parseCount,
    calcVps,
    getTier,
    analyzeTweet,
    explainTweet: buildAnalysis,
    normalizeKeywords
  };
})(globalThis);
