
const errorHandler = (data, req, res, next)=>{
let statusCode = res.statusCode === 200 ? 500 : res.satusCode;
res.status(statusCode);
res.json({
  message:  data.message,
  stack:  data.stack
});
};



module.exports = errorHandler;