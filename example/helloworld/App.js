import { h } from "../../lib/study-mini-vue.esm.js";
import { Foo } from "./Foo.js";
 
window.self = null;
export const App = {
  // .vue
  // <template></template>
  // render
  name: "App",
  render() {
    // ui
    // this.$el
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown(){
          console.log("onMousedown");
        }
      },
      // "hi, " + this.msg
      // "hi,mini-vue"
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, this.msg)]
      [h("p", { class: "red" }, "hi"), h(Foo, { count: 1 })]
    );
  },

  setup() {
    // composition api

    return {
      msg: "mini-vue-1111",
    };
  },
};
