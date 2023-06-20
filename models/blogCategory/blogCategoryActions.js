const blogCategoryConnection = require("./blogCategoryConnection"),
      blogCategoryActions = () => {};


blogCategoryActions.createCategory = async(category, cb) =>{
  try{
    
    const newCategory = await blogCategoryConnection.create(category);
    cb(false, category);

  }catch(err){
    cb(true)
  }
};


blogCategoryActions.deleteCategory = async(id, cb) =>{
  try{
    const findAndDelete = await blogCategoryConnection.findByIdAndDelete(id);
    cb(false, findAndDelete);
  }catch(err){
    cb(true);
  }
};


blogCategoryActions.updateCategory = async(id, data, cb) =>{
  try{
    const updateCategory = await blogCategoryConnection.findByIdAndUpdate(id, data)
    updateCategory.title = data.title;

    cb(false, updateCategory);
  }catch(err){
    cb(true);
  }
};


blogCategoryActions.getAllCategories = async(cb) =>{
  try{
    const getAll = await blogCategoryConnection.find();
    if(!getAll.length) throw new Error("Empty");
    cb(false, getAll);
  }catch(err){
    cb(true);
  }
};

blogCategoryActions.getCategory = async(id, cb) =>{
  try{
    const findCategory = await blogCategoryConnection.findById(id);
    cb(false, findCategory);
  }catch(err){
    cb(true);
  }
};

module.exports = blogCategoryActions;
