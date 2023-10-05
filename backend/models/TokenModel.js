// import mongoose from 'mongoose';
const mongoose = require("mongoose");


const TokenSchema = new mongoose.Schema({
    userId : { 
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    token: {
        type: String,
        required:true,
      },
      createdAt: {
        type: Date,
        required:true,
      },
      expireAt: {
        type: Date,
        required:true,
      }
     
}
)


//set token model
// export default mongoose.model('Token', TokenSchema)
const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
