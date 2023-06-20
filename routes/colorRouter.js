const express = require("express"),
      colorController = require("../controller/colorController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication"),
      Router = express.Router();

Router
      .post("/create", authMiddleware, isAdmin, colorController.createColor)
      .delete("/delete/:id", authMiddleware, isAdmin, colorController.deleteColor)
      .put("/update/:id", authMiddleware, isAdmin, colorController.updateColor)
      .get("/get-all", colorController.getAllColors)
      .get("/get/:id", colorController.getColor)
      .get("/clean-color-state", authMiddleware, isAdmin, colorController.cleanColorState)
module.exports.router = Router;