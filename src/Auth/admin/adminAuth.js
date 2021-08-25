const express = require("express");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");

exports.signIn = (req, res) => {
  userModel.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      res.status(401).json({
        message: "not found",
      });
    }
    if (user && user.role === "admin") {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWTSECRET,
          {
            expiresIn: "7d",
          }
        );
        const { firstName, lastName, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "7d" });
        res.status(200).json({
          message: "admin login successfully",
          token,
          user: { firstName, lastName, role, fullName },
        });
      } else {
        res.status(501).json({
          message: "invalid Credential",
        });
      }
    } else {
      res.status(401).json({
        message: "admin not registered",
      });
    }
  });
};
exports.signUp = (req, res) => {
  userModel.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      res.status(409).json({ message: "admin already registered" });
    } else {
      const { firstName, lastName, email, password, contact } = req.body;
      let role = req.body.role;
      role = "admin";
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password,
        contact,
        role,
      });
      newUser.save((err, data) => {
        if (data) {
          res.status(201).json({
            user: data,
            message: "Signup Succesfully"
          });
        }
        if (err) {
          res.status(400).json({ message: err });
        }
      });
    }
  });
};
exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Admin SignOut Succesfully...." });
};
