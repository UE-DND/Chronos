// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = "http://www.w3.org/1999/xhtml", r = Array.isArray, i = Array.prototype.indexOf, a = Array.prototype.includes, o = Array.from, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.getOwnPropertyDescriptors, u = Object.prototype, d = Array.prototype, f = Object.getPrototypeOf, p = Object.isExtensible;
function m(e) {
	return typeof e == "function";
}
var h = () => {};
function ee(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function te() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var g = 1024, _ = 2048, v = 4096, ne = 8192, re = 16384, y = 32768, ie = 1 << 25, ae = 65536, oe = 1 << 19, se = 1 << 20, ce = 1 << 21, le = 1 << 22, ue = 1 << 23, de = Symbol("$state"), fe = Symbol("component"), pe = Symbol("legacy props"), me = Symbol(""), he = Symbol("attributes"), ge = Symbol("class"), _e = Symbol("style"), ve = Symbol("text"), ye = new class extends Error {
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
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/hydration.js
var b = !1;
function we(e) {
	b = e;
}
var x;
function S(t) {
	if (t === null) throw Se(), e;
	return x = t;
}
function Te() {
	return S(/* @__PURE__ */ I(x));
}
function C(t) {
	if (b) {
		if (/* @__PURE__ */ I(x) !== null) throw Se(), e;
		x = t;
	}
}
function Ee(e = 1) {
	if (b) {
		for (var t = e, n = x; t--;) n = /* @__PURE__ */ I(n);
		x = n;
	}
}
function De(e = !0) {
	for (var t = 0, n = x;;) {
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
function Oe(t) {
	if (!t || t.nodeType !== 8) throw Se(), e;
	return t.data;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/equality.js
function ke(e) {
	return e === this.v;
}
function Ae(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function je(e) {
	return !Ae(e, this.v);
}
function Me(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Ne() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/errors.js
function Pe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ie() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Le() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Re() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ze() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/shared/context.js
function Be(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Ne(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Ve(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function He(e, t) {
	return e === null && Me(t), e.c ??= new Map(Ve(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/context.js
var w = null;
function Ue(e) {
	w = e;
}
function We() {
	return Be(Ge, Ke, qe);
}
function Ge(e) {
	return He(w, "getContext").get(e);
}
function Ke(e, t) {
	return He(w, "setContext").set(e, t), t;
}
function qe(e) {
	return He(w, "hasContext").has(e);
}
function Je(e, t = !1, n) {
	w = {
		p: w,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: K,
		l: null
	};
}
function Ye(e) {
	var t = w, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) nn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, w = t.p, Xe(e);
}
function Xe(e = {}) {
	return s(e, fe, { value: !0 }), e;
}
function Ze() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/task.js
var Qe = [];
function $e() {
	var e = Qe;
	Qe = [], ee(e);
}
function T(e) {
	if (Qe.length === 0 && !bt) {
		var t = Qe;
		queueMicrotask(() => {
			t === Qe && $e();
		});
	}
	Qe.push(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/status.js
var et = ~(_ | v | g);
function E(e, t) {
	e.f = e.f & et | t;
}
function tt(e) {
	e.f & 512 || e.deps === null ? E(e, g) : E(e, v);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/utils.js
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), E(e, g);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function rt(e) {
	var t = U, n = K;
	G(null), q(null);
	try {
		return e();
	} finally {
		G(t), q(n);
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/async.js
function it(e, t, n, r) {
	let i = Ze() ? ct : dt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = K, c = at(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				z(e, s);
			}
			ot();
		}
	}
	var d = st();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ut(e))).then(u).catch((e) => z(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), ot());
	}) : f();
}
function at() {
	var e = K, t = U, n = w, r = O;
	return function(i = !0) {
		q(e), G(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ot(e = !0) {
	q(null), G(null), Ue(null), e && O?.deactivate();
}
function st() {
	var e = K, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ct(e) {
	var n = 2 | _;
	return K !== null && (K.f |= oe), {
		ctx: w,
		deps: null,
		effects: null,
		equals: ke,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: K,
		ac: null
	};
}
var lt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ut(e, n, r) {
	let i = K;
	i === null && Pe();
	var a = void 0, o = Pt(t), s = !U, c = /* @__PURE__ */ new Set();
	return on(() => {
		var t = K, n = te();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(ot);
		} catch (e) {
			n.reject(e), ot();
		}
		var r = O;
		if (s) {
			if (t.f & 32768) var l = st();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(lt);
			else for (let e of c.values()) e.reject(lt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== lt && (r.activate(), t ? (o.f |= ue, It(o, t)) : (o.f & 8388608 && (o.f ^= ue), It(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), tn(() => {
		for (let e of c) e.reject(lt);
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
function D(e) {
	let t = /* @__PURE__ */ ct(e);
	return Cn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	let t = /* @__PURE__ */ ct(e);
	return t.equals = je, t;
}
function ft(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) H(t[n]);
	}
}
function pt(e) {
	var n, r = K, i = e.parent;
	if (!xn && i !== null && e.v !== t && i.f & 24576) return xe(), e.v;
	q(i);
	try {
		ft(e), n = Mn(e);
	} finally {
		q(r);
	}
	return n;
}
function mt(e) {
	var t = pt(e);
	!e.equals(t) && (e.wv = kn(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), vt?.capture(e, t, !0)), e.deps === null)) ? E(e, g) : xn || (k === null ? tt(e) : (en() || O?.is_fork) && k.set(e, t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = h), Fn(t, 0), dn(t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && In(t);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/batch.js
var _t = null, O = null, vt = null, k = null, yt = null, bt = !1, xt = !1, St = null, Ct = null, wt = 0, Tt = 1, Et = class e {
	id = Tt++;
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
		_t === null ? _t = this : (_t.#n = this, this.#t = _t), _t = this;
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
			for (var r of n.d) E(r, _), t(r);
			for (r of n.m) E(r, v), t(r);
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
					t.f ^= g;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), E(e, _), this.schedule(e);
		for (let e of this.#d) E(e, v), this.schedule(e);
		this.apply();
		for (var t = St = [], n = [], r = Ct = []; this.#c.length > 0;) {
			wt++ > 1e3 && (this.#S(), Dt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw jt(e), this.#h() || this.discard(), t;
			}
		}
		if (O = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (St = null, Ct = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) At(e, t);
			r.length > 0 && O.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), vt = this, Ot(n), Ot(t), vt = null, this.#s?.resolve();
			var o = O;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (j.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : An(r) && (i & 16 && this.#d.add(r), In(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), E(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), O = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), k?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		O = this;
	}
	deactivate() {
		O = null, k = null;
	}
	flush() {
		try {
			xt = !0, O = this, this.#_();
		} finally {
			wt = 0, yt = null, St = null, Ct = null, xt = !1, O = null, k = null, j.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(lt);
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
		return (this.#s ??= te()).promise;
	}
	static ensure() {
		if (O === null) {
			let t = O = new e();
			!xt && T(() => {
				t.#e || t.flush();
			});
		}
		return O;
	}
	apply() {
		k = null;
	}
	schedule(e) {
		yt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? _t = e : t.#t = e, this.linked = !1;
		}
	}
};
function Dt() {
	try {
		Fe();
	} catch (e) {
		z(e, yt);
	}
}
var A = null;
function Ot(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && An(r) && (A = /* @__PURE__ */ new Set(), In(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && mn(r), A?.size > 0)) {
				j.clear();
				for (let e of A) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) A.has(n) && (A.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || In(n);
					}
				}
				A.clear();
			}
		}
		A = null;
	}
}
function kt(e) {
	O.schedule(e);
}
function At(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), E(e, g);
		for (var n = e.first; n !== null;) At(n, t), n = n.next;
	}
}
function jt(e) {
	E(e, g);
	for (var t = e.first; t !== null;) jt(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/sources.js
var Mt = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Map(), Nt = !1;
function Pt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ke,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Pt(e, t);
	return Cn(n), n;
}
function N(e, t, n = !1) {
	return U !== null && (!W || U.f & 131072) && Ze() && U.f & 4325394 && (J === null || !J.has(e)) && Re(), It(e, n ? Bt(t) : t, Ct);
}
var P = null, Ft = 0;
function It(e, t, n = null) {
	if (!e.equals(t)) {
		xn ? j.set(e, t) : j.has(e) || j.set(e, e.v);
		var r = Et.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && pt(t), k === null && tt(t);
		}
		e.wv = kn(), P = null, Ft = 0, zt(e, _, n), P = null, Ze() && K !== null && K.f & 1024 && !(K.f & 96) && (Z === null ? wn([e]) : Z.push(e)), !r.is_fork && Mt.size > 0 && !Nt && Lt();
	}
	return t;
}
function Lt() {
	Nt = !1;
	for (let e of Mt) {
		e.f & 1024 && E(e, v);
		let t;
		try {
			t = An(e);
		} catch {
			t = !0;
		}
		t && In(e);
	}
	Mt.clear();
}
function Rt(e) {
	N(e, e.v + 1);
}
function zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ze(), a = r.length;
		if (Ft += a, Ft > 1e5 && P === null && (P = /* @__PURE__ */ new Set()), P !== null) {
			if (P.has(e)) return;
			P.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== K) {
				var l = (c & _) === 0;
				if (l && E(s, t), c & 131072) Mt.add(s);
				else if (c & 2) {
					var u = s;
					k?.delete(u), zt(u, v, n);
				} else if (l) {
					var d = s;
					c & 16 && A !== null && A.add(d), n === null ? kt(d) : n.push(d);
				}
			}
		}
	}
}
function Bt(e) {
	if (typeof e != "object" || !e || de in e || fe in e) return e;
	let n = f(e);
	if (n !== u && n !== d) return e;
	var i = /* @__PURE__ */ new Map(), a = r(e), o = /* @__PURE__ */ M(0), s = null, l = Dn, p = (e) => {
		if (Dn === l) return e();
		var t = U, n = Dn;
		G(null), On(l);
		var r = e();
		return G(t), On(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ M(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ie();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ M(n.value, s);
				return i.set(t, e), e;
			}) : N(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ M(t, s));
					i.set(n, e), Rt(o);
				}
			} else N(r, t), Rt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === de) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ M(Bt(l ? n[r] : t), s)), i.set(r, o)), o !== void 0) {
				var u = Q(o);
				return u === t ? void 0 : u;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var r = Reflect.getOwnPropertyDescriptor(e, n), a = i.get(n);
			if (a !== void 0) {
				var o = Q(a);
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
			if (n === de) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || K !== null && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ M(a ? Bt(e[n]) : t, s)), i.set(n, r)), Q(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ M(t, s)), i.set(f + "", m)) : N(m, t);
			}
			if (u === void 0) (!d || c(e, n)?.writable) && (u = p(() => /* @__PURE__ */ M(void 0, s)), N(u, Bt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Bt(r));
				N(u, h);
			}
			var ee = Reflect.getOwnPropertyDescriptor(e, n);
			if (ee?.set && ee.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var te = i.get("length"), g = Number(n);
					Number.isInteger(g) && g >= te.v && N(te, g + 1);
				}
				Rt(o);
			}
			return !0;
		},
		ownKeys(e) {
			Q(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			Le();
		}
	});
}
var Vt, Ht, Ut, Wt;
function Gt() {
	if (Vt === void 0) {
		Vt = window, Ht = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Ut = c(t, "firstChild").get, Wt = c(t, "nextSibling").get, p(e) && (e[ge] = void 0, e[he] = null, e[_e] = void 0, e.__e = void 0), p(n) && (n[ve] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Kt(e) {
	return Ut.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function I(e) {
	return Wt.call(e);
}
function L(e, t) {
	if (!b) return /* @__PURE__ */ Kt(e);
	var n = /* @__PURE__ */ Kt(x);
	if (n === null) n = x.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), S(r), r;
	}
	return t && Zt(n), S(n), n;
}
function qt(e, t = !1) {
	if (!b) {
		var n = /* @__PURE__ */ Kt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ I(n) : n;
	}
	if (t) {
		if (x?.nodeType !== 3) {
			var r = F();
			return x?.before(r), S(r), r;
		}
		Zt(x);
	}
	return x;
}
function R(e, t = !1) {
	if (!b) return /* @__PURE__ */ Kt(e);
	var n = L(e, t);
	return C(e), n;
}
function Jt(e, t = 1, n = !1) {
	let r = b ? x : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ I(r);
	if (!b) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), S(a), a;
		}
		Zt(r);
	}
	return S(r), r;
}
function Yt() {
	return !1;
}
function Xt(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Zt(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Qt(e) {
	var t = K;
	if (t === null) return U.f |= ue, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	z(e, t);
}
function z(t, n) {
	if (t === e) throw t;
	if (!(n !== null && n.f & 16384)) {
		for (; n !== null;) {
			if (n.f & 128 && !(n.f & 33570816)) {
				if (!(n.f & 32768)) throw t;
				try {
					n.b.error(t);
					return;
				} catch (e) {
					t = e;
				}
			}
			n = n.parent;
		}
		throw t;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/effects.js
function $t(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function B(e, t) {
	var n = K;
	n !== null && n.f & 8192 && (e |= ne);
	var r = {
		ctx: w,
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
	O?.register_created_effect(r);
	var i = r;
	if (e & 4) St === null ? Et.ensure().schedule(r) : St.push(r);
	else if (t !== null) {
		try {
			In(r);
		} catch (e) {
			throw H(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && $t(i, n), U !== null && U.f & 2 && !(e & 64))) {
		var a = U;
		(a.effects ??= []).push(i);
	}
	return r;
}
function en() {
	return U !== null && !W;
}
function tn(e) {
	let t = B(8, null);
	return E(t, g), t.teardown = e, t;
}
function nn(e) {
	return B(4 | se, e);
}
function rn(e) {
	Et.ensure();
	let t = B(64 | oe, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? hn(t, () => {
			H(t), n(void 0);
		}) : (H(t), n(void 0));
	});
}
function an(e) {
	return B(4, e);
}
function on(e) {
	return B(le | oe, e);
}
function sn(e, t = 0) {
	return B(8 | t, e);
}
function cn(e, t = [], n = [], r = []) {
	it(r, t, n, (t) => {
		B(8, () => {
			e(...t.map(Q));
		});
	});
}
function ln(e, t = 0) {
	return B(16 | t, e);
}
function V(e) {
	return B(32 | oe, e);
}
function un(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = xn, r = U;
		Sn(!0), G(null);
		try {
			t.call(null);
		} catch (t) {
			z(t, e.parent);
		} finally {
			Sn(n), G(r);
		}
	}
}
function dn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && rt(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : H(n, t), n = r;
	}
}
function fn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || H(t), t = n;
	}
}
function H(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (pn(e.nodes.start, e.nodes.end), n = !0), e.f |= ie, dn(e, t && !n), Fn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	un(e), e.f ^= ie, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function pn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ I(e);
		e.remove(), e = n;
	}
}
function mn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function hn(e, t, n = !0) {
	var r = [];
	e.f |= 256, gn(e, r, !0);
	var i = () => {
		n && H(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function gn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				gn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function _n(e) {
	e.f &= -257, vn(e, !0);
}
function vn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (E(e, _), Et.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			vn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function yn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ I(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/legacy.js
var bn = null, xn = !1;
function Sn(e) {
	xn = e;
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
function Cn(e) {
	U !== null && (U.f & 2097152 || U.f & 2) && (J ??= /* @__PURE__ */ new Set()).add(e);
}
var Y = null, X = 0, Z = null;
function wn(e) {
	Z = e;
}
var Tn = 1, En = 0, Dn = En;
function On(e) {
	Dn = e;
}
function kn() {
	return ++Tn;
}
function An(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (An(a) && mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && E(e, g);
	}
	return !1;
}
function jn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(J !== null && J.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? jn(a, t, !1) : t === a && (n ? E(a, _) : a.f & 1024 && E(a, v), kt(a));
	}
}
function Mn(e) {
	var t = Y, n = X, r = Z, i = U, a = J, o = w, s = W, c = Dn, l = e.f;
	Y = null, X = 0, Z = null, U = l & 96 ? null : e, J = null, Ue(e.ctx), W = !1, Dn = ++En, e.ac !== null && (rt(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= ce;
		var u = e.fn, d = u();
		e.f |= y;
		var f = Nn(e);
		if (Ze() && Z !== null && !W && f !== null && !(e.f & 6146)) for (var p = 0; p < Z.length; p++) jn(Z[p], e);
		if (i !== null && i !== e) {
			if (En++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = En;
			if (t !== null) for (let e of t) e.rv = En;
			Z !== null && (r === null ? r = Z : r.push(...Z));
		}
		return e.f & 8388608 && (e.f ^= ue), d;
	} catch (t) {
		return Nn(e), Qt(t);
	} finally {
		e.f ^= ce, Y = t, X = n, Z = r, U = i, J = a, Ue(o), W = s, Dn = c;
	}
}
function Nn(e) {
	var t = e.deps, n = O?.is_fork;
	if (Y !== null) {
		var r;
		if (n || Fn(e, X), t !== null && X > 0) for (t.length = X + Y.length, r = 0; r < Y.length; r++) t[X + r] = Y[r];
		else e.deps = t = Y;
		if (en() && e.f & 512) for (r = X; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && X < t.length && (Fn(e, X), t.length = X);
	return t;
}
function Pn(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var o = i.call(r, e);
		if (o !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[o] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (Y === null || !a.call(Y, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && tt(c), c.ac !== null && rt(() => {
			c.ac.abort(ye), c.ac = null, E(c, _);
		}), ht(c), Fn(c, 0);
	}
}
function Fn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Pn(e, n[r]);
}
function In(e) {
	var t = e.f;
	if (!(t & 16384)) {
		E(e, g);
		var n = K;
		K = e;
		try {
			t & 16777232 ? fn(e) : dn(e), un(e);
			var r = Mn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Tn;
		} finally {
			K = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if (bn?.add(e), U !== null && !W && !(K !== null && K.f & 16384) && (J === null || !J.has(e))) {
		var n = U.deps;
		if (U.f & 2097152) e.rv < En && (e.rv = En, Y === null && n !== null && n[X] === e ? X++ : Y === null ? Y = [e] : Y.push(e));
		else {
			U.deps ??= [], a.call(U.deps, e) || U.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [U] : a.call(r, U) || r.push(U);
		}
	}
	if (xn && j.has(e)) return j.get(e);
	if (t) {
		var i = e;
		if (xn) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Rn(i)) && (o = pt(i)), j.set(i, o), o;
		}
		var s = !(i.f & 512) && !W && U !== null && !!(U.f & 512), c = (i.f & y) === 0;
		An(i) && (s && (i.f |= 512), mt(i)), s && !c && (gt(i), Ln(i));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Ln(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : a.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (gt(n), Ln(n));
	}
}
function Rn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (j.has(t) || t.f & 2 && Rn(t)) return !0;
	return !1;
}
function zn(e) {
	var t = W;
	try {
		return W = !0, e();
	} finally {
		W = t;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/events.js
var Bn = Symbol("events"), Vn = /* @__PURE__ */ new Set(), Hn = /* @__PURE__ */ new Set();
function Un(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Jn.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, T(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Wn(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Un(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && tn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Gn(e, t, n) {
	(t[Bn] ??= {})[e] = n;
}
function $(e) {
	for (var t = 0; t < e.length; t++) Vn.add(e[t]);
	for (var n of Hn) n(e);
}
var Kn = null, qn = !1;
function Jn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Kn = e, qn || (qn = !0, setTimeout(() => {
		qn = !1, Kn = null;
	}));
	var o = 0, c = Kn === e && e[Bn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Bn] = t;
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
		var d = U, f = K;
		G(null), q(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Bn]?.[r];
					h == null || a.disabled && e.target !== a || h.call(a, e);
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
			e[Bn] = t, delete e.currentTarget, G(d), q(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/reconciler.js
var Yn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Xn(e) {
	return Yn?.createHTML(e) ?? e;
}
function Zn(e) {
	var t = Xt("template");
	return t.innerHTML = Xn(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/template.js
function Qn(e, t) {
	var n = K;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function $n(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (b) return Qn(x, null), x;
		i === void 0 && (i = Zn(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Kt(i)));
		var t = r || Ht ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Kt(t), s = t.lastChild;
			Qn(o, s);
		} else Qn(t, t);
		return t;
	};
}
function er() {
	if (b) return Qn(x, null), x;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), Qn(t, n), e;
}
function tr(e, t) {
	if (b) {
		var n = K;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = x), Te();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var nr = ["touchstart", "touchmove"];
function rr(e) {
	return nr.includes(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/reactivity/create-subscriber.js
function ir(e) {
	let t = 0, n = Pt(0), r;
	return () => {
		en() && (Q(n), sn(() => (t === 0 && (r = zn(() => e(() => Rt(n)))), t += 1, () => {
			T(() => {
				--t, t === 0 && (r?.(), r = void 0, Rt(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ar = ae | oe;
function or(e, t, n, r) {
	new sr(e, t, n, r);
}
var sr = class {
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
	#h = ir(() => (this.#m = Pt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = K;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = K.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = ln(() => {
			if (b) {
				let e = Oe(this.#t);
				Te();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, ar), b && (this.#e = x);
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
		T(r), t && (this.#s = V(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? Ce() : (t = !0, n && ze(), this.#s !== null && hn(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					z(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (re | ie)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = V(() => e(this.#e)), T(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
				e.append(t), this.#a = this.#C(() => {
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
				}), this.#a === null ? (this.#c = null, n && this.#S(O)) : this.#u === 0 && (this.#e.before(e), this.#c = null, hn(this.#o, () => {
					this.#o = null;
				}), this.#S(O));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = V(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				yn(this.#a, e);
				let t = this.#n.pending;
				this.#o = V(() => t(this.#e));
			} else this.#S(O);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		nt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = K, n = U, r = w;
		q(this.#i), G(this.#i), Ue(this.#i.ctx);
		try {
			return Et.ensure(), e();
		} finally {
			q(t), G(n), Ue(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && hn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !this.#m || this.#d || (this.#d = !0, T(() => {
			this.#d = !1, this.#m && It(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		O?.is_fork ? (this.#a && O.skip_effect(this.#a), this.#o && O.skip_effect(this.#o), this.#s && O.skip_effect(this.#s), O.oncommit(() => {
			this.#y() || this.#T(t);
		})) : this.#T(t);
	}
	#T(e) {
		this.#a &&= (H(this.#a), null), this.#o &&= (H(this.#o), null), this.#s &&= (H(this.#s), null), b && (S(this.#t), Ee(), S(De()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
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
		T(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					z(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => z(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function cr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function lr(e, t) {
	return dr(e, t);
}
var ur = /* @__PURE__ */ new Map();
function dr(t, { target: n, anchor: r, props: i = {}, events: a, context: s, intro: c = !0, transformError: l }) {
	Gt();
	var u = void 0, d = rn(() => {
		var c = r ?? n.appendChild(F());
		or(c, { pending: () => {} }, (n) => {
			Je({});
			var r = w;
			if (s && (r.c = s), a && (i.$$events = a), b && Qn(n, null), u = t(n, i) || Xe(), b && (K.nodes.end = x, x === null || x.nodeType !== 8 || x.data !== "]")) throw Se(), e;
			Ye();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = rr(r);
					for (let e of [n, document]) {
						var a = ur.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ur.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Jn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(o(Vn)), Hn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = ur.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Jn), t.delete(e), t.size === 0 && ur.delete(r)) : t.set(e, i);
			}
			Hn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return fr.set(u, d), u;
}
var fr = /* @__PURE__ */ new WeakMap();
function pr(e, t) {
	let n = fr.get(e);
	return n ? (fr.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var mr = class {
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
			if (n) _n(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (_n(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						yn(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else H(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), hn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (H(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = O, r = Yt();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = F();
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
		} else b && (this.anchor = x), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function hr(e, t, n) {
	var r;
	b && (r = x, Te());
	var i = new mr(e);
	ln(() => {
		var e = t() ?? null;
		if (b && Oe(r) === "[" != (e !== null)) {
			var a = De();
			S(a), i.anchor = a, we(!1), i.ensure(e, e && ((t) => n(t, e))), we(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, ae);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/shared/attributes.js
var gr = [..." 	\n\r\f\xA0\v﻿"];
function _r(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || gr.includes(r[o - 1])) && (s === r.length || gr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/class.js
function vr(e, t, n, r, i, a) {
	var o = e[ge];
	if (b || o !== n || o === void 0) {
		var s = _r(n, r, a);
		b && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ge] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var yr = Symbol("is custom element"), br = Symbol("is html"), xr = be ? "link" : "LINK";
function Sr(e, t, n, r) {
	var i = Cr(e);
	b && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === xr) || i[t] !== (i[t] = n) && (t === "loading" && (e[me] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Tr(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Cr(e) {
	return e[he] ??= {
		[yr]: e.nodeName.includes("-"),
		[br]: e.namespaceURI === n
	};
}
var wr = /* @__PURE__ */ new Map();
function Tr(e) {
	var t = e.getAttribute("is") || e.nodeName, n = wr.get(t);
	if (n) return n;
	wr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = l(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = f(i);
	}
	return n;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Er(e, t) {
	return e === t || e?.[de] === t;
}
function Dr(e = Xe(), t, n, r) {
	var i = w.r, a = K;
	return an(() => {
		var o, s;
		return sn(() => {
			o = s, s = r?.() || [], zn(() => {
				Er(n(...s), e) || (t(e, ...s), o && Er(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Er(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/utils.js
function Or(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), h;
	let r = zn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/shared/index.js
var kr = [];
function Ar(e, t = h) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ae(e, t) && (e = t, n)) {
			let t = !kr.length;
			for (let t of r) t[1](), kr.push(t, e);
			if (t) {
				for (let e = 0; e < kr.length; e += 2) kr[e][0](kr[e + 1]);
				kr.length = 0;
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
function jr(e) {
	let t;
	return Or(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/props.js
var Mr = {
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
		if (t === de || t === pe) return !1;
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
function Nr(...e) {
	return new Proxy({ props: e }, Mr);
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
var Pr = /\s+/g;
function Fr(e) {
	return e.replace(/^【调】/, "").replace(/[★☆〇■◆]$/u, "").trim().replace(Pr, " ");
}
// packages/core/src/domain/course.ts
function Ir(e) {
	let t = e.name ? Fr(e.name) : "";
	return {
		teacher: "",
		location: "",
		weeks: [],
		remark: "",
		...e,
		name: t || e.name
	};
}
function Lr(e) {
	return {
		showSaturday: e.some((e) => e.dayOfWeek === 6),
		showSunday: e.some((e) => e.dayOfWeek === 7)
	};
}
var Rr = "未命名课表";
function zr(e) {
	let t = e.trim().slice(0, 50);
	return t.length > 0 ? t : Rr;
}
function Br(e) {
	if (!e) return;
	let t = e.source.trim() || "UNKNOWN", n = e.campusId?.trim();
	return n ? {
		source: t,
		campusId: n
	} : { source: t };
}
function Vr(e) {
	let t = Date.now(), n = Br(e.importMetadata), r = e.courses ?? [];
	return {
		schemaVersion: 1,
		id: e.id,
		name: zr(e.name),
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
// packages/core/src/domain/preferences.ts
var Hr = {
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
.2126 * Ur(15 / 255) + .7152 * Ur(23 / 255) + .0722 * Ur(42 / 255);
function Ur(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
// packages/core/src/schema/schema-types.ts
function Wr(e) {
	return e;
}
// packages/core/src/i18n/i18n-catalog.ts
function Gr(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/slots.ts
var Kr = class extends Error {
	kind;
	constructor(e, t) {
		super(t), this.name = "ImportSlotError", this.kind = e;
	}
}, qr = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/plugin/define-chronos-plugin.ts
function Jr(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Yr() {
	return "1.3.3";
}
function Xr(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Jr(e.messages, e.nameKey),
		version: e.version ?? Yr(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Jr(e.messages, e.descriptionKey) : void 0,
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
// packages/core/src/plugin/register-import-tab.ts
function Zr(e, t) {
	return e.registerSlot("import.source.tab", t);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/index-client.js
function Qr(e) {
	let t, n = ir((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return en() ? (n(), t) : jr(e);
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
// packages/ui-kit/src/form/TimePicker.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), $(["input"]), $(["change"]), $(["change"]), ir((e) => {
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
]), $(["change"]), Hr.hapticFeedbackEnabled, $(["click"]), $(["click"]), $(["click", "keydown"]), Hr.reduceMotionEnabled, $(["pointerdown"]), $(["keydown", "click"]), $(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var $r = /* @__PURE__ */ $n("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function ei(e, t) {
	Je(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = $r(), i = L(r), a = R(i, !0), o = Jt(i, 2), s = R(o, !0);
	C(r), cn((e, t) => {
		cr(a, e), cr(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), Gn("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), tr(e, r), Ye();
}
$(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ti, ni] = We();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
$(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var ri = /* @__PURE__ */ $n("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function ii(e, t) {
	Je(t, !0);
	let n = /* @__PURE__ */ D(() => t.component), r = /* @__PURE__ */ D(() => Qr(t.propsStore).current);
	var i = ri();
	or(L(i), {
		onerror: (e) => console.error("[MountableSvelteHost] render failed:", e),
		failed: (e, t = h, n = h) => {
			ei(e, {
				get controller() {
					return Q(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = er();
		hr(qt(t), () => Q(n), (e, t) => {
			t(e, Nr(() => Q(r)));
		}), tr(e, t);
	}), C(i), tr(e, i), Ye();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ai(e) {
	return {
		[qr]: !0,
		mount(t, n, r) {
			let i = Ar({ ...n }), a = lr(ii, {
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
					pr(a).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function oi(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Gr(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Gr(a, i) : o;
}
// packages/ui-kit/src/plugin-screen/import-tab-props.ts
async function si(e, t, n, r) {
	let i = await e.previewWithSlot(t, n);
	return !i && e.state.errorMessage && r?.notify(e.state.errorMessage, "error"), i;
}
// packages/codec-kit/src/deflate.ts
async function ci(e) {
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
async function li(e) {
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
async function ui(e) {
	if (typeof CompressionStream > "u") {
		let t = await import(
			/* @vite-ignore */
			"node:zlib"
);
		return new Uint8Array(t.deflateSync(Buffer.from(e)));
	}
	let t = new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} }).pipeThrough(new CompressionStream("deflate"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
// packages/codec-kit/src/base64.ts
var di = 8192;
function fi(e) {
	let t = "";
	for (let n = 0; n < e.length; n += di) t += String.fromCharCode(...e.subarray(n, n + di));
	return t;
}
function pi(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n += 1) t[n] = e.charCodeAt(n);
	return t;
}
function mi(e) {
	return btoa(fi(e));
}
function hi(e) {
	return pi(atob(e));
}
// packages/codec-kit/src/crc32.ts
var gi = (() => {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t += 1) {
		let n = t;
		for (let e = 0; e < 8; e += 1) n = n & 1 ? n >>> 1 ^ 3988292384 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
})();
function _i(e) {
	let t = 4294967295;
	for (let n of e) t = (gi[(t ^ n) & 255] ^ t >>> 8) >>> 0;
	return (t ^ 4294967295) >>> 0;
}
function vi(e) {
	let t = e.filter((e) => e < 1 || e > 32);
	if (t.length > 0) throw RangeError(`week out of range: ${t.join(", ")}`);
}
function yi(e) {
	vi(e);
	let t = 0;
	for (let n of e) t |= 1 << n - 1;
	return t >>> 0;
}
function bi(e) {
	let t = [];
	for (let n = 1; n <= 32; n += 1) e & 1 << n - 1 && t.push(n);
	return t;
}
// packages/codec-kit/src/interner.ts
var xi = class {
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
}, Si = [
	{
		eccPerBlock: 7,
		blocks: [{
			count: 1,
			totalCodewords: 26,
			dataCodewords: 19
		}]
	},
	{
		eccPerBlock: 10,
		blocks: [{
			count: 1,
			totalCodewords: 44,
			dataCodewords: 34
		}]
	},
	{
		eccPerBlock: 15,
		blocks: [{
			count: 1,
			totalCodewords: 70,
			dataCodewords: 55
		}]
	},
	{
		eccPerBlock: 20,
		blocks: [{
			count: 1,
			totalCodewords: 100,
			dataCodewords: 80
		}]
	},
	{
		eccPerBlock: 26,
		blocks: [{
			count: 1,
			totalCodewords: 134,
			dataCodewords: 108
		}]
	},
	{
		eccPerBlock: 18,
		blocks: [{
			count: 2,
			totalCodewords: 86,
			dataCodewords: 68
		}]
	},
	{
		eccPerBlock: 20,
		blocks: [{
			count: 2,
			totalCodewords: 98,
			dataCodewords: 78
		}]
	},
	{
		eccPerBlock: 24,
		blocks: [{
			count: 2,
			totalCodewords: 121,
			dataCodewords: 97
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 2,
			totalCodewords: 146,
			dataCodewords: 116
		}]
	},
	{
		eccPerBlock: 18,
		blocks: [{
			count: 2,
			totalCodewords: 86,
			dataCodewords: 68
		}, {
			count: 2,
			totalCodewords: 87,
			dataCodewords: 69
		}]
	},
	{
		eccPerBlock: 20,
		blocks: [{
			count: 4,
			totalCodewords: 101,
			dataCodewords: 81
		}]
	},
	{
		eccPerBlock: 24,
		blocks: [{
			count: 2,
			totalCodewords: 116,
			dataCodewords: 92
		}, {
			count: 2,
			totalCodewords: 117,
			dataCodewords: 93
		}]
	},
	{
		eccPerBlock: 26,
		blocks: [{
			count: 4,
			totalCodewords: 133,
			dataCodewords: 107
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 3,
			totalCodewords: 145,
			dataCodewords: 115
		}, {
			count: 1,
			totalCodewords: 146,
			dataCodewords: 116
		}]
	},
	{
		eccPerBlock: 22,
		blocks: [{
			count: 5,
			totalCodewords: 109,
			dataCodewords: 87
		}, {
			count: 1,
			totalCodewords: 110,
			dataCodewords: 88
		}]
	},
	{
		eccPerBlock: 24,
		blocks: [{
			count: 5,
			totalCodewords: 122,
			dataCodewords: 98
		}, {
			count: 1,
			totalCodewords: 123,
			dataCodewords: 99
		}]
	},
	{
		eccPerBlock: 28,
		blocks: [{
			count: 1,
			totalCodewords: 135,
			dataCodewords: 107
		}, {
			count: 5,
			totalCodewords: 136,
			dataCodewords: 108
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 5,
			totalCodewords: 150,
			dataCodewords: 120
		}, {
			count: 1,
			totalCodewords: 151,
			dataCodewords: 121
		}]
	},
	{
		eccPerBlock: 28,
		blocks: [{
			count: 3,
			totalCodewords: 141,
			dataCodewords: 113
		}, {
			count: 4,
			totalCodewords: 142,
			dataCodewords: 114
		}]
	},
	{
		eccPerBlock: 28,
		blocks: [{
			count: 3,
			totalCodewords: 135,
			dataCodewords: 107
		}, {
			count: 5,
			totalCodewords: 136,
			dataCodewords: 108
		}]
	},
	{
		eccPerBlock: 28,
		blocks: [{
			count: 4,
			totalCodewords: 144,
			dataCodewords: 116
		}, {
			count: 4,
			totalCodewords: 145,
			dataCodewords: 117
		}]
	},
	{
		eccPerBlock: 28,
		blocks: [{
			count: 2,
			totalCodewords: 151,
			dataCodewords: 123
		}, {
			count: 7,
			totalCodewords: 152,
			dataCodewords: 124
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 4,
			totalCodewords: 147,
			dataCodewords: 117
		}, {
			count: 5,
			totalCodewords: 148,
			dataCodewords: 118
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 6,
			totalCodewords: 151,
			dataCodewords: 121
		}, {
			count: 4,
			totalCodewords: 152,
			dataCodewords: 122
		}]
	},
	{
		eccPerBlock: 26,
		blocks: [{
			count: 8,
			totalCodewords: 133,
			dataCodewords: 107
		}, {
			count: 4,
			totalCodewords: 134,
			dataCodewords: 108
		}]
	},
	{
		eccPerBlock: 28,
		blocks: [{
			count: 10,
			totalCodewords: 142,
			dataCodewords: 114
		}, {
			count: 2,
			totalCodewords: 143,
			dataCodewords: 115
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 8,
			totalCodewords: 152,
			dataCodewords: 122
		}, {
			count: 4,
			totalCodewords: 153,
			dataCodewords: 123
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 3,
			totalCodewords: 147,
			dataCodewords: 117
		}, {
			count: 10,
			totalCodewords: 148,
			dataCodewords: 118
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 7,
			totalCodewords: 146,
			dataCodewords: 116
		}, {
			count: 7,
			totalCodewords: 147,
			dataCodewords: 117
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 5,
			totalCodewords: 145,
			dataCodewords: 115
		}, {
			count: 10,
			totalCodewords: 146,
			dataCodewords: 116
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 13,
			totalCodewords: 145,
			dataCodewords: 115
		}, {
			count: 3,
			totalCodewords: 146,
			dataCodewords: 116
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 17,
			totalCodewords: 145,
			dataCodewords: 115
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 17,
			totalCodewords: 145,
			dataCodewords: 115
		}, {
			count: 1,
			totalCodewords: 146,
			dataCodewords: 116
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 13,
			totalCodewords: 145,
			dataCodewords: 115
		}, {
			count: 6,
			totalCodewords: 146,
			dataCodewords: 116
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 12,
			totalCodewords: 151,
			dataCodewords: 121
		}, {
			count: 7,
			totalCodewords: 152,
			dataCodewords: 122
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 6,
			totalCodewords: 151,
			dataCodewords: 121
		}, {
			count: 14,
			totalCodewords: 152,
			dataCodewords: 122
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 17,
			totalCodewords: 152,
			dataCodewords: 122
		}, {
			count: 4,
			totalCodewords: 153,
			dataCodewords: 123
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 4,
			totalCodewords: 152,
			dataCodewords: 122
		}, {
			count: 18,
			totalCodewords: 153,
			dataCodewords: 123
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 20,
			totalCodewords: 147,
			dataCodewords: 117
		}, {
			count: 4,
			totalCodewords: 148,
			dataCodewords: 118
		}]
	},
	{
		eccPerBlock: 30,
		blocks: [{
			count: 19,
			totalCodewords: 148,
			dataCodewords: 118
		}, {
			count: 6,
			totalCodewords: 149,
			dataCodewords: 119
		}]
	}
], Ci = /* @__PURE__ */ new Uint8Array(512), wi = /* @__PURE__ */ new Uint8Array(256);
(() => {
	let e = 1;
	for (let t = 0; t < 255; t++) Ci[t] = e, Ci[t + 255] = e, wi[e] = t, e <<= 1, e & 256 && (e ^= 285);
})();
function Ti(e, t) {
	return e === 0 || t === 0 ? 0 : Ci[wi[e] + wi[t]];
}
function Ei(e) {
	let t = new Uint8Array([1]);
	for (let n = 0; n < e; n++) {
		let e = new Uint8Array(t.length + 1);
		for (let r = 0; r < t.length; r++) e[r] ^= Ti(t[r], Ci[n]), e[r + 1] ^= t[r];
		t = e;
	}
	return t;
}
function Di(e, t) {
	let n = Ei(t), r = new Uint8Array(t);
	for (let i = 0; i < e.length; i++) {
		let a = e[i] ^ r[0];
		for (let e = 0; e < t - 1; e++) r[e] = r[e + 1] ^ Ti(n[e + 1], a);
		r[t - 1] = Ti(n[t], a);
	}
	return r;
}
// packages/plugins/codec-qrcode/src/qr/qr-payload-encoder.ts
function Oi(e) {
	let t = Si[e - 1];
	if (!t) throw Error(`Unsupported QR version: ${e}`);
	return t;
}
function ki(e) {
	for (let t = 1; t <= 40; t++) {
		let n = Oi(t).blocks.reduce((e, t) => e + t.count * t.dataCodewords, 0);
		if (e + (t <= 9 ? 2 : 3) <= n) return t;
	}
	throw Error(`Data payload too large for QR Code (length: ${e}, max capacity: 2953 bytes)`);
}
function Ai(e, t) {
	let n = new TextEncoder().encode(e), r = Oi(t), i = r.blocks.reduce((e, t) => e + t.count * t.dataCodewords, 0), a = [];
	function o(e, t) {
		for (let n = t - 1; n >= 0; n--) a.push(e >> n & 1);
	}
	o(4, 4);
	let s = t <= 9 ? 8 : 16;
	o(n.length, s);
	for (let e of n) o(e, 8);
	let c = i * 8;
	for (o(0, Math.min(4, c - a.length)); a.length % 8 != 0;) a.push(0);
	let l = new Uint8Array(i);
	for (let e = 0; e < a.length / 8; e++) {
		let t = 0;
		for (let n = 0; n < 8; n++) t = t << 1 | a[e * 8 + n];
		l[e] = t;
	}
	let u = 236;
	for (let e = a.length / 8; e < i; e++) l[e] = u, u = u === 236 ? 17 : 236;
	let d = [], f = [], p = 0;
	for (let e of r.blocks) for (let t = 0; t < e.count; t++) {
		let t = l.subarray(p, p + e.dataCodewords);
		d.push(t), f.push(Di(t, r.eccPerBlock)), p += e.dataCodewords;
	}
	let m = [], h = Math.max(...d.map((e) => e.length));
	for (let e = 0; e < h; e++) for (let t of d) e < t.length && m.push(t[e]);
	for (let e = 0; e < r.eccPerBlock; e++) for (let t of f) m.push(t[e]);
	return Uint8Array.from(m);
}
// packages/plugins/codec-qrcode/src/qr/qr-layout-tables.ts
var ji = [
	[],
	[6, 18],
	[6, 22],
	[6, 26],
	[6, 30],
	[6, 34],
	[
		6,
		22,
		38
	],
	[
		6,
		24,
		42
	],
	[
		6,
		26,
		46
	],
	[
		6,
		28,
		50
	],
	[
		6,
		30,
		54
	],
	[
		6,
		32,
		58
	],
	[
		6,
		34,
		62
	],
	[
		6,
		26,
		46,
		66
	],
	[
		6,
		26,
		48,
		70
	],
	[
		6,
		26,
		50,
		74
	],
	[
		6,
		30,
		54,
		78
	],
	[
		6,
		30,
		56,
		82
	],
	[
		6,
		30,
		58,
		86
	],
	[
		6,
		34,
		62,
		90
	],
	[
		6,
		28,
		50,
		72,
		94
	],
	[
		6,
		26,
		50,
		74,
		98
	],
	[
		6,
		30,
		54,
		78,
		102
	],
	[
		6,
		28,
		54,
		80,
		106
	],
	[
		6,
		32,
		58,
		84,
		110
	],
	[
		6,
		30,
		58,
		86,
		114
	],
	[
		6,
		34,
		62,
		90,
		118
	],
	[
		6,
		26,
		50,
		74,
		98,
		122
	],
	[
		6,
		30,
		54,
		78,
		102,
		126
	],
	[
		6,
		26,
		52,
		78,
		104,
		130
	],
	[
		6,
		30,
		56,
		82,
		108,
		134
	],
	[
		6,
		34,
		60,
		86,
		112,
		138
	],
	[
		6,
		30,
		58,
		86,
		114,
		142
	],
	[
		6,
		34,
		62,
		90,
		118,
		146
	],
	[
		6,
		30,
		54,
		78,
		102,
		126,
		150
	],
	[
		6,
		24,
		50,
		76,
		102,
		128,
		154
	],
	[
		6,
		28,
		54,
		80,
		106,
		132,
		158
	],
	[
		6,
		32,
		58,
		84,
		110,
		136,
		162
	],
	[
		6,
		26,
		54,
		82,
		110,
		138,
		166
	],
	[
		6,
		30,
		58,
		86,
		114,
		142,
		170
	]
], Mi = [
	31892,
	34236,
	39577,
	42195,
	48118,
	51042,
	55367,
	58893,
	63784,
	68472,
	70749,
	76311,
	79154,
	84390,
	87683,
	92361,
	96236,
	102084,
	102881,
	110507,
	110734,
	117786,
	119615,
	126325,
	127568,
	133589,
	136944,
	141498,
	145311,
	150283,
	152622,
	158308,
	161089,
	167017
], Ni = 9174;
// packages/plugins/codec-qrcode/src/qr/qr-matrix-layout.ts
function Pi(e, t) {
	return e === 0 || e === 6 || t === 0 || t === 6 || e >= 2 && e <= 4 && t >= 2 && t <= 4;
}
function Fi(e, t, n, r, i) {
	function a(e, i, a, o = !0) {
		e >= 0 && e < t && i >= 0 && i < t && (n[e][i] = a, o && (r[e][i] = !0));
	}
	function o(e, n) {
		for (let r = -1; r <= 7; r++) for (let i = -1; i <= 7; i++) {
			let o = e + r, s = n + i;
			o < 0 || o >= t || s < 0 || s >= t || (r === -1 || r === 7 || i === -1 || i === 7 ? a(o, s, !1) : Pi(r, i) ? a(o, s, !0) : a(o, s, !1));
		}
	}
	o(0, 0), o(0, t - 7), o(t - 7, 0);
	for (let e = 8; e < t - 8; e++) n[6][e] === null && a(6, e, e % 2 == 0), n[e][6] === null && a(e, 6, e % 2 == 0);
	let s = ji[e - 1] ?? [];
	for (let e of s) for (let t of s) if (!r[e][t]) for (let n = -2; n <= 2; n++) for (let r = -2; r <= 2; r++) {
		let i = Math.max(Math.abs(n), Math.abs(r)) !== 1;
		a(e + n, t + r, i);
	}
	a(t - 8, 8, !0);
	for (let e = 0; e < 9; e++) n[8][e] === null && a(8, e, !1, !0), n[e][8] === null && a(e, 8, !1, !0);
	for (let e = 0; e < 8; e++) n[8][t - 1 - e] === null && a(8, t - 1 - e, !1, !0), n[t - 1 - e][8] === null && a(t - 1 - e, 8, !1, !0);
	if (e >= 7) {
		let n = Mi[e - 7];
		for (let e = 0; e < 18; e++) {
			let r = (n >> e & 1) == 1, i = Math.floor(e / 3), o = e % 3 + t - 11;
			a(i, o, r), a(o, i, r);
		}
	}
	let c = 0, l = t - 1, u = -1;
	for (let e = t - 1; e > 0; e -= 2) for (e === 6 && e--;;) {
		for (let t = 0; t < 2; t++) {
			let a = e - t;
			if (!r[l][a]) {
				let e = Math.floor(c / 8), t = 7 - c % 8, r = e < i.length && (i[e] >> t & 1) == 1;
				n[l][a] = r, c++;
			}
		}
		if (l += u, l < 0 || l >= t) {
			u = -u, l += u;
			break;
		}
	}
	for (let e = 0; e < t; e++) for (let i = 0; i < t; i++) r[e][i] || (e + i) % 2 == 0 && (n[e][i] = !n[e][i]);
	let d = Ni;
	for (let e = 0; e < 15; e++) {
		let r = (d >> e & 1) == 1;
		e < 6 ? n[8][e] = r : e < 8 ? n[8][e + 1] = r : n[8][t - 15 + e] = r, e < 8 ? n[t - 1 - e][8] = r : n[14 - e][8] = r;
	}
}
function Ii(e, t) {
	let n = t * 4 + 17, r = Array.from({ length: n }, () => Array(n).fill(null));
	return Fi(t, n, r, Array.from({ length: n }, () => Array(n).fill(!1)), Ai(e, t)), {
		size: n,
		modules: r.map((e) => e.map((e) => !!e))
	};
}
// packages/plugins/codec-qrcode/src/qr/qr-encode.ts
function Li(e) {
	return Ii(e, ki(new TextEncoder().encode(e).length));
}
// packages/plugins/codec-qrcode/src/qr/qr-png.ts
var Ri = new Uint8Array([
	137,
	80,
	78,
	71,
	13,
	10,
	26,
	10
]);
function zi(e, t, n) {
	e.setUint32(t, n, !1);
}
function Bi(e, t) {
	let n = new TextEncoder().encode(e), r = new Uint8Array(8 + t.length + 4), i = new DataView(r.buffer);
	zi(i, 0, t.length), r.set(n, 4), r.set(t, 8);
	let a = new Uint8Array(n.length + t.length);
	return a.set(n, 0), a.set(t, n.length), zi(i, 8 + t.length, _i(a)), r;
}
function Vi(e, t) {
	let n = new TextEncoder().encode(e), r = new TextEncoder().encode(t), i = new Uint8Array(n.length + 1 + r.length);
	return i.set(n, 0), i[n.length] = 0, i.set(r, n.length + 1), Bi("tEXt", i);
}
function Hi(e, t = {}) {
	let { margin: n = 2, size: r = 512 } = t, i = e.size + n * 2, a = Math.max(1, Math.floor(r / i)), o = i * a, s = i * a, c = new Uint8Array(o * s * 4);
	for (let t = 0; t < s; t++) {
		let r = Math.floor(t / a) - n;
		for (let i = 0; i < o; i++) {
			let s = Math.floor(i / a) - n, l = r >= 0 && r < e.size && s >= 0 && s < e.size && e.modules[r][s], u = (t * o + i) * 4, d = l ? 0 : 255;
			c[u] = d, c[u + 1] = d, c[u + 2] = d, c[u + 3] = 255;
		}
	}
	return {
		rgba: c,
		width: o,
		height: s
	};
}
async function Ui(e, t, n, r = {}) {
	let i = 1 + t * 4, a = new Uint8Array(n * i);
	for (let r = 0; r < n; r++) {
		let n = r * i;
		a[n] = 0, a.set(e.subarray(r * t * 4, (r + 1) * t * 4), n + 1);
	}
	let o = await ui(a), s = /* @__PURE__ */ new Uint8Array(13), c = new DataView(s.buffer);
	zi(c, 0, t), zi(c, 4, n), s[8] = 8, s[9] = 6, s[10] = 0, s[11] = 0, s[12] = 0;
	let l = [
		Ri,
		Bi("IHDR", s),
		Bi("IDAT", o),
		...r.metadata ? [Vi("chronos-qr", r.metadata)] : [],
		Bi("IEND", /* @__PURE__ */ new Uint8Array())
	], u = l.reduce((e, t) => e + t.length, 0), d = new Uint8Array(u), f = 0;
	for (let e of l) d.set(e, f), f += e.length;
	return d;
}
async function Wi(e, t = {}) {
	let { rgba: n, width: r, height: i } = Hi(Li(e), t);
	return Ui(n, r, i, { metadata: e });
}
// packages/plugins/codec-qrcode/src/qr/qr-decode.ts
var Gi = "chronos-qr";
function Ki(e, t) {
	return e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3];
}
function qi(e) {
	return e.length >= 8 && e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71;
}
function Ji(e) {
	if (!qi(e)) return null;
	let t = 8;
	for (; t + 12 <= e.length;) {
		let n = Ki(e, t), r = String.fromCharCode(e[t + 4], e[t + 5], e[t + 6], e[t + 7]), i = t + 8, a = i + n;
		if (a > e.length) break;
		if (r === "tEXt") {
			let t = e.subarray(i, a), n = t.indexOf(0);
			if (n > 0) {
				let e = new TextDecoder().decode(t.subarray(0, n)), r = new TextDecoder().decode(t.subarray(n + 1));
				if (e === Gi && r.startsWith("chronos-qr:")) return r;
			}
		}
		t = a + 4;
	}
	return null;
}
async function Yi(e, t) {
	if (typeof window > "u") throw Error(t("decode.browserOnly"));
	let n = new Uint8Array(await e.arrayBuffer()), r = Ji(n);
	if (r) return r;
	try {
		let e = new TextDecoder().decode(n), t = /chronos-qr:[A-Za-z0-9+/=:_-]+/.exec(e);
		if (t) return t[0];
	} catch {}
	let i = URL.createObjectURL(e), a = document.createElement("canvas"), o = a.getContext("2d");
	try {
		let e = new Image();
		await new Promise((n, r) => {
			e.onload = () => n(), e.onerror = () => r(Error(t("decode.unreadableImage"))), e.src = i;
		});
		let n = e.naturalWidth || e.width || 512, r = e.naturalHeight || e.height || 512;
		if (a.width = n, a.height = r, o?.drawImage(e, 0, 0, n, r), window.BarcodeDetector) try {
			let e = await new window.BarcodeDetector({ formats: ["qr_code"] }).detect(a);
			if (e.length > 0 && e[0]?.rawValue) return e[0].rawValue;
		} catch (e) {
			console.warn("[BarcodeDetector] detect failed on canvas:", e);
		}
	} finally {
		URL.revokeObjectURL(i);
	}
	throw Error(t("decode.noQrFound"));
}
// packages/plugins/codec-qrcode/src/messages.ts
function Xi(e) {
	return Wr({ content: {
		type: "string",
		title: () => e("import.field.content.title"),
		placeholder: () => e("import.field.content.placeholder"),
		required: !0
	} });
}
var Zi = {
	"zh-cn": {
		"plugin.name": "二维码",
		"plugin.description": "通过二维码导入/导出课表",
		"import.tab.title": "二维码",
		"import.tab.badge": "图片",
		"import.tab.supporting": "选择或扫描导出为二维码图片进行导入",
		"import.field.content.title": "二维码内容",
		"import.field.content.placeholder": "二维码识别出的数据内容",
		"import.error.empty": "未识别到有效的二维码内容",
		"import.error.corrupt": "二维码数据格式损坏或无法解析为课表",
		"import.error.decodeFailed": "二维码识别失败",
		"import.ui.title": "二维码",
		"import.ui.subtitle": "选择或拖入他人分享的导出为二维码图片",
		"import.ui.dropLabel": "点击选择二维码图片",
		"import.ui.formats": "支持 PNG、JPEG、WebP 或 SVG 格式",
		"import.ui.select": "选择图片",
		"import.ui.scanning": "识别中…",
		"import.ui.dropAria": "二维码图片上传区域",
		"export.action.title": "二维码",
		"export.action.description": "生成分享二维码 PNG 图片并保存",
		"export.error.noTimetable": "无可导出的课表",
		"export.success": "已生成并下载导出为二维码",
		"timetable.unnamedCourse": "未命名课程",
		"timetable.defaultName": "二维码导入课表",
		"decode.browserOnly": "二维码解码仅支持在浏览器环境中运行",
		"decode.unreadableImage": "无法读取图片内容",
		"decode.noQrFound": "未能从该图片中识别出有效的二维码或当前浏览器不支持原生扫码识别"
	},
	en: {
		"plugin.name": "QR Code",
		"plugin.description": "Import and export timetables via QR codes",
		"import.tab.title": "QR code",
		"import.tab.badge": "Image",
		"import.tab.supporting": "Select or scan a timetable QR code image to import",
		"import.field.content.title": "QR content",
		"import.field.content.placeholder": "Decoded QR payload",
		"import.error.empty": "No valid QR content was recognized",
		"import.error.corrupt": "QR data is corrupted or cannot be parsed as a timetable",
		"import.error.decodeFailed": "Failed to decode QR code",
		"import.ui.title": "QR code",
		"import.ui.subtitle": "Select or drop a shared timetable QR image",
		"import.ui.dropLabel": "Choose a QR image",
		"import.ui.formats": "PNG, JPEG, WebP, or SVG",
		"import.ui.select": "Choose image",
		"import.ui.scanning": "Scanning…",
		"import.ui.dropAria": "QR image upload area",
		"export.action.title": "QR code",
		"export.action.description": "Generate a shareable QR PNG image and download",
		"export.error.noTimetable": "No timetable to export",
		"export.success": "Timetable QR code downloaded",
		"timetable.unnamedCourse": "Untitled course",
		"timetable.defaultName": "Imported timetable (QR)",
		"decode.browserOnly": "QR decoding is only available in the browser",
		"decode.unreadableImage": "Could not read image contents",
		"decode.noQrFound": "No valid QR code was found in this image, or the browser does not support native scanning"
	}
};
function Qi(e) {
	return Zi[e.toLowerCase() === "en" ? "en" : "zh-cn"];
}
// packages/plugins/codec-qrcode/src/QrCodeImportTab.svelte
var $i = /* @__PURE__ */ $n("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p></div> <input type=\"file\" accept=\"image/*,.svg\" class=\"hidden\"/> <div role=\"region\"><svg class=\"size-10 text-on-surface-variant/80\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"></rect><path d=\"M14 14h3v3h-3z\"></path><path d=\"M20 14v3h-3\"></path><path d=\"M14 20h7\"></path></svg> <div class=\"flex flex-col gap-1\"><span class=\"text-body-medium font-semibold text-on-surface\"> </span> <span class=\"text-body-small text-supporting text-on-surface-variant\"> </span></div> <button type=\"button\" class=\"ui-btn ui-btn-filled mt-1\"> </button></div></div></div>");
function ea(e, t) {
	Je(t, !0);
	let n = /* @__PURE__ */ M(!1), r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ M(!1);
	function a(e) {
		return oi(t.controller, "tool-qrcode", Zi, e);
	}
	let o = /* @__PURE__ */ D(() => a("import.ui.title")), s = /* @__PURE__ */ D(() => a("import.ui.subtitle")), c = /* @__PURE__ */ D(() => a("import.ui.dropLabel")), l = /* @__PURE__ */ D(() => a("import.ui.formats")), u = /* @__PURE__ */ D(() => a("import.ui.select")), d = /* @__PURE__ */ D(() => a("import.ui.scanning")), f = /* @__PURE__ */ D(() => a("import.ui.dropAria"));
	async function p(e) {
		N(n, !0);
		try {
			let n = await Yi(e, (e) => a(e));
			await si(t.transfer, "qrcode", { content: n }, t.controller) && t.onContinue();
		} catch (e) {
			let n = e instanceof Error ? e.message : a("import.error.decodeFailed");
			t.controller?.notify(n, "error");
		} finally {
			N(n, !1);
		}
	}
	async function m(e) {
		let t = e.target, n = t.files?.[0];
		n && (await p(n), t.value = "");
	}
	async function h(e) {
		e.preventDefault(), N(i, !1);
		let t = e.dataTransfer?.files?.[0];
		t && await p(t);
	}
	var ee = $i(), te = L(ee), g = L(te), _ = L(g), v = R(_, !0), ne = R(Jt(_, 2), !0);
	C(g);
	var re = Jt(g, 2);
	Dr(re, (e) => N(r, e), () => Q(r));
	var y = Jt(re, 2), ie = Jt(L(y), 2), ae = L(ie), oe = R(ae, !0), se = R(Jt(ae, 2), !0);
	C(ie);
	var ce = Jt(ie, 2), le = R(ce, !0);
	C(y), C(te), C(ee), cn(() => {
		cr(v, Q(o)), cr(ne, Q(s)), vr(y, 1, `flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${Q(i) ? "border-primary bg-primary/5" : "border-outline/40 bg-surface-variant/20"}`), Sr(y, "aria-label", Q(f)), cr(oe, Q(c)), cr(se, Q(l)), ce.disabled = Q(n), cr(le, Q(n) ? Q(d) : Q(u));
	}), Gn("change", re, m), Wn("dragover", y, (e) => {
		e.preventDefault(), N(i, !0);
	}), Wn("dragleave", y, () => N(i, !1)), Wn("drop", y, h), Gn("click", ce, () => Q(r)?.click()), tr(e, ee), Ye();
}
$(["change", "click"]);
// packages/plugins/codec-qrcode/src/index.ts
var ta = "chronos-qr:v1:";
async function na(e) {
	let t = new xi(), n = e.courses.map((e) => {
		let n = t.intern(e.name), r = t.intern(e.teacher), i = t.intern(e.location), a = t.intern(e.remark), o = yi(e.weeks), s = [
			n,
			r,
			i,
			e.dayOfWeek,
			e.startPeriod,
			e.endPeriod,
			o
		];
		return a >= 0 && s.push(a), s;
	}), r = {
		v: 2,
		n: e.name,
		s: t.strings,
		c: n
	};
	e.academicConfig?.termStartDate && (r.d = e.academicConfig.termStartDate), (e.academicConfig?.startWeek !== void 0 || e.academicConfig?.endWeek !== void 0) && (r.w = [e.academicConfig.startWeek ?? 1, e.academicConfig.endWeek ?? 20]), e.academicConfig?.periodTimes?.length && (r.p = e.academicConfig.periodTimes.map((e) => [
		e.index,
		e.startTime,
		e.endTime
	]));
	let i = JSON.stringify(r);
	return `${ta}${mi(await ci(new TextEncoder().encode(i)))}`;
}
async function ra(e, t = Qi("zh-cn")) {
	let n = e.trim();
	if (!n.startsWith("chronos-qr:v1:")) throw new Kr("invalid-data", t["import.error.corrupt"]);
	try {
		let e = await li(hi(n.slice(14))), r = new TextDecoder().decode(e), i = JSON.parse(r), a = i.s ?? [], o = (i.c ?? []).map((e, n) => {
			let r = (e[0] >= 0 ? a[e[0]] : null) ?? t["timetable.unnamedCourse"], i = (e[1] >= 0 ? a[e[1]] : null) ?? "", o = (e[2] >= 0 ? a[e[2]] : null) ?? "", s = e[3] ?? 1, c = e[4] ?? 1, l = e[5] ?? 1, u = bi(e[6] ?? 1), d = e[7] !== void 0 && e[7] >= 0 ? a[e[7]] : void 0;
			return Ir({
				id: `c-qr-${n + 1}-${Date.now().toString(36)}`,
				name: r,
				teacher: i,
				location: o,
				dayOfWeek: s,
				startPeriod: c,
				endPeriod: l,
				weeks: u,
				remark: d
			});
		});
		return Vr({
			id: `t-qr-${Date.now().toString(36)}`,
			name: i.n || t["timetable.defaultName"],
			academicConfig: {
				termStartDate: i.d ?? "",
				startWeek: i.w?.[0] ?? 1,
				endWeek: i.w?.[1] ?? 20,
				periodTimes: (i.p ?? []).map((e) => ({
					index: e[0],
					startTime: e[1],
					endTime: e[2]
				}))
			},
			viewPrefs: {
				...Lr(o),
				showNonCurrentWeekCourses: !1
			},
			courses: o
		});
	} catch (e) {
		throw e instanceof Kr ? e : new Kr("invalid-data", t["import.error.corrupt"]);
	}
}
function ia(e = {}) {
	let { importComponent: t = ai(ea) } = e;
	return Xr({
		id: "tool-qrcode",
		messages: Zi,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "tool",
		toolGroup: "utility",
		order: 35,
		author: "UE-DND",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = Xi(n);
			Zr(e, {
				id: "qrcode",
				title: () => n("import.tab.title"),
				order: 25,
				importKind: "file",
				badge: () => n("import.tab.badge"),
				supportingText: () => n("import.tab.supporting"),
				component: t,
				inputSchema: r,
				async executeImport(t) {
					let r = Qi(e.i18n.locale), i = t.content;
					if (!i?.trim()) throw new Kr("no-data", n("import.error.empty"));
					return ra(i, r);
				}
			}), e.registerSlot("export.action", {
				id: "qrcode",
				title: () => n("export.action.title"),
				order: 20,
				disposition: "download",
				isPrimary: !1,
				description: () => n("export.action.description"),
				async export(e, t) {
					let r = e ?? t?.state.currentTimetable;
					if (!r) throw Error(n("export.error.noTimetable"));
					let i = await Wi(await na(r), { margin: 2 });
					return {
						filename: `${(r.name || "timetable").replace(/[/\\?%*:|"<>]/g, "_")}-qrcode.png`,
						mimeType: "image/png",
						content: i,
						disposition: "download",
						successMessage: () => n("export.success")
					};
				}
			});
		}
	});
}
ia();
// packages/plugins/codec-qrcode/bundle/entry.ts
var aa = ia({ importComponent: ai(ea) });
export { aa as default };
