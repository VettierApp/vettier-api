const BaseService = require('./base.service');
const { Request: Model } = require('../models/request.model');

class RequestService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = RequestService;
