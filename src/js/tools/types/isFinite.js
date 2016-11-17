// Is a given object a finite number?
module.exports = function(obj) {
	return isFinite(obj) && !isNaN(parseFloat(obj));
};
