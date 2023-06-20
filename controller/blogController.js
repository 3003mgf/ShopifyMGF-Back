const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");

const blogActions = require("../models/blog/blogActions"), 
       blogController = () => {},
       fs = require("fs"),
       blogConnection = require("../models/blog/blogConnection"),
       validateMongoId = require("../utils/validateMongoDbId");

blogController.createBlog = (req, res, next) =>{
  const blog = req.body;

  blogActions.createBlog(blog, (err)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Blog already exists! Remember 'Title' field is unique",
          stack: error.stack
        };
        return next(locals);
      })()
    }else{
      res.json({
        status:"Success!",
        blog
      });
    }
  });
};


blogController.updateBlog = async(req, res, next)=>{
  const {id} = req.params;
  const blog = req.body;


    blogActions.updateBlog(id, blog, (err, data)=>{
          if(err){
            (()=>{
             let error = new Error()
             let locals = {
                message: "Something went wrong updating the blog",
                stack: error.stack
            }
            return next(locals)
            })()
          }else{
            res.json(data)
          }
    });

  
};
 
blogController.getBlog = async(req, res, next) => {
  const {id} = req.params;

    blogActions.getBlog(id, (err, data)=>{
      if(err){
        (()=>{
         let error = new Error()
         let locals = {
            message: "Blog Not Found",
            stack: error.stack
        }
        return next(locals)
        })()
      }else{
        res.json(data);
      }
    });

};

blogController.getAllBlogs = async(req, res, next) => {
  
  try{
    const queryObj = {...req.query};
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]); 
  
    let queryString = JSON.stringify(queryObj);
    let queryStringModified = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (match)=> `$${match}`);
    
    let query = blogConnection.find(JSON.parse(queryStringModified));
    

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


blogController.deleteBlog  = (req, res, next) => {
  const { id } = req.params;

  blogActions.deleteBlog(id, (err)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Blog Not Found",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json({message: "Deleted Successfully!"});
    }
  });
};


blogController.likeBlog = (req, res, next) =>{
  const { blogId } = req.body;
  const userId = req.user._id;
  console.log(blogId, userId);

  blogActions.likeBlog(blogId, userId, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Blog Not Found",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};


blogController.dislikeBlog = (req, res, next) =>{
  const { blogId } = req.body;
  const userId = req.user._id;
  

  blogActions.dislikeBlog(blogId, userId, (err, data)=>{
    if(err){
      (()=>{
       let error = new Error()
       let locals = {
          message: "Blog Not Found",
          stack: error.stack
      }
      return next(locals)
      })()
    }else{
      res.json(data);
    }
  });
};

//UPDATE BLOG IMAGES
blogController.updateBlogImages = async(req, res, next) =>{
  const { id } = req.params;
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  let urls = [];
  const files = req.files;
  for(const file of files){
    const {path} = file;
    const newPath = await uploader(path); //Subimos archivos a nuestra cloud en cloudinary
    urls.push(newPath);
    fs.unlinkSync(path); //Con esto no se transfieren los archivos a la carpeta public.
  };

    blogActions.updateBlogImages(id, urls, (err, data)=>{
      if(err){
        (()=>{
         let error = new Error()
         let locals = {
            message: "Blog Not Found",
            stack: error.stack
        }
        return next(locals)
        })()
      }else{
        res.json(data);
      }
    })

};

// UPLOAD BLOG IMAGES TO CLOUDINARY
blogController.uploadImages = async(req, res, next) =>{
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
    console.log(error);
  }
}


// DELETE FROM CLOUDINARY
blogController.deleteImages = async(req, res, next)=>{
  const { id } = req.params;
  try{
    const deleted = cloudinaryDeleteImg(id, "images");
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

// DELETE PRODUCT IMAGE
blogController.updateBlogDeleteImage = async(req, res, next) =>{
  const { blogId, imgId } = req.params;
  
  const deleted = await cloudinaryDeleteImg(imgId, "images");
  
  blogActions.updateBlogDeleteImage(blogId, imgId, (err)=>{
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


// CLEAN BLOG STATE
blogController.cleanBlogState = async(req, res, next) =>{
  res.json("Success!");
}


module.exports = blogController;

