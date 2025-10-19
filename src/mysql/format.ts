import { escape } from './escape.js';

export type FormatProps = Record<string, unknown> | Record<string, unknown>[];

/**
 * @param statement sql statement
 * @param obj object or array of objects
 */
export function format(statement: string, obj: FormatProps) {
  let clone = structuredClone(obj); // clone obj to avoid mutations

  if (Array.isArray(clone) && clone.length === 0)
    throw new Error('array should have at least one element');

  const clone_as_array = Array.isArray(clone) ? clone : [clone];

  for (let i = 0; i < clone_as_array.length; i++) {
    const o = clone_as_array[i];
    const _o: Record<string, unknown> = {};
    for (let key in o) {
      if (key.length > 1 && key[0] === '!') {
        _o[key.substring(1)] = o[key]; //raw mode
      } else {
        _o[key] = escape(o[key]);
      }
    }
    clone_as_array[i] = _o;
  }

  if (!Array.isArray(clone)) clone = clone_as_array[0];

  if (statement.toLowerCase().indexOf('insert') !== -1) {
    const keys = `(${Object.keys(clone_as_array[0]).join(',')})`;
    const values = clone_as_array
      .map((x) => `(${Object.values(x).join(',')})`)
      .join(',');

    return statement.replace('?', keys + ' VALUES ' + values);
  } else {
    if (Array.isArray(clone))
      throw new Error('use objects for update queries, not arrays');

    let values = '';
    for (let key in clone)
      values += (values.length > 0 ? ',' : '') + key + '=' + clone[key];
    return statement.replace('?', values);
  }
}
