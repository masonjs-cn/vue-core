/*
 * @Author: Mason
 * @Date: 2023-01-20 08:58:08
 * @LastEditors: Mason
 * @LastEditTime: 2023-01-31 21:46:42
 * @FilePath: /vue-core/packages/reactivity/src/effect.ts
 */
export let activeEffect = undefined; // 当前正在执行的effect

function cleanupEffect(effect) {
  // 在收集的列表中将自己移除掉
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    // 找到set，让set移除掉自己
    deps[i].delete(effect);
  }
  effect.deps.length = 0; // 清空依赖的列表
}

export class ReactiveEffect {
  // 默认将 fn 挂载到类的实例上
  constructor(private fn) {}
  parent = undefined;
  deps = []; // 我依赖了哪些列表

  run() {
    try {
      this.parent = activeEffect;
      activeEffect = this;
      cleanupEffect(this); // 清理了上一次的依赖收集
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

// activeEffect = e1
// e2.parent = e1
/**
 * @description: 通过对象找到对应的属性 让这个属性对应的effect重新执行
 * @param {*} target
 * @param {*} key
 * @param {*} newValue
 * @param {*} oldValue
 * @return {*}
 */
export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key); // name 或者 age对应的所有effect

  const effects = [...dep];
  // 运行的是数组 删除的是set
  effects &&
    effects.forEach((effect) => {
      // 正在执行的effect ，不要多次执行
      if (effect !== activeEffect) effect.run();
    });
}
