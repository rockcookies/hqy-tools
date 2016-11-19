var restArgs = require('../helper/restArgs');

var HQY_difference = require('./difference');

// Return a version of the array that does not contain the specified value(s).
module.exports = restArgs(function(array, otherArrays) {
	return HQY_difference(array, otherArrays);
});
