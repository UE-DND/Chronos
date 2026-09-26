//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/constants.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/constants.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/hydration.js
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
	return Te(/* @__PURE__ */ gn(E));
}
function D(t) {
	if (T) {
		if (/* @__PURE__ */ gn(E) !== null) throw xe(), e;
		E = t;
	}
}
function De(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ gn(n);
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
		var i = /* @__PURE__ */ gn(n);
		e && n.remove(), n = i;
	}
}
function ke(t) {
	if (!t || t.nodeType !== 8) throw xe(), e;
	return t.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/equality.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/errors.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/context.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/context.js
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
		for (var r of n) kn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ye = t.p, nt(e);
}
function nt(e = {}) {
	return c(e, ue, { value: !0 }), e;
}
function rt() {
	return !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/task.js
var it = [];
function at() {
	var e = it;
	it = [], _(e);
}
function ot(e) {
	if (it.length === 0 && !Pt) {
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/status.js
var ct = ~(x | S | b);
function lt(e, t) {
	e.f = e.f & ct | t;
}
function ut(e) {
	e.f & 512 || e.deps === null ? lt(e, b) : lt(e, S);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/utils.js
function dt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), lt(e, b);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/misc.js
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ht(e) {
	var t = z, n = B;
	tr(null), nr(null);
	try {
		return e();
	} finally {
		tr(t), nr(n);
	}
}
function gt(e, t, n, r = n) {
	e.addEventListener(t, () => ht(n));
	let i = e[_e];
	e[_e] = i ? () => {
		i(), r(!0);
	} : () => r(!0), mt();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/async.js
function _t(e, t, n, r) {
	let i = rt() ? xt : wt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = B, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
		c(), f(), yt();
	}) : f();
}
function vt() {
	var e = B, t = z, n = Ye, r = j;
	return function(i = !0) {
		nr(e), tr(t), Xe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	nr(null), tr(null), Xe(null), e && j?.deactivate();
}
function bt() {
	var e = B, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
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
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, n, r) {
	let i = B;
	i === null && Fe();
	var a = void 0, o = Zt(t), s = !z, c = /* @__PURE__ */ new Set();
	return Pn(() => {
		var t = B, n = v();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ve && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = bt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(St);
			else for (let e of c.values()) e.reject(St);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== St && (r.activate(), t ? (o.f |= ce, tn(o, t)) : (o.f & 8388608 && (o.f ^= ce), tn(o, e)), r.deactivate());
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
function A(e) {
	let t = /* @__PURE__ */ xt(e);
	return ir(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function wt(e) {
	let t = /* @__PURE__ */ xt(e);
	return t.equals = Me, t;
}
function Tt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Hn(t[n]);
	}
}
function Et(e) {
	var n, r = B, i = e.parent;
	if (!Qn && i !== null && e.v !== t && i.f & 24576) return be(), e.v;
	nr(i);
	try {
		Tt(e), n = gr(e);
	} finally {
		nr(r);
	}
	return n;
}
function Dt(e) {
	var t = Et(e);
	if (!e.equals(t) && (e.wv = pr(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null))) {
		lt(e, b);
		return;
	}
	Qn || (Mt === null ? ut(e) : (Dn() || j?.is_fork) && Mt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ht(() => {
		t.ac.abort(ve), t.ac = null;
	}), t.fn !== null && (t.teardown = g), yr(t, 0), Bn(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && br(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/batch.js
var At = null, j = null, jt = null, Mt = null, Nt = null, Pt = !1, Ft = !1, It = null, Lt = null, Rt = 0, zt = 1, Bt = class e {
	id = zt++;
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
		At === null ? At = this : (At.#n = this, this.#t = At), At = this;
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
			for (var r of n.d) lt(r, x), t(r);
			for (r of n.m) lt(r, S), t(r);
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
					t.f ^= b;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), lt(e, x), this.schedule(e);
		for (let e of this.#d) lt(e, S), this.schedule(e);
		this.apply();
		for (var t = It = [], n = [], r = Lt = []; this.#c.length > 0;) {
			Rt++ > 1e3 && (this.#S(), Ht());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw qt(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (It = null, Lt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Kt(e, t);
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
		this.#r.clear(), jt = this, Wt(n), Wt(t), jt = null, this.#s?.resolve();
		var o = j;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Yt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= b;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= b : i & 4 ? t.push(r) : mr(r) && (i & 16 && this.#d.add(r), br(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), lt(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), j = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) dt(e[t], this.#u, this.#d);
	}
	capture(e, n, r = !1) {
		e.v !== t && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [n, r]), Mt?.set(e, n)), this.is_fork || (e.v = n);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, Mt = null;
	}
	flush() {
		try {
			Ft = !0, j = this, this.#_();
		} finally {
			Rt = 0, Nt = null, It = null, Lt = null, Ft = !1, j = null, Mt = null, Yt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(St);
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
		this.#m || (this.#m = !0, ot(() => {
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
		return (this.#s ??= v()).promise;
	}
	static ensure() {
		if (j === null) {
			let t = j = new e();
			!Ft && !Pt && ot(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		Mt = null;
	}
	schedule(e) {
		if (Nt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? At = e : t.#t = e, this.linked = !1;
		}
	}
};
function Vt(e) {
	var t = Pt;
	Pt = !0;
	try {
		var n;
		for (e && (j !== null && !j.is_fork && j.flush(), n = e());;) {
			if (st(), j === null) return n;
			j.flush();
		}
	} finally {
		Pt = t;
	}
}
function Ht() {
	try {
		Be();
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
			if (!(r.f & 24576) && mr(r) && (Ut = /* @__PURE__ */ new Set(), br(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Wn(r), Ut?.size > 0)) {
				Yt.clear();
				for (let e of Ut) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ut.has(n) && (Ut.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || br(n);
					}
				}
				Ut.clear();
			}
		}
		Ut = null;
	}
}
function Gt(e) {
	j.schedule(e);
}
function Kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), lt(e, b);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	lt(e, b);
	for (var t = e.first; t !== null;) qt(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/sources.js
var Jt = /* @__PURE__ */ new Set(), Yt = /* @__PURE__ */ new Map(), Xt = !1;
function Zt(e, t) {
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
	let n = Zt(e, t);
	return ir(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Qt(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = Me), r;
}
function N(e, t, n = !1) {
	return z !== null && (!er || z.f & 131072) && rt() && z.f & 4325394 && (rr === null || !rr.has(e)) && We(), tn(e, n ? on(t) : t, Lt);
}
var $t = null, en = 0;
function tn(e, t, n = null) {
	if (!e.equals(t)) {
		Qn ? Yt.set(e, t) : Yt.has(e) || Yt.set(e, e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Mt === null && ut(t);
		}
		e.wv = pr(), $t = null, en = 0, an(e, x, n), $t = null, rt() && B !== null && B.f & 1024 && !(B.f & 96) && (sr === null ? cr([e]) : sr.push(e)), !r.is_fork && Jt.size > 0 && !Xt && nn();
	}
	return t;
}
function nn() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && lt(e, S);
		let t;
		try {
			t = mr(e);
		} catch {
			t = !0;
		}
		t && br(e);
	}
	Jt.clear();
}
function rn(e) {
	N(e, e.v + 1);
}
function an(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = rt(), a = r.length;
		if (en += a, en > 1e5 && $t === null && ($t = /* @__PURE__ */ new Set()), $t !== null) {
			if ($t.has(e)) return;
			$t.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== B) {
				var l = (c & x) === 0;
				if (l && lt(s, t), c & 131072) Jt.add(s);
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
	if (typeof e != "object" || !e || le in e || ue in e) return e;
	let n = p(e);
	if (n !== d && n !== f) return e;
	var r = /* @__PURE__ */ new Map(), a = i(e), o = /* @__PURE__ */ M(0), s = null, c = dr, u = (e) => {
		if (dr === c) return e();
		var t = z, n = dr;
		tr(null), fr(c);
		var r = e();
		return tr(t), fr(n), r;
	};
	return a && r.set("length", /* @__PURE__ */ M(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && He();
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
					r.set(n, e), rn(o);
				}
			} else N(i, t), rn(o);
			return !0;
		},
		get(n, i, a) {
			if (i === le) return e;
			var o = r.get(i), c = i in n;
			if (o === void 0 && (!c || l(n, i)?.writable) && (o = u(() => /* @__PURE__ */ M(on(c ? n[i] : t), s)), r.set(i, o)), o !== void 0) {
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
			return (i !== void 0 || B !== null && (!a || l(e, n)?.writable)) && (i === void 0 && (i = u(() => /* @__PURE__ */ M(a ? on(e[n]) : t, s)), r.set(n, i)), V(i) === t) ? !1 : a;
		},
		set(e, n, i, c) {
			var d = r.get(n), f = n in e;
			if (a && n === "length") for (var p = i; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = u(() => /* @__PURE__ */ M(t, s)), r.set(p + "", m)) : N(m, t);
			}
			if (d === void 0) (!f || l(e, n)?.writable) && (d = u(() => /* @__PURE__ */ M(void 0, s)), N(d, on(i)), r.set(n, d));
			else {
				f = d.v !== t;
				var h = u(() => on(i));
				N(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, n);
			if (g?.set && g.set.call(c, i), !f) {
				if (a && typeof n == "string") {
					var _ = r.get("length"), v = Number(n);
					Number.isInteger(v) && v >= _.v && N(_, v + 1);
				}
				rn(o);
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
function sn(e) {
	try {
		if (typeof e == "object" && e && le in e) return e[le];
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
		dn = l(t, "firstChild").get, fn = l(t, "nextSibling").get, m(e) && (e[me] = void 0, e[pe] = null, e[he] = void 0, e.__e = void 0), m(n) && (n[ge] = void 0);
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
function P(e, t) {
	if (!T) return /* @__PURE__ */ hn(e);
	var n = /* @__PURE__ */ hn(E);
	if (n === null) n = E.appendChild(mn());
	else if (t && n.nodeType !== 3) {
		var r = mn();
		return n?.before(r), Te(r), r;
	}
	return t && xn(n), Te(n), n;
}
function F(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ hn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ gn(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = mn();
			return E?.before(r), Te(r), r;
		}
		xn(E);
	}
	return E;
}
function _n(e, t = !1) {
	if (!T) return /* @__PURE__ */ hn(e);
	var n = P(e, t);
	return D(e), n;
}
function I(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ gn(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = mn();
			return r === null ? i?.after(a) : r.before(a), Te(a), a;
		}
		xn(r);
	}
	return Te(r), r;
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
	var t = B;
	if (t === null) return z.f |= ce, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Cn(e, t);
}
function Cn(e, t) {
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
function wn(e) {
	B === null && (z === null && ze(e), Re()), Qn && Le(e);
}
function Tn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function En(e, t) {
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
	if (e & 4) It === null ? Bt.ensure().schedule(r) : It.push(r);
	else if (t !== null) {
		try {
			br(r);
		} catch (e) {
			throw Hn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && Tn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Dn() {
	return z !== null && !er;
}
function On(e) {
	let t = En(8, null);
	return lt(t, b), t.teardown = e, t;
}
function L(e) {
	wn("$effect");
	var t = B.f;
	if (!z && t & 32 && Ye !== null && !Ye.i) {
		var n = Ye;
		(n.e ??= []).push(e);
	} else return kn(e);
}
function kn(e) {
	return En(4 | ie, e);
}
function An(e) {
	return wn("$effect.pre"), En(8 | ie, e);
}
function jn(e) {
	Bt.ensure();
	let t = En(64 | re, e);
	return () => {
		Hn(t);
	};
}
function Mn(e) {
	Bt.ensure();
	let t = En(64 | re, e);
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
	return En(se | re, e);
}
function Fn(e, t = 0) {
	return En(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		En(8, () => {
			e(...t.map(V));
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
	return En(32 | re, e);
}
function zn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Qn, r = z;
		$n(!0), tr(null);
		try {
			t.call(null);
		} catch (t) {
			Cn(t, e.parent);
		} finally {
			$n(n), tr(r);
		}
	}
}
function Bn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ht(() => {
			e.abort(ve);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Un(e.nodes.start, e.nodes.end), n = !0), e.f |= te, Bn(e, t && !n), yr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	zn(e), e.f ^= te, e.f |= w;
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
		e.f ^= C, e.f & 1024 || (lt(e, x), Bt.ensure().schedule(e));
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/legacy.js
var Xn = null, Zn = !1, Qn = !1;
function $n(e) {
	Qn = e;
}
var z = null, er = !1;
function tr(e) {
	z = e;
}
var B = null;
function nr(e) {
	B = e;
}
var rr = null;
function ir(e) {
	z !== null && (z.f & 2097152 || z.f & 2) && (rr ??= /* @__PURE__ */ new Set()).add(e);
}
var ar = null, or = 0, sr = null;
function cr(e) {
	sr = e;
}
var lr = 1, ur = 0, dr = ur;
function fr(e) {
	dr = e;
}
function pr() {
	return ++lr;
}
function mr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (mr(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && lt(e, b);
	}
	return !1;
}
function hr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(rr !== null && rr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? hr(a, t, !1) : t === a && (n ? lt(a, x) : a.f & 1024 && lt(a, S), Gt(a));
	}
}
function gr(e) {
	var t = ar, n = or, r = sr, i = z, a = rr, o = Ye, s = er, c = dr, l = e.f;
	ar = null, or = 0, sr = null, z = l & 96 ? null : e, rr = null, Xe(e.ctx), er = !1, dr = ++ur, e.ac !== null && (ht(() => {
		e.ac.abort(ve);
	}), e.ac = null);
	try {
		e.f |= oe;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = _r(e);
		if (rt() && sr !== null && !er && f !== null && !(e.f & 6146)) for (var p = 0; p < sr.length; p++) hr(sr[p], e);
		if (i !== null && i !== e) {
			if (ur++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ur;
			if (t !== null) for (let e of t) e.rv = ur;
			sr !== null && (r === null ? r = sr : r.push(...sr));
		}
		return e.f & 8388608 && (e.f ^= ce), d;
	} catch (t) {
		return _r(e), Sn(t);
	} finally {
		e.f ^= oe, ar = t, or = n, sr = r, z = i, rr = a, Xe(o), er = s, dr = c;
	}
}
function _r(e) {
	var t = e.deps, n = j?.is_fork;
	if (ar !== null) {
		var r;
		if (n || yr(e, or), t !== null && or > 0) for (t.length = or + ar.length, r = 0; r < ar.length; r++) t[or + r] = ar[r];
		else e.deps = t = ar;
		if (Dn() && e.f & 512) for (r = or; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && or < t.length && (yr(e, or), t.length = or);
	return t;
}
function vr(e, n) {
	let r = n.reactions;
	if (r !== null) {
		var i = a.call(r, e);
		if (i !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[i] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (ar === null || !o.call(ar, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== t && ut(c), c.ac !== null && ht(() => {
			c.ac.abort(ve), c.ac = null, lt(c, x);
		}), Ot(c), yr(c, 0);
	}
}
function yr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) vr(e, n[r]);
}
function br(e) {
	var t = e.f;
	if (!(t & 16384)) {
		lt(e, b);
		var n = B, r = Zn;
		B = e, Zn = !(t & 96);
		try {
			t & 16777232 ? Vn(e) : Bn(e), zn(e);
			var i = gr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = lr;
		} finally {
			Zn = r, B = n;
		}
	}
}
async function xr() {
	await Promise.resolve(), Vt();
}
function V(e) {
	var t = !!(e.f & 2);
	if (Xn?.add(e), z !== null && !er && !(B !== null && B.f & 16384) && (rr === null || !rr.has(e))) {
		var n = z.deps;
		if (z.f & 2097152) e.rv < ur && (e.rv = ur, ar === null && n !== null && n[or] === e ? or++ : ar === null ? ar = [e] : ar.push(e));
		else {
			z.deps ??= [], o.call(z.deps, e) || z.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [z] : o.call(r, z) || r.push(z);
		}
	}
	if (Qn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Qn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Cr(i)) && (a = Et(i)), Yt.set(i, a), a;
		}
		var s = !(i.f & 512) && !er && z !== null && (Zn || !!(z.f & 512)), c = (i.f & ee) === 0;
		mr(i) && (s && (i.f |= 512), Dt(i)), s && !c && (kt(i), Sr(i));
	}
	if (Mt?.has(e)) return Mt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Sr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (kt(t), Sr(t));
}
function Cr(e) {
	if (e.v === t) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Yt.has(t) || t.f & 2 && Cr(t)) return !0;
	return !1;
}
function wr(e) {
	var t = er;
	try {
		return er = !0, e();
	} finally {
		er = t;
	}
}
function Tr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (le in e) Er(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && le in n && Er(n);
		}
	}
}
function Er(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Er(e[n], t);
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
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/events.js
var Dr = Symbol("events"), Or = /* @__PURE__ */ new Set(), kr = /* @__PURE__ */ new Set();
function Ar(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Lr.call(t, e), !e.cancelBubble) return ht(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, ot(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function jr(e, t, n, r = {}) {
	var i = Ar(t, e, n, r);
	return () => {
		i.__removed = !0, e.removeEventListener(t, i, r);
	};
}
function Mr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Ar(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && On(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Nr(e, t, n) {
	(t[Dr] ??= {})[e] = n;
}
function Pr(e) {
	for (var t = 0; t < e.length; t++) Or.add(e[t]);
	for (var n of kr) n(e);
}
var Fr = null, Ir = !1;
function Lr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Fr = e, Ir || (Ir = !0, setTimeout(() => {
		Ir = !1, Fr = null;
	}));
	var o = 0, s = Fr === e && e[Dr];
	if (s) {
		var l = i.indexOf(s);
		if (l !== -1 && (t === document || t === window)) {
			e[Dr] = t;
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
		tr(null), nr(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Dr]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
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
			e[Dr] = t, delete e.currentTarget, tr(d), nr(f);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/reconciler.js
var Rr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function zr(e) {
	return Rr?.createHTML(e) ?? e;
}
function Br(e) {
	var t = bn("template");
	return t.innerHTML = zr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/template.js
function Vr(e, t) {
	var n = B;
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
		if (T) return Vr(E, null), E;
		i === void 0 && (i = Br(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ hn(i)));
		var t = r || un ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ hn(t), s = t.lastChild;
			Vr(o, s);
		} else Vr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Hr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (T) return Vr(E, null), E;
		if (!o) {
			var e = /* @__PURE__ */ hn(Br(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ hn(e);) o.appendChild(/* @__PURE__ */ hn(e));
			else o = /* @__PURE__ */ hn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ hn(t), r = t.lastChild;
			Vr(n, r);
		} else Vr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ur(e, t) {
	return /* @__PURE__ */ Hr(e, t, "svg");
}
function Wr(e = "") {
	if (!T) {
		var t = mn(e + "");
		return Vr(t, t), t;
	}
	var n = E;
	return n.nodeType === 3 ? xn(n) : (n.before(n = mn()), Te(n)), Vr(n, n), n;
}
function U() {
	if (T) return Vr(E, null), E;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = mn();
	return e.append(t, n), Vr(t, n), e;
}
function W(e, t) {
	if (T) {
		var n = B;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = E), Ee();
		return;
	}
	e !== null && e.before(t);
}
function Gr() {
	if (T && E && E.nodeType === 8 && E.textContent?.startsWith("$")) {
		let e = E.textContent.substring(1);
		return Ee(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/utils.js
function Kr(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var qr = [
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
function Jr(e) {
	return qr.includes(e);
}
var Yr = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), Xr = {
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
function Zr(e) {
	return e = e.toLowerCase(), Xr[e] ?? e;
}
[...Yr];
var Qr = ["touchstart", "touchmove"];
function $r(e) {
	return Qr.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/create-subscriber.js
function ei(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		Dn() && (V(n), Fn(() => (t === 0 && (r = wr(() => e(() => rn(n)))), t += 1, () => {
			ot(() => {
				--t, t === 0 && (r?.(), r = void 0, rn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ti = ne | re;
function ni(e, t, n, r) {
	new ri(e, t, n, r);
}
var ri = class {
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
	#h = ei(() => (this.#m = Zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = In(() => {
			if (T) {
				let e = this.#t;
				Ee();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ti), T && (this.#e = E);
	}
	#g() {
		try {
			this.#a = Rn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		ot(r), t && (this.#s = Rn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ce();
				return;
			}
			t = !0, n && Ge(), this.#s !== null && Gn(this.#s, () => {
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
					Cn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Rn(() => e(this.#e)), ot(() => {
			var e = this.#c = document.createDocumentFragment(), t = mn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
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
			}), this.#a === null) {
				this.#c = null, n && this.#x(j);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Gn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
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
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		dt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = B, n = z, r = Ye;
		nr(this.#i), tr(this.#i), Xe(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} finally {
			nr(t), tr(n), Xe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, ot(() => {
			this.#d = !1, this.#m && tn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), V(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Hn(this.#a), null), this.#o &&= (Hn(this.#o), null), this.#s &&= (Hn(this.#s), null), T && (Te(this.#t), De(), Te(Oe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Rn(() => {
						var r = B;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Cn(e, this.#i.parent), null;
				}
			}));
		};
		ot(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Cn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Cn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function ii(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ge] ??= e.nodeValue) && (e[ge] = n, e.nodeValue = `${n}`);
}
function ai(e, t) {
	return si(e, t);
}
var oi = /* @__PURE__ */ new Map();
function si(t, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: c = !0, transformError: l }) {
	pn();
	var u = void 0, d = Mn(() => {
		var c = r ?? n.appendChild(mn());
		ni(c, { pending: () => {} }, (n) => {
			O({});
			var r = Ye;
			if (o && (r.c = o), a && (i.$$events = a), T && Vr(n, null), u = t(n, i) || nt(), T && (B.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw xe(), e;
			k();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = $r(r);
					for (let e of [n, document]) {
						var a = oi.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), oi.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Lr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(s(Or)), kr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = oi.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Lr), t.delete(e), t.size === 0 && oi.delete(r)) : t.set(e, i);
			}
			kr.delete(f), c !== r && c.parentNode?.removeChild(c);
		};
	});
	return ci.set(u, d), u;
}
var ci = /* @__PURE__ */ new WeakMap();
function li(e, t) {
	let n = ci.get(e);
	return n ? (ci.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var ui = class {
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
		var n = j, r = yn();
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
		} else T && (this.anchor = E), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function G(e, t, ...n) {
	var r = new ui(e);
	In(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, ne);
}
function di(e) {
	Ye === null && Ne("onMount"), L(() => {
		let t = wr(e);
		if (typeof t == "function") return t;
	});
}
function fi(e) {
	Ye === null && Ne("onDestroy"), di(() => () => wr(e));
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/attachments/index.js
function pi() {
	return Symbol(r);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/if.js
function K(e, t, n = !1) {
	var r;
	T && (r = E, Ee());
	var i = new ui(e), a = n ? ne : 0;
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
	In(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/key.js
var mi = Symbol("NaN");
function hi(e, t, n) {
	T && Ee();
	var r = new ui(e), i = !rt();
	In(() => {
		var e = t();
		e !== e && (e = mi), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/each.js
function gi(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, c = 0; c < i; c++) {
		let n = t[c];
		Gn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					_i(e, s(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		_i(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function _i(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ae, Yn(a, document.createDocumentFragment())) : Hn(t[i], n);
	}
}
var vi;
function yi(e, t, n, r, a, o = null) {
	var c = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		c = T ? Te(/* @__PURE__ */ hn(u)) : u.appendChild(mn());
	}
	T && Ee();
	var d = null, f = /* @__PURE__ */ wt(() => {
		var e = n();
		return i(e) ? e : e == null ? [] : s(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, xi(v, p, c, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ae, Ci(d, null, c)) : qn(d) : Gn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: In(() => {
			p = V(f);
			var e = p.length;
			let i = !1;
			T && ke(c) === "[!" != (e === 0) && (c = Oe(), Te(c), we(!1), i = !0);
			for (var s = /* @__PURE__ */ new Set(), u = j, v = yn(), y = 0; y < e; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (c = E, i = !0, we(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && tn(S.v, b), S.i && tn(S.i, y), v && u.unskip_effect(S.e)) : (S = Si(l, h ? c : vi ??= mn(), b, x, y, a, t, n), h || (S.e.f |= ae), l.set(x, S)), s.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Rn(() => o(c)) : (d = Rn(() => o(vi ??= mn())), d.f |= ae)), e > s.size && Ie("", "", ""), T && e > 0 && Te(Oe()), !h) {
				if (m.set(u, s), v) {
					for (let [e, t] of l) s.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			i && we(!0), V(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, T && (c = E);
}
function bi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function xi(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, c = e.items, l = bi(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (qn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ae, _ === l) Ci(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), wi(e, d, _), wi(e, _, y), Ci(_, y, n), d = _, p = [], m = [], l = bi(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ci(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					wi(e, S.prev, C.next), wi(e, d, S), wi(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Ci(_, l, n), wi(e, _.prev, _.next), wi(e, _, d === null ? e.effect.first : d.next), wi(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = bi(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = bi(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (_i(e, s(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = bi(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			gi(e, w, te);
		}
	}
	a && ot(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Si(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ Qt(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Rn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ci(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ gn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function wi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Ti(e, t, n) {
	var r;
	T && (r = E, Ee());
	var i = new ui(e);
	In(() => {
		var e = t() ?? null;
		if (T && ke(r) === "[" != (e !== null)) {
			var a = Oe();
			Te(a), i.anchor = a, we(!1), i.ensure(e, e && ((t) => n(t, e))), we(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, ne);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ei(e, t, n) {
	Nn(() => {
		var r = wr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Fn(() => {
				var e = n();
				Tr(e), i && je(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Di(e, t) {
	var n = void 0, r;
	Ln(() => {
		n !== (n = t()) && (r &&= (Hn(r), null), n && (r = Rn(() => {
			Nn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function Oi(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Oi(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function ki() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Oi(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/shared/attributes.js
function Ai(e) {
	return typeof e == "object" ? ki(e) : e ?? "";
}
var ji = [..." 	\n\r\f\xA0\v﻿"];
function Mi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ji.includes(r[o - 1])) && (s === r.length || ji.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ni(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Pi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Fi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Pi)), i && c.push(...Object.keys(i).map(Pi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Pi(e.substring(l, u).trim());
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
		return r && (n += Ni(r)), i && (n += Ni(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/class.js
function Ii(e, t, n, r, i, a) {
	var o = e[me];
	if (T || o !== n || o === void 0) {
		var s = Mi(n, r, a);
		(!T || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[me] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/style.js
function Li(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Ri(e, t, n, r) {
	var i = e[he];
	if (T || i !== t) {
		var a = Fi(t, r);
		(!T || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[he] = t;
	} else r && (Array.isArray(r) ? (Li(e, n?.[0], r[0]), Li(e, n?.[1], r[1], "important")) : Li(e, n, r));
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function zi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Bi(e, t) {
	var n = !("__defaultValue" in e);
	(n || e.__defaultValue !== t) && (e.__defaultValue = t, Vi(e, !n || "__value" in e));
}
function Vi(e, t) {
	var n = e.__defaultValue, r = e.multiple, a = r ? n ?? [] : null;
	if (!r || i(a)) {
		var o = e.selectedIndex, s = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = Wi(c);
			zi(c, r ? a.includes(l) : cn(l, n));
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
function Hi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!i(t)) return Se();
		for (var r of e.options) r.selected = t.includes(Wi(r));
		return;
	}
	for (r of e.options) if (cn(Wi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function Ui(e) {
	var t = new MutationObserver((t) => {
		t.every(Gi) || ("__defaultValue" in e && Vi(e, !1), "__value" in e && Hi(e, e.__value));
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
function Wi(e) {
	return "__value" in e ? e.__value : e.value;
}
function Gi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Ki = Symbol("class"), qi = Symbol("style"), Ji = Symbol("is custom element"), Yi = Symbol("is html"), Xi = ye ? "link" : "LINK", Zi = ye ? "input" : "INPUT", Qi = ye ? "option" : "OPTION", $i = ye ? "select" : "SELECT";
function ea(e) {
	if (T) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					ta(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					ta(e, "checked", null), e.checked = r;
				}
			}
		};
		e[_e] = n, ot(n), mt();
	}
}
function ta(e, t, n, r) {
	var i = ra(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Xi) || i[t] !== (i[t] = n) && (t === "loading" && (e[fe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && aa(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function na(e, n, r, i, a = !1, o = !1) {
	T && a && e.nodeName === Zi && ("defaultValue" in r || "defaultChecked" in r || ea(e));
	var s = ra(e), c = s[Ji], l = !s[Yi];
	let u = T && c;
	u && we(!1);
	var d = n || {}, f = e.nodeName === Qi, p = e.nodeName === $i;
	for (var m in n) !(m in r) && m[0] + m[1] !== "$$" && (r[m] = null);
	r.class ? r.class = Ai(r.class) : (i || r[Ki]) && (r.class = null), r[qi] && (r.style ??= null);
	var h = aa(e);
	if (e.nodeName === Zi && "type" in r && ("value" in r || "__value" in r)) {
		var g = r.type;
		(g !== d.type || g === void 0 && e.hasAttribute("type")) && (d.type = g, ta(e, "type", g, o));
	}
	for (let a in r) {
		let u = r[a];
		if (f && a === "value" && u == null) {
			e.value = e.__value = "", d[a] = u;
			continue;
		}
		if (a === "class") {
			Ii(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", u, i, n?.[Ki], r[Ki]), d[a] = u, d[Ki] = r[Ki];
			continue;
		}
		if (a === "style") {
			Ri(e, u, n?.[qi], r[qi]), d[a] = u, d[qi] = r[qi];
			continue;
		}
		var _ = d[a];
		if (u !== _ || u === void 0 && e.hasAttribute(a)) {
			d[a] = u;
			var v = a[0] + a[1];
			if (v !== "$$") {
				if (v === "on") {
					let t = {}, n = "$$" + a, r = a.slice(2);
					var y = Jr(r);
					if (Kr(r) && (r = r.slice(0, -7), t.capture = !0), !y && _) {
						if (u != null) continue;
						e.removeEventListener(r, d[n], t), d[n] = null;
					}
					if (y) Nr(r, e, u), Pr([r]);
					else if (u != null) {
						function i(e) {
							d[a].call(this, e);
						}
						d[n] = Ar(r, e, i, t);
					}
				} else if (a === "style") ta(e, a, u);
				else if (a === "autofocus") ft(e, !!u);
				else if (!c && (a === "__value" || a === "value" && u != null)) e.value = e.__value = u;
				else if (a === "selected" && f) zi(e, u);
				else {
					var b = a;
					l || (b = Zr(b));
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
					} else x || (c || typeof u != "string") && h.has(b) ? (e[b] = u, b in s && (s[b] = t)) : typeof u != "function" && ta(e, b, u, o);
				}
			}
		}
	}
	return u && we(!0), d;
}
function q(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	_t(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === $i, l = !1;
		if (Ln(() => {
			var u = t(...n.map(V)), d = na(e, r, u, a, o, s);
			if (l && c) {
				var f = e;
				"defaultValue" in u && Bi(f, u.defaultValue), "value" in u && Hi(f, u.value);
			}
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || Hn(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var p = u[t];
				t.description === "@attach" && (!r || p !== r[t]) && (i[t] && Hn(i[t]), i[t] = Rn(() => Di(e, () => p))), d[t] = p;
			}
			r = d;
		}), c) {
			var u = e;
			Nn(() => {
				var e = r;
				"defaultValue" in e && Bi(u, e.defaultValue), Hi(u, e.value, !0), Ui(u);
			});
		}
		l = !0;
	});
}
function ra(e) {
	return e[pe] ??= {
		[Ji]: e.nodeName.includes("-"),
		[Yi]: e.namespaceURI === n
	};
}
var ia = /* @__PURE__ */ new Map();
function aa(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ia.get(t);
	if (n) return n;
	ia.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = u(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = p(i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function oa(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	gt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = sa(e) ? ca(a) : a, n(a), j !== null && r.add(j), await xr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (T && e.defaultValue !== e.value || wr(t) == null && e.value) && (n(sa(e) ? ca(e.value) : e.value), j !== null && r.add(j)), Fn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = j;
			if (r.has(i)) return;
		}
		sa(e) && n === ca(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function sa(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function ca(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function la(e, t) {
	return e === t || e?.[le] === t;
}
function ua(e = nt(), t, n, r) {
	var i = Ye.r, a = B;
	return Nn(() => {
		var o, s;
		return Fn(() => {
			o = s, s = r?.() || [], wr(() => {
				la(n(...s), e) || (t(e, ...s), o && la(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && la(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/utils.js
function da(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), g;
	let r = wr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/store/shared/index.js
var fa = [];
function pa(e, t = g) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (je(e, t) && (e = t, n)) {
			let t = !fa.length;
			for (let t of r) t[1](), fa.push(t, e);
			if (t) {
				for (let e = 0; e < fa.length; e += 2) fa[e][0](fa[e + 1]);
				fa.length = 0;
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
function ma(e) {
	let t;
	return da(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/store.js
var ha = !1;
function ga(e) {
	var t = ha;
	try {
		return ha = !1, [e(), ha];
	} finally {
		ha = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/internal/client/reactivity/props.js
var _a = {
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
function J(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, _a);
}
var va = {
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
function ya(...e) {
	return new Proxy({ props: e }, va);
}
function Y(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, u = void 0, d = () => o && i ? (u ??= /* @__PURE__ */ xt(r), V(u)) : (c && (c = !1, s = o ? wr(r) : r), s);
	let f;
	if (a) {
		var p = le in e || de in e;
		f = l(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ga(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ve(t), f(m)));
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
	a && V(y);
	var b = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? on(e) : e;
			return N(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Qn && v || b.f & 16384 ? y.v : V(y);
	});
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
var ba = {
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
function xa(e) {
	let [t, n, r] = e.split("-");
	return `${t}/${n.padStart(2, "0")}/${r.padStart(2, "0")}`;
}
function Sa(e) {
	let [, t, n] = e.split("-");
	return `${t.padStart(2, "0")}/${n.padStart(2, "0")}`;
}
function Ca(e = /* @__PURE__ */ new Date()) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
.2126 * wa(15 / 255) + .7152 * wa(23 / 255) + .0722 * wa(42 / 255);
function wa(e) {
	return e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
//#endregion
//#region packages/core/src/types/services.ts
function Ta(e) {
	return { key: e };
}
var Ea = Ta("analytics");
//#endregion
//#region packages/core/src/i18n/i18n-catalog.ts
function Da(e, t) {
	return t ? e.replace(/\{(\w+)\}/g, (e, n) => {
		let r = t[n];
		return r == null ? `{${n}}` : typeof r == "string" || typeof r == "number" || typeof r == "boolean" ? String(r) : JSON.stringify(r);
	}) : e;
}
//#endregion
//#region packages/core/src/types/mountable.ts
var Oa = Symbol.for("chronos.mountable");
new Set(/* @__PURE__ */ "color.surface-dim,color.surface-bright,color.surface-container-lowest,color.surface-container-low,color.surface-container,color.surface-container-highest,color.on-surface-variant,color.inverse-surface,color.inverse-on-surface,color.primary-fixed,color.primary-fixed-dim,color.on-primary-fixed,color.on-primary-fixed-variant,color.secondary-fixed,color.secondary-fixed-dim,color.on-secondary-fixed,color.on-secondary-fixed-variant,color.tertiary,color.tertiary-dim,color.on-tertiary,color.tertiary-container,color.on-tertiary-container,color.tertiary-fixed,color.tertiary-fixed-dim,color.on-tertiary-fixed,color.on-tertiary-fixed-variant,color.error,color.error-dim,color.on-error,color.error-container,color.on-error-container,color.shadow,color.scrim,color.on-on-primary,color.tertiary-container-subtle,color.on-tertiary-container-subtle,color.error-container-subtle,color.on-error-container-subtle,color.surface,color.on-surface,color.primary,color.on-primary,color.surface-variant,color.outline,color.secondary,color.primary-dim,color.primary-container,color.on-primary-container,color.inverse-primary,color.secondary-dim,color.on-secondary,color.secondary-container,color.on-secondary-container,color.primary-container-subtle,color.on-primary-container-subtle,color.secondary-container-subtle,color.on-secondary-container-subtle,color.outline-variant,color.surface-container-high,color.canvas,color.ink,color.border-subtle,color.success,color.warning,color.danger,shell.bottomTab.activeBackground,shell.bottomTab.activeForeground,shell.bottomBar.background,shell.topBar.background,leadingIcon.background,leadingIcon.color,leadingIcon.backgroundPrimary,leadingIcon.colorPrimary,leadingIcon.backgroundSecondary,leadingIcon.colorSecondary,leadingIcon.backgroundTertiary,leadingIcon.colorTertiary,leadingIcon.backgroundNeutral,leadingIcon.colorNeutral,timetable.period.activeBackground,timetable.period.activeBackgroundImage".split(","));
//#endregion
//#region packages/core/src/analytics/plugin-analytics.ts
function ka(e, t) {
	return `plugin.${e}.${t}`;
}
function Aa(e, t, n, r) {
	let i = e.tryService(Ea);
	i && i.track(ka(t, n), {
		...r,
		source: "plugin",
		plugin_id: t
	});
}
//#endregion
//#region packages/core/src/plugin/define-chronos-plugin.ts
function ja(e, t, n = "zh-cn") {
	return e[n]?.[t] ?? e.en?.[t] ?? t;
}
function Ma() {
	return "1.1.0";
}
function Na(e) {
	let t;
	return {
		id: e.id,
		name: () => t?.(e.nameKey) ?? ja(e.messages, e.nameKey),
		version: e.version ?? Ma(),
		description: e.descriptionKey ? () => t?.(e.descriptionKey) ?? ja(e.messages, e.descriptionKey) : void 0,
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
function Pa(e) {
	let t, n = ei((n) => {
		let r = !1, i = e.subscribe((e) => {
			t = e, r && n();
		});
		return r = !0, i;
	});
	function r() {
		return Dn() ? (n(), t) : ma(e);
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
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Pr(["input"]), Pr(["change"]), Pr(["change"]), Pr(["change"]), Pr([
	"click",
	"pointerdown",
	"pointerup"
]), Pr(["change"]);
//#endregion
//#region packages/ui-kit/src/overlay/history-overlay.ts
var Fa = Symbol("overlay-lifecycle"), Ia = /* @__PURE__ */ new WeakMap();
function La(e) {
	let t, n = !1, r = !1, i = /* @__PURE__ */ new Set(), a = e.parent && Ia.get(e.parent);
	function o() {
		for (let e of i) e();
	}
	function s() {
		if (!r) return;
		r = !1;
		let n = t;
		t = void 0, n?.dispose(), o(), e.setOpen(!1);
	}
	let c = {
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
			n || (n = !0, a?.delete(s), s(), i.clear());
		}
	};
	return Ia.set(c, i), a?.add(s), c;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/is.js
function Ra(e) {
	return typeof e == "function";
}
function za(e) {
	return typeof e == "object" && !!e;
}
var Ba = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function Va(e) {
	return e == null || Ba.includes(typeof e) ? !0 : Array.isArray(e) ? e.every((e) => Va(e)) : typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var Ha = Symbol("box"), Ua = Symbol("is-writable");
function X(e, t) {
	let n = /* @__PURE__ */ A(e);
	return t ? {
		[Ha]: !0,
		[Ua]: !0,
		get current() {
			return V(n);
		},
		set current(e) {
			t(e);
		}
	} : {
		[Ha]: !0,
		get current() {
			return e();
		}
	};
}
function Wa(e) {
	return za(e) && Ha in e;
}
function Ga(e) {
	return Wa(e) ? e : Ra(e) ? X(e) : Ka(e);
}
function Ka(e) {
	let t = /* @__PURE__ */ M(on(e));
	return {
		[Ha]: !0,
		[Ua]: !0,
		get current() {
			return V(t);
		},
		set current(e) {
			N(t, e, !0);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
function qa(...e) {
	return function(t) {
		for (let n of e) if (n) {
			if (t.defaultPrevented) return;
			typeof n == "function" ? n.call(this, t) : n.current?.call(this, t);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/inline-style-parser@0.2.7/node_modules/inline-style-parser/esm/index.mjs
var Ja = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, Ya = /\n/g, Xa = /^\s*/, Za = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, Qa = /^:\s*/, $a = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, eo = /^[;\s]*/, to = /^\s+|\s+$/g, no = "\n", ro = "/", io = "*", ao = "", oo = "comment", so = "declaration";
function co(e, t) {
	if (typeof e != "string") throw TypeError("First argument must be a string");
	if (!e) return [];
	t ||= {};
	var n = 1, r = 1;
	function i(e) {
		var t = e.match(Ya);
		t && (n += t.length);
		var i = e.lastIndexOf(no);
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
		c(Xa);
	}
	function u(e) {
		var t;
		for (e ||= []; t = d();) t !== !1 && e.push(t);
		return e;
	}
	function d() {
		var t = a();
		if (ro == e.charAt(0) && io == e.charAt(1)) {
			for (var n = 2; ao != e.charAt(n) && (io != e.charAt(n) || ro != e.charAt(n + 1));) ++n;
			if (n += 2, ao === e.charAt(n - 1)) return s("End of comment missing");
			var o = e.slice(2, n - 2);
			return r += 2, i(o), e = e.slice(n), r += 2, t({
				type: oo,
				comment: o
			});
		}
	}
	function f() {
		var e = a(), t = c(Za);
		if (t) {
			if (d(), !c(Qa)) return s("property missing ':'");
			var n = c($a), r = e({
				type: so,
				property: lo(t[0].replace(Ja, ao)),
				value: n ? lo(n[0].replace(Ja, ao)) : ao
			});
			return c(eo), r;
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
function lo(e) {
	return e ? e.replace(to, ao) : ao;
}
//#endregion
//#region node_modules/.pnpm/style-to-object@1.0.14/node_modules/style-to-object/esm/index.mjs
function uo(e, t) {
	let n = null;
	if (!e || typeof e != "string") return n;
	let r = co(e), i = typeof t == "function";
	return r.forEach((e) => {
		if (e.type !== "declaration") return;
		let { property: r, value: a } = e;
		i ? t(r, a, e) : a && (n ||= {}, n[r] = a);
	}), n;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/strings.js
var fo = /\d/, po = [
	"-",
	"_",
	"/",
	"."
];
function mo(e = "") {
	if (!fo.test(e)) return e !== e.toLowerCase();
}
function ho(e) {
	let t = [], n = "", r, i;
	for (let a of e) {
		let e = po.includes(a);
		if (e === !0) {
			t.push(n), n = "", r = void 0;
			continue;
		}
		let o = mo(a);
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
function go(e) {
	return e ? ho(e).map((e) => vo(e)).join("") : "";
}
function _o(e) {
	return yo(go(e || ""));
}
function vo(e) {
	return e ? e[0].toUpperCase() + e.slice(1) : "";
}
function yo(e) {
	return e ? e[0].toLowerCase() + e.slice(1) : "";
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function bo(e) {
	if (!e) return {};
	let t = {};
	function n(e, n) {
		if (e.startsWith("-moz-") || e.startsWith("-webkit-") || e.startsWith("-ms-") || e.startsWith("-o-")) {
			t[go(e)] = n;
			return;
		}
		if (e.startsWith("--")) {
			t[e] = n;
			return;
		}
		t[_o(e)] = n;
	}
	return uo(e, n), t;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
function xo(...e) {
	return (...t) => {
		for (let n of e) typeof n == "function" && n(...t);
	};
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function So(e, t) {
	let n = RegExp(e, "g");
	return (e) => {
		if (typeof e != "string") throw TypeError(`expected an argument of type string, but got ${typeof e}`);
		return e.match(n) ? e.replace(n, t) : e;
	};
}
var Co = So(/[A-Z]/, (e) => `-${e.toLowerCase()}`);
function wo(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`expected an argument of type object, but got ${typeof e}`);
	return Object.keys(e).map((t) => `${Co(t)}: ${e[t]};`).join("\n");
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/style.js
function To(e = {}) {
	return wo(e).replace("\n", " ");
}
var Eo = new Set(/* @__PURE__ */ "onabort.onanimationcancel.onanimationend.onanimationiteration.onanimationstart.onauxclick.onbeforeinput.onbeforetoggle.onblur.oncancel.oncanplay.oncanplaythrough.onchange.onclick.onclose.oncompositionend.oncompositionstart.oncompositionupdate.oncontextlost.oncontextmenu.oncontextrestored.oncopy.oncuechange.oncut.ondblclick.ondrag.ondragend.ondragenter.ondragleave.ondragover.ondragstart.ondrop.ondurationchange.onemptied.onended.onerror.onfocus.onfocusin.onfocusout.onformdata.ongotpointercapture.oninput.oninvalid.onkeydown.onkeypress.onkeyup.onload.onloadeddata.onloadedmetadata.onloadstart.onlostpointercapture.onmousedown.onmouseenter.onmouseleave.onmousemove.onmouseout.onmouseover.onmouseup.onpaste.onpause.onplay.onplaying.onpointercancel.onpointerdown.onpointerenter.onpointerleave.onpointermove.onpointerout.onpointerover.onpointerup.onprogress.onratechange.onreset.onresize.onscroll.onscrollend.onsecuritypolicyviolation.onseeked.onseeking.onselect.onselectionchange.onselectstart.onslotchange.onstalled.onsubmit.onsuspend.ontimeupdate.ontoggle.ontouchcancel.ontouchend.ontouchmove.ontouchstart.ontransitioncancel.ontransitionend.ontransitionrun.ontransitionstart.onvolumechange.onwaiting.onwebkitanimationend.onwebkitanimationiteration.onwebkitanimationstart.onwebkittransitionend.onwheel".split("."));
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/merge-props.js
function Do(e) {
	return Eo.has(e);
}
function Z(...e) {
	let t = { ...e[0] };
	for (let n = 1; n < e.length; n++) {
		let r = e[n];
		if (r) {
			for (let e of Object.keys(r)) {
				let n = t[e], i = r[e], a = typeof n == "function", o = typeof i == "function";
				if (a && typeof o && Do(e)) t[e] = qa(n, i);
				else if (a && o) t[e] = xo(n, i);
				else if (e === "class") {
					let r = Va(n), a = Va(i);
					r && a ? t[e] = ki(n, i) : r ? t[e] = ki(n) : a && (t[e] = ki(i));
				} else if (e === "style") {
					let r = typeof n == "object", a = typeof i == "object", o = typeof n == "string", s = typeof i == "string";
					if (r && a) t[e] = {
						...n,
						...i
					};
					else if (r && s) {
						let r = bo(i);
						t[e] = {
							...n,
							...r
						};
					} else if (o && a) t[e] = {
						...bo(n),
						...i
					};
					else if (o && s) {
						let r = bo(n), a = bo(i);
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
	return typeof t.style == "object" && (t.style = To(t.style).replaceAll("\n", " ")), t.hidden === !1 && (t.hidden = void 0, delete t.hidden), t.disabled === !1 && (t.disabled = void 0, delete t.disabled), t;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/sr-only-styles.js
var Oo = {
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
}, ko = To(Oo), Ao = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzero-dev+vite_66ae611bf2da0f4c76bb08671e0fc467/node_modules/runed/dist/internal/utils/dom.js
function jo(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.57.1/node_modules/svelte/src/reactivity/map.js
var Mo = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ M(0);
	#n = /* @__PURE__ */ M(0);
	#r = dr || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return dr === this.#r ? /* @__PURE__ */ M(e) : Zt(e);
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
		if (r === void 0) r = this.#i(0), n.set(e, r), N(this.#n, super.size), rn(o);
		else if (i !== t) {
			rn(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && rn(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), N(n, -1)), r && (N(this.#n, super.size), rn(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			N(this.#n, 0);
			for (var t of e.values()) N(t, -1);
			rn(this.#t), e.clear();
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
}, No = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = ei(t);
	}
	get current() {
		return this.#t(), this.#e();
	}
}, Po = /\(.+\)/, Fo = /* @__PURE__ */ new Set([
	"all",
	"print",
	"screen",
	"and",
	"or",
	"not",
	"only"
]), Io = class extends No {
	constructor(e, t) {
		let n = Po.test(e) || e.split(/[\s,]+/).some((e) => Fo.has(e.trim())) ? e : `(${e})`, r = window.matchMedia(n);
		super(() => r.matches, (e) => jr(r, "change", e));
	}
};
new class {
	#e;
	#t;
	constructor(e = {}) {
		let { window: t = Ao, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = ei((e) => {
			let n = jr(t, "focusin", e), r = jr(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? jo(this.#e) : null;
	}
}();
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzero-dev+vite_66ae611bf2da0f4c76bb08671e0fc467/node_modules/runed/dist/internal/utils/is.js
function Lo(e) {
	return typeof e == "function";
}
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzero-dev+vite_66ae611bf2da0f4c76bb08671e0fc467/node_modules/runed/dist/utilities/context/context.js
var Ro = class {
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
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzero-dev+vite_66ae611bf2da0f4c76bb08671e0fc467/node_modules/runed/dist/utilities/watch/watch.svelte.js
function zo(e, t) {
	switch (e) {
		case "post":
			L(t);
			break;
		case "pre": An(t);
	}
}
function Bo(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	zo(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = wr(() => n(t, o));
		return o = t, r;
	});
}
function Vo(e, t, n) {
	Bo(e, "post", t, n);
}
function Ho(e, t, n) {
	Bo(e, "pre", t, n);
}
Vo.pre = Ho;
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzero-dev+vite_66ae611bf2da0f4c76bb08671e0fc467/node_modules/runed/dist/internal/utils/get.js
function Uo(e) {
	return Lo(e) ? e() : e;
}
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzero-dev+vite_66ae611bf2da0f4c76bb08671e0fc467/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var Wo = class {
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
		let e = Uo(this.#r);
		if (e) return ei((t) => {
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
		this.#i = t.window ?? Ao, this.#n = t, this.#r = e, this.#e = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		let e = Uo(this.#r);
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
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/on-destroy-effect.svelte.js
function Go(e) {
	L(() => () => {
		e();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/after-sleep.js
function Ko(e, t) {
	return setTimeout(t, e);
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function qo(e) {
	xr().then(e);
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/dom.js
var Jo = 1, Yo = 9, Xo = 11;
function Zo(e) {
	return za(e) && e.nodeType === Jo && typeof e.nodeName == "string";
}
function Qo(e) {
	return za(e) && e.nodeType === Yo;
}
function $o(e) {
	return za(e) && e.constructor?.name === "VisualViewport";
}
function es(e) {
	return za(e) && e.nodeType !== void 0;
}
function ts(e) {
	return es(e) && e.nodeType === Xo && "host" in e;
}
function ns(e, t) {
	if (!e || !t || !Zo(e) || !Zo(t)) return !1;
	let n = t.getRootNode?.();
	if (e === t || e.contains(t)) return !0;
	if (n && ts(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function rs(e) {
	return Qo(e) ? e : $o(e) ? e.document : e?.ownerDocument ?? document;
}
function is(e) {
	return ts(e) ? is(e.host) : Qo(e) ? e.defaultView ?? window : Zo(e) ? e.ownerDocument?.defaultView ?? window : window;
}
function as(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var os = class {
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
	getDocument = () => rs(this.root);
	getWindow = () => this.getDocument().defaultView ?? window;
	getActiveElement = () => as(this.root);
	isActiveElement = (e) => e === this.getActiveElement();
	getElementById(e) {
		return this.root.getElementById(e);
	}
	querySelector = (e) => this.root ? this.root.querySelector(e) : null;
	querySelectorAll = (e) => this.root ? this.root.querySelectorAll(e) : [];
	setTimeout = (e, t) => this.getWindow().setTimeout(e, t);
	clearTimeout = (e) => this.getWindow().clearTimeout(e);
};
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.70.3_@sveltejs+vite-plugin-svelte@7.3.0_@voidzer_61ae0d79a5f68149b520ae0c6cbc40e7/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
function ss(e, t) {
	return { [pi()]: (n) => Wa(e) ? (e.current = n, wr(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e.current = null, t?.(null));
	}) : (e(n), wr(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e(null), t?.(null));
	}) };
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/attrs.js
function cs(e) {
	return e ? "true" : "false";
}
function ls(e) {
	return e ? "true" : void 0;
}
function Q(e) {
	return e ? "" : void 0;
}
function us(e) {
	return e ? "open" : "closed";
}
function ds(e) {
	return e === "starting" ? { "data-starting-style": "" } : e === "ending" ? { "data-ending-style": "" } : {};
}
var fs = class {
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
function ps(e) {
	let t = new fs(e);
	return {
		...t.attrs,
		selector: t.selector,
		getAttr: t.getAttr
	};
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/kbd-constants.js
var ms = "ArrowDown", hs = "ArrowLeft", gs = "ArrowRight", _s = "ArrowUp", vs = "Enter", ys = typeof document < "u", bs = xs();
function xs() {
	return ys && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Ss(e) {
	return e instanceof HTMLElement;
}
function Cs(e) {
	return e instanceof Element;
}
function ws(e) {
	return e instanceof Element || e instanceof SVGElement;
}
function Ts(e) {
	return e === null;
}
function Es(e) {
	return e.pointerType === "touch";
}
function Ds(e) {
	return e !== null;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/animations-complete.js
var Os = class {
	#e;
	#t = null;
	#n = null;
	#r = 0;
	constructor(e) {
		this.#e = e, Go(() => this.#i());
	}
	#i() {
		this.#t !== null && (window.cancelAnimationFrame(this.#t), this.#t = null), this.#n?.disconnect(), this.#n = null, this.#r++;
	}
	run(e) {
		this.#i();
		let t = this.#e.ref.current;
		if (!t) return;
		if (typeof t.getAnimations != "function") {
			this.#a(e);
			return;
		}
		let n = this.#r, r = () => {
			n === this.#r && this.#a(e);
		}, i = () => {
			if (n !== this.#r) return;
			let e = t.getAnimations();
			if (e.length === 0) {
				r();
				return;
			}
			Promise.all(e.map((e) => e.finished)).then(() => {
				r();
			}).catch(() => {
				if (n === this.#r) {
					if (t.getAnimations().some((e) => e.pending || e.playState !== "finished")) {
						i();
						return;
					}
					r();
				}
			});
		}, a = () => {
			this.#t = window.requestAnimationFrame(() => {
				this.#t = null, i();
			});
		};
		if (!this.#e.afterTick.current) {
			a();
			return;
		}
		this.#t = window.requestAnimationFrame(() => {
			this.#t = null;
			let e = "data-starting-style";
			if (!t.hasAttribute(e)) {
				a();
				return;
			}
			this.#n = new MutationObserver(() => {
				n === this.#r && (t.hasAttribute(e) || (this.#n?.disconnect(), this.#n = null, a()));
			}), this.#n.observe(t, {
				attributes: !0,
				attributeFilter: [e]
			});
		});
	}
	#a(e) {
		let t = () => {
			e();
		};
		this.#e.afterTick ? qo(t) : t();
	}
}, ks = class {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ M(!1);
	#i = /* @__PURE__ */ M(void 0);
	#a = !1;
	#o = null;
	constructor(e) {
		this.#e = e, N(this.#r, e.open.current, !0), this.#t = e.enabled ?? !0, this.#n = new Os({
			ref: this.#e.ref,
			afterTick: this.#e.open
		}), Go(() => this.#s()), Vo(() => this.#e.open.current, (e) => {
			if (!this.#a) {
				this.#a = !0;
				return;
			}
			if (this.#s(), !e && this.#e.shouldSkipExitAnimation?.()) {
				N(this.#r, !1), N(this.#i, void 0), this.#e.onComplete?.();
				return;
			}
			if (e && N(this.#r, !0), N(this.#i, e ? "starting" : "ending", !0), e && (this.#o = window.requestAnimationFrame(() => {
				this.#o = null, this.#e.open.current && N(this.#i, void 0);
			})), !this.#t) {
				e || N(this.#r, !1), N(this.#i, void 0), this.#e.onComplete?.();
				return;
			}
			this.#n.run(() => {
				e === this.#e.open.current && (this.#e.open.current || N(this.#r, !1), N(this.#i, void 0), this.#e.onComplete?.());
			});
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
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/noop.js
function $() {}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/create-id.js
function As(e, t) {
	return t === void 0 ? `bits-${e}` : `bits-${e}-${t}`;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
var js = ps({
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
}), Ms = new Ro("Dialog.Root | AlertDialog.Root"), Ns = class e {
	static create(t) {
		let n = Ms.getOr(null);
		return Ms.set(new e(t, n));
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
		this.opts = e, this.parent = t, this.depth = t ? t.depth + 1 : 0, this.handleOpen = this.handleOpen.bind(this), this.handleClose = this.handleClose.bind(this), this.contentPresence = new ks({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			enabled: !0,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new ks({
			ref: X(() => this.overlayNode),
			open: this.opts.open,
			enabled: !0
		}), Vo(() => this.opts.open.current, (e) => {
			this.parent && (e ? this.parent.incrementNested() : this.parent.decrementNested());
		}, { lazy: !0 }), Go(() => {
			this.opts.open.current && this.parent?.decrementNested();
		});
	}
	handleOpen() {
		this.opts.open.current || (this.opts.open.current = !0);
	}
	handleClose() {
		this.opts.open.current && (this.opts.open.current = !1);
	}
	getBitsAttr = (e) => js.getAttr(e, this.opts.variant.current);
	incrementNested() {
		this.nestedOpenCount++, this.parent?.incrementNested();
	}
	decrementNested() {
		this.nestedOpenCount !== 0 && (this.nestedOpenCount--, this.parent?.decrementNested());
	}
	#u = /* @__PURE__ */ A(() => ({ "data-state": us(this.opts.open.current) }));
	get sharedProps() {
		return V(this.#u);
	}
	set sharedProps(e) {
		N(this.#u, e);
	}
}, Ps = class e {
	static create(t) {
		return new e(t, Ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.titleId = this.opts.id.current, this.attachment = ss(this.opts.ref), Vo.pre(() => this.opts.id.current, (e) => {
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
}, Fs = class e {
	static create(t) {
		return new e(t, Ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.root.descriptionId = this.opts.id.current, this.attachment = ss(this.opts.ref, (e) => {
			this.root.descriptionNode = e;
		}), Vo.pre(() => this.opts.id.current, (e) => {
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
}, Is = class e {
	static create(t) {
		return new e(t, Ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref, (e) => {
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
		...ds(this.root.contentPresence.transitionStatus),
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
}, Ls = class e {
	static create(t) {
		return new e(t, Ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref, (e) => this.root.overlayNode = e);
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
		...ds(this.root.overlayPresence.transitionStatus),
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
}, Rs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"level"
]), zs = /* @__PURE__ */ H("<div><!></div>");
function Bs(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = Y(t, "level", 3, 2), o = /* @__PURE__ */ J(t, Rs), s = Ps.create({
		id: X(() => r()),
		level: X(() => a()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props));
	var l = U(), u = F(l), d = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(c) })), W(e, n);
	}, f = (e) => {
		var n = zs();
		q(n, () => ({ ...V(c) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Vs(e, t) {
	var n = U();
	hi(F(n), () => t.children, (e) => {
		var n = U();
		G(F(n), () => t.children ?? g), W(e, n);
	}), W(e, n);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var Hs = new Ro("BitsConfig");
function Us() {
	let e = new Ws(null, {});
	return Hs.getOr(e).opts;
}
var Ws = class {
	opts;
	constructor(e, t) {
		let n = Gs(e, t);
		this.opts = {
			defaultPortalTo: n((e) => e.defaultPortalTo),
			defaultLocale: n((e) => e.defaultLocale)
		};
	}
};
function Gs(e, t) {
	return (n) => X(() => {
		let r = n(t)?.current;
		if (r !== void 0) return r;
		if (e !== null) return n(e.opts)?.current;
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
function Ks(e, t) {
	return (n) => {
		let r = Us();
		return X(() => {
			let i = n();
			if (i !== void 0) return i;
			let a = e(r).current;
			return a === void 0 ? t : a;
		});
	};
}
var qs = Ks((e) => e.defaultLocale, "en"), Js = Ks((e) => e.defaultPortalTo, "body");
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Ys(e, t) {
	O(t, !0);
	let n = Js(() => t.to), r = tt(), i = /* @__PURE__ */ A(a);
	function a() {
		if (!ys || t.disabled) return null;
		let e = null;
		return e = typeof n.current == "string" ? document.querySelector(n.current) : n.current, e;
	}
	let o;
	function s() {
		o &&= (li(o), null);
	}
	Vo([() => V(i), () => t.disabled], ([e, n]) => {
		if (!e || n) {
			s();
			return;
		}
		return o = ai(Vs, {
			target: e,
			props: { children: t.children },
			context: r
		}), () => {
			s();
		};
	});
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.children ?? g), W(e, n);
	};
	K(l, (e) => {
		t.disabled && e(u);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/events.js
var Xs = class {
	eventName;
	options;
	constructor(e, t = {
		bubbles: !0,
		cancelable: !0
	}) {
		this.eventName = e, this.options = t;
	}
	createEvent(e) {
		return new CustomEvent(this.eventName, {
			...this.options,
			detail: e
		});
	}
	dispatch(e, t) {
		let n = this.createEvent(t);
		return e.dispatchEvent(n), n;
	}
	listen(e, t, n) {
		return jr(e, this.eventName, (e) => {
			t(e);
		}, n);
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/debounce.js
function Zs(e, t = 500) {
	let n = null, r = (...r) => {
		n !== null && clearTimeout(n), n = setTimeout(() => {
			e(...r);
		}, t);
	};
	return r.destroy = () => {
		n !== null && (clearTimeout(n), n = null);
	}, r;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/elements.js
function Qs(e, t) {
	return e === t || e.contains(t);
}
function $s(e) {
	return e?.ownerDocument ?? document;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/dom.js
function ec(e, t) {
	let { clientX: n, clientY: r } = e, i = t.getBoundingClientRect();
	return n < i.left || n > i.right || r < i.top || r > i.bottom;
}
//#endregion
//#region node_modules/.pnpm/tabbable@6.5.0/node_modules/tabbable/dist/index.esm.js
var tc = [
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
], nc = /* #__PURE__ */ tc.join(","), rc = typeof Element > "u", ic = rc ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ac = !rc && Element.prototype.getRootNode ? function(e) {
	return e?.getRootNode?.call(e);
} : function(e) {
	return e?.ownerDocument;
}, oc = function(e, t) {
	t === void 0 && (t = !0);
	var n = e?.getAttribute?.call(e, "inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : oc(e.parentNode));
}, sc = function(e) {
	var t = e?.getAttribute?.call(e, "contenteditable");
	return t === "" || t === "true";
}, cc = function(e, t, n) {
	if (oc(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(nc));
	return t && ic.call(e, nc) && r.unshift(e), r = r.filter(n), r;
}, lc = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!oc(a, !1)) {
			if (a.tagName === "SLOT") {
				var o = a.assignedElements(), s = lc(o.length ? o : a.children, !0, n);
				n.flatten ? r.push.apply(r, s) : r.push({
					scopeParent: a,
					candidates: s
				});
			} else {
				ic.call(a, nc) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
				var c = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), l = !oc(c, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
				if (c && l) {
					var u = lc(c === !0 ? a.children : c.children, !0, n);
					n.flatten ? r.push.apply(r, u) : r.push({
						scopeParent: a,
						candidates: u
					});
				} else i.unshift.apply(i, a.children);
			}
		}
	}
	return r;
}, uc = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, dc = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || sc(e)) && !uc(e) ? 0 : e.tabIndex;
}, fc = function(e, t) {
	var n = dc(e);
	return n < 0 && t && !uc(e) ? 0 : n;
}, pc = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, mc = function(e) {
	return e.tagName === "INPUT";
}, hc = function(e) {
	return mc(e) && e.type === "hidden";
}, gc = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, _c = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, vc = function(e) {
	if (!e.name) return !0;
	var t = e.form || ac(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = _c(r, e.form);
	return !i || i === e;
}, yc = function(e) {
	return mc(e) && e.type === "radio";
}, bc = function(e) {
	return yc(e) && !vc(e);
}, xc = function(e) {
	var t = e && ac(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = ac(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, Sc = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, Cc = function(e, t) {
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
	var a = ic.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (ic.call(a, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var o = e; e;) {
				var s = e.parentElement, c = ac(e);
				if (s && !s.shadowRoot && r(s) === !0) return Sc(e);
				e = e.assignedSlot ? e.assignedSlot : !s && c !== e.ownerDocument ? c.host : s;
			}
			e = o;
		}
		if (xc(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return Sc(e);
	return !1;
}, wc = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return ic.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, Tc = function(e, t) {
	return !(t.disabled || hc(t) || Cc(t, e) || gc(t) || wc(t));
}, Ec = function(e, t) {
	return !(bc(t) || dc(t) < 0 || !Tc(e, t));
}, Dc = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, Oc = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = fc(a, i), s = i ? Oc(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(pc).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, kc = function(e, t) {
	return t ||= {}, Oc(t.getShadowRoot ? lc([e], t.includeContainer, {
		filter: Ec.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: Dc
	}) : cc(e, t.includeContainer, Ec.bind(null, t)));
}, Ac = function(e, t) {
	return t ||= {}, t.getShadowRoot ? lc([e], t.includeContainer, {
		filter: Tc.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : cc(e, t.includeContainer, Tc.bind(null, t));
}, jc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return ic.call(e, nc) !== !1 && Ec(t, e);
}, Mc = /* #__PURE__ */ tc.concat("iframe:not([inert]):not([inert] *)").join(","), Nc = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return ic.call(e, Mc) !== !1 && Tc(t, e);
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/arrays.js
function Pc(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function Fc(e, t) {
	return e >= 0 && e < t.length;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/menu/menu.svelte.js
var Ic = "data-context-menu-trigger", Lc = "data-context-menu-content";
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
new Ro("Menu.Root"), new Ro("Menu.Root | Menu.Sub"), new Ro("Menu.Content"), new Ro("Menu.Group | Menu.RadioGroup"), new Ro("Menu.RadioGroup"), new Ro("Menu.CheckboxGroup"), new Xs("bitsmenuopen", {
	bubbles: !1,
	cancelable: !0
}), ps({
	component: "menu",
	parts: [
		"trigger",
		"content",
		"sub-trigger",
		"item",
		"group",
		"group-heading",
		"checkbox-group",
		"checkbox-item",
		"radio-group",
		"radio-item",
		"separator",
		"sub-content",
		"arrow"
	]
}), globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var Rc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	#e;
	#t;
	#n = { pointerdown: !1 };
	#r = !1;
	#i = !1;
	#a = void 0;
	#o;
	#s = $;
	#c = !1;
	constructor(e) {
		this.opts = e, this.#t = e.interactOutsideBehavior, this.#e = e.onInteractOutside, this.#o = e.onFocusOutside, L(() => {
			this.#a = $s(this.opts.ref.current);
		});
		let t = $, n = null, r = () => {
			n != null && (clearTimeout(n), n = null);
		}, i = () => {
			r(), this.#_(), globalThis.bitsDismissableLayers.delete(this), this.#f.destroy(), t();
		};
		Vo([() => this.opts.enabled.current, () => this.opts.ref.current], () => {
			if (this.opts.enabled.current && this.opts.ref.current) return r(), n = Ko(1, () => {
				n = null, !(this.#c || !this.opts.ref.current) && (globalThis.bitsDismissableLayers.set(this, this.#t), t(), t = this.#u());
			}), i;
		}), Go(() => {
			this.#c = !0, r(), this.#_(), globalThis.bitsDismissableLayers.delete(this), this.#f.destroy(), this.#s(), t();
		});
	}
	#l = (e) => {
		e.defaultPrevented || this.#c || !this.opts.ref.current || qo(() => {
			this.#c || this.opts.ref.current && !this.#g(e.target) && e.target && !this.#i && this.#o.current?.(e);
		});
	};
	#u() {
		return xo(jr(this.#a, "pointerdown", xo(this.#p, this.#h), { capture: !0 }), jr(this.#a, "pointerdown", xo(this.#m, this.#f)), jr(this.#a, "focusin", this.#l));
	}
	#d = (e) => {
		let t = e;
		t.defaultPrevented && (t = Hc(e)), this.#e.current(e);
	};
	#f = Zs((e) => {
		if (!this.opts.ref.current) {
			this.#s();
			return;
		}
		let t = this.opts.isValidEvent.current(e, this.opts.ref.current) || Vc(e, this.opts.ref.current);
		if (!this.#r || this.#v() || !t) {
			this.#s();
			return;
		}
		let n = e;
		if (n.defaultPrevented && (n = Hc(n)), this.#t.current !== "close" && this.#t.current !== "defer-otherwise-close") {
			this.#s();
			return;
		}
		e.pointerType === "touch" ? (this.#s(), this.#s = jr(this.#a, "click", this.#d, { once: !0 })) : this.#e.current(n);
	}, 10);
	#p = (e) => {
		this.#n[e.type] = !0;
	};
	#m = (e) => {
		this.#n[e.type] = !1;
	};
	#h = () => {
		this.opts.ref.current && (this.#r = Bc(this.opts.ref.current));
	};
	#g = (e) => this.opts.ref.current ? Qs(this.opts.ref.current, e) : !1;
	#_ = () => {
		for (let e in this.#n) this.#n[e] = !1;
		this.#r = !1;
	};
	#v() {
		return Object.values(this.#n).some(Boolean);
	}
	#y = () => {
		this.#i = !0;
	};
	#b = () => {
		this.#i = !1;
	};
	props = {
		onfocuscapture: this.#y,
		onblurcapture: this.#b
	};
};
function zc(e = [...globalThis.bitsDismissableLayers]) {
	return e.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
}
function Bc(e) {
	let t = [...globalThis.bitsDismissableLayers], n = zc(t);
	if (n) return n[0].opts.ref.current === e;
	let [r] = t[0];
	return r.opts.ref.current === e;
}
function Vc(e, t) {
	let n = e.target;
	if (!ws(n)) return !1;
	let r = !!n.closest(`[${Ic}]`), i = !!t.closest(`[${Lc}]`);
	return "button" in e && e.button > 0 && !r ? !1 : "button" in e && e.button === 0 && r && i ? !0 : r && i ? !1 : $s(n).documentElement.contains(n) && !Qs(t, n) && ec(e, t);
}
function Hc(e) {
	let t = e.currentTarget, n = e.target, r;
	r = e instanceof PointerEvent ? new PointerEvent(e.type, e) : new PointerEvent("pointerdown", e);
	let i = !1;
	return new Proxy(r, { get: (r, a) => a === "currentTarget" ? t : a === "target" ? n : a === "preventDefault" ? () => {
		i = !0, typeof r.preventDefault == "function" && r.preventDefault();
	} : a === "defaultPrevented" ? i : a in r ? r[a] : e[a] });
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function Uc(e, t) {
	O(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "onInteractOutside", 3, $), i = Y(t, "onFocusOutside", 3, $), a = Y(t, "isValidEvent", 3, () => !1), o = Rc.create({
		id: X(() => t.id),
		interactOutsideBehavior: X(() => n()),
		onInteractOutside: X(() => r()),
		enabled: X(() => t.enabled),
		onFocusOutside: X(() => i()),
		isValidEvent: X(() => a()),
		ref: t.ref
	});
	var s = U();
	G(F(s), () => t.children ?? g, () => ({ props: o.props })), W(e, s), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var Wc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	constructor(e) {
		this.opts = e, this.domContext = new os(this.opts.ref);
		let t = $;
		Vo(() => e.enabled.current, (n) => (n && (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior), t = this.#e()), () => {
			t(), globalThis.bitsEscapeLayers.delete(this);
		}));
	}
	#e = () => jr(this.domContext.getDocument(), "keydown", this.#t, { passive: !1 });
	#t = (e) => {
		if (e.key !== "Escape" || !Gc(this)) return;
		let t = new KeyboardEvent(e.type, e);
		e.preventDefault();
		let n = this.opts.escapeKeydownBehavior.current;
		(n === "close" || n === "defer-otherwise-close") && this.opts.onEscapeKeydown.current(t);
	};
};
function Gc(e) {
	let t = [...globalThis.bitsEscapeLayers], n = t.findLast(([e, { current: t }]) => t === "close" || t === "ignore");
	if (n) return n[0] === e;
	let [r] = t[0];
	return r === e;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function Kc(e, t) {
	O(t, !0);
	let n = Y(t, "escapeKeydownBehavior", 3, "close"), r = Y(t, "onEscapeKeydown", 3, $);
	Wc.create({
		escapeKeydownBehavior: X(() => n()),
		onEscapeKeydown: X(() => r()),
		enabled: X(() => t.enabled),
		ref: t.ref
	});
	var i = U();
	G(F(i), () => t.children ?? g), W(e, i), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var qc = class e {
	static instance;
	#e = Ka([]);
	#t = /* @__PURE__ */ new WeakMap();
	#n = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		return this.instance ||= new e(), this.instance;
	}
	register(e) {
		let t = this.getActive();
		t && t !== e && t.pause();
		let n = document.activeElement;
		n && n !== document.body && this.#n.set(e, n), this.#e.current = this.#e.current.filter((t) => t !== e), this.#e.current.unshift(e);
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
}, Jc = class e {
	#e = !1;
	#t = null;
	#n = qc.getInstance();
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
		this.#t && this.unmount(), this.#t = e, this.#n.register(this), this.#c(), this.#o();
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
			if (!this.#t) return;
			let e = this.#u();
			e ? (e.focus(), this.#n.setFocusMemory(this, e)) : this.#t.focus();
		});
	}
	#s() {
		let e = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: !1,
			cancelable: !0
		});
		if (this.#i.onCloseAutoFocus.current?.(e), !e.defaultPrevented) {
			let e = this.#n.getPreFocusMemory(this);
			if (e && document.contains(e)) try {
				e.focus();
			} catch {
				document.body.focus();
			}
		}
	}
	#c() {
		if (!this.#t || !this.#i.trap.current) return;
		let e = this.#t, t = e.ownerDocument;
		this.#r.push(jr(t, "focusin", (t) => {
			if (this.#e || !this.#n.isActiveScope(this)) return;
			let n = t.target;
			if (n) {
				if (e.contains(n)) this.#n.setFocusMemory(this, n);
				else {
					let n = this.#n.getFocusMemory(this);
					if (n && e.contains(n) && Nc(n)) t.preventDefault(), n.focus();
					else {
						let t = this.#u(), n = this.#d()[0];
						(t || n || e).focus();
					}
				}
			}
		}, { capture: !0 }), jr(e, "keydown", (e) => {
			if (!this.#i.loop || this.#e || e.key !== "Tab" || !this.#n.isActiveScope(this)) return;
			let n = this.#l();
			if (n.length === 0) return;
			let r = n[0], i = n[n.length - 1];
			!e.shiftKey && t.activeElement === i ? (e.preventDefault(), r.focus()) : e.shiftKey && t.activeElement === r && (e.preventDefault(), i.focus());
		}));
		let n = new MutationObserver(() => {
			let t = this.#n.getFocusMemory(this);
			if (t && !e.contains(t)) {
				let t = this.#u(), n = this.#d()[0], r = t || n;
				r ? (r.focus(), this.#n.setFocusMemory(this, r)) : e.focus();
			}
		});
		n.observe(e, {
			childList: !0,
			subtree: !0
		}), this.#r.push(() => n.disconnect());
	}
	#l() {
		return this.#t ? kc(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	#u() {
		return this.#l()[0] || null;
	}
	#d() {
		return this.#t ? Ac(this.#t, {
			includeContainer: !1,
			getShadowRoot: !0
		}) : [];
	}
	static use(t) {
		let n = null;
		return Vo([() => t.ref.current, () => t.enabled.current], ([r, i]) => {
			r && i ? (n ||= new e(t), n.mount(r)) : n &&= (n.unmount(), null);
		}), Go(() => {
			n?.unmount();
		}), { get props() {
			return { tabindex: -1 };
		} };
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function Yc(e, t) {
	O(t, !0);
	let n = Y(t, "enabled", 3, !1), r = Y(t, "trapFocus", 3, !1), i = Y(t, "loop", 3, !1), a = Y(t, "onCloseAutoFocus", 3, $), o = Y(t, "onOpenAutoFocus", 3, $), s = Jc.use({
		enabled: X(() => n()),
		trap: X(() => r()),
		loop: i(),
		onCloseAutoFocus: X(() => a()),
		onOpenAutoFocus: X(() => o()),
		ref: t.ref
	});
	var c = U();
	G(F(c), () => t.focusScope ?? g, () => ({ props: s.props })), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var Xc = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var Zc = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	domContext;
	#e = $;
	#t = !1;
	#n = Xc;
	#r = Xc;
	constructor(e) {
		this.opts = e, this.domContext = new os(e.ref);
		let t = $;
		Vo(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([e, n, r]) => (this.#t = e, this.#n = n, this.#r = r, e && (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled), t(), t = this.#i()), () => {
			this.#t = !1, t(), this.#s(), globalThis.bitsTextSelectionLayers.delete(this);
		}));
	}
	#i() {
		return xo(jr(this.domContext.getDocument(), "pointerdown", this.#o), jr(this.domContext.getDocument(), "pointerup", qa(this.#s, this.#a)));
	}
	#a = (e) => {
		this.#r(e);
	};
	#o = (e) => {
		if (!this.#t) return;
		let t = this.opts.ref.current, n = e.target;
		Ss(t) && Ss(n) && tl(this) && ns(t, n) && (this.#n(e), !e.defaultPrevented && (this.#e = $c(t, this.domContext.getDocument().body)));
	};
	#s = () => {
		this.#e(), this.#e = $;
	};
}, Qc = (e) => e.style.userSelect || e.style.webkitUserSelect;
function $c(e, t) {
	let n = Qc(t), r = Qc(e);
	return el(t, "none"), el(e, "text"), () => {
		el(t, n), el(e, r);
	};
}
function el(e, t) {
	e.style.userSelect = t, e.style.webkitUserSelect = t;
}
function tl(e) {
	let t = [...globalThis.bitsTextSelectionLayers];
	if (!t.length) return !1;
	let n = t.at(-1);
	return n ? n[0] === e : !1;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function nl(e, t) {
	O(t, !0);
	let n = Y(t, "preventOverflowTextSelection", 3, !0), r = Y(t, "onPointerDown", 3, $), i = Y(t, "onPointerUp", 3, $);
	Zc.create({
		id: X(() => t.id),
		onPointerDown: X(() => r()),
		onPointerUp: X(() => i()),
		enabled: X(() => t.enabled && n()),
		ref: t.ref
	});
	var a = U();
	G(F(a), () => t.children ?? g), W(e, a), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
function rl(e = "bits") {
	return globalThis.bitsIdCounter.current++, `${e}-${globalThis.bitsIdCounter.current}`;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var il = class {
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
		return this.#t += 1, V(this.#n) === void 0 && (this.#r = jn(() => {
			N(this.#n, this.#e(...e), !0);
		})), L(() => () => {
			this.#i();
		}), V(this.#n);
	}
}, al = new Mo(), ol = /* @__PURE__ */ M(null), sl = null, cl = null, ll = !1, ul = X(() => {
	for (let e of al.values()) if (e) return !0;
	return !1;
}), dl = null, fl = new il(() => {
	function e(e) {
		e.body.setAttribute("style", V(ol) ?? ""), e.body.style.removeProperty("--scrollbar-width"), bs && sl?.(), N(ol, null);
	}
	function t() {
		cl !== null && (window.clearTimeout(cl), cl = null);
	}
	function n(e, n) {
		t(), ll = !0, dl = Date.now();
		let r = dl, i = () => {
			cl = null, dl === r && (ml(al) ? ll = !1 : (ll = !1, n()));
		}, a = e === null ? 24 : e;
		cl = window.setTimeout(i, a);
	}
	function r() {
		V(ol) === null && al.size === 0 && !ll && N(ol, document.body.getAttribute("style"), !0);
	}
	return Vo(() => ul.current, () => {
		if (!ul.current) return;
		r(), ll = !1;
		let e = getComputedStyle(document.documentElement), t = getComputedStyle(document.body), n = e.scrollbarGutter?.includes("stable") || t.scrollbarGutter?.includes("stable"), i = window.innerWidth - document.documentElement.clientWidth, a = {
			padding: Number.parseInt(t.paddingRight ?? "0", 10) + i,
			margin: Number.parseInt(t.marginRight ?? "0", 10)
		};
		i > 0 && !n && (document.body.style.paddingRight = `${a.padding}px`, document.body.style.marginRight = `${a.margin}px`, document.body.style.setProperty("--scrollbar-width", `${i}px`)), document.body.style.overflow = "hidden", bs && (sl = jr(document, "touchmove", (e) => {
			e.target === document.documentElement && (e.touches.length > 1 || e.preventDefault());
		}, { passive: !1 })), qo(() => {
			document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
		});
	}), Go(() => () => {
		sl?.();
	}), {
		get lockMap() {
			return al;
		},
		resetBodyStyle: e,
		scheduleCleanupIfNoNewLocks: n,
		cancelPendingCleanup: t,
		ensureInitialStyleCaptured: r
	};
}), pl = class {
	#e = rl();
	#t;
	#n = () => null;
	#r;
	locked;
	constructor(e, t = () => null) {
		this.#t = e, this.#n = t, this.#r = fl.get(), this.#r && (this.#r.cancelPendingCleanup(), this.#r.ensureInitialStyleCaptured(), this.#r.lockMap.set(this.#e, this.#t ?? !1), this.locked = X(() => this.#r.lockMap.get(this.#e) ?? !1, (e) => this.#r.lockMap.set(this.#e, e)), Go(() => {
			if (this.#r.lockMap.delete(this.#e), ml(this.#r.lockMap)) return;
			let e = this.#n(), t = document;
			this.#r.scheduleCleanupIfNoNewLocks(e, () => {
				this.#r.resetBodyStyle(t);
			});
		}));
	}
};
function ml(e) {
	for (let [t, n] of e) if (n) return !0;
	return !1;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function hl(e, t) {
	O(t, !0);
	let n = Y(t, "preventScroll", 3, !0), r = Y(t, "restoreScrollDelay", 3, null);
	n() && new pl(n(), () => r()), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
var gl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"forceMount",
	"child",
	"children",
	"ref"
]), _l = /* @__PURE__ */ H("<div><!></div>");
function vl(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "forceMount", 3, !1), a = Y(t, "ref", 15, null), o = /* @__PURE__ */ J(t, gl), s = Ls.create({
		id: X(() => r()),
		ref: X(() => a(), (e) => a(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props));
	var l = U(), u = F(l), d = (e) => {
		var n = U(), r = F(n), i = (e) => {
			var n = U(), r = F(n);
			{
				let e = /* @__PURE__ */ A(() => ({
					props: Z(V(c)),
					...s.snippetProps
				}));
				G(r, () => t.child, () => V(e));
			}
			W(e, n);
		}, a = (e) => {
			var n = _l();
			q(n, (e) => ({ ...e }), [() => Z(V(c))]), G(P(n), () => t.children ?? g, () => s.snippetProps), D(n), W(e, n);
		};
		K(r, (e) => {
			t.child ? e(i) : e(a, -1);
		}), W(e, n);
	};
	K(u, (e) => {
		(s.shouldRender || i()) && e(d);
	}), W(e, l), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
var yl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref"
]), bl = /* @__PURE__ */ H("<div><!></div>");
function xl(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ J(t, yl), o = Fs.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = bl();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/utils.mjs
function Sl(e, t) {
	return e - t * Math.floor(e / t);
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/calendars/GregorianCalendar.mjs
var Cl = 1721426;
function wl(e, t, n, r) {
	t = El(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Tl(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Tl(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function El(e, t) {
	return e === "BC" ? 1 - t : t;
}
function Dl(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var Ol = {
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
}, kl = class {
	fromJulianDay(e) {
		let t = e, n = t - Cl, r = Math.floor(n / 146097), i = Sl(n, 146097), a = Math.floor(i / 36524), o = Sl(i, 36524), s = Math.floor(o / 1461), c = Sl(o, 1461), l = Math.floor(c / 365), [u, d] = Dl(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - wl(u, d, 1, 1), p = 2;
		t < wl(u, d, 3, 1) ? p = 0 : Tl(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new Qu(u, d, m, t - wl(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return wl(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return Ol[Tl(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Tl(e.year) ? 366 : 365;
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
}, Al = {
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
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/queries.mjs
function jl(e, t) {
	return t = fu(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function Ml(e, t) {
	return t = fu(t, e.calendar), e = Kl(e), t = Kl(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function Nl(e, t) {
	return e.isEqual?.(t) ?? t.isEqual?.(e) ?? e.identifier === t.identifier;
}
function Pl(e, t) {
	return jl(e, Rl(t));
}
var Fl = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function Il(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? Fl[n] : Zl(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function Ll(e) {
	return lu(Date.now(), e);
}
function Rl(e) {
	return uu(Ll(e));
}
function zl(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function Bl(e, t) {
	return Vl(e) - Vl(t);
}
function Vl(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var Hl = null, Ul = !1;
function Wl() {
	return Hl ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, Hl;
}
function Gl() {
	return Ul;
}
function Kl(e) {
	return e.subtract({ days: e.day - 1 });
}
function ql(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var Jl = /* @__PURE__ */ new Map(), Yl = /* @__PURE__ */ new Map();
function Xl(e) {
	if (Intl.Locale) {
		let t = Jl.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && Jl.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function Zl(e) {
	let t = Yl.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return Yl.set(e, t), t.firstDay;
		}
		let n = Xl(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && Al[n] || 0 };
		Yl.set(e, t);
	}
	return t.firstDay;
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/conversion.mjs
function Ql(e) {
	return e = fu(e, new kl()), $l(El(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function $l(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function eu(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === Wl() && !Gl()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = nu(e, t);
	return $l(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var tu = /* @__PURE__ */ new Map();
function nu(e, t) {
	let n = tu.get(t);
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
	}), tu.set(t, n));
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
var ru = 864e5;
function iu(e, t) {
	let n = Ql(e);
	return au(e, t, n - eu(n - ru, t), n - eu(n + ru, t));
}
function au(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => ou(e, t, n));
}
function ou(e, t, n) {
	let r = nu(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function su(e, t, n = "compatible") {
	let r = du(e);
	if (t === "UTC") return Ql(r);
	if (t === Wl() && n === "compatible" && !Gl()) {
		r = fu(r, new kl());
		let e = /* @__PURE__ */ new Date(), t = El(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = Ql(r), a = eu(i - ru, t), o = eu(i + ru, t), s = au(r, t, i - a, i - o);
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
function cu(e, t, n = "compatible") {
	return new Date(su(e, t, n));
}
function lu(e, t) {
	let n = eu(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new ed(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function uu(e) {
	return new Qu(e.calendar, e.era, e.year, e.month, e.day);
}
function du(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new $u(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function fu(e, t) {
	if (Nl(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Su(r), r;
}
function pu(e, t, n) {
	return e instanceof ed ? e.timeZone === t ? e : hu(e, t) : lu(su(e, t, n), t);
}
function mu(e) {
	let t = Ql(e) - e.offset;
	return new Date(t);
}
function hu(e, t) {
	return fu(lu(Ql(e) - e.offset, t), e.calendar);
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/manipulation.mjs
var gu = 36e5;
function _u(e, t) {
	let n = e.copy(), r = "hour" in n ? Au(n, t) : 0;
	vu(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, yu(n), xu(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, bu(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
	let i = n.calendar.getYearsInEra(n);
	if (n.year > i) {
		let e = n.calendar.isInverseEra?.(n);
		n.year = i, n.month = e ? 1 : n.calendar.getMonthsInYear(n), n.day = e ? 1 : n.calendar.getDaysInMonth(n);
	}
	n.month < 1 && (n.month = 1, n.day = 1);
	let a = n.calendar.getMonthsInYear(n);
	return n.month > a && (n.month = a, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function vu(e, t) {
	e.calendar.isInverseEra?.(e) && (t = -t), e.year += t;
}
function yu(e) {
	for (; e.month < 1;) vu(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, vu(e, 1);
}
function bu(e) {
	for (; e.day < 1;) e.month--, yu(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, yu(e);
}
function xu(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function Su(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), xu(e);
}
function Cu(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function wu(e, t) {
	return _u(e, Cu(t));
}
function Tu(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), Su(n), n;
}
function Eu(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Ou(n), n;
}
function Du(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = ku(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = ku(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = ku(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = ku(e.hour, 24), t;
}
function Ou(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 999)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function ku(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function Au(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, Du(e);
}
function ju(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = Nu(a, n, 0, t.length - 1, r?.round), i.era = t[a], Su(i);
			break;
		}
		case "year":
			i.calendar.isInverseEra?.(i) && (n = -n), i.year = Nu(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = Nu(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = Nu(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), Su(i), i;
}
function Mu(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = Nu(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = Nu(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = Nu(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = Nu(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function Nu(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function Pu(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? su(_u(du(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : Ql(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, fu(lu(n, e.timeZone), e.calendar);
}
function Fu(e, t) {
	return Pu(e, Cu(t));
}
function Iu(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = du(e), o = fu(Eu(a, { hour: t }), new kl()), s = [su(o, e.timeZone, "earlier"), su(o, e.timeZone, "later")].filter((t) => lu(t, e.timeZone).day === o.day)[0], c = fu(Eu(a, { hour: i }), new kl()), l = [su(c, e.timeZone, "earlier"), su(c, e.timeZone, "later")].filter((t) => lu(t, e.timeZone).day === c.day).pop(), u = Ql(e) - e.offset, d = Math.floor(u / gu), f = u % gu;
			return u = Nu(d, n, Math.floor(s / gu), Math.floor(l / gu), r?.round) * gu + f, fu(lu(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return Mu(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return fu(lu(su(ju(du(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function Lu(e, t, n) {
	let r = du(e), i = Eu(Tu(r, t), t);
	return i.compare(r) === 0 ? e : fu(lu(su(i, e.timeZone, n), e.timeZone), e.calendar);
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/string.mjs
var Ru = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, zu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Bu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, Vu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function Hu(e) {
	let t = e.match(Ru);
	if (!t) throw Vu.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new Qu(Gu(t[1], 0, 9999), Gu(t[2], 1, 12), 1);
	return n.day = Gu(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Uu(e) {
	let t = e.match(zu);
	if (!t) throw Vu.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = Gu(t[1], -9999, 9999), r = new $u(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, Gu(t[2], 1, 12), 1, t[4] ? Gu(t[4], 0, 23) : 0, t[5] ? Gu(t[5], 0, 59) : 0, t[6] ? Gu(t[6], 0, 59) : 0, t[7] ? Gu(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = Gu(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function Wu(e, t) {
	let n = e.match(Bu);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = Gu(n[1], -9999, 9999), i = new ed(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, Gu(n[2], 1, 12), 1, n[11], 0, n[4] ? Gu(n[4], 0, 23) : 0, n[5] ? Gu(n[5], 0, 59) : 0, n[6] ? Gu(n[6], 0, 59) : 0, n[7] ? Gu(n[7], 0, Infinity) * 1e3 : 0);
	i.day = Gu(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = du(i), o;
	if (n[8]) {
		let e = Gu(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + Gu(n[9] ?? "0", 0, 59) * 6e4 + Gu(n[10] ?? "0", 0, 59) * 1e3), o = Ql(i) - i.offset, !iu(a, i.timeZone).includes(o)) throw Error(`Offset ${Yu(i.offset)} is invalid for ${Ju(i)} in ${i.timeZone}`);
	} else o = su(du(a), i.timeZone, t);
	return lu(o, i.timeZone);
}
function Gu(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function Ku(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function qu(e) {
	let t = fu(e, new kl()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function Ju(e) {
	return `${qu(e)}T${Ku(e)}`;
}
function Yu(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function Xu(e) {
	return `${Ju(e)}${Yu(e.offset)}[${e.timeZone}]`;
}
//#endregion
//#region node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/dist/private/CalendarDate.mjs
function Zu(e) {
	let t = typeof e[0] == "object" ? e.shift() : new kl(), n;
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
var Qu = class e {
	constructor(...e) {
		let [t, n, r, i, a] = Zu(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, Su(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return _u(this, e);
	}
	subtract(e) {
		return wu(this, e);
	}
	set(e) {
		return Tu(this, e);
	}
	cycle(e, t, n) {
		return ju(this, e, t, n);
	}
	toDate(e) {
		return cu(this, e);
	}
	toString() {
		return qu(this);
	}
	compare(e) {
		return zl(this, e);
	}
}, $u = class e {
	constructor(...e) {
		let [t, n, r, i, a] = Zu(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Su(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return _u(this, e);
	}
	subtract(e) {
		return wu(this, e);
	}
	set(e) {
		return Tu(Eu(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return ju(this, e, t, n);
			default: return Mu(this, e, t, n);
		}
	}
	toDate(e, t) {
		return cu(this, e, t);
	}
	toString() {
		return Ju(this);
	}
	compare(e) {
		let t = zl(this, e);
		return t === 0 ? Bl(this, du(e)) : t;
	}
}, ed = class e {
	constructor(...e) {
		let [t, n, r, i, a] = Zu(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Su(this);
	}
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Pu(this, e);
	}
	subtract(e) {
		return Fu(this, e);
	}
	set(e, t) {
		return Lu(this, e, t);
	}
	cycle(e, t, n) {
		return Iu(this, e, t, n);
	}
	toDate() {
		return mu(this);
	}
	toString() {
		return Xu(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - pu(e, this.timeZone).toDate().getTime();
	}
}, td = /* @__PURE__ */ new Map(), nd = class {
	constructor(e, t = {}) {
		this.formatter = id(e, t), this.options = t;
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
		return cd() && (this.resolvedHourCycle ||= ld(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
}, rd = {
	true: { ja: "h11" },
	false: {}
};
function id(e, t = {}) {
	if (typeof t.hour12 == "boolean" && od()) {
		t = { ...t };
		let n = rd[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (td.has(n)) return td.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return td.set(n, r), r;
}
var ad = null;
function od() {
	return ad ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", ad;
}
var sd = null;
function cd() {
	return sd ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", sd;
}
function ld(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = id(e, {
		...t,
		timeZone: void 0
	}), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((e) => e.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((e) => e.type === "hour").value, 10);
	if (r === 0 && i === 23) return "h23";
	if (r === 24 && i === 23) return "h24";
	if (r === 0 && i === 11) return "h11";
	if (r === 12 && i === 11) return "h12";
	throw Error("Unexpected hour cycle result");
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/announcer.js
function ud(e) {
	if (!ys || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!Ss(t)) {
		let r = e.createElement("div");
		r.style.cssText = ko, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!Ss(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return Ss(n) ? n : null;
	} };
}
function dd(e) {
	let t = ud(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !ys || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/utils.js
var fd = {
	defaultValue: void 0,
	granularity: "day"
};
function pd(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...fd,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(Wl()) ? e = r.toDate(Wl()) : i && e > i.toDate(Wl()) && (e = i.toDate(Wl()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new $u(t, a, o, 0, 0, 0) : new Qu(t, a, o);
	}
}
function md(e, t) {
	let n;
	return n = t instanceof ed ? Wu(e) : t instanceof $u ? Uu(e) : Hu(e), n.calendar === t.calendar ? n : fu(n, t.calendar);
}
function hd(e, t = Wl()) {
	return e instanceof ed ? e.toDate() : e.toDate(t);
}
function gd(e) {
	if (e instanceof Qu) return "date";
	if (e instanceof $u) return "datetime";
	if (e instanceof ed) return "zoneddatetime";
	throw Error("Unknown date type");
}
function _d(e, t) {
	switch (t) {
		case "date": return Hu(e);
		case "datetime": return Uu(e);
		case "zoneddatetime": return Wu(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function vd(e) {
	return e instanceof $u;
}
function yd(e) {
	return e instanceof ed;
}
function bd(e) {
	return vd(e) || yd(e);
}
function xd(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function Sd(e, t) {
	return e.compare(t) < 0;
}
function Cd(e, t) {
	return e.compare(t) > 0;
}
function wd(e, t, n) {
	let r = Il(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function Td(e, t, n) {
	let r = Il(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var Ed = [
	"day",
	"month",
	"year"
], Dd = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], Od = ["literal", "timeZoneName"], kd = [...Ed, ...Dd], Ad = [...kd, ...Od], jd = [...Dd, ...Od];
Ad.filter((e) => e !== "literal"), jd.filter((e) => e !== "literal");
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var Md = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), Nd = [
	"year",
	"month",
	"day"
], Pd = {
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
function Fd(e) {
	if (Ld(e)) return Pd[e];
	{
		let t = Vd(e);
		return Ld(t) ? Pd[t] : Pd.en;
	}
}
function Id(e, t, n) {
	return Rd(e) ? Fd(n)[e] : Bd(e) ? t : zd(e) ? "––" : "";
}
function Ld(e) {
	return Md.includes(e);
}
function Rd(e) {
	return Nd.includes(e);
}
function zd(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function Bd(e) {
	return e === "era" || e === "dayPeriod";
}
function Vd(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function Hd(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = kd.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function Ud(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!Yd(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = Ts(i) ? Id(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!Ts(o) && !Ts(c)) {
				let t = n.part(i.set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), l = e.hourCycle === 12 || e.hourCycle === void 0 && cf(r) === 12;
				if (a === "hour" && l) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && t.length === 1 ? `0${t}` : t;
			}
			return Id(a, "", r);
		}
		if (Jd(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (Ts(e)) return Id(a, "", r);
			{
				let t = n.part(i.set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && t.length === 1 ? `0${t}` : t;
			}
		}
		return "";
	}
	return a;
}
function Wd(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, Kd(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !Yd(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(Ts(e.part) || Ts(e.value) || e.part === "timeZoneName" && (!yd(n) || a)));
}
function Gd(e) {
	let t = Ud(e);
	return {
		obj: t,
		arr: Wd({
			contentObj: t,
			...e
		})
	};
}
function Kd(e, t) {
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
function qd() {
	return kd.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function Jd(e) {
	return Ed.includes(e);
}
function Yd(e) {
	return kd.includes(e);
}
function Xd(e) {
	return Ad.includes(e);
}
function Zd(e) {
	return !ys || !e ? [] : mf(e).map((e) => e.dataset.segment).filter((e) => kd.includes(e));
}
var Qd = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function $d(e) {
	let t = Qd.indexOf(e);
	return t === -1 ? Qd.length : t;
}
function ef(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = Zd(n).sort((e, t) => $d(e) - $d(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (Ts(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (Jd(e)) {
		let n = t[e];
		if (Ts(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function tf(e, t) {
	let n = Zd(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (Jd(t) && e[t] === null) return !1;
	return !0;
}
function nf(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (Dd.includes(e) || Ed.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function rf(e, t) {
	return t || (bd(e) ? "minute" : "day");
}
function af(e, t) {
	if (!ys) return !1;
	let n = mf(t);
	return n.length ? n[0].id === e : !1;
}
function of(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!ys) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = To({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function sf(e, t) {
	if (!ys) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function cf(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function lf(e, t) {
	let n = e.currentTarget;
	if (!Ss(n)) return;
	let { prev: r, next: i } = ff(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function uf(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function df(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function ff(e, t) {
	let n = mf(t);
	return n.length ? {
		next: uf(e, n),
		prev: df(e, n)
	} : {
		next: null,
		prev: null
	};
}
function pf(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function mf(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!Ss(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!Xd(t) || t === "literal");
	}) : [];
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/formatter.js
var hf = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function gf(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new nd(t, n).format(e);
	}
	function a(e, t = !0) {
		return bd(e) && t ? i(hd(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(hd(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new nd(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new nd(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new nd(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new nd(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new nd(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return yd(e) ? new nd(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(hd(e)) : new nd(t, n).formatToParts(hd(e));
	}
	function u(e, n = "narrow") {
		return new nd(t, { weekday: n }).format(e);
	}
	function d(e, n = void 0) {
		return new nd(t, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: n === 24 ? "h23" : void 0
		}).formatToParts(e).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...hf,
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
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/date-time/calendar-helpers.svelte.js
function _f(e) {
	return !(!Ss(e) || !e.hasAttribute("data-bits-day"));
}
function vf(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function yf(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = xd(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = Kl(t), c = ql(t), l = n === void 0 ? wd(s, 0, i) : wd(s, n, "en-US"), u = n === void 0 ? Td(c, 0, i) : Td(c, n, "en-US"), d = vf(l.subtract({ days: 1 }), s), f = vf(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
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
		weeks: Pc(m, 7)
	};
}
function bf(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(yf({
		...r,
		dateObj: n
	})), i;
	i.push(yf({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(yf({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function xf(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => Ss(e)) : [];
}
function Sf(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = md(n, t.current));
}
function Cf({ node: e, add: t, placeholder: n, calendarNode: r, isPrevButtonDisabled: i, isNextButtonDisabled: a, months: o, numberOfMonths: s }) {
	let c = xf(r);
	if (!c.length) return;
	let l = c.indexOf(e) + t;
	if (Fc(l, c)) {
		let e = c[l];
		return Sf(e, n), e.focus();
	}
	if (l < 0) {
		if (i) return;
		let e = o[0]?.value;
		if (!e) return;
		n.current = e.subtract({ months: s }), qo(() => {
			let e = xf(r);
			if (!e.length) return;
			let t = e.length - Math.abs(l);
			if (Fc(t, e)) {
				let r = e[t];
				return Sf(r, n), r.focus();
			}
		});
	}
	if (l >= c.length) {
		if (a) return;
		let e = o[0]?.value;
		if (!e) return;
		n.current = e.add({ months: s }), qo(() => {
			let e = xf(r);
			if (!e.length) return;
			let t = l - c.length;
			if (Fc(t, e)) return e[t].focus();
		});
	}
}
var wf = [
	ms,
	_s,
	hs,
	gs
], Tf = [vs, " "];
function Ef({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!_f(i) || !wf.includes(e.key) && !Tf.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[ms]: 7,
		[_s]: -7,
		[hs]: -1,
		[gs]: 1
	};
	if (wf.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (Tf.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, md(n, r));
	}
}
function Df({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = bf({
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
function Of({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = bf({
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
function kf({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(hd(e), n)) : [];
}
function Af(e) {
	L(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		wr(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(bf({
				...o,
				dateObj: a
			}));
		});
	});
}
function jf({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = rs(e), i = r.createElement("div");
	i.style.cssText = To({
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
function Mf({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	L(() => {
		e.current, wr(() => {
			t().some((t) => Ml(t, e.current)) || o(bf({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function Nf({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? Cd(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function Pf({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? Sd(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function Ff({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = hd(e[0].value);
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = hd(e[0].value), i = hd(e[e.length - 1].value), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function If({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": Q(n),
		"data-disabled": Q(r),
		"data-readonly": Q(i)
	};
}
function Lf(e) {
	let t = rs(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function Rf(e) {
	if (!ys) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return _d(r, i);
}
function zf({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && Sd(e, r.current) || i.current && Sd(i.current, e));
	}
	Vo(() => e.current, () => {
		e.current && t.current && jl(t.current, n) && o(n) && (t.current = Rf(e.current) ?? n);
	});
}
function Bf(e, t) {
	return !e || !t ? e : bd(e) && bd(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var Vf = ps({
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
function Hf(e) {
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
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/calendar.svelte.js
var Uf = new Ro("Calendar.Root | RangeCalender.Root"), Wf = class e {
	static create(t) {
		return Uf.set(new e(t));
	}
	opts;
	#e = /* @__PURE__ */ A(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return V(this.#e);
	}
	set visibleMonths(e) {
		N(this.#e, e);
	}
	formatter;
	accessibleHeadingId = rl();
	domContext;
	attachment;
	#t = /* @__PURE__ */ M(on([]));
	get months() {
		return V(this.#t);
	}
	set months(e) {
		N(this.#t, e, !0);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = ss(this.opts.ref), this.domContext = new os(e.ref), this.announcer = dd(null), this.formatter = gf({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), di(() => {
			this.announcer = dd(this.domContext.getDocument());
		}), this.months = bf({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#a(), this.#o(), this.#s(), Mf({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), Af({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), Vo(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), Vo(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), zf({
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
	#n = /* @__PURE__ */ A(() => kf({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return V(this.#n);
	}
	set weekdays(e) {
		N(this.#n, e);
	}
	#r = /* @__PURE__ */ A(() => wr(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return V(this.#r);
	}
	set initialPlaceholderYear(e) {
		N(this.#r, e);
	}
	#i = /* @__PURE__ */ A(() => Hf({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return V(this.#i);
	}
	set defaultYears(e) {
		N(this.#i, e);
	}
	#a() {
		L(() => {
			if (wr(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#o() {
		L(() => {
			if (this.opts.ref.current) return jf({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#s() {
		An(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		Df({
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
		Of({
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
	#c = /* @__PURE__ */ A(() => Nf({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return V(this.#c);
	}
	set isNextButtonDisabled(e) {
		N(this.#c, e);
	}
	#l = /* @__PURE__ */ A(() => Pf({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return V(this.#l);
	}
	set isPrevButtonDisabled(e) {
		N(this.#l, e);
	}
	#u = /* @__PURE__ */ A(() => {
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
		return V(this.#u);
	}
	set isInvalid(e) {
		N(this.#u, e);
	}
	#d = /* @__PURE__ */ A(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, Ff({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return V(this.#d);
	}
	set headingValue(e) {
		N(this.#d, e);
	}
	#f = /* @__PURE__ */ A(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return V(this.#f);
	}
	set fullCalendarLabel(e) {
		N(this.#f, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => Ml(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && Sd(e, t) || n && Sd(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => jl(t, e)) : t ? jl(t, e) : !1;
	}
	shiftFocus(e, t) {
		return Cf({
			node: e,
			add: t,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current
		});
	}
	#p(e) {
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
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = Bf(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#p(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => jl(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#p(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !jl(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && jl(e, t)) {
			this.opts.placeholder.current = t;
			return;
		}
		return t;
	}
	onkeydown(e) {
		Ef({
			event: e,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#m = /* @__PURE__ */ A(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return V(this.#m);
	}
	set snippetProps(e) {
		N(this.#m, e);
	}
	getBitsAttr = (e) => Vf.getAttr(e);
	#h = /* @__PURE__ */ A(() => ({
		...If({
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
		return V(this.#h);
	}
	set props(e) {
		N(this.#h, e);
	}
}, Gf = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		"aria-hidden": ls(!0),
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
}, Kf = new Ro("Calendar.Cell | RangeCalendar.Cell"), qf = class e {
	static create(t) {
		return Kf.set(new e(t, Uf.get()));
	}
	opts;
	root;
	#e = /* @__PURE__ */ A(() => hd(this.opts.date.current));
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
	#n = /* @__PURE__ */ A(() => Pl(this.opts.date.current, Wl()));
	get isDateToday() {
		return V(this.#n);
	}
	set isDateToday(e) {
		N(this.#n, e);
	}
	#r = /* @__PURE__ */ A(() => !Ml(this.opts.date.current, this.opts.month.current));
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
	#o = /* @__PURE__ */ A(() => jl(this.opts.date.current, this.root.opts.placeholder.current));
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
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
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
		"data-type": gd(this.opts.date.current),
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
		"aria-selected": cs(this.isSelectedDate),
		"aria-disabled": cs(this.ariaDisabled),
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
}, Jf = class e {
	static create(t) {
		return new e(t, Kf.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = ss(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
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
		"aria-disabled": cs(this.cell.ariaDisabled),
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
}, Yf = class e {
	static create(t) {
		return new e(t, Uf.get());
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
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ss(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": cs(this.isDisabled),
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
}, Xf = class e {
	static create(t) {
		return new e(t, Uf.get());
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
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ss(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": cs(this.isDisabled),
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
}, Zf = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
	}
	#e = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": cs(this.root.opts.readonly.current),
		"aria-disabled": cs(this.root.opts.disabled.current),
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
}, Qf = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
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
}, $f = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
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
}, ep = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
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
}, tp = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
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
}, np = class e {
	static create(t) {
		return new e(t, Uf.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref);
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
}, rp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), ip = /* @__PURE__ */ H("<div><!></div>");
function ap(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, rp), o = Jf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U(), r = F(n);
		{
			let e = /* @__PURE__ */ A(() => ({
				props: V(s),
				...o.snippetProps
			}));
			G(r, () => t.child, () => V(e));
		}
		W(e, n);
	}, d = (e) => {
		var n = ip();
		q(n, () => ({ ...V(s) }));
		var r = P(n), i = (e) => {
			var n = U();
			G(F(n), () => t.children ?? g, () => o.snippetProps), W(e, n);
		}, a = (e) => {
			var t = Wr();
			R(() => ii(t, o.cell.opts.date.current.day)), W(e, t);
		};
		K(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var op = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), sp = /* @__PURE__ */ H("<table><!></table>");
function cp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, op), o = Zf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = sp();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var lp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), up = /* @__PURE__ */ H("<tbody><!></tbody>");
function dp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, lp), o = Qf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = up();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var fp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), pp = /* @__PURE__ */ H("<td><!></td>");
function mp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, fp), o = qf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		date: X(() => t.date),
		month: X(() => t.month)
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U(), r = F(n);
		{
			let e = /* @__PURE__ */ A(() => ({
				props: V(s),
				...o.snippetProps
			}));
			G(r, () => t.child, () => V(e));
		}
		W(e, n);
	}, d = (e) => {
		var n = pp();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g, () => o.snippetProps), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var hp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), gp = /* @__PURE__ */ H("<thead><!></thead>");
function _p(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, hp), o = $f.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = gp();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var vp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), yp = /* @__PURE__ */ H("<th><!></th>");
function bp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, vp), o = tp.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = yp();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var xp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Sp = /* @__PURE__ */ H("<tr><!></tr>");
function Cp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, xp), o = ep.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = Sp();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var wp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Tp = /* @__PURE__ */ H("<header><!></header>");
function Ep(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, wp), o = np.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(s) })), W(e, n);
	}, d = (e) => {
		var n = Tp();
		q(n, () => ({ ...V(s) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var Dp = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Op = /* @__PURE__ */ H("<div><!></div>");
function kp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = /* @__PURE__ */ J(t, Dp), o = Gf.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e))
	}), s = /* @__PURE__ */ A(() => Z(a, o.props));
	var c = U(), l = F(c), u = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({
			props: V(s),
			headingValue: o.root.headingValue
		})), W(e, n);
	}, d = (e) => {
		var n = Op();
		q(n, () => ({ ...V(s) }));
		var r = P(n), i = (e) => {
			var n = U();
			G(F(n), () => t.children ?? g, () => ({ headingValue: o.root.headingValue })), W(e, n);
		}, a = (e) => {
			var t = Wr();
			R(() => ii(t, o.root.headingValue)), W(e, t);
		};
		K(r, (e) => {
			t.children ? e(i) : e(a, -1);
		}), D(n), W(e, n);
	};
	K(l, (e) => {
		t.child ? e(u) : e(d, -1);
	}), W(e, c), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var Ap = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), jp = /* @__PURE__ */ H("<button><!></button>");
function Mp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ J(t, Ap), s = Yf.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props, { tabindex: a() }));
	var l = U(), u = F(l), d = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(c) })), W(e, n);
	}, f = (e) => {
		var n = jp();
		q(n, () => ({ ...V(c) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var Np = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), Pp = /* @__PURE__ */ H("<button><!></button>");
function Fp(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = Y(t, "tabindex", 3, 0), o = /* @__PURE__ */ J(t, Np), s = Xf.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), c = /* @__PURE__ */ A(() => Z(o, s.props, { tabindex: a() }));
	var l = U(), u = F(l), d = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({ props: V(c) })), W(e, n);
	}, f = (e) => {
		var n = Pp();
		q(n, () => ({ ...V(c) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
	};
	K(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
var Ip = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"value"
]), Lp = /* @__PURE__ */ H("<input/>");
function Rp(e, t) {
	O(t, !0);
	let n = Y(t, "value", 15), r = /* @__PURE__ */ J(t, Ip), i = /* @__PURE__ */ A(() => Z(r, {
		"aria-hidden": "true",
		tabindex: -1,
		style: {
			...Oo,
			position: "absolute",
			top: "0",
			left: "0"
		}
	}));
	var a = U(), o = F(a), s = (e) => {
		var t = Lp();
		q(t, () => ({
			...V(i),
			value: n()
		}), void 0, void 0, void 0, void 0, !0), W(e, t);
	}, c = (e) => {
		var t = Lp();
		q(t, () => ({ ...V(i) }), void 0, void 0, void 0, void 0, !0), oa(t, n), W(e, t);
	};
	K(o, (e) => {
		V(i).type === "checkbox" ? e(s) : e(c, -1);
	}), W(e, a), k();
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var zp = [
	"top",
	"right",
	"bottom",
	"left"
], Bp = Math.min, Vp = Math.max, Hp = Math.round, Up = Math.floor, Wp = (e) => ({
	x: e,
	y: e
}), Gp = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function Kp(e, t, n) {
	return Vp(e, Bp(t, n));
}
function qp(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Jp(e) {
	return e.split("-")[0];
}
function Yp(e) {
	return e.split("-")[1];
}
function Xp(e) {
	return e === "x" ? "y" : "x";
}
function Zp(e) {
	return e === "y" ? "height" : "width";
}
function Qp(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function $p(e) {
	return Xp(Qp(e));
}
function em(e, t, n) {
	n === void 0 && (n = !1);
	let r = Yp(e), i = $p(e), a = Zp(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = lm(o)), [o, lm(o)];
}
function tm(e) {
	let t = lm(e);
	return [
		nm(e),
		t,
		nm(t)
	];
}
function nm(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var rm = ["left", "right"], im = ["right", "left"], am = ["top", "bottom"], om = ["bottom", "top"];
function sm(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? im : rm : t ? rm : im;
		case "left":
		case "right": return t ? am : om;
		default: return [];
	}
}
function cm(e, t, n, r) {
	let i = Yp(e), a = sm(Jp(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(nm)))), a;
}
function lm(e) {
	let t = Jp(e);
	return Gp[t] + e.slice(t.length);
}
function um(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function dm(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : um(e);
}
function fm(e) {
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
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function pm(e, t, n) {
	let { reference: r, floating: i } = e, a = Qp(t), o = $p(t), s = Zp(o), c = Jp(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
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
	let m = Yp(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function mm(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = qp(t, e), p = dm(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = fm(await i.getClippingRect({
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
	}, y = fm(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
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
var hm = 50, gm = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: mm
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = pm(l, r, c), f = r, p = 0, m = {};
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
		}, x && p < hm && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = pm(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, _m = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = qp(e, t) || {};
		if (l == null) return {};
		let d = dm(u), f = {
			x: n,
			y: r
		}, p = $p(i), m = Zp(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		(!C || !await (o.isElement == null ? void 0 : o.isElement(S))) && (C = s.floating[y] || a.floating[m]);
		let w = b / 2 - x / 2, ee = C / 2 - h[m] / 2 - 1, te = Bp(d[_], ee), ne = Bp(d[v], ee), re = C - h[m] - ne, ie = C / 2 - h[m] / 2 + w, ae = Kp(te, ie, re), oe = !c.arrow && Yp(i) != null && ie !== ae && a.reference[m] / 2 - (ie < te ? te : ne) - h[m] / 2 < 0, se = oe ? ie < te ? ie - te : ie - re : 0;
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
}), vm = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = qp(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = Jp(r), _ = Qp(o), v = Jp(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [lm(o)] : tm(o)), x = p !== "none";
			!d && x && b.push(...cm(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], ee = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = em(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (ee = [...ee, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === Qp(t) || ee.every((e) => Qp(e.placement) !== _ || e.overflows[0] > 0))) return {
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
								let t = Qp(e.placement);
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
function ym(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function bm(e) {
	return zp.some((t) => e[t] >= 0);
}
var xm = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = qp(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = ym(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: bm(e)
					} };
				}
				case "escaped": {
					let e = ym(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: bm(e)
					} };
				}
				default: return {};
			}
		}
	};
}, Sm = /*#__PURE__*/ new Set(["left", "top"]);
async function Cm(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Jp(n), s = Yp(n), c = Qp(n) === "y", l = Sm.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = qp(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
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
var wm = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Cm(t, e);
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
}, Tm = function(e) {
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
			} }, ...l } = qp(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Qp(i), p = Xp(f), m = u[p], h = u[f], g = (e, t) => Kp(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
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
}, Em = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = qp(e, t), u = {
				x: n,
				y: r
			}, d = Qp(i), f = Xp(d), p = u[f], m = u[d], h = qp(s, t), g = typeof h == "number" ? {
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
				let e = f === "y" ? "width" : "height", t = Sm.has(Jp(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, Dm = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = qp(e, t), c = await i.detectOverflow(t, s), l = Jp(n), u = Yp(n), d = Qp(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = Bp(p - c[m], g), y = Bp(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * Vp(c.left, c.right) : S = p - 2 * Vp(c.top, c.bottom)), await o({
				...t,
				availableWidth: C,
				availableHeight: S
			});
			let w = await i.getDimensions(a.floating);
			return f !== w.width || p !== w.height ? { reset: { rects: !0 } } : {};
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function Om() {
	return typeof window < "u";
}
function km(e) {
	return Mm(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Am(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function jm(e) {
	return ((Mm(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Mm(e) {
	return Om() ? e instanceof Node || e instanceof Am(e).Node : !1;
}
function Nm(e) {
	return Om() ? e instanceof Element || e instanceof Am(e).Element : !1;
}
function Pm(e) {
	return Om() ? e instanceof HTMLElement || e instanceof Am(e).HTMLElement : !1;
}
function Fm(e) {
	return !Om() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Am(e).ShadowRoot;
}
function Im(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = qm(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function Lm(e) {
	return /^(table|td|th)$/.test(km(e));
}
function Rm(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var zm = /transform|translate|scale|rotate|perspective|filter/, Bm = /paint|layout|strict|content/, Vm = (e) => !!e && e !== "none", Hm;
function Um(e) {
	let t = Nm(e) ? qm(e) : e;
	return Vm(t.transform) || Vm(t.translate) || Vm(t.scale) || Vm(t.rotate) || Vm(t.perspective) || !Gm() && (Vm(t.backdropFilter) || Vm(t.filter)) || zm.test(t.willChange || "") || Bm.test(t.contain || "");
}
function Wm(e) {
	let t = Ym(e);
	for (; Pm(t) && !Km(t);) {
		if (Um(t)) return t;
		if (Rm(t)) return null;
		t = Ym(t);
	}
	return null;
}
function Gm() {
	return Hm ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), Hm;
}
function Km(e) {
	return /^(html|body|#document)$/.test(km(e));
}
function qm(e) {
	return Am(e).getComputedStyle(e);
}
function Jm(e) {
	return Nm(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function Ym(e) {
	if (km(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || Fm(e) && e.host || jm(e);
	return Fm(t) ? t.host : t;
}
function Xm(e) {
	let t = Ym(e);
	return Km(t) ? (e.ownerDocument || e).body : Pm(t) && Im(t) ? t : Xm(t);
}
function Zm(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Xm(e), i = r === e.ownerDocument?.body, a = Am(r);
	if (i) {
		let e = Qm(a);
		return t.concat(a, a.visualViewport || [], Im(r) ? r : [], e && n ? Zm(e) : []);
	}
	return t.concat(r, Zm(r, [], n));
}
function Qm(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function $m(e) {
	let t = qm(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = Pm(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = Hp(n) !== a || Hp(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function eh(e) {
	return Nm(e) ? e : e.contextElement;
}
function th(e) {
	let t = eh(e);
	if (!Pm(t)) return Wp(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = $m(t), o = (a ? Hp(n.width) : n.width) / r, s = (a ? Hp(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var nh = /*#__PURE__*/ Wp(0);
function rh(e) {
	let t = Am(e);
	return !Gm() || !t.visualViewport ? nh : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function ih(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === Am(e);
}
function ah(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = eh(e), o = Wp(1);
	t && (r ? Nm(r) && (o = th(r)) : o = th(e));
	let s = ih(a, n, r) ? rh(a) : Wp(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = Am(a), t = Nm(r) ? Am(r) : r, n = e, i = Qm(n);
		for (; i && t !== n;) {
			let e = th(i), t = i.getBoundingClientRect(), r = qm(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = Am(i), i = Qm(n);
		}
	}
	return fm({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function oh(e, t) {
	let n = Jm(e).scrollLeft;
	return t ? t.left + n : ah(jm(e)).left + n;
}
function sh(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - oh(e, n),
		y: n.top + t.scrollTop
	};
}
function ch(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = jm(r), s = t ? Rm(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = Wp(1), u = Wp(0), d = Pm(r);
	if ((d || !a) && ((km(r) !== "body" || Im(o)) && (c = Jm(r)), d)) {
		let e = ah(r);
		l = th(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? sh(o, c) : Wp(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function lh(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function uh(e) {
	let t = Jm(e), n = e.ownerDocument.body, r = Vp(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Vp(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + oh(e), o = -t.scrollTop;
	return qm(n).direction === "rtl" && (a += Vp(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var dh = 25;
function fh(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = Am(e), a = jm(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !Gm() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (oh(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= dh && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function ph(e, t) {
	let n = ah(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = th(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function mh(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = fh(e, n, t);
	else if (t === "document") r = uh(jm(e));
	else if (Nm(t)) r = ph(t, n);
	else {
		let n = rh(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return fm(r);
}
function hh(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = Zm(e, [], !1).filter((e) => Nm(e) && km(e) !== "body"), i = null, a = qm(e).position === "fixed", o = a ? Ym(e) : e;
	for (; Nm(o) && !Km(o);) {
		let e = qm(o), t = Um(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = Ym(o);
	}
	return t.set(e, r), r;
}
function gh(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? Rm(t) ? [] : hh(t, this._c) : [].concat(n), r], o = mh(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = mh(t, a[e], i);
		s = Vp(n.top, s), c = Bp(n.right, c), l = Bp(n.bottom, l), u = Vp(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function _h(e) {
	let { width: t, height: n } = $m(e);
	return {
		width: t,
		height: n
	};
}
function vh(e, t, n) {
	let r = Pm(t), i = jm(t), a = n === "fixed", o = ah(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = Wp(0);
	if ((r || !a) && ((km(t) !== "body" || Im(i)) && (s = Jm(t)), r)) {
		let e = ah(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = oh(i));
	let l = i && !r && !a ? sh(i, s) : Wp(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function yh(e) {
	return qm(e).position === "static";
}
function bh(e, t) {
	if (!Pm(e) || qm(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return jm(e) === n && (n = n.ownerDocument.body), n;
}
function xh(e, t) {
	let n = Am(e);
	if (Rm(e)) return n;
	if (!Pm(e)) {
		let t = Ym(e);
		for (; t && !Km(t);) {
			if (Nm(t) && !yh(t)) return t;
			t = Ym(t);
		}
		return n;
	}
	let r = bh(e, t);
	for (; r && Lm(r) && yh(r);) r = bh(r, t);
	return r && Km(r) && yh(r) && !Um(r) ? n : r || Wm(e) || n;
}
var Sh = async function(e) {
	let t = this.getOffsetParent || xh, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: vh(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Ch(e) {
	return qm(e).direction === "rtl";
}
var wh = {
	convertOffsetParentRelativeRectToViewportRelativeRect: ch,
	getDocumentElement: jm,
	getClippingRect: gh,
	getOffsetParent: xh,
	getElementRects: Sh,
	getClientRects: lh,
	getDimensions: _h,
	getScale: th,
	isElement: Nm,
	isRTL: Ch
};
function Th(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Eh(e, t, n) {
	let r = null, i, a = jm(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = Up(d), h = Up(a.clientWidth - (u + f)), g = Up(a.clientHeight - (d + p)), _ = Up(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: Vp(0, Bp(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!Th(l, e.getBoundingClientRect())) return s();
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
	let c = Am(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function Dh(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = eh(e), u = i || a ? [...l ? Zm(l) : [], ...t ? Zm(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Eh(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? ah(e) : null;
	c && g();
	function g() {
		let t = ah(e);
		h && !Th(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var Oh = wm, kh = Tm, Ah = vm, jh = Dm, Mh = xm, Nh = _m, Ph = Em, Fh = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...wh,
		...i.platform,
		_c: r
	};
	return gm(e, t, {
		...i,
		platform: a
	});
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function Ih(e) {
	return typeof e == "function" ? e() : e;
}
function Lh(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Rh(e, t) {
	let n = Lh(e);
	return Math.round(t * n) / n;
}
function zh(e) {
	return {
		[`--bits-${e}-content-transform-origin`]: "var(--bits-floating-transform-origin)",
		[`--bits-${e}-content-available-width`]: "var(--bits-floating-available-width)",
		[`--bits-${e}-content-available-height`]: "var(--bits-floating-available-height)",
		[`--bits-${e}-anchor-width`]: "var(--bits-floating-anchor-width)",
		[`--bits-${e}-anchor-height`]: "var(--bits-floating-anchor-height)"
	};
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function Bh(e) {
	let t = e.whileElementsMounted, n = /* @__PURE__ */ A(() => Ih(e.open) ?? !0), r = /* @__PURE__ */ A(() => Ih(e.middleware)), i = /* @__PURE__ */ A(() => Ih(e.transform) ?? !0), a = /* @__PURE__ */ A(() => Ih(e.placement) ?? "bottom"), o = /* @__PURE__ */ A(() => Ih(e.strategy) ?? "absolute"), s = /* @__PURE__ */ A(() => Ih(e.sideOffset) ?? 0), c = /* @__PURE__ */ A(() => Ih(e.alignOffset) ?? 0), l = e.reference, u = /* @__PURE__ */ M(0), d = /* @__PURE__ */ M(0), f = Ka(null), p = /* @__PURE__ */ M(on(V(o))), m = /* @__PURE__ */ M(on(V(a))), h = /* @__PURE__ */ M(on({})), g = /* @__PURE__ */ M(!1), _ = !1, v = 0, y = /* @__PURE__ */ A(() => {
		let e = f.current ? Rh(f.current, V(u)) : V(u), t = f.current ? Rh(f.current, V(d)) : V(d);
		return V(i) ? {
			position: V(p),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...f.current && Lh(f.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: V(p),
			left: `${e}px`,
			top: `${t}px`
		};
	}), b;
	function x() {
		if (l.current === null || f.current === null) return;
		let e = l.current, t = f.current, i = ++v;
		Fh(e, t, {
			middleware: V(r),
			placement: V(a),
			strategy: V(o)
		}).then((r) => {
			if (i === v && l.current === e && f.current === t) {
				if (Vh(e)) {
					N(h, {
						...V(h),
						hide: {
							...V(h).hide,
							referenceHidden: !0
						}
					}, !0);
					return;
				}
				if (!V(n) && V(u) !== 0 && V(d) !== 0) {
					let e = Math.max(Math.abs(V(s)), Math.abs(V(c)), 15);
					if (r.x <= e && r.y <= e) return;
				}
				N(u, r.x, !0), N(d, r.y, !0), N(p, r.strategy, !0), N(m, r.placement, !0), N(h, r.middlewareData, !0), N(g, !0);
			}
		});
	}
	function S() {
		typeof b == "function" && (b(), b = void 0), v++;
	}
	function C() {
		if (S(), t === void 0) {
			x();
			return;
		}
		V(n) && l.current !== null && f.current !== null && (b = t(l.current, f.current, x));
	}
	function w() {
		!V(n) && f.current === null && N(g, !1);
	}
	function ee() {
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
		t === void 0 && V(n) && x();
	}), L(C), L(() => {
		if (t !== void 0) {
			if (ee(), !V(n)) {
				_ = !1;
				return;
			}
			if (!V(g)) {
				_ = !1;
				return;
			}
			if (!_) {
				_ = !0;
				return;
			}
			x();
		}
	}), L(w), L(() => S), {
		floating: f,
		reference: l,
		get strategy() {
			return V(p);
		},
		get placement() {
			return V(m);
		},
		get middlewareData() {
			return V(h);
		},
		get isPositioned() {
			return V(g);
		},
		get floatingStyles() {
			return V(y);
		},
		get update() {
			return x;
		}
	};
}
function Vh(e) {
	return e instanceof Element ? !e.isConnected || e instanceof HTMLElement && e.hidden ? !0 : e.getClientRects().length === 0 : !1;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var Hh = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, Uh = new Ro("Floating.Root"), Wh = new Ro("Floating.Content"), Gh = new Ro("Floating.Root"), Kh = class e {
	static create(t = !1) {
		return t ? Gh.set(new e()) : Uh.set(new e());
	}
	anchorNode = Ka(null);
	customAnchorNode = Ka(null);
	triggerNode = Ka(null);
	constructor() {
		L(() => {
			this.customAnchorNode.current ? typeof this.customAnchorNode.current == "string" ? this.anchorNode.current = document.querySelector(this.customAnchorNode.current) : this.anchorNode.current = this.customAnchorNode.current : this.anchorNode.current = this.triggerNode.current;
		});
	}
}, qh = class e {
	static create(t, n = !1) {
		return n ? Wh.set(new e(t, Gh.get())) : Wh.set(new e(t, Uh.get()));
	}
	opts;
	root;
	contentRef = Ka(null);
	wrapperRef = Ka(null);
	arrowRef = Ka(null);
	contentAttachment = ss(this.contentRef);
	wrapperAttachment = ss(this.wrapperRef);
	arrowAttachment = ss(this.arrowRef);
	arrowId = Ka(rl());
	#e = /* @__PURE__ */ A(() => {
		if (typeof this.opts.style == "string") return bo(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new Wo(() => this.arrowRef.current ?? void 0);
	#r = /* @__PURE__ */ A(() => this.#n?.width ?? 0);
	#i = /* @__PURE__ */ A(() => this.#n?.height ?? 0);
	#a = /* @__PURE__ */ A(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = /* @__PURE__ */ A(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#s = /* @__PURE__ */ A(() => V(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return V(this.#s);
	}
	set hasExplicitBoundaries(e) {
		N(this.#s, e);
	}
	#c = /* @__PURE__ */ A(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: V(this.#o).filter(Ds),
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
		Oh({
			mainAxis: this.opts.sideOffset.current + V(this.#i),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && kh({
			mainAxis: !0,
			crossAxis: !1,
			limiter: this.opts.sticky.current === "partial" ? Ph() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && Ah({ ...this.detectOverflowOptions }),
		jh({
			...this.detectOverflowOptions,
			apply: ({ rects: e, availableWidth: t, availableHeight: n }) => {
				let { width: r, height: i } = e.reference;
				N(this.#l, t, !0), N(this.#u, n, !0), N(this.#d, r, !0), N(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && Nh({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		Yh({
			arrowWidth: V(this.#r),
			arrowHeight: V(this.#i)
		}),
		this.opts.hideWhenDetached.current && Mh({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return V(this.#p);
	}
	set middleware(e) {
		N(this.#p, e);
	}
	floating;
	#m = /* @__PURE__ */ A(() => Zh(this.floating.placement));
	get placedSide() {
		return V(this.#m);
	}
	set placedSide(e) {
		N(this.#m, e);
	}
	#h = /* @__PURE__ */ A(() => Qh(this.floating.placement));
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
	#y = /* @__PURE__ */ M();
	get contentZIndex() {
		return V(this.#y);
	}
	set contentZIndex(e) {
		N(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ A(() => Hh[this.placedSide]);
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
			...this.floating.middlewareData.hide?.referenceHidden && {
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
		style: To({ ...V(this.#e) }),
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
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), Vo(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = Bh({
			strategy: () => this.opts.strategy.current,
			placement: () => V(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => Dh(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), L(() => {
			this.floating.isPositioned && this.opts.onPlaced?.current();
		}), Vo(() => this.contentRef.current, (e) => {
			if (!e || !this.opts.enabled.current) return;
			let t = is(e), n = t.requestAnimationFrame(() => {
				if (this.contentRef.current !== e || !this.opts.enabled.current) return;
				let n = t.getComputedStyle(e).zIndex;
				n !== this.contentZIndex && (this.contentZIndex = n);
			});
			return () => {
				t.cancelAnimationFrame(n);
			};
		}), L(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}
}, Jh = class e {
	static create(t, n = !1) {
		return n ? new e(t, Gh.get()) : new e(t, Uh.get());
	}
	opts;
	root;
	constructor(e, t) {
		this.opts = e, this.root = t, t.triggerNode = e.virtualEl && e.virtualEl.current ? Ga(e.virtualEl.current) : e.ref;
	}
};
function Yh(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = Xh(n), u = {
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
function Xh(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
function Zh(e) {
	return Xh(e)[0];
}
function Qh(e) {
	return Xh(e)[1];
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function $h(e, t) {
	O(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	Kh.create(n());
	var r = U();
	G(F(r), () => t.children ?? g), W(e, r), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
function eg(e, t) {
	O(t, !0);
	let n = Y(t, "tooltip", 3, !1);
	Jh.create({
		id: X(() => t.id),
		virtualEl: X(() => t.virtualEl),
		ref: t.ref
	}, n());
	var r = U();
	G(F(r), () => t.children ?? g), W(e, r), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
function tg(e, t) {
	O(t, !0);
	let n = Y(t, "side", 3, "bottom"), r = Y(t, "sideOffset", 3, 0), i = Y(t, "align", 3, "center"), a = Y(t, "alignOffset", 3, 0), o = Y(t, "arrowPadding", 3, 0), s = Y(t, "avoidCollisions", 3, !0), c = Y(t, "collisionBoundary", 19, () => []), l = Y(t, "collisionPadding", 3, 0), u = Y(t, "hideWhenDetached", 3, !1), d = Y(t, "onPlaced", 3, () => {}), f = Y(t, "sticky", 3, "partial"), p = Y(t, "updatePositionStrategy", 3, "optimized"), m = Y(t, "strategy", 3, "fixed"), h = Y(t, "dir", 3, "ltr"), _ = Y(t, "style", 19, () => ({})), v = Y(t, "wrapperId", 19, rl), y = Y(t, "customAnchor", 3, null), b = Y(t, "tooltip", 3, !1), x = qh.create({
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
	}, b()), S = /* @__PURE__ */ A(() => Z(x.wrapperProps, { style: { pointerEvents: "auto" } }));
	var C = U();
	G(F(C), () => t.content ?? g, () => ({
		props: x.props,
		wrapperProps: V(S)
	})), W(e, C), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function ng(e, t) {
	O(t, !0), di(() => {
		t.onPlaced?.();
	});
	var n = U();
	G(F(n), () => t.content ?? g, () => ({
		props: {},
		wrapperProps: {}
	})), W(e, n), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
var rg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"content",
	"isStatic",
	"onPlaced"
]);
function ig(e, t) {
	let n = Y(t, "isStatic", 3, !1), r = /* @__PURE__ */ J(t, rg);
	var i = U(), a = F(i), o = (e) => {
		ng(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, s = (e) => {
		tg(e, ya({
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		}, () => r));
	};
	K(a, (e) => {
		n() ? e(o) : e(s, -1);
	}), W(e, i);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var ag = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.ref.tooltip.contentPointerEvents".split(".")), og = /* @__PURE__ */ H("<!> <!>", 1);
function sg(e, t) {
	O(t, !0);
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = Y(t, "tooltip", 3, !1), c = Y(t, "contentPointerEvents", 3, "auto"), l = /* @__PURE__ */ J(t, ag), u = /* @__PURE__ */ A(() => t.preventScroll ?? !0), d = /* @__PURE__ */ A(() => t.strategy ?? (V(u) ? "fixed" : "absolute"));
	ig(e, {
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
			var d = og(), f = F(d), p = (e) => {
				hl(e, { get preventScroll() {
					return V(u);
				} });
			}, m = (e) => {
				hl(e, { get preventScroll() {
					return V(u);
				} });
			};
			K(f, (e) => {
				t.forceMount && t.enabled ? e(p) : t.forceMount || e(m, 1);
			}), Yc(I(f, 2), {
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
					Kc(e, {
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
							Uc(e, {
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
									nl(e, {
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
											var i = U(), u = F(i);
											{
												let e = /* @__PURE__ */ A(() => ({
													props: Z(l, o(), r(), a(), {
														id: t.id,
														style: { pointerEvents: c() }
													}),
													wrapperProps: s()
												}));
												G(u, () => t.popper ?? g, () => V(e));
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
	}), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var cg = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function lg(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ J(t, cg);
	var c = U(), l = F(c), u = (e) => {
		sg(e, ya({
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
	K(l, (e) => {
		t.shouldRender && e(u);
	}), W(e, c);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var ug = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function dg(e, t) {
	let n = Y(t, "interactOutsideBehavior", 3, "close"), r = Y(t, "trapFocus", 3, !0), i = Y(t, "isValidEvent", 3, () => !1), a = Y(t, "customAnchor", 3, null), o = Y(t, "isStatic", 3, !1), s = /* @__PURE__ */ J(t, ug);
	sg(e, ya({
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
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var fg = ps({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), pg = new Ro("DateField.Root"), mg = class e {
	static create(t, n) {
		return pg.set(new e(t, n));
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
	descriptionId = rl();
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
	segmentStates = qd();
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
	states = qd();
	#o = !1;
	#s = /* @__PURE__ */ M(null);
	get dayPeriodNode() {
		return V(this.#s);
	}
	set dayPeriodNode(e) {
		N(this.#s, e, !0);
	}
	rangeRoot = void 0;
	#c = /* @__PURE__ */ M("");
	get name() {
		return V(this.#c);
	}
	set name(e) {
		N(this.#c, e, !0);
	}
	domContext = new os(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? Ka(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = gf({
			initialLocale: this.locale.current,
			monthFormat: X(() => "long"),
			yearFormat: X(() => "numeric")
		}), this.initialSegments = Hd(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = dd(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), L(() => {
			wr(() => {
				this.initialSegments = Hd(this.inferredGranularity);
			});
		}), di(() => {
			this.announcer = dd(this.domContext.getDocument());
		}), Go(() => {
			t || sf(this.descriptionId, this.domContext.getDocument());
		}), L(() => {
			t || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), L(() => {
			if (t) return;
			this.value.current && of({
				id: wr(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = wr(() => this.placeholder.current);
			this.value.current && e !== this.value.current && wr(() => {
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
				this.segmentValues = Hd(this.inferredGranularity);
			}
		}), Vo(() => this.validationStatus, () => {
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
		let t = Ed.map((t) => {
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
			let n = Dd.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(hd(e))];
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
			return;
		}
		this.segmentValues = Object.fromEntries(t);
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
		if (n && Sd(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && Sd(r, e) ? { reason: "max" } : !1;
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
	#f = /* @__PURE__ */ A(() => this.granularity.current || rf(this.placeholder.current, this.granularity.current));
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
	#m = /* @__PURE__ */ A(() => Gd({
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
		if (nf(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = xd(hd(s.set({ month: Number.parseInt(t) })));
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
				let t = r(n);
				if (this.states.hour.updating = t, t !== null && a.dayPeriod !== null) {
					let e = this.formatter.dayPeriod(hd(s.set({ hour: Number.parseInt(t) })), this.hourCycle.current);
					(e === "AM" || e === "PM") && (a.dayPeriod = e);
				}
				o = {
					...a,
					[e]: t
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
		} else if (Jd(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = xd(hd(s.set({ month: Number.parseInt(i) })));
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
		this.segmentValues = o, tf(o, V(this.#n)) ? this.setValue(ef({
			segmentObj: o,
			fieldNode: V(this.#n),
			dateRef: this.placeholder.current
		})) : (this.#o = !0, this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": ls(this.isInvalid),
			"aria-disabled": cs(this.disabled.current),
			"aria-readonly": cs(this.readonly.current || n),
			"data-invalid": Q(this.isInvalid),
			"data-disabled": Q(this.disabled.current),
			"data-readonly": Q(this.readonly.current || n),
			"data-segment": `${e}`,
			[fg.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = af(t, V(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, hg = class e {
	static create(t) {
		return new e(t, pg.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new os(e.ref), this.root.domContext = this.domContext, this.attachment = ss(e.ref, (e) => this.root.setFieldNode(e)), Vo(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = /* @__PURE__ */ A(() => {
		if (ys && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = /* @__PURE__ */ A(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": V(this.#e),
		"aria-disabled": cs(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": Q(this.root.disabled.current),
		[fg.input]: "",
		...this.attachment
	}));
	get props() {
		return V(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, gg = class e {
	static create() {
		return new e(pg.get());
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
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function _g(e, t) {
	O(t, !0);
	let n = gg.create();
	var r = U(), i = F(r), a = (e) => {
		Rp(e, ya(() => n.props));
	};
	K(i, (e) => {
		n.shouldRender && e(a);
	}), W(e, r), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var vg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), yg = /* @__PURE__ */ H("<div><!></div>"), bg = /* @__PURE__ */ H("<!> <!>", 1);
function xg(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = Y(t, "name", 3, ""), o = /* @__PURE__ */ J(t, vg), s = hg.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		name: X(() => a())
	}), c = /* @__PURE__ */ A(() => Z(o, s.props));
	var l = bg(), u = F(l), d = (e) => {
		var n = U();
		G(F(n), () => t.child, () => ({
			props: V(c),
			segments: s.root.segmentContents
		})), W(e, n);
	}, f = (e) => {
		var n = yg();
		q(n, () => ({ ...V(c) })), G(P(n), () => t.children ?? g, () => ({ segments: s.root.segmentContents })), D(n), W(e, n);
	};
	K(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), _g(I(u, 2), {}), W(e, l), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var Sg = new Ro("DatePicker.Root"), Cg = class e {
	static create(t) {
		return Sg.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/internal/safe-polygon.svelte.js
function wg(e, t) {
	let [n, r] = e, i = !1, a = t.length;
	for (let e = 0, o = a - 1; e < a; o = e++) {
		let [a, s] = t[e] ?? [0, 0], [c, l] = t[o] ?? [0, 0];
		s >= r != l >= r && n <= (c - a) * (r - s) / (l - s) + a && (i = !i);
	}
	return i;
}
function Tg(e, t) {
	return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom;
}
function Eg(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
var Dg = class {
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
		this.#n = typeof t == "number" && t > 0 ? t : null, Vo([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (!e || !t || !n) {
				this.#o = null, this.#m();
				return;
			}
			return this.#o && this.#o !== e && this.#m(), this.#o = e, [
				jr(rs(e), "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				jr(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (Cs(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					Cs(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = Cs(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				jr(e, "pointerenter", () => {
					this.#m();
				}),
				jr(t, "pointerenter", () => {
					this.#m();
				}),
				jr(t, "pointerleave", (t) => {
					let n = t.relatedTarget;
					Cs(n) && e.contains(n) || (this.#r = [t.clientX, t.clientY], this.#i = "trigger", this.#u());
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
		if (this.#i === "content" && Tg(e, i)) {
			this.#m();
			return;
		}
		if (this.#i === "trigger" && Tg(e, r)) {
			this.#m();
			return;
		}
		if (this.#i === "content" && this.#a.length > 0) for (let t of this.#a) {
			let n = t.getBoundingClientRect();
			if (Tg(e, n)) return;
			let i = Eg(r, n), a = this.#h(r, n, i);
			if (a && wg(e, a)) return;
		}
		let a = Eg(r, i), o = this.#h(r, i, a);
		if (o && wg(e, o)) return;
		let s = this.#i === "content" ? i : r;
		wg(e, this.#g(this.#r, s, a, this.#i)) || (this.#m(), this.#e.onPointerExit());
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
}, Og = ps({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
}), kg = new Ro("Popover.Root"), Ag = class e {
	static create(t) {
		return kg.set(new e(t));
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
		this.opts = e, this.contentPresence = new ks({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		}), this.overlayPresence = new ks({
			ref: X(() => this.overlayNode),
			open: this.opts.open
		}), Vo(() => this.opts.open.current, (e) => {
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
		this.#l(), !this.opts.open.current && (this.openedViaHover = !0, this.opts.open.current = !0);
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
}, jg = class e {
	static create(t) {
		return new e(t, kg.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ M(!1);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref, (e) => this.root.triggerNode = e), this.domContext = new os(e.ref), this.root.setDomContext(this.domContext), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), Vo(() => this.opts.closeDelay.current, (e) => {
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
		if (this.opts.disabled.current || !this.opts.openOnHover.current || Es(e) || (N(this.#n, !0), this.#i(), this.root.cancelDelayedClose(), this.root.opts.open.current || this.root.hoverCooldown)) return;
		let t = this.opts.openDelay.current;
		t <= 0 ? this.root.handleHoverOpen() : this.#e = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen(), this.#e = null;
		}, t);
	}
	onpointerleave(e) {
		this.opts.disabled.current || this.opts.openOnHover.current && (Es(e) || (N(this.#n, !1), this.#r(), this.root.hoverCooldown = !1));
	}
	onclick(e) {
		if (!this.opts.disabled.current && e.button === 0) {
			if (this.#a(), V(this.#n) && this.root.opts.open.current && this.root.openedViaHover) {
				this.root.openedViaHover = !1, this.root.hasInteractedWithContent = !0;
				return;
			}
			V(this.#n) && this.opts.openOnHover.current && this.root.opts.open.current && (this.root.hoverCooldown = !0), this.root.hoverCooldown && !this.root.opts.open.current && (this.root.hoverCooldown = !1), this.root.toggleOpen();
		}
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
		"aria-expanded": cs(this.root.opts.open.current),
		"data-state": us(this.root.opts.open.current),
		"aria-controls": this.#o(),
		[Og.trigger]: "",
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
}, Mg = class e {
	static create(t) {
		return new e(t, kg.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ss(this.opts.ref, (e) => this.root.contentNode = e), this.onpointerdown = this.onpointerdown.bind(this), this.onfocusin = this.onfocusin.bind(this), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this), new Dg({
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
		Cs(t) && jc(t) && this.root.markInteraction();
	}
	onpointerenter(e) {
		Es(e) || this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		Es(e);
	}
	onInteractOutside = (e) => {
		if (this.opts.onInteractOutside.current(e), e.defaultPrevented || !Cs(e.target)) return;
		let t = e.target.closest(Og.selector("trigger"));
		if (!(t && t === this.root.triggerNode)) {
			if (this.opts.customAnchor.current) {
				if (Cs(this.opts.customAnchor.current)) {
					if (this.opts.customAnchor.current.contains(e.target)) return;
				} else if (typeof this.opts.customAnchor.current == "string") {
					let t = document.querySelector(this.opts.customAnchor.current);
					if (t && t.contains(e.target)) return;
				}
			}
			this.root.handleClose();
		}
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e), !e.defaultPrevented && this.root.handleClose();
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
		"data-state": us(this.root.opts.open.current),
		...ds(this.root.contentPresence.transitionStatus),
		[Og.content]: "",
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
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function Ng(e, t) {
	O(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $), a = Y(t, "value", 15), o = Y(t, "onValueChange", 3, $), s = Y(t, "placeholder", 15), c = Y(t, "onPlaceholderChange", 3, $), l = Y(t, "isDateUnavailable", 3, () => !1), u = Y(t, "validate", 3, $), d = Y(t, "onInvalid", 3, $), f = Y(t, "disabled", 3, !1), p = Y(t, "readonly", 3, !1), m = Y(t, "readonlySegments", 19, () => []), h = Y(t, "hideTimeZone", 3, !1), _ = Y(t, "required", 3, !1), v = Y(t, "calendarLabel", 3, "Event"), y = Y(t, "disableDaysOutsideMonth", 3, !0), b = Y(t, "preventDeselect", 3, !1), x = Y(t, "pagedNavigation", 3, !1), S = Y(t, "weekdayFormat", 3, "narrow"), C = Y(t, "isDateDisabled", 3, () => !1), w = Y(t, "fixedWeeks", 3, !1), ee = Y(t, "numberOfMonths", 3, 1), te = Y(t, "closeOnDateSelect", 3, !0), ne = Y(t, "initialFocus", 3, !1), re = Y(t, "monthFormat", 3, "long"), ie = Y(t, "yearFormat", 3, "numeric"), ae = pd({
		granularity: t.granularity,
		defaultValue: a(),
		minValue: t.minValue,
		maxValue: t.maxValue
	});
	function oe() {
		s() === void 0 && s(ae);
	}
	oe(), Vo.pre(() => s(), () => {
		oe();
	});
	function se() {
		te() && n(!1);
	}
	let ce = Cg.create({
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		value: X(() => a(), (e) => {
			a(e), o()(e);
		}),
		placeholder: X(() => s(), (e) => {
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
		locale: qs(() => t.locale),
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
	Ag.create({
		open: ce.opts.open,
		onOpenChangeComplete: X(() => i())
	}), mg.create({
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
	var le = U();
	Ti(F(le), () => $h, (e, n) => {
		n(e, {
			children: (e, n) => {
				var r = U();
				G(F(r), () => t.children ?? g), W(e, r);
			},
			$$slots: { default: !0 }
		});
	}), W(e, le), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Pg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), Fg = /* @__PURE__ */ H("<div><!></div>");
function Ig(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = /* @__PURE__ */ J(t, Pg), o = Sg.get(), s = Wf.create({
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
	var l = U(), u = F(l), d = (e) => {
		var n = U(), r = F(n);
		{
			let e = /* @__PURE__ */ A(() => ({
				props: V(c),
				...s.snippetProps
			}));
			G(r, () => t.child, () => V(e));
		}
		W(e, n);
	}, f = (e) => {
		var n = Fg();
		q(n, () => ({ ...V(c) })), G(P(n), () => t.children ?? g, () => s.snippetProps), D(n), W(e, n);
	};
	K(u, (e) => {
		t.child ? e(d) : e(f, -1);
	}), W(e, l), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/popover/components/popover-content-static.svelte
var Lg = /* @__PURE__ */ new Set([
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
]), Rg = /* @__PURE__ */ H("<div><!></div>");
function zg(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "ref", 15, null), i = Y(t, "id", 19, () => As(n)), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onEscapeKeydown", 3, $), c = Y(t, "onInteractOutside", 3, $), l = Y(t, "trapFocus", 3, !0), u = Y(t, "preventScroll", 3, !1), d = /* @__PURE__ */ J(t, Lg), f = Mg.create({
		id: X(() => i()),
		ref: X(() => r(), (e) => r(e)),
		onInteractOutside: X(() => c()),
		onEscapeKeydown: X(() => s()),
		customAnchor: X(() => null)
	}), p = /* @__PURE__ */ A(() => Z(d, f.props));
	var m = U(), h = F(m), _ = (e) => {
		dg(e, ya(() => V(p), () => f.popperProps, {
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
				let r = () => (n?.()).props, i = /* @__PURE__ */ A(() => Z(r(), { style: zh("popover") }, { style: t.style }));
				var a = U(), o = F(a), s = (e) => {
					var n = U(), r = F(n);
					{
						let e = /* @__PURE__ */ A(() => ({
							props: V(i),
							...f.snippetProps
						}));
						G(r, () => t.child, () => V(e));
					}
					W(e, n);
				}, c = (e) => {
					var n = Rg();
					q(n, () => ({ ...V(i) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
				};
				K(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), W(e, a);
			},
			$$slots: { popper: !0 }
		}));
	}, v = (e) => {
		lg(e, ya(() => V(p), () => f.popperProps, {
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
				let r = () => (n?.()).props, i = /* @__PURE__ */ A(() => Z(r(), { style: zh("popover") }, { style: t.style }));
				var a = U(), o = F(a), s = (e) => {
					var n = U(), r = F(n);
					{
						let e = /* @__PURE__ */ A(() => ({
							props: V(i),
							...f.snippetProps
						}));
						G(r, () => t.child, () => V(e));
					}
					W(e, n);
				}, c = (e) => {
					var n = Rg();
					q(n, () => ({ ...V(i) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
				};
				K(o, (e) => {
					t.child ? e(s) : e(c, -1);
				}), W(e, a);
			},
			$$slots: { popper: !0 }
		}));
	};
	K(h, (e) => {
		a() ? e(_) : a() || e(v, 1);
	}), W(e, m), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content-static.svelte
var Bg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function Vg(e, t) {
	O(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ J(t, Bg), i = /* @__PURE__ */ A(() => Z({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: Lf }));
	zg(e, ya(() => V(i), () => r, {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
var Hg = /* @__PURE__ */ new Set([
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
]), Ug = /* @__PURE__ */ H("<button><!></button>");
function Wg(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = Y(t, "type", 3, "button"), o = Y(t, "disabled", 3, !1), s = Y(t, "openOnHover", 3, !1), c = Y(t, "openDelay", 3, 700), l = Y(t, "closeDelay", 3, 300), u = /* @__PURE__ */ J(t, Hg), d = jg.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e)),
		disabled: X(() => !!o()),
		openOnHover: X(() => s()),
		openDelay: X(() => c()),
		closeDelay: X(() => l())
	}), f = /* @__PURE__ */ A(() => Z(u, d.props, { type: a() }));
	eg(e, {
		get id() {
			return r();
		},
		get ref() {
			return d.opts.ref;
		},
		children: (e, n) => {
			var r = U(), i = F(r), a = (e) => {
				var n = U();
				G(F(n), () => t.child, () => ({ props: V(f) })), W(e, n);
			}, o = (e) => {
				var n = Ug();
				q(n, () => ({ ...V(f) })), G(P(n), () => t.children ?? g), D(n), W(e, n);
			};
			K(i, (e) => {
				t.child ? e(a) : e(o, -1);
			}), W(e, r);
		},
		$$slots: { default: !0 }
	}), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var Gg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function Kg(e, t) {
	O(t, !0);
	let n = Y(t, "ref", 15, null), r = /* @__PURE__ */ J(t, Gg);
	function i(e) {
		if (pf(e.key)) {
			let t = e.currentTarget.closest(fg.selector("input"));
			if (!t) return;
			lf(e, t);
		}
	}
	let a = /* @__PURE__ */ A(() => Z({ onkeydown: t.onkeydown }, { onkeydown: i }));
	Wg(e, ya(() => r, { "data-segment": "trigger" }, () => V(a), {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function qg(e, t) {
	O(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "onOpenChange", 3, $), i = Y(t, "onOpenChangeComplete", 3, $);
	Ns.create({
		variant: X(() => "dialog"),
		open: X(() => n(), (e) => {
			n(e), r()(e);
		}),
		onOpenChangeComplete: X(() => i())
	});
	var a = U();
	G(F(a), () => t.children ?? g), W(e, a), k();
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.19.2_@internationalized+date@3.12.4_@sveltejs+kit@2.70.3_@sveltejs+vite-plugi_a21513635bbcaaac53035268443ecde1/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
var Jg = /* @__PURE__ */ new Set([
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
	"restoreScrollDelay"
]), Yg = /* @__PURE__ */ H("<!> <!>", 1), Xg = /* @__PURE__ */ H("<!> <div><!></div>", 1);
function Zg(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "id", 19, () => As(n)), i = Y(t, "ref", 15, null), a = Y(t, "forceMount", 3, !1), o = Y(t, "onCloseAutoFocus", 3, $), s = Y(t, "onOpenAutoFocus", 3, $), c = Y(t, "onEscapeKeydown", 3, $), l = Y(t, "onInteractOutside", 3, $), u = Y(t, "trapFocus", 3, !0), d = Y(t, "preventScroll", 3, !0), f = Y(t, "restoreScrollDelay", 3, null), p = /* @__PURE__ */ J(t, Jg), m = Is.create({
		id: X(() => r()),
		ref: X(() => i(), (e) => i(e))
	}), h = /* @__PURE__ */ A(() => Z(p, m.props));
	var _ = U(), v = F(_), y = (e) => {
		Yc(e, {
			get ref() {
				return m.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return u();
			},
			get enabled() {
				return m.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return s();
			},
			get onCloseAutoFocus() {
				return o();
			},
			focusScope: (e, n) => {
				let r = () => (n?.()).props;
				Kc(e, ya(() => V(h), {
					get enabled() {
						return m.root.opts.open.current;
					},
					get ref() {
						return m.opts.ref;
					},
					onEscapeKeydown: (e) => {
						c()(e), !e.defaultPrevented && m.root.handleClose();
					},
					children: (e, n) => {
						Uc(e, ya(() => V(h), {
							get ref() {
								return m.opts.ref;
							},
							get enabled() {
								return m.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								l()(e), !e.defaultPrevented && m.root.handleClose();
							},
							children: (e, n) => {
								nl(e, ya(() => V(h), {
									get ref() {
										return m.opts.ref;
									},
									get enabled() {
										return m.root.opts.open.current;
									},
									children: (e, n) => {
										var i = U(), a = F(i), o = (e) => {
											var n = Yg(), i = F(n), a = (e) => {
												hl(e, {
													get preventScroll() {
														return d();
													},
													get restoreScrollDelay() {
														return f();
													}
												});
											};
											K(i, (e) => {
												m.root.opts.open.current && e(a);
											});
											var o = I(i, 2);
											{
												let e = /* @__PURE__ */ A(() => ({
													props: Z(V(h), r()),
													...m.snippetProps
												}));
												G(o, () => t.child, () => V(e));
											}
											W(e, n);
										}, s = (e) => {
											var n = Xg(), i = F(n);
											hl(i, { get preventScroll() {
												return d();
											} });
											var a = I(i, 2);
											q(a, (e) => ({ ...e }), [() => Z(V(h), r())]), G(P(a), () => t.children ?? g), D(a), W(e, n);
										};
										K(a, (e) => {
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
	K(v, (e) => {
		(m.shouldRender || a()) && e(y);
	}), W(e, _), k();
}
//#endregion
//#region packages/ui-kit/src/form/date-field-utils.ts
var Qg = {
	placeholder: "选择日期",
	today: "今天",
	clear: "清除",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`
};
function $g(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (t) try {
		return Hu(t);
	} catch {
		return;
	}
}
function e_(e) {
	return $g(e) !== void 0;
}
function t_(e) {
	return e ? e.toString() : "";
}
function n_(e) {
	return e_(e) ? xa(e.trim()) : "";
}
function r_(e) {
	return e?.toLowerCase() === "en" ? "en" : "zh-CN";
}
function i_(e, t) {
	return e_(e) ? e.trim() : t;
}
function a_(e, t, n, r) {
	return e_(e) ? e.trim() : !e_(t) || n && t < n || r && t > r ? "" : t;
}
function o_(e, t, n = Qg) {
	let r = n_(t);
	return r ? n.triggerLabeled(e, r) : n.triggerEmpty(e);
}
//#endregion
//#region packages/ui-kit/src/platform/native-bridge.ts
var s_ = "__CHRONOS_NATIVE__";
function c_() {
	if (typeof window > "u") return null;
	let e = window[s_];
	return typeof e == "object" && e && typeof e.callNative == "function" ? e : null;
}
//#endregion
//#region packages/ui-kit/src/haptic/haptic.ts
var l_ = ba.hapticFeedbackEnabled;
function u_() {
	return c_();
}
function d_() {
	return typeof navigator < "u" && typeof navigator.vibrate == "function";
}
function f_() {
	return d_() ? typeof navigator < "u" && "userActivation" in navigator && navigator.userActivation != null ? navigator.userActivation.hasBeenActive : !0 : !1;
}
function p_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !0;
		let e = localStorage.getItem(l_);
		return e !== "0" && e !== "false";
	} catch {
		return !0;
	}
}
function m_(e) {
	if (!f_()) return !1;
	try {
		return navigator.vibrate(e);
	} catch {
		return !1;
	}
}
function h_(e, t) {
	if (!p_()) return !1;
	let n = u_();
	return n ? (n.callNative("haptic", e.method, e.params ?? {}).catch(() => {
		m_(t);
	}), !0) : m_(t);
}
var g_ = {
	selection: 15,
	light: 25,
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
}, __ = {
	selection() {
		return h_({ method: "selection" }, g_.selection);
	},
	light() {
		return h_({
			method: "impact",
			params: { style: "light" }
		}, g_.light);
	},
	medium() {
		return h_({
			method: "impact",
			params: { style: "medium" }
		}, g_.medium);
	},
	heavy() {
		return h_({
			method: "impact",
			params: { style: "heavy" }
		}, g_.heavy);
	},
	success() {
		return h_({
			method: "notification",
			params: { type: "success" }
		}, g_.success);
	},
	warning() {
		return h_({
			method: "notification",
			params: { type: "warning" }
		}, g_.warning);
	},
	cancel() {
		if (f_()) try {
			return navigator.vibrate(0);
		} catch {
			return !1;
		}
		return !1;
	}
}, v_ = /* @__PURE__ */ H("<span class=\"ml-0.5 text-error\">*</span>"), y_ = /* @__PURE__ */ H("<p class=\"text-body-small mt-1 text-on-surface-variant\"> </p>"), b_ = /* @__PURE__ */ H("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> <!></h3> <!></div>"), x_ = /* @__PURE__ */ H("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> <!></button>"), S_ = /* @__PURE__ */ H("<button><span> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z\"></path></svg></span></button>"), C_ = /* @__PURE__ */ H("<div><!></div>"), w_ = /* @__PURE__ */ H("<div aria-hidden=\"true\" class=\"date-picker-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50\"></div>"), T_ = /* @__PURE__ */ Ur("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path></svg>"), E_ = /* @__PURE__ */ Ur("<svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path></svg>"), D_ = /* @__PURE__ */ H("<!> <!> <!>", 1), O_ = /* @__PURE__ */ H("<div> </div>"), k_ = /* @__PURE__ */ H("<div></div>"), A_ = /* @__PURE__ */ H("<div><!> <!></div>"), j_ = /* @__PURE__ */ H("<!> <!> <div class=\"mt-3 flex items-center justify-between gap-2 border-t border-outline-variant/40 pt-3\"><div><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-brand hover:bg-brand/10 active:bg-brand/20 disabled:opacity-40\"> </button></div> <div class=\"flex items-center gap-1\"><button type=\"button\" class=\"text-label-large h-9 rounded-full px-3 text-on-surface-variant hover:bg-on-surface/5 disabled:opacity-40\"> </button> <button type=\"button\" class=\"text-label-large h-9 rounded-full bg-brand px-4 text-on-primary active:opacity-90 disabled:opacity-40\"> </button></div></div>", 1), M_ = /* @__PURE__ */ H("<!> <!>", 1), N_ = /* @__PURE__ */ H("<div><!> <!> <!></div>");
function P_(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "value", 15, ""), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "calendarLabel", 19, () => t.label), s = Y(t, "labels", 3, Qg), c = Y(t, "required", 3, !1), l = Y(t, "variant", 3, "field"), u = Y(t, "locale", 3, "zh-CN"), d = /* @__PURE__ */ A(() => t.id ?? n), f = /* @__PURE__ */ A(() => `${V(d)}-label`), p = /* @__PURE__ */ A(() => l() === "section"), m = /* @__PURE__ */ M(!1), h = La({
		overlayId: `date-field-${n}`,
		get port() {
			return t.historyPort;
		},
		parent: Qe(Fa),
		setOpen: (e) => {
			N(m, e, !0);
		}
	});
	$e(Fa, h), L(() => h.syncOpenState(V(m))), fi(() => h.dispose());
	let g = /* @__PURE__ */ M(""), _ = /* @__PURE__ */ M(void 0), v = /* @__PURE__ */ A(() => typeof r() == "string" ? r() : ""), y = /* @__PURE__ */ A(() => n_(V(v))), b = /* @__PURE__ */ A(() => o_(t.label, V(m) ? V(g) : V(v), s())), x = /* @__PURE__ */ A(() => $g(V(g))), S = /* @__PURE__ */ A(() => t.min ? $g(t.min) : void 0), C = /* @__PURE__ */ A(() => t.max ? $g(t.max) : void 0), w = Rl(Wl()).toString(), ee = /* @__PURE__ */ A(() => !!(t.min && w < t.min || t.max && w > t.max));
	function te(e) {
		if (e) {
			let e = Rl(Wl()).toString();
			N(g, a_(V(v), e, t.min, t.max), !0), N(_, $g(i_(V(g), e)), !0);
		}
	}
	function ne(e) {
		let t = t_(e);
		t !== V(g) && (__.light(), N(g, t, !0));
	}
	function re() {
		(!c() || V(g)) && (__.light(), V(g) !== V(v) && (r(V(g)), t.onValueChange?.(V(g))), N(m, !1));
	}
	function ie() {
		let e = Rl(Wl()), n = e.toString();
		t.min && n < t.min || t.max && n > t.max || (__.light(), N(g, t_(e), !0), N(_, e, !0));
	}
	function ae() {
		c() || (__.light(), N(g, ""));
	}
	function oe() {
		__.light();
	}
	var se = A_(), ce = P(se), le = (e) => {
		var n = b_(), r = P(n), i = P(r), a = I(i), o = (e) => {
			W(e, v_());
		};
		K(a, (e) => {
			c() && e(o);
		}), D(r);
		var s = I(r, 2), l = (e) => {
			var n = y_(), r = _n(n, !0);
			R(() => ii(r, t.description)), W(e, n);
		};
		K(s, (e) => {
			t.description && e(l);
		}), D(n), R(() => {
			ta(r, "id", V(f)), ii(i, `${t.label ?? ""} `);
		}), W(e, n);
	};
	K(ce, (e) => {
		V(p) && e(le);
	}), Ti(I(ce, 2), () => Ng, (e, n) => {
		n(e, {
			onOpenChange: te,
			get value() {
				return V(x);
			},
			onValueChange: ne,
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
				var r = N_(), o = P(r), l = (e) => {
					var n = x_(), r = P(n), i = I(r), a = (e) => {
						W(e, v_());
					};
					K(i, (e) => {
						c() && e(a);
					}), D(n), R(() => {
						ta(n, "id", V(f)), ii(r, `${t.label ?? ""} `);
					}), Nr("click", n, () => N(m, !0)), W(e, n);
				};
				K(o, (e) => {
					V(p) || e(l);
				});
				var u = I(o, 2);
				{
					let e = (e, t) => {
						let n = () => (t?.()).props;
						var r = C_();
						q(r, () => ({
							...n(),
							id: V(d)
						}));
						var i = P(r);
						{
							let e = (e, t) => {
								let n = () => (t?.()).props;
								var r = S_();
								q(r, () => ({
									...n(),
									type: "button",
									class: "ui-form-field-input ui-date-field-input",
									"aria-label": V(b),
									disabled: a()
								}));
								var i = P(r), o = _n(i, !0);
								De(2), D(r), R(() => {
									Ii(i, 1, Ai(["ui-date-field-value text-body-large truncate text-left", V(y) ? "text-on-surface" : "text-on-surface-variant/60"])), ii(o, V(y) || s().placeholder);
								}), W(e, r);
							};
							Ti(i, () => Kg, (t, n) => {
								n(t, {
									child: e,
									$$slots: { child: !0 }
								});
							});
						}
						D(r), W(e, r);
					};
					Ti(u, () => xg, (t, n) => {
						n(t, {
							get "aria-labelledby"() {
								return V(f);
							},
							child: e,
							$$slots: { child: !0 }
						});
					});
				}
				Ti(I(u, 2), () => Ys, (e, t) => {
					t(e, {
						children: (e, t) => {
							var n = M_(), r = F(n), i = (e) => {
								W(e, w_());
							};
							K(r, (e) => {
								V(m) && e(i);
							}), Ti(I(r, 2), () => Vg, (e, t) => {
								t(e, {
									class: "ui-date-picker-content fixed top-1/2 left-1/2 z-[var(--z-overlay)] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface-container-high p-4 text-on-surface shadow-overlay outline-none",
									children: (e, t) => {
										var n = U(), r = F(n);
										{
											let e = (e, t) => {
												let n = () => (t?.()).months, r = () => (t?.()).weekdays;
												var i = j_(), a = F(i);
												Ti(a, () => Ep, (e, t) => {
													t(e, {
														class: "mb-3 flex items-center justify-between gap-2",
														children: (e, t) => {
															var n = D_(), r = F(n);
															Ti(r, () => Fp, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: oe,
																	children: (e, t) => {
																		W(e, T_());
																	},
																	$$slots: { default: !0 }
																});
															});
															var i = I(r, 2);
															Ti(i, () => kp, (e, t) => {
																t(e, { class: "text-title-small text-on-surface" });
															}), Ti(I(i, 2), () => Mp, (e, t) => {
																t(e, {
																	class: "inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/5 active:bg-on-surface/10",
																	onclick: oe,
																	children: (e, t) => {
																		W(e, E_());
																	},
																	$$slots: { default: !0 }
																});
															}), W(e, n);
														},
														$$slots: { default: !0 }
													});
												});
												var o = I(a, 2);
												yi(o, 17, n, (e) => e.value, (e, t) => {
													var n = U(), i = F(n);
													{
														let e = (e, n) => {
															let i = () => (n?.()).props;
															var a = A_();
															q(a, () => ({
																...i(),
																class: "w-full"
															}));
															var o = P(a);
															{
																let e = (e, t) => {
																	let n = () => (t?.()).props;
																	var i = C_();
																	q(i, () => ({ ...n() }));
																	var a = P(i);
																	{
																		let e = (e, t) => {
																			let n = () => (t?.()).props;
																			var i = k_();
																			q(i, () => ({
																				...n(),
																				role: "row",
																				class: "mb-1 grid grid-cols-7"
																			})), yi(i, 23, r, (e, t) => `${t}-${e}`, (e, t) => {
																				var n = U(), r = F(n);
																				{
																					let e = (e, n) => {
																						let r = () => (n?.()).props;
																						var i = O_();
																						q(i, () => ({
																							...r(),
																							role: "columnheader",
																							class: "text-label-small flex h-10 w-full items-center justify-center text-on-surface-variant"
																						}));
																						var a = _n(i, !0);
																						R(() => ii(a, V(t))), W(e, i);
																					};
																					Ti(r, () => bp, (t, n) => {
																						n(t, {
																							child: e,
																							$$slots: { child: !0 }
																						});
																					});
																				}
																				W(e, n);
																			}), D(i), W(e, i);
																		};
																		Ti(a, () => Cp, (t, n) => {
																			n(t, {
																				child: e,
																				$$slots: { child: !0 }
																			});
																		});
																	}
																	D(i), W(e, i);
																};
																Ti(o, () => _p, (t, n) => {
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
																	var i = k_();
																	q(i, () => ({ ...r() })), yi(i, 20, () => V(t).weeks, (e) => e, (e, n) => {
																		var r = U(), i = F(r);
																		{
																			let e = (e, r) => {
																				let i = () => (r?.()).props;
																				var a = k_();
																				q(a, () => ({
																					...i(),
																					role: "row",
																					class: "grid grid-cols-7"
																				})), yi(a, 20, () => n, (e) => e, (e, n) => {
																					var r = U(), i = F(r);
																					{
																						let e = (e, t) => {
																							let r = () => (t?.()).props;
																							var i = C_();
																							q(i, () => ({
																								...r(),
																								class: "flex h-10 w-full items-center justify-center p-0"
																							})), Ti(P(i), () => ap, (e, t) => {
																								t(e, {
																									class: "ui-date-picker-day text-body-medium inline-flex size-10 items-center justify-center rounded-full border border-transparent text-on-surface transition-colors hover:bg-on-surface/5 data-disabled:pointer-events-none data-disabled:text-on-surface/30 data-outside-month:text-on-surface-variant/50 data-selected:bg-brand data-selected:font-medium data-selected:text-on-primary data-unavailable:text-on-surface-variant data-unavailable:line-through",
																									children: (e, t) => {
																										De();
																										var r = Wr();
																										R(() => ii(r, n.day)), W(e, r);
																									},
																									$$slots: { default: !0 }
																								});
																							}), D(i), W(e, i);
																						};
																						Ti(i, () => mp, (r, i) => {
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
																					W(e, r);
																				}), D(a), W(e, a);
																			};
																			Ti(i, () => Cp, (t, n) => {
																				n(t, {
																					child: e,
																					$$slots: { child: !0 }
																				});
																			});
																		}
																		W(e, r);
																	}), D(i), W(e, i);
																};
																Ti(s, () => dp, (t, n) => {
																	n(t, {
																		child: e,
																		$$slots: { child: !0 }
																	});
																});
															}
															D(a), W(e, a);
														};
														Ti(i, () => cp, (t, n) => {
															n(t, {
																class: "w-full",
																child: e,
																$$slots: { child: !0 }
															});
														});
													}
													W(e, n);
												});
												var l = I(o, 2), u = P(l), d = P(u), f = _n(d, !0);
												D(u);
												var p = I(u, 2), m = P(p), h = _n(m, !0), _ = I(m, 2), v = _n(_, !0);
												D(p), D(l), R(() => {
													d.disabled = V(ee), ii(f, s().today), m.disabled = c() || !V(g), ii(h, s().clear), _.disabled = c() && !V(g), ii(v, s().confirm);
												}), Nr("click", d, ie), Nr("click", m, ae), Nr("click", _, re), W(e, i);
											};
											Ti(r, () => Ig, (t, n) => {
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
				}), D(r), R(() => Ii(r, 1, Ai(V(p) ? "ui-form-field" : ["ui-form-field", i()]))), W(e, r);
			},
			$$slots: { default: !0 }
		});
	}), D(se), R(() => Ii(se, 1, Ai(V(p) ? ["flex flex-col gap-3", i()] : void 0))), W(e, se), k();
}
//#endregion
//#region packages/ui-kit/src/components/SegmentedControl.svelte
Pr(["click"]), Pr(["click"]), Pr(["click", "keydown"]);
//#endregion
//#region packages/ui-kit/src/form/time-wheel-utils.ts
var F_ = {
	placeholder: "选择时间",
	hour: "时",
	minute: "分",
	cancel: "取消",
	confirm: "确定",
	triggerEmpty: (e) => `选择${e}`,
	triggerLabeled: (e, t) => `${e}：${t}`,
	columnAria: (e, t) => `${e}${t}`
};
function I_(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}`;
}
function L_(e, t, n = F_) {
	return !t || !Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || !Number.isInteger(t.minute) || t.minute < 0 || t.minute > 59 ? n.triggerEmpty(e) : n.triggerLabeled(e, I_(t));
}
function R_() {
	return Array.from({ length: 24 }, (e, t) => t);
}
function z_() {
	return Array.from({ length: 60 }, (e, t) => t);
}
function B_(e, t, n = 40) {
	return Math.min(Math.max(Math.round(e / n), 0), t);
}
//#endregion
//#region packages/ui-kit/src/motion/motion.ts
var V_ = ba.reduceMotionEnabled;
function H_() {
	if (typeof window > "u") return !1;
	try {
		if (typeof localStorage > "u") return !1;
		let e = localStorage.getItem(V_);
		return e === "1" || e === "true";
	} catch {
		return !1;
	}
}
function U_() {
	if (typeof window > "u") return !1;
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return !1;
	}
}
function W_() {
	return H_() || U_();
}
//#endregion
//#region packages/ui-kit/src/overlay/bottom-sheet-drag.ts
var G_ = .25;
function K_(e) {
	return Math.max(0, e);
}
function q_(e, t, n = G_) {
	return t <= 0 ? e >= 80 : e >= t * n;
}
function J_(e, t) {
	return t <= 0 ? 1 : Math.max(0, 1 - e / t);
}
function Y_(e) {
	return e > 0;
}
//#endregion
//#region packages/ui-kit/src/overlay/BottomSheet.svelte
var X_ = /* @__PURE__ */ H("<div class=\"relative flex shrink-0 touch-none justify-center py-3 before:absolute before:inset-x-0 before:-top-4 before:-bottom-4 before:content-['']\"><div class=\"h-1 w-10 rounded-full bg-on-surface-variant/40\"></div></div>"), Z_ = /* @__PURE__ */ H("<div class=\"shrink-0\"><!></div>"), Q_ = /* @__PURE__ */ H("<div><!> <!></div>"), $_ = /* @__PURE__ */ H("<div><!></div>"), ev = /* @__PURE__ */ H("<!> <!> <!> <!>", 1), tv = /* @__PURE__ */ H("<!> <!>", 1);
function nv(e, t) {
	O(t, !0);
	let n = Y(t, "open", 15, !1), r = Y(t, "title", 3, ""), i = Y(t, "description", 3, ""), a = Y(t, "showHandle", 3, !0), o = Y(t, "dragDismissAria", 3, "Drag down to close"), s = Y(t, "manageHistory", 3, !0), c = Y(t, "overlayId", 3, "bottom-sheet"), l = /* @__PURE__ */ M(null), u = /* @__PURE__ */ M(null), d = /* @__PURE__ */ M(null), f = /* @__PURE__ */ M(null), p = /* @__PURE__ */ M(0), m = /* @__PURE__ */ M(!1), h = /* @__PURE__ */ M(!1), g = /* @__PURE__ */ M(!1), _ = null, v = 0, y = /* @__PURE__ */ M(!1), b = /* @__PURE__ */ A(() => V(p) > 0 || V(g) ? `transform: translateY(${V(p)}px)` : void 0);
	function x() {
		return V(u)?.getBoundingClientRect().height ?? 0;
	}
	function S() {
		if (!V(d)) return;
		let e = x();
		V(d).style.opacity = String(J_(V(p), e));
	}
	function C() {
		V(d)?.style.removeProperty("opacity");
	}
	function w() {
		N(m, !1), N(h, !1), N(g, !1), _ = null, C();
	}
	function ee() {
		w(), N(y, !1), n() && n(!1);
	}
	function te(e) {
		if (V(f)?.hasPointerCapture(e)) try {
			V(f).releasePointerCapture(e);
		} catch {}
	}
	function ne() {
		let e = x();
		if (W_() || e <= 0) {
			ee();
			return;
		}
		N(h, !0), requestAnimationFrame(() => {
			N(p, e, !0), S();
		});
	}
	function re() {
		if (W_()) {
			N(p, 0), w();
			return;
		}
		if (!Y_(V(p))) {
			w();
			return;
		}
		N(g, !0), requestAnimationFrame(() => {
			N(p, 0), S();
		});
	}
	function ie(e) {
		if (!(!a() || e.button !== 0 || V(h) || V(g)) && (_ = e.pointerId, v = e.clientY, N(m, !0), V(f)?.setPointerCapture)) try {
			V(f).setPointerCapture(e.pointerId);
		} catch {}
	}
	function ae(e) {
		_ === e.pointerId && V(m) && (N(p, K_(e.clientY - v), !0), S());
	}
	function oe(e) {
		if (_ !== e.pointerId || (te(e.pointerId), _ = null, !V(m))) return;
		N(m, !1);
		let t = x();
		if (q_(V(p), t)) {
			ne();
			return;
		}
		re();
	}
	function se(e) {
		_ === e.pointerId && (te(e.pointerId), _ = null, V(m) && (N(m, !1), re()));
	}
	function ce(e) {
		if (e.target === V(u) && e.propertyName === "transform") {
			if (V(h)) {
				ee();
				return;
			}
			V(g) && (w(), N(p, 0));
		}
	}
	function le(e) {
		e.preventDefault(), requestAnimationFrame(() => {
			(V(l) ?? V(u))?.focus();
		});
	}
	let ue = La({
		get overlayId() {
			return c();
		},
		get port() {
			return s() ? t.historyPort : void 0;
		},
		parent: Qe(Fa),
		setOpen: (e) => {
			n(e), N(y, e, !0);
		}
	});
	$e(Fa, ue), L(() => ue.syncOpenState(V(y))), fi(() => ue.dispose());
	function de(e) {
		if (e) {
			n(!0), t.onOpenChange?.(!0);
			return;
		}
		t.onOpenChange?.(!1), n(!1);
	}
	function fe(e) {
		e || (w(), N(y, !1)), t.onOpenChangeComplete?.(e);
	}
	L(() => {
		if (n()) {
			w(), N(p, 0), N(y, !0);
			return;
		}
		V(y) && N(y, !1);
	});
	var pe = U();
	Mr("pointermove", ln, function(...e) {
		(a() ? ae : void 0)?.apply(this, e);
	}), Mr("pointerup", ln, function(...e) {
		(a() ? oe : void 0)?.apply(this, e);
	}), Mr("pointercancel", ln, function(...e) {
		(a() ? se : void 0)?.apply(this, e);
	}), Ti(F(pe), () => qg, (e, n) => {
		n(e, {
			onOpenChange: de,
			onOpenChangeComplete: fe,
			get open() {
				return V(y);
			},
			set open(e) {
				N(y, e, !0);
			},
			children: (e, n) => {
				var s = U();
				Ti(F(s), () => Ys, (e, n) => {
					n(e, {
						children: (e, n) => {
							var s = tv(), c = F(s);
							Ti(c, () => vl, (e, t) => {
								t(e, {
									class: "bottom-sheet-overlay fixed inset-0 z-[var(--z-overlay)] bg-black/50",
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
								let e = /* @__PURE__ */ A(() => V(m) ? "" : void 0), n = /* @__PURE__ */ A(() => V(g) ? "" : void 0), s = /* @__PURE__ */ A(() => V(h) ? "" : void 0);
								Ti(p, () => Zg, (c, d) => {
									d(c, {
										class: "bottom-sheet-content rounded-t-sheet fixed inset-x-0 bottom-0 z-[var(--z-overlay)] flex max-h-[85dvh] min-h-0 flex-col overflow-hidden bg-surface-container-high text-on-surface shadow-overlay outline-none",
										get style() {
											return V(b);
										},
										get "data-dragging"() {
											return V(e);
										},
										get "data-snapping-back"() {
											return V(n);
										},
										get "data-closing"() {
											return V(s);
										},
										onOpenAutoFocus: le,
										ontransitionend: ce,
										get ref() {
											return V(u);
										},
										set ref(e) {
											N(u, e, !0);
										},
										children: (e, n) => {
											var s = ev(), c = F(s), u = (e) => {
												var t = X_();
												ua(t, (e) => N(f, e), () => V(f)), R(() => ta(t, "aria-label", o())), Nr("pointerdown", t, ie), W(e, t);
											};
											K(c, (e) => {
												a() && e(u);
											});
											var d = I(c, 2), p = (e) => {
												var n = Q_(), i = P(n), o = (e) => {
													var t = U(), n = F(t);
													{
														let e = /* @__PURE__ */ A(() => ["text-title-large min-w-0 flex-1 font-medium text-on-surface outline-none", a() ? "truncate" : "text-center"]);
														Ti(n, () => Bs, (t, n) => {
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
																	var n = Wr();
																	R(() => ii(n, r())), W(e, n);
																},
																$$slots: { default: !0 }
															});
														});
													}
													W(e, t);
												};
												K(i, (e) => {
													r() && e(o);
												});
												var s = I(i, 2), c = (e) => {
													var n = Z_();
													G(P(n), () => t.actions), D(n), W(e, n);
												};
												K(s, (e) => {
													t.actions && e(c);
												}), D(n), R(() => Ii(n, 1, Ai(["flex shrink-0 items-center gap-3", a() ? "px-4 pb-3" : "px-6 pt-6 pb-2"]))), W(e, n);
											};
											K(d, (e) => {
												(r() || t.actions) && e(p);
											});
											var m = I(d, 2), h = (e) => {
												var n = Q_(), r = P(n), o = (e) => {
													var t = U(), n = F(t);
													{
														let e = /* @__PURE__ */ A(() => ["text-body-medium leading-relaxed text-on-surface-variant", !a() && "text-center"]);
														Ti(n, () => xl, (t, n) => {
															n(t, {
																get class() {
																	return V(e);
																},
																children: (e, t) => {
																	De();
																	var n = Wr();
																	R(() => ii(n, i())), W(e, n);
																},
																$$slots: { default: !0 }
															});
														});
													}
													W(e, t);
												};
												K(r, (e) => {
													i() && e(o);
												});
												var s = I(r, 2), c = (e) => {
													var n = U();
													G(F(n), () => t.children), W(e, n);
												};
												K(s, (e) => {
													t.children && e(c);
												}), D(n), R(() => Ii(n, 1, Ai([a() ? ["app-scroll-y min-h-0 flex-1 overflow-y-auto", !t.footer && "pb-[calc(1rem+var(--tabbar-block-safe,0px))]"] : "shrink-0 px-6 pb-5"]))), W(e, n);
											};
											K(m, (e) => {
												(i() || t.children) && e(h);
											});
											var g = I(m, 2), _ = (e) => {
												var n = $_();
												G(P(n), () => t.footer), D(n), R(() => Ii(n, 1, Ai(["flex shrink-0 items-center gap-2", a() ? "mt-2 justify-end ps-4 pe-[calc(1rem+var(--tabbar-inline-safe,0px))] pb-[calc(var(--tabbar-block-safe,0px)+0.75rem)]" : "w-full justify-stretch gap-3 border-t border-outline-variant/40 ps-6 pe-[calc(1.5rem+var(--tabbar-inline-safe,0px))] pt-4 pb-[calc(var(--tabbar-block-safe,0px)+0.75rem)] [&>button]:flex-1"]))), W(e, n);
											};
											K(g, (e) => {
												t.footer && e(_);
											}), W(e, s);
										},
										$$slots: { default: !0 }
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
	}), W(e, pe), k();
}
Pr(["pointerdown"]);
//#endregion
//#region packages/ui-kit/src/form/PickerWheel.svelte
var rv = /* @__PURE__ */ H("<div role=\"option\" tabindex=\"-1\"> </div>"), iv = /* @__PURE__ */ H("<div class=\"picker-wheel-column relative w-full svelte-1i06u69\"><div role=\"listbox\"></div> <div aria-hidden=\"true\" class=\"picker-wheel-fade-top pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-surface-container-high to-transparent svelte-1i06u69\"></div> <div aria-hidden=\"true\" class=\"picker-wheel-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-high to-transparent svelte-1i06u69\"></div> <div aria-hidden=\"true\" class=\"pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-lg border-y border-outline-variant/40 bg-brand/5\"></div></div>");
function av(e, t) {
	O(t, !0);
	let n = Y(t, "value", 15, ""), r = Y(t, "disabled", 3, !1), i = null, a = 0, o = 0, s = 0, c = 0, l = /* @__PURE__ */ A(() => t.options.map((e) => e.value).join("\0"));
	function u() {
		return Math.max(0, t.options.findIndex((e) => e.value === n()));
	}
	function d(e, t) {
		i?.scrollTo({
			top: e * 40,
			behavior: t ? "smooth" : "instant"
		});
	}
	function f() {
		a = Date.now() + 150, c = u(), d(c, !1);
	}
	L(() => {
		V(l), wr(f);
	});
	function p() {
		let e = Date.now();
		e < a || e - o < 40 || (o = e, __.medium());
	}
	function m(e) {
		let r = t.options[e]?.value;
		r !== void 0 && r !== n() && (n(r), t.onValueChange?.(r));
	}
	function h() {
		s = 0, !r() && m(c);
	}
	function g(e) {
		if (r()) return;
		let n = B_(e.scrollTop, Math.max(0, t.options.length - 1), 40);
		c !== n && (c = n, p()), window.clearTimeout(s), s = window.setTimeout(h, 90);
	}
	function _() {
		return r() ? n() : (window.clearTimeout(s), i && (c = B_(i.scrollTop, Math.max(0, t.options.length - 1), 40)), h(), t.options[c]?.value ?? "");
	}
	function v(e) {
		if (r()) return;
		let n = Math.min(Math.max(e, 0), Math.max(0, t.options.length - 1));
		c = n, m(n), d(n, !0);
	}
	function y(e) {
		r() || (e.key === "ArrowDown" || e.key === "ArrowRight" ? (e.preventDefault(), v(c + 1)) : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (e.preventDefault(), v(c - 1)) : e.key === "Home" ? (e.preventDefault(), v(0)) : e.key === "End" && (e.preventDefault(), v(t.options.length - 1)));
	}
	function b(e) {
		return i = e, c = u(), e.scrollTo({ top: c * 40 }), () => {
			i === e && (i = null);
		};
	}
	fi(() => clearTimeout(s));
	var x = {
		scrollToValue: f,
		commitDraft: _
	}, S = iv(), C = P(S);
	return yi(C, 23, () => t.options, (e) => e.value, (e, r, i) => {
		var a = rv();
		let o;
		var s = _n(a, !0);
		R(() => {
			ta(a, "id", `${t.idPrefix ?? ""}-${V(r).value ?? ""}`), ta(a, "aria-selected", V(r).value === n()), Ii(a, 1, `picker-wheel-row text-body-large flex cursor-pointer items-center justify-center text-center tabular-nums transition-colors ${V(r).value === n() ? "font-medium text-on-surface" : "text-on-surface-variant/60"}`, "svelte-1i06u69"), o = Ri(a, "", o, { height: "40px" }), ii(s, V(r).label);
		}), Nr("click", a, () => v(V(i))), W(e, a);
	}), D(C), Di(C, () => b), De(6), D(S), R(() => {
		ta(C, "aria-label", t.label), ta(C, "aria-disabled", r()), ta(C, "tabindex", r() ? -1 : 0), Ii(C, 1, Ai(["picker-wheel overflow-y-auto rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand", r() && "pointer-events-none opacity-60"]), "svelte-1i06u69");
	}), Mr("scroll", C, (e) => g(e.currentTarget)), Mr("scrollend", C, () => {
		window.clearTimeout(s), h();
	}), Nr("keydown", C, y), W(e, S), k(x);
}
Pr(["keydown", "click"]);
//#endregion
//#region packages/ui-kit/src/form/TimeWheel.svelte
var ov = /* @__PURE__ */ H("<div class=\"flex justify-center gap-3\"><div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div> <div class=\"flex min-w-0 flex-1 flex-col items-center\"><!></div></div>");
function sv(e, t) {
	O(t, !0);
	let n = Y(t, "value", 31, () => on({
		hour: 0,
		minute: 0
	})), r = Y(t, "disabled", 3, !1), i = /* @__PURE__ */ M(on(String(n().hour))), a = /* @__PURE__ */ M(on(String(n().minute))), o = /* @__PURE__ */ M(null), s = /* @__PURE__ */ M(null), c = /* @__PURE__ */ A(() => R_().filter((e) => !t.minimum || e >= t.minimum.hour).map((e) => ({
		value: String(e),
		label: String(e).padStart(2, "0")
	}))), l = /* @__PURE__ */ A(() => z_().filter((e) => !t.minimum || Number(V(i)) > t.minimum.hour || e >= t.minimum.minute).map((e) => ({
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
		f(), xr().then(() => {
			V(o)?.scrollToValue(), V(s)?.scrollToValue();
		});
	}
	function m(e) {
		d({
			hour: Number(e),
			minute: Number(V(a))
		}), xr().then(() => V(s)?.scrollToValue());
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
	}, v = ov(), y = P(v), b = P(y);
	{
		let e = /* @__PURE__ */ A(() => t.labels.columnAria(t.label, t.labels.hour)), n = /* @__PURE__ */ A(() => `${t.idPrefix}-hour`);
		ua(av(b, {
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
		ua(av(S, {
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
	return D(x), D(v), W(e, v), k(_);
}
//#endregion
//#region packages/ui-kit/src/form/TimePicker.svelte
var cv = /* @__PURE__ */ H("<p class=\"text-body-small mt-1 text-on-surface-variant\"> </p>"), lv = /* @__PURE__ */ H("<div class=\"px-1\"><h3 class=\"text-title-medium text-on-surface\"> </h3> <!></div>"), uv = /* @__PURE__ */ H("<button type=\"button\" class=\"ui-field-label cursor-pointer border-0 bg-transparent p-0 text-left\"> </button>"), dv = /* @__PURE__ */ H("<button type=\"button\" class=\"text-label-large h-11 rounded-full px-5 text-on-surface-variant hover:bg-on-surface/5 active:bg-on-surface/10\"> </button> <button type=\"button\" class=\"text-label-large h-11 rounded-full bg-brand px-6 text-on-primary active:opacity-90\"> </button>", 1), fv = /* @__PURE__ */ H("<div class=\"px-4 pt-1 pb-2\"><!></div>"), pv = /* @__PURE__ */ H("<div><!> <div><!> <button type=\"button\" class=\"ui-form-field-input ui-date-field-input\" aria-haspopup=\"dialog\"><span class=\"ui-date-field-value text-body-large truncate text-left text-on-surface tabular-nums\"> </span> <span class=\"ui-date-field-trigger\" aria-hidden=\"true\"><svg class=\"size-5\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z\"></path></svg></span></button></div></div> <!>", 1);
function mv(e, t) {
	let n = Gr();
	O(t, !0);
	let r = Y(t, "value", 31, () => on({
		hour: 0,
		minute: 0
	})), i = Y(t, "class", 3, ""), a = Y(t, "disabled", 3, !1), o = Y(t, "variant", 3, "field"), s = Y(t, "labels", 3, F_), c = Y(t, "sheetDragDismissAria", 3, "向下拖动关闭"), l = /* @__PURE__ */ A(() => t.id ?? n), u = /* @__PURE__ */ A(() => `${V(l)}-label`), d = /* @__PURE__ */ A(() => t.idPrefix ?? V(l)), f = /* @__PURE__ */ A(() => t.overlayId ?? `time-picker-${n}`), p = /* @__PURE__ */ A(() => t.manageHistory ?? t.historyPort != null), m = /* @__PURE__ */ A(() => o() === "section"), h = /* @__PURE__ */ M(!1), g = /* @__PURE__ */ M(on({
		hour: 0,
		minute: 0
	})), _ = /* @__PURE__ */ M(null), v = /* @__PURE__ */ A(() => I_(r())), y = /* @__PURE__ */ A(() => L_(t.label, V(h) ? V(g) : r(), s()));
	function b() {
		a() || (N(g, {
			hour: r().hour,
			minute: r().minute
		}, !0), N(h, !0), xr().then(() => V(_)?.scrollToValue()));
	}
	function x() {
		N(h, !1);
	}
	function S() {
		__.light();
		let e = V(_)?.commitDraft() ?? V(g);
		(e.hour !== r().hour || e.minute !== r().minute) && (r(e), t.onValueChange?.(e)), x();
	}
	var C = pv(), w = F(C), ee = P(w), te = (e) => {
		var n = lv(), r = P(n), i = _n(r, !0), a = I(r, 2), o = (e) => {
			var n = cv(), r = _n(n, !0);
			R(() => ii(r, t.description)), W(e, n);
		};
		K(a, (e) => {
			t.description && e(o);
		}), D(n), R(() => {
			ta(r, "id", V(u)), ii(i, t.label);
		}), W(e, n);
	};
	K(ee, (e) => {
		V(m) && e(te);
	});
	var ne = I(ee, 2), re = P(ne), ie = (e) => {
		var n = uv(), r = _n(n, !0);
		R(() => {
			ta(n, "id", V(u)), ii(r, t.label);
		}), Nr("click", n, b), W(e, n);
	};
	K(re, (e) => {
		V(m) || e(ie);
	});
	var ae = I(re, 2), oe = _n(P(ae), !0);
	De(2), D(ae), D(ne), D(w), nv(I(w, 2), {
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
			var t = dv(), n = F(t), r = _n(n, !0), i = I(n, 2), a = _n(i, !0);
			R(() => {
				ii(r, s().cancel), ii(a, s().confirm);
			}), Nr("click", n, x), Nr("click", i, S), W(e, t);
		},
		children: (e, n) => {
			var r = fv();
			ua(sv(P(r), {
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
			}), (e) => N(_, e, !0), () => V(_)), D(r), W(e, r);
		},
		$$slots: {
			footer: !0,
			default: !0
		}
	}), R(() => {
		Ii(w, 1, Ai(V(m) ? ["flex flex-col gap-3", i()] : void 0)), Ii(ne, 1, Ai(V(m) ? "ui-form-field" : ["ui-form-field", i()])), ta(ae, "id", V(l)), ta(ae, "aria-labelledby", V(u)), ta(ae, "aria-label", V(y)), ta(ae, "aria-expanded", V(h)), ae.disabled = a(), ii(oe, V(v));
	}), Nr("click", ae, b), W(e, C), k();
}
Pr(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/edge-bar-actions.svelte.ts
var [hv, gv] = Ze();
//#endregion
//#region packages/ui-kit/src/plugin-screen/PluginScreenContainer.svelte
Pr(["click"]);
//#endregion
//#region packages/ui-kit/src/plugin-screen/MountableSvelteHost.svelte
var _v = /* @__PURE__ */ H("<div class=\"flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden\"><!></div>");
function vv(e, t) {
	O(t, !0);
	let n = /* @__PURE__ */ A(() => t.component), r = /* @__PURE__ */ A(() => Pa(t.propsStore).current);
	var i = _v();
	Ti(P(i), () => V(n), (e, t) => {
		t(e, ya(() => V(r)));
	}), D(i), W(e, i), k();
}
//#endregion
//#region packages/ui-kit/src/plugin-screen/mountable-svelte.ts
function yv(e) {
	return {
		[Oa]: !0,
		mount(t, n, r) {
			let i = pa({ ...n }), a = ai(vv, {
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
					li(a);
				}
			};
		}
	};
}
//#endregion
//#region packages/ui-kit/src/i18n/plugin-text.ts
function bv(e, t, n, r, i) {
	let a = n["zh-cn"][r] ?? n.en?.[r] ?? String(r);
	if (!e) return Da(a, i);
	"slotVersion" in e && e.slotVersion;
	let o = e.translatePlugin(t, r, i);
	return o === r ? Da(a, i) : o;
}
//#endregion
//#region packages/ui-kit/src/actions/scroll-reveal-scrollbar.ts
var xv = 900, Sv = 24, Cv = /* @__PURE__ */ new Set([
	"flex-1",
	"min-h-0",
	"h-full",
	"w-full",
	"mx-auto",
	"grow",
	"shrink-0"
]);
function wv(e) {
	return Cv.has(e) ? !0 : e.startsWith("max-w-");
}
function Tv(e) {
	let t = [], n = [];
	for (let r of e) wv(r) ? t.push(r) : n.push(r);
	return {
		hostClasses: t,
		scrollClasses: n
	};
}
function Ev(e, t, n, r = Sv) {
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
function Dv(e, t) {
	if (!t.visible) {
		e.style.display = "none";
		return;
	}
	e.style.display = "", e.style.height = `${t.height}px`, e.style.transform = `translateY(${t.offset}px)`;
}
function Ov(e) {
	let t = e.parentNode;
	if (!t) return { destroy() {} };
	let n = document.createElement("div");
	n.className = "secondary-scroll-host";
	let { hostClasses: r, scrollClasses: i } = Tv(e.classList);
	e.className = i.join(" "), n.classList.add(...r);
	let a = document.createElement("div");
	a.className = "secondary-scroll-thumb", a.setAttribute("aria-hidden", "true"), t.insertBefore(n, e), n.appendChild(e), n.appendChild(a);
	let o = !1;
	e.classList.contains("h-full") || (e.classList.add("h-full", "w-full"), o = !0);
	let s, c = () => {
		Dv(a, Ev(e.scrollTop, e.scrollHeight, e.clientHeight));
	}, l = () => {
		n.classList.add("is-scrolling"), c(), s !== void 0 && clearTimeout(s), s = setTimeout(() => {
			n.classList.remove("is-scrolling"), s = void 0;
		}, xv);
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
var kv = 120, Av = 220, jv = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
function Mv(e, t = kv) {
	return e === 0 ? 0 : Math.sign(e) * (t * (1 - Math.exp(-Math.abs(e) / t)));
}
function Nv(e) {
	return e.scrollTop <= 0;
}
function Pv(e) {
	return Math.max(0, e.scrollHeight - e.clientHeight);
}
function Fv(e) {
	let t = Pv(e);
	return t <= 0 || e.scrollTop >= t - 1;
}
function Iv(e, t, n, r, i) {
	if (i) return 0;
	if (e !== 0) {
		let i = e + t;
		return i > 0 && !n && (i = 0), i < 0 && !r && (i = 0), i;
	}
	return n && t > 0 || r && t < 0 ? t : 0;
}
function Lv() {
	return typeof window < "u" && !W_();
}
function Rv(e) {
	let t = 0, n = 0, r = 0, i, a = () => {
		i !== void 0 && (clearTimeout(i), i = void 0), e.style.transition = "";
	}, o = (t) => {
		if (a(), !t) {
			e.style.transform = "";
			return;
		}
		e.style.transition = `transform ${Av}ms ${jv}`, e.style.transform = "", i = setTimeout(() => {
			e.style.transition = "", i = void 0;
		}, 252);
	}, s = () => {
		let t = Mv(r);
		e.style.transform = t === 0 ? "" : `translate3d(0, ${t}px, 0)`;
	}, c = (i) => {
		i.touches.length === 1 && (a(), t = i.touches[0].clientY, n = e.scrollTop, r = 0);
	}, l = (i) => {
		if (i.touches.length !== 1) return;
		let a = i.touches[0].clientY, o = a - t;
		t = a;
		let c = e.scrollTop, l = c !== n;
		n = c;
		let u = Iv(r, o, Nv(e), Fv(e), l);
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
function zv(e, t = !0) {
	let n = null, r = (t) => {
		if (t && Lv()) {
			n ||= Rv(e);
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
function Bv(e) {
	let t = Ov(e), n = zv(e);
	return { destroy() {
		t.destroy(), n.destroy();
	} };
}
//#endregion
//#region packages/plugins/clock/src/clock.ts
var Vv = /^\d{4}-\d{2}-\d{2}$/;
function Hv(e) {
	return typeof e != "number" || !Number.isFinite(e) ? null : e;
}
function Uv(e, t) {
	if (!Vv.test(e) || !Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || !Number.isInteger(t.minute) || t.minute < 0 || t.minute > 59) return null;
	let n = Number(e.slice(0, 4)), r = Number(e.slice(5, 7)), i = Number(e.slice(8, 10)), a = new Date(n, r - 1, i, t.hour, t.minute, 0, 0);
	return a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i ? null : a;
}
function Wv(e) {
	return {
		isoDate: Ca(e),
		time: {
			hour: e.getHours(),
			minute: e.getMinutes()
		}
	};
}
//#endregion
//#region packages/plugins/clock/src/constants.ts
var Gv = "tool-clock", Kv = "frozen_now", qv = {
	"zh-cn": {
		"plugin.name": "自定义时间",
		"mine.title": "自定义时间",
		"mine.keywords": "时间,日期,冻结,时钟,调试,预览,clock,time,date",
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
		"mine.keywords": "time,date,freeze,clock,debug,preview",
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
//#endregion
//#region packages/plugins/clock/src/index.ts
function Jv(e = {}) {
	let { screenComponent: t } = e, n;
	return Na({
		id: Gv,
		messages: qv,
		nameKey: "plugin.name",
		category: "tool",
		toolGroup: "dev",
		order: 55,
		author: "Chronos",
		homepage: "https://github.com/UE-DND/Chronos",
		async apply(e, r) {
			n = e;
			let i = Hv(await e.storage.get(Kv));
			i != null && e.actions.setVirtualNow(new Date(i));
			let a = r("mine.keywords").split(",").map((e) => e.trim()).filter(Boolean);
			e.registerSlot("mine.item", {
				id: "clock",
				sectionId: Gv,
				title: () => r("mine.title"),
				href: `/plugins/${Gv}`,
				icon: "schedule",
				iconTone: "secondary",
				keywords: a,
				order: 40
			}), e.registerSlot("shell.route.screen", {
				id: Gv,
				title: () => r("screen.title"),
				...t ? { component: t } : {}
			});
		},
		dispose() {
			let e = n;
			n = void 0, e?.actions.setVirtualNow(null);
		}
	});
}
//#endregion
//#region packages/plugins/clock/src/analytics.ts
var Yv = {
	apply: "apply",
	reset: "reset"
}, Xv = /* @__PURE__ */ H("<p class=\"text-headline-small text-on-surface tabular-nums\"> <span class=\"text-on-surface-variant\">·</span> </p> <p class=\"text-body-medium mt-1 text-on-surface-variant\"> </p>", 1), Zv = /* @__PURE__ */ H("<header class=\"relative z-10 shrink-0 border-b border-outline/10 bg-surface/90 px-4 pt-6 pb-4 backdrop-blur-sm\"><!></header>"), Qv = /* @__PURE__ */ H("<section class=\"ui-section-surface ui-section-surface--comfortable\"><!></section>"), $v = /* @__PURE__ */ H("<div class=\"flex h-full min-h-0 flex-1 flex-col overflow-hidden\"><!> <div class=\"secondary-scroll relative z-0 min-h-0 flex-1 overflow-y-auto\"><div class=\"mx-auto flex w-full max-w-lg flex-col gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]\"><!> <section class=\"ui-section-surface ui-section-surface--comfortable\"><div class=\"ui-section-stack divide-y divide-outline/10\"><!> <!></div></section></div></div> <div class=\"bottom-bar plugin-bottom-actions\"><div class=\"mx-auto flex h-full w-full max-w-lg items-center gap-3\"><button type=\"button\" class=\"ui-btn ui-btn-outlined flex-1\"> </button> <button type=\"button\" class=\"ui-btn ui-btn-filled flex-1\"> </button></div></div></div>");
function ey(e, t) {
	O(t, !0);
	let n = (e) => {
		var t = Xv(), n = F(t), r = P(n), i = I(r, 2);
		D(n);
		var a = _n(I(n, 2), !0);
		R(() => {
			ii(r, `${V(h) ?? ""} `), ii(i, ` ${V(g) ?? ""}`), ii(a, V(_));
		}), W(e, t);
	}, r = new Io("(orientation: landscape) and (max-height: 500px)"), i = /* @__PURE__ */ A(() => Pa(t.controller.snapshot)), a = /* @__PURE__ */ A(() => t.controller.getPluginContext(t.pluginId)), o = /* @__PURE__ */ A(() => r_(V(i).current.currentLocale));
	function s(e, n) {
		return V(i).current.slotVersion, bv(t.controller, Gv, qv, e, n);
	}
	let c = Wv(/* @__PURE__ */ new Date()), l = /* @__PURE__ */ M(on(c.isoDate)), u = /* @__PURE__ */ M(on(c.time));
	di(() => {
		let e = Wv(t.controller.getPluginContext(t.pluginId).state.now);
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
	})), p = /* @__PURE__ */ A(() => V(i).current.clockFrozen), m = /* @__PURE__ */ A(() => V(i).current.clockNow), h = /* @__PURE__ */ A(() => Sa(Wv(V(m)).isoDate)), g = /* @__PURE__ */ A(() => V(m).toLocaleTimeString(V(o), {
		hour: "2-digit",
		minute: "2-digit"
	})), _ = /* @__PURE__ */ A(() => V(p) ? s("screen.status.subtitle.frozen") : s("screen.status.subtitle.system")), v = /* @__PURE__ */ A(() => Uv(V(l), V(u))), y = /* @__PURE__ */ A(() => V(v) != null && V(v).getTime() !== V(m).getTime()), b = /* @__PURE__ */ A(() => [{
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
	L(() => t.edgeActions?.register(t.pluginId, V(b)));
	async function x() {
		let e = Uv(V(l), V(u));
		if (!e) {
			V(a).actions.notify(s("screen.notify.invalid"), "warn");
			return;
		}
		await V(a).storage.set(Kv, e.getTime()), V(a).actions.setVirtualNow(e), Aa(V(a), Gv, Yv.apply), V(a).actions.notify(s("screen.notify.applied"), "info");
	}
	async function S() {
		await V(a).storage.delete(Kv), V(a).actions.setVirtualNow(null);
		let e = Wv(V(a).state.now);
		N(l, e.isoDate, !0), N(u, e.time, !0), Aa(V(a), Gv, Yv.reset), V(a).actions.notify(s("screen.notify.reset"), "info");
	}
	var C = $v(), w = P(C), ee = (e) => {
		var t = Zv(), r = P(t);
		n(r), D(t), W(e, t);
	};
	K(w, (e) => {
		r.current || e(ee);
	});
	var te = I(w, 2), ne = P(te), re = P(ne), ie = (e) => {
		var t = Qv(), r = P(t);
		n(r), D(t), W(e, t);
	};
	K(re, (e) => {
		r.current && e(ie);
	});
	var ae = I(re, 2), oe = P(ae), se = P(oe);
	{
		let e = /* @__PURE__ */ A(() => s("screen.field.date"));
		P_(se, {
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
		mv(ce, {
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
	D(oe), D(ae), D(ne), D(te), Ei(te, (e) => Bv?.(e));
	var le = I(te, 2), ue = P(le), de = P(ue), fe = _n(de, !0), pe = I(de, 2), me = _n(pe, !0);
	D(ue), D(le), D(C), R((e, t) => {
		de.disabled = !V(p), ii(fe, e), pe.disabled = !V(y), ii(me, t);
	}, [() => s("screen.action.reset"), () => s("screen.action.apply")]), Nr("click", de, () => void S()), Nr("click", pe, () => void x()), W(e, C), k();
}
Pr(["click"]);
//#endregion
//#region packages/plugins/clock/bundle/entry.ts
var ty = Jv({ screenComponent: yv(ey) });
//#endregion
export { ty as default };
