type FormatAsKey =
  | 'ctf'
  | 'text'
  | 'name'
  | 'alias'
  | 'value'
  | 'buffer'
  | 'bool'
  | 'date'
  | 'number'
  | 'array'
  | 'csv'
  | 'json'
  | 'func';

declare module 'pg-promise/lib/formatting.js' {
  export default {
    as: Record<FormatAsKey, (value: unknown, ...[]) => string>,
  };
}

declare module 'sqlstring' {
  export default {
    escape: (value: unknown) => string,
  };
}
