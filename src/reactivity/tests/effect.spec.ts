import { effect ,stop} from "../effect";
import { reactive } from "../reactive";

describe("effect",()=>{
    it("happy path",()=>{
        const user = reactive({
            age: 10,
        });

        let nextAge;
        effect(()=>{
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);

        //update
        user.age++;
        expect(nextAge).toBe(12);
    })

    it("should return runner when call effect",()=>{
        //1.effect(fn) -> function runner() -> fn -> return
        let foo = 10;
        const runner = effect(()=>{
            foo++;
            return "foo";
        });

        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    })

    it("scheduler",()=>{
        // 1. 通过 effect 的第二个参数给定的 一个 scheduler 的 fn
        // 2. effect 第一次执行的时候 还会执行 fn
        // 3. 当 响应式对象 set update 不会执行 fn 而是执行 scheduler
        // 4. 如果说当执行 runner 的时候，会再次执行 fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1});
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        // 断言 scheduler 没有被调用
        expect(scheduler).not.toHaveBeenCalled();

        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo ++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        // should not run yet 
        expect(dummy).toBe(1);
        // manually run 
        run();
        // should have run
        expect(dummy).toBe(2);
    })

    it("stop",()=>{
        let dummy;
        const obj = reactive({ prop: 1});
        const runner = effect(()=>{
            // dummy = 2; 没有触发 get 报错
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner); // 底层是删除 删除 
        // obj.prop = 3;
        obj.prop ++ ; // 这样 感觉有bug的因为这样会触发get 然后触发 track 依赖再次被收集  
        expect(dummy).toBe(2);
    })

    it("onStop",()=>{
        const obj = reactive({
            foo: 1,
        })
        const onStop = jest.fn();
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {
                onStop,
            }
        )
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})