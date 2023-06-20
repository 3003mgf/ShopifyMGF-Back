const jwt = require("jsonwebtoken"),
      secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (email) =>{
  return jwt.sign({email}, secretKey, {expiresIn: "1d"});

};


module.exports = generateToken;