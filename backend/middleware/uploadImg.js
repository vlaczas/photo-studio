const cloudinary = require('../configs/cloudinary');
const ErrorResponse = require('../utils/errorResponse');

const MAX_FILE_SIZE = 6000000;

/**
 * @param {string} fieldInDBName - name of field to save to DB
 * @param {string} fieldName - name of folder in the Cloudinary
 * possible folder names:
 *
 * 'usersAvatars' = a folder with unique avatars of users
 *
 * 'studioLogos' = a folder with unique logos of studios
 *
 * @param {object} [options]- not required options
 * @param {boolean} options.isMultiple
 * @param {boolean} options.isUniqueName
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} options.quality
 * @param {string} options.crop
 * @returns middleware to Cloudinary upload
 */

function imageUploader(
  fieldInDBName,
  folderName,
  {
    isMultiple = false,
    isUniqueName = false,
    width = 500,
    height = 500,
    quality = 80,
    crop = 'scale',
  },
) {
  return async (req, res, next) => {
    // check for valid call
    if (!req.files) {
      next();
      return;
    }

    try {
      if (!fieldInDBName || !folderName) {
        throw new Error('invalid img upload call');
      }
      // check the size and the type
      req.files.forEach((img) => {
        if (img.size > MAX_FILE_SIZE || !img.mimetype.startsWith('image')) {
          throw new Error(
            'Image needs to be in image format and less then 5MB',
          );
        }
      });
    } catch (error) {
      next(new ErrorResponse(error.message, 400));
      return;
    }

    const clodinaryCalls = req.files.map((file) => {
      // create Base64 string to send
      const base64str = file.buffer.toString('base64');
      return cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64str}`,
        {
          folder: folderName,
          width,
          height,
          crop,
          quality,
          tags: req.session.user._id,
          public_id: isUniqueName ? req.session.user._id : undefined,
        },
      );
    });

    //* Do a Call
    const results = await Promise.allSettled(clodinaryCalls);

    //* Assign received links
    let imageLinks = [];
    req.body.errorUploads = 0;
    results.forEach((result) => {
      if (result.status === 'rejected') {
        imageLinks.push(null);
        req.body.errorUploads += 1;
      } else {
        imageLinks.push(result.value.secure_url);
      }
    });

    //* add urls to the body to upload them to DB
    if (!isMultiple) {
      [imageLinks] = imageLinks;
    }

    req.body[fieldInDBName] = imageLinks;

    next();
  };
}

module.exports = imageUploader;
