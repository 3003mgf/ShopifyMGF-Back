const multer = require("multer"),
      sharp = require("sharp"),
      path = require("path"),
      uploadClass = () =>{};




//STORAGE SOLO PARA PRODUCT IMAGES
const multerStorageProducts = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  filename: (req, file, cb)=>{  
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.jpeg`);
  }
});


//STORAGE SOLO PARA BLOG IMAGES
const multerStorageBlogs = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, path.join(__dirname, "../public/images/blogs"));
  },
  filename: (req, file, cb)=>{  
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.jpeg`);
  }
});



//FILTER GENERAL, TANTO PARA BLOG IMAGES COMO PRODUCT IMAGES.
const multerFilter = (req, file, cb) =>{
  if(file.mimetype.startsWith("image")){
    cb(null, true);
  }else{
    cb({message: "Unsopported Type of File"}, false);
  }
};




//PRODUCT IMG UPLOADER
uploadClass.uploadProductsImg = multer({
  storage: multerStorageProducts,
  fileFilter: multerFilter,
  limits: {fileSize: 20000000}
});

//BLOG IMAGES UPLOADER
uploadClass.uploadBlogsImg = multer({
  storage: multerStorageBlogs,
  fileFilter: multerFilter,
  limits: {fileSize: 2000000}
});




uploadClass.productResizeImg = async(req, res, next) =>{
  if(!req.files){
    (()=>{
     let error = new Error()
     let locals = {
        message:"No Files Received",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    let status = false;
    await Promise.all(req.files.map((el) => {
         sharp(el.path)
              .resize(300, 300)
              .toFormat("jpeg")
              .jpeg({quality: 90})
              .toFile(`${__dirname}/../public/images/products/${el.filename}`, ()=> status === true) //IMPORTANTE PONER EL CB Y PONER EL NEXT AFUERA DEL FOR EACH.
              //IMPORTANTE!!
              //Si no ponemos el NEXT en el callback de toFile o en un then() despues de toFile, Sharp nos devolvera error.
      }))
    };
    next(); //IMPORTANTE PONERLO AFUERA
  }

uploadClass.blogResizeImg = async(req, res, next) =>{
  if(!req.files){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Files Received",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    let status = false;
    await Promise.all(req.files.map(async(el) => {
      await sharp(el.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`${__dirname}/../public/images/blogs/${el.filename}`, ()=> status === true);
    }))
  };
  next();
};



module.exports = uploadClass;