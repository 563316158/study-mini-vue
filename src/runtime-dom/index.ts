/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @Date: 2022-09-17 23:15:07
 * @LastEditors: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @LastEditTime: 2022-09-18 20:58:08
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

export function insert(el, container) {
  container.append(el);
}

const renderer: any = createRenderer({ createElement, patchProp, insert });

const { createApp } = renderer;
export { createApp };

// export function createApp (...args){
//     return renderer.createApp(...args);
// }

export * from "../runtime-core";
