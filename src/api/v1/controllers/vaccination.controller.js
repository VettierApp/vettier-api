const BaseController = require('./base.controller');
const { Vaccination: Service } = require('../services');

class VaccinationController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = VaccinationController;
