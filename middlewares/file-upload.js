const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

// POSSIBLE MIME TYPES PRODUCED BT FILE.MIMETYPE

const MIME_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// CONFIGUARTION OF MULTER

const fileUpload = multer({

  // MAX FILE SIZE IS 500KB

  limits: 5000000,

  //   DEFINE STORAGE

  storage: multer.diskStorage({

    // DEFINE WHERE FILES WILL BE SAVED

    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },

    // DEFINE WHAT NAME AND EXTENSION WILL BE GIVEN TO FILES

    filename: (req, file, cb) => {
      const ext = MIME_TYPE[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter:(req,file,cb)=>{

    // !! OPERATOR CONVERT UNDEFINED VALUE TO FALSE WHICH MEANS IF USER
    // SELECT FILE OTHER THAN IMAGE FILE THEN ISVALID WILL BE FALSE

    const isValid = !!MIME_TYPE[file.mimetype];

    const error = isValid ? null : new Error("Invalid mime type !!!");

    cb(error,isValid )
  }
});

module.exports = fileUpload;
