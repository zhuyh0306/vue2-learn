// @ts-nocheck
export function isObject(obj) {
    //判断是否是对象
    return obj !== null && typeof obj === 'object'
}


let callback = []
let pedding = false
let timerFunc
function flush() {
    callback.forEach((cb) => {
        cb()
    })
    pedding= false

}
if (Promise) {
    timerFunc = ()=>Promise.resolve().then(flush)
} else if (MutationObserver) {
    let observe = new MutationObserver(flush)
    let text = document.createTextNode('1')
    observe.observe(text, { characterData: true })
    timerFunc = () => {
        text.textContent = '2'
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flush)
    }
}
export function nextTick(cb){
    // console.log(cb)
    callback.push(cb)
    // 列队
    if (!pedding) {
        timerFunc()
        pedding = true
    }
}