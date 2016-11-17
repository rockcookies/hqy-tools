var HQY_isFunction = require('../types/isFunction');
var HQY_allKeys = require('./allKeys');

var flatten = require('../helper/flatten');
var restArgs = require('../helper/restArgs');
var optimizeCb = require('../helper/optimizeCb');

// Internal pick helper function to determine if `obj` has key `key`.
var keyInObj = function(value, key, obj) {
	return key in obj;
};

// Return a copy of the object only containing the whitelisted properties.
module.exports = restArgs(function(obj, keys) {
	var result = {}, iteratee = keys[0];
	if (obj == null) return result;
	if (HQY_isFunction(iteratee)) {
		if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
		keys = HQY_allKeys(obj);
	} else {
		iteratee = keyInObj;
		keys = flatten(keys, false, false);
		obj = Object(obj);
	}
	for (var i = 0, length = keys.length; i < length; i++) {
		var key = keys[i];
		var value = obj[key];
		if (iteratee(value, key, obj)) result[key] = value;
	}
	return result;
});
