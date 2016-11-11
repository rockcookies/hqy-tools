var HQY_bind = require('./bind');

var flatten = require('../helper/flatten');
var restArgs = require('../helper/restArgs');

/*
==== bindAll ====
HQY.bindAll(object, *methodNames)

Bind a number of an object's methods to that object. Remaining arguments
are the method names to be bound. Useful for ensuring that all callbacks
defined on an object belong to it.

把methodNames参数指定的一些方法绑定到object上，这些方法就会在对象的上下文环境中执行。
绑定函数用作事件处理函数时非常便利，否则函数被调用时this一点用也没有。
methodNames参数是必须的。

var buttonView = {
  label  : 'underscore',
  onClick: function(){ alert('clicked: ' + this.label); },
  onHover: function(){ console.log('hovering: ' + this.label); }
};
HQY.bindAll(buttonView, 'onClick', 'onHover');
// When the button is clicked, this.label will have the correct value.
jQuery('#underscore_button').bind('click', buttonView.onClick);

*/
module.exports = restArgs(function(obj, keys) {
	keys = flatten(keys, false, false);
	var index = keys.length;
	if (index < 1) throw new Error('bindAll must be passed function names');
	while (index--) {
		var key = keys[index];
		obj[key] = HQY_bind(obj[key], obj);
	}
});
