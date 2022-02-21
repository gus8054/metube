import express from "express";
import { all } from "express/lib/application";
import {
  watch,
  getUpload,
  postUpload,
  getEdit,
  postEdit,
  remove,
} from "../controllers/videoController";
import { onlyLoggedInUser } from "../middlewares/middleware";
const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(onlyLoggedInUser)
  .get(getUpload)
  .post(postUpload);
videoRouter.get("/:id", watch);
videoRouter
  .route("/:id/edit")
  .all(onlyLoggedInUser)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id/remove", onlyLoggedInUser, remove);

export default videoRouter;
