const colorActions = require("../models/color/colorActions"),
      colorController = () => {};


colorController.createColor = (req, res, next) =>{
  const color = req.body;

  colorActions.createColor(color, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Color already exists!",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

colorController.deleteColor = (req, res, next) => {
  const { id } = req.params;
  
  colorActions.deleteColor(id, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Color Not Found, check if the ID is correct",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

colorController.updateColor  = (req, res, next) =>{
  const newColor = req.body;
  const { id } = req.params;
  
  colorActions.updateColor(id, newColor, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Color Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

colorController.getAllColors = (req, res, next) =>{
  
  colorActions.getAllColors((err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Colors Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


colorController.getColor = (req, res, next) =>{
  const { id } = req.params;
  
  colorActions.getColor(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Color Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


colorController.cleanColorState = (req, res, next) =>{
  res.json("Success");
};

module.exports = colorController;