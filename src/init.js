import { compileToFunctions } from "./compiler/index";
import { mergeOptions } from "./globalApi/index";
import { initState } from "./initState";
import { callHook, mountComponent } from "./lifecycle";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options)
        const vm = this;
        vm.$options = mergeOptions(Vue.options, options);
        console.log(vm.$options,'000000000')
        callHook(vm,'beforeCreate')
        //初始化状态
        initState(vm)
        callHook(vm,'created')
        
        //渲染模版
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {  
        const vm = this;
        // console.log(el,'el')
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if (!options.render) {
            let template = options.template
            if (!template&&el) {
                el = el.outerHTML
                // console.log(el)
                //转换成ast语法树
                let render = compileToFunctions(el)
                console.log(render)
                // 将render函数变成vnode ， vnode变成真实dom
                options.render = render
                 render.call(this)
            }
        }
mountComponent(vm,el )
    }
}