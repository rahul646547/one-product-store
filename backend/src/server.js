// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Stripe webhook must receive raw body; route handles its own bodyParser
const webhookRoute = require('./routes/webhook');
app.use('/webhook', webhookRoute);

// JSON parser for other routes
app.use(express.json());
app.use(cors()); // allow cross-origin requests

// App routes
const productRoute = require('./routes/product');
const checkoutRoute = require('./routes/checkout');
const adminRoute = require('./routes/admin');

app.use('/product', productRoute);
app.use('/create-checkout-session', checkoutRoute);
app.use('/admin', adminRoute);

// Serve static frontend files (index.html, admin.html)
app.use(express.static('frontend'));

// Start
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
