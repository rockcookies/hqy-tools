var S4 = function () {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

module.exports = function (prefix) {
	var id = S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
	return prefix ? prefix + id : id;
};

