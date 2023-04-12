import { observe} from "./observe/index"

export function initState(vm) {
    let opt = vm.$options
    console.log(opt)
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

    console.log('initData')
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
    console.log('initComputed')
}
function initWatch(vm) {
    console.log('initWatch')
}