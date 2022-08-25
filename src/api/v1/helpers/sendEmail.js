const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const {
  userMail,
  passwordMail,
  clientId,
  clientSecret,
  refreshToken,
  accessToken,
  nodeEnv
} = require('../../../config');

export const sendEmail = async (data) => {
  try {
    const viewsFolderByEnvironmet =
      nodeEnv === 'development' ? '../views/' : './api/v1/views';
    const { subject, file, email } = data;
    const transporter = mailTransporter(nodeEnv);
    const hbsOptions = {
      viewEngine: {
        partialsDir: path.resolve(__dirname, viewsFolderByEnvironmet),
        defaultLayout: false
      },
      viewPath: path.resolve(__dirname, viewsFolderByEnvironmet)
    };
    transporter.use('compile', hbs(hbsOptions));
    const mailOptions = {
      from: 'vettierapp@gmail.com',
      to: email,
      subject,
      template: file,
      context: data
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

const mailTransporter = (kindEnv) => {
  const transporter = {
    development: {
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: userMail,
        pass: passwordMail
      }
    },
    production: {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: userMail,
        pass: passwordMail,
        clientId,
        clientSecret,
        refreshToken,
        accessToken
      }
    }
  };
  return nodemailer.createTransport(transporter[kindEnv]);
};
