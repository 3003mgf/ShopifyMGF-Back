const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      brandsSchema = new Schema({
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
        collection: "brand"
      }
      ),
      brandsModel = mongoose.model("brand", brandsSchema);



module.exports = brandsModel;