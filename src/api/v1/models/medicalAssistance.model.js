const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalAssistanceSchema = new Schema(
  {
    assistanceDate: Date,
    motive: String,
    details: String,
    problems: String,
    differencialDiagnosis: String,
    presumptiveDiagnosis: String,
    diagnosisPlan: String,
    therapeuticPlan: String,
    finalDiagnosis: String,
    tratements: String,
    nextControl: Date,
    exams: [String],
    createdAt: Date,
    updatedAt: Date,
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Companies',
      autopopulate: true
    },
    petId: { type: Schema.ObjectId, ref: 'Pets', autopopulate: true }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);

medicalAssistanceSchema.plugin(require('mongoose-autopopulate'));
export const MedicalAssistance = mongoose.model(
  'MedicalAssistance',
  medicalAssistanceSchema
);
