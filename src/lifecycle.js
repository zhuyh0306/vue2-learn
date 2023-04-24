import { patch } from "./node/patch";
import watcher from "./observe/watch";

export function mountComponent(vm, el) {
    callHook(vm, 'beforeMount')
    let updateComponent = () => {
        vm._update(vm._render())
    }
    new watcher (vm,updateComponent,()=>{
        callHook(vm,'updated')
    },true)
    callHook(vm,'mounted')

}

export function lefecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // console.log(vnode)
        let vm = this;

        vm.$el = patch(vm.$el, vnode)
    }
}

export function callHook(vm,hook) {
    let handles = vm.$options[hook]
    if (handles) {
        handles.forEach(element => {
            element.call(this)
         });
     }
}