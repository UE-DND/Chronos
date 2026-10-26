# ADR 0049：iOS 自签 IPA 更新

- 日期：2026-10-24
- 修订：ADR 0047 的移动端就绪 feed；不改变 ADR 0048 的 Android 安装流程

## 决策

iOS 客户端继续使用 Capacitor 壳和同一份移动 SPA，不另写原生课表。分发方式是用户自签 IPA，不上架 App Store。系统下限为 iOS 17.4。Bundle ID 固定为 `org.uednd.chronos`。

更新检查使用独立的 `/ios/stable.json`，`formatVersion` 为 `1`。feed 按 Profile 钉死 GitHub Release 上的 IPA 地址、SHA-256、大小和插件目录，不记录签名证书。已安装 Bundle ID 被修改时，更新页进入阻断态，不提供下载。

平台动作是 `external-ipa`。用户确认后先准备已安装的可选官方插件，再把 IPA 下载到缓存并校验摘要，然后用系统分享交给自签工具。应用不安装 IPA。覆盖安装必须保持 Bundle ID，并用同一个 Apple ID 签名，应用容器才会保留。

iOS 暂不启用教务在线导入的原生 HTTP 会话，也不移植精确闹钟和桌面小组件。

## 影响

Android `/android/stable.json` 与网站 `/version.json` 保持独立。IPA 未发布时，iOS 客户端只显示 feed 错误，不回退到 APK 地址。首次包含该更新动作的版本仍需手动安装。
