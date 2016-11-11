module.exports = function() {
	var obj = {};
	for (var i=0;i<arguments.length;i++) {
		var o = arguments[i];
		for (var j in o) {
			if (o.hasOwnProperty(j)) {
				obj[j] = o[j];
			}
		}
	}

	return obj;
};
