const prodCategoryActions = require("../models/prodCategory/prodCategoryActions"),
      prodCategoryController = () => {};


prodCategoryController.createCategory = (req, res, next) =>{
  const category = req.body;

  prodCategoryActions.createCategory(category, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Category already exists!",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

prodCategoryController.deleteCategory = (req, res, next) => {
  const { id } = req.params;
  
  prodCategoryActions.deleteCategory(id, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Category Not Found, check if the ID is correct",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

prodCategoryController.updateCategory  = (req, res, next) =>{
  const newCategory = req.body;
  const { id } = req.params;

  prodCategoryActions.updateCategory(id, newCategory, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Category Already Exist",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

prodCategoryController.getAllCategories = (req, res, next) =>{
  
  prodCategoryActions.getAllCategories((err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Categories Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


prodCategoryController.getCategory = (req, res, next) =>{
  const { id } = req.params;
  
  prodCategoryActions.getCategory(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Category Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


prodCategoryController.cleanCategoryState = (req, res, next) =>{
  res.json("Success!");
};


module.exports = prodCategoryController;