const createError = (message, statusCode) => {
  let err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = {
  createError,
};
