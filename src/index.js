// const express = require('express');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const cors = require('cors');
// const morgan = require('morgan');
// const config = require('./config');
// const { connect } = require('./db');
// const ordersRoute = require('./routes/orders.route');
// const auth = require('./middleware/auth');
// const errorHandler = require('./middleware/errorHandler');
// const { startPoller } = require('./services/poller.service');

// async function main() {
//   await connect();
//   console.log('Connected to MongoDB');

//   const app = express();
//   app.use(helmet());
//   app.use(cors());
//   app.use(express.json());
//   app.use(morgan('combined'));
//   app.use(rateLimit({ windowMs: 60000, max: 120 }));

//   app.use('/orders', auth, ordersRoute);
//   app.get('/', (req, res) => res.json({ ok: true }));
//   app.use(errorHandler);

//   app.listen(config.port, () => console.log(`Server listening on ${config.port}`));
//   startPoller();
// }

// main().catch(err => {
//   console.error('Failed to start app', err);
//   process.exit(1);
// });


const config = require('./config');
const { connect } = require('./db');
const createApp = require('./app');
const { startPoller } = require('./services/poller.service');

async function main() {
  await connect();
  console.log('Connected to MongoDB');

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`Server listening on ${config.port}`);
  });

  // запуск воркера
  startPoller();
}

main().catch(err => {
  console.error('Failed to start app', err);
  process.exit(1);
});
