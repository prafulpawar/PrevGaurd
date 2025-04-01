const nodemailer = require('nodemailer');
const nodemailers = require('../config/config');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:nodemailers.EMAIL_USER,
      pass:nodemailers.EMAIL_PASS,
    },
  });
  
  const sendMail = async (to, subject, text) => {
    try {
      const info = await transporter.sendMail({
        from: nodemailers.EMAIL_USER,
        to,
        subject,
        text,
      });
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  
  module.exports = {
    sendMail
  }