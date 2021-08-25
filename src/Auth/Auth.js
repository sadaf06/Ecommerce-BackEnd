const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AddressModel = require("../models/addressSchema");

exports.signIn = (req, res) => {
  userModel.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      res.status(400).json({
        message: "some error occured",
      });
    }
    if (user) {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWTSECRET,
          {
            expiresIn: "7d",
          }
        );
        const { firstName, lastName, role, fullName, email } = user;
        res.cookie("token", token, { expiresIn: "7d" });
        res.status(200).json({
          token,
          user: { firstName, lastName, role, fullName, email },
          message: "SignIn Succesfully"
        });
      } else {
        res.status(401).json({
          message: "invalid Credential",
        });
      }
    } else {
      res.status(401).json({
        message: "user not registered",
      });
    }
  });
};
exports.signUp = (req, res) => {
  userModel.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      res.status(501).json({ message: "user already registered" });
    } else {
      const { firstName, lastName, email, password, contact } = req.body;
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password,
        contact,
      });
      newUser.save((err, data) => {
        if (data) {
          res.status(200).json({
            user: data,
            message: "Signup Successfully"
          });
        }
        if (err) {
          res.status(400).json({ message: err });
        }
      });
    }
  });
};
exports.profile = (req, res) => {
  res.status(200).json({
    message: "this is Profile Page",
  });
};
exports.AddAddress = (req, res) => {
  const { name, contact, pincode, HouseNo, fullAddress, city, addressType, state } = req.body;
  const saveData = {
    userId: req.user.id,
    Address: [
      { name, contact, pincode, HouseNo, fullAddress, city, addressType, state }
    ]
  }
  AddressModel.findOne({ userId: req.user.id }).exec((err, data) => {
    if (err) {
      res.status(400).json({
        message: err
      });
    };
    if (data && data !== null && data !== undefined) {
      if (req.body.actionType == "Add") {
        AddressModel.findOneAndUpdate({ userId: req.user.id },
          {
            $push: {
              Address: saveData.Address,
            }
          }, { new: true }).exec((err, data) => {
            if (err) {
              res.status(400).json({ err })
            }
            if (data) {
              res.status(200).json({ data })
            }
          })
      }
      else if (req.body.actionType == "delete") {
        AddressModel.findOneAndUpdate({ userId: req.user.id, "Address._id": req.body._id },
          {
            $pull: {
              Address: {
                _id: req.body._id
              }
            }
          }, { new: true }
        ).exec((err, data) => {
          if (err) {
            res.status(400).json({ err })
          }
          if (data) {
            res.status(200).json({ data });
          }
        })
      } else {
        AddressModel.findOneAndUpdate({ userId: req.user.id, "Address._id": req.body._id },
          {
            $set: {
              "Address.$": saveData.Address
            }
          }, { new: true }).exec((err, data) => {
            if (err) {
              res.status(500).json({ err })
            }
            if (data) {
              res.status(200).json({ data });
            }
          })
      }
    }
    else {
      const addressSave = new AddressModel(saveData)
      addressSave.save((err, data) => {
        if (err) {
          res.status(400).json({
            message: err
          })
        }
        if (data) {
          res.status(201).json({ data })
        }
      })
    }
  });
}

exports.getAddress = (req, res) => {
  AddressModel.findOne({ userId: req.user.id }).exec((err, data) => {
    if (err) {
      res.status(500).json({ err })
    }
    if (data) {
      res.status(200).json({ data });
    }
  })
}