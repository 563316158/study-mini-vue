import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  // TODO 判断vnode 是不是一个 elemnt
  // 是element 那么就应该处理 element
  // 思考题：如何区分是 element 还是 component 类型呢？

  // ShapeFlags
  // vnode -> flag
  // element
  const { shapeFlag } = vnode;
  console.log(
    vnode.type,
    shapeFlag,
    ShapeFlags.ELEMENT,
    shapeFlag & ShapeFlags.ELEMENT
  );
  console.log(
    vnode.type,
    shapeFlag,
    ShapeFlags.STATEFUL_COMPONENT, 
    shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  );
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // 去处理组件
    processComponent(vnode, container);
  }
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container);

  vnode.el = subTree.el;
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));

  // string array
  const { children,shapeFlag } = vnode;

  if (shapeFlag&ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag&ShapeFlags.ARRAY_CHILDREN) {
    // vnode
    mountChildren(vnode, el);
  }

  // props
  const { props = {} } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
