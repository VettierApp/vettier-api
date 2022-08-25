const BaseService = require('./base.service');
const { Invoice: Model } = require('../models/invoice.model');

class InvoiceService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = InvoiceService;
