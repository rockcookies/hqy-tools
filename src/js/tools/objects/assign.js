// Assigns a given object with all the own properties in the passed-in object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

var createAssigner = require('../helper/createAssigner');

var HQY_keys = require('./keys');

module.exports = createAssigner(HQY_keys);
