# Privacy

## 当前原则

ReplyDrop 当前版本默认按“本地优先、最小外发、可解释状态”处理数据。

## 会读取什么

扩展只会读取你当前在 `x.com` / `twitter.com` 页面里已经渲染到浏览器中的公开内容，例如：

- 帖子文本
- 作者 handle
- likes / replies / views 等可见互动数
- 页面是否出现回复框、作者回流等可见线索

## 会存什么

数据保存在浏览器扩展本地存储 `chrome.storage.local`，主要包括：

- 基本开关与语言 / 主题 / 关键词偏好
- `recentCandidates`
- `replyDetails`
- `replyQueue`
- `publishWatch`
- `pickupWatch`
- `relationshipStates`

这些状态的用途是让 popup、页内面板和后台服务能够恢复你上一轮工作进度。

## 不会做什么

- 不会把内容上传到 ReplyDrop 自己的服务器
- 不会要求外部账号登录
- 不会调用远端 AI API
- 不会自动发帖或自动替你点击发布

## 权限说明

### `storage`

用于保存本地状态和偏好。

### `tabs`

用于打开 X 页面、切换到目标帖子，或配合 popup 与当前标签页通讯。

### `alarms`

用于本地日切和少量延时状态更新。

### `host_permissions`

只对 `https://x.com/*` 和 `https://twitter.com/*` 生效。

## 风险边界

- 如果 X 调整 DOM 结构，扩展需要同步更新选择器
- 如果你手动开启浏览器同步功能，`chrome.storage` 的数据行为会由你的浏览器策略决定
- 本项目当前没有远程删除或账号级审计能力，因为它本来就不依赖服务端

## 开源前建议

- 若未来引入云端同步或外部模型，必须先更新本文件
- 若未来支持自动发布，必须明确新增权限和用户确认机制
