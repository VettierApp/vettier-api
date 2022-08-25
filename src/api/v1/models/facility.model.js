const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facilitySchema = new Schema({
  name: String,
  address: String,
  phone: String,
  city: String,
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Companies',
    autopopulate: true
  },
  active: { type: Boolean, default: true }
});
facilitySchema.plugin(require('mongoose-autopopulate'));
export const Facility = mongoose.model('Facilities', facilitySchema);
