const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars");
  },
  filename: function (req, file, cb) {
    req.filename = `${Date.now()}${path.extname(file.originalname)}`
    cb(null, req.filename);
  },
});

module.exports = upload = multer({
  storage,
});
