const productsController = require("../controller/productController");

const express = require("express"),
      Router = express.Router(),
      productController = require("../controller/productController"),
      { authMiddleware, isAdmin } = require("../middlewares/authentication"),
      uploadClass = require("../middlewares/uploadImages"); //Middleware,  is not the productController uploadImages.
      


Router
      .post("/create", authMiddleware, isAdmin, productsController.createProduct)
      .get("/get/:id", productsController.getOneProduct)
      .get("/get-all", productsController.getAll)
      .put("/update/:id", authMiddleware, isAdmin, productsController.updateProduct)
      .delete("/delete/:id", authMiddleware, isAdmin, productsController.deleteProduct)
      .delete("/remove-from-wishlist/:prodId", authMiddleware, productsController.removeFromWishList)
      .put("/add-to-wishlist", authMiddleware, productController.addToWishList)
      .put("/rating", authMiddleware, productController.rating)
      .post("/upload/images", authMiddleware, isAdmin, uploadClass.uploadProductsImg.array("images", 10), uploadClass.productResizeImg, productsController.uploadImages)
      .post("/create-review/:prodId", authMiddleware, productsController.createReview)
      .get("/clean-image-state", authMiddleware, isAdmin, productsController.cleanImageState)
      .get("/clean-product-state", authMiddleware, isAdmin, productsController.cleanProductState)
      .delete("/delete-image/:id", authMiddleware, isAdmin, productsController.deleteImageCloudinary)
      .delete("/delete-product-image/:prodId/:imgId", authMiddleware, isAdmin, productsController.updateProductDeleteImage)
      .get("/get-all-sizes", productsController.getAllSizes)
      .post("/add-size", authMiddleware, isAdmin, productsController.addSize)


module.exports.router = Router;


