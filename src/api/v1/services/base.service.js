const { sortPagination } = require('../helpers');
class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  create(data) {
    const objectToStore = this.Model(data);
    return objectToStore.save();
  }

  getAll({ findBy, page, limit, sort }) {
    const sorting = sortPagination(sort);
    return this.Model.find(findBy)
      .sort(sorting)
      .limit(Number(limit))
      .skip(limit * (page - 1));
  }

  findOne(data, key = '') {
    return this.Model.findOne(data).select(key);
  }

  findById(id) {
    return this.Model.findById(id);
  }

  update(id, data) {
    return this.Model.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id) {
    return this.Model.findByIdAndDelete(id);
  }

  filter(data) {
    return this.Model.aggregate(data);
  }
}

module.exports = BaseService;
