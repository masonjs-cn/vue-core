export let activeEffect = undefined; // 当前正在执行的effect

export class ReactiveEffect {
  // 默认将 fn 挂载到类的实例上
  constructor(private fn) {}
  parent = undefined;

  run() {
    try {
      this.parent = activeEffect;
      activeEffect = this;
      return this.fn();
    } finally {
      // 执行完毕后还原activeEffect,取消当前正在运行的activeEffect
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
}

export function effect(fn) {
  // 创建一个响应式 effect，并且让 effect 执行
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

// weackmap: map
// {name:'jw' }:'name' -> [effect,effect]
//             : 'age' -> [effect]
const targetMap = new WeakMap();
export function track(target, key) {
  // 让这个对象上的属性 记录当前的 activeEffect
  if (activeEffect) {
    // 说明用户是在effect中使用的这个数据
    let depsMap = targetMap.get(target);

    // 如果没有创建一个映射表
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    // 如果有这个映射表来查找一下有没有这个属性
    let dep = depsMap.get(key);

    // 如果没有set集合创建集合
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    // 如果有则看一下set中有没有这个effect
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);

      // name = new Set(effect)
      // age = new Set(effect)

      // 我可以通过当前的effect 找到这两个集合中的自己。将其移除掉就可以了
      activeEffect.deps.push(dep);
    }
  }
}

export function trigger(traget, key, newVal) {
  // 通过对象找到对应的属性 让这个属性对应的 effect 重新执行
}

// activeEffect = e1
// e2.parent = e1
