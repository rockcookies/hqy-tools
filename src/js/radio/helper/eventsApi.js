var HQY_keys = require('../../tools/objects/keys');

// Regular expression used to split event strings
var eventSplitter = /\s+/;

// Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`).
function eventsApi(iteratee, events, name, callback, opts) {
	var i = 0, names;

	if (name && typeof name === 'object') {
		// Handle event maps.
		if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
		for (names = HQY_keys(name); i < names.length ; i++) {
			events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
		}
	} else if (name && eventSplitter.test(name)) {
		// Handle space-separated event names by delegating them individually.
		for (names = name.split(eventSplitter); i < names.length; i++) {
			events = iteratee(events, names[i], callback, opts);
		}
	} else {
		// Finally, standard events.
		events = iteratee(events, name, callback, opts);
	}
	return events;
};

module.exports = eventsApi;

