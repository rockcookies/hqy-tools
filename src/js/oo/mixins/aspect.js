// Aspect
// ---------------------
// Thanks to:
//  - http://yuilibrary.com/yui/docs/api/classes/Do.html
//  - http://code.google.com/p/jquery-aop/
//  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/

var HQY_isFunction = require('../../tools/types/isFunction');
var eventsApi = require('../../radio/helper/eventsApi');

function wave(host, methodName, when, callback, context) {
	var method = host[methodName];
	if (!HQY_isFunction(method)) {
		throw new Error('Invalid method name: ' + methodName);
	}

	var aspect = method.__aspect || {};

	aspect[when] = callback;

	// AOP
	if (!method.__aspect) {
		host[methodName] = function() {
			var args = Array.prototype.slice.call(arguments);

			var hostAspect = host[methodName].__aspect;
			var aspectBefore = hostAspect['before'];
			var aspectAfter = hostAspect['after'];

			if (HQY_isFunction(aspectBefore) && aspectBefore.apply(context || host, args) === false) {
				return;
			}

			var result = method.apply(host, arguments);

			if (HQY_isFunction(aspectAfter)) {
				var afterArgs = [result].concat(args);

				aspectAfter.apply(context || host, afterArgs);
			}

			return result;
		}
	}

	host[methodName].__aspect = aspect;
}

function beforeApi(_, methodName, callback, options) {
	wave(options.ctx, methodName, 'before', callback, options.context);
	return _;
}

// 在指定方法执行前，先执行 callback
exports.before = function(name, callback, context) {
	eventsApi(beforeApi, null, name, callback, {
		context: context,
		ctx: this
	});

	return this;
};

function afterApi(_, methodName, callback, options) {
	wave(options.ctx, methodName, 'after', callback, options.context);
	return _;
}

// 在指定方法执行后，再执行 callback
exports.after = function(methodName, callback, context) {
	eventsApi(afterApi, null, name, callback, {
		context: context,
		ctx: this
	});

	return this;
};
