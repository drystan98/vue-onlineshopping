module.exports = {
  root: true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
  env: {
    node: true // 此项指定环境的全局变量，下面的配置指定为node环境
  },
  // extends是扩展插件的意思，2个插件Vue必须安装！
  'extends': [ // 此项是用来配置vue.js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错
    'plugin:vue/essential',
    //这里的插件是：eslint的（eslint-config-standard和eslint-plugin-standard及相关依赖）
    //'@vue/standard'
  ],
  //第二部分最核心的语法规则（第一个参数数字代表含义：0-"off"，1-"warn",2-"error"）
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0
  },
  parserOptions: {
    // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    parser: 'babel-eslint'
  }
}
