# Contributing to ReplyDrop

ReplyDrop 目前是一个本地优先的浏览器扩展项目，优先级顺序是：

1. 稳定
2. 可验证
3. 可维护
4. 再继续扩能力

## 开始前先理解这几个边界

- 它首先是浏览器插件，不是网页后台
- 主要依赖 X / Twitter 当前可见 DOM
- 默认不引入必须联网的服务
- 不为了复杂功能牺牲可用性和验证纪律

## 最欢迎的贡献方向

- DOM 选择器与状态同步修复
- popup / content / background 的共享逻辑拆分
- 测试补齐
- 发布流程、CI、文档和开源协作设施补齐
- 提升 Draft / Queue / Growth Dashboard 的真实可用性

## 不建议一上来做的事情

- 大型 UI 推倒重来
- 引入强依赖服务端的架构
- 在没有验证的情况下连续堆功能
- 把插件重新做成网页后台

## 本地开发前置

```bash
cd <repo-dir>
node scripts/validate-release.mjs
```

可选快捷命令：

```bash
npm run check:syntax
npm run check:oss
npm run check:doc-links
npm run test
npm run validate
npm run package
npm run export:oss
```

## 提交前最低检查

1. 语法检查通过
2. Node 测试通过
3. 如果改了 popup / 页内交互，至少走一轮 [SMOKE-TEST.md](./SMOKE-TEST.md)
4. 如果改了版本、发版脚本或运行时文件，重新打包一次 zip

## PR 建议

- 一个 PR 尽量只解决一类问题
- UI 变更请附 before / after 截图
- 如果涉及 X DOM 结构，请说明受影响页面
- 如果新增状态字段，请同时补归一化逻辑和测试
- 如果只是探索方向，先提 issue 再动大改

## Issue 与支持

- 缺陷请走 bug template
- 新能力建议请走 feature template
- 使用和排障问题请先看 [SUPPORT.md](./SUPPORT.md)
- 安全问题请按 [SECURITY.md](./SECURITY.md) 私下报告

## 默认不作为公开仓门面的内容

- `HANDOFF-*`
- `PRODUCT-GAP-*`
- `replydrop-p*.zip`
- 原始截图与录屏

公开导出策略见 [OPEN-SOURCE-RELEASE.md](./OPEN-SOURCE-RELEASE.md)。
