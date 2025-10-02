const { stringify } = require('csv-stringify/sync');

function toCsv(orders) {
  const header = ['orderId', 'orderSn', 'addedAt', 'total', 'currency', 'products'];
  const rows = orders.map(o => ([
    o.orderId,
    o.orderSn ?? '',
    o.addedAt ? new Date(o.addedAt).toISOString() : '',
    o.total ?? '',
    o.currency ?? '',
    (o.products || []).map(p => `${p.productId}x${p.quantity}`).join('|')
  ]));
  return stringify([header, ...rows]);
}

module.exports = { toCsv };