const router = require('express').Router();
const { FollowUps: Controller } = require('../controllers');
const { FollowUps: Service } = require('../services');
const {
  validateJwtToken,
  checkStatusAndCompany,
  checkPermissionLevel,
  checkGlobalPermissions
} = require('../middlewares');
const controller = new Controller(Service);

router.use(validateJwtToken);
router.post(
  '/:company/create',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.create
);
router.put(
  '/:company/update/:id',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.update
);
router.post(
  '/:company/show',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.getAllPaginated
);
router.post(
  '/:company/filter',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.filter
);
router.get(
  '/:company/index/:id',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.findById
);
router.delete(
  '/:company/delete/:id',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.remove
);

/*admin routes */

router.post(
  '/create',
  checkGlobalPermissions('admin', 'support'),
  controller.create
);
router.put(
  '/update/:id',
  checkGlobalPermissions('admin', 'support'),
  controller.update
);
router.post(
  '/show',
  checkGlobalPermissions('admin', 'support'),
  controller.getAllPaginated
);
router.get(
  '/index/:id',
  checkGlobalPermissions('admin', 'support'),
  controller.findById
);
router.delete(
  '/delete/:id',
  checkGlobalPermissions('admin', 'support'),
  controller.remove
);
module.exports = router;
