var _ = require('./test-mixin')({}, {
	times: require('../utility/times'),

	each: require('../collection/each')
});

var arrayContains = require('../helper/arrayContains');

QUnit.module('Collections');

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
	_.times(1000, function() { _.each([], function(){}); });
	var count = 0;
	obj = {1: 'foo', 2: 'bar', 3: 'baz'};
	_.each(obj, function(){ count++; });
	assert.strictEqual(count, 3, 'the fun should be called only 3 times');

	var answer = null;
	_.each([1, 2, 3], function(num, index, arr){ if (arrayContains(arr, num)) answer = true; });
	assert.ok(answer, 'can reference the original collection from inside the iterator');

	answers = 0;
	_.each(null, function(){ ++answers; });
	assert.strictEqual(answers, 0, 'handles a null properly');

	_.each(false, function(){});

	var a = [1, 2, 3];
	assert.strictEqual(_.each(a, function(){}), a);
	assert.strictEqual(_.each(null, function(){}), null);
});
