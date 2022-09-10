import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    console.log(key);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (isShallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      // TODO 依赖收集
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    console.log("set:",res);
    //TODO 触发依赖
    trigger(target, key);
    return res;
  };
}

export const mutableHanlders = {
  get,
  set,
};

export const readonlyHanlders = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} can not set,Becanse ${JSON.stringify(target)} is readonly`);
    // console.log(`key:${key} can not set,Becanse ${target} is readonly`);
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHanlders, {
  get: shallowReadonlyGet,
});
