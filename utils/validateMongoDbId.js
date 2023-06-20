const mongoose = require("mongoose");

const validateMongoId = (id) =>{
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if(!isValid) return false;
};


module.exports = validateMongoId;