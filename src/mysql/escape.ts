import sqlstring from 'sqlstring';

/**
 * @param value any value
 */
export function escape(value: unknown): string {
  if (value === 'NOW()' || value === 'now()')
    // NOW() returned as-is, so that working with dates is easier
    return value;

  return sqlstring.escape(value);
}
