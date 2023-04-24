
import { parseHTML } from './parseAst'
import {generate} from './generate'
export function compileToFunctions(el) {
    // console.log(el)
    //1 将html转换成ast抽象语法书
    const ast = parseHTML(el)
    //2将ast语法树变成render函数字符串
    //3将render字符串变成函数
    const code = generate(ast)
    const render = new Function(`with(this){return ${code}}`)
      return render
}