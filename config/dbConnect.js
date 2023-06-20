const mongoose = require("mongoose");

const dbConnect = async() =>{
  try{
    const connection = await mongoose.connect("mongodb://localhost:27017/eCommerce");

    console.log("Database connected succesfully!");
  }catch(err){
    console.log("Error connecting the Database :(");
  }
};


module.exports = dbConnect;