// const { ObjectID } = require('mongodb');
const { nanoid } = require('nanoid');
const slugify = require('slugify');

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
    userInfo.photo = userInfo.photo
      ? userInfo.photo
      : '/img/default-user-icon.png';

    //* in case user registered via google and have not username
    if (!userInfo.username) {
      userInfo.username = slugify(
        `${userInfo.firstName} ${userInfo.lastName} ${nanoid(5)}`,
        {
          replacement: '_',
          remove: undefined,
          lower: true,
        },
      );
    }

    userInfo.role = 'user';
    return users.insertOne(userInfo);
  }
  /**
   *
   * @param {Object} query - Object with email or id for User searching
   * @param {string} query.email - required or
   * @param {string} query._id - required
   * @returns {Object} found user
   */

  static async getUser(query) {
    const projection = {
      createdAt: 0,
      updatedAt: 0,
      googleId: 0,
    };
    return users.findOne(query, { projection });
  }
}

module.exports = User;
