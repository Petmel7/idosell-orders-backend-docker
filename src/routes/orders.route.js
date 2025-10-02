const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orders.controller');

router.get('/', ctrl.listOrders);
router.get('/:id', ctrl.getOrder);

module.exports = router;