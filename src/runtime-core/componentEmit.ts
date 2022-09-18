import { camelize, toHandlerKey } from "../shared/index";

export const emit: any = (instance, event, ...args) => {

  const { props } = instance;

  const handlerName = toHandlerKey(camelize(event));

  const hanlder = props[handlerName];

  hanlder && hanlder(...args);
};
