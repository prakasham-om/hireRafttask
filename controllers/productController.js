const Product = require('../models/productModel');
const cloudinary = require("cloudinary").v2;

exports.newProduct = async (req, res) => {
  try {
   
    if ('images' in req.body ||req.files.images) {
      const imagesValue = req.body.images;
      if (/^https?:\/\/\S+\.\S+$/.test(imagesValue)) {
        req.body.images = imagesValue;
      } else if (req.files && req.files.images) {
        const file = req.files.images;
        if (!file.tempFilePath) {
          return res.status(400).json({ success: false, error: 'Invalid file provided.' });
        }
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        req.body.images = result.url;
      } else {
        req.body.images = imagesValue;
      }
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      error,
    });
  }
};
exports.getAllProducts = async (req, res, next) => {
  console.log(req.query);
  try {
    const resPerPage = parseInt(req.query.perPage, 10) || 8;
    const page = parseInt(req.query.page, 10) || 1;
    const productName = req.query.productName ? req.query.productName.replace(/"/g, '') : '';
    const category = req.query.category ? req.query.category.replace(/"/g, '') : '';
    const filters = {};
    console.log(productName);

    if (productName) {
      filters.productName = new RegExp(productName, 'i');
    }

    if (category) {
      filters.category = new RegExp(category, 'i');
    }

    const products = await Product.find(filters)
      .skip((page - 1) * resPerPage)
      .limit(resPerPage);

    const countProducts = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(countProducts / resPerPage),
      resPerPage,
      countProduct: countProducts,
      products,
    });
  } catch (error) {
    next(error);
  }
};



exports.getSingleProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
exports.updateProduct = async (request, response, next) => {
  try {
    let product = await Product.findById(request.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not Found !", 404));
    }

    const file = request.files.images;
    console.log(file);
    if (!file || !file.tempFilePath) {
      return response.status(400).json({ success: false, error: 'No file or invalid file provided.' });
    }

    await cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      request.body.images = result.url;

      const updatedProduct = await Product.findByIdAndUpdate(
        request.params.id,
        request.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      response.status(201).json({
        success: true,
        updatedProduct,
      });
    });
  } catch (error) {
  //  console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.',
      });
    }

    const deleteProduct = await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
