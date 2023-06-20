const mongoose = require("mongoose");

const dbConnect = async() =>{
  try{
    await mongoose.connect("mongodb+srv://gramajofeijoonacho:aEVtW0IquetzFfBl@shopifycluster.pji2avj.mongodb.net/?retryWrites=true&w=majority");

    console.log("Database connected succesfully!");
  }catch(err){
    console.log("Error connecting the Database :(");
  }
};


module.exports = dbConnect;