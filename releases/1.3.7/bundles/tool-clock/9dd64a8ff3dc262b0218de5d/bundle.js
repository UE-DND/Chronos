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
var y = 1 << 24, b = 1024, x = 2048, S = 4096, C = 8192, w = 16384, ee = 32768, te = 1 << 25, ne = 65536, re = 1 << 19, ie = 1 << 20, ae = 1 << 25, oe = 1 << 21, se = 1 << 22, ce = 1 << 23, le = Symbol("$state"), ue = Symbol("component"), de = Symbol("legacy props"), fe = Symbol(""), pe = Symbol("attributes"), me = Symbol("class"), he = Symbol("style"), ge = Symbol("text"), _e = Symbol("form reset"), ve = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ye = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function be() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function xe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Se() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ce() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function we(e) {
	T = e;
}
var E;
function Te(t) {
	if (t === null) throw xe(), e;
	return E = t;
}
function Ee() {
	return Te(/* @__PURE__ */ hn(E));
}
function D(t) {
	if (T) {
		if (/* @__PURE__ */ hn(E) !== null) throw xe(), e;
		E = t;
	}
}
function De(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ hn(n);
		E = n;
	}
}
function Oe(e = !0) {
	for (var t = 0, n = E;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ hn(n);
		e && n.remove(), n = i;
	}
}
function ke(t) {
	if (!t || t.nodeType !== 8) throw xe(), e;
	return t.data;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/equality.js
function Ae(e) {
	return e === this.v;
}
function je(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Me(e) {
	return !je(e, this.v);
}
function Ne(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Pe() {
	throw Error("https://svelte.dev/e/missing_context");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/errors.js
function Fe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ie(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Le(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Re() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ze(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Be() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ve(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function He() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ge() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/shared/context.js
function Ke(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Pe(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function qe(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function Je(e, t) {
	return e === null && Ne(t), e.c ??= new Map(qe(e) || void 0);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/context.js
var Ye = null;
function Xe(e) {
	Ye = e;
}
function Ze() {
	return Ke(Qe, $e, et);
}
function Qe(e) {
	return Je(Ye, "getContext").get(e);
}
function $e(e, t) {
	return Je(Ye, "setContext").set(e, t), t;
}
function et(e) {
	return Je(Ye, "hasContext").has(e);
}
function tt() {
	return Je(Ye, "getAllContexts");
}
function O(e, t = !1, n) {
	Ye = {
		p: Ye,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: B,
		l: null
	};
}
function k(e) {
	var t = Ye, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) On(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ye = t.p, nt(e);
}
function nt(e = {}) {
	return c(e, ue, { value: !0 }), e;
}
function rt() {
	return !0;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/task.js
var it = [];
function at() {
	var e = it;
	it = [], _(e);
}
function ot(e) {
	if (it.length === 0 && !Nt) {
		var t = it;
		queueMicrotask(() => {
			t === it && at();
		});
	}
	it.push(e);
}
function st() {
	for (; it.length > 0;) at();
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/status.js
var ct = ~(x | S | b);
function lt(e, t) {
	e.f = e.f & ct | t;
}
function ut(e) {
	e.f & 512 || e.deps === null ? lt(e, b) : lt(e, S);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/utils.js
function dt(e, t) {
	e.f & 2048 ? t.set(e, x) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, S), lt(e, b);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/misc.js
function ft(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, ot(() => {
			document.activeElement === t && e.focus();
		});
	}
}
var pt = !1;
function mt() {
	pt || (pt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[_e]?.();
		});
	}, { capture: !0 }));
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ht(e) {
	var t = z, n = B;
	$n(null), er(null);
	try {
		return e();
	} finally {
		$n(t), er(n);
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/async.js
function gt(e, t, n, r) {
	let i = rt() ? bt : Ct;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = B, c = _t(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Sn(e, s);
			}
			vt();
		}
	}
	var d = yt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ St(e))).then(u).catch((e) => Sn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), vt());
	}) : f();
}
function _t() {
	var e = B, t = z, n = Ye, r = j;
	return function(i = !0) {
		er(e), $n(t), Xe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function vt(e = !0) {
	er(null), $n(null), Xe(null), e && j?.deactivate();
}
function yt() {
	var e = B, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	var n = 2 | x;
	return B !== null && (B.f |= re), {
		ctx: Ye,
		deps: null,
		effects: null,
		equals: Ae,
		f: n,
		fn: e,
		reactions: null,
		rv: 0,
		v: t,
		wv: 0,
		parent: B,
		ac: null
	};
}
var xt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function St(e, n, r) {
	let i = B;
	i === null && Fe();
	var a = void 0, o = Xt(t), s = !z, c = /* @__PURE__ */ new Set();
	return Nn(() => {
		var t = B, n = v();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ve && n.reject(e);
			}).finally(vt);
		} catch (e) {
			n.reject(e), vt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = yt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(xt);
			else for (let e of c.values()) e.reject(xt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== xt && (r.activate(), t ? (o.f |= ce, en(o, t)) : (o.f & 8388608 && (o.f ^= ce), en(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Dn(() => {
		for (let e of c) e.reject(xt);
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
	let t = /* @__PURE__ */ bt(e);
	return nr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ct(e) {
	let t = /* @__PURE__ */ bt(e);
	return t.equals = Me, t;
}
function wt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Vn(t[n]);
	}
}
function Tt(e) {
	var n, r = B, i = e.parent;
	if (!Xn && i !== null && e.v !== t && i.f & 24576) return be(), e.v;
	er(i);
	try {
		wt(e), n = mr(e);
	} finally {
		er(r);
	}
	return n;
}
function Et(e) {
	var t = Tt(e);
	!e.equals(t) && (e.wv = dr(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null)) ? lt(e, b) : Xn || (jt === null ? ut(e) : (En() || j?.is_fork) && jt.set(e, t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ht(() => {
		t.ac.abort(ve), t.ac = null;
	}), t.fn !== null && (t.teardown = g), _r(t, 0), zn(t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && vr(t);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/batch.js
var kt = null, j = null, At = null, jt = null, Mt = null, Nt = !1, Pt = !1, Ft = null, It = null, Lt = 0, Rt = 1, zt = class e {
	id = Rt++;
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
		kt === null ? kt = this : (kt.next = this, this.prev = kt), kt = this;
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
			for (var r of n.d) lt(r, x), t(r);
			for (r of n.m) lt(r, S), t(r);
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
		for (let [e, t] of this.#s) lt(e, t), this.schedule(e);
		this.apply();
		for (var t = Ft = [], n = [], r = It = []; this.#a.length > 0;) {
			Lt++ > 1e3 && (this.#b(), Vt());
			for (let e of this.#p()) try {
				this.#h(e, t, n);
			} catch (t) {
				throw Kt(e), this.#d() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Ft = null, It = null, this.#d()) {
			this.#y(n), this.#y(t);
			for (let [e, t] of this.#c) Gt(e, t);
			r.length > 0 && j.#m();
			return;
		}
		let a = this.#g();
		if (a) this.#y(n), this.#y(t), a.#v(this);
		else {
			this.#s.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), At = this, Ut(n), Ut(t), At = null, this.#i?.resolve();
			var o = j;
			this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (Jt.clear(), o.#m());
		}
	}
	#h(e, t, n) {
		e.f ^= b;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#c.has(r)) && r.fn !== null) {
				a ? r.f ^= b : i & 4 ? t.push(r) : fr(r) && (i & 16 && this.add_dirty_reaction(r, S), vr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), lt(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#b(), j = this, this.#m();
	}
	#y(e) {
		for (var t = 0; t < e.length; t += 1) dt(e[t], this.#s);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), jt?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, jt = null;
	}
	flush() {
		try {
			Pt = !0, j = this, this.#m();
		} finally {
			Lt = 0, Mt = null, Ft = null, It = null, Pt = !1, j = null, jt = null, Jt.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear();
		for (let e of this.async_deriveds.values()) e.reject(xt);
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
		this.#u || (this.#u = !0, ot(() => {
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
		if (j === null) {
			let t = j = new e();
			!Pt && !Nt && ot(() => {
				t.started || t.flush();
			});
		}
		return j;
	}
	apply() {
		jt = null;
	}
	schedule(e) {
		Mt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e);
	}
	#b() {
		if (this.linked) {
			var e = this.prev, t = this.next;
			e === null || (e.next = t), t === null ? kt = e : t.prev = e, this.linked = !1;
		}
	}
};
function Bt(e) {
	var t = Nt, n = At;
	At = null, Nt = !0;
	try {
		var r;
		for (e && (Bt(), r = e());;) {
			if (st(), j === null) return r;
			j.flush();
		}
	} finally {
		Nt = t, At = n;
	}
}
function Vt() {
	try {
		Be();
	} catch (e) {
		Sn(e, Mt);
	}
}
var Ht = null;
function Ut(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && fr(r) && (Ht = /* @__PURE__ */ new Set(), vr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Un(r), Ht?.size > 0)) {
				Jt.clear();
				for (let e of Ht) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ht.has(n) && (Ht.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || vr(n);
					}
				}
				Ht.clear();
			}
		}
		Ht = null;
	}
}
function Wt(e) {
	j.schedule(e);
}
function Gt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), lt(e, b);
		for (var n = e.first; n !== null;) Gt(n, t), n = n.next;
	}
}
function Kt(e) {
	lt(e, b);
	for (var t = e.first; t !== null;) Kt(t), t = t.next;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/reactivity/sources.js
var qt = /* @__PURE__ */ new Set(), Jt = /* @__PURE__ */ new Map(), Yt = !1;
function Xt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ae,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Xt(e, t);
	return nr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Zt(e, t = !1, n = !0) {
	let r = Xt(e);
	return t || (r.equals = Me), r;
}
function N(e, t, n = !1) {
	return z !== null && (!Qn || z.f & 131072) && rt() && z.f & 4325394 && (tr === null || !tr.has(e)) && We(), en(e, n ? an(t) : t, It);
}
var Qt = null, $t = 0;
function en(e, t, n = null) {
	if (!e.equals(t)) {
		Xn ? Jt.set(e, t) : Jt.has(e) || Jt.set(e, e.v);
		var r = zt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Tt(t), jt === null && ut(t);
		}
		e.wv = dr(), Qt = null, $t = 0, rn(e, x, n), Qt = null, rt() && B !== null && B.f & 1024 && !(B.f & 96) && (ar === null ? or([e]) : ar.push(e)), !r.is_fork && qt.size > 0 && !Yt && tn();
	}
	return t;
}
function tn() {
	Yt = !1;
	for (let e of qt) {
		e.f & 1024 && lt(e, S);
		let t;
		try {
			t = fr(e);
		} catch {
			t = !0;
		}
		t && vr(e);
	}
	qt.clear();
}
function nn(e) {
	N(e, e.v + 1);
}
function rn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = rt(), a = r.length;
		if ($t += a, $t > 1e5 && Qt === null && (Qt = /* @__PURE__ */ new Set()), Qt !== null) {
			if (Qt.has(e)) return;
			Qt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== B) {
				var l = (c & x) === 0;
				if (l && lt(s, t), c & 131072) qt.add(s);
				else if (c & 2) {
					var u = s;
					jt?.delete(u), rn(u, S, n);
				} else if (l) {
					var d = s;
					c & 16 && Ht !== null && Ht.add(d), n === null ? Wt(d) : n.push(d);
				}
			}
		}
	}
}
function an(e) {
	if (typeof e != "object" || !e || le in e || ue in e) return e;
	let n = p(e);
	if (n !== d && n !== f) return e;
	var r = /* @__PURE__ */ new Map(), a = i(e), o = /* @__PURE__ */ M(0), s = null, c = lr, u = (e) => {
		if (lr === c) return e();
		var t = z, n = lr;
		$n(null), ur(c);
		var r = e();
		return $n(t), ur(n), r;
	};
	return a && r.set("length", /* @__PURE__ */ M(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			"value" in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1 || He();
			var i = r.get(t);
			return i === void 0 ? u(() => {
				var e = /* @__PURE__ */ M(n.value, s);
				return r.set(t, e), e;
			}) : N(i, n.value, !0), !0;
		},
		deleteProperty(e, n) {
			var i = r.get(n);
			if (i === void 0) {
				if (n in e) {
					let e = u(() => /* @__PURE__ */ M(t, s));
					r.set(n, e), nn(o);
				}
			} else N(i, t), nn(o);
			return !0;
		},
		get(n, i, a) {
			if (i === le) return e;
			var o = r.get(i), c = i in n;
			if (o === void 0 && (!c || l(n, i)?.writable) && (o = u(() => /* @__PURE__ */ M(an(c ? n[i] : t), s)), r.set(i, o)), o !== void 0) {
				var d = V(o);
				return d === t ? void 0 : d;
			}
			return Reflect.get(n, i, a);
		},
		getOwnPropertyDescriptor(e, n) {
			this.has?.(e, n);
			var i = Reflect.getOwnPropertyDescriptor(e, n), a = r.get(n);
			if (a !== void 0) {
				var o = V(a);
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
			if (n === le) return !0;
			var i = r.get(n), a = i !== void 0 && i.v !== t || Reflect.has(e, n);
			return (i !== void 0 || (B !== null || z !== null) && (!a || l(e, n)?.writable)) && (i === void 0 && (i = u(() => /* @__PURE__ */ M(a ? an(e[n]) : t, s)), r.set(n, i)), V(i) === t) ? !1 : a;
		},
		set(e, n, i, c) {
			var d = r.get(n), f = n in e;
			if (a && n === "length") for (var p = i; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = u(() => /* @__PURE__ */ M(t, s)), r.set(p + "", m)) : N(m, t);
			}
			if (d === void 0) (!f || l(e, n)?.writable) && (d = u(() => /* @__PURE__ */ M(void 0, s)), N(d, an(i)), r.set(n, d));
			else {
				f = d.v !== t;
				var h = u(() => an(i));
				N(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(c, i), !f) {
				if (a && typeof n == "string") {
					var _ = r.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && N(_, v + 1);
				}
				nn(o);
			}
			return !0;
		},
		ownKeys(e) {
			V(o);
			var n = Reflect.ownKeys(e).filter((e) => {
				var n = r.get(e);
				return n === void 0 || n.v !== t;
			});
			for (var [i, a] of r) a.v !== t && !(i in e) && n.push(i);
			return n;
		},
		setPrototypeOf() {
			Ue();
		}
	});
}
function on(e) {
	try {
		if (typeof e == "object" && e && le in e) return e[le];
	} catch {}
	return e;
}
function sn(e, t) {
	return Object.is(on(e), on(t));
}
var cn, ln, un, dn;
function fn() {
	if (cn === void 0) {
		cn = window, ln = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		un = l(t, "firstChild").get, dn = l(t, "nextSibling").get, m(e) && (e[me] = void 0, e[pe] = null, e[he] = void 0, e.__e = void 0), m(n) && (n[ge] = void 0);
	}
}
function pn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function mn(e) {
	return un.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function hn(e) {
	return dn.call(e);
}
function P(e, t) {
	if (!T) return /* @__PURE__ */ mn(e);
	var n = /* @__PURE__ */ mn(E);
	if (n === null) n = E.appendChild(pn());
	else if (t && n.nodeType !== 3) {
		var r = pn();
		return n?.before(r), Te(r), r;
	}
	return t && bn(n), Te(n), n;
}
function F(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ mn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hn(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = pn();
			return E?.before(r), Te(r), r;
		}
		bn(E);
	}
	return E;
}
function gn(e, t = !1) {
	if (!T) return /* @__PURE__ */ mn(e);
	var n = P(e, t);
	return D(e), n;
}
function I(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ hn(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = pn();
			return r === null ? i?.after(a) : r.before(a), Te(a), a;
		}
		bn(r);
	}
	return Te(r), r;
}
function _n(e) {
	e.textContent = "";
}
function vn() {
	return !1;
}
function yn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function bn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function xn(e) {
	var t = B;
	if (t === null) return z.f |= ce, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Sn(e, t);
}
function Sn(t, n) {
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
function Cn(e) {
	B === null && (z === null && ze(e), Re()), Xn && Le(e);
}
function wn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Tn(e, t) {
	var n = B;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: Ye,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) Ft === null ? zt.ensure().schedule(r) : Ft.push(r);
	else if (t !== null) {
		try {
			vr(r);
		} catch (e) {
			throw Vn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && wn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function En() {
	return z !== null && !Qn;
}
function Dn(e) {
	let t = Tn(8, null);
	return lt(t, b), t.teardown = e, t;
}
function L(e) {
	Cn("$effect");
	var t = B.f;
	if (!z && t & 32 && Ye !== null && !Ye.i) {
		var n = Ye;
		(n.e ??= []).push(e);
	} else return On(e);
}
function On(e) {
	return Tn(4 | ie, e);
}
function kn(e) {
	return Cn("$effect.pre"), Tn(8 | ie, e);
}
function An(e) {
	zt.ensure();
	let t = Tn(64 | re, e);
	return () => {
		Vn(t);
	};
}
function jn(e) {
	zt.ensure();
	let t = Tn(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Wn(t, () => {
			Vn(t), n(void 0);
		}) : (Vn(t), n(void 0));
	});
}
function Mn(e) {
	return Tn(4, e);
}
function Nn(e) {
	return Tn(se | re, e);
}
function Pn(e, t = 0) {
	return Tn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	gt(r, t, n, (t) => {
		Tn(8, () => {
			e(...t.map(V));
		});
	});
}
function Fn(e, t = 0) {
	return Tn(16 | t, e);
}
function In(e, t = 0) {
	return Tn(y | t, e);
}
function Ln(e) {
	return Tn(32 | re, e);
}
function Rn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Xn, r = z;
		Zn(!0), $n(null);
		try {
			t.call(null);
		} catch (t) {
			Sn(t, e.parent);
		} finally {
			Zn(n), $n(r);
		}
	}
}
function zn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ht(() => {
			e.abort(ve);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Vn(n, t), n = r;
	}
}
function Bn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Vn(t), t = n;
	}
}
function Vn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Hn(e.nodes.start, e.nodes.end), n = !0), e.f |= te, zn(e, t && !n), _r(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Rn(e), e.f ^= te, e.f |= w;
	var i = e.parent;
	i !== null && i.first !== null && Un(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Hn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ hn(e);
		e.remove(), e = n;
	}
}
function Un(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Wn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Gn(e, r, !0);
	var i = () => {
		n && Vn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Gn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Gn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Kn(e) {
	e.f &= -257, qn(e, !0);
}
function qn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= C, e.f & 1024 || (lt(e, x), zt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			qn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Jn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ hn(n);
		t.append(n), n = i;
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/legacy.js
var Yn = null, Xn = !1;
function Zn(e) {
	Xn = e;
}
var z = null, Qn = !1;
function $n(e) {
	z = e;
}
var B = null;
function er(e) {
	B = e;
}
var tr = null;
function nr(e) {
	z !== null && (z.f & 2097152 || z.f & 2) && (tr ??= /* @__PURE__ */ new Set()).add(e);
}
var rr = null, ir = 0, ar = null;
function or(e) {
	ar = e;
}
var sr = 1, cr = 0, lr = cr;
function ur(e) {
	lr = e;
}
function dr() {
	return ++sr;
}
function fr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (fr(a) && Et(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && lt(e, b);
	}
	return !1;
}
function pr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(tr !== null && tr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? pr(a, t, !1) : t === a && (n ? lt(a, x) : a.f & 1024 && lt(a, S), Wt(a));
	}
}
function mr(e) {
	var t = rr, n = ir, r = ar, i = z, a = tr, o = Ye, s = Qn, c = lr, l = e.f;
	rr = null, ir = 0, ar = null, z = l & 96 ? null : e, tr = null, Xe(e.ctx), Qn = !1, lr = ++cr, e.ac !== null && (ht(() => {
		e.ac.abort(ve);
	}), e.ac = null);
	try {
		e.f |= oe;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = hr(e);
		if (rt() && ar !== null && !Qn && f !== null && !(e.f & 6146)) for (var p = 0; p < ar.length; p++) pr(ar[p], e);
		if (i !== null && i !== e) {
			if (cr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = cr;
			if (t !== null) for (let e of t) e.rv = cr;
			ar !== null && (r === null ? r = ar : r.push(...ar));
		}
		return e.f & 8388608 && (e.f ^= ce), d;
	} catch (t) {
		return hr(e), xn(t);
	} finally {
		e.f ^= oe, rr = t, ir = n, ar = r, z = i, tr = a, Xe(o), Qn = s, lr = c;
	}
}
function hr(e) {
	var t = e.deps, n = j?.is_fork;
	if (rr !== null) {
		var r;
		if (n || _r(e, ir), t !== null && ir > 0) for (t.length = ir + rr.length, r = 0; r < rr.length; r++) t[ir + r] = rr[r];
		else e.deps = t = rr;
		if (En() && e.f & 512) for (r = ir; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && ir < t.length && (_r(e, ir), t.length = ir);
	return t;
}
function gr(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var i = a.call(r, e);
		if (i !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[i] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (rr === null || !o.call(rr, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && ut(c), c.ac !== null && ht(() => {
			c.ac.abort(ve), c.ac = null, lt(c, x);
		}), Dt(c), _r(c, 0);
	}
}
function _r(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) gr(e, n[r]);
}
function vr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		lt(e, b);
		var n = B;
		B = e;
		try {
			t & 16777232 ? Bn(e) : zn(e), Rn(e);
			var r = mr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = sr;
		} finally {
			B = n;
		}
	}
}
async function yr() {
	await Promise.resolve(), Bt();
}
function V(e) {
	var t = !!(e.f & 2);
	if (Yn?.add(e), z !== null && !Qn && !(B !== null && B.f & 16384) && (tr === null || !tr.has(e))) {
		var n = z.deps;
		if (z.f & 2097152) e.rv < cr && (e.rv = cr, rr === null && n !== null && n[ir] === e ? ir++ : rr === null ? rr = [e] : rr.push(e));
		else {
			z.deps ??= [], o.call(z.deps, e) || z.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [z] : o.call(r, z) || r.push(z);
		}
	}
	if (Xn && Jt.has(e)) return Jt.get(e);
	if (t) {
		var i = e;
		if (Xn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || xr(i)) && (a = Tt(i)), Jt.set(i, a), a;
		}
		var s = !(i.f & 512) && !Qn && z !== null && !!(z.f & 512), c = (i.f & ee) === 0;
		fr(i) && (s && (i.f |= 512), Et(i)), s && !c && (Ot(i), br(i));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function br(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : o.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (Ot(n), br(n));
	}
}
function xr(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Jt.has(t) || t.f & 2 && xr(t)) return !0;
	return !1;
}
function H(e) {
	var t = Qn;
	try {
		return Qn = !0, e();
	} finally {
		Qn = t;
	}
}
function Sr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (le in e) Cr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && le in n && Cr(n);
		}
	}
}
function Cr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Cr(e[n], t);
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
var wr = Symbol("events"), Tr = /* @__PURE__ */ new Set(), Er = /* @__PURE__ */ new Set();
function Dr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Pr.call(t, e), !e.cancelBubble) return ht(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, ot(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Or(e, t, n, r = {}) {
	var i = Dr(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function kr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Dr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Dn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Ar(e, t, n) {
	(t[wr] ??= {})[e] = n;
}
function jr(e) {
	for (var t = 0; t < e.length; t++) Tr.add(e[t]);
	for (var n of Er) n(e);
}
var Mr = null, Nr = !1;
function Pr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Mr = e, Nr || (Nr = !0, setTimeout(() => {
		Nr = !1, Mr = null;
	}));
	var o = 0, s = Mr === e && e[wr];
	if (s) {
		var l = i.indexOf(s);
		if (l !== -1 && (t === document || t === window)) {
			e[wr] = t;
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
		var d = z, f = B;
		$n(null), er(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[wr]?.[r];
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
			e[wr] = t, delete e.currentTarget, $n(d), er(f);
		}
	}
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/reconciler.js
var Fr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Ir(e) {
	return Fr?.createHTML(e) ?? e;
}
function Lr(e) {
	var t = yn("template");
	return t.innerHTML = Ir(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/template.js
function Rr(e, t) {
	var n = B;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return Rr(E, null), E;
		i === void 0 && (i = Lr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ mn(i)));
		var t = r || ln ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ mn(t), s = t.lastChild;
			Rr(o, s);
		} else Rr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function zr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (T) return Rr(E, null), E;
		if (!o) {
			var e = /* @__PURE__ */ mn(Lr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ mn(e);) o.appendChild(/* @__PURE__ */ mn(e));
			else o = /* @__PURE__ */ mn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ mn(t), r = t.lastChild;
			Rr(n, r);
		} else Rr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Br(e, t) {
	return /* @__PURE__ */ zr(e, t, "svg");
}
function Vr(e = "") {
	if (!T) {
		var t = pn(e + "");
		return Rr(t, t), t;
	}
	var n = E;
	return n.nodeType === 3 ? bn(n) : (n.before(n = pn()), Te(n)), Rr(n, n), n;
}
function W() {
	if (T) return Rr(E, null), E;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = pn();
	return e.append(t, n), Rr(t, n), e;
}
function G(e, t) {
	if (T) {
		var n = B;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = E), Ee();
	} else e !== null && e.before(t);
}
function Hr() {
	if (T && E && E.nodeType === 8 && E.textContent?.startsWith("$")) {
		let e = E.textContent.substring(1);
		return Ee(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/utils.js
function Ur(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var Wr = [
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
function Gr(e) {
	return Wr.includes(e);
}
var Kr = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), qr = {
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
function Jr(e) {
	return e = e.toLowerCase(), qr[e] ?? e;
}
[...Kr];
var Yr = ["touchstart", "touchmove"];
function Xr(e) {
	return Yr.includes(e);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/create-subscriber.js
function Zr(e) {
	let t = 0, n = Xt(0), r;
	return () => {
		En() && (V(n), Pn(() => (t === 0 && (r = H(() => e(() => nn(n)))), t += 1, () => {
			ot(() => {
				--t, t === 0 && (r?.(), r = void 0, nn(n));
			});
		})));
	};
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Qr = ne | re;
function $r(e, t, n, r) {
	new ei(e, t, n, r);
}
var ei = class {
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
	#f = /* @__PURE__ */ new Map();
	#p = null;
	#m = Zr(() => (this.#p = Xt(this.#l), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Fn(() => {
			if (T) {
				let e = ke(this.#t);
				Ee();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#g(t);
				} else t ? this.#y() : this.#h();
			} else this.#b();
		}, Qr), T && (this.#e = E);
	}
	#h() {
		try {
			this.#a = Ln(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#g(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#_(e);
		ot(r), t && (this.#s = Ln(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#_(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#v() || (t ? Ce() : (t = !0, n && Ge(), this.#s !== null && Wn(this.#s, () => {
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
					Sn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#v() {
		return (this.#i.f & (w | te)) !== 0;
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Ln(() => e(this.#e)), ot(() => {
			if (!this.#v()) {
				var e = this.#c = document.createDocumentFragment(), t = pn(), n = !1;
				e.append(t), this.#a = this.#S(() => {
					try {
						return Ln(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							Sn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#x(j)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Wn(this.#o, () => {
					this.#o = null;
				}), this.#x(j));
			}
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Ln(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Jn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Ln(() => t(this.#e));
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_reactions(this.#f);
	}
	defer_effect(e) {
		dt(e, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = B, n = z, r = Ye;
		er(this.#i), $n(this.#i), Xe(this.#i.ctx);
		try {
			return zt.ensure(), e();
		} finally {
			er(t), $n(n), Xe(r);
		}
	}
	#C(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Wn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#C(e, t);
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !this.#p || this.#d || (this.#d = !0, ot(() => {
			this.#d = !1, this.#p && en(this.#p, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#m(), V(this.#p);
	}
	error(t) {
		if (t === e || !this.#n.onerror && !this.#n.failed) throw t;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#v() || this.#w(t);
		})) : this.#w(t);
	}
	#w(e) {
		this.#a &&= (Vn(this.#a), null), this.#o &&= (Vn(this.#o), null), this.#s &&= (Vn(this.#s), null), T && (Te(this.#t), De(), Te(Oe()));
		let t = this.#n.failed, n = (e) => {
			if (this.#v()) return;
			let { reset: n, invoke_onerror: r } = this.#_(e);
			r(), t && !this.#v() && (this.#s = this.#S(() => {
				try {
					return Ln(() => {
						var r = B;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Sn(e, this.#i.parent), null;
				}
			}));
		};
		ot(() => {
			if (!this.#v()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					Sn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Sn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
};
function ti(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ge] ??= e.nodeValue) && (e[ge] = n, e.nodeValue = `${n}`);
}
function ni(e, t) {
	return ii(e, t);
}
var ri = /* @__PURE__ */ new Map();
function ii(t, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: c = !0, transformError: l }) {
	fn();
	var u = void 0, d = jn(() => {
		var c = r ?? n.appendChild(pn());
		$r(c, { pending: () => {} }, (n) => {
			O({});
			var r = Ye;
			if (o && (r.c = o), a && (i.$$events = a), T && Rr(n, null), u = t(n, i) || nt(), T && (B.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw xe(), e;
			k();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Xr(r);
					for (let e of [n, document]) {
						var a = ri.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ri.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Pr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(s(Tr)), Er.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = ri.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Pr), t.delete(e), t.size === 0 && ri.delete(r)) : t.set(e, i);
			}
			Er.delete(f), c !== r && c.parentNode?.removeChild(c);
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
			if (n) Kn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Kn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Vn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Jn(r, t), t.append(pn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Vn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Wn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Vn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = vn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = pn();
				i.append(a), this.#n.set(e, {
					effect: Ln(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Ln(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else T && (this.anchor = E), this.#a(n);
	}
};
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function K(e, t, ...n) {
	var r = new si(e);
	Fn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, ne);
}
function ci(e) {
	Ye === null && Ne("onMount"), L(() => {
		let t = H(e);
		if (typeof t == "function") return t;
	});
}
function li(e) {
	Ye === null && Ne("onDestroy"), ci(() => () => H(e));
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/attachments/index.js
function ui() {
	return Symbol(r);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	T && (r = E, Ee());
	var i = new si(e), a = n ? ne : 0;
	function o(e, t) {
		if (T) {
			var n = ke(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Oe();
				Te(a), i.anchor = a, we(!1), i.ensure(e, t), we(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Fn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/key.js
var di = Symbol("NaN");
function fi(e, t, n) {
	T && Ee();
	var r = new si(e), i = !rt();
	Fn(() => {
		var e = t();
		e !== e && (e = di), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/blocks/each.js
function pi(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Wn(n, () => {
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
			_n(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= ae, Jn(a, document.createDocumentFragment())) : Vn(t[i], n);
	}
}
var hi;
function gi(e, t, n, r, a, o = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = T ? Te(/* @__PURE__ */ mn(u)) : u.appendChild(pn());
	}
	T && Ee();
	var d = null, f = /* @__PURE__ */ Ct(() => {
		var e = n();
		return i(e) ? e : e == null ? [] : s(e);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var n = V(f);
			_.fallback = d, vi(_, n, c, t, r), d !== null && (n.length === 0 ? d.f & 33554432 ? (d.f ^= ae, bi(d, null, c)) : Kn(d) : Wn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: Fn(() => {
			var e = V(f), i = e.length;
			let s = !1;
			T && ke(c) === "[!" != (i === 0) && (c = Oe(), Te(c), we(!1), s = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = j, v = vn(), y = 0; y < i; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (c = E, s = !0, we(!1));
				var b = e[y], x = r(b, y), S = m ? null : l.get(x);
				S ? (S.v && en(S.v, b), S.i && en(S.i, y), v && _.unskip_effect(S.e)) : (S = yi(l, m ? c : hi ??= pn(), b, x, y, a, t, n), m || (S.e.f |= ae), l.set(x, S)), u.add(x);
			}
			if (i === 0 && o && !d && (m ? d = Ln(() => o(c)) : (d = Ln(() => o(hi ??= pn())), d.f |= ae)), i > u.size && Ie("", "", ""), T && i > 0 && Te(Oe()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			s && we(!0), V(f);
		}),
		flags: t,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, T && (c = E);
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
		if (_.f & 8192 && (Kn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ae, _ === l) bi(_, null, n);
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
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = _i(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			pi(e, w, te);
		}
	}
	a && ot(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function yi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Xt(n) : /* @__PURE__ */ Zt(n, !1, !1) : null, l = o & 2 ? Xt(i) : null;
	return {
		v: c,
		i: l,
		e: Ln(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function bi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ hn(r);
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
	T && (r = E, Ee());
	var i = new si(e);
	Fn(() => {
		var e = t() ?? null;
		if (T && ke(r) === "[" != (e !== null)) {
			var a = Oe();
			Te(a), i.anchor = a, we(!1), i.ensure(e, e && ((t) => n(t, e))), we(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, ne);
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ci(e, t, n) {
	Mn(() => {
		var r = H(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Pn(() => {
				var e = n();
				Sr(e), i && je(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function wi(e, t) {
	var n = void 0, r;
	In(() => {
		n !== (n = t()) && (r &&= (Vn(r), null), n && (r = Ln(() => {
			Mn(() => n(e));
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
	var o = e[me];
	if (T || o !== n || o === void 0) {
		var s = ki(n, r, a);
		T && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[me] = n;
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
	var i = e[he];
	if (T || i !== t) {
		var a = Mi(t, r);
		T && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[he] = t;
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
			Ii(c, r ? a.includes(l) : sn(l, n));
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
		if (!i(t)) return Se();
		for (var r of e.options) r.selected = t.includes(Vi(r));
	} else {
		for (r of e.options) if (sn(Vi(r), t)) {
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
	}), Dn(() => {
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
var Ui = Symbol("class"), Wi = Symbol("style"), Gi = Symbol("is custom element"), Ki = Symbol("is html"), qi = ye ? "link" : "LINK", Ji = ye ? "input" : "INPUT", Yi = ye ? "option" : "OPTION", Xi = ye ? "select" : "SELECT", Zi = ye ? "progress" : "PROGRESS";
function Qi(e) {
	if (T) {
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
		e[_e] = n, ot(n), mt();
	}
}
function $i(e, t, n, r) {
	var i = ta(e);
	if (!(T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === qi))) {
		var a = i[t];
		a !== (i[t] = n) && (t === "loading" && (e[fe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ra(e).has(t) ? e[t] = n : (!T || typeof n != "number" && typeof n != "boolean" || a !== String(n)) && e.setAttribute(t, n));
	}
}
function ea(e, n, r, i, a = !1, o = !1) {
	T && a && e.nodeName === Ji && ("defaultValue" in r || "defaultChecked" in r || Qi(e));
	var s = ta(e), c = s[Gi], l = !s[Ki];
	let u = T && c;
	u && we(!1);
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
							var y = Gr(r);
							if (Ur(r) && (r = r.slice(0, -7), t.capture = !0), !y && _) {
								if (u != null) continue;
								e.removeEventListener(r, d[n], t), d[n] = null;
							}
							if (y) Ar(r, e, u), jr([r]);
							else if (u != null) {
								function i(e) {
									d[a].call(this, e);
								}
								d[n] = Dr(r, e, i, t);
							}
						} else if (a === "style") $i(e, a, u);
						else if (a === "autofocus") ft(e, !!u);
						else if (!c && (a === "__value" || a === "value" && u != null)) e.__value = u, (_ == null || e.value !== u || u === 0 && e.nodeName === Zi) && (e.value = u);
						else if (a === "selected" && f) Ii(e, u);
						else {
							var b = a;
							l || (b = Jr(b));
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
		u && we(!0);
	}
	return d;
}
function J(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	gt(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === Xi, l = !1;
		if (In(() => {
			var u = t(...n.map(V)), d = ea(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && Li(f, u.defaultValue), "value" in u && zi(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || Vn(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description !== "@attach" || r && p === r[t] || (i[t] && Vn(i[t]), i[t] = Ln(() => wi(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Mn(() => {
				var e = r;
				"defaultValue" in e && Li(u, e.defaultValue), zi(u, e.value, !0), Bi(u);
			});
		}
		l = !0;
	});
}
function ta(e) {
	return e[pe] ??= {
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
	return e === t || e?.[le] === t;
}
function aa(e = nt(), t, n, r) {
	var i = Ye.r, a = B;
	return Mn(() => {
		var o, s;
		return Pn(() => {
			o = s, s = r?.() || [], H(() => {
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
	let r = H(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/store/shared/index.js
var sa = [];
function ca(e, t = g) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (je(e, t) && (e = t, n)) {
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
		if (t === le || t === de) return !1;
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
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ bt(r), V(u)) : (c && (c = !1, s = o ? H(r) : r), s);
	let f;
	if (a) {
		var p = le in e || de in e;
		f = l(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = da(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ve(t), f(m)));
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
	var v = !1, y = (n & 1 ? bt : Ct)(() => (v = !1, g()));
	a && V(y);
	var b = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? an(e) : e;
			return N(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Xn && v || b.f & 16384 ? y.v : V(y);
	});
}
// packages/ui-kit/src/gesture/single-pointer-session.svelte.ts
function ga() {
	let e = /* @__PURE__ */ M(null), t = null;
	function n() {
		let n = H(() => V(e)), r = t;
		if (N(e, null), t = null, n !== null && r) try {
			r.hasPointerCapture(n) && r.releasePointerCapture(n);
		} catch {}
	}
	return {
		get id() {
			return V(e);
		},
		start(n, r = null) {
			if (V(e) !== null || n.button !== 0 || !n.isPrimary) return !1;
			N(e, n.pointerId, !0), t = r;
			try {
				r?.setPointerCapture(n.pointerId);
			} catch {}
			return !0;
		},
		owns(t) {
			return V(e) !== null && V(e) === t.pointerId;
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
	return "1.3.7";
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
		capabilities: e.capabilities,
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
	let t, n = Zr((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return En() ? (n(), t) : la(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), jr(["input"]), jr(["change"]), jr(["change"]);
// node_modules/.pnpm/svelte@5.57.3/node_modules/svelte/src/reactivity/map.js
var Ma = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ M(0);
	#n = /* @__PURE__ */ M(0);
	#r = lr || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return lr === this.#r ? /* @__PURE__ */ M(e) : Xt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return V(this.#t), !1;
		}
		return V(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				V(this.#t);
				return;
			}
		}
		return V(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), N(this.#n, super.size), nn(o);
		else if (i !== t) {
			nn(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			s !== null && r.reactions?.every((e) => s.has(e)) || nn(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), N(n, -1)), r && (N(this.#n, super.size), nn(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			N(this.#n, 0);
			for (var t of e.values()) N(t, -1);
			nn(this.#t), e.clear();
		}
	}
	#a() {
		V(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) V(n);
	}
	keys() {
		return V(this.#t), super.keys();
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
		return V(this.#n), super.size;
	}
}, Na = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = Zr(t);
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
		super(() => r.matches, (e) => Or(r, "change", e));
	}
};
// packages/ui-kit/src/schema-form/inputs/WallpaperPreviewField.svelte
Zr((e) => {
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
}), jr([
	"click",
	"pointerdown",
	"pointerup"
]), jr(["change"]);
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
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/is.js
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
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var Ua = Symbol("box"), Wa = Symbol("is-writable");
function X(e, t) {
	let n = /* @__PURE__ */ A(e);
	return t ? {
		[Ua]: !0,
		[Wa]: !0,
		get current() {
			return V(n);
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
	let t = /* @__PURE__ */ M(an(e));
	return {
		[Ua]: !0,
		[Wa]: !0,
		get current() {
			return V(t);
		},
		set current(e) {
			N(t, e, !0);
		}
	};
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
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
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/strings.js
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
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
var xo = 1e3, So = /* @__PURE__ */ new Map();
function Co(e) {
	let t = So.get(e);
	return t === void 0 && (t = e.startsWith("-moz-") || e.startsWith("-webkit-") || e.startsWith("-ms-") || e.startsWith("-o-") ? _o(e) : e.startsWith("--") ? e : vo(e), So.size >= xo && So.clear(), So.set(e, t)), t;
}
var wo = /["'\\{}]|\/\*/, To = /^[-\w]+$/;
function Eo(e) {
	if (wo.test(e)) return null;
	let t = [], n = 0, r = 0, i = -1;
	for (let a = 0; a <= e.length; a++) {
		let o = a < e.length ? e.charCodeAt(a) : 59;
		if (o === 40) n++;
		else if (o === 41) {
			if (--n < 0) return null;
		} else if (o === 58) i < 0 && (i = a);
		else if (o === 59) {
			if (n !== 0) return null;
			let o = e.slice(r, a);
			if (i < 0) {
				if (o.trim() || t.length === 0) return null;
			} else {
				let n = e.slice(r, i).trim(), o = e.slice(i + 1, a).trim();
				if (!To.test(n) || !o) return null;
				t.push(n, o);
			}
			r = a + 1, i = -1;
		}
	}
	return t;
}
function Do(e, t) {
	let n = Eo(t);
	if (n) for (let t = 0; t < n.length; t += 2) e[Co(n[t])] = n[t + 1];
	else fo(t, (t, n) => {
		e[Co(t)] = n;
	});
}
function Oo(e) {
	if (!e) return {};
	let t = {};
	return Do(t, e), t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
function ko(...e) {
	return (...t) => {
		for (let n of e) typeof n == "function" && n(...t);
	};
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function Ao(e, t) {
	let n = RegExp(e, "g");
	return (e) => {
		if (typeof e != "string") throw TypeError(`expected an argument of type string, but got ${typeof e}`);
		return e.match(n) ? e.replace(n, t) : e;
	};
}
var jo = Ao(/[A-Z]/, (e) => `-${e.toLowerCase()}`), Mo = /* @__PURE__ */ new Map();
function No(e) {
	let t = Mo.get(e);
	return t === void 0 && (t = jo(e), Mo.size >= 1e3 && Mo.clear(), Mo.set(e, t)), t;
}
function Po(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`expected an argument of type object, but got ${typeof e}`);
	let t = "";
	for (let n of Object.keys(e)) {
		let r = e[n];
		r != null && r !== "" && (t += `${t ? "\n" : ""}${No(n)}: ${r};`);
	}
	return t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/style.js
function Fo(e = {}) {
	return Po(e).replace("\n", " ");
}
var Io = new Set(/* @__PURE__ */ "onabort.onanimationcancel.onanimationend.onanimationiteration.onanimationstart.onauxclick.onbeforeinput.onbeforetoggle.onblur.oncancel.oncanplay.oncanplaythrough.onchange.onclick.onclose.oncompositionend.oncompositionstart.oncompositionupdate.oncontextlost.oncontextmenu.oncontextrestored.oncopy.oncuechange.oncut.ondblclick.ondrag.ondragend.ondragenter.ondragleave.ondragover.ondragstart.ondrop.ondurationchange.onemptied.onended.onerror.onfocus.onfocusin.onfocusout.onformdata.ongotpointercapture.oninput.oninvalid.onkeydown.onkeypress.onkeyup.onload.onloadeddata.onloadedmetadata.onloadstart.onlostpointercapture.onmousedown.onmouseenter.onmouseleave.onmousemove.onmouseout.onmouseover.onmouseup.onpaste.onpause.onplay.onplaying.onpointercancel.onpointerdown.onpointerenter.onpointerleave.onpointermove.onpointerout.onpointerover.onpointerup.onprogress.onratechange.onreset.onresize.onscroll.onscrollend.onsecuritypolicyviolation.onseeked.onseeking.onselect.onselectionchange.onselectstart.onslotchange.onstalled.onsubmit.onsuspend.ontimeupdate.ontoggle.ontouchcancel.ontouchend.ontouchmove.ontouchstart.ontransitioncancel.ontransitionend.ontransitionrun.ontransitionstart.onvolumechange.onwaiting.onwebkitanimationend.onwebkitanimationiteration.onwebkitanimationstart.onwebkittransitionend.onwheel".split("."));
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/merge-props.js
function Lo(e) {
	return Io.has(e);
}
function Z(...e) {
	let t = { ...e[0] };
	for (let n = 1; n < e.length; n++) {
		let r = e[n];
		if (r) {
			for (let e of Object.keys(r)) {
				let n = t[e], i = r[e], a = typeof n == "function", o = typeof i == "function";
				if (a && o && Lo(e)) t[e] = Ja(n, i);
				else if (a && o) t[e] = ko(n, i);
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
						let r = Oo(i);
						t[e] = {
							...n,
							...r
						};
					} else if (o && a) t[e] = {
						...Oo(n),
						...i
					};
					else if (o && s) {
						let r = Oo(n), a = Oo(i);
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
	return typeof t.style == "object" && (t.style = Fo(t.style).replaceAll("\n", " ")), t.hidden === !1 && (t.hidden = void 0, delete t.hidden), t.disabled === !1 && (t.disabled = void 0, delete t.disabled), t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/sr-only-styles.js
var Ro = {
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
}, zo = Fo(Ro), Bo = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plugin-svelte@_b6f55f7b89ea8a48557b07a82bb32300/node_modules/runed/dist/internal/utils/dom.js
function Vo(e) {
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
		let { window: t = Bo, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = Zr((e) => {
			let n = Or(t, "focusin", e), r = Or(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? Vo(this.#e) : null;
	}
}();
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plugin-svelte@_b6f55f7b89ea8a48557b07a82bb32300/node_modules/runed/dist/internal/utils/is.js
function Ho(e) {
	return typeof e == "function";
}
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plugin-svelte@_b6f55f7b89ea8a48557b07a82bb32300/node_modules/runed/dist/utilities/context/context.js
var Uo = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e, this.#t = Symbol(e);
	}
	get key() {
		return this.#t;
	}
	exists() {
		return et(this.#t);
	}
	get() {
		let e = Qe(this.#t);
		if (e === void 0) throw Error(`Context "${this.#e}" not found`);
		return e;
	}
	getOr(e) {
		let t = Qe(this.#t);
		return t === void 0 ? e : t;
	}
	set(e) {
		return $e(this.#t, e);
	}
};
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plugin-svelte@_b6f55f7b89ea8a48557b07a82bb32300/node_modules/runed/dist/utilities/watch/watch.svelte.js
function Wo(e, t) {
	switch (e) {
		case "post":
			L(t);
			break;
		case "pre": kn(t);
	}
}
function Go(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	Wo(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = H(() => n(t, o));
		return o = t, r;
	});
}
function Ko(e, t, n) {
	Go(e, "post", t, n);
}
function qo(e, t, n) {
	Go(e, "pre", t, n);
}
Ko.pre = qo;
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plugin-svelte@_b6f55f7b89ea8a48557b07a82bb32300/node_modules/runed/dist/internal/utils/get.js
function Jo(e) {
	return Ho(e) ? e() : e;
}
// node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plugin-svelte@_b6f55f7b89ea8a48557b07a82bb32300/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var Yo = class {
	#e = {
		width: 0,
		height: 0
	};
	#t = !1;
	#n;
	#r;
	#i;
	#a = /* @__PURE__ */ A(() => (V(this.#s)?.(), this.getSize().width));
	#o = /* @__PURE__ */ A(() => (V(this.#s)?.(), this.getSize().height));
	#s = /* @__PURE__ */ A(() => {
		let e = Jo(this.#r);
		if (e) return Zr((t) => {
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
		this.#i = t.window ?? Bo, this.#n = t, this.#r = e, this.#e = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		let e = Jo(this.#r);
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
		return V(this.#s)?.(), this.getSize();
	}
	get width() {
		return V(this.#a);
	}
	get height() {
		return V(this.#o);
	}
};
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/on-destroy-effect.svelte.js
function Xo(e) {
	L(() => () => {
		e();
	});
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function Zo(e) {
	yr().then(e);
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/dom.js
var Qo = 1, $o = 9, es = 11;
function ts(e) {
	return Ba(e) && e.nodeType === Qo && typeof e.nodeName == "string";
}
function ns(e) {
	return Ba(e) && e.nodeType === $o;
}
function rs(e) {
	return Ba(e) && e.constructor?.name === "VisualViewport";
}
function is(e) {
	return Ba(e) && e.nodeType !== void 0;
}
function as(e) {
	return is(e) && e.nodeType === es && "host" in e;
}
function os(e, t) {
	if (!e || !t || !ts(e) || !ts(t)) return !1;
	let n = t.getRootNode?.();
	if (e === t || e.contains(t)) return !0;
	if (n && as(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function ss(e) {
	return ns(e) ? e : rs(e) ? e.document : e?.ownerDocument ?? document;
}
function cs(e) {
	return as(e) ? cs(e.host) : ns(e) ? e.defaultView ?? window : ts(e) ? e.ownerDocument?.defaultView ?? window : window;
}
function ls(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var us = class {
	element;
	#e = /* @__PURE__ */ A(() => this.element.current ? this.element.current.getRootNode() ?? document : document);
	get root() {
		return V(this.#e);
	}
	set root(e) {
		N(this.#e, e);
	}
	constructor(e) {
		this.element = typeof e == "function" ? X(e) : e;
	}
	getDocument = () => ss(this.root);
	getWindow = () => this.getDocument().defaultView ?? window;
	getActiveElement = () => ls(this.root);
	isActiveElement = (e) => e === this.getActiveElement();
	getElementById(e) {
		return this.root.getElementById(e);
	}
	querySelector = (e) => this.root ? this.root.querySelector(e) : null;
	querySelectorAll = (e) => this.root ? this.root.querySelectorAll(e) : [];
	setTimeout = (e, t) => this.getWindow().setTimeout(e, t);
	clearTimeout = (e) => this.getWindow().clearTimeout(e);
};
// node_modules/.pnpm/svelte-toolbelt@0.10.7_@sveltejs+kit@3.1.0_@opentelemetry+api@1.9.1_@sveltejs+vite-plug_9807408085700672b73a79f2ce98ce21/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
function ds(e, t) {
	return { [ui()]: (n) => Ga(e) ? (e.current = n, H(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e.current = null, t?.(null));
	}) : (e(n), H(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e(null), t?.(null));
	}) };
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/attrs.js
function fs(e) {
	return e ? "true" : "false";
}
function ps(e) {
	return e ? "true" : void 0;
}
function Q(e) {
	return e ? "" : void 0;
}
function ms(e) {
	return e ? "open" : "closed";
}
function hs(e) {
	return e === "starting" ? { "data-starting-style": "" } : e === "ending" ? { "data-ending-style": "" } : {};
}
var gs = class {
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
function _s(e) {
	let t = new gs(e);
	return {
		...t.attrs,
		selector: t.selector,
		getAttr: t.getAttr
	};
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/kbd-constants.js
var vs = "ArrowDown", ys = "ArrowLeft", bs = "ArrowRight", xs = "ArrowUp", Ss = "Enter", Cs = typeof document < "u", ws = Ts();
function Ts() {
	return Cs && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Es(e) {
	return e instanceof HTMLElement;
}
function Ds(e) {
	return e instanceof Element;
}
function Os(e) {
	return e instanceof Element || e instanceof SVGElement;
}
function ks(e) {
	return e === null;
}
function As(e) {
	return e.pointerType === "touch";
}
function js(e) {
	return e !== null;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/animations-complete.js
var Ms = class {
	#e;
	#t = null;
	#n = null;
	#r = 0;
	constructor(e) {
		this.#e = e, Xo(() => this.#i());
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
		this.#e.afterTick.current ? Zo(n) : n();
	}
}, Ns = class {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ M(!1);
	#i = /* @__PURE__ */ M(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, N(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new Ms({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), Xo(() => this.#s()), Ko(() => this.#e.open.current, (e) => {
			!this.#a && (this.#a = !0, e === V(this.#r)) || (this.#s(), !e && this.#e.shouldSkipExitAnimation?.() ? (N(this.#r, !1), N(this.#i, void 0), this.#e.onComplete?.()) : (e && N(this.#r, !0), N(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && N(this.#i, void 0);
			})), this.#t ? this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || N(this.#r, !1), N(this.#i, void 0), this.#e.onComplete?.());
			}) : (e || N(this.#r, !1), N(this.#i, void 0), this.#e.onComplete?.())));
		});
	}
	get shouldRender() {
		return V(this.#r);
	}
	get transitionStatus() {
		return V(this.#i);
	}
	#s() {
		this.#o !== null && (window.cancelAnimationFrame(this.#o), this.#o = null);
	}
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/noop.js
function $() {}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/create-id.js
function Ps(e, t) {
	return t === void 0 ? `bits-${e}` : `bits-${e}-${t}`;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
var Fs = _s({
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
}), Is = new Uo("Dialog.Root | AlertDialog.Root"), Ls = class e {
	static create(t) {
		let n = Is.getOr(null);
		return Is.set(new e(t, n));
	}
	opts;
	#e = /* @__PURE__ */ M(null);
	get triggerNode() {
		return V(this.#e);
	}
	set triggerNode(e) {
		N(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ M(null);
	get contentNode() {
		return V(this.#t);
	}
	set contentNode(e) {
		N(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ M(null);
	get overlayNode() {
		return V(this.#n);
	}
	set overlayNode(e) {
		N(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ M(null);
	get descriptionNode() {
		return V(this.#r);
	}
	set descriptionNode(e) {
		N(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ M(void 0);
	get contentId() {
		return V(this.#i);
	}
	set contentId(e) {
		N(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ M(void 0);
	get titleId() {
		return V(this.#a);
	}
	set titleId(e) {
		N(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ M(void 0);
	get triggerId() {
		return V(this.#o);
	}
	set triggerId(e) {
		N(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ M(void 0);
	get descriptionId() {
		return V(this.#s);
	}
	set descriptionId(e) {
		N(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ M(null);
	get cancelNode() {
		return V(this.#c);
	}
	set cancelNode(e) {
		N(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ M(0);
	get nestedOpenCount() {
		return V(this.#l);
	}
	set nestedOpenCount(e) {
		N(this.#l, e, !0);
	}
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(e, t) {
		this.opts = e, this.parent = t, this.depth = t ? t.depth + 1 : 0, this.handleOpen = this.handleOpen.bind(this), this.handleClose = this.handleClose.bind(this), this.contentPresence = new Ns({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			enabled: !0,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new Ns({
			ref: X(() => this.overlayNode),
			open: this.opts.open,
			enabled: !0
		}), Ko(() => this.opts.open.current, (e) => {
			this.parent && (e ? this.parent.incrementNested() : this.parent.decrementNested());
		}, { lazy: !0 }), Xo(() => {
			this.opts.open.current && this.parent?.decrementNested();
		});
	}
	handleOpen() {
		this.opts.open.current || (this.opts.open.current = !0);
	}
	handleClose() {
		this.opts.open.current && (this.opts.open.current = !1);
	}
	getBitsAttr = (e) => Fs.getAttr(e, this.opts.variant.current);
	incrementNested() {
		this.nestedOpenCount++, this.parent?.incrementNested();
	}
	decrementNested() {
		this.nestedOpenCount !== 0 && (this.nestedOpenCount--, this.parent?.decrementNested());
	}
	#u = /* @__PURE__ */ A(() => ({ "data-state": ms(this.opts.open.current) }));
	get sharedProps() {
		return V(this.#u);
	}
	set sharedProps(e) {
		N(this.#u, e);
	}
}, Rs = class e {
	static create(t) {
		return new e(t, Is.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.titleId = this.opts.id.current, this.attachment = ds(this.opts.ref), Ko.pre(() => this.opts.id.current, (e) => {
			this.root.titleId = e;
		});
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, zs = class e {
	static create(t) {
		return new e(t, Is.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.descriptionId = this.opts.id.current, this.attachment = ds(this.opts.ref, (e) => {
			this.root.descriptionNode = e;
		}), Ko.pre(() => this.opts.id.current, (e) => {
			this.root.descriptionId = e;
		});
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Bs = class e {
	static create(t) {
		return new e(t, Is.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref, (e) => {
			this.root.contentNode = e, this.root.contentId = e?.id;
		});
	}
	#e = /* @__PURE__ */ A(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return V(this.#e);
	}
	set snippetProps(e) {
		N(this.#e, e);
	}
	#t = /* @__PURE__ */ A(() => ({
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
		...hs(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
}, Vs = class e {
	static create(t) {
		return new e(t, Is.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref, (e) => this.root.overlayNode = e);
	}
	#e = /* @__PURE__ */ A(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return V(this.#e);
	}
	set snippetProps(e) {
		N(this.#e, e);
	}
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": Q(this.root.nestedOpenCount > 0),
		"data-nested": Q(this.root.parent !== null),
		...hs(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
}, Hs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"level"
]), Us = /* @__PURE__ */ U("<div><!></div>");
function Ws(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = Y(t, "level", 3, 2), o = /* @__PURE__ */ pa(t, Hs), s = Rs.create({
		id: X(() => r()),
		level: X(() => a()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props));
	var l = W(), u = F(l), d = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(c) })), G(e, n);
	}, f = (e) => {
		var n = Us();
		J(n, () => ({ ...V(c) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), G(e, l), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Gs(e, t) {
	var n = W();
	fi(F(n), () => t.children, (e) => {
		var n = W();
		K(F(n), () => t.children ?? g), G(e, n);
	}), G(e, n);
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var Ks = new Uo("BitsConfig");
function qs() {
	let e = new Js(null, {});
	return Ks.getOr(e).opts;
}
var Js = class {
	opts;
	constructor(e, t) {
		let n = Ys(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function Ys(e, t) {
	return (n) => X(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function Xs(e, t) {
	return (n) => {
		let r = qs();
		return X(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var Zs = Xs((e) => e.defaultLocale, "en"), Qs = Xs((e) => e.defaultPortalTo, "body");
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function $s(e, t) {
	O(t, !0);
	let n = Qs(() => t.to), r = tt(), i = /* @__PURE__ */ A(a);
	function a() {
		if (!Cs || t.disabled) return null;
		let e = null;
		return e = typeof n.current == "string" ? document.querySelector(n.current) : n.current, e;
	}
	let o;
	function s() {
		o &&= (oi(o), null);
	}
	Ko([() => V(i), () => t.disabled], ([e, n]) => {
		if (!e || n) s();
		else return o = ni(Gs, {
			target: e,
			props: { children: t.children },
			context: r
		}), () => {
			s();
		};
	});
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.children ?? g), G(e, n);
	};
	q(l, (e) => {
		t.disabled && e(u);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/events.js
var ec = /* @__PURE__ */ new WeakMap();
function tc(e, t = e.composedPath()) {
	ec.set(e, t);
}
function nc(e) {
	return ec.get(e) ?? e.composedPath();
}
function rc(e, t) {
	return t ? Os(e.target) && t.contains(e.target) || nc(e).includes(t) : !1;
}
function ic(e, t) {
	for (let n of nc(e)) if (Os(n) && n.matches(t)) return n;
	return Os(e.target) ? e.target.closest(t) : null;
}
function ac(e, t) {
	tc(t, nc(e));
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/debounce.js
function oc(e, t = 500) {
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
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/elements.js
function sc(e, t) {
	return e === t || e.contains(t);
}
function cc(e) {
	return e?.ownerDocument ?? document;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/dom.js
function lc(e, t) {
	let { clientX: n, clientY: r } = e, i = t.getBoundingClientRect();
	return n < i.left || n > i.right || r < i.top || r > i.bottom;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/menu/context-menu-attributes.js
var uc = "data-context-menu-trigger", dc = "data-context-menu-content";
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var fc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	#e = $;
	#t = () => !1;
	#n = null;
	#r = qa("close");
	#i = { pointerdown: !1 };
	#a = !1;
	#o = null;
	#s = !1;
	#c = void 0;
	#l = $;
	#u = $;
	#d = !1;
	constructor(e) {
		this.opts = e, kn(() => {
			this.#r.current = e.interactOutsideBehavior.current, this.#e = e.onInteractOutside.current, this.#l = e.onFocusOutside.current, this.#t = e.isValidEvent.current, this.#n = e.ref.current;
		});
		let t = $, n = null, r = () => {
			n = null, this.#x(), globalThis.bitsDismissableLayers.delete(this), this.#g.destroy(), this.#u(), t();
		};
		Ko([() => this.opts.enabled.current, () => this.opts.ref.current], ([e, i]) => {
			let a = e ? i : null;
			n !== a && (r(), a && (n = a, this.#c = cc(a), globalThis.bitsDismissableLayers.set(this, this.#r), t = this.#p()));
		}), Xo(() => {
			this.#d = !0, r();
		});
	}
	#f = (e) => {
		e.defaultPrevented || this.#d || !this.#n || Zo(() => {
			this.#d || this.#n && !this.#b(e.target) && e.target && !this.#s && this.#l?.(e);
		});
	};
	#p() {
		let e = this.#c, t = (e) => {
			H(() => {
				this.#g.flush(), this.#_(e), this.#y(e);
			});
		}, n = (e) => {
			e.cancelBubble || e !== this.#o || (this.#v(e), e.pointerType === "touch" ? (this.#g.destroy(), this.#h(e)) : this.#g(e));
		};
		return e.addEventListener("pointerdown", t, !0), e.addEventListener("pointerdown", n), ko(() => e.removeEventListener("pointerdown", t, !0), () => e.removeEventListener("pointerdown", n), Or(e, "focusin", this.#f));
	}
	#m = (e) => {
		let t = e;
		t.defaultPrevented && (t = gc(e)), this.#e(e);
	};
	#h = (e) => {
		if (!this.#n) {
			this.#u();
			return;
		}
		let t = this.#t(e, this.#n) || hc(e, this.#n);
		if (!this.#a || this.#S() || !t) {
			this.#u();
			return;
		}
		let n = e;
		if (n.defaultPrevented && (n = gc(n)), this.#r.current !== "close" && this.#r.current !== "defer-otherwise-close") this.#u();
		else if (e.pointerType === "touch") {
			this.#u();
			let e = null, t = $, n = (e) => {
				t(), this.#m(e);
			};
			t = ko(Or(this.#c, "click", n, { once: !0 }), Or(this.#c, "click", (t) => {
				tc(t), e = setTimeout(() => n(t), 0);
			}, {
				once: !0,
				capture: !0
			}), () => {
				e !== null && clearTimeout(e), e = null;
			}), this.#u = t;
		} else this.#e(n);
	};
	#g = oc(this.#h, 10);
	#_ = (e) => {
		this.#i[e.type] = !0;
	};
	#v = (e) => {
		this.#i[e.type] = !1;
	};
	#y = (e) => {
		this.#o = e, tc(e), this.#n && (this.#a = mc(this));
	};
	#b = (e) => this.#n ? sc(this.#n, e) : !1;
	#x = () => {
		for (let e in this.#i) this.#i[e] = !1;
		this.#a = !1, this.#o = null;
	};
	#S() {
		return Object.values(this.#i).some(Boolean);
	}
	#C = () => {
		this.#s = !0;
	};
	#w = () => {
		this.#s = !1;
	};
	props = {
		onfocuscapture: this.#C,
		onblurcapture: this.#w
	};
};
function pc(e = [...globalThis.bitsDismissableLayers]) {
	return e.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
}
function mc(e) {
	let t = [...globalThis.bitsDismissableLayers], n = pc(t);
	if (n) return n[0] === e;
	let [r] = t[0];
	return r === e;
}
function hc(e, t) {
	let n = e.target;
	if (!Os(n)) return !1;
	let r = !!ic(e, `[${uc}]`), i = !!t.closest(`[${dc}]`);
	return "button" in e && e.button > 0 && !r ? !1 : "button" in e && e.button === 0 && r && i ? !0 : r && i ? !1 : cc(n).documentElement.contains(n) && !rc(e, t) && lc(e, t);
}
function gc(e) {
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
	return ac(e, a), a;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function _c(e, t) {
	O(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "onInteractOutside", 3, $), i = Y(t, "onFocusOutside", 3, $), a = Y(t, "isValidEvent", 3, () => !1), o = fc.create({
		id: X(() => t.id),
		interactOutsideBehavior: X(() => n()),
		onInteractOutside: X(() => r()),
		enabled: X(() => t.enabled),
		onFocusOutside: X(() => i()),
		isValidEvent: X(() => a()),
		ref: H(() => t.ref)
	});
	var s = W();
	K(F(s), () => t.children ?? g, () => ({ props: o.props })), G(e, s), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var vc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	constructor(e) {
		this.opts = e, this.domContext = new us(this.opts.ref);
		let t = $;
		Ko(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => Or(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
	#t = (e) => {
		if (e.key !== "Escape" || !yc(this)) return;
		let t = new KeyboardEvent(e.type, e);
		e.preventDefault();
		let n = this.opts.escapeKeydownBehavior.current;
		(n === "close" || n === "defer-otherwise-close") && this.opts.onEscapeKeydown.current(t);
	};
};
function yc(e) {
	let t = [...globalThis.bitsEscapeLayers], n = t.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
	if (n) return n[0] === e;
	let [r] = t[0];
	return r === e;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function bc(e, t) {
	O(t, !0);
	let n = Y(t, "escapeKeydownBehavior", 3, "close"), r = Y(t, "onEscapeKeydown", 3, $);
	vc.create({
		escapeKeydownBehavior: X(() => n()),
		onEscapeKeydown: X(() => r()),
		enabled: X(() => t.enabled),
		ref: H(() => t.ref)
	});
	var i = W();
	K(F(i), () => t.children ?? g), G(e, i), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var xc = class e {
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
		let n = ls(document);
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
}, Sc = [
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
], Cc = /* #__PURE__ */ Sc.join(","), wc = typeof Element > "u", Tc = wc ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Ec = !wc && Element.prototype.getRootNode ? function(e) {
	return e == null || e.getRootNode == null ? void 0 : e.getRootNode();
} : function(e) {
	return e?.ownerDocument;
}, Dc = function(e, t) {
	t === void 0 && (t = !0);
	var n = e == null || e.getAttribute == null ? void 0 : e.getAttribute("inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : Dc(e.parentNode));
}, Oc = function(e) {
	var t, n = e == null || e.getAttribute == null || (t = e.getAttribute("contenteditable")) == null ? void 0 : t.toLowerCase();
	return n === "" || n === "true" || n === "plaintext-only";
}, kc = function(e, t, n) {
	if (Dc(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(Cc));
	return t && Tc.call(e, Cc) && r.unshift(e), r = r.filter(n), r;
}, Ac = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!Dc(a, !1)) {
			if (a.tagName === "SLOT") {
				var o = a.assignedElements(), s = Ac(o.length ? o : a.children, !0, n);
				n.flatten ? r.push.apply(r, s) : r.push({
					scopeParent: a,
					candidates: s
				});
			} else {
				Tc.call(a, Cc) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
				var c = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), l = !Dc(c, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
				if (c && l) {
					var u = Ac(c === !0 ? a.children : c.children, !0, n);
					n.flatten ? r.push.apply(r, u) : r.push({
						scopeParent: a,
						candidates: u
					});
				} else i.unshift.apply(i, a.children);
			}
		}
	}
	return r;
}, jc = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, Mc = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || Oc(e)) && !jc(e) ? 0 : e.tabIndex;
}, Nc = function(e, t) {
	var n = Mc(e);
	return n < 0 && t && !jc(e) ? 0 : n;
}, Pc = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, Fc = function(e) {
	return e.tagName === "INPUT";
}, Ic = function(e) {
	return Fc(e) && e.type === "hidden";
}, Lc = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, Rc = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, zc = function(e) {
	if (!e.name) return !0;
	var t = e.form || Ec(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = Rc(r, e.form);
	return !i || i === e;
}, Bc = function(e) {
	return Fc(e) && e.type === "radio";
}, Vc = function(e) {
	return Bc(e) && !zc(e);
}, Hc = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, Uc = function(e, t) {
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
	var a = Tc.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (Tc.call(a, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var o = e; e;) {
				var s = e.parentElement, c = Ec(e);
				if (s && !s.shadowRoot && r(s) === !0) return Hc(e);
				e = e.assignedSlot ? e.assignedSlot : !s && c !== e.ownerDocument ? c.host : s;
			}
			e = o;
		}
		if (e.isConnected) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return Hc(e);
	return !1;
}, Wc = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return Tc.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, Gc = function(e, t) {
	return !(t.disabled || Ic(t) || Uc(t, e) || Lc(t) || Wc(t));
}, Kc = function(e, t) {
	return !(Vc(t) || Mc(t) < 0 || !Gc(e, t));
}, qc = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, Jc = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = Nc(a, i), s = i ? Jc(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(Pc).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, Yc = function(e, t) {
	return t ||= {}, Jc(t.getShadowRoot ? Ac([e], t.includeContainer, {
		filter: Kc.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: qc
	}) : kc(e, t.includeContainer, Kc.bind(null, t)));
}, Xc = function(e, t) {
	return t ||= {}, t.getShadowRoot ? Ac([e], t.includeContainer, {
		filter: Gc.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : kc(e, t.includeContainer, Gc.bind(null, t));
}, Zc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return Tc.call(e, Cc) !== !1 && Kc(t, e);
}, Qc = /* #__PURE__ */ Sc.concat("iframe:not([inert]):not([inert] *)").join(","), $c = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return Tc.call(e, Qc) !== !1 && Gc(t, e);
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte.js
function el(e, t) {
	let n = t.getRootNode();
	for (; e;) {
		let t = e.getRootNode();
		if (t === n) return e;
		e = t !== e && "host" in t ? t.host : null;
	}
	return null;
}
var tl = class e {
	#e = !1;
	#t = null;
	#n = xc.getInstance();
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
			if (!this.#t || this.#e || !this.#n.isActiveScope(this) || this.#t.contains(el(ls(this.#t.ownerDocument), this.#t))) return;
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
		this.#r.push(Or(t, "focusin", (t) => {
			if (this.#e || !this.#n.isActiveScope(this)) return;
			let n = el(t.composedPath()[0], e);
			if (n !== null && e.contains(n)) this.#n.setFocusMemory(this, n);
			else {
				let n = this.#n.getFocusMemory(this);
				if (n && e.contains(n) && $c(n)) t.preventDefault(), n.focus({ preventScroll: !0 });
				else {
					let t = this.#u(), n = this.#d()[0];
					(t || n || e).focus({ preventScroll: !0 });
				}
			}
		}, { capture: !0 }), Or(e, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let n = this.#l();
			if (n.length === 0) return;
			let r = n[0], i = n[n.length - 1];
			!e.shiftKey && ls(t) === i ? (e.preventDefault(), r.focus()) : e.shiftKey && ls(t) === r && (e.preventDefault(), i.focus());
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
		return this.#t ? Yc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	#u() {
		return this.#l()[0] || null;
	}
	#d() {
		return this.#t ? Xc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	static use(t) {
		let n = null;
		return Ko([() => t.ref.current, () => t.enabled.current], ([r, i]) => {
			r && i ? (n ||= new e(t), n.mount(r)) : n &&= (n.unmount(), null);
		}), Xo(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function nl(e, t) {
	O(t, !0);
	let n = Y(t, "enabled", 3, !1), r = Y(t, "trapFocus", 3, !1), i = Y(t, "loop", 3, !1), a = Y(t, "onCloseAutoFocus", 3, $), o = Y(t, "onOpenAutoFocus", 3, $), s = tl.use({
		enabled: X(() => n()),
		trap: X(() => r()),
		loop: H(() => i()),
		onCloseAutoFocus: X(() => a()),
		onOpenAutoFocus: X(() => o()),
		ref: H(() => t.ref)
	});
	var c = W();
	K(F(c), () => t.focusScope ?? g, () => ({ props: s.props })), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var rl = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var il = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	#e = $;
	#t = !1;
	#n = rl;
	#r = rl;
	constructor(e) {
		this.opts = e, this.domContext = new us(e.ref);
		let t = $;
		Ko(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([e, n, r]) => (this.#t = e, this.#n = n, this.#r = r, e && (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled), t(), t = this.#i()), () => {
			this.#t = !1, t(), this.#s(), globalThis.bitsTextSelectionLayers.delete(this);
		}));
	}
	#i() {
		return ko(Or(this.domContext.getDocument(), "pointerdown", this.#o), Or(this.domContext.getDocument(), "pointerup", this.#a));
	}
	#a = (e) => {
		this.#s(), e.defaultPrevented || this.#r(e);
	};
	#o = (e) => {
		if (!this.#t) return;
		this.#s();
		let t = this.opts.ref.current, n = e.target;
		Es(t) && Es(n) && cl(this) && os(t, n) && (this.#n(e), e.defaultPrevented || (this.#e = ol(t, this.domContext.getDocument().body)));
	};
	#s = () => {
		this.#e(), this.#e = $;
	};
}, al = (e) => e.style.userSelect || e.style.webkitUserSelect;
function ol(e, t) {
	let n = al(t), r = al(e);
	return sl(t, "none"), sl(e, "text"), () => {
		sl(t, n), sl(e, r);
	};
}
function sl(e, t) {
	e.style.userSelect = t, e.style.webkitUserSelect = t;
}
function cl(e) {
	let t = [...globalThis.bitsTextSelectionLayers];
	if (!t.length) return !1;
	let n = t.at(-1);
	return n ? n[0] === e : !1;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function ll(e, t) {
	O(t, !0);
	let n = Y(t, "preventOverflowTextSelection", 3, !0), r = Y(t, "onPointerDown", 3, $), i = Y(t, "onPointerUp", 3, $);
	il.create({
		id: X(() => t.id),
		onPointerDown: X(() => r()),
		onPointerUp: X(() => i()),
		enabled: X(() => t.enabled && n()),
		ref: H(() => t.ref)
	});
	var a = W();
	K(F(a), () => t.children ?? g), G(e, a), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
function ul(e = "bits") {
	return globalThis.bitsIdCounter.current++, `${e}-${globalThis.bitsIdCounter.current}`;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var dl = class {
	#e;
	#t = 0;
	#n = /* @__PURE__ */ M();
	#r;
	constructor(e) {
		this.#e = e;
	}
	#i() {
		--this.#t, this.#r && this.#t <= 0 && (this.#r(), N(this.#n, void 0), this.#r = void 0);
	}
	get(...e) {
		return this.#t += 1, V(this.#n) === void 0 && (this.#r = An(() => {
			N(this.#n, this.#e(...e), !0);
		})), L(() => () => {
			this.#i();
		}), V(this.#n);
	}
}, fl = new Ma(), pl = /* @__PURE__ */ new Map(), ml = [
	"padding-right",
	"margin-right",
	"overflow",
	"overflow-x",
	"overflow-y",
	"pointer-events",
	"--scrollbar-width"
], hl = null, gl = !1, _l = /* @__PURE__ */ new Set(), vl = null, yl = null, bl = !1;
function xl(e, t, n) {
	e.setProperty(t, n), _l.add(t), t === "overflow" && (_l.add("overflow-x"), _l.add("overflow-y"));
}
var Sl = X(() => {
	for (let e of fl.values()) if (e) return !0;
	return !1;
}), Cl = X(() => {
	for (let [e, t] of fl) if (t && (pl.get(e)?.() ?? !0)) return !0;
	return !1;
}), wl = null, Tl = new dl(() => {
	function e(e, t) {
		let n = hl?.get(t);
		n?.value ? e.body.style.setProperty(t, n.value, n.priority) : e.body.style.removeProperty(t);
	}
	function t(t) {
		for (let n of ml) _l.has(n) && e(t, n);
		!gl && t.body.style.length === 0 && t.body.removeAttribute("style"), hl = null, _l.clear(), ws && vl?.();
	}
	function n(t) {
		_l.delete("pointer-events") && e(t, "pointer-events");
	}
	function r() {
		yl !== null && (window.clearTimeout(yl), yl = null);
	}
	function i(e, t) {
		r(), bl = !0, wl = Date.now();
		let n = wl, i = () => {
			yl = null, wl === n && (Dl(fl) ? bl = !1 : (bl = !1, t()));
		}, a = e === null ? 24 : e;
		yl = window.setTimeout(i, a);
	}
	function a() {
		if (hl === null && fl.size === 0 && !bl) {
			gl = document.body.hasAttribute("style"), hl = /* @__PURE__ */ new Map();
			for (let e of ml) hl.set(e, {
				value: document.body.style.getPropertyValue(e),
				priority: document.body.style.getPropertyPriority(e)
			});
		}
	}
	return Ko(() => Sl.current, () => {
		if (!Sl.current) return;
		a(), bl = !1;
		let e = getComputedStyle(document.documentElement), t = getComputedStyle(document.body), n = e.scrollbarGutter?.includes("stable") || t.scrollbarGutter?.includes("stable"), r = window.innerWidth - document.documentElement.clientWidth, i = {
			padding: Number.parseInt(t.paddingRight ?? "0", 10) + r,
			margin: Number.parseInt(t.marginRight ?? "0", 10)
		};
		r > 0 && !n && (xl(document.body.style, "padding-right", `${i.padding}px`), xl(document.body.style, "margin-right", `${i.margin}px`), xl(document.body.style, "--scrollbar-width", `${r}px`)), xl(document.body.style, "overflow", "hidden"), ws && (vl = Or(document, "touchmove", (e) => {
			e.target === document.documentElement && (e.touches.length > 1 || e.preventDefault());
		}, { passive: !1 })), Zo(() => {
			Cl.current && xl(document.body.style, "pointer-events", "none"), xl(document.body.style, "overflow", "hidden");
		});
	}), Ko(() => Cl.current, () => {
		Sl.current && Zo(() => {
			Sl.current && (Cl.current ? xl(document.body.style, "pointer-events", "none") : n(document));
		});
	}, { lazy: !0 }), Xo(() => () => {
		vl?.();
	}), {
		get lockMap() {
			return fl;
		},
		resetBodyStyle: t,
		restorePointerEvents: n,
		scheduleCleanupIfNoNewLocks: i,
		cancelPendingCleanup: r,
		ensureInitialStyleCaptured: a
	};
}), El = class {
	#e = ul();
	#t;
	#n = () => null;
	#r;
	locked;
	constructor(e, t = () => null, n = () => !0) {
		this.#t = e, this.#n = t, this.#r = Tl.get(), this.#r && (this.#r.cancelPendingCleanup(), this.#r.ensureInitialStyleCaptured(), pl.set(this.#e, n), this.#r.lockMap.set(this.#e, this.#t ?? !1), this.locked = X(() => this.#r.lockMap.get(this.#e) ?? !1, (e) => this.#r.lockMap.set(this.#e, e)), Xo(() => {
			if (this.#r.lockMap.delete(this.#e), pl.delete(this.#e), Dl(this.#r.lockMap)) return;
			let e = this.#n(), t = document;
			this.#r.restorePointerEvents(t), this.#r.scheduleCleanupIfNoNewLocks(e, () => {
				this.#r.resetBodyStyle(t);
			});
		}));
	}
};
function Dl(e) {
	for (let [t, n] of e) if (n) return !0;
	return !1;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function Ol(e, t) {
	O(t, !0);
	let n = Y(t, "preventScroll", 3, !0), r = Y(t, "restoreScrollDelay", 3, null), i = Y(t, "blockPointer", 3, () => !0);
	H(() => {
		n() && new El(n(), () => r(), i());
	}), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
var kl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"forceMount",
	"child",
	"children",
	"ref"
]), Al = /* @__PURE__ */ U("<div><!></div>");
function jl(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "forceMount", 3, !1), a = Y(t, "ref", 15, null), o = /* @__PURE__ */ pa(t, kl), s = Vs.create({
		id: X(() => r()),
		ref: X(() => a(), (e) => a(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props));
	var l = W(), u = F(l), d = (e) => {
		var n = W(), r = F(n), i = (e) => {
			var n = W(), r = F(n);
			{
				let e = /* @__PURE__ */ A(() => ({
					props: Z(V(c)),
					...s.snippetProps
				}));
				K(r, () => t.child, () => V(e));
			}
			G(e, n);
		}, a = (e) => {
			var n = Al();
			J(n, (e) => ({ ...e }), [() => Z(V(c))]), K(P(n), () => t.children ?? g, () => s.snippetProps), D(n), G(e, n);
		};
		q(r, (e) => {
			t.child ? e(i) : e(a, -1);
		}), G(e, n);
	};
	q(u, (e) => {
		(s.shouldRender || i()) && e(d);
	}), G(e, l), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
var Ml = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref"
]), Nl = /* @__PURE__ */ U("<div><!></div>");
function Pl(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ pa(t, Ml), o = zs.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Nl();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/utils.mjs
function Fl(e, t) {
	return e - t * Math.floor(e / t);
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/calendars/GregorianCalendar.mjs
var Il = 1721426;
function Ll(e, t, n, r) {
	t = zl(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Rl(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Rl(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function zl(e, t) {
	return e === "BC" ? 1 - t : t;
}
function Bl(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var Vl = {
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
}, Hl = class {
	fromJulianDay(e) {
		let t = e, n = t - Il, r = Math.floor(n / 146097), i = Fl(n, 146097), a = Math.floor(i / 36524), o = Fl(i, 36524), s = Math.floor(o / 1461), c = Fl(o, 1461), l = Math.floor(c / 365), [u, d] = Bl(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - Ll(u, d, 1, 1), p = 2;
		t < Ll(u, d, 3, 1) ? p = 0 : Rl(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new ud(u, d, m, t - Ll(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return Ll(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return Vl[Rl(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Rl(e.year) ? 366 : 365;
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
}, Ul = {
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
function Wl(e, t) {
	return t = wu(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function Gl(e, t) {
	return t = wu(t, e.calendar), e = iu(e), t = iu(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function Kl(e, t) {
	return e.isEqual?.(t) ?? t.isEqual?.(e) ?? e.identifier === t.identifier;
}
var ql = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function Jl(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? ql[n] : lu(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function Yl(e) {
	return xu(Date.now(), e);
}
function Xl(e) {
	return Su(Yl(e));
}
function Zl(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function Ql(e, t) {
	return $l(e) - $l(t);
}
function $l(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var eu = null, tu = !1;
function nu() {
	return eu ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, eu;
}
function ru() {
	return tu;
}
function iu(e) {
	return e.subtract({ days: e.day - 1 });
}
function au(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var ou = /* @__PURE__ */ new Map(), su = /* @__PURE__ */ new Map();
function cu(e) {
	if (Intl.Locale) {
		let t = ou.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && ou.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function lu(e) {
	let t = su.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return su.set(e, t), t.firstDay;
		}
		let n = cu(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && Ul[n] || 0 };
		su.set(e, t);
	}
	return t.firstDay;
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/conversion.mjs
function uu(e) {
	return e = wu(e, new Hl()), du(zl(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function du(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function fu(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === nu() && !ru()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = mu(e, t);
	return du(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var pu = /* @__PURE__ */ new Map();
function mu(e, t) {
	let n = pu.get(t);
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
	}), pu.set(t, n));
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
var hu = 864e5;
function gu(e, t) {
	let n = uu(e);
	return _u(e, t, n - fu(n - hu, t), n - fu(n + hu, t));
}
function _u(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => vu(e, t, n));
}
function vu(e, t, n) {
	let r = mu(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function yu(e, t, n = "compatible") {
	let r = Cu(e);
	if (t === "UTC") return uu(r);
	if (t === nu() && n === "compatible" && !ru()) {
		r = wu(r, new Hl());
		let e = /* @__PURE__ */ new Date(), t = zl(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = uu(r), a = fu(i - hu, t), o = fu(i + hu, t), s = _u(r, t, i - a, i - o);
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
function bu(e, t, n = "compatible") {
	return new Date(yu(e, t, n));
}
function xu(e, t) {
	let n = fu(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new fd(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function Su(e) {
	return new ud(e.calendar, e.era, e.year, e.month, e.day);
}
function Cu(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new dd(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function wu(e, t) {
	if (Kl(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Pu(r), r;
}
function Tu(e, t, n) {
	return e instanceof fd ? e.timeZone === t ? e : Du(e, t) : xu(yu(e, t, n), t);
}
function Eu(e) {
	let t = uu(e) - e.offset;
	return new Date(t);
}
function Du(e, t) {
	return wu(xu(uu(e) - e.offset, t), e.calendar);
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/manipulation.mjs
var Ou = 36e5;
function ku(e, t) {
	let n = e.copy(), r = "hour" in n ? Hu(n, t) : 0;
	Au(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, ju(n), Nu(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, Mu(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
	let i = n.calendar.getYearsInEra(n);
	if (n.year > i) {
		let e = n.calendar.isInverseEra?.(n);
		n.year = i, n.month = e ? 1 : n.calendar.getMonthsInYear(n), n.day = e ? 1 : n.calendar.getDaysInMonth(n);
	}
	n.month < 1 && (n.month = 1, n.day = 1);
	let a = n.calendar.getMonthsInYear(n);
	return n.month > a && (n.month = a, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function Au(e, t) {
	e.calendar.isInverseEra?.(e) && (t = -t), e.year += t;
}
function ju(e) {
	for (; e.month < 1;) Au(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, Au(e, 1);
}
function Mu(e) {
	for (; e.day < 1;) e.month--, ju(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, ju(e);
}
function Nu(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function Pu(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), Nu(e);
}
function Fu(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function Iu(e, t) {
	return ku(e, Fu(t));
}
function Lu(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), Pu(n), n;
}
function Ru(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Bu(n), n;
}
function zu(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = Vu(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = Vu(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = Vu(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = Vu(e.hour, 24), t;
}
function Bu(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 999)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function Vu(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function Hu(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, zu(e);
}
function Uu(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = Gu(a, n, 0, t.length - 1, r?.round), i.era = t[a], Pu(i);
			break;
		}
		case "year":
			i.calendar.isInverseEra?.(i) && (n = -n), i.year = Gu(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = Gu(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = Gu(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), Pu(i), i;
}
function Wu(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = Gu(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = Gu(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = Gu(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = Gu(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function Gu(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function Ku(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? yu(ku(Cu(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : uu(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, wu(xu(n, e.timeZone), e.calendar);
}
function qu(e, t) {
	return Ku(e, Fu(t));
}
function Ju(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = Cu(e), o = wu(Ru(a, { hour: t }), new Hl()), s = [yu(o, e.timeZone, "earlier"), yu(o, e.timeZone, "later")].filter((t) => xu(t, e.timeZone).day === o.day)[0], c = wu(Ru(a, { hour: i }), new Hl()), l = [yu(c, e.timeZone, "earlier"), yu(c, e.timeZone, "later")].filter((t) => xu(t, e.timeZone).day === c.day).pop(), u = uu(e) - e.offset, d = Math.floor(u / Ou), f = u % Ou;
			return u = Gu(d, n, Math.floor(s / Ou), Math.floor(l / Ou), r?.round) * Ou + f, wu(xu(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return Wu(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return wu(xu(yu(Uu(Cu(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function Yu(e, t, n) {
	let r = Cu(e), i = Ru(Lu(r, t), t);
	return i.compare(r) === 0 ? e : wu(xu(yu(i, e.timeZone, n), e.timeZone), e.calendar);
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/string.mjs
var Xu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, Zu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Qu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, $u = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function ed(e) {
	let t = e.match(Xu);
	if (!t) throw $u.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new ud(rd(t[1], 0, 9999), rd(t[2], 1, 12), 1);
	return n.day = rd(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function td(e) {
	let t = e.match(Zu);
	if (!t) throw $u.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = rd(t[1], -9999, 9999), r = new dd(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, rd(t[2], 1, 12), 1, t[4] ? rd(t[4], 0, 23) : 0, t[5] ? rd(t[5], 0, 59) : 0, t[6] ? rd(t[6], 0, 59) : 0, t[7] ? rd(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = rd(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function nd(e, t) {
	let n = e.match(Qu);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = rd(n[1], -9999, 9999), i = new fd(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, rd(n[2], 1, 12), 1, n[11], 0, n[4] ? rd(n[4], 0, 23) : 0, n[5] ? rd(n[5], 0, 59) : 0, n[6] ? rd(n[6], 0, 59) : 0, n[7] ? rd(n[7], 0, Infinity) * 1e3 : 0);
	i.day = rd(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = Cu(i), o;
	if (n[8]) {
		let e = rd(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + rd(n[9] ?? "0", 0, 59) * 6e4 + rd(n[10] ?? "0", 0, 59) * 1e3), o = uu(i) - i.offset, !gu(a, i.timeZone).includes(o)) throw Error(`Offset ${sd(i.offset)} is invalid for ${od(i)} in ${i.timeZone}`);
	} else o = yu(Cu(a), i.timeZone, t);
	return xu(o, i.timeZone);
}
function rd(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function id(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function ad(e) {
	let t = wu(e, new Hl()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function od(e) {
	return `${ad(e)}T${id(e)}`;
}
function sd(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function cd(e) {
	return `${od(e)}${sd(e.offset)}[${e.timeZone}]`;
}
// node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/CalendarDate.mjs
function ld(e) {
	let t = typeof e[0] == "object" ? e.shift() : new Hl(), n;
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
var ud = class e {
	constructor(...e) {
		let [t, n, r, i, a] = ld(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, Pu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return ku(this, e);
	}
	subtract(e) {
		return Iu(this, e);
	}
	set(e) {
		return Lu(this, e);
	}
	cycle(e, t, n) {
		return Uu(this, e, t, n);
	}
	toDate(e) {
		return bu(this, e);
	}
	toString() {
		return ad(this);
	}
	compare(e) {
		return Zl(this, e);
	}
}, dd = class e {
	constructor(...e) {
		let [t, n, r, i, a] = ld(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Pu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return ku(this, e);
	}
	subtract(e) {
		return Iu(this, e);
	}
	set(e) {
		return Lu(Ru(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return Uu(this, e, t, n);
			default: return Wu(this, e, t, n);
		}
	}
	toDate(e, t) {
		return bu(this, e, t);
	}
	toString() {
		return od(this);
	}
	compare(e) {
		let t = Zl(this, e);
		return t === 0 ? Ql(this, Cu(e)) : t;
	}
}, fd = class e {
	constructor(...e) {
		let [t, n, r, i, a] = ld(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Pu(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Ku(this, e);
	}
	subtract(e) {
		return qu(this, e);
	}
	set(e, t) {
		return Yu(this, e, t);
	}
	cycle(e, t, n) {
		return Ju(this, e, t, n);
	}
	toDate() {
		return Eu(this);
	}
	toString() {
		return cd(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - Tu(e, this.timeZone).toDate().getTime();
	}
}, pd = /* @__PURE__ */ new Map(), md = class {
	constructor(e, t = {}) {
		this.formatter = gd(e, t), this.options = t;
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
		return bd() && (this.resolvedHourCycle ||= xd(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
}, hd = {
	true: { ja: "h11" },
	false: {}
};
function gd(e, t = {}) {
	if (typeof t.hour12 == "boolean" && vd()) {
		t = { ...t };
		let n = hd[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (pd.has(n)) return pd.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return pd.set(n, r), r;
}
var _d = null;
function vd() {
	return _d ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", _d;
}
var yd = null;
function bd() {
	return yd ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", yd;
}
function xd(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = gd(e, {
		...t,
		timeZone: void 0
	}), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((e) => e.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((e) => e.type === "hour").value, 10);
	if (r === 0 && i === 23) return "h23";
	if (r === 24 && i === 23) return "h24";
	if (r === 0 && i === 11) return "h11";
	if (r === 12 && i === 11) return "h12";
	throw Error("Unexpected hour cycle result");
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/announcer.js
function Sd(e) {
	if (!Cs || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!Es(t)) {
		let r = e.createElement("div");
		r.style.cssText = zo, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!Es(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return Es(n) ? n : null;
	} };
}
function Cd(e) {
	let t = Sd(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !Cs || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/utils.js
var wd = {
	defaultValue: void 0,
	granularity: "day"
};
function Td(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...wd,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(nu()) ? e = r.toDate(nu()) : i && e > i.toDate(nu()) && (e = i.toDate(nu()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new dd(t, a, o, 0, 0, 0) : new ud(t, a, o);
	}
}
function Ed(e, t) {
	let n;
	return n = t instanceof fd ? nd(e) : t instanceof dd ? td(e) : ed(e), n.calendar === t.calendar ? n : wu(n, t.calendar);
}
function Dd(e, t = nu()) {
	return e instanceof fd ? e.toDate() : e.toDate(t);
}
function Od(e) {
	if (e instanceof ud) return "date";
	if (e instanceof dd) return "datetime";
	if (e instanceof fd) return "zoneddatetime";
	throw Error("Unknown date type");
}
function kd(e, t) {
	switch (t) {
		case "date": return ed(e);
		case "datetime": return td(e);
		case "zoneddatetime": return nd(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function Ad(e) {
	return e instanceof dd;
}
function jd(e) {
	return e instanceof fd;
}
function Md(e) {
	return Ad(e) || jd(e);
}
function Nd(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function Pd(e, t) {
	return e.compare(t) < 0;
}
function Fd(e, t) {
	return e.compare(t) > 0;
}
function Id(e, t, n) {
	let r = Jl(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function Ld(e, t, n) {
	let r = Jl(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var Rd = [
	"day",
	"month",
	"year"
], zd = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], Bd = ["literal", "timeZoneName"], Vd = [...Rd, ...zd], Hd = [...Vd, ...Bd], Ud = [...zd, ...Bd];
Hd.filter((e) => e !== "literal"), Ud.filter((e) => e !== "literal");
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var Wd = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), Gd = [
	"year",
	"month",
	"day"
], Kd = {
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
function qd(e) {
	if (Yd(e)) return Kd[e];
	{
		let t = $d(e);
		return Yd(t) ? Kd[t] : Kd.en;
	}
}
function Jd(e, t, n) {
	return Xd(e) ? qd(n)[e] : Qd(e) ? t : Zd(e) ? "––" : "";
}
function Yd(e) {
	return Wd.includes(e);
}
function Xd(e) {
	return Gd.includes(e);
}
function Zd(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function Qd(e) {
	return e === "era" || e === "dayPeriod";
}
function $d(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function ef(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = Vd.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function tf(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!cf(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = ks(i) ? Jd(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if (a === "day" && ks(t.month) && !ks(t.day)) {
			let e = Number.parseInt(t.day);
			if (e >= 1 && e <= 31) return t.day.startsWith("0") && `${e}`.length === 1 ? `0${e}` : `${e}`;
		}
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!ks(o) && !ks(c)) {
				let l = n.part(bf(a, i, t).set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), u = e.hourCycle === 12 || e.hourCycle === void 0 && xf(r) === 12;
				if (a === "hour" && u) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && l.length === 1 ? `0${l}` : l;
			}
			return Jd(a, "", r);
		}
		if (sf(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (ks(e)) return Jd(a, "", r);
			{
				let r = n.part(bf(a, i, t).set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && r.length === 1 ? `0${r}` : r;
			}
		}
		return "";
	}
	return a;
}
function nf(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, af(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !cf(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(ks(e.part) || ks(e.value) || e.part === "timeZoneName" && (!jd(n) || a)));
}
function rf(e) {
	let t = tf(e);
	return {
		obj: t,
		arr: nf({
			contentObj: t,
			...e
		})
	};
}
function af(e, t) {
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
function of() {
	return Vd.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function sf(e) {
	return Rd.includes(e);
}
function cf(e) {
	return Vd.includes(e);
}
function lf(e) {
	return Hd.includes(e);
}
function uf(e) {
	return !Cs || !e ? [] : kf(e).map((e) => e.dataset.segment).filter((e) => Vd.includes(e));
}
var df = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function ff(e) {
	let t = df.indexOf(e);
	return t === -1 ? df.length : t;
}
function pf(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = uf(n).sort((e, t) => ff(e) - ff(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (ks(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (sf(e)) {
		let n = t[e];
		if (ks(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function mf(e, t) {
	let n = uf(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (sf(t) && e[t] === null) return !1;
	return !0;
}
function hf(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (zd.includes(e) || Rd.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function gf(e, t) {
	return t || (Md(e) ? "minute" : "day");
}
function _f(e, t) {
	if (!Cs) return !1;
	let n = kf(t);
	return n.length ? n[0].id === e : !1;
}
function vf(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!Cs) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = Fo({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function yf(e, t) {
	if (!Cs) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function bf(e, t, n) {
	if (e !== "day") return t;
	let r = t;
	return ks(n.year) || (r = r.set({ year: Number.parseInt(n.year) })), ks(n.month) || (r = r.set({ month: Number.parseInt(n.month) })), r;
}
function xf(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
function Sf(e, t) {
	let n = Number.parseInt(e);
	return Number.isNaN(n) ? e : t === "AM" ? n === 12 ? "0" : `${n}` : n < 12 ? `${n + 12}` : `${n}`;
}
function Cf(e) {
	if (e === null) return e;
	let t = Number.parseInt(e);
	return Number.isNaN(t) ? e : t === 0 ? "12" : t > 12 ? `${t - 12}` : e;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function wf(e, t) {
	let n = e.currentTarget;
	if (!Es(n)) return;
	let { prev: r, next: i } = Df(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function Tf(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function Ef(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function Df(e, t) {
	let n = kf(t);
	return n.length ? {
		next: Tf(e, n),
		prev: Ef(e, n)
	} : {
		next: null,
		prev: null
	};
}
function Of(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function kf(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!Es(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!lf(t) || t === "literal");
	}) : [];
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/formatter.js
var Af = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function jf(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new md(t, n).format(e);
	}
	function a(e, t = !0) {
		return Md(e) && t ? i(Dd(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(Dd(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new md(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new md(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new md(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new md(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new md(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return jd(e) ? new md(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(Dd(e)) : new md(t, n).formatToParts(Dd(e));
	}
	function u(e, n = "narrow") {
		return new md(t, { weekday: n }).format(e);
	}
	function d(e, t = void 0) {
		return l(e, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: t === 24 ? "h23" : void 0
		}).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...Af,
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
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/arrays.js
function Mf(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function Nf(e, t) {
	return e >= 0 && e < t.length;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/date-time/calendar-helpers.svelte.js
function Pf(e) {
	return !(!Es(e) || !e.hasAttribute("data-bits-day"));
}
function Ff(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function If(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = Nd(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = iu(t), c = au(t), l = n === void 0 ? Id(s, 0, i) : Id(s, n, "en-US"), u = n === void 0 ? Ld(c, 0, i) : Ld(c, n, "en-US"), d = Ff(l.subtract({ days: 1 }), s), f = Ff(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
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
		weeks: Mf(m, 7)
	};
}
function Lf(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(If({
		...r,
		dateObj: n
	})), i;
	i.push(If({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(If({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function Rf(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => Es(e)) : [];
}
function zf(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = Ed(n, t.current));
}
function Bf({ node: e, add: t, useCalendarDayOffset: n = !1, placeholder: r, calendarNode: i, isPrevButtonDisabled: a, isNextButtonDisabled: o, months: s, numberOfMonths: c }) {
	let l = Rf(i);
	if (!l.length) return;
	if (n) {
		let n = e.getAttribute("data-value");
		if (!n) return;
		let l = (e) => {
			let n = Array.from(i?.querySelectorAll("[data-bits-day]:not([data-outside-visible-months])") ?? []).map((e) => e.getAttribute("data-value")).filter((e) => e !== null), a = Rf(i);
			for (; n.includes(e.toString());) {
				let n = a.find((t) => t.getAttribute("data-value") === e.toString());
				if (n) {
					zf(n, r), n.focus();
					return;
				}
				e = e.add({ days: t });
			}
			return e;
		}, u = l(Ed(n, r.current).add({ days: t }));
		if (!u || (t > 0 ? o : a)) return;
		let d = s[0]?.value;
		if (!d) return;
		r.current = t > 0 ? d.add({ months: c }) : d.subtract({ months: c }), Zo(() => l(u));
		return;
	}
	let u = l.indexOf(e) + t;
	if (Nf(u, l)) {
		let e = l[u];
		return zf(e, r), e.focus();
	}
	if (u < 0) {
		if (a) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.subtract({ months: c }), Zo(() => {
			let e = Rf(i);
			if (!e.length) return;
			let t = e.length - Math.abs(u);
			if (Nf(t, e)) {
				let n = e[t];
				return zf(n, r), n.focus();
			}
		});
	}
	if (u >= l.length) {
		if (o) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.add({ months: c }), Zo(() => {
			let e = Rf(i);
			if (!e.length) return;
			let t = u - l.length;
			if (Nf(t, e)) return e[t].focus();
		});
	}
}
var Vf = [
	vs,
	xs,
	ys,
	bs
], Hf = [Ss, " "];
function Uf({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!Pf(i) || !Vf.includes(e.key) && !Hf.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[vs]: 7,
		[xs]: -7,
		[ys]: -1,
		[bs]: 1
	};
	if (Vf.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (Hf.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, Ed(n, r));
	}
}
function Wf({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = Lf({
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
function Gf({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = Lf({
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
function Kf({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(Dd(Su(e)), n)) : [];
}
function qf(e) {
	L(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		H(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(Lf({
				...o,
				dateObj: a
			}));
		});
	});
}
function Jf({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = ss(e), i = r.createElement("div");
	i.style.cssText = Fo({
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
function Yf({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	L(() => {
		e.current, H(() => {
			t().some((t) => Gl(t, e.current)) || o(Lf({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function Xf({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? Fd(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function Zf({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? Pd(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function Qf({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = Dd(Su(e[0].value));
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = Dd(Su(e[0].value)), i = Dd(Su(e[e.length - 1].value)), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function $f({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": Q(n),
		"data-disabled": Q(r),
		"data-readonly": Q(i)
	};
}
function ep(e) {
	if (e.defaultPrevented) return;
	let t = ss(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function tp(e) {
	if (!Cs) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return kd(r, i);
}
function np(e, t, n) {
	if (!e || !n(e)) return e;
	for (let e of t) {
		let t = e.dates.find((t) => Gl(t, e.value) && !n(t));
		if (t) return t;
	}
	return e;
}
function rp({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && Pd(e, r.current) || i.current && Pd(i.current, e));
	}
	Ko(() => e.current, () => {
		e.current && t.current && Wl(t.current, n) && o(n) && (t.current = tp(e.current) ?? n);
	});
}
function ip(e, t) {
	return !e || !t ? e : Md(e) && Md(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var ap = _s({
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
function op(e) {
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
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/calendar.svelte.js
var sp = new Uo("Calendar.Root | RangeCalender.Root"), cp = class e {
	static create(t) {
		return sp.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ A(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return V(this.#e);
	}
	set visibleMonths(e) {
		N(this.#e, e);
	}
	#t = /* @__PURE__ */ A(() => (this.months, Xl(nu())));
	get todayDate() {
		return V(this.#t);
	}
	set todayDate(e) {
		N(this.#t, e);
	}
	formatter;
	accessibleHeadingId = ul();
	domContext;
	attachment;
	#n = /* @__PURE__ */ M(an([]));
	get months() {
		return V(this.#n);
	}
	set months(e) {
		N(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ A(() => np(this.opts.placeholder.current, this.months, (e) => this.isDateDisabled(e)));
	get tabbableDate() {
		return V(this.#r);
	}
	set tabbableDate(e) {
		N(this.#r, e);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = ds(this.opts.ref), this.domContext = new us(e.ref), this.announcer = Cd(null), this.formatter = jf({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), ci(() => {
			this.announcer = Cd(this.domContext.getDocument());
		}), this.months = Lf({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#s(), this.#c(), this.#l(), Yf({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), qf({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), Ko(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), Ko(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), rp({
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
	#i = /* @__PURE__ */ A(() => Kf({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return V(this.#i);
	}
	set weekdays(e) {
		N(this.#i, e);
	}
	#a = /* @__PURE__ */ A(() => H(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return V(this.#a);
	}
	set initialPlaceholderYear(e) {
		N(this.#a, e);
	}
	#o = /* @__PURE__ */ A(() => op({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return V(this.#o);
	}
	set defaultYears(e) {
		N(this.#o, e);
	}
	#s() {
		L(() => {
			if (H(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#c() {
		L(() => {
			if (this.opts.ref.current) return Jf({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#l() {
		kn(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		Wf({
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
		Gf({
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
	#u = /* @__PURE__ */ A(() => Xf({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return V(this.#u);
	}
	set isNextButtonDisabled(e) {
		N(this.#u, e);
	}
	#d = /* @__PURE__ */ A(() => Zf({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return V(this.#d);
	}
	set isPrevButtonDisabled(e) {
		N(this.#d, e);
	}
	#f = /* @__PURE__ */ A(() => {
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
		return V(this.#f);
	}
	set isInvalid(e) {
		N(this.#f, e);
	}
	#p = /* @__PURE__ */ A(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, Qf({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return V(this.#p);
	}
	set headingValue(e) {
		N(this.#p, e);
	}
	#m = /* @__PURE__ */ A(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return V(this.#m);
	}
	set fullCalendarLabel(e) {
		N(this.#m, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => Gl(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && Pd(e, t) || n && Pd(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => Wl(t, e)) : t ? Wl(t, e) : !1;
	}
	shiftFocus(e, t) {
		return Bf({
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
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = ip(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#h(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => Wl(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#h(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !Wl(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && Wl(e, t)) this.opts.placeholder.current = t;
		else return t;
	}
	onkeydown(e) {
		Uf({
			event: e,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#g = /* @__PURE__ */ A(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return V(this.#g);
	}
	set snippetProps(e) {
		N(this.#g, e);
	}
	getBitsAttr = (e) => ap.getAttr(e);
	#_ = /* @__PURE__ */ A(() => ({
		...$f({
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
		return V(this.#_);
	}
	set props(e) {
		N(this.#_, e);
	}
}, lp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"aria-hidden": ps(!0),
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("heading")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, up = new Uo("Calendar.Cell | RangeCalendar.Cell"), dp = class e {
	static create(t) {
		return up.set(new e(t, sp.get()));
	}
	opts;
	root;
	#e = /* @__PURE__ */ A(() => Dd(Su(this.opts.date.current)));
	get cellDate() {
		return V(this.#e);
	}
	set cellDate(e) {
		N(this.#e, e);
	}
	#t = /* @__PURE__ */ A(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return V(this.#t);
	}
	set isUnavailable(e) {
		N(this.#t, e);
	}
	#n = /* @__PURE__ */ A(() => Wl(this.opts.date.current, this.root.todayDate));
	get isDateToday() {
		return V(this.#n);
	}
	set isDateToday(e) {
		N(this.#n, e);
	}
	#r = /* @__PURE__ */ A(() => !Gl(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return V(this.#r);
	}
	set isOutsideMonth(e) {
		N(this.#r, e);
	}
	#i = /* @__PURE__ */ A(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return V(this.#i);
	}
	set isOutsideVisibleMonths(e) {
		N(this.#i, e);
	}
	#a = /* @__PURE__ */ A(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return V(this.#a);
	}
	set isDisabled(e) {
		N(this.#a, e);
	}
	#o = /* @__PURE__ */ A(() => Wl(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return V(this.#o);
	}
	set isFocusedDate(e) {
		N(this.#o, e);
	}
	#s = /* @__PURE__ */ A(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return V(this.#s);
	}
	set isSelectedDate(e) {
		N(this.#s, e);
	}
	#c = /* @__PURE__ */ A(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return V(this.#c);
	}
	set labelText(e) {
		N(this.#c, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#l = /* @__PURE__ */ A(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return V(this.#l);
	}
	set snippetProps(e) {
		N(this.#l, e);
	}
	#u = /* @__PURE__ */ A(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
	get ariaDisabled() {
		return V(this.#u);
	}
	set ariaDisabled(e) {
		N(this.#u, e);
	}
	#d = /* @__PURE__ */ A(() => ({
		"data-unavailable": Q(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": Q(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": Od(this.opts.date.current),
		"data-disabled": Q(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return V(this.#d);
	}
	set sharedDataAttrs(e) {
		N(this.#d, e);
	}
	#f = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": fs(this.isSelectedDate),
		"aria-disabled": fs(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#f);
	}
	set props(e) {
		N(this.#f, e);
	}
}, fp = class e {
	static create(t) {
		return new e(t, up.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.root.tabbableDate && Wl(this.cell.opts.date.current, this.cell.root.tabbableDate) ? 0 : -1);
	onclick(e) {
		this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}
	#t = /* @__PURE__ */ A(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`
	}));
	get snippetProps() {
		return V(this.#t);
	}
	set snippetProps(e) {
		N(this.#t, e);
	}
	#n = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": fs(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: V(this.#e),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return V(this.#n);
	}
	set props(e) {
		N(this.#n, e);
	}
}, pp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	#e = /* @__PURE__ */ A(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return V(this.#e);
	}
	set isDisabled(e) {
		N(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ds(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": fs(this.isDisabled),
		"data-disabled": Q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, mp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	#e = /* @__PURE__ */ A(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return V(this.#e);
	}
	set isDisabled(e) {
		N(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ds(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": fs(this.isDisabled),
		"data-disabled": Q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, hp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": fs(this.root.opts.readonly.current),
		"aria-disabled": fs(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		"data-disabled": Q(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, gp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, _p = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, vp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, yp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, bp = class e {
	static create(t) {
		return new e(t, sp.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"data-disabled": Q(this.root.opts.disabled.current),
		"data-readonly": Q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, xp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Sp = /* @__PURE__ */ U("<div><!></div>");
function Cp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, xp), o = fp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W(), r = F(n);
		{
			let e = /* @__PURE__ */ A(() => ({
				props: V(s),
				...o.snippetProps
			}));
			K(r, () => t.child, () => V(e));
		}
		G(e, n);
	}, d = (e) => {
		var n = Sp();
		J(n, () => ({ ...V(s) }));
		var r = P(n), i = (e) => {
			var n = W();
			K(F(n), () => t.children ?? g, () => o.snippetProps), G(e, n);
		}, a = (e) => {
			var t = Vr();
			R(() => ti(t, o.cell.opts.date.current.day)), G(e, t);
		};
		q(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var wp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Tp = /* @__PURE__ */ U("<table><!></table>");
function Ep(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, wp), o = hp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Tp();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var Dp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Op = /* @__PURE__ */ U("<tbody><!></tbody>");
function kp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, Dp), o = gp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Op();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var Ap = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), jp = /* @__PURE__ */ U("<td><!></td>");
function Mp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, Ap), o = dp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		date: X(() => t.date),
		month: X(() => t.month)
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W(), r = F(n);
		{
			let e = /* @__PURE__ */ A(() => ({
				props: V(s),
				...o.snippetProps
			}));
			K(r, () => t.child, () => V(e));
		}
		G(e, n);
	}, d = (e) => {
		var n = jp();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g, () => o.snippetProps), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var Np = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Pp = /* @__PURE__ */ U("<thead><!></thead>");
function Fp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, Np), o = _p.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Pp();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var Ip = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Lp = /* @__PURE__ */ U("<th><!></th>");
function Rp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, Ip), o = yp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Lp();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var zp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Bp = /* @__PURE__ */ U("<tr><!></tr>");
function Vp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, zp), o = vp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Bp();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var Hp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Up = /* @__PURE__ */ U("<header><!></header>");
function Wp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, Hp), o = bp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(s) })), G(e, n);
	}, d = (e) => {
		var n = Up();
		J(n, () => ({ ...V(s) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var Gp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Kp = /* @__PURE__ */ U("<div><!></div>");
function qp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = /* @__PURE__ */ pa(t, Gp), o = lp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = W(), l = F(c), u = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({
			props: V(s),
			headingValue: o.root.headingValue
		})), G(e, n);
	}, d = (e) => {
		var n = Kp();
		J(n, () => ({ ...V(s) }));
		var r = P(n), i = (e) => {
			var n = W();
			K(F(n), () => t.children ?? g, () => ({ headingValue: o.root.headingValue })), G(e, n);
		}, a = (e) => {
			var t = Vr();
			R(() => ti(t, o.root.headingValue)), G(e, t);
		};
		q(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), D(n), G(e, n);
	};
	q(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), G(e, c), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var Jp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), Yp = /* @__PURE__ */ U("<button><!></button>");
function Xp(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ pa(t, Jp), s = pp.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props, { tabindex: a() }));
	var l = W(), u = F(l), d = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(c) })), G(e, n);
	}, f = (e) => {
		var n = Yp();
		J(n, () => ({ ...V(c) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), G(e, l), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var Zp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), Qp = /* @__PURE__ */ U("<button><!></button>");
function $p(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ pa(t, Zp), s = mp.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props, { tabindex: a() }));
	var l = W(), u = F(l), d = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({ props: V(c) })), G(e, n);
	}, f = (e) => {
		var n = Qp();
		J(n, () => ({ ...V(c) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), G(e, l), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var em = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), tm = /* @__PURE__ */ U("<input/>");
function nm(e, t) {
	O(t, !0);
	let n = Y(t, "value", 15), r = /* @__PURE__ */ pa(t, em), i = /* @__PURE__ */ A(() => Z(r, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...Ro,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var a = W(), o = F(a), s = (e) => {
		var t = tm();
		J(t, () => ({
			...V(i),
			value: n(),
			defaultChecked: V(i).checked
		})), G(e, t);
	}, c = (e) => {
		var t = tm(), r = (e) => n(e.currentTarget.value);
		J(t, () => ({
			...V(i),
			value: n(),
			defaultValue: n() ?? "",
			oninput: r
		})), G(e, t);
	};
	q(o, (e) => {
		V(i).type === "checkbox" ? e(s) : e(c, -1);
	}), G(e, a), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/floating-layer/floating-root.svelte.js
var rm = new Uo("Floating.Root"), im = new Uo("Floating.Root"), am = class e {
	static create(t = !1) {
		return t ? im.set(new e()) : rm.set(new e());
	}
	anchorNode = qa(null);
	customAnchorNode = qa(null);
	triggerNode = qa(null);
	constructor() {
		L(() => {
			this.customAnchorNode.current ? typeof this.customAnchorNode.current == "string" ? this.anchorNode.current = document.querySelector(this.customAnchorNode.current) : this.anchorNode.current = this.customAnchorNode.current : this.anchorNode.current = this.triggerNode.current;
		});
	}
}, om = class e {
	static create(t, n = !1) {
		return n ? new e(t, im.get()) : new e(t, rm.get());
	}
	opts;
	root;
	constructor(e, t) {
		this.opts = e, this.root = t, t.triggerNode = e.virtualEl && e.virtualEl.current ? Ka(e.virtualEl.current) : e.ref;
	}
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function sm(e, t) {
	O(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	am.create(H(() => n()));
	var r = W();
	K(F(r), () => t.children ?? g), G(e, r), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function cm(e) {
	return typeof e == "function" ? e() : e;
}
function lm(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function um(e, t) {
	let n = lm(e);
	return Math.round(t * n) / n;
}
function dm(e) {
	return {
		[`--bits-${e}-content-transform-origin`]: "var(--bits-floating-transform-origin)",
		[`--bits-${e}-content-available-width`]: "var(--bits-floating-available-width)",
		[`--bits-${e}-content-available-height`]: "var(--bits-floating-available-height)",
		[`--bits-${e}-anchor-width`]: "var(--bits-floating-anchor-width)",
		[`--bits-${e}-anchor-height`]: "var(--bits-floating-anchor-height)"
	};
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
function fm(e, t) {
	O(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	om.create({
		id: X(() => t.id),
		virtualEl: X(() => t.virtualEl),
		ref: H(() => t.ref)
	}, H(() => n()));
	var r = W();
	K(F(r), () => t.children ?? g), G(e, r), k();
}
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var pm = [
	"top",
	"right",
	"bottom",
	"left"
], mm = Math.min, hm = Math.max, gm = Math.round, _m = Math.floor, vm = (e) => ({
	x: e,
	y: e
}), ym = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function bm(e, t, n) {
	return hm(e, mm(t, n));
}
function xm(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Sm(e) {
	return e.split("-")[0];
}
function Cm(e) {
	return e.split("-")[1];
}
function wm(e) {
	return e === "x" ? "y" : "x";
}
function Tm(e) {
	return e === "y" ? "height" : "width";
}
function Em(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function Dm(e) {
	return wm(Em(e));
}
function Om(e, t, n) {
	n === void 0 && (n = !1);
	let r = Cm(e), i = Dm(e), a = Tm(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Lm(o)), [o, Lm(o)];
}
function km(e) {
	let t = Lm(e);
	return [
		Am(e),
		t,
		Am(t)
	];
}
function Am(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var jm = ["left", "right"], Mm = ["right", "left"], Nm = ["top", "bottom"], Pm = ["bottom", "top"];
function Fm(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Mm : jm : t ? jm : Mm;
		case "left":
		case "right": return t ? Nm : Pm;
		default: return [];
	}
}
function Im(e, t, n, r) {
	let i = Cm(e), a = Fm(Sm(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Am)))), a;
}
function Lm(e) {
	let t = Sm(e);
	return ym[t] + e.slice(t.length);
}
function Rm(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function zm(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Rm(e);
}
function Bm(e) {
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
function Vm(e, t, n) {
	let { reference: r, floating: i } = e, a = Em(t), o = Dm(t), s = Tm(o), c = Sm(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
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
	let m = Cm(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Hm(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = xm(t, e), p = zm(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Bm(await i.getClippingRect({
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
	}, y = Bm(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
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
var Um = 50, Wm = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Hm
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Vm(l, r, c), f = r, p = 0, m = {};
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
		}, x && p < Um && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Vm(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Gm = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = xm(e, t) || {};
		if (l == null) return {};
		let d = zm(u), f = {
			x: n,
			y: r
		}, p = Dm(i), m = Tm(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		C && await (o.isElement == null ? void 0 : o.isElement(S)) || (C = s.floating[y] || a.floating[m]);
		let w = b / 2 - x / 2, ee = C / 2 - h[m] / 2 - 1, te = mm(d[_], ee), ne = mm(d[v], ee), re = C - h[m] - ne, ie = C / 2 - h[m] / 2 + w, ae = bm(te, ie, re), oe = !c.arrow && Cm(i) != null && ie !== ae && a.reference[m] / 2 - (ie < te ? te : ne) - h[m] / 2 < 0, se = oe ? ie < te ? ie - te : ie - re : 0;
		return {
			[p]: f[p] + se,
			data: {
				[p]: ae,
				centerOffset: ie - ae - se,
				...oe && { alignmentOffset: se }
			},
			reset: oe
		};
	}
}), Km = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = xm(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = Sm(r), _ = Em(o), v = Sm(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Lm(o)] : km(o)), x = p !== "none";
			!d && x && b.push(...Im(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], ee = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = Om(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (ee = [...ee, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === Em(t) || ee.every((e) => Em(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: ee
					},
					reset: { placement: t }
				};
				let n = ee.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = ee.filter((e) => {
							if (x) {
								let t = Em(e.placement);
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
function qm(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function Jm(e) {
	return pm.some((t) => e[t] >= 0);
}
var Ym = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = xm(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = qm(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: Jm(e)
					} };
				}
				case "escaped": {
					let e = qm(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: Jm(e)
					} };
				}
				default: return {};
			}
		}
	};
}, Xm = /*#__PURE__*/ new Set(["left", "top"]);
async function Zm(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Sm(n), s = Cm(n), c = Em(n) === "y", l = Xm.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = xm(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
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
var Qm = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Zm(t, e);
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
}, $m = function(e) {
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
			} }, ...l } = xm(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Em(i), p = wm(f), m = u[p], h = u[f], g = (e, t) => bm(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
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
}, eh = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = xm(e, t), u = {
				x: n,
				y: r
			}, d = Em(i), f = wm(d), p = u[f], m = u[d], h = xm(s, t), g = typeof h == "number" ? {
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
				let e = f === "y" ? "width" : "height", t = Xm.has(Sm(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, th = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = xm(e, t), c = await i.detectOverflow(t, s), l = Sm(n), u = Cm(n), d = Em(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = mm(p - c[m], g), y = mm(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * hm(c.left, c.right) : S = p - 2 * hm(c.top, c.bottom)), await o({
				...t,
				availableWidth: C,
				availableHeight: S
			});
			let w = await i.getDimensions(a.floating);
			return f !== w.width || p !== w.height ? { reset: { rects: !0 } } : {};
		}
	};
};
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function nh() {
	return typeof window < "u";
}
function rh(e) {
	return oh(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function ih(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ah(e) {
	return ((oh(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function oh(e) {
	return nh() ? e instanceof Node || e instanceof ih(e).Node : !1;
}
function sh(e) {
	return nh() ? e instanceof Element || e instanceof ih(e).Element : !1;
}
function ch(e) {
	return nh() ? e instanceof HTMLElement || e instanceof ih(e).HTMLElement : !1;
}
function lh(e) {
	return !nh() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof ih(e).ShadowRoot;
}
function uh(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = xh(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function dh(e) {
	return /^(table|td|th)$/.test(rh(e));
}
function fh(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var ph = /transform|translate|scale|rotate|perspective|filter/, mh = /paint|layout|strict|content/, hh = (e) => !!e && e !== "none", gh;
function _h(e) {
	let t = sh(e) ? xh(e) : e;
	return hh(t.transform) || hh(t.translate) || hh(t.scale) || hh(t.rotate) || hh(t.perspective) || !yh() && (hh(t.backdropFilter) || hh(t.filter)) || ph.test(t.willChange || "") || mh.test(t.contain || "");
}
function vh(e) {
	let t = Ch(e);
	for (; ch(t) && !bh(t);) {
		if (_h(t)) return t;
		if (fh(t)) return null;
		t = Ch(t);
	}
	return null;
}
function yh() {
	return gh ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), gh;
}
function bh(e) {
	return /^(html|body|#document)$/.test(rh(e));
}
function xh(e) {
	return ih(e).getComputedStyle(e);
}
function Sh(e) {
	return sh(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function Ch(e) {
	if (rh(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || lh(e) && e.host || ah(e);
	return lh(t) ? t.host : t;
}
function wh(e) {
	let t = Ch(e);
	return bh(t) ? (e.ownerDocument || e).body : ch(t) && uh(t) ? t : wh(t);
}
function Th(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = wh(e), i = r === e.ownerDocument?.body, a = ih(r);
	if (i) {
		let e = Eh(a);
		return t.concat(a, a.visualViewport || [], uh(r) ? r : [], e && n ? Th(e) : []);
	}
	return t.concat(r, Th(r, [], n));
}
function Eh(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function Dh(e) {
	let t = xh(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = ch(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = gm(n) !== a || gm(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function Oh(e) {
	return sh(e) ? e : e.contextElement;
}
function kh(e) {
	let t = Oh(e);
	if (!ch(t)) return vm(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = Dh(t), o = (a ? gm(n.width) : n.width) / r, s = (a ? gm(n.height) : n.height) / i;
	return o && Number.isFinite(o) || (o = 1), s && Number.isFinite(s) || (s = 1), {
		x: o,
		y: s
	};
}
var Ah = /*#__PURE__*/ vm(0);
function jh(e) {
	let t = ih(e);
	return !yh() || !t.visualViewport ? Ah : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Mh(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === ih(e);
}
function Nh(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = Oh(e), o = vm(1);
	t && (r ? sh(r) && (o = kh(r)) : o = kh(e));
	let s = Mh(a, n, r) ? jh(a) : vm(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = ih(a), t = sh(r) ? ih(r) : r, n = e, i = Eh(n);
		for (; i && t !== n;) {
			let e = kh(i), t = i.getBoundingClientRect(), r = xh(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = ih(i), i = Eh(n);
		}
	}
	return Bm({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Ph(e, t) {
	let n = Sh(e).scrollLeft;
	return t ? t.left + n : Nh(ah(e)).left + n;
}
function Fh(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Ph(e, n),
		y: n.top + t.scrollTop
	};
}
function Ih(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = ah(r), s = t ? fh(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = vm(1), u = vm(0), d = ch(r);
	if ((d || !a) && ((rh(r) !== "body" || uh(o)) && (c = Sh(r)), d)) {
		let e = Nh(r);
		l = kh(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Fh(o, c) : vm(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Lh(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Rh(e) {
	let t = Sh(e), n = e.ownerDocument.body, r = hm(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = hm(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + Ph(e), o = -t.scrollTop;
	return xh(n).direction === "rtl" && (a += hm(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var zh = 25;
function Bh(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = ih(e), a = ah(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !yh() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (Ph(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= zh && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Vh(e, t) {
	let n = Nh(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = kh(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Hh(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Bh(e, n, t);
	else if (t === "document") r = Rh(ah(e));
	else if (sh(t)) r = Vh(t, n);
	else {
		let n = jh(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Bm(r);
}
function Uh(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = Th(e, [], !1).filter((e) => sh(e) && rh(e) !== "body"), i = null, a = xh(e).position === "fixed", o = a ? Ch(e) : e;
	for (; sh(o) && !bh(o);) {
		let e = xh(o), t = _h(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = Ch(o);
	}
	return t.set(e, r), r;
}
function Wh(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? fh(t) ? [] : Uh(t, this._c) : [].concat(n), r], o = Hh(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Hh(t, a[e], i);
		s = hm(n.top, s), c = mm(n.right, c), l = mm(n.bottom, l), u = hm(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Gh(e) {
	let { width: t, height: n } = Dh(e);
	return {
		width: t,
		height: n
	};
}
function Kh(e, t, n) {
	let r = ch(t), i = ah(t), a = n === "fixed", o = Nh(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = vm(0);
	if ((r || !a) && ((rh(t) !== "body" || uh(i)) && (s = Sh(t)), r)) {
		let e = Nh(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = Ph(i));
	let l = i && !r && !a ? Fh(i, s) : vm(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function qh(e) {
	return xh(e).position === "static";
}
function Jh(e, t) {
	if (!ch(e) || xh(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return ah(e) === n && (n = n.ownerDocument.body), n;
}
function Yh(e, t) {
	let n = ih(e);
	if (fh(e)) return n;
	if (!ch(e)) {
		let t = Ch(e);
		for (; t && !bh(t);) {
			if (sh(t) && !qh(t)) return t;
			t = Ch(t);
		}
		return n;
	}
	let r = Jh(e, t);
	for (; r && dh(r) && qh(r);) r = Jh(r, t);
	return r && bh(r) && qh(r) && !_h(r) ? n : r || vh(e) || n;
}
var Xh = async function(e) {
	let t = this.getOffsetParent || Yh, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Kh(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Zh(e) {
	return xh(e).direction === "rtl";
}
var Qh = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Ih,
	getDocumentElement: ah,
	getClippingRect: Wh,
	getOffsetParent: Yh,
	getElementRects: Xh,
	getClientRects: Lh,
	getDimensions: Gh,
	getScale: kh,
	isElement: sh,
	isRTL: Zh
};
function $h(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function eg(e, t, n) {
	let r = null, i, a = ah(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = _m(d), h = _m(a.clientWidth - (u + f)), g = _m(a.clientHeight - (d + p)), _ = _m(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: hm(0, mm(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!$h(l, e.getBoundingClientRect())) return s();
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
	let c = ih(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function tg(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = Oh(e), u = i || a ? [...l ? Th(l) : [], ...t ? Th(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? eg(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Nh(e) : null;
	c && g();
	function g() {
		let t = Nh(e);
		h && !$h(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var ng = Qm, rg = $m, ig = Km, ag = th, og = Ym, sg = Gm, cg = eh, lg = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Qh,
		...i.platform,
		_c: r
	};
	return Wm(e, t, {
		...i,
		platform: a
	});
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function ug(e) {
	let t = e.whileElementsMounted, n = /* @__PURE__ */ A(() => cm(e.open) ?? !0), r = /* @__PURE__ */ A(() => cm(e.middleware)), i = /* @__PURE__ */ A(() => cm(e.transform) ?? !0), a = /* @__PURE__ */ A(() => cm(e.placement) ?? "bottom"), o = /* @__PURE__ */ A(() => cm(e.strategy) ?? "absolute"), s = /* @__PURE__ */ A(() => cm(e.sideOffset) ?? 0), c = /* @__PURE__ */ A(() => cm(e.alignOffset) ?? 0), l = e.reference, u;
	kn(() => {
		u = {
			middleware: V(r),
			placement: V(a),
			strategy: V(o),
			open: V(n),
			sideOffset: V(s),
			alignOffset: V(c)
		};
	});
	let d = /* @__PURE__ */ M(0), f = /* @__PURE__ */ M(0), p = qa(null), m = /* @__PURE__ */ M(an(V(o))), h = /* @__PURE__ */ M(an(V(a))), g = /* @__PURE__ */ M(an({})), _ = /* @__PURE__ */ M(!1), v = !1, y = 0, b = !1, x = /* @__PURE__ */ A(() => {
		let e = p.current ? um(p.current, V(d)) : V(d), t = p.current ? um(p.current, V(f)) : V(f);
		return V(i) ? {
			position: V(m),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...p.current && lm(p.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: V(m),
			left: `${e}px`,
			top: `${t}px`
		};
	}), S;
	function C() {
		if (b || l.current === null || p.current === null) return;
		let e = l.current, t = p.current, n = ++y;
		lg(e, t, {
			middleware: u.middleware,
			placement: u.placement,
			strategy: u.strategy
		}).then((r) => {
			if (n === y && l.current === e && p.current === t) {
				if (dg(e)) N(g, {
					...V(g),
					hide: {
						...V(g).hide,
						referenceHidden: !0
					}
				}, !0);
				else {
					if (!u.open && V(d) !== 0 && V(f) !== 0) {
						let e = Math.max(Math.abs(u.sideOffset), Math.abs(u.alignOffset), 15);
						if (r.x <= e && r.y <= e) return;
					}
					N(d, r.x, !0), N(f, r.y, !0), N(m, r.strategy, !0), N(h, r.placement, !0), N(g, r.middlewareData, !0), N(_, !0);
				}
			}
		});
	}
	function w() {
		typeof S == "function" && (S(), S = void 0), y++;
	}
	function ee() {
		w(), t === void 0 ? (te(), C()) : V(n) && l.current !== null && p.current !== null && (te(), S = t(l.current, p.current, C));
	}
	function te() {
		return [
			V(r),
			V(a),
			V(o)
		];
	}
	function ne() {
		!V(n) && p.current === null && N(_, !1);
	}
	function re() {
		return [
			V(r),
			V(a),
			V(o),
			V(s),
			V(c),
			V(n)
		];
	}
	return L(() => {
		t === void 0 && V(n) && (te(), C());
	}), L(ee), L(() => {
		t !== void 0 && (re(), V(n) && V(_) ? v ? C() : v = !0 : v = !1);
	}), L(ne), L(() => () => {
		b = !0, w();
	}), {
		floating: p,
		reference: l,
		get strategy() {
			return V(m);
		},
		get placement() {
			return V(h);
		},
		get middlewareData() {
			return V(g);
		},
		get isPositioned() {
			return V(_);
		},
		get floatingStyles() {
			return V(x);
		},
		get update() {
			return C;
		}
	};
}
function dg(e) {
	return e instanceof Element ? !e.isConnected || e instanceof HTMLElement && e.hidden ? !0 : e.getClientRects().length === 0 : !1;
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var fg = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, pg = new Uo("Floating.Content"), mg = class e {
	static create(t, n = !1) {
		return n ? pg.set(new e(t, im.get())) : pg.set(new e(t, rm.get()));
	}
	opts;
	root;
	contentRef = qa(null);
	wrapperRef = qa(null);
	arrowRef = qa(null);
	contentAttachment = ds(this.contentRef);
	wrapperAttachment = ds(this.wrapperRef);
	arrowAttachment = ds(this.arrowRef);
	arrowId = qa(ul());
	#e = /* @__PURE__ */ A(() => {
		if (typeof this.opts.style == "string") return Oo(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new Yo(() => this.arrowRef.current ?? void 0);
	#r = /* @__PURE__ */ A(() => this.#n?.width ?? 0);
	#i = /* @__PURE__ */ A(() => this.#n?.height ?? 0);
	#a = /* @__PURE__ */ A(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = /* @__PURE__ */ A(() => (Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]).filter(js));
	#s = /* @__PURE__ */ A(() => V(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return V(this.#s);
	}
	set hasExplicitBoundaries(e) {
		N(this.#s, e);
	}
	#c = /* @__PURE__ */ A(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: V(this.#o),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return V(this.#c);
	}
	set detectOverflowOptions(e) {
		N(this.#c, e);
	}
	#l = /* @__PURE__ */ M(void 0);
	#u = /* @__PURE__ */ M(void 0);
	#d = /* @__PURE__ */ M(void 0);
	#f = /* @__PURE__ */ M(void 0);
	#p = /* @__PURE__ */ A(() => [
		ng({
			mainAxis: this.opts.sideOffset.current + V(this.#i),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && rg({
			mainAxis: !0,
			crossAxis: !1,
			limiter: this.opts.sticky.current === "partial" ? cg() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && ig({ ...this.detectOverflowOptions }),
		ag({
			...this.detectOverflowOptions,
			apply: ({ rects: e, availableWidth: t, availableHeight: n }) => {
				let { width: r, height: i } = e.reference;
				N(this.#l, t, !0), N(this.#u, n, !0), N(this.#d, r, !0), N(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && sg({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		hg({
			arrowWidth: V(this.#r),
			arrowHeight: V(this.#i)
		}),
		this.opts.hideWhenDetached.current && og({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		}),
		this.opts.hideWhenDetached.current && !this.hasExplicitBoundaries && {
			...og({
				strategy: "referenceHidden",
				boundary: "clippingAncestors"
			}),
			name: "hideClipping"
		}
	].filter(Boolean));
	get middleware() {
		return V(this.#p);
	}
	set middleware(e) {
		N(this.#p, e);
	}
	floating;
	#m = /* @__PURE__ */ A(() => _g(this.floating.placement));
	get placedSide() {
		return V(this.#m);
	}
	set placedSide(e) {
		N(this.#m, e);
	}
	#h = /* @__PURE__ */ A(() => vg(this.floating.placement));
	get placedAlign() {
		return V(this.#h);
	}
	set placedAlign(e) {
		N(this.#h, e);
	}
	#g = /* @__PURE__ */ A(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return V(this.#g);
	}
	set arrowX(e) {
		N(this.#g, e);
	}
	#_ = /* @__PURE__ */ A(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return V(this.#_);
	}
	set arrowY(e) {
		N(this.#_, e);
	}
	#v = /* @__PURE__ */ A(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return V(this.#v);
	}
	set cannotCenterArrow(e) {
		N(this.#v, e);
	}
	#y = /* @__PURE__ */ M("auto");
	get contentZIndex() {
		return V(this.#y);
	}
	set contentZIndex(e) {
		N(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ A(() => fg[this.placedSide]);
	get arrowBaseSide() {
		return V(this.#b);
	}
	set arrowBaseSide(e) {
		N(this.#b, e);
	}
	#x = /* @__PURE__ */ A(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${V(this.#l)}px`,
			"--bits-floating-available-height": `${V(this.#u)}px`,
			"--bits-floating-anchor-width": `${V(this.#d)}px`,
			"--bits-floating-anchor-height": `${V(this.#f)}px`,
			...(this.floating.middlewareData.hide?.referenceHidden || this.floating.middlewareData.hideClipping?.referenceHidden) && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...V(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return V(this.#x);
	}
	set wrapperProps(e) {
		N(this.#x, e);
	}
	#S = /* @__PURE__ */ A(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: Fo({ ...V(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return V(this.#S);
	}
	set props(e) {
		N(this.#S, e);
	}
	#C = /* @__PURE__ */ A(() => ({
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
		return V(this.#C);
	}
	set arrowStyle(e) {
		N(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), Ko(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = ug({
			strategy: () => this.opts.strategy.current,
			placement: () => V(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => tg(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), L(() => {
			this.floating.isPositioned && this.opts.onPlaced?.current();
		}), Ko([() => this.contentRef.current, () => this.opts.enabled.current], ([e, t]) => {
			if (!e || !t) return;
			let n = cs(e), r = n.requestAnimationFrame(() => {
				if (this.contentRef.current !== e || !this.opts.enabled.current) return;
				let t = n.getComputedStyle(e).zIndex;
				t !== this.contentZIndex && (this.contentZIndex = t);
			});
			return () => {
				n.cancelAnimationFrame(r);
			};
		}), L(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}
};
function hg(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = gg(n), u = {
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
function gg(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
function _g(e) {
	return gg(e)[0];
}
function vg(e) {
	return gg(e)[1];
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
function yg(e, t) {
	O(t, !0);
	let n = Y(t, "side", 3, "bottom"), r = Y(t, "sideOffset", 3, 0), i = Y(t, "align", 3, "center"), a = Y(t, "alignOffset", 3, 0), o = Y(t, "arrowPadding", 3, 0), s = Y(t, "avoidCollisions", 3, !0), c = Y(t, "collisionBoundary", 19, () => []), l = Y(t, "collisionPadding", 3, 0), u = Y(t, "hideWhenDetached", 3, !1), d = Y(t, "onPlaced", 3, () => {}), f = Y(t, "sticky", 3, "partial"), p = Y(t, "updatePositionStrategy", 3, "optimized"), m = Y(t, "strategy", 3, "fixed"), h = Y(t, "dir", 3, "ltr"), _ = Y(t, "style", 19, () => ({})), v = Y(t, "wrapperId", 19, ul), y = Y(t, "customAnchor", 3, null), b = Y(t, "tooltip", 3, !1), x = mg.create({
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
	}, H(() => b())), S = /* @__PURE__ */ A(() => Z(x.wrapperProps, { style: { pointerEvents: "auto" } }));
	var C = W();
	K(F(C), () => t.content ?? g, () => ({
		props: x.props,
		wrapperProps: V(S)
	})), G(e, C), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function bg(e, t) {
	O(t, !0), ci(() => {
		t.onPlaced?.();
	});
	var n = W();
	K(F(n), () => t.content ?? g, () => ({
		props: {},
		wrapperProps: {}
	})), G(e, n), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
var xg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"content",
	"isStatic",
	"onPlaced"
]);
function Sg(e, t) {
	let n = Y(t, "isStatic", 3, !1), r = /* @__PURE__ */ pa(t, xg);
	var i = W(), a = F(i), o = (e) => {
		bg(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, s = (e) => {
		yg(e, ha({
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
	}), G(e, i);
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var Cg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.forceMount.ref.tooltip.contentPointerEvents".split(".")), wg = /* @__PURE__ */ U("<!> <!>", 1);
function Tg(e, t) {
	O(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = Y(t, "tooltip", 3, !1), c = Y(t, "contentPointerEvents", 3, "auto"), l = /* @__PURE__ */ pa(t, Cg), u = /* @__PURE__ */ A(() => t.preventScroll ?? !0), d = /* @__PURE__ */ A(() => t.strategy ?? (V(u) ? "fixed" : "absolute"));
	Sg(e, {
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
			return V(d);
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
			var d = wg(), f = F(d), p = (e) => {
				Ol(e, { get preventScroll() {
					return V(u);
				} });
			}, m = (e) => {
				Ol(e, { get preventScroll() {
					return V(u);
				} });
			};
			q(f, (e) => {
				t.forceMount && t.enabled ? e(p) : t.forceMount || e(m, 1);
			}), nl(I(f, 2), {
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
					bc(e, {
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
							_c(e, {
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
									ll(e, {
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
											var i = W(), u = F(i);
											{
												let e = /* @__PURE__ */ A(() => ({
													props: Z(l, o(), r(), a(), {
														id: t.id,
														style: { pointerEvents: c() }
													}),
													wrapperProps: s()
												}));
												K(u, () => t.popper ?? g, () => V(e));
											}
											G(e, i);
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
			}), G(e, d);
		},
		$$slots: { content: !0 }
	}), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var Eg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function Dg(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ pa(t, Eg);
	var c = W(), l = F(c), u = (e) => {
		Tg(e, ha({
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
	}), G(e, c);
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var Og = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function kg(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ pa(t, Og);
	Tg(e, ha({
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
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var Ag = _s({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), jg = new Uo("DateField.Root"), Mg = class e {
	static create(t, n) {
		return jg.set(new e(t, n));
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
	descriptionId = ul();
	formatter;
	initialSegments;
	#e = /* @__PURE__ */ M();
	get segmentValues() {
		return V(this.#e);
	}
	set segmentValues(e) {
		N(this.#e, e, !0);
	}
	announcer;
	#t = /* @__PURE__ */ A(() => new Set(this.readonlySegments.current));
	get readonlySegmentsSet() {
		return V(this.#t);
	}
	set readonlySegmentsSet(e) {
		N(this.#t, e);
	}
	segmentStates = of();
	#n = /* @__PURE__ */ M(null);
	#r = /* @__PURE__ */ M(null);
	#i = /* @__PURE__ */ M(null);
	get descriptionNode() {
		return V(this.#i);
	}
	set descriptionNode(e) {
		N(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ M(null);
	get validationNode() {
		return V(this.#a);
	}
	set validationNode(e) {
		N(this.#a, e, !0);
	}
	states = of();
	#o = !1;
	#s = /* @__PURE__ */ M(null);
	get dayPeriodNode() {
		return V(this.#s);
	}
	set dayPeriodNode(e) {
		N(this.#s, e, !0);
	}
	hourInputDayPeriodHint = null;
	rangeRoot = void 0;
	#c = /* @__PURE__ */ M("");
	get name() {
		return V(this.#c);
	}
	set name(e) {
		N(this.#c, e, !0);
	}
	domContext = new us(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? qa(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = jf({
			initialLocale: this.locale.current,
			monthFormat: X(() => "long"),
			yearFormat: X(() => "numeric")
		}), this.initialSegments = ef(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = Cd(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), L(() => {
			H(() => {
				this.initialSegments = ef(this.inferredGranularity);
			});
		}), ci(() => {
			this.announcer = Cd(this.domContext.getDocument());
		}), Xo(() => {
			t || yf(this.descriptionId, this.domContext.getDocument());
		}), L(() => {
			this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), L(() => {
			if (t) return;
			this.value.current && vf({
				id: H(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = H(() => this.placeholder.current);
			this.value.current && e !== this.value.current && H(() => {
				this.value.current && (this.placeholder.current = this.value.current);
			});
		}), this.value.current && this.syncSegmentValues(this.value.current), L(() => {
			this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#l();
		}), L(() => {
			if (this.value.current === void 0) {
				if (this.#o) {
					this.#o = !1;
					return;
				}
				this.segmentValues = ef(this.inferredGranularity);
			}
		}), Ko(() => this.validationStatus, () => {
			this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
		});
	}
	setName(e) {
		this.name = e;
	}
	setFieldNode(e) {
		N(this.#n, e, !0);
	}
	getFieldNode() {
		return this.rangeRoot ? this.rangeRoot.fieldNode : V(this.#n);
	}
	setLabelNode(e) {
		N(this.#r, e, !0);
	}
	getLabelNode() {
		return this.rangeRoot ? this.rangeRoot.labelNode : V(this.#r);
	}
	#l() {
		this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
	}
	setValue(e) {
		this.value.current = e;
	}
	syncSegmentValues(e) {
		let t = Rd.map((t) => {
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
			let n = zd.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(e)];
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
	#u = /* @__PURE__ */ A(() => {
		let e = this.value.current;
		if (!e) return !1;
		let t = this.validate.current?.(e);
		if (t) return {
			reason: "custom",
			message: t
		};
		let n = this.minValue.current;
		if (n && Pd(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && Pd(r, e) ? { reason: "max" } : !1;
	});
	get validationStatus() {
		return V(this.#u);
	}
	set validationStatus(e) {
		N(this.#u, e);
	}
	#d = /* @__PURE__ */ A(() => this.validationStatus !== !1 && (this.isInvalidProp.current, !0));
	get isInvalid() {
		return V(this.#d);
	}
	set isInvalid(e) {
		N(this.#d, e);
	}
	#f = /* @__PURE__ */ A(() => this.granularity.current || gf(this.placeholder.current, this.granularity.current));
	get inferredGranularity() {
		return V(this.#f);
	}
	set inferredGranularity(e) {
		N(this.#f, e);
	}
	#p = /* @__PURE__ */ A(() => this.value.current === void 0 ? this.placeholder.current : this.value.current);
	get dateRef() {
		return V(this.#p);
	}
	set dateRef(e) {
		N(this.#p, e);
	}
	#m = /* @__PURE__ */ A(() => rf({
		segmentValues: this.segmentValues,
		formatter: this.formatter,
		locale: this.locale.current,
		granularity: this.inferredGranularity,
		dateRef: this.dateRef,
		hideTimeZone: this.hideTimeZone.current,
		hourCycle: this.hourCycle.current
	}));
	get allSegmentContent() {
		return V(this.#m);
	}
	set allSegmentContent(e) {
		N(this.#m, e);
	}
	#h = /* @__PURE__ */ A(() => this.allSegmentContent.arr);
	get segmentContents() {
		return V(this.#h);
	}
	set segmentContents(e) {
		N(this.#h, e);
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
		if (hf(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = Nd(Dd(s.set({ month: Number.parseInt(t) })));
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
				let t = this.hourInputDayPeriodHint, i = r(t === null ? n : Cf(a.hour)), c = i !== null && t !== null ? Sf(i, t) : i;
				if (this.states.hour.updating = c, c !== null && a.dayPeriod !== null) {
					if (t !== null) a.dayPeriod = t;
					else {
						let e = this.formatter.dayPeriod(s.set({ hour: Number.parseInt(c) }), this.hourCycle.current);
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
		} else if (sf(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = Nd(Dd(s.set({ month: Number.parseInt(i) })));
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
		this.segmentValues = o, mf(o, V(this.#n)) ? this.setValue(pf({
			segmentObj: o,
			fieldNode: V(this.#n),
			dateRef: this.placeholder.current
		})) : (this.value.current !== void 0 && (this.#o = !0), this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": ps(this.isInvalid),
			"aria-disabled": fs(this.disabled.current),
			"aria-readonly": fs(this.readonly.current || n),
			"data-invalid": Q(this.isInvalid),
			"data-disabled": Q(this.disabled.current),
			"data-readonly": Q(this.readonly.current || n),
			"data-segment": `${e}`,
			[Ag.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = _f(t, V(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, Ng = class e {
	static create(t) {
		return new e(t, jg.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new us(e.ref), this.root.domContext = this.domContext, this.attachment = ds(e.ref, (e) => this.root.setFieldNode(e)), Ko(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = /* @__PURE__ */ A(() => {
		if (Cs && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": V(this.#e),
		"aria-disabled": fs(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": Q(this.root.disabled.current),
		[Ag.input]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, Pg = class e {
	static create() {
		return new e(jg.get());
	}
	root;
	#e = /* @__PURE__ */ A(() => this.root.name !== "");
	get shouldRender() {
		return V(this.#e);
	}
	set shouldRender(e) {
		N(this.#e, e);
	}
	#t = /* @__PURE__ */ A(() => this.root.value.current ? this.root.value.current.toString() : "");
	get isoValue() {
		return V(this.#t);
	}
	set isoValue(e) {
		N(this.#t, e);
	}
	constructor(e) {
		this.root = e;
	}
	#n = /* @__PURE__ */ A(() => ({
		name: this.root.name,
		value: this.isoValue,
		required: this.root.required.current
	}));
	get props() {
		return V(this.#n);
	}
	set props(e) {
		N(this.#n, e);
	}
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function Fg(e, t) {
	O(t, !0);
	let n = Pg.create();
	var r = W(), i = F(r), a = (e) => {
		nm(e, ha(() => n.props));
	};
	q(i, (e) => {
		n.shouldRender && e(a);
	}), G(e, r), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var Ig = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), Lg = /* @__PURE__ */ U("<div><!></div>"), Rg = /* @__PURE__ */ U("<!> <!>", 1);
function zg(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = Y(t, "name", 3, ""), o = /* @__PURE__ */ pa(t, Ig), s = Ng.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		name: X(() => a())
	}), c = /* @__PURE__ */ A(() => Z(o, s.props));
	var l = Rg(), u = F(l), d = (e) => {
		var n = W();
		K(F(n), () => t.child, () => ({
			props: V(c),
			segments: s.root.segmentContents
		})), G(e, n);
	}, f = (e) => {
		var n = Lg();
		J(n, () => ({ ...V(c) })), K(P(n), () => t.children ?? g, () => ({ segments: s.root.segmentContents })), D(n), G(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), Fg(I(u, 2), {}), G(e, l), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var Bg = new Uo("DatePicker.Root"), Vg = class e {
	static create(t) {
		return Bg.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/internal/safe-polygon.svelte.js
function Hg(e, t) {
	let [n, r] = e, i = !1, a = t.length;
	for (let e = 0, o = a - 1; e < a; o = e++) {
		let [a, s] = t[e] ?? [0, 0], [c, l] = t[o] ?? [0, 0];
		s >= r != l >= r && n <= (c - a) * (r - s) / (l - s) + a && (i = !i);
	}
	return i;
}
function Ug(e, t) {
	return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom;
}
function Wg(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
var Gg = class {
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
		this.#n = typeof t == "number" && t > 0 ? t : null, Ko([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (!e || !t || !n) this.#o = null, this.#m();
			else return this.#o && this.#o !== e && this.#m(), this.#o = e, [
				Or(ss(e), "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				Or(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (Ds(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					Ds(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = Ds(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				Or(e, "pointerenter", () => {
					this.#m();
				}),
				Or(t, "pointerenter", () => {
					this.#m();
				}),
				Or(t, "pointerleave", (t) => {
					let n = t.relatedTarget;
					Ds(n) && e.contains(n) || (this.#r = [t.clientX, t.clientY], this.#i = "trigger", this.#u());
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
		if (this.#i === "content" && Ug(e, i) || this.#i === "trigger" && Ug(e, r)) {
			this.#m();
			return;
		}
		if (this.#i === "content" && this.#a.length > 0) for (let t of this.#a) {
			let n = t.getBoundingClientRect();
			if (Ug(e, n)) return;
			let i = Wg(r, n), a = this.#h(r, n, i);
			if (a && Hg(e, a)) return;
		}
		let a = Wg(r, i), o = this.#h(r, i, a);
		if (o && Hg(e, o)) return;
		let s = this.#i === "content" ? i : r;
		Hg(e, this.#g(this.#r, s, a, this.#i)) || (this.#m(), this.#e.onPointerExit());
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
}, Kg = _s({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
}), qg = new Uo("Popover.Root"), Jg = class e {
	static create(t) {
		return qg.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ M(null);
	get contentNode() {
		return V(this.#e);
	}
	set contentNode(e) {
		N(this.#e, e, !0);
	}
	contentPresence;
	#t = /* @__PURE__ */ M(null);
	get triggerNode() {
		return V(this.#t);
	}
	set triggerNode(e) {
		N(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ M(null);
	get overlayNode() {
		return V(this.#n);
	}
	set overlayNode(e) {
		N(this.#n, e, !0);
	}
	overlayPresence;
	#r = /* @__PURE__ */ M(!1);
	get openedViaHover() {
		return V(this.#r);
	}
	set openedViaHover(e) {
		N(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ M(!1);
	get hasInteractedWithContent() {
		return V(this.#i);
	}
	set hasInteractedWithContent(e) {
		N(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ M(!1);
	get hoverCooldown() {
		return V(this.#a);
	}
	set hoverCooldown(e) {
		N(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ M(0);
	get closeDelay() {
		return V(this.#o);
	}
	set closeDelay(e) {
		N(this.#o, e, !0);
	}
	#s = null;
	#c = null;
	constructor(e) {
		this.opts = e, this.contentPresence = new Ns({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new Ns({
			ref: X(() => this.overlayNode),
			open: this.opts.open
		}), Ko(() => this.opts.open.current, (e) => {
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
}, Yg = class e {
	static create(t) {
		return new e(t, qg.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ M(!1);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref, (e) => this.root.triggerNode = e), this.domContext = new us(e.ref), this.root.setDomContext(this.domContext), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), Ko(() => this.opts.closeDelay.current, (e) => {
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
		if (this.opts.disabled.current || !this.opts.openOnHover.current || As(e) || (N(this.#n, !0), this.#i(), this.root.cancelDelayedClose(), this.root.opts.open.current || this.root.hoverCooldown)) return;
		let t = this.opts.openDelay.current;
		t <= 0 ? this.root.handleHoverOpen() : this.#e = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen(), this.#e = null;
		}, t);
	}
	onpointerleave(e) {
		this.opts.disabled.current || this.opts.openOnHover.current && (As(e) || (N(this.#n, !1), this.#r(), this.root.hoverCooldown = !1));
	}
	onclick(e) {
		this.opts.disabled.current || e.button === 0 && (this.#a(), V(this.#n) && this.root.opts.open.current && this.root.openedViaHover ? (this.root.openedViaHover = !1, this.root.hasInteractedWithContent = !0) : (V(this.#n) && this.opts.openOnHover.current && this.root.opts.open.current && (this.root.hoverCooldown = !0), this.root.hoverCooldown && !this.root.opts.open.current && (this.root.hoverCooldown = !1), this.root.toggleOpen()));
	}
	onkeydown(e) {
		this.opts.disabled.current || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.#a(), this.root.toggleOpen());
	}
	#o() {
		if (this.root.opts.open.current && this.root.contentNode?.id) return this.root.contentNode?.id;
	}
	#s = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": fs(this.root.opts.open.current),
		"data-state": ms(this.root.opts.open.current),
		"aria-controls": this.#o(),
		[Kg.trigger]: "",
		disabled: this.opts.disabled.current,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return V(this.#s);
	}
	set props(e) {
		N(this.#s, e);
	}
}, Xg = class e {
	static create(t) {
		return new e(t, qg.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ds(this.opts.ref, (e) => this.root.contentNode = e), this.onpointerdown = this.onpointerdown.bind(this), this.onfocusin = this.onfocusin.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), new Gg({
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
		Ds(t) && Zc(t) && this.root.markInteraction();
	}
	onpointerenter(e) {
		As(e) || this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		As(e);
	}
	onInteractOutside = (e) => {
		if (this.opts.onInteractOutside.current(e), e.defaultPrevented || !Ds(e.target)) return;
		let t = ic(e, Kg.selector("trigger"));
		if (!(t && t === this.root.triggerNode)) {
			if (this.opts.customAnchor.current) {
				if (Ds(this.opts.customAnchor.current)) {
					if (rc(e, this.opts.customAnchor.current)) return;
				} else if (typeof this.opts.customAnchor.current == "string") {
					let t = document.querySelector(this.opts.customAnchor.current);
					if (t && rc(e, t)) return;
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
	#e = /* @__PURE__ */ A(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return V(this.#e);
	}
	set snippetProps(e) {
		N(this.#e, e);
	}
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		"data-state": ms(this.root.opts.open.current),
		...hs(this.root.contentPresence.transitionStatus),
		[Kg.content]: "",
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
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown
	};
};
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function Zg(e, t) {
	O(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $), a = Y(t, "value", 15), o = Y(t, "onValueChange", 3, $), s = Y(t, "placeholder", 15), c = Y(t, "onPlaceholderChange", 3, $), l = Y(t, "isDateUnavailable", 3, () => !1), u = Y(t, "validate", 3, $), d = Y(t, "onInvalid", 3, $), f = Y(t, "disabled", 3, !1), p = Y(t, "readonly", 3, !1), m = Y(t, "readonlySegments", 19, () => []), h = Y(t, "hideTimeZone", 3, !1), _ = Y(t, "required", 3, !1), v = Y(t, "calendarLabel", 3, "Event"), y = Y(t, "disableDaysOutsideMonth", 3, !0), b = Y(t, "preventDeselect", 3, !1), x = Y(t, "pagedNavigation", 3, !1), S = Y(t, "weekdayFormat", 3, "narrow"), C = Y(t, "isDateDisabled", 3, () => !1), w = Y(t, "fixedWeeks", 3, !1), ee = Y(t, "numberOfMonths", 3, 1), te = Y(t, "closeOnDateSelect", 3, !0), ne = Y(t, "initialFocus", 3, !1), re = Y(t, "monthFormat", 3, "long"), ie = Y(t, "yearFormat", 3, "numeric"), ae = H(() => Td({
		granularity: t.granularity,
		defaultValue: a(),
		minValue: t.minValue,
		maxValue: t.maxValue
	}));
	function oe() {
		s() === void 0 && s(ae);
	}
	oe(), Ko.pre(() => s(), () => {
		oe();
	});
	function se() {
		te() && n(!1);
	}
	let ce = Vg.create({
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		value: X(() => a(), (e) => {
			a(e), o()(e);
		}),
		placeholder: X(() => s() ?? ae, (e) => {
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
		locale: Zs(() => t.locale),
		hideTimeZone: X(() => h()),
		required: X(() => _()),
		calendarLabel: X(() => v()),
		disableDaysOutsideMonth: X(() => y()),
		preventDeselect: X(() => b()),
		pagedNavigation: X(() => x()),
		weekStartsOn: X(() => t.weekStartsOn),
		weekdayFormat: X(() => S()),
		isDateDisabled: X(() => C()),
		fixedWeeks: X(() => w()),
		numberOfMonths: X(() => ee()),
		initialFocus: X(() => ne()),
		onDateSelect: X(() => se),
		defaultPlaceholder: ae,
		monthFormat: X(() => re()),
		yearFormat: X(() => ie())
	});
	Jg.create({
		open: ce.opts.open,
		onOpenChangeComplete: X(() => i())
	}), Mg.create({
		value: ce.opts.value,
		disabled: ce.opts.disabled,
		readonly: ce.opts.readonly,
		readonlySegments: ce.opts.readonlySegments,
		validate: X(() => u()),
		onInvalid: X(() => d()),
		minValue: ce.opts.minValue,
		maxValue: ce.opts.maxValue,
		granularity: ce.opts.granularity,
		hideTimeZone: ce.opts.hideTimeZone,
		hourCycle: ce.opts.hourCycle,
		locale: ce.opts.locale,
		required: ce.opts.required,
		placeholder: ce.opts.placeholder,
		errorMessageId: X(() => t.errorMessageId),
		isInvalidProp: X(() => void 0)
	});
	var le = W();
	Si(F(le), () => sm, (e, n) => {
		n(e, {
			children: (e, n) => {
				var r = W();
				K(F(r), () => t.children ?? g), G(e, r);
			},
			$$slots: { default: !0 }
		});
	}), G(e, le), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Qg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), $g = /* @__PURE__ */ U("<div><!></div>");
function e_(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ pa(t, Qg), o = Bg.get(), s = cp.create({
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
	}), c = /* @__PURE__ */ A(() => Z(a, s.props));
	var l = W(), u = F(l), d = (e) => {
		var n = W(), r = F(n);
		{
			let e = /* @__PURE__ */ A(() => ({
				props: V(c),
				...s.snippetProps
			}));
			K(r, () => t.child, () => V(e));
		}
		G(e, n);
	}, f = (e) => {
		var n = $g();
		J(n, () => ({ ...V(c) })), K(P(n), () => t.children ?? g, () => s.snippetProps), D(n), G(e, n);
	};
	q(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), G(e, l), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/popover/components/popover-content-static.svelte
var t_ = /* @__PURE__ */ new Set([
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
]), n_ = /* @__PURE__ */ U("<div><!></div>");
function r_(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => Ps(n)), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onEscapeKeydown", 3, $), c = Y(t, "onInteractOutside", 3, $), l = Y(t, "trapFocus", 3, !0), u = Y(t, "preventScroll", 3, !1), d = /* @__PURE__ */ pa(t, t_), f = Xg.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		onInteractOutside: X(() => c()),
		onEscapeKeydown: X(() => s()),
		customAnchor: X(() => null)
	}), p = /* @__PURE__ */ A(() => Z(d, f.props));
	var m = W(), h = F(m), _ = (e) => {
		kg(e, ha(() => V(p), () => f.popperProps, {
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
				let r = () => (n?.()).props, i = /* @__PURE__ */ A(() => Z(r(), { style: dm("popover") }, { style: t.style }));
				var a = W(), o = F(a), s = (e) => {
					var n = W(), r = F(n);
					{
						let e = /* @__PURE__ */ A(() => ({
							props: V(i),
							...f.snippetProps
						}));
						K(r, () => t.child, () => V(e));
					}
					G(e, n);
				}, c = (e) => {
					var n = n_();
					J(n, () => ({ ...V(i) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
				};
				q(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), G(e, a);
			},
			$$slots: { popper: !0 }
		}));
	}, v = (e) => {
		Dg(e, ha(() => V(p), () => f.popperProps, {
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
				let r = () => (n?.()).props, i = /* @__PURE__ */ A(() => Z(r(), { style: dm("popover") }, { style: t.style }));
				var a = W(), o = F(a), s = (e) => {
					var n = W(), r = F(n);
					{
						let e = /* @__PURE__ */ A(() => ({
							props: V(i),
							...f.snippetProps
						}));
						K(r, () => t.child, () => V(e));
					}
					G(e, n);
				}, c = (e) => {
					var n = n_();
					J(n, () => ({ ...V(i) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
				};
				q(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), G(e, a);
			},
			$$slots: { popper: !0 }
		}));
	};
	q(h, (e) => {
		a() ? e(_) : a() || e(v, 1);
	}), G(e, m), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content-static.svelte
var i_ = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function a_(e, t) {
	O(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ pa(t, i_), i = /* @__PURE__ */ A(() => Z({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: ep }));
	r_(e, ha(() => V(i), () => r, {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
var o_ = /* @__PURE__ */ new Set([
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
]), s_ = /* @__PURE__ */ U("<button><!></button>");
function c_(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = Y(t, "type", 3, "button"), o = Y(t, "disabled", 3, !1), s = Y(t, "openOnHover", 3, !1), c = Y(t, "openDelay", 3, 700), l = Y(t, "closeDelay", 3, 300), u = /* @__PURE__ */ pa(t, o_), d = Yg.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		disabled: X(() => !!o()),
		openOnHover: X(() => s()),
		openDelay: X(() => c()),
		closeDelay: X(() => l())
	}), f = /* @__PURE__ */ A(() => Z(u, d.props, { type: a() }));
	fm(e, {
		get id() {
			return r();
		},
		get ref() {
			return d.opts.ref;
		},
		children: (e, n) => {
			var r = W(), i = F(r), a = (e) => {
				var n = W();
				K(F(n), () => t.child, () => ({ props: V(f) })), G(e, n);
			}, o = (e) => {
				var n = s_();
				J(n, () => ({ ...V(f) })), K(P(n), () => t.children ?? g), D(n), G(e, n);
			};
			q(i, (e) => {
				t.child ? e(a) : e(o, -1);
			}), G(e, r);
		},
		$$slots: { default: !0 }
	}), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var l_ = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function u_(e, t) {
	O(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ pa(t, l_);
	function i(e) {
		if (Of(e.key)) {
			let t = e.currentTarget.closest(Ag.selector("input"));
			if (!t) return;
			wf(e, t);
		}
	}
	let a = /* @__PURE__ */ A(() => Z({ onkeydown: t.onkeydown }, { onkeydown: i }));
	c_(e, ha(() => r, { "data-segment": "trigger" }, () => V(a), {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function d_(e, t) {
	O(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $);
	Ls.create({
		variant: X(() => "dialog"),
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		onOpenChangeComplete: X(() => i())
	});
	var a = W();
	K(F(a), () => t.children ?? g), G(e, a), k();
}
// node_modules/.pnpm/bits-ui@2.21.0_@internationalized+date@3.12.4_@sveltejs+kit@3.1.0_@opentelemetry+api@1._5198b5fecc1c9d03fdabe4eca4ad2591/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
var f_ = /* @__PURE__ */ new Set([
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
	"restoreScrollDelay",
	"preventBodyPointerEvents"
]), p_ = /* @__PURE__ */ U("<!> <!>", 1), m_ = /* @__PURE__ */ U("<!> <div><!></div>", 1);
function h_(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "id", 19, () => Ps(n)), i = Y(t, "ref", 15, null), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onOpenAutoFocus", 3, $), c = Y(t, "onEscapeKeydown", 3, $), l = Y(t, "onInteractOutside", 3, $), u = Y(t, "trapFocus", 3, !0), d = Y(t, "preventScroll", 3, !0), f = Y(t, "preventOverflowTextSelection", 3, !0), p = Y(t, "restoreScrollDelay", 3, null), m = Y(t, "preventBodyPointerEvents", 3, !0), h = /* @__PURE__ */ pa(t, f_), _ = Bs.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), v = () => m() || !_.root.overlayNode, y = /* @__PURE__ */ A(() => Z(h, _.props));
	var b = W(), x = F(b), S = (e) => {
		nl(e, {
			get ref() {
				return _.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return u();
			},
			get enabled() {
				return _.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return s();
			},
			get onCloseAutoFocus() {
				return o();
			},
			focusScope: (e, n) => {
				let r = () => (n?.()).props;
				bc(e, ha(() => V(y), {
					get enabled() {
						return _.root.opts.open.current;
					},
					get ref() {
						return _.opts.ref;
					},
					onEscapeKeydown: (e) => {
						c()(e), e.defaultPrevented || _.root.handleClose();
					},
					children: (e, n) => {
						_c(e, ha(() => V(y), {
							get ref() {
								return _.opts.ref;
							},
							get enabled() {
								return _.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								l()(e), e.defaultPrevented || _.root.handleClose();
							},
							children: (e, n) => {
								ll(e, ha(() => V(y), {
									get preventOverflowTextSelection() {
										return f();
									},
									get ref() {
										return _.opts.ref;
									},
									get enabled() {
										return _.root.opts.open.current;
									},
									children: (e, n) => {
										var i = W(), a = F(i), o = (e) => {
											var n = p_(), i = F(n), a = (e) => {
												Ol(e, {
													get preventScroll() {
														return d();
													},
													get restoreScrollDelay() {
														return p();
													},
													blockPointer: v
												});
											};
											q(i, (e) => {
												_.root.opts.open.current && e(a);
											});
											var o = I(i, 2);
											{
												let e = /* @__PURE__ */ A(() => ({
													props: Z(V(y), r()),
													..._.snippetProps
												}));
												K(o, () => t.child, () => V(e));
											}
											G(e, n);
										}, s = (e) => {
											var n = m_(), i = F(n);
											Ol(i, {
												get preventScroll() {
													return d();
												},
												blockPointer: v
											});
											var a = I(i, 2);
											J(a, (e) => ({ ...e }), [() => Z(V(y), r())]), K(P(a), () => t.children ?? g), D(a), G(e, n);
										};
										q(a, (e) => {
											t.child ? e(o) : e(s, -1);
										}), G(e, i);
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
	q(x, (e) => {
		(_.shouldRender || a()) && e(S);
	}), G(e, b), k();
}
// packages/ui-kit/src/form/date-field-utils.ts
var g_ = {
	placeholder: "选择日期",
	today: "今天",
	clear: "清除",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`
};
function __(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (t) try {
		return ed(t);
	} catch {
		return;
	}
}
function v_(e) {
	return __(e) !== void 0;
}
function y_(e) {
	return e ? e.toString() : "";
}
function b_(e) {
	return v_(e) ? va(e.trim()) : "";
}
function x_(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
function S_(e, t) {
	return v_(e) ? e.trim() : t;
}
function C_(e, t, n, r) {
	return v_(e) ? e.trim() : !v_(t) || n && t < n || r && t > r ? "" : t;
}
function w_(e, t, n = g_) {
	let r = b_(t);
	return r ? n.triggerLabeled(e, r) : n.triggerEmpty(e);
}
// packages/ui-kit/src/platform/native-bridge.ts
var T_ = "__CHRONOS_NATIVE__";
function E_() {
	if (typeof window > "u") return null;
	let e = window[T_];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
// packages/ui-kit/src/haptic/haptic.ts
var D_ = _a.hapticFeedbackEnabled;
function O_() {
	return E_();
}
function k_() {
	return typeof navigator < "u" && typeof navigator.vibrate == "function";
}
function A_() {
	return k_() ? typeof navigator < "u" && "userActivation" in navigator && navigator.userActivation != null ? navigator.userActivation.hasBeenActive : !0 : !1;
}
function j_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !0;
		let e = localStorage.getItem(Aa(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(D_));
		return e !== "0" && e !== "false";
	} catch {
		return !0;
	}
}
function M_(e) {
	if (!A_()) return !1;
	try {
		return navigator.vibrate(e);
	} catch {
		return !1;
	}
}
function N_(e, t) {
	if (!j_()) return !1;
	let n = O_();
	return n ? (n.callNative("haptic", e.method, e.params ?? {}).catch(() => {
		M_(t);
	}), !0) : M_(t);
}
var P_ = {
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
}, F_ = {
	selection() {
		return N_({ method: "selection" }, P_.selection);
	},
	light() {
		return N_({
			method: "vibrate",
			params: { duration: P_.light }
		}, P_.light);
	},
	medium() {
		return N_({
			method: "impact",
			params: { style: "medium" }
		}, P_.medium);
	},
	heavy() {
		return N_({
			method: "impact",
			params: { style: "heavy" }
		}, P_.heavy);
	},
	success() {
		return N_({
			method: "notification",
			params: { type: "success" }
		}, P_.success);
	},
	warning() {
		return N_({
			method: "notification",
			params: { type: "warning" }
		}, P_.warning);
	},
	cancel() {
		if (A_()) try {
			return navigator.vibrate(0);
		} catch {
			return !1;
		}
		return !1;
	}
}, I_ = /* @__PURE__ */ U("<span class=\"ml-0.5 text-error\">*</span>"), L_ = /* @__PURE__ */ U("<p class=\"text-body-small text-supporting mt-1 text-on-surface-variant\"> </p>"), R_ = /* @__PURE__ */ U("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> <!></h3> <!></div>"), z_ = /* @__PURE__ */ U("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> <!></button>"), B_ = /* @__PURE__ */ U("<button><span> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z\"></path></svg></span></button>"), V_ = /* @__PURE__ */ U("<div><!></div>"), H_ = /* @__PURE__ */ U("<div aria-hidden=\"true\" class=\"date-picker-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50\"></div>"), U_ = /* @__PURE__ */ Br("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path></svg>"), W_ = /* @__PURE__ */ Br("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path></svg>"), G_ = /* @__PURE__ */ U("<!> <!> <!>", 1), K_ = /* @__PURE__ */ U("<div> </div>"), q_ = /* @__PURE__ */ U("<div></div>"), J_ = /* @__PURE__ */ U("<div><!> <!></div>"), Y_ = /* @__PURE__ */ U("<!> <!> <div class=\"mt-3 flex items-center justify-between gap-2 border-t border-outline-variant/40 pt-3\"><div><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-brand hover:bg-brand/10 active:bg-brand/20 disabled:opacity-40\"> </button></div> <div class=\"flex items-center gap-1\"><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-on-surface-variant hover:bg-on-surface/5 disabled:opacity-40\"> </button> <button type=\"button\" class=\"text-label-large h-9 rounded-full bg-brand px-4 text-on-primary active:opacity-90 disabled:opacity-40\"> </button></div></div>", 1), X_ = /* @__PURE__ */ U("<!> <!>", 1), Z_ = /* @__PURE__ */ U("<div><!> <!> <!></div>");
function Q_(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "value", 15, ""), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "calendarLabel", 19, () => t.label), s = Y(t, "labels", 3, g_), c = Y(t, "required", 3, !1), l = Y(t, "variant", 3, "field"), u = Y(t, "locale", 3, "zh-CN"), d = /* @__PURE__ */ A(() => t.id ?? n), f = /* @__PURE__ */ A(() => `${V(d)}-label`), p = /* @__PURE__ */ A(() => l() === "section"), m = /* @__PURE__ */ M(!1), h = Ra({
		overlayId: `date-field-${n}`,
		get port() {
			return t.historyPort;
		},
		parent: Qe(La),
		setOpen: (e) => {
			N(m, e, !0);
		}
	});
	$e(La, h), L(() => h.syncOpenState(V(m))), li(() => h.dispose());
	let g = /* @__PURE__ */ M(""), _ = /* @__PURE__ */ M(void 0), v = /* @__PURE__ */ A(() => typeof r() == "string" ? r() : ""), y = /* @__PURE__ */ A(() => b_(V(v))), b = /* @__PURE__ */ A(() => w_(t.label, V(m) ? V(g) : V(v), s())), x = /* @__PURE__ */ A(() => __(V(g))), S = /* @__PURE__ */ A(() => t.min ? __(t.min) : void 0), C = /* @__PURE__ */ A(() => t.max ? __(t.max) : void 0), w = Xl(nu()).toString(), ee = /* @__PURE__ */ A(() => !!(t.min && w < t.min || t.max && w > t.max));
	function te(e) {
		if (e) {
			let e = Xl(nu()).toString();
			N(g, C_(V(v), e, t.min, t.max), !0), N(_, __(S_(V(g), e)), !0);
		}
	}
	function ne() {
		a() || (te(!0), N(m, !0));
	}
	function re(e) {
		let t = y_(e);
		t !== V(g) && (F_.light(), N(g, t, !0));
	}
	function ie() {
		(!c() || V(g)) && (F_.light(), V(g) !== V(v) && (r(V(g)), t.onValueChange?.(V(g))), N(m, !1));
	}
	function ae() {
		let e = Xl(nu()), n = e.toString();
		t.min && n < t.min || t.max && n > t.max || (F_.light(), N(g, y_(e), !0), N(_, e, !0));
	}
	function oe() {
		c() || (F_.light(), N(g, ""));
	}
	function se() {
		F_.light();
	}
	var ce = J_(), le = P(ce), ue = (e) => {
		var n = R_(), r = P(n), i = P(r), a = I(i), o = (e) => {
			G(e, I_());
		};
		q(a, (e) => {
			c() && e(o);
		}), D(r);
		var s = I(r, 2), l = (e) => {
			var n = L_(), r = gn(n, !0);
			R(() => ti(r, t.description)), G(e, n);
		};
		q(s, (e) => {
			t.description && e(l);
		}), D(n), R(() => {
			$i(r, "id", V(f)), ti(i, `${t.label ?? ""} `);
		}), G(e, n);
	};
	q(le, (e) => {
		V(p) && e(ue);
	}), Si(I(le, 2), () => Zg, (e, n) => {
		n(e, {
			onOpenChange: te,
			get value() {
				return V(x);
			},
			onValueChange: re,
			closeOnDateSelect: !1,
			get locale() {
				return u();
			},
			weekdayFormat: "narrow",
			weekStartsOn: 1,
			fixedWeeks: !0,
			get minValue() {
				return V(S);
			},
			get maxValue() {
				return V(C);
			},
			get disabled() {
				return a();
			},
			get calendarLabel() {
				return o();
			},
			get open() {
				return V(m);
			},
			set open(e) {
				N(m, e, !0);
			},
			get placeholder() {
				return V(_);
			},
			set placeholder(e) {
				N(_, e, !0);
			},
			children: (e, n) => {
				var r = Z_(), o = P(r), l = (e) => {
					var n = z_(), r = P(n), i = I(r), o = (e) => {
						G(e, I_());
					};
					q(i, (e) => {
						c() && e(o);
					}), D(n), R(() => {
						$i(n, "id", V(f)), n.disabled = a(), ti(r, `${t.label ?? ""} `);
					}), Ar("click", n, ne), G(e, n);
				};
				q(o, (e) => {
					V(p) || e(l);
				});
				var u = I(o, 2);
				{
					let e = (e, t) => {
						let n = () => (t?.()).props;
						var r = V_();
						J(r, () => ({
							...n(),
							id: V(d)
						}));
						var i = P(r);
						{
							let e = (e, t) => {
								let n = () => (t?.()).props;
								var r = B_();
								J(r, () => ({
									...n(),
									type: "button",
									class: "ui-form-field-input ui-date-field-input",
									"aria-label": V(b),
									disabled: a()
								}));
								var i = P(r), o = gn(i, !0);
								De(2), D(r), R(() => {
									Ni(i, 1, Di(["ui-date-field-value text-body-large truncate text-left", V(y) ? "text-on-surface" : "text-on-surface-variant/60"])), ti(o, V(y) || s().placeholder);
								}), G(e, r);
							};
							Si(i, () => u_, (t, n) => {
								n(t, {
									child: e,
									$$slots: { child: !0 }
								});
							});
						}
						D(r), G(e, r);
					};
					Si(u, () => zg, (t, n) => {
						n(t, {
							get "aria-labelledby"() {
								return V(f);
							},
							child: e,
							$$slots: { child: !0 }
						});
					});
				}
				Si(I(u, 2), () => $s, (e, t) => {
					t(e, {
						children: (e, t) => {
							var n = X_(), r = F(n), i = (e) => {
								G(e, H_());
							};
							q(r, (e) => {
								V(m) && e(i);
							}), Si(I(r, 2), () => a_, (e, t) => {
								t(e, {
									class: "ui-overlay-surface ui-date-picker-content fixed top-1/2 left-1/2 z-[var(--z-overlay)] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4 text-on-surface shadow-overlay outline-none",
									children: (e, t) => {
										var n = W(), r = F(n);
										{
											let e = (e, t) => {
												let n = () => (t?.()).months, r = () => (t?.()).weekdays;
												var i = Y_(), a = F(i);
												Si(a, () => Wp, (e, t) => {
													t(e, {
														class: "mb-3 flex items-center justify-between gap-2",
														children: (e, t) => {
															var n = G_(), r = F(n);
															Si(r, () => $p, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: se,
																	children: (e, t) => {
																		G(e, U_());
																	},
																	$$slots: { default: !0 }
																});
															});
															var i = I(r, 2);
															Si(i, () => qp, (e, t) => {
																t(e, { class: "text-title-small text-on-surface" });
															}), Si(I(i, 2), () => Xp, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: se,
																	children: (e, t) => {
																		G(e, W_());
																	},
																	$$slots: { default: !0 }
																});
															}), G(e, n);
														},
														$$slots: { default: !0 }
													});
												});
												var o = I(a, 2);
												gi(o, 17, n, (e) => e.value, (e, t) => {
													var n = W(), i = F(n);
													{
														let e = (e, n) => {
															let i = () => (n?.()).props;
															var a = J_();
															J(a, () => ({
																...i(),
																class: "w-full"
															}));
															var o = P(a);
															{
																let e = (e, t) => {
																	let n = () => (t?.()).props;
																	var i = V_();
																	J(i, () => ({ ...n() }));
																	var a = P(i);
																	{
																		let e = (e, t) => {
																			let n = () => (t?.()).props;
																			var i = q_();
																			J(i, () => ({
																				...n(),
																				role: "row",
																				class: "mb-1 grid grid-cols-7"
																			})), gi(i, 23, r, (e, t) => `${t}-${e}`, (e, t) => {
																				var n = W(), r = F(n);
																				{
																					let e = (e, n) => {
																						let r = () => (n?.()).props;
																						var i = K_();
																						J(i, () => ({
																							...r(),
																							role: "columnheader",
																							class: "text-label-small flex h-10 w-full items-center justify-center text-on-surface-variant"
																						}));
																						var a = gn(i, !0);
																						R(() => ti(a, V(t))), G(e, i);
																					};
																					Si(r, () => Rp, (t, n) => {
																						n(t, {
																							child: e,
																							$$slots: { child: !0 }
																						});
																					});
																				}
																				G(e, n);
																			}), D(i), G(e, i);
																		};
																		Si(a, () => Vp, (t, n) => {
																			n(t, {
																				child: e,
																				$$slots: { child: !0 }
																			});
																		});
																	}
																	D(i), G(e, i);
																};
																Si(o, () => Fp, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															var s = I(o, 2);
															{
																let e = (e, n) => {
																	let r = () => (n?.()).props;
																	var i = q_();
																	J(i, () => ({ ...r() })), gi(i, 20, () => V(t).weeks, (e) => e, (e, n) => {
																		var r = W(), i = F(r);
																		{
																			let e = (e, r) => {
																				let i = () => (r?.()).props;
																				var a = q_();
																				J(a, () => ({
																					...i(),
																					role: "row",
																					class: "grid grid-cols-7"
																				})), gi(a, 20, () => n, (e) => e, (e, n) => {
																					var r = W(), i = F(r);
																					{
																						let e = (e, t) => {
																							let r = () => (t?.()).props;
																							var i = V_();
																							J(i, () => ({
																								...r(),
																								class: "flex h-10 w-full items-center justify-center p-0"
																							})), Si(P(i), () => Cp, (e, t) => {
																								t(e, {
																									class: "ui-date-picker-day text-body-medium inline-flex size-10 items-center justify-center rounded-full border border-transparent text-on-surface transition-colors hover:bg-on-surface/5 data-disabled:pointer-events-none data-disabled:text-on-surface/30 data-outside-month:text-on-surface-variant/50 data-selected:bg-brand data-selected:font-semibold data-selected:text-on-primary data-unavailable:text-on-surface-variant data-unavailable:line-through",
																									children: (e, t) => {
																										De();
																										var r = Vr();
																										R(() => ti(r, n.day)), G(e, r);
																									},
																									$$slots: { default: !0 }
																								});
																							}), D(i), G(e, i);
																						};
																						Si(i, () => Mp, (r, i) => {
																							i(r, {
																								get date() {
																									return n;
																								},
																								get month() {
																									return V(t).value;
																								},
																								child: e,
																								$$slots: { child: !0 }
																							});
																						});
																					}
																					G(e, r);
																				}), D(a), G(e, a);
																			};
																			Si(i, () => Vp, (t, n) => {
																				n(t, {
																					child: e,
																					$$slots: { child: !0 }
																				});
																			});
																		}
																		G(e, r);
																	}), D(i), G(e, i);
																};
																Si(s, () => kp, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															D(a), G(e, a);
														};
														Si(i, () => Ep, (t, n) => {
															n(t, {
																class: "w-full",
																child: e,
																$$slots: { child: !0 }
															});
														});
													}
													G(e, n);
												});
												var l = I(o, 2), u = P(l), d = P(u), f = gn(d, !0);
												D(u);
												var p = I(u, 2), m = P(p), h = gn(m, !0), _ = I(m, 2), v = gn(_, !0);
												D(p), D(l), R(() => {
													d.disabled = V(ee), ti(f, s().today), m.disabled = c() || !V(g), ti(h, s().clear), _.disabled = c() && !V(g), ti(v, s().confirm);
												}), Ar("click", d, ae), Ar("click", m, oe), Ar("click", _, ie), G(e, i);
											};
											Si(r, () => e_, (t, n) => {
												n(t, {
													class: "flex w-full flex-col",
													children: e,
													$$slots: { default: !0 }
												});
											});
										}
										G(e, n);
									},
									$$slots: { default: !0 }
								});
							}), G(e, n);
						},
						$$slots: { default: !0 }
					});
				}), D(r), R(() => Ni(r, 1, Di(V(p) ? "ui-form-field" : ["ui-form-field", i()]))), G(e, r);
			},
			$$slots: { default: !0 }
		});
	}), D(ce), R(() => Ni(ce, 1, Di(V(p) ? ["flex flex-col gap-3", i()] : void 0))), G(e, ce), k();
}
// packages/ui-kit/src/components/SegmentedControl.svelte
jr(["click"]), jr(["click", "keydown"]);
// packages/ui-kit/src/form/time-wheel-utils.ts
var $_ = {
	placeholder: "选择时间",
	hour: "时",
	minute: "分",
	cancel: "取消",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`,
	columnAria: (e, t) => `${e}${t}`
};
function ev(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}`;
}
function tv(e) {
	return !!(e && Number.isInteger(e.hour) && e.hour >= 0 && e.hour <= 23 && Number.isInteger(e.minute) && e.minute >= 0 && e.minute <= 59);
}
function nv(e, t, n = $_) {
	return tv(t) ? n.triggerLabeled(e, ev(t)) : n.triggerEmpty(e);
}
function rv() {
	return Array.from({ length: 24 }, (e, t) => t);
}
function iv() {
	return Array.from({ length: 60 }, (e, t) => t);
}
function av(e, t, n = 40) {
	return Math.min(Math.max(Math.round(e / n), 0), t);
}
// packages/ui-kit/src/motion/motion.ts
var ov = _a.reduceMotionEnabled;
function sv() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !1;
		let e = localStorage.getItem(Aa(typeof document < "u" ? document.documentElement?.dataset?.chronosBase ?? "" : "").key(ov));
		return e === "1" || e === "true";
	} catch {
		return !1;
	}
}
function cv() {
	if (typeof window > "u") return !1;
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
}
function lv() {
	return sv() || cv();
}
// packages/ui-kit/src/motion/gesture-motion.ts
function uv() {
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
function dv(e) {
	return e * .998 / (1 - .998);
}
// packages/ui-kit/src/overlay/bottom-sheet-drag.ts
var fv = .25;
function pv(e) {
	return Math.max(0, e);
}
function mv(e, t, n = fv, r = 0) {
	if (r <= -.1) return !1;
	let i = e + (r > 0 ? dv(r) : 0);
	return t <= 0 ? i >= 80 : i >= t * n;
}
function hv(e, t) {
	return t <= 0 ? 1 : Math.max(0, 1 - e / t);
}
// packages/ui-kit/src/overlay/bottom-sheet-motion.svelte.ts
function gv(e) {
	let t = /* @__PURE__ */ M(!1), n = /* @__PURE__ */ M(0), r = /* @__PURE__ */ M("hidden"), i = 0, a = 1, o = !1, s = 0, c = () => {}, l = uv();
	function u() {
		s++, c(), c = () => {};
	}
	function d(t, r) {
		u();
		let i = s, a = V(n);
		N(n, t, !0), e.reduced() ? r() : c = e.animate(a, t, () => {
			i === s && (c = () => {}, r());
		});
	}
	function f() {
		N(r, o ? "returning" : "entering", !0), d(0, () => {
			N(r, "open"), o || (o = !0, e.onComplete(!0));
		});
	}
	function p() {
		V(t) && V(r) !== "closing" && (N(r, "closing"), d(Math.max(e.height(), 1), () => {
			N(t, !1), N(r, "hidden"), o = !1, e.onClosed(), e.onComplete(!1);
		}));
	}
	return {
		get state() {
			return {
				present: V(t),
				offset: V(n),
				phase: V(r)
			};
		},
		setOpen(e) {
			e ? V(t) ? V(r) === "closing" && f() : (N(t, !0), N(r, "entering"), o = !1) : p();
		},
		mount() {
			V(r) === "entering" && (N(n, e.height(), !0), f());
		},
		start(t) {
			V(r) === "open" && (a = Math.max(e.height(), 1), i = t, l.reset(t), N(r, "dragging"));
		},
		move(e) {
			V(r) === "dragging" && (l.add(e), N(n, pv(e - i), !0));
		},
		release(e, t = !1) {
			if (V(r) !== "dragging") return;
			l.add(e);
			let i = t ? 0 : l.velocity();
			!t && V(n) > 0 && mv(V(n), a, .25, i) ? p() : f();
		},
		destroy: u
	};
}
// packages/ui-kit/src/overlay/BottomSheet.svelte
var _v = /* @__PURE__ */ U("<div class=\"relative flex shrink-0 touch-none justify-center py-3 before:absolute before:inset-x-0 before:-top-4 before:-bottom-4 before:content-['']\"><div class=\"h-1 w-10 rounded-full bg-on-surface-variant/40\"></div></div>"), vv = /* @__PURE__ */ U("<div class=\"shrink-0\"><!></div>"), yv = /* @__PURE__ */ U("<div><!> <!></div>"), bv = /* @__PURE__ */ U("<div><!></div>"), xv = /* @__PURE__ */ U("<div><!> <!> <!> <!></div>"), Sv = /* @__PURE__ */ U("<!> <!>", 1);
function Cv(e, t) {
	O(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "title", 3, ""), i = Y(t, "description", 3, ""), a = Y(t, "showHandle", 3, !0), o = Y(t, "dragDismissAria", 3, "Drag down to close"), s = Y(t, "manageHistory", 3, !0), c = Y(t, "overlayId", 3, "bottom-sheet"), l = /* @__PURE__ */ M(null), u = /* @__PURE__ */ M(null), d = /* @__PURE__ */ M(null), f = /* @__PURE__ */ M(null), p = /* @__PURE__ */ M(0), m = null, h = null;
	function g(e, t, n) {
		let r = V(u), i = V(d);
		if (!r) return n(), () => {};
		let a = `translate3d(0, ${t}px, 0)`, o = `${hv(t, V(p))}`, s = {
			duration: 240,
			easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
			fill: "both"
		}, c = r.animate([{ transform: m ?? `translate3d(0, ${e}px, 0)` }, { transform: a }], s), l = i?.animate([{ opacity: h ?? `${hv(e, V(p))}` }, { opacity: o }], s);
		return m = null, h = null, c.onfinish = () => {
			r.style.transform = a, i && (i.style.opacity = o), c.cancel(), l?.cancel(), n();
		}, () => {
			m = getComputedStyle(r).transform, h = i ? getComputedStyle(i).opacity : null, r.style.transform = m, i && h && (i.style.opacity = h), c.onfinish = null, c.cancel(), l?.cancel();
		};
	}
	let _ = ga(), v = gv({
		height: () => (N(p, V(u)?.getBoundingClientRect().height ?? 0, !0), V(p)),
		reduced: lv,
		animate: g,
		onClosed: () => {
			_.end(), n(!1), t.onOpenChange?.(!1);
		},
		onComplete: (e) => t.onOpenChangeComplete?.(e)
	}), y = /* @__PURE__ */ A(() => v.state.present), b = /* @__PURE__ */ A(() => v.state.phase === "dragging"), x = /* @__PURE__ */ A(() => `transform: translate3d(0, ${v.state.offset}px, 0)`), S = /* @__PURE__ */ A(() => `opacity: ${hv(v.state.offset, V(p))}`);
	function C(e) {
		v.state.phase === "open" && a() && _.start(e, V(f)) && v.start(e.clientY);
	}
	function w(e) {
		_.owns(e) && v.move(e.clientY);
	}
	function ee(e) {
		_.owns(e) && (_.end(), v.release(e.clientY));
	}
	function te(e) {
		_.owns(e) && (_.end(), v.release(e.clientY, !0));
	}
	function ne(e) {
		e.preventDefault(), requestAnimationFrame(() => {
			let e = V(u);
			V(y) && e && !e.contains(e.ownerDocument.activeElement) && (V(l) ?? e).focus();
		});
	}
	let re = Ra({
		get overlayId() {
			return c();
		},
		get port() {
			return s() ? t.historyPort : void 0;
		},
		parent: Qe(La),
		setOpen: (e) => {
			n(e);
		}
	});
	$e(La, re), L(() => re.syncOpenState(V(y))), li(() => {
		_.end(), v.destroy(), re.dispose();
	});
	function ie(e) {
		e ? (n(!0), t.onOpenChange?.(!0)) : v.setOpen(!1);
	}
	L(() => {
		let e = n();
		H(() => v.setOpen(e));
	}), L(() => {
		V(u) && H(() => v.mount());
	});
	var ae = W();
	kr("pointermove", cn, function(...e) {
		(a() ? w : void 0)?.apply(this, e);
	}), kr("pointerup", cn, function(...e) {
		(a() ? ee : void 0)?.apply(this, e);
	}), kr("pointercancel", cn, function(...e) {
		(a() ? te : void 0)?.apply(this, e);
	});
	var oe = F(ae), se = () => V(y), ce = ie;
	Si(oe, () => d_, (e, n) => {
		n(e, {
			get open() {
				return se();
			},
			set open(e) {
				ce(e);
			},
			children: (e, n) => {
				var s = W();
				Si(F(s), () => $s, (e, n) => {
					n(e, {
						children: (e, n) => {
							var s = Sv(), c = F(s);
							Si(c, () => jl, (e, t) => {
								t(e, {
									class: "bottom-sheet-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50",
									"aria-hidden": "true",
									get style() {
										return V(S);
									},
									onclick: () => ie(!1),
									get ref() {
										return V(d);
									},
									set ref(e) {
										N(d, e, !0);
									}
								});
							});
							var p = I(c, 2);
							{
								let e = (e, n) => {
									let s = () => (n?.()).props;
									var c = xv();
									J(c, () => ({ ...s() }));
									var u = P(c), d = (e) => {
										var t = _v();
										aa(t, (e) => N(f, e), () => V(f)), R(() => $i(t, "aria-label", o())), Ar("pointerdown", t, C), kr("lostpointercapture", t, te), G(e, t);
									};
									q(u, (e) => {
										a() && e(d);
									});
									var p = I(u, 2), m = (e) => {
										var n = yv(), i = P(n), o = (e) => {
											var t = W(), n = F(t);
											{
												let e = /* @__PURE__ */ A(() => ["ui-heading-text text-title-large min-w-0 flex-1 font-medium text-on-surface outline-none", a() ? "truncate" : "text-center"]);
												Si(n, () => Ws, (t, n) => {
													n(t, {
														tabindex: -1,
														get class() {
															return V(e);
														},
														get ref() {
															return V(l);
														},
														set ref(e) {
															N(l, e, !0);
														},
														children: (e, t) => {
															De();
															var n = Vr();
															R(() => ti(n, r())), G(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											G(e, t);
										};
										q(i, (e) => {
											r() && e(o);
										});
										var s = I(i, 2), c = (e) => {
											var n = vv();
											K(P(n), () => t.actions), D(n), G(e, n);
										};
										q(s, (e) => {
											t.actions && e(c);
										}), D(n), R(() => Ni(n, 1, Di(["flex shrink-0 items-center gap-3", a() ? "px-4 pb-3" : "px-6 pt-6 pb-2"]))), G(e, n);
									};
									q(p, (e) => {
										(r() || t.actions) && e(m);
									});
									var h = I(p, 2), g = (e) => {
										var n = yv(), r = P(n), o = (e) => {
											var t = W(), n = F(t);
											{
												let e = /* @__PURE__ */ A(() => ["text-body-medium text-supporting leading-relaxed text-on-surface-variant", !a() && "text-center"]);
												Si(n, () => Pl, (t, n) => {
													n(t, {
														get class() {
															return V(e);
														},
														children: (e, t) => {
															De();
															var n = Vr();
															R(() => ti(n, i())), G(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											G(e, t);
										};
										q(r, (e) => {
											i() && e(o);
										});
										var s = I(r, 2), c = (e) => {
											var n = W();
											K(F(n), () => t.children), G(e, n);
										};
										q(s, (e) => {
											t.children && e(c);
										}), D(n), R(() => Ni(n, 1, Di([a() ? ["app-scroll-y content-scroll min-h-0 flex-1 overflow-y-auto", !t.footer && "pb-[calc(1rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]"] : ["shrink-0 px-6", t.footer ? "pb-5" : "pb-[calc(1.25rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]"]]))), G(e, n);
									};
									q(h, (e) => {
										(i() || t.children) && e(g);
									});
									var _ = I(h, 2), v = (e) => {
										var n = bv();
										K(P(n), () => t.footer), D(n), R(() => Ni(n, 1, Di(["flex shrink-0 items-center gap-2", a() ? "mt-2 justify-end ps-4 pe-[calc(1rem+var(--tabbar-inline-safe,0px))] pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)]" : "w-full justify-stretch gap-3 border-t border-outline-variant/40 ps-6 pe-[calc(1.5rem+var(--tabbar-inline-safe,0px))] pt-4 pb-[calc(var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))+0.75rem)] [&>button]:flex-1"]))), G(e, n);
									};
									q(_, (e) => {
										t.footer && e(v);
									}), D(c), G(e, c);
								}, n = /* @__PURE__ */ A(() => V(b) ? "" : void 0), s = /* @__PURE__ */ A(() => v.state.phase === "returning" ? "" : void 0), c = /* @__PURE__ */ A(() => v.state.phase === "closing" ? "" : void 0);
								Si(p, () => h_, (t, r) => {
									r(t, {
										class: "ui-overlay-surface bottom-sheet-content rounded-t-sheet fixed inset-x-0 z-[var(--z-overlay)] flex min-h-0 flex-col overflow-hidden text-on-surface shadow-overlay outline-none",
										get style() {
											return V(x);
										},
										get "data-dragging"() {
											return V(n);
										},
										get "data-snapping-back"() {
											return V(s);
										},
										get "data-closing"() {
											return V(c);
										},
										restoreScrollDelay: 0,
										onOpenAutoFocus: ne,
										onInteractOutside: (e) => {
											e.preventDefault(), ie(!1);
										},
										onEscapeKeydown: (e) => {
											e.preventDefault(), ie(!1);
										},
										get ref() {
											return V(u);
										},
										set ref(e) {
											N(u, e, !0);
										},
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							G(e, s);
						},
						$$slots: { default: !0 }
					});
				}), G(e, s);
			},
			$$slots: { default: !0 }
		});
	}), G(e, ae), k();
}
jr(["pointerdown"]);
// packages/ui-kit/src/form/PickerWheel.svelte
var wv = /* @__PURE__ */ U("<div role=\"option\" tabindex=\"-1\"> </div>"), Tv = /* @__PURE__ */ U("<div class=\"picker-wheel-column relative w-full rounded-xl svelte-1i06u69\"><div role=\"listbox\"></div> <div aria-hidden=\"true\" class=\"pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-lg border-y border-outline-variant/40 bg-brand/5\"></div></div>");
function Ev(e, t) {
	O(t, !0);
	let n = Y(t, "value", 15, ""), r = Y(t, "disabled", 3, !1), i = null, a = 0, o = 0, s = 0, c = 0, l = /* @__PURE__ */ A(() => t.options.map((e) => e.value).join("\0")), u = /* @__PURE__ */ A(() => r() ? void 0 : t.options.find((e) => e.value === n()));
	function d() {
		return Math.max(0, t.options.findIndex((e) => e.value === n()));
	}
	function f(e) {
		i?.scrollTo({
			top: e * 40,
			behavior: "instant"
		});
	}
	function p() {
		a = Date.now() + 150, c = d(), f(c);
	}
	L(() => {
		V(l), H(p);
	});
	function m() {
		let e = Date.now();
		e < a || e - o < 40 || (o = e, F_.medium());
	}
	function h(e) {
		let r = t.options[e]?.value;
		r !== void 0 && r !== n() && (n(r), t.onValueChange?.(r));
	}
	function g() {
		s = 0, r() || h(c);
	}
	function _(e) {
		if (r()) return;
		let n = av(e.scrollTop, Math.max(0, t.options.length - 1), 40);
		c !== n && (c = n, m()), window.clearTimeout(s), s = window.setTimeout(g, 90);
	}
	function v() {
		return r() ? n() : (window.clearTimeout(s), i && (c = av(i.scrollTop, Math.max(0, t.options.length - 1), 40)), g(), t.options[c]?.value ?? "");
	}
	function y(e) {
		if (r()) return;
		let n = Math.min(Math.max(e, 0), Math.max(0, t.options.length - 1));
		c = n, h(n), f(n);
	}
	function b(e) {
		r() || (e.key === "ArrowDown" || e.key === "ArrowRight" ? (e.preventDefault(), y(c + 1)) : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (e.preventDefault(), y(c - 1)) : e.key === "Home" ? (e.preventDefault(), y(0)) : e.key === "End" && (e.preventDefault(), y(t.options.length - 1)));
	}
	function x(e) {
		return i = e, c = d(), e.scrollTo({ top: c * 40 }), () => {
			i === e && (i = null);
		};
	}
	li(() => clearTimeout(s));
	var S = {
		scrollToValue: p,
		commitDraft: v
	}, C = Tv(), w = P(C);
	return gi(w, 23, () => t.options, (e) => e.value, (e, r, i) => {
		var a = wv();
		let o;
		var s = gn(a, !0);
		R(() => {
			$i(a, "id", `${t.idPrefix ?? ""}-${V(r).value ?? ""}`), $i(a, "aria-selected", V(r).value === n()), Ni(a, 1, `picker-wheel-row text-body-large flex cursor-pointer items-center justify-center text-center tabular-nums transition-colors ${V(r).value === n() ? "font-semibold text-on-surface" : "text-on-surface-variant/60"}`, "svelte-1i06u69"), o = Fi(a, "", o, { height: "40px" }), ti(s, V(r).label);
		}), Ar("click", a, () => y(V(i))), G(e, a);
	}), D(w), wi(w, () => x), De(2), D(C), R(() => {
		$i(w, "aria-label", t.label), $i(w, "aria-activedescendant", V(u) ? `${t.idPrefix}-${V(u).value}` : void 0), $i(w, "aria-disabled", r()), $i(w, "tabindex", r() ? -1 : 0), Ni(w, 1, Di(["picker-wheel overflow-y-auto rounded-xl outline-none", r() && "pointer-events-none opacity-60"]), "svelte-1i06u69");
	}), kr("scroll", w, (e) => _(e.currentTarget)), kr("scrollend", w, () => {
		window.clearTimeout(s), g();
	}), Ar("keydown", w, b), G(e, C), k(S);
}
jr(["keydown", "click"]);
// packages/ui-kit/src/form/TimeWheel.svelte
var Dv = /* @__PURE__ */ U("<div class=\"flex justify-center gap-3\"><div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div> <div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div></div>");
function Ov(e, t) {
	O(t, !0);
	let n = Y(t, "value", 31, () => an({
		hour: 0,
		minute: 0
	})), r = Y(t, "disabled", 3, !1), i = /* @__PURE__ */ M(an(String(n().hour))), a = /* @__PURE__ */ M(an(String(n().minute))), o = /* @__PURE__ */ M(null), s = /* @__PURE__ */ M(null), c = /* @__PURE__ */ A(() => rv().filter((e) => !t.minimum || e >= t.minimum.hour).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	}))), l = /* @__PURE__ */ A(() => iv().filter((e) => !t.minimum || Number(V(i)) > t.minimum.hour || e >= t.minimum.minute).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	})));
	function u(e) {
		return !t.minimum || e.hour * 60 + e.minute >= t.minimum.hour * 60 + t.minimum.minute ? e : { ...t.minimum };
	}
	function d(e) {
		let r = u(e), o = r.hour !== n().hour || r.minute !== n().minute;
		N(i, String(r.hour), !0), N(a, String(r.minute), !0), o && (n(r), t.onValueChange?.(r));
	}
	function f() {
		let e = u(n());
		N(i, String(e.hour), !0), N(a, String(e.minute), !0);
	}
	function p() {
		f(), yr().then(() => {
			V(o)?.scrollToValue(), V(s)?.scrollToValue();
		});
	}
	function m(e) {
		d({
			hour: Number(e),
			minute: Number(V(a))
		}), yr().then(() => V(s)?.scrollToValue());
	}
	function h(e) {
		d({
			hour: Number(V(i)),
			minute: Number(e)
		});
	}
	function g() {
		return d({
			hour: Number(V(o)?.commitDraft() ?? V(i)),
			minute: Number(V(s)?.commitDraft() ?? V(a))
		}), n();
	}
	var _ = {
		scrollToValue: p,
		commitDraft: g
	}, v = Dv(), y = P(v), b = P(y);
	{
		let e = /* @__PURE__ */ A(() => t.labels.columnAria(t.label, t.labels.hour)), n = /* @__PURE__ */ A(() => `${t.idPrefix}-hour`);
		aa(Ev(b, {
			get options() {
				return V(c);
			},
			get label() {
				return V(e);
			},
			get idPrefix() {
				return V(n);
			},
			get disabled() {
				return r();
			},
			onValueChange: m,
			get value() {
				return V(i);
			},
			set value(e) {
				N(i, e, !0);
			}
		}), (e) => N(o, e, !0), () => V(o));
	}
	D(y);
	var x = I(y, 2), S = P(x);
	{
		let e = /* @__PURE__ */ A(() => t.labels.columnAria(t.label, t.labels.minute)), n = /* @__PURE__ */ A(() => `${t.idPrefix}-minute`);
		aa(Ev(S, {
			get options() {
				return V(l);
			},
			get label() {
				return V(e);
			},
			get idPrefix() {
				return V(n);
			},
			get disabled() {
				return r();
			},
			onValueChange: h,
			get value() {
				return V(a);
			},
			set value(e) {
				N(a, e, !0);
			}
		}), (e) => N(s, e, !0), () => V(s));
	}
	return D(x), D(v), G(e, v), k(_);
}
// packages/ui-kit/src/form/TimePicker.svelte
var kv = /* @__PURE__ */ U("<p class=\"text-body-small text-supporting mt-1 text-on-surface-variant\"> </p>"), Av = /* @__PURE__ */ U("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> </h3> <!></div>"), jv = /* @__PURE__ */ U("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> </button>"), Mv = /* @__PURE__ */ U("<button type=\"button\" class=\"text-label-large h-11 rounded-full px-5 text-on-surface-variant hover:bg-on-surface/5 active:bg-on-surface/10\"> </button> <button type=\"button\" class=\"text-label-large h-11 rounded-full bg-brand px-6 text-on-primary active:opacity-90\"> </button>", 1), Nv = /* @__PURE__ */ U("<div class=\"px-4 pt-1 pb-2\"><!></div>"), Pv = /* @__PURE__ */ U("<div><!> <div><!> <button type=\"button\" class=\"ui-form-field-input ui-date-field-input\" aria-haspopup=\"dialog\"><span class=\"ui-date-field-value text-body-large truncate text-left text-on-surface tabular-nums\"> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z\"></path></svg></span></button></div></div> <!>", 1);
function Fv(e, t) {
	let n = Hr();
	O(t, !0);
	let r = Y(t, "value", 31, () => an({
		hour: 0,
		minute: 0
	})), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "variant", 3, "field"), s = Y(t, "labels", 3, $_), c = Y(t, "sheetDragDismissAria", 3, "向下拖动关闭"), l = /* @__PURE__ */ A(() => t.id ?? n), u = /* @__PURE__ */ A(() => `${V(l)}-label`), d = /* @__PURE__ */ A(() => t.idPrefix ?? V(l)), f = /* @__PURE__ */ A(() => t.overlayId ?? `time-picker-${n}`), p = /* @__PURE__ */ A(() => t.manageHistory ?? t.historyPort != null), m = /* @__PURE__ */ A(() => o() === "section"), h = /* @__PURE__ */ M(!1), g = /* @__PURE__ */ M(an({
		hour: 0,
		minute: 0
	})), _ = /* @__PURE__ */ M(null), v = /* @__PURE__ */ A(() => ev(r())), y = /* @__PURE__ */ A(() => nv(t.label, V(h) ? V(g) : r(), s()));
	function b() {
		a() || (N(g, {
			hour: r().hour,
			minute: r().minute
		}, !0), N(h, !0), yr().then(() => V(_)?.scrollToValue()));
	}
	function x() {
		N(h, !1);
	}
	function S() {
		F_.light();
		let e = V(_)?.commitDraft() ?? V(g);
		(e.hour !== r().hour || e.minute !== r().minute) && (r(e), t.onValueChange?.(e)), x();
	}
	var C = Pv(), w = F(C), ee = P(w), te = (e) => {
		var n = Av(), r = P(n), i = gn(r, !0), a = I(r, 2), o = (e) => {
			var n = kv(), r = gn(n, !0);
			R(() => ti(r, t.description)), G(e, n);
		};
		q(a, (e) => {
			t.description && e(o);
		}), D(n), R(() => {
			$i(r, "id", V(u)), ti(i, t.label);
		}), G(e, n);
	};
	q(ee, (e) => {
		V(m) && e(te);
	});
	var ne = I(ee, 2), re = P(ne), ie = (e) => {
		var n = jv(), r = gn(n, !0);
		R(() => {
			$i(n, "id", V(u)), ti(r, t.label);
		}), Ar("click", n, b), G(e, n);
	};
	q(re, (e) => {
		V(m) || e(ie);
	});
	var ae = I(re, 2), oe = gn(P(ae), !0);
	De(2), D(ae), D(ne), D(w), Cv(I(w, 2), {
		get title() {
			return t.label;
		},
		get dragDismissAria() {
			return c();
		},
		get manageHistory() {
			return V(p);
		},
		get overlayId() {
			return V(f);
		},
		get historyPort() {
			return t.historyPort;
		},
		get open() {
			return V(h);
		},
		set open(e) {
			N(h, e, !0);
		},
		footer: (e) => {
			var t = Mv(), n = F(t), r = gn(n, !0), i = I(n, 2), a = gn(i, !0);
			R(() => {
				ti(r, s().cancel), ti(a, s().confirm);
			}), Ar("click", n, x), Ar("click", i, S), G(e, t);
		},
		children: (e, n) => {
			var r = Nv();
			aa(Ov(P(r), {
				get label() {
					return t.label;
				},
				get labels() {
					return s();
				},
				get idPrefix() {
					return V(d);
				},
				get value() {
					return V(g);
				},
				set value(e) {
					N(g, e, !0);
				}
			}), (e) => N(_, e, !0), () => V(_)), D(r), G(e, r);
		},
		$$slots: {
			footer: !0,
			default: !0
		}
	}), R(() => {
		Ni(w, 1, Di(V(m) ? ["flex flex-col gap-3", i()] : void 0)), Ni(ne, 1, Di(V(m) ? "ui-form-field" : ["ui-form-field", i()])), $i(ae, "id", V(l)), $i(ae, "aria-labelledby", V(u)), $i(ae, "aria-label", V(y)), $i(ae, "aria-expanded", V(h)), ae.disabled = a(), ti(oe, V(v));
	}), Ar("click", ae, b), G(e, C), k();
}
jr(["click"]);
// packages/ui-kit/src/plugin-screen/PluginScreenFailure.svelte
var Iv = /* @__PURE__ */ U("<div class=\"flex flex-col items-center gap-3 p-4 text-center\"><p class=\"text-body-medium text-error\" role=\"alert\"> </p> <button type=\"button\" class=\"ui-btn ui-btn-outlined\"> </button></div>");
function Lv(e, t) {
	O(t, !0);
	let n = (e, n) => t.controller?.translatePlugin("host-ui", e) ?? n;
	var r = Iv(), i = P(r), a = gn(i, !0), o = I(i, 2), s = gn(o, !0);
	D(r), R((e, t) => {
		ti(a, e), ti(s, t);
	}, [() => n("pluginScreen.failed", "Plugin screen failed to load"), () => n("pluginScreen.retry", "Reload")]), Ar("click", o, function(...e) {
		t.retry?.apply(this, e);
	}), G(e, r), k();
}
jr(["click"]);
// packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [Rv, zv] = Ze(), Bv = 900, Vv = 24, Hv = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function Uv(e) {
	return Hv.has(e) ? !0 : e.startsWith("max-w-");
}
function Wv(e) {
	let t = [], n = [];
	for (let r of e) Uv(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function Gv(e, t, n, r = Vv) {
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
function Kv(e, t) {
	t.visible ? (e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`) : e.style.display = "none";
}
function qv(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = Wv(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Kv(a, Gv(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, Bv);
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
function Jv(e) {
	return qv(e);
}
// packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
jr(["click"]);
// packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var Yv = /* @__PURE__ */ U("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function Xv(e, t) {
	O(t, !0), $e(La, H(() => la(t.propsStore)).overlayParent);
	let n = /* @__PURE__ */ A(() => t.component), r = /* @__PURE__ */ A(() => ja(t.propsStore).current);
	var i = Yv();
	$r(P(i), {
		onerror: (e) => {
			console.error("[MountableSvelteHost] render failed:", e), t.onFailure?.(e);
		},
		failed: (e, t = g, n = g) => {
			Lv(e, {
				get controller() {
					return V(r).controller;
				},
				get retry() {
					return n();
				}
			});
		}
	}, (e) => {
		var t = W();
		Si(F(t), () => V(n), (e, t) => {
			t(e, ha(() => V(r)));
		}), G(e, t);
	}), D(i), G(e, i), k();
}
// packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function Zv(e) {
	return {
		[Ta]: !0,
		mount(t, n, r) {
			let i = !1, a = ca({ ...n }), o = ni(Xv, {
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
function Qv(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return wa(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? wa(a, i) : o;
}
// packages/ui-kit/src/import-preview/ImportCourseList.svelte
jr(["click"]);
// packages/plugins/clock/src/clock.ts
var $v = /^\d{4}-\d{2}-\d{2}$/;
function ey(e) {
	return typeof e != "number" || !Number.isFinite(e) ? null : e;
}
function ty(e, t) {
	if (!$v.test(e) || !Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || !Number.isInteger(t.minute) || t.minute < 0 || t.minute > 59) return null;
	let n = Number(e.slice(0, 4)), r = Number(e.slice(5, 7)), i = Number(e.slice(8, 10)), a = new Date(n, r - 1, i, t.hour, t.minute, 0, 0);
	return a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i ? null : a;
}
function ny(e) {
	return {
		isoDate: ba(e),
		time: {
			hour: e.getHours(),
			minute: e.getMinutes()
		}
	};
}
// packages/plugins/clock/src/constants.ts
var ry = "tool-clock", iy = "frozen_now", ay = {
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
function oy(e = {}) {
	let { screenComponent: t } = e;
	return ka({
		id: ry,
		messages: ay,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 55,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		capabilities: ["clock"],
		async apply(e, n) {
			if (!e.clock) throw Error("Clock capability is required");
			let r = ey(await e.storage.get(iy));
			r != null && e.clock.set(new Date(r)), e.registerSlot("mine.item", {
				id: "clock",
				sectionId: ry,
				title: () => n("mine.title"),
				href: `/plugins/${ry}`,
				icon: "schedule",
				iconTone: "secondary",
				order: 40
			}), e.registerSlot("shell.route.screen", {
				id: ry,
				title: () => n("screen.title"),
				...t ? { component: t } : {}
			});
		}
	});
}
// packages/plugins/clock/src/analytics.ts
var sy = {
	apply: "apply",
	reset: "reset"
}, cy = /* @__PURE__ */ U("<p class=\"text-headline-small text-on-surface tabular-nums\"> <span class=\"text-on-surface-variant\">·</span> </p> <p class=\"text-body-medium mt-1 text-on-surface-variant\"> </p>", 1), ly = /* @__PURE__ */ U("<header class=\"relative z-10 shrink-0 border-b border-outline/10 bg-surface/90 px-4 pt-6 pb-4 backdrop-blur-sm\"><!></header>"), uy = /* @__PURE__ */ U("<section class=\"ui-section-surface ui-section-surface--comfortable\"><!></section>"), dy = /* @__PURE__ */ U("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><!> <div class=\"ui-page-surface secondary-scroll relative z-0 min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]\"><!> <section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack\"><!> <!></div></section></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-filled flex-1\"> </button></div></div></div>");
function fy(e, t) {
	O(t, !0);
	let n = (e) => {
		var t = cy(), n = F(t), r = P(n), i = I(r, 2);
		D(n);
		var a = gn(I(n, 2), !0);
		R(() => {
			ti(r, `${V(h) ?? ""} `), ti(i, ` ${V(g) ?? ""}`), ti(a, V(_));
		}), G(e, t);
	}, r = new Ia("(orientation: landscape) and (max-height: 500px)"), i = /* @__PURE__ */ A(() => ja(t.controller.snapshot)), a = /* @__PURE__ */ A(() => t.context), o = /* @__PURE__ */ A(() => x_(V(i).current.locale));
	function s(e, n) {
		return V(i).current.slotVersion, Qv(t.controller, ry, ay, e, n);
	}
	let c = ny(/* @__PURE__ */ new Date()), l = /* @__PURE__ */ M(an(c.isoDate)), u = /* @__PURE__ */ M(an(c.time));
	ci(() => {
		let e = ny(t.context.state.now);
		N(l, e.isoDate, !0), N(u, e.time, !0);
	});
	let d = /* @__PURE__ */ A(() => ({
		placeholder: s("screen.field.date.placeholder"),
		today: s("screen.field.date.today"),
		clear: s("screen.field.date.clear"),
		confirm: s("screen.field.date.confirm"),
		triggerEmpty: (e) => s("screen.field.date.triggerEmpty", { label: e }),
		triggerLabeled: (e, t) => s("screen.field.date.triggerLabeled", {
			label: e,
			display: t
		})
	})), f = /* @__PURE__ */ A(() => ({
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
	})), p = /* @__PURE__ */ A(() => V(i).current.clockFrozen), m = /* @__PURE__ */ A(() => V(i).current.now), h = /* @__PURE__ */ A(() => ya(ny(V(m)).isoDate)), g = /* @__PURE__ */ A(() => V(m).toLocaleTimeString(V(o), {
		hour: "2-digit",
		minute: "2-digit"
	})), _ = /* @__PURE__ */ A(() => V(p) ? s("screen.status.subtitle.frozen") : s("screen.status.subtitle.system")), v = /* @__PURE__ */ A(() => ty(V(l), V(u))), y = /* @__PURE__ */ A(() => V(v) != null && V(v).getTime() !== V(m).getTime()), b = /* @__PURE__ */ A(() => [{
		id: "reset",
		label: s("screen.action.reset"),
		icon: "refresh",
		variant: "outlined",
		disabled: !V(p),
		onClick: S
	}, {
		id: "apply",
		label: s("screen.action.apply"),
		icon: "check",
		disabled: !V(y),
		onClick: x
	}]);
	L(() => t.edgeActions?.register(V(b)));
	async function x() {
		let e = ty(V(l), V(u));
		e ? (await V(a).storage.set(iy, e.getTime()), V(a).clock?.set(e), Ea(V(a), sy.apply), V(a).actions.notify(s("screen.notify.applied"), "info")) : V(a).actions.notify(s("screen.notify.invalid"), "warn");
	}
	async function S() {
		await V(a).storage.delete(iy), V(a).clock?.set(null);
		let e = ny(V(a).state.now);
		N(l, e.isoDate, !0), N(u, e.time, !0), Ea(V(a), sy.reset), V(a).actions.notify(s("screen.notify.reset"), "info");
	}
	var C = dy(), w = P(C), ee = (e) => {
		var t = ly(), r = P(t);
		n(r), D(t), G(e, t);
	};
	q(w, (e) => {
		r.current || e(ee);
	});
	var te = I(w, 2), ne = P(te), re = P(ne), ie = (e) => {
		var t = uy(), r = P(t);
		n(r), D(t), G(e, t);
	};
	q(re, (e) => {
		r.current && e(ie);
	});
	var ae = I(re, 2), oe = P(ae), se = P(oe);
	{
		let e = /* @__PURE__ */ A(() => s("screen.field.date"));
		Q_(se, {
			get historyPort() {
				return t.controller.overlayHistoryPort;
			},
			get label() {
				return V(e);
			},
			required: !0,
			variant: "section",
			get labels() {
				return V(d);
			},
			get locale() {
				return V(o);
			},
			get value() {
				return V(l);
			},
			set value(e) {
				N(l, e, !0);
			}
		});
	}
	var ce = I(se, 2);
	{
		let e = /* @__PURE__ */ A(() => s("screen.field.time")), n = /* @__PURE__ */ A(() => s("screen.field.time.sheetDragDismiss"));
		Fv(ce, {
			get label() {
				return V(e);
			},
			variant: "section",
			get labels() {
				return V(f);
			},
			get sheetDragDismissAria() {
				return V(n);
			},
			idPrefix: "clock-time",
			get historyPort() {
				return t.controller.overlayHistoryPort;
			},
			get value() {
				return V(u);
			},
			set value(e) {
				N(u, e, !0);
			}
		});
	}
	D(oe), D(ae), D(ne), D(te), Ci(te, (e) => Jv?.(e));
	var le = I(te, 2), ue = P(le), de = P(ue), fe = gn(de, !0), pe = I(de, 2), me = gn(pe, !0);
	D(ue), D(le), D(C), R((e, t) => {
		de.disabled = !V(p), ti(fe, e), pe.disabled = !V(y), ti(me, t);
	}, [() => s("screen.action.reset"), () => s("screen.action.apply")]), Ar("click", de, () => void S()), Ar("click", pe, () => void x()), G(e, C), k();
}
jr(["click"]);
// packages/plugins/clock/bundle/entry.ts
var py = oy({ screenComponent: Zv(fy) });
export { py as default };
