import { nextTick } from "../utils";
import { popTarget, pushTarget } from "./dep";

let id=0
class watcher {
    constructor(vm, updateComponent, cb, options) {
        this.vm = vm;
        this.exprOrfn = updateComponent;
        this.cb = cb;
        this.options = options
        if (typeof updateComponent === 'function') {
            this.getter = updateComponent
        } else {
            this.getter = function () {
                let path = updateComponent.split('.')
                let obj = vm;
                path.forEach((v) => {
                    obj = obj[v]
                })
                console.log(obj, '-----00000')
                return obj
            }
        }
        this.id = id++
        this.deps = []
        this.depsId = new Set()
        //更新视图
       this.value= this.get()
    }
    addDep(dep) { 
     //去重
        let id = dep.id  
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    run() {

        let value = this.get()
        let oldValue = this.value  
        this.value = value

//执行用户的watch
        if (this.options.user) {
            this.cb.call(this.vm,value,oldValue)
        }

    }
    get() { 
        // console.log(this,'----------∂∂')
        pushTarget(this)
        let value =this.getter()
        popTarget()
        return value
    }
    update() {
        // console.log('调用update方法')
        // this.getter()
        queueWatcher(this)
    }
}

let queue =[]//将需要更新的数据存到一个列队中
let has = {}
let pending = false

function flushWatcher() {
    queue.forEach((wat) => {
        wat.run()
    })
    queue =[]//将需要更新的数据存到一个列队中
    has = {}
    pending =false
}
function queueWatcher(watcher) {
    let id = watcher.id;
    if (has[id] == null) {
        queue.push(watcher)
        has[id] = true
        if (!pending) {
            nextTick(flushWatcher)
        }
        pending =true
    }

}
export default watcher


// vue中更新组将的策略是给每个组件添加一个watcher，属性变化后调用watcher