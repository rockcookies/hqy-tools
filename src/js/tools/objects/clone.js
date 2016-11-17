var HQY_isObject = require('../types/isObject');
var HQY_isArray = require('../types/isArray');

var HQY_extend = require('./extend');

// Create a (shallow-cloned) duplicate of an object.
module.exports = function(obj) {
	if (!HQY_isObject(obj)) return obj;
	return HQY_isArray(obj) ? obj.slice() : HQY_extend({}, obj);
};
