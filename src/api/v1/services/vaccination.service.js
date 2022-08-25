const BaseService = require('./base.service');
const { Vaccination: Model } = require('../models/vaccination.model');

class VaccinationService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = VaccinationService;
