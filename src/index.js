const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { port, dbURI } = require('./config');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express();
const routes = require('./api/v1/routes');
const router = require('express').Router({ mergeParams: true });

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(express.json());
app.use(cors());
// app.use(rateLimit({
//   windowMs: 12 * 60 * 60 * 1000, // 12 Hours duration
//   max: 20,
//   message: 'You have exceeded 100 request in 12 hours limit!',
//   headers: true
// }));
app.use(express.static('build'));
app.use(helmet());
app.disable('x-powered-by');
app.set('views', path.join(__dirname, './api/v1/views'));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use('/api/v1/uploads', express.static(__dirname + '/api/v1/uploads'));

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Connected to the Database');
    })
    .catch((err) => {
      console.log(err);
    });
}

routes.forEach(({ path, controller }) => {
  router.use(path, controller);
});

app.use('/api/v1/', router);

const server = app.listen(port, () => {
  console.log('Server is running');
});

module.exports = { app, server };
