/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 */
import { ref, h } from "../../lib/study-mini-vue.esm.js";

const nextChildren = "nextChildren";
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

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

    return self.isChange === false
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
