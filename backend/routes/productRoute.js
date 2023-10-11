import express from "express";
import { 
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetail
 } from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.get("/products", getAllProducts);
productRoute.post("/product/new", createProduct);
// productRoute.put("/product/:id", updateProduct);
// productRoute.delete("/product/:id", deleteProduct);

productRoute.route("/product/:id")
.put(updateProduct)
.delete(deleteProduct)
.get(getProductDetail);

export default productRoute;