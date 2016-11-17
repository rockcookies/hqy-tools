var HQY_isFunction = require('../types/isFunction');
var HQY_has = require('../objects/has');

var arrayContains = require('./arrayContains');

var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

module.exports = function(obj, keys) {
	var nonEnumIdx = nonEnumerableProps.length;
	var constructor = obj.constructor;
	var proto = HQY_isFunction(constructor) && constructor.prototype || Object.prototype;

	// Constructor is a special case.
	var prop = 'constructor';
	if (HQY_has(obj, prop) && !arrayContains(keys, prop)) keys.push(prop);

	while (nonEnumIdx--) {
		prop = nonEnumerableProps[nonEnumIdx];
		if (prop in obj && obj[prop] !== proto[prop] && !arrayContains(keys, prop)) {
			keys.push(prop);
		}
	}
};
