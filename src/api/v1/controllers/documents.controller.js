const BaseController = require('./base.controller');
const { Documents: Service } = require('../services');

class DocumentsController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = DocumentsController;
