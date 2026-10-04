# 宿主接口清单

按 2026-10-04 当前代码统计。这里的“暴露”以插件上下文、插件 UI 和 handler 实际能取得的契约为准；TypeScript 声明、SDK 纯函数与宿主内部平台适配器分别列出，不相加为一个接口总数。

## 数量与入口

| 边界                   | 数量                                                                | 来源                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 插件上下文可识别的服务 | 9 类；当前 Web/Mobile 注入 8 类                                     | [`ScopedContext.tryService`](../packages/core/src/runtime/scoped-context.ts)、[Web provider](../apps/web/src/lib/providers/index.ts) |
| 插件领域操作           | 13 个方法                                                           | [`ChronosContext.actions`](../packages/core/src/types/context.ts)                                                                    |
| 插件状态               | 10 个字段                                                           | `ChronosContext.state`                                                                                                               |
| 插件上下文直接方法     | 7 个；`registerSlot` 的两个重载按一个方法计                         | `ChronosContext`                                                                                                                     |
| 插件私有 KV / i18n     | 3 个 KV 方法；2 个 i18n 方法及 `locale` 字段                        | `ChronosContext.storage` / `i18n`                                                                                                    |
| 标准插槽               | 10 个固定键，另有自定义插槽扩展                                     | [`StandardSlotMap`](../packages/core/src/types/slots.ts)                                                                             |
| 引擎事件               | 15 种                                                               | `ChronosEvents`                                                                                                                      |
| 插件 UI 控制器         | 17 个方法（10 个来自共享操作），另有继承的 `dispose`；14 个快照字段 | [`ChronosUiController`](../packages/ui-kit/src/reactivity/chronos-ui-controller.ts)                                                  |
| 原生 handler 会话入口  | 1 个方法，返回含 3 个方法的 session                                 | [`MobilePluginServerContext`](../packages/core/src/types/plugin-server.ts)                                                           |
| 本次新增课程安排 API   | 2 个纯函数、2 个类型                                                | [`course-schedule.ts`](../packages/core/src/algorithms/course-schedule.ts)                                                           |

## 插件服务

通过 `ctx.service(identifier)` 获取；不存在时抛错。`ctx.tryService(identifier)` 对未注入的服务返回 `undefined`。方法与可选性以 [`services.ts`](../packages/core/src/types/services.ts) 为准。

| 服务                         | 暴露成员                                                                                                                                                                                                                                                                                                                           | 当前宿主情况                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `IStorageService`            | 课表：`getTimetable`、`listTimetables`、`saveTimetable`、`deleteTimetable`、`getActiveTimetableId`、`setActiveTimetableId`、`queryCourses`；偏好：`getPreferences`、`savePreferences`；插件 KV：`getPluginData`、`setPluginData`、`deletePluginData`；可选：`clearAllData`、`estimateStorageBytes`、`clearPluginData`、`onChanged` | 16 个方法声明；当前 Dexie provider 全部实现，Web/Mobile 共用   |
| `IHttpService`               | `request`；可选 `supportsPluginServer`、`proxy`                                                                                                                                                                                                                                                                                    | 已注入；代理能力取决于部署、发行策略和原生 handler，调用前检测 |
| `IRuntimeService`            | `platform`、`sha256`                                                                                                                                                                                                                                                                                                               | 已注入                                                         |
| `IAnalyticsService`          | `track`                                                                                                                                                                                                                                                                                                                            | 已注入 provider；是否上报还受构建配置等条件影响                |
| `IErrorCaptureService`       | `onCaptured`                                                                                                                                                                                                                                                                                                                       | 已注入                                                         |
| `IHostNavigation`            | `openCourseEditor`                                                                                                                                                                                                                                                                                                                 | 应用引擎已注入；打开宿主课程编辑器                             |
| `IHostLinks`                 | `getImportUrl`                                                                                                                                                                                                                                                                                                                     | 已注入；Mobile 未配置公开入口时返回 `null`                     |
| `ICoursePresentationService` | `getCoursePalette`、`resolveCoursePaintsForTimetable`、`resolveCoursePaint`                                                                                                                                                                                                                                                        | 应用引擎已注入；颜色按整张课表分配                             |
| `IVaultService`              | `isSupported`、`storeSecret`、`getSecret`、`removeSecret`                                                                                                                                                                                                                                                                          | 上下文支持此标识，当前 Web/Mobile 应用环境未注入               |

`IHostHttpSessionService` 另有类型声明与 Android 实现，但不属于 `ScopedContext.tryService` 可取得的服务。原生 handler 使用 `MobilePluginServerContext.createHttpSession()`，得到 `request`、`hasCookie`、`dispose`；来源限制和 Cookie 清理由宿主注册表提供。不要将它计入普通插件的 9 类服务。

`queryCourses` 查询保存的课程记录，过滤条件为课表 ID、星期、教学周、地点、名称和教师。它不代表某个日期实际有课。需要实际课程安排时使用下述纯函数。

## 配置、状态和操作

上下文直接方法为 `service`、`tryService`、`updateConfig`、`registerSlot`、`on`、`emit`、`addDisposable`。另有 `pluginId`、只读 `config` 和以下分组。

- 私有存储：`storage.get`、`set`、`delete`，宿主自动按插件 ID 隔离命名空间。
- 国际化：`i18n.locale`、`t`、`registerMessages`。
- 状态：`currentTimetable`、`activeWeek`、`currentPeriodIndex`、`activeThemeId`、`activeIconThemeId`、`userPreferences`、`now`、`todayIso`、`clockFrozen`、`locale`。
- 课表操作（5）：`createTimetable`、`importTimetable`、`switchTimetable`、`deleteTimetable`、`updateTimetableDetails`。
- 课程操作（3）：`saveCourse`、`updateCourse`、`deleteCourse`。
- 其他操作（5）：`setTheme`、`updatePreferences`、`revertToDefaultThemes`、`notify`、`setVirtualNow`。

## 契约收敛与迁移

领域操作统一定义在 [`ChronosActions`](../packages/core/src/types/actions.ts)，插件上下文、引擎宿主和引擎实现复用完整契约；UI 控制器通过 `Pick` 暴露其中 10 个操作。各层保留自己的适配职责，不再重复定义操作签名。

`updateTimetableDetails(timetableId, patch)` 支持更新任意课表。`TimetableDetailsPatch` 限定可修改的内容字段，`academicConfig` 和 `viewPrefs` 按一级属性合并；课表 ID、结构版本和创建时间不变。不存在的 ID 或保存失败会拒绝 Promise。保存后刷新课表列表；更新当前课表时还刷新时间、徽标并发出 `timetable:updated`。非当前课表更新不切换当前选择，通过 `timetables:updated` 通知列表消费者。「法定节假日」同步和清理统一调用此操作。

共享状态定义在 [`ChronosState`](../packages/core/src/types/state.ts)，共 10 个字段；`ChronosEngineState` 扩展课表摘要列表，`ChronosUiSnapshot` 再扩展插槽和呈现状态。`TimetableSummary` 统一存储列表、事件和 UI 列表类型。UI 的 `userPreferences` 始终提供偏好对象。

直接迁移并删除以下旧接口，不保留别名：

- `saveCurrentTimetableDetails(patch)` → `updateTimetableDetails(timetableId, patch)`，调用方明确提供目标 ID。
- UI 字段 `clockNow`、`clockTodayIso`、`currentLocale` → `now`、`todayIso`、`locale`，与插件和引擎状态一致。
- `TimetableListEntry` → `TimetableSummary`。
- `clearHolidayCalendarFromStorage`、`stripHolidayCalendar` 已删除；节假日清理由插件遍历已标记课表并调用统一更新操作完成。

上述变更涉及 SDK 和 UI 契约，第三方调用方需要重新编译并迁移；数据库及线格式保持版本 `1`。

## 插槽、事件和插件 UI

标准插槽共 10 个：`import.source.tab`、`export.action`、`mine.section`、`mine.item`、`shell.route.screen`、`shell.bottom-bar.tab`、`timetable.cell.badge`、`course.detail.action`、`theme.definition`、`theme.icon.definition`。自定义插槽可以通过 `CustomSlotMap` 扩展，但宿主需提供相应处理。注册和监听资源由上下文跟踪，卸载时清理。

事件共 15 种：`timetable:loaded`、`timetable:switched`、`timetable:updated`、`timetables:updated`、`preferences:updated`、`time:tick`、`theme:changed`、`iconTheme:changed`、`i18n:localeChanged`、`config:changed`、`slots:updated`、`badges:updated`、`plugin:loaded`、`plugin:unloaded`、`coursePalette:changed`。

插件 UI 接收 `ChronosUiController`。它提供 `snapshot` 可订阅状态和可选 `overlayHistoryPort`，同时继承快照字段。`OverlayHistoryPort.openOverlay(id, onDismiss)` 注册返回键关闭行为，返回含 `close`、`dispose` 的句柄。

| UI 方法组         | 方法                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 上下文与插槽（5） | `getPluginContext`、`getPluginContextForSlot`、`getSlots`、`getSlotItem`、`resolveSlotOwner`                                    |
| 课表与课程（7）   | `createTimetable`、`switchTimetable`、`deleteTimetable`、`updateTimetableDetails`、`saveCourse`、`updateCourse`、`deleteCourse` |
| 其他直接方法（5） | `setTheme`、`updatePreferences`、`clearAllData`、`notify`、`translatePlugin`                                                    |

快照字段共 14 个：`currentTimetable`、`timetables`、`activeWeek`、`currentPeriodIndex`、`activeThemeId`、`activeIconThemeId`、`userPreferences`、`locale`、`now`、`todayIso`、`clockFrozen`、`slotVersion`、`courseBadges`、`coursePaletteRevision`。继承的 `dispose` 用于控制器生命周期，插件页面使用宿主传入的控制器时不应自行销毁它。

## 实际课程安排 API

从 `@chronos/core` 导入。两者均为同步纯函数，不访问数据库、网络或宿主状态。

```ts
queryTimetableCoursesForDate(timetable, dateIso): CourseQueryHit[]
queryTimetableCourseOccurrences(timetable, range?): CourseOccurrence[]

interface CourseDateRange {
  startDateIso: string;
  endDateIso: string;
}
interface CourseOccurrence extends CourseQueryHit {
  dateIso: string;
  academicWeek: number;
}
```

- 单日入口返回该日期实际有课的记录；范围入口返回含日期与教学周的课程实例。不传范围时查询整个学期，范围端点均包含。
- 统一处理学期边界、课程周次、星期、已同步的节假日与有效可见节次。学期外返回空，空课程周次数组表示学期内每周。不重新安排调休课程。
- 开学日期或教学周配置无效时返回空，不推测开学日期。查询日期无效或范围反向时抛出 `RangeError`。
- 范围结果按日期排列，同日保留输入课程顺序；课程对象引用来自输入课表，调用方应按只读使用。
- 时刻解析、语言排序、颜色、通知提前量、通知分组和过期提醒判断留在调用方。缺少时刻不影响课程日期结果，通知模块会跳过无法安排时刻的课程。
- 「今日」用单日入口；小组件用 14 天范围入口；课前通知用学期范围入口再处理剩余提醒。

本次删除原来的 `projectTimetableCoursesForDate` 和 `projectTodayCourseHits` 导出，不保留兼容别名。前者改用单日 API；排序由显示层完成。数据结构和线格式版本仍为 `1`。

core 还导出领域构造、日历、布局、颜色、Schema、插件编写、主题等 SDK 工具，见 [`index.ts`](../packages/core/src/index.ts)。这些可导入的纯函数和类型不是新增的运行时宿主服务。

## 宿主内部平台与网络边界

以下是宿主与平台实现之间的端口，不由 `ctx.service` 暴露给普通插件：

- [`HostPlatformAdapter`](../apps/web/src/lib/platform/host-platform.ts)：初始化与返回键、主题与启动屏、原生文件分享、Android 安装身份、今日小组件快照、课前通知、应用更新与 HTTP 适配。共 15 个直接成员，其中 5 个平台描述字段；`classNotifications` 是嵌套适配器。
- `ClassNotificationAdapter`：`background` 字段与 7 个方法：`getStatus`、`requestPermission`、`openSettings`、`replacePlan`、`sendTest`、`clearData`、`dispose`。
- 应用更新：`PlatformUpdateAction` 提供模式、可用性和 `applyUpdate`；可选原生更新接口提供 `getState`、`subscribe`、`continueUpdate`、`cancelUpdate`。
- 服务端插件：部署支持时通过 `/api/plugins/{pluginId}/{action}` 调用；具体 action 由构建启用的插件定义。静态部署无此服务端入口，Mobile 可将同一操作交给原生 handler。
- 官方插件分发还提供版本描述、Catalog、Manifest、ESM/CSS 和主题 JSON 静态资源；这是下载契约，见[插件分发与发布](plugin-distribution.md)。

这里不统计 Capacitor 和第三方库自身的接口，也不把普通应用页面路由当作插件 API。
