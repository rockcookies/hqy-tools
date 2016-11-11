var HQY_keys = require('./keys');

// Retrieve the values of an object's properties.
module.exports = function(obj) {
	var keys = HQY_keys(obj);
	var length = keys.length;
	var values = Array(length);
	for (var i = 0; i < length; i++) {
		values[i] = obj[keys[i]];
	}
	return values;
};
