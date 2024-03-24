const cloudinary = require("cloudinary");
const multer = require("multer");
require("dotenv/config");

const helper = {};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//upload to cloudinary
helper.upload_get_url = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(image, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

helper.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-atif-" + Math.round(Math.random() * 1e9);
    console.log("filename", file.fieldname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

//   const upload = multer({ storage: storage });
helper.upload = multer({ storage: helper.storage });

helper.destroyFile = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .destroy(publicId)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
//====================== cloudinary and multer setup end

module.exports = helper;
