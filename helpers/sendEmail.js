import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport(config.nodemailer);

const sendEmail = async (data) => {
  const mailOptions = {
    ...data,
    from: config.nodemailer.auth.user,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
