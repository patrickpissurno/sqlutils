declare module 'sqlutils/mysql' {
    type Transformation = {
        key: string | [string, string],
        columns?: Array<string | [string, string]>,
        children?: Array<Transformation & ChildTransformation> 
    }

    type ChildTransformation = {
        rename: string,
        single?: boolean,
        flat?: boolean
    }

    export function format(statement: string, obj: object|object[]): string
    export function escape(value: any): string
    export function buildWhereFromQuery(query: object): string
    export function groupColumnsToObjects(rows: object[], primary_key: string, groups: object[]): object[]
    export function transformer(rows: any[], transformation: Transformation): object[]
};