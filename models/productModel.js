const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Plase enter product name!"],
    maxLength: 100,
  },
  category: {
    type: String,
    required: [true, "Please enter category"]
  },
  description: {
    type: String,
    required: [true, "Please enter description"],
  },
  images: {type:String}
});
module.exports = mongoose.model("product", productSchema);
