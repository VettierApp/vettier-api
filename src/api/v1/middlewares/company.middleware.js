//const { Company: Service } = require('./services');
const { checkToken, sendError, checkPermissionsRoute } = require('../helpers');
const { User: Service } = require('../services');
const userService = new Service();
//const CompanyService = new Service();

export const checkOwner = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return sendError(res, 'BAD_REQUEST');
  }
};

export const checkPermissionLevel = async (req, res, next) => {
  try {
    const { decodedToken } = await checkToken(req);
    const { companyRole } = await userService.findById(decodedToken.id);
    const permission = checkPermissionsRoute(req.originalUrl);
    const checkPermissions =
      companyRole.permissionLevel.includes(permission) ||
      companyRole.permissionLevel.includes('all');
    if (!checkPermissions) return sendError(res, 'BAD_REQUEST');
    next();
  } catch (error) {
    sendError(res, 'INTERNAL_ERROR');
  }
};
