var optimizeCb = require('./optimizeCb');

var HQY_isFunction = require('../types/isFunction');
var HQY_isArray = require('../types/isArray');
var HQY_isObject = require('../types/isObject');
var HQY_property = require('../objects/property');
var HQY_matcher = require('../objects/matcher');

var builtinIteratee;

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `identity`,
// an arbitrary callback, a property matcher, or a property accessor.
var cb = module.exports = function(value, context, argCount) {
	if (iteratee !== builtinIteratee) return iteratee(value, context);
	if (value == null) return function(value) { return value; };
	if (HQY_isFunction(value)) return optimizeCb(value, context, argCount);
	if (HQY_isObject(value) && !HQY_isArray(value)) return HQY_matcher(value);
	return HQY_property(value);
};

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only argCount argument.
var iteratee = builtinIteratee = function(value, context) {
	return cb(value, context, Infinity);
};
