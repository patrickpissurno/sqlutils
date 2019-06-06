const sqlstring = require('sqlstring');

module.exports = function (value){
    if(value === 'NOW()' || value === 'now()') // NOW() returned as-is, so that working with dates is easier
        return value;

    if(typeof(value) === 'string'){ // postgres strings are escaped with double quotes instead of backslash
        value = sqlstring.escape(value);
        return value.replace(/\\'/g, "''");
    }

    return sqlstring.escape(value);
}