(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('rollup')) :
    typeof define === 'function' && define.amd ? define(['rollup'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var LIFECYCLE_HOOKS = ['beforeCreate',
    //  生命周期 开始实例化 vue 指令
    'created',
    //生命周期   结束实例化完 vue 指令
    'beforeMount',
    //生命周期 开始渲染虚拟dom ，挂载event 事件 指令
    'mounted',
    //生命周期  渲染虚拟dom ，挂载event 事件 完 指令
    'beforeUpdate',
    //生命周期  开始更新wiew 数据指令
    'updated',
    //生命周期  结束更新wiew 数据指令
    'beforeDestroy',
    //生命周期  开始销毁 new 实例 指令
    'destroyed',
    //生命周期  结束销毁 new 实例 指令
    'activated',
    //keep-alive组件激活时调用。
    'deactivated',
    //deactivated keep-alive组件停用时调用。
    'errorCaptured' // 具有此钩子的组件捕获其子组件树（不包括其自身）中的所有错误（不包括在异步回调中调用的那些）。
    ];

    var start$1 = {};
    start$1.data = function (parent, child) {
      return child;
    };
    start$1.computed = function () {};
    // start.watch =function(){}
    start$1.methods = function () {};
    LIFECYCLE_HOOKS.forEach(function (hooks) {
      start$1[hooks] = mergeHook;
    });
    function mergeHook(parent, child) {
      // console.log(parent,child)
      if (child) {
        if (parent) {
          return parent.concat(child);
        } else {
          return [child];
        }
      } else {
        return parent;
      }
    }
    function initGlobalApi(Vue) {
      Vue.options = {};
      Vue.Mixin = function (mixin) {
        // console.log(this.options)
        Vue.options = mergeOptions(this.options, mixin);
      };
    }
    function mergeOptions() {
      var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var child = arguments.length > 1 ? arguments[1] : undefined;
      // console.log(parent, child)
      var options = {};
      ///如果有父亲，没儿子
      for (var key in parent) {
        mergeField(key);
      }
      //如果有儿子没父亲
      for (var _key in child) {
        mergeField(_key);
      }
      function mergeField(key) {
        if (start$1[key]) {
          options[key] = start$1[key](parent[key], child[key]);
        } else {
          options[key] = child[key];
        }
        // console.log(options)
        // return options
      }

      return options;
    }

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
      // console.log(tag, attr, '开始的标签')
      var element = createASTElement(tag, attr);
      if (!root) {
        root = element;
      }
      createparent = element;
      stack.push(element);
    }
    function charts(text) {
      // console.log(text, '文本')
      //空格
      text = text.replace(/(^\s*)|(\s*$)/g, '');
      if (text) {
        createparent.children.push({
          tag: undefined,
          attr: [],
          text: text,
          type: 3,
          parent: createparent
        });
      }
    }
    function end(tag) {
      // console.log(tag, '结束标签')
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

    function _iterableToArrayLimit(arr, i) {
      var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
      if (null != _i) {
        var _s,
          _e,
          _x,
          _r,
          _arr = [],
          _n = !0,
          _d = !1;
        try {
          if (_x = (_i = _i.call(arr)).next, 0 === i) {
            if (Object(_i) !== _i) return;
            _n = !1;
          } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
          _d = !0, _e = err;
        } finally {
          try {
            if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
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
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

    var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g; //匹配viwe 视图中的{{指令}}
    //  处理属性
    function genprops(attrs) {
      var str = '';
      var _loop = function _loop() {
        var attr = attrs[i];
        if (attr.name === 'style') {
          var obj = {};
          attr.value.split(';').forEach(function (element) {
            var _element$split = element.split(':'),
              _element$split2 = _slicedToArray(_element$split, 2),
              key = _element$split2[0],
              value = _element$split2[1];
            obj[key] = value;
          });
          attr.value = obj;
        }
        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      };
      for (var i = 0; i < attrs.length; i++) {
        _loop();
      }
      // console.log(`{${str.slice(0,-1)}}`)
      return "{".concat(str.slice(0, -1), "}");
    }
    function genChildren(el) {
      var children = el.children;
      if (children) {
        return children.map(function (child) {
          return gen(child);
        }).join(',');
      }
    }
    function gen(node) {
      // 元素
      if (node.type === 1) {
        return generate(node);
      } else {
        //文本 和 {{msg}}
        var text = node.text;
        if (!defaultTagRE.test(text)) {
          return "_v(".concat(JSON.stringify(text), ")");
        }
        var token = [];
        var lastIndex = defaultTagRE.lastIndex = 0;
        var match;
        while (match = defaultTagRE.exec(text)) {
          var index = match.index;
          if (index > lastIndex) {
            token.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          token.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          token.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(token.join('+'), ")");
      }
    }
    function generate(el) {
      var children = genChildren(el);
      // console.log(el.tag)
      var code = "_c('".concat(el.tag, "',").concat(el.attr.length ? "".concat(genprops(el.attr)) : 'null', ",").concat(children ? children : null, ")");
      // console.log(code)
      return code;
    }

    function compileToFunctions(el) {
      // console.log(el)
      //1 将html转换成ast抽象语法书
      var ast = parseHTML(el);
      //2将ast语法树变成render函数字符串
      //3将render字符串变成函数
      var code = generate(ast);
      var render = new Function("with(this){return ".concat(code, "}"));
      return render;
    }

    // @ts-nocheck
    function isObject(obj) {
      //判断是否是对象
      return obj !== null && _typeof(obj) === 'object';
    }
    var callback = [];
    var pedding = false;
    var timerFunc;
    function flush() {
      callback.forEach(function (cb) {
        cb();
      });
      pedding = false;
    }
    if (Promise) {
      timerFunc = function timerFunc() {
        return Promise.resolve().then(flush);
      };
    } else if (MutationObserver) {
      var observe$1 = new MutationObserver(flush);
      var text = document.createTextNode('1');
      observe$1.observe(text, {
        characterData: true
      });
      timerFunc = function timerFunc() {
        text.textContent = '2';
      };
    } else if (setImmediate) {
      timerFunc = function timerFunc() {
        setImmediate(flush);
      };
    }
    function nextTick(cb) {
      // console.log(cb)
      callback.push(cb);
      // 列队
      if (!pedding) {
        timerFunc();
        pedding = true;
      }
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
        // console.log(ob.dep,'oooooobbbbb')
        ob.dep.notify();
        return result;
      };
    });

    var id$1 = 0;
    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);
        this.subs = [];
        this.id = id$1++;
      }
      //收集依赖
      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          // this.subs.push(Dep.target)
          Dep.target.addDep(this);
        }
        //更新依赖
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watch) {
            watch.update();
          });
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          this.subs.push(watcher);
        }
      }]);
      return Dep;
    }();
    Dep.target = null;
    function pushTarget(watcher) {
      Dep.target = watcher;
    }
    function popTarget(watcher) {
      Dep.target = null;
    }

    function observe(data) {
      // 判断如果不是对象,直接return
      if (!isObject(data)) {
        return data;
      }
      return new Observer(data);
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
        this.dep = new Dep();
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
          value.forEach(function (item) {
            observe(item);
          });
        }
      }]);
      return Observer;
    }();
    function defineReactive(data, key, value) {
      // console.log(value,'----------')
      var childDep = observe(value);
      // console.log(childDep,'childDep')
      var dep = new Dep(); //给每个属性添加一个dep
      Object.defineProperty(data, key, {
        get: function get() {
          // console.log('获取value值', data, key)
          // console.log(Dep.target)
          if (Dep.target) {
            dep.depend();
            if (childDep.dep) {
              childDep.dep.depend(); //数组依赖处理
            }
          }
          // console.log(dep,'--------------')
          return value;
        },
        set: function set(newVal) {
          if (newVal === value) return;
          // console.log('set')
          // 如果设置的值是对象，还要深度劫持
          observe(newVal);
          value = newVal;
          dep.notify();
        }
      });
    }

    var id = 0;
    var watcher = /*#__PURE__*/function () {
      function watcher(vm, updateComponent, cb, options) {
        _classCallCheck(this, watcher);
        this.vm = vm;
        this.exprOrfn = updateComponent;
        this.cb = cb;
        this.options = options;
        if (typeof updateComponent === 'function') {
          this.getter = updateComponent;
        } else {
          this.getter = function () {
            var path = updateComponent.split('.');
            var obj = vm;
            path.forEach(function (v) {
              obj = obj[v];
            });
            console.log(obj, '-----00000');
            return obj;
          };
        }
        this.id = id++;
        this.deps = [];
        this.depsId = new Set();
        //更新视图
        this.value = this.get();
      }
      _createClass(watcher, [{
        key: "addDep",
        value: function addDep(dep) {
          //去重
          var id = dep.id;
          if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
          }
        }
      }, {
        key: "run",
        value: function run() {
          var value = this.get();
          var oldValue = this.value;
          this.value = value;

          //执行用户的watch
          if (this.options.user) {
            this.cb.call(this.vm, value, oldValue);
          }
        }
      }, {
        key: "get",
        value: function get() {
          // console.log(this,'----------∂∂')
          pushTarget(this);
          var value = this.getter();
          popTarget();
          return value;
        }
      }, {
        key: "update",
        value: function update() {
          // console.log('调用update方法')
          // this.getter()
          queueWatcher(this);
        }
      }]);
      return watcher;
    }();
    var queue = []; //将需要更新的数据存到一个列队中
    var has = {};
    var pending = false;
    function flushWatcher() {
      queue.forEach(function (wat) {
        wat.run();
      });
      queue = []; //将需要更新的数据存到一个列队中
      has = {};
      pending = false;
    }
    function queueWatcher(watcher) {
      var id = watcher.id;
      if (has[id] == null) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
          nextTick(flushWatcher);
        }
        pending = true;
      }
    }

    // vue中更新组将的策略是给每个组件添加一个watcher，属性变化后调用watcher

    function initState(vm) {
      var opt = vm.$options;
      // console.log(opt)
      if (opt.props) {
        initProps();
      }
      if (opt.methods) {
        initMethods();
      }
      if (opt.data) {
        initData(vm);
      }
      if (opt.computed) ;
      if (opt.watch) {
        initWatch(vm);
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
      // console.log('initData')
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
    function initWatch(vm) {
      var watch = vm.$options.watch;
      console.log(watch, '-----------');
      var _loop = function _loop(key) {
        var handle = watch[key];
        if (Array.isArray(handle)) {
          handle.forEach(function (v) {
            createWatcher(vm, key, v);
          });
        } else {
          //对象，字符串，函数
          createWatcher(vm, key, handle);
        }
      };
      for (var key in watch) {
        _loop(key);
      }
      // console.log('initWatch')
    }

    function createWatcher(vm, exprOrfn, handler, options) {
      if (_typeof(handler) === 'object') {
        options = handler;
        handler = handler.handle;
      }
      if (typeof handler === 'string') {
        handler = vm.methods[handler];
      }
      return vm.$watch(vm, exprOrfn, handler, options);
    }
    function stateMixin(vm) {
      //列队：1 vue自己的nextTick   2用户自己的回调
      vm.prototype.$nextTick = function (cb) {
        // console.log(cb)
        nextTick(cb);
      };
      vm.prototype.$watch = function (vm, exprOrfn, handler, options) {
        console.log(vm, exprOrfn, handler, options);
        new watcher(vm, exprOrfn, handler, _objectSpread2(_objectSpread2({}, options), {}, {
          user: true
        }));
        if (options.immediate) {
          handler.call(vm);
        }
      };
    }

    function patch(oldNode, vnode) {
      // console.log(oldNode, vnode)
      //将vnode变成真实dom
      var el = createEl(vnode);
      // console.log(el)
      //替换  获取父节点，插入  删除old
      var parentNode = oldNode.parentNode;
      parentNode.insertBefore(el, oldNode.nextsibling);
      parentNode.removeChild(oldNode);
      return el;
    }
    function createEl(vnode) {
      var tag = vnode.tag,
        children = vnode.children;
        vnode.data;
        vnode.key;
        var text = vnode.text;
      if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        if (children && children.length > 0) {
          children.forEach(function (item) {
            vnode.el.appendChild(createEl(item));
          });
        }
      } else {
        vnode.el = document.createTextNode(text);
      }
      return vnode.el;
    }

    function mountComponent(vm, el) {
      callHook(vm, 'beforeMount');
      var updateComponent = function updateComponent() {
        vm._update(vm._render());
      };
      new watcher(vm, updateComponent, function () {
        callHook(vm, 'updated');
      }, true);
      callHook(vm, 'mounted');
    }
    function lefecycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
        // console.log(vnode)
        var vm = this;
        vm.$el = patch(vm.$el, vnode);
      };
    }
    function callHook(vm, hook) {
      var _this = this;
      var handles = vm.$options[hook];
      if (handles) {
        handles.forEach(function (element) {
          element.call(_this);
        });
      }
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        var vm = this;
        vm.$options = mergeOptions(Vue.options, options);
        console.log(vm.$options, '000000000');
        callHook(vm, 'beforeCreate');
        //初始化状态
        initState(vm);
        callHook(vm, 'created');

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
        vm.$el = el;
        if (!options.render) {
          var template = options.template;
          if (!template && el) {
            el = el.outerHTML;
            // console.log(el)
            //转换成ast语法树
            var render = compileToFunctions(el);
            console.log(render);
            // 将render函数变成vnode ， vnode变成真实dom
            options.render = render;
            render.call(this);
          }
        }
        mountComponent(vm);
      };
    }

    function renderMixin(Vue) {
      Vue.prototype._c = function () {
        return createElement.apply(void 0, arguments);
      };
      Vue.prototype._v = function (text) {
        return createText(text);
      };
      Vue.prototype._s = function (val) {
        return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
      };
      Vue.prototype._render = function () {
        var vm = this;
        var render = vm.$options.render;
        var vnode = render.call(this);
        // console.log(vnode)
        return vnode;
      };
    }
    function createElement(tag) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      return vnode(tag, data, undefined, children, undefined);
    }
    function vnode(tag, data, key, children, text) {
      return {
        tag: tag,
        data: data,
        key: key,
        children: children,
        text: text
      };
    }
    function createText(text) {
      return vnode(undefined, undefined, undefined, undefined, text);
    }

    function Vue(options) {
      //初始化  
      this._init(options);
    }
    initMixin(Vue);
    lefecycleMixin(Vue);
    renderMixin(Vue);
    initGlobalApi(Vue);
    stateMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=index.js.map
