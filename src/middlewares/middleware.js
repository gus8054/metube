import multer from "multer";
import Video from "../models/Video";

export const localMiddleware = (req, res, next) => {
  res.locals.user = req.session.user || {};
  res.locals.userLoggedIn = Boolean(req.session.userLoggedIn);
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
export const isAuthorUser = async (req, res, next) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id).populate("author");
  if (!video) {
    return res.status(404).render("404");
  }
  if (String(video.author._id) !== String(_id)) {
    return res.redirect(`/videos/${id}`);
  }
  req.searchedVideo = video;
  next();
};
export const uploadAvatarUrl = multer({ dest: "uploads/" });
