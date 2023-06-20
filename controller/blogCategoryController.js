const blogCategoryActions = require("../models/blogCategory/blogCategoryActions"),
      blogCategoryController = () => {};


blogCategoryController.createCategory = (req, res, next) =>{
  const category = req.body;

  blogCategoryActions.createCategory(category, (err, data)=>{
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

blogCategoryController.deleteCategory = (req, res, next) => {
  const { id } = req.params;
  
  blogCategoryActions.deleteCategory(id, (err, data)=>{
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

blogCategoryController.updateCategory  = (req, res, next) =>{
  const newCategory = req.body;
  const { id } = req.params;
  
  blogCategoryActions.updateCategory(id, newCategory, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Category Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

blogCategoryController.getAllCategories = (req, res, next) =>{
  
  blogCategoryActions.getAllCategories((err, data)=>{
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


blogCategoryController.getCategory = (req, res, next) =>{
  const { id } = req.params;
  
  blogCategoryActions.getCategory(id, (err, data)=>{
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


blogCategoryController.cleanBlogCategory = (req, res, next) =>{
  res.json("Success!");
};


module.exports = blogCategoryController;