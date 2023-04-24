import { initGlobalApi } from './globalApi/index'
import {initMixin} from './init' 
import { initWatch, stateMixin } from './initState'
import { lefecycleMixin } from './lifecycle'
import { renderMixin } from './node/index'
function Vue(options) {

//初始化  
 this._init(options)
}
initMixin(Vue) 
lefecycleMixin(Vue)
renderMixin(Vue)
initGlobalApi(Vue)
stateMixin(Vue)
export default Vue
