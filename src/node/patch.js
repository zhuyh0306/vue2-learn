export function patch(oldNode, vnode) {
    // console.log(oldNode, vnode)
    //将vnode变成真实dom
    let el = createEl(vnode)
    // console.log(el)
//替换  获取父节点，插入  删除old
    let parentNode = oldNode.parentNode
    parentNode.insertBefore(el, oldNode.nextsibling)
    parentNode.removeChild(oldNode)
    return el
}

function createEl(vnode) {
    let { tag, children, data, key, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        if (children && children.length > 0) {
            children.forEach((item => {
                vnode.el.appendChild(createEl(item))
            }))
        }
    } else {
        vnode.el= document.createTextNode(text)
    }
    return vnode.el
}