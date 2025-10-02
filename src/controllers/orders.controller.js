const Order = require('../models/order.model');
const { toCsv } = require('../utils/csv');

async function listOrders(req, res, next) {
  try {
    const { minWorth, maxWorth, format } = req.query;
    const q = {};
    if (minWorth != null || maxWorth != null) {
      q.total = {};
      if (minWorth != null) q.total.$gte = Number(minWorth);
      if (maxWorth != null) q.total.$lte = Number(maxWorth);
    }
    const orders = await Order.find(q).sort({ addedAt: -1 }).lean();
    if (format === 'csv') {
      const csv = toCsv(orders);
      res.header('Content-Type', 'text/csv');
      res.attachment('orders.csv');
      return res.send(csv);
    }
    res.json({ total: orders.length, data: orders });
  } catch (err) { next(err); }
}

async function getOrder(req, res, next) {
  try {
    const id = req.params.id;
    const order = await Order.findOne({ orderId: id }).lean();
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) { next(err); }
}

module.exports = { listOrders, getOrder };