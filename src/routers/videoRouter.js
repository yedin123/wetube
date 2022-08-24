import express from "express";
import { getEdit, postEdit, watch, deleteVideo, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();
 // upload가 위에 있어야됨 아님 id로 인식됨 / 근데 id에 숫자만오게 설정했으니까 상관없을지도
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload); 
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
export default videoRouter;