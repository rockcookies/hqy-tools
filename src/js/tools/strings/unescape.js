var HQY_invert = require('../objects/invert');

var createEscaper = require('../helper/createEscaper');
var escapeMap = require('../helper/escapeMap');

module.exports = createEscaper(HQY_invert(escapeMap));
