/**
 * Media Controller - Stub
 * Media upload is now handled by the frontend
 */

const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * @desc    Placeholder for media upload (now handled by frontend)
 * @route   POST /api/media/upload
 * @access  Private/Admin
 */
const uploadMedia = asyncHandler(async (req, res) => {
  logger.info('Media upload request received - functionality moved to frontend');
  res.status(501).json({ 
    message: 'Media uploads are now handled directly by the frontend' 
  });
});

/**
 * @desc    Placeholder for multiple media upload (now handled by frontend)
 * @route   POST /api/media/upload-multiple
 * @access  Private/Admin
 */
const uploadMultipleMedia = asyncHandler(async (req, res) => {
  logger.info('Multiple media upload request received - functionality moved to frontend');
  res.status(501).json({ 
    message: 'Media uploads are now handled directly by the frontend' 
  });
});

module.exports = {
  uploadMedia,
  uploadMultipleMedia
};
