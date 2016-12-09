var isArrayLike = require('../helper/isArrayLike');

var HQY_findIndex = require('../arrays/findIndex');
var HQY_findKey = require('../objects/findKey');

// Return the first value which passes a truth test. Aliased as `detect`.
module.exports = function(obj, predicate, context) {
	var keyFinder = isArrayLike(obj) ? HQY_findIndex : HQY_findKey;
	var key = keyFinder(obj, predicate, context);
	if (key !== void 0 && key !== -1) return obj[key];
};
