import { describe, test } from 'node:test';
import assert from 'node:assert';
import { buildWhereFromQuery } from './buildWhereFromQuery.js';

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
      ` WHERE ((a=true OR a IS NULL) AND b='hello')`,
    );
  });

  test('grouped values', () => {
    assert.equal(
      buildWhereFromQuery([{ a: 1 }, { b: 2 }]),
      ' WHERE (a=1) OR (b=2)',
    );
  });

  test('nested grouped values', () => {
    assert.equal(
      buildWhereFromQuery([{ a: [1, 2] }, { b: [3, 4] }, { c: 5, d: [6, 7] }]),
      ' WHERE ((a=1 OR a=2)) OR ((b=3 OR b=4)) OR (c=5 AND (d=6 OR d=7))',
    );
  });
});
