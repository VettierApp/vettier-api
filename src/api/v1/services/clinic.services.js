const BaseService = require('./base.service');
const { Clinic: Model } = require('../models/clinic.model');
class ClinicService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = ClinicService;
