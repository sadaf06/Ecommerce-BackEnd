const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { addToCart, getcart, removeCart, orderSave, orderFetch } = require("../Auth/cart");
const { signInRequired } = require("../Auth/middleWare");

router.post("/cart/addTocart", signInRequired, addToCart);
router.get("/cart/getCart", signInRequired, getcart);
router.post("/cart/remCart", signInRequired, removeCart);
router.post("/order/confirm", signInRequired, orderSave);
router.get("/order/fetch", signInRequired, orderFetch);

module.exports = router;
