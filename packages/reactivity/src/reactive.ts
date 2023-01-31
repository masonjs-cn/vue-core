import { isObject } from "@vue/shared";
// 获取effect的实例
import { ReactiveFlags, baseHandler } from "./baseHandler";

const reactiveMap = new WeakMap(); // 必须是对象，弱引用

/**
 * @description: 响应式 reactive
 * @param {*} traget 目标对象
 * @return {*}
 */
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

  // 将绑定的方法拆分至 baseHandler
  const proxy = new Proxy(traget, baseHandler);
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
