const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const dbConnect = async() =>{
  try{
    const connection = await mongoose.connect("mongodb+srv://gramajofeijoonacho:aEVtW0IquetzFfBl@shopifycluster.pji2avj.mongodb.net/?retryWrites=true&w=majority");

    console.log("Database connected succesfully!");
  }catch(err){
    console.log("Error connecting the Database :(");
  }
};


module.exports = dbConnect;