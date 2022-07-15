/**
 * @deprecated
 * @param { object[] } rows rows returned from mysql
 * @param { string } primary_key primary key column name
 * @param { object[] } groups
 * @returns { object[] }
 */
module.exports = function(rows, primary_key, groups){
    const map = {};

    const getGroupColumns = (group) => {
        group.flatten = !group.columns;
        return (!group.columns || group.columns.length < 1 ? [{ name: group.foreign_key, out: group.foreign_key }] : (
            typeof(group.columns[0]) === 'string' ? 
            group.columns.map(x => ({ name: x, out: x })) : 
            group.columns
        ));
    };

    groups = groups.map(x => {
        x.columns = getGroupColumns(x);
        return x;
    });

    const exclude = groups
        .map(group => group.columns.map(x => x.name))
        .reduce((acc, item) => acc.concat(item), [])
        .map(x => ({ [x]: true }))
        .reduce((acc, item) => Object.assign(acc, item), {});

    for(let row of rows){
        const id = row[primary_key];
        if(map[id] === undefined){
            map[id] = {};
            for(let column in row)
                if(!exclude[column])
                    map[id][column] = row[column];
        }

        for(let group of groups){
            if(map[id][group.out] === undefined)
                map[id][group.out] = {};

            if(map[id][group.out][row[group.foreign_key]] !== undefined)
                continue;

            if(row[group.foreign_key] == null)
                continue;

            let obj = {};
            for(let column of group.columns)
                obj[column.out] = row[column.name];

            map[id][group.out][row[group.foreign_key]] = obj;
        }
    }

    return Object.values(map).map((x) => {
        for(let group of groups){
            x[group.out] = Object.values(x[group.out]);
            
            if(group.flatten)
                x[group.out] = x[group.out].map(i => Object.values(i)[0]);
        }
        return x;
    });
}