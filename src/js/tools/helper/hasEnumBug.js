// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
module.exports = !{ toString: null }.propertyIsEnumerable('toString');
