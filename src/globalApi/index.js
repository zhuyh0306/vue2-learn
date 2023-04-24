var LIFECYCLE_HOOKS = [
    'beforeCreate',  //  生命周期 开始实例化 vue 指令
    'created',       //生命周期   结束实例化完 vue 指令
    'beforeMount',  //生命周期 开始渲染虚拟dom ，挂载event 事件 指令
    'mounted',      //生命周期  渲染虚拟dom ，挂载event 事件 完 指令
    'beforeUpdate',  //生命周期  开始更新wiew 数据指令
    'updated',       //生命周期  结束更新wiew 数据指令
    'beforeDestroy', //生命周期  开始销毁 new 实例 指令
    'destroyed',     //生命周期  结束销毁 new 实例 指令
    'activated',   //keep-alive组件激活时调用。
    'deactivated',  //deactivated keep-alive组件停用时调用。
    'errorCaptured'  // 具有此钩子的组件捕获其子组件树（不包括其自身）中的所有错误（不包括在异步回调中调用的那些）。
];

let start = {}

start.data = function (parent, child) {
    return child
}
start.computed =function(){}
// start.watch =function(){}
start.methods =function(){}
LIFECYCLE_HOOKS.forEach((hooks) => {
    start[hooks]= mergeHook
})
function mergeHook(parent, child) {
    // console.log(parent,child)
    if (child) {
        if (parent) {
             return parent.concat(child)
        } else {
            return [child]
         }
    } else {
        return parent
     }
}

export function initGlobalApi(Vue) {
    Vue.options = {}
        
    Vue.Mixin = function (mixin) {
        // console.log(this.options)
        Vue.options= mergeOptions(this.options,mixin)
    }
}

export function mergeOptions(parent={},child) {
    // console.log(parent, child)
    const options = {}
    ///如果有父亲，没儿子
    for (let key in parent) {
        mergeField(key)
    }
    //如果有儿子没父亲
    for (let key in child) {
        mergeField(key)

    }
    function mergeField(key) {
        if (start[key]) {
            options[key] = start[key](parent[key],child[key])
        } else {
            options[key]= child[key]
        }
        // console.log(options)
        // return options
    }
    return options
}

