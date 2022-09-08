import { h } from "../../lib/study-mini-vue.esm.js";

window.self = null;
export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    // ui
    // this.$el
    window.self = this;
    return h(
      "div",
      { id: "root", class: ["red", "hard"] },
      // "hi, " + this.msg
      // "hi,mini-vue"
      [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, this.msg)]
    );
  },

  setup() {
    // composition api

    return {
      msg: "mini-vue-1111",
    };
  },
};
