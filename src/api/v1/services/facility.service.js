const BaseService = require('./base.service');
const { Facility: Model } = require('../models/facility.model');

class FacilityService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = FacilityService;
