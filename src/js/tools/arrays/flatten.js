var flatten = require('../helper/flatten');

/*
==== flatten ====
HQY.flatten(array, [shallow])

Flatten out an array, either recursively (by default), or just one level.
将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。 如果你传递 shallow参数，数组将只减少一维的嵌套。

HQY.flatten([1, [2], [3, [[4]]]]);
=> [1, 2, 3, 4];

HQY.flatten([1, [2], [3, [[4]]]], true);
=> [1, 2, 3, [[4]]];
*/
module.exports = function(array, shallow) {
	return flatten(array, shallow, false);
};
