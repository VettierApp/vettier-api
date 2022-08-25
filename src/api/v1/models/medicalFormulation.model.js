const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalFormulationSchema = new Schema(
  {
    formulationDate: Date,
    doctor: { type: Schema.ObjectId, ref: 'User', autopopulate: true },
    amount: { type: Number },
    diagnosis: String,
    medicines: String,
    petId: { type: Schema.ObjectId, ref: 'Pets', autopopulate: true },
    createdAt: Date,
    updatedAt: Date,
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

medicalFormulationSchema.plugin(require('mongoose-autopopulate'));
export const MedicalFormulation = mongoose.model(
  'MedicalFormulation',
  medicalFormulationSchema
);
