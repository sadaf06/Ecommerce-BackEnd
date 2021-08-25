const express = require("express");
const { signInRequired, isItAdmin } = require("../Auth/middleWare");
const router = express.Router();
const multer = require("multer");
const { addProduct } = require("../Auth/product");
const path = require("path");
const shortId = require("shortid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, shortId.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post(
  "/product/Add",
  signInRequired,
  isItAdmin,
  upload.array("productImage"),
  addProduct
);
module.exports = router;
