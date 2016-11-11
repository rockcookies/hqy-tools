var HQY_types = require('../objects/types');

var baseCreate = require('./baseCreate');

// Determines whether to execute a function as a constructor
// or a normal function with the provided arguments
module.exports = function(sourceFunc, boundFunc, context, callingContext, args) {
	if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	var self = baseCreate(sourceFunc.prototype);
	var result = sourceFunc.apply(self, args);
	if (HQY_types.isObject(result)) return result;
	return self;
};
