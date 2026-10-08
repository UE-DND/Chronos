//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = "http://www.w3.org/1999/xhtml", r = Array.isArray, i = Array.prototype.indexOf, a = Array.prototype.includes, o = Array.from, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.getOwnPropertyDescriptors, u = Object.prototype, d = Array.prototype, f = Object.getPrototypeOf, p = Object.isExtensible;
function m(e) {
	return typeof e == "function";
}
var h = () => {};
function g(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function _() {
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
var v = 1 << 24, y = 1024, b = 2048, x = 4096, S = 8192, ee = 16384, C = 32768, te = 1 << 25, ne = 65536, re = 1 << 19, ie = 1 << 20, ae = 1 << 25, oe = 1 << 21, se = 1 << 22, ce = 1 << 23, le = Symbol("$state"), ue = Symbol("component"), de = Symbol("legacy props"), fe = Symbol(""), pe = Symbol("attributes"), me = Symbol("class"), he = Symbol("style"), ge = Symbol("text"), _e = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ve = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function ye() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function be(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function xe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function Se(e) {
	w = e;
}
var T;
function E(t) {
	if (t === null) throw be(), e;
	return T = t;
}
function Ce() {
	return E(/* @__PURE__ */ nn(T));
}
function D(t) {
	if (w) {
		if (/* @__PURE__ */ nn(T) !== null) throw be(), e;
		T = t;
	}
}
function we(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ nn(n);
		T = n;
	}
}
function Te(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ nn(n);
		e && n.remove(), n = i;
	}
}
function Ee(t) {
	if (!t || t.nodeType !== 8) throw be(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function De(e) {
	return e === this.v;
}
function Oe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ke(e) {
	return !Oe(e, this.v);
}
function Ae(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function je() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function Me() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ne(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Pe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Le() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Re(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ze() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Be() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function He() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function Ue(e, t, n) {
	let r = {};
	return [
		() => (n(r) || je(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function We(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Ge(e, t) {
	return e === null && Ae(t), e.c ??= new Map(We(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var O = null;
function Ke(e) {
	O = e;
}
function qe() {
	return Ue(Je, Ye, Xe);
}
function Je(e) {
	return Ge(O, "getContext").get(e);
}
function Ye(e, t) {
	return Ge(O, "setContext").set(e, t), t;
}
function Xe(e) {
	return Ge(O, "hasContext").has(e);
}
function Ze(e, t = !1, n) {
	O = {
		p: O,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: null
	};
}
function Qe(e) {
	var t = O, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) _n(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, O = t.p, $e(e);
}
function $e(e = {}) {
	return s(e, ue, { value: !0 }), e;
}
function et() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var tt = [];
function nt() {
	var e = tt;
	tt = [], g(e);
}
function rt(e) {
	if (tt.length === 0 && !wt) {
		var t = tt;
		queueMicrotask(() => {
			t === tt && nt();
		});
	}
	tt.push(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var it = ~(b | x | y);
function k(e, t) {
	e.f = e.f & it | t;
}
function at(e) {
	e.f & 512 || e.deps === null ? k(e, y) : k(e, x);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function ot(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, y);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = V, n = W;
	U(null), Rn(null);
	try {
		return e();
	} finally {
		U(t), Rn(n);
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
function ct(e, t, n, r) {
	let i = et() ? ft : ht;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = lt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				un(e, s);
			}
			ut();
		}
	}
	var d = dt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ mt(e))).then(u).catch((e) => un(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ut();
	}) : f();
}
function lt() {
	var e = W, t = V, n = O, r = j;
	return function(i = !0) {
		Rn(e), U(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ut(e = !0) {
	Rn(null), U(null), Ke(null), e && j?.deactivate();
}
function dt() {
	var e = W, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ft(e) {
	var n = 2 | b;
	return W !== null && (W.f |= re), {
		ctx: O,
		deps: null,
		effects: null,
		equals: De,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: W,
		ac: null
	};
}
var pt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function mt(e, n, r) {
	let i = W;
	i === null && Me();
	var a = void 0, o = Bt(t), s = !V, c = /* @__PURE__ */ new Set();
	return bn(() => {
		var t = W, n = _();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== _e && n.reject(e);
			}).finally(ut);
		} catch (e) {
			n.reject(e), ut();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = dt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(pt);
			else for (let e of c.values()) e.reject(pt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== pt && (r.activate(), t ? (o.f |= ce, Wt(o, t)) : (o.f & 8388608 && (o.f ^= ce), Wt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), hn(() => {
		for (let e of c) e.reject(pt);
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
function A(e) {
	let t = /* @__PURE__ */ ft(e);
	return Bn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	let t = /* @__PURE__ */ ft(e);
	return t.equals = ke, t;
}
function gt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function _t(e) {
	var n, r = W, i = e.parent;
	if (!In && i !== null && e.v !== t && i.f & 24576) return ye(), e.v;
	Rn(i);
	try {
		gt(e), n = Yn(e);
	} finally {
		Rn(r);
	}
	return n;
}
function vt(e) {
	var t = _t(e);
	if (!e.equals(t) && (e.wv = Kn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), St?.capture(e, t, !0)), e.deps === null))) {
		k(e, y);
		return;
	}
	In || (M === null ? at(e) : (mn() || j?.is_fork) && M.set(e, t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(_e), t.ac = null;
	}), t.fn !== null && (t.teardown = h), Qn(t, 0), Tn(t));
}
function bt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && $n(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var xt = null, j = null, St = null, M = null, Ct = null, wt = !1, Tt = !1, Et = null, Dt = null, Ot = 0, kt = 1, At = class e {
	id = kt++;
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
		xt === null ? xt = this : (xt.#n = this, this.#t = xt), xt = this;
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
			for (var r of n.d) k(r, b), t(r);
			for (r of n.m) k(r, x), t(r);
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
					t.f ^= y;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), k(e, b), this.schedule(e);
		for (let e of this.#d) k(e, x), this.schedule(e);
		this.apply();
		for (var t = Et = [], n = [], r = Dt = []; this.#c.length > 0;) {
			Ot++ > 1e3 && (this.#S(), jt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw It(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Et = null, Dt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Ft(e, t);
			r.length > 0 && j.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), St = this, Nt(n), Nt(t), St = null, this.#s?.resolve();
		var o = j;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Rt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= y;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= y : i & 4 ? t.push(r) : qn(r) && (i & 16 && this.#d.add(r), $n(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, b), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), j = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ot(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), M?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, M = null;
	}
	flush() {
		try {
			Tt = !0, j = this, this.#_();
		} finally {
			Ot = 0, Ct = null, Et = null, Dt = null, Tt = !1, j = null, M = null, Rt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(pt);
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
		this.#m || (this.#m = !0, rt(() => {
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
		return (this.#s ??= _()).promise;
	}
	static ensure() {
		if (j === null) {
			let t = j = new e();
			!Tt && rt(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		if (Ct = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? xt = e : t.#t = e, this.linked = !1;
		}
	}
};
function jt() {
	try {
		Le();
	} catch (e) {
		un(e, Ct);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && qn(r) && (Mt = /* @__PURE__ */ new Set(), $n(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && On(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || $n(n);
					}
				}
				Mt.clear();
			}
		}
		Mt = null;
	}
}
function Pt(e) {
	j.schedule(e);
}
function Ft(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, y);
		for (var n = e.first; n !== null;) Ft(n, t), n = n.next;
	}
}
function It(e) {
	k(e, y);
	for (var t = e.first; t !== null;) It(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Lt = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), zt = !1;
function Bt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: De,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Bt(e, t);
	return Bn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = ke), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && et() && V.f & 4325394 && (zn === null || !zn.has(e)) && Ve(), Wt(e, n ? Jt(t) : t, Dt);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		In ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && _t(t), M === null && at(t);
		}
		e.wv = Kn(), Ht = null, Ut = 0, qt(e, b, n), Ht = null, et() && W !== null && W.f & 1024 && !(W.f & 96) && (q === null ? Vn([e]) : q.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && k(e, x);
		let t;
		try {
			t = qn(e);
		} catch {
			t = !0;
		}
		t && $n(e);
	}
	Lt.clear();
}
function Kt(e) {
	P(e, e.v + 1);
}
function qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = et(), a = r.length;
		if (Ut += a, Ut > 1e5 && Ht === null && (Ht = /* @__PURE__ */ new Set()), Ht !== null) {
			if (Ht.has(e)) return;
			Ht.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & b) === 0;
				if (l && k(s, t), c & 131072) Lt.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), qt(u, x, n);
				} else if (l) {
					var d = s;
					c & 16 && Mt !== null && Mt.add(d), n === null ? Pt(d) : n.push(d);
				}
			}
		}
	}
}
function Jt(e) {
	if (typeof e != "object" || !e || le in e || ue in e) return e;
	let n = f(e);
	if (n !== u && n !== d) return e;
	var i = /* @__PURE__ */ new Map(), a = r(e), o = /* @__PURE__ */ N(0), s = null, l = Wn, p = (e) => {
		if (Wn === l) return e();
		var t = V, n = Wn;
		U(null), Gn(l);
		var r = e();
		return U(t), Gn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ N(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ze();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ N(n.value, s);
				return i.set(t, e), e;
			}) : P(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ N(t, s));
					i.set(n, e), Kt(o);
				}
			} else P(r, t), Kt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === le) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ N(Jt(l ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
				var u = J(o);
				return u === t ? void 0 : u;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var r = Reflect.getOwnPropertyDescriptor(e, n), a = i.get(n);
			if (a !== void 0) {
				var o = J(a);
				if (o === t) return;
				if (r && "value" in r) r.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(e, n) {
			if (n === le) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || W !== null && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ N(a ? Jt(e[n]) : t, s)), i.set(n, r)), J(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ N(t, s)), i.set(f + "", m)) : P(m, t);
			}
			if (u === void 0) (!d || c(e, n)?.writable) && (u = p(() => /* @__PURE__ */ N(void 0, s)), P(u, Jt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Jt(r));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				Kt(o);
			}
			return !0;
		},
		ownKeys(e) {
			J(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			Be();
		}
	});
}
var Yt, Xt, Zt, Qt;
function $t() {
	if (Yt === void 0) {
		Yt = window, Xt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Zt = c(t, "firstChild").get, Qt = c(t, "nextSibling").get, p(e) && (e[me] = void 0, e[pe] = null, e[he] = void 0, e.__e = void 0), p(n) && (n[ge] = void 0);
	}
}
function en(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function tn(e) {
	return Zt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function nn(e) {
	return Qt.call(e);
}
function F(e, t) {
	if (!w) return /* @__PURE__ */ tn(e);
	var n = /* @__PURE__ */ tn(T);
	if (n === null) n = T.appendChild(en());
	else if (t && n.nodeType !== 3) {
		var r = en();
		return n?.before(r), E(r), r;
	}
	return t && cn(n), E(n), n;
}
function rn(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ tn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ nn(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = en();
			return T?.before(r), E(r), r;
		}
		cn(T);
	}
	return T;
}
function I(e, t = !1) {
	if (!w) return /* @__PURE__ */ tn(e);
	var n = F(e, t);
	return D(e), n;
}
function L(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ nn(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = en();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		cn(r);
	}
	return E(r), r;
}
function an(e) {
	e.textContent = "";
}
function on() {
	return !1;
}
function sn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function cn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function ln(e) {
	var t = W;
	if (t === null) return V.f |= ce, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	un(e, t);
}
function un(e, t) {
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
function dn(e) {
	W === null && (V === null && Ie(e), Fe()), In && Pe(e);
}
function fn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function pn(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= S);
	var r = {
		ctx: O,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) Et === null ? At.ensure().schedule(r) : Et.push(r);
	else if (t !== null) {
		try {
			$n(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && fn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function mn() {
	return V !== null && !H;
}
function hn(e) {
	let t = pn(8, null);
	return k(t, y), t.teardown = e, t;
}
function gn(e) {
	dn("$effect");
	var t = W.f;
	if (!V && t & 32 && O !== null && !O.i) {
		var n = O;
		(n.e ??= []).push(e);
	} else return _n(e);
}
function _n(e) {
	return pn(4 | ie, e);
}
function vn(e) {
	At.ensure();
	let t = pn(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? kn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function yn(e) {
	return pn(4, e);
}
function bn(e) {
	return pn(se | re, e);
}
function xn(e, t = 0) {
	return pn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	ct(r, t, n, (t) => {
		pn(8, () => {
			e(...t.map(J));
		});
	});
}
function Sn(e, t = 0) {
	return pn(16 | t, e);
}
function Cn(e, t = 0) {
	return pn(v | t, e);
}
function z(e) {
	return pn(32 | re, e);
}
function wn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = In, r = V;
		Ln(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			un(t, e.parent);
		} finally {
			Ln(n), U(r);
		}
	}
}
function Tn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(_e);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function En(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Dn(e.nodes.start, e.nodes.end), n = !0), e.f |= te, Tn(e, t && !n), Qn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	wn(e), e.f ^= te, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && On(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Dn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ nn(e);
		e.remove(), e = n;
	}
}
function On(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function kn(e, t, n = !0) {
	var r = [];
	e.f |= 256, An(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function An(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= S;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				An(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function jn(e) {
	e.f &= -257, Mn(e, !0);
}
function Mn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= S, e.f & 1024 || (k(e, b), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Mn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Nn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ nn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Pn = null, Fn = !1, In = !1;
function Ln(e) {
	In = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function Rn(e) {
	W = e;
}
var zn = null;
function Bn(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (zn ??= /* @__PURE__ */ new Set()).add(e);
}
var G = null, K = 0, q = null;
function Vn(e) {
	q = e;
}
var Hn = 1, Un = 0, Wn = Un;
function Gn(e) {
	Wn = e;
}
function Kn() {
	return ++Hn;
}
function qn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (qn(a) && vt(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && k(e, y);
	}
	return !1;
}
function Jn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(zn !== null && zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Jn(a, t, !1) : t === a && (n ? k(a, b) : a.f & 1024 && k(a, x), Pt(a));
	}
}
function Yn(e) {
	var t = G, n = K, r = q, i = V, a = zn, o = O, s = H, c = Wn, l = e.f;
	G = null, K = 0, q = null, V = l & 96 ? null : e, zn = null, Ke(e.ctx), H = !1, Wn = ++Un, e.ac !== null && (st(() => {
		e.ac.abort(_e);
	}), e.ac = null);
	try {
		e.f |= oe;
		var u = e.fn, d = u();
		e.f |= C;
		var f = Xn(e);
		if (et() && q !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < q.length; p++) Jn(q[p], e);
		if (i !== null && i !== e) {
			if (Un++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Un;
			if (t !== null) for (let e of t) e.rv = Un;
			q !== null && (r === null ? r = q : r.push(...q));
		}
		return e.f & 8388608 && (e.f ^= ce), d;
	} catch (t) {
		return Xn(e), ln(t);
	} finally {
		e.f ^= oe, G = t, K = n, q = r, V = i, zn = a, Ke(o), H = s, Wn = c;
	}
}
function Xn(e) {
	var t = e.deps, n = j?.is_fork;
	if (G !== null) {
		var r;
		if (n || Qn(e, K), t !== null && K > 0) for (t.length = K + G.length, r = 0; r < G.length; r++) t[K + r] = G[r];
		else e.deps = t = G;
		if (mn() && e.f & 512) for (r = K; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && K < t.length && (Qn(e, K), t.length = K);
	return t;
}
function Zn(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var o = i.call(r, e);
		if (o !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[o] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (G === null || !a.call(G, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && at(c), c.ac !== null && st(() => {
			c.ac.abort(_e), c.ac = null, k(c, b);
		}), yt(c), Qn(c, 0);
	}
}
function Qn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Zn(e, n[r]);
}
function $n(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, y);
		var n = W, r = Fn;
		W = e, Fn = !(t & 96);
		try {
			t & 16777232 ? En(e) : Tn(e), wn(e);
			var i = Yn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Hn;
		} finally {
			Fn = r, W = n;
		}
	}
}
function J(e) {
	var t = !!(e.f & 2);
	if (Pn?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (zn === null || !zn.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < Un && (e.rv = Un, G === null && n !== null && n[K] === e ? K++ : G === null ? G = [e] : G.push(e));
		else {
			V.deps ??= [], a.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : a.call(r, V) || r.push(V);
		}
	}
	if (In && Rt.has(e)) return Rt.get(e);
	if (t) {
		var i = e;
		if (In) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || tr(i)) && (o = _t(i)), Rt.set(i, o), o;
		}
		var s = !(i.f & 512) && !H && V !== null && (Fn || !!(V.f & 512)), c = (i.f & C) === 0;
		qn(i) && (s && (i.f |= 512), vt(i)), s && !c && (bt(i), er(i));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function er(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (bt(t), er(t));
}
function tr(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && tr(t)) return !0;
	return !1;
}
function nr(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
function rr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (le in e) ir(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && le in n && ir(n);
		}
	}
}
function ir(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			ir(e[n], t);
		} catch {}
		let n = f(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = l(n);
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
var ar = Symbol("events"), or = /* @__PURE__ */ new Set(), sr = /* @__PURE__ */ new Set();
function cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || pr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, rt(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function lr(e, t, n, r = {}) {
	var i = cr(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function ur(e, t, n) {
	(t[ar] ??= {})[e] = n;
}
function Y(e) {
	for (var t = 0; t < e.length; t++) or.add(e[t]);
	for (var n of sr) n(e);
}
var dr = null, fr = !1;
function pr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	dr = e, fr || (fr = !0, setTimeout(() => {
		fr = !1, dr = null;
	}));
	var o = 0, c = dr === e && e[ar];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[ar] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		s(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = V, f = W;
		U(null), Rn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[ar]?.[r];
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
			e[ar] = t, delete e.currentTarget, U(d), Rn(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var mr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function hr(e) {
	return mr?.createHTML(e) ?? e;
}
function gr(e) {
	var t = sn("template");
	return t.innerHTML = hr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function _r(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function X(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return _r(T, null), T;
		i === void 0 && (i = gr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ tn(i)));
		var t = r || Xt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ tn(t), s = t.lastChild;
			_r(o, s);
		} else _r(t, t);
		return t;
	};
}
function Z(e, t) {
	if (w) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Ce();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var vr = ["touchstart", "touchmove"];
function yr(e) {
	return vr.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function br(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		mn() && (J(n), xn(() => (t === 0 && (r = nr(() => e(() => Kt(n)))), t += 1, () => {
			rt(() => {
				--t, t === 0 && (r?.(), r = void 0, Kt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var xr = ne | re;
function Sr(e, t, n, r) {
	new Cr(e, t, n, r);
}
var Cr = class {
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
	#h = br(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Sn(() => {
			if (w) {
				let e = this.#t;
				Ce();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, xr), w && (this.#e = T);
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
		rt(r), t && (this.#s = z(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				xe();
				return;
			}
			t = !0, n && He(), this.#s !== null && kn(this.#s, () => {
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
					un(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), rt(() => {
			var e = this.#c = document.createDocumentFragment(), t = en(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return z(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						un(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(j);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, kn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Nn(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ot(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = V, r = O;
		Rn(this.#i), U(this.#i), Ke(this.#i.ctx);
		try {
			return At.ensure(), e();
		} finally {
			Rn(t), U(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && kn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, rt(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), J(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), w && (E(this.#t), we(), E(Te()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return z(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return un(e, this.#i.parent), null;
				}
			}));
		};
		rt(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				un(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => un(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function Q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ge] ??= e.nodeValue) && (e[ge] = n, e.nodeValue = `${n}`);
}
function wr(e, t) {
	return Er(e, t);
}
var Tr = /* @__PURE__ */ new Map();
function Er(t, { target: n, anchor: r, props: i = {}, events: a, context: s, intro: c = !0, transformError: l }) {
	$t();
	var u = void 0, d = vn(() => {
		var c = r ?? n.appendChild(en());
		Sr(c, { pending: () => {} }, (n) => {
			Ze({});
			var r = O;
			if (s && (r.c = s), a && (i.$$events = a), w && _r(n, null), u = t(n, i) || $e(), w && (W.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw be(), e;
			Qe();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = yr(r);
					for (let e of [n, document]) {
						var a = Tr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Tr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, pr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(o(or)), sr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Tr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, pr), t.delete(e), t.size === 0 && Tr.delete(r)) : t.set(e, i);
			}
			sr.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return Dr.set(u, d), u;
}
var Dr = /* @__PURE__ */ new WeakMap();
function Or(e, t) {
	let n = Dr.get(e);
	return n ? (Dr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var kr = class {
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
			if (n) jn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (jn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						Nn(r, t), t.append(en()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), kn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = on();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = en();
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
		} else w && (this.anchor = T), this.#a(n);
	}
};
function Ar(e) {
	O === null && Ae("onMount"), gn(() => {
		let t = nr(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function $(e, t, n = !1) {
	var r;
	w && (r = T, Ce());
	var i = new kr(e), a = n ? ne : 0;
	function o(e, t) {
		if (w) {
			var n = Ee(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Te();
				E(a), i.anchor = a, Se(!1), i.ensure(e, t), Se(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Sn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function jr(e, t, n) {
	for (var r = [], i = t.length, a, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		kn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Mr(e, o(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			an(d), d.append(u), e.items.clear();
		}
		Mr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Mr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ae, Nn(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var Nr;
function Pr(e, t, n, i, a, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? E(/* @__PURE__ */ tn(u)) : u.appendChild(en());
	}
	w && Ce();
	var d = null, f = /* @__PURE__ */ ht(() => {
		var e = n();
		return r(e) ? e : e == null ? [] : o(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Ir(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ae, Rr(d, null, c)) : jn(d) : kn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Sn(() => {
			p = J(f);
			var e = p.length;
			let r = !1;
			w && Ee(c) === "[!" != (e === 0) && (c = Te(), E(c), Se(!1), r = !0);
			for (var o = /* @__PURE__ */ new Set(), u = j, v = on(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, r = !0, Se(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && u.unskip_effect(S.e)) : (S = Lr(l, h ? c : Nr ??= en(), b, x, y, a, t, n), h || (S.e.f |= ae), l.set(x, S)), o.add(x);
			}
			if (e === 0 && s && !d && (h ? d = z(() => s(c)) : (d = z(() => s(Nr ??= en())), d.f |= ae)), e > o.size && Ne("", "", ""), w && e > 0 && E(Te()), !h) {
				if (m.set(u, o), v) {
					for (let [e, t] of l) o.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			r && Se(!0), J(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function Fr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Ir(e, t, n, r, i) {
	var a = !!(r & 8), s = t.length, c = e.items, l = Fr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (jn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ae, _ === l) Rr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), zr(e, d, _), zr(e, _, y), Rr(_, y, n), d = _, p = [], m = [], l = Fr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Rr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					zr(e, S.prev, ee.next), zr(e, d, S), zr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Rr(_, l, n), zr(e, _.prev, _.next), zr(e, _, d === null ? e.effect.first : d.next), zr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Fr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Fr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Mr(e, o(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = Fr(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && s === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			jr(e, C, ne);
		}
	}
	a && rt(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Lr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: z(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Rr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ nn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function zr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Br(e, t, n) {
	var r;
	w && (r = T, Ce());
	var i = new kr(e);
	Sn(() => {
		var e = t() ?? null;
		if (w && Ee(r) === "[" != (e !== null)) {
			var a = Te();
			E(a), i.anchor = a, Se(!1), i.ensure(e, e && ((t) => n(t, e))), Se(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, ne);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Vr(e, t, n) {
	yn(() => {
		var r = nr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			xn(() => {
				var e = n();
				rr(e), i && Oe(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Hr(e, t) {
	var n = void 0, r;
	Cn(() => {
		n !== (n = t()) && (r &&= (B(r), null), n && (r = z(() => {
			yn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/attributes.js
var Ur = [..." 	\n\r\f\xA0\v﻿"];
function Wr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ur.includes(r[o - 1])) && (s === r.length || Ur.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Gr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Kr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function qr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Kr)), i && c.push(...Object.keys(i).map(Kr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Kr(e.substring(l, u).trim());
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
		return r && (n += Gr(r)), i && (n += Gr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/class.js
function Jr(e, t, n, r, i, a) {
	var o = e[me];
	if (w || o !== n || o === void 0) {
		var s = Wr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[me] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/style.js
function Yr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Xr(e, t, n, r) {
	var i = e[he];
	if (w || i !== t) {
		var a = qr(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[he] = t;
	} else r && (Array.isArray(r) ? (Yr(e, n?.[0], r[0]), Yr(e, n?.[1], r[1], "important")) : Yr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Zr = Symbol("is custom element"), Qr = Symbol("is html"), $r = ve ? "link" : "LINK";
function ei(e, t, n, r) {
	var i = ti(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === $r) || i[t] !== (i[t] = n) && (t === "loading" && (e[fe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ri(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ti(e) {
	return e[pe] ??= {
		[Zr]: e.nodeName.includes("-"),
		[Qr]: e.namespaceURI === n
	};
}
var ni = /* @__PURE__ */ new Map();
function ri(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ni.get(t);
	if (n) return n;
	ni.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = l(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = f(i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function ii(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), h;
	let r = nr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var ai = [];
function oi(e, t = h) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Oe(e, t) && (e = t, n)) {
			let t = !ai.length;
			for (let t of r) t[1](), ai.push(t, e);
			if (t) {
				for (let e = 0; e < ai.length; e += 2) ai[e][0](ai[e + 1]);
				ai.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = h) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || h), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function si(e) {
	let t;
	return ii(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/store.js
var ci = !1;
function li(e) {
	var t = ci;
	try {
		return ci = !1, [e(), ci];
	} finally {
		ci = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var ui = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (m(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			m(i) && (i = i());
			let a = c(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (m(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = c(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === le || t === de) return !1;
		for (let n of e.props) if (m(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (m(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function di(...e) {
	return new Proxy({ props: e }, ui);
}
function fi(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ ft(r), J(u)) : (l && (l = !1, s = o ? nr(r) : r), s);
	let f;
	if (a) {
		var p = le in e || de in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = li(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Re(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
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
	var v = !1, y = (n & 1 ? ft : ht)(() => (v = !1, g()));
	a && J(y);
	var b = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? J(y) : i && a ? Jt(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return In && v || b.f & 16384 ? y.v : J(y);
	});
}
//#endregion
//#region packages/core/src/algorithms/display-models.ts
function pi(e, t) {
	return e.endPeriod >= 1 && e.startPeriod <= t;
}
var mi = [
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
})), hi = /\s+/g;
function gi(e) {
	return e.replace(/^【调】/, "").replace(/[★☆〇■◆]$/u, "").trim().replace(hi, " ");
}
var _i = {
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
}, vi = {
	schemaVersion: 1,
	themeMode: "auto",
	wallpaperSource: "none",
	wallpaperColorEnabled: !1,
	wallpaperMaskEnabled: !0,
	timetableLayoutMode: "compact",
	capsuleCornerStyle: "sharp",
	hapticFeedbackEnabled: !0,
	reduceMotionEnabled: !1,
	prepareReminderMinutes: 30,
	classNotificationsEnabled: !1,
	currentPeriodHighlightEnabled: !1
};
//#endregion
//#region packages/core/src/algorithms/date.ts
function yi(e) {
	let t = e.trim(), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
	if (!n) throw Error(`Invalid ISO date: ${e}`);
	let [, r, i, a] = n;
	return new Date(Date.UTC(Number(r), Number(i) - 1, Number(a), 12));
}
function bi(e) {
	return `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function xi(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function Si(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function Ci(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function wi(e, t) {
	return Ci(e, t * 7);
}
function Ti(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function Ei(e, t) {
	return e.getTime() < t.getTime();
}
function Di(e) {
	return bi(Si(yi(e)));
}
function Oi(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var ki = class {
	normalizeTermStartDate(e, t) {
		let n = yi(Di(t));
		if (!e || !e.trim()) return bi(Si(n));
		try {
			return bi(Si(yi(e)));
		} catch {
			return bi(Si(this.inferTermStartDateFromTermName(e) || n));
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
		}, r = yi(this.normalizeTermStartDate(n.termStartDate, e)), i = yi(e);
		if (Ei(i, r)) return n.startWeek;
		let a = Ti(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return bi(wi(yi(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return bi(Ci(yi(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
//#endregion
//#region packages/core/src/algorithms/holiday-calendar.ts
function Ai(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e?.holidays?.length) return t;
	for (let n of e.holidays) t.set(n.date, n);
	return t;
}
//#endregion
//#region packages/core/src/algorithms/course-schedule.ts
function ji(e) {
	try {
		return bi(yi(e)) === e;
	} catch {
		return !1;
	}
}
function Mi(e, t) {
	if (t && (!ji(t.startDateIso) || !ji(t.endDateIso) || t.startDateIso > t.endDateIso)) throw RangeError("Expected an inclusive ISO date range");
	let n = e.academicConfig;
	if (!ji(n.termStartDate) || !Number.isInteger(n.startWeek) || !Number.isInteger(n.endWeek) || n.startWeek < 1 || n.endWeek < n.startWeek) return [];
	let r = new ki(), i = yi(r.resolveWeekStart(n, n.startWeek, n.termStartDate)), a = t ? Math.max(n.startWeek, n.startWeek + Ti(i, yi(t.startDateIso))) : n.startWeek, o = t ? Math.min(n.endWeek, n.startWeek + Ti(i, yi(t.endDateIso))) : n.endWeek, s = Ai(n.holidayCalendar), c = e.courses.filter((e) => Number.isInteger(e.dayOfWeek) && e.dayOfWeek >= 1 && e.dayOfWeek <= 7 && Number.isInteger(e.startPeriod) && Number.isInteger(e.endPeriod) && e.startPeriod >= 1 && e.endPeriod >= e.startPeriod && pi(e, n.periodTimes.length)), l = [];
	for (let i = a; i <= o; i++) for (let a of c) {
		if (a.weeks.length && !a.weeks.includes(i)) continue;
		let o = r.resolveCourseDate(n, i, a.dayOfWeek, n.termStartDate);
		t && (o < t.startDateIso || o > t.endDateIso) || s.has(o) || l.push({
			timetableId: e.id,
			timetableName: e.name,
			course: a,
			dateIso: o,
			academicWeek: i
		});
	}
	return l.sort((e, t) => e.dateIso.localeCompare(t.dateIso));
}
function Ni(e, t) {
	return Mi(e, {
		startDateIso: t,
		endDateIso: t
	}).map(({ timetableId: e, timetableName: t, course: n }) => ({
		timetableId: e,
		timetableName: t,
		course: n
	}));
}
//#endregion
//#region packages/core/src/algorithms/period-clock.ts
function Pi(e) {
	let t = /^(\d{1,2}):(\d{2})$/.exec(e.trim());
	return t ? Number(t[1]) * 60 + Number(t[2]) : 0;
}
function Fi(e) {
	return e.map((e) => ({
		index: e.index,
		startMinutes: Pi(e.startTime),
		endMinutes: Pi(e.endTime)
	})).sort((e, t) => e.index - t.index);
}
function Ii(e) {
	return e.getHours() * 60 + e.getMinutes();
}
function Li(e, t, n = "upcomingOrLast") {
	let r = null;
	for (let n of e) {
		if (t >= n.startMinutes && t <= n.endMinutes) return n.index;
		r == null && t < n.startMinutes && (r = n.index);
	}
	return n === "none" ? null : r ?? e.at(-1)?.index ?? null;
}
.2126 * Ri(15 / 255) + .7152 * Ri(23 / 255) + .0722 * Ri(42 / 255);
function Ri(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/types/services.ts
function zi(e) {
	return { key: e };
}
var Bi = zi("storage"), Vi = zi("analytics"), Hi = zi("hostNavigation"), Ui = zi("coursePresentation");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function Wi(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/mountable.ts
var Gi = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/analytics/plugin-analytics.ts
function Ki(e, t) {
	return `plugin.${e}.${t}`;
}
function qi(e, t, n, r) {
	let i = e.tryService(Vi);
	i && i.track(Ki(t, n), {
		...r,
		source: "plugin",
		plugin_id: t
	});
}
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function Ji(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Yi() {
	return "1.2.4";
}
function Xi(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Ji(e.messages, e.nameKey),
		version: e.version ?? Yi(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Ji(e.messages, e.descriptionKey) : void 0,
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
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/index-client.js
function Zi(e) {
	let t, n = br((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return mn() ? (n(), t) : si(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Y(["input"]), Y(["change"]), Y(["change"]), Y(["change"]);
//#endregion
//#region packages/ui-kit/src/utils/middle-truncate.ts
var Qi = null;
function $i(e) {
	if (typeof document > "u") return () => Infinity;
	Qi ??= document.createElement("canvas");
	let t = Qi.getContext("2d");
	return t ? (t.font = e, (e) => t.measureText(e).width) : () => Infinity;
}
function ea(e, t, n, r = 6) {
	if (e <= 0) return r;
	let i = Math.max(r, n), a = Math.min(r, i), o = t(i);
	if (o <= e) return i;
	let s = e / o * i, c = Math.max(a, Math.min(i, Math.floor(s * 10) / 10));
	if (c <= a) return a;
	if (t(c) > e) {
		let n = t(c);
		if (n > e) {
			let t = e / n * c;
			c = Math.max(a, Math.min(i, Math.floor(t * 10) / 10));
		}
	}
	return c;
}
function ta(e) {
	let t = getComputedStyle(e), n = t.fontStyle || "normal", r = t.fontWeight || "normal", i = t.fontFamily || "sans-serif";
	return (e) => $i(`${n} ${r} ${e}px ${i}`);
}
//#endregion
//#region packages/ui-kit/src/utils/fit-width-font.svelte.ts
var na = 6;
function ra(e) {
	return (t) => {
		let n = () => {
			let { lines: n, maxFontPx: r, minFontPx: i = na, fromParent: a = !1, availableWidthPx: o } = e(), s = n.filter((e) => e.length > 0), c = o ?? (a ? t.parentElement ?? t : t).clientWidth;
			if (a) {
				let e = getComputedStyle(t);
				if (c -= (Number.parseFloat(e.paddingLeft) || 0) + (Number.parseFloat(e.paddingRight) || 0), t.parentElement) {
					let e = getComputedStyle(t.parentElement);
					c -= (Number.parseFloat(e.paddingLeft) || 0) + (Number.parseFloat(e.paddingRight) || 0);
				}
				c = Math.max(0, c);
			}
			if (c <= 0 || s.length === 0) return;
			let l = ta(t), u = ea(c, (e) => {
				let t = l(e);
				return Math.max(...s.map((e) => t(e)));
			}, r, i);
			t.style.fontSize = `${u}px`;
		}, r = null, i = null;
		return gn(() => {
			let { fromParent: a = !1, availableWidthPx: o } = e();
			if (o != null) {
				r &&= (i?.disconnect(), i = null, null), n();
				return;
			}
			let s = a ? t.parentElement ?? t : t;
			r !== s && (i ??= new ResizeObserver(n), i.disconnect(), i.observe(s), r = s), n();
		}), () => i?.disconnect();
	};
}
//#endregion
//#region packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
Y([
	"click",
	"pointerdown",
	"pointerup"
]), Y(["change"]);
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/reactive-value.js
var ia = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = br(t);
	}
	get current() {
		return this.#t(), this.#e();
	}
}, aa = /\(.+\)/, oa = /* @__PURE__ */ new Set([
	"all",
	"print",
	"screen",
	"and",
	"or",
	"not",
	"only"
]), sa = class extends ia {
	constructor(e, t) {
		let n = aa.test(e) || e.split(/[\s,]+/).some((e) => oa.has(e.trim())) ? e : `(${e})`, r = window.matchMedia(n);
		super(() => r.matches, (e) => lr(r, "change", e));
	}
};
//#endregion
//#region packages/ui-kit/src/form/date-field-utils.ts
function ca(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
//#endregion
//#region packages/ui-kit/src/platform/native-bridge.ts
var la = "__CHRONOS_NATIVE__";
function ua() {
	if (typeof window > "u") return null;
	let e = window[la];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/haptic/haptic.ts
var da = _i.hapticFeedbackEnabled;
function fa() {
	return ua();
}
function pa() {
	return typeof navigator < "u" && typeof navigator.vibrate == "function";
}
function ma() {
	return pa() ? typeof navigator < "u" && "userActivation" in navigator && navigator.userActivation != null ? navigator.userActivation.hasBeenActive : !0 : !1;
}
function ha() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !0;
		let e = localStorage.getItem(da);
		return e !== "0" && e !== "false";
	} catch {
		return !0;
	}
}
function ga(e) {
	if (!ma()) return !1;
	try {
		return navigator.vibrate(e);
	} catch {
		return !1;
	}
}
function _a(e, t) {
	if (!ha()) return !1;
	let n = fa();
	return n ? (n.callNative("haptic", e.method, e.params ?? {}).catch(() => {
		ga(t);
	}), !0) : ga(t);
}
var va = {
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
}, ya = {
	selection() {
		return _a({ method: "selection" }, va.selection);
	},
	light() {
		return _a({
			method: "vibrate",
			params: { duration: va.light }
		}, va.light);
	},
	medium() {
		return _a({
			method: "impact",
			params: { style: "medium" }
		}, va.medium);
	},
	heavy() {
		return _a({
			method: "impact",
			params: { style: "heavy" }
		}, va.heavy);
	},
	success() {
		return _a({
			method: "notification",
			params: { type: "success" }
		}, va.success);
	},
	warning() {
		return _a({
			method: "notification",
			params: { type: "warning" }
		}, va.warning);
	},
	cancel() {
		if (ma()) try {
			return navigator.vibrate(0);
		} catch {
			return !1;
		}
		return !1;
	}
};
//#endregion
//#region packages/ui-kit/src/form/SelectableOption.svelte
Y(["click"]), Y(["click"]);
//#endregion
//#region packages/ui-kit/src/components/SegmentedControl.svelte
var ba = /* @__PURE__ */ X("<div aria-hidden=\"true\"></div>"), xa = /* @__PURE__ */ X("<button type=\"button\" role=\"tab\"> </button>"), Sa = /* @__PURE__ */ X("<div role=\"tablist\"><!> <!></div>");
function Ca(e, t) {
	Ze(t, !0);
	let n = fi(t, "class", 3, ""), r = fi(t, "animateThumb", 3, !0), i = /* @__PURE__ */ A(() => t.segments.findIndex((e) => e.value === t.value)), a = /* @__PURE__ */ A(() => t.segments.length), o = /* @__PURE__ */ A(() => J(i) < 0 ? 0 : J(i));
	function s(e) {
		e !== t.value && ya.medium(), t.onValueChange(e);
	}
	function c(e, n) {
		if (J(a) <= 1 || e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		e.preventDefault();
		let r = (n + (e.key === "ArrowRight" ? 1 : -1) + J(a)) % J(a), i = t.segments[r]?.value;
		i && s(i);
	}
	var l = Sa(), u = F(l), d = (e) => {
		var t = ba();
		let n;
		R(() => {
			Jr(t, 1, `ui-segmented-thumb ${r() ? "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]" : ""}`), n = Xr(t, "", n, {
				left: `calc(0.375rem + ${J(o) ?? ""} * ((100% - 0.75rem) / ${J(a) ?? ""}))`,
				width: `calc((100% - 0.75rem) / ${J(a) ?? ""})`
			});
		}), Z(e, t);
	};
	$(u, (e) => {
		J(a) > 0 && J(i) >= 0 && e(d);
	}), Pr(L(u, 2), 19, () => t.segments, (e) => e.value, (e, n, r) => {
		var a = xa(), o = I(a, !0);
		R(() => {
			ei(a, "aria-selected", t.value === J(n).value), ei(a, "tabindex", t.value === J(n).value || J(i) < 0 && J(r) === 0 ? 0 : -1), Jr(a, 1, `ui-segmented-tab text-label-large relative z-10 flex-1 cursor-pointer rounded-control py-2 text-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${t.value === J(n).value ? "text-on-secondary-container" : "text-on-surface-variant hover:text-on-surface"}`), Q(o, J(n).label);
		}), ur("click", a, () => s(J(n).value)), ur("keydown", a, (e) => c(e, J(r))), Z(e, a);
	}), D(l), R(() => Jr(l, 1, `ui-segmented-track ${n() ?? ""}`)), Z(e, l), Qe();
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
Y(["click", "keydown"]), _i.reduceMotionEnabled, Y(["pointerdown"]), Y(["keydown", "click"]), Y(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [wa, Ta] = qe();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Y(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var Ea = /* @__PURE__ */ X("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function Da(e, t) {
	Ze(t, !0);
	let n = /* @__PURE__ */ A(() => t.component), r = /* @__PURE__ */ A(() => Zi(t.propsStore).current);
	var i = Ea();
	Br(F(i), () => J(n), (e, t) => {
		t(e, di(() => J(r)));
	}), D(i), Z(e, i), Qe();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Oa(e) {
	return {
		[Gi]: !0,
		mount(t, n, r) {
			let i = oi({ ...n }), a = wr(Da, {
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
					Or(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function ka(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Wi(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Wi(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var Aa = 900, ja = 24, Ma = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function Na(e) {
	return Ma.has(e) ? !0 : e.startsWith("max-w-");
}
function Pa(e) {
	let t = [], n = [];
	for (let r of e) Na(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function Fa(e, t, n, r = ja) {
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
function Ia(e, t) {
	if (!t.visible) {
		e.style.display = "none";
		return;
	}
	e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`;
}
function La(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = Pa(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Ia(a, Fa(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, Aa);
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
function Ra(e) {
	return La(e);
}
//#endregion
//#region packages/plugins/today/src/messages.ts
var za = {
	"zh-cn": {
		"plugin.name": "今日",
		"plugin.description": "快速查看当天课程",
		"tab.label": "今日",
		"screen.title": "今日",
		"screen.week": "第 {week} 周",
		"screen.scope.active": "当前课表",
		"screen.scope.all": "全部课表",
		"screen.summary.count": "共 {count} 节课",
		"screen.summary.current": "第 {period} 节进行中",
		"screen.empty.noTimetable": "请先选择或创建课表",
		"screen.empty.noCourses": "今天没有课",
		"screen.status.current": "上课中",
		"screen.status.preparing": "准备上课",
		"screen.status.past": "已结束",
		"screen.status.upcoming": "未开始",
		"screen.course.location": "教室 {location}",
		"screen.course.teacher": "教师 {teacher}",
		"screen.course.timetable": "{name}",
		"screen.course.periodSingle": "第 {n} 节",
		"screen.course.periodRange": "第 {start}-{end} 节",
		"config.scope.title": "范围"
	},
	en: {
		"plugin.name": "Today",
		"plugin.description": "Quickly view today's courses",
		"tab.label": "Today",
		"screen.title": "Today",
		"screen.week": "Week {week}",
		"screen.scope.active": "Current timetable",
		"screen.scope.all": "All timetables",
		"screen.summary.count": "{count} course(s) today",
		"screen.summary.current": "Period {period} in progress",
		"screen.empty.noTimetable": "Select or create a timetable first",
		"screen.empty.noCourses": "No classes today",
		"screen.status.current": "Now",
		"screen.status.preparing": "Get ready",
		"screen.status.past": "Ended",
		"screen.status.upcoming": "Upcoming",
		"screen.course.location": "Room {location}",
		"screen.course.teacher": "Teacher {teacher}",
		"screen.course.timetable": "{name}",
		"screen.course.periodSingle": "Period {n}",
		"screen.course.periodRange": "Periods {start}-{end}",
		"config.scope.title": "Scope"
	}
}, Ba = "tool-today";
//#endregion
//#region packages/plugins/today/src/index.ts
function Va(e = {}) {
	let { screenComponent: t } = e;
	return Xi({
		id: Ba,
		messages: za,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "tool",
		toolGroup: "utility",
		order: 35,
		author: "Chronos",
		defaultConfig: { scope: "active" },
		async apply(e, n) {
			e.registerSlot("shell.bottom-bar.tab", {
				id: "today",
				label: () => n("tab.label"),
				order: 15,
				icon: "calendar-clock",
				iconFill: "calendar-clock-fill",
				defaultLaunch: !0
			}), e.registerSlot("shell.route.screen", {
				id: Ba,
				title: () => n("screen.title"),
				...t ? { component: t } : {}
			});
		}
	});
}
//#endregion
//#region packages/plugins/today/src/analytics.ts
var Ha = { preparingStatusShown: "preparing_status_shown" };
//#endregion
//#region packages/plugins/today/src/today-courses.ts
function Ua(e, t, n) {
	let r = e.find((e) => e.index === t), i = e.find((e) => e.index === n);
	return !r || !i ? null : {
		startTime: r.startTime,
		endTime: i.endTime
	};
}
function Wa(e, t) {
	return [...e].sort((e, n) => {
		let r = e.course.startPeriod - n.course.startPeriod;
		if (r !== 0) return r;
		let i = e.course.endPeriod - n.course.endPeriod;
		return i === 0 ? e.course.name.localeCompare(n.course.name, t) : i;
	});
}
function Ga(e, t, n) {
	let r = Fi(t).find((t) => t.index === e.startPeriod);
	return !r || n >= r.startMinutes ? null : r.startMinutes - n;
}
function Ka(e, t, n, r, i = 0) {
	let a = Fi(t), o = a.find((t) => t.index === e.startPeriod), s = a.find((t) => t.index === e.endPeriod);
	if (o && s) {
		if (n > s.endMinutes) return "past";
		if (n >= o.startMinutes && n <= s.endMinutes) return "current";
		if (n < o.startMinutes) {
			let e = o.startMinutes - n;
			return i > 0 && e <= i ? "preparing" : "upcoming";
		}
	}
	return r == null ? "upcoming" : e.endPeriod < r ? "past" : e.startPeriod <= r && e.endPeriod >= r ? "current" : "upcoming";
}
function qa(e, t, n, r) {
	return Wa(e, r).map((e) => ({
		hit: e,
		timeRange: Ua(e.periodTimes, e.course.startPeriod, e.course.endPeriod),
		status: Ka(e.course, e.periodTimes, t, Li(Fi(e.periodTimes), t), n),
		minutesUntilStart: Ga(e.course, e.periodTimes, t)
	}));
}
async function Ja(e, t) {
	let { todayIso: n, scope: r, timetable: i } = t;
	if (!i) return [];
	let a = (e) => Ni(e, n).map((t) => ({
		...t,
		periodTimes: e.academicConfig.periodTimes
	}));
	if (r === "active") return a(i);
	let o = await e.listTimetables();
	return (await Promise.all(o.map((t) => e.getTimetable(t.id)))).flatMap((e) => e ? a(e) : []);
}
//#endregion
//#region packages/plugins/today/src/today-screen.svelte.ts
function Ya(e, t) {
	return `${e}\0${gi(t)}`;
}
function Xa() {
	let e, t = "", n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N("active"), i = /* @__PURE__ */ N([]), a = /* @__PURE__ */ N(/* @__PURE__ */ new Map()), o = [], s = !1, c, l, u = 0, d = 0, f = "", p, m = !1, h = !1, g;
	function _() {
		return J(n)?.now ?? /* @__PURE__ */ new Date();
	}
	function v() {
		return J(n)?.todayIso || Oi();
	}
	function y() {
		return J(n)?.userPreferences?.prepareReminderMinutes ?? vi.prepareReminderMinutes;
	}
	function b() {
		P(i, qa(o, Ii(_()), y(), ca(J(n)?.locale)));
	}
	async function x() {
		let n = ++d, r = (e?.getPluginContext(t))?.tryService(Ui), o = J(i);
		try {
			let e = /* @__PURE__ */ new Map();
			r && await Promise.all([...new Set(o.map((e) => e.hit.timetableId))].map(async (t) => {
				let n = await r.resolveCoursePaintsForTimetable(t);
				for (let [r, i] of n) e.set(Ya(t, r), i);
			})), !s && n === d && P(a, e);
		} catch {
			!s && n === d && P(a, /* @__PURE__ */ new Map());
		}
	}
	async function S() {
		let c = ++u, l = J(n)?.currentTimetable;
		if (!e || !l) {
			o = [], b(), await x();
			return;
		}
		try {
			let n = await Ja(e.getPluginContext(t).service(Bi), {
				todayIso: v(),
				scope: J(r),
				timetable: l
			});
			if (s || c !== u) return;
			o = n, b(), await x();
		} catch {
			if (s || c !== u) return;
			o = [], P(i, []), P(a, /* @__PURE__ */ new Map()), ++d;
		}
	}
	function ee() {
		if (s || !J(n)) return Promise.resolve();
		let e = J(n).currentTimetable, t = JSON.stringify([
			v(),
			J(r),
			e?.id,
			e?.academicConfig,
			e?.courses,
			J(r) === "all" ? J(n).timetables?.map((e) => [e.id, e.updatedAt]) : null
		]);
		return t !== f && (f = t, m = !0, ++u, ++d), p !== J(n).coursePaletteRevision && (p = J(n).coursePaletteRevision, h = !0, ++d), g ??= Promise.resolve().then(async () => {
			if (g = void 0, s) return;
			let e = m, t = h;
			m = !1, h = !1, e ? await S() : (b(), t && await x());
		}), g;
	}
	function C(e) {
		P(r, e.scope === "all" ? "all" : "active", !0);
	}
	async function te(r, i) {
		if (s || e) return;
		e = r, t = i;
		let a = r.getPluginContext(i);
		if (C(a.config), await Promise.resolve(), s) return;
		let o = a.on("config:changed", (e) => {
			s || e.pluginId !== t || (C(e.config), ee());
		});
		l = () => o.dispose(), c = r.snapshot.subscribe((e) => {
			P(n, e), ee();
		}), await g;
	}
	async function ne(n) {
		if (s || !e) return;
		J(r) !== n && ya.medium(), P(r, n, !0);
		let i = ee();
		try {
			await e.getPluginContext(t).updateConfig({ scope: n });
		} catch {}
		await i;
	}
	function re() {
		s || (s = !0, ++u, ++d, c?.(), l?.(), e = void 0, P(n, null), o = [], P(i, []), P(a, /* @__PURE__ */ new Map()));
	}
	return {
		get today() {
			return v();
		},
		get now() {
			return _();
		},
		get scope() {
			return J(r);
		},
		get prepareReminderMinutes() {
			return y();
		},
		get courseEntries() {
			return J(i);
		},
		get paintByCourseKey() {
			return J(a);
		},
		init: te,
		dispose: re,
		persistScope: ne
	};
}
//#endregion
//#region packages/plugins/today/src/TodayScreen.svelte
var Za = /* @__PURE__ */ X("<p class=\"text-label-large shrink-0 text-on-surface-variant\"> </p>"), Qa = /* @__PURE__ */ X("<div class=\"mt-1 flex items-center justify-between gap-3\"><p class=\"text-body-medium text-on-surface-variant\"> </p> <!></div>"), $a = /* @__PURE__ */ X("<p class=\"text-title-large leading-tight text-on-surface\"> </p> <!> <!>", 1), eo = /* @__PURE__ */ X("<header class=\"ui-safe-area-top--comfortable relative z-10 shrink-0 border-b border-outline/10 bg-surface/90 px-4 pb-4 backdrop-blur-sm\"><!></header>"), to = /* @__PURE__ */ X("<section class=\"ui-section-surface ui-section-surface--comfortable\"><!></section>"), no = /* @__PURE__ */ X("<section class=\"ui-section-surface ui-section-surface--comfortable flex flex-1 flex-col items-center justify-center py-16 text-center\"><div class=\"mb-4 flex size-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" class=\"size-8 fill-current\"><path d=\"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z\"></path></svg></div> <p class=\"text-title-medium text-on-surface\"> </p></section>"), ro = /* @__PURE__ */ X("<section class=\"ui-section-surface ui-section-surface--comfortable flex flex-1 flex-col items-center justify-center py-16 text-center\"><div class=\"mb-4 flex size-16 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" class=\"size-8 fill-current\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\"></path></svg></div> <p class=\"text-title-medium text-on-surface\"> </p></section>"), io = /* @__PURE__ */ X("<p class=\"text-label-medium text-on-surface tabular-nums\"> </p>"), ao = /* @__PURE__ */ X("<span class=\"text-label-small shrink-0 rounded-full bg-primary px-2 py-0.5 text-on-primary\"> </span>"), oo = /* @__PURE__ */ X("<span class=\"text-label-small shrink-0 rounded-full bg-secondary-container px-2 py-0.5 text-on-secondary-container\"> </span>"), so = /* @__PURE__ */ X("<p> </p>"), co = /* @__PURE__ */ X("<div class=\"text-body-small mt-1 flex flex-col gap-1 text-on-surface-variant\"><!> <!> <!></div>"), lo = /* @__PURE__ */ X("<div class=\"flex w-11 shrink-0 flex-col items-center self-stretch\"><!> <div class=\"flex min-h-0 w-full flex-1 flex-col items-center justify-center\"><p class=\"text-headline-small w-full min-w-0 text-center font-bold whitespace-nowrap text-on-surface-variant\"> </p></div> <!></div> <div class=\"w-1 shrink-0 self-stretch rounded-full\" aria-hidden=\"true\"></div> <div class=\"min-w-0 flex-1\"><div class=\"flex items-start justify-between gap-2\"><p class=\"text-title-medium truncate text-on-surface\"> </p> <!></div> <!></div>", 1), uo = /* @__PURE__ */ X("<button type=\"button\"><!></button>"), fo = /* @__PURE__ */ X("<div><!></div>"), po = /* @__PURE__ */ X("<li><!></li>"), mo = /* @__PURE__ */ X("<section class=\"ui-section-surface overflow-hidden\"><ul class=\"divide-y divide-outline/10\"></ul></section>"), ho = /* @__PURE__ */ X("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><!> <div class=\"secondary-scroll relative z-0 min-h-0 flex-1 overflow-y-auto\"><div class=\"flex flex-col gap-4 p-4\"><!> <!></div></div></div>");
function go(e, t) {
	Ze(t, !0);
	let n = (e) => {
		var t = $a(), n = rn(t), i = I(n, !0), a = L(n, 2), o = (e) => {
			var t = Qa(), n = F(t), r = I(n, !0), i = L(n, 2), a = (e) => {
				var t = Za(), n = I(t, !0);
				R((e) => Q(n, e), [() => p("screen.summary.count", { count: s.courseEntries.length })]), Z(e, t);
			};
			$(i, (e) => {
				s.courseEntries.length > 0 && e(a);
			}), D(t), R((e) => Q(r, e), [() => p("screen.week", { week: J(d) })]), Z(e, t);
		};
		$(a, (e) => {
			J(l) && e(o);
		}), Ca(L(a, 2), {
			class: "mt-4",
			get segments() {
				return J(f);
			},
			get value() {
				return s.scope;
			},
			get animateThumb() {
				return r();
			},
			onValueChange: (e) => void s.persistScope(e)
		}), R((e) => Q(i, e), [() => m(J(u))]), Z(e, t);
	}, r = fi(t, "active", 3, !0), i = /* @__PURE__ */ A(() => Zi(t.controller.snapshot)), a = new sa("(orientation: landscape) and (max-height: 500px)"), o = new ki(), s = Xa(), c = !1, l = /* @__PURE__ */ A(() => J(i).current.currentTimetable), u = /* @__PURE__ */ A(() => J(i).current.todayIso || s.today), d = /* @__PURE__ */ A(() => J(l) ? o.calculateAcademicWeek(J(u), J(l).academicConfig) : 1), f = /* @__PURE__ */ A(() => [{
		value: "active",
		label: p("screen.scope.active")
	}, {
		value: "all",
		label: p("screen.scope.all")
	}]);
	function p(e, n) {
		return J(i).current.slotVersion, J(i).current.coursePaletteRevision, ka(t.controller, Ba, za, e, n);
	}
	function m(e) {
		let t = (/* @__PURE__ */ new Date(`${e}T12:00:00`)).toLocaleDateString(ca(J(i).current.locale), { weekday: "short" });
		return `${xi(e)} ${t}`;
	}
	function h(e) {
		let t = Ya(e.timetableId, e.course.name);
		return s.paintByCourseKey.get(t) ?? mi[0];
	}
	let g = /* @__PURE__ */ A(() => {
		try {
			return t.controller.getPluginContext(t.pluginId).tryService(Hi);
		} catch {
			return;
		}
	});
	function _(e) {
		J(g)?.openCourseEditor(e);
	}
	gn(() => {
		r() && !c && s.courseEntries.some((e) => e.status === "preparing") && (c = !0, qi(t.controller.getPluginContext(t.pluginId), Ba, Ha.preparingStatusShown));
	}), Ar(() => (s.init(t.controller, t.pluginId), () => s.dispose()));
	var v = ho(), y = F(v), b = (e) => {
		var t = eo(), r = F(t);
		n(r), D(t), Z(e, t);
	};
	$(y, (e) => {
		a.current || e(b);
	});
	var x = L(y, 2), S = F(x), ee = F(S), C = (e) => {
		var t = to(), r = F(t);
		n(r), D(t), Z(e, t);
	};
	$(ee, (e) => {
		a.current && e(C);
	});
	var te = L(ee, 2), ne = (e) => {
		var t = no(), n = I(L(F(t), 2), !0);
		D(t), R((e) => Q(n, e), [() => p("screen.empty.noTimetable")]), Z(e, t);
	}, re = (e) => {
		var t = ro(), n = I(L(F(t), 2), !0);
		D(t), R((e) => Q(n, e), [() => p("screen.empty.noCourses")]), Z(e, t);
	}, ie = (e) => {
		var t = mo(), n = F(t);
		Pr(n, 21, () => s.courseEntries, (e) => `${e.hit.timetableId}-${e.hit.course.id}`, (e, t) => {
			var n = po();
			{
				let e = (e) => {
					var n = lo(), r = rn(n), i = F(r), a = (e) => {
						var t = io(), n = I(t, !0);
						R(() => Q(n, J(c).startTime)), Z(e, t);
					};
					$(i, (e) => {
						J(c) && e(a);
					});
					var u = L(i, 2), d = F(u), f = I(d, !0);
					Hr(d, () => ra(() => ({
						lines: [J(l)],
						maxFontPx: 24,
						minFontPx: 6,
						fromParent: !0
					}))), D(u);
					var m = L(u, 2), h = (e) => {
						var t = io(), n = I(t, !0);
						R(() => Q(n, J(c).endTime)), Z(e, t);
					};
					$(m, (e) => {
						J(c) && e(h);
					}), D(r);
					var g = L(r, 2);
					let _;
					var v = L(g, 2), y = F(v), b = F(y), x = I(b, !0), S = L(b, 2), ee = (e) => {
						var t = ao(), n = I(t, !0);
						R((e) => Q(n, e), [() => p("screen.status.current")]), Z(e, t);
					}, C = (e) => {
						var t = oo(), n = I(t, !0);
						R((e) => Q(n, e), [() => p("screen.status.preparing")]), Z(e, t);
					};
					$(S, (e) => {
						J(t).status === "current" ? e(ee) : J(t).status === "preparing" && e(C, 1);
					}), D(y);
					var te = L(y, 2), ne = (e) => {
						var n = co(), r = F(n), i = (e) => {
							var n = so(), r = I(n, !0);
							R((e) => Q(r, e), [() => p("screen.course.timetable", { name: J(t).hit.timetableName })]), Z(e, n);
						};
						$(r, (e) => {
							s.scope === "all" && J(t).hit.timetableName && e(i);
						});
						var a = L(r, 2), o = (e) => {
							var n = so(), r = I(n, !0);
							R(() => Q(r, J(t).hit.course.location)), Z(e, n);
						};
						$(a, (e) => {
							J(t).hit.course.location && e(o);
						});
						var c = L(a, 2), l = (e) => {
							var n = so(), r = I(n, !0);
							R(() => Q(r, J(t).hit.course.teacher)), Z(e, n);
						};
						$(c, (e) => {
							J(t).hit.course.teacher && e(l);
						}), D(n), Z(e, n);
					};
					$(te, (e) => {
						(s.scope === "all" && J(t).hit.timetableName || J(t).hit.course.location || J(t).hit.course.teacher) && e(ne);
					}), D(v), R(() => {
						Q(f, J(l)), _ = Xr(g, "", _, { "background-color": J(o).background }), Q(x, J(t).hit.course.name);
					}), Z(e, n);
				}, o = /* @__PURE__ */ A(() => h(J(t).hit)), c = /* @__PURE__ */ A(() => J(t).timeRange), l = /* @__PURE__ */ A(() => J(t).hit.course.startPeriod === J(t).hit.course.endPeriod ? p("screen.course.periodSingle", { n: J(t).hit.course.startPeriod }) : p("screen.course.periodRange", {
					start: J(t).hit.course.startPeriod,
					end: J(t).hit.course.endPeriod
				}));
				var r = F(n), i = (n) => {
					var r = uo(), i = F(r);
					e(i), D(r), R(() => Jr(r, 1, `flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-container-low ${J(t).status === "past" ? "opacity-60" : ""}`)), ur("click", r, () => _(J(t).hit.course.id)), Z(n, r);
				}, a = (n) => {
					var r = fo(), i = F(r);
					e(i), D(r), R(() => Jr(r, 1, `flex gap-3 px-4 py-4 ${J(t).status === "past" ? "opacity-60" : ""}`)), Z(n, r);
				};
				$(r, (e) => {
					J(g) ? e(i) : e(a, -1);
				}), D(n);
			}
			Z(e, n);
		}), D(n), D(t), Z(e, t);
	};
	$(te, (e) => {
		J(l) ? s.courseEntries.length === 0 ? e(re, 1) : e(ie, -1) : e(ne);
	}), D(S), D(x), Vr(x, (e) => Ra?.(e)), D(v), Z(e, v), Qe();
}
Y(["click"]);
//#endregion
//#region packages/plugins/today/bundle/entry.ts
var _o = Va({ screenComponent: Oa(go) });
//#endregion
export { _o as default };
