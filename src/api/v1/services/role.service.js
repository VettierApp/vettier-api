const { Role: Model } = require('../models');
const BaseService = require('./base.service');

class RoleService extends BaseService {
  constructor() {
    super(Model);
    this.model = Model;
    this.getRoles = this.getRoles.bind(this);
    this.updatePermissions = this.updatePermissions.bind(this);
  }

  async getRoles(id) {
    return await this.model.find({ companyId: id });
  }

  async updatePermissions(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      { permissionLevel: data },
      { new: true }
    );
  }
}

module.exports = RoleService;
