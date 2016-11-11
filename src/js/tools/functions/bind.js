var HQY_types = require('../objects/types');

var restArgs = require('../helper/restArgs');
var executeBound = require('../helper/executeBound');

/*
==== bind ====
HQY.bind(function, object, *arguments)

Create a function bound to a given object (assigning `this`, and arguments,
optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
available.

var func = function(greeting, extra){ return greeting + ': ' + this.name + ' ' + extra };
func = HQY.bind(func, {name: 'moe'}, 'hi');
func('!');
=> 'hi: moe !'

*/
module.exports = restArgs(function (func, context, args) {
	if (!HQY_types.isFunction(func)) throw new TypeError('Bind must be called on a function');
	var bound = restArgs(function(callArgs) {
		return executeBound(func, bound, context, this, args.concat(callArgs));
	});
	return bound;
});

