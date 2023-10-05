// import mongoose from 'mongoose';
// import bcrypt from "bcrypt";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[ true, "Please provide a unique username"],
        unique: [true, "Username exist!"],
      },
      email: {
        type: String,
        required: [ true, "Please provide a unique email"],
        required:  true, 
        unique: true,
        trim: true,
       
      },
      password: {
        type: String,
        required: [ true, "Please provide a unique email"],
        minLength: [6, "Please add minlength up to 6"],
        // maxLength: [10, "Please add maxlength up to 10"],
      },
      phone:{
        type: Number,
        default:"+880"
        // required: true,
      },
      photo:{
          type:String,
          default:""
      },
      bio:{
        type:String,
        maxLength:[250, "Bio must not be more than 250 characters"],
        default:"bio"
      },
      verified:{
        type:Boolean,
        default:false
    },
},
{ timestamps: true }

)

  //generate encrypt password before saving to db
  UserSchema.pre("save", async function(next){

    if(!this.isModified("password")){
      return next();
    }
    //Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next()
  })


//set user model
// export default mongoose.model('User', UserSchema)
const User = mongoose.model("User", UserSchema);
module.exports = User;
