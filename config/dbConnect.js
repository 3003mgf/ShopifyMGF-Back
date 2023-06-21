const mongoose = require("mongoose");

const dbConnect = async() =>{
  try{
    await mongoose.connect(process.env.MONGO_URL_CONNECT);

    console.log("Database connected succesfully!");
  }catch(err){
    console.log("Error connecting the Database :(");
  }
};


module.exports = dbConnect;