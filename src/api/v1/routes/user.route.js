const { User: Controller } = require('../controllers');
const { User: Service } = require('../services');
const {
  validateJwtToken,
  checkStatusAndCompany,
  checkPermissionLevel,
  checkGlobalPermissions,
  checkMyProfile
} = require('../middlewares');
const router = require('express').Router();
const controller = new Controller(Service);

// Don't need a Middleware
router.post('/signup', controller.createUserAndAuth);
router.post('/signin', controller.signIn);
router.get('/activation', controller.activateAccount);
router.get('/:company/link/', controller.linkUserToCompany);
router.put('/newPassword/:id', controller.resetPassword);
router.post('/resetPassword', controller.resetPasswordEmail);
router.get('/check-token', controller.checkUserToken);

// Need to check the token and status for premium version
router.use([validateJwtToken]);

router.get('/index/:id', controller.findById);

/* admin */
router.put(
  '/admin/edit/:id',
  checkGlobalPermissions('admin'),
  controller.update
);
router.post(
  '/show',
  checkGlobalPermissions('admin'),
  controller.getAllPaginated
);

router.put('/:company/logout', controller.logOut);
router.post(
  '/:company/show',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.getAllPaginated
);
router.post(
  '/:company/remove/:id',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.remove
);

router.post(
  '/:company/filter',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.filter
);

router.put(
  '/:company/edit/:id',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.update
);
router.put(
  '/:company/deactivate',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.deactivateUser
);
router.post(
  '/:company/invite/',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.inviteUserToCompany
);

/**
 * Create client without password
 * Only email and npi required
 */
router.post(
  '/:company/client/create',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.createClient
);

/* personal routes*/
router.post('/check-token', checkMyProfile);
router.put('/edit/:id', checkMyProfile, controller.personalUpdate);
router.put('/password/:id', checkMyProfile, controller.changePassword);

/* admin routes*/

module.exports = router;
