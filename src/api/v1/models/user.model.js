const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoPopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: [true, 'The email field is required'],
      unique: [
        true,
        'If you forgot your password, please reset the password token'
      ]
    },
    phoneNumber: Number,
    address: String,
    city: String,
    neighborhood: String,
    password: {
      type: String,
      select: false,
      required: [true, 'Password field is required']
    },
    appRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roles',
      autopopulate: true
    },
    npi: {
      type: Number,
      unique: [true, 'Please verify your identification'],
      required: [true, 'Identification is required']
    },
    resetToken: String,
    confirmationToken: String,
    companyRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roles',
      autopopulate: true
    },
    status: {
      type: String,
      default: 'deactived'
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Companies'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.plugin(autoPopulate);
userSchema.plugin(uniqueValidator);
export const User = mongoose.model('Users', userSchema);
