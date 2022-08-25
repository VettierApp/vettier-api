const BaseController = require('./base.controller');
const { Role } = require('../services');
const { sendError } = require('../helpers');

class RoleController extends BaseController {
  constructor() {
    super(Role);
    this.service = new Role();
    this.getRoleById = this.getRoleById.bind(this);
    this.updatePermissions = this.updatePermissions.bind(this);
    this.deactivateRole = this.deactivateRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
  }

  async getRoleById(req, res) {
    const { params } = req;
    try {
      const role = await this.service.findById(params.roleId);
      return res.send(role);
    } catch (err) {
      console.error(err);
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async updatePermissions(req, res) {
    try {
      const { body, params } = req;
      const { roleId } = params;
      if (body.permissionLevel) {
        const updatedPermissions = await this.service.updatePermissions(
          roleId,
          body.permissionLevel
        );
        return res.send(updatedPermissions);
      }
    } catch (err) {
      console.error(err);
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async deactivateRole(req, res) {
    const { body, params } = req;
    try {
      const deactivatedRole = await this.service.update(params.roleId, body);
      return res.send(deactivatedRole);
    } catch (err) {
      console.error(err);
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async deleteRole(req, res) {
    const { params } = req;
    try {
      const deletedRole = await this.service.remove(params.id);
      return res.send(deletedRole);
    } catch (err) {
      console.error(err);
      return sendError(res, 'INTERNAL_ERROR');
    }
  }
}

module.exports = RoleController;
