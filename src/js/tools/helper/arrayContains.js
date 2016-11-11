module.exports = function(array, item) {
	array = array || [];

	for (var i=0;i<array.length;i++) {
		if (array[i] === item) {
			return true;
		}
	}

	return false;
}
