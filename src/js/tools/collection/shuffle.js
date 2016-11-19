var HQY_sample = require('./sample');

// Shuffle a collection.
module.exports = function(obj) {
	return HQY_sample(obj, Infinity);
};
