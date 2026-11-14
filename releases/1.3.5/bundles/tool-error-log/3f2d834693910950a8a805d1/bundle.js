// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/constants.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/hydration.js
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
	return E(/* @__PURE__ */ F(T));
}
function D(t) {
	if (w) {
		if (/* @__PURE__ */ F(T) !== null) throw ge(), e;
		T = t;
	}
}
function be(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ F(n);
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
		var i = /* @__PURE__ */ F(n);
		e && n.remove(), n = i;
	}
}
function Se(t) {
	if (!t || t.nodeType !== 8) throw ge(), e;
	return t.data;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/equality.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/errors.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/context.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/context.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/task.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/status.js
var $e = ~(v | y | _);
function k(e, t) {
	e.f = e.f & $e | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? k(e, _) : k(e, y);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e, t) {
	e.f & 2048 ? t.set(e, v) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, y), k(e, _);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function nt(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/async.js
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
		s.f & 16384 ? d() : (c(), f(), at());
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
			l?.(), c.delete(n), t !== ct && (r.activate(), t ? (o.f |= oe, Bt(o, t)) : (o.f & 8388608 && (o.f ^= oe), Bt(o, e)), r.deactivate());
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
	return An(t), t;
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
	if (!On && i !== null && e.v !== t && i.f & 24576) return he(), e.v;
	K(i);
	try {
		ft(e), n = zn(e);
	} finally {
		K(r);
	}
	return n;
}
function mt(e) {
	var t = pt(e);
	!e.equals(t) && (e.wv = In(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), vt?.capture(e, t, !0)), e.deps === null)) ? k(e, _) : On || (j === null ? et(e) : (sn() || A?.is_fork) && j.set(e, t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && nt(() => {
		t.ac.abort(me), t.ac = null;
	}), t.fn !== null && (t.teardown = m), Hn(t, 0), vn(t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Un(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/batch.js
var _t = null, A = null, vt = null, j = null, yt = null, bt = !1, xt = !1, St = null, Ct = null, wt = 0, Tt = 1, Et = class e {
	id = Tt++;
	started = !1;
	linked = !0;
	prev = null;
	next = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Set();
	#n = 0;
	#r = /* @__PURE__ */ new Map();
	#i = null;
	#a = [];
	#o = [];
	#s = /* @__PURE__ */ new Map();
	#c = /* @__PURE__ */ new Map();
	#l = /* @__PURE__ */ new Set();
	is_fork = !1;
	#u = !1;
	constructor() {
		_t === null ? _t = this : (_t.next = this, this.prev = _t), _t = this;
	}
	#d() {
		if (this.is_fork) return !0;
		for (let e of this.#r.keys()) if (!this.#f(e)) return !0;
		return !1;
	}
	#f(e) {
		for (var t = e; t !== null; t = t.parent) if (this.#c.has(t)) return !0;
		return !1;
	}
	skip_effect(e) {
		this.#c.has(e) || this.#c.set(e, {
			d: [],
			m: []
		}), this.#l.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#c.get(e);
		if (n) {
			this.#c.delete(e);
			for (var r of n.d) k(r, v), t(r);
			for (r of n.m) k(r, y), t(r);
		}
		this.#l.add(e);
	}
	#p() {
		var e = [];
		for (let i of this.#a) if (!(i.f & 16384 || !(i.f & 6144))) {
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
		return this.#a = [], e;
	}
	#m() {
		this.started = !0;
		for (let [e, t] of this.#s) k(e, t), this.schedule(e);
		this.apply();
		for (var t = St = [], n = [], r = Ct = []; this.#a.length > 0;) {
			wt++ > 1e3 && (this.#b(), Dt());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw Mt(e), this.#d() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (St = null, Ct = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) jt(e, t);
			r.length > 0 && A.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), vt = this, kt(n), kt(t), vt = null, this.#i?.resolve();
			var o = A;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (M.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= _;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= _ : i & 4 ? t.push(r) : Ln(r) && (i & 16 && this.add_dirty_reaction(r, y), Un(r));
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
	#g() {
		for (var e = this.prev; e !== null; e = e.prev) if (!e.is_fork && this.#_(e)) return e;
		return null;
	}
	#_(e) {
		for (let [t, [, n]] of this.current) if (!n && e.current.has(t)) return !0;
		return !1;
	}
	#v(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_reactions(e.#s);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), k(i, v), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), A = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#s);
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
			xt = !0, A = this, this.#m();
		} finally {
			wt = 0, yt = null, St = null, Ct = null, xt = !1, A = null, j = null, M.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(ct);
		this.#b(), this.#i?.resolve();
	}
	register_created_effect(e) {
		this.#o.push(e);
	}
	increment(e, t) {
		if (this.#n += 1, e) {
			let e = this.#r.get(t) ?? 0;
			this.#r.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#n, e) {
			let e = this.#r.get(t) ?? 0;
			e === 1 ? this.#r.delete(t) : this.#r.set(t, e - 1);
		}
		this.#u || (this.#u = !0, Qe(() => {
			this.#u = !1, this.linked && this.flush();
		}));
	}
	transfer_reactions(e) {
		for (let [t, n] of e) this.add_dirty_reaction(t, n);
		e.clear();
	}
	add_dirty_reaction(e, t) {
		(t === 2048 || this.#s.get(e) !== 2048) && this.#s.set(e, t);
	}
	oncommit(e) {
		this.#e.add(e);
	}
	ondiscard(e) {
		this.#t.add(e);
	}
	settled() {
		return (this.#i ??= g()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!xt && Qe(() => {
				t.started || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
	}
	schedule(e) {
		yt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e);
	}
	#b() {
		if (this.linked) {
			var e = this.prev, t = this.next;
			e === null || (e.next = t), t === null ? _t = e : t.prev = e, this.linked = !1;
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
			if (!(r.f & 24576) && Ln(r) && (Ot = /* @__PURE__ */ new Set(), Un(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && xn(r), Ot?.size > 0)) {
				M.clear();
				for (let e of Ot) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ot.has(n) && (Ot.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Un(n);
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/sources.js
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
function It(e, t) {
	let n = Ft(e, t);
	return An(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Lt(e, t = !1, n = !0) {
	let r = Ft(e);
	return t || (r.equals = Te), r;
}
function N(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && Ye() && H.f & 4325394 && (q === null || !q.has(e)) && Ie(), Bt(e, n ? Wt(t) : t, Ct);
}
var Rt = null, zt = 0;
function Bt(e, t, n = null) {
	if (!e.equals(t)) {
		On ? M.set(e, t) : M.has(e) || M.set(e, e.v);
		var r = Et.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && pt(t), j === null && et(t);
		}
		e.wv = In(), Rt = null, zt = 0, Ut(e, v, n), Rt = null, Ye() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? jn([e]) : X.push(e)), !r.is_fork && Nt.size > 0 && !Pt && Vt();
	}
	return t;
}
function Vt() {
	Pt = !1;
	for (let e of Nt) {
		e.f & 1024 && k(e, y);
		let t;
		try {
			t = Ln(e);
		} catch {
			t = !0;
		}
		t && Un(e);
	}
	Nt.clear();
}
function Ht(e) {
	N(e, e.v + 1);
}
function Ut(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ye(), a = r.length;
		if (zt += a, zt > 1e5 && Rt === null && (Rt = /* @__PURE__ */ new Set()), Rt !== null) {
			if (Rt.has(e)) return;
			Rt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & v) === 0;
				if (l && k(s, t), c & 131072) Nt.add(s);
				else if (c & 2) {
					var u = s;
					j?.delete(u), Ut(u, y, n);
				} else if (l) {
					var d = s;
					c & 16 && Ot !== null && Ot.add(d), n === null ? At(d) : n.push(d);
				}
			}
		}
	}
}
function Wt(e) {
	if (typeof e != "object" || !e || se in e || ce in e) return e;
	let r = d(e);
	if (r !== l && r !== u) return e;
	var i = /* @__PURE__ */ new Map(), a = n(e), o = /* @__PURE__ */ It(0), c = null, f = Pn, p = (e) => {
		if (Pn === f) return e();
		var t = H, n = Pn;
		W(null), Fn(f);
		var r = e();
		return W(t), Fn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ It(e.length, c)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Pe();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ It(n.value, c);
				return i.set(t, e), e;
			}) : N(r, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in e) {
					let e = p(() => /* @__PURE__ */ It(t, c));
					i.set(n, e), Ht(o);
				}
			} else N(r, t), Ht(o);
			return !0;
		},
		get(n, r, a) {
			if (r === se) return e;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || s(n, r)?.writable) && (o = p(() => /* @__PURE__ */ It(Wt(l ? n[r] : t), c)), i.set(r, o)), o !== void 0) {
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
			return (r !== void 0 || (G !== null || H !== null) && (!a || s(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ It(a ? Wt(e[n]) : t, c)), i.set(n, r)), Z(r) === t) ? !1 : a;
		},
		set(e, n, r, l) {
			var u = i.get(n), d = n in e;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in e && (m = p(() => /* @__PURE__ */ It(t, c)), i.set(f + "", m)) : N(m, t);
			}
			if (u === void 0) (!d || s(e, n)?.writable) && (u = p(() => /* @__PURE__ */ It(void 0, c)), N(u, Wt(r)), i.set(n, u));
			else {
				d = u.v !== t;
				var h = p(() => Wt(r));
				N(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var _ = i.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && N(_, v + 1);
				}
				Ht(o);
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
var Gt, Kt, qt, Jt;
function Yt() {
	if (Gt === void 0) {
		Gt = window, Kt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		qt = s(t, "firstChild").get, Jt = s(t, "nextSibling").get, f(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), f(n) && (n[pe] = void 0);
	}
}
function P(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Xt(e) {
	return qt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function F(e) {
	return Jt.call(e);
}
function I(e, t) {
	if (!w) return /* @__PURE__ */ Xt(e);
	var n = /* @__PURE__ */ Xt(T);
	if (n === null) n = T.appendChild(P());
	else if (t && n.nodeType !== 3) {
		var r = P();
		return n?.before(r), E(r), r;
	}
	return t && nn(n), E(n), n;
}
function Zt(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ Xt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ F(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = P();
			return T?.before(r), E(r), r;
		}
		nn(T);
	}
	return T;
}
function L(e, t = !1) {
	if (!w) return /* @__PURE__ */ Xt(e);
	var n = I(e, t);
	return D(e), n;
}
function Qt(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ F(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = P();
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/effects.js
function an(e) {
	G === null && (H === null && Me(e), je()), On && Ae(e);
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
			Un(r);
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
		let n = On, r = H;
		kn(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			kn(n), W(r);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (bn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, vn(e, t && !n), Hn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	_n(e), e.f ^= ee, e.f |= x;
	var i = e.parent;
	i !== null && i.first !== null && xn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function bn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ F(e);
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
		var i = n === r ? null : /* @__PURE__ */ F(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/legacy.js
var Dn = null, On = !1;
function kn(e) {
	On = e;
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
function An(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function jn(e) {
	X = e;
}
var Mn = 1, Nn = 0, Pn = Nn;
function Fn(e) {
	Pn = e;
}
function In() {
	return ++Mn;
}
function Ln(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Ln(a) && mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && k(e, _);
	}
	return !1;
}
function Rn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Rn(a, t, !1) : t === a && (n ? k(a, v) : a.f & 1024 && k(a, y), At(a));
	}
}
function zn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = O, s = U, c = Pn, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Ve(e.ctx), U = !1, Pn = ++Nn, e.ac !== null && (nt(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= S;
		var f = Bn(e);
		if (Ye() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Rn(X[p], e);
		if (i !== null && i !== e) {
			if (Nn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Nn;
			if (t !== null) for (let e of t) e.rv = Nn;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return Bn(e), rn(t);
	} finally {
		e.f ^= ie, J = t, Y = n, X = r, H = i, q = a, Ve(o), U = s, Pn = c;
	}
}
function Bn(e) {
	var t = e.deps, n = A?.is_fork;
	if (J !== null) {
		var r;
		if (n || Hn(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (sn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Hn(e, Y), t.length = Y);
	return t;
}
function Vn(e, n) {
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
		}), ht(c), Hn(c, 0);
	}
}
function Hn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Vn(e, n[r]);
}
function Un(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, _);
		var n = G;
		G = e;
		try {
			t & 16777232 ? yn(e) : vn(e), _n(e);
			var r = zn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = Mn;
		} finally {
			G = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (Dn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Nn && (e.rv = Nn, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], i.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : i.call(r, H) || r.push(H);
		}
	}
	if (On && M.has(e)) return M.get(e);
	if (t) {
		var a = e;
		if (On) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Gn(a)) && (o = pt(a)), M.set(a, o), o;
		}
		var s = !(a.f & 512) && !U && H !== null && !!(H.f & 512), c = (a.f & S) === 0;
		Ln(a) && (s && (a.f |= 512), mt(a)), s && !c && (gt(a), Wn(a));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Wn(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : i.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (gt(n), Wn(n));
	}
}
function Gn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && Gn(t)) return !0;
	return !1;
}
function Kn(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
function qn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) Jn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && Jn(n);
		}
	}
}
function Jn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Jn(e[n], t);
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/events.js
var Yn = Symbol("events"), Xn = /* @__PURE__ */ new Set(), Zn = /* @__PURE__ */ new Set();
function Qn(e, t, n) {
	(t[Yn] ??= {})[e] = n;
}
function Q(e) {
	for (var t = 0; t < e.length; t++) Xn.add(e[t]);
	for (var n of Zn) n(e);
}
var $n = null, er = !1;
function tr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	$n = e, er || (er = !0, setTimeout(() => {
		er = !1, $n = null;
	}));
	var s = 0, c = $n === e && e[Yn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Yn] = t;
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
					var h = a[Yn]?.[r];
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
			e[Yn] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/reconciler.js
var nr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function rr(e) {
	return nr?.createHTML(e) ?? e;
}
function ir(e) {
	var t = tn("template");
	return t.innerHTML = rr(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/template.js
function ar(e, t) {
	var n = G;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function or(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return ar(T, null), T;
		i === void 0 && (i = ir(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Xt(i)));
		var t = r || Kt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Xt(t), s = t.lastChild;
			ar(o, s);
		} else ar(t, t);
		return t;
	};
}
function sr() {
	if (w) return ar(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = P();
	return e.append(t, n), ar(t, n), e;
}
function cr(e, t) {
	if (w) {
		var n = G;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = T), ye();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var lr = ["touchstart", "touchmove"];
function ur(e) {
	return lr.includes(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/create-subscriber.js
function dr(e) {
	let t = 0, n = Ft(0), r;
	return () => {
		sn() && (Z(n), mn(() => (t === 0 && (r = Kn(() => e(() => Ht(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Ht(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var fr = C | te;
function pr(e, t, n, r) {
	new mr(e, t, n, r);
}
var mr = class {
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
	#f = /* @__PURE__ */ new Map();
	#p = null;
	#m = dr(() => (this.#p = Ft(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = gn(() => {
			if (w) {
				let e = Se(this.#t);
				ye();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, fr), w && (this.#e = T);
	}
	#h() {
		try {
			this.#a = B(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#g(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#_(e);
		Qe(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? _e() : (t = !0, n && Le(), this.#s !== null && Sn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#v()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					R(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#v() {
		return (this.#i.f & (x | ee)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), Qe(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = P(), n = !1;
				e.append(t), this.#a = this.#S(() => {
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
				}), this.#a === null ? (this.#c = null, n && this.#x(A)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Sn(this.#o, () => {
					this.#o = null;
				}), this.#x(A));
			}
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
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		tt(e, this.#f);
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
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Sn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, Qe(() => {
			this.#d = !1, this.#p && Bt(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), Z(this.#p);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#v() || this.#w(t);
		})) : this.#w(t);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), w && (E(this.#t), be(), E(xe()));
		let t = this.#n.failed, n = (e) => {
			if (this.#v()) return;
			let { reset: n, invoke_onerror: r } = this.#_(e);
			r(), t && !this.#v() && (this.#s = this.#S(() => {
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
			if (!this.#v()) {
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
function $(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function hr(e, t) {
	return _r(e, t);
}
var gr = /* @__PURE__ */ new Map();
function _r(t, { target: n, anchor: r, props: i = {}, events: o, context: s, intro: c = !0, transformError: l }) {
	Yt();
	var u = void 0, d = dn(() => {
		var c = r ?? n.appendChild(P());
		pr(c, { pending: () => {} }, (n) => {
			Ke({});
			var r = O;
			if (s && (r.c = s), o && (i.$$events = o), w && ar(n, null), u = t(n, i) || Je(), w && (G.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw ge(), e;
			qe();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = ur(r);
					for (let e of [n, document]) {
						var a = gr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), gr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, tr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(a(Xn)), Zn.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = gr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, tr), t.delete(e), t.size === 0 && gr.delete(r)) : t.set(e, i);
			}
			Zn.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return vr.set(u, d), u;
}
var vr = /* @__PURE__ */ new WeakMap();
function yr(e, t) {
	let n = vr.get(e);
	return n ? (vr.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var br = class {
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
						En(r, t), t.append(P()), this.#n.set(e, {
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
				var i = document.createDocumentFragment(), a = P();
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/if.js
function xr(e, t, n = !1) {
	var r;
	w && (r = T, ye());
	var i = new br(e), a = n ? C : 0;
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/each.js
function Sr(e, t, n) {
	for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Sn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Cr(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		Cr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Cr(e, t, n = !0) {
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
var wr;
function Tr(e, t, r, i, o, s = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? E(/* @__PURE__ */ Xt(u)) : u.appendChild(P());
	}
	w && ye();
	var d = null, f = /* @__PURE__ */ dt(() => {
		var e = r();
		return n(e) ? e : e == null ? [] : a(e);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var n = Z(f);
			_.fallback = d, Dr(_, n, c, t, i), d !== null && (n.length === 0 ? d.f & 33554432 ? (d.f ^= re, kr(d, null, c)) : wn(d) : Sn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: gn(() => {
			var e = Z(f), n = e.length;
			let a = !1;
			w && Se(c) === "[!" != (n === 0) && (c = xe(), E(c), ve(!1), a = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = A, v = en(), y = 0; y < n; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, a = !0, ve(!1));
				var b = e[y], x = i(b, y), S = m ? null : l.get(x);
				S ? (S.v && Bt(S.v, b), S.i && Bt(S.i, y), v && _.unskip_effect(S.e)) : (S = Or(l, m ? c : wr ??= P(), b, x, y, o, t, r), m || (S.e.f |= re), l.set(x, S)), u.add(x);
			}
			if (n === 0 && s && !d && (m ? d = B(() => s(c)) : (d = B(() => s(wr ??= P())), d.f |= re)), n > u.size && ke("", "", ""), w && n > 0 && E(xe()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			a && ve(!0), Z(f);
		}),
		flags: t,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, w && (c = T);
}
function Er(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Dr(e, t, n, r, i) {
	var o = !!(r & 8), s = t.length, c = e.items, l = Er(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (wn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= re, _ === l) kr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Ar(e, d, _), Ar(e, _, y), kr(_, y, n), d = _, p = [], m = [], l = Er(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) kr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Ar(e, S.prev, ee.next), Ar(e, d, S), Ar(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), kr(_, l, n), Ar(e, _.prev, _.next), Ar(e, _, d === null ? e.effect.first : d.next), Ar(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Er(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Er(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Cr(e, a(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var C = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && C.push(l), l = Er(l.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			Sr(e, C, ne);
		}
	}
	o && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Or(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Ft(n) : /* @__PURE__ */ Lt(n, !1, !1) : null, l = o & 2 ? Ft(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ F(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Ar(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function jr(e, t, n) {
	var r;
	w && (r = T, ye());
	var i = new br(e);
	gn(() => {
		var e = t() ?? null;
		if (w && Se(r) === "[" != (e !== null)) {
			var a = xe();
			E(a), i.anchor = a, ve(!1), i.ensure(e, e && ((t) => n(t, e))), ve(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, C);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Mr(e, t, n) {
	fn(() => {
		var r = Kn(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			mn(() => {
				var e = n();
				qn(e), i && we(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/utils.js
function Nr(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), m;
	let r = Kn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/shared/index.js
var Pr = [];
function Fr(e, t = m) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (we(e, t) && (e = t, n)) {
			let t = !Pr.length;
			for (let t of r) t[1](), Pr.push(t, e);
			if (t) {
				for (let e = 0; e < Pr.length; e += 2) Pr[e][0](Pr[e + 1]);
				Pr.length = 0;
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
function Ir(e) {
	let t;
	return Nr(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/props.js
var Lr = {
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
function Rr(...e) {
	return new Proxy({ props: e }, Lr);
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
var zr = {
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
.2126 * Br(15 / 255) + .7152 * Br(23 / 255) + .0722 * Br(42 / 255);
function Br(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
// packages/core/src/types/services.ts
function Vr(e) {
	return { key: e };
}
var Hr = Vr("analytics"), Ur = Vr("errorCapture");
// packages/core/src/i18n/i18n-catalog.ts
function Wr(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/mountable.ts
var Gr = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/analytics/plugin-analytics.ts
function Kr(e, t, n) {
	let r = e.tryService(Hr);
	r && r.track(t, n);
}
// packages/core/src/plugin/define-chronos-plugin.ts
function qr(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Jr() {
	return "1.3.5";
}
function Yr(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? qr(e.messages, e.nameKey),
		version: e.version ?? Jr(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? qr(e.messages, e.descriptionKey) : void 0,
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/index-client.js
function Xr(e) {
	let t, n = dr((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return sn() ? (n(), t) : Ir(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Q(["input"]), Q(["change"]), Q(["change"]), dr((e) => {
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
// packages/ui-kit/src/overlay/history-overlay.ts
var Zr = Symbol("overlay-lifecycle"), Qr = "__CHRONOS_NATIVE__";
function $r() {
	if (typeof window > "u") return null;
	let e = window[Qr];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
// packages/ui-kit/src/form/TimePicker.svelte
zr.hapticFeedbackEnabled, Q(["click"]), Q(["click", "keydown"]), zr.reduceMotionEnabled, Q(["pointerdown"]), Q(["keydown", "click"]), Q(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var ei = /* @__PURE__ */ or("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function ti(e, t) {
	Ke(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = ei(), i = I(r), a = L(i, !0), o = Qt(i, 2), s = L(o, !0);
	D(r), hn((e, t) => {
		$(a, e), $(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), Qn("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), cr(e, r), qe();
}
Q(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ni, ri] = He(), ii = 900, ai = 24, oi = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function si(e) {
	return oi.has(e) ? !0 : e.startsWith("max-w-");
}
function ci(e) {
	let t = [], n = [];
	for (let r of e) si(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function li(e, t, n, r = ai) {
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
function ui(e, t) {
	t.visible ? (e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`) : e.style.display = "none";
}
function di(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = ci(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		ui(a, li(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, ii);
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
function fi(e) {
	return di(e);
}
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Q(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var pi = /* @__PURE__ */ or("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function mi(e, t) {
	Ke(t, !0), We(Zr, Kn(() => Ir(t.propsStore)).overlayParent);
	let n = /* @__PURE__ */ ut(() => t.component), r = /* @__PURE__ */ ut(() => Xr(t.propsStore).current);
	var i = pi();
	pr(I(i), {
		onerror: (e) => {
			console.error("[MountableSvelteHost] render failed:", e), t.onFailure?.(e);
		},
		failed: (e, t = m, n = m) => {
			ti(e, {
				get controller() {
					return Z(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = sr();
		jr(Zt(t), () => Z(n), (e, t) => {
			t(e, Rr(() => Z(r)));
		}), cr(e, t);
	}), D(i), cr(e, i), qe();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function hi(e) {
	return {
		[Gr]: !0,
		mount(t, n, r) {
			let i = !1, a = Fr({ ...n }), o = hr(mi, {
				target: t,
				context: /* @__PURE__ */ new Map(),
				props: {
					component: e,
					propsStore: a,
					onFailure: r ? (e) => queueMicrotask(() => {
						i || r.onError(e);
					}) : void 0
				}
			});
			return {
				update(e) {
					a.set({ ...e });
				},
				unmount: () => {
					i = !0, yr(o).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function gi(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Wr(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Wr(a, i) : o;
}
// packages/ui-kit/src/platform/clipboard.ts
async function _i(e) {
	let t = $r();
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
var vi = "tool-error-log", yi = "error_log", bi = 2e3, xi = 8e3, Si = {
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
	let n = ["Chronos Error Log", `Plugin: ${vi} v${t.pluginVersion}`];
	t.userAgent && n.push(`User-Agent: ${t.userAgent}`);
	let r = [...e].sort((e, t) => t.ts - e.ts).map(Oi).join("\n\n");
	return r ? `${n.join("\n")}\n\n---\n\n${r}` : n.join("\n");
}
// packages/plugins/error-log/src/runtime.svelte.ts
var Ai = /* @__PURE__ */ new WeakMap();
function ji(e) {
	let t = Ai.get(e);
	if (!t) throw Error(`[ErrorLogRuntime] not initialized for plugin "${e.pluginId}"`);
	return t;
}
function Mi(e) {
	let t = /* @__PURE__ */ It([]), n = Promise.resolve();
	function r(e) {
		return n = n.then(e, e), n;
	}
	let i = {
		get entries() {
			return Z(t);
		},
		async load() {
			await n;
			let r = await e.storage.get(yi);
			N(t, Ei(r));
		},
		async append(n) {
			N(t, Di(Z(t), n)), await r(() => e.storage.set(yi, Z(t)));
		},
		async clear() {
			N(t, []), await r(() => e.storage.delete(yi));
		},
		dispose() {
			Ai.get(e) === i && Ai.delete(e);
		}
	};
	return Ai.set(e, i), i;
}
// packages/plugins/error-log/src/index.ts
function Ni(e = {}) {
	let { screenComponent: t } = e;
	return Yr({
		id: vi,
		messages: Si,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 50,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = Mi(e);
			e.addDisposable({ dispose: () => r.dispose() }), await r.load();
			let i = e.tryService(Ur);
			e.on("plugin:loaded", ({ pluginId: t }) => {
				t === e.pluginId && i && i.onCaptured((t) => {
					r.append(t).catch((t) => {
						e.signal.aborted || console.warn("[error-log] Failed to save captured error", t);
					});
				});
			}), e.registerSlot("mine.item", {
				id: "error-log",
				sectionId: vi,
				title: () => n("mine.title"),
				href: `/plugins/${vi}`,
				icon: "history",
				iconTone: "secondary",
				order: 35
			}), e.registerSlot("shell.route.screen", {
				id: vi,
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
	return _i(e);
}
// packages/plugins/error-log/src/ErrorLogScreen.svelte
var Ii = /* @__PURE__ */ or("<div class=\"p-6 text-center\"><p class=\"text-body-medium text-on-surface-variant\"> </p></div>"), Li = /* @__PURE__ */ or("<p class=\"text-title-small text-on-surface\"> </p>"), Ri = /* @__PURE__ */ or("<pre class=\"text-body-small text-supporting mt-2 max-h-40 overflow-auto font-mono whitespace-pre-wrap text-on-surface-variant\"> </pre>"), zi = /* @__PURE__ */ or("<div class=\"flex items-start justify-between gap-3 p-3\"><div class=\"min-w-0 flex-1\"><p class=\"text-body-small text-supporting text-on-surface-variant\"> </p> <!> <p class=\"text-body-medium text-on-surface\"> </p> <!></div> <button type=\"button\" class=\"ui-btn ui-btn-text shrink-0\"> </button></div>"), Bi = /* @__PURE__ */ or("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><div class=\"ui-page-surface secondary-scroll min-h-0 flex-1 overflow-y-auto\"><div class=\"p-4\"><div class=\"ui-section-surface divide-y divide-outline/10 overflow-hidden\"><!></div></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button></div></div></div>");
function Vi(e, t) {
	Ke(t, !0);
	let n = /* @__PURE__ */ ut(() => Xr(t.controller.snapshot)), r = /* @__PURE__ */ ut(() => ji(t.context)), i = /* @__PURE__ */ ut(() => {
		let e = /* @__PURE__ */ new Set();
		return [...Z(r).entries].sort((e, t) => t.ts - e.ts).filter((t) => !e.has(t.id) && (e.add(t.id), !0));
	}), a = /* @__PURE__ */ ut(() => t.context);
	function o(e) {
		return Z(n).current.slotVersion, gi(t.controller, vi, Si, e);
	}
	function s(e) {
		return new Date(e).toLocaleString(Z(n).current.locale);
	}
	async function c(e) {
		let t = await Fi(ki(e, {
			pluginVersion: Jr(),
			userAgent: typeof navigator < "u" ? navigator.userAgent : void 0
		}));
		Kr(Z(a), Pi.copy), Z(a).actions.notify(o(t ? "screen.notify.copySuccess" : "screen.notify.copyFailed"), t ? "info" : "error");
	}
	async function l() {
		await c(Z(i));
	}
	async function u(e) {
		await c([e]);
	}
	async function d() {
		await Z(r).clear(), Kr(Z(a), Pi.clear), Z(a).actions.notify(o("screen.notify.cleared"), "info");
	}
	let f = /* @__PURE__ */ ut(() => [{
		id: "copy-all",
		label: o("screen.action.copyAll"),
		icon: "content-copy",
		variant: "outlined",
		disabled: Z(i).length === 0,
		onClick: l
	}, {
		id: "clear",
		label: o("screen.action.clear"),
		icon: "delete",
		variant: "outlined",
		disabled: Z(i).length === 0,
		onClick: d
	}]);
	ln(() => t.edgeActions?.register(Z(f)));
	var p = Bi(), m = I(p), h = I(m), g = I(h), _ = I(g), v = (e) => {
		var t = Ii(), n = L(I(t), !0);
		D(t), hn((e) => $(n, e), [() => o("screen.empty")]), cr(e, t);
	}, y = (e) => {
		var t = sr();
		Tr(Zt(t), 17, () => Z(i), (e) => e.id, (e, t) => {
			var n = zi(), r = I(n), i = I(r), a = L(i), c = Qt(i, 2), l = (e) => {
				var n = Li(), r = L(n, !0);
				hn(() => $(r, Z(t).name)), cr(e, n);
			};
			xr(c, (e) => {
				Z(t).name && e(l);
			});
			var d = Qt(c, 2), f = L(d, !0), p = Qt(d, 2), m = (e) => {
				var n = Ri(), r = L(n, !0);
				hn(() => $(r, Z(t).stack)), cr(e, n);
			};
			xr(p, (e) => {
				Z(t).stack && e(m);
			}), D(r);
			var h = Qt(r, 2), g = L(h, !0);
			D(n), hn((e, n) => {
				$(a, `${e ?? ""} · ${Z(t).source ?? ""}`), $(f, Z(t).message), $(g, n);
			}, [() => s(Z(t).ts), () => o("screen.action.copyOne")]), Qn("click", h, () => u(Z(t))), cr(e, n);
		}), cr(e, t);
	};
	xr(_, (e) => {
		Z(i).length === 0 ? e(v) : e(y, -1);
	}), D(g), D(h), D(m), Mr(m, (e) => fi?.(e));
	var b = Qt(m, 2), x = I(b), S = I(x), ee = L(S, !0), C = Qt(S, 2), te = L(C, !0);
	D(x), D(b), D(p), hn((e, t) => {
		S.disabled = Z(i).length === 0, $(ee, e), C.disabled = Z(i).length === 0, $(te, t);
	}, [() => o("screen.action.copyAll"), () => o("screen.action.clear")]), Qn("click", S, l), Qn("click", C, d), cr(e, p), qe();
}
Q(["click"]);
// packages/plugins/error-log/bundle/entry.ts
var Hi = Ni({ screenComponent: hi(Vi) });
export { Hi as default };
