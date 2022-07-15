const tap = require('tap');
const recursiveMapsToLists = require('./recursiveMapsToLists');

{
    const input = new Map();
    input.set('a', {});

    const found = recursiveMapsToLists(input);

    const wanted = [{}];

    tap.same(found, wanted, 'should be the same (1) - basic should work');
}

{
    const input = new Map();
    input.set('a', 'b');

    const found = recursiveMapsToLists(input);

    const wanted = ['b'];

    tap.same(found, wanted, 'should be the same (2) - non objects should be kept as is');
}

{
    const input = new Map();
    input.set('a', new Map());
    input.get('a').set('b', {});

    const found = recursiveMapsToLists(input);

    const wanted = [[{}]];

    tap.same(found, wanted, 'should be the same (3) - directly nested maps should work');
}

{
    const input = new Map();
    input.set('a', { b: new Map() });
    input.get('a').b.set('c', {});

    const found = recursiveMapsToLists(input);

    const wanted = [{ b: [{}] }];

    tap.same(found, wanted, 'should be the same (4) - objects containing maps should work');
}

{
    const input = new Map();
    input.set('a', []);

    const found = recursiveMapsToLists(input);

    const wanted = [[]];

    tap.same(found, wanted, 'should be the same (5) - lists should be left as is');
}

{
    const input = new Map();
    input.set('a', { b: 'c' });

    const found = recursiveMapsToLists(input);

    const wanted = [{ b: 'c' }];

    tap.same(found, wanted, 'should be the same (6) - objects containing non map props should be left as is');
}