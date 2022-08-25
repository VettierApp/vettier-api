const mongoose = require('mongoose');
const autoPopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const petSchema = new Schema({
  name: String,
  dateOfBirth: Date,
  breed: String,
  species: String,
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  petFood: String,
  foodFrequency: String,
  sterilized: Boolean,
  weight: String,
  size: String,
  color: String,
  lastRequest: {
    type: mongoose.Schema.ObjectId,
    ref: 'Requests',
    autopopulate: true
  },
  userId: { type: mongoose.Schema.ObjectId, ref: 'Users', autopopulate: true },
  vaccines: [
    {
      _id: false,
      name: String,
      date: Date,
      description: String
    }
  ],
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Companies',
    autopopulate: true
  },
  active: { type: Boolean, default: true }
});

petSchema.index({ name: 1, userId: 1 }, { unique: true });
petSchema.plugin(autoPopulate);
export const Pet = mongoose.model('Pets', petSchema);
