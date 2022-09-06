import { mutableHanlders, readonlyHanlders, shallowReadonlyHandlers } from "./baseHandlers"; 

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createrActiveObject(raw, mutableHanlders);
}

export function readonly(raw) {
  return createrActiveObject(raw, readonlyHanlders);
}

export function shallowReadonly(raw) {
  return createrActiveObject(raw, shallowReadonlyHandlers);
}

export function isReactive(value){
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value){
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value){
  return isReactive(value) || isReadonly(value)
}

function createrActiveObject(raw: any, baseHandlers){
    return new Proxy(raw,baseHandlers)
}