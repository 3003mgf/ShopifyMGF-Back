const express = require("express"),
      prodCategoryController = require("../controller/prodCategoryController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication"),
      Router = express.Router();

Router
      .post("/create", authMiddleware, isAdmin, prodCategoryController.createCategory)
      .delete("/delete/:id", authMiddleware, isAdmin, prodCategoryController.deleteCategory)
      .put("/update/:id", authMiddleware, isAdmin, prodCategoryController.updateCategory)
      .get("/get-all", prodCategoryController.getAllCategories)
      .get("/get/:id", prodCategoryController.getCategory)
      .get("/clean-category-state", prodCategoryController.cleanCategoryState)

module.exports.router = Router;