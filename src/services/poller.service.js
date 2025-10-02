const Order = require('../models/order.model');
const idosell = require('./idosell.service');
const config = require('../config');

const FINAL_STATUSES = new Set(['finished', 'lost', 'false']);

async function upsertOrder(parsed) {
  if (!parsed || !parsed.orderId) return null;
  const existing = await Order.findOne({ orderId: parsed.orderId });
  if (existing) {
    if (existing.status && FINAL_STATUSES.has(String(existing.status))) return existing;
    Object.assign(existing, parsed);
    await existing.save();
    return existing;
  } else {
    return Order.create(parsed);
  }
}

async function initialSync() {
  const orders = await idosell.fetchAllOrders();
  for (const o of orders) await upsertOrder(o);
}

async function pollOnce() {
  const orders = await idosell.fetchRecentOrders({ minutes: config.pollMinutes });
  let count = 0;
  for (const o of orders) { if (await upsertOrder(o)) count++; }
  return count;
}

function startPoller() {
  initialSync().catch(console.error);
  const intervalMs = Math.max(1, config.pollMinutes) * 60000;
  setInterval(async () => {
    const updated = await pollOnce();
    console.log(`Poll completed — upserted ${updated} orders`);
  }, intervalMs);
}

module.exports = { startPoller, pollOnce };