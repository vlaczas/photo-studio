const User = require('../models/User');
const Studio = require('../models/Studio');
// const ErrorResponse = require('../utils/errorResponse');

class StudioController {
  /**
  @desc We create a new studio passing all data to Mongo
   */
  static async createStudio(req, res, next) {
    try {
      const newStudioData = req.body;
      newStudioData.owner = req.session.user._id;

      const {
        ops: [newStudio],
      } = await Studio.createStudio(newStudioData);
      // update user owner of the studio
      await User.updateUser(req.session.user._id, { studio: newStudio._id });

      req.session.studio = { ...newStudio };
      req.session.user.studio = newStudio._id;

      delete newStudio.createdAt;
      delete newStudio.updatedAt;

      res.status(201).json({ success: true, data: newStudio });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get a single studio from the DB
   * @returns {Object} - studio data
   */
  static async getSingleStudio(req, res, next) {
    try {
      const query = { ...req.body };

      const foundStudio = await Studio.getStudio(query);

      res.status(200).json({ success: true, data: foundStudio });
    } catch (error) {
      next(error);
    }
  }

  /**
  @desc Update a studio via query parameters - can contain .file
   */
  static async updateStudio(req, res, next) {
    try {
      const { _id: query } = req.query;

      const dataToUpdate = req.body;
      delete dataToUpdate._id;
      delete dataToUpdate.owner;

      let errorUploads;
      if (dataToUpdate.errorUploads) {
        errorUploads = dataToUpdate.errorUploads;
      }
      delete dataToUpdate.errorUploads;
      const { value: updatedStudio } = await Studio.updateStudio(
        query,
        dataToUpdate,
      );

      req.session.studio = { ...updatedStudio };

      res
        .status(200)
        .json({ success: true, data: updatedStudio, errorUploads });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudioController;
