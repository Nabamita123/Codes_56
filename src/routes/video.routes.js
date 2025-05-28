import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage,getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo } from "../controllers/video.controller.js";
import router from "./user.routes.js";
import multer from "multer";

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

export default router;