const router = require('express').Router();
const multer = require('multer');
const studioController = require('../controllers/studioController');
const protectUser = require('../middleware/protect');
const imageUploader = require('../middleware/uploadImg');

const imgUploader = multer();

router
  .route('/')
  .post(protectUser('studio'), studioController.createStudio)
  .get(studioController.getSingleStudio)
  .put(
    protectUser('studio'),
    imgUploader.array('photos', 4),
    imageUploader('logo', 'studiosLogos', { isUniqueName: true }),
    studioController.updateStudio,
  );

module.exports = router;
