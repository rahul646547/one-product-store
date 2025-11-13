const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { stripe } = require('../services/stripe');
const bodyParser = require('body-parser');

router.post("/", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const sessionFull = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer_details"],
      });

      const order = await prisma.order.update({
        where: { stripeSessionId: session.id },
        data: {
          status: "paid",
          customerEmail: session.customer_details?.email || session.customer_email || "",
          items: JSON.stringify(
            sessionFull.line_items?.data.map(item => ({
              productId: item.price.product,
              title: item.description,
              quantity: item.quantity
            })) || []
          ),
        },
      });

      console.log("✅ Order updated with email and items:", order.id);

    } catch (err) {
      console.error("❌ Error handling checkout session:", err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
