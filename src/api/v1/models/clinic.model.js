const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicSchema = new Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    petId: { type: mongoose.Schema.ObjectId, ref: 'Pets', autopopulate: true },
    record_id: { type: mongoose.Schema.ObjectId },
    record_type: String,
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Companies',
      autopopulate: true
    },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);
clinicSchema.plugin(require('mongoose-autopopulate'));
export const Clinic = mongoose.model('Clinics_Records', clinicSchema);
