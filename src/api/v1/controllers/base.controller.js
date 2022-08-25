const {
  sendError,
  createFilterMatch,
  createGroupByUserFilter
} = require('../helpers');

class BaseController {
  constructor(Service) {
    this.service = new Service();
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.getAllPaginated = this.getAllPaginated.bind(this);
    this.findById = this.findById.bind(this);
    this.findOne = this.findOne.bind(this);
    this.filter = this.filter.bind(this);
  }

  async create(req, res) {
    try {
      const { company } = req.params;
      const data = company ? { ...req.body, companyId: company } : req.body;
      const saved = await this.service.create(data);
      return res.send(saved);
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async findOne(req, res) {
    try {
      const data = await this.service.findOne(req.query);
      return res.send({ data });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async findById(req, res) {
    try {
      const data = await this.service.findById(req.params.id);
      return res.send({ data });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async getAllPaginated(req, res) {
    try {
      const { company } = req.params;
      const params = {
        findBy: company
          ? {
              ...req.body,
              companyId: company
            }
          : { ...req.body }
      };
      const data = await this.service.getAll(params);
      return res.send({ data });
    } catch (error) {
      return sendError(res, 'BAD_REQUEST');
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await this.service.update(id, req.body);
      return res.send({ updated });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }
  async remove(req, res) {
    try {
      const removed = await this.service.remove(req.params.id);
      return res.send({ removed });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async filter(req, res) {
    try {
      const { company } = req.params;
      let filter = {};
      if (req.body.type === 'foreign')
        filter = createFilterMatch(req.body, company);
      if (req.body.type === 'collection_by_user')
        filter = createGroupByUserFilter(req.body);

      const data = await this.service.filter(filter);
      return res.send({ data });
    } catch (error) {
      console.log(error);
      return sendError(res, 'INTERNAL_ERROR');
    }
  }
}

module.exports = BaseController;
