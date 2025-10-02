const axios = require('axios');
const config = require('../config');

async function callIdoSell(path, method = 'GET', data = {}, params = {}) {
  const url = `${config.idosell.base}${path}`;
  const headers = {};
  if (config.idosell.key) headers[config.idosell.headerName] = config.idosell.key;
  const opts = { url, method, headers, params, data, timeout: 30000 };
  const res = await axios(opts);
  return res.data;
}

function parseOrder(raw) {
  const orderId = raw.orderId;
  const orderSn = raw.orderSerialNumber || null;
  const addedAt = raw.orderAddedAt ? new Date(raw.orderAddedAt) : null;
  let total = raw.clientResult?.total || raw.total || raw.orderValue || null;
  if (total) total = Number(total);
  const products = [];
  const details = raw.orderDetails || [];
  if (Array.isArray(details)) {
    details.forEach(d => {
      const productId = d.productId || d.productIdInShop || d.sku;
      const quantity = Number(d.quantity || 1);
      if (productId) products.push({ productId: String(productId), quantity });
    });
  }
  const currency = raw.currency || raw.clientResult?.currency || 'PLN';
  const status = raw.status || null;
  return { orderId, orderSn, addedAt, total, currency, products, status, raw };
}

async function fetchRecentOrders({ minutes = null, limit = config.idosell.fetchLimit } = {}) {
  const payload = {};
  if (minutes != null) payload.ordersRange = { ordersDateRange: minutes };
  payload.limit = limit;
  const data = await callIdoSell('/orders/orders/get', 'POST', payload);
  const list = data.orders || data.data || [];
  if (!Array.isArray(list)) return [];
  return list.map(parseOrder);
}

async function fetchAllOrders() {
  return fetchRecentOrders({ minutes: null, limit: config.idosell.fetchLimit });
}

module.exports = { fetchRecentOrders, fetchAllOrders, parseOrder };