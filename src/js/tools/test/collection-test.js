var underscore = require('underscore');

var _ = {
	isNumber: require('../types/isNumber'),
	isObject: require('../types/isObject'),
	partial: require('../functions/partial'),
	constant: require('../utility/constant'),
	range: require('../arrays/range'),

	each: require('../collection/each'),
	includes: require('../collection/includes'),
	contains: require('../collection/includes'),
	every: require('../collection/every'),
	filter: require('../collection/filter'),
	map: require('../collection/map'),
	pluck: require('../collection/pluck'),
	reject: require('../collection/reject'),
	some: require('../collection/some'),
	sample: require('../collection/sample'),
	shuffle: require('../collection/shuffle')
};

var arrayContains = require('../helper/arrayContains');

QUnit.module('Tools.Collections');

QUnit.test('each', function(assert) {
	_.each([1, 2, 3], function(num, i) {
		assert.strictEqual(num, i + 1, 'each iterators provide value and iteration count');
	});

	var answers = [];
	_.each([1, 2, 3], function(num){ answers.push(num * this.multiplier); }, {multiplier: 5});
	assert.deepEqual(answers, [5, 10, 15], 'context object property accessed');

	answers = [];
	_.each([1, 2, 3], function(num){ answers.push(num); });
	assert.deepEqual(answers, [1, 2, 3], 'can iterate a simple array');

	answers = [];
	var obj = {one: 1, two: 2, three: 3};
	obj.constructor.prototype.four = 4;
	_.each(obj, function(value, key){ answers.push(key); });
	assert.deepEqual(answers, ['one', 'two', 'three'], 'iterating over objects works, and ignores the object prototype.');
	delete obj.constructor.prototype.four;

	// ensure the each function is JITed
	underscore(1000).times(function() { _.each([], function(){}); });
	var count = 0;
	obj = {1: 'foo', 2: 'bar', 3: 'baz'};
	_.each(obj, function(){ count++; });
	assert.strictEqual(count, 3, 'the fun should be called only 3 times');

	var answer = null;
	_.each([1, 2, 3], function(num, index, arr){ if (_.includes(arr, num)) answer = true; });
	assert.ok(answer, 'can reference the original collection from inside the iterator');

	answers = 0;
	_.each(null, function(){ ++answers; });
	assert.strictEqual(answers, 0, 'handles a null properly');

	_.each(false, function(){});

	var a = [1, 2, 3];
	assert.strictEqual(_.each(a, function(){}), a);
	assert.strictEqual(_.each(null, function(){}), null);
});

QUnit.test('lookupIterator with contexts', function(assert) {
	_.each([true, false, 'yes', '', 0, 1, {}], function(context) {
		_.each([1], function() {
			assert.strictEqual(typeof this, 'object', 'context is a wrapped primitive');
			assert.strictEqual(this.valueOf(), context, 'the unwrapped context is the specified primitive');
			assert.equal(this, context, 'context can be coerced to the specified primitive');
		}, context);
	});
});

QUnit.test('includes', function(assert) {
	_.each([null, void 0, 0, 1, NaN, {}, []], function(val) {
		assert.strictEqual(_.includes(val, 'hasOwnProperty'), false);
	});
	assert.strictEqual(_.includes([1, 2, 3], 2), true, 'two is in the array');
	assert.notOk(_.includes([1, 3, 9], 2), 'two is not in the array');

	assert.strictEqual(_.includes([5, 4, 3, 2, 1], 5, true), true, 'doesn\'t delegate to binary search');

	assert.strictEqual(_.includes({moe: 1, larry: 3, curly: 9}, 3), true, '_.includes on objects checks their values');

	var numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3];
	assert.strictEqual(_.includes(numbers, 1, 1), true, 'takes a fromIndex');
	assert.strictEqual(_.includes(numbers, 1, -1), false, 'takes a fromIndex');
	assert.strictEqual(_.includes(numbers, 1, -2), false, 'takes a fromIndex');
	assert.strictEqual(_.includes(numbers, 1, -3), true, 'takes a fromIndex');
	assert.strictEqual(_.includes(numbers, 1, 6), true, 'takes a fromIndex');
	assert.strictEqual(_.includes(numbers, 1, 7), false, 'takes a fromIndex');

	assert.ok(_.every([1, 2, 3], _.partial(_.includes, numbers)), 'fromIndex is guarded');
});


QUnit.test('map', function(assert) {
	var doubled = _.map([1, 2, 3], function(num){ return num * 2; });
	assert.deepEqual(doubled, [2, 4, 6], 'doubled numbers');

	var tripled = _.map([1, 2, 3], function(num){ return num * this.multiplier; }, {multiplier: 3});
	assert.deepEqual(tripled, [3, 6, 9], 'tripled numbers with context');

	var ids = _.map({length: 2, 0: {id: '1'}, 1: {id: '2'}}, function(n){
		return n.id;
	});
	assert.deepEqual(ids, ['1', '2'], 'Can use collection methods on Array-likes.');

	assert.deepEqual(_.map(null, _.noop), [], 'handles a null properly');

	assert.deepEqual(_.map([1], function() {
		return this.length;
	}, [5]), [1], 'called with context');

    // Passing a property name like _.pluck.
    var people = [{name: 'moe', age: 30}, {name: 'curly', age: 50}];
    assert.deepEqual(_.map(people, 'name'), ['moe', 'curly'], 'predicate string map to object properties');
});


QUnit.test('filter', function(assert) {
	var evenArray = [1, 2, 3, 4, 5, 6];
	var evenObject = {one: 1, two: 2, three: 3};
	var isEven = function(num){ return num % 2 === 0; };

	assert.deepEqual(_.filter(evenArray, isEven), [2, 4, 6]);
	assert.deepEqual(_.filter(evenObject, isEven), [2], 'can filter objects');
	assert.deepEqual(_.filter([{}, evenObject, []], 'two'), [evenObject], 'predicate string map to object properties');

	_.filter([1], function() {
		assert.strictEqual(this, evenObject, 'given context');
	}, evenObject);

    // Can be used like _.where.
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    assert.deepEqual(_.filter(list, {a: 1}), [{a: 1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]);
    assert.deepEqual(_.filter(list, {b: 2}), [{a: 1, b: 2}, {a: 2, b: 2}]);
    assert.deepEqual(_.filter(list, {}), list, 'Empty object accepts all items');
});

QUnit.test('reject', function(assert) {
	var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 === 0; });
	assert.deepEqual(odds, [1, 3, 5], 'rejected each even number');

	var context = 'obj';

	var evens = _.reject([1, 2, 3, 4, 5, 6], function(num){
		assert.strictEqual(context, 'obj');
		return num % 2 !== 0;
	}, context);
	assert.deepEqual(evens, [2, 4, 6], 'rejected each odd number');

	assert.deepEqual(_.reject([odds, {one: 1, two: 2, three: 3}], 'two'), [odds], 'predicate string map to object properties');

    // Can be used like _.where.
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    assert.deepEqual(_.reject(list, {a: 1}), [{a: 2, b: 2}]);
    assert.deepEqual(_.reject(list, {b: 2}), [{a: 1, b: 3}, {a: 1, b: 4}]);
    assert.deepEqual(_.reject(list, {}), [], 'Returns empty list given empty object');
});

QUnit.test('every', function(assert) {
	assert.ok(_.every([], _.identity), 'the empty set');
	assert.ok(_.every([true, true, true], _.identity), 'every true values');
	assert.notOk(_.every([true, false, true], _.identity), 'one false value');
	assert.ok(_.every([0, 10, 28], function(num){ return num % 2 === 0; }), 'even numbers');
	assert.notOk(_.every([0, 11, 28], function(num){ return num % 2 === 0; }), 'an odd number');
	assert.strictEqual(_.every([1], _.identity), true, 'cast to boolean - true');
	assert.strictEqual(_.every([0], _.identity), false, 'cast to boolean - false');
	assert.notOk(_.every([void 0, void 0, void 0], _.identity), 'works with arrays of undefined');

	var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
	assert.notOk(_.every(list, {a: 1, b: 2}), 'Can be called with object');
	assert.ok(_.every(list, 'a'), 'String mapped to object property');

	list = [{a: 1, b: 2}, {a: 2, b: 2, c: true}];
	assert.ok(_.every(list, {b: 2}), 'Can be called with object');
	assert.notOk(_.every(list, 'c'), 'String mapped to object property');

	assert.ok(_.every({a: 1, b: 2, c: 3, d: 4}, _.isNumber), 'takes objects');
	assert.notOk(_.every({a: 1, b: 2, c: 3, d: 4}, _.isObject), 'takes objects');
	assert.ok(_.every(['a', 'b', 'c', 'd'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
	assert.notOk(_.every(['a', 'b', 'c', 'd', 'f'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
});

QUnit.test('some', function(assert) {
	assert.notOk(_.some([]), 'the empty set');
	assert.notOk(_.some([false, false, false]), 'all false values');
	assert.ok(_.some([false, false, true]), 'one true value');
	assert.ok(_.some([null, 0, 'yes', false]), 'a string');
	assert.notOk(_.some([null, 0, '', false]), 'falsy values');
	assert.notOk(_.some([1, 11, 29], function(num){ return num % 2 === 0; }), 'all odd numbers');
	assert.ok(_.some([1, 10, 29], function(num){ return num % 2 === 0; }), 'an even number');
	assert.strictEqual(_.some([1], _.identity), true, 'cast to boolean - true');
	assert.strictEqual(_.some([0], _.identity), false, 'cast to boolean - false');
	assert.ok(_.some([false, false, true]));

	var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
	assert.notOk(_.some(list, {a: 5, b: 2}), 'Can be called with object');
	assert.ok(_.some(list, 'a'), 'String mapped to object property');

	list = [{a: 1, b: 2}, {a: 2, b: 2, c: true}];
	assert.ok(_.some(list, {b: 2}), 'Can be called with object');
	assert.notOk(_.some(list, 'd'), 'String mapped to object property');

	assert.ok(_.some({a: '1', b: '2', c: '3', d: '4', e: 6}, _.isNumber), 'takes objects');
	assert.notOk(_.some({a: 1, b: 2, c: 3, d: 4}, _.isObject), 'takes objects');
	assert.ok(_.some(['a', 'b', 'c', 'd'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
	assert.notOk(_.some(['x', 'y', 'z'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
});

QUnit.test('pluck', function(assert) {
	var people = [{name: 'moe', age: 30}, {name: 'curly', age: 50}];
	assert.deepEqual(_.pluck(people, 'name'), ['moe', 'curly'], 'pulls names out of objects');
	assert.deepEqual(_.pluck(people, 'address'), [void 0, void 0], 'missing properties are returned as undefined');
	//compat: most flexible handling of edge cases
	assert.deepEqual(_.pluck([{'[object Object]': 1}], {}), [1]);
});

QUnit.test('shuffle', function(assert) {
	assert.deepEqual(_.shuffle([1]), [1], 'behaves correctly on size 1 arrays');
	var numbers = _.range(20);
	var shuffled = _.shuffle(numbers);
	assert.notDeepEqual(numbers, shuffled, 'does change the order'); // Chance of false negative: 1 in ~2.4*10^18
	assert.notStrictEqual(numbers, shuffled, 'original object is unmodified');
	assert.deepEqual(numbers, underscore.sortBy(shuffled), 'contains the same members before and after shuffle');

	shuffled = _.shuffle({a: 1, b: 2, c: 3, d: 4});
	assert.strictEqual(shuffled.length, 4);
	assert.deepEqual(shuffled.sort(), [1, 2, 3, 4], 'works on objects');
});

QUnit.test('sample', function(assert) {
	assert.strictEqual(_.sample([1]), 1, 'behaves correctly when no second parameter is given');
	assert.deepEqual(_.sample([1, 2, 3], -2), [], 'behaves correctly on negative n');
	var numbers = _.range(10);
	var allSampled = _.sample(numbers, 10).sort();
	assert.deepEqual(allSampled, numbers, 'contains the same members before and after sample');
	allSampled = _.sample(numbers, 20).sort();
	assert.deepEqual(allSampled, numbers, 'also works when sampling more objects than are present');
	assert.ok(_.contains(numbers, _.sample(numbers)), 'sampling a single element returns something from the array');
	assert.strictEqual(_.sample([]), void 0, 'sampling empty array with no number returns undefined');
	assert.notStrictEqual(_.sample([], 5), [], 'sampling empty array with a number returns an empty array');
	assert.notStrictEqual(_.sample([1, 2, 3], 0), [], 'sampling an array with 0 picks returns an empty array');
	assert.deepEqual(_.sample([1, 2], -1), [], 'sampling a negative number of picks returns an empty array');
	assert.ok(_.contains([1, 2, 3], _.sample({a: 1, b: 2, c: 3})), 'sample one value from an object');
	var partialSample = _.sample(_.range(1000), 10);
	var partialSampleSorted = partialSample.sort();
	assert.notDeepEqual(partialSampleSorted, _.range(10), 'samples from the whole array, not just the beginning');
});

