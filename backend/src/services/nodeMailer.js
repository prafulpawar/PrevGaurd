const nodemailer = require('nodemailer');
const config = require('../config/config'); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});


const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: config.EMAIL_USER,
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
};
