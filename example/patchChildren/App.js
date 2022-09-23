/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 */
/*
 * @Author: Jerry.Qin 秦利杰 jerry.qin@youniverse.cc
 */
import { h, ref } from "../../lib/study-mini-vue.esm.js";

import ArrayToText from "./ArrayToText.js"
import TextToText from "./TextToText.js"
import TextToArray from "./TextToArray.js"

export const App = {
  name: "App",
  setup() {},
  render() {
    return h(
      "div",
      {
        tId: 1,
      },
      [
        h("p", {}, "主页"),
        // h(ArrayToText),
        h(TextToText),
        // h(TextToArray),

      ]
    );
  },
};
