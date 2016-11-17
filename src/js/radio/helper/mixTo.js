var HQY_keys = require('../../tools/objects/keys');
var HQY_isFunction = require('../../tools/types/isFunction');

function forEach(array,fn) {
	for(var i=0;i<array.length;i++){
		fn(array[i]);
	};
}

module.exports = function (proto){
	return function (receiver){
		if (HQY_isFunction(receiver)) {
			forEach(HQY_keys(proto), function (key) {
				receiver.prototype[key] = proto[key];
			});
		} else {
			forEach(HQY_keys(proto), function (key) {
				receiver[key] = proto[key];
			});
		}

		return receiver;
	};
};
