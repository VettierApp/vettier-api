const log4js = require('log4js');
// Logs Configuration
log4js.configure({
  appenders: {
    default: { type: 'console' },
    app: { type: 'file', filename: 'app.log' }
  },
  categories: { default: { appenders: ['app', 'default'], level: 'debug' } }
});

exports.logger = (appender) => log4js.getLogger(appender);
