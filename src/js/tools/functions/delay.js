var restArgs = require('../helper/restArgs');

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
module.exports = restArgs(function(func, wait, args) {
	return setTimeout(function() {
		return func.apply(null, args);
	}, wait);
});
