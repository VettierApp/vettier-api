const BaseService = require('./base.service');
const { Documents: Model } = require('../models');

class DocumentsService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = DocumentsService;
