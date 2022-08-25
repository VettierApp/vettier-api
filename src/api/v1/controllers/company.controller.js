const BaseController = require('./base.controller');
const { sendError, checkToken, checkKeys } = require('../helpers');
const { Company, User, Role } = require('../services');

class CompanyController extends BaseController {
  constructor() {
    super(Company);
    this.service = new Company();
    this.userService = new User();
    this.roleService = new Role();
    this.createCompany = this.createCompany.bind(this);
    this.updatePremium = this.updatePremium.bind(this);
    this.findCompany = this.findCompany.bind(this);
    this.updateCompanyInfo = this.updateCompanyInfo.bind(this);
    this.updateCompanyData = this.updateCompanyData.bind(this);
  }

  async createCompany(req, res) {
    try {
      const { body } = req;
      const { decodedToken } = await checkToken(req);
      const newCompany = {
        ...body,
        ownerId: decodedToken.id
      };
      const savedCompany = await this.service.create(newCompany);

      if (savedCompany) {
        const ownerRole = await this.roleService.create({
          roleName: 'Director',
          permissionLevel: ['all'],
          companyId: savedCompany._id
        });
        let generalRole = await this.roleService.findOne({
          roleName: 'Propietario'
        });

        if (!generalRole)
          generalRole = await this.roleService.create({
            roleName: 'Propietario'
          });

        const userUpdated = await this.userService.update(decodedToken.id, {
          companyId: savedCompany._id,
          companyRole: ownerRole._id,
          appRole: generalRole._id
        });
        return res.send(savedCompany);
      }
    } catch (error) {
      console.error(error.message);
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async findCompany(req, res) {
    try {
      const { company } = req.params;
      const data = await this.service.findById(company);
      return res.send({ data });
    } catch (error) {
      console.error(error);
      return sendError(res, 'BAD_REQUEST');
    }
  }
  async updateCompanyInfo(req, res) {
    const { params, body } = req;
    try {
      if (body['email'] || body['idNumber'])
        return sendError(res, 'BAD_REQUEST');
      const updated = await this.service.update(params.company, body);
      return res.send(updated);
    } catch (error) {
      console.error(error);
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async updateCompanyData(req, res) {
    const { params, body } = req;
    try {
      const blockedKeys = [
        'premiumDate',
        'premiumValue',
        'idNumber',
        'email',
        'status'
      ];
      const includeBlockedKey = checkKeys(body, blockedKeys);
      if (includeBlockedKey) return sendError(res, 'BAD_REQUEST');
      const updated = await this.service.update(params.id, body);
      return res.send({ updated });
    } catch (error) {
      console.error(error);
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async updatePremium(req, res) {
    const { params, body } = req;
    try {
      const premiumFieldsOnly = checkKeys(body, [
        'premiumDate',
        'premiumValue'
      ]);
      if (!premiumFieldsOnly) return sendError(res, 'BAD_REQUEST');
      const updatedPremium = await this.service.premiumPaid(params.id, body);
      return res.send(updatedPremium);
    } catch (error) {
      console.error(error);
      return sendError(res, 'BAD_REQUEST');
    }
  }
}

module.exports = CompanyController;
