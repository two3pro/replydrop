# Smoke Test

每次准备发版前，至少手工走完以下流程。

## 1. 基础加载

- 在 `chrome://extensions` 用“加载已解压的扩展程序”加载当前目录
- 确认扩展图标正常显示
- 打开 popup，确认没有白屏、报错或明显错位

## 2. X 页面注入

- 打开 `https://x.com/home`
- 确认右上悬浮水滴出现
- 确认帖子上的水滴角标正常渲染
- 切换总开关，确认页内角标和入口能同步开关
- 点击右上悬浮水滴打开页内面板，确认鼠标滚轮在整块面板范围内都能滚动，不是只在局部区域生效
- 在页内面板里切换 `首页 -> 仪表盘 -> 工作台 / 概览 / 加成 / 关键词`，确认深滚动后再切层不会卡死、丢滚动条或只剩局部可滚

## 3. 候选与工作台

- 在信息流里找到至少 3 条可评分帖子
- 打开 popup 的 `工作台`
- 确认“下一条建议”和“当前候选池”有内容
- 点击候选的 `打开原帖 / 复制链接 / 略过`
- 点击“恢复已略过”，确认候选可恢复

## 4. 规则草稿与 AI 执行台

- 在工作台选中一个候选
- 确认“规则草稿台”能生成 fallback 草稿
- 使用 `拿来改写 / 更锐 / 更柔和 / 更短 / 更像真人`
- 切到 `AI执行`，确认：
  - 能看到 top shortlist，而不是只显示 1 条模板草稿
  - `复制当前上下文 / 复制 Top6 收件箱 / 复制输出 Schema` 可点
  - `打开回复框` 能正确跳到目标帖
- 将当前草稿加入 `下一轮 / 今晚 / 明早`
- 确认队列中出现新项，排序正确

## 5. Publish Watch

- 从队列项触发“打开回复框 / composer”
- 返回 popup
- 确认该项进入 publish-watch 或 awaiting confirm 状态
- 关闭或完成流程后，确认状态能清掉或转移

## 6. Pickup Watch

- 对一个真实已回复帖子执行 pickup 检查
- 确认 `replyDetails` 与 `pickupWatch` 中的 baseline、delta、status 能更新
- 确认 Growth Pulse 中的 pickup 指标会变化

## 7. 状态持久化

- 关闭 popup 再重新打开
- 刷新 X 页面
- 重启浏览器后重新进入
- 确认关键状态仍在

## 8. Automation API 冒烟

- 在 `x.com` 页面控制台或 CDP evaluate 里确认 `window.ReplyDropAPI` 存在
- `getCandidates()` 返回数组，且每项至少包含 `tweetId / score / tier / url`
- `getAgentInbox({ limit: 6 })` 返回 `replydrop-agent-inbox-v1`
- `getCandidateContext(tweetId)` 返回 `replydrop-candidate-context-v1`
- `getReplySchema()` 返回 `replydrop-agent-reply-v1`
- `getQueue()` 返回数组，`getState()` 返回完整状态快照
- 选一个带图片或视频的真实候选执行 `getMediaBundle(tweetId)`，确认：
  - 返回里有 `mediaKind`
  - `items.length > 0`
  - 图片帖能拿到 `src`
  - 视频帖至少能拿到 `poster` 或 `src`
- 选一个真实候选执行 `addToQueue(tweetId)`，确认队列里出现 `pending`
- 打开该候选原帖后执行 `openComposer({ url: location.href, draft: "smoke test reply" })`，确认：
  - 返回 `ok: true`
  - `composerReady: true`
  - 页面里真实回复框有草稿正文
- 在安全测试账号/测试帖子上执行 `submitReply()`，确认：
  - 返回 `ok: true`
  - `outcomeText` 或页面 toast 能读到成功结果
- 如需验证状态回写链路，再执行 `markShipped(tweetId, "test reply")`，确认：
  - `replyDetails` 写入
  - `repliedTweets` 写入
  - `pickupWatch` 出现该项
- 选另一个候选执行 `skipCandidate(tweetId)`，确认它从候选流里消失

## 9. 脚本验证

```bash
node scripts/validate-release.mjs
```

## 10. 打包验证

```bash
bash scripts/package-release.sh
```

- 确认生成 `replydrop-p2.xx.zip`
- 解压后检查 `manifest.json` 版本号是否一致
