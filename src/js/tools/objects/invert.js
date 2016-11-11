var HQY_keys = require('./keys');

// Invert the keys and values of an object. The values must be serializable.
module.exports = function(obj) {
	var result = {};
	var keys = HQY_keys(obj);
	for (var i = 0, length = keys.length; i < length; i++) {
		result[obj[keys[i]]] = keys[i];
	}
	return result;
};
