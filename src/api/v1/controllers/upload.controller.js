import fs from 'fs';
const { sendError, getUploadUrl, getURLPath } = require('../helpers');

class FileUploadController {
  constructor() {
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async upload(req, res) {
    const { error_message, url } = req.params;

    if (error_message) return res.status(401).send(error_message);

    try {
      const imageUrl = getUploadUrl(req, url);
      return res.status(200).json({ data: imageUrl });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async update(req, res) {
    const { error_message, url } = req.params;

    if (error_message) return res.status(401).send(error_message);
    try {
      const oldPath = getURLPath(req);
      fs.unlinkSync(oldPath);
      const imageUrl = getUploadUrl(req, url);
      return res.status(200).json({ data: imageUrl });
    } catch (error) {
      return sendError(res, 'INTERNAL_ERROR');
    }
  }

  async delete(req, res) {
    try {
      const oldPath = getURLPath(req);
      fs.unlinkSync(oldPath);
      return res.status(200).json({ data: 'imageDeleted' });
    } catch (error) {
      return res.status(400).json({ error: 'error deleting image' });
    }
  }
}

module.exports = FileUploadController;
