'use strict';



function __$strToBlobUri(str, mime, isBinary) {try {return window.URL.createObjectURL(new Blob([Uint8Array.from(str.split('').map(function(c) {return c.charCodeAt(0)}))], {type: mime}));} catch (e) {return "data:" + mime + (isBinary ? ";base64," : ",") + str;}}

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Animate = _interopDefault(require('rc-animate'));

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "/* 淡入动画 */\n@keyframes xy-fade-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes xy-fade-out {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n/* 左边滑动淡入淡出动画 */\n@keyframes xy-fade-in-left {\n  from {\n    opacity: 0;\n    transform: translate3d(-100%, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n  }\n}\n@keyframes xy-fade-out-left {\n  from {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(-100%, 0, 0);\n  }\n}\n/* 右边滑动淡入淡出动画 */\n@keyframes xy-fade-in-right {\n  from {\n    opacity: 0;\n    transform: translate3d(100%, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n  }\n}\n@keyframes xy-fade-out-right {\n  from {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(100%, 0, 0);\n  }\n}\n";
styleInject(css);

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
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var n="function"===typeof Symbol&&Symbol.for,p=n?Symbol.for("react.element"):60103,q=n?Symbol.for("react.portal"):60106,r=n?Symbol.for("react.fragment"):60107,t=n?Symbol.for("react.strict_mode"):60108,u=n?Symbol.for("react.profiler"):60114,v=n?Symbol.for("react.provider"):60109,w=n?Symbol.for("react.context"):60110,x=n?Symbol.for("react.forward_ref"):60112,y=n?Symbol.for("react.suspense"):60113,aa=n?Symbol.for("react.suspense_list"):60120,ba=n?Symbol.for("react.memo"):
60115,ca=n?Symbol.for("react.lazy"):60116;var z="function"===typeof Symbol&&Symbol.iterator;
function A(a){for(var b=a.message,d="https://reactjs.org/docs/error-decoder.html?invariant="+b,c=1;c<arguments.length;c++)d+="&args[]="+encodeURIComponent(arguments[c]);a.message="Minified React error #"+b+"; visit "+d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ";return a}var B={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C={};
function D(a,b,d){this.props=a;this.context=b;this.refs=C;this.updater=d||B;}D.prototype.isReactComponent={};D.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw A(Error(85));this.updater.enqueueSetState(this,a,b,"setState");};D.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function E(){}E.prototype=D.prototype;function F(a,b,d){this.props=a;this.context=b;this.refs=C;this.updater=d||B;}var G=F.prototype=new E;
G.constructor=F;objectAssign(G,D.prototype);G.isPureReactComponent=!0;var H={current:null},I={suspense:null},J={current:null},K=Object.prototype.hasOwnProperty,L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,d){var c=void 0,e={},g=null,k=null;if(null!=b)for(c in void 0!==b.ref&&(k=b.ref),void 0!==b.key&&(g=""+b.key),b)K.call(b,c)&&!L.hasOwnProperty(c)&&(e[c]=b[c]);var f=arguments.length-2;if(1===f)e.children=d;else if(1<f){for(var l=Array(f),m=0;m<f;m++)l[m]=arguments[m+2];e.children=l;}if(a&&a.defaultProps)for(c in f=a.defaultProps,f)void 0===e[c]&&(e[c]=f[c]);return {$$typeof:p,type:a,key:g,ref:k,props:e,_owner:J.current}}
function da(a,b){return {$$typeof:p,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function N(a){return "object"===typeof a&&null!==a&&a.$$typeof===p}function escape(a){var b={"=":"=0",":":"=2"};return "$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var O=/\/+/g,P=[];function Q(a,b,d,c){if(P.length){var e=P.pop();e.result=a;e.keyPrefix=b;e.func=d;e.context=c;e.count=0;return e}return {result:a,keyPrefix:b,func:d,context:c,count:0}}
function R(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>P.length&&P.push(a);}
function S(a,b,d,c){var e=typeof a;if("undefined"===e||"boolean"===e)a=null;var g=!1;if(null===a)g=!0;else switch(e){case "string":case "number":g=!0;break;case "object":switch(a.$$typeof){case p:case q:g=!0;}}if(g)return d(c,a,""===b?"."+T(a,0):b),1;g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var k=0;k<a.length;k++){e=a[k];var f=b+T(e,k);g+=S(e,f,d,c);}else if(null===a||"object"!==typeof a?f=null:(f=z&&a[z]||a["@@iterator"],f="function"===typeof f?f:null),"function"===typeof f)for(a=f.call(a),k=
0;!(e=a.next()).done;)e=e.value,f=b+T(e,k++),g+=S(e,f,d,c);else if("object"===e)throw d=""+a,A(Error(31),"[object Object]"===d?"object with keys {"+Object.keys(a).join(", ")+"}":d,"");return g}function U(a,b,d){return null==a?0:S(a,"",b,d)}function T(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function ea(a,b){a.func.call(a.context,b,a.count++);}
function fa(a,b,d){var c=a.result,e=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?V(a,c,d,function(a){return a}):null!=a&&(N(a)&&(a=da(a,e+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(O,"$&/")+"/")+d)),c.push(a));}function V(a,b,d,c,e){var g="";null!=d&&(g=(""+d).replace(O,"$&/")+"/");b=Q(b,g,c,e);U(a,fa,b);R(b);}function W(){var a=H.current;if(null===a)throw A(Error(321));return a}
var X={Children:{map:function(a,b,d){if(null==a)return a;var c=[];V(a,c,null,b,d);return c},forEach:function(a,b,d){if(null==a)return a;b=Q(null,null,b,d);U(a,ea,b);R(b);},count:function(a){return U(a,function(){return null},null)},toArray:function(a){var b=[];V(a,b,null,function(a){return a});return b},only:function(a){if(!N(a))throw A(Error(143));return a}},createRef:function(){return {current:null}},Component:D,PureComponent:F,createContext:function(a,b){void 0===b&&(b=null);a={$$typeof:w,_calculateChangedBits:b,
_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:v,_context:a};return a.Consumer=a},forwardRef:function(a){return {$$typeof:x,render:a}},lazy:function(a){return {$$typeof:ca,_ctor:a,_status:-1,_result:null}},memo:function(a,b){return {$$typeof:ba,type:a,compare:void 0===b?null:b}},useCallback:function(a,b){return W().useCallback(a,b)},useContext:function(a,b){return W().useContext(a,b)},useEffect:function(a,b){return W().useEffect(a,b)},useImperativeHandle:function(a,
b,d){return W().useImperativeHandle(a,b,d)},useDebugValue:function(){},useLayoutEffect:function(a,b){return W().useLayoutEffect(a,b)},useMemo:function(a,b){return W().useMemo(a,b)},useReducer:function(a,b,d){return W().useReducer(a,b,d)},useRef:function(a){return W().useRef(a)},useState:function(a){return W().useState(a)},Fragment:r,Profiler:u,StrictMode:t,Suspense:y,unstable_SuspenseList:aa,createElement:M,cloneElement:function(a,b,d){if(null===a||void 0===a)throw A(Error(267),a);var c=void 0,e=
objectAssign({},a.props),g=a.key,k=a.ref,f=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,f=J.current);void 0!==b.key&&(g=""+b.key);var l=void 0;a.type&&a.type.defaultProps&&(l=a.type.defaultProps);for(c in b)K.call(b,c)&&!L.hasOwnProperty(c)&&(e[c]=void 0===b[c]&&void 0!==l?l[c]:b[c]);}c=arguments.length-2;if(1===c)e.children=d;else if(1<c){l=Array(c);for(var m=0;m<c;m++)l[m]=arguments[m+2];e.children=l;}return {$$typeof:p,type:a.type,key:g,ref:k,props:e,_owner:f}},createFactory:function(a){var b=M.bind(null,a);
b.type=a;return b},isValidElement:N,version:"16.9.0",unstable_withSuspenseConfig:function(a,b){var d=I.suspense;I.suspense=void 0===b?null:b;try{a();}finally{I.suspense=d;}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentDispatcher:H,ReactCurrentBatchConfig:I,ReactCurrentOwner:J,IsSomeRendererActing:{current:!1},assign:objectAssign}},Y={default:X},Z=Y&&X||Y;var react_production_min=Z.default||Z;

var react = createCommonjsModule(function (module) {

{
  module.exports = react_production_min;
}
});

/* 节流函数 */
var throttle = function throttle(cb, delay) {
  var key = null;
  return function () {
    if (key === null) {
      key = setTimeout(function () {
        cb();
        key = null;
      }, delay);
    }
  };
};

var ScrollTrigger =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ScrollTrigger, _React$Component);

  function ScrollTrigger() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScrollTrigger);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollTrigger)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.ref = null;
    _this.key = null;
    _this.state = {
      shown: false
    };
    _this.check = throttle(function () {
      if (_this.ref !== null) {
        var topToViewport = _this.ref.getBoundingClientRect().top;

        var heightForViewport = window.innerHeight || document.documentElement.clientHeight;

        if (topToViewport < heightForViewport) {
          /* 延迟后再做渲染 */
          if (_this.key !== null) {
            clearTimeout(_this.key);
          }

          _this.key = setTimeout(function () {
            _this.setState({
              shown: true
            });
          }, _this.props.delay);
          window.removeEventListener('scroll', _this.check);
        }
      }
    }, 200);
    return _this;
  }

  _createClass(ScrollTrigger, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.ref = document.getElementById('ScrollTriggerWrapper');
      window.addEventListener('scroll', this.check);
      this.check();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      /* 清理事件 */
      window.removeEventListener('scroll', this.check);

      if (this.key !== null) {
        clearTimeout(this.key);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          delay = _this$props.delay,
          rest = _objectWithoutProperties(_this$props, ["delay"]);

      return react.createElement("div", Object.assign({
        id: "ScrollTriggerWrapper"
      }, rest), this.state.shown && this.props.children);
    }
  }]);

  return ScrollTrigger;
}(react.Component);

ScrollTrigger.defaultProps = {
  delay: 0
};

var css$1 = "/* fadeInRight */\n.xy-fadeInRight-appear {\n  opacity: 0;\n}\n.xy-fadeInRight-appear-active {\n  animation-name: xy-fade-in-right;\n  animation-duration: 1s;\n}\n.xy-fadeInRight-enter {\n  opacity: 0;\n}\n.xy-fadeInRight-enter-active {\n  animation-name: xy-fade-in-right;\n  animation-duration: 1s;\n}\n.xy-fadeInRight-leave {\n  opacity: 1;\n}\n.xy-fadeInRight-leave-active {\n  animation-name: xy-fade-out-right;\n  animation-duration: 1s;\n}\n/* fadeInLeft */\n.xy-fadeInLeft-appear {\n  opacity: 0;\n}\n.xy-fadeInLeft-appear-active {\n  animation-name: xy-fade-in-left;\n  animation-duration: 1s;\n}\n/* fade */\n.xy-fade-appear {\n  opacity: 0;\n}\n.xy-fade-appear-active {\n  animation-name: xy-fade-in;\n  animation-duration: 1s;\n}\n";
styleInject(css$1);

var toArrayChildren = function toArrayChildren(children) {
  var _children = react.Children.map(children, function (child, i) {
    if (typeof child === 'string') {
      child = react.createElement('div', {
        children: child,
        key: "".concat(i)
      });
    }

    return child;
  });

  if (_children === null || _children === undefined) return [];
  if (Object.prototype.toString.call(_children) === '[object Array]') return _children;
  return [_children];
};

var AnimatePreset =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AnimatePreset, _React$Component);

  function AnimatePreset() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AnimatePreset);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AnimatePreset)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      newKeys: [],
      prevChildren: [],
      leaveKeys: []
    };
    _this.domRefs = [];
    return _this;
  }

  _createClass(AnimatePreset, [{
    key: "componentDidUpdate",

    /* 更新时统一管理delays */
    value: function componentDidUpdate() {
      var _this2 = this;

      if (this.props.offset) {
        var i = 0;
        Object.keys(this.domRefs).forEach(function (key) {
          if (_this2.state.leaveKeys.includes(key)) {
            _this2.domRefs[key].style['animationDelay'] = "0s";
          }

          if (_this2.state.newKeys.includes(key)) {
            _this2.domRefs[key].style['animationDelay'] = "".concat(i++ * _this2.props.offset / 1000, "s");
          }
        });
      }

      return null;
    }
    /* 第一次挂载时统一管理delays */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      if (this.props.offset) {
        var i = 0;
        Object.keys(this.domRefs).forEach(function (key) {
          if (_this3.state.newKeys.includes(key)) {
            _this3.domRefs[key].style['animationDelay'] = "".concat(i++ * _this3.props.offset / 1000, "s");
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          preset = _this$props.preset,
          offset = _this$props.offset,
          duration = _this$props.duration,
          rest = _objectWithoutProperties(_this$props, ["preset", "offset", "duration"]);

      return react.createElement(Animate, {
        component: "div",
        transitionName: "xy-".concat(preset),
        transitionAppear: true,
        componentProps: rest
      }, toArrayChildren(this.props.children).map(function (child, i) {
        var key = child && child.key || i;
        return react.createElement("div", {
          key: key,
          ref: function ref(_ref) {
            _this4.domRefs[key] = _ref;
          },
          style: {
            animationDuration: "".concat(duration / 1000, "s")
          }
        }, child);
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var newChildren = toArrayChildren(nextProps.children);
      var leaveChildren = prevState.prevChildren;

      for (var i = 0; i < newChildren.length; i++) {
        var flag = true;

        for (var j = 0; j < leaveChildren.length; j++) {
          if (flag === true) flag = false;
          var newKey = newChildren[i].key || i;
          var leaveKey = leaveChildren[j].key || j;

          if (newKey === leaveKey) {
            newChildren.splice(i, 1);
            leaveChildren.splice(j, 1);
            i--;
            j--;
            break;
          }
        }

        if (flag) break;
      }

      return {
        newKeys: newChildren.map(function (child) {
          return child.key;
        }),
        leaveKeys: leaveChildren.map(function (child) {
          return child.key;
        }),
        prevChildren: toArrayChildren(nextProps.children)
      };
    }
  }]);

  return AnimatePreset;
}(react.Component);

AnimatePreset.defaultProps = {
  preset: 'fadeInRight',
  offset: 0,
  duration: 1000
  /**
   * 剥离出新增加元素和被移除元素
   * 如果splice算作O(n), 这个该算法复杂度会达到O(n^3)
   */

};

exports.Animate = Animate;
exports.AnimatePreset = AnimatePreset;
exports.ScrollTrigger = ScrollTrigger;
