var HQY_types = require('./types');

var enumBug = require('../helper/enumBug');

var hasEnumBug = enumBug.hasEnumBug;
var collectNonEnumProps = enumBug.collectNonEnumProps;

// Retrieve all the property names of an object.
module.exports = function(obj) {
	if (!HQY_types.isObject(obj)) return [];
	var keys = [];
	for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
};
