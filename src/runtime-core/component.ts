import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";
import { publicInstanceProxyHandle } from "./componnentPublicInstance";

export function createComponentInstance(vnode,parent) {
  console.log("createComponentInstance:",parent);
  
  const component = {
    vnode,
    props: {},
    type: vnode.type,
    setupState: {},
    emit: () => {},
    provides: parent ? parent.provides : {},
    parent,
    slots: {},
  };

  component.emit = emit.bind(null, component);

  return component;
}

export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  // 翻译过来是有状态的组件
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  // ctx
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandle);
  // debugger;
  const { setup } = Component;

  if (setup) {
    setCurrentinstance(instance);
    // function Object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentinstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function Object
  // TODO function

  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  if (Component.render) {
    instance.render = Component.render;
  }
}

let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentinstance(instance) {
  // 写在一个函数里 方便调试 这个函数相当于一个中间层的概念
  currentInstance = instance;
}
