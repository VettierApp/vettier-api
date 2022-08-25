const BaseController = require('./base.controller');
const { MedicalFormulation: Service } = require('../services');

class MedicalFormulationController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = MedicalFormulationController;
