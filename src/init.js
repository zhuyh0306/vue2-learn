import { compileToFunctions } from "./compiler/index";
import { initState } from "./initState";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options)
        const vm = this;
        vm.$options = options;
        //初始化状态
        initState(vm)
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
        if (!options.render) {
            let template = options.template
            if (!template&&el) {
                el = el.outerHTML
                // console.log(el)
                //转换成ast语法树
                let ast = compileToFunctions(el)
            }
        }
    }
}