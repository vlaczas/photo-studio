const { ObjectID } = require('mongodb');
const slugify = require('slugify');

//* Connect to the STUDIOS Collection
let studios = null;

class Studio {
  static injectDB(database) {
    studios = database.db(process.env.DB_NAME).collection('studios');
  }

  /**
   *
   * @param {Object} studioData - Object with data for Studio creation
   * @param {string} studioData.name - name of the Studio
   * @param {Object} studioData.address - object required
   * @param {string} studioData.address.address - formatted address
   * @param {Object} studioData.address.location - lng, lat
   * @param {string} studioData.address.gPlaceId - Google id of the place
   * @param {Object} studioData.contacts - object required
   * @param {string} studioData.contacts.phone - main contact phone
   * @param {string} studioData.contacts.website - website url
   * @returns {Object} new Studio
   */

  static async createStudio(studioData) {
    const studioInfo = { ...studioData };
    //* set up current Date UTC
    studioInfo.createdAt = new Date();
    studioInfo.updatedAt = studioInfo.createdAt;
    studioInfo.owner = ObjectID(studioData.owner);
    studioInfo.address.location = {
      type: 'Point',
      location: studioData.address.location,
    };

    //* generate slug for the studio
    studioInfo.slug = slugify(studioInfo.name, { lower: true });

    return studios.insertOne(studioInfo);
  }

  /**
   *
   * @param {Object} query - Object with id of the studio or owner Id for Studio searching
   * @param {string} query.owner - required or
   * @param {string} query._id - required
   * @returns {Object} found studio
   */

  static async getStudio(query) {
    const filter = { ...query };
    if (query._id) filter._id = ObjectID(query._id);
    else if (query.owner) filter.owner = ObjectID(query.owner);

    return studios.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'rooms',
          foreignField: '_id',
          as: 'rooms',
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
   * @param {object} query - Object with id for Studio searching
   * @param {string} query._id - required
   * @param {object} dataToUpdate - object of fields to update
   * @returns {Studio} updated studio
   */
  static async updateStudio(query, dataToUpdate) {
    const filter = { _id: ObjectID(query) };
    const updatedData = { ...dataToUpdate };

    //* generate slug for the studio
    if (updatedData.name && updatedData.slug) {
      updatedData.slug = slugify(updatedData.name, { lower: true });
    }

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

    return studios.findOneAndUpdate(filter, atomData, options);
  }
}

module.exports = Studio;
