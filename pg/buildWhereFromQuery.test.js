const { describe, it } = require('node:test');
const assert = require('node:assert');
const buildWhereFromQuery = require('./buildWhereFromQuery');

describe('buildWhereFromQuery', () => {
  it('works (empty case)', () => {
    assert.equal(buildWhereFromQuery({}), '');
  });

  it('works (number value)', () => {
    assert.equal(buildWhereFromQuery({ a: 1 }), ' WHERE (a=1)');
  });

  it('works (array values)', () => {
    assert.equal(
      buildWhereFromQuery({ a: [1, 2], b: [3] }),
      ' WHERE ((a=1 OR a=2) AND (b=3))',
    );
  });

  it('works (boolean, null, and string)', () => {
    assert.equal(
      buildWhereFromQuery({ a: [true, null], b: 'hello' }),
      ` WHERE ((a=true OR a IS null) AND b='hello')`,
    );
  });

  it('works (grouped values)', () => {
    assert.equal(
      buildWhereFromQuery([{ a: 1 }, { b: 2 }]),
      ' WHERE (a=1) OR (b=2)',
    );
  });

  it('works (nested grouped values)', () => {
    assert.equal(
      buildWhereFromQuery([{ a: [1, 2] }, { b: [3, 4] }, { c: 5, d: [6, 7] }]),
      ' WHERE ((a=1 OR a=2)) OR ((b=3 OR b=4)) OR (c=5 AND (d=6 OR d=7))',
    );
  });
});
