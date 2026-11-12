# ADR 0038：统一导航栈和返回行为

- 日期：2026-09-16

## 决策与原因

以前同时使用浏览器 history，以及单独维护的 pathname 记录。弹层、replace 和系统返回叠在一起时，两边会对不齐。现在由 `nav-stack` 保存带 cursor 的统一记录，`back-resolver` 用纯函数算出返回目标，`nav-coordinator` 执行导航并在成功后提交结果。

- 每条路由记录保存完整 URL、稳定 ID、会话和位置、深链属性，以及离开外壳时的 Tab。重复的 URL 不去重，也不从 `history.length` 反推应用自己的历史。
- 只有导航成功才写入记录。取消或失败不改栈。连续返回会合并。已经认识的会话用 `history.go(delta)`；来源不明的入口或深链界面使用 replace 作为退路。要离开应用时，保持浏览器原来的行为。
- 导航元数据只通过公开的 `page.state.chronosNavigation`，以及 SvelteKit 的 `pushState`、`replaceState` 读写，页面上的其他状态原样保留。完整导航和 shallow state 更新走同一个幂等入口。
- 弹层改成路由之后，如果浏览器这次遍历只更新了 URL 和 state，coordinator 会用公开的 `goto(..., { replaceState: true })` 加载目标，成功后再恢复原来的 ID。已经失效的弹层等到当前这次遍历结束再纠正，避免和 SvelteKit 恢复 history 冲突。
- replace 时保留深链属性。恢复 Tab 之前，先确认对应贡献还在。返回用的 fallback 按注册时的令牌清理：旧页面卸载时，不能把新页面刚注册的项删掉。

## 2026-11-07：返回手势归属

宿主不再自己做边缘侧滑，返回手势交给浏览器或系统。页面上的返回按钮，以及原生的系统返回，仍然走 coordinator。不是 iOS 的 Web 和 PWA，不再另外提供应用内跟手的侧滑。课表翻页、弹层拖动，以及 ui-kit 里的公共手势工具继续保留。

同时去掉了三样只给侧滑用的东西：返回预览目标的查询、等待导航完成的集合，以及全局的「跳过下一次转场」令牌。导航栈、返回目标的计算和弹层的历史规则不变。呈现层直接看当前这次导航的完成 Promise。转场资源怎么管理，见 [ADR 0033](0033-persistent-shell-freeze-and-secondary-view-transition.md#2026-11-07转场生命周期收敛)。

## 弹层生命周期

ui-kit 通过可选的 `OverlayHistoryPort.openOverlay(id, onDismiss)` 拿到这一次弹层的句柄。`close` 和 `dispose` 都可以重复调用。组件上下文负责弹层之间的嵌套，打开时间接近不代表是父子关系。系统把弹层关掉时，只关界面，不触发确认，也不会再返回一次。没有这个端口时，组件只负责自己的界面。

已经关掉的弹层会标成失效。浏览器前进时跳过这些失效项；后面没有可去的目标时，回到原来仍然有效的位置。弹层里面的路由通过 coordinator 替换当前记录，成功后关掉所属的弹层。BottomSheet、TimePicker、Dialog 和 DateField 都用 `createHistoryOverlaySync`。

## 取舍

浏览器不能从 history 中间删掉一条记录，所以失效项会留在记录里，再由上面的规则纠正。Tab 仍然由外壳自己的状态管理，不另记一份导航日志。边界情况见 `navigation-regression.test.ts`、`back-resolver.test.ts`，以及 ui-kit 的 overlay lifecycle 测试。
