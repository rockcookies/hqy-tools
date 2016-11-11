// Predicate-generating functions. Often useful outside of Underscore.
module.exports = function(value) {
	return function() {
		return value;
	};
};
