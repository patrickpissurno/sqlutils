const recursiveMapsToLists = require('../utils/recursiveMapsToLists');

/**
 * @typedef Transformation
 * @property {string|[string,string]} key
 * @property {(string|[string,string])[]} [columns]
 * @property {(Transformation & ChildTransformation)[]} [children]
 */

/**
 * @typedef ChildTransformation
 * @property {string} rename
 * @property {boolean} [single] cannot be true when flat is true
 * @property {boolean} [flat] cannot be true when single is true
 */

/**
 * @param {string|[string,string]} column 
 * @returns {string} column (in)
 */
 function getColumnIn(column){
    if(typeof(column) === 'string')
        return column;
    return column[0];
}

/**
 * @param {string|[string,string]} column 
 * @returns {string} column (out)
 */
function getColumnOut(column){
    if(typeof(column) === 'string')
        return column;
    return column[1] ?? null;
}

/**
 * @param {any[]} rows
 * @param {Transformation} transformation transformation mapping
 */
function transformer(rows, transformation){
    /** @type {Map<string, any>} */
    const result = new Map();

    for(let row of rows){
        const key_in = getColumnIn(transformation.key);

        let target;
        if(result.has(row[key_in])){
            target = result.get(row[key_in]);
        }
        else {
            target = {};
            result.set(row[key_in], target);
        }

        applyTransformation(row, target, transformation);
    }

    return recursiveMapsToLists(result);
}

/**
 * 
 * @param {object} row 
 * @param {object} target 
 * @param {Transformation} transformation 
 */
function applyTransformation(row, target, transformation){
    const key_in = getColumnIn(transformation.key);
    const key_out = getColumnOut(transformation.key);

    if(key_out != null)
        target[key_out] = row[key_in];

    for(let col of (transformation.columns || [])){
        const c_in = getColumnIn(col);
        const c_out = getColumnOut(col);

        if(c_out != null)
            target[c_out] = row[c_in];
    }

    for(let child of (transformation.children || [])){
        if(target[child.rename] === undefined)
            target[child.rename] = child.single ? {} : (child.flat ? [] : new Map());
        
        if(child.flat){
            const ckey_in = getColumnIn(child.key);
            const ckey_out = getColumnOut(child.key);

            const prop_name = ckey_out ? ckey_in : (child.columns && child.columns.length > 0 ? getColumnIn(child.columns[0]) : undefined);
            if(prop_name)
                target[child.rename].push(row[prop_name]);
        }
        else {
            const key_in = getColumnIn(child.key);

            let _target;
            if(child.single){
                _target = target[child.rename];
            }
            else if(target[child.rename].has(row[key_in])){
                _target = target[child.rename].get(row[key_in]);
            }
            else {
                _target = {};
                target[child.rename].set(row[key_in], _target);
            }

            applyTransformation(row, _target, child);
        }
    }
}

module.exports = transformer;