# sqlutils
[![npm-version](https://img.shields.io/npm/v/sqlutils.svg)](https://www.npmjs.com/package/sqlutils)
[![build status](https://travis-ci.org/patrickpissurno/sqlutils.svg?branch=master)](https://travis-ci.org/patrickpissurno/sqlutils)
[![coverage status](https://coveralls.io/repos/github/patrickpissurno/sqlutils/badge.svg?branch=master)](https://coveralls.io/github/patrickpissurno/sqlutils?branch=master)
[![known vulnerabilities](https://snyk.io/test/github/patrickpissurno/sqlutils/badge.svg)](https://snyk.io/test/github/patrickpissurno/sqlutils)
[![downloads](https://img.shields.io/npm/dt/sqlutils.svg)](http://npm-stats.com/~packages/sqlutils)
[![license](https://img.shields.io/github/license/patrickpissurno/sqlutils.svg?maxAge=1800)](https://github.com/patrickpissurno/sqlutils/blob/master/LICENSE)

Lightweight SQL helper methods that simplify stuff (MySQL and PostgreSQL)

`sqlutils` is powered by [sqlstring](https://github.com/mysqljs/sqlstring), the same library that powers [mysql2](https://www.npmjs.com/package/mysql2).

The aim of this library is to offer standard helper methods that behave in a similar way for PostgreSQL and MySQL. 

## Install

```
npm i sqlutils
```

## Importing helper methods

Postgres
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

## Example: escape(val)

Postgres
```js
const escape = require('sqlutils/pg/escape');
console.log(escape("let's do it")); //returns: 'let''s do it'
```

MySQL
```js
const escape = require('sqlutils/mysql/escape');
console.log(escape("let's do it")); //returns: 'let\'s do it'
```

## Example: format(statement, obj)

Postgres
```js
const format = require('sqlutils/pg/format');
console.log(format('INSERT INTO customers ?', { name: 'John Doe', balance: 0 })); //returns: INSERT INTO customers (name, balance) VALUES ('John Doe', 0)
console.log(format('UPDATE customers SET ? WHERE id = 1', { nick: 'Max', name: 'Maximus' })); //returns: UPDATE customers SET nick='Max', name='Maximus' WHERE id = 1
```

MySQL
```js
const format = require('sqlutils/mysql/format');
console.log(format('INSERT INTO customers ?', { name: 'John Doe', balance: 0 })); //returns: INSERT INTO customers SET name='John Doe', balance=0
console.log(format('UPDATE customers SET ? WHERE id = 1', { nick: 'Max', name: 'Maximus' })); //returns: UPDATE customers SET nick='Max', name='Maximus' WHERE id = 1
```

## Example: buildWhereFromQuery(queryObject)

Postgres
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

## Production-ready?
Yes. This module has a strict 100% coverage policy. Travis-CI runs for every commit, which guarantees safety. It is also been in production internally for more than a year.

## License

MIT