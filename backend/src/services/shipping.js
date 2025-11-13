// NOTE: install official EasyPost client per docs. Example below uses axios for clarity.
const axios = require('axios');

const EASYPOST_KEY = process.env.EASYPOST_API_KEY;
const base = 'https://api.easypost.com/v2';

async function createShipmentAndBuyLabel(from, to, parcel, carrier = null, service = null){
  // 1) Create shipment object via EasyPost
  const shipmentPayload = { shipment: { from_address: from, to_address: to, parcel } };
  // Optionally rate shop first
  const createResp = await axios.post(`${base}/shipments`, shipmentPayload, { auth: { username: EASYPOST_KEY, password: '' }});
  const shipment = createResp.data;
  // Choose rate - simple choose first rate or match carrier/service
  const rate = shipment.rates && shipment.rates[0];
  if(!rate) throw new Error('No shipping rates found');
  // 2) Buy label
  const buyResp = await axios.post(`${base}/shipments/${shipment.id}/buy`, { rate: { id: rate.id } }, { auth: { username: EASYPOST_KEY, password: '' }});
  const bought = buyResp.data;
  return {
    tracking: bought.tracking_code,
    labelUrl: bought.postage_label?.label_url,
    carrier: rate.carrier
  };
}

module.exports = { createShipmentAndBuyLabel };
