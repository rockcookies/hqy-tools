var isArrayLike = require('./isArrayLike');
var getLength = require('./getLength');

var HQY_types = require('../objects/types');

// Internal implementation of a recursive `flatten` function.
var flatten = function(input, shallow, strict, output) {
	output = output || [];
	var idx = output.length;
	for (var i = 0, length = getLength(input); i < length; i++) {
		var value = input[i];
		if (isArrayLike(value) && (HQY_types.isArray(value) || HQY_types.isArguments(value))) {
			//flatten current level of array or arguments object
			if (shallow) {
				var j = 0, len = value.length;
				while (j < len) output[idx++] = value[j++];
			} else {
				flatten(value, shallow, strict, output);
				idx = output.length;
			}
		} else if (!strict) {
			output[idx++] = value;
		}
	}
	return output;
};

module.exports = flatten;
