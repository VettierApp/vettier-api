const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretJwt } = require('../../../config');

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const validatePassword = async (receivedPassword, password) => {
  return await bcrypt.compare(receivedPassword, password);
};

export const jwtSigninToken = async (id, expireTime = 86400) => {
  return await jwt.sign({ id }, secretJwt, { expiresIn: expireTime });
};

const getJwtToken = (req) => {
  const { headers } = req;
  const token = headers.jwt_token;
  if (!token) {
    return false;
  }
  return token;
};

export const verifyJwtToken = (token) => {
  try {
    const validatedToken = jwt.verify(token, secretJwt);
    return validatedToken;
  } catch (error) {
    console.error(error);
  }
};

export const checkToken = async (req) => {
  try {
    const token = await getJwtToken(req);
    console.log(token);
    const decodedToken = !!token && verifyJwtToken(token);

    return { token, decodedToken };
  } catch (error) {
    console.error(error);
  }
};
