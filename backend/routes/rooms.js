const router = require('express').Router();
const multer = require('multer');
const roomController = require('../controllers/roomController');
const protectUser = require('../middleware/protect');
const imageUploader = require('../middleware/uploadImg');

const imgUploader = multer();

router
  .route('/')
  .post(
    protectUser('studio'),
    imgUploader.array('photos', 10),
    imageUploader('photos', 'roomsPhotos', {
      isMultiple: true,
      width: 600,
      height: 800,
      crop: 'pad',
    }),
    roomController.createRoom,
  )
  .put(
    protectUser('studio'),
    imgUploader.array('photos', 10),
    imageUploader('photos', 'roomsPhotos', {
      isMultiple: true,
      width: 600,
      height: 800,
      crop: 'pad',
    }),
    roomController.updateRoom,
  )
  .get(roomController.getSingleRoom);

module.exports = router;
