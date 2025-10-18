import { describe, test } from 'node:test';
import assert from 'node:assert';
import { format } from './format.js';

describe('format (pg)', () => {
  test('array should have at least one element', () => {
    assert.throws(() => format('INSERT INTO customer ?', []));
  });

  test('use objects for update queries, not arrays', () => {
    assert.throws(() => format('UPDATE customer SET ?', [{ a: 1 }]));
  });

  test('basic INSERT works', () => {
    assert.equal(
      format('INSERT INTO customer ?', { fullname: 'Test', balance: 1 }),
      `INSERT INTO customer (fullname,balance) VALUES ('Test',1)`,
    );
  });

  test('basic UPDATE works', () => {
    assert.equal(
      format('UPDATE customer SET ?', { last_seen: 'NOW()', visits: 3 }),
      `UPDATE customer SET last_seen=NOW(),visits=3`,
    );
  });

  test('unescape works', () => {
    assert.equal(
      format('UPDATE customer SET ?', {
        fullname: 'Test',
        '!visits': '(SELECT COUNT(*) FROM customer_visits)',
      }),
      `UPDATE customer SET fullname='Test',visits=(SELECT COUNT(*) FROM customer_visits)`,
    );
  });

  test('bulk INSERT works', () => {
    assert.equal(
      format('INSERT INTO customer ?', [
        { fullname: 'Test', balance: 1 },
        { fullname: 'Test 2', balance: 3 },
      ]),
      `INSERT INTO customer (fullname,balance) VALUES ('Test',1),('Test 2',3)`,
    );
  });

  test('should not mutate params', () => {
    const input = [{ a: 1, b: null }];
    const backup = JSON.parse(JSON.stringify(input));
    format('INSERT INTO customer ?', input);
    assert.deepStrictEqual(input, backup);
  });
});
