// Returns the first key on an object that passes a predicate test.

var cb = require('../helper/cb');

var HQY_keys = require('./keys');

module.exports = function(obj, predicate, context) {
	predicate = cb(predicate, context);
	var keys = HQY_keys(obj), key;
	for (var i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if (predicate(obj[key], key, obj)) return key;
	}
};
