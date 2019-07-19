const escape = require('./escape');

module.exports = function(statement, obj){
    let _obj = {};

    for(let key in obj){
        if(typeof(key) === 'string' && key.length > 1 && key[0] === '!') //raw mode
            _obj[key.substring(1, key.length)] = obj[key];
        else
            _obj[key] = escape(obj[key]);
    }

    obj = _obj;

    if(statement.toLowerCase().indexOf('insert') !== -1){
        let keys = `(${ Object.keys(obj).join(',') })`;
        let values = `(${ Object.values(obj).join(',') })`;
        
        return statement.replace('?', keys + ' VALUES ' + values);
    }
    else {
        let values = '';
        for(let key in obj)
            values += (values.length > 0 ? ',' : '') + key + '=' + obj[key];
        return statement.replace('?', values);
    }
}