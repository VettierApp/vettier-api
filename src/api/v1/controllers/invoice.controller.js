const BaseController = require('./base.controller');
const { Invoice: Service } = require('../services');

class InvoiceController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = InvoiceController;
