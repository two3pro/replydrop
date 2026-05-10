# Automation API

## 目标

ReplyDrop 暴露这套接口，是为了让 Ada、CDP 脚本或其他本地自动化直接操作插件状态，而不是依赖：

- 截图识别
- popup 可见状态
- DOM 找按钮再点击

这套接口当前面向 `x.com` 页面上下文。

## 暴露方式

在 `x.com` 页面里，ReplyDrop 会优先注入：

```js
window.ReplyDropExecutor
```

兼容别名仍然存在：

```js
window.ReplyDropAPI
```

如果你在 `twitter.com`、扩展 popup、普通网页或非页面上下文里调用，它不保证存在。

## 可用方法

### `getCapabilities()` / `getExecutorCapabilities()`

返回当前执行通道的能力描述。

适合：

- 让 Codex / OpenClaw / Hermes / Claude 先自检接口能力
- 明确优先使用的通用方法名
- 在兼容旧 `ReplyDropAPI` 的同时，知道哪些是 legacy 名称

### `getCandidates()`

返回当前 `recentCandidates` 的自动化友好摘要。

每项字段：

- `tweetId`
- `score`
- `tier`
- `topicTags`
- `author`
- `authorHandle`
- `textSummary`
- `text摘要`
- `url`

### `getQueue()`

返回当前 `replyQueue` 的自动化友好摘要。

每项字段：

- `tweetId`
- `status`
  - `pending`
  - `shipped`
  - `done`
- `addedAt`
- `url`
- `slot`
- `scheduledFor`
- `author`
- `authorHandle`
- `score`
- `draft`

### `getMediaBundle(tweetId)`

返回当前页面这条帖子对应的稳定媒体引用，适合让 AI agent 自己再去看图、看 poster、裁截图，而不是继续猜 DOM。

返回值示例：

```js
{
  tweetId: "2045354208548069468",
  url: "https://x.com/example/status/2045354208548069468",
  authorHandle: "example",
  mediaKind: "photo",
  lowSemanticConfidence: false,
  textSummary: "Short caption here",
  mediaAltText: "Screenshot of an AI dashboard ...",
  articleRect: { left: 120, top: 310, width: 588, height: 742 },
  articleVisible: true,
  items: [
    {
      index: 0,
      type: "photo",
      src: "https://pbs.twimg.com/media/....jpg",
      poster: "",
      alt: "Screenshot of an AI dashboard ...",
      altMeaningful: true,
      width: 1600,
      height: 900,
      rect: { left: 144, top: 508, width: 560, height: 315 },
      visible: true,
      durationText: ""
    }
  ]
}
```

常见用途：

- 让 agent 稳定拿到一条候选实际对应的是哪张图 / 哪个视频容器
- 多图帖不用再靠整页截图裁图
- 视频帖至少能稳定拿到 `poster`、可见区域和时长文本

### `getAgentInbox(options)`

返回给 AI agent 直接消费的 top shortlist，不再要求外部自己把 `getCandidates()` 结果再拼成上下文包。

入参字段：

- `limit`
  - 默认 `6`
  - 最大 `16`
- `includeMedia`
  - 默认 `false`
  - 为 `true` 时，会尽量把当前页面里可取到的媒体 bundle 一并塞进候选上下文

返回值示例：

```js
{
  version: "replydrop-agent-inbox-v1",
  generatedAt: 1776581332782,
  limit: 6,
  candidates: [
    {
      version: "replydrop-candidate-context-v1",
      tweetId: "2045354208548069468",
      url: "https://x.com/example/status/2045354208548069468",
      author: {
        handle: "example",
        verified: false,
        relationshipStatus: "mutual"
      },
      post: {
        text: "Post text ...",
        mediaKind: "photo",
        highlights: ["mutual lane", "fresh thread"]
      },
      routing: {
        laneKey: "now",
        laneLabel: "现在接",
        recommendedSlot: "next",
        recommendedDecision: "reply-now"
      }
    }
  ],
  outputSchema: {
    version: "replydrop-agent-reply-v1",
    decisionEnum: ["reply-now", "queue-next", "queue-tonight", "queue-tomorrow", "skip"]
  }
}
```

### `getExecutorInbox(options)`

`getAgentInbox(options)` 的通用别名，推荐外部执行器优先使用。

推荐额外传：

- `options.roundId`
- `options.sessionId`
- `options.resetRound`
- `options.preservePool=true`
- `options.autoResetIfStopped=true`
- `options.onlyReplyNow=true`

现在返回里会额外包含：

- `roundState`
  - `roundStartAt`
  - `roundDeadlineAt`
  - `successCountThisRound`
  - `failCountThisRound`
  - `emptyScanCount`
  - `repeatedTargetCount`
  - `stopReason`
  - `isStopped`
- `pickDiagnostics.recommendedResult`
  - 可能是 `process-candidates`
  - 也可能是 `no-auto-safe-candidate`
  - 若命中插件硬止损，会变成 `stop-round`
- `pickDiagnostics.candidateBacklogSize`
- `pickDiagnostics.preservePoolServed`
- `pickDiagnostics.autoResetRecovered`
- `pickDiagnostics.scanTimeMs`
- `pickDiagnostics.sendTimeMs`
- `pickDiagnostics.timeBetweenSuccessfulSendsMs`

调用方约束：

- 只有 `stopReason` 命中硬止损时，才把 `stop-round` 当成真正停轮；`empty-scan-limit / round-idle-timeout` 这类 soft stop 允许配合 `autoResetIfStopped` 继续发现候选
- backlog 不为空时，优先连续消费 `candidates`，不要每发一条就先做 full refresh
- 同一轮同一 `tweetId` 只会被放进 pick 1 次；被 `skip` 或发送失败后，该目标本轮会进入 denylist

### `getCandidateContext(tweetId, options)`

返回单条候选的完整上下文包，适合：

- 先从 `getCandidates()` / `getAgentInbox()` 选中一条
- 再单独拉这条的深上下文给模型写最终回复

入参字段：

- `tweetId`
- `options.includeMedia`

返回值示例：

```js
{
  version: "replydrop-candidate-context-v1",
  tweetId: "2045354208548069468",
  url: "https://x.com/example/status/2045354208548069468",
  author: {
    handle: "example",
    verified: true,
    relationshipStatus: "follow-up"
  },
  post: {
    text: "Post text ...",
    mediaKind: "video",
    sourceSurface: "for-you",
    ageMinutes: 42,
    views: 42000,
    replies: 88,
    likes: 620,
    matchedTopics: ["ai"],
    matchedLanguages: ["langEn"],
    highlights: ["reply gap", "validated topic"]
  },
  scoring: {
    score: 86,
    opportunityBoost: 14,
    finalScore: 91
  },
  routing: {
    laneKey: "watch",
    laneLabel: "今晚看",
    recommendedSlot: "tonight",
    recommendedDecision: "queue-tonight"
  },
  memory: {
    kind: "author-engaged",
    priority: 32,
    authorEngaged: 1
  },
  media: {
    needsVision: true,
    available: true,
    bundleIncluded: false
  },
  aiHints: {
    draftKeys: ["memory", "question", "bridge"],
    routePlans: [{ key: "memory-line", tone: "human", reasons: ["author-back"] }]
  }
}
```

### `getExecutorContext(tweetId, options)`

`getCandidateContext(tweetId, options)` 的通用别名，返回同一条候选的执行上下文包。

### `getReplySchema()`

返回 ReplyDrop 期望的 AI 输出结构定义。

返回值示例：

```js
{
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
}
```

### `getExecutorSchema()`

返回通用执行版 schema。

返回值示例：

```js
{
  version: "replydrop-executor-action-v1",
  legacyVersion: "replydrop-agent-reply-v1",
  decisionEnum: ["reply-now", "queue-next", "queue-tonight", "queue-tomorrow", "skip"]
}
```

### `getState()`

返回完整 `x-reply-scorer-state` 快照。

适合：

- 调试
- 回归验证
- 和 `getCandidates()` / `getQueue()` 做交叉比对

### `addToQueue(tweetId)`

把一个真实候选写入 ReplyDrop 队列。

返回值示例：

```js
{
  tweetId: "2045354208548069468",
  status: "pending",
  addedAt: 1776581332752,
  url: "https://x.com/example/status/2045354208548069468",
  slot: "next",
  scheduledFor: 1776583132752,
  author: "example",
  score: 100,
  draft: ""
}
```

### `openComposer(payload)`

让 ReplyDrop 自己去打开目标帖的真实回复器，并把草稿写进当前可见 composer。

入参字段：

- `url`
- `tweetId`
- `draft`
- `targetStartedAt`
- `targetDeadlineAt`

时间约束：

- 从 agent 拿到候选 / 开始处理目标起计时，90 秒内完成为正常
- 超过 120 秒会返回 `reasonCode: "target-timeout"`、`shouldSkipTarget: true`
- 收到 `target-timeout` 后必须切换下一条，不要继续在同一帖重试

返回值示例：

```js
{
  ok: true,
  composerReady: true,
  draftLoaded: true,
  recheck: {
    status: "stable",
    previewScore: 72,
    liveScore: 68
  }
}
```

常见返回原因：

- `missing-url`
- `navigating`
- `tweet-not-ready`
- `reply-button-missing`
- `composer-not-ready`
- `reply-context-missing`
- `generic-composer-opened`
- `reply-target-lost`
- `score-degraded-below-average`
  - 当前帖子主页实时复核后，价值已经跌到平均线以下
  - 这时返回里会带 `reasonCode: "value-dropped-on-open"` 和 `recheck`
- `target-timeout`
  - 单条目标耗时超过 120 秒，调用方应立即切换下一条

重要约束：

- `openComposer()` 返回 `ok: false` 时，调用方必须停止，不要继续调 `submitReply()`
- 只有在 `openComposer().ok === true`、`composerReady === true`、`submitReady === true` 时，才应该继续 `submitReply()`

### `runExecutorAction(payload)`

通用执行动作入口，适合不想自己手动拆 `addToQueue()` / `openComposer()` / `submitReply()` 的执行器。

支持动作：

- `queue`
- `open-composer`
- `submit-reply`
- `reply`
- `mark-shipped`
- `skip`

其中：

- `reply` 会先执行 `openComposer()`，成功后再执行 `submitReply()`
- `open-composer` 支持直接传 `tweetId`，不必自己拼帖子 URL
- 建议把 `getExecutorInbox().executionPolicy.targetStartedAt` 原样传入 `targetStartedAt`，这样插件能从首页候选选择时开始计算 120 秒硬截止
- 建议把同一轮的 `roundId` / `sessionId` 一起传入；插件会据此记录真实的 `successCountThisRound / failCountThisRound / stopReason`
- 同轮里，如果某目标已经 `skip`、发送失败、或被标记为本轮 denylist，再次调用会收到 `target-denied-this-round`

新的轮控语义：

- 连续 3 次空扫会触发 `stopReason=empty-scan-limit`
- 单轮 90 秒没有新增成功会触发 `stopReason=round-idle-timeout`
- 执行故障累计达到阈值会触发 `stopReason=execution-fault-limit`
- 到达整轮预算或成功数上限会触发 `round-budget-exceeded / round-target-limit`

### `submitReply(options)`

复用 ReplyDrop 内部已适配的发送链路，找到真实可见的 reply submit button 并点击，然后读取页面 toast / outcome。

入参字段：

- `autoLikeIfChinese`
  - 默认 `false`
  - 仅建议给 AI agent 自动执行链路使用
  - 为 `true` 时，如果目标主帖判定为中文帖，发送成功后会顺手补一个点赞
- `targetStartedAt` / `targetDeadlineAt`
  - 用来继承同一条目标的 120 秒硬截止

返回值示例：

```js
{
  ok: true,
  targetUrl: "https://x.com/example/status/2045354208548069468",
  href: "https://x.com/example/status/2045354208548069468",
  outcomeText: "你的貼文已發送",
  likeAttempted: true,
  likePerformed: true,
  likeState: "liked"
}
```

常见返回原因：

- `send-button-missing`
- `not-reply-composer`
- `send-disabled`
- `send-button-disabled-but-target-locked`
 - `unknown-executor-action`
  - `runExecutorAction()` 收到不支持的动作类型

### `markShipped(tweetId, replyText)`

把某条候选或队列项标记为已经发出，并落到 ReplyDrop 的 shipped / pickup 生命周期。

注意：

- 这是 ReplyDrop 状态动作，适合“外部流程已经实际发送完成”后的状态回写
- 它会更新 `replyDetails`、`repliedTweets`、`pickupWatch`

返回值示例：

```js
{
  tweetId: "2045354208548069468",
  status: "shipped",
  url: "https://x.com/example/status/2045354208548069468",
  replyText: "your reply text"
}
```

### `skipCandidate(tweetId)`

把当前候选标记为略过，并在本轮 session 里从候选流里移除。

返回值示例：

```js
{
  tweetId: "2045354208548069468",
  skippedAt: 1776581332782,
  url: "https://x.com/example/status/2045354208548069468"
}
```

## 错误语义

当前稳定可依赖的错误包括：

- `invalid-tweet-id`
  - 传入的 `tweetId` 不是纯数字字符串
- `candidate-not-found`
  - 目标不在当前候选列表里，或不能按候选路径处理
- `tweet-not-found`
  - `markShipped()` 找不到可解析的目标帖子
- `media-not-found`
  - `getMediaBundle()` 找到帖子了，但当前文章节点里没有可提取的媒体
- `missing-url`
  - `openComposer()` 缺少目标帖子地址
- `tweet-not-ready`
  - `openComposer()` 在当前页面还没等到目标帖子
  - `getMediaBundle()` 知道目标帖子，但当前页面节点还没挂出来
- `composer-not-ready`
  - `openComposer()` 没能拉起真实可见的回复框
- `score-degraded-below-average`
  - `openComposer()` 在帖子主页实时复核后，发现价值已掉到平均线以下
- `value-dropped-on-open`
  - `openComposer()` 给出的产品化阻断 code，表示“打开后价值已下降”
- `send-button-missing`
  - `submitReply()` 没找到可见发送按钮
- `not-reply-composer`
  - `submitReply()` 找到的按钮不在真实回复器上下文里
- `send-disabled`
  - `submitReply()` 对应按钮当前不可发送
- `reply-context-missing`
  - 回复 editor 出现了，但没有拿到真正的 reply 上下文
- `generic-composer-opened`
  - X 打开成了普通 `compose/post`，不是挂在目标帖上的回复器
- `reply-target-lost`
  - 回复器里有上下文，但已经不是目标那条帖子
- `send-button-disabled-but-target-locked`
  - 目标帖已经锁定，但发送按钮仍处于不可发送状态
- `target-timeout`
  - 单条目标耗时超过 120 秒，应立即切换下一条
- `submitReadyDiagnostics`
  - 当发送前准备超时时，会额外附带 `editorFound / sendButtonFound / buttonDisabled / draftReady / composerLocked / pageLocked`
  - 用来区分到底是编辑框、发送按钮、草稿写入还是 composer 绑定没就绪
- `replydrop-api-timeout`
  - page bridge 在超时窗口内没有收到响应
- `unknown-api-method`
  - 调用了不存在的方法

其中：

- `addToQueue()` 对不存在目标通常会返回 `candidate-not-found`
- `skipCandidate()` 对不存在目标通常会返回 `candidate-not-found`
- `markShipped()` 对不存在目标通常会返回 `tweet-not-found`
- `getMediaBundle()` 对不在当前页面也不在当前状态里的目标通常会返回 `tweet-not-found`
- `openComposer()` 在需要先跳转目标帖时通常会先返回 `navigating`

## 调用约束

- 只在 `x.com` 暴露
- 读接口无副作用
- 写接口会校验 `tweetId`
- `openComposer()` / `submitReply()` 会驱动页面里的真实回复 UI
- `submitReply({ autoLikeIfChinese: true })` 只适合 agent 自动化链路；人工模式不需要用这个参数
- 其他写接口会走现有真实状态链路，不是 popup 层的临时假状态

## 最短示例

```js
await page.evaluate(async () => {
  const api = window.ReplyDropExecutor || window.ReplyDropAPI;
  const candidates = await api.getCandidates();
  if (!candidates.length) {
    return { ok: false, reason: "no-candidates" };
  }

  const lead = candidates[0];
  await api.addToQueue(lead.tweetId);
  return {
    lead,
    queue: await api.getQueue()
  };
});
```

## 更完整的 smoke 示例

```js
await page.evaluate(async () => {
  const api = window.ReplyDropExecutor || window.ReplyDropAPI;
  const [candidates, queue, state] = await Promise.all([
    api.getCandidates(),
    api.getQueue(),
    api.getState()
  ]);

  if (!candidates.length) {
    return { ok: false, reason: "no-candidates" };
  }

  const target = candidates[0];
  const queued = await api.addToQueue(target.tweetId);
  const reply = await api.runExecutorAction({
    action: "reply",
    tweetId: target.tweetId,
    draft: "smoke test reply",
    submitOptions: {
      autoLikeIfChinese: true
    }
  });

  return {
    ok: true,
    queued,
    reply,
    queueCount: queue.length,
    stateKeys: Object.keys(state)
  };
});
```

## 适合做什么

- 读当前候选，决定 AI 要处理哪一条
- 读取候选对应的图片 / 视频引用，再交给 agent 自己做视觉判断
- 把目标塞进 `下一轮 / 今晚 / 明早`
- 打开目标帖的真实回复框并写入草稿
- 在显式调用时提交当前回复并读取 outcome
- 在外部自动化已完成实际发送后，回写 ReplyDrop shipped 状态
- 对低价值候选做略过，减少重复推荐

## 目前不适合做什么

- 不做后台无人值守连续群发
- 不替代 popup 的所有可视交互
- 不保证在 `twitter.com` 暴露同一接口
- 不提供远端认证、配额或云同步

## 调试建议

- 先用 `getCandidates()` 和 `getQueue()` 确认目标是否真的在当前状态里
- 如果你已经是执行器流，优先用 `getExecutorInbox()` 和 `getExecutorContext()`；旧 `getAgentInbox()` / `getCandidateContext()` 仍可用，但更适合作为兼容接口
- 如果你要让 agent 真正看图，先调 `getMediaBundle(tweetId)`，再决定是否截图 / 视觉分析
- 遇到状态疑问时，用 `getState()` 看完整快照
- 准备发版前，再按 [SMOKE-TEST.md](./SMOKE-TEST.md) 走一轮 API 冒烟
