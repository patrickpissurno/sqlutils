import { describe, test } from 'node:test';
import assert from 'node:assert';
import { escape } from './escape.js';

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
