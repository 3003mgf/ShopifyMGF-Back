const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      enquirySchema = new Schema({
        name:{
          type: String,
          required: true
        },
        email:{
          type: String,
          required: true
        },
        mobile:{
          type: String,
          required: true
        },
        comment:{
          type: String,
          required: true
        },
        status:{
          type: String,
          default: "Submitted",
          enum:["Submitted", "Contacted", "Solved", "In Progress"]
        }
      },
      {
        timestamps: true
      });

const enquiryModel = mongoose.model("enquiry", enquirySchema);

module.exports = enquiryModel;