
module.exports = function (name) {
	return function (obj) {
		return Object.prototype.toString.call(obj) === '[object ' + name + ']';
	}
}
