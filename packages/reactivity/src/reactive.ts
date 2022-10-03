import { isObject } from "@vue/shared";

const reactiveMap = new WeakMap(); // 必须是对象，弱引用
// v8的垃圾回收机制 标记删除 引用计数
const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 标记一个响应式对象
}

export function reactive(traget) {
  if (!isObject(traget)) {
    return traget;
  }

  // es6 中的 proxy
  // 加入标识
  if (traget[ReactiveFlags.IS_REACTIVE]) {
    return traget;
  }

  const existing = reactiveMap.get(traget);
  // 是否存在过
  if (existing) {
    return existing;
  }

  const proxy = new Proxy(traget, {
    // 目标对象，被获取的属性名，Proxy 或者继承 Proxy 的对象
    get(traget, key, receiver) {
      console.log(key);
      if (key === ReactiveFlags.IS_REACTIVE) {
        // 如果已经代理过了就直接返回，不再代理了
        return true;
      }
      console.log("可以记录这个属性用了那个 effect");
      return Reflect.get(traget, key, receiver);
    },
    set(traget, key, value, receiver) {
      console.log("这个可以通知 effect 重新执行");
      return Reflect.set(traget, key, value, receiver);
    },
  });

  reactiveMap.set(traget, proxy);
  return proxy;
}

// 问题 1 如果出现 get 数据劫持
// let preson = {
//   name: "zf",
//   get allName() {
//     return this.name + "all";
//   },
// };
// 使用 proxy 要搭配 Reflect 来使用

// 问题 2 如果两个 obj 导入
// const state1 = reactive(obj)
// const state2 = reactive(state1)
// 一个对象已经被代理过了，就不要再次代理
