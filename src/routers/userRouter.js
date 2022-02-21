import express from "express";
import {
  profile,
  getEdit,
  postEdit,
  remove,
  start,
  finish,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  onlyLoggedInUser,
  onlyUnLoggedInUser,
  uploadAvatarUrl,
} from "../middlewares/middleware";
const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(onlyLoggedInUser)
  .get(getEdit)
  .post(uploadAvatarUrl.single("avatar"), postEdit);
userRouter.get("/remove", onlyLoggedInUser, remove);
userRouter.get("/start", onlyUnLoggedInUser, start);
userRouter.get("/finish", onlyUnLoggedInUser, finish);
userRouter
  .all(onlyLoggedInUser)
  .route("/changePassword")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/:id", profile);

export default userRouter;
