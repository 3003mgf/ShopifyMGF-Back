const enquiryActions = require("../models/enq/enqActions"),
      enquiryController = () => {};


enquiryController.createEnquiry = (req, res, next) =>{
  // console.log(req.body);

  enquiryActions.createEnquiry(req.body, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Enquiry already exists!",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

enquiryController.deleteEnquiry = (req, res, next) => {
  const { id } = req.params;
  
  enquiryActions.deleteEnquiry(id, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Enquiry Not Found, check if the ID is correct",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

enquiryController.deleteEnquiryGroup = (req, res, next) =>{

  enquiryActions.deleteEnquiryGroup(req.body, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error Deleting Enquiries Group',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  })
};

enquiryController.updateEnquiry  = (req, res, next) =>{
  const newEnquiry = req.body;
  const { id } = req.params;
  
  enquiryActions.updateEnquiry(id, newEnquiry, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Enquiry Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

enquiryController.getAllEnquirys = (req, res, next) =>{
  
  enquiryActions.getAllEnquirys((err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Enquirys Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


enquiryController.getEnquiry = (req, res, next) =>{
  const { id } = req.params;
  
  enquiryActions.getEnquiry(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Enquiry Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};

module.exports = enquiryController;