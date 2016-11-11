var HQY_types = require('./types');
var HQY_has = require('./has');

var enumBug = require('../helper/enumBug');
var hasEnumBug = enumBug.hasEnumBug;

var collectNonEnumProps = enumBug.collectNonEnumProps;
var nativeKeys = Object.keys;

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`
module.exports = function(obj) {
	if (!HQY_types.isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	var keys = [];
	for (var key in obj) if (HQY_has(obj, key)) keys.push(key);
	// Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}
