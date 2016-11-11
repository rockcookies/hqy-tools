var _ = require('./test-mixin')({}, require('../objects/types'), {
	each: require('../collection/each'),
	constant: require('../utility/constant'),

	keys: require('../objects/keys'),
	allKeys: require('../objects/allKeys'),
	values: require('../objects/values'),
	has: require('../objects/has'),
	invert: require('../objects/invert'),
	pick: require('../objects/pick')
});


QUnit.module('Objects');

var testElement = typeof document === 'object' ? document.createElement('div') : void 0;

QUnit.test('keys', function(assert) {
	assert.deepEqual(_.keys({one: 1, two: 2}), ['one', 'two'], 'can extract the keys from an object');
	// the test above is not safe because it relies on for-in enumeration order
	var a = []; a[1] = 0;
	assert.deepEqual(_.keys(a), ['1'], 'is not fooled by sparse arrays; see issue #95');
	assert.deepEqual(_.keys(null), []);
	assert.deepEqual(_.keys(void 0), []);
	assert.deepEqual(_.keys(1), []);
	assert.deepEqual(_.keys('a'), []);
	assert.deepEqual(_.keys(true), []);

	// keys that may be missed if the implementation isn't careful
	var trouble = {
		constructor: Object,
		valueOf: _.noop,
		hasOwnProperty: null,
		toString: 5,
		toLocaleString: void 0,
		propertyIsEnumerable: /a/,
		isPrototypeOf: this,
		__defineGetter__: Boolean,
		__defineSetter__: {},
		__lookupSetter__: false,
		__lookupGetter__: []
	};
	var troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable',
	'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupSetter__', '__lookupGetter__'].sort();

	assert.deepEqual(_.keys(trouble).sort(), troubleKeys, 'matches non-enumerable properties');
});

QUnit.test('allKeys', function(assert) {
	assert.deepEqual(_.allKeys({one: 1, two: 2}), ['one', 'two'], 'can extract the allKeys from an object');
	// the test above is not safe because it relies on for-in enumeration order
	var a = []; a[1] = 0;
	assert.deepEqual(_.allKeys(a), ['1'], 'is not fooled by sparse arrays; see issue #95');

	a.a = a;
	assert.deepEqual(_.allKeys(a), ['1', 'a'], 'is not fooled by sparse arrays with additional properties');

	_.each([null, void 0, 1, 'a', true, NaN, {}, [], new Number(5), new Date(0)], function(val) {
		assert.deepEqual(_.allKeys(val), []);
	});

	// allKeys that may be missed if the implementation isn't careful
	var trouble = {
		constructor: Object,
		valueOf: _.noop,
		hasOwnProperty: null,
		toString: 5,
		toLocaleString: void 0,
		propertyIsEnumerable: /a/,
		isPrototypeOf: this
	};
	var troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable',
	'isPrototypeOf'].sort();
	assert.deepEqual(_.allKeys(trouble).sort(), troubleKeys, 'matches non-enumerable properties');

	function A() {}
	A.prototype.foo = 'foo';
	var b = new A();
	b.bar = 'bar';
	assert.deepEqual(_.allKeys(b).sort(), ['bar', 'foo'], 'should include inherited keys');

	function y() {}
	y.x = 'z';
	assert.deepEqual(_.allKeys(y), ['x'], 'should get keys from constructor');
});

QUnit.test('invert', function(assert) {
	var obj = {first: 'Moe', second: 'Larry', third: 'Curly'};
	assert.deepEqual(_.keys(_.invert(obj)), ['Moe', 'Larry', 'Curly'], 'can invert an object');
	assert.deepEqual(_.invert(_.invert(obj)), obj, 'two inverts gets you back where you started');

	obj = {length: 3};
	assert.strictEqual(_.invert(obj)['3'], 'length', 'can invert an object with "length"');
});

QUnit.test('values', function(assert) {
	assert.deepEqual(_.values({one: 1, two: 2}), [1, 2], 'can extract the values from an object');
	assert.deepEqual(_.values({one: 1, two: 2, length: 3}), [1, 2, 3], '... even when one of them is "length"');
});

QUnit.test('pick', function(assert) {
	var result;
	result = _.pick({a: 1, b: 2, c: 3}, 'a', 'c');
	assert.deepEqual(result, {a: 1, c: 3}, 'can restrict properties to those named');
	result = _.pick({a: 1, b: 2, c: 3}, ['b', 'c']);
	assert.deepEqual(result, {b: 2, c: 3}, 'can restrict properties to those named in an array');
	result = _.pick({a: 1, b: 2, c: 3}, ['a'], 'b');
	assert.deepEqual(result, {a: 1, b: 2}, 'can restrict properties to those named in mixed args');
	result = _.pick(['a', 'b'], 1);
	assert.deepEqual(result, {1: 'b'}, 'can pick numeric properties');

	_.each([null, void 0], function(val) {
		assert.deepEqual(_.pick(val, 'hasOwnProperty'), {}, 'Called with null/undefined');
		assert.deepEqual(_.pick(val, _.constant(true)), {});
	});
	assert.deepEqual(_.pick(5, 'toString', 'b'), {toString: Number.prototype.toString}, 'can iterate primitives');

	var data = {a: 1, b: 2, c: 3};
	var callback = function(value, key, object) {
		assert.strictEqual(key, {1: 'a', 2: 'b', 3: 'c'}[value]);
		assert.strictEqual(object, data);
		return value !== this.value;
	};
	result = _.pick(data, callback, {value: 2});
	assert.deepEqual(result, {a: 1, c: 3}, 'can accept a predicate and context');

	var Obj = function(){};
	Obj.prototype = {a: 1, b: 2, c: 3};
	var instance = new Obj();
	assert.deepEqual(_.pick(instance, 'a', 'c'), {a: 1, c: 3}, 'include prototype props');

	assert.deepEqual(_.pick(data, function(val, key) {
		return this[key] === 3 && this === instance;
	}, instance), {c: 3}, 'function is given context');

	assert.notOk(_.has(_.pick({}, 'foo'), 'foo'), 'does not set own property if property not in object');
	_.pick(data, function(value, key, obj) {
		assert.strictEqual(obj, data, 'passes same object as third parameter of iteratee');
	});
});

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

QUnit.test('has', function(assert) {
	var obj = {foo: 'bar', func: function(){}};
	assert.ok(_.has(obj, 'foo'), 'checks that the object has a property.');
	assert.notOk(_.has(obj, 'baz'), "returns false if the object doesn't have the property.");
	assert.ok(_.has(obj, 'func'), 'works for functions too.');
	obj.hasOwnProperty = null;
	assert.ok(_.has(obj, 'foo'), 'works even when the hasOwnProperty method is deleted.');
	var child = {};
	child.prototype = obj;
	assert.notOk(_.has(child, 'foo'), 'does not check the prototype chain for a property.');
	assert.strictEqual(_.has(null, 'foo'), false, 'returns false for null');
	assert.strictEqual(_.has(void 0, 'foo'), false, 'returns false for undefined');

	assert.ok(_.has({a: {b: 'foo'}}, ['a', 'b']), 'can check for nested properties.');
	assert.notOk(_.has({a: child}, ['a', 'foo']), 'does not check the prototype of nested props.');
});


