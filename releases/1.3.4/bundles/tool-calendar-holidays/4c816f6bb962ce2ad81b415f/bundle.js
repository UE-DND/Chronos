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
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, ee = 1 << 25, C = 65536, w = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = new class extends Error {
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
	return D(/* @__PURE__ */ Kt(E));
}
function O(t) {
	if (T) {
		if (/* @__PURE__ */ Kt(E) !== null) throw he(), e;
		E = t;
	}
}
function ye(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ Kt(n);
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
		var i = /* @__PURE__ */ Kt(n);
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
function ke() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function je() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Me() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ne() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/shared/context.js
function Pe(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Ee(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Fe(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Ie(e, t) {
	return e === null && Te(t), e.c ??= new Map(Fe(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/context.js
var k = null;
function Le(e) {
	k = e;
}
function Re() {
	return Pe(ze, Be, Ve);
}
function ze(e) {
	return Ie(k, "getContext").get(e);
}
function Be(e, t) {
	return Ie(k, "setContext").set(e, t), t;
}
function Ve(e) {
	return Ie(k, "hasContext").has(e);
}
function He(e, t = !1, n) {
	k = {
		p: k,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: null
	};
}
function Ue(e) {
	var t = k, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) an(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, k = t.p, We(e);
}
function We(e = {}) {
	return o(e, se, { value: !0 }), e;
}
function Ge() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], h(e);
}
function Je(e) {
	if (Ke.length === 0 && !gt) {
		var t = Ke;
		queueMicrotask(() => {
			t === Ke && qe();
		});
	}
	Ke.push(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/status.js
var Ye = ~(v | y | _);
function A(e, t) {
	e.f = e.f & Ye | t;
}
function Xe(e) {
	e.f & 512 || e.deps === null ? A(e, _) : A(e, y);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/utils.js
function Ze(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), A(e, _);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Qe(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/async.js
function $e(e, t, n, r) {
	let i = Ge() ? rt : st;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = et(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				z(e, s);
			}
			tt();
		}
	}
	var d = nt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ at(e))).then(u).catch((e) => z(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), tt());
	}) : f();
}
function et() {
	var e = G, t = H, n = k, r = j;
	return function(i = !0) {
		K(e), W(t), Le(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function tt(e = !0) {
	K(null), W(null), Le(null), e && j?.deactivate();
}
function nt() {
	var e = G, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function rt(e) {
	var n = 2 | v;
	return G !== null && (G.f |= w), {
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
		parent: G,
		ac: null
	};
}
var it = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function at(e, n, r) {
	let i = G;
	i === null && De();
	var a = void 0, o = jt(t), s = !H, c = /* @__PURE__ */ new Set();
	return cn(() => {
		var t = G, n = g();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== pe && n.reject(e);
			}).finally(tt);
		} catch (e) {
			n.reject(e), tt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = nt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(it);
			else for (let e of c.values()) e.reject(it);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== it && (r.activate(), t ? (o.f |= ae, Ft(o, t)) : (o.f & 8388608 && (o.f ^= ae), Ft(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), rn(() => {
		for (let e of c) e.reject(it);
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
function ot(e) {
	let t = /* @__PURE__ */ rt(e);
	return Tn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function st(e) {
	let t = /* @__PURE__ */ rt(e);
	return t.equals = we, t;
}
function ct(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function lt(e) {
	var n, r = G, i = e.parent;
	if (!Cn && i !== null && e.v !== t && i.f & 24576) return me(), e.v;
	K(i);
	try {
		ct(e), n = Pn(e);
	} finally {
		K(r);
	}
	return n;
}
function ut(e) {
	var t = lt(e);
	!e.equals(t) && (e.wv = jn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), mt?.capture(e, t, !0)), e.deps === null)) ? A(e, _) : Cn || (M === null ? Xe(e) : (nn() || j?.is_fork) && M.set(e, t));
}
function dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Qe(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = m), Ln(t, 0), pn(t));
}
function ft(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Rn(t);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/batch.js
var pt = null, j = null, mt = null, M = null, ht = null, gt = !1, _t = !1, vt = null, yt = null, bt = 0, xt = 1, St = class e {
	id = xt++;
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
		pt === null ? pt = this : (pt.#n = this, this.#t = pt), pt = this;
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
		for (var t = vt = [], n = [], r = yt = []; this.#c.length > 0;) {
			bt++ > 1e3 && (this.#S(), Ct());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Ot(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (vt = null, yt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Dt(e, t);
			r.length > 0 && j.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), mt = this, Tt(n), Tt(t), mt = null, this.#s?.resolve();
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
				a ? r.f ^= _ : i & 4 ? t.push(r) : Mn(r) && (i & 16 && this.#d.add(r), Rn(r));
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
		for (var t = 0; t < e.length; t += 1) Ze(e[t], this.#u, this.#d);
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
			_t = !0, j = this, this.#_();
		} finally {
			bt = 0, ht = null, vt = null, yt = null, _t = !1, j = null, M = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(it);
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
		this.#m || (this.#m = !0, Je(() => {
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
			!_t && Je(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		M = null;
	}
	schedule(e) {
		ht = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? pt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ct() {
	try {
		ke();
	} catch (e) {
		z(e, ht);
	}
}
var wt = null;
function Tt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Mn(r) && (wt = /* @__PURE__ */ new Set(), Rn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && gn(r), wt?.size > 0)) {
				N.clear();
				for (let e of wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) wt.has(n) && (wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Rn(n);
					}
				}
				wt.clear();
			}
		}
		wt = null;
	}
}
function Et(e) {
	j.schedule(e);
}
function Dt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, _);
		for (var n = e.first; n !== null;) Dt(n, t), n = n.next;
	}
}
function Ot(e) {
	A(e, _);
	for (var t = e.first; t !== null;) Ot(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/reactivity/sources.js
var kt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), At = !1;
function jt(e, t) {
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
function P(e, t) {
	let n = jt(e, t);
	return Tn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Mt(e, t = !1, n = !0) {
	let r = jt(e);
	return t || (r.equals = we), r;
}
function F(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && Ge() && H.f & 4325394 && (q === null || !q.has(e)) && Me(), Ft(e, n ? zt(t) : t, yt);
}
var Nt = null, Pt = 0;
function Ft(e, t, n = null) {
	if (!e.equals(t)) {
		Cn ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = St.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && lt(t), M === null && Xe(t);
		}
		e.wv = jn(), Nt = null, Pt = 0, Rt(e, v, n), Nt = null, Ge() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? En([e]) : X.push(e)), !r.is_fork && kt.size > 0 && !At && It();
	}
	return t;
}
function It() {
	At = !1;
	for (let e of kt) {
		e.f & 1024 && A(e, y);
		let t;
		try {
			t = Mn(e);
		} catch {
			t = !0;
		}
		t && Rn(e);
	}
	kt.clear();
}
function Lt(e) {
	F(e, e.v + 1);
}
function Rt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ge(), a = r.length;
		if (Pt += a, Pt > 1e5 && Nt === null && (Nt = /* @__PURE__ */ new Set()), Nt !== null) {
			if (Nt.has(e)) return;
			Nt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & v) === 0;
				if (l && A(s, t), c & 131072) kt.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), Rt(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && wt !== null && wt.add(d), n === null ? Et(d) : n.push(d);
				}
			}
		}
	}
}
function zt(e) {
	if (typeof e != "object" || !e || oe in e || se in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ P(0), c = null, f = kn, p = (e) => {
		if (kn === f) return e();
		var t = H, n = kn;
		W(null), An(f);
		var r = e();
		return W(t), An(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ P(e.length, c)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ae();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ P(n.value, c);
				return i.set(t, e), e;
			}) : F(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ P(t, c));
					i.set(n, e), Lt(o);
				}
			} else F(r, t), Lt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === oe) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || s(n, r)?.writable) && (o = p(() => /* @__PURE__ */ P(zt(l ? n[r] : t), c)), i.set(r, o)), o !== void 0) {
				var u = Z(o);
				return u === t ? void 0 : u;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var r = Reflect.getOwnPropertyDescriptor(e, n), a = i.get(n);
			if (a !== void 0) {
				var o = Z(a);
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
			return (r !== void 0 || G !== null && (!a || s(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ P(a ? zt(e[n]) : t, c)), i.set(n, r)), Z(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ P(t, c)), i.set(f + "", m)) : F(m, t);
			}
			if (u === void 0) (!d || s(e, n)?.writable) && (u = p(() => /* @__PURE__ */ P(void 0, c)), F(u, zt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => zt(r));
				F(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && F(_, v + 1);
				}
				Lt(o);
			}
			return !0;
		},
		ownKeys(e) {
			Z(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			je();
		}
	});
}
var Bt, Vt, Ht, Ut;
function Wt() {
	if (Bt === void 0) {
		Bt = window, Vt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Ht = s(t, "firstChild").get, Ut = s(t, "nextSibling").get, f(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), f(n) && (n[fe] = void 0);
	}
}
function I(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Gt(e) {
	return Ht.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Kt(e) {
	return Ut.call(e);
}
function L(e, t) {
	if (!T) return /* @__PURE__ */ Gt(e);
	var n = /* @__PURE__ */ Gt(E);
	if (n === null) n = E.appendChild(I());
	else if (t && n.nodeType !== 3) {
		var r = I();
		return n?.before(r), D(r), r;
	}
	return t && Qt(n), D(n), n;
}
function qt(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ Gt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Kt(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = I();
			return E?.before(r), D(r), r;
		}
		Qt(E);
	}
	return E;
}
function R(e, t = !1) {
	if (!T) return /* @__PURE__ */ Gt(e);
	var n = L(e, t);
	return O(e), n;
}
function Jt(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Kt(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = I();
			return r === null ? i?.after(a) : r.before(a), D(a), a;
		}
		Qt(r);
	}
	return D(r), r;
}
function Yt(e) {
	e.textContent = "";
}
function Xt() {
	return !1;
}
function Zt(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Qt(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function $t(e) {
	var t = G;
	if (t === null) return H.f |= ae, e;
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
function en(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function tn(e, t) {
	var n = G;
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
	if (e & 4) vt === null ? St.ensure().schedule(r) : vt.push(r);
	else if (t !== null) {
		try {
			Rn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && en(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function nn() {
	return H !== null && !U;
}
function rn(e) {
	let t = tn(8, null);
	return A(t, _), t.teardown = e, t;
}
function an(e) {
	return tn(4 | te, e);
}
function on(e) {
	St.ensure();
	let t = tn(64 | w, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? _n(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function sn(e) {
	return tn(4, e);
}
function cn(e) {
	return tn(ie | w, e);
}
function ln(e, t = 0) {
	return tn(8 | t, e);
}
function un(e, t = [], n = [], r = []) {
	$e(r, t, n, (t) => {
		tn(8, () => {
			e(...t.map(Z));
		});
	});
}
function dn(e, t = 0) {
	return tn(16 | t, e);
}
function B(e) {
	return tn(32 | w, e);
}
function fn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Cn, r = H;
		wn(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			z(t, e.parent);
		} finally {
			wn(n), W(r);
		}
	}
}
function pn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Qe(() => {
			e.abort(pe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function mn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (hn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, pn(e, t && !n), Ln(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	fn(e), e.f ^= ee, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && gn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function hn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Kt(e);
		e.remove(), e = n;
	}
}
function gn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function _n(e, t, n = !0) {
	var r = [];
	e.f |= 256, vn(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function vn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				vn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function yn(e) {
	e.f &= -257, bn(e, !0);
}
function bn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= b, e.f & 1024 || (A(e, v), St.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			bn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function xn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Kt(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/legacy.js
var Sn = null, Cn = !1;
function wn(e) {
	Cn = e;
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
function Tn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function En(e) {
	X = e;
}
var Dn = 1, On = 0, kn = On;
function An(e) {
	kn = e;
}
function jn() {
	return ++Dn;
}
function Mn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Mn(a) && ut(a), a.wv > e.wv) return !0;
		}
		t & 512 && M === null && A(e, _);
	}
	return !1;
}
function Nn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Nn(a, t, !1) : t === a && (n ? A(a, v) : a.f & 1024 && A(a, y), Et(a));
	}
}
function Pn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = k, s = U, c = kn, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Le(e.ctx), U = !1, kn = ++On, e.ac !== null && (Qe(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= S;
		var f = Fn(e);
		if (Ge() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Nn(X[p], e);
		if (i !== null && i !== e) {
			if (On++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = On;
			if (t !== null) for (let e of t) e.rv = On;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return Fn(e), $t(t);
	} finally {
		e.f ^= re, J = t, Y = n, X = r, H = i, q = a, Le(o), U = s, kn = c;
	}
}
function Fn(e) {
	var t = e.deps, n = j?.is_fork;
	if (J !== null) {
		var r;
		if (n || Ln(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (nn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Ln(e, Y), t.length = Y);
	return t;
}
function In(e, n) {
	let a = n.reactions;
	if (a !== null) {
		var o = r.call(a, e);
		if (o !== -1) {
			var s = a.length - 1;
			s === 0 ? a = n.reactions = null : (a[o] = a[s], a.pop());
		}
	}
	if (a === null && n.f & 2 && (J === null || !i.call(J, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && Xe(c), c.ac !== null && Qe(() => {
			c.ac.abort(pe), c.ac = null, A(c, v);
		}), dt(c), Ln(c, 0);
	}
}
function Ln(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) In(e, n[r]);
}
function Rn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		A(e, _);
		var n = G;
		G = e;
		try {
			t & 16777232 ? mn(e) : pn(e), fn(e);
			var r = Pn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Dn;
		} finally {
			G = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (Sn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < On && (e.rv = On, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], i.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : i.call(r, H) || r.push(H);
		}
	}
	if (Cn && N.has(e)) return N.get(e);
	if (t) {
		var a = e;
		if (Cn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Bn(a)) && (o = lt(a)), N.set(a, o), o;
		}
		var s = !(a.f & 512) && !U && H !== null && !!(H.f & 512), c = (a.f & S) === 0;
		Mn(a) && (s && (a.f |= 512), ut(a)), s && !c && (ft(a), zn(a));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function zn(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : i.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (ft(n), zn(n));
	}
}
function Bn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Bn(t)) return !0;
	return !1;
}
function Vn(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
function Hn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (oe in e) Un(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && Un(n);
		}
	}
}
function Un(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Un(e[n], t);
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
var Wn = Symbol("events"), Gn = /* @__PURE__ */ new Set(), Kn = /* @__PURE__ */ new Set();
function qn(e, t, n) {
	(t[Wn] ??= {})[e] = n;
}
function Q(e) {
	for (var t = 0; t < e.length; t++) Gn.add(e[t]);
	for (var n of Kn) n(e);
}
var Jn = null, Yn = !1;
function Xn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Jn = e, Yn || (Yn = !0, setTimeout(() => {
		Yn = !1, Jn = null;
	}));
	var s = 0, c = Jn === e && e[Wn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Wn] = t;
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
		var d = H, f = G;
		W(null), K(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Wn]?.[r];
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
			e[Wn] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/reconciler.js
var Zn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Qn(e) {
	return Zn?.createHTML(e) ?? e;
}
function $n(e) {
	var t = Zt("template");
	return t.innerHTML = Qn(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/template.js
function er(e, t) {
	var n = G;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function tr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return er(E, null), E;
		i === void 0 && (i = $n(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Gt(i)));
		var t = r || Vt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Gt(t), s = t.lastChild;
			er(o, s);
		} else er(t, t);
		return t;
	};
}
function nr() {
	if (T) return er(E, null), E;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = I();
	return e.append(t, n), er(t, n), e;
}
function rr(e, t) {
	if (T) {
		var n = G;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = E), ve();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ir = ["touchstart", "touchmove"];
function ar(e) {
	return ir.includes(e);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/reactivity/create-subscriber.js
function or(e) {
	let t = 0, n = jt(0), r;
	return () => {
		nn() && (Z(n), ln(() => (t === 0 && (r = Vn(() => e(() => Lt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, Lt(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var sr = C | w;
function cr(e, t, n, r) {
	new lr(e, t, n, r);
}
var lr = class {
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
	#h = or(() => (this.#m = jt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = dn(() => {
			if (T) {
				let e = xe(this.#t);
				ve();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, sr), T && (this.#e = E);
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
		Je(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? ge() : (t = !0, n && Ne(), this.#s !== null && _n(this.#s, () => {
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
		return (this.#i.f & (x | ee)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), Je(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = I(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return B(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							z(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(j)) : this.#u === 0 && (this.#e.before(e), this.#c = null, _n(this.#o, () => {
					this.#o = null;
				}), this.#S(j));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				xn(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#S(j);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		Ze(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = G, n = H, r = k;
		K(this.#i), W(this.#i), Le(this.#i.ctx);
		try {
			return St.ensure(), e();
		} finally {
			K(t), W(n), Le(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && _n(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !this.#m || this.#d || (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Ft(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#y() || this.#T(t);
		})) : this.#T(t);
	}
	#T(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), T && (D(this.#t), ye(), D(be()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return B(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return z(e, this.#i.parent), null;
				}
			}));
		};
		Je(() => {
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
function $(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function ur(e, t) {
	return fr(e, t);
}
var dr = /* @__PURE__ */ new Map();
function fr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Wt();
	var u = void 0, d = on(() => {
		var c = r ?? n.appendChild(I());
		cr(c, { pending: () => {} }, (n) => {
			He({});
			var r = k;
			if (s && (r.c = s), o && (i.$$events = o), T && er(n, null), u = t(n, i) || We(), T && (G.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw he(), e;
			Ue();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = ar(r);
					for (let e of [n, document]) {
						var a = dr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), dr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Xn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(Gn)), Kn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = dr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Xn), t.delete(e), t.size === 0 && dr.delete(r)) : t.set(e, i);
			}
			Kn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return pr.set(u, d), u;
}
var pr = /* @__PURE__ */ new WeakMap();
function mr(e, t) {
	let n = pr.get(e);
	return n ? (pr.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var hr = class {
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
			if (n) yn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (yn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						xn(r, t), t.append(I()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), _n(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = Xt();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = I();
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
		} else T && (this.anchor = E), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/if.js
function gr(e, t, n = !1) {
	var r;
	T && (r = E, ve());
	var i = new hr(e), a = n ? C : 0;
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
	dn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/each.js
function _r(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		_n(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					vr(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			Yt(d), d.append(u), e.items.clear();
		}
		vr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function vr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, xn(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var yr;
function br(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = T ? D(/* @__PURE__ */ Gt(u)) : u.appendChild(I());
	}
	T && ve();
	var d = null, f = /* @__PURE__ */ st(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var n = Z(f);
			_.fallback = d, Sr(_, n, c, t, i), d !== null && (n.length === 0 ? d.f & 33554432 ? (d.f ^= ne, wr(d, null, c)) : yn(d) : _n(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: dn(() => {
			var e = Z(f), n = e.length;
			let a = !1;
			T && xe(c) === "[!" != (n === 0) && (c = be(), D(c), _e(!1), a = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = j, v = Xt(), y = 0; y < n; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (c = E, a = !0, _e(!1));
				var b = e[y], x = i(b, y), S = m ? null : l.get(x);
				S ? (S.v && Ft(S.v, b), S.i && Ft(S.i, y), v && _.unskip_effect(S.e)) : (S = Cr(l, m ? c : yr ??= I(), b, x, y, o, t, r), m || (S.e.f |= ne), l.set(x, S)), u.add(x);
			}
			if (n === 0 && s && !d && (m ? d = B(() => s(c)) : (d = B(() => s(yr ??= I())), d.f |= ne)), n > u.size && Oe("", "", ""), T && n > 0 && D(be()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			a && _e(!0), Z(f);
		}),
		flags: t,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, T && (c = E);
}
function xr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Sr(e, t, n, r, i) {
	var o = !!(r & 8), s = t.length, c = e.items, l = xr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (yn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) wr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Tr(e, d, _), Tr(e, _, y), wr(_, y, n), d = _, p = [], m = [], l = xr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) wr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Tr(e, S.prev, ee.next), Tr(e, d, S), Tr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), wr(_, l, n), Tr(e, _.prev, _.next), Tr(e, _, d === null ? e.effect.first : d.next), Tr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = xr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = xr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (vr(e, a(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = xr(l.next);
		var w = C.length;
		if (w > 0) {
			var te = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.fix();
			}
			_r(e, C, te);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Cr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? jt(n) : /* @__PURE__ */ Mt(n, !1, !1) : null, l = o & 2 ? jt(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function wr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Kt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Tr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Er(e, t, n) {
	var r;
	T && (r = E, ve());
	var i = new hr(e);
	dn(() => {
		var e = t() ?? null;
		if (T && xe(r) === "[" != (e !== null)) {
			var a = be();
			D(a), i.anchor = a, _e(!1), i.ensure(e, e && ((t) => n(t, e))), _e(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Dr(e, t, n) {
	sn(() => {
		var r = Vn(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			ln(() => {
				var e = n();
				Hn(e), i && Ce(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/utils.js
function Or(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), m;
	let r = Vn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.2/node_modules/svelte/src/store/shared/index.js
var kr = [];
function Ar(e, t = m) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ce(e, t) && (e = t, n)) {
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
// packages/core/src/domain/preferences.ts
var Pr = {
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
function Fr(e) {
	let t = e.trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) throw Error(`Invalid ISO date: ${e}`);
	let n = /* @__PURE__ */ new Date(`${t}T12:00:00.000Z`);
	if (Ir(n) !== t) throw Error(`Invalid ISO date: ${e}`);
	return n;
}
function Ir(e) {
	return `${String(e.getUTCFullYear()).padStart(4, "0")}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function Lr(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function Rr(e) {
	let t = new Date(e.getTime()), n = t.getUTCDay(), r = n === 0 ? -6 : 1 - n;
	return t.setUTCDate(t.getUTCDate() + r), t;
}
function zr(e, t) {
	let n = new Date(e.getTime());
	return n.setUTCDate(n.getUTCDate() + t), n;
}
function Br(e, t) {
	return zr(e, t * 7);
}
function Vr(e, t) {
	return Math.floor((t.getTime() - e.getTime()) / 6048e5);
}
function Hr(e, t) {
	return e.getTime() < t.getTime();
}
function Ur(e) {
	return Ir(Rr(Fr(e)));
}
function Wr(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
// packages/core/src/algorithms/calendar.ts
var Gr = class {
	normalizeTermStartDate(e, t) {
		let n = Fr(Ur(t));
		if (!e || !e.trim()) return Ir(Rr(n));
		try {
			return Ir(Rr(Fr(e)));
		} catch {
			return Ir(Rr(this.inferTermStartDateFromTermName(e) || n));
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
		}, r = Fr(this.normalizeTermStartDate(n.termStartDate, e)), i = Fr(e);
		if (Hr(i, r)) return n.startWeek;
		let a = Vr(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return Ir(Br(Fr(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return Ir(zr(Fr(this.resolveWeekStart(e, t, r)), n - 1));
	}
};
// packages/core/src/algorithms/holiday-calendar.ts
function Kr(e, t = Wr()) {
	let n = new Gr(), r = Fr(n.resolveWeekStart(e, e.startWeek, t)), i = zr(Fr(n.resolveWeekStart(e, e.endWeek, t)), 6);
	return {
		startDate: Ir(r),
		endDate: Ir(i)
	};
}
function qr(e, t, n = Wr()) {
	let { startDate: r, endDate: i } = Kr(t, n);
	return e.filter((e) => e.date >= r && e.date <= i).map((e) => ({ ...e }));
}
function Jr(e, t = Wr()) {
	let { startDate: n, endDate: r } = Kr(e, t), i = Number.parseInt(n.slice(0, 4), 10), a = Number.parseInt(r.slice(0, 4), 10), o = /* @__PURE__ */ new Set();
	for (let e = i; e <= a; e += 1) o.add(e);
	return o.size === 0 && o.add(Number.parseInt(t.slice(0, 4), 10)), [...o].sort((e, t) => e - t);
}
.2126 * Yr(15 / 255) + .7152 * Yr(23 / 255) + .0722 * Yr(42 / 255);
function Yr(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
// packages/core/src/types/services.ts
function Xr(e) {
	return { key: e };
}
var Zr = Xr("http"), Qr = Xr("storage");
// packages/core/src/i18n/i18n-catalog.ts
function $r(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/mountable.ts
var ei = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/plugin/define-chronos-plugin.ts
function ti(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function ni() {
	return "1.3.4";
}
function ri(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? ti(e.messages, e.nameKey),
		version: e.version ?? ni(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? ti(e.messages, e.descriptionKey) : void 0,
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
function ii(e) {
	let t, n = or((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return nn() ? (n(), t) : jr(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Q(["input"]), Q(["change"]), Q(["change"]), or((e) => {
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
}), Q([
	"click",
	"pointerdown",
	"pointerup"
]), Q(["change"]);
// packages/ui-kit/src/form/date-field-utils.ts
function ai(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
// packages/ui-kit/src/form/TimePicker.svelte
Pr.hapticFeedbackEnabled, Q(["click"]), Q(["click"]), Q(["click", "keydown"]), Pr.reduceMotionEnabled, Q(["pointerdown"]), Q(["keydown", "click"]), Q(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var oi = /* @__PURE__ */ tr("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function si(e, t) {
	He(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = oi(), i = L(r), a = R(i, !0), o = Jt(i, 2), s = R(o, !0);
	O(r), un((e, t) => {
		$(a, e), $(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), qn("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), rr(e, r), Ue();
}
Q(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ci, li] = Re();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Q(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var ui = /* @__PURE__ */ tr("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function di(e, t) {
	He(t, !0);
	let n = /* @__PURE__ */ ot(() => t.component), r = /* @__PURE__ */ ot(() => ii(t.propsStore).current);
	var i = ui();
	cr(L(i), {
		onerror: (e) => console.error("[MountableSvelteHost] render failed:", e),
		failed: (e, t = m, n = m) => {
			si(e, {
				get controller() {
					return Z(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = nr();
		Er(qt(t), () => Z(n), (e, t) => {
			t(e, Nr(() => Z(r)));
		}), rr(e, t);
	}), O(i), rr(e, i), Ue();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function fi(e) {
	return {
		[ei]: !0,
		mount(t, n, r) {
			let i = Ar({ ...n }), a = ur(di, {
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
					mr(a).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function pi(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return $r(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? $r(a, i) : o;
}
// packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var mi = 900, hi = 24, gi = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function _i(e) {
	return gi.has(e) ? !0 : e.startsWith("max-w-");
}
function vi(e) {
	let t = [], n = [];
	for (let r of e) _i(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function yi(e, t, n, r = hi) {
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
function bi(e, t) {
	t.visible ? (e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`) : e.style.display = "none";
}
function xi(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = vi(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		bi(a, yi(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, mi);
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
function Si(e) {
	return xi(e);
}
// packages/plugins/calendar-holidays/src/messages.ts
var Ci = {
	"zh-cn": {
		"plugin.name": "法定节假日",
		"plugin.description": "在课表中展示法定节假日",
		"mine.title": "法定节假日",
		"screen.title": "法定节假日",
		"screen.intro.body": "点击同步按钮，获取国务院公布的放假安排并在课表标注。仅标记放假，不包含调休补班。",
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
		"screen.title": "Public Holidays",
		"screen.intro.body": "Click Sync to fetch official public holiday schedules and mark them on your timetable. Only rest days are marked; makeup workdays are excluded.",
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
}, wi = "tool-calendar-holidays", Ti = "https://fastly.jsdelivr.net/gh/NateScarlet/holiday-cn@master", Ei = {
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
function Di(e) {
	return e.days.filter((e) => e.isOffDay).map((e) => ({
		date: e.date,
		label: e.name
	}));
}
async function Oi(e, t) {
	let n = `${Ti}/${t}.json`;
	try {
		let t = await e.request(n, {
			method: "GET",
			timeoutMs: 15e3
		});
		if (!t.ok) throw Error(`HTTP ${t.status}`);
		return {
			holidays: Di(await t.json()),
			source: "remote"
		};
	} catch (e) {
		let n = Ei[t];
		return n ? {
			holidays: Di(n),
			source: "bundled"
		} : (console.warn(`[calendar-holidays] No holiday-cn data for ${t}`, e), {
			holidays: [],
			source: "unavailable"
		});
	}
}
async function ki(e, t) {
	let n = await Promise.all(t.map((t) => Oi(e, t))), r = {}, i = {};
	return t.forEach((e, t) => {
		let a = n[t];
		r[e] = a.holidays, i[e] = a.source;
	}), {
		byYear: r,
		sourceByYear: i
	};
}
// packages/plugins/calendar-holidays/src/holiday-sync.ts
var Ai = /* @__PURE__ */ new Map(), ji = 216e5;
async function Mi(e) {
	let t = e.service(Qr), n = 0;
	for (let r of await t.listTimetables()) (await t.getTimetable(r.id))?.academicConfig.holidayCalendar && (await e.actions.updateTimetableDetails(r.id, { academicConfig: { holidayCalendar: void 0 } }), n += 1);
	return n;
}
function Ni(e, t, n = Date.now()) {
	if (!e) return !0;
	let r = new Set(e.syncedYears ?? []);
	return t.some((t) => {
		let n = e.sourceByYear?.[t];
		return n && n !== "remote" || !r.has(t);
	}) ? !e.lastAttemptedAt || n - e.lastAttemptedAt >= ji : !1;
}
async function Pi(e, t = {}) {
	let n = e.state.currentTimetable;
	if (!n) throw Error("No active timetable");
	let r = n.id, i = Ai.get(r);
	if (i) return i;
	let a = Fi(e, r, n.academicConfig, t).finally(() => {
		Ai.delete(r);
	});
	return Ai.set(r, a), a;
}
async function Fi(e, t, n, r) {
	let i = Jr(n), a = await e.service(Qr).getTimetable(t);
	if (!a) throw Error(`Timetable not found: ${t}`);
	if (!r.force && !Ni(a.academicConfig.holidayCalendar, i)) return !1;
	let o = await ki(e.service(Zr), i), s = a.academicConfig.holidayCalendar, c = /* @__PURE__ */ new Set([...Object.keys(s?.sourceByYear ?? {}).map(Number), ...(s?.holidays ?? []).map((e) => Number(e.date.slice(0, 4)))]), l = { ...s?.sourceByYear }, u = /* @__PURE__ */ new Map();
	for (let e of s?.holidays ?? []) {
		let t = Number(e.date.slice(0, 4)), n = u.get(t) ?? [];
		n.push(e), u.set(t, n);
	}
	let d = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = o.sourceByYear[e];
		t === "unavailable" ? l[e] = c.has(e) ? "cached" : "unavailable" : (l[e] = t, u.set(e, o.byYear[e]), t === "remote" && d.add(e));
	}
	let f = [...u.values()].flat().sort((e, t) => e.date.localeCompare(t.date)), p = i.some((e) => l[e] !== "unavailable"), m = Object.entries(l).filter(([, e]) => e === "remote").map(([e]) => Number(e)).sort((e, t) => e - t), h = {
		holidays: f,
		syncedAt: d.size > 0 ? Date.now() : s?.syncedAt,
		syncedYears: m,
		sourceByYear: l,
		lastAttemptedAt: Date.now()
	};
	if (await e.actions.updateTimetableDetails(t, { academicConfig: { holidayCalendar: h } }), !p) {
		let e = i.filter((e) => l[e] === "unavailable");
		throw Error(`No holiday data available for years: ${e.join(", ")}`);
	}
	return !0;
}
// packages/plugins/calendar-holidays/src/index.ts
function Ii(e = {}) {
	let { screenComponent: t } = e, n;
	return ri({
		id: wi,
		messages: Ci,
		nameKey: "plugin.name",
		descriptionKey: "plugin.description",
		category: "tool",
		toolGroup: "utility",
		order: 45,
		author: "Chronos",
		homepage: "https://github.com/NateScarlet/holiday-cn",
		allowedDomains: ["fastly.jsdelivr.net", "raw.githubusercontent.com"],
		apply(e, r) {
			n = e, e.registerSlot("mine.item", {
				id: "holiday-calendar",
				sectionId: "data-sync",
				title: () => r("mine.title"),
				href: `/plugins/${wi}`,
				icon: "event",
				iconTone: "secondary",
				order: 25
			}), e.registerSlot("shell.route.screen", {
				id: wi,
				title: () => r("screen.title"),
				...t ? { component: t } : {}
			});
		},
		async dispose() {
			let e = n;
			n = void 0, e && await Mi(e);
		}
	});
}
// packages/plugins/calendar-holidays/src/HolidayCalendarScreen.svelte
var Li = /* @__PURE__ */ tr("<p class=\"text-body-small text-amber-700 dark:text-amber-300\"> </p>"), Ri = /* @__PURE__ */ tr("<p class=\"text-body-medium py-6 text-center text-on-surface-variant\"> </p>"), zi = /* @__PURE__ */ tr("<li class=\"py-3\"><span class=\"text-body-medium text-on-surface\"> </span></li>"), Bi = /* @__PURE__ */ tr("<ul class=\"divide-y divide-outline/10\"></ul>"), Vi = /* @__PURE__ */ tr("<div class=\"mt-3 flex flex-col gap-4\"></div>"), Hi = /* @__PURE__ */ tr("<p class=\"text-body-small text-error\"> </p>"), Ui = /* @__PURE__ */ tr("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><div class=\"secondary-scroll min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]\"><section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack\"><p class=\"text-body-medium text-on-surface-variant\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button> <!> <div class=\"flex items-center justify-between gap-3\"><a class=\"text-body-small shrink-0 text-primary\" href=\"https://github.com/NateScarlet/holiday-cn\" target=\"_blank\" rel=\"noreferrer\"> </a> <p class=\"text-body-small text-supporting text-right text-on-surface-variant\"> </p></div></div></section> <section class=\"ui-section-surface ui-section-surface--comfortable\"><h3 class=\"text-title-small text-on-surface\"> </h3> <!></section> <!></div></div></div>");
function Wi(e, t) {
	He(t, !0);
	let n = /* @__PURE__ */ P(!1), r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ ot(() => ii(t.controller.snapshot)), a = /* @__PURE__ */ ot(() => Z(i).current.currentTimetable), o = /* @__PURE__ */ ot(() => Z(a)?.academicConfig.holidayCalendar), s = /* @__PURE__ */ ot(() => Z(a) && Z(o) ? qr(Z(o).holidays, Z(a).academicConfig) : []), c = /* @__PURE__ */ ot(() => p(Z(s))), l = /* @__PURE__ */ ot(() => !!Z(o)?.syncedAt), u = /* @__PURE__ */ ot(() => g(Z(o)?.sourceByYear)), d = {
		bundled: "screen.sync.source.bundled",
		cached: "screen.sync.source.cached",
		unavailable: "screen.sync.source.unavailable"
	};
	function f(e) {
		return Z(i).current.slotVersion, pi(t.controller, wi, Ci, e);
	}
	function p(e) {
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
	function m(e, t) {
		let n = /* @__PURE__ */ new Date(`${e.date}T12:00:00`), r = Lr(e.date), i = n.toLocaleDateString(t, { weekday: "short" });
		return f("screen.list.row").replace("{date}", r).replace("{label}", e.label).replace("{weekday}", i);
	}
	function h(e) {
		if (!e) return f("screen.sync.never");
		let t = new Date(e), n = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0"), a = String(t.getHours()).padStart(2, "0"), o = String(t.getMinutes()).padStart(2, "0"), s = Lr(`${n}-${r}-${i}`);
		return f("screen.sync.last").replace("{time}", `${s} ${a}:${o}`);
	}
	function g(e) {
		if (!e) return [];
		let t = [];
		for (let n of [
			"bundled",
			"cached",
			"unavailable"
		]) {
			let r = Object.entries(e).filter(([, e]) => e === n).map(([e]) => e).sort();
			r.length > 0 && t.push(f(d[n]).replace("{years}", r.join("、")));
		}
		return t;
	}
	async function _() {
		if (!Z(a)) F(r, f("screen.error.noTimetable"), !0);
		else {
			F(n, !0), F(r, null);
			try {
				let e = t.controller.getPluginContext(t.pluginId);
				await Pi(e, { force: !0 }), e.actions.notify(f("screen.notify.synced"), "info");
			} catch (e) {
				F(r, e instanceof Error ? e.message : f("screen.error.syncFailed"), !0);
			} finally {
				F(n, !1);
			}
		}
	}
	var v = Ui(), y = L(v), b = L(y), x = L(b), S = L(x), ee = L(S), C = R(ee, !0), w = Jt(ee, 2), te = R(w, !0), ne = Jt(w, 2);
	br(ne, 16, () => Z(u), (e) => e, (e, t) => {
		var n = Li(), r = R(n, !0);
		un(() => $(r, t)), rr(e, n);
	});
	var re = Jt(ne, 2), ie = L(re), ae = R(ie, !0), oe = R(Jt(ie, 2), !0);
	O(re), O(S), O(x);
	var se = Jt(x, 2), ce = L(se), le = R(ce, !0), ue = Jt(ce, 2), de = (e) => {
		var t = Ri(), n = R(t, !0);
		un((e) => $(n, e), [() => Z(o)?.holidays.length ? f("screen.list.empty") : f("screen.list.emptyHint")]), rr(e, t);
	}, fe = (e) => {
		var t = Vi();
		br(t, 21, () => Z(c), (e) => e.key, (e, t) => {
			var n = Bi();
			br(n, 21, () => Z(t).items, (e) => e.date, (e, t) => {
				var n = zi(), r = R(L(n), !0);
				O(n), un((e) => $(r, e), [() => m(Z(t), ai(Z(i).current.locale))]), rr(e, n);
			}), O(n), rr(e, n);
		}), O(t), rr(e, t);
	};
	gr(ue, (e) => {
		Z(s).length === 0 ? e(de) : e(fe, -1);
	}), O(se);
	var pe = Jt(se, 2), me = (e) => {
		var t = Hi(), n = R(t, !0);
		un(() => $(n, Z(r))), rr(e, t);
	};
	gr(pe, (e) => {
		Z(r) && e(me);
	}), O(b), O(y), Dr(y, (e) => Si?.(e)), O(v), un((e, t, r, i, o) => {
		$(C, e), w.disabled = Z(n) || !Z(a), $(te, t), $(ae, r), $(oe, i), $(le, o);
	}, [
		() => f("screen.intro.body"),
		() => Z(n) ? f("screen.sync.syncing") : Z(l) ? f("screen.sync.resync") : f("screen.sync.action"),
		() => f("screen.intro.source"),
		() => h(Z(o)?.syncedAt),
		() => f("screen.list.heading")
	]), qn("click", w, _), rr(e, v), Ue();
}
Q(["click"]);
// packages/plugins/calendar-holidays/bundle/entry.ts
var Gi = Ii({ screenComponent: fi(Wi) });
export { Gi as default };
