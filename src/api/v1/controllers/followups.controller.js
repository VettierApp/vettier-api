const BaseController = require('./base.controller');
const { FollowUps: Service } = require('../services');

class FollowUpsController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = FollowUpsController;
