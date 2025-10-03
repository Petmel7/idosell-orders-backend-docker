const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  apiToken: process.env.API_TOKEN,
  idosell: {
    key: process.env.IDOSELL_API_KEY,
    base: process.env.IDOSELL_API_BASE,
    shopDomain: process.env.SHOP_DOMAIN,
    headerName: process.env.IDOSELL_API_HEADER_NAME,
    idosellPageLimit: process.env.IDOSELL_PAGE_LIMIT,
    fetchLimit: Number(process.env.IDOSELL_FETCH_LIMIT || 5000)
  },
  pollMinutes: Number(process.env.POLL_MINUTES || 5)
};