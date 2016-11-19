var restArgs = require('../helper/restArgs');

var flatten = require('../helper/flatten');
var HQY_unique = require('./unique');

// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
module.exports = restArgs(function(arrays) {
	return HQY_unique(flatten(arrays, true, true));
});
