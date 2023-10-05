// import Product from "../models/ProductModel.js";
// import {fileSizeFormatter}  from "../utils/fileUpload.js";
// // const cloudinary = require('cloudinary').v2
// // import { v2 as cloudinary } from 'cloudinary';
// // import  cloudinary  from '../utils/cloudinary.js';
// import  cloudinary  from 'cloudinary';


const Product = require("../models/ProductModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     secure_url: true
//   });

 const createProduct = async (req, res) =>{
    const {name,sku,category,quantity,price,desc} =req.body
//validation
    if(!name ||!category || !quantity || !price || !desc){
        res.status(400).send({ error: "All fields must be filled" });
    }

    //manage image upload

    let fileData = {}
    if(req.file){
        //save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,options,
                    {
                    folder:"Inventory App Products",
                     resource_type:"image",
                    })

                    // console.log(uploadedFile);
                     return uploadedFile;
        } catch (error) {
            console.error(error)
            res.status(500).json( {
               
                error,
            msg:"image could not be uploaded"} );
        }

        fileData = {
            fileName: req.file.originalname,
            // filePath: req.file.path,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }
    //create product
    try{
        const product =await Product.create({
            user:req.user.id,
            name,
            sku,
            category,
            quantity,
            price,
            desc,
            image:fileData
        })
        res.status(200).json({
            success:true,
            message:"product created successfully",
            product
        });

    }catch(error) {
        res.status(500).json({ message: error.message });
    }
  

}


module.exports = {
    createProduct,
    // getProducts,
    // getProduct,
    // deleteProduct,
    // updateProduct,
  };