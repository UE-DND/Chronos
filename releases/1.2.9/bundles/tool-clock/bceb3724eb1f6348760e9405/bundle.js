//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = "http://www.w3.org/1999/xhtml", r = "@attach", i = Array.isArray, a = Array.prototype.indexOf, o = Array.prototype.includes, s = Array.from, c = Object.defineProperty, l = Object.getOwnPropertyDescriptor, u = Object.getOwnPropertyDescriptors, d = Object.prototype, f = Array.prototype, p = Object.getPrototypeOf, m = Object.isExtensible;
function h(e) {
	return typeof e == "function";
}
var g = () => {};
function _(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function v() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/constants.js
var y = 1 << 24, b = 1024, x = 2048, S = 4096, C = 8192, ee = 16384, te = 32768, ne = 1 << 25, re = 65536, ie = 1 << 19, ae = 1 << 20, oe = 1 << 25, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("component"), fe = Symbol("legacy props"), pe = Symbol(""), me = Symbol("attributes"), he = Symbol("class"), ge = Symbol("style"), _e = Symbol("text"), ve = Symbol("form reset"), ye = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), be = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function xe() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Se(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ce() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function we() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function Te(e) {
	w = e;
}
var T;
function Ee(t) {
	if (t === null) throw Se(), e;
	return T = t;
}
function De() {
	return Ee(/* @__PURE__ */ _n(T));
}
function E(t) {
	if (w) {
		if (/* @__PURE__ */ _n(T) !== null) throw Se(), e;
		T = t;
	}
}
function Oe(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ _n(n);
		T = n;
	}
}
function ke(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ _n(n);
		e && n.remove(), n = i;
	}
}
function Ae(t) {
	if (!t || t.nodeType !== 8) throw Se(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function je(e) {
	return e === this.v;
}
function Me(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ne(e) {
	return !Me(e, this.v);
}
function Pe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Fe() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function Ie() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Le(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Re(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ze() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Be(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function He(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ge() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ke() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function qe(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Fe(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Je(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Ye(e, t) {
	return e === null && Pe(t), e.c ??= new Map(Je(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var Xe = null;
function Ze(e) {
	Xe = e;
}
function Qe() {
	return qe($e, et, tt);
}
function $e(e) {
	return Ye(Xe, "getContext").get(e);
}
function et(e, t) {
	return Ye(Xe, "setContext").set(e, t), t;
}
function tt(e) {
	return Ye(Xe, "hasContext").has(e);
}
function nt() {
	return Ye(Xe, "getAllContexts");
}
function D(e, t = !1, n) {
	Xe = {
		p: Xe,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: z,
		l: null
	};
}
function O(e) {
	var t = Xe, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) An(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Xe = t.p, rt(e);
}
function rt(e = {}) {
	return c(e, de, { value: !0 }), e;
}
function it() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var at = [];
function ot() {
	var e = at;
	at = [], _(e);
}
function st(e) {
	if (at.length === 0 && !Ft) {
		var t = at;
		queueMicrotask(() => {
			t === at && ot();
		});
	}
	at.push(e);
}
function ct() {
	for (; at.length > 0;) ot();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var lt = ~(x | S | b);
function ut(e, t) {
	e.f = e.f & lt | t;
}
function dt(e) {
	e.f & 512 || e.deps === null ? ut(e, b) : ut(e, S);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function ft(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), ut(e, b);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/misc.js
function pt(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, st(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var mt = !1;
function ht() {
	mt || (mt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ve]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function gt(e) {
	var t = R, n = z;
	nr(null), rr(null);
	try {
		return e();
	} finally {
		nr(t), rr(n);
	}
}
function _t(e, t, n, r = n) {
	e.addEventListener(t, () => gt(n));
	let i = e[ve];
	e[ve] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ht();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
function vt(e, t, n, r) {
	let i = it() ? St : Tt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = z, c = yt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				wn(e, s);
			}
			bt();
		}
	}
	var d = xt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ wt(e))).then(u).catch((e) => wn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), bt();
	}) : f();
}
function yt() {
	var e = z, t = R, n = Xe, r = A;
	return function(i = !0) {
		rr(e), nr(t), Ze(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function bt(e = !0) {
	rr(null), nr(null), Ze(null), e && A?.deactivate();
}
function xt() {
	var e = z, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	var n = 2 | x;
	return z !== null && (z.f |= ie), {
		ctx: Xe,
		deps: null,
		effects: null,
		equals: je,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: z,
		ac: null
	};
}
var Ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function wt(e, n, r) {
	let i = z;
	i === null && Ie();
	var a = void 0, o = Qt(t), s = !R, c = /* @__PURE__ */ new Set();
	return Fn(() => {
		var t = z, n = v();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(bt);
		} catch (e) {
			n.reject(e), bt();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = xt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Ct);
			else for (let e of c.values()) e.reject(Ct);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Ct && (r.activate(), t ? (o.f |= le, nn(o, t)) : (o.f & 8388608 && (o.f ^= le), nn(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), kn(() => {
		for (let e of c) e.reject(Ct);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === a ? e(o) : t(a);
			}
			n.then(r, r);
		}
		t(a);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function k(e) {
	let t = /* @__PURE__ */ St(e);
	return ar(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Tt(e) {
	let t = /* @__PURE__ */ St(e);
	return t.equals = Ne, t;
}
function Et(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Un(t[n]);
	}
}
function Dt(e) {
	var n, r = z, i = e.parent;
	if (!$n && i !== null && e.v !== t && i.f & 24576) return xe(), e.v;
	rr(i);
	try {
		Et(e), n = _r(e);
	} finally {
		rr(r);
	}
	return n;
}
function Ot(e) {
	var t = Dt(e);
	if (!e.equals(t) && (e.wv = mr(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), Mt?.capture(e, t, !0)), e.deps === null))) {
		ut(e, b);
		return;
	}
	$n || (Nt === null ? dt(e) : (On() || A?.is_fork) && Nt.set(e, t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && gt(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = g), br(t, 0), Vn(t));
}
function At(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && xr(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var jt = null, A = null, Mt = null, Nt = null, Pt = null, Ft = !1, It = !1, Lt = null, Rt = null, zt = 0, Bt = 1, Vt = class e {
	id = Bt++;
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
		jt === null ? jt = this : (jt.#n = this, this.#t = jt), jt = this;
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
			for (var r of n.d) ut(r, x), t(r);
			for (r of n.m) ut(r, S), t(r);
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
		for (let e of this.#u) this.#d.delete(e), ut(e, x), this.schedule(e);
		for (let e of this.#d) ut(e, S), this.schedule(e);
		this.apply();
		for (var t = Lt = [], n = [], r = Rt = []; this.#c.length > 0;) {
			zt++ > 1e3 && (this.#S(), Ut());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Jt(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Lt = null, Rt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) qt(e, t);
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
		this.#r.clear(), Mt = this, Gt(n), Gt(t), Mt = null, this.#s?.resolve();
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Xt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= b;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= b : i & 4 ? t.push(r) : hr(r) && (i & 16 && this.#d.add(r), xr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), ut(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), A = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ft(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), Nt?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, Nt = null;
	}
	flush() {
		try {
			It = !0, A = this, this.#_();
		} finally {
			zt = 0, Pt = null, Lt = null, Rt = null, It = !1, A = null, Nt = null, Xt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Ct);
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
		this.#m || (this.#m = !0, st(() => {
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
		return (this.#s ??= v()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!It && !Ft && st(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		Nt = null;
	}
	schedule(e) {
		if (Pt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? jt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ht(e) {
	var t = Ft;
	Ft = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (ct(), A === null) return n;
			A.flush();
		}
	} finally {
		Ft = t;
	}
}
function Ut() {
	try {
		Ve();
	} catch (e) {
		wn(e, Pt);
	}
}
var Wt = null;
function Gt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && hr(r) && (Wt = /* @__PURE__ */ new Set(), xr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Gn(r), Wt?.size > 0)) {
				Xt.clear();
				for (let e of Wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Wt.has(n) && (Wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || xr(n);
					}
				}
				Wt.clear();
			}
		}
		Wt = null;
	}
}
function Kt(e) {
	A.schedule(e);
}
function qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), ut(e, b);
		for (var n = e.first; n !== null;) qt(n, t), n = n.next;
	}
}
function Jt(e) {
	ut(e, b);
	for (var t = e.first; t !== null;) Jt(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Yt = /* @__PURE__ */ new Set(), Xt = /* @__PURE__ */ new Map(), Zt = !1;
function Qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: je,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = Qt(e, t);
	return ar(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e, t = !1, n = !0) {
	let r = Qt(e);
	return t || (r.equals = Ne), r;
}
function M(e, t, n = !1) {
	return R !== null && (!tr || R.f & 131072) && it() && R.f & 4325394 && (ir === null || !ir.has(e)) && Ge(), nn(e, n ? sn(t) : t, Rt);
}
var en = null, tn = 0;
function nn(e, t, n = null) {
	if (!e.equals(t)) {
		$n ? Xt.set(e, t) : Xt.has(e) || Xt.set(e, e.v);
		var r = Vt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Dt(t), Nt === null && dt(t);
		}
		e.wv = mr(), en = null, tn = 0, on(e, x, n), en = null, it() && z !== null && z.f & 1024 && !(z.f & 96) && (cr === null ? lr([e]) : cr.push(e)), !r.is_fork && Yt.size > 0 && !Zt && rn();
	}
	return t;
}
function rn() {
	Zt = !1;
	for (let e of Yt) {
		e.f & 1024 && ut(e, S);
		let t;
		try {
			t = hr(e);
		} catch {
			t = !0;
		}
		t && xr(e);
	}
	Yt.clear();
}
function an(e) {
	M(e, e.v + 1);
}
function on(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = it(), a = r.length;
		if (tn += a, tn > 1e5 && en === null && (en = /* @__PURE__ */ new Set()), en !== null) {
			if (en.has(e)) return;
			en.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== z) {
				var l = (c & x) === 0;
				if (l && ut(s, t), c & 131072) Yt.add(s);
				else if (c & 2) {
					var u = s;
					Nt?.delete(u), on(u, S, n);
				} else if (l) {
					var d = s;
					c & 16 && Wt !== null && Wt.add(d), n === null ? Kt(d) : n.push(d);
				}
			}
		}
	}
}
function sn(e) {
	if (typeof e != "object" || !e || ue in e || de in e) return e;
	let n = p(e);
	if (n !== d && n !== f) return e;
	var r = /* @__PURE__ */ new Map(), a = i(e), o = /* @__PURE__ */ j(0), s = null, c = fr, u = (e) => {
		if (fr === c) return e();
		var t = R, n = fr;
		nr(null), pr(c);
		var r = e();
		return nr(t), pr(n), r;
	};
	return a && r.set("length", /* @__PURE__ */ j(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ue();
			var i = r.get(t);
			return i === void 0 ? u(() => {
				var e = /* @__PURE__ */ j(n.value, s);
				return r.set(t, e), e;
			}) : M(i, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var i = r.get(n);
			if (i === void 0) {
				if (n in e) {
					let e = u(() => /* @__PURE__ */ j(t, s));
					r.set(n, e), an(o);
				}
			} else M(i, t), an(o);
			return !0;
		},
		get(n, i, a) {
			if (i === ue) return e;
			var o = r.get(i), c = i in n;
			if (o === void 0 && (!c || l(n, i)?.writable) && (o = u(() => /* @__PURE__ */ j(sn(c ? n[i] : t), s)), r.set(i, o)), o !== void 0) {
				var d = B(o);
				return d === t ? void 0 : d;
			}
			return Reflect.get(n, i, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var i = Reflect.getOwnPropertyDescriptor(e, n), a = r.get(n);
			if (a !== void 0) {
				var o = B(a);
				if (o === t) return;
				if (i && "value" in i) i.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return i;
		},
		has(e, n) {
			if (n === ue) return !0;
			var i = r.get(n), a = i !== void 0 && i.v !== t || Reflect.has(e, n);
			return (i !== void 0 || z !== null && (!a || l(e, n)?.writable)) && (i === void 0 && (i = u(() => /* @__PURE__ */ j(a ? sn(e[n]) : t, s)), r.set(n, i)), B(i) === t) ? !1 : a;
		},
		set(e, n, i, c) {
			var d = r.get(n), f = n in e;
			if (a && n === "length") for (var p = i; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = u(() => /* @__PURE__ */ j(t, s)), r.set(p + "", m)) : M(m, t);
			}
			if (d === void 0) (!f || l(e, n)?.writable) && (d = u(() => /* @__PURE__ */ j(void 0, s)), M(d, sn(i)), r.set(n, d));
			else {
				f = d.v !== t;
				var h = u(() => sn(i));
				M(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(c, i), !f) {
				if (a && typeof n == "string") {
					var _ = r.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && M(_, v + 1);
				}
				an(o);
			}
			return !0;
		},
		ownKeys(e) {
			B(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = r.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [i, a] of r) a.v !== t && !(i in e) && n.push(i);
			return n;
		},
		setPrototypeOf() {
			We();
		}
	});
}
function cn(e) {
	try {
		if (typeof e == "object" && e && ue in e) return e[ue];
	} catch {}
	return e;
}
function ln(e, t) {
	return Object.is(cn(e), cn(t));
}
var un, dn, fn, pn;
function mn() {
	if (un === void 0) {
		un = window, dn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		fn = l(t, "firstChild").get, pn = l(t, "nextSibling").get, m(e) && (e[he] = void 0, e[me] = null, e[ge] = void 0, e.__e = void 0), m(n) && (n[_e] = void 0);
	}
}
function hn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function gn(e) {
	return fn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function _n(e) {
	return pn.call(e);
}
function N(e, t) {
	if (!w) return /* @__PURE__ */ gn(e);
	var n = /* @__PURE__ */ gn(T);
	if (n === null) n = T.appendChild(hn());
	else if (t && n.nodeType !== 3) {
		var r = hn();
		return n?.before(r), Ee(r), r;
	}
	return t && Sn(n), Ee(n), n;
}
function P(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ gn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ _n(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = hn();
			return T?.before(r), Ee(r), r;
		}
		Sn(T);
	}
	return T;
}
function vn(e, t = !1) {
	if (!w) return /* @__PURE__ */ gn(e);
	var n = N(e, t);
	return E(e), n;
}
function F(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ _n(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = hn();
			return r === null ? i?.after(a) : r.before(a), Ee(a), a;
		}
		Sn(r);
	}
	return Ee(r), r;
}
function yn(e) {
	e.textContent = "";
}
function bn() {
	return !1;
}
function xn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Sn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Cn(e) {
	var t = z;
	if (t === null) return R.f |= le, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	wn(e, t);
}
function wn(e, t) {
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
function Tn(e) {
	z === null && (R === null && Be(e), ze()), $n && Re(e);
}
function En(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Dn(e, t) {
	var n = z;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: Xe,
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) Lt === null ? Vt.ensure().schedule(r) : Lt.push(r);
	else if (t !== null) {
		try {
			xr(r);
		} catch (e) {
			throw Un(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= re));
	}
	if (i !== null && (i.parent = n, n !== null && En(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function On() {
	return R !== null && !tr;
}
function kn(e) {
	let t = Dn(8, null);
	return ut(t, b), t.teardown = e, t;
}
function I(e) {
	Tn("$effect");
	var t = z.f;
	if (!R && t & 32 && Xe !== null && !Xe.i) {
		var n = Xe;
		(n.e ??= []).push(e);
	} else return An(e);
}
function An(e) {
	return Dn(4 | ae, e);
}
function jn(e) {
	return Tn("$effect.pre"), Dn(8 | ae, e);
}
function Mn(e) {
	Vt.ensure();
	let t = Dn(64 | ie, e);
	return () => {
		Un(t);
	};
}
function Nn(e) {
	Vt.ensure();
	let t = Dn(64 | ie, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Kn(t, () => {
			Un(t), n(void 0);
		}) : (Un(t), n(void 0));
	});
}
function Pn(e) {
	return Dn(4, e);
}
function Fn(e) {
	return Dn(ce | ie, e);
}
function In(e, t = 0) {
	return Dn(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	vt(r, t, n, (t) => {
		Dn(8, () => {
			e(...t.map(B));
		});
	});
}
function Ln(e, t = 0) {
	return Dn(16 | t, e);
}
function Rn(e, t = 0) {
	return Dn(y | t, e);
}
function zn(e) {
	return Dn(32 | ie, e);
}
function Bn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = $n, r = R;
		er(!0), nr(null);
		try {
			t.call(null);
		} catch (t) {
			wn(t, e.parent);
		} finally {
			er(n), nr(r);
		}
	}
}
function Vn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && gt(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Un(n, t), n = r;
	}
}
function Hn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Un(t), t = n;
	}
}
function Un(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Wn(e.nodes.start, e.nodes.end), n = !0), e.f |= ne, Vn(e, t && !n), br(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Bn(e), e.f ^= ne, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && Gn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Wn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ _n(e);
		e.remove(), e = n;
	}
}
function Gn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Kn(e, t, n = !0) {
	var r = [];
	e.f |= 256, qn(e, r, !0);
	var i = () => {
		n && Un(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function qn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				qn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Jn(e) {
	e.f &= -257, Yn(e, !0);
}
function Yn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= C, e.f & 1024 || (ut(e, x), Vt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Yn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Xn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ _n(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Zn = null, Qn = !1, $n = !1;
function er(e) {
	$n = e;
}
var R = null, tr = !1;
function nr(e) {
	R = e;
}
var z = null;
function rr(e) {
	z = e;
}
var ir = null;
function ar(e) {
	R !== null && (R.f & 2097152 || R.f & 2) && (ir ??= /* @__PURE__ */ new Set()).add(e);
}
var or = null, sr = 0, cr = null;
function lr(e) {
	cr = e;
}
var ur = 1, dr = 0, fr = dr;
function pr(e) {
	fr = e;
}
function mr() {
	return ++ur;
}
function hr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (hr(a) && Ot(a), a.wv > e.wv) return !0;
		}
		t & 512 && Nt === null && ut(e, b);
	}
	return !1;
}
function gr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(ir !== null && ir.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? gr(a, t, !1) : t === a && (n ? ut(a, x) : a.f & 1024 && ut(a, S), Kt(a));
	}
}
function _r(e) {
	var t = or, n = sr, r = cr, i = R, a = ir, o = Xe, s = tr, c = fr, l = e.f;
	or = null, sr = 0, cr = null, R = l & 96 ? null : e, ir = null, Ze(e.ctx), tr = !1, fr = ++dr, e.ac !== null && (gt(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= te;
		var f = vr(e);
		if (it() && cr !== null && !tr && f !== null && !(e.f & 6146)) for (var p = 0; p < cr.length; p++) gr(cr[p], e);
		if (i !== null && i !== e) {
			if (dr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = dr;
			if (t !== null) for (let e of t) e.rv = dr;
			cr !== null && (r === null ? r = cr : r.push(...cr));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (t) {
		return vr(e), Cn(t);
	} finally {
		e.f ^= se, or = t, sr = n, cr = r, R = i, ir = a, Ze(o), tr = s, fr = c;
	}
}
function vr(e) {
	var t = e.deps, n = A?.is_fork;
	if (or !== null) {
		var r;
		if (n || br(e, sr), t !== null && sr > 0) for (t.length = sr + or.length, r = 0; r < or.length; r++) t[sr + r] = or[r];
		else e.deps = t = or;
		if (On() && e.f & 512) for (r = sr; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && sr < t.length && (br(e, sr), t.length = sr);
	return t;
}
function yr(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var i = a.call(r, e);
		if (i !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[i] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (or === null || !o.call(or, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && dt(c), c.ac !== null && gt(() => {
			c.ac.abort(ye), c.ac = null, ut(c, x);
		}), kt(c), br(c, 0);
	}
}
function br(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) yr(e, n[r]);
}
function xr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		ut(e, b);
		var n = z, r = Qn;
		z = e, Qn = !(t & 96);
		try {
			t & 16777232 ? Hn(e) : Vn(e), Bn(e);
			var i = _r(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ur;
		} finally {
			Qn = r, z = n;
		}
	}
}
async function Sr() {
	await Promise.resolve(), Ht();
}
function B(e) {
	var t = !!(e.f & 2);
	if (Zn?.add(e), R !== null && !tr && !(z !== null && z.f & 16384) && (ir === null || !ir.has(e))) {
		var n = R.deps;
		if (R.f & 2097152) e.rv < dr && (e.rv = dr, or === null && n !== null && n[sr] === e ? sr++ : or === null ? or = [e] : or.push(e));
		else {
			R.deps ??= [], o.call(R.deps, e) || R.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [R] : o.call(r, R) || r.push(R);
		}
	}
	if ($n && Xt.has(e)) return Xt.get(e);
	if (t) {
		var i = e;
		if ($n) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || wr(i)) && (a = Dt(i)), Xt.set(i, a), a;
		}
		var s = !(i.f & 512) && !tr && R !== null && (Qn || !!(R.f & 512)), c = (i.f & te) === 0;
		hr(i) && (s && (i.f |= 512), Ot(i)), s && !c && (At(i), Cr(i));
	}
	if (Nt?.has(e)) return Nt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Cr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (At(t), Cr(t));
}
function wr(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Xt.has(t) || t.f & 2 && wr(t)) return !0;
	return !1;
}
function Tr(e) {
	var t = tr;
	try {
		return tr = !0, e();
	} finally {
		tr = t;
	}
}
function Er(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ue in e) Dr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ue in n && Dr(n);
		}
	}
}
function Dr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Dr(e[n], t);
		} catch {}
		let n = p(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = u(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
var Or = Symbol("events"), kr = /* @__PURE__ */ new Set(), Ar = /* @__PURE__ */ new Set();
function jr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Rr.call(t, e), !e.cancelBubble) return gt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, st(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Mr(e, t, n, r = {}) {
	var i = jr(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function Nr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = jr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && kn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Pr(e, t, n) {
	(t[Or] ??= {})[e] = n;
}
function Fr(e) {
	for (var t = 0; t < e.length; t++) kr.add(e[t]);
	for (var n of Ar) n(e);
}
var Ir = null, Lr = !1;
function Rr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Ir = e, Lr || (Lr = !0, setTimeout(() => {
		Lr = !1, Ir = null;
	}));
	var o = 0, s = Ir === e && e[Or];
	if (s) {
		var l = i.indexOf(s);
		if (l !== -1 && (t === document || t === window)) {
			e[Or] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		c(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = R, f = z;
		nr(null), rr(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Or]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[Or] = t, delete e.currentTarget, nr(d), rr(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var zr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Br(e) {
	return zr?.createHTML(e) ?? e;
}
function Vr(e) {
	var t = xn("template");
	return t.innerHTML = Br(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function Hr(e, t) {
	var n = z;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function V(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return Hr(T, null), T;
		i === void 0 && (i = Vr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ gn(i)));
		var t = r || dn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ gn(t), s = t.lastChild;
			Hr(o, s);
		} else Hr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ur(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (w) return Hr(T, null), T;
		if (!o) {
			var e = /* @__PURE__ */ gn(Vr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ gn(e);) o.appendChild(/* @__PURE__ */ gn(e));
			else o = /* @__PURE__ */ gn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ gn(t), r = t.lastChild;
			Hr(n, r);
		} else Hr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Wr(e, t) {
	return /* @__PURE__ */ Ur(e, t, "svg");
}
function Gr(e = "") {
	if (!w) {
		var t = hn(e + "");
		return Hr(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? Sn(n) : (n.before(n = hn()), Ee(n)), Hr(n, n), n;
}
function H() {
	if (w) return Hr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = hn();
	return e.append(t, n), Hr(t, n), e;
}
function U(e, t) {
	if (w) {
		var n = z;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), De();
		return;
	}
	e !== null && e.before(t);
}
function Kr() {
	if (w && T && T.nodeType === 8 && T.textContent?.startsWith("$")) {
		let e = T.textContent.substring(1);
		return De(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/utils.js
function qr(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var Jr = [
	"beforeinput",
	"click",
	"change",
	"dblclick",
	"contextmenu",
	"focusin",
	"focusout",
	"input",
	"keydown",
	"keyup",
	"mousedown",
	"mousemove",
	"mouseout",
	"mouseover",
	"mouseup",
	"pointerdown",
	"pointermove",
	"pointerout",
	"pointerover",
	"pointerup",
	"touchend",
	"touchmove",
	"touchstart"
];
function Yr(e) {
	return Jr.includes(e);
}
var Xr = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), Zr = {
	formnovalidate: "formNoValidate",
	ismap: "isMap",
	nomodule: "noModule",
	playsinline: "playsInline",
	readonly: "readOnly",
	defaultvalue: "defaultValue",
	defaultchecked: "defaultChecked",
	srcobject: "srcObject",
	novalidate: "noValidate",
	allowfullscreen: "allowFullscreen",
	disablepictureinpicture: "disablePictureInPicture",
	disableremoteplayback: "disableRemotePlayback"
};
function Qr(e) {
	return e = e.toLowerCase(), Zr[e] ?? e;
}
[...Xr];
var $r = ["touchstart", "touchmove"];
function ei(e) {
	return $r.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function ti(e) {
	let t = 0, n = Qt(0), r;
	return () => {
		On() && (B(n), In(() => (t === 0 && (r = Tr(() => e(() => an(n)))), t += 1, () => {
			st(() => {
				--t, t === 0 && (r?.(), r = void 0, an(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ni = re | ie;
function ri(e, t, n, r) {
	new ii(e, t, n, r);
}
var ii = class {
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
	#h = ti(() => (this.#m = Qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = z;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = z.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Ln(() => {
			if (w) {
				let e = this.#t;
				De();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ni), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = zn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		st(r), t && (this.#s = zn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				we();
				return;
			}
			t = !0, n && Ke(), this.#s !== null && Kn(this.#s, () => {
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
					wn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = zn(() => e(this.#e)), st(() => {
			var e = this.#c = document.createDocumentFragment(), t = hn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return zn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						wn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Kn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = zn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Xn(this.#a, e);
				let t = this.#n.pending;
				this.#o = zn(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ft(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = z, n = R, r = Xe;
		rr(this.#i), nr(this.#i), Ze(this.#i.ctx);
		try {
			return Vt.ensure(), e();
		} finally {
			rr(t), nr(n), Ze(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Kn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, st(() => {
			this.#d = !1, this.#m && nn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), B(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Un(this.#a), null), this.#o &&= (Un(this.#o), null), this.#s &&= (Un(this.#s), null), w && (Ee(this.#t), Oe(), Ee(ke()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return zn(() => {
						var r = z;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return wn(e, this.#i.parent), null;
				}
			}));
		};
		st(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				wn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => wn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function ai(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[_e] ??= e.nodeValue) && (e[_e] = n, e.nodeValue = `${n}`);
}
function oi(e, t) {
	return ci(e, t);
}
var si = /* @__PURE__ */ new Map();
function ci(t, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: c = !0, transformError: l }) {
	mn();
	var u = void 0, d = Nn(() => {
		var c = r ?? n.appendChild(hn());
		ri(c, { pending: () => {} }, (n) => {
			D({});
			var r = Xe;
			if (o && (r.c = o), a && (i.$$events = a), w && Hr(n, null), u = t(n, i) || rt(), w && (z.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw Se(), e;
			O();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = ei(r);
					for (let e of [n, document]) {
						var a = si.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), si.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Rr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(s(kr)), Ar.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = si.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Rr), t.delete(e), t.size === 0 && si.delete(r)) : t.set(e, i);
			}
			Ar.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return li.set(u, d), u;
}
var li = /* @__PURE__ */ new WeakMap();
function ui(e, t) {
	let n = li.get(e);
	return n ? (li.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var di = class {
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
			if (n) Jn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Jn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Un(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Xn(r, t), t.append(hn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Un(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Kn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Un(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = bn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = hn();
				i.append(a), this.#n.set(e, {
					effect: zn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, zn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function W(e, t, ...n) {
	var r = new di(e);
	Ln(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, re);
}
function fi(e) {
	Xe === null && Pe("onMount"), I(() => {
		let t = Tr(e);
		if (typeof t == "function") return t;
	});
}
function pi(e) {
	Xe === null && Pe("onDestroy"), fi(() => () => Tr(e));
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/attachments/index.js
function mi() {
	return Symbol(r);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function G(e, t, n = !1) {
	var r;
	w && (r = T, De());
	var i = new di(e), a = n ? re : 0;
	function o(e, t) {
		if (w) {
			var n = Ae(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ke();
				Ee(a), i.anchor = a, Te(!1), i.ensure(e, t), Te(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Ln(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/key.js
var hi = Symbol("NaN");
function gi(e, t, n) {
	w && De();
	var r = new di(e), i = !it();
	Ln(() => {
		var e = t();
		e !== e && (e = hi), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function _i(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Kn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					vi(e, s(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			yn(d), d.append(u), e.items.clear();
		}
		vi(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function vi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= oe, Xn(a, document.createDocumentFragment())) : Un(t[i], n);
	}
}
var yi;
function bi(e, t, n, r, a, o = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? Ee(/* @__PURE__ */ gn(u)) : u.appendChild(hn());
	}
	w && De();
	var d = null, f = /* @__PURE__ */ Tt(() => {
		var e = n();
		return i(e) ? e : e == null ? [] : s(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Si(v, p, c, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= oe, wi(d, null, c)) : Jn(d) : Kn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Ln(() => {
			p = B(f);
			var e = p.length;
			let i = !1;
			w && Ae(c) === "[!" != (e === 0) && (c = ke(), Ee(c), Te(!1), i = !0);
			for (var s = /* @__PURE__ */ new Set(), u = A, v = bn(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, i = !0, Te(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && nn(S.v, b), S.i && nn(S.i, y), v && u.unskip_effect(S.e)) : (S = Ci(l, h ? c : yi ??= hn(), b, x, y, a, t, n), h || (S.e.f |= oe), l.set(x, S)), s.add(x);
			}
			if (e === 0 && o && !d && (h ? d = zn(() => o(c)) : (d = zn(() => o(yi ??= hn())), d.f |= oe)), e > s.size && Le("", "", ""), w && e > 0 && Ee(ke()), !h) {
				if (m.set(u, s), v) {
					for (let [e, t] of l) s.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			i && Te(!0), B(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function xi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Si(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, c = e.items, l = xi(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Jn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= oe, _ === l) wi(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Ti(e, d, _), Ti(e, _, y), wi(_, y, n), d = _, p = [], m = [], l = xi(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) wi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Ti(e, S.prev, C.next), Ti(e, d, S), Ti(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), wi(_, l, n), Ti(e, _.prev, _.next), Ti(e, _, d === null ? e.effect.first : d.next), Ti(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = xi(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = xi(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (vi(e, s(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var ee = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || ee.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && ee.push(l), l = xi(l.next);
		var te = ee.length;
		if (te > 0) {
			var ne = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.fix();
			}
			_i(e, ee, ne);
		}
	}
	a && st(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ci(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qt(n) : /* @__PURE__ */ $t(n, !1, !1) : null, l = o & 2 ? Qt(i) : null;
	return {
		v: c,
		i: l,
		e: zn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function wi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ _n(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Ti(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function K(e, t, n) {
	var r;
	w && (r = T, De());
	var i = new di(e);
	Ln(() => {
		var e = t() ?? null;
		if (w && Ae(r) === "[" != (e !== null)) {
			var a = ke();
			Ee(a), i.anchor = a, Te(!1), i.ensure(e, e && ((t) => n(t, e))), Te(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, re);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ei(e, t, n) {
	Pn(() => {
		var r = Tr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			In(() => {
				var e = n();
				Er(e), i && Me(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Di(e, t) {
	var n = void 0, r;
	Rn(() => {
		n !== (n = t()) && (r &&= (Un(r), null), n && (r = zn(() => {
			Pn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function Oi(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Oi(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function ki() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Oi(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/attributes.js
function Ai(e) {
	return typeof e == "object" ? ki(e) : e ?? "";
}
var ji = [..." 	\n\r\f\xA0\v﻿"];
function Mi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ji.includes(r[o - 1])) && (s === r.length || ji.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ni(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Pi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Fi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Pi)), i && c.push(...Object.keys(i).map(Pi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Pi(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += Ni(r)), i && (n += Ni(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/class.js
function Ii(e, t, n, r, i, a) {
	var o = e[he];
	if (w || o !== n || o === void 0) {
		var s = Mi(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[he] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/style.js
function Li(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Ri(e, t, n, r) {
	var i = e[ge];
	if (w || i !== t) {
		var a = Fi(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ge] = t;
	} else r && (Array.isArray(r) ? (Li(e, n?.[0], r[0]), Li(e, n?.[1], r[1], "important")) : Li(e, n, r));
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function zi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Bi(e, t) {
	var n = !("__defaultValue" in e);
	(n || e.__defaultValue !== t) && (e.__defaultValue = t, Vi(e, !n || "__value" in e));
}
function Vi(e, t) {
	var n = e.__defaultValue, r = e.multiple, a = r ? n ?? [] : null;
	if (!r || i(a)) {
		var o = e.selectedIndex, s = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = Wi(c);
			zi(c, r ? a.includes(l) : ln(l, n));
		}
		if (t) {
			if (s !== null) for (c of e.options) {
				var u = s.has(c);
				c.selected !== u && (c.selected = u);
			}
			else e.selectedIndex !== o && (e.selectedIndex = o);
		}
	}
}
function Hi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!i(t)) return Ce();
		for (var r of e.options) r.selected = t.includes(Wi(r));
		return;
	}
	for (r of e.options) if (ln(Wi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function Ui(e) {
	var t = new MutationObserver((t) => {
		t.every(Gi) || ("__defaultValue" in e && Vi(e, !1), "__value" in e && Hi(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), kn(() => {
		t.disconnect();
	});
}
function Wi(e) {
	return "__value" in e ? e.__value : e.value;
}
function Gi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Ki = Symbol("class"), qi = Symbol("style"), Ji = Symbol("is custom element"), Yi = Symbol("is html"), Xi = be ? "link" : "LINK", Zi = be ? "input" : "INPUT", Qi = be ? "option" : "OPTION", $i = be ? "select" : "SELECT";
function ea(e) {
	if (w) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					ta(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					ta(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ve] = n, st(n), ht();
	}
}
function ta(e, t, n, r) {
	var i = ra(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Xi) || i[t] !== (i[t] = n) && (t === "loading" && (e[pe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && aa(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function na(e, n, r, i, a = !1, o = !1) {
	w && a && e.nodeName === Zi && ("defaultValue" in r || "defaultChecked" in r || ea(e));
	var s = ra(e), c = s[Ji], l = !s[Yi];
	let u = w && c;
	u && Te(!1);
	var d = n || {}, f = e.nodeName === Qi, p = e.nodeName === $i;
	for (var m in n) !(m in r) && m[0] + m[1] !== "$$" && (r[m] = null);
	r.class ? r.class = Ai(r.class) : (i || r[Ki]) && (r.class = null), r[qi] && (r.style ??= null);
	var h = aa(e);
	if (e.nodeName === Zi && "type" in r && ("value" in r || "__value" in r)) {
		var g = r.type;
		(g !== d.type || g === void 0 && e.hasAttribute("type")) && (d.type = g, ta(e, "type", g, o));
	}
	for (let a in r) {
		let u = r[a];
		if (f && a === "value" && u == null) {
			e.value = e.__value = "", d[a] = u;
			continue;
		}
		if (a === "class") {
			Ii(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", u, i, n?.[Ki], r[Ki]), d[a] = u, d[Ki] = r[Ki];
			continue;
		}
		if (a === "style") {
			Ri(e, u, n?.[qi], r[qi]), d[a] = u, d[qi] = r[qi];
			continue;
		}
		var _ = d[a];
		if (u !== _ || u === void 0 && e.hasAttribute(a)) {
			d[a] = u;
			var v = a[0] + a[1];
			if (v !== "$$") {
				if (v === "on") {
					let t = {}, n = "$$" + a, r = a.slice(2);
					var y = Yr(r);
					if (qr(r) && (r = r.slice(0, -7), t.capture = !0), !y && _) {
						if (u != null) continue;
						e.removeEventListener(r, d[n], t), d[n] = null;
					}
					if (y) Pr(r, e, u), Fr([r]);
					else if (u != null) {
						function i(e) {
							d[a].call(this, e);
						}
						d[n] = jr(r, e, i, t);
					}
				} else if (a === "style") ta(e, a, u);
				else if (a === "autofocus") pt(e, !!u);
				else if (!c && (a === "__value" || a === "value" && u != null)) e.value = e.__value = u;
				else if (a === "selected" && f) zi(e, u);
				else {
					var b = a;
					l || (b = Qr(b));
					var x = b === "defaultValue" || b === "defaultChecked";
					if (p && b === "defaultValue") continue;
					if (u == null && !c && !x) {
						if (s[a] = null, b === "value" || b === "checked") {
							let t = e, r = n === void 0;
							if (b === "value") {
								let e = t.defaultValue;
								t.removeAttribute(b), t.defaultValue = e, t.value = t.__value = r ? e : null;
							} else {
								let e = t.defaultChecked;
								t.removeAttribute(b), t.defaultChecked = e, t.checked = r ? e : !1;
							}
						} else e.removeAttribute(a);
					} else x || (c || typeof u != "string") && h.has(b) ? (e[b] = u, b in s && (s[b] = t)) : typeof u != "function" && ta(e, b, u, o);
				}
			}
		}
	}
	return u && Te(!0), d;
}
function q(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	vt(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === $i, l = !1;
		if (Rn(() => {
			var u = t(...n.map(B)), d = na(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && Bi(f, u.defaultValue), "value" in u && Hi(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || Un(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description === "@attach" && (!r || p !== r[t]) && (i[t] && Un(i[t]), i[t] = zn(() => Di(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Pn(() => {
				var e = r;
				"defaultValue" in e && Bi(u, e.defaultValue), Hi(u, e.value, !0), Ui(u);
			});
		}
		l = !0;
	});
}
function ra(e) {
	return e[me] ??= {
		[Ji]: e.nodeName.includes("-"),
		[Yi]: e.namespaceURI === n
	};
}
var ia = /* @__PURE__ */ new Map();
function aa(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ia.get(t);
	if (n) return n;
	ia.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = u(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = p(i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function oa(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	_t(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = sa(e) ? ca(a) : a, n(a), A !== null && r.add(A), await Sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (w && e.defaultValue !== e.value || Tr(t) == null && e.value) && (n(sa(e) ? ca(e.value) : e.value), A !== null && r.add(A)), In(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		sa(e) && n === ca(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function sa(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function ca(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function la(e, t) {
	return e === t || e?.[ue] === t;
}
function ua(e = rt(), t, n, r) {
	var i = Xe.r, a = z;
	return Pn(() => {
		var o, s;
		return In(() => {
			o = s, s = r?.() || [], Tr(() => {
				la(n(...s), e) || (t(e, ...s), o && la(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && la(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function da(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), g;
	let r = Tr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var fa = [];
function pa(e, t = g) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Me(e, t) && (e = t, n)) {
			let t = !fa.length;
			for (let t of r) t[1](), fa.push(t, e);
			if (t) {
				for (let e = 0; e < fa.length; e += 2) fa[e][0](fa[e + 1]);
				fa.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = g) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || g), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function ma(e) {
	let t;
	return da(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/store.js
var ha = !1;
function ga(e) {
	var t = ha;
	try {
		return ha = !1, [e(), ha];
	} finally {
		ha = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var _a = {
	get(e, t) {
		if (!e.exclude.has(t)) return e.props[t];
	},
	set(e, t) {
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		if (!e.exclude.has(t) && t in e.props) return {
			enumerable: !0,
			configurable: !0,
			value: e.props[t]
		};
	},
	has(e, t) {
		return !e.exclude.has(t) && t in e.props;
	},
	ownKeys(e) {
		return Reflect.ownKeys(e.props).filter((t) => !e.exclude.has(t));
	}
};
/*#__NO_SIDE_EFFECTS__*/
function J(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, _a);
}
var va = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (h(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			h(i) && (i = i());
			let a = l(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (h(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = l(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === ue || t === fe) return !1;
		for (let n of e.props) if (h(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (h(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function ya(...e) {
	return new Proxy({ props: e }, va);
}
function Y(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ St(r), B(u)) : (c && (c = !1, s = o ? Tr(r) : r), s);
	let f;
	if (a) {
		var p = ue in e || fe in e;
		f = l(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ga(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && He(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? St : Tt)(() => (v = !1, g()));
	a && B(y);
	var b = z;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? B(y) : i && a ? sn(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return $n && v || b.f & 16384 ? y.v : B(y);
	});
}
//#endregion
//#region packages/ui-kit/src/gesture/single-pointer-session.svelte.ts
function ba() {
	let e = /* @__PURE__ */ j(null), t = null;
	function n() {
		let n = Tr(() => B(e)), r = t;
		if (M(e, null), t = null, n !== null && r) try {
			r.hasPointerCapture(n) && r.releasePointerCapture(n);
		} catch {}
	}
	return {
		get id() {
			return B(e);
		},
		start(n, r = null) {
			if (B(e) !== null || n.button !== 0 || !n.isPrimary) return !1;
			M(e, n.pointerId, !0), t = r;
			try {
				r?.setPointerCapture(n.pointerId);
			} catch {}
			return !0;
		},
		owns(t) {
			return B(e) !== null && B(e) === t.pointerId;
		},
		end: n
	};
}
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
//#endregion
//#region packages/core/src/domain/preferences.ts
var xa = {
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
	currentPeriodHighlightEnabled: "chronos_preferences:current_period_highlight_enabled",
	visualThemeId: "chronos_preferences:visual_theme_id",
	locale: "chronos_preferences:locale"
};
//#endregion
//#region packages/core/src/algorithms/date.ts
function Sa(e) {
	let [t, n, r] = e.split("-");
	return `${t}/${n.padStart(2, "0")}/${r.padStart(2, "0")}`;
}
function Ca(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function wa(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
.2126 * Ta(15 / 255) + .7152 * Ta(23 / 255) + .0722 * Ta(42 / 255);
function Ta(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/types/services.ts
function Ea(e) {
	return { key: e };
}
var Da = Ea("analytics");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function Oa(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/mountable.ts
var ka = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
//#endregion
//#region packages/core/src/analytics/plugin-analytics.ts
function Aa(e, t) {
	return `plugin.${e}.${t}`;
}
function ja(e, t, n, r) {
	let i = e.tryService(Da);
	i && i.track(Aa(t, n), {
		...r,
		source: "plugin",
		plugin_id: t
	});
}
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function Ma(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Na() {
	return "1.2.9";
}
function Pa(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Ma(e.messages, e.nameKey),
		version: e.version ?? Na(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Ma(e.messages, e.descriptionKey) : void 0,
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
//#region packages/core/src/constants/storage-namespace.ts
function Fa(e) {
	let t = e.replace(/\/+$/, "") || "/", n = `chronos:${t}:`;
	return {
		prefix: n,
		databaseName: `${n}db`,
		localeCookie: `chronos_${encodeURIComponent(t)}_locale`,
		key: (e) => n + e
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/index-client.js
function Ia(e) {
	let t, n = ti((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return On() ? (n(), t) : ma(e);
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
//#region packages/ui-kit/src/schema-form/inputs/FileField.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Fr(["input"]), Fr(["change"]), Fr(["change"]), Fr(["change"]);
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/map.js
var La = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = fr || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return fr === this.#r ? /* @__PURE__ */ j(e) : Qt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return B(this.#t), !1;
		}
		return B(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				B(this.#t);
				return;
			}
		}
		return B(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), M(this.#n, super.size), an(o);
		else if (i !== t) {
			an(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && an(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), M(n, -1)), r && (M(this.#n, super.size), an(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			M(this.#n, 0);
			for (var t of e.values()) M(t, -1);
			an(this.#t), e.clear();
		}
	}
	#a() {
		B(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) B(n);
	}
	keys() {
		return B(this.#t), super.keys();
	}
	values() {
		return this.#a(), super.values();
	}
	entries() {
		return this.#a(), super.entries();
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	get size() {
		return B(this.#n), super.size;
	}
}, Ra = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = ti(t);
	}
	get current() {
		return this.#t(), this.#e();
	}
}, za = /\(.+\)/, Ba = /* @__PURE__ */ new Set([
	"all",
	"print",
	"screen",
	"and",
	"or",
	"not",
	"only"
]), Va = class extends Ra {
	constructor(e, t) {
		let n = za.test(e) || e.split(/[\s,]+/).some((e) => Ba.has(e.trim())) ? e : `(${e})`, r = window.matchMedia(n);
		super(() => r.matches, (e) => Mr(r, "change", e));
	}
};
//#endregion
//#region packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
ti((e) => {
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
}), Fr([
	"click",
	"pointerdown",
	"pointerup"
]), Fr(["change"]);
//#endregion
//#region packages/ui-kit/src/overlay/history-overlay.ts
var Ha = Symbol("overlay-lifecycle"), Ua = /* @__PURE__ */ new WeakMap();
function Wa(e) {
	let t, n = !1, r = !1, i = /* @__PURE__ */ new Set(), a = e.parent && Ua.get(e.parent);
	function o() {
		for (let e of i) e();
	}
	function s() {
		if (!r) return;
		r = !1;
		let n = t;
		t = void 0, n?.dispose(), o(), e.setOpen(!1);
	}
	let c = {
		syncOpenState(i) {
			if (!(n || i === r)) {
				if (r = i, i) t = e.port?.openOverlay(e.overlayId, () => {
					t = void 0, s();
				});
				else {
					let e = t;
					t = void 0, e?.close(), o();
				}
			}
		},
		dispose() {
			n || (n = !0, a?.delete(s), s(), i.clear());
		}
	};
	return Ua.set(c, i), a?.add(s), c;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/is.js
function Ga(e) {
	return typeof e == "function";
}
function Ka(e) {
	return typeof e == "object" && !!e;
}
var qa = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function Ja(e) {
	return e == null || qa.includes(typeof e) ? !0 : Array.isArray(e) ? e.every((e) => Ja(e)) : typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var Ya = Symbol("box"), Xa = Symbol("is-writable");
function X(e, t) {
	let n = /* @__PURE__ */ k(e);
	return t ? {
		[Ya]: !0,
		[Xa]: !0,
		get current() {
			return B(n);
		},
		set current(e) {
			t(e);
		}
	} : {
		[Ya]: !0,
		get current() {
			return e();
		}
	};
}
function Za(e) {
	return Ka(e) && Ya in e;
}
function Qa(e) {
	return Za(e) ? e : Ga(e) ? X(e) : $a(e);
}
function $a(e) {
	let t = /* @__PURE__ */ j(sn(e));
	return {
		[Ya]: !0,
		[Xa]: !0,
		get current() {
			return B(t);
		},
		set current(e) {
			M(t, e, !0);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
function eo(...e) {
	return function(t) {
		for (let n of e) if (n) {
			if (t.defaultPrevented) return;
			typeof n == "function" ? n.call(this, t) : n.current?.call(this, t);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/inline-style-parser@0.2.7/node_modules/inline-style-parser/esm/index.mjs
var to = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, no = /\n/g, ro = /^\s*/, io = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, ao = /^:\s*/, oo = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, so = /^[;\s]*/, co = /^\s+|\s+$/g, lo = "\n", uo = "/", fo = "*", po = "", mo = "comment", ho = "declaration";
function go(e, t) {
	if (typeof e != "string") throw TypeError("First argument must be a string");
	if (!e) return [];
	t ||= {};
	var n = 1, r = 1;
	function i(e) {
		var t = e.match(no);
		t && (n += t.length);
		var i = e.lastIndexOf(lo);
		r = ~i ? e.length - i : r + e.length;
	}
	function a() {
		var e = {
			line: n,
			column: r
		};
		return function(t) {
			return t.position = new o(e), l(), t;
		};
	}
	function o(e) {
		this.start = e, this.end = {
			line: n,
			column: r
		}, this.source = t.source;
	}
	o.prototype.content = e;
	function s(i) {
		var a = /* @__PURE__ */ Error(t.source + ":" + n + ":" + r + ": " + i);
		if (a.reason = i, a.filename = t.source, a.line = n, a.column = r, a.source = e, !t.silent) throw a;
	}
	function c(t) {
		var n = t.exec(e);
		if (n) {
			var r = n[0];
			return i(r), e = e.slice(r.length), n;
		}
	}
	function l() {
		c(ro);
	}
	function u(e) {
		var t;
		for (e ||= []; t = d();) t !== !1 && e.push(t);
		return e;
	}
	function d() {
		var t = a();
		if (uo == e.charAt(0) && fo == e.charAt(1)) {
			for (var n = 2; po != e.charAt(n) && (fo != e.charAt(n) || uo != e.charAt(n + 1));) ++n;
			if (n += 2, po === e.charAt(n - 1)) return s("End of comment missing");
			var o = e.slice(2, n - 2);
			return r += 2, i(o), e = e.slice(n), r += 2, t({
				type: mo,
				comment: o
			});
		}
	}
	function f() {
		var e = a(), t = c(io);
		if (t) {
			if (d(), !c(ao)) return s("property missing ':'");
			var n = c(oo), r = e({
				type: ho,
				property: _o(t[0].replace(to, po)),
				value: n ? _o(n[0].replace(to, po)) : po
			});
			return c(so), r;
		}
	}
	function p() {
		var e = [];
		u(e);
		for (var t; t = f();) t !== !1 && (e.push(t), u(e));
		return e;
	}
	return l(), p();
}
function _o(e) {
	return e ? e.replace(co, po) : po;
}
//#endregion
//#region node_modules/.pnpm/style-to-object@1.0.14/node_modules/style-to-object/esm/index.mjs
function vo(e, t) {
	let n = null;
	if (!e || typeof e != "string") return n;
	let r = go(e), i = typeof t == "function";
	return r.forEach((e) => {
		if (e.type !== "declaration") return;
		let { property: r, value: a } = e;
		i ? t(r, a, e) : a && (n ||= {}, n[r] = a);
	}), n;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/strings.js
var yo = /\d/, bo = [
	"-",
	"_",
	"/",
	"."
];
function xo(e = "") {
	if (!yo.test(e)) return e !== e.toLowerCase();
}
function So(e) {
	let t = [], n = "", r, i;
	for (let a of e) {
		let e = bo.includes(a);
		if (e === !0) {
			t.push(n), n = "", r = void 0;
			continue;
		}
		let o = xo(a);
		if (i === !1) {
			if (r === !1 && o === !0) {
				t.push(n), n = a, r = o;
				continue;
			}
			if (r === !0 && o === !1 && n.length > 1) {
				let e = n.at(-1);
				t.push(n.slice(0, Math.max(0, n.length - 1))), n = e + a, r = o;
				continue;
			}
		}
		n += a, r = o, i = e;
	}
	return t.push(n), t;
}
function Co(e) {
	return e ? So(e).map((e) => To(e)).join("") : "";
}
function wo(e) {
	return Eo(Co(e || ""));
}
function To(e) {
	return e ? e[0].toUpperCase() + e.slice(1) : "";
}
function Eo(e) {
	return e ? e[0].toLowerCase() + e.slice(1) : "";
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function Do(e) {
	if (!e) return {};
	let t = {};
	function n(e, n) {
		if (e.startsWith("-moz-") || e.startsWith("-webkit-") || e.startsWith("-ms-") || e.startsWith("-o-")) {
			t[Co(e)] = n;
			return;
		}
		if (e.startsWith("--")) {
			t[e] = n;
			return;
		}
		t[wo(e)] = n;
	}
	return vo(e, n), t;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
function Oo(...e) {
	return (...t) => {
		for (let n of e) typeof n == "function" && n(...t);
	};
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function ko(e, t) {
	let n = RegExp(e, "g");
	return (e) => {
		if (typeof e != "string") throw TypeError(`expected an argument of type string, but got ${typeof e}`);
		return e.match(n) ? e.replace(n, t) : e;
	};
}
var Ao = ko(/[A-Z]/, (e) => `-${e.toLowerCase()}`);
function jo(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`expected an argument of type object, but got ${typeof e}`);
	return Object.keys(e).map((t) => `${Ao(t)}: ${e[t]};`).join("\n");
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/style.js
function Mo(e = {}) {
	return jo(e).replace("\n", " ");
}
var No = new Set(/* @__PURE__ */ "onabort.onanimationcancel.onanimationend.onanimationiteration.onanimationstart.onauxclick.onbeforeinput.onbeforetoggle.onblur.oncancel.oncanplay.oncanplaythrough.onchange.onclick.onclose.oncompositionend.oncompositionstart.oncompositionupdate.oncontextlost.oncontextmenu.oncontextrestored.oncopy.oncuechange.oncut.ondblclick.ondrag.ondragend.ondragenter.ondragleave.ondragover.ondragstart.ondrop.ondurationchange.onemptied.onended.onerror.onfocus.onfocusin.onfocusout.onformdata.ongotpointercapture.oninput.oninvalid.onkeydown.onkeypress.onkeyup.onload.onloadeddata.onloadedmetadata.onloadstart.onlostpointercapture.onmousedown.onmouseenter.onmouseleave.onmousemove.onmouseout.onmouseover.onmouseup.onpaste.onpause.onplay.onplaying.onpointercancel.onpointerdown.onpointerenter.onpointerleave.onpointermove.onpointerout.onpointerover.onpointerup.onprogress.onratechange.onreset.onresize.onscroll.onscrollend.onsecuritypolicyviolation.onseeked.onseeking.onselect.onselectionchange.onselectstart.onslotchange.onstalled.onsubmit.onsuspend.ontimeupdate.ontoggle.ontouchcancel.ontouchend.ontouchmove.ontouchstart.ontransitioncancel.ontransitionend.ontransitionrun.ontransitionstart.onvolumechange.onwaiting.onwebkitanimationend.onwebkitanimationiteration.onwebkitanimationstart.onwebkittransitionend.onwheel".split("."));
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/merge-props.js
function Po(e) {
	return No.has(e);
}
function Z(...e) {
	let t = { ...e[0] };
	for (let n = 1; n < e.length; n++) {
		let r = e[n];
		if (r) {
			for (let e of Object.keys(r)) {
				let n = t[e], i = r[e], a = typeof n == "function", o = typeof i == "function";
				if (a && typeof o && Po(e)) t[e] = eo(n, i);
				else if (a && o) t[e] = Oo(n, i);
				else if (e === "class") {
					let r = Ja(n), a = Ja(i);
					r && a ? t[e] = ki(n, i) : r ? t[e] = ki(n) : a && (t[e] = ki(i));
				} else if (e === "style") {
					let r = typeof n == "object", a = typeof i == "object", o = typeof n == "string", s = typeof i == "string";
					if (r && a) t[e] = {
						...n,
						...i
					};
					else if (r && s) {
						let r = Do(i);
						t[e] = {
							...n,
							...r
						};
					} else if (o && a) t[e] = {
						...Do(n),
						...i
					};
					else if (o && s) {
						let r = Do(n), a = Do(i);
						t[e] = {
							...r,
							...a
						};
					} else r ? t[e] = n : a ? t[e] = i : o ? t[e] = n : s && (t[e] = i);
				} else t[e] = i === void 0 ? n : i;
			}
			for (let e of Object.getOwnPropertySymbols(r)) {
				let n = t[e], i = r[e];
				t[e] = i === void 0 ? n : i;
			}
		}
	}
	return typeof t.style == "object" && (t.style = Mo(t.style).replaceAll("\n", " ")), t.hidden === !1 && (t.hidden = void 0, delete t.hidden), t.disabled === !1 && (t.disabled = void 0, delete t.disabled), t;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/sr-only-styles.js
var Fo = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
	transform: "translateX(-100%)"
}, Io = Mo(Fo), Lo = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite_74812ad065cc5c525c7b0fb1abcd51d2/node_modules/runed/dist/internal/utils/dom.js
function Ro(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
new class {
	#e;
	#t;
	constructor(e = {}) {
		let { window: t = Lo, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = ti((e) => {
			let n = Mr(t, "focusin", e), r = Mr(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? Ro(this.#e) : null;
	}
}();
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite_74812ad065cc5c525c7b0fb1abcd51d2/node_modules/runed/dist/internal/utils/is.js
function zo(e) {
	return typeof e == "function";
}
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite_74812ad065cc5c525c7b0fb1abcd51d2/node_modules/runed/dist/utilities/context/context.js
var Bo = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e, this.#t = Symbol(e);
	}
	get key() {
		return this.#t;
	}
	exists() {
		return tt(this.#t);
	}
	get() {
		let e = $e(this.#t);
		if (e === void 0) throw Error(`Context "${this.#e}" not found`);
		return e;
	}
	getOr(e) {
		let t = $e(this.#t);
		return t === void 0 ? e : t;
	}
	set(e) {
		return et(this.#t, e);
	}
};
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite_74812ad065cc5c525c7b0fb1abcd51d2/node_modules/runed/dist/utilities/watch/watch.svelte.js
function Vo(e, t) {
	switch (e) {
		case "post":
			I(t);
			break;
		case "pre": jn(t);
	}
}
function Ho(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	Vo(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = Tr(() => n(t, o));
		return o = t, r;
	});
}
function Uo(e, t, n) {
	Ho(e, "post", t, n);
}
function Wo(e, t, n) {
	Ho(e, "pre", t, n);
}
Uo.pre = Wo;
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite_74812ad065cc5c525c7b0fb1abcd51d2/node_modules/runed/dist/internal/utils/get.js
function Go(e) {
	return zo(e) ? e() : e;
}
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite_74812ad065cc5c525c7b0fb1abcd51d2/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var Ko = class {
	#e = {
		width: 0,
		height: 0
	};
	#t = !1;
	#n;
	#r;
	#i;
	#a = /* @__PURE__ */ k(() => (B(this.#s)?.(), this.getSize().width));
	#o = /* @__PURE__ */ k(() => (B(this.#s)?.(), this.getSize().height));
	#s = /* @__PURE__ */ k(() => {
		let e = Go(this.#r);
		if (e) return ti((t) => {
			if (!this.#i) return;
			let n = new this.#i.ResizeObserver((e) => {
				this.#t = !0;
				for (let t of e) {
					let e = this.#n.box === "content-box" ? t.contentBoxSize : t.borderBoxSize, n = Array.isArray(e) ? e : [e];
					this.#e.width = n.reduce((e, t) => Math.max(e, t.inlineSize), 0), this.#e.height = n.reduce((e, t) => Math.max(e, t.blockSize), 0);
				}
				t();
			});
			return n.observe(e), () => {
				this.#t = !1, n.disconnect();
			};
		});
	});
	constructor(e, t = { box: "border-box" }) {
		this.#i = t.window ?? Lo, this.#n = t, this.#r = e, this.#e = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		let e = Go(this.#r);
		if (!e || !this.#i) return;
		let t = e.offsetWidth, n = e.offsetHeight;
		if (this.#n.box === "border-box") return {
			width: t,
			height: n
		};
		let r = this.#i.getComputedStyle(e), i = parseFloat(r.paddingLeft) + parseFloat(r.paddingRight), a = parseFloat(r.paddingTop) + parseFloat(r.paddingBottom), o = parseFloat(r.borderLeftWidth) + parseFloat(r.borderRightWidth), s = parseFloat(r.borderTopWidth) + parseFloat(r.borderBottomWidth);
		return {
			width: t - i - o,
			height: n - a - s
		};
	}
	getSize() {
		return this.#t ? this.#e : this.calculateSize() ?? this.#e;
	}
	get current() {
		return B(this.#s)?.(), this.getSize();
	}
	get width() {
		return B(this.#a);
	}
	get height() {
		return B(this.#o);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/on-destroy-effect.svelte.js
function qo(e) {
	I(() => () => {
		e();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function Jo(e) {
	Sr().then(e);
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/dom.js
var Yo = 1, Xo = 9, Zo = 11;
function Qo(e) {
	return Ka(e) && e.nodeType === Yo && typeof e.nodeName == "string";
}
function $o(e) {
	return Ka(e) && e.nodeType === Xo;
}
function es(e) {
	return Ka(e) && e.constructor?.name === "VisualViewport";
}
function ts(e) {
	return Ka(e) && e.nodeType !== void 0;
}
function ns(e) {
	return ts(e) && e.nodeType === Zo && "host" in e;
}
function rs(e, t) {
	if (!e || !t || !Qo(e) || !Qo(t)) return !1;
	let n = t.getRootNode?.();
	if (e === t || e.contains(t)) return !0;
	if (n && ns(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function is(e) {
	return $o(e) ? e : es(e) ? e.document : e?.ownerDocument ?? document;
}
function as(e) {
	return ns(e) ? as(e.host) : $o(e) ? e.defaultView ?? window : Qo(e) ? e.ownerDocument?.defaultView ?? window : window;
}
function os(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var ss = class {
	element;
	#e = /* @__PURE__ */ k(() => this.element.current ? this.element.current.getRootNode() ?? document : document);
	get root() {
		return B(this.#e);
	}
	set root(e) {
		M(this.#e, e);
	}
	constructor(e) {
		this.element = typeof e == "function" ? X(e) : e;
	}
	getDocument = () => is(this.root);
	getWindow = () => this.getDocument().defaultView ?? window;
	getActiveElement = () => os(this.root);
	isActiveElement = (e) => e === this.getActiveElement();
	getElementById(e) {
		return this.root.getElementById(e);
	}
	querySelector = (e) => this.root ? this.root.querySelector(e) : null;
	querySelectorAll = (e) => this.root ? this.root.querySelectorAll(e) : [];
	setTimeout = (e, t) => this.getWindow().setTimeout(e, t);
	clearTimeout = (e) => this.getWindow().clearTimeout(e);
};
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.1_@voidzer_439d438e8688373d978a0006681f86c0/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
function cs(e, t) {
	return { [mi()]: (n) => Za(e) ? (e.current = n, Tr(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e.current = null, t?.(null));
	}) : (e(n), Tr(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e(null), t?.(null));
	}) };
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/attrs.js
function ls(e) {
	return e ? "true" : "false";
}
function us(e) {
	return e ? "true" : void 0;
}
function Q(e) {
	return e ? "" : void 0;
}
function ds(e) {
	return e ? "open" : "closed";
}
function fs(e) {
	return e === "starting" ? { "data-starting-style": "" } : e === "ending" ? { "data-ending-style": "" } : {};
}
var ps = class {
	#e;
	#t;
	attrs;
	constructor(e) {
		this.#e = e.getVariant ? e.getVariant() : null, this.#t = this.#e ? `data-${this.#e}-` : `data-${e.component}-`, this.getAttr = this.getAttr.bind(this), this.selector = this.selector.bind(this), this.attrs = Object.fromEntries(e.parts.map((e) => [e, this.getAttr(e)]));
	}
	getAttr(e, t) {
		return t ? `data-${t}-${e}` : `${this.#t}${e}`;
	}
	selector(e, t) {
		return `[${this.getAttr(e, t)}]`;
	}
};
function ms(e) {
	let t = new ps(e);
	return {
		...t.attrs,
		selector: t.selector,
		getAttr: t.getAttr
	};
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/kbd-constants.js
var hs = "ArrowDown", gs = "ArrowLeft", _s = "ArrowRight", vs = "ArrowUp", ys = "Enter", bs = typeof document < "u", xs = Ss();
function Ss() {
	return bs && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Cs(e) {
	return e instanceof HTMLElement;
}
function ws(e) {
	return e instanceof Element;
}
function Ts(e) {
	return e instanceof Element || e instanceof SVGElement;
}
function Es(e) {
	return e === null;
}
function Ds(e) {
	return e.pointerType === "touch";
}
function Os(e) {
	return e !== null;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/animations-complete.js
var ks = class {
	#e;
	#t = null;
	#n = null;
	#r = 0;
	constructor(e) {
		this.#e = e, qo(() => this.#i());
	}
	#i() {
		this.#t !== null && (window.cancelAnimationFrame(this.#t), this.#t = null), this.#n?.disconnect(), this.#n = null, this.#r++;
	}
	run(e) {
		this.#i();
		let t = this.#e.ref.current;
		if (!t) return;
		if (typeof t.getAnimations != "function") {
			this.#a(e);
			return;
		}
		let n = this.#r, r = () => {
			n === this.#r && this.#a(e);
		}, i = () => {
			if (n !== this.#r) return;
			let e = t.getAnimations();
			if (e.length === 0) {
				r();
				return;
			}
			Promise.all(e.map((e) => e.finished)).then(() => {
				r();
			}).catch(() => {
				if (n === this.#r) {
					if (t.getAnimations().some((e) => e.pending || e.playState !== "finished")) {
						i();
						return;
					}
					r();
				}
			});
		}, a = () => {
			this.#t = window.requestAnimationFrame(() => {
				this.#t = null, i();
			});
		};
		if (!this.#e.afterTick.current) {
			a();
			return;
		}
		this.#t = window.requestAnimationFrame(() => {
			this.#t = null;
			let e = "data-starting-style";
			if (!t.hasAttribute(e)) {
				a();
				return;
			}
			this.#n = new MutationObserver(() => {
				n === this.#r && (t.hasAttribute(e) || (this.#n?.disconnect(), this.#n = null, a()));
			}), this.#n.observe(t, {
				attributes: !0,
				attributeFilter: [e]
			});
		});
	}
	#a(e) {
		let t = () => {
			e();
		};
		this.#e.afterTick ? Jo(t) : t();
	}
}, As = class {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ j(!1);
	#i = /* @__PURE__ */ j(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, M(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new ks({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), qo(() => this.#s()), Uo(() => this.#e.open.current, (e) => {
			if (!this.#a) {
				this.#a = !0;
				return;
			}
			if (this.#s(), !e && this.#e.shouldSkipExitAnimation?.()) {
				M(this.#r, !1), M(this.#i, void 0), this.#e.onComplete?.();
				return;
			}
			if (e && M(this.#r, !0), M(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && M(this.#i, void 0);
			})), !this.#t) {
				e || M(this.#r, !1), M(this.#i, void 0), this.#e.onComplete?.();
				return;
			}
			this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || M(this.#r, !1), M(this.#i, void 0), this.#e.onComplete?.());
			});
		});
	}
	get shouldRender() {
		return B(this.#r);
	}
	get transitionStatus() {
		return B(this.#i);
	}
	#s() {
		this.#o !== null && (window.cancelAnimationFrame(this.#o), this.#o = null);
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/noop.js
function $() {}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/create-id.js
function js(e, t) {
	return t === void 0 ? `bits-${e}` : `bits-${e}-${t}`;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
var Ms = ms({
	component: "dialog",
	parts: [
		"content",
		"trigger",
		"overlay",
		"title",
		"description",
		"close",
		"cancel",
		"action"
	]
}), Ns = new Bo("Dialog.Root | AlertDialog.Root"), Ps = class e {
	static create(t) {
		let n = Ns.getOr(null);
		return Ns.set(new e(t, n));
	}
	opts;
	#e = /* @__PURE__ */ j(null);
	get triggerNode() {
		return B(this.#e);
	}
	set triggerNode(e) {
		M(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ j(null);
	get contentNode() {
		return B(this.#t);
	}
	set contentNode(e) {
		M(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ j(null);
	get overlayNode() {
		return B(this.#n);
	}
	set overlayNode(e) {
		M(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ j(null);
	get descriptionNode() {
		return B(this.#r);
	}
	set descriptionNode(e) {
		M(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ j(void 0);
	get contentId() {
		return B(this.#i);
	}
	set contentId(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(void 0);
	get titleId() {
		return B(this.#a);
	}
	set titleId(e) {
		M(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ j(void 0);
	get triggerId() {
		return B(this.#o);
	}
	set triggerId(e) {
		M(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ j(void 0);
	get descriptionId() {
		return B(this.#s);
	}
	set descriptionId(e) {
		M(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ j(null);
	get cancelNode() {
		return B(this.#c);
	}
	set cancelNode(e) {
		M(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ j(0);
	get nestedOpenCount() {
		return B(this.#l);
	}
	set nestedOpenCount(e) {
		M(this.#l, e, !0);
	}
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(e, t) {
		this.opts = e, this.parent = t, this.depth = t ? t.depth + 1 : 0, this.handleOpen = this.handleOpen.bind(this), this.handleClose = this.handleClose.bind(this), this.contentPresence = new As({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			enabled: !0,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new As({
			ref: X(() => this.overlayNode),
			open: this.opts.open,
			enabled: !0
		}), Uo(() => this.opts.open.current, (e) => {
			this.parent && (e ? this.parent.incrementNested() : this.parent.decrementNested());
		}, { lazy: !0 }), qo(() => {
			this.opts.open.current && this.parent?.decrementNested();
		});
	}
	handleOpen() {
		this.opts.open.current || (this.opts.open.current = !0);
	}
	handleClose() {
		this.opts.open.current && (this.opts.open.current = !1);
	}
	getBitsAttr = (e) => Ms.getAttr(e, this.opts.variant.current);
	incrementNested() {
		this.nestedOpenCount++, this.parent?.incrementNested();
	}
	decrementNested() {
		this.nestedOpenCount !== 0 && (this.nestedOpenCount--, this.parent?.decrementNested());
	}
	#u = /* @__PURE__ */ k(() => ({ "data-state": ds(this.opts.open.current) }));
	get sharedProps() {
		return B(this.#u);
	}
	set sharedProps(e) {
		M(this.#u, e);
	}
}, Fs = class e {
	static create(t) {
		return new e(t, Ns.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.titleId = this.opts.id.current, this.attachment = cs(this.opts.ref), Uo.pre(() => this.opts.id.current, (e) => {
			this.root.titleId = e;
		});
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, Is = class e {
	static create(t) {
		return new e(t, Ns.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.descriptionId = this.opts.id.current, this.attachment = cs(this.opts.ref, (e) => {
			this.root.descriptionNode = e;
		}), Uo.pre(() => this.opts.id.current, (e) => {
			this.root.descriptionId = e;
		});
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, Ls = class e {
	static create(t) {
		return new e(t, Ns.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref, (e) => {
			this.root.contentNode = e, this.root.contentId = e?.id;
		});
	}
	#e = /* @__PURE__ */ k(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return B(this.#e);
	}
	set snippetProps(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
		"aria-modal": "true",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[this.root.getBitsAttr("content")]: "",
		style: {
			pointerEvents: "auto",
			outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0,
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount,
			contain: "layout style"
		},
		tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
		"data-nested-open": Q(this.root.nestedOpenCount > 0),
		"data-nested": Q(this.root.parent !== null),
		...fs(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
}, Rs = class e {
	static create(t) {
		return new e(t, Ns.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref, (e) => this.root.overlayNode = e);
	}
	#e = /* @__PURE__ */ k(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return B(this.#e);
	}
	set snippetProps(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": Q(this.root.nestedOpenCount > 0),
		"data-nested": Q(this.root.parent !== null),
		...fs(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
}, zs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"level"
]), Bs = /* @__PURE__ */ V("<div><!></div>");
function Vs(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = Y(t, "level", 3, 2), o = /* @__PURE__ */ J(t, zs), s = Fs.create({
		id: X(() => r()),
		level: X(() => a()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props));
	var l = H(), u = P(l), d = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(c) })), U(e, n);
	}, f = (e) => {
		var n = Bs();
		q(n, () => ({ ...B(c) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), U(e, l), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Hs(e, t) {
	var n = H();
	gi(P(n), () => t.children, (e) => {
		var n = H();
		W(P(n), () => t.children ?? g), U(e, n);
	}), U(e, n);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var Us = new Bo("BitsConfig");
function Ws() {
	let e = new Gs(null, {});
	return Us.getOr(e).opts;
}
var Gs = class {
	opts;
	constructor(e, t) {
		let n = Ks(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function Ks(e, t) {
	return (n) => X(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function qs(e, t) {
	return (n) => {
		let r = Ws();
		return X(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var Js = qs((e) => e.defaultLocale, "en"), Ys = qs((e) => e.defaultPortalTo, "body");
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Xs(e, t) {
	D(t, !0);
	let n = Ys(() => t.to), r = nt(), i = /* @__PURE__ */ k(a);
	function a() {
		if (!bs || t.disabled) return null;
		let e = null;
		return e = typeof n.current == "string" ? document.querySelector(n.current) : n.current, e;
	}
	let o;
	function s() {
		o &&= (ui(o), null);
	}
	Uo([() => B(i), () => t.disabled], ([e, n]) => {
		if (!e || n) {
			s();
			return;
		}
		return o = oi(Hs, {
			target: e,
			props: { children: t.children },
			context: r
		}), () => {
			s();
		};
	});
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.children ?? g), U(e, n);
	};
	G(l, (e) => {
		t.disabled && e(u);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/debounce.js
function Zs(e, t = 500) {
	let n = null, r = (...r) => {
		n !== null && clearTimeout(n), n = setTimeout(() => {
			e(...r);
		}, t);
	};
	return r.destroy = () => {
		n !== null && (clearTimeout(n), n = null);
	}, r;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/elements.js
function Qs(e, t) {
	return e === t || e.contains(t);
}
function $s(e) {
	return e?.ownerDocument ?? document;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/dom.js
function ec(e, t) {
	let { clientX: n, clientY: r } = e, i = t.getBoundingClientRect();
	return n < i.left || n > i.right || r < i.top || r > i.bottom;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/menu/context-menu-attributes.js
var tc = "data-context-menu-trigger", nc = "data-context-menu-content";
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var rc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	#e;
	#t;
	#n = { pointerdown: !1 };
	#r = !1;
	#i = null;
	#a = !1;
	#o = void 0;
	#s;
	#c = $;
	#l = !1;
	constructor(e) {
		this.opts = e, this.#t = e.interactOutsideBehavior, this.#e = e.onInteractOutside, this.#s = e.onFocusOutside;
		let t = $, n = null, r = () => {
			n = null, this.#v(), globalThis.bitsDismissableLayers.delete(this), this.#p.destroy(), this.#c(), t();
		};
		Uo([() => this.opts.enabled.current, () => this.opts.ref.current], ([e, i]) => {
			let a = e ? i : null;
			n !== a && (r(), a && (n = a, this.#o = $s(a), globalThis.bitsDismissableLayers.set(this, this.#t), t = this.#d()));
		}), qo(() => {
			this.#l = !0, r();
		});
	}
	#u = (e) => {
		e.defaultPrevented || this.#l || !this.opts.ref.current || Jo(() => {
			this.#l || this.opts.ref.current && !this.#_(e.target) && e.target && !this.#a && this.#s.current?.(e);
		});
	};
	#d() {
		let e = this.#o, t = (e) => {
			Tr(() => {
				this.#m(e), this.#g(e);
			});
		}, n = (e) => {
			e.cancelBubble || e !== this.#i || (this.#h(e), this.#p(e));
		};
		return e.addEventListener("pointerdown", t, !0), e.addEventListener("pointerdown", n), Oo(() => e.removeEventListener("pointerdown", t, !0), () => e.removeEventListener("pointerdown", n), Mr(e, "focusin", this.#u));
	}
	#f = (e) => {
		let t = e;
		t.defaultPrevented && (t = sc(e)), this.#e.current(e);
	};
	#p = Zs((e) => {
		if (!this.opts.ref.current) {
			this.#c();
			return;
		}
		let t = this.opts.isValidEvent.current(e, this.opts.ref.current) || oc(e, this.opts.ref.current);
		if (!this.#r || this.#y() || !t) {
			this.#c();
			return;
		}
		let n = e;
		if (n.defaultPrevented && (n = sc(n)), this.#t.current !== "close" && this.#t.current !== "defer-otherwise-close") {
			this.#c();
			return;
		}
		e.pointerType === "touch" ? (this.#c(), this.#c = Mr(this.#o, "click", this.#f, { once: !0 })) : this.#e.current(n);
	}, 10);
	#m = (e) => {
		this.#n[e.type] = !0;
	};
	#h = (e) => {
		this.#n[e.type] = !1;
	};
	#g = (e) => {
		this.#i = e, this.opts.ref.current && (this.#r = ac(this.opts.ref.current));
	};
	#_ = (e) => this.opts.ref.current ? Qs(this.opts.ref.current, e) : !1;
	#v = () => {
		for (let e in this.#n) this.#n[e] = !1;
		this.#r = !1, this.#i = null;
	};
	#y() {
		return Object.values(this.#n).some(Boolean);
	}
	#b = () => {
		this.#a = !0;
	};
	#x = () => {
		this.#a = !1;
	};
	props = {
		onfocuscapture: this.#b,
		onblurcapture: this.#x
	};
};
function ic(e = [...globalThis.bitsDismissableLayers]) {
	return e.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
}
function ac(e) {
	let t = [...globalThis.bitsDismissableLayers], n = ic(t);
	if (n) return n[0].opts.ref.current === e;
	let [r] = t[0];
	return r.opts.ref.current === e;
}
function oc(e, t) {
	let n = e.target;
	if (!Ts(n)) return !1;
	let r = !!n.closest(`[${tc}]`), i = !!t.closest(`[${nc}]`);
	return "button" in e && e.button > 0 && !r ? !1 : "button" in e && e.button === 0 && r && i ? !0 : r && i ? !1 : $s(n).documentElement.contains(n) && !Qs(t, n) && ec(e, t);
}
function sc(e) {
	let t = e.currentTarget, n = e.target, r;
	r = e instanceof PointerEvent ? new PointerEvent(e.type, e) : new PointerEvent("pointerdown", e);
	let i = !1;
	return new Proxy(r, { get: (r, a) => a === "currentTarget" ? t : a === "target" ? n : a === "preventDefault" ? () => {
		i = !0, typeof r.preventDefault == "function" && r.preventDefault();
	} : a === "defaultPrevented" ? i : a in r ? r[a] : e[a] });
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function cc(e, t) {
	D(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "onInteractOutside", 3, $), i = Y(t, "onFocusOutside", 3, $), a = Y(t, "isValidEvent", 3, () => !1), o = rc.create({
		id: X(() => t.id),
		interactOutsideBehavior: X(() => n()),
		onInteractOutside: X(() => r()),
		enabled: X(() => t.enabled),
		onFocusOutside: X(() => i()),
		isValidEvent: X(() => a()),
		ref: t.ref
	});
	var s = H();
	W(P(s), () => t.children ?? g, () => ({ props: o.props })), U(e, s), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var lc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	constructor(e) {
		this.opts = e, this.domContext = new ss(this.opts.ref);
		let t = $;
		Uo(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => Mr(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
	#t = (e) => {
		if (e.key !== "Escape" || !uc(this)) return;
		let t = new KeyboardEvent(e.type, e);
		e.preventDefault();
		let n = this.opts.escapeKeydownBehavior.current;
		(n === "close" || n === "defer-otherwise-close") && this.opts.onEscapeKeydown.current(t);
	};
};
function uc(e) {
	let t = [...globalThis.bitsEscapeLayers], n = t.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
	if (n) return n[0] === e;
	let [r] = t[0];
	return r === e;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function dc(e, t) {
	D(t, !0);
	let n = Y(t, "escapeKeydownBehavior", 3, "close"), r = Y(t, "onEscapeKeydown", 3, $);
	lc.create({
		escapeKeydownBehavior: X(() => n()),
		onEscapeKeydown: X(() => r()),
		enabled: X(() => t.enabled),
		ref: t.ref
	});
	var i = H();
	W(P(i), () => t.children ?? g), U(e, i), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var fc = class e {
	static instance;
	#e = $a([]);
	#t = /* @__PURE__ */ new WeakMap();
	#n = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		return this.instance ||= new e(), this.instance;
	}
	register(e) {
		let t = this.getActive();
		t && t !== e && t.pause();
		let n = document.activeElement;
		n && n !== document.body && this.#n.set(e, n), this.#e.current = this.#e.current.filter((t) => t !== e), this.#e.current.unshift(e);
	}
	unregister(e) {
		this.#e.current = this.#e.current.filter((t) => t !== e);
		let t = this.getActive();
		t && t.resume();
	}
	getActive() {
		return this.#e.current[0];
	}
	setFocusMemory(e, t) {
		this.#t.set(e, t);
	}
	getFocusMemory(e) {
		return this.#t.get(e);
	}
	isActiveScope(e) {
		return this.getActive() === e;
	}
	setPreFocusMemory(e, t) {
		this.#n.set(e, t);
	}
	getPreFocusMemory(e) {
		return this.#n.get(e);
	}
	clearPreFocusMemory(e) {
		this.#n.delete(e);
	}
}, pc = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"area[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
], mc = /* #__PURE__ */ pc.join(","), hc = typeof Element > "u", gc = hc ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, _c = !hc && Element.prototype.getRootNode ? function(e) {
	return e?.getRootNode?.call(e);
} : function(e) {
	return e?.ownerDocument;
}, vc = function(e, t) {
	t === void 0 && (t = !0);
	var n = e?.getAttribute?.call(e, "inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : vc(e.parentNode));
}, yc = function(e) {
	var t = e?.getAttribute?.call(e, "contenteditable");
	return t === "" || t === "true";
}, bc = function(e, t, n) {
	if (vc(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(mc));
	return t && gc.call(e, mc) && r.unshift(e), r = r.filter(n), r;
}, xc = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!vc(a, !1)) {
			if (a.tagName === "SLOT") {
				var o = a.assignedElements(), s = xc(o.length ? o : a.children, !0, n);
				n.flatten ? r.push.apply(r, s) : r.push({
					scopeParent: a,
					candidates: s
				});
			} else {
				gc.call(a, mc) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
				var c = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), l = !vc(c, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
				if (c && l) {
					var u = xc(c === !0 ? a.children : c.children, !0, n);
					n.flatten ? r.push.apply(r, u) : r.push({
						scopeParent: a,
						candidates: u
					});
				} else i.unshift.apply(i, a.children);
			}
		}
	}
	return r;
}, Sc = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, Cc = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || yc(e)) && !Sc(e) ? 0 : e.tabIndex;
}, wc = function(e, t) {
	var n = Cc(e);
	return n < 0 && t && !Sc(e) ? 0 : n;
}, Tc = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, Ec = function(e) {
	return e.tagName === "INPUT";
}, Dc = function(e) {
	return Ec(e) && e.type === "hidden";
}, Oc = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, kc = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, Ac = function(e) {
	if (!e.name) return !0;
	var t = e.form || _c(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = kc(r, e.form);
	return !i || i === e;
}, jc = function(e) {
	return Ec(e) && e.type === "radio";
}, Mc = function(e) {
	return jc(e) && !Ac(e);
}, Nc = function(e) {
	var t = e && _c(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = _c(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, Pc = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, Fc = function(e, t) {
	var n = t.displayCheck, r = t.getShadowRoot;
	if (n === "full-native" && "checkVisibility" in e) return !e.checkVisibility({
		checkOpacity: !1,
		opacityProperty: !1,
		contentVisibilityAuto: !0,
		visibilityProperty: !0,
		checkVisibilityCSS: !0
	});
	var i = getComputedStyle(e).visibility;
	if (i === "hidden" || i === "collapse") return !0;
	var a = gc.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (gc.call(a, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var o = e; e;) {
				var s = e.parentElement, c = _c(e);
				if (s && !s.shadowRoot && r(s) === !0) return Pc(e);
				e = e.assignedSlot ? e.assignedSlot : !s && c !== e.ownerDocument ? c.host : s;
			}
			e = o;
		}
		if (Nc(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return Pc(e);
	return !1;
}, Ic = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return gc.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, Lc = function(e, t) {
	return !(t.disabled || Dc(t) || Fc(t, e) || Oc(t) || Ic(t));
}, Rc = function(e, t) {
	return !(Mc(t) || Cc(t) < 0 || !Lc(e, t));
}, zc = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, Bc = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = wc(a, i), s = i ? Bc(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(Tc).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, Vc = function(e, t) {
	return t ||= {}, Bc(t.getShadowRoot ? xc([e], t.includeContainer, {
		filter: Rc.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: zc
	}) : bc(e, t.includeContainer, Rc.bind(null, t)));
}, Hc = function(e, t) {
	return t ||= {}, t.getShadowRoot ? xc([e], t.includeContainer, {
		filter: Lc.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : bc(e, t.includeContainer, Lc.bind(null, t));
}, Uc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return gc.call(e, mc) !== !1 && Rc(t, e);
}, Wc = /* #__PURE__ */ pc.concat("iframe:not([inert]):not([inert] *)").join(","), Gc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return gc.call(e, Wc) !== !1 && Lc(t, e);
}, Kc = class e {
	#e = !1;
	#t = null;
	#n = fc.getInstance();
	#r = [];
	#i;
	constructor(e) {
		this.#i = e;
	}
	get paused() {
		return this.#e;
	}
	pause() {
		this.#e = !0;
	}
	resume() {
		this.#e = !1;
	}
	#a() {
		for (let e of this.#r) e();
		this.#r = [];
	}
	mount(e) {
		this.#t && this.unmount(), this.#t = e, this.#n.register(this), this.#c(), this.#o();
	}
	unmount() {
		this.#t &&= (this.#a(), this.#s(), this.#n.unregister(this), this.#n.clearPreFocusMemory(this), null);
	}
	#o() {
		if (!this.#t) return;
		let e = new CustomEvent("focusScope.onOpenAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		this.#i.onOpenAutoFocus.current(e), e.defaultPrevented || requestAnimationFrame(() => {
			if (!this.#t || this.#e || !this.#n.isActiveScope(this) || this.#t.contains(this.#t.ownerDocument.activeElement)) return;
			let e = this.#u();
			e ? (e.focus(), this.#n.setFocusMemory(this, e)) : this.#t.focus();
		});
	}
	#s() {
		let e = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		if (this.#i.onCloseAutoFocus.current?.(e), !e.defaultPrevented) {
			let e = this.#n.getPreFocusMemory(this);
			if (e && document.contains(e)) try {
				e.focus();
			} catch {
				document.body.focus();
			}
		}
	}
	#c() {
		if (!this.#t || !this.#i.trap.current) return;
		let e = this.#t, t = e.ownerDocument;
		this.#r.push(Mr(t, "focusin", (t) => {
			if (this.#e || !this.#n.isActiveScope(this)) return;
			let n = t.target;
			if (n) {
				if (e.contains(n)) this.#n.setFocusMemory(this, n);
				else {
					let n = this.#n.getFocusMemory(this);
					if (n && e.contains(n) && Gc(n)) t.preventDefault(), n.focus();
					else {
						let t = this.#u(), n = this.#d()[0];
						(t || n || e).focus();
					}
				}
			}
		}, { capture: !0 }), Mr(e, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let n = this.#l();
			if (n.length === 0) return;
			let r = n[0], i = n[n.length - 1];
			!e.shiftKey && t.activeElement === i ? (e.preventDefault(), r.focus()) : e.shiftKey && t.activeElement === r && (e.preventDefault(), i.focus());
		}));
		let n = new MutationObserver(() => {
			let t = this.#n.getFocusMemory(this);
			if (t && !e.contains(t)) {
				let t = this.#u(), n = this.#d()[0], r = t || n;
				r ? (r.focus(), this.#n.setFocusMemory(this, r)) : e.focus();
			}
		});
		n.observe(e, {
			childList: !0,
			subtree: !0
		}), this.#r.push(() => n.disconnect());
	}
	#l() {
		return this.#t ? Vc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	#u() {
		return this.#l()[0] || null;
	}
	#d() {
		return this.#t ? Hc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	static use(t) {
		let n = null;
		return Uo([() => t.ref.current, () => t.enabled.current], ([r, i]) => {
			r && i ? (n ||= new e(t), n.mount(r)) : n &&= (n.unmount(), null);
		}), qo(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function qc(e, t) {
	D(t, !0);
	let n = Y(t, "enabled", 3, !1), r = Y(t, "trapFocus", 3, !1), i = Y(t, "loop", 3, !1), a = Y(t, "onCloseAutoFocus", 3, $), o = Y(t, "onOpenAutoFocus", 3, $), s = Kc.use({
		enabled: X(() => n()),
		trap: X(() => r()),
		loop: i(),
		onCloseAutoFocus: X(() => a()),
		onOpenAutoFocus: X(() => o()),
		ref: t.ref
	});
	var c = H();
	W(P(c), () => t.focusScope ?? g, () => ({ props: s.props })), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var Jc = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var Yc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	#e = $;
	#t = !1;
	#n = Jc;
	#r = Jc;
	constructor(e) {
		this.opts = e, this.domContext = new ss(e.ref);
		let t = $;
		Uo(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([e, n, r]) => (this.#t = e, this.#n = n, this.#r = r, e && (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled), t(), t = this.#i()), () => {
			this.#t = !1, t(), this.#s(), globalThis.bitsTextSelectionLayers.delete(this);
		}));
	}
	#i() {
		return Oo(Mr(this.domContext.getDocument(), "pointerdown", this.#o), Mr(this.domContext.getDocument(), "pointerup", this.#a));
	}
	#a = (e) => {
		this.#s(), !e.defaultPrevented && this.#r(e);
	};
	#o = (e) => {
		if (!this.#t) return;
		this.#s();
		let t = this.opts.ref.current, n = e.target;
		Cs(t) && Cs(n) && $c(this) && rs(t, n) && (this.#n(e), !e.defaultPrevented && (this.#e = Zc(t, this.domContext.getDocument().body)));
	};
	#s = () => {
		this.#e(), this.#e = $;
	};
}, Xc = (e) => e.style.userSelect || e.style.webkitUserSelect;
function Zc(e, t) {
	let n = Xc(t), r = Xc(e);
	return Qc(t, "none"), Qc(e, "text"), () => {
		Qc(t, n), Qc(e, r);
	};
}
function Qc(e, t) {
	e.style.userSelect = t, e.style.webkitUserSelect = t;
}
function $c(e) {
	let t = [...globalThis.bitsTextSelectionLayers];
	if (!t.length) return !1;
	let n = t.at(-1);
	return n ? n[0] === e : !1;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function el(e, t) {
	D(t, !0);
	let n = Y(t, "preventOverflowTextSelection", 3, !0), r = Y(t, "onPointerDown", 3, $), i = Y(t, "onPointerUp", 3, $);
	Yc.create({
		id: X(() => t.id),
		onPointerDown: X(() => r()),
		onPointerUp: X(() => i()),
		enabled: X(() => t.enabled && n()),
		ref: t.ref
	});
	var a = H();
	W(P(a), () => t.children ?? g), U(e, a), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
function tl(e = "bits") {
	return globalThis.bitsIdCounter.current++, `${e}-${globalThis.bitsIdCounter.current}`;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var nl = class {
	#e;
	#t = 0;
	#n = /* @__PURE__ */ j();
	#r;
	constructor(e) {
		this.#e = e;
	}
	#i() {
		--this.#t, this.#r && this.#t <= 0 && (this.#r(), M(this.#n, void 0), this.#r = void 0);
	}
	get(...e) {
		return this.#t += 1, B(this.#n) === void 0 && (this.#r = Mn(() => {
			M(this.#n, this.#e(...e), !0);
		})), I(() => () => {
			this.#i();
		}), B(this.#n);
	}
}, rl = new La(), il = /* @__PURE__ */ j(null), al = null, ol = null, sl = !1, cl = X(() => {
	for (let e of rl.values()) if (e) return !0;
	return !1;
}), ll = null, ul = new nl(() => {
	function e(e) {
		e.body.setAttribute("style", B(il) ?? ""), e.body.style.removeProperty("--scrollbar-width"), xs && al?.(), M(il, null);
	}
	function t() {
		ol !== null && (window.clearTimeout(ol), ol = null);
	}
	function n(e, n) {
		t(), sl = !0, ll = Date.now();
		let r = ll, i = () => {
			ol = null, ll === r && (fl(rl) ? sl = !1 : (sl = !1, n()));
		}, a = e === null ? 24 : e;
		ol = window.setTimeout(i, a);
	}
	function r() {
		B(il) === null && rl.size === 0 && !sl && M(il, document.body.getAttribute("style"), !0);
	}
	return Uo(() => cl.current, () => {
		if (!cl.current) return;
		r(), sl = !1;
		let e = getComputedStyle(document.documentElement), t = getComputedStyle(document.body), n = e.scrollbarGutter?.includes("stable") || t.scrollbarGutter?.includes("stable"), i = window.innerWidth - document.documentElement.clientWidth, a = {
			padding: Number.parseInt(t.paddingRight ?? "0", 10) + i,
			margin: Number.parseInt(t.marginRight ?? "0", 10)
		};
		i > 0 && !n && (document.body.style.paddingRight = `${a.padding}px`, document.body.style.marginRight = `${a.margin}px`, document.body.style.setProperty("--scrollbar-width", `${i}px`)), document.body.style.overflow = "hidden", xs && (al = Mr(document, "touchmove", (e) => {
			e.target === document.documentElement && (e.touches.length > 1 || e.preventDefault());
		}, { passive: !1 })), Jo(() => {
			document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
		});
	}), qo(() => () => {
		al?.();
	}), {
		get lockMap() {
			return rl;
		},
		resetBodyStyle: e,
		scheduleCleanupIfNoNewLocks: n,
		cancelPendingCleanup: t,
		ensureInitialStyleCaptured: r
	};
}), dl = class {
	#e = tl();
	#t;
	#n = () => null;
	#r;
	locked;
	constructor(e, t = () => null) {
		this.#t = e, this.#n = t, this.#r = ul.get(), this.#r && (this.#r.cancelPendingCleanup(), this.#r.ensureInitialStyleCaptured(), this.#r.lockMap.set(this.#e, this.#t ?? !1), this.locked = X(() => this.#r.lockMap.get(this.#e) ?? !1, (e) => this.#r.lockMap.set(this.#e, e)), qo(() => {
			if (this.#r.lockMap.delete(this.#e), fl(this.#r.lockMap)) return;
			let e = this.#n(), t = document;
			this.#r.scheduleCleanupIfNoNewLocks(e, () => {
				this.#r.resetBodyStyle(t);
			});
		}));
	}
};
function fl(e) {
	for (let [t, n] of e) if (n) return !0;
	return !1;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function pl(e, t) {
	D(t, !0);
	let n = Y(t, "preventScroll", 3, !0), r = Y(t, "restoreScrollDelay", 3, null);
	n() && new dl(n(), () => r()), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
var ml = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"forceMount",
	"child",
	"children",
	"ref"
]), hl = /* @__PURE__ */ V("<div><!></div>");
function gl(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "forceMount", 3, !1), a = Y(t, "ref", 15, null), o = /* @__PURE__ */ J(t, ml), s = Rs.create({
		id: X(() => r()),
		ref: X(() => a(), (e) => a(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props));
	var l = H(), u = P(l), d = (e) => {
		var n = H(), r = P(n), i = (e) => {
			var n = H(), r = P(n);
			{
				let e = /* @__PURE__ */ k(() => ({
					props: Z(B(c)),
					...s.snippetProps
				}));
				W(r, () => t.child, () => B(e));
			}
			U(e, n);
		}, a = (e) => {
			var n = hl();
			q(n, (e) => ({ ...e }), [() => Z(B(c))]), W(N(n), () => t.children ?? g, () => s.snippetProps), E(n), U(e, n);
		};
		G(r, (e) => {
			t.child ? e(i) : e(a, -1);
		}), U(e, n);
	};
	G(u, (e) => {
		(s.shouldRender || i()) && e(d);
	}), U(e, l), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
var _l = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref"
]), vl = /* @__PURE__ */ V("<div><!></div>");
function yl(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ J(t, _l), o = Is.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = vl();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/utils.mjs
function bl(e, t) {
	return e - t * Math.floor(e / t);
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/calendars/GregorianCalendar.mjs
var xl = 1721426;
function Sl(e, t, n, r) {
	t = wl(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Cl(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Cl(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function wl(e, t) {
	return e === "BC" ? 1 - t : t;
}
function Tl(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var El = {
	standard: [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	],
	leapyear: [
		31,
		29,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	]
}, Dl = class {
	fromJulianDay(e) {
		let t = e, n = t - xl, r = Math.floor(n / 146097), i = bl(n, 146097), a = Math.floor(i / 36524), o = bl(i, 36524), s = Math.floor(o / 1461), c = bl(o, 1461), l = Math.floor(c / 365), [u, d] = Tl(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - Sl(u, d, 1, 1), p = 2;
		t < Sl(u, d, 3, 1) ? p = 0 : Cl(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new Yu(u, d, m, t - Sl(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return Sl(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return El[Cl(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Cl(e.year) ? 366 : 365;
	}
	getMaximumMonthsInYear() {
		return 12;
	}
	getMaximumDaysInMonth() {
		return 31;
	}
	getYearsInEra(e) {
		return 9999;
	}
	getEras() {
		return ["BC", "AD"];
	}
	isInverseEra(e) {
		return e.era === "BC";
	}
	balanceDate(e) {
		e.year <= 0 && (e.era = e.era === "BC" ? "AD" : "BC", e.year = 1 - e.year);
	}
	constructor() {
		this.identifier = "gregory";
	}
}, Ol = {
	"001": 1,
	AD: 1,
	AE: 6,
	AF: 6,
	AI: 1,
	AL: 1,
	AM: 1,
	AN: 1,
	AR: 1,
	AT: 1,
	AU: 1,
	AX: 1,
	AZ: 1,
	BA: 1,
	BE: 1,
	BG: 1,
	BH: 6,
	BM: 1,
	BN: 1,
	BY: 1,
	CH: 1,
	CL: 1,
	CM: 1,
	CN: 1,
	CR: 1,
	CY: 1,
	CZ: 1,
	DE: 1,
	DJ: 6,
	DK: 1,
	DZ: 6,
	EC: 1,
	EE: 1,
	EG: 6,
	ES: 1,
	FI: 1,
	FJ: 1,
	FO: 1,
	FR: 1,
	GB: 1,
	GE: 1,
	GF: 1,
	GP: 1,
	GR: 1,
	HR: 1,
	HU: 1,
	IE: 1,
	IQ: 6,
	IR: 6,
	IS: 1,
	IT: 1,
	JO: 6,
	KG: 1,
	KW: 6,
	KZ: 1,
	LB: 1,
	LI: 1,
	LK: 1,
	LT: 1,
	LU: 1,
	LV: 1,
	LY: 6,
	MC: 1,
	MD: 1,
	ME: 1,
	MK: 1,
	MN: 1,
	MQ: 1,
	MV: 5,
	MY: 1,
	NL: 1,
	NO: 1,
	NZ: 1,
	OM: 6,
	PL: 1,
	QA: 6,
	RE: 1,
	RO: 1,
	RS: 1,
	RU: 1,
	SD: 6,
	SE: 1,
	SI: 1,
	SK: 1,
	SM: 1,
	SY: 6,
	TJ: 1,
	TM: 1,
	TR: 1,
	UA: 1,
	UY: 1,
	UZ: 1,
	VA: 1,
	VN: 1,
	XK: 1
};
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/queries.mjs
function kl(e, t) {
	return t = lu(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function Al(e, t) {
	return t = lu(t, e.calendar), e = Ul(e), t = Ul(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function jl(e, t) {
	return e.isEqual?.(t) ?? t.isEqual?.(e) ?? e.identifier === t.identifier;
}
var Ml = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function Nl(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? Ml[n] : Jl(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function Pl(e) {
	return ou(Date.now(), e);
}
function Fl(e) {
	return su(Pl(e));
}
function Il(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function Ll(e, t) {
	return Rl(e) - Rl(t);
}
function Rl(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var zl = null, Bl = !1;
function Vl() {
	return zl ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, zl;
}
function Hl() {
	return Bl;
}
function Ul(e) {
	return e.subtract({ days: e.day - 1 });
}
function Wl(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var Gl = /* @__PURE__ */ new Map(), Kl = /* @__PURE__ */ new Map();
function ql(e) {
	if (Intl.Locale) {
		let t = Gl.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && Gl.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function Jl(e) {
	let t = Kl.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return Kl.set(e, t), t.firstDay;
		}
		let n = ql(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && Ol[n] || 0 };
		Kl.set(e, t);
	}
	return t.firstDay;
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/conversion.mjs
function Yl(e) {
	return e = lu(e, new Dl()), Xl(wl(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Xl(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function Zl(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === Vl() && !Hl()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = $l(e, t);
	return Xl(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var Ql = /* @__PURE__ */ new Map();
function $l(e, t) {
	let n = Ql.get(t);
	n || (n = new Intl.DateTimeFormat("en-US", {
		timeZone: t,
		hour12: !1,
		era: "short",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric"
	}), Ql.set(t, n));
	let r = n.formatToParts(new Date(e)), i = {};
	for (let e of r) e.type !== "literal" && (i[e.type] = e.value);
	return {
		year: i.era === "BC" || i.era === "B" ? -i.year + 1 : +i.year,
		month: +i.month,
		day: +i.day,
		hour: i.hour === "24" ? 0 : +i.hour,
		minute: +i.minute,
		second: +i.second
	};
}
var eu = 864e5;
function tu(e, t) {
	let n = Yl(e);
	return nu(e, t, n - Zl(n - eu, t), n - Zl(n + eu, t));
}
function nu(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => ru(e, t, n));
}
function ru(e, t, n) {
	let r = $l(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function iu(e, t, n = "compatible") {
	let r = cu(e);
	if (t === "UTC") return Yl(r);
	if (t === Vl() && n === "compatible" && !Hl()) {
		r = lu(r, new Dl());
		let e = /* @__PURE__ */ new Date(), t = wl(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = Yl(r), a = Zl(i - eu, t), o = Zl(i + eu, t), s = nu(r, t, i - a, i - o);
	if (s.length === 1) return s[0];
	if (s.length > 1) switch (n) {
		case "compatible":
		case "earlier": return s[0];
		case "later": return s[s.length - 1];
		case "reject": throw RangeError("Multiple possible absolute times found");
	}
	switch (n) {
		case "earlier": return Math.min(i - a, i - o);
		case "compatible":
		case "later": return Math.max(i - a, i - o);
		case "reject": throw RangeError("No such absolute time found");
	}
}
function au(e, t, n = "compatible") {
	return new Date(iu(e, t, n));
}
function ou(e, t) {
	let n = Zl(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new Zu(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function su(e) {
	return new Yu(e.calendar, e.era, e.year, e.month, e.day);
}
function cu(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new Xu(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function lu(e, t) {
	if (jl(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, yu(r), r;
}
function uu(e, t, n) {
	return e instanceof Zu ? e.timeZone === t ? e : fu(e, t) : ou(iu(e, t, n), t);
}
function du(e) {
	let t = Yl(e) - e.offset;
	return new Date(t);
}
function fu(e, t) {
	return lu(ou(Yl(e) - e.offset, t), e.calendar);
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/manipulation.mjs
var pu = 36e5;
function mu(e, t) {
	let n = e.copy(), r = "hour" in n ? Du(n, t) : 0;
	hu(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, gu(n), vu(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, _u(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
	let i = n.calendar.getYearsInEra(n);
	if (n.year > i) {
		let e = n.calendar.isInverseEra?.(n);
		n.year = i, n.month = e ? 1 : n.calendar.getMonthsInYear(n), n.day = e ? 1 : n.calendar.getDaysInMonth(n);
	}
	n.month < 1 && (n.month = 1, n.day = 1);
	let a = n.calendar.getMonthsInYear(n);
	return n.month > a && (n.month = a, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function hu(e, t) {
	e.calendar.isInverseEra?.(e) && (t = -t), e.year += t;
}
function gu(e) {
	for (; e.month < 1;) hu(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, hu(e, 1);
}
function _u(e) {
	for (; e.day < 1;) e.month--, gu(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, gu(e);
}
function vu(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function yu(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), vu(e);
}
function bu(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function xu(e, t) {
	return mu(e, bu(t));
}
function Su(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), yu(n), n;
}
function Cu(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Tu(n), n;
}
function wu(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = Eu(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = Eu(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = Eu(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = Eu(e.hour, 24), t;
}
function Tu(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 999)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function Eu(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function Du(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, wu(e);
}
function Ou(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = Au(a, n, 0, t.length - 1, r?.round), i.era = t[a], yu(i);
			break;
		}
		case "year":
			i.calendar.isInverseEra?.(i) && (n = -n), i.year = Au(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = Au(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = Au(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), yu(i), i;
}
function ku(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = Au(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = Au(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = Au(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = Au(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function Au(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function ju(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? iu(mu(cu(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : Yl(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, lu(ou(n, e.timeZone), e.calendar);
}
function Mu(e, t) {
	return ju(e, bu(t));
}
function Nu(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = cu(e), o = lu(Cu(a, { hour: t }), new Dl()), s = [iu(o, e.timeZone, "earlier"), iu(o, e.timeZone, "later")].filter((t) => ou(t, e.timeZone).day === o.day)[0], c = lu(Cu(a, { hour: i }), new Dl()), l = [iu(c, e.timeZone, "earlier"), iu(c, e.timeZone, "later")].filter((t) => ou(t, e.timeZone).day === c.day).pop(), u = Yl(e) - e.offset, d = Math.floor(u / pu), f = u % pu;
			return u = Au(d, n, Math.floor(s / pu), Math.floor(l / pu), r?.round) * pu + f, lu(ou(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return ku(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return lu(ou(iu(Ou(cu(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function Pu(e, t, n) {
	let r = cu(e), i = Cu(Su(r, t), t);
	return i.compare(r) === 0 ? e : lu(ou(iu(i, e.timeZone, n), e.timeZone), e.calendar);
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/string.mjs
var Fu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, Iu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Lu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, Ru = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function zu(e) {
	let t = e.match(Fu);
	if (!t) throw Ru.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new Yu(Hu(t[1], 0, 9999), Hu(t[2], 1, 12), 1);
	return n.day = Hu(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Bu(e) {
	let t = e.match(Iu);
	if (!t) throw Ru.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = Hu(t[1], -9999, 9999), r = new Xu(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, Hu(t[2], 1, 12), 1, t[4] ? Hu(t[4], 0, 23) : 0, t[5] ? Hu(t[5], 0, 59) : 0, t[6] ? Hu(t[6], 0, 59) : 0, t[7] ? Hu(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = Hu(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function Vu(e, t) {
	let n = e.match(Lu);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = Hu(n[1], -9999, 9999), i = new Zu(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, Hu(n[2], 1, 12), 1, n[11], 0, n[4] ? Hu(n[4], 0, 23) : 0, n[5] ? Hu(n[5], 0, 59) : 0, n[6] ? Hu(n[6], 0, 59) : 0, n[7] ? Hu(n[7], 0, Infinity) * 1e3 : 0);
	i.day = Hu(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = cu(i), o;
	if (n[8]) {
		let e = Hu(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + Hu(n[9] ?? "0", 0, 59) * 6e4 + Hu(n[10] ?? "0", 0, 59) * 1e3), o = Yl(i) - i.offset, !tu(a, i.timeZone).includes(o)) throw Error(`Offset ${Ku(i.offset)} is invalid for ${Gu(i)} in ${i.timeZone}`);
	} else o = iu(cu(a), i.timeZone, t);
	return ou(o, i.timeZone);
}
function Hu(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function Uu(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function Wu(e) {
	let t = lu(e, new Dl()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function Gu(e) {
	return `${Wu(e)}T${Uu(e)}`;
}
function Ku(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function qu(e) {
	return `${Gu(e)}${Ku(e.offset)}[${e.timeZone}]`;
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/CalendarDate.mjs
function Ju(e) {
	let t = typeof e[0] == "object" ? e.shift() : new Dl(), n;
	if (typeof e[0] == "string") n = e.shift();
	else {
		let e = t.getEras();
		n = e[e.length - 1];
	}
	let r = e.shift(), i = e.shift(), a = e.shift();
	return [
		t,
		n,
		r,
		i,
		a
	];
}
var Yu = class e {
	constructor(...e) {
		let [t, n, r, i, a] = Ju(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, yu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return mu(this, e);
	}
	subtract(e) {
		return xu(this, e);
	}
	set(e) {
		return Su(this, e);
	}
	cycle(e, t, n) {
		return Ou(this, e, t, n);
	}
	toDate(e) {
		return au(this, e);
	}
	toString() {
		return Wu(this);
	}
	compare(e) {
		return Il(this, e);
	}
}, Xu = class e {
	constructor(...e) {
		let [t, n, r, i, a] = Ju(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, yu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return mu(this, e);
	}
	subtract(e) {
		return xu(this, e);
	}
	set(e) {
		return Su(Cu(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return Ou(this, e, t, n);
			default: return ku(this, e, t, n);
		}
	}
	toDate(e, t) {
		return au(this, e, t);
	}
	toString() {
		return Gu(this);
	}
	compare(e) {
		let t = Il(this, e);
		return t === 0 ? Ll(this, cu(e)) : t;
	}
}, Zu = class e {
	constructor(...e) {
		let [t, n, r, i, a] = Ju(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, yu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return ju(this, e);
	}
	subtract(e) {
		return Mu(this, e);
	}
	set(e, t) {
		return Pu(this, e, t);
	}
	cycle(e, t, n) {
		return Nu(this, e, t, n);
	}
	toDate() {
		return du(this);
	}
	toString() {
		return qu(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - uu(e, this.timeZone).toDate().getTime();
	}
}, Qu = /* @__PURE__ */ new Map(), $u = class {
	constructor(e, t = {}) {
		this.formatter = td(e, t), this.options = t;
	}
	format(e) {
		return this.formatter.format(e);
	}
	formatToParts(e) {
		return this.formatter.formatToParts(e);
	}
	formatRange(e, t) {
		if (typeof this.formatter.formatRange == "function") return this.formatter.formatRange(e, t);
		if (t < e) throw RangeError("End date must be >= start date");
		return `${this.formatter.format(e)} \u{2013} ${this.formatter.format(t)}`;
	}
	formatRangeToParts(e, t) {
		if (typeof this.formatter.formatRangeToParts == "function") return this.formatter.formatRangeToParts(e, t);
		if (t < e) throw RangeError("End date must be >= start date");
		let n = this.formatter.formatToParts(e), r = this.formatter.formatToParts(t);
		return [
			...n.map((e) => ({
				...e,
				source: "startRange"
			})),
			{
				type: "literal",
				value: " – ",
				source: "shared"
			},
			...r.map((e) => ({
				...e,
				source: "endRange"
			}))
		];
	}
	resolvedOptions() {
		let e = this.formatter.resolvedOptions();
		return ad() && (this.resolvedHourCycle ||= od(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
}, ed = {
	true: { ja: "h11" },
	false: {}
};
function td(e, t = {}) {
	if (typeof t.hour12 == "boolean" && rd()) {
		t = { ...t };
		let n = ed[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (Qu.has(n)) return Qu.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return Qu.set(n, r), r;
}
var nd = null;
function rd() {
	return nd ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", nd;
}
var id = null;
function ad() {
	return id ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", id;
}
function od(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = td(e, {
		...t,
		timeZone: void 0
	}), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((e) => e.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((e) => e.type === "hour").value, 10);
	if (r === 0 && i === 23) return "h23";
	if (r === 24 && i === 23) return "h24";
	if (r === 0 && i === 11) return "h11";
	if (r === 12 && i === 11) return "h12";
	throw Error("Unexpected hour cycle result");
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/announcer.js
function sd(e) {
	if (!bs || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!Cs(t)) {
		let r = e.createElement("div");
		r.style.cssText = Io, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!Cs(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return Cs(n) ? n : null;
	} };
}
function cd(e) {
	let t = sd(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !bs || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/utils.js
var ld = {
	defaultValue: void 0,
	granularity: "day"
};
function ud(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...ld,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(Vl()) ? e = r.toDate(Vl()) : i && e > i.toDate(Vl()) && (e = i.toDate(Vl()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new Xu(t, a, o, 0, 0, 0) : new Yu(t, a, o);
	}
}
function dd(e, t) {
	let n;
	return n = t instanceof Zu ? Vu(e) : t instanceof Xu ? Bu(e) : zu(e), n.calendar === t.calendar ? n : lu(n, t.calendar);
}
function fd(e, t = Vl()) {
	return e instanceof Zu ? e.toDate() : e.toDate(t);
}
function pd(e) {
	if (e instanceof Yu) return "date";
	if (e instanceof Xu) return "datetime";
	if (e instanceof Zu) return "zoneddatetime";
	throw Error("Unknown date type");
}
function md(e, t) {
	switch (t) {
		case "date": return zu(e);
		case "datetime": return Bu(e);
		case "zoneddatetime": return Vu(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function hd(e) {
	return e instanceof Xu;
}
function gd(e) {
	return e instanceof Zu;
}
function _d(e) {
	return hd(e) || gd(e);
}
function vd(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function yd(e, t) {
	return e.compare(t) < 0;
}
function bd(e, t) {
	return e.compare(t) > 0;
}
function xd(e, t, n) {
	let r = Nl(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function Sd(e, t, n) {
	let r = Nl(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var Cd = [
	"day",
	"month",
	"year"
], wd = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], Td = ["literal", "timeZoneName"], Ed = [...Cd, ...wd], Dd = [...Ed, ...Td], Od = [...wd, ...Td];
Dd.filter((e) => e !== "literal"), Od.filter((e) => e !== "literal");
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var kd = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), Ad = [
	"year",
	"month",
	"day"
], jd = {
	ach: {
		year: "mwaka",
		month: "dwe",
		day: "nino"
	},
	af: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	am: {
		year: "ዓዓዓዓ",
		month: "ሚሜ",
		day: "ቀቀ"
	},
	an: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	ar: {
		year: "سنة",
		month: "شهر",
		day: "يوم"
	},
	ast: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	az: {
		year: "iiii",
		month: "aa",
		day: "gg"
	},
	be: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	bg: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	bn: {
		year: "yyyy",
		month: "মিমি",
		day: "dd"
	},
	br: {
		year: "bbbb",
		month: "mm",
		day: "dd"
	},
	bs: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	ca: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	cak: {
		year: "jjjj",
		month: "ii",
		day: "q'q'"
	},
	ckb: {
		year: "ساڵ",
		month: "مانگ",
		day: "ڕۆژ"
	},
	cs: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	cy: {
		year: "bbbb",
		month: "mm",
		day: "dd"
	},
	da: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	de: {
		year: "jjjj",
		month: "mm",
		day: "tt"
	},
	dsb: {
		year: "llll",
		month: "mm",
		day: "źź"
	},
	el: {
		year: "εεεε",
		month: "μμ",
		day: "ηη"
	},
	en: {
		year: "yyyy",
		month: "mm",
		day: "dd"
	},
	eo: {
		year: "jjjj",
		month: "mm",
		day: "tt"
	},
	es: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	et: {
		year: "aaaa",
		month: "kk",
		day: "pp"
	},
	eu: {
		year: "uuuu",
		month: "hh",
		day: "ee"
	},
	fa: {
		year: "سال",
		month: "ماه",
		day: "روز"
	},
	ff: {
		year: "hhhh",
		month: "ll",
		day: "ññ"
	},
	fi: {
		year: "vvvv",
		month: "kk",
		day: "pp"
	},
	fr: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	fy: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	ga: {
		year: "bbbb",
		month: "mm",
		day: "ll"
	},
	gd: {
		year: "bbbb",
		month: "mm",
		day: "ll"
	},
	gl: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	he: {
		year: "שנה",
		month: "חודש",
		day: "יום"
	},
	hr: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	hsb: {
		year: "llll",
		month: "mm",
		day: "dd"
	},
	hu: {
		year: "éééé",
		month: "hh",
		day: "nn"
	},
	ia: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	id: {
		year: "tttt",
		month: "bb",
		day: "hh"
	},
	it: {
		year: "aaaa",
		month: "mm",
		day: "gg"
	},
	ja: {
		year: " 年 ",
		month: "月",
		day: "日"
	},
	ka: {
		year: "წწწწ",
		month: "თთ",
		day: "რრ"
	},
	kk: {
		year: "жжжж",
		month: "аа",
		day: "кк"
	},
	kn: {
		year: "ವವವವ",
		month: "ಮಿಮೀ",
		day: "ದಿದಿ"
	},
	ko: {
		year: "연도",
		month: "월",
		day: "일"
	},
	lb: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	lo: {
		year: "ປປປປ",
		month: "ດດ",
		day: "ວວ"
	},
	lt: {
		year: "mmmm",
		month: "mm",
		day: "dd"
	},
	lv: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	meh: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	ml: {
		year: "വർഷം",
		month: "മാസം",
		day: "തീയതി"
	},
	ms: {
		year: "tttt",
		month: "mm",
		day: "hh"
	},
	nl: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	nn: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	no: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	oc: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	pl: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	pt: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	rm: {
		year: "oooo",
		month: "mm",
		day: "dd"
	},
	ro: {
		year: "aaaa",
		month: "ll",
		day: "zz"
	},
	ru: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	sc: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	scn: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	sk: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	sl: {
		year: "llll",
		month: "mm",
		day: "dd"
	},
	sr: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	sv: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	szl: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	tg: {
		year: "сссс",
		month: "мм",
		day: "рр"
	},
	th: {
		year: "ปปปป",
		month: "ดด",
		day: "วว"
	},
	tr: {
		year: "yyyy",
		month: "aa",
		day: "gg"
	},
	uk: {
		year: "рррр",
		month: "мм",
		day: "дд"
	},
	"zh-CN": {
		year: "年",
		month: "月",
		day: "日"
	},
	"zh-TW": {
		year: "年",
		month: "月",
		day: "日"
	}
};
function Md(e) {
	if (Pd(e)) return jd[e];
	{
		let t = Rd(e);
		return Pd(t) ? jd[t] : jd.en;
	}
}
function Nd(e, t, n) {
	return Fd(e) ? Md(n)[e] : Ld(e) ? t : Id(e) ? "––" : "";
}
function Pd(e) {
	return kd.includes(e);
}
function Fd(e) {
	return Ad.includes(e);
}
function Id(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function Ld(e) {
	return e === "era" || e === "dayPeriod";
}
function Rd(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function zd(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = Ed.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function Bd(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!Kd(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = Es(i) ? Nd(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!Es(o) && !Es(c)) {
				let t = n.part(i.set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), l = e.hourCycle === 12 || e.hourCycle === void 0 && af(r) === 12;
				if (a === "hour" && l) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && t.length === 1 ? `0${t}` : t;
			}
			return Nd(a, "", r);
		}
		if (Gd(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (Es(e)) return Nd(a, "", r);
			{
				let t = n.part(i.set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && t.length === 1 ? `0${t}` : t;
			}
		}
		return "";
	}
	return a;
}
function Vd(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, Ud(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !Kd(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(Es(e.part) || Es(e.value) || e.part === "timeZoneName" && (!gd(n) || a)));
}
function Hd(e) {
	let t = Bd(e);
	return {
		obj: t,
		arr: Vd({
			contentObj: t,
			...e
		})
	};
}
function Ud(e, t) {
	let n = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		hourCycle: t === 24 ? "h23" : void 0,
		hour12: t !== 24 && void 0
	};
	return e === "day" && (delete n.second, delete n.hour, delete n.minute, delete n.timeZoneName), e === "hour" && delete n.minute, e === "minute" && delete n.second, n;
}
function Wd() {
	return Ed.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function Gd(e) {
	return Cd.includes(e);
}
function Kd(e) {
	return Ed.includes(e);
}
function qd(e) {
	return Dd.includes(e);
}
function Jd(e) {
	return !bs || !e ? [] : df(e).map((e) => e.dataset.segment).filter((e) => Ed.includes(e));
}
var Yd = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function Xd(e) {
	let t = Yd.indexOf(e);
	return t === -1 ? Yd.length : t;
}
function Zd(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = Jd(n).sort((e, t) => Xd(e) - Xd(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (Es(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (Gd(e)) {
		let n = t[e];
		if (Es(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function Qd(e, t) {
	let n = Jd(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (Gd(t) && e[t] === null) return !1;
	return !0;
}
function $d(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (wd.includes(e) || Cd.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function ef(e, t) {
	return t || (_d(e) ? "minute" : "day");
}
function tf(e, t) {
	if (!bs) return !1;
	let n = df(t);
	return n.length ? n[0].id === e : !1;
}
function nf(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!bs) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = Mo({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function rf(e, t) {
	if (!bs) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function af(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function of(e, t) {
	let n = e.currentTarget;
	if (!Cs(n)) return;
	let { prev: r, next: i } = lf(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function sf(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function cf(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function lf(e, t) {
	let n = df(t);
	return n.length ? {
		next: sf(e, n),
		prev: cf(e, n)
	} : {
		next: null,
		prev: null
	};
}
function uf(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function df(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!Cs(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!qd(t) || t === "literal");
	}) : [];
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/formatter.js
var ff = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function pf(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new $u(t, n).format(e);
	}
	function a(e, t = !0) {
		return _d(e) && t ? i(fd(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(fd(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new $u(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new $u(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new $u(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new $u(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new $u(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return gd(e) ? new $u(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(fd(e)) : new $u(t, n).formatToParts(fd(e));
	}
	function u(e, n = "narrow") {
		return new $u(t, { weekday: n }).format(e);
	}
	function d(e, n = void 0) {
		return new $u(t, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: n === 24 ? "h23" : void 0
		}).formatToParts(e).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...ff,
			...n
		}).find((e) => e.type === t);
		return r ? r.value : "";
	}
	return {
		setLocale: n,
		getLocale: r,
		fullMonth: s,
		fullYear: c,
		fullMonthAndYear: o,
		toParts: l,
		custom: i,
		part: f,
		dayPeriod: d,
		selectedDate: a,
		dayOfWeek: u
	};
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/arrays.js
function mf(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function hf(e, t) {
	return e >= 0 && e < t.length;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/date-time/calendar-helpers.svelte.js
function gf(e) {
	return !(!Cs(e) || !e.hasAttribute("data-bits-day"));
}
function _f(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function vf(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = vd(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = Ul(t), c = Wl(t), l = n === void 0 ? xd(s, 0, i) : xd(s, n, "en-US"), u = n === void 0 ? Sd(c, 0, i) : Sd(c, n, "en-US"), d = _f(l.subtract({ days: 1 }), s), f = _f(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
	if (r && p < 42) {
		let e = 42 - p, n = f[f.length - 1];
		n ||= t.add({ months: 1 }).set({ day: 1 });
		let r = e;
		f.length === 0 && (r = e - 1, f.push(n));
		let i = Array.from({ length: r }, (e, t) => {
			let r = t + 1;
			return n.add({ days: r });
		});
		f.push(...i);
	}
	let m = d.concat(o, f);
	return {
		value: t,
		dates: m,
		weeks: mf(m, 7)
	};
}
function yf(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(vf({
		...r,
		dateObj: n
	})), i;
	i.push(vf({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(vf({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function bf(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => Cs(e)) : [];
}
function xf(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = dd(n, t.current));
}
function Sf({ node: e, add: t, placeholder: n, calendarNode: r, isPrevButtonDisabled: i, isNextButtonDisabled: a, months: o, numberOfMonths: s }) {
	let c = bf(r);
	if (!c.length) return;
	let l = c.indexOf(e) + t;
	if (hf(l, c)) {
		let e = c[l];
		return xf(e, n), e.focus();
	}
	if (l < 0) {
		if (i) return;
		let e = o[0]?.value;
		if (!e) return;
		n.current = e.subtract({ months: s }), Jo(() => {
			let e = bf(r);
			if (!e.length) return;
			let t = e.length - Math.abs(l);
			if (hf(t, e)) {
				let r = e[t];
				return xf(r, n), r.focus();
			}
		});
	}
	if (l >= c.length) {
		if (a) return;
		let e = o[0]?.value;
		if (!e) return;
		n.current = e.add({ months: s }), Jo(() => {
			let e = bf(r);
			if (!e.length) return;
			let t = l - c.length;
			if (hf(t, e)) return e[t].focus();
		});
	}
}
var Cf = [
	hs,
	vs,
	gs,
	_s
], wf = [ys, " "];
function Tf({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!gf(i) || !Cf.includes(e.key) && !wf.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[hs]: 7,
		[vs]: -7,
		[gs]: -1,
		[_s]: 1
	};
	if (Cf.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (wf.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, dd(n, r));
	}
}
function Ef({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = yf({
				dateObj: e,
				weekStartsOn: i,
				locale: a,
				fixedWeeks: o,
				numberOfMonths: n
			});
			s(e), t(r);
		}
	}
}
function Df({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = yf({
				dateObj: e,
				weekStartsOn: i,
				locale: a,
				fixedWeeks: o,
				numberOfMonths: n
			});
			s(e), t(r);
		}
	}
}
function Of({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(fd(e), n)) : [];
}
function kf(e) {
	I(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		Tr(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(yf({
				...o,
				dateObj: a
			}));
		});
	});
}
function Af({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = is(e), i = r.createElement("div");
	i.style.cssText = Mo({
		border: "0px",
		clip: "rect(0px, 0px, 0px, 0px)",
		clipPath: "inset(50%)",
		height: "1px",
		margin: "-1px",
		overflow: "hidden",
		padding: "0px",
		position: "absolute",
		whiteSpace: "nowrap",
		width: "1px"
	});
	let a = r.createElement("div");
	return a.textContent = t, a.id = n, a.role = "heading", a.ariaLevel = "2", e.insertBefore(i, e.firstChild), i.appendChild(a), () => {
		let e = r.getElementById(n);
		e && (i.parentElement?.removeChild(i), e.remove());
	};
}
function jf({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	I(() => {
		e.current, Tr(() => {
			t().some((t) => Al(t, e.current)) || o(yf({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function Mf({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? bd(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function Nf({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? yd(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function Pf({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = fd(e[0].value);
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = fd(e[0].value), i = fd(e[e.length - 1].value), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function Ff({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": Q(n),
		"data-disabled": Q(r),
		"data-readonly": Q(i)
	};
}
function If(e) {
	let t = is(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function Lf(e) {
	if (!bs) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return md(r, i);
}
function Rf({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && yd(e, r.current) || i.current && yd(i.current, e));
	}
	Uo(() => e.current, () => {
		e.current && t.current && kl(t.current, n) && o(n) && (t.current = Lf(e.current) ?? n);
	});
}
function zf(e, t) {
	return !e || !t ? e : _d(e) && _d(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var Bf = ms({
	component: "calendar",
	parts: [
		"root",
		"grid",
		"cell",
		"next-button",
		"prev-button",
		"day",
		"grid-body",
		"grid-head",
		"grid-row",
		"head-cell",
		"header",
		"heading",
		"month-select",
		"year-select"
	]
});
function Vf(e) {
	let t = (/* @__PURE__ */ new Date()).getFullYear(), n = Math.max(e.placeholderYear, t), r, i;
	if (e.minValue) r = e.minValue.year;
	else {
		let t = n - 100;
		r = e.placeholderYear < t ? e.placeholderYear - 10 : t;
	}
	i = e.maxValue ? e.maxValue.year : n + 10, r > i && (r = i);
	let a = i - r + 1;
	return Array.from({ length: a }, (e, t) => r + t);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/calendar.svelte.js
var Hf = new Bo("Calendar.Root | RangeCalender.Root"), Uf = class e {
	static create(t) {
		return Hf.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ k(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return B(this.#e);
	}
	set visibleMonths(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => (this.months, Fl(Vl())));
	get todayDate() {
		return B(this.#t);
	}
	set todayDate(e) {
		M(this.#t, e);
	}
	formatter;
	accessibleHeadingId = tl();
	domContext;
	attachment;
	#n = /* @__PURE__ */ j(sn([]));
	get months() {
		return B(this.#n);
	}
	set months(e) {
		M(this.#n, e, !0);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = cs(this.opts.ref), this.domContext = new ss(e.ref), this.announcer = cd(null), this.formatter = pf({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), fi(() => {
			this.announcer = cd(this.domContext.getDocument());
		}), this.months = yf({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#o(), this.#s(), this.#c(), jf({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), kf({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), Uo(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), Uo(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), Rf({
			placeholder: e.placeholder,
			defaultPlaceholder: e.defaultPlaceholder,
			isDateDisabled: e.isDateDisabled,
			maxValue: e.maxValue,
			minValue: e.minValue,
			ref: e.ref
		});
	}
	setMonths(e) {
		this.months = e;
	}
	#r = /* @__PURE__ */ k(() => Of({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return B(this.#r);
	}
	set weekdays(e) {
		M(this.#r, e);
	}
	#i = /* @__PURE__ */ k(() => Tr(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return B(this.#i);
	}
	set initialPlaceholderYear(e) {
		M(this.#i, e);
	}
	#a = /* @__PURE__ */ k(() => Vf({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return B(this.#a);
	}
	set defaultYears(e) {
		M(this.#a, e);
	}
	#o() {
		I(() => {
			if (Tr(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#s() {
		I(() => {
			if (this.opts.ref.current) return Af({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#c() {
		jn(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		Ef({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (e) => this.opts.placeholder.current = e,
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months
		});
	}
	prevPage() {
		Df({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (e) => this.opts.placeholder.current = e,
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months
		});
	}
	nextYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.add({ years: 1 });
	}
	prevYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.subtract({ years: 1 });
	}
	setYear(e) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ year: e });
	}
	setMonth(e) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ month: e });
	}
	#l = /* @__PURE__ */ k(() => Mf({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return B(this.#l);
	}
	set isNextButtonDisabled(e) {
		M(this.#l, e);
	}
	#u = /* @__PURE__ */ k(() => Nf({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return B(this.#u);
	}
	set isPrevButtonDisabled(e) {
		M(this.#u, e);
	}
	#d = /* @__PURE__ */ k(() => {
		let e = this.opts.value.current, t = this.opts.isDateDisabled.current, n = this.opts.isDateUnavailable.current;
		if (Array.isArray(e)) {
			if (!e.length) return !1;
			for (let r of e) if (t(r) || n(r)) return !0;
		} else {
			if (!e) return !1;
			if (t(e) || n(e)) return !0;
		}
		return !1;
	});
	get isInvalid() {
		return B(this.#d);
	}
	set isInvalid(e) {
		M(this.#d, e);
	}
	#f = /* @__PURE__ */ k(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, Pf({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return B(this.#f);
	}
	set headingValue(e) {
		M(this.#f, e);
	}
	#p = /* @__PURE__ */ k(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return B(this.#p);
	}
	set fullCalendarLabel(e) {
		M(this.#p, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => Al(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && yd(e, t) || n && yd(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => kl(t, e)) : t ? kl(t, e) : !1;
	}
	shiftFocus(e, t) {
		return Sf({
			node: e,
			add: t,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current
		});
	}
	#m(e) {
		if (this.opts.type.current !== "multiple" || !this.opts.maxDays.current) return !0;
		let t = e.length;
		return !(this.opts.maxDays.current && t > this.opts.maxDays.current);
	}
	handleCellClick(e, t) {
		if (this.opts.readonly.current || this.opts.isDateDisabled.current?.(t) || this.opts.isDateUnavailable.current?.(t)) return;
		let n = this.opts.value.current;
		if (this.opts.type.current === "multiple") (Array.isArray(n) || n === void 0) && (this.opts.value.current = this.handleMultipleUpdate(n, t));
		else if (!Array.isArray(n)) {
			let e = this.handleSingleUpdate(n, t);
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = zf(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#m(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => kl(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#m(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !kl(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && kl(e, t)) {
			this.opts.placeholder.current = t;
			return;
		}
		return t;
	}
	onkeydown(e) {
		Tf({
			event: e,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#h = /* @__PURE__ */ k(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return B(this.#h);
	}
	set snippetProps(e) {
		M(this.#h, e);
	}
	getBitsAttr = (e) => Bf.getAttr(e);
	#g = /* @__PURE__ */ k(() => ({
		...Ff({
			fullCalendarLabel: this.fullCalendarLabel,
			id: this.opts.id.current,
			isInvalid: this.isInvalid,
			disabled: this.opts.disabled.current,
			readonly: this.opts.readonly.current
		}),
		[this.getBitsAttr("root")]: "",
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return B(this.#g);
	}
	set props(e) {
		M(this.#g, e);
	}
}, Wf = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"aria-hidden": us(!0),
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("heading")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, Gf = new Bo("Calendar.Cell | RangeCalendar.Cell"), Kf = class e {
	static create(t) {
		return Gf.set(new e(t, Hf.get()));
	}
	opts;
	root;
	#e = /* @__PURE__ */ k(() => fd(this.opts.date.current));
	get cellDate() {
		return B(this.#e);
	}
	set cellDate(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return B(this.#t);
	}
	set isUnavailable(e) {
		M(this.#t, e);
	}
	#n = /* @__PURE__ */ k(() => kl(this.opts.date.current, this.root.todayDate));
	get isDateToday() {
		return B(this.#n);
	}
	set isDateToday(e) {
		M(this.#n, e);
	}
	#r = /* @__PURE__ */ k(() => !Al(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return B(this.#r);
	}
	set isOutsideMonth(e) {
		M(this.#r, e);
	}
	#i = /* @__PURE__ */ k(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return B(this.#i);
	}
	set isOutsideVisibleMonths(e) {
		M(this.#i, e);
	}
	#a = /* @__PURE__ */ k(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return B(this.#a);
	}
	set isDisabled(e) {
		M(this.#a, e);
	}
	#o = /* @__PURE__ */ k(() => kl(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return B(this.#o);
	}
	set isFocusedDate(e) {
		M(this.#o, e);
	}
	#s = /* @__PURE__ */ k(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return B(this.#s);
	}
	set isSelectedDate(e) {
		M(this.#s, e);
	}
	#c = /* @__PURE__ */ k(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return B(this.#c);
	}
	set labelText(e) {
		M(this.#c, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#l = /* @__PURE__ */ k(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return B(this.#l);
	}
	set snippetProps(e) {
		M(this.#l, e);
	}
	#u = /* @__PURE__ */ k(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
	get ariaDisabled() {
		return B(this.#u);
	}
	set ariaDisabled(e) {
		M(this.#u, e);
	}
	#d = /* @__PURE__ */ k(() => ({
		"data-unavailable": Q(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": Q(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": pd(this.opts.date.current),
		"data-disabled": Q(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return B(this.#d);
	}
	set sharedDataAttrs(e) {
		M(this.#d, e);
	}
	#f = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": ls(this.isSelectedDate),
		"aria-disabled": ls(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#f);
	}
	set props(e) {
		M(this.#f, e);
	}
}, qf = class e {
	static create(t) {
		return new e(t, Gf.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
	onclick(e) {
		this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}
	#t = /* @__PURE__ */ k(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`
	}));
	get snippetProps() {
		return B(this.#t);
	}
	set snippetProps(e) {
		M(this.#t, e);
	}
	#n = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": ls(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: B(this.#e),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#n);
	}
	set props(e) {
		M(this.#n, e);
	}
}, Jf = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	#e = /* @__PURE__ */ k(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return B(this.#e);
	}
	set isDisabled(e) {
		M(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = cs(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": ls(this.isDisabled),
		"data-disabled": Q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
}, Yf = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	#e = /* @__PURE__ */ k(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return B(this.#e);
	}
	set isDisabled(e) {
		M(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = cs(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": ls(this.isDisabled),
		"data-disabled": Q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
}, Xf = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": ls(this.root.opts.readonly.current),
		"aria-disabled": ls(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		"data-disabled": Q(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, Zf = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, Qf = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, $f = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, ep = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, tp = class e {
	static create(t) {
		return new e(t, Hf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, np = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), rp = /* @__PURE__ */ V("<div><!></div>");
function ip(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, np), o = qf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H(), r = P(n);
		{
			let e = /* @__PURE__ */ k(() => ({
				props: B(s),
				...o.snippetProps
			}));
			W(r, () => t.child, () => B(e));
		}
		U(e, n);
	}, d = (e) => {
		var n = rp();
		q(n, () => ({ ...B(s) }));
		var r = N(n), i = (e) => {
			var n = H();
			W(P(n), () => t.children ?? g, () => o.snippetProps), U(e, n);
		}, a = (e) => {
			var t = Gr();
			L(() => ai(t, o.cell.opts.date.current.day)), U(e, t);
		};
		G(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var ap = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), op = /* @__PURE__ */ V("<table><!></table>");
function sp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, ap), o = Xf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = op();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var cp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), lp = /* @__PURE__ */ V("<tbody><!></tbody>");
function up(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, cp), o = Zf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = lp();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var dp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), fp = /* @__PURE__ */ V("<td><!></td>");
function pp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, dp), o = Kf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		date: X(() => t.date),
		month: X(() => t.month)
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H(), r = P(n);
		{
			let e = /* @__PURE__ */ k(() => ({
				props: B(s),
				...o.snippetProps
			}));
			W(r, () => t.child, () => B(e));
		}
		U(e, n);
	}, d = (e) => {
		var n = fp();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g, () => o.snippetProps), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var mp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), hp = /* @__PURE__ */ V("<thead><!></thead>");
function gp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, mp), o = Qf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = hp();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var _p = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), vp = /* @__PURE__ */ V("<th><!></th>");
function yp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, _p), o = ep.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = vp();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var bp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), xp = /* @__PURE__ */ V("<tr><!></tr>");
function Sp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, bp), o = $f.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = xp();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var Cp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), wp = /* @__PURE__ */ V("<header><!></header>");
function Tp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, Cp), o = tp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(s) })), U(e, n);
	}, d = (e) => {
		var n = wp();
		q(n, () => ({ ...B(s) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var Ep = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Dp = /* @__PURE__ */ V("<div><!></div>");
function Op(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = /* @__PURE__ */ J(t, Ep), o = Wf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = H(), l = P(c), u = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({
			props: B(s),
			headingValue: o.root.headingValue
		})), U(e, n);
	}, d = (e) => {
		var n = Dp();
		q(n, () => ({ ...B(s) }));
		var r = N(n), i = (e) => {
			var n = H();
			W(P(n), () => t.children ?? g, () => ({ headingValue: o.root.headingValue })), U(e, n);
		}, a = (e) => {
			var t = Gr();
			L(() => ai(t, o.root.headingValue)), U(e, t);
		};
		G(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), E(n), U(e, n);
	};
	G(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), U(e, c), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var kp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), Ap = /* @__PURE__ */ V("<button><!></button>");
function jp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ J(t, kp), s = Jf.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props, { tabindex: a() }));
	var l = H(), u = P(l), d = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(c) })), U(e, n);
	}, f = (e) => {
		var n = Ap();
		q(n, () => ({ ...B(c) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), U(e, l), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var Mp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), Np = /* @__PURE__ */ V("<button><!></button>");
function Pp(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ J(t, Mp), s = Yf.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props, { tabindex: a() }));
	var l = H(), u = P(l), d = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({ props: B(c) })), U(e, n);
	}, f = (e) => {
		var n = Np();
		q(n, () => ({ ...B(c) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
	};
	G(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), U(e, l), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var Fp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), Ip = /* @__PURE__ */ V("<input/>");
function Lp(e, t) {
	D(t, !0);
	let n = Y(t, "value", 15), r = /* @__PURE__ */ J(t, Fp), i = /* @__PURE__ */ k(() => Z(r, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...Fo,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var a = H(), o = P(a), s = (e) => {
		var t = Ip();
		q(t, () => ({
			...B(i),
			value: n()
		}), void 0, void 0, void 0, void 0, !0), U(e, t);
	}, c = (e) => {
		var t = Ip();
		q(t, () => ({ ...B(i) }), void 0, void 0, void 0, void 0, !0), oa(t, n), U(e, t);
	};
	G(o, (e) => {
		B(i).type === "checkbox" ? e(s) : e(c, -1);
	}), U(e, a), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/floating-layer/floating-root.svelte.js
var Rp = new Bo("Floating.Root"), zp = new Bo("Floating.Root"), Bp = class e {
	static create(t = !1) {
		return t ? zp.set(new e()) : Rp.set(new e());
	}
	anchorNode = $a(null);
	customAnchorNode = $a(null);
	triggerNode = $a(null);
	constructor() {
		I(() => {
			this.customAnchorNode.current ? typeof this.customAnchorNode.current == "string" ? this.anchorNode.current = document.querySelector(this.customAnchorNode.current) : this.anchorNode.current = this.customAnchorNode.current : this.anchorNode.current = this.triggerNode.current;
		});
	}
}, Vp = class e {
	static create(t, n = !1) {
		return n ? new e(t, zp.get()) : new e(t, Rp.get());
	}
	opts;
	root;
	constructor(e, t) {
		this.opts = e, this.root = t, t.triggerNode = e.virtualEl && e.virtualEl.current ? Qa(e.virtualEl.current) : e.ref;
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function Hp(e, t) {
	D(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	Bp.create(n());
	var r = H();
	W(P(r), () => t.children ?? g), U(e, r), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function Up(e) {
	return typeof e == "function" ? e() : e;
}
function Wp(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Gp(e, t) {
	let n = Wp(e);
	return Math.round(t * n) / n;
}
function Kp(e) {
	return {
		[`--bits-${e}-content-transform-origin`]: "var(--bits-floating-transform-origin)",
		[`--bits-${e}-content-available-width`]: "var(--bits-floating-available-width)",
		[`--bits-${e}-content-available-height`]: "var(--bits-floating-available-height)",
		[`--bits-${e}-anchor-width`]: "var(--bits-floating-anchor-width)",
		[`--bits-${e}-anchor-height`]: "var(--bits-floating-anchor-height)"
	};
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
function qp(e, t) {
	D(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	Vp.create({
		id: X(() => t.id),
		virtualEl: X(() => t.virtualEl),
		ref: t.ref
	}, n());
	var r = H();
	W(P(r), () => t.children ?? g), U(e, r), O();
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var Jp = [
	"top",
	"right",
	"bottom",
	"left"
], Yp = Math.min, Xp = Math.max, Zp = Math.round, Qp = Math.floor, $p = (e) => ({
	x: e,
	y: e
}), em = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function tm(e, t, n) {
	return Xp(e, Yp(t, n));
}
function nm(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function rm(e) {
	return e.split("-")[0];
}
function im(e) {
	return e.split("-")[1];
}
function am(e) {
	return e === "x" ? "y" : "x";
}
function om(e) {
	return e === "y" ? "height" : "width";
}
function sm(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function cm(e) {
	return am(sm(e));
}
function lm(e, t, n) {
	n === void 0 && (n = !1);
	let r = im(e), i = cm(e), a = om(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = vm(o)), [o, vm(o)];
}
function um(e) {
	let t = vm(e);
	return [
		dm(e),
		t,
		dm(t)
	];
}
function dm(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var fm = ["left", "right"], pm = ["right", "left"], mm = ["top", "bottom"], hm = ["bottom", "top"];
function gm(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? pm : fm : t ? fm : pm;
		case "left":
		case "right": return t ? mm : hm;
		default: return [];
	}
}
function _m(e, t, n, r) {
	let i = im(e), a = gm(rm(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(dm)))), a;
}
function vm(e) {
	let t = rm(e);
	return em[t] + e.slice(t.length);
}
function ym(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function bm(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : ym(e);
}
function xm(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function Sm(e, t, n) {
	let { reference: r, floating: i } = e, a = sm(t), o = cm(t), s = om(o), c = rm(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	let m = im(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Cm(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = nm(t, e), p = bm(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = xm(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = xm(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var wm = 50, Tm = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Cm
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Sm(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < wm && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Sm(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Em = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = nm(e, t) || {};
		if (l == null) return {};
		let d = bm(u), f = {
			x: n,
			y: r
		}, p = cm(i), m = om(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		(!C || !await (o.isElement == null ? void 0 : o.isElement(S))) && (C = s.floating[y] || a.floating[m]);
		let ee = b / 2 - x / 2, te = C / 2 - h[m] / 2 - 1, ne = Yp(d[_], te), re = Yp(d[v], te), ie = C - h[m] - re, ae = C / 2 - h[m] / 2 + ee, oe = tm(ne, ae, ie), se = !c.arrow && im(i) != null && ae !== oe && a.reference[m] / 2 - (ae < ne ? ne : re) - h[m] / 2 < 0, ce = se ? ae < ne ? ae - ne : ae - ie : 0;
		return {
			[p]: f[p] + ce,
			data: {
				[p]: oe,
				centerOffset: ae - oe - ce,
				...se && { alignmentOffset: ce }
			},
			reset: se
		};
	}
}), Dm = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = nm(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = rm(r), _ = sm(o), v = rm(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [vm(o)] : um(o)), x = p !== "none";
			!d && x && b.push(..._m(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), ee = [], te = i.flip?.overflows || [];
			if (l && ee.push(C[g]), u) {
				let e = lm(r, a, y);
				ee.push(C[e[0]], C[e[1]]);
			}
			if (te = [...te, {
				placement: r,
				overflows: ee
			}], !ee.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === sm(t) || te.every((e) => sm(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: te
					},
					reset: { placement: t }
				};
				let n = te.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = te.filter((e) => {
							if (x) {
								let t = sm(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement": n = o;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
};
function Om(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function km(e) {
	return Jp.some((t) => e[t] >= 0);
}
var Am = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = nm(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = Om(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: km(e)
					} };
				}
				case "escaped": {
					let e = Om(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: km(e)
					} };
				}
				default: return {};
			}
		}
	};
}, jm = /*#__PURE__*/ new Set(["left", "top"]);
async function Mm(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = rm(n), s = im(n), c = sm(n) === "y", l = jm.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = nm(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var Nm = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Mm(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, Pm = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = nm(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = sm(i), p = am(f), m = u[p], h = u[f], g = (e, t) => tm(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
			o && (m = g(p, m)), s && (h = g(f, h));
			let _ = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				..._,
				data: {
					x: _.x - n,
					y: _.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
}, Fm = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = nm(e, t), u = {
				x: n,
				y: r
			}, d = sm(i), f = am(d), p = u[f], m = u[d], h = nm(s, t), g = typeof h == "number" ? {
				mainAxis: h,
				crossAxis: 0
			} : {
				mainAxis: h.mainAxis ?? 0,
				crossAxis: h.crossAxis ?? 0
			};
			if (c) {
				let e = f === "y" ? "height" : "width", t = a.reference[f] - a.floating[e] + g.mainAxis, n = a.reference[f] + a.reference[e] - g.mainAxis;
				p < t ? p = t : p > n && (p = n);
			}
			if (l) {
				let e = f === "y" ? "width" : "height", t = jm.has(rm(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, Im = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = nm(e, t), c = await i.detectOverflow(t, s), l = rm(n), u = im(n), d = sm(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = Yp(p - c[m], g), y = Yp(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * Xp(c.left, c.right) : S = p - 2 * Xp(c.top, c.bottom)), await o({
				...t,
				availableWidth: C,
				availableHeight: S
			});
			let ee = await i.getDimensions(a.floating);
			return f !== ee.width || p !== ee.height ? { reset: { rects: !0 } } : {};
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function Lm() {
	return typeof window < "u";
}
function Rm(e) {
	return Vm(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function zm(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Bm(e) {
	return ((Vm(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Vm(e) {
	return Lm() ? e instanceof Node || e instanceof zm(e).Node : !1;
}
function Hm(e) {
	return Lm() ? e instanceof Element || e instanceof zm(e).Element : !1;
}
function Um(e) {
	return Lm() ? e instanceof HTMLElement || e instanceof zm(e).HTMLElement : !1;
}
function Wm(e) {
	return !Lm() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof zm(e).ShadowRoot;
}
function Gm(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = nh(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function Km(e) {
	return /^(table|td|th)$/.test(Rm(e));
}
function qm(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var Jm = /transform|translate|scale|rotate|perspective|filter/, Ym = /paint|layout|strict|content/, Xm = (e) => !!e && e !== "none", Zm;
function Qm(e) {
	let t = Hm(e) ? nh(e) : e;
	return Xm(t.transform) || Xm(t.translate) || Xm(t.scale) || Xm(t.rotate) || Xm(t.perspective) || !eh() && (Xm(t.backdropFilter) || Xm(t.filter)) || Jm.test(t.willChange || "") || Ym.test(t.contain || "");
}
function $m(e) {
	let t = ih(e);
	for (; Um(t) && !th(t);) {
		if (Qm(t)) return t;
		if (qm(t)) return null;
		t = ih(t);
	}
	return null;
}
function eh() {
	return Zm ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), Zm;
}
function th(e) {
	return /^(html|body|#document)$/.test(Rm(e));
}
function nh(e) {
	return zm(e).getComputedStyle(e);
}
function rh(e) {
	return Hm(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function ih(e) {
	if (Rm(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || Wm(e) && e.host || Bm(e);
	return Wm(t) ? t.host : t;
}
function ah(e) {
	let t = ih(e);
	return th(t) ? (e.ownerDocument || e).body : Um(t) && Gm(t) ? t : ah(t);
}
function oh(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = ah(e), i = r === e.ownerDocument?.body, a = zm(r);
	if (i) {
		let e = sh(a);
		return t.concat(a, a.visualViewport || [], Gm(r) ? r : [], e && n ? oh(e) : []);
	}
	return t.concat(r, oh(r, [], n));
}
function sh(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function ch(e) {
	let t = nh(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = Um(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = Zp(n) !== a || Zp(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function lh(e) {
	return Hm(e) ? e : e.contextElement;
}
function uh(e) {
	let t = lh(e);
	if (!Um(t)) return $p(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = ch(t), o = (a ? Zp(n.width) : n.width) / r, s = (a ? Zp(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var dh = /*#__PURE__*/ $p(0);
function fh(e) {
	let t = zm(e);
	return !eh() || !t.visualViewport ? dh : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function ph(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === zm(e);
}
function mh(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = lh(e), o = $p(1);
	t && (r ? Hm(r) && (o = uh(r)) : o = uh(e));
	let s = ph(a, n, r) ? fh(a) : $p(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = zm(a), t = Hm(r) ? zm(r) : r, n = e, i = sh(n);
		for (; i && t !== n;) {
			let e = uh(i), t = i.getBoundingClientRect(), r = nh(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = zm(i), i = sh(n);
		}
	}
	return xm({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function hh(e, t) {
	let n = rh(e).scrollLeft;
	return t ? t.left + n : mh(Bm(e)).left + n;
}
function gh(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - hh(e, n),
		y: n.top + t.scrollTop
	};
}
function _h(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Bm(r), s = t ? qm(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = $p(1), u = $p(0), d = Um(r);
	if ((d || !a) && ((Rm(r) !== "body" || Gm(o)) && (c = rh(r)), d)) {
		let e = mh(r);
		l = uh(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? gh(o, c) : $p(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function vh(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function yh(e) {
	let t = rh(e), n = e.ownerDocument.body, r = Xp(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Xp(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + hh(e), o = -t.scrollTop;
	return nh(n).direction === "rtl" && (a += Xp(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var bh = 25;
function xh(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = zm(e), a = Bm(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !eh() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (hh(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= bh && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Sh(e, t) {
	let n = mh(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = uh(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Ch(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = xh(e, n, t);
	else if (t === "document") r = yh(Bm(e));
	else if (Hm(t)) r = Sh(t, n);
	else {
		let n = fh(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return xm(r);
}
function wh(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = oh(e, [], !1).filter((e) => Hm(e) && Rm(e) !== "body"), i = null, a = nh(e).position === "fixed", o = a ? ih(e) : e;
	for (; Hm(o) && !th(o);) {
		let e = nh(o), t = Qm(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = ih(o);
	}
	return t.set(e, r), r;
}
function Th(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? qm(t) ? [] : wh(t, this._c) : [].concat(n), r], o = Ch(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Ch(t, a[e], i);
		s = Xp(n.top, s), c = Yp(n.right, c), l = Yp(n.bottom, l), u = Xp(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Eh(e) {
	let { width: t, height: n } = ch(e);
	return {
		width: t,
		height: n
	};
}
function Dh(e, t, n) {
	let r = Um(t), i = Bm(t), a = n === "fixed", o = mh(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = $p(0);
	if ((r || !a) && ((Rm(t) !== "body" || Gm(i)) && (s = rh(t)), r)) {
		let e = mh(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = hh(i));
	let l = i && !r && !a ? gh(i, s) : $p(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Oh(e) {
	return nh(e).position === "static";
}
function kh(e, t) {
	if (!Um(e) || nh(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Bm(e) === n && (n = n.ownerDocument.body), n;
}
function Ah(e, t) {
	let n = zm(e);
	if (qm(e)) return n;
	if (!Um(e)) {
		let t = ih(e);
		for (; t && !th(t);) {
			if (Hm(t) && !Oh(t)) return t;
			t = ih(t);
		}
		return n;
	}
	let r = kh(e, t);
	for (; r && Km(r) && Oh(r);) r = kh(r, t);
	return r && th(r) && Oh(r) && !Qm(r) ? n : r || $m(e) || n;
}
var jh = async function(e) {
	let t = this.getOffsetParent || Ah, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Dh(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Mh(e) {
	return nh(e).direction === "rtl";
}
var Nh = {
	convertOffsetParentRelativeRectToViewportRelativeRect: _h,
	getDocumentElement: Bm,
	getClippingRect: Th,
	getOffsetParent: Ah,
	getElementRects: jh,
	getClientRects: vh,
	getDimensions: Eh,
	getScale: uh,
	isElement: Hm,
	isRTL: Mh
};
function Ph(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Fh(e, t, n) {
	let r = null, i, a = Bm(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = Qp(d), h = Qp(a.clientWidth - (u + f)), g = Qp(a.clientHeight - (d + p)), _ = Qp(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: Xp(0, Yp(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!Ph(l, e.getBoundingClientRect())) return s();
			if (n !== c) {
				if (!y) return s();
				n ? s(!1, n) : i = setTimeout(() => {
					s(!1, 1e-7);
				}, 1e3);
			}
			y = !1;
		}
		try {
			r = new IntersectionObserver(b, {
				...v,
				root: a.ownerDocument
			});
		} catch {
			r = new IntersectionObserver(b, v);
		}
		r.observe(e);
	}
	let c = zm(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function Ih(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = lh(e), u = i || a ? [...l ? oh(l) : [], ...t ? oh(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Fh(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? mh(e) : null;
	c && g();
	function g() {
		let t = mh(e);
		h && !Ph(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var Lh = Nm, Rh = Pm, zh = Dm, Bh = Im, Vh = Am, Hh = Em, Uh = Fm, Wh = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Nh,
		...i.platform,
		_c: r
	};
	return Tm(e, t, {
		...i,
		platform: a
	});
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function Gh(e) {
	let t = e.whileElementsMounted, n = /* @__PURE__ */ k(() => Up(e.open) ?? !0), r = /* @__PURE__ */ k(() => Up(e.middleware)), i = /* @__PURE__ */ k(() => Up(e.transform) ?? !0), a = /* @__PURE__ */ k(() => Up(e.placement) ?? "bottom"), o = /* @__PURE__ */ k(() => Up(e.strategy) ?? "absolute"), s = /* @__PURE__ */ k(() => Up(e.sideOffset) ?? 0), c = /* @__PURE__ */ k(() => Up(e.alignOffset) ?? 0), l = e.reference, u = /* @__PURE__ */ j(0), d = /* @__PURE__ */ j(0), f = $a(null), p = /* @__PURE__ */ j(sn(B(o))), m = /* @__PURE__ */ j(sn(B(a))), h = /* @__PURE__ */ j(sn({})), g = /* @__PURE__ */ j(!1), _ = !1, v = 0, y = !1, b = /* @__PURE__ */ k(() => {
		let e = f.current ? Gp(f.current, B(u)) : B(u), t = f.current ? Gp(f.current, B(d)) : B(d);
		return B(i) ? {
			position: B(p),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...f.current && Wp(f.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: B(p),
			left: `${e}px`,
			top: `${t}px`
		};
	}), x;
	function S() {
		if (y || l.current === null || f.current === null) return;
		let e = l.current, t = f.current, i = ++v;
		Wh(e, t, {
			middleware: B(r),
			placement: B(a),
			strategy: B(o)
		}).then((r) => {
			if (i === v && l.current === e && f.current === t) {
				if (Kh(e)) {
					M(h, {
						...B(h),
						hide: {
							...B(h).hide,
							referenceHidden: !0
						}
					}, !0);
					return;
				}
				if (!B(n) && B(u) !== 0 && B(d) !== 0) {
					let e = Math.max(Math.abs(B(s)), Math.abs(B(c)), 15);
					if (r.x <= e && r.y <= e) return;
				}
				M(u, r.x, !0), M(d, r.y, !0), M(p, r.strategy, !0), M(m, r.placement, !0), M(h, r.middlewareData, !0), M(g, !0);
			}
		});
	}
	function C() {
		typeof x == "function" && (x(), x = void 0), v++;
	}
	function ee() {
		if (C(), t === void 0) {
			S();
			return;
		}
		B(n) && l.current !== null && f.current !== null && (x = t(l.current, f.current, S));
	}
	function te() {
		!B(n) && f.current === null && M(g, !1);
	}
	function ne() {
		return [
			B(r),
			B(a),
			B(o),
			B(s),
			B(c),
			B(n)
		];
	}
	return I(() => {
		t === void 0 && B(n) && S();
	}), I(ee), I(() => {
		if (t !== void 0) {
			if (ne(), !B(n)) {
				_ = !1;
				return;
			}
			if (!B(g)) {
				_ = !1;
				return;
			}
			if (!_) {
				_ = !0;
				return;
			}
			S();
		}
	}), I(te), I(() => () => {
		y = !0, C();
	}), {
		floating: f,
		reference: l,
		get strategy() {
			return B(p);
		},
		get placement() {
			return B(m);
		},
		get middlewareData() {
			return B(h);
		},
		get isPositioned() {
			return B(g);
		},
		get floatingStyles() {
			return B(b);
		},
		get update() {
			return S;
		}
	};
}
function Kh(e) {
	return e instanceof Element ? !e.isConnected || e instanceof HTMLElement && e.hidden ? !0 : e.getClientRects().length === 0 : !1;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var qh = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, Jh = new Bo("Floating.Content"), Yh = class e {
	static create(t, n = !1) {
		return n ? Jh.set(new e(t, zp.get())) : Jh.set(new e(t, Rp.get()));
	}
	opts;
	root;
	contentRef = $a(null);
	wrapperRef = $a(null);
	arrowRef = $a(null);
	contentAttachment = cs(this.contentRef);
	wrapperAttachment = cs(this.wrapperRef);
	arrowAttachment = cs(this.arrowRef);
	arrowId = $a(tl());
	#e = /* @__PURE__ */ k(() => {
		if (typeof this.opts.style == "string") return Do(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new Ko(() => this.arrowRef.current ?? void 0);
	#r = /* @__PURE__ */ k(() => this.#n?.width ?? 0);
	#i = /* @__PURE__ */ k(() => this.#n?.height ?? 0);
	#a = /* @__PURE__ */ k(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = /* @__PURE__ */ k(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#s = /* @__PURE__ */ k(() => B(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return B(this.#s);
	}
	set hasExplicitBoundaries(e) {
		M(this.#s, e);
	}
	#c = /* @__PURE__ */ k(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: B(this.#o).filter(Os),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return B(this.#c);
	}
	set detectOverflowOptions(e) {
		M(this.#c, e);
	}
	#l = /* @__PURE__ */ j(void 0);
	#u = /* @__PURE__ */ j(void 0);
	#d = /* @__PURE__ */ j(void 0);
	#f = /* @__PURE__ */ j(void 0);
	#p = /* @__PURE__ */ k(() => [
		Lh({
			mainAxis: this.opts.sideOffset.current + B(this.#i),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && Rh({
			mainAxis: !0,
			crossAxis: !1,
			limiter: this.opts.sticky.current === "partial" ? Uh() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && zh({ ...this.detectOverflowOptions }),
		Bh({
			...this.detectOverflowOptions,
			apply: ({ rects: e, availableWidth: t, availableHeight: n }) => {
				let { width: r, height: i } = e.reference;
				M(this.#l, t, !0), M(this.#u, n, !0), M(this.#d, r, !0), M(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && Hh({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		Xh({
			arrowWidth: B(this.#r),
			arrowHeight: B(this.#i)
		}),
		this.opts.hideWhenDetached.current && Vh({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return B(this.#p);
	}
	set middleware(e) {
		M(this.#p, e);
	}
	floating;
	#m = /* @__PURE__ */ k(() => Qh(this.floating.placement));
	get placedSide() {
		return B(this.#m);
	}
	set placedSide(e) {
		M(this.#m, e);
	}
	#h = /* @__PURE__ */ k(() => $h(this.floating.placement));
	get placedAlign() {
		return B(this.#h);
	}
	set placedAlign(e) {
		M(this.#h, e);
	}
	#g = /* @__PURE__ */ k(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return B(this.#g);
	}
	set arrowX(e) {
		M(this.#g, e);
	}
	#_ = /* @__PURE__ */ k(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return B(this.#_);
	}
	set arrowY(e) {
		M(this.#_, e);
	}
	#v = /* @__PURE__ */ k(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return B(this.#v);
	}
	set cannotCenterArrow(e) {
		M(this.#v, e);
	}
	#y = /* @__PURE__ */ j();
	get contentZIndex() {
		return B(this.#y);
	}
	set contentZIndex(e) {
		M(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ k(() => qh[this.placedSide]);
	get arrowBaseSide() {
		return B(this.#b);
	}
	set arrowBaseSide(e) {
		M(this.#b, e);
	}
	#x = /* @__PURE__ */ k(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${B(this.#l)}px`,
			"--bits-floating-available-height": `${B(this.#u)}px`,
			"--bits-floating-anchor-width": `${B(this.#d)}px`,
			"--bits-floating-anchor-height": `${B(this.#f)}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...B(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return B(this.#x);
	}
	set wrapperProps(e) {
		M(this.#x, e);
	}
	#S = /* @__PURE__ */ k(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: Mo({ ...B(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return B(this.#S);
	}
	set props(e) {
		M(this.#S, e);
	}
	#C = /* @__PURE__ */ k(() => ({
		position: "absolute",
		left: this.arrowX ? `${this.arrowX}px` : void 0,
		top: this.arrowY ? `${this.arrowY}px` : void 0,
		[this.arrowBaseSide]: 0,
		"transform-origin": {
			top: "",
			right: "0 0",
			bottom: "center 0",
			left: "100% 0"
		}[this.placedSide],
		transform: {
			top: "translateY(100%)",
			right: "translateY(50%) rotate(90deg) translateX(-50%)",
			bottom: "rotate(180deg)",
			left: "translateY(50%) rotate(-90deg) translateX(50%)"
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? "hidden" : void 0
	}));
	get arrowStyle() {
		return B(this.#C);
	}
	set arrowStyle(e) {
		M(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), Uo(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = Gh({
			strategy: () => this.opts.strategy.current,
			placement: () => B(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => Ih(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), I(() => {
			this.floating.isPositioned && this.opts.onPlaced?.current();
		}), Uo(() => this.contentRef.current, (e) => {
			if (!e || !this.opts.enabled.current) return;
			let t = as(e), n = t.requestAnimationFrame(() => {
				if (this.contentRef.current !== e || !this.opts.enabled.current) return;
				let n = t.getComputedStyle(e).zIndex;
				n !== this.contentZIndex && (this.contentZIndex = n);
			});
			return () => {
				t.cancelAnimationFrame(n);
			};
		}), I(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}
};
function Xh(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = Zh(n), u = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[l], d = (i.arrow?.x ?? 0) + o / 2, f = (i.arrow?.y ?? 0) + s / 2, p = "", m = "";
			return c === "bottom" ? (p = a ? u : `${d}px`, m = `${-s}px`) : c === "top" ? (p = a ? u : `${d}px`, m = `${r.floating.height + s}px`) : c === "right" ? (p = `${-s}px`, m = a ? u : `${f}px`) : c === "left" && (p = `${r.floating.width + s}px`, m = a ? u : `${f}px`), { data: {
				x: p,
				y: m
			} };
		}
	};
}
function Zh(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
function Qh(e) {
	return Zh(e)[0];
}
function $h(e) {
	return Zh(e)[1];
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
function eg(e, t) {
	D(t, !0);
	let n = Y(t, "side", 3, "bottom"), r = Y(t, "sideOffset", 3, 0), i = Y(t, "align", 3, "center"), a = Y(t, "alignOffset", 3, 0), o = Y(t, "arrowPadding", 3, 0), s = Y(t, "avoidCollisions", 3, !0), c = Y(t, "collisionBoundary", 19, () => []), l = Y(t, "collisionPadding", 3, 0), u = Y(t, "hideWhenDetached", 3, !1), d = Y(t, "onPlaced", 3, () => {}), f = Y(t, "sticky", 3, "partial"), p = Y(t, "updatePositionStrategy", 3, "optimized"), m = Y(t, "strategy", 3, "fixed"), h = Y(t, "dir", 3, "ltr"), _ = Y(t, "style", 19, () => ({})), v = Y(t, "wrapperId", 19, tl), y = Y(t, "customAnchor", 3, null), b = Y(t, "tooltip", 3, !1), x = Yh.create({
		side: X(() => n()),
		sideOffset: X(() => r()),
		align: X(() => i()),
		alignOffset: X(() => a()),
		id: X(() => t.id),
		arrowPadding: X(() => o()),
		avoidCollisions: X(() => s()),
		collisionBoundary: X(() => c()),
		collisionPadding: X(() => l()),
		hideWhenDetached: X(() => u()),
		onPlaced: X(() => d()),
		sticky: X(() => f()),
		updatePositionStrategy: X(() => p()),
		strategy: X(() => m()),
		dir: X(() => h()),
		style: X(() => _()),
		enabled: X(() => t.enabled),
		wrapperId: X(() => v()),
		customAnchor: X(() => y())
	}, b()), S = /* @__PURE__ */ k(() => Z(x.wrapperProps, { style: { pointerEvents: "auto" } }));
	var C = H();
	W(P(C), () => t.content ?? g, () => ({
		props: x.props,
		wrapperProps: B(S)
	})), U(e, C), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function tg(e, t) {
	D(t, !0), fi(() => {
		t.onPlaced?.();
	});
	var n = H();
	W(P(n), () => t.content ?? g, () => ({
		props: {},
		wrapperProps: {}
	})), U(e, n), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
var ng = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"content",
	"isStatic",
	"onPlaced"
]);
function rg(e, t) {
	let n = Y(t, "isStatic", 3, !1), r = /* @__PURE__ */ J(t, ng);
	var i = H(), a = P(i), o = (e) => {
		tg(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, s = (e) => {
		eg(e, ya({
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		}, () => r));
	};
	G(a, (e) => {
		n() ? e(o) : e(s, -1);
	}), U(e, i);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var ig = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.ref.tooltip.contentPointerEvents".split(".")), ag = /* @__PURE__ */ V("<!> <!>", 1);
function og(e, t) {
	D(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = Y(t, "tooltip", 3, !1), c = Y(t, "contentPointerEvents", 3, "auto"), l = /* @__PURE__ */ J(t, ig), u = /* @__PURE__ */ k(() => t.preventScroll ?? !0), d = /* @__PURE__ */ k(() => t.strategy ?? (B(u) ? "fixed" : "absolute"));
	rg(e, {
		get isStatic() {
			return o();
		},
		get id() {
			return t.id;
		},
		get side() {
			return t.side;
		},
		get sideOffset() {
			return t.sideOffset;
		},
		get align() {
			return t.align;
		},
		get alignOffset() {
			return t.alignOffset;
		},
		get arrowPadding() {
			return t.arrowPadding;
		},
		get avoidCollisions() {
			return t.avoidCollisions;
		},
		get collisionBoundary() {
			return t.collisionBoundary;
		},
		get collisionPadding() {
			return t.collisionPadding;
		},
		get sticky() {
			return t.sticky;
		},
		get hideWhenDetached() {
			return t.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return t.updatePositionStrategy;
		},
		get strategy() {
			return B(d);
		},
		get dir() {
			return t.dir;
		},
		get wrapperId() {
			return t.wrapperId;
		},
		get style() {
			return t.style;
		},
		get onPlaced() {
			return t.onPlaced;
		},
		get customAnchor() {
			return a();
		},
		get enabled() {
			return t.enabled;
		},
		get tooltip() {
			return s();
		},
		content: (e, a) => {
			let o = () => (a?.()).props, s = () => (a?.()).wrapperProps;
			var d = ag(), f = P(d), p = (e) => {
				pl(e, { get preventScroll() {
					return B(u);
				} });
			}, m = (e) => {
				pl(e, { get preventScroll() {
					return B(u);
				} });
			};
			G(f, (e) => {
				t.forceMount && t.enabled ? e(p) : t.forceMount || e(m, 1);
			}), qc(F(f, 2), {
				get onOpenAutoFocus() {
					return t.onOpenAutoFocus;
				},
				get onCloseAutoFocus() {
					return t.onCloseAutoFocus;
				},
				get loop() {
					return t.loop;
				},
				get enabled() {
					return t.enabled;
				},
				get trapFocus() {
					return r();
				},
				get forceMount() {
					return t.forceMount;
				},
				get ref() {
					return t.ref;
				},
				focusScope: (e, r) => {
					let a = () => (r?.()).props;
					dc(e, {
						get onEscapeKeydown() {
							return t.onEscapeKeydown;
						},
						get escapeKeydownBehavior() {
							return t.escapeKeydownBehavior;
						},
						get enabled() {
							return t.enabled;
						},
						get ref() {
							return t.ref;
						},
						children: (e, r) => {
							cc(e, {
								get id() {
									return t.id;
								},
								get onInteractOutside() {
									return t.onInteractOutside;
								},
								get onFocusOutside() {
									return t.onFocusOutside;
								},
								get interactOutsideBehavior() {
									return n();
								},
								get isValidEvent() {
									return i();
								},
								get enabled() {
									return t.enabled;
								},
								get ref() {
									return t.ref;
								},
								children: (e, n) => {
									let r = () => (n?.()).props;
									el(e, {
										get id() {
											return t.id;
										},
										get preventOverflowTextSelection() {
											return t.preventOverflowTextSelection;
										},
										get onPointerDown() {
											return t.onPointerDown;
										},
										get onPointerUp() {
											return t.onPointerUp;
										},
										get enabled() {
											return t.enabled;
										},
										get ref() {
											return t.ref;
										},
										children: (e, n) => {
											var i = H(), u = P(i);
											{
												let e = /* @__PURE__ */ k(() => ({
													props: Z(l, o(), r(), a(), {
														id: t.id,
														style: { pointerEvents: c() }
													}),
													wrapperProps: s()
												}));
												W(u, () => t.popper ?? g, () => B(e));
											}
											U(e, i);
										},
										$$slots: { default: !0 }
									});
								},
								$$slots: { default: !0 }
							});
						},
						$$slots: { default: !0 }
					});
				},
				$$slots: { focusScope: !0 }
			}), U(e, d);
		},
		$$slots: { content: !0 }
	}), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var sg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function cg(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ J(t, sg);
	var c = H(), l = P(c), u = (e) => {
		og(e, ya({
			get popper() {
				return t.popper;
			},
			get onEscapeKeydown() {
				return t.onEscapeKeydown;
			},
			get escapeKeydownBehavior() {
				return t.escapeKeydownBehavior;
			},
			get preventOverflowTextSelection() {
				return t.preventOverflowTextSelection;
			},
			get id() {
				return t.id;
			},
			get onPointerDown() {
				return t.onPointerDown;
			},
			get onPointerUp() {
				return t.onPointerUp;
			},
			get side() {
				return t.side;
			},
			get sideOffset() {
				return t.sideOffset;
			},
			get align() {
				return t.align;
			},
			get alignOffset() {
				return t.alignOffset;
			},
			get arrowPadding() {
				return t.arrowPadding;
			},
			get avoidCollisions() {
				return t.avoidCollisions;
			},
			get collisionBoundary() {
				return t.collisionBoundary;
			},
			get collisionPadding() {
				return t.collisionPadding;
			},
			get sticky() {
				return t.sticky;
			},
			get hideWhenDetached() {
				return t.hideWhenDetached;
			},
			get updatePositionStrategy() {
				return t.updatePositionStrategy;
			},
			get strategy() {
				return t.strategy;
			},
			get dir() {
				return t.dir;
			},
			get preventScroll() {
				return t.preventScroll;
			},
			get wrapperId() {
				return t.wrapperId;
			},
			get style() {
				return t.style;
			},
			get onPlaced() {
				return t.onPlaced;
			},
			get customAnchor() {
				return a();
			},
			get isStatic() {
				return o();
			},
			get enabled() {
				return t.open;
			},
			get onInteractOutside() {
				return t.onInteractOutside;
			},
			get onCloseAutoFocus() {
				return t.onCloseAutoFocus;
			},
			get onOpenAutoFocus() {
				return t.onOpenAutoFocus;
			},
			get interactOutsideBehavior() {
				return n();
			},
			get loop() {
				return t.loop;
			},
			get trapFocus() {
				return r();
			},
			get isValidEvent() {
				return i();
			},
			get onFocusOutside() {
				return t.onFocusOutside;
			},
			forceMount: !1,
			get ref() {
				return t.ref;
			}
		}, () => s));
	};
	G(l, (e) => {
		t.shouldRender && e(u);
	}), U(e, c);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var lg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function ug(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ J(t, lg);
	og(e, ya({
		get popper() {
			return t.popper;
		},
		get onEscapeKeydown() {
			return t.onEscapeKeydown;
		},
		get escapeKeydownBehavior() {
			return t.escapeKeydownBehavior;
		},
		get preventOverflowTextSelection() {
			return t.preventOverflowTextSelection;
		},
		get id() {
			return t.id;
		},
		get onPointerDown() {
			return t.onPointerDown;
		},
		get onPointerUp() {
			return t.onPointerUp;
		},
		get side() {
			return t.side;
		},
		get sideOffset() {
			return t.sideOffset;
		},
		get align() {
			return t.align;
		},
		get alignOffset() {
			return t.alignOffset;
		},
		get arrowPadding() {
			return t.arrowPadding;
		},
		get avoidCollisions() {
			return t.avoidCollisions;
		},
		get collisionBoundary() {
			return t.collisionBoundary;
		},
		get collisionPadding() {
			return t.collisionPadding;
		},
		get sticky() {
			return t.sticky;
		},
		get hideWhenDetached() {
			return t.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return t.updatePositionStrategy;
		},
		get strategy() {
			return t.strategy;
		},
		get dir() {
			return t.dir;
		},
		get preventScroll() {
			return t.preventScroll;
		},
		get wrapperId() {
			return t.wrapperId;
		},
		get style() {
			return t.style;
		},
		get onPlaced() {
			return t.onPlaced;
		},
		get customAnchor() {
			return a();
		},
		get isStatic() {
			return o();
		},
		get enabled() {
			return t.enabled;
		},
		get onInteractOutside() {
			return t.onInteractOutside;
		},
		get onCloseAutoFocus() {
			return t.onCloseAutoFocus;
		},
		get onOpenAutoFocus() {
			return t.onOpenAutoFocus;
		},
		get interactOutsideBehavior() {
			return n();
		},
		get loop() {
			return t.loop;
		},
		get trapFocus() {
			return r();
		},
		get isValidEvent() {
			return i();
		},
		get onFocusOutside() {
			return t.onFocusOutside;
		}
	}, () => s, { forceMount: !0 }));
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var dg = ms({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), fg = new Bo("DateField.Root"), pg = class e {
	static create(t, n) {
		return fg.set(new e(t, n));
	}
	value;
	placeholder;
	validate;
	minValue;
	maxValue;
	disabled;
	readonly;
	granularity;
	readonlySegments;
	hourCycle;
	locale;
	hideTimeZone;
	required;
	onInvalid;
	errorMessageId;
	isInvalidProp;
	descriptionId = tl();
	formatter;
	initialSegments;
	#e = /* @__PURE__ */ j();
	get segmentValues() {
		return B(this.#e);
	}
	set segmentValues(e) {
		M(this.#e, e, !0);
	}
	announcer;
	#t = /* @__PURE__ */ k(() => new Set(this.readonlySegments.current));
	get readonlySegmentsSet() {
		return B(this.#t);
	}
	set readonlySegmentsSet(e) {
		M(this.#t, e);
	}
	segmentStates = Wd();
	#n = /* @__PURE__ */ j(null);
	#r = /* @__PURE__ */ j(null);
	#i = /* @__PURE__ */ j(null);
	get descriptionNode() {
		return B(this.#i);
	}
	set descriptionNode(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(null);
	get validationNode() {
		return B(this.#a);
	}
	set validationNode(e) {
		M(this.#a, e, !0);
	}
	states = Wd();
	#o = !1;
	#s = /* @__PURE__ */ j(null);
	get dayPeriodNode() {
		return B(this.#s);
	}
	set dayPeriodNode(e) {
		M(this.#s, e, !0);
	}
	rangeRoot = void 0;
	#c = /* @__PURE__ */ j("");
	get name() {
		return B(this.#c);
	}
	set name(e) {
		M(this.#c, e, !0);
	}
	domContext = new ss(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? $a(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = pf({
			initialLocale: this.locale.current,
			monthFormat: X(() => "long"),
			yearFormat: X(() => "numeric")
		}), this.initialSegments = zd(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = cd(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), I(() => {
			Tr(() => {
				this.initialSegments = zd(this.inferredGranularity);
			});
		}), fi(() => {
			this.announcer = cd(this.domContext.getDocument());
		}), qo(() => {
			t || rf(this.descriptionId, this.domContext.getDocument());
		}), I(() => {
			t || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), I(() => {
			if (t) return;
			this.value.current && nf({
				id: Tr(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = Tr(() => this.placeholder.current);
			this.value.current && e !== this.value.current && Tr(() => {
				this.value.current && (this.placeholder.current = this.value.current);
			});
		}), this.value.current && this.syncSegmentValues(this.value.current), I(() => {
			this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#l();
		}), I(() => {
			if (this.value.current === void 0) {
				if (this.#o) {
					this.#o = !1;
					return;
				}
				this.segmentValues = zd(this.inferredGranularity);
			}
		}), Uo(() => this.validationStatus, () => {
			this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
		});
	}
	setName(e) {
		this.name = e;
	}
	setFieldNode(e) {
		M(this.#n, e, !0);
	}
	getFieldNode() {
		return this.rangeRoot ? this.rangeRoot.fieldNode : B(this.#n);
	}
	setLabelNode(e) {
		M(this.#r, e, !0);
	}
	getLabelNode() {
		return this.rangeRoot ? this.rangeRoot.labelNode : B(this.#r);
	}
	#l() {
		this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
	}
	setValue(e) {
		this.value.current = e;
	}
	syncSegmentValues(e) {
		let t = Cd.map((t) => {
			let n = e[t];
			if (t === "month") {
				if (this.states.month.updating) return [t, this.states.month.updating];
				if (n < 10) return [t, `0${n}`];
			}
			if (t === "day") {
				if (this.states.day.updating) return [t, this.states.day.updating];
				if (n < 10) return [t, `0${n}`];
			}
			if (t === "year") {
				if (this.states.year.updating) return [t, this.states.year.updating];
				let e = 4 - `${n}`.length;
				if (e > 0) return [t, `${"0".repeat(e)}${n}`];
			}
			return [t, `${n}`];
		});
		if ("hour" in e) {
			let n = wd.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(fd(e))];
				if (t === "hour") {
					if (this.states.hour.updating) return [t, this.states.hour.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
					if (e[t] === 0 && this.dayPeriodNode) return [t, "12"];
				} else if (t === "minute") {
					if (this.states.minute.updating) return [t, this.states.minute.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
				} else if (t === "second") {
					if (this.states.second.updating) return [t, this.states.second.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
				}
				return [t, `${e[t]}`];
			}), r = [...t, ...n];
			this.segmentValues = Object.fromEntries(r), this.#l();
			return;
		}
		this.segmentValues = Object.fromEntries(t);
	}
	#u = /* @__PURE__ */ k(() => {
		let e = this.value.current;
		if (!e) return !1;
		let t = this.validate.current?.(e);
		if (t) return {
			reason: "custom",
			message: t
		};
		let n = this.minValue.current;
		if (n && yd(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && yd(r, e) ? { reason: "max" } : !1;
	});
	get validationStatus() {
		return B(this.#u);
	}
	set validationStatus(e) {
		M(this.#u, e);
	}
	#d = /* @__PURE__ */ k(() => this.validationStatus !== !1 && (this.isInvalidProp.current, !0));
	get isInvalid() {
		return B(this.#d);
	}
	set isInvalid(e) {
		M(this.#d, e);
	}
	#f = /* @__PURE__ */ k(() => this.granularity.current || ef(this.placeholder.current, this.granularity.current));
	get inferredGranularity() {
		return B(this.#f);
	}
	set inferredGranularity(e) {
		M(this.#f, e);
	}
	#p = /* @__PURE__ */ k(() => this.value.current === void 0 ? this.placeholder.current : this.value.current);
	get dateRef() {
		return B(this.#p);
	}
	set dateRef(e) {
		M(this.#p, e);
	}
	#m = /* @__PURE__ */ k(() => Hd({
		segmentValues: this.segmentValues,
		formatter: this.formatter,
		locale: this.locale.current,
		granularity: this.inferredGranularity,
		dateRef: this.dateRef,
		hideTimeZone: this.hideTimeZone.current,
		hourCycle: this.hourCycle.current
	}));
	get allSegmentContent() {
		return B(this.#m);
	}
	set allSegmentContent(e) {
		M(this.#m, e);
	}
	#h = /* @__PURE__ */ k(() => this.allSegmentContent.arr);
	get segmentContents() {
		return B(this.#h);
	}
	set segmentContents(e) {
		M(this.#h, e);
	}
	sharedSegmentAttrs = {
		role: "spinbutton",
		contenteditable: "true",
		tabindex: 0,
		spellcheck: !1,
		inputmode: "numeric",
		autocorrect: "off",
		enterkeyhint: "next",
		style: { caretColor: "transparent" },
		onbeforeinput: (e) => {
			(!e.data || e.data.length <= 1) && e.preventDefault();
		}
	};
	#g(e) {
		return `${e} ${this.getLabelNode()?.id ?? ""}`;
	}
	updateSegment(e, t) {
		let n = this.disabled.current, r = this.readonly.current, i = this.readonlySegmentsSet;
		if (n || r || i.has(e)) return;
		let a = this.segmentValues, o = a, s = this.placeholder.current;
		if ($d(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = vd(fd(s.set({ month: Number.parseInt(t) })));
					Number.parseInt(a.day) > e && (a.day = `${e}`);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "dayPeriod") {
				let t = r(n);
				this.states.dayPeriod.updating = t;
				let i = this.value.current;
				if (i && "hour" in i) {
					let e = i.hour;
					t === "AM" ? e >= 12 && (a.hour = `${e - 12}`) : t === "PM" && e < 12 && (a.hour = `${e + 12}`);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "hour") {
				let t = r(n);
				if (this.states.hour.updating = t, t !== null && a.dayPeriod !== null) {
					let e = this.formatter.dayPeriod(fd(s.set({ hour: Number.parseInt(t) })), this.hourCycle.current);
					(e === "AM" || e === "PM") && (a.dayPeriod = e);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "minute") {
				let t = r(n);
				this.states.minute.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "second") {
				let t = r(n);
				this.states.second.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "year") {
				let t = r(n);
				this.states.year.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "day") {
				let t = r(n);
				this.states.day.updating = t, o = {
					...a,
					[e]: t
				};
			} else {
				let t = r(n);
				o = {
					...a,
					[e]: t
				};
			}
		} else if (Gd(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = vd(fd(s.set({ month: Number.parseInt(i) })));
				Number.parseInt(a.day) > t && (a.day = `${t}`), o = {
					...a,
					[e]: i
				};
			} else if (e === "year") {
				let t = r(n);
				this.states.year.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "day") {
				let t = r(n);
				this.states.day.updating = t, o = {
					...a,
					[e]: t
				};
			} else o = {
				...a,
				[e]: i
			};
		}
		this.segmentValues = o, Qd(o, B(this.#n)) ? this.setValue(Zd({
			segmentObj: o,
			fieldNode: B(this.#n),
			dateRef: this.placeholder.current
		})) : (this.#o = !0, this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": us(this.isInvalid),
			"aria-disabled": ls(this.disabled.current),
			"aria-readonly": ls(this.readonly.current || n),
			"data-invalid": Q(this.isInvalid),
			"data-disabled": Q(this.disabled.current),
			"data-readonly": Q(this.readonly.current || n),
			"data-segment": `${e}`,
			[dg.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = tf(t, B(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, mg = class e {
	static create(t) {
		return new e(t, fg.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new ss(e.ref), this.root.domContext = this.domContext, this.attachment = cs(e.ref, (e) => this.root.setFieldNode(e)), Uo(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = /* @__PURE__ */ k(() => {
		if (bs && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": B(this.#e),
		"aria-disabled": ls(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": Q(this.root.disabled.current),
		[dg.input]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
}, hg = class e {
	static create() {
		return new e(fg.get());
	}
	root;
	#e = /* @__PURE__ */ k(() => this.root.name !== "");
	get shouldRender() {
		return B(this.#e);
	}
	set shouldRender(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => this.root.value.current ? this.root.value.current.toString() : "");
	get isoValue() {
		return B(this.#t);
	}
	set isoValue(e) {
		M(this.#t, e);
	}
	constructor(e) {
		this.root = e;
	}
	#n = /* @__PURE__ */ k(() => ({
		name: this.root.name,
		value: this.isoValue,
		required: this.root.required.current
	}));
	get props() {
		return B(this.#n);
	}
	set props(e) {
		M(this.#n, e);
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function gg(e, t) {
	D(t, !0);
	let n = hg.create();
	var r = H(), i = P(r), a = (e) => {
		Lp(e, ya(() => n.props));
	};
	G(i, (e) => {
		n.shouldRender && e(a);
	}), U(e, r), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var _g = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), vg = /* @__PURE__ */ V("<div><!></div>"), yg = /* @__PURE__ */ V("<!> <!>", 1);
function bg(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = Y(t, "name", 3, ""), o = /* @__PURE__ */ J(t, _g), s = mg.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		name: X(() => a())
	}), c = /* @__PURE__ */ k(() => Z(o, s.props));
	var l = yg(), u = P(l), d = (e) => {
		var n = H();
		W(P(n), () => t.child, () => ({
			props: B(c),
			segments: s.root.segmentContents
		})), U(e, n);
	}, f = (e) => {
		var n = vg();
		q(n, () => ({ ...B(c) })), W(N(n), () => t.children ?? g, () => ({ segments: s.root.segmentContents })), E(n), U(e, n);
	};
	G(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), gg(F(u, 2), {}), U(e, l), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var xg = new Bo("DatePicker.Root"), Sg = class e {
	static create(t) {
		return xg.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/internal/safe-polygon.svelte.js
function Cg(e, t) {
	let [n, r] = e, i = !1, a = t.length;
	for (let e = 0, o = a - 1; e < a; o = e++) {
		let [a, s] = t[e] ?? [0, 0], [c, l] = t[o] ?? [0, 0];
		s >= r != l >= r && n <= (c - a) * (r - s) / (l - s) + a && (i = !i);
	}
	return i;
}
function wg(e, t) {
	return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom;
}
function Tg(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
var Eg = class {
	#e;
	#t;
	#n;
	#r = null;
	#i = null;
	#a = [];
	#o = null;
	#s = null;
	#c = null;
	#l() {
		this.#s !== null && (cancelAnimationFrame(this.#s), this.#s = null);
	}
	#u() {
		this.#l(), this.#s = requestAnimationFrame(() => {
			this.#s = null, this.#r && this.#i && (this.#m(), this.#e.onPointerExit());
		});
	}
	#d() {
		this.#c !== null && (clearTimeout(this.#c), this.#c = null);
	}
	#f() {
		this.#n !== null && (this.#d(), this.#c = window.setTimeout(() => {
			this.#c = null, this.#r && this.#i && (this.#m(), this.#e.onPointerExit());
		}, this.#n));
	}
	constructor(e) {
		this.#e = e, this.#t = e.buffer ?? 1;
		let t = e.transitIntentTimeout;
		this.#n = typeof t == "number" && t > 0 ? t : null, Uo([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (!e || !t || !n) {
				this.#o = null, this.#m();
				return;
			}
			return this.#o && this.#o !== e && this.#m(), this.#o = e, [
				Mr(is(e), "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				Mr(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (ws(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					ws(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = ws(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				Mr(e, "pointerenter", () => {
					this.#m();
				}),
				Mr(t, "pointerenter", () => {
					this.#m();
				}),
				Mr(t, "pointerleave", (t) => {
					let n = t.relatedTarget;
					ws(n) && e.contains(n) || (this.#r = [t.clientX, t.clientY], this.#i = "trigger", this.#u());
				})
			].reduce((e, t) => () => {
				e(), t();
			}, () => {});
		});
	}
	#p(e, t, n) {
		if (!this.#r || !this.#i) return;
		this.#l(), this.#f();
		let r = t.getBoundingClientRect(), i = n.getBoundingClientRect();
		if (this.#i === "content" && wg(e, i)) {
			this.#m();
			return;
		}
		if (this.#i === "trigger" && wg(e, r)) {
			this.#m();
			return;
		}
		if (this.#i === "content" && this.#a.length > 0) for (let t of this.#a) {
			let n = t.getBoundingClientRect();
			if (wg(e, n)) return;
			let i = Tg(r, n), a = this.#h(r, n, i);
			if (a && Cg(e, a)) return;
		}
		let a = Tg(r, i), o = this.#h(r, i, a);
		if (o && Cg(e, o)) return;
		let s = this.#i === "content" ? i : r;
		Cg(e, this.#g(this.#r, s, a, this.#i)) || (this.#m(), this.#e.onPointerExit());
	}
	#m() {
		this.#r = null, this.#i = null, this.#a = [], this.#l(), this.#d();
	}
	#h(e, t, n) {
		let r = this.#t;
		switch (n) {
			case "top": return [
				[Math.min(e.left, t.left) - r, e.top],
				[Math.min(e.left, t.left) - r, t.bottom],
				[Math.max(e.right, t.right) + r, t.bottom],
				[Math.max(e.right, t.right) + r, e.top]
			];
			case "bottom": return [
				[Math.min(e.left, t.left) - r, e.bottom],
				[Math.min(e.left, t.left) - r, t.top],
				[Math.max(e.right, t.right) + r, t.top],
				[Math.max(e.right, t.right) + r, e.bottom]
			];
			case "left": return [
				[e.left, Math.min(e.top, t.top) - r],
				[t.right, Math.min(e.top, t.top) - r],
				[t.right, Math.max(e.bottom, t.bottom) + r],
				[e.left, Math.max(e.bottom, t.bottom) + r]
			];
			case "right": return [
				[e.right, Math.min(e.top, t.top) - r],
				[t.left, Math.min(e.top, t.top) - r],
				[t.left, Math.max(e.bottom, t.bottom) + r],
				[e.right, Math.max(e.bottom, t.bottom) + r]
			];
		}
	}
	#g(e, t, n, r) {
		let i = this.#t * 4, [a, o] = e;
		switch (r === "trigger" ? this.#_(n) : n) {
			case "top": return [
				[a - i, o + i],
				[a + i, o + i],
				[t.right + i, t.bottom],
				[t.right + i, t.top],
				[t.left - i, t.top],
				[t.left - i, t.bottom]
			];
			case "bottom": return [
				[a - i, o - i],
				[a + i, o - i],
				[t.right + i, t.top],
				[t.right + i, t.bottom],
				[t.left - i, t.bottom],
				[t.left - i, t.top]
			];
			case "left": return [
				[a + i, o - i],
				[a + i, o + i],
				[t.right, t.bottom + i],
				[t.left, t.bottom + i],
				[t.left, t.top - i],
				[t.right, t.top - i]
			];
			case "right": return [
				[a - i, o - i],
				[a - i, o + i],
				[t.left, t.bottom + i],
				[t.right, t.bottom + i],
				[t.right, t.top - i],
				[t.left, t.top - i]
			];
		}
	}
	#_(e) {
		switch (e) {
			case "top": return "bottom";
			case "bottom": return "top";
			case "left": return "right";
			case "right": return "left";
		}
	}
}, Dg = ms({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
}), Og = new Bo("Popover.Root"), kg = class e {
	static create(t) {
		return Og.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ j(null);
	get contentNode() {
		return B(this.#e);
	}
	set contentNode(e) {
		M(this.#e, e, !0);
	}
	contentPresence;
	#t = /* @__PURE__ */ j(null);
	get triggerNode() {
		return B(this.#t);
	}
	set triggerNode(e) {
		M(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ j(null);
	get overlayNode() {
		return B(this.#n);
	}
	set overlayNode(e) {
		M(this.#n, e, !0);
	}
	overlayPresence;
	#r = /* @__PURE__ */ j(!1);
	get openedViaHover() {
		return B(this.#r);
	}
	set openedViaHover(e) {
		M(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ j(!1);
	get hasInteractedWithContent() {
		return B(this.#i);
	}
	set hasInteractedWithContent(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(!1);
	get hoverCooldown() {
		return B(this.#a);
	}
	set hoverCooldown(e) {
		M(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ j(0);
	get closeDelay() {
		return B(this.#o);
	}
	set closeDelay(e) {
		M(this.#o, e, !0);
	}
	#s = null;
	#c = null;
	constructor(e) {
		this.opts = e, this.contentPresence = new As({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new As({
			ref: X(() => this.overlayNode),
			open: this.opts.open
		}), Uo(() => this.opts.open.current, (e) => {
			e || (this.openedViaHover = !1, this.hasInteractedWithContent = !1, this.#l());
		});
	}
	setDomContext(e) {
		this.#c = e;
	}
	#l() {
		this.#s !== null && this.#c && (this.#c.clearTimeout(this.#s), this.#s = null);
	}
	toggleOpen() {
		this.#l(), this.opts.open.current = !this.opts.open.current;
	}
	handleClose() {
		this.#l(), this.opts.open.current && (this.opts.open.current = !1);
	}
	handleHoverOpen() {
		this.#l(), !this.opts.open.current && (this.openedViaHover = !0, this.opts.open.current = !0);
	}
	handleHoverClose() {
		this.opts.open.current && this.openedViaHover && !this.hasInteractedWithContent && (this.opts.open.current = !1);
	}
	handleDelayedHoverClose() {
		this.opts.open.current && this.openedViaHover && !this.hasInteractedWithContent && (this.#l(), this.closeDelay <= 0 ? this.opts.open.current = !1 : this.#c && (this.#s = this.#c.setTimeout(() => {
			this.openedViaHover && !this.hasInteractedWithContent && (this.opts.open.current = !1), this.#s = null;
		}, this.closeDelay)));
	}
	cancelDelayedClose() {
		this.#l();
	}
	markInteraction() {
		this.hasInteractedWithContent = !0, this.#l();
	}
}, Ag = class e {
	static create(t) {
		return new e(t, Og.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ j(!1);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref, (e) => this.root.triggerNode = e), this.domContext = new ss(e.ref), this.root.setDomContext(this.domContext), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), Uo(() => this.opts.closeDelay.current, (e) => {
			this.root.closeDelay = e;
		});
	}
	#r() {
		this.#e !== null && (this.domContext.clearTimeout(this.#e), this.#e = null);
	}
	#i() {
		this.#t !== null && (this.domContext.clearTimeout(this.#t), this.#t = null);
	}
	#a() {
		this.#r(), this.#i();
	}
	onpointerenter(e) {
		if (this.opts.disabled.current || !this.opts.openOnHover.current || Ds(e) || (M(this.#n, !0), this.#i(), this.root.cancelDelayedClose(), this.root.opts.open.current || this.root.hoverCooldown)) return;
		let t = this.opts.openDelay.current;
		t <= 0 ? this.root.handleHoverOpen() : this.#e = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen(), this.#e = null;
		}, t);
	}
	onpointerleave(e) {
		this.opts.disabled.current || this.opts.openOnHover.current && (Ds(e) || (M(this.#n, !1), this.#r(), this.root.hoverCooldown = !1));
	}
	onclick(e) {
		if (!this.opts.disabled.current && e.button === 0) {
			if (this.#a(), B(this.#n) && this.root.opts.open.current && this.root.openedViaHover) {
				this.root.openedViaHover = !1, this.root.hasInteractedWithContent = !0;
				return;
			}
			B(this.#n) && this.opts.openOnHover.current && this.root.opts.open.current && (this.root.hoverCooldown = !0), this.root.hoverCooldown && !this.root.opts.open.current && (this.root.hoverCooldown = !1), this.root.toggleOpen();
		}
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.#a(), this.root.toggleOpen());
	}
	#o() {
		if (this.root.opts.open.current && this.root.contentNode?.id) return this.root.contentNode?.id;
	}
	#s = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": ls(this.root.opts.open.current),
		"data-state": ds(this.root.opts.open.current),
		"aria-controls": this.#o(),
		[Dg.trigger]: "",
		disabled: this.opts.disabled.current,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return B(this.#s);
	}
	set props(e) {
		M(this.#s, e);
	}
}, jg = class e {
	static create(t) {
		return new e(t, Og.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = cs(this.opts.ref, (e) => this.root.contentNode = e), this.onpointerdown = this.onpointerdown.bind(this), this.onfocusin = this.onfocusin.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), new Eg({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
			onPointerExit: () => {
				this.root.handleDelayedHoverClose();
			}
		});
	}
	onpointerdown(e) {
		this.root.markInteraction();
	}
	onfocusin(e) {
		let t = e.target;
		ws(t) && Uc(t) && this.root.markInteraction();
	}
	onpointerenter(e) {
		Ds(e) || this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		Ds(e);
	}
	onInteractOutside = (e) => {
		if (this.opts.onInteractOutside.current(e), e.defaultPrevented || !ws(e.target)) return;
		let t = e.target.closest(Dg.selector("trigger"));
		if (!(t && t === this.root.triggerNode)) {
			if (this.opts.customAnchor.current) {
				if (ws(this.opts.customAnchor.current)) {
					if (this.opts.customAnchor.current.contains(e.target)) return;
				} else if (typeof this.opts.customAnchor.current == "string") {
					let t = document.querySelector(this.opts.customAnchor.current);
					if (t && t.contains(e.target)) return;
				}
			}
			this.root.handleClose();
		}
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e), !e.defaultPrevented && this.root.handleClose();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	get shouldTrapFocus() {
		return !(this.root.openedViaHover && !this.root.hasInteractedWithContent);
	}
	#e = /* @__PURE__ */ k(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return B(this.#e);
	}
	set snippetProps(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		"data-state": ds(this.root.opts.open.current),
		...fs(this.root.contentPresence.transitionStatus),
		[Dg.content]: "",
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		onpointerdown: this.onpointerdown,
		onfocusin: this.onfocusin,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown
	};
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function Mg(e, t) {
	D(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $), a = Y(t, "value", 15), o = Y(t, "onValueChange", 3, $), s = Y(t, "placeholder", 15), c = Y(t, "onPlaceholderChange", 3, $), l = Y(t, "isDateUnavailable", 3, () => !1), u = Y(t, "validate", 3, $), d = Y(t, "onInvalid", 3, $), f = Y(t, "disabled", 3, !1), p = Y(t, "readonly", 3, !1), m = Y(t, "readonlySegments", 19, () => []), h = Y(t, "hideTimeZone", 3, !1), _ = Y(t, "required", 3, !1), v = Y(t, "calendarLabel", 3, "Event"), y = Y(t, "disableDaysOutsideMonth", 3, !0), b = Y(t, "preventDeselect", 3, !1), x = Y(t, "pagedNavigation", 3, !1), S = Y(t, "weekdayFormat", 3, "narrow"), C = Y(t, "isDateDisabled", 3, () => !1), ee = Y(t, "fixedWeeks", 3, !1), te = Y(t, "numberOfMonths", 3, 1), ne = Y(t, "closeOnDateSelect", 3, !0), re = Y(t, "initialFocus", 3, !1), ie = Y(t, "monthFormat", 3, "long"), ae = Y(t, "yearFormat", 3, "numeric"), oe = ud({
		granularity: t.granularity,
		defaultValue: a(),
		minValue: t.minValue,
		maxValue: t.maxValue
	});
	function se() {
		s() === void 0 && s(oe);
	}
	se(), Uo.pre(() => s(), () => {
		se();
	});
	function ce() {
		ne() && n(!1);
	}
	let le = Sg.create({
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		value: X(() => a(), (e) => {
			a(e), o()(e);
		}),
		placeholder: X(() => s(), (e) => {
			s(e), c()(e);
		}),
		isDateUnavailable: X(() => l()),
		minValue: X(() => t.minValue),
		maxValue: X(() => t.maxValue),
		disabled: X(() => f()),
		readonly: X(() => p()),
		granularity: X(() => t.granularity),
		readonlySegments: X(() => m()),
		hourCycle: X(() => t.hourCycle),
		locale: Js(() => t.locale),
		hideTimeZone: X(() => h()),
		required: X(() => _()),
		calendarLabel: X(() => v()),
		disableDaysOutsideMonth: X(() => y()),
		preventDeselect: X(() => b()),
		pagedNavigation: X(() => x()),
		weekStartsOn: X(() => t.weekStartsOn),
		weekdayFormat: X(() => S()),
		isDateDisabled: X(() => C()),
		fixedWeeks: X(() => ee()),
		numberOfMonths: X(() => te()),
		initialFocus: X(() => re()),
		onDateSelect: X(() => ce),
		defaultPlaceholder: oe,
		monthFormat: X(() => ie()),
		yearFormat: X(() => ae())
	});
	kg.create({
		open: le.opts.open,
		onOpenChangeComplete: X(() => i())
	}), pg.create({
		value: le.opts.value,
		disabled: le.opts.disabled,
		readonly: le.opts.readonly,
		readonlySegments: le.opts.readonlySegments,
		validate: X(() => u()),
		onInvalid: X(() => d()),
		minValue: le.opts.minValue,
		maxValue: le.opts.maxValue,
		granularity: le.opts.granularity,
		hideTimeZone: le.opts.hideTimeZone,
		hourCycle: le.opts.hourCycle,
		locale: le.opts.locale,
		required: le.opts.required,
		placeholder: le.opts.placeholder,
		errorMessageId: X(() => t.errorMessageId),
		isInvalidProp: X(() => void 0)
	});
	var ue = H();
	K(P(ue), () => Hp, (e, n) => {
		n(e, {
			children: (e, n) => {
				var r = H();
				W(P(r), () => t.children ?? g), U(e, r);
			},
			$$slots: { default: !0 }
		});
	}), U(e, ue), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Ng = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), Pg = /* @__PURE__ */ V("<div><!></div>");
function Fg(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ J(t, Ng), o = xg.get(), s = Uf.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		calendarLabel: o.opts.calendarLabel,
		fixedWeeks: o.opts.fixedWeeks,
		isDateDisabled: o.opts.isDateDisabled,
		isDateUnavailable: o.opts.isDateUnavailable,
		locale: o.opts.locale,
		numberOfMonths: o.opts.numberOfMonths,
		pagedNavigation: o.opts.pagedNavigation,
		preventDeselect: o.opts.preventDeselect,
		readonly: o.opts.readonly,
		type: X(() => "single"),
		weekStartsOn: o.opts.weekStartsOn,
		weekdayFormat: o.opts.weekdayFormat,
		disabled: o.opts.disabled,
		disableDaysOutsideMonth: o.opts.disableDaysOutsideMonth,
		maxValue: o.opts.maxValue,
		minValue: o.opts.minValue,
		placeholder: o.opts.placeholder,
		value: o.opts.value,
		onDateSelect: o.opts.onDateSelect,
		initialFocus: o.opts.initialFocus,
		defaultPlaceholder: o.opts.defaultPlaceholder,
		maxDays: X(() => void 0),
		monthFormat: o.opts.monthFormat,
		yearFormat: o.opts.yearFormat
	}), c = /* @__PURE__ */ k(() => Z(a, s.props));
	var l = H(), u = P(l), d = (e) => {
		var n = H(), r = P(n);
		{
			let e = /* @__PURE__ */ k(() => ({
				props: B(c),
				...s.snippetProps
			}));
			W(r, () => t.child, () => B(e));
		}
		U(e, n);
	}, f = (e) => {
		var n = Pg();
		q(n, () => ({ ...B(c) })), W(N(n), () => t.children ?? g, () => s.snippetProps), E(n), U(e, n);
	};
	G(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), U(e, l), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/popover/components/popover-content-static.svelte
var Ig = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"ref",
	"id",
	"forceMount",
	"onCloseAutoFocus",
	"onEscapeKeydown",
	"onInteractOutside",
	"trapFocus",
	"preventScroll",
	"style"
]), Lg = /* @__PURE__ */ V("<div><!></div>");
function Rg(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => js(n)), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onEscapeKeydown", 3, $), c = Y(t, "onInteractOutside", 3, $), l = Y(t, "trapFocus", 3, !0), u = Y(t, "preventScroll", 3, !1), d = /* @__PURE__ */ J(t, Ig), f = jg.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		onInteractOutside: X(() => c()),
		onEscapeKeydown: X(() => s()),
		customAnchor: X(() => null)
	}), p = /* @__PURE__ */ k(() => Z(d, f.props));
	var m = H(), h = P(m), _ = (e) => {
		ug(e, ya(() => B(p), () => f.popperProps, {
			get ref() {
				return f.opts.ref;
			},
			isStatic: !0,
			get enabled() {
				return f.root.opts.open.current;
			},
			get id() {
				return i();
			},
			get trapFocus() {
				return l();
			},
			get preventScroll() {
				return u();
			},
			loop: !0,
			forceMount: !0,
			get onCloseAutoFocus() {
				return o();
			},
			get shouldRender() {
				return f.shouldRender;
			},
			popper: (e, n) => {
				let r = () => (n?.()).props, i = /* @__PURE__ */ k(() => Z(r(), { style: Kp("popover") }, { style: t.style }));
				var a = H(), o = P(a), s = (e) => {
					var n = H(), r = P(n);
					{
						let e = /* @__PURE__ */ k(() => ({
							props: B(i),
							...f.snippetProps
						}));
						W(r, () => t.child, () => B(e));
					}
					U(e, n);
				}, c = (e) => {
					var n = Lg();
					q(n, () => ({ ...B(i) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
				};
				G(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), U(e, a);
			},
			$$slots: { popper: !0 }
		}));
	}, v = (e) => {
		cg(e, ya(() => B(p), () => f.popperProps, {
			get ref() {
				return f.opts.ref;
			},
			isStatic: !0,
			get open() {
				return f.root.opts.open.current;
			},
			get id() {
				return i();
			},
			get trapFocus() {
				return l();
			},
			get preventScroll() {
				return u();
			},
			loop: !0,
			forceMount: !1,
			get onCloseAutoFocus() {
				return o();
			},
			get shouldRender() {
				return f.shouldRender;
			},
			popper: (e, n) => {
				let r = () => (n?.()).props, i = /* @__PURE__ */ k(() => Z(r(), { style: Kp("popover") }, { style: t.style }));
				var a = H(), o = P(a), s = (e) => {
					var n = H(), r = P(n);
					{
						let e = /* @__PURE__ */ k(() => ({
							props: B(i),
							...f.snippetProps
						}));
						W(r, () => t.child, () => B(e));
					}
					U(e, n);
				}, c = (e) => {
					var n = Lg();
					q(n, () => ({ ...B(i) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
				};
				G(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), U(e, a);
			},
			$$slots: { popper: !0 }
		}));
	};
	G(h, (e) => {
		a() ? e(_) : a() || e(v, 1);
	}), U(e, m), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content-static.svelte
var zg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function Bg(e, t) {
	D(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ J(t, zg), i = /* @__PURE__ */ k(() => Z({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: If }));
	Rg(e, ya(() => B(i), () => r, {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
var Vg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"type",
	"disabled",
	"openOnHover",
	"openDelay",
	"closeDelay"
]), Hg = /* @__PURE__ */ V("<button><!></button>");
function Ug(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = Y(t, "type", 3, "button"), o = Y(t, "disabled", 3, !1), s = Y(t, "openOnHover", 3, !1), c = Y(t, "openDelay", 3, 700), l = Y(t, "closeDelay", 3, 300), u = /* @__PURE__ */ J(t, Vg), d = Ag.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		disabled: X(() => !!o()),
		openOnHover: X(() => s()),
		openDelay: X(() => c()),
		closeDelay: X(() => l())
	}), f = /* @__PURE__ */ k(() => Z(u, d.props, { type: a() }));
	qp(e, {
		get id() {
			return r();
		},
		get ref() {
			return d.opts.ref;
		},
		children: (e, n) => {
			var r = H(), i = P(r), a = (e) => {
				var n = H();
				W(P(n), () => t.child, () => ({ props: B(f) })), U(e, n);
			}, o = (e) => {
				var n = Hg();
				q(n, () => ({ ...B(f) })), W(N(n), () => t.children ?? g), E(n), U(e, n);
			};
			G(i, (e) => {
				t.child ? e(a) : e(o, -1);
			}), U(e, r);
		},
		$$slots: { default: !0 }
	}), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var Wg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function Gg(e, t) {
	D(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ J(t, Wg);
	function i(e) {
		if (uf(e.key)) {
			let t = e.currentTarget.closest(dg.selector("input"));
			if (!t) return;
			of(e, t);
		}
	}
	let a = /* @__PURE__ */ k(() => Z({ onkeydown: t.onkeydown }, { onkeydown: i }));
	Ug(e, ya(() => r, { "data-segment": "trigger" }, () => B(a), {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function Kg(e, t) {
	D(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $);
	Ps.create({
		variant: X(() => "dialog"),
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		onOpenChangeComplete: X(() => i())
	});
	var a = H();
	W(P(a), () => t.children ?? g), U(e, a), O();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.3_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_4d3058bf8b6a54bdb6d340dcc53e2528/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
var qg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref",
	"forceMount",
	"onCloseAutoFocus",
	"onOpenAutoFocus",
	"onEscapeKeydown",
	"onInteractOutside",
	"trapFocus",
	"preventScroll",
	"preventOverflowTextSelection",
	"restoreScrollDelay"
]), Jg = /* @__PURE__ */ V("<!> <!>", 1), Yg = /* @__PURE__ */ V("<!> <div><!></div>", 1);
function Xg(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "id", 19, () => js(n)), i = Y(t, "ref", 15, null), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onOpenAutoFocus", 3, $), c = Y(t, "onEscapeKeydown", 3, $), l = Y(t, "onInteractOutside", 3, $), u = Y(t, "trapFocus", 3, !0), d = Y(t, "preventScroll", 3, !0), f = Y(t, "preventOverflowTextSelection", 3, !0), p = Y(t, "restoreScrollDelay", 3, null), m = /* @__PURE__ */ J(t, qg), h = Ls.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), _ = /* @__PURE__ */ k(() => Z(m, h.props));
	var v = H(), y = P(v), b = (e) => {
		qc(e, {
			get ref() {
				return h.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return u();
			},
			get enabled() {
				return h.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return s();
			},
			get onCloseAutoFocus() {
				return o();
			},
			focusScope: (e, n) => {
				let r = () => (n?.()).props;
				dc(e, ya(() => B(_), {
					get enabled() {
						return h.root.opts.open.current;
					},
					get ref() {
						return h.opts.ref;
					},
					onEscapeKeydown: (e) => {
						c()(e), !e.defaultPrevented && h.root.handleClose();
					},
					children: (e, n) => {
						cc(e, ya(() => B(_), {
							get ref() {
								return h.opts.ref;
							},
							get enabled() {
								return h.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								l()(e), !e.defaultPrevented && h.root.handleClose();
							},
							children: (e, n) => {
								el(e, ya(() => B(_), {
									get preventOverflowTextSelection() {
										return f();
									},
									get ref() {
										return h.opts.ref;
									},
									get enabled() {
										return h.root.opts.open.current;
									},
									children: (e, n) => {
										var i = H(), a = P(i), o = (e) => {
											var n = Jg(), i = P(n), a = (e) => {
												pl(e, {
													get preventScroll() {
														return d();
													},
													get restoreScrollDelay() {
														return p();
													}
												});
											};
											G(i, (e) => {
												h.root.opts.open.current && e(a);
											});
											var o = F(i, 2);
											{
												let e = /* @__PURE__ */ k(() => ({
													props: Z(B(_), r()),
													...h.snippetProps
												}));
												W(o, () => t.child, () => B(e));
											}
											U(e, n);
										}, s = (e) => {
											var n = Yg(), i = P(n);
											pl(i, { get preventScroll() {
												return d();
											} });
											var a = F(i, 2);
											q(a, (e) => ({ ...e }), [() => Z(B(_), r())]), W(N(a), () => t.children ?? g), E(a), U(e, n);
										};
										G(a, (e) => {
											t.child ? e(o) : e(s, -1);
										}), U(e, i);
									},
									$$slots: { default: !0 }
								}));
							},
							$$slots: { default: !0 }
						}));
					},
					$$slots: { default: !0 }
				}));
			},
			$$slots: { focusScope: !0 }
		});
	};
	G(y, (e) => {
		(h.shouldRender || a()) && e(b);
	}), U(e, v), O();
}
//#endregion
//#region packages/ui-kit/src/form/date-field-utils.ts
var Zg = {
	placeholder: "选择日期",
	today: "今天",
	clear: "清除",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`
};
function Qg(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (t) try {
		return zu(t);
	} catch {
		return;
	}
}
function $g(e) {
	return Qg(e) !== void 0;
}
function e_(e) {
	return e ? e.toString() : "";
}
function t_(e) {
	return $g(e) ? Sa(e.trim()) : "";
}
function n_(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
function r_(e, t) {
	return $g(e) ? e.trim() : t;
}
function i_(e, t, n, r) {
	return $g(e) ? e.trim() : !$g(t) || n && t < n || r && t > r ? "" : t;
}
function a_(e, t, n = Zg) {
	let r = t_(t);
	return r ? n.triggerLabeled(e, r) : n.triggerEmpty(e);
}
//#endregion
//#region packages/ui-kit/src/platform/native-bridge.ts
var o_ = "__CHRONOS_NATIVE__";
function s_() {
	if (typeof window > "u") return null;
	let e = window[o_];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/haptic/haptic.ts
var c_ = xa.hapticFeedbackEnabled;
function l_() {
	return s_();
}
function u_() {
	return typeof navigator < "u" && typeof navigator.vibrate == "function";
}
function d_() {
	return u_() ? typeof navigator < "u" && "userActivation" in navigator && navigator.userActivation != null ? navigator.userActivation.hasBeenActive : !0 : !1;
}
function f_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !0;
		let e = localStorage.getItem(Fa(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(c_));
		return e !== "0" && e !== "false";
	} catch {
		return !0;
	}
}
function p_(e) {
	if (!d_()) return !1;
	try {
		return navigator.vibrate(e);
	} catch {
		return !1;
	}
}
function m_(e, t) {
	if (!f_()) return !1;
	let n = l_();
	return n ? (n.callNative("haptic", e.method, e.params ?? {}).catch(() => {
		p_(t);
	}), !0) : p_(t);
}
var h_ = {
	selection: 15,
	light: 12,
	medium: 50,
	heavy: 80,
	success: [
		30,
		60,
		40
	],
	warning: [
		50,
		60,
		50
	]
}, g_ = {
	selection() {
		return m_({ method: "selection" }, h_.selection);
	},
	light() {
		return m_({
			method: "vibrate",
			params: { duration: h_.light }
		}, h_.light);
	},
	medium() {
		return m_({
			method: "impact",
			params: { style: "medium" }
		}, h_.medium);
	},
	heavy() {
		return m_({
			method: "impact",
			params: { style: "heavy" }
		}, h_.heavy);
	},
	success() {
		return m_({
			method: "notification",
			params: { type: "success" }
		}, h_.success);
	},
	warning() {
		return m_({
			method: "notification",
			params: { type: "warning" }
		}, h_.warning);
	},
	cancel() {
		if (d_()) try {
			return navigator.vibrate(0);
		} catch {
			return !1;
		}
		return !1;
	}
}, __ = /* @__PURE__ */ V("<span class=\"ml-0.5 text-error\">*</span>"), v_ = /* @__PURE__ */ V("<p class=\"text-body-small text-supporting mt-1 text-on-surface-variant\"> </p>"), y_ = /* @__PURE__ */ V("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> <!></h3> <!></div>"), b_ = /* @__PURE__ */ V("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> <!></button>"), x_ = /* @__PURE__ */ V("<button><span> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z\"></path></svg></span></button>"), S_ = /* @__PURE__ */ V("<div><!></div>"), C_ = /* @__PURE__ */ V("<div aria-hidden=\"true\" class=\"date-picker-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50\"></div>"), w_ = /* @__PURE__ */ Wr("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path></svg>"), T_ = /* @__PURE__ */ Wr("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path></svg>"), E_ = /* @__PURE__ */ V("<!> <!> <!>", 1), D_ = /* @__PURE__ */ V("<div> </div>"), O_ = /* @__PURE__ */ V("<div></div>"), k_ = /* @__PURE__ */ V("<div><!> <!></div>"), A_ = /* @__PURE__ */ V("<!> <!> <div class=\"mt-3 flex items-center justify-between gap-2 border-t border-outline-variant/40 pt-3\"><div><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-brand hover:bg-brand/10 active:bg-brand/20 disabled:opacity-40\"> </button></div> <div class=\"flex items-center gap-1\"><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-on-surface-variant hover:bg-on-surface/5 disabled:opacity-40\"> </button> <button type=\"button\" class=\"text-label-large h-9 rounded-full bg-brand px-4 text-on-primary active:opacity-90 disabled:opacity-40\"> </button></div></div>", 1), j_ = /* @__PURE__ */ V("<!> <!>", 1), M_ = /* @__PURE__ */ V("<div><!> <!> <!></div>");
function N_(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "value", 15, ""), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "calendarLabel", 19, () => t.label), s = Y(t, "labels", 3, Zg), c = Y(t, "required", 3, !1), l = Y(t, "variant", 3, "field"), u = Y(t, "locale", 3, "zh-CN"), d = /* @__PURE__ */ k(() => t.id ?? n), f = /* @__PURE__ */ k(() => `${B(d)}-label`), p = /* @__PURE__ */ k(() => l() === "section"), m = /* @__PURE__ */ j(!1), h = Wa({
		overlayId: `date-field-${n}`,
		get port() {
			return t.historyPort;
		},
		parent: $e(Ha),
		setOpen: (e) => {
			M(m, e, !0);
		}
	});
	et(Ha, h), I(() => h.syncOpenState(B(m))), pi(() => h.dispose());
	let g = /* @__PURE__ */ j(""), _ = /* @__PURE__ */ j(void 0), v = /* @__PURE__ */ k(() => typeof r() == "string" ? r() : ""), y = /* @__PURE__ */ k(() => t_(B(v))), b = /* @__PURE__ */ k(() => a_(t.label, B(m) ? B(g) : B(v), s())), x = /* @__PURE__ */ k(() => Qg(B(g))), S = /* @__PURE__ */ k(() => t.min ? Qg(t.min) : void 0), C = /* @__PURE__ */ k(() => t.max ? Qg(t.max) : void 0), ee = Fl(Vl()).toString(), te = /* @__PURE__ */ k(() => !!(t.min && ee < t.min || t.max && ee > t.max));
	function ne(e) {
		if (e) {
			let e = Fl(Vl()).toString();
			M(g, i_(B(v), e, t.min, t.max), !0), M(_, Qg(r_(B(g), e)), !0);
		}
	}
	function re(e) {
		let t = e_(e);
		t !== B(g) && (g_.light(), M(g, t, !0));
	}
	function ie() {
		(!c() || B(g)) && (g_.light(), B(g) !== B(v) && (r(B(g)), t.onValueChange?.(B(g))), M(m, !1));
	}
	function ae() {
		let e = Fl(Vl()), n = e.toString();
		t.min && n < t.min || t.max && n > t.max || (g_.light(), M(g, e_(e), !0), M(_, e, !0));
	}
	function oe() {
		c() || (g_.light(), M(g, ""));
	}
	function se() {
		g_.light();
	}
	var ce = k_(), le = N(ce), ue = (e) => {
		var n = y_(), r = N(n), i = N(r), a = F(i), o = (e) => {
			U(e, __());
		};
		G(a, (e) => {
			c() && e(o);
		}), E(r);
		var s = F(r, 2), l = (e) => {
			var n = v_(), r = vn(n, !0);
			L(() => ai(r, t.description)), U(e, n);
		};
		G(s, (e) => {
			t.description && e(l);
		}), E(n), L(() => {
			ta(r, "id", B(f)), ai(i, `${t.label ?? ""} `);
		}), U(e, n);
	};
	G(le, (e) => {
		B(p) && e(ue);
	}), K(F(le, 2), () => Mg, (e, n) => {
		n(e, {
			onOpenChange: ne,
			get value() {
				return B(x);
			},
			onValueChange: re,
			closeOnDateSelect: !1,
			get locale() {
				return u();
			},
			weekdayFormat: "narrow",
			weekStartsOn: 1,
			fixedWeeks: !0,
			get minValue() {
				return B(S);
			},
			get maxValue() {
				return B(C);
			},
			get disabled() {
				return a();
			},
			get calendarLabel() {
				return o();
			},
			get open() {
				return B(m);
			},
			set open(e) {
				M(m, e, !0);
			},
			get placeholder() {
				return B(_);
			},
			set placeholder(e) {
				M(_, e, !0);
			},
			children: (e, n) => {
				var r = M_(), o = N(r), l = (e) => {
					var n = b_(), r = N(n), i = F(r), a = (e) => {
						U(e, __());
					};
					G(i, (e) => {
						c() && e(a);
					}), E(n), L(() => {
						ta(n, "id", B(f)), ai(r, `${t.label ?? ""} `);
					}), Pr("click", n, () => M(m, !0)), U(e, n);
				};
				G(o, (e) => {
					B(p) || e(l);
				});
				var u = F(o, 2);
				{
					let e = (e, t) => {
						let n = () => (t?.()).props;
						var r = S_();
						q(r, () => ({
							...n(),
							id: B(d)
						}));
						var i = N(r);
						{
							let e = (e, t) => {
								let n = () => (t?.()).props;
								var r = x_();
								q(r, () => ({
									...n(),
									type: "button",
									class: "ui-form-field-input ui-date-field-input",
									"aria-label": B(b),
									disabled: a()
								}));
								var i = N(r), o = vn(i, !0);
								Oe(2), E(r), L(() => {
									Ii(i, 1, Ai(["ui-date-field-value text-body-large truncate text-left", B(y) ? "text-on-surface" : "text-on-surface-variant/60"])), ai(o, B(y) || s().placeholder);
								}), U(e, r);
							};
							K(i, () => Gg, (t, n) => {
								n(t, {
									child: e,
									$$slots: { child: !0 }
								});
							});
						}
						E(r), U(e, r);
					};
					K(u, () => bg, (t, n) => {
						n(t, {
							get "aria-labelledby"() {
								return B(f);
							},
							child: e,
							$$slots: { child: !0 }
						});
					});
				}
				K(F(u, 2), () => Xs, (e, t) => {
					t(e, {
						children: (e, t) => {
							var n = j_(), r = P(n), i = (e) => {
								U(e, C_());
							};
							G(r, (e) => {
								B(m) && e(i);
							}), K(F(r, 2), () => Bg, (e, t) => {
								t(e, {
									class: "ui-date-picker-content fixed top-1/2 left-1/2 z-[var(--z-overlay)] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface-container-high p-4 text-on-surface shadow-overlay outline-none",
									children: (e, t) => {
										var n = H(), r = P(n);
										{
											let e = (e, t) => {
												let n = () => (t?.()).months, r = () => (t?.()).weekdays;
												var i = A_(), a = P(i);
												K(a, () => Tp, (e, t) => {
													t(e, {
														class: "mb-3 flex items-center justify-between gap-2",
														children: (e, t) => {
															var n = E_(), r = P(n);
															K(r, () => Pp, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: se,
																	children: (e, t) => {
																		U(e, w_());
																	},
																	$$slots: { default: !0 }
																});
															});
															var i = F(r, 2);
															K(i, () => Op, (e, t) => {
																t(e, { class: "text-title-small text-on-surface" });
															}), K(F(i, 2), () => jp, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: se,
																	children: (e, t) => {
																		U(e, T_());
																	},
																	$$slots: { default: !0 }
																});
															}), U(e, n);
														},
														$$slots: { default: !0 }
													});
												});
												var o = F(a, 2);
												bi(o, 17, n, (e) => e.value, (e, t) => {
													var n = H(), i = P(n);
													{
														let e = (e, n) => {
															let i = () => (n?.()).props;
															var a = k_();
															q(a, () => ({
																...i(),
																class: "w-full"
															}));
															var o = N(a);
															{
																let e = (e, t) => {
																	let n = () => (t?.()).props;
																	var i = S_();
																	q(i, () => ({ ...n() }));
																	var a = N(i);
																	{
																		let e = (e, t) => {
																			let n = () => (t?.()).props;
																			var i = O_();
																			q(i, () => ({
																				...n(),
																				role: "row",
																				class: "mb-1 grid grid-cols-7"
																			})), bi(i, 23, r, (e, t) => `${t}-${e}`, (e, t) => {
																				var n = H(), r = P(n);
																				{
																					let e = (e, n) => {
																						let r = () => (n?.()).props;
																						var i = D_();
																						q(i, () => ({
																							...r(),
																							role: "columnheader",
																							class: "text-label-small flex h-10 w-full items-center justify-center text-on-surface-variant"
																						}));
																						var a = vn(i, !0);
																						L(() => ai(a, B(t))), U(e, i);
																					};
																					K(r, () => yp, (t, n) => {
																						n(t, {
																							child: e,
																							$$slots: { child: !0 }
																						});
																					});
																				}
																				U(e, n);
																			}), E(i), U(e, i);
																		};
																		K(a, () => Sp, (t, n) => {
																			n(t, {
																				child: e,
																				$$slots: { child: !0 }
																			});
																		});
																	}
																	E(i), U(e, i);
																};
																K(o, () => gp, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															var s = F(o, 2);
															{
																let e = (e, n) => {
																	let r = () => (n?.()).props;
																	var i = O_();
																	q(i, () => ({ ...r() })), bi(i, 20, () => B(t).weeks, (e) => e, (e, n) => {
																		var r = H(), i = P(r);
																		{
																			let e = (e, r) => {
																				let i = () => (r?.()).props;
																				var a = O_();
																				q(a, () => ({
																					...i(),
																					role: "row",
																					class: "grid grid-cols-7"
																				})), bi(a, 20, () => n, (e) => e, (e, n) => {
																					var r = H(), i = P(r);
																					{
																						let e = (e, t) => {
																							let r = () => (t?.()).props;
																							var i = S_();
																							q(i, () => ({
																								...r(),
																								class: "flex h-10 w-full items-center justify-center p-0"
																							})), K(N(i), () => ip, (e, t) => {
																								t(e, {
																									class: "ui-date-picker-day text-body-medium inline-flex size-10 items-center justify-center rounded-full border border-transparent text-on-surface transition-colors hover:bg-on-surface/5 data-disabled:pointer-events-none data-disabled:text-on-surface/30 data-outside-month:text-on-surface-variant/50 data-selected:bg-brand data-selected:font-semibold data-selected:text-on-primary data-unavailable:text-on-surface-variant data-unavailable:line-through",
																									children: (e, t) => {
																										Oe();
																										var r = Gr();
																										L(() => ai(r, n.day)), U(e, r);
																									},
																									$$slots: { default: !0 }
																								});
																							}), E(i), U(e, i);
																						};
																						K(i, () => pp, (r, i) => {
																							i(r, {
																								get date() {
																									return n;
																								},
																								get month() {
																									return B(t).value;
																								},
																								child: e,
																								$$slots: { child: !0 }
																							});
																						});
																					}
																					U(e, r);
																				}), E(a), U(e, a);
																			};
																			K(i, () => Sp, (t, n) => {
																				n(t, {
																					child: e,
																					$$slots: { child: !0 }
																				});
																			});
																		}
																		U(e, r);
																	}), E(i), U(e, i);
																};
																K(s, () => up, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															E(a), U(e, a);
														};
														K(i, () => sp, (t, n) => {
															n(t, {
																class: "w-full",
																child: e,
																$$slots: { child: !0 }
															});
														});
													}
													U(e, n);
												});
												var l = F(o, 2), u = N(l), d = N(u), f = vn(d, !0);
												E(u);
												var p = F(u, 2), m = N(p), h = vn(m, !0), _ = F(m, 2), v = vn(_, !0);
												E(p), E(l), L(() => {
													d.disabled = B(te), ai(f, s().today), m.disabled = c() || !B(g), ai(h, s().clear), _.disabled = c() && !B(g), ai(v, s().confirm);
												}), Pr("click", d, ae), Pr("click", m, oe), Pr("click", _, ie), U(e, i);
											};
											K(r, () => Fg, (t, n) => {
												n(t, {
													class: "flex w-full flex-col",
													children: e,
													$$slots: { default: !0 }
												});
											});
										}
										U(e, n);
									},
									$$slots: { default: !0 }
								});
							}), U(e, n);
						},
						$$slots: { default: !0 }
					});
				}), E(r), L(() => Ii(r, 1, Ai(B(p) ? "ui-form-field" : ["ui-form-field", i()]))), U(e, r);
			},
			$$slots: { default: !0 }
		});
	}), E(ce), L(() => Ii(ce, 1, Ai(B(p) ? ["flex flex-col gap-3", i()] : void 0))), U(e, ce), O();
}
//#endregion
//#region packages/ui-kit/src/components/SegmentedControl.svelte
Fr(["click"]), Fr(["click"]), Fr(["click", "keydown"]);
//#endregion
//#region packages/ui-kit/src/form/time-wheel-utils.ts
var P_ = {
	placeholder: "选择时间",
	hour: "时",
	minute: "分",
	cancel: "取消",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`,
	columnAria: (e, t) => `${e}${t}`
};
function F_(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}`;
}
function I_(e, t, n = P_) {
	return !t || !Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || !Number.isInteger(t.minute) || t.minute < 0 || t.minute > 59 ? n.triggerEmpty(e) : n.triggerLabeled(e, F_(t));
}
function L_() {
	return Array.from({ length: 24 }, (e, t) => t);
}
function R_() {
	return Array.from({ length: 60 }, (e, t) => t);
}
function z_(e, t, n = 40) {
	return Math.min(Math.max(Math.round(e / n), 0), t);
}
//#endregion
//#region packages/ui-kit/src/motion/motion.ts
var B_ = xa.reduceMotionEnabled;
function V_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !1;
		let e = localStorage.getItem(Fa(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(B_));
		return e === "1" || e === "true";
	} catch {
		return !1;
	}
}
function H_() {
	if (typeof window > "u") return !1;
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
}
function U_() {
	return V_() || H_();
}
//#endregion
//#region packages/ui-kit/src/motion/gesture-motion.ts
function W_() {
	let e = [];
	return {
		reset(t, n = performance.now()) {
			e = [{
				position: t,
				time: n
			}];
		},
		add(t, n = performance.now()) {
			let r = e.at(-1), i = e.at(-2);
			for (r && i && (t - r.position) * (r.position - i.position) < 0 && (e = [r]), r?.time === n ? r.position = t : e.push({
				position: t,
				time: n
			}); e.length > 1 && e[0].time < n - 80;) e.shift();
		},
		velocity(t = performance.now()) {
			let n = e.at(-1), r = e[0];
			return !r || !n || t - n.time > 80 || n.time <= r.time ? 0 : (n.position - r.position) / (n.time - r.time);
		},
		isReversing(t, n = performance.now()) {
			let r = e[0], i = e.at(-1);
			if (!r || !i) return !1;
			let a = i.position - r.position;
			return Math.abs(a) >= 8 && Math.sign(a) === -Math.sign(t) && Math.abs(this.velocity(n)) >= .1;
		}
	};
}
function G_(e) {
	return e * .998 / (1 - .998);
}
function K_(e, t) {
	return e * t * .55 / (t + Math.abs(e) * .55);
}
//#endregion
//#region packages/ui-kit/src/overlay/bottom-sheet-drag.ts
var q_ = .25;
function J_(e, t, n = q_, r = 0) {
	if (r <= -.1) return !1;
	let i = e + (r > 0 ? G_(r) : 0);
	return t <= 0 ? i >= 80 : i >= t * n;
}
function Y_(e, t) {
	return t <= 0 ? 1 : Math.max(0, 1 - e / t);
}
//#endregion
//#region packages/ui-kit/src/overlay/bottom-sheet-motion.svelte.ts
function X_(e) {
	let t = /* @__PURE__ */ j(!1), n = /* @__PURE__ */ j(0), r = /* @__PURE__ */ j("hidden"), i = 0, a = 1, o = !1, s = 0, c = () => {}, l = W_();
	function u() {
		s++, c(), c = () => {};
	}
	function d(t, r) {
		u();
		let i = s, a = B(n);
		M(n, t, !0), e.reduced() ? r() : c = e.animate(a, t, () => {
			i === s && (c = () => {}, r());
		});
	}
	function f() {
		M(r, o ? "returning" : "entering", !0), d(0, () => {
			M(r, "open"), o || (o = !0, e.onComplete(!0));
		});
	}
	function p() {
		B(t) && B(r) !== "closing" && (M(r, "closing"), d(Math.max(e.height(), 1), () => {
			M(t, !1), M(r, "hidden"), o = !1, e.onClosed(), e.onComplete(!1);
		}));
	}
	return {
		get state() {
			return {
				present: B(t),
				offset: B(n),
				phase: B(r)
			};
		},
		setOpen(e) {
			if (!e) {
				p();
				return;
			}
			B(t) ? B(r) === "closing" && f() : (M(t, !0), M(r, "entering"), o = !1);
		},
		mount() {
			B(r) === "entering" && (M(n, e.height(), !0), f());
		},
		start(t) {
			B(r) === "open" && (a = Math.max(e.height(), 1), i = t, l.reset(t), M(r, "dragging"));
		},
		move(e) {
			if (B(r) !== "dragging") return;
			l.add(e);
			let t = e - i;
			M(n, t >= 0 ? t : K_(t, a), !0);
		},
		release(e, t = !1) {
			if (B(r) !== "dragging") return;
			l.add(e);
			let i = t ? 0 : l.velocity();
			!t && J_(B(n), a, .25, i) ? p() : f();
		},
		destroy: u
	};
}
//#endregion
//#region packages/ui-kit/src/overlay/BottomSheet.svelte
var Z_ = /* @__PURE__ */ V("<div class=\"relative flex shrink-0 touch-none justify-center py-3 before:absolute before:inset-x-0 before:-top-4 before:-bottom-4 before:content-['']\"><div class=\"h-1 w-10 rounded-full bg-on-surface-variant/40\"></div></div>"), Q_ = /* @__PURE__ */ V("<div class=\"shrink-0\"><!></div>"), $_ = /* @__PURE__ */ V("<div><!> <!></div>"), ev = /* @__PURE__ */ V("<div><!></div>"), tv = /* @__PURE__ */ V("<div><!> <!> <!> <!></div>"), nv = /* @__PURE__ */ V("<!> <!>", 1);
function rv(e, t) {
	D(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "title", 3, ""), i = Y(t, "description", 3, ""), a = Y(t, "showHandle", 3, !0), o = Y(t, "dragDismissAria", 3, "Drag down to close"), s = Y(t, "manageHistory", 3, !0), c = Y(t, "overlayId", 3, "bottom-sheet"), l = /* @__PURE__ */ j(null), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ j(null), f = /* @__PURE__ */ j(null), p = /* @__PURE__ */ j(0), m = null, h = null;
	function g(e, t, n) {
		let r = B(u), i = B(d);
		if (!r) return n(), () => {};
		let a = `translate3d(0, ${t}px, 0)`, o = `${Y_(t, B(p))}`, s = {
			duration: 240,
			easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
			fill: "both"
		}, c = r.animate([{ transform: m ?? `translate3d(0, ${e}px, 0)` }, { transform: a }], s), l = i?.animate([{ opacity: h ?? `${Y_(e, B(p))}` }, { opacity: o }], s);
		return m = null, h = null, c.onfinish = () => {
			r.style.transform = a, i && (i.style.opacity = o), c.cancel(), l?.cancel(), n();
		}, () => {
			m = getComputedStyle(r).transform, h = i ? getComputedStyle(i).opacity : null, r.style.transform = m, i && h && (i.style.opacity = h), c.onfinish = null, c.cancel(), l?.cancel();
		};
	}
	let _ = ba(), v = X_({
		height: () => (M(p, B(u)?.getBoundingClientRect().height ?? 0, !0), B(p)),
		reduced: U_,
		animate: g,
		onClosed: () => {
			_.end(), n(!1), t.onOpenChange?.(!1);
		},
		onComplete: (e) => t.onOpenChangeComplete?.(e)
	}), y = /* @__PURE__ */ k(() => v.state.present), b = /* @__PURE__ */ k(() => v.state.phase === "dragging"), x = /* @__PURE__ */ k(() => `transform: translate3d(0, ${v.state.offset}px, 0)`), S = /* @__PURE__ */ k(() => `opacity: ${Y_(v.state.offset, B(p))}`);
	function C(e) {
		v.state.phase === "open" && a() && _.start(e, B(f)) && v.start(e.clientY);
	}
	function ee(e) {
		_.owns(e) && v.move(e.clientY);
	}
	function te(e) {
		_.owns(e) && (_.end(), v.release(e.clientY));
	}
	function ne(e) {
		_.owns(e) && (_.end(), v.release(e.clientY, !0));
	}
	function re(e) {
		e.preventDefault(), requestAnimationFrame(() => {
			B(y) && (B(l) ?? B(u))?.focus();
		});
	}
	let ie = Wa({
		get overlayId() {
			return c();
		},
		get port() {
			return s() ? t.historyPort : void 0;
		},
		parent: $e(Ha),
		setOpen: (e) => {
			n(e);
		}
	});
	et(Ha, ie), I(() => ie.syncOpenState(B(y))), pi(() => {
		_.end(), v.destroy(), ie.dispose();
	});
	function ae(e) {
		e ? (n(!0), t.onOpenChange?.(!0)) : v.setOpen(!1);
	}
	I(() => {
		let e = n();
		Tr(() => v.setOpen(e));
	}), I(() => {
		B(u) && Tr(() => v.mount());
	});
	var oe = H();
	Nr("pointermove", un, function(...e) {
		(a() ? ee : void 0)?.apply(this, e);
	}), Nr("pointerup", un, function(...e) {
		(a() ? te : void 0)?.apply(this, e);
	}), Nr("pointercancel", un, function(...e) {
		(a() ? ne : void 0)?.apply(this, e);
	});
	var se = P(oe), ce = () => B(y), le = ae;
	K(se, () => Kg, (e, n) => {
		n(e, {
			get open() {
				return ce();
			},
			set open(e) {
				le(e);
			},
			children: (e, n) => {
				var s = H();
				K(P(s), () => Xs, (e, n) => {
					n(e, {
						children: (e, n) => {
							var s = nv(), c = P(s);
							K(c, () => gl, (e, t) => {
								t(e, {
									class: "bottom-sheet-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50",
									"aria-hidden": "true",
									get style() {
										return B(S);
									},
									onclick: () => ae(!1),
									get ref() {
										return B(d);
									},
									set ref(e) {
										M(d, e, !0);
									}
								});
							});
							var p = F(c, 2);
							{
								let e = (e, n) => {
									let s = () => (n?.()).props;
									var c = tv();
									q(c, () => ({ ...s() }));
									var u = N(c), d = (e) => {
										var t = Z_();
										ua(t, (e) => M(f, e), () => B(f)), L(() => ta(t, "aria-label", o())), Pr("pointerdown", t, C), Nr("lostpointercapture", t, ne), U(e, t);
									};
									G(u, (e) => {
										a() && e(d);
									});
									var p = F(u, 2), m = (e) => {
										var n = $_(), i = N(n), o = (e) => {
											var t = H(), n = P(t);
											{
												let e = /* @__PURE__ */ k(() => ["text-title-large min-w-0 flex-1 font-medium text-on-surface outline-none", a() ? "truncate" : "text-center"]);
												K(n, () => Vs, (t, n) => {
													n(t, {
														tabindex: -1,
														get class() {
															return B(e);
														},
														get ref() {
															return B(l);
														},
														set ref(e) {
															M(l, e, !0);
														},
														children: (e, t) => {
															Oe();
															var n = Gr();
															L(() => ai(n, r())), U(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											U(e, t);
										};
										G(i, (e) => {
											r() && e(o);
										});
										var s = F(i, 2), c = (e) => {
											var n = Q_();
											W(N(n), () => t.actions), E(n), U(e, n);
										};
										G(s, (e) => {
											t.actions && e(c);
										}), E(n), L(() => Ii(n, 1, Ai(["flex shrink-0 items-center gap-3", a() ? "px-4 pb-3" : "px-6 pt-6 pb-2"]))), U(e, n);
									};
									G(p, (e) => {
										(r() || t.actions) && e(m);
									});
									var h = F(p, 2), g = (e) => {
										var n = $_(), r = N(n), o = (e) => {
											var t = H(), n = P(t);
											{
												let e = /* @__PURE__ */ k(() => ["text-body-medium text-supporting leading-relaxed text-on-surface-variant", !a() && "text-center"]);
												K(n, () => yl, (t, n) => {
													n(t, {
														get class() {
															return B(e);
														},
														children: (e, t) => {
															Oe();
															var n = Gr();
															L(() => ai(n, i())), U(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											U(e, t);
										};
										G(r, (e) => {
											i() && e(o);
										});
										var s = F(r, 2), c = (e) => {
											var n = H();
											W(P(n), () => t.children), U(e, n);
										};
										G(s, (e) => {
											t.children && e(c);
										}), E(n), L(() => Ii(n, 1, Ai([a() ? ["app-scroll-y min-h-0 flex-1 overflow-y-auto", !t.footer && "pb-[calc(1rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]"] : ["shrink-0 px-6", t.footer ? "pb-5" : "pb-[calc(1.25rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]"]]))), U(e, n);
									};
									G(h, (e) => {
										(i() || t.children) && e(g);
									});
									var _ = F(h, 2), v = (e) => {
										var n = ev();
										W(N(n), () => t.footer), E(n), L(() => Ii(n, 1, Ai(["flex shrink-0 items-center gap-2", a() ? "mt-2 justify-end ps-4 pe-[calc(1rem+var(--tabbar-inline-safe,0px))] pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)]" : "w-full justify-stretch gap-3 border-t border-outline-variant/40 ps-6 pe-[calc(1.5rem+var(--tabbar-inline-safe,0px))] pt-4 pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)] [&>button]:flex-1"]))), U(e, n);
									};
									G(_, (e) => {
										t.footer && e(v);
									}), E(c), U(e, c);
								}, n = /* @__PURE__ */ k(() => B(b) ? "" : void 0), s = /* @__PURE__ */ k(() => v.state.phase === "returning" ? "" : void 0), c = /* @__PURE__ */ k(() => v.state.phase === "closing" ? "" : void 0);
								K(p, () => Xg, (t, r) => {
									r(t, {
										class: "bottom-sheet-content rounded-t-sheet fixed inset-x-0 bottom-0 z-[var(--z-overlay)] flex max-h-[85dvh] min-h-0 flex-col overflow-hidden bg-surface-container-high text-on-surface shadow-overlay outline-none",
										get style() {
											return B(x);
										},
										get "data-dragging"() {
											return B(n);
										},
										get "data-snapping-back"() {
											return B(s);
										},
										get "data-closing"() {
											return B(c);
										},
										restoreScrollDelay: 0,
										onOpenAutoFocus: re,
										onInteractOutside: (e) => {
											e.preventDefault(), ae(!1);
										},
										onEscapeKeydown: (e) => {
											e.preventDefault(), ae(!1);
										},
										get ref() {
											return B(u);
										},
										set ref(e) {
											M(u, e, !0);
										},
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							U(e, s);
						},
						$$slots: { default: !0 }
					});
				}), U(e, s);
			},
			$$slots: { default: !0 }
		});
	}), U(e, oe), O();
}
Fr(["pointerdown"]);
//#endregion
//#region packages/ui-kit/src/form/PickerWheel.svelte
var iv = /* @__PURE__ */ V("<div role=\"option\" tabindex=\"-1\"> </div>"), av = /* @__PURE__ */ V("<div class=\"picker-wheel-column relative w-full svelte-1i06u69\"><div role=\"listbox\"></div> <div aria-hidden=\"true\" class=\"picker-wheel-fade-top pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-surface-container-high to-transparent svelte-1i06u69\"></div> <div aria-hidden=\"true\" class=\"picker-wheel-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-high to-transparent svelte-1i06u69\"></div> <div aria-hidden=\"true\" class=\"pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-lg border-y border-outline-variant/40 bg-brand/5\"></div></div>");
function ov(e, t) {
	D(t, !0);
	let n = Y(t, "value", 15, ""), r = Y(t, "disabled", 3, !1), i = null, a = 0, o = 0, s = 0, c = 0, l = /* @__PURE__ */ k(() => t.options.map((e) => e.value).join("\0"));
	function u() {
		return Math.max(0, t.options.findIndex((e) => e.value === n()));
	}
	function d(e, t) {
		i?.scrollTo({
			top: e * 40,
			behavior: t ? "smooth" : "instant"
		});
	}
	function f() {
		a = Date.now() + 150, c = u(), d(c, !1);
	}
	I(() => {
		B(l), Tr(f);
	});
	function p() {
		let e = Date.now();
		e < a || e - o < 40 || (o = e, g_.medium());
	}
	function m(e) {
		let r = t.options[e]?.value;
		r !== void 0 && r !== n() && (n(r), t.onValueChange?.(r));
	}
	function h() {
		s = 0, !r() && m(c);
	}
	function g(e) {
		if (r()) return;
		let n = z_(e.scrollTop, Math.max(0, t.options.length - 1), 40);
		c !== n && (c = n, p()), window.clearTimeout(s), s = window.setTimeout(h, 90);
	}
	function _() {
		return r() ? n() : (window.clearTimeout(s), i && (c = z_(i.scrollTop, Math.max(0, t.options.length - 1), 40)), h(), t.options[c]?.value ?? "");
	}
	function v(e) {
		if (r()) return;
		let n = Math.min(Math.max(e, 0), Math.max(0, t.options.length - 1));
		c = n, m(n), d(n, !0);
	}
	function y(e) {
		r() || (e.key === "ArrowDown" || e.key === "ArrowRight" ? (e.preventDefault(), v(c + 1)) : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (e.preventDefault(), v(c - 1)) : e.key === "Home" ? (e.preventDefault(), v(0)) : e.key === "End" && (e.preventDefault(), v(t.options.length - 1)));
	}
	function b(e) {
		return i = e, c = u(), e.scrollTo({ top: c * 40 }), () => {
			i === e && (i = null);
		};
	}
	pi(() => clearTimeout(s));
	var x = {
		scrollToValue: f,
		commitDraft: _
	}, S = av(), C = N(S);
	return bi(C, 23, () => t.options, (e) => e.value, (e, r, i) => {
		var a = iv();
		let o;
		var s = vn(a, !0);
		L(() => {
			ta(a, "id", `${t.idPrefix ?? ""}-${B(r).value ?? ""}`), ta(a, "aria-selected", B(r).value === n()), Ii(a, 1, `picker-wheel-row text-body-large flex cursor-pointer items-center justify-center text-center tabular-nums transition-colors ${B(r).value === n() ? "font-semibold text-on-surface" : "text-on-surface-variant/60"}`, "svelte-1i06u69"), o = Ri(a, "", o, { height: "40px" }), ai(s, B(r).label);
		}), Pr("click", a, () => v(B(i))), U(e, a);
	}), E(C), Di(C, () => b), Oe(6), E(S), L(() => {
		ta(C, "aria-label", t.label), ta(C, "aria-disabled", r()), ta(C, "tabindex", r() ? -1 : 0), Ii(C, 1, Ai(["picker-wheel overflow-y-auto rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand", r() && "pointer-events-none opacity-60"]), "svelte-1i06u69");
	}), Nr("scroll", C, (e) => g(e.currentTarget)), Nr("scrollend", C, () => {
		window.clearTimeout(s), h();
	}), Pr("keydown", C, y), U(e, S), O(x);
}
Fr(["keydown", "click"]);
//#endregion
//#region packages/ui-kit/src/form/TimeWheel.svelte
var sv = /* @__PURE__ */ V("<div class=\"flex justify-center gap-3\"><div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div> <div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div></div>");
function cv(e, t) {
	D(t, !0);
	let n = Y(t, "value", 31, () => sn({
		hour: 0,
		minute: 0
	})), r = Y(t, "disabled", 3, !1), i = /* @__PURE__ */ j(sn(String(n().hour))), a = /* @__PURE__ */ j(sn(String(n().minute))), o = /* @__PURE__ */ j(null), s = /* @__PURE__ */ j(null), c = /* @__PURE__ */ k(() => L_().filter((e) => !t.minimum || e >= t.minimum.hour).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	}))), l = /* @__PURE__ */ k(() => R_().filter((e) => !t.minimum || Number(B(i)) > t.minimum.hour || e >= t.minimum.minute).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	})));
	function u(e) {
		return !t.minimum || e.hour * 60 + e.minute >= t.minimum.hour * 60 + t.minimum.minute ? e : { ...t.minimum };
	}
	function d(e) {
		let r = u(e), o = r.hour !== n().hour || r.minute !== n().minute;
		M(i, String(r.hour), !0), M(a, String(r.minute), !0), o && (n(r), t.onValueChange?.(r));
	}
	function f() {
		let e = u(n());
		M(i, String(e.hour), !0), M(a, String(e.minute), !0);
	}
	function p() {
		f(), Sr().then(() => {
			B(o)?.scrollToValue(), B(s)?.scrollToValue();
		});
	}
	function m(e) {
		d({
			hour: Number(e),
			minute: Number(B(a))
		}), Sr().then(() => B(s)?.scrollToValue());
	}
	function h(e) {
		d({
			hour: Number(B(i)),
			minute: Number(e)
		});
	}
	function g() {
		return d({
			hour: Number(B(o)?.commitDraft() ?? B(i)),
			minute: Number(B(s)?.commitDraft() ?? B(a))
		}), n();
	}
	var _ = {
		scrollToValue: p,
		commitDraft: g
	}, v = sv(), y = N(v), b = N(y);
	{
		let e = /* @__PURE__ */ k(() => t.labels.columnAria(t.label, t.labels.hour)), n = /* @__PURE__ */ k(() => `${t.idPrefix}-hour`);
		ua(ov(b, {
			get options() {
				return B(c);
			},
			get label() {
				return B(e);
			},
			get idPrefix() {
				return B(n);
			},
			get disabled() {
				return r();
			},
			onValueChange: m,
			get value() {
				return B(i);
			},
			set value(e) {
				M(i, e, !0);
			}
		}), (e) => M(o, e, !0), () => B(o));
	}
	E(y);
	var x = F(y, 2), S = N(x);
	{
		let e = /* @__PURE__ */ k(() => t.labels.columnAria(t.label, t.labels.minute)), n = /* @__PURE__ */ k(() => `${t.idPrefix}-minute`);
		ua(ov(S, {
			get options() {
				return B(l);
			},
			get label() {
				return B(e);
			},
			get idPrefix() {
				return B(n);
			},
			get disabled() {
				return r();
			},
			onValueChange: h,
			get value() {
				return B(a);
			},
			set value(e) {
				M(a, e, !0);
			}
		}), (e) => M(s, e, !0), () => B(s));
	}
	return E(x), E(v), U(e, v), O(_);
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
var lv = /* @__PURE__ */ V("<p class=\"text-body-small text-supporting mt-1 text-on-surface-variant\"> </p>"), uv = /* @__PURE__ */ V("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> </h3> <!></div>"), dv = /* @__PURE__ */ V("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> </button>"), fv = /* @__PURE__ */ V("<button type=\"button\" class=\"text-label-large h-11 rounded-full px-5 text-on-surface-variant hover:bg-on-surface/5 active:bg-on-surface/10\"> </button> <button type=\"button\" class=\"text-label-large h-11 rounded-full bg-brand px-6 text-on-primary active:opacity-90\"> </button>", 1), pv = /* @__PURE__ */ V("<div class=\"px-4 pt-1 pb-2\"><!></div>"), mv = /* @__PURE__ */ V("<div><!> <div><!> <button type=\"button\" class=\"ui-form-field-input ui-date-field-input\" aria-haspopup=\"dialog\"><span class=\"ui-date-field-value text-body-large truncate text-left text-on-surface tabular-nums\"> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z\"></path></svg></span></button></div></div> <!>", 1);
function hv(e, t) {
	let n = Kr();
	D(t, !0);
	let r = Y(t, "value", 31, () => sn({
		hour: 0,
		minute: 0
	})), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "variant", 3, "field"), s = Y(t, "labels", 3, P_), c = Y(t, "sheetDragDismissAria", 3, "向下拖动关闭"), l = /* @__PURE__ */ k(() => t.id ?? n), u = /* @__PURE__ */ k(() => `${B(l)}-label`), d = /* @__PURE__ */ k(() => t.idPrefix ?? B(l)), f = /* @__PURE__ */ k(() => t.overlayId ?? `time-picker-${n}`), p = /* @__PURE__ */ k(() => t.manageHistory ?? t.historyPort != null), m = /* @__PURE__ */ k(() => o() === "section"), h = /* @__PURE__ */ j(!1), g = /* @__PURE__ */ j(sn({
		hour: 0,
		minute: 0
	})), _ = /* @__PURE__ */ j(null), v = /* @__PURE__ */ k(() => F_(r())), y = /* @__PURE__ */ k(() => I_(t.label, B(h) ? B(g) : r(), s()));
	function b() {
		a() || (M(g, {
			hour: r().hour,
			minute: r().minute
		}, !0), M(h, !0), Sr().then(() => B(_)?.scrollToValue()));
	}
	function x() {
		M(h, !1);
	}
	function S() {
		g_.light();
		let e = B(_)?.commitDraft() ?? B(g);
		(e.hour !== r().hour || e.minute !== r().minute) && (r(e), t.onValueChange?.(e)), x();
	}
	var C = mv(), ee = P(C), te = N(ee), ne = (e) => {
		var n = uv(), r = N(n), i = vn(r, !0), a = F(r, 2), o = (e) => {
			var n = lv(), r = vn(n, !0);
			L(() => ai(r, t.description)), U(e, n);
		};
		G(a, (e) => {
			t.description && e(o);
		}), E(n), L(() => {
			ta(r, "id", B(u)), ai(i, t.label);
		}), U(e, n);
	};
	G(te, (e) => {
		B(m) && e(ne);
	});
	var re = F(te, 2), ie = N(re), ae = (e) => {
		var n = dv(), r = vn(n, !0);
		L(() => {
			ta(n, "id", B(u)), ai(r, t.label);
		}), Pr("click", n, b), U(e, n);
	};
	G(ie, (e) => {
		B(m) || e(ae);
	});
	var oe = F(ie, 2), se = vn(N(oe), !0);
	Oe(2), E(oe), E(re), E(ee), rv(F(ee, 2), {
		get title() {
			return t.label;
		},
		get dragDismissAria() {
			return c();
		},
		get manageHistory() {
			return B(p);
		},
		get overlayId() {
			return B(f);
		},
		get historyPort() {
			return t.historyPort;
		},
		get open() {
			return B(h);
		},
		set open(e) {
			M(h, e, !0);
		},
		footer: (e) => {
			var t = fv(), n = P(t), r = vn(n, !0), i = F(n, 2), a = vn(i, !0);
			L(() => {
				ai(r, s().cancel), ai(a, s().confirm);
			}), Pr("click", n, x), Pr("click", i, S), U(e, t);
		},
		children: (e, n) => {
			var r = pv();
			ua(cv(N(r), {
				get label() {
					return t.label;
				},
				get labels() {
					return s();
				},
				get idPrefix() {
					return B(d);
				},
				get value() {
					return B(g);
				},
				set value(e) {
					M(g, e, !0);
				}
			}), (e) => M(_, e, !0), () => B(_)), E(r), U(e, r);
		},
		$$slots: {
			footer: !0,
			default: !0
		}
	}), L(() => {
		Ii(ee, 1, Ai(B(m) ? ["flex flex-col gap-3", i()] : void 0)), Ii(re, 1, Ai(B(m) ? "ui-form-field" : ["ui-form-field", i()])), ta(oe, "id", B(l)), ta(oe, "aria-labelledby", B(u)), ta(oe, "aria-label", B(y)), ta(oe, "aria-expanded", B(h)), oe.disabled = a(), ai(se, B(v));
	}), Pr("click", oe, b), U(e, C), O();
}
Fr(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [gv, _v] = Qe();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Fr(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var vv = /* @__PURE__ */ V("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function yv(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ k(() => t.component), r = /* @__PURE__ */ k(() => Ia(t.propsStore).current);
	var i = vv();
	K(N(i), () => B(n), (e, t) => {
		t(e, ya(() => B(r)));
	}), E(i), U(e, i), O();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function bv(e) {
	return {
		[ka]: !0,
		mount(t, n, r) {
			let i = pa({ ...n }), a = oi(yv, {
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
					ui(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function xv(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Oa(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Oa(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var Sv = 900, Cv = 24, wv = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function Tv(e) {
	return wv.has(e) ? !0 : e.startsWith("max-w-");
}
function Ev(e) {
	let t = [], n = [];
	for (let r of e) Tv(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function Dv(e, t, n, r = Cv) {
	if (t <= n + 1) return {
		visible: !1,
		height: 0,
		offset: 0
	};
	let i = Math.max(n / t * n, r), a = n - i, o = t - n;
	return {
		visible: !0,
		height: i,
		offset: o > 0 ? e / o * a : 0
	};
}
function Ov(e, t) {
	if (!t.visible) {
		e.style.display = "none";
		return;
	}
	e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`;
}
function kv(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = Ev(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Ov(a, Dv(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, Sv);
	};
	e.addEventListener("scroll", l, { passive: !0 });
	let u = new ResizeObserver(() => c());
	return u.observe(e), c(), { destroy() {
		e.removeEventListener("scroll", l), u.disconnect(), s !== void 0 && clearTimeout(s), n.classList.remove("is-scrolling"), n.isConnected && (t.isConnected && t.insertBefore(e, n), n.remove());
		for (let t of r) e.classList.add(t);
		o && e.classList.remove("h-full", "w-full");
	} };
}
//#endregion
//#region packages/ui-kit/src/actions/app-scroll.ts
function Av(e) {
	return kv(e);
}
//#endregion
//#region packages/plugins/clock/src/clock.ts
var jv = /^\d{4}-\d{2}-\d{2}$/;
function Mv(e) {
	return typeof e != "number" || !Number.isFinite(e) ? null : e;
}
function Nv(e, t) {
	if (!jv.test(e) || !Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || !Number.isInteger(t.minute) || t.minute < 0 || t.minute > 59) return null;
	let n = Number(e.slice(0, 4)), r = Number(e.slice(5, 7)), i = Number(e.slice(8, 10)), a = new Date(n, r - 1, i, t.hour, t.minute, 0, 0);
	return a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i ? null : a;
}
function Pv(e) {
	return {
		isoDate: wa(e),
		time: {
			hour: e.getHours(),
			minute: e.getMinutes()
		}
	};
}
//#endregion
//#region packages/plugins/clock/src/constants.ts
var Fv = "tool-clock", Iv = "frozen_now", Lv = {
	"zh-cn": {
		"plugin.name": "自定义时间",
		"mine.title": "自定义时间",
		"mine.keywords": "时间,日期,冻结,时钟,调试,预览,clock,time,date",
		"screen.title": "自定义时间",
		"screen.status.subtitle.system": "课表按引擎时间运行",
		"screen.status.subtitle.frozen": "课表按自定义时间运行",
		"screen.field.date": "日期",
		"screen.field.time": "时间",
		"screen.field.date.placeholder": "选择日期",
		"screen.field.date.today": "今天",
		"screen.field.date.clear": "清除",
		"screen.field.date.confirm": "确定",
		"screen.field.date.triggerEmpty": "选择{label}",
		"screen.field.date.triggerLabeled": "{label}：{display}",
		"screen.field.time.hour": "时",
		"screen.field.time.minute": "分",
		"screen.field.time.cancel": "取消",
		"screen.field.time.sheetDragDismiss": "向下拖动关闭",
		"screen.field.time.columnAria": "{label}{column}",
		"screen.action.apply": "应用",
		"screen.action.reset": "使用引擎时间",
		"screen.notify.applied": "已冻结当前时间",
		"screen.notify.reset": "已使用引擎时间",
		"screen.notify.invalid": "请选择有效的日期和时间"
	},
	en: {
		"plugin.name": "Custom Date & Time",
		"mine.title": "Custom date & time",
		"mine.keywords": "time,date,freeze,clock,debug,preview",
		"screen.title": "Custom Date & Time",
		"screen.status.subtitle.system": "Timetable follows engine time",
		"screen.status.subtitle.frozen": "Timetable follows custom time",
		"screen.field.date": "Date",
		"screen.field.time": "Time",
		"screen.field.date.placeholder": "Choose a date",
		"screen.field.date.today": "Today",
		"screen.field.date.clear": "Clear",
		"screen.field.date.confirm": "OK",
		"screen.field.date.triggerEmpty": "Choose {label}",
		"screen.field.date.triggerLabeled": "{label}: {display}",
		"screen.field.time.hour": "Hour",
		"screen.field.time.minute": "Minute",
		"screen.field.time.cancel": "Cancel",
		"screen.field.time.sheetDragDismiss": "Drag down to close",
		"screen.field.time.columnAria": "{label} {column}",
		"screen.action.apply": "Apply",
		"screen.action.reset": "Use engine time",
		"screen.notify.applied": "Clock frozen",
		"screen.notify.reset": "Using engine time",
		"screen.notify.invalid": "Choose a valid date and time"
	}
};
//#endregion
//#region packages/plugins/clock/src/index.ts
function Rv(e = {}) {
	let { screenComponent: t } = e, n;
	return Pa({
		id: Fv,
		messages: Lv,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 55,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, r) {
			n = e;
			let i = Mv(await e.storage.get(Iv));
			i != null && e.actions.setVirtualNow(new Date(i));
			let a = r("mine.keywords").split(",").map((e) => e.trim()).filter(Boolean);
			e.registerSlot("mine.item", {
				id: "clock",
				sectionId: Fv,
				title: () => r("mine.title"),
				href: `/plugins/${Fv}`,
				icon: "schedule",
				iconTone: "secondary",
				keywords: a,
				order: 40
			}), e.registerSlot("shell.route.screen", {
				id: Fv,
				title: () => r("screen.title"),
				...t ? { component: t } : {}
			});
		},
		dispose() {
			let e = n;
			n = void 0, e?.actions.setVirtualNow(null);
		}
	});
}
//#endregion
//#region packages/plugins/clock/src/analytics.ts
var zv = {
	apply: "apply",
	reset: "reset"
}, Bv = /* @__PURE__ */ V("<p class=\"text-headline-small text-on-surface tabular-nums\"> <span class=\"text-on-surface-variant\">·</span> </p> <p class=\"text-body-medium mt-1 text-on-surface-variant\"> </p>", 1), Vv = /* @__PURE__ */ V("<header class=\"relative z-10 shrink-0 border-b border-outline/10 bg-surface/90 px-4 pt-6 pb-4 backdrop-blur-sm\"><!></header>"), Hv = /* @__PURE__ */ V("<section class=\"ui-section-surface ui-section-surface--comfortable\"><!></section>"), Uv = /* @__PURE__ */ V("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><!> <div class=\"secondary-scroll relative z-0 min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]\"><!> <section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack divide-y divide-outline/10\"><!> <!></div></section></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-filled flex-1\"> </button></div></div></div>");
function Wv(e, t) {
	D(t, !0);
	let n = (e) => {
		var t = Bv(), n = P(t), r = N(n), i = F(r, 2);
		E(n);
		var a = vn(F(n, 2), !0);
		L(() => {
			ai(r, `${B(h) ?? ""} `), ai(i, ` ${B(g) ?? ""}`), ai(a, B(_));
		}), U(e, t);
	}, r = new Va("(orientation: landscape) and (max-height: 500px)"), i = /* @__PURE__ */ k(() => Ia(t.controller.snapshot)), a = /* @__PURE__ */ k(() => t.controller.getPluginContext(t.pluginId)), o = /* @__PURE__ */ k(() => n_(B(i).current.locale));
	function s(e, n) {
		return B(i).current.slotVersion, xv(t.controller, Fv, Lv, e, n);
	}
	let c = Pv(/* @__PURE__ */ new Date()), l = /* @__PURE__ */ j(sn(c.isoDate)), u = /* @__PURE__ */ j(sn(c.time));
	fi(() => {
		let e = Pv(t.controller.getPluginContext(t.pluginId).state.now);
		M(l, e.isoDate, !0), M(u, e.time, !0);
	});
	let d = /* @__PURE__ */ k(() => ({
		placeholder: s("screen.field.date.placeholder"),
		today: s("screen.field.date.today"),
		clear: s("screen.field.date.clear"),
		confirm: s("screen.field.date.confirm"),
		triggerEmpty: (e) => s("screen.field.date.triggerEmpty", { label: e }),
		triggerLabeled: (e, t) => s("screen.field.date.triggerLabeled", {
			label: e,
			display: t
		})
	})), f = /* @__PURE__ */ k(() => ({
		placeholder: s("screen.field.time"),
		hour: s("screen.field.time.hour"),
		minute: s("screen.field.time.minute"),
		cancel: s("screen.field.time.cancel"),
		confirm: s("screen.field.date.confirm"),
		triggerEmpty: (e) => s("screen.field.date.triggerEmpty", { label: e }),
		triggerLabeled: (e, t) => s("screen.field.date.triggerLabeled", {
			label: e,
			display: t
		}),
		columnAria: (e, t) => s("screen.field.time.columnAria", {
			label: e,
			column: t
		})
	})), p = /* @__PURE__ */ k(() => B(i).current.clockFrozen), m = /* @__PURE__ */ k(() => B(i).current.now), h = /* @__PURE__ */ k(() => Ca(Pv(B(m)).isoDate)), g = /* @__PURE__ */ k(() => B(m).toLocaleTimeString(B(o), {
		hour: "2-digit",
		minute: "2-digit"
	})), _ = /* @__PURE__ */ k(() => B(p) ? s("screen.status.subtitle.frozen") : s("screen.status.subtitle.system")), v = /* @__PURE__ */ k(() => Nv(B(l), B(u))), y = /* @__PURE__ */ k(() => B(v) != null && B(v).getTime() !== B(m).getTime()), b = /* @__PURE__ */ k(() => [{
		id: "reset",
		label: s("screen.action.reset"),
		icon: "refresh",
		variant: "outlined",
		disabled: !B(p),
		onClick: S
	}, {
		id: "apply",
		label: s("screen.action.apply"),
		icon: "check",
		disabled: !B(y),
		onClick: x
	}]);
	I(() => t.edgeActions?.register(t.pluginId, B(b)));
	async function x() {
		let e = Nv(B(l), B(u));
		if (!e) {
			B(a).actions.notify(s("screen.notify.invalid"), "warn");
			return;
		}
		await B(a).storage.set(Iv, e.getTime()), B(a).actions.setVirtualNow(e), ja(B(a), Fv, zv.apply), B(a).actions.notify(s("screen.notify.applied"), "info");
	}
	async function S() {
		await B(a).storage.delete(Iv), B(a).actions.setVirtualNow(null);
		let e = Pv(B(a).state.now);
		M(l, e.isoDate, !0), M(u, e.time, !0), ja(B(a), Fv, zv.reset), B(a).actions.notify(s("screen.notify.reset"), "info");
	}
	var C = Uv(), ee = N(C), te = (e) => {
		var t = Vv(), r = N(t);
		n(r), E(t), U(e, t);
	};
	G(ee, (e) => {
		r.current || e(te);
	});
	var ne = F(ee, 2), re = N(ne), ie = N(re), ae = (e) => {
		var t = Hv(), r = N(t);
		n(r), E(t), U(e, t);
	};
	G(ie, (e) => {
		r.current && e(ae);
	});
	var oe = F(ie, 2), se = N(oe), ce = N(se);
	{
		let e = /* @__PURE__ */ k(() => s("screen.field.date"));
		N_(ce, {
			get historyPort() {
				return t.controller.overlayHistoryPort;
			},
			get label() {
				return B(e);
			},
			required: !0,
			variant: "section",
			get labels() {
				return B(d);
			},
			get locale() {
				return B(o);
			},
			get value() {
				return B(l);
			},
			set value(e) {
				M(l, e, !0);
			}
		});
	}
	var le = F(ce, 2);
	{
		let e = /* @__PURE__ */ k(() => s("screen.field.time")), n = /* @__PURE__ */ k(() => s("screen.field.time.sheetDragDismiss"));
		hv(le, {
			get label() {
				return B(e);
			},
			variant: "section",
			get labels() {
				return B(f);
			},
			get sheetDragDismissAria() {
				return B(n);
			},
			idPrefix: "clock-time",
			get historyPort() {
				return t.controller.overlayHistoryPort;
			},
			get value() {
				return B(u);
			},
			set value(e) {
				M(u, e, !0);
			}
		});
	}
	E(se), E(oe), E(re), E(ne), Ei(ne, (e) => Av?.(e));
	var ue = F(ne, 2), de = N(ue), fe = N(de), pe = vn(fe, !0), me = F(fe, 2), he = vn(me, !0);
	E(de), E(ue), E(C), L((e, t) => {
		fe.disabled = !B(p), ai(pe, e), me.disabled = !B(y), ai(he, t);
	}, [() => s("screen.action.reset"), () => s("screen.action.apply")]), Pr("click", fe, () => void S()), Pr("click", me, () => void x()), U(e, C), O();
}
Fr(["click"]);
//#endregion
//#region packages/plugins/clock/bundle/entry.ts
var Gv = Rv({ screenComponent: bv(Wv) });
//#endregion
export { Gv as default };
