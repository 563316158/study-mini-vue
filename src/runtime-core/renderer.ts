import { EMPTY_OBJ, isOn } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp";
import { effect } from "../reactivity/effect";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementRext: hostSetElementRext,
  } = options;

  function render(vnode, container) {
    // patch
    patch(null, vnode, container, null);
  }

  function patch(n1, n2: any, container: any, parentComponent) {
    // TODO 判断vnode 是不是一个 elemnt
    // 是element 那么就应该处理 element
    // 思考题：如何区分是 element 还是 component 类型呢？

    // ShapeFlags
    // vnode -> flag
    // element
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 去处理组件
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container,parentComponent);
    }
  }

  function patchElement(n1, n2, container,parentComponent) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const el = (n2.el = n1.el);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    patchChildren(n1,n2,el,parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1,n2,container,parentComponent){
    const prevShapeFlage = n1.shapeFlag; 
    const c1 = n1.children;
    const { shapeFlag } = n2;
    const c2 = n2.children

    // Array to Text
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      if(prevShapeFlage & ShapeFlags.ARRAY_CHILDREN){
        // 1、把老的 children 清空
        unmountChilren(n1.children);
        // 2、设置新的 text
        hostSetElementRext(container,c2);
      }
    }
    // Text to Text  
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      if(prevShapeFlage & ShapeFlags.TEXT_CHILDREN){
        if(c2 !== c1){
          hostSetElementRext(container,c2);
        }
      }
    }
    // Text to Array
    if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
      if(prevShapeFlage & ShapeFlags.TEXT_CHILDREN){
        if(c2 !== n1.children){
          // 1、把老的 Text 清空
          hostSetElementRext(container,'');
          // 2、设置新的 Array
          mountChildren(n2,container,parentComponent)
        }
      }
    }
  }

  function unmountChilren(children){
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }

  function setupRenderEffect(instance, inititalVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log(subTree);

        patch(null, subTree, container, instance);
        inititalVnode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        patch(prevSubTree, subTree, container, instance);

        instance.subTree = subTree;
      }
    });
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    // canvas
    // new Element()
    const el = (vnode.el = hostCreateElement(vnode.type));

    // string array
    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // vnode
      mountChildren(vnode, el, parentComponent);
    }

    // props
    const { props = {} } = vnode;
    for (const key in props) {
      const val = props[key];
      // const isOn = (key) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase();
      //   el.addEventListener(event, val);
      // } else {
      //   el.setAttribute(key, val);
      // }
      hostPatchProp(el, key, null, val);
    }

    // container.append(el);
    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
