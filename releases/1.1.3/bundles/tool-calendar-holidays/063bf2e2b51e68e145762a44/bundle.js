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
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, ee = 1 << 25, C = 65536, te = 1 << 19, ne = 1 << 20, re = 1 << 25, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, w = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = new class extends Error {
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
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
	return D(/* @__PURE__ */ Gt(E));
}
function O(t) {
	if (T) {
		if (/* @__PURE__ */ Gt(E) !== null) throw he(), e;
		E = t;
	}
}
function ye(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ Gt(n);
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
		var i = /* @__PURE__ */ Gt(n);
		e && n.remove(), n = i;
	}
}
function xe(t) {
	if (!t || t.nodeType !== 8) throw he(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
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
		for (var r of n) rn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, k = t.p, We(e);
}
function We(e = {}) {
	return o(e, se, { value: !0 }), e;
}
function Ge() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var Ye = ~(v | y | _);
function A(e, t) {
	e.f = e.f & Ye | t;
}
function Xe(e) {
	e.f & 512 || e.deps === null ? A(e, _) : A(e, y);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function Ze(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), A(e, _);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Qe(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
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
		c(), f(), tt();
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
	return G !== null && (G.f |= te), {
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
	var a = void 0, o = At(t), s = !H, c = /* @__PURE__ */ new Set();
	return sn(() => {
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
			l?.(), c.delete(n), t !== it && (r.activate(), t ? (o.f |= oe, Pt(o, t)) : (o.f & 8388608 && (o.f ^= oe), Pt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), nn(() => {
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
	if (!e.equals(t) && (e.wv = jn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), mt?.capture(e, t, !0)), e.deps === null))) {
		A(e, _);
		return;
	}
	Cn || (M === null ? Xe(e) : (tn() || j?.is_fork) && M.set(e, t));
}
function dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Qe(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = m), Ln(t, 0), fn(t));
}
function ft(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Rn(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
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
				throw Dt(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (vt = null, yt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Et(e, t);
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
		this.#r.clear(), mt = this, wt(n), wt(t), mt = null, this.#s?.resolve();
		var o = j;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (P.clear(), o.#_());
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
			bt = 0, ht = null, vt = null, yt = null, _t = !1, j = null, M = null, P.clear();
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
		if (ht = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
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
var N = null;
function wt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Mn(r) && (N = /* @__PURE__ */ new Set(), Rn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && hn(r), N?.size > 0)) {
				P.clear();
				for (let e of N) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) N.has(n) && (N.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Rn(n);
					}
				}
				N.clear();
			}
		}
		N = null;
	}
}
function Tt(e) {
	j.schedule(e);
}
function Et(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, _);
		for (var n = e.first; n !== null;) Et(n, t), n = n.next;
	}
}
function Dt(e) {
	A(e, _);
	for (var t = e.first; t !== null;) Dt(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Ot = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Map(), kt = !1;
function At(e, t) {
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
function F(e, t) {
	let n = At(e, t);
	return Tn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function jt(e, t = !1, n = !0) {
	let r = At(e);
	return t || (r.equals = we), r;
}
function I(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && Ge() && H.f & 4325394 && (q === null || !q.has(e)) && Me(), Pt(e, n ? Rt(t) : t, yt);
}
var Mt = null, Nt = 0;
function Pt(e, t, n = null) {
	if (!e.equals(t)) {
		Cn ? P.set(e, t) : P.has(e) || P.set(e, e.v);
		var r = St.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && lt(t), M === null && Xe(t);
		}
		e.wv = jn(), Mt = null, Nt = 0, Lt(e, v, n), Mt = null, Ge() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? En([e]) : X.push(e)), !r.is_fork && Ot.size > 0 && !kt && Ft();
	}
	return t;
}
function Ft() {
	kt = !1;
	for (let e of Ot) {
		e.f & 1024 && A(e, y);
		let t;
		try {
			t = Mn(e);
		} catch {
			t = !0;
		}
		t && Rn(e);
	}
	Ot.clear();
}
function It(e) {
	I(e, e.v + 1);
}
function Lt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ge(), a = r.length;
		if (Nt += a, Nt > 1e5 && Mt === null && (Mt = /* @__PURE__ */ new Set()), Mt !== null) {
			if (Mt.has(e)) return;
			Mt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & v) === 0;
				if (l && A(s, t), c & 131072) Ot.add(s);
				else if (c & 2) {
					var u = s;
					M?.delete(u), Lt(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && N !== null && N.add(d), n === null ? Tt(d) : n.push(d);
				}
			}
		}
	}
}
function Rt(e) {
	if (typeof e != "object" || !e || w in e || se in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ F(0), c = null, f = kn, p = (e) => {
		if (kn === f) return e();
		var t = H, n = kn;
		W(null), An(f);
		var r = e();
		return W(t), An(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ F(e.length, c)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ae();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ F(n.value, c);
				return i.set(t, e), e;
			}) : I(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ F(t, c));
					i.set(n, e), It(o);
				}
			} else I(r, t), It(o);
			return !0;
		},
		get(n, r, a) {
			if (r === w) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || s(n, r)?.writable) && (o = p(() => /* @__PURE__ */ F(Rt(l ? n[r] : t), c)), i.set(r, o)), o !== void 0) {
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
			if (n === w) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || G !== null && (!a || s(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ F(a ? Rt(e[n]) : t, c)), i.set(n, r)), Z(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ F(t, c)), i.set(f + "", m)) : I(m, t);
			}
			if (u === void 0) (!d || s(e, n)?.writable) && (u = p(() => /* @__PURE__ */ F(void 0, c)), I(u, Rt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Rt(r));
				I(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && I(_, v + 1);
				}
				It(o);
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
var zt, Bt, Vt, Ht;
function Ut() {
	if (zt === void 0) {
		zt = window, Bt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Vt = s(t, "firstChild").get, Ht = s(t, "nextSibling").get, f(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), f(n) && (n[fe] = void 0);
	}
}
function L(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Wt(e) {
	return Vt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Gt(e) {
	return Ht.call(e);
}
function R(e, t) {
	if (!T) return /* @__PURE__ */ Wt(e);
	var n = /* @__PURE__ */ Wt(E);
	if (n === null) n = E.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), D(r), r;
	}
	return t && Zt(n), D(n), n;
}
function Kt(e, t = !1) {
	if (!T) return /* @__PURE__ */ Wt(e);
	var n = R(e, t);
	return O(e), n;
}
function qt(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Gt(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = L();
			return r === null ? i?.after(a) : r.before(a), D(a), a;
		}
		Zt(r);
	}
	return D(r), r;
}
function Jt(e) {
	e.textContent = "";
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
	var t = G;
	if (t === null) return H.f |= oe, e;
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
function $t(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function en(e, t) {
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
	if (i !== null && (i.parent = n, n !== null && $t(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function tn() {
	return H !== null && !U;
}
function nn(e) {
	let t = en(8, null);
	return A(t, _), t.teardown = e, t;
}
function rn(e) {
	return en(4 | ne, e);
}
function an(e) {
	St.ensure();
	let t = en(64 | te, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? gn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function on(e) {
	return en(4, e);
}
function sn(e) {
	return en(ae | te, e);
}
function cn(e, t = 0) {
	return en(8 | t, e);
}
function ln(e, t = [], n = [], r = []) {
	$e(r, t, n, (t) => {
		en(8, () => {
			e(...t.map(Z));
		});
	});
}
function un(e, t = 0) {
	return en(16 | t, e);
}
function B(e) {
	return en(32 | te, e);
}
function dn(e) {
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
function fn(e, t = !1) {
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
function pn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (mn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, fn(e, t && !n), Ln(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	dn(e), e.f ^= ee, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && hn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function mn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Gt(e);
		e.remove(), e = n;
	}
}
function hn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function gn(e, t, n = !0) {
	var r = [];
	e.f |= 256, _n(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function _n(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				_n(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function vn(e) {
	e.f &= -257, yn(e, !0);
}
function yn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= b, e.f & 1024 || (A(e, v), St.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			yn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function bn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Gt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var xn = null, Sn = !1, Cn = !1;
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
		a.f & 2 ? Nn(a, t, !1) : t === a && (n ? A(a, v) : a.f & 1024 && A(a, y), Tt(a));
	}
}
function Pn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = k, s = U, c = kn, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Le(e.ctx), U = !1, kn = ++On, e.ac !== null && (Qe(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= S;
		var f = Fn(e);
		if (Ge() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Nn(X[p], e);
		if (i !== null && i !== e) {
			if (On++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = On;
			if (t !== null) for (let e of t) e.rv = On;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return Fn(e), Qt(t);
	} finally {
		e.f ^= ie, J = t, Y = n, X = r, H = i, q = a, Le(o), U = s, kn = c;
	}
}
function Fn(e) {
	var t = e.deps, n = j?.is_fork;
	if (J !== null) {
		var r;
		if (n || Ln(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (tn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
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
		var n = G, r = Sn;
		G = e, Sn = !(t & 96);
		try {
			t & 16777232 ? pn(e) : fn(e), dn(e);
			var i = Pn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Dn;
		} finally {
			Sn = r, G = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (xn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < On && (e.rv = On, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], i.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : i.call(r, H) || r.push(H);
		}
	}
	if (Cn && P.has(e)) return P.get(e);
	if (t) {
		var a = e;
		if (Cn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Bn(a)) && (o = lt(a)), P.set(a, o), o;
		}
		var s = !(a.f & 512) && !U && H !== null && (Sn || !!(H.f & 512)), c = (a.f & S) === 0;
		Mn(a) && (s && (a.f |= 512), ut(a)), s && !c && (ft(a), zn(a));
	}
	if (M?.has(e)) return M.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function zn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (ft(t), zn(t));
}
function Bn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (P.has(t) || t.f & 2 && Bn(t)) return !0;
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
		if (w in e) Un(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && w in n && Un(n);
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
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
			e[Wn] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var Zn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Qn(e) {
	return Zn?.createHTML(e) ?? e;
}
function $n(e) {
	var t = Xt("template");
	return t.innerHTML = Qn(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
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
		i === void 0 && (i = $n(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Wt(i)));
		var t = r || Bt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Wt(t), s = t.lastChild;
			er(o, s);
		} else er(t, t);
		return t;
	};
}
function nr(e, t) {
	if (T) {
		var n = G;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = E), ve();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var rr = ["touchstart", "touchmove"];
function ir(e) {
	return rr.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function ar(e) {
	let t = 0, n = At(0), r;
	return () => {
		tn() && (Z(n), cn(() => (t === 0 && (r = Vn(() => e(() => It(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, It(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var or = C | te;
function sr(e, t, n, r) {
	new cr(e, t, n, r);
}
var cr = class {
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
	#h = ar(() => (this.#m = At(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = un(() => {
			if (T) {
				let e = this.#t;
				ve();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, or), T && (this.#e = E);
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
			if (t) {
				ge();
				return;
			}
			t = !0, n && Ne(), this.#s !== null && gn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = L(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
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
			}), this.#a === null) {
				this.#c = null, n && this.#x(j);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, gn(this.#o, () => {
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
				bn(this.#a, e);
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
		Ze(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = k;
		K(this.#i), W(this.#i), Le(this.#i.ctx);
		try {
			return St.ensure(), e();
		} finally {
			K(t), W(n), Le(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Pt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), T && (D(this.#t), ye(), D(be()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
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
function lr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function ur(e, t) {
	return fr(e, t);
}
var dr = /* @__PURE__ */ new Map();
function fr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Ut();
	var u = void 0, d = an(() => {
		var c = r ?? n.appendChild(L());
		sr(c, { pending: () => {} }, (n) => {
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
					var i = ir(r);
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
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
			if (n) vn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (vn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						bn(r, t), t.append(L()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), gn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = Yt();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = L();
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
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
	un(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function _r(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		gn(n, () => {
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
			Jt(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= re, bn(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var yr;
function br(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = T ? D(/* @__PURE__ */ Wt(u)) : u.appendChild(L());
	}
	T && ve();
	var d = null, f = /* @__PURE__ */ st(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Sr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= re, wr(d, null, c)) : vn(d) : gn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: un(() => {
			p = Z(f);
			var e = p.length;
			let n = !1;
			T && xe(c) === "[!" != (e === 0) && (c = be(), D(c), _e(!1), n = !0);
			for (var a = /* @__PURE__ */ new Set(), u = j, v = Yt(), y = 0; y < e; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (c = E, n = !0, _e(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && Pt(S.v, b), S.i && Pt(S.i, y), v && u.unskip_effect(S.e)) : (S = Cr(l, h ? c : yr ??= L(), b, x, y, o, t, r), h || (S.e.f |= re), l.set(x, S)), a.add(x);
			}
			if (e === 0 && s && !d && (h ? d = B(() => s(c)) : (d = B(() => s(yr ??= L())), d.f |= re)), e > a.size && Oe("", "", ""), T && e > 0 && D(be()), !h) {
				if (m.set(u, a), v) {
					for (let [e, t] of l) a.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			n && _e(!0), Z(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, T && (c = E);
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
		if (_.f & 8192 && (vn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= re, _ === l) wr(_, null, n);
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
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			_r(e, C, ne);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Cr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? At(n) : /* @__PURE__ */ jt(n, !1, !1) : null, l = o & 2 ? At(i) : null;
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
		var o = /* @__PURE__ */ Gt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Tr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Er(e, t, n) {
	var r;
	T && (r = E, ve());
	var i = new hr(e);
	un(() => {
		var e = t() ?? null;
		if (T && xe(r) === "[" != (e !== null)) {
			var a = be();
			D(a), i.anchor = a, _e(!1), i.ensure(e, e && ((t) => n(t, e))), _e(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Dr(e, t, n) {
	on(() => {
		var r = Vn(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			cn(() => {
				var e = n();
				Hn(e), i && Ce(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function Or(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), m;
	let r = Vn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
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
		if (t === w || t === ce) return !1;
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
//#endregion
//#region packages/core/src/domain/preferences.ts
var Pr = {
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
function $(e) {
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
	return Fr(Lr($(e)));
}
function Ur(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region packages/core/src/algorithms/calendar.ts
var Wr = class {
	normalizeTermStartDate(e, t) {
		let n = $(Hr(t));
		if (!e || !e.trim()) return Fr(Lr(n));
		try {
			return Fr(Lr($(e)));
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
		}, r = $(this.normalizeTermStartDate(n.termStartDate, e)), i = $(e);
		if (Vr(i, r)) return n.startWeek;
		let a = Br(r, i);
		return Math.min(Math.max(n.startWeek + a, n.startWeek), n.endWeek);
	}
	resolveWeekStart(e, t, n) {
		return Fr(zr($(this.normalizeTermStartDate(e.termStartDate, n)), t - e.startWeek));
	}
	resolveCourseDate(e, t, n, r) {
		return Fr(Rr($(this.resolveWeekStart(e, t, r)), n - 1));
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
	let n = new Wr(), r = $(n.resolveWeekStart(e, e.startWeek, t)), i = Rr($(n.resolveWeekStart(e, e.endWeek, t)), 6);
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
	return "1.1.3";
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
	let t, n = ar((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return tn() ? (n(), t) : jr(e);
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
//#region packages/ui-kit/src/form/TimePicker.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Q(["input"]), Q(["change"]), Q(["change"]), Q(["change"]), Q([
	"click",
	"pointerdown",
	"pointerup"
]), Q(["change"]), Pr.hapticFeedbackEnabled, Q(["click"]), Q(["click"]), Q(["click", "keydown"]), Pr.reduceMotionEnabled, Q(["pointerdown"]), Q(["keydown", "click"]), Q(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [oi, si] = Re();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Q(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var ci = /* @__PURE__ */ tr("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function li(e, t) {
	He(t, !0);
	let n = /* @__PURE__ */ ot(() => t.component), r = /* @__PURE__ */ ot(() => ai(t.propsStore).current);
	var i = ci();
	Er(R(i), () => Z(n), (e, t) => {
		t(e, Nr(() => Z(r)));
	}), O(i), nr(e, i), Ue();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ui(e) {
	return {
		[ti]: !0,
		mount(t, n, r) {
			let i = Ar({ ...n }), a = ur(li, {
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
					mr(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function di(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return ei(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? ei(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var fi = 900, pi = 24, mi = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function hi(e) {
	return mi.has(e) ? !0 : e.startsWith("max-w-");
}
function gi(e) {
	let t = [], n = [];
	for (let r of e) hi(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function _i(e, t, n, r = pi) {
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
function vi(e, t) {
	if (!t.visible) {
		e.style.display = "none";
		return;
	}
	e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`;
}
function yi(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = gi(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		vi(a, _i(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, fi);
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
function bi(e) {
	return yi(e);
}
//#endregion
//#region packages/plugins/calendar-holidays/src/messages.ts
var xi = {
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
}, Si = "tool-calendar-holidays", Ci = "https://fastly.jsdelivr.net/gh/NateScarlet/holiday-cn@master", wi = {
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
function Ti(e) {
	return e.days.filter((e) => e.isOffDay).map((e) => ({
		date: e.date,
		label: e.name
	}));
}
async function Ei(e, t) {
	let n = `${Ci}/${t}.json`;
	try {
		let t = await e.request(n, {
			method: "GET",
			timeoutMs: 15e3
		});
		if (!t.ok) throw Error(`HTTP ${t.status}`);
		return {
			holidays: Ti(await t.json()),
			source: "remote"
		};
	} catch (e) {
		let n = wi[t];
		return n ? {
			holidays: Ti(n),
			source: "bundled"
		} : (console.warn(`[calendar-holidays] No holiday-cn data for ${t}`, e), {
			holidays: [],
			source: "unavailable"
		});
	}
}
async function Di(e, t) {
	let n = await Promise.all(t.map((t) => Ei(e, t))), r = {}, i = {};
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
var Oi = /* @__PURE__ */ new Map(), ki = 216e5;
async function Ai(e) {
	return Kr(e.service($r));
}
function ji(e, t, n = Date.now()) {
	if (!e) return !0;
	let r = new Set(e.syncedYears ?? []);
	return t.some((t) => {
		let n = e.sourceByYear?.[t];
		return n && n !== "remote" || !r.has(t);
	}) ? !e.lastAttemptedAt || n - e.lastAttemptedAt >= ki : !1;
}
async function Mi(e, t = {}) {
	let n = e.state.currentTimetable;
	if (!n) throw Error("No active timetable");
	let r = n.id, i = Oi.get(r);
	if (i) return i;
	let a = Pi(e, r, n.academicConfig, t).finally(() => {
		Oi.delete(r);
	});
	return Oi.set(r, a), a;
}
async function Ni(e, t = {}) {
	return e.state.currentTimetable ? Mi(e, t) : !1;
}
async function Pi(e, t, n, r) {
	let i = Yr(n), a = e.service($r), o = await a.getTimetable(t);
	if (!o) throw Error(`Timetable not found: ${t}`);
	if (!r.force && !ji(o.academicConfig.holidayCalendar, i)) return !1;
	let s = await Di(e.service(Qr), i), c = o.academicConfig.holidayCalendar, l = /* @__PURE__ */ new Set([...Object.keys(c?.sourceByYear ?? {}).map(Number), ...(c?.holidays ?? []).map((e) => Number(e.date.slice(0, 4)))]), u = { ...c?.sourceByYear }, d = /* @__PURE__ */ new Map();
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
function Fi(e = {}) {
	let { screenComponent: t } = e, n;
	return ii({
		id: Si,
		messages: xi,
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
				href: `/plugins/${Si}`,
				icon: "event",
				iconTone: "secondary",
				keywords: i,
				order: 25
			}), e.registerSlot("shell.route.screen", {
				id: Si,
				title: () => r("screen.title"),
				...t ? { component: t } : {}
			});
			try {
				await Ni(e);
			} catch {
				e.actions.notify(r("screen.error.syncFailed"), "warn");
			}
			e.on("timetable:switched", async () => {
				try {
					await Ni(e);
				} catch {}
			});
		},
		async dispose() {
			let e = n;
			n = void 0, e && await Ai(e);
		}
	});
}
//#endregion
//#region packages/plugins/calendar-holidays/src/HolidayCalendarScreen.svelte
var Ii = /* @__PURE__ */ tr("<p class=\"text-body-small text-amber-700 dark:text-amber-300\"> </p>"), Li = /* @__PURE__ */ tr("<p class=\"text-body-medium py-6 text-center text-on-surface-variant\"> </p>"), Ri = /* @__PURE__ */ tr("<li class=\"py-3\"><span class=\"text-body-medium text-on-surface\"> </span></li>"), zi = /* @__PURE__ */ tr("<ul class=\"divide-y divide-outline/10\"></ul>"), Bi = /* @__PURE__ */ tr("<div class=\"mt-3 flex flex-col gap-4\"></div>"), Vi = /* @__PURE__ */ tr("<p class=\"text-body-small text-error\"> </p>"), Hi = /* @__PURE__ */ tr("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><div class=\"secondary-scroll min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]\"><section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack\"><p class=\"text-body-medium text-on-surface-variant\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-filled ui-btn-block\"> </button> <!> <div class=\"flex items-center justify-between gap-3\"><a class=\"text-body-small shrink-0 text-primary\" href=\"https://github.com/NateScarlet/holiday-cn\" target=\"_blank\" rel=\"noreferrer\"> </a> <p class=\"text-body-small text-right text-on-surface-variant\"> </p></div></div></section> <section class=\"ui-section-surface ui-section-surface--comfortable\"><h3 class=\"text-title-small text-on-surface\"> </h3> <!></section> <!></div></div></div>");
function Ui(e, t) {
	He(t, !0);
	let n = /* @__PURE__ */ F(!1), r = /* @__PURE__ */ F(null), i = /* @__PURE__ */ ot(() => t.controller.currentTimetable), a = /* @__PURE__ */ ot(() => Z(i)?.academicConfig.holidayCalendar), o = /* @__PURE__ */ ot(() => Z(i) && Z(a) ? Jr(Z(a).holidays, Z(i).academicConfig) : []), s = /* @__PURE__ */ ot(() => f(Z(o))), c = /* @__PURE__ */ ot(() => !!Z(a)?.syncedAt), l = /* @__PURE__ */ ot(() => h(Z(a)?.sourceByYear)), u = {
		bundled: "screen.sync.source.bundled",
		cached: "screen.sync.source.cached",
		unavailable: "screen.sync.source.unavailable"
	};
	function d(e) {
		return di(t.controller, Si, xi, e);
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
		if (!Z(i)) {
			I(r, d("screen.error.noTimetable"), !0);
			return;
		}
		I(n, !0), I(r, null);
		try {
			let e = t.controller.getPluginContext(t.pluginId);
			await Mi(e, { force: !0 }), e.actions.notify(d("screen.notify.synced"), "info");
		} catch (e) {
			I(r, e instanceof Error ? e.message : d("screen.error.syncFailed"), !0);
		} finally {
			I(n, !1);
		}
	}
	var _ = Hi(), v = R(_), y = R(v), b = R(y), x = R(b), S = R(x), ee = Kt(S, !0), C = qt(S, 2), te = Kt(C, !0), ne = qt(C, 2);
	br(ne, 16, () => Z(l), (e) => e, (e, t) => {
		var n = Ii(), r = Kt(n, !0);
		ln(() => lr(r, t)), nr(e, n);
	});
	var re = qt(ne, 2), ie = R(re), ae = Kt(ie, !0), oe = Kt(qt(ie, 2), !0);
	O(re), O(x), O(b);
	var w = qt(b, 2), se = R(w), ce = Kt(se, !0), le = qt(se, 2), ue = (e) => {
		var t = Li(), n = Kt(t, !0);
		ln((e) => lr(n, e), [() => Z(a)?.holidays.length ? d("screen.list.empty") : d("screen.list.emptyHint")]), nr(e, t);
	}, de = (e) => {
		var n = Bi();
		br(n, 21, () => Z(s), (e) => e.key, (e, n) => {
			var r = zi();
			br(r, 21, () => Z(n).items, (e) => e.date, (e, n) => {
				var r = Ri(), i = Kt(R(r), !0);
				O(r), ln((e) => lr(i, e), [() => p(Z(n), t.controller.currentLocale)]), nr(e, r);
			}), O(r), nr(e, r);
		}), O(n), nr(e, n);
	};
	gr(le, (e) => {
		Z(o).length === 0 ? e(ue) : e(de, -1);
	}), O(w);
	var fe = qt(w, 2), pe = (e) => {
		var t = Vi(), n = Kt(t, !0);
		ln(() => lr(n, Z(r))), nr(e, t);
	};
	gr(fe, (e) => {
		Z(r) && e(pe);
	}), O(y), O(v), Dr(v, (e) => bi?.(e)), O(_), ln((e, t, r, a, o) => {
		lr(ee, e), C.disabled = Z(n) || !Z(i), lr(te, t), lr(ae, r), lr(oe, a), lr(ce, o);
	}, [
		() => d("screen.intro.body"),
		() => Z(n) ? d("screen.sync.syncing") : Z(c) ? d("screen.sync.resync") : d("screen.sync.action"),
		() => d("screen.intro.source"),
		() => m(Z(a)?.syncedAt),
		() => d("screen.list.heading")
	]), qn("click", C, g), nr(e, _), Ue();
}
Q(["click"]);
//#endregion
//#region packages/plugins/calendar-holidays/bundle/entry.ts
var Wi = Fi({ screenComponent: ui(Ui) });
//#endregion
export { Wi as default };
