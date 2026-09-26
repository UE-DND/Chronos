# ADR 0039：外壳壁纸与内容冻结

- 日期：2026-09-19

## 决策与原因

壁纸处于隐藏 Tab 或 `content-visibility: hidden` 子树时，会丢失解码帧。返回时重新解码会产生闪白。因此，`ShellWallpaper` 在 `.shell-root` 中与 `.shell-content` 同级。系统只冻结内容区，壁纸随外壳退后，但继续绘制。

课表 Tab 有课表时显示壁纸。其他状态使用极低不透明度，不设置 `display: none`、`hidden` 或 `content-visibility: hidden`。共享的 `TimetableWallpaperImage` 使用 `<img>` 和 `decode()`。清晰层和预热模糊层只过渡 opacity。设置预览仍使用单层展示组件。

## 取舍

持续绘制可以保留解码帧并预热模糊效果，但会持续占用少量绘制和内存资源。图片来源和生命周期由[宿主壁纸控制器](0040-host-wallpaper-and-theme-assets.md)管理，不需要在 body 中隐藏图片或创建第二张模糊 Blob。
