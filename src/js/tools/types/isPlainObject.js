var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var fnToString = hasOwnProperty.toString;
var ObjectFunctionString = fnToString.call(Object);
var getPrototypeOf = Object.getPrototypeOf;

var hasEnumBug = require('../helper/hasEnumBug');

module.exports = function(obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor
	// property. Make sure that DOM nodes and window objects don't
	// pass through, as well
	if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj == obj.window) {
		return false;
	}

	// 现代浏览器
	if (getPrototypeOf) {
		var proto, Ctor;

		proto = getPrototypeOf(obj);

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwnProperty.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
	}

	try {
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnProperty.call(obj, "constructor") && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
			return false;
		}
	} catch (e) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	var key;

	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	// http://bugs.jquery.com/ticket/12199
	if (hasEnumBug) {
		for (key in obj) {
			return hasOwnProperty.call(obj, key);
		}
	}


	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for (key in obj) {}

	// console.log(jquery.isPlainObject(obj), key === undefined || hasOwnProperty.call(obj, key))

	return key === undefined || hasOwnProperty.call(obj, key);
}

