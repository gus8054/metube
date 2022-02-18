import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxlength: 20,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  meta: {
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    good: {
      type: Number,
      required: true,
      default: 0,
    },
    bad: {
      type: Number,
      required: true,
      default: 0,
    },
    date: { type: Date, default: Date.now },
  },
  hashtags: [String],
});

videoSchema.static("handleHashtags", (hashtags) => {
  return (hashtags = hashtags.split(",").map((item) => "#" + item.trim()));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;