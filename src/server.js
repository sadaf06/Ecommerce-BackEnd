const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const path = require('path')
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/admin/adminRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const fetchProduct = require("./routes/fetchProductRoutes")
const cors = require("cors");
env.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.n7bo1.mongodb.net/${process.env.MONGODIR}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("database connected");
  });
var whitelist = ['https://shoppingcartuser.herokuapp.com', 'https://shoppingcartadmin.herokuapp.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/", userRoute);
app.use("/", adminRoute);
app.use("/", productRoute);
app.use("/", categoryRoute);
app.use("/", cartRoute);
app.use('/', fetchProduct);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`)
);
