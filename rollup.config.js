import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
export default {
    input: './src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'Vue',
        sourcemap:true
    },
    plugins: [
        babel({
            exclude:'node_modules/**'
        }),
        serve({
            port: 3000,
            openPage: './index.html',
            contentBase:'',//当前目录
        })
    ]
}