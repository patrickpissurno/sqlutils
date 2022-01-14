const tap = require('tap');
const escape = require('./escape');

tap.equal(escape(true), `true`, 'boolean works');
tap.equal(escape(1.32), `1.32`, 'number works');
tap.equal(escape(BigInt('25')), `25`, 'big int works');
tap.equal(escape(new Date('2022-01-14T02:50:19.752Z')), `'2022-01-13T23:50:19.752-03:00'`, 'date works');
tap.equal(escape([1,2]), `array[1,2]`, 'array works');
tap.equal(escape(Buffer.from([255, 255, 0, 0])), `'\\xffff0000'`, 'buffer works');
tap.equal(escape({ dance: true }), `'{"dance":true}'`, 'json works');

tap.equal(escape('Test'),           `'Test'`,               'regular string');
tap.equal(escape(`whomst'd've`),    `'whomst''d''ve'`,      'postgres custom string escaping');
tap.equal(escape(`now()`),          `now()`,                'now() should not be escaped');
tap.equal(escape(`NOW()`),          `NOW()`,                'NOW() should not be escaped');
tap.equal(escape("A \\ A"),         `'A \\ A'`,             'should match');
tap.equal(escape(`' OR 1=1 --`),    `''' OR 1=1 --'`,       'sql injection 101 should not work');
tap.equal(escape('\fmore text'),    `'\fmore text'`,        '\\f should be escaped the right way (1)');
tap.equal(escape('more\ftext'),     `'more\ftext'`,         '\\f should be escaped the right way (2)');
tap.equal(escape('more text\f'),    `'more text\f'`,        '\\f should be escaped the right way (3)');

tap.throws(() => escape(Symbol('1')), new TypeError('Type Symbol has no meaning for PostgreSQL: Symbol(1)'), 'symbol doesn\'t work');