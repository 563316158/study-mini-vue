export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};

// 检查是不是事件
export const isOn = (key) => /^on[A-Z]/.test(key);

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

export const camelize = (str: string) => {
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

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
