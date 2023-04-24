

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; //匹配viwe 视图中的{{指令}}
//  处理属性
function genprops(attrs){
    let str = ''
    for (let i = 0; i < attrs.length; i++){
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(element => {
                let [key, value] = element.split(':')
                obj[key]=value
            });
            attr.value = obj
        }
        str+=`${attr.name}:${JSON.stringify(attr.value)},`
    }
    // console.log(`{${str.slice(0,-1)}}`)
    return `{${str.slice(0,-1)}}`
}
function genChildren(el) {
    let children = el.children;
    if (children) {
        return children.map((child)=>gen(child)).join(',')
    }
}
function gen(node) {
    // 元素
    if (node.type === 1) {
     return generate(node)
    } else {
         //文本 和 {{msg}}
        let text = node.text
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        let token = [];
        let lastIndex = defaultTagRE.lastIndex = 0
        let match
        while (match = defaultTagRE.exec(text)) {
            let index = match.index
            if (index > lastIndex) {
                token.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            token.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
     
        }
            if (lastIndex < text.length) {
                token.push(JSON.stringify(text.slice(lastIndex)))
            }
        return `_v(${token.join('+')})`
    }
   

}
export function generate(el) {
    let children = genChildren(el)
    // console.log(el.tag)
    let code = `_c('${el.tag}',${el.attr.length ? `${genprops(el.attr)}` : 'null'},${children?children:null})`
    // console.log(code)
    return code
}