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
	let s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = [];
	for (let u of e) {
		let e = n(u), d = c.get(e);
		if (d === void 0) {
			c.set(e, l.length), l.push(o(u, r(u.weeks))), s.set(u.id, u.id);
			continue;
		}
		let f = l[d];
		s.set(u.id, f.id);
		let p = i(f.weeks, u.weeks);
		l[d] = o(f, t && p.length > 0 && a(p, t) ? [] : p);
	}
	return {
		courses: l,
		canonicalIds: s
	};
}
function c(e, t) {
	return s(e, t).courses;
}
//#endregion
//#region packages/core/src/domain/timetable.ts
function l(e) {
	return {
		showSaturday: e.some((e) => e.dayOfWeek === 6),
		showSunday: e.some((e) => e.dayOfWeek === 7)
	};
}
var u = "未命名课表";
function d(e) {
	let t = e.trim().slice(0, 50);
	return t.length > 0 ? t : u;
}
//#endregion
//#region packages/core/src/domain/preferences.ts
var f = {
	currentTimetableId: "chronos_preferences:current_timetable_id",
	themeMode: "chronos_preferences:theme_mode",
	timetableLayoutMode: "chronos_preferences:timetable_layout_mode",
	wallpaperSource: "chronos_preferences:wallpaper_source",
	wallpaperColorEnabled: "chronos_preferences:wallpaper_color_enabled",
	wallpaperMaskEnabled: "chronos_preferences:wallpaper_mask_enabled",
	capsuleCornerStyle: "chronos_preferences:capsule_corner_style",
	hapticFeedbackEnabled: "chronos_preferences:haptic_feedback_enabled",
	reduceMotionEnabled: "chronos_preferences:reduce_motion_enabled",
	prepareReminderMinutes: "chronos_preferences:prepare_reminder_minutes",
	classNotificationsEnabled: "chronos_preferences:class_notifications_enabled",
	currentPeriodHighlightEnabled: "chronos_preferences:current_period_highlight_enabled",
	visualThemeId: "chronos_preferences:visual_theme_id",
	locale: "chronos_preferences:locale"
};
//#endregion
//#region packages/core/src/algorithms/date.ts
function p(e) {
	let t = e.trim(), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
	if (!n) throw Error(`Invalid ISO date: ${e}`);
	let [, r, i, a] = n;
	return new Date(Date.UTC(Number(r), Number(i) - 1, Number(a), 12));
}
function m(e) {
	return `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function h(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function g(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function ee(e, t) {
	return g(e, t * 7);
}
function te(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function ne(e, t) {
	return e.getTime() < t.getTime();
}
function re(e) {
	return m(h(p(e)));
}
function ie(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var ae = class {
	normalizeTermStartDate(e, t) {
		let n = p(re(t));
		if (!e || !e.trim()) return m(h(n));
		try {
			return m(h(p(e)));
		} catch {
			return m(h(this.inferTermStartDateFromTermName(e) || n));
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
		}, r = p(this.normalizeTermStartDate(n.termStartDate, e)), i = p(e);
		if (ne(i, r)) return n.startWeek;
		let a = te(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return m(ee(p(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return m(g(p(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
.2126 * oe(15 / 255) + .7152 * oe(23 / 255) + .0722 * oe(42 / 255);
function oe(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/schema/schema-types.ts
function se(e) {
	return e;
}
//#endregion
//#region packages/core/src/types/services.ts
function ce(e) {
	return { key: e };
}
var le = ce("hostLinks");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function ue(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/slots.ts
var de = class extends Error {
	kind;
	constructor(e, t) {
		super(t), this.name = "ImportSlotError", this.kind = e;
	}
}, fe = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function pe(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function me() {
	return "1.2.2";
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
//#endregion
//#region packages/core/src/plugin/register-import-tab.ts
function ge(e, t) {
	return e.registerSlot("import.source.tab", t);
}
//#endregion
//#region packages/plugins/codec-share/src/share-link/import-course-utils.ts
function _e(e) {
	return c(e).sort((e, t) => e.dayOfWeek === t.dayOfWeek ? e.startPeriod === t.startPeriod ? e.endPeriod - t.endPeriod : e.startPeriod - t.startPeriod : e.dayOfWeek - t.dayOfWeek);
}
//#endregion
//#region packages/plugins/codec-share/src/share-link/location-codec.ts
var ve = /^(.+?[楼馆])([A-Za-z]?\d[\w]*)$/;
function ye(e) {
	let t = e.trim();
	if (!t) return {
		kind: "full",
		value: ""
	};
	let n = ve.exec(t);
	return !n?.[1] || !n[2] ? {
		kind: "full",
		value: t
	} : {
		kind: "split",
		building: n[1],
		room: n[2].slice(0, 5)
	};
}
function be(e) {
	return e.kind === "full" ? e.value : `${e.building}${e.room}`;
}
function xe(e, t) {
	let n = e.trim().slice(0, 5);
	for (let e = 0; e < 5; e += 1) {
		let r = n.charCodeAt(e);
		t.push(e < n.length && r > 0 ? r : 32);
	}
}
function Se(e, t) {
	let n = "";
	for (let r = 0; r < 5; r += 1) {
		let i = e[t + r];
		i !== void 0 && i !== 32 && i !== 0 && (n += String.fromCharCode(i));
	}
	return n.trim();
}
function Ce(e) {
	return e.trim().length === 0;
}
//#endregion
//#region packages/codec-kit/src/deflate.ts
async function we(e) {
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
async function Te(e) {
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
var Ee = 8192;
function De(e) {
	let t = "";
	for (let n = 0; n < e.length; n += Ee) t += String.fromCharCode(...e.subarray(n, n + Ee));
	return t;
}
function Oe(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n += 1) t[n] = e.charCodeAt(n);
	return t;
}
function ke(e) {
	return btoa(De(e));
}
function Ae(e) {
	return ke(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function je(e) {
	return Oe(atob(e));
}
function Me(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/");
	return je(t + "=".repeat((4 - t.length % 4) % 4));
}
//#endregion
//#region packages/codec-kit/src/crc32.ts
var Ne = (() => {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t += 1) {
		let n = t;
		for (let e = 0; e < 8; e += 1) n = n & 1 ? n >>> 1 ^ 3988292384 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
})();
function Pe(e) {
	let t = 4294967295;
	for (let n of e) t = (Ne[(t ^ n) & 255] ^ t >>> 8) >>> 0;
	return (t ^ 4294967295) >>> 0;
}
function Fe(e) {
	let t = Pe(e), n = new Uint8Array(e.length + 4);
	return n.set(e), n[e.length] = t & 255, n[e.length + 1] = t >>> 8 & 255, n[e.length + 2] = t >>> 16 & 255, n[e.length + 3] = t >>> 24 & 255, n;
}
function Ie(e) {
	if (e.length < 4) return null;
	let t = e.subarray(0, -4), n = e[e.length - 4] | e[e.length - 3] << 8 | e[e.length - 2] << 16 | e[e.length - 1] << 24;
	return Pe(t) === n >>> 0 ? t : null;
}
//#endregion
//#region packages/codec-kit/src/varint.ts
function Le(e, t) {
	if (e < 0) throw RangeError("varint value must be non-negative");
	let n = e;
	do {
		let e = n & 127;
		n >>>= 7, n > 0 && (e |= 128), t.push(e);
	} while (n > 0);
}
var Re = class {
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
function ze(e) {
	let t = e.filter((e) => e < 1 || e > 32);
	if (t.length > 0) throw RangeError(`week out of range: ${t.join(", ")}`);
}
function Be(e) {
	ze(e);
	let t = 0;
	for (let n of e) t |= 1 << n - 1;
	return t >>> 0;
}
function Ve(e) {
	let t = [];
	for (let n = 1; n <= 32; n += 1) e & 1 << n - 1 && t.push(n);
	return t;
}
//#endregion
//#region packages/codec-kit/src/interner.ts
var He = class {
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
}, Ue = 128, We = 255;
function Ge(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e - t), n = t.every((e, n) => n === 0 || e === t[n - 1] + 1), r = t[0], i = t[t.length - 1];
	if (n && r >= 1 && r <= 127 && i <= 255) return [Ue | r, i];
	let a = Be(t);
	return [
		a & 255,
		a >>> 8 & 255,
		a >>> 16 & 255,
		a >>> 24 & 255
	];
}
function Ke(e) {
	if (e.length === 0) return [];
	if (e.length === 2 && (e[0] & Ue) !== 0) {
		let t = e[0] & 127, n = e[1];
		return !n || n < t ? [] : Array.from({ length: n - t + 1 }, (e, n) => t + n);
	}
	return e.length === 4 ? Ve((e[0] | e[1] << 8 | e[2] << 16 | e[3] << 24) >>> 0) : [];
}
var qe = class e {
	entries = [];
	indexOf = /* @__PURE__ */ new Map();
	intern(e) {
		let t = Ge(e), n = t.join(","), r = this.indexOf.get(n);
		if (r !== void 0) return r;
		if (this.entries.length >= We) throw Error("week mask table overflow");
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
		return t ? Ke(t) : [];
	}
}, Je = 14, Ye = class e {
	names = [];
	indexOf = /* @__PURE__ */ new Map();
	intern(e) {
		let t = e.trim();
		if (!t) return 0;
		let n = this.indexOf.get(t);
		if (n !== void 0) return n;
		if (this.names.length >= Je) throw Error("teacher table overflow");
		let r = this.names.length + 1;
		return this.names.push(t), this.indexOf.set(t, r), r;
	}
	write(e) {
		e.push(this.names.length);
		for (let t of this.names) {
			let n = new TextEncoder().encode(t);
			Le(n.length, e);
			for (let t of n) e.push(t);
		}
	}
	static read(t, n) {
		let r = t[n];
		if (r === void 0) throw Error("truncated teacher table");
		let i = new e(), a = new Re(t);
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
}, Xe = [67, 83], Ze = 1, Qe = Date.UTC(2020, 0, 1), $e = 20, et = 255, tt = 255, nt = 32, rt = 1440, it = 1, at = 2, ot = 4, st = 8;
function ct(e) {
	let [t, n, r] = e.split("-").map((e) => Number.parseInt(e, 10));
	if (!t || !n || !r) throw new _("invalid term start date");
	let i = Date.UTC(t, n - 1, r);
	return Math.floor((i - Qe) / 864e5);
}
function lt(e) {
	let t = new Date(Qe + e * 864e5);
	return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}
function ut(e) {
	let t = /^(\d{1,2}):(\d{2})$/.exec(e.trim());
	if (!t) throw new _("invalid period time");
	let n = Number.parseInt(t[1], 10), r = Number.parseInt(t[2], 10);
	if (n < 0 || n > 23 || r < 0 || r > 59) throw new _("invalid period time");
	let i = n * 60 + r;
	if (i >= rt) throw new _("invalid period time");
	return i;
}
function dt(e) {
	if (e < 0 || e >= rt) throw new _("invalid period minutes");
	let t = Math.floor(e / 60), n = e % 60;
	return `${String(t).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
}
function ft(e, t) {
	if (e.length > nt) throw new _("too many period times");
	t.push(e.length);
	for (let n of e) {
		if (n.index < 1 || n.index > nt) throw new _("invalid period index");
		let e = ut(n.startTime), r = ut(n.endTime);
		t.push(n.index), t.push(e & 255, e >> 8 & 255), t.push(r & 255, r >> 8 & 255);
	}
}
function pt(e, t) {
	let n = e[t];
	if (n === void 0) throw new _("truncated period table");
	let r = t + 1, i = [];
	for (let t = 0; t < n; t += 1) {
		let t = e[r], n = e[r + 1], a = e[r + 2], o = e[r + 3], s = e[r + 4];
		if (t === void 0 || n === void 0 || a === void 0 || o === void 0 || s === void 0) throw new _("truncated period entry");
		let c = n | a << 8, l = o | s << 8;
		i.push({
			index: t,
			startTime: dt(c),
			endTime: dt(l)
		}), r += 5;
	}
	return {
		periodTimes: i,
		nextOffset: r
	};
}
var mt = new TextEncoder(), ht = new TextDecoder();
function gt(e, t) {
	t.push(e.strings.length);
	for (let n of e.strings) {
		let e = mt.encode(n);
		Le(e.length, t);
		for (let n of e) t.push(n);
	}
}
function _t(e, t) {
	let n = e[t];
	if (n === void 0) throw new _("truncated string table");
	let r = [], i = new Re(e);
	i.position = t + 1;
	for (let t = 0; t < n; t += 1) {
		let t = i.read(), n = i.position, a = e.subarray(n, n + t);
		if (a.length !== t) throw new _("truncated string entry");
		r.push(ht.decode(a)), i.position = n + t;
	}
	return {
		strings: r,
		nextOffset: i.position
	};
}
function vt(e, t, n) {
	return (e & 7) << 5 | (t - 1 & 15) << 1 | !!n;
}
function yt(e) {
	return {
		dayOfWeek: e >> 5 & 7,
		startPeriod: (e >> 1 & 15) + 1,
		hasRemark: (e & 1) == 1
	};
}
function bt(e, t) {
	return (e & 15) << 4 | t & 15;
}
function xt(e) {
	return {
		endPeriod: e >> 4 & 15,
		teacherSlot: e & 15
	};
}
function St(e, t) {
	let n = ye(t);
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
function Ct(e, t, n) {
	if (t === 255) return "";
	let r = e[t] ?? "";
	return r ? Ce(n) ? r : be({
		kind: "split",
		building: r,
		room: n
	}) : "";
}
var wt = new ae();
function Tt(e) {
	let n = e.academicConfig?.termStartDate ?? "", r = wt.normalizeTermStartDate(n, ie());
	return {
		...e,
		name: d(e.name),
		academicConfig: {
			...e.academicConfig,
			termStartDate: r,
			startWeek: e.academicConfig?.startWeek ?? 1,
			endWeek: e.academicConfig?.endWeek ?? $e,
			periodTimes: e.academicConfig?.periodTimes ?? []
		},
		courses: _e((e.courses ?? []).map((e) => ({
			...e,
			name: t(e.name),
			teacher: (e.teacher ?? "").trim(),
			location: (e.location ?? "").trim(),
			remark: e.remark?.trim() ?? ""
		})))
	};
}
function Et(e) {
	let t = Tt(e);
	if (t.courses.length === 0) throw new _("timetable has no courses");
	if (t.courses.length > tt) throw new _("too many courses");
	let n = new He({
		maxEntries: et,
		seed: t.name
	}), r = new qe(), i = new Ye(), a = t.academicConfig.endWeek || $e;
	if (a > 32) throw new _(`week out of range: ${a}`);
	let o = t.courses.some((e) => (e.remark?.length ?? 0) > 0), s = t.courses[0]?.weeks ?? [], c = t.courses.length > 0 && t.courses.every((e) => e.weeks.length === s.length && e.weeks.every((e, t) => e === s[t])), l = c ? r.intern(s) : -1, u = t.courses.map((e) => {
		if (!e.name) throw new _("course name is required");
		ze(e.weeks);
		let t = n.intern(e.name), a = i.intern(e.teacher), o = e.remark ? n.intern(e.remark) : -1, s = St(n, e.location), u = ye(e.location);
		return {
			nameIdx: t,
			dayPeriod: vt(e.dayOfWeek, e.startPeriod, o >= 0),
			endTeacher: bt(e.endPeriod, a > 0 ? a : 15),
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
	let f = (o ? it : 0) | (a === $e ? 0 : at) | (c ? ot : 0) | (d >= 0 ? st : 0), p = [
		...Xe,
		Ze,
		f
	], m = ct(t.academicConfig.termStartDate);
	p.push(m & 255, m >> 8 & 255), (f & at) !== 0 && p.push(a), p.push(t.courses.length), (f & st) !== 0 && p.push(d), ft(t.academicConfig.periodTimes, p), gt(n, p), r.write(p), i.write(p);
	for (let e of u) p.push(e.nameIdx);
	for (let e of u) p.push(e.dayPeriod);
	for (let e of u) p.push(e.endTeacher);
	if ((f & st) === 0) for (let e of u) p.push(e.buildingIdx);
	for (let e of u) xe(e.room, p);
	if ((f & ot) === 0) for (let e of u) p.push(e.weekMaskIdx);
	if ((f & it) !== 0) for (let e of u) p.push(e.remarkIdx >= 0 ? e.remarkIdx : 0);
	return Uint8Array.from(p);
}
function Dt(e, t = Date.now()) {
	if (e.length < 6) throw new _("payload too short");
	if (e[0] !== Xe[0] || e[1] !== Xe[1]) throw new _("invalid magic");
	if (e[2] !== Ze) throw new _("unsupported version");
	let n = e[3], r = e[4] | e[5] << 8, i = 6, a = $e;
	if ((n & at) !== 0) {
		if (a = e[i], a === void 0) throw new _("truncated header");
		if (a > 32) throw new _(`week out of range: ${a}`);
		i += 1;
	}
	let o = e[i];
	if (o === void 0 || o === 0) throw new _("no courses in payload");
	i += 1;
	let s = -1;
	if ((n & st) !== 0) {
		if (s = e[i], s === void 0) throw new _("truncated header");
		i += 1;
	}
	let { periodTimes: c, nextOffset: u } = pt(e, i);
	i = u;
	let { strings: f, nextOffset: p } = _t(e, i);
	i = p;
	let { table: m, nextOffset: h } = qe.read(e, i);
	i = h;
	let { table: g, nextOffset: ee } = Ye.read(e, i);
	i = ee;
	let te = i;
	i += o;
	let ne = i;
	i += o;
	let re = i;
	i += o;
	let ie = (n & st) !== 0, ae = i;
	ie || (i += o);
	let oe = i;
	i += o * 5;
	let se = (n & ot) !== 0, ce = i;
	se || (i += o);
	let le = se ? 0 : -1, ue = (n & it) !== 0, de = i;
	if (ue && (i += o), e.length < i) throw new _("truncated course columns");
	let fe = d(f[0] ?? ""), pe = [];
	for (let t = 0; t < o; t += 1) {
		let n = e[te + t], r = e[ne + t], i = e[re + t], a = ie ? s : e[ae + t], o = le >= 0 ? le : e[ce + t], c = ue ? e[de + t] ?? 0 : 0, l = Se(e, oe + t * 5), { dayOfWeek: u, startPeriod: d } = yt(r);
		if (u < 1 || u > 7) throw new _("invalid day of week");
		let { endPeriod: p, teacherSlot: h } = xt(i), ee = f[n];
		if (!ee) throw new _("invalid course name index");
		pe.push({
			id: `share-course-${t + 1}`,
			name: ee,
			teacher: h === 15 || h === 0 ? "" : g.decode(h),
			location: Ct(f, a, l),
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
			termStartDate: lt(r),
			startWeek: 1,
			endWeek: a,
			periodTimes: c
		},
		importMetadata: { source: "share-link" },
		viewPrefs: {
			...l(pe),
			showNonCurrentWeekCourses: !1
		}
	};
}
//#endregion
//#region packages/plugins/codec-share/src/share-link/share-link-compression.ts
var Ot = 262144, kt = class extends Error {
	constructor() {
		super("share payload exceeds decompression limit");
	}
}, At = we;
async function jt(e, t = Ot) {
	if (typeof DecompressionStream > "u") {
		let n = await Te(e);
		if (n.length > t) throw new kt();
		return n;
	}
	let n = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new DecompressionStream("deflate-raw")).getReader(), r = [], i = 0;
	for (;;) {
		let { done: e, value: a } = await n.read();
		if (e) break;
		if (i += a.byteLength, i > t) throw await n.cancel().catch(() => {}), new kt();
		r.push(a);
	}
	let a = new Uint8Array(i), o = 0;
	for (let e of r) a.set(e, o), o += e.byteLength;
	return a;
}
//#endregion
//#region packages/plugins/codec-share/src/messages.ts
function Mt(e) {
	return se({ content: {
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
}, Nt = "1.", Pt = v["zh-cn"];
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
	return `${Nt}${Ae(await At(Fe(Et(e))))}`;
}
async function Rt(e, t = Pt) {
	let n = e.trim();
	if (n.length > 65536) return It(t["share.error.corrupted"]);
	if (!n.startsWith(Nt)) return It(t["share.error.unsupported"]);
	try {
		let e = Ie(await jt(Me(n.slice(Nt.length))));
		if (!e) throw new _("checksum mismatch");
		return Ft(Dt(e));
	} catch (e) {
		return e instanceof kt ? It(t["share.error.corrupted"]) : It(e instanceof _ ? e.message === "checksum mismatch" ? t["share.error.corrupted"] : e.message : e instanceof Error ? e.message : t["share.error.parseFailed"]);
	}
}
async function zt(e, t) {
	let n = await Lt(e), r = new URL(t);
	return r.hash = n, r.href;
}
function Bt(e, t, n = Pt) {
	let r = d(e) || n["share.clipboard.unnamed"];
	return n["share.clipboard.template"].replace("{name}", r).replace("{link}", t);
}
async function Vt(e, t) {
	return t === null ? (await Lt(e)).length : (await zt(e, t)).length;
}
function Ht(e) {
	return e.startsWith(Nt);
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
var Yt = {}, y = Symbol("uninitialized"), Xt = Array.isArray, Zt = Array.prototype.indexOf, Qt = Array.prototype.includes, $t = Array.from, en = Object.defineProperty, b = Object.getOwnPropertyDescriptor, tn = Object.prototype, nn = Array.prototype, rn = Object.getPrototypeOf, an = Object.isExtensible;
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
var x = 1024, S = 2048, C = 4096, un = 8192, dn = 16384, fn = 32768, pn = 1 << 25, mn = 65536, hn = 1 << 19, gn = 1 << 20, _n = 1 << 21, vn = 1 << 22, yn = 1 << 23, bn = Symbol("$state"), xn = Symbol("component"), Sn = Symbol("legacy props"), Cn = Symbol("attributes"), wn = Symbol("class"), Tn = Symbol("style"), En = Symbol("text"), Dn = new class extends Error {
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
var w = !1;
function jn(e) {
	w = e;
}
var T;
function E(e) {
	if (e === null) throw kn(), Yt;
	return T = e;
}
function Mn() {
	return E(/* @__PURE__ */ R(T));
}
function Nn(e) {
	if (w) {
		if (/* @__PURE__ */ R(T) !== null) throw kn(), Yt;
		T = e;
	}
}
function Pn(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ R(n);
		T = n;
	}
}
function Fn(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ R(n);
		e && n.remove(), n = i;
	}
}
function In(e) {
	if (!e || e.nodeType !== 8) throw kn(), Yt;
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
var D = null;
function Zn(e) {
	D = e;
}
function Qn() {
	return Jn($n, er, tr);
}
function $n(e) {
	return Xn(D, "getContext").get(e);
}
function er(e, t) {
	return Xn(D, "setContext").set(e, t), t;
}
function tr(e) {
	return Xn(D, "hasContext").has(e);
}
function nr(e, t = !1, n) {
	D = {
		p: D,
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
	var t = D, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) fi(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, D = t.p, ir(e);
}
function ir(e = {}) {
	return en(e, xn, { value: !0 }), e;
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
function O(e) {
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
var cr = ~(S | C | x);
function k(e, t) {
	e.f = e.f & cr | t;
}
function lr(e) {
	e.f & 512 || e.deps === null ? k(e, x) : k(e, C);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function ur(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, x);
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
				z(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ vr(e))).then(u).catch((e) => z(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mr();
	}) : f();
}
function pr() {
	var e = K, t = U, n = D, r = A;
	return function(i = !0) {
		q(e), G(t), Zn(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mr(e = !0) {
	q(null), G(null), Zn(null), e && A?.deactivate();
}
function hr() {
	var e = K, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gr(e) {
	var t = 2 | S;
	return K !== null && (K.f |= hn), {
		ctx: D,
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
		var c = A;
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
	return Mi(t), t;
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
		for (var n = 0; n < t.length; n += 1) H(t[n]);
	}
}
function Sr(e) {
	var t, n = K, r = e.parent;
	if (!Ai && r !== null && e.v !== y && r.f & 24576) return On(), e.v;
	q(r);
	try {
		xr(e), t = Vi(e);
	} finally {
		q(n);
	}
	return t;
}
function Cr(e) {
	var t = Sr(e);
	if (!e.equals(t) && (e.wv = Ri(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), Dr?.capture(e, t, !0)), e.deps === null))) {
		k(e, x);
		return;
	}
	Ai || (j === null ? lr(e) : (ui() || A?.is_fork) && j.set(e, t));
}
function wr(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dr(() => {
		t.ac.abort(Dn), t.ac = null;
	}), t.fn !== null && (t.teardown = sn), Wi(t, 0), yi(t));
}
function Tr(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Gi(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var Er = null, A = null, Dr = null, j = null, Or = null, kr = !1, Ar = !1, jr = null, Mr = null, Nr = 0, Pr = 1, Fr = class e {
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
			for (var r of n.d) k(r, S), t(r);
			for (r of n.m) k(r, C), t(r);
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
					t.f ^= x;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), k(e, S), this.schedule(e);
		for (let e of this.#d) k(e, C), this.schedule(e);
		this.apply();
		for (var t = jr = [], n = [], r = Mr = []; this.#c.length > 0;) {
			Nr++ > 1e3 && (this.#S(), Ir());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Br(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (jr = null, Mr = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) zr(e, t);
			r.length > 0 && A.#_();
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
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (N.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : zi(r) && (i & 16 && this.#d.add(r), Gi(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), A = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ur(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== y && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), j?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, j = null;
	}
	flush() {
		try {
			Ar = !0, A = this, this.#_();
		} finally {
			Nr = 0, Or = null, jr = null, Mr = null, Ar = !1, A = null, j = null, N.clear();
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
		this.#m || (this.#m = !0, O(() => {
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
		if (A === null) {
			let t = A = new e();
			!Ar && O(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
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
		z(e, Or);
	}
}
var M = null;
function Lr(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && zi(r) && (M = /* @__PURE__ */ new Set(), Gi(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Si(r), M?.size > 0)) {
				N.clear();
				for (let e of M) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) M.has(n) && (M.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Gi(n);
					}
				}
				M.clear();
			}
		}
		M = null;
	}
}
function Rr(e) {
	A.schedule(e);
}
function zr(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, x);
		for (var n = e.first; n !== null;) zr(n, t), n = n.next;
	}
}
function Br(e) {
	k(e, x);
	for (var t = e.first; t !== null;) Br(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Vr = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), Hr = !1;
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
function P(e, t) {
	let n = Ur(e, t);
	return Mi(n), n;
}
function F(e, t, n = !1) {
	return U !== null && (!W || U.f & 131072) && ar() && U.f & 4325394 && (J === null || !J.has(e)) && Kn(), Gr(e, n ? Yr(t) : t, Mr);
}
var I = null, Wr = 0;
function Gr(e, t, n = null) {
	if (!e.equals(t)) {
		Ai ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = Fr.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Sr(t), j === null && lr(t);
		}
		e.wv = Ri(), I = null, Wr = 0, Jr(e, S, n), I = null, ar() && K !== null && K.f & 1024 && !(K.f & 96) && (Z === null ? Ni([e]) : Z.push(e)), !r.is_fork && Vr.size > 0 && !Hr && Kr();
	}
	return t;
}
function Kr() {
	Hr = !1;
	for (let e of Vr) {
		e.f & 1024 && k(e, C);
		let t;
		try {
			t = zi(e);
		} catch {
			t = !0;
		}
		t && Gi(e);
	}
	Vr.clear();
}
function qr(e) {
	F(e, e.v + 1);
}
function Jr(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = ar(), a = r.length;
		if (Wr += a, Wr > 1e5 && I === null && (I = /* @__PURE__ */ new Set()), I !== null) {
			if (I.has(e)) return;
			I.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== K) {
				var l = (c & S) === 0;
				if (l && k(s, t), c & 131072) Vr.add(s);
				else if (c & 2) {
					var u = s;
					j?.delete(u), Jr(u, C, n);
				} else if (l) {
					var d = s;
					c & 16 && M !== null && M.add(d), n === null ? Rr(d) : n.push(d);
				}
			}
		}
	}
}
function Yr(e) {
	if (typeof e != "object" || !e || bn in e || xn in e) return e;
	let t = rn(e);
	if (t !== tn && t !== nn) return e;
	var n = /* @__PURE__ */ new Map(), r = Xt(e), i = /* @__PURE__ */ P(0), a = null, o = Ii, s = (e) => {
		if (Ii === o) return e();
		var t = U, n = Ii;
		G(null), Li(o);
		var r = e();
		return G(t), Li(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ P(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Wn();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ P(r.value, a);
				return n.set(t, e), e;
			}) : F(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ P(y, a));
					n.set(t, e), qr(i);
				}
			} else F(r, y), qr(i);
			return !0;
		},
		get(t, r, i) {
			if (r === bn) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || b(t, r)?.writable) && (o = s(() => /* @__PURE__ */ P(Yr(c ? t[r] : y), a)), n.set(r, o)), o !== void 0) {
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
			return (r !== void 0 || K !== null && (!i || b(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ P(i ? Yr(e[t]) : y, a)), n.set(t, r)), Q(r) === y) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ P(y, a)), n.set(d + "", f)) : F(f, y);
			}
			if (l === void 0) (!u || b(e, t)?.writable) && (l = s(() => /* @__PURE__ */ P(void 0, a)), F(l, Yr(o)), n.set(t, l));
			else {
				u = l.v !== y;
				var p = s(() => Yr(o));
				F(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && F(h, g + 1);
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
		Qr = b(t, "firstChild").get, $r = b(t, "nextSibling").get, an(e) && (e[wn] = void 0, e[Cn] = null, e[Tn] = void 0, e.__e = void 0), an(n) && (n[En] = void 0);
	}
}
function L(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ti(e) {
	return Qr.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function R(e) {
	return $r.call(e);
}
function ni(e, t) {
	if (!w) return /* @__PURE__ */ ti(e);
	var n = /* @__PURE__ */ ti(T);
	if (n === null) n = T.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), E(r), r;
	}
	return t && si(n), E(n), n;
}
function ri(e, t = !1) {
	if (!w) return /* @__PURE__ */ ti(e);
	var n = ni(e, t);
	return Nn(e), n;
}
function ii(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ R(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = L();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		si(r);
	}
	return E(r), r;
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
	z(e, t);
}
function z(e, t) {
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
function B(e, t) {
	var n = K;
	n !== null && n.f & 8192 && (e |= un);
	var r = {
		ctx: D,
		deps: null,
		nodes: null,
		f: e | S | 512,
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) jr === null ? Fr.ensure().schedule(r) : jr.push(r);
	else if (t !== null) {
		try {
			Gi(r);
		} catch (e) {
			throw H(r), e;
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
	let t = B(8, null);
	return k(t, x), t.teardown = e, t;
}
function fi(e) {
	return B(4 | gn, e);
}
function pi(e) {
	Fr.ensure();
	let t = B(64 | hn, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ci(t, () => {
			H(t), n(void 0);
		}) : (H(t), n(void 0));
	});
}
function mi(e) {
	return B(vn | hn, e);
}
function hi(e, t = 0) {
	return B(8 | t, e);
}
function gi(e, t = [], n = [], r = []) {
	fr(r, t, n, (t) => {
		B(8, () => {
			e(...t.map(Q));
		});
	});
}
function _i(e, t = 0) {
	return B(16 | t, e);
}
function V(e) {
	return B(32 | hn, e);
}
function vi(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Ai, r = U;
		ji(!0), G(null);
		try {
			t.call(null);
		} catch (t) {
			z(t, e.parent);
		} finally {
			ji(n), G(r);
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
		n.f & 64 ? n.parent = null : H(n, t), n = r;
	}
}
function bi(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || H(t), t = n;
	}
}
function H(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (xi(e.nodes.start, e.nodes.end), n = !0), e.f |= pn, yi(e, t && !n), Wi(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	vi(e), e.f ^= pn, e.f |= dn;
	var i = e.parent;
	i !== null && i.first !== null && Si(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function xi(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ R(e);
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
		n && H(e), t && t();
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
		e.f ^= un, e.f & 1024 || (k(e, S), Fr.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ R(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Oi = null, ki = !1, Ai = !1;
function ji(e) {
	Ai = e;
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
function Mi(e) {
	U !== null && (U.f & 2097152 || U.f & 2) && (J ??= /* @__PURE__ */ new Set()).add(e);
}
var Y = null, X = 0, Z = null;
function Ni(e) {
	Z = e;
}
var Pi = 1, Fi = 0, Ii = Fi;
function Li(e) {
	Ii = e;
}
function Ri() {
	return ++Pi;
}
function zi(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (zi(a) && Cr(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && k(e, x);
	}
	return !1;
}
function Bi(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(J !== null && J.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Bi(a, t, !1) : t === a && (n ? k(a, S) : a.f & 1024 && k(a, C), Rr(a));
	}
}
function Vi(e) {
	var t = Y, n = X, r = Z, i = U, a = J, o = D, s = W, c = Ii, l = e.f;
	Y = null, X = 0, Z = null, U = l & 96 ? null : e, J = null, Zn(e.ctx), W = !1, Ii = ++Fi, e.ac !== null && (dr(() => {
		e.ac.abort(Dn);
	}), e.ac = null);
	try {
		e.f |= _n;
		var u = e.fn, d = u();
		e.f |= fn;
		var f = Hi(e);
		if (ar() && Z !== null && !W && f !== null && !(e.f & 6146)) for (var p = 0; p < Z.length; p++) Bi(Z[p], e);
		if (i !== null && i !== e) {
			if (Fi++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Fi;
			if (t !== null) for (let e of t) e.rv = Fi;
			Z !== null && (r === null ? r = Z : r.push(...Z));
		}
		return e.f & 8388608 && (e.f ^= yn), d;
	} catch (t) {
		return Hi(e), ci(t);
	} finally {
		e.f ^= _n, Y = t, X = n, Z = r, U = i, J = a, Zn(o), W = s, Ii = c;
	}
}
function Hi(e) {
	var t = e.deps, n = A?.is_fork;
	if (Y !== null) {
		var r;
		if (n || Wi(e, X), t !== null && X > 0) for (t.length = X + Y.length, r = 0; r < Y.length; r++) t[X + r] = Y[r];
		else e.deps = t = Y;
		if (ui() && e.f & 512) for (r = X; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && X < t.length && (Wi(e, X), t.length = X);
	return t;
}
function Ui(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = Zt.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Y === null || !Qt.call(Y, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== y && lr(a), a.ac !== null && dr(() => {
			a.ac.abort(Dn), a.ac = null, k(a, S);
		}), wr(a), Wi(a, 0);
	}
}
function Wi(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Ui(e, n[r]);
}
function Gi(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, x);
		var n = K, r = ki;
		K = e, ki = !(t & 96);
		try {
			t & 16777232 ? bi(e) : yi(e), vi(e);
			var i = Vi(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Pi;
		} finally {
			ki = r, K = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if (Oi?.add(e), U !== null && !W && !(K !== null && K.f & 16384) && (J === null || !J.has(e))) {
		var n = U.deps;
		if (U.f & 2097152) e.rv < Fi && (e.rv = Fi, Y === null && n !== null && n[X] === e ? X++ : Y === null ? Y = [e] : Y.push(e));
		else {
			U.deps ??= [], Qt.call(U.deps, e) || U.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [U] : Qt.call(r, U) || r.push(U);
		}
	}
	if (Ai && N.has(e)) return N.get(e);
	if (t) {
		var i = e;
		if (Ai) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || qi(i)) && (a = Sr(i)), N.set(i, a), a;
		}
		var o = !(i.f & 512) && !W && U !== null && (ki || !!(U.f & 512)), s = (i.f & fn) === 0;
		zi(i) && (o && (i.f |= 512), Cr(i)), o && !s && (Tr(i), Ki(i));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Ki(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tr(t), Ki(t));
}
function qi(e) {
	if (e.v === y) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && qi(t)) return !0;
	return !1;
}
function Ji(e) {
	var t = W;
	try {
		return W = !0, e();
	} finally {
		W = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
var Yi = Symbol("events"), Xi = /* @__PURE__ */ new Set(), Zi = /* @__PURE__ */ new Set();
function Qi(e, t, n) {
	(t[Yi] ??= {})[e] = n;
}
function $(e) {
	for (var t = 0; t < e.length; t++) Xi.add(e[t]);
	for (var n of Zi) n(e);
}
var $i = null, ea = !1;
function ta(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	$i = e, ea || (ea = !0, setTimeout(() => {
		ea = !1, $i = null;
	}));
	var o = 0, s = $i === e && e[Yi];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Yi] = t;
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
		var u = U, d = K;
		G(null), q(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[Yi]?.[r];
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
			e[Yi] = t, delete e.currentTarget, G(u), q(d);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var na = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function ra(e) {
	return na?.createHTML(e) ?? e;
}
function ia(e) {
	var t = oi("template");
	return t.innerHTML = ra(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function aa(e, t) {
	var n = K;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function oa(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return aa(T, null), T;
		i === void 0 && (i = ia(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ti(i)));
		var t = r || Zr ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ti(t), s = t.lastChild;
			aa(o, s);
		} else aa(t, t);
		return t;
	};
}
function sa(e, t) {
	if (w) {
		var n = K;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Mn();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ca = ["touchstart", "touchmove"];
function la(e) {
	return ca.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function ua(e) {
	let t = 0, n = Ur(0), r;
	return () => {
		ui() && (Q(n), hi(() => (t === 0 && (r = Ji(() => e(() => qr(n)))), t += 1, () => {
			O(() => {
				--t, t === 0 && (r?.(), r = void 0, qr(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var da = mn | hn;
function fa(e, t, n, r) {
	new pa(e, t, n, r);
}
var pa = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = w ? T : null;
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
	#h = ua(() => (this.#m = Ur(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = K;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = K.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = _i(() => {
			if (w) {
				let e = this.#t;
				Mn();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, da), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = V(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		O(r), t && (this.#s = V(() => {
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
					z(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = V(() => e(this.#e)), O(() => {
			var e = this.#c = document.createDocumentFragment(), t = L(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return V(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						z(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Ci(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = V(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Di(this.#a, e);
				let t = this.#n.pending;
				this.#o = V(() => t(this.#e));
			} else this.#x(A);
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
		var t = K, n = U, r = D;
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, O(() => {
			this.#d = !1, this.#m && Gr(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (H(this.#a), null), this.#o &&= (H(this.#o), null), this.#s &&= (H(this.#s), null), w && (E(this.#t), Pn(), E(Fn()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return V(() => {
						var r = K;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return z(e, this.#i.parent), null;
				}
			}));
		};
		O(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				z(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => z(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function ma(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[En] ??= e.nodeValue) && (e[En] = n, e.nodeValue = `${n}`);
}
function ha(e, t) {
	return _a(e, t);
}
var ga = /* @__PURE__ */ new Map();
function _a(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	ei();
	var c = void 0, l = pi(() => {
		var o = n ?? t.appendChild(L());
		fa(o, { pending: () => {} }, (t) => {
			nr({});
			var n = D;
			if (a && (n.c = a), i && (r.$$events = i), w && aa(t, null), c = e(t, r) || ir(), w && (K.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw kn(), Yt;
			rr();
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
						o === void 0 ? (e.addEventListener(r, ta, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u($t(Xi)), Zi.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = ga.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, ta), r.delete(e), r.size === 0 && ga.delete(n)) : r.set(e, i);
			}
			Zi.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return va.set(c, l), c;
}
var va = /* @__PURE__ */ new WeakMap();
function ya(e, t) {
	let n = va.get(e);
	return n ? (va.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
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
			if (n) Ti(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Ti(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (H(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Di(r, t), t.append(L()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else H(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Ci(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (H(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = ai();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = L();
				i.append(a), this.#n.set(e, {
					effect: V(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, V(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function xa(e, t, n) {
	var r;
	w && (r = T, Mn());
	var i = new ba(e);
	_i(() => {
		var e = t() ?? null;
		if (w && In(r) === "[" != (e !== null)) {
			var a = Fn();
			E(a), i.anchor = a, jn(!1), i.ensure(e, e && ((t) => n(t, e))), jn(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, mn);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function Sa(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), sn;
	let r = Ji(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var Ca = [];
function wa(e, t = sn) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Rn(e, t) && (e = t, n)) {
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
function Ta(e) {
	let t;
	return Sa(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var Ea = {
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
			let a = b(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (on(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = b(r, t);
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
function Da(...e) {
	return new Proxy({ props: e }, Ea);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/index-client.js
function Oa(e) {
	let t, n = ua((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return ui() ? (n(), t) : Ta(e);
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
var ka = "__CHRONOS_NATIVE__";
function Aa() {
	if (typeof window > "u") return null;
	let e = window[ka];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
f.hapticFeedbackEnabled, $(["click"]), $(["click"]), $(["click", "keydown"]), f.reduceMotionEnabled, $(["pointerdown"]), $(["keydown", "click"]), $(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ja, Ma] = Qn();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
$(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var Na = /* @__PURE__ */ oa("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function Pa(e, t) {
	nr(t, !0);
	let n = /* @__PURE__ */ yr(() => t.component), r = /* @__PURE__ */ yr(() => Oa(t.propsStore).current);
	var i = Na();
	xa(ni(i), () => Q(n), (e, t) => {
		t(e, Da(() => Q(r)));
	}), Nn(i), sa(e, i), rr();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Fa(e) {
	return {
		[fe]: !0,
		mount(t, n, r) {
			let i = wa({ ...n }), a = ha(Pa, {
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
					ya(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function Ia(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return ue(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? ue(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/import-tab-props.ts
async function La(e, t, n, r) {
	let i = await e.previewWithSlot(t, n);
	return !i && e.state.errorMessage && r?.notify(e.state.errorMessage, "error"), i;
}
//#endregion
//#region packages/ui-kit/src/platform/clipboard.ts
async function Ra() {
	let e = Aa();
	if (e) try {
		let t = await e.callNative("clipboard", "readText");
		if (typeof t == "string") return t;
	} catch {}
	if (typeof navigator < "u" && navigator.clipboard?.readText) return navigator.clipboard.readText();
	throw Error("Clipboard read is not supported");
}
//#endregion
//#region packages/plugins/codec-share/src/ShareLinkImportTab.svelte
var za = /* @__PURE__ */ oa("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small mt-0.5 text-on-surface-variant\"> </p></div> <div class=\"flex w-full pt-1\"><button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button></div></div></div>");
function Ba(e, t) {
	nr(t, !0);
	let n = "codec-share", r = /* @__PURE__ */ P(!1), i = /* @__PURE__ */ yr(() => Ia(t.controller, n, v, "import.ui.title")), a = /* @__PURE__ */ yr(() => Ia(t.controller, n, v, "import.ui.subtitle")), o = /* @__PURE__ */ yr(() => Ia(t.controller, n, v, "import.ui.loading")), s = /* @__PURE__ */ yr(() => Ia(t.controller, n, v, "import.ui.clipboard"));
	async function c() {
		F(r, !0);
		try {
			let e = await Ra();
			await La(t.transfer, "share-link", { content: e.trim() }, t.controller) && t.onContinue();
		} catch (e) {
			let r = e instanceof Error ? e.message : Ia(t.controller, n, v, "import.ui.clipboardError");
			t.controller?.notify(r, "error");
		} finally {
			F(r, !1);
		}
	}
	var l = za(), u = ni(l), d = ni(u), f = ni(d), p = ri(f, !0), m = ri(ii(f, 2), !0);
	Nn(d);
	var h = ii(d, 2), g = ni(h), ee = ri(g, !0);
	Nn(h), Nn(u), Nn(l), gi(() => {
		ma(p, Q(i)), ma(m, Q(a)), g.disabled = Q(r), ma(ee, Q(r) ? Q(o) : Q(s));
	}), Qi("click", g, c), sa(e, l), rr();
}
$(["click"]);
//#endregion
//#region packages/plugins/codec-share/src/index.ts
function Va(e = {}) {
	let { shareComponent: t = Fa(Ba) } = e;
	return he({
		id: "codec-share",
		messages: v,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "codec",
		order: 30,
		author: "UE-DND",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = Mt(n), i = {
				"share.error.corrupted": n("share.error.corrupted"),
				"share.error.unsupported": n("share.error.unsupported"),
				"share.error.parseFailed": n("share.error.parseFailed")
			}, a = {
				"share.clipboard.unnamed": n("share.clipboard.unnamed"),
				"share.clipboard.template": n("share.clipboard.template")
			};
			ge(e, {
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
					if (!t?.trim()) throw new de("no-data", n("import.error.empty"));
					let r = Jt(t);
					if (!r) throw new de("no-data", n("import.error.empty"));
					let a = await Rt(r, i);
					if (!a.ok) throw new de(a.errorMessage === i["share.error.unsupported"] ? "unsupported" : "invalid-data", a.errorMessage);
					return a.value;
				}
			});
			let o = () => e.tryService(le)?.getImportUrl() ?? null;
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
var Ha = Va();
//#endregion
export { Ha as default };
