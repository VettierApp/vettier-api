const router = require('express').Router();
const { Pet: Controller } = require('../controllers');
const { Pet: Service } = require('../services');
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
  controller.createPet
);
router.put(
  '/:company/edit/:id',
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
router.put(
  '/:company/deactivate/:id',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.deactivatePet
);

// Admin routes
router.post(
  '/create',
  checkGlobalPermissions('admin', 'support'),
  controller.create
);
router.put(
  '/edit/:id',
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
  checkGlobalPermissions('admin'),
  controller.remove
);

module.exports = router;
