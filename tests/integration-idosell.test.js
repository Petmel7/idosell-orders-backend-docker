
// const request = require('supertest');
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const app = require('../src/app'); // Express app
// const Order = require('../src/models/order.model');
// const { fetchRecentOrders } = require('../src/services/idosell.service');

// let mongoServer;

// beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();
//     await mongoose.connect(uri);
// }, 60000);

// afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
// }, 60000);

// describe('Integration with IdoSell API', () => {
//     it(
//         'should fetch real orders from IdoSell and expose them via API',
//         async () => {
//             // 1. Синхронізуємо замовлення з реального API
//             const orders = await fetchRecentOrders({ limit: 5 });
//             expect(orders.length).toBeGreaterThan(0);

//             // 2. Заносимо у Mongo
//             await Order.insertMany(orders);

//             // 3. Через API перевіряємо що дані доступні
//             const res = await request(app).get('/api/orders');
//             expect(res.status).toBe(200);
//             expect(res.body.length).toBeGreaterThan(0);

//             // 4. Тест конкретного замовлення
//             const one = await request(app).get(`/api/orders/${orders[0].orderId}`);
//             expect(one.status).toBe(200);
//             expect(one.body.orderId).toBe(orders[0].orderId);
//         },
//         120000 // таймаут 2 хв бо API може відповідати довго
//     );
// });



const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../src/app');
const Order = require('../src/models/order.model');
const { fetchRecentOrders } = require('../src/services/idosell.service');

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

describe('Integration with IdoSell API', () => {
    it(
        'should fetch real orders from IdoSell and expose them via API',
        async () => {
            const orders = await fetchRecentOrders({ limit: 5 });
            expect(orders.length).toBeGreaterThan(0);

            await Order.insertMany(orders);

            const res = await request(app).get('/orders');
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);

            const one = await request(app).get(`/orders/${orders[0].orderId}`);
            expect(one.status).toBe(200);
            expect(one.body.orderId).toBe(orders[0].orderId);
        },
        120000
    );
});
