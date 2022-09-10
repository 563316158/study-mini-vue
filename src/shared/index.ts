export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};

// 检查是不是事件
export const isOn = (key) => /^on[A-Z]/.test(key); 

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val,key);