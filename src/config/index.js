require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  secretJwt: process.env.JWT_SECRET,
  userMail: process.env.MAIL_USER,
  passwordMail: process.env.MAIL_PASSWORD,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
  testMailUser: process.env.MAIL_USER_TEST,
  testMailPassword: process.env.MAIL_PASSWORD_TEST,
  dbURI: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pej7ome.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
};
