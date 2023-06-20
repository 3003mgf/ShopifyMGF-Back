const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      orderSchema = new Schema(
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
          },
          shippingInfo: {
            firstName:{
              type: String,
              required: true
            },
            lastName: {
              type: String,
              required: true
            },
            address: {
              type: String,
              required: true
            },
            other: {
              type: String,
              required: false
            },
            country: {
              type: String,
              required: true
            },
            city: {
              type: String,
              required: true
            },
            state: {
              type: String,
              required: true
            },
            specialInstructions: {
              type: String,
            },
            zipCode: {
              type: Number,
              required: true
            }
          },
          paymentInfo: {
            orderId: {
              type: String,
              required: true
            }
          },
          billingAddress:{
            firstName:{
              type: String,
              required: true
            },
            lastName: {
              type: String,
              required: true
            },
            address: {
              type: String,
              required: true
            },
            other: {
              type: String,
              required: false
            },
            country: {
              type: String,
              required: true
            },
            city: {
              type: String,
              required: true
            },
            state: {
              type: String,
              required: true
            },
            zipCode: {
              type: Number,
              required: true
            }
          },
          orderItems: [
            {
              product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
              },
              color: {
                type: String,
                required: true
              },
              quantity: {
                type: Number,
                required: true
              },
              price: {
                type: String,
                required: true
              }
            }
          ],
          paidAt:{
            type: Date,
            default: Date.now()
          },
          shippingMethod:{
            type: String,
            required: true
          },
          shippingCost:{
            type: Number,
            required: true
          },
          totalPrice: {
            type: Number,
            required: true
          },
          totalPriceAfterDiscount: {
            type: Number,
            required: true
          },
          orderStatus: {
            type: String,
            default: "Ordered"
          }
        },
        {
          timestamps: true
        },
        {
          collection: "orders"
        }
      );

const OrderModel = mongoose.model("orders", orderSchema);

module.exports = OrderModel;