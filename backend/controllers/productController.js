import { responseResolver } from "../utils/controllerUtils.js";
import { productModel } from "../models/productModel.js";


// CREATE A PRODUCT - ADMIN
export const createProduct = async (req,res) => {
    const product = await productModel.create(req.body);

    return res.status(200).json(responseResolver(200,true,"product created",product));
}

// GET ALL PRODUCT
export const getAllProducts = async (req,res) => {

    const products = await productModel.find();

    return res.status(200).json(responseResolver(200,true,"got all products",products));
}

//UPDATE PRODUCT - ADMIN
export const updateProduct = async (req,res,next) => {

    let product  = await productModel.findById(req.params.id);

    if(!product){
        return res.status(500).json(responseResolver(500,false,"Product not found"));
    }

    product = await productModel.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    return res.status(200).json(responseResolver(200,true,"Product updated",product));
}

//DELETE PRODUCT
export const deleteProduct = async (req,res,next) => {
    const product  = await productModel.findById(req.params.id);

    if(!product){
        return res.status(500).json(responseResolver(500,false,"Product not found"));
    }

    await productModel.findByIdAndRemove(req.params.id);

    return res.status(200).json(responseResolver(200,true,"Product Deleted"));
}

//GET SINGLE PRODUCT DETAIL
export const getProductDetail = async (req,res,next) => {
    const product  = await productModel.findById(req.params.id);

    if(!product){
        return res.status(500).json(responseResolver(500,false,"Product not found"));
    }

    return res.status(200).json(responseResolver(200,true,"Got Product", product));
}