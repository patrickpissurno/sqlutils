const { describe, test } = require('node:test');
const assert = require('node:assert');
const escape = require('./escape');

describe('escape (pg)', () => {
  test('boolean', () => {
    assert.equal(escape(true), `true`);
  });

  test('number', () => {
    assert.equal(escape(1.32), `1.32`);
  });

  test('BigInt', () => {
    assert.equal(escape(BigInt('25')), `25`);
  });

  test('Date', () => {
    assert.equal(
      escape(new Date('2022-01-14T02:50:19.752Z')),
      `'2022-01-13T23:50:19.752-03:00'`,
    );
  });

  test('array', () => {
    assert.equal(escape([1, 2]), `array[1,2]`);
  });

  test('Buffer', () => {
    assert.equal(escape(Buffer.from([255, 255, 0, 0])), `'\\xffff0000'`);
  });

  test('object/JSON', () => {
    assert.equal(escape({ dance: true }), `'{"dance":true}'`);
  });

  test('regular string', () => {
    assert.equal(escape('Test'), `'Test'`);
  });

  test('postgres custom string escaping', () => {
    assert.equal(escape(`whomst'd've`), `'whomst''d''ve'`);
  });

  test('now() should not be escaped', () => {
    assert.equal(escape(`now()`), `now()`);
  });

  test('NOW() should not be escaped', () => {
    assert.equal(escape(`NOW()`), `NOW()`);
  });

  test('backslash should be preserved', () => {
    assert.equal(escape('A \\ A'), `'A \\ A'`);
  });

  test('sql injection 101 should not work', () => {
    assert.equal(escape(`' OR 1=1 --`), `''' OR 1=1 --'`);
  });

  test('\\f should be escaped the right way (1)', () => {
    assert.equal(escape('\fmore text'), `'\fmore text'`);
  });

  test('works(\\f should be escaped the right way (2)', () => {
    assert.equal(escape('more\ftext'), `'more\ftext'`);
  });

  test('\\f should be escaped the right way (3)', () => {
    assert.equal(escape('more text\f'), `'more text\f'`);
  });

  test("symbol doesn't work", () => {
    assert.throws(
      () => escape(Symbol('1')),
      new TypeError('Type Symbol has no meaning for PostgreSQL: Symbol(1)'),
    );
  });
});
