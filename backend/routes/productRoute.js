import express from "express";
import { 
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetail
 } from "../controllers/productController.js";
import { 
    isAuthenticatedUser,
    authorizeRoles
} from "../middleware/auth.js";

const productRoute = express.Router();

productRoute.get("/products", isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);
productRoute.post("/admin/product/new", isAuthenticatedUser, authorizeRoles("admin"), createProduct);
productRoute.route("/product/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
.get(getProductDetail);

export default productRoute;