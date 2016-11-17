var HQY_once = require('../tools/functions/once');

var mixTo = require('./helper/mixTo');
var eventsApi = require('./helper/eventsApi');

function Requests () {}
var RequestsProto = Requests.prototype;

function replyApi(replies, name, callback, options) {
	if (callback) {
		var context = options.context, ctx = options.ctx;

		replies[name] = {
			callback: callback,
			context: context || ctx
		};
	}

	return replies;
}

RequestsProto.reply = function (name, callback, context) {
	this.__replies = eventsApi(replyApi, this.__replies || {}, name, callback, {
		context: context,
		ctx: this
	});

	return this;
};

function stopReplyingApi(replies, name) {
	if (replies[name]) {
		delete replies[name];
	}

	return replies;
}

RequestsProto.stopReplying = function (name) {
	if (!this.__replies) return this;
	this.__replies = eventsApi(stopReplyingApi, this.__replies, name);
	return this;
};

var onceMap = function(map, name, callback, offer) {
	if (callback) {
		var once = map[name] = HQY_once(function() {
			offer(name);
			return callback.apply(this, arguments);
		});
	}
	return map;
}

RequestsProto.replyOnce = function (name, callback, context) {
	// Map the event into a `{event: once}` object.
	var that = this;
	var replies = eventsApi(onceMap, {}, name, callback, function () {
		that.stopReplying.apply(that, arguments);
	});
	if (typeof name === 'string' && context == null) callback = void 0;
	return this.reply(replies, callback, context);
};

RequestsProto.request = function (name) {
	var replies = this.__replies;

	if (replies && (replies[name] || replies['default'])) {
		var handler = replies[name] || replies['default'];
		var args = replies[name] ? Array.prototype.slice.call(arguments, 1) : arguments;
		return handler.callback.apply(handler.context, args);
	}
};

Requests.mixTo = mixTo(RequestsProto);

module.exports = Requests;
