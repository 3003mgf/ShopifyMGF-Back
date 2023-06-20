const express = require("express"),
      brandController = require("../controller/brandController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication"),
      Router = express.Router();

Router
      .post("/create", authMiddleware, isAdmin, brandController.createBrand)
      .delete("/delete/:id", authMiddleware, isAdmin, brandController.deleteBrand)
      .put("/update/:id", authMiddleware, isAdmin, brandController.updateBrand)
      .get("/get-all", brandController.getAllBrands)
      .get("/get/:id", brandController.getBrand)
      .get("/clean-brand-state", authMiddleware, isAdmin, brandController.cleanBrandState)

module.exports.router = Router;