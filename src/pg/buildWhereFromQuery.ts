import { escape } from './escape.js';

//TODO: keys should also be escaped with the double quote character (")
// and support for columns with whitespaces should also be added

export type BuildWhereFromQueryProps =
  | Record<string, unknown>
  | BuildWhereFromQueryProps[];

/**
 * @param query object
 */
export function buildWhereFromQuery(query: BuildWhereFromQueryProps): string {
  const queries = Array.isArray(query) ? query : [query];

  const r = queries
    .map((query) => {
      let str = '';
      let i = 0;

      let key: keyof typeof query;
      for (key in query) {
        if (Array.isArray(query[key])) {
          if (i == 0) str += ' (';
          else str += ' AND ';
          str +=
            '(' +
            query[key]
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
