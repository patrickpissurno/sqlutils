const tap = require('tap');
const format = require('./format');

tap.throws(() => format('INSERT INTO customer ?', []), 'array should have at least one element');
tap.throws(() => format('UPDATE customer SET ?', [{ a: 1 }]), 'use objects for update queries, not arrays');

tap.equal(format('INSERT INTO customer ?', { fullname: 'Test', balance: 1 }), `INSERT INTO customer (fullname,balance) VALUES ('Test',1)`);
tap.equal(format('UPDATE customer SET ?', { last_seen: 'NOW()', visits: 3 }), `UPDATE customer SET last_seen=NOW(),visits=3`);
tap.equal(format('UPDATE customer SET ?', { fullname: 'Test', '!visits': '(SELECT COUNT(*) FROM customer_visits)' }), `UPDATE customer SET fullname='Test',visits=(SELECT COUNT(*) FROM customer_visits)`);

tap.equal(format('INSERT INTO customer ?', [{ fullname: 'Test', balance: 1 }, { fullname: 'Test 2', balance: 3 }]), `INSERT INTO customer (fullname,balance) VALUES ('Test',1),('Test 2',3)`);