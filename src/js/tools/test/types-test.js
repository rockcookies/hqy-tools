var underscore = require('underscore');

var _ = {
	isWeakSet: require('../types/isWeakSet.js'),
	isArguments: require('../types/isArguments.js'),
	isArray: require('../types/isArray.js'),
	isBoolean: require('../types/isBoolean.js'),
	isDate: require('../types/isDate.js'),
	isElement: require('../types/isElement.js'),
	isError: require('../types/isError.js'),
	isFinite: require('../types/isFinite.js'),
	isFunction: require('../types/isFunction.js'),
	isMap: require('../types/isMap.js'),
	isNaN: require('../types/isNaN.js'),
	isNull: require('../types/isNull.js'),
	isNumber: require('../types/isNumber.js'),
	isObject: require('../types/isObject.js'),
	isRegExp: require('../types/isRegExp.js'),
	isSet: require('../types/isSet.js'),
	isString: require('../types/isString.js'),
	isSymbol: require('../types/isSymbol.js'),
	isUndefined: require('../types/isUndefined.js'),
	isWeakMap: require('../types/isWeakMap.js'),
	isPlainObject: require('../types/isPlainObject.js')
};

var ROOT = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this;

QUnit.module('Tools.Types');

var testElement = typeof document === 'object' ? document.createElement('div') : void 0;

if (typeof document === 'object') {
	QUnit.test('isElement', function(assert) {
		assert.notOk(_.isElement('div'), 'strings are not dom elements');
		assert.ok(_.isElement(testElement), 'an element is a DOM element');
	});
}

QUnit.test('isArguments', function(assert) {
	var args = (function(){ return arguments; }(1, 2, 3));
	assert.notOk(_.isArguments('string'), 'a string is not an arguments object');
	assert.notOk(_.isArguments(_.isArguments), 'a function is not an arguments object');
	assert.ok(_.isArguments(args), 'but the arguments object is an arguments object');
	assert.notOk(_.isArguments([args]), 'but not when it\'s converted into an array');
	assert.notOk(_.isArguments([1, 2, 3]), 'and not vanilla arrays.');
});

QUnit.test('isObject', function(assert) {
	assert.ok(_.isObject(arguments), 'the arguments object is object');
	assert.ok(_.isObject([1, 2, 3]), 'and arrays');
	if (testElement) {
		assert.ok(_.isObject(testElement), 'and DOM element');
	}
	assert.ok(_.isObject(function() {}), 'and functions');
	assert.notOk(_.isObject(null), 'but not null');
	assert.notOk(_.isObject(void 0), 'and not undefined');
	assert.notOk(_.isObject('string'), 'and not string');
	assert.notOk(_.isObject(12), 'and not number');
	assert.notOk(_.isObject(true), 'and not boolean');
	assert.ok(_.isObject(new String('string')), 'but new String()');
});

QUnit.test('isArray', function(assert) {
	assert.notOk(_.isArray(void 0), 'undefined vars are not arrays');
	assert.notOk(_.isArray(arguments), 'the arguments object is not an array');
	assert.ok(_.isArray([1, 2, 3]), 'but arrays are');
});

QUnit.test('isString', function(assert) {
	var obj = new String('I am a string object');
	if (testElement) {
		assert.notOk(_.isString(testElement), 'an element is not a string');
	}
	assert.ok(_.isString([1, 2, 3].join(', ')), 'but strings are');
	assert.strictEqual(_.isString('I am a string literal'), true, 'string literals are');
	assert.ok(_.isString(obj), 'so are String objects');
	assert.strictEqual(_.isString(1), false);
});

QUnit.test('isSymbol', function(assert) {
	assert.notOk(_.isSymbol(0), 'numbers are not symbols');
	assert.notOk(_.isSymbol(''), 'strings are not symbols');
	assert.notOk(_.isSymbol(_.isSymbol), 'functions are not symbols');
	if (typeof Symbol === 'function') {
		assert.ok(_.isSymbol(Symbol()), 'symbols are symbols');
		assert.ok(_.isSymbol(Symbol('description')), 'described symbols are symbols');
		assert.ok(_.isSymbol(Object(Symbol())), 'boxed symbols are symbols');
	}
});

QUnit.test('isNumber', function(assert) {
	assert.notOk(_.isNumber('string'), 'a string is not a number');
	assert.notOk(_.isNumber(arguments), 'the arguments object is not a number');
	assert.notOk(_.isNumber(void 0), 'undefined is not a number');
	assert.ok(_.isNumber(3 * 4 - 7 / 10), 'but numbers are');
	assert.ok(_.isNumber(NaN), 'NaN *is* a number');
	assert.ok(_.isNumber(Infinity), 'Infinity is a number');
	assert.notOk(_.isNumber('1'), 'numeric strings are not numbers');
});

QUnit.test('isBoolean', function(assert) {
	assert.notOk(_.isBoolean(2), 'a number is not a boolean');
	assert.notOk(_.isBoolean('string'), 'a string is not a boolean');
	assert.notOk(_.isBoolean('false'), 'the string "false" is not a boolean');
	assert.notOk(_.isBoolean('true'), 'the string "true" is not a boolean');
	assert.notOk(_.isBoolean(arguments), 'the arguments object is not a boolean');
	assert.notOk(_.isBoolean(void 0), 'undefined is not a boolean');
	assert.notOk(_.isBoolean(NaN), 'NaN is not a boolean');
	assert.notOk(_.isBoolean(null), 'null is not a boolean');
	assert.ok(_.isBoolean(true), 'but true is');
	assert.ok(_.isBoolean(false), 'and so is false');
});

QUnit.test('isMap', function(assert) {
	assert.notOk(_.isMap('string'), 'a string is not a map');
	assert.notOk(_.isMap(2), 'a number is not a map');
	assert.notOk(_.isMap({}), 'an object is not a map');
	assert.notOk(_.isMap(false), 'a boolean is not a map');
	assert.notOk(_.isMap(void 0), 'undefined is not a map');
	assert.notOk(_.isMap([1, 2, 3]), 'an array is not a map');
	if (typeof Set === 'function') {
		assert.notOk(_.isMap(new Set()), 'a set is not a map');
	}
	if (typeof WeakSet === 'function') {
		assert.notOk(_.isMap(new WeakSet()), 'a weakset is not a map');
	}
	if (typeof WeakMap === 'function') {
		assert.notOk(_.isMap(new WeakMap()), 'a weakmap is not a map');
	}
	if (typeof Map === 'function') {
		var keyString = 'a string';
		var obj = new Map();
		obj.set(keyString, 'value');
		assert.ok(_.isMap(obj), 'but a map is');
	}
});

QUnit.test('isWeakMap', function(assert) {
	assert.notOk(_.isWeakMap('string'), 'a string is not a weakmap');
	assert.notOk(_.isWeakMap(2), 'a number is not a weakmap');
	assert.notOk(_.isWeakMap({}), 'an object is not a weakmap');
	assert.notOk(_.isWeakMap(false), 'a boolean is not a weakmap');
	assert.notOk(_.isWeakMap(void 0), 'undefined is not a weakmap');
	assert.notOk(_.isWeakMap([1, 2, 3]), 'an array is not a weakmap');
	if (typeof Set === 'function') {
		assert.notOk(_.isWeakMap(new Set()), 'a set is not a weakmap');
	}
	if (typeof WeakSet === 'function') {
		assert.notOk(_.isWeakMap(new WeakSet()), 'a weakset is not a weakmap');
	}
	if (typeof Map === 'function') {
		assert.notOk(_.isWeakMap(new Map()), 'a map is not a weakmap');
	}
	if (typeof WeakMap === 'function') {
		var keyObj = {}, obj = new WeakMap();
		obj.set(keyObj, 'value');
		assert.ok(_.isWeakMap(obj), 'but a weakmap is');
	}
});

QUnit.test('isSet', function(assert) {
	assert.notOk(_.isSet('string'), 'a string is not a set');
	assert.notOk(_.isSet(2), 'a number is not a set');
	assert.notOk(_.isSet({}), 'an object is not a set');
	assert.notOk(_.isSet(false), 'a boolean is not a set');
	assert.notOk(_.isSet(void 0), 'undefined is not a set');
	assert.notOk(_.isSet([1, 2, 3]), 'an array is not a set');
	if (typeof Map === 'function') {
		assert.notOk(_.isSet(new Map()), 'a map is not a set');
	}
	if (typeof WeakMap === 'function') {
		assert.notOk(_.isSet(new WeakMap()), 'a weakmap is not a set');
	}
	if (typeof WeakSet === 'function') {
		assert.notOk(_.isSet(new WeakSet()), 'a weakset is not a set');
	}
	if (typeof Set === 'function') {
		var obj = new Set();
		obj.add(1).add('string').add(false).add({});
		assert.ok(_.isSet(obj), 'but a set is');
	}
});

QUnit.test('isWeakSet', function(assert) {

	assert.notOk(_.isWeakSet('string'), 'a string is not a weakset');
	assert.notOk(_.isWeakSet(2), 'a number is not a weakset');
	assert.notOk(_.isWeakSet({}), 'an object is not a weakset');
	assert.notOk(_.isWeakSet(false), 'a boolean is not a weakset');
	assert.notOk(_.isWeakSet(void 0), 'undefined is not a weakset');
	assert.notOk(_.isWeakSet([1, 2, 3]), 'an array is not a weakset');
	if (typeof Map === 'function') {
		assert.notOk(_.isWeakSet(new Map()), 'a map is not a weakset');
	}
	if (typeof WeakMap === 'function') {
		assert.notOk(_.isWeakSet(new WeakMap()), 'a weakmap is not a weakset');
	}
	if (typeof Set === 'function') {
		assert.notOk(_.isWeakSet(new Set()), 'a set is not a weakset');
	}
	if (typeof WeakSet === 'function') {
		var obj = new WeakSet();
		obj.add({x: 1}, {y: 'string'}).add({y: 'string'}).add({z: [1, 2, 3]});
		assert.ok(_.isWeakSet(obj), 'but a weakset is');
	}
});

QUnit.test('isFunction', function(assert) {
	assert.notOk(_.isFunction(void 0), 'undefined vars are not functions');
	assert.notOk(_.isFunction([1, 2, 3]), 'arrays are not functions');
	assert.notOk(_.isFunction('moe'), 'strings are not functions');
	assert.ok(_.isFunction(_.isFunction), 'but functions are');
	assert.ok(_.isFunction(function(){}), 'even anonymous ones');

	if (testElement) {
		assert.notOk(_.isFunction(testElement), 'elements are not functions');
	}

	var nodelist = typeof document != 'undefined' && document.childNodes;
	if (nodelist) {
		assert.notOk(_.isFunction(nodelist));
	}
});

if (typeof Int8Array !== 'undefined') {
	QUnit.test('#1929 Typed Array constructors are functions', function(assert) {
		underscore.chain(['Float32Array', 'Float64Array', 'Int8Array', 'Int16Array', 'Int32Array', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array'])
		.map(underscore.propertyOf(typeof GLOBAL != 'undefined' ? GLOBAL : window))
		.compact()
		.each(function(TypedArray) {
			// PhantomJS reports `typeof UInt8Array == 'object'` and doesn't report toString TypeArray
			// as a function
			assert.strictEqual(_.isFunction(TypedArray), Object.prototype.toString.call(TypedArray) === '[object Function]');
		});
	});
}

QUnit.test('isDate', function(assert) {
	assert.notOk(_.isDate(100), 'numbers are not dates');
	assert.notOk(_.isDate({}), 'objects are not dates');
	assert.ok(_.isDate(new Date()), 'but dates are');
});

QUnit.test('isRegExp', function(assert) {
	assert.notOk(_.isRegExp(_.identity), 'functions are not RegExps');
	assert.ok(_.isRegExp(/identity/), 'but RegExps are');
});

QUnit.test('isFinite', function(assert) {
	assert.notOk(_.isFinite(void 0), 'undefined is not finite');
	assert.notOk(_.isFinite(null), 'null is not finite');
	assert.notOk(_.isFinite(NaN), 'NaN is not finite');
	assert.notOk(_.isFinite(Infinity), 'Infinity is not finite');
	assert.notOk(_.isFinite(-Infinity), '-Infinity is not finite');
	assert.ok(_.isFinite('12'), 'Numeric strings are numbers');
	assert.notOk(_.isFinite('1a'), 'Non numeric strings are not numbers');
	assert.notOk(_.isFinite(''), 'Empty strings are not numbers');
	var obj = new Number(5);
	assert.ok(_.isFinite(obj), 'Number instances can be finite');
	assert.ok(_.isFinite(0), '0 is finite');
	assert.ok(_.isFinite(123), 'Ints are finite');
	assert.ok(_.isFinite(-12.44), 'Floats are finite');
	/*if (typeof Symbol === 'function') {
		assert.notOk(_.isFinite(Symbol()), 'symbols are not numbers');
		assert.notOk(_.isFinite(Symbol('description')), 'described symbols are not numbers');
		assert.notOk(_.isFinite(Object(Symbol())), 'boxed symbols are not numbers');
	}*/
});

QUnit.test('isNaN', function(assert) {
	assert.notOk(_.isNaN(void 0), 'undefined is not NaN');
	assert.notOk(_.isNaN(null), 'null is not NaN');
	assert.notOk(_.isNaN(0), '0 is not NaN');
	assert.notOk(_.isNaN(new Number(0)), 'wrapped 0 is not NaN');
	assert.ok(_.isNaN(NaN), 'but NaN is');
	assert.ok(_.isNaN(new Number(NaN)), 'wrapped NaN is still NaN');
	if (typeof Symbol !== 'undefined'){
		assert.notOk(_.isNaN(Symbol()), 'symbol is not NaN');
	}
});

QUnit.test('isNull', function(assert) {
	assert.notOk(_.isNull(void 0), 'undefined is not null');
	assert.notOk(_.isNull(NaN), 'NaN is not null');
	assert.ok(_.isNull(null), 'but null is');
});

QUnit.test('isUndefined', function(assert) {
	assert.notOk(_.isUndefined(1), 'numbers are defined');
	assert.notOk(_.isUndefined(null), 'null is defined');
	assert.notOk(_.isUndefined(false), 'false is defined');
	assert.notOk(_.isUndefined(NaN), 'NaN is defined');
	assert.ok(_.isUndefined(), 'nothing is undefined');
	assert.ok(_.isUndefined(void 0), 'undefined is undefined');
});

QUnit.test('isError', function(assert) {
	assert.notOk(_.isError(1), 'numbers are not Errors');
	assert.notOk(_.isError(null), 'null is not an Error');
	assert.notOk(_.isError(Error), 'functions are not Errors');
	assert.ok(_.isError(new Error()), 'Errors are Errors');
	assert.ok(_.isError(new EvalError()), 'EvalErrors are Errors');
	assert.ok(_.isError(new RangeError()), 'RangeErrors are Errors');
	assert.ok(_.isError(new ReferenceError()), 'ReferenceErrors are Errors');
	assert.ok(_.isError(new SyntaxError()), 'SyntaxErrors are Errors');
	assert.ok(_.isError(new TypeError()), 'TypeErrors are Errors');
	assert.ok(_.isError(new URIError()), 'URIErrors are Errors');
});



// Thanks to: https://github.com/jquery/jquery/blob/master/test/unit/core.js
QUnit.test( "isPlainObject", function( assert ) {
	var pass, iframe, doc, parentObj, childObj, deep,
		fn = function() {};

	// The use case that we want to match
	assert.ok(_.isPlainObject( {} ), "{}" );
	assert.ok(_.isPlainObject(new Object()), "new Object" );
	assert.ok(_.isPlainObject({ constructor: fn }), "plain object with constructor property" );
	assert.ok(_.isPlainObject({ constructor: "foo" }), "plain object with primitive constructor property" );

	if (Object.create) {
		parentObj = {};
		childObj = Object.create(parentObj);
		assert.ok(!_.isPlainObject(childObj), "Object.create({})" );

		parentObj.foo = "bar";
		assert.ok(!_.isPlainObject(childObj), "Object.create({...})" );
		childObj.bar = "foo";
		assert.ok(!_.isPlainObject(childObj), "extend(Object.create({...}), ...)" );
	}

	// Not objects shouldn't be matched
	assert.ok(!_.isPlainObject(""), "string");
	assert.ok(!_.isPlainObject(0) && !_.isPlainObject(1), "number");
	assert.ok(!_.isPlainObject(true) && !_.isPlainObject(false), "boolean");
	assert.ok(!_.isPlainObject(null), "null");
	assert.ok(!_.isPlainObject(undefined), "undefined");

	// Arrays shouldn't be matched
	assert.ok(!_.isPlainObject([]), "array");

	// Instantiated objects shouldn't be matched
	assert.ok(!_.isPlainObject(new Date()), "new Date");

	// Functions shouldn't be matched
	assert.ok(!_.isPlainObject(fn), "fn");

	// Again, instantiated objects shouldn't be matched
	assert.ok(!_.isPlainObject( new fn() ), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype["someMethod"] = function() {};

	// Again, instantiated objects shouldn't be matched
	assert.ok(!_.isPlainObject(new fn()), "new fn");

	// Instantiated objects with primitive constructors shouldn't be matched
	fn.prototype.constructor = "foo";
	assert.ok(!_.isPlainObject(new fn()), "new fn with primitive constructor");

	// Deep object
	deep = { "foo": { "baz": true }, "foo2": typeof document !== 'undefined' && document };
	assert.ok(_.isPlainObject(deep), "Object with objects is still plain" );

	// DOM Element
	if (typeof document !== 'undefined') {
		assert.ok(!_.isPlainObject(document.createElement("div")), "DOM Element");
	}

	// Window
	if (typeof window !== 'undefined') {
		assert.ok(!_.isPlainObject( window ), "window");

		pass = false;
		try {
			_.isPlainObject(window.location);
			pass = true;
		} catch (e) {}
		assert.ok(pass, "Does not throw exceptions on host objects");
	}
});

QUnit[ typeof Symbol === "function" ? "test" : "skip" ]("isPlainObject(Symbol)", function( assert ) {
	assert.expect(2);

	assert.equal(_.isPlainObject(Symbol()), false, "Symbol");
	assert.equal(_.isPlainObject(Object(Symbol())), false, "Symbol inside an object");
});

QUnit[typeof localStorage !== 'undefined' ? "test" : "skip" ]("isPlainObject(localStorage)", function( assert ) {
	assert.expect(1);

	assert.equal(_.isPlainObject(localStorage), false);
});

QUnit[ "assign" in Object ? "test" : "skip" ]("isPlainObject(Object.assign(...))", function(assert) {
	assert.expect(1);

	var parentObj = { foo: "bar" };
	var childObj = Object.assign(Object.create( parentObj), { bar: "foo" } );

	assert.ok(!_.isPlainObject(childObj), "isPlainObject(Object.assign(...))" );
});
