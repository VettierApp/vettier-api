const { Company: Controller } = require('../controllers');
const { Company: Service } = require('../services');
const {
  validateJwtToken,
  checkStatusAndCompany,
  checkPermissionLevel,
  checkGlobalPermissions
} = require('../middlewares');
const router = require('express').Router();

const controller = new Controller(Service);

router.use([validateJwtToken]);
// Admin Routes only requires token validation
router.post(
  '/show',
  checkGlobalPermissions('admin', 'support'),
  controller.getAllPaginated
);
router.put(
  '/edit/:id',
  checkGlobalPermissions('admin', 'support'),
  controller.updateCompanyData
);
router.get(
  '/index/:id',
  checkGlobalPermissions('admin', 'support'),
  controller.findById
);
router.put(
  '/deactivate/:id',
  checkGlobalPermissions('admin'),
  controller.update
);
router.put(
  '/premium/:id',
  checkGlobalPermissions('admin'),
  controller.updatePremium
);

// Only Company Endpoints
router.post('/create', controller.createCompany);
router.get(
  '/:company/index',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.findCompany
);
router.put(
  '/:company/edit',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.updateCompanyInfo
);
router.post(
  '/:company/filter',
  checkStatusAndCompany,
  checkPermissionLevel,
  controller.filter
);

module.exports = router;
