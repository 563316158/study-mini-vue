import { ref, h } from "../../lib/study-mini-vue.esm.js";

const prevChildren = "oldChild";
const nextChildren = "newChild";

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
