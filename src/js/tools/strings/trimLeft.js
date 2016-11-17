var createTrimMethod = require('../helper/createTrimMethod');

module.exports = createTrimMethod(String.prototype.trimLeft, /^[\s\uFEFF\xA0]+/g);

