const format = require('pg-promise/lib/formatting');

/**
 * @param { any } value any value
 * @returns { string }
 */
module.exports = function (value){
    if(value === 'NOW()' || value === 'now()') // NOW() returned as-is, so that working with dates is easier
        return value;

    if (value == null) 
        return 'null';

    switch (typeof value) {
        case 'string':
            return format.as.text(value, false);
        case 'boolean':
            return format.as.bool(value);
        case 'number':
        case 'bigint':
            return format.as.number(value);
        case 'symbol':
            throw new TypeError(`Type Symbol has no meaning for PostgreSQL: ${value.toString()}`);
        default:
            if (value instanceof Date) {
                return format.as.date(value, false);
            }
            if (value instanceof Array) {
                return format.as.array(value);
            }
            if (value instanceof Buffer) {
                return format.as.buffer(value, false);
            }
            return format.as.json(value, false);
    }
}