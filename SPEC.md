# X Reply Scorer — Chrome Extension Spec

## 目标
构建一个轻量 Chrome 插件，功能对标并超越 ReplyWisely：
在 X (Twitter) 的 feed/搜索/话题页面，对每条推文实时打分，用角标高亮显示，帮助用户快速识别高价值回复目标。支持中英文界面切换，关键词/加成规则完全可自定义。

## 核心功能

### 1. 实时评分
- 监听 X 页面 feed/搜索结果的 DOM 变化（MutationObserver）
- 对每条推文计算 VPS（Viral Potential Score），0-100 分
- 分数角标注入推文卡片右上角

### 2. VPS 评分算法
基础权重（均来自推文卡片已渲染的 DOM 数据，无需 API）：

| 指标 | 权重 | 说明 |
|------|------|------|
| 作者粉丝数 | 30% | 粉丝量越高，曝光潜力越大 |
| 推文 Likes 数 | 25% | 当前互动热度 |
| 推文 Replies 数 | 20% | 讨论活跃度，回复参与感 |
| 推文 Views 数 | 15% | 实际曝光量 |
| 发帖时间新鲜度 | 10% | 越新越好，超过 6 小时快速衰减 |

**加成规则（加分项，均可在设置页自定义/增删）：**

语言加成（+5，每项独立可启停）：
- 推文语言为日文
- 推文语言为韩文

话题加成（+10，每组独立可启停）：
- AI 类关键词：AI, ChatGPT, Claude, Gemini, Seedance, 即梦, 生成AI, LLM, AGI, Copilot, Grok, Perplexity
- Crypto 类关键词：crypto, bitcoin, BTC, ETH, BNB, DeFi, NFT, Web3, blockchain, altcoin, memecoin, on-chain

模型名称加成（+5，可自由增删）：
- 默认列表：GPT-4, GPT-5, o3, o4, Claude 3, Claude 4, Gemini, Llama, Mistral, Qwen, DeepSeek, Grok, Flux, Midjourney, Sora, Kling, Wan, HunyuanVideo, Seedance
- 用户可在设置页随时增删该列表

认证加成（+5）：
- 作者有蓝勾/金勾认证

**分级显示：**
- 80+：🟢 High Potential（绿色角标）
- 60-79：🟡 Good（黄色角标）
- 40-59：⚪ Medium（灰色，仅显示分数）
- <40：不显示角标

### 3. 关键词过滤与自定义
- 所有加成关键词列表均可在设置页增删，分组管理（语言/AI/Crypto/模型名）
- 每组可单独启用/停用
- 勾选"只高亮含关键词的帖子"时，未命中任何关键词的推文不显示角标
- 自定义改动实时生效，存 localStorage

### 4. 回复计数 + 历史记录
- **插件图标 badge**：浏览器工具栏图标右上角实时显示今日已回复总数（绿色 badge 数字），无需点开 popup
- **帖子已回复标记**：已回复过的推文在左下角注入 ✓ 标记，直观显示"我回复过这条"
- 每次点击回复按钮时，自动记录：推文 URL、作者 handle、分数、时间戳
- popup 主页显示：
  - 今日已回复帖子数
  - 本周已回复帖子数
  - 回复最多的 Top 5 账号（及各自回复次数）
- 历史记录页：最近 100 条已回复记录，按时间倒序
- 可导出为 CSV
- 本地 IndexedDB 存储，无数据上传

### 5. 多语言界面 + Popup UI

**语言切换：**
- 支持中文 / English 界面切换
- 切换按钮放在 popup 右上角，一键切换
- 所有 UI 文本、提示、标签均响应切换
- 语言偏好存 localStorage

**Popup 结构（四个 Tab）：**
1. **首页（Home）**：总开关 + session 统计（已扫描/高分帖数）+ 回复计数今日/本周
2. **关键词（Keywords）**：分组管理 AI/Crypto/模型名/语言加成，支持增删，每组有启停开关
3. **历史（History）**：最近 100 条回复记录 + Top 5 常回复账号 + CSV 导出
4. **设置（Settings）**：语言切换 / 分数阈值调整 / 清空数据

---

## 技术栈
- Manifest V3 Chrome Extension
- Vanilla JS（无框架，保持轻量）
- CSS 注入角标样式
- IndexedDB 本地存储
- MutationObserver 监听 DOM 变化

## 文件结构
```
x-reply-scorer/
├── manifest.json
├── content.js          # DOM 监听 + 评分注入 + 回复计数注入
├── scorer.js           # VPS 算法模块
├── i18n.js             # 中英文字符串映射
├── popup.html          # 插件弹窗 UI（四 Tab）
├── popup.js
├── popup.css
├── background.js       # Service Worker（轻量，仅处理存储事件）
├── storage.js          # IndexedDB 封装
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 评分算法伪代码

```js
function calcVPS(tweet, userSettings) {
  const followers = parseCount(tweet.authorFollowers);
  const likes     = parseCount(tweet.likes);
  const replies   = parseCount(tweet.replies);
  const views     = parseCount(tweet.views);
  const ageHours  = (Date.now() - tweet.timestamp) / 3600000;

  // 归一化（对数压缩，避免大 V 完全碾压）
  const fScore = Math.min(Math.log10(followers + 1) / 6, 1) * 30;
  const lScore = Math.min(Math.log10(likes + 1) / 4, 1) * 25;
  const rScore = Math.min(Math.log10(replies + 1) / 3, 1) * 20;
  const vScore = Math.min(Math.log10(views + 1) / 6, 1) * 15;
  const tScore = Math.max(0, 1 - ageHours / 6) * 10;

  let base = fScore + lScore + rScore + vScore + tScore;

  // 语言加成（各+5）
  if (userSettings.langJa && isJapanese(tweet.text))  base += 5;
  if (userSettings.langKo && isKorean(tweet.text))    base += 5;

  // 话题加成（各+10）
  if (userSettings.aiEnabled   && matchesKeywords(tweet.text, userSettings.aiKeywords))     base += 10;
  if (userSettings.cryptoEnabled && matchesKeywords(tweet.text, userSettings.cryptoKeywords)) base += 10;

  // 模型名加成（+5）
  if (userSettings.modelEnabled && matchesKeywords(tweet.text, userSettings.modelKeywords)) base += 5;

  // 认证加成
  if (tweet.authorVerified) base += 5;

  return Math.min(Math.round(base), 100);
}
```

## DOM 选择器参考（X 当前结构，2026-04）
X 的 DOM 不稳定，建议用 data-testid 属性定位：
- 推文卡片：`article[data-testid="tweet"]`
- 推文文本：`[data-testid="tweetText"]`
- Likes 数：`[data-testid="like"] span`
- Replies 数：`[data-testid="reply"] span`
- Views：`[data-testid="views"] span`（或 `[aria-label*="views"]`）
- 作者名：`[data-testid="User-Name"]`
- 时间戳：`time[datetime]`

注意：Views 和粉丝数不总是在卡片内直接渲染，需要做 fallback（无法读取时该项权重降为 0，其余项等比例补偿）。

## 验收标准
1. 在 X feed 页面滚动时，可见推文卡片在 500ms 内出现 VPS 分数角标
2. 已回复过的账号，在其推文旁显示回复次数计数
3. 角标不遮挡推文交互按钮（点赞、回复、转推）
4. 总开关关闭后所有角标消失，不影响 X 正常使用
5. 中英文界面切换即时生效
6. 插件体积 < 500KB（不含图标）
7. 不请求任何外部 API，纯本地运行

## 优先级
- P0：评分 + VPS 角标显示 + 总开关
- P1：语言/AI/Crypto/模型名加成 + 关键词分组管理（增删）
- P2：回复计数角标 + 历史记录 + CSV 导出
- P3：中英文界面切换 + 高级设置（自定义权重/阈值）
