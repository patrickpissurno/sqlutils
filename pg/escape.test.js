const tap = require('tap');
const escape = require('./escape');
const sqlstring = require('sqlstring');

tap.equal(escape('Test'), `'Test'`, 'regular string');
tap.equal(escape(`whomst'd've`), `'whomst''d''ve'`, 'postgres custom string escaping');
tap.equal(escape(`now()`), `now()`, 'now() should not be escaped');
tap.equal(escape(`NOW()`), `NOW()`, 'NOW() should not be escaped');
tap.equal(escape(1.32), sqlstring.escape(1.32), 'non-string values should be passed directly to sqlstring');
tap.equal(escape("A \\ A"), `'A \\ A'`, 'should match');
tap.equal(escape('some text\fmore text'), `'some text\fmore text'`, '\\f should not be escaped');
tap.equal(escape('some text\nmore text'), `'some text\nmore text'`, '\\n should not be escaped');
tap.equal(escape('some text\rmore text'), `'some text\rmore text'`, '\\r should not be escaped');
tap.equal(escape('some text\tmore text'), `'some text\tmore text'`, '\\t should not be escaped');
tap.equal(escape('some text\vmore text'), `'some text\vmore text'`, '\\v should not be escaped');