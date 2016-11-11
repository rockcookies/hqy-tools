// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.

module.exports = function(func, context, argCount) {
	if (context === void 0) return func;
	switch (argCount) {
		case 1: return function(value) {
			return func.call(context, value);
		};
		// The 2-parameter case has been omitted only because no current consumers
		// made use of it.
		case null:
		case 3: return function(value, index, collection) {
			return func.call(context, value, index, collection);
		};
		case 4: return function(accumulator, value, index, collection) {
			return func.call(context, accumulator, value, index, collection);
		};
	}
	return function() {
		return func.apply(context, arguments);
	};
};
