const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(product, quantity, successUrl, cancelUrl) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    billing_address_collection: 'required',

    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'IN', 'AU', 'DE']
    },

    line_items: [
      {
        price_data: {
          currency: 'inr',        // 💰 IMPORTANT!
          product_data: {
            name: product.title,
            images: [product.imageUrl]
          },
          unit_amount: product.price // 20000 (for ₹200)
        },
        quantity
      }
    ],

    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl
  });

  return session;
}

module.exports = { createCheckoutSession, stripe };
