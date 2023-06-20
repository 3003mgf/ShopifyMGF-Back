const colorConnection = require("./colorConnection"),
      colorActions = () => {};


colorActions.createColor = async(color, cb) =>{
  try{
    
    const newColor = await colorConnection.create(color);
    cb(false, color);

  }catch(err){
    cb(true)
  }
};


colorActions.deleteColor = async(id, cb) =>{
  try{
    const findAndDelete = await colorConnection.findByIdAndDelete(id);
    cb(false, findAndDelete);
  }catch(err){
    cb(true);
  }
};


colorActions.updateColor = async(id, data, cb) =>{
  try{
    const updateColor = await colorConnection.findByIdAndUpdate(id, data)
    updateColor.title = data.title;

    cb(false, updateColor);
  }catch(err){
    cb(true);
  }
};


colorActions.getAllColors = async(cb) =>{
  try{
    const getAll = await colorConnection.find();
    if(!getAll.length) throw new Error("Empty");

    cb(false, getAll);
  }catch(err){
    cb(true);
  }
};

colorActions.getColor = async(id, cb) =>{
  try{
    const findColor = await colorConnection.findById(id);
    cb(false, findColor);
  }catch(err){
    cb(true);
  }
};

module.exports = colorActions;