const prodCategoryConnection = require("./prodCategoryConnection"),
      prodCategoryActions = () => {};


prodCategoryActions.createCategory = async(category, cb) =>{
  try{
    
    const newCategory = await prodCategoryConnection.create(category);
    cb(false, newCategory);

  }catch(err){
    cb(true)
  }
};


prodCategoryActions.deleteCategory = async(id, cb) =>{
  try{
    const findAndDelete = await prodCategoryConnection.findByIdAndDelete(id);
    cb(false, findAndDelete);
  }catch(err){
    cb(true);
  }
};


prodCategoryActions.updateCategory = async(id, data, cb) =>{
  try{
    const updateCategory = await prodCategoryConnection.findByIdAndUpdate(id, data)
    updateCategory.title = data.title;
  
    cb(false, updateCategory);
  }catch(err){
    cb(true);
  }
};


prodCategoryActions.getAllCategories = async(cb) =>{
  try{
    const getAll = await prodCategoryConnection.find();
    if(!getAll.length) throw new Error("Empty");
    cb(false, getAll);
  }catch(err){
    cb(true);
  }
};

prodCategoryActions.getCategory = async(id, cb) =>{
  try{
    const findCategory = await prodCategoryConnection.findById(id);
    cb(false, findCategory);
  }catch(err){
    cb(true);
  }
};

module.exports = prodCategoryActions;
