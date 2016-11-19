var HQY_values = require('../objects/values');
var HQY_clone = require('../objects/clone');
var HQY_random = require('../utility/random');

var getLength = require('../helper/getLength');
var isArrayLike = require('../helper/isArrayLike');

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `map`.
module.exports = function(obj, n, guard) {
	if (n == null || guard) {
		if (!isArrayLike(obj)) obj = HQY_values(obj);
		return obj[HQY_random(obj.length - 1)];
	}
	var sample = isArrayLike(obj) ? HQY_clone(obj) : HQY_values(obj);
	var length = getLength(sample);
	n = Math.max(Math.min(n, length), 0);
	var last = length - 1;
	for (var index = 0; index < n; index++) {
		var rand = HQY_random(index, last);
		var temp = sample[index];
		sample[index] = sample[rand];
		sample[rand] = temp;
	}
	return sample.slice(0, n);
};
