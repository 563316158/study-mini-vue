import { h, provide, inject } from "../../lib/study-mini-vue.esm.js";

export const Provider = {
  name: "Provider",
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },

  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
};

export const ProviderTwo = {
  name: "ProviderTwo",
  render() {
    return h("div", {}, [h("p", {}, `ProviderTwo - foo: ${this.foo} `), h(Consumer)]);
  },

  setup() {
    provide("foo", "fooTwo");

    const foo = inject("foo");

    return {
      foo,

    };
  },
};



const Consumer = {
  name: "Consumer",
  render() {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`);
  },

  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", ()=> "bazDefault");

    return {
      foo,
      bar,
      baz,
    };
  },
};
