const productsActions = require("../models/products/productActions"),
      productsController = () => {},
      fs = require("fs"),
      connection = require("../models/products/productsConnection"),
      slugify = require("slugify"), //PARA CREAR UN SLUG
      {cloudinaryUploadImg, cloudinaryDeleteImg} = require("../utils/cloudinary");


//CREATE PRODUCT
productsController.createProduct = async(req, res, next) =>{
  const product = req.body;
  req.body.slug = slugify(req.body.title);

  productsActions.createProduct(product, (err, data)=>{
    if(err){
        (()=>{
          let error = new Error();
          let locals = {
            message: "Product 'slug' already exists",
            stack: error.stack
          };
          return next(locals);
        })()
    }else{
      res.json(data);
    }
  });
};

//GET ONE PRODUCT
productsController.getOneProduct = (req, res, next) =>{
  const { id } = req.params;
 
  productsActions.getOneProduct(id, (err, product)=>{
    if(err){
      (()=>{
        let error = new Error();
        let locals = {
          message: "Product ID not Found",
          stack: error.stack
        };
        return next(locals);
      })()
    }else{
      res.json(product)
    }
  });
};

//GET ALL
productsController.getAll = async(req, res, next)  =>{
  //FILTERING
  //#01 on Notes
  try{
    const queryObj = {...req.query};
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]); 
  
    let queryString = JSON.stringify(queryObj);
    let queryStringModified = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (match)=> `$${match}`);
    
    let query = connection.find(JSON.parse(queryStringModified));
    

    //SORTING
    if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }else{
      query = query.sort("-createdAt");
    }
    
    //FIELDS
    if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }else{
      query = query.select("-__v"); //Sacamos el field __v de la respuesta
    };


    //PAGINATION
    let page = req.query.page;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if(req.query.page){
      //Si recibimos un page=4&limit=2, en la pagina 4 ya no vamos a tener productos, asi que va a devolver un error.
      const productCount = await connection.countDocuments();
      if(skip >= productCount) throw new Error("This page doesn't exist");
    };
    

    //ACTION
    const product = await query;

    //Si ningun producto matchea los filtros...
    if(!product.length) throw new Error("No Product Found");

    res.json(product);

  }catch(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: err.message,
        stack: error.stack
      };
      return next(locals);
    })()
  }

};

//UPDATE PRODUCT
productsController.updateProduct = async(req, res, next) =>{

    req.body.slug = slugify(req.body.title);
    const {id} = req.params;

    productsActions.updateProduct(id, req.body, (err, data)=>{
      if(err){
        (()=>{
         let error = new Error()
         let locals = {
            message:"No Product matched the ID",
            stack: error.stack
          };
          return next(locals);
        })()
      }else{
        res.json(data);
      }
    });
};

//DELETE PRODUCT
productsController.deleteProduct = (req, res, next) =>{
  const { id } = req.params;

  productsActions.deleteProduct(id, (err, data)=>{
    if(err){
      (()=>{
        let error = new Error()
        let locals = {
           message:"No Product matched the Id",
           stack: error.stack
         };
         return next(locals);
       })()
    }else{
      res.json(data);
    }
  });
}

//ADD TO WISHLIST
productsController.addToWishList = (req, res, next) =>{
  const user = req.user; //Lo obtenemos de AuthMiddleware
  const { prodId } = req.body;
  
  productsActions.addToWishList(user, prodId, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Item is already on the list",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};

//REMOVE FROM WISHLIST
productsController.removeFromWishList = (req, res, next) =>{
  const user = req.user; //Lo obtenemos de AuthMiddleware
  const { prodId } = req.params;
  
  productsActions.removeFromWishList(user, prodId, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "Item is already on the list",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data)
  }
  });
};



//RATING
productsController.rating = (req, res, next) =>{
  const { star, prodId, comment } =  req.body;
  const  {_id: userId}  = req.user;

  productsActions.rating(userId, prodId, star, comment, (err, data)=>{
  if(err){
    (()=>{
     let error = new Error()
     let locals = {
        message: "No Product Found, check the ID",
        stack: error.stack
    }
    return next(locals)
    })()
  }else{
    res.json(data);
  }
  });
};



// DELETE PRODUCT IMAGE
productsController.updateProductDeleteImage = async(req, res, next) =>{
  const { prodId, imgId } = req.params;
  
  const deleted = await cloudinaryDeleteImg(imgId, "images");
  
  productsActions.updateProductDeleteImage(prodId, imgId, (err)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json("Success!");
    }
  })
};


// UPLOAD IMAGES TO CLOUDINARY
productsController.uploadImages = async(req, res, next) =>{
  try{
   
    const uploader = (path) => cloudinaryUploadImg(path, "images");
      let urls = [];
      const files = req.files;
      for(const file of files){
        const {path} = file;
        const newPath = await uploader(path); //Subimos archivos a nuestra cloud en cloudinary
        urls.push(newPath);
        fs.unlinkSync(path); //Esto tambien podria estar dentro del forEach de sharp. Hora 7:16 del video
      };
      
      const images = urls.map(file =>{
        return file;
      });
      
      res.json(images);

  }catch(error){
    (()=>{
     let error = new Error()
     let locals = {
        message:'Error Uploading Images',
        stack: error.stack
    }
    return next(locals)
    })()
  }
}


// DELETE IMAGE FROM CLOUDINARY
productsController.deleteImageCloudinary = async(req, res, next) =>{
  const { id } = req.params;
  try{
    const deleted = await cloudinaryDeleteImg(id, "images");
    res.json({message: "Deleted"});
  }catch(error){
    (()=>{
     let error = new Error()
     let locals = {
        message:'Error Deleting Image',
        stack: error.stack
    }
    return next(locals)
    })()
  }
}


productsController.createReview = (req, res, next) =>{
  const { _id } = req.user;
  console.log(_id);
  const { prodId } = req.params;

  req.body.postedBy = _id;


  productsActions.createReview(_id, prodId, req.body, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error creating review',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  })
};


productsController.getAllSizes = (req, res, next) =>{
  
  productsActions.getAllSizes((err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error creating review',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  })
};


productsController.addSize = (req, res, next) =>{
  const size = req.body;

  productsActions.addSize(size, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message:'Error creating size',
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  })
};


// CLEAN IMAGES STATE ON ADMIN REDUCER
productsController.cleanImageState = (req, res, next)=>{
  res.json("Cleaned!");
};


// CLEAN PRODUCT STATE
productsController.cleanProductState = (req, res, next) =>{
  res.json("Success!");
}


module.exports = productsController;