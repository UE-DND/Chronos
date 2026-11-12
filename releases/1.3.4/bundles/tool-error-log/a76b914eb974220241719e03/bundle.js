// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/constants.js
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
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, C = 1 << 25, w = 65536, ee = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
function me() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function he(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ge() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function _e(e) {
	T = e;
}
var E;
function D(t) {
	if (t === null) throw he(), e;
	return E = t;
}
function ve() {
	return D(/* @__PURE__ */ Xt(E));
}
function O(t) {
	if (T) {
		if (/* @__PURE__ */ Xt(E) !== null) throw he(), e;
		E = t;
	}
}
function ye(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ Xt(n);
		E = n;
	}
}
function be(e = !0) {
	for (var t = 0, n = E;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ Xt(n);
		e && n.remove(), n = i;
	}
}
function xe(t) {
	if (!t || t.nodeType !== 8) throw he(), e;
	return t.data;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/equality.js
function Se(e) {
	return e === this.v;
}
function Ce(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function we(e) {
	return !Ce(e, this.v);
}
function Te(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Ee() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/errors.js
function De() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Oe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ke(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ae() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function je(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Me() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ne() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Pe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Fe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ie() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/shared/context.js
function Le(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Ee(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Re(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function ze(e, t) {
	return e === null && Te(t), e.c ??= new Map(Re(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/context.js
var k = null;
function Be(e) {
	k = e;
}
function Ve() {
	return Le(He, Ue, We);
}
function He(e) {
	return ze(k, "getContext").get(e);
}
function Ue(e, t) {
	return ze(k, "setContext").set(e, t), t;
}
function We(e) {
	return ze(k, "hasContext").has(e);
}
function Ge(e, t = !1, n) {
	k = {
		p: k,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: null
	};
}
function Ke(e) {
	var t = k, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) dn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, k = t.p, qe(e);
}
function qe(e = {}) {
	return o(e, se, { value: !0 }), e;
}
function Je() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], h(e);
}
function Ze(e) {
	if (Ye.length === 0 && !yt) {
		var t = Ye;
		queueMicrotask(() => {
			t === Ye && Xe();
		});
	}
	Ye.push(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/status.js
var Qe = ~(v | y | _);
function A(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? A(e, _) : A(e, y);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), A(e, _);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function tt(e) {
	var t = V, n = W;
	U(null), G(null);
	try {
		return e();
	} finally {
		U(t), G(n);
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/async.js
function nt(e, t, n, r) {
	let i = Je() ? ot : ut;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = rt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			it();
		}
	}
	var d = at();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ct(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), it());
	}) : f();
}
function rt() {
	var e = W, t = V, n = k, r = j;
	return function(i = !0) {
		G(e), U(t), Be(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function it(e = !0) {
	G(null), U(null), Be(null), e && j?.deactivate();
}
function at() {
	var e = W, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ot(e) {
	var n = 2 | v;
	return W !== null && (W.f |= ee), {
		ctx: k,
		deps: null,
		effects: null,
		equals: Se,
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
var st = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ct(e, n, r) {
	let i = W;
	i === null && De();
	var a = void 0, o = Pt(t), s = !V, c = /* @__PURE__ */ new Set();
	return mn(() => {
		var t = W, n = g();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== pe && n.reject(e);
			}).finally(it);
		} catch (e) {
			n.reject(e), it();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = at();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(st);
			else for (let e of c.values()) e.reject(st);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== st && (r.activate(), t ? (o.f |= ae, zt(o, t)) : (o.f & 8388608 && (o.f ^= ae), zt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), ln(() => {
		for (let e of c) e.reject(st);
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
function lt(e) {
	let t = /* @__PURE__ */ ot(e);
	return jn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ut(e) {
	let t = /* @__PURE__ */ ot(e);
	return t.equals = we, t;
}
function dt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function ft(e) {
	var n, r = W, i = e.parent;
	if (!kn && i !== null && e.v !== t && i.f & 24576) return me(), e.v;
	G(i);
	try {
		dt(e), n = Bn(e);
	} finally {
		G(r);
	}
	return n;
}
function pt(e) {
	var t = ft(e);
	!e.equals(t) && (e.wv = Ln(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), _t?.capture(e, t, !0)), e.deps === null)) ? A(e, _) : kn || (M === null ? $e(e) : (cn() || j?.is_fork) && M.set(e, t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && tt(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = m), Un(t, 0), yn(t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Wn(t);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/batch.js
var gt = null, j = null, _t = null, M = null, vt = null, yt = !1, bt = !1, xt = null, St = null, Ct = 0, wt = 1, Tt = class e {
	id = wt++;
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
		gt === null ? gt = this : (gt.#n = this, this.#t = gt), gt = this;
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
			for (var r of n.d) A(r, v), t(r);
			for (r of n.m) A(r, y), t(r);
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
		for (let e of this.#u) this.#d.delete(e), A(e, v), this.schedule(e);
		for (let e of this.#d) A(e, y), this.schedule(e);
		this.apply();
		for (var t = xt = [], n = [], r = St = []; this.#c.length > 0;) {
			Ct++ > 1e3 && (this.#S(), Et());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw jt(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (xt = null, St = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) At(e, t);
			r.length > 0 && j.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), _t = this, Ot(n), Ot(t), _t = null, this.#s?.resolve();
			var o = j;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (N.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : Rn(r) && (i & 16 && this.#d.add(r), Wn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), A(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), j = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
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
			bt = !0, j = this, this.#_();
		} finally {
			Ct = 0, vt = null, xt = null, St = null, bt = !1, j = null, M = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(st);
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
		this.#m || (this.#m = !0, Ze(() => {
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
		if (j === null) {
			let t = j = new e();
			!bt && Ze(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		vt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? gt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Et() {
	try {
		Me();
	} catch (e) {
		R(e, vt);
	}
}
var Dt = null;
function Ot(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Rn(r) && (Dt = /* @__PURE__ */ new Set(), Wn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Sn(r), Dt?.size > 0)) {
				N.clear();
				for (let e of Dt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Dt.has(n) && (Dt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Wn(n);
					}
				}
				Dt.clear();
			}
		}
		Dt = null;
	}
}
function kt(e) {
	j.schedule(e);
}
function At(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, _);
		for (var n = e.first; n !== null;) At(n, t), n = n.next;
	}
}
function jt(e) {
	A(e, _);
	for (var t = e.first; t !== null;) jt(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/sources.js
var Mt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), Nt = !1;
function Pt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Se,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ft(e, t) {
	let n = Pt(e, t);
	return jn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function It(e, t = !1, n = !0) {
	let r = Pt(e);
	return t || (r.equals = we), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && Je() && V.f & 4325394 && (K === null || !K.has(e)) && Fe(), zt(e, n ? Ut(t) : t, St);
}
var Lt = null, Rt = 0;
function zt(e, t, n = null) {
	if (!e.equals(t)) {
		kn ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = Tt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ft(t), M === null && $e(t);
		}
		e.wv = Ln(), Lt = null, Rt = 0, Ht(e, v, n), Lt = null, Je() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? Mn([e]) : Y.push(e)), !r.is_fork && Mt.size > 0 && !Nt && Bt();
	}
	return t;
}
function Bt() {
	Nt = !1;
	for (let e of Mt) {
		e.f & 1024 && A(e, y);
		let t;
		try {
			t = Rn(e);
		} catch {
			t = !0;
		}
		t && Wn(e);
	}
	Mt.clear();
}
function Vt(e) {
	P(e, e.v + 1);
}
function Ht(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Je(), a = r.length;
		if (Rt += a, Rt > 1e5 && Lt === null && (Lt = /* @__PURE__ */ new Set()), Lt !== null) {
			if (Lt.has(e)) return;
			Lt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & v) === 0;
				if (l && A(s, t), c & 131072) Mt.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), Ht(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && Dt !== null && Dt.add(d), n === null ? kt(d) : n.push(d);
				}
			}
		}
	}
}
function Ut(e) {
	if (typeof e != "object" || !e || oe in e || se in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ Ft(0), c = null, f = Fn, p = (e) => {
		if (Fn === f) return e();
		var t = V, n = Fn;
		U(null), In(f);
		var r = e();
		return U(t), In(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ Ft(e.length, c)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ne();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ Ft(n.value, c);
				return i.set(t, e), e;
			}) : P(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ Ft(t, c));
					i.set(n, e), Vt(o);
				}
			} else P(r, t), Vt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === oe) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || s(n, r)?.writable) && (o = p(() => /* @__PURE__ */ Ft(Ut(l ? n[r] : t), c)), i.set(r, o)), o !== void 0) {
				var u = X(o);
				return u === t ? void 0 : u;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var r = Reflect.getOwnPropertyDescriptor(e, n), a = i.get(n);
			if (a !== void 0) {
				var o = X(a);
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
			if (n === oe) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || W !== null && (!a || s(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ Ft(a ? Ut(e[n]) : t, c)), i.set(n, r)), X(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ Ft(t, c)), i.set(f + "", m)) : P(m, t);
			}
			if (u === void 0) (!d || s(e, n)?.writable) && (u = p(() => /* @__PURE__ */ Ft(void 0, c)), P(u, Ut(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Ut(r));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				Vt(o);
			}
			return !0;
		},
		ownKeys(e) {
			X(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			Pe();
		}
	});
}
var Wt, Gt, Kt, qt;
function Jt() {
	if (Wt === void 0) {
		Wt = window, Gt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Kt = s(t, "firstChild").get, qt = s(t, "nextSibling").get, f(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), f(n) && (n[fe] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Yt(e) {
	return Kt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Xt(e) {
	return qt.call(e);
}
function I(e, t) {
	if (!T) return /* @__PURE__ */ Yt(e);
	var n = /* @__PURE__ */ Yt(E);
	if (n === null) n = E.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), D(r), r;
	}
	return t && nn(n), D(n), n;
}
function Zt(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ Yt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Xt(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = F();
			return E?.before(r), D(r), r;
		}
		nn(E);
	}
	return E;
}
function L(e, t = !1) {
	if (!T) return /* @__PURE__ */ Yt(e);
	var n = I(e, t);
	return O(e), n;
}
function Qt(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Xt(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), D(a), a;
		}
		nn(r);
	}
	return D(r), r;
}
function $t(e) {
	e.textContent = "";
}
function en() {
	return !1;
}
function tn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function nn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function rn(e) {
	var t = W;
	if (t === null) return V.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	R(e, t);
}
function R(t, n) {
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
function an(e) {
	W === null && (V === null && je(e), Ae()), kn && ke(e);
}
function on(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function sn(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= b);
	var r = {
		ctx: k,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) xt === null ? Tt.ensure().schedule(r) : xt.push(r);
	else if (t !== null) {
		try {
			Wn(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= w));
	}
	if (i !== null && (i.parent = n, n !== null && on(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function cn() {
	return V !== null && !H;
}
function ln(e) {
	let t = sn(8, null);
	return A(t, _), t.teardown = e, t;
}
function un(e) {
	an("$effect");
	var t = W.f;
	if (!V && t & 32 && k !== null && !k.i) {
		var n = k;
		(n.e ??= []).push(e);
	} else return dn(e);
}
function dn(e) {
	return sn(4 | te, e);
}
function fn(e) {
	Tt.ensure();
	let t = sn(64 | ee, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Cn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function pn(e) {
	return sn(4, e);
}
function mn(e) {
	return sn(ie | ee, e);
}
function hn(e, t = 0) {
	return sn(8 | t, e);
}
function gn(e, t = [], n = [], r = []) {
	nt(r, t, n, (t) => {
		sn(8, () => {
			e(...t.map(X));
		});
	});
}
function _n(e, t = 0) {
	return sn(16 | t, e);
}
function z(e) {
	return sn(32 | ee, e);
}
function vn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = kn, r = V;
		An(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			An(n), U(r);
		}
	}
}
function yn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && tt(() => {
			e.abort(pe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function bn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (xn(e.nodes.start, e.nodes.end), n = !0), e.f |= C, yn(e, t && !n), Un(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	vn(e), e.f ^= C, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && Sn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function xn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Xt(e);
		e.remove(), e = n;
	}
}
function Sn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Cn(e, t, n = !0) {
	var r = [];
	e.f |= 256, wn(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function wn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				wn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Tn(e) {
	e.f &= -257, En(e, !0);
}
function En(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= b, e.f & 1024 || (A(e, v), Tt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			En(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Dn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Xt(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/legacy.js
var On = null, kn = !1;
function An(e) {
	kn = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function G(e) {
	W = e;
}
var K = null;
function jn(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function Mn(e) {
	Y = e;
}
var Nn = 1, Pn = 0, Fn = Pn;
function In(e) {
	Fn = e;
}
function Ln() {
	return ++Nn;
}
function Rn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Rn(a) && pt(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && A(e, _);
	}
	return !1;
}
function zn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? zn(a, t, !1) : t === a && (n ? A(a, v) : a.f & 1024 && A(a, y), kt(a));
	}
}
function Bn(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = k, s = H, c = Fn, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, Be(e.ctx), H = !1, Fn = ++Pn, e.ac !== null && (tt(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= S;
		var f = Vn(e);
		if (Je() && Y !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < Y.length; p++) zn(Y[p], e);
		if (i !== null && i !== e) {
			if (Pn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Pn;
			if (t !== null) for (let e of t) e.rv = Pn;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return Vn(e), rn(t);
	} finally {
		e.f ^= re, q = t, J = n, Y = r, V = i, K = a, Be(o), H = s, Fn = c;
	}
}
function Vn(e) {
	var t = e.deps, n = j?.is_fork;
	if (q !== null) {
		var r;
		if (n || Un(e, J), t !== null && J > 0) for (t.length = J + q.length, r = 0; r < q.length; r++) t[J + r] = q[r];
		else e.deps = t = q;
		if (cn() && e.f & 512) for (r = J; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && J < t.length && (Un(e, J), t.length = J);
	return t;
}
function Hn(e, n) {
	let a = n.reactions;
	if (a !== null) {
		var o = r.call(a, e);
		if (o !== -1) {
			var s = a.length - 1;
			s === 0 ? a = n.reactions = null : (a[o] = a[s], a.pop());
		}
	}
	if (a === null && n.f & 2 && (q === null || !i.call(q, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && $e(c), c.ac !== null && tt(() => {
			c.ac.abort(pe), c.ac = null, A(c, v);
		}), mt(c), Un(c, 0);
	}
}
function Un(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Hn(e, n[r]);
}
function Wn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		A(e, _);
		var n = W;
		W = e;
		try {
			t & 16777232 ? bn(e) : yn(e), vn(e);
			var r = Bn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Nn;
		} finally {
			W = n;
		}
	}
}
function X(e) {
	var t = !!(e.f & 2);
	if (On?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < Pn && (e.rv = Pn, q === null && n !== null && n[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], i.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : i.call(r, V) || r.push(V);
		}
	}
	if (kn && N.has(e)) return N.get(e);
	if (t) {
		var a = e;
		if (kn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Kn(a)) && (o = ft(a)), N.set(a, o), o;
		}
		var s = !(a.f & 512) && !H && V !== null && !!(V.f & 512), c = (a.f & S) === 0;
		Rn(a) && (s && (a.f |= 512), pt(a)), s && !c && (ht(a), Gn(a));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Gn(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : i.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (ht(n), Gn(n));
	}
}
function Kn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Kn(t)) return !0;
	return !1;
}
function qn(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
function Jn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (oe in e) Yn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && Yn(n);
		}
	}
}
function Yn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Yn(e[n], t);
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
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/events.js
var Xn = Symbol("events"), Zn = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set();
function $n(e, t, n) {
	(t[Xn] ??= {})[e] = n;
}
function Z(e) {
	for (var t = 0; t < e.length; t++) Zn.add(e[t]);
	for (var n of Qn) n(e);
}
var er = null, tr = !1;
function nr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	er = e, tr || (tr = !0, setTimeout(() => {
		tr = !1, er = null;
	}));
	var s = 0, c = er === e && e[Xn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Xn] = t;
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
		var d = V, f = W;
		U(null), G(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Xn]?.[r];
					h == null || a.disabled && e.target !== a || h.call(a, e);
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
			e[Xn] = t, delete e.currentTarget, U(d), G(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/reconciler.js
var rr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function ir(e) {
	return rr?.createHTML(e) ?? e;
}
function ar(e) {
	var t = tn("template");
	return t.innerHTML = ir(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/template.js
function or(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function sr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return or(E, null), E;
		i === void 0 && (i = ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Yt(i)));
		var t = r || Gt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Yt(t), s = t.lastChild;
			or(o, s);
		} else or(t, t);
		return t;
	};
}
function cr() {
	if (T) return or(E, null), E;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), or(t, n), e;
}
function lr(e, t) {
	if (T) {
		var n = W;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = E), ve();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ur = ["touchstart", "touchmove"];
function dr(e) {
	return ur.includes(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/reactivity/create-subscriber.js
function fr(e) {
	let t = 0, n = Pt(0), r;
	return () => {
		cn() && (X(n), hn(() => (t === 0 && (r = qn(() => e(() => Vt(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, Vt(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var pr = w | ee;
function mr(e, t, n, r) {
	new hr(e, t, n, r);
}
var hr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = T ? E : null;
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
	#h = fr(() => (this.#m = Pt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = _n(() => {
			if (T) {
				let e = xe(this.#t);
				ve();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, pr), T && (this.#e = E);
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
		Ze(r), t && (this.#s = z(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ge() : (t = !0, n && Ie(), this.#s !== null && Cn(this.#s, () => {
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
					R(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (x | C)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), Ze(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return z(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							R(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(j)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Cn(this.#o, () => {
					this.#o = null;
				}), this.#S(j));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Dn(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
			} else this.#S(j);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		et(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = W, n = V, r = k;
		G(this.#i), U(this.#i), Be(this.#i.ctx);
		try {
			return Tt.ensure(), e();
		} finally {
			G(t), U(n), Be(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Cn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !this.#m || this.#d || (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && zt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), X(this.#m);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#y() || this.#T(t);
		})) : this.#T(t);
	}
	#T(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), T && (D(this.#t), ye(), D(be()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return z(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					R(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => R(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function Q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function gr(e, t) {
	return vr(e, t);
}
var _r = /* @__PURE__ */ new Map();
function vr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Jt();
	var u = void 0, d = fn(() => {
		var c = r ?? n.appendChild(F());
		mr(c, { pending: () => {} }, (n) => {
			Ge({});
			var r = k;
			if (s && (r.c = s), o && (i.$$events = o), T && or(n, null), u = t(n, i) || qe(), T && (W.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw he(), e;
			Ke();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = dr(r);
					for (let e of [n, document]) {
						var a = _r.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), _r.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, nr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(Zn)), Qn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = _r.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, nr), t.delete(e), t.size === 0 && _r.delete(r)) : t.set(e, i);
			}
			Qn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return yr.set(u, d), u;
}
var yr = /* @__PURE__ */ new WeakMap();
function br(e, t) {
	let n = yr.get(e);
	return n ? (yr.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var xr = class {
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
			if (n) Tn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Tn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						Dn(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Cn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = en();
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
		} else T && (this.anchor = E), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/if.js
function Sr(e, t, n = !1) {
	var r;
	T && (r = E, ve());
	var i = new xr(e), a = n ? w : 0;
	function o(e, t) {
		if (T) {
			var n = xe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = be();
				D(a), i.anchor = a, _e(!1), i.ensure(e, t), _e(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	_n(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/each.js
function Cr(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Cn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					wr(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			$t(d), d.append(u), e.items.clear();
		}
		wr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function wr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Dn(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var Tr;
function Er(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = T ? D(/* @__PURE__ */ Yt(u)) : u.appendChild(F());
	}
	T && ve();
	var d = null, f = /* @__PURE__ */ ut(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var n = X(f);
			_.fallback = d, Or(_, n, c, t, i), d !== null && (n.length === 0 ? d.f & 33554432 ? (d.f ^= ne, Ar(d, null, c)) : Tn(d) : Cn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: _n(() => {
			var e = X(f), n = e.length;
			let a = !1;
			T && xe(c) === "[!" != (n === 0) && (c = be(), D(c), _e(!1), a = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = j, v = en(), y = 0; y < n; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (c = E, a = !0, _e(!1));
				var b = e[y], x = i(b, y), S = m ? null : l.get(x);
				S ? (S.v && zt(S.v, b), S.i && zt(S.i, y), v && _.unskip_effect(S.e)) : (S = kr(l, m ? c : Tr ??= F(), b, x, y, o, t, r), m || (S.e.f |= ne), l.set(x, S)), u.add(x);
			}
			if (n === 0 && s && !d && (m ? d = z(() => s(c)) : (d = z(() => s(Tr ??= F())), d.f |= ne)), n > u.size && Oe("", "", ""), T && n > 0 && D(be()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			a && _e(!0), X(f);
		}),
		flags: t,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, T && (c = E);
}
function Dr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Or(e, t, n, r, i) {
	var o = !!(r & 8), s = t.length, c = e.items, l = Dr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Tn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) Ar(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), jr(e, d, _), jr(e, _, y), Ar(_, y, n), d = _, p = [], m = [], l = Dr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ar(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					jr(e, S.prev, C.next), jr(e, d, S), jr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Ar(_, l, n), jr(e, _.prev, _.next), jr(e, _, d === null ? e.effect.first : d.next), jr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Dr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Dr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (wr(e, a(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Dr(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			Cr(e, w, te);
		}
	}
	o && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function kr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Pt(n) : /* @__PURE__ */ It(n, !1, !1) : null, l = o & 2 ? Pt(i) : null;
	return {
		v: c,
		i: l,
		e: z(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ar(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Xt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function jr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Mr(e, t, n) {
	var r;
	T && (r = E, ve());
	var i = new xr(e);
	_n(() => {
		var e = t() ?? null;
		if (T && xe(r) === "[" != (e !== null)) {
			var a = be();
			D(a), i.anchor = a, _e(!1), i.ensure(e, e && ((t) => n(t, e))), _e(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, w);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Nr(e, t, n) {
	pn(() => {
		var r = qn(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			hn(() => {
				var e = n();
				Jn(e), i && Ce(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/utils.js
function Pr(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), m;
	let r = qn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/shared/index.js
var Fr = [];
function Ir(e, t = m) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ce(e, t) && (e = t, n)) {
			let t = !Fr.length;
			for (let t of r) t[1](), Fr.push(t, e);
			if (t) {
				for (let e = 0; e < Fr.length; e += 2) Fr[e][0](Fr[e + 1]);
				Fr.length = 0;
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
function Lr(e) {
	let t;
	return Pr(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/props.js
var Rr = {
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
		if (t === oe || t === ce) return !1;
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
function zr(...e) {
	return new Proxy({ props: e }, Rr);
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
// packages/core/src/domain/preferences.ts
var Br = {
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
.2126 * Vr(15 / 255) + .7152 * Vr(23 / 255) + .0722 * Vr(42 / 255);
function Vr(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
// packages/core/src/types/services.ts
function Hr(e) {
	return { key: e };
}
var Ur = Hr("analytics"), Wr = Hr("errorCapture");
// packages/core/src/i18n/i18n-catalog.ts
function Gr(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/mountable.ts
var Kr = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/analytics/plugin-analytics.ts
function qr(e, t) {
	return `plugin.${e}.${t}`;
}
function Jr(e, t, n, r) {
	let i = e.tryService(Ur);
	i && i.track(qr(t, n), {
		...r,
		source: "plugin",
		plugin_id: t
	});
}
// packages/core/src/plugin/define-chronos-plugin.ts
function Yr(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Xr() {
	return "1.3.4";
}
function Zr(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Yr(e.messages, e.nameKey),
		version: e.version ?? Xr(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Yr(e.messages, e.descriptionKey) : void 0,
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
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/index-client.js
function Qr(e) {
	let t, n = fr((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return cn() ? (n(), t) : Lr(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Z(["input"]), Z(["change"]), Z(["change"]), fr((e) => {
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
}), Z([
	"click",
	"pointerdown",
	"pointerup"
]), Z(["change"]);
// packages/ui-kit/src/platform/native-bridge.ts
var $r = "__CHRONOS_NATIVE__";
function ei() {
	if (typeof window > "u") return null;
	let e = window[$r];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
// packages/ui-kit/src/form/TimePicker.svelte
Br.hapticFeedbackEnabled, Z(["click"]), Z(["click"]), Z(["click", "keydown"]), Br.reduceMotionEnabled, Z(["pointerdown"]), Z(["keydown", "click"]), Z(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var ti = /* @__PURE__ */ sr("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function ni(e, t) {
	Ge(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = ti(), i = I(r), a = L(i, !0), o = Qt(i, 2), s = L(o, !0);
	O(r), gn((e, t) => {
		Q(a, e), Q(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), $n("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), lr(e, r), Ke();
}
Z(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ri, ii] = Ve();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Z(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var ai = /* @__PURE__ */ sr("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function oi(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ lt(() => t.component), r = /* @__PURE__ */ lt(() => Qr(t.propsStore).current);
	var i = ai();
	mr(I(i), {
		onerror: (e) => console.error("[MountableSvelteHost] render failed:", e),
		failed: (e, t = m, n = m) => {
			ni(e, {
				get controller() {
					return X(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = cr();
		Mr(Zt(t), () => X(n), (e, t) => {
			t(e, zr(() => X(r)));
		}), lr(e, t);
	}), O(i), lr(e, i), Ke();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function si(e) {
	return {
		[Kr]: !0,
		mount(t, n, r) {
			let i = Ir({ ...n }), a = gr(oi, {
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
					br(a).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function ci(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Gr(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Gr(a, i) : o;
}
// packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var li = 900, ui = 24, di = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function fi(e) {
	return di.has(e) ? !0 : e.startsWith("max-w-");
}
function pi(e) {
	let t = [], n = [];
	for (let r of e) fi(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function mi(e, t, n, r = ui) {
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
function hi(e, t) {
	t.visible ? (e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`) : e.style.display = "none";
}
function gi(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = pi(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		hi(a, mi(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, li);
	};
	e.addEventListener("scroll", l, { passive: !0 });
	let u = new ResizeObserver(() => c());
	return u.observe(e), c(), { destroy() {
		e.removeEventListener("scroll", l), u.disconnect(), s !== void 0 && clearTimeout(s), n.classList.remove("is-scrolling"), n.isConnected && (t.isConnected && t.insertBefore(e, n), n.remove());
		for (let t of r) e.classList.add(t);
		o && e.classList.remove("h-full", "w-full");
	} };
}
// packages/ui-kit/src/actions/app-scroll.ts
function _i(e) {
	return gi(e);
}
// packages/ui-kit/src/platform/clipboard.ts
async function vi(e) {
	let t = ei();
	if (t) try {
		return await t.callNative("clipboard", "writeText", { text: e }), !0;
	} catch {}
	if (typeof navigator < "u" && navigator.clipboard?.writeText) try {
		return await navigator.clipboard.writeText(e), !0;
	} catch {}
	if (typeof document < "u") try {
		let t = document.createElement("textarea");
		t.value = e, t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
		let n = document.execCommand("copy");
		return document.body.removeChild(t), n;
	} catch {
		return !1;
	}
	return !1;
}
// packages/plugins/error-log/src/constants.ts
var $ = "tool-error-log", yi = "error_log", bi = 2e3, xi = 8e3, Si = {
	"zh-cn": {
		"plugin.name": "错误日志",
		"mine.title": "错误日志",
		"screen.title": "错误日志",
		"screen.empty": "暂无错误记录",
		"screen.action.copyAll": "复制全部",
		"screen.action.copyOne": "复制",
		"screen.action.clear": "清空",
		"screen.notify.copySuccess": "已复制到剪贴板",
		"screen.notify.copyFailed": "复制失败",
		"screen.notify.cleared": "已清空"
	},
	en: {
		"plugin.name": "Error Log",
		"mine.title": "Error Log",
		"screen.title": "Error Log",
		"screen.empty": "No errors recorded yet",
		"screen.action.copyAll": "Copy all",
		"screen.action.copyOne": "Copy",
		"screen.action.clear": "Clear",
		"screen.notify.copySuccess": "Copied to clipboard",
		"screen.notify.copyFailed": "Copy failed",
		"screen.notify.cleared": "Cleared"
	}
};
// packages/plugins/error-log/src/error-log.ts
function Ci(e, t) {
	return e.length <= t ? e : `${e.slice(0, t)}…`;
}
function wi(e) {
	return {
		...e,
		message: Ci(e.message, bi),
		stack: e.stack ? Ci(e.stack, xi) : void 0
	};
}
function Ti(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.ts == "number" && (t.source === "error" || t.source === "unhandledrejection" || t.source === "console") && typeof t.message == "string";
}
function Ei(e) {
	return Array.isArray(e) ? e.filter(Ti).map(wi) : [];
}
function Di(e, t, n = 100) {
	let r = [...e, wi(t)];
	return r.length <= n ? r : r.slice(r.length - n);
}
function Oi(e) {
	let t = new Date(e.ts).toISOString(), n = e.name ? ` / ${e.name}` : "", r = [`${t} / ${e.source}${n} / ${e.message}`];
	return e.stack && r.push(e.stack), r.join("\n");
}
function ki(e, t) {
	let n = ["Chronos Error Log", `Plugin: ${$} v${t.pluginVersion}`];
	t.userAgent && n.push(`User-Agent: ${t.userAgent}`);
	let r = [...e].sort((e, t) => t.ts - e.ts).map(Oi).join("\n\n");
	return r ? `${n.join("\n")}\n\n---\n\n${r}` : n.join("\n");
}
// packages/plugins/error-log/src/runtime.svelte.ts
var Ai = /* @__PURE__ */ new Map();
function ji(e = $) {
	let t = Ai.get(e);
	if (!t) throw Error(`[ErrorLogRuntime] not initialized for plugin "${e}"`);
	return t;
}
function Mi(e, t = $) {
	let n = /* @__PURE__ */ Ft([]), r = Promise.resolve();
	function i(e) {
		return r = r.then(e, e), r;
	}
	let a = {
		get entries() {
			return X(n);
		},
		async load() {
			await r;
			let t = await e.storage.get(yi);
			P(n, Ei(t));
		},
		async append(t) {
			P(n, Di(X(n), t)), await i(() => e.storage.set(yi, X(n)));
		},
		async clear() {
			P(n, []), await i(() => e.storage.delete(yi));
		},
		dispose() {
			Ai.get(t) === a && Ai.delete(t);
		}
	};
	return Ai.set(t, a), a;
}
// packages/plugins/error-log/src/index.ts
function Ni(e = {}) {
	let { screenComponent: t } = e;
	return Zr({
		id: $,
		messages: Si,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 50,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = Mi(e);
			await r.load();
			let i = e.tryService(Wr);
			i && e.addDisposable(i.onCaptured((e) => {
				r.append(e);
			})), e.addDisposable({ dispose: () => r.dispose() }), e.registerSlot("mine.item", {
				id: "error-log",
				sectionId: $,
				title: () => n("mine.title"),
				href: `/plugins/${$}`,
				icon: "history",
				iconTone: "secondary",
				order: 35
			}), e.registerSlot("shell.route.screen", {
				id: $,
				title: () => n("screen.title"),
				...t ? { component: t } : {}
			});
		}
	});
}
// packages/plugins/error-log/src/analytics.ts
var Pi = {
	copy: "copy",
	clear: "clear"
};
// packages/plugins/error-log/src/copy-text.ts
async function Fi(e) {
	return vi(e);
}
// packages/plugins/error-log/src/ErrorLogScreen.svelte
var Ii = /* @__PURE__ */ sr("<div class=\"p-6 text-center\"><p class=\"text-body-medium text-on-surface-variant\"> </p></div>"), Li = /* @__PURE__ */ sr("<p class=\"text-title-small text-on-surface\"> </p>"), Ri = /* @__PURE__ */ sr("<pre class=\"text-body-small text-supporting mt-2 max-h-40 overflow-auto font-mono whitespace-pre-wrap text-on-surface-variant\"> </pre>"), zi = /* @__PURE__ */ sr("<div class=\"flex items-start justify-between gap-3 p-3\"><div class=\"min-w-0 flex-1\"><p class=\"text-body-small text-supporting text-on-surface-variant\"> </p> <!> <p class=\"text-body-medium text-on-surface\"> </p> <!></div> <button type=\"button\" class=\"ui-btn ui-btn-text shrink-0\"> </button></div>"), Bi = /* @__PURE__ */ sr("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><div class=\"secondary-scroll min-h-0 flex-1 overflow-y-auto\"><div class=\"p-4\"><div class=\"ui-section-surface divide-y divide-outline/10 overflow-hidden\"><!></div></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button></div></div></div>");
function Vi(e, t) {
	Ge(t, !0);
	let n = /* @__PURE__ */ lt(() => ji(t.pluginId)), r = /* @__PURE__ */ lt(() => {
		let e = /* @__PURE__ */ new Set();
		return [...X(n).entries].sort((e, t) => t.ts - e.ts).filter((t) => !e.has(t.id) && (e.add(t.id), !0));
	}), i = /* @__PURE__ */ lt(() => t.controller.getPluginContext(t.pluginId));
	function a(e) {
		return ci(t.controller, $, Si, e);
	}
	function o(e) {
		return new Date(e).toLocaleString(t.controller.locale);
	}
	async function s(e) {
		let t = await Fi(ki(e, {
			pluginVersion: Xr(),
			userAgent: typeof navigator < "u" ? navigator.userAgent : void 0
		}));
		Jr(X(i), $, Pi.copy), X(i).actions.notify(a(t ? "screen.notify.copySuccess" : "screen.notify.copyFailed"), t ? "info" : "error");
	}
	async function c() {
		await s(X(r));
	}
	async function l(e) {
		await s([e]);
	}
	async function u() {
		await X(n).clear(), Jr(X(i), $, Pi.clear), X(i).actions.notify(a("screen.notify.cleared"), "info");
	}
	let d = /* @__PURE__ */ lt(() => [{
		id: "copy-all",
		label: a("screen.action.copyAll"),
		icon: "content-copy",
		variant: "outlined",
		disabled: X(r).length === 0,
		onClick: c
	}, {
		id: "clear",
		label: a("screen.action.clear"),
		icon: "delete",
		variant: "outlined",
		disabled: X(r).length === 0,
		onClick: u
	}]);
	un(() => t.edgeActions?.register(t.pluginId, X(d)));
	var f = Bi(), p = I(f), m = I(p), h = I(m), g = I(h), _ = (e) => {
		var t = Ii(), n = L(I(t), !0);
		O(t), gn((e) => Q(n, e), [() => a("screen.empty")]), lr(e, t);
	}, v = (e) => {
		var t = cr();
		Er(Zt(t), 17, () => X(r), (e) => e.id, (e, t) => {
			var n = zi(), r = I(n), i = I(r), s = L(i), c = Qt(i, 2), u = (e) => {
				var n = Li(), r = L(n, !0);
				gn(() => Q(r, X(t).name)), lr(e, n);
			};
			Sr(c, (e) => {
				X(t).name && e(u);
			});
			var d = Qt(c, 2), f = L(d, !0), p = Qt(d, 2), m = (e) => {
				var n = Ri(), r = L(n, !0);
				gn(() => Q(r, X(t).stack)), lr(e, n);
			};
			Sr(p, (e) => {
				X(t).stack && e(m);
			}), O(r);
			var h = Qt(r, 2), g = L(h, !0);
			O(n), gn((e, n) => {
				Q(s, `${e ?? ""} · ${X(t).source ?? ""}`), Q(f, X(t).message), Q(g, n);
			}, [() => o(X(t).ts), () => a("screen.action.copyOne")]), $n("click", h, () => l(X(t))), lr(e, n);
		}), lr(e, t);
	};
	Sr(g, (e) => {
		X(r).length === 0 ? e(_) : e(v, -1);
	}), O(h), O(m), O(p), Nr(p, (e) => _i?.(e));
	var y = Qt(p, 2), b = I(y), x = I(b), S = L(x, !0), C = Qt(x, 2), w = L(C, !0);
	O(b), O(y), O(f), gn((e, t) => {
		x.disabled = X(r).length === 0, Q(S, e), C.disabled = X(r).length === 0, Q(w, t);
	}, [() => a("screen.action.copyAll"), () => a("screen.action.clear")]), $n("click", x, c), $n("click", C, u), lr(e, f), Ke();
}
Z(["click"]);
// packages/plugins/error-log/bundle/entry.ts
var Hi = Ni({ screenComponent: si(Vi) });
export { Hi as default };
