import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo , getVideoById, getAllVideos, getUserVideos, updateVideo, deleteVideo,togglePublishVideo} from "../controllers/video.controller.js";
import { Router } from "express";

const router = Router();
router.route("/upload-video").post(verifyJWT,
    upload.fields([
        {
            name:"videoFile", maxCount: 1
        },
        {
            name:"thumbnail", maxCount:1
        }
    ]),
    uploadVideo
);
router.route("/:id").get(getVideoById);
router.route("/").get(getAllVideos);
router.route("/user/:userId").get(getUserVideos);
router.route("/update/:videoId").put(verifyJWT, updateVideo)
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo)
router.route("/toggle-publish/:videoId").patch( verifyJWT, togglePublishVideo);


export default router;