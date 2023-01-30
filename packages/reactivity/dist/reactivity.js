// packages/reactivity/src/effect.ts
var activeEffect = void 0;
var ReactiveEffect = class {
  constructor(fn) {
    this.fn = fn;
    this.parent = void 0;
  }
  run() {
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
function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
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
    let oldValue = traget[key];
    const r = Reflect.set(traget, key, value, receiver);
    if (oldValue !== value) {
      trigger(traget, key, value);
    }
    return r;
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
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
