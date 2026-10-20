var S0 = { exports: {} }, G = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $y;
function fh() {
  if ($y) return G;
  $y = 1;
  var z = Symbol.for("react.transitional.element"), j = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), Nt = Symbol.for("react.profiler"), At = Symbol.for("react.consumer"), qt = Symbol.for("react.context"), su = Symbol.for("react.forward_ref"), Tl = Symbol.for("react.suspense"), Rl = Symbol.for("react.memo"), Y = Symbol.for("react.lazy"), T = Symbol.for("react.activity"), H = Symbol.for("react.view_transition"), Nl = Symbol.iterator;
  function kl(v) {
    return v === null || typeof v != "object" ? null : (v = Nl && v[Nl] || v["@@iterator"], typeof v == "function" ? v : null);
  }
  var Kl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, ol = Object.assign, dt = {};
  function Pl(v, b, U) {
    this.props = v, this.context = b, this.refs = dt, this.updater = U || Kl;
  }
  Pl.prototype.isReactComponent = {}, Pl.prototype.setState = function(v, b) {
    if (typeof v != "object" && typeof v != "function" && v != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, v, b, "setState");
  }, Pl.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function Ju() {
  }
  Ju.prototype = Pl.prototype;
  function Bt(v, b, U) {
    this.props = v, this.context = b, this.refs = dt, this.updater = U || Kl;
  }
  var pt = Bt.prototype = new Ju();
  pt.constructor = Bt, ol(pt, Pl.prototype), pt.isPureReactComponent = !0;
  var lt = Array.isArray;
  function V() {
  }
  var k = { H: null, A: null, T: null, S: null }, Gt = Object.prototype.hasOwnProperty;
  function st(v, b, U) {
    var C = U.ref;
    return {
      $$typeof: z,
      type: v,
      key: b,
      ref: C !== void 0 ? C : null,
      props: U
    };
  }
  function ht(v, b) {
    return st(v.type, b, v.props);
  }
  function tt(v) {
    return typeof v == "object" && v !== null && v.$$typeof === z;
  }
  function hu(v) {
    var b = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(U) {
      return b[U];
    });
  }
  var wu = /\/+/g;
  function Al(v, b) {
    return typeof v == "object" && v !== null && v.key != null ? hu("" + v.key) : b.toString(36);
  }
  function O(v) {
    switch (v.status) {
      case "fulfilled":
        return v.value;
      case "rejected":
        throw v.reason;
      default:
        switch (typeof v.status == "string" ? v.then(V, V) : (v.status = "pending", v.then(
          function(b) {
            v.status === "pending" && (v.status = "fulfilled", v.value = b);
          },
          function(b) {
            v.status === "pending" && (v.status = "rejected", v.reason = b);
          }
        )), v.status) {
          case "fulfilled":
            return v.value;
          case "rejected":
            throw v.reason;
        }
    }
    throw v;
  }
  function q(v, b, U, C, $) {
    var F = typeof v;
    (F === "undefined" || F === "boolean") && (v = null);
    var P = !1;
    if (v === null) P = !0;
    else
      switch (F) {
        case "bigint":
        case "string":
        case "number":
          P = !0;
          break;
        case "object":
          switch (v.$$typeof) {
            case z:
            case j:
              P = !0;
              break;
            case Y:
              return P = v._init, q(
                P(v._payload),
                b,
                U,
                C,
                $
              );
          }
      }
    if (P)
      return $ = $(v), P = C === "" ? "." + Al(v, 0) : C, lt($) ? (U = "", P != null && (U = P.replace(wu, "$&/") + "/"), q($, b, U, "", function(kt) {
        return kt;
      })) : $ != null && (tt($) && ($ = ht(
        $,
        U + ($.key == null || v && v.key === $.key ? "" : ("" + $.key).replace(
          wu,
          "$&/"
        ) + "/") + P
      )), b.push($)), 1;
    P = 0;
    var D = C === "" ? "." : C + ":";
    if (lt(v))
      for (var p = 0; p < v.length; p++)
        C = v[p], F = D + Al(C, p), P += q(
          C,
          b,
          U,
          F,
          $
        );
    else if (p = kl(v), typeof p == "function")
      for (v = p.call(v), p = 0; !(C = v.next()).done; )
        C = C.value, F = D + Al(C, p++), P += q(
          C,
          b,
          U,
          F,
          $
        );
    else if (F === "object") {
      if (typeof v.then == "function")
        return q(
          O(v),
          b,
          U,
          C,
          $
        );
      throw b = String(v), Error(
        "Objects are not valid as a React child (found: " + (b === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return P;
  }
  function B(v, b, U) {
    if (v == null) return v;
    var C = [], $ = 0;
    return q(v, C, "", "", function(F) {
      return b.call(U, F, $++);
    }), C;
  }
  function cl(v) {
    if (v._status === -1) {
      var b = v._result, U = b();
      U.then(
        function(C) {
          (v._status === 0 || v._status === -1) && (v._status = 1, v._result = C, U.status === void 0 && (U.status = "fulfilled", U.value = C));
        },
        function(C) {
          (v._status === 0 || v._status === -1) && (v._status = 2, v._result = C, U.status === void 0 && (U.status = "rejected", U.reason = C));
        }
      ), v._status === -1 && (v._status = 0, v._result = U);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var tl = typeof reportError == "function" ? reportError : function(v) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var b = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof v == "object" && v !== null && typeof v.message == "string" ? String(v.message) : String(v),
        error: v
      });
      if (!window.dispatchEvent(b)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", v);
      return;
    }
    console.error(v);
  };
  function Dt(v) {
    var b = k.T, U = {};
    U.types = b !== null ? b.types : null, k.T = U;
    try {
      var C = v(), $ = k.S;
      $ !== null && $(U, C), typeof C == "object" && C !== null && typeof C.then == "function" && C.then(V, tl);
    } catch (F) {
      tl(F);
    } finally {
      b !== null && U.types !== null && (b.types = U.types), k.T = b;
    }
  }
  function It(v) {
    var b = k.T;
    if (b !== null) {
      var U = b.types;
      U === null ? b.types = [v] : U.indexOf(v) === -1 && U.push(v);
    } else Dt(It.bind(null, v));
  }
  var Wu = {
    map: B,
    forEach: function(v, b, U) {
      B(
        v,
        function() {
          b.apply(this, arguments);
        },
        U
      );
    },
    count: function(v) {
      var b = 0;
      return B(v, function() {
        b++;
      }), b;
    },
    toArray: function(v) {
      return B(v, function(b) {
        return b;
      }) || [];
    },
    only: function(v) {
      if (!tt(v))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return v;
    }
  };
  return G.Activity = T, G.Children = Wu, G.Component = Pl, G.Fragment = w, G.Profiler = Nt, G.PureComponent = Bt, G.StrictMode = r, G.Suspense = Tl, G.ViewTransition = H, G.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, G.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(v) {
      return k.H.useMemoCache(v);
    }
  }, G.addTransitionType = It, G.cache = function(v) {
    return function() {
      return v.apply(null, arguments);
    };
  }, G.cacheSignal = function() {
    return null;
  }, G.cloneElement = function(v, b, U) {
    if (v == null)
      throw Error(
        "The argument must be a React element, but you passed " + v + "."
      );
    var C = ol({}, v.props), $ = v.key;
    if (b != null)
      for (F in b.key !== void 0 && ($ = "" + b.key), b)
        !Gt.call(b, F) || F === "key" || F === "__self" || F === "__source" || F === "ref" && b.ref === void 0 || (C[F] = b[F]);
    var F = arguments.length - 2;
    if (F === 1) C.children = U;
    else if (1 < F) {
      for (var P = Array(F), D = 0; D < F; D++)
        P[D] = arguments[D + 2];
      C.children = P;
    }
    return st(v.type, $, C);
  }, G.createContext = function(v) {
    return v = {
      $$typeof: qt,
      _currentValue: v,
      _currentValue2: v,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, v.Provider = v, v.Consumer = {
      $$typeof: At,
      _context: v
    }, v;
  }, G.createElement = function(v, b, U) {
    var C, $ = {}, F = null;
    if (b != null)
      for (C in b.key !== void 0 && (F = "" + b.key), b)
        Gt.call(b, C) && C !== "key" && C !== "__self" && C !== "__source" && ($[C] = b[C]);
    var P = arguments.length - 2;
    if (P === 1) $.children = U;
    else if (1 < P) {
      for (var D = Array(P), p = 0; p < P; p++)
        D[p] = arguments[p + 2];
      $.children = D;
    }
    if (v && v.defaultProps)
      for (C in P = v.defaultProps, P)
        $[C] === void 0 && ($[C] = P[C]);
    return st(v, F, $);
  }, G.createRef = function() {
    return { current: null };
  }, G.forwardRef = function(v) {
    return { $$typeof: su, render: v };
  }, G.isValidElement = tt, G.lazy = function(v) {
    return {
      $$typeof: Y,
      _payload: { _status: -1, _result: v },
      _init: cl
    };
  }, G.memo = function(v, b) {
    return {
      $$typeof: Rl,
      type: v,
      compare: b === void 0 ? null : b
    };
  }, G.startTransition = Dt, G.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, G.use = function(v) {
    return k.H.use(v);
  }, G.useActionState = function(v, b, U) {
    return k.H.useActionState(v, b, U);
  }, G.useCallback = function(v, b) {
    return k.H.useCallback(v, b);
  }, G.useContext = function(v) {
    return k.H.useContext(v);
  }, G.useDebugValue = function() {
  }, G.useDeferredValue = function(v, b) {
    return k.H.useDeferredValue(v, b);
  }, G.useEffect = function(v, b) {
    return k.H.useEffect(v, b);
  }, G.useEffectEvent = function(v) {
    return k.H.useEffectEvent(v);
  }, G.useId = function() {
    return k.H.useId();
  }, G.useImperativeHandle = function(v, b, U) {
    return k.H.useImperativeHandle(v, b, U);
  }, G.useInsertionEffect = function(v, b) {
    return k.H.useInsertionEffect(v, b);
  }, G.useLayoutEffect = function(v, b) {
    return k.H.useLayoutEffect(v, b);
  }, G.useMemo = function(v, b) {
    return k.H.useMemo(v, b);
  }, G.useOptimistic = function(v, b) {
    return k.H.useOptimistic(v, b);
  }, G.useReducer = function(v, b, U) {
    return k.H.useReducer(v, b, U);
  }, G.useRef = function(v) {
    return k.H.useRef(v);
  }, G.useState = function(v) {
    return k.H.useState(v);
  }, G.useSyncExternalStore = function(v, b, U) {
    return k.H.useSyncExternalStore(
      v,
      b,
      U
    );
  }, G.useTransition = function() {
    return k.H.useTransition();
  }, G.version = "19.3.1", G;
}
var Fy;
function _0() {
  return Fy || (Fy = 1, S0.exports = fh()), S0.exports;
}
var rl = _0(), T0 = { exports: {} }, Ql = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Iy;
function ch() {
  if (Iy) return Ql;
  Iy = 1;
  var z = _0();
  function j(Y) {
    var T = "https://react.dev/errors/" + Y;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var H = 2; H < arguments.length; H++)
        T += "&args[]=" + encodeURIComponent(arguments[H]);
    }
    return "Minified React error #" + Y + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function w() {
  }
  var r = {
    d: {
      f: w,
      r: function() {
        throw Error(j(522));
      },
      D: w,
      C: w,
      L: w,
      m: w,
      X: w,
      S: w,
      M: w
    },
    p: 0,
    findDOMNode: null
  }, Nt = Symbol.for("react.portal"), At = Symbol.for("react.recoverable"), qt = Symbol.for("react.optimistic_key");
  function su(Y, T, H) {
    var Nl = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Nt,
      key: Nl == null ? null : Nl === qt ? qt : "" + Nl,
      children: Y,
      containerInfo: T,
      implementation: H
    };
  }
  var Tl = z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Rl(Y, T) {
    if (Y === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return Ql.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, Ql.browser = function(Y) {
    return { $$typeof: At, _reason: Y };
  }, Ql.createPortal = function(Y, T) {
    var H = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(j(299));
    return su(Y, T, null, H);
  }, Ql.flushSync = function(Y) {
    var T = Tl.T, H = r.p;
    try {
      if (Tl.T = null, r.p = 2, Y) return Y();
    } finally {
      Tl.T = T, r.p = H, r.d.f();
    }
  }, Ql.preconnect = function(Y, T) {
    typeof Y == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, r.d.C(Y, T));
  }, Ql.prefetchDNS = function(Y) {
    typeof Y == "string" && r.d.D(Y);
  }, Ql.preinit = function(Y, T) {
    if (typeof Y == "string" && T && typeof T.as == "string") {
      var H = T.as, Nl = Rl(H, T.crossOrigin), kl = typeof T.integrity == "string" ? T.integrity : void 0, Kl = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      H === "style" ? r.d.S(
        Y,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: Nl,
          integrity: kl,
          fetchPriority: Kl
        }
      ) : H === "script" && r.d.X(Y, {
        crossOrigin: Nl,
        integrity: kl,
        fetchPriority: Kl,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, Ql.preinitModule = function(Y, T) {
    if (typeof Y == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var H = Rl(
            T.as,
            T.crossOrigin
          );
          r.d.M(Y, {
            crossOrigin: H,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0,
            fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0
          });
        }
      } else T == null && r.d.M(Y);
  }, Ql.preload = function(Y, T) {
    if (typeof Y == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var H = T.as, Nl = Rl(H, T.crossOrigin);
      r.d.L(Y, H, {
        crossOrigin: Nl,
        integrity: typeof T.integrity == "string" ? T.integrity : void 0,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0,
        type: typeof T.type == "string" ? T.type : void 0,
        fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0,
        referrerPolicy: typeof T.referrerPolicy == "string" ? T.referrerPolicy : void 0,
        imageSrcSet: typeof T.imageSrcSet == "string" ? T.imageSrcSet : void 0,
        imageSizes: typeof T.imageSizes == "string" ? T.imageSizes : void 0,
        media: typeof T.media == "string" ? T.media : void 0
      });
    }
  }, Ql.preloadModule = function(Y, T) {
    if (typeof Y == "string")
      if (T) {
        var H = Rl(T.as, T.crossOrigin);
        r.d.m(Y, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: H,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0,
          nonce: typeof T.nonce == "string" ? T.nonce : void 0,
          fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0
        });
      } else r.d.m(Y);
  }, Ql.requestFormReset = function(Y) {
    r.d.r(Y);
  }, Ql.unstable_batchedUpdates = function(Y, T) {
    return Y(T);
  }, Ql.useFormState = function(Y, T, H) {
    return Tl.H.useFormState(Y, T, H);
  }, Ql.useFormStatus = function() {
    return Tl.H.useHostTransitionStatus();
  }, Ql.version = "19.3.1", Ql;
}
var ky;
function id() {
  if (ky) return T0.exports;
  ky = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (j) {
        console.error(j);
      }
  }
  return z(), T0.exports = ch(), T0.exports;
}
var ih = id(), E0 = { exports: {} }, an = {}, b0 = { exports: {} }, z0 = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Py;
function oh() {
  return Py || (Py = 1, (function(z) {
    function j(O, q) {
      var B = O.length;
      O.push(q);
      l: for (; 0 < B; ) {
        var cl = B - 1 >>> 1, tl = O[cl];
        if (0 < Nt(tl, q))
          O[cl] = q, O[B] = tl, B = cl;
        else break l;
      }
    }
    function w(O) {
      return O.length === 0 ? null : O[0];
    }
    function r(O) {
      if (O.length === 0) return null;
      var q = O[0], B = O.pop();
      if (B !== q) {
        O[0] = B;
        l: for (var cl = 0, tl = O.length, Dt = tl >>> 1; cl < Dt; ) {
          var It = 2 * (cl + 1) - 1, Wu = O[It], v = It + 1, b = O[v];
          if (0 > Nt(Wu, B))
            v < tl && 0 > Nt(b, Wu) ? (O[cl] = b, O[v] = B, cl = v) : (O[cl] = Wu, O[It] = B, cl = It);
          else if (v < tl && 0 > Nt(b, B))
            O[cl] = b, O[v] = B, cl = v;
          else break l;
        }
      }
      return q;
    }
    function Nt(O, q) {
      var B = O.sortIndex - q.sortIndex;
      return B !== 0 ? B : O.id - q.id;
    }
    if (z.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var At = performance;
      z.unstable_now = function() {
        return At.now();
      };
    } else {
      var qt = Date, su = qt.now();
      z.unstable_now = function() {
        return qt.now() - su;
      };
    }
    var Tl = [], Rl = [], Y = 1, T = null, H = 3, Nl = !1, kl = !1, Kl = !1, ol = !1, dt = typeof setTimeout == "function" ? setTimeout : null, Pl = typeof clearTimeout == "function" ? clearTimeout : null, Ju = typeof setImmediate < "u" ? setImmediate : null;
    function Bt(O) {
      for (var q = w(Rl); q !== null; ) {
        if (q.callback === null) r(Rl);
        else if (q.startTime <= O)
          r(Rl), q.sortIndex = q.expirationTime, j(Tl, q);
        else break;
        q = w(Rl);
      }
    }
    function pt(O) {
      if (Kl = !1, Bt(O), !kl)
        if (w(Tl) !== null)
          kl = !0, lt || (lt = !0, tt());
        else {
          var q = w(Rl);
          q !== null && Al(pt, q.startTime - O);
        }
    }
    var lt = !1, V = -1, k = 5, Gt = -1;
    function st() {
      return ol ? !0 : !(z.unstable_now() - Gt < k);
    }
    function ht() {
      if (ol = !1, lt) {
        var O = z.unstable_now();
        Gt = O;
        var q = !0;
        try {
          l: {
            kl = !1, Kl && (Kl = !1, Pl(V), V = -1), Nl = !0;
            var B = H;
            try {
              t: {
                for (Bt(O), T = w(Tl); T !== null && !(T.expirationTime > O && st()); ) {
                  var cl = T.callback;
                  if (typeof cl == "function") {
                    T.callback = null, H = T.priorityLevel;
                    var tl = cl(
                      T.expirationTime <= O
                    );
                    if (O = z.unstable_now(), typeof tl == "function") {
                      T.callback = tl, Bt(O), q = !0;
                      break t;
                    }
                    T === w(Tl) && r(Tl), Bt(O);
                  } else r(Tl);
                  T = w(Tl);
                }
                if (T !== null) q = !0;
                else {
                  var Dt = w(Rl);
                  Dt !== null && Al(
                    pt,
                    Dt.startTime - O
                  ), q = !1;
                }
              }
              break l;
            } finally {
              T = null, H = B, Nl = !1;
            }
            q = void 0;
          }
        } finally {
          q ? tt() : lt = !1;
        }
      }
    }
    var tt;
    if (typeof Ju == "function")
      tt = function() {
        Ju(ht);
      };
    else if (typeof MessageChannel < "u") {
      var hu = new MessageChannel(), wu = hu.port2;
      hu.port1.onmessage = ht, tt = function() {
        wu.postMessage(null);
      };
    } else
      tt = function() {
        dt(ht, 0);
      };
    function Al(O, q) {
      V = dt(function() {
        O(z.unstable_now());
      }, q);
    }
    z.unstable_IdlePriority = 5, z.unstable_ImmediatePriority = 1, z.unstable_LowPriority = 4, z.unstable_NormalPriority = 3, z.unstable_Profiling = null, z.unstable_UserBlockingPriority = 2, z.unstable_cancelCallback = function(O) {
      O.callback = null;
    }, z.unstable_forceFrameRate = function(O) {
      0 > O || 125 < O ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : k = 0 < O ? Math.floor(1e3 / O) : 5;
    }, z.unstable_getCurrentPriorityLevel = function() {
      return H;
    }, z.unstable_next = function(O) {
      switch (H) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = H;
      }
      var B = H;
      H = q;
      try {
        return O();
      } finally {
        H = B;
      }
    }, z.unstable_requestPaint = function() {
      ol = !0;
    }, z.unstable_runWithPriority = function(O, q) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var B = H;
      H = O;
      try {
        return q();
      } finally {
        H = B;
      }
    }, z.unstable_scheduleCallback = function(O, q, B) {
      var cl = z.unstable_now();
      switch (typeof B == "object" && B !== null ? (B = B.delay, B = typeof B == "number" && 0 < B ? cl + B : cl) : B = cl, O) {
        case 1:
          var tl = -1;
          break;
        case 2:
          tl = 250;
          break;
        case 5:
          tl = 1073741823;
          break;
        case 4:
          tl = 1e4;
          break;
        default:
          tl = 5e3;
      }
      return tl = B + tl, O = {
        id: Y++,
        callback: q,
        priorityLevel: O,
        startTime: B,
        expirationTime: tl,
        sortIndex: -1
      }, B > cl ? (O.sortIndex = B, j(Rl, O), w(Tl) === null && O === w(Rl) && (Kl ? (Pl(V), V = -1) : Kl = !0, Al(pt, B - cl))) : (O.sortIndex = tl, j(Tl, O), kl || Nl || (kl = !0, lt || (lt = !0, tt()))), O;
    }, z.unstable_shouldYield = st, z.unstable_wrapCallback = function(O) {
      var q = H;
      return function() {
        var B = H;
        H = q;
        try {
          return O.apply(this, arguments);
        } finally {
          H = B;
        }
      };
    };
  })(z0)), z0;
}
var ld;
function vh() {
  return ld || (ld = 1, b0.exports = oh()), b0.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var td;
function mh() {
  if (td) return an;
  td = 1;
  var z = vh(), j = _0(), w = id();
  function r(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var u = 2; u < arguments.length; u++)
        t += "&args[]=" + encodeURIComponent(arguments[u]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Nt(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function At(l) {
    for (var t = l, u = t; u && !u.alternate; )
      t = u, (t.flags & 4098) !== 0 && (l = t.return), u = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? l : null;
  }
  function qt(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function su(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Tl(l) {
    if (At(l) !== l)
      throw Error(r(188));
  }
  function Rl(l) {
    var t = l.alternate;
    if (!t) {
      if (t = At(l), t === null) throw Error(r(188));
      return t !== l ? null : l;
    }
    for (var u = l, a = t; ; ) {
      var e = u.return;
      if (e === null) break;
      var n = e.alternate;
      if (n === null) {
        if (a = e.return, a !== null) {
          u = a;
          continue;
        }
        break;
      }
      if (e.child === n.child) {
        for (n = e.child; n; ) {
          if (n === u) return Tl(e), l;
          if (n === a) return Tl(e), t;
          n = n.sibling;
        }
        throw Error(r(188));
      }
      if (u.return !== a.return) u = e, a = n;
      else {
        for (var f = !1, c = e.child; c; ) {
          if (c === u) {
            f = !0, u = e, a = n;
            break;
          }
          if (c === a) {
            f = !0, a = e, u = n;
            break;
          }
          c = c.sibling;
        }
        if (!f) {
          for (c = n.child; c; ) {
            if (c === u) {
              f = !0, u = n, a = e;
              break;
            }
            if (c === a) {
              f = !0, a = n, u = e;
              break;
            }
            c = c.sibling;
          }
          if (!f) throw Error(r(189));
        }
      }
      if (u.alternate !== a) throw Error(r(190));
    }
    if (u.tag !== 3) throw Error(r(188));
    return u.stateNode.current === u ? l : t;
  }
  function Y(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = Y(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  function T(l, t, u, a, e, n) {
    for (; l !== null; ) {
      if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && u(l, a, e, n) || (l.tag !== 22 || l.memoizedState === null) && (t || l.tag !== 5 && l.tag !== 27) && T(
        l.child,
        t,
        u,
        a,
        e,
        n
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function H(l) {
    for (l = l.return; l !== null; ) {
      if (l.tag === 3 || l.tag === 5 || l.tag === 27) return l;
      l = l.return;
    }
    return null;
  }
  function Nl(l) {
    var t = !1;
    for (l = l.return; l !== null && (l.tag === 4 && (t = !0), !(l.tag === 3 || l.tag === 5 || l.tag === 27)); )
      l = l.return;
    return t;
  }
  function kl(l) {
    var t = [null, null], u = H(l);
    return u === null || Kl(
      t,
      l,
      u.child,
      { foundSelf: !1 }
    ), t;
  }
  function Kl(l, t, u, a) {
    for (; u !== null; ) {
      if (u === t) a.foundSelf = !0;
      else if (u.tag === 5 || u.tag === 27 || u.tag === 6) {
        if (a.foundSelf) return l[1] = u, !0;
        l[0] = u;
      } else if ((u.tag !== 22 || u.memoizedState === null) && Kl(
        l,
        t,
        u.child,
        a
      ))
        return !0;
      u = u.sibling;
    }
    return !1;
  }
  function ol(l) {
    switch (l.tag) {
      case 5:
      case 27:
      case 6:
        return l.stateNode;
      case 3:
        return l.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var dt = null, Pl = null;
  function Ju(l, t, u) {
    return l === u ? !0 : l === t ? (dt = l, !0) : !1;
  }
  function Bt(l, t, u) {
    return l === u ? (Pl = l, !1) : l === t ? (Pl !== null && (dt = l), !0) : !1;
  }
  function pt(l) {
    if (l === null) return null;
    do
      l = l === null ? null : l.return;
    while (l && l.tag !== 5 && l.tag !== 27 && l.tag !== 3);
    return l || null;
  }
  function lt(l, t, u) {
    for (var a = 0, e = l; e; e = u(e)) a++;
    e = 0;
    for (var n = t; n; n = u(n)) e++;
    for (; 0 < a - e; ) l = u(l), a--;
    for (; 0 < e - a; ) t = u(t), e--;
    for (; a--; ) {
      if (l === t || t !== null && l === t.alternate)
        return l;
      l = u(l), t = u(t);
    }
    return null;
  }
  var V = Object.assign, k = Symbol.for("react.element"), Gt = Symbol.for("react.transitional.element"), st = Symbol.for("react.portal"), ht = Symbol.for("react.fragment"), tt = Symbol.for("react.strict_mode"), hu = Symbol.for("react.profiler"), wu = Symbol.for("react.consumer"), Al = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), q = Symbol.for("react.suspense"), B = Symbol.for("react.suspense_list"), cl = Symbol.for("react.memo"), tl = Symbol.for("react.lazy"), Dt = Symbol.for("react.activity"), It = Symbol.for("react.legacy_hidden"), Wu = Symbol.for("react.memo_cache_sentinel"), v = Symbol.for("react.view_transition"), b = Symbol.for("react.recoverable"), U = Symbol.iterator;
  function C(l) {
    return l === null || typeof l != "object" ? null : (l = U && l[U] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var $ = Symbol.for("react.client.reference");
  function F(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === $ ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case ht:
        return "Fragment";
      case hu:
        return "Profiler";
      case tt:
        return "StrictMode";
      case q:
        return "Suspense";
      case B:
        return "SuspenseList";
      case Dt:
        return "Activity";
      case v:
        return "ViewTransition";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case st:
          return "Portal";
        case Al:
          return l.displayName || "Context";
        case wu:
          return (l._context.displayName || "Context") + ".Consumer";
        case O:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case cl:
          return t = l.displayName || null, t !== null ? t : F(l.type) || "Memo";
        case tl:
          t = l._payload, l = l._init;
          try {
            return F(l(t));
          } catch {
          }
      }
    return null;
  }
  var P = Array.isArray, D = j.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, p = w.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, kt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Gf = [], Sa = -1;
  function Xt(l) {
    return { current: l };
  }
  function Hl(l) {
    0 > Sa || (l.current = Gf[Sa], Gf[Sa] = null, Sa--);
  }
  function vl(l, t) {
    Sa++, Gf[Sa] = l.current, l.current = t;
  }
  var Qt = Xt(null), oe = Xt(null), gu = Xt(null), nn = Xt(null);
  function fn(l, t) {
    switch (vl(gu, t), vl(oe, l), vl(Qt, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? ey(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = ey(t), l = ny(t, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    Hl(Qt), vl(Qt, l);
  }
  function Ta() {
    Hl(Qt), Hl(oe), Hl(gu);
  }
  function Xf(l) {
    var t = l.memoizedState;
    t !== null && (fe._currentValue = t.memoizedState, vl(nn, l)), t = Qt.current;
    var u = ny(t, l.type);
    t !== u && (vl(oe, l), vl(Qt, u));
  }
  function cn(l) {
    oe.current === l && (Hl(Qt), Hl(oe)), nn.current === l && (Hl(nn), fe._currentValue = kt);
  }
  var Qf, O0;
  function ru(l) {
    if (Qf === void 0)
      try {
        throw Error();
      } catch (u) {
        var t = u.stack.trim().match(/\n( *(at )?)/);
        Qf = t && t[1] || "", O0 = -1 < u.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < u.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Qf + l + O0;
  }
  var jf = !1;
  function Zf(l, t) {
    if (!l || jf) return "";
    jf = !0;
    var u = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var E = function() {
                throw Error();
              };
              if (Object.defineProperty(E.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(E, []);
                } catch (_) {
                  var m = _;
                }
                Reflect.construct(l, [], E);
              } else {
                try {
                  E.call();
                } catch (_) {
                  m = _;
                }
                E = !1;
                try {
                  var h = Object.getOwnPropertyDescriptor(
                    l.prototype,
                    "props"
                  );
                  Object.defineProperty(l.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), E = !0, new l();
                } finally {
                  E && (h !== void 0 ? Object.defineProperty(l.prototype, "props", h) : delete l.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (_) {
                m = _;
              }
              (E = l()) && typeof E.catch == "function" && E.catch(function() {
              });
            }
          } catch (_) {
            if (_ && m && typeof _.stack == "string")
              return [_.stack, m.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var e = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      e && e.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = a.DetermineComponentFrameRoot(), f = n[0], c = n[1];
      if (f && c) {
        var i = f.split(`
`), d = c.split(`
`);
        for (e = a = 0; a < i.length && !i[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; e < d.length && !d[e].includes(
          "DetermineComponentFrameRoot"
        ); )
          e++;
        if (a === i.length || e === d.length)
          for (a = i.length - 1, e = d.length - 1; 1 <= a && 0 <= e && i[a] !== d[e]; )
            e--;
        for (; 1 <= a && 0 <= e; a--, e--)
          if (i[a] !== d[e]) {
            if (a !== 1 || e !== 1)
              do
                if (a--, e--, 0 > e || i[a] !== d[e]) {
                  var g = `
` + i[a].replace(" at new ", " at ");
                  return l.displayName && g.includes("<anonymous>") && (g = g.replace("<anonymous>", l.displayName)), g;
                }
              while (1 <= a && 0 <= e);
            break;
          }
      }
    } finally {
      jf = !1, Error.prepareStackTrace = u;
    }
    return (u = l ? l.displayName || l.name : "") ? ru(u) : "";
  }
  function vd(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return ru(l.type);
      case 16:
        return ru("Lazy");
      case 13:
        return l.child !== t && t !== null ? ru("Suspense Fallback") : ru("Suspense");
      case 19:
        return ru("SuspenseList");
      case 0:
      case 15:
        return Zf(l.type, !1);
      case 11:
        return Zf(l.type.render, !1);
      case 1:
        return Zf(l.type, !0);
      case 31:
        return ru("Activity");
      case 30:
        return ru("ViewTransition");
      default:
        return "";
    }
  }
  function N0(l) {
    try {
      var t = "", u = null;
      do
        t += vd(l, u), u = l, l = l.return;
      while (l);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Vf = Object.prototype.hasOwnProperty, xf = z.unstable_scheduleCallback, Lf = z.unstable_cancelCallback, md = z.unstable_shouldYield, yd = z.unstable_requestPaint, ut = z.unstable_now, dd = z.unstable_getCurrentPriorityLevel, A0 = z.unstable_ImmediatePriority, D0 = z.unstable_UserBlockingPriority, on = z.unstable_NormalPriority, sd = z.unstable_LowPriority, M0 = z.unstable_IdlePriority, hd = z.log, gd = z.unstable_setDisableYieldValue, ve = null, at = null;
  function Su(l) {
    if (typeof hd == "function" && gd(l), at && typeof at.setStrictMode == "function")
      try {
        at.setStrictMode(ve, l);
      } catch {
      }
  }
  var et = Math.clz32 ? Math.clz32 : Td, rd = Math.log, Sd = Math.LN2;
  function Td(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (rd(l) / Sd | 0) | 0;
  }
  var vn = 256, mn = 262144, yn = 4194304;
  function $u(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & -l;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function dn(l, t, u) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var e = 0, n = l.suspendedLanes, f = l.pingedLanes;
    l = l.warmLanes;
    var c = a & 134217727;
    return c !== 0 ? (a = c & ~n, a !== 0 ? e = $u(a) : (f &= c, f !== 0 ? e = $u(f) : u || (u = c & ~l, u !== 0 && (e = $u(u))))) : (c = a & ~n, c !== 0 ? e = $u(c) : f !== 0 ? e = $u(f) : u || (u = a & ~l, u !== 0 && (e = $u(u)))), e === 0 ? 0 : t !== 0 && t !== e && (t & n) === 0 && (n = e & -e, u = t & -t, n >= u || n === 32 && (u & 4194048) !== 0) ? t : e;
  }
  function me(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function U0(l, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= t; 0 < u; ) {
        var a = 31 - et(u), e = 1 << a;
        t |= l[a], u &= ~e;
      }
    return t;
  }
  function Ed(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function C0() {
    var l = yn;
    return yn <<= 1, (yn & 62914560) === 0 && (yn = 4194304), l;
  }
  function Kf(l) {
    for (var t = [], u = 0; 31 > u; u++) t.push(l);
    return t;
  }
  function ye(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function bd(l, t, u, a, e, n) {
    var f = l.pendingLanes;
    l.pendingLanes = u, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= u, l.entangledLanes &= u, l.errorRecoveryDisabledLanes &= u, l.shellSuspendCounter = 0;
    var c = l.entanglements, i = l.expirationTimes, d = l.hiddenUpdates;
    for (u = f & ~u; 0 < u; ) {
      var g = 31 - et(u), E = 1 << g;
      c[g] = 0, i[g] = -1;
      var m = d[g];
      if (m !== null)
        for (d[g] = null, g = 0; g < m.length; g++) {
          var h = m[g];
          h !== null && (h.lane &= -536870913);
        }
      u &= ~E;
    }
    a !== 0 && R0(l, a, 0), n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(f & ~t));
  }
  function R0(l, t, u) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - et(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | u & 261930;
  }
  function H0(l, t) {
    var u = l.entangledLanes |= t;
    for (l = l.entanglements; u; ) {
      var a = 31 - et(u), e = 1 << a;
      e & t | l[a] & t && (l[a] |= t), u &= ~e;
    }
  }
  function Y0(l, t) {
    var u = t & -t;
    return u = (u & 42) !== 0 ? 1 : Jf(u), (u & (l.suspendedLanes | t)) !== 0 ? 0 : u;
  }
  function Jf(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function wf(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function q0() {
    var l = p.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : Vy(l.type));
  }
  function B0(l, t) {
    var u = p.p;
    try {
      return p.p = l, t();
    } finally {
      p.p = u;
    }
  }
  var Pt = Math.random().toString(36).slice(2), Yl = "__reactFiber$" + Pt, Jl = "__reactProps$" + Pt, Ea = "__reactContainer$" + Pt, p0 = "__reactEvents$" + Pt, zd = "__reactListeners$" + Pt, _d = "__reactHandles$" + Pt, G0 = "__reactResources$" + Pt, de = "__reactMarker$" + Pt, sn = "__reactLoad$" + Pt;
  function hn(l) {
    delete l[Yl], delete l[Jl], delete l[zd], delete l[_d];
  }
  function Fu(l) {
    var t;
    if (t = l[Yl]) return t;
    for (var u = l.parentNode; u; ) {
      if (t = u[Ea] || u[Yl]) {
        if (u = t.alternate, t.child !== null || u !== null && u.child !== null)
          for (l = zy(l); l !== null; ) {
            if (u = l[Yl]) return u;
            l = zy(l);
          }
        return t;
      }
      l = u, u = l.parentNode;
    }
    return null;
  }
  function ba(l) {
    if (l = l[Yl] || l[Ea]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function se(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(r(33));
  }
  function za(l) {
    var t = l[G0];
    return t || (t = l[G0] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Dl(l) {
    l[de] = !0;
  }
  function X0(l) {
    l[sn] = void 0;
  }
  var Q0 = /* @__PURE__ */ new Set(), j0 = {};
  function Iu(l, t) {
    _a(l, t), _a(l + "Capture", t);
  }
  function _a(l, t) {
    for (j0[l] = t, l = 0; l < t.length; l++)
      Q0.add(t[l]);
  }
  var Od = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Z0 = {}, V0 = {};
  function Nd(l) {
    return Vf.call(V0, l) ? !0 : Vf.call(Z0, l) ? !1 : Od.test(l) ? V0[l] = !0 : (Z0[l] = !0, !1);
  }
  var I = !1;
  function x0() {
    var l = I;
    return I = !1, l;
  }
  function gn(l, t, u) {
    if (Nd(t))
      if (u === null) l.removeAttribute(t);
      else {
        switch (typeof u) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, u);
      }
  }
  function rn(l, t, u) {
    if (u === null) l.removeAttribute(t);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, u);
    }
  }
  function lu(l, t, u, a) {
    if (a === null) l.removeAttribute(u);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(u);
          return;
      }
      l.setAttributeNS(t, u, a);
    }
  }
  function nt(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function L0(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ad(l, t, u) {
    var a = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var e = a.get, n = a.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return e.call(this);
        },
        set: function(f) {
          u = "" + f, n.call(this, f);
        }
      }), Object.defineProperty(l, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return u;
        },
        setValue: function(f) {
          u = "" + f;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function Wf(l) {
    if (!l._valueTracker) {
      var t = L0(l) ? "checked" : "value";
      l._valueTracker = Ad(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function K0(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var u = t.getValue(), a = "";
    return l && (a = L0(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== u ? (t.setValue(l), !0) : !1;
  }
  var Dd = /[\n"\\]/g;
  function gt(l) {
    return l.replace(
      Dd,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function $f(l, t, u, a, e, n, f, c) {
    l.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.type = f : l.removeAttribute("type"), t != null ? f === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + nt(t)) : l.value !== "" + nt(t) && (l.value = "" + nt(t)) : f !== "submit" && f !== "reset" || l.removeAttribute("value"), t != null ? f === "number" && l.value == t ? Ff(l, nt(l.value)) : Ff(l, nt(t)) : u != null ? Ff(l, nt(u)) : a != null && l.removeAttribute("value"), e == null && n != null && (l.defaultChecked = !!n), e != null && (l.checked = e && typeof e != "function" && typeof e != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.name = "" + nt(c) : l.removeAttribute("name");
  }
  function J0(l, t, u, a, e, n, f, c) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || u != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        Wf(l);
        return;
      }
      u = u != null ? "" + nt(u) : "", t = t != null ? "" + nt(t) : u, c || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? e, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = c ? l.checked : !!a, l.defaultChecked = !!a, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (l.name = f), Wf(l);
  }
  function Ff(l, t) {
    l.defaultValue !== "" + t && (l.defaultValue = "" + t);
  }
  function Oa(l, t, u, a) {
    if (l = l.options, t) {
      t = {};
      for (var e = 0; e < u.length; e++)
        t["$" + u[e]] = !0;
      for (u = 0; u < l.length; u++)
        e = t.hasOwnProperty("$" + l[u].value), l[u].selected !== e && (l[u].selected = e), e && a && (l[u].defaultSelected = !0);
    } else {
      for (u = "" + nt(u), t = null, e = 0; e < l.length; e++) {
        if (l[e].value === u) {
          l[e].selected = !0, a && (l[e].defaultSelected = !0);
          return;
        }
        t !== null || l[e].disabled || (t = l[e]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function w0(l, t, u) {
    if (t != null && (t = "" + nt(t), t !== l.value && (l.value = t), u == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = u != null ? "" + nt(u) : "";
  }
  function W0(l, t, u, a) {
    if (t == null) {
      if (a != null) {
        if (u != null) throw Error(r(92));
        if (P(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        u = a;
      }
      u == null && (u = ""), t = u;
    }
    u = nt(t), l.defaultValue = u, a = l.textContent, a === u && a !== "" && a !== null && (l.value = a), Wf(l);
  }
  function Na(l, t) {
    if (t) {
      var u = l.firstChild;
      if (u && u === l.lastChild && u.nodeType === 3) {
        u.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Md = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function $0(l, t, u) {
    var a = t.indexOf("--") === 0;
    u == null || typeof u == "boolean" || u === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, u) : typeof u != "number" || u === 0 || Md.has(t) ? t === "float" ? l.cssFloat = u : l[t] = ("" + u).trim() : l[t] = u + "px";
  }
  function F0(l, t, u) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (l = l.style, u != null) {
      for (var a in u)
        !u.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "", I = !0);
      for (var e in t)
        a = t[e], t.hasOwnProperty(e) && u[e] !== a && ($0(l, e, a), I = !0);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && $0(l, n, t[n]);
  }
  function If(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Ud = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Cd = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Sn(l) {
    return Cd.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function jt() {
  }
  var kf = null;
  function Pf(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Aa = null, Da = null;
  function I0(l) {
    var t = ba(l);
    if (t && (l = t.stateNode)) {
      var u = l[Jl] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if ($f(
            l,
            u.value,
            u.defaultValue,
            u.defaultValue,
            u.checked,
            u.defaultChecked,
            u.type,
            u.name
          ), t = u.name, u.type === "radio" && t != null) {
            for (u = l; u.parentNode; ) u = u.parentNode;
            for (u = u.querySelectorAll(
              'input[name="' + gt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < u.length; t++) {
              var a = u[t];
              if (a !== l && a.form === l.form) {
                var e = a[Jl] || null;
                if (!e) throw Error(r(90));
                $f(
                  a,
                  e.value,
                  e.defaultValue,
                  e.defaultValue,
                  e.checked,
                  e.defaultChecked,
                  e.type,
                  e.name
                );
              }
            }
            for (t = 0; t < u.length; t++)
              a = u[t], a.form === l.form && K0(a);
          }
          break l;
        case "textarea":
          w0(l, u.value, u.defaultValue);
          break l;
        case "select":
          t = u.value, t != null && Oa(l, !!u.multiple, t, !1);
      }
    }
  }
  var lc = !1;
  function k0(l, t, u) {
    if (lc) return l(t, u);
    lc = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (lc = !1, (Aa !== null || Da !== null) && (Tf(), Aa && (t = Aa, l = Da, Da = Aa = null, I0(t), l)))
        for (t = 0; t < l.length; t++) I0(l[t]);
    }
  }
  function he(l, t) {
    var u = l.stateNode;
    if (u === null) return null;
    var a = u[Jl] || null;
    if (a === null) return null;
    u = a[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (l = l.type, a = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !a;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (u && typeof u != "function")
      throw Error(
        r(231, t, typeof u)
      );
    return u;
  }
  var tu = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), tc = !1;
  if (tu)
    try {
      var ge = {};
      Object.defineProperty(ge, "passive", {
        get: function() {
          tc = !0;
        }
      }), window.addEventListener("test", ge, ge), window.removeEventListener("test", ge, ge);
    } catch {
      tc = !1;
    }
  var Tu = null, uc = null, Tn = null;
  function P0() {
    if (Tn) return Tn;
    var l, t = uc, u = t.length, a, e = "value" in Tu ? Tu.value : Tu.textContent, n = e.length;
    for (l = 0; l < u && t[l] === e[l]; l++) ;
    var f = u - l;
    for (a = 1; a <= f && t[u - a] === e[n - a]; a++) ;
    return Tn = e.slice(l, 1 < a ? 1 - a : void 0);
  }
  function En(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function bn() {
    return !0;
  }
  function lo() {
    return !1;
  }
  function Zl(l) {
    function t(u, a, e, n, f) {
      this._reactName = u, this._targetInst = e, this.type = a, this.nativeEvent = n, this.target = f, this.currentTarget = null;
      for (var c in l)
        l.hasOwnProperty(c) && (u = l[c], this[c] = u ? u(n) : n[c]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? bn : lo, this.isPropagationStopped = lo, this;
    }
    return V(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var u = this.nativeEvent;
        u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != "unknown" && (u.returnValue = !1), this.isDefaultPrevented = bn);
      },
      stopPropagation: function() {
        var u = this.nativeEvent;
        u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0), this.isPropagationStopped = bn);
      },
      persist: function() {
      },
      isPersistent: bn
    }), t;
  }
  var Eu = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, zn = Zl(Eu), re = V({}, Eu, { view: 0, detail: 0 }), Rd = Zl(re), ac, ec, Se, _n = V({}, re, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: fc,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Se && (Se && l.type === "mousemove" ? (ac = l.screenX - Se.screenX, ec = l.screenY - Se.screenY) : ec = ac = 0, Se = l), ac);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : ec;
    }
  }), to = Zl(_n), Hd = V({}, _n, { dataTransfer: 0 }), Yd = Zl(Hd), qd = V({}, re, { relatedTarget: 0 }), nc = Zl(qd), Bd = V({}, Eu, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), pd = Zl(Bd), Gd = V({}, Eu, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Xd = Zl(Gd), Qd = V({}, Eu, { data: 0 }), uo = Zl(Qd), jd = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Zd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Vd = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function xd(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = Vd[l]) ? !!t[l] : !1;
  }
  function fc() {
    return xd;
  }
  var Ld = V({}, re, {
    key: function(l) {
      if (l.key) {
        var t = jd[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = En(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? Zd[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: fc,
    charCode: function(l) {
      return l.type === "keypress" ? En(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? En(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), Kd = Zl(Ld), Jd = V({}, _n, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), ao = Zl(Jd), wd = V({}, Eu, { submitter: 0 }), Wd = Zl(wd), $d = V({}, re, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: fc
  }), Fd = Zl($d), Id = V({}, Eu, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), kd = Zl(Id), Pd = V({}, _n, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), l1 = Zl(Pd), t1 = V({}, Eu, {
    newState: 0,
    oldState: 0,
    source: 0
  }), u1 = Zl(t1), a1 = [9, 13, 27, 32], cc = tu && "CompositionEvent" in window, Te = null;
  tu && "documentMode" in document && (Te = document.documentMode);
  var e1 = tu && "TextEvent" in window && !Te, eo = tu && (!cc || Te && 8 < Te && 11 >= Te), no = " ", fo = !1;
  function co(l, t) {
    switch (l) {
      case "keyup":
        return a1.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function io(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Ma = !1;
  function n1(l, t) {
    switch (l) {
      case "compositionend":
        return io(t);
      case "keypress":
        return t.which !== 32 ? null : (fo = !0, no);
      case "textInput":
        return l = t.data, l === no && fo ? null : l;
      default:
        return null;
    }
  }
  function f1(l, t) {
    if (Ma)
      return l === "compositionend" || !cc && co(l, t) ? (l = P0(), Tn = uc = Tu = null, Ma = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return eo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var c1 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function oo(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!c1[l.type] : t === "textarea";
  }
  function vo(l, t, u, a) {
    Aa ? Da ? Da.push(a) : Da = [a] : Aa = a, t = Nf(t, "onChange"), 0 < t.length && (u = new zn(
      "onChange",
      "change",
      null,
      u,
      a
    ), l.push({ event: u, listeners: t }));
  }
  var Ee = null, be = null;
  function i1(l) {
    km(l, 0);
  }
  function On(l) {
    var t = se(l);
    if (K0(t)) return l;
  }
  function mo(l, t) {
    if (l === "change") return t;
  }
  var yo = !1;
  if (tu) {
    var ic;
    if (tu) {
      var oc = "oninput" in document;
      if (!oc) {
        var so = document.createElement("div");
        so.setAttribute("oninput", "return;"), oc = typeof so.oninput == "function";
      }
      ic = oc;
    } else ic = !1;
    yo = ic && (!document.documentMode || 9 < document.documentMode);
  }
  function ho() {
    Ee && (Ee.detachEvent("onpropertychange", go), be = Ee = null);
  }
  function go(l) {
    if (l.propertyName === "value" && On(be)) {
      var t = [];
      vo(
        t,
        be,
        l,
        Pf(l)
      ), k0(i1, t);
    }
  }
  function o1(l, t, u) {
    l === "focusin" ? (ho(), Ee = t, be = u, Ee.attachEvent("onpropertychange", go)) : l === "focusout" && ho();
  }
  function v1(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return On(be);
  }
  function m1(l, t) {
    if (l === "click") return On(t);
  }
  function y1(l, t) {
    if (l === "input" || l === "change")
      return On(t);
  }
  function d1(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : d1;
  function ze(l, t) {
    if (ft(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var u = Object.keys(l), a = Object.keys(t);
    if (u.length !== a.length) return !1;
    for (a = 0; a < u.length; a++) {
      var e = u[a];
      if (!Vf.call(t, e) || !ft(l[e], t[e]))
        return !1;
    }
    return !0;
  }
  function vc(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  function ro(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function So(l, t) {
    var u = ro(l);
    l = 0;
    for (var a; u; ) {
      if (u.nodeType === 3) {
        if (a = l + u.textContent.length, l <= t && a >= t)
          return { node: u, offset: t - l };
        l = a;
      }
      l: {
        for (; u; ) {
          if (u.nextSibling) {
            u = u.nextSibling;
            break l;
          }
          u = u.parentNode;
        }
        u = void 0;
      }
      u = ro(u);
    }
  }
  function To(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? To(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Eo(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = vc(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var u = typeof t.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) l = t.contentWindow;
      else break;
      t = vc(l.document);
    }
    return t;
  }
  function mc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var s1 = tu && "documentMode" in document && 11 >= document.documentMode, Ua = null, yc = null, _e = null, dc = !1;
  function bo(l, t, u) {
    var a = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    dc || Ua == null || Ua !== vc(a) || (a = Ua, "selectionStart" in a && mc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), _e && ze(_e, a) || (_e = a, a = Nf(yc, "onSelect"), 0 < a.length && (t = new zn(
      "onSelect",
      "select",
      null,
      t,
      u
    ), l.push({ event: t, listeners: a }), t.target = Ua)));
  }
  function ku(l, t) {
    var u = {};
    return u[l.toLowerCase()] = t.toLowerCase(), u["Webkit" + l] = "webkit" + t, u["Moz" + l] = "moz" + t, u;
  }
  var Ca = {
    animationend: ku("Animation", "AnimationEnd"),
    animationiteration: ku("Animation", "AnimationIteration"),
    animationstart: ku("Animation", "AnimationStart"),
    transitionrun: ku("Transition", "TransitionRun"),
    transitionstart: ku("Transition", "TransitionStart"),
    transitioncancel: ku("Transition", "TransitionCancel"),
    transitionend: ku("Transition", "TransitionEnd")
  }, sc = {}, zo = {};
  tu && (zo = document.createElement("div").style, "AnimationEvent" in window || (delete Ca.animationend.animation, delete Ca.animationiteration.animation, delete Ca.animationstart.animation), "TransitionEvent" in window || delete Ca.transitionend.transition);
  function Pu(l) {
    if (sc[l]) return sc[l];
    if (!Ca[l]) return l;
    var t = Ca[l], u;
    for (u in t)
      if (t.hasOwnProperty(u) && u in zo)
        return sc[l] = t[u];
    return l;
  }
  var _o = Pu("animationend"), Oo = Pu("animationiteration"), No = Pu("animationstart"), h1 = Pu("transitionrun"), g1 = Pu("transitionstart"), r1 = Pu("transitioncancel"), Ao = Pu("transitionend"), Do = /* @__PURE__ */ new Map(), hc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  hc.push("scrollEnd");
  function Mt(l, t) {
    Do.set(l, t), Iu(t, [l]);
  }
  var S1 = 0;
  function uu(l, t) {
    if (l.name != null && l.name !== "auto") return l.name;
    if (t.autoName !== null) return t.autoName;
    l = Ht.identifierPrefix;
    var u = S1++;
    return l = "_" + l + "t_" + u.toString(32) + "_", t.autoName = l;
  }
  function Mo(l) {
    if (l == null || typeof l == "string")
      return l;
    var t = null, u = Fa;
    if (u !== null)
      for (var a = 0; a < u.length; a++) {
        var e = l[u[a]];
        if (e != null) {
          if (e === "none") return "none";
          t = t == null ? e : t + (" " + e);
        }
      }
    return t ?? l.default;
  }
  function au(l, t) {
    return l = Mo(l), t = Mo(t), t == null ? l === "auto" ? null : l : t === "auto" ? null : t;
  }
  var Nn = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, rt = [], Ra = 0, gc = 0;
  function An() {
    for (var l = Ra, t = gc = Ra = 0; t < l; ) {
      var u = rt[t];
      rt[t++] = null;
      var a = rt[t];
      rt[t++] = null;
      var e = rt[t];
      rt[t++] = null;
      var n = rt[t];
      if (rt[t++] = null, a !== null && e !== null) {
        var f = a.pending;
        f === null ? e.next = e : (e.next = f.next, f.next = e), a.pending = e;
      }
      n !== 0 && Uo(u, e, n);
    }
  }
  function Dn(l, t, u, a) {
    rt[Ra++] = l, rt[Ra++] = t, rt[Ra++] = u, rt[Ra++] = a, gc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function rc(l, t, u, a) {
    return Dn(l, t, u, a), Mn(l);
  }
  function la(l, t) {
    return Dn(l, null, null, t), Mn(l);
  }
  function Uo(l, t, u) {
    l.lanes |= u;
    var a = l.alternate;
    a !== null && (a.lanes |= u);
    for (var e = !1, n = l.return; n !== null; )
      n.childLanes |= u, a = n.alternate, a !== null && (a.childLanes |= u), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (e = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, e && t !== null && (e = 31 - et(u), l = n.hiddenUpdates, a = l[e], a === null ? l[e] = [t] : a.push(t), t.lane = u | 536870912), n) : null;
  }
  function Mn(l) {
    if (50 < Ke)
      throw Ke = 0, Sf = null, Error(r(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Ha = {};
  function T1(l, t, u, a) {
    this.tag = l, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function wl(l, t, u, a) {
    return new T1(l, t, u, a);
  }
  function Sc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function eu(l, t) {
    var u = l.alternate;
    return u === null ? (u = wl(
      l.tag,
      t,
      l.key,
      l.mode
    ), u.elementType = l.elementType, u.type = l.type, u.stateNode = l.stateNode, u.alternate = l, l.alternate = u) : (u.pendingProps = t, u.type = l.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = l.flags & 1206910976, u.childLanes = l.childLanes, u.lanes = l.lanes, u.child = l.child, u.memoizedProps = l.memoizedProps, u.memoizedState = l.memoizedState, u.updateQueue = l.updateQueue, t = l.dependencies, u.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, u.sibling = l.sibling, u.index = l.index, u.ref = l.ref, u.refCleanup = l.refCleanup, u;
  }
  function Co(l, t) {
    l.flags &= 1206910978;
    var u = l.alternate;
    return u === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = u.childLanes, l.lanes = u.lanes, l.child = u.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = u.memoizedProps, l.memoizedState = u.memoizedState, l.updateQueue = u.updateQueue, l.type = u.type, t = u.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Un(l, t, u, a, e, n) {
    var f = 0;
    if (a = l, typeof a == "function") Sc(a) && (f = 1);
    else if (typeof a == "string")
      f = ws(
        l,
        u,
        Qt.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (a) {
        case Dt:
          return l = wl(31, u, t, e), l.elementType = Dt, l.lanes = n, l;
        case ht:
          return ta(u.children, e, n, t);
        case tt:
          f = 8, e |= 24;
          break;
        case hu:
          return l = wl(12, u, t, e | 2), l.elementType = hu, l.lanes = n, l;
        case q:
          return l = wl(13, u, t, e), l.elementType = q, l.lanes = n, l;
        case B:
          return l = wl(19, u, t, e), l.elementType = B, l.lanes = n, l;
        case It:
        case v:
          return l = e | 32, l = wl(30, u, t, l), l.elementType = v, l.lanes = n, l.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, l;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case Al:
                f = 10;
                break l;
              case wu:
                f = 9;
                break l;
              case O:
                f = 11;
                break l;
              case cl:
                f = 14;
                break l;
              case tl:
                f = 16, a = null;
                break l;
            }
          f = 29, u = Error(
            r(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = wl(f, u, t, e), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function ta(l, t, u, a) {
    return l = wl(7, l, a, t), l.lanes = u, l;
  }
  function Tc(l, t, u) {
    return l = wl(6, l, null, t), l.lanes = u, l;
  }
  function Ro(l) {
    var t = wl(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function Ec(l, t, u) {
    return t = wl(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = u, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var Ho = /* @__PURE__ */ new WeakMap();
  function St(l, t) {
    if (typeof l == "object" && l !== null) {
      var u = Ho.get(l);
      return u !== void 0 ? u : (t = {
        value: l,
        source: t,
        stack: N0(t)
      }, Ho.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: N0(t)
    };
  }
  var Ya = [], qa = 0, Cn = null, Oe = 0, Tt = [], Et = 0, bu = null, Zt = 1, Vt = "";
  function nu(l, t) {
    Ya[qa++] = Oe, Ya[qa++] = Cn, Cn = l, Oe = t;
  }
  function Yo(l, t, u) {
    Tt[Et++] = Zt, Tt[Et++] = Vt, Tt[Et++] = bu, bu = l;
    var a = Zt;
    l = Vt;
    var e = 32 - et(a) - 1;
    a &= ~(1 << e), u += 1;
    var n = 32 - et(t) + e;
    if (30 < n) {
      var f = e - e % 5;
      n = (a & (1 << f) - 1).toString(32), a >>= f, e -= f, Zt = 1 << 32 - et(t) + e | u << e | a, Vt = n + l;
    } else
      Zt = 1 << n | u << e | a, Vt = l;
  }
  function Rn(l) {
    l.return !== null && (nu(l, 1), Yo(l, 1, 0));
  }
  function bc(l) {
    for (; l === Cn; )
      Cn = Ya[--qa], Ya[qa] = null, Oe = Ya[--qa], Ya[qa] = null;
    for (; l === bu; )
      bu = Tt[--Et], Tt[Et] = null, Vt = Tt[--Et], Tt[Et] = null, Zt = Tt[--Et], Tt[Et] = null;
  }
  function qo(l, t) {
    Tt[Et++] = Zt, Tt[Et++] = Vt, Tt[Et++] = bu, Zt = t.id, Vt = t.overflow, bu = l;
  }
  var Ml = null, ml = null, Z = !1, zu = null, bt = !1, zc = Error(r(519));
  function _u(l) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ne(St(t, l)), zc;
  }
  function Bo(l) {
    var t = l.stateNode, u = l.type, a = l.memoizedProps;
    switch (t[Yl] = l, t[Jl] = a, u) {
      case "dialog":
        L("cancel", t), L("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        L("load", t);
        break;
      case "video":
      case "audio":
        for (u = 0; u < we.length; u++)
          L(we[u], t);
        break;
      case "source":
        L("error", t);
        break;
      case "img":
      case "image":
      case "link":
        L("error", t), L("load", t);
        break;
      case "details":
        L("toggle", t);
        break;
      case "input":
        L("invalid", t), J0(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        L("invalid", t);
        break;
      case "textarea":
        L("invalid", t), W0(t, a.value, a.defaultValue, a.children);
    }
    u = a.children, typeof u != "string" && typeof u != "number" && typeof u != "bigint" || t.textContent === "" + u || a.suppressHydrationWarning === !0 || uy(t.textContent, u) ? (a.popover != null && (L("beforetoggle", t), L("toggle", t)), a.onScroll != null && L("scroll", t), a.onScrollEnd != null && L("scrollend", t), a.onClick != null && (t.onclick = jt), t = !0) : t = !1, t || _u(l, !0);
  }
  function Hn(l) {
    for (Ml = l.return; Ml; )
      switch (Ml.tag) {
        case 5:
        case 31:
        case 13:
          bt = !1;
          return;
        case 27:
        case 3:
          bt = !0;
          return;
        default:
          Ml = Ml.return;
      }
  }
  function Ba(l) {
    if (l !== Ml) return !1;
    if (!Z) return Hn(l), Z = !0, !1;
    var t = l.tag, u;
    if ((u = t !== 3 && t !== 27) && ((u = t === 5) && (u = l.type, u = !(u !== "form" && u !== "button") || ki(l.type, l.memoizedProps)), u = !u), u && ml && _u(l), Hn(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(r(317));
      ml = by(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(r(317));
      ml = by(l);
    } else
      t === 27 ? (t = ml, Qu(l.type) ? (l = c0, c0 = null, ml = l) : ml = t) : ml = Ml ? _t(l.stateNode.nextSibling) : null;
    return !0;
  }
  function ua() {
    ml = Ml = null, Z = !1;
  }
  function _c() {
    var l = zu;
    return l !== null && (Fl === null ? Fl = l : Fl.push.apply(
      Fl,
      l
    ), zu = null), l;
  }
  function Ne(l) {
    zu === null ? zu = [l] : zu.push(l);
  }
  var Oc = Xt(null), aa = null, fu = null;
  function Ou(l, t, u) {
    vl(Oc, t._currentValue), t._currentValue = u;
  }
  function cu(l) {
    l._currentValue = Oc.current, Hl(Oc);
  }
  function Yn(l, t, u) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === u) break;
      l = l.return;
    }
  }
  function Nc(l, t, u, a) {
    var e = l.child;
    for (e !== null && (e.return = l); e !== null; ) {
      var n = e.dependencies;
      if (n !== null) {
        var f = e.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = e;
          for (var i = 0; i < t.length; i++)
            if (c.context === t[i]) {
              n.lanes |= u, c = n.alternate, c !== null && (c.lanes |= u), Yn(
                n.return,
                u,
                l
              ), a || (f = null);
              break l;
            }
          n = c.next;
        }
      } else if (e.tag === 18) {
        if (f = e.return, f === null) throw Error(r(341));
        f.lanes |= u, n = f.alternate, n !== null && (n.lanes |= u), Yn(f, u, l), f = null;
      } else
        e.tag === 13 && e.memoizedState !== null && e.memoizedState.dehydrated === null ? (e.lanes |= u, f = e.alternate, f !== null && (f.lanes |= u), Yn(
          e.return,
          u,
          l
        ), f = e.child, f = f !== null ? f.sibling : null) : f = e.child;
      if (f !== null) f.return = e;
      else
        for (f = e; f !== null; ) {
          if (f === l) {
            f = null;
            break;
          }
          if (e = f.sibling, e !== null) {
            e.return = f.return, f = e;
            break;
          }
          f = f.return;
        }
      e = f;
    }
  }
  function ea(l, t, u, a) {
    l = null;
    for (var e = t, n = !1; e !== null; ) {
      if (!n) {
        if ((e.flags & 524288) !== 0) n = !0;
        else if ((e.flags & 262144) !== 0) break;
      }
      if (e.tag === 10) {
        var f = e.alternate;
        if (f === null) throw Error(r(387));
        if (f = f.memoizedProps, f !== null) {
          var c = e.type;
          ft(e.pendingProps.value, f.value) || (l !== null ? l.push(c) : l = [c]);
        }
      } else if (e === nn.current) {
        if (f = e.alternate, f === null) throw Error(r(387));
        f.memoizedState.memoizedState !== e.memoizedState.memoizedState && (l !== null ? l.push(fe) : l = [fe]);
      }
      e = e.return;
    }
    return l !== null && Nc(
      t,
      l,
      u,
      a
    ), t.flags |= 262144, l !== null;
  }
  function qn(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!ft(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function na(l) {
    aa = l, fu = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function ql(l) {
    return po(aa, l);
  }
  function Bn(l, t) {
    return aa === null && na(l), po(l, t);
  }
  function po(l, t) {
    var u = t._currentValue;
    if (t = { context: t, memoizedValue: u, next: null }, fu === null) {
      if (l === null) throw Error(r(308));
      fu = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else fu = fu.next = t;
    return u;
  }
  var E1 = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(u, a) {
        l.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(u) {
        return u();
      });
    };
  }, b1 = z.unstable_scheduleCallback, z1 = z.unstable_NormalPriority, El = {
    $$typeof: Al,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ac() {
    return {
      controller: new E1(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ae(l) {
    l.refCount--, l.refCount === 0 && b1(z1, function() {
      l.controller.abort();
    });
  }
  function Go(l, t) {
    if ((l.pendingLanes & 4194048) !== 0) {
      var u = l.transitionTypes;
      for (u === null && (u = l.transitionTypes = []), l = 0; l < t.length; l++) {
        var a = t[l];
        u.indexOf(a) === -1 && u.push(a);
      }
    }
  }
  var De = null;
  function _1(l) {
    var t = l.transitionTypes;
    return l.transitionTypes = null, t;
  }
  var Me = null, Dc = 0, fa = 0, pa = null;
  function O1(l, t) {
    if (Me === null) {
      var u = Me = [];
      Dc = 0, fa = xi(), pa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          u.push(a);
        }
      };
    }
    return Dc++, t.then(Xo, Xo), t;
  }
  function Xo() {
    if (--Dc === 0 && (De = null, Me !== null)) {
      pa !== null && (pa.status = "fulfilled");
      var l = Me;
      Me = null, fa = 0, pa = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function N1(l, t) {
    var u = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(e) {
        u.push(e);
      }
    };
    return l.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var e = 0; e < u.length; e++) (0, u[e])(t);
      },
      function(e) {
        for (a.status = "rejected", a.reason = e, e = 0; e < u.length; e++)
          (0, u[e])(void 0);
      }
    ), a;
  }
  var Qo = D.S;
  D.S = function(l, t) {
    if (Rm = ut(), typeof t == "object" && t !== null && typeof t.then == "function" && O1(l, t), De !== null)
      for (var u = le; u !== null; )
        Go(u, De), u = u.next;
    if (u = l.types, u !== null) {
      for (var a = le; a !== null; )
        Go(a, u), a = a.next;
      if (fa !== 0) {
        a = De, a === null && (a = De = []);
        for (var e = 0; e < u.length; e++) {
          var n = u[e];
          a.indexOf(n) === -1 && a.push(n);
        }
      }
    }
    Qo !== null && Qo(l, t);
  };
  var ca = Xt(null);
  function Mc() {
    var l = ca.current;
    return l !== null ? l : il.pooledCache;
  }
  function pn(l, t) {
    t === null ? vl(ca, ca.current) : vl(ca, t.pool);
  }
  function jo() {
    var l = Mc();
    return l === null ? null : { parent: El._currentValue, pool: l };
  }
  var Ga = Error(r(460)), Uc = Error(r(474)), Gn = Error(r(542)), Xn = { then: function() {
  } };
  function Zo(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Vo(l, t, u) {
    switch (u = l[u], u === void 0 ? l.push(t) : u !== t && (t.then(jt, jt), t = u), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Lo(l), l === void 0 && !("reason" in t) ? Error(r(600)) : l;
      default:
        if (typeof t.status == "string") t.then(jt, jt);
        else {
          if (l = il, l !== null && 100 < l.shellSuspendCounter)
            throw Error(r(482));
          l = t, l.status = "pending", l.then(
            function(a) {
              if (t.status === "pending") {
                var e = t;
                e.status = "fulfilled", e.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var e = t;
                e.status = "rejected", e.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, Lo(l), l;
        }
        throw oa = t, Ga;
    }
  }
  function ia(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (u) {
      throw u !== null && typeof u == "object" && typeof u.then == "function" ? (oa = u, Ga) : u;
    }
  }
  var oa = null;
  function xo() {
    if (oa === null) throw Error(r(459));
    var l = oa;
    return oa = null, l;
  }
  function Lo(l) {
    if (l === Ga || l === Gn)
      throw Error(r(483));
  }
  var Xa = null, Ue = 0;
  function Qn(l) {
    var t = Ue;
    return Ue += 1, Xa === null && (Xa = []), Vo(Xa, l, t);
  }
  function Nu(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function jn(l, t) {
    throw t.$$typeof === k ? Error(r(525)) : (l = Object.prototype.toString.call(t), Error(
      r(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function Ko(l) {
    function t(y, o) {
      if (l) {
        var s = y.deletions;
        s === null ? (y.deletions = [o], y.flags |= 16) : s.push(o);
      }
    }
    function u(y, o) {
      if (!l) return null;
      for (; o !== null; )
        t(y, o), o = o.sibling;
      return null;
    }
    function a(y) {
      for (var o = /* @__PURE__ */ new Map(); y !== null; )
        y.key === null ? o.set(y.index, y) : o.set(y.key, y), y = y.sibling;
      return o;
    }
    function e(y, o) {
      return y = eu(y, o), y.index = 0, y.sibling = null, y;
    }
    function n(y, o, s) {
      return y.index = s, l ? (s = y.alternate, s !== null ? (s = s.index, s < o ? (y.flags |= 2, o) : s) : (y.flags |= 134217730, o)) : (y.flags |= 1048576, o);
    }
    function f(y) {
      return l && y.alternate === null && (y.flags |= 134217730), y;
    }
    function c(y, o, s, S) {
      return o === null || o.tag !== 6 ? (o = Tc(s, y.mode, S), o.return = y, o) : (o = e(o, s), o.return = y, o);
    }
    function i(y, o, s, S) {
      var N = s.type;
      return N === ht ? (y = g(
        y,
        o,
        s.props.children,
        S,
        s.key
      ), Nu(y, s), y) : o !== null && (o.elementType === N || typeof N == "object" && N !== null && N.$$typeof === tl && ia(N) === o.type) ? (o = e(o, s.props), Nu(o, s), o.return = y, o) : (o = Un(
        s.type,
        s.key,
        s.props,
        null,
        y.mode,
        S
      ), Nu(o, s), o.return = y, o);
    }
    function d(y, o, s, S) {
      return o === null || o.tag !== 4 || o.stateNode.containerInfo !== s.containerInfo || o.stateNode.implementation !== s.implementation ? (o = Ec(s, y.mode, S), o.return = y, o) : (o = e(o, s.children || []), o.return = y, o);
    }
    function g(y, o, s, S, N) {
      return o === null || o.tag !== 7 ? (o = ta(
        s,
        y.mode,
        S,
        N
      ), o.return = y, o) : (o = e(o, s), o.return = y, o);
    }
    function E(y, o, s) {
      if (typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint")
        return o = Tc(
          "" + o,
          y.mode,
          s
        ), o.return = y, o;
      if (typeof o == "object" && o !== null) {
        switch (o.$$typeof) {
          case Gt:
            return s = Un(
              o.type,
              o.key,
              o.props,
              null,
              y.mode,
              s
            ), Nu(s, o), s.return = y, s;
          case st:
            return o = Ec(
              o,
              y.mode,
              s
            ), o.return = y, o;
          case tl:
            return o = ia(o), E(y, o, s);
        }
        if (P(o) || C(o))
          return o = ta(
            o,
            y.mode,
            s,
            null
          ), o.return = y, o;
        if (typeof o.then == "function")
          return E(y, Qn(o), s);
        if (o.$$typeof === Al)
          return E(
            y,
            Bn(y, o),
            s
          );
        jn(y, o);
      }
      return null;
    }
    function m(y, o, s, S) {
      var N = o !== null ? o.key : null;
      if (typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint")
        return N !== null ? null : c(y, o, "" + s, S);
      if (typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case Gt:
            return s.key === N ? i(y, o, s, S) : null;
          case st:
            return s.key === N ? d(y, o, s, S) : null;
          case tl:
            return s = ia(s), m(y, o, s, S);
        }
        if (P(s) || C(s))
          return N !== null ? null : g(y, o, s, S, null);
        if (typeof s.then == "function")
          return m(
            y,
            o,
            Qn(s),
            S
          );
        if (s.$$typeof === Al)
          return m(
            y,
            o,
            Bn(y, s),
            S
          );
        jn(y, s);
      }
      return null;
    }
    function h(y, o, s, S, N) {
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return y = y.get(s) || null, c(o, y, "" + S, N);
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case Gt:
            return y = y.get(
              S.key === null ? s : S.key
            ) || null, i(o, y, S, N);
          case st:
            return y = y.get(
              S.key === null ? s : S.key
            ) || null, d(o, y, S, N);
          case tl:
            return S = ia(S), h(
              y,
              o,
              s,
              S,
              N
            );
        }
        if (P(S) || C(S))
          return y = y.get(s) || null, g(o, y, S, N, null);
        if (typeof S.then == "function")
          return h(
            y,
            o,
            s,
            Qn(S),
            N
          );
        if (S.$$typeof === Al)
          return h(
            y,
            o,
            s,
            Bn(o, S),
            N
          );
        jn(o, S);
      }
      return null;
    }
    function _(y, o, s, S) {
      for (var N = null, J = null, M = o, R = o = 0, _l = null; M !== null && R < s.length; R++) {
        M.index > R ? (_l = M, M = null) : _l = M.sibling;
        var W = m(
          y,
          M,
          s[R],
          S
        );
        if (W === null) {
          M === null && (M = _l);
          break;
        }
        l && M && W.alternate === null && t(y, M), o = n(W, o, R), J === null ? N = W : J.sibling = W, J = W, M = _l;
      }
      if (R === s.length)
        return u(y, M), Z && nu(y, R), N;
      if (M === null) {
        for (; R < s.length; R++)
          M = E(y, s[R], S), M !== null && (o = n(
            M,
            o,
            R
          ), J === null ? N = M : J.sibling = M, J = M);
        return Z && nu(y, R), N;
      }
      for (M = a(M); R < s.length; R++)
        _l = h(
          M,
          y,
          R,
          s[R],
          S
        ), _l !== null && (l && (W = _l.alternate, W !== null && M.delete(W.key === null ? R : W.key)), o = n(
          _l,
          o,
          R
        ), J === null ? N = _l : J.sibling = _l, J = _l);
      return l && M.forEach(function(Lu) {
        return t(y, Lu);
      }), Z && nu(y, R), N;
    }
    function A(y, o, s, S) {
      if (s == null) throw Error(r(151));
      for (var N = null, J = null, M = o, R = o = 0, _l = null, W = s.next(); M !== null && !W.done; R++, W = s.next()) {
        M.index > R ? (_l = M, M = null) : _l = M.sibling;
        var Lu = m(y, M, W.value, S);
        if (Lu === null) {
          M === null && (M = _l);
          break;
        }
        l && M && Lu.alternate === null && t(y, M), o = n(Lu, o, R), J === null ? N = Lu : J.sibling = Lu, J = Lu, M = _l;
      }
      if (W.done)
        return u(y, M), Z && nu(y, R), N;
      if (M === null) {
        for (; !W.done; R++, W = s.next())
          W = E(y, W.value, S), W !== null && (o = n(W, o, R), J === null ? N = W : J.sibling = W, J = W);
        return Z && nu(y, R), N;
      }
      for (M = a(M); !W.done; R++, W = s.next())
        W = h(M, y, R, W.value, S), W !== null && (l && (_l = W.alternate, _l !== null && M.delete(
          _l.key === null ? R : _l.key
        )), o = n(W, o, R), J === null ? N = W : J.sibling = W, J = W);
      return l && M.forEach(function(nh) {
        return t(y, nh);
      }), Z && nu(y, R), N;
    }
    function Q(y, o, s, S) {
      if (typeof s == "object" && s !== null && s.type === ht && s.key === null && s.props.ref === void 0 && (s = s.props.children), typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case Gt:
            l: {
              for (var N = s.key; o !== null; ) {
                if (o.key === N) {
                  if (N = s.type, N === ht) {
                    if (o.tag === 7) {
                      u(
                        y,
                        o.sibling
                      ), S = e(
                        o,
                        s.props.children
                      ), Nu(S, s), S.return = y, y = S;
                      break l;
                    }
                  } else if (o.elementType === N || typeof N == "object" && N !== null && N.$$typeof === tl && ia(N) === o.type) {
                    u(
                      y,
                      o.sibling
                    ), S = e(o, s.props), Nu(S, s), S.return = y, y = S;
                    break l;
                  }
                  u(y, o);
                  break;
                } else t(y, o);
                o = o.sibling;
              }
              s.type === ht ? (S = ta(
                s.props.children,
                y.mode,
                S,
                s.key
              ), Nu(S, s), S.return = y, y = S) : (S = Un(
                s.type,
                s.key,
                s.props,
                null,
                y.mode,
                S
              ), Nu(S, s), S.return = y, y = S);
            }
            return f(y);
          case st:
            l: {
              for (N = s.key; o !== null; ) {
                if (o.key === N)
                  if (o.tag === 4 && o.stateNode.containerInfo === s.containerInfo && o.stateNode.implementation === s.implementation) {
                    u(
                      y,
                      o.sibling
                    ), S = e(o, s.children || []), S.return = y, y = S;
                    break l;
                  } else {
                    u(y, o);
                    break;
                  }
                else t(y, o);
                o = o.sibling;
              }
              S = Ec(s, y.mode, S), S.return = y, y = S;
            }
            return f(y);
          case tl:
            return s = ia(s), Q(
              y,
              o,
              s,
              S
            );
        }
        if (P(s))
          return _(
            y,
            o,
            s,
            S
          );
        if (C(s)) {
          if (N = C(s), typeof N != "function") throw Error(r(150));
          return s = N.call(s), A(
            y,
            o,
            s,
            S
          );
        }
        if (typeof s.then == "function")
          return Q(
            y,
            o,
            Qn(s),
            S
          );
        if (s.$$typeof === Al)
          return Q(
            y,
            o,
            Bn(y, s),
            S
          );
        jn(y, s);
      }
      return typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint" ? (s = "" + s, o !== null && o.tag === 6 ? (u(y, o.sibling), S = e(o, s), S.return = y, y = S) : (u(y, o), S = Tc(s, y.mode, S), S.return = y, y = S), f(y)) : u(y, o);
    }
    return function(y, o, s, S) {
      try {
        Ue = 0;
        var N = Q(
          y,
          o,
          s,
          S
        );
        return Xa = null, N;
      } catch (M) {
        if (M === Ga || M === Gn) throw M;
        var J = wl(29, M, null, y.mode);
        return J.lanes = S, J.return = y, J;
      } finally {
      }
    };
  }
  var va = Ko(!0), Jo = Ko(!1), Au = !1;
  function Cc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Rc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function Du(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Mu(l, t, u) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ll & 2) !== 0) {
      var e = a.pending;
      return e === null ? t.next = t : (t.next = e.next, e.next = t), a.pending = t, t = Mn(l), Uo(l, null, u), t;
    }
    return Dn(l, a, t, u), Mn(l);
  }
  function Ce(l, t, u) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (u & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, u |= a, t.lanes = u, H0(l, u);
    }
  }
  function Hc(l, t) {
    var u = l.updateQueue, a = l.alternate;
    if (a !== null && (a = a.updateQueue, u === a)) {
      var e = null, n = null;
      if (u = u.firstBaseUpdate, u !== null) {
        do {
          var f = {
            lane: u.lane,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null
          };
          n === null ? e = n = f : n = n.next = f, u = u.next;
        } while (u !== null);
        n === null ? e = n = t : n = n.next = t;
      } else e = n = t;
      u = {
        baseState: a.baseState,
        firstBaseUpdate: e,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks
      }, l.updateQueue = u;
      return;
    }
    l = u.lastBaseUpdate, l === null ? u.firstBaseUpdate = t : l.next = t, u.lastBaseUpdate = t;
  }
  var Yc = !1;
  function Re() {
    if (Yc) {
      var l = pa;
      if (l !== null) throw l;
    }
  }
  function He(l, t, u, a) {
    Yc = !1;
    var e = l.updateQueue;
    Au = !1;
    var n = e.firstBaseUpdate, f = e.lastBaseUpdate, c = e.shared.pending;
    if (c !== null) {
      e.shared.pending = null;
      var i = c, d = i.next;
      i.next = null, f === null ? n = d : f.next = d, f = i;
      var g = l.alternate;
      g !== null && (g = g.updateQueue, c = g.lastBaseUpdate, c !== f && (c === null ? g.firstBaseUpdate = d : c.next = d, g.lastBaseUpdate = i));
    }
    if (n !== null) {
      var E = e.baseState;
      f = 0, g = d = i = null, c = n;
      do {
        var m = c.lane & -536870913, h = m !== c.lane;
        if (h ? (K & m) === m : (a & m) === m) {
          m !== 0 && m === fa && (Yc = !0), g !== null && (g = g.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          l: {
            var _ = l, A = c;
            m = t;
            var Q = u;
            switch (A.tag) {
              case 1:
                if (_ = A.payload, typeof _ == "function") {
                  E = _.call(Q, E, m);
                  break l;
                }
                E = _;
                break l;
              case 3:
                _.flags = _.flags & -65537 | 128;
              case 0:
                if (_ = A.payload, m = typeof _ == "function" ? _.call(Q, E, m) : _, m == null) break l;
                E = V({}, E, m);
                break l;
              case 2:
                Au = !0;
            }
          }
          m = c.callback, m !== null && (l.flags |= 64, h && (l.flags |= 8192), h = e.callbacks, h === null ? e.callbacks = [m] : h.push(m));
        } else
          h = {
            lane: m,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          }, g === null ? (d = g = h, i = E) : g = g.next = h, f |= m;
        if (c = c.next, c === null) {
          if (c = e.shared.pending, c === null)
            break;
          h = c, c = h.next, h.next = null, e.lastBaseUpdate = h, e.shared.pending = null;
        }
      } while (!0);
      g === null && (i = E), e.baseState = i, e.firstBaseUpdate = d, e.lastBaseUpdate = g, n === null && (e.shared.lanes = 0), Bu |= f, l.lanes = f, l.memoizedState = E;
    }
  }
  function wo(l, t) {
    if (typeof l != "function")
      throw Error(r(191, l));
    l.call(t);
  }
  function Wo(l, t) {
    var u = l.callbacks;
    if (u !== null)
      for (l.callbacks = null, l = 0; l < u.length; l++)
        wo(u[l], t);
  }
  var Uu = Xt(null), Zn = Xt(0);
  function $o(l, t) {
    l = yu, vl(Zn, l), vl(Uu, t), yu = l | t.baseLanes;
  }
  function qc() {
    vl(Zn, yu), vl(Uu, Uu.current);
  }
  function Bc() {
    yu = Zn.current, Hl(Uu), Hl(Zn);
  }
  var Bl = Xt(null), jl = null;
  function Cu(l) {
    var t = l.alternate;
    vl(pl, pl.current & 1), vl(Bl, l), jl === null && (t === null || Uu.current !== null || t.memoizedState !== null) && (jl = l);
  }
  function pc(l) {
    vl(pl, pl.current), vl(Bl, l), jl === null && (jl = l);
  }
  function Fo(l) {
    l.tag === 22 ? (vl(pl, pl.current), vl(Bl, l), jl === null && (jl = l)) : Ru();
  }
  function Ru() {
    vl(pl, pl.current), vl(Bl, Bl.current);
  }
  function ct(l) {
    Hl(Bl), jl === l && (jl = null), Hl(pl);
  }
  var pl = Xt(0);
  function Ye(l, t) {
    vl(Bl, Bl.current), vl(pl, t);
  }
  function Gc(l) {
    Hl(pl), Hl(Bl), jl === l && (jl = null);
  }
  function Vn(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var u = t.memoizedState;
        if (u !== null && (u = u.dehydrated, u === null || n0(u) || f0(u)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var iu = 0, X = null, fl = null, bl = null, xn = !1, Qa = !1, ma = !1, Ln = 0, qe = 0, ja = null, A1 = 0;
  function hl() {
    throw Error(r(321));
  }
  function Xc(l, t) {
    if (t === null) return !1;
    for (var u = 0; u < t.length && u < l.length; u++)
      if (!ft(l[u], t[u])) return !1;
    return !0;
  }
  function Qc(l, t, u, a, e, n) {
    return iu = n, X = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, D.H = l === null || l.memoizedState === null ? Yv : qv, ma = !1, n = u(a, e), ma = !1, Qa && (n = ko(
      t,
      u,
      a,
      e
    )), Io(l), n;
  }
  function Io(l) {
    D.H = In;
    var t = fl !== null && fl.next !== null;
    if (iu = 0, bl = fl = X = null, xn = !1, qe = 0, ja = null, t) throw Error(r(300));
    l === null || zl || (l = l.dependencies, l !== null && qn(l) && (zl = !0));
  }
  function ko(l, t, u, a) {
    X = l;
    var e = 0;
    do {
      if (Qa && (ja = null), qe = 0, Qa = !1, 25 <= e) throw Error(r(301));
      if (e += 1, bl = fl = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      D.H = q1, n = t(u, a);
    } while (Qa);
    return n;
  }
  function D1() {
    var l = D.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Be(t) : t, l = l.useState()[0], (fl !== null ? fl.memoizedState : null) !== l && (X.flags |= 1024), t;
  }
  function jc() {
    var l = Ln !== 0;
    return Ln = 0, l;
  }
  function Zc(l, t, u) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~u;
  }
  function Vc(l) {
    if (xn) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      xn = !1;
    }
    iu = 0, bl = fl = X = null, Qa = !1, qe = Ln = 0, ja = null;
  }
  function Vl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return bl === null ? X.memoizedState = bl = l : bl = bl.next = l, bl;
  }
  function Sl() {
    if (fl === null) {
      var l = X.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = fl.next;
    var t = bl === null ? X.memoizedState : bl.next;
    if (t !== null)
      bl = t, fl = l;
    else {
      if (l === null)
        throw X.alternate === null ? Error(r(467)) : Error(r(310));
      fl = l, l = {
        memoizedState: fl.memoizedState,
        baseState: fl.baseState,
        baseQueue: fl.baseQueue,
        queue: fl.queue,
        next: null
      }, bl === null ? X.memoizedState = bl = l : bl = bl.next = l;
    }
    return bl;
  }
  function Kn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Be(l) {
    var t = qe;
    return qe += 1, ja === null && (ja = []), l = Vo(ja, l, t), t = X, (bl === null ? t.memoizedState : bl.next) === null && (t = t.alternate, D.H = t === null || t.memoizedState === null ? Yv : qv), l;
  }
  function Jn(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Be(l);
      if (l.$$typeof === b) return;
      if (l.$$typeof === Al) return ql(l);
    }
    throw Error(r(438, String(l)));
  }
  function xc(l) {
    var t = null, u = X.updateQueue;
    if (u !== null && (t = u.memoCache), t == null) {
      var a = X.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(e) {
          return e.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), u === null && (u = Kn(), X.updateQueue = u), u.memoCache = t, u = t.data[t.index], u === void 0)
      for (u = t.data[t.index] = Array(l), a = 0; a < l; a++)
        u[a] = Wu;
    return t.index++, u;
  }
  function ou(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function wn(l) {
    var t = Sl();
    return Lc(t, fl, l);
  }
  function Lc(l, t, u) {
    var a = l.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = u;
    var e = l.baseQueue, n = a.pending;
    if (n !== null) {
      if (e !== null) {
        var f = e.next;
        e.next = n.next, n.next = f;
      }
      t.baseQueue = e = n, a.pending = null;
    }
    if (n = l.baseState, e === null) l.memoizedState = n;
    else {
      t = e.next;
      var c = f = null, i = null, d = t, g = !1;
      do {
        var E = d.lane & -536870913;
        if (E !== d.lane ? (K & E) === E : (iu & E) === E) {
          var m = d.revertLane;
          if (m === 0)
            i !== null && (i = i.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: d.action,
              hasEagerState: d.hasEagerState,
              eagerState: d.eagerState,
              next: null
            }), E === fa && (g = !0);
          else if ((iu & m) === m) {
            d = d.next, m === fa && (g = !0);
            continue;
          } else
            E = {
              lane: 0,
              revertLane: d.revertLane,
              gesture: null,
              action: d.action,
              hasEagerState: d.hasEagerState,
              eagerState: d.eagerState,
              next: null
            }, i === null ? (c = i = E, f = n) : i = i.next = E, X.lanes |= m, Bu |= m;
          E = d.action, ma && u(n, E), n = d.hasEagerState ? d.eagerState : u(n, E);
        } else
          m = {
            lane: E,
            revertLane: d.revertLane,
            gesture: d.gesture,
            action: d.action,
            hasEagerState: d.hasEagerState,
            eagerState: d.eagerState,
            next: null
          }, i === null ? (c = i = m, f = n) : i = i.next = m, X.lanes |= E, Bu |= E;
        d = d.next;
      } while (d !== null && d !== t);
      if (i === null ? f = n : i.next = c, !ft(n, l.memoizedState) && (zl = !0, g && (u = pa, u !== null)))
        throw u;
      l.memoizedState = n, l.baseState = f, l.baseQueue = i, a.lastRenderedState = n;
    }
    return e === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function Kc(l) {
    var t = Sl(), u = t.queue;
    if (u === null) throw Error(r(311));
    u.lastRenderedReducer = l;
    var a = u.dispatch, e = u.pending, n = t.memoizedState;
    if (e !== null) {
      u.pending = null;
      var f = e = e.next;
      do
        n = l(n, f.action), f = f.next;
      while (f !== e);
      ft(n, t.memoizedState) || (zl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), u.lastRenderedState = n;
    }
    return [n, a];
  }
  function Po(l, t, u) {
    var a = X, e = Sl(), n = Z;
    if (n) {
      if (u === void 0) throw Error(r(407));
      u = u();
    } else u = t();
    var f = !ft(
      (fl || e).memoizedState,
      u
    );
    if (f && (e.memoizedState = u, zl = !0), e = e.queue, Wc(uv.bind(null, a, e, l), [
      l
    ]), l = e.getSnapshot !== t || f || bl !== null && (bl.memoizedState.tag & 1) !== 0, Za(
      l ? 9 : 8,
      { destroy: void 0 },
      tv.bind(null, a, e, u, t),
      null
    ), l) {
      if (a.flags |= 2048, il === null) throw Error(r(349));
      n || (iu & 127) !== 0 || lv(a, t, u);
    }
    return u;
  }
  function lv(l, t, u) {
    l.flags |= 16384, l = { getSnapshot: t, value: u }, t = X.updateQueue, t === null ? (t = Kn(), X.updateQueue = t, t.stores = [l]) : (u = t.stores, u === null ? t.stores = [l] : u.push(l));
  }
  function tv(l, t, u, a) {
    t.value = u, t.getSnapshot = a, av(t) && ev(l);
  }
  function uv(l, t, u) {
    return u(function() {
      av(t) && ev(l);
    });
  }
  function av(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var u = t();
      return !ft(l, u);
    } catch {
      return !0;
    }
  }
  function ev(l) {
    var t = la(l, 2);
    t !== null && Il(t, l, 2);
  }
  function Jc(l) {
    var t = Vl();
    if (typeof l == "function") {
      var u = l;
      if (l = u(), ma) {
        Su(!0);
        try {
          u();
        } finally {
          Su(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ou,
      lastRenderedState: l
    }, t;
  }
  function nv(l, t, u, a) {
    return l.baseState = u, Lc(
      l,
      fl,
      typeof a == "function" ? a : ou
    );
  }
  function M1(l, t, u, a, e) {
    if (Fn(l)) throw Error(r(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: e,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          n.listeners.push(f);
        }
      };
      D.T !== null ? u(!0) : n.isTransition = !1, a(n), u = t.pending, u === null ? (n.next = t.pending = n, fv(t, n)) : (n.next = u.next, t.pending = u.next = n);
    }
  }
  function fv(l, t) {
    var u = t.action, a = t.payload, e = l.state;
    if (t.isTransition) {
      var n = D.T, f = {};
      f.types = n !== null ? n.types : null, D.T = f;
      try {
        var c = u(e, a), i = D.S;
        i !== null && i(f, c), cv(l, t, c);
      } catch (d) {
        wc(l, t, d);
      } finally {
        n !== null && f.types !== null && (n.types = f.types), D.T = n;
      }
    } else
      try {
        n = u(e, a), cv(l, t, n);
      } catch (d) {
        wc(l, t, d);
      }
  }
  function cv(l, t, u) {
    u !== null && typeof u == "object" && typeof u.then == "function" ? u.then(
      function(a) {
        iv(l, t, a);
      },
      function(a) {
        return wc(l, t, a);
      }
    ) : iv(l, t, u);
  }
  function iv(l, t, u) {
    t.status = "fulfilled", t.value = u, ov(t), l.state = u, t = l.pending, t !== null && (u = t.next, u === t ? l.pending = null : (u = u.next, t.next = u, fv(l, u)));
  }
  function wc(l, t, u) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = u, ov(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function ov(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function vv(l, t) {
    return t;
  }
  function mv(l, t) {
    if (Z) {
      var u = il.formState;
      if (u !== null) {
        l: {
          var a = X;
          if (Z) {
            if (ml) {
              t: {
                for (var e = ml, n = bt; e.nodeType !== 8; ) {
                  if (!n) {
                    e = null;
                    break t;
                  }
                  if (e = _t(
                    e.nextSibling
                  ), e === null) {
                    e = null;
                    break t;
                  }
                }
                n = e.data, e = n === "F!" || n === "F" ? e : null;
              }
              if (e) {
                ml = _t(
                  e.nextSibling
                ), a = e.data === "F!";
                break l;
              }
            }
            _u(a);
          }
          a = !1;
        }
        a && (t = u[0]);
      }
    }
    return u = Vl(), u.memoizedState = u.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: vv,
      lastRenderedState: t
    }, u.queue = a, u = Cv.bind(
      null,
      X,
      a
    ), a.dispatch = u, a = Jc(!1), n = Pc.bind(
      null,
      X,
      !1,
      a.queue
    ), a = Vl(), e = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = e, u = M1.bind(
      null,
      X,
      e,
      n,
      u
    ), e.dispatch = u, a.memoizedState = l, [t, u, !1];
  }
  function yv(l) {
    var t = Sl();
    return dv(t, fl, l);
  }
  function dv(l, t, u) {
    if (t = Lc(
      l,
      t,
      vv
    )[0], l = wn(ou)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Be(t);
      } catch (f) {
        throw f === Ga ? Gn : f;
      }
    else a = t;
    t = Sl();
    var e = t.queue, n = e.dispatch;
    return u !== t.memoizedState && (X.flags |= 2048, Za(
      9,
      { destroy: void 0 },
      U1.bind(null, e, u),
      null
    )), [a, n, l];
  }
  function U1(l, t) {
    l.action = t;
  }
  function sv(l) {
    var t = Sl(), u = fl;
    if (u !== null)
      return dv(t, u, l);
    Sl(), t = t.memoizedState, u = Sl();
    var a = u.queue.dispatch;
    return u.memoizedState = l, [t, a, !1];
  }
  function Za(l, t, u, a) {
    return l = { tag: l, create: u, deps: a, inst: t, next: null }, t = X.updateQueue, t === null && (t = Kn(), X.updateQueue = t), u = t.lastEffect, u === null ? t.lastEffect = l.next = l : (a = u.next, u.next = l, l.next = a, t.lastEffect = l), l;
  }
  function hv() {
    return Sl().memoizedState;
  }
  function Wn(l, t, u, a) {
    var e = Vl();
    X.flags |= l, e.memoizedState = Za(
      1 | t,
      { destroy: void 0 },
      u,
      a === void 0 ? null : a
    );
  }
  function $n(l, t, u, a) {
    var e = Sl();
    a = a === void 0 ? null : a;
    var n = e.memoizedState.inst;
    fl !== null && a !== null && Xc(a, fl.memoizedState.deps) ? e.memoizedState = Za(t, n, u, a) : (X.flags |= l, e.memoizedState = Za(
      1 | t,
      n,
      u,
      a
    ));
  }
  function gv(l, t) {
    Wn(8390656, 8, l, t);
  }
  function Wc(l, t) {
    $n(2048, 8, l, t);
  }
  function C1(l) {
    X.flags |= 4;
    var t = X.updateQueue;
    if (t === null)
      t = Kn(), X.updateQueue = t, t.events = [l];
    else {
      var u = t.events;
      u === null ? t.events = [l] : u.push(l);
    }
  }
  function rv(l) {
    var t = Sl().memoizedState;
    return C1({ ref: t, nextImpl: l }), function() {
      if ((ll & 2) !== 0) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Sv(l, t) {
    return $n(4, 2, l, t);
  }
  function Tv(l, t) {
    return $n(4, 4, l, t);
  }
  function Ev(l, t) {
    if (typeof t == "function") {
      l = l();
      var u = t(l);
      return function() {
        typeof u == "function" ? u() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function bv(l, t, u) {
    u = u != null ? u.concat([l]) : null, $n(4, 4, Ev.bind(null, t, l), u);
  }
  function $c() {
  }
  function zv(l, t) {
    var u = Sl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    return t !== null && Xc(t, a[1]) ? a[0] : (u.memoizedState = [l, t], l);
  }
  function _v(l, t) {
    var u = Sl();
    t = t === void 0 ? null : t;
    var a = u.memoizedState;
    if (t !== null && Xc(t, a[1]))
      return a[0];
    if (a = l(), ma) {
      Su(!0);
      try {
        l();
      } finally {
        Su(!1);
      }
    }
    return u.memoizedState = [a, t], a;
  }
  function Fc(l, t, u) {
    return u === void 0 || (iu & 1073741824) !== 0 && (K & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = u, l = Ym(), X.lanes |= l, Bu |= l, u);
  }
  function Ov(l, t, u, a) {
    return ft(u, t) ? u : Uu.current !== null ? (l = Fc(l, u, a), ft(l, t) || (zl = !0), l) : (iu & 106) === 0 || (iu & 1073741824) !== 0 && (K & 261930) === 0 ? (zl = !0, l.memoizedState = u) : (l = Ym(), X.lanes |= l, Bu |= l, t);
  }
  function Nv(l, t, u, a, e) {
    var n = p.p;
    p.p = n !== 0 && 8 > n ? n : 8;
    var f = D.T, c = {};
    c.types = f !== null ? f.types : null, D.T = c, Pc(l, !1, t, u);
    try {
      var i = e(), d = D.S;
      if (d !== null && d(c, i), i !== null && typeof i == "object" && typeof i.then == "function") {
        var g = N1(
          i,
          a
        );
        pe(
          l,
          t,
          g,
          mt(l)
        );
      } else
        pe(
          l,
          t,
          a,
          mt(l)
        );
    } catch (E) {
      pe(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: E },
        mt()
      );
    } finally {
      p.p = n, f !== null && c.types !== null && (f.types = c.types), D.T = f;
    }
  }
  function R1() {
  }
  function Ic(l, t, u, a) {
    if (l.tag !== 5) throw Error(r(476));
    var e = Av(l).queue;
    Nv(
      l,
      e,
      t,
      kt,
      u === null ? R1 : function() {
        return Dv(l), u(a);
      }
    );
  }
  function Av(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: kt,
      baseState: kt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ou,
        lastRenderedState: kt
      },
      next: null
    };
    var u = {};
    return t.next = {
      memoizedState: u,
      baseState: u,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ou,
        lastRenderedState: u
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function Dv(l) {
    var t = Av(l);
    t.next === null && (t = l.alternate.memoizedState), pe(
      l,
      t.next.queue,
      {},
      mt()
    );
  }
  function kc() {
    return ql(fe);
  }
  function Mv() {
    return Sl().memoizedState;
  }
  function Uv() {
    return Sl().memoizedState;
  }
  function H1(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var u = mt();
          l = Du(u);
          var a = Mu(t, l, u);
          a !== null && (Il(a, t, u), Ce(a, t, u)), t = { cache: Ac() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Y1(l, t, u) {
    var a = mt();
    u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fn(l) ? Rv(t, u) : (u = rc(l, t, u, a), u !== null && (Il(u, l, a), Hv(u, t, a)));
  }
  function Cv(l, t, u) {
    var a = mt();
    pe(l, t, u, a);
  }
  function pe(l, t, u, a) {
    var e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Fn(l)) Rv(t, e);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var f = t.lastRenderedState, c = n(f, u);
          if (e.hasEagerState = !0, e.eagerState = c, ft(c, f))
            return Dn(l, t, e, 0), il === null && An(), !1;
        } catch {
        } finally {
        }
      if (u = rc(l, t, e, a), u !== null)
        return Il(u, l, a), Hv(u, t, a), !0;
    }
    return !1;
  }
  function Pc(l, t, u, a) {
    if (a = {
      lane: 2,
      revertLane: xi(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fn(l)) {
      if (t) throw Error(r(479));
    } else
      t = rc(
        l,
        u,
        a,
        2
      ), t !== null && Il(t, l, 2);
  }
  function Fn(l) {
    var t = l.alternate;
    return l === X || t !== null && t === X;
  }
  function Rv(l, t) {
    Qa = xn = !0;
    var u = l.pending;
    u === null ? t.next = t : (t.next = u.next, u.next = t), l.pending = t;
  }
  function Hv(l, t, u) {
    if ((u & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, u |= a, t.lanes = u, H0(l, u);
    }
  }
  var In = {
    readContext: ql,
    use: Jn,
    useCallback: hl,
    useContext: hl,
    useEffect: hl,
    useImperativeHandle: hl,
    useLayoutEffect: hl,
    useInsertionEffect: hl,
    useMemo: hl,
    useReducer: hl,
    useRef: hl,
    useState: hl,
    useDebugValue: hl,
    useDeferredValue: hl,
    useTransition: hl,
    useSyncExternalStore: hl,
    useId: hl,
    useHostTransitionStatus: hl,
    useFormState: hl,
    useActionState: hl,
    useOptimistic: hl,
    useMemoCache: hl,
    useCacheRefresh: hl,
    useEffectEvent: hl
  }, Yv = {
    readContext: ql,
    use: Jn,
    useCallback: function(l, t) {
      return Vl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: ql,
    useEffect: gv,
    useImperativeHandle: function(l, t, u) {
      u = u != null ? u.concat([l]) : null, Wn(
        4194308,
        4,
        Ev.bind(null, t, l),
        u
      );
    },
    useLayoutEffect: function(l, t) {
      return Wn(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      Wn(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var u = Vl();
      t = t === void 0 ? null : t;
      var a = l();
      if (ma) {
        Su(!0);
        try {
          l();
        } finally {
          Su(!1);
        }
      }
      return u.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, u) {
      var a = Vl();
      if (u !== void 0) {
        var e = u(t);
        if (ma) {
          Su(!0);
          try {
            u(t);
          } finally {
            Su(!1);
          }
        }
      } else e = t;
      return a.memoizedState = a.baseState = e, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: e
      }, a.queue = l, l = l.dispatch = Y1.bind(
        null,
        X,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = Vl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = Jc(l);
      var t = l.queue, u = Cv.bind(null, X, t);
      return t.dispatch = u, [l.memoizedState, u];
    },
    useDebugValue: $c,
    useDeferredValue: function(l, t) {
      var u = Vl();
      return Fc(u, l, t);
    },
    useTransition: function() {
      var l = Jc(!1);
      return l = Nv.bind(
        null,
        X,
        l.queue,
        !0,
        !1
      ), Vl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, u) {
      var a = X, e = Vl();
      if (Z) {
        if (u === void 0)
          throw Error(r(407));
        u = u();
      } else {
        if (u = t(), il === null)
          throw Error(r(349));
        (K & 127) !== 0 || lv(a, t, u);
      }
      e.memoizedState = u;
      var n = { value: u, getSnapshot: t };
      return e.queue = n, gv(uv.bind(null, a, n, l), [
        l
      ]), a.flags |= 2048, Za(
        9,
        { destroy: void 0 },
        tv.bind(
          null,
          a,
          n,
          u,
          t
        ),
        null
      ), u;
    },
    useId: function() {
      var l = Vl(), t = il.identifierPrefix;
      if (Z) {
        var u = Vt, a = Zt;
        u = (a & ~(1 << 32 - et(a) - 1)).toString(32) + u, t = "_" + t + "R_" + u, u = Ln++, 0 < u && (t += "H" + u.toString(32)), t += "_";
      } else
        u = A1++, t = "_" + t + "r_" + u.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: kc,
    useFormState: mv,
    useActionState: mv,
    useOptimistic: function(l) {
      var t = Vl();
      t.memoizedState = t.baseState = l;
      var u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = u, t = Pc.bind(
        null,
        X,
        !0,
        u
      ), u.dispatch = t, [l, t];
    },
    useMemoCache: xc,
    useCacheRefresh: function() {
      return Vl().memoizedState = H1.bind(
        null,
        X
      );
    },
    useEffectEvent: function(l) {
      var t = Vl(), u = { impl: l };
      return t.memoizedState = u, function() {
        if ((ll & 2) !== 0)
          throw Error(r(440));
        return u.impl.apply(void 0, arguments);
      };
    }
  }, qv = {
    readContext: ql,
    use: Jn,
    useCallback: zv,
    useContext: ql,
    useEffect: Wc,
    useImperativeHandle: bv,
    useInsertionEffect: Sv,
    useLayoutEffect: Tv,
    useMemo: _v,
    useReducer: wn,
    useRef: hv,
    useState: function() {
      return wn(ou);
    },
    useDebugValue: $c,
    useDeferredValue: function(l, t) {
      var u = Sl();
      return Ov(
        u,
        fl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = wn(ou)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : Be(l),
        t
      ];
    },
    useSyncExternalStore: Po,
    useId: Mv,
    useHostTransitionStatus: kc,
    useFormState: yv,
    useActionState: yv,
    useOptimistic: function(l, t) {
      var u = Sl();
      return nv(u, fl, l, t);
    },
    useMemoCache: xc,
    useCacheRefresh: Uv,
    useEffectEvent: rv
  }, q1 = {
    readContext: ql,
    use: Jn,
    useCallback: zv,
    useContext: ql,
    useEffect: Wc,
    useImperativeHandle: bv,
    useInsertionEffect: Sv,
    useLayoutEffect: Tv,
    useMemo: _v,
    useReducer: Kc,
    useRef: hv,
    useState: function() {
      return Kc(ou);
    },
    useDebugValue: $c,
    useDeferredValue: function(l, t) {
      var u = Sl();
      return fl === null ? Fc(u, l, t) : Ov(
        u,
        fl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = Kc(ou)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : Be(l),
        t
      ];
    },
    useSyncExternalStore: Po,
    useId: Mv,
    useHostTransitionStatus: kc,
    useFormState: sv,
    useActionState: sv,
    useOptimistic: function(l, t) {
      var u = Sl();
      return fl !== null ? nv(u, fl, l, t) : (u.baseState = l, [l, u.queue.dispatch]);
    },
    useMemoCache: xc,
    useCacheRefresh: Uv,
    useEffectEvent: rv
  };
  function li(l, t, u, a) {
    t = l.memoizedState, u = u(a, t), u = u == null ? t : V({}, t, u), l.memoizedState = u, l.lanes === 0 && (l.updateQueue.baseState = u);
  }
  var ti = {
    enqueueSetState: function(l, t, u) {
      l = l._reactInternals;
      var a = mt(), e = Du(a);
      e.payload = t, u != null && (e.callback = u), t = Mu(l, e, a), t !== null && (Il(t, l, a), Ce(t, l, a));
    },
    enqueueReplaceState: function(l, t, u) {
      l = l._reactInternals;
      var a = mt(), e = Du(a);
      e.tag = 1, e.payload = t, u != null && (e.callback = u), t = Mu(l, e, a), t !== null && (Il(t, l, a), Ce(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var u = mt(), a = Du(u);
      a.tag = 2, t != null && (a.callback = t), t = Mu(l, a, u), t !== null && (Il(t, l, u), Ce(t, l, u));
    }
  };
  function Bv(l, t, u, a, e, n, f) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, f) : t.prototype && t.prototype.isPureReactComponent ? !ze(u, a) || !ze(e, n) : !0;
  }
  function pv(l, t, u, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(u, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(u, a), t.state !== l && ti.enqueueReplaceState(t, t.state, null);
  }
  function ya(l, t) {
    var u = t;
    if ("ref" in t) {
      u = {};
      for (var a in t)
        a !== "ref" && (u[a] = t[a]);
    }
    if (l = l.defaultProps) {
      u === t && (u = V({}, u));
      for (var e in l)
        u[e] === void 0 && (u[e] = l[e]);
    }
    return u;
  }
  function Gv(l) {
    Nn(l);
  }
  function Xv(l) {
    console.error(l);
  }
  function Qv(l) {
    Nn(l);
  }
  function kn(l, t) {
    try {
      var u = l.onUncaughtError;
      u(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function jv(l, t, u) {
    try {
      var a = l.onCaughtError;
      a(u.value, {
        componentStack: u.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }
  }
  function ui(l, t, u) {
    return u = Du(u), u.tag = 3, u.payload = { element: null }, u.callback = function() {
      kn(l, t);
    }, u;
  }
  function Zv(l) {
    return l = Du(l), l.tag = 3, l;
  }
  function Vv(l, t, u, a) {
    var e = u.type.getDerivedStateFromError;
    if (typeof e == "function") {
      var n = a.value;
      l.payload = function() {
        return e(n);
      }, l.callback = function() {
        jv(t, u, a);
      };
    }
    var f = u.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (l.callback = function() {
      jv(t, u, a), typeof e != "function" && (pu === null ? pu = /* @__PURE__ */ new Set([this]) : pu.add(this));
      var c = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: c !== null ? c : ""
      });
    });
  }
  function B1(l, t, u, a, e) {
    if (u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = u.alternate, t !== null && ea(
        t,
        u,
        e,
        !0
      ), u = Bl.current, u !== null) {
        switch (u.tag) {
          case 31:
          case 13:
          case 19:
            return jl === null ? Ef() : u.alternate === null && gl === 0 && (gl = 3), u.flags &= -257, u.flags |= 65536, u.lanes = e, a === Xn ? u.flags |= 16384 : (t = u.updateQueue, t === null ? u.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), ji(l, a, e)), !1;
          case 22:
            return u.flags |= 65536, a === Xn ? u.flags |= 16384 : (t = u.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, u.updateQueue = t) : (u = t.retryQueue, u === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : u.add(a)), ji(l, a, e)), !1;
        }
        throw Error(r(435, u.tag));
      }
      return ji(l, a, e), Ef(), !1;
    }
    if (Z)
      return t = Bl.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = e, a !== zc && (l = Error(r(422), { cause: a }), Ne(St(l, u)))) : (a !== zc && (t = Error(r(423), {
        cause: a
      }), Ne(
        St(t, u)
      )), l = l.current.alternate, l.flags |= 65536, e &= -e, l.lanes |= e, a = St(a, u), e = ui(
        l.stateNode,
        a,
        e
      ), Hc(l, e), gl !== 4 && (gl = 2)), !1;
    var n = Error(r(520), { cause: a });
    if (n = St(n, u), Le === null ? Le = [n] : Le.push(n), gl !== 4 && (gl = 2), t === null) return !0;
    a = St(a, u), u = t;
    do {
      switch (u.tag) {
        case 3:
          return u.flags |= 65536, l = e & -e, u.lanes |= l, l = ui(u.stateNode, a, l), Hc(u, l), !1;
        case 1:
          if (t = u.type, n = u.stateNode, (u.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (pu === null || !pu.has(n))))
            return u.flags |= 65536, e &= -e, u.lanes |= e, e = Zv(e), Vv(
              e,
              l,
              u,
              a
            ), Hc(u, e), !1;
          break;
        case 22:
          if (u.memoizedState !== null)
            return u.flags |= 65536, !1;
      }
      u = u.return;
    } while (u !== null);
    return !1;
  }
  var ai = Error(r(461)), zl = !1;
  function Ol(l, t, u, a) {
    t.child = l === null ? Jo(t, null, u, a) : va(
      t,
      l.child,
      u,
      a
    );
  }
  function xv(l, t, u, a, e) {
    u = u.render;
    var n = t.ref;
    if ("ref" in a) {
      var f = {};
      for (var c in a)
        c !== "ref" && (f[c] = a[c]);
    } else f = a;
    return na(t), a = Qc(
      l,
      t,
      u,
      f,
      n,
      e
    ), c = jc(), l !== null && !zl ? (Zc(l, t, e), vu(l, t, e)) : (Z && c && Rn(t), t.flags |= 1, Ol(l, t, a, e), t.child);
  }
  function Lv(l, t, u, a, e) {
    if (l === null) {
      var n = u.type;
      return typeof n == "function" && !Sc(n) && n.defaultProps === void 0 && u.compare === null ? (t.tag = 15, t.type = n, Kv(
        l,
        t,
        n,
        a,
        e
      )) : (l = Un(
        u.type,
        null,
        a,
        t,
        t.mode,
        e
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !mi(l, e)) {
      var f = n.memoizedProps;
      if (u = u.compare, u = u !== null ? u : ze, u(f, a) && l.ref === t.ref)
        return vu(l, t, e);
    }
    return t.flags |= 1, l = eu(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Kv(l, t, u, a, e) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (ze(n, a) && l.ref === t.ref)
        if (zl = !1, t.pendingProps = a = n, mi(l, e))
          (l.flags & 131072) !== 0 && (zl = !0);
        else
          return t.lanes = l.lanes, vu(l, t, e);
    }
    return ei(
      l,
      t,
      u,
      a,
      e
    );
  }
  function Jv(l, t, u, a) {
    var e = a.children, n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (n = n !== null ? n.baseLanes | u : u, l !== null) {
          for (a = t.child = l.child, e = 0; a !== null; )
            e = e | a.lanes | a.childLanes, a = a.sibling;
          a = e & ~n;
        } else a = 0, t.child = null;
        return wv(
          l,
          t,
          n,
          u,
          a
        );
      }
      if ((u & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && pn(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? $o(t, n) : qc(), Fo(t);
      else
        return a = t.lanes = 536870912, wv(
          l,
          t,
          n !== null ? n.baseLanes | u : u,
          u,
          a
        );
    } else
      n !== null ? (pn(t, n.cachePool), $o(t, n), Ru(), t.memoizedState = null) : (l !== null && pn(t, null), qc(), Ru());
    return Ol(l, t, e, u), t.child;
  }
  function Ge(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function wv(l, t, u, a, e) {
    var n = Mc();
    return n = n === null ? null : { parent: El._currentValue, pool: n }, t.memoizedState = {
      baseLanes: u,
      cachePool: n
    }, l !== null && pn(t, null), qc(), Fo(t), l !== null && ea(l, t, a, !0), t.childLanes = e, null;
  }
  function Pn(l, t) {
    return t = lf(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function Wv(l, t, u) {
    return va(t, l.child, null, u), l = Pn(t, t.pendingProps), l.flags |= 2, ct(t), t.memoizedState = null, l;
  }
  function p1(l, t, u) {
    var a = t.pendingProps, e = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (Z) {
        if (a.mode === "hidden")
          return l = Pn(t, a), t.lanes = 536870912, l.memoizedState = { baseLanes: 0, cachePool: null }, Ge(null, l);
        if (pc(t), (l = ml) ? (l = Ey(
          l,
          bt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: bu !== null ? { id: Zt, overflow: Vt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, u = Ro(l), u.return = t, t.child = u, Ml = t, ml = null)) : l = null, l === null) throw _u(t);
        return t.lanes = 536870912, null;
      }
      return Pn(t, a);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var f = n.dehydrated;
      if (pc(t), e)
        if (t.flags & 256)
          t.flags &= -257, t = Wv(
            l,
            t,
            u
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(r(558));
      else if (zl || ea(l, t, u, !1), e = (u & l.childLanes) !== 0, zl || e) {
        if (Uu.current === null) {
          if (a = il, a !== null && (f = Y0(a, u), f !== 0 && f !== n.retryLane))
            throw n.retryLane = f, la(l, f), Il(a, l, f), ai;
          Ef();
        }
        t = Wv(
          l,
          t,
          u
        );
      } else
        l = n.treeContext, ml = _t(f.nextSibling), Ml = t, Z = !0, zu = null, bt = !1, l !== null && qo(t, l), t = Pn(t, a), t.flags |= 134221824;
      return t;
    }
    return l = eu(l.child, {
      mode: a.mode,
      children: a.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function Va(l, t) {
    var u = t.ref;
    if (u === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof u != "function" && typeof u != "object")
        throw Error(r(284));
      (l === null || l.ref !== u) && (t.flags |= 4194816);
    }
  }
  function ei(l, t, u, a, e) {
    return na(t), u = Qc(
      l,
      t,
      u,
      a,
      void 0,
      e
    ), a = jc(), l !== null && !zl ? (Zc(l, t, e), vu(l, t, e)) : (Z && a && Rn(t), t.flags |= 1, Ol(l, t, u, e), t.child);
  }
  function $v(l, t, u, a, e, n) {
    return na(t), t.updateQueue = null, u = ko(
      t,
      a,
      u,
      e
    ), Io(l), a = jc(), l !== null && !zl ? (Zc(l, t, n), vu(l, t, n)) : (Z && a && Rn(t), t.flags |= 1, Ol(l, t, u, n), t.child);
  }
  function Fv(l, t, u, a, e) {
    if (na(t), t.stateNode === null) {
      var n = Ha, f = u.contextType;
      typeof f == "object" && f !== null && (n = ql(f)), n = new u(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = ti, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, Cc(t), f = u.contextType, n.context = typeof f == "object" && f !== null ? ql(f) : Ha, n.state = t.memoizedState, f = u.getDerivedStateFromProps, typeof f == "function" && (li(
        t,
        u,
        f,
        a
      ), n.state = t.memoizedState), typeof u.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (f = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), f !== n.state && ti.enqueueReplaceState(n, n.state, null), He(t, a, n, e), Re(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps, i = ya(u, c);
      n.props = i;
      var d = n.context, g = u.contextType;
      f = Ha, typeof g == "object" && g !== null && (f = ql(g));
      var E = u.getDerivedStateFromProps;
      g = typeof E == "function" || typeof n.getSnapshotBeforeUpdate == "function", c = t.pendingProps !== c, g || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c || d !== f) && pv(
        t,
        n,
        a,
        f
      ), Au = !1;
      var m = t.memoizedState;
      n.state = m, He(t, a, n, e), Re(), d = t.memoizedState, c || m !== d || Au ? (typeof E == "function" && (li(
        t,
        u,
        E,
        a
      ), d = t.memoizedState), (i = Au || Bv(
        t,
        u,
        i,
        a,
        m,
        d,
        f
      )) ? (g || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = d), n.props = a, n.state = d, n.context = f, a = i) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, Rc(l, t), f = t.memoizedProps, g = ya(u, f), n.props = g, E = t.pendingProps, m = n.context, d = u.contextType, i = Ha, typeof d == "object" && d !== null && (i = ql(d)), c = u.getDerivedStateFromProps, (d = typeof c == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f !== E || m !== i) && pv(
        t,
        n,
        a,
        i
      ), Au = !1, m = t.memoizedState, n.state = m, He(t, a, n, e), Re();
      var h = t.memoizedState;
      f !== E || m !== h || Au || l !== null && l.dependencies !== null && qn(l.dependencies) ? (typeof c == "function" && (li(
        t,
        u,
        c,
        a
      ), h = t.memoizedState), (g = Au || Bv(
        t,
        u,
        g,
        a,
        m,
        h,
        i
      ) || l !== null && l.dependencies !== null && qn(l.dependencies)) ? (d || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, h, i), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        h,
        i
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = h), n.props = a, n.state = h, n.context = i, a = g) : (typeof n.componentDidUpdate != "function" || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, Va(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, u = a && typeof u.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = va(
      t,
      l.child,
      null,
      e
    ), t.child = va(
      t,
      null,
      u,
      e
    )) : Ol(l, t, u, e), t.memoizedState = n.state, l = t.child) : l = vu(
      l,
      t,
      e
    ), l;
  }
  function Iv(l, t, u, a) {
    return ua(), t.flags |= 256, Ol(l, t, u, a), t.child;
  }
  var ni = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function fi(l) {
    return { baseLanes: l, cachePool: jo() };
  }
  function ci(l, t, u) {
    return l = l !== null ? l.childLanes & ~u : 0, t && (l |= vt), l;
  }
  function kv(l, t, u) {
    var a = t.pendingProps, e = !1, n = (t.flags & 128) !== 0, f;
    if ((f = n) || (f = l !== null && l.memoizedState === null ? !1 : (pl.current & 2) !== 0), f && (e = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (Z) {
        if (e ? Cu(t) : Ru(), (l = ml) ? (l = Ey(
          l,
          bt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: bu !== null ? { id: Zt, overflow: Vt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, u = Ro(l), u.return = t, t.child = u, Ml = t, ml = null)) : l = null, l === null) throw _u(t);
        return f0(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return n = a.children, a = a.fallback, e ? (Ru(), e = t.mode, n = lf(
        { mode: "hidden", children: n },
        e
      ), a = ta(
        a,
        e,
        u,
        null
      ), n.return = t, a.return = t, n.sibling = a, t.child = n, a = t.child, a.memoizedState = fi(u), a.childLanes = ci(
        l,
        f,
        u
      ), t.memoizedState = ni, Ge(null, a)) : (Cu(t), ii(t, n));
    }
    var c = l.memoizedState;
    if (c !== null) {
      var i = c.dehydrated;
      if (i !== null)
        return G1(
          l,
          t,
          n,
          f,
          a,
          i,
          c,
          u
        );
    }
    return e ? (Ru(), e = a.fallback, n = t.mode, c = l.child, i = c.sibling, a = eu(c, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = c.subtreeFlags & 1206910976, i !== null ? e = eu(i, e) : (e = ta(
      e,
      n,
      u,
      null
    ), e.flags |= 2), e.return = t, a.return = t, a.sibling = e, t.child = a, Ge(null, a), a = t.child, e = l.child.memoizedState, e === null ? e = fi(u) : (n = e.cachePool, n !== null ? (c = El._currentValue, n = n.parent !== c ? { parent: c, pool: c } : n) : n = jo(), e = {
      baseLanes: e.baseLanes | u,
      cachePool: n
    }), a.memoizedState = e, a.childLanes = ci(
      l,
      f,
      u
    ), t.memoizedState = ni, Ge(l.child, a)) : (Cu(t), u = l.child, l = u.sibling, u = eu(u, {
      mode: "visible",
      children: a.children
    }), u.return = t, u.sibling = null, l !== null && (f = t.deletions, f === null ? (t.deletions = [l], t.flags |= 16) : f.push(l)), t.child = u, t.memoizedState = null, u);
  }
  function ii(l, t) {
    return t = lf(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function lf(l, t) {
    return l = wl(22, l, null, t), l.lanes = 0, l;
  }
  function tf(l, t, u) {
    return va(t, l.child, null, u), l = ii(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function G1(l, t, u, a, e, n, f, c) {
    if (u)
      return t.flags & 256 ? (Cu(t), t.flags &= -257, tf(
        l,
        t,
        c
      )) : t.memoizedState !== null ? (Ru(), t.child = l.child, t.flags |= 128, null) : (Ru(), n = e.fallback, f = t.mode, e = lf(
        { mode: "visible", children: e.children },
        f
      ), n = ta(
        n,
        f,
        c,
        null
      ), n.flags |= 2, e.return = t, n.return = t, e.sibling = n, t.child = e, va(t, l.child, null, c), e = t.child, e.memoizedState = fi(c), e.childLanes = ci(
        l,
        a,
        c
      ), t.memoizedState = ni, Ge(null, e));
    if (Cu(t), f0(n)) {
      if (a = n.nextSibling && n.nextSibling.dataset, a) var i = a.dgst;
      return a = i, a !== "" && (e = Error(r(419)), e.stack = "", e.digest = a, Ne({ value: e, source: null, stack: null })), tf(
        l,
        t,
        c
      );
    }
    if (zl || ea(l, t, c, !1), a = (c & l.childLanes) !== 0, zl || a) {
      if (Uu.current !== null)
        return tf(
          l,
          t,
          c
        );
      if (a = il, a !== null && (e = Y0(
        a,
        c
      ), e !== 0 && e !== f.retryLane))
        throw f.retryLane = e, la(l, e), Il(a, l, e), ai;
      return n0(n) || Ef(), tf(
        l,
        t,
        c
      );
    }
    return n0(n) ? (t.flags |= 192, t.child = l.child, null) : (l = f.treeContext, ml = _t(n.nextSibling), Ml = t, Z = !0, zu = null, bt = !1, l !== null && qo(t, l), t = ii(
      t,
      e.children
    ), t.flags |= 134221824, t);
  }
  function Pv(l, t, u) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), Yn(l.return, t, u);
  }
  function lm(l) {
    for (var t = null; l !== null; ) {
      var u = l.alternate;
      u !== null && Vn(u) === null && (t = l), l = l.sibling;
    }
    return t;
  }
  function uf(l, t, u, a, e, n) {
    var f = l.memoizedState;
    f === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: u,
      tailMode: e,
      treeForkCount: n
    } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = a, f.tail = u, f.tailMode = e, f.treeForkCount = n);
  }
  function oi(l) {
    var t = l.child;
    for (l.child = null; t !== null; ) {
      var u = t.sibling;
      t.sibling = l.child, l.child = t, t = u;
    }
  }
  function vi(l, t, u) {
    var a = t.pendingProps, e = a.revealOrder, n = a.tail;
    a = a.children;
    var f = pl.current;
    if (t.flags & 128)
      return Ye(t, f), null;
    var c = (f & 2) !== 0;
    if (c ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, Ye(t, f), e === "backwards" && l !== null ? (oi(l), Ol(l, t, a, u), oi(l)) : Ol(l, t, a, u), a = Z ? Oe : 0, !c && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && Pv(l, u, t);
        else if (l.tag === 19)
          Pv(l, u, t);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t)
            break l;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (e) {
      case "backwards":
        u = lm(t.child), u === null ? (e = t.child, t.child = null) : (e = u.sibling, u.sibling = null, oi(t)), uf(
          t,
          !0,
          e,
          null,
          n,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (u = null, e = t.child, t.child = null; e !== null; ) {
          if (l = e.alternate, l !== null && Vn(l) === null) {
            t.child = e;
            break;
          }
          l = e.sibling, e.sibling = u, u = e, e = l;
        }
        uf(
          t,
          !0,
          u,
          null,
          n,
          a
        );
        break;
      case "together":
        uf(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        u = lm(t.child), u === null ? (e = t.child, t.child = null) : (e = u.sibling, u.sibling = null), uf(
          t,
          !1,
          e,
          u,
          n,
          a
        );
    }
    return t.child;
  }
  function tm(l, t, u) {
    var a = t.pendingProps;
    return Ou(t, t.type, a.value), Ol(l, t, a.children, u), t.child;
  }
  function vu(l, t, u) {
    if (l !== null && (t.dependencies = l.dependencies), Bu |= t.lanes, (u & t.childLanes) === 0)
      if (l !== null) {
        if (ea(
          l,
          t,
          u,
          !1
        ), (u & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (l = t.child, u = eu(l, l.pendingProps), t.child = u, u.return = t; l.sibling !== null; )
        l = l.sibling, u = u.sibling = eu(l, l.pendingProps), u.return = t;
      u.sibling = null;
    }
    return t.child;
  }
  function mi(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && qn(l)));
  }
  function X1(l, t, u) {
    switch (t.tag) {
      case 3:
        fn(t, t.stateNode.containerInfo), Ou(t, El, l.memoizedState.cache), ua();
        break;
      case 27:
      case 5:
        Xf(t);
        break;
      case 4:
        fn(t, t.stateNode.containerInfo);
        break;
      case 10:
        Ou(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, pc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return Cu(t), t.flags |= 128, null;
          a = ea(
            l,
            t,
            u,
            !1
          );
          var e = t.child.childLanes;
          return a || (u & e) !== 0 ? kv(l, t, u) : (Cu(t), l = vu(
            l,
            t,
            u
          ), l !== null ? l.sibling : null);
        }
        Cu(t);
        break;
      case 19:
        if (t.flags & 128)
          return vi(
            l,
            t,
            u
          );
        if (e = (l.flags & 128) !== 0, a = (u & t.childLanes) !== 0, a || (ea(
          l,
          t,
          u,
          !1
        ), a = (u & t.childLanes) !== 0), e) {
          if (a)
            return vi(
              l,
              t,
              u
            );
          t.flags |= 128;
        }
        if (e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null, e.lastEffect = null), Ye(t, pl.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Jv(
          l,
          t,
          u,
          t.pendingProps
        );
      case 24:
        Ou(t, El, l.memoizedState.cache);
    }
    return vu(l, t, u);
  }
  function um(l, t, u) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        zl = !0;
      else {
        if (!mi(l, u) && (t.flags & 128) === 0)
          return zl = !1, X1(
            l,
            t,
            u
          );
        zl = (l.flags & 131072) !== 0;
      }
    else
      zl = !1, Z && (t.flags & 1048576) !== 0 && Yo(t, Oe, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (l = ia(t.elementType), t.type = l, typeof l == "function")
            Sc(l) ? (a = ya(l, a), t.tag = 1, t = Fv(
              null,
              t,
              l,
              a,
              u
            )) : (t.tag = 0, t = ei(
              null,
              t,
              l,
              a,
              u
            ));
          else {
            if (l != null) {
              var e = l.$$typeof;
              if (e === O) {
                t.tag = 11, t = xv(
                  null,
                  t,
                  l,
                  a,
                  u
                );
                break l;
              } else if (e === cl) {
                t.tag = 14, t = Lv(
                  null,
                  t,
                  l,
                  a,
                  u
                );
                break l;
              } else if (e === Al) {
                t.tag = 10, t.type = l, t = tm(
                  null,
                  t,
                  u
                );
                break l;
              }
            }
            throw t = F(l) || l, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return ei(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 1:
        return a = t.type, e = ya(
          a,
          t.pendingProps
        ), Fv(
          l,
          t,
          a,
          e,
          u
        );
      case 3:
        l: {
          if (fn(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(r(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          e = n.element, Rc(l, t), He(t, a, null, u);
          var f = t.memoizedState;
          if (a = f.cache, Ou(t, El, a), a !== n.cache && Nc(
            t,
            [El],
            u,
            !0
          ), Re(), a = f.element, n.isDehydrated)
            if (n = {
              element: a,
              isDehydrated: !1,
              cache: f.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = Iv(
                l,
                t,
                a,
                u
              );
              break l;
            } else if (a !== e) {
              e = St(
                Error(r(424)),
                t
              ), Ne(e), t = Iv(
                l,
                t,
                a,
                u
              );
              break l;
            } else {
              switch (l = t.stateNode.containerInfo, l.nodeType) {
                case 9:
                  l = l.body;
                  break;
                default:
                  l = l.nodeName === "HTML" ? l.ownerDocument.body : l;
              }
              for (ml = _t(l.firstChild), Ml = t, Z = !0, zu = null, bt = !0, u = Jo(
                t,
                null,
                a,
                u
              ), t.child = u; u; )
                u.flags = u.flags & -3 | 134221824, u = u.sibling;
            }
          else {
            if (ua(), a === e) {
              t = vu(
                l,
                t,
                u
              );
              break l;
            }
            Ol(l, t, a, u);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Va(l, t), l === null ? (u = Dy(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = u : Z || (t.stateNode = fy(
          t.type,
          t.pendingProps,
          gu.current,
          t
        )) : t.memoizedState = Dy(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Xf(t), l === null && Z && (a = t.stateNode = _y(
          t.type,
          t.pendingProps,
          gu.current
        ), Ml = t, bt = !0, e = ml, Qu(t.type) ? (c0 = e, ml = _t(a.firstChild)) : ml = e), Ol(
          l,
          t,
          t.pendingProps.children,
          u
        ), Va(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && Z && ((e = a = ml) && (a = Hs(
          a,
          t.type,
          t.pendingProps,
          bt
        ), a !== null ? (t.stateNode = a, Ml = t, ml = _t(a.firstChild), bt = !1, e = !0) : e = !1), e || _u(t)), Xf(t), e = t.type, n = t.pendingProps, f = l !== null ? l.memoizedProps : null, a = n.children, ki(e, n) ? a = null : f !== null && ki(e, f) && (t.flags |= 32), t.memoizedState !== null && (e = Qc(
          l,
          t,
          D1,
          null,
          null,
          u
        ), fe._currentValue = e), Va(l, t), Ol(l, t, a, u), t.child;
      case 6:
        return l === null && Z && ((l = u = ml) && (u = Ys(
          u,
          t.pendingProps,
          bt
        ), u !== null ? (t.stateNode = u, Ml = t, ml = null, l = !0) : l = !1), l || _u(t)), null;
      case 13:
        return kv(l, t, u);
      case 4:
        return fn(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = va(
          t,
          null,
          a,
          u
        ) : Ol(l, t, a, u), t.child;
      case 11:
        return xv(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 7:
        return a = t.pendingProps, Va(l, t), Ol(l, t, a, u), t.child;
      case 8:
        return Ol(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 12:
        return Ol(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 10:
        return tm(l, t, u);
      case 9:
        return e = t.type._context, a = t.pendingProps.children, na(t), e = ql(e), a = a(e), t.flags |= 1, Ol(l, t, a, u), t.child;
      case 14:
        return Lv(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 15:
        return Kv(
          l,
          t,
          t.type,
          t.pendingProps,
          u
        );
      case 19:
        return vi(l, t, u);
      case 31:
        return p1(l, t, u);
      case 22:
        return Jv(
          l,
          t,
          u,
          t.pendingProps
        );
      case 24:
        return na(t), a = ql(El), l === null ? (e = Mc(), e === null && (e = il, n = Ac(), e.pooledCache = n, n.refCount++, n !== null && (e.pooledCacheLanes |= u), e = n), t.memoizedState = { parent: a, cache: e }, Cc(t), Ou(t, El, e)) : ((l.lanes & u) !== 0 && (Rc(l, t), He(t, null, null, u), Re()), e = l.memoizedState, n = t.memoizedState, e.parent !== a ? (e = { parent: a, cache: a }, t.memoizedState = e, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = e), Ou(t, El, a)) : (a = n.cache, Ou(t, El, a), a !== e.cache && Nc(
          t,
          [El],
          u,
          !0
        ))), Ol(
          l,
          t,
          t.pendingProps.children,
          u
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= l === null ? 18882560 : 18874368 : Z && Rn(t), l !== null && l.memoizedProps.name !== a.name ? t.flags |= 4194816 : Va(l, t), Ol(l, t, a.children, u), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function mu(l) {
    l.flags |= 4;
  }
  function yi(l, t, u, a, e) {
    var n;
    if ((n = (l.mode & 32) !== 0) && (n = u === null ? Ry(t, a) : Ry(t, a) && (a.src !== u.src || a.srcSet !== u.srcSet)), n) {
      if (l.flags |= 16777216, (e & 335544128) === e)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (Gm()) l.flags |= 8192;
        else
          throw oa = Xn, Uc;
    } else l.flags &= -16777217;
  }
  function am(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Hy(t))
      if (Gm()) l.flags |= 8192;
      else
        throw oa = Xn, Uc;
  }
  function af(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? C0() : 536870912, l.lanes |= t, wa |= t);
  }
  function Xe(l, t) {
    if (!Z)
      switch (l.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var u = l.tail, a = null; u !== null; )
            u.alternate !== null && (a = u), u = u.sibling;
          a === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (t = l.tail, u = null; t !== null; )
            t.alternate !== null && (u = t), t = t.sibling;
          u === null ? l.tail = null : u.sibling = null;
      }
  }
  function yl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, u = 0, a = 0;
    if (t)
      for (var e = l.child; e !== null; )
        u |= e.lanes | e.childLanes, a |= e.subtreeFlags & 1206910976, a |= e.flags & 1206910976, e.return = l, e = e.sibling;
    else
      for (e = l.child; e !== null; )
        u |= e.lanes | e.childLanes, a |= e.subtreeFlags, a |= e.flags, e.return = l, e = e.sibling;
    return l.subtreeFlags |= a, l.childLanes = u, t;
  }
  function Q1(l, t, u) {
    var a = t.pendingProps;
    switch (bc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return yl(t), null;
      case 1:
        return yl(t), null;
      case 3:
        return u = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), cu(El), Ta(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (l === null || l.child === null) && (Ba(t) ? mu(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, _c())), yl(t), null;
      case 26:
        var e = t.type, n = t.memoizedState;
        return l === null ? (mu(t), n !== null ? (yl(t), am(t, n)) : (yl(t), yi(
          t,
          e,
          null,
          a,
          u
        ))) : n ? n !== l.memoizedState ? (mu(t), yl(t), am(t, n)) : (yl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && mu(t), yl(t), yi(
          t,
          e,
          l,
          a,
          u
        )), null;
      case 27:
        if (cn(t), u = gu.current, e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && mu(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return yl(t), t.subtreeFlags &= -33554433, null;
          }
          l = Qt.current, Ba(t) ? Bo(t) : (l = _y(e, a, u), t.stateNode = l, mu(t));
        }
        return yl(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (cn(t), e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && mu(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return yl(t), t.subtreeFlags &= -33554433, null;
          }
          if (n = Qt.current, Ba(t))
            Bo(t);
          else {
            var f = $e(
              gu.current
            );
            switch (n) {
              case 1:
                n = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  e
                );
                break;
              case 2:
                n = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  e
                );
                break;
              default:
                switch (e) {
                  case "svg":
                    n = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      e
                    );
                    break;
                  case "math":
                    n = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      e
                    );
                    break;
                  case "script":
                    n = f.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(
                      n.firstChild
                    );
                    break;
                  case "select":
                    n = typeof a.is == "string" ? f.createElement("select", {
                      is: a.is
                    }) : f.createElement("select"), a.multiple ? n.multiple = !0 : a.size && (n.size = a.size);
                    break;
                  default:
                    n = typeof a.is == "string" ? f.createElement(e, { is: a.is }) : f.createElement(e);
                }
            }
            n[Yl] = t, n[Jl] = a;
            l: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                n.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === t) break l;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t)
                  break l;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            t.stateNode = n;
            l: switch (Xl(n, e, a), e) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break l;
              case "img":
                a = !0;
                break l;
              default:
                a = !1;
            }
            a && mu(t);
          }
        }
        return yl(t), t.subtreeFlags &= -33554433, yi(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          u
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && mu(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(r(166));
          if (l = gu.current, Ba(t)) {
            if (l = t.stateNode, u = t.memoizedProps, a = null, e = Ml, e !== null)
              switch (e.tag) {
                case 27:
                case 5:
                  a = e.memoizedProps;
              }
            l[Yl] = t, l = !!(l.nodeValue === u || a !== null && a.suppressHydrationWarning === !0 || uy(l.nodeValue, u)), l || _u(t, !0);
          } else
            l = $e(l).createTextNode(
              a
            ), l[Yl] = t, t.stateNode = l;
        }
        return yl(t), null;
      case 31:
        if (u = t.memoizedState, l === null || l.memoizedState !== null) {
          if (a = Ba(t), u !== null) {
            if (l === null) {
              if (!a) throw Error(r(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(r(557));
              l[Yl] = t;
            } else
              ua(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            yl(t), l = !1;
          } else
            u = _c(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), l = !0;
          if (!l)
            return t.flags & 256 ? (ct(t), t) : (ct(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(r(558));
        }
        return yl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (e = Ba(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!e) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
              e[Yl] = t;
            } else
              ua(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            yl(t), e = !1;
          } else
            e = _c(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), e = !0;
          if (!e)
            return t.flags & 256 ? (ct(t), t) : (ct(t), null);
        }
        return ct(t), (t.flags & 128) !== 0 ? (t.lanes = u, t) : (u = a !== null, l = l !== null && l.memoizedState !== null, u && (a = t.child, e = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (e = a.alternate.memoizedState.cachePool.pool), n = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== e && (a.flags |= 2048)), u !== l && u && (t.child.flags |= 8192), af(t, t.updateQueue), yl(t), null);
      case 4:
        return Ta(), l === null && wi(t.stateNode.containerInfo), t.flags |= 67108864, yl(t), null;
      case 10:
        return cu(t.type), yl(t), null;
      case 19:
        if (Gc(t), a = t.memoizedState, a === null) return yl(t), null;
        if (e = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (e) Xe(a, !1);
          else {
            if (gl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = Vn(l), n !== null) {
                  for (t.flags |= 128, Xe(a, !1), l = n.updateQueue, t.updateQueue = l, af(t, l), t.subtreeFlags = 0, l = u, u = t.child; u !== null; )
                    Co(u, l), u = u.sibling;
                  return Ye(
                    t,
                    pl.current & 1 | 2
                  ), Z && nu(t, a.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && ut() > gf && (t.flags |= 128, e = !0, Xe(a, !1), t.lanes = 4194304);
          }
        else {
          if (!e)
            if (l = Vn(n), l !== null) {
              if (t.flags |= 128, e = !0, l = l.updateQueue, t.updateQueue = l, af(t, l), Xe(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !n.alternate && !Z)
                return yl(t), null;
            } else
              2 * ut() - a.renderingStartTime > gf && u !== 536870912 && (t.flags |= 128, e = !0, Xe(a, !1), t.lanes = 4194304);
          a.isBackwards ? (n.sibling = t.child, t.child = n) : (l = a.last, l !== null ? l.sibling = n : t.child = n, a.last = n);
        }
        if (a.tail !== null) {
          l = a.tail;
          l: {
            for (u = l; u !== null; ) {
              if (u.alternate !== null) {
                u = !1;
                break l;
              }
              u = u.sibling;
            }
            u = !0;
          }
          return a.rendering = l, a.tail = l.sibling, a.renderingStartTime = ut(), l.sibling = null, n = pl.current, n = e ? n & 1 | 2 : n & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !u || Z ? Ye(t, n) : (u = n, vl(Bl, t), vl(pl, u), jl === null && (jl = t)), Z && nu(t, a.treeForkCount), l;
        }
        return yl(t), null;
      case 22:
      case 23:
        return ct(t), Bc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (u & 536870912) !== 0 && (t.flags & 128) === 0 && (yl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : yl(t), u = t.updateQueue, u !== null && af(t, u.retryQueue), u = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== u && (t.flags |= 2048), l !== null && Hl(ca), null;
      case 24:
        return u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), cu(El), yl(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, yl(t), null;
    }
    throw Error(r(156, t.tag));
  }
  function j1(l, t) {
    switch (bc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return cu(El), Ta(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return cn(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (ct(t), t.alternate === null)
            throw Error(r(340));
          ua();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (ct(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          ua();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return Gc(t), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Ta(), null;
      case 10:
        return cu(t.type), null;
      case 22:
      case 23:
        return ct(t), Bc(), l !== null && Hl(ca), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return cu(El), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function em(l, t) {
    switch (bc(t), t.tag) {
      case 3:
        cu(El), Ta();
        break;
      case 26:
      case 27:
      case 5:
        cn(t);
        break;
      case 4:
        Ta();
        break;
      case 31:
        t.memoizedState !== null && ct(t);
        break;
      case 13:
        ct(t);
        break;
      case 19:
        Gc(t);
        break;
      case 10:
        cu(t.type);
        break;
      case 22:
      case 23:
        ct(t), Bc(), l !== null && Hl(ca);
        break;
      case 24:
        cu(El);
    }
  }
  function Qe(l, t) {
    try {
      var u = t.updateQueue, a = u !== null ? u.lastEffect : null;
      if (a !== null) {
        var e = a.next;
        u = e;
        do {
          if ((u.tag & l) === l) {
            a = void 0;
            var n = u.create, f = u.inst;
            a = n(), f.destroy = a;
          }
          u = u.next;
        } while (u !== e);
      }
    } catch (c) {
      el(t, t.return, c);
    }
  }
  function Hu(l, t, u) {
    try {
      var a = t.updateQueue, e = a !== null ? a.lastEffect : null;
      if (e !== null) {
        var n = e.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var f = a.inst, c = f.destroy;
            if (c !== void 0) {
              f.destroy = void 0, e = t;
              var i = u, d = c;
              try {
                d();
              } catch (g) {
                el(
                  e,
                  i,
                  g
                );
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (g) {
      el(t, t.return, g);
    }
  }
  function nm(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var u = l.stateNode;
      try {
        Wo(t, u);
      } catch (a) {
        el(l, l.return, a);
      }
    }
  }
  function fm(l, t, u) {
    u.props = ya(
      l.type,
      l.memoizedProps
    ), u.state = l.memoizedState;
    try {
      u.componentWillUnmount();
    } catch (a) {
      el(l, t, a);
    }
  }
  function xt(l, t) {
    try {
      var u = l.ref;
      if (u !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            var e = l.stateNode, n = uu(l.memoizedProps, e);
            (e.ref === null || e.ref.name !== n) && (e.ref = dy(n)), a = e.ref;
            break;
          case 7:
            if (l.stateNode === null) {
              var f = new yt(l);
              T(
                l.child,
                !1,
                Cs,
                f,
                void 0,
                void 0
              ), l.stateNode = f;
            }
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof u == "function" ? l.refCleanup = u(a) : u.current = a;
      }
    } catch (c) {
      el(l, t, c);
    }
  }
  function Gl(l, t) {
    var u = l.ref, a = l.refCleanup;
    if (u !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (e) {
          el(l, t, e);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof u == "function")
        try {
          u(null);
        } catch (e) {
          el(l, t, e);
        }
      else u.current = null;
  }
  function ef(l, t) {
    if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && l.alternate === null && t !== null)
      for (var u = 0; u < t.length; u++)
        Ty(
          l.stateNode,
          t[u]
        );
  }
  function cm(l) {
    for (var t = l.return; t !== null && (si(t) && Ty(l.stateNode, t.stateNode), !di(t)); )
      t = t.return;
  }
  function je(l) {
    for (var t = l.return; t !== null && (si(t) && Rs(l.stateNode, t.stateNode), !di(t)); )
      t = t.return;
  }
  function di(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 27;
  }
  function si(l) {
    return l && l.tag === 7 && l.stateNode !== null;
  }
  function hi(l) {
    var t = l.type, u = l.memoizedProps, a = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          u.autoFocus && a.focus();
          break l;
        case "img":
          u.src ? a.src = u.src : u.srcSet && (a.srcset = u.srcSet);
      }
    } catch (e) {
      el(l, l.return, e);
    }
  }
  function gi(l, t, u) {
    try {
      var a = l.stateNode;
      ys(a, l.type, u, t), a[Jl] = t;
    } catch (e) {
      el(l, l.return, e);
    }
  }
  function im(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Qu(l.type) || l.tag === 4;
  }
  function ri(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || im(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Qu(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Si(l, t, u, a) {
    var e = l.tag;
    if (e === 5 || e === 6)
      e = l.stateNode, t ? (u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u).insertBefore(e, t) : (t = u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u, t.appendChild(e), u = u._reactRootContainer, u != null || t.onclick !== null || (t.onclick = jt)), ef(l, a), I = !0;
    else if (e !== 4 && (e === 27 && (ef(l, a), a = null, Qu(l.type) && (u = l.stateNode, t = null)), l = l.child, l !== null))
      for (Si(
        l,
        t,
        u,
        a
      ), l = l.sibling; l !== null; )
        Si(
          l,
          t,
          u,
          a
        ), l = l.sibling;
  }
  function nf(l, t, u, a) {
    var e = l.tag;
    if (e === 5 || e === 6)
      e = l.stateNode, t ? u.insertBefore(e, t) : u.appendChild(e), ef(l, a), I = !0;
    else if (e !== 4 && (e === 27 && (ef(l, a), a = null, Qu(l.type) && (u = l.stateNode)), l = l.child, l !== null))
      for (nf(
        l,
        t,
        u,
        a
      ), l = l.sibling; l !== null; )
        nf(
          l,
          t,
          u,
          a
        ), l = l.sibling;
  }
  function om(l) {
    var t = l.stateNode, u = l.memoizedProps;
    try {
      for (var a = l.type, e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      Xl(t, a, u), t[Yl] = l, t[Jl] = u;
    } catch (n) {
      el(l, l.return, n);
    }
  }
  var ff = !1, it = null;
  function vm(l) {
    (l.tag === 30 || (l.subtreeFlags & 33554432) !== 0) && (ff = !0);
  }
  var Lt = null;
  function mm() {
    var l = Lt;
    return Lt = null, l;
  }
  var Wl = 0;
  function xa(l, t, u, a, e) {
    return Wl = 0, ym(
      l.child,
      t,
      u,
      a,
      e
    );
  }
  function ym(l, t, u, a, e) {
    for (var n = !1; l !== null; ) {
      if (l.tag === 5) {
        var f = l.stateNode;
        if (a !== null) {
          var c = t0(f);
          a.push(c), c.view && (n = !0);
        } else
          n || t0(f).view && (n = !0);
        ff = !0, my(
          f,
          Wl === 0 ? t : t + "_" + Wl,
          u
        ), Wl++;
      } else (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && e || ym(
        l.child,
        t,
        u,
        a,
        e
      ) && (n = !0));
      l = l.sibling;
    }
    return n;
  }
  function Kt(l, t) {
    for (; l !== null; )
      l.tag === 5 ? yy(l.stateNode, l.memoizedProps) : (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && t || Kt(
        l.child,
        t
      )), l = l.sibling;
  }
  function cf(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if ((l.tag !== 22 || l.memoizedState === null) && (cf(l), l.tag === 30 && (l.flags & 18874368) !== 0 && l.stateNode.paired)) {
          var t = l.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(r(544));
          var u = t.name;
          t = au(t.default, t.share), t !== "none" && (xa(
            l,
            u,
            t,
            null,
            !1
          ) || Kt(l.child, !1));
        }
        l = l.sibling;
      }
  }
  function Ti(l, t) {
    if (l.tag === 30) {
      var u = l.stateNode, a = l.memoizedProps, e = uu(a, u), n = au(
        a.default,
        u.paired ? a.share : a.enter
      );
      n !== "none" ? xa(l, e, n, null, !1) ? (cf(l), u.paired || t || Ia(l, a.onEnter)) : Kt(l.child, !1) : cf(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        Ti(l, t), l = l.sibling;
    else cf(l);
  }
  function Ei(l) {
    if (it !== null && it.size !== 0) {
      var t = it;
      if ((l.subtreeFlags & 18874368) !== 0)
        for (l = l.child; l !== null; ) {
          if (l.tag !== 22 || l.memoizedState === null) {
            if (l.tag === 30 && (l.flags & 18874368) !== 0) {
              var u = l.memoizedProps, a = u.name;
              if (a != null && a !== "auto") {
                var e = t.get(a);
                if (e !== void 0) {
                  var n = au(
                    u.default,
                    u.share
                  );
                  if (n !== "none" && (xa(
                    l,
                    a,
                    n,
                    null,
                    !1
                  ) ? (n = l.stateNode, e.paired = n, n.paired = e, Ia(l, u.onShare)) : Kt(l.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Ei(l);
          }
          l = l.sibling;
        }
    }
  }
  function bi(l) {
    if (l.tag === 30) {
      var t = l.memoizedProps, u = uu(t, l.stateNode), a = it !== null ? it.get(u) : void 0, e = au(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      e !== "none" && (xa(l, u, e, null, !1) ? a !== void 0 ? (e = l.stateNode, a.paired = e, e.paired = a, it.delete(u), Ia(l, t.onShare)) : Ia(l, t.onExit) : Kt(l.child, !1)), it !== null && Ei(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        bi(l), l = l.sibling;
    else
      it !== null && Ei(l);
  }
  function dm(l) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var t = l.memoizedProps, u = uu(t, l.stateNode);
        t = au(t.default, t.update), l.flags &= -5, t !== "none" && xa(
          l,
          u,
          t,
          l.memoizedState = [],
          !1
        );
      } else
        (l.subtreeFlags & 33554432) !== 0 && dm(l);
      l = l.sibling;
    }
  }
  function zi(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if (l.tag !== 22 || l.memoizedState === null) {
          if (l.tag === 30 && (l.flags & 18874368) !== 0) {
            var t = l.stateNode;
            t.paired !== null && (t.paired = null, Kt(l.child, !1));
          }
          zi(l);
        }
        l = l.sibling;
      }
  }
  function of(l) {
    if (l.tag === 30)
      l.stateNode.paired = null, Kt(l.child, !1), zi(l);
    else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        of(l), l = l.sibling;
    else zi(l);
  }
  function sm(l) {
    for (l = l.child; l !== null; )
      l.tag === 30 ? Kt(l.child, !1) : (l.subtreeFlags & 33554432) !== 0 && sm(l), l = l.sibling;
  }
  function _i(l, t, u, a, e, n, f) {
    for (var c = !1; t !== null; ) {
      if (t.tag === 5) {
        var i = t.stateNode;
        if (n !== null && Wl < n.length) {
          var d = n[Wl], g = t0(i);
          (d.view || g.view) && (c = !0);
          var E;
          if (E = (l.flags & 4) === 0)
            if (g.clip) E = !0;
            else {
              E = d.rect;
              var m = g.rect;
              E = E.y !== m.y || E.x !== m.x || E.height !== m.height || E.width !== m.width;
            }
          E && (l.flags |= 4), g.abs ? g = !d.abs : (d = d.rect, g = g.rect, g = d.height !== g.height || d.width !== g.width), g && (l.flags |= 32);
        } else l.flags |= 32;
        (l.flags & 4) !== 0 && my(
          i,
          Wl === 0 ? u : u + "_" + Wl,
          e
        ), c && (l.flags & 4) !== 0 || (Lt === null && (Lt = []), Lt.push(
          i,
          Wl === 0 ? a : a + "_" + Wl,
          t.memoizedProps
        )), Wl++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && f ? l.flags |= t.flags & 32 : _i(
        l,
        t.child,
        u,
        a,
        e,
        n,
        f
      ) && (c = !0));
      t = t.sibling;
    }
    return c;
  }
  function hm(l, t) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var u = l.memoizedProps, a = l.stateNode, e = uu(u, a), n = au(u.default, u.update), f;
        f = l.memoizedState, l.memoizedState = null, a = l;
        var c = l.child;
        Wl = 0, e = _i(
          a,
          c,
          e,
          e,
          n,
          f,
          !1
        ), (l.flags & 4) !== 0 && e && Ia(l, u.onUpdate);
      } else
        (l.subtreeFlags & 33554432) !== 0 && hm(l);
      l = l.sibling;
    }
  }
  var Ul = !1, ul = !1, Jt = !1, Oi = !1, gm = typeof WeakSet == "function" ? WeakSet : Set, Cl = null, wt = !1, Ze = !1, vf = !1, Ni = !1;
  function Z1(l, t, u) {
    if (l = l.containerInfo, Fi = ce, l = Eo(l), mc(l)) {
      if ("selectionStart" in l)
        var a = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          a = (a = l.ownerDocument) && a.defaultView || window;
          var e = a.getSelection && a.getSelection();
          if (e && e.rangeCount !== 0) {
            a = e.anchorNode;
            var n = e.anchorOffset, f = e.focusNode;
            e = e.focusOffset;
            try {
              a.nodeType, f.nodeType;
            } catch {
              a = null;
              break l;
            }
            var c = 0, i = -1, d = -1, g = 0, E = 0, m = l, h = null;
            t: for (; ; ) {
              for (var _; m !== a || n !== 0 && m.nodeType !== 3 || (i = c + n), m !== f || e !== 0 && m.nodeType !== 3 || (d = c + e), m.nodeType === 3 && (c += m.nodeValue.length), (_ = m.firstChild) !== null; )
                h = m, m = _;
              for (; ; ) {
                if (m === l) break t;
                if (h === a && ++g === n && (i = c), h === f && ++E === e && (d = c), (_ = m.nextSibling) !== null) break;
                m = h, h = m.parentNode;
              }
              m = _;
            }
            a = i === -1 || d === -1 ? null : { start: i, end: d };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Ii = { focusedElem: l, selectionRange: a }, ce = !1, u = (u & 335544064) === u, Cl = t, t = u ? 9270 : 1024; Cl !== null; ) {
      if (l = Cl, u && (a = l.deletions, a !== null))
        for (n = 0; n < a.length; n++)
          u && bi(a[n]);
      if (l.alternate === null && (l.flags & 2) !== 0)
        u && vm(l), mf(u);
      else {
        if (l.tag === 22) {
          if (a = l.alternate, l.memoizedState !== null) {
            a !== null && a.memoizedState === null && u && bi(a), mf(u);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            u && vm(l), mf(u);
            continue;
          }
        }
        a = l.child, (l.subtreeFlags & t) !== 0 && a !== null ? (a.return = l, Cl = a) : (u && dm(l), mf(u));
      }
    }
    it = null;
  }
  function mf(l) {
    for (; Cl !== null; ) {
      var t = Cl, u = l, a = t.alternate, e = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((e & 1024) !== 0 && a !== null) {
            u = void 0, e = a.memoizedProps, a = a.memoizedState;
            var n = t.stateNode;
            try {
              var f = ya(
                t.type,
                e
              );
              u = n.getSnapshotBeforeUpdate(
                f,
                a
              ), n.__reactInternalSnapshotBeforeUpdate = u;
            } catch (c) {
              el(t, t.return, c);
            }
          }
          break;
        case 3:
          if ((e & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, u = a.nodeType, u === 9)
              e0(a);
            else if (u === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  e0(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          u && a !== null && (u = uu(
            a.memoizedProps,
            a.stateNode
          ), e = t.memoizedProps, e = au(e.default, e.update), e !== "none" && xa(
            a,
            u,
            e,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((e & 1024) !== 0) throw Error(r(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, Cl = a;
        break;
      }
      Cl = t.return;
    }
  }
  function rm(l, t, u) {
    var a = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        Wt(l, u), a & 4 && Qe(5, u);
        break;
      case 1:
        if (Wt(l, u), a & 4)
          if (l = u.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (f) {
              el(u, u.return, f);
            }
          else {
            var e = ya(
              u.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                e,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              el(
                u,
                u.return,
                f
              );
            }
          }
        a & 64 && nm(u), a & 512 && xt(u, u.return);
        break;
      case 3:
        if (Wt(l, u), a & 64 && (l = u.updateQueue, l !== null)) {
          if (t = null, u.child !== null)
            switch (u.child.tag) {
              case 27:
              case 5:
                t = u.child.stateNode;
                break;
              case 1:
                t = u.child.stateNode;
            }
          try {
            Wo(l, t);
          } catch (f) {
            el(u, u.return, f);
          }
        }
        break;
      case 27:
        t === null && a & 4 && om(u);
      case 26:
      case 5:
        Wt(l, u), t === null && a & 4 && hi(u), a & 512 && xt(u, u.return);
        break;
      case 12:
        Wt(l, u);
        break;
      case 31:
        Wt(l, u), a & 4 && bm(l, u);
        break;
      case 13:
        Wt(l, u), a & 4 && zm(l, u), a & 64 && (l = u.memoizedState, l !== null && (l = l.dehydrated, l !== null && (u = P1.bind(
          null,
          u
        ), qs(l, u))));
        break;
      case 22:
        if (a = u.memoizedState !== null || Ul, !a) {
          var n = t !== null && t.memoizedState !== null || ul;
          t = Ul, e = ul, Ul = a, (ul = n) && !e ? (a = 2, (u.subtreeFlags & 8772) !== 0 && (a |= 1), Rt(
            l,
            u,
            a
          )) : Wt(l, u), Ul = t, ul = e;
        }
        break;
      case 30:
        Wt(l, u), a & 512 && xt(u, u.return);
        break;
      case 7:
        a & 512 && xt(u, u.return);
      default:
        Wt(l, u);
    }
  }
  function Ai(l, t) {
    for (l = l.child; l !== null; )
      Sm(l, t), l = l.sibling;
  }
  function Sm(l, t) {
    switch (l.tag) {
      case 5:
      case 26:
        try {
          var u = l.stateNode;
          if (t) {
            var a = u.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var e = l.stateNode, n = l.memoizedProps.style, f = n != null && n.hasOwnProperty("display") ? n.display : null;
            e.style.display = f == null || typeof f == "boolean" ? "" : ("" + f).trim();
          }
        } catch (i) {
          el(l, l.return, i);
        }
        Di(l, t);
        break;
      case 6:
        try {
          l.stateNode.nodeValue = t ? "" : l.memoizedProps, I = !0;
        } catch (i) {
          el(l, l.return, i);
        }
        break;
      case 18:
        try {
          var c = l.stateNode;
          t ? vy(c, !0) : vy(l.stateNode, !1);
        } catch (i) {
          el(l, l.return, i);
        }
        break;
      case 22:
      case 23:
        l.memoizedState === null && Ai(l, t);
        break;
      default:
        Ai(l, t);
    }
  }
  function Di(l, t) {
    if (l.subtreeFlags & 67108864)
      for (l = l.child; l !== null; ) {
        l: {
          var u = l, a = t;
          switch (u.tag) {
            case 4:
              Sm(u, a);
              break l;
            case 22:
              u.memoizedState === null && Di(u, a);
              break l;
            default:
              Di(u, a);
          }
        }
        l = l.sibling;
      }
  }
  function Tm(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, Tm(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && hn(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var dl = null, $l = !1;
  function Ut(l, t, u) {
    for (u = u.child; u !== null; )
      Em(l, t, u), u = u.sibling;
  }
  function Em(l, t, u) {
    if (at && typeof at.onCommitFiberUnmount == "function")
      try {
        at.onCommitFiberUnmount(ve, u);
      } catch {
      }
    switch (u.tag) {
      case 26:
        ul || Gl(u, t), Ut(
          l,
          t,
          u
        ), u.memoizedState ? u.memoizedState.count-- : u.stateNode && !ul && (u = u.stateNode, u.parentNode.removeChild(u));
        break;
      case 27:
        ul || Gl(u, t), je(u);
        var a = dl, e = $l;
        Qu(u.type) && (dl = u.stateNode, $l = !1), Ut(
          l,
          t,
          u
        ), Oy(
          u.stateNode,
          u.type,
          u.memoizedProps
        ), dl = a, $l = e;
        break;
      case 5:
        ul || Gl(u, t), je(u);
      case 6:
        if (u.tag === 6 && je(u), a = dl, e = $l, dl = null, Ut(
          l,
          t,
          u
        ), dl = a, $l = e, dl !== null)
          if ($l)
            try {
              (dl.nodeType === 9 ? dl.body : dl.nodeName === "HTML" ? dl.ownerDocument.body : dl).removeChild(u.stateNode), I = !0;
            } catch (n) {
              el(
                u,
                t,
                n
              );
            }
          else
            try {
              dl.removeChild(u.stateNode), I = !0;
            } catch (n) {
              el(
                u,
                t,
                n
              );
            }
        break;
      case 18:
        dl !== null && ($l ? (l = dl, oy(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          u.stateNode
        ), ie(l)) : oy(dl, u.stateNode));
        break;
      case 4:
        a = dl, e = $l, dl = u.stateNode.containerInfo, $l = !0, Ut(
          l,
          t,
          u
        ), dl = a, $l = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Hu(2, u, t), ul || Hu(4, u, t), Ut(
          l,
          t,
          u
        );
        break;
      case 1:
        ul || (Gl(u, t), a = u.stateNode, typeof a.componentWillUnmount == "function" && fm(
          u,
          t,
          a
        )), Ut(
          l,
          t,
          u
        );
        break;
      case 21:
        Ut(
          l,
          t,
          u
        );
        break;
      case 22:
        ul = (a = ul) || u.memoizedState !== null, Ut(
          l,
          t,
          u
        ), ul = a;
        break;
      case 30:
        Gl(u, t), Ut(
          l,
          t,
          u
        );
        break;
      case 7:
        ul || Gl(u, t), Ut(
          l,
          t,
          u
        );
        break;
      default:
        Ut(
          l,
          t,
          u
        );
    }
  }
  function bm(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        ie(l);
      } catch (u) {
        el(t, t.return, u);
      }
    }
  }
  function zm(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        ie(l);
      } catch (u) {
        el(t, t.return, u);
      }
  }
  function V1(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new gm()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new gm()), t;
      default:
        throw Error(r(435, l.tag));
    }
  }
  function yf(l, t) {
    var u = V1(l);
    t.forEach(function(a) {
      if (!u.has(a)) {
        u.add(a);
        var e = ls.bind(null, l, a);
        a.then(e, e);
      }
    });
  }
  function xl(l, t, u) {
    var a = t.deletions;
    if (a !== null)
      for (var e = 0; e < a.length; e++) {
        var n = a[e], f = l, c = t, i = c;
        l: for (; i !== null; ) {
          switch (i.tag) {
            case 27:
              if (Qu(i.type)) {
                dl = i.stateNode, $l = !1;
                break l;
              }
              break;
            case 5:
              dl = i.stateNode, $l = !1;
              break l;
            case 3:
            case 4:
              dl = i.stateNode.containerInfo, $l = !0;
              break l;
          }
          i = i.return;
        }
        if (dl === null) throw Error(r(160));
        Em(f, c, n), dl = null, $l = !1, f = n.alternate, f !== null && (f.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        _m(t, l, u), t = t.sibling;
  }
  var Ct = null;
  function _m(l, t, u) {
    var a = l.alternate, e = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (e & 4 && (a = l.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var n = 0; n < a.length; n++) {
            var f = a[n];
            f.ref.impl = f.nextImpl;
          }
        xl(t, l, u), Ll(l), e & 4 && (Hu(3, l, l.return), Qe(3, l), Hu(5, l, l.return));
        break;
      case 1:
        xl(t, l, u), Ll(l), e & 512 && (ul || a === null || Gl(a, a.return)), e & 64 && Ul && (l = l.updateQueue, l !== null && (t = l.callbacks, t !== null && (u = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = u === null ? t : u.concat(t))));
        break;
      case 26:
        if (n = Ct, xl(t, l, u), Ll(l), e & 512 && (ul || a === null || Gl(a, a.return)), e & 4)
          if (e = a !== null ? a.memoizedState : null, u = l.memoizedState, a === null)
            if (u === null)
              if (l.stateNode === null)
                if (Ul)
                  l.stateNode = fy(
                    l.type,
                    l.memoizedProps,
                    t.containerInfo,
                    l
                  );
                else {
                  l: {
                    t = l.type, u = l.memoizedProps, e = n.ownerDocument || n;
                    t: switch (t) {
                      case "title":
                        a = e.getElementsByTagName("title")[0], (!a || a[de] || a[Yl] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = e.createElement(t), e.head.insertBefore(
                          a,
                          e.querySelector("head > title")
                        )), Xl(a, t, u), a[Yl] = l, Dl(a), t = a;
                        break l;
                      case "link":
                        if (n = Cy(
                          "link",
                          "href",
                          e
                        ).get(t + (u.href || ""))) {
                          for (f = 0; f < n.length; f++)
                            if (a = n[f], a.getAttribute("href") === (u.href == null || u.href === "" ? null : u.href) && a.getAttribute("rel") === (u.rel == null ? null : u.rel) && a.getAttribute("title") === (u.title == null ? null : u.title) && a.getAttribute("crossorigin") === (u.crossOrigin == null ? null : u.crossOrigin)) {
                              n.splice(f, 1);
                              break t;
                            }
                        }
                        a = e.createElement(t), Xl(a, t, u), e.head.appendChild(a);
                        break;
                      case "meta":
                        if (n = Cy(
                          "meta",
                          "content",
                          e
                        ).get(t + (u.content || ""))) {
                          for (f = 0; f < n.length; f++)
                            if (a = n[f], a.getAttribute("content") === (u.content == null ? null : "" + u.content) && a.getAttribute("name") === (u.name == null ? null : u.name) && a.getAttribute("property") === (u.property == null ? null : u.property) && a.getAttribute("http-equiv") === (u.httpEquiv == null ? null : u.httpEquiv) && a.getAttribute("charset") === (u.charSet == null ? null : u.charSet)) {
                              n.splice(f, 1);
                              break t;
                            }
                        }
                        a = e.createElement(t), Xl(a, t, u), e.head.appendChild(a);
                        break;
                      default:
                        throw Error(r(468, t));
                    }
                    a[Yl] = l, Dl(a), t = a;
                  }
                  l.stateNode = t;
                }
              else
                Ul || m0(n, l.type, l.stateNode);
            else
              l.stateNode = Uy(
                n,
                u,
                l.memoizedProps
              );
          else
            e !== u ? (e === null ? (t = a.stateNode, t === null || ul || t.parentNode.removeChild(t)) : e.count--, u === null ? Ul || m0(n, l.type, l.stateNode) : Uy(n, u, l.memoizedProps)) : u === null && l.stateNode !== null && gi(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        xl(t, l, u), Ll(l), e & 512 && (ul || a === null || Gl(a, a.return)), a !== null && e & 4 && gi(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (n = Jt, Jt = !1, xl(t, l, u), Jt = n, Ll(l), e & 512 && (ul || a === null || Gl(a, a.return)), l.flags & 32) {
          t = l.stateNode;
          try {
            Na(t, ""), I = !0;
          } catch (g) {
            el(l, l.return, g);
          }
        }
        e & 4 && l.stateNode != null && (t = l.memoizedProps, gi(
          l,
          t,
          a !== null ? a.memoizedProps : t
        )), e & 1024 && (Oi = !0);
        break;
      case 6:
        if (xl(t, l, u), Ll(l), e & 4) {
          if (l.stateNode === null)
            throw Error(r(162));
          t = l.memoizedProps, u = l.stateNode;
          try {
            u.nodeValue = t, I = !0;
          } catch (g) {
            el(l, l.return, g);
          }
        }
        break;
      case 3:
        if (I = !1, Df = null, n = Ct, Ct = Fe(t.containerInfo), xl(t, l, u), Ct = n, Ll(l), e & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            ie(t.containerInfo);
          } catch (g) {
            el(l, l.return, g);
          }
        Oi && (Oi = !1, Om(l)), I = !1;
        break;
      case 4:
        e = Jt, Jt = Ul, a = x0(), n = Ct, Ct = Fe(
          l.stateNode.containerInfo
        ), xl(t, l, u), Ll(l), Ct = n, I && Ze && (vf = !0), I = a, Jt = e;
        break;
      case 12:
        xl(t, l, u), Ll(l);
        break;
      case 31:
        xl(t, l, u), Ll(l), e & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, yf(l, t)));
        break;
      case 13:
        xl(t, l, u), Ll(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (hf = ut()), e & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, yf(l, t)));
        break;
      case 22:
        n = l.memoizedState !== null, f = a !== null && a.memoizedState !== null;
        var c = Ul, i = ul, d = Jt;
        Ul = c || n, Jt = d || n, ul = i || f, xl(t, l, u), ul = i, Jt = d, Ul = c, Ll(l), e & 8192 && (t = l.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, !n || a === null || f || Ul || ul || (t = f || ul, u = Ul, a = ul, Ul = n || Ul, ul = t, Yu(l, 2), Ul = u, ul = a), !n && Jt || Ai(l, n)), e & 4 && (t = l.updateQueue, t !== null && (u = t.retryQueue, u !== null && (t.retryQueue = null, yf(l, u))));
        break;
      case 19:
        xl(t, l, u), Ll(l), e & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, yf(l, t)));
        break;
      case 30:
        e & 512 && (ul || a === null || Gl(a, a.return)), e = x0(), n = Ze, f = (u & 335544064) === u, c = l.memoizedProps, Ze = f && au(
          c.default,
          c.update
        ) !== "none", xl(t, l, u), Ll(l), f && a !== null && I && (l.flags |= 4), Ze = n, I = e;
        break;
      case 21:
        break;
      case 7:
        e & 512 && (ul || a === null || Gl(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = l);
      default:
        xl(t, l, u), Ll(l);
    }
  }
  function Ll(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var u, a = l.return; a !== null; ) {
          if (im(a)) {
            u = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var e = l.return; e !== null; ) {
          if (si(e)) {
            var n = e.stateNode;
            a === null ? a = [n] : a.push(n);
          }
          if (di(e)) break;
          e = e.return;
        }
        var f = a;
        if (u == null) throw Error(r(160));
        switch (u.tag) {
          case 27:
            var c = u.stateNode, i = ri(l);
            nf(
              l,
              i,
              c,
              f
            );
            break;
          case 5:
            var d = u.stateNode;
            u.flags & 32 && (Na(d, ""), u.flags &= -33);
            var g = ri(l);
            nf(
              l,
              g,
              d,
              f
            );
            break;
          case 3:
          case 4:
            var E = u.stateNode.containerInfo, m = ri(l);
            Si(
              l,
              m,
              E,
              f
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (h) {
        el(l, l.return, h);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function Om(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        Om(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, ce = !0, t.reset(), ce = !1), l = l.sibling;
      }
  }
  function La(l, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Nm(t, l), t = t.sibling;
    else hm(t);
  }
  function Nm(l, t) {
    var u = l.alternate;
    if (u === null) Ti(l, !1);
    else
      switch (l.tag) {
        case 3:
          if (Ni = wt = !1, mm(), La(t, l), !wt && !vf) {
            if (l = Lt, l !== null)
              for (var a = 0; a < l.length; a += 3) {
                u = l[a];
                var e = l[a + 1];
                yy(u, l[a + 2]), u = u.ownerDocument.documentElement, u !== null && u.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + e + ")"
                  }
                );
              }
            l = t.containerInfo, l = l.nodeType === 9 ? l.documentElement : l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "" && (l.style.viewTransitionName = "none", l.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), l.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Ni = !0;
          }
          Lt = null;
          break;
        case 5:
          La(t, l);
          break;
        case 4:
          a = wt, wt = !1, La(t, l), wt && (vf = !0), wt = a;
          break;
        case 22:
          l.memoizedState === null && (u.memoizedState !== null ? Ti(l, !1) : La(t, l));
          break;
        case 30:
          a = wt, e = mm(), wt = !1, La(t, l), wt && (l.flags |= 4);
          var n = l.memoizedProps, f = l.stateNode;
          t = uu(n, f), f = uu(u.memoizedProps, f);
          var c = au(n.default, n.update);
          c === "none" ? t = !1 : (n = u.memoizedState, u.memoizedState = null, u = l.child, Wl = 0, t = _i(
            l,
            u,
            t,
            f,
            c,
            n,
            !0
          ), Wl !== (n === null ? 0 : n.length) && (l.flags |= 32)), (l.flags & 4) !== 0 && t ? (Ia(
            l,
            l.memoizedProps.onUpdate
          ), Lt = e) : e !== null && (e.push.apply(e, Lt), Lt = e), wt = (l.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          La(t, l);
      }
  }
  function Wt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        rm(l, t.alternate, t), t = t.sibling;
  }
  function Yu(l, t) {
    for (l = l.child; l !== null; ) {
      var u = l, a = t;
      switch (u.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Hu(4, u, u.return), Yu(
            u,
            a
          );
          break;
        case 1:
          Gl(u, u.return);
          var e = u.stateNode;
          typeof e.componentWillUnmount == "function" && fm(
            u,
            u.return,
            e
          ), Yu(
            u,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && Oy(
            u.stateNode,
            u.type,
            u.memoizedProps
          );
        case 5:
          Gl(u, u.return), u.tag !== 5 && u.tag !== 27 || je(u), Yu(
            u,
            a
          );
          break;
        case 6:
          je(u);
          break;
        case 26:
          Gl(u, u.return), e = u.stateNode, u.memoizedState !== null || e === null || ul || e.parentNode.removeChild(e), Yu(
            u,
            a
          );
          break;
        case 22:
          u.memoizedState === null && Yu(
            u,
            a
          );
          break;
        case 30:
          Gl(u, u.return), Yu(
            u,
            a
          );
          break;
        case 7:
          Gl(u, u.return);
        default:
          Yu(
            u,
            a
          );
      }
      l = l.sibling;
    }
  }
  function Rt(l, t, u) {
    for (u = (t.subtreeFlags & 8772) !== 0 ? u : u & -2, t = t.child; t !== null; ) {
      var a = t.alternate, e = l, n = t, f = n.flags, c = (u & 1) !== 0;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Rt(
            e,
            n,
            u
          ), Qe(4, n);
          break;
        case 1:
          if (Rt(
            e,
            n,
            u
          ), a = n, e = a.stateNode, typeof e.componentDidMount == "function")
            try {
              e.componentDidMount();
            } catch (g) {
              el(a, a.return, g);
            }
          if (a = n, e = a.updateQueue, e !== null) {
            var i = a.stateNode;
            try {
              var d = e.shared.hiddenCallbacks;
              if (d !== null)
                for (e.shared.hiddenCallbacks = null, e = 0; e < d.length; e++)
                  wo(d[e], i);
            } catch (g) {
              el(a, a.return, g);
            }
          }
          c && f & 64 && nm(n), xt(n, n.return);
          break;
        case 27:
          (u & 2) !== 0 && om(n);
        case 5:
          n.tag !== 5 && n.tag !== 27 || cm(n), Rt(
            e,
            n,
            u
          ), c && a === null && f & 4 && hi(n), xt(n, n.return);
          break;
        case 6:
          cm(n);
          break;
        case 26:
          i = n.stateNode, n.memoizedState !== null || i === null || Ul || m0(
            Fe(i.ownerDocument),
            n.type,
            i
          ), Rt(
            e,
            n,
            u
          ), c && a === null && f & 4 && hi(n), xt(n, n.return);
          break;
        case 12:
          Rt(
            e,
            n,
            u
          );
          break;
        case 31:
          Rt(
            e,
            n,
            u
          ), c && f & 4 && bm(e, n);
          break;
        case 13:
          Rt(
            e,
            n,
            u
          ), c && f & 4 && zm(e, n);
          break;
        case 22:
          n.memoizedState === null && Rt(
            e,
            n,
            u
          ), xt(n, n.return);
          break;
        case 30:
          Rt(
            e,
            n,
            u
          ), xt(n, n.return);
          break;
        case 7:
          xt(n, n.return);
        default:
          Rt(
            e,
            n,
            u
          );
      }
      t = t.sibling;
    }
  }
  function Mi(l, t) {
    var u = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== u && (l != null && l.refCount++, u != null && Ae(u));
  }
  function Ui(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Ae(l));
  }
  function zt(l, t, u, a) {
    var e = (u & 335544064) === u;
    if (t.subtreeFlags & (e ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Am(
          l,
          t,
          u,
          a
        ), t = t.sibling;
    else e && sm(t);
  }
  function Am(l, t, u, a) {
    var e = (u & 335544064) === u;
    e && t.alternate === null && t.return !== null && t.return.alternate !== null && of(t);
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        zt(
          l,
          t,
          u,
          a
        ), n & 2048 && Qe(9, t);
        break;
      case 1:
        zt(
          l,
          t,
          u,
          a
        );
        break;
      case 3:
        zt(
          l,
          t,
          u,
          a
        ), e && Ni && (l = l.containerInfo, l = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, l.style.viewTransitionName === "root" && (l.style.viewTransitionName = ""), l = l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "none" && (l.style.viewTransitionName = "")), n & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== n && (t.refCount++, n != null && Ae(n)));
        break;
      case 12:
        if (n & 2048) {
          zt(
            l,
            t,
            u,
            a
          ), n = t.stateNode;
          try {
            var f = t.memoizedProps, c = f.id, i = f.onPostCommit;
            typeof i == "function" && i(
              c,
              t.alternate === null ? "mount" : "update",
              n.passiveEffectDuration,
              -0
            );
          } catch (d) {
            el(t, t.return, d);
          }
        } else
          zt(
            l,
            t,
            u,
            a
          );
        break;
      case 31:
        zt(
          l,
          t,
          u,
          a
        );
        break;
      case 13:
        zt(
          l,
          t,
          u,
          a
        );
        break;
      case 23:
        break;
      case 22:
        f = t.stateNode, c = t.alternate, t.memoizedState !== null ? (e && c !== null && c.memoizedState === null && of(c), f._visibility & 2 ? zt(
          l,
          t,
          u,
          a
        ) : Ve(
          l,
          t
        )) : (e && c !== null && c.memoizedState !== null && of(t), f._visibility & 2 ? zt(
          l,
          t,
          u,
          a
        ) : (f._visibility |= 2, Ka(
          l,
          t,
          u,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), n & 2048 && Mi(c, t);
        break;
      case 24:
        zt(
          l,
          t,
          u,
          a
        ), n & 2048 && Ui(t.alternate, t);
        break;
      case 30:
        e && (n = t.alternate, n !== null && (Kt(n.child, !0), Kt(t.child, !0))), zt(
          l,
          t,
          u,
          a
        );
        break;
      default:
        zt(
          l,
          t,
          u,
          a
        );
    }
  }
  function Ka(l, t, u, a, e) {
    for (e = e && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, f = t, c = u, i = a, d = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          Ka(
            n,
            f,
            c,
            i,
            e
          ), Qe(8, f);
          break;
        case 23:
          break;
        case 22:
          var g = f.stateNode;
          f.memoizedState !== null ? g._visibility & 2 ? Ka(
            n,
            f,
            c,
            i,
            e
          ) : Ve(
            n,
            f
          ) : (g._visibility |= 2, Ka(
            n,
            f,
            c,
            i,
            e
          )), e && d & 2048 && Mi(
            f.alternate,
            f
          );
          break;
        case 24:
          Ka(
            n,
            f,
            c,
            i,
            e
          ), e && d & 2048 && Ui(f.alternate, f);
          break;
        default:
          Ka(
            n,
            f,
            c,
            i,
            e
          );
      }
      t = t.sibling;
    }
  }
  function Ve(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var u = l, a = t, e = a.flags;
        switch (a.tag) {
          case 22:
            Ve(u, a), e & 2048 && Mi(
              a.alternate,
              a
            );
            break;
          case 24:
            Ve(u, a), e & 2048 && Ui(a.alternate, a);
            break;
          default:
            Ve(u, a);
        }
        t = t.sibling;
      }
  }
  var da = 8192;
  function sa(l, t, u) {
    if (l.subtreeFlags & da)
      for (l = l.child; l !== null; )
        Dm(
          l,
          t,
          u
        ), l = l.sibling;
  }
  function Dm(l, t, u) {
    switch (l.tag) {
      case 26:
        sa(
          l,
          t,
          u
        ), l.flags & da && (l.memoizedState !== null ? Ws(
          u,
          Ct,
          l.memoizedState,
          l.memoizedProps
        ) : (l = l.stateNode, (t & 335544128) === t && qy(u, l)));
        break;
      case 5:
        sa(
          l,
          t,
          u
        ), l.flags & da && (l = l.stateNode, (t & 335544128) === t && qy(u, l));
        break;
      case 3:
      case 4:
        var a = Ct;
        Ct = Fe(l.stateNode.containerInfo), sa(
          l,
          t,
          u
        ), Ct = a;
        break;
      case 22:
        l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = da, da = 16777216, sa(
          l,
          t,
          u
        ), da = a) : sa(
          l,
          t,
          u
        ));
        break;
      case 30:
        if ((l.flags & da) !== 0 && (a = l.memoizedProps.name, a != null && a !== "auto")) {
          var e = l.stateNode;
          e.paired = null, it === null && (it = /* @__PURE__ */ new Map()), it.set(a, e);
        }
        sa(
          l,
          t,
          u
        );
        break;
      default:
        sa(
          l,
          t,
          u
        );
    }
  }
  function Mm(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function xe(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          Cl = a, Cm(
            a,
            l
          );
        }
      Mm(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        Um(l), l = l.sibling;
  }
  function Um(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        xe(l), l.flags & 2048 && Hu(9, l, l.return);
        break;
      case 3:
        xe(l);
        break;
      case 12:
        xe(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, df(l)) : xe(l);
        break;
      default:
        xe(l);
    }
  }
  function df(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var u = 0; u < t.length; u++) {
          var a = t[u];
          Cl = a, Cm(
            a,
            l
          );
        }
      Mm(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          Hu(8, t, t.return), df(t);
          break;
        case 22:
          u = t.stateNode, u._visibility & 2 && (u._visibility &= -3, df(t));
          break;
        default:
          df(t);
      }
      l = l.sibling;
    }
  }
  function Cm(l, t) {
    for (; Cl !== null; ) {
      var u = Cl;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Hu(8, u, t);
          break;
        case 23:
        case 22:
          if (u.memoizedState !== null && u.memoizedState.cachePool !== null) {
            var a = u.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ae(u.memoizedState.cache);
      }
      if (a = u.child, a !== null) a.return = u, Cl = a;
      else
        l: for (u = l; Cl !== null; ) {
          a = Cl;
          var e = a.sibling, n = a.return;
          if (Tm(a), a === u) {
            Cl = null;
            break l;
          }
          if (e !== null) {
            e.return = n, Cl = e;
            break l;
          }
          Cl = n;
        }
    }
  }
  var x1 = {
    getCacheForType: function(l) {
      var t = ql(El), u = t.data.get(l);
      return u === void 0 && (u = l(), t.data.set(l, u)), u;
    },
    cacheSignal: function() {
      return ql(El).controller.signal;
    }
  }, L1 = typeof WeakMap == "function" ? WeakMap : Map, ll = 0, il = null, x = null, K = 0, al = 0, ot = null, qu = !1, Ja = !1, Ci = !1, yu = 0, gl = 0, Bu = 0, ha = 0, sf = 0, vt = 0, wa = 0, Le = null, Fl = null, Ri = !1, hf = 0, Rm = 0, gf = 1 / 0, rf = null, pu = null, sl = 0, Ht = null, ga = null, $t = 0, Hi = 0, Yi = null, Hm = null, Wa = null, $a = null, Fa = null, Ke = 0, Sf = null;
  function mt() {
    return (ll & 2) !== 0 && K !== 0 ? K & -K : D.T !== null ? xi() : q0();
  }
  function Ym() {
    if (vt === 0)
      if ((K & 536870912) === 0 || Z) {
        var l = mn;
        mn <<= 1, (mn & 3932160) === 0 && (mn = 262144), vt = l;
      } else vt = 536870912;
    return l = Bl.current, l !== null && (l.flags |= 32), vt;
  }
  function Ia(l, t) {
    if (t != null) {
      var u = l.stateNode, a = u.ref;
      a === null && (a = u.ref = dy(
        uu(l.memoizedProps, u)
      )), $a === null && ($a = []), $a.push(t.bind(null, a));
    }
  }
  function Il(l, t, u) {
    (l === il && (al === 2 || al === 9) || l.cancelPendingCommit !== null) && (ka(l, 0), Gu(
      l,
      K,
      vt,
      !1
    )), ye(l, u), ((ll & 2) === 0 || l !== il) && (l === il && ((ll & 2) === 0 && (ha |= u), gl === 4 && Gu(
      l,
      K,
      vt,
      !1
    )), Ft(l));
  }
  function qm(l, t, u) {
    if ((ll & 6) !== 0) throw Error(r(327));
    var a = !u && (t & 127) === 0 && (t & l.expiredLanes) === 0 || me(l, t), e = a ? w1(l, t) : Bi(l, t, !0), n = a;
    do {
      if (e === 0) {
        Ja && !a && Gu(l, t, 0, !1);
        break;
      } else {
        if (u = l.current.alternate, n && !K1(u)) {
          e = Bi(l, t, !1), n = !1;
          continue;
        }
        if (e === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var f = 0;
          else
            f = l.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            t = f;
            l: {
              var c = l;
              e = Le;
              var i = c.current.memoizedState.isDehydrated;
              if (i && (ka(c, f).flags |= 256), f = Bi(
                c,
                f,
                !1
              ), f !== 2 && f !== 6) {
                if (Ci && !i) {
                  c.errorRecoveryDisabledLanes |= n, ha |= n, e = 4;
                  break l;
                }
                n = Fl, Fl = e, n !== null && (Fl === null ? Fl = n : Fl.push.apply(
                  Fl,
                  n
                ));
              }
              e = f;
            }
            if (n = !1, e !== 2) continue;
          }
        }
        if (e === 1) {
          ka(l, 0), Gu(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, n = e, n) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              Gu(
                a,
                t,
                vt,
                !qu
              );
              break l;
            case 2:
              Fl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (e = hf + 300 - ut(), 10 < e)) {
            if (Gu(
              a,
              t,
              vt,
              !qu
            ), dn(a, 0, !0) !== 0) break l;
            $t = t, a.timeoutHandle = l0(
              Bm.bind(
                null,
                a,
                u,
                Fl,
                rf,
                Ri,
                t,
                vt,
                ha,
                wa,
                qu,
                n,
                "Throttled",
                -0,
                0
              ),
              e
            );
            break l;
          }
          Bm(
            a,
            u,
            Fl,
            rf,
            Ri,
            t,
            vt,
            ha,
            wa,
            qu,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ft(l);
  }
  function Bm(l, t, u, a, e, n, f, c, i, d, g, E, m, h) {
    l.timeoutHandle = -1;
    var _ = t.subtreeFlags, A = (n & 335544064) === n;
    if (E = null, (A || _ & 8192 || (_ & 16785408) === 16785408) && (E = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: jt
    }, it = null, Dm(
      t,
      n,
      E
    ), A && (_ = E, A = l.containerInfo, A = (A.nodeType === 9 ? A : A.ownerDocument).__reactViewTransition, A != null && (_.count++, _.waitingForViewTransition = !0, _ = Pe.bind(_), A.finished.then(_, _))), _ = (n & 62914560) === n ? hf - ut() : (n & 4194048) === n ? Rm - ut() : 0, _ = $s(
      E,
      _
    ), _ !== null)) {
      $t = n, l.cancelPendingCommit = _(
        xm.bind(
          null,
          l,
          t,
          n,
          u,
          a,
          e,
          f,
          c,
          i,
          d,
          g,
          E,
          null,
          m,
          h
        )
      ), Gu(l, n, f, !d);
      return;
    }
    xm(
      l,
      t,
      n,
      u,
      a,
      e,
      f,
      c,
      i,
      d,
      g,
      E
    );
  }
  function K1(l) {
    for (var t = l; ; ) {
      var u = t.tag;
      if ((u === 0 || u === 11 || u === 15) && t.flags & 16384 && (u = t.updateQueue, u !== null && (u = u.stores, u !== null)))
        for (var a = 0; a < u.length; a++) {
          var e = u[a], n = e.getSnapshot;
          e = e.value;
          try {
            if (!ft(n(), e)) return !1;
          } catch {
            return !1;
          }
        }
      if (u = t.child, t.subtreeFlags & 16384 && u !== null)
        u.return = t, t = u;
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Gu(l, t, u, a) {
    t = U0(l, t), t &= ~sf, t &= ~ha, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var e = t; 0 < e; ) {
      var n = 31 - et(e), f = 1 << n;
      a[n] = -1, e &= ~f;
    }
    u !== 0 && R0(l, u, t);
  }
  function Tf() {
    return (ll & 6) === 0 ? (Je(0), !1) : !0;
  }
  function qi() {
    if (x !== null) {
      if (al === 0)
        var l = x.return;
      else
        l = x, fu = aa = null, Vc(l), Xa = null, Ue = 0, l = x;
      for (; l !== null; )
        em(l.alternate, l), l = l.return;
      x = null;
    }
  }
  function ka(l, t) {
    var u = l.timeoutHandle;
    return u !== -1 && (l.timeoutHandle = -1, hs(u)), u = l.cancelPendingCommit, u !== null && (l.cancelPendingCommit = null, u()), $t = 0, qi(), il = l, x = u = eu(l.current, null), K = t, al = 0, ot = null, qu = !1, Ja = me(l, t), Ci = !1, wa = vt = sf = ha = Bu = gl = 0, Fl = Le = null, Ri = !1, yu = U0(l, t), An(), u;
  }
  function pm(l, t) {
    X = null, D.H = In, t === Ga || t === Gn ? (t = xo(), al = 3) : t === Uc ? (t = xo(), al = 4) : al = t === ai ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, ot = t, x === null && (gl = 1, kn(
      l,
      St(t, l.current)
    ));
  }
  function Gm() {
    var l = Bl.current;
    return l === null ? !0 : (K & 4194048) === K ? jl === null : (K & 62914560) === K || (K & 536870912) !== 0 ? l === jl : !1;
  }
  function Xm() {
    var l = D.H;
    return D.H = In, l === null ? In : l;
  }
  function Qm() {
    var l = D.A;
    return D.A = x1, l;
  }
  function Ef() {
    gl = 4, qu || (K & 4194048) !== K && Bl.current !== null || (Ja = !0), (Bu & 134217727) === 0 && (ha & 134217727) === 0 || il === null || Gu(
      il,
      K,
      vt,
      !1
    );
  }
  function Bi(l, t, u) {
    var a = ll;
    ll |= 2;
    var e = Xm(), n = Qm();
    (il !== l || K !== t) && (rf = null, ka(l, t)), t = !1;
    var f = gl;
    l: do
      try {
        if (al !== 0 && x !== null) {
          var c = x, i = ot;
          switch (al) {
            case 8:
              qi(), f = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              Bl.current === null && (t = !0);
              var d = al;
              if (al = 0, ot = null, Pa(l, c, i, d), u && Ja) {
                f = 0;
                break l;
              }
              break;
            default:
              d = al, al = 0, ot = null, Pa(l, c, i, d);
          }
        }
        J1(), f = gl;
        break;
      } catch (g) {
        pm(l, g);
      }
    while (!0);
    return t && l.shellSuspendCounter++, fu = aa = null, ll = a, D.H = e, D.A = n, x === null && (il = null, K = 0, An()), f;
  }
  function J1() {
    for (; x !== null; ) jm(x);
  }
  function w1(l, t) {
    var u = ll;
    ll |= 2;
    var a = Xm(), e = Qm();
    il !== l || K !== t ? (rf = null, gf = ut() + 500, ka(l, t)) : Ja = me(
      l,
      t
    );
    l: do
      try {
        if (al !== 0 && x !== null) {
          t = x;
          var n = ot;
          t: switch (al) {
            case 1:
              al = 0, ot = null, Pa(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Zo(n)) {
                al = 0, ot = null, Zm(t);
                break;
              }
              t = function() {
                al !== 2 && al !== 9 || il !== l || (al = 7), Ft(l);
              }, n.then(t, t);
              break l;
            case 3:
              al = 7;
              break l;
            case 4:
              al = 5;
              break l;
            case 7:
              Zo(n) ? (al = 0, ot = null, Zm(t)) : (al = 0, ot = null, Pa(l, t, n, 7));
              break;
            case 5:
              var f = null;
              switch (x.tag) {
                case 26:
                  f = x.memoizedState;
                case 5:
                case 27:
                  var c = x;
                  if (f ? Hy(f) : c.stateNode.complete) {
                    al = 0, ot = null;
                    var i = c.sibling;
                    if (i !== null) x = i;
                    else {
                      var d = c.return;
                      d !== null ? (x = d, bf(d)) : x = null;
                    }
                    break t;
                  }
              }
              al = 0, ot = null, Pa(l, t, n, 5);
              break;
            case 6:
              al = 0, ot = null, Pa(l, t, n, 6);
              break;
            case 8:
              qi(), gl = 6;
              break l;
            default:
              throw Error(r(462));
          }
        }
        W1();
        break;
      } catch (g) {
        pm(l, g);
      }
    while (!0);
    return fu = aa = null, D.H = a, D.A = e, ll = u, x !== null ? 0 : (il = null, K = 0, An(), gl);
  }
  function W1() {
    for (; x !== null && !md(); )
      jm(x);
  }
  function jm(l) {
    var t = um(l.alternate, l, yu);
    l.memoizedProps = l.pendingProps, t === null ? bf(l) : x = t;
  }
  function Zm(l) {
    var t = l, u = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = $v(
          u,
          t,
          t.pendingProps,
          t.type,
          void 0,
          K
        );
        break;
      case 11:
        t = $v(
          u,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          K
        );
        break;
      case 5:
        Vc(t);
        var a = t;
        a === Ml && (Z ? (Hn(a), a.tag === 5 && a.stateNode != null && (ml = a.stateNode)) : (Hn(a), Z = !0));
      default:
        em(u, t), t = x = Co(t, yu), t = um(u, t, yu);
    }
    l.memoizedProps = l.pendingProps, t === null ? bf(l) : x = t;
  }
  function Pa(l, t, u, a) {
    fu = aa = null, Vc(t), Xa = null, Ue = 0;
    var e = t.return;
    try {
      if (B1(
        l,
        e,
        t,
        u,
        K
      )) {
        gl = 1, kn(
          l,
          St(u, l.current)
        ), x = null;
        return;
      }
    } catch (n) {
      if (e !== null) throw x = e, n;
      gl = 1, kn(
        l,
        St(u, l.current)
      ), x = null;
      return;
    }
    t.flags & 32768 ? (Z || a === 1 ? l = !0 : Ja || (K & 536870912) !== 0 ? l = !1 : (qu = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Bl.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Vm(t, l)) : bf(t);
  }
  function bf(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        Vm(
          t,
          qu
        );
        return;
      }
      l = t.return;
      var u = Q1(
        t.alternate,
        t,
        yu
      );
      if (u !== null) {
        x = u;
        return;
      }
      if (t = t.sibling, t !== null) {
        x = t;
        return;
      }
      x = t = l;
    } while (t !== null);
    gl === 0 && (gl = 5);
  }
  function Vm(l, t) {
    do {
      var u = j1(l.alternate, l);
      if (u !== null) {
        u.flags &= 32767, x = u;
        return;
      }
      if (u = l.return, u !== null && (u.flags |= 32768, u.subtreeFlags = 0, u.deletions = null), !t && (l = l.sibling, l !== null)) {
        x = l;
        return;
      }
      x = l = u;
    } while (l !== null);
    gl = 6, x = null;
  }
  function xm(l, t, u, a, e, n, f, c, i, d, g, E) {
    l.cancelPendingCommit = null;
    do
      zf();
    while (sl !== 0);
    if ((ll & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === l.current) throw Error(r(177));
      l === il && (x = il = null, K = 0), ga = t, Ht = l, $t = u, Yi = e, Hm = a, $1(
        l,
        t,
        u,
        f,
        c,
        i,
        E
      );
    }
  }
  function $1(l, t, u, a, e, n, f) {
    var c = t.lanes | t.childLanes;
    if (Hi = c, c |= gc, bd(
      l,
      u,
      c,
      a,
      e,
      n
    ), $a = null, (u & 335544064) === u ? (Fa = _1(l), a = 10262) : (Fa = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, ts(on, function() {
      return Qi(), null;
    })) : (l.callbackNode = null, l.callbackPriority = 0), ff = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = D.T, D.T = null, e = p.p, p.p = 2, n = ll, ll |= 4;
      try {
        Z1(l, t, u);
      } finally {
        ll = n, p.p = e, D.T = a;
      }
    }
    sl = 1, ff ? Wa = bs(
      f,
      l.containerInfo,
      Fa,
      pi,
      Gi,
      I1,
      Xi,
      Qi,
      F1
    ) : (pi(), Gi(), Xi());
  }
  function F1(l) {
    if (sl !== 0) {
      var t = Ht.onRecoverableError;
      t(l, { componentStack: null });
    }
  }
  function I1() {
    sl === 3 && (sl = 0, Nm(ga, Ht), sl = 4);
  }
  function pi() {
    if (sl === 1) {
      sl = 0;
      var l = Ht, t = ga, u = $t, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = D.T, D.T = null;
        var e = p.p;
        p.p = 2;
        var n = ll;
        ll |= 4;
        try {
          Ze = vf = !1, _m(t, l, u), u = Ii;
          var f = Eo(l.containerInfo), c = u.focusedElem, i = u.selectionRange;
          if (f !== c && c && c.ownerDocument && To(
            c.ownerDocument.documentElement,
            c
          )) {
            if (i !== null && mc(c)) {
              var d = i.start, g = i.end;
              if (g === void 0 && (g = d), "selectionStart" in c)
                c.selectionStart = d, c.selectionEnd = Math.min(
                  g,
                  c.value.length
                );
              else {
                var E = c.ownerDocument || document, m = E && E.defaultView || window;
                if (m.getSelection) {
                  var h = m.getSelection(), _ = c.textContent.length, A = Math.min(i.start, _), Q = i.end === void 0 ? A : Math.min(i.end, _);
                  !h.extend && A > Q && (f = Q, Q = A, A = f);
                  var y = So(
                    c,
                    A
                  ), o = So(
                    c,
                    Q
                  );
                  if (y && o && (h.rangeCount !== 1 || h.anchorNode !== y.node || h.anchorOffset !== y.offset || h.focusNode !== o.node || h.focusOffset !== o.offset)) {
                    var s = E.createRange();
                    s.setStart(y.node, y.offset), h.removeAllRanges(), A > Q ? (h.addRange(s), h.extend(o.node, o.offset)) : (s.setEnd(o.node, o.offset), h.addRange(s));
                  }
                }
              }
            }
            for (E = [], h = c; h = h.parentNode; )
              h.nodeType === 1 && E.push({
                element: h,
                left: h.scrollLeft,
                top: h.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < E.length; c++) {
              var S = E[c];
              S.element.scrollLeft = S.left, S.element.scrollTop = S.top;
            }
          }
          ce = !!Fi, Ii = Fi = null;
        } finally {
          ll = n, p.p = e, D.T = a;
        }
      }
      l.current = t, sl = 2;
    }
  }
  function Gi() {
    if (sl === 2) {
      sl = 0;
      var l = Ht, t = ga, u = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || u) {
        u = D.T, D.T = null;
        var a = p.p;
        p.p = 2;
        var e = ll;
        ll |= 4;
        try {
          rm(l, t.alternate, t);
        } finally {
          ll = e, p.p = a, D.T = u;
        }
      }
      sl = 3;
    }
  }
  function Xi() {
    if (sl === 4 || sl === 3) {
      sl = 0;
      var l = Wa;
      Wa = null, yd();
      var t = Ht, u = ga, a = $t, e = Hm, n = (a & 335544064) === a ? 10262 : 10256;
      if ((u.subtreeFlags & n) !== 0 || (u.flags & n) !== 0 ? sl = 5 : (sl = 0, ga = Ht = null, Lm(t, t.pendingLanes)), n = t.pendingLanes, n === 0 && (pu = null), wf(a), u = u.stateNode, at && typeof at.onCommitFiberRoot == "function")
        try {
          at.onCommitFiberRoot(
            ve,
            u,
            void 0,
            (u.current.flags & 128) === 128
          );
        } catch {
        }
      if (e !== null) {
        u = D.T, n = p.p, p.p = 2, D.T = null;
        try {
          for (var f = t.onRecoverableError, c = 0; c < e.length; c++) {
            var i = e[c];
            f(i.value, {
              componentStack: i.stack
            });
          }
        } finally {
          D.T = u, p.p = n;
        }
      }
      if (e = $a, f = Fa, Fa = null, e !== null && ($a = null, f === null && (f = []), l !== null))
        for (i = 0; i < e.length; i++)
          u = (0, e[i])(
            f
          ), u !== void 0 && l.finished.finally(u);
      ($t & 3) !== 0 && zf(), Ft(t), n = t.pendingLanes, (a & 261930) !== 0 && (n & 42) !== 0 ? t === Sf ? Ke++ : (Ke = 0, Sf = t) : (Ke = 0, Sf = null), Je(0);
    }
  }
  function Lm(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Ae(t)));
  }
  function zf() {
    return Wa !== null && (Wa.skipTransition(), Wa = null), pi(), Gi(), Xi(), Qi();
  }
  function Qi() {
    if (sl !== 5) return !1;
    var l = Ht, t = Hi;
    Hi = 0;
    var u = wf($t), a = D.T, e = p.p;
    try {
      p.p = 32 > u ? 32 : u, D.T = null, u = Yi, Yi = null;
      var n = Ht, f = $t;
      if (sl = 0, ga = Ht = null, $t = 0, (ll & 6) !== 0) throw Error(r(331));
      var c = ll;
      if (ll |= 4, Um(n.current), Am(
        n,
        n.current,
        f,
        u
      ), ll = c, Je(0, !1), at && typeof at.onPostCommitFiberRoot == "function")
        try {
          at.onPostCommitFiberRoot(ve, n);
        } catch {
        }
      return !0;
    } finally {
      p.p = e, D.T = a, Lm(l, t);
    }
  }
  function Km(l, t, u) {
    t = St(u, t), t = ui(l.stateNode, t, 2), l = Mu(l, t, 2), l !== null && (ye(l, 2), Ft(l));
  }
  function el(l, t, u) {
    if (l.tag === 3)
      Km(l, l, u);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Km(
            t,
            l,
            u
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (pu === null || !pu.has(a))) {
            l = St(u, l), u = Zv(2), a = Mu(t, u, 2), a !== null && (Vv(
              u,
              a,
              t,
              l
            ), ye(a, 2), Ft(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function ji(l, t, u) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new L1();
      var e = /* @__PURE__ */ new Set();
      a.set(t, e);
    } else
      e = a.get(t), e === void 0 && (e = /* @__PURE__ */ new Set(), a.set(t, e));
    e.has(u) || (Ci = !0, e.add(u), l = k1.bind(null, l, t, u), t.then(l, l));
  }
  function k1(l, t, u) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & u, l.warmLanes &= ~u, il === l && (K & u) === u && ((gl === 4 || gl === 3 && (K & 62914560) === K && 300 > ut() - hf) && (ll & 2) === 0 ? ka(l, 0) : sf |= u, wa === K && (wa = 0)), Ft(l);
  }
  function Jm(l, t) {
    t === 0 && (t = C0()), l = la(l, t), l !== null && (ye(l, t), Ft(l));
  }
  function P1(l) {
    var t = l.memoizedState, u = 0;
    t !== null && (u = t.retryLane), Jm(l, u);
  }
  function ls(l, t) {
    var u = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var a = l.stateNode, e = l.memoizedState;
        e !== null && (u = e.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(t), Jm(l, u);
  }
  function ts(l, t) {
    return xf(l, t);
  }
  var le = null, te = null, Zi = !1, _f = !1, Vi = !1, Xu = 0;
  function Ft(l) {
    l !== te && l.next === null && (te === null ? le = te = l : te = te.next = l), _f = !0, Zi || (Zi = !0, as());
  }
  function Je(l, t) {
    if (!Vi && _f) {
      Vi = !0;
      do
        for (var u = !1, a = le; a !== null; ) {
          if (l !== 0) {
            var e = a.pendingLanes;
            if (e === 0) var n = 0;
            else {
              var f = a.suspendedLanes, c = a.pingedLanes;
              n = (1 << 31 - et(42 | l) + 1) - 1, n &= e & ~(f & ~c), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (u = !0, Fm(a, n));
          } else
            n = K, n = dn(
              a,
              a === il ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || me(a, n) || (u = !0, Fm(a, n));
          a = a.next;
        }
      while (u);
      Vi = !1;
    }
  }
  function us() {
    wm();
  }
  function wm() {
    _f = Zi = !1;
    var l = 0;
    Xu !== 0 && ss() && (l = Xu);
    for (var t = ut(), u = null, a = le; a !== null; ) {
      var e = a.next, n = Wm(a, t);
      n === 0 ? (a.next = null, u === null ? le = e : u.next = e, e === null && (te = u)) : (u = a, (l !== 0 || (n & 3) !== 0) && (_f = !0)), a = e;
    }
    sl !== 0 && sl !== 5 || Je(l), Xu !== 0 && (Xu = 0);
  }
  function Wm(l, t) {
    for (var u = l.suspendedLanes, a = l.pingedLanes, e = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var f = 31 - et(n), c = 1 << f, i = e[f];
      i === -1 ? ((c & u) === 0 || (c & a) !== 0) && (e[f] = Ed(c, t)) : i <= t && (l.expiredLanes |= c), n &= ~c;
    }
    if (t = il, u = K, u = dn(
      l,
      l === t ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, u === 0 || l === t && (al === 2 || al === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Lf(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((u & 3) === 0 || me(l, u)) {
      if (t = u & -u, t === l.callbackPriority) return t;
      switch (a !== null && Lf(a), wf(u)) {
        case 2:
        case 8:
          u = D0;
          break;
        case 32:
          u = on;
          break;
        case 268435456:
          u = M0;
          break;
        default:
          u = on;
      }
      return a = $m.bind(null, l), u = xf(u, a), l.callbackPriority = t, l.callbackNode = u, t;
    }
    return a !== null && a !== null && Lf(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function $m(l, t) {
    if (sl !== 0 && sl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var u = l.callbackNode;
    if (zf() && l.callbackNode !== u)
      return null;
    var a = K;
    return a = dn(
      l,
      l === il ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (qm(l, a, t), Wm(l, ut()), l.callbackNode != null && l.callbackNode === u ? $m.bind(null, l) : null);
  }
  function Fm(l, t) {
    if (zf()) return null;
    qm(l, t, !0);
  }
  function as() {
    gs(function() {
      (ll & 6) !== 0 ? xf(
        A0,
        us
      ) : wm();
    });
  }
  function xi() {
    if (Xu === 0) {
      var l = fa;
      l === 0 && (l = vn, vn <<= 1, (vn & 261888) === 0 && (vn = 256)), Xu = l;
    }
    return Xu;
  }
  function Im(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Sn(l);
  }
  function es(l, t, u, a, e) {
    if (t === "submit" && u && u.stateNode === e) {
      var n = Im(
        (e[Jl] || null).action
      ), f = a.submitter;
      f && (t = (t = f[Jl] || null) ? Im(t.formAction) : f.getAttribute("formAction"), t !== null && (n = t, f = null));
      var c = new zn(
        "action",
        "action",
        null,
        a,
        e
      );
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Xu !== 0) {
                  var i = new FormData(e, f);
                  Ic(
                    u,
                    {
                      pending: !0,
                      data: i,
                      method: e.method,
                      action: n
                    },
                    null,
                    i
                  );
                }
              } else
                typeof n == "function" && (c.preventDefault(), i = new FormData(e, f), Ic(
                  u,
                  {
                    pending: !0,
                    data: i,
                    method: e.method,
                    action: n
                  },
                  n,
                  i
                ));
            },
            currentTarget: e
          }
        ]
      });
    }
  }
  for (var Li = 0; Li < hc.length; Li++) {
    var Ki = hc[Li], ns = Ki.toLowerCase(), fs = Ki[0].toUpperCase() + Ki.slice(1);
    Mt(
      ns,
      "on" + fs
    );
  }
  Mt(_o, "onAnimationEnd"), Mt(Oo, "onAnimationIteration"), Mt(No, "onAnimationStart"), Mt("dblclick", "onDoubleClick"), Mt("focusin", "onFocus"), Mt("focusout", "onBlur"), Mt(h1, "onTransitionRun"), Mt(g1, "onTransitionStart"), Mt(r1, "onTransitionCancel"), Mt(Ao, "onTransitionEnd"), _a("onMouseEnter", ["mouseout", "mouseover"]), _a("onMouseLeave", ["mouseout", "mouseover"]), _a("onPointerEnter", ["pointerout", "pointerover"]), _a("onPointerLeave", ["pointerout", "pointerover"]), Iu(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Iu(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Iu("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Iu(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Iu(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Iu(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var we = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), cs = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(we)
  );
  function km(l, t) {
    t = (t & 4) !== 0;
    for (var u = 0; u < l.length; u++) {
      var a = l[u], e = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var f = a.length - 1; 0 <= f; f--) {
            var c = a[f], i = c.instance, d = c.currentTarget;
            if (c = c.listener, i !== n && e.isPropagationStopped())
              break l;
            n = c, e.currentTarget = d;
            try {
              n(e);
            } catch (g) {
              Nn(g);
            }
            e.currentTarget = null, n = i;
          }
        else
          for (f = 0; f < a.length; f++) {
            if (c = a[f], i = c.instance, d = c.currentTarget, c = c.listener, i !== n && e.isPropagationStopped())
              break l;
            n = c, e.currentTarget = d;
            try {
              n(e);
            } catch (g) {
              Nn(g);
            }
            e.currentTarget = null, n = i;
          }
      }
    }
  }
  function L(l, t) {
    var u = t[p0];
    u === void 0 && (u = t[p0] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    u.has(a) || (Pm(t, l, 2, !1), u.add(a));
  }
  function Ji(l, t, u) {
    var a = 0;
    t && (a |= 4), Pm(
      u,
      l,
      a,
      t
    );
  }
  var Of = "_reactListening" + Math.random().toString(36).slice(2);
  function wi(l) {
    if (!l[Of]) {
      l[Of] = !0, Q0.forEach(function(u) {
        u !== "selectionchange" && (cs.has(u) || Ji(u, !1, l), Ji(u, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[Of] || (t[Of] = !0, Ji("selectionchange", !1, t));
    }
  }
  function Pm(l, t, u, a) {
    switch (Vy(t)) {
      case 2:
        var e = Ps;
        break;
      case 8:
        e = lh;
        break;
      default:
        e = d0;
    }
    u = e.bind(
      null,
      t,
      u,
      l
    ), e = void 0, !tc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (e = !0), a ? e !== void 0 ? l.addEventListener(t, u, {
      capture: !0,
      passive: e
    }) : l.addEventListener(t, u, !0) : e !== void 0 ? l.addEventListener(t, u, {
      passive: e
    }) : l.addEventListener(t, u, !1);
  }
  function Wi(l, t, u, a, e) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var f = a.tag;
        if (f === 3 || f === 4) {
          var c = a.stateNode.containerInfo;
          if (c === e) break;
          if (f === 4)
            for (f = a.return; f !== null; ) {
              var i = f.tag;
              if ((i === 3 || i === 4) && f.stateNode.containerInfo === e)
                return;
              f = f.return;
            }
          for (; c !== null; ) {
            if (f = Fu(c), f === null) return;
            if (i = f.tag, i === 5 || i === 6 || i === 26 || i === 27) {
              a = n = f;
              continue l;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    k0(function() {
      var d = n, g = Pf(u), E = [];
      l: {
        var m = Do.get(l);
        if (m !== void 0) {
          var h = zn, _ = l;
          switch (l) {
            case "keypress":
              if (En(u) === 0) break l;
            case "keydown":
            case "keyup":
              h = Kd;
              break;
            case "focusin":
              _ = "focus", h = nc;
              break;
            case "focusout":
              _ = "blur", h = nc;
              break;
            case "beforeblur":
            case "afterblur":
              h = nc;
              break;
            case "click":
              if (u.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              h = to;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              h = Yd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              h = Fd;
              break;
            case _o:
            case Oo:
            case No:
              h = pd;
              break;
            case Ao:
              h = kd;
              break;
            case "scroll":
            case "scrollend":
              h = Rd;
              break;
            case "wheel":
              h = l1;
              break;
            case "copy":
            case "cut":
            case "paste":
              h = Xd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              h = ao;
              break;
            case "submit":
              h = Wd;
              break;
            case "toggle":
            case "beforetoggle":
              h = u1;
          }
          var A = (t & 4) !== 0, Q = !A && (l === "scroll" || l === "scrollend"), y = A ? m !== null ? m + "Capture" : null : m;
          A = [];
          for (var o = d, s; o !== null; ) {
            var S = o;
            if (s = S.stateNode, S = S.tag, S !== 5 && S !== 26 && S !== 27 || s === null || y === null || (S = he(o, y), S != null && A.push(
              We(o, S, s)
            )), Q) break;
            o = o.return;
          }
          0 < A.length && (m = new h(
            m,
            _,
            null,
            u,
            g
          ), E.push({ event: m, listeners: A }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (h = l === "mouseover" || l === "pointerover", m = l === "mouseout" || l === "pointerout", h && u !== kf && (_ = u.relatedTarget || u.fromElement) && (Fu(_) || _[Ea]))
            break l;
          (m || h) && (_ = g.window === g ? g : (h = g.ownerDocument) ? h.defaultView || h.parentWindow : window, m ? (h = u.relatedTarget || u.toElement, m = d, h = h ? Fu(h) : null, h !== null && (Q = At(h), A = h.tag, h !== Q || A !== 5 && A !== 27 && A !== 6) && (h = null)) : (m = null, h = d), m !== h && (A = to, S = "onMouseLeave", y = "onMouseEnter", o = "mouse", (l === "pointerout" || l === "pointerover") && (A = ao, S = "onPointerLeave", y = "onPointerEnter", o = "pointer"), Q = m == null ? _ : se(m), s = h == null ? _ : se(h), _ = new A(
            S,
            o + "leave",
            m,
            u,
            g
          ), _.target = Q, _.relatedTarget = s, S = null, Fu(g) === d && (A = new A(
            y,
            o + "enter",
            h,
            u,
            g
          ), A.target = s, A.relatedTarget = Q, S = A), Q = S, A = m && h ? lt(
            m,
            h,
            is
          ) : null, m !== null && ly(
            E,
            _,
            m,
            A,
            !1
          ), h !== null && Q !== null && ly(
            E,
            Q,
            h,
            A,
            !0
          )));
        }
        l: {
          if (m = d ? se(d) : window, h = m.nodeName && m.nodeName.toLowerCase(), h === "select" || h === "input" && m.type === "file")
            var N = mo;
          else if (oo(m))
            if (yo)
              N = y1;
            else {
              N = v1;
              var J = o1;
            }
          else
            h = m.nodeName, !h || h.toLowerCase() !== "input" || m.type !== "checkbox" && m.type !== "radio" ? d && If(d.elementType) && (N = mo) : N = m1;
          if (N && (N = N(l, d))) {
            vo(
              E,
              N,
              u,
              g
            );
            break l;
          }
          J && J(l, m, d);
        }
        switch (J = d ? se(d) : window, l) {
          case "focusin":
            (oo(J) || J.contentEditable === "true") && (Ua = J, yc = d, _e = null);
            break;
          case "focusout":
            _e = yc = Ua = null;
            break;
          case "mousedown":
            dc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            dc = !1, bo(E, u, g);
            break;
          case "selectionchange":
            if (s1) break;
          case "keydown":
          case "keyup":
            bo(E, u, g);
        }
        var M;
        if (cc)
          l: {
            switch (l) {
              case "compositionstart":
                var R = "onCompositionStart";
                break l;
              case "compositionend":
                R = "onCompositionEnd";
                break l;
              case "compositionupdate":
                R = "onCompositionUpdate";
                break l;
            }
            R = void 0;
          }
        else
          Ma ? co(l, u) && (R = "onCompositionEnd") : l === "keydown" && u.keyCode === 229 && (R = "onCompositionStart");
        R && (eo && u.locale !== "ko" && (Ma || R !== "onCompositionStart" ? R === "onCompositionEnd" && Ma && (M = P0()) : (Tu = g, uc = "value" in Tu ? Tu.value : Tu.textContent, Ma = !0)), J = Nf(d, R), 0 < J.length && (R = new uo(
          R,
          l,
          null,
          u,
          g
        ), E.push({ event: R, listeners: J }), M ? R.data = M : (M = io(u), M !== null && (R.data = M)))), (M = e1 ? n1(l, u) : f1(l, u)) && (R = Nf(d, "onBeforeInput"), 0 < R.length && (J = new uo(
          "onBeforeInput",
          "beforeinput",
          null,
          u,
          g
        ), E.push({
          event: J,
          listeners: R
        }), J.data = M)), es(
          E,
          l,
          d,
          u,
          g
        );
      }
      km(E, t);
    });
  }
  function We(l, t, u) {
    return {
      instance: l,
      listener: t,
      currentTarget: u
    };
  }
  function Nf(l, t) {
    for (var u = t + "Capture", a = []; l !== null; ) {
      var e = l, n = e.stateNode;
      if (e = e.tag, e !== 5 && e !== 26 && e !== 27 || n === null || (e = he(l, u), e != null && a.unshift(
        We(l, e, n)
      ), e = he(l, t), e != null && a.push(
        We(l, e, n)
      )), l.tag === 3) return a;
      l = l.return;
    }
    return [];
  }
  function is(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function ly(l, t, u, a, e) {
    for (var n = t._reactName, f = []; u !== null && u !== a; ) {
      var c = u, i = c.alternate, d = c.stateNode;
      if (c = c.tag, i !== null && i === a) break;
      c !== 5 && c !== 26 && c !== 27 || d === null || (i = d, e ? (d = he(u, n), d != null && f.unshift(
        We(u, d, i)
      )) : e || (d = he(u, n), d != null && f.push(
        We(u, d, i)
      ))), u = u.return;
    }
    f.length !== 0 && l.push({ event: t, listeners: f });
  }
  var os = /\r\n?/g, vs = /\u0000|\uFFFD/g;
  function ty(l) {
    return (typeof l == "string" ? l : "" + l).replace(os, `
`).replace(vs, "");
  }
  function uy(l, t) {
    return t = ty(t), ty(l) === t;
  }
  function nl(l, t, u, a, e, n) {
    switch (u) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || Na(l, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && Na(l, "" + a);
        else return;
        break;
      case "className":
        rn(l, "class", a);
        break;
      case "tabIndex":
        rn(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        rn(l, u, a);
        break;
      case "style":
        F0(l, a, n);
        return;
      case "data":
        if (t !== "object") {
          rn(l, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || u !== "href")) {
          l.removeAttribute(u);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(u);
          break;
        }
        a = Sn(a), l.setAttribute(u, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          l.setAttribute(
            u,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (u === "formAction" ? (t !== "input" && nl(l, t, "name", e.name, e, null), nl(
            l,
            t,
            "formEncType",
            e.formEncType,
            e,
            null
          ), nl(
            l,
            t,
            "formMethod",
            e.formMethod,
            e,
            null
          ), nl(
            l,
            t,
            "formTarget",
            e.formTarget,
            e,
            null
          )) : (nl(l, t, "encType", e.encType, e, null), nl(l, t, "method", e.method, e, null), nl(l, t, "target", e.target, e, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(u);
          break;
        }
        a = Sn(a), l.setAttribute(u, a);
        break;
      case "onClick":
        a != null && (l.onclick = jt);
        return;
      case "onScroll":
        a != null && L("scroll", l);
        return;
      case "onScrollEnd":
        a != null && L("scrollend", l);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (u = a.__html, u != null) {
            if (e.children != null) throw Error(r(60));
            (n != null ? n.__html : void 0) !== u && (l.innerHTML = u);
          }
        }
        break;
      case "multiple":
        l.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        l.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        u = Sn(a), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          u
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(u, a) : l.removeAttribute(u);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(u, "") : l.removeAttribute(u);
        break;
      case "capture":
      case "download":
        a === !0 ? l.setAttribute(u, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(u, a) : l.removeAttribute(u);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? l.setAttribute(u, a) : l.removeAttribute(u);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? l.removeAttribute(u) : l.setAttribute(u, a);
        break;
      case "popover":
        L("beforetoggle", l), L("toggle", l), gn(l, "popover", a);
        break;
      case "xlinkActuate":
        lu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        lu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        lu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        lu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        lu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        lu(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        lu(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        lu(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        lu(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        gn(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < u.length) || u[0] !== "o" && u[0] !== "O" || u[1] !== "n" && u[1] !== "N")
          u = Ud.get(u) || u, gn(l, u, a);
        else return;
    }
    I = !0;
  }
  function $i(l, t, u, a, e, n) {
    switch (u) {
      case "style":
        F0(l, a, n);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (u = a.__html, u != null) {
            if (e.children != null) throw Error(r(60));
            (n != null ? n.__html : void 0) !== u && (l.innerHTML = u);
          }
        }
        break;
      case "children":
        if (typeof a == "string") Na(l, a);
        else if (typeof a == "number" || typeof a == "bigint")
          Na(l, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && L("scroll", l);
        return;
      case "onScrollEnd":
        a != null && L("scrollend", l);
        return;
      case "onClick":
        a != null && (l.onclick = jt);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!j0.hasOwnProperty(u))
          l: {
            if (u[0] === "o" && u[1] === "n" && (e = u.endsWith("Capture"), n = u.slice(2, e ? u.length - 7 : void 0), t = l[Jl] || null, t = t != null ? t[u] : null, typeof t == "function" && l.removeEventListener(n, t, e), typeof a == "function")) {
              typeof t != "function" && t !== null && (u in l ? l[u] = null : l.hasAttribute(u) && l.removeAttribute(u)), l.addEventListener(n, a, e);
              break l;
            }
            I = !0, u in l ? l[u] = a : a === !0 ? l.setAttribute(u, "") : gn(l, u, a);
          }
        return;
    }
    I = !0;
  }
  function Xl(l, t, u) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        L("error", l), L("load", l);
        var a = !1, e = !1, n;
        for (n in u)
          if (u.hasOwnProperty(n)) {
            var f = u[n];
            if (f != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  e = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  nl(l, t, n, f, u, null);
              }
          }
        e && nl(l, t, "srcSet", u.srcSet, u, null), a && nl(l, t, "src", u.src, u, null);
        return;
      case "input":
        L("invalid", l);
        var c = n = f = e = null, i = null, d = null;
        for (a in u)
          if (u.hasOwnProperty(a)) {
            var g = u[a];
            if (g != null)
              switch (a) {
                case "name":
                  e = g;
                  break;
                case "type":
                  f = g;
                  break;
                case "checked":
                  i = g;
                  break;
                case "defaultChecked":
                  d = g;
                  break;
                case "value":
                  n = g;
                  break;
                case "defaultValue":
                  c = g;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (g != null)
                    throw Error(r(137, t));
                  break;
                default:
                  nl(l, t, a, g, u, null);
              }
          }
        J0(
          l,
          n,
          c,
          i,
          d,
          f,
          e,
          !1
        );
        return;
      case "select":
        L("invalid", l), a = f = n = null;
        for (e in u)
          if (u.hasOwnProperty(e) && (c = u[e], c != null))
            switch (e) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                f = c;
                break;
              case "multiple":
                a = c;
              default:
                nl(l, t, e, c, u, null);
            }
        t = n, u = f, l.multiple = !!a, t != null ? Oa(l, !!a, t, !1) : u != null && Oa(l, !!a, u, !0);
        return;
      case "textarea":
        L("invalid", l), n = e = a = null;
        for (f in u)
          if (u.hasOwnProperty(f) && (c = u[f], c != null))
            switch (f) {
              case "value":
                a = c;
                break;
              case "defaultValue":
                e = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(r(91));
                break;
              default:
                nl(l, t, f, c, u, null);
            }
        W0(l, a, e, n);
        return;
      case "option":
        for (i in u)
          if (u.hasOwnProperty(i) && (a = u[i], a != null))
            switch (i) {
              case "selected":
                l.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                nl(l, t, i, a, u, null);
            }
        return;
      case "dialog":
        L("beforetoggle", l), L("toggle", l), L("cancel", l), L("close", l);
        break;
      case "iframe":
      case "object":
        L("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < we.length; a++)
          L(we[a], l);
        break;
      case "image":
        L("error", l), L("load", l);
        break;
      case "details":
        L("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        L("error", l), L("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (d in u)
          if (u.hasOwnProperty(d) && (a = u[d], a != null))
            switch (d) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                nl(l, t, d, a, u, null);
            }
        return;
      default:
        if (If(t)) {
          for (g in u)
            u.hasOwnProperty(g) && (a = u[g], a !== void 0 && $i(
              l,
              t,
              g,
              a,
              u,
              void 0
            ));
          return;
        }
    }
    for (c in u)
      u.hasOwnProperty(c) && (a = u[c], a != null && nl(l, t, c, a, u, null));
  }
  var ms = {};
  function ys(l, t, u, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var e = null, n = null, f = null, c = null, i = null, d = null, g = null;
        for (h in u) {
          var E = u[h];
          if (u.hasOwnProperty(h) && E != null)
            switch (h) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                i = E;
              default:
                a.hasOwnProperty(h) || nl(l, t, h, null, a, E);
            }
        }
        for (var m in a) {
          var h = a[m];
          if (E = u[m], a.hasOwnProperty(m) && (h != null || E != null))
            switch (m) {
              case "type":
                h !== E && (I = !0), n = h;
                break;
              case "name":
                h !== E && (I = !0), e = h;
                break;
              case "checked":
                h !== E && (I = !0), d = h;
                break;
              case "defaultChecked":
                h !== E && (I = !0), g = h;
                break;
              case "value":
                h !== E && (I = !0), f = h;
                break;
              case "defaultValue":
                h !== E && (I = !0), c = h;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (h != null)
                  throw Error(r(137, t));
                break;
              default:
                h !== E && nl(
                  l,
                  t,
                  m,
                  h,
                  a,
                  E
                );
            }
        }
        $f(
          l,
          f,
          c,
          i,
          d,
          g,
          n,
          e
        );
        return;
      case "select":
        h = f = c = m = null;
        for (n in u)
          if (i = u[n], u.hasOwnProperty(n) && i != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                h = i;
              default:
                a.hasOwnProperty(n) || nl(
                  l,
                  t,
                  n,
                  null,
                  a,
                  i
                );
            }
        for (e in a)
          if (n = a[e], i = u[e], a.hasOwnProperty(e) && (n != null || i != null))
            switch (e) {
              case "value":
                n !== i && (I = !0), m = n;
                break;
              case "defaultValue":
                n !== i && (I = !0), c = n;
                break;
              case "multiple":
                n !== i && (I = !0), f = n;
              default:
                n !== i && nl(
                  l,
                  t,
                  e,
                  n,
                  a,
                  i
                );
            }
        t = c, u = f, a = h, m != null ? Oa(l, !!u, m, !1) : !!a != !!u && (t != null ? Oa(l, !!u, t, !0) : Oa(l, !!u, u ? [] : "", !1));
        return;
      case "textarea":
        h = m = null;
        for (c in u)
          if (e = u[c], u.hasOwnProperty(c) && e != null && !a.hasOwnProperty(c))
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                nl(l, t, c, null, a, e);
            }
        for (f in a)
          if (e = a[f], n = u[f], a.hasOwnProperty(f) && (e != null || n != null))
            switch (f) {
              case "value":
                e !== n && (I = !0), m = e;
                break;
              case "defaultValue":
                e !== n && (I = !0), h = e;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (e != null) throw Error(r(91));
                break;
              default:
                e !== n && nl(l, t, f, e, a, n);
            }
        w0(l, m, h);
        return;
      case "option":
        for (var _ in u)
          if (m = u[_], u.hasOwnProperty(_) && m != null && !a.hasOwnProperty(_))
            switch (_) {
              case "selected":
                l.selected = !1;
                break;
              default:
                nl(
                  l,
                  t,
                  _,
                  null,
                  a,
                  m
                );
            }
        for (i in a)
          if (m = a[i], h = u[i], a.hasOwnProperty(i) && m !== h && (m != null || h != null))
            switch (i) {
              case "selected":
                m !== h && (I = !0), l.selected = m && typeof m != "function" && typeof m != "symbol";
                break;
              default:
                nl(
                  l,
                  t,
                  i,
                  m,
                  a,
                  h
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var A in u)
          m = u[A], u.hasOwnProperty(A) && m != null && !a.hasOwnProperty(A) && nl(l, t, A, null, a, m);
        for (d in a)
          if (m = a[d], h = u[d], a.hasOwnProperty(d) && m !== h && (m != null || h != null))
            switch (d) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (m != null)
                  throw Error(r(137, t));
                break;
              default:
                nl(
                  l,
                  t,
                  d,
                  m,
                  a,
                  h
                );
            }
        return;
      default:
        if (If(t)) {
          for (var Q in u)
            m = u[Q], u.hasOwnProperty(Q) && m !== void 0 && !a.hasOwnProperty(Q) && $i(
              l,
              t,
              Q,
              void 0,
              a,
              m
            );
          for (g in a)
            m = a[g], h = u[g], !a.hasOwnProperty(g) || m === h || m === void 0 && h === void 0 || $i(
              l,
              t,
              g,
              m,
              a,
              h
            );
          return;
        }
    }
    for (var y in u)
      m = u[y], u.hasOwnProperty(y) && m != null && !a.hasOwnProperty(y) && nl(l, t, y, null, a, m);
    for (E in a)
      m = a[E], h = u[E], !a.hasOwnProperty(E) || m === h || m == null && h == null || nl(l, t, E, m, a, h);
  }
  function ay(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function ds() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, u = performance.getEntriesByType("resource"), a = 0; a < u.length; a++) {
        var e = u[a], n = e.transferSize, f = e.initiatorType, c = e.duration;
        if (n && c && ay(f)) {
          for (f = 0, c = e.responseEnd, a += 1; a < u.length; a++) {
            var i = u[a], d = i.startTime;
            if (d > c) break;
            var g = i.transferSize, E = i.initiatorType;
            g && ay(E) && (i = i.responseEnd, f += g * (i < c ? 1 : (c - d) / (i - d)));
          }
          if (--a, t += 8 * (n + f) / (e.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var Fi = null, Ii = null;
  function $e(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function ey(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ny(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function fy(l, t, u, a) {
    return u = $e(
      u
    ).createElement(l), u[Yl] = a, u[Jl] = t, Xl(u, l, t), Dl(u), u;
  }
  function ki(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Pi = null;
  function ss() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Pi ? !1 : (Pi = l, !0) : (Pi = null, !1);
  }
  var l0 = typeof setTimeout == "function" ? setTimeout : void 0, hs = typeof clearTimeout == "function" ? clearTimeout : void 0, cy = typeof Promise == "function" ? Promise : void 0, iy = typeof requestAnimationFrame == "function" ? requestAnimationFrame : l0, gs = typeof queueMicrotask == "function" ? queueMicrotask : typeof cy < "u" ? function(l) {
    return cy.resolve(null).then(l).catch(rs);
  } : l0;
  function rs(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Qu(l) {
    return l === "head";
  }
  function oy(l, t) {
    var u = t, a = 0;
    do {
      var e = u.nextSibling;
      if (l.removeChild(u), e && e.nodeType === 8)
        if (u = e.data, u === "/$" || u === "/&") {
          if (a === 0) {
            l.removeChild(e), ie(t);
            return;
          }
          a--;
        } else if (u === "$" || u === "$?" || u === "$~" || u === "$!" || u === "&")
          a++;
        else if (u === "html")
          i0(
            l.ownerDocument.documentElement
          );
        else if (u === "head") {
          u = l.ownerDocument.head, i0(u);
          for (var n = u.firstChild; n; ) {
            var f = n.nextSibling, c = n.nodeName;
            n[de] || c === "SCRIPT" || c === "STYLE" || c === "LINK" && n.rel.toLowerCase() === "stylesheet" || u.removeChild(n), n = f;
          }
        } else
          u === "body" && i0(l.ownerDocument.body);
      u = e;
    } while (u);
    ie(t);
  }
  function vy(l, t) {
    var u = l;
    l = 0;
    do {
      var a = u.nextSibling;
      if (u.nodeType === 1 ? t ? (u._stashedDisplay = u.style.display, u.style.display = "none") : (u.style.display = u._stashedDisplay || "", u.getAttribute("style") === "" && u.removeAttribute("style")) : u.nodeType === 3 && (t ? (u._stashedText = u.nodeValue, u.nodeValue = "") : u.nodeValue = u._stashedText || ""), a && a.nodeType === 8)
        if (u = a.data, u === "/$") {
          if (l === 0) break;
          l--;
        } else
          u !== "$" && u !== "$?" && u !== "$~" && u !== "$!" || l++;
      u = a;
    } while (u);
  }
  function my(l, t, u) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, l.style.viewTransitionName = t, u != null && (l.style.viewTransitionClass = u), u = getComputedStyle(l), u.display === "inline") {
      if (t = l.getClientRects(), t.length === 1) var a = 1;
      else
        for (var e = a = 0; e < t.length; e++) {
          var n = t[e];
          0 < n.width && 0 < n.height && a++;
        }
      a === 1 && (l = l.style, l.display = t.length === 1 ? "inline-block" : "block", l.marginTop = "-" + u.paddingTop, l.marginBottom = "-" + u.paddingBottom);
    }
  }
  function yy(l, t) {
    l = l.style, t = t.style;
    var u = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    l.viewTransitionName = u == null || typeof u == "boolean" ? "" : ("" + u).trim(), u = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, l.viewTransitionClass = u == null || typeof u == "boolean" ? "" : ("" + u).trim(), l.display === "inline-block" && (t == null ? l.display = l.margin = "" : (u = t.display, l.display = u == null || typeof u == "boolean" ? "" : u, u = t.margin, u != null ? l.margin = u : (u = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], l.marginTop = u == null || typeof u == "boolean" ? "" : u, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], l.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function Ss(l, t, u) {
    return u = u.ownerDocument.defaultView, {
      rect: l,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= l.bottom && 0 <= l.right && l.top <= u.innerHeight && l.left <= u.innerWidth
    };
  }
  function t0(l) {
    var t = l.getBoundingClientRect(), u = getComputedStyle(l);
    return Ss(t, u, l);
  }
  function Ts(l) {
    return l.documentElement.clientHeight;
  }
  function Es(l) {
    this.addEventListener("load", l), this.addEventListener("error", l);
  }
  function bs(l, t, u, a, e, n, f, c, i) {
    var d = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var g = d.startViewTransition({
        update: function() {
          var m = d.defaultView, h = m.navigation && m.navigation.transition, _ = d.fonts.status;
          a();
          var A = [];
          if (_ === "loaded" && (Ts(d), d.fonts.status === "loading" && A.push(d.fonts.ready)), _ = A.length, l !== null)
            for (var Q = l.suspenseyImages, y = 0, o = 0; o < Q.length; o++) {
              var s = Q[o];
              if (!s.complete) {
                var S = s.getBoundingClientRect();
                if (0 < S.bottom && 0 < S.right && S.top < m.innerHeight && S.left < m.innerWidth) {
                  if (y += Yy(s), y > Mf) {
                    A.length = _;
                    break;
                  }
                  s = new Promise(
                    Es.bind(s)
                  ), A.push(s);
                }
              }
            }
          if (0 < A.length)
            return m = Promise.race([
              Promise.all(A),
              new Promise(function(N) {
                return setTimeout(N, 500);
              })
            ]).then(e, e), (h ? Promise.allSettled([h.finished, m]) : m).then(n, n);
          if (e(), h)
            return h.finished.then(
              n,
              n
            );
          n();
        },
        types: u
      });
      d.__reactViewTransition = g;
      var E = [];
      return g.ready.then(
        function() {
          for (var m = d.documentElement.getAnimations({
            subtree: !0
          }), h = 0; h < m.length; h++) {
            var _ = m[h], A = _.effect, Q = A.pseudoElement;
            if (Q != null && Q.startsWith("::view-transition")) {
              E.push(_), _ = A.getKeyframes();
              for (var y = Q = void 0, o = !0, s = 0; s < _.length; s++) {
                var S = _[s], N = S.width;
                if (Q === void 0) Q = N;
                else if (Q !== N) {
                  o = !1;
                  break;
                }
                if (N = S.height, y === void 0) y = N;
                else if (y !== N) {
                  o = !1;
                  break;
                }
                delete S.width, delete S.height, S.transform === "none" && delete S.transform;
              }
              o && Q !== void 0 && y !== void 0 && (A.setKeyframes(_), o = getComputedStyle(
                A.target,
                A.pseudoElement
              ), o.width !== Q || o.height !== y) && (o = _[0], o.width = Q, o.height = y, o = _[_.length - 1], o.width = Q, o.height = y, A.setKeyframes(_));
            }
          }
          f();
        },
        function(m) {
          d.__reactViewTransition === g && (d.__reactViewTransition = null);
          try {
            if (typeof m == "object" && m !== null)
              switch (m.name) {
                case "InvalidStateError":
                  (m.message === "View transition was skipped because document visibility state is hidden." || m.message === "Skipping view transition because document visibility state has become hidden." || m.message === "Skipping view transition because viewport size changed." || m.message === "Transition was aborted because of invalid state") && (m = null);
              }
            m !== null && i(m);
          } finally {
            a(), e(), f();
          }
        }
      ), g.finished.finally(function() {
        for (var m = 0; m < E.length; m++)
          E[m].cancel();
        d.__reactViewTransition === g && (d.__reactViewTransition = null), c();
      }), g;
    } catch {
      return a(), e(), f(), null;
    }
  }
  function ra(l, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + l + "(" + t + ")";
  }
  ra.prototype.animate = function(l, t) {
    return t = typeof t == "number" ? { duration: t } : V({}, t), t.pseudoElement = this._selector, this._scope.animate(l, t);
  }, ra.prototype.getAnimations = function() {
    for (var l = this._scope, t = this._selector, u = l.getAnimations({ subtree: !0 }), a = [], e = 0; e < u.length; e++) {
      var n = u[e].effect;
      n !== null && n.target === l && n.pseudoElement === t && a.push(u[e]);
    }
    return a;
  }, ra.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function dy(l) {
    return {
      name: l,
      group: new ra("group", l),
      imagePair: new ra("image-pair", l),
      old: new ra("old", l),
      new: new ra("new", l)
    };
  }
  function yt(l) {
    this._fragmentFiber = l, this._observers = this._eventListeners = null;
  }
  yt.prototype.addEventListener = function(l, t, u) {
    var a = null, e = null;
    if (!(u != null && typeof u != "boolean" && (a = u.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var n = this._eventListeners;
      if (hy(n, l, t, u) === -1) {
        var f = this, c = t;
        u != null && typeof u != "boolean" && u.once === !0 && (c = function(i) {
          f.removeEventListener(
            l,
            t,
            u
          ), typeof t == "function" ? t.call(this, i) : t.handleEvent(i);
        }), a !== null && (e = f.removeEventListener.bind(
          f,
          l,
          t,
          u
        ), a.addEventListener("abort", e, { once: !0 }), e = a.removeEventListener.bind(a, "abort", e)), a = ue(u), n.push({
          type: l,
          listener: t,
          optionsOrUseCapture: u,
          attachedListener: c,
          cleanup: e
        }), T(
          this._fragmentFiber.child,
          !1,
          zs,
          l,
          c,
          a
        );
      }
      this._eventListeners = n;
    }
  };
  function zs(l, t, u, a) {
    return ol(l).addEventListener(
      t,
      u,
      a
    ), !1;
  }
  yt.prototype.removeEventListener = function(l, t, u) {
    var a = this._eventListeners;
    if (a !== null && (t = hy(
      a,
      l,
      t,
      u
    ), t !== -1)) {
      var e = a[t];
      u = e.attachedListener;
      var n = e.cleanup;
      e = ue(e.optionsOrUseCapture), T(
        this._fragmentFiber.child,
        !1,
        _s,
        l,
        u,
        e
      ), a.splice(t, 1), n !== null && n();
    }
  };
  function _s(l, t, u, a) {
    return ol(l).removeEventListener(
      t,
      u,
      a
    ), !1;
  }
  function ue(l) {
    return l != null && typeof l != "boolean" && (l.once === !0 || l.signal instanceof AbortSignal) ? { capture: l.capture, passive: l.passive } : l;
  }
  function sy(l) {
    return l == null ? "c=0" : typeof l == "boolean" ? "c=" + (l ? "1" : "0") : "c=" + (l.capture ? "1" : "0");
  }
  function hy(l, t, u, a) {
    if (l.length === 0) return -1;
    a = sy(a);
    for (var e = 0; e < l.length; e++) {
      var n = l[e];
      if (n.type === t && n.listener === u && sy(n.optionsOrUseCapture) === a)
        return e;
    }
    return -1;
  }
  yt.prototype.dispatchEvent = function(l) {
    var t = H(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = ol(t);
    var u = this._eventListeners;
    if (u !== null && 0 < u.length || !l.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (u)
        for (var e = 0; e < u.length; e++) {
          var n = u[e];
          a.addEventListener(
            n.type,
            n.attachedListener,
            ue(n.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), l = a.dispatchEvent(l), u)
        for (e = 0; e < u.length; e++)
          n = u[e], a.removeEventListener(
            n.type,
            n.attachedListener,
            ue(n.optionsOrUseCapture)
          );
      return t.removeChild(a), l;
    }
    return t.dispatchEvent(l);
  }, yt.prototype.focus = function(l) {
    T(
      this._fragmentFiber.child,
      !0,
      gy,
      l,
      void 0,
      void 0
    );
  };
  function gy(l, t) {
    return l.tag === 6 ? !1 : (l = ol(l), Bs(l, t));
  }
  yt.prototype.focusLast = function(l) {
    var t = [];
    T(
      this._fragmentFiber.child,
      !0,
      u0,
      t,
      void 0,
      void 0
    );
    for (var u = t.length - 1; 0 <= u && !gy(t[u], l); u--) ;
  };
  function u0(l, t) {
    return t.push(l), !1;
  }
  yt.prototype.blur = function() {
    var l = H(
      this._fragmentFiber
    );
    l !== null && (l = ol(l), l = $e(l).activeElement, l !== null && T(
      this._fragmentFiber.child,
      !1,
      Os,
      l,
      void 0,
      void 0
    ));
  };
  function Os(l, t) {
    return l.tag === 6 ? !1 : (l = ol(l), l === t || l.contains(t) ? (t.blur(), !0) : !1);
  }
  yt.prototype.observeUsing = function(l) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(l), T(
      this._fragmentFiber.child,
      !1,
      Ns,
      l,
      void 0,
      void 0
    );
  };
  function Ns(l, t) {
    return l.tag === 6 || (l = ol(l), t.observe(l)), !1;
  }
  yt.prototype.unobserveUsing = function(l) {
    var t = this._observers;
    if (t !== null && t.has(l)) {
      t.delete(l), T(
        this._fragmentFiber.child,
        !1,
        As,
        l,
        void 0,
        void 0
      );
      for (var u = t = 0; u < Yt.length; u++) {
        var a = Yt[u];
        a.fragmentInstance === this && a.observer === l ? l.unobserve(a.instance) : Yt[t++] = a;
      }
      Yt.length = t;
    }
  };
  function As(l, t) {
    return l.tag === 6 || (l = ol(l), t.unobserve(l)), !1;
  }
  var Yt = [], a0 = !1;
  function Ds(l, t, u) {
    Yt.push({
      fragmentInstance: l,
      observer: t,
      instance: u
    }), a0 || (a0 = !0, ps(function() {
      a0 = !1;
      var a = Yt;
      Yt = [];
      for (var e = 0; e < a.length; e++) {
        var n = a[e];
        n.observer.unobserve(n.instance);
      }
    }));
  }
  yt.prototype.getClientRects = function() {
    var l = [];
    return T(
      this._fragmentFiber.child,
      !1,
      Ms,
      l,
      void 0,
      void 0
    ), l;
  };
  function Ms(l, t) {
    if (l.tag === 6) {
      l = l.stateNode;
      var u = l.ownerDocument.createRange();
      u.selectNodeContents(l), t.push.apply(t, u.getClientRects());
    } else
      l = ol(l), t.push.apply(t, l.getClientRects());
    return !1;
  }
  yt.prototype.getRootNode = function(l) {
    var t = H(
      this._fragmentFiber
    );
    return t === null ? this : ol(t).getRootNode(l);
  }, yt.prototype.compareDocumentPosition = function(l) {
    var t = H(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var u = [];
    T(
      this._fragmentFiber.child,
      !1,
      u0,
      u,
      void 0,
      void 0
    );
    var a = ol(t);
    if (u.length === 0) {
      if (u = a, Nl(this._fragmentFiber)) {
        l: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break l;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (u = t);
      }
      t = this._fragmentFiber;
      var e = a = u.compareDocumentPosition(l);
      return u === l ? e = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (u = kl(t)[1], u === null ? e = Node.DOCUMENT_POSITION_PRECEDING : (l = ol(u).compareDocumentPosition(
        l
      ), e = l === 0 || l & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), e |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = ol(u[0]), e = ol(u[u.length - 1]);
    var n = Nl(this._fragmentFiber) ? t.parentElement : a;
    if (n == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, n = n.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var f = t.compareDocumentPosition(l), c = e.compareDocumentPosition(l), i = f & Node.DOCUMENT_POSITION_CONTAINED_BY || c & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return c = a && n && f & Node.DOCUMENT_POSITION_FOLLOWING && c & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === l || n && e === l || i || c ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === l || !n && e === l ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : f, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Us(
      t,
      this._fragmentFiber,
      u[0],
      u[u.length - 1],
      l
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function Us(l, t, u, a, e) {
    var n = Fu(e);
    if (l & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (u = !!n)
        l: {
          for (; n !== null; ) {
            if (n.tag === 7 && (n === t || n.alternate === t)) {
              u = !0;
              break l;
            }
            n = n.return;
          }
          u = !1;
        }
      return u;
    }
    if (l & Node.DOCUMENT_POSITION_CONTAINS) {
      if (n === null)
        return n = e.ownerDocument, e === n || e === n.documentElement || e === n.body;
      l: {
        for (n = t, t = H(t); n !== null; ) {
          if (!(n.tag !== 5 && n.tag !== 3 && n.tag !== 27 || n !== t && n.alternate !== t)) {
            n = !0;
            break l;
          }
          n = n.return;
        }
        n = !1;
      }
      return n;
    }
    return l & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!n) && !(t = n === u) && (t = lt(
      u,
      n,
      pt
    ), t === null ? t = !1 : (T(
      t,
      !0,
      Ju,
      n,
      u
    ), n = dt, dt = null, t = n !== null)), t) : l & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!n) && !(t = n === a) && (t = lt(
      a,
      n,
      pt
    ), t === null ? t = !1 : (T(
      t,
      !0,
      Bt,
      n,
      a
    ), n = dt, Pl = dt = null, t = n !== null)), t) : !1;
  }
  function ry(l, t) {
    var u = l.ownerDocument.createRange();
    u.selectNodeContents(l), l = u.getBoundingClientRect(), window.scrollTo(
      window.scrollX + l.left,
      t ? window.scrollY + l.top : window.scrollY + l.bottom - window.innerHeight
    );
  }
  yt.prototype.scrollIntoView = function(l) {
    if (typeof l == "object") throw Error(r(566));
    var t = [];
    T(
      this._fragmentFiber.child,
      !1,
      u0,
      t,
      void 0,
      void 0
    );
    var u = l !== !1;
    if (t.length === 0) {
      var a = kl(
        this._fragmentFiber
      );
      if (a = u ? a[1] || a[0] || H(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        l = ol(a), ry(l, u);
        return;
      }
      if (a = ol(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          u = "host" in a ? a.host : null, u !== null && u.scrollIntoView(l);
          return;
        }
        a.scrollIntoView(l);
      }
    }
    for (a = u ? t.length - 1 : 0; a !== (u ? -1 : t.length); ) {
      var e = t[a];
      e.tag === 6 ? (e = ol(e), ry(e, u)) : ol(e).scrollIntoView(l), a += u ? -1 : 1;
    }
  };
  function Cs(l, t) {
    return l = ol(l), Sy(l, t), !1;
  }
  function Sy(l, t) {
    l.reactFragments == null && (l.reactFragments = /* @__PURE__ */ new Set()), l.reactFragments.add(t);
  }
  function Ty(l, t) {
    var u = t._eventListeners;
    if (u !== null)
      for (var a = 0; a < u.length; a++) {
        var e = u[a];
        l.addEventListener(
          e.type,
          e.attachedListener,
          ue(e.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (u = t._observers, u !== null && u.forEach(function(n) {
      for (var f = 0, c = 0; c < Yt.length; c++) {
        var i = Yt[c];
        (i.fragmentInstance !== t || i.observer !== n || i.instance !== l) && (Yt[f++] = i);
      }
      Yt.length = f, n.observe(l);
    }), Sy(l, t));
  }
  function Rs(l, t) {
    var u = t._eventListeners;
    if (u !== null)
      for (var a = 0; a < u.length; a++) {
        var e = u[a];
        l.removeEventListener(
          e.type,
          e.attachedListener,
          ue(e.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (u = t._observers, u !== null && u.forEach(function(n) {
      typeof n.rootMargin == "string" ? Ds(
        t,
        n,
        l
      ) : n.unobserve(l);
    }), l.reactFragments != null && l.reactFragments.delete(t));
  }
  function e0(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var u = t;
      switch (t = t.nextSibling, u.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          e0(u), hn(u);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (u.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(u);
    }
  }
  function Hs(l, t, u, a) {
    for (; l.nodeType === 1; ) {
      var e = u;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (a) {
        if (!l[de])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== e.rel || l.getAttribute("href") !== (e.href == null || e.href === "" ? null : e.href) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin) || l.getAttribute("title") !== (e.title == null ? null : e.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (e.src == null ? null : e.src) || l.getAttribute("type") !== (e.type == null ? null : e.type) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = e.name == null ? null : "" + e.name;
        if (e.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = _t(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Ys(l, t, u) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !u || (l = _t(l.nextSibling), l === null)) return null;
    return l;
  }
  function Ey(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = _t(l.nextSibling), l === null)) return null;
    return l;
  }
  function n0(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function f0(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function qs(l, t) {
    var u = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || u.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), u.removeEventListener("DOMContentLoaded", a);
      };
      u.addEventListener("DOMContentLoaded", a), l._reactRetry = a;
    }
  }
  function _t(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = l.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return l;
  }
  var c0 = null;
  function by(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "/$" || u === "/&") {
          if (t === 0)
            return _t(l.nextSibling);
          t--;
        } else
          u !== "$" && u !== "$!" && u !== "$?" && u !== "$~" && u !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function zy(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "$" || u === "$!" || u === "$?" || u === "$~" || u === "&") {
          if (t === 0) return l;
          t--;
        } else u !== "/$" && u !== "/&" || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Bs(l, t) {
    function u() {
      a = !0;
    }
    if (l.ownerDocument.activeElement === l) return !0;
    var a = !1;
    try {
      l.ownerDocument.addEventListener("focus", u, !0), (l.focus || HTMLElement.prototype.focus).call(l, t);
    } finally {
      l.ownerDocument.removeEventListener("focus", u, !0);
    }
    return a;
  }
  function ps(l) {
    iy(function() {
      iy(function(t) {
        return l(t);
      });
    });
  }
  function _y(l, t, u) {
    switch (t = $e(u), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(r(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(r(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(r(454));
        return l;
      default:
        throw Error(r(451));
    }
  }
  function Oy(l, t, u) {
    for (var a in u) {
      var e = u[a];
      u.hasOwnProperty(a) && e != null && nl(l, t, a, null, ms, e);
    }
    u.dangerouslySetInnerHTML != null && (l.textContent = ""), l.onclick === jt && (l.onclick = null), hn(l);
  }
  function i0(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    hn(l);
  }
  var Ot = /* @__PURE__ */ new Map(), Ny = /* @__PURE__ */ new Set();
  function Fe(l) {
    if (typeof l.getRootNode == "function") {
      var t = l.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  var du = p.d;
  p.d = {
    f: Gs,
    r: Xs,
    D: Qs,
    C: js,
    L: Zs,
    m: Vs,
    X: Ls,
    S: xs,
    M: Ks
  };
  function Gs() {
    var l = du.f(), t = Tf();
    return l || t;
  }
  function Xs(l) {
    var t = ba(l);
    t !== null && t.tag === 5 && t.type === "form" ? Dv(t) : du.r(l);
  }
  var ae = typeof document > "u" ? null : document;
  function Ay(l, t, u) {
    var a = ae;
    if (a && typeof t == "string" && t) {
      var e = gt(t);
      e = 'link[rel="' + l + '"][href="' + e + '"]', typeof u == "string" && (e += '[crossorigin="' + u + '"]'), Ny.has(e) || (Ny.add(e), l = { rel: l, crossOrigin: u, href: t }, a.querySelector(e) === null && (t = a.createElement("link"), Xl(t, "link", l), Dl(t), a.head.appendChild(t)));
    }
  }
  function Qs(l) {
    du.D(l), Ay("dns-prefetch", l, null);
  }
  function js(l, t) {
    du.C(l, t), Ay("preconnect", l, t);
  }
  function Zs(l, t, u) {
    du.L(l, t, u);
    var a = ae;
    if (a && l && t) {
      var e = 'link[rel="preload"][as="' + gt(t) + '"]';
      t === "image" && u && u.imageSrcSet ? (e += '[imagesrcset="' + gt(
        u.imageSrcSet
      ) + '"]', typeof u.imageSizes == "string" && (e += '[imagesizes="' + gt(
        u.imageSizes
      ) + '"]')) : e += '[href="' + gt(l) + '"]';
      var n = e;
      switch (t) {
        case "style":
          n = ee(l);
          break;
        case "script":
          n = ne(l);
      }
      if (!(Ot.has(n) || (l = V(
        {
          rel: "preload",
          href: t === "image" && u && u.imageSrcSet ? void 0 : l,
          as: t
        },
        u
      ), Ot.set(n, l), a.querySelector(e) !== null || t === "style" && a.querySelector(Ie(n)) || t === "script" && a.querySelector(ke(n))))) {
        var f = a.createElement("link");
        Xl(f, "link", l), t === "style" && (f[sn] = !0, f.onload = f.onerror = function() {
          X0(f);
        }), Dl(f), a.head.appendChild(f);
      }
    }
  }
  function Vs(l, t) {
    du.m(l, t);
    var u = ae;
    if (u && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", e = 'link[rel="modulepreload"][as="' + gt(a) + '"][href="' + gt(l) + '"]', n = e;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = ne(l);
      }
      if (!Ot.has(n) && (l = V({ rel: "modulepreload", href: l }, t), Ot.set(n, l), u.querySelector(e) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (u.querySelector(ke(n)))
              return;
        }
        a = u.createElement("link"), Xl(a, "link", l), Dl(a), u.head.appendChild(a);
      }
    }
  }
  function xs(l, t, u) {
    du.S(l, t, u);
    var a = ae;
    if (a && l) {
      var e = za(a).hoistableStyles, n = ee(l);
      t = t || "default";
      var f = e.get(n);
      if (!f) {
        var c = { loading: 0, preload: null };
        if (f = a.querySelector(
          Ie(n)
        ))
          c.loading = 5;
        else {
          l = V(
            { rel: "stylesheet", href: l, "data-precedence": t },
            u
          ), (u = Ot.get(n)) && o0(l, u);
          var i = f = a.createElement("link");
          Dl(i), Xl(i, "link", l), i._p = new Promise(function(d, g) {
            i.onload = d, i.onerror = g;
          }), i.addEventListener("load", function() {
            c.loading |= 1;
          }), i.addEventListener("error", function() {
            c.loading |= 2;
          }), c.loading |= 4, Af(f, t, a);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: c
        }, e.set(n, f);
      }
    }
  }
  function Ls(l, t) {
    du.X(l, t);
    var u = ae;
    if (u && l) {
      var a = za(u).hoistableScripts, e = ne(l), n = a.get(e);
      n || (n = u.querySelector(ke(e)), n || (l = V({ src: l, async: !0 }, t), (t = Ot.get(e)) && v0(l, t), n = u.createElement("script"), Dl(n), Xl(n, "link", l), u.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(e, n));
    }
  }
  function Ks(l, t) {
    du.M(l, t);
    var u = ae;
    if (u && l) {
      var a = za(u).hoistableScripts, e = ne(l), n = a.get(e);
      n || (n = u.querySelector(ke(e)), n || (l = V({ src: l, async: !0, type: "module" }, t), (t = Ot.get(e)) && v0(l, t), n = u.createElement("script"), Dl(n), Xl(n, "link", l), u.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(e, n));
    }
  }
  function Dy(l, t, u, a) {
    var e = (e = gu.current) ? Fe(e) : null;
    if (!e) throw Error(r(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof u.precedence == "string" && typeof u.href == "string" ? (u = ee(u.href), t = za(
          e
        ).hoistableStyles, a = t.get(u), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(u, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (u.rel === "stylesheet" && typeof u.href == "string" && typeof u.precedence == "string") {
          l = ee(u.href);
          var n = za(
            e
          ).hoistableStyles, f = n.get(l);
          if (f || (e = e.ownerDocument || e, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, f), (n = e.querySelector(
            Ie(l)
          )) ? n._p || (f.instance = n, f.state.loading = 5) : (n = Ot.get(l), n || (n = {
            rel: "preload",
            as: "style",
            href: u.href,
            crossOrigin: u.crossOrigin,
            integrity: u.integrity,
            media: u.media,
            hrefLang: u.hrefLang,
            referrerPolicy: u.referrerPolicy
          }, Ot.set(l, n)), Js(
            e,
            l,
            n,
            f.state
          ))), t && a === null)
            throw Error(r(528, ""));
          return f;
        }
        if (t && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = u.async, u = u.src, typeof u == "string" && t && typeof t != "function" && typeof t != "symbol" ? (u = ne(u), t = za(
          e
        ).hoistableScripts, a = t.get(u), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(u, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, l));
    }
  }
  function ee(l) {
    return 'href="' + gt(l) + '"';
  }
  function Ie(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function My(l) {
    return V({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function Js(l, t, u, a) {
    if (t = l.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[sn] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = l.createElement("link"), t[sn] = !0, t.onload = t.onerror = X0.bind(null, t), Xl(t, "link", u), Dl(t), l.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function ne(l) {
    return '[src="' + gt(l) + '"]';
  }
  function ke(l) {
    return "script[async]" + l;
  }
  function Uy(l, t, u) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + gt(u.href) + '"]'
          );
          if (a)
            return t.instance = a, Dl(a), a;
          var e = V({}, u, {
            "data-href": u.href,
            "data-precedence": u.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), Dl(a), Xl(a, "style", e), Af(a, u.precedence, l), t.instance = a;
        case "stylesheet":
          e = ee(u.href);
          var n = l.querySelector(
            Ie(e)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Dl(n), n;
          a = My(u), (e = Ot.get(e)) && o0(a, e), n = (l.ownerDocument || l).createElement("link"), Dl(n);
          var f = n;
          return f._p = new Promise(function(c, i) {
            f.onload = c, f.onerror = i;
          }), Xl(n, "link", a), t.state.loading |= 4, Af(n, u.precedence, l), t.instance = n;
        case "script":
          return n = ne(u.src), (e = l.querySelector(
            ke(n)
          )) ? (t.instance = e, Dl(e), e) : (a = u, (e = Ot.get(n)) && (a = V({}, u), v0(a, e)), l = l.ownerDocument || l, e = l.createElement("script"), Dl(e), Xl(e, "link", a), l.head.appendChild(e), t.instance = e);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Af(a, u.precedence, l));
    return t.instance;
  }
  function Af(l, t, u) {
    for (var a = u.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), e = a.length ? a[a.length - 1] : null, n = e, f = 0; f < a.length; f++) {
      var c = a[f];
      if (c.dataset.precedence === t) n = c;
      else if (n !== e) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = u.nodeType === 9 ? u.head : u, t.insertBefore(l, t.firstChild));
  }
  function o0(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function v0(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Df = null;
  function Cy(l, t, u) {
    if (Df === null) {
      var a = /* @__PURE__ */ new Map(), e = Df = /* @__PURE__ */ new Map();
      e.set(u, a);
    } else
      e = Df, a = e.get(u), a || (a = /* @__PURE__ */ new Map(), e.set(u, a));
    if (a.has(l)) return a;
    for (a.set(l, null), u = u.getElementsByTagName(l), e = 0; e < u.length; e++) {
      var n = u[e];
      if (!(n[de] || n[Yl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = n.getAttribute(t) || "";
        f = l + f;
        var c = a.get(f);
        c ? c.push(n) : a.set(f, [n]);
      }
    }
    return a;
  }
  function m0(l, t, u) {
    l = l.ownerDocument || l, l.head.insertBefore(
      u,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function ws(l, t, u) {
    if (u === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return l = t.disabled, typeof t.precedence == "string" && l == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Ry(l, t) {
    return l === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function Hy(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function Yy(l) {
    return (l.width || 100) * (l.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function qy(l, t) {
    typeof t.decode == "function" && (l.imgCount++, t.complete || (l.imgBytes += Yy(t), l.suspenseyImages.push(t)), l = Fs.bind(l), t.decode().then(l, l));
  }
  function Ws(l, t, u, a) {
    if (u.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (u.state.loading & 4) === 0) {
      if (u.instance === null) {
        var e = ee(a.href), n = t.querySelector(
          Ie(e)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = Pe.bind(l), t.then(l, l)), u.state.loading |= 4, u.instance = n, Dl(n);
          return;
        }
        n = t.ownerDocument || t, a = My(a), (e = Ot.get(e)) && o0(a, e), n = n.createElement("link"), Dl(n);
        var f = n;
        f._p = new Promise(function(c, i) {
          f.onload = c, f.onerror = i;
        }), Xl(n, "link", a), u.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(u, t), (t = u.state.preload) && (u.state.loading & 3) === 0 && (l.count++, u = Pe.bind(l), t.addEventListener("load", u), t.addEventListener("error", u));
    }
  }
  var Mf = 0;
  function $s(l, t) {
    return l.stylesheets && l.count === 0 && Cf(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(u) {
      var a = setTimeout(function() {
        if (l.stylesheets && Cf(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && Mf === 0 && (Mf = 62500 * ds());
      var e = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Cf(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > Mf ? 50 : 800) + t
      );
      return l.unsuspend = u, function() {
        l.unsuspend = null, clearTimeout(a), clearTimeout(e);
      };
    } : null;
  }
  function By(l) {
    if (l.count === 0 && (l.imgCount === 0 || !l.waitingForImages)) {
      if (l.stylesheets) Cf(l, l.stylesheets);
      else if (l.unsuspend) {
        var t = l.unsuspend;
        l.unsuspend = null, t();
      }
    }
  }
  function Pe() {
    this.count--, By(this);
  }
  function Fs() {
    this.imgCount--, By(this);
  }
  var Uf = null;
  function Cf(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Uf = /* @__PURE__ */ new Map(), t.forEach(Is, l), Uf = null, Pe.call(l));
  }
  function Is(l, t) {
    if (!(t.state.loading & 4)) {
      var u = Uf.get(l);
      if (u) var a = u.get(null);
      else {
        u = /* @__PURE__ */ new Map(), Uf.set(l, u);
        for (var e = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < e.length; n++) {
          var f = e[n];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (u.set(f.dataset.precedence, f), a = f);
        }
        a && u.set(null, a);
      }
      e = t.instance, f = e.getAttribute("data-precedence"), n = u.get(f) || a, n === a && u.set(null, e), u.set(f, e), this.count++, a = Pe.bind(this), e.addEventListener("load", a), e.addEventListener("error", a), n ? n.parentNode.insertBefore(e, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(e, l.firstChild)), t.state.loading |= 4;
    }
  }
  var fe = {
    $$typeof: Al,
    Provider: null,
    Consumer: null,
    _currentValue: kt,
    _currentValue2: kt,
    _threadCount: 0
  };
  function ks(l, t, u, a, e, n, f, c, i) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Kf(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Kf(0), this.hiddenUpdates = Kf(null), this.identifierPrefix = a, this.onUncaughtError = e, this.onCaughtError = n, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = i, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function py(l, t, u, a, e, n, f, c, i, d, g, E) {
    return l = new ks(
      l,
      t,
      u,
      f,
      i,
      d,
      g,
      E,
      c
    ), t = 1, n === !0 && (t |= 24), n = wl(3, null, null, t), l.current = n, n.stateNode = l, t = Ac(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: u,
      cache: t
    }, Cc(n), l;
  }
  function Gy(l) {
    return l ? (l = Ha, l) : Ha;
  }
  function Xy(l, t, u, a, e, n) {
    e = Gy(e), a.context === null ? a.context = e : a.pendingContext = e, a = Du(t), a.payload = { element: u }, n = n === void 0 ? null : n, n !== null && (a.callback = n), u = Mu(l, a, t), u !== null && (Il(u, l, t), Ce(u, l, t));
  }
  function Qy(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var u = l.retryLane;
      l.retryLane = u !== 0 && u < t ? u : t;
    }
  }
  function y0(l, t) {
    Qy(l, t), (l = l.alternate) && Qy(l, t);
  }
  function jy(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = la(l, 67108864);
      t !== null && Il(t, l, 67108864), y0(l, 67108864);
    }
  }
  function Zy(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = mt();
      t = Jf(t);
      var u = la(l, t);
      u !== null && Il(u, l, t), y0(l, t);
    }
  }
  var ce = !0;
  function Ps(l, t, u, a) {
    var e = D.T;
    D.T = null;
    var n = p.p;
    try {
      p.p = 2, d0(l, t, u, a);
    } finally {
      p.p = n, D.T = e;
    }
  }
  function lh(l, t, u, a) {
    var e = D.T;
    D.T = null;
    var n = p.p;
    try {
      p.p = 8, d0(l, t, u, a);
    } finally {
      p.p = n, D.T = e;
    }
  }
  function d0(l, t, u, a) {
    if (ce) {
      var e = s0(a);
      if (e === null)
        Wi(
          l,
          t,
          a,
          Rf,
          u
        ), xy(l, a);
      else if (uh(
        e,
        l,
        t,
        u,
        a
      ))
        a.stopPropagation();
      else if (xy(l, a), t & 4 && -1 < th.indexOf(l)) {
        for (; e !== null; ) {
          var n = ba(e);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var f = $u(n.pendingLanes);
                  if (f !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; f; ) {
                      var i = 1 << 31 - et(f);
                      c.entanglements[1] |= i, f &= ~i;
                    }
                    Ft(n), (ll & 6) === 0 && (gf = ut() + 500, Je(0));
                  }
                }
                break;
              case 31:
              case 13:
                c = la(n, 2), c !== null && Il(c, n, 2), Tf(), y0(n, 2);
            }
          if (n = s0(a), n === null && Wi(
            l,
            t,
            a,
            Rf,
            u
          ), n === e) break;
          e = n;
        }
        e !== null && a.stopPropagation();
      } else
        Wi(
          l,
          t,
          a,
          null,
          u
        );
    }
  }
  function s0(l) {
    return l = Pf(l), h0(l);
  }
  var Rf = null;
  function h0(l) {
    if (Rf = null, l = Fu(l), l !== null) {
      var t = At(l);
      if (t === null) l = null;
      else {
        var u = t.tag;
        if (u === 13) {
          if (l = qt(t), l !== null) return l;
          l = null;
        } else if (u === 31) {
          if (l = su(t), l !== null) return l;
          l = null;
        } else if (u === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Rf = l, null;
  }
  function Vy(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (dd()) {
          case A0:
            return 2;
          case D0:
            return 8;
          case on:
          case sd:
            return 32;
          case M0:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var g0 = !1, ju = null, Zu = null, Vu = null, ln = /* @__PURE__ */ new Map(), tn = /* @__PURE__ */ new Map(), xu = [], th = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function xy(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        ju = null;
        break;
      case "dragenter":
      case "dragleave":
        Zu = null;
        break;
      case "mouseover":
      case "mouseout":
        Vu = null;
        break;
      case "pointerover":
      case "pointerout":
        ln.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        tn.delete(t.pointerId);
    }
  }
  function un(l, t, u, a, e, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: u,
      eventSystemFlags: a,
      nativeEvent: n,
      targetContainers: [e]
    }, t !== null && (t = ba(t), t !== null && jy(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, e !== null && t.indexOf(e) === -1 && t.push(e), l);
  }
  function uh(l, t, u, a, e) {
    switch (t) {
      case "focusin":
        return ju = un(
          ju,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "dragenter":
        return Zu = un(
          Zu,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "mouseover":
        return Vu = un(
          Vu,
          l,
          t,
          u,
          a,
          e
        ), !0;
      case "pointerover":
        var n = e.pointerId;
        return ln.set(
          n,
          un(
            ln.get(n) || null,
            l,
            t,
            u,
            a,
            e
          )
        ), !0;
      case "gotpointercapture":
        return n = e.pointerId, tn.set(
          n,
          un(
            tn.get(n) || null,
            l,
            t,
            u,
            a,
            e
          )
        ), !0;
    }
    return !1;
  }
  function Ly(l) {
    var t = Fu(l.target);
    if (t !== null) {
      var u = At(t);
      if (u !== null) {
        if (t = u.tag, t === 13) {
          if (t = qt(u), t !== null) {
            l.blockedOn = t, B0(l.priority, function() {
              Zy(u);
            });
            return;
          }
        } else if (t === 31) {
          if (t = su(u), t !== null) {
            l.blockedOn = t, B0(l.priority, function() {
              Zy(u);
            });
            return;
          }
        } else if (t === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Hf(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var u = s0(l.nativeEvent);
      if (u === null) {
        u = l.nativeEvent;
        var a = new u.constructor(
          u.type,
          u
        );
        kf = a, u.target.dispatchEvent(a), kf = null;
      } else
        return t = ba(u), t !== null && jy(t), l.blockedOn = u, !1;
      t.shift();
    }
    return !0;
  }
  function Ky(l, t, u) {
    Hf(l) && u.delete(t);
  }
  function ah() {
    g0 = !1, ju !== null && Hf(ju) && (ju = null), Zu !== null && Hf(Zu) && (Zu = null), Vu !== null && Hf(Vu) && (Vu = null), ln.forEach(Ky), tn.forEach(Ky);
  }
  function Yf(l, t) {
    l.blockedOn === t && (l.blockedOn = null, g0 || (g0 = !0, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      ah
    )));
  }
  var qf = null;
  function Jy(l) {
    qf !== l && (qf = l, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      function() {
        qf === l && (qf = null);
        for (var t = 0; t < l.length; t += 3) {
          var u = l[t], a = l[t + 1], e = l[t + 2];
          if (typeof a != "function") {
            if (h0(a || u) === null)
              continue;
            break;
          }
          var n = ba(u);
          n !== null && (l.splice(t, 3), t -= 3, Ic(
            n,
            {
              pending: !0,
              data: e,
              method: u.method,
              action: a
            },
            a,
            e
          ));
        }
      }
    ));
  }
  function ie(l) {
    function t(i) {
      return Yf(i, l);
    }
    ju !== null && Yf(ju, l), Zu !== null && Yf(Zu, l), Vu !== null && Yf(Vu, l), ln.forEach(t), tn.forEach(t);
    for (var u = 0; u < xu.length; u++) {
      var a = xu[u];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < xu.length && (u = xu[0], u.blockedOn === null); )
      Ly(u), u.blockedOn === null && xu.shift();
    if (u = (l.ownerDocument || l).$$reactFormReplay, u != null)
      for (a = 0; a < u.length; a += 3) {
        var e = u[a], n = u[a + 1], f = e[Jl] || null;
        if (typeof n == "function")
          f || Jy(u);
        else if (f) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (e = n, f = n[Jl] || null)
              c = f.formAction;
            else if (h0(e) !== null) continue;
          } else c = f.action;
          typeof c == "function" ? u[a + 1] = c : (u.splice(a, 3), a -= 3), Jy(u);
        }
      }
  }
  function wy() {
    function l(n) {
      n.canIntercept && n.info === "react-transition" && n.intercept({
        handler: function() {
          return new Promise(function(f) {
            return e = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      e !== null && (e(), e = null), a || setTimeout(u, 20);
    }
    function u() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n && n.url != null && navigation.navigate(n.url, {
          state: n.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, e = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(u, 100), function() {
        a = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), e !== null && (e(), e = null);
      };
    }
  }
  function r0(l) {
    this._internalRoot = l;
  }
  Bf.prototype.render = r0.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var u = t.current, a = mt();
    Xy(u, a, l, t, null, null);
  }, Bf.prototype.unmount = r0.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      Xy(l.current, 2, null, l, null, null), Tf(), t[Ea] = null;
    }
  };
  function Bf(l) {
    this._internalRoot = l;
  }
  Bf.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = q0();
      l = { blockedOn: null, target: l, priority: t };
      for (var u = 0; u < xu.length && t !== 0 && t < xu[u].priority; u++) ;
      xu.splice(u, 0, l), u === 0 && Ly(l);
    }
  };
  var Wy = j.version;
  if (Wy !== "19.3.1")
    throw Error(
      r(
        527,
        Wy,
        "19.3.1"
      )
    );
  p.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(r(188)) : (l = Object.keys(l).join(","), Error(r(268, l)));
    return l = Rl(t), l = l !== null ? Y(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var eh = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: D,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var pf = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!pf.isDisabled && pf.supportsFiber)
      try {
        ve = pf.inject(
          eh
        ), at = pf;
      } catch {
      }
  }
  return an.createRoot = function(l, t) {
    if (!Nt(l)) throw Error(r(299));
    var u = !1, a = "", e = Gv, n = Xv, f = Qv;
    return t != null && (t.unstable_strictMode === !0 && (u = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (e = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = py(
      l,
      1,
      !1,
      null,
      null,
      u,
      a,
      null,
      e,
      n,
      f,
      wy
    ), l[Ea] = t.current, wi(l), new r0(t);
  }, an.hydrateRoot = function(l, t, u) {
    if (!Nt(l)) throw Error(r(299));
    var a = !1, e = "", n = Gv, f = Xv, c = Qv, i = null;
    return u != null && (u.unstable_strictMode === !0 && (a = !0), u.identifierPrefix !== void 0 && (e = u.identifierPrefix), u.onUncaughtError !== void 0 && (n = u.onUncaughtError), u.onCaughtError !== void 0 && (f = u.onCaughtError), u.onRecoverableError !== void 0 && (c = u.onRecoverableError), u.formState !== void 0 && (i = u.formState)), t = py(
      l,
      1,
      !0,
      t,
      u ?? null,
      a,
      e,
      i,
      n,
      f,
      c,
      wy
    ), t.context = Gy(null), u = t.current, a = mt(), a = Jf(a), e = Du(a), e.callback = null, Mu(u, e, a), u = a, t.current.lanes = u, ye(t, u), Ft(t), l[Ea] = t.current, wi(l), new Bf(t);
  }, an.version = "19.3.1", an;
}
var ud;
function yh() {
  if (ud) return E0.exports;
  ud = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (j) {
        console.error(j);
      }
  }
  return z(), E0.exports = mh(), E0.exports;
}
var dh = yh();
function sh(z, j) {
  return !Number.isFinite(z) || !Number.isFinite(j) || z <= 0 ? null : Math.round(j / z * 1e3) / 10;
}
const od = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
function ad(z) {
  return od.format(z);
}
function hh(z) {
  return z === null ? "—" : `${od.format(z)} %`;
}
function gh(z) {
  return z === null ? "pf-pct" : z >= 100 ? "pf-pct pf-pct--done" : z > 0 ? "pf-pct pf-pct--progress" : "pf-pct pf-pct--none";
}
function rh(z) {
  const { data: j } = z;
  return rl.createElement(
    "div",
    { className: "pf-root" },
    rl.createElement(
      "div",
      { className: "pf-head" },
      rl.createElement("h2", { className: "pf-title" }, "План/Факт"),
      rl.createElement("div", { className: "pf-sub" }, j.project, " · демо-данные")
    ),
    rl.createElement(
      "div",
      { className: "pf-card" },
      rl.createElement(
        "table",
        { className: "pf-table" },
        rl.createElement(
          "thead",
          null,
          rl.createElement(
            "tr",
            null,
            rl.createElement("th", null, "Наименование работ"),
            rl.createElement("th", null, "Ед."),
            rl.createElement("th", { className: "pf-num" }, "План"),
            rl.createElement("th", { className: "pf-num" }, "Факт"),
            rl.createElement("th", { className: "pf-num" }, "%")
          )
        ),
        rl.createElement(
          "tbody",
          null,
          j.works.map((w) => {
            const r = sh(w.plan, w.fact);
            return rl.createElement(
              "tr",
              { key: w.id, "data-work-id": w.id },
              rl.createElement("td", null, w.name),
              rl.createElement("td", { className: "pf-unit" }, w.unit),
              rl.createElement("td", { className: "pf-num" }, ad(w.plan)),
              rl.createElement("td", { className: "pf-num" }, ad(w.fact)),
              rl.createElement("td", { className: "pf-num" }, rl.createElement("span", { className: gh(r) }, hh(r)))
            );
          })
        )
      )
    )
  );
}
const Sh = `
.pf-root{padding:24px;max-width:1100px;color:var(--text-main)}
.pf-head{margin-bottom:16px}
.pf-title{font-weight:900;font-size:15px;text-transform:uppercase;letter-spacing:-.01em;margin:0}
.pf-sub{font-size:12px;color:var(--text-muted);margin-top:4px}
.pf-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;overflow-x:auto;box-shadow:var(--shadow-card)}
.pf-table{width:100%;border-collapse:collapse;font-size:13px}
.pf-table th{text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted);padding:10px 14px;border-bottom:1px solid var(--card-border);white-space:nowrap}
.pf-table td{padding:10px 14px;border-bottom:1px solid var(--card-border)}
.pf-table tbody tr:last-child td{border-bottom:0}
.pf-table tbody tr:hover{background:var(--hover-bg)}
.pf-num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.pf-unit{color:var(--text-muted);white-space:nowrap}
.pf-pct{font-weight:700}
.pf-pct--done{color:var(--color-green)}
.pf-pct--progress{color:var(--primary)}
.pf-pct--none{color:var(--text-muted)}
`, Th = "Вымышленные демо-данные P2-0002. Не реальный объект и не данные заказчика.", Eh = "Демо-объект «ЖК Пример», корпус 1", bh = [{ id: "w1", name: "Кладка наружных стен из газобетона", unit: "м³", plan: 420, fact: 315 }, { id: "w2", name: "Монолитные перекрытия", unit: "м³", plan: 860, fact: 860 }, { id: "w3", name: "Штукатурка стен механизированная", unit: "м²", plan: 5200, fact: 1820 }, { id: "w4", name: "Устройство стяжки пола", unit: "м²", plan: 3100, fact: 0 }, { id: "w5", name: "Монтаж оконных блоков ПВХ", unit: "шт.", plan: 240, fact: 96 }, { id: "w6", name: "Монтаж стояков водоснабжения", unit: "м", plan: 960, fact: 1010 }], zh = {
  _note: Th,
  project: Eh,
  works: bh
}, ed = "#/planfact", nd = "tab-planfact", fd = "planfact-style";
let Ku = null, en = null;
function _h(z) {
  if (z.getElementById(fd)) return;
  const j = z.createElement("style");
  j.id = fd, j.textContent = Sh, z.head.appendChild(j);
}
function Oh(z) {
  Ku && Nh(), _h(z.ownerDocument), en = z, Ku = dh.createRoot(z);
  const j = Ku;
  ih.flushSync(() => j.render(rl.createElement(rh, { data: zh })));
}
function Nh() {
  Ku && Ku.unmount(), Ku = null, en && en.replaceChildren(), en = null;
}
function Dh() {
  return Ku !== null;
}
function Ah() {
  let z = document.getElementById(nd);
  if (z) return z;
  z = document.createElement("div"), z.id = nd, z.className = "view-section hidden";
  const j = document.getElementById("tab-mode-placeholder");
  return j && j.parentNode ? j.parentNode.insertBefore(z, j.nextSibling) : document.body.appendChild(z), z;
}
function cd() {
  const z = Ah();
  document.querySelectorAll(".view-section").forEach((w) => w.classList.remove("active")), z.classList.add("active");
  const j = document.getElementById("main-header");
  j && (j.style.display = "none"), (en !== z || !Ku) && Oh(z);
}
async function Mh(z) {
  const j = window.AppRouter;
  j && typeof j.addRoute == "function" && (j.addRoute(ed, cd), String(location.hash || "").indexOf(ed) === 0 && cd()), z && z.shell && typeof z.shell.renderSidebar == "function" && z.shell.renderSidebar();
}
export {
  Mh as init,
  Dh as isMounted,
  Oh as mount,
  Nh as unmount
};
//# sourceMappingURL=planfact.js.map
