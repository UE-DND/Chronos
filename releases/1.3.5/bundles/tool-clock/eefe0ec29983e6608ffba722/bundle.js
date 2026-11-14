// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/constants.js
var e = {}, t = Symbol("uninitialized"), n = "http://www.w3.org/1999/xhtml", r = "@attach", i = Array.isArray, a = Array.prototype.indexOf, o = Array.prototype.includes, s = Array.from, c = Object.defineProperty, l = Object.getOwnPropertyDescriptor, u = Object.getOwnPropertyDescriptors, d = Object.prototype, f = Array.prototype, p = Object.getPrototypeOf, m = Object.isExtensible;
function h(e) {
	return typeof e == "function";
}
var g = () => {};
function _(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function v() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/constants.js
var y = 1 << 24, b = 1024, x = 2048, S = 4096, C = 8192, ee = 16384, te = 32768, ne = 1 << 25, re = 65536, ie = 1 << 19, ae = 1 << 20, oe = 1 << 25, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("component"), fe = Symbol("legacy props"), pe = Symbol(""), me = Symbol("attributes"), he = Symbol("class"), ge = Symbol("style"), _e = Symbol("text"), ve = Symbol("form reset"), ye = new class extends Error {
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
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function we() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function Te(e) {
	w = e;
}
var T;
function Ee(t) {
	if (t === null) throw Se(), e;
	return T = t;
}
function De() {
	return Ee(/* @__PURE__ */ gn(T));
}
function E(t) {
	if (w) {
		if (/* @__PURE__ */ gn(T) !== null) throw Se(), e;
		T = t;
	}
}
function Oe(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ gn(n);
		T = n;
	}
}
function ke(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ gn(n);
		e && n.remove(), n = i;
	}
}
function Ae(t) {
	if (!t || t.nodeType !== 8) throw Se(), e;
	return t.data;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/equality.js
function je(e) {
	return e === this.v;
}
function Me(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ne(e) {
	return !Me(e, this.v);
}
function Pe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Fe() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/errors.js
function Ie() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Le(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Re(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ze() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Be(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function He(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ge() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ke() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/context.js
function qe(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Fe(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function Je(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Ye(e, t) {
	return e === null && Pe(t), e.c ??= new Map(Je(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/context.js
var Xe = null;
function Ze(e) {
	Xe = e;
}
function Qe() {
	return qe($e, et, tt);
}
function $e(e) {
	return Ye(Xe, "getContext").get(e);
}
function et(e, t) {
	return Ye(Xe, "setContext").set(e, t), t;
}
function tt(e) {
	return Ye(Xe, "hasContext").has(e);
}
function nt() {
	return Ye(Xe, "getAllContexts");
}
function D(e, t = !1, n) {
	Xe = {
		p: Xe,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: z,
		l: null
	};
}
function O(e) {
	var t = Xe, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) kn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Xe = t.p, rt(e);
}
function rt(e = {}) {
	return c(e, de, { value: !0 }), e;
}
function it() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/task.js
var at = [];
function ot() {
	var e = at;
	at = [], _(e);
}
function st(e) {
	if (at.length === 0 && !Pt) {
		var t = at;
		queueMicrotask(() => {
			t === at && ot();
		});
	}
	at.push(e);
}
function ct() {
	for (; at.length > 0;) ot();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/status.js
var lt = ~(x | S | b);
function ut(e, t) {
	e.f = e.f & lt | t;
}
function dt(e) {
	e.f & 512 || e.deps === null ? ut(e, b) : ut(e, S);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/utils.js
function ft(e, t) {
	e.f & 2048 ? t.set(e, x) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, S), ut(e, b);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/misc.js
function pt(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, st(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var mt = !1;
function ht() {
	mt || (mt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ve]?.();
		});
	}, { capture: !0 }));
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function gt(e) {
	var t = R, n = z;
	er(null), tr(null);
	try {
		return e();
	} finally {
		er(t), tr(n);
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/async.js
function _t(e, t, n, r) {
	let i = it() ? xt : wt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = z, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Cn(e, s);
			}
			yt();
		}
	}
	var d = bt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Ct(e))).then(u).catch((e) => Cn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), yt());
	}) : f();
}
function vt() {
	var e = z, t = R, n = Xe, r = A;
	return function(i = !0) {
		tr(e), er(t), Ze(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	tr(null), er(null), Ze(null), e && A?.deactivate();
}
function bt() {
	var e = z, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
	var n = 2 | x;
	return z !== null && (z.f |= ie), {
		ctx: Xe,
		deps: null,
		effects: null,
		equals: je,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: z,
		ac: null
	};
}
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, n, r) {
	let i = z;
	i === null && Ie();
	var a = void 0, o = Zt(t), s = !R, c = /* @__PURE__ */ new Set();
	return Pn(() => {
		var t = z, n = v();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = bt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(St);
			else for (let e of c.values()) e.reject(St);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== St && (r.activate(), t ? (o.f |= le, tn(o, t)) : (o.f & 8388608 && (o.f ^= le), tn(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), On(() => {
		for (let e of c) e.reject(St);
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
function k(e) {
	let t = /* @__PURE__ */ xt(e);
	return rr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function wt(e) {
	let t = /* @__PURE__ */ xt(e);
	return t.equals = Ne, t;
}
function Tt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Hn(t[n]);
	}
}
function Et(e) {
	var n, r = z, i = e.parent;
	if (!Zn && i !== null && e.v !== t && i.f & 24576) return xe(), e.v;
	tr(i);
	try {
		Tt(e), n = hr(e);
	} finally {
		tr(r);
	}
	return n;
}
function Dt(e) {
	var t = Et(e);
	!e.equals(t) && (e.wv = fr(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null)) ? ut(e, b) : Zn || (Mt === null ? dt(e) : (Dn() || A?.is_fork) && Mt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && gt(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = g), vr(t, 0), Bn(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && yr(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/batch.js
var At = null, A = null, jt = null, Mt = null, Nt = null, Pt = !1, Ft = !1, It = null, Lt = null, Rt = 0, zt = 1, Bt = class e {
	id = zt++;
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
		At === null ? At = this : (At.next = this, this.prev = At), At = this;
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
			for (var r of n.d) ut(r, x), t(r);
			for (r of n.m) ut(r, S), t(r);
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
					t.f ^= b;
				}
			}
			n || e.push(t);
		}
		return this.#a = [], e;
	}
	#m() {
		this.started = !0;
		for (let [e, t] of this.#s) ut(e, t), this.schedule(e);
		this.apply();
		for (var t = It = [], n = [], r = Lt = []; this.#a.length > 0;) {
			Rt++ > 1e3 && (this.#b(), Ht());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw qt(e), this.#d() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (It = null, Lt = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) Kt(e, t);
			r.length > 0 && A.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), jt = this, Wt(n), Wt(t), jt = null, this.#i?.resolve();
			var o = A;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (Yt.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= b;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= b : i & 4 ? t.push(r) : pr(r) && (i & 16 && this.add_dirty_reaction(r, S), yr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), ut(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), A = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) ft(e[t], this.#s);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), Mt?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, Mt = null;
	}
	flush() {
		try {
			Ft = !0, A = this, this.#m();
		} finally {
			Rt = 0, Nt = null, It = null, Lt = null, Ft = !1, A = null, Mt = null, Yt.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(St);
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
		this.#u || (this.#u = !0, st(() => {
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
		return (this.#i ??= v()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!Ft && !Pt && st(() => {
				t.started || t.flush();
			});
		}
		return A;
	}
	apply() {
		Mt = null;
	}
	schedule(e) {
		Nt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e);
	}
	#b() {
		if (this.linked) {
			var e = this.prev, t = this.next;
			e === null || (e.next = t), t === null ? At = e : t.prev = e, this.linked = !1;
		}
	}
};
function Vt(e) {
	var t = Pt, n = jt;
	jt = null, Pt = !0;
	try {
		var r;
		for (e && (Vt(), r = e());;) {
			if (ct(), A === null) return r;
			A.flush();
		}
	} finally {
		Pt = t, jt = n;
	}
}
function Ht() {
	try {
		Ve();
	} catch (e) {
		Cn(e, Nt);
	}
}
var Ut = null;
function Wt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && pr(r) && (Ut = /* @__PURE__ */ new Set(), yr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Wn(r), Ut?.size > 0)) {
				Yt.clear();
				for (let e of Ut) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ut.has(n) && (Ut.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || yr(n);
					}
				}
				Ut.clear();
			}
		}
		Ut = null;
	}
}
function Gt(e) {
	A.schedule(e);
}
function Kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), ut(e, b);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	ut(e, b);
	for (var t = e.first; t !== null;) qt(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/sources.js
var Jt = /* @__PURE__ */ new Set(), Yt = /* @__PURE__ */ new Map(), Xt = !1;
function Zt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: je,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = Zt(e, t);
	return rr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Qt(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = Ne), r;
}
function M(e, t, n = !1) {
	return R !== null && (!$n || R.f & 131072) && it() && R.f & 4325394 && (nr === null || !nr.has(e)) && Ge(), tn(e, n ? on(t) : t, Lt);
}
var $t = null, en = 0;
function tn(e, t, n = null) {
	if (!e.equals(t)) {
		Zn ? Yt.set(e, t) : Yt.has(e) || Yt.set(e, e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Mt === null && dt(t);
		}
		e.wv = fr(), $t = null, en = 0, an(e, x, n), $t = null, it() && z !== null && z.f & 1024 && !(z.f & 96) && (or === null ? sr([e]) : or.push(e)), !r.is_fork && Jt.size > 0 && !Xt && nn();
	}
	return t;
}
function nn() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && ut(e, S);
		let t;
		try {
			t = pr(e);
		} catch {
			t = !0;
		}
		t && yr(e);
	}
	Jt.clear();
}
function rn(e) {
	M(e, e.v + 1);
}
function an(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = it(), a = r.length;
		if (en += a, en > 1e5 && $t === null && ($t = /* @__PURE__ */ new Set()), $t !== null) {
			if ($t.has(e)) return;
			$t.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== z) {
				var l = (c & x) === 0;
				if (l && ut(s, t), c & 131072) Jt.add(s);
				else if (c & 2) {
					var u = s;
					Mt?.delete(u), an(u, S, n);
				} else if (l) {
					var d = s;
					c & 16 && Ut !== null && Ut.add(d), n === null ? Gt(d) : n.push(d);
				}
			}
		}
	}
}
function on(e) {
	if (typeof e != "object" || !e || ue in e || de in e) return e;
	let n = p(e);
	if (n !== d && n !== f) return e;
	var r = /* @__PURE__ */ new Map(), a = i(e), o = /* @__PURE__ */ j(0), s = null, c = ur, u = (e) => {
		if (ur === c) return e();
		var t = R, n = ur;
		er(null), dr(c);
		var r = e();
		return er(t), dr(n), r;
	};
	return a && r.set("length", /* @__PURE__ */ j(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || Ue();
			var i = r.get(t);
			return i === void 0 ? u(() => {
				var e = /* @__PURE__ */ j(n.value, s);
				return r.set(t, e), e;
			}) : M(i, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var i = r.get(n);
			if (i === void 0) {
				if (n in e) {
					let e = u(() => /* @__PURE__ */ j(t, s));
					r.set(n, e), rn(o);
				}
			} else M(i, t), rn(o);
			return !0;
		},
		get(n, i, a) {
			if (i === ue) return e;
			var o = r.get(i), c = i in n;
			if (o === void 0 && (!c || l(n, i)?.writable) && (o = u(() => /* @__PURE__ */ j(on(c ? n[i] : t), s)), r.set(i, o)), o !== void 0) {
				var d = B(o);
				return d === t ? void 0 : d;
			}
			return Reflect.get(n, i, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var i = Reflect.getOwnPropertyDescriptor(e, n), a = r.get(n);
			if (a !== void 0) {
				var o = B(a);
				if (o === t) return;
				if (i && "value" in i) i.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return i;
		},
		has(e, n) {
			if (n === ue) return !0;
			var i = r.get(n), a = i !== void 0 && i.v !== t || Reflect.has(e, n);
			return (i !== void 0 || (z !== null || R !== null) && (!a || l(e, n)?.writable)) && (i === void 0 && (i = u(() => /* @__PURE__ */ j(a ? on(e[n]) : t, s)), r.set(n, i)), B(i) === t) ? !1 : a;
		},
		set(e, n, i, c) {
			var d = r.get(n), f = n in e;
			if (a && n === "length") for (var p = i; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = u(() => /* @__PURE__ */ j(t, s)), r.set(p + "", m)) : M(m, t);
			}
			if (d === void 0) (!f || l(e, n)?.writable) && (d = u(() => /* @__PURE__ */ j(void 0, s)), M(d, on(i)), r.set(n, d));
			else {
				f = d.v !== t;
				var h = u(() => on(i));
				M(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(c, i), !f) {
				if (a && typeof n == "string") {
					var _ = r.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && M(_, v + 1);
				}
				rn(o);
			}
			return !0;
		},
		ownKeys(e) {
			B(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = r.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [i, a] of r) a.v !== t && !(i in e) && n.push(i);
			return n;
		},
		setPrototypeOf() {
			We();
		}
	});
}
function sn(e) {
	try {
		if (typeof e == "object" && e && ue in e) return e[ue];
	} catch {}
	return e;
}
function cn(e, t) {
	return Object.is(sn(e), sn(t));
}
var ln, un, dn, fn;
function pn() {
	if (ln === void 0) {
		ln = window, un = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		dn = l(t, "firstChild").get, fn = l(t, "nextSibling").get, m(e) && (e[he] = void 0, e[me] = null, e[ge] = void 0, e.__e = void 0), m(n) && (n[_e] = void 0);
	}
}
function mn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function hn(e) {
	return dn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function gn(e) {
	return fn.call(e);
}
function N(e, t) {
	if (!w) return /* @__PURE__ */ hn(e);
	var n = /* @__PURE__ */ hn(T);
	if (n === null) n = T.appendChild(mn());
	else if (t && n.nodeType !== 3) {
		var r = mn();
		return n?.before(r), Ee(r), r;
	}
	return t && xn(n), Ee(n), n;
}
function P(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ hn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ gn(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = mn();
			return T?.before(r), Ee(r), r;
		}
		xn(T);
	}
	return T;
}
function _n(e, t = !1) {
	if (!w) return /* @__PURE__ */ hn(e);
	var n = N(e, t);
	return E(e), n;
}
function F(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ gn(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = mn();
			return r === null ? i?.after(a) : r.before(a), Ee(a), a;
		}
		xn(r);
	}
	return Ee(r), r;
}
function vn(e) {
	e.textContent = "";
}
function yn() {
	return !1;
}
function bn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function xn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Sn(e) {
	var t = z;
	if (t === null) return R.f |= le, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Cn(e, t);
}
function Cn(t, n) {
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
function wn(e) {
	z === null && (R === null && Be(e), ze()), Zn && Re(e);
}
function Tn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function En(e, t) {
	var n = z;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: Xe,
		deps: null,
		nodes: null,
		f: e | x | 512,
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
	if (e & 4) It === null ? Bt.ensure().schedule(r) : It.push(r);
	else if (t !== null) {
		try {
			yr(r);
		} catch (e) {
			throw Hn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= re));
	}
	if (i !== null && (i.parent = n, n !== null && Tn(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Dn() {
	return R !== null && !$n;
}
function On(e) {
	let t = En(8, null);
	return ut(t, b), t.teardown = e, t;
}
function I(e) {
	wn("$effect");
	var t = z.f;
	if (!R && t & 32 && Xe !== null && !Xe.i) {
		var n = Xe;
		(n.e ??= []).push(e);
	} else return kn(e);
}
function kn(e) {
	return En(4 | ae, e);
}
function An(e) {
	return wn("$effect.pre"), En(8 | ae, e);
}
function jn(e) {
	Bt.ensure();
	let t = En(64 | ie, e);
	return () => {
		Hn(t);
	};
}
function Mn(e) {
	Bt.ensure();
	let t = En(64 | ie, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Gn(t, () => {
			Hn(t), n(void 0);
		}) : (Hn(t), n(void 0));
	});
}
function Nn(e) {
	return En(4, e);
}
function Pn(e) {
	return En(ce | ie, e);
}
function Fn(e, t = 0) {
	return En(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		En(8, () => {
			e(...t.map(B));
		});
	});
}
function In(e, t = 0) {
	return En(16 | t, e);
}
function Ln(e, t = 0) {
	return En(y | t, e);
}
function Rn(e) {
	return En(32 | ie, e);
}
function zn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Zn, r = R;
		Qn(!0), er(null);
		try {
			t.call(null);
		} catch (t) {
			Cn(t, e.parent);
		} finally {
			Qn(n), er(r);
		}
	}
}
function Bn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && gt(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Hn(n, t), n = r;
	}
}
function Vn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Hn(t), t = n;
	}
}
function Hn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Un(e.nodes.start, e.nodes.end), n = !0), e.f |= ne, Bn(e, t && !n), vr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	zn(e), e.f ^= ne, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && Wn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Un(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ gn(e);
		e.remove(), e = n;
	}
}
function Wn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Gn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Kn(e, r, !0);
	var i = () => {
		n && Hn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Kn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Kn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function qn(e) {
	e.f &= -257, Jn(e, !0);
}
function Jn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= C, e.f & 1024 || (ut(e, x), Bt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Jn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Yn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ gn(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/legacy.js
var Xn = null, Zn = !1;
function Qn(e) {
	Zn = e;
}
var R = null, $n = !1;
function er(e) {
	R = e;
}
var z = null;
function tr(e) {
	z = e;
}
var nr = null;
function rr(e) {
	R !== null && (R.f & 2097152 || R.f & 2) && (nr ??= /* @__PURE__ */ new Set()).add(e);
}
var ir = null, ar = 0, or = null;
function sr(e) {
	or = e;
}
var cr = 1, lr = 0, ur = lr;
function dr(e) {
	ur = e;
}
function fr() {
	return ++cr;
}
function pr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (pr(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && ut(e, b);
	}
	return !1;
}
function mr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(nr !== null && nr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? mr(a, t, !1) : t === a && (n ? ut(a, x) : a.f & 1024 && ut(a, S), Gt(a));
	}
}
function hr(e) {
	var t = ir, n = ar, r = or, i = R, a = nr, o = Xe, s = $n, c = ur, l = e.f;
	ir = null, ar = 0, or = null, R = l & 96 ? null : e, nr = null, Ze(e.ctx), $n = !1, ur = ++lr, e.ac !== null && (gt(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= te;
		var f = gr(e);
		if (it() && or !== null && !$n && f !== null && !(e.f & 6146)) for (var p = 0; p < or.length; p++) mr(or[p], e);
		if (i !== null && i !== e) {
			if (lr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = lr;
			if (t !== null) for (let e of t) e.rv = lr;
			or !== null && (r === null ? r = or : r.push(...or));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (t) {
		return gr(e), Sn(t);
	} finally {
		e.f ^= se, ir = t, ar = n, or = r, R = i, nr = a, Ze(o), $n = s, ur = c;
	}
}
function gr(e) {
	var t = e.deps, n = A?.is_fork;
	if (ir !== null) {
		var r;
		if (n || vr(e, ar), t !== null && ar > 0) for (t.length = ar + ir.length, r = 0; r < ir.length; r++) t[ar + r] = ir[r];
		else e.deps = t = ir;
		if (Dn() && e.f & 512) for (r = ar; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && ar < t.length && (vr(e, ar), t.length = ar);
	return t;
}
function _r(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var i = a.call(r, e);
		if (i !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[i] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (ir === null || !o.call(ir, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && dt(c), c.ac !== null && gt(() => {
			c.ac.abort(ye), c.ac = null, ut(c, x);
		}), Ot(c), vr(c, 0);
	}
}
function vr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) _r(e, n[r]);
}
function yr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		ut(e, b);
		var n = z;
		z = e;
		try {
			t & 16777232 ? Vn(e) : Bn(e), zn(e);
			var r = hr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = cr;
		} finally {
			z = n;
		}
	}
}
async function br() {
	await Promise.resolve(), Vt();
}
function B(e) {
	var t = !!(e.f & 2);
	if (Xn?.add(e), R !== null && !$n && !(z !== null && z.f & 16384) && (nr === null || !nr.has(e))) {
		var n = R.deps;
		if (R.f & 2097152) e.rv < lr && (e.rv = lr, ir === null && n !== null && n[ar] === e ? ar++ : ir === null ? ir = [e] : ir.push(e));
		else {
			R.deps ??= [], o.call(R.deps, e) || R.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [R] : o.call(r, R) || r.push(R);
		}
	}
	if (Zn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Zn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Sr(i)) && (a = Et(i)), Yt.set(i, a), a;
		}
		var s = !(i.f & 512) && !$n && R !== null && !!(R.f & 512), c = (i.f & te) === 0;
		pr(i) && (s && (i.f |= 512), Dt(i)), s && !c && (kt(i), xr(i));
	}
	if (Mt?.has(e)) return Mt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function xr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : o.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (kt(n), xr(n));
	}
}
function Sr(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Yt.has(t) || t.f & 2 && Sr(t)) return !0;
	return !1;
}
function V(e) {
	var t = $n;
	try {
		return $n = !0, e();
	} finally {
		$n = t;
	}
}
function Cr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ue in e) wr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ue in n && wr(n);
		}
	}
}
function wr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			wr(e[n], t);
		} catch {}
		let n = p(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = u(n);
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
var Tr = Symbol("events"), Er = /* @__PURE__ */ new Set(), Dr = /* @__PURE__ */ new Set();
function Or(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Fr.call(t, e), !e.cancelBubble) return gt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, st(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function kr(e, t, n, r = {}) {
	var i = Or(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function Ar(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Or(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && On(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function jr(e, t, n) {
	(t[Tr] ??= {})[e] = n;
}
function Mr(e) {
	for (var t = 0; t < e.length; t++) Er.add(e[t]);
	for (var n of Dr) n(e);
}
var Nr = null, Pr = !1;
function Fr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Nr = e, Pr || (Pr = !0, setTimeout(() => {
		Pr = !1, Nr = null;
	}));
	var o = 0, s = Nr === e && e[Tr];
	if (s) {
		var l = i.indexOf(s);
		if (l !== -1 && (t === document || t === window)) {
			e[Tr] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		c(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = R, f = z;
		er(null), tr(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Tr]?.[r];
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
			e[Tr] = t, delete e.currentTarget, er(d), tr(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/reconciler.js
var Ir = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Lr(e) {
	return Ir?.createHTML(e) ?? e;
}
function Rr(e) {
	var t = bn("template");
	return t.innerHTML = Lr(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/template.js
function zr(e, t) {
	var n = z;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return zr(T, null), T;
		i === void 0 && (i = Rr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ hn(i)));
		var t = r || un ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ hn(t), s = t.lastChild;
			zr(o, s);
		} else zr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Br(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (w) return zr(T, null), T;
		if (!o) {
			var e = /* @__PURE__ */ hn(Rr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ hn(e);) o.appendChild(/* @__PURE__ */ hn(e));
			else o = /* @__PURE__ */ hn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ hn(t), r = t.lastChild;
			zr(n, r);
		} else zr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Vr(e, t) {
	return /* @__PURE__ */ Br(e, t, "svg");
}
function Hr(e = "") {
	if (!w) {
		var t = mn(e + "");
		return zr(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? xn(n) : (n.before(n = mn()), Ee(n)), zr(n, n), n;
}
function U() {
	if (w) return zr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = mn();
	return e.append(t, n), zr(t, n), e;
}
function W(e, t) {
	if (w) {
		var n = z;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = T), De();
	} else e !== null && e.before(t);
}
function Ur() {
	if (w && T && T.nodeType === 8 && T.textContent?.startsWith("$")) {
		let e = T.textContent.substring(1);
		return De(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/utils.js
function Wr(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var Gr = [
	"beforeinput",
	"click",
	"change",
	"dblclick",
	"contextmenu",
	"focusin",
	"focusout",
	"input",
	"keydown",
	"keyup",
	"mousedown",
	"mousemove",
	"mouseout",
	"mouseover",
	"mouseup",
	"pointerdown",
	"pointermove",
	"pointerout",
	"pointerover",
	"pointerup",
	"touchend",
	"touchmove",
	"touchstart"
];
function Kr(e) {
	return Gr.includes(e);
}
var qr = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), Jr = {
	formnovalidate: "formNoValidate",
	ismap: "isMap",
	nomodule: "noModule",
	playsinline: "playsInline",
	readonly: "readOnly",
	defaultvalue: "defaultValue",
	defaultchecked: "defaultChecked",
	srcobject: "srcObject",
	novalidate: "noValidate",
	allowfullscreen: "allowFullscreen",
	disablepictureinpicture: "disablePictureInPicture",
	disableremoteplayback: "disableRemotePlayback"
};
function Yr(e) {
	return e = e.toLowerCase(), Jr[e] ?? e;
}
[...qr];
var Xr = ["touchstart", "touchmove"];
function Zr(e) {
	return Xr.includes(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/create-subscriber.js
function Qr(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		Dn() && (B(n), Fn(() => (t === 0 && (r = V(() => e(() => rn(n)))), t += 1, () => {
			st(() => {
				--t, t === 0 && (r?.(), r = void 0, rn(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var $r = re | ie;
function ei(e, t, n, r) {
	new ti(e, t, n, r);
}
var ti = class {
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
	#m = Qr(() => (this.#p = Zt(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = z;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = z.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = In(() => {
			if (w) {
				let e = Ae(this.#t);
				De();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, $r), w && (this.#e = T);
	}
	#h() {
		try {
			this.#a = Rn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#g(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#_(e);
		st(r), t && (this.#s = Rn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? we() : (t = !0, n && Ke(), this.#s !== null && Gn(this.#s, () => {
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
					Cn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#v() {
		return (this.#i.f & (ee | ne)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Rn(() => e(this.#e)), st(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = mn(), n = !1;
				e.append(t), this.#a = this.#S(() => {
					try {
						return Rn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							Cn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#x(A)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Gn(this.#o, () => {
					this.#o = null;
				}), this.#x(A));
			}
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Rn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Yn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Rn(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		ft(e, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = z, n = R, r = Xe;
		tr(this.#i), er(this.#i), Ze(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} finally {
			tr(t), er(n), Ze(r);
		}
	}
	#C(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, st(() => {
			this.#d = !1, this.#p && tn(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), B(this.#p);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#v() || this.#w(t);
		})) : this.#w(t);
	}
	#w(e) {
		this.#a &&= (Hn(this.#a), null), this.#o &&= (Hn(this.#o), null), this.#s &&= (Hn(this.#s), null), w && (Ee(this.#t), Oe(), Ee(ke()));
		let t = this.#n.failed, n = (e) => {
			if (this.#v()) return;
			let { reset: n, invoke_onerror: r } = this.#_(e);
			r(), t && !this.#v() && (this.#s = this.#S(() => {
				try {
					return Rn(() => {
						var r = z;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Cn(e, this.#i.parent), null;
				}
			}));
		};
		st(() => {
			if (!this.#v()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					Cn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Cn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function G(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[_e] ??= e.nodeValue) && (e[_e] = n, e.nodeValue = `${n}`);
}
function ni(e, t) {
	return ii(e, t);
}
var ri = /* @__PURE__ */ new Map();
function ii(t, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: c = !0, transformError: l }) {
	pn();
	var u = void 0, d = Mn(() => {
		var c = r ?? n.appendChild(mn());
		ei(c, { pending: () => {} }, (n) => {
			D({});
			var r = Xe;
			if (o && (r.c = o), a && (i.$$events = a), w && zr(n, null), u = t(n, i) || rt(), w && (z.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw Se(), e;
			O();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Zr(r);
					for (let e of [n, document]) {
						var a = ri.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ri.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Fr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(s(Er)), Dr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = ri.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Fr), t.delete(e), t.size === 0 && ri.delete(r)) : t.set(e, i);
			}
			Dr.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return ai.set(u, d), u;
}
var ai = /* @__PURE__ */ new WeakMap();
function oi(e, t) {
	let n = ai.get(e);
	return n ? (ai.delete(e), n(t)) : Promise.resolve();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var si = class {
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
			if (n) qn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (qn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Hn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Yn(r, t), t.append(mn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Hn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Gn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Hn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = yn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = mn();
				i.append(a), this.#n.set(e, {
					effect: Rn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Rn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function K(e, t, ...n) {
	var r = new si(e);
	In(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, re);
}
function ci(e) {
	Xe === null && Pe("onMount"), I(() => {
		let t = V(e);
		if (typeof t == "function") return t;
	});
}
function li(e) {
	Xe === null && Pe("onDestroy"), ci(() => () => V(e));
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/attachments/index.js
function ui() {
	return Symbol(r);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	w && (r = T, De());
	var i = new si(e), a = n ? re : 0;
	function o(e, t) {
		if (w) {
			var n = Ae(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ke();
				Ee(a), i.anchor = a, Te(!1), i.ensure(e, t), Te(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	In(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/key.js
var di = Symbol("NaN");
function fi(e, t, n) {
	w && De();
	var r = new si(e), i = !it();
	In(() => {
		var e = t();
		e !== e && (e = di), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/each.js
function pi(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Gn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					mi(e, s(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			vn(d), d.append(u), e.items.clear();
		}
		mi(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function mi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= oe, Yn(a, document.createDocumentFragment())) : Hn(t[i], n);
	}
}
var hi;
function gi(e, t, n, r, a, o = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = w ? Ee(/* @__PURE__ */ hn(u)) : u.appendChild(mn());
	}
	w && De();
	var d = null, f = /* @__PURE__ */ wt(() => {
		var e = n();
		return i(e) ? e : e == null ? [] : s(e);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var n = B(f);
			_.fallback = d, vi(_, n, c, t, r), d !== null && (n.length === 0 ? d.f & 33554432 ? (d.f ^= oe, bi(d, null, c)) : qn(d) : Gn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: In(() => {
			var e = B(f), i = e.length;
			let s = !1;
			w && Ae(c) === "[!" != (i === 0) && (c = ke(), Ee(c), Te(!1), s = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = A, v = yn(), y = 0; y < i; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, s = !0, Te(!1));
				var b = e[y], x = r(b, y), S = m ? null : l.get(x);
				S ? (S.v && tn(S.v, b), S.i && tn(S.i, y), v && _.unskip_effect(S.e)) : (S = yi(l, m ? c : hi ??= mn(), b, x, y, a, t, n), m || (S.e.f |= oe), l.set(x, S)), u.add(x);
			}
			if (i === 0 && o && !d && (m ? d = Rn(() => o(c)) : (d = Rn(() => o(hi ??= mn())), d.f |= oe)), i > u.size && Le("", "", ""), w && i > 0 && Ee(ke()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			s && Te(!0), B(f);
		}),
		flags: t,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, w && (c = T);
}
function _i(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function vi(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, c = e.items, l = _i(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (qn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= oe, _ === l) bi(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), xi(e, d, _), xi(e, _, y), bi(_, y, n), d = _, p = [], m = [], l = _i(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) bi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					xi(e, S.prev, C.next), xi(e, d, S), xi(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), bi(_, l, n), xi(e, _.prev, _.next), xi(e, _, d === null ? e.effect.first : d.next), xi(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = _i(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = _i(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (mi(e, s(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var ee = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || ee.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && ee.push(l), l = _i(l.next);
		var te = ee.length;
		if (te > 0) {
			var ne = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.fix();
			}
			pi(e, ee, ne);
		}
	}
	a && st(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function yi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ Qt(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Rn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function bi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ gn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function xi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Si(e, t, n) {
	var r;
	w && (r = T, De());
	var i = new si(e);
	In(() => {
		var e = t() ?? null;
		if (w && Ae(r) === "[" != (e !== null)) {
			var a = ke();
			Ee(a), i.anchor = a, Te(!1), i.ensure(e, e && ((t) => n(t, e))), Te(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, re);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ci(e, t, n) {
	Nn(() => {
		var r = V(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Fn(() => {
				var e = n();
				Cr(e), i && Me(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function wi(e, t) {
	var n = void 0, r;
	Ln(() => {
		n !== (n = t()) && (r &&= (Hn(r), null), n && (r = Rn(() => {
			Nn(() => n(e));
		})));
	});
}
// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function Ti(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Ti(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Ei() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Ti(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/attributes.js
function Di(e) {
	return typeof e == "object" ? Ei(e) : e ?? "";
}
var Oi = [..." 	\n\r\f\xA0\v﻿"];
function ki(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Oi.includes(r[o - 1])) && (s === r.length || Oi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ai(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ji(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Mi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ji)), i && c.push(...Object.keys(i).map(ji));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ji(e.substring(l, u).trim());
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
		return r && (n += Ai(r)), i && (n += Ai(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/class.js
function Ni(e, t, n, r, i, a) {
	var o = e[he];
	if (w || o !== n || o === void 0) {
		var s = ki(n, r, a);
		w && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[he] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/style.js
function Pi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Fi(e, t, n, r) {
	var i = e[ge];
	if (w || i !== t) {
		var a = Mi(t, r);
		w && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ge] = t;
	} else r && (Array.isArray(r) ? (Pi(e, n?.[0], r[0]), Pi(e, n?.[1], r[1], "important")) : Pi(e, n, r));
	return r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Ii(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Li(e, t) {
	var n = !("__defaultValue" in e);
	(n || e.__defaultValue !== t) && (e.__defaultValue = t, Ri(e, !n || "__value" in e));
}
function Ri(e, t) {
	var n = e.__defaultValue, r = e.multiple, a = r ? n ?? [] : null;
	if (!r || i(a)) {
		var o = e.selectedIndex, s = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = Vi(c);
			Ii(c, r ? a.includes(l) : cn(l, n));
		}
		if (t) {
			if (s !== null) for (c of e.options) {
				var u = s.has(c);
				c.selected !== u && (c.selected = u);
			}
			else e.selectedIndex !== o && (e.selectedIndex = o);
		}
	}
}
function zi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!i(t)) return Ce();
		for (var r of e.options) r.selected = t.includes(Vi(r));
	} else {
		for (r of e.options) if (cn(Vi(r), t)) {
			r.selected = !0;
			return;
		}
		n && t === void 0 || (e.selectedIndex = -1);
	}
}
function Bi(e) {
	var t = new MutationObserver((t) => {
		t.every(Hi) || ("__defaultValue" in e && Ri(e, !1), "__value" in e && zi(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), On(() => {
		t.disconnect();
	});
}
function Vi(e) {
	return "__value" in e ? e.__value : e.value;
}
function Hi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Ui = Symbol("class"), Wi = Symbol("style"), Gi = Symbol("is custom element"), Ki = Symbol("is html"), qi = be ? "link" : "LINK", Ji = be ? "input" : "INPUT", Yi = be ? "option" : "OPTION", Xi = be ? "select" : "SELECT", Zi = be ? "progress" : "PROGRESS";
function Qi(e) {
	if (w) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					$i(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					$i(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ve] = n, st(n), ht();
	}
}
function $i(e, t, n, r) {
	var i = ta(e);
	if (!(w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === qi))) {
		var a = i[t];
		a !== (i[t] = n) && (t === "loading" && (e[pe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ra(e).has(t) ? e[t] = n : (!w || typeof n != "number" && typeof n != "boolean" || a !== String(n)) && e.setAttribute(t, n));
	}
}
function ea(e, n, r, i, a = !1, o = !1) {
	w && a && e.nodeName === Ji && ("defaultValue" in r || "defaultChecked" in r || Qi(e));
	var s = ta(e), c = s[Gi], l = !s[Ki];
	let u = w && c;
	u && Te(!1);
	var d = n || {}, f = e.nodeName === Yi, p = e.nodeName === Xi;
	try {
		for (var m in n) !(m in r) && m[0] + m[1] !== "$$" && (r[m] = null);
		r.class ? r.class = Di(r.class) : (i || r[Ui]) && (r.class = null), r[Wi] && (r.style ??= null);
		var h = ra(e);
		if (e.nodeName === Ji && "type" in r && ("value" in r || "__value" in r)) {
			var g = r.type;
			(g !== d.type || g === void 0 && e.hasAttribute("type")) && (d.type = g, $i(e, "type", g, o));
		}
		for (let a in r) {
			let u = r[a];
			if (f && a === "value" && u == null) e.value = e.__value = "", d[a] = u;
			else if (a === "class") Ni(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", u, i, n?.[Ui], r[Ui]), d[a] = u, d[Ui] = r[Ui];
			else if (a === "style") Fi(e, u, n?.[Wi], r[Wi]), d[a] = u, d[Wi] = r[Wi];
			else {
				var _ = d[a];
				if (u !== _ || u === void 0 && e.hasAttribute(a)) {
					d[a] = u;
					var v = a[0] + a[1];
					if (v !== "$$") {
						if (v === "on") {
							let t = {}, n = "$$" + a, r = a.slice(2);
							var y = Kr(r);
							if (Wr(r) && (r = r.slice(0, -7), t.capture = !0), !y && _) {
								if (u != null) continue;
								e.removeEventListener(r, d[n], t), d[n] = null;
							}
							if (y) jr(r, e, u), Mr([r]);
							else if (u != null) {
								function i(e) {
									d[a].call(this, e);
								}
								d[n] = Or(r, e, i, t);
							}
						} else if (a === "style") $i(e, a, u);
						else if (a === "autofocus") pt(e, !!u);
						else if (!c && (a === "__value" || a === "value" && u != null)) e.__value = u, (_ == null || e.value !== u || u === 0 && e.nodeName === Zi) && (e.value = u);
						else if (a === "selected" && f) Ii(e, u);
						else {
							var b = a;
							l || (b = Yr(b));
							var x = b === "defaultValue" || b === "defaultChecked";
							if (p && b === "defaultValue") continue;
							if (u == null && !c && !x) {
								if (s[a] = null, b === "value" || b === "checked") {
									let t = e, r = n === void 0;
									if (b === "value") {
										let e = t.defaultValue;
										t.removeAttribute(b), t.defaultValue = e, t.value = t.__value = r ? e : null;
									} else {
										let e = t.defaultChecked;
										t.removeAttribute(b), t.defaultChecked = e, t.checked = r ? e : !1;
									}
								} else e.removeAttribute(a);
							} else x || (c || typeof u != "string") && h.has(b) ? (e[b] = u, b in s && (s[b] = t)) : typeof u != "function" && $i(e, b, u, o);
						}
					}
				}
			}
		}
	} finally {
		u && Te(!0);
	}
	return d;
}
function J(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	_t(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === Xi, l = !1;
		if (Ln(() => {
			var u = t(...n.map(B)), d = ea(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && Li(f, u.defaultValue), "value" in u && zi(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || Hn(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description !== "@attach" || r && p === r[t] || (i[t] && Hn(i[t]), i[t] = Rn(() => wi(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Nn(() => {
				var e = r;
				"defaultValue" in e && Li(u, e.defaultValue), zi(u, e.value, !0), Bi(u);
			});
		}
		l = !0;
	});
}
function ta(e) {
	return e[me] ??= {
		[Gi]: e.nodeName.includes("-"),
		[Ki]: e.namespaceURI === n
	};
}
var na = /* @__PURE__ */ new Map();
function ra(e) {
	var t = e.getAttribute("is") || e.nodeName, n = na.get(t);
	if (n) return n;
	na.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = u(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = p(i);
	}
	return n;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ia(e, t) {
	return e === t || e?.[ue] === t;
}
function aa(e = rt(), t, n, r) {
	var i = Xe.r, a = z;
	return Nn(() => {
		var o, s;
		return Fn(() => {
			o = s, s = r?.() || [], V(() => {
				ia(n(...s), e) || (t(e, ...s), o && ia(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ia(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/utils.js
function oa(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), g;
	let r = V(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/shared/index.js
var sa = [];
function ca(e, t = g) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Me(e, t) && (e = t, n)) {
			let t = !sa.length;
			for (let t of r) t[1](), sa.push(t, e);
			if (t) {
				for (let e = 0; e < sa.length; e += 2) sa[e][0](sa[e + 1]);
				sa.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = g) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || g), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function la(e) {
	let t;
	return oa(e, (e) => t = e)(), t;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/store.js
var ua = !1;
function da(e) {
	var t = ua;
	try {
		return ua = !1, [e(), ua];
	} finally {
		ua = t;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/props.js
var fa = {
	get(e, t) {
		if (!e.exclude.has(t)) return e.props[t];
	},
	set(e, t) {
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		if (!e.exclude.has(t) && t in e.props) return {
			enumerable: !0,
			configurable: !0,
			value: e.props[t]
		};
	},
	has(e, t) {
		return !e.exclude.has(t) && t in e.props;
	},
	ownKeys(e) {
		return Reflect.ownKeys(e.props).filter((t) => !e.exclude.has(t));
	}
};
/*#__NO_SIDE_EFFECTS__*/
function pa(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, fa);
}
var ma = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (h(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			h(i) && (i = i());
			let a = l(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (h(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = l(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === ue || t === fe) return !1;
		for (let n of e.props) if (h(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (h(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function ha(...e) {
	return new Proxy({ props: e }, ma);
}
function Y(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ xt(r), B(u)) : (c && (c = !1, s = o ? V(r) : r), s);
	let f;
	if (a) {
		var p = ue in e || fe in e;
		f = l(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = da(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && He(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (c = !0, n);
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
	var v = !1, y = (n & 1 ? xt : wt)(() => (v = !1, g()));
	a && B(y);
	var b = z;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? B(y) : i && a ? on(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Zn && v || b.f & 16384 ? y.v : B(y);
	});
}
// packages/ui-kit/src/gesture/single-pointer-session.svelte.ts
function ga() {
	let e = /* @__PURE__ */ j(null), t = null;
	function n() {
		let n = V(() => B(e)), r = t;
		if (M(e, null), t = null, n !== null && r) try {
			r.hasPointerCapture(n) && r.releasePointerCapture(n);
		} catch {}
	}
	return {
		get id() {
			return B(e);
		},
		start(n, r = null) {
			if (B(e) !== null || n.button !== 0 || !n.isPrimary) return !1;
			M(e, n.pointerId, !0), t = r;
			try {
				r?.setPointerCapture(n.pointerId);
			} catch {}
			return !0;
		},
		owns(t) {
			return B(e) !== null && B(e) === t.pointerId;
		},
		end: n
	};
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
var _a = {
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
function va(e) {
	let [t, n, r] = e.split("-");
	return `${t}/${n.padStart(2, "0")}/${r.padStart(2, "0")}`;
}
function ya(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function ba(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
.2126 * xa(15 / 255) + .7152 * xa(23 / 255) + .0722 * xa(42 / 255);
function xa(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
// packages/core/src/types/services.ts
function Sa(e) {
	return { key: e };
}
var Ca = Sa("analytics");
// packages/core/src/i18n/i18n-catalog.ts
function wa(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
// packages/core/src/types/mountable.ts
var Ta = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral".split(","));
// packages/core/src/analytics/plugin-analytics.ts
function Ea(e, t, n) {
	let r = e.tryService(Ca);
	r && r.track(t, n);
}
// packages/core/src/plugin/define-chronos-plugin.ts
function Da(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Oa() {
	return "1.3.5";
}
function ka(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? Da(e.messages, e.nameKey),
		version: e.version ?? Oa(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? Da(e.messages, e.descriptionKey) : void 0,
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
// packages/core/src/constants/storage-namespace.ts
function Aa(e) {
	let t = e.replace(/\/+$/, "") || "/", n = `chronos:${t}:`;
	return {
		prefix: n,
		databaseName: `${n}db`,
		localeCookie: `chronos_${encodeURIComponent(t)}_locale`,
		key: (e) => n + e
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/index-client.js
function ja(e) {
	let t, n = Qr((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return Dn() ? (n(), t) : la(e);
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
// packages/ui-kit/src/schema-form/inputs/FileField.svelte
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Mr(["input"]), Mr(["change"]), Mr(["change"]);
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/map.js
var Ma = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = ur || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return ur === this.#r ? /* @__PURE__ */ j(e) : Zt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return B(this.#t), !1;
		}
		return B(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				B(this.#t);
				return;
			}
		}
		return B(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), M(this.#n, super.size), rn(o);
		else if (i !== t) {
			rn(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			s !== null && r.reactions?.every((e) => s.has(e)) || rn(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), M(n, -1)), r && (M(this.#n, super.size), rn(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			M(this.#n, 0);
			for (var t of e.values()) M(t, -1);
			rn(this.#t), e.clear();
		}
	}
	#a() {
		B(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) B(n);
	}
	keys() {
		return B(this.#t), super.keys();
	}
	values() {
		return this.#a(), super.values();
	}
	entries() {
		return this.#a(), super.entries();
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	get size() {
		return B(this.#n), super.size;
	}
}, Na = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = Qr(t);
	}
	get current() {
		return this.#t(), this.#e();
	}
}, Pa = /\(.+\)/, Fa = /* @__PURE__ */ new Set([
	"all",
	"print",
	"screen",
	"and",
	"or",
	"not",
	"only"
]), Ia = class extends Na {
	constructor(e, t) {
		let n = Pa.test(e) || e.split(/[\s,]+/).some((e) => Fa.has(e.trim())) ? e : `(${e})`, r = window.matchMedia(n);
		super(() => r.matches, (e) => kr(r, "change", e));
	}
};
// packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
Qr((e) => {
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
}), Mr([
	"click",
	"pointerdown",
	"pointerup"
]), Mr(["change"]);
// packages/ui-kit/src/overlay/history-overlay.ts
var La = Symbol("overlay-lifecycle");
function Ra(e) {
	let t, n = !1, r = !1, i = /* @__PURE__ */ new Set(), a = e.parent?.attachChild(s);
	function o() {
		for (let e of i) e();
	}
	function s() {
		if (!r) return;
		r = !1;
		let n = t;
		t = void 0, n?.dispose(), o(), e.setOpen(!1);
	}
	return {
		attachChild(e) {
			return n ? (e(), () => {}) : (i.add(e), () => i.delete(e));
		},
		syncOpenState(i) {
			if (!(n || i === r)) {
				if (r = i, i) t = e.port?.openOverlay(e.overlayId, () => {
					t = void 0, s();
				});
				else {
					let e = t;
					t = void 0, e?.close(), o();
				}
			}
		},
		dispose() {
			n || (n = !0, a?.(), s(), i.clear());
		}
	};
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/is.js
function za(e) {
	return typeof e == "function";
}
function Ba(e) {
	return typeof e == "object" && !!e;
}
var Va = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function Ha(e) {
	return e == null || Va.includes(typeof e) ? !0 : Array.isArray(e) ? e.every((e) => Ha(e)) : typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var Ua = Symbol("box"), Wa = Symbol("is-writable");
function X(e, t) {
	let n = /* @__PURE__ */ k(e);
	return t ? {
		[Ua]: !0,
		[Wa]: !0,
		get current() {
			return B(n);
		},
		set current(e) {
			t(e);
		}
	} : {
		[Ua]: !0,
		get current() {
			return e();
		}
	};
}
function Ga(e) {
	return Ba(e) && Ua in e;
}
function Ka(e) {
	return Ga(e) ? e : za(e) ? X(e) : qa(e);
}
function qa(e) {
	let t = /* @__PURE__ */ j(on(e));
	return {
		[Ua]: !0,
		[Wa]: !0,
		get current() {
			return B(t);
		},
		set current(e) {
			M(t, e, !0);
		}
	};
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
function Ja(...e) {
	return function(t) {
		for (let n of e) if (n) {
			if (t.defaultPrevented) return;
			typeof n == "function" ? n.call(this, t) : n.current?.call(this, t);
		}
	};
}
// node_modules/.pnpm/inline-style-parser@0.2.7/node_modules/inline-style-parser/esm/index.mjs
var Ya = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, Xa = /\n/g, Za = /^\s*/, Qa = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, $a = /^:\s*/, eo = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, to = /^[;\s]*/, no = /^\s+|\s+$/g, ro = "\n", io = "/", ao = "*", oo = "", so = "comment", co = "declaration";
function lo(e, t) {
	if (typeof e != "string") throw TypeError("First argument must be a string");
	if (!e) return [];
	t ||= {};
	var n = 1, r = 1;
	function i(e) {
		var t = e.match(Xa);
		t && (n += t.length);
		var i = e.lastIndexOf(ro);
		r = ~i ? e.length - i : r + e.length;
	}
	function a() {
		var e = {
			line: n,
			column: r
		};
		return function(t) {
			return t.position = new o(e), l(), t;
		};
	}
	function o(e) {
		this.start = e, this.end = {
			line: n,
			column: r
		}, this.source = t.source;
	}
	o.prototype.content = e;
	function s(i) {
		var a = /* @__PURE__ */ Error(t.source + ":" + n + ":" + r + ": " + i);
		if (a.reason = i, a.filename = t.source, a.line = n, a.column = r, a.source = e, !t.silent) throw a;
	}
	function c(t) {
		var n = t.exec(e);
		if (n) {
			var r = n[0];
			return i(r), e = e.slice(r.length), n;
		}
	}
	function l() {
		c(Za);
	}
	function u(e) {
		var t;
		for (e ||= []; t = d();) t !== !1 && e.push(t);
		return e;
	}
	function d() {
		var t = a();
		if (io == e.charAt(0) && ao == e.charAt(1)) {
			for (var n = 2; oo != e.charAt(n) && (ao != e.charAt(n) || io != e.charAt(n + 1));) ++n;
			if (n += 2, oo === e.charAt(n - 1)) return s("End of comment missing");
			var o = e.slice(2, n - 2);
			return r += 2, i(o), e = e.slice(n), r += 2, t({
				type: so,
				comment: o
			});
		}
	}
	function f() {
		var e = a(), t = c(Qa);
		if (t) {
			if (d(), !c($a)) return s("property missing ':'");
			var n = c(eo), r = e({
				type: co,
				property: uo(t[0].replace(Ya, oo)),
				value: n ? uo(n[0].replace(Ya, oo)) : oo
			});
			return c(to), r;
		}
	}
	function p() {
		var e = [];
		u(e);
		for (var t; t = f();) t !== !1 && (e.push(t), u(e));
		return e;
	}
	return l(), p();
}
function uo(e) {
	return e ? e.replace(no, oo) : oo;
}
// node_modules/.pnpm/style-to-object@1.0.14/node_modules/style-to-object/esm/index.mjs
function fo(e, t) {
	let n = null;
	if (!e || typeof e != "string") return n;
	let r = lo(e), i = typeof t == "function";
	return r.forEach((e) => {
		if (e.type !== "declaration") return;
		let { property: r, value: a } = e;
		i ? t(r, a, e) : a && (n ||= {}, n[r] = a);
	}), n;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/strings.js
var po = /\d/, mo = [
	"-",
	"_",
	"/",
	"."
];
function ho(e = "") {
	if (!po.test(e)) return e !== e.toLowerCase();
}
function go(e) {
	let t = [], n = "", r, i;
	for (let a of e) {
		let e = mo.includes(a);
		if (e === !0) {
			t.push(n), n = "", r = void 0;
			continue;
		}
		let o = ho(a);
		if (i === !1) {
			if (r === !1 && o === !0) {
				t.push(n), n = a, r = o;
				continue;
			}
			if (r === !0 && o === !1 && n.length > 1) {
				let e = n.at(-1);
				t.push(n.slice(0, Math.max(0, n.length - 1))), n = e + a, r = o;
				continue;
			}
		}
		n += a, r = o, i = e;
	}
	return t.push(n), t;
}
function _o(e) {
	return e ? go(e).map((e) => yo(e)).join("") : "";
}
function vo(e) {
	return bo(_o(e || ""));
}
function yo(e) {
	return e ? e[0].toUpperCase() + e.slice(1) : "";
}
function bo(e) {
	return e ? e[0].toLowerCase() + e.slice(1) : "";
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function xo(e) {
	if (!e) return {};
	let t = {};
	function n(e, n) {
		e.startsWith("-moz-") || e.startsWith("-webkit-") || e.startsWith("-ms-") || e.startsWith("-o-") ? t[_o(e)] = n : e.startsWith("--") ? t[e] = n : t[vo(e)] = n;
	}
	return fo(e, n), t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
function So(...e) {
	return (...t) => {
		for (let n of e) typeof n == "function" && n(...t);
	};
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function Co(e, t) {
	let n = RegExp(e, "g");
	return (e) => {
		if (typeof e != "string") throw TypeError(`expected an argument of type string, but got ${typeof e}`);
		return e.match(n) ? e.replace(n, t) : e;
	};
}
var wo = Co(/[A-Z]/, (e) => `-${e.toLowerCase()}`);
function To(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`expected an argument of type object, but got ${typeof e}`);
	return Object.keys(e).map((t) => `${wo(t)}: ${e[t]};`).join("\n");
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/style.js
function Eo(e = {}) {
	return To(e).replace("\n", " ");
}
var Do = new Set(/* @__PURE__ */ "onabort.onanimationcancel.onanimationend.onanimationiteration.onanimationstart.onauxclick.onbeforeinput.onbeforetoggle.onblur.oncancel.oncanplay.oncanplaythrough.onchange.onclick.onclose.oncompositionend.oncompositionstart.oncompositionupdate.oncontextlost.oncontextmenu.oncontextrestored.oncopy.oncuechange.oncut.ondblclick.ondrag.ondragend.ondragenter.ondragleave.ondragover.ondragstart.ondrop.ondurationchange.onemptied.onended.onerror.onfocus.onfocusin.onfocusout.onformdata.ongotpointercapture.oninput.oninvalid.onkeydown.onkeypress.onkeyup.onload.onloadeddata.onloadedmetadata.onloadstart.onlostpointercapture.onmousedown.onmouseenter.onmouseleave.onmousemove.onmouseout.onmouseover.onmouseup.onpaste.onpause.onplay.onplaying.onpointercancel.onpointerdown.onpointerenter.onpointerleave.onpointermove.onpointerout.onpointerover.onpointerup.onprogress.onratechange.onreset.onresize.onscroll.onscrollend.onsecuritypolicyviolation.onseeked.onseeking.onselect.onselectionchange.onselectstart.onslotchange.onstalled.onsubmit.onsuspend.ontimeupdate.ontoggle.ontouchcancel.ontouchend.ontouchmove.ontouchstart.ontransitioncancel.ontransitionend.ontransitionrun.ontransitionstart.onvolumechange.onwaiting.onwebkitanimationend.onwebkitanimationiteration.onwebkitanimationstart.onwebkittransitionend.onwheel".split("."));
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/merge-props.js
function Oo(e) {
	return Do.has(e);
}
function Z(...e) {
	let t = { ...e[0] };
	for (let n = 1; n < e.length; n++) {
		let r = e[n];
		if (r) {
			for (let e of Object.keys(r)) {
				let n = t[e], i = r[e], a = typeof n == "function", o = typeof i == "function";
				if (a && typeof o && Oo(e)) t[e] = Ja(n, i);
				else if (a && o) t[e] = So(n, i);
				else if (e === "class") {
					let r = Ha(n), a = Ha(i);
					r && a ? t[e] = Ei(n, i) : r ? t[e] = Ei(n) : a && (t[e] = Ei(i));
				} else if (e === "style") {
					let r = typeof n == "object", a = typeof i == "object", o = typeof n == "string", s = typeof i == "string";
					if (r && a) t[e] = {
						...n,
						...i
					};
					else if (r && s) {
						let r = xo(i);
						t[e] = {
							...n,
							...r
						};
					} else if (o && a) t[e] = {
						...xo(n),
						...i
					};
					else if (o && s) {
						let r = xo(n), a = xo(i);
						t[e] = {
							...r,
							...a
						};
					} else r ? t[e] = n : a ? t[e] = i : o ? t[e] = n : s && (t[e] = i);
				} else t[e] = i === void 0 ? n : i;
			}
			for (let e of Object.getOwnPropertySymbols(r)) {
				let n = t[e], i = r[e];
				t[e] = i === void 0 ? n : i;
			}
		}
	}
	return typeof t.style == "object" && (t.style = Eo(t.style).replaceAll("\n", " ")), t.hidden === !1 && (t.hidden = void 0, delete t.hidden), t.disabled === !1 && (t.disabled = void 0, delete t.disabled), t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/sr-only-styles.js
var ko = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
	transform: "translateX(-100%)"
}, Ao = Eo(ko), jo = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite-_3ce160b1f0bb5cb3cdaa2dbf5c0252ba/node_modules/runed/dist/internal/utils/dom.js
function Mo(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
new class {
	#e;
	#t;
	constructor(e = {}) {
		let { window: t = jo, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = Qr((e) => {
			let n = kr(t, "focusin", e), r = kr(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? Mo(this.#e) : null;
	}
}();
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite-_3ce160b1f0bb5cb3cdaa2dbf5c0252ba/node_modules/runed/dist/internal/utils/is.js
function No(e) {
	return typeof e == "function";
}
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite-_3ce160b1f0bb5cb3cdaa2dbf5c0252ba/node_modules/runed/dist/utilities/context/context.js
var Po = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e, this.#t = Symbol(e);
	}
	get key() {
		return this.#t;
	}
	exists() {
		return tt(this.#t);
	}
	get() {
		let e = $e(this.#t);
		if (e === void 0) throw Error(`Context "${this.#e}" not found`);
		return e;
	}
	getOr(e) {
		let t = $e(this.#t);
		return t === void 0 ? e : t;
	}
	set(e) {
		return et(this.#t, e);
	}
};
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite-_3ce160b1f0bb5cb3cdaa2dbf5c0252ba/node_modules/runed/dist/utilities/watch/watch.svelte.js
function Fo(e, t) {
	switch (e) {
		case "post":
			I(t);
			break;
		case "pre": An(t);
	}
}
function Io(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	Fo(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = V(() => n(t, o));
		return o = t, r;
	});
}
function Lo(e, t, n) {
	Io(e, "post", t, n);
}
function Ro(e, t, n) {
	Io(e, "pre", t, n);
}
Lo.pre = Ro;
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite-_3ce160b1f0bb5cb3cdaa2dbf5c0252ba/node_modules/runed/dist/internal/utils/get.js
function zo(e) {
	return No(e) ? e() : e;
}
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero-dev+vite-_3ce160b1f0bb5cb3cdaa2dbf5c0252ba/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var Bo = class {
	#e = {
		width: 0,
		height: 0
	};
	#t = !1;
	#n;
	#r;
	#i;
	#a = /* @__PURE__ */ k(() => (B(this.#s)?.(), this.getSize().width));
	#o = /* @__PURE__ */ k(() => (B(this.#s)?.(), this.getSize().height));
	#s = /* @__PURE__ */ k(() => {
		let e = zo(this.#r);
		if (e) return Qr((t) => {
			if (!this.#i) return;
			let n = new this.#i.ResizeObserver((e) => {
				this.#t = !0;
				for (let t of e) {
					let e = this.#n.box === "content-box" ? t.contentBoxSize : t.borderBoxSize, n = Array.isArray(e) ? e : [e];
					this.#e.width = n.reduce((e, t) => Math.max(e, t.inlineSize), 0), this.#e.height = n.reduce((e, t) => Math.max(e, t.blockSize), 0);
				}
				t();
			});
			return n.observe(e), () => {
				this.#t = !1, n.disconnect();
			};
		});
	});
	constructor(e, t = { box: "border-box" }) {
		this.#i = t.window ?? jo, this.#n = t, this.#r = e, this.#e = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		let e = zo(this.#r);
		if (!e || !this.#i) return;
		let t = e.offsetWidth, n = e.offsetHeight;
		if (this.#n.box === "border-box") return {
			width: t,
			height: n
		};
		let r = this.#i.getComputedStyle(e), i = parseFloat(r.paddingLeft) + parseFloat(r.paddingRight), a = parseFloat(r.paddingTop) + parseFloat(r.paddingBottom), o = parseFloat(r.borderLeftWidth) + parseFloat(r.borderRightWidth), s = parseFloat(r.borderTopWidth) + parseFloat(r.borderBottomWidth);
		return {
			width: t - i - o,
			height: n - a - s
		};
	}
	getSize() {
		return this.#t ? this.#e : this.calculateSize() ?? this.#e;
	}
	get current() {
		return B(this.#s)?.(), this.getSize();
	}
	get width() {
		return B(this.#a);
	}
	get height() {
		return B(this.#o);
	}
};
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/on-destroy-effect.svelte.js
function Vo(e) {
	I(() => () => {
		e();
	});
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function Ho(e) {
	br().then(e);
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/dom.js
var Uo = 1, Wo = 9, Go = 11;
function Ko(e) {
	return Ba(e) && e.nodeType === Uo && typeof e.nodeName == "string";
}
function qo(e) {
	return Ba(e) && e.nodeType === Wo;
}
function Jo(e) {
	return Ba(e) && e.constructor?.name === "VisualViewport";
}
function Yo(e) {
	return Ba(e) && e.nodeType !== void 0;
}
function Xo(e) {
	return Yo(e) && e.nodeType === Go && "host" in e;
}
function Zo(e, t) {
	if (!e || !t || !Ko(e) || !Ko(t)) return !1;
	let n = t.getRootNode?.();
	if (e === t || e.contains(t)) return !0;
	if (n && Xo(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function Qo(e) {
	return qo(e) ? e : Jo(e) ? e.document : e?.ownerDocument ?? document;
}
function $o(e) {
	return Xo(e) ? $o(e.host) : qo(e) ? e.defaultView ?? window : Ko(e) ? e.ownerDocument?.defaultView ?? window : window;
}
function es(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var ts = class {
	element;
	#e = /* @__PURE__ */ k(() => this.element.current ? this.element.current.getRootNode() ?? document : document);
	get root() {
		return B(this.#e);
	}
	set root(e) {
		M(this.#e, e);
	}
	constructor(e) {
		this.element = typeof e == "function" ? X(e) : e;
	}
	getDocument = () => Qo(this.root);
	getWindow = () => this.getDocument().defaultView ?? window;
	getActiveElement = () => es(this.root);
	isActiveElement = (e) => e === this.getActiveElement();
	getElementById(e) {
		return this.root.getElementById(e);
	}
	querySelector = (e) => this.root ? this.root.querySelector(e) : null;
	querySelectorAll = (e) => this.root ? this.root.querySelectorAll(e) : [];
	setTimeout = (e, t) => this.getWindow().setTimeout(e, t);
	clearTimeout = (e) => this.getWindow().clearTimeout(e);
};
// node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin-svelte@7.3.1_@voidzero_6230a9097f26de414be53786a08e0a8e/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
function ns(e, t) {
	return { [ui()]: (n) => Ga(e) ? (e.current = n, V(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e.current = null, t?.(null));
	}) : (e(n), V(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e(null), t?.(null));
	}) };
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/attrs.js
function rs(e) {
	return e ? "true" : "false";
}
function is(e) {
	return e ? "true" : void 0;
}
function Q(e) {
	return e ? "" : void 0;
}
function as(e) {
	return e ? "open" : "closed";
}
function os(e) {
	return e === "starting" ? { "data-starting-style": "" } : e === "ending" ? { "data-ending-style": "" } : {};
}
var ss = class {
	#e;
	#t;
	attrs;
	constructor(e) {
		this.#e = e.getVariant ? e.getVariant() : null, this.#t = this.#e ? `data-${this.#e}-` : `data-${e.component}-`, this.getAttr = this.getAttr.bind(this), this.selector = this.selector.bind(this), this.attrs = Object.fromEntries(e.parts.map((e) => [e, this.getAttr(e)]));
	}
	getAttr(e, t) {
		return t ? `data-${t}-${e}` : `${this.#t}${e}`;
	}
	selector(e, t) {
		return `[${this.getAttr(e, t)}]`;
	}
};
function cs(e) {
	let t = new ss(e);
	return {
		...t.attrs,
		selector: t.selector,
		getAttr: t.getAttr
	};
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/kbd-constants.js
var ls = "ArrowDown", us = "ArrowLeft", ds = "ArrowRight", fs = "ArrowUp", ps = "Enter", ms = typeof document < "u", hs = gs();
function gs() {
	return ms && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function _s(e) {
	return e instanceof HTMLElement;
}
function vs(e) {
	return e instanceof Element;
}
function ys(e) {
	return e instanceof Element || e instanceof SVGElement;
}
function bs(e) {
	return e === null;
}
function xs(e) {
	return e.pointerType === "touch";
}
function Ss(e) {
	return e !== null;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/animations-complete.js
var Cs = class {
	#e;
	#t = null;
	#n = null;
	#r = 0;
	constructor(e) {
		this.#e = e, Vo(() => this.#i());
	}
	#i() {
		this.#t !== null && (window.cancelAnimationFrame(this.#t), this.#t = null), this.#n?.disconnect(), this.#n = null, this.#r++;
	}
	run(e) {
		this.#i();
		let t = this.#r, n = () => {
			t === this.#r && this.#a(e);
		}, r = () => {
			if (t !== this.#r) return;
			let i = this.#e.ref.current;
			if (!i) return;
			if (typeof i.getAnimations != "function") {
				this.#a(e);
				return;
			}
			let a = i.getAnimations();
			a.length === 0 ? n() : Promise.all(a.map((e) => e.finished)).then(() => {
				n();
			}).catch(() => {
				t === this.#r && (i.getAnimations().some((e) => e.pending || e.playState !== "finished") ? r() : n());
			});
		}, i = () => {
			this.#t = window.requestAnimationFrame(() => {
				this.#t = null, r();
			});
		};
		this.#e.afterTick.current ? this.#t = window.requestAnimationFrame(() => {
			this.#t = null;
			let e = "data-starting-style", n = this.#e.ref.current;
			n && (n.hasAttribute(e) ? (this.#n = new MutationObserver(() => {
				t === this.#r && (n.hasAttribute(e) || (this.#n?.disconnect(), this.#n = null, i()));
			}), this.#n.observe(n, {
				attributes: !0,
				attributeFilter: [e]
			})) : i());
		}) : i();
	}
	#a(e) {
		let t = this.#r, n = () => {
			t === this.#r && e();
		};
		this.#e.afterTick.current ? Ho(n) : n();
	}
}, ws = class {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ j(!1);
	#i = /* @__PURE__ */ j(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, M(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new Cs({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), Vo(() => this.#s()), Lo(() => this.#e.open.current, (e) => {
			this.#a ? (this.#s(), !e && this.#e.shouldSkipExitAnimation?.() ? (M(this.#r, !1), M(this.#i, void 0), this.#e.onComplete?.()) : (e && M(this.#r, !0), M(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && M(this.#i, void 0);
			})), this.#t ? this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || M(this.#r, !1), M(this.#i, void 0), this.#e.onComplete?.());
			}) : (e || M(this.#r, !1), M(this.#i, void 0), this.#e.onComplete?.()))) : this.#a = !0;
		});
	}
	get shouldRender() {
		return B(this.#r);
	}
	get transitionStatus() {
		return B(this.#i);
	}
	#s() {
		this.#o !== null && (window.cancelAnimationFrame(this.#o), this.#o = null);
	}
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/noop.js
function $() {}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/create-id.js
function Ts(e, t) {
	return t === void 0 ? `bits-${e}` : `bits-${e}-${t}`;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
var Es = cs({
	component: "dialog",
	parts: [
		"content",
		"trigger",
		"overlay",
		"title",
		"description",
		"close",
		"cancel",
		"action"
	]
}), Ds = new Po("Dialog.Root | AlertDialog.Root"), Os = class e {
	static create(t) {
		let n = Ds.getOr(null);
		return Ds.set(new e(t, n));
	}
	opts;
	#e = /* @__PURE__ */ j(null);
	get triggerNode() {
		return B(this.#e);
	}
	set triggerNode(e) {
		M(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ j(null);
	get contentNode() {
		return B(this.#t);
	}
	set contentNode(e) {
		M(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ j(null);
	get overlayNode() {
		return B(this.#n);
	}
	set overlayNode(e) {
		M(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ j(null);
	get descriptionNode() {
		return B(this.#r);
	}
	set descriptionNode(e) {
		M(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ j(void 0);
	get contentId() {
		return B(this.#i);
	}
	set contentId(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(void 0);
	get titleId() {
		return B(this.#a);
	}
	set titleId(e) {
		M(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ j(void 0);
	get triggerId() {
		return B(this.#o);
	}
	set triggerId(e) {
		M(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ j(void 0);
	get descriptionId() {
		return B(this.#s);
	}
	set descriptionId(e) {
		M(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ j(null);
	get cancelNode() {
		return B(this.#c);
	}
	set cancelNode(e) {
		M(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ j(0);
	get nestedOpenCount() {
		return B(this.#l);
	}
	set nestedOpenCount(e) {
		M(this.#l, e, !0);
	}
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(e, t) {
		this.opts = e, this.parent = t, this.depth = t ? t.depth + 1 : 0, this.handleOpen = this.handleOpen.bind(this), this.handleClose = this.handleClose.bind(this), this.contentPresence = new ws({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			enabled: !0,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new ws({
			ref: X(() => this.overlayNode),
			open: this.opts.open,
			enabled: !0
		}), Lo(() => this.opts.open.current, (e) => {
			this.parent && (e ? this.parent.incrementNested() : this.parent.decrementNested());
		}, { lazy: !0 }), Vo(() => {
			this.opts.open.current && this.parent?.decrementNested();
		});
	}
	handleOpen() {
		this.opts.open.current || (this.opts.open.current = !0);
	}
	handleClose() {
		this.opts.open.current && (this.opts.open.current = !1);
	}
	getBitsAttr = (e) => Es.getAttr(e, this.opts.variant.current);
	incrementNested() {
		this.nestedOpenCount++, this.parent?.incrementNested();
	}
	decrementNested() {
		this.nestedOpenCount !== 0 && (this.nestedOpenCount--, this.parent?.decrementNested());
	}
	#u = /* @__PURE__ */ k(() => ({ "data-state": as(this.opts.open.current) }));
	get sharedProps() {
		return B(this.#u);
	}
	set sharedProps(e) {
		M(this.#u, e);
	}
}, ks = class e {
	static create(t) {
		return new e(t, Ds.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.titleId = this.opts.id.current, this.attachment = ns(this.opts.ref), Lo.pre(() => this.opts.id.current, (e) => {
			this.root.titleId = e;
		});
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, As = class e {
	static create(t) {
		return new e(t, Ds.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.descriptionId = this.opts.id.current, this.attachment = ns(this.opts.ref, (e) => {
			this.root.descriptionNode = e;
		}), Lo.pre(() => this.opts.id.current, (e) => {
			this.root.descriptionId = e;
		});
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, js = class e {
	static create(t) {
		return new e(t, Ds.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref, (e) => {
			this.root.contentNode = e, this.root.contentId = e?.id;
		});
	}
	#e = /* @__PURE__ */ k(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return B(this.#e);
	}
	set snippetProps(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
		"aria-modal": "true",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[this.root.getBitsAttr("content")]: "",
		style: {
			pointerEvents: "auto",
			outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0,
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount,
			contain: "layout style"
		},
		tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
		"data-nested-open": Q(this.root.nestedOpenCount > 0),
		"data-nested": Q(this.root.parent !== null),
		...os(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
}, Ms = class e {
	static create(t) {
		return new e(t, Ds.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref, (e) => this.root.overlayNode = e);
	}
	#e = /* @__PURE__ */ k(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return B(this.#e);
	}
	set snippetProps(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": Q(this.root.nestedOpenCount > 0),
		"data-nested": Q(this.root.parent !== null),
		...os(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
}, Ns = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"level"
]), Ps = /* @__PURE__ */ H("<div><!></div>");
function Fs(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = Y(t, "level", 3, 2), o = /* @__PURE__ */ pa(t, Ns), s = ks.create({
		id: X(() => r()),
		level: X(() => a()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props));
	var l = U(), u = P(l), d = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(c) })), W(e, n);
	}, f = (e) => {
		var n = Ps();
		J(n, () => ({ ...B(c) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Is(e, t) {
	var n = U();
	fi(P(n), () => t.children, (e) => {
		var n = U();
		K(P(n), () => t.children ?? g), W(e, n);
	}), W(e, n);
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var Ls = new Po("BitsConfig");
function Rs() {
	let e = new zs(null, {});
	return Ls.getOr(e).opts;
}
var zs = class {
	opts;
	constructor(e, t) {
		let n = Bs(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function Bs(e, t) {
	return (n) => X(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function Vs(e, t) {
	return (n) => {
		let r = Rs();
		return X(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var Hs = Vs((e) => e.defaultLocale, "en"), Us = Vs((e) => e.defaultPortalTo, "body");
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Ws(e, t) {
	D(t, !0);
	let n = Us(() => t.to), r = nt(), i = /* @__PURE__ */ k(a);
	function a() {
		if (!ms || t.disabled) return null;
		let e = null;
		return e = typeof n.current == "string" ? document.querySelector(n.current) : n.current, e;
	}
	let o;
	function s() {
		o &&= (oi(o), null);
	}
	Lo([() => B(i), () => t.disabled], ([e, n]) => {
		if (!e || n) s();
		else return o = ni(Is, {
			target: e,
			props: { children: t.children },
			context: r
		}), () => {
			s();
		};
	});
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.children ?? g), W(e, n);
	};
	q(l, (e) => {
		t.disabled && e(u);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/events.js
var Gs = /* @__PURE__ */ new WeakMap();
function Ks(e, t = e.composedPath()) {
	Gs.set(e, t);
}
function qs(e) {
	return Gs.get(e) ?? e.composedPath();
}
function Js(e, t) {
	return t ? ys(e.target) && t.contains(e.target) || qs(e).includes(t) : !1;
}
function Ys(e, t) {
	for (let n of qs(e)) if (ys(n) && n.matches(t)) return n;
	return ys(e.target) ? e.target.closest(t) : null;
}
function Xs(e, t) {
	Ks(t, qs(e));
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/debounce.js
function Zs(e, t = 500) {
	let n = null, r = null, i = (...e) => {
		i.destroy(), r = e, n = setTimeout(i.flush, t);
	};
	return i.flush = () => {
		if (r === null) return;
		let t = r;
		i.destroy(), e(...t);
	}, i.destroy = () => {
		n !== null && (clearTimeout(n), n = null), r = null;
	}, i;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/elements.js
function Qs(e, t) {
	return e === t || e.contains(t);
}
function $s(e) {
	return e?.ownerDocument ?? document;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/dom.js
function ec(e, t) {
	let { clientX: n, clientY: r } = e, i = t.getBoundingClientRect();
	return n < i.left || n > i.right || r < i.top || r > i.bottom;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/menu/context-menu-attributes.js
var tc = "data-context-menu-trigger", nc = "data-context-menu-content";
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var rc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	#e;
	#t;
	#n = { pointerdown: !1 };
	#r = !1;
	#i = null;
	#a = !1;
	#o = void 0;
	#s;
	#c = $;
	#l = !1;
	constructor(e) {
		this.opts = e, this.#t = e.interactOutsideBehavior, this.#e = e.onInteractOutside, this.#s = e.onFocusOutside;
		let t = $, n = null, r = () => {
			n = null, this.#y(), globalThis.bitsDismissableLayers.delete(this), this.#m.destroy(), this.#c(), t();
		};
		Lo([() => this.opts.enabled.current, () => this.opts.ref.current], ([e, i]) => {
			let a = e ? i : null;
			n !== a && (r(), a && (n = a, this.#o = $s(a), globalThis.bitsDismissableLayers.set(this, this.#t), t = this.#d()));
		}), Vo(() => {
			this.#l = !0, r();
		});
	}
	#u = (e) => {
		e.defaultPrevented || this.#l || !this.opts.ref.current || Ho(() => {
			this.#l || this.opts.ref.current && !this.#v(e.target) && e.target && !this.#a && this.#s.current?.(e);
		});
	};
	#d() {
		let e = this.#o, t = (e) => {
			V(() => {
				this.#m.flush(), this.#h(e), this.#_(e);
			});
		}, n = (e) => {
			e.cancelBubble || e !== this.#i || (this.#g(e), e.pointerType === "touch" ? (this.#m.destroy(), this.#p(e)) : this.#m(e));
		};
		return e.addEventListener("pointerdown", t, !0), e.addEventListener("pointerdown", n), So(() => e.removeEventListener("pointerdown", t, !0), () => e.removeEventListener("pointerdown", n), kr(e, "focusin", this.#u));
	}
	#f = (e) => {
		let t = e;
		t.defaultPrevented && (t = sc(e)), this.#e.current(e);
	};
	#p = (e) => {
		if (!this.opts.ref.current) {
			this.#c();
			return;
		}
		let t = this.opts.isValidEvent.current(e, this.opts.ref.current) || oc(e, this.opts.ref.current);
		if (!this.#r || this.#b() || !t) {
			this.#c();
			return;
		}
		let n = e;
		if (n.defaultPrevented && (n = sc(n)), this.#t.current !== "close" && this.#t.current !== "defer-otherwise-close") this.#c();
		else if (e.pointerType === "touch") {
			this.#c();
			let e = null, t = $, n = (e) => {
				t(), this.#f(e);
			};
			t = So(kr(this.#o, "click", n, { once: !0 }), kr(this.#o, "click", (t) => {
				Ks(t), e = setTimeout(() => n(t), 0);
			}, {
				once: !0,
				capture: !0
			}), () => {
				e !== null && clearTimeout(e), e = null;
			}), this.#c = t;
		} else this.#e.current(n);
	};
	#m = Zs(this.#p, 10);
	#h = (e) => {
		this.#n[e.type] = !0;
	};
	#g = (e) => {
		this.#n[e.type] = !1;
	};
	#_ = (e) => {
		this.#i = e, Ks(e), this.opts.ref.current && (this.#r = ac(this.opts.ref.current));
	};
	#v = (e) => this.opts.ref.current ? Qs(this.opts.ref.current, e) : !1;
	#y = () => {
		for (let e in this.#n) this.#n[e] = !1;
		this.#r = !1, this.#i = null;
	};
	#b() {
		return Object.values(this.#n).some(Boolean);
	}
	#x = () => {
		this.#a = !0;
	};
	#S = () => {
		this.#a = !1;
	};
	props = {
		onfocuscapture: this.#x,
		onblurcapture: this.#S
	};
};
function ic(e = [...globalThis.bitsDismissableLayers]) {
	return e.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
}
function ac(e) {
	let t = [...globalThis.bitsDismissableLayers], n = ic(t);
	if (n) return n[0].opts.ref.current === e;
	let [r] = t[0];
	return r.opts.ref.current === e;
}
function oc(e, t) {
	let n = e.target;
	if (!ys(n)) return !1;
	let r = !!Ys(e, `[${tc}]`), i = !!t.closest(`[${nc}]`);
	return "button" in e && e.button > 0 && !r ? !1 : "button" in e && e.button === 0 && r && i ? !0 : r && i ? !1 : $s(n).documentElement.contains(n) && !Js(e, t) && ec(e, t);
}
function sc(e) {
	let t = e.currentTarget, n = e.target, r;
	r = e instanceof PointerEvent ? new PointerEvent(e.type, e) : new PointerEvent("pointerdown", e);
	let i = !1, a = new Proxy(r, { get: (r, a) => {
		if (a === "currentTarget") return t;
		if (a === "target") return n;
		if (a === "preventDefault") return () => {
			i = !0, typeof r.preventDefault == "function" && r.preventDefault();
		};
		if (a === "defaultPrevented") return i;
		if (a in r) {
			let e = r[a];
			return typeof e == "function" ? e.bind(r) : e;
		}
		let o = e[a];
		return typeof o == "function" ? o.bind(e) : o;
	} });
	return Xs(e, a), a;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function cc(e, t) {
	D(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "onInteractOutside", 3, $), i = Y(t, "onFocusOutside", 3, $), a = Y(t, "isValidEvent", 3, () => !1), o = rc.create({
		id: X(() => t.id),
		interactOutsideBehavior: X(() => n()),
		onInteractOutside: X(() => r()),
		enabled: X(() => t.enabled),
		onFocusOutside: X(() => i()),
		isValidEvent: X(() => a()),
		ref: V(() => t.ref)
	});
	var s = U();
	K(P(s), () => t.children ?? g, () => ({ props: o.props })), W(e, s), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var lc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	constructor(e) {
		this.opts = e, this.domContext = new ts(this.opts.ref);
		let t = $;
		Lo(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => kr(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
	#t = (e) => {
		if (e.key !== "Escape" || !uc(this)) return;
		let t = new KeyboardEvent(e.type, e);
		e.preventDefault();
		let n = this.opts.escapeKeydownBehavior.current;
		(n === "close" || n === "defer-otherwise-close") && this.opts.onEscapeKeydown.current(t);
	};
};
function uc(e) {
	let t = [...globalThis.bitsEscapeLayers], n = t.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
	if (n) return n[0] === e;
	let [r] = t[0];
	return r === e;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function dc(e, t) {
	D(t, !0);
	let n = Y(t, "escapeKeydownBehavior", 3, "close"), r = Y(t, "onEscapeKeydown", 3, $);
	lc.create({
		escapeKeydownBehavior: X(() => n()),
		onEscapeKeydown: X(() => r()),
		enabled: X(() => t.enabled),
		ref: V(() => t.ref)
	});
	var i = U();
	K(P(i), () => t.children ?? g), W(e, i), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var fc = class e {
	static instance;
	#e = qa([]);
	#t = /* @__PURE__ */ new WeakMap();
	#n = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		return this.instance ||= new e(), this.instance;
	}
	register(e) {
		let t = this.getActive();
		t && t !== e && t.pause();
		let n = es(document);
		n && n !== document.body && this.#n.set(e, n), this.#e.current = this.#e.current.filter((t) => t !== e), this.#e.current.unshift(e), e.resume();
	}
	unregister(e) {
		this.#e.current = this.#e.current.filter((t) => t !== e);
		let t = this.getActive();
		t && t.resume();
	}
	getActive() {
		return this.#e.current[0];
	}
	setFocusMemory(e, t) {
		this.#t.set(e, t);
	}
	getFocusMemory(e) {
		return this.#t.get(e);
	}
	isActiveScope(e) {
		return this.getActive() === e;
	}
	setPreFocusMemory(e, t) {
		this.#n.set(e, t);
	}
	getPreFocusMemory(e) {
		return this.#n.get(e);
	}
	clearPreFocusMemory(e) {
		this.#n.delete(e);
	}
}, pc = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"area[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
], mc = /* #__PURE__ */ pc.join(","), hc = typeof Element > "u", gc = hc ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, _c = !hc && Element.prototype.getRootNode ? function(e) {
	return e?.getRootNode?.call(e);
} : function(e) {
	return e?.ownerDocument;
}, vc = function(e, t) {
	t === void 0 && (t = !0);
	var n = e?.getAttribute?.call(e, "inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : vc(e.parentNode));
}, yc = function(e) {
	var t = e?.getAttribute?.call(e, "contenteditable");
	return t === "" || t === "true";
}, bc = function(e, t, n) {
	if (vc(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(mc));
	return t && gc.call(e, mc) && r.unshift(e), r = r.filter(n), r;
}, xc = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!vc(a, !1)) {
			if (a.tagName === "SLOT") {
				var o = a.assignedElements(), s = xc(o.length ? o : a.children, !0, n);
				n.flatten ? r.push.apply(r, s) : r.push({
					scopeParent: a,
					candidates: s
				});
			} else {
				gc.call(a, mc) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
				var c = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), l = !vc(c, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
				if (c && l) {
					var u = xc(c === !0 ? a.children : c.children, !0, n);
					n.flatten ? r.push.apply(r, u) : r.push({
						scopeParent: a,
						candidates: u
					});
				} else i.unshift.apply(i, a.children);
			}
		}
	}
	return r;
}, Sc = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, Cc = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || yc(e)) && !Sc(e) ? 0 : e.tabIndex;
}, wc = function(e, t) {
	var n = Cc(e);
	return n < 0 && t && !Sc(e) ? 0 : n;
}, Tc = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, Ec = function(e) {
	return e.tagName === "INPUT";
}, Dc = function(e) {
	return Ec(e) && e.type === "hidden";
}, Oc = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, kc = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, Ac = function(e) {
	if (!e.name) return !0;
	var t = e.form || _c(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = kc(r, e.form);
	return !i || i === e;
}, jc = function(e) {
	return Ec(e) && e.type === "radio";
}, Mc = function(e) {
	return jc(e) && !Ac(e);
}, Nc = function(e) {
	var t = e && _c(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = _c(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, Pc = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, Fc = function(e, t) {
	var n = t.displayCheck, r = t.getShadowRoot;
	if (n === "full-native" && "checkVisibility" in e) return !e.checkVisibility({
		checkOpacity: !1,
		opacityProperty: !1,
		contentVisibilityAuto: !0,
		visibilityProperty: !0,
		checkVisibilityCSS: !0
	});
	var i = getComputedStyle(e).visibility;
	if (i === "hidden" || i === "collapse") return !0;
	var a = gc.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (gc.call(a, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var o = e; e;) {
				var s = e.parentElement, c = _c(e);
				if (s && !s.shadowRoot && r(s) === !0) return Pc(e);
				e = e.assignedSlot ? e.assignedSlot : !s && c !== e.ownerDocument ? c.host : s;
			}
			e = o;
		}
		if (Nc(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return Pc(e);
	return !1;
}, Ic = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return gc.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, Lc = function(e, t) {
	return !(t.disabled || Dc(t) || Fc(t, e) || Oc(t) || Ic(t));
}, Rc = function(e, t) {
	return !(Mc(t) || Cc(t) < 0 || !Lc(e, t));
}, zc = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, Bc = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = wc(a, i), s = i ? Bc(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(Tc).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, Vc = function(e, t) {
	return t ||= {}, Bc(t.getShadowRoot ? xc([e], t.includeContainer, {
		filter: Rc.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: zc
	}) : bc(e, t.includeContainer, Rc.bind(null, t)));
}, Hc = function(e, t) {
	return t ||= {}, t.getShadowRoot ? xc([e], t.includeContainer, {
		filter: Lc.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : bc(e, t.includeContainer, Lc.bind(null, t));
}, Uc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return gc.call(e, mc) !== !1 && Rc(t, e);
}, Wc = /* #__PURE__ */ pc.concat("iframe:not([inert]):not([inert] *)").join(","), Gc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return gc.call(e, Wc) !== !1 && Lc(t, e);
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte.js
function Kc(e, t) {
	let n = t.getRootNode();
	for (; e;) {
		let t = e.getRootNode();
		if (t === n) return e;
		e = t !== e && "host" in t ? t.host : null;
	}
	return null;
}
var qc = class e {
	#e = !1;
	#t = null;
	#n = fc.getInstance();
	#r = [];
	#i;
	constructor(e) {
		this.#i = e;
	}
	get paused() {
		return this.#e;
	}
	pause() {
		this.#e = !0;
	}
	resume() {
		this.#e = !1;
	}
	#a() {
		for (let e of this.#r) e();
		this.#r = [];
	}
	mount(e) {
		this.#t !== e && (this.#t && this.unmount(), this.#t = e, this.#n.register(this), this.#c(), this.#o());
	}
	unmount() {
		this.#t &&= (this.#a(), this.#s(), this.#n.unregister(this), this.#n.clearPreFocusMemory(this), null);
	}
	#o() {
		if (!this.#t) return;
		let e = new CustomEvent("focusScope.onOpenAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		this.#i.onOpenAutoFocus.current(e), e.defaultPrevented || requestAnimationFrame(() => {
			if (!this.#t || this.#e || !this.#n.isActiveScope(this) || this.#t.contains(Kc(es(this.#t.ownerDocument), this.#t))) return;
			let e = this.#u();
			e ? (e.focus({ preventScroll: !0 }), this.#n.setFocusMemory(this, e)) : this.#t.focus({ preventScroll: !0 });
		});
	}
	#s() {
		let e = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		if (this.#i.onCloseAutoFocus.current?.(e), !e.defaultPrevented) {
			let e = this.#n.getPreFocusMemory(this);
			if (e && e.isConnected) try {
				e.focus({ preventScroll: !0 });
			} catch {
				document.body.focus();
			}
		}
	}
	#c() {
		if (!this.#t || !this.#i.trap.current) return;
		let e = this.#t, t = e.ownerDocument;
		this.#r.push(kr(t, "focusin", (t) => {
			if (this.#e || !this.#n.isActiveScope(this)) return;
			let n = Kc(t.composedPath()[0], e);
			if (n !== null && e.contains(n)) this.#n.setFocusMemory(this, n);
			else {
				let n = this.#n.getFocusMemory(this);
				if (n && e.contains(n) && Gc(n)) t.preventDefault(), n.focus({ preventScroll: !0 });
				else {
					let t = this.#u(), n = this.#d()[0];
					(t || n || e).focus({ preventScroll: !0 });
				}
			}
		}, { capture: !0 }), kr(e, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let n = this.#l();
			if (n.length === 0) return;
			let r = n[0], i = n[n.length - 1];
			!e.shiftKey && es(t) === i ? (e.preventDefault(), r.focus()) : e.shiftKey && es(t) === r && (e.preventDefault(), i.focus());
		}));
		let n = new MutationObserver(() => {
			let t = this.#n.getFocusMemory(this);
			if (t && !e.contains(t)) {
				let t = this.#u(), n = this.#d()[0], r = t || n;
				r ? (r.focus({ preventScroll: !0 }), this.#n.setFocusMemory(this, r)) : e.focus({ preventScroll: !0 });
			}
		});
		n.observe(e, {
			childList: !0,
			subtree: !0
		}), this.#r.push(() => n.disconnect());
	}
	#l() {
		return this.#t ? Vc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	#u() {
		return this.#l()[0] || null;
	}
	#d() {
		return this.#t ? Hc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	static use(t) {
		let n = null;
		return Lo([() => t.ref.current, () => t.enabled.current], ([r, i]) => {
			r && i ? (n ||= new e(t), n.mount(r)) : n &&= (n.unmount(), null);
		}), Vo(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function Jc(e, t) {
	D(t, !0);
	let n = Y(t, "enabled", 3, !1), r = Y(t, "trapFocus", 3, !1), i = Y(t, "loop", 3, !1), a = Y(t, "onCloseAutoFocus", 3, $), o = Y(t, "onOpenAutoFocus", 3, $), s = qc.use({
		enabled: X(() => n()),
		trap: X(() => r()),
		loop: V(() => i()),
		onCloseAutoFocus: X(() => a()),
		onOpenAutoFocus: X(() => o()),
		ref: V(() => t.ref)
	});
	var c = U();
	K(P(c), () => t.focusScope ?? g, () => ({ props: s.props })), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var Yc = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var Xc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	#e = $;
	#t = !1;
	#n = Yc;
	#r = Yc;
	constructor(e) {
		this.opts = e, this.domContext = new ts(e.ref);
		let t = $;
		Lo(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([e, n, r]) => (this.#t = e, this.#n = n, this.#r = r, e && (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled), t(), t = this.#i()), () => {
			this.#t = !1, t(), this.#s(), globalThis.bitsTextSelectionLayers.delete(this);
		}));
	}
	#i() {
		return So(kr(this.domContext.getDocument(), "pointerdown", this.#o), kr(this.domContext.getDocument(), "pointerup", this.#a));
	}
	#a = (e) => {
		this.#s(), e.defaultPrevented || this.#r(e);
	};
	#o = (e) => {
		if (!this.#t) return;
		this.#s();
		let t = this.opts.ref.current, n = e.target;
		_s(t) && _s(n) && el(this) && Zo(t, n) && (this.#n(e), e.defaultPrevented || (this.#e = Qc(t, this.domContext.getDocument().body)));
	};
	#s = () => {
		this.#e(), this.#e = $;
	};
}, Zc = (e) => e.style.userSelect || e.style.webkitUserSelect;
function Qc(e, t) {
	let n = Zc(t), r = Zc(e);
	return $c(t, "none"), $c(e, "text"), () => {
		$c(t, n), $c(e, r);
	};
}
function $c(e, t) {
	e.style.userSelect = t, e.style.webkitUserSelect = t;
}
function el(e) {
	let t = [...globalThis.bitsTextSelectionLayers];
	if (!t.length) return !1;
	let n = t.at(-1);
	return n ? n[0] === e : !1;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function tl(e, t) {
	D(t, !0);
	let n = Y(t, "preventOverflowTextSelection", 3, !0), r = Y(t, "onPointerDown", 3, $), i = Y(t, "onPointerUp", 3, $);
	Xc.create({
		id: X(() => t.id),
		onPointerDown: X(() => r()),
		onPointerUp: X(() => i()),
		enabled: X(() => t.enabled && n()),
		ref: V(() => t.ref)
	});
	var a = U();
	K(P(a), () => t.children ?? g), W(e, a), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
function nl(e = "bits") {
	return globalThis.bitsIdCounter.current++, `${e}-${globalThis.bitsIdCounter.current}`;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var rl = class {
	#e;
	#t = 0;
	#n = /* @__PURE__ */ j();
	#r;
	constructor(e) {
		this.#e = e;
	}
	#i() {
		--this.#t, this.#r && this.#t <= 0 && (this.#r(), M(this.#n, void 0), this.#r = void 0);
	}
	get(...e) {
		return this.#t += 1, B(this.#n) === void 0 && (this.#r = jn(() => {
			M(this.#n, this.#e(...e), !0);
		})), I(() => () => {
			this.#i();
		}), B(this.#n);
	}
}, il = new Ma(), al = [
	"padding-right",
	"margin-right",
	"overflow",
	"overflow-x",
	"overflow-y",
	"pointer-events",
	"--scrollbar-width"
], ol = null, sl = !1, cl = /* @__PURE__ */ new Set(), ll = null, ul = null, dl = !1;
function fl(e, t, n) {
	e.setProperty(t, n), cl.add(t), t === "overflow" && (cl.add("overflow-x"), cl.add("overflow-y"));
}
var pl = X(() => {
	for (let e of il.values()) if (e) return !0;
	return !1;
}), ml = null, hl = new rl(() => {
	function e(e, t) {
		let n = ol?.get(t);
		n?.value ? e.body.style.setProperty(t, n.value, n.priority) : e.body.style.removeProperty(t);
	}
	function t(t) {
		for (let n of al) cl.has(n) && e(t, n);
		!sl && t.body.style.length === 0 && t.body.removeAttribute("style"), ol = null, cl.clear(), hs && ll?.();
	}
	function n(t) {
		cl.delete("pointer-events") && e(t, "pointer-events");
	}
	function r() {
		ul !== null && (window.clearTimeout(ul), ul = null);
	}
	function i(e, t) {
		r(), dl = !0, ml = Date.now();
		let n = ml, i = () => {
			ul = null, ml === n && (_l(il) ? dl = !1 : (dl = !1, t()));
		}, a = e === null ? 24 : e;
		ul = window.setTimeout(i, a);
	}
	function a() {
		if (ol === null && il.size === 0 && !dl) {
			sl = document.body.hasAttribute("style"), ol = /* @__PURE__ */ new Map();
			for (let e of al) ol.set(e, {
				value: document.body.style.getPropertyValue(e),
				priority: document.body.style.getPropertyPriority(e)
			});
		}
	}
	return Lo(() => pl.current, () => {
		if (!pl.current) return;
		a(), dl = !1;
		let e = getComputedStyle(document.documentElement), t = getComputedStyle(document.body), n = e.scrollbarGutter?.includes("stable") || t.scrollbarGutter?.includes("stable"), r = window.innerWidth - document.documentElement.clientWidth, i = {
			padding: Number.parseInt(t.paddingRight ?? "0", 10) + r,
			margin: Number.parseInt(t.marginRight ?? "0", 10)
		};
		r > 0 && !n && (fl(document.body.style, "padding-right", `${i.padding}px`), fl(document.body.style, "margin-right", `${i.margin}px`), fl(document.body.style, "--scrollbar-width", `${r}px`)), fl(document.body.style, "overflow", "hidden"), hs && (ll = kr(document, "touchmove", (e) => {
			e.target === document.documentElement && (e.touches.length > 1 || e.preventDefault());
		}, { passive: !1 })), Ho(() => {
			fl(document.body.style, "pointer-events", "none"), fl(document.body.style, "overflow", "hidden");
		});
	}), Vo(() => () => {
		ll?.();
	}), {
		get lockMap() {
			return il;
		},
		resetBodyStyle: t,
		restorePointerEvents: n,
		scheduleCleanupIfNoNewLocks: i,
		cancelPendingCleanup: r,
		ensureInitialStyleCaptured: a
	};
}), gl = class {
	#e = nl();
	#t;
	#n = () => null;
	#r;
	locked;
	constructor(e, t = () => null) {
		this.#t = e, this.#n = t, this.#r = hl.get(), this.#r && (this.#r.cancelPendingCleanup(), this.#r.ensureInitialStyleCaptured(), this.#r.lockMap.set(this.#e, this.#t ?? !1), this.locked = X(() => this.#r.lockMap.get(this.#e) ?? !1, (e) => this.#r.lockMap.set(this.#e, e)), Vo(() => {
			if (this.#r.lockMap.delete(this.#e), _l(this.#r.lockMap)) return;
			let e = this.#n(), t = document;
			this.#r.restorePointerEvents(t), this.#r.scheduleCleanupIfNoNewLocks(e, () => {
				this.#r.resetBodyStyle(t);
			});
		}));
	}
};
function _l(e) {
	for (let [t, n] of e) if (n) return !0;
	return !1;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function vl(e, t) {
	D(t, !0);
	let n = Y(t, "preventScroll", 3, !0), r = Y(t, "restoreScrollDelay", 3, null);
	V(() => {
		n() && new gl(n(), () => r());
	}), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
var yl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"forceMount",
	"child",
	"children",
	"ref"
]), bl = /* @__PURE__ */ H("<div><!></div>");
function xl(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "forceMount", 3, !1), a = Y(t, "ref", 15, null), o = /* @__PURE__ */ pa(t, yl), s = Ms.create({
		id: X(() => r()),
		ref: X(() => a(), (e) => a(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props));
	var l = U(), u = P(l), d = (e) => {
		var n = U(), r = P(n), i = (e) => {
			var n = U(), r = P(n);
			{
				let e = /* @__PURE__ */ k(() => ({
					props: Z(B(c)),
					...s.snippetProps
				}));
				K(r, () => t.child, () => B(e));
			}
			W(e, n);
		}, a = (e) => {
			var n = bl();
			J(n, (e) => ({ ...e }), [() => Z(B(c))]), K(N(n), () => t.children ?? g, () => s.snippetProps), E(n), W(e, n);
		};
		q(r, (e) => {
			t.child ? e(i) : e(a, -1);
		}), W(e, n);
	};
	q(u, (e) => {
		(s.shouldRender || i()) && e(d);
	}), W(e, l), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
var Sl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref"
]), Cl = /* @__PURE__ */ H("<div><!></div>");
function wl(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ pa(t, Sl), o = As.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = Cl();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/utils.mjs
function Tl(e, t) {
	return e - t * Math.floor(e / t);
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/calendars/GregorianCalendar.mjs
var El = 1721426;
function Dl(e, t, n, r) {
	t = kl(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Ol(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Ol(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function kl(e, t) {
	return e === "BC" ? 1 - t : t;
}
function Al(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var jl = {
	standard: [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	],
	leapyear: [
		31,
		29,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	]
}, Ml = class {
	fromJulianDay(e) {
		let t = e, n = t - El, r = Math.floor(n / 146097), i = Tl(n, 146097), a = Math.floor(i / 36524), o = Tl(i, 36524), s = Math.floor(o / 1461), c = Tl(o, 1461), l = Math.floor(c / 365), [u, d] = Al(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - Dl(u, d, 1, 1), p = 2;
		t < Dl(u, d, 3, 1) ? p = 0 : Ol(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new ed(u, d, m, t - Dl(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return Dl(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return jl[Ol(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Ol(e.year) ? 366 : 365;
	}
	getMaximumMonthsInYear() {
		return 12;
	}
	getMaximumDaysInMonth() {
		return 31;
	}
	getYearsInEra(e) {
		return 9999;
	}
	getEras() {
		return ["BC", "AD"];
	}
	isInverseEra(e) {
		return e.era === "BC";
	}
	balanceDate(e) {
		e.year <= 0 && (e.era = e.era === "BC" ? "AD" : "BC", e.year = 1 - e.year);
	}
	constructor() {
		this.identifier = "gregory";
	}
}, Nl = {
	"001": 1,
	AD: 1,
	AE: 6,
	AF: 6,
	AI: 1,
	AL: 1,
	AM: 1,
	AN: 1,
	AR: 1,
	AT: 1,
	AU: 1,
	AX: 1,
	AZ: 1,
	BA: 1,
	BE: 1,
	BG: 1,
	BH: 6,
	BM: 1,
	BN: 1,
	BY: 1,
	CH: 1,
	CL: 1,
	CM: 1,
	CN: 1,
	CR: 1,
	CY: 1,
	CZ: 1,
	DE: 1,
	DJ: 6,
	DK: 1,
	DZ: 6,
	EC: 1,
	EE: 1,
	EG: 6,
	ES: 1,
	FI: 1,
	FJ: 1,
	FO: 1,
	FR: 1,
	GB: 1,
	GE: 1,
	GF: 1,
	GP: 1,
	GR: 1,
	HR: 1,
	HU: 1,
	IE: 1,
	IQ: 6,
	IR: 6,
	IS: 1,
	IT: 1,
	JO: 6,
	KG: 1,
	KW: 6,
	KZ: 1,
	LB: 1,
	LI: 1,
	LK: 1,
	LT: 1,
	LU: 1,
	LV: 1,
	LY: 6,
	MC: 1,
	MD: 1,
	ME: 1,
	MK: 1,
	MN: 1,
	MQ: 1,
	MV: 5,
	MY: 1,
	NL: 1,
	NO: 1,
	NZ: 1,
	OM: 6,
	PL: 1,
	QA: 6,
	RE: 1,
	RO: 1,
	RS: 1,
	RU: 1,
	SD: 6,
	SE: 1,
	SI: 1,
	SK: 1,
	SM: 1,
	SY: 6,
	TJ: 1,
	TM: 1,
	TR: 1,
	UA: 1,
	UY: 1,
	UZ: 1,
	VA: 1,
	VN: 1,
	XK: 1
};
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/queries.mjs
function Pl(e, t) {
	return t = mu(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function Fl(e, t) {
	return t = mu(t, e.calendar), e = Jl(e), t = Jl(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function Il(e, t) {
	return e.isEqual?.(t) ?? t.isEqual?.(e) ?? e.identifier === t.identifier;
}
var Ll = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function Rl(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? Ll[n] : $l(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function zl(e) {
	return du(Date.now(), e);
}
function Bl(e) {
	return fu(zl(e));
}
function Vl(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function Hl(e, t) {
	return Ul(e) - Ul(t);
}
function Ul(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var Wl = null, Gl = !1;
function Kl() {
	return Wl ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, Wl;
}
function ql() {
	return Gl;
}
function Jl(e) {
	return e.subtract({ days: e.day - 1 });
}
function Yl(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var Xl = /* @__PURE__ */ new Map(), Zl = /* @__PURE__ */ new Map();
function Ql(e) {
	if (Intl.Locale) {
		let t = Xl.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && Xl.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function $l(e) {
	let t = Zl.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return Zl.set(e, t), t.firstDay;
		}
		let n = Ql(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && Nl[n] || 0 };
		Zl.set(e, t);
	}
	return t.firstDay;
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/conversion.mjs
function eu(e) {
	return e = mu(e, new Ml()), tu(kl(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function tu(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function nu(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === Kl() && !ql()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = iu(e, t);
	return tu(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var ru = /* @__PURE__ */ new Map();
function iu(e, t) {
	let n = ru.get(t);
	n || (n = new Intl.DateTimeFormat("en-US", {
		timeZone: t,
		hour12: !1,
		era: "short",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric"
	}), ru.set(t, n));
	let r = n.formatToParts(new Date(e)), i = {};
	for (let e of r) e.type !== "literal" && (i[e.type] = e.value);
	return {
		year: i.era === "BC" || i.era === "B" ? -i.year + 1 : +i.year,
		month: +i.month,
		day: +i.day,
		hour: i.hour === "24" ? 0 : +i.hour,
		minute: +i.minute,
		second: +i.second
	};
}
var au = 864e5;
function ou(e, t) {
	let n = eu(e);
	return su(e, t, n - nu(n - au, t), n - nu(n + au, t));
}
function su(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => cu(e, t, n));
}
function cu(e, t, n) {
	let r = iu(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function lu(e, t, n = "compatible") {
	let r = pu(e);
	if (t === "UTC") return eu(r);
	if (t === Kl() && n === "compatible" && !ql()) {
		r = mu(r, new Ml());
		let e = /* @__PURE__ */ new Date(), t = kl(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = eu(r), a = nu(i - au, t), o = nu(i + au, t), s = su(r, t, i - a, i - o);
	if (s.length === 1) return s[0];
	if (s.length > 1) switch (n) {
		case "compatible":
		case "earlier": return s[0];
		case "later": return s[s.length - 1];
		case "reject": throw RangeError("Multiple possible absolute times found");
	}
	switch (n) {
		case "earlier": return Math.min(i - a, i - o);
		case "compatible":
		case "later": return Math.max(i - a, i - o);
		case "reject": throw RangeError("No such absolute time found");
	}
}
function uu(e, t, n = "compatible") {
	return new Date(lu(e, t, n));
}
function du(e, t) {
	let n = nu(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new nd(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function fu(e) {
	return new ed(e.calendar, e.era, e.year, e.month, e.day);
}
function pu(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new td(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function mu(e, t) {
	if (Il(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, wu(r), r;
}
function hu(e, t, n) {
	return e instanceof nd ? e.timeZone === t ? e : _u(e, t) : du(lu(e, t, n), t);
}
function gu(e) {
	let t = eu(e) - e.offset;
	return new Date(t);
}
function _u(e, t) {
	return mu(du(eu(e) - e.offset, t), e.calendar);
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/manipulation.mjs
var vu = 36e5;
function yu(e, t) {
	let n = e.copy(), r = "hour" in n ? Mu(n, t) : 0;
	bu(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, xu(n), Cu(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, Su(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
	let i = n.calendar.getYearsInEra(n);
	if (n.year > i) {
		let e = n.calendar.isInverseEra?.(n);
		n.year = i, n.month = e ? 1 : n.calendar.getMonthsInYear(n), n.day = e ? 1 : n.calendar.getDaysInMonth(n);
	}
	n.month < 1 && (n.month = 1, n.day = 1);
	let a = n.calendar.getMonthsInYear(n);
	return n.month > a && (n.month = a, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function bu(e, t) {
	e.calendar.isInverseEra?.(e) && (t = -t), e.year += t;
}
function xu(e) {
	for (; e.month < 1;) bu(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, bu(e, 1);
}
function Su(e) {
	for (; e.day < 1;) e.month--, xu(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, xu(e);
}
function Cu(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function wu(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), Cu(e);
}
function Tu(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function Eu(e, t) {
	return yu(e, Tu(t));
}
function Du(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), wu(n), n;
}
function Ou(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Au(n), n;
}
function ku(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = ju(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = ju(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = ju(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = ju(e.hour, 24), t;
}
function Au(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 999)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function ju(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function Mu(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, ku(e);
}
function Nu(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = Fu(a, n, 0, t.length - 1, r?.round), i.era = t[a], wu(i);
			break;
		}
		case "year":
			i.calendar.isInverseEra?.(i) && (n = -n), i.year = Fu(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = Fu(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = Fu(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), wu(i), i;
}
function Pu(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = Fu(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = Fu(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = Fu(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = Fu(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function Fu(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function Iu(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? lu(yu(pu(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : eu(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, mu(du(n, e.timeZone), e.calendar);
}
function Lu(e, t) {
	return Iu(e, Tu(t));
}
function Ru(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = pu(e), o = mu(Ou(a, { hour: t }), new Ml()), s = [lu(o, e.timeZone, "earlier"), lu(o, e.timeZone, "later")].filter((t) => du(t, e.timeZone).day === o.day)[0], c = mu(Ou(a, { hour: i }), new Ml()), l = [lu(c, e.timeZone, "earlier"), lu(c, e.timeZone, "later")].filter((t) => du(t, e.timeZone).day === c.day).pop(), u = eu(e) - e.offset, d = Math.floor(u / vu), f = u % vu;
			return u = Fu(d, n, Math.floor(s / vu), Math.floor(l / vu), r?.round) * vu + f, mu(du(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return Pu(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return mu(du(lu(Nu(pu(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function zu(e, t, n) {
	let r = pu(e), i = Ou(Du(r, t), t);
	return i.compare(r) === 0 ? e : mu(du(lu(i, e.timeZone, n), e.timeZone), e.calendar);
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/string.mjs
var Bu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, Vu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Hu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, Uu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function Wu(e) {
	let t = e.match(Bu);
	if (!t) throw Uu.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new ed(qu(t[1], 0, 9999), qu(t[2], 1, 12), 1);
	return n.day = qu(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Gu(e) {
	let t = e.match(Vu);
	if (!t) throw Uu.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = qu(t[1], -9999, 9999), r = new td(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, qu(t[2], 1, 12), 1, t[4] ? qu(t[4], 0, 23) : 0, t[5] ? qu(t[5], 0, 59) : 0, t[6] ? qu(t[6], 0, 59) : 0, t[7] ? qu(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = qu(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function Ku(e, t) {
	let n = e.match(Hu);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = qu(n[1], -9999, 9999), i = new nd(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, qu(n[2], 1, 12), 1, n[11], 0, n[4] ? qu(n[4], 0, 23) : 0, n[5] ? qu(n[5], 0, 59) : 0, n[6] ? qu(n[6], 0, 59) : 0, n[7] ? qu(n[7], 0, Infinity) * 1e3 : 0);
	i.day = qu(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = pu(i), o;
	if (n[8]) {
		let e = qu(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + qu(n[9] ?? "0", 0, 59) * 6e4 + qu(n[10] ?? "0", 0, 59) * 1e3), o = eu(i) - i.offset, !ou(a, i.timeZone).includes(o)) throw Error(`Offset ${Zu(i.offset)} is invalid for ${Xu(i)} in ${i.timeZone}`);
	} else o = lu(pu(a), i.timeZone, t);
	return du(o, i.timeZone);
}
function qu(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function Ju(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function Yu(e) {
	let t = mu(e, new Ml()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function Xu(e) {
	return `${Yu(e)}T${Ju(e)}`;
}
function Zu(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function Qu(e) {
	return `${Xu(e)}${Zu(e.offset)}[${e.timeZone}]`;
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/CalendarDate.mjs
function $u(e) {
	let t = typeof e[0] == "object" ? e.shift() : new Ml(), n;
	if (typeof e[0] == "string") n = e.shift();
	else {
		let e = t.getEras();
		n = e[e.length - 1];
	}
	let r = e.shift(), i = e.shift(), a = e.shift();
	return [
		t,
		n,
		r,
		i,
		a
	];
}
var ed = class e {
	constructor(...e) {
		let [t, n, r, i, a] = $u(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, wu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return yu(this, e);
	}
	subtract(e) {
		return Eu(this, e);
	}
	set(e) {
		return Du(this, e);
	}
	cycle(e, t, n) {
		return Nu(this, e, t, n);
	}
	toDate(e) {
		return uu(this, e);
	}
	toString() {
		return Yu(this);
	}
	compare(e) {
		return Vl(this, e);
	}
}, td = class e {
	constructor(...e) {
		let [t, n, r, i, a] = $u(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, wu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return yu(this, e);
	}
	subtract(e) {
		return Eu(this, e);
	}
	set(e) {
		return Du(Ou(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return Nu(this, e, t, n);
			default: return Pu(this, e, t, n);
		}
	}
	toDate(e, t) {
		return uu(this, e, t);
	}
	toString() {
		return Xu(this);
	}
	compare(e) {
		let t = Vl(this, e);
		return t === 0 ? Hl(this, pu(e)) : t;
	}
}, nd = class e {
	constructor(...e) {
		let [t, n, r, i, a] = $u(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, wu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Iu(this, e);
	}
	subtract(e) {
		return Lu(this, e);
	}
	set(e, t) {
		return zu(this, e, t);
	}
	cycle(e, t, n) {
		return Ru(this, e, t, n);
	}
	toDate() {
		return gu(this);
	}
	toString() {
		return Qu(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - hu(e, this.timeZone).toDate().getTime();
	}
}, rd = /* @__PURE__ */ new Map(), id = class {
	constructor(e, t = {}) {
		this.formatter = od(e, t), this.options = t;
	}
	format(e) {
		return this.formatter.format(e);
	}
	formatToParts(e) {
		return this.formatter.formatToParts(e);
	}
	formatRange(e, t) {
		if (typeof this.formatter.formatRange == "function") return this.formatter.formatRange(e, t);
		if (t < e) throw RangeError("End date must be >= start date");
		return `${this.formatter.format(e)} \u{2013} ${this.formatter.format(t)}`;
	}
	formatRangeToParts(e, t) {
		if (typeof this.formatter.formatRangeToParts == "function") return this.formatter.formatRangeToParts(e, t);
		if (t < e) throw RangeError("End date must be >= start date");
		let n = this.formatter.formatToParts(e), r = this.formatter.formatToParts(t);
		return [
			...n.map((e) => ({
				...e,
				source: "startRange"
			})),
			{
				type: "literal",
				value: " – ",
				source: "shared"
			},
			...r.map((e) => ({
				...e,
				source: "endRange"
			}))
		];
	}
	resolvedOptions() {
		let e = this.formatter.resolvedOptions();
		return ud() && (this.resolvedHourCycle ||= dd(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
}, ad = {
	true: { ja: "h11" },
	false: {}
};
function od(e, t = {}) {
	if (typeof t.hour12 == "boolean" && cd()) {
		t = { ...t };
		let n = ad[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (rd.has(n)) return rd.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return rd.set(n, r), r;
}
var sd = null;
function cd() {
	return sd ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", sd;
}
var ld = null;
function ud() {
	return ld ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", ld;
}
function dd(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = od(e, {
		...t,
		timeZone: void 0
	}), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((e) => e.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((e) => e.type === "hour").value, 10);
	if (r === 0 && i === 23) return "h23";
	if (r === 24 && i === 23) return "h24";
	if (r === 0 && i === 11) return "h11";
	if (r === 12 && i === 11) return "h12";
	throw Error("Unexpected hour cycle result");
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/announcer.js
function fd(e) {
	if (!ms || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!_s(t)) {
		let r = e.createElement("div");
		r.style.cssText = Ao, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!_s(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return _s(n) ? n : null;
	} };
}
function pd(e) {
	let t = fd(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !ms || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/utils.js
var md = {
	defaultValue: void 0,
	granularity: "day"
};
function hd(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...md,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(Kl()) ? e = r.toDate(Kl()) : i && e > i.toDate(Kl()) && (e = i.toDate(Kl()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new td(t, a, o, 0, 0, 0) : new ed(t, a, o);
	}
}
function gd(e, t) {
	let n;
	return n = t instanceof nd ? Ku(e) : t instanceof td ? Gu(e) : Wu(e), n.calendar === t.calendar ? n : mu(n, t.calendar);
}
function _d(e, t = Kl()) {
	return e instanceof nd ? e.toDate() : e.toDate(t);
}
function vd(e) {
	if (e instanceof ed) return "date";
	if (e instanceof td) return "datetime";
	if (e instanceof nd) return "zoneddatetime";
	throw Error("Unknown date type");
}
function yd(e, t) {
	switch (t) {
		case "date": return Wu(e);
		case "datetime": return Gu(e);
		case "zoneddatetime": return Ku(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function bd(e) {
	return e instanceof td;
}
function xd(e) {
	return e instanceof nd;
}
function Sd(e) {
	return bd(e) || xd(e);
}
function Cd(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function wd(e, t) {
	return e.compare(t) < 0;
}
function Td(e, t) {
	return e.compare(t) > 0;
}
function Ed(e, t, n) {
	let r = Rl(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function Dd(e, t, n) {
	let r = Rl(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var Od = [
	"day",
	"month",
	"year"
], kd = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], Ad = ["literal", "timeZoneName"], jd = [...Od, ...kd], Md = [...jd, ...Ad], Nd = [...kd, ...Ad];
Md.filter((e) => e !== "literal"), Nd.filter((e) => e !== "literal");
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var Pd = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), Fd = [
	"year",
	"month",
	"day"
], Id = {
	ach: {
		year: "mwaka",
		month: "dwe",
		day: "nino"
	},
	af: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	am: {
		year: "ዓዓዓዓ",
		month: "ሚሜ",
		day: "ቀቀ"
	},
	an: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	ar: {
		year: "سنة",
		month: "شهر",
		day: "يوم"
	},
	ast: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	az: {
		year: "iiii",
		month: "aa",
		day: "gg"
	},
	be: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	bg: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	bn: {
		year: "yyyy",
		month: "মিমি",
		day: "dd"
	},
	br: {
		year: "bbbb",
		month: "mm",
		day: "dd"
	},
	bs: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	ca: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	cak: {
		year: "jjjj",
		month: "ii",
		day: "q'q'"
	},
	ckb: {
		year: "ساڵ",
		month: "مانگ",
		day: "ڕۆژ"
	},
	cs: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	cy: {
		year: "bbbb",
		month: "mm",
		day: "dd"
	},
	da: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	de: {
		year: "jjjj",
		month: "mm",
		day: "tt"
	},
	dsb: {
		year: "llll",
		month: "mm",
		day: "źź"
	},
	el: {
		year: "εεεε",
		month: "μμ",
		day: "ηη"
	},
	en: {
		year: "yyyy",
		month: "mm",
		day: "dd"
	},
	eo: {
		year: "jjjj",
		month: "mm",
		day: "tt"
	},
	es: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	et: {
		year: "aaaa",
		month: "kk",
		day: "pp"
	},
	eu: {
		year: "uuuu",
		month: "hh",
		day: "ee"
	},
	fa: {
		year: "سال",
		month: "ماه",
		day: "روز"
	},
	ff: {
		year: "hhhh",
		month: "ll",
		day: "ññ"
	},
	fi: {
		year: "vvvv",
		month: "kk",
		day: "pp"
	},
	fr: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	fy: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	ga: {
		year: "bbbb",
		month: "mm",
		day: "ll"
	},
	gd: {
		year: "bbbb",
		month: "mm",
		day: "ll"
	},
	gl: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	he: {
		year: "שנה",
		month: "חודש",
		day: "יום"
	},
	hr: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	hsb: {
		year: "llll",
		month: "mm",
		day: "dd"
	},
	hu: {
		year: "éééé",
		month: "hh",
		day: "nn"
	},
	ia: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	id: {
		year: "tttt",
		month: "bb",
		day: "hh"
	},
	it: {
		year: "aaaa",
		month: "mm",
		day: "gg"
	},
	ja: {
		year: " 年 ",
		month: "月",
		day: "日"
	},
	ka: {
		year: "წწწწ",
		month: "თთ",
		day: "რრ"
	},
	kk: {
		year: "жжжж",
		month: "аа",
		day: "кк"
	},
	kn: {
		year: "ವವವವ",
		month: "ಮಿಮೀ",
		day: "ದಿದಿ"
	},
	ko: {
		year: "연도",
		month: "월",
		day: "일"
	},
	lb: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	lo: {
		year: "ປປປປ",
		month: "ດດ",
		day: "ວວ"
	},
	lt: {
		year: "mmmm",
		month: "mm",
		day: "dd"
	},
	lv: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	meh: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	ml: {
		year: "വർഷം",
		month: "മാസം",
		day: "തീയതി"
	},
	ms: {
		year: "tttt",
		month: "mm",
		day: "hh"
	},
	nl: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	nn: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	no: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	oc: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	pl: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	pt: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	rm: {
		year: "oooo",
		month: "mm",
		day: "dd"
	},
	ro: {
		year: "aaaa",
		month: "ll",
		day: "zz"
	},
	ru: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	sc: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	scn: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	sk: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	sl: {
		year: "llll",
		month: "mm",
		day: "dd"
	},
	sr: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	sv: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	szl: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	tg: {
		year: "сссс",
		month: "мм",
		day: "рр"
	},
	th: {
		year: "ปปปป",
		month: "ดด",
		day: "วว"
	},
	tr: {
		year: "yyyy",
		month: "aa",
		day: "gg"
	},
	uk: {
		year: "рррр",
		month: "мм",
		day: "дд"
	},
	"zh-CN": {
		year: "年",
		month: "月",
		day: "日"
	},
	"zh-TW": {
		year: "年",
		month: "月",
		day: "日"
	}
};
function Ld(e) {
	if (zd(e)) return Id[e];
	{
		let t = Ud(e);
		return zd(t) ? Id[t] : Id.en;
	}
}
function Rd(e, t, n) {
	return Bd(e) ? Ld(n)[e] : Hd(e) ? t : Vd(e) ? "––" : "";
}
function zd(e) {
	return Pd.includes(e);
}
function Bd(e) {
	return Fd.includes(e);
}
function Vd(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function Hd(e) {
	return e === "era" || e === "dayPeriod";
}
function Ud(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function Wd(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = jd.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function Gd(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!Zd(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = bs(i) ? Rd(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if (a === "day" && bs(t.month) && !bs(t.day)) {
			let e = Number.parseInt(t.day);
			if (e >= 1 && e <= 31) return t.day.startsWith("0") && `${e}`.length === 1 ? `0${e}` : `${e}`;
		}
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!bs(o) && !bs(c)) {
				let l = n.part(uf(a, i, t).set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), u = e.hourCycle === 12 || e.hourCycle === void 0 && df(r) === 12;
				if (a === "hour" && u) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && l.length === 1 ? `0${l}` : l;
			}
			return Rd(a, "", r);
		}
		if (Xd(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (bs(e)) return Rd(a, "", r);
			{
				let r = n.part(uf(a, i, t).set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && r.length === 1 ? `0${r}` : r;
			}
		}
		return "";
	}
	return a;
}
function Kd(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, Jd(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !Zd(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(bs(e.part) || bs(e.value) || e.part === "timeZoneName" && (!xd(n) || a)));
}
function qd(e) {
	let t = Gd(e);
	return {
		obj: t,
		arr: Kd({
			contentObj: t,
			...e
		})
	};
}
function Jd(e, t) {
	let n = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		hourCycle: t === 24 ? "h23" : void 0,
		hour12: t !== 24 && void 0
	};
	return e === "day" && (delete n.second, delete n.hour, delete n.minute, delete n.timeZoneName), e === "hour" && delete n.minute, e === "minute" && delete n.second, n;
}
function Yd() {
	return jd.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function Xd(e) {
	return Od.includes(e);
}
function Zd(e) {
	return jd.includes(e);
}
function Qd(e) {
	return Md.includes(e);
}
function $d(e) {
	return !ms || !e ? [] : yf(e).map((e) => e.dataset.segment).filter((e) => jd.includes(e));
}
var ef = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function tf(e) {
	let t = ef.indexOf(e);
	return t === -1 ? ef.length : t;
}
function nf(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = $d(n).sort((e, t) => tf(e) - tf(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (bs(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (Xd(e)) {
		let n = t[e];
		if (bs(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function rf(e, t) {
	let n = $d(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (Xd(t) && e[t] === null) return !1;
	return !0;
}
function af(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (kd.includes(e) || Od.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function of(e, t) {
	return t || (Sd(e) ? "minute" : "day");
}
function sf(e, t) {
	if (!ms) return !1;
	let n = yf(t);
	return n.length ? n[0].id === e : !1;
}
function cf(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!ms) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = Eo({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function lf(e, t) {
	if (!ms) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function uf(e, t, n) {
	if (e !== "day") return t;
	let r = t;
	return bs(n.year) || (r = r.set({ year: Number.parseInt(n.year) })), bs(n.month) || (r = r.set({ month: Number.parseInt(n.month) })), r;
}
function df(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
function ff(e, t) {
	let n = Number.parseInt(e);
	return Number.isNaN(n) ? e : t === "AM" ? n === 12 ? "0" : `${n}` : n < 12 ? `${n + 12}` : `${n}`;
}
function pf(e) {
	if (e === null) return e;
	let t = Number.parseInt(e);
	return Number.isNaN(t) ? e : t === 0 ? "12" : t > 12 ? `${t - 12}` : e;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function mf(e, t) {
	let n = e.currentTarget;
	if (!_s(n)) return;
	let { prev: r, next: i } = _f(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function hf(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function gf(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function _f(e, t) {
	let n = yf(t);
	return n.length ? {
		next: hf(e, n),
		prev: gf(e, n)
	} : {
		next: null,
		prev: null
	};
}
function vf(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function yf(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!_s(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!Qd(t) || t === "literal");
	}) : [];
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/formatter.js
var bf = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function xf(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new id(t, n).format(e);
	}
	function a(e, t = !0) {
		return Sd(e) && t ? i(_d(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(_d(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new id(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new id(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new id(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new id(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new id(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return xd(e) ? new id(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(_d(e)) : new id(t, n).formatToParts(_d(e));
	}
	function u(e, n = "narrow") {
		return new id(t, { weekday: n }).format(e);
	}
	function d(e, n = void 0) {
		return new id(t, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: n === 24 ? "h23" : void 0
		}).formatToParts(e).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...bf,
			...n
		}).find((e) => e.type === t);
		return r ? r.value : "";
	}
	return {
		setLocale: n,
		getLocale: r,
		fullMonth: s,
		fullYear: c,
		fullMonthAndYear: o,
		toParts: l,
		custom: i,
		part: f,
		dayPeriod: d,
		selectedDate: a,
		dayOfWeek: u
	};
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/arrays.js
function Sf(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function Cf(e, t) {
	return e >= 0 && e < t.length;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/date-time/calendar-helpers.svelte.js
function wf(e) {
	return !(!_s(e) || !e.hasAttribute("data-bits-day"));
}
function Tf(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function Ef(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = Cd(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = Jl(t), c = Yl(t), l = n === void 0 ? Ed(s, 0, i) : Ed(s, n, "en-US"), u = n === void 0 ? Dd(c, 0, i) : Dd(c, n, "en-US"), d = Tf(l.subtract({ days: 1 }), s), f = Tf(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
	if (r && p < 42) {
		let e = 42 - p, n = f[f.length - 1];
		n ||= t.add({ months: 1 }).set({ day: 1 });
		let r = e;
		f.length === 0 && (r = e - 1, f.push(n));
		let i = Array.from({ length: r }, (e, t) => {
			let r = t + 1;
			return n.add({ days: r });
		});
		f.push(...i);
	}
	let m = d.concat(o, f);
	return {
		value: t,
		dates: m,
		weeks: Sf(m, 7)
	};
}
function Df(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(Ef({
		...r,
		dateObj: n
	})), i;
	i.push(Ef({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(Ef({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function Of(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => _s(e)) : [];
}
function kf(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = gd(n, t.current));
}
function Af({ node: e, add: t, useCalendarDayOffset: n = !1, placeholder: r, calendarNode: i, isPrevButtonDisabled: a, isNextButtonDisabled: o, months: s, numberOfMonths: c }) {
	let l = Of(i);
	if (!l.length) return;
	if (n) {
		let n = e.getAttribute("data-value");
		if (!n) return;
		let l = (e) => {
			let n = Array.from(i?.querySelectorAll("[data-bits-day]:not([data-outside-visible-months])") ?? []).map((e) => e.getAttribute("data-value")).filter((e) => e !== null), a = Of(i);
			for (; n.includes(e.toString());) {
				let n = a.find((t) => t.getAttribute("data-value") === e.toString());
				if (n) {
					kf(n, r), n.focus();
					return;
				}
				e = e.add({ days: t });
			}
			return e;
		}, u = l(gd(n, r.current).add({ days: t }));
		if (!u || (t > 0 ? o : a)) return;
		let d = s[0]?.value;
		if (!d) return;
		r.current = t > 0 ? d.add({ months: c }) : d.subtract({ months: c }), Ho(() => l(u));
		return;
	}
	let u = l.indexOf(e) + t;
	if (Cf(u, l)) {
		let e = l[u];
		return kf(e, r), e.focus();
	}
	if (u < 0) {
		if (a) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.subtract({ months: c }), Ho(() => {
			let e = Of(i);
			if (!e.length) return;
			let t = e.length - Math.abs(u);
			if (Cf(t, e)) {
				let n = e[t];
				return kf(n, r), n.focus();
			}
		});
	}
	if (u >= l.length) {
		if (o) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.add({ months: c }), Ho(() => {
			let e = Of(i);
			if (!e.length) return;
			let t = u - l.length;
			if (Cf(t, e)) return e[t].focus();
		});
	}
}
var jf = [
	ls,
	fs,
	us,
	ds
], Mf = [ps, " "];
function Nf({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!wf(i) || !jf.includes(e.key) && !Mf.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[ls]: 7,
		[fs]: -7,
		[us]: -1,
		[ds]: 1
	};
	if (jf.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (Mf.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, gd(n, r));
	}
}
function Pf({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = Df({
				dateObj: e,
				weekStartsOn: i,
				locale: a,
				fixedWeeks: o,
				numberOfMonths: n
			});
			s(e), t(r);
		}
	}
}
function Ff({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = Df({
				dateObj: e,
				weekStartsOn: i,
				locale: a,
				fixedWeeks: o,
				numberOfMonths: n
			});
			s(e), t(r);
		}
	}
}
function If({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(_d(fu(e)), n)) : [];
}
function Lf(e) {
	I(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		V(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(Df({
				...o,
				dateObj: a
			}));
		});
	});
}
function Rf({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = Qo(e), i = r.createElement("div");
	i.style.cssText = Eo({
		border: "0px",
		clip: "rect(0px, 0px, 0px, 0px)",
		clipPath: "inset(50%)",
		height: "1px",
		margin: "-1px",
		overflow: "hidden",
		padding: "0px",
		position: "absolute",
		whiteSpace: "nowrap",
		width: "1px"
	});
	let a = r.createElement("div");
	return a.textContent = t, a.id = n, a.role = "heading", a.ariaLevel = "2", e.insertBefore(i, e.firstChild), i.appendChild(a), () => {
		let e = r.getElementById(n);
		e && (i.parentElement?.removeChild(i), e.remove());
	};
}
function zf({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	I(() => {
		e.current, V(() => {
			t().some((t) => Fl(t, e.current)) || o(Df({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function Bf({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? Td(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function Vf({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? wd(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function Hf({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = _d(fu(e[0].value));
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = _d(fu(e[0].value)), i = _d(fu(e[e.length - 1].value)), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function Uf({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": Q(n),
		"data-disabled": Q(r),
		"data-readonly": Q(i)
	};
}
function Wf(e) {
	if (e.defaultPrevented) return;
	let t = Qo(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function Gf(e) {
	if (!ms) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return yd(r, i);
}
function Kf(e, t, n) {
	if (!e || !n(e)) return e;
	for (let e of t) {
		let t = e.dates.find((t) => Fl(t, e.value) && !n(t));
		if (t) return t;
	}
	return e;
}
function qf({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && wd(e, r.current) || i.current && wd(i.current, e));
	}
	Lo(() => e.current, () => {
		e.current && t.current && Pl(t.current, n) && o(n) && (t.current = Gf(e.current) ?? n);
	});
}
function Jf(e, t) {
	return !e || !t ? e : Sd(e) && Sd(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var Yf = cs({
	component: "calendar",
	parts: [
		"root",
		"grid",
		"cell",
		"next-button",
		"prev-button",
		"day",
		"grid-body",
		"grid-head",
		"grid-row",
		"head-cell",
		"header",
		"heading",
		"month-select",
		"year-select"
	]
});
function Xf(e) {
	let t = (/* @__PURE__ */ new Date()).getFullYear(), n = Math.max(e.placeholderYear, t), r, i;
	if (e.minValue) r = e.minValue.year;
	else {
		let t = n - 100;
		r = e.placeholderYear < t ? e.placeholderYear - 10 : t;
	}
	i = e.maxValue ? e.maxValue.year : n + 10, r > i && (r = i);
	let a = i - r + 1;
	return Array.from({ length: a }, (e, t) => r + t);
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/calendar.svelte.js
var Zf = new Po("Calendar.Root | RangeCalender.Root"), Qf = class e {
	static create(t) {
		return Zf.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ k(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return B(this.#e);
	}
	set visibleMonths(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => (this.months, Bl(Kl())));
	get todayDate() {
		return B(this.#t);
	}
	set todayDate(e) {
		M(this.#t, e);
	}
	formatter;
	accessibleHeadingId = nl();
	domContext;
	attachment;
	#n = /* @__PURE__ */ j(on([]));
	get months() {
		return B(this.#n);
	}
	set months(e) {
		M(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ k(() => Kf(this.opts.placeholder.current, this.months, (e) => this.isDateDisabled(e)));
	get tabbableDate() {
		return B(this.#r);
	}
	set tabbableDate(e) {
		M(this.#r, e);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = ns(this.opts.ref), this.domContext = new ts(e.ref), this.announcer = pd(null), this.formatter = xf({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), ci(() => {
			this.announcer = pd(this.domContext.getDocument());
		}), this.months = Df({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#s(), this.#c(), this.#l(), zf({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), Lf({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), Lo(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), Lo(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), qf({
			placeholder: e.placeholder,
			defaultPlaceholder: e.defaultPlaceholder,
			isDateDisabled: e.isDateDisabled,
			maxValue: e.maxValue,
			minValue: e.minValue,
			ref: e.ref
		});
	}
	setMonths(e) {
		this.months = e;
	}
	#i = /* @__PURE__ */ k(() => If({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return B(this.#i);
	}
	set weekdays(e) {
		M(this.#i, e);
	}
	#a = /* @__PURE__ */ k(() => V(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return B(this.#a);
	}
	set initialPlaceholderYear(e) {
		M(this.#a, e);
	}
	#o = /* @__PURE__ */ k(() => Xf({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return B(this.#o);
	}
	set defaultYears(e) {
		M(this.#o, e);
	}
	#s() {
		I(() => {
			if (V(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#c() {
		I(() => {
			if (this.opts.ref.current) return Rf({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#l() {
		An(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		Pf({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (e) => this.opts.placeholder.current = e,
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months
		});
	}
	prevPage() {
		Ff({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (e) => this.opts.placeholder.current = e,
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months
		});
	}
	nextYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.add({ years: 1 });
	}
	prevYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.subtract({ years: 1 });
	}
	setYear(e) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ year: e });
	}
	setMonth(e) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ month: e });
	}
	#u = /* @__PURE__ */ k(() => Bf({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return B(this.#u);
	}
	set isNextButtonDisabled(e) {
		M(this.#u, e);
	}
	#d = /* @__PURE__ */ k(() => Vf({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return B(this.#d);
	}
	set isPrevButtonDisabled(e) {
		M(this.#d, e);
	}
	#f = /* @__PURE__ */ k(() => {
		let e = this.opts.value.current, t = this.opts.isDateDisabled.current, n = this.opts.isDateUnavailable.current;
		if (Array.isArray(e)) {
			if (!e.length) return !1;
			for (let r of e) if (t(r) || n(r)) return !0;
		} else {
			if (!e) return !1;
			if (t(e) || n(e)) return !0;
		}
		return !1;
	});
	get isInvalid() {
		return B(this.#f);
	}
	set isInvalid(e) {
		M(this.#f, e);
	}
	#p = /* @__PURE__ */ k(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, Hf({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return B(this.#p);
	}
	set headingValue(e) {
		M(this.#p, e);
	}
	#m = /* @__PURE__ */ k(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return B(this.#m);
	}
	set fullCalendarLabel(e) {
		M(this.#m, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => Fl(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && wd(e, t) || n && wd(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => Pl(t, e)) : t ? Pl(t, e) : !1;
	}
	shiftFocus(e, t) {
		return Af({
			node: e,
			add: t,
			useCalendarDayOffset: Math.abs(t) === 7,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current
		});
	}
	#h(e) {
		if (this.opts.type.current !== "multiple" || !this.opts.maxDays.current) return !0;
		let t = e.length;
		return !(this.opts.maxDays.current && t > this.opts.maxDays.current);
	}
	handleCellClick(e, t) {
		if (this.opts.readonly.current || this.opts.isDateDisabled.current?.(t) || this.opts.isDateUnavailable.current?.(t)) return;
		let n = this.opts.value.current;
		if (this.opts.type.current === "multiple") (Array.isArray(n) || n === void 0) && (this.opts.value.current = this.handleMultipleUpdate(n, t));
		else if (!Array.isArray(n)) {
			let e = this.handleSingleUpdate(n, t);
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = Jf(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#h(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => Pl(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#h(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !Pl(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && Pl(e, t)) this.opts.placeholder.current = t;
		else return t;
	}
	onkeydown(e) {
		Nf({
			event: e,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#g = /* @__PURE__ */ k(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return B(this.#g);
	}
	set snippetProps(e) {
		M(this.#g, e);
	}
	getBitsAttr = (e) => Yf.getAttr(e);
	#_ = /* @__PURE__ */ k(() => ({
		...Uf({
			fullCalendarLabel: this.fullCalendarLabel,
			id: this.opts.id.current,
			isInvalid: this.isInvalid,
			disabled: this.opts.disabled.current,
			readonly: this.opts.readonly.current
		}),
		[this.getBitsAttr("root")]: "",
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return B(this.#_);
	}
	set props(e) {
		M(this.#_, e);
	}
}, $f = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"aria-hidden": is(!0),
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("heading")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, ep = new Po("Calendar.Cell | RangeCalendar.Cell"), tp = class e {
	static create(t) {
		return ep.set(new e(t, Zf.get()));
	}
	opts;
	root;
	#e = /* @__PURE__ */ k(() => _d(fu(this.opts.date.current)));
	get cellDate() {
		return B(this.#e);
	}
	set cellDate(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return B(this.#t);
	}
	set isUnavailable(e) {
		M(this.#t, e);
	}
	#n = /* @__PURE__ */ k(() => Pl(this.opts.date.current, this.root.todayDate));
	get isDateToday() {
		return B(this.#n);
	}
	set isDateToday(e) {
		M(this.#n, e);
	}
	#r = /* @__PURE__ */ k(() => !Fl(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return B(this.#r);
	}
	set isOutsideMonth(e) {
		M(this.#r, e);
	}
	#i = /* @__PURE__ */ k(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return B(this.#i);
	}
	set isOutsideVisibleMonths(e) {
		M(this.#i, e);
	}
	#a = /* @__PURE__ */ k(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return B(this.#a);
	}
	set isDisabled(e) {
		M(this.#a, e);
	}
	#o = /* @__PURE__ */ k(() => Pl(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return B(this.#o);
	}
	set isFocusedDate(e) {
		M(this.#o, e);
	}
	#s = /* @__PURE__ */ k(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return B(this.#s);
	}
	set isSelectedDate(e) {
		M(this.#s, e);
	}
	#c = /* @__PURE__ */ k(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return B(this.#c);
	}
	set labelText(e) {
		M(this.#c, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#l = /* @__PURE__ */ k(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return B(this.#l);
	}
	set snippetProps(e) {
		M(this.#l, e);
	}
	#u = /* @__PURE__ */ k(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
	get ariaDisabled() {
		return B(this.#u);
	}
	set ariaDisabled(e) {
		M(this.#u, e);
	}
	#d = /* @__PURE__ */ k(() => ({
		"data-unavailable": Q(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": Q(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": vd(this.opts.date.current),
		"data-disabled": Q(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return B(this.#d);
	}
	set sharedDataAttrs(e) {
		M(this.#d, e);
	}
	#f = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": rs(this.isSelectedDate),
		"aria-disabled": rs(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#f);
	}
	set props(e) {
		M(this.#f, e);
	}
}, np = class e {
	static create(t) {
		return new e(t, ep.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.root.tabbableDate && Pl(this.cell.opts.date.current, this.cell.root.tabbableDate) ? 0 : -1);
	onclick(e) {
		this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}
	#t = /* @__PURE__ */ k(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`
	}));
	get snippetProps() {
		return B(this.#t);
	}
	set snippetProps(e) {
		M(this.#t, e);
	}
	#n = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": rs(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: B(this.#e),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#n);
	}
	set props(e) {
		M(this.#n, e);
	}
}, rp = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	#e = /* @__PURE__ */ k(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return B(this.#e);
	}
	set isDisabled(e) {
		M(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ns(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": rs(this.isDisabled),
		"data-disabled": Q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
}, ip = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	#e = /* @__PURE__ */ k(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return B(this.#e);
	}
	set isDisabled(e) {
		M(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ns(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": rs(this.isDisabled),
		"data-disabled": Q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
}, ap = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": rs(this.root.opts.readonly.current),
		"aria-disabled": rs(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		"data-disabled": Q(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, op = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, sp = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, cp = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, lp = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, up = class e {
	static create(t) {
		return new e(t, Zf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref);
	}
	#e = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		M(this.#e, e);
	}
}, dp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), fp = /* @__PURE__ */ H("<div><!></div>");
function pp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, dp), o = np.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U(), r = P(n);
		{
			let e = /* @__PURE__ */ k(() => ({
				props: B(s),
				...o.snippetProps
			}));
			K(r, () => t.child, () => B(e));
		}
		W(e, n);
	}, d = (e) => {
		var n = fp();
		J(n, () => ({ ...B(s) }));
		var r = N(n), i = (e) => {
			var n = U();
			K(P(n), () => t.children ?? g, () => o.snippetProps), W(e, n);
		}, a = (e) => {
			var t = Hr();
			L(() => G(t, o.cell.opts.date.current.day)), W(e, t);
		};
		q(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var mp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), hp = /* @__PURE__ */ H("<table><!></table>");
function gp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, mp), o = ap.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = hp();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var _p = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), vp = /* @__PURE__ */ H("<tbody><!></tbody>");
function yp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, _p), o = op.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = vp();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var bp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), xp = /* @__PURE__ */ H("<td><!></td>");
function Sp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, bp), o = tp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		date: X(() => t.date),
		month: X(() => t.month)
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U(), r = P(n);
		{
			let e = /* @__PURE__ */ k(() => ({
				props: B(s),
				...o.snippetProps
			}));
			K(r, () => t.child, () => B(e));
		}
		W(e, n);
	}, d = (e) => {
		var n = xp();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g, () => o.snippetProps), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var Cp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), wp = /* @__PURE__ */ H("<thead><!></thead>");
function Tp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, Cp), o = sp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = wp();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var Ep = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Dp = /* @__PURE__ */ H("<th><!></th>");
function Op(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, Ep), o = lp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = Dp();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var kp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ap = /* @__PURE__ */ H("<tr><!></tr>");
function jp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, kp), o = cp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = Ap();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var Mp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Np = /* @__PURE__ */ H("<header><!></header>");
function Pp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, Mp), o = up.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(s) })), W(e, n);
	}, d = (e) => {
		var n = Np();
		J(n, () => ({ ...B(s) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var Fp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ip = /* @__PURE__ */ H("<div><!></div>");
function Lp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = /* @__PURE__ */ pa(t, Fp), o = $f.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ k(() => Z(a, o.props));
	var c = U(), l = P(c), u = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({
			props: B(s),
			headingValue: o.root.headingValue
		})), W(e, n);
	}, d = (e) => {
		var n = Ip();
		J(n, () => ({ ...B(s) }));
		var r = N(n), i = (e) => {
			var n = U();
			K(P(n), () => t.children ?? g, () => ({ headingValue: o.root.headingValue })), W(e, n);
		}, a = (e) => {
			var t = Hr();
			L(() => G(t, o.root.headingValue)), W(e, t);
		};
		q(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), E(n), W(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var Rp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), zp = /* @__PURE__ */ H("<button><!></button>");
function Bp(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ pa(t, Rp), s = rp.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props, { tabindex: a() }));
	var l = U(), u = P(l), d = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(c) })), W(e, n);
	}, f = (e) => {
		var n = zp();
		J(n, () => ({ ...B(c) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var Vp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), Hp = /* @__PURE__ */ H("<button><!></button>");
function Up(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ pa(t, Vp), s = ip.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ k(() => Z(o, s.props, { tabindex: a() }));
	var l = U(), u = P(l), d = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({ props: B(c) })), W(e, n);
	}, f = (e) => {
		var n = Hp();
		J(n, () => ({ ...B(c) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var Wp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), Gp = /* @__PURE__ */ H("<input/>");
function Kp(e, t) {
	D(t, !0);
	let n = Y(t, "value", 15), r = /* @__PURE__ */ pa(t, Wp), i = /* @__PURE__ */ k(() => Z(r, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...ko,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var a = U(), o = P(a), s = (e) => {
		var t = Gp();
		J(t, () => ({
			...B(i),
			value: n(),
			defaultChecked: B(i).checked
		})), W(e, t);
	}, c = (e) => {
		var t = Gp(), r = (e) => n(e.currentTarget.value);
		J(t, () => ({
			...B(i),
			value: n(),
			defaultValue: n() ?? "",
			oninput: r
		})), W(e, t);
	};
	q(o, (e) => {
		B(i).type === "checkbox" ? e(s) : e(c, -1);
	}), W(e, a), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/floating-layer/floating-root.svelte.js
var qp = new Po("Floating.Root"), Jp = new Po("Floating.Root"), Yp = class e {
	static create(t = !1) {
		return t ? Jp.set(new e()) : qp.set(new e());
	}
	anchorNode = qa(null);
	customAnchorNode = qa(null);
	triggerNode = qa(null);
	constructor() {
		I(() => {
			this.customAnchorNode.current ? typeof this.customAnchorNode.current == "string" ? this.anchorNode.current = document.querySelector(this.customAnchorNode.current) : this.anchorNode.current = this.customAnchorNode.current : this.anchorNode.current = this.triggerNode.current;
		});
	}
}, Xp = class e {
	static create(t, n = !1) {
		return n ? new e(t, Jp.get()) : new e(t, qp.get());
	}
	opts;
	root;
	constructor(e, t) {
		this.opts = e, this.root = t, t.triggerNode = e.virtualEl && e.virtualEl.current ? Ka(e.virtualEl.current) : e.ref;
	}
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function Zp(e, t) {
	D(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	Yp.create(V(() => n()));
	var r = U();
	K(P(r), () => t.children ?? g), W(e, r), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function Qp(e) {
	return typeof e == "function" ? e() : e;
}
function $p(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function em(e, t) {
	let n = $p(e);
	return Math.round(t * n) / n;
}
function tm(e) {
	return {
		[`--bits-${e}-content-transform-origin`]: "var(--bits-floating-transform-origin)",
		[`--bits-${e}-content-available-width`]: "var(--bits-floating-available-width)",
		[`--bits-${e}-content-available-height`]: "var(--bits-floating-available-height)",
		[`--bits-${e}-anchor-width`]: "var(--bits-floating-anchor-width)",
		[`--bits-${e}-anchor-height`]: "var(--bits-floating-anchor-height)"
	};
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
function nm(e, t) {
	D(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	Xp.create({
		id: X(() => t.id),
		virtualEl: X(() => t.virtualEl),
		ref: V(() => t.ref)
	}, V(() => n()));
	var r = U();
	K(P(r), () => t.children ?? g), W(e, r), O();
}
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var rm = [
	"top",
	"right",
	"bottom",
	"left"
], im = Math.min, am = Math.max, om = Math.round, sm = Math.floor, cm = (e) => ({
	x: e,
	y: e
}), lm = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function um(e, t, n) {
	return am(e, im(t, n));
}
function dm(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function fm(e) {
	return e.split("-")[0];
}
function pm(e) {
	return e.split("-")[1];
}
function mm(e) {
	return e === "x" ? "y" : "x";
}
function hm(e) {
	return e === "y" ? "height" : "width";
}
function gm(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function _m(e) {
	return mm(gm(e));
}
function vm(e, t, n) {
	n === void 0 && (n = !1);
	let r = pm(e), i = _m(e), a = hm(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Dm(o)), [o, Dm(o)];
}
function ym(e) {
	let t = Dm(e);
	return [
		bm(e),
		t,
		bm(t)
	];
}
function bm(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var xm = ["left", "right"], Sm = ["right", "left"], Cm = ["top", "bottom"], wm = ["bottom", "top"];
function Tm(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Sm : xm : t ? xm : Sm;
		case "left":
		case "right": return t ? Cm : wm;
		default: return [];
	}
}
function Em(e, t, n, r) {
	let i = pm(e), a = Tm(fm(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(bm)))), a;
}
function Dm(e) {
	let t = fm(e);
	return lm[t] + e.slice(t.length);
}
function Om(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function km(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Om(e);
}
function Am(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
// node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function jm(e, t, n) {
	let { reference: r, floating: i } = e, a = gm(t), o = _m(t), s = hm(o), c = fm(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	let m = pm(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Mm(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = dm(t, e), p = km(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Am(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = Am(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var Nm = 50, Pm = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Mm
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = jm(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < Nm && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = jm(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Fm = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = dm(e, t) || {};
		if (l == null) return {};
		let d = km(u), f = {
			x: n,
			y: r
		}, p = _m(i), m = hm(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		C && await (o.isElement == null ? void 0 : o.isElement(S)) || (C = s.floating[y] || a.floating[m]);
		let ee = b / 2 - x / 2, te = C / 2 - h[m] / 2 - 1, ne = im(d[_], te), re = im(d[v], te), ie = C - h[m] - re, ae = C / 2 - h[m] / 2 + ee, oe = um(ne, ae, ie), se = !c.arrow && pm(i) != null && ae !== oe && a.reference[m] / 2 - (ae < ne ? ne : re) - h[m] / 2 < 0, ce = se ? ae < ne ? ae - ne : ae - ie : 0;
		return {
			[p]: f[p] + ce,
			data: {
				[p]: oe,
				centerOffset: ae - oe - ce,
				...se && { alignmentOffset: ce }
			},
			reset: se
		};
	}
}), Im = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = dm(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = fm(r), _ = gm(o), v = fm(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Dm(o)] : ym(o)), x = p !== "none";
			!d && x && b.push(...Em(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), ee = [], te = i.flip?.overflows || [];
			if (l && ee.push(C[g]), u) {
				let e = vm(r, a, y);
				ee.push(C[e[0]], C[e[1]]);
			}
			if (te = [...te, {
				placement: r,
				overflows: ee
			}], !ee.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === gm(t) || te.every((e) => gm(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: te
					},
					reset: { placement: t }
				};
				let n = te.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = te.filter((e) => {
							if (x) {
								let t = gm(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement": n = o;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
};
function Lm(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function Rm(e) {
	return rm.some((t) => e[t] >= 0);
}
var zm = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = dm(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = Lm(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: Rm(e)
					} };
				}
				case "escaped": {
					let e = Lm(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: Rm(e)
					} };
				}
				default: return {};
			}
		}
	};
}, Bm = /*#__PURE__*/ new Set(["left", "top"]);
async function Vm(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = fm(n), s = pm(n), c = gm(n) === "y", l = Bm.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = dm(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var Hm = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Vm(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, Um = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = dm(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = gm(i), p = mm(f), m = u[p], h = u[f], g = (e, t) => um(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
			o && (m = g(p, m)), s && (h = g(f, h));
			let _ = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				..._,
				data: {
					x: _.x - n,
					y: _.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
}, Wm = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = dm(e, t), u = {
				x: n,
				y: r
			}, d = gm(i), f = mm(d), p = u[f], m = u[d], h = dm(s, t), g = typeof h == "number" ? {
				mainAxis: h,
				crossAxis: 0
			} : {
				mainAxis: h.mainAxis ?? 0,
				crossAxis: h.crossAxis ?? 0
			};
			if (c) {
				let e = f === "y" ? "height" : "width", t = a.reference[f] - a.floating[e] + g.mainAxis, n = a.reference[f] + a.reference[e] - g.mainAxis;
				p < t ? p = t : p > n && (p = n);
			}
			if (l) {
				let e = f === "y" ? "width" : "height", t = Bm.has(fm(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, Gm = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = dm(e, t), c = await i.detectOverflow(t, s), l = fm(n), u = pm(n), d = gm(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = im(p - c[m], g), y = im(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * am(c.left, c.right) : S = p - 2 * am(c.top, c.bottom)), await o({
				...t,
				availableWidth: C,
				availableHeight: S
			});
			let ee = await i.getDimensions(a.floating);
			return f !== ee.width || p !== ee.height ? { reset: { rects: !0 } } : {};
		}
	};
};
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function Km() {
	return typeof window < "u";
}
function qm(e) {
	return Xm(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Jm(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Ym(e) {
	return ((Xm(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Xm(e) {
	return Km() ? e instanceof Node || e instanceof Jm(e).Node : !1;
}
function Zm(e) {
	return Km() ? e instanceof Element || e instanceof Jm(e).Element : !1;
}
function Qm(e) {
	return Km() ? e instanceof HTMLElement || e instanceof Jm(e).HTMLElement : !1;
}
function $m(e) {
	return !Km() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Jm(e).ShadowRoot;
}
function eh(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = dh(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function th(e) {
	return /^(table|td|th)$/.test(qm(e));
}
function nh(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var rh = /transform|translate|scale|rotate|perspective|filter/, ih = /paint|layout|strict|content/, ah = (e) => !!e && e !== "none", oh;
function sh(e) {
	let t = Zm(e) ? dh(e) : e;
	return ah(t.transform) || ah(t.translate) || ah(t.scale) || ah(t.rotate) || ah(t.perspective) || !lh() && (ah(t.backdropFilter) || ah(t.filter)) || rh.test(t.willChange || "") || ih.test(t.contain || "");
}
function ch(e) {
	let t = ph(e);
	for (; Qm(t) && !uh(t);) {
		if (sh(t)) return t;
		if (nh(t)) return null;
		t = ph(t);
	}
	return null;
}
function lh() {
	return oh ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), oh;
}
function uh(e) {
	return /^(html|body|#document)$/.test(qm(e));
}
function dh(e) {
	return Jm(e).getComputedStyle(e);
}
function fh(e) {
	return Zm(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function ph(e) {
	if (qm(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || $m(e) && e.host || Ym(e);
	return $m(t) ? t.host : t;
}
function mh(e) {
	let t = ph(e);
	return uh(t) ? (e.ownerDocument || e).body : Qm(t) && eh(t) ? t : mh(t);
}
function hh(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = mh(e), i = r === e.ownerDocument?.body, a = Jm(r);
	if (i) {
		let e = gh(a);
		return t.concat(a, a.visualViewport || [], eh(r) ? r : [], e && n ? hh(e) : []);
	}
	return t.concat(r, hh(r, [], n));
}
function gh(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function _h(e) {
	let t = dh(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = Qm(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = om(n) !== a || om(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function vh(e) {
	return Zm(e) ? e : e.contextElement;
}
function yh(e) {
	let t = vh(e);
	if (!Qm(t)) return cm(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = _h(t), o = (a ? om(n.width) : n.width) / r, s = (a ? om(n.height) : n.height) / i;
	return o && Number.isFinite(o) || (o = 1), s && Number.isFinite(s) || (s = 1), {
		x: o,
		y: s
	};
}
var bh = /*#__PURE__*/ cm(0);
function xh(e) {
	let t = Jm(e);
	return !lh() || !t.visualViewport ? bh : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Sh(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === Jm(e);
}
function Ch(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = vh(e), o = cm(1);
	t && (r ? Zm(r) && (o = yh(r)) : o = yh(e));
	let s = Sh(a, n, r) ? xh(a) : cm(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = Jm(a), t = Zm(r) ? Jm(r) : r, n = e, i = gh(n);
		for (; i && t !== n;) {
			let e = yh(i), t = i.getBoundingClientRect(), r = dh(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = Jm(i), i = gh(n);
		}
	}
	return Am({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function wh(e, t) {
	let n = fh(e).scrollLeft;
	return t ? t.left + n : Ch(Ym(e)).left + n;
}
function Th(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - wh(e, n),
		y: n.top + t.scrollTop
	};
}
function Eh(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Ym(r), s = t ? nh(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = cm(1), u = cm(0), d = Qm(r);
	if ((d || !a) && ((qm(r) !== "body" || eh(o)) && (c = fh(r)), d)) {
		let e = Ch(r);
		l = yh(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Th(o, c) : cm(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Dh(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Oh(e) {
	let t = fh(e), n = e.ownerDocument.body, r = am(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = am(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + wh(e), o = -t.scrollTop;
	return dh(n).direction === "rtl" && (a += am(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var kh = 25;
function Ah(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = Jm(e), a = Ym(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !lh() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (wh(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= kh && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function jh(e, t) {
	let n = Ch(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = yh(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Mh(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Ah(e, n, t);
	else if (t === "document") r = Oh(Ym(e));
	else if (Zm(t)) r = jh(t, n);
	else {
		let n = xh(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Am(r);
}
function Nh(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = hh(e, [], !1).filter((e) => Zm(e) && qm(e) !== "body"), i = null, a = dh(e).position === "fixed", o = a ? ph(e) : e;
	for (; Zm(o) && !uh(o);) {
		let e = dh(o), t = sh(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = ph(o);
	}
	return t.set(e, r), r;
}
function Ph(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? nh(t) ? [] : Nh(t, this._c) : [].concat(n), r], o = Mh(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Mh(t, a[e], i);
		s = am(n.top, s), c = im(n.right, c), l = im(n.bottom, l), u = am(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Fh(e) {
	let { width: t, height: n } = _h(e);
	return {
		width: t,
		height: n
	};
}
function Ih(e, t, n) {
	let r = Qm(t), i = Ym(t), a = n === "fixed", o = Ch(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = cm(0);
	if ((r || !a) && ((qm(t) !== "body" || eh(i)) && (s = fh(t)), r)) {
		let e = Ch(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = wh(i));
	let l = i && !r && !a ? Th(i, s) : cm(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Lh(e) {
	return dh(e).position === "static";
}
function Rh(e, t) {
	if (!Qm(e) || dh(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Ym(e) === n && (n = n.ownerDocument.body), n;
}
function zh(e, t) {
	let n = Jm(e);
	if (nh(e)) return n;
	if (!Qm(e)) {
		let t = ph(e);
		for (; t && !uh(t);) {
			if (Zm(t) && !Lh(t)) return t;
			t = ph(t);
		}
		return n;
	}
	let r = Rh(e, t);
	for (; r && th(r) && Lh(r);) r = Rh(r, t);
	return r && uh(r) && Lh(r) && !sh(r) ? n : r || ch(e) || n;
}
var Bh = async function(e) {
	let t = this.getOffsetParent || zh, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Ih(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Vh(e) {
	return dh(e).direction === "rtl";
}
var Hh = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Eh,
	getDocumentElement: Ym,
	getClippingRect: Ph,
	getOffsetParent: zh,
	getElementRects: Bh,
	getClientRects: Dh,
	getDimensions: Fh,
	getScale: yh,
	isElement: Zm,
	isRTL: Vh
};
function Uh(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Wh(e, t, n) {
	let r = null, i, a = Ym(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = sm(d), h = sm(a.clientWidth - (u + f)), g = sm(a.clientHeight - (d + p)), _ = sm(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: am(0, im(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!Uh(l, e.getBoundingClientRect())) return s();
			if (n !== c) {
				if (!y) return s();
				n ? s(!1, n) : i = setTimeout(() => {
					s(!1, 1e-7);
				}, 1e3);
			}
			y = !1;
		}
		try {
			r = new IntersectionObserver(b, {
				...v,
				root: a.ownerDocument
			});
		} catch {
			r = new IntersectionObserver(b, v);
		}
		r.observe(e);
	}
	let c = Jm(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function Gh(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = vh(e), u = i || a ? [...l ? hh(l) : [], ...t ? hh(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Wh(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Ch(e) : null;
	c && g();
	function g() {
		let t = Ch(e);
		h && !Uh(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var Kh = Hm, qh = Um, Jh = Im, Yh = Gm, Xh = zm, Zh = Fm, Qh = Wm, $h = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Hh,
		...i.platform,
		_c: r
	};
	return Pm(e, t, {
		...i,
		platform: a
	});
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function eg(e) {
	let t = e.whileElementsMounted, n = /* @__PURE__ */ k(() => Qp(e.open) ?? !0), r = /* @__PURE__ */ k(() => Qp(e.middleware)), i = /* @__PURE__ */ k(() => Qp(e.transform) ?? !0), a = /* @__PURE__ */ k(() => Qp(e.placement) ?? "bottom"), o = /* @__PURE__ */ k(() => Qp(e.strategy) ?? "absolute"), s = /* @__PURE__ */ k(() => Qp(e.sideOffset) ?? 0), c = /* @__PURE__ */ k(() => Qp(e.alignOffset) ?? 0), l = e.reference, u = /* @__PURE__ */ j(0), d = /* @__PURE__ */ j(0), f = qa(null), p = /* @__PURE__ */ j(on(B(o))), m = /* @__PURE__ */ j(on(B(a))), h = /* @__PURE__ */ j(on({})), g = /* @__PURE__ */ j(!1), _ = !1, v = 0, y = !1, b = /* @__PURE__ */ k(() => {
		let e = f.current ? em(f.current, B(u)) : B(u), t = f.current ? em(f.current, B(d)) : B(d);
		return B(i) ? {
			position: B(p),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...f.current && $p(f.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: B(p),
			left: `${e}px`,
			top: `${t}px`
		};
	}), x;
	function S() {
		if (y || l.current === null || f.current === null) return;
		let e = l.current, t = f.current, i = ++v;
		$h(e, t, {
			middleware: B(r),
			placement: B(a),
			strategy: B(o)
		}).then((r) => {
			if (i === v && l.current === e && f.current === t) {
				if (tg(e)) M(h, {
					...B(h),
					hide: {
						...B(h).hide,
						referenceHidden: !0
					}
				}, !0);
				else {
					if (!B(n) && B(u) !== 0 && B(d) !== 0) {
						let e = Math.max(Math.abs(B(s)), Math.abs(B(c)), 15);
						if (r.x <= e && r.y <= e) return;
					}
					M(u, r.x, !0), M(d, r.y, !0), M(p, r.strategy, !0), M(m, r.placement, !0), M(h, r.middlewareData, !0), M(g, !0);
				}
			}
		});
	}
	function C() {
		typeof x == "function" && (x(), x = void 0), v++;
	}
	function ee() {
		C(), t === void 0 ? S() : B(n) && l.current !== null && f.current !== null && (x = t(l.current, f.current, S));
	}
	function te() {
		!B(n) && f.current === null && M(g, !1);
	}
	function ne() {
		return [
			B(r),
			B(a),
			B(o),
			B(s),
			B(c),
			B(n)
		];
	}
	return I(() => {
		t === void 0 && B(n) && S();
	}), I(ee), I(() => {
		t !== void 0 && (ne(), B(n) && B(g) ? _ ? S() : _ = !0 : _ = !1);
	}), I(te), I(() => () => {
		y = !0, C();
	}), {
		floating: f,
		reference: l,
		get strategy() {
			return B(p);
		},
		get placement() {
			return B(m);
		},
		get middlewareData() {
			return B(h);
		},
		get isPositioned() {
			return B(g);
		},
		get floatingStyles() {
			return B(b);
		},
		get update() {
			return S;
		}
	};
}
function tg(e) {
	return e instanceof Element ? !e.isConnected || e instanceof HTMLElement && e.hidden ? !0 : e.getClientRects().length === 0 : !1;
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var ng = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, rg = new Po("Floating.Content"), ig = class e {
	static create(t, n = !1) {
		return n ? rg.set(new e(t, Jp.get())) : rg.set(new e(t, qp.get()));
	}
	opts;
	root;
	contentRef = qa(null);
	wrapperRef = qa(null);
	arrowRef = qa(null);
	contentAttachment = ns(this.contentRef);
	wrapperAttachment = ns(this.wrapperRef);
	arrowAttachment = ns(this.arrowRef);
	arrowId = qa(nl());
	#e = /* @__PURE__ */ k(() => {
		if (typeof this.opts.style == "string") return xo(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new Bo(() => this.arrowRef.current ?? void 0);
	#r = /* @__PURE__ */ k(() => this.#n?.width ?? 0);
	#i = /* @__PURE__ */ k(() => this.#n?.height ?? 0);
	#a = /* @__PURE__ */ k(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = /* @__PURE__ */ k(() => (Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]).filter(Ss));
	#s = /* @__PURE__ */ k(() => B(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return B(this.#s);
	}
	set hasExplicitBoundaries(e) {
		M(this.#s, e);
	}
	#c = /* @__PURE__ */ k(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: B(this.#o),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return B(this.#c);
	}
	set detectOverflowOptions(e) {
		M(this.#c, e);
	}
	#l = /* @__PURE__ */ j(void 0);
	#u = /* @__PURE__ */ j(void 0);
	#d = /* @__PURE__ */ j(void 0);
	#f = /* @__PURE__ */ j(void 0);
	#p = /* @__PURE__ */ k(() => [
		Kh({
			mainAxis: this.opts.sideOffset.current + B(this.#i),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && qh({
			mainAxis: !0,
			crossAxis: !1,
			limiter: this.opts.sticky.current === "partial" ? Qh() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && Jh({ ...this.detectOverflowOptions }),
		Yh({
			...this.detectOverflowOptions,
			apply: ({ rects: e, availableWidth: t, availableHeight: n }) => {
				let { width: r, height: i } = e.reference;
				M(this.#l, t, !0), M(this.#u, n, !0), M(this.#d, r, !0), M(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && Zh({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		ag({
			arrowWidth: B(this.#r),
			arrowHeight: B(this.#i)
		}),
		this.opts.hideWhenDetached.current && Xh({
			strategy: "referenceHidden",
			...this.detectOverflowOptions,
			boundary: this.hasExplicitBoundaries ? B(this.#o) : "clippingAncestors"
		})
	].filter(Boolean));
	get middleware() {
		return B(this.#p);
	}
	set middleware(e) {
		M(this.#p, e);
	}
	floating;
	#m = /* @__PURE__ */ k(() => sg(this.floating.placement));
	get placedSide() {
		return B(this.#m);
	}
	set placedSide(e) {
		M(this.#m, e);
	}
	#h = /* @__PURE__ */ k(() => cg(this.floating.placement));
	get placedAlign() {
		return B(this.#h);
	}
	set placedAlign(e) {
		M(this.#h, e);
	}
	#g = /* @__PURE__ */ k(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return B(this.#g);
	}
	set arrowX(e) {
		M(this.#g, e);
	}
	#_ = /* @__PURE__ */ k(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return B(this.#_);
	}
	set arrowY(e) {
		M(this.#_, e);
	}
	#v = /* @__PURE__ */ k(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return B(this.#v);
	}
	set cannotCenterArrow(e) {
		M(this.#v, e);
	}
	#y = /* @__PURE__ */ j("auto");
	get contentZIndex() {
		return B(this.#y);
	}
	set contentZIndex(e) {
		M(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ k(() => ng[this.placedSide]);
	get arrowBaseSide() {
		return B(this.#b);
	}
	set arrowBaseSide(e) {
		M(this.#b, e);
	}
	#x = /* @__PURE__ */ k(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${B(this.#l)}px`,
			"--bits-floating-available-height": `${B(this.#u)}px`,
			"--bits-floating-anchor-width": `${B(this.#d)}px`,
			"--bits-floating-anchor-height": `${B(this.#f)}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...B(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return B(this.#x);
	}
	set wrapperProps(e) {
		M(this.#x, e);
	}
	#S = /* @__PURE__ */ k(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: Eo({ ...B(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return B(this.#S);
	}
	set props(e) {
		M(this.#S, e);
	}
	#C = /* @__PURE__ */ k(() => ({
		position: "absolute",
		left: this.arrowX ? `${this.arrowX}px` : void 0,
		top: this.arrowY ? `${this.arrowY}px` : void 0,
		[this.arrowBaseSide]: 0,
		"transform-origin": {
			top: "",
			right: "0 0",
			bottom: "center 0",
			left: "100% 0"
		}[this.placedSide],
		transform: {
			top: "translateY(100%)",
			right: "translateY(50%) rotate(90deg) translateX(-50%)",
			bottom: "rotate(180deg)",
			left: "translateY(50%) rotate(-90deg) translateX(50%)"
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? "hidden" : void 0
	}));
	get arrowStyle() {
		return B(this.#C);
	}
	set arrowStyle(e) {
		M(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), Lo(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = eg({
			strategy: () => this.opts.strategy.current,
			placement: () => B(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => Gh(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), I(() => {
			this.floating.isPositioned && this.opts.onPlaced?.current();
		}), Lo([() => this.contentRef.current, () => this.opts.enabled.current], ([e, t]) => {
			if (!e || !t) return;
			let n = $o(e), r = n.requestAnimationFrame(() => {
				if (this.contentRef.current !== e || !this.opts.enabled.current) return;
				let t = n.getComputedStyle(e).zIndex;
				t !== this.contentZIndex && (this.contentZIndex = t);
			});
			return () => {
				n.cancelAnimationFrame(r);
			};
		}), I(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}
};
function ag(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = og(n), u = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[l], d = (i.arrow?.x ?? 0) + o / 2, f = (i.arrow?.y ?? 0) + s / 2, p = "", m = "";
			return c === "bottom" ? (p = a ? u : `${d}px`, m = `${-s}px`) : c === "top" ? (p = a ? u : `${d}px`, m = `${r.floating.height + s}px`) : c === "right" ? (p = `${-s}px`, m = a ? u : `${f}px`) : c === "left" && (p = `${r.floating.width + s}px`, m = a ? u : `${f}px`), { data: {
				x: p,
				y: m
			} };
		}
	};
}
function og(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
function sg(e) {
	return og(e)[0];
}
function cg(e) {
	return og(e)[1];
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
function lg(e, t) {
	D(t, !0);
	let n = Y(t, "side", 3, "bottom"), r = Y(t, "sideOffset", 3, 0), i = Y(t, "align", 3, "center"), a = Y(t, "alignOffset", 3, 0), o = Y(t, "arrowPadding", 3, 0), s = Y(t, "avoidCollisions", 3, !0), c = Y(t, "collisionBoundary", 19, () => []), l = Y(t, "collisionPadding", 3, 0), u = Y(t, "hideWhenDetached", 3, !1), d = Y(t, "onPlaced", 3, () => {}), f = Y(t, "sticky", 3, "partial"), p = Y(t, "updatePositionStrategy", 3, "optimized"), m = Y(t, "strategy", 3, "fixed"), h = Y(t, "dir", 3, "ltr"), _ = Y(t, "style", 19, () => ({})), v = Y(t, "wrapperId", 19, nl), y = Y(t, "customAnchor", 3, null), b = Y(t, "tooltip", 3, !1), x = ig.create({
		side: X(() => n()),
		sideOffset: X(() => r()),
		align: X(() => i()),
		alignOffset: X(() => a()),
		id: X(() => t.id),
		arrowPadding: X(() => o()),
		avoidCollisions: X(() => s()),
		collisionBoundary: X(() => c()),
		collisionPadding: X(() => l()),
		hideWhenDetached: X(() => u()),
		onPlaced: X(() => d()),
		sticky: X(() => f()),
		updatePositionStrategy: X(() => p()),
		strategy: X(() => m()),
		dir: X(() => h()),
		style: X(() => _()),
		enabled: X(() => t.enabled),
		wrapperId: X(() => v()),
		customAnchor: X(() => y())
	}, V(() => b())), S = /* @__PURE__ */ k(() => Z(x.wrapperProps, { style: { pointerEvents: "auto" } }));
	var C = U();
	K(P(C), () => t.content ?? g, () => ({
		props: x.props,
		wrapperProps: B(S)
	})), W(e, C), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function ug(e, t) {
	D(t, !0), ci(() => {
		t.onPlaced?.();
	});
	var n = U();
	K(P(n), () => t.content ?? g, () => ({
		props: {},
		wrapperProps: {}
	})), W(e, n), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
var dg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"content",
	"isStatic",
	"onPlaced"
]);
function fg(e, t) {
	let n = Y(t, "isStatic", 3, !1), r = /* @__PURE__ */ pa(t, dg);
	var i = U(), a = P(i), o = (e) => {
		ug(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, s = (e) => {
		lg(e, ha({
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		}, () => r));
	};
	q(a, (e) => {
		n() ? e(o) : e(s, -1);
	}), W(e, i);
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var pg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.forceMount.ref.tooltip.contentPointerEvents".split(".")), mg = /* @__PURE__ */ H("<!> <!>", 1);
function hg(e, t) {
	D(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = Y(t, "tooltip", 3, !1), c = Y(t, "contentPointerEvents", 3, "auto"), l = /* @__PURE__ */ pa(t, pg), u = /* @__PURE__ */ k(() => t.preventScroll ?? !0), d = /* @__PURE__ */ k(() => t.strategy ?? (B(u) ? "fixed" : "absolute"));
	fg(e, {
		get isStatic() {
			return o();
		},
		get id() {
			return t.id;
		},
		get side() {
			return t.side;
		},
		get sideOffset() {
			return t.sideOffset;
		},
		get align() {
			return t.align;
		},
		get alignOffset() {
			return t.alignOffset;
		},
		get arrowPadding() {
			return t.arrowPadding;
		},
		get avoidCollisions() {
			return t.avoidCollisions;
		},
		get collisionBoundary() {
			return t.collisionBoundary;
		},
		get collisionPadding() {
			return t.collisionPadding;
		},
		get sticky() {
			return t.sticky;
		},
		get hideWhenDetached() {
			return t.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return t.updatePositionStrategy;
		},
		get strategy() {
			return B(d);
		},
		get dir() {
			return t.dir;
		},
		get wrapperId() {
			return t.wrapperId;
		},
		get style() {
			return t.style;
		},
		get onPlaced() {
			return t.onPlaced;
		},
		get customAnchor() {
			return a();
		},
		get enabled() {
			return t.enabled;
		},
		get tooltip() {
			return s();
		},
		content: (e, a) => {
			let o = () => (a?.()).props, s = () => (a?.()).wrapperProps;
			var d = mg(), f = P(d), p = (e) => {
				vl(e, { get preventScroll() {
					return B(u);
				} });
			}, m = (e) => {
				vl(e, { get preventScroll() {
					return B(u);
				} });
			};
			q(f, (e) => {
				t.forceMount && t.enabled ? e(p) : t.forceMount || e(m, 1);
			}), Jc(F(f, 2), {
				get onOpenAutoFocus() {
					return t.onOpenAutoFocus;
				},
				get onCloseAutoFocus() {
					return t.onCloseAutoFocus;
				},
				get loop() {
					return t.loop;
				},
				get enabled() {
					return t.enabled;
				},
				get trapFocus() {
					return r();
				},
				get forceMount() {
					return t.forceMount;
				},
				get ref() {
					return t.ref;
				},
				focusScope: (e, r) => {
					let a = () => (r?.()).props;
					dc(e, {
						get onEscapeKeydown() {
							return t.onEscapeKeydown;
						},
						get escapeKeydownBehavior() {
							return t.escapeKeydownBehavior;
						},
						get enabled() {
							return t.enabled;
						},
						get ref() {
							return t.ref;
						},
						children: (e, r) => {
							cc(e, {
								get id() {
									return t.id;
								},
								get onInteractOutside() {
									return t.onInteractOutside;
								},
								get onFocusOutside() {
									return t.onFocusOutside;
								},
								get interactOutsideBehavior() {
									return n();
								},
								get isValidEvent() {
									return i();
								},
								get enabled() {
									return t.enabled;
								},
								get ref() {
									return t.ref;
								},
								children: (e, n) => {
									let r = () => (n?.()).props;
									tl(e, {
										get id() {
											return t.id;
										},
										get preventOverflowTextSelection() {
											return t.preventOverflowTextSelection;
										},
										get onPointerDown() {
											return t.onPointerDown;
										},
										get onPointerUp() {
											return t.onPointerUp;
										},
										get enabled() {
											return t.enabled;
										},
										get ref() {
											return t.ref;
										},
										children: (e, n) => {
											var i = U(), u = P(i);
											{
												let e = /* @__PURE__ */ k(() => ({
													props: Z(l, o(), r(), a(), {
														id: t.id,
														style: { pointerEvents: c() }
													}),
													wrapperProps: s()
												}));
												K(u, () => t.popper ?? g, () => B(e));
											}
											W(e, i);
										},
										$$slots: { default: !0 }
									});
								},
								$$slots: { default: !0 }
							});
						},
						$$slots: { default: !0 }
					});
				},
				$$slots: { focusScope: !0 }
			}), W(e, d);
		},
		$$slots: { content: !0 }
	}), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var gg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function _g(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ pa(t, gg);
	var c = U(), l = P(c), u = (e) => {
		hg(e, ha({
			get popper() {
				return t.popper;
			},
			get onEscapeKeydown() {
				return t.onEscapeKeydown;
			},
			get escapeKeydownBehavior() {
				return t.escapeKeydownBehavior;
			},
			get preventOverflowTextSelection() {
				return t.preventOverflowTextSelection;
			},
			get id() {
				return t.id;
			},
			get onPointerDown() {
				return t.onPointerDown;
			},
			get onPointerUp() {
				return t.onPointerUp;
			},
			get side() {
				return t.side;
			},
			get sideOffset() {
				return t.sideOffset;
			},
			get align() {
				return t.align;
			},
			get alignOffset() {
				return t.alignOffset;
			},
			get arrowPadding() {
				return t.arrowPadding;
			},
			get avoidCollisions() {
				return t.avoidCollisions;
			},
			get collisionBoundary() {
				return t.collisionBoundary;
			},
			get collisionPadding() {
				return t.collisionPadding;
			},
			get sticky() {
				return t.sticky;
			},
			get hideWhenDetached() {
				return t.hideWhenDetached;
			},
			get updatePositionStrategy() {
				return t.updatePositionStrategy;
			},
			get strategy() {
				return t.strategy;
			},
			get dir() {
				return t.dir;
			},
			get preventScroll() {
				return t.preventScroll;
			},
			get wrapperId() {
				return t.wrapperId;
			},
			get style() {
				return t.style;
			},
			get onPlaced() {
				return t.onPlaced;
			},
			get customAnchor() {
				return a();
			},
			get isStatic() {
				return o();
			},
			get enabled() {
				return t.open;
			},
			get onInteractOutside() {
				return t.onInteractOutside;
			},
			get onCloseAutoFocus() {
				return t.onCloseAutoFocus;
			},
			get onOpenAutoFocus() {
				return t.onOpenAutoFocus;
			},
			get interactOutsideBehavior() {
				return n();
			},
			get loop() {
				return t.loop;
			},
			get trapFocus() {
				return r();
			},
			get isValidEvent() {
				return i();
			},
			get onFocusOutside() {
				return t.onFocusOutside;
			},
			forceMount: !1,
			get ref() {
				return t.ref;
			}
		}, () => s));
	};
	q(l, (e) => {
		t.shouldRender && e(u);
	}), W(e, c);
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var vg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function yg(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ pa(t, vg);
	hg(e, ha({
		get popper() {
			return t.popper;
		},
		get onEscapeKeydown() {
			return t.onEscapeKeydown;
		},
		get escapeKeydownBehavior() {
			return t.escapeKeydownBehavior;
		},
		get preventOverflowTextSelection() {
			return t.preventOverflowTextSelection;
		},
		get id() {
			return t.id;
		},
		get onPointerDown() {
			return t.onPointerDown;
		},
		get onPointerUp() {
			return t.onPointerUp;
		},
		get side() {
			return t.side;
		},
		get sideOffset() {
			return t.sideOffset;
		},
		get align() {
			return t.align;
		},
		get alignOffset() {
			return t.alignOffset;
		},
		get arrowPadding() {
			return t.arrowPadding;
		},
		get avoidCollisions() {
			return t.avoidCollisions;
		},
		get collisionBoundary() {
			return t.collisionBoundary;
		},
		get collisionPadding() {
			return t.collisionPadding;
		},
		get sticky() {
			return t.sticky;
		},
		get hideWhenDetached() {
			return t.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return t.updatePositionStrategy;
		},
		get strategy() {
			return t.strategy;
		},
		get dir() {
			return t.dir;
		},
		get preventScroll() {
			return t.preventScroll;
		},
		get wrapperId() {
			return t.wrapperId;
		},
		get style() {
			return t.style;
		},
		get onPlaced() {
			return t.onPlaced;
		},
		get customAnchor() {
			return a();
		},
		get isStatic() {
			return o();
		},
		get enabled() {
			return t.enabled;
		},
		get onInteractOutside() {
			return t.onInteractOutside;
		},
		get onCloseAutoFocus() {
			return t.onCloseAutoFocus;
		},
		get onOpenAutoFocus() {
			return t.onOpenAutoFocus;
		},
		get interactOutsideBehavior() {
			return n();
		},
		get loop() {
			return t.loop;
		},
		get trapFocus() {
			return r();
		},
		get isValidEvent() {
			return i();
		},
		get onFocusOutside() {
			return t.onFocusOutside;
		}
	}, () => s, { forceMount: !0 }));
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var bg = cs({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), xg = new Po("DateField.Root"), Sg = class e {
	static create(t, n) {
		return xg.set(new e(t, n));
	}
	value;
	placeholder;
	validate;
	minValue;
	maxValue;
	disabled;
	readonly;
	granularity;
	readonlySegments;
	hourCycle;
	locale;
	hideTimeZone;
	required;
	onInvalid;
	errorMessageId;
	isInvalidProp;
	descriptionId = nl();
	formatter;
	initialSegments;
	#e = /* @__PURE__ */ j();
	get segmentValues() {
		return B(this.#e);
	}
	set segmentValues(e) {
		M(this.#e, e, !0);
	}
	announcer;
	#t = /* @__PURE__ */ k(() => new Set(this.readonlySegments.current));
	get readonlySegmentsSet() {
		return B(this.#t);
	}
	set readonlySegmentsSet(e) {
		M(this.#t, e);
	}
	segmentStates = Yd();
	#n = /* @__PURE__ */ j(null);
	#r = /* @__PURE__ */ j(null);
	#i = /* @__PURE__ */ j(null);
	get descriptionNode() {
		return B(this.#i);
	}
	set descriptionNode(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(null);
	get validationNode() {
		return B(this.#a);
	}
	set validationNode(e) {
		M(this.#a, e, !0);
	}
	states = Yd();
	#o = !1;
	#s = /* @__PURE__ */ j(null);
	get dayPeriodNode() {
		return B(this.#s);
	}
	set dayPeriodNode(e) {
		M(this.#s, e, !0);
	}
	hourInputDayPeriodHint = null;
	rangeRoot = void 0;
	#c = /* @__PURE__ */ j("");
	get name() {
		return B(this.#c);
	}
	set name(e) {
		M(this.#c, e, !0);
	}
	domContext = new ts(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? qa(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = xf({
			initialLocale: this.locale.current,
			monthFormat: X(() => "long"),
			yearFormat: X(() => "numeric")
		}), this.initialSegments = Wd(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = pd(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), I(() => {
			V(() => {
				this.initialSegments = Wd(this.inferredGranularity);
			});
		}), ci(() => {
			this.announcer = pd(this.domContext.getDocument());
		}), Vo(() => {
			t || lf(this.descriptionId, this.domContext.getDocument());
		}), I(() => {
			this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), I(() => {
			if (t) return;
			this.value.current && cf({
				id: V(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = V(() => this.placeholder.current);
			this.value.current && e !== this.value.current && V(() => {
				this.value.current && (this.placeholder.current = this.value.current);
			});
		}), this.value.current && this.syncSegmentValues(this.value.current), I(() => {
			this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#l();
		}), I(() => {
			if (this.value.current === void 0) {
				if (this.#o) {
					this.#o = !1;
					return;
				}
				this.segmentValues = Wd(this.inferredGranularity);
			}
		}), Lo(() => this.validationStatus, () => {
			this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
		});
	}
	setName(e) {
		this.name = e;
	}
	setFieldNode(e) {
		M(this.#n, e, !0);
	}
	getFieldNode() {
		return this.rangeRoot ? this.rangeRoot.fieldNode : B(this.#n);
	}
	setLabelNode(e) {
		M(this.#r, e, !0);
	}
	getLabelNode() {
		return this.rangeRoot ? this.rangeRoot.labelNode : B(this.#r);
	}
	#l() {
		this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
	}
	setValue(e) {
		this.value.current = e;
	}
	syncSegmentValues(e) {
		let t = Od.map((t) => {
			let n = e[t];
			if (t === "month") {
				if (this.states.month.updating) return [t, this.states.month.updating];
				if (n < 10) return [t, `0${n}`];
			}
			if (t === "day") {
				if (this.states.day.updating) return [t, this.states.day.updating];
				if (n < 10) return [t, `0${n}`];
			}
			if (t === "year") {
				if (this.states.year.updating) return [t, this.states.year.updating];
				let e = 4 - `${n}`.length;
				if (e > 0) return [t, `${"0".repeat(e)}${n}`];
			}
			return [t, `${n}`];
		});
		if ("hour" in e) {
			let n = kd.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(_d(e))];
				if (t === "hour") {
					if (this.states.hour.updating) return [t, this.states.hour.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
					if (e[t] === 0 && this.dayPeriodNode) return [t, "12"];
				} else if (t === "minute") {
					if (this.states.minute.updating) return [t, this.states.minute.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
				} else if (t === "second") {
					if (this.states.second.updating) return [t, this.states.second.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
				}
				return [t, `${e[t]}`];
			}), r = [...t, ...n];
			this.segmentValues = Object.fromEntries(r), this.#l();
		} else this.segmentValues = Object.fromEntries(t);
	}
	#u = /* @__PURE__ */ k(() => {
		let e = this.value.current;
		if (!e) return !1;
		let t = this.validate.current?.(e);
		if (t) return {
			reason: "custom",
			message: t
		};
		let n = this.minValue.current;
		if (n && wd(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && wd(r, e) ? { reason: "max" } : !1;
	});
	get validationStatus() {
		return B(this.#u);
	}
	set validationStatus(e) {
		M(this.#u, e);
	}
	#d = /* @__PURE__ */ k(() => this.validationStatus !== !1 && (this.isInvalidProp.current, !0));
	get isInvalid() {
		return B(this.#d);
	}
	set isInvalid(e) {
		M(this.#d, e);
	}
	#f = /* @__PURE__ */ k(() => this.granularity.current || of(this.placeholder.current, this.granularity.current));
	get inferredGranularity() {
		return B(this.#f);
	}
	set inferredGranularity(e) {
		M(this.#f, e);
	}
	#p = /* @__PURE__ */ k(() => this.value.current === void 0 ? this.placeholder.current : this.value.current);
	get dateRef() {
		return B(this.#p);
	}
	set dateRef(e) {
		M(this.#p, e);
	}
	#m = /* @__PURE__ */ k(() => qd({
		segmentValues: this.segmentValues,
		formatter: this.formatter,
		locale: this.locale.current,
		granularity: this.inferredGranularity,
		dateRef: this.dateRef,
		hideTimeZone: this.hideTimeZone.current,
		hourCycle: this.hourCycle.current
	}));
	get allSegmentContent() {
		return B(this.#m);
	}
	set allSegmentContent(e) {
		M(this.#m, e);
	}
	#h = /* @__PURE__ */ k(() => this.allSegmentContent.arr);
	get segmentContents() {
		return B(this.#h);
	}
	set segmentContents(e) {
		M(this.#h, e);
	}
	sharedSegmentAttrs = {
		role: "spinbutton",
		contenteditable: "true",
		tabindex: 0,
		spellcheck: !1,
		inputmode: "numeric",
		autocorrect: "off",
		enterkeyhint: "next",
		style: { caretColor: "transparent" },
		onbeforeinput: (e) => {
			(!e.data || e.data.length <= 1) && e.preventDefault();
		}
	};
	#g(e) {
		return `${e} ${this.getLabelNode()?.id ?? ""}`;
	}
	updateSegment(e, t) {
		let n = this.disabled.current, r = this.readonly.current, i = this.readonlySegmentsSet;
		if (n || r || i.has(e)) return;
		let a = this.segmentValues, o = a, s = this.placeholder.current;
		if (af(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = Cd(_d(s.set({ month: Number.parseInt(t) })));
					Number.parseInt(a.day) > e && (a.day = `${e}`);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "dayPeriod") {
				let t = r(n);
				this.states.dayPeriod.updating = t;
				let i = this.value.current;
				if (i && "hour" in i) {
					let e = i.hour;
					t === "AM" ? e >= 12 && (a.hour = `${e - 12}`) : t === "PM" && e < 12 && (a.hour = `${e + 12}`);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "hour") {
				let t = this.hourInputDayPeriodHint, i = r(t === null ? n : pf(a.hour)), c = i !== null && t !== null ? ff(i, t) : i;
				if (this.states.hour.updating = c, c !== null && a.dayPeriod !== null) {
					if (t !== null) a.dayPeriod = t;
					else {
						let e = this.formatter.dayPeriod(_d(s.set({ hour: Number.parseInt(c) })), this.hourCycle.current);
						(e === "AM" || e === "PM") && (a.dayPeriod = e);
					}
				}
				o = {
					...a,
					[e]: c
				};
			} else if (e === "minute") {
				let t = r(n);
				this.states.minute.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "second") {
				let t = r(n);
				this.states.second.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "year") {
				let t = r(n);
				this.states.year.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "day") {
				let t = r(n);
				this.states.day.updating = t, o = {
					...a,
					[e]: t
				};
			} else {
				let t = r(n);
				o = {
					...a,
					[e]: t
				};
			}
		} else if (Xd(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = Cd(_d(s.set({ month: Number.parseInt(i) })));
				Number.parseInt(a.day) > t && (a.day = `${t}`), o = {
					...a,
					[e]: i
				};
			} else if (e === "year") {
				let t = r(n);
				this.states.year.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "day") {
				let t = r(n);
				this.states.day.updating = t, o = {
					...a,
					[e]: t
				};
			} else o = {
				...a,
				[e]: i
			};
		}
		this.segmentValues = o, rf(o, B(this.#n)) ? this.setValue(nf({
			segmentObj: o,
			fieldNode: B(this.#n),
			dateRef: this.placeholder.current
		})) : (this.value.current !== void 0 && (this.#o = !0), this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": is(this.isInvalid),
			"aria-disabled": rs(this.disabled.current),
			"aria-readonly": rs(this.readonly.current || n),
			"data-invalid": Q(this.isInvalid),
			"data-disabled": Q(this.disabled.current),
			"data-readonly": Q(this.readonly.current || n),
			"data-segment": `${e}`,
			[bg.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = sf(t, B(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, Cg = class e {
	static create(t) {
		return new e(t, xg.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new ts(e.ref), this.root.domContext = this.domContext, this.attachment = ns(e.ref, (e) => this.root.setFieldNode(e)), Lo(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = /* @__PURE__ */ k(() => {
		if (ms && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": B(this.#e),
		"aria-disabled": rs(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": Q(this.root.disabled.current),
		[bg.input]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
}, wg = class e {
	static create() {
		return new e(xg.get());
	}
	root;
	#e = /* @__PURE__ */ k(() => this.root.name !== "");
	get shouldRender() {
		return B(this.#e);
	}
	set shouldRender(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => this.root.value.current ? this.root.value.current.toString() : "");
	get isoValue() {
		return B(this.#t);
	}
	set isoValue(e) {
		M(this.#t, e);
	}
	constructor(e) {
		this.root = e;
	}
	#n = /* @__PURE__ */ k(() => ({
		name: this.root.name,
		value: this.isoValue,
		required: this.root.required.current
	}));
	get props() {
		return B(this.#n);
	}
	set props(e) {
		M(this.#n, e);
	}
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function Tg(e, t) {
	D(t, !0);
	let n = wg.create();
	var r = U(), i = P(r), a = (e) => {
		Kp(e, ha(() => n.props));
	};
	q(i, (e) => {
		n.shouldRender && e(a);
	}), W(e, r), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var Eg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), Dg = /* @__PURE__ */ H("<div><!></div>"), Og = /* @__PURE__ */ H("<!> <!>", 1);
function kg(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = Y(t, "name", 3, ""), o = /* @__PURE__ */ pa(t, Eg), s = Cg.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		name: X(() => a())
	}), c = /* @__PURE__ */ k(() => Z(o, s.props));
	var l = Og(), u = P(l), d = (e) => {
		var n = U();
		K(P(n), () => t.child, () => ({
			props: B(c),
			segments: s.root.segmentContents
		})), W(e, n);
	}, f = (e) => {
		var n = Dg();
		J(n, () => ({ ...B(c) })), K(N(n), () => t.children ?? g, () => ({ segments: s.root.segmentContents })), E(n), W(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), Tg(F(u, 2), {}), W(e, l), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var Ag = new Po("DatePicker.Root"), jg = class e {
	static create(t) {
		return Ag.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/internal/safe-polygon.svelte.js
function Mg(e, t) {
	let [n, r] = e, i = !1, a = t.length;
	for (let e = 0, o = a - 1; e < a; o = e++) {
		let [a, s] = t[e] ?? [0, 0], [c, l] = t[o] ?? [0, 0];
		s >= r != l >= r && n <= (c - a) * (r - s) / (l - s) + a && (i = !i);
	}
	return i;
}
function Ng(e, t) {
	return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom;
}
function Pg(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
var Fg = class {
	#e;
	#t;
	#n;
	#r = null;
	#i = null;
	#a = [];
	#o = null;
	#s = null;
	#c = null;
	#l() {
		this.#s !== null && (cancelAnimationFrame(this.#s), this.#s = null);
	}
	#u() {
		this.#l(), this.#s = requestAnimationFrame(() => {
			this.#s = null, this.#r && this.#i && (this.#m(), this.#e.onPointerExit());
		});
	}
	#d() {
		this.#c !== null && (clearTimeout(this.#c), this.#c = null);
	}
	#f() {
		this.#n !== null && (this.#d(), this.#c = window.setTimeout(() => {
			this.#c = null, this.#r && this.#i && (this.#m(), this.#e.onPointerExit());
		}, this.#n));
	}
	constructor(e) {
		this.#e = e, this.#t = e.buffer ?? 1;
		let t = e.transitIntentTimeout;
		this.#n = typeof t == "number" && t > 0 ? t : null, Lo([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (!e || !t || !n) this.#o = null, this.#m();
			else return this.#o && this.#o !== e && this.#m(), this.#o = e, [
				kr(Qo(e), "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				kr(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (vs(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					vs(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = vs(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				kr(e, "pointerenter", () => {
					this.#m();
				}),
				kr(t, "pointerenter", () => {
					this.#m();
				}),
				kr(t, "pointerleave", (t) => {
					let n = t.relatedTarget;
					vs(n) && e.contains(n) || (this.#r = [t.clientX, t.clientY], this.#i = "trigger", this.#u());
				})
			].reduce((e, t) => () => {
				e(), t();
			}, () => {});
		});
	}
	#p(e, t, n) {
		if (!this.#r || !this.#i) return;
		this.#l(), this.#f();
		let r = t.getBoundingClientRect(), i = n.getBoundingClientRect();
		if (this.#i === "content" && Ng(e, i) || this.#i === "trigger" && Ng(e, r)) {
			this.#m();
			return;
		}
		if (this.#i === "content" && this.#a.length > 0) for (let t of this.#a) {
			let n = t.getBoundingClientRect();
			if (Ng(e, n)) return;
			let i = Pg(r, n), a = this.#h(r, n, i);
			if (a && Mg(e, a)) return;
		}
		let a = Pg(r, i), o = this.#h(r, i, a);
		if (o && Mg(e, o)) return;
		let s = this.#i === "content" ? i : r;
		Mg(e, this.#g(this.#r, s, a, this.#i)) || (this.#m(), this.#e.onPointerExit());
	}
	#m() {
		this.#r = null, this.#i = null, this.#a = [], this.#l(), this.#d();
	}
	#h(e, t, n) {
		let r = this.#t;
		switch (n) {
			case "top": return [
				[Math.min(e.left, t.left) - r, e.top],
				[Math.min(e.left, t.left) - r, t.bottom],
				[Math.max(e.right, t.right) + r, t.bottom],
				[Math.max(e.right, t.right) + r, e.top]
			];
			case "bottom": return [
				[Math.min(e.left, t.left) - r, e.bottom],
				[Math.min(e.left, t.left) - r, t.top],
				[Math.max(e.right, t.right) + r, t.top],
				[Math.max(e.right, t.right) + r, e.bottom]
			];
			case "left": return [
				[e.left, Math.min(e.top, t.top) - r],
				[t.right, Math.min(e.top, t.top) - r],
				[t.right, Math.max(e.bottom, t.bottom) + r],
				[e.left, Math.max(e.bottom, t.bottom) + r]
			];
			case "right": return [
				[e.right, Math.min(e.top, t.top) - r],
				[t.left, Math.min(e.top, t.top) - r],
				[t.left, Math.max(e.bottom, t.bottom) + r],
				[e.right, Math.max(e.bottom, t.bottom) + r]
			];
		}
	}
	#g(e, t, n, r) {
		let i = this.#t * 4, [a, o] = e;
		switch (r === "trigger" ? this.#_(n) : n) {
			case "top": return [
				[a - i, o + i],
				[a + i, o + i],
				[t.right + i, t.bottom],
				[t.right + i, t.top],
				[t.left - i, t.top],
				[t.left - i, t.bottom]
			];
			case "bottom": return [
				[a - i, o - i],
				[a + i, o - i],
				[t.right + i, t.top],
				[t.right + i, t.bottom],
				[t.left - i, t.bottom],
				[t.left - i, t.top]
			];
			case "left": return [
				[a + i, o - i],
				[a + i, o + i],
				[t.right, t.bottom + i],
				[t.left, t.bottom + i],
				[t.left, t.top - i],
				[t.right, t.top - i]
			];
			case "right": return [
				[a - i, o - i],
				[a - i, o + i],
				[t.left, t.bottom + i],
				[t.right, t.bottom + i],
				[t.right, t.top - i],
				[t.left, t.top - i]
			];
		}
	}
	#_(e) {
		switch (e) {
			case "top": return "bottom";
			case "bottom": return "top";
			case "left": return "right";
			case "right": return "left";
		}
	}
}, Ig = cs({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
}), Lg = new Po("Popover.Root"), Rg = class e {
	static create(t) {
		return Lg.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ j(null);
	get contentNode() {
		return B(this.#e);
	}
	set contentNode(e) {
		M(this.#e, e, !0);
	}
	contentPresence;
	#t = /* @__PURE__ */ j(null);
	get triggerNode() {
		return B(this.#t);
	}
	set triggerNode(e) {
		M(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ j(null);
	get overlayNode() {
		return B(this.#n);
	}
	set overlayNode(e) {
		M(this.#n, e, !0);
	}
	overlayPresence;
	#r = /* @__PURE__ */ j(!1);
	get openedViaHover() {
		return B(this.#r);
	}
	set openedViaHover(e) {
		M(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ j(!1);
	get hasInteractedWithContent() {
		return B(this.#i);
	}
	set hasInteractedWithContent(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(!1);
	get hoverCooldown() {
		return B(this.#a);
	}
	set hoverCooldown(e) {
		M(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ j(0);
	get closeDelay() {
		return B(this.#o);
	}
	set closeDelay(e) {
		M(this.#o, e, !0);
	}
	#s = null;
	#c = null;
	constructor(e) {
		this.opts = e, this.contentPresence = new ws({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new ws({
			ref: X(() => this.overlayNode),
			open: this.opts.open
		}), Lo(() => this.opts.open.current, (e) => {
			e || (this.openedViaHover = !1, this.hasInteractedWithContent = !1, this.#l());
		});
	}
	setDomContext(e) {
		this.#c = e;
	}
	#l() {
		this.#s !== null && this.#c && (this.#c.clearTimeout(this.#s), this.#s = null);
	}
	toggleOpen() {
		this.#l(), this.opts.open.current = !this.opts.open.current;
	}
	handleClose() {
		this.#l(), this.opts.open.current && (this.opts.open.current = !1);
	}
	handleHoverOpen() {
		this.#l(), this.opts.open.current || (this.openedViaHover = !0, this.opts.open.current = !0);
	}
	handleHoverClose() {
		this.opts.open.current && this.openedViaHover && !this.hasInteractedWithContent && (this.opts.open.current = !1);
	}
	handleDelayedHoverClose() {
		this.opts.open.current && this.openedViaHover && !this.hasInteractedWithContent && (this.#l(), this.closeDelay <= 0 ? this.opts.open.current = !1 : this.#c && (this.#s = this.#c.setTimeout(() => {
			this.openedViaHover && !this.hasInteractedWithContent && (this.opts.open.current = !1), this.#s = null;
		}, this.closeDelay)));
	}
	cancelDelayedClose() {
		this.#l();
	}
	markInteraction() {
		this.hasInteractedWithContent = !0, this.#l();
	}
}, zg = class e {
	static create(t) {
		return new e(t, Lg.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ j(!1);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref, (e) => this.root.triggerNode = e), this.domContext = new ts(e.ref), this.root.setDomContext(this.domContext), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), Lo(() => this.opts.closeDelay.current, (e) => {
			this.root.closeDelay = e;
		});
	}
	#r() {
		this.#e !== null && (this.domContext.clearTimeout(this.#e), this.#e = null);
	}
	#i() {
		this.#t !== null && (this.domContext.clearTimeout(this.#t), this.#t = null);
	}
	#a() {
		this.#r(), this.#i();
	}
	onpointerenter(e) {
		if (this.opts.disabled.current || !this.opts.openOnHover.current || xs(e) || (M(this.#n, !0), this.#i(), this.root.cancelDelayedClose(), this.root.opts.open.current || this.root.hoverCooldown)) return;
		let t = this.opts.openDelay.current;
		t <= 0 ? this.root.handleHoverOpen() : this.#e = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen(), this.#e = null;
		}, t);
	}
	onpointerleave(e) {
		this.opts.disabled.current || this.opts.openOnHover.current && (xs(e) || (M(this.#n, !1), this.#r(), this.root.hoverCooldown = !1));
	}
	onclick(e) {
		this.opts.disabled.current || e.button === 0 && (this.#a(), B(this.#n) && this.root.opts.open.current && this.root.openedViaHover ? (this.root.openedViaHover = !1, this.root.hasInteractedWithContent = !0) : (B(this.#n) && this.opts.openOnHover.current && this.root.opts.open.current && (this.root.hoverCooldown = !0), this.root.hoverCooldown && !this.root.opts.open.current && (this.root.hoverCooldown = !1), this.root.toggleOpen()));
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.#a(), this.root.toggleOpen());
	}
	#o() {
		if (this.root.opts.open.current && this.root.contentNode?.id) return this.root.contentNode?.id;
	}
	#s = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": rs(this.root.opts.open.current),
		"data-state": as(this.root.opts.open.current),
		"aria-controls": this.#o(),
		[Ig.trigger]: "",
		disabled: this.opts.disabled.current,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return B(this.#s);
	}
	set props(e) {
		M(this.#s, e);
	}
}, Bg = class e {
	static create(t) {
		return new e(t, Lg.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ns(this.opts.ref, (e) => this.root.contentNode = e), this.onpointerdown = this.onpointerdown.bind(this), this.onfocusin = this.onfocusin.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), new Fg({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
			onPointerExit: () => {
				this.root.handleDelayedHoverClose();
			}
		});
	}
	onpointerdown(e) {
		this.root.markInteraction();
	}
	onfocusin(e) {
		let t = e.target;
		vs(t) && Uc(t) && this.root.markInteraction();
	}
	onpointerenter(e) {
		xs(e) || this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		xs(e);
	}
	onInteractOutside = (e) => {
		if (this.opts.onInteractOutside.current(e), e.defaultPrevented || !vs(e.target)) return;
		let t = Ys(e, Ig.selector("trigger"));
		if (!(t && t === this.root.triggerNode)) {
			if (this.opts.customAnchor.current) {
				if (vs(this.opts.customAnchor.current)) {
					if (Js(e, this.opts.customAnchor.current)) return;
				} else if (typeof this.opts.customAnchor.current == "string") {
					let t = document.querySelector(this.opts.customAnchor.current);
					if (t && Js(e, t)) return;
				}
			}
			this.root.handleClose();
		}
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e), e.defaultPrevented || this.root.handleClose();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	get shouldTrapFocus() {
		return !(this.root.openedViaHover && !this.root.hasInteractedWithContent);
	}
	#e = /* @__PURE__ */ k(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return B(this.#e);
	}
	set snippetProps(e) {
		M(this.#e, e);
	}
	#t = /* @__PURE__ */ k(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		"data-state": as(this.root.opts.open.current),
		...os(this.root.contentPresence.transitionStatus),
		[Ig.content]: "",
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		onpointerdown: this.onpointerdown,
		onfocusin: this.onfocusin,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		M(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown
	};
};
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function Vg(e, t) {
	D(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $), a = Y(t, "value", 15), o = Y(t, "onValueChange", 3, $), s = Y(t, "placeholder", 15), c = Y(t, "onPlaceholderChange", 3, $), l = Y(t, "isDateUnavailable", 3, () => !1), u = Y(t, "validate", 3, $), d = Y(t, "onInvalid", 3, $), f = Y(t, "disabled", 3, !1), p = Y(t, "readonly", 3, !1), m = Y(t, "readonlySegments", 19, () => []), h = Y(t, "hideTimeZone", 3, !1), _ = Y(t, "required", 3, !1), v = Y(t, "calendarLabel", 3, "Event"), y = Y(t, "disableDaysOutsideMonth", 3, !0), b = Y(t, "preventDeselect", 3, !1), x = Y(t, "pagedNavigation", 3, !1), S = Y(t, "weekdayFormat", 3, "narrow"), C = Y(t, "isDateDisabled", 3, () => !1), ee = Y(t, "fixedWeeks", 3, !1), te = Y(t, "numberOfMonths", 3, 1), ne = Y(t, "closeOnDateSelect", 3, !0), re = Y(t, "initialFocus", 3, !1), ie = Y(t, "monthFormat", 3, "long"), ae = Y(t, "yearFormat", 3, "numeric"), oe = V(() => hd({
		granularity: t.granularity,
		defaultValue: a(),
		minValue: t.minValue,
		maxValue: t.maxValue
	}));
	function se() {
		s() === void 0 && s(oe);
	}
	se(), Lo.pre(() => s(), () => {
		se();
	});
	function ce() {
		ne() && n(!1);
	}
	let le = jg.create({
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		value: X(() => a(), (e) => {
			a(e), o()(e);
		}),
		placeholder: X(() => s() ?? oe, (e) => {
			s(e), c()(e);
		}),
		isDateUnavailable: X(() => l()),
		minValue: X(() => t.minValue),
		maxValue: X(() => t.maxValue),
		disabled: X(() => f()),
		readonly: X(() => p()),
		granularity: X(() => t.granularity),
		readonlySegments: X(() => m()),
		hourCycle: X(() => t.hourCycle),
		locale: Hs(() => t.locale),
		hideTimeZone: X(() => h()),
		required: X(() => _()),
		calendarLabel: X(() => v()),
		disableDaysOutsideMonth: X(() => y()),
		preventDeselect: X(() => b()),
		pagedNavigation: X(() => x()),
		weekStartsOn: X(() => t.weekStartsOn),
		weekdayFormat: X(() => S()),
		isDateDisabled: X(() => C()),
		fixedWeeks: X(() => ee()),
		numberOfMonths: X(() => te()),
		initialFocus: X(() => re()),
		onDateSelect: X(() => ce),
		defaultPlaceholder: oe,
		monthFormat: X(() => ie()),
		yearFormat: X(() => ae())
	});
	Rg.create({
		open: le.opts.open,
		onOpenChangeComplete: X(() => i())
	}), Sg.create({
		value: le.opts.value,
		disabled: le.opts.disabled,
		readonly: le.opts.readonly,
		readonlySegments: le.opts.readonlySegments,
		validate: X(() => u()),
		onInvalid: X(() => d()),
		minValue: le.opts.minValue,
		maxValue: le.opts.maxValue,
		granularity: le.opts.granularity,
		hideTimeZone: le.opts.hideTimeZone,
		hourCycle: le.opts.hourCycle,
		locale: le.opts.locale,
		required: le.opts.required,
		placeholder: le.opts.placeholder,
		errorMessageId: X(() => t.errorMessageId),
		isInvalidProp: X(() => void 0)
	});
	var ue = U();
	Si(P(ue), () => Zp, (e, n) => {
		n(e, {
			children: (e, n) => {
				var r = U();
				K(P(r), () => t.children ?? g), W(e, r);
			},
			$$slots: { default: !0 }
		});
	}), W(e, ue), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Hg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), Ug = /* @__PURE__ */ H("<div><!></div>");
function Wg(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ pa(t, Hg), o = Ag.get(), s = Qf.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		calendarLabel: o.opts.calendarLabel,
		fixedWeeks: o.opts.fixedWeeks,
		isDateDisabled: o.opts.isDateDisabled,
		isDateUnavailable: o.opts.isDateUnavailable,
		locale: o.opts.locale,
		numberOfMonths: o.opts.numberOfMonths,
		pagedNavigation: o.opts.pagedNavigation,
		preventDeselect: o.opts.preventDeselect,
		readonly: o.opts.readonly,
		type: X(() => "single"),
		weekStartsOn: o.opts.weekStartsOn,
		weekdayFormat: o.opts.weekdayFormat,
		disabled: o.opts.disabled,
		disableDaysOutsideMonth: o.opts.disableDaysOutsideMonth,
		maxValue: o.opts.maxValue,
		minValue: o.opts.minValue,
		placeholder: o.opts.placeholder,
		value: o.opts.value,
		onDateSelect: o.opts.onDateSelect,
		initialFocus: o.opts.initialFocus,
		defaultPlaceholder: o.opts.defaultPlaceholder,
		maxDays: X(() => void 0),
		monthFormat: o.opts.monthFormat,
		yearFormat: o.opts.yearFormat
	}), c = /* @__PURE__ */ k(() => Z(a, s.props));
	var l = U(), u = P(l), d = (e) => {
		var n = U(), r = P(n);
		{
			let e = /* @__PURE__ */ k(() => ({
				props: B(c),
				...s.snippetProps
			}));
			K(r, () => t.child, () => B(e));
		}
		W(e, n);
	}, f = (e) => {
		var n = Ug();
		J(n, () => ({ ...B(c) })), K(N(n), () => t.children ?? g, () => s.snippetProps), E(n), W(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/popover/components/popover-content-static.svelte
var Gg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"ref",
	"id",
	"forceMount",
	"onCloseAutoFocus",
	"onEscapeKeydown",
	"onInteractOutside",
	"trapFocus",
	"preventScroll",
	"style"
]), Kg = /* @__PURE__ */ H("<div><!></div>");
function qg(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ts(n)), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onEscapeKeydown", 3, $), c = Y(t, "onInteractOutside", 3, $), l = Y(t, "trapFocus", 3, !0), u = Y(t, "preventScroll", 3, !1), d = /* @__PURE__ */ pa(t, Gg), f = Bg.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		onInteractOutside: X(() => c()),
		onEscapeKeydown: X(() => s()),
		customAnchor: X(() => null)
	}), p = /* @__PURE__ */ k(() => Z(d, f.props));
	var m = U(), h = P(m), _ = (e) => {
		yg(e, ha(() => B(p), () => f.popperProps, {
			get ref() {
				return f.opts.ref;
			},
			isStatic: !0,
			get enabled() {
				return f.root.opts.open.current;
			},
			get id() {
				return i();
			},
			get trapFocus() {
				return l();
			},
			get preventScroll() {
				return u();
			},
			loop: !0,
			forceMount: !0,
			get onCloseAutoFocus() {
				return o();
			},
			get shouldRender() {
				return f.shouldRender;
			},
			popper: (e, n) => {
				let r = () => (n?.()).props, i = /* @__PURE__ */ k(() => Z(r(), { style: tm("popover") }, { style: t.style }));
				var a = U(), o = P(a), s = (e) => {
					var n = U(), r = P(n);
					{
						let e = /* @__PURE__ */ k(() => ({
							props: B(i),
							...f.snippetProps
						}));
						K(r, () => t.child, () => B(e));
					}
					W(e, n);
				}, c = (e) => {
					var n = Kg();
					J(n, () => ({ ...B(i) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
				};
				q(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), W(e, a);
			},
			$$slots: { popper: !0 }
		}));
	}, v = (e) => {
		_g(e, ha(() => B(p), () => f.popperProps, {
			get ref() {
				return f.opts.ref;
			},
			isStatic: !0,
			get open() {
				return f.root.opts.open.current;
			},
			get id() {
				return i();
			},
			get trapFocus() {
				return l();
			},
			get preventScroll() {
				return u();
			},
			loop: !0,
			forceMount: !1,
			get onCloseAutoFocus() {
				return o();
			},
			get shouldRender() {
				return f.shouldRender;
			},
			popper: (e, n) => {
				let r = () => (n?.()).props, i = /* @__PURE__ */ k(() => Z(r(), { style: tm("popover") }, { style: t.style }));
				var a = U(), o = P(a), s = (e) => {
					var n = U(), r = P(n);
					{
						let e = /* @__PURE__ */ k(() => ({
							props: B(i),
							...f.snippetProps
						}));
						K(r, () => t.child, () => B(e));
					}
					W(e, n);
				}, c = (e) => {
					var n = Kg();
					J(n, () => ({ ...B(i) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
				};
				q(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), W(e, a);
			},
			$$slots: { popper: !0 }
		}));
	};
	q(h, (e) => {
		a() ? e(_) : a() || e(v, 1);
	}), W(e, m), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content-static.svelte
var Jg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function Yg(e, t) {
	D(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ pa(t, Jg), i = /* @__PURE__ */ k(() => Z({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: Wf }));
	qg(e, ha(() => B(i), () => r, {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
var Xg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"type",
	"disabled",
	"openOnHover",
	"openDelay",
	"closeDelay"
]), Zg = /* @__PURE__ */ H("<button><!></button>");
function Qg(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = Y(t, "type", 3, "button"), o = Y(t, "disabled", 3, !1), s = Y(t, "openOnHover", 3, !1), c = Y(t, "openDelay", 3, 700), l = Y(t, "closeDelay", 3, 300), u = /* @__PURE__ */ pa(t, Xg), d = zg.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		disabled: X(() => !!o()),
		openOnHover: X(() => s()),
		openDelay: X(() => c()),
		closeDelay: X(() => l())
	}), f = /* @__PURE__ */ k(() => Z(u, d.props, { type: a() }));
	nm(e, {
		get id() {
			return r();
		},
		get ref() {
			return d.opts.ref;
		},
		children: (e, n) => {
			var r = U(), i = P(r), a = (e) => {
				var n = U();
				K(P(n), () => t.child, () => ({ props: B(f) })), W(e, n);
			}, o = (e) => {
				var n = Zg();
				J(n, () => ({ ...B(f) })), K(N(n), () => t.children ?? g), E(n), W(e, n);
			};
			q(i, (e) => {
				t.child ? e(a) : e(o, -1);
			}), W(e, r);
		},
		$$slots: { default: !0 }
	}), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var $g = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function e_(e, t) {
	D(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ pa(t, $g);
	function i(e) {
		if (vf(e.key)) {
			let t = e.currentTarget.closest(bg.selector("input"));
			if (!t) return;
			mf(e, t);
		}
	}
	let a = /* @__PURE__ */ k(() => Z({ onkeydown: t.onkeydown }, { onkeydown: i }));
	Qg(e, ha(() => r, { "data-segment": "trigger" }, () => B(a), {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function t_(e, t) {
	D(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $);
	Os.create({
		variant: X(() => "dialog"),
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		onOpenChangeComplete: X(() => i())
	});
	var a = U();
	K(P(a), () => t.children ?? g), W(e, a), O();
}
// node_modules/.pnpm/bits-ui@2.20.4_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@sveltejs+vite-plugin_465a4040a643e5d8533384ae5b464e31/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
var n_ = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref",
	"forceMount",
	"onCloseAutoFocus",
	"onOpenAutoFocus",
	"onEscapeKeydown",
	"onInteractOutside",
	"trapFocus",
	"preventScroll",
	"preventOverflowTextSelection",
	"restoreScrollDelay"
]), r_ = /* @__PURE__ */ H("<!> <!>", 1), i_ = /* @__PURE__ */ H("<!> <div><!></div>", 1);
function a_(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "id", 19, () => Ts(n)), i = Y(t, "ref", 15, null), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onOpenAutoFocus", 3, $), c = Y(t, "onEscapeKeydown", 3, $), l = Y(t, "onInteractOutside", 3, $), u = Y(t, "trapFocus", 3, !0), d = Y(t, "preventScroll", 3, !0), f = Y(t, "preventOverflowTextSelection", 3, !0), p = Y(t, "restoreScrollDelay", 3, null), m = /* @__PURE__ */ pa(t, n_), h = js.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), _ = /* @__PURE__ */ k(() => Z(m, h.props));
	var v = U(), y = P(v), b = (e) => {
		Jc(e, {
			get ref() {
				return h.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return u();
			},
			get enabled() {
				return h.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return s();
			},
			get onCloseAutoFocus() {
				return o();
			},
			focusScope: (e, n) => {
				let r = () => (n?.()).props;
				dc(e, ha(() => B(_), {
					get enabled() {
						return h.root.opts.open.current;
					},
					get ref() {
						return h.opts.ref;
					},
					onEscapeKeydown: (e) => {
						c()(e), e.defaultPrevented || h.root.handleClose();
					},
					children: (e, n) => {
						cc(e, ha(() => B(_), {
							get ref() {
								return h.opts.ref;
							},
							get enabled() {
								return h.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								l()(e), e.defaultPrevented || h.root.handleClose();
							},
							children: (e, n) => {
								tl(e, ha(() => B(_), {
									get preventOverflowTextSelection() {
										return f();
									},
									get ref() {
										return h.opts.ref;
									},
									get enabled() {
										return h.root.opts.open.current;
									},
									children: (e, n) => {
										var i = U(), a = P(i), o = (e) => {
											var n = r_(), i = P(n), a = (e) => {
												vl(e, {
													get preventScroll() {
														return d();
													},
													get restoreScrollDelay() {
														return p();
													}
												});
											};
											q(i, (e) => {
												h.root.opts.open.current && e(a);
											});
											var o = F(i, 2);
											{
												let e = /* @__PURE__ */ k(() => ({
													props: Z(B(_), r()),
													...h.snippetProps
												}));
												K(o, () => t.child, () => B(e));
											}
											W(e, n);
										}, s = (e) => {
											var n = i_(), i = P(n);
											vl(i, { get preventScroll() {
												return d();
											} });
											var a = F(i, 2);
											J(a, (e) => ({ ...e }), [() => Z(B(_), r())]), K(N(a), () => t.children ?? g), E(a), W(e, n);
										};
										q(a, (e) => {
											t.child ? e(o) : e(s, -1);
										}), W(e, i);
									},
									$$slots: { default: !0 }
								}));
							},
							$$slots: { default: !0 }
						}));
					},
					$$slots: { default: !0 }
				}));
			},
			$$slots: { focusScope: !0 }
		});
	};
	q(y, (e) => {
		(h.shouldRender || a()) && e(b);
	}), W(e, v), O();
}
// packages/ui-kit/src/form/date-field-utils.ts
var o_ = {
	placeholder: "选择日期",
	today: "今天",
	clear: "清除",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`
};
function s_(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (t) try {
		return Wu(t);
	} catch {
		return;
	}
}
function c_(e) {
	return s_(e) !== void 0;
}
function l_(e) {
	return e ? e.toString() : "";
}
function u_(e) {
	return c_(e) ? va(e.trim()) : "";
}
function d_(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
function f_(e, t) {
	return c_(e) ? e.trim() : t;
}
function p_(e, t, n, r) {
	return c_(e) ? e.trim() : !c_(t) || n && t < n || r && t > r ? "" : t;
}
function m_(e, t, n = o_) {
	let r = u_(t);
	return r ? n.triggerLabeled(e, r) : n.triggerEmpty(e);
}
// packages/ui-kit/src/platform/native-bridge.ts
var h_ = "__CHRONOS_NATIVE__";
function g_() {
	if (typeof window > "u") return null;
	let e = window[h_];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
// packages/ui-kit/src/haptic/haptic.ts
var __ = _a.hapticFeedbackEnabled;
function v_() {
	return g_();
}
function y_() {
	return typeof navigator < "u" && typeof navigator.vibrate == "function";
}
function b_() {
	return y_() ? typeof navigator < "u" && "userActivation" in navigator && navigator.userActivation != null ? navigator.userActivation.hasBeenActive : !0 : !1;
}
function x_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !0;
		let e = localStorage.getItem(Aa(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(__));
		return e !== "0" && e !== "false";
	} catch {
		return !0;
	}
}
function S_(e) {
	if (!b_()) return !1;
	try {
		return navigator.vibrate(e);
	} catch {
		return !1;
	}
}
function C_(e, t) {
	if (!x_()) return !1;
	let n = v_();
	return n ? (n.callNative("haptic", e.method, e.params ?? {}).catch(() => {
		S_(t);
	}), !0) : S_(t);
}
var w_ = {
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
}, T_ = {
	selection() {
		return C_({ method: "selection" }, w_.selection);
	},
	light() {
		return C_({
			method: "vibrate",
			params: { duration: w_.light }
		}, w_.light);
	},
	medium() {
		return C_({
			method: "impact",
			params: { style: "medium" }
		}, w_.medium);
	},
	heavy() {
		return C_({
			method: "impact",
			params: { style: "heavy" }
		}, w_.heavy);
	},
	success() {
		return C_({
			method: "notification",
			params: { type: "success" }
		}, w_.success);
	},
	warning() {
		return C_({
			method: "notification",
			params: { type: "warning" }
		}, w_.warning);
	},
	cancel() {
		if (b_()) try {
			return navigator.vibrate(0);
		} catch {
			return !1;
		}
		return !1;
	}
}, E_ = /* @__PURE__ */ H("<span class=\"ml-0.5 text-error\">*</span>"), D_ = /* @__PURE__ */ H("<p class=\"text-body-small text-supporting mt-1 text-on-surface-variant\"> </p>"), O_ = /* @__PURE__ */ H("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> <!></h3> <!></div>"), k_ = /* @__PURE__ */ H("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> <!></button>"), A_ = /* @__PURE__ */ H("<button><span> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z\"></path></svg></span></button>"), j_ = /* @__PURE__ */ H("<div><!></div>"), M_ = /* @__PURE__ */ H("<div aria-hidden=\"true\" class=\"date-picker-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50\"></div>"), N_ = /* @__PURE__ */ Vr("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path></svg>"), P_ = /* @__PURE__ */ Vr("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path></svg>"), F_ = /* @__PURE__ */ H("<!> <!> <!>", 1), I_ = /* @__PURE__ */ H("<div> </div>"), L_ = /* @__PURE__ */ H("<div></div>"), R_ = /* @__PURE__ */ H("<div><!> <!></div>"), z_ = /* @__PURE__ */ H("<!> <!> <div class=\"mt-3 flex items-center justify-between gap-2 border-t border-outline-variant/40 pt-3\"><div><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-brand hover:bg-brand/10 active:bg-brand/20 disabled:opacity-40\"> </button></div> <div class=\"flex items-center gap-1\"><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-on-surface-variant hover:bg-on-surface/5 disabled:opacity-40\"> </button> <button type=\"button\" class=\"text-label-large h-9 rounded-full bg-brand px-4 text-on-primary active:opacity-90 disabled:opacity-40\"> </button></div></div>", 1), B_ = /* @__PURE__ */ H("<!> <!>", 1), V_ = /* @__PURE__ */ H("<div><!> <!> <!></div>");
function H_(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "value", 15, ""), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "calendarLabel", 19, () => t.label), s = Y(t, "labels", 3, o_), c = Y(t, "required", 3, !1), l = Y(t, "variant", 3, "field"), u = Y(t, "locale", 3, "zh-CN"), d = /* @__PURE__ */ k(() => t.id ?? n), f = /* @__PURE__ */ k(() => `${B(d)}-label`), p = /* @__PURE__ */ k(() => l() === "section"), m = /* @__PURE__ */ j(!1), h = Ra({
		overlayId: `date-field-${n}`,
		get port() {
			return t.historyPort;
		},
		parent: $e(La),
		setOpen: (e) => {
			M(m, e, !0);
		}
	});
	et(La, h), I(() => h.syncOpenState(B(m))), li(() => h.dispose());
	let g = /* @__PURE__ */ j(""), _ = /* @__PURE__ */ j(void 0), v = /* @__PURE__ */ k(() => typeof r() == "string" ? r() : ""), y = /* @__PURE__ */ k(() => u_(B(v))), b = /* @__PURE__ */ k(() => m_(t.label, B(m) ? B(g) : B(v), s())), x = /* @__PURE__ */ k(() => s_(B(g))), S = /* @__PURE__ */ k(() => t.min ? s_(t.min) : void 0), C = /* @__PURE__ */ k(() => t.max ? s_(t.max) : void 0), ee = Bl(Kl()).toString(), te = /* @__PURE__ */ k(() => !!(t.min && ee < t.min || t.max && ee > t.max));
	function ne(e) {
		if (e) {
			let e = Bl(Kl()).toString();
			M(g, p_(B(v), e, t.min, t.max), !0), M(_, s_(f_(B(g), e)), !0);
		}
	}
	function re() {
		a() || (ne(!0), M(m, !0));
	}
	function ie(e) {
		let t = l_(e);
		t !== B(g) && (T_.light(), M(g, t, !0));
	}
	function ae() {
		(!c() || B(g)) && (T_.light(), B(g) !== B(v) && (r(B(g)), t.onValueChange?.(B(g))), M(m, !1));
	}
	function oe() {
		let e = Bl(Kl()), n = e.toString();
		t.min && n < t.min || t.max && n > t.max || (T_.light(), M(g, l_(e), !0), M(_, e, !0));
	}
	function se() {
		c() || (T_.light(), M(g, ""));
	}
	function ce() {
		T_.light();
	}
	var le = R_(), ue = N(le), de = (e) => {
		var n = O_(), r = N(n), i = N(r), a = F(i), o = (e) => {
			W(e, E_());
		};
		q(a, (e) => {
			c() && e(o);
		}), E(r);
		var s = F(r, 2), l = (e) => {
			var n = D_(), r = _n(n, !0);
			L(() => G(r, t.description)), W(e, n);
		};
		q(s, (e) => {
			t.description && e(l);
		}), E(n), L(() => {
			$i(r, "id", B(f)), G(i, `${t.label ?? ""} `);
		}), W(e, n);
	};
	q(ue, (e) => {
		B(p) && e(de);
	}), Si(F(ue, 2), () => Vg, (e, n) => {
		n(e, {
			onOpenChange: ne,
			get value() {
				return B(x);
			},
			onValueChange: ie,
			closeOnDateSelect: !1,
			get locale() {
				return u();
			},
			weekdayFormat: "narrow",
			weekStartsOn: 1,
			fixedWeeks: !0,
			get minValue() {
				return B(S);
			},
			get maxValue() {
				return B(C);
			},
			get disabled() {
				return a();
			},
			get calendarLabel() {
				return o();
			},
			get open() {
				return B(m);
			},
			set open(e) {
				M(m, e, !0);
			},
			get placeholder() {
				return B(_);
			},
			set placeholder(e) {
				M(_, e, !0);
			},
			children: (e, n) => {
				var r = V_(), o = N(r), l = (e) => {
					var n = k_(), r = N(n), i = F(r), o = (e) => {
						W(e, E_());
					};
					q(i, (e) => {
						c() && e(o);
					}), E(n), L(() => {
						$i(n, "id", B(f)), n.disabled = a(), G(r, `${t.label ?? ""} `);
					}), jr("click", n, re), W(e, n);
				};
				q(o, (e) => {
					B(p) || e(l);
				});
				var u = F(o, 2);
				{
					let e = (e, t) => {
						let n = () => (t?.()).props;
						var r = j_();
						J(r, () => ({
							...n(),
							id: B(d)
						}));
						var i = N(r);
						{
							let e = (e, t) => {
								let n = () => (t?.()).props;
								var r = A_();
								J(r, () => ({
									...n(),
									type: "button",
									class: "ui-form-field-input ui-date-field-input",
									"aria-label": B(b),
									disabled: a()
								}));
								var i = N(r), o = _n(i, !0);
								Oe(2), E(r), L(() => {
									Ni(i, 1, Di(["ui-date-field-value text-body-large truncate text-left", B(y) ? "text-on-surface" : "text-on-surface-variant/60"])), G(o, B(y) || s().placeholder);
								}), W(e, r);
							};
							Si(i, () => e_, (t, n) => {
								n(t, {
									child: e,
									$$slots: { child: !0 }
								});
							});
						}
						E(r), W(e, r);
					};
					Si(u, () => kg, (t, n) => {
						n(t, {
							get "aria-labelledby"() {
								return B(f);
							},
							child: e,
							$$slots: { child: !0 }
						});
					});
				}
				Si(F(u, 2), () => Ws, (e, t) => {
					t(e, {
						children: (e, t) => {
							var n = B_(), r = P(n), i = (e) => {
								W(e, M_());
							};
							q(r, (e) => {
								B(m) && e(i);
							}), Si(F(r, 2), () => Yg, (e, t) => {
								t(e, {
									class: "ui-overlay-surface ui-date-picker-content fixed top-1/2 left-1/2 z-[var(--z-overlay)] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface-container-high p-4 text-on-surface shadow-overlay outline-none",
									children: (e, t) => {
										var n = U(), r = P(n);
										{
											let e = (e, t) => {
												let n = () => (t?.()).months, r = () => (t?.()).weekdays;
												var i = z_(), a = P(i);
												Si(a, () => Pp, (e, t) => {
													t(e, {
														class: "mb-3 flex items-center justify-between gap-2",
														children: (e, t) => {
															var n = F_(), r = P(n);
															Si(r, () => Up, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: ce,
																	children: (e, t) => {
																		W(e, N_());
																	},
																	$$slots: { default: !0 }
																});
															});
															var i = F(r, 2);
															Si(i, () => Lp, (e, t) => {
																t(e, { class: "text-title-small text-on-surface" });
															}), Si(F(i, 2), () => Bp, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: ce,
																	children: (e, t) => {
																		W(e, P_());
																	},
																	$$slots: { default: !0 }
																});
															}), W(e, n);
														},
														$$slots: { default: !0 }
													});
												});
												var o = F(a, 2);
												gi(o, 17, n, (e) => e.value, (e, t) => {
													var n = U(), i = P(n);
													{
														let e = (e, n) => {
															let i = () => (n?.()).props;
															var a = R_();
															J(a, () => ({
																...i(),
																class: "w-full"
															}));
															var o = N(a);
															{
																let e = (e, t) => {
																	let n = () => (t?.()).props;
																	var i = j_();
																	J(i, () => ({ ...n() }));
																	var a = N(i);
																	{
																		let e = (e, t) => {
																			let n = () => (t?.()).props;
																			var i = L_();
																			J(i, () => ({
																				...n(),
																				role: "row",
																				class: "mb-1 grid grid-cols-7"
																			})), gi(i, 23, r, (e, t) => `${t}-${e}`, (e, t) => {
																				var n = U(), r = P(n);
																				{
																					let e = (e, n) => {
																						let r = () => (n?.()).props;
																						var i = I_();
																						J(i, () => ({
																							...r(),
																							role: "columnheader",
																							class: "text-label-small flex h-10 w-full items-center justify-center text-on-surface-variant"
																						}));
																						var a = _n(i, !0);
																						L(() => G(a, B(t))), W(e, i);
																					};
																					Si(r, () => Op, (t, n) => {
																						n(t, {
																							child: e,
																							$$slots: { child: !0 }
																						});
																					});
																				}
																				W(e, n);
																			}), E(i), W(e, i);
																		};
																		Si(a, () => jp, (t, n) => {
																			n(t, {
																				child: e,
																				$$slots: { child: !0 }
																			});
																		});
																	}
																	E(i), W(e, i);
																};
																Si(o, () => Tp, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															var s = F(o, 2);
															{
																let e = (e, n) => {
																	let r = () => (n?.()).props;
																	var i = L_();
																	J(i, () => ({ ...r() })), gi(i, 20, () => B(t).weeks, (e) => e, (e, n) => {
																		var r = U(), i = P(r);
																		{
																			let e = (e, r) => {
																				let i = () => (r?.()).props;
																				var a = L_();
																				J(a, () => ({
																					...i(),
																					role: "row",
																					class: "grid grid-cols-7"
																				})), gi(a, 20, () => n, (e) => e, (e, n) => {
																					var r = U(), i = P(r);
																					{
																						let e = (e, t) => {
																							let r = () => (t?.()).props;
																							var i = j_();
																							J(i, () => ({
																								...r(),
																								class: "flex h-10 w-full items-center justify-center p-0"
																							})), Si(N(i), () => pp, (e, t) => {
																								t(e, {
																									class: "ui-date-picker-day text-body-medium inline-flex size-10 items-center justify-center rounded-full border border-transparent text-on-surface transition-colors hover:bg-on-surface/5 data-disabled:pointer-events-none data-disabled:text-on-surface/30 data-outside-month:text-on-surface-variant/50 data-selected:bg-brand data-selected:font-semibold data-selected:text-on-primary data-unavailable:text-on-surface-variant data-unavailable:line-through",
																									children: (e, t) => {
																										Oe();
																										var r = Hr();
																										L(() => G(r, n.day)), W(e, r);
																									},
																									$$slots: { default: !0 }
																								});
																							}), E(i), W(e, i);
																						};
																						Si(i, () => Sp, (r, i) => {
																							i(r, {
																								get date() {
																									return n;
																								},
																								get month() {
																									return B(t).value;
																								},
																								child: e,
																								$$slots: { child: !0 }
																							});
																						});
																					}
																					W(e, r);
																				}), E(a), W(e, a);
																			};
																			Si(i, () => jp, (t, n) => {
																				n(t, {
																					child: e,
																					$$slots: { child: !0 }
																				});
																			});
																		}
																		W(e, r);
																	}), E(i), W(e, i);
																};
																Si(s, () => yp, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															E(a), W(e, a);
														};
														Si(i, () => gp, (t, n) => {
															n(t, {
																class: "w-full",
																child: e,
																$$slots: { child: !0 }
															});
														});
													}
													W(e, n);
												});
												var l = F(o, 2), u = N(l), d = N(u), f = _n(d, !0);
												E(u);
												var p = F(u, 2), m = N(p), h = _n(m, !0), _ = F(m, 2), v = _n(_, !0);
												E(p), E(l), L(() => {
													d.disabled = B(te), G(f, s().today), m.disabled = c() || !B(g), G(h, s().clear), _.disabled = c() && !B(g), G(v, s().confirm);
												}), jr("click", d, oe), jr("click", m, se), jr("click", _, ae), W(e, i);
											};
											Si(r, () => Wg, (t, n) => {
												n(t, {
													class: "flex w-full flex-col",
													children: e,
													$$slots: { default: !0 }
												});
											});
										}
										W(e, n);
									},
									$$slots: { default: !0 }
								});
							}), W(e, n);
						},
						$$slots: { default: !0 }
					});
				}), E(r), L(() => Ni(r, 1, Di(B(p) ? "ui-form-field" : ["ui-form-field", i()]))), W(e, r);
			},
			$$slots: { default: !0 }
		});
	}), E(le), L(() => Ni(le, 1, Di(B(p) ? ["flex flex-col gap-3", i()] : void 0))), W(e, le), O();
}
// packages/ui-kit/src/components/SegmentedControl.svelte
Mr(["click"]), Mr(["click", "keydown"]);
// packages/ui-kit/src/form/time-wheel-utils.ts
var U_ = {
	placeholder: "选择时间",
	hour: "时",
	minute: "分",
	cancel: "取消",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`,
	columnAria: (e, t) => `${e}${t}`
};
function W_(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}`;
}
function G_(e) {
	return !!(e && Number.isInteger(e.hour) && e.hour >= 0 && e.hour <= 23 && Number.isInteger(e.minute) && e.minute >= 0 && e.minute <= 59);
}
function K_(e, t, n = U_) {
	return G_(t) ? n.triggerLabeled(e, W_(t)) : n.triggerEmpty(e);
}
function q_() {
	return Array.from({ length: 24 }, (e, t) => t);
}
function J_() {
	return Array.from({ length: 60 }, (e, t) => t);
}
function Y_(e, t, n = 40) {
	return Math.min(Math.max(Math.round(e / n), 0), t);
}
// packages/ui-kit/src/motion/motion.ts
var X_ = _a.reduceMotionEnabled;
function Z_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !1;
		let e = localStorage.getItem(Aa(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(X_));
		return e === "1" || e === "true";
	} catch {
		return !1;
	}
}
function Q_() {
	if (typeof window > "u") return !1;
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
}
function $_() {
	return Z_() || Q_();
}
// packages/ui-kit/src/motion/gesture-motion.ts
function ev() {
	let e = [];
	return {
		reset(t, n = performance.now()) {
			e = [{
				position: t,
				time: n
			}];
		},
		add(t, n = performance.now()) {
			let r = e.at(-1), i = e.at(-2);
			for (r && i && (t - r.position) * (r.position - i.position) < 0 && (e = [r]), r?.time === n ? r.position = t : e.push({
				position: t,
				time: n
			}); e.length > 1 && e[0].time < n - 80;) e.shift();
		},
		velocity(t = performance.now()) {
			let n = e.at(-1), r = e[0];
			return !r || !n || t - n.time > 80 || n.time <= r.time ? 0 : (n.position - r.position) / (n.time - r.time);
		},
		isReversing(t, n = performance.now()) {
			let r = e[0], i = e.at(-1);
			if (!r || !i) return !1;
			let a = i.position - r.position;
			return Math.abs(a) >= 8 && Math.sign(a) === -Math.sign(t) && Math.abs(this.velocity(n)) >= .1;
		}
	};
}
function tv(e) {
	return e * .998 / (1 - .998);
}
// packages/ui-kit/src/overlay/bottom-sheet-drag.ts
var nv = .25;
function rv(e) {
	return Math.max(0, e);
}
function iv(e, t, n = nv, r = 0) {
	if (r <= -.1) return !1;
	let i = e + (r > 0 ? tv(r) : 0);
	return t <= 0 ? i >= 80 : i >= t * n;
}
function av(e, t) {
	return t <= 0 ? 1 : Math.max(0, 1 - e / t);
}
// packages/ui-kit/src/overlay/bottom-sheet-motion.svelte.ts
function ov(e) {
	let t = /* @__PURE__ */ j(!1), n = /* @__PURE__ */ j(0), r = /* @__PURE__ */ j("hidden"), i = 0, a = 1, o = !1, s = 0, c = () => {}, l = ev();
	function u() {
		s++, c(), c = () => {};
	}
	function d(t, r) {
		u();
		let i = s, a = B(n);
		M(n, t, !0), e.reduced() ? r() : c = e.animate(a, t, () => {
			i === s && (c = () => {}, r());
		});
	}
	function f() {
		M(r, o ? "returning" : "entering", !0), d(0, () => {
			M(r, "open"), o || (o = !0, e.onComplete(!0));
		});
	}
	function p() {
		B(t) && B(r) !== "closing" && (M(r, "closing"), d(Math.max(e.height(), 1), () => {
			M(t, !1), M(r, "hidden"), o = !1, e.onClosed(), e.onComplete(!1);
		}));
	}
	return {
		get state() {
			return {
				present: B(t),
				offset: B(n),
				phase: B(r)
			};
		},
		setOpen(e) {
			e ? B(t) ? B(r) === "closing" && f() : (M(t, !0), M(r, "entering"), o = !1) : p();
		},
		mount() {
			B(r) === "entering" && (M(n, e.height(), !0), f());
		},
		start(t) {
			B(r) === "open" && (a = Math.max(e.height(), 1), i = t, l.reset(t), M(r, "dragging"));
		},
		move(e) {
			B(r) === "dragging" && (l.add(e), M(n, rv(e - i), !0));
		},
		release(e, t = !1) {
			if (B(r) !== "dragging") return;
			l.add(e);
			let i = t ? 0 : l.velocity();
			!t && B(n) > 0 && iv(B(n), a, .25, i) ? p() : f();
		},
		destroy: u
	};
}
// packages/ui-kit/src/overlay/BottomSheet.svelte
var sv = /* @__PURE__ */ H("<div class=\"relative flex shrink-0 touch-none justify-center py-3 before:absolute before:inset-x-0 before:-top-4 before:-bottom-4 before:content-['']\"><div class=\"h-1 w-10 rounded-full bg-on-surface-variant/40\"></div></div>"), cv = /* @__PURE__ */ H("<div class=\"shrink-0\"><!></div>"), lv = /* @__PURE__ */ H("<div><!> <!></div>"), uv = /* @__PURE__ */ H("<div><!></div>"), dv = /* @__PURE__ */ H("<div><!> <!> <!> <!></div>"), fv = /* @__PURE__ */ H("<!> <!>", 1);
function pv(e, t) {
	D(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "title", 3, ""), i = Y(t, "description", 3, ""), a = Y(t, "showHandle", 3, !0), o = Y(t, "dragDismissAria", 3, "Drag down to close"), s = Y(t, "manageHistory", 3, !0), c = Y(t, "overlayId", 3, "bottom-sheet"), l = /* @__PURE__ */ j(null), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ j(null), f = /* @__PURE__ */ j(null), p = /* @__PURE__ */ j(0), m = null, h = null;
	function g(e, t, n) {
		let r = B(u), i = B(d);
		if (!r) return n(), () => {};
		let a = `translate3d(0, ${t}px, 0)`, o = `${av(t, B(p))}`, s = {
			duration: 240,
			easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
			fill: "both"
		}, c = r.animate([{ transform: m ?? `translate3d(0, ${e}px, 0)` }, { transform: a }], s), l = i?.animate([{ opacity: h ?? `${av(e, B(p))}` }, { opacity: o }], s);
		return m = null, h = null, c.onfinish = () => {
			r.style.transform = a, i && (i.style.opacity = o), c.cancel(), l?.cancel(), n();
		}, () => {
			m = getComputedStyle(r).transform, h = i ? getComputedStyle(i).opacity : null, r.style.transform = m, i && h && (i.style.opacity = h), c.onfinish = null, c.cancel(), l?.cancel();
		};
	}
	let _ = ga(), v = ov({
		height: () => (M(p, B(u)?.getBoundingClientRect().height ?? 0, !0), B(p)),
		reduced: $_,
		animate: g,
		onClosed: () => {
			_.end(), n(!1), t.onOpenChange?.(!1);
		},
		onComplete: (e) => t.onOpenChangeComplete?.(e)
	}), y = /* @__PURE__ */ k(() => v.state.present), b = /* @__PURE__ */ k(() => v.state.phase === "dragging"), x = /* @__PURE__ */ k(() => `transform: translate3d(0, ${v.state.offset}px, 0)`), S = /* @__PURE__ */ k(() => `opacity: ${av(v.state.offset, B(p))}`);
	function C(e) {
		v.state.phase === "open" && a() && _.start(e, B(f)) && v.start(e.clientY);
	}
	function ee(e) {
		_.owns(e) && v.move(e.clientY);
	}
	function te(e) {
		_.owns(e) && (_.end(), v.release(e.clientY));
	}
	function ne(e) {
		_.owns(e) && (_.end(), v.release(e.clientY, !0));
	}
	function re(e) {
		e.preventDefault(), requestAnimationFrame(() => {
			B(y) && (B(l) ?? B(u))?.focus();
		});
	}
	let ie = Ra({
		get overlayId() {
			return c();
		},
		get port() {
			return s() ? t.historyPort : void 0;
		},
		parent: $e(La),
		setOpen: (e) => {
			n(e);
		}
	});
	et(La, ie), I(() => ie.syncOpenState(B(y))), li(() => {
		_.end(), v.destroy(), ie.dispose();
	});
	function ae(e) {
		e ? (n(!0), t.onOpenChange?.(!0)) : v.setOpen(!1);
	}
	I(() => {
		let e = n();
		V(() => v.setOpen(e));
	}), I(() => {
		B(u) && V(() => v.mount());
	});
	var oe = U();
	Ar("pointermove", ln, function(...e) {
		(a() ? ee : void 0)?.apply(this, e);
	}), Ar("pointerup", ln, function(...e) {
		(a() ? te : void 0)?.apply(this, e);
	}), Ar("pointercancel", ln, function(...e) {
		(a() ? ne : void 0)?.apply(this, e);
	});
	var se = P(oe), ce = () => B(y), le = ae;
	Si(se, () => t_, (e, n) => {
		n(e, {
			get open() {
				return ce();
			},
			set open(e) {
				le(e);
			},
			children: (e, n) => {
				var s = U();
				Si(P(s), () => Ws, (e, n) => {
					n(e, {
						children: (e, n) => {
							var s = fv(), c = P(s);
							Si(c, () => xl, (e, t) => {
								t(e, {
									class: "bottom-sheet-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50",
									"aria-hidden": "true",
									get style() {
										return B(S);
									},
									onclick: () => ae(!1),
									get ref() {
										return B(d);
									},
									set ref(e) {
										M(d, e, !0);
									}
								});
							});
							var p = F(c, 2);
							{
								let e = (e, n) => {
									let s = () => (n?.()).props;
									var c = dv();
									J(c, () => ({ ...s() }));
									var u = N(c), d = (e) => {
										var t = sv();
										aa(t, (e) => M(f, e), () => B(f)), L(() => $i(t, "aria-label", o())), jr("pointerdown", t, C), Ar("lostpointercapture", t, ne), W(e, t);
									};
									q(u, (e) => {
										a() && e(d);
									});
									var p = F(u, 2), m = (e) => {
										var n = lv(), i = N(n), o = (e) => {
											var t = U(), n = P(t);
											{
												let e = /* @__PURE__ */ k(() => ["ui-heading-text text-title-large min-w-0 flex-1 font-medium text-on-surface outline-none", a() ? "truncate" : "text-center"]);
												Si(n, () => Fs, (t, n) => {
													n(t, {
														tabindex: -1,
														get class() {
															return B(e);
														},
														get ref() {
															return B(l);
														},
														set ref(e) {
															M(l, e, !0);
														},
														children: (e, t) => {
															Oe();
															var n = Hr();
															L(() => G(n, r())), W(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											W(e, t);
										};
										q(i, (e) => {
											r() && e(o);
										});
										var s = F(i, 2), c = (e) => {
											var n = cv();
											K(N(n), () => t.actions), E(n), W(e, n);
										};
										q(s, (e) => {
											t.actions && e(c);
										}), E(n), L(() => Ni(n, 1, Di(["flex shrink-0 items-center gap-3", a() ? "px-4 pb-3" : "px-6 pt-6 pb-2"]))), W(e, n);
									};
									q(p, (e) => {
										(r() || t.actions) && e(m);
									});
									var h = F(p, 2), g = (e) => {
										var n = lv(), r = N(n), o = (e) => {
											var t = U(), n = P(t);
											{
												let e = /* @__PURE__ */ k(() => ["text-body-medium text-supporting leading-relaxed text-on-surface-variant", !a() && "text-center"]);
												Si(n, () => wl, (t, n) => {
													n(t, {
														get class() {
															return B(e);
														},
														children: (e, t) => {
															Oe();
															var n = Hr();
															L(() => G(n, i())), W(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											W(e, t);
										};
										q(r, (e) => {
											i() && e(o);
										});
										var s = F(r, 2), c = (e) => {
											var n = U();
											K(P(n), () => t.children), W(e, n);
										};
										q(s, (e) => {
											t.children && e(c);
										}), E(n), L(() => Ni(n, 1, Di([a() ? ["app-scroll-y content-scroll min-h-0 flex-1 overflow-y-auto", !t.footer && "pb-[calc(1rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]"] : ["shrink-0 px-6", t.footer ? "pb-5" : "pb-[calc(1.25rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]"]]))), W(e, n);
									};
									q(h, (e) => {
										(i() || t.children) && e(g);
									});
									var _ = F(h, 2), v = (e) => {
										var n = uv();
										K(N(n), () => t.footer), E(n), L(() => Ni(n, 1, Di(["flex shrink-0 items-center gap-2", a() ? "mt-2 justify-end ps-4 pe-[calc(1rem+var(--tabbar-inline-safe,0px))] pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)]" : "w-full justify-stretch gap-3 border-t border-outline-variant/40 ps-6 pe-[calc(1.5rem+var(--tabbar-inline-safe,0px))] pt-4 pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)] [&>button]:flex-1"]))), W(e, n);
									};
									q(_, (e) => {
										t.footer && e(v);
									}), E(c), W(e, c);
								}, n = /* @__PURE__ */ k(() => B(b) ? "" : void 0), s = /* @__PURE__ */ k(() => v.state.phase === "returning" ? "" : void 0), c = /* @__PURE__ */ k(() => v.state.phase === "closing" ? "" : void 0);
								Si(p, () => a_, (t, r) => {
									r(t, {
										class: "ui-overlay-surface bottom-sheet-content rounded-t-sheet fixed inset-x-0 z-[var(--z-overlay)] flex min-h-0 flex-col overflow-hidden bg-surface-container-high text-on-surface shadow-overlay outline-none",
										get style() {
											return B(x);
										},
										get "data-dragging"() {
											return B(n);
										},
										get "data-snapping-back"() {
											return B(s);
										},
										get "data-closing"() {
											return B(c);
										},
										restoreScrollDelay: 0,
										onOpenAutoFocus: re,
										onInteractOutside: (e) => {
											e.preventDefault(), ae(!1);
										},
										onEscapeKeydown: (e) => {
											e.preventDefault(), ae(!1);
										},
										get ref() {
											return B(u);
										},
										set ref(e) {
											M(u, e, !0);
										},
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							W(e, s);
						},
						$$slots: { default: !0 }
					});
				}), W(e, s);
			},
			$$slots: { default: !0 }
		});
	}), W(e, oe), O();
}
Mr(["pointerdown"]);
// packages/ui-kit/src/form/PickerWheel.svelte
var mv = /* @__PURE__ */ H("<div role=\"option\" tabindex=\"-1\"> </div>"), hv = /* @__PURE__ */ H("<div class=\"picker-wheel-column relative w-full svelte-1i06u69\"><div role=\"listbox\"></div> <div aria-hidden=\"true\" class=\"picker-wheel-fade-top pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-surface-container-high to-transparent svelte-1i06u69\"></div> <div aria-hidden=\"true\" class=\"picker-wheel-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-high to-transparent svelte-1i06u69\"></div> <div aria-hidden=\"true\" class=\"pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-lg border-y border-outline-variant/40 bg-brand/5\"></div></div>");
function gv(e, t) {
	D(t, !0);
	let n = Y(t, "value", 15, ""), r = Y(t, "disabled", 3, !1), i = null, a = 0, o = 0, s = 0, c = 0, l = /* @__PURE__ */ k(() => t.options.map((e) => e.value).join("\0"));
	function u() {
		return Math.max(0, t.options.findIndex((e) => e.value === n()));
	}
	function d(e) {
		i?.scrollTo({
			top: e * 40,
			behavior: "instant"
		});
	}
	function f() {
		a = Date.now() + 150, c = u(), d(c);
	}
	I(() => {
		B(l), V(f);
	});
	function p() {
		let e = Date.now();
		e < a || e - o < 40 || (o = e, T_.medium());
	}
	function m(e) {
		let r = t.options[e]?.value;
		r !== void 0 && r !== n() && (n(r), t.onValueChange?.(r));
	}
	function h() {
		s = 0, r() || m(c);
	}
	function g(e) {
		if (r()) return;
		let n = Y_(e.scrollTop, Math.max(0, t.options.length - 1), 40);
		c !== n && (c = n, p()), window.clearTimeout(s), s = window.setTimeout(h, 90);
	}
	function _() {
		return r() ? n() : (window.clearTimeout(s), i && (c = Y_(i.scrollTop, Math.max(0, t.options.length - 1), 40)), h(), t.options[c]?.value ?? "");
	}
	function v(e) {
		if (r()) return;
		let n = Math.min(Math.max(e, 0), Math.max(0, t.options.length - 1));
		c = n, m(n), d(n);
	}
	function y(e) {
		r() || (e.key === "ArrowDown" || e.key === "ArrowRight" ? (e.preventDefault(), v(c + 1)) : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (e.preventDefault(), v(c - 1)) : e.key === "Home" ? (e.preventDefault(), v(0)) : e.key === "End" && (e.preventDefault(), v(t.options.length - 1)));
	}
	function b(e) {
		return i = e, c = u(), e.scrollTo({ top: c * 40 }), () => {
			i === e && (i = null);
		};
	}
	li(() => clearTimeout(s));
	var x = {
		scrollToValue: f,
		commitDraft: _
	}, S = hv(), C = N(S);
	return gi(C, 23, () => t.options, (e) => e.value, (e, r, i) => {
		var a = mv();
		let o;
		var s = _n(a, !0);
		L(() => {
			$i(a, "id", `${t.idPrefix ?? ""}-${B(r).value ?? ""}`), $i(a, "aria-selected", B(r).value === n()), Ni(a, 1, `picker-wheel-row text-body-large flex cursor-pointer items-center justify-center text-center tabular-nums transition-colors ${B(r).value === n() ? "font-semibold text-on-surface" : "text-on-surface-variant/60"}`, "svelte-1i06u69"), o = Fi(a, "", o, { height: "40px" }), G(s, B(r).label);
		}), jr("click", a, () => v(B(i))), W(e, a);
	}), E(C), wi(C, () => b), Oe(6), E(S), L(() => {
		$i(C, "aria-label", t.label), $i(C, "aria-disabled", r()), $i(C, "tabindex", r() ? -1 : 0), Ni(C, 1, Di(["picker-wheel overflow-y-auto rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand", r() && "pointer-events-none opacity-60"]), "svelte-1i06u69");
	}), Ar("scroll", C, (e) => g(e.currentTarget)), Ar("scrollend", C, () => {
		window.clearTimeout(s), h();
	}), jr("keydown", C, y), W(e, S), O(x);
}
Mr(["keydown", "click"]);
// packages/ui-kit/src/form/TimeWheel.svelte
var _v = /* @__PURE__ */ H("<div class=\"flex justify-center gap-3\"><div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div> <div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div></div>");
function vv(e, t) {
	D(t, !0);
	let n = Y(t, "value", 31, () => on({
		hour: 0,
		minute: 0
	})), r = Y(t, "disabled", 3, !1), i = /* @__PURE__ */ j(on(String(n().hour))), a = /* @__PURE__ */ j(on(String(n().minute))), o = /* @__PURE__ */ j(null), s = /* @__PURE__ */ j(null), c = /* @__PURE__ */ k(() => q_().filter((e) => !t.minimum || e >= t.minimum.hour).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	}))), l = /* @__PURE__ */ k(() => J_().filter((e) => !t.minimum || Number(B(i)) > t.minimum.hour || e >= t.minimum.minute).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	})));
	function u(e) {
		return !t.minimum || e.hour * 60 + e.minute >= t.minimum.hour * 60 + t.minimum.minute ? e : { ...t.minimum };
	}
	function d(e) {
		let r = u(e), o = r.hour !== n().hour || r.minute !== n().minute;
		M(i, String(r.hour), !0), M(a, String(r.minute), !0), o && (n(r), t.onValueChange?.(r));
	}
	function f() {
		let e = u(n());
		M(i, String(e.hour), !0), M(a, String(e.minute), !0);
	}
	function p() {
		f(), br().then(() => {
			B(o)?.scrollToValue(), B(s)?.scrollToValue();
		});
	}
	function m(e) {
		d({
			hour: Number(e),
			minute: Number(B(a))
		}), br().then(() => B(s)?.scrollToValue());
	}
	function h(e) {
		d({
			hour: Number(B(i)),
			minute: Number(e)
		});
	}
	function g() {
		return d({
			hour: Number(B(o)?.commitDraft() ?? B(i)),
			minute: Number(B(s)?.commitDraft() ?? B(a))
		}), n();
	}
	var _ = {
		scrollToValue: p,
		commitDraft: g
	}, v = _v(), y = N(v), b = N(y);
	{
		let e = /* @__PURE__ */ k(() => t.labels.columnAria(t.label, t.labels.hour)), n = /* @__PURE__ */ k(() => `${t.idPrefix}-hour`);
		aa(gv(b, {
			get options() {
				return B(c);
			},
			get label() {
				return B(e);
			},
			get idPrefix() {
				return B(n);
			},
			get disabled() {
				return r();
			},
			onValueChange: m,
			get value() {
				return B(i);
			},
			set value(e) {
				M(i, e, !0);
			}
		}), (e) => M(o, e, !0), () => B(o));
	}
	E(y);
	var x = F(y, 2), S = N(x);
	{
		let e = /* @__PURE__ */ k(() => t.labels.columnAria(t.label, t.labels.minute)), n = /* @__PURE__ */ k(() => `${t.idPrefix}-minute`);
		aa(gv(S, {
			get options() {
				return B(l);
			},
			get label() {
				return B(e);
			},
			get idPrefix() {
				return B(n);
			},
			get disabled() {
				return r();
			},
			onValueChange: h,
			get value() {
				return B(a);
			},
			set value(e) {
				M(a, e, !0);
			}
		}), (e) => M(s, e, !0), () => B(s));
	}
	return E(x), E(v), W(e, v), O(_);
}
// packages/ui-kit/src/form/TimePicker.svelte
var yv = /* @__PURE__ */ H("<p class=\"text-body-small text-supporting mt-1 text-on-surface-variant\"> </p>"), bv = /* @__PURE__ */ H("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> </h3> <!></div>"), xv = /* @__PURE__ */ H("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> </button>"), Sv = /* @__PURE__ */ H("<button type=\"button\" class=\"text-label-large h-11 rounded-full px-5 text-on-surface-variant hover:bg-on-surface/5 active:bg-on-surface/10\"> </button> <button type=\"button\" class=\"text-label-large h-11 rounded-full bg-brand px-6 text-on-primary active:opacity-90\"> </button>", 1), Cv = /* @__PURE__ */ H("<div class=\"px-4 pt-1 pb-2\"><!></div>"), wv = /* @__PURE__ */ H("<div><!> <div><!> <button type=\"button\" class=\"ui-form-field-input ui-date-field-input\" aria-haspopup=\"dialog\"><span class=\"ui-date-field-value text-body-large truncate text-left text-on-surface tabular-nums\"> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z\"></path></svg></span></button></div></div> <!>", 1);
function Tv(e, t) {
	let n = Ur();
	D(t, !0);
	let r = Y(t, "value", 31, () => on({
		hour: 0,
		minute: 0
	})), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "variant", 3, "field"), s = Y(t, "labels", 3, U_), c = Y(t, "sheetDragDismissAria", 3, "向下拖动关闭"), l = /* @__PURE__ */ k(() => t.id ?? n), u = /* @__PURE__ */ k(() => `${B(l)}-label`), d = /* @__PURE__ */ k(() => t.idPrefix ?? B(l)), f = /* @__PURE__ */ k(() => t.overlayId ?? `time-picker-${n}`), p = /* @__PURE__ */ k(() => t.manageHistory ?? t.historyPort != null), m = /* @__PURE__ */ k(() => o() === "section"), h = /* @__PURE__ */ j(!1), g = /* @__PURE__ */ j(on({
		hour: 0,
		minute: 0
	})), _ = /* @__PURE__ */ j(null), v = /* @__PURE__ */ k(() => W_(r())), y = /* @__PURE__ */ k(() => K_(t.label, B(h) ? B(g) : r(), s()));
	function b() {
		a() || (M(g, {
			hour: r().hour,
			minute: r().minute
		}, !0), M(h, !0), br().then(() => B(_)?.scrollToValue()));
	}
	function x() {
		M(h, !1);
	}
	function S() {
		T_.light();
		let e = B(_)?.commitDraft() ?? B(g);
		(e.hour !== r().hour || e.minute !== r().minute) && (r(e), t.onValueChange?.(e)), x();
	}
	var C = wv(), ee = P(C), te = N(ee), ne = (e) => {
		var n = bv(), r = N(n), i = _n(r, !0), a = F(r, 2), o = (e) => {
			var n = yv(), r = _n(n, !0);
			L(() => G(r, t.description)), W(e, n);
		};
		q(a, (e) => {
			t.description && e(o);
		}), E(n), L(() => {
			$i(r, "id", B(u)), G(i, t.label);
		}), W(e, n);
	};
	q(te, (e) => {
		B(m) && e(ne);
	});
	var re = F(te, 2), ie = N(re), ae = (e) => {
		var n = xv(), r = _n(n, !0);
		L(() => {
			$i(n, "id", B(u)), G(r, t.label);
		}), jr("click", n, b), W(e, n);
	};
	q(ie, (e) => {
		B(m) || e(ae);
	});
	var oe = F(ie, 2), se = _n(N(oe), !0);
	Oe(2), E(oe), E(re), E(ee), pv(F(ee, 2), {
		get title() {
			return t.label;
		},
		get dragDismissAria() {
			return c();
		},
		get manageHistory() {
			return B(p);
		},
		get overlayId() {
			return B(f);
		},
		get historyPort() {
			return t.historyPort;
		},
		get open() {
			return B(h);
		},
		set open(e) {
			M(h, e, !0);
		},
		footer: (e) => {
			var t = Sv(), n = P(t), r = _n(n, !0), i = F(n, 2), a = _n(i, !0);
			L(() => {
				G(r, s().cancel), G(a, s().confirm);
			}), jr("click", n, x), jr("click", i, S), W(e, t);
		},
		children: (e, n) => {
			var r = Cv();
			aa(vv(N(r), {
				get label() {
					return t.label;
				},
				get labels() {
					return s();
				},
				get idPrefix() {
					return B(d);
				},
				get value() {
					return B(g);
				},
				set value(e) {
					M(g, e, !0);
				}
			}), (e) => M(_, e, !0), () => B(_)), E(r), W(e, r);
		},
		$$slots: {
			footer: !0,
			default: !0
		}
	}), L(() => {
		Ni(ee, 1, Di(B(m) ? ["flex flex-col gap-3", i()] : void 0)), Ni(re, 1, Di(B(m) ? "ui-form-field" : ["ui-form-field", i()])), $i(oe, "id", B(l)), $i(oe, "aria-labelledby", B(u)), $i(oe, "aria-label", B(y)), $i(oe, "aria-expanded", B(h)), oe.disabled = a(), G(se, B(v));
	}), jr("click", oe, b), W(e, C), O();
}
Mr(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var Ev = /* @__PURE__ */ H("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function Dv(e, t) {
	D(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = Ev(), i = N(r), a = _n(i, !0), o = F(i, 2), s = _n(o, !0);
	E(r), L((e, t) => {
		G(a, e), G(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), jr("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), W(e, r), O();
}
Mr(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [Ov, kv] = Qe(), Av = 900, jv = 24, Mv = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function Nv(e) {
	return Mv.has(e) ? !0 : e.startsWith("max-w-");
}
function Pv(e) {
	let t = [], n = [];
	for (let r of e) Nv(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function Fv(e, t, n, r = jv) {
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
function Iv(e, t) {
	t.visible ? (e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`) : e.style.display = "none";
}
function Lv(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = Pv(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Iv(a, Fv(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, Av);
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
function Rv(e) {
	return Lv(e);
}
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Mr(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var zv = /* @__PURE__ */ H("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function Bv(e, t) {
	D(t, !0), et(La, V(() => la(t.propsStore)).overlayParent);
	let n = /* @__PURE__ */ k(() => t.component), r = /* @__PURE__ */ k(() => ja(t.propsStore).current);
	var i = zv();
	ei(N(i), {
		onerror: (e) => {
			console.error("[MountableSvelteHost] render failed:", e), t.onFailure?.(e);
		},
		failed: (e, t = g, n = g) => {
			Dv(e, {
				get controller() {
					return B(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = U();
		Si(P(t), () => B(n), (e, t) => {
			t(e, ha(() => B(r)));
		}), W(e, t);
	}), E(i), W(e, i), O();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Vv(e) {
	return {
		[Ta]: !0,
		mount(t, n, r) {
			let i = !1, a = ca({ ...n }), o = ni(Bv, {
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
					i = !0, oi(o).catch((e) => console.error("[MountableSvelteHost] unmount failed:", e));
				}
			};
		}
	};
}
// packages/ui-kit/src/i18n/plugin-text.ts
function Hv(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return wa(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? wa(a, i) : o;
}
// packages/plugins/clock/src/clock.ts
var Uv = /^\d{4}-\d{2}-\d{2}$/;
function Wv(e) {
	return typeof e != "number" || !Number.isFinite(e) ? null : e;
}
function Gv(e, t) {
	if (!Uv.test(e) || !Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || !Number.isInteger(t.minute) || t.minute < 0 || t.minute > 59) return null;
	let n = Number(e.slice(0, 4)), r = Number(e.slice(5, 7)), i = Number(e.slice(8, 10)), a = new Date(n, r - 1, i, t.hour, t.minute, 0, 0);
	return a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i ? null : a;
}
function Kv(e) {
	return {
		isoDate: ba(e),
		time: {
			hour: e.getHours(),
			minute: e.getMinutes()
		}
	};
}
// packages/plugins/clock/src/constants.ts
var qv = "tool-clock", Jv = "frozen_now", Yv = {
	"zh-cn": {
		"plugin.name": "自定义时间",
		"mine.title": "自定义时间",
		"screen.title": "自定义时间",
		"screen.status.subtitle.system": "课表按引擎时间运行",
		"screen.status.subtitle.frozen": "课表按自定义时间运行",
		"screen.field.date": "日期",
		"screen.field.time": "时间",
		"screen.field.date.placeholder": "选择日期",
		"screen.field.date.today": "今天",
		"screen.field.date.clear": "清除",
		"screen.field.date.confirm": "确定",
		"screen.field.date.triggerEmpty": "选择{label}",
		"screen.field.date.triggerLabeled": "{label}：{display}",
		"screen.field.time.hour": "时",
		"screen.field.time.minute": "分",
		"screen.field.time.cancel": "取消",
		"screen.field.time.sheetDragDismiss": "向下拖动关闭",
		"screen.field.time.columnAria": "{label}{column}",
		"screen.action.apply": "应用",
		"screen.action.reset": "使用引擎时间",
		"screen.notify.applied": "已冻结当前时间",
		"screen.notify.reset": "已使用引擎时间",
		"screen.notify.invalid": "请选择有效的日期和时间"
	},
	en: {
		"plugin.name": "Custom Date & Time",
		"mine.title": "Custom date & time",
		"screen.title": "Custom Date & Time",
		"screen.status.subtitle.system": "Timetable follows engine time",
		"screen.status.subtitle.frozen": "Timetable follows custom time",
		"screen.field.date": "Date",
		"screen.field.time": "Time",
		"screen.field.date.placeholder": "Choose a date",
		"screen.field.date.today": "Today",
		"screen.field.date.clear": "Clear",
		"screen.field.date.confirm": "OK",
		"screen.field.date.triggerEmpty": "Choose {label}",
		"screen.field.date.triggerLabeled": "{label}: {display}",
		"screen.field.time.hour": "Hour",
		"screen.field.time.minute": "Minute",
		"screen.field.time.cancel": "Cancel",
		"screen.field.time.sheetDragDismiss": "Drag down to close",
		"screen.field.time.columnAria": "{label} {column}",
		"screen.action.apply": "Apply",
		"screen.action.reset": "Use engine time",
		"screen.notify.applied": "Clock frozen",
		"screen.notify.reset": "Using engine time",
		"screen.notify.invalid": "Choose a valid date and time"
	}
};
// packages/plugins/clock/src/index.ts
function Xv(e = {}) {
	let { screenComponent: t } = e;
	return ka({
		id: qv,
		messages: Yv,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 55,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, n) {
			let r = Wv(await e.storage.get(Jv));
			r != null && e.clock.set(new Date(r)), e.registerSlot("mine.item", {
				id: "clock",
				sectionId: qv,
				title: () => n("mine.title"),
				href: `/plugins/${qv}`,
				icon: "schedule",
				iconTone: "secondary",
				order: 40
			}), e.registerSlot("shell.route.screen", {
				id: qv,
				title: () => n("screen.title"),
				...t ? { component: t } : {}
			});
		}
	});
}
// packages/plugins/clock/src/analytics.ts
var Zv = {
	apply: "apply",
	reset: "reset"
}, Qv = /* @__PURE__ */ H("<p class=\"text-headline-small text-on-surface tabular-nums\"> <span class=\"text-on-surface-variant\">·</span> </p> <p class=\"text-body-medium mt-1 text-on-surface-variant\"> </p>", 1), $v = /* @__PURE__ */ H("<header class=\"relative z-10 shrink-0 border-b border-outline/10 bg-surface/90 px-4 pt-6 pb-4 backdrop-blur-sm\"><!></header>"), ey = /* @__PURE__ */ H("<section class=\"ui-section-surface ui-section-surface--comfortable\"><!></section>"), ty = /* @__PURE__ */ H("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><!> <div class=\"ui-page-surface secondary-scroll relative z-0 min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]\"><!> <section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack divide-y divide-outline/10\"><!> <!></div></section></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-filled flex-1\"> </button></div></div></div>");
function ny(e, t) {
	D(t, !0);
	let n = (e) => {
		var t = Qv(), n = P(t), r = N(n), i = F(r, 2);
		E(n);
		var a = _n(F(n, 2), !0);
		L(() => {
			G(r, `${B(h) ?? ""} `), G(i, ` ${B(g) ?? ""}`), G(a, B(_));
		}), W(e, t);
	}, r = new Ia("(orientation: landscape) and (max-height: 500px)"), i = /* @__PURE__ */ k(() => ja(t.controller.snapshot)), a = /* @__PURE__ */ k(() => t.context), o = /* @__PURE__ */ k(() => d_(B(i).current.locale));
	function s(e, n) {
		return B(i).current.slotVersion, Hv(t.controller, qv, Yv, e, n);
	}
	let c = Kv(/* @__PURE__ */ new Date()), l = /* @__PURE__ */ j(on(c.isoDate)), u = /* @__PURE__ */ j(on(c.time));
	ci(() => {
		let e = Kv(t.context.state.now);
		M(l, e.isoDate, !0), M(u, e.time, !0);
	});
	let d = /* @__PURE__ */ k(() => ({
		placeholder: s("screen.field.date.placeholder"),
		today: s("screen.field.date.today"),
		clear: s("screen.field.date.clear"),
		confirm: s("screen.field.date.confirm"),
		triggerEmpty: (e) => s("screen.field.date.triggerEmpty", { label: e }),
		triggerLabeled: (e, t) => s("screen.field.date.triggerLabeled", {
			label: e,
			display: t
		})
	})), f = /* @__PURE__ */ k(() => ({
		placeholder: s("screen.field.time"),
		hour: s("screen.field.time.hour"),
		minute: s("screen.field.time.minute"),
		cancel: s("screen.field.time.cancel"),
		confirm: s("screen.field.date.confirm"),
		triggerEmpty: (e) => s("screen.field.date.triggerEmpty", { label: e }),
		triggerLabeled: (e, t) => s("screen.field.date.triggerLabeled", {
			label: e,
			display: t
		}),
		columnAria: (e, t) => s("screen.field.time.columnAria", {
			label: e,
			column: t
		})
	})), p = /* @__PURE__ */ k(() => B(i).current.clockFrozen), m = /* @__PURE__ */ k(() => B(i).current.now), h = /* @__PURE__ */ k(() => ya(Kv(B(m)).isoDate)), g = /* @__PURE__ */ k(() => B(m).toLocaleTimeString(B(o), {
		hour: "2-digit",
		minute: "2-digit"
	})), _ = /* @__PURE__ */ k(() => B(p) ? s("screen.status.subtitle.frozen") : s("screen.status.subtitle.system")), v = /* @__PURE__ */ k(() => Gv(B(l), B(u))), y = /* @__PURE__ */ k(() => B(v) != null && B(v).getTime() !== B(m).getTime()), b = /* @__PURE__ */ k(() => [{
		id: "reset",
		label: s("screen.action.reset"),
		icon: "refresh",
		variant: "outlined",
		disabled: !B(p),
		onClick: S
	}, {
		id: "apply",
		label: s("screen.action.apply"),
		icon: "check",
		disabled: !B(y),
		onClick: x
	}]);
	I(() => t.edgeActions?.register(B(b)));
	async function x() {
		let e = Gv(B(l), B(u));
		e ? (await B(a).storage.set(Jv, e.getTime()), B(a).clock.set(e), Ea(B(a), Zv.apply), B(a).actions.notify(s("screen.notify.applied"), "info")) : B(a).actions.notify(s("screen.notify.invalid"), "warn");
	}
	async function S() {
		await B(a).storage.delete(Jv), B(a).clock.set(null);
		let e = Kv(B(a).state.now);
		M(l, e.isoDate, !0), M(u, e.time, !0), Ea(B(a), Zv.reset), B(a).actions.notify(s("screen.notify.reset"), "info");
	}
	var C = ty(), ee = N(C), te = (e) => {
		var t = $v(), r = N(t);
		n(r), E(t), W(e, t);
	};
	q(ee, (e) => {
		r.current || e(te);
	});
	var ne = F(ee, 2), re = N(ne), ie = N(re), ae = (e) => {
		var t = ey(), r = N(t);
		n(r), E(t), W(e, t);
	};
	q(ie, (e) => {
		r.current && e(ae);
	});
	var oe = F(ie, 2), se = N(oe), ce = N(se);
	{
		let e = /* @__PURE__ */ k(() => s("screen.field.date"));
		H_(ce, {
			get historyPort() {
				return t.controller.overlayHistoryPort;
			},
			get label() {
				return B(e);
			},
			required: !0,
			variant: "section",
			get labels() {
				return B(d);
			},
			get locale() {
				return B(o);
			},
			get value() {
				return B(l);
			},
			set value(e) {
				M(l, e, !0);
			}
		});
	}
	var le = F(ce, 2);
	{
		let e = /* @__PURE__ */ k(() => s("screen.field.time")), n = /* @__PURE__ */ k(() => s("screen.field.time.sheetDragDismiss"));
		Tv(le, {
			get label() {
				return B(e);
			},
			variant: "section",
			get labels() {
				return B(f);
			},
			get sheetDragDismissAria() {
				return B(n);
			},
			idPrefix: "clock-time",
			get historyPort() {
				return t.controller.overlayHistoryPort;
			},
			get value() {
				return B(u);
			},
			set value(e) {
				M(u, e, !0);
			}
		});
	}
	E(se), E(oe), E(re), E(ne), Ci(ne, (e) => Rv?.(e));
	var ue = F(ne, 2), de = N(ue), fe = N(de), pe = _n(fe, !0), me = F(fe, 2), he = _n(me, !0);
	E(de), E(ue), E(C), L((e, t) => {
		fe.disabled = !B(p), G(pe, e), me.disabled = !B(y), G(he, t);
	}, [() => s("screen.action.reset"), () => s("screen.action.apply")]), jr("click", fe, () => void S()), jr("click", me, () => void x()), W(e, C), O();
}
Mr(["click"]);
// packages/plugins/clock/bundle/entry.ts
var ry = Xv({ screenComponent: Vv(ny) });
export { ry as default };
