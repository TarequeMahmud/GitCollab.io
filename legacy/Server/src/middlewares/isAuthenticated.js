const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const authError = new Error("Unauthorized: Please log in.");
  authError.statusCode = 401;
  return next(authError);
};

export default isAuthenticated;
