const tap = require('tap');
const escape = require('./escape');
const sqlstring = require('sqlstring');

tap.equal(escape('Test'),           `E'Test'`,              'regular string');
tap.equal(escape(`whomst'd've`),    `E'whomst''d''ve'`,     'postgres custom string escaping');
tap.equal(escape(`now()`),          `now()`,                'now() should not be escaped');
tap.equal(escape(`NOW()`),          `NOW()`,                'NOW() should not be escaped');
tap.equal(escape(1.32),             sqlstring.escape(1.32), 'non-string values should be passed directly to sqlstring');
tap.equal(escape("A \\ A"),         `E'A \\ A'`,            'should match');
tap.equal(escape(`' OR 1=1 --`),    `E''' OR 1=1 --'`,      'sql injection 101 should not work');
tap.equal(escape('\fmore text'),    `E'\fmore text'`,       '\\f should be escaped the right way (1)');
tap.equal(escape('more\ftext'),     `E'more\ftext'`,        '\\f should be escaped the right way (2)');
tap.equal(escape('more text\f'),    `E'more text\f'`,       '\\f should be escaped the right way (3)');