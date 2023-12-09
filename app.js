const express = require("express");
const productsRoutes = require("./routes/productRoutes");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const fileUpload=require('express-fileupload');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(cors());
app.use(fileUpload(
  {useTempFiles:true}
));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/", productsRoutes);

module.exports = app;
