const { Company: Model } = require('../models');
const BaseService = require('./base.service');

class CompanyService extends BaseService {
  constructor() {
    super(Model);
    this.model = Model;
    this.premiumPaid = this.premiumPaid.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
  }
  premiumPaid(companyId, data) {
    const newPremiumData = {
      status: true,
      ...data
    };
    return this.update(companyId, newPremiumData);
  }
  async updateUsers(companyId, userId) {
    const company = await this.model.findById(companyId);
    company.userId.push(userId);
    company.save();
    return company;
  }
}

module.exports = CompanyService;
