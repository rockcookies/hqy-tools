// Returns a negated version of the passed-in predicate.
module.exports = function(predicate) {
	return function() {
		return !predicate.apply(this, arguments);
	};
};
