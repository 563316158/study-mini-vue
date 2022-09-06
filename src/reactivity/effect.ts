import { extend } from "../shared";

let activeEffect;
let shouldTrack;

export class ReactiveEffect {
  private _fn: any;
  public deps: any = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    //1. 会收集依赖
    // shouldTrack 来做区分

    if (!this.active) {
      // 是stop状态 直接调用 不收集依赖
      return this._fn();
    }

    // 不是stop状态 打开shouldTrack
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();

    shouldTrack = false; //收集完依赖 关闭

    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
}

export function trackEffects(dep){
    if (dep.has(activeEffect)) return; //如果有就不需要添加
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if(!depsMap) return;
  let dep = depsMap.get(key);
  if(!dep) return;
  triggerEffects(dep);
}

export function triggerEffects(dep){
    for (const effect of dep) {
        if (effect.scheduler) {
          effect.scheduler();
        } else {
          effect.run();
        }
      }
}
 
export function effect(fn, options: any = {}) {
  //fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // options
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
