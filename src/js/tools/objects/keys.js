var HQY_isObject = require('../types/isObject');
var HQY_has = require('./has');

var hasEnumBug = require('../helper/hasEnumBug');
var collectNonEnumProps = require('../helper/collectNonEnumProps');

var nativeKeys = Object.keys;

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`
module.exports = function(obj) {
	if (!HQY_isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	var keys = [];
	for (var key in obj) if (HQY_has(obj, key)) keys.push(key);
	// Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}
