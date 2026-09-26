//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = Array.isArray, r = Array.prototype.indexOf, i = Array.prototype.includes, a = Array.from, o = Object.defineProperty, s = Object.getOwnPropertyDescriptor, c = Object.getOwnPropertyDescriptors, l = Object.prototype, u = Array.prototype, d = Object.getPrototypeOf, f = Object.isExtensible;
function p(e) {
	return typeof e == "function";
}
var m = () => {};
function h(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function g() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, ee = 1 << 25, C = 65536, w = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, T = Symbol("$state"), oe = Symbol("component"), se = Symbol("legacy props"), ce = Symbol("attributes"), le = Symbol("class"), ue = Symbol("style"), de = Symbol("text"), fe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
function pe() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function me(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function he() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function ge(e) {
	E = e;
}
var D;
function O(t) {
	if (t === null) throw me(), e;
	return D = t;
}
function _e() {
	return O(/* @__PURE__ */ Wt(D));
}
function k(t) {
	if (E) {
		if (/* @__PURE__ */ Wt(D) !== null) throw me(), e;
		D = t;
	}
}
function ve(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ Wt(n);
		D = n;
	}
}
function ye(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ Wt(n);
		e && n.remove(), n = i;
	}
}
function be(t) {
	if (!t || t.nodeType !== 8) throw me(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function xe(e) {
	return e === this.v;
}
function Se(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ce(e) {
	return !Se(e, this.v);
}
function we(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Te() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function Ee() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function De(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Oe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ke() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function je() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Me() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function Ne(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Te(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Pe(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Fe(e, t) {
	return e === null && we(t), e.c ??= new Map(Pe(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var A = null;
function Ie(e) {
	A = e;
}
function Le() {
	return Ne(Re, ze, Be);
}
function Re(e) {
	return Fe(A, "getContext").get(e);
}
function ze(e, t) {
	return Fe(A, "setContext").set(e, t), t;
}
function Be(e) {
	return Fe(A, "hasContext").has(e);
}
function Ve(e, t = !1, n) {
	A = {
		p: A,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: K,
		l: null
	};
}
function He(e) {
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) nn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, Ue(e);
}
function Ue(e = {}) {
	return o(e, oe, { value: !0 }), e;
}
function We() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var Ge = [];
function Ke() {
	var e = Ge;
	Ge = [], h(e);
}
function qe(e) {
	if (Ge.length === 0 && !ht) {
		var t = Ge;
		queueMicrotask(() => {
			t === Ge && Ke();
		});
	}
	Ge.push(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var Je = ~(v | y | _);
function j(e, t) {
	e.f = e.f & Je | t;
}
function Ye(e) {
	e.f & 512 || e.deps === null ? j(e, _) : j(e, y);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function Xe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), j(e, _);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Ze(e) {
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
function Qe(e, t, n, r) {
	let i = We() ? nt : ot;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = K, c = $e(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				B(e, s);
			}
			et();
		}
	}
	var d = tt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ it(e))).then(u).catch((e) => B(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), et();
	}) : f();
}
function $e() {
	var e = K, t = U, n = A, r = M;
	return function(i = !0) {
		q(e), G(t), Ie(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function et(e = !0) {
	q(null), G(null), Ie(null), e && M?.deactivate();
}
function tt() {
	var e = K, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function nt(e) {
	var n = 2 | v;
	return K !== null && (K.f |= w), {
		ctx: A,
		deps: null,
		effects: null,
		equals: xe,
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
var rt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function it(e, n, r) {
	let i = K;
	i === null && Ee();
	var a = void 0, o = kt(t), s = !U, c = /* @__PURE__ */ new Set();
	return on(() => {
		var t = K, n = g();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== fe && n.reject(e);
			}).finally(et);
		} catch (e) {
			n.reject(e), et();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = tt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(rt);
			else for (let e of c.values()) e.reject(rt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== rt && (r.activate(), t ? (o.f |= ae, Nt(o, t)) : (o.f & 8388608 && (o.f ^= ae), Nt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), tn(() => {
		for (let e of c) e.reject(rt);
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
function at(e) {
	let t = /* @__PURE__ */ nt(e);
	return wn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ot(e) {
	let t = /* @__PURE__ */ nt(e);
	return t.equals = Ce, t;
}
function st(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) H(t[n]);
	}
}
function ct(e) {
	var n, r = K, i = e.parent;
	if (!Sn && i !== null && e.v !== t && i.f & 24576) return pe(), e.v;
	q(i);
	try {
		st(e), n = Nn(e);
	} finally {
		q(r);
	}
	return n;
}
function lt(e) {
	var t = ct(e);
	if (!e.equals(t) && (e.wv = An(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), pt?.capture(e, t, !0)), e.deps === null))) {
		j(e, _);
		return;
	}
	Sn || (N === null ? Ye(e) : (en() || M?.is_fork) && N.set(e, t));
}
function ut(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Ze(() => {
		t.ac.abort(fe), t.ac = null;
	}), t.fn !== null && (t.teardown = m), In(t, 0), dn(t));
}
function dt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Ln(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var ft = null, M = null, pt = null, N = null, mt = null, ht = !1, gt = !1, _t = null, vt = null, yt = 0, bt = 1, xt = class e {
	id = bt++;
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
		ft === null ? ft = this : (ft.#n = this, this.#t = ft), ft = this;
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
			for (var r of n.d) j(r, v), t(r);
			for (r of n.m) j(r, y), t(r);
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
					t.f ^= _;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), j(e, v), this.schedule(e);
		for (let e of this.#d) j(e, y), this.schedule(e);
		this.apply();
		for (var t = _t = [], n = [], r = vt = []; this.#c.length > 0;) {
			yt++ > 1e3 && (this.#S(), St());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Et(e), this.#h() || this.discard(), t;
			}
		}
		if (M = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (_t = null, vt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Tt(e, t);
			r.length > 0 && M.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), pt = this, Ct(n), Ct(t), pt = null, this.#s?.resolve();
		var o = M;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (F.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : jn(r) && (i & 16 && this.#d.add(r), Ln(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), j(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), M = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) Xe(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), N?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, N = null;
	}
	flush() {
		try {
			gt = !0, M = this, this.#_();
		} finally {
			yt = 0, mt = null, _t = null, vt = null, gt = !1, M = null, N = null, F.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(rt);
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
		this.#m || (this.#m = !0, qe(() => {
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
		return (this.#s ??= g()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!gt && qe(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		N = null;
	}
	schedule(e) {
		if (mt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? ft = e : t.#t = e, this.linked = !1;
		}
	}
};
function St() {
	try {
		Oe();
	} catch (e) {
		B(e, mt);
	}
}
var P = null;
function Ct(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && jn(r) && (P = /* @__PURE__ */ new Set(), Ln(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && mn(r), P?.size > 0)) {
				F.clear();
				for (let e of P) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) P.has(n) && (P.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Ln(n);
					}
				}
				P.clear();
			}
		}
		P = null;
	}
}
function wt(e) {
	M.schedule(e);
}
function Tt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), j(e, _);
		for (var n = e.first; n !== null;) Tt(n, t), n = n.next;
	}
}
function Et(e) {
	j(e, _);
	for (var t = e.first; t !== null;) Et(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Dt = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Map(), Ot = !1;
function kt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: xe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t) {
	let n = kt(e, t);
	return wn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function At(e, t = !1, n = !0) {
	let r = kt(e);
	return t || (r.equals = Ce), r;
}
function L(e, t, n = !1) {
	return U !== null && (!W || U.f & 131072) && We() && U.f & 4325394 && (J === null || !J.has(e)) && je(), Nt(e, n ? Lt(t) : t, vt);
}
var jt = null, Mt = 0;
function Nt(e, t, n = null) {
	if (!e.equals(t)) {
		Sn ? F.set(e, t) : F.has(e) || F.set(e, e.v);
		var r = xt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ct(t), N === null && Ye(t);
		}
		e.wv = An(), jt = null, Mt = 0, It(e, v, n), jt = null, We() && K !== null && K.f & 1024 && !(K.f & 96) && (Z === null ? Tn([e]) : Z.push(e)), !r.is_fork && Dt.size > 0 && !Ot && Pt();
	}
	return t;
}
function Pt() {
	Ot = !1;
	for (let e of Dt) {
		e.f & 1024 && j(e, y);
		let t;
		try {
			t = jn(e);
		} catch {
			t = !0;
		}
		t && Ln(e);
	}
	Dt.clear();
}
function Ft(e) {
	L(e, e.v + 1);
}
function It(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = We(), a = r.length;
		if (Mt += a, Mt > 1e5 && jt === null && (jt = /* @__PURE__ */ new Set()), jt !== null) {
			if (jt.has(e)) return;
			jt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== K) {
				var l = (c & v) === 0;
				if (l && j(s, t), c & 131072) Dt.add(s);
				else if (c & 2) {
					var u = s;
					N?.delete(u), It(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && P !== null && P.add(d), n === null ? wt(d) : n.push(d);
				}
			}
		}
	}
}
function Lt(e) {
	if (typeof e != "object" || !e || T in e || oe in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ I(0), c = null, f = On, p = (e) => {
		if (On === f) return e();
		var t = U, n = On;
		G(null), kn(f);
		var r = e();
		return G(t), kn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ I(e.length, c)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ke();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ I(n.value, c);
				return i.set(t, e), e;
			}) : L(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ I(t, c));
					i.set(n, e), Ft(o);
				}
			} else L(r, t), Ft(o);
			return !0;
		},
		get(n, r, a) {
			if (r === T) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || s(n, r)?.writable) && (o = p(() => /* @__PURE__ */ I(Lt(l ? n[r] : t), c)), i.set(r, o)), o !== void 0) {
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
			if (n === T) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || K !== null && (!a || s(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ I(a ? Lt(e[n]) : t, c)), i.set(n, r)), Q(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ I(t, c)), i.set(f + "", m)) : L(m, t);
			}
			if (u === void 0) (!d || s(e, n)?.writable) && (u = p(() => /* @__PURE__ */ I(void 0, c)), L(u, Lt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Lt(r));
				L(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && L(_, v + 1);
				}
				Ft(o);
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
			Ae();
		}
	});
}
var Rt, zt, Bt, Vt;
function Ht() {
	if (Rt === void 0) {
		Rt = window, zt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Bt = s(t, "firstChild").get, Vt = s(t, "nextSibling").get, f(e) && (e[le] = void 0, e[ce] = null, e[ue] = void 0, e.__e = void 0), f(n) && (n[de] = void 0);
	}
}
function R(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Ut(e) {
	return Bt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Wt(e) {
	return Vt.call(e);
}
function z(e, t) {
	if (!E) return /* @__PURE__ */ Ut(e);
	var n = /* @__PURE__ */ Ut(D);
	if (n === null) n = D.appendChild(R());
	else if (t && n.nodeType !== 3) {
		var r = R();
		return n?.before(r), O(r), r;
	}
	return t && Xt(n), O(n), n;
}
function Gt(e, t = !1) {
	if (!E) return /* @__PURE__ */ Ut(e);
	var n = z(e, t);
	return k(e), n;
}
function Kt(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Wt(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = R();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		Xt(r);
	}
	return O(r), r;
}
function qt(e) {
	e.textContent = "";
}
function Jt() {
	return !1;
}
function Yt(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Xt(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Zt(e) {
	var t = K;
	if (t === null) return U.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	B(e, t);
}
function B(e, t) {
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
function Qt(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function $t(e, t) {
	var n = K;
	n !== null && n.f & 8192 && (e |= b);
	var r = {
		ctx: A,
		deps: null,
		nodes: null,
		f: e | v | 512,
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
	M?.register_created_effect(r);
	var i = r;
	if (e & 4) _t === null ? xt.ensure().schedule(r) : _t.push(r);
	else if (t !== null) {
		try {
			Ln(r);
		} catch (e) {
			throw H(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && Qt(i, n), U !== null && U.f & 2 && !(e & 64))) {
		var a = U;
		(a.effects ??= []).push(i);
	}
	return r;
}
function en() {
	return U !== null && !W;
}
function tn(e) {
	let t = $t(8, null);
	return j(t, _), t.teardown = e, t;
}
function nn(e) {
	return $t(4 | te, e);
}
function rn(e) {
	xt.ensure();
	let t = $t(64 | w, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? hn(t, () => {
			H(t), n(void 0);
		}) : (H(t), n(void 0));
	});
}
function an(e) {
	return $t(4, e);
}
function on(e) {
	return $t(ie | w, e);
}
function sn(e, t = 0) {
	return $t(8 | t, e);
}
function cn(e, t = [], n = [], r = []) {
	Qe(r, t, n, (t) => {
		$t(8, () => {
			e(...t.map(Q));
		});
	});
}
function ln(e, t = 0) {
	return $t(16 | t, e);
}
function V(e) {
	return $t(32 | w, e);
}
function un(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Sn, r = U;
		Cn(!0), G(null);
		try {
			t.call(null);
		} catch (t) {
			B(t, e.parent);
		} finally {
			Cn(n), G(r);
		}
	}
}
function dn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Ze(() => {
			e.abort(fe);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (pn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, dn(e, t && !n), In(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	un(e), e.f ^= ee, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function pn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Wt(e);
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
		e.f ^= b;
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
		e.f ^= b, e.f & 1024 || (j(e, v), xt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ Wt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var bn = null, xn = !1, Sn = !1;
function Cn(e) {
	Sn = e;
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
function wn(e) {
	U !== null && (U.f & 2097152 || U.f & 2) && (J ??= /* @__PURE__ */ new Set()).add(e);
}
var Y = null, X = 0, Z = null;
function Tn(e) {
	Z = e;
}
var En = 1, Dn = 0, On = Dn;
function kn(e) {
	On = e;
}
function An() {
	return ++En;
}
function jn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (jn(a) && lt(a), a.wv > e.wv) return !0;
		}
		t & 512 && N === null && j(e, _);
	}
	return !1;
}
function Mn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(J !== null && J.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Mn(a, t, !1) : t === a && (n ? j(a, v) : a.f & 1024 && j(a, y), wt(a));
	}
}
function Nn(e) {
	var t = Y, n = X, r = Z, i = U, a = J, o = A, s = W, c = On, l = e.f;
	Y = null, X = 0, Z = null, U = l & 96 ? null : e, J = null, Ie(e.ctx), W = !1, On = ++Dn, e.ac !== null && (Ze(() => {
		e.ac.abort(fe);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= S;
		var f = Pn(e);
		if (We() && Z !== null && !W && f !== null && !(e.f & 6146)) for (var p = 0; p < Z.length; p++) Mn(Z[p], e);
		if (i !== null && i !== e) {
			if (Dn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Dn;
			if (t !== null) for (let e of t) e.rv = Dn;
			Z !== null && (r === null ? r = Z : r.push(...Z));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return Pn(e), Zt(t);
	} finally {
		e.f ^= re, Y = t, X = n, Z = r, U = i, J = a, Ie(o), W = s, On = c;
	}
}
function Pn(e) {
	var t = e.deps, n = M?.is_fork;
	if (Y !== null) {
		var r;
		if (n || In(e, X), t !== null && X > 0) for (t.length = X + Y.length, r = 0; r < Y.length; r++) t[X + r] = Y[r];
		else e.deps = t = Y;
		if (en() && e.f & 512) for (r = X; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && X < t.length && (In(e, X), t.length = X);
	return t;
}
function Fn(e, n) {
	let a = n.reactions;
	if (a !== null) {
		var o = r.call(a, e);
		if (o !== -1) {
			var s = a.length - 1;
			s === 0 ? a = n.reactions = null : (a[o] = a[s], a.pop());
		}
	}
	if (a === null && n.f & 2 && (Y === null || !i.call(Y, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && Ye(c), c.ac !== null && Ze(() => {
			c.ac.abort(fe), c.ac = null, j(c, v);
		}), ut(c), In(c, 0);
	}
}
function In(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Fn(e, n[r]);
}
function Ln(e) {
	var t = e.f;
	if (!(t & 16384)) {
		j(e, _);
		var n = K, r = xn;
		K = e, xn = !(t & 96);
		try {
			t & 16777232 ? fn(e) : dn(e), un(e);
			var i = Nn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = En;
		} finally {
			xn = r, K = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if (bn?.add(e), U !== null && !W && !(K !== null && K.f & 16384) && (J === null || !J.has(e))) {
		var n = U.deps;
		if (U.f & 2097152) e.rv < Dn && (e.rv = Dn, Y === null && n !== null && n[X] === e ? X++ : Y === null ? Y = [e] : Y.push(e));
		else {
			U.deps ??= [], i.call(U.deps, e) || U.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [U] : i.call(r, U) || r.push(U);
		}
	}
	if (Sn && F.has(e)) return F.get(e);
	if (t) {
		var a = e;
		if (Sn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || zn(a)) && (o = ct(a)), F.set(a, o), o;
		}
		var s = !(a.f & 512) && !W && U !== null && (xn || !!(U.f & 512)), c = (a.f & S) === 0;
		jn(a) && (s && (a.f |= 512), lt(a)), s && !c && (dt(a), Rn(a));
	}
	if (N?.has(e)) return N.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Rn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (dt(t), Rn(t));
}
function zn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (F.has(t) || t.f & 2 && zn(t)) return !0;
	return !1;
}
function Bn(e) {
	var t = W;
	try {
		return W = !0, e();
	} finally {
		W = t;
	}
}
function Vn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (T in e) Hn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && T in n && Hn(n);
		}
	}
}
function Hn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Hn(e[n], t);
		} catch {}
		let n = d(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = c(n);
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
var Un = Symbol("events"), Wn = /* @__PURE__ */ new Set(), Gn = /* @__PURE__ */ new Set();
function Kn(e, t, n) {
	(t[Un] ??= {})[e] = n;
}
function $(e) {
	for (var t = 0; t < e.length; t++) Wn.add(e[t]);
	for (var n of Gn) n(e);
}
var qn = null, Jn = !1;
function Yn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	qn = e, Jn || (Jn = !0, setTimeout(() => {
		Jn = !1, qn = null;
	}));
	var s = 0, c = qn === e && e[Un];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Un] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (a = i[s] || e.target, a !== t) {
		o(e, "currentTarget", {
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
					var h = a[Un]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, a = s < i.length ? i[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[Un] = t, delete e.currentTarget, G(d), q(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var Xn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Zn(e) {
	return Xn?.createHTML(e) ?? e;
}
function Qn(e) {
	var t = Yt("template");
	return t.innerHTML = Zn(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function $n(e, t) {
	var n = K;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function er(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (E) return $n(D, null), D;
		i === void 0 && (i = Qn(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Ut(i)));
		var t = r || zt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Ut(t), s = t.lastChild;
			$n(o, s);
		} else $n(t, t);
		return t;
	};
}
function tr(e, t) {
	if (E) {
		var n = K;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), _e();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var nr = ["touchstart", "touchmove"];
function rr(e) {
	return nr.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function ir(e) {
	let t = 0, n = kt(0), r;
	return () => {
		en() && (Q(n), sn(() => (t === 0 && (r = Bn(() => e(() => Ft(n)))), t += 1, () => {
			qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Ft(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ar = C | w;
function or(e, t, n, r) {
	new sr(e, t, n, r);
}
var sr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
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
	#h = ir(() => (this.#m = kt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = K;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = K.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = ln(() => {
			if (E) {
				let e = this.#t;
				_e();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ar), E && (this.#e = D);
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
		qe(r), t && (this.#s = V(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				he();
				return;
			}
			t = !0, n && Me(), this.#s !== null && hn(this.#s, () => {
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
					B(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = V(() => e(this.#e)), qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = R(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return V(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						B(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(M);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, hn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = V(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				yn(this.#a, e);
				let t = this.#n.pending;
				this.#o = V(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		Xe(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = K, n = U, r = A;
		q(this.#i), G(this.#i), Ie(this.#i.ctx);
		try {
			return xt.ensure(), e();
		} finally {
			q(t), G(n), Ie(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && hn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, qe(() => {
			this.#d = !1, this.#m && Nt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (H(this.#a), null), this.#o &&= (H(this.#o), null), this.#s &&= (H(this.#s), null), E && (O(this.#t), ve(), O(ye()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return V(() => {
						var r = K;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return B(e, this.#i.parent), null;
				}
			}));
		};
		qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				B(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => B(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function cr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[de] ??= e.nodeValue) && (e[de] = n, e.nodeValue = `${n}`);
}
function lr(e, t) {
	return dr(e, t);
}
var ur = /* @__PURE__ */ new Map();
function dr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Ht();
	var u = void 0, d = rn(() => {
		var c = r ?? n.appendChild(R());
		or(c, { pending: () => {} }, (n) => {
			Ve({});
			var r = A;
			if (s && (r.c = s), o && (i.$$events = o), E && $n(n, null), u = t(n, i) || Ue(), E && (K.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw me(), e;
			He();
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
						o === void 0 ? (e.addEventListener(r, Yn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(Wn)), Gn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = ur.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Yn), t.delete(e), t.size === 0 && ur.delete(r)) : t.set(e, i);
			}
			Gn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return fr.set(u, d), u;
}
var fr = /* @__PURE__ */ new WeakMap();
function pr(e, t) {
	let n = fr.get(e);
	return n ? (fr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
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
						yn(r, t), t.append(R()), this.#n.set(e, {
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
		var n = M, r = Jt();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = R();
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
		} else E && (this.anchor = D), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function hr(e, t, n = !1) {
	var r;
	E && (r = D, _e());
	var i = new mr(e), a = n ? C : 0;
	function o(e, t) {
		if (E) {
			var n = be(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ye();
				O(a), i.anchor = a, ge(!1), i.ensure(e, t), ge(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	ln(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function gr(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		hn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					_r(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			qt(d), d.append(u), e.items.clear();
		}
		_r(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function _r(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, yn(a, document.createDocumentFragment())) : H(t[i], n);
	}
}
var vr;
function yr(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = E ? O(/* @__PURE__ */ Ut(u)) : u.appendChild(R());
	}
	E && _e();
	var d = null, f = /* @__PURE__ */ ot(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, xr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, Cr(d, null, c)) : _n(d) : hn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: ln(() => {
			p = Q(f);
			var e = p.length;
			let n = !1;
			E && be(c) === "[!" != (e === 0) && (c = ye(), O(c), ge(!1), n = !0);
			for (var a = /* @__PURE__ */ new Set(), u = M, v = Jt(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (c = D, n = !0, ge(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && Nt(S.v, b), S.i && Nt(S.i, y), v && u.unskip_effect(S.e)) : (S = Sr(l, h ? c : vr ??= R(), b, x, y, o, t, r), h || (S.e.f |= ne), l.set(x, S)), a.add(x);
			}
			if (e === 0 && s && !d && (h ? d = V(() => s(c)) : (d = V(() => s(vr ??= R())), d.f |= ne)), e > a.size && De("", "", ""), E && e > 0 && O(ye()), !h) {
				if (m.set(u, a), v) {
					for (let [e, t] of l) a.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			n && ge(!0), Q(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, E && (c = D);
}
function br(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function xr(e, t, n, r, i) {
	var o = !!(r & 8), s = t.length, c = e.items, l = br(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (_n(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) Cr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), wr(e, d, _), wr(e, _, y), Cr(_, y, n), d = _, p = [], m = [], l = br(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Cr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					wr(e, S.prev, ee.next), wr(e, d, S), wr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Cr(_, l, n), wr(e, _.prev, _.next), wr(e, _, d === null ? e.effect.first : d.next), wr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = br(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = br(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (_r(e, a(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = br(l.next);
		var w = C.length;
		if (w > 0) {
			var te = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.fix();
			}
			gr(e, C, te);
		}
	}
	o && qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Sr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? kt(n) : /* @__PURE__ */ At(n, !1, !1) : null, l = o & 2 ? kt(i) : null;
	return {
		v: c,
		i: l,
		e: V(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Cr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Wt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function wr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Tr(e, t, n) {
	var r;
	E && (r = D, _e());
	var i = new mr(e);
	ln(() => {
		var e = t() ?? null;
		if (E && be(r) === "[" != (e !== null)) {
			var a = ye();
			O(a), i.anchor = a, ge(!1), i.ensure(e, e && ((t) => n(t, e))), ge(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Er(e, t, n) {
	an(() => {
		var r = Bn(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			sn(() => {
				var e = n();
				Vn(e), i && Se(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function Dr(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), m;
	let r = Bn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var Or = [];
function kr(e, t = m) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Se(e, t) && (e = t, n)) {
			let t = !Or.length;
			for (let t of r) t[1](), Or.push(t, e);
			if (t) {
				for (let e = 0; e < Or.length; e += 2) Or[e][0](Or[e + 1]);
				Or.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = m) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || m), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Ar(e) {
	let t;
	return Dr(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var jr = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (p(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			p(i) && (i = i());
			let a = s(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (p(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = s(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === T || t === se) return !1;
		for (let n of e.props) if (p(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (p(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function Mr(...e) {
	return new Proxy({ props: e }, jr);
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
var Nr = {
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
function Pr(e) {
	let t = e.trim(), n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
	if (!n) throw Error(`Invalid ISO date: ${e}`);
	let [, r, i, a] = n;
	return new Date(Date.UTC(Number(r), Number(i) - 1, Number(a), 12));
}
function Fr(e) {
	return `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function Ir(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function Lr(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function Rr(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function zr(e, t) {
	return Rr(e, t * 7);
}
function Br(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function Vr(e, t) {
	return e.getTime() < t.getTime();
}
function Hr(e) {
	return Fr(Lr(Pr(e)));
}
function Ur(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var Wr = class {
	normalizeTermStartDate(e, t) {
		let n = Pr(Hr(t));
		if (!e || !e.trim()) return Fr(Lr(n));
		try {
			return Fr(Lr(Pr(e)));
		} catch {
			return Fr(Lr(this.inferTermStartDateFromTermName(e) || n));
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
		}, r = Pr(this.normalizeTermStartDate(n.termStartDate, e)), i = Pr(e);
		if (Vr(i, r)) return n.startWeek;
		let a = Br(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return Fr(zr(Pr(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return Fr(Rr(Pr(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
//#endregion
//#region packages/core/src/algorithms/holiday-calendar.ts
function Gr(e) {
	let { holidayCalendar: t, ...n } = e;
	return n;
}
async function Kr(e) {
	let t = await e.listTimetables(), n = 0;
	for (let r of t) {
		let t = await e.getTimetable(r.id);
		if (!t?.academicConfig.holidayCalendar) continue;
		let i = {
			...t,
			academicConfig: Gr(t.academicConfig),
			updatedAt: Date.now()
		};
		await e.saveTimetable(i), n += 1;
	}
	return n;
}
function qr(e, t = Ur()) {
	let n = new Wr(), r = Pr(n.resolveWeekStart(e, e.startWeek, t)), i = Rr(Pr(n.resolveWeekStart(e, e.endWeek, t)), 6);
	return {
		startDate: Fr(r),
		endDate: Fr(i)
	};
}
function Jr(e, t, n = Ur()) {
	let { startDate: r, endDate: i } = qr(t, n);
	return e.filter((e) => e.date >= r && e.date <= i);
}
function Yr(e, t = Ur()) {
	let { startDate: n, endDate: r } = qr(e, t), i = Number.parseInt(n.slice(0, 4), 10), a = Number.parseInt(r.slice(0, 4), 10), o = /* @__PURE__ */ new Set();
	for (let e = i; e <= a; e += 1) o.add(e);
	return o.size === 0 && o.add(Number.parseInt(t.slice(0, 4), 10)), [...o].sort((e, t) => e - t);
}
.2126 * Xr(15 / 255) + .7152 * Xr(23 / 255) + .0722 * Xr(42 / 255);
function Xr(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/types/services.ts
function Zr(e) {
	return { key: e };
}
var Qr = Zr("http"), $r = Zr("storage");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function ei(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/mountable.ts
var ti = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function ni(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function ri() {
	return "1.1.1";
}
function ii(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? ni(e.messages, e.nameKey),
		version: e.version ?? ri(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? ni(e.messages, e.descriptionKey) : void 0,
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
function ai(e) {
	let t, n = ir((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return en() ? (n(), t) : Ar(e);
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
//#region packages/ui-kit/src/components/SegmentedControl.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), $(["input"]), $(["change"]), $(["change"]), $(["change"]), $([
	"click",
	"pointerdown",
	"pointerup"
]), $(["change"]), Nr.hapticFeedbackEnabled, $(["click"]), $(["click"]), $(["click", "keydown"]);
//#endregion
//#region packages/ui-kit/src/motion/motion.ts
var oi = Nr.reduceMotionEnabled;
function si() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !1;
		let e = localStorage.getItem(oi);
		return e === "1" || e === "true";
	} catch {
		return !1;
	}
}
function ci() {
	if (typeof window > "u") return !1;
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
}
function li() {
	return si() || ci();
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
$(["pointerdown"]), $(["keydown", "click"]), $(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ui, di] = Le();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
$(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var fi = /* @__PURE__ */ er("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function pi(e, t) {
	Ve(t, !0);
	let n = /* @__PURE__ */ at(() => t.component), r = /* @__PURE__ */ at(() => ai(t.propsStore).current);
	var i = fi();
	Tr(z(i), () => Q(n), (e, t) => {
		t(e, Mr(() => Q(r)));
	}), k(i), tr(e, i), He();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function mi(e) {
	return {
		[ti]: !0,
		mount(t, n, r) {
			let i = kr({ ...n }), a = lr(pi, {
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
					pr(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function hi(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return ei(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? ei(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var gi = 900, _i = 24, vi = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function yi(e) {
	return vi.has(e) ? !0 : e.startsWith("max-w-");
}
function bi(e) {
	let t = [], n = [];
	for (let r of e) yi(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function xi(e, t, n, r = _i) {
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
function Si(e, t) {
	if (!t.visible) {
		e.style.display = "none";
		return;
	}
	e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`;
}
function Ci(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = bi(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Si(a, xi(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, gi);
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
//#region packages/ui-kit/src/actions/scroll-rubber-band.ts
var wi = 120, Ti = 220, Ei = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
function Di(e, t = wi) {
	return e === 0 ? 0 : Math.sign(e) * (t * (1 - Math.exp(-Math.abs(e) / t)));
}
function Oi(e) {
	return e.scrollTop <= 0;
}
function ki(e) {
	return Math.max(0, e.scrollHeight - e.clientHeight);
}
function Ai(e) {
	let t = ki(e);
	return t <= 0 || e.scrollTop >= t - 1;
}
function ji(e, t, n, r, i) {
	if (i) return 0;
	if (e !== 0) {
		let i = e + t;
		return i > 0 && !n && (i = 0), i < 0 && !r && (i = 0), i;
	}
	return n && t > 0 || r && t < 0 ? t : 0;
}
function Mi() {
	return typeof window < "u" && !li();
}
function Ni(e) {
	let t = 0, n = 0, r = 0, i, a = () => {
		i !== void 0 && (clearTimeout(i), i = void 0), e.style.transition = "";
	}, o = (t) => {
		if (a(), !t) {
			e.style.transform = "";
			return;
		}
		e.style.transition = `transform ${Ti}ms ${Ei}`, e.style.transform = "", i = setTimeout(() => {
			e.style.transition = "", i = void 0;
		}, 252);
	}, s = () => {
		let t = Di(r);
		e.style.transform = t === 0 ? "" : `translate3d(0, ${t}px, 0)`;
	}, c = (i) => {
		i.touches.length === 1 && (a(), t = i.touches[0].clientY, n = e.scrollTop, r = 0);
	}, l = (i) => {
		if (i.touches.length !== 1) return;
		let a = i.touches[0].clientY, o = a - t;
		t = a;
		let c = e.scrollTop, l = c !== n;
		n = c;
		let u = ji(r, o, Oi(e), Ai(e), l);
		if (u !== r || u !== 0) {
			if (r = u, r === 0) {
				e.style.transform = "";
				return;
			}
			s();
		}
	}, u = () => {
		r !== 0 && (r = 0, o(!0));
	};
	return e.addEventListener("touchstart", c, { passive: !0 }), e.addEventListener("touchmove", l, { passive: !0 }), e.addEventListener("touchend", u, { passive: !0 }), e.addEventListener("touchcancel", u, { passive: !0 }), { destroy() {
		e.removeEventListener("touchstart", c), e.removeEventListener("touchmove", l), e.removeEventListener("touchend", u), e.removeEventListener("touchcancel", u), a(), e.style.transform = "";
	} };
}
function Pi(e, t = !0) {
	let n = null, r = (t) => {
		if (t && Mi()) {
			n ||= Ni(e);
			return;
		}
		n?.destroy(), n = null;
	};
	return r(t), {
		update(e) {
			r(e);
		},
		destroy() {
			n?.destroy(), n = null;
		}
	};
}
//#endregion
//#region packages/ui-kit/src/actions/app-scroll.ts
function Fi(e) {
	let t = Ci(e), n = Pi(e);
	return { destroy() {
		t.destroy(), n.destroy();
	} };
}
//#endregion
//#region packages/plugins/calendar-holidays/src/messages.ts
var Ii = {
	"zh-cn": {
		"plugin.name": "法定节假日",
		"plugin.description": "在课表中展示法定节假日",
		"mine.title": "法定节假日",
		"mine.keywords": "节假日,假期,放假,国庆,春节,holiday",
		"screen.title": "法定节假日",
		"screen.intro.body": "安装后自动同步国务院公布的放假安排，并在课表标注。仅标记放假，不包含调休补班。",
		"screen.intro.source": "数据来源：holiday-cn",
		"screen.sync.action": "同步",
		"screen.sync.resync": "重新同步",
		"screen.sync.syncing": "同步中…",
		"screen.sync.last": "上次同步：{time}",
		"screen.sync.never": "尚未同步",
		"screen.list.row": "{date} · {label} · {weekday}",
		"screen.list.heading": "本学期假期",
		"screen.list.empty": "本学期暂无法定节假日",
		"screen.list.emptyHint": "同步后，课表将标注法定放假日",
		"screen.error.noTimetable": "请先选择或创建课表",
		"screen.error.syncFailed": "同步失败，请检查网络后重试",
		"screen.sync.source.bundled": "使用内置离线数据：{years}",
		"screen.sync.source.cached": "网络数据暂不可用，沿用已有数据：{years}",
		"screen.sync.source.unavailable": "暂无可用数据：{years}",
		"screen.notify.synced": "法定节假日已同步"
	},
	en: {
		"plugin.name": "Public Holidays",
		"plugin.description": "Show public holidays on the timetable",
		"mine.title": "Public Holidays",
		"mine.keywords": "holiday,vacation,national day,spring festival",
		"screen.title": "Public Holidays",
		"screen.intro.body": "Automatically syncs official public holiday schedules on install and marks them on your timetable. Only rest days are marked; makeup workdays are excluded.",
		"screen.intro.source": "Data source: holiday-cn",
		"screen.sync.action": "Sync",
		"screen.sync.resync": "Resync",
		"screen.sync.syncing": "Syncing…",
		"screen.sync.last": "Last sync: {time}",
		"screen.sync.never": "Not synced yet",
		"screen.list.row": "{date} · {label} · {weekday}",
		"screen.list.heading": "Holidays this term",
		"screen.list.empty": "No public holidays in this term",
		"screen.list.emptyHint": "After syncing, holidays will appear on your timetable",
		"screen.error.noTimetable": "Select or create a timetable first",
		"screen.error.syncFailed": "Sync failed. Check your network and try again.",
		"screen.sync.source.bundled": "Using bundled offline data: {years}",
		"screen.sync.source.cached": "Online data unavailable; keeping saved data: {years}",
		"screen.sync.source.unavailable": "No data available: {years}",
		"screen.notify.synced": "Public holidays synced"
	}
}, Li = "tool-calendar-holidays", Ri = "https://fastly.jsdelivr.net/gh/NateScarlet/holiday-cn@master", zi = {
	2025: {
		$schema: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/schema.json",
		$id: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/2025.json",
		year: 2025,
		papers: ["https://www.gov.cn/zhengce/zhengceku/202411/content_6986383.htm"],
		days: [
			{
				name: "元旦",
				date: "2025-01-01",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-01-26",
				isOffDay: !1
			},
			{
				name: "春节",
				date: "2025-01-28",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-01-29",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-01-30",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-01-31",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-02-01",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-02-02",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-02-03",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-02-04",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2025-02-08",
				isOffDay: !1
			},
			{
				name: "清明节",
				date: "2025-04-04",
				isOffDay: !0
			},
			{
				name: "清明节",
				date: "2025-04-05",
				isOffDay: !0
			},
			{
				name: "清明节",
				date: "2025-04-06",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2025-04-27",
				isOffDay: !1
			},
			{
				name: "劳动节",
				date: "2025-05-01",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2025-05-02",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2025-05-03",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2025-05-04",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2025-05-05",
				isOffDay: !0
			},
			{
				name: "端午节",
				date: "2025-05-31",
				isOffDay: !0
			},
			{
				name: "端午节",
				date: "2025-06-01",
				isOffDay: !0
			},
			{
				name: "端午节",
				date: "2025-06-02",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-09-28",
				isOffDay: !1
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-01",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-02",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-03",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-04",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-05",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-06",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-07",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-08",
				isOffDay: !0
			},
			{
				name: "国庆节、中秋节",
				date: "2025-10-11",
				isOffDay: !1
			}
		]
	},
	2026: {
		$schema: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/schema.json",
		$id: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/2026.json",
		year: 2026,
		papers: ["https://www.gov.cn/zhengce/zhengceku/202511/content_7047091.htm"],
		days: [
			{
				name: "元旦",
				date: "2026-01-01",
				isOffDay: !0
			},
			{
				name: "元旦",
				date: "2026-01-02",
				isOffDay: !0
			},
			{
				name: "元旦",
				date: "2026-01-03",
				isOffDay: !0
			},
			{
				name: "元旦",
				date: "2026-01-04",
				isOffDay: !1
			},
			{
				name: "春节",
				date: "2026-02-14",
				isOffDay: !1
			},
			{
				name: "春节",
				date: "2026-02-15",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-16",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-17",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-18",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-19",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-20",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-21",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-22",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-23",
				isOffDay: !0
			},
			{
				name: "春节",
				date: "2026-02-28",
				isOffDay: !1
			},
			{
				name: "清明节",
				date: "2026-04-04",
				isOffDay: !0
			},
			{
				name: "清明节",
				date: "2026-04-05",
				isOffDay: !0
			},
			{
				name: "清明节",
				date: "2026-04-06",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2026-05-01",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2026-05-02",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2026-05-03",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2026-05-04",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2026-05-05",
				isOffDay: !0
			},
			{
				name: "劳动节",
				date: "2026-05-09",
				isOffDay: !1
			},
			{
				name: "端午节",
				date: "2026-06-19",
				isOffDay: !0
			},
			{
				name: "端午节",
				date: "2026-06-20",
				isOffDay: !0
			},
			{
				name: "端午节",
				date: "2026-06-21",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-09-20",
				isOffDay: !1
			},
			{
				name: "中秋节",
				date: "2026-09-25",
				isOffDay: !0
			},
			{
				name: "中秋节",
				date: "2026-09-26",
				isOffDay: !0
			},
			{
				name: "中秋节",
				date: "2026-09-27",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-01",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-02",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-03",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-04",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-05",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-06",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-07",
				isOffDay: !0
			},
			{
				name: "国庆节",
				date: "2026-10-10",
				isOffDay: !1
			}
		]
	},
	2027: {
		$schema: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/schema.json",
		$id: "https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/2027.json",
		year: 2027,
		papers: [],
		days: []
	}
};
function Bi(e) {
	return e.days.filter((e) => e.isOffDay).map((e) => ({
		date: e.date,
		label: e.name
	}));
}
async function Vi(e, t) {
	let n = `${Ri}/${t}.json`;
	try {
		let t = await e.request(n, {
			method: "GET",
			timeoutMs: 15e3
		});
		if (!t.ok) throw Error(`HTTP ${t.status}`);
		return {
			holidays: Bi(await t.json()),
			source: "remote"
		};
	} catch (e) {
		let n = zi[t];
		return n ? {
			holidays: Bi(n),
			source: "bundled"
		} : (console.warn(`[calendar-holidays] No holiday-cn data for ${t}`, e), {
			holidays: [],
			source: "unavailable"
		});
	}
}
async function Hi(e, t) {
	let n = await Promise.all(t.map((t) => Vi(e, t))), r = {}, i = {};
	return t.forEach((e, t) => {
		let a = n[t];
		r[e] = a.holidays, i[e] = a.source;
	}), {
		byYear: r,
		sourceByYear: i
	};
}
//#endregion
//#region packages/plugins/calendar-holidays/src/holiday-sync.ts
var Ui = /* @__PURE__ */ new Map(), Wi = 216e5;
async function Gi(e) {
	return Kr(e.service($r));
}
function Ki(e, t, n = Date.now()) {
	if (!e) return !0;
	let r = new Set(e.syncedYears ?? []);
	return t.some((t) => {
		let n = e.sourceByYear?.[t];
		return n && n !== "remote" || !r.has(t);
	}) ? !e.lastAttemptedAt || n - e.lastAttemptedAt >= Wi : !1;
}
async function qi(e, t = {}) {
	let n = e.state.currentTimetable;
	if (!n) throw Error("No active timetable");
	let r = n.id, i = Ui.get(r);
	if (i) return i;
	let a = Yi(e, r, n.academicConfig, t).finally(() => {
		Ui.delete(r);
	});
	return Ui.set(r, a), a;
}
async function Ji(e, t = {}) {
	return e.state.currentTimetable ? qi(e, t) : !1;
}
async function Yi(e, t, n, r) {
	let i = Yr(n), a = e.service($r), o = await a.getTimetable(t);
	if (!o) throw Error(`Timetable not found: ${t}`);
	if (!r.force && !Ki(o.academicConfig.holidayCalendar, i)) return !1;
	let s = await Hi(e.service(Qr), i), c = o.academicConfig.holidayCalendar, l = /* @__PURE__ */ new Set([...Object.keys(c?.sourceByYear ?? {}).map(Number), ...(c?.holidays ?? []).map((e) => Number(e.date.slice(0, 4)))]), u = { ...c?.sourceByYear }, d = /* @__PURE__ */ new Map();
	for (let e of c?.holidays ?? []) {
		let t = Number(e.date.slice(0, 4)), n = d.get(t) ?? [];
		n.push(e), d.set(t, n);
	}
	let f = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = s.sourceByYear[e];
		if (t === "unavailable") {
			u[e] = l.has(e) ? "cached" : "unavailable";
			continue;
		}
		u[e] = t, d.set(e, s.byYear[e]), t === "remote" && f.add(e);
	}
	let p = [...d.values()].flat().sort((e, t) => e.date.localeCompare(t.date)), m = i.some((e) => u[e] !== "unavailable"), h = Object.entries(u).filter(([, e]) => e === "remote").map(([e]) => Number(e)).sort((e, t) => e - t), g = {
		holidays: p,
		syncedAt: f.size > 0 ? Date.now() : c?.syncedAt,
		syncedYears: h,
		sourceByYear: u,
		lastAttemptedAt: Date.now()
	}, _ = {
		...o.academicConfig,
		holidayCalendar: g
	};
	if (e.state.currentTimetable?.id === t) await e.actions.saveCurrentTimetableDetails({ academicConfig: _ });
	else {
		let e = {
			...o,
			academicConfig: _,
			updatedAt: Date.now()
		};
		await a.saveTimetable(e);
	}
	if (!m) {
		let e = i.filter((e) => u[e] === "unavailable");
		throw Error(`No holiday data available for years: ${e.join(", ")}`);
	}
	return !0;
}
//#endregion
//#region packages/plugins/calendar-holidays/src/index.ts
function Xi(e = {}) {
	let { screenComponent: t } = e, n;
	return ii({
		id: Li,
		messages: Ii,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "tool",
		toolGroup: "utility",
		order: 45,
		author: "Chronos",
		homepage: "https://github.com/NateScarlet/holiday-cn",
		allowedDomains: ["fastly.jsdelivr.net", "raw.githubusercontent.com"],
		async apply(e, r) {
			n = e;
			let i = r("mine.keywords").split(",").map((e) => e.trim()).filter(Boolean);
			e.registerSlot("mine.item", {
				id: "holiday-calendar",
				sectionId: "data-sync",
				title: () => r("mine.title"),
				href: `/plugins/${Li}`,
				icon: "event",
				iconTone: "secondary",
				keywords: i,
				order: 25
			}), e.registerSlot("shell.route.screen", {
				id: Li,
				title: () => r("screen.title"),
				...t ? { component: t } : {}
			});
			try {
				await Ji(e);
			} catch {
				e.actions.notify(r("screen.error.syncFailed"), "warn");
			}
			e.on("timetable:switched", async () => {
				try {
					await Ji(e);
				} catch {}
			});
		},
		async dispose() {
			let e = n;
			n = void 0, e && await Gi(e);
		}
	});
}
//#endregion
//#region packages/plugins/calendar-holidays/src/HolidayCalendarScreen.svelte
var Zi = /* @__PURE__ */ er("<p class=\"text-body-small text-amber-700 dark:text-amber-300\"> </p>"), Qi = /* @__PURE__ */ er("<p class=\"text-body-medium py-6 text-center text-on-surface-variant\"> </p>"), $i = /* @__PURE__ */ er("<li class=\"py-3\"><span class=\"text-body-medium text-on-surface\"> </span></li>"), ea = /* @__PURE__ */ er("<ul class=\"divide-y divide-outline/10\"></ul>"), ta = /* @__PURE__ */ er("<div class=\"mt-3 flex flex-col gap-4\"></div>"), na = /* @__PURE__ */ er("<p class=\"text-body-small text-error\"> </p>"), ra = /* @__PURE__ */ er("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><div class=\"secondary-scroll min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]\"><section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack\"><p class=\"text-body-medium text-on-surface-variant\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button> <!> <div class=\"flex items-center justify-between gap-3\"><a class=\"text-body-small shrink-0 text-primary\" href=\"https://github.com/NateScarlet/holiday-cn\" target=\"_blank\" rel=\"noreferrer\"> </a> <p class=\"text-body-small text-right text-on-surface-variant\"> </p></div></div></section> <section class=\"ui-section-surface ui-section-surface--comfortable\"><h3 class=\"text-title-small text-on-surface\"> </h3> <!></section> <!></div></div></div>");
function ia(e, t) {
	Ve(t, !0);
	let n = /* @__PURE__ */ I(!1), r = /* @__PURE__ */ I(null), i = /* @__PURE__ */ at(() => t.controller.currentTimetable), a = /* @__PURE__ */ at(() => Q(i)?.academicConfig.holidayCalendar), o = /* @__PURE__ */ at(() => Q(i) && Q(a) ? Jr(Q(a).holidays, Q(i).academicConfig) : []), s = /* @__PURE__ */ at(() => f(Q(o))), c = /* @__PURE__ */ at(() => !!Q(a)?.syncedAt), l = /* @__PURE__ */ at(() => h(Q(a)?.sourceByYear)), u = {
		bundled: "screen.sync.source.bundled",
		cached: "screen.sync.source.cached",
		unavailable: "screen.sync.source.unavailable"
	};
	function d(e) {
		return hi(t.controller, Li, Ii, e);
	}
	function f(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) {
			let e = n.date.slice(0, 7), r = t.get(e) ?? [];
			r.push(n), t.set(e, r);
		}
		return [...t.entries()].map(([e, t]) => ({
			key: e,
			items: t
		}));
	}
	function p(e, t) {
		let n = /* @__PURE__ */ new Date(`${e.date}T12:00:00`), r = Ir(e.date), i = n.toLocaleDateString(t, { weekday: "short" });
		return d("screen.list.row").replace("{date}", r).replace("{label}", e.label).replace("{weekday}", i);
	}
	function m(e) {
		if (!e) return d("screen.sync.never");
		let t = new Date(e), n = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0"), a = String(t.getHours()).padStart(2, "0"), o = String(t.getMinutes()).padStart(2, "0"), s = Ir(`${n}-${r}-${i}`);
		return d("screen.sync.last").replace("{time}", `${s} ${a}:${o}`);
	}
	function h(e) {
		if (!e) return [];
		let t = [];
		for (let n of [
			"bundled",
			"cached",
			"unavailable"
		]) {
			let r = Object.entries(e).filter(([, e]) => e === n).map(([e]) => e).sort();
			r.length > 0 && t.push(d(u[n]).replace("{years}", r.join("、")));
		}
		return t;
	}
	async function g() {
		if (!Q(i)) {
			L(r, d("screen.error.noTimetable"), !0);
			return;
		}
		L(n, !0), L(r, null);
		try {
			let e = t.controller.getPluginContext(t.pluginId);
			await qi(e, { force: !0 }), e.actions.notify(d("screen.notify.synced"), "info");
		} catch (e) {
			L(r, e instanceof Error ? e.message : d("screen.error.syncFailed"), !0);
		} finally {
			L(n, !1);
		}
	}
	var _ = ra(), v = z(_), y = z(v), b = z(y), x = z(b), S = z(x), ee = Gt(S, !0), C = Kt(S, 2), w = Gt(C, !0), te = Kt(C, 2);
	yr(te, 16, () => Q(l), (e) => e, (e, t) => {
		var n = Zi(), r = Gt(n, !0);
		cn(() => cr(r, t)), tr(e, n);
	});
	var ne = Kt(te, 2), re = z(ne), ie = Gt(re, !0), ae = Gt(Kt(re, 2), !0);
	k(ne), k(x), k(b);
	var T = Kt(b, 2), oe = z(T), se = Gt(oe, !0), ce = Kt(oe, 2), le = (e) => {
		var t = Qi(), n = Gt(t, !0);
		cn((e) => cr(n, e), [() => Q(a)?.holidays.length ? d("screen.list.empty") : d("screen.list.emptyHint")]), tr(e, t);
	}, ue = (e) => {
		var n = ta();
		yr(n, 21, () => Q(s), (e) => e.key, (e, n) => {
			var r = ea();
			yr(r, 21, () => Q(n).items, (e) => e.date, (e, n) => {
				var r = $i(), i = Gt(z(r), !0);
				k(r), cn((e) => cr(i, e), [() => p(Q(n), t.controller.currentLocale)]), tr(e, r);
			}), k(r), tr(e, r);
		}), k(n), tr(e, n);
	};
	hr(ce, (e) => {
		Q(o).length === 0 ? e(le) : e(ue, -1);
	}), k(T);
	var de = Kt(T, 2), fe = (e) => {
		var t = na(), n = Gt(t, !0);
		cn(() => cr(n, Q(r))), tr(e, t);
	};
	hr(de, (e) => {
		Q(r) && e(fe);
	}), k(y), k(v), Er(v, (e) => Fi?.(e)), k(_), cn((e, t, r, a, o) => {
		cr(ee, e), C.disabled = Q(n) || !Q(i), cr(w, t), cr(ie, r), cr(ae, a), cr(se, o);
	}, [
		() => d("screen.intro.body"),
		() => Q(n) ? d("screen.sync.syncing") : Q(c) ? d("screen.sync.resync") : d("screen.sync.action"),
		() => d("screen.intro.source"),
		() => m(Q(a)?.syncedAt),
		() => d("screen.list.heading")
	]), Kn("click", C, g), tr(e, _), He();
}
$(["click"]);
//#endregion
//#region packages/plugins/calendar-holidays/bundle/entry.ts
var aa = Xi({ screenComponent: mi(ia) });
//#endregion
export { aa as default };
