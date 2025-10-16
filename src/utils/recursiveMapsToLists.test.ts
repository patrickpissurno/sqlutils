import { describe, test } from 'node:test';
import assert from 'node:assert';
import { recursiveMapsToLists } from './recursiveMapsToLists.js';

describe('recursiveMapsToLists', () => {
  test('basic should work', () => {
    const input = new Map();
    input.set('a', {});

    const found = recursiveMapsToLists(input);

    const wanted = [{}];

    assert.deepStrictEqual(found, wanted);
  });

  test('non-objects should be kept as-is', () => {
    const input = new Map();
    input.set('a', 'b');

    const found = recursiveMapsToLists(input);

    const wanted = ['b'];

    assert.deepStrictEqual(found, wanted);
  });

  test('directly nested maps should work', () => {
    const input = new Map();
    input.set('a', new Map());
    input.get('a').set('b', {});

    const found = recursiveMapsToLists(input);

    const wanted = [[{}]];

    assert.deepStrictEqual(found, wanted);
  });

  test('objects containing maps should work', () => {
    const input = new Map();
    input.set('a', { b: new Map() });
    input.get('a').b.set('c', {});

    const found = recursiveMapsToLists(input);

    const wanted = [{ b: [{}] }];

    assert.deepStrictEqual(found, wanted);
  });

  test('lists should be left as-is', () => {
    const input = new Map();
    input.set('a', []);

    const found = recursiveMapsToLists(input);

    const wanted = [[]];

    assert.deepStrictEqual(found, wanted);
  });

  test('objects containing non map props should be left as is', () => {
    const input = new Map();
    input.set('a', { b: 'c' });

    const found = recursiveMapsToLists(input);

    const wanted = [{ b: 'c' }];

    assert.deepStrictEqual(found, wanted);
  });
});
