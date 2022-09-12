import { h, renderSlots } from "../../lib/study-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup(props, { emit }) {},
  render() {
    const foo = h("p", {}, "foo");

    // Foo .vnode. children
    console.log("this.$slots:", this.$slots);
    // children -> vnode
    //
    // renderSlots
    // 1. 获取到要渲染的元素 1
    // 2. 要获取到渲染的位置
    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, "header",{age}),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
