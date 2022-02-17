import express from "express";
import { watch, upload, edit, remove } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", watch);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/remove", remove);

export default videoRouter;
