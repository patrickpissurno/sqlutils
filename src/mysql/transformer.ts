import { recursiveMapsToLists } from '../utils/recursiveMapsToLists.js';

// type GetColumnOut<K, V extends Column<K>> = V extends [K, string] ? V[1] : V;

// type Column<K> = K | [K, string];

// export type Transformation<Row extends Record<string, unknown>> = {
//   key: Column<keyof Row>;
//   columns?: Column<keyof Row>[];
//   children?: (Transformation<Row> & ChildTransformation)[];
// };

// export type ChildTransformation = {
//   rename: string;
// } & (
//   | {
//       /** cannot be true when flat is true */
//       single?: true;
//     }
//   | {
//       /** cannot be true when single is true */
//       flat?: true;
//     }
// );

// export type TransformationResult<
//   Row extends Record<string, unknown>,
//   T extends Transformation<Row>,
// > = {
//   //implement
// };

// [`1`]: T['key'] extends [string, string] ? T['key'][1] : T['key'];
// [`1`]: GetColumnOut<keyof Row, T['key']>;
// [GetColumnOut<keyof Row, T['key']>]: string;

// --- Fixed & Helper Types ---

/**
 * Represents a column from the source row.
 * Can be a simple key 'K' (e.g., 'id')
 * or a tuple [K, string | null] for aliasing (e.g., ['sale_id', 'id'] or ['id', null] to omit).
 */
export type Column<K extends PropertyKey> = K | [K, string | null];

/**
 * Gets the *output key name* for a given Column type.
 * 'id' -> 'id'
 * ['sale_id', 'id'] -> 'id'
 * ['id', null] -> never (property is omitted)
 */
type GetColumnOut<C extends Column<any>> = C extends [any, infer R]
  ? R extends null
    ? never
    : R
  : C;

/**
 * Gets the *value type* from the Row for a given Column type.
 * Row, 'id' -> Row['id']
 * Row, ['sale_id', 'id'] -> Row['sale_id']
 */
type GetColumnValue<
  Row extends Record<string, unknown>,
  C extends Column<keyof Row>,
> = C extends [infer K, any]
  ? K extends keyof Row
    ? Row[K]
    : never
  : C extends keyof Row
    ? Row[C]
    : never;

/**
 * Defines the shape of a child transformation.
 * Fixed to make 'single' and 'flat' mutually exclusive.
 */
export type ChildTransformation = {
  rename: string;
} & (
  | { single?: never; flat?: never } // Default: result is an array
  | { single: true; flat?: never } // Result is a single object
  | { single?: never; flat: true } // Result is a flat array of values
);

/**
 * The main transformation definition.
 */
export type Transformation<Row extends Record<string, unknown>> = {
  key: Column<keyof Row>;
  columns?: readonly Column<keyof Row>[]; // Use readonly for better type inference
  children?: readonly (Transformation<Row> & ChildTransformation)[]; // Use readonly
};

// --- TransformationResult Implementation Helpers ---

/**
 * Computes the properties from the 'key' and 'columns' fields.
 */
type BaseProperties<
  Row extends Record<string, unknown>,
  T extends Transformation<Row>,
> = {
  // Property from 'key'
  [P in GetColumnOut<T['key']>]: GetColumnValue<Row, T['key']>;
} &
  // Properties from 'columns'
  (T['columns'] extends readonly Column<keyof Row>[]
    ? {
        [I in keyof T['columns'] as I extends `${number}` // Map numeric indices
          ? GetColumnOut<T['columns'][I]> // Get output key name
          : never]: I extends `${number}`
          ? GetColumnValue<Row, T['columns'][I]> // Get value type
          : never;
      }
    : {});

/**
 * Computes the value type for a 'flat' child transformation.
 * It's the type of the first column, or if no columns, the type of the key.
 */
type FlatValue<
  Row extends Record<string, unknown>,
  C extends Transformation<Row>,
> = C['columns'] extends readonly [infer FirstCol, ...any[]] // Has at least one column
  ? FirstCol extends Column<keyof Row>
    ? GetColumnValue<Row, FirstCol>
    : never
  : C['columns'] extends undefined | readonly [] // Has no columns
    ? GetColumnValue<Row, C['key']> // Use key's value
    : never;

/**
 * Computes the result type for a single child, handling 'flat' and 'single'.
 */
type ChildResult<
  Row extends Record<string, unknown>,
  C extends Transformation<Row> & ChildTransformation,
> = C extends { flat: true }
  ? FlatValue<Row, C>[] // Array of primitive values
  : C extends { single: true }
    ? TransformationResult<Row, C> // Single nested object
    : TransformationResult<Row, C>[]; // Array of nested objects (default)

/**
 * Computes the properties from the 'children' field.
 */
type ChildrenProperties<
  Row extends Record<string, unknown>,
  Children extends
    | readonly (Transformation<Row> & ChildTransformation)[]
    | undefined,
> = Children extends readonly (Transformation<Row> & ChildTransformation)[]
  ? {
      [I in keyof Children as I extends `${number}`
        ? Children[I]['rename'] // Property name is the 'rename' value
        : never]: I extends `${number}`
        ? ChildResult<Row, Children[I]> // Value is the recursive result
        : never;
    }
  : {};

// --- Exported TransformationResult ---

/**
 * Computes the static result type for a given Row and Transformation.
 */
export type TransformationResult<
  Row extends Record<string, unknown>,
  T extends Transformation<Row>,
> = BaseProperties<Row, T> & ChildrenProperties<Row, T['children']>;

function getColumnIn<K extends PropertyKey>(column: Column<K>) {
  if (Array.isArray(column)) return column[0];
  return column;
}

function getColumnOut<K extends PropertyKey>(column: Column<K>) {
  if (Array.isArray(column)) return column[1] ?? null;
  return column;
}

/**
 * @param rows
 * @param transformation transformation mapping
 */
export function transformer<
  Row extends Record<string, unknown>,
  T extends Transformation<Row>,
>(rows: readonly Row[], transformation: T): TransformationResult<Row, T>[] {
  const result = new Map<string, unknown>() as any;

  for (const row of rows) {
    const key_in = getColumnIn(transformation.key);

    let target;
    if (result.has(row[key_in])) {
      target = result.get(row[key_in]);
    } else {
      target = {};
      result.set(row[key_in], target);
    }

    applyTransformation(row, target, transformation);
  }

  return recursiveMapsToLists(result) as any;
}

function applyTransformation(row: any, target: any, transformation: any) {
  const key_in = getColumnIn(transformation.key);
  const key_out = getColumnOut(transformation.key);

  if (key_out != null) target[key_out] = row[key_in];

  for (let col of transformation.columns || []) {
    const c_in = getColumnIn(col);
    const c_out = getColumnOut(col);

    if (c_out != null) target[c_out] = row[c_in];
  }

  for (let child of transformation.children || []) {
    if (target[child.rename] === undefined)
      target[child.rename] = child.single ? {} : child.flat ? [] : new Map();

    if (child.flat) {
      const ckey_in = getColumnIn(child.key);
      const ckey_out = getColumnOut(child.key);

      const prop_name = ckey_out
        ? ckey_in
        : child.columns && child.columns.length > 0
          ? getColumnIn(child.columns[0])
          : undefined;
      if (prop_name) target[child.rename].push(row[prop_name]);
    } else {
      const key_in = getColumnIn(child.key);

      let _target;
      if (child.single) {
        _target = target[child.rename];
      } else if (target[child.rename].has(row[key_in])) {
        _target = target[child.rename].get(row[key_in]);
      } else {
        _target = {};
        target[child.rename].set(row[key_in], _target);
      }

      applyTransformation(row, _target, child);
    }
  }
}
