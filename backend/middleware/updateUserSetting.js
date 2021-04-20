const { comparePasswords, hashPassword } = require('./hashPassword');

async function updateUserSetting(req, res, next) {
  try {
    if (req.body.password && req.session.user.hasPassword) {
      await comparePasswords(req);
      req.body.password = await hashPassword(req.body.newPassword);
    } else if (req.body.newPassword) {
      req.body.password = await hashPassword(req.body.newPassword);
      req.body.hasPassword = true;
    }

    delete req.body.newPassword;
  } catch (err) {
    return next(err);
  }

  if (req.body.email) {
    req.body.deleteFields = { googleId: '' };
  }

  next();
}

module.exports = updateUserSetting;
