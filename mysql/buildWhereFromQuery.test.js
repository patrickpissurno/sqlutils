const tap = require('tap');
const buildWhereFromQuery = require('./buildWhereFromQuery');

tap.equal(buildWhereFromQuery({}), '');
tap.equal(buildWhereFromQuery({ a: 1 }), ' WHERE (a=1)', 'should be equal');
tap.equal(buildWhereFromQuery({ a: [ 1, 2 ], b: [3] }), ' WHERE ((a=1 OR a=2) AND (b=3))', 'should be equal');
tap.equal(buildWhereFromQuery({ a: [ true, null ], b: 'hello' }), ` WHERE ((a=true OR a IS NULL) AND b='hello')`, 'should be equal');