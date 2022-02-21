import express from "express";
import { home, search } from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  error,
} from "../controllers/userController";
import {
  onlyLoggedInUser,
  onlyUnLoggedInUser,
} from "../middlewares/middleware";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").all(onlyUnLoggedInUser).get(getJoin).post(postJoin);
globalRouter
  .route("/login")
  .all(onlyUnLoggedInUser)
  .get(getLogin)
  .post(postLogin);
globalRouter.get("/logout", onlyLoggedInUser, logout);
globalRouter.get("/search", search);
globalRouter.get("/error", error);

export default globalRouter;
