const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PWD,
  },
});

exports.mailOptions = {
  from: `"BackendShop" <${process.env.ADMIN_EMAIL}>`,
  to: process.env.ADMIN_EMAIL,
  subject: "Nuevo registro",
  attachments: [],
};
