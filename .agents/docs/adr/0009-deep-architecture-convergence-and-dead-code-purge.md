# ADR 0009: 架构深化收敛、消除双轨实现与清理无用代码

- 状态：Accepted
- 日期：2026-08-21

## 决策

导入执行委托给插槽的 `executeImport`；宿主 `transfer-state` 统一处理预览和确认，延续 [ADR 0008](0008-host-decoupling-and-deep-ingest-seam.md)。宿主直接复用 core 领域模型，不维护影子实体。

课表排版算法留在 core，只计算逻辑网格与冲突分列。Svelte 坐标适配和 DOM 渲染归 ui-kit，不向核心算法传入视图私有概念。

## 取舍

纯算法可以独立测试，视图适配仍需验证其与算法结果的对应关系。
