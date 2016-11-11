var HQY_partial = require('./partial');

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.

module.exports = function(func, wrapper) {
	return HQY_partial(wrapper, func);
};
