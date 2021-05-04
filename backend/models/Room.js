const { ObjectID } = require('mongodb');

//* Connect to the STUDIOS Collection
let rooms = null;

class Room {
  static injectDB(database) {
    rooms = database.db(process.env.DB_NAME).collection('rooms');
  }

  /**
   *
   * @param {Object} roomData - Object with data for room creation
   * @param {string} roomData.name - name of the room
   * @param {number} roomData.price - object required
   * @returns {Object} new room
   */

  static async createRoom(roomData) {
    const roomInfo = { ...roomData };
    //* set up current Date UTC
    roomInfo.createdAt = new Date();
    roomInfo.updatedAt = roomInfo.createdAt;
    roomInfo.owner = ObjectID(roomData.owner);
    roomInfo.studio = ObjectID(roomData.studio);

    return rooms.insertOne(roomInfo);
  }

  /**
   *
   * @param {string} query - string with id of the room
   * @returns {Object} found studio
   */

  static async getRoom(query) {
    const filter = ObjectID(query);

    return rooms.aggregate([
      {
        $match: {
          _id: filter,
        },
      },
      {
        $lookup: {
          from: 'studios',
          localField: '_id',
          foreignField: 'rooms',
          as: 'studio',
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);
  }

  /**
   * @param {object} query - Object with id for Room searching
   * @param {string} query._id - required
   * @param {object} dataToUpdate - object of fields to update
   * @returns {Room} updated Room
   */
  static async updateRoom(query, dataToUpdate) {
    const filter = { _id: ObjectID(query) };
    const updatedData = { ...dataToUpdate };

    const options = {
      bypassDocumentValidation: true,
      projection: {
        createdAt: 0,
        updatedAt: 0,
      },
      returnOriginal: false,
      ignoreUndefined: true,
    };
    const atomData = {
      $set: updatedData,
    };

    return rooms.findOneAndUpdate(filter, atomData, options);
  }
}

module.exports = Room;
