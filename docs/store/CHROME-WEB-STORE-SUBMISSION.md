# Chrome Web Store Submission Pack

这份文档收的是 ReplyDrop 当前这一版可直接照填的 Chrome Web Store 提交答案。

如果后续审核要求补充人工说明，可直接复用 [CHROME-WEB-STORE-REVIEWER-NOTES.md](./CHROME-WEB-STORE-REVIEWER-NOTES.md)。

参考官方文档：

- Listing: [developer.chrome.com/docs/webstore/cws-dashboard-listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing/)
- Privacy: [developer.chrome.com/docs/webstore/cws-dashboard-privacy](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/)

## 当前提交版本

- 扩展名：`ReplyDrop`
- 版本：`0.2.171`
- 打包 zip：`replydrop-p2.171.zip`
- 仓库主页：[github.com/two3pro/replydrop](https://github.com/two3pro/replydrop)
- 支持页：[github.com/two3pro/replydrop/issues](https://github.com/two3pro/replydrop/issues)
- 隐私政策页：[github.com/two3pro/replydrop/blob/main/PRIVACY.md](https://github.com/two3pro/replydrop/blob/main/PRIVACY.md)
- 分类建议：`Productivity`
- 默认 listing 语言建议：`简体中文`

## 资产上传清单

- App icon：`icons/icon128.png`
- Screenshots：
  - `docs/store/chrome-web-store-01-find-candidates.png`
  - `docs/store/chrome-web-store-02-language-boosts.png`
  - `docs/store/chrome-web-store-03-layered-dashboard.png`
  - `docs/store/chrome-web-store-04-growth-dashboard.png`
  - `docs/store/chrome-web-store-05-local-automation.png`
- Small promo tile：`docs/store/chrome-web-store-small-promo-tile.png`
- Marquee promo tile：`docs/store/chrome-web-store-marquee-promo-tile.png`
- Promo video source：`docs/store/replydrop-chrome-web-store-promo.mp4`
- Promo video poster：`docs/store/replydrop-chrome-web-store-promo-poster.png`

说明：

- Chrome Web Store 的视频入口填的是 YouTube 链接，不是直接上传 mp4。
- 先把 `replydrop-chrome-web-store-promo.mp4` 上传到 YouTube 设成“不公开”，再把视频 URL 填进 dashboard。

## 店铺文案

### 一句话卖点

实时给 X 时间线上的帖子打分，帮你在窗口关闭前找到最值得回复的机会。

### 短描述

开源免费，本地运行，零数据上传；实时给 X 帖子打分，并用本地队列和 pickup 追踪管理回复机会。

### 详细描述

ReplyDrop 是一个浏览器扩展，实时给你 X 时间线上的每条帖子打分，帮你在窗口关闭前找到最值得回复的机会。

它开源免费，本地运行，零数据上传，不收钱，不依赖任何外部服务。核心目标不是做网页后台，也不是做无人值守批量发帖工具，而是把“先发现值得回复的帖子，再决定什么时候跟进”这件事做得更稳、更清楚。

当前版本重点提供这些能力：

- 在 X 页面实时打分，并用水滴提示高价值回复机会
- 界面支持简体中文、繁體中文、English、日本語、한국어
- 回复语言加成覆盖中日韩英法西德意葡，帮助你匹配目标受众
- 主题关键词加成支持 `AI` / `Crypto` / `Creator` 等细分方向，也支持自定义关键词
- 完整的本地回复队列 + pickup 追踪，发出后自动复查互动结果
- `window.ReplyDropAPI` 让 AI Agent 可以通过 CDP 直接接管候选筛选、排队和追踪流程
- 分层仪表盘把首页入口、工作台和设置区拆开，避免把插件做成一条又长又挤的面板
- Growth Dashboard 把已发回复、待确认与 pickup 复查看成真正的增长看板

ReplyDrop 当前坚持几个边界：

- 本地优先，不依赖云端账号系统
- 不要求登录 ReplyDrop 自己的服务
- 不调用远端 AI API
- 不会在后台无人值守批量发帖；只有显式本地操作或本地自动化调用时才会提交当前回复

如果你想要的是一个更接近 ReplyWisely / Hypefury / TweetHunter / Typefully 工作流节奏，但仍然保留浏览器插件轻量感与可解释状态的工具，ReplyDrop 会是一个更容易上手的替代方案。

## Single Purpose

建议直接填写：

> ReplyDrop helps users find reply-worthy posts on X, organize those opportunities in a local queue, and review post-ship pickup without uploading data to external services.

## 权限与隐私答卷

### 远程代码

- `Does the item use remote hosted code?`
- 建议答案：`No`

说明：

- 当前版本不拉取远端脚本，不执行远端托管代码，不依赖远端模型 API。

### 数据处理

建议答案：

- `No, ReplyDrop does not collect or transmit user data off device.`

补充说明可贴：

> ReplyDrop reads already-rendered public content on x.com / twitter.com inside the user’s browser tab and stores workflow state locally in chrome.storage.local. The current version does not upload this data to developer-owned servers, does not sell data, and does not use data for advertising or profiling outside the extension’s core functionality.

如果 dashboard 强制要求填某个数据类别，再退一步这样描述：

- 类别：`Website content`
- 用途：`Core functionality only`
- 其他选项：`Not sold` / `Not used for ads` / `Not used for creditworthiness`

### 权限说明

`storage`

- 保存本地偏好、候选、队列、publish watch、pickup watch 和增长回看状态。

`tabs`

- 让 popup 能读取当前 X 标签页上下文，并在需要时打开或切换到目标帖子。

`alarms`

- 驱动本地日切、延时复查和少量后台状态维护，不依赖远端调度。

`https://x.com/*`

- 在 `x.com` 页面注入评分、角标、popup API 和本地工作流状态。

`https://twitter.com/*`

- 保留对旧域名和跳转场景的兼容。

## Reviewer 测试说明

建议直接粘贴：

1. Install the extension from the attached `replydrop-p2.207.zip`, or load the unpacked folder in developer mode.
2. Open any `x.com` page with visible public posts. A logged-in X account makes review easiest, but any timeline or search page with rendered posts is fine.
3. Wait a few seconds for the content script to scan visible posts. High-scoring posts show a small ReplyDrop score hint near the reply action.
4. Click the ReplyDrop toolbar icon and confirm the popup opens on the home layer.
5. Turn on scoring if it is currently off, choose a reply language, and open `Dashboard`.
6. In Dashboard, switch between `Workspace`, `Overview`, `Boosts`, and `Keywords` to confirm the layered plugin workflow.
7. Return to the X page DevTools console and run `window.ReplyDropAPI.getCandidates()` to confirm the page-world automation bridge is available.

## 提交前最后检查

- 确认上传的是 `replydrop-p2.207.zip`
- 确认 `manifest.json` 版本是 `0.2.171`
- 确认视频已先传到 YouTube 并拿到不公开链接
- 确认支持页与隐私页都指向公开仓地址
- 确认截图顺序与 [CHROME-WEB-STORE-LISTING.md](./CHROME-WEB-STORE-LISTING.md) 一致
