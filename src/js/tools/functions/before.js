// Returns a function that will only be executed up to (but not including) the Nth call.
module.exports = function(times, func) {
	var memo;
	return function() {
		if (--times > 0) {
			memo = func.apply(this, arguments);
		}
		if (times <= 1) func = null;
		return memo;
	};
};
