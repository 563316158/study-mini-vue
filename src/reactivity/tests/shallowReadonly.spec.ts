import { isReadonly, shallowReadonly } from "../reactive"

describe("shallowReadonly",()=>{
    test("should not make non-reactive properties reactive",() => {
        const props = shallowReadonly({n: { foo: 1 }});
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.n)).toBe(false);
    })

    it("shallowReadonly warn then call set",() => {
        // console.warn()
        // mock
        console.warn = jest.fn();
        // console.log = jest.fn();

        const user = shallowReadonly({
            age: 10,
        });

        user.age = 11;

        expect(console.warn).toBeCalled();
        expect(user.age).toBe(10);
    })
})