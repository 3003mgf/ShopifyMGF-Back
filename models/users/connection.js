const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      userSchema = new Schema(
        {
          userName:{
            type: String,
            required: true,
            unique: true,
            index: true
          },
          firstName:{
            type: String,
            required: true,
            index: true
          },
          lastName:{
            type: String,
            required: true,
            index: true
          },
          email:{
            type: String,
            required: true,
            unique: true,
          },
          mobile:{
            type: String,
            required: true,
            unique: true,
          },
          password:{
            type: String,
            required: true,
          },
          role:{
            type: String,
            default: "user"
          },
          isBlocked:{
            type: Boolean,
            default: false
          },
          cart:{
            type: Array,
            default: []
          },
          
          address: String,

          wishList: [{type: mongoose.Schema.Types.ObjectId, ref: "products"}],
          
          refreshToken: String,

          passwordChangedAt: Date,
          passwordResetToken: String,
          passwordResetExpires: Date
        },
        { 
          timestamps: true
        },
        {
          collection: "users"
        }
      );



const UserModel = mongoose.model("users", userSchema);



module.exports = UserModel;