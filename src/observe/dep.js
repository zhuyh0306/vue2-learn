// @ts-nocheck
import { watch } from "rollup"
let id = 0
export class Dep{
    constructor() {
        this.subs = []
        this.id = id++
    }
    //收集依赖
    depend() {
        // this.subs.push(Dep.target)
        Dep.target.addDep(this)
    }
    //更新依赖
    notify() {
        this.subs.forEach((watch) => {
            watch.update()
        })
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
}
Dep.target = null
export function pushTarget(watcher) {
    Dep.target = watcher
}
export function popTarget(watcher) {
    Dep.target = null
}

export default Dep