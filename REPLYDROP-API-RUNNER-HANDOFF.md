# ReplyDrop API Runner Handoff

只走当前桌面浏览器里已打开的 X 页面 + 本地 runner。  
不需要手工配置 `9222`，不走 DevTools Console，不走地址栏注入，不走 GUI 点点点。

## 目标

新会话 Codex 只按这条固定流程做水滴压测：

1. 调用包内本地 runner
2. 页内 ReplyDrop 通过固定 localhost bridge 自己拉取命令
3. 由 ReplyDrop 页内 API 执行并把结构化结果回传
4. 只按结果继续，不要自创第二条自动化路线
5. 一次只跑 1 条命令，等 JSON 返回后再跑下一条

## 文件

- `tools\windows\replydrop-local-runner.ps1`
- `tools\windows\replydrop-local-runner.js`

## 前提

1. 当前账号已经在桌面 Chrome / Brave 里登录 X
2. 当前要压测的 X 标签页已经打开，且最好停在 `https://x.com/home`
3. 装完这一版扩展后，先手动刷新一次这个 X 标签页，确保最新 content script 已注入
4. 当前浏览器里只启用了一个 ReplyDrop，且就是当前目录这一版
5. 新会话不要自己新造 GUI / Console / Playwright 路线

## 固定流程

这份 handoff 现在按“压测模式”执行，不再按“烟雾测试模式”执行。  
重点是持续补扫、持续发，不要因为一次空池就整轮硬停。

### 1. 先跑 doctor

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action doctor
```

通过标准：

- `ok = true`
- `href` 在 `x.com`
- `health.ok = true`

### 2. 再跑 health

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action health
```

期望：

- `ok = true`
- `apiReady = true`
- `bridgeReady = true`

### 3. 读取执行能力

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action capabilities
```

### 4. 进入压测循环

从这里开始，按下面这条循环一直跑，直到命中停止条件。

#### A. 先读 inbox

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action inbox
```

读取口径固定为：

- `onlyReplyNow = true`
- `includeMedia = true`
- `preservePool = true`
- `autoResetIfStopped = true`
- `resetRound = true`

#### B. 如果 inbox 有候选

1. 取首条 `reply-now` 候选
2. 读取它的 `context`
3. 生成草稿
4. 跑 `send-once`
5. 不管是首页直发还是 `detail_inspect_then_reply`，都继续走 `send-once`
6. 一条发送完成后，立刻回到 `inbox`

读取上下文：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action context -TweetId 1234567890123456789
```

发送：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action send-once -TweetId 1234567890123456789 -DraftFile .\draft.txt
```

说明：

- `context` 默认返回轻量上下文，不再默认附带整包媒体 bundle
- 目的是先稳住 runner 回传链路，不让媒体帖把本地回传拖超时
- 如果不传 `-TweetId`，runner 会直接从当前 `reply-now` inbox 里取首条候选
- 如果 `executionRoute` 是 `detail_inspect_then_reply`，也照样直接跑 `send-once`
- 详情打开、媒体检查、回帖提交流程由页内 ReplyDrop 自己分流，不要外层再造第二套 detail 流程

#### C. 如果 inbox 为空

1. 先做一次 `refresh`
2. 再读一次 `inbox`
3. 如果第二次还空，这只算 1 次 empty cycle，不是整轮立即停止
4. 继续下一轮循环，直到命中停止条件

重扫命令：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action refresh
powershell -ExecutionPolicy Bypass -File .\tools\windows\replydrop-local-runner.ps1 -Action inbox
```

#### D. 如果 send-once 失败

1. 记录失败 JSON
2. 不要立刻对同一条再次 `send-once`
3. 直接回到 `inbox`
4. 继续下一条候选或继续补扫

#### E. 循环计数规则

- `successCount`：只统计本轮新增成功回复数
- `failCount`：只统计结构化发送失败数
- `emptyCycleCount`：只统计“`inbox` 空 -> `refresh` -> `inbox` 仍空”的次数
- 任何一次成功发送后，`emptyCycleCount` 归零
- `2/6`、`3/6` 这种数字只是当前进度，不是停止阈值
- 不要把“一次空池”理解成“整轮结束”

## 硬规则

- 不要打开 DevTools Console
- 不要把 JS 粘进地址栏
- 不要让 Codex 通过 GUI 键鼠去点搜索框、地址栏、Console
- 不要额外解释 `CDP / 9222`
- 只允许走 `replydrop-local-runner`

## 停止条件

出现以下情况就停止并报告：

1. `doctor` 返回结构化错误
2. `health.ok !== true`
3. `ReplyDrop` 未加载
4. X 登录态缺失
5. runner 返回结构化错误
6. `replydrop-api-document-reloaded`
7. `local-runner-timeout`
8. 连续 3 次 `empty cycle` 仍无候选
9. 连续 90 秒没有新增成功回复，且期间一直没有可发候选

不要因为下面这些情况停止：

1. 当前只发到 `2/6`
2. 某一次 `inbox` 返回 `no-auto-safe-candidate`
3. 某一次 `refresh + inbox` 仍为空
4. 某一条 `send-once` 失败但 runner 仍可继续工作

## 汇报格式

每一步只回 JSON 结果和一句结论。  
每轮补充当前计数：

- `successCount`
- `failCount`
- `emptyCycleCount`

- `doctor`
- `health`
- `capabilities`
- `inbox`
- `context`
- `send-once`

不要回过程文学。
