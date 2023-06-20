
const blogConnection = require("../blog/blogConnection"),
      blogActions = () => {};



//CREATE BLOG
blogActions.createBlog = async(blog, cb) =>{
  try{
    const newBlog = await blogConnection.create(blog);
    cb(false);
  }catch(err){
    cb(true);
  }
};

//UPDATE BLOG
blogActions.updateBlog = async(id, blog, cb) =>{
  try{
    const updateBlog = await blogConnection.findByIdAndUpdate(id, blog, {
      new: true
    });

    cb(false, updateBlog);
  }catch(err){
    cb(true);
  }
};

//GET BLOG
blogActions.getBlog = async(id, cb) =>{
  try{
    const getBlog = await blogConnection.findById(id).populate("likes").populate("dislikes"); //En lugar de en "likes" mostrarnos solo el ID, nos muestra toda la informacion del usuario con ese ID.
    
    const updateViews = await blogConnection.findByIdAndUpdate(id, 
      {
        $inc: {numViews: 1}
      },
      {
        new: true
      });

    cb(false, getBlog) //Al momento de abrir por primera vez un blog, las vistas del blog son 0.
  }catch(err){
    console.log(err.message);
    cb(true);
  }

};

//GET ALL BLOGS
blogActions.getAllBlogs = async(cb) =>{

  const blogs = await blogConnection.find();

  if(blogs.length){
    cb(false, blogs);
  }else{
    cb(true);
  }

};

//DELETE BLOG
blogActions.deleteBlog = async(id, cb) => {
  try{
    const delBlog = await blogConnection.findByIdAndDelete(id);
    cb(false);
  }catch(err){
    cb(true);
  }
};

//LIKE BLOG
blogActions.likeBlog = async(id, userId, cb)=>{
  const findBlog = await blogConnection.findById(id);
 
  const isLiked = findBlog.isLiked;
  const alreadyDislike = findBlog.dislikes.find(el => el.toString() === userId.toString());

  if(alreadyDislike){
    const removeDislike = await blogConnection.findByIdAndUpdate(findBlog._id, {
      $pull: {dislikes: userId},
      isDisliked: false,
    },
    {new: true});
    return cb(false, removeDislike); //Es importante el RETURN 
  };

  if(isLiked){
    const removeLike = await blogConnection.findByIdAndUpdate(findBlog._id, {
      $pull: {likes: userId},
      isLiked: false
    },{new: true});

   return cb(false, removeLike);
  }else{
    const addLike = await blogConnection.findByIdAndUpdate(findBlog._id, {
      $push: {likes: userId},
      isLiked: true
    },{new: true});
    return cb(false, addLike);
  }

};

//DISLIKE BLOG
blogActions.dislikeBlog = async(id, userId, cb)=>{
  const findBlog = await blogConnection.findById(id);

  const isDisliked = findBlog.isDisliked;
  const alreadyLike = findBlog.likes.find(el => el.toString() === userId.toString());

  if(alreadyLike){
    const removeLike = await blogConnection.findByIdAndUpdate(findBlog._id, {
      $pull: {likes: userId},
      isLiked: false,
    },
    {new: true});
    return cb(false, removeLike);
  };

  if(isDisliked){
    const removeDislike = await blogConnection.findByIdAndUpdate(findBlog._id, {
      $pull: {dislikes: userId},
      isDisliked: false,
    },{new: true});

   return cb(false, removeDislike);
  }else{
    const addDislike = await blogConnection.findByIdAndUpdate(findBlog._id, {
      $push: {dislikes: userId},
      isDisliked: true
    },{new: true});
    return cb(false, addDislike);
  }
};

//UPLOAD IMAGES
blogActions.updateBlogImages = async(id, urls, cb) =>{
  try{
    const updateBlog = await blogConnection.findByIdAndUpdate(id, 
      {
      images: urls.map(file => file)
      });
    
    const findBlog = await blogConnection.findByIdAndUpdate(id);

  cb(false, findBlog);
  }catch(err){
    cb(true);
  }

};

//DELETE PRODUCT IMAGE
blogActions.updateBlogDeleteImage = async(blogId, imageId, cb) =>{
  try{
    const findBlog = await blogConnection.findByIdAndUpdate(blogId, 
      {
        $pull: {images: {public_id: imageId}}
      }
    );
    cb(false);
  }catch(err){
    cb(true);
  }
};




module.exports = blogActions;