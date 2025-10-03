// const axios = require('axios');
// const config = require('../config');

// // async function callIdoSell(path, method = 'GET', data = {}, params = {}) {
// //   const url = `${config.idosell.base}${path}`;
// //   const headers = {};
// //   if (config.idosell.key) headers[config.idosell.headerName] = config.idosell.key;
// //   const opts = { url, method, headers, params, data, timeout: 30000 };
// //   const res = await axios(opts);
// //   return res.data;
// // }

// const callIdoSell = async (path, params = {}) => {
//   const res = await axios.post(`${config.idosell.base}${path}`, params, {
//     headers: {
//       [config.idosell.headerName]: config.idosell.key,
//     },
//   });
//   return res.data;
// };

// function parseOrder(raw) {
//   const orderId = raw.orderId;
//   const orderSn = raw.orderSerialNumber || null;
//   const addedAt = raw.orderAddedAt ? new Date(raw.orderAddedAt) : null;
//   let total = raw.clientResult?.total || raw.total || raw.orderValue || null;
//   if (total) total = Number(total);
//   const products = [];
//   const details = raw.orderDetails || [];
//   if (Array.isArray(details)) {
//     details.forEach(d => {
//       const productId = d.productId || d.productIdInShop || d.sku;
//       const quantity = Number(d.quantity || 1);
//       if (productId) products.push({ productId: String(productId), quantity });
//     });
//   }
//   const currency = raw.currency || raw.clientResult?.currency || 'PLN';
//   const status = raw.status || null;
//   return { orderId, orderSn, addedAt, total, currency, products, status, raw };
// }

// async function fetchRecentOrders({ minutes = null, limit = config.idosell.fetchLimit } = {}) {
//   const payload = {};
//   if (minutes != null) payload.ordersRange = { ordersDateRange: minutes };
//   payload.limit = limit;
//   const data = await callIdoSell('/orders/orders/get', 'POST', payload);
//   const list = data.orders || data.data || [];
//   if (!Array.isArray(list)) return [];
//   return list.map(parseOrder);
// }

// async function fetchAllOrders() {
//   return fetchRecentOrders({ minutes: null, limit: config.idosell.fetchLimit });
// }

// module.exports = { fetchRecentOrders, fetchAllOrders, parseOrder };




const axios = require('axios');
const config = require('../config');

const SHOP_DOMAIN = config.idosell.shopDomain;
const API_KEY = config.idosell.key;
const DEFAULT_LIMIT = config.idosell.idosellPageLimit || 100;

const client = axios.create({
  baseURL: `https://${SHOP_DOMAIN}/api/admin/v7`,
  timeout: 20000,
  headers: {
    'X-API-KEY': API_KEY,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Get one page of orders from IdoSell API
 */
async function getOrdersPage(limit = DEFAULT_LIMIT, offset = 0) {
  const res = await client.get('/orders/orders', {
    params: { limit, offset },
  });
  if (res.data?.Results) {
    return res.data.Results;
  }
  return [];
}

/**
 * Normalize order object into schema used in DB
 */
function normalizeOrder(order) {
  return {
    orderId: order.orderId,
    orderSn: order.orderSerialNumber || null,
    addedAt: order.orderDetails?.orderChangeDate
      ? new Date(order.orderDetails.orderChangeDate.replace(' ', 'T') + 'Z')
      : null,
    total: order.orderDetails?.orderWorth || null,
    currency:
      order.orderDetails?.payments?.orderCurrency?.currencyIso ||
      order.orderDetails?.payments?.orderCurrency?.currencySymbol ||
      'PLN',
    products: (order.orderDetails?.products || []).map((p) => ({
      productId: p.productId || p.id,
      qty: p.quantity || p.qty || 0,
    })),
    raw: order,
  };
}

/**
 * Fetch orders in batch (all pages up to maxPages) or only recent orders by cutoff
 */
async function fetchRecentOrders({ minutes = null, limit = DEFAULT_LIMIT, maxPages = 50 } = {}) {
  const results = [];
  let offset = 0;
  let page = 0;

  while (page < maxPages) {
    const arr = await getOrdersPage(limit, offset);
    if (!arr.length) break;
    results.push(...arr);
    if (arr.length < limit) break;
    offset += limit;
    page++;
  }

  const normalized = results.map(normalizeOrder);
  if (minutes) {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return normalized.filter((o) => o.addedAt && o.addedAt.getTime() >= cutoff);
  }
  return normalized;
}

module.exports = {
  fetchRecentOrders,
  getOrdersPage,
  normalizeOrder,
};
