const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      productsSchema = new Schema({
        title:{
          type: String,
          required: true,
          trim: true
        },
        slug:{
          type: String,
          required: true,
          unique: true,
          lowercase: true
        },
        description:{
          type: String,
          required: true
        },
        price:{
          type: Number,
          required: true
        },
        category:{
          type: String,
          required: true
        },
        quantity:{
          type: Number,
          required: true
        },
        sold: {
          type: Number,
          default: 0
          //select: false -> Va a hacer que no se incluya la propiedad 'sold' en la respuesta que nos de el servidor.
        },
        images: [],
        color: [],
        tags:[],
        ratings: [{
          star: Number,
          comment:  String,
          postedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
          }
        }],
        totalRating:{
          type: Number,
          default: 5
        },
        brand:{
          type: String,
          required: true
        },
        reviews:[{
          name: String,
          email: String,
          rating: Number,
          reviewTitle: String,
          review: String,
          date: Date,
          postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          }
        }],
        type:{
          type: String,
          required: true
        },
        sku:{
          type: String,
          required: true
        },
        size:[]
      },
      {
        timestamps: true
      },
      {
        collection: "products"
      }
      );



const ProductsModel = mongoose.model("products", productsSchema);




module.exports = ProductsModel;