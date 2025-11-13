const axios = require("axios");

/**
 * Send order info to a supplier's API for fulfillment
 */
async function sendOrderToSupplier(order, product, shippingAddress) {
  console.log("🛰️ Sending order to supplier...");

  const supplierEndpoint = process.env.SUPPLIER_API_URL || "https://jsonplaceholder.typicode.com/posts";

  const payload = {
    order_id: order.id,
    product_sku: product.id,
    quantity: JSON.parse(order.items)[0]?.quantity || 1,
    customer_name: shippingAddress.name,
    customer_address: shippingAddress,
  };

  const response = await axios.post(supplierEndpoint, payload);
  console.log("✅ Supplier acknowledged order:", response.status);

  // Simulate tracking info (real supplier will return this)
  const trackingNumber = "DS-" + Math.floor(Math.random() * 10000000);
  const trackingUrl = `https://supplier.example.com/track/${trackingNumber}`;

  return {
    trackingNumber,
    trackingUrl,
    carrier: "SupplierCarrier",
  };
}

module.exports = { sendOrderToSupplier };
