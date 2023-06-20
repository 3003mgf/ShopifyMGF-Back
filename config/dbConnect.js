const mongoose = require("mongoose");

const dbConnect = async() =>{
  try{
    await mongoose.connect("mongodb://mongo:Nc92EBkgJvATMlAN2UFn@containers-us-west-207.railway.app:6410");

    console.log("Database connected succesfully!");
  }catch(err){
    console.log("Error connecting the Database :(");
  }
};


module.exports = dbConnect;