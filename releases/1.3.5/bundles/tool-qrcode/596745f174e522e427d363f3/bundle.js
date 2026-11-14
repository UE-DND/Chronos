// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/constants.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/hydration.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/equality.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/errors.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/context.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/context.js
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
		r: G,
		l: null
	};
}
function Ye(e) {
	var t = w, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) rn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, w = t.p, Xe(e);
}
function Xe(e = {}) {
	return s(e, fe, { value: !0 }), e;
}
function Ze() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/task.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/status.js
var et = ~(_ | v | g);
function E(e, t) {
	e.f = e.f & et | t;
}
function tt(e) {
	e.f & 512 || e.deps === null ? E(e, g) : E(e, v);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/utils.js
function nt(e, t) {
	e.f & 2048 ? t.set(e, _) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, v), E(e, g);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function rt(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/async.js
function it(e, t, n, r) {
	let i = Ze() ? ct : dt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = at(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ ut(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), ot());
	}) : f();
}
function at() {
	var e = G, t = H, n = w, r = O;
	return function(i = !0) {
		K(e), W(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ot(e = !0) {
	K(null), W(null), Ue(null), e && O?.deactivate();
}
function st() {
	var e = G, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ct(e) {
	var n = 2 | _;
	return G !== null && (G.f |= oe), {
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
		parent: G,
		ac: null
	};
}
var lt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ut(e, n, r) {
	let i = G;
	i === null && Pe();
	var a = void 0, o = Pt(t), s = !H, c = /* @__PURE__ */ new Set();
	return sn(() => {
		var t = G, n = te();
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
	}), nn(() => {
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
	return wn(t), t;
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
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function pt(e) {
	var n, r = G, i = e.parent;
	if (!Sn && i !== null && e.v !== t && i.f & 24576) return xe(), e.v;
	K(i);
	try {
		ft(e), n = Nn(e);
	} finally {
		K(r);
	}
	return n;
}
function mt(e) {
	var t = pt(e);
	!e.equals(t) && (e.wv = An(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), vt?.capture(e, t, !0)), e.deps === null)) ? E(e, g) : Sn || (k === null ? tt(e) : (tn() || O?.is_fork) && k.set(e, t));
}
function ht(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && rt(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = h), In(t, 0), fn(t));
}
function gt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Ln(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/batch.js
var _t = null, O = null, vt = null, k = null, yt = null, bt = !1, xt = !1, St = null, Ct = null, wt = 0, Tt = 1, Et = class e {
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
			for (var r of n.d) E(r, _), t(r);
			for (r of n.m) E(r, v), t(r);
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
					t.f ^= g;
				}
			}
			n || e.push(t);
		}
		return this.#a = [], e;
	}
	#m() {
		this.started = !0;
		for (let [e, t] of this.#s) E(e, t), this.schedule(e);
		this.apply();
		for (var t = St = [], n = [], r = Ct = []; this.#a.length > 0;) {
			wt++ > 1e3 && (this.#b(), Dt());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw jt(e), this.#d() || this.discard(), t;
			}
		}
		if (O = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (St = null, Ct = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) At(e, t);
			r.length > 0 && O.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), vt = this, Ot(n), Ot(t), vt = null, this.#i?.resolve();
			var o = O;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (j.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : jn(r) && (i & 16 && this.add_dirty_reaction(r, v), Ln(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), E(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), O = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#s);
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
			xt = !0, O = this, this.#m();
		} finally {
			wt = 0, yt = null, St = null, Ct = null, xt = !1, O = null, k = null, j.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(lt);
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
		this.#u || (this.#u = !0, T(() => {
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
		return (this.#i ??= te()).promise;
	}
	static ensure() {
		if (O === null) {
			let t = O = new e();
			!xt && T(() => {
				t.started || t.flush();
			});
		}
		return O;
	}
	apply() {
		k = null;
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
		Fe();
	} catch (e) {
		R(e, yt);
	}
}
var A = null;
function Ot(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && jn(r) && (A = /* @__PURE__ */ new Set(), Ln(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && hn(r), A?.size > 0)) {
				j.clear();
				for (let e of A) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) A.has(n) && (A.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Ln(n);
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/sources.js
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
	return wn(n), n;
}
function N(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && Ze() && H.f & 4325394 && (q === null || !q.has(e)) && Re(), It(e, n ? Bt(t) : t, Ct);
}
var P = null, Ft = 0;
function It(e, t, n = null) {
	if (!e.equals(t)) {
		Sn ? j.set(e, t) : j.has(e) || j.set(e, e.v);
		var r = Et.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && pt(t), k === null && tt(t);
		}
		e.wv = An(), P = null, Ft = 0, zt(e, _, n), P = null, Ze() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? Tn([e]) : X.push(e)), !r.is_fork && Mt.size > 0 && !Nt && Lt();
	}
	return t;
}
function Lt() {
	Nt = !1;
	for (let e of Mt) {
		e.f & 1024 && E(e, v);
		let t;
		try {
			t = jn(e);
		} catch {
			t = !0;
		}
		t && Ln(e);
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
			if (i || s !== G) {
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
	var i = /* @__PURE__ */ new Map(), a = r(e), o = /* @__PURE__ */ M(0), s = null, l = On, p = (e) => {
		if (On === l) return e();
		var t = H, n = On;
		W(null), kn(l);
		var r = e();
		return W(t), kn(n), r;
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
			if (n === de) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== t || Reflect.has(e, n);
			return (r !== void 0 || (G !== null || H !== null) && (!a || c(e, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ M(a ? Bt(e[n]) : t, s)), i.set(n, r)), Z(r) === t) ? !1 : a;
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
			Z(o);
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
	return t && Qt(n), S(n), n;
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
		Qt(x);
	}
	return x;
}
function Jt(e, t = !1) {
	if (!b) return /* @__PURE__ */ Kt(e);
	var n = L(e, t);
	return C(e), n;
}
function Yt(e, t = 1, n = !1) {
	let r = b ? x : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ I(r);
	if (!b) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), S(a), a;
		}
		Qt(r);
	}
	return S(r), r;
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
	if (t === null) return H.f |= ue, e;
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
function en(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = G;
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
			Ln(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && en(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function tn() {
	return H !== null && !U;
}
function nn(e) {
	let t = z(8, null);
	return E(t, g), t.teardown = e, t;
}
function rn(e) {
	return z(4 | se, e);
}
function an(e) {
	Et.ensure();
	let t = z(64 | oe, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? gn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function on(e) {
	return z(4, e);
}
function sn(e) {
	return z(le | oe, e);
}
function cn(e, t = 0) {
	return z(8 | t, e);
}
function ln(e, t = [], n = [], r = []) {
	it(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(Z));
		});
	});
}
function un(e, t = 0) {
	return z(16 | t, e);
}
function B(e) {
	return z(32 | oe, e);
}
function dn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Sn, r = H;
		Cn(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			Cn(n), W(r);
		}
	}
}
function fn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && rt(() => {
			e.abort(ye);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (mn(e.nodes.start, e.nodes.end), n = !0), e.f |= ie, fn(e, t && !n), In(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	dn(e), e.f ^= ie, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && hn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function mn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ I(e);
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
		e.f ^= ne;
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
		e.f ^= ne, e.f & 1024 || (E(e, _), Et.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ I(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/legacy.js
var xn = null, Sn = !1;
function Cn(e) {
	Sn = e;
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
function wn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function Tn(e) {
	X = e;
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
			if (jn(a) && mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && E(e, g);
	}
	return !1;
}
function Mn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Mn(a, t, !1) : t === a && (n ? E(a, _) : a.f & 1024 && E(a, v), kt(a));
	}
}
function Nn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = w, s = U, c = On, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Ue(e.ctx), U = !1, On = ++Dn, e.ac !== null && (rt(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= ce;
		var u = e.fn, d = u();
		e.f |= y;
		var f = Pn(e);
		if (Ze() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Mn(X[p], e);
		if (i !== null && i !== e) {
			if (Dn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Dn;
			if (t !== null) for (let e of t) e.rv = Dn;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= ue), d;
	} catch (t) {
		return Pn(e), $t(t);
	} finally {
		e.f ^= ce, J = t, Y = n, X = r, H = i, q = a, Ue(o), U = s, On = c;
	}
}
function Pn(e) {
	var t = e.deps, n = O?.is_fork;
	if (J !== null) {
		var r;
		if (n || In(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (tn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (In(e, Y), t.length = Y);
	return t;
}
function Fn(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var o = i.call(r, e);
		if (o !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[o] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (J === null || !a.call(J, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && tt(c), c.ac !== null && rt(() => {
			c.ac.abort(ye), c.ac = null, E(c, _);
		}), ht(c), In(c, 0);
	}
}
function In(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Fn(e, n[r]);
}
function Ln(e) {
	var t = e.f;
	if (!(t & 16384)) {
		E(e, g);
		var n = G;
		G = e;
		try {
			t & 16777232 ? pn(e) : fn(e), dn(e);
			var r = Nn(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = En;
		} finally {
			G = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (xn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Dn && (e.rv = Dn, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], a.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : a.call(r, H) || r.push(H);
		}
	}
	if (Sn && j.has(e)) return j.get(e);
	if (t) {
		var i = e;
		if (Sn) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || zn(i)) && (o = pt(i)), j.set(i, o), o;
		}
		var s = !(i.f & 512) && !U && H !== null && !!(H.f & 512), c = (i.f & y) === 0;
		jn(i) && (s && (i.f |= 512), mt(i)), s && !c && (gt(i), Rn(i));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Rn(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : a.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (gt(n), Rn(n));
	}
}
function zn(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (j.has(t) || t.f & 2 && zn(t)) return !0;
	return !1;
}
function Bn(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/events.js
var Vn = Symbol("events"), Hn = /* @__PURE__ */ new Set(), Un = /* @__PURE__ */ new Set();
function Wn(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Yn.call(t, e), !e.cancelBubble) return rt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, T(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Gn(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Wn(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && nn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Kn(e, t, n) {
	(t[Vn] ??= {})[e] = n;
}
function Q(e) {
	for (var t = 0; t < e.length; t++) Hn.add(e[t]);
	for (var n of Un) n(e);
}
var qn = null, Jn = !1;
function Yn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	qn = e, Jn || (Jn = !0, setTimeout(() => {
		Jn = !1, qn = null;
	}));
	var o = 0, c = qn === e && e[Vn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Vn] = t;
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
		var d = H, f = G;
		W(null), K(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Vn]?.[r];
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
			e[Vn] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/reconciler.js
var Xn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Zn(e) {
	return Xn?.createHTML(e) ?? e;
}
function Qn(e) {
	var t = Zt("template");
	return t.innerHTML = Zn(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/template.js
function $n(e, t) {
	var n = G;
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
		if (b) return $n(x, null), x;
		i === void 0 && (i = Qn(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Kt(i)));
		var t = r || Ht ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Kt(t), s = t.lastChild;
			$n(o, s);
		} else $n(t, t);
		return t;
	};
}
function tr() {
	if (b) return $n(x, null), x;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), $n(t, n), e;
}
function nr(e, t) {
	if (b) {
		var n = G;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = x), Te();
	} else e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var rr = ["touchstart", "touchmove"];
function ir(e) {
	return rr.includes(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/create-subscriber.js
function ar(e) {
	let t = 0, n = Pt(0), r;
	return () => {
		tn() && (Z(n), cn(() => (t === 0 && (r = Bn(() => e(() => Rt(n)))), t += 1, () => {
			T(() => {
				--t, t === 0 && (r?.(), r = void 0, Rt(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var or = ae | oe;
function sr(e, t, n, r) {
	new cr(e, t, n, r);
}
var cr = class {
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
	#f = /* @__PURE__ */ new Map();
	#p = null;
	#m = ar(() => (this.#p = Pt(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = un(() => {
			if (b) {
				let e = Oe(this.#t);
				Te();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, or), b && (this.#e = x);
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
		T(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? Ce() : (t = !0, n && ze(), this.#s !== null && gn(this.#s, () => {
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
		return (this.#i.f & (re | ie)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), T(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
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
				}), this.#a === null ? (this.#c = null, n && this.#x(O)) : this.#u === 0 && (this.#e.before(e), this.#c = null, gn(this.#o, () => {
					this.#o = null;
				}), this.#x(O));
			}
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
			} else this.#x(O);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		nt(e, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = w;
		K(this.#i), W(this.#i), Ue(this.#i.ctx);
		try {
			return Et.ensure(), e();
		} finally {
			K(t), W(n), Ue(r);
		}
	}
	#C(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, T(() => {
			this.#d = !1, this.#p && It(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), Z(this.#p);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		O?.is_fork ? (this.#a && O.skip_effect(this.#a), this.#o && O.skip_effect(this.#o), this.#s && O.skip_effect(this.#s), O.oncommit(() => {
			this.#v() || this.#w(t);
		})) : this.#w(t);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), b && (S(this.#t), Ee(), S(De()));
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
		T(() => {
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
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function lr(e, t) {
	return dr(e, t);
}
var ur = /* @__PURE__ */ new Map();
function dr(t, { target: n, anchor: r, props: i = {}, events: a, context: s, intro: c = !0, transformError: l }) {
	Gt();
	var u = void 0, d = an(() => {
		var c = r ?? n.appendChild(F());
		sr(c, { pending: () => {} }, (n) => {
			Je({});
			var r = w;
			if (s && (r.c = s), a && (i.$$events = a), b && $n(n, null), u = t(n, i) || Xe(), b && (G.nodes.end = x, x === null || x.nodeType !== 8 || x.data !== "]")) throw Se(), e;
			Ye();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = ir(r);
					for (let e of [n, document]) {
						var a = ur.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ur.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Yn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(o(Hn)), Un.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = ur.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Yn), t.delete(e), t.size === 0 && ur.delete(r)) : t.set(e, i);
			}
			Un.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return fr.set(u, d), u;
}
var fr = /* @__PURE__ */ new WeakMap();
function pr(e, t) {
	let n = fr.get(e);
	return n ? (fr.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/branches.js
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
						bn(r, t), t.append(F()), this.#n.set(e, {
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
		var n = O, r = Xt();
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
		} else b && (this.anchor = x), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function hr(e, t, n) {
	var r;
	b && (r = x, Te());
	var i = new mr(e);
	un(() => {
		var e = t() ?? null;
		if (b && Oe(r) === "[" != (e !== null)) {
			var a = De();
			S(a), i.anchor = a, we(!1), i.ensure(e, e && ((t) => n(t, e))), we(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, ae);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/attributes.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/class.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var yr = Symbol("is custom element"), br = Symbol("is html"), xr = be ? "link" : "LINK";
function Sr(e, t, n, r) {
	var i = Cr(e);
	if (!(b && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === xr))) {
		var a = i[t];
		a !== (i[t] = n) && (t === "loading" && (e[me] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Tr(e).has(t) ? e[t] = n : (!b || typeof n != "number" && typeof n != "boolean" || a !== String(n)) && e.setAttribute(t, n));
	}
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Er(e, t) {
	return e === t || e?.[de] === t;
}
function Dr(e = Xe(), t, n, r) {
	var i = w.r, a = G;
	return on(() => {
		var o, s;
		return cn(() => {
			o = s, s = r?.() || [], Bn(() => {
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/utils.js
function Or(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), h;
	let r = Bn(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/shared/index.js
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/props.js
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
			periodTimes: e.academicConfig?.periodTimes ?? []
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
	return "1.3.5";
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
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/index-client.js
function Zr(e) {
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
// packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Q(["input"]), Q(["change"]), Q(["change"]), ar((e) => {
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
var Qr = Symbol("overlay-lifecycle");
// packages/ui-kit/src/form/TimePicker.svelte
Hr.hapticFeedbackEnabled, Q(["click"]), Q(["click", "keydown"]), Hr.reduceMotionEnabled, Q(["pointerdown"]), Q(["keydown", "click"]), Q(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var $r = /* @__PURE__ */ er("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function ei(e, t) {
	Je(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = $r(), i = L(r), a = Jt(i, !0), o = Yt(i, 2), s = Jt(o, !0);
	C(r), ln((e, t) => {
		$(a, e), $(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), Kn("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), nr(e, r), Ye();
}
Q(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [ti, ni] = We();
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Q(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var ri = /* @__PURE__ */ er("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function ii(e, t) {
	Je(t, !0), Ke(Qr, Bn(() => jr(t.propsStore)).overlayParent);
	let n = /* @__PURE__ */ D(() => t.component), r = /* @__PURE__ */ D(() => Zr(t.propsStore).current);
	var i = ri();
	sr(L(i), {
		onerror: (e) => {
			console.error("[MountableSvelteHost] render failed:", e), t.onFailure?.(e);
		},
		failed: (e, t = h, n = h) => {
			ei(e, {
				get controller() {
					return Z(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = tr();
		hr(qt(t), () => Z(n), (e, t) => {
			t(e, Nr(() => Z(r)));
		}), nr(e, t);
	}), C(i), nr(e, i), Ye();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function ai(e) {
	return {
		[qr]: !0,
		mount(t, n, r) {
			let i = !1, a = Ar({ ...n }), o = lr(ii, {
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
					i = !0, pr(o).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
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
	return !i && e.state.errorMessage && r.actions.notify(e.state.errorMessage, "error"), i;
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
var $i = /* @__PURE__ */ er("<div class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"flex flex-col gap-4\"><div><h2 class=\"text-title-medium text-on-surface\"> </h2> <p class=\"text-body-small text-supporting mt-0.5 text-on-surface-variant\"> </p></div> <input type=\"file\" accept=\"image/*,.svg\" class=\"hidden\"/> <div role=\"region\"><svg class=\"size-10 text-on-surface-variant/80\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"></rect><path d=\"M14 14h3v3h-3z\"></path><path d=\"M20 14v3h-3\"></path><path d=\"M14 20h7\"></path></svg> <div class=\"flex flex-col gap-1\"><span class=\"text-body-medium font-semibold text-on-surface\"> </span> <span class=\"text-body-small text-supporting text-on-surface-variant\"> </span></div> <button type=\"button\" class=\"ui-btn ui-btn-filled mt-1\"> </button></div></div></div>");
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
			await si(t.transfer, "qrcode", { content: n }, t.context) && t.onContinue();
		} catch (e) {
			let n = e instanceof Error ? e.message : a("import.error.decodeFailed");
			t.context.actions.notify(n, "error");
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
	var ee = $i(), te = L(ee), g = L(te), _ = L(g), v = Jt(_, !0), ne = Jt(Yt(_, 2), !0);
	C(g);
	var re = Yt(g, 2);
	Dr(re, (e) => N(r, e), () => Z(r));
	var y = Yt(re, 2), ie = Yt(L(y), 2), ae = L(ie), oe = Jt(ae, !0), se = Jt(Yt(ae, 2), !0);
	C(ie);
	var ce = Yt(ie, 2), le = Jt(ce, !0);
	C(y), C(te), C(ee), ln(() => {
		$(v, Z(o)), $(ne, Z(s)), vr(y, 1, `flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${Z(i) ? "border-primary bg-primary/5" : "border-outline/40 bg-surface-variant/20"}`), Sr(y, "aria-label", Z(f)), $(oe, Z(c)), $(se, Z(l)), ce.disabled = Z(n), $(le, Z(n) ? Z(d) : Z(u));
	}), Kn("change", re, m), Gn("dragover", y, (e) => {
		e.preventDefault(), N(i, !0);
	}), Gn("dragleave", y, () => N(i, !1)), Gn("drop", y, h), Kn("click", ce, () => Z(r)?.click()), nr(e, ee), Ye();
}
Q(["change", "click"]);
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
			e.registerSlot("import.source.tab", {
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
