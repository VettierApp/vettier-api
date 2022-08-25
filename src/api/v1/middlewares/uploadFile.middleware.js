import fs from 'fs';
const multer = require('multer');
const moment = require('moment');
const dir = '/uploads';
const path = require('path');

const verifyFolder = (req, subFolder) => {
  const { company } = req.params;
  let url = `${dir}/${company}/${subFolder}/`;
  req.params = { url: url };
  const baseUrl = path.join(__dirname + '../../' + url);
  if (!fs.existsSync(baseUrl)) fs.mkdirSync(baseUrl, { recursive: true });
  return baseUrl;
};

const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    const url = verifyFolder(req, file.fieldname);
    fn(null, url);
  },
  filename: (req, file, fn) => {
    let filename = moment().unix() + path.extname(file.originalname);
    fn(null, filename);
  }
});

export const uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, fn) => {
    if (!file) {
      return fn(null, false);
    } else if (!file.mimetype.includes('image') && file.fieldname === 'img') {
      req.params = { error_img: 'format-error' };
      req.params = { error_message: 'Accepted format: .png, .jpg, .jpeg' };
      fn(null, false);
    } else if (!file.mimetype.includes('pdf') && file.fieldname === 'pdf') {
      req.params = { error_pdf: 'format-error' };
      req.params = { error_message: 'Accepted format: .pdf' };
      fn(null, false);
    } else {
      return fn(null, true);
    }
  }
});
