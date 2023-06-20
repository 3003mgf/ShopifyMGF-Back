const couponActions = require("../models/coupon/couponActions"),
      couponController = () =>{};

couponController.createCoupon = (req, res, next) =>{
  const coupon = req.body;
  
  couponActions.createCoupon(coupon, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Coupon Already Exists!",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


couponController.getCoupon = (req, res, next) =>{
  const { id } = req.params;

  couponActions.getCoupon(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Coupon Not Found, check the ID",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


couponController.getAllCoupons = (req, res, next) =>{
  couponActions.getAllCoupons((err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Coupons Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


couponController.updateCoupon = (req, res, next) =>{
  const { id } = req.params;
  const newCoupon = req.body;

  couponActions.updateCoupon(id, newCoupon, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Error Updating the Coupon. Remember that 'Name' field is unique and must be in Uppercase. If this is not the problem check if the ID is valid or if the coupon exists in the DataBase.",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  })
};

couponController.deleteCoupon = (req, res, next) =>{
  const { id } = req.params;

  couponActions.deleteCoupon(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Coupon Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

module.exports = couponController;