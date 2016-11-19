var cb = require('../helper/cb');
var isArrayLike = require('../helper/isArrayLike');

var HQY_keys = require('../objects/keys');

// Determine whether all of the elements match a truth test.
// Aliased as `all`.
module.exports = function(obj, predicate, context) {
	predicate = cb(predicate, context);
	var keys = !isArrayLike(obj) && HQY_keys(obj),
	length = (keys || obj).length;
	for (var index = 0; index < length; index++) {
		var currentKey = keys ? keys[index] : index;
		if (!predicate(obj[currentKey], currentKey, obj)) return false;
	}
	return true;
};
