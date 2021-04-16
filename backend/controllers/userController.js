const {
  hashPassword,
  comparePasswords,
} = require('../middleware/hashPassword');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

class UsersController {
  /**
  @desc We create a new user passing all data to Mongo
   */
  static async createUser(req, res, next) {
    try {
      const newUserData = req.body;
      if (!req.body.email) {
        return next(new ErrorResponse('Bad request', 400));
      }

      newUserData.password = await hashPassword(newUserData.password);

      const {
        ops: [newUser],
      } = await User.createUser(newUserData);

      req.session.user = newUser;

      delete newUser.password;
      delete newUser.createdAt;
      delete newUser.updatedAt;

      res.status(201).json({ succes: true, data: newUser });
    } catch (error) {
      next(error);
    }
  }

  /**
  @desc We login a user passing email and compairing password
   */
  static async loginUser(req, res, next) {
    try {
      if (!req.body.email) {
        return next(new ErrorResponse('Bad request', 400));
      }

      const query = { email: req.body.email };
      let foundUser = await User.getUser(query);

      //* in case user logins via Google for the very first time
      if (!foundUser && req.body.googleId) {
        const {
          ops: [newUser],
        } = await User.createUser(req.body);

        delete newUser.createdAt;
        delete newUser.updatedAt;

        foundUser = newUser;
      } else if (!foundUser) {
        return next(new ErrorResponse("User doesn't exist", 400));
      }

      req.session.user = foundUser;

      //* if user was registred via email/pw
      if (req.body.password) {
        await comparePasswords(req);
        delete foundUser.password;
      }

      res.status(200).json({ succes: true, data: foundUser });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get a session of a user
   * @returns {Object} - user session
   */
  static async getMe(req, res, next) {
    try {
      if (!req.session.user) {
        return next(new ErrorResponse("User doesn't log in", 401));
      }

      res.status(200).json({ succes: true, data: req.session.user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
