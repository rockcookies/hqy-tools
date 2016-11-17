var root = require('../helper/root');

var createTypeMethod = require('../helper/createTypeMethod');

var isFunction = createTypeMethod("Function");

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	isFunction = function(obj) {
		return typeof obj == 'function' || false;
	};
}

module.exports = isFunction;
