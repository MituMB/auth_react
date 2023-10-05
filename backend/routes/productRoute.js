// import express from "express";
// import { createProduct } from "../controllers/productController.js";
// import { protect } from "../middleWare/authMiddleware.js";
// import {upload}  from "../utils/fileUpload.js";
// import multer from "multer";
// import upload  from "multer({dest:'uploads/'})";
// const { upload } = require("../utils/fileUpload.js");
// const upload = multer({dest:'uploads/'});

const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createProduct,
  // getProducts,
  // getProduct,
  // deleteProduct,
  // updateProduct,
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");




router.post("/create", protect, upload.single('image'),createProduct); //create product


// export default router;
module.exports = router;