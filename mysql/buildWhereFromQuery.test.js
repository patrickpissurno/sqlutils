const { describe, test } = require('node:test');
const assert = require('node:assert');
const buildWhereFromQuery = require('./buildWhereFromQuery');

describe('buildWhereFromQuery (mysql)', () => {
  test('empty case', () => {
    assert.equal(buildWhereFromQuery({}), '');
  });

  test('number value', () => {
    assert.equal(buildWhereFromQuery({ a: 1 }), ' WHERE (a=1)');
  });

  test('array values', () => {
    assert.equal(
      buildWhereFromQuery({ a: [1, 2], b: [3] }),
      ' WHERE ((a=1 OR a=2) AND (b=3))',
    );
  });

  test('boolean, null, and string', () => {
    assert.equal(
      buildWhereFromQuery({ a: [true, null], b: 'hello' }),
      ` WHERE ((a=true OR a IS null) AND b='hello')`,
    );
  });
});
