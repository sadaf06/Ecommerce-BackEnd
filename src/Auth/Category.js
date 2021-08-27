const slugify = require("slugify");
const { findOneAndDelete } = require("../models/productCatSchema");
const Category = require("../models/productCatSchema");

const formateList = (allCat, productID = null) => {
  const catList = [];
  let category;
  if (productID == null) {
    category = allCat.filter((cat) => cat.parentId == undefined);
  } else {
    category = allCat.filter((cat) => cat.parentId == productID);
  }
  for (let cate of category) {
    catList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type ? cate.type : "",
      childrens: formateList(allCat, cate._id),
    });
  }
  return catList;
};
exports.categoryAdd = (req, res) => {
  let categoryImage = [];
  if (req.files.length > 0) {
    console.log(req.files.path)
    req.files.map((files) => {
      categoryImage.push({ image: files.filename });
    });
  }
  const catData = {
    name: req.body.name,
    slug: slugify(req.body.name),
    categoryImage
  };
  if (req.body.parentId) {
    catData.parentId = req.body.parentId;
  }
  if (req.body.type !== "" && req.body.type !== undefined) {
    catData.type = req.body.type;
  }
  const cat = new Category(catData);
  cat.save((err, data) => {
    if (err) {
      res.status(401).json({ message: "some error occured" });
    }
    if (data) {
      res.status(200).json({ data });
    }
  });
};

exports.fetchCat = (req, res) => {
  Category.find({}).exec((err, allCat) => {
    if (err) {
      res.status(401).json({ message: err });
    }
    if (allCat) {
      const formatedCatlist = formateList(allCat);
      res.status(200).json({ formatedCatlist });
    }
  });
};
exports.categoryUpdate = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  // return res.json({ data: req.body })
  const updateCategory = [];
  if (_id instanceof Array) {
    for (let i = 0; i < _id.length; i++) {
      let category = {
        name: name[i],
        type: type[i],
        slug: slugify(name[i]),
      }
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }
      const updatedCat = await Category.findOneAndUpdate({ _id: _id[i] }, category, { new: true })
      updateCategory.push(updatedCat);
    }
    return res.status(201).json({ updateCategory })
  } else {
    let category = {
      name: name,
      type: type,
      slug: slugify(name),
    }
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCat = await Category.findOneAndUpdate({ _id }, category, { new: true })
    updateCategory.push(updatedCat);
    return res.status(201).json({ updateCategory })
  }
}
exports.deleteCat = async (req, res) => {
  const ids = req.body.ids;
  let deleteSucces = []
  for (i = 0; i < ids.length; i++) {
    const deleteOne = await Category.findOneAndDelete({ _id: ids[i] });
    deleteSucces.push(deleteOne);
  }
  if (deleteSucces.length == ids.length) {
    res.status(200).json({ deleteSucces })
  } else {
    res.status(400).json({ message: "not deleted Properly" })
  }
};