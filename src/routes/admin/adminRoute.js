const express = require("express");
const routes = express.Router();
const {
  checkSignUp,
  validatCheck,
  checkSignIn,
  signInRequired,
} = require("../../Auth/middleWare");
const { signIn, signUp, signOut } = require("../../Auth/admin/adminAuth");

// routes.post("/admin/signup", checkSignUp, validatCheck, signUp);
routes.post("/admin/signin", checkSignIn, validatCheck, signIn);
routes.post("/admin/signout", signInRequired, signOut);
module.exports = routes;
