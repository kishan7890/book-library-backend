const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utills/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'book-library',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

module.exports = upload;
