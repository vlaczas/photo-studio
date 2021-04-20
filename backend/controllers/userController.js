const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const {
  hashPassword,
  comparePasswords,
} = require('../middleware/hashPassword');

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

      req.session.user = { ...newUser };

      delete newUser.password;
      delete newUser.createdAt;
      delete newUser.updatedAt;

      res.status(201).json({ success: true, data: newUser });
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
      } else if (req.body.password && !foundUser.password) {
        return next(new ErrorResponse('User was registered via Google', 403));
      }

      req.session.user = { ...foundUser };

      //* if user logging in via email/pw
      if (!req.query.token) {
        await comparePasswords(req);
        delete foundUser.password;
      }
      res.status(200).json({ success: true, data: foundUser });
    } catch (error) {
      next(error);
    }
  }

  /**
  @desc Update a user via query parameters - can contain .file
   */
  static async updateUser(req, res, next) {
    try {
      const { _id: query } = req.query;
      const dataToUpdate = req.body;
      const { deleteFields: dataToDelete } = req.body;
      delete dataToUpdate.deleteFields;

      console.log(dataToDelete);

      let errorUploads;
      if (dataToUpdate.errorUploads) {
        errorUploads = dataToUpdate.errorUploads;
      }
      delete dataToUpdate.errorUploads;
      const { value: updatedUser } = await User.updateUser(
        query,
        dataToUpdate,
        dataToDelete,
      );

      req.session.user = { ...updatedUser };
      delete updatedUser.password;

      res.status(200).json({ success: true, data: updatedUser, errorUploads });
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

      const userData = { ...req.session.user };
      delete userData.password;

      res.status(200).json({ success: true, data: userData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get a single user from the DB
   * @returns {Object} - user data
   */
  static async getSingleUser(req, res, next) {
    try {
      const query = { ...req.query };

      delete query.private;
      const foundUser = await User.getUser(query);

      if (req.query.private) {
        res.status(200).json({ success: !!foundUser, data: {} });
        return;
      }

      res.status(200).json({ success: true, data: foundUser });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
