const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followupsSchema = new Schema(
  {
    comment: String,
    createdAt: Date,
    updatedAt: Date,
    petId: { type: Schema.ObjectId, ref: 'Pets', autopopulate: true },
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

followupsSchema.plugin(require('mongoose-autopopulate'));
export const FollowUps = mongoose.model('FollowUps', followupsSchema);
