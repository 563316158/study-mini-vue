import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  // TODO 判断vnode 是不是一个 elemnt
  // 是element 那么就应该处理 element
  // 思考题：如何区分是 element 还是 component 类型呢？
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
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
  setupRenderEffect(instance, vnode,container);
}

function setupRenderEffect(instance, vnode,container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  console.log('subTree1:',subTree);

  
  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container);

  console.log('subTree2:',subTree.el);
  vnode.el = subTree.el;
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));
  console.log("vnode",vnode);

  // string array
  const { children } = vnode;

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
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


