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
//#region packages/core/src/domain/course-merge.ts
function n(e) {
	return `${e.name}|${e.teacher}|${e.location}|${e.dayOfWeek}|${e.startPeriod}|${e.endPeriod}|${e.remark ?? ""}`;
}
function r(e) {
	return [...e].sort((e, t) => e - t);
}
function i(e, t) {
	return e.length === 0 || t.length === 0 ? [] : r([.../* @__PURE__ */ new Set([...e, ...t])]);
}
function a(e, t) {
	let { startWeek: n, endWeek: r } = t, i = r - n + 1;
	return i <= 0 || e.length !== i ? !1 : e.every((e, t) => e === n + t);
}
function o(e, t) {
	return {
		...e,
		weeks: t,
		...e.customMetadata ? { customMetadata: { ...e.customMetadata } } : {}
	};
}
function s(e, t) {
	let s = /* @__PURE__ */ new Map(), c = [];
	for (let l of e) {
		let e = n(l), u = s.get(e);
		if (u === void 0) {
			s.set(e, c.length), c.push(o(l, r(l.weeks)));
			continue;
		}
		let d = c[u], f = i(d.weeks, l.weeks);
		c[u] = o(d, t && f.length > 0 && a(f, t) ? [] : f);
	}
	return c;
}
//#endregion
//#region packages/core/src/domain/timetable.ts
function c(e) {
	return {
		showSaturday: e.some((e) => e.dayOfWeek === 6),
		showSunday: e.some((e) => e.dayOfWeek === 7)
	};
}
var l = "未命名课表";
function u(e) {
	let t = e.trim().slice(0, 50);
	return t.length > 0 ? t : l;
}
//#endregion
//#region packages/core/src/domain/preferences.ts
var d = {
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
function f(e) {
	let t = e.trim(), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
	if (!n) throw Error(`Invalid ISO date: ${e}`);
	let [, r, i, a] = n;
	return new Date(Date.UTC(Number(r), Number(i) - 1, Number(a), 12));
}
function p(e) {
	return `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function m(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function h(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function g(e, t) {
	return h(e, t * 7);
}
function ee(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function te(e, t) {
	return e.getTime() < t.getTime();
}
function ne(e) {
	return p(m(f(e)));
}
function re(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var ie = class {
	normalizeTermStartDate(e, t) {
		let n = f(ne(t));
		if (!e || !e.trim()) return p(m(n));
		try {
			return p(m(f(e)));
		} catch {
			return p(m(this.inferTermStartDateFromTermName(e) || n));
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
		}, r = f(this.normalizeTermStartDate(n.termStartDate, e)), i = f(e);
		if (te(i, r)) return n.startWeek;
		let a = ee(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return p(g(f(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return p(h(f(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
.2126 * ae(15 / 255) + .7152 * ae(23 / 255) + .0722 * ae(42 / 255);
function ae(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/schema/schema-types.ts
function oe(e) {
	return e;
}
//#endregion
//#region packages/core/src/types/services.ts
function se(e) {
	return { key: e };
}
var ce = se("hostLinks");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function le(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/slots.ts
var ue = class extends Error {
	kind;
	constructor(e, t) {
		super(t), this.name = "ImportSlotError", this.kind = e;
	}
}, de = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function fe(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function pe() {
	return "1.1.1";
}
function me(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? fe(e.messages, e.nameKey),
		version: e.version ?? pe(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? fe(e.messages, e.descriptionKey) : void 0,
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
//#region packages/core/src/plugin/register-import-tab.ts
function he(e, t) {
	return e.registerSlot("import.source.tab", t);
}
//#endregion
//#region packages/plugins/codec-share/src/share-link/import-course-utils.ts
function ge(e) {
	return s(e).sort((e, t) => e.dayOfWeek === t.dayOfWeek ? e.startPeriod === t.startPeriod ? e.endPeriod - t.endPeriod : e.startPeriod - t.startPeriod : e.dayOfWeek - t.dayOfWeek);
}
//#endregion
//#region packages/plugins/codec-share/src/share-link/location-codec.ts
var _e = /^(.+?[楼馆])([A-Za-z]?\d[\w]*)$/;
function ve(e) {
	let t = e.trim();
	if (!t) return {
		kind: "full",
		value: ""
	};
	let n = _e.exec(t);
	return !n?.[1] || !n[2] ? {
		kind: "full",
		value: t
	} : {
		kind: "split",
		building: n[1],
		room: n[2].slice(0, 5)
	};
}
function ye(e) {
	return e.kind === "full" ? e.value : `${e.building}${e.room}`;
}
function be(e, t) {
	let n = e.trim().slice(0, 5);
	for (let e = 0; e < 5; e += 1) {
		let r = n.charCodeAt(e);
		t.push(e < n.length && r > 0 ? r : 32);
	}
}
function xe(e, t) {
	let n = "";
	for (let r = 0; r < 5; r += 1) {
		let i = e[t + r];
		i !== void 0 && i !== 32 && i !== 0 && (n += String.fromCharCode(i));
	}
	return n.trim();
}
function Se(e) {
	return e.trim().length === 0;
}
//#endregion
//#region packages/codec-kit/src/deflate.ts
async function Ce(e) {
	if (typeof CompressionStream > "u") {
		let t = await import(
			/* @vite-ignore */
			["node", "zlib"].join(":")
);
		return new Uint8Array(t.deflateRawSync(Buffer.from(e)));
	}
	let t = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new CompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
async function we(e) {
	if (typeof DecompressionStream > "u") {
		let t = await import(
			/* @vite-ignore */
			["node", "zlib"].join(":")
);
		return new Uint8Array(t.inflateRawSync(Buffer.from(e)));
	}
	let t = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new DecompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
//#endregion
//#region packages/codec-kit/src/base64.ts
var Te = 8192;
function Ee(e) {
	let t = "";
	for (let n = 0; n < e.length; n += Te) t += String.fromCharCode(...e.subarray(n, n + Te));
	return t;
}
function De(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n += 1) t[n] = e.charCodeAt(n);
	return t;
}
function Oe(e) {
	return btoa(Ee(e));
}
function ke(e) {
	return Oe(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function Ae(e) {
	return De(atob(e));
}
function je(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/");
	return Ae(t + "=".repeat((4 - t.length % 4) % 4));
}
//#endregion
//#region packages/codec-kit/src/crc32.ts
var Me = (() => {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t += 1) {
		let n = t;
		for (let e = 0; e < 8; e += 1) n = n & 1 ? n >>> 1 ^ 3988292384 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
})();
function Ne(e) {
	let t = 4294967295;
	for (let n of e) t = (Me[(t ^ n) & 255] ^ t >>> 8) >>> 0;
	return (t ^ 4294967295) >>> 0;
}
function Pe(e) {
	let t = Ne(e), n = new Uint8Array(e.length + 4);
	return n.set(e), n[e.length] = t & 255, n[e.length + 1] = t >>> 8 & 255, n[e.length + 2] = t >>> 16 & 255, n[e.length + 3] = t >>> 24 & 255, n;
}
function Fe(e) {
	if (e.length < 4) return null;
	let t = e.subarray(0, -4), n = e[e.length - 4] | e[e.length - 3] << 8 | e[e.length - 2] << 16 | e[e.length - 1] << 24;
	return Ne(t) === n >>> 0 ? t : null;
}
//#endregion
//#region packages/codec-kit/src/varint.ts
function Ie(e, t) {
	if (e < 0) throw RangeError("varint value must be non-negative");
	let n = e;
	do {
		let e = n & 127;
		n >>>= 7, n > 0 && (e |= 128), t.push(e);
	} while (n > 0);
}
var Le = class {
	bytes;
	offset = 0;
	constructor(e) {
		this.bytes = e;
	}
	read() {
		let e = 0, t = 0;
		for (; this.offset < this.bytes.length;) {
			let n = this.bytes[this.offset++];
			if (e |= (n & 127) << t, !(n & 128)) return e;
			if (t += 7, t > 35) throw RangeError("varint overflow");
		}
		throw RangeError("unexpected end of varint");
	}
	get position() {
		return this.offset;
	}
	set position(e) {
		this.offset = e;
	}
};
function Re(e) {
	let t = e.filter((e) => e < 1 || e > 32);
	if (t.length > 0) throw RangeError(`week out of range: ${t.join(", ")}`);
}
function ze(e) {
	Re(e);
	let t = 0;
	for (let n of e) t |= 1 << n - 1;
	return t >>> 0;
}
function Be(e) {
	let t = [];
	for (let n = 1; n <= 32; n += 1) e & 1 << n - 1 && t.push(n);
	return t;
}
//#endregion
//#region packages/codec-kit/src/interner.ts
var Ve = class {
	strings = [];
	index = /* @__PURE__ */ new Map();
	maxEntries;
	constructor(e = {}) {
		this.maxEntries = e.maxEntries ?? Infinity, e.seed !== void 0 && this.intern(e.seed);
	}
	intern(e) {
		let t = e?.trim() ?? "";
		if (!t) return -1;
		let n = this.index.get(t);
		if (n !== void 0) return n;
		if (this.strings.length >= this.maxEntries) throw RangeError("string table overflow");
		let r = this.strings.length;
		return this.strings.push(t), this.index.set(t, r), r;
	}
}, He = 128, Ue = 255;
function We(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e - t), n = t.every((e, n) => n === 0 || e === t[n - 1] + 1), r = t[0], i = t[t.length - 1];
	if (n && r >= 1 && r <= 127 && i <= 255) return [He | r, i];
	let a = ze(t);
	return [
		a & 255,
		a >>> 8 & 255,
		a >>> 16 & 255,
		a >>> 24 & 255
	];
}
function Ge(e) {
	if (e.length === 0) return [];
	if (e.length === 2 && (e[0] & He) !== 0) {
		let t = e[0] & 127, n = e[1];
		return !n || n < t ? [] : Array.from({ length: n - t + 1 }, (e, n) => t + n);
	}
	return e.length === 4 ? Be((e[0] | e[1] << 8 | e[2] << 16 | e[3] << 24) >>> 0) : [];
}
var Ke = class e {
	entries = [];
	indexOf = /* @__PURE__ */ new Map();
	intern(e) {
		let t = We(e), n = t.join(","), r = this.indexOf.get(n);
		if (r !== void 0) return r;
		if (this.entries.length >= Ue) throw Error("week mask table overflow");
		let i = this.entries.length;
		return this.entries.push(t), this.indexOf.set(n, i), i;
	}
	write(e) {
		e.push(this.entries.length);
		for (let t of this.entries) e.push(t.length), e.push(...t);
	}
	static read(t, n) {
		let r = t[n];
		if (r === void 0) throw Error("truncated week mask table");
		let i = new e(), a = n + 1;
		for (let e = 0; e < r; e += 1) {
			let n = t[a];
			if (n === void 0) throw Error("truncated week mask entry");
			a += 1;
			let r = [];
			for (let e = 0; e < n; e += 1) {
				let n = t[a + e];
				if (n === void 0) throw Error("truncated week mask entry");
				r.push(n);
			}
			i.entries.push(r), i.indexOf.set(r.join(","), e), a += n;
		}
		return {
			table: i,
			nextOffset: a
		};
	}
	decode(e) {
		let t = this.entries[e];
		return t ? Ge(t) : [];
	}
}, qe = 14, Je = class e {
	names = [];
	indexOf = /* @__PURE__ */ new Map();
	intern(e) {
		let t = e.trim();
		if (!t) return 0;
		let n = this.indexOf.get(t);
		if (n !== void 0) return n;
		if (this.names.length >= qe) throw Error("teacher table overflow");
		let r = this.names.length + 1;
		return this.names.push(t), this.indexOf.set(t, r), r;
	}
	write(e) {
		e.push(this.names.length);
		for (let t of this.names) {
			let n = new TextEncoder().encode(t);
			Ie(n.length, e);
			for (let t of n) e.push(t);
		}
	}
	static read(t, n) {
		let r = t[n];
		if (r === void 0) throw Error("truncated teacher table");
		let i = new e(), a = new Le(t);
		a.position = n + 1;
		for (let e = 0; e < r; e += 1) {
			let n = a.read(), r = a.position, o = t.subarray(r, r + n);
			if (o.length !== n) throw Error("truncated teacher entry");
			let s = new TextDecoder().decode(o);
			i.names.push(s), i.indexOf.set(s, e + 1), a.position = r + n;
		}
		return {
			table: i,
			nextOffset: a.position
		};
	}
	decode(e) {
		return e < 1 || e > this.names.length ? "" : this.names[e - 1] ?? "";
	}
}, _ = class extends Error {
	constructor(e) {
		super(e), this.name = "ShareBinaryDecodeError";
	}
}, Ye = [67, 83], Xe = 1, Ze = Date.UTC(2020, 0, 1), Qe = 20, $e = 255, et = 255, tt = 32, nt = 1440, rt = 1, it = 2, at = 4, ot = 8;
function st(e) {
	let [t, n, r] = e.split("-").map((e) => Number.parseInt(e, 10));
	if (!t || !n || !r) throw new _("invalid term start date");
	let i = Date.UTC(t, n - 1, r);
	return Math.floor((i - Ze) / 864e5);
}
function ct(e) {
	let t = new Date(Ze + e * 864e5);
	return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}
function lt(e) {
	let t = /^(\d{1,2}):(\d{2})$/.exec(e.trim());
	if (!t) throw new _("invalid period time");
	let n = Number.parseInt(t[1], 10), r = Number.parseInt(t[2], 10);
	if (n < 0 || n > 23 || r < 0 || r > 59) throw new _("invalid period time");
	let i = n * 60 + r;
	if (i >= nt) throw new _("invalid period time");
	return i;
}
function ut(e) {
	if (e < 0 || e >= nt) throw new _("invalid period minutes");
	let t = Math.floor(e / 60), n = e % 60;
	return `${String(t).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
}
function dt(e, t) {
	if (e.length > tt) throw new _("too many period times");
	t.push(e.length);
	for (let n of e) {
		if (n.index < 1 || n.index > tt) throw new _("invalid period index");
		let e = lt(n.startTime), r = lt(n.endTime);
		t.push(n.index), t.push(e & 255, e >> 8 & 255), t.push(r & 255, r >> 8 & 255);
	}
}
function ft(e, t) {
	let n = e[t];
	if (n === void 0) throw new _("truncated period table");
	let r = t + 1, i = [];
	for (let t = 0; t < n; t += 1) {
		let t = e[r], n = e[r + 1], a = e[r + 2], o = e[r + 3], s = e[r + 4];
		if (t === void 0 || n === void 0 || a === void 0 || o === void 0 || s === void 0) throw new _("truncated period entry");
		let c = n | a << 8, l = o | s << 8;
		i.push({
			index: t,
			startTime: ut(c),
			endTime: ut(l)
		}), r += 5;
	}
	return {
		periodTimes: i,
		nextOffset: r
	};
}
var pt = new TextEncoder(), mt = new TextDecoder();
function ht(e, t) {
	t.push(e.strings.length);
	for (let n of e.strings) {
		let e = pt.encode(n);
		Ie(e.length, t);
		for (let n of e) t.push(n);
	}
}
function gt(e, t) {
	let n = e[t];
	if (n === void 0) throw new _("truncated string table");
	let r = [], i = new Le(e);
	i.position = t + 1;
	for (let t = 0; t < n; t += 1) {
		let t = i.read(), n = i.position, a = e.subarray(n, n + t);
		if (a.length !== t) throw new _("truncated string entry");
		r.push(mt.decode(a)), i.position = n + t;
	}
	return {
		strings: r,
		nextOffset: i.position
	};
}
function _t(e, t, n) {
	return (e & 7) << 5 | (t - 1 & 15) << 1 | !!n;
}
function vt(e) {
	return {
		dayOfWeek: e >> 5 & 7,
		startPeriod: (e >> 1 & 15) + 1,
		hasRemark: (e & 1) == 1
	};
}
function yt(e, t) {
	return (e & 15) << 4 | t & 15;
}
function bt(e) {
	return {
		endPeriod: e >> 4 & 15,
		teacherSlot: e & 15
	};
}
function xt(e, t) {
	let n = ve(t);
	return n.kind === "full" ? n.value ? {
		buildingIdx: e.intern(n.value),
		room: ""
	} : {
		buildingIdx: 255,
		room: ""
	} : {
		buildingIdx: e.intern(n.building),
		room: n.room
	};
}
function St(e, t, n) {
	if (t === 255) return "";
	let r = e[t] ?? "";
	return r ? Se(n) ? r : ye({
		kind: "split",
		building: r,
		room: n
	}) : "";
}
var Ct = new ie();
function wt(e) {
	let n = e.academicConfig?.termStartDate ?? "", r = Ct.normalizeTermStartDate(n, re());
	return {
		...e,
		name: u(e.name),
		academicConfig: {
			...e.academicConfig,
			termStartDate: r,
			startWeek: e.academicConfig?.startWeek ?? 1,
			endWeek: e.academicConfig?.endWeek ?? Qe,
			periodTimes: e.academicConfig?.periodTimes ?? []
		},
		courses: ge((e.courses ?? []).map((e) => ({
			...e,
			name: t(e.name),
			teacher: (e.teacher ?? "").trim(),
			location: (e.location ?? "").trim(),
			remark: e.remark?.trim() ?? ""
		})))
	};
}
function Tt(e) {
	let t = wt(e);
	if (t.courses.length === 0) throw new _("timetable has no courses");
	if (t.courses.length > et) throw new _("too many courses");
	let n = new Ve({
		maxEntries: $e,
		seed: t.name
	}), r = new Ke(), i = new Je(), a = t.academicConfig.endWeek || Qe;
	if (a > 32) throw new _(`week out of range: ${a}`);
	let o = t.courses.some((e) => (e.remark?.length ?? 0) > 0), s = t.courses[0]?.weeks ?? [], c = t.courses.length > 0 && t.courses.every((e) => e.weeks.length === s.length && e.weeks.every((e, t) => e === s[t])), l = c ? r.intern(s) : -1, u = t.courses.map((e) => {
		if (!e.name) throw new _("course name is required");
		Re(e.weeks);
		let t = n.intern(e.name), a = i.intern(e.teacher), o = e.remark ? n.intern(e.remark) : -1, s = xt(n, e.location), u = ve(e.location);
		return {
			nameIdx: t,
			dayPeriod: _t(e.dayOfWeek, e.startPeriod, o >= 0),
			endTeacher: yt(e.endPeriod, a > 0 ? a : 15),
			buildingIdx: s.buildingIdx,
			room: s.room,
			weekMaskIdx: c ? l : r.intern(e.weeks),
			remarkIdx: o,
			isSplitLocation: u.kind === "split"
		};
	}), d = -1;
	for (let e of u) if (e.isSplitLocation && e.buildingIdx !== 255) {
		if (d === -1) d = e.buildingIdx;
		else if (d !== e.buildingIdx) {
			d = -1;
			break;
		}
	}
	let f = (o ? rt : 0) | (a === Qe ? 0 : it) | (c ? at : 0) | (d >= 0 ? ot : 0), p = [
		...Ye,
		Xe,
		f
	], m = st(t.academicConfig.termStartDate);
	p.push(m & 255, m >> 8 & 255), (f & it) !== 0 && p.push(a), p.push(t.courses.length), (f & ot) !== 0 && p.push(d), dt(t.academicConfig.periodTimes, p), ht(n, p), r.write(p), i.write(p);
	for (let e of u) p.push(e.nameIdx);
	for (let e of u) p.push(e.dayPeriod);
	for (let e of u) p.push(e.endTeacher);
	if ((f & ot) === 0) for (let e of u) p.push(e.buildingIdx);
	for (let e of u) be(e.room, p);
	if ((f & at) === 0) for (let e of u) p.push(e.weekMaskIdx);
	if ((f & rt) !== 0) for (let e of u) p.push(e.remarkIdx >= 0 ? e.remarkIdx : 0);
	return Uint8Array.from(p);
}
function Et(e, t = Date.now()) {
	if (e.length < 6) throw new _("payload too short");
	if (e[0] !== Ye[0] || e[1] !== Ye[1]) throw new _("invalid magic");
	if (e[2] !== Xe) throw new _("unsupported version");
	let n = e[3], r = e[4] | e[5] << 8, i = 6, a = Qe;
	if ((n & it) !== 0) {
		if (a = e[i], a === void 0) throw new _("truncated header");
		if (a > 32) throw new _(`week out of range: ${a}`);
		i += 1;
	}
	let o = e[i];
	if (o === void 0 || o === 0) throw new _("no courses in payload");
	i += 1;
	let s = -1;
	if ((n & ot) !== 0) {
		if (s = e[i], s === void 0) throw new _("truncated header");
		i += 1;
	}
	let { periodTimes: l, nextOffset: d } = ft(e, i);
	i = d;
	let { strings: f, nextOffset: p } = gt(e, i);
	i = p;
	let { table: m, nextOffset: h } = Ke.read(e, i);
	i = h;
	let { table: g, nextOffset: ee } = Je.read(e, i);
	i = ee;
	let te = i;
	i += o;
	let ne = i;
	i += o;
	let re = i;
	i += o;
	let ie = (n & ot) !== 0, ae = i;
	ie || (i += o);
	let oe = i;
	i += o * 5;
	let se = (n & at) !== 0, ce = i;
	se || (i += o);
	let le = se ? 0 : -1, ue = (n & rt) !== 0, de = i;
	if (ue && (i += o), e.length < i) throw new _("truncated course columns");
	let fe = u(f[0] ?? ""), pe = [];
	for (let t = 0; t < o; t += 1) {
		let n = e[te + t], r = e[ne + t], i = e[re + t], a = ie ? s : e[ae + t], o = le >= 0 ? le : e[ce + t], c = ue ? e[de + t] ?? 0 : 0, l = xe(e, oe + t * 5), { dayOfWeek: u, startPeriod: d } = vt(r);
		if (u < 1 || u > 7) throw new _("invalid day of week");
		let { endPeriod: p, teacherSlot: h } = bt(i), ee = f[n];
		if (!ee) throw new _("invalid course name index");
		pe.push({
			id: `share-course-${t + 1}`,
			name: ee,
			teacher: h === 15 || h === 0 ? "" : g.decode(h),
			location: St(f, a, l),
			dayOfWeek: u,
			startPeriod: d,
			endPeriod: Math.max(d, p),
			weeks: m.decode(o),
			remark: c > 0 ? f[c] ?? "" : ""
		});
	}
	if (pe.length === 0) throw new _("no valid courses decoded");
	return {
		schemaVersion: 1,
		id: "share-import",
		name: fe,
		courses: pe.sort((e, t) => e.dayOfWeek - t.dayOfWeek || e.startPeriod - t.startPeriod || e.name.localeCompare(t.name)),
		createdAt: t,
		updatedAt: t,
		academicConfig: {
			termStartDate: ct(r),
			startWeek: 1,
			endWeek: a,
			periodTimes: l
		},
		importMetadata: { source: "share-link" },
		viewPrefs: {
			...c(pe),
			showNonCurrentWeekCourses: !1
		}
	};
}
//#endregion
//#region packages/plugins/codec-share/src/share-link/share-link-compression.ts
var Dt = 262144, Ot = class extends Error {
	constructor() {
		super("share payload exceeds decompression limit");
	}
}, kt = Ce;
async function At(e, t = Dt) {
	if (typeof DecompressionStream > "u") {
		let n = await we(e);
		if (n.length > t) throw new Ot();
		return n;
	}
	let n = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new DecompressionStream("deflate-raw")).getReader(), r = [], i = 0;
	for (;;) {
		let { done: e, value: a } = await n.read();
		if (e) break;
		if (i += a.byteLength, i > t) throw await n.cancel().catch(() => {}), new Ot();
		r.push(a);
	}
	let a = new Uint8Array(i), o = 0;
	for (let e of r) a.set(e, o), o += e.byteLength;
	return a;
}
//#endregion
//#region packages/plugins/codec-share/src/messages.ts
function jt(e) {
	return oe({ content: {
		type: "string",
		title: () => e("import.field.content.title"),
		placeholder: () => e("import.field.content.placeholder"),
		required: !0
	} });
}
var v = {
	"zh-cn": {
		"plugin.name": "分享口令",
		"plugin.description": "通过分享口令导入/导出课表",
		"import.tab.title": "分享口令",
		"import.field.content.title": "分享链接或口令",
		"import.field.content.placeholder": "粘贴课表分享链接或完整口令",
		"import.error.empty": "未识别到有效的课表分享链接",
		"export.action.title": "分享口令",
		"export.action.description": "生成紧凑分享口令并复制到剪贴板",
		"export.success": "已复制课表链接",
		"export.tokenSuccess": "已复制分享口令",
		"export.warning.large": "课表较大，部分应用可能截断分享内容，请注意核对导入结果",
		"import.ui.title": "分享口令",
		"import.ui.subtitle": "复制课表分享口令后点击下方按钮",
		"import.ui.loading": "读取中…",
		"import.ui.clipboard": "从剪贴板导入课表",
		"import.ui.clipboardError": "无法读取剪贴板，请检查浏览器权限",
		"share.error.corrupted": "分享链接已损坏或内容不完整",
		"share.error.unsupported": "不支持的分享链接格式",
		"share.error.parseFailed": "分享链接解析失败",
		"share.clipboard.unnamed": "未命名课表",
		"share.clipboard.template": "我分享了一张课表：「{name}」\n复制这段文本后，打开 Chronos，选择从【分享口令】方式导入\n{link}"
	},
	en: {
		"plugin.name": "Share token",
		"plugin.description": "Import and export timetables via share tokens",
		"import.tab.title": "Share token",
		"import.field.content.title": "Share link or token",
		"import.field.content.placeholder": "Paste a timetable share link or full token",
		"import.error.empty": "No valid timetable share link was recognized",
		"export.action.title": "Share token",
		"export.action.description": "Generate a compact share token and copy to clipboard",
		"export.success": "Timetable link copied",
		"export.tokenSuccess": "Share token copied",
		"export.warning.large": "The timetable is large; some apps may truncate the shared content. Verify the import result.",
		"import.ui.title": "Share token",
		"import.ui.subtitle": "Copy a share token, then tap the button below",
		"import.ui.loading": "Reading…",
		"import.ui.clipboard": "Import from clipboard",
		"import.ui.clipboardError": "Could not read clipboard. Check browser permissions",
		"share.error.corrupted": "Share link is corrupted or incomplete",
		"share.error.unsupported": "Unsupported share link format",
		"share.error.parseFailed": "Failed to parse share link",
		"share.clipboard.unnamed": "Untitled timetable",
		"share.clipboard.template": "I shared a timetable: \"{name}\"\nCopy this text, open Chronos, and import via Share token\n{link}"
	}
}, Mt = "1.", Nt = v["zh-cn"];
function Pt(e) {
	return {
		ok: !0,
		value: e
	};
}
function Ft(e) {
	return {
		ok: !1,
		errorMessage: e
	};
}
async function It(e) {
	return `${Mt}${ke(await kt(Pe(Tt(e))))}`;
}
async function Lt(e, t = Nt) {
	let n = e.trim();
	if (n.length > 65536) return Ft(t["share.error.corrupted"]);
	if (!n.startsWith(Mt)) return Ft(t["share.error.unsupported"]);
	try {
		let e = Fe(await At(je(n.slice(Mt.length))));
		if (!e) throw new _("checksum mismatch");
		return Pt(Et(e));
	} catch (e) {
		return e instanceof Ot ? Ft(t["share.error.corrupted"]) : Ft(e instanceof _ ? e.message === "checksum mismatch" ? t["share.error.corrupted"] : e.message : e instanceof Error ? e.message : t["share.error.parseFailed"]);
	}
}
async function Rt(e, t) {
	let n = await It(e), r = new URL(t);
	return r.hash = n, r.href;
}
function zt(e, t, n = Nt) {
	let r = u(e) || n["share.clipboard.unnamed"];
	return n["share.clipboard.template"].replace("{name}", r).replace("{link}", t);
}
async function Bt(e, t) {
	return t === null ? (await It(e)).length : (await Rt(e, t)).length;
}
function Vt(e) {
	return e.startsWith(Mt);
}
function Ht(e) {
	return e.replace(/[^A-Za-z0-9\-_]+$/, "");
}
function Ut(e) {
	try {
		return decodeURIComponent(e);
	} catch {
		return e;
	}
}
function Wt(e) {
	let t = Ht(Ut(e.trim().split(/\s/)[0] ?? ""));
	return Vt(t) ? t : null;
}
function Gt(e) {
	let t = e.trim();
	try {
		let e = new URL(t), n = Wt(e.hash.startsWith("#") ? e.hash.slice(1) : e.hash);
		if (n) return n;
		let r = e.searchParams.get("d");
		if (r) return Wt(r);
	} catch {
		let e = t.indexOf("#");
		if (e >= 0) {
			let n = Wt(t.slice(e + 1));
			if (n) return n;
		}
	}
	return null;
}
function Kt(e) {
	let t = Ht(Ut(e.hash.startsWith("#") ? e.hash.slice(1) : e.hash));
	if (Vt(t)) return t;
	let n = new URLSearchParams(e.search).get("d");
	if (n) {
		let e = Ht(n);
		if (Vt(e)) return e;
	}
	return null;
}
function qt(e) {
	let t = e.trim(), n = Wt(t);
	if (n) return n;
	for (let e of t.split(/\r?\n/)) {
		let t = e.trim().match(/https?:\/\/\S+/);
		if (!t) continue;
		let n = Gt(t[0]);
		if (n) return n;
	}
	return Gt(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
var Jt = {}, y = Symbol("uninitialized"), Yt = Array.isArray, Xt = Array.prototype.indexOf, Zt = Array.prototype.includes, Qt = Array.from, $t = Object.defineProperty, en = Object.getOwnPropertyDescriptor, tn = Object.prototype, nn = Array.prototype, rn = Object.getPrototypeOf, an = Object.isExtensible;
function on(e) {
	return typeof e == "function";
}
var sn = () => {};
function cn(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function ln() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var b = 1024, x = 2048, S = 4096, un = 8192, dn = 16384, fn = 32768, pn = 1 << 25, mn = 65536, hn = 1 << 19, gn = 1 << 20, _n = 1 << 21, vn = 1 << 22, yn = 1 << 23, bn = Symbol("$state"), xn = Symbol("component"), Sn = Symbol("legacy props"), Cn = Symbol("attributes"), wn = Symbol("class"), Tn = Symbol("style"), En = Symbol("text"), Dn = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
function On() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function kn(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function An() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var C = !1;
function jn(e) {
	C = e;
}
var w;
function T(e) {
	if (e === null) throw kn(), Jt;
	return w = e;
}
function Mn() {
	return T(/* @__PURE__ */ L(w));
}
function Nn(e) {
	if (C) {
		if (/* @__PURE__ */ L(w) !== null) throw kn(), Jt;
		w = e;
	}
}
function Pn(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ L(n);
		w = n;
	}
}
function Fn(e = !0) {
	for (var t = 0, n = w;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ L(n);
		e && n.remove(), n = i;
	}
}
function In(e) {
	if (!e || e.nodeType !== 8) throw kn(), Jt;
	return e.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function Ln(e) {
	return e === this.v;
}
function Rn(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function zn(e) {
	return !Rn(e, this.v);
}
function Bn(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Vn() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function Hn() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Un() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Wn() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Gn() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Kn() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function qn() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function Jn(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Vn(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Yn(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Xn(e, t) {
	return e === null && Bn(t), e.c ??= new Map(Yn(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var E = null;
function Zn(e) {
	E = e;
}
function Qn() {
	return Jn($n, er, tr);
}
function $n(e) {
	return Xn(E, "getContext").get(e);
}
function er(e, t) {
	return Xn(E, "setContext").set(e, t), t;
}
function tr(e) {
	return Xn(E, "hasContext").has(e);
}
function nr(e, t = !1, n) {
	E = {
		p: E,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: K,
		l: null
	};
}
function rr(e) {
	var t = E, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) fi(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, E = t.p, ir(e);
}
function ir(e = {}) {
	return $t(e, xn, { value: !0 }), e;
}
function ar() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var or = [];
function sr() {
	var e = or;
	or = [], cn(e);
}
function D(e) {
	if (or.length === 0 && !kr) {
		var t = or;
		queueMicrotask(() => {
			t === or && sr();
		});
	}
	or.push(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var cr = ~(x | S | b);
function O(e, t) {
	e.f = e.f & cr | t;
}
function lr(e) {
	e.f & 512 || e.deps === null ? O(e, b) : O(e, S);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function ur(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), O(e, b);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dr(e) {
	var t = U, n = K;
	G(null), q(null);
	try {
		return e();
	} finally {
		G(t), q(n);
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
function fr(e, t, n, r) {
	let i = ar() ? gr : br;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = K, c = pr(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			mr();
		}
	}
	var d = hr();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ vr(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mr();
	}) : f();
}
function pr() {
	var e = K, t = U, n = E, r = k;
	return function(i = !0) {
		q(e), G(t), Zn(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mr(e = !0) {
	q(null), G(null), Zn(null), e && k?.deactivate();
}
function hr() {
	var e = K, t = e.b, n = k, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gr(e) {
	var t = 2 | x;
	return K !== null && (K.f |= hn), {
		ctx: E,
		deps: null,
		effects: null,
		equals: Ln,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: y,
		wv: 0,
		parent: K,
		ac: null
	};
}
var _r = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function vr(e, t, n) {
	let r = K;
	r === null && Hn();
	var i = void 0, a = Ur(y), o = !U, s = /* @__PURE__ */ new Set();
	return mi(() => {
		var t = K, n = ln();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Dn && n.reject(e);
			}).finally(mr);
		} catch (e) {
			n.reject(e), mr();
		}
		var c = k;
		if (o) {
			if (t.f & 32768) var l = hr();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(_r);
			else for (let e of s.values()) e.reject(_r);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== _r && (c.activate(), t ? (a.f |= yn, Gr(a, t)) : (a.f & 8388608 && (a.f ^= yn), Gr(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), di(() => {
		for (let e of s) e.reject(_r);
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
function yr(e) {
	let t = /* @__PURE__ */ gr(e);
	return ji(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function br(e) {
	let t = /* @__PURE__ */ gr(e);
	return t.equals = zn, t;
}
function xr(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function Sr(e) {
	var t, n = K, r = e.parent;
	if (!H && r !== null && e.v !== y && r.f & 24576) return On(), e.v;
	q(r);
	try {
		xr(e), t = Bi(e);
	} finally {
		q(n);
	}
	return t;
}
function Cr(e) {
	var t = Sr(e);
	if (!e.equals(t) && (e.wv = Li(), (!k?.is_fork || e.deps === null) && (k === null ? e.v = t : (k.capture(e, t, !0), Dr?.capture(e, t, !0)), e.deps === null))) {
		O(e, b);
		return;
	}
	H || (A === null ? lr(e) : (ui() || k?.is_fork) && A.set(e, t));
}
function wr(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dr(() => {
		t.ac.abort(Dn), t.ac = null;
	}), t.fn !== null && (t.teardown = sn), Ui(t, 0), yi(t));
}
function Tr(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Wi(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var Er = null, k = null, Dr = null, A = null, Or = null, kr = !1, Ar = !1, jr = null, Mr = null, Nr = 0, Pr = 1, Fr = class e {
	id = Pr++;
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
		Er === null ? Er = this : (Er.#n = this, this.#t = Er), Er = this;
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
			for (var r of n.d) O(r, x), t(r);
			for (r of n.m) O(r, S), t(r);
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
					t.f ^= b;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), O(e, x), this.schedule(e);
		for (let e of this.#d) O(e, S), this.schedule(e);
		this.apply();
		for (var t = jr = [], n = [], r = Mr = []; this.#c.length > 0;) {
			Nr++ > 1e3 && (this.#S(), Ir());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Br(e), this.#h() || this.discard(), t;
			}
		}
		if (k = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (jr = null, Mr = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) zr(e, t);
			r.length > 0 && k.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Dr = this, Lr(n), Lr(t), Dr = null, this.#s?.resolve();
		var o = k;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (M.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= b;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= b : i & 4 ? t.push(r) : Ri(r) && (i & 16 && this.#d.add(r), Wi(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), O(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), k = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ur(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== y && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), A?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		k = this;
	}
	deactivate() {
		k = null, A = null;
	}
	flush() {
		try {
			Ar = !0, k = this, this.#_();
		} finally {
			Nr = 0, Or = null, jr = null, Mr = null, Ar = !1, k = null, A = null, M.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(_r);
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
		this.#m || (this.#m = !0, D(() => {
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
		return (this.#s ??= ln()).promise;
	}
	static ensure() {
		if (k === null) {
			let t = k = new e();
			!Ar && D(() => {
				t.#e || t.flush();
			});
		}
		return k;
	}
	apply() {
		A = null;
	}
	schedule(e) {
		if (Or = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Er = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ir() {
	try {
		Un();
	} catch (e) {
		R(e, Or);
	}
}
var j = null;
function Lr(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Ri(r) && (j = /* @__PURE__ */ new Set(), Wi(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Si(r), j?.size > 0)) {
				M.clear();
				for (let e of j) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) j.has(n) && (j.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Wi(n);
					}
				}
				j.clear();
			}
		}
		j = null;
	}
}
function Rr(e) {
	k.schedule(e);
}
function zr(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), O(e, b);
		for (var n = e.first; n !== null;) zr(n, t), n = n.next;
	}
}
function Br(e) {
	O(e, b);
	for (var t = e.first; t !== null;) Br(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Vr = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), Hr = !1;
function Ur(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ln,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Ur(e, t);
	return ji(n), n;
}
function P(e, t, n = !1) {
	return U !== null && (!W || U.f & 131072) && ar() && U.f & 4325394 && (J === null || !J.has(e)) && Kn(), Gr(e, n ? Yr(t) : t, Mr);
}
var F = null, Wr = 0;
function Gr(e, t, n = null) {
	if (!e.equals(t)) {
		H ? M.set(e, t) : M.has(e) || M.set(e, e.v);
		var r = Fr.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Sr(t), A === null && lr(t);
		}
		e.wv = Li(), F = null, Wr = 0, Jr(e, x, n), F = null, ar() && K !== null && K.f & 1024 && !(K.f & 96) && (Z === null ? Mi([e]) : Z.push(e)), !r.is_fork && Vr.size > 0 && !Hr && Kr();
	}
	return t;
}
function Kr() {
	Hr = !1;
	for (let e of Vr) {
		e.f & 1024 && O(e, S);
		let t;
		try {
			t = Ri(e);
		} catch {
			t = !0;
		}
		t && Wi(e);
	}
	Vr.clear();
}
function qr(e) {
	P(e, e.v + 1);
}
function Jr(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = ar(), a = r.length;
		if (Wr += a, Wr > 1e5 && F === null && (F = /* @__PURE__ */ new Set()), F !== null) {
			if (F.has(e)) return;
			F.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== K) {
				var l = (c & x) === 0;
				if (l && O(s, t), c & 131072) Vr.add(s);
				else if (c & 2) {
					var u = s;
					A?.delete(u), Jr(u, S, n);
				} else if (l) {
					var d = s;
					c & 16 && j !== null && j.add(d), n === null ? Rr(d) : n.push(d);
				}
			}
		}
	}
}
function Yr(e) {
	if (typeof e != "object" || !e || bn in e || xn in e) return e;
	let t = rn(e);
	if (t !== tn && t !== nn) return e;
	var n = /* @__PURE__ */ new Map(), r = Yt(e), i = /* @__PURE__ */ N(0), a = null, o = Fi, s = (e) => {
		if (Fi === o) return e();
		var t = U, n = Fi;
		G(null), Ii(o);
		var r = e();
		return G(t), Ii(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ N(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Wn();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ N(r.value, a);
				return n.set(t, e), e;
			}) : P(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ N(y, a));
					n.set(t, e), qr(i);
				}
			} else P(r, y), qr(i);
			return !0;
		},
		get(t, r, i) {
			if (r === bn) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || en(t, r)?.writable) && (o = s(() => /* @__PURE__ */ N(Yr(c ? t[r] : y), a)), n.set(r, o)), o !== void 0) {
				var l = Q(o);
				return l === y ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = Q(i);
				if (a === y) return;
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
			if (t === bn) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== y || Reflect.has(e, t);
			return (r !== void 0 || K !== null && (!i || en(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ N(i ? Yr(e[t]) : y, a)), n.set(t, r)), Q(r) === y) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ N(y, a)), n.set(d + "", f)) : P(f, y);
			}
			if (l === void 0) (!u || en(e, t)?.writable) && (l = s(() => /* @__PURE__ */ N(void 0, a)), P(l, Yr(o)), n.set(t, l));
			else {
				u = l.v !== y;
				var p = s(() => Yr(o));
				P(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && P(h, g + 1);
				}
				qr(i);
			}
			return !0;
		},
		ownKeys(e) {
			Q(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== y;
			});
			for (var [r, a] of n) a.v !== y && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Gn();
		}
	});
}
var Xr, Zr, Qr, $r;
function ei() {
	if (Xr === void 0) {
		Xr = window, Zr = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Qr = en(t, "firstChild").get, $r = en(t, "nextSibling").get, an(e) && (e[wn] = void 0, e[Cn] = null, e[Tn] = void 0, e.__e = void 0), an(n) && (n[En] = void 0);
	}
}
function I(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ti(e) {
	return Qr.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function L(e) {
	return $r.call(e);
}
function ni(e, t) {
	if (!C) return /* @__PURE__ */ ti(e);
	var n = /* @__PURE__ */ ti(w);
	if (n === null) n = w.appendChild(I());
	else if (t && n.nodeType !== 3) {
		var r = I();
		return n?.before(r), T(r), r;
	}
	return t && si(n), T(n), n;
}
function ri(e, t = !1) {
	if (!C) return /* @__PURE__ */ ti(e);
	var n = ni(e, t);
	return Nn(e), n;
}
function ii(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ L(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = I();
			return r === null ? i?.after(a) : r.before(a), T(a), a;
		}
		si(r);
	}
	return T(r), r;
}
function ai() {
	return !1;
}
function oi(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function si(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function ci(e) {
	var t = K;
	if (t === null) return U.f |= yn, e;
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
function li(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = K;
	n !== null && n.f & 8192 && (e |= un);
	var r = {
		ctx: E,
		deps: null,
		nodes: null,
		f: e | x | 512,
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
	k?.register_created_effect(r);
	var i = r;
	if (e & 4) jr === null ? Fr.ensure().schedule(r) : jr.push(r);
	else if (t !== null) {
		try {
			Wi(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= mn));
	}
	if (i !== null && (i.parent = n, n !== null && li(i, n), U !== null && U.f & 2 && !(e & 64))) {
		var a = U;
		(a.effects ??= []).push(i);
	}
	return r;
}
function ui() {
	return U !== null && !W;
}
function di(e) {
	let t = z(8, null);
	return O(t, b), t.teardown = e, t;
}
function fi(e) {
	return z(4 | gn, e);
}
function pi(e) {
	Fr.ensure();
	let t = z(64 | hn, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ci(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function mi(e) {
	return z(vn | hn, e);
}
function hi(e, t = 0) {
	return z(8 | t, e);
}
function gi(e, t = [], n = [], r = []) {
	fr(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(Q));
		});
	});
}
function _i(e, t = 0) {
	return z(16 | t, e);
}
function B(e) {
	return z(32 | hn, e);
}
function vi(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = H, r = U;
		Ai(!0), G(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			Ai(n), G(r);
		}
	}
}
function yi(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && dr(() => {
			e.abort(Dn);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function bi(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (xi(e.nodes.start, e.nodes.end), n = !0), e.f |= pn, yi(e, t && !n), Ui(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	vi(e), e.f ^= pn, e.f |= dn;
	var i = e.parent;
	i !== null && i.first !== null && Si(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function xi(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ L(e);
		e.remove(), e = n;
	}
}
function Si(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ci(e, t, n = !0) {
	var r = [];
	e.f |= 256, wi(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function wi(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= un;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				wi(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Ti(e) {
	e.f &= -257, Ei(e, !0);
}
function Ei(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= un, e.f & 1024 || (O(e, x), Fr.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Ei(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Di(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ L(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Oi = null, ki = !1, H = !1;
function Ai(e) {
	H = e;
}
var U = null, W = !1;
function G(e) {
	U = e;
}
var K = null;
function q(e) {
	K = e;
}
var J = null;
function ji(e) {
	U !== null && (U.f & 2097152 || U.f & 2) && (J ??= /* @__PURE__ */ new Set()).add(e);
}
var Y = null, X = 0, Z = null;
function Mi(e) {
	Z = e;
}
var Ni = 1, Pi = 0, Fi = Pi;
function Ii(e) {
	Fi = e;
}
function Li() {
	return ++Ni;
}
function Ri(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Ri(a) && Cr(a), a.wv > e.wv) return !0;
		}
		t & 512 && A === null && O(e, b);
	}
	return !1;
}
function zi(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(J !== null && J.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? zi(a, t, !1) : t === a && (n ? O(a, x) : a.f & 1024 && O(a, S), Rr(a));
	}
}
function Bi(e) {
	var t = Y, n = X, r = Z, i = U, a = J, o = E, s = W, c = Fi, l = e.f;
	Y = null, X = 0, Z = null, U = l & 96 ? null : e, J = null, Zn(e.ctx), W = !1, Fi = ++Pi, e.ac !== null && (dr(() => {
		e.ac.abort(Dn);
	}), e.ac = null);
	try {
		e.f |= _n;
		var u = e.fn, d = u();
		e.f |= fn;
		var f = Vi(e);
		if (ar() && Z !== null && !W && f !== null && !(e.f & 6146)) for (var p = 0; p < Z.length; p++) zi(Z[p], e);
		if (i !== null && i !== e) {
			if (Pi++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Pi;
			if (t !== null) for (let e of t) e.rv = Pi;
			Z !== null && (r === null ? r = Z : r.push(...Z));
		}
		return e.f & 8388608 && (e.f ^= yn), d;
	} catch (t) {
		return Vi(e), ci(t);
	} finally {
		e.f ^= _n, Y = t, X = n, Z = r, U = i, J = a, Zn(o), W = s, Fi = c;
	}
}
function Vi(e) {
	var t = e.deps, n = k?.is_fork;
	if (Y !== null) {
		var r;
		if (n || Ui(e, X), t !== null && X > 0) for (t.length = X + Y.length, r = 0; r < Y.length; r++) t[X + r] = Y[r];
		else e.deps = t = Y;
		if (ui() && e.f & 512) for (r = X; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && X < t.length && (Ui(e, X), t.length = X);
	return t;
}
function Hi(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = Xt.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Y === null || !Zt.call(Y, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== y && lr(a), a.ac !== null && dr(() => {
			a.ac.abort(Dn), a.ac = null, O(a, x);
		}), wr(a), Ui(a, 0);
	}
}
function Ui(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Hi(e, n[r]);
}
function Wi(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, b);
		var n = K, r = ki;
		K = e, ki = !(t & 96);
		try {
			t & 16777232 ? bi(e) : yi(e), vi(e);
			var i = Bi(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Ni;
		} finally {
			ki = r, K = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if (Oi?.add(e), U !== null && !W && !(K !== null && K.f & 16384) && (J === null || !J.has(e))) {
		var n = U.deps;
		if (U.f & 2097152) e.rv < Pi && (e.rv = Pi, Y === null && n !== null && n[X] === e ? X++ : Y === null ? Y = [e] : Y.push(e));
		else {
			U.deps ??= [], Zt.call(U.deps, e) || U.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [U] : Zt.call(r, U) || r.push(U);
		}
	}
	if (H && M.has(e)) return M.get(e);
	if (t) {
		var i = e;
		if (H) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Ki(i)) && (a = Sr(i)), M.set(i, a), a;
		}
		var o = !(i.f & 512) && !W && U !== null && (ki || !!(U.f & 512)), s = (i.f & fn) === 0;
		Ri(i) && (o && (i.f |= 512), Cr(i)), o && !s && (Tr(i), Gi(i));
	}
	if (A?.has(e)) return A.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Gi(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tr(t), Gi(t));
}
function Ki(e) {
	if (e.v === y) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && Ki(t)) return !0;
	return !1;
}
function qi(e) {
	var t = W;
	try {
		return W = !0, e();
	} finally {
		W = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
var Ji = Symbol("events"), Yi = /* @__PURE__ */ new Set(), Xi = /* @__PURE__ */ new Set();
function Zi(e, t, n) {
	(t[Ji] ??= {})[e] = n;
}
function $(e) {
	for (var t = 0; t < e.length; t++) Yi.add(e[t]);
	for (var n of Xi) n(e);
}
var Qi = null, $i = !1;
function ea(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Qi = e, $i || ($i = !0, setTimeout(() => {
		$i = !1, Qi = null;
	}));
	var o = 0, s = Qi === e && e[Ji];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Ji] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		$t(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = U, d = K;
		G(null), q(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[Ji]?.[r];
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
			e[Ji] = t, delete e.currentTarget, G(u), q(d);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var ta = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function na(e) {
	return ta?.createHTML(e) ?? e;
}
function ra(e) {
	var t = oi("template");
	return t.innerHTML = na(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function ia(e, t) {
	var n = K;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function aa(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (C) return ia(w, null), w;
		i === void 0 && (i = ra(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ti(i)));
		var t = r || Zr ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ti(t), s = t.lastChild;
			ia(o, s);
		} else ia(t, t);
		return t;
	};
}
function oa(e, t) {
	if (C) {
		var n = K;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), Mn();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var sa = ["touchstart", "touchmove"];
function ca(e) {
	return sa.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function la(e) {
	let t = 0, n = Ur(0), r;
	return () => {
		ui() && (Q(n), hi(() => (t === 0 && (r = qi(() => e(() => qr(n)))), t += 1, () => {
			D(() => {
				--t, t === 0 && (r?.(), r = void 0, qr(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ua = mn | hn;
function da(e, t, n, r) {
	new fa(e, t, n, r);
}
var fa = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = C ? w : null;
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
	#h = la(() => (this.#m = Ur(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = K;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = K.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = _i(() => {
			if (C) {
				let e = this.#t;
				Mn();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ua), C && (this.#e = w);
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
		D(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				An();
				return;
			}
			t = !0, n && qn(), this.#s !== null && Ci(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), D(() => {
			var e = this.#c = document.createDocumentFragment(), t = I(), n = !1;
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
				this.#c = null, n && this.#x(k);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Ci(this.#o, () => {
				this.#o = null;
			}), this.#x(k));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Di(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(k);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ur(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = K, n = U, r = E;
		q(this.#i), G(this.#i), Zn(this.#i.ctx);
		try {
			return Fr.ensure(), e();
		} finally {
			q(t), G(n), Zn(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Ci(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, D(() => {
			this.#d = !1, this.#m && Gr(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		k?.is_fork ? (this.#a && k.skip_effect(this.#a), this.#o && k.skip_effect(this.#o), this.#s && k.skip_effect(this.#s), k.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), C && (T(this.#t), Pn(), T(Fn()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = K;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		D(() => {
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
function pa(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[En] ??= e.nodeValue) && (e[En] = n, e.nodeValue = `${n}`);
}
function ma(e, t) {
	return ga(e, t);
}
var ha = /* @__PURE__ */ new Map();
function ga(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	ei();
	var c = void 0, l = pi(() => {
		var o = n ?? t.appendChild(I());
		da(o, { pending: () => {} }, (t) => {
			nr({});
			var n = E;
			if (a && (n.c = a), i && (r.$$events = i), C && ia(t, null), c = e(t, r) || ir(), C && (K.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw kn(), Jt;
			rr();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = ca(r);
					for (let e of [t, document]) {
						var a = ha.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ha.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, ea, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u(Qt(Yi)), Xi.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = ha.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, ea), r.delete(e), r.size === 0 && ha.delete(n)) : r.set(e, i);
			}
			Xi.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return _a.set(c, l), c;
}
var _a = /* @__PURE__ */ new WeakMap();
function va(e, t) {
	let n = _a.get(e);
	return n ? (_a.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var ya = class {
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
			if (n) Ti(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Ti(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						Di(r, t), t.append(I()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Ci(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = k, r = ai();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = I();
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
		} else C && (this.anchor = w), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function ba(e, t, n) {
	var r;
	C && (r = w, Mn());
	var i = new ya(e);
	_i(() => {
		var e = t() ?? null;
		if (C && In(r) === "[" != (e !== null)) {
			var a = Fn();
			T(a), i.anchor = a, jn(!1), i.ensure(e, e && ((t) => n(t, e))), jn(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, mn);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function xa(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), sn;
	let r = qi(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var Sa = [];
function Ca(e, t = sn) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Rn(e, t) && (e = t, n)) {
			let t = !Sa.length;
			for (let t of r) t[1](), Sa.push(t, e);
			if (t) {
				for (let e = 0; e < Sa.length; e += 2) Sa[e][0](Sa[e + 1]);
				Sa.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = sn) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || sn), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function wa(e) {
	let t;
	return xa(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var Ta = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (on(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			on(i) && (i = i());
			let a = en(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (on(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = en(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === bn || t === Sn) return !1;
		for (let n of e.props) if (on(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (on(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function Ea(...e) {
	return new Proxy({ props: e }, Ta);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/index-client.js
function Da(e) {
	let t, n = la((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return ui() ? (n(), t) : wa(e);
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
//#region packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
$(["input"]), $(["change"]), $(["change"]), $(["change"]), $([
	"click",
	"pointerdown",
	"pointerup"
]), $(["change"]);
//#endregion
//#region packages/ui-kit/src/platform/native-bridge.ts
var Oa = "__CHRONOS_NATIVE__";
function ka() {
	if (typeof window > "u") return null;
	let e = window[Oa];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
d.hapticFeedbackEnabled, $(["click"]), $(["click"]), $(["click", "keydown"]), d.reduceMotionEnabled, $(["pointerdown"]), $(["keydown", "click"]), $(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [Aa, ja] = Qn();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
$(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var Ma = /* @__PURE__ */ aa("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function Na(e, t) {
	nr(t, !0);
	let n = /* @__PURE__ */ yr(() => t.component), r = /* @__PURE__ */ yr(() => Da(t.propsStore).current);
	var i = Ma();
	ba(ni(i), () => Q(n), (e, t) => {
		t(e, Ea(() => Q(r)));
	}), Nn(i), oa(e, i), rr();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Pa(e) {
	return {
		[de]: !0,
		mount(t, n, r) {
			let i = Ca({ ...n }), a = ma(Na, {
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
					va(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function Fa(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return le(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? le(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/import-tab-props.ts
async function Ia(e, t, n, r) {
	let i = await e.previewWithSlot(t, n);
	return !i && e.state.errorMessage && r?.notify(e.state.errorMessage, "error"), i;
}
//#endregion
//#region packages/ui-kit/src/platform/clipboard.ts
async function La() {
	let e = ka();
	if (e) try {
		let t = await e.callNative("clipboard", "readText");
		if (typeof t == "string") return t;
	} catch {}
	if (typeof navigator < "u" && navigator.clipboard?.readText) return navigator.clipboard.readText();
	throw Error("Clipboard read is not supported");
}
//#endregion
//#region packages/plugins/codec-share/src/ShareLinkImportTab.svelte
var Ra = /* @__PURE__ */ aa("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small mt-0.5 text-on-surface-variant\"> </p></div> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button></div></div></div>");
function za(e, t) {
	nr(t, !0);
	let n = "codec-share", r = /* @__PURE__ */ N(!1), i = /* @__PURE__ */ yr(() => Fa(t.controller, n, v, "import.ui.title")), a = /* @__PURE__ */ yr(() => Fa(t.controller, n, v, "import.ui.subtitle")), o = /* @__PURE__ */ yr(() => Fa(t.controller, n, v, "import.ui.loading")), s = /* @__PURE__ */ yr(() => Fa(t.controller, n, v, "import.ui.clipboard"));
	async function c() {
		P(r, !0);
		try {
			let e = await La();
			await Ia(t.transfer, "share-link", { content: e.trim() }, t.controller) && t.onContinue();
		} catch (e) {
			let r = e instanceof Error ? e.message : Fa(t.controller, n, v, "import.ui.clipboardError");
			t.controller?.notify(r, "error");
		} finally {
			P(r, !1);
		}
	}
	var l = Ra(), u = ni(l), d = ni(u), f = ni(d), p = ri(f, !0), m = ri(ii(f, 2), !0);
	Nn(d);
	var h = ii(d, 2), g = ni(h), ee = ri(g, !0);
	Nn(h), Nn(u), Nn(l), gi(() => {
		pa(p, Q(i)), pa(m, Q(a)), g.disabled = Q(r), pa(ee, Q(r) ? Q(o) : Q(s));
	}), Zi("click", g, c), oa(e, l), rr();
}
$(["click"]);
//#endregion
//#region packages/plugins/codec-share/src/index.ts
function Ba(e = {}) {
	let { shareComponent: t = Pa(za) } = e;
	return me({
		id: "codec-share",
		messages: v,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "codec",
		order: 30,
		author: "UE-DND",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = jt(n), i = {
				"share.error.corrupted": n("share.error.corrupted"),
				"share.error.unsupported": n("share.error.unsupported"),
				"share.error.parseFailed": n("share.error.parseFailed")
			}, a = {
				"share.clipboard.unnamed": n("share.clipboard.unnamed"),
				"share.clipboard.template": n("share.clipboard.template")
			};
			he(e, {
				id: "share-link",
				title: () => n("import.tab.title"),
				order: 15,
				importKind: "link",
				component: t,
				inputSchema: r,
				deepLink: { fromLocation(e) {
					let t = Kt(e);
					return t ? { content: t } : null;
				} },
				async executeImport(e) {
					let t = e.content;
					if (!t?.trim()) throw new ue("no-data", n("import.error.empty"));
					let r = qt(t);
					if (!r) throw new ue("no-data", n("import.error.empty"));
					let a = await Lt(r, i);
					if (!a.ok) throw new ue(a.errorMessage === i["share.error.unsupported"] ? "unsupported" : "invalid-data", a.errorMessage);
					return a.value;
				}
			});
			let o = () => e.tryService(ce)?.getImportUrl() ?? null;
			e.registerSlot("export.action", {
				id: "share-link",
				title: () => n("export.action.title"),
				order: 5,
				disposition: "clipboard",
				isPrimary: !0,
				description: () => n("export.action.description"),
				async export(e) {
					let t = o(), r = t === null ? await It(e) : zt(e.name, await Rt(e, t), a);
					return {
						filename: t === null ? "share-token.txt" : "share-link.txt",
						mimeType: t === null ? "text/plain" : "application/x-chronos-share-link",
						content: r,
						disposition: "clipboard",
						successMessage: () => n(t === null ? "export.tokenSuccess" : "export.success")
					};
				},
				estimateLength: (e) => Bt(e, o()),
				async checkWarning(e) {
					if (!e.courses?.length) return null;
					try {
						return await Bt(e, o()) > 2e3 ? n("export.warning.large") : null;
					} catch {
						return null;
					}
				}
			});
		}
	});
}
var Va = Ba();
//#endregion
export { Va as default };
