const errorHandler = (error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || "Internal server error";

  const loggedIn =
    error.statusCode === 401 ? false : req.isAuthenticated?.() || false;

  res.status(status).json({
    error: true,
    message,
    loggedIn,
  });
};
export default errorHandler;
