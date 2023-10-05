// import express from "express";
// const router = express.Router();
// import { loginUser, signupUser,logoutUser, getUser, loginStatus, getUserList, updateUser, changePassword, forgotPassword, resetPassword } from "../controllers/auth.js";
// import { protect } from "../middleWare/authMiddleware.js";
const express = require("express");
const router = express.Router();
const {
    signupUser,
  loginUser,
  logoutUser,
  getUser,
  getUserList,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const protect = require("../middleWare/authMiddleware");


router.post("/signup", signupUser); //register user
 router.post("/login", loginUser); //login the app
 router.get("/logout", logoutUser); //logout
 router.get("/getuser",protect, getUser); //get user profile
 router.get("/loggedin", loginStatus); //get login status
 router.get("/userlist", getUserList); //get user list
 router.patch("/updateuser",protect, updateUser); //update user
 router.patch("/changepassword",protect, changePassword); //change password
 router.post("/forgotpassword", forgotPassword); //forgot password
 router.put("/resetpassword/:resetToken", resetPassword); //reset password


// export default router;
module.exports = router;