
export function createComponentInstance(vnode){

    const component = {
        vnode,
        type:vnode.type,
        setupState: {},
    }

    return component;
}

export function setupComponent(instance){
    // TODO
    // initProps()
    // initSlots()

    // 翻译过来是有状态的组件
    setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type;

    // ctx
    instance.proxy = new Proxy(
        {_:instance},
        {
            get(target,key) {
                debugger;
                // setupState
                const { setupState } = instance;
                if(key in setupState){
                    return setupState[key];
                }
                if(key === "$el"){
                    return instance.vnode.el
                }
            },
        }
    )

    const { setup } = Component;

    if(setup){
        // function Object
        const setupResult = setup();

        handleSetupResult(instance,setupResult);
    }
}
function handleSetupResult(instance,setupResult: any) {
    // function Object
    // TODO function

    if(typeof setupResult === "object"){
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
   
    const Component = instance.type;

    if(Component.render) {
        instance.render = Component.render;
    }
}

