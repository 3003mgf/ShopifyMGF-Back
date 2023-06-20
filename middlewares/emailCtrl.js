const nodemailer = require("nodemailer"),
      asyncHandler = require("express-async-handler");


const sendMail = asyncHandler(async(data, req, res) =>{
try{
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.MAIL_ID, 
      pass: process.env.MAIL_PASSWORD, 
    },
  });

  let info = await transporter.sendMail({
    from: '"Shopify says Hi! 👋" ', 
    to: data.to, 
    subject: data.subject,
    text: data.text,
    html: data.htm, 
  });

}catch(err){
  throw new Error(err.message);
}

});


module.exports = sendMail;