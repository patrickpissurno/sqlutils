const tap = require('tap');
const escape = require('./escape');

tap.equal(escape('Test'), `'Test'`, 'regular string');
tap.equal(escape(`now()`), `now()`, 'now() should not be escaped');
tap.equal(escape(`NOW()`), `NOW()`, 'NOW() should not be escaped');