import { h } from "../../lib/study-mini-vue.esm.js";

export const Foo = {
    name: "Foo",
    setup(props) {
        debugger;
        props.count  = 3;
        console.log("props:",props);

        // props 是一个readonly 
    },
    render(){
        return h("div",{ }, "foo:" + this.count)
    }
}