import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';


const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const filter = { ...keyword };
  
  if (req.query.category) {
    filter.category = { $regex: new RegExp(req.query.category, 'i') };
  }
  
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  
  if (req.query.rating) {
    filter.rating = { $gte: Number(req.query.rating) };
  }
  
  if (req.query.featured === 'true') {
    filter.featured = true;
  }
  
  if (req.query.exclude) {
    filter._id = { $ne: req.query.exclude };
  }

  let sortOption = { createdAt: -1 };
  
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price':
        sortOption = { price: 1 }; 
        break;
      case '-price':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: 1 };
        break;
      case '-rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case '-name':
        sortOption = { name: -1 };
        break;
      case 'sales':
        sortOption = { sales: 1 };
        break;
      case '-sales':
        sortOption = { sales: -1 };
        break;
      case 'createdAt':
        sortOption = { createdAt: 1 };
        break;
      case '-createdAt':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const limit = req.query.limit ? Number(req.query.limit) : pageSize;

  const count = await Product.countDocuments(filter);
  
  let products;
  if (req.query.limit) {
    products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit);
  } else {
    products = await Product.find(filter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
});


const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    discount,
    featured,
  } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id,
    images: images || ['/placeholder.svg'],
    brand,
    category,
    countInStock,
    numReviews: 0,
    description,
    discount: discount || 0,
    featured: featured || false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    discount,
    featured,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.discount = discount !== undefined ? discount : product.discount;
    product.featured = featured !== undefined ? featured : product.featured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};