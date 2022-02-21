import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ date: "desc" });
  return res.render("home", { pageTitle: "HOME", videos });
};
export const search = async (req, res) => {
  const {
    query: { keyword },
  } = req;
  const videos = await Video.find({
    title: {
      $regex: new RegExp(keyword, "i"),
    },
  });
  return res.render("search", { pageTitle: "Video Search", videos });
};
export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("watch", { pageTitle: "Watch Video", video });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Video Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, author, hashtags },
  } = req;
  try {
    await Video.create({
      title,
      author,
      hashtags: Video.handleHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Video Upload",
      errorMessage: error._message,
    });
  }
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("videoEdit", { pageTitle: "Video Edit", video });
};
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, author, hashtags },
  } = req;

  await Video.findByIdAndUpdate(id, {
    title,
    author,
    hashtags: Video.handleHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const remove = async (req, res) => {
  const {
    params: { id },
  } = req;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
