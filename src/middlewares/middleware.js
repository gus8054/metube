export const localMiddleware = (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.userLoggedIn = req.session.userLoggedIn;
  next();
};
