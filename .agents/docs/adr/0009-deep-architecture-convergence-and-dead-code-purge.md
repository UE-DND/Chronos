# ADR 0009：导入和课表排版的模块边界

- 状态：Accepted
- 日期：2026-08-21

## 决策

插槽的 `executeImport` 负责执行导入。宿主的 `transfer-state` 统一处理预览和确认，沿用 [ADR 0008](0008-host-decoupling-and-deep-ingest-seam.md) 的边界。宿主直接使用 `core` 领域模型，不维护副本。

课表排版算法放在 `core`，只计算逻辑网格和冲突分列。Svelte 坐标适配和 DOM 渲染放在 `ui-kit`。核心算法不接收视图专用概念。

## 取舍

纯算法可以独立测试。视图适配仍需验证它是否正确呈现算法结果。
