// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
module.exports = function() {
	var args = arguments;
	var start = args.length - 1;
	return function() {
		var i = start;
		var result = args[start].apply(this, arguments);
		while (i--) result = args[i].call(this, result);
		return result;
	};
};
