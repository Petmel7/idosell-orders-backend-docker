const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  orderSn: { type: Number },
  addedAt: { type: Date },
  total: { type: Number },
  currency: { type: String },
  products: { type: [ProductSchema], default: [] },
  status: { type: String, default: null },
  raw: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);