import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReview,
  deleteReview,
} from "../controllers/productController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const productRoute = express.Router();

productRoute.get(
  "/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllProducts
);
productRoute.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createProduct
);
productRoute
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
productRoute.get("/product/:id", getProductDetail);
productRoute.put("/review", isAuthenticatedUser, createProductReview);
productRoute
  .route("/reviews")
  .get(getProductReview)
  .delete(isAuthenticatedUser, deleteReview);

export default productRoute;
