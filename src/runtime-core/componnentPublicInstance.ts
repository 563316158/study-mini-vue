const publicPropertiesMap = {
    '$el': (i) => i.vnode.el,
};


export const publicInstanceProxyHandle = {
    get({_:instance},key) {
        // setupState
        const { setupState } = instance;
        if(key in setupState){
            return setupState[key];
        }

       const publicPropertie = publicPropertiesMap[key]
        if(publicPropertie){
            return publicPropertie(instance);
        }
    },
}