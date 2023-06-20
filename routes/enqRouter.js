const express = require("express"),
      enquiryController = require("../controller/enqController"),
      {authMiddleware, isAdmin} = require("../middlewares/authentication"),
      Router = express.Router();

Router
      .post("/create", authMiddleware, enquiryController.createEnquiry)
      .delete("/delete/:id", authMiddleware, isAdmin, enquiryController.deleteEnquiry)
      .post("/delete-group", authMiddleware, isAdmin, enquiryController.deleteEnquiryGroup)
      .put("/update/:id", authMiddleware, isAdmin, enquiryController.updateEnquiry)
      .get("/get-all", enquiryController.getAllEnquirys)
      .get("/get/:id", enquiryController.getEnquiry)

module.exports.router = Router;