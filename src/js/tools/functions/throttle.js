var HQY_now = require('../utility/now');

/*
==== throttle ====
如果将水龙头拧紧直到水是以水滴的形式流出，那你会发现每隔一段时间，就会有一滴水流出。
也就是会说预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期。

Returns a function, that, when invoked, will only be triggered at most once
during a given window of time. Normally, the throttled function will run
as much as it can, without ever going more than once per `wait` duration;
but if you'd like to disable the execution on the leading edge, pass
`{leading: false}`. To disable execution on the trailing edge, ditto.
函数节流（如果有连续事件响应，则每间隔一定时间段触发）
每间隔 wait(Number) milliseconds 触发一次 func 方法
如果 options 参数传入 {leading: false}
那么不会马上触发（等待 wait milliseconds 后第一次触发 func）
如果 options 参数传入 {trailing: false}
那么最后一次回调不会被触发
**Notice: options 不能同时设置 leading 和 trailing 为 false**
示例：
var throttled = HQY.throttle(updatePosition, 100);
$(window).scroll(throttled);
调用方式（注意看 A 和 B console.log 打印的位置）：
HQY.throttle(function, wait, [options])
sample 1: HQY.throttle(function(){}, 1000)
print: A, B, B, B ...
sample 2: HQY.throttle(function(){}, 1000, {leading: false})
print: B, B, B, B ...
sample 3: HQY.throttle(function(){}, 1000, {trailing: false})
print: A, A, A, A ...

*/

module.exports = function(func, wait, options) {
	var context, args, result;

	// setTimeout 的 handler
	var timeout = null;

	// 标记时间戳
	// 上一次执行回调的时间戳
	var previous = 0;

	if (!options) options = {};

	var later = function () {
		// 如果 options.leading === false
		// 则每次触发回调后将 previous 置为 0
		// 否则置为当前时间戳
		previous = options.leading === false ? 0 : HQY_now();
		timeout = null;

		// 执行函数 console.log('B')
    	result = func.apply(context, args);
		if (!timeout) context = args = null;
	};

	// throttle 方法返回的函数
	return function () {
		// 记录当前时间戳
		var now = HQY_now();

		// 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
		// 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
		// 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
		// 表示刚执行过，这次就不用执行了
		if (!previous && options.leading === false)
		previous = now;

		// 距离下次触发 func 还需要等待的时间
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;

		// 要么是到了间隔时间了，随即触发方法（remaining <= 0）
		// 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
		// 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
		// 之后便会把 previous 值迅速置为 now
		// ========= //
		// remaining > wait，表示客户端系统时间被调整过
		// 则马上执行 func 函数
		// @see https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
		// ========= //
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				// 解除引用，防止内存泄露
				timeout = null;
			}

			// 重置前一次触发的时间戳
			previous = now;

			// 触发方法
			// result 为该方法返回值 console.log('A')
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
			// 如果已经存在一个定时器，则不会进入该 if 分支
			// 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
			// 间隔 remaining milliseconds 后触发 later 方法
			timeout = setTimeout(later, remaining);
		}

		// 回调返回值
    	return result;
	};
};

