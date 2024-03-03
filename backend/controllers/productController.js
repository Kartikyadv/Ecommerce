import { responseResolver } from "../utils/controllerUtils.js";
import { productModel } from "../models/productModel.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// CREATE A PRODUCT - ADMIN
export const createProduct = catchAsyncError(async (req, res) => {
  req.body.createdBy = req.user.id;
  const product = await productModel.create(req.body);

  return res
    .status(200)
    .json(responseResolver(200, true, "product created", product));
});

// GET ALL PRODUCT
export const getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 3;
  const productCount = await productModel.countDocuments();

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  return res.status(200).json(
    responseResolver(200, true, "got all products", {
      productCount: productCount,
      products: products,
    })
  );
});

//UPDATE PRODUCT - ADMIN
export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res
    .status(200)
    .json(responseResolver(200, true, "Product updated", product));
});

//DELETE PRODUCT - ADMIN
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }

  await productModel.findByIdAndRemove(req.params.id);

  return res.status(200).json(responseResolver(200, true, "Product Deleted"));
});

//GET SINGLE PRODUCT DETAIL
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }

  return res
    .status(200)
    .json(responseResolver(200, true, "Got Product", product));
});

// CREATE NEW REVIEW OR UPDATE THE REVIEW
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev)=> {
        if(rev.user.toString() === req.user._id.toString()){
            rev.rating = rating;
            rev.comment = comment;
        }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg/product.reviews.length;

  await product.save({validateBeforeSave: false});

  res.send(responseResolver(200,true,"Review Added"));
});

// GET ALL REVIEWS OF A PRODUCT
export const getProductReview = catchAsyncError(async (req,res,next) => {
    const product = await productModel.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.send(responseResolver(200,true,"Got all product review",product.reviews));
});

// Delete review
export const deleteReview = catchAsyncError(async (req,res,next) => {
    const product = await productModel.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    const reviews = product.reviews.filter((rev) => 
        rev._id.toString() !== req.query.id.toString()
    );
    let avg = 0;
    reviews.forEach((rev)=>{
        avg += rev.rating;
    });
    const ratings = avg/reviews.length;
    const numOfReviews = reviews.length;
    await productModel.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );
    res.send(responseResolver(200,true,"Review deleted"));
});

