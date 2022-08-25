const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  ticketNumber: String,
  invoiceTotal: Number,
  invoiceIva: Number,
  userId: { type: mongoose.Schema.ObjectId, ref: 'Users', autopopulate: true },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Products',
      autopopulate: true,
      quantity: Number
    }
  ],
  qrCode: String,
  invoiceDate: Date,
  coupons: Number,
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Companies',
    autopopulate: true
  },
  active: { type: Boolean, default: true }
});
invoiceSchema.plugin(require('mongoose-autopopulate'));
invoiceSchema.index({ ticketNumber: 1, companyId: 1 }, { unique: true });
export const Invoice = mongoose.model('Invoices', invoiceSchema);
