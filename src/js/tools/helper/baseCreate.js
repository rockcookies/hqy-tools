var HQY_isObject = require('../types/isObject');

var nativeCreate = Object.create;

// Naked function reference for surrogate-prototype-swapping.
var Ctor = function(){};

// An internal function for creating a new object that inherits from another.
module.exports = function(prototype) {
	if (!HQY_isObject(prototype)) return {};
	if (nativeCreate) return nativeCreate(prototype);
	Ctor.prototype = prototype;
	var result = new Ctor;
	Ctor.prototype = null;
	return result;
};
