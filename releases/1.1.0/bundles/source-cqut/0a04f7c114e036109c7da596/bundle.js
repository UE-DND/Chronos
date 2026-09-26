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
//#endregion
//#region packages/core/src/domain/course.ts
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
//#endregion
//#region packages/core/src/domain/preferences.ts
var c = {
	currentTimetableId: "chronos_preferences:current_timetable_id",
	themeMode: "chronos_preferences:theme_mode",
	timetableLayoutMode: "chronos_preferences:timetable_layout_mode",
	wallpaperSource: "chronos_preferences:wallpaper_source",
	wallpaperColorEnabled: "chronos_preferences:wallpaper_color_enabled",
	wallpaperMaskEnabled: "chronos_preferences:wallpaper_mask_enabled",
	capsuleCornerStyle: "chronos_preferences:capsule_corner_style",
	hapticFeedbackEnabled: "chronos_preferences:haptic_feedback_enabled",
	reduceMotionEnabled: "chronos_preferences:reduce_motion_enabled",
	currentPeriodHighlightEnabled: "chronos_preferences:current_period_highlight_enabled",
	visualThemeId: "chronos_preferences:visual_theme_id",
	locale: "chronos_preferences:locale"
};
//#endregion
//#region packages/core/src/algorithms/date.ts
function l(e) {
	let t = e.trim(), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
	if (!n) throw Error(`Invalid ISO date: ${e}`);
	let [, r, i, a] = n;
	return new Date(Date.UTC(Number(r), Number(i) - 1, Number(a), 12));
}
function u(e) {
	return `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
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
function h(e, t) {
	return e.getTime() < t.getTime();
}
function ee(e) {
	return u(d(l(e)));
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var te = class {
	normalizeTermStartDate(e, t) {
		let n = l(ee(t));
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
		if (h(i, r)) return n.startWeek;
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
.2126 * ne(15 / 255) + .7152 * ne(23 / 255) + .0722 * ne(42 / 255);
function ne(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/schema/schema-types.ts
function re(e) {
	return e;
}
//#endregion
//#region packages/core/src/types/services.ts
function ie(e) {
	return { key: e };
}
var ae = ie("http");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function oe(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/slots.ts
var g = class extends Error {
	kind;
	constructor(e, t) {
		super(t), this.name = "ImportSlotError", this.kind = e;
	}
}, se = Symbol.for("chronos.mountable");
//#endregion
//#region packages/core/src/types/plugin-server.ts
function ce(e, t) {
	return {
		ok: !1,
		error: {
			kind: e,
			message: t
		}
	};
}
function le(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.kind == "string" && typeof t.message == "string";
}
function ue(e) {
	if (!e || typeof e != "object") return ce("DataFormat", "Invalid plugin server response");
	let t = e;
	return t.ok === !0 ? {
		ok: !0,
		payload: t.payload
	} : t.ok === !1 && le(t.error) ? {
		ok: !1,
		error: t.error
	} : ce("DataFormat", "Invalid plugin server response");
}
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function de(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function fe() {
	return "1.1.0";
}
function pe(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? de(e.messages, e.nameKey),
		version: e.version ?? fe(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? de(e.messages, e.descriptionKey) : void 0,
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
//#endregion
//#region packages/core/src/plugin/call-plugin-server.ts
async function me(e, t, n, r) {
	if (!e.proxy) throw Error("HTTP proxy is not supported in this environment");
	return e.proxy(t, n, r);
}
async function he(e, t, n, r) {
	let i = await me(e, t, n, r), a = await i.json();
	return {
		response: i,
		body: i.ok ? {
			ok: !0,
			payload: a
		} : ue(a)
	};
}
//#endregion
//#region packages/core/src/plugin/register-import-tab.ts
function ge(e, t) {
	return e.registerSlot("import.source.tab", t);
}
var _e = "liangjiang", ve = {
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
//#endregion
//#region packages/plugins/source-cqut/src/messages.ts
function ye(e) {
	return re({
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
function be(e) {
	return re({ file: {
		type: "file",
		title: () => e("import.html.field.file.title"),
		description: () => e("import.html.field.file.description"),
		accept: ".html,.htm,text/html",
		required: !0
	} });
}
function xe(e) {
	return re({
		campusId: {
			type: "select",
			presentation: "radio",
			title: () => e("import.html.confirm.campusPeriodTitle"),
			description: () => e("import.html.confirm.campusPeriodHint"),
			default: _e,
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
var Se = {
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
function Ce(e, t, n = "import.online.error.authFailed") {
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
function we(e, t) {
	let n = e.trim();
	return n ? `${n}${t("timetable.studentSuffix")}` : t("timetable.defaultName");
}
//#endregion
//#region packages/plugins/source-cqut/src/week-parser.ts
function Te(e) {
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
//#endregion
//#region packages/plugins/source-cqut/src/html-dom-utils.ts
var Ee = /\s+/g;
function De(e) {
	return e.trim().replace(Ee, " ");
}
function Oe(e) {
	if (typeof DOMParser < "u") return new DOMParser().parseFromString(e, "text/html");
	throw Error("DOMParser is not available in current runtime");
}
function ke(e) {
	if (!e) return "";
	let t = "";
	for (let n = 0; n < e.childNodes.length; n += 1) {
		let r = e.childNodes[n];
		r.nodeType === 3 && (t += r.textContent ?? "");
	}
	return t;
}
//#endregion
//#region packages/plugins/source-cqut/src/html-parser.ts
var Ae = new te();
function je(e, t, n, r = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) {
	let i = t.campusId ?? "liangjiang", a = t.termStartDate?.trim() ?? "";
	if (!a) throw new g("invalid-data", n("import.html.error.termStartRequired"));
	let o = Ae.normalizeTermStartDate(a, r), s = ve[i].map((e) => ({ ...e }));
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
function Me(e, i) {
	let a = i?.t ?? ((e) => e), o = i?.customDocParser ? i.customDocParser(e) : Oe(e), c = o.querySelector("#kbgrid_table_0") ?? o.querySelector("table.timetable1") ?? o.querySelector("table[id*=\"kbgrid\"]");
	if (!c) throw new g("invalid-data", a("import.html.error.tableNotFound"));
	let l = c.querySelector(".timetable_title"), u = De(l?.querySelector("h6.pull-left")?.textContent ?? ""), d = De(ke(l)).replace(/的课表$/, ""), f = c.querySelectorAll("td.td_wrap[id]"), p = [];
	if (f.forEach((e) => {
		let [r, i] = (e.getAttribute("id") ?? "").split("-"), a = Number.parseInt(r ?? "", 10), o = Number.parseInt(i ?? "", 10);
		if (Number.isNaN(a) || Number.isNaN(o)) return;
		let s = Number.parseInt(e.getAttribute("rowspan") ?? "1", 10), c = o + (Number.isNaN(s) ? 1 : s) - 1;
		e.querySelectorAll(".timetable_con").forEach((e, r) => {
			let i = De(e.querySelector(".title")?.textContent ?? "");
			if (!i) return;
			let s = /* @__PURE__ */ new Map();
			e.querySelectorAll("p").forEach((e) => {
				let t = e.querySelector("[title]"), n = De(t?.getAttribute("title") ?? "");
				if (!n) return;
				let r = "";
				for (let n = 0; n < e.childNodes.length; n += 1) {
					let i = e.childNodes[n];
					i !== t && (r += i.textContent ?? "");
				}
				let i = De(r);
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
				weeks: Te(s.get("节/周") ?? "")
			}));
		});
	}), p.length === 0) throw new g("no-data", a("import.html.error.noCourses"));
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
			periodTimes: i?.campusId ? ve[i.campusId].map((e) => ({ ...e })) : []
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
//#endregion
//#region packages/plugins/source-cqut/src/cqut-schedule-parser.ts
function Ne(e) {
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
function Pe(e, i = "", a = _e, o = (e) => e) {
	let c = e.payload;
	if (!c || !Array.isArray(c.eventList)) throw Error("Invalid CQUT online schedule payload");
	let l = i ? we(i, o) : c.yearTerm || o("timetable.defaultName"), u = Ne(c), d = c.eventList.map((e, r) => {
		let i = Number(e.weekDay), a = Number(e.sessionStart);
		if (!i || Number.isNaN(a) || !e.eventName?.trim()) return null;
		let o = Number(e.sessionLast) || 1, s = e.sessionList?.length ? Math.max(...e.sessionList.map(Number).filter((e) => !Number.isNaN(e))) : -Infinity, c = Number.isFinite(s) ? s : a + o - 1, l = [...new Set((e.weekList || []).map((e) => Number(e)).filter((e) => !Number.isNaN(e)))].sort((e, t) => e - t), u = t(e.eventName.trim());
		return n({
			id: e.eventID?.trim() || `cqut-${i}-${a}-${c}-${r}`,
			name: u,
			teacher: e.memberName?.trim() ?? "",
			location: e.address?.trim() ?? "",
			dayOfWeek: i,
			startPeriod: a,
			endPeriod: Math.max(a, c),
			weeks: l,
			remark: e.remark?.trim() ?? ""
		});
	}).filter((e) => e !== null), f = e.campusId || a, p = e.campusPeriodTimes || ve, m = p[f] ?? ve.liangjiang, h = { "source-cqut": {
		campusId: f,
		campusPeriodTimes: p,
		studentId: i
	} }, ee = {
		termStartDate: u,
		startWeek: 1,
		endWeek: Math.max(20, ...d.flatMap((e) => e.weeks)),
		periodTimes: m
	};
	return s({
		id: `cqut_${i || Date.now()}`,
		name: l,
		courses: d,
		academicConfig: ee,
		viewPrefs: {
			...r(d),
			showNonCurrentWeekCourses: !1
		},
		importMetadata: {
			source: "cqut-online",
			campusId: f
		},
		customMetadata: h
	});
}
//#endregion
//#region packages/plugins/source-cqut/server/definition.ts
var Fe = {
	pluginId: "source-cqut",
	proxy: {
		action: "preview",
		domains: ["cqut.edu.cn"]
	}
};
//#endregion
//#region packages/plugins/source-cqut/src/cqut-import-tabs.ts
async function Ie(e, t, n, r) {
	let i = r ?? e, a = n.username?.trim(), o = n.password;
	if (!a || !o?.trim()) throw new g("unsupported", t("import.online.error.credentials"));
	i.actions.notify(t("import.online.notify.connecting"), "info");
	let s = i.service(ae);
	if (!s.proxy) throw new g("unsupported", t("import.online.error.proxyUnsupported"));
	let { response: c, body: l } = await he(s, Fe.pluginId, Fe.proxy.action, {
		account: a,
		password: o
	});
	if (!c.ok || !l.ok) throw new g("network", Ce(l, t));
	return Pe(l.payload, a, _e, t);
}
async function Le(e, t) {
	let n = t.file;
	if (!n || typeof n != "string") throw new g("no-data", e("import.html.error.invalidFile"));
	return Me(n, {
		campusId: _e,
		t: e
	});
}
function Re(e) {
	let { ctx: t, t: n, onlineComponent: r, htmlComponent: i } = e, a = ye(n), o = be(n), s = xe(n);
	t.service(ae).supportsPluginServer?.(Fe.pluginId, Fe.proxy.action) && ge(t, {
		id: "cqut-online",
		title: () => n("import.online.tab.title"),
		order: 10,
		importKind: "online",
		supportingText: () => n("import.online.tab.supporting"),
		component: r,
		inputSchema: a,
		executeImport: (e, r) => Ie(t, n, e, r)
	}), ge(t, {
		id: "edu-html",
		title: () => n("import.html.tab.title"),
		order: 30,
		importKind: "file",
		supportingText: () => n("import.html.tab.supporting"),
		component: i,
		inputSchema: o,
		confirmSchema: s,
		confirmDefaultInput: {
			campusId: _e,
			termStartDate: ""
		},
		validateConfirmInputs: (e) => e.termStartDate?.trim() ? null : n("import.html.error.termStartRequired"),
		finalizePreview: (e, t) => je(e, t, n),
		executeImport: (e) => Le(n, e)
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
var ze = {}, _ = Symbol("uninitialized"), Be = "http://www.w3.org/1999/xhtml", Ve = Array.isArray, He = Array.prototype.indexOf, Ue = Array.prototype.includes, We = Array.from, Ge = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, qe = Object.getOwnPropertyDescriptors, Je = Object.prototype, Ye = Array.prototype, Xe = Object.getPrototypeOf, Ze = Object.isExtensible;
function Qe(e) {
	return typeof e == "function";
}
var $e = () => {};
function et(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function tt() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var v = 1024, y = 2048, nt = 4096, rt = 8192, it = 16384, at = 32768, ot = 1 << 25, st = 65536, ct = 1 << 19, lt = 1 << 20, ut = 1 << 21, dt = 1 << 22, ft = 1 << 23, pt = Symbol("$state"), mt = Symbol("component"), ht = Symbol("legacy props"), gt = Symbol(""), _t = Symbol("attributes"), vt = Symbol("class"), yt = Symbol("style"), bt = Symbol("text"), xt = Symbol("form reset"), St = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Ct = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function wt() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Tt(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Et() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var b = !1;
function Dt(e) {
	b = e;
}
var x;
function S(e) {
	if (e === null) throw Tt(), ze;
	return x = e;
}
function Ot() {
	return S(/* @__PURE__ */ rr(x));
}
function C(e) {
	if (b) {
		if (/* @__PURE__ */ rr(x) !== null) throw Tt(), ze;
		x = e;
	}
}
function kt(e = 1) {
	if (b) {
		for (var t = e, n = x; t--;) n = /* @__PURE__ */ rr(n);
		x = n;
	}
}
function At(e = !0) {
	for (var t = 0, n = x;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ rr(n);
		e && n.remove(), n = i;
	}
}
function jt(e) {
	if (!e || e.nodeType !== 8) throw Tt(), ze;
	return e.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function Mt(e) {
	return e === this.v;
}
function Nt(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Pt(e) {
	return !Nt(e, this.v);
}
function Ft(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function It() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function Lt() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Rt() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function zt() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Bt() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Vt() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ht() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function Ut(e, t, n) {
	let r = {};
	return [
		() => (n(r) || It(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Wt(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Gt(e, t) {
	return e === null && Ft(t), e.c ??= new Map(Wt(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var w = null;
function Kt(e) {
	w = e;
}
function qt() {
	return Ut(Jt, Yt, Xt);
}
function Jt(e) {
	return Gt(w, "getContext").get(e);
}
function Yt(e, t) {
	return Gt(w, "setContext").set(e, t), t;
}
function Xt(e) {
	return Gt(w, "hasContext").has(e);
}
function Zt(e, t = !1, n) {
	w = {
		p: w,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: null
	};
}
function Qt(e) {
	var t = w, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) dr(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, w = t.p, $t(e);
}
function $t(e = {}) {
	return Ge(e, mt, { value: !0 }), e;
}
function en() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var tn = [];
function nn() {
	var e = tn;
	tn = [], et(e);
}
function T(e) {
	if (tn.length === 0 && !On) {
		var t = tn;
		queueMicrotask(() => {
			t === tn && nn();
		});
	}
	tn.push(e);
}
function rn() {
	for (; tn.length > 0;) nn();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var an = ~(y | nt | v);
function E(e, t) {
	e.f = e.f & an | t;
}
function on(e) {
	e.f & 512 || e.deps === null ? E(e, v) : E(e, nt);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function sn(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), E(e, v);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/misc.js
var cn = !1;
function ln() {
	cn || (cn = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[xt]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function un(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
function dn(e, t, n, r = n) {
	e.addEventListener(t, () => un(n));
	let i = e[xt];
	e[xt] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ln();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
function fn(e, t, n, r) {
	let i = en() ? gn : yn;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = pn(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			mn();
		}
	}
	var d = hn();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ vn(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mn();
	}) : f();
}
function pn() {
	var e = G, t = H, n = w, r = O;
	return function(i = !0) {
		K(e), W(t), Kt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mn(e = !0) {
	K(null), W(null), Kt(null), e && O?.deactivate();
}
function hn() {
	var e = G, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gn(e) {
	var t = 2 | y;
	return G !== null && (G.f |= ct), {
		ctx: w,
		deps: null,
		effects: null,
		equals: Mt,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: _,
		wv: 0,
		parent: G,
		ac: null
	};
}
var _n = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function vn(e, t, n) {
	let r = G;
	r === null && Lt();
	var i = void 0, a = Un(_), o = !H, s = /* @__PURE__ */ new Set();
	return mr(() => {
		var t = G, n = tt();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== St && n.reject(e);
			}).finally(mn);
		} catch (e) {
			n.reject(e), mn();
		}
		var c = O;
		if (o) {
			if (t.f & 32768) var l = hn();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(_n);
			else for (let e of s.values()) e.reject(_n);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== _n && (c.activate(), t ? (a.f |= ft, Kn(a, t)) : (a.f & 8388608 && (a.f ^= ft), Kn(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), ur(() => {
		for (let e of s) e.reject(_n);
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
function D(e) {
	let t = /* @__PURE__ */ gn(e);
	return Mr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function yn(e) {
	let t = /* @__PURE__ */ gn(e);
	return t.equals = Pt, t;
}
function bn(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function xn(e) {
	var t, n = G, r = e.parent;
	if (!Ar && r !== null && e.v !== _ && r.f & 24576) return wt(), e.v;
	K(r);
	try {
		bn(e), t = Vr(e);
	} finally {
		K(n);
	}
	return t;
}
function Sn(e) {
	var t = xn(e);
	if (!e.equals(t) && (e.wv = Rr(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), En?.capture(e, t, !0)), e.deps === null))) {
		E(e, v);
		return;
	}
	Ar || (k === null ? on(e) : (lr() || O?.is_fork) && k.set(e, t));
}
function Cn(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && un(() => {
		t.ac.abort(St), t.ac = null;
	}), t.fn !== null && (t.teardown = $e), Wr(t, 0), yr(t));
}
function wn(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Gr(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var Tn = null, O = null, En = null, k = null, Dn = null, On = !1, kn = !1, An = null, jn = null, Mn = 0, Nn = 1, Pn = class e {
	id = Nn++;
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
		Tn === null ? Tn = this : (Tn.#n = this, this.#t = Tn), Tn = this;
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
			for (var r of n.d) E(r, y), t(r);
			for (r of n.m) E(r, nt), t(r);
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
					t.f ^= v;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), E(e, y), this.schedule(e);
		for (let e of this.#d) E(e, nt), this.schedule(e);
		this.apply();
		for (var t = An = [], n = [], r = jn = []; this.#c.length > 0;) {
			Mn++ > 1e3 && (this.#S(), In());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Bn(e), this.#h() || this.discard(), t;
			}
		}
		if (O = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (An = null, jn = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) zn(e, t);
			r.length > 0 && O.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), En = this, Ln(n), Ln(t), En = null, this.#s?.resolve();
		var o = O;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (j.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= v;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= v : i & 4 ? t.push(r) : zr(r) && (i & 16 && this.#d.add(r), Gr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), E(i, y), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), O = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) sn(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== _ && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), k?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		O = this;
	}
	deactivate() {
		O = null, k = null;
	}
	flush() {
		try {
			kn = !0, O = this, this.#_();
		} finally {
			Mn = 0, Dn = null, An = null, jn = null, kn = !1, O = null, k = null, j.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(_n);
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
		this.#m || (this.#m = !0, T(() => {
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
		return (this.#s ??= tt()).promise;
	}
	static ensure() {
		if (O === null) {
			let t = O = new e();
			!kn && !On && T(() => {
				t.#e || t.flush();
			});
		}
		return O;
	}
	apply() {
		k = null;
	}
	schedule(e) {
		if (Dn = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Tn = e : t.#t = e, this.linked = !1;
		}
	}
};
function Fn(e) {
	var t = On;
	On = !0;
	try {
		var n;
		for (e && (O !== null && !O.is_fork && O.flush(), n = e());;) {
			if (rn(), O === null) return n;
			O.flush();
		}
	} finally {
		On = t;
	}
}
function In() {
	try {
		Rt();
	} catch (e) {
		R(e, Dn);
	}
}
var A = null;
function Ln(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && zr(r) && (A = /* @__PURE__ */ new Set(), Gr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Sr(r), A?.size > 0)) {
				j.clear();
				for (let e of A) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) A.has(n) && (A.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Gr(n);
					}
				}
				A.clear();
			}
		}
		A = null;
	}
}
function Rn(e) {
	O.schedule(e);
}
function zn(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), E(e, v);
		for (var n = e.first; n !== null;) zn(n, t), n = n.next;
	}
}
function Bn(e) {
	E(e, v);
	for (var t = e.first; t !== null;) Bn(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Vn = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Map(), Hn = !1;
function Un(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Mt,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Un(e, t);
	return Mr(n), n;
}
function N(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && en() && H.f & 4325394 && (q === null || !q.has(e)) && Vt(), Kn(e, n ? Xn(t) : t, jn);
}
var Wn = null, Gn = 0;
function Kn(e, t, n = null) {
	if (!e.equals(t)) {
		Ar ? j.set(e, t) : j.has(e) || j.set(e, e.v);
		var r = Pn.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xn(t), k === null && on(t);
		}
		e.wv = Rr(), Wn = null, Gn = 0, Yn(e, y, n), Wn = null, en() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? Nr([e]) : X.push(e)), !r.is_fork && Vn.size > 0 && !Hn && qn();
	}
	return t;
}
function qn() {
	Hn = !1;
	for (let e of Vn) {
		e.f & 1024 && E(e, nt);
		let t;
		try {
			t = zr(e);
		} catch {
			t = !0;
		}
		t && Gr(e);
	}
	Vn.clear();
}
function Jn(e) {
	N(e, e.v + 1);
}
function Yn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = en(), a = r.length;
		if (Gn += a, Gn > 1e5 && Wn === null && (Wn = /* @__PURE__ */ new Set()), Wn !== null) {
			if (Wn.has(e)) return;
			Wn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & y) === 0;
				if (l && E(s, t), c & 131072) Vn.add(s);
				else if (c & 2) {
					var u = s;
					k?.delete(u), Yn(u, nt, n);
				} else if (l) {
					var d = s;
					c & 16 && A !== null && A.add(d), n === null ? Rn(d) : n.push(d);
				}
			}
		}
	}
}
function Xn(e) {
	if (typeof e != "object" || !e || pt in e || mt in e) return e;
	let t = Xe(e);
	if (t !== Je && t !== Ye) return e;
	var n = /* @__PURE__ */ new Map(), r = Ve(e), i = /* @__PURE__ */ M(0), a = null, o = Ir, s = (e) => {
		if (Ir === o) return e();
		var t = H, n = Ir;
		W(null), Lr(o);
		var r = e();
		return W(t), Lr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ M(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && zt();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ M(r.value, a);
				return n.set(t, e), e;
			}) : N(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ M(_, a));
					n.set(t, e), Jn(i);
				}
			} else N(r, _), Jn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === pt) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || Ke(t, r)?.writable) && (o = s(() => /* @__PURE__ */ M(Xn(c ? t[r] : _), a)), n.set(r, o)), o !== void 0) {
				var l = Z(o);
				return l === _ ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = Z(i);
				if (a === _) return;
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
			if (t === pt) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== _ || Reflect.has(e, t);
			return (r !== void 0 || G !== null && (!i || Ke(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ M(i ? Xn(e[t]) : _, a)), n.set(t, r)), Z(r) === _) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ M(_, a)), n.set(d + "", f)) : N(f, _);
			}
			if (l === void 0) (!u || Ke(e, t)?.writable) && (l = s(() => /* @__PURE__ */ M(void 0, a)), N(l, Xn(o)), n.set(t, l));
			else {
				u = l.v !== _;
				var p = s(() => Xn(o));
				N(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), ee = Number(t);
					Number.isInteger(ee) && ee >= h.v && N(h, ee + 1);
				}
				Jn(i);
			}
			return !0;
		},
		ownKeys(e) {
			Z(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== _;
			});
			for (var [r, a] of n) a.v !== _ && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Bt();
		}
	});
}
var Zn, Qn, $n, er;
function tr() {
	if (Zn === void 0) {
		Zn = window, Qn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		$n = Ke(t, "firstChild").get, er = Ke(t, "nextSibling").get, Ze(e) && (e[vt] = void 0, e[_t] = null, e[yt] = void 0, e.__e = void 0), Ze(n) && (n[bt] = void 0);
	}
}
function nr(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function P(e) {
	return $n.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function rr(e) {
	return er.call(e);
}
function F(e, t) {
	if (!b) return /* @__PURE__ */ P(e);
	var n = /* @__PURE__ */ P(x);
	if (n === null) n = x.appendChild(nr());
	else if (t && n.nodeType !== 3) {
		var r = nr();
		return n?.before(r), S(r), r;
	}
	return t && or(n), S(n), n;
}
function I(e, t = !1) {
	if (!b) return /* @__PURE__ */ P(e);
	var n = F(e, t);
	return C(e), n;
}
function L(e, t = 1, n = !1) {
	let r = b ? x : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ rr(r);
	if (!b) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = nr();
			return r === null ? i?.after(a) : r.before(a), S(a), a;
		}
		or(r);
	}
	return S(r), r;
}
function ir() {
	return !1;
}
function ar(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function or(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function sr(e) {
	var t = G;
	if (t === null) return H.f |= ft, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	R(e, t);
}
function R(e, t) {
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/effects.js
function cr(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = G;
	n !== null && n.f & 8192 && (e |= rt);
	var r = {
		ctx: w,
		deps: null,
		nodes: null,
		f: e | y | 512,
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
	O?.register_created_effect(r);
	var i = r;
	if (e & 4) An === null ? Pn.ensure().schedule(r) : An.push(r);
	else if (t !== null) {
		try {
			Gr(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= st));
	}
	if (i !== null && (i.parent = n, n !== null && cr(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function lr() {
	return H !== null && !U;
}
function ur(e) {
	let t = z(8, null);
	return E(t, v), t.teardown = e, t;
}
function dr(e) {
	return z(4 | lt, e);
}
function fr(e) {
	Pn.ensure();
	let t = z(64 | ct, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Cr(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function pr(e) {
	return z(4, e);
}
function mr(e) {
	return z(dt | ct, e);
}
function hr(e, t = 0) {
	return z(8 | t, e);
}
function gr(e, t = [], n = [], r = []) {
	fn(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(Z));
		});
	});
}
function _r(e, t = 0) {
	return z(16 | t, e);
}
function B(e) {
	return z(32 | ct, e);
}
function vr(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Ar, r = H;
		jr(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			jr(n), W(r);
		}
	}
}
function yr(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && un(() => {
			e.abort(St);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function br(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (xr(e.nodes.start, e.nodes.end), n = !0), e.f |= ot, yr(e, t && !n), Wr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	vr(e), e.f ^= ot, e.f |= it;
	var i = e.parent;
	i !== null && i.first !== null && Sr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function xr(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ rr(e);
		e.remove(), e = n;
	}
}
function Sr(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Cr(e, t, n = !0) {
	var r = [];
	e.f |= 256, wr(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function wr(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= rt;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				wr(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Tr(e) {
	e.f &= -257, Er(e, !0);
}
function Er(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= rt, e.f & 1024 || (E(e, y), Pn.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Er(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Dr(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ rr(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Or = null, kr = !1, Ar = !1;
function jr(e) {
	Ar = e;
}
var H = null, U = !1;
function W(e) {
	H = e;
}
var G = null;
function K(e) {
	G = e;
}
var q = null;
function Mr(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function Nr(e) {
	X = e;
}
var Pr = 1, Fr = 0, Ir = Fr;
function Lr(e) {
	Ir = e;
}
function Rr() {
	return ++Pr;
}
function zr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (zr(a) && Sn(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && E(e, v);
	}
	return !1;
}
function Br(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Br(a, t, !1) : t === a && (n ? E(a, y) : a.f & 1024 && E(a, nt), Rn(a));
	}
}
function Vr(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = w, s = U, c = Ir, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Kt(e.ctx), U = !1, Ir = ++Fr, e.ac !== null && (un(() => {
		e.ac.abort(St);
	}), e.ac = null);
	try {
		e.f |= ut;
		var u = e.fn, d = u();
		e.f |= at;
		var f = Hr(e);
		if (en() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Br(X[p], e);
		if (i !== null && i !== e) {
			if (Fr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Fr;
			if (t !== null) for (let e of t) e.rv = Fr;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= ft), d;
	} catch (t) {
		return Hr(e), sr(t);
	} finally {
		e.f ^= ut, J = t, Y = n, X = r, H = i, q = a, Kt(o), U = s, Ir = c;
	}
}
function Hr(e) {
	var t = e.deps, n = O?.is_fork;
	if (J !== null) {
		var r;
		if (n || Wr(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (lr() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Wr(e, Y), t.length = Y);
	return t;
}
function Ur(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = He.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (J === null || !Ue.call(J, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== _ && on(a), a.ac !== null && un(() => {
			a.ac.abort(St), a.ac = null, E(a, y);
		}), Cn(a), Wr(a, 0);
	}
}
function Wr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Ur(e, n[r]);
}
function Gr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		E(e, v);
		var n = G, r = kr;
		G = e, kr = !(t & 96);
		try {
			t & 16777232 ? br(e) : yr(e), vr(e);
			var i = Vr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Pr;
		} finally {
			kr = r, G = n;
		}
	}
}
async function Kr() {
	await Promise.resolve(), Fn();
}
function Z(e) {
	var t = !!(e.f & 2);
	if (Or?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Fr && (e.rv = Fr, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], Ue.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : Ue.call(r, H) || r.push(H);
		}
	}
	if (Ar && j.has(e)) return j.get(e);
	if (t) {
		var i = e;
		if (Ar) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Jr(i)) && (a = xn(i)), j.set(i, a), a;
		}
		var o = !(i.f & 512) && !U && H !== null && (kr || !!(H.f & 512)), s = (i.f & at) === 0;
		zr(i) && (o && (i.f |= 512), Sn(i)), o && !s && (wn(i), qr(i));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function qr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wn(t), qr(t));
}
function Jr(e) {
	if (e.v === _) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (j.has(t) || t.f & 2 && Jr(t)) return !0;
	return !1;
}
function Yr(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
var Xr = Symbol("events"), Zr = /* @__PURE__ */ new Set(), Qr = /* @__PURE__ */ new Set();
function $r(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || ii.call(t, e), !e.cancelBubble) return un(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, T(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function ei(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = $r(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && ur(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function ti(e, t, n) {
	(t[Xr] ??= {})[e] = n;
}
function Q(e) {
	for (var t = 0; t < e.length; t++) Zr.add(e[t]);
	for (var n of Qr) n(e);
}
var ni = null, ri = !1;
function ii(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	ni = e, ri || (ri = !0, setTimeout(() => {
		ri = !1, ni = null;
	}));
	var o = 0, s = ni === e && e[Xr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Xr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		Ge(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = H, d = G;
		W(null), K(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[Xr]?.[r];
					m != null && (!a.disabled || e.target === a) && m.call(a, e);
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
			e[Xr] = t, delete e.currentTarget, W(u), K(d);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var ai = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function oi(e) {
	return ai?.createHTML(e) ?? e;
}
function si(e) {
	var t = ar("template");
	return t.innerHTML = oi(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function ci(e, t) {
	var n = G;
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
		if (b) return ci(x, null), x;
		i === void 0 && (i = si(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ P(i)));
		var t = r || Qn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ P(t), s = t.lastChild;
			ci(o, s);
		} else ci(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ui(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (b) return ci(x, null), x;
		if (!o) {
			var e = /* @__PURE__ */ P(si(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ P(e);) o.appendChild(/* @__PURE__ */ P(e));
			else o = /* @__PURE__ */ P(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ P(t), r = t.lastChild;
			ci(n, r);
		} else ci(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function di(e, t) {
	return /* @__PURE__ */ ui(e, t, "svg");
}
function fi(e, t) {
	if (b) {
		var n = G;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = x), Ot();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var pi = ["touchstart", "touchmove"];
function mi(e) {
	return pi.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function hi(e) {
	let t = 0, n = Un(0), r;
	return () => {
		lr() && (Z(n), hr(() => (t === 0 && (r = Yr(() => e(() => Jn(n)))), t += 1, () => {
			T(() => {
				--t, t === 0 && (r?.(), r = void 0, Jn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var gi = st | ct;
function _i(e, t, n, r) {
	new vi(e, t, n, r);
}
var vi = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = b ? x : null;
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
	#h = hi(() => (this.#m = Un(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = _r(() => {
			if (b) {
				let e = this.#t;
				Ot();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, gi), b && (this.#e = x);
	}
	#g() {
		try {
			this.#a = B(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		T(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Et();
				return;
			}
			t = !0, n && Ht(), this.#s !== null && Cr(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					R(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), T(() => {
			var e = this.#c = document.createDocumentFragment(), t = nr(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return B(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						R(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(O);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Cr(this.#o, () => {
				this.#o = null;
			}), this.#x(O));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Dr(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(O);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		sn(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = w;
		K(this.#i), W(this.#i), Kt(this.#i.ctx);
		try {
			return Pn.ensure(), e();
		} finally {
			K(t), W(n), Kt(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Cr(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, T(() => {
			this.#d = !1, this.#m && Kn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		O?.is_fork ? (this.#a && O.skip_effect(this.#a), this.#o && O.skip_effect(this.#o), this.#s && O.skip_effect(this.#s), O.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), b && (S(this.#t), kt(), S(At()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		T(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				R(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => R(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function $(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[bt] ??= e.nodeValue) && (e[bt] = n, e.nodeValue = `${n}`);
}
function yi(e, t) {
	return xi(e, t);
}
var bi = /* @__PURE__ */ new Map();
function xi(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	tr();
	var c = void 0, l = fr(() => {
		var o = n ?? t.appendChild(nr());
		_i(o, { pending: () => {} }, (t) => {
			Zt({});
			var n = w;
			if (a && (n.c = a), i && (r.$$events = i), b && ci(t, null), c = e(t, r) || $t(), b && (G.nodes.end = x, x === null || x.nodeType !== 8 || x.data !== "]")) throw Tt(), ze;
			Qt();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = mi(r);
					for (let e of [t, document]) {
						var a = bi.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), bi.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, ii, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u(We(Zr)), Qr.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = bi.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, ii), r.delete(e), r.size === 0 && bi.delete(n)) : r.set(e, i);
			}
			Qr.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return Si.set(c, l), c;
}
var Si = /* @__PURE__ */ new WeakMap();
function Ci(e, t) {
	let n = Si.get(e);
	return n ? (Si.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var wi = class {
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
			if (n) Tr(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Tr(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (V(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Dr(r, t), t.append(nr()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Cr(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = O, r = ir();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = nr();
				i.append(a), this.#n.set(e, {
					effect: B(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, B(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else b && (this.anchor = x), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function Ti(e, t, n = !1) {
	var r;
	b && (r = x, Ot());
	var i = new wi(e), a = n ? st : 0;
	function o(e, t) {
		if (b) {
			var n = jt(r);
			if (e !== parseInt(n.substring(1))) {
				var a = At();
				S(a), i.anchor = a, Dt(!1), i.ensure(e, t), Dt(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	_r(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Ei(e, t, n) {
	var r;
	b && (r = x, Ot());
	var i = new wi(e);
	_r(() => {
		var e = t() ?? null;
		if (b && jt(r) === "[" != (e !== null)) {
			var a = At();
			S(a), i.anchor = a, Dt(!1), i.ensure(e, e && ((t) => n(t, e))), Dt(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, st);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Di = Symbol("is custom element"), Oi = Symbol("is html"), ki = Ct ? "link" : "LINK";
function Ai(e) {
	if (b) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					ji(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					ji(e, "checked", null), e.checked = r;
				}
			}
		};
		e[xt] = n, T(n), ln();
	}
}
function ji(e, t, n, r) {
	var i = Mi(e);
	b && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ki) || i[t] !== (i[t] = n) && (t === "loading" && (e[gt] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Pi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Mi(e) {
	return e[_t] ??= {
		[Di]: e.nodeName.includes("-"),
		[Oi]: e.namespaceURI === Be
	};
}
var Ni = /* @__PURE__ */ new Map();
function Pi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ni.get(t);
	if (n) return n;
	Ni.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = qe(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = Xe(i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	dn(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ii(e) ? Li(a) : a, n(a), O !== null && r.add(O), await Kr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (b && e.defaultValue !== e.value || Yr(t) == null && e.value) && (n(Ii(e) ? Li(e.value) : e.value), O !== null && r.add(O)), hr(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = O;
			if (r.has(i)) return;
		}
		Ii(e) && n === Li(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ii(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Li(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ri(e, t) {
	return e === t || e?.[pt] === t;
}
function zi(e = $t(), t, n, r) {
	var i = w.r, a = G;
	return pr(() => {
		var o, s;
		return hr(() => {
			o = s, s = r?.() || [], Yr(() => {
				Ri(n(...s), e) || (t(e, ...s), o && Ri(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ri(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function Bi(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), $e;
	let r = Yr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var Vi = [];
function Hi(e, t = $e) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Nt(e, t) && (e = t, n)) {
			let t = !Vi.length;
			for (let t of r) t[1](), Vi.push(t, e);
			if (t) {
				for (let e = 0; e < Vi.length; e += 2) Vi[e][0](Vi[e + 1]);
				Vi.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = $e) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || $e), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Ui(e) {
	let t;
	return Bi(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var Wi = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (Qe(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			Qe(i) && (i = i());
			let a = Ke(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (Qe(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = Ke(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === pt || t === ht) return !1;
		for (let n of e.props) if (Qe(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (Qe(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function Gi(...e) {
	return new Proxy({ props: e }, Wi);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/index-client.js
function Ki(e) {
	let t, n = hi((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return lr() ? (n(), t) : Ui(e);
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
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
Q(["input"]), Q(["change"]), Q(["change"]), Q(["change"]), Q([
	"click",
	"pointerdown",
	"pointerup"
]), Q(["change"]), c.hapticFeedbackEnabled, Q(["click"]), Q(["click"]), Q(["click", "keydown"]), c.reduceMotionEnabled, Q(["pointerdown"]), Q(["keydown", "click"]), Q(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [qi, Ji] = qt();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Q(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var Yi = /* @__PURE__ */ li("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function Xi(e, t) {
	Zt(t, !0);
	let n = /* @__PURE__ */ D(() => t.component), r = /* @__PURE__ */ D(() => Ki(t.propsStore).current);
	var i = Yi();
	Ei(F(i), () => Z(n), (e, t) => {
		t(e, Gi(() => Z(r)));
	}), C(i), fi(e, i), Qt();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Zi(e) {
	return {
		[se]: !0,
		mount(t, n, r) {
			let i = Hi({ ...n }), a = yi(Xi, {
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
					Ci(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function Qi(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return oe(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? oe(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/import-tab-props.ts
async function $i(e, t, n, r) {
	let i = await e.previewWithSlot(t, n);
	return !i && e.state.errorMessage && r?.notify(e.state.errorMessage, "error"), i;
}
//#endregion
//#region packages/plugins/source-cqut/src/CqutOnlineImportTab.svelte
var ea = /* @__PURE__ */ li("<div class=\"flex items-center gap-2 rounded-xl bg-error-container/40 p-3 text-error\"><span class=\"text-body-small\"> </span></div>"), ta = /* @__PURE__ */ di("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"size-5\"><path d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"></path></svg>"), na = /* @__PURE__ */ di("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" class=\"size-5\"><path d=\"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z\"></path></svg>"), ra = /* @__PURE__ */ li("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><!> <div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small mt-0.5 text-on-surface-variant\"> </p> <p class=\"text-body-small mt-1 text-on-surface-variant/80\"> </p></div> <div class=\"flex flex-col gap-3\"><div class=\"ui-form-field\"><label class=\"ui-field-label\" for=\"import-account\"> </label> <input id=\"import-account\" class=\"ui-form-field-input\" type=\"text\" inputmode=\"numeric\" autocomplete=\"username\"/></div> <div class=\"ui-form-field\"><label class=\"ui-field-label\" for=\"import-password\"> </label> <div class=\"ui-form-field-input-row\"><input id=\"import-password\" class=\"ui-form-field-input\" autocomplete=\"current-password\"/> <button type=\"button\" class=\"flex size-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant outline-none focus-visible:ring-2 focus-visible:ring-brand\"><!></button></div></div></div> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button></div></div></div>");
function ia(e, t) {
	Zt(t, !0);
	let n = /* @__PURE__ */ M(!1), r = /* @__PURE__ */ M(""), i = /* @__PURE__ */ M(""), a = /* @__PURE__ */ M(!1), o = /* @__PURE__ */ M(Xn(typeof navigator < "u" ? navigator.onLine : !0));
	function s() {
		N(o, !0);
	}
	function c() {
		N(o, !1);
	}
	function l(e) {
		return Qi(t.controller, "source-cqut", Se, e);
	}
	let u = /* @__PURE__ */ D(() => l("import.online.offline")), d = /* @__PURE__ */ D(() => l("import.online.tab.title")), f = /* @__PURE__ */ D(() => l("import.online.intro")), p = /* @__PURE__ */ D(() => l("import.online.attribution")), m = /* @__PURE__ */ D(() => l("import.online.accountLabel")), h = /* @__PURE__ */ D(() => l("import.online.field.password.title")), ee = /* @__PURE__ */ D(() => l(Z(a) ? "import.online.password.hide" : "import.online.password.show")), te = /* @__PURE__ */ D(() => l(Z(n) ? "import.online.submit.loading" : "import.online.submit")), ne = /* @__PURE__ */ D(() => Z(n) || !Z(o));
	async function re() {
		N(n, !0);
		try {
			await $i(t.transfer, "cqut-online", {
				username: Z(r),
				password: Z(i)
			}, t.controller) && t.onContinue();
		} finally {
			N(n, !1);
		}
	}
	var ie = ra();
	ei("online", Zn, s), ei("offline", Zn, c);
	var ae = F(ie), oe = F(ae), g = (e) => {
		var t = ea(), n = I(F(t), !0);
		C(t), gr(() => $(n, Z(u))), fi(e, t);
	};
	Ti(oe, (e) => {
		Z(o) || e(g);
	});
	var se = L(oe, 2), ce = F(se), le = I(ce, !0), ue = L(ce, 2), de = I(ue, !0), fe = I(L(ue, 2), !0);
	C(se);
	var pe = L(se, 2), me = F(pe), he = F(me), ge = I(he, !0), _e = L(he, 2);
	Ai(_e), C(me);
	var ve = L(me, 2), ye = F(ve), be = I(ye, !0), xe = L(ye, 2), Ce = F(xe);
	Ai(Ce);
	var we = L(Ce, 2), Te = F(we), Ee = (e) => {
		fi(e, ta());
	}, De = (e) => {
		fi(e, na());
	};
	Ti(Te, (e) => {
		Z(a) ? e(Ee) : e(De, -1);
	}), C(we), C(xe), C(ve), C(pe);
	var Oe = L(pe, 2), ke = F(Oe), Ae = I(ke, !0);
	C(Oe), C(ae), C(ie), gr(() => {
		$(le, Z(d)), $(de, Z(f)), $(fe, Z(p)), $(ge, Z(m)), $(be, Z(h)), ji(Ce, "type", Z(a) ? "text" : "password"), ji(we, "aria-label", Z(ee)), ke.disabled = Z(ne), $(Ae, Z(te));
	}), Fi(_e, () => Z(r), (e) => N(r, e)), Fi(Ce, () => Z(i), (e) => N(i, e)), ti("click", we, () => N(a, !Z(a))), ti("click", ke, re), fi(e, ie), Qt();
}
Q(["click"]);
//#endregion
//#region packages/plugins/source-cqut/src/EduHtmlImportTab.svelte
var aa = /* @__PURE__ */ li("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small mt-0.5 text-on-surface-variant\"> </p></div> <input type=\"file\" accept=\".html,.htm,text/html\" class=\"hidden\"/> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"text-label-large w-full rounded-full border border-outline bg-surface py-3 text-center font-medium text-on-surface disabled:opacity-50\"> </button></div></div></div>");
function oa(e, t) {
	Zt(t, !0);
	let n = /* @__PURE__ */ M(void 0), r = /* @__PURE__ */ M(!1);
	function i(e) {
		return Qi(t.controller, "source-cqut", Se, e);
	}
	let a = /* @__PURE__ */ D(() => i("import.html.tab.title")), o = /* @__PURE__ */ D(() => i("import.html.intro")), s = /* @__PURE__ */ D(() => i(Z(r) ? "import.html.submit.loading" : "import.html.submit"));
	async function c(e) {
		let n = e.currentTarget, i = n.files?.[0];
		if (i) {
			N(r, !0);
			try {
				let e = await i.text();
				await $i(t.transfer, "edu-html", { file: e }, t.controller) && t.onContinue();
			} finally {
				N(r, !1), n.value = "";
			}
		}
	}
	var l = aa(), u = F(l), d = F(u), f = F(d), p = I(f, !0), m = I(L(f, 2), !0);
	C(d);
	var h = L(d, 2);
	zi(h, (e) => N(n, e), () => Z(n));
	var ee = L(h, 2), te = F(ee), ne = I(te, !0);
	C(ee), C(u), C(l), gr(() => {
		$(p, Z(a)), $(m, Z(o)), te.disabled = Z(r), $(ne, Z(s));
	}), ti("change", h, c), ti("click", te, () => Z(n)?.click()), fi(e, l), Qt();
}
Q(["change", "click"]);
//#endregion
//#region packages/plugins/source-cqut/src/index.ts
function sa(e = {}) {
	let { onlineComponent: t = Zi(ia), htmlComponent: n = Zi(oa) } = e;
	return pe({
		id: "source-cqut",
		messages: Se,
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
			Re({
				ctx: e,
				t: r,
				onlineComponent: t,
				htmlComponent: n
			});
		}
	});
}
var ca = sa();
//#endregion
export { ca as default };
