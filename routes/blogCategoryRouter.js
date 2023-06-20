const express = require("express"),
      blogCategoryController = require("../controller/blogCategoryController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication"),
      Router = express.Router();

Router
      .post("/create", authMiddleware, isAdmin, blogCategoryController.createCategory)
      .delete("/delete/:id", authMiddleware, isAdmin, blogCategoryController.deleteCategory)
      .put("/update/:id", authMiddleware, isAdmin, blogCategoryController.updateCategory)
      .get("/get-all", blogCategoryController.getAllCategories)
      .get("/get/:id", blogCategoryController.getCategory)
      .get("/clean-blog-state", blogCategoryController.cleanBlogCategory)

module.exports.router = Router;