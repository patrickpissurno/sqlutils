/**
 * Converts all nested maps into nested lists
 * @param {Map} map 
 * @param {any[]} map 
 */
 function recursiveMapsToLists(map){
    const list = Array.from(map.values());
    for(let i = 0; i < list.length; i++){
        if(typeof(list[i]) !== 'object')
            continue;

        if(list[i] instanceof Map){
            list[i] = recursiveMapsToLists(list[i]);
        }
        else if(!Array.isArray(list[i])){
            for(let key in list[i]){
                if(typeof(list[i][key]) === 'object' && list[i][key] instanceof Map)
                    list[i][key] = recursiveMapsToLists(list[i][key]);
            }
        }
    }
    return list;
}

module.exports = recursiveMapsToLists;