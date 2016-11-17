var HQY_isNumber = require('./isNumber');

// Is the given value `NaN`?
module.exports = function(obj) {
	return HQY_isNumber(obj) && isNaN(obj);
};
