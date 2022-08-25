const {
  Role,
  User,
  Company,
  Pet,
  Facility,
  FollowUps
} = require('../../api/v1/models');
const { Builder } = require('../mockData');
const { jwtSigninToken } = require('../../api/v1/helpers/authentication');

const createUser = async (kindRole) => {
  const user =
    kindRole === 'admin'
      ? { ...Builder.admin() }
      : kindRole === 'owner'
      ? { ...Builder.user(7) }
      : kindRole === 'client'
      ? { ...Builder.user(4) }
      : null;

  const role = await createRole(kindRole);
  const createdUser = await User.create({
    ...user,
    appRole: role._id
  });
  const token = await jwtSigninToken(createdUser._id);
  return { token, user: createdUser };
};

const createCompanyMembers = async (memberRole = 'member', companyId) => {
  const role = await createRole(memberRole);
  for (let i = 5; i <= 6; i++) {
    await User.create({
      ...Builder.user(i),
      appRole: role._id,
      companyId: companyId
    });
  }
};

const createRole = async (kindRole) => {
  return await Role.create({ ...Builder.createGlobalRoles(kindRole) });
};

const createCompanyRole = async (kindRole, companyId) => {
  return await Role.create({
    ...Builder.createGlobalRoles(kindRole),
    companyId
  });
};

const createCompany = async (role = 'admin') => {
  // Create a user in order to create a new company and the corresponding roles
  const { user, token } = await createUser(role);
  // Create a company with the user created previously
  const company = await Company.create({
    ...Builder.newCompany(),
    ownerId: user._id
  });
  // Create a owner Role for the company created previously
  const ownerRole = await createCompanyRole('owner', company._id);
  // Update user with company and role for the company
  await User.findByIdAndUpdate(user._id, {
    companyId: company._id,
    companyRole: ownerRole._id
  });
  // Returns the company, user and token for the corresponding testing
  return { company: company._doc, user: user._doc, token };
};

const collectionItems = async (model, conditionals) => {
  const params = (conditionals ??= {});
  return await model.countDocuments(params);
};

const createPet = async (company, user) => {
  const pet = await Pet.create({
    ...Builder.pet(),
    companyId: company,
    userId: user
  });

  return { pet };
};

const createFacility = async (company) => {
  const facility = await Facility.create({
    ...Builder.facility(),
    companyId: company
  });

  return { facility };
};

const createFollowUps = async (company, pet, comment) => {
  const followups = await FollowUps.create({
    comment: comment,
    companyId: company,
    petId: pet
  });

  return { followups };
};

module.exports = {
  createUser,
  createCompany,
  createRole,
  collectionItems,
  createPet,
  createFacility,
  createFollowUps,
  createCompanyMembers
};
