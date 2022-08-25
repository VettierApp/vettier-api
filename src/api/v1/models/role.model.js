const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    roleName: { type: String },
    permissionLevel: {
      type: [String],
      enum: ['all', 'read', 'write', 'update', 'remove']
    },
    status: { type: Boolean, default: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

roleSchema.index({ roleName: 1, companyId: 1 }, { unique: true });

export const Role = mongoose.model('Roles', roleSchema);
