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
})), .2126 * e(15 / 255) + .7152 * e(23 / 255) + .0722 * e(42 / 255);
function e(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
var t = new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
function n(e) {
	return t.has(e);
}
function r(e) {
	let t = e.trim();
	return !(!t || t.includes("<") || t.toLowerCase().includes("javascript:"));
}
function i(e, t) {
	let i = {}, a = [], o = [], s = t?.label ?? "workbench colors";
	if (!e) return {
		colors: i,
		warnings: a,
		errors: o
	};
	for (let [t, c] of Object.entries(e)) {
		if (typeof c != "string") {
			o.push(`${s}: invalid value for "${t}"`);
			continue;
		}
		if (!r(c)) {
			o.push(`${s}: rejected unsafe or empty value for "${t}"`);
			continue;
		}
		if (!n(t)) {
			a.push(`${s}: unknown key "${t}" (ignored, like VS Code color themes)`);
			continue;
		}
		i[t] = c.trim();
	}
	return {
		colors: i,
		warnings: a,
		errors: o
	};
}
function a(e) {
	return `color.${e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
}
function o(e) {
	let t = {};
	for (let [r, i] of Object.entries(e)) {
		let e = a(r);
		n(e) && typeof i == "string" && i.length > 0 && (t[e] = i);
	}
	return t;
}
//#endregion
//#region packages/core/src/theme/color-theme-json.ts
function s(e) {
	if (!e || typeof e != "object") throw Error("Invalid color theme JSON: root must be an object");
	let t = e;
	if (typeof t.id != "string" || !t.id) throw Error("Invalid color theme JSON: missing id");
	if (!t.variants || typeof t.variants != "object") throw Error("Invalid color theme JSON: missing variants");
	let n = t.variants;
	if (!n.light || !n.dark) throw Error("Invalid color theme JSON: variants must include light and dark");
	if (t.wallpaper !== void 0) {
		let e = t.wallpaper;
		if (!e || typeof e != "object" || typeof e.url != "string" || !e.url.trim() || typeof e.sha256 != "string" || !/^[a-f0-9]{64}$/i.test(e.sha256)) throw Error("Invalid theme wallpaper: require url and SHA-256");
	}
	return t;
}
function c(e, t) {
	let n = i(e.light, { label: `${t} light` }), r = i(e.dark, { label: `${t} dark` });
	for (let e of n.warnings) console.warn(e);
	for (let e of r.warnings) console.warn(e);
	let a = [...n.errors, ...r.errors];
	if (a.length > 0) throw Error(`Invalid workbench colors for theme "${t}": ${a.join("; ")}`);
	return {
		light: n.colors,
		dark: r.colors
	};
}
function l(e) {
	let t = c({
		light: e.variants.light.colors ?? {},
		dark: e.variants.dark.colors ?? {}
	}, e.id), n = e.coursePalette ? (t) => e.coursePalette[t] : void 0;
	return {
		id: e.id,
		name: e.name,
		description: e.description,
		disabled: e.disabled,
		className: e.className,
		recommendedIconTheme: e.recommendedIconTheme,
		workbenchColors: t,
		paletteEntries: n
	};
}
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function u(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function d() {
	return "1.1.1";
}
function f(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? u(e.messages, e.nameKey),
		version: e.version ?? d(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? u(e.messages, e.descriptionKey) : void 0,
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
var p = {
	id: "m3-default",
	name: {
		"zh-cn": "Material 3",
		en: "Material 3"
	},
	variants: {
		light: { colors: {
			"color.surface": "#ffffff",
			"color.on-surface": "#2e333a",
			"color.primary": "#416189",
			"color.on-primary": "#f8f8ff",
			"color.surface-variant": "#f2f3fa",
			"color.outline": "#cbd5e1",
			"color.surface-dim": "#d6dae4",
			"color.surface-bright": "#f9f9fe",
			"color.surface-container-lowest": "#fff",
			"color.surface-container-low": "#f2f3fa",
			"color.surface-container": "#ffffff",
			"color.surface-container-high": "#f1f5f9",
			"color.surface-container-highest": "#dfe2ec",
			"color.on-surface-variant": "#5b5f67",
			"color.outline-variant": "#e2e8f0",
			"color.inverse-surface": "#0c0e12",
			"color.inverse-on-surface": "#9c9da1",
			"color.primary-dim": "#35557c",
			"color.primary-container": "#a9c9f7",
			"color.on-primary-container": "#204168",
			"color.primary-fixed": "#a9c9f7",
			"color.primary-fixed-dim": "#9bbbe8",
			"color.on-primary-fixed": "#042d53",
			"color.on-primary-fixed-variant": "#2a4b72",
			"color.inverse-primary": "#a9c9f7",
			"color.secondary": "#546071",
			"color.secondary-dim": "#495465",
			"color.on-secondary": "#f8f8ff",
			"color.secondary-container": "#d8e3f8",
			"color.on-secondary-container": "#475263",
			"color.secondary-fixed": "#d8e3f8",
			"color.secondary-fixed-dim": "#c9d5ea",
			"color.on-secondary-fixed": "#354050",
			"color.on-secondary-fixed-variant": "#515c6d",
			"color.tertiary": "#635983",
			"color.tertiary-dim": "#574d76",
			"color.on-tertiary": "#fdf7ff",
			"color.tertiary-container": "#dacdff",
			"color.on-tertiary-container": "#4c436c",
			"color.tertiary-fixed": "#dacdff",
			"color.tertiary-fixed-dim": "#ccc0f0",
			"color.on-tertiary-fixed": "#393057",
			"color.on-tertiary-fixed-variant": "#564c76",
			"color.error": "#a83836",
			"color.error-dim": "#67040d",
			"color.on-error": "#fff7f6",
			"color.error-container": "#fa746f",
			"color.on-error-container": "#6e0a12",
			"color.shadow": "#000",
			"color.scrim": "#000",
			"color.on-on-primary": "#416089",
			"color.primary-container-subtle": "#c5dcff",
			"color.on-primary-container-subtle": "#2e4e75",
			"color.secondary-container-subtle": "#cfdbef",
			"color.on-secondary-container-subtle": "#424d5e",
			"color.tertiary-container-subtle": "#dfd4ff",
			"color.on-tertiary-container-subtle": "#50476f",
			"color.error-container-subtle": "#ffcfcb",
			"color.on-error-container-subtle": "#8f2526",
			"color.canvas": "#f0f4f8",
			"color.ink": "#0b1f33",
			"color.border-subtle": "#d4e0eb",
			"color.success": "#15803d",
			"color.warning": "#b45309",
			"color.danger": "#e60012"
		} },
		dark: { colors: {
			"color.surface": "#1e2026",
			"color.on-surface": "#e2e5ef",
			"color.primary": "#b0c8ec",
			"color.on-primary": "#2a415f",
			"color.surface-variant": "#111418",
			"color.outline": "#334155",
			"color.surface-dim": "#0c0e12",
			"color.surface-bright": "#282c34",
			"color.surface-container-lowest": "#000",
			"color.surface-container-low": "#111418",
			"color.surface-container": "#1e2026",
			"color.surface-container-high": "#24262e",
			"color.surface-container-highest": "#21262d",
			"color.on-surface-variant": "#a7abb4",
			"color.outline-variant": "#2e3038",
			"color.inverse-surface": "#f9f9fe",
			"color.inverse-on-surface": "#535559",
			"color.primary-dim": "#a3bade",
			"color.primary-container": "#3d5472",
			"color.on-primary-container": "#d4e4ff",
			"color.primary-fixed": "#b9d0f5",
			"color.primary-fixed-dim": "#abc3e6",
			"color.on-primary-fixed": "#1b3350",
			"color.on-primary-fixed-variant": "#39506e",
			"color.inverse-primary": "#496080",
			"color.secondary": "#bcc7db",
			"color.secondary-dim": "#aeb9cd",
			"color.on-secondary": "#364151",
			"color.secondary-container": "#313c4c",
			"color.on-secondary-container": "#b4c0d4",
			"color.secondary-fixed": "#d8e3f8",
			"color.secondary-fixed-dim": "#c9d5ea",
			"color.on-secondary-fixed": "#354050",
			"color.on-secondary-fixed-variant": "#515c6d",
			"color.tertiary": "#e7deff",
			"color.tertiary-dim": "#dacdff",
			"color.on-tertiary": "#554c75",
			"color.tertiary-container": "#dacdff",
			"color.on-tertiary-container": "#4c436c",
			"color.tertiary-fixed": "#dacdff",
			"color.tertiary-fixed-dim": "#ccc0f0",
			"color.on-tertiary-fixed": "#393057",
			"color.on-tertiary-fixed-variant": "#564c76",
			"color.error": "#fa746f",
			"color.error-dim": "#c54d4a",
			"color.on-error": "#490006",
			"color.error-container": "#871f21",
			"color.on-error-container": "#ff9993",
			"color.shadow": "#000",
			"color.scrim": "#000",
			"color.on-on-primary": "#b0c8ec",
			"color.primary-container-subtle": "#142d4a",
			"color.on-primary-container-subtle": "#95adcf",
			"color.secondary-container-subtle": "#222d3c",
			"color.on-secondary-container-subtle": "#a0acbf",
			"color.tertiary-container-subtle": "#2f264d",
			"color.on-tertiary-container-subtle": "#b0a4d3",
			"color.error-container-subtle": "#60000a",
			"color.on-error-container-subtle": "#ff8983",
			"color.canvas": "#121316",
			"color.ink": "#f8fafc",
			"color.border-subtle": "#2e3038",
			"color.success": "#4ade80",
			"color.warning": "#fb923c",
			"color.danger": "#e60012"
		} }
	}
};
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/utils/math_utils.js
function m(e) {
	return e < 0 ? -1 : e === 0 ? 0 : 1;
}
function h(e, t, n) {
	return (1 - n) * e + n * t;
}
function g(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function _(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function v(e) {
	return e %= 360, e < 0 && (e += 360), e;
}
function y(e) {
	return e %= 360, e < 0 && (e += 360), e;
}
function b(e, t) {
	return 180 - Math.abs(Math.abs(e - t) - 180);
}
function x(e, t) {
	return [
		e[0] * t[0][0] + e[1] * t[0][1] + e[2] * t[0][2],
		e[0] * t[1][0] + e[1] * t[1][1] + e[2] * t[1][2],
		e[0] * t[2][0] + e[1] * t[2][1] + e[2] * t[2][2]
	];
}
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/utils/color_utils.js
var S = [
	[
		.41233895,
		.35762064,
		.18051042
	],
	[
		.2126,
		.7152,
		.0722
	],
	[
		.01932141,
		.11916382,
		.95034478
	]
], C = [
	[
		3.2413774792388685,
		-1.5376652402851851,
		-.49885366846268053
	],
	[
		-.9691452513005321,
		1.8758853451067872,
		.04156585616912061
	],
	[
		.05562093689691305,
		-.20395524564742123,
		1.0571799111220335
	]
], w = [
	95.047,
	100,
	108.883
];
function T(e, t, n) {
	return (255 << 24 | (e & 255) << 16 | (t & 255) << 8 | n & 255) >>> 0;
}
function E(e) {
	return T(M(e[0]), M(e[1]), M(e[2]));
}
function ee(e) {
	return e >> 24 & 255;
}
function te(e) {
	return e >> 16 & 255;
}
function D(e) {
	return e >> 8 & 255;
}
function O(e) {
	return e & 255;
}
function ne(e, t, n) {
	let r = C, i = r[0][0] * e + r[0][1] * t + r[0][2] * n, a = r[1][0] * e + r[1][1] * t + r[1][2] * n, o = r[2][0] * e + r[2][1] * t + r[2][2] * n;
	return T(M(i), M(a), M(o));
}
function k(e) {
	return x([
		j(te(e)),
		j(D(e)),
		j(O(e))
	], S);
}
function re(e, t, n) {
	let r = w, i = (e + 16) / 116, a = t / 500 + i, o = i - n / 200, s = ue(a), c = ue(i), l = ue(o);
	return ne(s * r[0], c * r[1], l * r[2]);
}
function ie(e) {
	let t = j(te(e)), n = j(D(e)), r = j(O(e)), i = S, a = i[0][0] * t + i[0][1] * n + i[0][2] * r, o = i[1][0] * t + i[1][1] * n + i[1][2] * r, s = i[2][0] * t + i[2][1] * n + i[2][2] * r, c = w, l = a / c[0], u = o / c[1], d = s / c[2], f = le(l), p = le(u), m = le(d);
	return [
		116 * p - 16,
		500 * (f - p),
		200 * (p - m)
	];
}
function ae(e) {
	let t = M(A(e));
	return T(t, t, t);
}
function oe(e) {
	let t = k(e)[1];
	return 116 * le(t / 100) - 16;
}
function A(e) {
	return 100 * ue((e + 16) / 116);
}
function se(e) {
	return le(e / 100) * 116 - 16;
}
function j(e) {
	let t = e / 255;
	return t <= .040449936 ? t / 12.92 * 100 : ((t + .055) / 1.055) ** 2.4 * 100;
}
function M(e) {
	let t = e / 100, n = 0;
	return n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055, g(0, 255, Math.round(n * 255));
}
function ce() {
	return w;
}
function le(e) {
	return e > .008856451679035631 ? e ** (1 / 3) : (903.2962962962963 * e + 16) / 116;
}
function ue(e) {
	let t = e * e * e;
	return t > .008856451679035631 ? t : (116 * e - 16) / 903.2962962962963;
}
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/hct/viewing_conditions.js
var N = class e {
	static make(t = ce(), n = 200 / Math.PI * A(50) / 100, r = 50, i = 2, a = !1) {
		let o = t, s = o[0] * .401288 + o[1] * .650173 + o[2] * -.051461, c = o[0] * -.250268 + o[1] * 1.204414 + o[2] * .045854, l = o[0] * -.002079 + o[1] * .048952 + o[2] * .953127, u = .8 + i / 10, d = u >= .9 ? h(.59, .69, (u - .9) * 10) : h(.525, .59, (u - .8) * 10), f = a ? 1 : u * (1 - 1 / 3.6 * Math.exp((-n - 42) / 92));
		f = f > 1 ? 1 : f < 0 ? 0 : f;
		let p = u, m = [
			100 / s * f + 1 - f,
			100 / c * f + 1 - f,
			100 / l * f + 1 - f
		], g = 1 / (5 * n + 1), _ = g * g * g * g, v = 1 - _, y = _ * n + .1 * v * v * Math.cbrt(5 * n), b = A(r) / t[1], x = 1.48 + Math.sqrt(b), S = .725 / b ** .2, C = S, w = [
			(y * m[0] * s / 100) ** .42,
			(y * m[1] * c / 100) ** .42,
			(y * m[2] * l / 100) ** .42
		], T = [
			400 * w[0] / (w[0] + 27.13),
			400 * w[1] / (w[1] + 27.13),
			400 * w[2] / (w[2] + 27.13)
		], E = (2 * T[0] + T[1] + .05 * T[2]) * S;
		return new e(b, E, S, C, d, p, m, y, y ** .25, x);
	}
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.n = e, this.aw = t, this.nbb = n, this.ncb = r, this.c = i, this.nc = a, this.rgbD = o, this.fl = s, this.fLRoot = c, this.z = l;
	}
};
N.DEFAULT = N.make();
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/hct/cam16.js
var de = class e {
	constructor(e, t, n, r, i, a, o, s, c) {
		this.hue = e, this.chroma = t, this.j = n, this.q = r, this.m = i, this.s = a, this.jstar = o, this.astar = s, this.bstar = c;
	}
	distance(e) {
		let t = this.jstar - e.jstar, n = this.astar - e.astar, r = this.bstar - e.bstar;
		return 1.41 * Math.sqrt(t * t + n * n + r * r) ** .63;
	}
	static fromInt(t) {
		return e.fromIntInViewingConditions(t, N.DEFAULT);
	}
	static fromIntInViewingConditions(t, n) {
		let r = (t & 16711680) >> 16, i = (t & 65280) >> 8, a = t & 255, o = j(r), s = j(i), c = j(a), l = .41233895 * o + .35762064 * s + .18051042 * c, u = .2126 * o + .7152 * s + .0722 * c, d = .01932141 * o + .11916382 * s + .95034478 * c, f = .401288 * l + .650173 * u - .051461 * d, p = -.250268 * l + 1.204414 * u + .045854 * d, h = -.002079 * l + .048952 * u + .953127 * d, g = n.rgbD[0] * f, _ = n.rgbD[1] * p, v = n.rgbD[2] * h, b = (n.fl * Math.abs(g) / 100) ** .42, x = (n.fl * Math.abs(_) / 100) ** .42, S = (n.fl * Math.abs(v) / 100) ** .42, C = m(g) * 400 * b / (b + 27.13), w = m(_) * 400 * x / (x + 27.13), T = m(v) * 400 * S / (S + 27.13), E = (11 * C + -12 * w + T) / 11, ee = (C + w - 2 * T) / 9, te = (20 * C + 20 * w + 21 * T) / 20, D = (40 * C + 20 * w + T) / 20, O = y(Math.atan2(ee, E) * 180 / Math.PI), ne = O * Math.PI / 180, k = 100 * (D * n.nbb / n.aw) ** +(n.c * n.z), re = 4 / n.c * Math.sqrt(k / 100) * (n.aw + 4) * n.fLRoot, ie = O < 20.14 ? O + 360 : O, ae = (5e4 / 13 * (.25 * (Math.cos(ie * Math.PI / 180 + 2) + 3.8)) * n.nc * n.ncb * Math.sqrt(E * E + ee * ee) / (te + .305)) ** .9 * (1.64 - .29 ** n.n) ** .73, oe = ae * Math.sqrt(k / 100), A = oe * n.fLRoot, se = 50 * Math.sqrt(ae * n.c / (n.aw + 4)), M = (1 + 100 * .007) * k / (1 + .007 * k), ce = 1 / .0228 * Math.log(1 + .0228 * A), le = ce * Math.cos(ne), ue = ce * Math.sin(ne);
		return new e(O, oe, k, re, A, se, M, le, ue);
	}
	static fromJch(t, n, r) {
		return e.fromJchInViewingConditions(t, n, r, N.DEFAULT);
	}
	static fromJchInViewingConditions(t, n, r, i) {
		let a = 4 / i.c * Math.sqrt(t / 100) * (i.aw + 4) * i.fLRoot, o = n * i.fLRoot, s = n / Math.sqrt(t / 100), c = 50 * Math.sqrt(s * i.c / (i.aw + 4)), l = r * Math.PI / 180, u = (1 + 100 * .007) * t / (1 + .007 * t), d = 1 / .0228 * Math.log(1 + .0228 * o), f = d * Math.cos(l), p = d * Math.sin(l);
		return new e(r, n, t, a, o, c, u, f, p);
	}
	static fromUcs(t, n, r) {
		return e.fromUcsInViewingConditions(t, n, r, N.DEFAULT);
	}
	static fromUcsInViewingConditions(t, n, r, i) {
		let a = n, o = r, s = Math.sqrt(a * a + o * o), c = (Math.exp(s * .0228) - 1) / .0228 / i.fLRoot, l = 180 / Math.PI * Math.atan2(o, a);
		l < 0 && (l += 360);
		let u = t / (1 - (t - 100) * .007);
		return e.fromJchInViewingConditions(u, c, l, i);
	}
	toInt() {
		return this.viewed(N.DEFAULT);
	}
	viewed(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, h = (460 * o - 220 * u - 6300 * d) / 1403, g = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), _ = m(f) * (100 / e.fl) * g ** (1 / .42), v = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), y = m(p) * (100 / e.fl) * v ** (1 / .42), b = Math.max(0, 27.13 * Math.abs(h) / (400 - Math.abs(h))), x = m(h) * (100 / e.fl) * b ** (1 / .42), S = _ / e.rgbD[0], C = y / e.rgbD[1], w = x / e.rgbD[2];
		return ne(1.86206786 * S - 1.01125463 * C + .14918677 * w, .38752654 * S + .62144744 * C - .00897398 * w, -.0158415 * S - .03412294 * C + 1.04996444 * w);
	}
	static fromXyzInViewingConditions(t, n, r, i) {
		let a = .401288 * t + .650173 * n - .051461 * r, o = -.250268 * t + 1.204414 * n + .045854 * r, s = -.002079 * t + .048952 * n + .953127 * r, c = i.rgbD[0] * a, l = i.rgbD[1] * o, u = i.rgbD[2] * s, d = (i.fl * Math.abs(c) / 100) ** .42, f = (i.fl * Math.abs(l) / 100) ** .42, p = (i.fl * Math.abs(u) / 100) ** .42, h = m(c) * 400 * d / (d + 27.13), g = m(l) * 400 * f / (f + 27.13), _ = m(u) * 400 * p / (p + 27.13), v = (11 * h + -12 * g + _) / 11, y = (h + g - 2 * _) / 9, b = (20 * h + 20 * g + 21 * _) / 20, x = (40 * h + 20 * g + _) / 20, S = Math.atan2(y, v) * 180 / Math.PI, C = S < 0 ? S + 360 : S >= 360 ? S - 360 : S, w = C * Math.PI / 180, T = 100 * (x * i.nbb / i.aw) ** +(i.c * i.z), E = 4 / i.c * Math.sqrt(T / 100) * (i.aw + 4) * i.fLRoot, ee = C < 20.14 ? C + 360 : C, te = (5e4 / 13 * (1 / 4 * (Math.cos(ee * Math.PI / 180 + 2) + 3.8)) * i.nc * i.ncb * Math.sqrt(v * v + y * y) / (b + .305)) ** .9 * (1.64 - .29 ** i.n) ** .73, D = te * Math.sqrt(T / 100), O = D * i.fLRoot, ne = 50 * Math.sqrt(te * i.c / (i.aw + 4)), k = (1 + 100 * .007) * T / (1 + .007 * T), re = Math.log(1 + .0228 * O) / .0228, ie = re * Math.cos(w), ae = re * Math.sin(w);
		return new e(C, D, T, E, O, ne, k, ie, ae);
	}
	xyzInViewingConditions(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, h = (460 * o - 220 * u - 6300 * d) / 1403, g = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), _ = m(f) * (100 / e.fl) * g ** (1 / .42), v = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), y = m(p) * (100 / e.fl) * v ** (1 / .42), b = Math.max(0, 27.13 * Math.abs(h) / (400 - Math.abs(h))), x = m(h) * (100 / e.fl) * b ** (1 / .42), S = _ / e.rgbD[0], C = y / e.rgbD[1], w = x / e.rgbD[2];
		return [
			1.86206786 * S - 1.01125463 * C + .14918677 * w,
			.38752654 * S + .62144744 * C - .00897398 * w,
			-.0158415 * S - .03412294 * C + 1.04996444 * w
		];
	}
}, P = class e {
	static sanitizeRadians(e) {
		return (e + Math.PI * 8) % (Math.PI * 2);
	}
	static trueDelinearized(e) {
		let t = e / 100, n = 0;
		return n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055, n * 255;
	}
	static chromaticAdaptation(e) {
		let t = Math.abs(e) ** .42;
		return m(e) * 400 * t / (t + 27.13);
	}
	static hueOf(t) {
		let n = x(t, e.SCALED_DISCOUNT_FROM_LINRGB), r = e.chromaticAdaptation(n[0]), i = e.chromaticAdaptation(n[1]), a = e.chromaticAdaptation(n[2]), o = (11 * r + -12 * i + a) / 11, s = (r + i - 2 * a) / 9;
		return Math.atan2(s, o);
	}
	static areInCyclicOrder(t, n, r) {
		return e.sanitizeRadians(n - t) < e.sanitizeRadians(r - t);
	}
	static intercept(e, t, n) {
		return (t - e) / (n - e);
	}
	static lerpPoint(e, t, n) {
		return [
			e[0] + (n[0] - e[0]) * t,
			e[1] + (n[1] - e[1]) * t,
			e[2] + (n[2] - e[2]) * t
		];
	}
	static setCoordinate(t, n, r, i) {
		let a = e.intercept(t[i], n, r[i]);
		return e.lerpPoint(t, a, r);
	}
	static isBounded(e) {
		return 0 <= e && e <= 100;
	}
	static nthVertex(t, n) {
		let r = e.Y_FROM_LINRGB[0], i = e.Y_FROM_LINRGB[1], a = e.Y_FROM_LINRGB[2], o = n % 4 <= 1 ? 0 : 100, s = n % 2 == 0 ? 0 : 100;
		if (n < 4) {
			let n = o, c = s, l = (t - n * i - c * a) / r;
			return e.isBounded(l) ? [
				l,
				n,
				c
			] : [
				-1,
				-1,
				-1
			];
		}
		if (n < 8) {
			let n = o, c = s, l = (t - c * r - n * a) / i;
			return e.isBounded(l) ? [
				c,
				l,
				n
			] : [
				-1,
				-1,
				-1
			];
		}
		{
			let n = o, c = s, l = (t - n * r - c * i) / a;
			return e.isBounded(l) ? [
				n,
				c,
				l
			] : [
				-1,
				-1,
				-1
			];
		}
	}
	static bisectToSegment(t, n) {
		let r = [
			-1,
			-1,
			-1
		], i = r, a = 0, o = 0, s = !1, c = !0;
		for (let l = 0; l < 12; l++) {
			let u = e.nthVertex(t, l);
			if (u[0] < 0) continue;
			let d = e.hueOf(u);
			if (!s) {
				r = u, i = u, a = d, o = d, s = !0;
				continue;
			}
			(c || e.areInCyclicOrder(a, d, o)) && (c = !1, e.areInCyclicOrder(a, n, d) ? (i = u, o = d) : (r = u, a = d));
		}
		return [r, i];
	}
	static midpoint(e, t) {
		return [
			(e[0] + t[0]) / 2,
			(e[1] + t[1]) / 2,
			(e[2] + t[2]) / 2
		];
	}
	static criticalPlaneBelow(e) {
		return Math.floor(e - .5);
	}
	static criticalPlaneAbove(e) {
		return Math.ceil(e - .5);
	}
	static bisectToLimit(t, n) {
		let r = e.bisectToSegment(t, n), i = r[0], a = e.hueOf(i), o = r[1];
		for (let t = 0; t < 3; t++) if (i[t] !== o[t]) {
			let r = -1, s = 255;
			i[t] < o[t] ? (r = e.criticalPlaneBelow(e.trueDelinearized(i[t])), s = e.criticalPlaneAbove(e.trueDelinearized(o[t]))) : (r = e.criticalPlaneAbove(e.trueDelinearized(i[t])), s = e.criticalPlaneBelow(e.trueDelinearized(o[t])));
			for (let c = 0; c < 8 && !(Math.abs(s - r) <= 1); c++) {
				let c = Math.floor((r + s) / 2), l = e.CRITICAL_PLANES[c], u = e.setCoordinate(i, l, o, t), d = e.hueOf(u);
				e.areInCyclicOrder(a, n, d) ? (o = u, s = c) : (i = u, a = d, r = c);
			}
		}
		return e.midpoint(i, o);
	}
	static inverseChromaticAdaptation(e) {
		let t = Math.abs(e), n = Math.max(0, 27.13 * t / (400 - t));
		return m(e) * n ** (1 / .42);
	}
	static findResultByJ(t, n, r) {
		let i = Math.sqrt(r) * 11, a = N.DEFAULT, o = 1 / (1.64 - .29 ** a.n) ** .73, s = .25 * (Math.cos(t + 2) + 3.8) * (5e4 / 13) * a.nc * a.ncb, c = Math.sin(t), l = Math.cos(t);
		for (let t = 0; t < 5; t++) {
			let u = i / 100, d = ((n === 0 || i === 0 ? 0 : n / Math.sqrt(u)) * o) ** (1 / .9), f = a.aw * u ** (1 / a.c / a.z) / a.nbb, p = 23 * (f + .305) * d / (23 * s + 11 * d * l + 108 * d * c), m = p * l, h = p * c, g = (460 * f + 451 * m + 288 * h) / 1403, _ = (460 * f - 891 * m - 261 * h) / 1403, v = (460 * f - 220 * m - 6300 * h) / 1403, y = x([
				e.inverseChromaticAdaptation(g),
				e.inverseChromaticAdaptation(_),
				e.inverseChromaticAdaptation(v)
			], e.LINRGB_FROM_SCALED_DISCOUNT);
			if (y[0] < 0 || y[1] < 0 || y[2] < 0) return 0;
			let b = e.Y_FROM_LINRGB[0], S = e.Y_FROM_LINRGB[1], C = e.Y_FROM_LINRGB[2], w = b * y[0] + S * y[1] + C * y[2];
			if (w <= 0) return 0;
			if (t === 4 || Math.abs(w - r) < .002) return y[0] > 100.01 || y[1] > 100.01 || y[2] > 100.01 ? 0 : E(y);
			i -= (w - r) * i / (2 * w);
		}
		return 0;
	}
	static solveToInt(t, n, r) {
		if (n < 1e-4 || r < 1e-4 || r > 99.9999) return ae(r);
		t = y(t);
		let i = t / 180 * Math.PI, a = A(r), o = e.findResultByJ(i, n, a);
		return o === 0 ? E(e.bisectToLimit(a, i)) : o;
	}
	static solveToCam(t, n, r) {
		return de.fromInt(e.solveToInt(t, n, r));
	}
};
P.SCALED_DISCOUNT_FROM_LINRGB = [
	[
		.001200833568784504,
		.002389694492170889,
		.0002795742885861124
	],
	[
		.0005891086651375999,
		.0029785502573438758,
		.0003270666104008398
	],
	[
		.00010146692491640572,
		.0005364214359186694,
		.0032979401770712076
	]
], P.LINRGB_FROM_SCALED_DISCOUNT = [
	[
		1373.2198709594231,
		-1100.4251190754821,
		-7.278681089101213
	],
	[
		-271.815969077903,
		559.6580465940733,
		-32.46047482791194
	],
	[
		1.9622899599665666,
		-57.173814538844006,
		308.7233197812385
	]
], P.Y_FROM_LINRGB = [
	.2126,
	.7152,
	.0722
], P.CRITICAL_PLANES = [
	.015176349177441876,
	.045529047532325624,
	.07588174588720938,
	.10623444424209313,
	.13658714259697685,
	.16693984095186062,
	.19729253930674434,
	.2276452376616281,
	.2579979360165119,
	.28835063437139563,
	.3188300904430532,
	.350925934958123,
	.3848314933096426,
	.42057480301049466,
	.458183274052838,
	.4976837250274023,
	.5391024159806381,
	.5824650784040898,
	.6277969426914107,
	.6751227633498623,
	.7244668422128921,
	.775853049866786,
	.829304845476233,
	.8848452951698498,
	.942497089126609,
	1.0022825574869039,
	1.0642236851973577,
	1.1283421258858297,
	1.1946592148522128,
	1.2631959812511864,
	1.3339731595349034,
	1.407011200216447,
	1.4823302800086415,
	1.5599503113873272,
	1.6398909516233677,
	1.7221716113234105,
	1.8068114625156377,
	1.8938294463134073,
	1.9832442801866852,
	2.075074464868551,
	2.1693382909216234,
	2.2660538449872063,
	2.36523901573795,
	2.4669114995532007,
	2.5710888059345764,
	2.6777882626779785,
	2.7870270208169257,
	2.898822059350997,
	3.0131901897720907,
	3.1301480604002863,
	3.2497121605402226,
	3.3718988244681087,
	3.4967242352587946,
	3.624204428461639,
	3.754355295633311,
	3.887192587735158,
	4.022731918402185,
	4.160988767090289,
	4.301978482107941,
	4.445716283538092,
	4.592217266055746,
	4.741496401646282,
	4.893568542229298,
	5.048448422192488,
	5.20615066083972,
	5.3666897647573375,
	5.5300801301023865,
	5.696336044816294,
	5.865471690767354,
	6.037501145825082,
	6.212438385869475,
	6.390297286737924,
	6.571091626112461,
	6.7548350853498045,
	6.941541251256611,
	7.131223617812143,
	7.323895587840543,
	7.5195704746346665,
	7.7182615035334345,
	7.919981813454504,
	8.124744458384042,
	8.332562408825165,
	8.543448553206703,
	8.757415699253682,
	8.974476575321063,
	9.194643831691977,
	9.417930041841839,
	9.644347703669503,
	9.873909240696694,
	10.106627003236781,
	10.342513269534024,
	10.58158024687427,
	10.8238400726681,
	11.069304815507364,
	11.317986476196008,
	11.569896988756009,
	11.825048221409341,
	12.083451977536606,
	12.345119996613247,
	12.610063955123938,
	12.878295467455942,
	13.149826086772048,
	13.42466730586372,
	13.702830557985108,
	13.984327217668513,
	14.269168601521828,
	14.55736596900856,
	14.848930523210871,
	15.143873411576273,
	15.44220572664832,
	15.743938506781891,
	16.04908273684337,
	16.35764934889634,
	16.66964922287304,
	16.985093187232053,
	17.30399201960269,
	17.62635644741625,
	17.95219714852476,
	18.281524751807332,
	18.614349837764564,
	18.95068293910138,
	19.290534541298456,
	19.633915083172692,
	19.98083495742689,
	20.331304511189067,
	20.685334046541502,
	21.042933821039977,
	21.404114048223256,
	21.76888489811322,
	22.137256497705877,
	22.50923893145328,
	22.884842241736916,
	23.264076429332462,
	23.6469514538663,
	24.033477234264016,
	24.42366364919083,
	24.817520537484558,
	25.21505769858089,
	25.61628489293138,
	26.021211842414342,
	26.429848230738664,
	26.842203703840827,
	27.258287870275353,
	27.678110301598522,
	28.10168053274597,
	28.529008062403893,
	28.96010235337422,
	29.39497283293396,
	29.83362889318845,
	30.276079891419332,
	30.722335150426627,
	31.172403958865512,
	31.62629557157785,
	32.08401920991837,
	32.54558406207592,
	33.010999283389665,
	33.4802739966603,
	33.953417292456834,
	34.430438229418264,
	34.911345834551085,
	35.39614910352207,
	35.88485700094671,
	36.37747846067349,
	36.87402238606382,
	37.37449765026789,
	37.87891309649659,
	38.38727753828926,
	38.89959975977785,
	39.41588851594697,
	39.93615253289054,
	40.460400508064545,
	40.98864111053629,
	41.520882981230194,
	42.05713473317016,
	42.597404951718396,
	43.141702194811224,
	43.6900349931913,
	44.24241185063697,
	44.798841244188324,
	45.35933162437017,
	45.92389141541209,
	46.49252901546552,
	47.065252796817916,
	47.64207110610409,
	48.22299226451468,
	48.808024568002054,
	49.3971762874833,
	49.9904556690408,
	50.587870934119984,
	51.189430279724725,
	51.79514187861014,
	52.40501387947288,
	53.0190544071392,
	53.637271562750364,
	54.259673423945976,
	54.88626804504493,
	55.517063457223934,
	56.15206766869424,
	56.79128866487574,
	57.43473440856916,
	58.08241284012621,
	58.734331877617365,
	59.39049941699807,
	60.05092333227251,
	60.715611475655585,
	61.38457167773311,
	62.057811747619894,
	62.7353394731159,
	63.417162620860914,
	64.10328893648692,
	64.79372614476921,
	65.48848194977529,
	66.18756403501224,
	66.89098006357258,
	67.59873767827808,
	68.31084450182222,
	69.02730813691093,
	69.74813616640164,
	70.47333615344107,
	71.20291564160104,
	71.93688215501312,
	72.67524319850172,
	73.41800625771542,
	74.16517879925733,
	74.9167682708136,
	75.67278210128072,
	76.43322770089146,
	77.1981124613393,
	77.96744375590167,
	78.74122893956174,
	79.51947534912904,
	80.30219030335869,
	81.08938110306934,
	81.88105503125999,
	82.67721935322541,
	83.4778813166706,
	84.28304815182372,
	85.09272707154808,
	85.90692527145302,
	86.72564993000343,
	87.54890820862819,
	88.3767072518277,
	89.2090541872801,
	90.04595612594655,
	90.88742016217518,
	91.73345337380438,
	92.58406282226491,
	93.43925555268066,
	94.29903859396902,
	95.16341895893969,
	96.03240364439274,
	96.9059996312159,
	97.78421388448044,
	98.6670533535366,
	99.55452497210776
];
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/hct/hct.js
var F = class e {
	static from(t, n, r) {
		return new e(P.solveToInt(t, n, r));
	}
	static fromInt(t) {
		return new e(t);
	}
	toInt() {
		return this.argb;
	}
	get hue() {
		return this.internalHue;
	}
	set hue(e) {
		this.setInternalState(P.solveToInt(e, this.internalChroma, this.internalTone));
	}
	get chroma() {
		return this.internalChroma;
	}
	set chroma(e) {
		this.setInternalState(P.solveToInt(this.internalHue, e, this.internalTone));
	}
	get tone() {
		return this.internalTone;
	}
	set tone(e) {
		this.setInternalState(P.solveToInt(this.internalHue, this.internalChroma, e));
	}
	setValue(e, t) {
		this[e] = t;
	}
	toString() {
		return `HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`;
	}
	static isBlue(e) {
		return e >= 250 && e < 270;
	}
	static isYellow(e) {
		return e >= 105 && e < 125;
	}
	static isCyan(e) {
		return e >= 170 && e < 207;
	}
	constructor(e) {
		this.argb = e;
		let t = de.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = oe(e), this.argb = e;
	}
	setInternalState(e) {
		let t = de.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = oe(e), this.argb = e;
	}
	inViewingConditions(t) {
		let n = de.fromInt(this.toInt()).xyzInViewingConditions(t), r = de.fromXyzInViewingConditions(n[0], n[1], n[2], N.make());
		return e.from(r.hue, r.chroma, se(n[1]));
	}
}, I = class e {
	static ratioOfTones(t, n) {
		return t = _(0, 100, t), n = _(0, 100, n), e.ratioOfYs(A(t), A(n));
	}
	static ratioOfYs(e, t) {
		let n = e > t ? e : t, r = n === t ? e : t;
		return (n + 5) / (r + 5);
	}
	static lighter(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = A(t), i = n * (r + 5) - 5, a = e.ratioOfYs(i, r), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = se(i) + .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static darker(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = A(t), i = (r + 5) / n - 5, a = e.ratioOfYs(r, i), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = se(i) - .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static lighterUnsafe(t, n) {
		let r = e.lighter(t, n);
		return r < 0 ? 100 : r;
	}
	static darkerUnsafe(t, n) {
		let r = e.darker(t, n);
		return r < 0 ? 0 : r;
	}
}, fe = class e {
	static isDisliked(e) {
		let t = Math.round(e.hue) >= 90 && Math.round(e.hue) <= 111, n = Math.round(e.chroma) > 16, r = Math.round(e.tone) < 65;
		return t && n && r;
	}
	static fixIfDisliked(t) {
		return e.isDisliked(t) ? F.from(t.hue, t.chroma, 70) : t;
	}
};
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/dynamiccolor/dynamic_color.js
function pe(e, t, n) {
	if (e.name !== n.name) throw Error(`Attempting to extend color ${e.name} with color ${n.name} of different name for spec version ${t}.`);
	if (e.isBackground !== n.isBackground) throw Error(`Attempting to extend color ${e.name} as a ${e.isBackground ? "background" : "foreground"} with color ${n.name} as a ${n.isBackground ? "background" : "foreground"} for spec version ${t}.`);
}
function L(e, t, n) {
	return pe(e, t, n), R.fromPalette({
		name: e.name,
		palette: (r) => r.specVersion >= t ? n.palette(r) : e.palette(r),
		tone: (r) => r.specVersion >= t ? n.tone(r) : e.tone(r),
		isBackground: e.isBackground,
		chromaMultiplier: (r) => {
			let i = r.specVersion >= t ? n.chromaMultiplier : e.chromaMultiplier;
			return i === void 0 ? 1 : i(r);
		},
		background: (r) => {
			let i = r.specVersion >= t ? n.background : e.background;
			return i === void 0 ? void 0 : i(r);
		},
		secondBackground: (r) => {
			let i = r.specVersion >= t ? n.secondBackground : e.secondBackground;
			return i === void 0 ? void 0 : i(r);
		},
		contrastCurve: (r) => {
			let i = r.specVersion >= t ? n.contrastCurve : e.contrastCurve;
			return i === void 0 ? void 0 : i(r);
		},
		toneDeltaPair: (r) => {
			let i = r.specVersion >= t ? n.toneDeltaPair : e.toneDeltaPair;
			return i === void 0 ? void 0 : i(r);
		}
	});
}
var R = class e {
	static fromPalette(t) {
		return new e(t.name ?? "", t.palette, t.tone ?? e.getInitialToneFromBackground(t.background), t.isBackground ?? !1, t.chromaMultiplier, t.background, t.secondBackground, t.contrastCurve, t.toneDeltaPair);
	}
	static getInitialToneFromBackground(e) {
		return e === void 0 ? (e) => 50 : (t) => e(t) ? e(t).getTone(t) : 50;
	}
	constructor(e, t, n, r, i, a, o, s, c) {
		if (this.name = e, this.palette = t, this.tone = n, this.isBackground = r, this.chromaMultiplier = i, this.background = a, this.secondBackground = o, this.contrastCurve = s, this.toneDeltaPair = c, this.hctCache = /* @__PURE__ */ new Map(), !a && o) throw Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);
		if (!a && s) throw Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);
		if (a && !s) throw Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`);
	}
	clone() {
		return e.fromPalette({
			name: this.name,
			palette: this.palette,
			tone: this.tone,
			isBackground: this.isBackground,
			chromaMultiplier: this.chromaMultiplier,
			background: this.background,
			secondBackground: this.secondBackground,
			contrastCurve: this.contrastCurve,
			toneDeltaPair: this.toneDeltaPair
		});
	}
	clearCache() {
		this.hctCache.clear();
	}
	getArgb(e) {
		return this.getHct(e).toInt();
	}
	getHct(e) {
		let t = this.hctCache.get(e);
		if (t != null) return t;
		let n = ve(e.specVersion).getHct(e, this);
		return this.hctCache.size > 4 && this.hctCache.clear(), this.hctCache.set(e, n), n;
	}
	getTone(e) {
		return ve(e.specVersion).getTone(e, this);
	}
	static foregroundTone(t, n) {
		let r = I.lighterUnsafe(t, n), i = I.darkerUnsafe(t, n), a = I.ratioOfTones(r, t), o = I.ratioOfTones(i, t);
		if (e.tonePrefersLightForeground(t)) {
			let e = Math.abs(a - o) < .1 && a < n && o < n;
			return a >= n || a >= o || e ? r : i;
		}
		return o >= n || o >= a ? i : r;
	}
	static tonePrefersLightForeground(e) {
		return Math.round(e) < 60;
	}
	static toneAllowsLightForeground(e) {
		return Math.round(e) <= 49;
	}
	static enableLightForeground(t) {
		return e.tonePrefersLightForeground(t) && !e.toneAllowsLightForeground(t) ? 49 : t;
	}
}, me = class {
	getHct(e, t) {
		let n = t.getTone(e);
		return t.palette(e).getHct(n);
	}
	getTone(e, t) {
		let n = e.contrastLevel < 0, r = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (r) {
			let i = r.roleA, a = r.roleB, o = r.delta, s = r.polarity, c = r.stayTogether, l = s === "nearer" || s === "lighter" && !e.isDark || s === "darker" && e.isDark, u = l ? i : a, d = l ? a : i, f = t.name === u.name, p = e.isDark ? 1 : -1, m = u.tone(e), h = d.tone(e);
			if (t.background && u.contrastCurve && d.contrastCurve) {
				let r = t.background(e), i = u.contrastCurve(e), a = d.contrastCurve(e);
				if (r && i && a) {
					let t = r.getTone(e), o = i.get(e.contrastLevel), s = a.get(e.contrastLevel);
					I.ratioOfTones(t, m) < o && (m = R.foregroundTone(t, o)), I.ratioOfTones(t, h) < s && (h = R.foregroundTone(t, s)), n && (m = R.foregroundTone(t, o), h = R.foregroundTone(t, s));
				}
			}
			return (h - m) * p < o && (h = _(0, 100, m + o * p), (h - m) * p >= o || (m = _(0, 100, h - o * p))), 50 <= m && m < 60 ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : 50 <= h && h < 60 && (c ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : h = p > 0 ? 60 : 49), f ? m : h;
		}
		{
			let r = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return r;
			let i = t.background(e).getTone(e), a = t.contrastCurve(e).get(e.contrastLevel);
			if (I.ratioOfTones(i, r) >= a || (r = R.foregroundTone(i, a)), n && (r = R.foregroundTone(i, a)), t.isBackground && 50 <= r && r < 60 && (r = I.ratioOfTones(49, i) >= a ? 49 : 60), t.secondBackground == null || t.secondBackground(e) === void 0) return r;
			let [o, s] = [t.background, t.secondBackground], [c, l] = [o(e).getTone(e), s(e).getTone(e)], [u, d] = [Math.max(c, l), Math.min(c, l)];
			if (I.ratioOfTones(u, r) >= a && I.ratioOfTones(d, r) >= a) return r;
			let f = I.lighter(u, a), p = I.darker(d, a), m = [];
			return f !== -1 && m.push(f), p !== -1 && m.push(p), R.tonePrefersLightForeground(c) || R.tonePrefersLightForeground(l) ? f < 0 ? 100 : f : m.length === 1 ? m[0] : p < 0 ? 0 : p;
		}
	}
}, he = class {
	getHct(e, t) {
		let n = t.palette(e), r = t.getTone(e), i = n.hue, a = n.chroma * (t.chromaMultiplier ? t.chromaMultiplier(e) : 1);
		return F.from(i, a, r);
	}
	getTone(e, t) {
		let n = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (n) {
			let r = n.roleA, i = n.roleB, a = n.polarity, o = n.constraint, s = a === "darker" || a === "relative_lighter" && e.isDark || a === "relative_darker" && !e.isDark ? -n.delta : n.delta, c = t.name === r.name, l = c ? r : i, u = c ? i : r, d = l.tone(e), f = u.getTone(e), p = s * (c ? 1 : -1);
			if (o === "exact" ? d = _(0, 100, f + p) : o === "nearer" ? d = p > 0 ? _(0, 100, _(f, f + p, d)) : _(0, 100, _(f + p, f, d)) : o === "farther" && (d = p > 0 ? _(f + p, 100, d) : _(0, f + p, d)), t.background && t.contrastCurve) {
				let n = t.background(e), r = t.contrastCurve(e);
				if (n && r) {
					let t = n.getTone(e), i = r.get(e.contrastLevel);
					d = I.ratioOfTones(t, d) >= i && e.contrastLevel >= 0 ? d : R.foregroundTone(t, i);
				}
			}
			return t.isBackground && !t.name.endsWith("_fixed_dim") && (d = d >= 57 ? _(65, 100, d) : _(0, 49, d)), d;
		}
		{
			let n = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return n;
			let r = t.background(e).getTone(e), i = t.contrastCurve(e).get(e.contrastLevel);
			if (n = I.ratioOfTones(r, n) >= i && e.contrastLevel >= 0 ? n : R.foregroundTone(r, i), t.isBackground && !t.name.endsWith("_fixed_dim") && (n = n >= 57 ? _(65, 100, n) : _(0, 49, n)), t.secondBackground == null || t.secondBackground(e) === void 0) return n;
			let [a, o] = [t.background, t.secondBackground], [s, c] = [a(e).getTone(e), o(e).getTone(e)], [l, u] = [Math.max(s, c), Math.min(s, c)];
			if (I.ratioOfTones(l, n) >= i && I.ratioOfTones(u, n) >= i) return n;
			let d = I.lighter(l, i), f = I.darker(u, i), p = [];
			return d !== -1 && p.push(d), f !== -1 && p.push(f), R.tonePrefersLightForeground(s) || R.tonePrefersLightForeground(c) ? d < 0 ? 100 : d : p.length === 1 ? p[0] : f < 0 ? 0 : f;
		}
	}
}, ge = new me(), _e = new he();
function ve(e) {
	return e === "2021" ? ge : _e;
}
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/palettes/tonal_palette.js
var z = class e {
	static fromInt(t) {
		let n = F.fromInt(t);
		return e.fromHct(n);
	}
	static fromHct(t) {
		return new e(t.hue, t.chroma, t);
	}
	static fromHueAndChroma(t, n) {
		let r = new ye(t, n).create();
		return new e(t, n, r);
	}
	constructor(e, t, n) {
		this.hue = e, this.chroma = t, this.keyColor = n, this.cache = /* @__PURE__ */ new Map();
	}
	tone(e) {
		let t = this.cache.get(e);
		return t === void 0 && (t = e == 99 && F.isYellow(this.hue) ? this.averageArgb(this.tone(98), this.tone(100)) : F.from(this.hue, this.chroma, e).toInt(), this.cache.set(e, t)), t;
	}
	getHct(e) {
		return F.fromInt(this.tone(e));
	}
	averageArgb(e, t) {
		let n = e >>> 16 & 255, r = e >>> 8 & 255, i = e & 255, a = t >>> 16 & 255, o = t >>> 8 & 255, s = t & 255, c = Math.round((n + a) / 2), l = Math.round((r + o) / 2), u = Math.round((i + s) / 2);
		return (255 << 24 | (c & 255) << 16 | (l & 255) << 8 | u & 255) >>> 0;
	}
}, ye = class {
	constructor(e, t) {
		this.hue = e, this.requestedChroma = t, this.chromaCache = /* @__PURE__ */ new Map(), this.maxChromaValue = 200;
	}
	create() {
		let e = 0, t = 100;
		for (; e < t;) {
			let n = Math.floor((e + t) / 2), r = this.maxChroma(n) < this.maxChroma(n + 1);
			if (this.maxChroma(n) >= this.requestedChroma - .01) {
				if (Math.abs(e - 50) < Math.abs(t - 50)) t = n;
				else {
					if (e === n) return F.from(this.hue, this.requestedChroma, e);
					e = n;
				}
			} else r ? e = n + 1 : t = n;
		}
		return F.from(this.hue, this.requestedChroma, e);
	}
	maxChroma(e) {
		if (this.chromaCache.has(e)) return this.chromaCache.get(e);
		let t = F.from(this.hue, this.maxChromaValue, e).chroma;
		return this.chromaCache.set(e, t), t;
	}
}, be = class e {
	constructor(e) {
		this.input = e, this.hctsByTempCache = [], this.hctsByHueCache = [], this.tempsByHctCache = /* @__PURE__ */ new Map(), this.inputRelativeTemperatureCache = -1, this.complementCache = null;
	}
	get hctsByTemp() {
		if (this.hctsByTempCache.length > 0) return this.hctsByTempCache;
		let e = this.hctsByHue.concat([this.input]), t = this.tempsByHct;
		return e.sort((e, n) => t.get(e) - t.get(n)), this.hctsByTempCache = e, e;
	}
	get warmest() {
		return this.hctsByTemp[this.hctsByTemp.length - 1];
	}
	get coldest() {
		return this.hctsByTemp[0];
	}
	analogous(e = 5, t = 12) {
		let n = Math.round(this.input.hue), r = this.hctsByHue[n], i = this.relativeTemperature(r), a = [r], o = 0;
		for (let e = 0; e < 360; e++) {
			let t = v(n + e), r = this.hctsByHue[t], a = this.relativeTemperature(r), s = Math.abs(a - i);
			i = a, o += s;
		}
		let s = 1, c = o / t, l = 0;
		for (i = this.relativeTemperature(r); a.length < t;) {
			let e = v(n + s), r = this.hctsByHue[e], o = this.relativeTemperature(r), u = Math.abs(o - i);
			l += u;
			let d = a.length * c, f = l >= d, p = 1;
			for (; f && a.length < t;) {
				a.push(r);
				let e = (a.length + p) * c;
				f = l >= e, p++;
			}
			if (i = o, s++, s > 360) {
				for (; a.length < t;) a.push(r);
				break;
			}
		}
		let u = [this.input], d = Math.floor((e - 1) / 2);
		for (let e = 1; e < d + 1; e++) {
			let t = 0 - e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.splice(0, 0, a[t]);
		}
		let f = e - d - 1;
		for (let e = 1; e < f + 1; e++) {
			let t = e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.push(a[t]);
		}
		return u;
	}
	get complement() {
		if (this.complementCache != null) return this.complementCache;
		let t = this.coldest.hue, n = this.tempsByHct.get(this.coldest), r = this.warmest.hue, i = this.tempsByHct.get(this.warmest) - n, a = e.isBetween(this.input.hue, t, r), o = a ? r : t, s = a ? t : r, c = 1e3, l = this.hctsByHue[Math.round(this.input.hue)], u = 1 - this.inputRelativeTemperature;
		for (let t = 0; t <= 360; t += 1) {
			let r = y(o + 1 * t);
			if (!e.isBetween(r, o, s)) continue;
			let a = this.hctsByHue[Math.round(r)], d = (this.tempsByHct.get(a) - n) / i, f = Math.abs(u - d);
			f < c && (c = f, l = a);
		}
		return this.complementCache = l, this.complementCache;
	}
	relativeTemperature(e) {
		let t = this.tempsByHct.get(this.warmest) - this.tempsByHct.get(this.coldest), n = this.tempsByHct.get(e) - this.tempsByHct.get(this.coldest);
		return t === 0 ? .5 : n / t;
	}
	get inputRelativeTemperature() {
		return this.inputRelativeTemperatureCache >= 0 || (this.inputRelativeTemperatureCache = this.relativeTemperature(this.input)), this.inputRelativeTemperatureCache;
	}
	get tempsByHct() {
		if (this.tempsByHctCache.size > 0) return this.tempsByHctCache;
		let t = this.hctsByHue.concat([this.input]), n = /* @__PURE__ */ new Map();
		for (let r of t) n.set(r, e.rawTemperature(r));
		return this.tempsByHctCache = n, n;
	}
	get hctsByHue() {
		if (this.hctsByHueCache.length > 0) return this.hctsByHueCache;
		let e = [];
		for (let t = 0; t <= 360; t += 1) {
			let n = F.from(t, this.input.chroma, this.input.tone);
			e.push(n);
		}
		return this.hctsByHueCache = e, this.hctsByHueCache;
	}
	static isBetween(e, t, n) {
		return t < n ? t <= e && e <= n : t <= e || e <= n;
	}
	static rawTemperature(e) {
		let t = ie(e.toInt()), n = y(Math.atan2(t[2], t[1]) * 180 / Math.PI);
		return -.5 + .02 * Math.sqrt(t[1] * t[1] + t[2] * t[2]) ** 1.07 * Math.cos(y(n - 50) * Math.PI / 180);
	}
}, B = class {
	constructor(e, t, n, r) {
		this.low = e, this.normal = t, this.medium = n, this.high = r;
	}
	get(e) {
		return e <= -1 ? this.low : e < 0 ? h(this.low, this.normal, (e - -1) / 1) : e < .5 ? h(this.normal, this.medium, (e - 0) / .5) : e < 1 ? h(this.medium, this.high, (e - .5) / .5) : this.high;
	}
}, V = class {
	constructor(e, t, n, r, i, a) {
		this.roleA = e, this.roleB = t, this.delta = n, this.polarity = r, this.stayTogether = i, this.constraint = a, this.constraint = a ?? "exact";
	}
}, H;
(function(e) {
	e[e.MONOCHROME = 0] = "MONOCHROME", e[e.NEUTRAL = 1] = "NEUTRAL", e[e.TONAL_SPOT = 2] = "TONAL_SPOT", e[e.VIBRANT = 3] = "VIBRANT", e[e.EXPRESSIVE = 4] = "EXPRESSIVE", e[e.FIDELITY = 5] = "FIDELITY", e[e.CONTENT = 6] = "CONTENT", e[e.RAINBOW = 7] = "RAINBOW", e[e.FRUIT_SALAD = 8] = "FRUIT_SALAD", e[e.CMF = 9] = "CMF";
})(H ||= {});
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/dynamiccolor/color_spec_2021.js
function xe(e) {
	return e.variant === H.FIDELITY || e.variant === H.CONTENT;
}
function U(e) {
	return e.variant === H.MONOCHROME;
}
function Se(e, t, n, r) {
	let i = n, a = F.from(e, t, n);
	if (a.chroma < t) {
		let n = a.chroma;
		for (; a.chroma < t;) {
			i += r ? -1 : 1;
			let o = F.from(e, t, i);
			if (n > o.chroma || Math.abs(o.chroma - t) < .4) break;
			Math.abs(o.chroma - t) < Math.abs(a.chroma - t) && (a = o), n = Math.max(n, o.chroma);
		}
	}
	return i;
}
var Ce = class {
	primaryPaletteKeyColor() {
		return R.fromPalette({
			name: "primary_palette_key_color",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.primaryPalette.keyColor.tone
		});
	}
	secondaryPaletteKeyColor() {
		return R.fromPalette({
			name: "secondary_palette_key_color",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.secondaryPalette.keyColor.tone
		});
	}
	tertiaryPaletteKeyColor() {
		return R.fromPalette({
			name: "tertiary_palette_key_color",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.tertiaryPalette.keyColor.tone
		});
	}
	neutralPaletteKeyColor() {
		return R.fromPalette({
			name: "neutral_palette_key_color",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.neutralPalette.keyColor.tone
		});
	}
	neutralVariantPaletteKeyColor() {
		return R.fromPalette({
			name: "neutral_variant_palette_key_color",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.neutralVariantPalette.keyColor.tone
		});
	}
	errorPaletteKeyColor() {
		return R.fromPalette({
			name: "error_palette_key_color",
			palette: (e) => e.errorPalette,
			tone: (e) => e.errorPalette.keyColor.tone
		});
	}
	background() {
		return R.fromPalette({
			name: "background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	onBackground() {
		return R.fromPalette({
			name: "on_background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.background(),
			contrastCurve: (e) => new B(3, 3, 4.5, 7)
		});
	}
	surface() {
		return R.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	surfaceDim() {
		return R.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : new B(87, 87, 80, 75).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceBright() {
		return R.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(24, 24, 29, 34).get(e.contrastLevel) : 98,
			isBackground: !0
		});
	}
	surfaceContainerLowest() {
		return R.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(4, 4, 2, 0).get(e.contrastLevel) : 100,
			isBackground: !0
		});
	}
	surfaceContainerLow() {
		return R.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(10, 10, 11, 12).get(e.contrastLevel) : new B(96, 96, 96, 95).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainer() {
		return R.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(12, 12, 16, 20).get(e.contrastLevel) : new B(94, 94, 92, 90).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHigh() {
		return R.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(17, 17, 21, 25).get(e.contrastLevel) : new B(92, 92, 88, 85).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHighest() {
		return R.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new B(22, 22, 26, 30).get(e.contrastLevel) : new B(90, 90, 84, 80).get(e.contrastLevel),
			isBackground: !0
		});
	}
	onSurface() {
		return R.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	surfaceVariant() {
		return R.fromPalette({
			name: "surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0
		});
	}
	onSurfaceVariant() {
		return R.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 80 : 30,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	inverseSurface() {
		return R.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 20,
			isBackground: !0
		});
	}
	inverseOnSurface() {
		return R.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 20 : 95,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	outline() {
		return R.fromPalette({
			name: "outline",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 60 : 50,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1.5, 3, 4.5, 7)
		});
	}
	outlineVariant() {
		return R.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 80,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5)
		});
	}
	shadow() {
		return R.fromPalette({
			name: "shadow",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	scrim() {
		return R.fromPalette({
			name: "scrim",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	surfaceTint() {
		return R.fromPalette({
			name: "surface_tint",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0
		});
	}
	primary() {
		return R.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e) ? e.isDark ? 100 : 0 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	primaryDim() {}
	onPrimary() {
		return R.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.primary(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	primaryContainer() {
		return R.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => xe(e) ? e.sourceColorHct.tone : U(e) ? e.isDark ? 85 : 25 : e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	onPrimaryContainer() {
		return R.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => xe(e) ? R.foregroundTone(this.primaryContainer().tone(e), 4.5) : U(e) ? e.isDark ? 0 : 100 : e.isDark ? 90 : 30,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	inversePrimary() {
		return R.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 40 : 80,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new B(3, 4.5, 7, 7)
		});
	}
	secondary() {
		return R.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	secondaryDim() {}
	onSecondary() {
		return R.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => U(e) ? e.isDark ? 10 : 100 : e.isDark ? 20 : 100,
			background: (e) => this.secondary(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	secondaryContainer() {
		return R.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = e.isDark ? 30 : 90;
				return U(e) ? e.isDark ? 30 : 85 : xe(e) ? Se(e.secondaryPalette.hue, e.secondaryPalette.chroma, t, !e.isDark) : t;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	onSecondaryContainer() {
		return R.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => U(e) ? e.isDark ? 90 : 10 : xe(e) ? R.foregroundTone(this.secondaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	tertiary() {
		return R.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? e.isDark ? 90 : 25 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	tertiaryDim() {}
	onTertiary() {
		return R.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.tertiary(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	tertiaryContainer() {
		return R.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				if (U(e)) return e.isDark ? 60 : 49;
				if (!xe(e)) return e.isDark ? 30 : 90;
				let t = e.tertiaryPalette.getHct(e.sourceColorHct.tone);
				return fe.fixIfDisliked(t).tone;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	onTertiaryContainer() {
		return R.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? e.isDark ? 0 : 100 : xe(e) ? R.foregroundTone(this.tertiaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	error() {
		return R.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new V(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	errorDim() {}
	onError() {
		return R.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 20 : 100,
			background: (e) => this.error(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	errorContainer() {
		return R.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	onErrorContainer() {
		return R.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => U(e) ? e.isDark ? 90 : 10 : e.isDark ? 90 : 30,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	primaryFixed() {
		return R.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	primaryFixedDim() {
		return R.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	onPrimaryFixed() {
		return R.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e) ? 100 : 10,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	onPrimaryFixedVariant() {
		return R.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			tone: (e) => U(e) ? 90 : 30,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	secondaryFixed() {
		return R.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => U(e) ? 80 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	secondaryFixedDim() {
		return R.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => U(e) ? 70 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	onSecondaryFixed() {
		return R.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => 10,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	onSecondaryFixedVariant() {
		return R.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			tone: (e) => U(e) ? 25 : 30,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	tertiaryFixed() {
		return R.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	tertiaryFixedDim() {
		return R.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new B(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new V(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	onTertiaryFixed() {
		return R.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? 100 : 10,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new B(4.5, 7, 11, 21)
		});
	}
	onTertiaryFixedVariant() {
		return R.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => U(e) ? 90 : 30,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new B(3, 4.5, 7, 11)
		});
	}
	highestSurface(e) {
		return e.isDark ? this.surfaceBright() : this.surfaceDim();
	}
};
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/dynamiccolor/color_spec_2025.js
function W(e, t = 0, n = 100, r = 1) {
	return _(t, n, we(e.hue, e.chroma * r, 100, !0));
}
function G(e, t = 0, n = 100) {
	return _(t, n, we(e.hue, e.chroma, 0, !1));
}
function we(e, t, n, r) {
	let i = n, a = F.from(e, t, i);
	for (; a.chroma < t && !(n < 0 || n > 100);) {
		n += r ? -1 : 1;
		let o = F.from(e, t, n);
		a.chroma < o.chroma && (a = o, i = n);
	}
	return i;
}
function K(e) {
	return e === 1.5 ? new B(1.5, 1.5, 3, 5.5) : e === 3 ? new B(3, 3, 4.5, 7) : e === 4.5 ? new B(4.5, 4.5, 7, 11) : e === 6 ? new B(6, 6, 7, 11) : e === 7 ? new B(7, 7, 11, 21) : e === 9 ? new B(9, 9, 11, 21) : e === 11 ? new B(11, 11, 21, 21) : e === 21 ? new B(21, 21, 21, 21) : new B(e, e, 7, 21);
}
var Te = class extends Ce {
	surface() {
		let e = R.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => (super.surface().tone(e), e.platform === "phone" ? e.isDark ? 4 : F.isYellow(e.neutralPalette.hue) ? 99 : e.variant === H.VIBRANT ? 97 : 98 : 0),
			isBackground: !0
		});
		return L(super.surface(), "2025", e);
	}
	surfaceDim() {
		let e = R.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 4 : F.isYellow(e.neutralPalette.hue) ? 90 : e.variant === H.VIBRANT ? 85 : 87,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (!e.isDark) {
					if (e.variant === H.NEUTRAL) return 2.5;
					if (e.variant === H.TONAL_SPOT) return 1.7;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === H.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return L(super.surfaceDim(), "2025", e);
	}
	surfaceBright() {
		let e = R.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 18 : F.isYellow(e.neutralPalette.hue) ? 99 : e.variant === H.VIBRANT ? 97 : 98,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.isDark) {
					if (e.variant === H.NEUTRAL) return 2.5;
					if (e.variant === H.TONAL_SPOT) return 1.7;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === H.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return L(super.surfaceBright(), "2025", e);
	}
	surfaceContainerLowest() {
		let e = R.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 0 : 100,
			isBackground: !0
		});
		return L(super.surfaceContainerLowest(), "2025", e);
	}
	surfaceContainerLow() {
		let e = R.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 6 : F.isYellow(e.neutralPalette.hue) ? 98 : e.variant === H.VIBRANT ? 95 : 96 : 15,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 1.3;
					if (e.variant === H.TONAL_SPOT) return 1.25;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? 1.3 : 1.15;
					if (e.variant === H.VIBRANT) return 1.08;
				}
				return 1;
			}
		});
		return L(super.surfaceContainerLow(), "2025", e);
	}
	surfaceContainer() {
		let e = R.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 9 : F.isYellow(e.neutralPalette.hue) ? 96 : e.variant === H.VIBRANT ? 92 : 94 : 20,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 1.6;
					if (e.variant === H.TONAL_SPOT) return 1.4;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? 1.6 : 1.3;
					if (e.variant === H.VIBRANT) return 1.15;
				}
				return 1;
			}
		});
		return L(super.surfaceContainer(), "2025", e);
	}
	surfaceContainerHigh() {
		let e = R.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 12 : F.isYellow(e.neutralPalette.hue) ? 94 : e.variant === H.VIBRANT ? 90 : 92 : 25,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 1.9;
					if (e.variant === H.TONAL_SPOT) return 1.5;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? 1.95 : 1.45;
					if (e.variant === H.VIBRANT) return 1.22;
				}
				return 1;
			}
		});
		return L(super.surfaceContainerHigh(), "2025", e);
	}
	surfaceContainerHighest() {
		let e = R.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 15 : F.isYellow(e.neutralPalette.hue) ? 92 : e.variant === H.VIBRANT ? 88 : 90,
			isBackground: !0,
			chromaMultiplier: (e) => e.variant === H.NEUTRAL ? 2.2 : e.variant === H.TONAL_SPOT ? 1.7 : e.variant === H.EXPRESSIVE ? F.isYellow(e.neutralPalette.hue) ? 2.3 : 1.6 : e.variant === H.VIBRANT ? 1.29 : 1
		});
		return L(super.surfaceContainerHighest(), "2025", e);
	}
	onSurface() {
		let e = R.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.VIBRANT ? W(e.neutralPalette, 0, 100, 1.1) : R.getInitialToneFromBackground((e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh())(e),
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 2.2;
					if (e.variant === H.TONAL_SPOT) return 1.7;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.isDark && e.platform === "phone" ? K(11) : K(9)
		});
		return L(super.onSurface(), "2025", e);
	}
	onSurfaceVariant() {
		let e = R.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 2.2;
					if (e.variant === H.TONAL_SPOT) return 1.7;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? e.isDark ? K(6) : K(4.5) : K(7)
		});
		return L(super.onSurfaceVariant(), "2025", e);
	}
	outline() {
		let e = R.fromPalette({
			name: "outline",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 2.2;
					if (e.variant === H.TONAL_SPOT) return 1.7;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? K(3) : K(4.5)
		});
		return L(super.outline(), "2025", e);
	}
	outlineVariant() {
		let e = R.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === H.NEUTRAL) return 2.2;
					if (e.variant === H.TONAL_SPOT) return 1.7;
					if (e.variant === H.EXPRESSIVE) return F.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? K(1.5) : K(3)
		});
		return L(super.outlineVariant(), "2025", e);
	}
	inverseSurface() {
		let e = R.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 98 : 4,
			isBackground: !0
		});
		return L(super.inverseSurface(), "2025", e);
	}
	inverseOnSurface() {
		let e = R.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => K(7)
		});
		return L(super.inverseOnSurface(), "2025", e);
	}
	primary() {
		let e = R.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === H.NEUTRAL ? e.platform === "phone" ? e.isDark ? 80 : 40 : 90 : e.variant === H.TONAL_SPOT ? e.platform === "phone" ? e.isDark ? 80 : W(e.primaryPalette) : W(e.primaryPalette, 0, 90) : e.variant === H.EXPRESSIVE ? e.platform === "phone" ? W(e.primaryPalette, 0, F.isYellow(e.primaryPalette.hue) ? 25 : F.isCyan(e.primaryPalette.hue) ? 88 : 98) : W(e.primaryPalette) : e.platform === "phone" ? W(e.primaryPalette, 0, F.isCyan(e.primaryPalette.hue) ? 88 : 98) : W(e.primaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? K(4.5) : K(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.primaryContainer(), this.primary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.primary(), "2025", e);
	}
	primaryDim() {
		return R.fromPalette({
			name: "primary_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === H.NEUTRAL ? 85 : e.variant === H.TONAL_SPOT ? W(e.primaryPalette, 0, 90) : W(e.primaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => K(4.5),
			toneDeltaPair: (e) => new V(this.primaryDim(), this.primary(), 5, "darker", !0, "farther")
		});
	}
	onPrimary() {
		let e = R.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			background: (e) => e.platform === "phone" ? this.primary() : this.primaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onPrimary(), "2025", e);
	}
	primaryContainer() {
		let e = R.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === H.NEUTRAL ? e.isDark ? 30 : 90 : e.variant === H.TONAL_SPOT ? e.isDark ? G(e.primaryPalette, 35, 93) : W(e.primaryPalette, 0, 90) : e.variant === H.EXPRESSIVE ? e.isDark ? W(e.primaryPalette, 30, 93) : W(e.primaryPalette, 78, F.isCyan(e.primaryPalette.hue) ? 88 : 90) : e.isDark ? G(e.primaryPalette, 66, 93) : W(e.primaryPalette, 66, F.isCyan(e.primaryPalette.hue) ? 88 : 93),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "phone" ? void 0 : new V(this.primaryContainer(), this.primaryDim(), 10, "darker", !0, "farther"),
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.primaryContainer(), "2025", e);
	}
	onPrimaryContainer() {
		let e = R.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onPrimaryContainer(), "2025", e);
	}
	primaryFixed() {
		let e = R.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.primaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.primaryFixed(), "2025", e);
	}
	primaryFixedDim() {
		let e = R.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => this.primaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new V(this.primaryFixedDim(), this.primaryFixed(), 5, "darker", !0, "exact")
		});
		return L(super.primaryFixedDim(), "2025", e);
	}
	onPrimaryFixed() {
		let e = R.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => K(7)
		});
		return L(super.onPrimaryFixed(), "2025", e);
	}
	onPrimaryFixedVariant() {
		let e = R.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => K(4.5)
		});
		return L(super.onPrimaryFixedVariant(), "2025", e);
	}
	inversePrimary() {
		let e = R.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => W(e.primaryPalette),
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.inversePrimary(), "2025", e);
	}
	secondary() {
		let e = R.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === H.NEUTRAL ? 90 : W(e.secondaryPalette, 0, 90) : e.variant === H.NEUTRAL ? e.isDark ? G(e.secondaryPalette, 0, 98) : W(e.secondaryPalette) : e.variant === H.VIBRANT ? W(e.secondaryPalette, 0, e.isDark ? 90 : 98) : e.isDark ? 80 : W(e.secondaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? K(4.5) : K(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.secondaryContainer(), this.secondary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.secondary(), "2025", e);
	}
	secondaryDim() {
		return R.fromPalette({
			name: "secondary_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.variant === H.NEUTRAL ? 85 : W(e.secondaryPalette, 0, 90),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => K(4.5),
			toneDeltaPair: (e) => new V(this.secondaryDim(), this.secondary(), 5, "darker", !0, "farther")
		});
	}
	onSecondary() {
		let e = R.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			background: (e) => e.platform === "phone" ? this.secondary() : this.secondaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onSecondary(), "2025", e);
	}
	secondaryContainer() {
		let e = R.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === H.VIBRANT ? e.isDark ? G(e.secondaryPalette, 30, 40) : W(e.secondaryPalette, 84, 90) : e.variant === H.EXPRESSIVE ? e.isDark ? 15 : W(e.secondaryPalette, 90, 95) : e.isDark ? 25 : 90,
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new V(this.secondaryContainer(), this.secondaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.secondaryContainer(), "2025", e);
	}
	onSecondaryContainer() {
		let e = R.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onSecondaryContainer(), "2025", e);
	}
	secondaryFixed() {
		let e = R.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.secondaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.secondaryFixed(), "2025", e);
	}
	secondaryFixedDim() {
		let e = R.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => this.secondaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new V(this.secondaryFixedDim(), this.secondaryFixed(), 5, "darker", !0, "exact")
		});
		return L(super.secondaryFixedDim(), "2025", e);
	}
	onSecondaryFixed() {
		let e = R.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => K(7)
		});
		return L(super.onSecondaryFixed(), "2025", e);
	}
	onSecondaryFixedVariant() {
		let e = R.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => K(4.5)
		});
		return L(super.onSecondaryFixedVariant(), "2025", e);
	}
	tertiary() {
		let e = R.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === H.TONAL_SPOT ? W(e.tertiaryPalette, 0, 90) : W(e.tertiaryPalette) : e.variant === H.EXPRESSIVE || e.variant === H.VIBRANT ? W(e.tertiaryPalette, 0, F.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 98 : 100) : e.isDark ? W(e.tertiaryPalette, 0, 98) : W(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? K(4.5) : K(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.tertiaryContainer(), this.tertiary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.tertiary(), "2025", e);
	}
	tertiaryDim() {
		return R.fromPalette({
			name: "tertiary_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.variant === H.TONAL_SPOT ? W(e.tertiaryPalette, 0, 90) : W(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => K(4.5),
			toneDeltaPair: (e) => new V(this.tertiaryDim(), this.tertiary(), 5, "darker", !0, "farther")
		});
	}
	onTertiary() {
		let e = R.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			background: (e) => e.platform === "phone" ? this.tertiary() : this.tertiaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onTertiary(), "2025", e);
	}
	tertiaryContainer() {
		let e = R.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === H.TONAL_SPOT ? W(e.tertiaryPalette, 0, 90) : W(e.tertiaryPalette) : e.variant === H.NEUTRAL ? e.isDark ? W(e.tertiaryPalette, 0, 93) : W(e.tertiaryPalette, 0, 96) : e.variant === H.TONAL_SPOT ? W(e.tertiaryPalette, 0, e.isDark ? 93 : 100) : e.variant === H.EXPRESSIVE ? W(e.tertiaryPalette, 75, F.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 93 : 100) : e.isDark ? W(e.tertiaryPalette, 0, 93) : W(e.tertiaryPalette, 72, 100),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new V(this.tertiaryContainer(), this.tertiaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.tertiaryContainer(), "2025", e);
	}
	onTertiaryContainer() {
		let e = R.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onTertiaryContainer(), "2025", e);
	}
	tertiaryFixed() {
		let e = R.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.tertiaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.tertiaryFixed(), "2025", e);
	}
	tertiaryFixedDim() {
		let e = R.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => this.tertiaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new V(this.tertiaryFixedDim(), this.tertiaryFixed(), 5, "darker", !0, "exact")
		});
		return L(super.tertiaryFixedDim(), "2025", e);
	}
	onTertiaryFixed() {
		let e = R.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => K(7)
		});
		return L(super.onTertiaryFixed(), "2025", e);
	}
	onTertiaryFixedVariant() {
		let e = R.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => K(4.5)
		});
		return L(super.onTertiaryFixedVariant(), "2025", e);
	}
	error() {
		let e = R.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? G(e.errorPalette, 0, 98) : W(e.errorPalette) : G(e.errorPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? K(4.5) : K(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.errorContainer(), this.error(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.error(), "2025", e);
	}
	errorDim() {
		return R.fromPalette({
			name: "error_dim",
			palette: (e) => e.errorPalette,
			tone: (e) => G(e.errorPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => K(4.5),
			toneDeltaPair: (e) => new V(this.errorDim(), this.error(), 5, "darker", !0, "farther")
		});
	}
	onError() {
		let e = R.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			background: (e) => e.platform === "phone" ? this.error() : this.errorDim(),
			contrastCurve: (e) => e.platform === "phone" ? K(6) : K(7)
		});
		return L(super.onError(), "2025", e);
	}
	errorContainer() {
		let e = R.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.isDark ? G(e.errorPalette, 30, 93) : W(e.errorPalette, 0, 90),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new V(this.errorContainer(), this.errorDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? K(1.5) : void 0
		});
		return L(super.errorContainer(), "2025", e);
	}
	onErrorContainer() {
		let e = R.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => e.platform === "phone" ? K(4.5) : K(7)
		});
		return L(super.onErrorContainer(), "2025", e);
	}
	surfaceVariant() {
		let e = Object.assign(this.surfaceContainerHighest().clone(), { name: "surface_variant" });
		return L(super.surfaceVariant(), "2025", e);
	}
	surfaceTint() {
		let e = Object.assign(this.primary().clone(), { name: "surface_tint" });
		return L(super.surfaceTint(), "2025", e);
	}
	background() {
		let e = Object.assign(this.surface().clone(), { name: "background" });
		return L(super.background(), "2025", e);
	}
	onBackground() {
		let e = Object.assign(this.onSurface().clone(), {
			name: "on_background",
			tone: (e) => e.platform === "watch" ? 100 : this.onSurface().getTone(e)
		});
		return L(super.onBackground(), "2025", e);
	}
};
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/dynamiccolor/color_spec_2026.js
function Ee(e, t = 0, n = 100, r = 1) {
	return _(t, n, Oe(e.hue, e.chroma * r, 100, !0));
}
function De(e, t = 0, n = 100) {
	return _(t, n, Oe(e.hue, e.chroma, 0, !1));
}
function Oe(e, t, n, r) {
	let i = n, a = F.from(e, t, i);
	for (; a.chroma < t && !(n < 0 || n > 100);) {
		n += r ? -1 : 1;
		let o = F.from(e, t, n);
		a.chroma < o.chroma && (a = o, i = n);
	}
	return i;
}
function q(e) {
	return e === 1.5 ? new B(1.5, 1.5, 3, 5.5) : e === 3 ? new B(3, 3, 4.5, 7) : e === 4.5 ? new B(4.5, 4.5, 7, 11) : e === 6 ? new B(6, 6, 7, 11) : e === 7 ? new B(7, 7, 11, 21) : e === 9 ? new B(9, 9, 11, 21) : e === 11 ? new B(11, 11, 21, 21) : e === 21 ? new B(21, 21, 21, 21) : new B(e, e, 7, 21);
}
var ke = class extends Te {
	surface() {
		let e = R.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 4 : 98 : 0,
			isBackground: !0
		});
		return L(super.surface(), "2026", e);
	}
	surfaceDim() {
		let e = R.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 4 : 87 : 0,
			chromaMultiplier: (e) => e.variant === H.CMF ? e.isDark ? 1 : 1.7 : 0,
			isBackground: !0
		});
		return L(super.surfaceDim(), "2026", e);
	}
	surfaceBright() {
		let e = R.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 18 : 98 : 0,
			chromaMultiplier: (e) => e.variant === H.CMF ? e.isDark ? 1.7 : 1 : 0,
			isBackground: !0
		});
		return L(super.surfaceBright(), "2026", e);
	}
	surfaceContainerLowest() {
		let e = R.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 0 : 100 : 0,
			isBackground: !0
		});
		return L(super.surfaceContainerLowest(), "2026", e);
	}
	surfaceContainerLow() {
		let e = R.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 6 : 96 : 0,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.25 : 0,
			isBackground: !0
		});
		return L(super.surfaceContainerLow(), "2026", e);
	}
	surfaceContainer() {
		let e = R.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 9 : 94 : 0,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.4 : 0,
			isBackground: !0
		});
		return L(super.surfaceContainer(), "2026", e);
	}
	surfaceContainerHigh() {
		let e = R.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 12 : 92 : 0,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.5 : 0,
			isBackground: !0
		});
		return L(super.surfaceContainerHigh(), "2026", e);
	}
	surfaceContainerHighest() {
		let e = R.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === H.CMF ? e.isDark ? 15 : 90 : 0,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.7 : 0,
			isBackground: !0
		});
		return L(super.surfaceContainerHighest(), "2026", e);
	}
	onSurface() {
		let e = R.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.7 : 0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.isDark ? q(11) : q(9)
		});
		return L(super.onSurface(), "2026", e);
	}
	onSurfaceVariant() {
		let e = R.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.7 : 0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.isDark ? q(6) : q(4.5)
		});
		return L(super.onSurfaceVariant(), "2026", e);
	}
	outline() {
		let e = R.fromPalette({
			name: "outline",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.7 : 0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => q(3)
		});
		return L(super.outline(), "2026", e);
	}
	outlineVariant() {
		let e = R.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.7 : 0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => q(1.5)
		});
		return L(super.outlineVariant(), "2026", e);
	}
	inverseSurface() {
		let e = R.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 98 : 4,
			chromaMultiplier: (e) => e.variant === H.CMF ? 1.7 : 0,
			isBackground: !0
		});
		return L(super.inverseSurface(), "2026", e);
	}
	inverseOnSurface() {
		let e = R.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => q(7)
		});
		return L(super.inverseOnSurface(), "2026", e);
	}
	primary() {
		let e = R.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.sourceColorHct.chroma <= 12 ? e.isDark ? 80 : 40 : e.sourceColorHct.tone,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.primaryContainer(), this.primary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.primary(), "2026", e);
	}
	onPrimary() {
		let e = R.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primary(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onPrimary(), "2026", e);
	}
	primaryContainer() {
		let e = R.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => !e.isDark && e.sourceColorHct.chroma <= 12 ? 90 : e.sourceColorHct.tone > 55 ? _(61, 90, e.sourceColorHct.tone) : _(30, 49, e.sourceColorHct.tone),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.primaryContainer(), "2026", e);
	}
	onPrimaryContainer() {
		let e = R.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onPrimaryContainer(), "2026", e);
	}
	primaryFixed() {
		let e = R.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.primaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.primaryFixed(), "2026", e);
	}
	primaryFixedDim() {
		let e = R.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => this.primaryFixed().getTone(e),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			toneDeltaPair: (e) => new V(this.primaryFixedDim(), this.primaryFixed(), 5, "darker", !0, "exact"),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.primaryFixedDim(), "2026", e);
	}
	onPrimaryFixed() {
		let e = R.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixed().getTone(e) > 57 ? this.primaryFixedDim() : this.primaryFixed(),
			contrastCurve: (e) => q(7)
		});
		return L(super.onPrimaryFixed(), "2026", e);
	}
	onPrimaryFixedVariant() {
		let e = R.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixed().getTone(e) > 57 ? this.primaryFixedDim() : this.primaryFixed(),
			contrastCurve: (e) => q(4.5)
		});
		return L(super.onPrimaryFixedVariant(), "2026", e);
	}
	inversePrimary() {
		return super.inversePrimary();
	}
	secondary() {
		let e = R.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? De(e.secondaryPalette) : Ee(e.secondaryPalette),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.secondaryContainer(), this.secondary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.secondary(), "2026", e);
	}
	onSecondary() {
		let e = R.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondary(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onSecondary(), "2026", e);
	}
	secondaryContainer() {
		let e = R.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? De(e.secondaryPalette, 20, 49) : Ee(e.secondaryPalette, 61, 90),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.secondaryContainer(), "2026", e);
	}
	onSecondaryContainer() {
		let e = R.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onSecondaryContainer(), "2026", e);
	}
	secondaryFixed() {
		let e = R.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.secondaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.secondaryFixed(), "2026", e);
	}
	secondaryFixedDim() {
		let e = R.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => this.secondaryFixed().getTone(e),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			toneDeltaPair: (e) => new V(this.secondaryFixedDim(), this.secondaryFixed(), 5, "darker", !0, "exact"),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.secondaryFixedDim(), "2026", e);
	}
	onSecondaryFixed() {
		let e = R.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixed().getTone(e) > 57 ? this.secondaryFixedDim() : this.secondaryFixed(),
			contrastCurve: (e) => q(7)
		});
		return L(super.onSecondaryFixed(), "2026", e);
	}
	onSecondaryFixedVariant() {
		let e = R.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixed().getTone(e) > 57 ? this.secondaryFixedDim() : this.secondaryFixed(),
			contrastCurve: (e) => q(4.5)
		});
		return L(super.onSecondaryFixedVariant(), "2026", e);
	}
	tertiary() {
		let e = R.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.sourceColorHcts[1]?.tone ?? e.sourceColorHct.tone,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.tertiaryContainer(), this.tertiary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.tertiary(), "2026", e);
	}
	onTertiary() {
		let e = R.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiary(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onTertiary(), "2026", e);
	}
	tertiaryContainer() {
		let e = R.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				let t = e.sourceColorHcts[1] ?? e.sourceColorHct;
				return t.tone > 55 ? _(61, 90, t.tone) : _(20, 49, t.tone);
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.tertiaryContainer(), "2026", e);
	}
	onTertiaryContainer() {
		let e = R.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onTertiaryContainer(), "2026", e);
	}
	tertiaryFixed() {
		let e = R.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.tertiaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.tertiaryFixed(), "2026", e);
	}
	tertiaryFixedDim() {
		let e = R.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => this.tertiaryFixed().getTone(e),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			toneDeltaPair: (e) => new V(this.tertiaryFixedDim(), this.tertiaryFixed(), 5, "darker", !0, "exact"),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.tertiaryFixedDim(), "2026", e);
	}
	onTertiaryFixed() {
		let e = R.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixed().getTone(e) > 57 ? this.tertiaryFixedDim() : this.tertiaryFixed(),
			contrastCurve: (e) => q(7)
		});
		return L(super.onTertiaryFixed(), "2026", e);
	}
	onTertiaryFixedVariant() {
		let e = R.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixed().getTone(e) > 57 ? this.tertiaryFixedDim() : this.tertiaryFixed(),
			contrastCurve: (e) => q(4.5)
		});
		return L(super.onTertiaryFixedVariant(), "2026", e);
	}
	error() {
		let e = R.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => Ee(e.errorPalette),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => e.platform === "phone" ? new V(this.errorContainer(), this.error(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return L(super.error(), "2026", e);
	}
	onError() {
		let e = R.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			background: (e) => this.error(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onError(), "2026", e);
	}
	errorContainer() {
		let e = R.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? De(e.errorPalette) : Ee(e.errorPalette),
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return L(super.errorContainer(), "2026", e);
	}
	onErrorContainer() {
		let e = R.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => q(6)
		});
		return L(super.onErrorContainer(), "2026", e);
	}
	primaryDim() {
		let e = Object.assign(this.primary().clone(), { name: "primary_dim" });
		return L(super.primaryDim(), "2026", e);
	}
	secondaryDim() {
		let e = Object.assign(this.secondary().clone(), { name: "secondary_dim" });
		return L(super.secondaryDim(), "2026", e);
	}
	tertiaryDim() {
		let e = Object.assign(this.tertiary().clone(), { name: "tertiary_dim" });
		return L(super.tertiaryDim(), "2026", e);
	}
	errorDim() {
		let e = Object.assign(this.error().clone(), { name: "error_dim" });
		return L(super.errorDim(), "2026", e);
	}
}, J = class e {
	constructor() {
		this.allColors = [
			this.background(),
			this.onBackground(),
			this.surface(),
			this.surfaceDim(),
			this.surfaceBright(),
			this.surfaceContainerLowest(),
			this.surfaceContainerLow(),
			this.surfaceContainer(),
			this.surfaceContainerHigh(),
			this.surfaceContainerHighest(),
			this.onSurface(),
			this.onSurfaceVariant(),
			this.outline(),
			this.outlineVariant(),
			this.inverseSurface(),
			this.inverseOnSurface(),
			this.primary(),
			this.primaryDim(),
			this.onPrimary(),
			this.primaryContainer(),
			this.onPrimaryContainer(),
			this.primaryFixed(),
			this.primaryFixedDim(),
			this.onPrimaryFixed(),
			this.onPrimaryFixedVariant(),
			this.inversePrimary(),
			this.secondary(),
			this.secondaryDim(),
			this.onSecondary(),
			this.secondaryContainer(),
			this.onSecondaryContainer(),
			this.secondaryFixed(),
			this.secondaryFixedDim(),
			this.onSecondaryFixed(),
			this.onSecondaryFixedVariant(),
			this.tertiary(),
			this.tertiaryDim(),
			this.onTertiary(),
			this.tertiaryContainer(),
			this.onTertiaryContainer(),
			this.tertiaryFixed(),
			this.tertiaryFixedDim(),
			this.onTertiaryFixed(),
			this.onTertiaryFixedVariant(),
			this.error(),
			this.errorDim(),
			this.onError(),
			this.errorContainer(),
			this.onErrorContainer()
		].filter((e) => e !== void 0);
	}
	highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
	primaryPaletteKeyColor() {
		return e.colorSpec.primaryPaletteKeyColor();
	}
	secondaryPaletteKeyColor() {
		return e.colorSpec.secondaryPaletteKeyColor();
	}
	tertiaryPaletteKeyColor() {
		return e.colorSpec.tertiaryPaletteKeyColor();
	}
	neutralPaletteKeyColor() {
		return e.colorSpec.neutralPaletteKeyColor();
	}
	neutralVariantPaletteKeyColor() {
		return e.colorSpec.neutralVariantPaletteKeyColor();
	}
	errorPaletteKeyColor() {
		return e.colorSpec.errorPaletteKeyColor();
	}
	background() {
		return e.colorSpec.background();
	}
	onBackground() {
		return e.colorSpec.onBackground();
	}
	surface() {
		return e.colorSpec.surface();
	}
	surfaceDim() {
		return e.colorSpec.surfaceDim();
	}
	surfaceBright() {
		return e.colorSpec.surfaceBright();
	}
	surfaceContainerLowest() {
		return e.colorSpec.surfaceContainerLowest();
	}
	surfaceContainerLow() {
		return e.colorSpec.surfaceContainerLow();
	}
	surfaceContainer() {
		return e.colorSpec.surfaceContainer();
	}
	surfaceContainerHigh() {
		return e.colorSpec.surfaceContainerHigh();
	}
	surfaceContainerHighest() {
		return e.colorSpec.surfaceContainerHighest();
	}
	onSurface() {
		return e.colorSpec.onSurface();
	}
	surfaceVariant() {
		return e.colorSpec.surfaceVariant();
	}
	onSurfaceVariant() {
		return e.colorSpec.onSurfaceVariant();
	}
	outline() {
		return e.colorSpec.outline();
	}
	outlineVariant() {
		return e.colorSpec.outlineVariant();
	}
	inverseSurface() {
		return e.colorSpec.inverseSurface();
	}
	inverseOnSurface() {
		return e.colorSpec.inverseOnSurface();
	}
	shadow() {
		return e.colorSpec.shadow();
	}
	scrim() {
		return e.colorSpec.scrim();
	}
	surfaceTint() {
		return e.colorSpec.surfaceTint();
	}
	primary() {
		return e.colorSpec.primary();
	}
	primaryDim() {
		return e.colorSpec.primaryDim();
	}
	onPrimary() {
		return e.colorSpec.onPrimary();
	}
	primaryContainer() {
		return e.colorSpec.primaryContainer();
	}
	onPrimaryContainer() {
		return e.colorSpec.onPrimaryContainer();
	}
	inversePrimary() {
		return e.colorSpec.inversePrimary();
	}
	primaryFixed() {
		return e.colorSpec.primaryFixed();
	}
	primaryFixedDim() {
		return e.colorSpec.primaryFixedDim();
	}
	onPrimaryFixed() {
		return e.colorSpec.onPrimaryFixed();
	}
	onPrimaryFixedVariant() {
		return e.colorSpec.onPrimaryFixedVariant();
	}
	secondary() {
		return e.colorSpec.secondary();
	}
	secondaryDim() {
		return e.colorSpec.secondaryDim();
	}
	onSecondary() {
		return e.colorSpec.onSecondary();
	}
	secondaryContainer() {
		return e.colorSpec.secondaryContainer();
	}
	onSecondaryContainer() {
		return e.colorSpec.onSecondaryContainer();
	}
	secondaryFixed() {
		return e.colorSpec.secondaryFixed();
	}
	secondaryFixedDim() {
		return e.colorSpec.secondaryFixedDim();
	}
	onSecondaryFixed() {
		return e.colorSpec.onSecondaryFixed();
	}
	onSecondaryFixedVariant() {
		return e.colorSpec.onSecondaryFixedVariant();
	}
	tertiary() {
		return e.colorSpec.tertiary();
	}
	tertiaryDim() {
		return e.colorSpec.tertiaryDim();
	}
	onTertiary() {
		return e.colorSpec.onTertiary();
	}
	tertiaryContainer() {
		return e.colorSpec.tertiaryContainer();
	}
	onTertiaryContainer() {
		return e.colorSpec.onTertiaryContainer();
	}
	tertiaryFixed() {
		return e.colorSpec.tertiaryFixed();
	}
	tertiaryFixedDim() {
		return e.colorSpec.tertiaryFixedDim();
	}
	onTertiaryFixed() {
		return e.colorSpec.onTertiaryFixed();
	}
	onTertiaryFixedVariant() {
		return e.colorSpec.onTertiaryFixedVariant();
	}
	error() {
		return e.colorSpec.error();
	}
	errorDim() {
		return e.colorSpec.errorDim();
	}
	onError() {
		return e.colorSpec.onError();
	}
	errorContainer() {
		return e.colorSpec.errorContainer();
	}
	onErrorContainer() {
		return e.colorSpec.onErrorContainer();
	}
	static highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
};
J.contentAccentToneDelta = 15, J.colorSpec = new ke(), J.primaryPaletteKeyColor = J.colorSpec.primaryPaletteKeyColor(), J.secondaryPaletteKeyColor = J.colorSpec.secondaryPaletteKeyColor(), J.tertiaryPaletteKeyColor = J.colorSpec.tertiaryPaletteKeyColor(), J.neutralPaletteKeyColor = J.colorSpec.neutralPaletteKeyColor(), J.neutralVariantPaletteKeyColor = J.colorSpec.neutralVariantPaletteKeyColor(), J.background = J.colorSpec.background(), J.onBackground = J.colorSpec.onBackground(), J.surface = J.colorSpec.surface(), J.surfaceDim = J.colorSpec.surfaceDim(), J.surfaceBright = J.colorSpec.surfaceBright(), J.surfaceContainerLowest = J.colorSpec.surfaceContainerLowest(), J.surfaceContainerLow = J.colorSpec.surfaceContainerLow(), J.surfaceContainer = J.colorSpec.surfaceContainer(), J.surfaceContainerHigh = J.colorSpec.surfaceContainerHigh(), J.surfaceContainerHighest = J.colorSpec.surfaceContainerHighest(), J.onSurface = J.colorSpec.onSurface(), J.surfaceVariant = J.colorSpec.surfaceVariant(), J.onSurfaceVariant = J.colorSpec.onSurfaceVariant(), J.inverseSurface = J.colorSpec.inverseSurface(), J.inverseOnSurface = J.colorSpec.inverseOnSurface(), J.outline = J.colorSpec.outline(), J.outlineVariant = J.colorSpec.outlineVariant(), J.shadow = J.colorSpec.shadow(), J.scrim = J.colorSpec.scrim(), J.surfaceTint = J.colorSpec.surfaceTint(), J.primary = J.colorSpec.primary(), J.onPrimary = J.colorSpec.onPrimary(), J.primaryContainer = J.colorSpec.primaryContainer(), J.onPrimaryContainer = J.colorSpec.onPrimaryContainer(), J.inversePrimary = J.colorSpec.inversePrimary(), J.secondary = J.colorSpec.secondary(), J.onSecondary = J.colorSpec.onSecondary(), J.secondaryContainer = J.colorSpec.secondaryContainer(), J.onSecondaryContainer = J.colorSpec.onSecondaryContainer(), J.tertiary = J.colorSpec.tertiary(), J.onTertiary = J.colorSpec.onTertiary(), J.tertiaryContainer = J.colorSpec.tertiaryContainer(), J.onTertiaryContainer = J.colorSpec.onTertiaryContainer(), J.error = J.colorSpec.error(), J.onError = J.colorSpec.onError(), J.errorContainer = J.colorSpec.errorContainer(), J.onErrorContainer = J.colorSpec.onErrorContainer(), J.primaryFixed = J.colorSpec.primaryFixed(), J.primaryFixedDim = J.colorSpec.primaryFixedDim(), J.onPrimaryFixed = J.colorSpec.onPrimaryFixed(), J.onPrimaryFixedVariant = J.colorSpec.onPrimaryFixedVariant(), J.secondaryFixed = J.colorSpec.secondaryFixed(), J.secondaryFixedDim = J.colorSpec.secondaryFixedDim(), J.onSecondaryFixed = J.colorSpec.onSecondaryFixed(), J.onSecondaryFixedVariant = J.colorSpec.onSecondaryFixedVariant(), J.tertiaryFixed = J.colorSpec.tertiaryFixed(), J.tertiaryFixedDim = J.colorSpec.tertiaryFixedDim(), J.onTertiaryFixed = J.colorSpec.onTertiaryFixed(), J.onTertiaryFixedVariant = J.colorSpec.onTertiaryFixedVariant();
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/dynamiccolor/dynamic_scheme.js
var Y = class e {
	static maybeFallbackSpecVersion(e, t) {
		return t === H.CMF ? e : t === H.EXPRESSIVE || t === H.VIBRANT || t === H.TONAL_SPOT || t === H.NEUTRAL ? e === "2026" ? "2025" : e : "2021";
	}
	constructor(t) {
		if (t.sourceColorHcts) {
			if (t.sourceColorHcts.length === 0) throw Error("sourceColorHcts cannot be empty");
			this.sourceColorHct = t.sourceColorHcts[0], this.sourceColorHcts = t.sourceColorHcts;
		} else if (t.sourceColorHct) this.sourceColorHct = t.sourceColorHct, this.sourceColorHcts = [t.sourceColorHct];
		else throw Error("sourceColorHct or sourceColorHcts required");
		this.sourceColorArgb = this.sourceColorHct.toInt(), this.variant = t.variant, this.contrastLevel = t.contrastLevel, this.isDark = t.isDark, this.platform = t.platform ?? "phone", this.specVersion = e.maybeFallbackSpecVersion(t.specVersion ?? "2021", this.variant), this.primaryPalette = t.primaryPalette ?? Pe(this.specVersion).getPrimaryPalette(this.variant, this.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.secondaryPalette = t.secondaryPalette ?? Pe(this.specVersion).getSecondaryPalette(this.variant, this.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.tertiaryPalette = t.tertiaryPalette ?? Pe(this.specVersion).getTertiaryPalette(this.variant, this.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralPalette = t.neutralPalette ?? Pe(this.specVersion).getNeutralPalette(this.variant, this.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralVariantPalette = t.neutralVariantPalette ?? Pe(this.specVersion).getNeutralVariantPalette(this.variant, this.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.errorPalette = t.errorPalette ?? Pe(this.specVersion).getErrorPalette(this.variant, this.sourceColorHct, this.isDark, this.platform, this.contrastLevel) ?? z.fromHueAndChroma(25, 84), this.colors = new J();
	}
	toString() {
		let e = this.sourceColorHcts.length <= 1 ? "" : `sourceColorHctList=[${this.sourceColorHcts.map((e) => e.toString()).join(", ")}], `;
		return `Scheme: variant=${H[this.variant]}, mode=${this.isDark ? "dark" : "light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, ` + e + `specVersion=${this.specVersion}`;
	}
	static getPiecewiseHue(e, t, n) {
		let r = Math.min(t.length - 1, n.length), i = e.hue;
		for (let e = 0; e < r; e++) if (i >= t[e] && i < t[e + 1]) return y(n[e]);
		return i;
	}
	static getRotatedHue(t, n, r) {
		let i = e.getPiecewiseHue(t, n, r);
		return Math.min(n.length - 1, r.length) <= 0 && (i = 0), y(t.hue + i);
	}
	getArgb(e) {
		return e.getArgb(this);
	}
	getHct(e) {
		return e.getHct(this);
	}
	get primaryPaletteKeyColor() {
		return this.getArgb(this.colors.primaryPaletteKeyColor());
	}
	get secondaryPaletteKeyColor() {
		return this.getArgb(this.colors.secondaryPaletteKeyColor());
	}
	get tertiaryPaletteKeyColor() {
		return this.getArgb(this.colors.tertiaryPaletteKeyColor());
	}
	get neutralPaletteKeyColor() {
		return this.getArgb(this.colors.neutralPaletteKeyColor());
	}
	get neutralVariantPaletteKeyColor() {
		return this.getArgb(this.colors.neutralVariantPaletteKeyColor());
	}
	get errorPaletteKeyColor() {
		return this.getArgb(this.colors.errorPaletteKeyColor());
	}
	get background() {
		return this.getArgb(this.colors.background());
	}
	get onBackground() {
		return this.getArgb(this.colors.onBackground());
	}
	get surface() {
		return this.getArgb(this.colors.surface());
	}
	get surfaceDim() {
		return this.getArgb(this.colors.surfaceDim());
	}
	get surfaceBright() {
		return this.getArgb(this.colors.surfaceBright());
	}
	get surfaceContainerLowest() {
		return this.getArgb(this.colors.surfaceContainerLowest());
	}
	get surfaceContainerLow() {
		return this.getArgb(this.colors.surfaceContainerLow());
	}
	get surfaceContainer() {
		return this.getArgb(this.colors.surfaceContainer());
	}
	get surfaceContainerHigh() {
		return this.getArgb(this.colors.surfaceContainerHigh());
	}
	get surfaceContainerHighest() {
		return this.getArgb(this.colors.surfaceContainerHighest());
	}
	get onSurface() {
		return this.getArgb(this.colors.onSurface());
	}
	get surfaceVariant() {
		return this.getArgb(this.colors.surfaceVariant());
	}
	get onSurfaceVariant() {
		return this.getArgb(this.colors.onSurfaceVariant());
	}
	get inverseSurface() {
		return this.getArgb(this.colors.inverseSurface());
	}
	get inverseOnSurface() {
		return this.getArgb(this.colors.inverseOnSurface());
	}
	get outline() {
		return this.getArgb(this.colors.outline());
	}
	get outlineVariant() {
		return this.getArgb(this.colors.outlineVariant());
	}
	get shadow() {
		return this.getArgb(this.colors.shadow());
	}
	get scrim() {
		return this.getArgb(this.colors.scrim());
	}
	get surfaceTint() {
		return this.getArgb(this.colors.surfaceTint());
	}
	get primary() {
		return this.getArgb(this.colors.primary());
	}
	get primaryDim() {
		let e = this.colors.primaryDim();
		if (e === void 0) throw Error("`primaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onPrimary() {
		return this.getArgb(this.colors.onPrimary());
	}
	get primaryContainer() {
		return this.getArgb(this.colors.primaryContainer());
	}
	get onPrimaryContainer() {
		return this.getArgb(this.colors.onPrimaryContainer());
	}
	get primaryFixed() {
		return this.getArgb(this.colors.primaryFixed());
	}
	get primaryFixedDim() {
		return this.getArgb(this.colors.primaryFixedDim());
	}
	get onPrimaryFixed() {
		return this.getArgb(this.colors.onPrimaryFixed());
	}
	get onPrimaryFixedVariant() {
		return this.getArgb(this.colors.onPrimaryFixedVariant());
	}
	get inversePrimary() {
		return this.getArgb(this.colors.inversePrimary());
	}
	get secondary() {
		return this.getArgb(this.colors.secondary());
	}
	get secondaryDim() {
		let e = this.colors.secondaryDim();
		if (e === void 0) throw Error("`secondaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onSecondary() {
		return this.getArgb(this.colors.onSecondary());
	}
	get secondaryContainer() {
		return this.getArgb(this.colors.secondaryContainer());
	}
	get onSecondaryContainer() {
		return this.getArgb(this.colors.onSecondaryContainer());
	}
	get secondaryFixed() {
		return this.getArgb(this.colors.secondaryFixed());
	}
	get secondaryFixedDim() {
		return this.getArgb(this.colors.secondaryFixedDim());
	}
	get onSecondaryFixed() {
		return this.getArgb(this.colors.onSecondaryFixed());
	}
	get onSecondaryFixedVariant() {
		return this.getArgb(this.colors.onSecondaryFixedVariant());
	}
	get tertiary() {
		return this.getArgb(this.colors.tertiary());
	}
	get tertiaryDim() {
		let e = this.colors.tertiaryDim();
		if (e === void 0) throw Error("`tertiaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onTertiary() {
		return this.getArgb(this.colors.onTertiary());
	}
	get tertiaryContainer() {
		return this.getArgb(this.colors.tertiaryContainer());
	}
	get onTertiaryContainer() {
		return this.getArgb(this.colors.onTertiaryContainer());
	}
	get tertiaryFixed() {
		return this.getArgb(this.colors.tertiaryFixed());
	}
	get tertiaryFixedDim() {
		return this.getArgb(this.colors.tertiaryFixedDim());
	}
	get onTertiaryFixed() {
		return this.getArgb(this.colors.onTertiaryFixed());
	}
	get onTertiaryFixedVariant() {
		return this.getArgb(this.colors.onTertiaryFixedVariant());
	}
	get error() {
		return this.getArgb(this.colors.error());
	}
	get errorDim() {
		let e = this.colors.errorDim();
		if (e === void 0) throw Error("`errorDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onError() {
		return this.getArgb(this.colors.onError());
	}
	get errorContainer() {
		return this.getArgb(this.colors.errorContainer());
	}
	get onErrorContainer() {
		return this.getArgb(this.colors.onErrorContainer());
	}
};
Y.DEFAULT_SPEC_VERSION = "2021", Y.DEFAULT_PLATFORM = "phone";
var Ae = class {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case H.CONTENT:
			case H.FIDELITY: return z.fromHueAndChroma(t.hue, t.chroma);
			case H.FRUIT_SALAD: return z.fromHueAndChroma(y(t.hue - 50), 48);
			case H.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, 12);
			case H.RAINBOW: return z.fromHueAndChroma(t.hue, 48);
			case H.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 36);
			case H.EXPRESSIVE: return z.fromHueAndChroma(y(t.hue + 240), 40);
			case H.VIBRANT: return z.fromHueAndChroma(t.hue, 200);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case H.CONTENT:
			case H.FIDELITY: return z.fromHueAndChroma(t.hue, Math.max(t.chroma - 32, t.chroma * .5));
			case H.FRUIT_SALAD: return z.fromHueAndChroma(y(t.hue - 50), 36);
			case H.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, 8);
			case H.RAINBOW: return z.fromHueAndChroma(t.hue, 16);
			case H.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 16);
			case H.EXPRESSIVE: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				45,
				95,
				45,
				20,
				45,
				90,
				45,
				45,
				45
			]), 24);
			case H.VIBRANT: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				18,
				15,
				10,
				12,
				15,
				18,
				15,
				12,
				12
			]), 24);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case H.CONTENT: return z.fromHct(fe.fixIfDisliked(new be(t).analogous(3, 6)[2]));
			case H.FIDELITY: return z.fromHct(fe.fixIfDisliked(new be(t).complement));
			case H.FRUIT_SALAD: return z.fromHueAndChroma(t.hue, 36);
			case H.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, 16);
			case H.RAINBOW:
			case H.TONAL_SPOT: return z.fromHueAndChroma(y(t.hue + 60), 24);
			case H.EXPRESSIVE: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				120,
				120,
				20,
				45,
				20,
				15,
				20,
				120,
				120
			]), 32);
			case H.VIBRANT: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				35,
				30,
				20,
				25,
				30,
				35,
				30,
				25,
				25
			]), 32);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralPalette(e, t, n, r, i) {
		switch (e) {
			case H.CONTENT:
			case H.FIDELITY: return z.fromHueAndChroma(t.hue, t.chroma / 8);
			case H.FRUIT_SALAD: return z.fromHueAndChroma(t.hue, 10);
			case H.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, 2);
			case H.RAINBOW: return z.fromHueAndChroma(t.hue, 0);
			case H.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 6);
			case H.EXPRESSIVE: return z.fromHueAndChroma(y(t.hue + 15), 8);
			case H.VIBRANT: return z.fromHueAndChroma(t.hue, 10);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralVariantPalette(e, t, n, r, i) {
		switch (e) {
			case H.CONTENT: return z.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case H.FIDELITY: return z.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case H.FRUIT_SALAD: return z.fromHueAndChroma(t.hue, 16);
			case H.MONOCHROME: return z.fromHueAndChroma(t.hue, 0);
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, 2);
			case H.RAINBOW: return z.fromHueAndChroma(t.hue, 0);
			case H.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 8);
			case H.EXPRESSIVE: return z.fromHueAndChroma(y(t.hue + 15), 12);
			case H.VIBRANT: return z.fromHueAndChroma(t.hue, 12);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getErrorPalette(e, t, n, r, i) {}
}, je = class e extends Ae {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, r === "phone" ? F.isBlue(t.hue) ? 12 : 8 : F.isBlue(t.hue) ? 16 : 12);
			case H.TONAL_SPOT: return z.fromHueAndChroma(t.hue, r === "phone" && n ? 26 : 32);
			case H.EXPRESSIVE: return z.fromHueAndChroma(t.hue, r === "phone" ? n ? 36 : 48 : 40);
			case H.VIBRANT: return z.fromHueAndChroma(t.hue, r === "phone" ? 74 : 56);
			default: return super.getPrimaryPalette(e, t, n, r, i);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case H.NEUTRAL: return z.fromHueAndChroma(t.hue, r === "phone" ? F.isBlue(t.hue) ? 6 : 4 : F.isBlue(t.hue) ? 10 : 6);
			case H.TONAL_SPOT: return z.fromHueAndChroma(t.hue, 16);
			case H.EXPRESSIVE: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-160,
				155,
				-100,
				96,
				-96,
				-156,
				-165,
				-160
			]), r === "phone" && n ? 16 : 24);
			case H.VIBRANT: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				38,
				105,
				140,
				333,
				360
			], [
				-14,
				10,
				-14,
				10,
				-14
			]), r === "phone" ? 56 : 36);
			default: return super.getSecondaryPalette(e, t, n, r, i);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case H.NEUTRAL: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				38,
				105,
				161,
				204,
				278,
				333,
				360
			], [
				-32,
				26,
				10,
				-39,
				24,
				-15,
				-32
			]), r === "phone" ? 20 : 36);
			case H.TONAL_SPOT: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				20,
				71,
				161,
				333,
				360
			], [
				-40,
				48,
				-32,
				40,
				-32
			]), r === "phone" ? 28 : 32);
			case H.EXPRESSIVE: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-165,
				160,
				-105,
				101,
				-101,
				-160,
				-170,
				-165
			]), 48);
			case H.VIBRANT: return z.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				38,
				71,
				105,
				140,
				161,
				253,
				333,
				360
			], [
				-72,
				35,
				24,
				-24,
				62,
				50,
				62,
				-72
			]), 56);
			default: return super.getTertiaryPalette(e, t, n, r, i);
		}
	}
	static getExpressiveNeutralHue(e) {
		return Y.getRotatedHue(e, [
			0,
			71,
			124,
			253,
			278,
			300,
			360
		], [
			10,
			0,
			10,
			0,
			10,
			0
		]);
	}
	static getExpressiveNeutralChroma(t, n, r) {
		let i = e.getExpressiveNeutralHue(t);
		return r === "phone" ? n ? F.isYellow(i) ? 6 : 14 : 18 : 12;
	}
	static getVibrantNeutralHue(e) {
		return Y.getRotatedHue(e, [
			0,
			38,
			105,
			140,
			333,
			360
		], [
			-14,
			10,
			-14,
			10,
			-14
		]);
	}
	static getVibrantNeutralChroma(t, n) {
		let r = e.getVibrantNeutralHue(t);
		return n === "phone" || F.isBlue(r) ? 28 : 20;
	}
	getNeutralPalette(t, n, r, i, a) {
		switch (t) {
			case H.NEUTRAL: return z.fromHueAndChroma(n.hue, i === "phone" ? 1.4 : 6);
			case H.TONAL_SPOT: return z.fromHueAndChroma(n.hue, i === "phone" ? 5 : 10);
			case H.EXPRESSIVE: return z.fromHueAndChroma(e.getExpressiveNeutralHue(n), e.getExpressiveNeutralChroma(n, r, i));
			case H.VIBRANT: return z.fromHueAndChroma(e.getVibrantNeutralHue(n), e.getVibrantNeutralChroma(n, i));
			default: return super.getNeutralPalette(t, n, r, i, a);
		}
	}
	getNeutralVariantPalette(t, n, r, i, a) {
		switch (t) {
			case H.NEUTRAL: return z.fromHueAndChroma(n.hue, (i === "phone" ? 1.4 : 6) * 2.2);
			case H.TONAL_SPOT: return z.fromHueAndChroma(n.hue, (i === "phone" ? 5 : 10) * 1.7);
			case H.EXPRESSIVE:
				let o = e.getExpressiveNeutralHue(n), s = e.getExpressiveNeutralChroma(n, r, i);
				return z.fromHueAndChroma(o, s * (o >= 105 && o < 125 ? 1.6 : 2.3));
			case H.VIBRANT:
				let c = e.getVibrantNeutralHue(n), l = e.getVibrantNeutralChroma(n, i);
				return z.fromHueAndChroma(c, l * 1.29);
			default: return super.getNeutralVariantPalette(t, n, r, i, a);
		}
	}
	getErrorPalette(e, t, n, r, i) {
		let a = Y.getPiecewiseHue(t, [
			0,
			3,
			13,
			23,
			33,
			43,
			153,
			273,
			360
		], [
			12,
			22,
			32,
			12,
			22,
			32,
			22,
			12
		]);
		switch (e) {
			case H.NEUTRAL: return z.fromHueAndChroma(a, r === "phone" ? 50 : 40);
			case H.TONAL_SPOT: return z.fromHueAndChroma(a, r === "phone" ? 60 : 48);
			case H.EXPRESSIVE: return z.fromHueAndChroma(a, r === "phone" ? 64 : 48);
			case H.VIBRANT: return z.fromHueAndChroma(a, r === "phone" ? 80 : 60);
			default: return super.getErrorPalette(e, t, n, r, i);
		}
	}
}, Me = new Ae(), Ne = new je();
function Pe(e) {
	return e === "2025" ? Ne : Me;
}
//#endregion
//#region node_modules/.pnpm/@ktibow+material-color-utilities-nightly@0.4.1772748028000/node_modules/@ktibow/material-color-utilities-nightly/quantize/lab_point_provider.js
var Fe = class {
	fromInt(e) {
		return ie(e);
	}
	toInt(e) {
		return re(e[0], e[1], e[2]);
	}
	distance(e, t) {
		let n = e[0] - t[0], r = e[1] - t[1], i = e[2] - t[2];
		return n * n + r * r + i * i;
	}
}, Ie = 10, Le = 3, Re = class {
	static quantize(e, t, n) {
		let r = /* @__PURE__ */ new Map(), i = [], a = [], o = new Fe(), s = 0;
		for (let t = 0; t < e.length; t++) {
			let n = e[t], c = r.get(n);
			c === void 0 ? (s++, i.push(o.fromInt(n)), a.push(n), r.set(n, 1)) : r.set(n, c + 1);
		}
		let c = [];
		for (let e = 0; e < s; e++) {
			let t = a[e], n = r.get(t);
			n !== void 0 && (c[e] = n);
		}
		let l = Math.min(n, s);
		t.length > 0 && (l = Math.min(l, t.length));
		let u = [];
		for (let e = 0; e < t.length; e++) u.push(o.fromInt(t[e]));
		let d = l - u.length;
		if (t.length === 0 && d > 0) for (let e = 0; e < d; e++) {
			let e = Math.random() * 100, t = Math.random() * 201 + -100, n = Math.random() * 201 + -100;
			u.push([
				e,
				t,
				n
			]);
		}
		let f = [];
		for (let e = 0; e < s; e++) f.push(Math.floor(Math.random() * l));
		let p = [];
		for (let e = 0; e < l; e++) {
			p.push([]);
			for (let t = 0; t < l; t++) p[e].push(0);
		}
		let m = [];
		for (let e = 0; e < l; e++) {
			m.push([]);
			for (let t = 0; t < l; t++) m[e].push(new ze());
		}
		let h = [];
		for (let e = 0; e < l; e++) h.push(0);
		for (let e = 0; e < Ie; e++) {
			for (let e = 0; e < l; e++) {
				for (let t = e + 1; t < l; t++) {
					let n = o.distance(u[e], u[t]);
					m[t][e].distance = n, m[t][e].index = e, m[e][t].distance = n, m[e][t].index = t;
				}
				m[e].sort();
				for (let t = 0; t < l; t++) p[e][t] = m[e][t].index;
			}
			let t = 0;
			for (let e = 0; e < s; e++) {
				let n = i[e], r = f[e], a = u[r], s = o.distance(n, a), c = s, d = -1;
				for (let e = 0; e < l; e++) {
					if (m[r][e].distance >= 4 * s) continue;
					let t = o.distance(n, u[e]);
					t < c && (c = t, d = e);
				}
				d !== -1 && Math.abs(Math.sqrt(c) - Math.sqrt(s)) > Le && (t++, f[e] = d);
			}
			if (t === 0 && e !== 0) break;
			let n = Array(l).fill(0), r = Array(l).fill(0), a = Array(l).fill(0);
			for (let e = 0; e < l; e++) h[e] = 0;
			for (let e = 0; e < s; e++) {
				let t = f[e], o = i[e], s = c[e];
				h[t] += s, n[t] += o[0] * s, r[t] += o[1] * s, a[t] += o[2] * s;
			}
			for (let e = 0; e < l; e++) {
				let t = h[e];
				if (t === 0) {
					u[e] = [
						0,
						0,
						0
					];
					continue;
				}
				let i = n[e] / t, o = r[e] / t, s = a[e] / t;
				u[e] = [
					i,
					o,
					s
				];
			}
		}
		let g = /* @__PURE__ */ new Map();
		for (let e = 0; e < l; e++) {
			let t = h[e];
			if (t === 0) continue;
			let n = o.toInt(u[e]);
			g.has(n) || g.set(n, t);
		}
		return g;
	}
}, ze = class {
	constructor() {
		this.distance = -1, this.index = -1;
	}
}, Be = class {
	static quantize(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			ee(r) < 255 || t.set(r, (t.get(r) ?? 0) + 1);
		}
		return t;
	}
}, Ve = 5, X = 33, He = 35937, Z = {
	RED: "red",
	GREEN: "green",
	BLUE: "blue"
}, Ue = class {
	constructor(e = [], t = [], n = [], r = [], i = [], a = []) {
		this.weights = e, this.momentsR = t, this.momentsG = n, this.momentsB = r, this.moments = i, this.cubes = a;
	}
	quantize(e, t) {
		this.constructHistogram(e), this.computeMoments();
		let n = this.createBoxes(t);
		return this.createResult(n.resultCount);
	}
	constructHistogram(e) {
		this.weights = Array.from({ length: He }).fill(0), this.momentsR = Array.from({ length: He }).fill(0), this.momentsG = Array.from({ length: He }).fill(0), this.momentsB = Array.from({ length: He }).fill(0), this.moments = Array.from({ length: He }).fill(0);
		let t = Be.quantize(e);
		for (let [e, n] of t.entries()) {
			let t = te(e), r = D(e), i = O(e), a = (t >> 3) + 1, o = (r >> 3) + 1, s = (i >> 3) + 1, c = this.getIndex(a, o, s);
			this.weights[c] = (this.weights[c] ?? 0) + n, this.momentsR[c] += n * t, this.momentsG[c] += n * r, this.momentsB[c] += n * i, this.moments[c] += n * (t * t + r * r + i * i);
		}
	}
	computeMoments() {
		for (let e = 1; e < X; e++) {
			let t = Array.from({ length: X }).fill(0), n = Array.from({ length: X }).fill(0), r = Array.from({ length: X }).fill(0), i = Array.from({ length: X }).fill(0), a = Array.from({ length: X }).fill(0);
			for (let o = 1; o < X; o++) {
				let s = 0, c = 0, l = 0, u = 0, d = 0;
				for (let f = 1; f < X; f++) {
					let p = this.getIndex(e, o, f);
					s += this.weights[p], c += this.momentsR[p], l += this.momentsG[p], u += this.momentsB[p], d += this.moments[p], t[f] += s, n[f] += c, r[f] += l, i[f] += u, a[f] += d;
					let m = this.getIndex(e - 1, o, f);
					this.weights[p] = this.weights[m] + t[f], this.momentsR[p] = this.momentsR[m] + n[f], this.momentsG[p] = this.momentsG[m] + r[f], this.momentsB[p] = this.momentsB[m] + i[f], this.moments[p] = this.moments[m] + a[f];
				}
			}
		}
	}
	createBoxes(e) {
		this.cubes = Array.from({ length: e }).fill(0).map(() => new We());
		let t = Array.from({ length: e }).fill(0);
		this.cubes[0].r0 = 0, this.cubes[0].g0 = 0, this.cubes[0].b0 = 0, this.cubes[0].r1 = 32, this.cubes[0].g1 = 32, this.cubes[0].b1 = 32;
		let n = e, r = 0;
		for (let i = 1; i < e; i++) {
			this.cut(this.cubes[r], this.cubes[i]) ? (t[r] = this.cubes[r].vol > 1 ? this.variance(this.cubes[r]) : 0, t[i] = this.cubes[i].vol > 1 ? this.variance(this.cubes[i]) : 0) : (t[r] = 0, i--), r = 0;
			let e = t[0];
			for (let n = 1; n <= i; n++) t[n] > e && (e = t[n], r = n);
			if (e <= 0) {
				n = i + 1;
				break;
			}
		}
		return new Ge(e, n);
	}
	createResult(e) {
		let t = [];
		for (let n = 0; n < e; ++n) {
			let e = this.cubes[n], r = this.volume(e, this.weights);
			if (r > 0) {
				let n = Math.round(this.volume(e, this.momentsR) / r), i = Math.round(this.volume(e, this.momentsG) / r), a = Math.round(this.volume(e, this.momentsB) / r), o = 255 << 24 | (n & 255) << 16 | (i & 255) << 8 | a & 255;
				t.push(o);
			}
		}
		return t;
	}
	variance(e) {
		let t = this.volume(e, this.momentsR), n = this.volume(e, this.momentsG), r = this.volume(e, this.momentsB);
		return this.moments[this.getIndex(e.r1, e.g1, e.b1)] - this.moments[this.getIndex(e.r1, e.g1, e.b0)] - this.moments[this.getIndex(e.r1, e.g0, e.b1)] + this.moments[this.getIndex(e.r1, e.g0, e.b0)] - this.moments[this.getIndex(e.r0, e.g1, e.b1)] + this.moments[this.getIndex(e.r0, e.g1, e.b0)] + this.moments[this.getIndex(e.r0, e.g0, e.b1)] - this.moments[this.getIndex(e.r0, e.g0, e.b0)] - (t * t + n * n + r * r) / this.volume(e, this.weights);
	}
	cut(e, t) {
		let n = this.volume(e, this.momentsR), r = this.volume(e, this.momentsG), i = this.volume(e, this.momentsB), a = this.volume(e, this.weights), o = this.maximize(e, Z.RED, e.r0 + 1, e.r1, n, r, i, a), s = this.maximize(e, Z.GREEN, e.g0 + 1, e.g1, n, r, i, a), c = this.maximize(e, Z.BLUE, e.b0 + 1, e.b1, n, r, i, a), l, u = o.maximum, d = s.maximum, f = c.maximum;
		if (u >= d && u >= f) {
			if (o.cutLocation < 0) return !1;
			l = Z.RED;
		} else l = d >= u && d >= f ? Z.GREEN : Z.BLUE;
		switch (t.r1 = e.r1, t.g1 = e.g1, t.b1 = e.b1, l) {
			case Z.RED:
				e.r1 = o.cutLocation, t.r0 = e.r1, t.g0 = e.g0, t.b0 = e.b0;
				break;
			case Z.GREEN:
				e.g1 = s.cutLocation, t.r0 = e.r0, t.g0 = e.g1, t.b0 = e.b0;
				break;
			case Z.BLUE:
				e.b1 = c.cutLocation, t.r0 = e.r0, t.g0 = e.g0, t.b0 = e.b1;
				break;
			default: throw Error("unexpected direction " + l);
		}
		return e.vol = (e.r1 - e.r0) * (e.g1 - e.g0) * (e.b1 - e.b0), t.vol = (t.r1 - t.r0) * (t.g1 - t.g0) * (t.b1 - t.b0), !0;
	}
	maximize(e, t, n, r, i, a, o, s) {
		let c = this.bottom(e, t, this.momentsR), l = this.bottom(e, t, this.momentsG), u = this.bottom(e, t, this.momentsB), d = this.bottom(e, t, this.weights), f = 0, p = -1, m = 0, h = 0, g = 0, _ = 0;
		for (let v = n; v < r; v++) {
			if (m = c + this.top(e, t, v, this.momentsR), h = l + this.top(e, t, v, this.momentsG), g = u + this.top(e, t, v, this.momentsB), _ = d + this.top(e, t, v, this.weights), _ === 0) continue;
			let n = (m * m + h * h + g * g) * 1, r = _ * 1, y = n / r;
			m = i - m, h = a - h, g = o - g, _ = s - _, _ !== 0 && (n = (m * m + h * h + g * g) * 1, r = _ * 1, y += n / r, y > f && (f = y, p = v));
		}
		return new Ke(p, f);
	}
	volume(e, t) {
		return t[this.getIndex(e.r1, e.g1, e.b1)] - t[this.getIndex(e.r1, e.g1, e.b0)] - t[this.getIndex(e.r1, e.g0, e.b1)] + t[this.getIndex(e.r1, e.g0, e.b0)] - t[this.getIndex(e.r0, e.g1, e.b1)] + t[this.getIndex(e.r0, e.g1, e.b0)] + t[this.getIndex(e.r0, e.g0, e.b1)] - t[this.getIndex(e.r0, e.g0, e.b0)];
	}
	bottom(e, t, n) {
		switch (t) {
			case Z.RED: return -n[this.getIndex(e.r0, e.g1, e.b1)] + n[this.getIndex(e.r0, e.g1, e.b0)] + n[this.getIndex(e.r0, e.g0, e.b1)] - n[this.getIndex(e.r0, e.g0, e.b0)];
			case Z.GREEN: return -n[this.getIndex(e.r1, e.g0, e.b1)] + n[this.getIndex(e.r1, e.g0, e.b0)] + n[this.getIndex(e.r0, e.g0, e.b1)] - n[this.getIndex(e.r0, e.g0, e.b0)];
			case Z.BLUE: return -n[this.getIndex(e.r1, e.g1, e.b0)] + n[this.getIndex(e.r1, e.g0, e.b0)] + n[this.getIndex(e.r0, e.g1, e.b0)] - n[this.getIndex(e.r0, e.g0, e.b0)];
			default: throw Error("unexpected direction $direction");
		}
	}
	top(e, t, n, r) {
		switch (t) {
			case Z.RED: return r[this.getIndex(n, e.g1, e.b1)] - r[this.getIndex(n, e.g1, e.b0)] - r[this.getIndex(n, e.g0, e.b1)] + r[this.getIndex(n, e.g0, e.b0)];
			case Z.GREEN: return r[this.getIndex(e.r1, n, e.b1)] - r[this.getIndex(e.r1, n, e.b0)] - r[this.getIndex(e.r0, n, e.b1)] + r[this.getIndex(e.r0, n, e.b0)];
			case Z.BLUE: return r[this.getIndex(e.r1, e.g1, n)] - r[this.getIndex(e.r1, e.g0, n)] - r[this.getIndex(e.r0, e.g1, n)] + r[this.getIndex(e.r0, e.g0, n)];
			default: throw Error("unexpected direction $direction");
		}
	}
	getIndex(e, t, n) {
		return (e << 10) + (e << 6) + e + (t << Ve) + t + n;
	}
}, We = class {
	constructor(e = 0, t = 0, n = 0, r = 0, i = 0, a = 0, o = 0) {
		this.r0 = e, this.r1 = t, this.g0 = n, this.g1 = r, this.b0 = i, this.b1 = a, this.vol = o;
	}
}, Ge = class {
	constructor(e, t) {
		this.requestedCount = e, this.resultCount = t;
	}
}, Ke = class {
	constructor(e, t) {
		this.cutLocation = e, this.maximum = t;
	}
}, qe = class {
	static quantize(e, t) {
		let n = new Ue().quantize(e, t);
		return Re.quantize(e, n, t);
	}
}, Je = {
	desired: 4,
	fallbackColorARGB: 4282549748,
	filter: !0
};
function Ye(e, t) {
	return e.score > t.score ? -1 : +(e.score < t.score);
}
var Q = class e {
	constructor() {}
	static score(t, n) {
		let { desired: r, fallbackColorARGB: i, filter: a } = {
			...Je,
			...n
		}, o = [], s = Array(360).fill(0), c = 0;
		for (let [e, n] of t.entries()) {
			let t = F.fromInt(e);
			o.push(t);
			let r = Math.floor(t.hue);
			s[r] += n, c += n;
		}
		let l = Array(360).fill(0);
		for (let e = 0; e < 360; e++) {
			let t = s[e] / c;
			for (let n = e - 14; n < e + 16; n++) {
				let e = v(n);
				l[e] += t;
			}
		}
		let u = [];
		for (let t of o) {
			let n = l[v(Math.round(t.hue))];
			if (a && (t.chroma < e.CUTOFF_CHROMA || n <= e.CUTOFF_EXCITED_PROPORTION)) continue;
			let r = n * 100 * e.WEIGHT_PROPORTION, i = t.chroma < e.TARGET_CHROMA ? e.WEIGHT_CHROMA_BELOW : e.WEIGHT_CHROMA_ABOVE, o = r + (t.chroma - e.TARGET_CHROMA) * i;
			u.push({
				hct: t,
				score: o
			});
		}
		u.sort(Ye);
		let d = [];
		for (let e = 90; e >= 15; e--) {
			d.length = 0;
			for (let { hct: t } of u) if (d.find((n) => b(t.hue, n.hue) < e) || d.push(t), d.length >= r) break;
			if (d.length >= r) break;
		}
		let f = [];
		d.length === 0 && f.push(i);
		for (let e of d) f.push(e.toInt());
		return f;
	}
};
Q.TARGET_CHROMA = 48, Q.WEIGHT_PROPORTION = .7, Q.WEIGHT_CHROMA_ABOVE = .3, Q.WEIGHT_CHROMA_BELOW = .1, Q.CUTOFF_CHROMA = 5, Q.CUTOFF_EXCITED_PROPORTION = .01;
//#endregion
//#region packages/plugins/theme-m3/src/m3-theme.ts
var Xe = 4278216887, $ = new J(), Ze = R.fromPalette({
	name: "on_on_primary",
	palette: (e) => e.primaryPalette,
	background: () => $.onPrimary(),
	contrastCurve: () => new B(6, 6, 7, 11)
}), Qe = R.fromPalette({
	name: "primary_container_subtle",
	palette: (e) => e.primaryPalette,
	isBackground: !0,
	background: (e) => $.highestSurface(e),
	contrastCurve: () => void 0
}), $e = R.fromPalette({
	name: "on_primary_container_subtle",
	palette: (e) => e.primaryPalette,
	background: () => Qe,
	contrastCurve: () => new B(6, 6, 7, 11)
}), et = R.fromPalette({
	name: "secondary_container_subtle",
	palette: (e) => e.secondaryPalette,
	isBackground: !0,
	background: (e) => $.highestSurface(e),
	contrastCurve: () => void 0
}), tt = R.fromPalette({
	name: "on_secondary_container_subtle",
	palette: (e) => e.secondaryPalette,
	background: () => et,
	contrastCurve: () => new B(6, 6, 7, 11)
}), nt = R.fromPalette({
	name: "tertiary_container_subtle",
	palette: (e) => e.tertiaryPalette,
	isBackground: !0,
	background: (e) => $.highestSurface(e),
	contrastCurve: () => void 0
}), rt = R.fromPalette({
	name: "on_tertiary_container_subtle",
	palette: (e) => e.tertiaryPalette,
	background: () => nt,
	contrastCurve: () => new B(6, 6, 7, 11)
}), it = R.fromPalette({
	name: "error_container_subtle",
	palette: (e) => e.errorPalette,
	isBackground: !0,
	background: (e) => $.highestSurface(e),
	contrastCurve: () => void 0
}), at = R.fromPalette({
	name: "on_error_container_subtle",
	palette: (e) => e.errorPalette,
	background: () => it,
	contrastCurve: () => new B(6, 6, 7, 11)
}), ot = [
	...$.allColors.filter((e) => e.name !== "background" && e.name !== "on_background"),
	$.shadow(),
	$.scrim(),
	Ze,
	Qe,
	$e,
	et,
	tt,
	nt,
	rt,
	it,
	at
], st = [
	{
		name: "brand",
		source: "primary"
	},
	{
		name: "brand-muted",
		source: "primary-container-subtle"
	},
	{
		name: "soft-blue",
		source: "inverse-primary"
	},
	{
		name: "surface-variant",
		source: "surface-container-low"
	}
].filter((e) => e.name !== "surface-variant");
function ct(e) {
	return /primary|secondary|tertiary/.test(e);
}
function lt(e) {
	let t = (e & 16777215).toString(16).padStart(6, "0");
	return t[0] === t[1] && t[2] === t[3] && t[4] === t[5] ? `#${t[0]}${t[2]}${t[4]}` : `#${t}`;
}
function ut(e) {
	return e.replaceAll("_", "-");
}
function dt(e, t) {
	return new Y({
		sourceColorHcts: [F.fromInt(e)],
		variant: H.TONAL_SPOT,
		contrastLevel: 0,
		specVersion: "2025",
		isDark: t
	});
}
function ft(e, t) {
	let n = dt(e, t), r = {};
	for (let e of ot) {
		let t = ut(e.name);
		ct(t) && (r[`--color-${t}`] = lt(e.getArgb(n)));
	}
	for (let e of st) {
		let t = r[`--color-${e.source}`];
		t && (r[`--color-${e.name}`] = t);
	}
	return r;
}
function pt(e) {
	let t = dt(e, !1), n = [
		t.primaryPalette,
		t.secondaryPalette,
		t.tertiaryPalette
	], r = [];
	for (let e of [90, 80]) for (let t of n) r.push({
		background: lt(t.tone(e)),
		foreground: lt(t.tone(10))
	});
	return r;
}
function mt(e) {
	let t = e.map((e) => z.fromInt(e)), n = [], r = /* @__PURE__ */ new Set();
	function i(e, t) {
		let i = lt(e.tone(t));
		r.has(i) || n.length >= 6 || (r.add(i), n.push({
			background: i,
			foreground: lt(e.tone(10))
		}));
	}
	for (let e of t) i(e, 90);
	for (let e of t) i(e, 80);
	let a = e[0] ?? Xe;
	for (let e of pt(a)) {
		if (n.length >= 6) break;
		r.has(e.background) || (r.add(e.background), n.push(e));
	}
	return n;
}
function ht(e) {
	let t = [];
	for (let n = 0; n < e.length; n += 4) {
		let r = e[n], i = e[n + 1], a = e[n + 2];
		e[n + 3] < 255 || t.push(T(r, i, a));
	}
	let n = Q.score(qe.quantize(t, 128), { desired: 6 });
	return {
		seed: n[0],
		ranked: n
	};
}
//#endregion
//#region packages/plugins/theme-m3/src/index.ts
var gt = {
	...l(s(p)),
	resolveWallpaperColors({ pixels: e, mode: t, signal: n }) {
		n.throwIfAborted();
		let { seed: r, ranked: i } = ht(e), a = ft(r, t === "dark");
		return {
			workbenchColors: o(Object.fromEntries(Object.entries(a).map(([e, t]) => [e.replace("--color-", ""), t]))),
			coursePalette: mt(i)
		};
	}
};
function _t() {
	return f({
		id: "theme-m3",
		nameKey: "name",
		messages: {
			en: { name: "Material 3" },
			"zh-cn": { name: "Material 3" }
		},
		category: "theme",
		apply(e) {
			e.registerSlot("theme.definition", gt);
		}
	});
}
var vt = _t();
//#endregion
export { _t as createM3ThemePlugin, vt as default, gt as m3DefaultTheme };
