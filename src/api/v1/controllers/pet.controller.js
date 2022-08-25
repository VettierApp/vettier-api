const BaseController = require('./base.controller');
const { Pet: Service } = require('../services');
const { sendError } = require('../helpers');

class PetController extends BaseController {
  constructor() {
    super(Service);
    this.createPet = this.createPet.bind(this);
    this.deactivatePet = this.deactivatePet.bind(this);
  }

  async createPet(req, res) {
    try {
      const { company } = req.params;
      const { body } = req;
      const pet = await this.service.create({ companyId: company, ...body });
      return res.send(pet);
    } catch (err) {
      console.error(err);
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async deactivatePet(req, res) {
    try {
      const { id } = req.params;
      const { active } = req.body;
      const updatedPet = await this.service.update(id, { active });
      return res.send(updatedPet);
    } catch (err) {
      console.error(err);
      return sendError(res, 'INTERNAL_ERROR');
    }
  }
}

module.exports = PetController;
