// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
module.exports = {
	evaluate: /<%([\s\S]+?)%>/g,
	interpolate: /<%=([\s\S]+?)%>/g,
	escape: /<%-([\s\S]+?)%>/g,
	_: {}
};
