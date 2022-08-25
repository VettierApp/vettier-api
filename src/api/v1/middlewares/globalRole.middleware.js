const { checkToken, sendError } = require('../helpers');
const { User: Service } = require('../services');
const userService = new Service();

export const checkGlobalPermissions = (...roles) => {
  return async (req, res, next) => {
    try {
      const { decodedToken } = await checkToken(req);
      const { appRole } = await userService.findById(decodedToken.id);
      if (!roles.includes(appRole.roleName))
        return res.status(400).send('No allowed');
      next();
    } catch (error) {
      sendError(res, 'INTERNAL_ERROR');
    }
  };
};
