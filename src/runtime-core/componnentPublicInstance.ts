import { hasOwn } from "../shared/index";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const publicInstanceProxyHandle = {
  get({ _: instance }, key) {
    // setupState

    const { setupState, props } = instance;

    if (hasOwn(props, key)) {
      return props[key];
    } else if (hasOwn(setupState, key)) {
      return setupState[key];
    }

    const publicPropertie = publicPropertiesMap[key];
    if (publicPropertie) {
      return publicPropertie(instance);
    }
  },
};
