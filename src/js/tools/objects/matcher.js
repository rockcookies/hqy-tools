var HQY_assign = require('./assign');
var HQY_isMatch = require('./isMatch');

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
module.exports = function(attrs) {
	attrs = HQY_assign({}, attrs);
	return function(obj) {
		return HQY_isMatch(obj, attrs);
	};
};
