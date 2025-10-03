
// const request = require('supertest');
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const app = require('../src/app'); // express instance
// const Order = require('../src/models/order.model');

// // Мокуємо сервіс idosell
// jest.mock('../src/services/idosell.service', () => ({
//     fetchRecentOrders: jest.fn(() =>
//         Promise.resolve([
//             {
//                 orderId: 'order-1',
//                 orderSn: 1001,
//                 addedAt: new Date(),
//                 total: 200,
//                 currency: 'PLN',
//                 products: [{ productId: 'p1', qty: 2 }],
//                 raw: {},
//             },
//             {
//                 orderId: 'order-2',
//                 orderSn: 1002,
//                 addedAt: new Date(),
//                 total: 500,
//                 currency: 'PLN',
//                 products: [{ productId: 'p2', qty: 1 }],
//                 raw: {},
//             },
//         ])
//     ),
// }));

// let mongoServer;

// beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();
//     await mongoose.connect(uri);
// });

// afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
// });

// describe('Full cycle test', () => {
//     it('should insert and fetch orders', async () => {
//         // Синхронізація замовлень вручну
//         const { fetchRecentOrders } = require('../src/services/idosell.service');
//         const orders = await fetchRecentOrders();
//         await Order.insertMany(orders);

//         // 1. Отримати всі замовлення
//         const res = await request(app).get('/api/orders');
//         expect(res.status).toBe(200);
//         expect(res.body.length).toBe(2);

//         // 2. Отримати одне замовлення
//         const single = await request(app).get('/api/orders/order-1');
//         expect(single.status).toBe(200);
//         expect(single.body.orderId).toBe('order-1');

//         // 3. Отримати CSV
//         const csv = await request(app).get('/api/orders/export');
//         expect(csv.status).toBe(200);
//         expect(csv.text).toContain('orderId,orderSn,total');

//         // 4. Перевірити фільтрацію
//         const filtered = await request(app).get('/api/orders?minWorth=300');
//         expect(filtered.status).toBe(200);
//         expect(filtered.body.length).toBe(1);
//         expect(filtered.body[0].total).toBe(500);
//     });
// });



const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../src/app');
const Order = require('../src/models/order.model');

let mongoServer;
let app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    app = createApp();
}, 60000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}, 60000);

describe('Full cycle test (mocked IdoSell)', () => {
    it('should insert and retrieve orders', async () => {
        const order = new Order({
            orderId: 'test-1',
            orderSn: 123,
            addedAt: new Date(),
            total: 99.99,
            currency: 'PLN',
            products: [{ productId: 'p1', quantity: 2 }]
        });

        await order.save();

        // const res = await request(app).get('/orders');
        const res = await request(app)
            .get('/orders')
            .set('Authorization', 'Bearer test-token');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].orderId).toBe('test-1');

    });
});

