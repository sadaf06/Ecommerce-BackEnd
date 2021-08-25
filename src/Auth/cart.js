const cartSchema = require("../models/cartSchema");
const orderSchema = require("../models/orderSchema");
function addToCartFunc(condition, update) {
  return new Promise((resolve, reject) => {
    cartSchema.findOneAndUpdate(condition, update, { new: true })
      .then((data) => resolve())
      .catch((err) => reject());
  })
}

exports.addToCart = (req, res) => {
  cartSchema.findOne({ userId: req.user.id }).exec(async (err, cart) => {
    if (err) {
      res.status(401).json({ message: err });
    }
    if (cart !== null && cart !== undefined) {

      let updateArray = [];
      req.body.cartProducts.forEach(reqProduct => {
        const bodyProduct = reqProduct.product;
        const item = cart.cartProducts.find((p) => {
          return p.product == bodyProduct;
        });
        let condition, update
        if (item) {
          condition = {
            userId: req.user.id,
            "cartProducts.product": bodyProduct
          }
          update = {
            $set: {
              "cartProducts.$": reqProduct
            }
          }
        } else {
          condition = { userId: req.user.id };
          update = {
            $push: {
              cartProducts: reqProduct,
            },
          };
        }
        updateArray.push(addToCartFunc(condition, update))
      });
      Promise.all(updateArray)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ message: error }));
    } else {
      const cart = new cartSchema({
        userId: req.user.id,
        cartProducts: req.body.cartProducts,
      });
      cart.save((err, data) => {
        if (err) {
          res.status(400).json({ message: err });
        }
        if (data) {
          res.status(200).json({ data });
        }
      });
    }
  });
};

exports.getcart = (req, res) => {
  cartSchema.findOne({ userId: req.user.id })
    .populate('cartProducts.product', "_id name price productImage")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: err })
      }
      if (data !== null && data !== undefined) {
        let cartData = {};
        data.cartProducts.forEach(element => {
          const { _id, name, price, productImage } = element.product
          cartData[_id] = { _id, name, price, productImage: productImage[0].image, quantity: element.quantity };
        })
        res.status(200).json({ cartData });
      } else {
        res.status(299).json({ message: "No Cart Product" });
      }
    })
}

exports.removeCart = (req, res) => {
  const { _id } = req.body

  cartSchema.findOneAndUpdate(
    { userId: req.user.id },
    {
      $pull: {
        cartProducts: {
          product: _id,
        }
      },
    },
    { new: true, useFindAndModify: false }
  ).exec((err, data) => {
    if (err) {
      res.status(400).json({ message: err })
    }
    if (data) {
      res.status(200).json({ data })
    }
  })
}

exports.orderSave = (req, res) => {
  const userId = req.user.id;
  req.body.userId = userId;
  cartSchema.findOneAndDelete({ userId }).exec((err, data) => {
    if (err) {
      res.status(500).json({ message: err })
    }
  })
  const orderCreateSchema = new orderSchema(req.body)
  orderCreateSchema.save((err, data) => {
    if (err) {
      res.status(500).json({ message: err })
    }
    if (data) {
      res.status(201).json({ data })
    }
  })
}
exports.orderFetch = (req, res) => {
  const userId = req.user.id;
  orderSchema.find({ userId })
    .populate('products.productId', '_id name productImage')
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      if (data) {
        res.status(200).json(data);
      }
    })
}