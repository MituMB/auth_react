// import mongoose from 'mongoose';

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    user: { 
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    name: {
        type: String,
        required:[ true, "Please add a name"],
        trim: true, 
      },
      sku: {
        type: String,
        required:  true, 
        default:"SKU",
        trim: true
       
      },
      category: {
        type: String,
        required:[ true, "Please add a category"],
        trim: true
      },
      quantity: {
        type: String,
        required:[ true, "Please add  quantity/price"],
        trim: true
      },
      desc: {
        type: String,
        required:[ true, "Please add  a description"],
        trim: true
      },
     
      image:{
          type:Object,
          default:{}
      },
     
},
{ timestamps: true }

)


//set user model
// export default mongoose.model('Products', ProductSchema)
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
