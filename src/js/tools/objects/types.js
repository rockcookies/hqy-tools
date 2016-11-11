var HQY_has = require('./has');

var root = require('../helper/root');

var toString = Object.prototype.toString;

// Is a given value a DOM element?
exports.isElement = function(obj) {
	return !!(obj && obj.nodeType === 1);
};

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
exports.isArray = Array.isArray || function(obj) {
	return toString.call(obj) === '[object Array]';
};

exports.isObject = function(obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
};

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
!(function (LIST) {
	function cb (name) {
		exports['is' + name] = function(obj) {
			return toString.call(obj) === '[object ' + name + ']';
		}
	};

	for (var i=0;i<LIST.length;i++) {
		cb(LIST[i]);
	}
})(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']);

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function () {
	if (!exports.isArguments(arguments)) {
		exports.isArguments = function(obj) {
			return HQY_has(obj, 'callee');
		};
	}
})();

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	exports.isFunction = function(obj) {
		return typeof obj == 'function' || false;
	};
}

// Is a given object a finite number?
exports.isFinite = function(obj) {
	return isFinite(obj) && !isNaN(parseFloat(obj));
};

// Is the given value `NaN`?
exports.isNaN = function(obj) {
	return exports.isNumber(obj) && isNaN(obj);
};

// Is a given value a boolean?
exports.isBoolean = function(obj) {
	return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

// Is a given value equal to null?
exports.isNull = function(obj) {
	return obj === null;
};

// Is a given variable undefined?
exports.isUndefined = function(obj) {
	return obj === void 0;
};
