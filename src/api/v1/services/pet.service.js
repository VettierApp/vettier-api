const BaseService = require('./base.service');
const { Pet: Model } = require('../models/pet.model');

class PetService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = PetService;
