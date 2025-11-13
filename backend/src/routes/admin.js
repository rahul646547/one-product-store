const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Mark order as shipped
router.patch('/orders/:id/ship', async (req, res) => {
  const id = parseInt(req.params.id); // if your DB uses Int IDs

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: 'shipped' },
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Error updating order status:', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
