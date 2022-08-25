export const sendError = (res, errorName) => {
  return res.status(errors[errorName].code).send(errors[errorName]);
};

const errors = {
  UNAUTHORIZED: {
    code: 401,
    error: {
      message: 'YOU ARE UNAUTHORIZED FOR THIS ACTION',
      detail: 'PLEASE VALID YOUR PERMISSION LEVELS WITH THE ADMIN'
    }
  },
  NOT_FOUND: {
    code: 404,
    error: {
      message: 'RECORD NOT FOUND',
      detail: 'PLEASE VALID YOUR DATA AND TRY IT AGAIN'
    }
  },
  BAD_REQUEST: {
    code: 400,
    error: {
      message: 'BAD REQUEST, TRY AGAIN',
      detail: 'YOU ARE DOING A BAD REQUEST'
    }
  },
  INTERNAL_ERROR: {
    code: 500,
    error: {
      message: 'AN INTERNAL ERROR HAVE OCCOUR',
      detail: 'PLEASE TRY AGAIN'
    }
  }
};
