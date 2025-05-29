import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createPlaylist,getUserPlaylists, addVideoToPlaylist,removeVideoFromPlaylist, deletePlaylist} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/").get( getUserPlaylists);
router.route("/:playlistId/add-videos").post(addVideoToPlaylist);
router.route("/:playlistId/remove-videos/:videoId").delete(removeVideoFromPlaylist);
router.route("/delete/:playlistId").delete(deletePlaylist);

export default router;
