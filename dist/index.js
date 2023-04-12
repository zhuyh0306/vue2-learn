(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
      console.log('数组劫持了');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      oldArrayProtoMethods[item].apply(this, args);
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
    //对数据进行劫持
    observe(data);
  }
  function initComputed(vm) {
    console.log('initComputed');
  }
  function initWatch(vm) {
    console.log('initWatch');
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this;
      vm.$options = options;
      //初始化状态
      initState(vm);
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
