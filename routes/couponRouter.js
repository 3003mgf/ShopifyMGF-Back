const express = require("express"),
      Router = express.Router(),
      { authMiddleware, isAdmin } = require("../middlewares/authentication"),
      couponController = require("../controller/couponController");

Router
      .post("/create", authMiddleware, isAdmin, couponController.createCoupon)
      .get("/get/:id", authMiddleware, isAdmin, couponController.getCoupon)
      .get("/get-all", authMiddleware, isAdmin, couponController.getAllCoupons)
      .put("/update/:id", authMiddleware, isAdmin, couponController.updateCoupon)
      .delete("/delete/:id", authMiddleware, isAdmin, couponController.deleteCoupon)

module.exports.router = Router;