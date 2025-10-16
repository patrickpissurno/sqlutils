const { describe, test } = require('node:test');
const assert = require('node:assert');
const escape = require('./escape');

describe('escape (mysql)', () => {
  test('regular string', () => {
    assert.equal(escape('Test'), `'Test'`);
  });

  test('now() should not be escaped', () => {
    assert.equal(escape(`now()`), `now()`);
  });

  test('NOW() should not be escaped', () => {
    assert.equal(escape(`NOW()`), `NOW()`);
  });
});
