const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parentId: {
      type: String
    },
    categoryImage: [
      {
        image: { type: String },
      },
    ],
    type: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
