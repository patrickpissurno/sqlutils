const tap = require('tap');
const format = require('./format');

tap.equal(format('INSERT INTO customer ?', { fullname: 'Test', balance: 1 }), `INSERT INTO customer (fullname,balance) VALUES ('Test',1)`);
tap.equal(format('UPDATE customer SET ?', { last_seen: 'NOW()', visits: 3 }), `UPDATE customer SET last_seen=NOW(),visits=3`);
tap.equal(format('UPDATE customer SET ?', { fullname: 'Test', '!visits': '(SELECT COUNT(*) FROM customer_visits)' }), `UPDATE customer SET fullname='Test',visits=(SELECT COUNT(*) FROM customer_visits)`);