// Is a given value a DOM element?
module.exports = function(obj) {
	return !!(obj && obj.nodeType === 1);
};
