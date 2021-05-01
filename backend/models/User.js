const { ObjectID } = require('mongodb');
const { customAlphabet } = require('nanoid');
const slugify = require('slugify');

const abet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(abet, 5);

//* Connect to the STUDIOS Collection
let users = null;

class User {
  static injectDB(database) {
    users = database.db(process.env.DB_NAME).collection('users');
  }

  /**
   *
   * @param {Object} userData - Object with data for User creation
   * @param {string} userData.email - required
   * @param {string} userData.password - required
   * @returns {Object} new user
   */

  static async createUser(userData) {
    const userInfo = { ...userData };
    //* set up current Date UTC
    userInfo.createdAt = new Date();
    userInfo.updatedAt = userInfo.createdAt;
    userInfo.hasPassword = true;
    userInfo.photo = userInfo.photo
      ? userInfo.photo
      : '/img/default-user-icon.png';

    //* in case user registered via google and have not username and password
    if (!userInfo.username) {
      userInfo.username = slugify(
        `${userInfo.firstName} ${userInfo.lastName} ${nanoid()}`,
        {
          replacement: '_',
          remove: undefined,
          lower: true,
        },
      );
      userInfo.hasPassword = false;
    }

    userInfo.role = 'user';
    return users.insertOne(userInfo);
  }
  /**
   *
   * @param {Object} query - Object with email or username for User searching
   * @param {string} query.email - required or
   * @param {string} query.username - required
   * @returns {Object} found user
   */

  static async getUser(query) {
    const projection = {
      createdAt: 0,
      updatedAt: 0,
    };
    return users.findOne(query, { projection });
  }

  /**
   * @param {object} query - Object with email or id for User searching
   * @param {string} query._id - required
   * @param {object} dataToUpdate - object of fields to update
   * @param {object} dataToDelete - object of fields to delete
   * @returns {user} updated user
   */
  static async updateUser(query, dataToUpdate, dataToDelete) {
    const filter = { _id: ObjectID(query) };

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
      $set: dataToUpdate,
      $unset: dataToDelete,
    };

    return users.findOneAndUpdate(filter, atomData, options);
  }
}

module.exports = User;
