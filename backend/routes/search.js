const router = require('express').Router();
const roomController = require('../controllers/roomController');

router.route('/').get(roomController.getSingleRoom);

module.exports = router;
