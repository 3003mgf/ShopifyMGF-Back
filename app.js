const express = require("express"),
      app = express(),
      logger = require("morgan"),
      dotenv = require("dotenv").config(),
      port = process.env.PORT,
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      errorHandler = require("./middlewares/errorHandler"),
      userRoutes = require("./routes/authRouter.js").router,
      productRoutes = require("./routes/productRouter").router;
      blogRoutes = require("./routes/blogRouter").router,
      prodCategoryRoutes = require("./routes/prodCategoryRouter").router,
      blogCategoryRoutes = require("./routes/blogCategoryRouter").router,
      brandRoutes = require("./routes/brandRouter").router,
      couponRoutes = require("./routes/couponRouter").router,
      colorRoutes = require("./routes/colorRouter").router,
      enqRoutes = require("./routes/enqRouter").router,
      dbConnect = require("./config/dbConnect"),
      cors = require("cors");


dbConnect();

app
    .set("port", port)

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(cookieParser()) //En LOGIN
    .use(logger("dev"))

    .use(cors({
        origin: "https://shopify-mgf.netlify.app", credentials:true
    })) //Para evitar CORS Policies
   
    // .use((req, res, next)=>{
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Credentials', 'true');
    //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    //     next();
    // })

    .use("/api/user", userRoutes)
    .use("/api/product", productRoutes)
    .use("/api/blog", blogRoutes)
    .use("/api/prod-category", prodCategoryRoutes)
    .use("/api/blog-category", blogCategoryRoutes)
    .use("/api/brand", brandRoutes)
    .use("/api/coupon", couponRoutes)
    .use("/api/color", colorRoutes)
    .use("/api/enquiry", enqRoutes)
    .use(errorHandler)



module.exports = app;