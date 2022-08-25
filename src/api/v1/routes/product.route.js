const router = require('express').Router();
const { Product: Controller } = require('../controllers');
const { Product: Service } = require('../services');
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
router.post(
  '/:company/filter',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.filter
);
// router.delete(
//   '/:company/delete/:id',
//   checkStatusAndCompany,
//   checkPermissionLevel,
//   controller.remove
// );

router.post('/create', checkGlobalPermissions('admin'), controller.create);
router.put('/edit/:id', checkGlobalPermissions('admin'), controller.update);
router.post(
  '/show',
  checkGlobalPermissions('admin'),
  controller.getAllPaginated
);
router.get('/index/:id', checkGlobalPermissions('admin'), controller.findById);
// router.delete(
//   '/delete/:id',
//   checkGlobalPermissions('admin'),
//   controller.remove
// );

module.exports = router;
