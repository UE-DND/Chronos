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
			periodTimes: e.academicConfig?.periodTimes ?? []
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
var oe = ae("pluginHttp");
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
	return "1.3.5";
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
async function ge(e, t, n) {
	if (!e.proxy) throw Error("HTTP proxy is not supported in this environment");
	return e.proxy(t, n);
}
async function _e(e, t, n) {
	let r = await ge(e, t, n), i = await r.json();
	return {
		response: r,
		body: r.ok ? {
			ok: !0,
			payload: i
		} : fe(i)
	};
}
var ve = "liangjiang", ye = {
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
function be(e) {
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
function xe(e) {
	return ie({ file: {
		type: "file",
		title: () => e("import.html.field.file.title"),
		description: () => e("import.html.field.file.description"),
		accept: ".html,.htm,text/html",
		required: !0
	} });
}
function Se(e) {
	return ie({
		campusId: {
			type: "select",
			presentation: "radio",
			title: () => e("import.html.confirm.campusPeriodTitle"),
			description: () => e("import.html.confirm.campusPeriodHint"),
			default: ve,
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
var Ce = {
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
function we(e, t, n = "import.online.error.authFailed") {
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
function Te(e, t) {
	let n = e.trim();
	return n ? `${n}${t("timetable.studentSuffix")}` : t("timetable.defaultName");
}
// packages/plugins/source-cqut/src/week-parser.ts
function Ee(e) {
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
var De = /\s+/g;
function Oe(e) {
	return e.trim().replace(De, " ");
}
function ke(e) {
	if (typeof DOMParser < "u") return new DOMParser().parseFromString(e, "text/html");
	throw Error("DOMParser is not available in current runtime");
}
function Ae(e) {
	if (!e) return "";
	let t = "";
	for (let n = 0; n < e.childNodes.length; n += 1) {
		let r = e.childNodes[n];
		r.nodeType === 3 && (t += r.textContent ?? "");
	}
	return t;
}
// packages/plugins/source-cqut/src/html-parser.ts
var je = new ne();
function Me(e, t, n, r = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) {
	let i = t.campusId ?? "liangjiang", a = t.termStartDate?.trim() ?? "";
	if (!a) throw new ce("invalid-data", n("import.html.error.termStartRequired"));
	let o = je.normalizeTermStartDate(a, r), s = ye[i].map((e) => ({ ...e }));
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
function Ne(e, i) {
	let a = i?.t ?? ((e) => e), o = i?.customDocParser ? i.customDocParser(e) : ke(e), c = o.querySelector("#kbgrid_table_0") ?? o.querySelector("table.timetable1") ?? o.querySelector("table[id*=\"kbgrid\"]");
	if (!c) throw new ce("invalid-data", a("import.html.error.tableNotFound"));
	let l = c.querySelector(".timetable_title"), u = Oe(l?.querySelector("h6.pull-left")?.textContent ?? ""), d = Oe(Ae(l)).replace(/的课表$/, ""), f = c.querySelectorAll("td.td_wrap[id]"), p = [];
	if (f.forEach((e) => {
		let [r, i] = (e.getAttribute("id") ?? "").split("-"), a = Number.parseInt(r ?? "", 10), o = Number.parseInt(i ?? "", 10);
		if (Number.isNaN(a) || Number.isNaN(o)) return;
		let s = Number.parseInt(e.getAttribute("rowspan") ?? "1", 10), c = o + (Number.isNaN(s) ? 1 : s) - 1;
		e.querySelectorAll(".timetable_con").forEach((e, r) => {
			let i = Oe(e.querySelector(".title")?.textContent ?? "");
			if (!i) return;
			let s = /* @__PURE__ */ new Map();
			e.querySelectorAll("p").forEach((e) => {
				let t = e.querySelector("[title]"), n = Oe(t?.getAttribute("title") ?? "");
				if (!n) return;
				let r = "";
				for (let n = 0; n < e.childNodes.length; n += 1) {
					let i = e.childNodes[n];
					i !== t && (r += i.textContent ?? "");
				}
				let i = Oe(r);
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
				weeks: Ee(s.get("节/周") ?? "")
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
			periodTimes: i?.campusId ? ye[i.campusId].map((e) => ({ ...e })) : []
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
function Pe(e) {
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
function Fe(e, r) {
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
function Ie(e, t = "", n = ve, i = (e) => e) {
	let a = e.payload;
	if (!a || !Array.isArray(a.eventList)) throw Error("Invalid CQUT online schedule payload");
	let o = t ? Te(t, i) : a.yearTerm || i("timetable.defaultName"), c = Pe(a), l = [], u = 20;
	a.eventList.forEach((e, t) => {
		let n = Fe(e, t);
		if (n) {
			l.push(n);
			for (let e of n.weeks) u = Math.max(u, e);
		}
	});
	let d = e.campusId || n, f = e.campusPeriodTimes || ye, p = f[d] ?? ye.liangjiang, m = { "source-cqut": {
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
var Le = {
	pluginId: "source-cqut",
	proxy: {
		action: "preview",
		domains: ["cqut.edu.cn"]
	}
};
// packages/plugins/source-cqut/src/cqut-import-tabs.ts
async function Re(e, t, n, r) {
	let i = r ?? e, a = n.username?.trim(), o = n.password;
	if (!a || !o?.trim()) throw new ce("unsupported", t("import.online.error.credentials"));
	i.actions.notify(t("import.online.notify.connecting"), "info");
	let s = i.service(oe);
	if (!s.proxy) throw new ce("unsupported", t("import.online.error.proxyUnsupported"));
	let { response: c, body: l } = await _e(s, Le.proxy.action, {
		account: a,
		password: o
	});
	if (!c.ok || !l.ok) throw new ce("network", we(l, t));
	return Ie(l.payload, a, ve, t);
}
async function ze(e, t) {
	let n = t.file;
	if (!n || typeof n != "string") throw new ce("no-data", e("import.html.error.invalidFile"));
	return Ne(n, {
		campusId: ve,
		t: e
	});
}
function Be(e) {
	let { ctx: t, t: n, onlineComponent: r, htmlComponent: i } = e, a = be(n), o = xe(n), s = Se(n);
	t.service(oe).supportsServer(Le.proxy.action) && t.registerSlot("import.source.tab", {
		id: "cqut-online",
		title: () => n("import.online.tab.title"),
		order: 10,
		importKind: "online",
		supportingText: () => n("import.online.tab.supporting"),
		component: r,
		inputSchema: a,
		executeImport: (e, r) => Re(t, n, e, r)
	}), t.registerSlot("import.source.tab", {
		id: "edu-html",
		title: () => n("import.html.tab.title"),
		order: 30,
		importKind: "file",
		supportingText: () => n("import.html.tab.supporting"),
		component: i,
		inputSchema: o,
		confirmSchema: s,
		confirmDefaultInput: {
			campusId: ve,
			termStartDate: ""
		},
		validateConfirmInputs: (e) => e.termStartDate?.trim() ? null : n("import.html.error.termStartRequired"),
		finalizePreview: (e, t) => Me(e, t, n),
		executeImport: (e) => ze(n, e)
	});
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/constants.js
var Ve = {}, h = Symbol("uninitialized"), He = "http://www.w3.org/1999/xhtml", Ue = Array.isArray, We = Array.prototype.indexOf, Ge = Array.prototype.includes, Ke = Array.from, qe = Object.defineProperty, Je = Object.getOwnPropertyDescriptor, Ye = Object.getOwnPropertyDescriptors, Xe = Object.prototype, Ze = Array.prototype, Qe = Object.getPrototypeOf, $e = Object.isExtensible;
function et(e) {
	return typeof e == "function";
}
var tt = () => {};
function nt(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function rt() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var g = 1024, _ = 2048, it = 4096, at = 8192, ot = 16384, st = 32768, ct = 1 << 25, lt = 65536, ut = 1 << 19, dt = 1 << 20, ft = 1 << 21, pt = 1 << 22, mt = 1 << 23, ht = Symbol("$state"), gt = Symbol("component"), _t = Symbol("legacy props"), vt = Symbol(""), yt = Symbol("attributes"), bt = Symbol("class"), xt = Symbol("style"), St = Symbol("text"), Ct = Symbol("form reset"), wt = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Tt = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function Et() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Dt(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ot() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/hydration.js
var v = !1;
function kt(e) {
	v = e;
}
var y;
function b(e) {
	if (e === null) throw Dt(), Ve;
	return y = e;
}
function At() {
	return b(/* @__PURE__ */ ir(y));
}
function x(e) {
	if (v) {
		if (/* @__PURE__ */ ir(y) !== null) throw Dt(), Ve;
		y = e;
	}
}
function jt(e = 1) {
	if (v) {
		for (var t = e, n = y; t--;) n = /* @__PURE__ */ ir(n);
		y = n;
	}
}
function Mt(e = !0) {
	for (var t = 0, n = y;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ ir(n);
		e && n.remove(), n = i;
	}
}
function Nt(e) {
	if (!e || e.nodeType !== 8) throw Dt(), Ve;
	return e.data;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/equality.js
function Pt(e) {
	return e === this.v;
}
function Ft(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function It(e) {
	return !Ft(e, this.v);
}
function Lt(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Rt() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/errors.js
function zt() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Bt() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Vt() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ht() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ut() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Wt() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/context.js
function Gt(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Rt(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Kt(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function qt(e, t) {
	return e === null && Lt(t), e.c ??= new Map(Kt(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/context.js
var S = null;
function Jt(e) {
	S = e;
}
function Yt() {
	return Gt(Xt, Zt, Qt);
}
function Xt(e) {
	return qt(S, "getContext").get(e);
}
function Zt(e, t) {
	return qt(S, "setContext").set(e, t), t;
}
function Qt(e) {
	return qt(S, "hasContext").has(e);
}
function $t(e, t = !1, n) {
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
function en(e) {
	var t = S, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) pr(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, S = t.p, tn(e);
}
function tn(e = {}) {
	return qe(e, gt, { value: !0 }), e;
}
function nn() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/task.js
var rn = [];
function an() {
	var e = rn;
	rn = [], nt(e);
}
function C(e) {
	if (rn.length === 0 && !An) {
		var t = rn;
		queueMicrotask(() => {
			t === rn && an();
		});
	}
	rn.push(e);
}
function on() {
	for (; rn.length > 0;) an();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/status.js
var sn = ~(_ | it | g);
function w(e, t) {
	e.f = e.f & sn | t;
}
function cn(e) {
	e.f & 512 || e.deps === null ? w(e, g) : w(e, it);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/utils.js
function ln(e, t) {
	e.f & 2048 ? t.set(e, _) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, it), w(e, g);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/misc.js
var un = !1;
function dn() {
	un || (un = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[Ct]?.();
		});
	}, { capture: !0 }));
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function fn(e) {
	var t = V, n = W;
	U(null), G(null);
	try {
		return e();
	} finally {
		U(t), G(n);
	}
}
function pn(e, t, n, r = n) {
	e.addEventListener(t, () => fn(n));
	let i = e[Ct];
	e[Ct] = i ? () => {
		i(), r(!0);
	} : () => r(!0), dn();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/async.js
function mn(e, t, n, r) {
	let i = nn() ? vn : xn;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = hn(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				L(e, s);
			}
			gn();
		}
	}
	var d = _n();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ bn(e))).then(u).catch((e) => L(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), gn());
	}) : f();
}
function hn() {
	var e = W, t = V, n = S, r = E;
	return function(i = !0) {
		G(e), U(t), Jt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function gn(e = !0) {
	G(null), U(null), Jt(null), e && E?.deactivate();
}
function _n() {
	var e = W, t = e.b, n = E, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function vn(e) {
	var t = 2 | _;
	return W !== null && (W.f |= ut), {
		ctx: S,
		deps: null,
		effects: null,
		equals: Pt,
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
var yn = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function bn(e, t, n) {
	let r = W;
	r === null && zt();
	var i = void 0, a = Gn(h), o = !V, s = /* @__PURE__ */ new Set();
	return gr(() => {
		var t = W, n = rt();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== wt && n.reject(e);
			}).finally(gn);
		} catch (e) {
			n.reject(e), gn();
		}
		var c = E;
		if (o) {
			if (t.f & 32768) var l = _n();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(yn);
			else for (let e of s.values()) e.reject(yn);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== yn && (c.activate(), t ? (a.f |= mt, Jn(a, t)) : (a.f & 8388608 && (a.f ^= mt), Jn(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), fr(() => {
		for (let e of s) e.reject(yn);
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
	let t = /* @__PURE__ */ vn(e);
	return Nr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function xn(e) {
	let t = /* @__PURE__ */ vn(e);
	return t.equals = It, t;
}
function Sn(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function Cn(e) {
	var t, n = W, r = e.parent;
	if (!jr && r !== null && e.v !== h && r.f & 24576) return Et(), e.v;
	G(r);
	try {
		Sn(e), t = Hr(e);
	} finally {
		G(n);
	}
	return t;
}
function wn(e) {
	var t = Cn(e);
	!e.equals(t) && (e.wv = zr(), (!E?.is_fork || e.deps === null) && (E === null ? e.v = t : (E.capture(e, t, !0), On?.capture(e, t, !0)), e.deps === null)) ? w(e, g) : jr || (D === null ? cn(e) : (dr() || E?.is_fork) && D.set(e, t));
}
function Tn(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && fn(() => {
		t.ac.abort(wt), t.ac = null;
	}), t.fn !== null && (t.teardown = tt), Gr(t, 0), xr(t));
}
function En(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Kr(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/batch.js
var Dn = null, E = null, On = null, D = null, kn = null, An = !1, jn = !1, Mn = null, Nn = null, Pn = 0, Fn = 1, In = class e {
	id = Fn++;
	started = !1;
	linked = !0;
	prev = null;
	next = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Set();
	#n = 0;
	#r = /* @__PURE__ */ new Map();
	#i = null;
	#a = [];
	#o = [];
	#s = /* @__PURE__ */ new Map();
	#c = /* @__PURE__ */ new Map();
	#l = /* @__PURE__ */ new Set();
	is_fork = !1;
	#u = !1;
	constructor() {
		Dn === null ? Dn = this : (Dn.next = this, this.prev = Dn), Dn = this;
	}
	#d() {
		if (this.is_fork) return !0;
		for (let e of this.#r.keys()) if (!this.#f(e)) return !0;
		return !1;
	}
	#f(e) {
		for (var t = e; t !== null; t = t.parent) if (this.#c.has(t)) return !0;
		return !1;
	}
	skip_effect(e) {
		this.#c.has(e) || this.#c.set(e, {
			d: [],
			m: []
		}), this.#l.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#c.get(e);
		if (n) {
			this.#c.delete(e);
			for (var r of n.d) w(r, _), t(r);
			for (r of n.m) w(r, it), t(r);
		}
		this.#l.add(e);
	}
	#p() {
		var e = [];
		for (let i of this.#a) if (!(i.f & 16384 || !(i.f & 6144))) {
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
		return this.#a = [], e;
	}
	#m() {
		this.started = !0;
		for (let [e, t] of this.#s) w(e, t), this.schedule(e);
		this.apply();
		for (var t = Mn = [], n = [], r = Nn = []; this.#a.length > 0;) {
			Pn++ > 1e3 && (this.#b(), Rn());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw Hn(e), this.#d() || this.discard(), t;
			}
		}
		if (E = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Mn = null, Nn = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) Vn(e, t);
			r.length > 0 && E.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), On = this, zn(n), zn(t), On = null, this.#i?.resolve();
			var o = E;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (k.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : Br(r) && (i & 16 && this.add_dirty_reaction(r, it), Kr(r));
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
	#g() {
		for (var e = this.prev; e !== null; e = e.prev) if (!e.is_fork && this.#_(e)) return e;
		return null;
	}
	#_(e) {
		for (let [t, [, n]] of this.current) if (!n && e.current.has(t)) return !0;
		return !1;
	}
	#v(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_reactions(e.#s);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), w(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), E = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) ln(e[t], this.#s);
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
			jn = !0, E = this, this.#m();
		} finally {
			Pn = 0, kn = null, Mn = null, Nn = null, jn = !1, E = null, D = null, k.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(yn);
		this.#b(), this.#i?.resolve();
	}
	register_created_effect(e) {
		this.#o.push(e);
	}
	increment(e, t) {
		if (this.#n += 1, e) {
			let e = this.#r.get(t) ?? 0;
			this.#r.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#n, e) {
			let e = this.#r.get(t) ?? 0;
			e === 1 ? this.#r.delete(t) : this.#r.set(t, e - 1);
		}
		this.#u || (this.#u = !0, C(() => {
			this.#u = !1, this.linked && this.flush();
		}));
	}
	transfer_reactions(e) {
		for (let [t, n] of e) this.add_dirty_reaction(t, n);
		e.clear();
	}
	add_dirty_reaction(e, t) {
		(t === 2048 || this.#s.get(e) !== 2048) && this.#s.set(e, t);
	}
	oncommit(e) {
		this.#e.add(e);
	}
	ondiscard(e) {
		this.#t.add(e);
	}
	settled() {
		return (this.#i ??= rt()).promise;
	}
	static ensure() {
		if (E === null) {
			let t = E = new e();
			!jn && !An && C(() => {
				t.started || t.flush();
			});
		}
		return E;
	}
	apply() {
		D = null;
	}
	schedule(e) {
		kn = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e);
	}
	#b() {
		if (this.linked) {
			var e = this.prev, t = this.next;
			e === null || (e.next = t), t === null ? Dn = e : t.prev = e, this.linked = !1;
		}
	}
};
function Ln(e) {
	var t = An, n = On;
	On = null, An = !0;
	try {
		var r;
		for (e && (Ln(), r = e());;) {
			if (on(), E === null) return r;
			E.flush();
		}
	} finally {
		An = t, On = n;
	}
}
function Rn() {
	try {
		Bt();
	} catch (e) {
		L(e, kn);
	}
}
var O = null;
function zn(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Br(r) && (O = /* @__PURE__ */ new Set(), Kr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && wr(r), O?.size > 0)) {
				k.clear();
				for (let e of O) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) O.has(n) && (O.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Kr(n);
					}
				}
				O.clear();
			}
		}
		O = null;
	}
}
function Bn(e) {
	E.schedule(e);
}
function Vn(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), w(e, g);
		for (var n = e.first; n !== null;) Vn(n, t), n = n.next;
	}
}
function Hn(e) {
	w(e, g);
	for (var t = e.first; t !== null;) Hn(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/sources.js
var Un = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map(), Wn = !1;
function Gn(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Pt,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = Gn(e, t);
	return Nr(n), n;
}
function j(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && nn() && V.f & 4325394 && (K === null || !K.has(e)) && Ut(), Jn(e, n ? Qn(t) : t, Nn);
}
var Kn = null, qn = 0;
function Jn(e, t, n = null) {
	if (!e.equals(t)) {
		jr ? k.set(e, t) : k.has(e) || k.set(e, e.v);
		var r = In.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Cn(t), D === null && cn(t);
		}
		e.wv = zr(), Kn = null, qn = 0, Zn(e, _, n), Kn = null, nn() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? Pr([e]) : Y.push(e)), !r.is_fork && Un.size > 0 && !Wn && Yn();
	}
	return t;
}
function Yn() {
	Wn = !1;
	for (let e of Un) {
		e.f & 1024 && w(e, it);
		let t;
		try {
			t = Br(e);
		} catch {
			t = !0;
		}
		t && Kr(e);
	}
	Un.clear();
}
function Xn(e) {
	j(e, e.v + 1);
}
function Zn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = nn(), a = r.length;
		if (qn += a, qn > 1e5 && Kn === null && (Kn = /* @__PURE__ */ new Set()), Kn !== null) {
			if (Kn.has(e)) return;
			Kn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & _) === 0;
				if (l && w(s, t), c & 131072) Un.add(s);
				else if (c & 2) {
					var u = s;
					D?.delete(u), Zn(u, it, n);
				} else if (l) {
					var d = s;
					c & 16 && O !== null && O.add(d), n === null ? Bn(d) : n.push(d);
				}
			}
		}
	}
}
function Qn(e) {
	if (typeof e != "object" || !e || ht in e || gt in e) return e;
	let t = Qe(e);
	if (t !== Xe && t !== Ze) return e;
	var n = /* @__PURE__ */ new Map(), r = Ue(e), i = /* @__PURE__ */ A(0), a = null, o = Lr, s = (e) => {
		if (Lr === o) return e();
		var t = V, n = Lr;
		U(null), Rr(o);
		var r = e();
		return U(t), Rr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ A(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || Vt();
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
					n.set(t, e), Xn(i);
				}
			} else j(r, h), Xn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === ht) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || Je(t, r)?.writable) && (o = s(() => /* @__PURE__ */ A(Qn(c ? t[r] : h), a)), n.set(r, o)), o !== void 0) {
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
			if (t === ht) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== h || Reflect.has(e, t);
			return (r !== void 0 || (W !== null || V !== null) && (!i || Je(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ A(i ? Qn(e[t]) : h, a)), n.set(t, r)), X(r) === h) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ A(h, a)), n.set(d + "", f)) : j(f, h);
			}
			if (l === void 0) (!u || Je(e, t)?.writable) && (l = s(() => /* @__PURE__ */ A(void 0, a)), j(l, Qn(o)), n.set(t, l));
			else {
				u = l.v !== h;
				var p = s(() => Qn(o));
				j(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var ee = n.get("length"), te = Number(t);
					Number.isInteger(te) && te >= ee.v && j(ee, te + 1);
				}
				Xn(i);
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
			Ht();
		}
	});
}
var $n, er, tr, nr;
function rr() {
	if ($n === void 0) {
		$n = window, er = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		tr = Je(t, "firstChild").get, nr = Je(t, "nextSibling").get, $e(e) && (e[bt] = void 0, e[yt] = null, e[xt] = void 0, e.__e = void 0), $e(n) && (n[St] = void 0);
	}
}
function M(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function N(e) {
	return tr.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ir(e) {
	return nr.call(e);
}
function P(e, t) {
	if (!v) return /* @__PURE__ */ N(e);
	var n = /* @__PURE__ */ N(y);
	if (n === null) n = y.appendChild(M());
	else if (t && n.nodeType !== 3) {
		var r = M();
		return n?.before(r), b(r), r;
	}
	return t && cr(n), b(n), n;
}
function ar(e, t = !1) {
	if (!v) {
		var n = /* @__PURE__ */ N(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ir(n) : n;
	}
	if (t) {
		if (y?.nodeType !== 3) {
			var r = M();
			return y?.before(r), b(r), r;
		}
		cr(y);
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
	for (var i; t--;) i = r, r = /* @__PURE__ */ ir(r);
	if (!v) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = M();
			return r === null ? i?.after(a) : r.before(a), b(a), a;
		}
		cr(r);
	}
	return b(r), r;
}
function or() {
	return !1;
}
function sr(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function cr(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function lr(e) {
	var t = W;
	if (t === null) return V.f |= mt, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	L(e, t);
}
function L(e, t) {
	if (e === Ve) throw e;
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/effects.js
function ur(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function R(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= at);
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
	if (e & 4) Mn === null ? In.ensure().schedule(r) : Mn.push(r);
	else if (t !== null) {
		try {
			Kr(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= lt));
	}
	if (i !== null && (i.parent = n, n !== null && ur(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function dr() {
	return V !== null && !H;
}
function fr(e) {
	let t = R(8, null);
	return w(t, g), t.teardown = e, t;
}
function pr(e) {
	return R(4 | dt, e);
}
function mr(e) {
	In.ensure();
	let t = R(64 | ut, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Tr(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function hr(e) {
	return R(4, e);
}
function gr(e) {
	return R(pt | ut, e);
}
function _r(e, t = 0) {
	return R(8 | t, e);
}
function vr(e, t = [], n = [], r = []) {
	mn(r, t, n, (t) => {
		R(8, () => {
			e(...t.map(X));
		});
	});
}
function yr(e, t = 0) {
	return R(16 | t, e);
}
function z(e) {
	return R(32 | ut, e);
}
function br(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = jr, r = V;
		Mr(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			L(t, e.parent);
		} finally {
			Mr(n), U(r);
		}
	}
}
function xr(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && fn(() => {
			e.abort(wt);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Sr(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Cr(e.nodes.start, e.nodes.end), n = !0), e.f |= ct, xr(e, t && !n), Gr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	br(e), e.f ^= ct, e.f |= ot;
	var i = e.parent;
	i !== null && i.first !== null && wr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Cr(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ ir(e);
		e.remove(), e = n;
	}
}
function wr(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Tr(e, t, n = !0) {
	var r = [];
	e.f |= 256, Er(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Er(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= at;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Er(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Dr(e) {
	e.f &= -257, Or(e, !0);
}
function Or(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= at, e.f & 1024 || (w(e, _), In.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Or(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function kr(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ ir(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/legacy.js
var Ar = null, jr = !1;
function Mr(e) {
	jr = e;
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
function Nr(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function Pr(e) {
	Y = e;
}
var Fr = 1, Ir = 0, Lr = Ir;
function Rr(e) {
	Lr = e;
}
function zr() {
	return ++Fr;
}
function Br(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Br(a) && wn(a), a.wv > e.wv) return !0;
		}
		t & 512 && D === null && w(e, g);
	}
	return !1;
}
function Vr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Vr(a, t, !1) : t === a && (n ? w(a, _) : a.f & 1024 && w(a, it), Bn(a));
	}
}
function Hr(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = S, s = H, c = Lr, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Jt(e.ctx), H = !1, Lr = ++Ir, e.ac !== null && (fn(() => {
		e.ac.abort(wt);
	}), e.ac = null);
	try {
		e.f |= ft;
		var u = e.fn, d = u();
		e.f |= st;
		var f = Ur(e);
		if (nn() && Y !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < Y.length; p++) Vr(Y[p], e);
		if (i !== null && i !== e) {
			if (Ir++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Ir;
			if (t !== null) for (let e of t) e.rv = Ir;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= mt), d;
	} catch (t) {
		return Ur(e), lr(t);
	} finally {
		e.f ^= ft, q = t, J = n, Y = r, V = i, K = a, Jt(o), H = s, Lr = c;
	}
}
function Ur(e) {
	var t = e.deps, n = E?.is_fork;
	if (q !== null) {
		var r;
		if (n || Gr(e, J), t !== null && J > 0) for (t.length = J + q.length, r = 0; r < q.length; r++) t[J + r] = q[r];
		else e.deps = t = q;
		if (dr() && e.f & 512) for (r = J; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && J < t.length && (Gr(e, J), t.length = J);
	return t;
}
function Wr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = We.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (q === null || !Ge.call(q, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== h && cn(a), a.ac !== null && fn(() => {
			a.ac.abort(wt), a.ac = null, w(a, _);
		}), Tn(a), Gr(a, 0);
	}
}
function Gr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Wr(e, n[r]);
}
function Kr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		w(e, g);
		var n = W;
		W = e;
		try {
			t & 16777232 ? Sr(e) : xr(e), br(e);
			var r = Hr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Fr;
		} finally {
			W = n;
		}
	}
}
async function qr() {
	await Promise.resolve(), Ln();
}
function X(e) {
	var t = !!(e.f & 2);
	if (Ar?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < Ir && (e.rv = Ir, q === null && n !== null && n[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], Ge.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : Ge.call(r, V) || r.push(V);
		}
	}
	if (jr && k.has(e)) return k.get(e);
	if (t) {
		var i = e;
		if (jr) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Yr(i)) && (a = Cn(i)), k.set(i, a), a;
		}
		var o = !(i.f & 512) && !H && V !== null && !!(V.f & 512), s = (i.f & st) === 0;
		Br(i) && (o && (i.f |= 512), wn(i)), o && !s && (En(i), Jr(i));
	}
	if (D?.has(e)) return D.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Jr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : Ge.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (En(n), Jr(n));
	}
}
function Yr(e) {
	if (e.v === h) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (k.has(t) || t.f & 2 && Yr(t)) return !0;
	return !1;
}
function Xr(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/events.js
var Zr = Symbol("events"), Qr = /* @__PURE__ */ new Set(), $r = /* @__PURE__ */ new Set();
function ei(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || ai.call(t, e), !e.cancelBubble) return fn(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, C(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function ti(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = ei(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && fr(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function ni(e, t, n) {
	(t[Zr] ??= {})[e] = n;
}
function Z(e) {
	for (var t = 0; t < e.length; t++) Qr.add(e[t]);
	for (var n of $r) n(e);
}
var ri = null, ii = !1;
function ai(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	ri = e, ii || (ii = !0, setTimeout(() => {
		ii = !1, ri = null;
	}));
	var o = 0, s = ri === e && e[Zr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Zr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		qe(e, "currentTarget", {
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
					var m = a[Zr]?.[r];
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
			e[Zr] = t, delete e.currentTarget, U(u), G(d);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/reconciler.js
var oi = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function si(e) {
	return oi?.createHTML(e) ?? e;
}
function ci(e) {
	var t = sr("template");
	return t.innerHTML = si(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/template.js
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
function li(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (v) return Q(y, null), y;
		i === void 0 && (i = ci(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ N(i)));
		var t = r || er ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ N(t), s = t.lastChild;
			Q(o, s);
		} else Q(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ui(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (v) return Q(y, null), y;
		if (!o) {
			var e = /* @__PURE__ */ N(ci(a));
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
function di(e, t) {
	return /* @__PURE__ */ ui(e, t, "svg");
}
function fi() {
	if (v) return Q(y, null), y;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = M();
	return e.append(t, n), Q(t, n), e;
}
function pi(e, t) {
	if (v) {
		var n = W;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = y), At();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var mi = ["touchstart", "touchmove"];
function hi(e) {
	return mi.includes(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/create-subscriber.js
function gi(e) {
	let t = 0, n = Gn(0), r;
	return () => {
		dr() && (X(n), _r(() => (t === 0 && (r = Xr(() => e(() => Xn(n)))), t += 1, () => {
			C(() => {
				--t, t === 0 && (r?.(), r = void 0, Xn(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var _i = lt | ut;
function vi(e, t, n, r) {
	new yi(e, t, n, r);
}
var yi = class {
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
	#f = /* @__PURE__ */ new Map();
	#p = null;
	#m = gi(() => (this.#p = Gn(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = yr(() => {
			if (v) {
				let e = Nt(this.#t);
				At();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, _i), v && (this.#e = y);
	}
	#h() {
		try {
			this.#a = z(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#g(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#_(e);
		C(r), t && (this.#s = z(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? Ot() : (t = !0, n && Wt(), this.#s !== null && Tr(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#v()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					L(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#v() {
		return (this.#i.f & (ot | ct)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), C(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = M(), n = !1;
				e.append(t), this.#a = this.#S(() => {
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
				}), this.#a === null ? (this.#c = null, n && this.#x(E)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Tr(this.#o, () => {
					this.#o = null;
				}), this.#x(E));
			}
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				kr(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
			} else this.#x(E);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		ln(e, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = V, r = S;
		G(this.#i), U(this.#i), Jt(this.#i.ctx);
		try {
			return In.ensure(), e();
		} finally {
			G(t), U(n), Jt(r);
		}
	}
	#C(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Tr(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, C(() => {
			this.#d = !1, this.#p && Jn(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), X(this.#p);
	}
	error(e) {
		if (e === Ve || !this.#n.onerror && !this.#n.failed) throw e;
		E?.is_fork ? (this.#a && E.skip_effect(this.#a), this.#o && E.skip_effect(this.#o), this.#s && E.skip_effect(this.#s), E.oncommit(() => {
			this.#v() || this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), v && (b(this.#t), jt(), b(Mt()));
		let t = this.#n.failed, n = (e) => {
			if (this.#v()) return;
			let { reset: n, invoke_onerror: r } = this.#_(e);
			r(), t && !this.#v() && (this.#s = this.#S(() => {
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
			if (!this.#v()) {
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
	n !== (e[St] ??= e.nodeValue) && (e[St] = n, e.nodeValue = `${n}`);
}
function bi(e, t) {
	return Si(e, t);
}
var xi = /* @__PURE__ */ new Map();
function Si(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	rr();
	var c = void 0, l = mr(() => {
		var o = n ?? t.appendChild(M());
		vi(o, { pending: () => {} }, (t) => {
			$t({});
			var n = S;
			if (a && (n.c = a), i && (r.$$events = i), v && Q(t, null), c = e(t, r) || tn(), v && (W.nodes.end = y, y === null || y.nodeType !== 8 || y.data !== "]")) throw Dt(), Ve;
			en();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = hi(r);
					for (let e of [t, document]) {
						var a = xi.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), xi.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, ai, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u(Ke(Qr)), $r.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = xi.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, ai), r.delete(e), r.size === 0 && xi.delete(n)) : r.set(e, i);
			}
			$r.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return Ci.set(c, l), c;
}
var Ci = /* @__PURE__ */ new WeakMap();
function wi(e, t) {
	let n = Ci.get(e);
	return n ? (Ci.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ti = class {
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
			if (n) Dr(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Dr(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						kr(r, t), t.append(M()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Tr(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = E, r = or();
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/if.js
function Ei(e, t, n = !1) {
	var r;
	v && (r = y, At());
	var i = new Ti(e), a = n ? lt : 0;
	function o(e, t) {
		if (v) {
			var n = Nt(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Mt();
				b(a), i.anchor = a, kt(!1), i.ensure(e, t), kt(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	yr(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Di(e, t, n) {
	var r;
	v && (r = y, At());
	var i = new Ti(e);
	yr(() => {
		var e = t() ?? null;
		if (v && Nt(r) === "[" != (e !== null)) {
			var a = Mt();
			b(a), i.anchor = a, kt(!1), i.ensure(e, e && ((t) => n(t, e))), kt(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, lt);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Oi = Symbol("is custom element"), ki = Symbol("is html"), Ai = Tt ? "link" : "LINK";
function ji(e) {
	if (v) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Mi(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Mi(e, "checked", null), e.checked = r;
				}
			}
		};
		e[Ct] = n, C(n), dn();
	}
}
function Mi(e, t, n, r) {
	var i = Ni(e);
	if (!(v && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Ai))) {
		var a = i[t];
		a !== (i[t] = n) && (t === "loading" && (e[vt] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Fi(e).has(t) ? e[t] = n : (!v || typeof n != "number" && typeof n != "boolean" || a !== String(n)) && e.setAttribute(t, n));
	}
}
function Ni(e) {
	return e[yt] ??= {
		[Oi]: e.nodeName.includes("-"),
		[ki]: e.namespaceURI === He
	};
}
var Pi = /* @__PURE__ */ new Map();
function Fi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Pi.get(t);
	if (n) return n;
	Pi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = Ye(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = Qe(i);
	}
	return n;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ii(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	pn(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Li(e) ? Ri(a) : a, n(a), E !== null && r.add(E), await qr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (v && e.defaultValue !== e.value || Xr(t) == null && e.value) && (n(Li(e) ? Ri(e.value) : e.value), E !== null && r.add(E)), _r(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = E;
			if (r.has(i)) return;
		}
		Li(e) && n === Ri(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Li(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ri(e) {
	return e === "" ? null : +e;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function zi(e, t) {
	return e === t || e?.[ht] === t;
}
function Bi(e = tn(), t, n, r) {
	var i = S.r, a = W;
	return hr(() => {
		var o, s;
		return _r(() => {
			o = s, s = r?.() || [], Xr(() => {
				zi(n(...s), e) || (t(e, ...s), o && zi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && zi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/utils.js
function Vi(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), tt;
	let r = Xr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/shared/index.js
var Hi = [];
function Ui(e, t = tt) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ft(e, t) && (e = t, n)) {
			let t = !Hi.length;
			for (let t of r) t[1](), Hi.push(t, e);
			if (t) {
				for (let e = 0; e < Hi.length; e += 2) Hi[e][0](Hi[e + 1]);
				Hi.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = tt) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || tt), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Wi(e) {
	let t;
	return Vi(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/props.js
var Gi = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (et(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			et(i) && (i = i());
			let a = Je(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (et(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = Je(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === ht || t === _t) return !1;
		for (let n of e.props) if (et(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (et(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function Ki(...e) {
	return new Proxy({ props: e }, Gi);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/index-client.js
function qi(e) {
	let t, n = gi((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return dr() ? (n(), t) : Wi(e);
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
// packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
Z(["input"]), Z(["change"]), Z(["change"]), gi((e) => {
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
]), Z(["change"]);
// packages/ui-kit/src/overlay/history-overlay.ts
var Ji = Symbol("overlay-lifecycle");
// packages/ui-kit/src/form/TimePicker.svelte
c.hapticFeedbackEnabled, Z(["click"]), Z(["click", "keydown"]), c.reduceMotionEnabled, Z(["pointerdown"]), Z(["keydown", "click"]), Z(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var Yi = /* @__PURE__ */ li("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function Xi(e, t) {
	$t(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = Yi(), i = P(r), a = F(i, !0), o = I(i, 2), s = F(o, !0);
	x(r), vr((e, t) => {
		$(a, e), $(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), ni("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), pi(e, r), en();
}
Z(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [Zi, Qi] = Yt();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Z(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var $i = /* @__PURE__ */ li("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function ea(e, t) {
	$t(t, !0), Zt(Ji, Xr(() => Wi(t.propsStore)).overlayParent);
	let n = /* @__PURE__ */ T(() => t.component), r = /* @__PURE__ */ T(() => qi(t.propsStore).current);
	var i = $i();
	vi(P(i), {
		onerror: (e) => {
			console.error("[MountableSvelteHost] render failed:", e), t.onFailure?.(e);
		},
		failed: (e, t = tt, n = tt) => {
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
		var t = fi();
		Di(ar(t), () => X(n), (e, t) => {
			t(e, Ki(() => X(r)));
		}), pi(e, t);
	}), x(i), pi(e, i), en();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ta(e) {
	return {
		[le]: !0,
		mount(t, n, r) {
			let i = !1, a = Ui({ ...n }), o = bi(ea, {
				target: t,
				context: /* @__PURE__ */ new Map(),
				props: {
					component: e,
					propsStore: a,
					onFailure: r ? (e) => queueMicrotask(() => {
						i || r.onError(e);
					}) : void 0
				}
			});
			return {
				update(e) {
					a.set({ ...e });
				},
				unmount: () => {
					i = !0, wi(o).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
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
	return !i && e.state.errorMessage && r.actions.notify(e.state.errorMessage, "error"), i;
}
// packages/plugins/source-cqut/src/CqutOnlineImportTab.svelte
var ia = /* @__PURE__ */ li("<div class=\"flex items-center gap-2 rounded-inset bg-error-container/40 p-3 text-error\"><span class=\"text-body-small\"> </span></div>"), aa = /* @__PURE__ */ di("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"size-5\"><path d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"></path></svg>"), oa = /* @__PURE__ */ di("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"size-5\"><path d=\"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z\"></path></svg>"), sa = /* @__PURE__ */ li("<div class=\"ui-section-surface ui-section-surface--comfortable\"><form class=\"flex flex-col gap-4\"><!> <div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p> <p class=\"text-body-small text-supporting mt-1 text-on-surface-variant/80\"> </p></div> <div class=\"flex flex-col gap-3\"><div class=\"ui-form-field\"><label class=\"ui-field-label\" for=\"import-account\"> </label> <input id=\"import-account\" name=\"username\" required=\"\" class=\"ui-form-field-input\" type=\"text\" inputmode=\"numeric\" autocomplete=\"username\" autocapitalize=\"none\" autocorrect=\"off\" enterkeyhint=\"next\"/></div> <div class=\"ui-form-field\"><label class=\"ui-field-label\" for=\"import-password\"> </label> <div class=\"ui-form-field-input-row\"><input id=\"import-password\" name=\"password\" required=\"\" class=\"ui-form-field-input\" autocomplete=\"current-password\" autocapitalize=\"none\" autocorrect=\"off\" enterkeyhint=\"done\"/> <button type=\"button\" class=\"ui-row-state flex size-11 shrink-0 items-center justify-center rounded-control text-on-surface-variant transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand\"><!></button></div></div></div> <div class=\"flex w-full pt-1\"><button type=\"submit\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button></div></form></div>");
function ca(e, t) {
	$t(t, !0);
	let n = /* @__PURE__ */ A(!1), r = /* @__PURE__ */ A(""), i = /* @__PURE__ */ A(""), a = /* @__PURE__ */ A(!1), o = /* @__PURE__ */ A(Qn(typeof navigator < "u" ? navigator.onLine : !0));
	function s() {
		j(o, !0);
	}
	function c() {
		j(o, !1);
	}
	function l(e) {
		return na(t.controller, "source-cqut", Ce, e);
	}
	let u = /* @__PURE__ */ T(() => l("import.online.offline")), d = /* @__PURE__ */ T(() => l("import.online.tab.title")), f = /* @__PURE__ */ T(() => l("import.online.intro")), p = /* @__PURE__ */ T(() => l("import.online.attribution")), m = /* @__PURE__ */ T(() => l("import.online.accountLabel")), ee = /* @__PURE__ */ T(() => l("import.online.field.password.title")), te = /* @__PURE__ */ T(() => l(X(a) ? "import.online.password.hide" : "import.online.password.show")), ne = /* @__PURE__ */ T(() => l(X(n) ? "import.online.submit.loading" : "import.online.submit")), re = /* @__PURE__ */ T(() => X(n) || !X(o));
	async function ie() {
		if (!X(re)) {
			j(n, !0);
			try {
				await ra(t.transfer, "cqut-online", {
					username: X(r),
					password: X(i)
				}, t.context) && t.onContinue();
			} finally {
				j(n, !1);
			}
		}
	}
	var ae = sa();
	ti("online", $n, s), ti("offline", $n, c);
	var oe = P(ae), se = P(oe), ce = (e) => {
		var t = ia(), n = F(P(t), !0);
		x(t), vr(() => $(n, X(u))), pi(e, t);
	};
	Ei(se, (e) => {
		X(o) || e(ce);
	});
	var le = I(se, 2), ue = P(le), de = F(ue, !0), fe = I(ue, 2), pe = F(fe, !0), me = F(I(fe, 2), !0);
	x(le);
	var he = I(le, 2), ge = P(he), _e = P(ge), ve = F(_e, !0), ye = I(_e, 2);
	ji(ye), Mi(ye, "spellcheck", !1), x(ge);
	var be = I(ge, 2), xe = P(be), Se = F(xe, !0), we = I(xe, 2), Te = P(we);
	ji(Te), Mi(Te, "spellcheck", !1);
	var Ee = I(Te, 2), De = P(Ee), Oe = (e) => {
		pi(e, aa());
	}, ke = (e) => {
		pi(e, oa());
	};
	Ei(De, (e) => {
		X(a) ? e(Oe) : e(ke, -1);
	}), x(Ee), x(we), x(be), x(he);
	var Ae = I(he, 2), je = P(Ae), Me = F(je, !0);
	x(Ae), x(oe), x(ae), vr(() => {
		$(de, X(d)), $(pe, X(f)), $(me, X(p)), $(ve, X(m)), $(Se, X(ee)), Mi(Te, "type", X(a) ? "text" : "password"), Mi(Ee, "aria-label", X(te)), je.disabled = X(re), $(Me, X(ne));
	}), ti("submit", oe, (e) => {
		e.preventDefault(), ie();
	}), Ii(ye, () => X(r), (e) => j(r, e)), Ii(Te, () => X(i), (e) => j(i, e)), ni("click", Ee, () => j(a, !X(a))), pi(e, ae), en();
}
Z(["click"]);
// packages/plugins/source-cqut/src/EduHtmlImportTab.svelte
var la = /* @__PURE__ */ li("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p></div> <input type=\"file\" accept=\".html,.htm,text/html\" class=\"hidden\"/> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-outlined ui-btn-block\"> </button></div></div></div>");
function ua(e, t) {
	$t(t, !0);
	let n = /* @__PURE__ */ A(void 0), r = /* @__PURE__ */ A(!1);
	function i(e) {
		return na(t.controller, "source-cqut", Ce, e);
	}
	let a = /* @__PURE__ */ T(() => i("import.html.tab.title")), o = /* @__PURE__ */ T(() => i("import.html.intro")), s = /* @__PURE__ */ T(() => i(X(r) ? "import.html.submit.loading" : "import.html.submit"));
	async function c(e) {
		let n = e.currentTarget, i = n.files?.[0];
		if (i) {
			j(r, !0);
			try {
				let e = await i.text();
				await ra(t.transfer, "edu-html", { file: e }, t.context) && t.onContinue();
			} finally {
				j(r, !1), n.value = "";
			}
		}
	}
	var l = la(), u = P(l), d = P(u), f = P(d), p = F(f, !0), m = F(I(f, 2), !0);
	x(d);
	var ee = I(d, 2);
	Bi(ee, (e) => j(n, e), () => X(n));
	var te = I(ee, 2), ne = P(te), re = F(ne, !0);
	x(te), x(u), x(l), vr(() => {
		$(p, X(a)), $(m, X(o)), ne.disabled = X(r), $(re, X(s));
	}), ni("change", ee, c), ni("click", ne, () => X(n)?.click()), pi(e, l), en();
}
Z(["change", "click"]);
// packages/plugins/source-cqut/src/index.ts
function da(e = {}) {
	let { onlineComponent: t = ta(ca), htmlComponent: n = ta(ua) } = e;
	return he({
		id: "source-cqut",
		messages: Ce,
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
			Be({
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
