const Fragment = Symbol('Fragment');
const Text = Symbol("Text");
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    // children
    if (typeof children === "string") {
        // vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN;
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    //组件 + children object
    if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ShapeFlags.ELEMENT */
        : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    debugger;
    const slot = slots[name];
    console.log("slot:", slot(props));
    if (slot) {
        if (typeof slot === "function") {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @Date: 2022-09-03 17:23:34
 * @LastEditors: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @LastEditTime: 2022-09-18 21:27:12
 * @FilePath: /GUI-MINI-VUE/src/shared/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === "object";
};
const hasChanged = (val, newVal) => {
    return !Object.is(val, newVal);
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    // debugger;
    /**
     * 假如 replace() 方法的第一个参数是一个RegExp 对象，则代表第 n 个括号匹配的字符串。
     * 对应于上述的$1，$2 等。）例如，如果是用 /(\a+)(\b+)/ 这个来匹配，
     * p1 就是匹配的 \a+，p2 就是匹配的 \b+。
     */
    return str.replace(/-(\w)/g, (_, c, offset, string) => {
        console.log("replace:", _, c, offset, string);
        return c.toUpperCase();
    });
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};
const EMPTY_OBJ = {};

let activeEffect;
let shouldTrack;
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.scheduler = scheduler;
        this.deps = [];
        this.active = true;
        this._fn = fn;
    }
    run() {
        //1. 会收集依赖
        // shouldTrack 来做区分
        if (!this.active) {
            // 是stop状态 直接调用 不收集依赖
            return this._fn();
        }
        // 不是stop状态 打开shouldTrack
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false; //收集完依赖 关闭
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
const targetMap = new Map();
function track(target, key) {
    if (!isTracking())
        return;
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    if (dep.has(activeEffect))
        return; //如果有就不需要添加
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    let dep = depsMap.get(key);
    if (!dep)
        return;
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
function effect(fn, options = {}) {
    //fn
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // options
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key) {
        console.log(key);
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
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
        console.log("set:", res);
        //TODO 触发依赖
        trigger(target, key);
        return res;
    };
}
const mutableHanlders = {
    get,
    set,
};
const readonlyHanlders = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} can not set,Becanse ${JSON.stringify(target)} is readonly`);
        // console.log(`key:${key} can not set,Becanse ${target} is readonly`);
        return true;
    },
};
const shallowReadonlyHandlers = extend({}, readonlyHanlders, {
    get: shallowReadonlyGet,
});

function reactive(raw) {
    return createrActiveObject(raw, mutableHanlders);
}
function readonly(raw) {
    return createrActiveObject(raw, readonlyHanlders);
}
function shallowReadonly(raw) {
    return createrActiveObject(raw, shallowReadonlyHandlers);
}
function createrActiveObject(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.warn(`target ${raw} 必须是一个对象`);
        return;
    }
    return new Proxy(raw, baseHandlers);
}

// 1 true "1"
// get set
// proxy -> object
// {} -> value get set
class RefImpl {
    constructor(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看 value 是不是 对象
        this.dep = new Set();
    }
    get value() {
        // debugger;
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        // 一定先去修改了 value 的
        // newValue -> this._value
        // hasChanged
        // 对比的时候 object
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    return !!ref.__v_isRef;
}
function unRef(ref) {
    // 看看是不是 ref -> ref.value
    // ref
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    // get set
    return new Proxy(objectWithRefs, {
        get(target, key) {
            // get -> age(ref) 那么就给他返回 .value
            // not ref -> value
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            // set -> ref .value
            if (isRef(target[key]) && !isRef(value)) {
                // return (target[key].value = value);
                return Reflect.set(target[key], 'value', value);
            }
            else {
                return Reflect.set(target, key, value);
            }
        },
    });
}

const emit = (instance, event, ...args) => {
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const hanlder = props[handlerName];
    hanlder && hanlder(...args);
};

const initProps = (instance, rawProps) => {
    //attrs
    // props
    instance.props = rawProps || {};
    return instance;
};

function initSlots(instance, children) {
    // slots
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};
const publicInstanceProxyHandle = {
    get({ _: instance }, key) {
        // setupState
        const { setupState, props } = instance;
        if (hasOwn(props, key)) {
            return props[key];
        }
        else if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        const publicPropertie = publicPropertiesMap[key];
        if (publicPropertie) {
            return publicPropertie(instance);
        }
    },
};

function createComponentInstance(vnode, parent) {
    console.log("createComponentInstance:", parent);
    const component = {
        vnode,
        props: {},
        type: vnode.type,
        setupState: {},
        emit: () => { },
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        slots: {},
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    // 翻译过来是有状态的组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
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
function handleSetupResult(instance, setupResult) {
    // function Object
    // TODO function
    if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentinstance(instance) {
    // 写在一个函数里 方便调试 这个函数相当于一个中间层的概念
    currentInstance = instance;
}

function provide(key, value) {
    var _a;
    // 存
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        // debugger;
        const parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
    // console.log("currentInstance1:",currentInstance);
}
function inject(key, defaultVaue) {
    // 取
    const currentInstance = getCurrentInstance();
    // console.log("currentInstance2:",currentInstance);
    if (currentInstance) {
        const { parent } = currentInstance;
        const parentProvides = parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultVaue) {
            if (typeof defaultVaue === "function")
                return defaultVaue();
            return defaultVaue;
        }
    }
}

function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 先 vnode
                // component -> vnode
                // 所有的逻辑操作 都会基于 vnode 做处理
                const vnode = createVNode(rootComponent);
                console.log(vnode);
                render(vnode, rootContainer);
            },
        };
    };
}

function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, } = options;
    function render(vnode, container) {
        // patch
        patch(null, vnode, container, null);
    }
    function patch(n1, n2, container, parentComponent) {
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
                if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                    processElement(n1, n2, container, parentComponent);
                }
                else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                    // 去处理组件
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    }
    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2, container, parentComponent);
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function processElement(n1, n2, container, parentComponent) {
        if (!n1) {
            mountElement(n2, container, parentComponent);
        }
        else {
            patchElement(n1, n2);
        }
    }
    function patchElement(n1, n2, container) {
        console.log("patchElement");
        console.log("n1", n1);
        console.log("n2", n2);
        const el = (n2.el = n1.el);
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        patchProps(el, oldProps, newProps);
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
    function mountComponent(initialVnode, container, parentComponent) {
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
            }
            else {
                console.log("update");
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                patch(prevSubTree, subTree, container, instance);
                instance.subTree = subTree;
            }
        });
    }
    function mountElement(vnode, container, parentComponent) {
        // canvas
        // new Element()
        const el = (vnode.el = hostCreateElement(vnode.type));
        // string array
        const { children, shapeFlag } = vnode;
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
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

/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @Date: 2022-09-17 23:15:07
 * @LastEditors: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 * @LastEditTime: 2022-09-18 20:58:08
 * @FilePath: /GUI-MINI-VUE/src/runtime-dom/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    }
    else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextVal);
        }
    }
}
function insert(el, container) {
    container.append(el);
}
const renderer = createRenderer({ createElement, patchProp, insert });
const { createApp } = renderer;

export { createApp, createElement, createRenderer, createTextVNode, getCurrentInstance, h, inject, insert, patchProp, provide, proxyRefs, ref, renderSlots };
