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
// packages/core/src/domain/course-merge.ts
function n(e) {
	return JSON.stringify([
		e.name,
		e.teacher,
		e.location,
		e.dayOfWeek,
		e.startPeriod,
		e.endPeriod,
		e.remark ?? ""
	]);
}
function r(e) {
	return [...e].sort((e, t) => e - t);
}
function i(e, t) {
	return e.length === 0 || t.length === 0 ? [] : r([.../* @__PURE__ */ new Set([...e, ...t])]);
}
function a(e, t) {
	return {
		...e,
		weeks: t,
		...e.customMetadata ? { customMetadata: { ...e.customMetadata } } : {}
	};
}
function o(e, t) {
	let o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = [];
	for (let t of e) {
		let e = n(t), l = s.get(e);
		if (l === void 0) {
			s.set(e, c.length), c.push(a(t, r(t.weeks))), o.set(t.id, t.id);
			continue;
		}
		let u = c[l];
		o.set(t.id, u.id), c[l] = a(u, i(u.weeks, t.weeks));
	}
	return {
		courses: c,
		canonicalIds: o
	};
}
function s(e, t) {
	return o(e, t).courses;
}
// packages/core/src/domain/timetable.ts
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
// packages/core/src/domain/preferences.ts
var d = {
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
function f(e) {
	let t = e.trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) throw Error(`Invalid ISO date: ${e}`);
	let n = /* @__PURE__ */ new Date(`${t}T12:00:00.000Z`);
	if (p(n) !== t) throw Error(`Invalid ISO date: ${e}`);
	return n;
}
function p(e) {
	return `${String(e.getUTCFullYear()).padStart(4, "0")}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
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
// packages/core/src/algorithms/calendar.ts
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
// packages/core/src/schema/schema-types.ts
function oe(e) {
	return e;
}
// packages/core/src/types/services.ts
function se(e) {
	return { key: e };
}
var ce = se("hostLinks");
// packages/core/src/i18n/i18n-catalog.ts
function le(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/slots.ts
var ue = class extends Error {
	kind;
	constructor(e, t) {
		super(t), this.name = "ImportSlotError", this.kind = e;
	}
}, de = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/plugin/define-chronos-plugin.ts
function fe(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function pe() {
	return "1.3.5";
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
// packages/plugins/codec-share/src/share-link/import-course-utils.ts
function he(e) {
	return s(e).sort((e, t) => e.dayOfWeek === t.dayOfWeek ? e.startPeriod === t.startPeriod ? e.endPeriod - t.endPeriod : e.startPeriod - t.startPeriod : e.dayOfWeek - t.dayOfWeek);
}
// packages/plugins/codec-share/src/share-link/location-codec.ts
var ge = /^(.+?[楼馆])([A-Za-z]?\d[\w]*)$/;
function _e(e) {
	let t = e.trim();
	if (!t) return {
		kind: "full",
		value: ""
	};
	let n = ge.exec(t);
	return !n?.[1] || !n[2] ? {
		kind: "full",
		value: t
	} : {
		kind: "split",
		building: n[1],
		room: n[2].slice(0, 5)
	};
}
function ve(e) {
	return e.kind === "full" ? e.value : `${e.building}${e.room}`;
}
function ye(e, t) {
	let n = e.trim().slice(0, 5);
	for (let e = 0; e < 5; e += 1) {
		let r = n.charCodeAt(e);
		t.push(e < n.length && r > 0 ? r : 32);
	}
}
function be(e, t) {
	let n = "";
	for (let r = 0; r < 5; r += 1) {
		let i = e[t + r];
		i !== void 0 && i !== 32 && i !== 0 && (n += String.fromCharCode(i));
	}
	return n.trim();
}
function xe(e) {
	return e.trim().length === 0;
}
// packages/codec-kit/src/deflate.ts
async function Se(e) {
	if (typeof CompressionStream > "u") {
		let t = await import(
			/* @vite-ignore */
			"node:zlib"
);
		return new Uint8Array(t.deflateRawSync(Buffer.from(e)));
	}
	let t = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new CompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
async function Ce(e) {
	if (typeof DecompressionStream > "u") {
		let t = await import(
			/* @vite-ignore */
			"node:zlib"
);
		return new Uint8Array(t.inflateRawSync(Buffer.from(e)));
	}
	let t = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new DecompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
// packages/codec-kit/src/base64.ts
var we = 8192;
function Te(e) {
	let t = "";
	for (let n = 0; n < e.length; n += we) t += String.fromCharCode(...e.subarray(n, n + we));
	return t;
}
function Ee(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n += 1) t[n] = e.charCodeAt(n);
	return t;
}
function De(e) {
	return btoa(Te(e));
}
function Oe(e) {
	return De(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function ke(e) {
	return Ee(atob(e));
}
function Ae(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/");
	return ke(t + "=".repeat((4 - t.length % 4) % 4));
}
// packages/codec-kit/src/crc32.ts
var je = (() => {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t += 1) {
		let n = t;
		for (let e = 0; e < 8; e += 1) n = n & 1 ? n >>> 1 ^ 3988292384 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
})();
function Me(e) {
	let t = 4294967295;
	for (let n of e) t = (je[(t ^ n) & 255] ^ t >>> 8) >>> 0;
	return (t ^ 4294967295) >>> 0;
}
function Ne(e) {
	let t = Me(e), n = new Uint8Array(e.length + 4);
	return n.set(e), n[e.length] = t & 255, n[e.length + 1] = t >>> 8 & 255, n[e.length + 2] = t >>> 16 & 255, n[e.length + 3] = t >>> 24 & 255, n;
}
function Pe(e) {
	if (e.length < 4) return null;
	let t = e.subarray(0, -4), n = e[e.length - 4] | e[e.length - 3] << 8 | e[e.length - 2] << 16 | e[e.length - 1] << 24;
	return Me(t) === n >>> 0 ? t : null;
}
// packages/codec-kit/src/varint.ts
function Fe(e, t) {
	if (e < 0) throw RangeError("varint value must be non-negative");
	let n = e;
	do {
		let e = n & 127;
		n >>>= 7, n > 0 && (e |= 128), t.push(e);
	} while (n > 0);
}
var Ie = class {
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
function Le(e) {
	let t = e.filter((e) => e < 1 || e > 32);
	if (t.length > 0) throw RangeError(`week out of range: ${t.join(", ")}`);
}
function Re(e) {
	Le(e);
	let t = 0;
	for (let n of e) t |= 1 << n - 1;
	return t >>> 0;
}
function ze(e) {
	let t = [];
	for (let n = 1; n <= 32; n += 1) e & 1 << n - 1 && t.push(n);
	return t;
}
// packages/codec-kit/src/interner.ts
var Be = class {
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
}, Ve = 128, He = 255;
function Ue(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e - t), n = t.every((e, n) => n === 0 || e === t[n - 1] + 1), r = t[0], i = t[t.length - 1];
	if (n && r >= 1 && r <= 127 && i <= 255) return [Ve | r, i];
	let a = Re(t);
	return [
		a & 255,
		a >>> 8 & 255,
		a >>> 16 & 255,
		a >>> 24 & 255
	];
}
function We(e) {
	if (e.length === 0) return [];
	if (e.length === 2 && (e[0] & Ve) !== 0) {
		let t = e[0] & 127, n = e[1];
		return !n || n < t ? [] : Array.from({ length: n - t + 1 }, (e, n) => t + n);
	}
	return e.length === 4 ? ze((e[0] | e[1] << 8 | e[2] << 16 | e[3] << 24) >>> 0) : [];
}
var Ge = class e {
	entries = [];
	indexOf = /* @__PURE__ */ new Map();
	intern(e) {
		let t = Ue(e), n = t.join(","), r = this.indexOf.get(n);
		if (r !== void 0) return r;
		if (this.entries.length >= He) throw Error("week mask table overflow");
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
		return t ? We(t) : [];
	}
}, Ke = 14, qe = class e {
	names = [];
	indexOf = /* @__PURE__ */ new Map();
	intern(e) {
		let t = e.trim();
		if (!t) return 0;
		let n = this.indexOf.get(t);
		if (n !== void 0) return n;
		if (this.names.length >= Ke) throw Error("teacher table overflow");
		let r = this.names.length + 1;
		return this.names.push(t), this.indexOf.set(t, r), r;
	}
	write(e) {
		e.push(this.names.length);
		for (let t of this.names) {
			let n = new TextEncoder().encode(t);
			Fe(n.length, e);
			for (let t of n) e.push(t);
		}
	}
	static read(t, n) {
		let r = t[n];
		if (r === void 0) throw Error("truncated teacher table");
		let i = new e(), a = new Ie(t);
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
}, Je = [67, 83], Ye = 1, Xe = Date.UTC(2020, 0, 1), Ze = 20, Qe = 255, $e = 255, et = 32, tt = 1440, nt = 1, rt = 2, it = 4, at = 8;
function ot(e) {
	let [t, n, r] = e.split("-").map((e) => Number.parseInt(e, 10));
	if (!t || !n || !r) throw new _("invalid term start date");
	let i = Date.UTC(t, n - 1, r);
	return Math.floor((i - Xe) / 864e5);
}
function st(e) {
	let t = new Date(Xe + e * 864e5);
	return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}
function ct(e) {
	let t = /^(\d{1,2}):(\d{2})$/.exec(e.trim());
	if (!t) throw new _("invalid period time");
	let n = Number.parseInt(t[1], 10), r = Number.parseInt(t[2], 10);
	if (n < 0 || n > 23 || r < 0 || r > 59) throw new _("invalid period time");
	let i = n * 60 + r;
	if (i >= tt) throw new _("invalid period time");
	return i;
}
function lt(e) {
	if (e < 0 || e >= tt) throw new _("invalid period minutes");
	let t = Math.floor(e / 60), n = e % 60;
	return `${String(t).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
}
function ut(e, t) {
	if (e.length > et) throw new _("too many period times");
	t.push(e.length);
	for (let n of e) {
		if (n.index < 1 || n.index > et) throw new _("invalid period index");
		let e = ct(n.startTime), r = ct(n.endTime);
		t.push(n.index), t.push(e & 255, e >> 8 & 255), t.push(r & 255, r >> 8 & 255);
	}
}
function dt(e, t) {
	let n = e[t];
	if (n === void 0) throw new _("truncated period table");
	let r = t + 1, i = [];
	for (let t = 0; t < n; t += 1) {
		if (r + 5 > e.length) throw new _("truncated period entry");
		let t = e[r], n = e[r + 1], a = e[r + 2], o = e[r + 3], s = e[r + 4], c = n | a << 8, l = o | s << 8;
		i.push({
			index: t,
			startTime: lt(c),
			endTime: lt(l)
		}), r += 5;
	}
	return {
		periodTimes: i,
		nextOffset: r
	};
}
var ft = new TextEncoder(), pt = new TextDecoder();
function mt(e, t) {
	t.push(e.strings.length);
	for (let n of e.strings) {
		let e = ft.encode(n);
		Fe(e.length, t);
		for (let n of e) t.push(n);
	}
}
function ht(e, t) {
	let n = e[t];
	if (n === void 0) throw new _("truncated string table");
	let r = [], i = new Ie(e);
	i.position = t + 1;
	for (let t = 0; t < n; t += 1) {
		let t = i.read(), n = i.position, a = e.subarray(n, n + t);
		if (a.length !== t) throw new _("truncated string entry");
		r.push(pt.decode(a)), i.position = n + t;
	}
	return {
		strings: r,
		nextOffset: i.position
	};
}
function gt(e, t, n) {
	return (e & 7) << 5 | (t - 1 & 15) << 1 | !!n;
}
function _t(e) {
	return {
		dayOfWeek: e >> 5 & 7,
		startPeriod: (e >> 1 & 15) + 1,
		hasRemark: (e & 1) == 1
	};
}
function vt(e, t) {
	return (e & 15) << 4 | t & 15;
}
function yt(e) {
	return {
		endPeriod: e >> 4 & 15,
		teacherSlot: e & 15
	};
}
function bt(e, t) {
	return t.kind === "full" ? t.value ? {
		buildingIdx: e.intern(t.value),
		room: ""
	} : {
		buildingIdx: 255,
		room: ""
	} : {
		buildingIdx: e.intern(t.building),
		room: t.room
	};
}
function xt(e) {
	let t = -1;
	for (let n of e) {
		if (!n.isSplitLocation || n.buildingIdx === 255) return -1;
		if (t === -1) t = n.buildingIdx;
		else if (t !== n.buildingIdx) return -1;
	}
	return t;
}
function St(e, t, n) {
	if (t === 255) return "";
	let r = e[t] ?? "";
	return r ? xe(n) ? r : ve({
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
			endWeek: e.academicConfig?.endWeek ?? Ze,
			periodTimes: e.academicConfig?.periodTimes ?? []
		},
		courses: he((e.courses ?? []).map((e) => ({
			...e,
			weeks: [...e.weeks],
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
	if (t.courses.length > $e) throw new _("too many courses");
	let n = new Be({
		maxEntries: Qe,
		seed: t.name
	}), r = new Ge(), i = new qe(), a = t.academicConfig.endWeek || Ze;
	if (a > 32) throw new _(`week out of range: ${a}`);
	let o = t.courses.some((e) => (e.remark?.length ?? 0) > 0), s = t.courses[0]?.weeks ?? [], c = t.courses.length > 0 && t.courses.every((e) => e.weeks.length === s.length && e.weeks.every((e, t) => e === s[t])), l = c ? r.intern(s) : -1, u = t.courses.map((e) => {
		if (!e.name) throw new _("course name is required");
		Le(e.weeks);
		let t = n.intern(e.name), a = i.intern(e.teacher), o = e.remark ? n.intern(e.remark) : -1, s = _e(e.location), u = bt(n, s);
		return {
			nameIdx: t,
			dayPeriod: gt(e.dayOfWeek, e.startPeriod, o >= 0),
			endTeacher: vt(e.endPeriod, a > 0 ? a : 15),
			buildingIdx: u.buildingIdx,
			room: u.room,
			weekMaskIdx: c ? l : r.intern(e.weeks),
			remarkIdx: o,
			isSplitLocation: s.kind === "split"
		};
	}), d = xt(u), f = (o ? nt : 0) | (a === Ze ? 0 : rt) | (c ? it : 0) | (d >= 0 ? at : 0), p = [
		...Je,
		Ye,
		f
	], m = ot(t.academicConfig.termStartDate);
	p.push(m & 255, m >> 8 & 255), (f & rt) !== 0 && p.push(a), p.push(t.courses.length), (f & at) !== 0 && p.push(d), ut(t.academicConfig.periodTimes, p), mt(n, p), r.write(p), i.write(p);
	for (let e of u) p.push(e.nameIdx);
	for (let e of u) p.push(e.dayPeriod);
	for (let e of u) p.push(e.endTeacher);
	if ((f & at) === 0) for (let e of u) p.push(e.buildingIdx);
	for (let e of u) ye(e.room, p);
	if ((f & it) === 0) for (let e of u) p.push(e.weekMaskIdx);
	if ((f & nt) !== 0) for (let e of u) p.push(e.remarkIdx >= 0 ? e.remarkIdx : 0);
	return Uint8Array.from(p);
}
function Et(e, t = Date.now()) {
	if (e.length < 6) throw new _("payload too short");
	if (e[0] !== Je[0] || e[1] !== Je[1]) throw new _("invalid magic");
	if (e[2] !== Ye) throw new _("unsupported version");
	let n = e[3], r = e[4] | e[5] << 8, i = 6, a = Ze;
	if ((n & rt) !== 0) {
		if (a = e[i], a === void 0) throw new _("truncated header");
		if (a > 32) throw new _(`week out of range: ${a}`);
		i += 1;
	}
	let o = e[i];
	if (o === void 0 || o === 0) throw new _("no courses in payload");
	i += 1;
	let s = -1;
	if ((n & at) !== 0) {
		if (s = e[i], s === void 0) throw new _("truncated header");
		i += 1;
	}
	let { periodTimes: l, nextOffset: d } = dt(e, i);
	i = d;
	let { strings: f, nextOffset: p } = ht(e, i);
	i = p;
	let { table: m, nextOffset: h } = Ge.read(e, i);
	i = h;
	let { table: g, nextOffset: ee } = qe.read(e, i);
	i = ee;
	let te = i;
	i += o;
	let ne = i;
	i += o;
	let re = i;
	i += o;
	let ie = (n & at) !== 0, ae = i;
	ie || (i += o);
	let oe = i;
	i += o * 5;
	let se = (n & it) !== 0, ce = i;
	se || (i += o);
	let le = se ? 0 : -1, ue = (n & nt) !== 0, de = i;
	if (ue && (i += o), e.length < i) throw new _("truncated course columns");
	let fe = u(f[0] ?? ""), pe = [];
	for (let t = 0; t < o; t += 1) {
		let n = e[te + t], r = e[ne + t], i = e[re + t], a = ie ? s : e[ae + t], o = le >= 0 ? le : e[ce + t], c = ue ? e[de + t] ?? 0 : 0, l = be(e, oe + t * 5), { dayOfWeek: u, startPeriod: d } = _t(r);
		if (u < 1 || u > 7) throw new _("invalid day of week");
		let { endPeriod: p, teacherSlot: h } = yt(i), ee = f[n];
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
			termStartDate: st(r),
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
// packages/plugins/codec-share/src/share-link/share-link-compression.ts
var Dt = 262144, Ot = class extends Error {
	constructor() {
		super("share payload exceeds decompression limit");
	}
}, kt = Se;
async function At(e, t = Dt) {
	if (typeof DecompressionStream > "u") {
		let n = await Ce(e);
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
// packages/plugins/codec-share/src/messages.ts
function jt(e) {
	return oe({ content: {
		type: "string",
		title: () => e("import.field.content.title"),
		placeholder: () => e("import.field.content.placeholder"),
		required: !0
	} });
}
var Mt = {
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
}, Nt = 65536, Pt = Mt["zh-cn"];
function Ft(e) {
	return {
		ok: !0,
		value: e
	};
}
function It(e) {
	return {
		ok: !1,
		errorMessage: e
	};
}
async function Lt(e) {
	return `1.${Oe(await kt(Ne(Tt(e))))}`;
}
async function Rt(e, t = Pt) {
	let n = e.trim();
	if (n.length > Nt) return It(t["share.error.corrupted"]);
	if (!n.startsWith("1.")) return It(t["share.error.unsupported"]);
	try {
		let e = Pe(await At(Ae(n.slice(2))));
		if (!e) throw new _("checksum mismatch");
		return Ft(Et(e));
	} catch (e) {
		return e instanceof Ot ? It(t["share.error.corrupted"]) : It(e instanceof _ ? e.message === "checksum mismatch" ? t["share.error.corrupted"] : e.message : e instanceof Error ? e.message : t["share.error.parseFailed"]);
	}
}
async function zt(e, t) {
	let n = await Lt(e), r = new URL(t);
	return r.hash = n, r.href;
}
function Bt(e, t, n = Pt) {
	let r = u(e) || n["share.clipboard.unnamed"];
	return n["share.clipboard.template"].replace("{name}", r).replace("{link}", t);
}
async function Vt(e, t) {
	return t === null ? (await Lt(e)).length : (await zt(e, t)).length;
}
function Ht(e) {
	return e.startsWith("1.");
}
function Ut(e) {
	return e.replace(/[^A-Za-z0-9\-_]+$/, "");
}
function Wt(e) {
	try {
		return decodeURIComponent(e);
	} catch {
		return e;
	}
}
function Gt(e) {
	let t = Ut(Wt(e.trim().split(/\s/)[0] ?? ""));
	return Ht(t) ? t : null;
}
function Kt(e) {
	let t = e.trim();
	try {
		let e = new URL(t), n = Gt(e.hash.startsWith("#") ? e.hash.slice(1) : e.hash);
		if (n) return n;
		let r = e.searchParams.get("d");
		if (r) return Gt(r);
	} catch {
		let e = t.indexOf("#");
		if (e >= 0) {
			let n = Gt(t.slice(e + 1));
			if (n) return n;
		}
	}
	return null;
}
function qt(e) {
	let t = Ut(Wt(e.hash.startsWith("#") ? e.hash.slice(1) : e.hash));
	if (Ht(t)) return t;
	let n = new URLSearchParams(e.search).get("d");
	if (n) {
		let e = Ut(n);
		if (Ht(e)) return e;
	}
	return null;
}
function Jt(e) {
	let t = e.trim(), n = Gt(t);
	if (n) return n;
	for (let e of t.split(/\r?\n/)) {
		let t = e.trim().match(/https?:\/\/\S+/);
		if (!t) continue;
		let n = Kt(t[0]);
		if (n) return n;
	}
	return Kt(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/constants.js
var Yt = {}, v = Symbol("uninitialized"), Xt = Array.isArray, Zt = Array.prototype.indexOf, Qt = Array.prototype.includes, $t = Array.from, en = Object.defineProperty, tn = Object.getOwnPropertyDescriptor, nn = Object.prototype, rn = Array.prototype, an = Object.getPrototypeOf, on = Object.isExtensible;
function sn(e) {
	return typeof e == "function";
}
var cn = () => {};
function ln(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function un() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var y = 1024, b = 2048, x = 4096, dn = 8192, fn = 16384, pn = 32768, mn = 1 << 25, hn = 65536, gn = 1 << 19, _n = 1 << 20, vn = 1 << 21, yn = 1 << 22, bn = 1 << 23, xn = Symbol("$state"), Sn = Symbol("component"), Cn = Symbol("legacy props"), wn = Symbol("attributes"), Tn = Symbol("class"), En = Symbol("style"), Dn = Symbol("text"), On = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
function kn() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function An(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function jn() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/hydration.js
var S = !1;
function Mn(e) {
	S = e;
}
var C;
function w(e) {
	if (e === null) throw An(), Yt;
	return C = e;
}
function Nn() {
	return w(/* @__PURE__ */ I(C));
}
function Pn(e) {
	if (S) {
		if (/* @__PURE__ */ I(C) !== null) throw An(), Yt;
		C = e;
	}
}
function Fn(e = 1) {
	if (S) {
		for (var t = e, n = C; t--;) n = /* @__PURE__ */ I(n);
		C = n;
	}
}
function In(e = !0) {
	for (var t = 0, n = C;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ I(n);
		e && n.remove(), n = i;
	}
}
function Ln(e) {
	if (!e || e.nodeType !== 8) throw An(), Yt;
	return e.data;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/equality.js
function Rn(e) {
	return e === this.v;
}
function zn(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Bn(e) {
	return !zn(e, this.v);
}
function Vn(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Hn() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/errors.js
function Un() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Wn() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Gn() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Kn() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function qn() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Jn() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/context.js
function Yn(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Hn(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Xn(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Zn(e, t) {
	return e === null && Vn(t), e.c ??= new Map(Xn(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/context.js
var T = null;
function Qn(e) {
	T = e;
}
function $n() {
	return Yn(er, tr, nr);
}
function er(e) {
	return Zn(T, "getContext").get(e);
}
function tr(e, t) {
	return Zn(T, "setContext").set(e, t), t;
}
function nr(e) {
	return Zn(T, "hasContext").has(e);
}
function rr(e, t = !1, n) {
	T = {
		p: T,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: null
	};
}
function ir(e) {
	var t = T, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) mi(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, T = t.p, ar(e);
}
function ar(e = {}) {
	return en(e, Sn, { value: !0 }), e;
}
function or() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/task.js
var sr = [];
function cr() {
	var e = sr;
	sr = [], ln(e);
}
function E(e) {
	if (sr.length === 0 && !Ar) {
		var t = sr;
		queueMicrotask(() => {
			t === sr && cr();
		});
	}
	sr.push(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/status.js
var lr = ~(b | x | y);
function D(e, t) {
	e.f = e.f & lr | t;
}
function ur(e) {
	e.f & 512 || e.deps === null ? D(e, y) : D(e, x);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/utils.js
function dr(e, t) {
	e.f & 2048 ? t.set(e, b) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, x), D(e, y);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function fr(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/async.js
function pr(e, t, n, r) {
	let i = or() ? _r : xr;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = mr(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				L(e, s);
			}
			hr();
		}
	}
	var d = gr();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ yr(e))).then(u).catch((e) => L(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), hr());
	}) : f();
}
function mr() {
	var e = G, t = H, n = T, r = O;
	return function(i = !0) {
		K(e), W(t), Qn(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function hr(e = !0) {
	K(null), W(null), Qn(null), e && O?.deactivate();
}
function gr() {
	var e = G, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _r(e) {
	var t = 2 | b;
	return G !== null && (G.f |= gn), {
		ctx: T,
		deps: null,
		effects: null,
		equals: Rn,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v,
		wv: 0,
		parent: G,
		ac: null
	};
}
var vr = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yr(e, t, n) {
	let r = G;
	r === null && Un();
	var i = void 0, a = Wr(v), o = !H, s = /* @__PURE__ */ new Set();
	return gi(() => {
		var t = G, n = un();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== On && n.reject(e);
			}).finally(hr);
		} catch (e) {
			n.reject(e), hr();
		}
		var c = O;
		if (o) {
			if (t.f & 32768) var l = gr();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vr);
			else for (let e of s.values()) e.reject(vr);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vr && (c.activate(), t ? (a.f |= bn, Kr(a, t)) : (a.f & 8388608 && (a.f ^= bn), Kr(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), pi(() => {
		for (let e of s) e.reject(vr);
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
function br(e) {
	let t = /* @__PURE__ */ _r(e);
	return Mi(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function xr(e) {
	let t = /* @__PURE__ */ _r(e);
	return t.equals = Bn, t;
}
function Sr(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function Cr(e) {
	var t, n = G, r = e.parent;
	if (!V && r !== null && e.v !== v && r.f & 24576) return kn(), e.v;
	K(r);
	try {
		Sr(e), t = Bi(e);
	} finally {
		K(n);
	}
	return t;
}
function wr(e) {
	var t = Cr(e);
	!e.equals(t) && (e.wv = Li(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), Or?.capture(e, t, !0)), e.deps === null)) ? D(e, y) : V || (k === null ? ur(e) : (fi() || O?.is_fork) && k.set(e, t));
}
function Tr(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && fr(() => {
		t.ac.abort(On), t.ac = null;
	}), t.fn !== null && (t.teardown = cn), Ui(t, 0), xi(t));
}
function Er(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Wi(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/batch.js
var Dr = null, O = null, Or = null, k = null, kr = null, Ar = !1, jr = !1, Mr = null, Nr = null, Pr = 0, Fr = 1, Ir = class e {
	id = Fr++;
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
		Dr === null ? Dr = this : (Dr.next = this, this.prev = Dr), Dr = this;
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
			for (var r of n.d) D(r, b), t(r);
			for (r of n.m) D(r, x), t(r);
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
					t.f ^= y;
				}
			}
			n || e.push(t);
		}
		return this.#a = [], e;
	}
	#m() {
		this.started = !0;
		for (let [e, t] of this.#s) D(e, t), this.schedule(e);
		this.apply();
		for (var t = Mr = [], n = [], r = Nr = []; this.#a.length > 0;) {
			Pr++ > 1e3 && (this.#b(), Lr());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw Vr(e), this.#d() || this.discard(), t;
			}
		}
		if (O = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Mr = null, Nr = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) Br(e, t);
			r.length > 0 && O.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), Or = this, Rr(n), Rr(t), Or = null, this.#i?.resolve();
			var o = O;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (j.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= y;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= y : i & 4 ? t.push(r) : Ri(r) && (i & 16 && this.add_dirty_reaction(r, x), Wi(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), D(i, b), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), O = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) dr(e[t], this.#s);
	}
	capture(e, t, n = !1) {
		e.v !== v && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), k?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		O = this;
	}
	deactivate() {
		O = null, k = null;
	}
	flush() {
		try {
			jr = !0, O = this, this.#m();
		} finally {
			Pr = 0, kr = null, Mr = null, Nr = null, jr = !1, O = null, k = null, j.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(vr);
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
		this.#u || (this.#u = !0, E(() => {
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
		return (this.#i ??= un()).promise;
	}
	static ensure() {
		if (O === null) {
			let t = O = new e();
			!jr && E(() => {
				t.started || t.flush();
			});
		}
		return O;
	}
	apply() {
		k = null;
	}
	schedule(e) {
		kr = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e);
	}
	#b() {
		if (this.linked) {
			var e = this.prev, t = this.next;
			e === null || (e.next = t), t === null ? Dr = e : t.prev = e, this.linked = !1;
		}
	}
};
function Lr() {
	try {
		Wn();
	} catch (e) {
		L(e, kr);
	}
}
var A = null;
function Rr(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Ri(r) && (A = /* @__PURE__ */ new Set(), Wi(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && wi(r), A?.size > 0)) {
				j.clear();
				for (let e of A) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) A.has(n) && (A.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Wi(n);
					}
				}
				A.clear();
			}
		}
		A = null;
	}
}
function zr(e) {
	O.schedule(e);
}
function Br(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), D(e, y);
		for (var n = e.first; n !== null;) Br(n, t), n = n.next;
	}
}
function Vr(e) {
	D(e, y);
	for (var t = e.first; t !== null;) Vr(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/sources.js
var Hr = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Map(), Ur = !1;
function Wr(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Rn,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Wr(e, t);
	return Mi(n), n;
}
function N(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && or() && H.f & 4325394 && (q === null || !q.has(e)) && qn(), Kr(e, n ? Xr(t) : t, Nr);
}
var P = null, Gr = 0;
function Kr(e, t, n = null) {
	if (!e.equals(t)) {
		V ? j.set(e, t) : j.has(e) || j.set(e, e.v);
		var r = Ir.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Cr(t), k === null && ur(t);
		}
		e.wv = Li(), P = null, Gr = 0, Yr(e, b, n), P = null, or() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? Ni([e]) : X.push(e)), !r.is_fork && Hr.size > 0 && !Ur && qr();
	}
	return t;
}
function qr() {
	Ur = !1;
	for (let e of Hr) {
		e.f & 1024 && D(e, x);
		let t;
		try {
			t = Ri(e);
		} catch {
			t = !0;
		}
		t && Wi(e);
	}
	Hr.clear();
}
function Jr(e) {
	N(e, e.v + 1);
}
function Yr(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = or(), a = r.length;
		if (Gr += a, Gr > 1e5 && P === null && (P = /* @__PURE__ */ new Set()), P !== null) {
			if (P.has(e)) return;
			P.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & b) === 0;
				if (l && D(s, t), c & 131072) Hr.add(s);
				else if (c & 2) {
					var u = s;
					k?.delete(u), Yr(u, x, n);
				} else if (l) {
					var d = s;
					c & 16 && A !== null && A.add(d), n === null ? zr(d) : n.push(d);
				}
			}
		}
	}
}
function Xr(e) {
	if (typeof e != "object" || !e || xn in e || Sn in e) return e;
	let t = an(e);
	if (t !== nn && t !== rn) return e;
	var n = /* @__PURE__ */ new Map(), r = Xt(e), i = /* @__PURE__ */ M(0), a = null, o = Z, s = (e) => {
		if (Z === o) return e();
		var t = H, n = Z;
		W(null), Ii(o);
		var r = e();
		return W(t), Ii(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ M(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || Gn();
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
					let e = s(() => /* @__PURE__ */ M(v, a));
					n.set(t, e), Jr(i);
				}
			} else N(r, v), Jr(i);
			return !0;
		},
		get(t, r, i) {
			if (r === xn) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || tn(t, r)?.writable) && (o = s(() => /* @__PURE__ */ M(Xr(c ? t[r] : v), a)), n.set(r, o)), o !== void 0) {
				var l = Q(o);
				return l === v ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = Q(i);
				if (a === v) return;
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
			if (t === xn) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== v || Reflect.has(e, t);
			return (r !== void 0 || (G !== null || H !== null) && (!i || tn(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ M(i ? Xr(e[t]) : v, a)), n.set(t, r)), Q(r) === v) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ M(v, a)), n.set(d + "", f)) : N(f, v);
			}
			if (l === void 0) (!u || tn(e, t)?.writable) && (l = s(() => /* @__PURE__ */ M(void 0, a)), N(l, Xr(o)), n.set(t, l));
			else {
				u = l.v !== v;
				var p = s(() => Xr(o));
				N(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && N(h, g + 1);
				}
				Jr(i);
			}
			return !0;
		},
		ownKeys(e) {
			Q(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== v;
			});
			for (var [r, a] of n) a.v !== v && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Kn();
		}
	});
}
var Zr, Qr, $r, ei;
function ti() {
	if (Zr === void 0) {
		Zr = window, Qr = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		$r = tn(t, "firstChild").get, ei = tn(t, "nextSibling").get, on(e) && (e[Tn] = void 0, e[wn] = null, e[En] = void 0, e.__e = void 0), on(n) && (n[Dn] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ni(e) {
	return $r.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function I(e) {
	return ei.call(e);
}
function ri(e, t) {
	if (!S) return /* @__PURE__ */ ni(e);
	var n = /* @__PURE__ */ ni(C);
	if (n === null) n = C.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), w(r), r;
	}
	return t && li(n), w(n), n;
}
function ii(e, t = !1) {
	if (!S) {
		var n = /* @__PURE__ */ ni(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ I(n) : n;
	}
	if (t) {
		if (C?.nodeType !== 3) {
			var r = F();
			return C?.before(r), w(r), r;
		}
		li(C);
	}
	return C;
}
function ai(e, t = !1) {
	if (!S) return /* @__PURE__ */ ni(e);
	var n = ri(e, t);
	return Pn(e), n;
}
function oi(e, t = 1, n = !1) {
	let r = S ? C : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ I(r);
	if (!S) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), w(a), a;
		}
		li(r);
	}
	return w(r), r;
}
function si() {
	return !1;
}
function ci(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function li(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function ui(e) {
	var t = G;
	if (t === null) return H.f |= bn, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	L(e, t);
}
function L(e, t) {
	if (e === Yt) throw e;
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
function di(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function R(e, t) {
	var n = G;
	n !== null && n.f & 8192 && (e |= dn);
	var r = {
		ctx: T,
		deps: null,
		nodes: null,
		f: e | b | 512,
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
	if (e & 4) Mr === null ? Ir.ensure().schedule(r) : Mr.push(r);
	else if (t !== null) {
		try {
			Wi(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= hn));
	}
	if (i !== null && (i.parent = n, n !== null && di(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function fi() {
	return H !== null && !U;
}
function pi(e) {
	let t = R(8, null);
	return D(t, y), t.teardown = e, t;
}
function mi(e) {
	return R(4 | _n, e);
}
function hi(e) {
	Ir.ensure();
	let t = R(64 | gn, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ti(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function gi(e) {
	return R(yn | gn, e);
}
function _i(e, t = 0) {
	return R(8 | t, e);
}
function vi(e, t = [], n = [], r = []) {
	pr(r, t, n, (t) => {
		R(8, () => {
			e(...t.map(Q));
		});
	});
}
function yi(e, t = 0) {
	return R(16 | t, e);
}
function z(e) {
	return R(32 | gn, e);
}
function bi(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = V, r = H;
		ji(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			L(t, e.parent);
		} finally {
			ji(n), W(r);
		}
	}
}
function xi(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && fr(() => {
			e.abort(On);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Si(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ci(e.nodes.start, e.nodes.end), n = !0), e.f |= mn, xi(e, t && !n), Ui(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	bi(e), e.f ^= mn, e.f |= fn;
	var i = e.parent;
	i !== null && i.first !== null && wi(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Ci(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ I(e);
		e.remove(), e = n;
	}
}
function wi(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ti(e, t, n = !0) {
	var r = [];
	e.f |= 256, Ei(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Ei(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= dn;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Ei(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Di(e) {
	e.f &= -257, Oi(e, !0);
}
function Oi(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= dn, e.f & 1024 || (D(e, b), Ir.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Oi(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function ki(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ I(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/legacy.js
var Ai = null, V = !1;
function ji(e) {
	V = e;
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
function Mi(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function Ni(e) {
	X = e;
}
var Pi = 1, Fi = 0, Z = Fi;
function Ii(e) {
	Z = e;
}
function Li() {
	return ++Pi;
}
function Ri(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Ri(a) && wr(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && D(e, y);
	}
	return !1;
}
function zi(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? zi(a, t, !1) : t === a && (n ? D(a, b) : a.f & 1024 && D(a, x), zr(a));
	}
}
function Bi(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = T, s = U, c = Z, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Qn(e.ctx), U = !1, Z = ++Fi, e.ac !== null && (fr(() => {
		e.ac.abort(On);
	}), e.ac = null);
	try {
		e.f |= vn;
		var u = e.fn, d = u();
		e.f |= pn;
		var f = Vi(e);
		if (or() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) zi(X[p], e);
		if (i !== null && i !== e) {
			if (Fi++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Fi;
			if (t !== null) for (let e of t) e.rv = Fi;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= bn), d;
	} catch (t) {
		return Vi(e), ui(t);
	} finally {
		e.f ^= vn, J = t, Y = n, X = r, H = i, q = a, Qn(o), U = s, Z = c;
	}
}
function Vi(e) {
	var t = e.deps, n = O?.is_fork;
	if (J !== null) {
		var r;
		if (n || Ui(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (fi() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Ui(e, Y), t.length = Y);
	return t;
}
function Hi(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = Zt.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (J === null || !Qt.call(J, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== v && ur(a), a.ac !== null && fr(() => {
			a.ac.abort(On), a.ac = null, D(a, b);
		}), Tr(a), Ui(a, 0);
	}
}
function Ui(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Hi(e, n[r]);
}
function Wi(e) {
	var t = e.f;
	if (!(t & 16384)) {
		D(e, y);
		var n = G;
		G = e;
		try {
			t & 16777232 ? Si(e) : xi(e), bi(e);
			var r = Bi(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Pi;
		} finally {
			G = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if (Ai?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Fi && (e.rv = Fi, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], Qt.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : Qt.call(r, H) || r.push(H);
		}
	}
	if (V && j.has(e)) return j.get(e);
	if (t) {
		var i = e;
		if (V) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Ki(i)) && (a = Cr(i)), j.set(i, a), a;
		}
		var o = !(i.f & 512) && !U && H !== null && !!(H.f & 512), s = (i.f & pn) === 0;
		Ri(i) && (o && (i.f |= 512), wr(i)), o && !s && (Er(i), Gi(i));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Gi(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : Qt.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (Er(n), Gi(n));
	}
}
function Ki(e) {
	if (e.v === v) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (j.has(t) || t.f & 2 && Ki(t)) return !0;
	return !1;
}
function qi(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/events.js
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
		en(e, "currentTarget", {
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
					var m = a[Ji]?.[r];
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
			e[Ji] = t, delete e.currentTarget, W(u), K(d);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/reconciler.js
var ta = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function na(e) {
	return ta?.createHTML(e) ?? e;
}
function ra(e) {
	var t = ci("template");
	return t.innerHTML = na(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/template.js
function ia(e, t) {
	var n = G;
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
		if (S) return ia(C, null), C;
		i === void 0 && (i = ra(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ni(i)));
		var t = r || Qr ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ni(t), s = t.lastChild;
			ia(o, s);
		} else ia(t, t);
		return t;
	};
}
function oa() {
	if (S) return ia(C, null), C;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), ia(t, n), e;
}
function sa(e, t) {
	if (S) {
		var n = G;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = C), Nn();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ca = ["touchstart", "touchmove"];
function la(e) {
	return ca.includes(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/create-subscriber.js
function ua(e) {
	let t = 0, n = Wr(0), r;
	return () => {
		fi() && (Q(n), _i(() => (t === 0 && (r = qi(() => e(() => Jr(n)))), t += 1, () => {
			E(() => {
				--t, t === 0 && (r?.(), r = void 0, Jr(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var da = hn | gn;
function fa(e, t, n, r) {
	new pa(e, t, n, r);
}
var pa = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = S ? C : null;
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
	#m = ua(() => (this.#p = Wr(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = yi(() => {
			if (S) {
				let e = Ln(this.#t);
				Nn();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, da), S && (this.#e = C);
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
		E(r), t && (this.#s = z(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? jn() : (t = !0, n && Jn(), this.#s !== null && Ti(this.#s, () => {
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
		return (this.#i.f & (fn | mn)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), E(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
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
				}), this.#a === null ? (this.#c = null, n && this.#x(O)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Ti(this.#o, () => {
					this.#o = null;
				}), this.#x(O));
			}
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				ki(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
			} else this.#x(O);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		dr(e, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = T;
		K(this.#i), W(this.#i), Qn(this.#i.ctx);
		try {
			return Ir.ensure(), e();
		} finally {
			K(t), W(n), Qn(r);
		}
	}
	#C(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Ti(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, E(() => {
			this.#d = !1, this.#p && Kr(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), Q(this.#p);
	}
	error(e) {
		if (e === Yt || !this.#n.onerror && !this.#n.failed) throw e;
		O?.is_fork ? (this.#a && O.skip_effect(this.#a), this.#o && O.skip_effect(this.#o), this.#s && O.skip_effect(this.#s), O.oncommit(() => {
			this.#v() || this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), S && (w(this.#t), Fn(), w(In()));
		let t = this.#n.failed, n = (e) => {
			if (this.#v()) return;
			let { reset: n, invoke_onerror: r } = this.#_(e);
			r(), t && !this.#v() && (this.#s = this.#S(() => {
				try {
					return z(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return L(e, this.#i.parent), null;
				}
			}));
		};
		E(() => {
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
function ma(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[Dn] ??= e.nodeValue) && (e[Dn] = n, e.nodeValue = `${n}`);
}
function ha(e, t) {
	return _a(e, t);
}
var ga = /* @__PURE__ */ new Map();
function _a(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	ti();
	var c = void 0, l = hi(() => {
		var o = n ?? t.appendChild(F());
		fa(o, { pending: () => {} }, (t) => {
			rr({});
			var n = T;
			if (a && (n.c = a), i && (r.$$events = i), S && ia(t, null), c = e(t, r) || ar(), S && (G.nodes.end = C, C === null || C.nodeType !== 8 || C.data !== "]")) throw An(), Yt;
			ir();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = la(r);
					for (let e of [t, document]) {
						var a = ga.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ga.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, ea, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u($t(Yi)), Xi.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = ga.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, ea), r.delete(e), r.size === 0 && ga.delete(n)) : r.set(e, i);
			}
			Xi.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return va.set(c, l), c;
}
var va = /* @__PURE__ */ new WeakMap();
function ya(e, t) {
	let n = va.get(e);
	return n ? (va.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var ba = class {
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
			if (n) Di(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Di(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						ki(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Ti(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = O, r = si();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = F();
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
		} else S && (this.anchor = C), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function xa(e, t, n) {
	var r;
	S && (r = C, Nn());
	var i = new ba(e);
	yi(() => {
		var e = t() ?? null;
		if (S && Ln(r) === "[" != (e !== null)) {
			var a = In();
			w(a), i.anchor = a, Mn(!1), i.ensure(e, e && ((t) => n(t, e))), Mn(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, hn);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/utils.js
function Sa(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), cn;
	let r = qi(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/shared/index.js
var Ca = [];
function wa(e, t = cn) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (zn(e, t) && (e = t, n)) {
			let t = !Ca.length;
			for (let t of r) t[1](), Ca.push(t, e);
			if (t) {
				for (let e = 0; e < Ca.length; e += 2) Ca[e][0](Ca[e + 1]);
				Ca.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = cn) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || cn), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Ta(e) {
	let t;
	return Sa(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/props.js
var Ea = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (sn(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			sn(i) && (i = i());
			let a = tn(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (sn(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = tn(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === xn || t === Cn) return !1;
		for (let n of e.props) if (sn(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (sn(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function Da(...e) {
	return new Proxy({ props: e }, Ea);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/index-client.js
function Oa(e) {
	let t, n = ua((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return fi() ? (n(), t) : Ta(e);
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
$(["input"]), $(["change"]), $(["change"]), ua((e) => {
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
}), $([
	"click",
	"pointerdown",
	"pointerup"
]), $(["change"]);
// packages/ui-kit/src/overlay/history-overlay.ts
var ka = Symbol("overlay-lifecycle"), Aa = "__CHRONOS_NATIVE__";
function ja() {
	if (typeof window > "u") return null;
	let e = window[Aa];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
// packages/ui-kit/src/form/TimePicker.svelte
d.hapticFeedbackEnabled, $(["click"]), $(["click", "keydown"]), d.reduceMotionEnabled, $(["pointerdown"]), $(["keydown", "click"]), $(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var Ma = /* @__PURE__ */ aa("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function Na(e, t) {
	rr(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = Ma(), i = ri(r), a = ai(i, !0), o = oi(i, 2), s = ai(o, !0);
	Pn(r), vi((e, t) => {
		ma(a, e), ma(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), Zi("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), sa(e, r), ir();
}
$(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [Pa, Fa] = $n();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
$(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var Ia = /* @__PURE__ */ aa("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function La(e, t) {
	rr(t, !0), tr(ka, qi(() => Ta(t.propsStore)).overlayParent);
	let n = /* @__PURE__ */ br(() => t.component), r = /* @__PURE__ */ br(() => Oa(t.propsStore).current);
	var i = Ia();
	fa(ri(i), {
		onerror: (e) => {
			console.error("[MountableSvelteHost] render failed:", e), t.onFailure?.(e);
		},
		failed: (e, t = cn, n = cn) => {
			Na(e, {
				get controller() {
					return Q(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = oa();
		xa(ii(t), () => Q(n), (e, t) => {
			t(e, Da(() => Q(r)));
		}), sa(e, t);
	}), Pn(i), sa(e, i), ir();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Ra(e) {
	return {
		[de]: !0,
		mount(t, n, r) {
			let i = !1, a = wa({ ...n }), o = ha(La, {
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
					i = !0, ya(o).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function za(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return le(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? le(a, i) : o;
}
// packages/ui-kit/src/plugin-screen/import-tab-props.ts
async function Ba(e, t, n, r) {
	let i = await e.previewWithSlot(t, n);
	return !i && e.state.errorMessage && r.actions.notify(e.state.errorMessage, "error"), i;
}
// packages/ui-kit/src/platform/clipboard.ts
async function Va() {
	let e = ja();
	if (e) try {
		let t = await e.callNative("clipboard", "readText");
		if (typeof t == "string") return t;
	} catch {}
	if (typeof navigator < "u" && navigator.clipboard?.readText) return navigator.clipboard.readText();
	throw Error("Clipboard read is not supported");
}
// packages/plugins/codec-share/src/ShareLinkImportTab.svelte
var Ha = /* @__PURE__ */ aa("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p></div> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button></div></div></div>");
function Ua(e, t) {
	rr(t, !0);
	let n = "codec-share", r = /* @__PURE__ */ M(!1), i = /* @__PURE__ */ br(() => za(t.controller, n, Mt, "import.ui.title")), a = /* @__PURE__ */ br(() => za(t.controller, n, Mt, "import.ui.subtitle")), o = /* @__PURE__ */ br(() => za(t.controller, n, Mt, "import.ui.loading")), s = /* @__PURE__ */ br(() => za(t.controller, n, Mt, "import.ui.clipboard"));
	async function c() {
		N(r, !0);
		try {
			let e = await Va();
			await Ba(t.transfer, "share-link", { content: e.trim() }, t.context) && t.onContinue();
		} catch (e) {
			let r = e instanceof Error ? e.message : za(t.controller, n, Mt, "import.ui.clipboardError");
			t.context.actions.notify(r, "error");
		} finally {
			N(r, !1);
		}
	}
	var l = Ha(), u = ri(l), d = ri(u), f = ri(d), p = ai(f, !0), m = ai(oi(f, 2), !0);
	Pn(d);
	var h = oi(d, 2), g = ri(h), ee = ai(g, !0);
	Pn(h), Pn(u), Pn(l), vi(() => {
		ma(p, Q(i)), ma(m, Q(a)), g.disabled = Q(r), ma(ee, Q(r) ? Q(o) : Q(s));
	}), Zi("click", g, c), sa(e, l), ir();
}
$(["click"]);
// packages/plugins/codec-share/src/index.ts
function Wa(e = {}) {
	let { shareComponent: t = Ra(Ua) } = e;
	return me({
		id: "codec-share",
		messages: Mt,
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
			e.registerSlot("import.source.tab", {
				id: "share-link",
				title: () => n("import.tab.title"),
				order: 15,
				importKind: "link",
				component: t,
				inputSchema: r,
				deepLink: { fromLocation(e) {
					let t = qt(e);
					return t ? { content: t } : null;
				} },
				async executeImport(e) {
					let t = e.content;
					if (!t?.trim()) throw new ue("no-data", n("import.error.empty"));
					let r = Jt(t);
					if (!r) throw new ue("no-data", n("import.error.empty"));
					let a = await Rt(r, i);
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
					let t = o(), r = t === null ? await Lt(e) : Bt(e.name, await zt(e, t), a);
					return {
						filename: t === null ? "share-token.txt" : "share-link.txt",
						mimeType: t === null ? "text/plain" : "application/x-chronos-share-link",
						content: r,
						disposition: "clipboard",
						successMessage: () => n(t === null ? "export.tokenSuccess" : "export.success")
					};
				},
				estimateLength: (e) => Vt(e, o()),
				async checkWarning(e) {
					if (!e.courses?.length) return null;
					try {
						return await Vt(e, o()) > 2e3 ? n("export.warning.large") : null;
					} catch {
						return null;
					}
				}
			});
		}
	});
}
var Ga = Wa();
export { Ga as default };
