# Automation API

## 目标

ReplyDrop 暴露这套接口，是为了让 Ada、CDP 脚本或其他本地自动化直接操作插件状态，而不是依赖：

- 截图识别
- popup 可见状态
- DOM 找按钮再点击

这套接口当前面向 `x.com` 页面上下文。

## 暴露方式

在 `x.com` 页面里，ReplyDrop 会注入：

```js
window.ReplyDropAPI
```

如果你在 `twitter.com`、扩展 popup、普通网页或非页面上下文里调用，它不保证存在。

## 可用方法

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

### `markShipped(tweetId, replyText)`

把某条候选或队列项标记为已经发出，并落到 ReplyDrop 的 shipped / pickup 生命周期。

注意：

- 这是 ReplyDrop 状态动作，不是替你点击 X 的“发送”按钮
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
- `replydrop-api-timeout`
  - page bridge 在超时窗口内没有收到响应
- `unknown-api-method`
  - 调用了不存在的方法

其中：

- `addToQueue()` 对不存在目标通常会返回 `candidate-not-found`
- `skipCandidate()` 对不存在目标通常会返回 `candidate-not-found`
- `markShipped()` 对不存在目标通常会返回 `tweet-not-found`

## 调用约束

- 只在 `x.com` 暴露
- 读接口无副作用
- 写接口会校验 `tweetId`
- 写接口会走现有真实状态链路，不是 popup 层的临时假状态

## 最短示例

```js
await page.evaluate(async () => {
  const api = window.ReplyDropAPI;
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
  const api = window.ReplyDropAPI;
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
  const shipped = await api.markShipped(target.tweetId, "test reply");

  return {
    ok: true,
    queued,
    shipped,
    queueCount: queue.length,
    stateKeys: Object.keys(state)
  };
});
```

## 适合做什么

- 读当前候选，决定 AI 要处理哪一条
- 把目标塞进 `下一轮 / 今晚 / 明早`
- 在外部自动化已完成实际发送后，回写 ReplyDrop shipped 状态
- 对低价值候选做略过，减少重复推荐

## 目前不适合做什么

- 不直接自动点击 X 的真实发送按钮
- 不替代 popup 的所有可视交互
- 不保证在 `twitter.com` 暴露同一接口
- 不提供远端认证、配额或云同步

## 调试建议

- 先用 `getCandidates()` 和 `getQueue()` 确认目标是否真的在当前状态里
- 遇到状态疑问时，用 `getState()` 看完整快照
- 准备发版前，再按 [SMOKE-TEST.md](./SMOKE-TEST.md) 走一轮 API 冒烟
