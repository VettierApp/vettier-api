const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentsSchema = new Schema(
  {
    documentUrl: String,
    type: String,
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      autopopulate: true
    },
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

documentsSchema.index({ companyId: 1 });

export const Documents = mongoose.model('Documents', documentsSchema);
