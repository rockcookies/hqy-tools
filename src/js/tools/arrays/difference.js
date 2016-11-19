var restArgs = require('../helper/restArgs');
var flatten = require('../helper/flatten');

var HQY_filter = require('../collection/filter');
var HQY_includes = require('../collection/includes');

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
module.exports = restArgs(function(array, rest) {
	rest = flatten(rest, true, true);
	return HQY_filter(array, function(value){
		return !HQY_includes(rest, value);
	});
});
