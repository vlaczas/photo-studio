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

  // /**
  //  *
  //  * @param {Object} query - Object with id of the studio or owner Id for Studio searching
  //  * @param {string} query.owner - required or
  //  * @param {string} query._id - required
  //  * @returns {Object} found studio
  //  */

  // static async getStudio(query) {
  //   const filter = { ...query };
  //   if (query._id) filter._id = ObjectID(query._id);
  //   else if (query.owner) filter.owner = ObjectID(query.owner);

  //   const projection = {
  //     createdAt: 0,
  //     updatedAt: 0,
  //   };
  //   return studios.findOne(filter, { projection });
  // }

  // /**
  //  * @param {object} query - Object with id for Studio searching
  //  * @param {string} query._id - required
  //  * @param {object} dataToUpdate - object of fields to update
  //  * @returns {Studio} updated studio
  //  */
  // static async updateStudio(query, dataToUpdate) {
  //   const filter = { _id: ObjectID(query) };
  //   const updatedData = { ...dataToUpdate };

  //   //* generate slug for the studio
  //   if (updatedData.name && updatedData.slug) {
  //     updatedData.slug = slugify(updatedData.name, { lower: true });
  //   }

  //   const options = {
  //     bypassDocumentValidation: true,
  //     projection: {
  //       createdAt: 0,
  //       updatedAt: 0,
  //     },
  //     returnOriginal: false,
  //     ignoreUndefined: true,
  //   };
  //   const atomData = {
  //     $set: updatedData,
  //   };

  //   return studios.findOneAndUpdate(filter, atomData, options);
  // }
}

module.exports = Room;
