# sqlutils
[![npm-version](https://img.shields.io/npm/v/sqlutils.svg)](https://www.npmjs.com/package/sqlutils)
[![build status](https://travis-ci.org/patrickpissurno/sqlutils.svg?branch=master)](https://travis-ci.org/patrickpissurno/sqlutils)
[![coverage status](https://coveralls.io/repos/github/patrickpissurno/sqlutils/badge.svg?branch=master)](https://coveralls.io/github/patrickpissurno/sqlutils?branch=master)
[![known vulnerabilities](https://snyk.io/test/github/patrickpissurno/sqlutils/badge.svg)](https://snyk.io/test/github/patrickpissurno/sqlutils)
[![downloads](https://img.shields.io/npm/dt/sqlutils.svg)](http://npm-stats.com/~packages/sqlutils)
[![license](https://img.shields.io/github/license/patrickpissurno/sqlutils.svg?maxAge=1800)](https://github.com/patrickpissurno/sqlutils/blob/master/LICENSE)

Lightweight SQL helper methods that simplify stuff (MySQL and PostgreSQL)

`sqlutils` is powered by [sqlstring](https://github.com/mysqljs/sqlstring), the same library that powers [mysql2](https://www.npmjs.com/package/mysql2).

The aim of this library is to offer standard helper methods that behave in similar ways for PostgreSQL and MySQL. 

## Install

```
npm i sqlutils
```

## How to import helpers

PostgreSQL
```js
const escape = require('sqlutils/pg/escape');
// or
const { escape } = require('sqlutils/pg');
// or
const escape = require('sqlutils/pg').escape;
```

MySQL
```js
const escape = require('sqlutils/mysql/escape');
// or
const { escape } = require('sqlutils/mysql');
// or
const escape = require('sqlutils/mysql').escape;
```

## escape(val)

PostgreSQL
```js
const escape = require('sqlutils/pg/escape');
console.log(escape("let's do it")); //returns: 'let''s do it'
```

MySQL
```js
const escape = require('sqlutils/mysql/escape');
console.log(escape("let's do it")); //returns: 'let\'s do it'
```

## format(statement, obj)

PostgreSQL
```js
const format = require('sqlutils/pg/format');
console.log(format('INSERT INTO customers ?', { name: 'John Doe', balance: 0 })); //returns: INSERT INTO customers (name, balance) VALUES (E'John Doe', 0)
console.log(format('UPDATE customers SET ? WHERE id = 1', { nick: 'Max', name: 'Maximus' })); //returns: UPDATE customers SET nick=E'Max', name=E'Maximus' WHERE id = 1
console.log(format('UPDATE customers SET ? WHERE id = 1', { '!visits': '(SELECT COUNT(*) FROM customer_visits WHERE customer_id = 1)' })); //returns: UPDATE customers SET visits=(SELECT COUNT(*) FROM customer_visits WHERE customer_id = 1) WHERE id = 1
console.log(format('INSERT INTO customers ?', [ { name: 'John Doe', balance: 0 }, { name: 'Joe', balance: 1 } ])); //returns: INSERT INTO customers (name, balance) VALUES (E'John Doe', 0), (E'Joe', 1)
```

MySQL
```js
const format = require('sqlutils/mysql/format');
console.log(format('INSERT INTO customers ?', { name: 'John Doe', balance: 0 })); //returns: INSERT INTO customers (name, balance) VALUES ('John Doe', 0)
console.log(format('UPDATE customers SET ? WHERE id = 1', { nick: 'Max', name: 'Maximus' })); //returns: UPDATE customers SET nick='Max', name='Maximus' WHERE id = 1
console.log(format('UPDATE customers SET ? WHERE id = 1', { '!visits': '(SELECT COUNT(*) FROM customer_visits WHERE customer_id = 1)' })); //returns: UPDATE customers SET visits=(SELECT COUNT(*) FROM customer_visits WHERE customer_id = 1) WHERE id = 1
console.log(format('INSERT INTO customers ?', [ { name: 'John Doe', balance: 0 }, { name: 'Joe', balance: 1 } ])); //returns: INSERT INTO customers (name, balance) VALUES ('John Doe', 0), ('Joe', 1)
```

Some explanation about the third example: by using ```!visits``` instead of ```visits``` as the key, you tell the formatter not to escape the string value (raw mode). This way you can combine powerful SQL subqueries with the simplicity of sqlutils. I recommend reading that example carefully.

## buildWhereFromQuery(queryObject)

PostgreSQL
```js
const buildWhereFromQuery = require('sqlutils/pg/buildWhereFromQuery');
console.log('SELECT * FROM customers' + buildWhereFromQuery({ id: 1 })); //returns: SELECT * FROM customers WHERE id=1
console.log('SELECT * FROM customers' + buildWhereFromQuery({ name: ['Maximus', 'John Doe'], balance: 0 })); //returns: SELECT * FROM customers WHERE (name='Maximus' OR name='John Doe') AND balance=0
```

MySQL
```js
const buildWhereFromQuery = require('sqlutils/mysql/buildWhereFromQuery');
console.log('SELECT * FROM customers' + buildWhereFromQuery({ id: 1 })); //returns: SELECT * FROM customers WHERE id=1
console.log('SELECT * FROM customers' + buildWhereFromQuery({ name: ['Maximus', 'John Doe'], balance: 0 })); //returns: SELECT * FROM customers WHERE (name='Maximus' OR name='John Doe') AND balance=0
```

## groupColumnsToObjects(rows, primary_key, groups)

PostgreSQL and MySQL
```js
const groupColumnsToObjects = require('sqlutils/pg/groupColumnsToObjects'); //or require('sqlutils/mysql/buildWhereFromQuery');

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

## Production-ready?
Yes. This library has a strict 100% coverage policy. Travis-CI runs for every commit, which guarantees safety. It's been in production internally for more than a year.

## License

MIT License

Copyright (c) 2019 Patrick Pissurno

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
