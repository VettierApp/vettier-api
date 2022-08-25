const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'Users', autopopulate: true },
  requestDate: Date,
  requestTime: String,
  physician: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    autopopulate: true
  },
  petId: { type: mongoose.Schema.ObjectId, ref: 'Pets', autopopulate: true },
  facility: {
    type: mongoose.Schema.ObjectId,
    ref: 'Facilities',
    autopopulate: true
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Companies',
    autopopulate: true
  },
  status: {
    type: String,
    enum: [
      'Agendada',
      'Completada',
      'Cancelada',
      'Reagendada',
      'No se presentó'
    ],
    default: 'Agendada'
  }
});
requestSchema.plugin(require('mongoose-autopopulate'));

export const Request = mongoose.model('Requests', requestSchema);
