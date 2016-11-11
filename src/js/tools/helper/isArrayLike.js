var getLength = require('./getLength');

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

module.exports = function(collection) {
	var length = getLength(collection);
	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
