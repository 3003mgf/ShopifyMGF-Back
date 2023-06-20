const enquiryConnection = require("./enqConnection"),
      enquiryActions = () => {};


enquiryActions.createEnquiry = async(enquiry, cb) =>{
  try{
    const newEnquiry = await enquiryConnection.create(enquiry);
    
    cb(false, newEnquiry);
  }catch(err){
    cb(true)
  }
};


enquiryActions.deleteEnquiry = async(id, cb) =>{
  try{
    const findAndDelete = await enquiryConnection.findByIdAndDelete(id);
    cb(false, findAndDelete);
  }catch(err){
    cb(true);
  }
};


enquiryActions.deleteEnquiryGroup = async(enquiries, cb) =>{
  try{
    
    const deleteGroup = await enquiries.map(async(el)=> {
      await enquiryConnection.findByIdAndDelete(el);
    })

    cb(false, "Success");    
  }catch(err){
    cb(true);
  }
};


enquiryActions.updateEnquiry = async(id, data, cb) =>{
  try{
    const updateEnquiry = await enquiryConnection.findByIdAndUpdate(id, data)
    updateEnquiry.name = data.name;

    cb(false, updateEnquiry);
  }catch(err){
    cb(true);
  }
};


enquiryActions.getAllEnquirys = async(cb) =>{
  try{
    const getAll = await enquiryConnection.find();
    if(!getAll.length) throw new Error("Empty");
    cb(false, getAll);
  }catch(err){
    cb(true);
  }
};

enquiryActions.getEnquiry = async(id, cb) =>{
  try{
    const findEnquiry = await enquiryConnection.findById(id);
    if(!findEnquiry) throw new Error();

    cb(false, findEnquiry);
  }catch(err){
    cb(true);
  }
};

module.exports = enquiryActions;