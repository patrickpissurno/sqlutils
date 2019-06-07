const tap = require('tap');
const groupColumnsToObjects = require('./groupColumnsToObjects');

test1();
test2();
test3();
test4();
test5();

function test1(){
    const rows = [
        { id: 1, name: 'Test', sale_id: 2, sale_price: 5 },
        { id: 1, name: 'Test', sale_id: 3, sale_price: 10 },
        { id: 2, name: 'Test 2', sale_id: 4, sale_price: 6 },
    ];
    
    const found = groupColumnsToObjects(rows, 'id', [
        {
            foreign_key: 'sale_id', out: 'sales', columns: [
                { name: 'sale_id', out: 'id' },
                { name: 'sale_price', out: 'price' }
            ]
        }
    ]);

    const expected = [
        {
            "id": 1,
            "name": "Test",
            "sales": [
                {
                    "id": 2,
                    "price": 5
                },
                {
                    "id": 3,
                    "price": 10
                }
            ]
        },
        {
            "id": 2,
            "name": "Test 2",
            "sales": [
                {
                    "id": 4,
                    "price": 6
                }
            ]
        }
    ];
        

    tap.same(found, expected, 'should match');
}

function test2(){
    const rows = [
        { ssn: 'abcd', name: 'John Doe', email: 'john@example.com' },
        { ssn: 'abcd', name: 'John Doe', email: 'john@acme.com' },
        { ssn: 'defg', name: 'Jimmy', email: 'jimmy@example.com' },
    ];

    const found = groupColumnsToObjects(rows, 'ssn', [
        { foreign_key: 'email', out: 'emails' }
    ]);

    const expected = [
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
    ];

    tap.same(found, expected, 'should be the same');
}

function test3(){
    const rows = [
        { ssn: 'abcd', name: 'John Doe', ean: '0000000000000', price: 7, sku: 'item 1' },
        { ssn: 'abcd', name: 'John Doe', ean: '1111111111111', price: 13, sku: 'item 2' },
        { ssn: 'defg', name: 'Jimmy', ean: '2222222222222', price: 9, sku: 'item 3' },
    ];

    const found = groupColumnsToObjects(rows, 'ssn', [
        { foreign_key: 'ean', out: 'cart', columns: [ 'ean', 'price', 'sku' ] }
    ]);

    const expected = [
        {
            "ssn": "abcd",
            "name": "John Doe",
            "cart": [
                {
                    "ean": "0000000000000",
                    "price": 7,
                    "sku": "item 1"
                },
                {
                    "ean": "1111111111111",
                    "price": 13,
                    "sku": "item 2"
                }
            ]
        },
        {
            "ssn": "defg",
            "name": "Jimmy",
            "cart": [
                {
                    "ean": "2222222222222",
                    "price": 9,
                    "sku": "item 3"
                }
            ]
        }
    ];

    tap.same(found, expected, 'should match');
}

function test4(){
    const rows = [
        { ssn: 'abcd', name: 'John Doe', email: 'john@example.com', ean: '0000000000000', price: 7 },
        { ssn: 'abcd', name: 'John Doe', email: 'john@acme.com', ean: '0000000000000', price: 7 },
        { ssn: 'abcd', name: 'John Doe', email: 'john@example.com', ean: '1111111111111', price: 13 },
        { ssn: 'abcd', name: 'John Doe', email: 'john@acme.com', ean: '1111111111111', price: 13 },
        { ssn: 'defg', name: 'Jimmy', email: 'jimmy@example.com', ean: '2222222222222', price: 9 },
    ];

    const found = groupColumnsToObjects(rows, 'ssn', [
        { foreign_key: 'ean', out: 'cart', columns: [ 'ean', 'price' ] },
        { foreign_key: 'email', out: 'emails' },
    ]);

    const expected = [
        {
            "ssn": "abcd",
            "name": "John Doe",
            "cart": [
                {
                    "ean": "0000000000000",
                    "price": 7
                },
                {
                    "ean": "1111111111111",
                    "price": 13
                }
            ],
            "emails": [
                "john@example.com",
                "john@acme.com"
            ]
        },
        {
            "ssn": "defg",
            "name": "Jimmy",
            "cart": [
                {
                    "ean": "2222222222222",
                    "price": 9
                }
            ],
            "emails": [
                "jimmy@example.com"
            ]
        }
    ];

    tap.same(found, expected, 'should be the same');        
}

function test5(){
    const rows = [
        { id: 1, name: 'John Doe', message_id: 1, message_subject: 'Hello', message_body: 'Welcome!' },
        { id: 1, name: 'John Doe', message_id: 2, message_subject: 'Hello 2', message_body: null },
        { id: 2, name: 'Jimmy', message_id: 3, message_subject: 'Hello Jimmey', message_body: 'Hurray!' },
        { id: 3, name: 'Timmy', message_id: null, message_subject: null, message_body: null },
    ];

    const found = groupColumnsToObjects(rows, 'id', [
        {
            foreign_key: 'message_id', out: 'messages', columns: [
                { name: 'message_id', out: 'id' },
                { name: 'message_subject', out: 'subject' },
                { name: 'message_body', out: 'body' }
            ]
        }
    ]);

    const expected = [
        {
            "id": 1,
            "name": "John Doe",
            "messages": [
                {
                    "id": 1,
                    "subject": "Hello",
                    "body": "Welcome!"
                },
                {
                    "id": 2,
                    "subject": "Hello 2",
                    "body": null
                }
            ]
        },
        {
            "id": 2,
            "name": "Jimmy",
            "messages": [
                {
                    "id": 3,
                    "subject": "Hello Jimmey",
                    "body": "Hurray!"
                }
            ]
        },
        {
            "id": 3,
            "name": "Timmy",
            "messages": []
        }
    ];

    tap.same(found, expected, 'should be the same');
}