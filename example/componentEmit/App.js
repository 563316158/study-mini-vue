import { h } from "../../lib/study-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = {
  name: "App",
  render() {
    return h("div", {}, [
      h("p", {}, "App"),
      h(Foo, {
        // on + Event
        onAdd(a, b) {
          console.log("onAdd", a, b);
        },
        onAddFoo(a, b) {
          console.log("onAddFoo", a, b);
        },
      }),
    ]);
  },

  setup() {
    return {};
  },
};
