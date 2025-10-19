export type Group = {
  foreign_key: string;
  out: string;
  columns?: { name: string; out: string }[] | string[];
};

type ExtendedGroup = Omit<Group, 'columns'> & {
  flatten: boolean;
  columns: {
    name: string;
    out: string;
  }[];
};

/**
 * @deprecated
 * @param rows rows returned from mysql
 * @param primary_key primary key column name
 * @param groups
 */
export function groupColumnsToObjects(
  rows: Record<string, unknown>[],
  primary_key: string,
  groups: Group[],
) {
  let _rows = structuredClone(rows);
  let _groups = structuredClone(groups) as ExtendedGroup[];
  const map: Record<string, Record<string, unknown>> = {};

  const getGroupColumns = (group: Group) => {
    (group as ExtendedGroup).flatten = !group.columns;
    return !group.columns || group.columns.length < 1
      ? [{ name: group.foreign_key, out: group.foreign_key }]
      : typeof group.columns[0] === 'string'
        ? group.columns.map((x) => ({ name: x as string, out: x as string }))
        : (group.columns as { name: string; out: string }[]);
  };

  _groups = _groups.map((x) => {
    x.columns = getGroupColumns(x);
    return x;
  });

  const exclude = _groups
    .map((group) => group.columns.map((x) => x.name))
    .reduce((acc, item) => acc.concat(item), [])
    .map((x) => ({ [x]: true }))
    .reduce((acc, item) => Object.assign(acc, item), {});

  for (const row of _rows) {
    const id = row[primary_key] as string | number;
    if (map[id] === undefined) {
      map[id] = {};
      for (const column in row)
        if (!exclude[column]) map[id][column] = row[column];
    }

    for (const group of _groups) {
      if (map[id][group.out] === undefined) map[id][group.out] = {};

      const fk = row[group.foreign_key] as string | number;

      if ((map[id][group.out] as Record<string, unknown>)[fk] !== undefined) {
        continue;
      }

      if (fk == null) continue;

      const obj: Record<string, unknown> = {};
      for (let column of group.columns) {
        obj[column.out] = row[column.name];
      }

      (map[id][group.out] as Record<string, unknown>)[fk] = obj;
    }
  }

  return Object.values(map).map((x) => {
    for (const group of _groups) {
      x[group.out] = Object.values(x[group.out] as Record<string, unknown>);

      if (group.flatten)
        x[group.out] = (x[group.out] as Record<string, unknown>[]).map(
          (i) => Object.values(i)[0],
        );
    }
    return x;
  });
}
