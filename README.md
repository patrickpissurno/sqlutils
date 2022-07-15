# sqlutils
[![npm-version](https://img.shields.io/npm/v/sqlutils.svg)](https://www.npmjs.com/package/sqlutils)
[![build status](https://travis-ci.org/patrickpissurno/sqlutils.svg?branch=master)](https://travis-ci.org/patrickpissurno/sqlutils)
[![coverage status](https://coveralls.io/repos/github/patrickpissurno/sqlutils/badge.svg?branch=master)](https://coveralls.io/github/patrickpissurno/sqlutils?branch=master)
[![known vulnerabilities](https://snyk.io/test/github/patrickpissurno/sqlutils/badge.svg)](https://snyk.io/test/github/patrickpissurno/sqlutils)
[![downloads](https://img.shields.io/npm/dt/sqlutils.svg)](http://npm-stats.com/~packages/sqlutils)
[![license](https://img.shields.io/github/license/patrickpissurno/sqlutils.svg?maxAge=1800)](https://github.com/patrickpissurno/sqlutils/blob/master/LICENSE)

Lightweight SQL helper methods that simplify stuff (MySQL and PostgreSQL)

`sqlutils` (for MySQL) is powered by [sqlstring](https://github.com/mysqljs/sqlstring), the same library that powers [mysql2](https://www.npmjs.com/package/mysql2).

`sqlutils` (for PostgreSQL) is powered by [pg-promise](https://github.com/vitaly-t/pg-promise), one of the most popular PostgreSQL libraries for Node, with more than 3.1k stars and in active development.

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
console.log(format('INSERT INTO customers ?', { name: 'John Doe', balance: 0 })); //returns: INSERT INTO customers (name, balance) VALUES ('John Doe', 0)
console.log(format('UPDATE customers SET ? WHERE id = 1', { nick: 'Max', name: 'Maximus' })); //returns: UPDATE customers SET nick='Max', name='Maximus' WHERE id = 1
console.log(format('UPDATE customers SET ? WHERE id = 1', { '!visits': '(SELECT COUNT(*) FROM customer_visits WHERE customer_id = 1)' })); //returns: UPDATE customers SET visits=(SELECT COUNT(*) FROM customer_visits WHERE customer_id = 1) WHERE id = 1
console.log(format('INSERT INTO customers ?', [ { name: 'John Doe', balance: 0 }, { name: 'Joe', balance: 1 } ])); //returns: INSERT INTO customers (name, balance) VALUES ('John Doe', 0), ('Joe', 1)
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
console.log('SELECT * FROM customers' + buildWhereFromQuery([{ name: 'John Doe' }, { age: 41 }])); //returns: SELECT * FROM customers WHERE (name='John Doe') OR (age=41)
```

MySQL
```js
const buildWhereFromQuery = require('sqlutils/mysql/buildWhereFromQuery');
console.log('SELECT * FROM customers' + buildWhereFromQuery({ id: 1 })); //returns: SELECT * FROM customers WHERE id=1
console.log('SELECT * FROM customers' + buildWhereFromQuery({ name: ['Maximus', 'John Doe'], balance: 0 })); //returns: SELECT * FROM customers WHERE (name='Maximus' OR name='John Doe') AND balance=0
console.log('SELECT * FROM customers' + buildWhereFromQuery([{ name: 'John Doe' }, { age: 41 }])); //returns: SELECT * FROM customers WHERE (name='John Doe') OR (age=41)
```

## transformer(rows, transformation)

~~Do you like transformers? Then look no further.~~

This is the new Transformer&trade; API. What does it do?
It offers a declarative way to express how your query results
should look like, then it does the magic for you. Sounds simple, right?

You can check out the [full documentation here](./docs/transformer.md). It will get you up and running quickly.

Let's have a look:

PostgreSQL and MySQL
```js
const transformer = require('sqlutils/pg/transformer'); //or require('sqlutils/mysql/transformer');

const rows = [ //in real-world applications this would be the result of a database query
    { ssn: 'abcd', name: 'John Doe', email: 'john@example.com' },
    { ssn: 'abcd', name: 'John Doe', email: 'john@acme.com' },
    { ssn: 'defg', name: 'Jimmy', email: 'jimmy@example.com' },
];

const employees = transformer(rows, {
    key: 'ssn',
    columns: ['name'],
    children: [{
        key: ['email'],
        rename: 'emails',
        flat: true
    }]
});

console.log(employees);
/*
[
    { ssn: 'abcd', name: 'John Doe', emails: ['john@example.com', 'john@acme.com' ] },
    { ssn: 'defg', name: 'Jimmy', emails: ['jimmy@example.com'] }
]
*/
```

Easy! Now let's see something a bit more complex:

PostgreSQL and MySQL
```js
const transformer = require('sqlutils/pg/transformer'); //or require('sqlutils/mysql/transformer');

const rows = [ //in real-world applications this would be the result of a database query
    { id: 1, name: 'Alice', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 1, sale_item_name: 'A' },
    { id: 1, name: 'Alice', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 2, sale_item_name: 'B' },
    { id: 1, name: 'Alice', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 3, sale_item_name: 'C' },
    { id: 1, name: 'Alice', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 4, sale_item_name: 'D' },
    { id: 2, name: 'Bob', sale_id: 3, sale_price_paid: 7.5, sale_item_code: 5, sale_item_name: 'E' },
    { id: 2, name: 'Bob', sale_id: 4, sale_price_paid: 15.5, sale_item_code: 6, sale_item_name: 'F' },
];

const customers = transformer(rows, {
    key: 'id',
    columns: ['name'],
    children: [{
        key: ['sale_id', 'id'],
        columns: [
            ['sale_price_paid', 'price_paid'],
        ],
        rename: 'sales',
        children: [{
            key: ['sale_item_code', 'code'],
            columns: [ ['sale_item_name', 'name'] ],
            rename: 'items',
        }]
    }]
});

console.log(customers);
/*
[
    {
        id: 1,
        name: 'Alice',
        sales: [
            { id: 1, price_paid: 10.5, items: [ { code: 1, name: 'A' }, { code: 2, name: 'B' } ] },
            { id: 2, price_paid: 5.5, items: [ { code: 3, name: 'C' }, { code: 4, name: 'D' } ] },
        ]
    },
    {
        id: 2,
        name: 'Bob',
        sales: [
            { id: 3, price_paid: 7.5, items: [ { code: 5, name: 'E' } ] },
            { id: 4, price_paid: 15.5, items: [ { code: 6, name: 'F' } ] },
        ]
    }
]
*/
```

See? Quite easy, right? And that's still just the tip of the iceberg.
This little monster can tackle a whole lot of tasks, while still being
simple and declarative (maybe even intuitive when you get the hang of it).

I really advise you [check out the docs](./docs/transformer.md). There you'll find everything you need
not only to get up and running quickly, but also a complete description of
every feature it provides.

By the way: imagine you could even get autocomplete for your query results when using
this marvelous API? Sounds like magic? It sure is. But it's also true and possible,
and I'm writing my thesis on it. Hang tight, a tool for it will be available this August (2022).
Same API: just plug and play.

## groupColumnsToObjects

[Take a look here](./docs/groupColumnsToObjects.md).

## Production-ready?
Yes. This library has a strict 100% coverage policy. Travis-CI runs for every commit, which guarantees safety. It's been in production for more than four years.

## License

MIT License

Copyright (c) 2019-2022 Patrick Pissurno

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
