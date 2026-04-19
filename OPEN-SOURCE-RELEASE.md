# Open-Source Release

## 目的

这个仓库当前既承担实际迭代，也保留了很多内部 handoff、旧 zip、截图与工作痕迹。

正式公开时，不应该要求手动清理这些文件后再发布。

所以现在的发布策略是：

- 工作目录继续保留内部迭代痕迹
- 用一套显式导出脚本，生成干净的公开树

## 一键导出

```bash
cd <repo-dir>
npm run validate
npm run export:oss
```

导出结果会生成到：

- `open-source-export/replydrop-open-source-p2.xx`
- `open-source-export/replydrop-open-source-latest`

## 导出的内容

唯一来源：

- [scripts/open-source-files.txt](./scripts/open-source-files.txt)

它只包含真正适合作为公开仓门面的文件，例如：

- 运行时代码
- 测试
- 文档
- GitHub 模板与工作流
- 发布脚本

## 默认不会进入公开导出的内容

- `HANDOFF-*`
- `PRODUCT-GAP-*`
- `replydrop-p*.zip`
- 原始截图与录屏
- 其他本地工作痕迹

## 发布前建议

1. 先跑 `npm run validate`
2. 再跑 `npm run export:oss`
3. 检查导出树里的 `README.md`、`CHANGELOG.md`、`docs/assets`
4. 如需正式发布扩展运行时包，再额外执行 `npm run package`
