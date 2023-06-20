const JWT = require("jsonwebtoken"),
      secretKey = process.env.JWT_SECRET_KEY;

//LO USAMOS EN USERACTIONS.LOGIN
const generateRefreshToken = (email) =>{
  return JWT.sign({email}, secretKey, {expiresIn: "3d"});
};


module.exports = generateRefreshToken;