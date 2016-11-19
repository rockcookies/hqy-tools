// Determine if the array or object contains a given item (using `===`).

var HQY_values = require('../objects/values');
var HQY_indexOf = require('../arrays/indexOf');

var isArrayLike = require('../helper/isArrayLike');


module.exports = function(obj, item, fromIndex, guard) {
	if (!isArrayLike(obj)) obj = HQY_values(obj);
	if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	return HQY_indexOf(obj, item, fromIndex) >= 0;
};
