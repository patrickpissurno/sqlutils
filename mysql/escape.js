const sqlstring = require('sqlstring');

/**
 * @param { any } value any value
 * @returns { string }
 */
module.exports = function (value){
    if(value === 'NOW()' || value === 'now()') // NOW() returned as-is, so that working with dates is easier
        return value;
        
    return sqlstring.escape(value);
}