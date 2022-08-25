const BaseController = require('./base.controller');
const { MedicalAssistance: Service } = require('../services');

class MedicalAssistanceController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = MedicalAssistanceController;
