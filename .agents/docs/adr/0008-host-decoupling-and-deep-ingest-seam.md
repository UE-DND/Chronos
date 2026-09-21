# ADR 0008: 宿主与插件深度解耦、存储端口精简与统一插槽导入

- 状态：Accepted（壁纸职责由 ADR 0040 修订）
- 日期：2026-08-21

## 决策

导入来源以 `import.source.tab` 贡献和 `importMetadata.source` 表示。插件解析为 core 的 `Timetable`，宿主只管理预览、确认和入库，不维护高校来源枚举或格式转换副本。

高校作息与校区规则归数据源插件，扩展数据放在 `customMetadata['source-cqut']` 等命名空间。宿主提供通用节次编辑。简单输入用 Schema，复杂认证用富 UI，共用导入流程。

插件私有数据使用命名空间 KV。自定义壁纸后来成为宿主能力，其存储不再遵循旧壁纸插件方案，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)。

## 取舍

高校数据和格式知识集中在插件，避免宿主维护第二套模型；共享编解码原语另见 [ADR 0020](0020-codec-kit-shared-codec-primitives.md)。
