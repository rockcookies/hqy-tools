var HQY_isObject = require('../types/isObject');

var hasEnumBug = require('../helper/hasEnumBug');
var collectNonEnumProps = require('../helper/collectNonEnumProps');

// Retrieve all the property names of an object.
module.exports = function(obj) {
	if (!HQY_isObject(obj)) return [];
	var keys = [];
	for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
};
