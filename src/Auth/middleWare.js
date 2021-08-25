const jwt = require("jsonwebtoken");
const env = require("dotenv");
const { check, validationResult } = require("express-validator");

exports.signInRequired = (req, res, next) => {
  const token = req.headers.auth;
  jwt.verify(token, process.env.JWTSECRET, (err, decode) => {
    if (err) {
      res.status(401).json({ message: "Please Login First to View this Page" });
    } else {
      req.user = decode;
      next();
    }
  });
};

exports.checkSignUp = [
  check("firstName").notEmpty().withMessage("First name cannot be empty"),
  check("lastName").notEmpty().withMessage("LAst name required"),
  check("email").isEmail().withMessage("email must be valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 character long"),
  check("contact").isMobilePhone().withMessage("valid mobile number required"),
];
exports.checkSignIn = [
  check("email").isEmail().withMessage("email must be valid"),
  check("password").isLength({ min: 6 }).withMessage("enter Valid Password"),
];
exports.validatCheck = (req, res, next) => {
  const error = validationResult(req);
  // console.log(error.array()[0]);
  if (error.array().length > 0) {
    res.status(500).json({ message: error.array()[0].msg });
  } else {
    next();
  }
};
exports.isItAdmin = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(400).json({ message: "you are not admin" });
  }
};
