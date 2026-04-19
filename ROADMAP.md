# ReplyDrop Roadmap — post-reset

## 已完成的重建阶段

1. 从 `p2.55` 包恢复到独立目录
2. 补齐开源仓核心文档
3. 建立验证脚本、打包脚本和运行时清单
4. 抽出 pickup / workflow / attribution 三个共享核心
5. 建立 Node 原生测试并接入发版流程
6. 建立 GitHub Actions、Issue/PR 模板与基础协作入口

## 下一阶段：朝“像样的开源 alpha”继续推进

### 1. 继续拆大文件

- 优先从 `popup.js` 中继续拆出：
  - growth dashboard builders
  - draft workbench generators
  - reply archive / pickup presenters
- 目标是让 UI 渲染层和策略层边界更清楚

### 2. 把增长面板做成真实产品层

- 从现在的 Growth Pulse 再往前推进成更完整的 Growth Dashboard
- 补上：
  - handle / topic / lane 趋势摘要
  - reviewed / settled timeline
  - pickup conversion 视角

### 3. 提升 draft 质量

- 继续减少模板味
- 增强不同语气、长度、切入角度之间的差异
- 让 rewrite 更接近 ReplyWisely / TweetHunter / Typefully 这类产品的“可直接拿来改”水平

### 4. 收紧 publish / recovery loop

- 继续降低“已拉起 composer 但没闭环”的丢单概率
- 让 publish-watch 提醒比当前更主动、更不容易遗漏

### 5. 继续细化开源协作体验

- issue triage 规范
- 更完整的 contributor onboarding checklist
- 后续如公开到 GitHub，再补 label strategy 和 release notes 模板

## 不希望回退的方向

- 不把插件重新做成网页后台
- 不引入必须联网的外部服务
- 不为了复杂功能牺牲稳定性
- 不再让版本、zip、文档长期漂移
