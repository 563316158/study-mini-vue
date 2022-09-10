export const emit: any = (instance, event, ...args) => {
  console.log("emit event", instance, event);

  const { props } = instance;

  const camelize = (str: string) => {
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
  const toHandlerKey = (str: string) => {
    return str ? "on" + capitalize(str) : "";
  };

  const handlerName = toHandlerKey(camelize(event));

  const hanlder = props[handlerName];

  hanlder && hanlder(...args);
};
