var HQY_isArray = require('../types/isArray');

var deepGet = require('../helper/deepGet');

// Generates a function for a given object that returns a given property.
module.exports = function(obj) {
	if (obj == null) {
		return function(){};
	}
	return function(path) {
		return !HQY_isArray(path) ? obj[path] : deepGet(obj, path);
	};
};
