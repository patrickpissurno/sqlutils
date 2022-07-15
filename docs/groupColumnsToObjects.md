## groupColumnsToObjects(rows, primary_key, groups)

This method has been *deprecated*, as an improved alternative has been provided: the **transformer** api.

Going forward `groupColumnsToObjects` will be kept the same (improvements are not planned, though)
and the new transformer API will also be provided (with updates and improvements) separately
through the `transformer` helper.

TLDR: don't use this for new projects. If already using it, consider migrating,
but no need to rush as this one isn't going anywhere.

PostgreSQL and MySQL
```js
const groupColumnsToObjects = require('sqlutils/pg/groupColumnsToObjects'); //or require('sqlutils/mysql/groupColumnsToObjects');

const rows = [ //in real-world applications this would be the result of a database query
    { ssn: 'abcd', name: 'John Doe', email: 'john@example.com' },
    { ssn: 'abcd', name: 'John Doe', email: 'john@acme.com' },
    { ssn: 'defg', name: 'Jimmy', email: 'jimmy@example.com' },
];

const employees = groupColumnsToObjects(rows, 'ssn', [
    { foreign_key: 'email', out: 'emails' }
]);

console.log(employees);
/*
[
    {
        "ssn": "abcd",
        "name": "John Doe",
        "emails": [
            "john@example.com",
            "john@acme.com"
        ]
    },
    {
        "ssn": "defg",
        "name": "Jimmy",
        "emails": [
            "jimmy@example.com"
        ]
    }
]
*/
```
This method is much more powerful than it seems. For sofisticated examples [take a look here](https://github.com/patrickpissurno/sqlutils/blob/master/mysql/groupColumnsToObjects.test.js).