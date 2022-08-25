const BaseController = require('./base.controller');
const { Facility: Service } = require('../services');

class FacilityController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = FacilityController;
