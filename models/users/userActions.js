const sendMail = require("../../middlewares/emailCtrl");

const connection = require("./connection"),
      cartConnection = require("../cart/cartConnection"),
      prodConnection = require("../products/productsConnection"),
      couponConnection = require("../coupon/couponConnection"),
      orderConnection = require("../../models/order/orderConnection"),
      bcrypt = require("bcrypt"),
      uniqid = require("uniqid"),
      jwt = require("jsonwebtoken"),
      generateToken = require("../../config/jwtToken"),
      generateRefreshToken = require("../../config/refreshToken"),
      createPasswordResetToken = require("../../utils/createPasswordResetToken"),
      userActions = () =>{};


//CREATE USER
userActions.createUser = (email, user, cb) =>{
  connection
            .count({email: email})
            .then(res => {
              if(res === 0){
                //Create New User
                connection
                          .create(user)
                          .then((res) => cb(false, res))
              }else{
                //User Already Exists
                cb(true);
              }
            })
};


//LOGIN
userActions.login = async(email, password, cb) =>{
  
  let findUser = await connection.findOne({email});
  if(findUser && await bcrypt.compare(password, findUser.password)){ //Parsea la contraseña que recibe como parametro a formato hash bcrypt, y la compara con el de findUser. 
    let token = generateToken(findUser.email);

    //REFRESH TOKEN
    let refreshToken = await generateRefreshToken(findUser.email);
    const update = await connection.findOneAndUpdate({email}, {refreshToken});
    
    cb(false, token, refreshToken);
  }else{
    cb(true);
  };

};


//ADMIN LOGIN
userActions.adminLogin = async(email, password, cb) =>{
  try{
    let findAdmin = await connection.findOne({email});
    if(findAdmin.role !== "admin") throw new Error("Not Authorized");
  
    if(findAdmin && await bcrypt.compare(password, findAdmin.password)){ //Parsea la contraseña que recibe como parametro a formato hash bcrypt, y la compara con el de findUser. 
      let token = generateToken(findAdmin.email);
  
      //REFRESH TOKEN
      let refreshToken = await generateRefreshToken(findAdmin.email);
      const update = await connection.findOneAndUpdate({email}, {refreshToken});
      
      cb(false, token, refreshToken);
    }else{
      cb(true, null, null, null);
    };

  }catch(err){
    cb(true, null, null, "You are not authorized")
  }

};


//LOGOUT
userActions.logout = async(refreshToken, cb) =>{
  const user = await connection.findOne({refreshToken});
  connection
        .findOneAndUpdate({refreshToken}, {
            refreshToken: ""
          })
        .then(()=> cb(false));
  
};

//GET ALL USERS
userActions.getAllUsers = async(cb) =>{
let getUsers = await connection.find();
if(getUsers.length > 1){ //Antes estaba solo el .length, sin la comparativa.
  cb(false, getUsers);
}else{
  cb(true);
}
};


//GET ONE USER
userActions.getSingleUser = (userName, cb) =>{
connection
          .findOne({userName})
          .then(res => {
            if(res !== null){
               cb(false, res);
            }else{
               cb(true);
            }
          })

};


//DELETE USER
userActions.deleteUser = (userName, cb) =>{
  connection
            .count({userName})
            .then(res => {
              if(res === 0){
                cb(true);
              }else{
                connection
                        .findOneAndDelete({userName})
                        .then(obj => cb(false, obj));
              }
            })
};


//UPDATE USER
userActions.updateUser = async(userName, data, cb) =>{
  let errorObject = {};

  const countEmail = await connection.count({userName: {$ne : userName}, email: data.email});
  const countMobile = await connection.count({userName: {$ne : userName}, mobile: data.mobile});
  
  if(countEmail === 0 && countMobile === 0){
    const updateUser = await connection.findOneAndUpdate({userName}, data);
    
    return cb(false, "Success");
  };

  if(countEmail > 0){
    errorObject.email = "This Email already in use";
  };
  if(countMobile > 0){
    errorObject.mobile = "This Mobile is already in use";
  };
  if(Object.keys(errorObject).length > 0){
    return cb(false, JSON.stringify(errorObject));
  }

};


//BLOCK USER
userActions.blockUser = (userName, cb) =>{
  connection
          .findOneAndUpdate({userName}, {
            isBlocked: true
          })
          .then(res => {
            if(res){
              cb(false);
            }else{
              cb(true);
            }
          })
};


//UNBLOCK USER
userActions.unblockUser = (userName, cb) =>{
  connection
          .findOneAndUpdate({userName}, {
            isBlocked: false
          })
          .then(res => {
            if(res){
              cb(false, res);
            }else{
              cb(true);
            }
          })
}


//HANDLE REFRESH TOKEN
userActions.handleRefreshToken = async(refreshToken, cb) =>{
  const user = await connection.findOne({ refreshToken });
  if(user){
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, res)=>{ 
      if(err || res.email !== user.email){
        (()=>{
          let error = new Error();
          let locals = {
            message: "Refresh Token not valid",
            stack: error.stack
          };
          return next(locals);
        })()
      }else{
        const accessToken = generateToken(user.email);
        cb(false, accessToken);
      };
    }) 

  }else{
    cb(true);
  }
};


//UPDATE PASSWORD
userActions.updatePassword = async(id, codedPassword, decodedPassword, cb) => {
  try{
    const findUser = await connection.findById(id);
    if(await bcrypt.compare(decodedPassword, findUser.password)){
      throw new Error("Can't use your old password");
    }else{
      const updateUser = await connection.findByIdAndUpdate(id, {password: codedPassword, passwordChangedAt: Date.now()});
      
      updateUser.password = codedPassword;
      updateUser.passwordChangedAt = Date.now();

      cb(false, "", updateUser) //Ponemos "" porque el controller recibe 3 parametros en el cb.
    }
  }catch(err){
    err.message = err.message === "Can't use your old password" ? err.message : "ID not valid";
    cb(true, err.message);
  }
};


//FORGOT PASSWORD
userActions.forgotPassword = async(email, cb) => {
  const findUser = await connection.findOne({email});
  try{
    if(!findUser) throw new Error("User Not Found");

    let { resetToken: token, user } = await createPasswordResetToken(findUser);

    const updateUser = await connection.findOneAndUpdate({email}, user);

    const resetURL = `
    <h3>Shopify Support</h3>
    <p>Please follow this link to reset your password. This link is valid only for 10 minutes.</p> 
    <a href="http://localhost:3000/reset-password/${token}">Click Here<a>`
    
    let data = {
      to: user.email,
      text: `Hey ${user.userName}`,
      subject: `Hey ${user.userName}! Forgot your Password?`,
      htm: resetURL
    };

    sendMail(data);
    cb(false, "", token);


  }catch(err){
    cb(true, err.message);
  }
};


//RESET PASSWORD
userActions.resetPassword = async(hashedToken, password, cb) =>{
  try{
    const findUser = await connection.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {$gt: Date.now()} //Porque expira en 10 minutos, si o si deberia ser mayor.
    });
    if(!findUser) throw new Error("Token Expired");
    
    findUser.password = password;
    findUser.passwordChangedAt = Date.now();
    findUser.passwordResetToken = undefined;
    findUser.passwordResetExpires = undefined;

    let updatedUser = await connection.findOneAndUpdate({email: findUser.email}, findUser);
    
    cb(false, "", findUser)
  }catch(err){
    cb(true, err.message)
  }
};


//GET WISHLIST
userActions.getWishList = async(userId, cb) =>{
  try{
    const getUser = await connection.findById(userId).populate("wishList");
  
    cb(false, getUser);
  }catch(err){

    cb(true);
  }
};


userActions.setAddress = async(userId, address, cb) =>{
  try{
    const updateUser = await connection.findByIdAndUpdate(userId, {
      address
    },
    {
      new: true
    });
    updateUser.address = address;
    cb(false, updateUser);
  }catch(err){
    cb(true);
  }
};


userActions.addCart = async(id, cartData, cb) =>{
  try{
    const createCart = await cartConnection.create({
      userId: id,
      productId: cartData.productId,
      color: cartData.color,
      size: cartData.size,
      quantity: cartData.quantity
    });

    cb(false, createCart);
  }catch(err){
    cb(true);
  }

};


userActions.getCart = async(id, cb) =>{
  try{
    const getCart = await cartConnection.find({userId: id}).populate("productId");
    cb(false, getCart);
  }catch(err){
    cb(true);
  }
};


userActions.emptyCart = async(id, cb) =>{
  try{
    const emptyCart = await cartConnection.deleteMany({userId: id});
    cb(false, emptyCart);
  }catch(err){
    cb(true);
  }
};


userActions.deleteCartItem = async(id, cb) =>{
  try{
    const deletedItem = await cartConnection.findByIdAndDelete({_id: id});
    cb(false, deletedItem);
  }catch(err){
    cb(true);
  }
};


userActions.updateCartItem = async(id, quantity, cb) =>{
  try{
    const findProduct = await cartConnection.findById(id);

    const updatedItem = await cartConnection.findByIdAndUpdate(id, {
      quantity: parseInt(quantity)
    });

    cb(false, findProduct);
  }catch(err){
    cb(true);
  }
};

userActions.createOrder = async(newOrder, cb) =>{
  try{
    
    const createOrder = await orderConnection.create(newOrder);

    cb(false, "Success");
  }catch(error){
    console.log(error);
    cb(true);
  }
};


userActions.getOrders = async(userId, cb) =>{
  try{
    
    const getOrders = await orderConnection.find({user: userId}).populate("orderItems.product");

    cb(false, getOrders);
  }catch(error){
    console.log(error);
    cb(true);
  }
};


//EXPORT
module.exports = userActions;


/*
userActions.applyCoupon = async(userId, coupon, cb) =>{
  try{
    const validCoupon = await couponConnection.findOne({name: coupon.name});
    if(!validCoupon) throw new Error();

    //Entered Coupon Expire Date in MS
    let couponDate = new Date(validCoupon.expire).getTime();
    
    //If expired...
    if(new Date().getTime() >= couponDate) throw new Error();

    const discount = validCoupon.discount;

    const getCart = await cartConnection.findOne({orderedBy: userId});


    let totalAfterDiscount = getCart.cartTotal - ((getCart.cartTotal * discount) / 100).toFixed(2);

    const updateCart = await cartConnection.findByIdAndUpdate(getCart._id, {
      totalAfterDiscount
    },
    {
      new: true
    });

    getCart.totalAfterDiscount = totalAfterDiscount;
    
    cb(false, getCart);
  }catch(err){
    cb(true);
  }
};


userActions.createOrder = async(userId, cod, couponApplied, cb) =>{
  try{
    if(!cod) throw new Error("Create cash order failed");

    const getUser = await connection.findById(userId);
    let userCart = await cartConnection.findOne({orderedBy: userId});

    let finalAmount = 0;

    if(couponApplied && userCart.totalAfterDiscount){
      finalAmount = userCart.totalAfterDiscount;
    }else{
      finalAmount = userCart.cartTotal;
    };

    const createOrder = await orderConnection.create({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "cod",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd"
      },
      orderedBy: userId,
      orderStatus: "Cash on Delivery"
    });

    const cleanCart = await cartConnection.findOneAndDelete({orderedBy: userId});

    //Modificamos QUANTITY y SOLD de los productos que vendemos (PRODUCTS collection)
    let update = userCart.products.map(el => {
      return {
        updateOne: { //Edita los documentos cuyo _id coincida con el el.products._id
          filter: {_id: el.product._id}, //filtra
          update: { $inc: { quantity: -el.count, sold: +el.count } } //Restamos quantity y sumamos sold (products collection), porque estariamos vendiendo productos.
        }
      };
    })

    const updated = await prodConnection.bulkWrite(update, {});
    cb(false)
  }catch(err){
    cb(true);
  }
};


userActions.getOrders = async(userId, cb) =>{
  try{
    const getOrders = await orderConnection.find({orderedBy: userId}).populate("products.product").populate('orderedBy');
    cb(false, getOrders);
  }catch(err){
    cb(true);
  }
};

userActions.getAllOrders = async(userId, cb) =>{
  try{
    const getOrders = await orderConnection.find().populate("products.product").populate('orderedBy');
    cb(false, getOrders);
  }catch(err){
    cb(true);
  }
};


userActions.deleteOrder = async(orderId, cb) =>{
  try{
    const deleteOrder = await orderConnection.findByIdAndDelete(orderId);
    cb(false);
  }catch(err){
    cb(true);
  }
};


userActions.updateOrderStatus = async(orderId, status, cb) =>{
  try{
    const updateOrder = await orderConnection.findByIdAndUpdate(orderId, {
      orderStatus: status,
      paymentIntent: {
        status: status
      }
    },
    {
      new: true
    });

    updateOrder.orderStatus = status;

    cb(false, updateOrder);
  }catch(err){
    cb(true);
  }
};
*/