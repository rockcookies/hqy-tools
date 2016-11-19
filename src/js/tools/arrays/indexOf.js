var HQY_sortedIndex = require('./sortedIndex');
var HQY_findIndex = require('./findIndex');

var createIndexFinder = require('../helper/createIndexFinder');

module.exports = createIndexFinder(1, HQY_findIndex, HQY_sortedIndex);

