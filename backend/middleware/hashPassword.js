const crypt = require('bcrypt');
const ErrorResponse = require('../utils/errorResponse');

exports.hashPassword = async (password) => {
  try {
    const hashedPassword = await crypt.hash(
      password,
      Number(process.env.CRYPTO_SALT),
    );
    return hashedPassword;
  } catch (error) {
    throw new ErrorResponse('No password', 400);
  }
};

exports.comparePasswords = async (req) => {
  const result = await crypt.compare(
    req.body.password,
    req.session.user.password,
  );
  if (!result) {
    await req.session.destroy();
    throw new ErrorResponse('Incorrect password', 400);
  }
};
