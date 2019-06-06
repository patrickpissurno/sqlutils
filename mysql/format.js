const escape = require('./escape');

module.exports = function(query, obj){
    let values = '';

    for(let key in obj)
        values += (values.length > 0 ? ',' : '') + key + '=' + escape(obj[key]);

    if(query.toLowerCase().indexOf('insert') !== -1)
        values = 'SET ' + values;

    return query.replace('?', values);
}