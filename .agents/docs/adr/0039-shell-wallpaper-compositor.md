# ADR 0039：外壳壁纸与内容冻结

- 日期：2026-09-19

## 决策与原因

壁纸如果放在隐藏的 Tab 里，或者放在 `content-visibility: hidden` 的子树里，解码好的画面会丢掉。返回时再解码一次，就会闪白。因此 `ShellWallpaper` 放在 `.shell-root` 中，和 `.shell-content` 同级。系统只冻结内容区。壁纸跟着外壳退到后面，但继续绘制。

课表 Tab 有课表时显示壁纸。其他状态用极低的不透明度，不设置 `display: none`、`hidden` 或 `content-visibility: hidden`。共用的 `TimetableWallpaperImage` 使用 `<img>` 和 `decode()`。清晰的一层和预先准备好的模糊层只过渡 opacity。设置里的预览仍然用单层的展示组件。

## 取舍

一直画着，才能留住解码好的画面，也方便把模糊效果提前准备好，但会持续占用少量绘制和内存。图片从哪来、什么时候释放，由[宿主壁纸控制器](0040-host-wallpaper-and-theme-assets.md)管理。不需要在 body 里藏一张图，也不需要再做一张模糊的 Blob。
