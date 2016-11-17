var HQY_isArray = require('../types/isArray');

var hasOwnProperty = Object.prototype.hasOwnProperty;

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
module.exports = function(obj, path) {
	if (!HQY_isArray(path)) {
		return obj != null && hasOwnProperty.call(obj, path);
	}
	var length = path.length;
	for (var i = 0; i < length; i++) {
		var key = path[i];
		if (obj == null || !hasOwnProperty.call(obj, key)) {
			return false;
		}
		obj = obj[key];
	}
	return !!length;
};
