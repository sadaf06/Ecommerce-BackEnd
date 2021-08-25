const Products = require("../models/productSchema");
const category = require("../models/productCatSchema")
const slugify = require("slugify");

exports.addProduct = (req, res) => {
  //   res.json({ file: req.files, body: req.body });
  const { name, price, description, category, quantity } = req.body;
  let productImage = [];
  if (req.files.length > 0) {
    req.files.map((files) => {
      productImage.push({ image: files.filename });
    });
  }
  const product = new Products({
    name,
    slug: slugify(name),
    price,
    description,
    productImage,
    category,
    quantity,
    createdBy: req.user.id,
  });
  product.save((err, data) => {
    if (err) {
      res.status(401).json({ message: "error on save", data: err });
    }
    if (data) {
      res.status(200).json({ product: data });
    }
  });
};

exports.fetchProduct = async (req, res) => {
  const productList = await Products.find({})
    .populate('category')
    .exec();
  res.status(200).json({ productList });
}

exports.productListForclone = async (req, res) => {
  const { slug } = req.params;
  // res.json({ slug })
  const catBySlug = await category.findOne({ slug })
    .select('_id')
    .exec(async (err, cat) => {
      if (err) {
        res.status(400).json({ message: err })
      }
      else if (cat !== null) {
        const productBySlug = await Products.find({ category: cat }).exec((err, data) => {
          if (err) {
            res.status(400).json({ message: err })
          } else {
            res.status(200).json({
              data,
              ProductByPrice: {
                "under 10K": data.filter(prod => { return prod.price <= 10000 }),
                "under 15K": data.filter(prod => { return prod.price <= 15000 && prod.price > 10000 }),
                "under 20K": data.filter(prod => { return prod.price <= 20000 && prod.price > 15000 }),
                "under 30K": data.filter(prod => { return prod.price <= 30000 && prod.price > 20000 }),
                "more than 30K": data.filter(prod => { return prod.price > 30000 }),
              }
            })
          }
        })
      } else {
        res.status(404).json({ message: "No Product Found" })
      }
    })
}
exports.productMatch = async (req, res) => {
  const { productId } = req.params;
  const productDetails = await Products.find({ _id: productId }).exec((err, data) => {
    if (err) {
      res.status(400).json({ message: err });
    } else if (data !== null && data.length !== 0) {
      res.status(200).json({ data: data[0] })
    } else {
      res.status(400).json({ message: "something went wrong" })
    }
  })
}