export let activeEffect = undefined; // 当前正在执行的effect

class ReactiveEffect {
  public active = true; // 激活状态
  public parent = null; // 父类
  public deps = []; // effect 中用了哪些属性，后续清理的时候要使用
  constructor(public fn) {} // 等价于 this.fn = fn
  // 依赖收集 让熟悉和 effect 产生关系
  run() {
    // 如果没有激活
    if (!this.active) {
      return this.fn();
    } else {
      try {
        // 每次执行就接受 this
        this.parent = activeEffect;
        activeEffect = this;
        //  去 proyx对象取值,取至的时候,要让这个熟悉 和当前的 effect函数关联起来,稍后数据变化了,可以重新执行 effect 函数
        return this.fn();
      } finally {
        // 执行完毕后还原activeEffect,取消当前正在运行的activeEffect
        activeEffect = undefined;
        this.parent = null;
      }
    }
  }
}

export function effect(fn) {
  // 将用户传递的函数编程响应式的 effect
  const _effect = new ReactiveEffect(fn); // 创建响应式effect
  _effect.run(); // 让响应式effect默认执行
}

// 哪个对象中的那个 属性 对应的那一个 effect
// 一个属性对应多个 effect
// 外层用一个 map {object:{name:[effect,effect],age:[effect,effect]}}

// 将属性和对应的effect维护成映射关系，后续属性变化可以触发对应的effect函数重新run

const targetMap = new WeakMap(); // 记录依赖关系

// 让数据记录所在的effect 是谁 ，哪个 effect 对应了哪些属性
export function track(traget, key) {
  if (activeEffect) {
    // 如果有个activeEffect的实例，才做依赖收集
    let depMap = targetMap.get(traget); // {对象：map}
    if (!depMap) {
      // 如果没有对象属性，就创建一个
      targetMap.set(traget, (depMap = new Map()));
    }

    // 获取属性
    let deps = depMap.get(key);
    if (!deps) {
      depMap.set(key, (deps = new Set())); // {对象：{ 属性 :[ dep, dep ]}}
    }

    // 获取属性的指向
    let shouldTrack = !deps.has(activeEffect); // 是否需要收集
    if (shouldTrack) {
      deps.add(activeEffect); // 将指向放入
      activeEffect.deps.push(deps); // 让effect记住dep，这样后续可以用于清理
    }
  }
  console.log(activeEffect, targetMap);
  // console.log(traget, key, activeEffect);
}

/*
activeEffect = e1

effect(()=>{ // e1
    state.name; // name = e1
    effect(()=>{ // e2
      state.age; // name = e2
    })
    如果执行的话，就会全局记录之后，释放
    state.address; // address = undefined
})

*/

/*
如何解决释放的问题?

activeEffect = e1

effect(()=>{ // e1  e1.parent = null 
    state.name; // name = e1
    effect(()=>{ // e2  e2.parent = e1
      state.age; // name = e2
    })

    // 执行之后呢，把父节点还原
    activeEffect = e2.parent
    state.address; // address = e1
})
*/
