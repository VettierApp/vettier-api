const BaseController = require('./base.controller');
const { Clinic: Service } = require('../services');

class ClinicController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = ClinicController;
