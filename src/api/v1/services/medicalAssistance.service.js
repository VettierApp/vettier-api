const BaseService = require('./base.service');
const {
  MedicalAssistance: Model
} = require('../models/medicalAssistance.model');

class MedicalAssistanceService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = MedicalAssistanceService;
