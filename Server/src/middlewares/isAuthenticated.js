const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ loggedIn: false, message: "Unauthorized: Please log in." });
};

export default isAuthenticated;
