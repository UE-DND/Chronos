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
var _ = 1024, v = 2048, y = 4096, b = 8192, x = 16384, S = 32768, ee = 1 << 25, C = 65536, te = 1 << 19, ne = 1 << 20, re = 1 << 25, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("component"), le = Symbol("legacy props"), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
function he() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ge(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function _e() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function ve(e) {
	w = e;
}
var T;
function E(t) {
	if (t === null) throw ge(), e;
	return T = t;
}
function ye() {
	return E(/* @__PURE__ */ I(T));
}
function D(t) {
	if (w) {
		if (/* @__PURE__ */ I(T) !== null) throw ge(), e;
		T = t;
	}
}
function be(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ I(n);
		T = n;
	}
}
function xe(e = !0) {
	for (var t = 0, n = T;;) {
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
function Se(t) {
	if (!t || t.nodeType !== 8) throw ge(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
function Ce(e) {
	return e === this.v;
}
function we(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Te(e) {
	return !we(e, this.v);
}
function Ee(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function De() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
function Oe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function ke(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ae(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function je() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Me(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ne() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Pe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Fe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ie() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Le() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
function Re(e, t, n) {
	let r = {};
	return [
		() => (n(r) || De(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function ze(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Be(e, t) {
	return e === null && Ee(t), e.c ??= new Map(ze(e) || void 0);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
var O = null;
function Ve(e) {
	O = e;
}
function He() {
	return Re(Ue, We, Ge);
}
function Ue(e) {
	return Be(O, "getContext").get(e);
}
function We(e, t) {
	return Be(O, "setContext").set(e, t), t;
}
function Ge(e) {
	return Be(O, "hasContext").has(e);
}
function Ke(e, t = !1, n) {
	O = {
		p: O,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: null
	};
}
function qe(e) {
	var t = O, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) un(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, O = t.p, Je(e);
}
function Je(e = {}) {
	return o(e, ce, { value: !0 }), e;
}
function Ye() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var Xe = [];
function Ze() {
	var e = Xe;
	Xe = [], h(e);
}
function Qe(e) {
	if (Xe.length === 0 && !bt) {
		var t = Xe;
		queueMicrotask(() => {
			t === Xe && Ze();
		});
	}
	Xe.push(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var $e = ~(v | y | _);
function k(e, t) {
	e.f = e.f & $e | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? k(e, _) : k(e, y);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, _);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function nt(e) {
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
function rt(e, t, n, r) {
	let i = Ye() ? st : dt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = it(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			at();
		}
	}
	var d = ot();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ lt(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), at();
	}) : f();
}
function it() {
	var e = G, t = H, n = O, r = A;
	return function(i = !0) {
		K(e), W(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function at(e = !0) {
	K(null), W(null), Ve(null), e && A?.deactivate();
}
function ot() {
	var e = G, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function st(e) {
	var n = 2 | v;
	return G !== null && (G.f |= te), {
		ctx: O,
		deps: null,
		effects: null,
		equals: Ce,
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
var ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function lt(e, n, r) {
	let i = G;
	i === null && Oe();
	var a = void 0, o = Ft(t), s = !H, c = /* @__PURE__ */ new Set();
	return pn(() => {
		var t = G, n = g();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== me && n.reject(e);
			}).finally(at);
		} catch (e) {
			n.reject(e), at();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = ot();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ct);
			else for (let e of c.values()) e.reject(ct);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ct && (r.activate(), t ? (o.f |= oe, zt(o, t)) : (o.f & 8388608 && (o.f ^= oe), zt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), cn(() => {
		for (let e of c) e.reject(ct);
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
function ut(e) {
	let t = /* @__PURE__ */ st(e);
	return jn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	let t = /* @__PURE__ */ st(e);
	return t.equals = Te, t;
}
function ft(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function pt(e) {
	var n, r = G, i = e.parent;
	if (!kn && i !== null && e.v !== t && i.f & 24576) return he(), e.v;
	K(i);
	try {
		ft(e), n = Bn(e);
	} finally {
		K(r);
	}
	return n;
}
function mt(e) {
	var t = pt(e);
	if (!e.equals(t) && (e.wv = Ln(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), vt?.capture(e, t, !0)), e.deps === null))) {
		k(e, _);
		return;
	}
	kn || (j === null ? et(e) : (sn() || A?.is_fork) && j.set(e, t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && nt(() => {
		t.ac.abort(me), t.ac = null;
	}), t.fn !== null && (t.teardown = m), Un(t, 0), vn(t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Wn(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var _t = null, A = null, vt = null, j = null, yt = null, bt = !1, xt = !1, St = null, Ct = null, wt = 0, Tt = 1, Et = class e {
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
			for (var r of n.d) k(r, v), t(r);
			for (r of n.m) k(r, y), t(r);
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
		for (let e of this.#u) this.#d.delete(e), k(e, v), this.schedule(e);
		for (let e of this.#d) k(e, y), this.schedule(e);
		this.apply();
		for (var t = St = [], n = [], r = Ct = []; this.#c.length > 0;) {
			wt++ > 1e3 && (this.#S(), Dt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Mt(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (St = null, Ct = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) jt(e, t);
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
		this.#r.clear(), vt = this, kt(n), kt(t), vt = null, this.#s?.resolve();
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (M.clear(), o.#_());
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), A = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), j?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, j = null;
	}
	flush() {
		try {
			xt = !0, A = this, this.#_();
		} finally {
			wt = 0, yt = null, St = null, Ct = null, xt = !1, A = null, j = null, M.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ct);
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
		this.#m || (this.#m = !0, Qe(() => {
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
		if (A === null) {
			let t = A = new e();
			!xt && Qe(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
	}
	schedule(e) {
		if (yt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
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
		Ne();
	} catch (e) {
		R(e, yt);
	}
}
var Ot = null;
function kt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Rn(r) && (Ot = /* @__PURE__ */ new Set(), Wn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && xn(r), Ot?.size > 0)) {
				M.clear();
				for (let e of Ot) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ot.has(n) && (Ot.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Wn(n);
					}
				}
				Ot.clear();
			}
		}
		Ot = null;
	}
}
function At(e) {
	A.schedule(e);
}
function jt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, _);
		for (var n = e.first; n !== null;) jt(n, t), n = n.next;
	}
}
function Mt(e) {
	k(e, _);
	for (var t = e.first; t !== null;) Mt(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Nt = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), Pt = !1;
function Ft(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ce,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Ft(e, t);
	return jn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function It(e, t = !1, n = !0) {
	let r = Ft(e);
	return t || (r.equals = Te), r;
}
function P(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && Ye() && H.f & 4325394 && (q === null || !q.has(e)) && Ie(), zt(e, n ? Ut(t) : t, Ct);
}
var Lt = null, Rt = 0;
function zt(e, t, n = null) {
	if (!e.equals(t)) {
		kn ? M.set(e, t) : M.has(e) || M.set(e, e.v);
		var r = Et.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && pt(t), j === null && et(t);
		}
		e.wv = Ln(), Lt = null, Rt = 0, Ht(e, v, n), Lt = null, Ye() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? Mn([e]) : X.push(e)), !r.is_fork && Nt.size > 0 && !Pt && Bt();
	}
	return t;
}
function Bt() {
	Pt = !1;
	for (let e of Nt) {
		e.f & 1024 && k(e, y);
		let t;
		try {
			t = Rn(e);
		} catch {
			t = !0;
		}
		t && Wn(e);
	}
	Nt.clear();
}
function Vt(e) {
	P(e, e.v + 1);
}
function Ht(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ye(), a = r.length;
		if (Rt += a, Rt > 1e5 && Lt === null && (Lt = /* @__PURE__ */ new Set()), Lt !== null) {
			if (Lt.has(e)) return;
			Lt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & v) === 0;
				if (l && k(s, t), c & 131072) Nt.add(s);
				else if (c & 2) {
					var u = s;
					j?.delete(u), Ht(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && Ot !== null && Ot.add(d), n === null ? At(d) : n.push(d);
				}
			}
		}
	}
}
function Ut(e) {
	if (typeof e != "object" || !e || se in e || ce in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ N(0), c = null, f = Fn, p = (e) => {
		if (Fn === f) return e();
		var t = H, n = Fn;
		W(null), In(f);
		var r = e();
		return W(t), In(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ N(e.length, c)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Pe();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ N(n.value, c);
				return i.set(t, e), e;
			}) : P(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ N(t, c));
					i.set(n, e), Vt(o);
				}
			} else P(r, t), Vt(o);
			return !0;
		},
		get(n, r, a) {
			if (r === se) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || s(n, r)?.writable) && (o = p(() => /* @__PURE__ */ N(Ut(l ? n[r] : t), c)), i.set(r, o)), o !== void 0) {
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
			if (n === se) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || G !== null && (!a || s(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ N(a ? Ut(e[n]) : t, c)), i.set(n, r)), Z(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ N(t, c)), i.set(f + "", m)) : P(m, t);
			}
			if (u === void 0) (!d || s(e, n)?.writable) && (u = p(() => /* @__PURE__ */ N(void 0, c)), P(u, Ut(r)), i.set(n, u));
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
			Z(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = i.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [r, a] of i) a.v !== t && !(r in e) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			Fe();
		}
	});
}
var Wt, Gt, Kt, qt;
function Jt() {
	if (Wt === void 0) {
		Wt = window, Gt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Kt = s(t, "firstChild").get, qt = s(t, "nextSibling").get, f(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), f(n) && (n[pe] = void 0);
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
function I(e) {
	return qt.call(e);
}
function L(e, t) {
	if (!w) return /* @__PURE__ */ Yt(e);
	var n = /* @__PURE__ */ Yt(T);
	if (n === null) n = T.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), E(r), r;
	}
	return t && nn(n), E(n), n;
}
function Xt(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ Yt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ I(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = F();
			return T?.before(r), E(r), r;
		}
		nn(T);
	}
	return T;
}
function Zt(e, t = !1) {
	if (!w) return /* @__PURE__ */ Yt(e);
	var n = L(e, t);
	return D(e), n;
}
function Qt(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ I(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		nn(r);
	}
	return E(r), r;
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
	var t = G;
	if (t === null) return H.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	R(e, t);
}
function R(e, t) {
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
function an(e) {
	G === null && (H === null && Me(e), je()), kn && Ae(e);
}
function on(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = G;
	n !== null && n.f & 8192 && (e |= b);
	var r = {
		ctx: O,
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) St === null ? Et.ensure().schedule(r) : St.push(r);
	else if (t !== null) {
		try {
			Wn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && on(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function sn() {
	return H !== null && !U;
}
function cn(e) {
	let t = z(8, null);
	return k(t, _), t.teardown = e, t;
}
function ln(e) {
	an("$effect");
	var t = G.f;
	if (!H && t & 32 && O !== null && !O.i) {
		var n = O;
		(n.e ??= []).push(e);
	} else return un(e);
}
function un(e) {
	return z(4 | ne, e);
}
function dn(e) {
	Et.ensure();
	let t = z(64 | te, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Sn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function fn(e) {
	return z(4, e);
}
function pn(e) {
	return z(ae | te, e);
}
function mn(e, t = 0) {
	return z(8 | t, e);
}
function hn(e, t = [], n = [], r = []) {
	rt(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(Z));
		});
	});
}
function gn(e, t = 0) {
	return z(16 | t, e);
}
function B(e) {
	return z(32 | te, e);
}
function _n(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = kn, r = H;
		An(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			An(n), W(r);
		}
	}
}
function vn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && nt(() => {
			e.abort(me);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function yn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (bn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, vn(e, t && !n), Un(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	_n(e), e.f ^= ee, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && xn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function bn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ I(e);
		e.remove(), e = n;
	}
}
function xn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Sn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Cn(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Cn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= b;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Cn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function wn(e) {
	e.f &= -257, Tn(e, !0);
}
function Tn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= b, e.f & 1024 || (k(e, v), Et.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Tn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function En(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ I(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Dn = null, On = !1, kn = !1;
function An(e) {
	kn = e;
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
function jn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function Mn(e) {
	X = e;
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
			if (Rn(a) && mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && k(e, _);
	}
	return !1;
}
function zn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? zn(a, t, !1) : t === a && (n ? k(a, v) : a.f & 1024 && k(a, y), At(a));
	}
}
function Bn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = O, s = U, c = Fn, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Ve(e.ctx), U = !1, Fn = ++Pn, e.ac !== null && (nt(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= S;
		var f = Vn(e);
		if (Ye() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) zn(X[p], e);
		if (i !== null && i !== e) {
			if (Pn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Pn;
			if (t !== null) for (let e of t) e.rv = Pn;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return Vn(e), rn(t);
	} finally {
		e.f ^= ie, J = t, Y = n, X = r, H = i, q = a, Ve(o), U = s, Fn = c;
	}
}
function Vn(e) {
	var t = e.deps, n = A?.is_fork;
	if (J !== null) {
		var r;
		if (n || Un(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (sn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Un(e, Y), t.length = Y);
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
	if (a === null && n.f & 2 && (J === null || !i.call(J, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && et(c), c.ac !== null && nt(() => {
			c.ac.abort(me), c.ac = null, k(c, v);
		}), ht(c), Un(c, 0);
	}
}
function Un(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Hn(e, n[r]);
}
function Wn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, _);
		var n = G, r = On;
		G = e, On = !(t & 96);
		try {
			t & 16777232 ? yn(e) : vn(e), _n(e);
			var i = Bn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Nn;
		} finally {
			On = r, G = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (Dn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Pn && (e.rv = Pn, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], i.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : i.call(r, H) || r.push(H);
		}
	}
	if (kn && M.has(e)) return M.get(e);
	if (t) {
		var a = e;
		if (kn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Kn(a)) && (o = pt(a)), M.set(a, o), o;
		}
		var s = !(a.f & 512) && !U && H !== null && (On || !!(H.f & 512)), c = (a.f & S) === 0;
		Rn(a) && (s && (a.f |= 512), mt(a)), s && !c && (gt(a), Gn(a));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Gn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (gt(t), Gn(t));
}
function Kn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && Kn(t)) return !0;
	return !1;
}
function qn(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
function Jn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) Yn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && Yn(n);
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
var Xn = Symbol("events"), Zn = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set();
function $n(e, t, n) {
	(t[Xn] ??= {})[e] = n;
}
function Q(e) {
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
		var d = H, f = G;
		W(null), K(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Xn]?.[r];
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
			e[Xn] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var rr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function ir(e) {
	return rr?.createHTML(e) ?? e;
}
function ar(e) {
	var t = tn("template");
	return t.innerHTML = ir(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function or(e, t) {
	var n = G;
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
		if (w) return or(T, null), T;
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
	if (w) return or(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), or(t, n), e;
}
function lr(e, t) {
	if (w) {
		var n = G;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), ye();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ur = ["touchstart", "touchmove"];
function dr(e) {
	return ur.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function fr(e) {
	let t = 0, n = Ft(0), r;
	return () => {
		sn() && (Z(n), mn(() => (t === 0 && (r = qn(() => e(() => Vt(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Vt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var pr = C | te;
function mr(e, t, n, r) {
	new hr(e, t, n, r);
}
var hr = class {
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
	#h = fr(() => (this.#m = Ft(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = gn(() => {
			if (w) {
				let e = this.#t;
				ye();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, pr), w && (this.#e = T);
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
		Qe(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				_e();
				return;
			}
			t = !0, n && Le(), this.#s !== null && Sn(this.#s, () => {
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
					R(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return B(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						R(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Sn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				En(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		tt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = O;
		K(this.#i), W(this.#i), Ve(this.#i.ctx);
		try {
			return Et.ensure(), e();
		} finally {
			K(t), W(n), Ve(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Sn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
			this.#d = !1, this.#m && zt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), w && (E(this.#t), be(), E(xe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		Qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				R(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => R(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function gr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function _r(e, t) {
	return yr(e, t);
}
var vr = /* @__PURE__ */ new Map();
function yr(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Jt();
	var u = void 0, d = dn(() => {
		var c = r ?? n.appendChild(F());
		mr(c, { pending: () => {} }, (n) => {
			Ke({});
			var r = O;
			if (s && (r.c = s), o && (i.$$events = o), w && or(n, null), u = t(n, i) || Je(), w && (G.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw ge(), e;
			qe();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = dr(r);
					for (let e of [n, document]) {
						var a = vr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), vr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, nr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(Zn)), Qn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = vr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, nr), t.delete(e), t.size === 0 && vr.delete(r)) : t.set(e, i);
			}
			Qn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return br.set(u, d), u;
}
var br = /* @__PURE__ */ new WeakMap();
function xr(e, t) {
	let n = br.get(e);
	return n ? (br.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Sr = class {
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
			if (n) wn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (wn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						En(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Sn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = en();
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function Cr(e, t, n = !1) {
	var r;
	w && (r = T, ye());
	var i = new Sr(e), a = n ? C : 0;
	function o(e, t) {
		if (w) {
			var n = Se(r);
			if (e !== parseInt(n.substring(1))) {
				var a = xe();
				E(a), i.anchor = a, ve(!1), i.ensure(e, t), ve(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	gn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function wr(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Sn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Tr(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		Tr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Tr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= re, En(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var Er;
function Dr(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? E(/* @__PURE__ */ Yt(u)) : u.appendChild(F());
	}
	w && ye();
	var d = null, f = /* @__PURE__ */ dt(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, kr(v, p, c, t, i), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= re, jr(d, null, c)) : wn(d) : Sn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: gn(() => {
			p = Z(f);
			var e = p.length;
			let n = !1;
			w && Se(c) === "[!" != (e === 0) && (c = xe(), E(c), ve(!1), n = !0);
			for (var a = /* @__PURE__ */ new Set(), u = A, v = en(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, n = !0, ve(!1));
				var b = p[y], x = i(b, y), S = h ? null : l.get(x);
				S ? (S.v && zt(S.v, b), S.i && zt(S.i, y), v && u.unskip_effect(S.e)) : (S = Ar(l, h ? c : Er ??= F(), b, x, y, o, t, r), h || (S.e.f |= re), l.set(x, S)), a.add(x);
			}
			if (e === 0 && s && !d && (h ? d = B(() => s(c)) : (d = B(() => s(Er ??= F())), d.f |= re)), e > a.size && ke("", "", ""), w && e > 0 && E(xe()), !h) {
				if (m.set(u, a), v) {
					for (let [e, t] of l) a.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			n && ve(!0), Z(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function Or(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function kr(e, t, n, r, i) {
	var o = !!(r & 8), s = t.length, c = e.items, l = Or(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (wn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= re, _ === l) jr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Mr(e, d, _), Mr(e, _, y), jr(_, y, n), d = _, p = [], m = [], l = Or(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) jr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Mr(e, S.prev, ee.next), Mr(e, d, S), Mr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), jr(_, l, n), Mr(e, _.prev, _.next), Mr(e, _, d === null ? e.effect.first : d.next), Mr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Or(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Or(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Tr(e, a(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = Or(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			wr(e, C, ne);
		}
	}
	o && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ar(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Ft(n) : /* @__PURE__ */ It(n, !1, !1) : null, l = o & 2 ? Ft(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function jr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ I(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Mr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Nr(e, t, n) {
	var r;
	w && (r = T, ye());
	var i = new Sr(e);
	gn(() => {
		var e = t() ?? null;
		if (w && Se(r) === "[" != (e !== null)) {
			var a = xe();
			E(a), i.anchor = a, ve(!1), i.ensure(e, e && ((t) => n(t, e))), ve(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Pr(e, t, n) {
	fn(() => {
		var r = qn(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			mn(() => {
				var e = n();
				Jn(e), i && we(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function Fr(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), m;
	let r = qn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var Ir = [];
function Lr(e, t = m) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (we(e, t) && (e = t, n)) {
			let t = !Ir.length;
			for (let t of r) t[1](), Ir.push(t, e);
			if (t) {
				for (let e = 0; e < Ir.length; e += 2) Ir[e][0](Ir[e + 1]);
				Ir.length = 0;
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
function Rr(e) {
	let t;
	return Fr(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var zr = {
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
		if (t === se || t === le) return !1;
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
function Br(...e) {
	return new Proxy({ props: e }, zr);
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
var Vr = {
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
.2126 * Hr(15 / 255) + .7152 * Hr(23 / 255) + .0722 * Hr(42 / 255);
function Hr(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/types/services.ts
function Ur(e) {
	return { key: e };
}
var Wr = Ur("analytics"), Gr = Ur("errorCapture");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function Kr(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/mountable.ts
var qr = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/analytics/plugin-analytics.ts
function Jr(e, t) {
	return `plugin.${e}.${t}`;
}
function Yr(e, t, n, r) {
	let i = e.tryService(Wr);
	i && i.track(Jr(t, n), {
		...r,
		source: "plugin",
		plugin_id: t
	});
}
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function Xr(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Zr() {
	return "1.1.1";
}
function Qr(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Xr(e.messages, e.nameKey),
		version: e.version ?? Zr(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Xr(e.messages, e.descriptionKey) : void 0,
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
function $r(e) {
	let t, n = fr((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return sn() ? (n(), t) : Rr(e);
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
//#region packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Q(["input"]), Q(["change"]), Q(["change"]), Q(["change"]), Q([
	"click",
	"pointerdown",
	"pointerup"
]), Q(["change"]);
//#endregion
//#region packages/ui-kit/src/platform/native-bridge.ts
var ei = "__CHRONOS_NATIVE__";
function ti() {
	if (typeof window > "u") return null;
	let e = window[ei];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/components/SegmentedControl.svelte
Vr.hapticFeedbackEnabled, Q(["click"]), Q(["click"]), Q(["click", "keydown"]);
//#endregion
//#region packages/ui-kit/src/motion/motion.ts
var ni = Vr.reduceMotionEnabled;
function ri() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !1;
		let e = localStorage.getItem(ni);
		return e === "1" || e === "true";
	} catch {
		return !1;
	}
}
function ii() {
	if (typeof window > "u") return !1;
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
}
function ai() {
	return ri() || ii();
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
Q(["pointerdown"]), Q(["keydown", "click"]), Q(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [oi, si] = He();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Q(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var ci = /* @__PURE__ */ sr("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function li(e, t) {
	Ke(t, !0);
	let n = /* @__PURE__ */ ut(() => t.component), r = /* @__PURE__ */ ut(() => $r(t.propsStore).current);
	var i = ci();
	Nr(L(i), () => Z(n), (e, t) => {
		t(e, Br(() => Z(r)));
	}), D(i), lr(e, i), qe();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ui(e) {
	return {
		[qr]: !0,
		mount(t, n, r) {
			let i = Lr({ ...n }), a = _r(li, {
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
					xr(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function di(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Kr(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Kr(a, i) : o;
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
//#region packages/ui-kit/src/actions/scroll-rubber-band.ts
var bi = 120, xi = 220, Si = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
function Ci(e, t = bi) {
	return e === 0 ? 0 : Math.sign(e) * (t * (1 - Math.exp(-Math.abs(e) / t)));
}
function wi(e) {
	return e.scrollTop <= 0;
}
function Ti(e) {
	return Math.max(0, e.scrollHeight - e.clientHeight);
}
function Ei(e) {
	let t = Ti(e);
	return t <= 0 || e.scrollTop >= t - 1;
}
function Di(e, t, n, r, i) {
	if (i) return 0;
	if (e !== 0) {
		let i = e + t;
		return i > 0 && !n && (i = 0), i < 0 && !r && (i = 0), i;
	}
	return n && t > 0 || r && t < 0 ? t : 0;
}
function Oi() {
	return typeof window < "u" && !ai();
}
function ki(e) {
	let t = 0, n = 0, r = 0, i, a = () => {
		i !== void 0 && (clearTimeout(i), i = void 0), e.style.transition = "";
	}, o = (t) => {
		if (a(), !t) {
			e.style.transform = "";
			return;
		}
		e.style.transition = `transform ${xi}ms ${Si}`, e.style.transform = "", i = setTimeout(() => {
			e.style.transition = "", i = void 0;
		}, 252);
	}, s = () => {
		let t = Ci(r);
		e.style.transform = t === 0 ? "" : `translate3d(0, ${t}px, 0)`;
	}, c = (i) => {
		i.touches.length === 1 && (a(), t = i.touches[0].clientY, n = e.scrollTop, r = 0);
	}, l = (i) => {
		if (i.touches.length !== 1) return;
		let a = i.touches[0].clientY, o = a - t;
		t = a;
		let c = e.scrollTop, l = c !== n;
		n = c;
		let u = Di(r, o, wi(e), Ei(e), l);
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
function Ai(e, t = !0) {
	let n = null, r = (t) => {
		if (t && Oi()) {
			n ||= ki(e);
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
function ji(e) {
	let t = yi(e), n = Ai(e);
	return { destroy() {
		t.destroy(), n.destroy();
	} };
}
//#endregion
//#region packages/ui-kit/src/platform/clipboard.ts
async function Mi(e) {
	let t = ti();
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
//#endregion
//#region packages/plugins/error-log/src/constants.ts
var $ = "tool-error-log", Ni = "error_log", Pi = 2e3, Fi = 8e3, Ii = {
	"zh-cn": {
		"plugin.name": "错误日志",
		"mine.title": "错误日志",
		"mine.keywords": "错误,日志,异常,console,error,log,debug",
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
		"mine.keywords": "error,log,exception,console,debug",
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
//#endregion
//#region packages/plugins/error-log/src/error-log.ts
function Li(e, t) {
	return e.length <= t ? e : `${e.slice(0, t)}…`;
}
function Ri(e) {
	return {
		...e,
		message: Li(e.message, Pi),
		stack: e.stack ? Li(e.stack, Fi) : void 0
	};
}
function zi(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.ts == "number" && (t.source === "error" || t.source === "unhandledrejection" || t.source === "console") && typeof t.message == "string";
}
function Bi(e) {
	return Array.isArray(e) ? e.filter(zi).map(Ri) : [];
}
function Vi(e, t, n = 100) {
	let r = [...e, Ri(t)];
	return r.length <= n ? r : r.slice(r.length - n);
}
function Hi(e) {
	let t = new Date(e.ts).toISOString(), n = e.name ? ` / ${e.name}` : "", r = [`${t} / ${e.source}${n} / ${e.message}`];
	return e.stack && r.push(e.stack), r.join("\n");
}
function Ui(e, t) {
	let n = ["Chronos Error Log", `Plugin: ${$} v${t.pluginVersion}`];
	t.userAgent && n.push(`User-Agent: ${t.userAgent}`);
	let r = [...e].sort((e, t) => t.ts - e.ts).map(Hi).join("\n\n");
	return r ? `${n.join("\n")}\n\n---\n\n${r}` : n.join("\n");
}
//#endregion
//#region packages/plugins/error-log/src/runtime.svelte.ts
var Wi = /* @__PURE__ */ new Map();
function Gi(e = $) {
	let t = Wi.get(e);
	if (!t) throw Error(`[ErrorLogRuntime] not initialized for plugin "${e}"`);
	return t;
}
function Ki(e, t = $) {
	let n = /* @__PURE__ */ N([]), r = Promise.resolve();
	function i(e) {
		return r = r.then(e, e), r;
	}
	let a = {
		get entries() {
			return Z(n);
		},
		async load() {
			await r;
			let t = await e.storage.get(Ni);
			P(n, Bi(t));
		},
		async append(t) {
			P(n, Vi(Z(n), t)), await i(() => e.storage.set(Ni, Z(n)));
		},
		async clear() {
			P(n, []), await i(() => e.storage.delete(Ni));
		},
		dispose() {
			Wi.get(t) === a && Wi.delete(t);
		}
	};
	return Wi.set(t, a), a;
}
//#endregion
//#region packages/plugins/error-log/src/index.ts
function qi(e = {}) {
	let { screenComponent: t } = e;
	return Qr({
		id: $,
		messages: Ii,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 50,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = Ki(e);
			await r.load();
			let i = e.tryService(Gr);
			i && e.addDisposable(i.onCaptured((e) => {
				r.append(e);
			})), e.addDisposable({ dispose: () => r.dispose() });
			let a = n("mine.keywords").split(",").map((e) => e.trim()).filter(Boolean);
			e.registerSlot("mine.item", {
				id: "error-log",
				sectionId: $,
				title: () => n("mine.title"),
				href: `/plugins/${$}`,
				icon: "history",
				iconTone: "secondary",
				keywords: a,
				order: 35
			}), e.registerSlot("shell.route.screen", {
				id: $,
				title: () => n("screen.title"),
				...t ? { component: t } : {}
			});
		}
	});
}
//#endregion
//#region packages/plugins/error-log/src/analytics.ts
var Ji = {
	copy: "copy",
	clear: "clear"
};
//#endregion
//#region packages/plugins/error-log/src/copy-text.ts
async function Yi(e) {
	return Mi(e);
}
//#endregion
//#region packages/plugins/error-log/src/ErrorLogScreen.svelte
var Xi = /* @__PURE__ */ sr("<div class=\"p-6 text-center\"><p class=\"text-body-medium text-on-surface-variant\"> </p></div>"), Zi = /* @__PURE__ */ sr("<p class=\"text-title-small text-on-surface\"> </p>"), Qi = /* @__PURE__ */ sr("<pre class=\"text-body-small mt-2 max-h-40 overflow-auto font-mono whitespace-pre-wrap text-on-surface-variant\"> </pre>"), $i = /* @__PURE__ */ sr("<div class=\"flex items-start justify-between gap-3 p-3\"><div class=\"min-w-0 flex-1\"><p class=\"text-body-small text-on-surface-variant\"> </p> <!> <p class=\"text-body-medium text-on-surface\"> </p> <!></div> <button type=\"button\" class=\"ui-btn ui-btn-text shrink-0\"> </button></div>"), ea = /* @__PURE__ */ sr("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><div class=\"secondary-scroll min-h-0 flex-1 overflow-y-auto\"><div class=\"p-4\"><div class=\"ui-section-surface divide-y divide-outline/10 overflow-hidden\"><!></div></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button></div></div></div>");
function ta(e, t) {
	Ke(t, !0);
	let n = /* @__PURE__ */ ut(() => Gi(t.pluginId)), r = /* @__PURE__ */ ut(() => {
		let e = /* @__PURE__ */ new Set();
		return [...Z(n).entries].sort((e, t) => t.ts - e.ts).filter((t) => !e.has(t.id) && (e.add(t.id), !0));
	}), i = /* @__PURE__ */ ut(() => t.controller.getPluginContext(t.pluginId));
	function a(e) {
		return di(t.controller, $, Ii, e);
	}
	function o(e) {
		return new Date(e).toLocaleString(t.controller.currentLocale);
	}
	async function s(e) {
		let t = await Yi(Ui(e, {
			pluginVersion: Zr(),
			userAgent: typeof navigator < "u" ? navigator.userAgent : void 0
		}));
		Yr(Z(i), $, Ji.copy), Z(i).actions.notify(a(t ? "screen.notify.copySuccess" : "screen.notify.copyFailed"), t ? "info" : "error");
	}
	async function c() {
		await s(Z(r));
	}
	async function l(e) {
		await s([e]);
	}
	async function u() {
		await Z(n).clear(), Yr(Z(i), $, Ji.clear), Z(i).actions.notify(a("screen.notify.cleared"), "info");
	}
	let d = /* @__PURE__ */ ut(() => [{
		id: "copy-all",
		label: a("screen.action.copyAll"),
		icon: "content-copy",
		variant: "outlined",
		disabled: Z(r).length === 0,
		onClick: c
	}, {
		id: "clear",
		label: a("screen.action.clear"),
		icon: "delete",
		variant: "outlined",
		disabled: Z(r).length === 0,
		onClick: u
	}]);
	ln(() => t.edgeActions?.register(t.pluginId, Z(d)));
	var f = ea(), p = L(f), m = L(p), h = L(m), g = L(h), _ = (e) => {
		var t = Xi(), n = Zt(L(t), !0);
		D(t), hn((e) => gr(n, e), [() => a("screen.empty")]), lr(e, t);
	}, v = (e) => {
		var t = cr();
		Dr(Xt(t), 17, () => Z(r), (e) => e.id, (e, t) => {
			var n = $i(), r = L(n), i = L(r), s = Zt(i), c = Qt(i, 2), u = (e) => {
				var n = Zi(), r = Zt(n, !0);
				hn(() => gr(r, Z(t).name)), lr(e, n);
			};
			Cr(c, (e) => {
				Z(t).name && e(u);
			});
			var d = Qt(c, 2), f = Zt(d, !0), p = Qt(d, 2), m = (e) => {
				var n = Qi(), r = Zt(n, !0);
				hn(() => gr(r, Z(t).stack)), lr(e, n);
			};
			Cr(p, (e) => {
				Z(t).stack && e(m);
			}), D(r);
			var h = Qt(r, 2), g = Zt(h, !0);
			D(n), hn((e, n) => {
				gr(s, `${e ?? ""} · ${Z(t).source ?? ""}`), gr(f, Z(t).message), gr(g, n);
			}, [() => o(Z(t).ts), () => a("screen.action.copyOne")]), $n("click", h, () => l(Z(t))), lr(e, n);
		}), lr(e, t);
	};
	Cr(g, (e) => {
		Z(r).length === 0 ? e(_) : e(v, -1);
	}), D(h), D(m), D(p), Pr(p, (e) => ji?.(e));
	var y = Qt(p, 2), b = L(y), x = L(b), S = Zt(x, !0), ee = Qt(x, 2), C = Zt(ee, !0);
	D(b), D(y), D(f), hn((e, t) => {
		x.disabled = Z(r).length === 0, gr(S, e), ee.disabled = Z(r).length === 0, gr(C, t);
	}, [() => a("screen.action.copyAll"), () => a("screen.action.clear")]), $n("click", x, c), $n("click", ee, u), lr(e, f), qe();
}
Q(["click"]);
//#endregion
//#region packages/plugins/error-log/bundle/entry.ts
var na = qi({ screenComponent: ui(ta) });
//#endregion
export { na as default };
