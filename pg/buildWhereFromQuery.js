const escape = require('./escape');

/**
 * @param { object } query object
 * @returns { string }
 */
module.exports = function(query){
    let queries = Array.isArray(query) ? query : [ query ];

    let r = queries.map(query => {
        let str = '';
        let i = 0;
        for(let key in query){
            if(Array.isArray(query[key])){
                if(i == 0)
                    str += ' (';
                else
                    str += ' AND ';
                str += '(' + query[key].map(x => `${key}${x == null ? ' IS ' : '='}${escape(x)}`).join(' OR ') + ')';
            }
            else {
                if(i == 0)
                    str += ' (';
                else
                    str += ' AND ';
                str += `${key}=${escape(query[key])}`;
            }
            i += 1;
        }
        if(i > 0)
            str += ')';
        return str;
    }).filter(x => x).join(' OR');

    return !r ? '' : ' WHERE' + r;
}