var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        return this.fn();
      } finally {
        activeEffect = this.parent;
        this.parent = void 0;
      }
    }
  };
  function effect(fn, options) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value != null;
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(traget) {
    if (!isObject(traget)) {
      return traget;
    }
    if (traget["__v_isReactive" /* IS_REACTIVE */]) {
      return traget;
    }
    const existing = reactiveMap.get(traget);
    if (existing) {
      return existing;
    }
    const proxy = new Proxy(traget, {
      get(traget2, key, receiver) {
        console.log(key);
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        console.log("\u53EF\u4EE5\u8BB0\u5F55\u8FD9\u4E2A\u5C5E\u6027\u7528\u4E86\u90A3\u4E2A effect");
        return Reflect.get(traget2, key, receiver);
      },
      set(traget2, key, value, receiver) {
        console.log("\u8FD9\u4E2A\u53EF\u4EE5\u901A\u77E5 effect \u91CD\u65B0\u6267\u884C");
        return Reflect.set(traget2, key, value, receiver);
      }
    });
    reactiveMap.set(traget, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
