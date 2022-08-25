const { Role: Controller } = require('../controllers');
const { Role: Service } = require('../services');
const {
  validateJwtToken,
  checkStatusAndCompany,
  checkPermissionLevel,
  checkGlobalPermissions
} = require('../middlewares');
const router = require('express').Router({ mergeParams: true });

const controller = new Controller(Service);

router.use(validateJwtToken);
router.post(
  '/:company/show',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.getAllPaginated
);
router.post(
  '/:company/create',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.create
);
router.put(
  '/:company/edit/:roleId',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.updatePermissions
);
router.get(
  '/:company/index/:roleId',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.getRoleById
);
router.put(
  '/:company/deactivate/:roleId',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.deactivateRole
);
router.post(
  '/:company/filter',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.filter
);
/* admin routes */
router.put('/edit/:id', checkGlobalPermissions('admin'), controller.update);

router.put(
  '/remove/:id',
  checkGlobalPermissions('admin'),
  controller.deleteRole
);

router.post('/create', checkGlobalPermissions('admin'), controller.create);

router.post(
  '/show',
  checkGlobalPermissions('admin'),
  controller.getAllPaginated
);

router.get('/index/:id', checkGlobalPermissions('admin'), controller.findById);

module.exports = router;
