const BaseController = require('./base.controller');
const { Product: Service } = require('../services');

class ProductController extends BaseController {
  constructor() {
    super(Service);
  }
}

module.exports = ProductController;
