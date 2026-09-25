# ADR 0036：插件 KV 支持二进制数据

- 状态：Accepted
- 日期：2026-09-13

## 决策

插件 KV 在同一个 `pluginId:key` 下支持 JSON 或二进制数据。写入一种数据时，会删除另一种。写入 `Blob` 时保留 MIME 类型；写入 `Uint8Array` 时使用 `application/octet-stream`。读取二进制数据时统一返回 `Blob`。

Web 的 `PluginKvRepository` 将 JSON 和二进制分别存入 `pluginData` 和 `pluginBinary`。`pluginBinary` 保存 `ArrayBuffer` 和 MIME 类型。数据变化仍通过 `pluginData` 事件通知。Native 桥使用 `{ __binary: true, mimeType, base64 }` 传输二进制，并在边界处恢复为 Blob。

## 取舍与演进

通用二进制后端避免长期用 Base64 保存图片，也不需要为每个插件增加专用表。壁纸曾是最初的使用方，现在改由宿主存入 `images`，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)。数据库仍按未发布约定只维护 v1 结构。

共享壁纸展示层的 `fit` 由调用方明确选择。预览通常使用 `cover`，已按视口裁剪的图片可以使用 `fill`。不为单一场景修改全局默认值。
