exports.cleanBody = (body) => {
  delete body['appRole'];
  delete body['companyRole'];
  return body;
};
