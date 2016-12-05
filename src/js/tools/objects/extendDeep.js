var HQY_isFunction = require('../types/isFunction');
var HQY_isArray = require('../types/isArray');
var HQY_isPlainObject = require('../types/isPlainObject');

var extendDeep = module.exports = function() {
	var args = arguments, options, name, src, copy, copyIsArray, clone;

	var target = args[0] || {};

	// Handle case when target is a string or something
	if (typeof target !== "object" && !HQY_isFunction(target)) {
		target = {};
	}

	for (var i=0; i<args.length; i++) {
		// Only deal with non-null/undefined values
		if ((options = args[i]) != null) {

			// Extend the base object
			for ( name in options ) {
				var src = target[name];
				var copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				if (copy && (
					HQY_isPlainObject(copy) ||
					(copyIsArray = HQY_isArray(copy)))) {

					if (copyIsArray) {
						copyIsArray = false;
						clone = src && HQY_isArray(src) ? src : [];
					} else {
						clone = src && HQY_isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extendDeep(clone, copy);

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	return target;
};
