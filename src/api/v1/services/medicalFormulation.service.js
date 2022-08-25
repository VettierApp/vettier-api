const BaseService = require('./base.service');
const {
  MedicalFormulation: Model
} = require('../models/medicalFormulation.model');

class MedicalFormulationService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = MedicalFormulationService;
