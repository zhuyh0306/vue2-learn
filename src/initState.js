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
    //对数据进行劫持
    observe(data)

}
function initComputed(vm) {
    console.log('initComputed')
}
function initWatch(vm) {
    console.log('initWatch')
}