const brandConnection = require("./brandConnection"),
      brandActions = () => {};


brandActions.createBrand = async(brand, cb) =>{
  try{
    
    const newBrand = await brandConnection.create(brand);
    cb(false, brand);

  }catch(err){
    cb(true)
  }
};


brandActions.deleteBrand = async(id, cb) =>{
  try{
    const findAndDelete = await brandConnection.findByIdAndDelete(id);
    cb(false, findAndDelete);
  }catch(err){
    cb(true);
  }
};


brandActions.updateBrand = async(id, data, cb) =>{
  try{
    const updateBrand = await brandConnection.findByIdAndUpdate(id, data)
    updateBrand.title = data.title;

    cb(false, updateBrand);
  }catch(err){
    cb(true);
  }
};


brandActions.getAllBrands = async(cb) =>{
  try{
    const getAll = await brandConnection.find();
    if(!getAll.length) throw new Error("Empty");
    cb(false, getAll);
  }catch(err){
    cb(true);
  }
};

brandActions.getBrand = async(id, cb) =>{
  try{
    const findBrand = await brandConnection.findById(id);
    cb(false, findBrand);
  }catch(err){
    cb(true);
  }
};

module.exports = brandActions;
