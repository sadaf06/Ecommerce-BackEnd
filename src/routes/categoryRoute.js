const express = require("express");
const { categoryAdd, fetchCat, categoryUpdate, deleteCat } = require("../Auth/Category");
const { signInRequired, isItAdmin } = require("../Auth/middleWare");
const router = express.Router();
const multer = require("multer");
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
router.post("/category/Add", signInRequired, isItAdmin, upload.array("categoryImage"), categoryAdd);
router.post("/category/update", signInRequired, isItAdmin, upload.array("categoryImage"), categoryUpdate);
router.get("/category", fetchCat);
router.post("/category/delete", signInRequired, isItAdmin, deleteCat);


module.exports = router;
