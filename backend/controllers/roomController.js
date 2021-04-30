const { ObjectID } = require('mongodb');
const Room = require('../models/Room');
const Studio = require('../models/Studio');
// const ErrorResponse = require('../utils/errorResponse');

class RoomController {
  /**
  @desc We create a new room passing all data to Mongo
   */
  static async createRoom(req, res, next) {
    try {
      let dataToUpdate = req.body;
      const roomInfo = JSON.parse(dataToUpdate.room);

      let errorUploads;
      if (dataToUpdate.errorUploads) {
        errorUploads = dataToUpdate.errorUploads;
      }
      delete dataToUpdate.errorUploads;

      roomInfo.photos = [...roomInfo.photos, ...dataToUpdate.photos];
      dataToUpdate = { ...dataToUpdate, ...roomInfo };
      dataToUpdate.owner = req.session.user._id;
      dataToUpdate.studio = req.session.user.studio;

      delete dataToUpdate.room;

      const {
        ops: [newRoom],
      } = await Room.createRoom(dataToUpdate);

      // turn strings to ObjectID Mongo
      roomInfo.studioRooms = roomInfo.studioRooms.map((item) => ObjectID(item));
      // update studio of the Room
      const { value: updatedStudio } = await Studio.updateStudio(
        req.session.user.studio,
        {
          rooms: [...roomInfo.studioRooms, newRoom._id],
        },
      );

      req.session.studio = updatedStudio;

      delete newRoom.createdAt;
      delete newRoom.updatedAt;

      res.status(201).json({
        success: true,
        data: newRoom,
        errorUploads,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomController;
