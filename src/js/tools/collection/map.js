var cb = require('../helper/cb');
var isArrayLike = require('../helper/isArrayLike');

var HQY_keys = require('../objects/keys');

// Return the results of applying the iteratee to each element.
module.exports = function(obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	var keys = !isArrayLike(obj) && HQY_keys(obj),
	length = (keys || obj).length,
	results = Array(length);
	for (var index = 0; index < length; index++) {
		var currentKey = keys ? keys[index] : index;
		results[index] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
};
