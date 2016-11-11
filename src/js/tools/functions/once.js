module.exports = function(func) {
	var called, momo;

	return function() {
		if (called) {
			return momo;
		}

		called = true;
		momo = func.apply(this, arguments);
		func = null;

		return momo;
	};
};
