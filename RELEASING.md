# Releasing

## 发布原则

- 先验证，再打包
- 公开发布前先导出干净开源树，再决定是否对外推仓
- zip 只包含扩展运行时文件
- `manifest.json`、`CHANGELOG.md`、README 中的版本和脚本说明必须同步

## 本地发布流程

1. 确认当前改动已经完成
2. 运行：

```bash
cd <repo-dir>
node scripts/validate-release.mjs
```

3. 如需检查公开仓门面，运行：

```bash
npm run export:oss
```

如果这轮还改了图标、商店截图或上架文案，先重生成一次：

```bash
python3 scripts/generate-store-assets.py
```

4. 通过后运行：

```bash
bash scripts/package-release.sh
```

5. 检查根目录生成的 `replydrop-p2.xx.zip`
6. 如果公开页需要下载入口，把对外要保留的包同步到 `downloads/`
7. `package-release.sh` 会自动校验：
   - 包内 `manifest.json` 版本
   - zip 文件集合是否与 `scripts/runtime-files.txt` 完全一致
8. 按 [SMOKE-TEST.md](./SMOKE-TEST.md) 至少走一轮快速验证
9. 如果准备上架商店，再检查 [docs/store/CHROME-WEB-STORE-LISTING.md](./docs/store/CHROME-WEB-STORE-LISTING.md)

## 版本规则

- `manifest.json` 使用完整版本：如 `0.2.68`
- zip 使用短版本：如 `replydrop-p2.68.zip`
- `CHANGELOG.md` 必须按版本顺序补齐说明

## 运行时文件来源

唯一来源：

- [scripts/runtime-files.txt](./scripts/runtime-files.txt)

不要手动在 zip 命令里临时拼文件列表，避免把：

- handoff 文档
- 截图
- 临时测试文件
- 开发说明

误打进扩展包。

## 干净开源树来源

唯一来源：

- [scripts/open-source-files.txt](./scripts/open-source-files.txt)

导出命令：

```bash
npm run export:oss
```

导出说明见 [OPEN-SOURCE-RELEASE.md](./OPEN-SOURCE-RELEASE.md)。

如果公开页需要长期保留下载链接，把对应归档包放进 `downloads/`，不要直接依赖根目录临时产物。
