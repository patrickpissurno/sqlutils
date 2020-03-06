const escape = require('./escape');

/**
 * @param { string } statement sql statement
 * @param { object|object[] } obj object or array of objects
 * @returns { string }
 */
module.exports = function(statement, obj){
    const array_mode = Array.isArray(obj);
    if(array_mode && obj.length === 0)
        throw new Error('array should have at least one element');

    let obj_as_array;
    if(array_mode)
        obj_as_array = obj;
    else
        obj_as_array = [ obj ];

    for(let i = 0; i < obj_as_array.length; i++){
        let obj = obj_as_array[i];
        let _obj = {};
        for(let key in obj){
            if(typeof(key) === 'string' && key.length > 1 && key[0] === '!') //raw mode
                _obj[key.substring(1)] = obj[key];
            else
                _obj[key] = escape(obj[key]);
        }
        obj_as_array[i] = _obj;
    }
    
    if(!array_mode)
        obj = obj_as_array[0];

    if(statement.toLowerCase().indexOf('insert') !== -1){
        let keys = `(${ Object.keys(obj_as_array[0]).join(',') })`;   
        let values = obj_as_array.map(x => `(${ Object.values(x).join(',') })`).join(',');
        
        return statement.replace('?', keys + ' VALUES ' + values);
    }
    else {
        if(array_mode)
            throw new Error('use objects for update queries, not arrays');

        let values = '';
        for(let key in obj)
            values += (values.length > 0 ? ',' : '') + key + '=' + obj[key];
        return statement.replace('?', values);
    }
}