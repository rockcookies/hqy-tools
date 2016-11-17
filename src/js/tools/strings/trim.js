var createTrimMethod = require('../helper/createTrimMethod');

module.exports = createTrimMethod(String.prototype.trim, /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g);

