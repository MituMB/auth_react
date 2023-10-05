// import User from "../models/UserModel.js";
// import jwt from "jsonwebtoken";
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

 const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).send({ error: "Not authorized!Please login" });

        //verify token     
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        //get user id from token
        const user = await User.findById(verifyToken.id).select("-password");
        if(!user) return res.status(401).send({error:"user not found"})

        req.user = user;
        next();
    } catch (error) {
        res.status(402).send({ error: "Not authorized!Please login" });
    }
}

module.exports = protect;