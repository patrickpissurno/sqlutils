import { escape } from './escape.js';

//TODO: keys should also be escaped with the double quote character (")
// and support for columns with whitespaces should also be added

export type QueryValue = string | number | boolean | null | Date;

export type BuildWhereFromQueryProps = Record<
  string,
  QueryValue | QueryValue[] | BuildWhereFromQueryProps[]
>;

/**
 * @param query query object or array of query objects
 */
export function buildWhereFromQuery(
  query: BuildWhereFromQueryProps | BuildWhereFromQueryProps[],
): string {
  const queries = Array.isArray(query) ? query : [query];

  const r = queries
    .map((query) => {
      let str = '';
      let i = 0;

      let key: keyof typeof query;
      for (key in query) {
        const value = query[key];
        if (Array.isArray(value)) {
          if (i == 0) str += ' (';
          else str += ' AND ';
          str +=
            '(' +
            value
              .map((x) => `${key}${x == null ? ' IS ' : '='}${escape(x)}`)
              .join(' OR ') +
            ')';
        } else {
          if (i == 0) str += ' (';
          else str += ' AND ';
          str += `${key}=${escape(query[key])}`;
        }
        i += 1;
      }
      if (i > 0) str += ')';
      return str;
    })
    .filter((x) => x)
    .join(' OR');

  return !r ? '' : ' WHERE' + r;
}
