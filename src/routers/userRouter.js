import express from "express";
import {
  profile,
  edit,
  logout,
  remove,
  start,
  finish,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/remove", remove);
userRouter.get("/start", start);
userRouter.get("/finish", finish);
userRouter.get("/:id", profile);

export default userRouter;
