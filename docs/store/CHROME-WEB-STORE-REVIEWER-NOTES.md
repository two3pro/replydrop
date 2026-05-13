# Chrome Web Store Reviewer Notes

这份文档收的是 ReplyDrop 在审核、复审或权限追问里最容易被问到的问题，方便后续直接复用。

## One-Line Summary

ReplyDrop is a local-first browser extension for X that scores already-visible posts, helps users queue reply opportunities, and review shipped reply pickup without auto-posting or uploading data to developer-owned servers.

## What The Extension Actually Does

- 只在 `x.com` / `twitter.com` 页面工作
- 读取页面里已经渲染出来的公开帖子内容
- 给可见帖子打分，并在回复入口附近显示水滴提示
- 把候选、队列、发后复查和本地工作状态留在浏览器里
- 允许用户或本地 Agent 通过 `window.ReplyDropAPI` 读候选、排队、标记已发

## What It Does Not Do

- 不会自动替用户点击发送
- 不会代表用户发帖
- 不会调用远端模型 API
- 不会把页面数据上传到 ReplyDrop 自己的服务器
- 不需要 ReplyDrop 账号系统

## Why Host Permissions Are Needed

ReplyDrop 只请求：

- `https://x.com/*`
- `https://twitter.com/*`
- `http://127.0.0.1/*`
- `http://localhost/*`

原因是扩展必须在这些页面注入内容脚本，才能：

- 读取已经显示出来的帖子文本和可见互动数
- 在回复入口旁边显示水滴提示
- 打开页内面板与本地工作流状态
- 暴露 `window.ReplyDropAPI` 给本地自动化脚本

`127.0.0.1 / localhost` 只用于可选的本地 bridge / runner 路径，让用户自己的本地自动化脚本与扩展页内 API 协作，不会连接开发者自有远端服务器。

## Why `storage` Is Needed

`storage` 用于保存本地偏好和工作状态，例如：

- `recentCandidates`
- `replyQueue`
- `replyDetails`
- `publishWatch`
- `pickupWatch`
- 语言、主题、关键词和 UI 偏好

这些状态只保存在浏览器本地，目的是让用户关闭 popup 或刷新页面后还能继续上一轮工作。

## Why `tabs` Is Needed

`tabs` 用于：

- 读取当前 X 标签页上下文
- 从 popup 返回或打开目标帖子
- 让用户在候选、队列和复查项之间快速跳转

## Why `alarms` Is Needed

`alarms` 用于少量本地后台状态维护，例如：

- 日切重置
- 延时复查提醒
- publish / pickup watch 的本地时间推进

不依赖任何远端调度服务。

## Remote Code

ReplyDrop 当前版本不使用远程代码：

- 不拉取远端托管的 JS / Wasm
- 不执行远端脚本
- 不依赖外部模型推理 API

所有运行时代码都包含在扩展包内部。

## Data Handling

ReplyDrop 读取的是用户浏览器里已渲染出来的页面内容，并把工作状态写入 `chrome.storage.local`。

当前版本：

- 不上传到开发者自有服务器
- 不出售数据
- 不用于广告定向
- 不用于信用评估

## Auto-Posting Boundary

ReplyDrop 的定位是“帮助发现、排队和复查”，不是无人值守自动发帖机器人。

当前版本：

- 可以帮助用户发现高价值回复机会
- 可以记录某条回复已发出
- 可以做发后复查
- 可以在用户显式本地操作或本地自动化调用时提交当前回复
- 但不会在后台无人值守连续群发

## Quick Reviewer Test Flow

1. Install the submitted build.
2. Open any `x.com` page with visible public posts.
3. Wait a few seconds for the content script to scan visible posts.
4. Look for ReplyDrop score hints near reply actions.
5. Open the toolbar popup and confirm the layered home/dashboard flow.
6. In the page console, run `window.ReplyDropAPI.getCandidates()` to verify the local automation bridge.
