import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {addComment, getComments,deleteComment} from "../controllers/comment.controller.js"
import { Router } from "express";

const router = Router();
router.route("/:videoId/post-comment").post( verifyJWT, addComment);
router.route("/:videoId/all-comments").get( getComments);
router.route("/delete/:commentId").delete(verifyJWT, deleteComment);


export default router;