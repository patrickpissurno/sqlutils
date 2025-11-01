import { describe, test } from 'node:test';
import assert from 'node:assert';
import { transformer } from './transformer.js';

describe('transformer', () => {
  test('basic should work', () => {
    const rows = [
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 1,
        sale_item_name: 'A',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 2,
        sale_item_name: 'B',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 3,
        sale_item_name: 'C',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 4,
        sale_item_name: 'D',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 3,
        sale_price_paid: 7.5,
        sale_item_code: 5,
        sale_item_name: 'E',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 4,
        sale_price_paid: 15.5,
        sale_item_code: 6,
        sale_item_name: 'F',
      },
    ] as const;

    const found = transformer(rows, {
      key: 'id',
      columns: ['name'],
      children: [
        {
          key: ['sale_id', 'id'],
          columns: [['sale_price_paid', 'price_paid']],
          rename: 'sales',
          children: [
            {
              key: 'sale_item_code',
              columns: ['sale_item_name'],
              rename: 'items',
            },
          ],
        },
      ],
    } as const);

    const wanted = [
      {
        id: 1,
        name: 'A',
        sales: [
          {
            id: 1,
            price_paid: 10.5,
            items: [
              {
                sale_item_code: 1,
                sale_item_name: 'A',
              },
              {
                sale_item_code: 2,
                sale_item_name: 'B',
              },
            ],
          },
          {
            id: 2,
            price_paid: 5.5,
            items: [
              {
                sale_item_code: 3,
                sale_item_name: 'C',
              },
              {
                sale_item_code: 4,
                sale_item_name: 'D',
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'B',
        sales: [
          {
            id: 3,
            price_paid: 7.5,
            items: [
              {
                sale_item_code: 5,
                sale_item_name: 'E',
              },
            ],
          },
          {
            id: 4,
            price_paid: 15.5,
            items: [
              {
                sale_item_code: 6,
                sale_item_name: 'F',
              },
            ],
          },
        ],
      },
    ];

    assert.deepStrictEqual(found, wanted);
  });

  test('flat should work (1)', () => {
    const rows = [
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 1,
        sale_item_name: 'A',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 2,
        sale_item_name: 'B',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 3,
        sale_item_name: 'C',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 4,
        sale_item_name: 'D',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 3,
        sale_price_paid: 7.5,
        sale_item_code: 5,
        sale_item_name: 'E',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 4,
        sale_price_paid: 15.5,
        sale_item_code: 6,
        sale_item_name: 'F',
      },
    ] as const;

    const found = transformer(rows, {
      key: 'id',
      columns: ['name'],
      children: [
        {
          key: ['sale_id', 'id'],
          columns: [['sale_price_paid', 'price_paid']],
          rename: 'sales',
          children: [
            {
              key: ['sale_item_code', null],
              columns: ['sale_item_name'],
              rename: 'items',
              flat: true,
            },
          ],
        },
      ],
    } as const);

    const wanted = [
      {
        id: 1,
        name: 'A',
        sales: [
          {
            id: 1,
            price_paid: 10.5,
            items: ['A', 'B'],
          },
          {
            id: 2,
            price_paid: 5.5,
            items: ['C', 'D'],
          },
        ],
      },
      {
        id: 2,
        name: 'B',
        sales: [
          {
            id: 3,
            price_paid: 7.5,
            items: ['E'],
          },
          {
            id: 4,
            price_paid: 15.5,
            items: ['F'],
          },
        ],
      },
    ];

    assert.deepStrictEqual(found, wanted);
  });

  test('flat should work (2)', () => {
    const rows = [
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 1,
        sale_item_name: 'A',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 2,
        sale_item_name: 'B',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 3,
        sale_item_name: 'C',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 4,
        sale_item_name: 'D',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 3,
        sale_price_paid: 7.5,
        sale_item_code: 5,
        sale_item_name: 'E',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 4,
        sale_price_paid: 15.5,
        sale_item_code: 6,
        sale_item_name: 'F',
      },
    ] as const;

    const found = transformer(rows, {
      key: 'id',
      columns: ['name'],
      children: [
        {
          key: ['sale_id', 'id'],
          columns: [['sale_price_paid', 'price_paid']],
          rename: 'sales',
          children: [
            {
              key: 'sale_item_code',
              rename: 'items',
              flat: true,
            },
          ],
        },
      ],
    } as const);

    const wanted = [
      {
        id: 1,
        name: 'A',
        sales: [
          {
            id: 1,
            price_paid: 10.5,
            items: [1, 2],
          },
          {
            id: 2,
            price_paid: 5.5,
            items: [3, 4],
          },
        ],
      },
      {
        id: 2,
        name: 'B',
        sales: [
          {
            id: 3,
            price_paid: 7.5,
            items: [5],
          },
          {
            id: 4,
            price_paid: 15.5,
            items: [6],
          },
        ],
      },
    ];

    assert.deepStrictEqual(found, wanted);
  });

  test('flat should work (3)', () => {
    const rows = [
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 1,
        sale_item_name: 'A',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        sale_item_code: 2,
        sale_item_name: 'B',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 3,
        sale_item_name: 'C',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        sale_item_code: 4,
        sale_item_name: 'D',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 3,
        sale_price_paid: 7.5,
        sale_item_code: 5,
        sale_item_name: 'E',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 4,
        sale_price_paid: 15.5,
        sale_item_code: 6,
        sale_item_name: 'F',
      },
    ] as const;

    const found = transformer(rows, {
      key: 'id',
      columns: ['name'],
      children: [
        {
          key: ['sale_id', 'id'],
          columns: [['sale_price_paid', 'price_paid']],
          rename: 'sales',
          children: [
            {
              key: ['sale_item_code', null],
              rename: 'items',
              flat: true,
            },
          ],
        },
      ],
    } as const);

    const wanted = [
      {
        id: 1,
        name: 'A',
        sales: [
          {
            id: 1,
            price_paid: 10.5,
            items: [],
          },
          {
            id: 2,
            price_paid: 5.5,
            items: [],
          },
        ],
      },
      {
        id: 2,
        name: 'B',
        sales: [
          {
            id: 3,
            price_paid: 7.5,
            items: [],
          },
          {
            id: 4,
            price_paid: 15.5,
            items: [],
          },
        ],
      },
    ];

    assert.deepStrictEqual(found, wanted);
  });

  test('single should work', () => {
    const rows = [
      {
        id: 1,
        name: 'A',
        sale_id: 1,
        sale_price_paid: 10.5,
        address_street: 'A',
        address_city: 'B',
      },
      {
        id: 1,
        name: 'A',
        sale_id: 2,
        sale_price_paid: 5.5,
        address_street: 'A',
        address_city: 'B',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 3,
        sale_price_paid: 7.5,
        address_street: 'C',
        address_city: 'D',
      },
      {
        id: 2,
        name: 'B',
        sale_id: 4,
        sale_price_paid: 15.5,
        address_street: 'C',
        address_city: 'D',
      },
    ] as const;

    const found = transformer(rows, {
      key: 'id',
      columns: ['name'],
      children: [
        {
          key: ['sale_id', 'id'],
          columns: [['sale_price_paid', 'price_paid']],
          rename: 'sales',
        },
        {
          key: ['address_street', 'street'],
          columns: [['address_city', 'city']],
          rename: 'address',
          single: true,
        },
      ],
    } as const);

    const wanted = [
      {
        id: 1,
        name: 'A',
        sales: [
          {
            id: 1,
            price_paid: 10.5,
          },
          {
            id: 2,
            price_paid: 5.5,
          },
        ],
        address: {
          street: 'A',
          city: 'B',
        },
      },
      {
        id: 2,
        name: 'B',
        sales: [
          {
            id: 3,
            price_paid: 7.5,
          },
          {
            id: 4,
            price_paid: 15.5,
          },
        ],
        address: {
          street: 'C',
          city: 'D',
        },
      },
    ];

    assert.deepStrictEqual(found, wanted);
  });

  test('key aliasing to null should work', () => {
    const rows = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ] as const;

    const found = transformer(rows, {
      key: ['id', null],
      columns: ['name'],
    } as const);

    const wanted = [{ name: 'A' }, { name: 'B' }];

    assert.deepStrictEqual(found, wanted);
  });

  test('column aliasing to null should work', () => {
    const rows = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ] as const;

    const found = transformer(rows, {
      key: 'id',
      columns: [['name', null]],
    } as const);

    const wanted = [{ id: 1 }, { id: 2 }];

    assert.deepStrictEqual(found, wanted);
  });

  test('empty columns should work', () => {
    const rows = [{ id: 1 }, { id: 2 }] as const;

    const found = transformer(rows, {
      key: 'id',
    } as const);

    const wanted = [{ id: 1 }, { id: 2 }];

    assert.deepStrictEqual(found, wanted);
  });
});
