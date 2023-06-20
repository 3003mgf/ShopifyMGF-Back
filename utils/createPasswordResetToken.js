const crypto = require("crypto");

const createPasswordResetToken = async(user) =>{
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
                            .createHash("sha256")
                            .update(resetToken)
                            .digest("hex");
                    
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 Minutes

  //Tenemos que asignarle el valor a la propiedad passwordResetToken del usuario.
  return {
    resetToken,
    user
  }
};


module.exports = createPasswordResetToken;