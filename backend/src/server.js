// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Stripe webhook (needs raw body, so it handles its own body parser) ---
const webhookRoute = require('./routes/webhook');
app.use('/webhook', webhookRoute);

// --- API Routes ---
const productRoute = require('./routes/product');
const checkoutRoute = require('./routes/checkout');
const adminRoute = require('./routes/admin');

app.use('/product', productRoute);
app.use('/create-checkout-session', checkoutRoute);
app.use('/admin', adminRoute);

// --- Serve Frontend ---
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Serve admin.html for /admin-panel route (optional)
app.get('/admin-panel', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

// Catch-all: redirect any unknown routes to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
