const express = require('express');
const { fetchProduct, productListForclone, productMatch } = require('../Auth/product');
const router = express.Router();
router.get('/fetchProduct', fetchProduct);
router.get('/:slug', productListForclone);
router.get('/product/:productId', productMatch)
module.exports = router;