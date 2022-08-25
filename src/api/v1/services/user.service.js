const { User: Model } = require('../models');
const BaseService = require('./base.service');

class UserService extends BaseService {
  constructor() {
    super(Model);
    this.model = new Model();
    this.findUsersPaginated = this.findUsersPaginated.bind(this);
    this.deactivateUserById = this.deactivateUserById.bind(this);
    this.findUserByIdAndPermissionLevel =
      this.findUserByIdAndPermissionLevel.bind(this);
  }

  async findUsersPaginated(perPage, page) {
    return new Promise((res, rej) => {
      this.model
        .find()
        .limit(perPage)
        .skip(perPage * page)
        .exec((err, users) => {
          if (err) rej(err);
          res(users);
        });
    });
  }

  async deactivateUserById(userId, newStatus) {
    return await this.model
      .findByIdAndUpdate(userId, newStatus)
      .then((user) => user);
  }

  async findUserByIdAndPermissionLevel(userId, permission) {
    const user = await this.model
      .find({
        _id: userId,
        permissionLevel: permission
      })
      .then((record) => record);
    return user;
  }
}

module.exports = UserService;
