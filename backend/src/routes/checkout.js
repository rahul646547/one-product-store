const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { createCheckoutSession } = require('../services/stripe');

router.post('/', async (req, res) => {
  try {
    const { productId, quantity, successUrl, cancelUrl } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.inventory < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    // ✔ Force the product price to ₹200
    const FIXED_PRICE = 200 * 100; // amount in paisa for Stripe

    // ✔ Inject updated price before sending to Stripe service
    const updatedProduct = {
      ...product,
      price: FIXED_PRICE
    };

    const session = await createCheckoutSession(updatedProduct, quantity, successUrl, cancelUrl);

    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        amountTotal: FIXED_PRICE * quantity, // ✔ Save correct total
        currency: 'inr', // ✔ Correct currency
        items: JSON.stringify([{ productId, title: product.title, quantity }]),
        status: 'pending',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Checkout session error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
