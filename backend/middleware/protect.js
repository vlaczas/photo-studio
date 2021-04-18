const ErrorResponse = require('../utils/errorResponse');

function protectUser(req, res, next) {
  if (!req.session.user) {
    return next(new ErrorResponse('Unauthorized', 401));
  }

  const whomToChange = req.body._id || req.params._id || req.query._id;
  if (whomToChange !== req.session.user._id) {
    return next(new ErrorResponse('Forbidden', 403));
  }

  next();
}

module.exports = protectUser;
