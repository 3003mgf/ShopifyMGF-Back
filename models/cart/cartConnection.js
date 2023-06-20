const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      cartSchema = new Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users"
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number,
          required: true
        },
        size: {
          type: String,
          required: true
        },
        color: {
          type: String
        }
      },
      {
        timestamps: true
      },
      {
        collection: "cart"
      }

      );



const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;