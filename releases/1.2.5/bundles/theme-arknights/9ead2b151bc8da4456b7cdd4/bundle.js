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
var t = new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
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
//#endregion
//#region packages/core/src/theme/color-theme-json.ts
function a(e) {
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
function o(e, t) {
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
function s(e) {
	let t = o({
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
function c(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function l() {
	return "1.2.5";
}
function u(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? c(e.messages, e.nameKey),
		version: e.version ?? l(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? c(e.messages, e.descriptionKey) : void 0,
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
var d = {
	id: "arknights",
	name: {
		"zh-CN": "ArKnights",
		en: "ArKnights"
	},
	recommendedIconTheme: "arknights",
	wallpaper: {
		url: "./wallpaper.jpg",
		sha256: "2aeb0c4ae37521c3d242a1bda8c930f7551d3c5f13185d1bbd3e0173d6c37ecc"
	},
	coursePalette: {
		light: [
			{
				background: "#D7EAF4",
				foreground: "#24282B"
			},
			{
				background: "#E6DFEB",
				foreground: "#24282B"
			},
			{
				background: "#F2E5AA",
				foreground: "#24282B"
			},
			{
				background: "#E3E9B8",
				foreground: "#24282B"
			},
			{
				background: "#DCDDDD",
				foreground: "#24282B"
			},
			{
				background: "#EADCCF",
				foreground: "#24282B"
			}
		],
		dark: [
			{
				background: "#19475F",
				foreground: "#F2F4EF"
			},
			{
				background: "#493F53",
				foreground: "#F2F4EF"
			},
			{
				background: "#524515",
				foreground: "#F2F4EF"
			},
			{
				background: "#3E4C29",
				foreground: "#F2F4EF"
			},
			{
				background: "#394449",
				foreground: "#F2F4EF"
			},
			{
				background: "#563F30",
				foreground: "#F2F4EF"
			}
		]
	},
	variants: {
		light: { colors: {
			"color.surface-dim": "#D5D8D7",
			"color.surface-bright": "#FAFAF7",
			"color.surface-container-lowest": "#FAFAF7",
			"color.surface-container-low": "#F5F5F1",
			"color.surface-container": "#E9E9E5",
			"color.surface-container-highest": "#D5D8D7",
			"color.on-surface-variant": "#525B60",
			"color.inverse-surface": "#24282B",
			"color.inverse-on-surface": "#FAFAF7",
			"color.primary-fixed": "#D7EAF4",
			"color.primary-fixed-dim": "#A1CBE4",
			"color.on-primary-fixed": "#143E56",
			"color.on-primary-fixed-variant": "#005377",
			"color.secondary-fixed": "#DDE5E5",
			"color.secondary-fixed-dim": "#B9CBCF",
			"color.on-secondary-fixed": "#293F46",
			"color.on-secondary-fixed-variant": "#465961",
			"color.tertiary": "#796000",
			"color.tertiary-dim": "#604C00",
			"color.on-tertiary": "#FAFAF7",
			"color.tertiary-container": "#F1E6B4",
			"color.on-tertiary-container": "#4B3B00",
			"color.tertiary-fixed": "#F1E6B4",
			"color.tertiary-fixed-dim": "#DCCD89",
			"color.on-tertiary-fixed": "#382D00",
			"color.on-tertiary-fixed-variant": "#604C00",
			"color.error": "#A33335",
			"color.error-dim": "#84282B",
			"color.on-error": "#FAFAF7",
			"color.error-container": "#F6DDDB",
			"color.on-error-container": "#6A2325",
			"color.shadow": "#24282B",
			"color.scrim": "color-mix(in srgb, #24282B 70%, transparent)",
			"color.on-on-primary": "#FAFAF7",
			"color.tertiary-container-subtle": "#F5F0DA",
			"color.on-tertiary-container-subtle": "#4B3B00",
			"color.error-container-subtle": "#F8ECEA",
			"color.on-error-container-subtle": "#6A2325",
			"color.surface": "#F5F5F1",
			"color.on-surface": "#24282B",
			"color.primary": "#006A93",
			"color.on-primary": "#FAFAF7",
			"color.surface-variant": "#DFE2DF",
			"color.outline": "#667176",
			"color.secondary": "#465961",
			"color.primary-dim": "#005377",
			"color.primary-container": "#D7EAF4",
			"color.on-primary-container": "#143E56",
			"color.inverse-primary": "#84C9F4",
			"color.secondary-dim": "#354850",
			"color.on-secondary": "#FAFAF7",
			"color.secondary-container": "#DDE5E5",
			"color.on-secondary-container": "#293F46",
			"color.primary-container-subtle": "#E6F0EF",
			"color.on-primary-container-subtle": "#143E56",
			"color.secondary-container-subtle": "#E9EEEE",
			"color.on-secondary-container-subtle": "#293F46",
			"color.outline-variant": "#AFB7B8",
			"color.surface-container-high": "#DFE2DF",
			"color.canvas": "#E9E9E5",
			"color.ink": "#24282B",
			"color.border-subtle": "#AFB7B8",
			"color.success": "#28684B",
			"color.warning": "#805500",
			"color.danger": "#A33335",
			"shell.bottomTab.activeBackground": "#24282B",
			"shell.bottomTab.activeForeground": "#FAFAF7",
			"shell.bottomBar.background": "#F5F5F1",
			"shell.topBar.background": "#F5F5F1",
			"leadingIcon.background": "color-mix(in srgb, #006A93 12%, transparent)",
			"leadingIcon.color": "#005377",
			"leadingIcon.backgroundPrimary": "color-mix(in srgb, #006A93 12%, transparent)",
			"leadingIcon.colorPrimary": "#005377",
			"leadingIcon.backgroundSecondary": "color-mix(in srgb, #465961 12%, transparent)",
			"leadingIcon.colorSecondary": "#465961",
			"leadingIcon.backgroundTertiary": "color-mix(in srgb, #796000 14%, transparent)",
			"leadingIcon.colorTertiary": "#796000",
			"leadingIcon.backgroundNeutral": "#DFE2DF",
			"leadingIcon.colorNeutral": "#525B60"
		} },
		dark: { colors: {
			"color.surface-dim": "#171B1E",
			"color.surface-bright": "#414C52",
			"color.surface-container-lowest": "#171B1E",
			"color.surface-container-low": "#20262A",
			"color.surface-container": "#282F33",
			"color.surface-container-highest": "#414C52",
			"color.on-surface-variant": "#BDC8CB",
			"color.inverse-surface": "#F2F4EF",
			"color.inverse-on-surface": "#171B1E",
			"color.primary-fixed": "#C7E6FA",
			"color.primary-fixed-dim": "#4AABEA",
			"color.on-primary-fixed": "#082C40",
			"color.on-primary-fixed-variant": "#143E56",
			"color.secondary-fixed": "#D4E3E6",
			"color.secondary-fixed-dim": "#BACCD1",
			"color.on-secondary-fixed": "#171B1E",
			"color.on-secondary-fixed-variant": "#344C55",
			"color.tertiary": "#F1C644",
			"color.tertiary-dim": "#F0D784",
			"color.on-tertiary": "#352B00",
			"color.tertiary-container": "#504310",
			"color.on-tertiary-container": "#F2F4EF",
			"color.tertiary-fixed": "#F2E3AA",
			"color.tertiary-fixed-dim": "#F1C644",
			"color.on-tertiary-fixed": "#171B1E",
			"color.on-tertiary-fixed-variant": "#4B3B00",
			"color.error": "#FFB4AB",
			"color.error-dim": "#FFD0CA",
			"color.on-error": "#5E191D",
			"color.error-container": "#5E2929",
			"color.on-error-container": "#F2F4EF",
			"color.shadow": "#171B1E",
			"color.scrim": "color-mix(in srgb, #171B1E 75%, transparent)",
			"color.on-on-primary": "#F2F4EF",
			"color.tertiary-container-subtle": "color-mix(in srgb, #F1C644 15%, #282F33)",
			"color.on-tertiary-container-subtle": "#F2E3AA",
			"color.error-container-subtle": "color-mix(in srgb, #FFB4AB 15%, #282F33)",
			"color.on-error-container-subtle": "#FFD0CA",
			"color.surface": "#282F33",
			"color.on-surface": "#F2F4EF",
			"color.primary": "#4AABEA",
			"color.on-primary": "#082C40",
			"color.surface-variant": "#343D42",
			"color.outline": "#849399",
			"color.secondary": "#BACCD1",
			"color.primary-dim": "#82C7F3",
			"color.primary-container": "#173D50",
			"color.on-primary-container": "#C7E6FA",
			"color.inverse-primary": "#C7E6FA",
			"color.secondary-dim": "#344C55",
			"color.on-secondary": "#171B1E",
			"color.secondary-container": "#344C55",
			"color.on-secondary-container": "#F2F4EF",
			"color.primary-container-subtle": "#233D44",
			"color.on-primary-container-subtle": "#C7E6FA",
			"color.secondary-container-subtle": "color-mix(in srgb, #BACCD1 15%, #282F33)",
			"color.on-secondary-container-subtle": "#D4E3E6",
			"color.outline-variant": "#54636A",
			"color.surface-container-high": "#343D42",
			"color.canvas": "#171B1E",
			"color.ink": "#F2F4EF",
			"color.border-subtle": "#849399",
			"color.success": "#91D5B0",
			"color.warning": "#F1C644",
			"color.danger": "#FFB4AB",
			"shell.bottomTab.activeBackground": "#F2F4EF",
			"shell.bottomTab.activeForeground": "#171B1E",
			"shell.bottomBar.background": "#282F33",
			"shell.topBar.background": "#282F33",
			"leadingIcon.background": "color-mix(in srgb, #4AABEA 18%, transparent)",
			"leadingIcon.color": "#C7E6FA",
			"leadingIcon.backgroundPrimary": "color-mix(in srgb, #4AABEA 18%, transparent)",
			"leadingIcon.colorPrimary": "#C7E6FA",
			"leadingIcon.backgroundSecondary": "color-mix(in srgb, #BACCD1 16%, transparent)",
			"leadingIcon.colorSecondary": "#D4E3E6",
			"leadingIcon.backgroundTertiary": "color-mix(in srgb, #F1C644 16%, transparent)",
			"leadingIcon.colorTertiary": "#F2E3AA",
			"leadingIcon.backgroundNeutral": "#343D42",
			"leadingIcon.colorNeutral": "#BDC8CB"
		} }
	},
	className: "chronos-theme-arknights"
}, f = u({
	id: "theme-arknights",
	nameKey: "name",
	messages: {
		en: { name: "ArKnights" },
		"zh-cn": { name: "ArKnights" }
	},
	category: "theme",
	apply(e) {
		e.registerSlot("theme.definition", s(a(d)));
	}
});
//#endregion
export { f as default };
