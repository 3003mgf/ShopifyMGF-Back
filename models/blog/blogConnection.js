const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      blogSchema = new Schema({
        title:{
          type: String,
          required: true
        },
        description:{
          type: String,
          required: true
        },
        category:{
          type: String,
          required: true
        },
        numViews:{
          type: Number,
          default: 0
        },
        isLiked:{
          type: Boolean,
          default: false
        },
        isDisliked:{
          type: Boolean,
          default: false
        },
        likes:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "users", //La ref hace referencia al nombre de la coleccion.
        }],
        dislikes:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "users", //IMPORTANTE! Debe ser el nombre de nuestra coleccion de los Users (connection.js)
        }],
        images: [],
        author:{
          type: String,
          default: "Admin"
        }
      },
      {
        toJSON:{
          virtuals: true
        },
        toObject:{
          virtuals: true
        },
        timestamps: true
      },
      {
        collection: "Blog"
      }
      );


const BlogModel = mongoose.model("Blog", blogSchema);


module.exports = BlogModel;