const { checkToken, sendError } = require('../helpers');
const { User: Service } = require('../services');
const userService = new Service();

exports.validateJwtToken = async (req, res, next) => {
  try {
    const { token, decodedToken } = await checkToken(req);
    if (!token || !decodedToken.id) {
      return sendError(res, 'UNAUTHORIZED');
    }
    next();
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR');
  }
};

exports.checkStatusAndCompany = async (req, res, next) => {
  // Validate company status - Paid date
  try {
    const { company } = req.params;
    const { decodedToken } = await checkToken(req);
    const { companyId, status } = await userService.findById(decodedToken.id);
    if (!status) return sendError(res, 'UNAUTHORIZED');
    if (companyId.toString() !== company) return sendError(res, 'BAD_REQUEST'); // Validate Company ID
    next();
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR');
  }
};

exports.checkMyProfile = async (req, res, next) => {
  try {
    const { token, decodedToken } = await checkToken(req);
    const id = req.params.id ? req.params.id : req.body.id;

    if (decodedToken.id !== id) {
      return sendError(res, 'UNAUTHORIZED');
    }
    next();
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR');
  }
};
