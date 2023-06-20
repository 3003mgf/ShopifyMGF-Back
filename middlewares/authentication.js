const JWT = require("jsonwebtoken"),
      connection = require("../models/users/connection"),
      secretKey = process.env.JWT_SECRET_KEY;


const authMiddleware = async(req, res, next) =>{
  let token;
//Verificamos que comienze con BEARER
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
    try{
      if(token){
        //VERIFICAMOS EL TOKEN QUE NOS OTORGA AL LOGIN
        let decoded = await JWT.verify(token, secretKey);
  
        //USAMOS EL EMAIL QUE NOS DECODIFICA EL TOKEN PARA BUSCAR USUARIO
        let user = await connection.findOne({email: decoded.email});
        req.user = user;
        next();
      };

    }catch(err){//CUALQUIER ERROR QUE TENEGAMOS EN EL TRY, RENDERIZA ESTO
      (()=>{
        let error = new Error(),
        locals = {
          stack: error.stack,
          message: "Token not Authorized"
        };
        return next(locals);
      })()
    }
    
  //SI NO COMIENZA CON BEARER...
  }else{
    (()=>{
      let error = new Error(),
      locals = {
        stack: error.stack,
        message: "No Token Found, remember 'Bearer' is needed."
      };
      return next(locals);
    })()
  }
};


const isAdmin = async(req, res, next) =>{
  const { email } = req.user;
  const adminUser = await connection.findOne({email});
  if(adminUser.role !== "admin"){
    (()=>{
      let error = new Error(),
      locals = {
        stack: error.stack,
        message: "You are not an Admin"
      };
      return next(locals);
    })()
  }else{
    next();
  }
};


module.exports = {authMiddleware, isAdmin};