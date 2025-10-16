type Value = string | number | boolean | null | undefined;

export type RecursiveMap = Map<
  string,
  Record<string, RecursiveMap> | Value[] | Value | RecursiveMap
>;

export type RecursiveList = Array<
  Record<string, RecursiveList> | Value[] | Value | RecursiveList
>;

/**
 * Converts all nested maps into nested lists
 * @param {Map} map
 * @param {any[]} map
 */
export function recursiveMapsToLists(map: RecursiveMap) {
  const result: RecursiveList = [];

  for (const [, item] of map) {
    if (item == null || typeof item !== 'object' || Array.isArray(item)) {
      result.push(item);
    } else if (item instanceof Map) {
      result.push(recursiveMapsToLists(item));
    } else {
      const out: Record<string, RecursiveList> = { ...item } as never;

      for (const key in item) {
        if (typeof item[key] === 'object' && item[key] instanceof Map) {
          out[key] = recursiveMapsToLists(item[key]);
        }
      }

      result.push(out);
    }
  }

  return result;
}
