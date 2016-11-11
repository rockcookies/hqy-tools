var HQY_keys = require('../objects/keys');

// Functions for escaping and unescaping strings to/from HTML interpolation.
module.exports = function(map) {
	var escaper = function(match) {
		return map[match];
	};
	// Regexes for identifying a key that needs to be escaped.
	var source = '(?:' + HQY_keys(map).join('|') + ')';
	var testRegexp = RegExp(source);
	var replaceRegexp = RegExp(source, 'g');
	return function(string) {
		string = string == null ? '' : '' + string;
		return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	};
};
