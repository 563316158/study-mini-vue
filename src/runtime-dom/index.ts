/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @Date: 2022-09-17 23:15:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-24 14:52:10
 * @FilePath: /GUI-MINI-VUE/src/runtime-dom/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRenderer } from "../runtime-core";

export function createElement(type) {
  return document.createElement(type);
}

export function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

export function insert(child, container,anchor = null) {
  // container.append(child);
  container.insertBefore(child,anchor)
}
 
export function remove(child){
  const parent = child.parentNode;
  if(parent){
    parent.removeChild(child);
  }
}

export function setElementRext(el,text){
  el.textContent = text
}

const renderer: any = createRenderer({ createElement, patchProp, insert ,remove ,setElementRext});

const { createApp } = renderer;
export { createApp };

// export function createApp (...args){
//     return renderer.createApp(...args);
// }

export * from "../runtime-core";
