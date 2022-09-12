import { createVNode, Fragment } from "../vnode";

export function renderSlots(slots, name, props) {
  debugger;
  const slot = slots[name];
  console.log("slot:", slot(props));

  if (slot) {
    if (typeof slot === "function") {

      return createVNode(Fragment, {}, slot(props));
    }
  }
}
