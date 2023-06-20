const mongoose = require("mongoose");

const dbConnect = async() =>{
  try{
    await mongoose.connect("mongodb://mongo:grMeLHI7qvV3A8x7OOTy@containers-us-west-89.railway.app:7120");

    console.log("Database connected succesfully!");
  }catch(err){
    console.log("Error connecting the Database :(");
  }
};


module.exports = dbConnect;