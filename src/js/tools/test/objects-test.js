var underscore = require('underscore');

var _ = {
	each: require('../collection/each'),
	map: require('../collection/map'),
	filter: require('../collection/filter'),
	constant: require('../utility/constant'),
	isNaN: require('../types/isNaN'),
	isArray: require('../types/isArray'),
	isPlainObject: require('../types/isPlainObject'),
	partial: require('../functions/partial'),

	keys: require('../objects/keys'),
	allKeys: require('../objects/allKeys'),
	values: require('../objects/values'),
	extend: require('../objects/extend'),
	extendDeep: require('../objects/extendDeep'),
	extendOwn: require('../objects/assign'),
	assign: require('../objects/assign'),
	defaults: require('../objects/defaults'),
	property: require('../objects/property'),
	propertyOf: require('../objects/propertyOf'),
	matcher: require('../objects/matcher'),
	isMatch: require('../objects/isMatch'),
	clone: require('../objects/clone'),
	has: require('../objects/has'),
	invert: require('../objects/invert'),
	pick: require('../objects/pick'),
	omit: require('../objects/omit')
};


QUnit.module('Tools.Objects');

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

QUnit.test('extend', function(assert) {
	var result;
	assert.strictEqual(_.extend({}, {a: 'b'}).a, 'b', 'can extend an object with the attributes of another');
	assert.strictEqual(_.extend({a: 'x'}, {a: 'b'}).a, 'b', 'properties in source override destination');
	assert.strictEqual(_.extend({x: 'x'}, {a: 'b'}).x, 'x', "properties not in source don't get overridden");
	result = _.extend({x: 'x'}, {a: 'a'}, {b: 'b'});
	assert.deepEqual(result, {x: 'x', a: 'a', b: 'b'}, 'can extend from multiple source objects');
	result = _.extend({x: 'x'}, {a: 'a', x: 2}, {a: 'b'});
	assert.deepEqual(result, {x: 2, a: 'b'}, 'extending from multiple source objects last property trumps');
	result = _.extend({}, {a: void 0, b: null});
	assert.deepEqual(_.keys(result), ['a', 'b'], 'extend copies undefined values');

	var F = function() {};
	F.prototype = {a: 'b'};
	var subObj = new F();
	subObj.c = 'd';
	assert.deepEqual(_.extend({}, subObj), {a: 'b', c: 'd'}, 'extend copies all properties from source');
	_.extend(subObj, {});
	assert.notOk(subObj.hasOwnProperty('a'), "extend does not convert destination object's 'in' properties to 'own' properties");

	try {
		result = {};
		_.extend(result, null, void 0, {a: 1});
	} catch (e) { /* ignored */ }

	assert.strictEqual(result.a, 1, 'should not error on `null` or `undefined` sources');

	assert.strictEqual(_.extend(null, {a: 1}), null, 'extending null results in null');
	assert.strictEqual(_.extend(void 0, {a: 1}), void 0, 'extending undefined results in undefined');
});

QUnit.test('extendOwn', function(assert) {
	var result;
	assert.strictEqual(_.extendOwn({}, {a: 'b'}).a, 'b', 'can extend an object with the attributes of another');
	assert.strictEqual(_.extendOwn({a: 'x'}, {a: 'b'}).a, 'b', 'properties in source override destination');
	assert.strictEqual(_.extendOwn({x: 'x'}, {a: 'b'}).x, 'x', "properties not in source don't get overridden");
	result = _.extendOwn({x: 'x'}, {a: 'a'}, {b: 'b'});
	assert.deepEqual(result, {x: 'x', a: 'a', b: 'b'}, 'can extend from multiple source objects');
	result = _.extendOwn({x: 'x'}, {a: 'a', x: 2}, {a: 'b'});
	assert.deepEqual(result, {x: 2, a: 'b'}, 'extending from multiple source objects last property trumps');
	assert.deepEqual(_.extendOwn({}, {a: void 0, b: null}), {a: void 0, b: null}, 'copies undefined values');

	var F = function() {};
	F.prototype = {a: 'b'};
	var subObj = new F();
	subObj.c = 'd';
	assert.deepEqual(_.extendOwn({}, subObj), {c: 'd'}, 'copies own properties from source');

	result = {};
	assert.deepEqual(_.extendOwn(result, null, void 0, {a: 1}), {a: 1}, 'should not error on `null` or `undefined` sources');

	_.each(['a', 5, null, false], function(val) {
		assert.strictEqual(_.extendOwn(val, {a: 1}), val, 'extending non-objects results in returning the non-object value');
	});

	assert.strictEqual(_.extendOwn(void 0, {a: 1}), void 0, 'extending undefined results in undefined');

	result = _.extendOwn({a: 1, 0: 2, 1: '5', length: 6}, {0: 1, 1: 2, length: 2});
	assert.deepEqual(result, {a: 1, 0: 1, 1: 2, length: 2}, 'should treat array-like objects like normal objects');
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

QUnit.test('omit', function(assert) {
	var result;
	result = _.omit({a: 1, b: 2, c: 3}, 'b');
	assert.deepEqual(result, {a: 1, c: 3}, 'can omit a single named property');
	result = _.omit({a: 1, b: 2, c: 3}, 'a', 'c');
	assert.deepEqual(result, {b: 2}, 'can omit several named properties');
	result = _.omit({a: 1, b: 2, c: 3}, ['b', 'c']);
	assert.deepEqual(result, {a: 1}, 'can omit properties named in an array');
	result = _.omit(['a', 'b'], 0);
	assert.deepEqual(result, {1: 'b'}, 'can omit numeric properties');

	assert.deepEqual(_.omit(null, 'a', 'b'), {}, 'non objects return empty object');
	assert.deepEqual(_.omit(void 0, 'toString'), {}, 'null/undefined return empty object');
	assert.deepEqual(_.omit(5, 'toString', 'b'), {}, 'returns empty object for primitives');

	var data = {a: 1, b: 2, c: 3};
	var callback = function(value, key, object) {
		assert.strictEqual(key, {1: 'a', 2: 'b', 3: 'c'}[value]);
		assert.strictEqual(object, data);
		return value !== this.value;
	};
	result = _.omit(data, callback, {value: 2});
	assert.deepEqual(result, {b: 2}, 'can accept a predicate');

	var Obj = function(){};
	Obj.prototype = {a: 1, b: 2, c: 3};
	var instance = new Obj();
	assert.deepEqual(_.omit(instance, 'b'), {a: 1, c: 3}, 'include prototype props');

	assert.deepEqual(_.omit(data, function(val, key) {
		return this[key] === 3 && this === instance;
	}, instance), {a: 1, b: 2}, 'function is given context');
});


QUnit.test('defaults', function(assert) {
	var options = {zero: 0, one: 1, empty: '', nan: NaN, nothing: null};

	_.defaults(options, {zero: 1, one: 10, twenty: 20, nothing: 'str'});
	assert.strictEqual(options.zero, 0, 'value exists');
	assert.strictEqual(options.one, 1, 'value exists');
	assert.strictEqual(options.twenty, 20, 'default applied');
	assert.strictEqual(options.nothing, null, "null isn't overridden");

	_.defaults(options, {empty: 'full'}, {nan: 'nan'}, {word: 'word'}, {word: 'dog'});
	assert.strictEqual(options.empty, '', 'value exists');
	assert.ok(_.isNaN(options.nan), "NaN isn't overridden");
	assert.strictEqual(options.word, 'word', 'new value is added, first one wins');

	try {
		options = {};
		_.defaults(options, null, void 0, {a: 1});
	} catch (e) { /* ignored */ }

	assert.strictEqual(options.a, 1, 'should not error on `null` or `undefined` sources');

	assert.deepEqual(_.defaults(null, {a: 1}), {a: 1}, 'defaults skips nulls');
	assert.deepEqual(_.defaults(void 0, {a: 1}), {a: 1}, 'defaults skips undefined');
});

QUnit.test('clone', function(assert) {
	var moe = {name: 'moe', lucky: [13, 27, 34]};
	var clone = _.clone(moe);
	assert.strictEqual(clone.name, 'moe', 'the clone as the attributes of the original');

	clone.name = 'curly';
	assert.ok(clone.name === 'curly' && moe.name === 'moe', 'clones can change shallow attributes without affecting the original');

	clone.lucky.push(101);
	assert.strictEqual(underscore.last(moe.lucky), 101, 'changes to deep attributes are shared with the original');

	assert.strictEqual(_.clone(void 0), void 0, 'non objects should not be changed by clone');
	assert.strictEqual(_.clone(1), 1, 'non objects should not be changed by clone');
	assert.strictEqual(_.clone(null), null, 'non objects should not be changed by clone');
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


QUnit.test('property', function(assert) {
	var stooge = {name: 'moe'};
	assert.strictEqual(_.property('name')(stooge), 'moe', 'should return the property with the given name');
	assert.strictEqual(_.property('name')(null), void 0, 'should return undefined for null values');
	assert.strictEqual(_.property('name')(void 0), void 0, 'should return undefined for undefined values');
	assert.strictEqual(_.property(null)('foo'), void 0, 'should return undefined for null object');
	assert.strictEqual(_.property('x')({x: null}), null, 'can fetch null values');
	assert.strictEqual(_.property('length')(null), void 0, 'does not crash on property access of non-objects');

	// Deep property access
	assert.strictEqual(_.property('a')({a: 1}), 1, 'can get a direct property');
	assert.strictEqual(_.property(['a', 'b'])({a: {b: 2}}), 2, 'can get a nested property');
	assert.strictEqual(_.property(['a'])({a: false}), false, 'can fetch falsy values');
	assert.strictEqual(_.property(['x', 'y'])({x: {y: null}}), null, 'can fetch null values deeply');
	assert.strictEqual(_.property(['x', 'y'])({x: null}), void 0, 'does not crash on property access of nested non-objects');
	assert.strictEqual(_.property([])({x: 'y'}), void 0, 'returns `undefined` for a path that is an empty array');
});

QUnit.test('propertyOf', function(assert) {
	var stoogeRanks = _.propertyOf({curly: 2, moe: 1, larry: 3});
	assert.strictEqual(stoogeRanks('curly'), 2, 'should return the property with the given name');
	assert.strictEqual(stoogeRanks(null), void 0, 'should return undefined for null values');
	assert.strictEqual(stoogeRanks(void 0), void 0, 'should return undefined for undefined values');
	assert.strictEqual(_.propertyOf({a: null})('a'), null, 'can fetch null values');

	function MoreStooges() { this.shemp = 87; }
	MoreStooges.prototype = {curly: 2, moe: 1, larry: 3};
	var moreStoogeRanks = _.propertyOf(new MoreStooges());
	assert.strictEqual(moreStoogeRanks('curly'), 2, 'should return properties from further up the prototype chain');

	var nullPropertyOf = _.propertyOf(null);
	assert.strictEqual(nullPropertyOf('curly'), void 0, 'should return undefined when obj is null');

	var undefPropertyOf = _.propertyOf(void 0);
	assert.strictEqual(undefPropertyOf('curly'), void 0, 'should return undefined when obj is undefined');

	var deepPropertyOf = _.propertyOf({curly: {number: 2}, joe: {number: null}});
	assert.strictEqual(deepPropertyOf(['curly', 'number']), 2, 'can fetch nested properties of obj');
	assert.strictEqual(deepPropertyOf(['joe', 'number']), null, 'can fetch nested null properties of obj');
});

QUnit.test('isMatch', function(assert) {
	var moe = {name: 'Moe Howard', hair: true};
	var curly = {name: 'Curly Howard', hair: false};

	assert.strictEqual(_.isMatch(moe, {hair: true}), true, 'Returns a boolean');
	assert.strictEqual(_.isMatch(curly, {hair: true}), false, 'Returns a boolean');

	assert.strictEqual(_.isMatch(5, {__x__: void 0}), false, 'can match undefined props on primitives');
	assert.strictEqual(_.isMatch({__x__: void 0}, {__x__: void 0}), true, 'can match undefined props');

	assert.strictEqual(_.isMatch(null, {}), true, 'Empty spec called with null object returns true');
	assert.strictEqual(_.isMatch(null, {a: 1}), false, 'Non-empty spec called with null object returns false');

	_.each([null, void 0], function(item) { assert.strictEqual(_.isMatch(item, null), true, 'null matches null'); });
	_.each([null, void 0], function(item) { assert.strictEqual(_.isMatch(item, null), true, 'null matches {}'); });
	assert.strictEqual(_.isMatch({b: 1}, {a: void 0}), false, 'handles undefined values (1683)');

	_.each([true, 5, NaN, null, void 0], function(item) {
		assert.strictEqual(_.isMatch({a: 1}, item), true, 'treats primitives as empty');
	});

	function Prototest() {}
	Prototest.prototype.x = 1;
	var specObj = new Prototest;
	assert.strictEqual(_.isMatch({x: 2}, specObj), true, 'spec is restricted to own properties');

	specObj.y = 5;
	assert.strictEqual(_.isMatch({x: 1, y: 5}, specObj), true);
	assert.strictEqual(_.isMatch({x: 1, y: 4}, specObj), false);

	assert.ok(_.isMatch(specObj, {x: 1, y: 5}), 'inherited and own properties are checked on the test object');

	Prototest.x = 5;
	assert.ok(_.isMatch({x: 5, y: 1}, Prototest), 'spec can be a function');

    //null edge cases
    var oCon = {constructor: Object};
    assert.deepEqual(_.map([null, void 0, 5, {}], _.partial(_.isMatch, _.partial.placeholder, oCon)), [false, false, false, true], 'doesnt falsy match constructor on undefined/null');
});

QUnit.test('matcher', function(assert) {
	var moe = {name: 'Moe Howard', hair: true};
	var curly = {name: 'Curly Howard', hair: false};
	var stooges = [moe, curly];

	assert.strictEqual(_.matcher({hair: true})(moe), true, 'Returns a boolean');
	assert.strictEqual(_.matcher({hair: true})(curly), false, 'Returns a boolean');

	assert.strictEqual(_.matcher({__x__: void 0})(5), false, 'can match undefined props on primitives');
	assert.strictEqual(_.matcher({__x__: void 0})({__x__: void 0}), true, 'can match undefined props');

	assert.strictEqual(_.matcher({})(null), true, 'Empty spec called with null object returns true');
	assert.strictEqual(_.matcher({a: 1})(null), false, 'Non-empty spec called with null object returns false');

	assert.strictEqual(underscore.find(stooges, _.matcher({hair: false})), curly, 'returns a predicate that can be used by finding functions.');
	assert.strictEqual(underscore.find(stooges, _.matcher(moe)), moe, 'can be used to locate an object exists in a collection.');
	assert.deepEqual(_.filter([null, void 0], _.matcher({a: 1})), [], 'Do not throw on null values.');

	assert.deepEqual(_.filter([null, void 0], _.matcher(null)), [null, void 0], 'null matches null');
	assert.deepEqual(_.filter([null, void 0], _.matcher({})), [null, void 0], 'null matches {}');
	assert.deepEqual(_.filter([{b: 1}], _.matcher({a: void 0})), [], 'handles undefined values (1683)');

	_.each([true, 5, NaN, null, void 0], function(item) {
		assert.strictEqual(_.matcher(item)({a: 1}), true, 'treats primitives as empty');
	});

	function Prototest() {}
	Prototest.prototype.x = 1;
	var specObj = new Prototest;
	var protospec = _.matcher(specObj);
	assert.strictEqual(protospec({x: 2}), true, 'spec is restricted to own properties');

	specObj.y = 5;
	protospec = _.matcher(specObj);
	assert.strictEqual(protospec({x: 1, y: 5}), true);
	assert.strictEqual(protospec({x: 1, y: 4}), false);

	assert.ok(_.matcher({x: 1, y: 5})(specObj), 'inherited and own properties are checked on the test object');

	Prototest.x = 5;
	assert.ok(_.matcher(Prototest)({x: 5, y: 1}), 'spec can be a function');

    // #1729
    var o = {b: 1};
    var m = _.matcher(o);

    assert.strictEqual(m({b: 1}), true);
    o.b = 2;
    o.a = 1;
    assert.strictEqual(m({b: 1}), true, 'changing spec object doesnt change matches result');


    //null edge cases
    var oCon = _.matcher({constructor: Object});
    assert.deepEqual(_.map([null, void 0, 5, {}], oCon), [false, false, false, true], 'doesnt falsy match constructor on undefined/null');
});


QUnit.test( "extendDeep(Object, Object)", function( assert ) {
	assert.expect( 28 );

	var empty, optionsWithLength, optionsWithDate, myKlass,
		customObject, optionsWithCustomObject, MyNumber, ret,
		nullUndef, target, recursive, obj,
		defaults, defaultsCopy, options1, options1Copy, options2, options2Copy, merged2,
		settings = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
		options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
		deep1 = { "foo": { "bar": true } },
		deep2 = { "foo": { "baz": true }, "foo2": document },
		deep2copy = { "foo": { "baz": true }, "foo2": document },
		deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
		arr = [ 1, 2, 3 ],
		nestedarray = { "arr": arr };

	_.extendDeep(settings, options);
	assert.deepEqual( settings, merged, "Check if extended: settings must be extended" );
	assert.deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	_.extendDeep( settings, null, options );
	assert.deepEqual( settings, merged, "Check if extended: settings must be extended" );
	assert.deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	_.extendDeep( deep1, deep2 );
	assert.deepEqual( deep1[ "foo" ], deepmerged[ "foo" ], "Check if foo: settings must be extended" );
	assert.deepEqual( deep2[ "foo" ], deep2copy[ "foo" ], "Check if not deep2: options must not be modified" );
	assert.equal( deep1[ "foo2" ], document, "Make sure that a deep clone was not attempted on the document" );

	assert.ok( _.extendDeep( {}, nestedarray )[ "arr" ] !== arr, "Deep extend of object must clone child array" );

	// #5991
	assert.ok( _.isArray( _.extendDeep({ "arr": {} }, nestedarray )[ "arr" ] ), "Cloned array have to be an Array" );
	assert.ok( _.isPlainObject( _.extendDeep({ "arr": arr }, { "arr": {} } )[ "arr" ] ), "Cloned object have to be an plain object" );

	empty = {};
	optionsWithLength = { "foo": { "length": -1 } };
	_.extendDeep(empty, optionsWithLength );
	assert.deepEqual( empty[ "foo" ], optionsWithLength[ "foo" ], "The length property must copy correctly" );

	empty = {};
	optionsWithDate = { "foo": { "date": new Date() } };
	_.extendDeep( empty, optionsWithDate );
	assert.deepEqual( empty[ "foo" ], optionsWithDate[ "foo" ], "Dates copy correctly" );

	/** @constructor */
	myKlass = function() {};
	customObject = new myKlass();
	optionsWithCustomObject = { "foo": { "date": customObject } };
	empty = {};
	_.extendDeep( empty, optionsWithCustomObject );
	assert.ok( empty[ "foo" ] && empty[ "foo" ][ "date" ] === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { "someMethod": function() {} };
	empty = {};
	_.extendDeep( empty, optionsWithCustomObject );
	assert.ok( empty[ "foo" ] && empty[ "foo" ][ "date" ] === customObject, "Custom objects copy correctly" );

	MyNumber = Number;

	ret = _.extendDeep( { "foo": 4 }, { "foo": new MyNumber( 5 ) } );
	assert.ok( parseInt( ret.foo, 10 ) === 5, "Wrapped numbers copy correctly" );

	nullUndef = _.extendDeep( {}, options, { "xnumber2": null } );
	assert.ok( nullUndef[ "xnumber2" ] === null, "Check to make sure null values are copied" );

	nullUndef = _.extendDeep( {}, options, { "xnumber2": undefined } );
	assert.ok( nullUndef[ "xnumber2" ] === options[ "xnumber2" ], "Check to make sure undefined values are not copied" );

	nullUndef = _.extendDeep( {}, options, { "xnumber0": null } );
	assert.ok( nullUndef[ "xnumber0" ] === null, "Check to make sure null values are inserted" );

	target = {};
	recursive = { foo:target, bar:5 };
	_.extendDeep( target, recursive );
	assert.deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	ret = _.extendDeep( { foo: [] }, { foo: [ 0 ] } ); // 1907
	assert.equal( ret.foo.length, 1, "Check to make sure a value with coercion 'false' copies over when necessary to fix #1907" );

	ret = _.extendDeep( { foo: "1,2,3" }, { foo: [ 1, 2, 3 ] } );
	assert.ok( typeof ret.foo !== "string", "Check to make sure values equal with coercion (but not actually equal) overwrite correctly" );

	ret = _.extendDeep( { foo:"bar" }, { foo:null } );
	assert.ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	obj = { foo:null };
	_.extendDeep( obj, { foo:"notnull" } );
	assert.equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	_.extendDeep( func, { key: "value" } );
	assert.equal( func.key, "value", "Verify a function can be extended" );

	defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	options1 = { xnumber2: 1, xstring2: "x" };
	options1Copy = { xnumber2: 1, xstring2: "x" };
	options2 = { xstring2: "xx", xxx: "newstringx" };
	options2Copy = { xstring2: "xx", xxx: "newstringx" };
	merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	settings = _.extendDeep( {}, defaults, options1, options2 );
	assert.deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	assert.deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	assert.deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	assert.deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
} );


QUnit[Object.defineProperties ? 'test' : 'skip']("extendDeep(Object, Object {created with \"defineProperties\"})", function( assert ) {
	assert.expect(2);

	var definedObj = Object.defineProperties( {}, {
		"enumerableProp": {
			get: function() {
				return true;
			},
			enumerable: true
		},
		"nonenumerableProp": {
			get: function() {
				return true;
			}
		}
	} ),
	accessorObj = {};

	_.extendDeep( accessorObj, definedObj );
	assert.equal( accessorObj.enumerableProp, true, "Verify that getters are transferred" );
	assert.equal( accessorObj.nonenumerableProp, undefined, "Verify that non-enumerable getters are ignored" );
});

QUnit.test("extendDeep(true,{},{a:[], o:{}}); deep copy with array, followed by object", function( assert ) {
	assert.expect( 2 );

	var result, initial = {

		// This will make "copyIsArray" true
		array: [ 1, 2, 3, 4 ],

		// If "copyIsArray" doesn't get reset to false, the check
		// will evaluate true and enter the array copy block
		// instead of the object copy block. Since the ternary in the
		// "copyIsArray" block will evaluate to false
		// (check if operating on an array with ), this will be
		// replaced by an empty array.
		object: {}
	};

	result = _.extendDeep( {}, initial );

	assert.deepEqual( result, initial, "The [result] and [initial] have equal shape and values" );
	assert.ok( !_.isArray( result.object ), "result.object wasn't paved with an empty array" );
} );
