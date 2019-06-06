const escape = require('./escape');

module.exports = function(statement, obj){
    let values = '';

    for(let key in obj)
        values += (values.length > 0 ? ',' : '') + key + '=' + escape(obj[key]);

    if(statement.toLowerCase().indexOf('insert') !== -1)
        values = 'SET ' + values;

    return statement.replace('?', values);
}