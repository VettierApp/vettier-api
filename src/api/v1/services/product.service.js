const BaseService = require('./base.service');
const { Product: Model } = require('../models/product.model');

class ProductService extends BaseService {
  constructor() {
    super(Model);
  }
}

module.exports = ProductService;
