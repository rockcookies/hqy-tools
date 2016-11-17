var HQY_has = require('../objects/has');

var createTypeMethod = require('../helper/createTypeMethod');

var isArguments = createTypeMethod("Arguments");

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function () {
	if (!isArguments(arguments)) {
		isArguments = function(obj) {
			return HQY_has(obj, 'callee');
		};
	}
})();

module.exports = isArguments;
