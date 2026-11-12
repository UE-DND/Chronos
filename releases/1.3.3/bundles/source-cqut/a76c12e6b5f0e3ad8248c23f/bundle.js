[
	["#CCC7F7", "#1A1836"],
	["#FFCB98", "#2C1600"],
	["#B2DFBA", "#01210D"],
	["#BBDEFF", "#001E31"],
	["#FFBBB8", "#331111"],
	["#DAD895", "#1D1D00"],
	["#A4DFE1", "#002021"],
	["#F7C6EC", "#2C1229"]
].map(([e, t]) => ({
	background: e,
	foreground: t
}));
var e = /\s+/g;
function t(t) {
	return t.replace(/^【调】/, "").replace(/[★☆〇■◆]$/u, "").trim().replace(e, " ");
}
// packages/core/src/domain/course.ts
function n(e) {
	let n = e.name ? t(e.name) : "";
	return {
		teacher: "",
		location: "",
		weeks: [],
		remark: "",
		...e,
		name: n || e.name
	};
}
function r(e) {
	return {
		showSaturday: e.some((e) => e.dayOfWeek === 6),
		showSunday: e.some((e) => e.dayOfWeek === 7)
	};
}
var i = "未命名课表";
function a(e) {
	let t = e.trim().slice(0, 50);
	return t.length > 0 ? t : i;
}
function o(e) {
	if (!e) return;
	let t = e.source.trim() || "UNKNOWN", n = e.campusId?.trim();
	return n ? {
		source: t,
		campusId: n
	} : { source: t };
}
function s(e) {
	let t = Date.now(), n = o(e.importMetadata), r = e.courses ?? [];
	return {
		schemaVersion: 1,
		id: e.id,
		name: a(e.name),
		courses: r,
		academicConfig: {
			termStartDate: e.academicConfig?.termStartDate ?? "",
			startWeek: e.academicConfig?.startWeek ?? 1,
			endWeek: e.academicConfig?.endWeek ?? 20,
			periodTimes: e.academicConfig?.periodTimes ?? [],
			...e.academicConfig?.holidayCalendar ? { holidayCalendar: {
				...e.academicConfig.holidayCalendar,
				holidays: [...e.academicConfig.holidayCalendar.holidays],
				sourceByYear: e.academicConfig.holidayCalendar.sourceByYear ? { ...e.academicConfig.holidayCalendar.sourceByYear } : void 0
			} } : {}
		},
		viewPrefs: {
			showSaturday: e.viewPrefs?.showSaturday ?? !0,
			showSunday: e.viewPrefs?.showSunday ?? !0,
			showNonCurrentWeekCourses: e.viewPrefs?.showNonCurrentWeekCourses ?? !1
		},
		createdAt: e.createdAt ?? t,
		updatedAt: e.updatedAt ?? t,
		...n ? { importMetadata: n } : {},
		...e.customMetadata ? { customMetadata: { ...e.customMetadata } } : {}
	};
}
// packages/core/src/domain/preferences.ts
var c = {
	currentTimetableId: "chronos_preferences:current_timetable_id",
	themeMode: "chronos_preferences:theme_mode",
	fontSizeScale: "chronos_preferences:font_size_scale",
	timetableLayoutMode: "chronos_preferences:timetable_layout_mode",
	wallpaperSource: "chronos_preferences:wallpaper_source",
	wallpaperColorEnabled: "chronos_preferences:wallpaper_color_enabled",
	wallpaperMaskEnabled: "chronos_preferences:wallpaper_mask_enabled",
	capsuleCornerStyle: "chronos_preferences:capsule_corner_style",
	hapticFeedbackEnabled: "chronos_preferences:haptic_feedback_enabled",
	reduceMotionEnabled: "chronos_preferences:reduce_motion_enabled",
	prepareReminderMinutes: "chronos_preferences:prepare_reminder_minutes",
	classNotificationsEnabled: "chronos_preferences:class_notifications_enabled",
	analyticsEnabled: "chronos_preferences:analytics_enabled",
	currentPeriodHighlightEnabled: "chronos_preferences:current_period_highlight_enabled",
	visualThemeId: "chronos_preferences:visual_theme_id",
	locale: "chronos_preferences:locale"
};
// packages/core/src/algorithms/date.ts
function l(e) {
	let t = e.trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) throw Error(`Invalid ISO date: ${e}`);
	let n = /* @__PURE__ */ new Date(`${t}T12:00:00.000Z`);
	if (u(n) !== t) throw Error(`Invalid ISO date: ${e}`);
	return n;
}
function u(e) {
	return `${String(e.getUTCFullYear()).padStart(4, "0")}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function d(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function f(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function p(e, t) {
	return f(e, t * 7);
}
function m(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function ee(e, t) {
	return e.getTime() < t.getTime();
}
function te(e) {
	return u(d(l(e)));
}
// packages/core/src/algorithms/calendar.ts
var ne = class {
	normalizeTermStartDate(e, t) {
		let n = l(te(t));
		if (!e || !e.trim()) return u(d(n));
		try {
			return u(d(l(e)));
		} catch {
			return u(d(this.inferTermStartDateFromTermName(e) || n));
		}
	}
	inferTermStartDateFromTermName(e) {
		let t = /(20\d{2})\D+(20\d{2})[^\d]*([12])/.exec(e);
		if (!t) return null;
		let n = Number.parseInt(t[1] ?? "", 10), r = Number.parseInt(t[2] ?? "", 10), i = Number.parseInt(t[3] ?? "", 10);
		return Number.isNaN(n) || Number.isNaN(r) || Number.isNaN(i) ? null : i === 1 ? new Date(Date.UTC(n, 8, 1, 12)) : i === 2 ? new Date(Date.UTC(r, 2, 1, 12)) : null;
	}
	calculateAcademicWeek(e, t) {
		let n = t ?? {
			termStartDate: "",
			startWeek: 1,
			endWeek: 20,
			periodTimes: []
		}, r = l(this.normalizeTermStartDate(n.termStartDate, e)), i = l(e);
		if (ee(i, r)) return n.startWeek;
		let a = m(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return u(p(l(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return u(f(l(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
.2126 * re(15 / 255) + .7152 * re(23 / 255) + .0722 * re(42 / 255);
function re(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
// packages/core/src/schema/schema-types.ts
function ie(e) {
	return e;
}
// packages/core/src/types/services.ts
function ae(e) {
	return { key: e };
}
var oe = ae("http");
// packages/core/src/i18n/i18n-catalog.ts
function se(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/slots.ts
var ce = class extends Error {
	kind;
	constructor(e, t) {
		super(t), this.name = "ImportSlotError", this.kind = e;
	}
}, le = Symbol.for("chronos.mountable");
// packages/core/src/types/plugin-server.ts
function ue(e, t) {
	return {
		ok: !1,
		error: {
			kind: e,
			message: t
		}
	};
}
function de(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.kind == "string" && typeof t.message == "string";
}
function fe(e) {
	if (!e || typeof e != "object") return ue("DataFormat", "Invalid plugin server response");
	let t = e;
	return t.ok === !0 ? {
		ok: !0,
		payload: t.payload
	} : t.ok === !1 && de(t.error) ? {
		ok: !1,
		error: t.error
	} : ue("DataFormat", "Invalid plugin server response");
}
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/plugin/define-chronos-plugin.ts
function pe(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function me() {
	return "1.3.3";
}
function he(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? pe(e.messages, e.nameKey),
		version: e.version ?? me(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? pe(e.messages, e.descriptionKey) : void 0,
		category: e.category,
		toolGroup: e.toolGroup,
		order: e.order,
		author: e.author,
		homepage: e.homepage,
		configSchema: e.configSchema,
		defaultConfig: e.defaultConfig,
		allowedDomains: e.allowedDomains,
		async apply(n) {
			n.i18n.registerMessages(e.messages);
			let r = (e, t) => n.i18n.t(e, t);
			t = r, await e.apply(n, r);
		},
		dispose: e.dispose
	};
}
// packages/core/src/plugin/call-plugin-server.ts
async function ge(e, t, n, r) {
	if (!e.proxy) throw Error("HTTP proxy is not supported in this environment");
	return e.proxy(t, n, r);
}
async function _e(e, t, n, r) {
	let i = await ge(e, t, n, r), a = await i.json();
	return {
		response: i,
		body: i.ok ? {
			ok: !0,
			payload: a
		} : fe(a)
	};
}
// packages/core/src/plugin/register-import-tab.ts
function ve(e, t) {
	return e.registerSlot("import.source.tab", t);
}
var ye = "liangjiang", be = {
	huaxi: [
		{
			index: 1,
			startTime: "08:20",
			endTime: "09:05"
		},
		{
			index: 2,
			startTime: "09:15",
			endTime: "10:00"
		},
		{
			index: 3,
			startTime: "10:20",
			endTime: "11:05"
		},
		{
			index: 4,
			startTime: "11:15",
			endTime: "12:00"
		},
		{
			index: 5,
			startTime: "14:00",
			endTime: "14:45"
		},
		{
			index: 6,
			startTime: "14:55",
			endTime: "15:40"
		},
		{
			index: 7,
			startTime: "16:00",
			endTime: "16:45"
		},
		{
			index: 8,
			startTime: "16:55",
			endTime: "17:40"
		},
		{
			index: 9,
			startTime: "19:00",
			endTime: "19:45"
		},
		{
			index: 10,
			startTime: "19:50",
			endTime: "20:35"
		}
	],
	liangjiang: [
		{
			index: 1,
			startTime: "08:30",
			endTime: "09:15"
		},
		{
			index: 2,
			startTime: "09:25",
			endTime: "10:10"
		},
		{
			index: 3,
			startTime: "10:30",
			endTime: "11:15"
		},
		{
			index: 4,
			startTime: "11:25",
			endTime: "12:10"
		},
		{
			index: 5,
			startTime: "14:20",
			endTime: "15:05"
		},
		{
			index: 6,
			startTime: "15:15",
			endTime: "16:00"
		},
		{
			index: 7,
			startTime: "16:20",
			endTime: "17:05"
		},
		{
			index: 8,
			startTime: "17:15",
			endTime: "18:00"
		},
		{
			index: 9,
			startTime: "19:00",
			endTime: "19:45"
		},
		{
			index: 10,
			startTime: "19:50",
			endTime: "20:35"
		}
	]
};
// packages/plugins/source-cqut/src/messages.ts
function xe(e) {
	return ie({
		username: {
			type: "string",
			title: () => e("import.online.field.username.title"),
			placeholder: () => e("import.online.field.username.placeholder"),
			required: !0
		},
		password: {
			type: "password",
			title: () => e("import.online.field.password.title"),
			placeholder: () => e("import.online.field.password.placeholder"),
			required: !0
		}
	});
}
function Se(e) {
	return ie({ file: {
		type: "file",
		title: () => e("import.html.field.file.title"),
		description: () => e("import.html.field.file.description"),
		accept: ".html,.htm,text/html",
		required: !0
	} });
}
function Ce(e) {
	return ie({
		campusId: {
			type: "select",
			presentation: "radio",
			title: () => e("import.html.confirm.campusPeriodTitle"),
			description: () => e("import.html.confirm.campusPeriodHint"),
			default: ye,
			required: !0,
			options: [{
				value: "liangjiang",
				label: () => e("import.html.campus.liangjiang")
			}, {
				value: "huaxi",
				label: () => e("import.html.campus.huaxi")
			}]
		},
		termStartDate: {
			type: "date",
			title: () => e("import.html.confirm.termStartLabel"),
			description: () => e("import.html.confirm.termStartHint"),
			required: !0
		}
	});
}
var we = {
	"zh-cn": {
		"plugin.name": "CQUT-Timetable",
		"plugin.description": "在线课表及正方教务导入支持",
		"import.online.tab.title": "知行理工",
		"import.online.tab.supporting": "输入知行理工账号密码，获取在线课表",
		"import.online.field.username.title": "账号",
		"import.online.field.username.placeholder": "请输入工号 / 学号",
		"import.online.field.password.title": "密码",
		"import.online.field.password.placeholder": "请输入密码",
		"import.online.error.credentials": "请输入学号与密码",
		"import.online.notify.connecting": "正在连接知行理工...",
		"import.online.error.proxyUnsupported": "当前环境不支持在线教务同步",
		"import.online.error.authFailed": "教务认证失败，请检查学号与密码",
		"import.html.tab.title": "教务 HTML",
		"import.html.tab.supporting": "从教务系统导出的 HTML 课表文件导入",
		"import.html.error.invalidFile": "请选择有效的 HTML 课表文件",
		"import.online.offline": "当前处于离线模式，无法连接知行理工",
		"import.online.intro": "请输入知行理工账号密码以获取在线课表。",
		"import.online.attribution": "*此功能由「CFC Studio」提供支持",
		"import.online.accountLabel": "工号 / 学号",
		"import.online.password.hide": "隐藏密码",
		"import.online.password.show": "显示密码",
		"import.online.submit.loading": "获取中…",
		"import.online.submit": "从此账号导入课表",
		"import.html.intro": "选择教务系统导出的 HTML 课表文件。",
		"import.html.campusLabel": "校区",
		"import.html.campus.liangjiang": "两江校区",
		"import.html.campus.huaxi": "花溪校区",
		"import.html.submit.loading": "解析中…",
		"import.html.submit": "选择 HTML 文件",
		"import.html.field.file.title": "选择 HTML 文件",
		"import.html.field.file.description": "请选择从 CQUT 教务系统导出的 HTML 课表文件",
		"import.html.confirm.campusPeriodTitle": "节次时间",
		"import.html.confirm.campusPeriodHint": "课表对应的校区（决定节次时间）",
		"import.html.confirm.termStartLabel": "学期起始日期",
		"import.html.confirm.termStartHint": "HTML 导入需要指定本学期第一周的周一日期。",
		"import.html.error.termStartRequired": "请选择学期起始日期",
		"import.html.error.tableNotFound": "未找到教务课表表格结构",
		"import.html.error.noCourses": "HTML 中未找到可导入的课程数据",
		"import.html.timetableDefaultName": "导入的 HTML 课表",
		"import.online.error.network": "网络连接失败，请稍后重试",
		"import.online.error.upstream": "教务系统暂时不可用，请稍后重试",
		"import.online.error.rateLimited": "请求过于频繁，请稍后再试",
		"import.online.error.validation": "请求参数无效，请检查账号与密码",
		"import.online.error.dataFormat": "教务返回数据格式异常",
		"timetable.defaultName": "重庆理工大学课表",
		"timetable.studentSuffix": "的课表"
	},
	en: {
		"plugin.name": "CQUT Timetable",
		"plugin.description": "Online timetable and ZF educational system import support",
		"import.online.tab.title": "CQUT Online",
		"import.online.tab.supporting": "Sign in with CQUT credentials to fetch your timetable",
		"import.online.field.username.title": "Account",
		"import.online.field.username.placeholder": "Student or staff ID",
		"import.online.field.password.title": "Password",
		"import.online.field.password.placeholder": "Enter password",
		"import.online.error.credentials": "Enter student ID and password",
		"import.online.notify.connecting": "Connecting to CQUT...",
		"import.online.error.proxyUnsupported": "Online academic sync is not available in this environment",
		"import.online.error.authFailed": "Authentication failed. Check your credentials",
		"import.html.tab.title": "Academic HTML",
		"import.html.tab.supporting": "Import an HTML timetable export file",
		"import.html.error.invalidFile": "Choose a valid HTML timetable file",
		"import.online.offline": "You are offline and cannot connect to CQUT",
		"import.online.intro": "Enter your CQUT credentials to fetch your online timetable.",
		"import.online.attribution": "*Powered by CFC Studio",
		"import.online.accountLabel": "Student or staff ID",
		"import.online.password.hide": "Hide password",
		"import.online.password.show": "Show password",
		"import.online.submit.loading": "Fetching…",
		"import.online.submit": "Import from this account",
		"import.html.intro": "Choose an HTML timetable file exported from the academic system.",
		"import.html.campusLabel": "Campus",
		"import.html.campus.liangjiang": "Liangjiang campus",
		"import.html.campus.huaxi": "Huaxi campus",
		"import.html.submit.loading": "Parsing…",
		"import.html.submit": "Choose HTML file",
		"import.html.field.file.title": "Choose HTML file",
		"import.html.field.file.description": "Select an HTML timetable file exported from the academic system.",
		"import.html.confirm.campusPeriodTitle": "Period times",
		"import.html.confirm.campusPeriodHint": "Campus for this timetable (determines period times).",
		"import.html.confirm.termStartLabel": "Term start date",
		"import.html.confirm.termStartHint": "HTML import requires the Monday date of the first week of this term.",
		"import.html.error.termStartRequired": "Choose the term start date",
		"import.html.error.tableNotFound": "Timetable table structure was not found in the HTML",
		"import.html.error.noCourses": "No importable course data was found in the HTML",
		"import.html.timetableDefaultName": "Imported HTML timetable",
		"import.online.error.network": "Network error. Try again later.",
		"import.online.error.upstream": "The academic system is unavailable. Try again later.",
		"import.online.error.rateLimited": "Too many requests. Try again later.",
		"import.online.error.validation": "Invalid request. Check your account and password.",
		"import.online.error.dataFormat": "Unexpected response from the academic system.",
		"timetable.defaultName": "CQUT Timetable",
		"timetable.studentSuffix": "'s timetable"
	}
};
function Te(e, t, n = "import.online.error.authFailed") {
	if (e.ok) return t(n);
	let r = e.error.kind;
	return t({
		Auth: "import.online.error.authFailed",
		Validation: "import.online.error.validation",
		Network: "import.online.error.network",
		Upstream: "import.online.error.upstream",
		RateLimited: "import.online.error.rateLimited",
		DataFormat: "import.online.error.dataFormat"
	}[r] ?? n);
}
function Ee(e, t) {
	let n = e.trim();
	return n ? `${n}${t("timetable.studentSuffix")}` : t("timetable.defaultName");
}
// packages/plugins/source-cqut/src/week-parser.ts
function De(e) {
	let t = /* @__PURE__ */ new Set(), n = e.replace(/（/g, "(").replace(/）/g, ")").replace(/~/g, "-").replace(/第/g, "");
	for (let e of n.matchAll(/([\d,\-\s]+)周(?:\((?:单|双)\))?/g)) {
		let n = e[1] ?? "", r = e[0] ?? "", i = r.includes("(单)") ? "ODD" : r.includes("(双)") ? "EVEN" : "ALL", a = n.split(",");
		for (let e of a) {
			let n = e.trim();
			if (!n) continue;
			let r = n.indexOf("-"), a = Number.parseInt(r >= 0 ? n.slice(0, r) : n, 10), o = Number.parseInt(r >= 0 ? n.slice(r + 1) : n, 10);
			if (Number.isNaN(a)) continue;
			let s = Number.isNaN(o) ? a : o;
			for (let e = Math.min(a, s); e <= Math.max(a, s); e += 1) (i === "ALL" || (i === "ODD" ? e % 2 == 1 : e % 2 == 0)) && t.add(e);
		}
	}
	return [...t].sort((e, t) => e - t);
}
// packages/plugins/source-cqut/src/html-dom-utils.ts
var Oe = /\s+/g;
function ke(e) {
	return e.trim().replace(Oe, " ");
}
function Ae(e) {
	if (typeof DOMParser < "u") return new DOMParser().parseFromString(e, "text/html");
	throw Error("DOMParser is not available in current runtime");
}
function je(e) {
	if (!e) return "";
	let t = "";
	for (let n = 0; n < e.childNodes.length; n += 1) {
		let r = e.childNodes[n];
		r.nodeType === 3 && (t += r.textContent ?? "");
	}
	return t;
}
// packages/plugins/source-cqut/src/html-parser.ts
var Me = new ne();
function Ne(e, t, n, r = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) {
	let i = t.campusId ?? "liangjiang", a = t.termStartDate?.trim() ?? "";
	if (!a) throw new ce("invalid-data", n("import.html.error.termStartRequired"));
	let o = Me.normalizeTermStartDate(a, r), s = be[i].map((e) => ({ ...e }));
	return {
		...e,
		academicConfig: {
			...e.academicConfig,
			termStartDate: o,
			periodTimes: s
		},
		importMetadata: {
			...e.importMetadata,
			source: "FILE_HTML",
			campusId: i
		},
		customMetadata: {
			...e.customMetadata,
			"source-cqut": {
				...e.customMetadata?.["source-cqut"],
				source: "FILE_HTML",
				campusId: i
			}
		}
	};
}
function Pe(e, i) {
	let a = i?.t ?? ((e) => e), o = i?.customDocParser ? i.customDocParser(e) : Ae(e), c = o.querySelector("#kbgrid_table_0") ?? o.querySelector("table.timetable1") ?? o.querySelector("table[id*=\"kbgrid\"]");
	if (!c) throw new ce("invalid-data", a("import.html.error.tableNotFound"));
	let l = c.querySelector(".timetable_title"), u = ke(l?.querySelector("h6.pull-left")?.textContent ?? ""), d = ke(je(l)).replace(/的课表$/, ""), f = c.querySelectorAll("td.td_wrap[id]"), p = [];
	if (f.forEach((e) => {
		let [r, i] = (e.getAttribute("id") ?? "").split("-"), a = Number.parseInt(r ?? "", 10), o = Number.parseInt(i ?? "", 10);
		if (Number.isNaN(a) || Number.isNaN(o)) return;
		let s = Number.parseInt(e.getAttribute("rowspan") ?? "1", 10), c = o + (Number.isNaN(s) ? 1 : s) - 1;
		e.querySelectorAll(".timetable_con").forEach((e, r) => {
			let i = ke(e.querySelector(".title")?.textContent ?? "");
			if (!i) return;
			let s = /* @__PURE__ */ new Map();
			e.querySelectorAll("p").forEach((e) => {
				let t = e.querySelector("[title]"), n = ke(t?.getAttribute("title") ?? "");
				if (!n) return;
				let r = "";
				for (let n = 0; n < e.childNodes.length; n += 1) {
					let i = e.childNodes[n];
					i !== t && (r += i.textContent ?? "");
				}
				let i = ke(r);
				if (!i) return;
				let a = s.get(n);
				s.set(n, a ? `${a}, ${i}` : i);
			});
			let l = t(i);
			p.push(n({
				id: `html-${a}-${o}-${c}-${r}-${p.length}`,
				name: l,
				teacher: s.get("教师") ?? "",
				location: s.get("上课地点") ?? "",
				dayOfWeek: a,
				startPeriod: o,
				endPeriod: c,
				weeks: De(s.get("节/周") ?? "")
			}));
		});
	}), p.length === 0) throw new ce("no-data", a("import.html.error.noCourses"));
	let m = 20;
	for (let e of p) for (let t of e.weeks) t > m && (m = t);
	return s({
		id: `html_${Date.now()}`,
		name: d ? `${d}${a("timetable.studentSuffix")}` : u || a("import.html.timetableDefaultName"),
		courses: p,
		academicConfig: {
			termStartDate: i?.termStartDate ?? "",
			startWeek: 1,
			endWeek: m,
			periodTimes: i?.campusId ? be[i.campusId].map((e) => ({ ...e })) : []
		},
		viewPrefs: {
			...r(p),
			showNonCurrentWeekCourses: !1
		},
		importMetadata: i?.campusId ? {
			source: "FILE_HTML",
			campusId: i.campusId
		} : void 0,
		customMetadata: { "source-cqut": {
			source: "FILE_HTML",
			...i?.campusId ? { campusId: i.campusId } : {}
		} }
	});
}
// packages/plugins/source-cqut/src/cqut-schedule-parser.ts
function Fe(e) {
	if (e.termStartDate && /^\d{4}-\d{2}-\d{2}$/.test(e.termStartDate)) return e.termStartDate;
	let t = Number(e.weekNum) || 1, n = e.weekDayList?.find((e) => e.weekDay === "1" || e.weekDay === "一") ?? e.weekDayList?.[0];
	if (!n || !n.weekDate) return "";
	let [r, i] = n.weekDate.split("/"), a = Number(r), o = Number(i);
	if (!a || !o) return "";
	let s = (/* @__PURE__ */ new Date()).getFullYear();
	if (e.yearTerm) {
		let t = e.yearTerm.match(/(\d{4})-(\d{4})/);
		if (t) {
			let e = Number(t[1]), n = Number(t[2]);
			s = a >= 8 ? e : n;
		}
	}
	let c = new Date(Date.UTC(s, a - 1, o)), l = (t - 1) * 7;
	return c.setUTCDate(c.getUTCDate() - l), `${c.getUTCFullYear()}-${String(c.getUTCMonth() + 1).padStart(2, "0")}-${String(c.getUTCDate()).padStart(2, "0")}`;
}
function Ie(e, r) {
	let i = Number(e.weekDay), a = Number(e.sessionStart);
	if (!i || Number.isNaN(a) || !e.eventName?.trim()) return null;
	let o = -Infinity;
	e.sessionList?.length && e.sessionList.forEach((e) => {
		let t = Number(e);
		Number.isNaN(t) || (o = Math.max(o, t));
	});
	let s = Number(e.sessionLast) || 1, c = Number.isFinite(o) ? o : a + s - 1, l = /* @__PURE__ */ new Set();
	(e.weekList || []).forEach((e) => {
		let t = Number(e);
		Number.isNaN(t) || l.add(t);
	});
	let u = [...l].sort((e, t) => e - t);
	return n({
		id: e.eventID?.trim() || `cqut-${i}-${a}-${c}-${r}`,
		name: t(e.eventName.trim()),
		teacher: e.memberName?.trim() ?? "",
		location: e.address?.trim() ?? "",
		dayOfWeek: i,
		startPeriod: a,
		endPeriod: Math.max(a, c),
		weeks: u,
		remark: e.remark?.trim() ?? ""
	});
}
function Le(e, t = "", n = ye, i = (e) => e) {
	let a = e.payload;
	if (!a || !Array.isArray(a.eventList)) throw Error("Invalid CQUT online schedule payload");
	let o = t ? Ee(t, i) : a.yearTerm || i("timetable.defaultName"), c = Fe(a), l = [], u = 20;
	a.eventList.forEach((e, t) => {
		let n = Ie(e, t);
		if (n) {
			l.push(n);
			for (let e of n.weeks) u = Math.max(u, e);
		}
	});
	let d = e.campusId || n, f = e.campusPeriodTimes || be, p = f[d] ?? be.liangjiang, m = { "source-cqut": {
		campusId: d,
		campusPeriodTimes: f,
		studentId: t
	} }, ee = {
		termStartDate: c,
		startWeek: 1,
		endWeek: u,
		periodTimes: p
	};
	return s({
		id: `cqut_${t || Date.now()}`,
		name: o,
		courses: l,
		academicConfig: ee,
		viewPrefs: {
			...r(l),
			showNonCurrentWeekCourses: !1
		},
		importMetadata: {
			source: "cqut-online",
			campusId: d
		},
		customMetadata: m
	});
}
// packages/plugins/source-cqut/server/definition.ts
var Re = {
	pluginId: "source-cqut",
	proxy: {
		action: "preview",
		domains: ["cqut.edu.cn"]
	}
};
// packages/plugins/source-cqut/src/cqut-import-tabs.ts
async function ze(e, t, n, r) {
	let i = r ?? e, a = n.username?.trim(), o = n.password;
	if (!a || !o?.trim()) throw new ce("unsupported", t("import.online.error.credentials"));
	i.actions.notify(t("import.online.notify.connecting"), "info");
	let s = i.service(oe);
	if (!s.proxy) throw new ce("unsupported", t("import.online.error.proxyUnsupported"));
	let { response: c, body: l } = await _e(s, Re.pluginId, Re.proxy.action, {
		account: a,
		password: o
	});
	if (!c.ok || !l.ok) throw new ce("network", Te(l, t));
	return Le(l.payload, a, ye, t);
}
async function Be(e, t) {
	let n = t.file;
	if (!n || typeof n != "string") throw new ce("no-data", e("import.html.error.invalidFile"));
	return Pe(n, {
		campusId: ye,
		t: e
	});
}
function Ve(e) {
	let { ctx: t, t: n, onlineComponent: r, htmlComponent: i } = e, a = xe(n), o = Se(n), s = Ce(n);
	t.service(oe).supportsPluginServer?.(Re.pluginId, Re.proxy.action) && ve(t, {
		id: "cqut-online",
		title: () => n("import.online.tab.title"),
		order: 10,
		importKind: "online",
		supportingText: () => n("import.online.tab.supporting"),
		component: r,
		inputSchema: a,
		executeImport: (e, r) => ze(t, n, e, r)
	}), ve(t, {
		id: "edu-html",
		title: () => n("import.html.tab.title"),
		order: 30,
		importKind: "file",
		supportingText: () => n("import.html.tab.supporting"),
		component: i,
		inputSchema: o,
		confirmSchema: s,
		confirmDefaultInput: {
			campusId: ye,
			termStartDate: ""
		},
		validateConfirmInputs: (e) => e.termStartDate?.trim() ? null : n("import.html.error.termStartRequired"),
		finalizePreview: (e, t) => Ne(e, t, n),
		executeImport: (e) => Be(n, e)
	});
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/constants.js
var He = {}, h = Symbol("uninitialized"), Ue = "http://www.w3.org/1999/xhtml", We = Array.isArray, Ge = Array.prototype.indexOf, Ke = Array.prototype.includes, qe = Array.from, Je = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, Xe = Object.getOwnPropertyDescriptors, Ze = Object.prototype, Qe = Array.prototype, $e = Object.getPrototypeOf, et = Object.isExtensible;
function tt(e) {
	return typeof e == "function";
}
var nt = () => {};
function rt(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function it() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var g = 1024, _ = 2048, at = 4096, ot = 8192, st = 16384, ct = 32768, lt = 1 << 25, ut = 65536, dt = 1 << 19, ft = 1 << 20, pt = 1 << 21, mt = 1 << 22, ht = 1 << 23, gt = Symbol("$state"), _t = Symbol("component"), vt = Symbol("legacy props"), yt = Symbol(""), bt = Symbol("attributes"), xt = Symbol("class"), St = Symbol("style"), Ct = Symbol("text"), wt = Symbol("form reset"), Tt = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Et = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function Dt() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ot(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function kt() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/hydration.js
var v = !1;
function At(e) {
	v = e;
}
var y;
function b(e) {
	if (e === null) throw Ot(), He;
	return y = e;
}
function jt() {
	return b(/* @__PURE__ */ ar(y));
}
function x(e) {
	if (v) {
		if (/* @__PURE__ */ ar(y) !== null) throw Ot(), He;
		y = e;
	}
}
function Mt(e = 1) {
	if (v) {
		for (var t = e, n = y; t--;) n = /* @__PURE__ */ ar(n);
		y = n;
	}
}
function Nt(e = !0) {
	for (var t = 0, n = y;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ ar(n);
		e && n.remove(), n = i;
	}
}
function Pt(e) {
	if (!e || e.nodeType !== 8) throw Ot(), He;
	return e.data;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/equality.js
function Ft(e) {
	return e === this.v;
}
function It(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Lt(e) {
	return !It(e, this.v);
}
function Rt(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function zt() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/errors.js
function Bt() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Vt() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ht() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ut() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Wt() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Gt() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/shared/context.js
function Kt(e, t, n) {
	let r = {};
	return [
		() => (n(r) || zt(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function qt(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Jt(e, t) {
	return e === null && Rt(t), e.c ??= new Map(qt(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/context.js
var S = null;
function Yt(e) {
	S = e;
}
function Xt() {
	return Kt(Zt, Qt, $t);
}
function Zt(e) {
	return Jt(S, "getContext").get(e);
}
function Qt(e, t) {
	return Jt(S, "setContext").set(e, t), t;
}
function $t(e) {
	return Jt(S, "hasContext").has(e);
}
function en(e, t = !1, n) {
	S = {
		p: S,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: null
	};
}
function tn(e) {
	var t = S, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) mr(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, S = t.p, nn(e);
}
function nn(e = {}) {
	return Je(e, _t, { value: !0 }), e;
}
function rn() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/task.js
var an = [];
function on() {
	var e = an;
	an = [], rt(e);
}
function C(e) {
	if (an.length === 0 && !jn) {
		var t = an;
		queueMicrotask(() => {
			t === an && on();
		});
	}
	an.push(e);
}
function sn() {
	for (; an.length > 0;) on();
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/status.js
var cn = ~(_ | at | g);
function w(e, t) {
	e.f = e.f & cn | t;
}
function ln(e) {
	e.f & 512 || e.deps === null ? w(e, g) : w(e, at);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/utils.js
function un(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), w(e, g);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/misc.js
var dn = !1;
function fn() {
	dn || (dn = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[wt]?.();
		});
	}, { capture: !0 }));
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function pn(e) {
	var t = V, n = W;
	U(null), G(null);
	try {
		return e();
	} finally {
		U(t), G(n);
	}
}
function mn(e, t, n, r = n) {
	e.addEventListener(t, () => pn(n));
	let i = e[wt];
	e[wt] = i ? () => {
		i(), r(!0);
	} : () => r(!0), fn();
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/async.js
function hn(e, t, n, r) {
	let i = rn() ? yn : Sn;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = gn(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				L(e, s);
			}
			_n();
		}
	}
	var d = vn();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ xn(e))).then(u).catch((e) => L(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), _n());
	}) : f();
}
function gn() {
	var e = W, t = V, n = S, r = E;
	return function(i = !0) {
		G(e), U(t), Yt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function _n(e = !0) {
	G(null), U(null), Yt(null), e && E?.deactivate();
}
function vn() {
	var e = W, t = e.b, n = E, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function yn(e) {
	var t = 2 | _;
	return W !== null && (W.f |= dt), {
		ctx: S,
		deps: null,
		effects: null,
		equals: Ft,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: h,
		wv: 0,
		parent: W,
		ac: null
	};
}
var bn = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function xn(e, t, n) {
	let r = W;
	r === null && Bt();
	var i = void 0, a = Kn(h), o = !V, s = /* @__PURE__ */ new Set();
	return _r(() => {
		var t = W, n = it();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Tt && n.reject(e);
			}).finally(_n);
		} catch (e) {
			n.reject(e), _n();
		}
		var c = E;
		if (o) {
			if (t.f & 32768) var l = vn();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(bn);
			else for (let e of s.values()) e.reject(bn);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== bn && (c.activate(), t ? (a.f |= ht, Yn(a, t)) : (a.f & 8388608 && (a.f ^= ht), Yn(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), pr(() => {
		for (let e of s) e.reject(bn);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function T(e) {
	let t = /* @__PURE__ */ yn(e);
	return Pr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Sn(e) {
	let t = /* @__PURE__ */ yn(e);
	return t.equals = Lt, t;
}
function Cn(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function wn(e) {
	var t, n = W, r = e.parent;
	if (!Mr && r !== null && e.v !== h && r.f & 24576) return Dt(), e.v;
	G(r);
	try {
		Cn(e), t = Ur(e);
	} finally {
		G(n);
	}
	return t;
}
function Tn(e) {
	var t = wn(e);
	!e.equals(t) && (e.wv = Br(), (!E?.is_fork || e.deps === null) && (E === null ? e.v = t : (E.capture(e, t, !0), kn?.capture(e, t, !0)), e.deps === null)) ? w(e, g) : Mr || (D === null ? ln(e) : (fr() || E?.is_fork) && D.set(e, t));
}
function En(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && pn(() => {
		t.ac.abort(Tt), t.ac = null;
	}), t.fn !== null && (t.teardown = nt), Kr(t, 0), Sr(t));
}
function Dn(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && qr(t);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/batch.js
var On = null, E = null, kn = null, D = null, An = null, jn = !1, Mn = !1, Nn = null, Pn = null, Fn = 0, In = 1, Ln = class e {
	id = In++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		On === null ? On = this : (On.#n = this, this.#t = On), On = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) w(r, _), t(r);
			for (r of n.m) w(r, at), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= g;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), w(e, _), this.schedule(e);
		for (let e of this.#d) w(e, at), this.schedule(e);
		this.apply();
		for (var t = Nn = [], n = [], r = Pn = []; this.#c.length > 0;) {
			Fn++ > 1e3 && (this.#S(), zn());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Un(e), this.#h() || this.discard(), t;
			}
		}
		if (E = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Nn = null, Pn = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Hn(e, t);
			r.length > 0 && E.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), kn = this, Bn(n), Bn(t), kn = null, this.#s?.resolve();
			var o = E;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (k.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : Vr(r) && (i & 16 && this.#d.add(r), qr(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), w(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), E = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) un(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== h && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), D?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		E = this;
	}
	deactivate() {
		E = null, D = null;
	}
	flush() {
		try {
			Mn = !0, E = this, this.#_();
		} finally {
			Fn = 0, An = null, Nn = null, Pn = null, Mn = !1, E = null, D = null, k.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(bn);
		this.#S(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, C(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= it()).promise;
	}
	static ensure() {
		if (E === null) {
			let t = E = new e();
			!Mn && !jn && C(() => {
				t.#e || t.flush();
			});
		}
		return E;
	}
	apply() {
		D = null;
	}
	schedule(e) {
		An = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? On = e : t.#t = e, this.linked = !1;
		}
	}
};
function Rn(e) {
	var t = jn, n = kn;
	kn = null, jn = !0;
	try {
		var r;
		for (e && (Rn(), r = e());;) {
			if (sn(), E === null) return r;
			E.flush();
		}
	} finally {
		jn = t, kn = n;
	}
}
function zn() {
	try {
		Vt();
	} catch (e) {
		L(e, An);
	}
}
var O = null;
function Bn(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Vr(r) && (O = /* @__PURE__ */ new Set(), qr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Tr(r), O?.size > 0)) {
				k.clear();
				for (let e of O) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) O.has(n) && (O.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || qr(n);
					}
				}
				O.clear();
			}
		}
		O = null;
	}
}
function Vn(e) {
	E.schedule(e);
}
function Hn(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), w(e, g);
		for (var n = e.first; n !== null;) Hn(n, t), n = n.next;
	}
}
function Un(e) {
	w(e, g);
	for (var t = e.first; t !== null;) Un(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/sources.js
var Wn = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map(), Gn = !1;
function Kn(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ft,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = Kn(e, t);
	return Pr(n), n;
}
function j(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && rn() && V.f & 4325394 && (K === null || !K.has(e)) && Wt(), Yn(e, n ? $n(t) : t, Pn);
}
var qn = null, Jn = 0;
function Yn(e, t, n = null) {
	if (!e.equals(t)) {
		Mr ? k.set(e, t) : k.has(e) || k.set(e, e.v);
		var r = Ln.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && wn(t), D === null && ln(t);
		}
		e.wv = Br(), qn = null, Jn = 0, Qn(e, _, n), qn = null, rn() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? Fr([e]) : Y.push(e)), !r.is_fork && Wn.size > 0 && !Gn && Xn();
	}
	return t;
}
function Xn() {
	Gn = !1;
	for (let e of Wn) {
		e.f & 1024 && w(e, at);
		let t;
		try {
			t = Vr(e);
		} catch {
			t = !0;
		}
		t && qr(e);
	}
	Wn.clear();
}
function Zn(e) {
	j(e, e.v + 1);
}
function Qn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = rn(), a = r.length;
		if (Jn += a, Jn > 1e5 && qn === null && (qn = /* @__PURE__ */ new Set()), qn !== null) {
			if (qn.has(e)) return;
			qn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & _) === 0;
				if (l && w(s, t), c & 131072) Wn.add(s);
				else if (c & 2) {
					var u = s;
					D?.delete(u), Qn(u, at, n);
				} else if (l) {
					var d = s;
					c & 16 && O !== null && O.add(d), n === null ? Vn(d) : n.push(d);
				}
			}
		}
	}
}
function $n(e) {
	if (typeof e != "object" || !e || gt in e || _t in e) return e;
	let t = $e(e);
	if (t !== Ze && t !== Qe) return e;
	var n = /* @__PURE__ */ new Map(), r = We(e), i = /* @__PURE__ */ A(0), a = null, o = Rr, s = (e) => {
		if (Rr === o) return e();
		var t = V, n = Rr;
		U(null), zr(o);
		var r = e();
		return U(t), zr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ A(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || Ht();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ A(r.value, a);
				return n.set(t, e), e;
			}) : j(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ A(h, a));
					n.set(t, e), Zn(i);
				}
			} else j(r, h), Zn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === gt) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || Ye(t, r)?.writable) && (o = s(() => /* @__PURE__ */ A($n(c ? t[r] : h), a)), n.set(r, o)), o !== void 0) {
				var l = X(o);
				return l === h ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = X(i);
				if (a === h) return;
				if (r && "value" in r) r.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === gt) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== h || Reflect.has(e, t);
			return (r !== void 0 || W !== null && (!i || Ye(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ A(i ? $n(e[t]) : h, a)), n.set(t, r)), X(r) === h) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ A(h, a)), n.set(d + "", f)) : j(f, h);
			}
			if (l === void 0) (!u || Ye(e, t)?.writable) && (l = s(() => /* @__PURE__ */ A(void 0, a)), j(l, $n(o)), n.set(t, l));
			else {
				u = l.v !== h;
				var p = s(() => $n(o));
				j(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var ee = n.get("length"), te = Number(t);
					Number.isInteger(te) && te >= ee.v && j(ee, te + 1);
				}
				Zn(i);
			}
			return !0;
		},
		ownKeys(e) {
			X(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== h;
			});
			for (var [r, a] of n) a.v !== h && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Ut();
		}
	});
}
var er, tr, nr, rr;
function ir() {
	if (er === void 0) {
		er = window, tr = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		nr = Ye(t, "firstChild").get, rr = Ye(t, "nextSibling").get, et(e) && (e[xt] = void 0, e[bt] = null, e[St] = void 0, e.__e = void 0), et(n) && (n[Ct] = void 0);
	}
}
function M(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function N(e) {
	return nr.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ar(e) {
	return rr.call(e);
}
function P(e, t) {
	if (!v) return /* @__PURE__ */ N(e);
	var n = /* @__PURE__ */ N(y);
	if (n === null) n = y.appendChild(M());
	else if (t && n.nodeType !== 3) {
		var r = M();
		return n?.before(r), b(r), r;
	}
	return t && lr(n), b(n), n;
}
function or(e, t = !1) {
	if (!v) {
		var n = /* @__PURE__ */ N(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ar(n) : n;
	}
	if (t) {
		if (y?.nodeType !== 3) {
			var r = M();
			return y?.before(r), b(r), r;
		}
		lr(y);
	}
	return y;
}
function F(e, t = !1) {
	if (!v) return /* @__PURE__ */ N(e);
	var n = P(e, t);
	return x(e), n;
}
function I(e, t = 1, n = !1) {
	let r = v ? y : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ ar(r);
	if (!v) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = M();
			return r === null ? i?.after(a) : r.before(a), b(a), a;
		}
		lr(r);
	}
	return b(r), r;
}
function sr() {
	return !1;
}
function cr(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function lr(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function ur(e) {
	var t = W;
	if (t === null) return V.f |= ht, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	L(e, t);
}
function L(e, t) {
	if (e === He) throw e;
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/effects.js
function dr(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function R(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= ot);
	var r = {
		ctx: S,
		deps: null,
		nodes: null,
		f: e | _ | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	E?.register_created_effect(r);
	var i = r;
	if (e & 4) Nn === null ? Ln.ensure().schedule(r) : Nn.push(r);
	else if (t !== null) {
		try {
			qr(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ut));
	}
	if (i !== null && (i.parent = n, n !== null && dr(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function fr() {
	return V !== null && !H;
}
function pr(e) {
	let t = R(8, null);
	return w(t, g), t.teardown = e, t;
}
function mr(e) {
	return R(4 | ft, e);
}
function hr(e) {
	Ln.ensure();
	let t = R(64 | dt, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Er(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function gr(e) {
	return R(4, e);
}
function _r(e) {
	return R(mt | dt, e);
}
function vr(e, t = 0) {
	return R(8 | t, e);
}
function yr(e, t = [], n = [], r = []) {
	hn(r, t, n, (t) => {
		R(8, () => {
			e(...t.map(X));
		});
	});
}
function br(e, t = 0) {
	return R(16 | t, e);
}
function z(e) {
	return R(32 | dt, e);
}
function xr(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Mr, r = V;
		Nr(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			L(t, e.parent);
		} finally {
			Nr(n), U(r);
		}
	}
}
function Sr(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && pn(() => {
			e.abort(Tt);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Cr(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (wr(e.nodes.start, e.nodes.end), n = !0), e.f |= lt, Sr(e, t && !n), Kr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	xr(e), e.f ^= lt, e.f |= st;
	var i = e.parent;
	i !== null && i.first !== null && Tr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function wr(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ ar(e);
		e.remove(), e = n;
	}
}
function Tr(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Er(e, t, n = !0) {
	var r = [];
	e.f |= 256, Dr(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Dr(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ot;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Dr(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Or(e) {
	e.f &= -257, kr(e, !0);
}
function kr(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ot, e.f & 1024 || (w(e, _), Ln.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			kr(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Ar(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ ar(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/legacy.js
var jr = null, Mr = !1;
function Nr(e) {
	Mr = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function G(e) {
	W = e;
}
var K = null;
function Pr(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function Fr(e) {
	Y = e;
}
var Ir = 1, Lr = 0, Rr = Lr;
function zr(e) {
	Rr = e;
}
function Br() {
	return ++Ir;
}
function Vr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Vr(a) && Tn(a), a.wv > e.wv) return !0;
		}
		t & 512 && D === null && w(e, g);
	}
	return !1;
}
function Hr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Hr(a, t, !1) : t === a && (n ? w(a, _) : a.f & 1024 && w(a, at), Vn(a));
	}
}
function Ur(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = S, s = H, c = Rr, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Yt(e.ctx), H = !1, Rr = ++Lr, e.ac !== null && (pn(() => {
		e.ac.abort(Tt);
	}), e.ac = null);
	try {
		e.f |= pt;
		var u = e.fn, d = u();
		e.f |= ct;
		var f = Wr(e);
		if (rn() && Y !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < Y.length; p++) Hr(Y[p], e);
		if (i !== null && i !== e) {
			if (Lr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Lr;
			if (t !== null) for (let e of t) e.rv = Lr;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= ht), d;
	} catch (t) {
		return Wr(e), ur(t);
	} finally {
		e.f ^= pt, q = t, J = n, Y = r, V = i, K = a, Yt(o), H = s, Rr = c;
	}
}
function Wr(e) {
	var t = e.deps, n = E?.is_fork;
	if (q !== null) {
		var r;
		if (n || Kr(e, J), t !== null && J > 0) for (t.length = J + q.length, r = 0; r < q.length; r++) t[J + r] = q[r];
		else e.deps = t = q;
		if (fr() && e.f & 512) for (r = J; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && J < t.length && (Kr(e, J), t.length = J);
	return t;
}
function Gr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = Ge.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (q === null || !Ke.call(q, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== h && ln(a), a.ac !== null && pn(() => {
			a.ac.abort(Tt), a.ac = null, w(a, _);
		}), En(a), Kr(a, 0);
	}
}
function Kr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Gr(e, n[r]);
}
function qr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		w(e, g);
		var n = W;
		W = e;
		try {
			t & 16777232 ? Cr(e) : Sr(e), xr(e);
			var r = Ur(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Ir;
		} finally {
			W = n;
		}
	}
}
async function Jr() {
	await Promise.resolve(), Rn();
}
function X(e) {
	var t = !!(e.f & 2);
	if (jr?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < Lr && (e.rv = Lr, q === null && n !== null && n[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], Ke.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : Ke.call(r, V) || r.push(V);
		}
	}
	if (Mr && k.has(e)) return k.get(e);
	if (t) {
		var i = e;
		if (Mr) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Xr(i)) && (a = wn(i)), k.set(i, a), a;
		}
		var o = !(i.f & 512) && !H && V !== null && !!(V.f & 512), s = (i.f & ct) === 0;
		Vr(i) && (o && (i.f |= 512), Tn(i)), o && !s && (Dn(i), Yr(i));
	}
	if (D?.has(e)) return D.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Yr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : Ke.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (Dn(n), Yr(n));
	}
}
function Xr(e) {
	if (e.v === h) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (k.has(t) || t.f & 2 && Xr(t)) return !0;
	return !1;
}
function Zr(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/events.js
var Qr = Symbol("events"), $r = /* @__PURE__ */ new Set(), ei = /* @__PURE__ */ new Set();
function ti(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || oi.call(t, e), !e.cancelBubble) return pn(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, C(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function ni(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = ti(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && pr(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function ri(e, t, n) {
	(t[Qr] ??= {})[e] = n;
}
function Z(e) {
	for (var t = 0; t < e.length; t++) $r.add(e[t]);
	for (var n of ei) n(e);
}
var ii = null, ai = !1;
function oi(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	ii = e, ai || (ai = !0, setTimeout(() => {
		ai = !1, ii = null;
	}));
	var o = 0, s = ii === e && e[Qr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Qr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		Je(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = V, d = W;
		U(null), G(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[Qr]?.[r];
					m == null || a.disabled && e.target !== a || m.call(a, e);
				} catch (e) {
					f ? p.push(e) : f = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (f) {
				for (let e of p) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[Qr] = t, delete e.currentTarget, U(u), G(d);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/reconciler.js
var si = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function ci(e) {
	return si?.createHTML(e) ?? e;
}
function li(e) {
	var t = cr("template");
	return t.innerHTML = ci(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/template.js
function Q(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function ui(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (v) return Q(y, null), y;
		i === void 0 && (i = li(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ N(i)));
		var t = r || tr ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ N(t), s = t.lastChild;
			Q(o, s);
		} else Q(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function di(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (v) return Q(y, null), y;
		if (!o) {
			var e = /* @__PURE__ */ N(li(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ N(e);) o.appendChild(/* @__PURE__ */ N(e));
			else o = /* @__PURE__ */ N(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ N(t), r = t.lastChild;
			Q(n, r);
		} else Q(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function fi(e, t) {
	return /* @__PURE__ */ di(e, t, "svg");
}
function pi() {
	if (v) return Q(y, null), y;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = M();
	return e.append(t, n), Q(t, n), e;
}
function mi(e, t) {
	if (v) {
		var n = W;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = y), jt();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var hi = ["touchstart", "touchmove"];
function gi(e) {
	return hi.includes(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/reactivity/create-subscriber.js
function _i(e) {
	let t = 0, n = Kn(0), r;
	return () => {
		fr() && (X(n), vr(() => (t === 0 && (r = Zr(() => e(() => Zn(n)))), t += 1, () => {
			C(() => {
				--t, t === 0 && (r?.(), r = void 0, Zn(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var vi = ut | dt;
function yi(e, t, n, r) {
	new bi(e, t, n, r);
}
var bi = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = v ? y : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = _i(() => (this.#m = Kn(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = br(() => {
			if (v) {
				let e = Pt(this.#t);
				jt();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, vi), v && (this.#e = y);
	}
	#g() {
		try {
			this.#a = z(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		C(r), t && (this.#s = z(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? kt() : (t = !0, n && Gt(), this.#s !== null && Er(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					L(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (st | lt)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), C(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = M(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return z(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							L(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(E)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Er(this.#o, () => {
					this.#o = null;
				}), this.#S(E));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Ar(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
			} else this.#S(E);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		un(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = W, n = V, r = S;
		G(this.#i), U(this.#i), Yt(this.#i.ctx);
		try {
			return Ln.ensure(), e();
		} finally {
			G(t), U(n), Yt(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Er(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !this.#m || this.#d || (this.#d = !0, C(() => {
			this.#d = !1, this.#m && Yn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), X(this.#m);
	}
	error(e) {
		if (e === He || !this.#n.onerror && !this.#n.failed) throw e;
		E?.is_fork ? (this.#a && E.skip_effect(this.#a), this.#o && E.skip_effect(this.#o), this.#s && E.skip_effect(this.#s), E.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), v && (b(this.#t), Mt(), b(Nt()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return z(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return L(e, this.#i.parent), null;
				}
			}));
		};
		C(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					L(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => L(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function $(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[Ct] ??= e.nodeValue) && (e[Ct] = n, e.nodeValue = `${n}`);
}
function xi(e, t) {
	return Ci(e, t);
}
var Si = /* @__PURE__ */ new Map();
function Ci(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	ir();
	var c = void 0, l = hr(() => {
		var o = n ?? t.appendChild(M());
		yi(o, { pending: () => {} }, (t) => {
			en({});
			var n = S;
			if (a && (n.c = a), i && (r.$$events = i), v && Q(t, null), c = e(t, r) || nn(), v && (W.nodes.end = y, y === null || y.nodeType !== 8 || y.data !== "]")) throw Ot(), He;
			tn();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = gi(r);
					for (let e of [t, document]) {
						var a = Si.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Si.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, oi, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u(qe($r)), ei.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = Si.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, oi), r.delete(e), r.size === 0 && Si.delete(n)) : r.set(e, i);
			}
			ei.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return wi.set(c, l), c;
}
var wi = /* @__PURE__ */ new WeakMap();
function Ti(e, t) {
	let n = wi.get(e);
	return n ? (wi.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ei = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Or(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Or(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (B(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Ar(r, t), t.append(M()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Er(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = E, r = sr();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = M();
				i.append(a), this.#n.set(e, {
					effect: z(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, z(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else v && (this.anchor = y), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/if.js
function Di(e, t, n = !1) {
	var r;
	v && (r = y, jt());
	var i = new Ei(e), a = n ? ut : 0;
	function o(e, t) {
		if (v) {
			var n = Pt(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Nt();
				b(a), i.anchor = a, At(!1), i.ensure(e, t), At(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	br(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Oi(e, t, n) {
	var r;
	v && (r = y, jt());
	var i = new Ei(e);
	br(() => {
		var e = t() ?? null;
		if (v && Pt(r) === "[" != (e !== null)) {
			var a = Nt();
			b(a), i.anchor = a, At(!1), i.ensure(e, e && ((t) => n(t, e))), At(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, ut);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ki = Symbol("is custom element"), Ai = Symbol("is html"), ji = Et ? "link" : "LINK";
function Mi(e) {
	if (v) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Ni(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Ni(e, "checked", null), e.checked = r;
				}
			}
		};
		e[wt] = n, C(n), fn();
	}
}
function Ni(e, t, n, r) {
	var i = Pi(e);
	v && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ji) || i[t] !== (i[t] = n) && (t === "loading" && (e[yt] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ii(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Pi(e) {
	return e[bt] ??= {
		[ki]: e.nodeName.includes("-"),
		[Ai]: e.namespaceURI === Ue
	};
}
var Fi = /* @__PURE__ */ new Map();
function Ii(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Fi.get(t);
	if (n) return n;
	Fi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = Xe(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = $e(i);
	}
	return n;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Li(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	mn(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ri(e) ? zi(a) : a, n(a), E !== null && r.add(E), await Jr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (v && e.defaultValue !== e.value || Zr(t) == null && e.value) && (n(Ri(e) ? zi(e.value) : e.value), E !== null && r.add(E)), vr(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = E;
			if (r.has(i)) return;
		}
		Ri(e) && n === zi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ri(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function zi(e) {
	return e === "" ? null : +e;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Bi(e, t) {
	return e === t || e?.[gt] === t;
}
function Vi(e = nn(), t, n, r) {
	var i = S.r, a = W;
	return gr(() => {
		var o, s;
		return vr(() => {
			o = s, s = r?.() || [], Zr(() => {
				Bi(n(...s), e) || (t(e, ...s), o && Bi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Bi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/utils.js
function Hi(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), nt;
	let r = Zr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/shared/index.js
var Ui = [];
function Wi(e, t = nt) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (It(e, t) && (e = t, n)) {
			let t = !Ui.length;
			for (let t of r) t[1](), Ui.push(t, e);
			if (t) {
				for (let e = 0; e < Ui.length; e += 2) Ui[e][0](Ui[e + 1]);
				Ui.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = nt) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || nt), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Gi(e) {
	let t;
	return Hi(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/props.js
var Ki = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (tt(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			tt(i) && (i = i());
			let a = Ye(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (tt(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = Ye(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === gt || t === vt) return !1;
		for (let n of e.props) if (tt(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (tt(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function qi(...e) {
	return new Proxy({ props: e }, Ki);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/index-client.js
function Ji(e) {
	let t, n = _i((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return fr() ? (n(), t) : Gi(e);
	}
	return "set" in e ? {
		get current() {
			return r();
		},
		set current(t) {
			e.set(t);
		}
	} : { get current() {
		return r();
	} };
}
// packages/ui-kit/src/form/TimePicker.svelte
Z(["input"]), Z(["change"]), Z(["change"]), _i((e) => {
	let t = document.createElement("span");
	t.setAttribute("aria-hidden", "true"), t.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;width:1rem;height:1rem;inset:0;", document.body.append(t);
	let n = new ResizeObserver(e);
	n.observe(t);
	let r = new MutationObserver(e);
	return r.observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), window.addEventListener("resize", e), () => {
		n.disconnect(), r.disconnect(), t.remove(), window.removeEventListener("resize", e);
	};
}), Z([
	"click",
	"pointerdown",
	"pointerup"
]), Z(["change"]), c.hapticFeedbackEnabled, Z(["click"]), Z(["click"]), Z(["click", "keydown"]), c.reduceMotionEnabled, Z(["pointerdown"]), Z(["keydown", "click"]), Z(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var Yi = /* @__PURE__ */ ui("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function Xi(e, t) {
	en(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = Yi(), i = P(r), a = F(i, !0), o = I(i, 2), s = F(o, !0);
	x(r), yr((e, t) => {
		$(a, e), $(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), ri("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), mi(e, r), tn();
}
Z(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [Zi, Qi] = Xt();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Z(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var $i = /* @__PURE__ */ ui("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function ea(e, t) {
	en(t, !0);
	let n = /* @__PURE__ */ T(() => t.component), r = /* @__PURE__ */ T(() => Ji(t.propsStore).current);
	var i = $i();
	yi(P(i), {
		onerror: (e) => console.error("[MountableSvelteHost] render failed:", e),
		failed: (e, t = nt, n = nt) => {
			Xi(e, {
				get controller() {
					return X(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = pi();
		Oi(or(t), () => X(n), (e, t) => {
			t(e, qi(() => X(r)));
		}), mi(e, t);
	}), x(i), mi(e, i), tn();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ta(e) {
	return {
		[le]: !0,
		mount(t, n, r) {
			let i = Wi({ ...n }), a = xi(ea, {
				target: t,
				props: {
					component: e,
					propsStore: i
				},
				context: r
			});
			return {
				update(e) {
					i.set({ ...e });
				},
				unmount: () => {
					Ti(a).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function na(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return se(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? se(a, i) : o;
}
// packages/ui-kit/src/plugin-screen/import-tab-props.ts
async function ra(e, t, n, r) {
	let i = await e.previewWithSlot(t, n);
	return !i && e.state.errorMessage && r?.notify(e.state.errorMessage, "error"), i;
}
// packages/plugins/source-cqut/src/CqutOnlineImportTab.svelte
var ia = /* @__PURE__ */ ui("<div class=\"flex items-center gap-2 rounded-inset bg-error-container/40 p-3 text-error\"><span class=\"text-body-small\"> </span></div>"), aa = /* @__PURE__ */ fi("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"size-5\"><path d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"></path></svg>"), oa = /* @__PURE__ */ fi("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"size-5\"><path d=\"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z\"></path></svg>"), sa = /* @__PURE__ */ ui("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><!> <div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p> <p class=\"text-body-small text-supporting mt-1 text-on-surface-variant/80\"> </p></div> <div class=\"flex flex-col gap-3\"><div class=\"ui-form-field\"><label class=\"ui-field-label\" for=\"import-account\"> </label> <input id=\"import-account\" class=\"ui-form-field-input\" type=\"text\" inputmode=\"numeric\" autocomplete=\"username\" autocapitalize=\"none\" autocorrect=\"off\" enterkeyhint=\"next\"/></div> <div class=\"ui-form-field\"><label class=\"ui-field-label\" for=\"import-password\"> </label> <div class=\"ui-form-field-input-row\"><input id=\"import-password\" class=\"ui-form-field-input\" autocomplete=\"current-password\" autocapitalize=\"none\" autocorrect=\"off\" enterkeyhint=\"done\"/> <button type=\"button\" class=\"ui-row-state flex size-11 shrink-0 items-center justify-center rounded-control text-on-surface-variant transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand\"><!></button></div></div></div> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button></div></div></div>");
function ca(e, t) {
	en(t, !0);
	let n = /* @__PURE__ */ A(!1), r = /* @__PURE__ */ A(""), i = /* @__PURE__ */ A(""), a = /* @__PURE__ */ A(!1), o = /* @__PURE__ */ A($n(typeof navigator < "u" ? navigator.onLine : !0));
	function s() {
		j(o, !0);
	}
	function c() {
		j(o, !1);
	}
	function l(e) {
		return na(t.controller, "source-cqut", we, e);
	}
	let u = /* @__PURE__ */ T(() => l("import.online.offline")), d = /* @__PURE__ */ T(() => l("import.online.tab.title")), f = /* @__PURE__ */ T(() => l("import.online.intro")), p = /* @__PURE__ */ T(() => l("import.online.attribution")), m = /* @__PURE__ */ T(() => l("import.online.accountLabel")), ee = /* @__PURE__ */ T(() => l("import.online.field.password.title")), te = /* @__PURE__ */ T(() => l(X(a) ? "import.online.password.hide" : "import.online.password.show")), ne = /* @__PURE__ */ T(() => l(X(n) ? "import.online.submit.loading" : "import.online.submit")), re = /* @__PURE__ */ T(() => X(n) || !X(o));
	async function ie() {
		j(n, !0);
		try {
			await ra(t.transfer, "cqut-online", {
				username: X(r),
				password: X(i)
			}, t.controller) && t.onContinue();
		} finally {
			j(n, !1);
		}
	}
	var ae = sa();
	ni("online", er, s), ni("offline", er, c);
	var oe = P(ae), se = P(oe), ce = (e) => {
		var t = ia(), n = F(P(t), !0);
		x(t), yr(() => $(n, X(u))), mi(e, t);
	};
	Di(se, (e) => {
		X(o) || e(ce);
	});
	var le = I(se, 2), ue = P(le), de = F(ue, !0), fe = I(ue, 2), pe = F(fe, !0), me = F(I(fe, 2), !0);
	x(le);
	var he = I(le, 2), ge = P(he), _e = P(ge), ve = F(_e, !0), ye = I(_e, 2);
	Mi(ye), Ni(ye, "spellcheck", !1), x(ge);
	var be = I(ge, 2), xe = P(be), Se = F(xe, !0), Ce = I(xe, 2), Te = P(Ce);
	Mi(Te), Ni(Te, "spellcheck", !1);
	var Ee = I(Te, 2), De = P(Ee), Oe = (e) => {
		mi(e, aa());
	}, ke = (e) => {
		mi(e, oa());
	};
	Di(De, (e) => {
		X(a) ? e(Oe) : e(ke, -1);
	}), x(Ee), x(Ce), x(be), x(he);
	var Ae = I(he, 2), je = P(Ae), Me = F(je, !0);
	x(Ae), x(oe), x(ae), yr(() => {
		$(de, X(d)), $(pe, X(f)), $(me, X(p)), $(ve, X(m)), $(Se, X(ee)), Ni(Te, "type", X(a) ? "text" : "password"), Ni(Ee, "aria-label", X(te)), je.disabled = X(re), $(Me, X(ne));
	}), Li(ye, () => X(r), (e) => j(r, e)), Li(Te, () => X(i), (e) => j(i, e)), ri("click", Ee, () => j(a, !X(a))), ri("click", je, ie), mi(e, ae), tn();
}
Z(["click"]);
// packages/plugins/source-cqut/src/EduHtmlImportTab.svelte
var la = /* @__PURE__ */ ui("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p></div> <input type=\"file\" accept=\".html,.htm,text/html\" class=\"hidden\"/> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-outlined ui-btn-block\"> </button></div></div></div>");
function ua(e, t) {
	en(t, !0);
	let n = /* @__PURE__ */ A(void 0), r = /* @__PURE__ */ A(!1);
	function i(e) {
		return na(t.controller, "source-cqut", we, e);
	}
	let a = /* @__PURE__ */ T(() => i("import.html.tab.title")), o = /* @__PURE__ */ T(() => i("import.html.intro")), s = /* @__PURE__ */ T(() => i(X(r) ? "import.html.submit.loading" : "import.html.submit"));
	async function c(e) {
		let n = e.currentTarget, i = n.files?.[0];
		if (i) {
			j(r, !0);
			try {
				let e = await i.text();
				await ra(t.transfer, "edu-html", { file: e }, t.controller) && t.onContinue();
			} finally {
				j(r, !1), n.value = "";
			}
		}
	}
	var l = la(), u = P(l), d = P(u), f = P(d), p = F(f, !0), m = F(I(f, 2), !0);
	x(d);
	var ee = I(d, 2);
	Vi(ee, (e) => j(n, e), () => X(n));
	var te = I(ee, 2), ne = P(te), re = F(ne, !0);
	x(te), x(u), x(l), yr(() => {
		$(p, X(a)), $(m, X(o)), ne.disabled = X(r), $(re, X(s));
	}), ri("change", ee, c), ri("click", ne, () => X(n)?.click()), mi(e, l), tn();
}
Z(["change", "click"]);
// packages/plugins/source-cqut/src/index.ts
function da(e = {}) {
	let { onlineComponent: t = ta(ca), htmlComponent: n = ta(ua) } = e;
	return he({
		id: "source-cqut",
		messages: we,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "source",
		order: 10,
		author: "UE-DND",
		homepage: "https://github.com/UE-DND/Chronos",
		allowedDomains: [
			"authserver.cqut.edu.cn",
			"uis.cqut.edu.cn",
			"timetable-cfc.cqut.edu.cn"
		],
		apply(e, r) {
			Ve({
				ctx: e,
				t: r,
				onlineComponent: t,
				htmlComponent: n
			});
		}
	});
}
var fa = da();
export { fa as default };
