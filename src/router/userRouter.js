import express from "express";
import { profile, edit, logout, remove } from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/remove", remove);
userRouter.get("/:id", profile);

export default userRouter;
