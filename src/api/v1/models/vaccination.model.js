const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vaccinationSchema = new Schema(
  {
    vaccinationDate: { type: Date },
    vaccinate: String,
    laboratory: String,
    lot: String,
    followups: String,
    nextVaccination: { type: Date },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Companies',
      autopopulate: true
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);

vaccinationSchema.plugin(require('mongoose-autopopulate'));
export const Vaccination = mongoose.model('Vaccination', vaccinationSchema);
