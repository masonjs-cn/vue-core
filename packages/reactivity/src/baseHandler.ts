/*
 * @Author: Mason
 * @Date: 2023-01-20 08:58:08
 * @LastEditors: Mason
 * @LastEditTime: 2023-01-31 21:53:50
 * @FilePath: /vue-core/packages/reactivity/src/baseHandler.ts
 */
import { track, trigger } from "./effect";
// v8的垃圾回收机制 标记删除 引用计数
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 标记一个响应式对象
}

export const baseHandler = {
  // 目标对象，被获取的属性名，Proxy 或者继承 Proxy 的对象
  get(traget, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      // 如果已经代理过了就直接返回，不再代理了
      return true;
    }

    // 做依赖收集 记录属性和当前 effect 的关系
    // 让当前的 key 和 effect 关联起来
    // 属性变了，希望重新执行渲染
    track(traget, key);

    // console.log("可以记录这个属性用了那个 effect");
    // console.log(activeEffect);
    return Reflect.get(traget, key, receiver);
  },
  set(traget, key, value, receiver) {
    let oldValue = traget[key];

    // console.log("这个可以通知 effect 重新执行");
    const r = Reflect.set(traget, key, value, receiver);

    if (oldValue !== value) {
      trigger(traget, key, value, oldValue);
    }

    return r;
  },
};
