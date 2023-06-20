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
        collection: "blog-categories"
      }
      ),
      blogCategoryModel = mongoose.model("blog-categories", categorySchema);



module.exports = blogCategoryModel;