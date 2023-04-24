// @ts-nocheck



var ncname = '[a-zA-Z_][\\w\\-\\.]*';//匹配标签名称
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; //  ((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)  <span:xx>
var startTagOpen = new RegExp(("^<" + qnameCapture))  // 匹配开头必需是< 后面可以忽略是任何字符串  ^<((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)  标签开头的正则，捕获内容是标签名称
var startTagClose = /^\s*(\/?)>/; //     匹配 > 标签 或者/> 闭合标签
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));  //匹配开头必需是</ 后面可以忽略是任何字符串  ^<\\/((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)[^>]*>
var doctype = /^<!DOCTYPE [^>]+>/i; //匹配html的头文件 <!DOCTYPE html>
var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; //匹配viwe 视图中的{{指令}}

// Regular Expressions for parsing tags and attributes 解析标记和属性的正则表达式
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

let root //根元素
let createparent // 当前父元素
let stack =[]// 数组结构栈

function start(tag,attr) {
    // console.log(tag, attr, '开始的标签')
    let element = createASTElement(tag, attr)
    if (!root) {
        root = element
    }
    createparent = element
    stack.push(element)
}
function charts(text) {
    // console.log(text, '文本')
    //空格
    text = text.replace(/(^\s*)|(\s*$)/g, '')
    if (text) {
        createparent.children.push({
            tag:undefined,
            attr:[],
            text: text,
            type: 3,
            parent:createparent
        })
    }
}
function end(tag) {
    // console.log(tag, '结束标签')
    let element = stack.pop()
    createparent = stack[stack.length - 1]
    if (createparent) {
        element.parent = createparent.tag
        createparent.children.push(element)
    }
}

function createASTElement(tag, attr) {
    return {
        tag,
        attr,
        children: [],
        type: 1,
        parent:null
    }
}
export function parseHTML(html) {
    while (html) {
        //  判断标签
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            //第一种情况  开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attr)
                continue
            }
            // 结束标签
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text
         //第二种情况 文本
        if (textEnd > 0) {
            // console.log(textEnd)
            text = html.substring(0, textEnd) 
            // console.log(text)
        }
        if (text) {
            advance(text.length)
            charts(text)
        }
    }
         //获取开始标签的名称，收集属性集合，开始位置和结束位置，并且返回该对象
    function parseStartTag() { 
        const start = html.match(startTagOpen)
        if (!start) {
            return null
        }
        // console.log(start)
        let match = {
            tagName: start[1],
            attr:[]
        }
        //删除开始标签
        advance(start[0].length)
        //处理属性   多个遍历
        let attr
        let end 
        while (!(end = html.match(startTagClose) )&& (attr = html.match(attribute))) {
            // console.log(attr)
            match.attr.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            advance(attr[0].length)
        }
        // console.log(end, 'end')
        if (end) {
            advance(end[0].length)
            return match
        }

    }
    function advance(n) {
       html= html.substring(n)
        // console.log(html)
    }
        console.log(root)
    return root
}
