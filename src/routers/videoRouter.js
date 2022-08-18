import express from "express";
import { edit, see, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();
videoRouter.get("/upload", upload); // upload가 위에 있어야됨 아님 id로 인식됨 / 근데 id에 숫자만오게 설정했으니까 상관없을지도
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
export default videoRouter;