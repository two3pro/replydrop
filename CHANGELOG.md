# Changelog

## 0.2.203

- 补 p2.202 双轮 Windows 压测漏网：follow / RT / like reward loop、handle drop、under-10k follower chain、support-all 互助链会被硬压到自动发送线以下
- X payout / back-pay / creator revenue 类收益炫耀继续加硬上限，不再靠流速冲过发送线
- BTC/ETH support-resistance、staking inflection、方向性 crypto wealth 叙事会被归入 crypto promo 风险并压线以下
- 官方 / 政治 / 大型广播账号的低信息帖继续加硬上限，但保留较长技术报告 / 开源技术内容的通过空间
- 修复 Mac 端 fallback inbox 可能读到 0 分候选：当前页候选分数缺失时会从真实 article 重新分析并回填本地候选快照
- `getExecutorInbox()` 现在只把可执行候选放进 `candidates`；低分 / 跳过项改放 `diagnosticCandidates`，避免 agent 把 0 分候选当成可处理推荐
- 补 p2.200 Windows 压测漏网：英文 / 日文 X payout、广告收益、入金 / 振込 / 寄付类收益炫耀会被压到自动发送线以下
- 加重 BNB meme wealth、ETH trenches、degen alpha 这类币圈财富叙事 / 产品短 thesis 扣分
- 大号低信息争议问句不再吃流速加分，避免靠回复量冲进自动发送线
- 修复 `refreshRecommendations()` 后读取候选偶发 `replydrop-api-timeout`：内容脚本现在会保留本页候选快照，background 短时无响应时直接用本地快照返回 inbox
- `getCandidates()` / `getExecutorInbox()` 不再因为扩展后台状态同步卡住而拖死 agent 流程
- 执行器新增 `refreshRecommendations()`，无合格推荐时必须刷新 / 滚动重扫至少 3 轮，不能直接报告空跑
- `getExecutorInbox()` 返回 `emptyInboxRecovery`，明确告诉 OpenClaw / Hermes 空候选时下一步要重扫
- 补 p2.199 Windows 压测漏网：韩文 X 收益 / 周薪 / 蓝 V 收益、1000 replies 互动量炫耀、辱骂 AI 奖励挑战会被压到自动发送线以下

## 0.2.199

- 收紧流速加分入口：低信息短帖、互关涨粉、展示量炫耀、协议 / 币圈增长叙事不再吃 `Traffic velocity` / `Acceleration window` 加成
- 加重 `5000+ followers / say Hi`、`919+ followers / say Want`、`Grow your page`、`reply hello / follow you` 这类 follower-exchange bait 扣分
- 新增 `Low-info short post` 与 `Growth flex bait` 惩罚，补 p2.198 flow16 压测暴露的短句鸡汤、展示量炫耀和 BNB holder-count 漏网

## 0.2.198

- 内置 X GraphQL 流量监控层，候选帖会补充 `views/hour`、回复流速、互动率、收藏 / 转发信号
- 评分新增 `Traffic velocity` 加分和 `One-way traffic` 扣分，只奖励仍有回复空间的升温帖，压低高浏览但低对话的假机会
- AI / executor 候选上下文新增 `post.traffic`，可直接读取流速阶段和实时流量指标

## 0.2.197

- 给 AI / executor 链路新增单目标时间策略：90 秒为正常目标，120 秒为硬截止
- `getExecutorCapabilities()` / `getAgentInbox()` / 候选上下文现在会暴露 `executionPolicy`，agent 可把 `targetStartedAt` / `targetDeadlineAt` 原样传回执行入口
- `openComposer()` / `submitReply()` / `runExecutorAction()` 统一检查同一目标耗时，超过 120 秒返回 `target-timeout` 且 `shouldSkipTarget=true`
- 超时目标会在当前页面会话内短期封锁，防止 agent 在同一帖反复重试；桥接超时放宽到 125 秒，优先返回插件内结构化失败而不是空结果

## 0.2.196

- 补 p2.195 Windows 压测漏网：体育电台 / 事实聚合 / Whale Alert / TrollFootball 这类广播号继续加重降权
- 产品 beta / early access / waitlist CTA、`100x / 1000x` 币圈暴富话术、会议冲突八卦新增识别，避免靠热度冲进自动发送线
- 低信息媒体帖如果缺有效 alt / OCR 语义，会新增 `Needs vision context` 扣分，不再单靠视频/图片热度拿高分
- 页面桥接把 `runExecutorAction()` 超时放宽到 45 秒，并把 open/submit/action 的桥接异常转成结构化失败，减少偶发 `empty-result`

## 0.2.195

- 补 p2.193 Windows 压测漏网：韩文 / 日文 follow bait、`reply here / active followers / payout` 这类涨粉变现诱导会被压到自动发送线以下
- 加重官方服务号、游戏品牌、BRICS / 政治新闻、交易所 / Web3 活动 / 做市宣传的广播型扣分
- 新增无匹配语言候选的硬降权，土耳其语 / 阿拉伯语等未支持语言不再靠热度进入自动发送线
- 补低质量擦边 AI 图片 prompt / token 叙事的风险扣分回归测试

## 0.2.194

- 修复引用帖 / 嵌套结构下可能点错回复按钮的问题：`openComposer()` 现在只点击当前主帖 article 自己的可见回复按钮
- 如果误开普通发帖框触发 `generic-composer-opened`，会先关闭普通框并自动重试一次主帖回复入口
- 保留 p2.193 的推荐层修复：继续压低增长变现诱导、协议 / 产品广播、币种清单和空文本候选

## 0.2.193

- 补 p2.192 Windows 压测漏网：`X payday / monetising / say hi boost`、`0 到 10k 粉丝 / 百万曝光复盘` 这类增长变现诱导会被压到自动发送线以下
- 新增协议 / 产品 / 币种宣传降权：`Arkham / OpenCode / Protocol FX / TVL / buyback / token list` 这类广播型候选不再靠热度冲高分
- 空文本且无媒体语义的候选新增硬降权，避免 DOM 抽取空壳进入推荐队列

## 0.2.192

- 继续补 p2.191 压测漏网：`@NBA` 这类官方体育品牌 / 广播号会被官方账号与广播账号双重降权
- 增长诱导新增混淆字符归一化，`gr0wing / f0ll0w` 这类写法不再绕过 follow-train 识别
- 点赞收藏诱导、死亡消息、性化八卦类线程新增风险扣分，并把低于自动发送线的复验统一返回 `value-below-send-floor`

## 0.2.191

- 继续补 p2.190 压测漏网：中文推荐关注清单、评论区集合、蓝V 增长、`write help`、持币裂变等增长诱导会被压到自动发送线以下
- 金标 / 官方品牌 / 政客账号新增 handle、名称、文本语义兜底识别，并加重广播型账号和政客内容扣分
- 文本归一化支持数学体字符和弯引号，避免 `𝕏`、`Let’s`、`“help”` 这类写法绕过规则

## 0.2.190

- 继续压低互关 / 互粉 / 涨粉 / 互推 / repost bait：新增 `mutuals / follow me / repost this / drop handle / 互关互粉 / 涨粉 / 帮转` 等识别
- `Follow-train bait` 惩罚从 `24` 提到 `38`，并加重它对触达概率和综合惩罚项的影响，避免这类帖靠回复数挤进自动发送线
- 新增 scorer 回归测试，覆盖英文 mutual/repost bait 和中文互关涨粉 bait

## 0.2.189

- 抬高 agent 自动发送门槛：低于 `54` 分或低于实时平均线的目标会在 `openComposer()` 阶段直接返回跳过，不再进入发送
- 新增 `value-below-send-floor` 阻断原因，避免 runner 出现空结果或把低价值帖误当成可发送目标
- 继续加重金标 / 官方 / 政客 / 广播型账号的风险扣分，减少高热度但低互动概率的目标进入队列

## 0.2.188

- 修复 `content.js` 非中文发送路径里的 `isChinese is not defined` 异常：自动点赞判定现在改为走文件内自带的 `isChineseText / isJapaneseText / isKoreanText` helper，不再依赖外部全局

## 0.2.187

- `submitReply()` 现在会先检查最近一次 `openComposer()` 的硬失败态；如果上一跳已经是 `value-dropped-on-open / thread-identity-conflict / reply-target-lost`，就直接原样透传，不再报二次假错
- `buildReplyComposerContext()` 拆出了 `pageLocked / composerLocked`，`queryReplyComposer(requireLocked: true)` 和 `submitReply()` 现在只认真正的 `composerLocked`
- `waitForReplySubmitReady()` 失败时会带上 `editorFound / sendButtonFound / buttonDisabled / draftReady / composerLocked / pageLocked`，方便一眼分辨到底卡在哪一步

## 0.2.186

- 修复状态页主帖识别串读：`readTweetUrl()` 现在优先按作者句柄认本帖的 status 链接，不再被引用帖 / 卡片里的别的 status 链接带偏
- `findPrimaryStatusArticle()` 现在会优先锁定当前目标帖的 URL / tweetId，避免实时复核时把别的可见帖子误当成主帖去重打分
- `openComposer()` 和 `submitReply()` 都新增发送就绪等待：回复文稿写入后会继续等发送按钮真正变为可点，不再过早落到 `send-button-disabled-but-target-locked`

## 0.2.185

- 修复 `p2.184` 把合法 `compose/post` 回复器误判成 `reply-target-lost` 的问题：现在只要回复器仍是当前目标的 pending reply，且出现 `Replying to` / `Reply` 证据，就不会再被硬拦
- `reply-target-lost` 现在只在确实出现目标句柄冲突时触发，不再把“有回复上下文但没有目标帖 URL”的合法模式误杀

## 0.2.184

- 修紧 Reply composer 的“成功判定”：`openComposer()` 不再只看到 editor 就报成功，现在必须确认回复上下文真的锁到目标帖，避免普通 `compose/post` 假阳性
- `runExecutorAction({ action: "reply" })` 在 `open -> submit` 中间增加 settle 检查，减少刚开框就立刻提交导致的 `send-disabled / context-not-locked`
- `submitReply()` 与发送按钮识别一起收紧到 reply-only 上下文，并把失败拆细成 `reply-context-missing / generic-composer-opened / reply-target-lost / send-button-disabled-but-target-locked`

## 0.2.183

- ReplyDrop 开始把页面执行入口正式收成通用 `executor` 通道：新增 `window.ReplyDropExecutor`，旧 `window.ReplyDropAPI` 继续保留为兼容别名
- 新增 `getCapabilities()` / `getExecutorInbox()` / `getExecutorContext()` / `getExecutorSchema()` / `runExecutorAction()`，让 Codex / OpenClaw / Hermes / Claude 可以走同一套动作协议
- `openComposer()` 现在也支持直接传 `tweetId`，外部执行器不必再自己拼目标帖 URL；`runExecutorAction({ action: "reply" })` 则可直接串起开框和提交

## 0.2.182

- 继续压低英文蓝 V 里常见的互关诱饵帖：新增 `Follow-train bait` 识别，像 `say hello / drop hey / follow back / gain followers` 这类“骗评论换关注”的内容即使表面回复多也会被明显降分
- 这类帖同时不再吃到 `mutual / pinned / follow-up` 的关系加成，popup 排序也同步降级，避免因为互关状态又被重新抬回高分区

## 0.2.181

- 继续压低“看起来热但你回进去只会被埋”的目标：评分新增 `Verified pile-on risk`，会对蓝 V / 金 V / 官方号里那种高赞高曝光但讨论密度偏浅的高楼层再补一层惩罚
- 生日祝福 / 纯社交庆生帖新增专门降权，不再因为短时热度和回复数把这类低转化互动帖顶进高分候选
- 互关 / 关系加成不再固定硬抬：只有已经被验证过会回流的关系才保留高加成；蓝 V / 金 V / 拥挤线程里的 `mutual` 会明显收缩，popup 排序也不再让关系状态压过真实分数和车道
- 机会加成后的 `finalScore / peakFinalScore` 同步回写，避免候选预览、二次复核和工作台排序前后读到两套分

## 0.2.180

- 修复首页“角标已经出来，但 `ReplyDropAPI.getCandidates()` 还空着”的时序错位：page API 现在会把后台 `recentCandidates` 和当前页面 DOM 上已落好的候选一起合并，不再只盯慢一拍的后台缓存
- 这次不是只修 `getCandidates()` 表面返回；`getState()`、`getAgentInbox()`、`getCandidateContext()`、`addToQueue()`、`markShipped()`、`skipCandidate()` 也统一改成走同一份合并候选视图，避免 AI 先看见候选、下一步动作却又说 `candidate-not-found`
- 新增 `pageCandidateSync` 调试字段，能看出当前 page API 到底用了多少后台候选、多少 DOM 候选，以及这一拍是否正在扫描中

## 0.2.179

- 候选现在会保留同一条帖在首页预览阶段见过的峰值分数与来源面；进到帖子主页后，`getCandidateContext()` 会附带 `recheck`，明确告诉 AI 这条机会是稳定、降级还是该直接跳过
- `openComposer()` 新增打开后二次复核：如果主页实时分已经跌到当前平均线以下，就直接返回 `value-dropped-on-open / 打开后价值已下降`，不再继续拉起回复框让 agent 白费一次动作
- popup 侧同步接住这个新阻断原因，并保留 `peakFinalScore / peakSourceSurface / peakObservedAt`，方便前台后续继续把“预览高、落地低”的价值变化展示出来

## 0.2.178

- 评分继续压低政客 / 公职人物 / 竞选型徽标账号：新增 `Political figure risk` 惩罚，优先识别作者 handle / 名称里的公职头衔与竞选身份，再结合单向传播结构一起降分
- 这层不是粗暴打死所有政治话题；普通人在聊政策、新闻或选举不会直接被这一条误杀，重点压的是“乱评论风险高、但作者基本不会接你”的政治人物账号

## 0.2.177

- 继续压低金标 / 机构型认证账号：内容脚本现在会区分 `gold / government / blue`，评分器新增 `Gold or official account` 惩罚，金标品牌号和官方号不再轻易压过更容易接住互动的真人帖子
- `submitReply(options)` 新增 agent 专用 `autoLikeIfChinese`，发送成功后会只在中文主帖上补点赞，并把 `likeAttempted / likePerformed / likeState` 一起回给自动化
- `AI 执行台` 的 shortlist 候选卡改成独立收口布局，不再让右侧票根 stub 挤压正文和操作按钮

## 0.2.176

- `window.ReplyDropAPI` 新增 `getAgentInbox(options)`、`getCandidateContext(tweetId, options)`、`getReplySchema()`，ReplyDrop 开始直接给 AI agent 输出 top shortlist、单条候选上下文包和标准输出 schema
- popup 的 `AI 回复` 面板改成真正的 `AI 执行台`：前台不再展示模板草稿逻辑，而是展示 top 6 shortlist、当前候选上下文复制、inbox 复制、schema 复制和直接打开回复框
- 原来的草稿层降级成 `规则草稿台`，继续作为人工 / 开源 fallback 保留，不再伪装成 AI 最终文稿

## 0.2.175

- 修复 popup 首页切到仪表盘时的无障碍焦点错误：现在会先释放旧页焦点，再隐藏旧页并把新页设为活动焦点区域，不再在扩展错误页里刷出 `Blocked aria-hidden`
- 视图切换补上 `inert` 状态，隐藏页不再继续保留可交互焦点，Chrome 的扩展诊断会更干净

## 0.2.174

- `AI 回复` 面板前台收口成正式回复草稿流：不再把内部设计逻辑、路数说明、roadmap 卡直接展示给用户
- 草稿生成新增前台可见高亮清洗：`Freshness +14`、`Reply room +14` 这类内部评分诊断词不会再混进回复文稿或复制结果
- 草稿工作台简化为实际动作面板，只保留正式稿查看、复制、直接打开回复框和排期，不再要求先看一整套策略说明

## 0.2.173

- 回复交接页增加一次自动短重试：状态页刚切完时不再第一次轻微抖动就直接判失败，返回结构也会带上 `retried / retryCount`
- 状态页主帖识别改成优先信 `location.href` 并直接取当前线程主卡片，引用帖里的 `status` 链接不再覆盖主帖判断
- `openComposer` / pickup 快照 / `submitReply` 现在都会附带更产品化的阻断信息：`reasonCode / reasonLabel` 统一收口到 `上下文未锁定 / 主帖识别冲突 / 已回复过 / 发送后未验证到`
- popup 侧同步显示这些阻断原因，并在自动重试发生过时直接提示 `已自动重试 x 次`

## 0.2.172

- 评分从单一总分继续往多维判断推进：`scorer.js` 现在会额外产出 `postScore / reachLikelihood / understandingConfidence / authorFit / finalScore`，并把来源页权重接入主评分
- 新增来源页信号：`For You > Following > Search > Notifications`，不再把不同分发面上的帖子当成同一层机会
- 候选上报链路真正放宽到 16 条：内容脚本不再只截前 8 条，后台和工作台现在能完整接住 `抓16`
- 低理解置信度的纯视觉候选会带 `vision_required_but_missing`，不会再进入 actionable 候选列表

## 0.2.171

- 候选池上限从 12 提到 16：现在一次会保留更多首页里已经打过分的帖文，减少刚刷到就被截断的情况
- `AI回复` 的优先级板、候选预览和增长联动统一扩到前 6 条，不再是表面能看到更多，但内部仍只按前 3 条算

## 0.2.170

- 撤回 `p2.168` 对弱语义媒体帖的直接扣分：图片 / 视频帖现在恢复原本媒体权重，不再因为“正文短、alt 弱”这条规则被额外压分
- `lowSemanticConfidence` 和候选卡上的 `媒体语义弱` 提示仍然保留，所以现在的策略变成“提醒你这条需要视觉判断”，而不是“先把它打下去”
- 配合 `p2.169` 新增的 `getMediaBundle(tweetId)`，当前路线明确收成两段：评分层负责把媒体帖保留在候选里，agent 再按需自己去看图 / poster / 首帧

## 0.2.169

- 新增 `window.ReplyDropAPI.getMediaBundle(tweetId)`：不再让 agent 自己在整页 DOM 里猜哪张图、哪个视频属于哪条候选；现在可以直接按 `tweetId` 取回对应帖子的媒体清单
- 返回内容不是重 OCR / vision 结果，而是稳定媒体引用层：图片 `src`、视频 `poster/src`、`alt`、时长文本、尺寸和当前可见区域都会一起带上，更适合让 agent 自己决定什么时候截图、看图或裁图
- 这版继续坚持“扩展负责定位媒体，agent 负责理解媒体”这条路线，所以不会在 ReplyDrop 里重复造一套重视觉能力

## 0.2.168

- 纯媒体帖不再只靠 `tweetText` 猜内容：`content.js` 现在会额外读取图片 / 视频附件里可用的 alt / aria 语义，并把这部分一起喂给评分器和候选摘要
- `scorer.js` 新增 `Media context weak` 惩罚：当一条帖子主要是媒体、正文过短、又没有有效 alt 时，会被标记成低语义置信度并主动降分，避免“看不懂图但分很高”的帖子继续顶到前排
- 如果媒体帖本身有足够说明文案，或者附件 alt 已经能提供清晰上下文，就不会吃这道惩罚；同时 alt 里的真实语义也会参与主题匹配，候选卡会额外显示 `媒体语义弱` 提示

## 0.2.167

- 评分继续往“更容易接住互动”收：新增 `authorName` 采集，并对“认证 + 机构/广播特征 + 单向播报互动结构”的账号追加 `Broadcast account` 惩罚，减少官方播报号、媒体播报号、品牌公告号继续靠热度顶到前排
- 这次不是粗暴打压所有金钩；如果认证账号本身更像真人对话、提问或讨论串，惩罚会明显减轻，避免把真正会回你的认证个人号一起错杀
- README、`AUTOMATION.md`、冒烟文档和商店说明同步补上 `openComposer(payload)` / `submitReply()` 能力，并把过时的“不自动点击发送”表述改成更准确的“不会后台无人值守批量发帖”

## 0.2.166

- 合并 Windows 侧已验证的 composer 修复，把 `window.ReplyDropAPI` 扩展到 `openComposer(payload)` 与 `submitReply()`，不再要求外部自动化自己猜 X 的输入框和发送按钮
- `content.js` 的 `queryReplyComposer()` 改为优先命中可见的 `[data-testid="tweetTextarea_0"][role="textbox"]`，再回退旧 `contenteditable` 选择器，显著降低命中隐藏层/旧层导致的“重影输入”
- 新增 `submitReplyDropComposer()`，发送前会优先选择真实可见的 reply submit button，并复用扩展内部的 outcome 监控链路读取 toast 结果，继续沿用 ReplyDrop 自己的回帖闭环而不是回到外部 DOM 注入路线

## 0.2.165

- 把 `机会分` 的字段从时间线角标一路贯通到 `background.js`、`content.js`、`popup.js`，`baseScore / opportunityBoost / relationshipStatus / attributionKind` 不再在状态同步时丢失
- 工作台候选卡、AI priority board、copilot meta 现在会直接显示 `机会 +x` 和 `基础 x`，测试时能直观看到一条候选是靠真实回复空间上来，还是只靠底层热度撑起来
- 队列档位判断也改成机会驱动：互关、作者记忆、已验证 handle 这些信号会把中等热度但更容易形成来回互动的帖子提前推到 `现在接 / 今晚看`

## 0.2.164

- 重做 `scorer.js` 的主评分方向，不再把大号热帖的 `views / likes / followers` 当成绝对正反馈，而是明显提高“中等热度但仍有回复空间”的线程分数
- 新增 `Reply room` / `Author memory` / `Mutual lane` 这类机会信号，并把 `replydrop-attribution-core.js` 接进时间线实时打分，让曾经被作者接住过、或你手动标记成互关/跟进的账号直接抬分
- 强化广播型大帖的埋帖惩罚：浅回复比、点赞远高于回复、线程已挤爆的帖子会更主动降分，避免候选列表继续被“看起来很火但回进去就沉”的帖子占满

## 0.2.163

- 把票面外壳底边从 `1px` 收口改成 `2px` 深色底边，让底部四个半圆不再踩在一条发灰细线上
- 同时把 `.ticketBottomCut` 的透明度提回 `1`，避免底边和半圆交界处再出现一层发白的灰边
- 这版按扩展运行态 popup 重新放大检查底部四个半圆后发版，用 `p2.163` 替换掉底边仍有细缝感的 `p2.162`

## 0.2.162

- 把整张票面外壳 `.ticketSheet` 左右两侧那条 `1px` 浅棕边框改成和半圆缺口同色的深色边，先把黑边与半圆之间那根亮线本体消掉
- 首页中段白卡 `ticketSection` 的左右伪元素补上真正生效的 `!important` 外移，避免看起来黑边已经对上、半圆却还差一列像素
- 这版按扩展运行态 popup 重新抓图复查，确认 `HOME ENTRY`、中段白卡、footer 三组侧边切口都不再夹着亮色分界线后，用 `p2.162` 替换掉仍有细缝的 `p2.161`

## 0.2.161

- 按运行态截图量出了上下两组与中间白卡之间正好差 `15px`
- 所以上面 `HOME ENTRY` 那组从 `16px` 推到 `1px`，footer 那组从 `0px` 推到 `-15px`
- 这次不是凭眼睛猜，而是把三组直断面都量到同一条线上后才发版，用 `p2.161` 替换仍未贴齐的 `p2.160`

## 0.2.160

- 撤销了上一轮把中间白卡去对齐上下两组的错误方向
- 保持中间白卡不动，只把 `HOME ENTRY` 与 footer `RD-HOME-ENTRY` 两组半圆往黑边方向推回去
- 具体把首页目标切口横向基线改成 `16px / 0px` 组合，让上下两组去贴中间那条正确黑边线，再按运行态 popup 复查后发版

## 0.2.159

- 把首页白卡 `ticketSection` 的左右边界从 `16px` 收到和上下切口一致的 `18px`
- 因此 `HOME ENTRY`、中间白卡侧切口、footer `RD-HOME-ENTRY` 三组半圆的直断面终于落到同一条竖线上
- 这次按扩展运行态 popup 复查后再发版，用 `p2.159` 替换纵向直断面仍没对齐的 `p2.158`

## 0.2.158

- 把 `HOME ENTRY` 和 footer `RD-HOME-ENTRY` 的四个侧边切口从会被容器裁掉的 `background` 画法改回真正可跨线的独立半圆
- 因此这四个目标切口不再显示成贴在线下面的 `1/4` 圆，而会真正以半圆方式跨过粗虚线和 footer 顶边
- 这次不只看 `file://` 源码图，也重新抓了 `chrome-extension://.../popup.html` 的运行态截图后才发版，用 `p2.158` 替换判断失误的 `p2.157`

## 0.2.157

- 把 `HOME ENTRY` 左右半圆从最外侧黑壳收回，直边重新贴回票面内部的黑黄分界线
- 把 footer `RD-HOME-ENTRY` 左右半圆也收回到同一条黑黄分界线，同时继续对准 footer 顶边
- 重新检查右侧 `Admit One` sidecar 上下半圆后才重新打包，用 `p2.157` 正式替换掉几何方向错误的 `p2.156`

## 0.2.156

- 你标红叉的四个侧边半圆继续外推，这次不再贴在黄底内部，而是直接贴到票面最外侧黑边
- `HOME ENTRY` 左右半圆仍对着上方粗虚线，`RD-HOME-ENTRY` 左右半圆仍对着 footer 顶边，只修横向落点，不再漂在中间
- 这版是专门替换掉错误打包的 `p2.155`，不再复用那份错位安装包

## 0.2.155

- 首页 `HOME ENTRY` 与底部 `RD-HOME-ENTRY` 的四个目标半圆改为直接跟票面黑黄分界线绑定，不再混入整张票壳的旧侧边切口
- footer 中间那颗误导视线的旧黑点来源已移除，顶部粗虚线和底部顶边现在各自只保留左右一对真半圆
- 这次按宽截图自检把右侧也拍全后再打包，避免再出现“源码看着改了、实际右边没进图”的误判

## 0.2.154

- `HOME ENTRY` 两侧半圆不再贴在 divider 容器的外边缘，而是直接对齐票面的 `18px` 黑黄分界线
- 底部 `RD-HOME-ENTRY` 两侧半圆按 footer 的真实缩进重新补到外缘边界，不再看起来缩在黄底里面
- 这次是针对你指出的那四个半圆做的定点修正，不再只是继续叠新的装饰层

## 0.2.153

- 把票根半圆修正正式收口成一套几何规则，`HOME ENTRY` / `Admit One` / 底部裙边不再各走各的旧样式
- `HOME ENTRY` 现在由单条粗虚线和两侧真半圆共同控制，圆心不再漂回下方细线
- `Admit One` 与底部裙边半圆继续锁在黑黄分界线上，底部保留左右各两枚、圆弧朝内的票根切口

## 0.2.152

- `HOME ENTRY` 这组半圆和虚线不再用 `50%` 居中定位
- 现在半圆圆心与上方那根更粗的虚线绑定到同一条固定轴线上，不会再对到下方细线

## 0.2.151

- `RD-HOME-ENTRY` 这对底部左右半圆不再沿用 footer 旧的 `18px/22px` 内缩
- 现在直接跟上面白卡侧边半圆共用 `16px` 基准线，避免上下切口错开

## 0.2.150

- `RD-HOME-ENTRY` 页脚区域不再沿用旧的 `22px` 内缩，整段 footer 现在直接对齐黑黄分界线
- 因此这一区域左右黑色半圆的直边也会落在同一条黑黄分界线上，而不是继续卡在票面内部

## 0.2.149

- 首页票根左侧长竖线与 `Admit One` 票根上下半圆整体左移，直边贴到黑黄分界线
- `Home Entry` 左右外侧半圆、仪表盘白卡左右外侧半圆、底部 `RD-HOME-ENTRY` 左右半圆全部收口到外缘黑边
- `Gate D01` 中间那对多余半圆已移除，只保留外侧票根切口

## 0.2.148

- 所有黑色半圆切口进一步统一到和底部同一规格
- 首页上部分界线、工作台侧切口、底部侧切口现在都按同一半径和同一贴边方式收口

## 0.2.147

- 把票根切口从“混合了圆点/渐变假切口”重新收回真正的半圆几何
- 工作台卡片侧边、首页底部侧边、头部侧票根切口都统一成同一套黑色半圆

## 0.2.146

- 面板里此前新增的黑色/灰色圆点装饰统一改成黑色半圆切口
- 半圆统一为直边朝外、圆弧朝内，并贴齐各自所在的黑黄分界线或卡片边界

## 0.2.145

- 页内左下角已回复小水滴的勾号重新加深并改成更清晰的 `✓`
- 已回复液滴芯也稍微降亮，避免勾号再次被玻璃高光吃掉

## 0.2.144

- 首页头部左右黑边改成真正向下延伸的独立竖线
- `HOME ENTRY` 两端黑点从中线挪到上方票面分界线端点
- 首页底边补成 5 个半圆切口，同时左右侧边也补上内向半圆切口

## 0.2.143

- 底部票根切边翻转成了圆弧朝上、直边在下
- 同时把对应虚线一起下压到黑黄分界线，底边关系更贴近真实票根

## 0.2.142

- 首页 `HOME ENTRY` 分界线两端不再使用黑色票根切边，
  改成对齐虚线轴线的实心黑圆点，边缘关系更干净

## 0.2.141

- 首页 `今日已回复` 统计卡的大数字改成了更深的墨青色，
  不再跟浅灰蓝底混在一起，读数对比度更稳

## 0.2.140

- 收掉了悬浮水滴顶端那根越界高光：
  - 给浮动水滴内部高光和滴芯加了轮廓裁切，不再让白色斜线撑出水滴外面
  - 同时把顶端高光本体缩短并回收到滴尖内部，避免呼吸动画时像长出天线

## 0.2.139

- 把 X 页面里的悬浮水滴往 Gemini 封面图那种质感推进了一轮：
  - 悬浮按钮从单层平面渐变改成多层玻璃滴芯、水滴外缘冷光和柔和外晕
  - 候选数计数改成半透明小胶囊，不再直接压在高光最亮的位置上
  - 帖子旁边的小水滴分数徽章也同步换成更立体的液滴结构，产品语言终于更统一
- 这轮没有再动交互路径，重点就是把“看起来像临时占位”的旧水滴换掉，
  让你发 X 介绍 ReplyDrop 时，页面里的真实水滴至少和封面图在同一个审美方向上

## 0.2.138

- 继续推进本地下一版收口，但不打断当前商店送审：
  - 首页、仪表盘和增长面板的默认说明文案再压短一轮
  - 工作台子页签现在更像真正的票根分色 stub，而不是普通切换按钮
  - dashboard preview strip 改成更紧凑的三列 deck snapshot
  - 面板底部切边改成更低密度的三段半圆切口，层次更干净
- 同时补了一份专门面向商店复审/答辩的 FAQ：
  - `docs/store/CHROME-WEB-STORE-REVIEWER-NOTES.md`
  - 把单一用途、权限理由、本地存储、主机权限、remote code 和“不自动发帖”边界集中成一份说明

## 0.2.137

- 把 Chrome Web Store 提交材料从“差不多够了”补到“可以照着填表”：
  - `scripts/generate-store-assets.py` 新增 Small promo tile、Marquee promo tile、promo video poster 和本地 promo video 产出
  - `docs/store/CHROME-WEB-STORE-LISTING.md` 补上新素材入口
  - 新增 `docs/store/CHROME-WEB-STORE-SUBMISSION.md`，把上架字段、权限解释、隐私答卷和 reviewer 测试说明收成一份可直接粘贴的答卷
- 所以这轮重点不是继续堆功能，而是把商店提交最后缺的门面和表单材料补齐

## 0.2.136

- 继续把公开仓门面从“能用”往“像产品页”推进一轮：
  - README 顶部新增真正的 GitHub hero
  - 新增一条更像产品演示的 `replydrop-github-demo-loop.gif`
  - 首页首屏现在先讲清楚实时打分、本地闭环和 Agent 接管，而不是先让人掉进长文档
- 商店截图也重新收了一版，不再只是“有图可交”：
  - `scripts/generate-store-assets.py` 现在会生成 5 张更完整的 Chrome Web Store 截图序列
  - 新增语言 / 主题加成这张独立截图
  - 原有截图的排版和文案力度也一起重做
- `docs/store/CHROME-WEB-STORE-LISTING.md` 同步补上：
  - 新的 5 图推荐顺序
  - GitHub hero / demo loop 资产入口

## 0.2.135

- 把公开仓缺的“首批门面内容”一次补齐，往真正可上架再推一步：
  - 新增扩展图标并接入 `manifest.json`
  - 补上 `icons/icon16.png`、`icon32.png`、`icon48.png`、`icon128.png`
  - 让弹出按钮、扩展列表和正式打包都不再处于无图标状态
- 新增一套可复用的商店素材：
  - `docs/store/CHROME-WEB-STORE-LISTING.md`
  - 4 张 `1280x800` 的 Chrome Web Store 截图
  - 一句话卖点、短描述、详细描述和隐私摘要
- 新增 `scripts/generate-store-assets.py`
  - 用当前 repo 里的真实界面截图生成商店图和图标预览
  - 让后续 UI 再更新时不必重新手工拼门面素材
- `README.md`、`PRIVACY.md`、运行时文件清单和公开导出清单也同步补上：
  - 商店素材入口
  - Chrome Web Store 可直接复用的隐私摘要
  - `icons/` 进入运行时打包和公开导出

## 0.2.134

- 新增两道发版护栏，补上“最后一米”的自动审计：
  - `scripts/check-doc-links.mjs`
    - 校验公开导出范围内的 markdown 相对链接和图片资源是否真实存在
  - `scripts/check-packaged-release.mjs`
    - 校验 zip 内文件集合是否与 `scripts/runtime-files.txt` 完全一致
    - 同时再次核对包内 `manifest.json` 版本
- `validate-release.mjs` 现在会顺手检查公开文档链接
- `package-release.sh` 现在在打包后自动审计 zip 内容，不再只看版本号
- `README.md`、`CONTRIBUTING.md`、`RELEASING.md` 也同步补上这两道检查的入口
- 所以这轮更像总回归收口：
  - 让开源仓更不容易因文档断链或发包漂移翻车
  - 也让最后的 release 质量更接近“机器先挡一遍，人再看一遍”

## 0.2.133

- 补齐一份面向公开仓协作者和自动化调用方的独立 API 文档：
  - 新增 `AUTOMATION.md`
  - 把 `window.ReplyDropAPI` 的读写方法、返回字段、错误语义和 CDP 示例收成单独入口
- `README.md` 收紧成更像公开仓首页的文档地图：
  - 增加 `先看哪几份文档` 导航
  - Automation API 章节不再把所有细节堆在首页，而是链接到独立文档
- `SMOKE-TEST.md` 和 `SUPPORT.md` 也同步纳入 API 冒烟与排障路径
- 所以这轮更像开源收口：
  - 不是继续堆功能
  - 而是让新协作者、自动化调用者和首次试用者更快接得住仓库

## 0.2.132

- 新增一套面向 Ada / CDP 的稳定操作接口，不再要求自动化脚本去点 popup 或识别截图
- 在 `x.com` 页面注入 page-world `window.ReplyDropAPI`
  - `getCandidates()`
  - `getQueue()`
  - `getState()`
  - `addToQueue(tweetId)`
  - `markShipped(tweetId, replyText)`
  - `skipCandidate(tweetId)`
- 这套接口走的是 ReplyDrop 现有真状态链路
  - `addToQueue` 会进入真实回复队列
  - `markShipped` 会走现有 shipped / pickup 生命周期
  - `skipCandidate` 会落到现有 dismissed candidate 逻辑
- 同时把 API 输出收成更稳定的 bot 形状：
  - 候选返回 `tweetId / score / tier / topicTags / author / textSummary / url`
  - 队列返回 `pending / shipped / done`
  - `getState` 直接给完整快照，方便调试和无人值守 automation

## 0.2.131

- 这轮不再泛化打磨，只修两个实际错误：
  - `打开仪表盘` 票条中间错误出现的黑点去掉
  - 左侧多余黑条去掉，避免挡字和抢视线
- 同时按“间隔一个”的方向重排底部裙边：
  - 半圆密度减半
  - 位置整体更贴边
  - 不再是一排过密的黑半圆

## 0.2.130

- 最后一轮只做终版收口，不扩功能、不碰滚动结构
- 重点把首页入口和仪表盘头部统一成更完整的一套票根语言：
  - 修正首页票面的静态 serial 漂移
  - 仪表盘入口和仪表盘头部补上更一致的 dark rail / serial / print-strip 节奏
  - 首页到仪表盘不再像“两张风格接近的票”，而更像同一套成品
- 这轮也顺手把真正显示给用户的首页说明文案再压稳了一层：
  - 首页说明
  - 总开关提示
  - 页内入口提示
  - 仪表盘入口说明
- 所以这轮更像最后一层整合，而不是继续做新效果

## 0.2.129

- 这轮继续只收成品感，不碰滚动结构
- 首页票面的微调重点放在接缝与票口几何：
  - sidecar 的黑边和半圆切口关系更明确
  - 数字、serial、barcode 也统一到更像印刷票面的数字节奏
- 仪表盘高频卡片继续做最后一层排印统一：
  - 标题条统一改成更稳定的顶对齐
  - serial / meta / 数字统一做 tabular 节奏
  - 正文宽度和段落节奏再压稳一点
- 所以这轮更像终版前的微校准
  - 而不是继续堆新的装饰效果

## 0.2.128

- 这轮把上次提到的两件事一起做了，不再拆成二选一
- 首页 `hero poster` 继续往真实印刷票面推进：
  - 顶部 band 补上 serial / admit 细节
  - poster 主画面补上更明显的 print line、watermark 和 sidecar barcode 编码感
  - 整体更像一张真正印好的票，而不只是带电影配色的入口卡
- 仪表盘高频卡片的排印也继续压稳：
  - 标题、正文、meta、serial 的层级更清楚
  - 看板 / 队列 / 关系 / 草稿这些最常扫读的卡片更 calm
  - 仍然没有去碰滚动容器和面板结构

## 0.2.127

- 这轮回到 popup 成品感，只收仪表盘内部卡片，不碰滚动结构
- 重点把 `看板 / AI回复` 里最常见的几类卡片再往同一张电影票根系统里拉近：
  - 增长卡、队列卡、关系卡、草稿卡、记忆卡现在共享更统一的左侧 stub rail
  - rail 上补了和外层票面同方向的黑边与切口节奏
  - 卡片内容层也统一抬到 rail 之上，减少“外面像票、里面像普通后台卡片”的割裂感
- 所以这轮之后：
  - 外层整张票和内层工作卡的语言更接近
  - 但没有去碰滚动容器、面板层级和当前稳定的交互路径

## 0.2.126

- 这轮先补开源发布硬度，不碰滚动结构
- 新增一套明确的 clean export 流程：
  - `scripts/open-source-files.txt` 作为公开树唯一白名单
  - `scripts/check-open-source-export.mjs` 校验导出列表、禁入项和缺失路径
  - `scripts/export-open-source-tree.sh` 一键生成干净的公开仓快照
- `validate` 现在会顺手检查 open-source export，不再只验证运行时包
- `package.json`、`README.md`、`RELEASING.md`、`CONTRIBUTING.md` 也同步接入 `check:oss` / `export:oss`
- 所以从这版开始：
  - 本地工作目录可以继续保留内部 handoff、zip、截图
  - 但公开发布时已经有一条稳定、可复用、可验证的干净导出链路

## 0.2.125

- 这轮继续只收电影票根边缘，不扩功能
- 重点把整张票的边缘关系统一成一套：
  - 整体票面左右边现在补上更明确的黑边底色与侧边切口
  - 侧边切口的圆心重新压回侧边虚线，不再只是贴边的装饰圆角
  - `Home Entry` 这类 divider 也和整张票共用同一套黑边 + 切口逻辑
  - 最底部齿口改成更接近“两齿一空”的稀疏节奏，票根味更强

## 0.2.124

- 这轮只收电影票根几何，不扩功能
- 重点把你指出的两处“像装饰、不像切口”的地方改正：
  - `Home Entry` 这条 divider 的左右半圆切口现在贴回票面最外缘
  - 半圆圆心重新对齐中间虚线，不再悬在黄纸里
  - 最底部裙边改成更稀疏的票口节奏，不再整排过密
  - 底部切口也一起压到票面外沿，更像真正撕口而不是印花

## 0.2.120

- 这轮继续只收 popup 的成品感，不扩功能
- 重点回到首页正面票根：
  - poster 区补上了侧边 stub、barcode 和底部规格栏
  - 主标题、kicker、cast line 现在更像真正海报票面，不再主要依赖 pseudo text
  - section title / summary / status value 也一起补了一层更稳定的排印
- 所以这轮之后，首页第一屏更像完整票根正面
  - 不只是一个做得漂亮的入口容器

## 0.2.119

- 这轮继续不扩功能，专门把首页入口和仪表盘头部往真正的电影票根结构上再推一步
- 重点补的是之前还不够到位的“断口 / 序列条 / 切缝”：
  - 首页和仪表盘之间现在重新有了真正的 divider rail
  - `打开仪表盘` 入口和 dashboard header 的 stub 区也补上了更明确的 tear-stub cutout
  - 首页的语言条、入口提示和状态条也加回了更克制的 print label / serial 节奏
- 所以这轮之后，ReplyDrop 的票根感不再主要靠渐变和纸张纹理
  - 而是开始有更明确的票面结构

## 0.2.118

- 这轮继续不扩产品面，专门收仪表盘里最容易掉回“设置页”的几块 utility panel
- 重点把 `概览 / 加成 / 关键词` 再往电影票根系统里拉一层：
  - `概览` 的动作按钮和状态卡更像票面控件，不再像普通后台按钮
  - `加成` 的 score guide / note / filter 也补上更统一的票区节奏
  - `关键词` 的折叠区、chip、输入框一起收回同一套纸张和边线语言
- 所以这轮之后，仪表盘四个主页签的气质更一致
  - 不会一切到工具面板就突然掉回“网页设置区”的感觉

## 0.2.117

- 这轮继续补的是 panel 的节奏和动势层级，而不是再扩功能
- 重点收了两层：
  - dashboard section 的 reveal 更轻、更有主次
  - 工作台子页签现在更像一条票面导轨，而不是两个普通按钮
- 同时继续压 hover 里的位移量
  - 让 ReplyDrop 的动势更克制
  - 不再让每一层都抢同样的注意力

## 0.2.116

- 这轮继续补 dashboard 里最常看的票条列表，而不是外围容器
- 重点收的是候选 / 反馈这些 `deskItem` 的阅读顺滑度：
  - 列表容器更像一块完整票本
  - 标题、正文、meta、reason、stub 的层级更清楚
  - 高频阅读时会更稳，不那么躁
- 所以这轮之后，ReplyDrop 最常被看到的列表内容也更接近成品

## 0.2.115

- 这轮继续回到 popup 本体，补的是 dashboard 内部卡片的排印和节奏
- 重点不是再加新模块，而是让增长卡、队列卡、关系卡、草稿卡更像同一套票面系统
- 这版主要收了：
  - 更统一的左侧票面边线
  - 更清楚的 serial / 数字 / 说明文层级
  - 更稳定的 header divider 和卡片阅读节奏
  - queue filter 的交互反馈和字面秩序
- 所以这轮之后，dashboard 已经不只是“分层对了”
  - 内部内容的视觉语言也更一致

## 0.2.114

- 这轮继续补公开仓的演示层
- 新增了一个轻量循环 demo：
  - `docs/assets/replydrop-demo-loop.gif`
  - 基于当前真实界面截图整理
  - 用来快速展示首页入口、仪表盘分层和 Growth Dashboard
- `README.md` 现在不再只有概念图和静态截图
  - 也多了一层可直接浏览的 demo 预览
- 这让公开仓首页更接近一个真正可理解、可快速评估的产品页

## 0.2.113

- 这轮继续补 popup 的交互成品感，而不是再扩功能面
- 重点是加一层克制的票面微动势：
  - home / dashboard sheet 切换更顺
  - `打开仪表盘`、返回按钮、页签、工作台子页签都有更明确的 hover / focus 反馈
  - ticket section 在操作时也更像一张会被拎起来的票区
- 同时补上了 `prefers-reduced-motion`
  - 让 ReplyDrop 的成品感不依赖强动画
  - 对开源产品也更稳妥

## 0.2.112

- 这轮继续补开源仓的真实展示层，而不是只停留在概念图
- 把已经实测过的 popup / 仪表盘 / Growth Dashboard 截图整理进 `docs/assets`
- `README.md` 的预览区现在不只有 SVG 概念资产
  - 还会直接展示当前产品的实机界面截图
- 所以公开仓首页现在更像真正可评估的产品页
  - 不是只知道设计方向
  - 也能直接看到当前版本已经做到了什么样子

## 0.2.111

- 这轮从仓库门面回到插件本体，继续补 popup 的成品感
- 重点不是再加功能，而是把已经分层的仪表盘做出更明确的“不同票区”身份
- `工作台 / 概览 / 加成 / 关键词` 现在不再只是换内容
  - 每个页签都有自己的 panel serial、hint strip、票面 tint 和 header 气质
- 所以用户切换页签时，感受到的不再只是“同一块长面板里翻不同内容”
  - 而更像进入不同功能票区
- 这轮也顺手把 dashboard 活跃页签状态继续同步到 DOM
  - 让视觉状态跟真实激活页一致

## 0.2.110

- 这轮主要补的是公开仓展示层，不再继续深磨 heuristic `AI回复`
- 新增仓库展示资产：
  - `docs/assets/replydrop-ticket-hero.svg`
  - `docs/assets/replydrop-workflow-strip.svg`
- `README.md` 也重写成更像公开仓首页的结构：
  - 开源快照
  - 当前边界
  - 预览图
  - 工作流
  - 协作边界
- 所以这版开始，ReplyDrop 不只是“仓库里有文档”
  - 而是已经有一套能对外说明自己是什么、长什么样、现在做到哪一步的展示门面

## 0.2.109

- 这轮不再继续打磨 `AI回复` 本身
- 先按开源目标回看了一遍基础件：
  - README / LICENSE / CONTRIBUTING / SECURITY / SUPPORT / Issue 模板 / CI / validate / package 都在
  - 所以已经没有明显“不能公开仓”的硬阻塞
- 重点于是切回 popup 成品感，把界面从“有票根皮肤的工具面板”继续往“真正像电影票”推进
- 首页补回了更强的票面元素：
  - 海报头
  - 票号尾注
  - 底部半圆切口
- `打开仪表盘` 入口也改成更像撕口票根，不再像普通渐变按钮
- 仪表盘头部与区块标题重新强化了票号、切缝和票面印刷感

## 0.2.108

- `AI回复` 这轮继续不碰大结构，只补最实际的正文可发性
- `改写工作台` 新增：
  - `收成直发版`
- 这个动作不是再生一条新草稿
  - 而是把当前工作稿里的说明腔再压一层
  - 去掉一部分 `我会怎么回 / 更像真人 / 不像模板` 这种 meta 味
  - 收成更短、更像直接发出去的 1-2 句
- 所以到这版为止：
  - `AI回复` 已经不只是“能出草稿 / 能带去回复框”
  - 还多了一步本地直发收束
  - 更接近真正可出手的 heuristic copilot

## 0.2.107

- `AI回复` 这轮补了一条更像真产品的出手链路
- 之前工作台已经能：
  - 出草稿
  - 改写
  - 复制
  - 排队
- 但还差一个最直接的动作：
  - 把当前工作稿直接带去 X 的回复框
- 现在 `改写工作台` 新增了主按钮：
  - `直接打开回复框`
  - 会先保存当前工作稿
  - 再把它直接带去目标帖的 composer
- 所以这版开始，`AI回复` 已经不是“只能看草稿”
  - 而是一个可直接出手的本地 copilot
  - 当然它仍然不是模型型 AI，只是可用性已经明显更完整

## 0.2.106

- 这轮同时把 `评分权重` 和 `AI回复` 往“早期起速 + 独特主意”上压了一层
- 评分现在更偏：
  - 发出约 1 小时内
  - 已经有可见曝光
  - 还在继续加速
  - 回复区有讨论空间但还没挤死
- `scorer.js` 新增了几种更贴近目标帖的判断：
  - `Acceleration window`
  - `Not moving yet`
  - `Past peak`
- 所以这版会更少把：
  - 太早但还没跑起来的帖
  - 已经过峰值、回复过于拥挤的帖
  判成高优先级
- `AI回复` 这边也同步加了一层 route 选择偏好：
  - 对“已经起量、还在加速”的 fresh 帖
  - 会更偏 `直接给观点 / 先补一层`
  - 少一点“附和一句”
  - 多一点新增信息、独特观点、实质补充
- popup 里的评分说明和 route 理由也同步反映这轮变化

## 0.2.105

- `AI回复` 的 route 推荐不再把所有 `reviewed / settled` 记忆都当成“已验证主线”
- 这轮补的是一层更真实的分流：
  - 如果历史里真的出现过 `picked-up / author-back`
    - 继续偏向 `沿验证记忆接`
  - 如果只是复查过，但没有明显被接住
    - 就更偏 `先追关键变量 / 先补一层`
- 这让 AI 面板不再把“复查过但还安静”的对象误当成已经跑通的旧线
  - 推荐会更像真实操作判断
  - 不是把所有 memory 都硬塞回同一种打法
- popup 里的路数理由和信号标签也同步加上了这层区分

## 0.2.104

- `AI回复` 的 route 稿继续做第二轮去模板味收敛
- 这轮还是不加新壳，也不碰当前分层结构
  - 只继续压 `lead / body / closer` 里还像“系统在解释策略”的中文句子
  - 把它们改成更像真人会顺手发出去的接话
- 现在几条主路数的最终工作稿会更少出现这类读感：
  - “更稳的接法”
  - “真正该问清的”
  - “更值得接的”
  - “一句该发的回复”
- 意图没变，打法没变
  - 但语言更轻
  - meta 感更低
  - 更接近可直接发送的工作稿

## 0.2.103

- `AI回复` 的 route 稿继续做了一轮去模板味收敛
- 这轮不改结构，也不加新按钮
  - 重点是把第二句和收尾里最明显像“系统说明”的词句削掉
  - 让中文读起来更像人在顺手接话
- 当前几条主路数的 bundle 稿现在会更少出现：
  - “真正最值钱的地方”
  - “更值得接的”
  - “更像一句真正能接上的回复”
  这类模板味偏重的表达
- 改完之后，route 稿整体还是同一套打法
  - 但读感更轻
  - 更接近日常发出的回复句式

## 0.2.102

- `AI回复` 的 route bundle 又往前收了一层
- 上一轮把第一句改成了该打法自己的主句
- 这一轮继续把第二句和收尾也改成 route 专属内容
  - 不再优先回退成通用说明句
  - 整段 2-3 句现在更像沿同一条人格线写出来
- 当前 route 生效后的工作稿会更稳定地表现出：
  - `沿验证记忆接` 更像顺着已验证互动继续接
  - `先追关键变量` 更像真的把问题抛给对方
  - `先补一层` 更像把讨论往下垫稳
  - `轻反差切入` 更像顺手拐个更有意思的角度
  - `直接给观点` 更像一句干净可发的判断
- 这一步继续减少整段稿子的“说明味”
  - 让 AI 面板产出的工作稿更像回复本身

## 0.2.101

- `AI回复` 的 route bundle 又往“能直接发”推进了一步
- 现在 route 生效时，最终工作稿第一句不会再优先沿用通用改写口吻
  - 会直接换成该打法自己的主句
  - 少一点“我会怎么回”
  - 多一点真正像回复本身的开场
- 当前几条主路数都做了更直接的主句：
  - `沿验证记忆接`
  - `先追关键变量`
  - `先补一层`
  - `轻反差切入`
  - `直接给观点`
- 这一步继续把 AI 面板从“会解释打法”往“会给更像真人可发稿”推进
  - 不动结构
  - 直接抬语言质感

## 0.2.100

- `AI回复` 的 route bundle 继续往“真正成稿”推进了一层
- 上一轮已经会按现场动态换 `起手 / 推进 / 收尾`
  - 这一轮进一步让最终工作稿按该路数的节奏收束
  - 不再只是把三段文字机械拼起来
- 现在不同路数会更明显地走不同的成稿节奏：
  - `直接给观点 / 轻反差 / 先补一层 / 顺着记忆`
    - 更偏向保留前两段最可发的句子
  - `先追关键变量`
    - 会更稳定地收成问题式结尾
- 这一步继续减少 AI 面板里“解释感过重”的成分
  - 让工作稿更像真实可以拿去发的回复
  - 而不是只是把理由、打法、说明堆在一起

## 0.2.99

- `AI回复` 的 `出手路数` 现在不只会决定“选哪条打法”
  - 还会根据当前窗口、线程密度、记忆强度、排期档位
  - 动态改这条路数对应的 `起手 / 推进 / 收尾` 组合
- 这意味着同一条 `沿验证记忆接` 或 `先补一层`
  - 不再永远是固定一套 starter/body/closer 索引
  - 而会更像真的按现场情况换打法包
- popup 里的路数卡也新增了一条轻量 `打法摘要`
  - 直接告诉你这次会怎么开头、怎么往下推、怎么收口
  - 让“为什么选这条路数”不只停留在解释层，也停在执行层
- 这一轮继续把 `AI回复` 往真实 copilot 推
  - 不加新壳
  - 先把已有路数系统做得更像可用成品

## 0.2.98

- `AI回复` 的 5 条基础主草稿继续拉开人格差异
- 这一轮不再只是替换几个近义词
  - `沿验证记忆接` 更像顺着已验证互动往下接
  - `先追关键变量` 更像真正在追问决定后续判断的变量
  - `先补一层` 更像给线程补回遗漏的一层
  - `轻反差切入` 更像真人顺手拐一个角度
  - `直接给观点` 更像可以立刻发出的判断句
- 这一步让 `AI回复` 里的“先选路数”不再只是上层说明卡
  - 选中路数后第一眼看到的主草稿
  - 也更接近对应打法的人设和语气
- 这轮没有再加新面板或堆新按钮
  - 重点是把现有 AI 回复能力做得更像成品
  - 先提升真实可用性，再继续往更强 draft 走

## 0.2.97

- `AI回复` 的 `出手路数` 不再只是静态顺序
- 现在会把这些真实信号一起吃进路数推荐：
  - `pickup`
  - `reviewed / settled`
  - 当前 `lane`
  - 线程拥挤度
  - 候选分数与鲜度
- 这一轮把路数排序抽进了 `replydrop-draft-core.js`
  - 变成共享纯逻辑
  - 也补了对应测试
- 路数卡现在不只显示“叫什么”
  - 还会带出更具体的推荐理由
  - 以及为什么它比别的打法更适合当前这条候选
- 这一步让 `AI回复` 从“会给打法”继续变成“会按真实信号挑打法”

## 0.2.96

- `AI回复` 新增一层更强的 `出手路数`
  - 不再只给你很多局部按钮
  - 现在可以先一键选择整套回复打法
  - 再继续在下面微调句子
- 当前会优先给出 3 条更像真实出手策略的路数，例如：
  - 沿验证记忆接
  - 直接给观点
  - 先追关键变量
  - 或轻反差切入
- 每条路数会一起决定：
  - 用哪条草稿角度
  - 用什么 tone
  - 起手 / 中段 / 收尾分别怎么搭
- 这一步让 `AI回复` 从“会改稿”更进一步变成“会先帮你选打法”
- 路数卡也继续做成更清楚的票根区块，避免新增能力又重新长成一团

## 0.2.95

- `AI回复` 工作台从“强起手”继续扩展成完整三段式改写台：
  - `强起手`
  - `往下推进`
  - `收尾动作`
- 现在不只是改第一句
  - 还可以给当前稿补中段推进句
  - 再给最后一句换成更像会话的收尾
- 这三个控制是可叠加的
  - 可以先换起手
  - 再压中段
  - 再选结尾
  - 让 `AI回复` 更像真正的 reply copilot，而不是单点按钮
- `当前前三顺位` 优先级板也从展示板变成可操作板：
  - 每条都能直接切成当前工作对象
  - 或按建议档位直接入队
  - 不再只是看完排名再自己找地方操作
- 工作台和优先级板也补了一轮票根式区块分层，让新增控制没有长成一团

## 0.2.94

- `AI回复` 新增“当前前三顺位”优先级板，不再只停留在第一名 vs 第二名
- 现在会把前三候选一起摊开，说明：
  - 谁是主线
  - 谁是 runner-up
  - 谁更像保温备选
- 改写工作台新增 `强起手` 切换按钮
  - 可以直接把当前稿切到更强的开头
  - 不用手动改第一句
- 这一步让 `AI回复` 更像真实决策台：
  - 一边告诉你谁先做
  - 一边给你当前稿更强的起手
- 优先级板和强起手条也继续做了一轮票根化 polish

## 0.2.93

- `AI回复` 新增“为什么这条先于第二名”卡，开始解释主线候选为何赢过 runner-up
- 现在会从这些维度解释主线取舍：
  - 当前窗口
  - 第二名对比
  - 分差
  - 线程拥挤度 / 鲜度 / 记忆优势
- 草稿正文继续强化起手感：
  - 观点稿更像直接开场
  - 提问稿更像先抛问题
  - 补充稿更像先补一句
  - 反差稿更像先换个角度
- 这一版让 `AI回复` 更接近真正的决策 copilot，而不是只会给草稿和时间建议
- `主线理由` 卡也继续做了一轮票根化 polish，和排期理由卡形成更完整的 AI 判断层

## 0.2.92

- `AI回复` 面板新增 `排期理由` 卡，不再只给一个 `下一轮 / 今晚 / 明早` 结论
- `AI回复` 现在会把建议排期拆成更清楚的理由层：
  - 当前窗口
  - 默认排期
  - 分数
  - 鲜度
  - 记忆偏好
- `AI回复` 工作台新增起手提示，直接告诉你当前草稿更适合：
  - 先给观点
  - 先追问
  - 先补一层
  - 还是轻反差切入
- 这一步让 `AI回复` 更接近真正的 copilot：
  - 不只给草稿
  - 也解释为什么现在这么写、为什么这个时间发
- `AI回复` 里的排期和起手提示卡也继续往票根质感推进

## 0.2.91

- `AI回复` 草稿从“解释为什么值得回”进一步改成更像可以直接发出去的回复句式
- `更锐 / 更柔和 / 更短 / 更像真人` 现在不再把所有草稿压成同一条泛化文案
  - 会保留当前草稿角度
  - 再按 tone 做不同风格改写
- 草稿改写现在更贴近真实发帖语感：
  - 少一点“这是值得回复的帖子”这种元叙述
  - 多一点直接进入观点 / 追问 / 补充 / 轻反差的可发句式
- `AI回复` 工作台和草稿卡继续做了一轮票根细节 polish：
  - 切口感更强
  - 虚线分隔更清楚
  - 激活中的草稿卡更容易辨认

## 0.2.90

- `AI回复` 不再只是 roadmap 面板，已经正式接入真实草稿工作流
- 现在会在 `AI回复` 面板里直接显示：
  - 当前 AI copilot 主卡
  - 可改写工作稿编辑器
  - 3 个可直接使用 / 复制 / 入队的回复草稿
- `AI回复` 面板内的：
  - 改写
  - 复制当前稿
  - 草稿复制
  - 入队排期
  这些动作已经和新面板接通，不再只对旧隐藏草稿台生效
- `AI回复` 顶部新增更像票根成品的 copilot 主卡，开始把：
  - 当前目标对象
  - 建议排期
  - 记忆验证
  - 可用草稿角度
  放进一个更清楚的主叙事里
- `AI回复` 页签 badge 现在会显示真实草稿数量，而不是一直显示 `0`

## 0.2.89

- `看板` 顶部新增更像成品的“表现摘要”主卡，不再只有一排指标卡
- `看板` 现在会优先突出：
  - 当前表现最好的回复
  - 总曝光
  - 点赞增量
  - 最佳曝光增量
- `AI回复` 顶部新增“下一块该做”主卡，把下一阶段产品方向说清楚：
  - 更强草稿
  - AI 排期
  - 关系记忆
- `AI回复` 现在也会结合当前最佳候选，给出更具体的 AI 接入对象与建议排期，不再只是三个空 roadmap 卡片
- `看板 / AI回复` 两个面板的票根层次和装饰感继续加强，更接近稳定成品状态

## 0.2.88

- 工作台二级导航从 `收件箱 / 草稿 / 看板 / 队列 / 关系 / 反馈` 收敛成 `看板 / AI回复`
- `看板` 现在改成更贴近用户预期的回复表现面板，重点展示：
  - 已发出回复数
  - 观测曝光
  - 点赞增量
  - 回复增量
  - 被接住 / 作者回流 / 复查覆盖
  - 当前表现最好的回复
- `AI回复` 现在是独立面板，占位未来的：
  - AI 草稿助手
  - AI 排期与队列
  - AI 关系记忆
- 仪表盘顶部四个主按钮现在有更明确的分色，不再“点到谁都一个样”
- popup-ui-core 现在只接受 `growth / ai` 两个工作台二级状态，并新增旧状态回退测试

## 0.2.87

- popup 不再把头部入口和四个主页签塞在同一张长票根里
- 新增 `首页 -> 仪表盘` 两层结构：
  - 首页只保留语种、总开关、页内入口说明和一个明显可点击的 `仪表盘` 总控按钮
  - `工作台 / 概览 / 加成 / 关键词` 全部收进第二层独立面板
- `replydrop-popup-ui-core.js` 现在会持久化 `activeView`
- 新增 popup-ui-core 回归测试，锁住：
  - `activeView` 的解析与序列化
  - 只有 dashboard layer 可用时，状态应正确回退
- 这一步优先解决“切了 tab 但仍像同一条长网页”的结构问题，让 popup 更像插件而不是网页

## 0.2.86

- `scripts/validate-release.mjs` 现在会额外校验：
  - `package.json` 版本必须和 `manifest.json` 一致
  - README 中示例 zip 名必须和当前短版本一致
- 这一步把发版元信息同步也纳入了强校验范围，减少“代码对了但版本文档漂了”的开源维护成本
- 作为这轮 12 版收口，ReplyDrop 现在同时具备：
  - 更短的 workbench 分层
  - 共享纯逻辑支撑的 focus / draft / queue / feedback / attribution 选择
  - 更诚实的 publish-watch / pickup-watch 状态
  - 更像公开仓的文档门面与验证纪律

## 0.2.85

- 新增 `replydrop-feedback-core.js`，把 feedback 预览排序从 popup 渲染逻辑里抽成共享纯逻辑
- `反馈` 视图现在优先显示：
  - 已到期待复查
  - 已被接住
  - 再到普通 quiet / pending 记录
- 新增 feedback-core 回归测试，锁住：
  - due review 必须排在前面
  - 默认 feedback preview 保持短列表
- popup 反馈区默认只展示最值得先看的 `3` 条，并给出说明文案
- 这一步让 post-ship feedback 更接近工作流，而不是纯存档

## 0.2.84

- 新增 `scripts/check-public-docs.mjs`
- `npm run validate` 现在会自动检查公开文档里是否残留：
  - 本机路径
  - 文件协议链接
  - 其他明显不适合公开仓的本地引用
- `package.json` 新增 `check:public-docs`
- 这一步把开源门面纪律固定进验证流程，而不是继续依赖人工记忆

## 0.2.83

- `replydrop-workflow-core.js` 现在会把长期未闭环的 publish-watch handoff 自动升级成 `failed`
  - `post-opened` 超过约 12 分钟
  - `composer-ready` 且多次尝试后超过约 18 分钟
- 新增 workflow-core 回归测试，锁住 stale handoff 不应一直伪装成正常状态
- popup 的 publish-watch assist tone 现在会直接尊重升级后的失败状态
- 这一步让 execute / publish loop 的真相更诚实：卡住太久就该被看见并重新处理

## 0.2.82

- README 不再暴露本机目录路径，安装和开发说明改成公开仓可直接复用的写法
- `CONTRIBUTING.md`、`SUPPORT.md`、`RELEASING.md` 中的本机绝对路径链接全部改成仓库相对链接
- 发布和开发指令统一改成 `cd <repo-dir>` 形式，避免把个人工作目录写进公开文档
- README 的仓库定位也从“内部恢复目录”改成“开源仓库目标”表达
- 这一步不改运行时行为，但明显提高了仓库作为公开项目的可信度和专业度

## 0.2.81

- `replydrop-attribution-core.js` 新增：
  - `getCandidateAttributionBoost()`
  - `sortCandidatesByAttribution()`
- attribution memory 现在会真正参与候选排序，而不是只停留在 Growth / Attribution Memory 里解释
- `popup.js` 先构建 attribution model，再对可见候选和可执行候选做二次排序
- 候选卡 signal row 新增轻量 attribution 提示：
  - `作者记忆`
  - `主题记忆`
  - `已验证`
- 新增 attribution-core 回归测试，锁住有真实记忆的候选应优先于中性候选
- 这一步让“看过往什么有效”开始真正影响“现在先回哪条”

## 0.2.80

- 新增 `replydrop-queue-core.js`，把 queue 过滤和默认预览截断规则抽成共享纯逻辑
- 新增 `tests/replydrop-queue-core.test.cjs`，锁住：
  - `action` 视图只应保留真正临近执行的队列项
  - 默认 queue preview 保持短列表
- popup queue desk 改为消费 queue core，不再把过滤与预览规则继续散落在 `popup.js`
- 默认只展示最前 `3` 条 queue card，`action` 视图最多展示 `4` 条；更多项改用提示引导用户切筛选
- 这一步让 `队列` 更像插件里的执行入口，而不是把整份待办单原样摊开

## 0.2.79

- `replydrop-growth-core.js` 的 compact metrics 现在会按真实压力自适应收缩，不再默认把所有零值卡都渲染出来
- Growth 可选指标只保留前三个最值得占位的项：
  - `needsAction`
  - `awaitingConfirm`
  - `pickupDue`
  - `pickedUp` 只会在前面更紧急项不挤满时出现
- 新增 growth-core 回归测试，锁住：
  - 高压力时的可选卡优先级
  - 安静状态下只保留最基本的看板卡
- popup 的 Growth action rail 现在只渲染前 2 张最高优先级动作卡，进一步降低长面板感
- 这一步让看板更像“操作脉冲”，而不是固定长度的数据墙

## 0.2.78

- 草稿工作台现在会直接显示系统建议排期，并高亮推荐的 `下一轮 / 今晚 / 明早` 按钮
- 推荐排期沿用现有 lane + attribution memory 规则，不是新造一套判断
- 草稿到排队这一步从“自己猜该放哪”变成“先看到系统建议，再决定是否覆盖”
- `draftComposerMeta` 现在是更清晰的上下文区，不再只是一行作者 + lane 文本
- 这一步让 draft -> queue 的操作链更像产品，而不是一组平铺按钮

## 0.2.77

- 新增 `replydrop-draft-core.js`，把草稿角度选择从 `popup.js` 抽成共享纯逻辑
- 草稿角度现在会消费 attribution memory：
  - 有真实记忆时优先给出 `记忆延续`
  - 对话已热起来时优先以 `延展补充` 收尾
- `renderDeskPanel()` 先构建 attribution signal，再生成当前 focus candidate 的草稿，不再让草稿晚于记忆判断
- 新增 `tests/replydrop-draft-core.test.cjs`，锁住：
  - validated memory 应把 `memory` 角度推到第一位
  - 活跃讨论应优先用 `bridge` 结尾
- popup / options / runtime file / syntax check 已同步接入 draft core
- 草稿台开始从“固定三段文案”转向“由共享策略决定哪三种角度应该出现”

## 0.2.76

- 新增 `replydrop-focus-core.js`，把 workbench `focus digest` 和候选预览选择规则抽成共享纯逻辑
- 新增 `tests/replydrop-focus-core.test.cjs`，锁住：
  - focus digest 输出顺序
  - 当前主线候选不应在下方候选池里重复出现
- `popup.js` 改为消费 focus core，而不是继续内联维护 digest / preview 逻辑
- 当前候选池现在会优先展示“主线之外”的备选项；如果当前只有一条主线，会明确提示而不是重复渲染同一条卡片
- runtime file / syntax check / popup HTML / options HTML 已同步接入新的共享核心

## 0.2.75

- `收件箱` 视图做了第一轮真压缩：把“当前生效加成 / 评分说明”从工作台主线里挪回 `加成` 页签
- `focus` 区新增紧凑 digest strip，只保留当前主线、候选规模、队列规模和待复查压力
- 当前候选池预览从 `5` 条收成 `3` 条，减少 popup 首屏滚动压力
- `signals` 页签现在同时承担语言 / 主题 / 当前生效加成 / 评分说明，信息归位更接近插件控制台
- 这是一次结构减重，而不是样式漂移：工作台更聚焦“现在该处理什么”

## 0.2.74

- `replydrop-attribution-core.js` 新增 `buildAttributionInsightTargets()`，把 attribution insight 的优先级选择从 `popup.js` 提升到共享纯逻辑
- attribution insight 现在默认只取最强的 2 张，而不是把 `handle / topic / lane` 三张都堆出来
- `popup.js` 的 attribution memory 改为消费共享 insight targets，减少内联排序与选择逻辑
- Growth 区里的 attribution memory 更像插件信息卡，而不是又一段长列表
- 新增 attribution-core 回归测试，锁定：
  - strongest two insights 的顺序
  - 弱记忆不应生成 attribution insight

## 0.2.73

- Growth Dashboard 做了一轮 compact pass：核心指标卡从 10 张收成 6 张，保留执行/回访真相但降低扫描成本
- `replydrop-growth-core.js` 新增：
  - `buildCompactGrowthMetrics()`
  - `buildGrowthTruthItems()`
- compact growth 卡片与 truth strip 的选择规则改为共享纯逻辑，减少 `popup.js` 内部硬编码
- `popup.js` 不再在 Growth 区重复渲染 `作者回流 / 复查中 / 已结案 / 已发出` 大卡；这些信息改为进入 compact strip 或指标 meta
- attribution memory 在没有真实内容时不再空占一个面板，Growth 区块更像插件而不是长页面
- 新增 growth-core 回归测试，锁定 compact card 集与 compact truth strip 的输出顺序和关键值

## 0.2.72

- 抽出 popup 路由状态共享规则，`replydrop-popup-ui-core.js` 现在会统一处理主页签 / 工作台二级页签 / 队列筛选的可用性与回退逻辑
- 新增 `resolvePopupUiPrefs()` 与 `buildPopupUiPrefs()`，避免分层视图规则继续散落在 `popup.js`
- `popup.js` 切页、切工作台区块、切队列筛选现在都走共享 popup UI 核心，invalid patch 不会再把当前有效状态冲掉
- `switchTab()` 改为使用归一化后的真实目标 tab 更新按钮和 panel，不再依赖原始输入值
- `options.html` 现在也加载全部共享核心文件，popup 与 options 不再走两套不同的 UI 逻辑 fallback
- 新增 popup-ui-core 回归测试，覆盖：
  - `desk` 不可用时的回退
  - invalid patch 保持当前分层状态
  - 切主页签时保留已选中的工作台二级区块

## 0.2.71

- `markTweetAsReplied()` 改为使用 fresh shipment pickup 状态，不再从旧的 `pickupChecks / reviewStage / nextReviewAt / settledAt` 继承回访节奏
- 同一条 source tweet 再次 shipped 时，会重置为新的 `pending -> first-check` 回访循环，而不是沿用旧的 `follow-up / settled`
- fresh shipment 也会清空旧 pickup 观测值与作者回流标记，避免把上一轮 shipped 的结果错误带到新一轮
- `replydrop-pickup-core.js` 新增 `buildFreshPickupReviewState()`，并补上回归测试锁住该语义
- `background.js` 的 pickup fallback 逻辑与 pickup core 对齐，避免 core 缺失时节奏计算退化

## 0.2.70

- `background.js` 现在会在 `markTweetAsReplied()` 与 `recordPickupSnapshot()` 中真正落地 pickup review cadence，并把 `reviewStage / nextReviewAt / settledAt` 同步写入 `pickupWatch` 与 `replyDetails`
- `popup.js` rehydrate 不再丢失 `publishWatch` 的 `failed / cooldown / snoozed / attempts / cooldownUntil / snoozeUntil`，也会保留 pickup review cadence 字段
- Growth Dashboard / growth badge / feedback meta 改为看全部到期复查工作，不再只把首次检查的 `pending` 当成唯一信号
- README 文档链接改为仓库相对路径，GitHub 打开时不再跳到本地 `/Users/admin/...`

## 0.2.69

- 抽出 `replydrop-popup-ui-core.js`，把 popup 分层导航与视图状态归一化收敛成共享纯逻辑
- 抽出 `replydrop-growth-core.js`，把 Growth Dashboard 的 queue / publish / pickup / review 聚合从 `popup.js` 中拆出
- 新增 `tests/replydrop-popup-ui-core.test.cjs` 与 `tests/replydrop-growth-core.test.cjs`
- Growth Dashboard 现在会额外显示 `待收口 / 复查中 / 已结案 / 巡检覆盖`，不再只看浅层计数
- 增长动作卡优先盯失败/更紧急的 publish-watch 恢复项，而不是随便抓第一条

## 0.2.68

- 新增 GitHub Actions 校验工作流 `.github/workflows/validate.yml`
- 新增 issue templates、PR template，补齐对外协作入口
- 新增 `.editorconfig` 与 `SUPPORT.md`
- 重写 `CONTRIBUTING.md`，让本地验证、提交流程和边界约束与当前仓状态一致
- popup 记住上次打开的主页签、工作台二级页签和队列筛选，不再每次都回默认视图

## 0.2.67

- 给 `工作台` 加入二级导航：`收件箱 / 草稿 / 看板 / 队列 / 关系 / 反馈`
- 不再把工作台所有模块一次性堆在同一条长页里，切回更接近插件的分层操作方式
- 每个二级页签补上数量 badge，打开时能直接看到候选、队列、反馈等规模
- 将 `增长脉冲` 明确提升为 `Growth Dashboard` 命名，降低“找不到数据看板”的歧义

## 0.2.66

- 收紧 popup 头部密度，压缩标题、计数块和总开关卡片的尺寸
- 将界面语言切换提前到总开关前面，避免被埋在概览页里
- 移除头部里过于臃肿、又像按钮却不能点击的“唯一入口”大卡
- 将入口说明改成更轻的提示行，减少插件首屏的网页感和堆叠感

## 0.2.65

- 抽出 `replydrop-attribution-core.js`，把 attribution 记忆与候选排队默认槽位逻辑收敛到共享核心
- 新增 `tests/replydrop-attribution-core.test.cjs`
- popup 改为优先消费共享 attribution 核心，减少 `popup.js` 内部策略漂移

## 0.2.64

- 抽出 `replydrop-workflow-core.js`，统一 reply queue 排序与 publish-watch 状态归一逻辑
- 新增 `tests/replydrop-workflow-core.test.cjs`
- `background.js` / `popup.js` 改为优先调用 workflow 共享核心

## 0.2.63

- 抽出 `replydrop-pickup-core.js`，统一 pickup 状态与 post-ship review cadence 的纯逻辑
- 新增 `tests/replydrop-pickup-core.test.cjs`
- `background.js` / `popup.js` 改为优先调用 pickup 共享核心

## 0.2.62

- 新增 `scripts/package-release.sh`
- 发版包改为从 `scripts/runtime-files.txt` 读取运行时文件，避免把说明文档和临时文件打进扩展 zip

## 0.2.61

- 新增 `scripts/validate-release.mjs`
- 一次跑完运行时文件存在性、`manifest` 版本、语法检查、测试和文档同步检查

## 0.2.60

- 新增 `scripts/runtime-files.txt`
- 为扩展运行时、共享核心和最终 zip 内容建立单一来源清单

## 0.2.59

- 新增 `CODE_OF_CONDUCT.md`
- 新增 `SECURITY.md`
- 新增 `LICENSE`，默认按 MIT 开源分发

## 0.2.58

- 新增 `SMOKE-TEST.md`
- 新增 `RELEASING.md`
- 补齐手工冒烟验证与正式发版步骤

## 0.2.57

- 新增 `ARCHITECTURE.md`
- 新增 `PRIVACY.md`
- README 补齐架构、验证、发布与隐私文档入口

## 0.2.56

- 将 `replydrop-p2.55.zip` 恢复为独立可维护基线目录 `x-reply-scorer-p2.55-reset`
- 补齐 `.gitignore`、`OPEN-SOURCE-RESET-AUDIT.md`、`ROADMAP.md`、`CONTRIBUTING.md`
- 修正 README 版本与本地安装路径漂移

## 0.2.55

- 新增 shipped reply 的 pickup-watch 基线记忆：
  - `pending`
  - `quiet`
  - `picked-up`
  - `author-engaged`
- shipped reply 现在会保留：
  - baseline replies / likes / views
  - pickup check count
  - pickup deltas
  - visible author re-engagement marker
- popup archive 从“发送记录”升级为可操作的 post-ship 工作区：
  - `查接住`
  - `重新复查`
  - 打开原帖
  - 打开可见作者回流
- Growth Pulse 开始反映更真实的 post-ship 状态，而不只是抽象增长指标
- attribution memory 开始把 pickup 质量纳入排序，而不只看 shipped 数量
