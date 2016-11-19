var getLength = require('../helper/getLength');

var HQY_includes = require('../collection/includes');

// Produce an array that contains every item shared between all the
// passed-in arrays.
module.exports = function(array) {
	var result = [];
	var argsLength = arguments.length;
	for (var i = 0, length = getLength(array); i < length; i++) {
		var item = array[i];
		if (HQY_includes(result, item)) continue;
		var j;
		for (j = 1; j < argsLength; j++) {
			if (!HQY_includes(arguments[j], item)) break;
		}
		if (j === argsLength) result.push(item);
	}
	return result;
};
