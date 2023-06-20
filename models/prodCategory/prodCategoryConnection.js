const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      categorySchema = new Schema({
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
        collection: "prod-categories"
      }
      ),
      prodCategoryModel = mongoose.model("prod-categories", categorySchema);



module.exports = prodCategoryModel;