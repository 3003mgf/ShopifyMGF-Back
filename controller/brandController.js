const brandActions = require("../models/brand/brandActions"),
      brandController = () => {};


brandController.createBrand = (req, res, next) =>{
  const brand = req.body;

  brandActions.createBrand(brand, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Brand already exists!",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

brandController.deleteBrand = (req, res, next) => {
  const { id } = req.params;
  
  brandActions.deleteBrand(id, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Brand Not Found, check if the ID is correct",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

brandController.updateBrand  = (req, res, next) =>{
  const newBrand = req.body;
  const { id } = req.params;
  
  brandActions.updateBrand(id, newBrand, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Brand Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

brandController.getAllBrands = (req, res, next) =>{
  
  brandActions.getAllBrands((err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Brands Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


brandController.getBrand = (req, res, next) =>{
  const { id } = req.params;
  
  brandActions.getBrand(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Brand Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


// ADMIN REDUX STATE
brandController.cleanBrandState = (req, res, next)=>{
  res.json("Success");
}

module.exports = brandController;