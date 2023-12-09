const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  newProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts).post(newProduct);
router.route("/products/:id").get(getSingleProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
