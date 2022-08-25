module.exports = [
  { path: '/clinic/', controller: require('./clinic.route') },
  { path: '/request/', controller: require('./request.route') },
  { path: '/pet/', controller: require('./pet.route') },
  { path: '/product/', controller: require('./product.route') },
  { path: '/invoice/', controller: require('./invoice.route') },
  { path: '/facility/', controller: require('./facility.route') },
  { path: '/user/', controller: require('./user.route') },
  { path: '/company/', controller: require('./company.route') },
  { path: '/role/', controller: require('./role.route') },
  { path: '/vaccination/', controller: require('./vaccination.route') },
  { path: '/formulation/', controller: require('./medicalFormulation.route') },
  { path: '/followups/', controller: require('./followups.route') },
  { path: '/assistance/', controller: require('./medicalAssistance.route') },
  { path: '/upload/', controller: require('./upload.route') },
  { path: '/documents/', controller: require('./documents.route') }
];
