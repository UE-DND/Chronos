# ADR 0040: 宿主壁纸与主题图片资源

- 状态：Accepted（配色归属见 ADR 0043）
- 日期：2026-09-20

## 决策与原因

壁纸是跨主题的宿主能力，不再分发 `tool-wallpaper`。`/wallpaper` 管理来源和外观，`/wallpaper/preview` 负责选图、裁剪与预览。

来源为 `custom | theme | none`，默认 `theme`。用户图片与来源分别保存；切换主题或来源不删除图片，来源无图时不自动改选。确认上传后选择 custom，删除操作只删除用户图片。

## 主题资源与生命周期

主题可贡献一张 `wallpaper?: Blob`；JSON 通过 `wallpaper: { url, sha256 }` 声明，相对 colors JSON 解析。构建复制图片并生成哈希，安装校验和解码后保存至宿主 `images` 表，记录只持有资源 ID，支持离线恢复。

更新失败保留旧资源，成功后清理旧图片；禁用保留资源，卸载只删除主题资源。宿主管理 Object URL，新 URI 应用后释放旧 URI，销毁时释放剩余资源。自定义图片通过 liveQuery、偏好通过 storage 事件同步跨标签页变化。

## 后续边界

旧 `paletteMode`、`supportsDynamicColor`、`DynamicColorAdapter` 与 `dynamicColor:*` 已移除。独立取色选项保留，算法和失败行为以 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 为准；继续使用 [ADR 0039](0039-shell-wallpaper-compositor.md) 合成层。
