var createAssigner = require('../helper/createAssigner');

var HQY_allKeys = require('./allKeys');

// Extend a given object with all the properties in passed-in object(s).
module.exports = createAssigner(HQY_allKeys);

