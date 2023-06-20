const couponConnection = require("./couponConnection"),
      couponActions = () => {};


couponActions.createCoupon = async(coupon, cb) =>{
  try{
    const newCoupon = await couponConnection.create(coupon);
    
    cb(false, newCoupon);
  }catch(err){
    cb(true);
  }
};


couponActions.getCoupon = async(id, cb) =>{
  try{
    const findCoupon = await couponConnection.findById(id);
    cb(false, findCoupon);
  }catch(err){
    cb(true);
  }
};


couponActions.getAllCoupons = async(cb) => {
  const getCoupons = await couponConnection.find();
  if(getCoupons.length){
    cb(false, getCoupons);
  }else{
    cb(true);
  }
};


couponActions.updateCoupon = async(id, newCoupon, cb) =>{
  
  try{
    const updateCoupon = await couponConnection.findByIdAndUpdate(id, newCoupon);
    
    //Si no hacemos esto, obtendremos el estado del coupon antes de ser modificado.
    updateCoupon.name = newCoupon.name || updateCoupon.name;
    updateCoupon.expire = newCoupon.expire || updateCoupon.expire;
    updateCoupon.discount = newCoupon.discount || updateCoupon.discount;

    cb(false, updateCoupon);
  }catch(err){
    cb(true)
  }
};

couponActions.deleteCoupon = async(id, cb) =>{
  try{
    const deleteCoupon = await couponConnection.findByIdAndDelete(id);
    cb(false, deleteCoupon);
  }catch(err){
    cb(true);
  }
};

module.exports = couponActions;