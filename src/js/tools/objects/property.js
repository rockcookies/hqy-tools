var HQY_isArray = require('../types/isArray');

var shallowProperty = require('../helper/shallowProperty');
var deepGet = require('../helper/deepGet');

module.exports = function(path) {
	if (!HQY_isArray(path)) {
		return shallowProperty(path);
	}
	return function(obj) {
		return deepGet(obj, path);
	};
};
