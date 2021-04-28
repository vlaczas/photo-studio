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
  )
  .patch(
    protectUser('studio'),
    imgUploader.array('photos', 4),
    imageUploader('banner', 'studiosBanners', {
      isUniqueName: true,
      width: 880,
      height: 200,
    }),
    studioController.updateStudio,
  );

module.exports = router;
