const escape = require('./escape');

module.exports = function(query, obj){
    if(query.toLowerCase().indexOf('insert') !== -1){
        let keys = `(${ Object.keys(obj).join(',') })`;
        let values = `(${ Object.values(obj).map(x => escape(x)).join(',') })`;
        
        return query.replace('?', keys + ' VALUES ' + values);
    }
    else {
        let values = '';
        for(let key in obj)
            values += (values.length > 0 ? ',' : '') + key + '=' + escape(obj[key]);
        return query.replace('?', values);
    }
}