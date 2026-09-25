# ADR 0038：统一导航栈和返回行为

- 状态：Accepted
- 日期：2026-09-16

## 决策与原因

浏览器 history 和单独维护的 pathname 日志，曾在弹层、replace 和系统返回时出现偏差。现在由 `nav-stack` 保存带 cursor 的统一记录，`back-resolver` 纯函数计算返回目标，`nav-coordinator` 执行导航并提交结果。

- 路由记录保存完整 URL、稳定 ID、会话和位置、深链属性，以及离开外壳时的 Tab。重复 URL 不去重，也不从 `history.length` 推断应用历史。
- 导航成功后才提交记录。取消或失败不会修改栈，连续返回会合并。已知会话使用 `history.go(delta)`；未知入口或深链 UI 使用 replace fallback。离开应用时保留浏览器行为。
- 元数据只通过公开的 `page.state.chronosNavigation` 和 SvelteKit `pushState`、`replaceState` 读写，并保留其他页面状态。完整导航和 shallow state 更新共用幂等入口。
- 弹层转换为路由后，如果浏览器遍历只更新 URL 和 state，coordinator 会用公开的 `goto(..., { replaceState: true })` 加载目标。成功后恢复原 ID。失效弹层会在当前遍历结束后纠偏，避免与 SvelteKit 恢复 history 冲突。
- replace 时保留深链属性。恢复 Tab 时检查对应贡献是否仍存在。返回 fallback 按注册令牌清理，旧页面卸载时不会删除新页面注册。

## 弹层生命周期

ui-kit 通过可选的 `OverlayHistoryPort.openOverlay(id, onDismiss)` 获取实例句柄。`close` 和 `dispose` 都是幂等操作。组件上下文负责管理弹层嵌套关系，打开时间相近不代表父子关系。系统关闭只关闭 UI，不触发确认或再次返回。没有端口时，组件只负责 UI。

已关闭的弹层会标记为失效。浏览器前进时跳过失效弹层；没有后续目标时，返回原有效位置。弹层内路由通过 coordinator 替换当前记录，成功后关闭所属弹层。BottomSheet、TimePicker、Dialog 和 DateField 共用 `createHistoryOverlaySync`。

## 取舍

浏览器不能从 history 中间删除记录，因此系统会保留失效标记并纠偏。Tab 仍由外壳内部状态管理，不增加第二份导航日志。边界测试见 `navigation-regression.test.ts`、`back-resolver.test.ts` 和 ui-kit 的 overlay lifecycle 测试。
