const sizeConnection = require("./sizeConnection"),
      sizeActions = () => {};


sizeActions.createSize = async(size, cb) =>{
  try{
    
    const newSize = await sizeConnection.create(size);
    cb(false, size);

  }catch(err){
    cb(true)
  }
};
