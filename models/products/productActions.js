const connection = require("./productsConnection"),
      userConnection = require("../users/connection"),
      sizeConnection = require("../size/sizeConnection"),
      productsActions = () =>{};




//CREATE PRODUCT
productsActions.createProduct = async(product, cb) =>{
  try{
    const validate = await connection.count({slug: product.slug});
    if(validate > 0){
      throw new Error("Error");
    }else{
      const newProduct = (await connection.create(product)).populate("color");
      cb(false, newProduct);
    } 
  }catch(error){
    cb(true);
  }
};

//GET ONE PRODUCT
productsActions.getOneProduct = async(id, cb) =>{
try{
  const findProduct = await connection.findById(id);
  cb(false, findProduct);
}catch(err){
  cb(true);
}
};


//GET ALL PRODUCTS
productsActions.getAll = async(query, cb) =>{
  const filteredProducts = await connection.find(query);
  if(filteredProducts.length){
    cb(false, filteredProducts);
  }else{
    cb(true);
  }
};

//UPDATE PRODUCT
productsActions.updateProduct = async(id, newProduct, cb) =>{
  try{
    const findProduct = await connection.findByIdAndUpdate(id, newProduct);
    
    cb(false, findProduct);
  }catch(err){
    cb(true);
  }
};


//DELETE PRODUCT
productsActions.deleteProduct = async(id, cb) =>{
  try{
    const findProduct = await connection.findByIdAndDelete(id);
    cb(false, findProduct);
  }catch(err){
    cb(true);
  }
};


//ADD TO WISHLIST
productsActions.addToWishList = async(user, prodId, cb) =>{
  try{
    const validate = await user.wishList.find(el => el.toString() === prodId.toString()); //toString() ES IMPORTANTE! 
    if(validate){
      const updateUser = await userConnection.findByIdAndUpdate(user._id, 
        {
        $pull: {wishList: prodId}
        },
        {new: true}
      );
  
      cb(false, updateUser);
    }else{
      const updateUser = await userConnection.findByIdAndUpdate(user._id, 
        {
        $push: {wishList: prodId}
        },
        {new: true}
      );
  
      cb(false, updateUser);
    }

  }catch(err){
    cb(true);
  }
};


//REMOVE FROM WISHLIST
productsActions.removeFromWishList = async(user, prodId, cb) =>{
  try{
    
      const updateUser = await userConnection.findByIdAndUpdate(user._id, 
        {
        $pull: {wishList: prodId}
        },
        {new: true}
      );
  
      cb(false, updateUser);
      
  }catch(err){
    cb(true);
  }
};

//RATING - Hora 6:03 Video
productsActions.rating = async(userId, prodId, star, comment, cb)=> {
  try{
    const product = await connection.findById(prodId);

    const alreadyRated = await product.ratings.find(el => el.postedby.toString() === userId.toString());

    if(alreadyRated){
      if(alreadyRated.star === star){
        //SI CLICKEA EN LA MISMA ESTRELLA SE RETIRA EL RATING
        let filter = product.ratings.filter(el => el._id !== alreadyRated._id);
        const removeRating = await connection.updateOne(
          {
            $set: {ratings: filter}
          }
          );
      }else{
        //SI CLICKEA EN OTRA ESTRELLA SE ACTUALIZA
        const updateProduct = await connection.updateOne(
          {
          ratings: { $elemMatch: alreadyRated }
          },
          {
            $set: {"ratings.$.star": star,"ratings.$comment": comment || undefined}
          },
          {
            new: true
          }
        );
      };
    }else{
      //SI NINGUNA ESTRELLA ESTABA SELECCIONADA, SE PONE EL NUEVO RATING
      const updateProduct = await connection.findByIdAndUpdate(prodId,
        {
        $push: {ratings: {
          star,
          comment: comment || undefined,
          postedby: userId
          }}
        });
    };
    
    //Calculamos el promedio de Rating del producto
    const getAllRatings = await connection.findById(prodId);
    let ratingsLength = getAllRatings.ratings.length;
    
    //Nos da un array, y con reduce obtenemos la suma
    let sum = getAllRatings.ratings.map(el =>el.star).reduce((prev, curr)=> prev + curr, 0);

    const totalRating = Math.ceil(sum / ratingsLength);
    
    const updateTotalRating = await connection.findByIdAndUpdate(prodId, {
      totalRating
    });

    //Si no devuelve el total rating antes de ser actualizado.
    updateTotalRating.totalRating = totalRating;

    cb(false, updateTotalRating);
    
  }catch(err){
    cb(true);
  }
};



//DELETE PRODUCT IMAGE
productsActions.updateProductDeleteImage = async(productId, imageId, cb) =>{
  try{
    const findProduct = await connection.findByIdAndUpdate(productId, 
      {
        $pull: {images: {public_id: imageId}}
      }
    );
    cb(false);
  }catch(err){
    cb(true);
  }
};



// CREATE REVIEW

productsActions.createReview = async(userId, prodId, review, cb) =>{
  try{
      const getProduct = await connection.findById(prodId);

      const ifExist = await getProduct.reviews.filter(el => el.postedBy.toString() === userId.toString());
      
      if(ifExist.length){
        return cb(false, "AlreadyExist");
      }else if(!ifExist.length){
        const createReview = await connection.findByIdAndUpdate(prodId, {
          $push: {reviews: review}
        }
        );
        return cb(false, review);
      };

  }catch(error){
    cb(true);
  }
};


// GET ALL SIZES

productsActions.getAllSizes = async(cb) =>{
  try{
      const getSizes = await sizeConnection.find();

     cb(false, getSizes)
  }catch(error){
    cb(true);
  }
};


// ADD SIZE

productsActions.addSize = async(size, cb) =>{
  try{
      const addSize = await sizeConnection.create(size);

     cb(false, addSize)
  }catch(error){
    cb(true);
  }
};


module.exports = productsActions;
