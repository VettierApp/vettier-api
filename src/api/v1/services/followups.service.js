const BaseService = require('./base.service');
const { FollowUps: Model } = require('../models/followups.model');

class FollowUpsService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = FollowUpsService;
