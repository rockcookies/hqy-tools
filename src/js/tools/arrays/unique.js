var getLength = require('../helper/getLength');
var cb = require('../helper/cb');

var HQY_isBoolean = require('../types/isBoolean');
var HQY_includes = require('../collection/includes');

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.

module.exports = function(array, isSorted, iteratee, context) {
	if (!HQY_isBoolean(isSorted)) {
		context = iteratee;
		iteratee = isSorted;
		isSorted = false;
	}
	if (iteratee != null) iteratee = cb(iteratee, context);
	var result = [];
	var seen = [];
	for (var i = 0, length = getLength(array); i < length; i++) {
		var value = array[i],
		computed = iteratee ? iteratee(value, i, array) : value;
		if (isSorted) {
			if (!i || seen !== computed) result.push(value);
			seen = computed;
		} else if (iteratee) {
			if (!HQY_includes(seen, computed)) {
				seen.push(computed);
				result.push(value);
			}
		} else if (!HQY_includes(result, value)) {
			result.push(value);
		}
	}
	return result;
};
