// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cookieparser from 'cookie-parser';
// import bodyParser from 'body-parser';
// import authRoute from "./routes/authRoute.js";
// import productRoute from "./routes/productRoute.js";
// import path from "path";

const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const cookieparser = require("cookie-parser");
const path = require("path");

// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import errorHandler from "./middleWare/errorHandler.js";
const app = express();
dotenv.config();



//error middleware
// app.use(errorHandler)
// db connection
const connectDb = async (req, res, next) =>{
    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://localhost:27017/inventory');
        console.log('db connected')
        
    } catch (error) {
        console.log('db not connected');
        console.log(error.message); 
    }
}

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname,"uploads")));

//api routes
app.use('/api/auth',authRoute)
app.use('/api/products',productRoute)

//error handling
// app.use((err, req, res, next) => {
//     const status = err.status || 500;
//     const msg = err.message || "something went wrong";
//     return res.status(status).json({
//         success: false,
//         status: status,
//         message: msg
//     });
//     })

const port = 2000;
app.listen(port, async () => {
    connectDb();
    console.log(`server is running ${port}`);
});

app.get('/', (req, res) => {
    res.status(200).send("app working")
})



