
//重写数组方法
//（1）获取原来的数组方法
let oldArrayProtoMethods = Array.prototype
//（2）继承

export let arrayMethods = Object.create(oldArrayProtoMethods)
//劫持

let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'sort',
    'reverse'
]

methods.forEach((item) => {
    arrayMethods[item] = function (...args) {

        console.log('数组劫持了',args)
        let result = oldArrayProtoMethods[item].apply(this, args)
        let inserted
        switch (item) {
            case 'push':
                inserted = args
                break
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.splice(2)
                break
        }
        const ob = this.__ob__
        if (inserted) {
            ob.observeArray(inserted)
        }
        return result
    }
})