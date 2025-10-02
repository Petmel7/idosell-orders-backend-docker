const mongoose = require('mongoose');
const config = require('./config');

async function connect() {
  if (!config.mongoUri) throw new Error('MONGO_URI not set');
  return mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = { connect };