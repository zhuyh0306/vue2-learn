export function renderMixin(Vue) {
    Vue.prototype._c = function () {
        return createElement(...arguments)
    }
    Vue.prototype._v = function (text) {
        return createText(text)
    }
    Vue.prototype._s = function (val) {
        return val===null?'':(typeof val==='object')? JSON.stringify(val):val
    }
    Vue.prototype._render = function () {
        let vm = this
        let render = vm.$options.render
        let vnode = render.call(this)
        // console.log(vnode)
        return vnode
    }
}

function createElement(tag,data={},...children) {
    return vnode(tag,data,undefined,children,undefined )
}
function vnode(tag,data,key,children,text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}
function createText(text) {
    return vnode(undefined,undefined,undefined,undefined,text )
}