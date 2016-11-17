// Events
// -----------------
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js

// Regular expression used to split event strings.

var HQY_keys = require('../tools/objects/keys');
var HQY_once = require('../tools/functions/once');

var mixTo = require('./helper/mixTo');
var eventsApi = require('./helper/eventsApi');

function Events() {}
var EventsProto = Events.prototype;

// The reducing API that adds a callback to the `events` object.
var onApi = function(events, name, callback, options) {
	if (callback) {
		var handlers = events[name] || (events[name] = []);
		var context = options.context, ctx = options.ctx;
		handlers.push({
			callback: callback,
			context: context,
			ctx: context || ctx
		});
	}

	return events;
};

// Bind an event to a `callback` function. Passing `"all"` will bind
// the callback to all events fired.
EventsProto.on = function(name, callback, context) {
	this.__events = eventsApi(onApi, this.__events || {}, name, callback, {
		context: context,
		ctx: this
	});
	return this;
};

// The reducing API that removes a callback from the `events` object.
var offApi = function(events, name, callback, options) {
	if (!events) return;

	var i = 0, context = options.context;
	var names = name ? [name] : HQY_keys(events);

	for (; i < names.length; i++) {
		name = names[i];

		var handlers = events[name];

		// Bail out if there are no events stored.
		if (!handlers) break;

		// Replace events if there are any remaining.  Otherwise, clean up.
		var remaining = [];

		for (var j = 0; j < handlers.length; j++) {
			var handler = handlers[j];

			if (
				callback && callback !== handler.callback &&
				callback !== handler.callback._callback ||
				context && context !== handler.context
			) {
				remaining.push(handler);
			}
		}

		// Update tail event if the list has any events.  Otherwise, clean up.
		if (remaining.length) {
			events[name] = remaining;
		} else {
			delete events[name];
		}
	}

	return events;
};

// Remove one or many callbacks. If `context` is null, removes all
// callbacks with that function. If `callback` is null, removes all
// callbacks for the event. If `name` is null, removes all bound
// callbacks for all events.
EventsProto.off = function(name, callback, context) {
	if (!this.__events) return this;
	this.__events = eventsApi(offApi, this.__events, name, callback, {
		context: context
	});
	return this;
};


// Reduces the event callbacks into a map of `{event: onceWrapper}`.
// `offer` unbinds the `onceWrapper` after it has been called.
var onceMap = function(map, name, callback, offer) {
	if (callback) {
		var once = map[name] = HQY_once(function() {
			offer(name, once);
			callback.apply(this, arguments);
		});
		once._callback = callback;
	}
	return map;
};

// Bind an event to only be triggered a single time. After the first time
// the callback is invoked, its listener will be removed. If multiple events
// are passed in using the space-separated syntax, the handler will fire
// once for each event, not once for a combination of all events.
EventsProto.once = function(name, callback, context) {
	// Map the event into a `{event: once}` object.
	var that = this;
	var events = eventsApi(onceMap, {}, name, callback, function () {
		that.off.apply(that, arguments);
	});
	if (typeof name === 'string' && context == null) callback = void 0;
	return this.on(events, callback, context);
};


// Handles triggering the appropriate event callbacks.
var triggerApi = function(objEvents, name, callback, args) {
	if (objEvents) {
		var events = objEvents[name];
		var allEvents = objEvents.all;
		if (events && allEvents) allEvents = allEvents.slice();
		if (events) triggerEvents(events, args);
		if (allEvents) triggerEvents(allEvents, [name].concat(args));
	}
	return objEvents;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
var triggerEvents = function(events, args) {
	var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	switch (args.length) {
		case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
		case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
		case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
		case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
		default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
	}
};

// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
EventsProto.fire = EventsProto.trigger = function (name) {
	if (!this.__events) return this;

	var length = Math.max(0, arguments.length - 1);
	var args = Array(length);
	for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

	eventsApi(triggerApi, this.__events, name, void 0, args);
	return this;
};


function forEach(array,fn) {
	for(var i=0;i<array.length;i++){
		fn(array[i]);
	};
}

// Mix `Events` to object instance or Class function.
Events.mixTo = mixTo(EventsProto);

module.exports = Events;
