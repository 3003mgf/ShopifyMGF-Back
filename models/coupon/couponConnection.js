const mongoose = require("mongoose"),
      couponSchema = new mongoose.Schema({
        name:{
          type: String,
          required: true,
          unique: true,
          index: true,
          uppercase: true
        },
        expire:{
          type: Date,
          required: true
        },
        discount:{
          type: String,
          required: true
        }
      },
      {
        collection: "coupon"
      });

const couponModel = mongoose.model("coupon", couponSchema);


module.exports = couponModel; 