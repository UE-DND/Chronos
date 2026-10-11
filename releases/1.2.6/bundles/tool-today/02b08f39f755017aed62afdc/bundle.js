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
var v = 1024, y = 2048, b = 4096, x = 8192, S = 16384, ee = 32768, C = 1 << 25, te = 65536, ne = 1 << 19, re = 1 << 20, ie = 1 << 25, ae = 1 << 21, oe = 1 << 22, se = 1 << 23, ce = Symbol("$state"), le = Symbol("component"), ue = Symbol("legacy props"), de = Symbol(""), fe = Symbol("attributes"), pe = Symbol("class"), me = Symbol("style"), he = Symbol("text"), ge = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), _e = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function ve() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ye(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function be() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function xe(e) {
	w = e;
}
var T;
function E(t) {
	if (t === null) throw ye(), e;
	return T = t;
}
function Se() {
	return E(/* @__PURE__ */ en(T));
}
function D(t) {
	if (w) {
		if (/* @__PURE__ */ en(T) !== null) throw ye(), e;
		T = t;
	}
}
function Ce(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ en(n);
		T = n;
	}
}
function we(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ en(n);
		e && n.remove(), n = i;
	}
}
function Te(t) {
	if (!t || t.nodeType !== 8) throw ye(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function Ee(e) {
	return e === this.v;
}
function De(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Oe(e) {
	return !De(e, this.v);
}
function ke(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Ae() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function je() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Me(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ne(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Pe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Fe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ie() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Le(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Re() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ze() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Be() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ve() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function He(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Ae(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Ue(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function We(e, t) {
	return e === null && ke(t), e.c ??= new Map(Ue(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var O = null;
function Ge(e) {
	O = e;
}
function Ke() {
	return He(qe, Je, Ye);
}
function qe(e) {
	return We(O, "getContext").get(e);
}
function Je(e, t) {
	return We(O, "setContext").set(e, t), t;
}
function Ye(e) {
	return We(O, "hasContext").has(e);
}
function Xe(e, t = !1, n) {
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
function Ze(e) {
	var t = O, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) hn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, O = t.p, Qe(e);
}
function Qe(e = {}) {
	return s(e, le, { value: !0 }), e;
}
function $e() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var et = [];
function tt() {
	var e = et;
	et = [], g(e);
}
function nt(e) {
	if (et.length === 0 && !Ct) {
		var t = et;
		queueMicrotask(() => {
			t === et && tt();
		});
	}
	et.push(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var rt = ~(y | b | v);
function k(e, t) {
	e.f = e.f & rt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? k(e, v) : k(e, b);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, v);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = H, n = W;
	U(null), In(null);
	try {
		return e();
	} finally {
		U(t), In(n);
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
function st(e, t, n, r) {
	let i = $e() ? dt : mt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = ct(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				cn(e, s);
			}
			lt();
		}
	}
	var d = ut();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ pt(e))).then(u).catch((e) => cn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), lt();
	}) : f();
}
function ct() {
	var e = W, t = H, n = O, r = j;
	return function(i = !0) {
		In(e), U(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function lt(e = !0) {
	In(null), U(null), Ge(null), e && j?.deactivate();
}
function ut() {
	var e = W, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	var n = 2 | y;
	return W !== null && (W.f |= ne), {
		ctx: O,
		deps: null,
		effects: null,
		equals: Ee,
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
var ft = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function pt(e, n, r) {
	let i = W;
	i === null && je();
	var a = void 0, o = zt(t), s = !H, c = /* @__PURE__ */ new Set();
	return vn(() => {
		var t = W, n = _();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(lt);
		} catch (e) {
			n.reject(e), lt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = ut();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ft);
			else for (let e of c.values()) e.reject(ft);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ft && (r.activate(), t ? (o.f |= se, Ut(o, t)) : (o.f & 8388608 && (o.f ^= se), Ut(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), pn(() => {
		for (let e of c) e.reject(ft);
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
	let t = /* @__PURE__ */ dt(e);
	return Rn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function mt(e) {
	let t = /* @__PURE__ */ dt(e);
	return t.equals = Oe, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function gt(e) {
	var n, r = W, i = e.parent;
	if (!Nn && i !== null && e.v !== t && i.f & 24576) return ve(), e.v;
	In(i);
	try {
		ht(e), n = qn(e);
	} finally {
		In(r);
	}
	return n;
}
function _t(e) {
	var t = gt(e);
	if (!e.equals(t) && (e.wv = Wn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null))) {
		k(e, v);
		return;
	}
	Nn || (M === null ? it(e) : (fn() || j?.is_fork) && M.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = h), Xn(t, 0), Sn(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Zn(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var bt = null, j = null, xt = null, M = null, St = null, Ct = !1, wt = !1, Tt = null, Et = null, Dt = 0, Ot = 1, kt = class e {
	id = Ot++;
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
		bt === null ? bt = this : (bt.#n = this, this.#t = bt), bt = this;
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
			for (var r of n.d) k(r, y), t(r);
			for (r of n.m) k(r, b), t(r);
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
		for (let e of this.#u) this.#d.delete(e), k(e, y), this.schedule(e);
		for (let e of this.#d) k(e, b), this.schedule(e);
		this.apply();
		for (var t = Tt = [], n = [], r = Et = []; this.#c.length > 0;) {
			Dt++ > 1e3 && (this.#S(), At());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Ft(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Tt = null, Et = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Pt(e, t);
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
		this.#r.clear(), xt = this, Mt(n), Mt(t), xt = null, this.#s?.resolve();
		var o = j;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Lt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= v;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= v : i & 4 ? t.push(r) : Gn(r) && (i & 16 && this.#d.add(r), Zn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, y), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), j = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
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
			wt = !0, j = this, this.#_();
		} finally {
			Dt = 0, St = null, Tt = null, Et = null, wt = !1, j = null, M = null, Lt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ft);
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
		this.#m || (this.#m = !0, nt(() => {
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
			!wt && nt(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		if (St = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? bt = e : t.#t = e, this.linked = !1;
		}
	}
};
function At() {
	try {
		Ie();
	} catch (e) {
		cn(e, St);
	}
}
var jt = null;
function Mt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Gn(r) && (jt = /* @__PURE__ */ new Set(), Zn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Tn(r), jt?.size > 0)) {
				Lt.clear();
				for (let e of jt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) jt.has(n) && (jt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Zn(n);
					}
				}
				jt.clear();
			}
		}
		jt = null;
	}
}
function Nt(e) {
	j.schedule(e);
}
function Pt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, v);
		for (var n = e.first; n !== null;) Pt(n, t), n = n.next;
	}
}
function Ft(e) {
	k(e, v);
	for (var t = e.first; t !== null;) Ft(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var It = /* @__PURE__ */ new Set(), Lt = /* @__PURE__ */ new Map(), Rt = !1;
function zt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ee,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = zt(e, t);
	return Rn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Bt(e, t = !1, n = !0) {
	let r = zt(e);
	return t || (r.equals = Oe), r;
}
function P(e, t, n = !1) {
	return H !== null && (!Fn || H.f & 131072) && $e() && H.f & 4325394 && (Ln === null || !Ln.has(e)) && Be(), Ut(e, n ? qt(t) : t, Et);
}
var Vt = null, Ht = 0;
function Ut(e, t, n = null) {
	if (!e.equals(t)) {
		Nn ? Lt.set(e, t) : Lt.has(e) || Lt.set(e, e.v);
		var r = kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), M === null && it(t);
		}
		e.wv = Wn(), Vt = null, Ht = 0, Kt(e, y, n), Vt = null, $e() && W !== null && W.f & 1024 && !(W.f & 96) && (q === null ? zn([e]) : q.push(e)), !r.is_fork && It.size > 0 && !Rt && Wt();
	}
	return t;
}
function Wt() {
	Rt = !1;
	for (let e of It) {
		e.f & 1024 && k(e, b);
		let t;
		try {
			t = Gn(e);
		} catch {
			t = !0;
		}
		t && Zn(e);
	}
	It.clear();
}
function Gt(e) {
	P(e, e.v + 1);
}
function Kt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = $e(), a = r.length;
		if (Ht += a, Ht > 1e5 && Vt === null && (Vt = /* @__PURE__ */ new Set()), Vt !== null) {
			if (Vt.has(e)) return;
			Vt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & y) === 0;
				if (l && k(s, t), c & 131072) It.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), Kt(u, b, n);
				} else if (l) {
					var d = s;
					c & 16 && jt !== null && jt.add(d), n === null ? Nt(d) : n.push(d);
				}
			}
		}
	}
}
function qt(e) {
	if (typeof e != "object" || !e || ce in e || le in e) return e;
	let n = f(e);
	if (n !== u && n !== d) return e;
	var i = /* @__PURE__ */ new Map(), a = r(e), o = /* @__PURE__ */ N(0), s = null, l = Hn, p = (e) => {
		if (Hn === l) return e();
		var t = H, n = Hn;
		U(null), Un(l);
		var r = e();
		return U(t), Un(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ N(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Re();
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
					i.set(n, e), Gt(o);
				}
			} else P(r, t), Gt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === ce) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ N(qt(l ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
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
			if (n === ce) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || W !== null && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ N(a ? qt(e[n]) : t, s)), i.set(n, r)), J(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ N(t, s)), i.set(f + "", m)) : P(m, t);
			}
			if (u === void 0) (!d || c(e, n)?.writable) && (u = p(() => /* @__PURE__ */ N(void 0, s)), P(u, qt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => qt(r));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				Gt(o);
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
			ze();
		}
	});
}
var Jt, Yt, Xt, Zt;
function Qt() {
	if (Jt === void 0) {
		Jt = window, Yt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Xt = c(t, "firstChild").get, Zt = c(t, "nextSibling").get, p(e) && (e[pe] = void 0, e[fe] = null, e[me] = void 0, e.__e = void 0), p(n) && (n[he] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function $t(e) {
	return Xt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function en(e) {
	return Zt.call(e);
}
function I(e, t) {
	if (!w) return /* @__PURE__ */ $t(e);
	var n = /* @__PURE__ */ $t(T);
	if (n === null) n = T.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), E(r), r;
	}
	return t && on(n), E(n), n;
}
function tn(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ $t(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ en(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = F();
			return T?.before(r), E(r), r;
		}
		on(T);
	}
	return T;
}
function L(e, t = !1) {
	if (!w) return /* @__PURE__ */ $t(e);
	var n = I(e, t);
	return D(e), n;
}
function R(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ en(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		on(r);
	}
	return E(r), r;
}
function nn(e) {
	e.textContent = "";
}
function rn() {
	return !1;
}
function an(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function on(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function sn(e) {
	var t = W;
	if (t === null) return H.f |= se, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	cn(e, t);
}
function cn(e, t) {
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
function ln(e) {
	W === null && (H === null && Fe(e), Pe()), Nn && Ne(e);
}
function un(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function dn(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= x);
	var r = {
		ctx: O,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) Tt === null ? kt.ensure().schedule(r) : Tt.push(r);
	else if (t !== null) {
		try {
			Zn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= te));
	}
	if (i !== null && (i.parent = n, n !== null && un(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function fn() {
	return H !== null && !Fn;
}
function pn(e) {
	let t = dn(8, null);
	return k(t, v), t.teardown = e, t;
}
function mn(e) {
	ln("$effect");
	var t = W.f;
	if (!H && t & 32 && O !== null && !O.i) {
		var n = O;
		(n.e ??= []).push(e);
	} else return hn(e);
}
function hn(e) {
	return dn(4 | re, e);
}
function gn(e) {
	kt.ensure();
	let t = dn(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? En(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function _n(e) {
	return dn(4, e);
}
function vn(e) {
	return dn(oe | ne, e);
}
function yn(e, t = 0) {
	return dn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	st(r, t, n, (t) => {
		dn(8, () => {
			e(...t.map(J));
		});
	});
}
function bn(e, t = 0) {
	return dn(16 | t, e);
}
function B(e) {
	return dn(32 | ne, e);
}
function xn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Nn, r = H;
		Pn(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			cn(t, e.parent);
		} finally {
			Pn(n), U(r);
		}
	}
}
function Sn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function Cn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (wn(e.nodes.start, e.nodes.end), n = !0), e.f |= C, Sn(e, t && !n), Xn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	xn(e), e.f ^= C, e.f |= S;
	var i = e.parent;
	i !== null && i.first !== null && Tn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function wn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ en(e);
		e.remove(), e = n;
	}
}
function Tn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function En(e, t, n = !0) {
	var r = [];
	e.f |= 256, Dn(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Dn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= x;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Dn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function On(e) {
	e.f &= -257, kn(e, !0);
}
function kn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= x, e.f & 1024 || (k(e, y), kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			kn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function An(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ en(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var jn = null, Mn = !1, Nn = !1;
function Pn(e) {
	Nn = e;
}
var H = null, Fn = !1;
function U(e) {
	H = e;
}
var W = null;
function In(e) {
	W = e;
}
var Ln = null;
function Rn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (Ln ??= /* @__PURE__ */ new Set()).add(e);
}
var G = null, K = 0, q = null;
function zn(e) {
	q = e;
}
var Bn = 1, Vn = 0, Hn = Vn;
function Un(e) {
	Hn = e;
}
function Wn() {
	return ++Bn;
}
function Gn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Gn(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && k(e, v);
	}
	return !1;
}
function Kn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Ln !== null && Ln.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Kn(a, t, !1) : t === a && (n ? k(a, y) : a.f & 1024 && k(a, b), Nt(a));
	}
}
function qn(e) {
	var t = G, n = K, r = q, i = H, a = Ln, o = O, s = Fn, c = Hn, l = e.f;
	G = null, K = 0, q = null, H = l & 96 ? null : e, Ln = null, Ge(e.ctx), Fn = !1, Hn = ++Vn, e.ac !== null && (ot(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ae;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = Jn(e);
		if ($e() && q !== null && !Fn && f !== null && !(e.f & 6146)) for (var p = 0; p < q.length; p++) Kn(q[p], e);
		if (i !== null && i !== e) {
			if (Vn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Vn;
			if (t !== null) for (let e of t) e.rv = Vn;
			q !== null && (r === null ? r = q : r.push(...q));
		}
		return e.f & 8388608 && (e.f ^= se), d;
	} catch (t) {
		return Jn(e), sn(t);
	} finally {
		e.f ^= ae, G = t, K = n, q = r, H = i, Ln = a, Ge(o), Fn = s, Hn = c;
	}
}
function Jn(e) {
	var t = e.deps, n = j?.is_fork;
	if (G !== null) {
		var r;
		if (n || Xn(e, K), t !== null && K > 0) for (t.length = K + G.length, r = 0; r < G.length; r++) t[K + r] = G[r];
		else e.deps = t = G;
		if (fn() && e.f & 512) for (r = K; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && K < t.length && (Xn(e, K), t.length = K);
	return t;
}
function Yn(e, n) {
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
		c.f & 512 && (c.f ^= 512), c.v !== t && it(c), c.ac !== null && ot(() => {
			c.ac.abort(ge), c.ac = null, k(c, y);
		}), vt(c), Xn(c, 0);
	}
}
function Xn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Yn(e, n[r]);
}
function Zn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, v);
		var n = W, r = Mn;
		W = e, Mn = !(t & 96);
		try {
			t & 16777232 ? Cn(e) : Sn(e), xn(e);
			var i = qn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Bn;
		} finally {
			Mn = r, W = n;
		}
	}
}
function J(e) {
	var t = !!(e.f & 2);
	if (jn?.add(e), H !== null && !Fn && !(W !== null && W.f & 16384) && (Ln === null || !Ln.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Vn && (e.rv = Vn, G === null && n !== null && n[K] === e ? K++ : G === null ? G = [e] : G.push(e));
		else {
			H.deps ??= [], a.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : a.call(r, H) || r.push(H);
		}
	}
	if (Nn && Lt.has(e)) return Lt.get(e);
	if (t) {
		var i = e;
		if (Nn) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || $n(i)) && (o = gt(i)), Lt.set(i, o), o;
		}
		var s = !(i.f & 512) && !Fn && H !== null && (Mn || !!(H.f & 512)), c = (i.f & ee) === 0;
		Gn(i) && (s && (i.f |= 512), _t(i)), s && !c && (yt(i), Qn(i));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Qn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (yt(t), Qn(t));
}
function $n(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Lt.has(t) || t.f & 2 && $n(t)) return !0;
	return !1;
}
function er(e) {
	var t = Fn;
	try {
		return Fn = !0, e();
	} finally {
		Fn = t;
	}
}
function tr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ce in e) nr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ce in n && nr(n);
		}
	}
}
function nr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			nr(e[n], t);
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
var rr = Symbol("events"), ir = /* @__PURE__ */ new Set(), ar = /* @__PURE__ */ new Set();
function or(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || dr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, nt(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function sr(e, t, n, r = {}) {
	var i = or(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function cr(e, t, n) {
	(t[rr] ??= {})[e] = n;
}
function Y(e) {
	for (var t = 0; t < e.length; t++) ir.add(e[t]);
	for (var n of ar) n(e);
}
var lr = null, ur = !1;
function dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	lr = e, ur || (ur = !0, setTimeout(() => {
		ur = !1, lr = null;
	}));
	var o = 0, c = lr === e && e[rr];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[rr] = t;
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
		var d = H, f = W;
		U(null), In(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[rr]?.[r];
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
			e[rr] = t, delete e.currentTarget, U(d), In(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var fr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function pr(e) {
	return fr?.createHTML(e) ?? e;
}
function mr(e) {
	var t = an("template");
	return t.innerHTML = pr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function hr(e, t) {
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
		if (w) return hr(T, null), T;
		i === void 0 && (i = mr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ $t(i)));
		var t = r || Yt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ $t(t), s = t.lastChild;
			hr(o, s);
		} else hr(t, t);
		return t;
	};
}
function Z(e, t) {
	if (w) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Se();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var gr = ["touchstart", "touchmove"];
function _r(e) {
	return gr.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function vr(e) {
	let t = 0, n = zt(0), r;
	return () => {
		fn() && (J(n), yn(() => (t === 0 && (r = er(() => e(() => Gt(n)))), t += 1, () => {
			nt(() => {
				--t, t === 0 && (r?.(), r = void 0, Gt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var yr = te | ne;
function br(e, t, n, r) {
	new xr(e, t, n, r);
}
var xr = class {
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
	#h = vr(() => (this.#m = zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = bn(() => {
			if (w) {
				let e = this.#t;
				Se();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, yr), w && (this.#e = T);
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
		nt(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				be();
				return;
			}
			t = !0, n && Ve(), this.#s !== null && En(this.#s, () => {
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
					cn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), nt(() => {
			var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return B(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						cn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(j);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, En(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				An(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		at(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = H, r = O;
		In(this.#i), U(this.#i), Ge(this.#i.ctx);
		try {
			return kt.ensure(), e();
		} finally {
			In(t), U(n), Ge(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && En(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, nt(() => {
			this.#d = !1, this.#m && Ut(this.#m, this.#l);
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
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), w && (E(this.#t), Ce(), E(we()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return cn(e, this.#i.parent), null;
				}
			}));
		};
		nt(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				cn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => cn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function Q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[he] ??= e.nodeValue) && (e[he] = n, e.nodeValue = `${n}`);
}
function Sr(e, t) {
	return wr(e, t);
}
var Cr = /* @__PURE__ */ new Map();
function wr(t, { target: n, anchor: r, props: i = {}, events: a, context: s, intro: c = !0, transformError: l }) {
	Qt();
	var u = void 0, d = gn(() => {
		var c = r ?? n.appendChild(F());
		br(c, { pending: () => {} }, (n) => {
			Xe({});
			var r = O;
			if (s && (r.c = s), a && (i.$$events = a), w && hr(n, null), u = t(n, i) || Qe(), w && (W.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw ye(), e;
			Ze();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = _r(r);
					for (let e of [n, document]) {
						var a = Cr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Cr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(o(ir)), ar.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Cr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, dr), t.delete(e), t.size === 0 && Cr.delete(r)) : t.set(e, i);
			}
			ar.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return Tr.set(u, d), u;
}
var Tr = /* @__PURE__ */ new WeakMap();
function Er(e, t) {
	let n = Tr.get(e);
	return n ? (Tr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Dr = class {
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
			if (n) On(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (On(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						An(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), En(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = rn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = F();
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
		} else w && (this.anchor = T), this.#a(n);
	}
};
function Or(e) {
	O === null && ke("onMount"), mn(() => {
		let t = er(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function $(e, t, n = !1) {
	var r;
	w && (r = T, Se());
	var i = new Dr(e), a = n ? te : 0;
	function o(e, t) {
		if (w) {
			var n = Te(r);
			if (e !== parseInt(n.substring(1))) {
				var a = we();
				E(a), i.anchor = a, xe(!1), i.ensure(e, t), xe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	bn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function kr(e, t, n) {
	for (var r = [], i = t.length, a, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		En(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Ar(e, o(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			nn(d), d.append(u), e.items.clear();
		}
		Ar(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Ar(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ie, An(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var jr;
function Mr(e, t, n, i, a, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? E(/* @__PURE__ */ $t(u)) : u.appendChild(F());
	}
	w && Se();
	var d = null, f = /* @__PURE__ */ mt(() => {
		var e = n();
		return r(e) ? e : e == null ? [] : o(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Pr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ie, Ir(d, null, c)) : On(d) : En(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: bn(() => {
			p = J(f);
			var e = p.length;
			let r = !1;
			w && Te(c) === "[!" != (e === 0) && (c = we(), E(c), xe(!1), r = !0);
			for (var o = /* @__PURE__ */ new Set(), u = j, v = rn(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, r = !0, xe(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && Ut(S.v, b), S.i && Ut(S.i, y), v && u.unskip_effect(S.e)) : (S = Fr(l, h ? c : jr ??= F(), b, x, y, a, t, n), h || (S.e.f |= ie), l.set(x, S)), o.add(x);
			}
			if (e === 0 && s && !d && (h ? d = B(() => s(c)) : (d = B(() => s(jr ??= F())), d.f |= ie)), e > o.size && Me("", "", ""), w && e > 0 && E(we()), !h) {
				if (m.set(u, o), v) {
					for (let [e, t] of l) o.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			r && xe(!0), J(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function Nr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Pr(e, t, n, r, i) {
	var a = !!(r & 8), s = t.length, c = e.items, l = Nr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (On(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ie, _ === l) Ir(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Lr(e, d, _), Lr(e, _, y), Ir(_, y, n), d = _, p = [], m = [], l = Nr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ir(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Lr(e, S.prev, ee.next), Lr(e, d, S), Lr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Ir(_, l, n), Lr(e, _.prev, _.next), Lr(e, _, d === null ? e.effect.first : d.next), Lr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Nr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Nr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Ar(e, o(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = Nr(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && s === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			kr(e, C, ne);
		}
	}
	a && nt(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Fr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? zt(n) : /* @__PURE__ */ Bt(n, !1, !1) : null, l = o & 2 ? zt(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ir(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ en(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Lr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Rr(e, t, n) {
	var r;
	w && (r = T, Se());
	var i = new Dr(e);
	bn(() => {
		var e = t() ?? null;
		if (w && Te(r) === "[" != (e !== null)) {
			var a = we();
			E(a), i.anchor = a, xe(!1), i.ensure(e, e && ((t) => n(t, e))), xe(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, te);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function zr(e, t, n) {
	_n(() => {
		var r = er(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			yn(() => {
				var e = n();
				tr(e), i && De(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/attributes.js
var Br = [..." 	\n\r\f\xA0\v﻿"];
function Vr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Br.includes(r[o - 1])) && (s === r.length || Br.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Hr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ur(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Wr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ur)), i && c.push(...Object.keys(i).map(Ur));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ur(e.substring(l, u).trim());
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
		return r && (n += Hr(r)), i && (n += Hr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/class.js
function Gr(e, t, n, r, i, a) {
	var o = e[pe];
	if (w || o !== n || o === void 0) {
		var s = Vr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[pe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/style.js
function Kr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function qr(e, t, n, r) {
	var i = e[me];
	if (w || i !== t) {
		var a = Wr(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[me] = t;
	} else r && (Array.isArray(r) ? (Kr(e, n?.[0], r[0]), Kr(e, n?.[1], r[1], "important")) : Kr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Jr = Symbol("is custom element"), Yr = Symbol("is html"), Xr = _e ? "link" : "LINK";
function Zr(e, t, n, r) {
	var i = Qr(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Xr) || i[t] !== (i[t] = n) && (t === "loading" && (e[de] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ei(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Qr(e) {
	return e[fe] ??= {
		[Jr]: e.nodeName.includes("-"),
		[Yr]: e.namespaceURI === n
	};
}
var $r = /* @__PURE__ */ new Map();
function ei(e) {
	var t = e.getAttribute("is") || e.nodeName, n = $r.get(t);
	if (n) return n;
	$r.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = l(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = f(i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function ti(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), h;
	let r = er(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var ni = [];
function ri(e, t = h) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (De(e, t) && (e = t, n)) {
			let t = !ni.length;
			for (let t of r) t[1](), ni.push(t, e);
			if (t) {
				for (let e = 0; e < ni.length; e += 2) ni[e][0](ni[e + 1]);
				ni.length = 0;
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
function ii(e) {
	let t;
	return ti(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/store.js
var ai = !1;
function oi(e) {
	var t = ai;
	try {
		return ai = !1, [e(), ai];
	} finally {
		ai = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var si = {
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
		if (t === ce || t === ue) return !1;
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
function ci(...e) {
	return new Proxy({ props: e }, si);
}
function li(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, l = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ dt(r), J(u)) : (l && (l = !1, s = o ? er(r) : r), s);
	let f;
	if (a) {
		var p = ce in e || ue in e;
		f = c(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = oi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Le(t), f(m)));
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
	var v = !1, y = (n & 1 ? dt : mt)(() => (v = !1, g()));
	a && J(y);
	var b = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? J(y) : i && a ? qt(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Nn && v || b.f & 16384 ? y.v : J(y);
	});
}
//#endregion
//#region packages/core/src/algorithms/display-models.ts
function ui(e, t) {
	return e.endPeriod >= 1 && e.startPeriod <= t;
}
var di = [
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
})), fi = /\s+/g;
function pi(e) {
	return e.replace(/^【调】/, "").replace(/[★☆〇■◆]$/u, "").trim().replace(fi, " ");
}
var mi = {
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
}, hi = {
	schemaVersion: 1,
	themeMode: "auto",
	fontSizeScale: 1,
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
function gi(e) {
	let t = e.trim(), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
	if (!n) throw Error(`Invalid ISO date: ${e}`);
	let [, r, i, a] = n;
	return new Date(Date.UTC(Number(r), Number(i) - 1, Number(a), 12));
}
function _i(e) {
	return `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function vi(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function yi(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function bi(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function xi(e, t) {
	return bi(e, t * 7);
}
function Si(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function Ci(e, t) {
	return e.getTime() < t.getTime();
}
function wi(e) {
	return _i(yi(gi(e)));
}
function Ti(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var Ei = class {
	normalizeTermStartDate(e, t) {
		let n = gi(wi(t));
		if (!e || !e.trim()) return _i(yi(n));
		try {
			return _i(yi(gi(e)));
		} catch {
			return _i(yi(this.inferTermStartDateFromTermName(e) || n));
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
		}, r = gi(this.normalizeTermStartDate(n.termStartDate, e)), i = gi(e);
		if (Ci(i, r)) return n.startWeek;
		let a = Si(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return _i(xi(gi(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return _i(bi(gi(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
//#endregion
//#region packages/core/src/algorithms/holiday-calendar.ts
function Di(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e?.holidays?.length) return t;
	for (let n of e.holidays) t.set(n.date, n);
	return t;
}
//#endregion
//#region packages/core/src/algorithms/course-schedule.ts
function Oi(e) {
	try {
		return _i(gi(e)) === e;
	} catch {
		return !1;
	}
}
function ki(e, t) {
	if (t && (!Oi(t.startDateIso) || !Oi(t.endDateIso) || t.startDateIso > t.endDateIso)) throw RangeError("Expected an inclusive ISO date range");
	let n = e.academicConfig;
	if (!Oi(n.termStartDate) || !Number.isInteger(n.startWeek) || !Number.isInteger(n.endWeek) || n.startWeek < 1 || n.endWeek < n.startWeek) return [];
	let r = new Ei(), i = gi(r.resolveWeekStart(n, n.startWeek, n.termStartDate)), a = t ? Math.max(n.startWeek, n.startWeek + Si(i, gi(t.startDateIso))) : n.startWeek, o = t ? Math.min(n.endWeek, n.startWeek + Si(i, gi(t.endDateIso))) : n.endWeek, s = Di(n.holidayCalendar), c = e.courses.filter((e) => Number.isInteger(e.dayOfWeek) && e.dayOfWeek >= 1 && e.dayOfWeek <= 7 && Number.isInteger(e.startPeriod) && Number.isInteger(e.endPeriod) && e.startPeriod >= 1 && e.endPeriod >= e.startPeriod && ui(e, n.periodTimes.length)), l = [];
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
function Ai(e, t) {
	return ki(e, {
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
function ji(e) {
	let t = /^(\d{1,2}):(\d{2})$/.exec(e.trim());
	return t ? Number(t[1]) * 60 + Number(t[2]) : 0;
}
function Mi(e) {
	return e.map((e) => ({
		index: e.index,
		startMinutes: ji(e.startTime),
		endMinutes: ji(e.endTime)
	})).sort((e, t) => e.index - t.index);
}
function Ni(e) {
	return e.getHours() * 60 + e.getMinutes();
}
function Pi(e, t, n = "upcomingOrLast") {
	let r = null;
	for (let n of e) {
		if (t >= n.startMinutes && t <= n.endMinutes) return n.index;
		r == null && t < n.startMinutes && (r = n.index);
	}
	return n === "none" ? null : r ?? e.at(-1)?.index ?? null;
}
.2126 * Fi(15 / 255) + .7152 * Fi(23 / 255) + .0722 * Fi(42 / 255);
function Fi(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/types/services.ts
function Ii(e) {
	return { key: e };
}
var Li = Ii("storage"), Ri = Ii("analytics"), zi = Ii("hostNavigation"), Bi = Ii("coursePresentation");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function Vi(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/mountable.ts
var Hi = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
//#endregion
//#region packages/core/src/analytics/plugin-analytics.ts
function Ui(e, t) {
	return `plugin.${e}.${t}`;
}
function Wi(e, t, n, r) {
	let i = e.tryService(Ri);
	i && i.track(Ui(t, n), {
		...r,
		source: "plugin",
		plugin_id: t
	});
}
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function Gi(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Ki() {
	return "1.2.6";
}
function qi(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Gi(e.messages, e.nameKey),
		version: e.version ?? Ki(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Gi(e.messages, e.descriptionKey) : void 0,
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
function Ji(e) {
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
function Yi(e) {
	let t, n = vr((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return fn() ? (n(), t) : ii(e);
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
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/reactive-value.js
var Xi = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = vr(t);
	}
	get current() {
		return this.#t(), this.#e();
	}
}, Zi = /\(.+\)/, Qi = /* @__PURE__ */ new Set([
	"all",
	"print",
	"screen",
	"and",
	"or",
	"not",
	"only"
]), $i = class extends Xi {
	constructor(e, t) {
		let n = Zi.test(e) || e.split(/[\s,]+/).some((e) => Qi.has(e.trim())) ? e : `(${e})`, r = window.matchMedia(n);
		super(() => r.matches, (e) => sr(r, "change", e));
	}
};
//#endregion
//#region packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
vr((e) => {
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
}), Y([
	"click",
	"pointerdown",
	"pointerup"
]), Y(["change"]);
//#endregion
//#region packages/ui-kit/src/form/date-field-utils.ts
function ea(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
//#endregion
//#region packages/ui-kit/src/platform/native-bridge.ts
var ta = "__CHRONOS_NATIVE__";
function na() {
	if (typeof window > "u") return null;
	let e = window[ta];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/haptic/haptic.ts
var ra = mi.hapticFeedbackEnabled;
function ia() {
	return na();
}
function aa() {
	return typeof navigator < "u" && typeof navigator.vibrate == "function";
}
function oa() {
	return aa() ? typeof navigator < "u" && "userActivation" in navigator && navigator.userActivation != null ? navigator.userActivation.hasBeenActive : !0 : !1;
}
function sa() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !0;
		let e = localStorage.getItem(Ji(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(ra));
		return e !== "0" && e !== "false";
	} catch {
		return !0;
	}
}
function ca(e) {
	if (!oa()) return !1;
	try {
		return navigator.vibrate(e);
	} catch {
		return !1;
	}
}
function la(e, t) {
	if (!sa()) return !1;
	let n = ia();
	return n ? (n.callNative("haptic", e.method, e.params ?? {}).catch(() => {
		ca(t);
	}), !0) : ca(t);
}
var ua = {
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
}, da = {
	selection() {
		return la({ method: "selection" }, ua.selection);
	},
	light() {
		return la({
			method: "vibrate",
			params: { duration: ua.light }
		}, ua.light);
	},
	medium() {
		return la({
			method: "impact",
			params: { style: "medium" }
		}, ua.medium);
	},
	heavy() {
		return la({
			method: "impact",
			params: { style: "heavy" }
		}, ua.heavy);
	},
	success() {
		return la({
			method: "notification",
			params: { type: "success" }
		}, ua.success);
	},
	warning() {
		return la({
			method: "notification",
			params: { type: "warning" }
		}, ua.warning);
	},
	cancel() {
		if (oa()) try {
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
var fa = /* @__PURE__ */ X("<div aria-hidden=\"true\"></div>"), pa = /* @__PURE__ */ X("<button type=\"button\" role=\"tab\"> </button>"), ma = /* @__PURE__ */ X("<div role=\"tablist\"><!> <!></div>");
function ha(e, t) {
	Xe(t, !0);
	let n = li(t, "class", 3, ""), r = li(t, "animateThumb", 3, !0), i = /* @__PURE__ */ A(() => t.segments.findIndex((e) => e.value === t.value)), a = /* @__PURE__ */ A(() => t.segments.length), o = /* @__PURE__ */ A(() => J(i) < 0 ? 0 : J(i));
	function s(e) {
		e !== t.value && da.medium(), t.onValueChange(e);
	}
	function c(e, n) {
		if (J(a) <= 1 || e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		e.preventDefault();
		let r = (n + (e.key === "ArrowRight" ? 1 : -1) + J(a)) % J(a), i = t.segments[r]?.value;
		i && s(i);
	}
	var l = ma(), u = I(l), d = (e) => {
		var t = fa();
		let n;
		z(() => {
			Gr(t, 1, `ui-segmented-thumb ${r() ? "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]" : ""}`), n = qr(t, "", n, {
				left: `calc(0.375rem + ${J(o) ?? ""} * ((100% - 0.75rem) / ${J(a) ?? ""}))`,
				width: `calc((100% - 0.75rem) / ${J(a) ?? ""})`
			});
		}), Z(e, t);
	};
	$(u, (e) => {
		J(a) > 0 && J(i) >= 0 && e(d);
	}), Mr(R(u, 2), 19, () => t.segments, (e) => e.value, (e, n, r) => {
		var a = pa(), o = L(a, !0);
		z(() => {
			Zr(a, "aria-selected", t.value === J(n).value), Zr(a, "tabindex", t.value === J(n).value || J(i) < 0 && J(r) === 0 ? 0 : -1), Gr(a, 1, `ui-segmented-tab text-label-large relative z-10 flex-1 cursor-pointer rounded-control py-2 text-center transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 active:bg-on-surface/10 ${t.value === J(n).value ? "text-on-secondary-container" : "text-on-surface-variant hover:text-on-surface"}`), Q(o, J(n).label);
		}), cr("click", a, () => s(J(n).value)), cr("keydown", a, (e) => c(e, J(r))), Z(e, a);
	}), D(l), z(() => Gr(l, 1, `ui-segmented-track ${n() ?? ""}`)), Z(e, l), Ze();
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
Y(["click", "keydown"]), mi.reduceMotionEnabled, Y(["pointerdown"]), Y(["keydown", "click"]), Y(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ga, _a] = Ke();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Y(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var va = /* @__PURE__ */ X("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function ya(e, t) {
	Xe(t, !0);
	let n = /* @__PURE__ */ A(() => t.component), r = /* @__PURE__ */ A(() => Yi(t.propsStore).current);
	var i = va();
	Rr(I(i), () => J(n), (e, t) => {
		t(e, ci(() => J(r)));
	}), D(i), Z(e, i), Ze();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ba(e) {
	return {
		[Hi]: !0,
		mount(t, n, r) {
			let i = ri({ ...n }), a = Sr(ya, {
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
					Er(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function xa(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Vi(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Vi(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var Sa = 900, Ca = 24, wa = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function Ta(e) {
	return wa.has(e) ? !0 : e.startsWith("max-w-");
}
function Ea(e) {
	let t = [], n = [];
	for (let r of e) Ta(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function Da(e, t, n, r = Ca) {
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
function Oa(e, t) {
	if (!t.visible) {
		e.style.display = "none";
		return;
	}
	e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`;
}
function ka(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = Ea(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Oa(a, Da(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, Sa);
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
function Aa(e) {
	return ka(e);
}
//#endregion
//#region packages/plugins/today/src/messages.ts
var ja = {
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
}, Ma = "tool-today";
//#endregion
//#region packages/plugins/today/src/index.ts
function Na(e = {}) {
	let { screenComponent: t } = e;
	return qi({
		id: Ma,
		messages: ja,
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
				id: Ma,
				title: () => n("screen.title"),
				...t ? { component: t } : {}
			});
		}
	});
}
//#endregion
//#region packages/plugins/today/src/analytics.ts
var Pa = { preparingStatusShown: "preparing_status_shown" };
//#endregion
//#region packages/plugins/today/src/today-courses.ts
function Fa(e, t, n) {
	let r = e.find((e) => e.index === t), i = e.find((e) => e.index === n);
	return !r || !i ? null : {
		startTime: r.startTime,
		endTime: i.endTime
	};
}
function Ia(e, t) {
	return [...e].sort((e, n) => {
		let r = e.course.startPeriod - n.course.startPeriod;
		if (r !== 0) return r;
		let i = e.course.endPeriod - n.course.endPeriod;
		return i === 0 ? e.course.name.localeCompare(n.course.name, t) : i;
	});
}
function La(e, t, n) {
	let r = Mi(t).find((t) => t.index === e.startPeriod);
	return !r || n >= r.startMinutes ? null : r.startMinutes - n;
}
function Ra(e, t, n, r, i = 0) {
	let a = Mi(t), o = a.find((t) => t.index === e.startPeriod), s = a.find((t) => t.index === e.endPeriod);
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
function za(e, t, n, r) {
	return Ia(e, r).map((e) => ({
		hit: e,
		timeRange: Fa(e.periodTimes, e.course.startPeriod, e.course.endPeriod),
		status: Ra(e.course, e.periodTimes, t, Pi(Mi(e.periodTimes), t), n),
		minutesUntilStart: La(e.course, e.periodTimes, t)
	}));
}
async function Ba(e, t) {
	let { todayIso: n, scope: r, timetable: i } = t;
	if (!i) return [];
	let a = (e) => Ai(e, n).map((t) => ({
		...t,
		periodTimes: e.academicConfig.periodTimes
	}));
	if (r === "active") return a(i);
	let o = await e.listTimetables();
	return (await Promise.all(o.map((t) => e.getTimetable(t.id)))).flatMap((e) => e ? a(e) : []);
}
//#endregion
//#region packages/plugins/today/src/today-screen.svelte.ts
function Va(e, t) {
	return `${e}\0${pi(t)}`;
}
function Ha() {
	let e, t = "", n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N("active"), i = /* @__PURE__ */ N([]), a = /* @__PURE__ */ N(/* @__PURE__ */ new Map()), o = [], s = !1, c, l, u = 0, d = 0, f = "", p, m = !1, h = !1, g;
	function _() {
		return J(n)?.now ?? /* @__PURE__ */ new Date();
	}
	function v() {
		return J(n)?.todayIso || Ti();
	}
	function y() {
		return J(n)?.userPreferences?.prepareReminderMinutes ?? hi.prepareReminderMinutes;
	}
	function b() {
		P(i, za(o, Ni(_()), y(), ea(J(n)?.locale)));
	}
	async function x() {
		let n = ++d, r = (e?.getPluginContext(t))?.tryService(Bi), o = J(i);
		try {
			let e = /* @__PURE__ */ new Map();
			r && await Promise.all([...new Set(o.map((e) => e.hit.timetableId))].map(async (t) => {
				let n = await r.resolveCoursePaintsForTimetable(t);
				for (let [r, i] of n) e.set(Va(t, r), i);
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
			let n = await Ba(e.getPluginContext(t).service(Li), {
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
		J(r) !== n && da.medium(), P(r, n, !0);
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
var Ua = /* @__PURE__ */ X("<p class=\"text-label-large shrink-0 text-on-surface-variant\"> </p>"), Wa = /* @__PURE__ */ X("<div class=\"mt-1 flex items-center justify-between gap-3\"><p class=\"text-body-medium text-on-surface-variant\"> </p> <!></div>"), Ga = /* @__PURE__ */ X("<p class=\"text-title-large leading-tight text-on-surface\"> </p> <!> <!>", 1), Ka = /* @__PURE__ */ X("<header class=\"ui-safe-area-top--comfortable relative z-10 shrink-0 border-b border-outline/10 bg-surface/90 px-4 pb-4 backdrop-blur-sm\"><!></header>"), qa = /* @__PURE__ */ X("<section class=\"ui-section-surface ui-section-surface--comfortable\"><!></section>"), Ja = /* @__PURE__ */ X("<section class=\"ui-section-surface ui-section-surface--comfortable flex flex-1 flex-col items-center justify-center py-16 text-center\"><div class=\"mb-4 flex size-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" class=\"size-8 fill-current\"><path d=\"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z\"></path></svg></div> <p class=\"text-title-medium text-on-surface\"> </p></section>"), Ya = /* @__PURE__ */ X("<section class=\"ui-section-surface ui-section-surface--comfortable flex flex-1 flex-col items-center justify-center py-16 text-center\"><div class=\"mb-4 flex size-16 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" class=\"size-8 fill-current\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\"></path></svg></div> <p class=\"text-title-medium text-on-surface\"> </p></section>"), Xa = /* @__PURE__ */ X("<p class=\"text-label-medium text-on-surface tabular-nums\"> </p>"), Za = /* @__PURE__ */ X("<span class=\"text-label-small shrink-0 rounded-full bg-primary px-2 py-0.5 text-on-primary\"> </span>"), Qa = /* @__PURE__ */ X("<span class=\"text-label-small shrink-0 rounded-full bg-secondary-container px-2 py-0.5 text-on-secondary-container\"> </span>"), $a = /* @__PURE__ */ X("<p> </p>"), eo = /* @__PURE__ */ X("<div class=\"text-body-small mt-1 flex flex-col gap-1 text-on-surface-variant\"><!> <!> <!></div>"), to = /* @__PURE__ */ X("<div class=\"flex w-11 shrink-0 flex-col items-center self-stretch\"><!> <div class=\"flex min-h-0 w-full flex-1 flex-col items-center justify-center\"><p class=\"text-headline-small w-full min-w-0 text-center font-bold break-all whitespace-normal text-on-surface-variant\"> </p></div> <!></div> <div class=\"w-1 shrink-0 self-stretch rounded-full\" aria-hidden=\"true\"></div> <div class=\"min-w-0 flex-1\"><div class=\"flex items-start justify-between gap-2\"><p class=\"text-title-medium truncate text-on-surface\"> </p> <!></div> <!></div>", 1), no = /* @__PURE__ */ X("<button type=\"button\"><!></button>"), ro = /* @__PURE__ */ X("<div><!></div>"), io = /* @__PURE__ */ X("<li><!></li>"), ao = /* @__PURE__ */ X("<section class=\"ui-section-surface overflow-hidden\"><ul class=\"divide-y divide-outline/10\"></ul></section>"), oo = /* @__PURE__ */ X("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><!> <div class=\"secondary-scroll relative z-0 min-h-0 flex-1 overflow-y-auto\"><div class=\"flex flex-col gap-4 p-4\"><!> <!></div></div></div>");
function so(e, t) {
	Xe(t, !0);
	let n = (e) => {
		var t = Ga(), n = tn(t), i = L(n, !0), a = R(n, 2), o = (e) => {
			var t = Wa(), n = I(t), r = L(n, !0), i = R(n, 2), a = (e) => {
				var t = Ua(), n = L(t, !0);
				z((e) => Q(n, e), [() => p("screen.summary.count", { count: s.courseEntries.length })]), Z(e, t);
			};
			$(i, (e) => {
				s.courseEntries.length > 0 && e(a);
			}), D(t), z((e) => Q(r, e), [() => p("screen.week", { week: J(d) })]), Z(e, t);
		};
		$(a, (e) => {
			J(l) && e(o);
		}), ha(R(a, 2), {
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
		}), z((e) => Q(i, e), [() => m(J(u))]), Z(e, t);
	}, r = li(t, "active", 3, !0), i = /* @__PURE__ */ A(() => Yi(t.controller.snapshot)), a = new $i("(orientation: landscape) and (max-height: 500px)"), o = new Ei(), s = Ha(), c = !1, l = /* @__PURE__ */ A(() => J(i).current.currentTimetable), u = /* @__PURE__ */ A(() => J(i).current.todayIso || s.today), d = /* @__PURE__ */ A(() => J(l) ? o.calculateAcademicWeek(J(u), J(l).academicConfig) : 1), f = /* @__PURE__ */ A(() => [{
		value: "active",
		label: p("screen.scope.active")
	}, {
		value: "all",
		label: p("screen.scope.all")
	}]);
	function p(e, n) {
		return J(i).current.slotVersion, J(i).current.coursePaletteRevision, xa(t.controller, Ma, ja, e, n);
	}
	function m(e) {
		let t = (/* @__PURE__ */ new Date(`${e}T12:00:00`)).toLocaleDateString(ea(J(i).current.locale), { weekday: "short" });
		return `${vi(e)} ${t}`;
	}
	function h(e) {
		let t = Va(e.timetableId, e.course.name);
		return s.paintByCourseKey.get(t) ?? di[0];
	}
	let g = /* @__PURE__ */ A(() => {
		try {
			return t.controller.getPluginContext(t.pluginId).tryService(zi);
		} catch {
			return;
		}
	});
	function _(e) {
		J(g)?.openCourseEditor(e);
	}
	mn(() => {
		r() && !c && s.courseEntries.some((e) => e.status === "preparing") && (c = !0, Wi(t.controller.getPluginContext(t.pluginId), Ma, Pa.preparingStatusShown));
	}), Or(() => (s.init(t.controller, t.pluginId), () => s.dispose()));
	var v = oo(), y = I(v), b = (e) => {
		var t = Ka(), r = I(t);
		n(r), D(t), Z(e, t);
	};
	$(y, (e) => {
		a.current || e(b);
	});
	var x = R(y, 2), S = I(x), ee = I(S), C = (e) => {
		var t = qa(), r = I(t);
		n(r), D(t), Z(e, t);
	};
	$(ee, (e) => {
		a.current && e(C);
	});
	var te = R(ee, 2), ne = (e) => {
		var t = Ja(), n = L(R(I(t), 2), !0);
		D(t), z((e) => Q(n, e), [() => p("screen.empty.noTimetable")]), Z(e, t);
	}, re = (e) => {
		var t = Ya(), n = L(R(I(t), 2), !0);
		D(t), z((e) => Q(n, e), [() => p("screen.empty.noCourses")]), Z(e, t);
	}, ie = (e) => {
		var t = ao(), n = I(t);
		Mr(n, 21, () => s.courseEntries, (e) => `${e.hit.timetableId}-${e.hit.course.id}`, (e, t) => {
			var n = io();
			{
				let e = (e) => {
					var n = to(), r = tn(n), i = I(r), a = (e) => {
						var t = Xa(), n = L(t, !0);
						z(() => Q(n, J(c).startTime)), Z(e, t);
					};
					$(i, (e) => {
						J(c) && e(a);
					});
					var u = R(i, 2), d = L(I(u), !0);
					D(u);
					var f = R(u, 2), m = (e) => {
						var t = Xa(), n = L(t, !0);
						z(() => Q(n, J(c).endTime)), Z(e, t);
					};
					$(f, (e) => {
						J(c) && e(m);
					}), D(r);
					var h = R(r, 2);
					let g;
					var _ = R(h, 2), v = I(_), y = I(v), b = L(y, !0), x = R(y, 2), S = (e) => {
						var t = Za(), n = L(t, !0);
						z((e) => Q(n, e), [() => p("screen.status.current")]), Z(e, t);
					}, ee = (e) => {
						var t = Qa(), n = L(t, !0);
						z((e) => Q(n, e), [() => p("screen.status.preparing")]), Z(e, t);
					};
					$(x, (e) => {
						J(t).status === "current" ? e(S) : J(t).status === "preparing" && e(ee, 1);
					}), D(v);
					var C = R(v, 2), te = (e) => {
						var n = eo(), r = I(n), i = (e) => {
							var n = $a(), r = L(n, !0);
							z((e) => Q(r, e), [() => p("screen.course.timetable", { name: J(t).hit.timetableName })]), Z(e, n);
						};
						$(r, (e) => {
							s.scope === "all" && J(t).hit.timetableName && e(i);
						});
						var a = R(r, 2), o = (e) => {
							var n = $a(), r = L(n, !0);
							z(() => Q(r, J(t).hit.course.location)), Z(e, n);
						};
						$(a, (e) => {
							J(t).hit.course.location && e(o);
						});
						var c = R(a, 2), l = (e) => {
							var n = $a(), r = L(n, !0);
							z(() => Q(r, J(t).hit.course.teacher)), Z(e, n);
						};
						$(c, (e) => {
							J(t).hit.course.teacher && e(l);
						}), D(n), Z(e, n);
					};
					$(C, (e) => {
						(s.scope === "all" && J(t).hit.timetableName || J(t).hit.course.location || J(t).hit.course.teacher) && e(te);
					}), D(_), z(() => {
						Q(d, J(l)), g = qr(h, "", g, { "background-color": J(o).background }), Q(b, J(t).hit.course.name);
					}), Z(e, n);
				}, o = /* @__PURE__ */ A(() => h(J(t).hit)), c = /* @__PURE__ */ A(() => J(t).timeRange), l = /* @__PURE__ */ A(() => J(t).hit.course.startPeriod === J(t).hit.course.endPeriod ? p("screen.course.periodSingle", { n: J(t).hit.course.startPeriod }) : p("screen.course.periodRange", {
					start: J(t).hit.course.startPeriod,
					end: J(t).hit.course.endPeriod
				}));
				var r = I(n), i = (n) => {
					var r = no(), i = I(r);
					e(i), D(r), z(() => Gr(r, 1, `flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-container-low ${J(t).status === "past" ? "opacity-60" : ""}`)), cr("click", r, () => _(J(t).hit.course.id)), Z(n, r);
				}, a = (n) => {
					var r = ro(), i = I(r);
					e(i), D(r), z(() => Gr(r, 1, `flex gap-3 px-4 py-4 ${J(t).status === "past" ? "opacity-60" : ""}`)), Z(n, r);
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
	}), D(S), D(x), zr(x, (e) => Aa?.(e)), D(v), Z(e, v), Ze();
}
Y(["click"]);
//#endregion
//#region packages/plugins/today/bundle/entry.ts
var co = Na({ screenComponent: ba(so) });
//#endregion
export { co as default };
