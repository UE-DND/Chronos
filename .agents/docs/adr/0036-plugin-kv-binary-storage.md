# ADR 0036: Plugin KV 二进制存储与 Dexie pluginBinary 表

- 状态：Accepted
- 日期：2026-09-13

## 决策

插件 KV 在同一 `pluginId:key` 下支持 JSON 或二进制，写入一种时删除另一种。写入 `Blob` 保留 MIME；写入 `Uint8Array` 使用 `application/octet-stream`；二进制读取统一返回 `Blob`。

Web 的 `PluginKvRepository` 将 JSON 和二进制分别存入 `pluginData`、`pluginBinary`，后者保存 `ArrayBuffer` 与 MIME。变化仍通过 `pluginData` 事件通知。Native 桥以 `{ __binary: true, mimeType, base64 }` 传输二进制，在边界恢复为 Blob。

## 取舍与演进

通用二进制后端避免将图片长期 Base64 化，又不增加插件专表。壁纸是最初的消费方，现已转入宿主 `images` 存储，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)。数据库仍按未发布约定维护唯一 v1 结构。

共享壁纸展示层的 `fit` 由调用方显式选择：预览通常用 `cover`，已按视口裁剪的图片可用 `fill`；不改变全局默认来适配单一场景。
