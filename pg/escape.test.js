const tap = require('tap');
const escape = require('./escape');
const sqlstring = require('sqlstring');

tap.equal(escape('Test'), `'Test'`, 'regular string');
tap.equal(escape(`whomst'd've`), `'whomst''d''ve'`, 'postgres custom string escaping');
tap.equal(escape(`now()`), `now()`, 'now() should not be escaped');
tap.equal(escape(`NOW()`), `NOW()`, 'NOW() should not be escaped');
tap.equal(escape(1.32), sqlstring.escape(1.32), 'non-string values should be passed directly to sqlstring');
tap.equal(escape("A \\ A"), `'A \\ A'`, 'should match');