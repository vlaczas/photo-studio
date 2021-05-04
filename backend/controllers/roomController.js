const { ObjectID } = require('mongodb');
const Room = require('../models/Room');
const Studio = require('../models/Studio');
const ErrorResponse = require('../utils/errorResponse');

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

      roomInfo.photos = dataToUpdate.photos;
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

  /**
  @desc Update a room via body - can contain .file
   */
  static async updateRoom(req, res, next) {
    try {
      const roomInfo = JSON.parse(req.body.room);

      if (roomInfo.owner !== req.session.user._id) {
        return next(new ErrorResponse('Forbidden', 403));
      }
      roomInfo.photos = [...roomInfo.photos, ...req.body.photos];

      let errorUploads;
      if (req.body.errorUploads) {
        errorUploads = req.body.errorUploads;
      }

      // add only save fields
      const dataToUpdate = {
        photos: roomInfo.photos,
        name: roomInfo.name,
        price: roomInfo.price,
        tags: roomInfo.tags,
        description: roomInfo.description,
      };

      const { value: updatedRoom } = await Room.updateRoom(
        roomInfo._id,
        dataToUpdate,
      );

      res.status(200).json({ success: true, data: updatedRoom, errorUploads });
    } catch (error) {
      next(error);
    }
  }

  /**
  @desc Get a room via query
   */
  static async getSingleRoom(req, res, next) {
    try {
      const query = req.query._id;

      const room = await Room.getRoom(query);
      const [roomData] = await room.toArray();

      if (!roomData) {
        return next(new ErrorResponse('Undefined', 404));
      }

      res.status(200).json({ success: true, data: roomData });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomController;
