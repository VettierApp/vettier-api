const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
const mongooseOpts = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

module.exports.connect = async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, mongooseOpts);
};

module.exports.clearDb = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports.closeDb = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
