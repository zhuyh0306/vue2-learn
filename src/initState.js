import { observe} from "./observe/index"
import watcher from "./observe/watch"
import { nextTick } from "./utils"

export function initState(vm) {
    let opt = vm.$options
    // console.log(opt)
    if (opt.props) {
        initProps(vm)
    }
    if (opt.methods) {
        initMethods(vm)
    }
    if (opt.data) {
        initData(vm)
    }
    if (opt.computed) {
        initComputed(vm)
    }
    if (opt.watch) { 
        initWatch(vm)
    }
}
function initProps(vm) {
    console.log('initProps')
}

function initMethods(vm) {
    console.log('initMethods')
    
}
/**
 * 初始化data
 */
function initData(vm) {

    // console.log('initData')
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data
    vm._data = data
    // 将data 上的属性代理到实例上 vm.mes = vm._data.mes
    for (let key in data) {
        proxy(vm,'_data',key)
    }
    //对数据进行劫持
    observe(data)

}
 // 将data 上的属性代理到实例上 vm.mes = vm._data.mes
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}
 
function initComputed(vm) {
    // console.log('initComputed')
}
export function initWatch(vm) {
    let watch = vm.$options.watch
    console.log(watch, '-----------')
    
    for (let key in watch) {
        let handle = watch[key]
        if (Array.isArray(handle)){
            handle.forEach((v) =>{
                createWatcher(vm,key,v)
            })
        } else {
            //对象，字符串，函数
            createWatcher(vm,key,handle)
        }
    }
    // console.log('initWatch')
}

function createWatcher(vm, exprOrfn, handler, options) {
    
    if (typeof handler === 'object') {
        options = handler;
        handler =handler.handle
    }

    if (typeof handler === 'string') {
        handler = vm.methods[handler]
    }

    return vm.$watch(vm, exprOrfn, handler, options)
}


export function stateMixin(vm) {
    //列队：1 vue自己的nextTick   2用户自己的回调
    vm.prototype.$nextTick = function (cb) {
        // console.log(cb)
        nextTick(cb)
    } 
    vm.prototype.$watch = function (vm, exprOrfn, handler, options) {
        console.log(vm, exprOrfn, handler, options)
        let watch = new watcher(vm, exprOrfn, handler, { ...options,user:true })
        if (options.immediate) {
            handler.call(vm)
        }
    } 
}