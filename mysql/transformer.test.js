const tap = require('tap');
const transformer = require('./transformer');

{
    const rows = [
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 1, sale_item_name: 'A' },
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 2, sale_item_name: 'B' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 3, sale_item_name: 'C' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 4, sale_item_name: 'D' },
        { id: 2, name: 'B', sale_id: 3, sale_price_paid: 7.5, sale_item_code: 5, sale_item_name: 'E' },
        { id: 2, name: 'B', sale_id: 4, sale_price_paid: 15.5, sale_item_code: 6, sale_item_name: 'F' },
    ];

    const found = transformer(rows, {
        key: 'id',
        columns: ['name'],
        children: [{
            key: ['sale_id', 'id'],
            columns: [
                ['sale_price_paid', 'price_paid'],
            ],
            rename: 'sales',
            children: [{
                key: 'sale_item_code',
                columns: ['sale_item_name'],
                rename: 'items',
            }]
        }]
    });

    const wanted = [
        {
            "id": 1,
            "name": "A",
            "sales": [
                {
                    "id": 1,
                    "price_paid": 10.5,
                    "items": [
                        {
                            "sale_item_code": 1,
                            "sale_item_name": "A"
                        },
                        {
                            "sale_item_code": 2,
                            "sale_item_name": "B"
                        }
                    ]
                },
                {
                    "id": 2,
                    "price_paid": 5.5,
                    "items": [
                        {
                            "sale_item_code": 3,
                            "sale_item_name": "C"
                        },
                        {
                            "sale_item_code": 4,
                            "sale_item_name": "D"
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "name": "B",
            "sales": [
                {
                    "id": 3,
                    "price_paid": 7.5,
                    "items": [
                        {
                            "sale_item_code": 5,
                            "sale_item_name": "E"
                        }
                    ]
                },
                {
                    "id": 4,
                    "price_paid": 15.5,
                    "items": [
                        {
                            "sale_item_code": 6,
                            "sale_item_name": "F"
                        }
                    ]
                }
            ]
        }
    ];

    tap.same(found, wanted, 'basic should work');
}

{
    const rows = [
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 1, sale_item_name: 'A' },
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 2, sale_item_name: 'B' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 3, sale_item_name: 'C' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 4, sale_item_name: 'D' },
        { id: 2, name: 'B', sale_id: 3, sale_price_paid: 7.5, sale_item_code: 5, sale_item_name: 'E' },
        { id: 2, name: 'B', sale_id: 4, sale_price_paid: 15.5, sale_item_code: 6, sale_item_name: 'F' },
    ];

    const found = transformer(rows, {
        key: 'id',
        columns: ['name'],
        children: [{
            key: ['sale_id', 'id'],
            columns: [
                ['sale_price_paid', 'price_paid'],
            ],
            rename: 'sales',
            children: [{
                key: ['sale_item_code', null],
                columns: ['sale_item_name'],
                rename: 'items',
                flat: true
            }]
        }]
    });

    const wanted = [
        {
            "id": 1,
            "name": "A",
            "sales": [
                {
                    "id": 1,
                    "price_paid": 10.5,
                    "items": [ "A", "B" ]
                },
                {
                    "id": 2,
                    "price_paid": 5.5,
                    "items": [ "C", "D" ]
                }
            ]
        },
        {
            "id": 2,
            "name": "B",
            "sales": [
                {
                    "id": 3,
                    "price_paid": 7.5,
                    "items": [ "E" ]
                },
                {
                    "id": 4,
                    "price_paid": 15.5,
                    "items": [ "F" ]
                }
            ]
        }
    ];

    tap.same(found, wanted, 'flat should work (1)');
}

{
    const rows = [
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 1, sale_item_name: 'A' },
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 2, sale_item_name: 'B' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 3, sale_item_name: 'C' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 4, sale_item_name: 'D' },
        { id: 2, name: 'B', sale_id: 3, sale_price_paid: 7.5, sale_item_code: 5, sale_item_name: 'E' },
        { id: 2, name: 'B', sale_id: 4, sale_price_paid: 15.5, sale_item_code: 6, sale_item_name: 'F' },
    ];

    const found = transformer(rows, {
        key: 'id',
        columns: ['name'],
        children: [{
            key: ['sale_id', 'id'],
            columns: [
                ['sale_price_paid', 'price_paid'],
            ],
            rename: 'sales',
            children: [{
                key: 'sale_item_code',
                rename: 'items',
                flat: true
            }]
        }]
    });

    const wanted = [
        {
            "id": 1,
            "name": "A",
            "sales": [
                {
                    "id": 1,
                    "price_paid": 10.5,
                    "items": [ 1, 2 ]
                },
                {
                    "id": 2,
                    "price_paid": 5.5,
                    "items": [ 3, 4 ]
                }
            ]
        },
        {
            "id": 2,
            "name": "B",
            "sales": [
                {
                    "id": 3,
                    "price_paid": 7.5,
                    "items": [ 5 ]
                },
                {
                    "id": 4,
                    "price_paid": 15.5,
                    "items": [ 6 ]
                }
            ]
        }
    ];

    tap.same(found, wanted, 'flat should work (2)');
}

{
    const rows = [
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 1, sale_item_name: 'A' },
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, sale_item_code: 2, sale_item_name: 'B' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 3, sale_item_name: 'C' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, sale_item_code: 4, sale_item_name: 'D' },
        { id: 2, name: 'B', sale_id: 3, sale_price_paid: 7.5, sale_item_code: 5, sale_item_name: 'E' },
        { id: 2, name: 'B', sale_id: 4, sale_price_paid: 15.5, sale_item_code: 6, sale_item_name: 'F' },
    ];

    const found = transformer(rows, {
        key: 'id',
        columns: ['name'],
        children: [{
            key: ['sale_id', 'id'],
            columns: [
                ['sale_price_paid', 'price_paid'],
            ],
            rename: 'sales',
            children: [{
                key: ['sale_item_code', null],
                rename: 'items',
                flat: true
            }]
        }]
    });

    const wanted = [
        {
            "id": 1,
            "name": "A",
            "sales": [
                {
                    "id": 1,
                    "price_paid": 10.5,
                    "items": [ ]
                },
                {
                    "id": 2,
                    "price_paid": 5.5,
                    "items": [ ]
                }
            ]
        },
        {
            "id": 2,
            "name": "B",
            "sales": [
                {
                    "id": 3,
                    "price_paid": 7.5,
                    "items": [ ]
                },
                {
                    "id": 4,
                    "price_paid": 15.5,
                    "items": [ ]
                }
            ]
        }
    ];

    tap.same(found, wanted, 'flat should work (3)');
}

{
    const rows = [
        { id: 1, name: 'A', sale_id: 1, sale_price_paid: 10.5, address_street: 'A', address_city: 'B' },
        { id: 1, name: 'A', sale_id: 2, sale_price_paid: 5.5, address_street: 'A', address_city: 'B' },
        { id: 2, name: 'B', sale_id: 3, sale_price_paid: 7.5, address_street: 'C', address_city: 'D' },
        { id: 2, name: 'B', sale_id: 4, sale_price_paid: 15.5, address_street: 'C', address_city: 'D' },
    ];

    const found = transformer(rows, {
        key: 'id',
        columns: ['name'],
        children: [
            {
                key: ['sale_id', 'id'],
                columns: [
                    ['sale_price_paid', 'price_paid'],
                ],
                rename: 'sales'
            },
            {
                key: ['address_street', 'street'],
                columns: [ ['address_city', 'city'] ],
                rename: 'address',
                single: true,
            }
        ]
    });

    const wanted = [
        {
            "id": 1,
            "name": "A",
            "sales": [
                {
                    "id": 1,
                    "price_paid": 10.5
                },
                {
                    "id": 2,
                    "price_paid": 5.5
                }
            ],
            "address": {
                "street": "A",
                "city": "B"
            }
        },
        {
            "id": 2,
            "name": "B",
            "sales": [
                {
                    "id": 3,
                    "price_paid": 7.5
                },
                {
                    "id": 4,
                    "price_paid": 15.5
                }
            ],
            "address": {
                "street": "C",
                "city": "D"
            }
        }
    ];

    tap.same(found, wanted, 'single should work');
}

{
    const rows = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
    ];

    const found = transformer(rows, {
        key: ['id', null],
        columns: ['name'],
    });

    const wanted = [
        { "name": "A" },
        { "name": "B" }
    ];

    tap.same(found, wanted, 'key aliasing to null should work');
}

{
    const rows = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
    ];

    const found = transformer(rows, {
        key: 'id',
        columns: [ ['name', null] ],
    });

    const wanted = [
        { "id": "1" },
        { "id": "2" }
    ];

    tap.same(found, wanted, 'column aliasing to null should work');
}

{
    const rows = [
        { id: 1 },
        { id: 2 },
    ];

    const found = transformer(rows, {
        key: 'id'
    });

    const wanted = [
        { "id": "1" },
        { "id": "2" }
    ];

    tap.same(found, wanted, 'empty columns should work');
}