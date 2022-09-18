import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  const currentInstance: any = getCurrentInstance();

  if (currentInstance) {
    let { provides } = currentInstance;
    // debugger;
    const parentProvides = currentInstance.parent?.provides;

    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
  // console.log("currentInstance1:",currentInstance);
}

export function inject(key, defaultVaue) {
  // 取
  const currentInstance: any = getCurrentInstance();
  // console.log("currentInstance2:",currentInstance);
  if (currentInstance) {
    const { parent } = currentInstance;
    const parentProvides = parent.provides;
    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultVaue) {
      if (typeof defaultVaue === "function") return defaultVaue();

      return defaultVaue;
    }
  }
}
