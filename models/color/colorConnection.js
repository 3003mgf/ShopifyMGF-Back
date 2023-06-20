const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      colorSchema = new Schema({
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
        collection: "colors"
      }
      ),
      colorsModel = mongoose.model("colors", colorSchema);



module.exports = colorsModel;