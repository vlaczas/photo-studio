const Google = require('../configs/google');
const ErrorResponse = require('../utils/errorResponse');

async function verify(req, res, next) {
  if (!req.query.token) {
    return next();
  }

  try {
    const ticket = await Google.verifyIdToken({
      idToken: req.query.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const {
      email,
      given_name: firstName,
      family_name: lastName,
      picture: photo,
      sub: googleId,
    } = payload;

    req.body = {
      email,
      firstName,
      lastName,
      photo,
      googleId,
      isEmailVerified: true,
    };

    next();
  } catch (error) {
    console.log(error.message);
    next(new ErrorResponse('Something with google login', 500));
  }
}

module.exports = verify;
