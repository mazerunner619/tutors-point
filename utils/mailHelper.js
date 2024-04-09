const nodemailer = require("nodemailer");
require("dotenv/config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PSWD,
  },
});

const sendMail = (mailData) => {
  return new Promise((resolve, reject) => {
    // mailData.from = process.env.SENDER_EMAIL;
    transporter.sendMail(
      { ...mailData, from: process.env.SENDER_EMAIL },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info.accepted);
        }
      }
    );
  });
};

const otpHTMLTemplate = (data, purpose) => {
  return `
  <h3> Here is your OTP for ${purpose}</h3>
  <p>${data}</p>
  `;
};

const otpTextTemplate = (data, purpose) => {
  return `Here is your OTP for ${purpose} : ${data}`;
};

// data = {email, subject, text}
const sendOtpMail = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mailData = {
        to: data.email,
        subject: data.subject,
        text: otpTextTemplate(data.otp, data.purpose),
        html: otpHTMLTemplate(data.otp, data.purpose),
      };
      const res = await sendMail(mailData);
      console.log("send otp mail success : ", res);
      resolve(res);
    } catch (error) {
      console.log(error);
      console.log("send otp mail failed : ", error);
      reject(err);
    }
  });
};

const passwordResetHTMLTemplate = (data, purpose) => {
  return `
  <h3> Here is your LINK for ${purpose}</h3>
  <a href=${data}>Reset Password</a>
  `;
};

const passwordResetTextTemplate = (data, purpose) => {
  return `Here is your LINK for ${purpose} :
  ${data}`;
};

const sendPasswordResetMail = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mailData = {
        to: data.email,
        subject: data.subject,
        text: passwordResetTextTemplate(data.data, data.purpose),
        html: passwordResetHTMLTemplate(data.data, data.purpose),
      };
      const res = await sendMail(mailData);
      console.log("send password reset mail success : ", res);
      resolve(res);
    } catch (error) {
      console.log(error);
      console.log("send pass reset mail failed : ", error);
      reject(err);
    }
  });
};

module.exports = {
  sendOtpMail,
  sendPasswordResetMail,
};
