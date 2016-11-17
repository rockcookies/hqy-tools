var createTrimMethod = require('../helper/createTrimMethod');

module.exports = createTrimMethod(String.prototype.trimRight, /[\s\uFEFF\xA0]+$/g);


