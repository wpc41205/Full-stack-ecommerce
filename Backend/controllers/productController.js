import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

//fuction for add product
const addProduct = async (req, res) => {
    try {

        const {name, description, price, category, subCategory, sizes, bestseller} = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesURL = [];
        if (images.length > 0) {
            imagesURL = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
                    return result.secure_url;
                })
            );
        }

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesURL,
            date: Date.now(),
        }

        const product = new productModel(productData);
        await product.save();

        res.json({success: true, message: 'Product added'});
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }

}

//fuction for list product
const listProducts = async (req, res) => {

    try {
        
        const products = await productModel.find({}).maxTimeMS(20000); // 20 seconds timeout
        res.json({success: true, data: products});

    } catch (error) {
        console.log('Product list error:', error);
        if (error.name === 'MongoServerSelectionError' || error.name === 'MongoTimeoutError') {
            return res.json({success: false, message: 'Database connection timeout. Please try again.'});
        }
        return res.json({success: false, message: error.message});
    }

}

//fuction for removing product
const removeProduct = async (req, res) => {

    try {
        
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'Product removed'});
        
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }

}

//fuction for single product info
const singleProduct = async (req, res) => {

    try {
        
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({success: true,product});

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }

}

export {addProduct, listProducts, removeProduct, singleProduct};