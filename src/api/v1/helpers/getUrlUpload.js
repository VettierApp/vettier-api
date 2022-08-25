const path = require('path');

export const getUploadUrl = (req, url) => {
  const url_base = req.protocol + '://' + req.get('host');
  let imageUrl = '';
  if (req.file !== undefined && req.file.filename && url)
    imageUrl = url_base + '/api/v1' + url + req.file.filename;

  return imageUrl;
};

export const getURLPath = (req) => {
  const pathOld = req.body.oldUrl.split('uploads');
  const url = path.resolve(__dirname + '../' + `../uploads${pathOld[1]}`);
  return url;
};
