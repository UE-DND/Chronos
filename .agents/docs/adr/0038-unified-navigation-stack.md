# ADR 0038: 统一导航栈与返回路径收敛

- 状态：Accepted
- 日期：2026-09-16

## 决策与原因

浏览器 history 与独立 pathname 日志曾在弹层、replace 和系统返回时漂移。现由 `nav-stack` 保存带 cursor 的统一记录，`back-resolver` 纯函数决定目标，`nav-coordinator` 执行并提交。

- route 保存完整 URL、稳定 ID、会话与位置、深链属性和离开外壳时的 Tab。重复 URL 不去重，不从 `history.length` 推断应用历史。
- 导航成功后才提交；取消或失败不改栈，重复返回合并。已知会话用 `history.go(delta)`，未知入口或深链 UI 返回用 replace fallback。系统离站保留浏览器行为。
- 元数据只通过公开 `page.state.chronosNavigation` 与 SvelteKit `pushState` / `replaceState` 读写，保留其他页面 state。完整导航和 shallow state 更新共用幂等入口。
- 弹层替换为路由后，若遍历仅更新 URL/state，coordinator 用公开 `goto(..., { replaceState: true })` 加载目标，成功后恢复原 ID。失效弹层纠偏在原遍历结束后进行，避免与 SvelteKit 恢复 history 竞争。
- 深链属性随 replace 保留；Tab 恢复时校验贡献仍存在。返回 fallback 按注册令牌清理，旧页面卸载不清除新页面注册。

## 弹层生命周期

ui-kit 通过可选 `OverlayHistoryPort.openOverlay(id, onDismiss)` 获取实例句柄。`close` / `dispose` 幂等，嵌套关系由组件上下文管理；时间相邻不代表父子。系统关闭只取消 UI，不触发确认或再次返回。无端口时组件是纯 UI。

已关闭弹层标为失效，浏览器前进跳过它们，无后续目标则回原有效位置。弹层内路由经 coordinator 替换当前条目，成功后关闭所属弹层。BottomSheet、TimePicker、Dialog、DateField 共用 `createHistoryOverlaySync`。

## 取舍

浏览器不能从中间删除 history 条目，因此保留失效标记并纠偏。Tab 仍为壳内状态；不增加第二份导航日志。边界回归入口为 `navigation-regression.test.ts`、`back-resolver.test.ts` 和 ui-kit overlay lifecycle 测试。
