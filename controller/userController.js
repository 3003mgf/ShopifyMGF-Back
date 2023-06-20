
const userActions = require("../models/users/userActions"),
      bcrypt = require("bcrypt"),
      crypto = require("crypto"),
      axios = require("axios"),
      userController = () =>{};



//CREATE NEW USER - REGISTER
userController.createUser = (req, res, next) =>{
let email = req.body.email;

//Encriptamos la PASSWORD
const hash = bcrypt.hashSync(req.body.password, 5); 
req.body.password = hash;
//


userActions.createUser(email, req.body, (err, newUser)=>{
  if(err){
    (()=>{
      let error  = new Error(),
          locals = {
          stack: error.stack,
          message:"User Already Exist"
          };

      error.statusCode = 404;
      return next(locals);
    })();
  }else{
    res.json(newUser);
  }
});
};


//LOGIN
userController.login = (req, res, next) =>{
const {email, password} = req.body;


  userActions.login(email, password, (err, token, refreshToken)=>{
    if(err){
      (()=>{
        let error  = new Error(),
            locals = {
            stack: error.stack,
            message:"User or Password Incorrect"
            };
  
        error.statusCode = 404;
        return next(locals);
      })();
    }else{
      //Guardamos REFRESH TOKEN
      res.cookie("refreshToken", refreshToken, {
        httpOnly:true,
        maxAge: 24*60*60*1000
      });
      res.json({...req.body, token});
    }
  });
};


//LOGOUT
userController.logout = (req, res, next) =>{
  const { refreshToken } = req.cookies;
//2:17 of Video
  userActions.logout(refreshToken, ()=>{
    res.clearCookie("refreshToken");
    
    return res.sendStatus(204);  
  });
  
}

//GET ALL USERS
userController.getAllUsers = (req, res, next) =>{
 userActions.getAllUsers((err, data)=>{
   if(err){
    res.json({message: "No users in the database"})
   }else{
    res.json(data);
   }
 });
};


//GET ONE USER
userController.getSingleUser = (req, res, next) =>{
  let { userName } = req.user;

  userActions.getSingleUser(userName, (err, data)=>{
    if(err){
      (()=>{
        let error  = new Error(),
            locals = {
            stack: error.stack,
            message:"User Not Found"
            };
  
        error.statusCode = 404;
        return next(locals);
      })();
    }else{
      res.json(data);
    }
  });
};


//DELETE USER
userController.deleteUser = (req, res, next) =>{
  let { userName } = req.params;

 userActions.deleteUser(userName, (err, data)=>{
    if(err){
      (()=>{
        let error  = new Error(),
            locals = {
            stack: error.stack,
            message:"User Not Found"
            };
  
        error.statusCode = 404;
        return next(locals);
      })();
    }else{
      res.json(data);
    }
 });
};


//UPDATE USER
userController.updateUser = (req, res, next) =>{
  let { userName } = req.user;

  userActions.updateUser(userName, req.body, (err, data)=>{
    if(err){
      (()=>{
        let error  = new Error(),
            locals = {
            stack: error.stack,
            message: data
            };
  
        error.statusCode = 404;
        return next(locals);
      })();
    }else{
      res.json(data);
    }
  })
};


//BLOCK USER
userController.blockUser = (req, res, next) =>{
  let { userName } = req.params;

  userActions.blockUser(userName, (err)=>{
    if(!err){
      //EXITO
      res.json({message: "User Blocked"});
    }else{
      //USER NOT FOUND
      (()=>{
        let error  = new Error(),
            locals = {
            stack: error.stack,
            message:"User Not Found"
            };
  
        error.statusCode = 404;
        return next(locals);
      })();
    }
  });
};


//UNBLOCK USER
userController.unblockUser = (req, res, next) =>{
  let { userName } = req.params;

  userActions.unblockUser(userName, (err, data)=>{
    if(!err){
      //USER UNBLOCKED
      res.json({message: "User Unblocked"});
    }else{
      //USER NOT FOUND
      (()=>{
        let error  = new Error(),
            locals = {
            stack: error.stack,
            message:"User Not Found"
            };
  
        error.statusCode = 404;
        return next(locals);
      })();
    }
  });
};


//HANDLE REFRESH TOKEN
userController.handleRefreshToken  = (req, res, next) =>{
  const cookie = req.cookies;
  if(!cookie.refreshToken){
    (()=>{
      let error = new Error();
      let locals = {
        message: "No Refresh Token in Cookies",
        stack: error.stack
      };
      return next(locals);
    })();
  }else{
    userActions.handleRefreshToken(cookie.refreshToken, (err, accessToken)=>{
        if(err){
          (()=>{
            let error = new Error();
            let locals = {
              message: "No User matched with the Refresh Token provided",
              stack: error.stack
            };
            return next(locals);
          })();
        }else{
          res.json({accessToken});
        }
    })
  }
};


//UPDATE PASSWORD
userController.updatePassword = (req, res, next) =>{
  const { _id } = req.user;
  let password = req.body.password;

  //Encriptamos la PASSWORD
  const hash = bcrypt.hashSync(password, 5); 
  password = hash;

  userActions.updatePassword(_id, password, req.body.password, (err, errMsg, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: errMsg,
          stack: error.stack
        };
        return next(locals);
      })()
    }else{
      res.json(data);
    };
  });
};

//FORGOT PASSWORD
userController.forgotPassword = (req, res, next) =>{
  const { email } = req.body;

  userActions.forgotPassword(email, (err, errMsg, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: errMsg,
          stack: error.stack
        };
        return next(locals);
      })()
    }else{
      res.json(data);
    }
  });
};



//RESET PASSWORD

userController.resetPassword = (req, res, next) =>{
  let { password } = req.body;
  let { token } = req.params;

  let hash = bcrypt.hashSync(req.body.password, 5);
  password = hash;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  userActions.resetPassword(hashedToken, password, (err, errMsg, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: errMsg,
          stack: error.stack
        };
        return next(locals);
      })()
    }else{
      res.json(data);
    }
  });
};


//ADMIN LOGIN
userController.adminLogin = (req, res, next) =>{
  const {email, password} = req.body;
  
  
    userActions.adminLogin(email, password, (err, token, refreshToken, errMsg)=>{
      if(err){
        (()=>{
          let error  = new Error(),
              locals = {
              stack: error.stack,
              message: errMsg || "User or Password Incorrect"
              };
    
          error.statusCode = 404;
          return next(locals);
        })();
      }else{
        //Guardamos REFRESH TOKEN
        res.cookie("refreshToken", refreshToken, {
          httpOnly:true,
          maxAge: 24*60*60*1000
        });
        res.json({...req.body, token});
      }
    });
  };
  


userController.getWishList = (req, res, next) =>{
  const { _id } = req.user;

  userActions.getWishList(_id, (err, data)=>{
      if(err){
        (()=>{
         let error = new Error()
         let locals = {
            message: "No User Found",
            stack: error.stack
        }
        return next(locals)
        })()
      }else{
        res.json(data);
      }
  });
};

userController.setAddress = (req, res, next) =>{
  const { _id } = req.user;
  const { address } = req.body;

  userActions.setAddress(_id, address, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No User Found, check if the ID is correct",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  })
};


userController.addCart = (req, res, next) =>{
  const { _id } = req.user;
  const { cartData } = req.body;

  userActions.addCart(_id, cartData, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Cart Already Exist",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


userController.getCart = (req, res, next) =>{
  const { _id } = req.user;

  userActions.getCart(_id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Cart Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};


userController.emptyCart = (req, res, next) =>{
  const { _id } = req.user;
  
  userActions.emptyCart(_id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Cart Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  })
};


userController.deleteCartItem = (req, res, next) =>{
  const { id } = req.params;
  
  userActions.deleteCartItem(id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Cart Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  })
};


userController.updateCartItem = (req, res, next) =>{
  const { id, quantity } = req.params;
  
  userActions.updateCartItem(id, quantity, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Cart Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  })
};  


userController.createOrder = async(req, res, next) =>{
  const { _id } = req.user;
  req.body.user = _id;
  
  userActions.createOrder(req.body, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error creating the order',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  })
};



userController.getOrders = async(req, res, next) =>{
  const { _id } = req.user;
  
  userActions.getOrders(_id, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error creating the order',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  })
};



//EXPORT
module.exports = userController;


/*
userController.applyCoupon = (req, res, next) =>{
  const { _id: userId } = req.user;
  const coupon = req.body;

  userActions.applyCoupon(userId, coupon, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Coupon Not Valid",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};

userController.createOrder = (req, res, next) =>{
  const { cod, couponApplied } = req.body;
  //cod meaning CASH ON DELIVERY
  const { _id } = req.user;
  
  userActions.createOrder(_id, cod, couponApplied, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: " No Cart Found, remember 'COD' field is required in 'req.body' ",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json({message: "Order created successfully!"});
  }
  });
};


userController.getOrders = (req, res, next) =>{
  const { _id } = req.user;

  userActions.getOrders(_id, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Orders Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};

userController.getAllOrders = (req, res, next) =>{
  const { _id } = req.user;

  userActions.getAllOrders(_id, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "No Orders Found",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
    });
}

userController.deleteOrder = async(req, res, next) =>{
  
  const { orderId } = req.params;

  userActions.deleteOrder(orderId, (err)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error Deleting the Order',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json("Success");
    }
  })
};


userController.updateOrderStatus = (req, res, next) =>{
  const { status } = req.body;
  const  { id: orderId } = req.params;

  userActions.updateOrderStatus(orderId, status, (err, data )=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Order Not Found",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};
*/