const { FileUpload: Controller } = require('../controllers');
const {
  validateJwtToken,
  checkStatusAndCompany,
  checkPermissionLevel,
  uploadFile
} = require('../middlewares');
const router = require('express').Router({ mergeParams: true });
const controller = new Controller();

router.use(validateJwtToken);
router.post(
  '/:company/image',
  checkStatusAndCompany,
  checkPermissionLevel,
  uploadFile.single('img'),
  controller.upload
);

router.post(
  '/:company/pdf',
  checkStatusAndCompany,
  checkPermissionLevel,
  uploadFile.single('pdf'),
  controller.upload
);

router.put(
  '/:company/update/pdf',
  checkStatusAndCompany,
  checkPermissionLevel,
  uploadFile.single('pdf'),
  controller.update
);

module.exports = router;
