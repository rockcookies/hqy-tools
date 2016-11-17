var createAssigner = require('../helper/createAssigner');

var HQY_allKeys = require('./allKeys');

// Fill in a given object with default properties.
module.exports = createAssigner(HQY_allKeys, true);
