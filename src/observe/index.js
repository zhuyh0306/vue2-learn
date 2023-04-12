import { isObject } from "../utils"
import {arrayMethods} from './arr'
export function observe(data) {
    // 判断如果不是对象,直接return
    if (!isObject(data)) {
        return data
    }
    new Observer(data)

}
// Observer类的作用：因为Object.defineProperty只能对对象的一个熟悉进行劫持，封装后可以对对象进行劫持
class Observer {
    constructor(value) {
        // 劫持数组时方便拿到Observer类上的方法
        Object.defineProperty(value, '__ob__', {
            enumerable: false,
            value: this
        })
        if (Array.isArray(value)) {
            // @ts-ignore
            value.__proto__ = arrayMethods
            this.observeArray(value)
        } else {
            this.walk(value)
        }
        
    }
    walk(value) {
        let keys = Object.keys(value);
        keys.forEach(key => {
            //对每个属性进行劫持 
            defineReactive(value,key,value[key])
        });
    }
    observeArray(value) {
        debugger
        value.forEach(item => {
            observe(item)
        });
    }
}

function defineReactive(data, key, value) {
    observe(value)
    Object.defineProperty(data,key, {
        get() {
            console.log('获取value值',data,key)
            return value
        }, 
        set(newVal) {
            if (newVal === value) return
            console.log('set')
            // 如果设置的值是对象，还要深度劫持
            observe(newVal)
            value = newVal
        }
    })
}