const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    name: String,
    invoiceFrom: Number,
    invoiceTo: Number,
    idNumber: { type: Number, unique: true, required: true },
    invoicePrefix: String,
    email: { type: String, unique: true, required: true },
    phoneNumber: Number,
    address: String,
    regimen: String,
    logoImage: String,
    status: { type: Boolean, default: false },
    premiumDate: Date,
    valuePremiumPaid: Number,
    typeId: String,
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export const Company = mongoose.model('Companies', companySchema);
