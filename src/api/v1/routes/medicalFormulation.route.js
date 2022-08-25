const router = require('express').Router();
const { MedicalFormulation: Controller } = require('../controllers');
const { MedicalFormulation: Service } = require('../services');
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
router.post(
  '/:company/filter',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.filter
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
