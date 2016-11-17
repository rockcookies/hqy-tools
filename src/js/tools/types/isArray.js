// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
module.exports = Array.isArray || function(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};
