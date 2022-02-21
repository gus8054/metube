import multer from "multer";

export const localMiddleware = (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.userLoggedIn = req.session.userLoggedIn;
  next();
};

export const onlyLoggedInUser = (req, res, next) => {
  if (!req.session.userLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

export const onlyUnLoggedInUser = (req, res, next) => {
  if (req.session.userLoggedIn) {
    return res.redirect("/");
  }
  next();
};

export const uploadAvatarUrl = multer({ dest: "uploads/" });
