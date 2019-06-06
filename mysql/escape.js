const sqlstring = require('sqlstring');

module.exports = function (value){
    if(value === 'NOW()' || value === 'now()') // NOW() returned as-is, so that working with dates is easier
        return value;
        
    return sqlstring.escape(value);
}