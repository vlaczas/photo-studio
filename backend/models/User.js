// const { ObjectID } = require('mongodb');

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

    userInfo.role = 'user';
    userInfo.username = Date.now().toString();

    return users.insertOne(userInfo);
  }
}

module.exports = User;
