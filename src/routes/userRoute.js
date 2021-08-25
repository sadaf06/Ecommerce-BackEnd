const express = require("express");
const routes = express.Router();
const {
  signInRequired,
  validatCheck,
  checkSignUp,
  checkSignIn,
} = require("../Auth/middleWare");
const { signIn, signUp, profile, AddAddress, getAddress } = require("../Auth/Auth");
// --------******************----------------
routes.post("/signup", checkSignUp, validatCheck, signUp);
routes.post("/signin", checkSignIn, validatCheck, signIn);
routes.post("/profile", signInRequired, profile);
routes.post("/AddUserAddress", signInRequired, AddAddress);
routes.get("/getUserAddress", signInRequired, getAddress);

module.exports = routes;
