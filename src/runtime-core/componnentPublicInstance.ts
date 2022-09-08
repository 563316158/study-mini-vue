const publicPropertiesMap = {
    
};


export const publicInstanceProxyHandle = {
    get({_:instance},key) {
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