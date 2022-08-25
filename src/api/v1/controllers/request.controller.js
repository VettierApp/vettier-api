const BaseController = require('./base.controller');
const { Request: Service } = require('../services');

class RequestController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = RequestController;
