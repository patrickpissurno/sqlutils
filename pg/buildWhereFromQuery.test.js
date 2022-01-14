const tap = require('tap');
const buildWhereFromQuery = require('./buildWhereFromQuery');

tap.equal(buildWhereFromQuery({}), '');
tap.equal(buildWhereFromQuery({ a: 1 }), ' WHERE (a=1)', 'should be equal');
tap.equal(buildWhereFromQuery({ a: [ 1, 2 ], b: [3] }), ' WHERE ((a=1 OR a=2) AND (b=3))', 'should be equal');
tap.equal(buildWhereFromQuery({ a: [ true, null ], b: 'hello' }), ` WHERE ((a=true OR a IS null) AND b='hello')`, 'should be equal');
tap.equal(buildWhereFromQuery([{ a: 1 }, { b: 2 }]), ' WHERE (a=1) OR (b=2)', 'should be equal');
tap.equal(buildWhereFromQuery([{ a: [1,2] }, { b: [3,4] }, { c: 5, d: [6,7] }]), ' WHERE ((a=1 OR a=2)) OR ((b=3 OR b=4)) OR (c=5 AND (d=6 OR d=7))', 'should be equal');