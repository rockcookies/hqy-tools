var makeString = require('./makeString');

module.exports = function(proto, regex) {
	return function (str) {
		str = makeString(str);
		if (proto) return proto.call(str);
		return str.replace(regex, '');
	};
}
