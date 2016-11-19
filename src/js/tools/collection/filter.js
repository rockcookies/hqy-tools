var cb = require('../helper/cb');

var HQY_each = require('./each');

// Return all the elements that pass a truth test.
// Aliased as `select`.
module.exports = function(obj, predicate, context) {
	var results = [];
	predicate = cb(predicate, context);
	HQY_each(obj, function(value, index, list) {
		if (predicate(value, index, list)) results.push(value);
	});
	return results;
};
