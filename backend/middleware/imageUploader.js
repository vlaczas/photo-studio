const cloudinary = require('../configs/cloudinary');
const ErrorResponse = require('../utils/errorResponse');

const MAX_FILE_SIZE = 6000000;

async function uploadImage(req, res, next) {
  console.log(req.baseUrl);
  console.log(req.originalUrl);
  console.log(req.path);
  const avatarType = req.baseUrl.includes('studios') ? 'logo' : 'photo';
  // check the size
  if (req.file.size > MAX_FILE_SIZE) {
    return next(new ErrorResponse('Please upload a file less than 5MB', 400));
  }
  // check the type
  if (!req.file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse('Please upload a file with image format', 400)
    );
  }

  // create Base64 string to send
  const base64str = req.file.buffer.toString('base64');

  /**
   * * 1. base64 string
   * * 2. params
   * * then add to req the link to new file
   */
  try {
    const image = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${base64str}`,
      {
        folder: avatarType === 'logo' ? 'studiosLogos' : 'usersAvatars',
        tags: req.session.user._id,
        public_id: req.session.user._id
      }
    );
    req.body[avatarType] = image.secure_url;
  } catch (error) {
    console.log(error);
    next(new ErrorResponse('User unknown', 401));
  }

  next();
}

module.exports = uploadImage;
