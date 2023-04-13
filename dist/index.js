(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    // @ts-nocheck

    var ncname = '[a-zA-Z_][\\w\\-\\.]*'; //匹配标签名称
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; //  ((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)  <span:xx>
    var startTagOpen = new RegExp("^<" + qnameCapture); // 匹配开头必需是< 后面可以忽略是任何字符串  ^<((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)  标签开头的正则，捕获内容是标签名称
    var startTagClose = /^\s*(\/?)>/; //     匹配 > 标签 或者/> 闭合标签
    var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>"); //匹配开头必需是</ 后面可以忽略是任何字符串  ^<\\/((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)[^>]*>

    // Regular Expressions for parsing tags and attributes 解析标记和属性的正则表达式
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var root; //根元素
    var createparent; // 当前父元素
    var stack = []; // 数组结构栈

    function start(tag, attr) {
      console.log(tag, attr, '开始的标签');
      var element = createASTElement(tag, attr);
      if (!root) {
        root = element;
      }
      createparent = element;
      stack.push(element);
    }
    function charts(text) {
      console.log(text, '文本');
      //空格
      text = text.replace(/\s/g, '');
      if (text) {
        createparent.children.push(text);
      }
    }
    function end(tag) {
      console.log(tag, '结束标签');
      var element = stack.pop();
      createparent = stack[stack.length - 1];
      if (createparent) {
        element.parent = createparent.tag;
        createparent.children.push(element);
      }
    }
    function createASTElement(tag, attr) {
      return {
        tag: tag,
        attr: attr,
        children: [],
        type: 1,
        parent: null
      };
    }
    function parseHTML(html) {
      while (html) {
        //  判断标签
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          //第一种情况  开始标签
          var startTagMatch = parseStartTag();
          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attr);
            continue;
          }
          // 结束标签
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
            continue;
          }
        }
        var text = void 0;
        //第二种情况 文本
        if (textEnd > 0) {
          // console.log(textEnd)
          text = html.substring(0, textEnd);
          // console.log(text)
        }

        if (text) {
          advance(text.length);
          charts(text);
        }
      }
      //获取开始标签的名称，收集属性集合，开始位置和结束位置，并且返回该对象
      function parseStartTag() {
        var start = html.match(startTagOpen);
        if (!start) {
          return null;
        }
        // console.log(start)
        var match = {
          tagName: start[1],
          attr: []
        };
        //删除开始标签
        advance(start[0].length);
        //处理属性   多个遍历
        var attr;
        var end;
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // console.log(attr)
          match.attr.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }
        // console.log(end, 'end')
        if (end) {
          advance(end[0].length);
          return match;
        }
      }
      function advance(n) {
        html = html.substring(n);
        // console.log(html)
      }

      console.log(root);
      return root;
    }
    function compileToFunctions(el) {
      // console.log(el)
      parseHTML(el);
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }

    function isObject(obj) {
      //判断是否是对象
      return obj !== null && _typeof(obj) === 'object';
    }

    //重写数组方法
    //（1）获取原来的数组方法
    var oldArrayProtoMethods = Array.prototype;
    //（2）继承

    var arrayMethods = Object.create(oldArrayProtoMethods);
    //劫持

    var methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];
    methods.forEach(function (item) {
      arrayMethods[item] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // console.log('数组劫持了',args)
        var result = oldArrayProtoMethods[item].apply(this, args);
        var inserted;
        switch (item) {
          case 'push':
            inserted = args;
            break;
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.splice(2);
            break;
        }
        var ob = this.__ob__;
        if (inserted) {
          ob.observeArray(inserted);
        }
        return result;
      };
    });

    function observe(data) {
      // 判断如果不是对象,直接return
      if (!isObject(data)) {
        return data;
      }
      new Observer(data);
    }
    // Observer类的作用：因为Object.defineProperty只能对对象的一个熟悉进行劫持，封装后可以对对象进行劫持
    var Observer = /*#__PURE__*/function () {
      function Observer(value) {
        _classCallCheck(this, Observer);
        // 劫持数组时方便拿到Observer类上的方法
        Object.defineProperty(value, '__ob__', {
          enumerable: false,
          value: this
        });
        if (Array.isArray(value)) {
          // @ts-ignore
          value.__proto__ = arrayMethods;
          this.observeArray(value);
        } else {
          this.walk(value);
        }
      }
      _createClass(Observer, [{
        key: "walk",
        value: function walk(value) {
          var keys = Object.keys(value);
          keys.forEach(function (key) {
            //对每个属性进行劫持 
            defineReactive(value, key, value[key]);
          });
        }
      }, {
        key: "observeArray",
        value: function observeArray(value) {
          debugger;
          value.forEach(function (item) {
            observe(item);
          });
        }
      }]);
      return Observer;
    }();
    function defineReactive(data, key, value) {
      observe(value);
      Object.defineProperty(data, key, {
        get: function get() {
          console.log('获取value值', data, key);
          return value;
        },
        set: function set(newVal) {
          if (newVal === value) return;
          console.log('set');
          // 如果设置的值是对象，还要深度劫持
          observe(newVal);
          value = newVal;
        }
      });
    }

    function initState(vm) {
      var opt = vm.$options;
      console.log(opt);
      if (opt.props) {
        initProps();
      }
      if (opt.methods) {
        initMethods();
      }
      if (opt.data) {
        initData(vm);
      }
      if (opt.computed) {
        initComputed();
      }
      if (opt.watch) {
        initWatch();
      }
    }
    function initProps(vm) {
      console.log('initProps');
    }
    function initMethods(vm) {
      console.log('initMethods');
    }
    /**
     * 初始化data
     */
    function initData(vm) {
      console.log('initData');
      var data = vm.$options.data;
      data = typeof data === 'function' ? data.call(vm) : data;
      vm._data = data;
      // 将data 上的属性代理到实例上 vm.mes = vm._data.mes
      for (var key in data) {
        proxy(vm, '_data', key);
      }
      //对数据进行劫持
      observe(data);
    }
    // 将data 上的属性代理到实例上 vm.mes = vm._data.mes
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newVal) {
          vm[source][key] = newVal;
        }
      });
    }
    function initComputed(vm) {
      console.log('initComputed');
    }
    function initWatch(vm) {
      console.log('initWatch');
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        var vm = this;
        vm.$options = options;
        //初始化状态
        initState(vm);
        //渲染模版
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        var vm = this;
        // console.log(el,'el')
        var options = vm.$options;
        el = document.querySelector(el);
        if (!options.render) {
          var template = options.template;
          if (!template && el) {
            el = el.outerHTML;
            // console.log(el)
            //转换成ast语法树
            compileToFunctions(el);
          }
        }
      };
    }

    function Vue(options) {
      //初始化  
      this._init(options);
    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=index.js.map
