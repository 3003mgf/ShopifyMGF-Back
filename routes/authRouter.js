

const express = require("express"),
      Router = express.Router(),
      userController = require("../controller/userController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication");


//ROUTES SET IN THE ORDER THEY WHERE CREATED
Router
      .post("/register", userController.createUser)
      .post("/login", userController.login)
      .post("/admin-login", userController.adminLogin)
      .get("/all-users", userController.getAllUsers)
      .get("/user", authMiddleware, isAdmin, userController.getSingleUser) //A traves de Query
      .delete("/delete-user/:userName", userController.deleteUser)
      .put("/edit-user", authMiddleware, userController.updateUser)
      .put("/block-user/:userName", authMiddleware, isAdmin, userController.blockUser)
      .put("/unblock-user/:userName", authMiddleware, isAdmin, userController.unblockUser)
      .get("/refresh-token", userController.handleRefreshToken)
      .get("/logout", userController.logout)
      .put("/update-password", authMiddleware, userController.updatePassword)
      .post("/forgot-password", userController.forgotPassword)
      .put("/reset-password/:token", userController.resetPassword)
      .get("/get-wish-list", authMiddleware, userController.getWishList)
      .put("/address", authMiddleware, userController.setAddress)
      .post("/add-cart", authMiddleware, userController.addCart)
      .get("/get-cart", authMiddleware, userController.getCart)
      .delete("/empty-cart", authMiddleware, userController.emptyCart)
      .delete("/delete-cart/:id", authMiddleware, userController.deleteCartItem)
      .put("/update-cart/:id/:quantity", authMiddleware, userController.updateCartItem)
      .post("/create-order", authMiddleware, userController.createOrder)
      .get("/get-orders", authMiddleware, userController.getOrders)
      
      // .put("/apply-coupon", authMiddleware, userController.applyCoupon)
      // .post("/cash-order", authMiddleware, userController.createOrder)
      // .get("/get-all-orders", authMiddleware, isAdmin, userController.getAllOrders)
      // .put("/update-order/:id", authMiddleware, isAdmin, userController.updateOrderStatus)
      // .delete("/delete-order/:orderId", authMiddleware, isAdmin, userController.deleteOrder)



module.exports.router = Router;