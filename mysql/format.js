const escape = require('./escape');

module.exports = function(statement, obj){
    let values = '';

    for(let key in obj){
        const raw = typeof(key) === 'string' && key.length > 1 && key[0] === '!';

        values += (values.length > 0 ? ',' : '');
        
        if(raw) //raw mode
            values += key.substring(1, key.length) + '=' + obj[key];
        else
            values += key + '=' + escape(obj[key]);
    }

    if(statement.toLowerCase().indexOf('insert') !== -1)
        values = 'SET ' + values;

    return statement.replace('?', values);
}