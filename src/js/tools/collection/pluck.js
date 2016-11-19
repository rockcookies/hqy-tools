var HQY_property = require('../objects/property');
var HQY_map = require('./map');

// Convenience version of a common use case of `map`: fetching a property.
module.exports = function(obj, key) {
	return HQY_map(obj, HQY_property(key));
};
