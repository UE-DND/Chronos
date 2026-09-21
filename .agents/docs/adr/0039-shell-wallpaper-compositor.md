# ADR 0039: 外壳壁纸合成层与冻结范围收窄

- 状态：Accepted
- 日期：2026-09-19

## 决策与原因

壁纸处于隐藏 Tab 或 `content-visibility: hidden` 子树时会丢失解码帧，返回时重新解码导致闪白。因此 `ShellWallpaper` 在 `.shell-root` 内与 `.shell-content` 同级，仅冻结内容区；壁纸随外壳退后但保持绘制。

课表 Tab 且有课表时显示图片，其余状态保留极低不透明度，不用 `display: none`、`hidden` 或 `content-visibility: hidden`。共享 `TimetableWallpaperImage` 用 `<img>` 和 `decode()`，清晰／预热模糊层只过渡 opacity。设置预览仍使用单层展示原语。

## 取舍

持续绘制保留解码帧并预热模糊，代价是少量常驻绘制与内存。图片来源和生命周期归[宿主壁纸控制器](0040-host-wallpaper-and-theme-assets.md)，无需 body 隐藏图片或第二张模糊 Blob。
