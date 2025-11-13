const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/', async (req, res) => {
  const product = await prisma.product.findFirst();
  if(!product) return res.status(404).json({ error: 'No product found' });
  res.json(product);
});

module.exports = router;
