# ADR 0040：宿主壁纸与主题图片

- 日期：2026-09-20

## 决策与原因

壁纸是跨主题的宿主能力，不再分发 `tool-wallpaper`。`/wallpaper` 页面管理来源和外观。`/wallpaper/preview` 页面负责选图、裁剪和预览。

来源为 `custom | theme | none`，默认值是 `theme`。用户图片和来源分别保存。切换主题或来源不会删除图片。当前来源没有图片时，不会自动改用其他来源。确认上传后会选择 `custom`。删除操作只删除用户图片。

## 主题资源与生命周期

主题可以提供一张 `wallpaper?: Blob`。JSON 主题使用 `wallpaper: { url, sha256 }` 声明图片，URL 相对于 colors JSON 解析。构建会复制图片并生成哈希。安装时校验并解码图片，然后保存到宿主 `images` 表。安装记录只保存资源 ID，支持离线恢复。

更新失败时保留旧资源，成功后清理旧图片。禁用主题时保留资源，卸载主题时只删除主题资源。宿主管理 Object URL。应用新 URI 后释放旧 URI；销毁时释放剩余资源。自定义图片通过 liveQuery 同步跨标签页变化，偏好通过 storage 事件同步。

## 后续边界

旧的 `paletteMode`、`supportsDynamicColor`、`DynamicColorAdapter` 和 `dynamicColor:*` 已移除。独立取色选项仍保留。算法和失败处理见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。壁纸继续使用 [ADR 0039](0039-shell-wallpaper-compositor.md) 的合成层。
