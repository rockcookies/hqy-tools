var HQY_delay = require('./delay');
var restArgs = require('../helper/restArgs');


/*
==== debounce ====
如果用手指一直按住一个弹簧，它将不会弹起直到你松手为止。
也就是说当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间。

Returns a function, that, as long as it continues to be invoked, will not
be triggered. The function will be called after it stops being called for
N milliseconds. If `immediate` is passed, trigger the function on the
leading edge, instead of the trailing.

函数去抖（连续事件触发结束后只触发一次）
sample 1: HQY.debounce(function(){}, 1000)
连续事件结束后的 1000ms 后触发
sample 1: HQY.debounce(function(){}, 1000, true)
连续事件触发后立即触发（此时会忽略第二个参数）
*/
module.exports = function(func, wait, immediate) {
	var timeout, result;

	var later = function(context, args) {
		timeout = null;
		if (args) result = func.apply(context, args);
	};

	var debounced = restArgs(function(args) {
		if (timeout) clearTimeout(timeout);
		if (immediate) {
			var callNow = !timeout;
			timeout = setTimeout(later, wait);
			if (callNow) result = func.apply(this, args);
		} else {
			timeout = HQY_delay(later, wait, this, args);
		}

		return result;
	});

	debounced.cancel = function() {
		clearTimeout(timeout);
		timeout = null;
	};

	return debounced;
};
