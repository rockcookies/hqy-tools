var _ = {
	flatten: require('../arrays/flatten'),
	range: require('../arrays/range')
};

QUnit.module('Tools.Arrays');

QUnit.test('flatten', function(assert) {
	assert.deepEqual(_.flatten(null), [], 'supports null');
	assert.deepEqual(_.flatten(void 0), [], 'supports undefined');

	assert.deepEqual(_.flatten([[], [[]], []]), [], 'supports empty arrays');
	assert.deepEqual(_.flatten([[], [[]], []], true), [[]], 'can shallowly flatten empty arrays');

	var list = [1, [2], [3, [[[4]]]]];
	assert.deepEqual(_.flatten(list), [1, 2, 3, 4], 'can flatten nested arrays');
	assert.deepEqual(_.flatten(list, true), [1, 2, 3, [[[4]]]], 'can shallowly flatten nested arrays');
	var result = (function(){ return _.flatten(arguments); }(1, [2], [3, [[[4]]]]));
	assert.deepEqual(result, [1, 2, 3, 4], 'works on an arguments object');
	list = [[1], [2], [3], [[4]]];
	assert.deepEqual(_.flatten(list, true), [1, 2, 3, [4]], 'can shallowly flatten arrays containing only other arrays');

	assert.strictEqual(_.flatten([_.range(10), _.range(10), 5, 1, 3], true).length, 23, 'can flatten medium length arrays');
	assert.strictEqual(_.flatten([_.range(10), _.range(10), 5, 1, 3]).length, 23, 'can shallowly flatten medium length arrays');
	assert.strictEqual(_.flatten([new Array(1000000), _.range(56000), 5, 1, 3]).length, 1056003, 'can handle massive arrays');
	assert.strictEqual(_.flatten([new Array(1000000), _.range(56000), 5, 1, 3], true).length, 1056003, 'can handle massive arrays in shallow mode');

	var x = _.range(100000);
	for (var i = 0; i < 1000; i++) x = [x];
	assert.deepEqual(_.flatten(x), _.range(100000), 'can handle very deep arrays');
	assert.deepEqual(_.flatten(x, true), x[0], 'can handle very deep arrays in shallow mode');
});

QUnit.test('range', function(assert) {
	assert.deepEqual(_.range(0), [], 'range with 0 as a first argument generates an empty array');
	assert.deepEqual(_.range(4), [0, 1, 2, 3], 'range with a single positive argument generates an array of elements 0,1,2,...,n-1');
	assert.deepEqual(_.range(5, 8), [5, 6, 7], 'range with two arguments a &amp; b, a&lt;b generates an array of elements a,a+1,a+2,...,b-2,b-1');
	assert.deepEqual(_.range(3, 10, 3), [3, 6, 9], 'range with three arguments a &amp; b &amp; c, c &lt; b-a, a &lt; b generates an array of elements a,a+c,a+2c,...,b - (multiplier of a) &lt; c');
	assert.deepEqual(_.range(3, 10, 15), [3], 'range with three arguments a &amp; b &amp; c, c &gt; b-a, a &lt; b generates an array with a single element, equal to a');
	assert.deepEqual(_.range(12, 7, -2), [12, 10, 8], 'range with three arguments a &amp; b &amp; c, a &gt; b, c &lt; 0 generates an array of elements a,a-c,a-2c and ends with the number not less than b');
	assert.deepEqual(_.range(0, -10, -1), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9], 'final example in the Python docs');
	assert.strictEqual(1 / _.range(-0, 1)[0], -Infinity, 'should preserve -0');
	assert.deepEqual(_.range(8, 5), [8, 7, 6], 'negative range generates descending array');
	assert.deepEqual(_.range(-3), [0, -1, -2], 'negative range generates descending array');
});
