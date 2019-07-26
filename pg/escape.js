const sqlstring = require('sqlstring');

module.exports = function (value){
    if(value === 'NOW()' || value === 'now()') // NOW() returned as-is, so that working with dates is easier
        return value;

    if(typeof(value) === 'string'){ // postgres strings are escaped with double quotes instead of backslash
        value = value.replace(/\\/gi, '\u{0004}');
        value = sqlstring.escape(value);
        value = value.replace(/\\'/g, "''");
        return value.replace(/\u{0004}/giu, '\\');
    }

    return sqlstring.escape(value);
}