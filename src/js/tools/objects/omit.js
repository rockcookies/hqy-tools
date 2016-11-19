var restArgs = require('../helper/restArgs');
var flatten = require('../helper/flatten');

var HQY_includes = require('../collection/includes');
var HQY_map = require('../collection/map');
var HQY_negate = require('../functions/negate');
var HQY_isFunction = require('../types/isFunction');
var HQY_pick = require('./pick');

// Return a copy of the object without the blacklisted properties.
module.exports = restArgs(function(obj, keys) {
	var iteratee = keys[0], context;
	if (HQY_isFunction(iteratee)) {
		iteratee = HQY_negate(iteratee);
		if (keys.length > 1) context = keys[1];
	} else {
		keys = HQY_map(flatten(keys, false, false), String);
		iteratee = function(value, key) {
			return !HQY_includes(keys, key);
		};
	}
	return HQY_pick(obj, iteratee, context);
});
