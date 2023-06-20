const express = require("express"),
      Router = express.Router(),
      blogController = require("../controller/blogController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication"),
      uploadClass = require("../middlewares/uploadImages"); //Middleware,  is not the productController uploadImages.



Router
      .post("/create", authMiddleware, isAdmin, blogController.createBlog)
      .put("/update/:id", authMiddleware, isAdmin, blogController.updateBlog)
      .get("/get/:id", authMiddleware, blogController.getBlog)
      .get("/get-all", authMiddleware, blogController.getAllBlogs)
      .delete("/delete/:id", authMiddleware, isAdmin, blogController.deleteBlog)
      .put("/likes", authMiddleware, blogController.likeBlog)
      .put("/dislikes", authMiddleware, blogController.dislikeBlog)
      .post("/upload/images", authMiddleware, isAdmin, uploadClass.uploadBlogsImg.array("images", 10), uploadClass.blogResizeImg, blogController.uploadImages)
      .put("/upload-image/:id", authMiddleware, isAdmin, uploadClass.uploadBlogsImg.array("images", 10), uploadClass.blogResizeImg, blogController.updateBlogImages)
      .get("/clean-blog-state", authMiddleware, isAdmin, blogController.cleanBlogState)
      .delete("/delete-images/:id", authMiddleware, isAdmin, blogController.deleteImages )
      .delete("/delete-blog-images/:blogId/:imgId", authMiddleware, isAdmin, blogController.updateBlogDeleteImage)

module.exports.router = Router;