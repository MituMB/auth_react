// import User from "../models/UserModel.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import Token from "../models/TokenModel.js";
// import sendEmail  from "../utils/sendMail.js";
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
/** Create Signup user */
 const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // //validation
    if (!name || !email || !password) {
      res.status(400).send({ error: "All fields must be filled" });
    }
    //check if user email already exists
    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).send({ message: "Email already exist" });

    if (password.length < 6)
      return res
        .status(400)
        .send({ error: "Password should not less than 6 characters" });

    //create new user and save data
    const user = new User({ ...req.body, password });
    const saveUser = await user.save();
    //generate token
    const token = generateToken(saveUser._id);
    //send http-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1day
      sameSite: "none",
      secure: true,
    });
    if (saveUser) {
      const { _id, name, email, photo, phone, bio } = saveUser;
      res.status(200).send({
        message: "User created successfully",
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token,
      });
    } else {
      res.status(400).send({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**  login user  */
 const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate request
    if (!email || !password) {
      res.status(400).send({ error: "Please add email and password" });
    }
    //check if user exist
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found. Please sign up" });

    //check password
    const correctPassword = await bcrypt.compare(password, user.password);
    // if (!correctPassword) return res.status(400).json({ error: " Password incorrect" });
    //generate token
    const token = generateToken(user._id);
    //send http-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1day
      sameSite: "none",
      secure: true,
    });

    if (user && correctPassword) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).send({
        message: "login successfull",
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token,
      });
    } else {
      res.status(400).json({ error: "Wrong email or password!!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**  logout user  */
 const logoutUser = async (req, res) => {
  // const user = await User.findOne({email });
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).send({
    message: `logout successfull `,
  });
};

//****getUser data */
 const getUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).send({
      message: "user found",
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400).json({ error: "User not found!!" });
  }
};

//****Get login status */
 const loginStatus = async (req, res) => {
try {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verify token
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
  if (verifyToken) {
    return res.json(true);
  }
  return res.json(false);
} catch (error) {
  res.status(500).json("something went wrong!!");
}
};

/**get all user*/
 const getUserList = async (req, res) => {
  try {
    const getusers = await User.find();
    res.status(200).json(getusers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**update user */
 const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { name, email, photo, phone, bio } = user;
      user.email = email;
      user.name = req.body.name || name;
      user.phone = req.body.phone || phone;
      user.bio = req.body.bio || bio;
      user.photo = req.body.photo || photo;

      const updatedUser = await user.save();
      res.json({
        message: "update successfully!",
        updatedUser,
        // _id:updatedUser._id,
        // name:updatedUser.name,
        // email:updatedUser.email,
        // photo:updatedUser.photo,
        // bio:updatedUser.bio,
      });
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Change Password  */

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, password } = req.body;
    //validate
    if (!user) {
      res.status(400).json({ error: "User not found!" });
    }
    if (!oldPassword || !password) {
      res.status(400).json({ error: "Please add old and new password!" });
    }
    //check if old password matches password in db
    const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);
    //save new password
    if (user && isCorrectPassword) {
      user.password = password;
      await user.save();
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(400).json({ error: "Old password incorrect!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** forgot Password - create a token and send to email */
 const forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User not exist!" });
    }

    //delete token if it exists in db
let token = await Token.findOne({userId:user._id})
if(token){
  await Token.deleteOne( )
}
    //create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

    //Hash token before saving to db
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //save token to database
      await new Token({
        userId:user._id,
        token:hashedToken,
        createdAt:Date.now(),
        expireAt:Date.now() + 30 * (60 * 1000)//30minute
      }).save()

      //Construct reset url
      const reseltUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
      console.log(reseltUrl);

      //Reset Email 
      const message = `
      <h2>Hello ${user.name}</h2>
      <p>Please use the below url to reset password</p>
      <a href=${reseltUrl} clicktracking=off>${reseltUrl}</a>
      `;
      const subject = "password reset request"
      const email_to = user.email
      const email_from = process.env.EMAIL_USER

      try {
     await sendEmail(subject,message,email_to,email_from)

        return res.status(200).send({
          success:true,
          msg:"Reset Email sent"
        })

      
      } catch (error) {
        res.status(500).send({error:error.message})
      }
  } catch (error) {
    // res.status(500).send({error:" Something went wrong.."})
  }

};
/** Reset Password  */
 const resetPassword = async (req, res) =>{

  const { password} = req.body
  const { resetToken} = req.params
    //Hash token , then compare to token in db
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //find token in db 
    const userToken = await Token.findOne({
      token: hashedToken,
      expireAt:{$gt: Date.now()}
    })

    if(!userToken) {
      res.status(400).send({error:"Invalid or expired token"})
    }


    //find user
    const user = await User.findOne({_id:userToken.userId})
    user.password = password
    await user.save()
    res.status(200).json({message:"Password reset successful. please login"});
  
res.send({success:true})
}



module.exports = {
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
};