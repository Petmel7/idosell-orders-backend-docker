const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const ordersRoute = require('./routes/orders.route');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan('combined'));
    app.use(rateLimit({ windowMs: 60000, max: 120 }));

    // Routes
    app.use('/orders', auth, ordersRoute);
    app.get('/', (req, res) => res.json({ ok: true }));

    // Error handler
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
