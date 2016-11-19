var cb = require('../helper/cb');

var HQY_filter = require('./filter');
var HQY_negate = require('../functions/negate');

// Return all the elements for which a truth test fails.
module.exports = function(obj, predicate, context) {
	return HQY_filter(obj, HQY_negate(cb(predicate)), context);
};
