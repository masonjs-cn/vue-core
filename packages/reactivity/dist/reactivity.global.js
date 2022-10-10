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
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        return this.fn();
      } else {
        try {
          this.parent = activeEffect;
          activeEffect = this;
          return this.fn();
        } finally {
          activeEffect = void 0;
          this.parent = null;
        }
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(traget, key) {
    if (activeEffect) {
      let depMap = targetMap.get(traget);
      if (!depMap) {
        targetMap.set(traget, depMap = /* @__PURE__ */ new Map());
      }
      let deps = depMap.get(key);
      if (!deps) {
        depMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      let shouldTrack = !deps.has(activeEffect);
      if (shouldTrack) {
        deps.add(activeEffect);
        activeEffect.deps.push(deps);
      }
    }
    console.log(activeEffect, targetMap);
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value != null;
  };

  // packages/reactivity/src/baseHandler.ts
  var baseHandler = {
    get(traget, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(traget, key);
      return Reflect.get(traget, key, receiver);
    },
    set(traget, key, value, receiver) {
      return Reflect.set(traget, key, value, receiver);
    }
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
    const proxy = new Proxy(traget, baseHandler);
    reactiveMap.set(traget, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
