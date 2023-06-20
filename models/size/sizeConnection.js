const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      sizeSchema = new Schema({
        title:{
          type: String,
          required: true,
          unique: true,
          index: true
        }
      },
      {
        timestamps: true
      },
      {
        collection: "sizes"
      }
      ),
      sizeModel = mongoose.model("sizes", sizeSchema);



module.exports = sizeModel;