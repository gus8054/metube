import User from "../models/User";
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
  const video = await Video.findById(id).populate("author");
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("watch", { pageTitle: "Watch Video", video });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Video Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, hashtags },
    session: {
      user: { _id, videos },
    },
    file: { path: videoUrl },
  } = req;
  try {
    const video = await Video.create({
      title,
      author: _id,
      hashtags: Video.handleHashtags(hashtags),
      videoUrl,
    });
    videos.push(video._id);
    await User.findByIdAndUpdate(_id, { videos });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Video Upload",
      errorMessage: "ERROR",
    });
  }
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
    searchedVideo,
  } = req;
  const video = searchedVideo;
  return res.render("videoEdit", { pageTitle: "Video Edit", video });
};
//TODO: 본인확인
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, hashtags },
    session: {
      user: { _id },
    },
  } = req;
  await Video.findByIdAndUpdate(id, {
    title,
    hashtags: Video.handleHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const remove = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id, videos },
    },
  } = req;
  //DB에서 삭제
  await Video.findByIdAndDelete(id);
  //SESSION에서 삭제
  const isTHisVideo = (element) => String(element._id) === String(id);
  videos.splice(videos.findIndex(isTHisVideo), 1);
  await User.findByIdAndUpdate(_id, { videos });
  return res.redirect("/");
};
