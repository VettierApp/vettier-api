const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'The field name is missing']
    },
    costValue: Number,
    reference: {
      type: String,
      required: [true, 'The field reference is missing']
    },
    stock: Number,
    description: String,
    price: Number,
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Companies',
      autopopulate: true
    },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.plugin(require('mongoose-autopopulate'));
productSchema.index({ name: 1, reference: 1, companyId: 1 }, { unique: true });

export const Product = mongoose.model('Products', productSchema);
