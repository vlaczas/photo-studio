const ErrorResponse = require('../utils/errorResponse');

/**
 * @description return a middleware to protect users from changing account without their unbeknowst
 * @param {string} userRole - may be studio, admin or photographer
 * @default 'user'
 */

function protectUser(userRole = 'user') {
  return async (req, res, next) => {
    if (!req.session.user) {
      return next(new ErrorResponse('Unauthorized', 401));
    }

    const whatToChange = req.body._id || req.params._id || req.query._id;

    switch (userRole) {
      case 'user':
        if (whatToChange !== req.session.user._id) {
          return next(new ErrorResponse('Forbidden', 403));
        }
        break;
      case 'studio':
        if (req.session.user.role !== 'studio') {
          return next(new ErrorResponse('Forbidden', 403));
        }
        if (whatToChange !== req.session.user.studio) {
          return next(new ErrorResponse('Forbidden', 403));
        }
        break;
      default:
        break;
    }

    next();
  };
}

module.exports = protectUser;
